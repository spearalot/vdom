//
// Allows us to view the DOM as immutable.
// TODO: Reduce copying and key comparision.
//


//============================================================================= 
// Render vdom into root
//============================================================================= 
export function render(root, node) {
    if (typeof node === 'string')
        return render_text(root, node);
    if (typeof node.type === 'function')
        return render_component(root, node);
    return render_tag(root, node);
}


function render_text(root, vnode) {
    let el = document.createTextNode(vnode);
    root.appendChild(el);
    return {el, vnode};
}


function render_tag(root, vnode) {
    let el = document.createElement(vnode.type);
    let classes = vnode.classes || [];
    let attributes = vnode.attributes || {};
    var children = vnode.children || [];

    classes.forEach(c => el.classList.add(c));
    for (let k in attributes)
        el[k] = attributes[k];

    children = children.map(c => render(el, c));
    root.appendChild(el);
    return {el, children, vnode};
}
    

function render_component(root, vnode) {
    let x = instantiate_component(vnode.type, vnode.props, vnode.children);
    return {...render(root, x), component: vnode.type};
}


//============================================================================= 
// Patch an existing node with values from vnode
//============================================================================= 
export function patch(node, vnode) {
    if (typeof vnode === 'string')
        return patch_text(node, vnode);

    if (typeof vnode.type === 'function') {
        if (node.component != vnode.type)
            return patch_replace(node, vnode);

        if (node.component == vnode.type)
            return patch_component(node, vnode);
    }

    if (node.vnode.type != vnode.type)
        return patch_replace(node, vnode);

    return patch_tag(node, vnode);
}


function patch_replace(node, vnode) {
    let parent = node.el.parentElement;
    parent.removeChild(node.el);
    return render(parent, vnode);
}


function patch_text(node, vnode) {
    if (node.vnode !== vnode) 
        node.el.textContent = vnode;
    return {...node, vnode};
}


function patch_tag(node, vnode) {
    patch_attributes(node.el, node.vnode.attributes || {}, vnode.attributes || {});
    patch_classes(node.el, node.vnode.classes || [], vnode.classes || []);
    let children = patch_children(node.el, node.children || [], vnode.children || []);
    return {...node, children, vnode};
}


function patch_attributes(el, current, target) {
    let acc = {...current};
    for (let k in target) {
        if (target[k] !== acc[k])
            el[k] = target[k];
        delete acc[k];
    }

    for (let k in acc)
        el[k] = undefined;
}


function patch_classes(el, current, target) {
    var i = 0, j = 0;
    while (i < current.length || j < target.length) {
        if (i == current.length) {
            el.classList.add(target[j++]);
        } else if (j == target.length) {
            el.classList.remove(current[i++]);
        } else if (current[i] > target[j]) {
            el.classList.add(target[j++])
        } else if (current[i] < target[j]) {
            el.classList.remove(current[i++]);
        } else {
            ++i, ++j;
        }
    }
}


// TODO: Replace with a key merge algorithm
function patch_children(el, current, target) {
    var children = [], c, i;
    for (i = 0; i < target.length; ++i) {
        c = target[i];
        if (i < current.length)
            children.push(patch(current[i], c));
        else
            children.push(render(el, c));
    }

    while (i < current.length)
        el.removeChild(current[i++].el);

    return children;
}


// TODO: We should compare props/children... and only re-render on diff.
function patch_component(node, vnode) {
    let x = instantiate_component(node.component, vnode.props, vnode.children);
    return patch(node, x);
}


//============================================================================= 
// Utils
//============================================================================= 
function instantiate_component(component, props, children) {
    if (component.prototype.render) {
        let x  = new component(props, children);
        return x.render();
    } 
    return component(props, children);
}

