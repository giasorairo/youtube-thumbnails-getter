/** 動画の id を取得する処理 */
const getVideoId = (url) => {
  const { search } = new URL(url);
  const params = new URLSearchParams(search);
  if (params.has('v')) {
    return params.get('v');
  }
  return '';
}

/**
 * サムネイルの url を作成する関数
 * 
 * default: 標準クオリティのサムネイル(120x90)
 * mqdefault: 中クオリティのサムネイル(320x180)
 * hqdefault: 高クオリティのサムネイル(480x360)
 * sddefault: HQ動画の標準クオリティのサムネイル(640x480)
 * maxresdefault: FULLHDのクオリティのサムネイル(1920x1080)
 */
const getThumbnailUrl = (videoId, thumbnailType) => {
  if (videoId
  && thumbnailType === 'default'
  || thumbnailType === 'mqdefault'
  || thumbnailType === 'hqdefault'
  || thumbnailType === 'sddefault'
  || thumbnailType === 'maxresdefault') {
    return `https://img.youtube.com/vi/${videoId}/${thumbnailType}.jpg`;
  }
  return '';
};

/**
 * DOM に thumbnail を表示する関数
 * 
 * elementId 要素のid
 * thumbnailUrl サムネイルのURL
 */
const displayThumbnail = (elementId, thumbnailUrl) => {
  const imgElement = window.document.getElementById(elementId);
  if (imgElement) {
    imgElement.setAttribute('src', thumbnailUrl);
  }
}

const download = (imageUrl, videoId) => {
  const downloadButton = document.querySelector('.download-button');
  if (!downloadButton) {
    return;
  }

  const handleDownload = () => {
    const anchor = document.createElement('a');
    anchor.href = imageUrl;
    // NOTE: よくわからんけどなぜかここでしているファイル名でダウンロードされない
    anchor.download = `${videoId}.jpg`;
    anchor.click();
    anchor.remove();
  };
  downloadButton.addEventListener('click', handleDownload);
};

/** didmount */
window.addEventListener('load', () => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const { url } = tabs[0];
    const videoId = getVideoId(url);
    const thumbnailUrl = getThumbnailUrl(videoId, 'hqdefault');
    displayThumbnail('youtube-thumbnail-getter-thumbnail-img', thumbnailUrl);

    download(thumbnailUrl, videoId);
  
    console.log('url : ', url);
    console.log('videoId : ', videoId);
    console.log('thumbnailUrl : ', thumbnailUrl);
  });
});
