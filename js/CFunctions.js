function CFunctions() {
}

CFunctions.prototype.getCSetting = function(name){
    return localStorage.getItem("cx"+name);
}
CFunctions.prototype.getCSetting = function(name, value){
    localStorage.setItem("cx"+name, value);
}
CFunctions.prototype.toggleDark = function(){
    if(this.getCSettings('dark') === null) this.setCSettings('dark', 'unchecked');
    if(this.getCSettings('dark') === 'unchecked') {
        this.setCSettings('dark', 'checked');
    } else {
        this.setCSettings('dark', 'unchecked');
    }
    this.darkMode();
}
CFunctions.prototype.darkMode = function(){
            if(this.getCSettings('dark') === null) this.setCSettings('dark', 'unchecked');
            if(this.getCSettings('dark') === 'checked') {
            	//document.getElementsByClassName("settText")[1].style.color="color: rgba(255,255,255,0.3);"
				window.document.getElementsByTagName("head")[0].innerHTML+=`<style id="ccdark">
				.settText.floarR {
					color: rgba(255,255,255,0.3);
				}
				#menuWindow {
					background: #0a0a0a;
				}
				.inputGrey2, .inputGrey, #rankedPartyKey, .serverHeader {
					background: #292929;
				}
				.slider {
					background: #272727;
				}
				
				html {background-color: #181a1b !important;}
div.settName, #queueRegion, #menuRegionLabel, #menuFPS, .menuItemTitle, div.settNameSmall, input.accountInput{
	color: #858585 !important;
}

html, body, input, textarea, select, button {
    background-color: #181a1b;
}
html, body, input, textarea, select, button {
    border-color: #575757;
    color: #e8e6e3;
}
a {
    color: #3391ff;
}
table {
    border-color: #4c4c4c;
}
::placeholder {
    color: #bab5ab;
}
::selection {
    background-color: #005ccc;
    color: #ffffff;
}
::-moz-selection {
    background-color: #005ccc;
    color: #ffffff;
}
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
    background-color: #545b00 !important;
    color: #e8e6e3 !important;
}
::-webkit-scrollbar {
    background-color: #1c1e1f;
    color: #c5c1b9;
}
::-webkit-scrollbar-thumb {
    background-color: #2a2c2e;
}
::-webkit-scrollbar-thumb:hover {
    background-color: #323537;
}
::-webkit-scrollbar-thumb:active {
    background-color: #3d4043;
}
::-webkit-scrollbar-corner {
    background-color: #181a1b;
}
* {
    scrollbar-color: #2a2c2e #1c1e1f;
}
div.settingsHeader {
	background-color: #0a0a0a;
}
</style>`;
            } else {
				document.getElementById("ccdark").remove();
				//document.getElementsByClassName("settText")[1].style.color="color: rgba(0,0,0,0.3);"
            }
}


CFunctions.prototype.renderLog = function(string) {
    //Log function to test class functions work
    window.console.log(string);
}

module.exports = { CFunctions };
