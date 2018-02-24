import { createModal } from './modal.js';

const appTag = "IJ";

document.addEventListener("keyup", onKeyPress);

function onKeyPress(event) {
    const selection = document.getSelection().toString().trim();
    const toggle = 'T'.charCodeAt();
    const maxLength = 20;
    
    const modal = document.getElementById(`${appTag}modal`);

    if (selection && event.keyCode === toggle && selection.length < maxLength && !modal) {
        displayLoading();
        chrome.runtime.sendMessage({searchTerm: selection}, createModal);
    }
}

function displayLoading() { 
    const loading = {
        "status": "Loading..."
    };

    createModal(loading);
}