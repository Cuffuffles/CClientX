chrome.webRequest.onBeforeRequest.addListener(() => {
    return {
      redirectUrl : "https://i.imgur.com/osHufNd.png"
    };
    }, {
    urls : ["*://*.krunker.io/img/logo_2.png"]
    }, ["blocking"]);