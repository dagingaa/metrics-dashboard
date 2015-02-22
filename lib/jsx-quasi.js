import React from 'react';

var paramRegex  = /__(\d)+/;
var parser      = new DOMParser();
var errorDoc    = parser.parseFromString('INVALID', 'text/xml');
var errorNs     = errorDoc.getElementsByTagName("parsererror")[0].namespaceURI;

// turns the array of string parts into a DOM
// throws if the result is an invalid XML document.
function quasiToDom(parts) {

    // turn ["<div class='", "'>Hi</div>"] 
    // into "<div class='__0'>Hi</div>"
    var xmlstr = parts.reduce((xmlstr, part, i) => {
        xmlstr += part;
        if (i != parts.length - 1) { // the last part has no ending param
            xmlstr += `__${i}`;
        }

        return xmlstr;
    }, "");

    // parse into DOM, check for a parse error
    // browser's DOMParser is neat, but error handling is awful
    var doc      = parser.parseFromString(xmlstr, 'text/xml');
    var errors   = doc.getElementsByTagNameNS(errorNs, 'parsererror');
    var error    = '';
    if (errors.length > 0) {
        error = errors[0].textContent.split('\n')[0];
        throw `invalid jsx: ${error}\n${xmlstr}`; 
    }

    return doc;
}

// turn a document into a tree of react components
// replaces tags, attribute values and text nodes that look like the param
// placeholder we add above, with the values from the parameters array.
function domToReact(node, params) {
    var match;

    // text node, comment, etc
    if (node.nodeValue) { 
        var value = node.nodeValue.trim();
        if (value.length === 0) {
            return undefined;
        }

        match = value.match(paramRegex);
        return match ? params[parseInt(match[1])] : value;
    }

    // node to get react for
    // if the node name is a placeholder, assume the param is a component class
    var reactNode;
    match = node.localName.match(paramRegex)
    reactNode = match ? React.createFactory(params[parseInt(match[1])]) : React.DOM[node.localName];

    // if we don't have a component, give a better error message
    if (reactNode === undefined) {
        throw `Unknown React component: ${node.localName}, bailing.`;
    }

    // attributes of the node
    var reactAttrs = {};
    for (var i = node.attributes.length - 1; i >= 0; i--) {
        var attr = node.attributes[i];
        reactAttrs[attr.name] = attr.value;

        match = attr.value.match(paramRegex); 
        if (match) {
            reactAttrs[attr.name] = params[parseInt(match[1])];
        }
    }

    // recursively turn children into react components
    var reactChildren = [];
    for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        var reactChild = domToReact(child, params);
        if (reactChild) {
            reactChildren.push(reactChild);
        }
    }

    return reactNode(reactAttrs, reactChildren);
}

export default function jsx(parts, ...params) {
    var doc     = quasiToDom(parts);
    var react   = domToReact(doc.firstChild, params);
    return react;
}
