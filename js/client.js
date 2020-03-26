const io = require("socket.io-client");
const socket = io("http://localhost:8081");
var versionNum = "1.0.0";
var _rAF;

function init() {
    console.log("init");
    _rAF = window.requestAnimFrame;
    addExit();
    watermark();
    fixLinks();
    initFpsLimiter();
    initWindows();

    //Tell main we're done with preload
    socket.emit("preloaded");
    socket.close();
}

function initFpsLimiter() {
    if(getCXSettings('fpsLimit') === null || !(Number.isInteger(Number.parseInt(getCXSettings('fpsLimit'))))) setCXSettings('fpsLimit', '0');
    if(getCXSettings('fpsLimit') < 10 && getCXSettings('fpsLimit') != 0) setCXSettings('fpsLimit', '10');
    fpsLimit();
}

function updateFps(fps) {
    fps = parseInt(fps);
    if(fps > 1000) fps = 1000;
    if(fps < 10 && fps != 0) fps = 10;
    if(!(Number.isInteger(fps))) fps = 0;
    setCXSettings('fpsLimit', fps);
    document.getElementById("slid_fps").value = fps;
    document.getElementById("box_fps").value = fps;
    fpsLimit();
}

function fpsLimit() {
    if(getCXSettings('fpsLimit') === null || !(Number.isInteger(Number.parseInt(getCXSettings('fpsLimit'))))) setCXSettings('fpsLimit', '0');
    if(getCXSettings('fpsLimit') < 10 && getCXSettings('fpsLimit') != 0) setCXSettings('fpsLimit', '10');
    var start = 0;
    var fps = getCXSettings('fpsLimit');
    if(fps == '0') {
        console.log('no limit');
        window.requestAnimFrame = _rAF;
    } else {
        console.log('fps capped at: ' + fps);
        var fpsInterval = 1000 / fps;
        window.requestAnimFrame = function(...args) {
            for (var i = 1e99; i > 0; i--) {
                if (window.performance.now() - start > fpsInterval) {
                    break;
                }
            }
            start = window.performance.now();
            _rAF(args[0]);
        }
    }
}

function initWindows() {
    var _settingsGen = windows[0].getCSettings;
    windows[0].getCSettings = function() {
        var tempHTML = _settingsGen();
        setTimeout(() => {
            var divList = menuWindow.getElementsByClassName('settName');
            $.each(divList, (index, value) => {
                var tempString = value.innerHTML;
                if(tempString.startsWith('Frame Cap')) {
                    value.innerHTML = '<div class="settName" id="fps_div" style="display:block">FPS Limit<input type="number" class="sliderVal" id="slid_fps" min="0" max="1000" value="' + getCXSettings('fpsLimit') + '" style="border-width:0px"><div class="slidecontainer"><input type="range" id="box_fps" min="0" max="1000" step="1" value="' + getCXSettings('fpsLimit') + '" class="sliderM"></div></div>';
                }
            });
            slid_fps.addEventListener('input', () => { updateFps(slid_fps.value); });
            box_fps.addEventListener('input', () => { updateFps(box_fps.value); });
        }, 10);
        return tempHTML;
    }
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