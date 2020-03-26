const gui = require("nw.gui");
const io = require("socket.io")();
var gameWindow = null, splashWindow = null;
io.listen(8081);

function createGameWindow() {
    gui.Window.open("https://krunker.io", { "inject_js_start" : "./js/bundle.js", "show" : false }, win => {
        gameWindow = win;
        gameWindow.enterFullscreen();
        gameWindow.on("enter-fullscreen", () => {
            gameWindow.show();
            splashWindow.close();
        });
        createShortcuts();
        io.on("connection", socket => {
            socket.on("preloaded", () => {
                createListeners();
            });
        });
        win.on('new-win-policy', function(frame, url, policy) {
            if(!url) return;
            if(url.startsWith('https://twitch.tv/') || url.startsWith('https://www.twitch.tv') || url.startsWith('https://www.youtube')) {
                policy.ignore();
                nw.Shell.openExternal(url);
                return;
            } else {
                policy.setNewWindowManifest({"position" : "center", "width": Math.round(screen.width * 0.75), "height": Math.round(screen.height * 0.9)});
                policy.forceNewWindow();
            }
        });
    });  
}

function browserLog(string) {
    gameWindow.window.console.log(string);
}

function createListeners() {
    browserLog("listen loaded");
    let browser = gameWindow.window;
    browser.menuExit.addEventListener('click', () => { gameWindow.close(); });
    browser.clientVersion.addEventListener('click', () => { nw.Shell.openExternal("https://discord.gg/5ZMvrGT")} );
}

function createShortcuts() {
    let F4 = {
        key : "F4",
        active : function() {
            gameWindow.window.location = "https://krunker.io";
        }
    },
    F5 = {
        key : "F5",
        active : function() {
            gameWindow.reload();
        }
    },
    F11 = {
        key : "F11",
        active : toggleFS
    }
    let shortcutF4 = new gui.Shortcut(F4), shortcutF5 = new gui.Shortcut(F5), shortcutF11 = new gui.Shortcut(F11);
    gui.App.registerGlobalHotKey(shortcutF4);
    gui.App.registerGlobalHotKey(shortcutF5);
    gui.App.registerGlobalHotKey(shortcutF11);
}

function toggleFS() {
    gameWindow.toggleFullscreen();
}

function createSplash() {
    gui.Window.open("./html/splash.html", { "width" : 700, "height" : 300, "frame" : false, "position" : "center", "always_on_top" : true }, win => {
        splashWindow = win;
        //Insert updater code here
        createGameWindow();
    });
}

createSplash();