import { getAppTag, createModal, getClickPos } from './modal.js';

document.addEventListener('mousedown', setClickPosition);
document.addEventListener('keyup', onKeyPress);

function onKeyPress(event) {
    const selection = document.getSelection().toString().trim();
    const toggle = 'T'.charCodeAt();
    const maxLength = 20;

    const appTag = getAppTag.next().value; 
    const modal = document.getElementById(`${appTag}modal`);

    if (selection && event.keycode === toggle && selection.length < maxLength && !modal) {
        displayLoading();
        chrome.runtime.sendMessage({searchTerm: selection}, createModal);
    }
}

function displayLoading() { 
    const loading = {
        'status': 'Loading...'
    };

    createModal(loading);
}