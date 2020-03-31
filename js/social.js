const donateObserver = new MutationObserver(donate);
const config = { attributes: true };

document.addEventListener('DOMContentLoaded', () => {
    if(location.hash == "#donate") {
        updateWindow("profile");
        donateObserver.observe(loadMessage, config);
    }
});

function donate() {
    setTimeout(() => {
        giftPopup("Cuffuffles");
    }, 500);
}