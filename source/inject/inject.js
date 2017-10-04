var positionX = 0;
var positionY = 0;

document.addEventListener('keyup', onKeyPress);
document.addEventListener('mousedown', getCoordinates);

function onKeyPress(event) {  
    var toggle = 'T'.charCodeAt();
    var selection = document.getSelection().toString();
    var modal = document.querySelector('.IJmodal'); // don't want to send a request if a modal is already open

    const MAX_LENGTH = 20;

    if(modal === null && event.keyCode === toggle && selection !== '' && selection.length <= MAX_LENGTH) {
        chrome.runtime.sendMessage({searchTerm: selection}, createModal);
    }

    return;
}

function getCoordinates(event) {
    positionX = event.pageX;
    positionY = event.pageY;
}

function createModal(response) {
    var modal = document.createElement('div');
    var content = {
        'reading': document.createElement('span'),
        'word': document.createElement('span'),
        'definitions': document.createElement('span'),
        'partsOfSpeech': document.createElement('span'),
        'jishoLink': document.createElement('a'),
    }
    var appTag = 'IJ' // unique idenitifier for the extension's injected HTML objects

    var contentNames = Object.getOwnPropertyNames(content);

    var displacementX = 25;
    var displacementY = 25;

    removePreviousModal();

    modal.className = 'IJmodal';
    modal.style.top = (positionY + displacementY).toString() + 'px';
    modal.style.left = (positionX - displacementX).toString() + 'px';
    

    for(var i = 0; i < contentNames.length; i++){
        content[contentNames[i]].className = appTag + 'content';
        content[contentNames[i]].id = appTag + contentNames[i];
        modal.appendChild(content[contentNames[i]]);
    }

    document.body.appendChild(modal);
    document.addEventListener('mousedown', removeModal);

    displayDefinition(content, response);
}

function displayDefinition(content, response) {   
    var modal = document.querySelector('.IJmodal');
    var toggle = 'T'.charCodeAt();

    var index = 0;

    var changeContent = function(event) {
        var result = [];
        var japanese = {};
        var english = {};

        if (event && event.keyCode && event.keyCode !== toggle) { 
            return;
        }

        if (response.status !== undefined) {
            modal.style.height = '70px';
            content.reading.innerHTML = response.status;
            return
        }

        result = response.data[index]
        japanese = result.japanese[0];
        english = result.senses[0];

        content.reading.innerHTML = japanese.reading || '';
        content.word.innerHTML = japanese.word || '';
        content.definitions.innerHTML = english.english_definitions.join(', ') || '';
        content.partsOfSpeech.innerHTML = english.parts_of_speech.join(', ') || '';
        content.jishoLink.innerHTML = 'jisho.org'
        content.jishoLink.href = 'http://jisho.org/search/' + encodeURIComponent(japanese.word);
        content.jishoLink.target = '_blank';

        modal.style.height = (english.english_definitions.join('').length + 150).toString() + 'px';

        if (index === response.data.length - 1) {
            index = 0;
            return;
        }

        index++;
    }

    changeContent();
    modal.addEventListener('mouseup', changeContent);
    document.addEventListener('keyup', changeContent);
}

function removeModal(event) {
    var modal = document.querySelector('.IJmodal');

    if(!isModal(modal, event.target)){
        modal.remove();
        document.removeEventListener('mousedown', removeModal);
        return;
    }

    return;
}

function isModal (modalNode, node) {
    if (node === document || node === window) {
        return false;
    }

    if (node === modalNode) {
        return true;
    }

    return isModal(modalNode, node.parentNode);
}

function removePreviousModal () {
    var modal = document.querySelector('.IJmodal');
    if (modal){
        modal.remove();
    }
}
// TODO 
// don't allow modal to go outside of view
// fix ugly formatting that occurs on some definitions
