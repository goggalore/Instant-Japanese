import { buildDomTree, createElem, addAttribs } from '../util.js';

const appTag = "IJ";

export function getTextPosition() {
    const modal = document.body.appendChild(
        createElem("div", {"id": `${appTag}modal`, "display": "hidden"}, undefined));
    const modalWidth = parseInt(window.getComputedStyle(modal).width);

    const selectionPos = window.getSelection().getRangeAt(0).getClientRects()[0];
    const displacement = {
        x: 0,
        y: 25
    };

    let posX = selectionPos.x + window.scrollX + displacement.x;
    let posY = selectionPos.y + window.scrollY + displacement.y;

    if (posX + selectionPos.width + modalWidth > window.innerWidth) {
        posX -= posX + selectionPos.width + modalWidth - window.innerWidth; 
    }

    removeModal(modal);

    return { 
        x: posX,
        y: posY
    };
}

export function createModal(response) {
    removeModal(document.getElementById(`${appTag}modal`));

    const position = getTextPosition();
    
    const modal = createElem("div", {"id": `${appTag}modal`}, undefined);
    const content = [
        createElem("span", {"id": `${appTag}reading`}, undefined),
        createElem("span", {"id": `${appTag}word`}, undefined),
        createElem("span", {"id": `${appTag}definition`}, undefined),
        createElem("span", {"id": `${appTag}partsOfSpeech`}, undefined),
        createElem("a", {"id": `${appTag}jishoLink`}, undefined)
    ];

    content.forEach(elem => addAttribs(elem, {"class": `${appTag}content`}));

    buildDomTree(modal, content);

    modal.style.left = `${position.x.toString()}px`;
    modal.style.top = `${position.y.toString()}px`;

    document.body.appendChild(modal);
    document.addEventListener("click", function() {
        if (!isChild(modal, event.target)) {
            removeModal(modal);
            document.removeEventListener("click", this);
        }
    });

    generateContent(content, response);
}

export function generateContent(content, response) {
    const toggle = 'T'.charCodeAt();

    let index = 0;

    const changeContent = (event) => {
        if (event && event.keyCode && event.keyCode !== toggle) {
            return;
        }

        if (response.status !== undefined) {
            content[2].innerHTML = response.status;
            return; 
        }

        const result = response.data[index];
        const japanese = result.japanese[0];
        const english = result.senses[0];
        const jishoLink = japanese.word || japanese.reading;

        addAttribs(content, [{"innerHTML": japanese.reading}, 
                               {"innerHTML": japanese.word},
                               {"innerHTML": english.english_definitions.join(', ')},
                               {"innerHTML": english.parts_of_speech.join(', ')},
                               {"innerHTML": "jisho.org", 
                                "href": `http://jisho.org/search/${encodeURIComponent(jishoLink)}`, 
                                "target": '_blank'}]);
                          
        index += 1; 

        if (index === response.data.length) {
            index = 0;
        }
    }

    changeContent();
    document.getElementById(`${appTag}modal`).addEventListener("mouseup", changeContent);
    document.addEventListener("keyup", changeContent);
}

export function isChild(parentNode, node) {
    if (node === document || node === window) {
        return false;
    }

    if (node === parentNode) {
        return true;
    }

    return isChild(parentNode, node.parentNode);
}

export function removeModal(modal) {
    if (modal) {
        modal.remove();
    }
}