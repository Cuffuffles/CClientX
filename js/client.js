const io = require("socket.io-client");
const socket = io("http://localhost:8081");
var versionNum = "1.0.3";

function init() {
    console.log("init");
    addExit();
    watermark();
    fixLinks();

    //Tell main we're done with preload
    socket.emit("preloaded");
    socket.close();
}


function addExit() {
    var buttonHtml = "<div class='button small buttonR' id='menuExit' onmouseenter='playTick()'>X</div>";
    subLogoButtons.insertAdjacentHTML("beforeend", buttonHtml);
    subLogoButtons.style.width = "860px";
}

function watermark() {
    mapInfoHolder.insertAdjacentHTML("beforeend", "<div id='clientVersion' style='font-size: 15px; color: #000'></div>");
    clientVersion.innerHTML = "<a style='color: #000'>CClientX " + versionNum + "</a>";
}

function fixLinks() {
    $(document).on('click', 'a[href^="/social"]', function(event) {
        event.preventDefault();
        window.open(this.href);
    });
    $(document).on('click', 'a[href^="/viewer"]', function(event) {
        event.preventDefault();
        window.open(this.href);
    });
}

function setCXSettings(key, value) {
    localStorage.setItem('cx' + key, value);
}

function getCXSettings(key) {
    return localStorage.getItem('cx' + key);
}

function getClassIndex() {
    return localStorage.getItem('classindex');
}

function isDefined() {
    if(typeof windows !== 'undefined' && typeof $ !== 'undefined') {
        init();
    } else {
        setTimeout(() => {
            isDefined();
        }, 100);
    }
};
isDefined();