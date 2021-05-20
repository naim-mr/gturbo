! function(e, t) { "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.cytoscapeEdgeEditing = t() : e.cytoscapeEdgeEditing = t() }(window, (function() {
    return function(e) {
        var t = {};

        function n(o) { if (t[o]) return t[o].exports; var i = t[o] = { i: o, l: !1, exports: {} }; return e[o].call(i.exports, i, i.exports, n), i.l = !0, i.exports }
        return n.m = e, n.c = t, n.d = function(e, t, o) { n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: o }) }, n.r = function(e) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 }) }, n.t = function(e, t) {
            if (1 & t && (e = n(e)), 8 & t) return e;
            if (4 & t && "object" == typeof e && e && e.__esModule) return e;
            var o = Object.create(null);
            if (n.r(o), Object.defineProperty(o, "default", { enumerable: !0, value: e }), 2 & t && "string" != typeof e)
                for (var i in e) n.d(o, i, function(t) { return e[t] }.bind(null, i));
            return o
        }, n.n = function(e) { var t = e && e.__esModule ? function() { return e.default } : function() { return e }; return n.d(t, "a", t), t }, n.o = function(e, t) { return Object.prototype.hasOwnProperty.call(e, t) }, n.p = "", n(n.s = 2)
    }([function(e, t, n) {
        "use strict";
        var o = {
            currentCtxEdge: void 0,
            currentCtxPos: void 0,
            currentAnchorIndex: void 0,
            ignoredClasses: void 0,
            setIgnoredClasses: function(e) { this.ignoredClasses = e },
            syntax: { bend: { edge: "segments", class: "edgebendediting-hasbendpoints", multiClass: "edgebendediting-hasmultiplebendpoints", weight: "cyedgebendeditingWeights", distance: "cyedgebendeditingDistances", weightCss: "segment-weights", distanceCss: "segment-distances", pointPos: "bendPointPositions" }, control: { edge: "unbundled-bezier", class: "edgecontrolediting-hascontrolpoints", multiClass: "edgecontrolediting-hasmultiplecontrolpoints", weight: "cyedgecontroleditingWeights", distance: "cyedgecontroleditingDistances", weightCss: "control-point-weights", distanceCss: "control-point-distances", pointPos: "controlPointPositions" } },
            getEdgeType: function(e) { return e ? e.hasClass(this.syntax.bend.class) ? "bend" : e.hasClass(this.syntax.control.class) ? "control" : e.css("curve-style") === this.syntax.bend.edge ? "bend" : e.css("curve-style") === this.syntax.control.edge ? "control" : e.data(this.syntax.bend.pointPos) && e.data(this.syntax.bend.pointPos).length > 0 ? "bend" : e.data(this.syntax.control.pointPos) && e.data(this.syntax.control.pointPos).length > 0 ? "control" : "inconclusive" : "inconclusive" },
            initAnchorPoints: function(e, t, n) {
                for (var o = 0; o < n.length; o++) {
                    var i = n[o],
                        s = this.getEdgeType(i);
                    if ("inconclusive" !== s && !this.isIgnoredEdge(i)) {
                        var d;
                        "bend" === s ? d = e.apply(this, i) : "control" === s && (d = t.apply(this, i));
                        var a = this.convertToRelativePositions(i, d);
                        a.distances.length > 0 && (i.data(this.syntax[s].weight, a.weights), i.data(this.syntax[s].distance, a.distances), i.addClass(this.syntax[s].class), a.distances.length > 1 && i.addClass(this.syntax[s].multiClass))
                    }
                }
            },
            isIgnoredEdge: function(e) {
                var t = e.source().position("x"),
                    n = e.source().position("y"),
                    o = e.target().position("x"),
                    i = e.target().position("y");
                if (t == o && n == i || e.source().id() == e.target().id()) return !0;
                for (var s = 0; this.ignoredClasses && s < this.ignoredClasses.length; s++)
                    if (e.hasClass(this.ignoredClasses[s])) return !0;
                return !1
            },
            getLineDirection: function(e, t) { return e.y == t.y && e.x < t.x ? 1 : e.y < t.y && e.x < t.x ? 2 : e.y < t.y && e.x == t.x ? 3 : e.y < t.y && e.x > t.x ? 4 : e.y == t.y && e.x > t.x ? 5 : e.y > t.y && e.x > t.x ? 6 : e.y > t.y && e.x == t.x ? 7 : 8 },
            getSrcTgtPointsAndTangents: function(e) {
                var t = e.source(),
                    n = e.target(),
                    o = (n.position(), t.position(), t.position()),
                    i = n.position(),
                    s = (i.y - o.y) / (i.x - o.x);
                return { m1: s, m2: -1 / s, srcPoint: o, tgtPoint: i }
            },
            getIntersection: function(e, t, n) {
                void 0 === n && (n = this.getSrcTgtPointsAndTangents(e));
                var o, i, s = n.srcPoint,
                    d = (n.tgtPoint, n.m1),
                    a = n.m2;
                if (d == 1 / 0 || d == -1 / 0) o = s.x, i = t.y;
                else if (0 == d) o = t.x, i = s.y;
                else {
                    var r = s.y - d * s.x;
                    i = d * (o = (t.y - a * t.x - r) / (d - a)) + r
                }
                return { x: o, y: i }
            },
            getAnchorsAsArray: function(e) {
                var t = this.getEdgeType(e);
                if ("inconclusive" !== t && e.css("curve-style") === this.syntax[t].edge) {
                    for (var n = [], o = e.pstyle(this.syntax[t].weightCss) ? e.pstyle(this.syntax[t].weightCss).pfValue : [], i = e.pstyle(this.syntax[t].distanceCss) ? e.pstyle(this.syntax[t].distanceCss).pfValue : [], s = Math.min(o.length, i.length), d = e.source().position(), a = e.target().position(), r = a.y - d.y, c = a.x - d.x, l = Math.sqrt(c * c + r * r), g = { x: c / l, y: r / l }, u = -g.y, h = g.x, y = 0; y < s; y++) {
                        var v = o[y],
                            f = i[y],
                            p = 1 - v,
                            x = v,
                            m = { x1: d.x, x2: a.x, y1: d.y, y2: a.y },
                            b = { x: m.x1 * p + m.x2 * x, y: m.y1 * p + m.y2 * x };
                        n.push(b.x + u * f, b.y + h * f)
                    }
                    return n
                }
            },
            convertToRelativePosition: function(e, t, n) {
                void 0 === n && (n = this.getSrcTgtPointsAndTangents(e));
                var o, i = this.getIntersection(e, t, n),
                    s = i.x,
                    d = i.y,
                    a = n.srcPoint,
                    r = n.tgtPoint;
                o = s != a.x ? (s - a.x) / (r.x - a.x) : d != a.y ? (d - a.y) / (r.y - a.y) : 0;
                var c = Math.sqrt(Math.pow(d - t.y, 2) + Math.pow(s - t.x, 2)),
                    l = this.getLineDirection(a, r),
                    g = this.getLineDirection(i, t);
                return l - g != -2 && l - g != 6 && 0 != c && (c *= -1), { weight: o, distance: c }
            },
            convertToRelativePositions: function(e, t) {
                for (var n = this.getSrcTgtPointsAndTangents(e), o = [], i = [], s = 0; t && s < t.length; s++) {
                    var d = t[s],
                        a = this.convertToRelativePosition(e, d, n);
                    o.push(a.weight), i.push(a.distance)
                }
                return { weights: o, distances: i }
            },
            getDistancesString: function(e, t) { for (var n = "", o = e.data(this.syntax[t].distance), i = 0; o && i < o.length; i++) n = n + " " + o[i]; return n },
            getWeightsString: function(e, t) { for (var n = "", o = e.data(this.syntax[t].weight), i = 0; o && i < o.length; i++) n = n + " " + o[i]; return n },
            addAnchorPoint: function(e, t) {
                var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0;
                void 0 !== e && void 0 !== t || (e = this.currentCtxEdge, t = this.currentCtxPos), void 0 === n && (n = this.getEdgeType(e));
                for (var o, i = this.syntax[n].weight, s = this.syntax[n].distance, d = this.convertToRelativePosition(e, t), a = d.weight, r = e.source().position("x"), c = e.source().position("y"), l = e.target().position("x"), g = e.target().position("y"), u = this.convertToRelativePosition(e, { x: r, y: c }).weight, h = this.convertToRelativePosition(e, { x: l, y: g }).weight, y = [u].concat(e.data(i) ? e.data(i) : []).concat([h]), v = this.getAnchorsAsArray(e), f = 1 / 0, p = [r, c].concat(v || []).concat([l, g]), x = -1, m = 0; m < y.length - 1; m++) {
                    var b = y[m],
                        A = y[m + 1],
                        w = this.compareWithPrecision(a, b, !0),
                        P = this.compareWithPrecision(a, A),
                        E = this.compareWithPrecision(a, A, !0),
                        C = this.compareWithPrecision(a, b);
                    if (w && P || E && C) {
                        var T = { x: r = p[2 * m], y: c = p[2 * m + 1] },
                            M = { x: l = p[2 * m + 2], y: g = p[2 * m + 3] },
                            I = (c - g) / (r - l),
                            S = -1 / I,
                            R = { srcPoint: T, tgtPoint: M, m1: I, m2: S },
                            D = this.getIntersection(e, t, R),
                            F = Math.sqrt(Math.pow(t.x - D.x, 2) + Math.pow(t.y - D.y, 2));
                        F < f && (f = F, o = D, x = m)
                    }
                }
                void 0 !== o && (t = o), d = this.convertToRelativePosition(e, t), void 0 === o && (d.distance = 0);
                var B = e.data(i),
                    O = e.data(s);
                return O = O || [], 0 === (B = B || []).length && (x = 0), -1 != x && (B.splice(x, 0, d.weight), O.splice(x, 0, d.distance)), e.data(i, B), e.data(s, O), e.addClass(this.syntax[n].class), (B.length > 1 || O.length > 1) && e.addClass(this.syntax[n].multiClass), x
            },
            removeAnchor: function(e, t) {
                void 0 !== e && void 0 !== t || (e = this.currentCtxEdge, t = this.currentAnchorIndex);
                var n = this.getEdgeType(e);
                if (!this.edgeTypeInconclusiveShouldntHappen(n, "anchorPointUtilities.js, removeAnchor")) {
                    var o = this.syntax[n].weight,
                        i = this.syntax[n].distance,
                        s = this.syntax[n].pointPos,
                        d = e.data(o),
                        a = e.data(i),
                        r = e.data(s);
                    d.splice(t, 1), a.splice(t, 1), r && r.splice(t, 1), 1 == d.length || 1 == a.length ? e.removeClass(this.syntax[n].multiClass) : 0 == d.length || 0 == a.length ? (e.removeClass(this.syntax[n].class), e.data(o, []), e.data(i, [])) : (e.data(o, d), e.data(i, a))
                }
            },
            removeAllAnchors: function(e) {
                void 0 === e && (e = this.currentCtxEdge);
                var t = this.getEdgeType(e);
                if (!this.edgeTypeInconclusiveShouldntHappen(t, "anchorPointUtilities.js, removeAllAnchors")) {
                    e.removeClass(this.syntax[t].class), e.removeClass(this.syntax[t].multiClass);
                    var n = this.syntax[t].weight,
                        o = this.syntax[t].distance,
                        i = this.syntax[t].pointPos;
                    e.data(n, []), e.data(o, []), e.data(i) && e.data(i, [])
                }
            },
            calculateDistance: function(e, t) {
                var n = e.x - t.x,
                    o = e.y - t.y;
                return Math.sqrt(Math.pow(n, 2) + Math.pow(o, 2))
            },
            compareWithPrecision: function(e, t) {
                var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                    o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : .01,
                    i = e - t;
                return Math.abs(i) <= o || (n ? e < t : e > t)
            },
            edgeTypeInconclusiveShouldntHappen: function(e, t) { return "inconclusive" === e && (console.log("In " + t + ": edge type inconclusive should never happen here!!"), !0) }
        };
        e.exports = o
    }, function(e, t, n) {
        "use strict";
        var o, i, s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) { return typeof e } : function(e) { return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e },
            d = (o = Math.max, i = Date.now || function() { return (new Date).getTime() }, function(e, t, n) {
                var d, a, r, c, l, g, u, h, y, v = 0,
                    f = !1,
                    p = !0;
                if ("function" != typeof e) throw new TypeError("Expected a function");
                if (t = t < 0 ? 0 : +t || 0, !0 === n) {
                    var x = !0;
                    p = !1
                } else y = void 0 === (h = n) ? "undefined" : s(h), !h || "object" != y && "function" != y || (x = !!n.leading, f = "maxWait" in n && o(+n.maxWait || 0, t), p = "trailing" in n ? !!n.trailing : p);

                function m(t, n) { n && clearTimeout(n), a = g = u = void 0, t && (v = i(), r = e.apply(l, d), g || a || (d = l = void 0)) }

                function b() {
                    var e = t - (i() - c);
                    e <= 0 || e > t ? m(u, a) : g = setTimeout(b, e)
                }

                function A() { m(p, g) }

                function w() {
                    if (d = arguments, c = i(), l = this, u = p && (g || !x), !1 === f) var n = x && !g;
                    else {
                        a || x || (v = c);
                        var o = f - (c - v),
                            s = o <= 0 || o > f;
                        s ? (a && (a = clearTimeout(a)), v = c, r = e.apply(l, d)) : a || (a = setTimeout(A, o))
                    }
                    return s && g ? g = clearTimeout(g) : g || t === f || (g = setTimeout(b, t)), n && (s = !0, r = e.apply(l, d)), !s || g || a || (d = l = void 0), r
                }
                return w.cancel = function() { g && clearTimeout(g), a && clearTimeout(a), v = 0, a = g = u = void 0 }, w
            });
        e.exports = d
    }, function(e, t, n) {
        "use strict";
        var o, i, s;
        i = n(0), n(1), s = function(e, t, o) {
            var s = n(3);
            if (e && t && o) {
                var d, a = { bendPositionsFunction: function(e) { return e.data("bendPointPositions") }, controlPositionsFunction: function(e) { return e.data("controlPointPositions") }, initAnchorsAutomatically: !0, ignoredClasses: [], undoable: !1, anchorShapeSizeFactor: 3, zIndex: 999, enabled: !0, bendRemovalSensitivity: 8, addBendMenuItemTitle: "Add Bend Point", removeBendMenuItemTitle: "Remove Bend Point", removeAllBendMenuItemTitle: "Remove All Bend Points", addControlMenuItemTitle: "Add Control Point", removeControlMenuItemTitle: "Remove Control Point", removeAllControlMenuItemTitle: "Remove All Control Points", moveSelectedAnchorsOnKeyEvents: function() { return !0 }, enableMultipleAnchorRemovalOption: !1 },
                    r = !1;
                e("core", "edgeEditing", (function(e) {
                    var t = this;
                    return "initialized" === e ? r : ("get" !== e && (d = function(e, t) {
                        var n = {};
                        for (var o in e) n[o] = e[o];
                        for (var o in t)
                            if ("bendRemovalSensitivity" == o) {
                                var i = t[o];
                                isNaN(i) || (n[o] = i >= 0 && i <= 20 ? t[o] : i < 0 ? 0 : 20)
                            } else n[o] = t[o];
                        return n
                    }(a, e), r = !0, t.style().selector(".edgebendediting-hasbendpoints").css({ "curve-style": "segments", "segment-distances": function(e) { return i.getDistancesString(e, "bend") }, "segment-weights": function(e) { return i.getWeightsString(e, "bend") }, "edge-distances": "node-position" }), t.style().selector(".edgecontrolediting-hascontrolpoints").css({ "curve-style": "unbundled-bezier", "control-point-distances": function(e) { return i.getDistancesString(e, "control") }, "control-point-weights": function(e) { return i.getWeightsString(e, "control") }, "edge-distances": "node-position" }), i.setIgnoredClasses(d.ignoredClasses), d.initAnchorsAutomatically && i.initAnchorPoints(d.bendPositionsFunction, d.controlPositionsFunction, t.edges(), d.ignoredClasses), d.enabled ? s(d, t) : s("unbind", t)), r ? { getAnchorsAsArray: function(e) { return i.getAnchorsAsArray(e) }, initAnchorPoints: function(e) { i.initAnchorPoints(d.bendPositionsFunction, d.controlPositionsFunction, e) }, deleteSelectedAnchor: function(e, t) { i.removeAnchor(e, t) } } : void 0)
                }))
            }
        }, e.exports && (e.exports = s), void 0 === (o = function() { return s }.call(t, n, t, e)) || (e.exports = o), "undefined" != typeof cytoscape && $ && Konva && s(cytoscape, $, Konva)
    }, function(e, t, n) {
        "use strict";
        var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) { return typeof e } : function(e) { return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e },
            i = n(1),
            s = n(0),
            d = n(4),
            a = n(5),
            r = 0;
        e.exports = function(e, t) {
            var n, c, l, g, u, h, y, v, f, p, x, m, b, A, w, P, E, C, T = e,
                M = "cy-edge-bend-editing-cxt-add-bend-point" + r,
                I = "cy-edge-bend-editing-cxt-remove-bend-point" + r,
                S = "cy-edge-bend-editing-cxt-remove-multiple-bend-point" + r,
                R = "cy-edge-control-editing-cxt-add-control-point" + r,
                D = "cy-edge-control-editing-cxt-remove-control-point" + r,
                F = "cy-edge-bend-editing-cxt-remove-multiple-control-point" + r,
                B = null,
                O = null,
                K = !1,
                W = {
                    init: function() {
                        a(t, s, e);
                        var o = e,
                            T = $(this),
                            W = "cy-node-edge-editing-stage" + r;
                        r++;
                        var k, z, j = $('<div id="' + W + '"></div>');
                        T.find("#" + W).length < 1 && T.append(j), (k = Konva.stages.length < r ? new Konva.Stage({ id: "node-edge-editing-stage", container: W, width: T.width(), height: T.height() }) : Konva.stages[r - 1]).getChildren().length < 1 ? (z = new Konva.Layer, k.add(z)) : z = k.getChildren()[0];
                        var L = {
                                edge: void 0,
                                edgeType: "inconclusive",
                                anchors: [],
                                touchedAnchor: void 0,
                                touchedAnchorIndex: void 0,
                                bindListeners: function(e) { e.on("mousedown touchstart", this.eMouseDown) },
                                unbindListeners: function(e) { e.off("mousedown touchstart", this.eMouseDown) },
                                eMouseDown: function(e) {
                                    t.autounselectify(!1), K = !0, L.touchedAnchor = e.target, C = !1, L.edge.unselect();
                                    var n = s.syntax[L.edgeType].weight,
                                        o = s.syntax[L.edgeType].distance,
                                        i = L.edge;
                                    ue = { edge: i, type: L.edgeType, weights: i.data(n) ? [].concat(i.data(n)) : [], distances: i.data(o) ? [].concat(i.data(o)) : [] },
                                        function() {
                                            P = t.style()._private.coreStyle["active-bg-opacity"] ? t.style()._private.coreStyle["active-bg-opacity"].value : .15;
                                            t.style().selector("core").style("active-bg-opacity", 0).update()
                                        }(), de(), t.autoungrabify(!0), z.getStage().on("contentTouchend contentMouseup", L.eMouseUp), z.getStage().on("contentMouseout", L.eMouseOut)
                                },
                                eMouseUp: function(e) { K = !1, L.touchedAnchor = void 0, C = !1, L.edge.select(), t.style().selector("core").style("active-bg-opacity", P).update(), ae(), t.autounselectify(!0), t.autoungrabify(!1), z.getStage().off("contentTouchend contentMouseup", L.eMouseUp), z.getStage().off("contentMouseout", L.eMouseOut) },
                                eMouseOut: function(e) { C = !0 },
                                clearAnchorsExcept: function() {
                                    var e = this,
                                        t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : void 0,
                                        n = !1;
                                    this.anchors.forEach((function(o, i) { t && o === t ? n = !0 : (e.unbindListeners(o), o.destroy()) })), n ? this.anchors = [t] : (this.anchors = [], this.edge = void 0, this.edgeType = "inconclusive")
                                },
                                renderAnchorShapes: function(e) {
                                    if (this.edge = e, this.edgeType = s.getEdgeType(e), e.hasClass("edgebendediting-hasbendpoints") || e.hasClass("edgecontrolediting-hascontrolpoints")) {
                                        for (var t = s.getAnchorsAsArray(e), n = .65 * oe(e), o = (e.source().position(), e.target().position(), 0); t && o < t.length; o += 2) {
                                            var i = t[o],
                                                d = t[o + 1];
                                            this.renderAnchorShape(i, d, n)
                                        }
                                        z.draw()
                                    }
                                },
                                renderAnchorShape: function(e, n, o) {
                                    var i = te({ x: e - o / 2, y: n - o / 2 });
                                    o *= t.zoom();
                                    var s = new Konva.Rect({ x: i.x, y: i.y, width: o, height: o, fill: "black", strokeWidth: 0, draggable: !0 });
                                    this.anchors.push(s), this.bindListeners(s), z.add(s)
                                }
                            },
                            U = function(e, n) {
                                var o = e.target || e.cyTarget;
                                if (!s.isIgnoredEdge(o)) {
                                    var i, d, a, r, c = s.getEdgeType(o);
                                    "inconclusive" === c ? (i = [], d = []) : (a = s.syntax[c].weight, r = s.syntax[c].distance, i = o.data(a) ? [].concat(o.data(a)) : o.data(a), d = o.data(r) ? [].concat(o.data(r)) : o.data(r));
                                    var l = { edge: o, type: c, weights: i, distances: d };
                                    s.addAnchorPoint(void 0, void 0, n), ee().undoable && t.undoRedo().do("changeAnchorPoints", l)
                                }
                                ne(), o.select()
                            },
                            _ = function(e) {
                                var n = L.edge,
                                    o = s.getEdgeType(n);
                                if (!s.edgeTypeInconclusiveShouldntHappen(o, "UiUtilities.js, cxtRemoveAnchorFcn")) {
                                    var i = { edge: n, type: o, weights: [].concat(n.data(s.syntax[o].weight)), distances: [].concat(n.data(s.syntax[o].distance)) };
                                    s.removeAnchor(), ee().undoable && t.undoRedo().do("changeAnchorPoints", i), setTimeout((function() { ne(), n.select() }), 50)
                                }
                            },
                            N = function(e) {
                                var n = L.edge,
                                    o = s.getEdgeType(n),
                                    i = { edge: n, type: o, weights: [].concat(n.data(s.syntax[o].weight)), distances: [].concat(n.data(s.syntax[o].distance)) };
                                s.removeAllAnchors(), ee().undoable && t.undoRedo().do("changeAnchorPoints", i), setTimeout((function() { ne(), n.select() }), 50)
                            },
                            q = o.handleReconnectEdge,
                            H = o.validateEdge,
                            V = o.actOnUnsuccessfulReconnection,
                            X = [{ id: M, content: o.addBendMenuItemTitle, selector: "edge", onClickFunction: function(e) { U(e, "bend") } }, { id: I, content: o.removeBendMenuItemTitle, selector: "edge", onClickFunction: _ }, { id: S, content: o.removeAllBendMenuItemTitle, selector: o.enableMultipleAnchorRemovalOption && ":selected.edgebendediting-hasmultiplebendpoints", onClickFunction: N }, { id: R, content: o.addControlMenuItemTitle, selector: "edge", coreAsWell: !0, onClickFunction: function(e) { U(e, "control") } }, { id: D, content: o.removeControlMenuItemTitle, selector: "edge", coreAsWell: !0, onClickFunction: _ }, { id: F, content: o.removeAllControlMenuItemTitle, selector: o.enableMultipleAnchorRemovalOption && ":selected.edgecontrolediting-hasmultiplecontrolpoints", onClickFunction: N }];
                        if (t.contextMenus) {
                            var G = t.contextMenus("get");
                            G.isActive() ? G.appendMenuItems(X) : t.contextMenus({ menuItems: X })
                        }
                        var J = i((function() {
                            j.attr("height", T.height()).attr("width", T.width()).css({ position: "absolute", top: 0, left: 0, "z-index": ee().zIndex }), setTimeout((function() {
                                var e = j.offset(),
                                    n = T.offset();
                                j.css({ top: -(e.top - n.top), left: -(e.left - n.left) }), z.getStage().setWidth(T.width()), z.getStage().setHeight(T.height()), t && ne()
                            }), 0)
                        }), 250);

                        function Q() { J() }
                        Q(), $(window).bind("resize", (function() { Q() }));
                        var Y, Z = T.data("cyedgeediting");

                        function ee() { return Y || (Y = T.data("cyedgeediting").options) }

                        function te(e) {
                            var n = t.pan(),
                                o = t.zoom();
                            return { x: e.x * o + n.x, y: e.y * o + n.y }
                        }

                        function ne() {
                            L.clearAnchorsExcept(L.touchedAnchor), null !== B && (B.destroy(), B = null), null !== O && (O.destroy(), O = null), z.draw(), E && (L.renderAnchorShapes(E), function(e) {
                                if (!e) return;
                                var n = s.getAnchorsAsArray(e);
                                void 0 === n && (n = []);
                                var o = e.sourceEndpoint(),
                                    i = e.targetEndpoint();
                                if (n.unshift(o.y), n.unshift(o.x), n.push(i.x), n.push(i.y), !n) return;
                                var d = { x: n[0], y: n[1] },
                                    a = { x: n[n.length - 2], y: n[n.length - 1] },
                                    r = { x: n[2], y: n[3] },
                                    c = { x: n[n.length - 4], y: n[n.length - 3] },
                                    l = .65 * oe(e);
                                ! function(e, n, o, i, s) {
                                    var d = e.x - o / 2,
                                        a = e.y - o / 2,
                                        r = n.x - o / 2,
                                        c = n.y - o / 2,
                                        l = i.x - o / 2,
                                        g = i.y - o / 2,
                                        u = s.x - o / 2,
                                        h = s.y - o / 2,
                                        y = te({ x: d, y: a }),
                                        v = te({ x: r, y: c });
                                    o = o * t.zoom() / 2;
                                    var f = te({ x: l, y: g }),
                                        p = te({ x: u, y: h }),
                                        x = o,
                                        m = Math.sqrt(Math.pow(f.x - y.x, 2) + Math.pow(f.y - y.y, 2)),
                                        b = y.x + x / m * (f.x - y.x),
                                        A = y.y + x / m * (f.y - y.y),
                                        w = Math.sqrt(Math.pow(p.x - v.x, 2) + Math.pow(p.y - v.y, 2)),
                                        P = v.x + x / w * (p.x - v.x),
                                        E = v.y + x / w * (p.y - v.y);
                                    null === B && (B = new Konva.Circle({ x: b + o, y: A + o, radius: o, fill: "black" }));
                                    null === O && (O = new Konva.Circle({ x: P + o, y: E + o, radius: o, fill: "black" }));
                                    z.add(B), z.add(O), z.draw()
                                }(d, a, l, r, c)
                            }(E))
                        }

                        function oe(e) { var t = ee().anchorShapeSizeFactor; return parseFloat(e.css("width")) <= 2.5 ? 2.5 * t : parseFloat(e.css("width")) * t }

                        function ie(e, t, n, o, i) { return e >= o - n / 2 && e <= o + n / 2 && t >= i - n / 2 && t <= i + n / 2 }

                        function se(e, t, n) { var o = s.getEdgeType(n); if ("inconclusive" === o) return -1; if (null == n.data(s.syntax[o].weight) || 0 == n.data(s.syntax[o].weight).length) return -1; for (var i = s.getAnchorsAsArray(n), d = oe(n), a = 0; i && a < i.length; a += 2) { if (ie(e, t, d, i[a], i[a + 1])) return a / 2 } return -1 }

                        function de() { b = t.panningEnabled(), A = t.zoomingEnabled(), w = t.boxSelectionEnabled(), t.zoomingEnabled(!1).panningEnabled(!1).boxSelectionEnabled(!1) }

                        function ae() { t.zoomingEnabled(A).panningEnabled(b).boxSelectionEnabled(w) }
                        null == Z && (Z = {}), Z.options = o;
                        var re = i((function(e, t, n, o) {
                            var i = e.data(s.syntax[t].weight),
                                d = e.data(s.syntax[t].distance),
                                a = s.convertToRelativePosition(e, o);
                            i[n] = a.weight, d[n] = a.distance, e.data(s.syntax[t].weight, i), e.data(s.syntax[t].distance, d)
                        }), 5);
                        b = t.panningEnabled(), A = t.zoomingEnabled(), w = t.boxSelectionEnabled();
                        var ce, le, ge, ue, he, ye, ve, fe, pe, xe = (Pe = t.edges(":selected")).length;
                        1 === xe && (E = Pe[0]), t.bind("zoom pan", g = function() { E && ne() }), t.on("data", "edge", (function() { E && ne() })), t.on("style", "edge.edgebendediting-hasbendpoints:selected, edge.edgecontrolediting-hascontrolpoints:selected", n = function() { setTimeout((function() { ne() }), 50) }), t.on("remove", "edge", c = function() {
                            if (this.selected()) {
                                if (xe -= 1, t.startBatch(), E && E.removeClass("cy-edge-editing-highlight"), 1 === xe) {
                                    var e = t.edges(":selected");
                                    1 === e.length ? (E = e[0]).addClass("cy-edge-editing-highlight") : E = void 0
                                } else E = void 0;
                                t.endBatch()
                            }
                            ne()
                        }), t.on("add", "edge", l = function() { this.selected() && (xe += 1, t.startBatch(), E && E.removeClass("cy-edge-editing-highlight"), 1 === xe ? (E = this).addClass("cy-edge-editing-highlight") : E = void 0, t.endBatch()), ne() }), t.on("select", "edge", u = function() { 0 != this.target().connectedEdges().length && 0 != this.source().connectedEdges().length && (xe += 1, t.startBatch(), E && E.removeClass("cy-edge-editing-highlight"), 1 === xe ? (E = this).addClass("cy-edge-editing-highlight") : E = void 0, t.endBatch(), ne()) }), t.on("unselect", "edge", h = function() {
                            if (xe -= 1, t.startBatch(), E && E.removeClass("cy-edge-editing-highlight"), 1 === xe) {
                                var e = t.edges(":selected");
                                1 === e.length ? (E = e[0]).addClass("cy-edge-editing-highlight") : E = void 0
                            } else E = void 0;
                            t.endBatch(), ne()
                        });
                        var me, be, Ae, we, Pe, Ee = !1;
                        t.on("tapstart", y = function(e) { le = e.position || e.cyPosition }), t.on("tapstart", "edge", v = function(e) {
                            if (E && E.id() === this.id()) {
                                ge = this;
                                var n = s.getEdgeType(this);
                                "inconclusive" === n && (n = "bend");
                                var o = function(e, t, n) {
                                    var o = oe(n),
                                        i = n._private.rscratch.allpts,
                                        s = { x: i[0], y: i[1] },
                                        d = { x: i[i.length - 2], y: i[i.length - 1] };
                                    return te(s), te(d), ie(e, t, o, s.x, s.y) ? 0 : ie(e, t, o, d.x, d.y) ? 1 : -1
                                }(le.x, le.y, this);
                                if (0 == o || 1 == o) {
                                    this.unselect(), ye = o, fe = 0 == o ? ge.source() : ge.target();
                                    var i = 0 == o ? "source" : "target",
                                        a = d.disconnectEdge(ge, t, e.renderedPosition, i);
                                    ve = a.dummyNode, ge = a.edge, de()
                                } else ce = void 0, he = !0
                            } else he = !1
                        }), t.on("drag", "node", m = function(e) { t.edges().unselect(), this.selected() || t.nodes().unselect() }), t.on("tapdrag", f = function(e) {
                            t.edges(":selected").length > 0 && t.autounselectify(!1);
                            var n = ge;
                            if (void 0 === ge || !s.isIgnoredEdge(n)) {
                                var o = s.getEdgeType(n);
                                if (he && !K && "inconclusive" !== o) {
                                    var i = s.syntax[o].weight,
                                        d = s.syntax[o].distance;
                                    ue = { edge: n, type: o, weights: n.data(i) ? [].concat(n.data(i)) : [], distances: n.data(d) ? [].concat(n.data(d)) : [] }, n.unselect(), ce = s.addAnchorPoint(n, le), ge = n, he = void 0, Ee = !0, de()
                                }
                                if (K || void 0 !== ge && (void 0 !== ce || void 0 !== ye)) { var a = e.position || e.cyPosition; - 1 != ye && ve ? ve.position(a) : null != ce ? re(n, o, ce, a) : K && (void 0 === L.touchedAnchorIndex && le && (L.touchedAnchorIndex = se(le.x, le.y, L.edge)), void 0 !== L.touchedAnchorIndex && re(L.edge, L.edgeType, L.touchedAnchorIndex, a)), e.target && e.target[0] && e.target.isNode() && (pe = e.target) }
                            }
                        }), t.on("tapend", p = function(e) {
                            C && z.getStage().fire("contentMouseup");
                            var n = ge || L.edge;
                            if (void 0 !== n) {
                                var o = L.touchedAnchorIndex;
                                if (null != o) {
                                    var i, a = n.source().position("x"),
                                        r = n.source().position("y"),
                                        c = n.target().position("x"),
                                        l = n.target().position("y"),
                                        g = s.getAnchorsAsArray(n),
                                        u = [a, r].concat(g).concat([c, l]),
                                        h = o + 1,
                                        y = h - 1,
                                        v = h + 1,
                                        f = { x: u[2 * h], y: u[2 * h + 1] },
                                        p = { x: u[2 * y], y: u[2 * y + 1] },
                                        x = { x: u[2 * v], y: u[2 * v + 1] };
                                    if (f.x === p.x && f.y === p.y || f.x === p.x && f.y === p.y) i = !0;
                                    else {
                                        var m, b = (p.y - x.y) / (p.x - x.x),
                                            A = { srcPoint: p, tgtPoint: x, m1: b, m2: -1 / b },
                                            w = s.getIntersection(n, f, A),
                                            P = Math.sqrt(Math.pow(f.x - w.x, 2) + Math.pow(f.y - w.y, 2));
                                        "bend" === (m = s.getEdgeType(n)) && P < ee().bendRemovalSensitivity && (i = !0)
                                    }
                                    i && s.removeAnchor(n, o)
                                } else if (null != ve && (0 == ye || 1 == ye)) {
                                    var E = fe,
                                        T = "valid",
                                        M = 0 == ye ? "source" : "target";
                                    if (pe) {
                                        var I = 0 == ye ? pe : n.source(),
                                            S = 1 == ye ? pe : n.target();
                                        "function" == typeof H && (T = H(n, I, S)), E = "valid" === T ? pe : fe
                                    }
                                    I = 0 == ye ? E : n.source(), S = 1 == ye ? E : n.target();
                                    if (n = d.connectEdge(n, fe, M), fe.id() !== E.id())
                                        if ("function" == typeof q) {
                                            var R = q(I.id(), S.id(), n.data());
                                            if (R && (d.copyEdge(n, R), s.initAnchorPoints(ee().bendPositionsFunction, ee().controlPositionsFunction, [R])), R && ee().undoable) {
                                                var D = { newEdge: R, oldEdge: n };
                                                t.undoRedo().do("removeReconnectedEdge", D), n = R
                                            } else R && (t.remove(n), n = R)
                                        } else {
                                            var F = 0 == ye ? { source: E.id() } : { target: E.id() },
                                                B = 0 == ye ? { source: fe.id() } : { target: fe.id() };
                                            if (ee().undoable && E.id() !== fe.id()) {
                                                var O = { edge: n, location: F, oldLoc: B };
                                                n = t.undoRedo().do("reconnectEdge", O).edge
                                            }
                                        }
                                        "valid" !== T && "function" == typeof V && V(), n.select(), t.remove(ve)
                                }
                            }
                            "inconclusive" === (m = s.getEdgeType(n)) && (m = "bend"), void 0 !== L.touchedAnchorIndex || Ee || (ue = void 0);
                            var K = s.syntax[m].weight;
                            void 0 !== n && void 0 !== ue && (n.data(K) ? n.data(K).toString() : null) != ue.weights.toString() && (Ee && (n.select(), t.autounselectify(!0)), ee().undoable && t.undoRedo().do("changeAnchorPoints", ue)), ce = void 0, ge = void 0, ue = void 0, he = void 0, ye = void 0, ve = void 0, fe = void 0, pe = void 0, le = void 0, Ee = !1, L.touchedAnchorIndex = void 0, ae(), setTimeout((function() { ne() }), 50)
                        }), t.on("edgeediting.movestart", (function(e, t) { we = !1, null != t[0] && t.forEach((function(e) { null == s.getAnchorsAsArray(e) || we || (be = { x: s.getAnchorsAsArray(e)[0], y: s.getAnchorsAsArray(e)[1] }, me = { firstTime: !0, firstAnchorPosition: { x: be.x, y: be.y }, edges: t }, Ae = e, we = !0) })) })), t.on("edgeediting.moveend", (function(e, n) {
                            if (null != me) {
                                var o = me.firstAnchorPosition,
                                    i = { x: s.getAnchorsAsArray(Ae)[0], y: s.getAnchorsAsArray(Ae)[1] };
                                me.positionDiff = { x: -i.x + o.x, y: -i.y + o.y }, delete me.firstAnchorPosition, ee().undoable && t.undoRedo().do("moveAnchorPoints", me), me = void 0
                            }
                        })), t.on("cxttap", x = function(e) {
                            var n, i, d = e.target || e.cyTarget,
                                a = !1;
                            try { a = d.isEdge() } catch (e) {}
                            a ? (n = d, i = s.getEdgeType(n)) : (n = L.edge, i = L.edgeType);
                            var r = t.contextMenus("get");
                            if (!E || E.id() != n.id() || s.isIgnoredEdge(n) || E !== n) return r.hideMenuItem(I), r.hideMenuItem(M), r.hideMenuItem(D), void r.hideMenuItem(R);
                            var c = e.position || e.cyPosition,
                                l = se(c.x, c.y, n); - 1 == l ? (r.hideMenuItem(I), r.hideMenuItem(D), "control" === i && a ? (r.showMenuItem(R), r.hideMenuItem(M)) : "bend" === i && a ? (r.showMenuItem(M), r.hideMenuItem(R)) : a ? (r.showMenuItem(M), r.showMenuItem(R)) : (r.hideMenuItem(M), r.hideMenuItem(R)), s.currentCtxPos = c) : (r.hideMenuItem(M), r.hideMenuItem(R), "control" === i ? (r.showMenuItem(D), r.hideMenuItem(I), o.enableMultipleAnchorRemovalOption && n.hasClass("edgecontrolediting-hasmultiplecontrolpoints") && r.showMenuItem(F)) : "bend" === i ? (r.showMenuItem(I), r.hideMenuItem(D)) : (r.hideMenuItem(I), r.hideMenuItem(D), r.hideMenuItem(F)), s.currentAnchorIndex = l), s.currentCtxEdge = n
                        }), t.on("cyedgeediting.changeAnchorPoints", "edge", (function() { t.startBatch(), t.edges().unselect(), t.trigger("bendPointMovement"), t.endBatch(), ne() }));
                        var Ce = !1,
                            Te = { 37: !1, 38: !1, 39: !1, 40: !1 };
                        document.addEventListener("keydown", (function(e) {
                            if ("function" == typeof ee().moveSelectedAnchorsOnKeyEvents ? ee().moveSelectedAnchorsOnKeyEvents() : ee().moveSelectedAnchorsOnKeyEvents) {
                                var n, o, i = document.activeElement.tagName;
                                if ("TEXTAREA" != i && "INPUT" != i) {
                                    switch (e.keyCode) {
                                        case 37:
                                        case 39:
                                        case 38:
                                        case 40:
                                        case 32:
                                            e.preventDefault()
                                    }
                                    if (e.keyCode < "37" || e.keyCode > "40") return;
                                    if (Te[e.keyCode] = !0, t.edges(":selected").length != t.elements(":selected").length || 1 != t.edges(":selected").length) return;
                                    Ce || (Pe = t.edges(":selected"), t.trigger("edgeediting.movestart", [Pe]), Ce = !0);
                                    var d = 3;
                                    if (e.altKey && e.shiftKey) return;
                                    e.altKey ? d = 1 : e.shiftKey && (d = 10);
                                    var a = 0,
                                        r = 0;
                                    a += Te[39] ? d : 0, a -= Te[37] ? d : 0, r += Te[40] ? d : 0, r -= Te[38] ? d : 0, n = { x: a, y: r }, (o = Pe).forEach((function(e) {
                                        var t = s.getAnchorsAsArray(e),
                                            o = [];
                                        if (null != t) {
                                            for (var i = 0; i < t.length; i += 2) o.push({ x: t[i] + n.x, y: t[i + 1] + n.y });
                                            var d = s.getEdgeType(e);
                                            if (s.edgeTypeInconclusiveShouldntHappen(d, "UiUtilities.js, moveAnchorPoints")) return;
                                            e.data(s.syntax[d].pointPos, o)
                                        }
                                    })), s.initAnchorPoints(ee().bendPositionsFunction, ee().controlPositionsFunction, o), t.trigger("bendPointMovement")
                                }
                            }
                        }), !0), document.addEventListener("keyup", (function(e) { e.keyCode < "37" || e.keyCode > "40" || (e.preventDefault(), Te[e.keyCode] = !1, ("function" == typeof ee().moveSelectedAnchorsOnKeyEvents ? ee().moveSelectedAnchorsOnKeyEvents() : ee().moveSelectedAnchorsOnKeyEvents) && (t.trigger("edgeediting.moveend", [Pe]), Pe = void 0, Ce = !1)) }), !0), T.data("cyedgeediting", Z)
                    },
                    unbind: function() { t.off("remove", "node", c).off("add", "node", l).off("style", "edge.edgebendediting-hasbendpoints:selected, edge.edgecontrolediting-hascontrolpoints:selected", n).off("select", "edge", u).off("unselect", "edge", h).off("tapstart", y).off("tapstart", "edge", v).off("tapdrag", f).off("tapend", p).off("cxttap", x).off("drag", "node", m), t.unbind("zoom pan", g) }
                };
            return W[T] ? W[T].apply($(t.container()), Array.prototype.slice.call(arguments, 1)) : "object" != (void 0 === T ? "undefined" : o(T)) && T ? ($.error("No such function `" + T + "` for cytoscape.js-edge-editing"), $(this)) : W.init.apply($(t.container()), arguments)
        }
    }, function(e, t, n) {
        "use strict";
        e.exports = {
            disconnectEdge: function(e, t, n, o) {
                var i = { data: { id: "nwt_reconnectEdge_dummy", ports: [] }, style: { width: 1, height: 1, visibility: "hidden" }, renderedPosition: n };
                t.add(i);
                var s = "source" === o ? { source: i.data.id } : { target: i.data.id };
                return e = e.move(s)[0], { dummyNode: t.nodes("#" + i.data.id)[0], edge: e }
            },
            connectEdge: function(e, t, n) {
                if (e.isEdge() && t.isNode()) {
                    var o = {};
                    if ("source" === n) o.source = t.id();
                    else {
                        if ("target" !== n) return;
                        o.target = t.id()
                    }
                    return e.move(o)[0]
                }
            },
            copyEdge: function(e, t) { this.copyAnchors(e, t), this.copyStyle(e, t) },
            copyStyle: function(e, t) { e && t && (t.data("line-color", e.data("line-color")), t.data("width", e.data("width")), t.data("cardinality", e.data("cardinality"))) },
            copyAnchors: function(e, t) {
                if (e.hasClass("edgebendediting-hasbendpoints")) {
                    var n = e.data("cyedgebendeditingDistances"),
                        o = e.data("cyedgebendeditingWeights");
                    t.data("cyedgebendeditingDistances", n), t.data("cyedgebendeditingWeights", o), t.addClass("edgebendediting-hasbendpoints")
                } else if (e.hasClass("edgecontrolediting-hascontrolpoints")) {
                    n = e.data("cyedgecontroleditingDistances"), o = e.data("cyedgecontroleditingWeights");
                    t.data("cyedgecontroleditingDistances", n), t.data("cyedgecontroleditingWeights", o), t.addClass("edgecontrolediting-hascontrolpoints")
                }
                e.hasClass("edgebendediting-hasmultiplebendpoints") ? t.addClass("edgebendediting-hasmultiplebendpoints") : e.hasClass("edgecontrolediting-hasmultiplecontrolpoints") && t.addClass("edgecontrolediting-hasmultiplecontrolpoints")
            }
        }
    }, function(e, t, n) {
        "use strict";
        e.exports = function(e, t, n) {
            if (null != e.undoRedo) {
                var o = e.undoRedo({ defaultActions: !1, isDebug: !0 });
                o.action("changeAnchorPoints", i, i), o.action("moveAnchorPoints", s, s), o.action("reconnectEdge", d, d), o.action("removeReconnectedEdge", a, a)
            }

            function i(n) {
                var o, i, s, d, a = e.getElementById(n.edge.id()),
                    r = "inconclusive" !== n.type ? n.type : t.getEdgeType(a);
                "inconclusive" !== n.type || n.set ? (s = t.syntax[r].weight, d = t.syntax[r].distance, o = n.set ? a.data(s) : n.weights, i = n.set ? a.data(d) : n.distances) : (o = [], i = []);
                var c = { edge: a, type: r, weights: o, distances: i, set: !0 };
                if (n.set) {
                    var l = n.weights && n.weights.length > 0,
                        g = l && n.weights.length > 1;
                    l ? a.data(s, n.weights) : a.removeData(s), l ? a.data(d, n.distances) : a.removeData(d);
                    var u = t.syntax[r].class,
                        h = t.syntax[r].multiClass;
                    l || g ? l && !g ? (a.addClass(u), a.removeClass(h)) : a.addClass(u + " " + h) : a.removeClass(u + " " + h), a.selected() ? (a.unselect(), a.select()) : a.select()
                }
                return a.trigger("cyedgeediting.changeAnchorPoints"), c
            }

            function s(e) {
                if (e.firstTime) return delete e.firstTime, e;
                var o = e.edges,
                    i = e.positionDiff,
                    s = { edges: o, positionDiff: { x: -i.x, y: -i.y } };
                return function(e, o) {
                    o.forEach((function(n) {
                        var o = t.getEdgeType(n),
                            i = t.getAnchorsAsArray(n),
                            s = [];
                        if (null != i) {
                            for (var d = 0; d < i.length; d += 2) s.push({ x: i[d] + e.x, y: i[d + 1] + e.y });
                            n.data(t.syntax[o].pointPos, s)
                        }
                    })), t.initAnchorPoints(n.bendPositionsFunction, n.controlPositionsFunction, o)
                }(i, o), s
            }

            function d(e) {
                var t = e.edge,
                    n = e.location,
                    o = e.oldLoc,
                    i = { edge: t = t.move(n)[0], location: o, oldLoc: n };
                return t.unselect(), i
            }

            function a(t) {
                var n = t.oldEdge;
                (o = e.getElementById(n.data("id"))) && o.length > 0 && (n = o);
                var o, i = t.newEdge;
                return (o = e.getElementById(i.data("id"))) && o.length > 0 && (i = o), n.inside() && (n = n.remove()[0]), i.removed() && (i = i.restore()).unselect(), { oldEdge: i, newEdge: n }
            }
        }
    }])
}));