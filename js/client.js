const io = require("socket.io-client");
const socket = io("http://localhost:8081");
var versionNum = "1.0.9";

function init() {
    console.log("init");
    addExit();
    watermark();
    donateButton();

    //Tell main we're done with preload
    socket.emit("preloaded");
    socket.close();
}


function addExit() {
    var buttonHtml = "<div class='button small buttonR' id='menuExit' onmouseenter='playTick()'>X</div>";
    subLogoButtons.insertAdjacentHTML("beforeend", buttonHtml);
    subLogoButtons.style.width = "860px";
}

function donateButton() {
    var menuRight = document.getElementsByClassName("headerBarRight")[0];
    var buttonHtml = '<div class="button" id="donate" onclick="window.open(\'https://krunker.io/social.html#donate\')" onmouseenter="playTick()">Donate KR</div>';
    menuRight.insertAdjacentHTML('afterbegin', buttonHtml);
    menuFPSDisplay.style.width = "75px";
    menuFPSDisplay.style.textAlign = "right";
    donate.style.paddingTop = "5px";
    donate.style.paddingBottom = "13px";
    donate.style.paddingLeft = "22px";
    donate.style.paddingRight = "22px";
    donate.style.fontSize = "16px";
    donate.style.marginLeft = "3px";
    donate.style.marginRight = "3px";
    donate.style.marginTop = "5px";
    menuRegionLabel.style.marginLeft = "40px";
}

function watermark() {
    mapInfoHolder.insertAdjacentHTML("beforeend", "<div id='clientVersion' style='font-size: 15px; color: #000'></div>");
    clientVersion.innerHTML = "<a style='color: #000'>CClientX " + versionNum + "</a>";
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
    if(typeof windows !== 'undefined') {
        init();
    } else {
        setTimeout(() => {
            isDefined();
        }, 100);
    }
};
isDefined();