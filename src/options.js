/**
 * Saves options to chrome.storage
 */
function saveOptions() {
    chrome.storage.sync.set({
        devExtension: document.getElementById('dev-extension').value,
    }, function() {
        var message = document.getElementById('message');
        message.innerText = 'Settings updated.';
        message.classList.add('success');

        setTimeout(function() {
            message.innerText = '';
            message.classList.remove('success');
        }, 5000);
    });
}

/**
 * Gets the current options and adds them to the page.
 */
function restoreOptions() {
    chrome.storage.sync.get({
        devExtension: 'dev.co.uk',
    }, function(data) {
        document.getElementById('dev-extension').value = data.devExtension;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
