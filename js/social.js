const loadObserver = new MutationObserver(insertButton);
const config = { attributes: true };

document.addEventListener('DOMContentLoaded', () => {
    var url = window.location.href;
    if(url.startsWith('https://krunker.io/social.html?p=profile&q=')) {
        loadObserver.observe(loadMessage, config);
    }
});

function insertButton() {
    var buttonHtml = '<div class="button profile buttonG" id="copyBtn">Copy</div>';
    leftBtns.insertAdjacentHTML('beforeend', buttonHtml);
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        var popHtml = '<div style="color:#fff;font-size:20px;position:relative;margin-bottom:10px;text-align:center;">Profile Link Copied!</div>';
        giftPopup();
        giftPop.innerHTML = popHtml;
    });
}