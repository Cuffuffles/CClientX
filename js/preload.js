const { ipcRenderer } = require("electron");
const { CFunctions } = require("./CFunctions");
let CF = new CFunctions();

document.addEventListener("DOMContentLoaded", () => {
    addExit();
});

function addExit() {
    var buttonHtml = "<div class='button small buttonR' id='menuExit' onmouseenter='playTick()'>X</div>";
    subLogoButtons.insertAdjacentHTML("beforeend", buttonHtml);
    subLogoButtons.style.width = "860px";
    menuExit.addEventListener('click', () => { ipcRenderer.send("close"); });
}