require("style!css!./style.css");

var m = require("mithril");
var map = require("lodash/collection/map");
var values = require("lodash/object/values");
var keys = require("lodash/object/keys");
var zipObject = require("lodash/array/zipObject");
var flatten = require("lodash/array/flatten");
var uniq = require("lodash/array/uniq");

var g2t = require("./genre2theme");
var g2tMap = zipObject(map(g2t, (themes, genre) => [genre, zipObject(map(themes, (t) => [t, 1]))]));
var genres = keys(g2t);
var themes = uniq(flatten(values(g2t))).sort();

function controller() {
}

function view(ctrl) {
    return m("div",
        m("table",
            m("thead", m("tr", m("th"), map(genres, (g) => m("th", g)))),
            m("tbody", map(themes,
                (t) => m(
                    "tr",
                    m("th", t),
                    map(genres, (g) => m("td", {title: g + "/" + t}, (g2tMap[g][t] ? "+" : null)))
                )
            ))
        )
    );
}

m.mount(document.body, {controller: controller, view: view});
