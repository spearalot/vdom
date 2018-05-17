//
// Build a vdom from JSX
//

export default function (node, attrs, ...args) {
    let stack = [], children = [];
    var attributes = attrs ? {...attrs} : {}, classes = [];

    if (attributes.classList) {
        classes = [...attributes.classList].sort();
        delete attributes.classList;
    }

    for (var i = args.length - 1; i >= 0; --i)
        stack.push(args[i]);

    var c, concat = false;
    while (stack.length) {
        c = stack.pop();
        if (c.pop) {
            for (var i = c.length - 1; i >= 0; --i)
                stack.push(c[i]);
        } else {
            if (typeof c === 'number')
                c = String(c);
            if (typeof c === 'string') {
                if (concat)
                    children[children.length - 1] += c;
                else
                    children.push(c);
                concat = true;
            } else {
                children.push(c);
                concat = false;
            }
        }
    }

    var vnode;
    if (typeof node === 'function')
        vnode = {
            type: node,
            props: attributes,
            children: children
        }
    else
        vnode = { 
            type: node,
            attributes: attributes,
            classes: classes,
            children: children
        }

    return vnode;
}
