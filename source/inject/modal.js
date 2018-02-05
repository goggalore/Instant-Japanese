import { createElem, buildDomTree, addAttribs } from '../utils.js';

function createModal(response) {
    const appTag = "IJ"; 
    const modal = createElem("div", {"class": `${apptag}modal`}, undefined);
    
    buildDomTree(modal.htmlElement, [
        createElem("span", {"class": `${apptag}reading`}, undefined),
        createElem("span", {"class": `${apptag}word`}, undefined),
        createElem("span", {"class": `${apptag}definition`}, undefined),
        createElem("span", {"class": `${apptag}partsOfSpeech`}, undefined),
        createElem("a", {"class": `${apptag}jishoLink`}, undefined)
    ]);

    removeModal(document.getElementsByClassName(modal.class)[0]);
    
    // TODO find a way to get positioning from click without using
    // global variable
    modal.style.left = position.x;
    modal.style.top = position.y;

    document.body.appendChild(modal);
    document.addEventListener("click", function() {
        if (!isChild(modal, event.target)) {
            modal.remove();
            document.removeEventListener("click", this);
        }
    });

    generateContent(modal, response);
}

function generateContent(modal, content) {
    const toggle = 'T'.charCodeAt();
    let index = 0;

    const changeContent = (event) => {
        if (event && event.keyCode && event.keyCode !== toggle) {
            return;
        }

        if (response.status !== undefined) {
            content.reading.definition = response.status;
            return; 
        }

        const result = response.data[index];
        const japanese = result.japanese[0];
        const english = result.senses[0];

        addAttribs([modal.reading, 
                    modal.word, 
                    modal.definitions, 
                    modal.partsOfSpeech,
                    modal.jishoLink], 
                        [{"innerHTML": japanese.reading}, 
                         {"innerHTML": japanese.word},
                         {"innerHTML": english.english_definitions.join(', ')},
                         {"innerHTML": english.parts_of_speech.join(', ')},
                         {"innerHTML": "jisho.org", 
                            "href": `http://jisho.org/search/${encodeURIComponent(japanese.word)}`, 
                            "target": '_blank'}])

        index++; 

        if (index === response.data.length) {
            index = 0;
        }
    }

    changeContent();
    modal.addEventListener('mouseup', changeContent);
    document.addEventListener('keyup', changeContent);
}

function isChild(parentNode, node) {
    if (node === document || node === window) {
        return false;
    }

    if (node === ParentNode) {
        return true;
    }

    return isChild(parentNode, node.parentNode);
}

function removeModal(modal) {
    if (modal) {
        modal.remove();
    }
}