// THis is usage of dumbscript, you can import it and use it in your project as
// you like
// I'll soon upload it to npm, but for now you can just copy the dumbscript.js
// file and import it in your project like this:
import { dumb } from "./dumbscript";

const rootElement: HTMLElement | null = document.getElementById("root");

const page = dumb(
    "div#page",
    {},
    dumb(
        "div#header",
        dumb("h1.classy", "h", { style: { "background-color": "#22f" } })
    ),
    dumb(
        "div#menu",
        { style: { "background-color": "#2f2" } },
        dumb("ul", dumb("li", "one"), dumb("li", "two"), dumb("li", "three"))
    ),
    dumb("h2", "content title", { style: { "background-color": "#f22" } }),
    dumb(
        "p",
        "so it's just like a templating engine,\n but easy to use inline with javascript\n"
    ),
    dumb(
        "p",
        "the intention is for this to be used to create\n reusable, interactive html widgets. "
    ),
    dumb(
        "ul",
        {},
        ["a", "b", "c"].map((x) => dumb("li", x))
    )
);
rootElement?.appendChild(page);
