var positionX = 0;
var positionY = 0;

document.addEventListener('keyup', onKeyPress);
document.addEventListener('mousedown', getCoordinates);

function onKeyPress (event) {  
    var toggle = 'T'.charCodeAt();
    var selection = document.getSelection().toString();
    var modal = document.querySelector('.IJmodal'); // don't want to send a request if modal is already open

    const MAX_LENGTH = 20;

    if(!modal && selection && event.keyCode === toggle && selection.length <= MAX_LENGTH) {
        chrome.runtime.sendMessage({searchTerm: selection}, createModal);
    }

    return;
}

function getCoordinates (event) {
    positionX = event.pageX;
    positionY = event.pageY;
}


function createModal (response) {
    var modal = document.createElement('div');
    var content = {
        'reading': document.createElement('span'),
        'word': document.createElement('span'),
        'definitions': document.createElement('span'),
        'partsOfSpeech': document.createElement('span'),
        'jishoLink': document.createElement('a'),
    }
    var appTag = 'IJ' // unique idenitifier for extension's injected HTML objects

    var contentNames = Object.getOwnPropertyNames(content);

    var displacement = {
        x: -25,
        y: 25
    };

    removePreviousModal();

    modal.className = appTag + 'modal';
    modal.style.top = (positionY + displacement.y).toString() + 'px';
    modal.style.left = (positionX + displacement.x).toString() + 'px';
    

    for(var i = 0; i < contentNames.length; i++){
        content[contentNames[i]].className = appTag + 'content';
        content[contentNames[i]].id = appTag + contentNames[i];
        modal.appendChild(content[contentNames[i]]);
    }

    document.body.appendChild(modal);
    document.addEventListener('mousedown', removeModal);

    displayDefinition(content, response);
}

function displayDefinition (content, response) {   
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

        setModalHeight(modal);
        // adjustModalPosition(modal);

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

function setModalHeight (modal) {
    var height = 0;
    var children = modal.children; // set height in respect to how much space the content (child nodes) take up
    
    for(var i = 0; i < children.length; i++) {
        if(!children[i + 1]) {
            height += children[i].offsetTop + children[i].offsetHeight
        }
    }

    modal.style.height = height + 'px';
}

function adjustModalPosition (modal) {
    // not used in code yet, trying to figure out proper positioning
    var modalRight = (modal.offsetLeft + modal.offsetWidth) - window.scrollX;
    var modalBottom = (modal.offsetTop + modal.offsetHeight) - window.scrollY; 

    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;

    console.log('Bottom: ' + modalBottom, 'Window Y: ' + windowHeight, 'Bottom > Window Y: ' + (modalBottom > windowHeight));
    if (modalRight > windowWidth) {
        modal.style.left = (positionX + modalRight - windowWidth) + 'px';
    }

    if (modalBottom > windowHeight) {
        modal.style.top = (positionY + modalBottom - windowHeight) + 'px';
    }
}

function removeModal (event) {
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
// fix positioning function