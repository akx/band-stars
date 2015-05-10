"use strict";
require("style!css!./style.css");

let m = require("mithril");

let all = require("lodash/collection/all");
let compact = require("lodash/array/compact");
let filter = require("lodash/collection/filter");
let flatten = require("lodash/array/flatten");
let keys = require("lodash/object/keys");
let map = require("lodash/collection/map");
let partial = require("lodash/function/partial");
let uniq = require("lodash/array/uniq");
let values = require("lodash/object/values");
let zipObject = require("lodash/array/zipObject");

let g2t = require("./genre2theme");
let g2i = require("./genre2instruments");

let g2tMap = zipObject(map(g2t, (themes, genre) => [genre, zipObject(map(themes, (t) => [t, 1]))]));
let GENRES = keys(g2t).sort();
let INSTRUMENTS = uniq(flatten(map(values(g2i), keys))).sort();
let THEMES = uniq(flatten(values(g2t))).sort();

function controller() {
    /*jshint validthis:true */
    var ctrl = this;
    ctrl.instrumentFilter = m.prop({});
    ctrl.genreFilter = m.prop(null);
    ctrl.themeFilter = m.prop(null);

    ctrl.setInstrumentFilter = function(instrument, state) {
        var instrFilter = ctrl.instrumentFilter();
        instrFilter[instrument] = state;
        ctrl.instrumentFilter(instrFilter);
    };

    ctrl.setGenreFilter = function(genre) {
        ctrl.genreFilter(ctrl.genreFilter() == genre ? null : genre);
        ctrl.themeFilter(null);
    };

    ctrl.setThemeFilter = function(theme) {
        ctrl.themeFilter(ctrl.themeFilter() == theme ? null : theme);
        ctrl.genreFilter(null);
    };

}

function view(ctrl) {
    var genres = GENRES.slice();
    var themes = THEMES.slice();

    let instrFilter = compact(map(ctrl.instrumentFilter(), (v, instr) => v ? instr : null));
    if (instrFilter && instrFilter.length) {
        genres = filter(genres, (g) => !g2i[g] || all(instrFilter, (i) => g2i[g][i]));
    }

    if (ctrl.genreFilter()) {
        genres = [ctrl.genreFilter()];
        themes = filter(themes, (t) => g2tMap[genres[0]][t]);
    } else if (ctrl.themeFilter()) {
        themes = [ctrl.themeFilter()];
        genres = filter(genres, (g) => g2tMap[g][themes[0]]);
    }

    return m("div",
        m("div",
            map(INSTRUMENTS, (i) => m("label",
                m("input", {
                    type: "checkbox",
                    checked: instrFilter.indexOf(i) > -1,
                    onclick: m.withAttr("checked", partial(ctrl.setInstrumentFilter, i))
                }),
                i
            ))
        ),
        m("table",
            m("thead", m("tr",
                m("th"),
                map(genres, (g) => m("th", m("a", {"href": "#", "data-genre": g, onclick: partial(ctrl.setGenreFilter, g)}, g))))
            ),
            m("tbody", map(themes,
                (t) => m(
                    "tr",
                    m("th", m("a", {"href": "#", "data-theme": t, onclick: partial(ctrl.setThemeFilter, t)}, t)),
                    map(genres, (g) => m("td", {title: g + "/" + t, className: g2tMap[g][t] && "y"}, (g2tMap[g][t] ? "\u25CF" : null)))
                )
            ))
        )
    );
}

m.mount(document.body, {controller: controller, view: view});
