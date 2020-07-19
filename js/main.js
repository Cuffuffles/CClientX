const gui = require("nw.gui");
const https = require("follow-redirects").https;
const semver = require("semver");
const fs = require("fs");
const child_process = require("child_process");
const $ = (jQuery = require("jquery"));
const rpclient = require("discord-rpc");
const rpc = new rpclient.Client({ transport: "ipc" });
const clientId = "692917532105113611";
const io = require("socket.io")();
var gameWindow = null,
  splashWindow = null;
var versionNum = "1.1.5";
io.listen(8081);

function createGameWindow() {
  gui.Window.open("https://krunker.io", { inject_js_start: "./js/bundle.js", show: false }, (win) => {
    gameWindow = win;
    gameWindow.enterFullscreen();
    gameWindow.on("enter-fullscreen", () => {
      gameWindow.show();
      splashWindow.close();
    });
    createShortcuts();
    io.once("connection", (socket) => {
      socket.once("preloaded", () => {
        initRPC();
      });
    });
    io.on("connection", (socket) => {
      socket.on("preloaded", () => {
        createListeners();
      });
    });
    win.on("new-win-policy", function (frame, url, policy) {
      if (!url) return;
      if (url.startsWith("https://twitch.tv/") || url.startsWith("https://www.twitch.tv") || url.startsWith("https://www.youtube")) {
        policy.ignore();
        nw.Shell.openExternal(url);
        return;
      } else {
        policy.setNewWindowManifest({
          inject_js_start: "./js/socialBundle.js",
          width: Math.round(screen.width * 0.75),
          height: Math.round(screen.height * 0.9),
          position: "center",
        });
        policy.forceNewWindow();
      }
    });
  });
}

function initRPC() {
  browserLog("RPC init");
  rpc.login({ clientId }).catch(console.error);
  rpc.on("ready", () => {
    setTimeout(setActivity, 3000);
    setInterval(setActivity, 15e3);
  });
}

async function setActivity() {
  let url = gameWindow.window.location.href;
  let game = gameWindow.window.getGameActivity();
  if (game.id == null) return;
  let timeLeft = Math.floor(Date.now() / 1000) + game.time;
  let matchString = game.mode + " on " + game.map;
  rpc.setActivity({
    details: matchString,
    //state: playerString,
    largeImageKey: "main",
    largeImageText: game.user,
    endTimestamp: timeLeft,
  });
}

function browserLog(string) {
  gameWindow.window.console.log(string);
}

function createListeners() {
  browserLog("listen loaded");
  let browser = gameWindow.window;
  browser.menuExit.addEventListener("click", () => {
    gameWindow.close();
  });
  browser.clientVersion.addEventListener("click", () => {
    nw.Shell.openExternal("https://discord.gg/5ZMvrGT");
  });
}

function createShortcuts() {
  let F4 = {
      key: "F4",
      active: function () {
        gameWindow.window.location = "https://krunker.io";
      },
    },
    F5 = {
      key: "F5",
      active: function () {
        gameWindow.reload();
      },
    },
    F11 = {
      key: "F11",
      active: toggleFS,
    };
  let shortcutF4 = new gui.Shortcut(F4),
    shortcutF5 = new gui.Shortcut(F5),
    shortcutF11 = new gui.Shortcut(F11);
  gui.App.registerGlobalHotKey(shortcutF4);
  gui.App.registerGlobalHotKey(shortcutF5);
  gui.App.registerGlobalHotKey(shortcutF11);
}

function toggleFS() {
  gameWindow.toggleFullscreen();
}

function restartApp() {
  var child = child_process.spawn(process.execPath, [], {
    detached: true,
  });
  child.unref();
  gui.App.quit();
}

function createSplash() {
  gui.Window.open(
    "./html/splash.html",
    {
      width: 700,
      height: 300,
      frame: false,
      position: "center",
      always_on_top: true,
    },
    (win) => {
      splashWindow = win;
      //Insert updater code here
      $.get("https://api.github.com/repos/Cuffuffles/CClientX/releases/latest", function (data) {
        var newVersion = data.tag_name;
        if (semver.gt(newVersion, versionNum)) {
          //update available
          var dlPath = nw.App.getStartPath();
          //splashWindow.window.splashImage.src = "../img/updating.png";
          splashWindow.window.bar.style.width = "0%";
          splashWindow.window.dlProgress.style.display = "block";
          $.get("https://api.github.com/repos/Cuffuffles/CClientX/releases/latest", function (data) {
            const pUrl = data.assets[0].browser_download_url;
            var req = https.get(pUrl, function (res) {
              var fileSize = res.headers["content-length"];
              res.setEncoding("binary");
              var a = "";
              res.on("data", function (chunk) {
                a += chunk;
                splashWindow.window.bar.style.width = Math.round((100 * a.length) / fileSize) + "%";
              });
              res.on("end", function () {
                fs.writeFile(dlPath + "/package.nw", a, "binary", (err) => {
                  if (err) console.log(err);
                  restartApp();
                });
              });
            });
          }).on("error", () => {
            restartApp();
          });
        } else {
          createGameWindow();
        }
      });
    }
  );
}

createSplash();
