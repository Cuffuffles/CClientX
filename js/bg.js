chrome.webRequest.onBeforeRequest.addListener(() => {
    return {
      redirectUrl : "https://i.imgur.com/osHufNd.png"
    };
    }, {
    urls : ["https://krunker.io/img/logo_2.png"]
    }, ["blocking"]);