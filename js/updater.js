function update() {
    const { createGameWindow } = require("./main.js");
    //Will check if update is available before calling createGameWindow to start client
    createGameWindow();
}

module.exports = { update };