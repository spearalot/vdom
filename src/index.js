import { render, patch } from './vdom.js';
import h from './h.js';

class vdom {
    constructor(root) {
        this._root = root;
    }

    render(vroot, props = {}) {
        if (this._acc)
            this._acc = patch(this._acc, normalize_vnode(vroot, props));
        else
            this._acc = render(this._root, normalize_vnode(vroot, props));
    }
}

function normalize_vnode(node, props) {
    if (typeof node === 'function')
        return {
            type: node, 
            props: props, 
            children: []
        };
    return node;
}

export { h, vdom }


