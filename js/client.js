const $ = (jQuery = require("jquery"));
const io = require("socket.io-client");
const socket = io("http://localhost:8081");
var versionNum = "1.1.1";

function init() {
  console.log("init");
  document.addEventListener("pointerlockchange", () => newEnterGame());
  initLocalStorage();
  addExit();
  watermark();
  donateButton();
  fixLinks();
  initMenus();

  //Tell main we're done with preload
  socket.emit("preloaded");
  socket.close();
}

function fixLinks() {
  $(document).on("click", 'a[href^="/viewer"]', function (event) {
    event.preventDefault();
    window.open(this.href);
  });
}

function addExit() {
  var buttonHtml = "<div class='button small buttonR' id='menuExit' onmouseenter='playTick()'>X</div>";
  subLogoButtons.insertAdjacentHTML("beforeend", buttonHtml);
  subLogoButtons.style.width = "860px";
}

function donateButton() {
  var menuRight = document.getElementsByClassName("headerBarRight")[0];
  var buttonHtml = '<div class="button" id="donate" onclick="window.open(\'https://krunker.io/social.html#donate\')" onmouseenter="playTick()">Donate KR</div>';
  menuRight.insertAdjacentHTML("afterbegin", buttonHtml);
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
  localStorage.setItem("cx" + key, value);
}

function getCXSettings(key) {
  return localStorage.getItem("cx" + key);
}

function getClassIndex() {
  return localStorage.getItem("classindex");
}

function initLocalStorage() {
  if (getCXSettings("scale") === null) setCXSettings("scale", "unchecked");
  if (getCXSettings("relAds") === null) setCXSettings("relAds", 0);
}

function initMenus() {
  windows[0].getCSettings = () => {
    setTimeout(() => {
      var divList = menuWindow.getElementsByClassName("settName");
      var controller = false;
      $.each(divList, (index, value) => {
        var divHead = value.innerHTML;
        if (divHead.startsWith("X Sensitivity") && !controller) {
          var scaleSwitch =
            '<div class="settName" id="scaleBool_div" style="display:block">ADS Sensitivity Scaling<label class="switch"><input type="checkbox" id="scaleToggle" ' +
            getCXSettings("scale") +
            '><span class="slider"></span></label></div>';
          value.insertAdjacentHTML("afterbegin", scaleSwitch);
          scaleToggle.addEventListener("click", () => scaleSwitchToggle());
        }
        if (divHead.startsWith("Aim X Sensitivity") && getCXSettings("scale") == "checked" && !controller) {
          value.innerHTML =
            '<div class="settName" id="ak_div" style="display:block">Relative ADS Scale <input type="number" class="sliderVal" id="slid_relAds" min="0" max="100" value="' +
            getCXSettings("relAds") +
            '" style="border-width:0px"><div class="slidecontainer"><input type="range" id="box_relAds" min="0" max="100" step="1" value="' +
            getCXSettings("relAds") +
            '" class="sliderM"></div></div>';
          slid_relAds.addEventListener("input", () => {
            setRelative(slid_relAds.value);
          });
          box_relAds.addEventListener("input", () => {
            setRelative(box_relAds.value);
          });
        }
        if (divHead.startsWith("Aim Y Sensitivity") && getCXSettings("scale") == "checked" && !controller) {
          value.innerHTML = "";
        }

        if (divHead.startsWith("Invert Y-Axis ")) {
          controller = true;
        }
      });
    }, 5);
    return "";
  };
}

function newEnterGame() {
  if (document.pointerLockElement !== null) {
    setTimeout(() => {
      console.log("enter game");
    }, 100);
  } else {
    //pointer lock exit
  }
}

function setRelative(value) {
  value = parseFloat(value);
  if (value > 100) value = 100;
  if (value < 0) value = 0;
  setCXSettings("relAds", value);
  document.getElementById("slid_relAds").value = value;
  document.getElementById("box_relAds").value = value;
  //sensCalc();
}

function scaleSwitchToggle() {
  switch (getCXSettings("scale")) {
    case "unchecked":
      setCXSettings("scale", "checked");
      break;
    default:
      setCXSettings("scale", "unchecked");
      break;
  }
  updateWindow(1);
}

function isDefined() {
  if (typeof windows !== "undefined") {
    init();
  } else {
    setTimeout(() => {
      isDefined();
    }, 100);
  }
}
isDefined();
