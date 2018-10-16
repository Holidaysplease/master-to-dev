var devExtension = '',
    currentTabId = 0;

// Get the initial data
chrome.storage.sync.get({
    devExtension: 'dev.co.uk',
}, function(data) {
    devExtension = data.devExtension;
    // Set up all events now that we have the data
    setUpEvents();
});

/**
 * Called when the storage is changed.
 *
 * @param {object} changes
 * @param {string} namespace
 */
var storageChange = function(changes, namespace) {
    if (typeof changes.devExtension === 'undefined') {
        return;
    }

    devExtension = changes.devExtension.newValue;
};

/**
 * Click event on the main icon.
 *
 * @param {Tab} activeTab
 */
var iconClick = function(activeTab) {
    var newUrl = '',
        splitUrl = activeTab.url.split('//'),
        protocol = splitUrl[0],
        url = splitUrl[1];

    // Ignore non http
    if (!protocol.includes('http')) {
        return;
    }

    if (url.includes(devExtension)) {
        newUrl = url.replace('.' + devExtension, '');
    } else {
        var urlArray = url.split('/'),
            baseUrl = urlArray.shift();

        newUrl = baseUrl + '.' + devExtension + '/' + urlArray.join('/');
    }

    chrome.tabs.create({
        index: activeTab.index + 1,
        url: protocol + '//' + newUrl
    });
};

/**
 * Event for when a tab is updated.
 *
 * @param {number} tabId
 * @param {object} changeInfo
 * @param {Tab} tab
 */
var tabUpdated = function(tabId, changeInfo, tab) {
    if (tabId !== currentTabId) {
        return;
    }

    checkIcon(tab);
};

/**
 * Event for when the main tab changes.
 *
 * @param {object} activeInfo
 */
var mainTabSet = function(activeInfo) {
    currentTabId = activeInfo.tabId;

    chrome.tabs.get(currentTabId, function(tab) {
        checkIcon(tab);
    });
};

/**
 * Checks the icon for the current tab. Changes the icon if the tab url has a dev extension.
 *
 * @param {Tab} currentTab
 */
var checkIcon = function(currentTab) {
    if (currentTab.url.includes(devExtension)) {
        chrome.browserAction.setIcon({path: 'icon-live.png', tabId: currentTab.id});
    }
};

/**
 * Sets up all of the events.
 */
var setUpEvents = function() {
    chrome.storage.onChanged.addListener(storageChange);
    chrome.browserAction.onClicked.addListener(iconClick);
    chrome.tabs.onUpdated.addListener(tabUpdated);
    chrome.tabs.onActivated.addListener(mainTabSet);
};
