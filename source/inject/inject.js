var positionX = 0;
var positionY = 0;
var index = 0;

document.addEventListener('keyup', onKeyPress);
document.addEventListener('mousedown', getCoordinates);

function onKeyPress(event) {  
    var toggle = 'T'.charCodeAt();
    var selection = document.getSelection().toString();

    const MAX_LENGTH = 20;

    if(event.keyCode === toggle && selection !== '' && selection.length <= MAX_LENGTH) {
        chrome.runtime.sendMessage({searchTerm: selection}, createPopup);
    }

    return;
}

function getCoordinates(event) {
    positionX = event.pageX;
    positionY = event.pageY;
}

function createPopup(response) {
    removePreviousPopup();
    var firstResult = response.data[index];
    var japaneseContent = {};
    var englishContent = {};
    var word = '';

    var popup = document.createElement('div');
    var word = document.createElement('span');
    var reading = document.createElement('span');
    var partsOfSpeech = document.createElement('span');
    var jishoLink = document.createElement('a');
    var definitions = document.createElement('span');

    var displacementX = 25;
    var displacementY = 25;

    popup.className = 'IJpopup';
    popup.style.top = (positionY + displacementY).toString() + 'px';
    popup.style.left = (positionX - displacementX).toString() + 'px';  

    reading.className = 'IJcontent';
    reading.id = 'IJreading';

    if (firstResult === undefined) {
        reading.innerHTML = response.status;
        popup.appendChild(reading);
        document.body.appendChild(popup);
        document.addEventListener('mousedown', removePopup);
        return;
    }

    japaneseContent = firstResult.japanese[0];
    englishContent = firstResult.senses[0];

    reading.innerHTML = japaneseContent.reading || ''; 

    word.className = 'IJcontent';
    word.id = 'IJword';
    word.innerHTML = japaneseContent.word || '';

    definitions.className = 'IJcontent';
    definitions.id = 'IJdefinitions';
    definitions.innerHTML = englishContent.english_definitions.join(', ') || '';

    partsOfSpeech.className = 'IJcontent';
    partsOfSpeech.id = 'IJpartsOfSpeech';
    partsOfSpeech.innerHTML = englishContent.parts_of_speech.join(', ') || '';

    jishoLink.className = 'IJcontent';
    jishoLink.id = 'IJjisho';
    jishoLink.innerHTML = 'jisho.org'
    jishoLink.href = 'http://jisho.org/search/' + encodeURIComponent(japaneseContent.word);
    jishoLink.target = '_blank';

    popup.style.height = (englishContent.english_definitions.join('').length/3 + 200).toString() + 'px';

    popup.appendChild(reading);
    popup.appendChild(word);
    popup.appendChild(definitions);
    popup.appendChild(partsOfSpeech);
    popup.appendChild(jishoLink);
    document.body.appendChild(popup);

    document.addEventListener('mousedown', removePopup);

    if (index === response.data.length - 1) {
        index = 0;
        return;
    }

    index++;
}

function removePopup(event) {
    var popup = document.getElementsByClassName('IJpopup')[0];

    if(!isPopup(popup, event.target)){
        popup.remove();
        document.removeEventListener('mousedown', removePopup);
        index = 0;
        return;
    }

    return;
}

function isPopup (popupNode, node) {
    if (node === document || node === window) {
        return false;
    }

    if (node === popupNode) {
        return true;
    }

    return isPopup(popupNode, node.parentNode);
}

function removePreviousPopup () {
    var popup = document.querySelector('.IJpopup');
    if (popup){
        popup.remove();
    }
}
// TODO 
// refactor?