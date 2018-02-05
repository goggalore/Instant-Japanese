export function createElem(type, attribs, htmlContent) {
    if (!(typeof type === 'string')) {
        console.warn(`createElem: Invalid first argument,
                      must be of type string`);
    }

    const elem = document.createElement(type);

    if (attribs) {
        for (const name in attribs) {
            elem.setAttribute(name, attribs[name]);
        }
    }

    if (htmlContent) {
        elem.innerHTML = htmlContent;
    }

    return elem;
}

export function buildDomTree(parent, children) {
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child instanceof Array) {
            const innerParent = children[i - 1];
            if (innerParent instanceof Node) {
                buildDomTree(innerParent, child);
            } else {
                console.warn(`buildDomTree: Invalid argument format.
                              Node Array must follow a Node`);
            } 
        } else {
            if (!child.toString) {
                console.warn(`buildDomTree: Invalid type in arguments,
                              Node must be instance of Node or have a toString method.
                              Error found at ${child} of ${parent}`)
            }
            parent.appendChild(child instanceof Node? child : 
                document.createTextNode(child.toString()))
        }
    }

    return parent;
}

export function addAttribs(element, attribs) {
    if (element instanceof Array) {
        if (!(attribs instanceof Array)) {
            console.warn(`addAttribs: If element is given as an Array,
                          attribs must also be an Array`);
            return;
        }
        if (element.length !== attribs.length) {
            console.warn(`addAttribs: If element is given as an Array,
                          attribs must have the same length as element`);
            return;
        }

        for (const i in attribs) {
            addAttribs(element[i], attribs[i]);
        }
    }

    if (!(element instanceof Element)) {
        console.warn(`addAttribs: An element must be instance of Element`);
    }

    for (const attrib of attribs) {
        if (attrib === "innerHTML") {
            element.appendChild(createTextNode(attribs[attrib]));
        }
        element[attrib] = attribs[attrib];
    }
}