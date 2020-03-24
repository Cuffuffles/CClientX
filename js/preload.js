const { ipcRenderer } = require("electron");
const { CFunctions } = require("./CFunctions");
let CF = new CFunctions();

ipcRenderer.on('exitPointerLock', () => {
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    document.exitPointerLock();
});

document.addEventListener("DOMContentLoaded", () => {
    addExit();
    watermark();
    CF.fixImport();
    CF.fixLinks();
});

function addExit() {
    var buttonHtml = "<div class='button small buttonR' id='menuExit' onmouseenter='playTick()'>X</div>";
    subLogoButtons.insertAdjacentHTML("beforeend", buttonHtml);
    subLogoButtons.style.width = "860px";
    menuExit.addEventListener("click", () => { ipcRenderer.send("close"); });
}

function watermark() {
    mapInfoHolder.insertAdjacentHTML("beforeend", "<div id='clientVersion' style='font-size: 15px; color: #000'></div>");
    clientVersion.innerHTML = "<a style='color: #000'>CClientX</a>";
    clientVersion.addEventListener("click", () => { ipcRenderer.send("openDiscord"); });
}