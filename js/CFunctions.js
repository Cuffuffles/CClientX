function CFunctions() {
}

CFunctions.prototype.fixLinks = function() {
    $(document).on('click', 'a[href^="/social"]', function(event) {
        event.preventDefault();
        window.open(this.href);
    });
    $(document).on('click', 'a[href^="/viewer"]', function(event) {
        event.preventDefault();
        window.open(this.href);
    });
}

CFunctions.prototype.fixImport = function() {
    window.prompt = function() {
        var tempHTML = '<div class="setHed">Import Settings</div>';
        tempHTML += '<div class="settName" id="importSettings_div" style="display:block">Settings String<input type="url" placeholder="Paste Settings String Here" name="url" class="inputGrey2" id="settingString"></div>';
        tempHTML += '<a class="+" id="importBtn">Import</a>';
        menuWindow.innerHTML = tempHTML;
        importBtn.addEventListener('click', () => {
            let string = settingString.value;
            if(string && string != '') {
                try {
                    var json = JSON.parse(string);
                    for(var setting in json) {
                        if(setting == 'controls') {
                            //not supporting keybinds right now, might maybe hopefully will later (probably not)
                        } else {
                            setSetting(setting, json[setting]);
                            showWindow(1);
                        }
                    }
                } catch(err) {
                    console.error(err);
                    alert('Error importing settings, most likely cause is either your settings string was incorrect or a game update has changed something');
                }
            }
        });
    }
}

module.exports = { CFunctions };