import { createElem, buildDomTree, addAttribs } from '../utils.js';

const clickPos = {
    x: 0,
    y: 0,
};

export function setClickPos(event) {
    clickPos.x = event.pageX;
    clickPos.y = event.pageY;
}

export function* getAppTag() {
    for (;;) {
        yield "IJ";
    } 
}

export function createModal(response) {
    const appTag = getAppTag().next().value; 
    
    const modal = createElem("div", {"id": `${appTag}modal`}, undefined);
    const content = [
        createElem("span", {"id": `${appTag}reading`}, undefined),
        createElem("span", {"id": `${appTag}word`}, undefined),
        createElem("span", {"id": `${appTag}definition`}, undefined),
        createElem("span", {"id": `${appTag}partsOfSpeech`}, undefined),
        createElem("a", {"id": `${appTag}jishoLink`}, undefined)
    ];

    content.forEach(elem => elem.setAttribute("class", `${appTag}content`));

    buildDomTree(modal, content);

    // TODO find a way to get positioning from click without using
    // global variable
    modal.style.left = `${(clickPos.x + 20).toString()}px`;
    modal.style.top = `${(clickPos.y - 20).toString()}px`;

    document.body.appendChild(modal);
    document.addEventListener("click", function() {
        if (!isChild(modal, event.target)) {
            removeModal(modal);
            document.removeEventListener("click", this);
        }
    });

    generateContent(content, response);
}

function generateContent(content, response) {
    const toggle = 'T'.charCodeAt();
    const appTag = getAppTag().next().value;
    
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

        addAttribs(content, [{"innerHTML": japanese.reading}, 
                               {"innerHTML": japanese.word},
                               {"innerHTML": english.english_definitions.join(', ')},
                               {"innerHTML": english.parts_of_speech.join(', ')},
                               {"innerHTML": "jisho.org", 
                                "href": `http://jisho.org/search/${encodeURIComponent(japanese.word)}`, 
                                "target": '_blank'}]);
                          
        index += 1; 

        if (index === response.data.length) {
            index = 0;
        }
    }

    changeContent();
    document.getElementById(`${appTag}modal`).addEventListener('mouseup', changeContent);
    document.addEventListener('keyup', changeContent);
}

function isChild(parentNode, node) {
    if (node === document || node === window) {
        return false;
    }

    if (node === parentNode) {
        return true;
    }

    return isChild(parentNode, node.parentNode);
}

function removeModal(modal) {
    if (modal) {
        modal.remove();
    }
}