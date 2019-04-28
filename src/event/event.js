chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) { 
  const searchUrl = 'http://jisho.org/api/v1/search/' + 'words?keyword=' + 
      encodeURIComponent(request.searchTerm);
  const definitionRequest = new XMLHttpRequest;

  definitionRequest.open('GET', searchUrl);

  definitionRequest.onreadystatechange = function() {
    try {
      const response = JSON.parse(this.responseText);
      if (this.readyState === 4 && response.data[0] === undefined) {
        sendResponse({status: 'Oh no! Jisho.org couldn\'t find a definition that matched this word'})
      }
      else if (this.readyState === 4 && this.status === 200) {
        sendResponse(response);
      }
      else if (this.readyState === 4 && this.status !== 200) {
        sendResponse({status: 'No response from the Jisho.org API'});
      }
  } catch {
    console.log(this.responseText)
  }
}


  definitionRequest.send();
  return true; // specifies that sendResponse is asynchronous
});