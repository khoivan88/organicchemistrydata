// This file has to be included after jQuery tag
// Ref: https://css-tricks.com/simple-social-sharing-links/

setShareLinks();

function socialWindow(url) {
  var left = (screen.width - 570) / 2;
  var top = (screen.height - 570) / 2;
  // var params = "menubar=no,toolbar=no,status=no,width=570,height=570,top=" + top + ",left=" + left;

  // Setting 'params' to an empty string will launch
  // content in a new tab or window rather than a pop-up.
  params = "";

  window.open(url,"NewWindow",params);
}

function getShareInfo () {
  let pageUrl = encodeURIComponent(document.URL);
  let tweet = encodeURIComponent($("meta[property='og:description']").attr("content"));
  // console.log(`pageUrl is ${pageUrl}`)
  // console.log(`tweet is ${tweet}`)
  // console.log(`typeof tweet is ${typeof tweet}`)
  return [pageUrl, tweet]
}

function setShareLinks() {
  // console.log('Share to Social Media Button JavaScript!')

  $(".social-share.facebook").on('click', function () {
    let [pageUrl, tweet] = getShareInfo()
    url = 'https://www.facebook.com/sharer.php?u=' + pageUrl
    socialWindow(url)
  });

  $(".social-share.twitter").on('click', function () {
    // console.log(`pageUrl is ${pageUrl}`)
    let [pageUrl, tweet] = getShareInfo()
    let url = '';
    if (tweet !== 'undefined') { // 'tweet' is of type string
      url = 'https://twitter.com/intent/tweet?url=' + pageUrl + '&text=' + tweet;
    }
    else {
      url = 'https://twitter.com/intent/tweet?url=' + pageUrl
    }
    socialWindow(url);
  });

  $(".social-share.linkedin").on('click', function () {
    let [pageUrl, tweet] = getShareInfo()
    url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + pageUrl;
    socialWindow(url);
  })
}
