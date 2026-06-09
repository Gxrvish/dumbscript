// dumbscript: build DOM trees inline with JS.
// dumb(tagDefination, ...args) where each arg is one of:
//   - string            -> text node
//   - Node (dumb child) -> appended as child element
//   - object            -> attributes (style may be a nested object)

type StyleObject = Record<string, string>;
type Attributes = { style?: StyleObject } & Record<
    string,
    string | StyleObject
>;
type DumbArg =
    | string
    | Node
    | Attributes
    | Array<string | Node | Attributes | (() => [string, ...DumbArg[]])>
    | (() => [string, ...DumbArg[]]);

const parseTagDefination = (tagDefination: string) => {
    const tagParts = tagDefination.split(/([.#])/);
    const tag = tagParts[0] || "div";
    const classes: Set<string> = new Set();
    let id: string | null = null;

    for (let i = 1; i < tagParts.length; i += 2) {
        if (tagParts[i] === ".") {
            classes.add(tagParts[i + 1]);
        } else if (tagParts[i] === "#") {
            if (id) {
                throw new Error(
                    "Multiple IDs are not allowed in tag definition"
                );
            }
            id = tagParts[i + 1];
        }
    }

    return { tag, classes: [...classes], id };
};

const applyAttributes = (element: HTMLElement, attributes: Attributes) => {
    for (const [key, value] of Object.entries(attributes)) {
        if (key === "style" && value && typeof value === "object") {
            for (const [prop, propValue] of Object.entries(value)) {
                element.style.setProperty(prop, String(propValue));
            }
        } else {
            element.setAttribute(key, String(value));
        }
    }
};

const isPlainObject = (arg: DumbArg): arg is Attributes =>
    typeof arg === "object" &&
    arg !== null &&
    !Array.isArray(arg) &&
    !(arg instanceof Node);

// Handles one child of any kind; recurses for arrays.
const appendChild = (parent: HTMLElement, child: DumbArg) => {
    if (typeof child === "string") {
        parent.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
        parent.appendChild(child);
    } else if (Array.isArray(child)) {
        child.forEach((c) => appendChild(parent, c));
    } else if (typeof child === "function") {
        const [nestedTagDefination, ...nestedArgs] = child();
        parent.appendChild(dumb(nestedTagDefination, ...nestedArgs));
    } else {
        throw new Error("Invalid argument type for dumb function");
    }
};

export const dumb = (
    tagDefination: string,
    ...args: DumbArg[]
): HTMLElement => {
    const { tag, classes, id } = parseTagDefination(tagDefination);

    const element = document.createElement(tag);
    if (classes.length) element.className = classes.join(" ");
    if (id) element.id = id;

    // Each arg is either an attributes object or a child (string, Node,
    // array, or lazy function) — appendChild dispatches children by type.
    for (const arg of args) {
        if (isPlainObject(arg)) {
            applyAttributes(element, arg);
        } else {
            appendChild(element, arg);
        }
    }

    return element;
};
