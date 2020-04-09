const $ = (jQuery = require("jquery"));

const donateObserver = new MutationObserver(donate);
const config = { attributes: true };

document.addEventListener("DOMContentLoaded", () => {
  $(document).on("click", 'a[href^="/"]', function (event) {
    event.preventDefault();
    window.location.href = this.href;
  });
  window.open = function (...args) {
    window.location = args[0];
  };
  if (location.hash == "#donate") {
    updateWindow("profile");
    donateObserver.observe(loadMessage, config);
  }
});

function donate() {
  setTimeout(() => {
    giftPopup("Cuffuffles");
  }, 500);
}
