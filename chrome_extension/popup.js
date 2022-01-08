window.addEventListener('DOMContentLoaded',() => {
    let bg = chrome.extension.getBackgroundPage();

    chrome.tabs.query({active:true, currentWindow: true}, (tabs) => {
        let currentTab = tabs[0].id;
        let currentData = bg.getdata();
        console.log(currentData)
        
        getData().then((res) => {
            console.log(res["rephrased"])
            // window.open("popup.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no");
        
        
            bg.copyTextToClipboard(res["rephrased"])
        
              // after copied to clipboard show popup of copied to clipboard
              chrome.tabs.create({
                url: chrome.extension.getURL('notify.html'),
                active: false
            }, function(tab) {
                // After the tab has been created, open a window to inject the tab
                chrome.windows.create({
                    tabId: tab.id,
                    type: 'popup',
                    focused: true
                });
            });
        
        
        });

    })
})