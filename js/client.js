const $ = (jQuery = require("jquery"));
const io = require("socket.io-client");
const socket = io("http://localhost:8081");
var versionNum = "1.1.6";
var weaponID = {
  0: "ak",
  1: "awp",
  2: "smg",
  3: "lmg",
  4: "shot",
  5: "rev",
  6: "semi",
  7: "rpg",
  11: "bow",
  12: "famas",
};

function init() {
  console.log("init");
  document.addEventListener("pointerlockchange", () => newEnterGame());
  initLocalStorage();
  addExit();
  watermark();
  donateButton();
  fixLinks();
  initMenus();
  mainLogoImage();
  profileJoin();

  //Tell main we're done with preload
  socket.emit("preloaded");
  socket.close();
}

function profileJoin() {
  let btn = document.getElementById("menuBtnJoin")
  btn.onclick = function() {
    navigator.clipboard.readText()
      .then(text => {
      if(text.includes("krunker.io/social.html?p=profile&q=")) {
        window.open(text);
      } else if(text.includes("krunker.io/?game=")) {
        window.location = text;
      } else {
        openJoinWindow();
      }
    });
  }
}

function mainLogoImage() {
  if (getCXSettings("mainLogo") === null || getCXSettings("mainLogo") == "") setCXSettings("mainLogo", "unchecked");
  if (getCXSettings("mainLogo") === "unchecked") {
    mainLogo.src = "https://i.imgur.com/osHufNd.png";
  } else if (getCXSettings("mainLogo") === "checked") {
    mainLogo.src = "/img/logo_4.png";
  }
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
  return getGameActivity().class.index;
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
      logocheck.addEventListener("click", () => {
        logoToggle();
      });
    }, 5);
    var menuHtml = '<div class="setHed">CClientX Settings</div>';
    menuHtml +=
      '<div class="settName" id="logo_div" style="display:block">Restore Krunker Logo<label class="switch"><input type="checkbox" id="logocheck" ' +
      getCXSettings("mainLogo") +
      '><span class="slider"></span></label></div>';
    return menuHtml;
  };
}

function logoToggle() {
  switch (getCXSettings("mainLogo")) {
    case "unchecked":
      setCXSettings("mainLogo", "checked");
      break;
    default:
      setCXSettings("mainLogo", "unchecked");
      break;
  }
  mainLogoImage();
}

function newEnterGame() {
  if (document.pointerLockElement !== null) {
    if (getCXSettings("scale") == "checked") {
      sensCalc();
      setTimeout(() => {
        setSens(getClassIndex());
      }, 100);
    }
  } else {
    //pointer lock exit
  }
}

function setSens(index) {
  setSetting("aimSensitivityX", getCXSettings(weaponID[index] + "X"));
  setSetting("aimSensitivityY", getCXSettings(weaponID[index] + "Y"));
  console.log("Class index " + index + " sens set");
}

function sensCalc() {
  if (getCXSettings("scale") === "unchecked") return;
  if (localStorage.getItem("kro_setngss_fov") === null) localStorage.setItem("kro_setngss_fov", "70");
  if (localStorage.getItem("kro_setngss_sensitivityX") === null) localStorage.setItem("kro_setngss_sensitivityX", "1");
  if (localStorage.getItem("kro_setngss_sensitivityY") === null) localStorage.setItem("kro_setngss_sensitivityY", "1");
  var fov = localStorage.getItem("kro_setngss_fov");
  var hipSensX = localStorage.getItem("kro_setngss_sensitivityX");
  var hipSensY = localStorage.getItem("kro_setngss_sensitivityY");
  var distance = getCXSettings("relAds");
  var width = $(window).width();
  var height = $(window).height();
  if (!(localStorage.getItem("kro_setngss_aspectRatio") === null || localStorage.getItem("kro_setngss_aspectRatio") == "")) {
    var aspectString = localStorage.getItem("kro_setngss_aspectRatio").split("x");
    if (Number.isFinite(parseInt(aspectString[0])) && Number.isFinite(parseInt(aspectString[1]))) {
      width = aspectString[0];
      height = aspectString[1];
    }
  }
  console.log(width);
  console.log(height);
  var adsScale = {
    ak: 1.6,
    awp: 2.7,
    smg: 1.65,
    lmg: 1.3,
    shot: 1.25,
    rev: 1.4,
    semi: 2.1,
    rpg: 1.5,
    bow: 1.4,
    famas: 1.5,
  };
  var adsFov = {
    ak: fov / adsScale.ak,
    awp: fov / adsScale.awp,
    smg: fov / adsScale.smg,
    lmg: fov / adsScale.lmg,
    shot: fov / adsScale.shot,
    rev: fov / adsScale.rev,
    semi: fov / adsScale.semi,
    rpg: fov / adsScale.rpg,
    bow: fov / adsScale.bow,
    famas: fov / adsScale.famas,
  };

  var vFovRad = fov * (Math.PI / 180);
  var hFovRad = 2 * Math.atan((Math.tan(vFovRad / 2) * width) / height);

  $.each(adsFov, (index, value) => {
    var adsVRad = value * (Math.PI / 180);
    var adsHRad = 2 * Math.atan((Math.tan(adsVRad / 2) * width) / height);
    var hip2adsX, hip2adsY;
    if (distance === "0") {
      hip2adsX = hipSensX * (Math.tan(adsHRad / 2) / Math.tan(hFovRad / 2));
      hip2adsY = hipSensY * (Math.tan(adsHRad / 2) / Math.tan(hFovRad / 2));
    } else {
      hip2adsX = hipSensX * (Math.atan((distance / 100) * Math.tan(adsHRad / 2)) / Math.atan((distance / 100) * Math.tan(hFovRad / 2)));
      hip2adsY = hipSensY * (Math.atan((distance / 100) * Math.tan(adsHRad / 2)) / Math.atan((distance / 100) * Math.tan(hFovRad / 2)));
    }

    var adsSensX = adsScale[index] * hip2adsX;
    var adsSensY = adsScale[index] * hip2adsY;
    console.log(index + ": " + adsSensX);
    console.log(index + ": " + adsSensY);
    setCXSettings(index + "X", adsSensX);
    setCXSettings(index + "Y", adsSensY);
  });
}

function setRelative(value) {
  value = parseFloat(value);
  if (!Number.isFinite(value)) value = 0;
  if (value > 100) value = 100;
  if (value < 0) value = 0;
  setCXSettings("relAds", value);
  document.getElementById("slid_relAds").value = value;
  document.getElementById("box_relAds").value = value;
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
