chrome.webRequest.onBeforeRequest.addListener(
  () => {
    return {
      redirectUrl: "https://i.imgur.com/xM8tYA4.png",
    };
  },
  {
    urls: ["*://*.krunker.io/img/logo_2.png"],
  },
  ["blocking"]
);
