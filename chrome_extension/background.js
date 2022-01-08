// context menu
const CONTEXT_MENU_ID = "MY_CONTEXT_MENU";
function getword(info, tab) {
  if (info.menuItemId !== CONTEXT_MENU_ID) {
    return;
  }
  console.log(info.selectionText);

  // fetch(`http://127.0.0.1:5000/api/${info.selectionText}`,{
  //   method:'POST',
  //   mode: 'no-cors'
  // })
  //     .then(function (response) {
  //         return console.log(response.json());
  //     }).then(function (text) {
  //         console.log(text);
  //     }).catch(e => console.log('pls work'));

  const getData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/returnjson/${info.selectionText}`
      );
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      return jsonResponse;
    } catch (err) {
      console.log(err.message);
    }
  };

  getData().then((res) => {
    console.log(res["rephrased"])
    // window.open("popup.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no");


    copyTextToClipboard(res["rephrased"])

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
}

chrome.contextMenus.create({
  title: "Singlish to English: %s",
  contexts: ["selection"],
  id: CONTEXT_MENU_ID,
});
chrome.contextMenus.onClicked.addListener(getword);

function copyToClipboard(textToCopy) {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(textToCopy);
  } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
          // here the magic happens
          document.execCommand('copy') ? res() : rej();
          textArea.remove();
      });
  }
}


function copyTextToClipboard(text) {
  console.log("hi");
  console.log(text);
  text[0].execCommand("copy");

  //Execute command
  // if (text){
  //   navigator.clipboard.writeText(text);
  // }

  // window.clipboardData.setData("Text", 'hallo pls be copied')

  //   text.execCommand('copy');
  // if (navigator.clipboard != undefined) {//Chrome
  //   navigator.clipboard.writeText(text[0]).then(function () {
  //       console.log('Async: Copying to clipboard was successful!');
  //   }, function (err) {
  //       console.error('Async: Could not copy text: ', err);
  //   });
  // }
  // else if(window.clipboardData) { // Internet Explorer
  //   window.clipboardData.setData("Text", text);
  // }

  // navigator.clipboard.writeText('Text to be copied')
  // .then(() => {
  //   console.log('Text copied to clipboard');
  // })
  // .catch(err => {
  //   // This can happen if the user denies clipboard permissions:
  //   console.error('Could not copy text: ', err);
  // });

  // navigator.clipboard.writeText(text).then(function() {
  //   /* clipboard successfully set */
  //   console.log('success')
  // }, function() {
  //   /* clipboard write failed */
  //   console.log(':(')
  // });

  // alert("Copied the text: " + copyText.valu);
}

// // api
// fetch('/api', {
//   method:'POST',
//   body: JSON.stringify({'clickbaitText': 'Yes hello'})
// })
//   .then(response => response.json())
//   .then(data => console.log(data));

// function catchLastError(){
//   if(chrome.runtime.lastError){
//     console.log("error: ", chrome.runtime.lastError);
//   }else{
//     // some code goes here.
//   }
// }

// chrome.fileSystem.chooseEntry({},catchLastError);

// fetch(`http://127.0.0.1:5000/api/${info.selectionText}`, {
//   method:'POST',
//   mode: 'no-cors',
//   // body: JSON.stringify({: 'Yes hello'})
// })
//   .then(response => console.log(response))
//   .then(data => console.log(data['rephrased'])
//   .catch(e => console.log('pls work'))

//   // copyTextToClipboard(data)

// // chrome.tabs.create({
// //   url: "/api" + info.selectionText
// //   // get back returned data???
// // });
// // chrome.runtime.sendMessage({
// //   extensionId: 'hi',
// //   message: 'any',
// //   }
// );
