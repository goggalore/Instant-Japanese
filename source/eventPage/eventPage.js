chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) { 
  var searchUrl = 'http://jisho.org/api/v1/search/' + 'words?keyword=' + 
      encodeURIComponent(request.searchTerm);
  var definitionRequest = new XMLHttpRequest;
  var definitionResponse = {};

  definitionRequest.open('GET', searchUrl);

  definitionRequest.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      definitionResponse = JSON.parse(this.responseText);
      sendResponse(definitionResponse);
    }
    else if (this.readyState === 4 && this.status != 200) {
      sendResponse({status: 'No response from the Jisho.org API'});
    }
    else if (this.readyState === 4 && this.responseText.data === undefined) {
      console.log('check');
      sendResponse({status: 'Couldn\'t find a definition that matched this word'})
    }
  }

  definitionRequest.send();
  return true; // specifies that sendResponse is asynchronous
});