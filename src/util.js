export function createElem(type, attribs, htmlContent) {
    if (!(typeof type === 'string')) {
        console.warn(`createElem: Invalid first argument, \
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
                console.warn(`buildDomTree: Invalid type in arguments, \
                              Node must be instance of Node or have a toString method. \
                              Error found at ${child} of ${parent}`)
            }
            parent.appendChild(child instanceof Node? child : 
                document.createTextNode(child.toString()))
        }
    }

    return parent;
}

export function addAttribs(elem, attribs) {
    if (elem instanceof Array) {
        if (!(attribs instanceof Array)) {
            console.warn(`addAttribs: If elem is given as an Array, \
                          attribs must also be an Array`);
            return;
        }
        if (elem.length !== attribs.length) {
            console.warn(`addAttribs: If elem is given as an Array, \
                          attribs must have the same length as elem`);
            return;
        }

        for (let i in elem) {
            addAttribs(elem[i], attribs[i]);
        }
        
        return elem; // useful if you need the elements back to reference them, esp. if they
                        // havent been appended to the DOM 
                        // but be careful, if they have been appended, this function produces side effects.
    }

    if (!(elem instanceof Element)) {
        console.warn(`addAttribs: An elem must be instance of Elem`);
    }
    
    Object.keys(attribs).forEach((attrib) => {
        if (attrib === "innerHTML") {
            if (attribs[attrib] === undefined) {
                elem.innerHTML = '';
                return;
            }

            elem.innerHTML = attribs[attrib];
        }

        elem.setAttribute(attrib, attribs[attrib]);
    });

    return elem;
}