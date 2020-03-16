const electron = require('electron');
const { app, BrowserWindow, Menu } = electron;
const path = require('path');
let os = require('os');
let win = null, splash = null;

app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-breakpad');
app.commandLine.appendSwitch('disable-component-update');
app.commandLine.appendSwitch('disable-print-preview');
app.commandLine.appendSwitch('disable-metrics');
app.commandLine.appendSwitch('disable-metrics-repo');
app.commandLine.appendSwitch('disable-bundled-ppapi-flash');
app.commandLine.appendSwitch('disable-logging');
app.commandLine.appendSwitch('webrtc-max-cpu-consumption-percentage=100');
if(os.cpus()[0].model.includes('AMD')) {
    app.commandLine.appendSwitch('enable-zero-copy');
}

//Allow custom arguments to pass through
for(var argument in process.argv) {
    app.commandLine.appendSwitch(argument);
}

//Setup Mac shortcuts
if(process.platform == 'darwin') {
    var template = [{
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
} else {
    Menu.setApplicationMenu(null);
}

function createSplash() {
    splash = new BrowserWindow({
        width: 700,
        height: 300,
        backgroundColor: '#000000',
        center: true,
        alwaysOnTop: true,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntergration: false
        }
    });
    splash.loadFile(path.join(__dirname, '../html/splash.html'));
    splash.once('ready-to-show', () => splash.show());
}

app.on('ready', createSplash);

app.on('window-all-closed', () => {
    app.quit();
});