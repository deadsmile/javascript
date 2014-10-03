var requirejs, require, define;
(function(global) {
    function isFunction(e) {
        return "[object Function]" === ostring.call(e)
    }
    function isArray(e) {
        return "[object Array]" === ostring.call(e)
    }
    function each(e, t) {
        if (e) {
            var i;
            for (i = 0; i < e.length && (!e[i] || !t(e[i], i, e)); i += 1);
        }
    }
    function eachReverse(e, t) {
        if (e) {
            var i;
            for (i = e.length - 1; i > -1 && (!e[i] || !t(e[i], i, e)); i -= 1);
        }
    }
    function hasProp(e, t) {
        return hasOwn.call(e, t)
    }
    function getOwn(e, t) {
        return hasProp(e, t) && e[t]
    }
    function eachProp(e, t) {
        var i;
        for (i in e) if (hasProp(e, i) && t(e[i], i)) break
    }
    function mixin(e, t, i, r) {
        return t && eachProp(t, function(t, n) {
            (i || !hasProp(e, n)) && (r && "string" != typeof t ? (e[n] || (e[n] = {}), mixin(e[n], t, i, r)) : e[n] = t)
        }), e
    }
    function bind(e, t) {
        return function() {
            return t.apply(e, arguments)
        }
    }
    function scripts() {
        return document.getElementsByTagName("script")
    }
    function defaultOnError(e) {
        throw e
    }
    function getGlobal(e) {
        if (!e) return e;
        var t = global;
        return each(e.split("."), function(e) {
            t = t[e]
        }), t
    }
    function makeError(e, t, i, r) {
        var n = new Error(t + "\nhttp://requirejs.org/docs/errors.html#" + e);
        return n.requireType = e, n.requireModules = r, i && (n.originalError = i), n
    }
    function newContext(e) {
        function t(e) {
            var t, i;
            for (t = 0; e[t]; t += 1) if (i = e[t], "." === i) e.splice(t, 1), t -= 1;
            else if (".." === i) {
                if (1 === t && (".." === e[2] || ".." === e[0])) break;
                t > 0 && (e.splice(t - 1, 2), t -= 2)
            }
        }
        function i(e, i, r) {
            var n, a, o, s, c, u, p, d, f, l, h, m = i && i.split("/"),
                g = m,
                v = y.map,
                x = v && v["*"];
            if (e && "." === e.charAt(0) && (i ? (g = getOwn(y.pkgs, i) ? m = [i] : m.slice(0, m.length - 1), e = g.concat(e.split("/")), t(e), a = getOwn(y.pkgs, n = e[0]), e = e.join("/"), a && e === n + "/" + a.main && (e = n)) : 0 === e.indexOf("./") && (e = e.substring(2))), r && v && (m || x)) {
                for (s = e.split("/"), c = s.length; c > 0; c -= 1) {
                    if (p = s.slice(0, c).join("/"), m) for (u = m.length; u > 0; u -= 1) if (o = getOwn(v, m.slice(0, u).join("/")), o && (o = getOwn(o, p))) {
                        d = o, f = c;
                        break
                    }
                    if (d) break;
                    !l && x && getOwn(x, p) && (l = getOwn(x, p), h = c)
                }!d && l && (d = l, f = h), d && (s.splice(0, f, d), e = s.join("/"))
            }
            return e
        }
        function r(e) {
            isBrowser && each(scripts(), function(t) {
                return t.getAttribute("data-requiremodule") === e && t.getAttribute("data-requirecontext") === q.contextName ? (t.parentNode.removeChild(t), !0) : void 0
            })
        }
        function n(e) {
            var t = getOwn(y.paths, e);
            return t && isArray(t) && t.length > 1 ? (t.shift(), q.require.undef(e), q.require([e]), !0) : void 0
        }
        function a(e) {
            var t, i = e ? e.indexOf("!") : -1;
            return i > -1 && (t = e.substring(0, i), e = e.substring(i + 1, e.length)), [t, e]
        }
        function o(e, t, r, n) {
            var o, s, c, u, p = null,
                d = t ? t.name : null,
                f = e,
                l = !0,
                h = "";
            return e || (l = !1, e = "_@r" + (A += 1)), u = a(e), p = u[0], e = u[1], p && (p = i(p, d, n), s = getOwn(j, p)), e && (p ? h = s && s.normalize ? s.normalize(e, function(e) {
                return i(e, d, n)
            }) : i(e, d, n) : (h = i(e, d, n), u = a(h), p = u[0], h = u[1], r = !0, o = q.nameToUrl(h))), c = !p || s || r ? "" : "_unnormalized" + (R += 1), {
                prefix: p,
                name: h,
                parentMap: t,
                unnormalized: !! c,
                url: o,
                originalName: f,
                isDefine: l,
                id: (p ? p + "!" + h : h) + c
            }
        }
        function s(e) {
            var t = e.id,
                i = getOwn(k, t);
            return i || (i = k[t] = new q.Module(e)), i
        }
        function c(e, t, i) {
            var r = e.id,
                n = getOwn(k, r);
            !hasProp(j, r) || n && !n.defineEmitComplete ? (n = s(e), n.error && "error" === t ? i(n.error) : n.on(t, i)) : "defined" === t && i(j[r])
        }
        function u(e, t) {
            var i = e.requireModules,
                r = !1;
            t ? t(e) : (each(i, function(t) {
                var i = getOwn(k, t);
                i && (i.error = e, i.events.error && (r = !0, i.emit("error", e)))
            }), r || req.onError(e))
        }
        function p() {
            globalDefQueue.length && (apsp.apply(M, [M.length - 1, 0].concat(globalDefQueue)), globalDefQueue = [])
        }
        function d(e) {
            delete k[e], delete S[e]
        }
        function f(e, t, i) {
            var r = e.map.id;
            e.error ? e.emit("error", e.error) : (t[r] = !0, each(e.depMaps, function(r, n) {
                var a = r.id,
                    o = getOwn(k, a);
                !o || e.depMatched[n] || i[a] || (getOwn(t, a) ? (e.defineDep(n, j[a]), e.check()) : f(o, t, i))
            }), i[r] = !0)
        }
        function l() {
            var e, t, i, a, o = 1e3 * y.waitSeconds,
                s = o && q.startTime + o < (new Date).getTime(),
                c = [],
                p = [],
                d = !1,
                h = !0;
            if (!x) {
                if (x = !0, eachProp(S, function(i) {
                    if (e = i.map, t = e.id, i.enabled && (e.isDefine || p.push(i), !i.error)) if (!i.inited && s) n(t) ? (a = !0, d = !0) : (c.push(t), r(t));
                    else if (!i.inited && i.fetched && e.isDefine && (d = !0, !e.prefix)) return h = !1
                }), s && c.length) return i = makeError("timeout", "Load timeout for modules: " + c, null, c), i.contextName = q.contextName, u(i);
                h && each(p, function(e) {
                    f(e, {}, {})
                }), s && !a || !d || !isBrowser && !isWebWorker || w || (w = setTimeout(function() {
                    w = 0, l()
                }, 50)), x = !1
            }
        }
        function h(e) {
            hasProp(j, e[0]) || s(o(e[0], null, !0)).init(e[1], e[2])
        }
        function m(e, t, i, r) {
            e.detachEvent && !isOpera ? r && e.detachEvent(r, t) : e.removeEventListener(i, t, !1)
        }
        function g(e) {
            var t = e.currentTarget || e.srcElement;
            return m(t, q.onScriptLoad, "load", "onreadystatechange"), m(t, q.onScriptError, "error"), {
                node: t,
                id: t && t.getAttribute("data-requiremodule")
            }
        }
        function v() {
            var e;
            for (p(); M.length;) {
                if (e = M.shift(), null === e[0]) return u(makeError("mismatch", "Mismatched anonymous define() module: " + e[e.length - 1]));
                h(e)
            }
        }
        var x, b, q, E, w, y = {
            waitSeconds: 7,
            baseUrl: "./",
            paths: {},
            pkgs: {},
            shim: {},
            config: {}
        }, k = {}, S = {}, O = {}, M = [],
            j = {}, P = {}, A = 1,
            R = 1;
        return E = {
            require: function(e) {
                return e.require ? e.require : e.require = q.makeRequire(e.map)
            },
            exports: function(e) {
                return e.usingExports = !0, e.map.isDefine ? e.exports ? e.exports : e.exports = j[e.map.id] = {} : void 0
            },
            module: function(e) {
                return e.module ? e.module : e.module = {
                    id: e.map.id,
                    uri: e.map.url,
                    config: function() {
                        var t, i = getOwn(y.pkgs, e.map.id);
                        return t = i ? getOwn(y.config, e.map.id + "/" + i.main) : getOwn(y.config, e.map.id), t || {}
                    },
                    exports: j[e.map.id]
                }
            }
        }, b = function(e) {
            this.events = getOwn(O, e.id) || {}, this.map = e, this.shim = getOwn(y.shim, e.id), this.depExports = [], this.depMaps = [], this.depMatched = [], this.pluginMaps = {}, this.depCount = 0
        }, b.prototype = {
            init: function(e, t, i, r) {
                r = r || {}, this.inited || (this.factory = t, i ? this.on("error", i) : this.events.error && (i = bind(this, function(e) {
                    this.emit("error", e)
                })), this.depMaps = e && e.slice(0), this.errback = i, this.inited = !0, this.ignore = r.ignore, r.enabled || this.enabled ? this.enable() : this.check())
            },
            defineDep: function(e, t) {
                this.depMatched[e] || (this.depMatched[e] = !0, this.depCount -= 1, this.depExports[e] = t)
            },
            fetch: function() {
                if (!this.fetched) {
                    this.fetched = !0, q.startTime = (new Date).getTime();
                    var e = this.map;
                    return this.shim ? void q.makeRequire(this.map, {
                        enableBuildCallback: !0
                    })(this.shim.deps || [], bind(this, function() {
                        return e.prefix ? this.callPlugin() : this.load()
                    })) : e.prefix ? this.callPlugin() : this.load()
                }
            },
            load: function() {
                var e = this.map.url;
                P[e] || (P[e] = !0, q.load(this.map.id, e))
            },
            check: function() {
                if (this.enabled && !this.enabling) {
                    var e, t, i = this.map.id,
                        r = this.depExports,
                        n = this.exports,
                        a = this.factory;
                    if (this.inited) {
                        if (this.error) this.emit("error", this.error);
                        else if (!this.defining) {
                            if (this.defining = !0, this.depCount < 1 && !this.defined) {
                                if (isFunction(a)) {
                                    if (this.events.error && this.map.isDefine || req.onError !== defaultOnError) try {
                                        n = q.execCb(i, a, r, n)
                                    } catch (o) {
                                        e = o
                                    } else n = q.execCb(i, a, r, n);
                                    if (this.map.isDefine && (t = this.module, t && void 0 !== t.exports && t.exports !== this.exports ? n = t.exports : void 0 === n && this.usingExports && (n = this.exports)), e) return e.requireMap = this.map, e.requireModules = this.map.isDefine ? [this.map.id] : null, e.requireType = this.map.isDefine ? "define" : "require", u(this.error = e)
                                } else n = a;
                                this.exports = n, this.map.isDefine && !this.ignore && (j[i] = n, req.onResourceLoad && req.onResourceLoad(q, this.map, this.depMaps)), d(i), this.defined = !0
                            }
                            this.defining = !1, this.defined && !this.defineEmitted && (this.defineEmitted = !0, this.emit("defined", this.exports), this.defineEmitComplete = !0)
                        }
                    } else this.fetch()
                }
            },
            callPlugin: function() {
                var e = this.map,
                    t = e.id,
                    r = o(e.prefix);
                this.depMaps.push(r), c(r, "defined", bind(this, function(r) {
                    var n, a, p, f = this.map.name,
                        l = this.map.parentMap ? this.map.parentMap.name : null,
                        h = q.makeRequire(e.parentMap, {
                            enableBuildCallback: !0
                        });
                    return this.map.unnormalized ? (r.normalize && (f = r.normalize(f, function(e) {
                        return i(e, l, !0)
                    }) || ""), a = o(e.prefix + "!" + f, this.map.parentMap), c(a, "defined", bind(this, function(e) {
                        this.init([], function() {
                            return e
                        }, null, {
                            enabled: !0,
                            ignore: !0
                        })
                    })), p = getOwn(k, a.id), void(p && (this.depMaps.push(a), this.events.error && p.on("error", bind(this, function(e) {
                        this.emit("error", e)
                    })), p.enable()))) : (n = bind(this, function(e) {
                        this.init([], function() {
                            return e
                        }, null, {
                            enabled: !0
                        })
                    }), n.error = bind(this, function(e) {
                        this.inited = !0, this.error = e, e.requireModules = [t], eachProp(k, function(e) {
                            0 === e.map.id.indexOf(t + "_unnormalized") && d(e.map.id)
                        }), u(e)
                    }), n.fromText = bind(this, function(i, r) {
                        var a = e.name,
                            c = o(a),
                            p = useInteractive;
                        r && (i = r), p && (useInteractive = !1), s(c), hasProp(y.config, t) && (y.config[a] = y.config[t]);
                        try {
                            req.exec(i)
                        } catch (d) {
                            return u(makeError("fromtexteval", "fromText eval for " + t + " failed: " + d, d, [t]))
                        }
                        p && (useInteractive = !0), this.depMaps.push(c), q.completeLoad(a), h([a], n)
                    }), void r.load(e.name, h, n, y))
                })), q.enable(r, this), this.pluginMaps[r.id] = r
            },
            enable: function() {
                S[this.map.id] = this, this.enabled = !0, this.enabling = !0, each(this.depMaps, bind(this, function(e, t) {
                    var i, r, n;
                    if ("string" == typeof e) {
                        if (e = o(e, this.map.isDefine ? this.map : this.map.parentMap, !1, !this.skipMap), this.depMaps[t] = e, n = getOwn(E, e.id)) return void(this.depExports[t] = n(this));
                        this.depCount += 1, c(e, "defined", bind(this, function(e) {
                            this.defineDep(t, e), this.check()
                        })), this.errback && c(e, "error", bind(this, this.errback))
                    }
                    i = e.id, r = k[i], hasProp(E, i) || !r || r.enabled || q.enable(e, this)
                })), eachProp(this.pluginMaps, bind(this, function(e) {
                    var t = getOwn(k, e.id);
                    t && !t.enabled && q.enable(e, this)
                })), this.enabling = !1, this.check()
            },
            on: function(e, t) {
                var i = this.events[e];
                i || (i = this.events[e] = []), i.push(t)
            },
            emit: function(e, t) {
                each(this.events[e], function(e) {
                    e(t)
                }), "error" === e && delete this.events[e]
            }
        }, q = {
            config: y,
            contextName: e,
            registry: k,
            defined: j,
            urlFetched: P,
            defQueue: M,
            Module: b,
            makeModuleMap: o,
            nextTick: req.nextTick,
            onError: u,
            configure: function(e) {
                e.baseUrl && "/" !== e.baseUrl.charAt(e.baseUrl.length - 1) && (e.baseUrl += "/");
                var t = y.pkgs,
                    i = y.shim,
                    r = {
                        paths: !0,
                        config: !0,
                        map: !0
                    };
                eachProp(e, function(e, t) {
                    r[t] ? "map" === t ? (y.map || (y.map = {}), mixin(y[t], e, !0, !0)) : mixin(y[t], e, !0) : y[t] = e
                }), e.shim && (eachProp(e.shim, function(e, t) {
                    isArray(e) && (e = {
                        deps: e
                    }), !e.exports && !e.init || e.exportsFn || (e.exportsFn = q.makeShimExports(e)), i[t] = e
                }), y.shim = i), e.packages && (each(e.packages, function(e) {
                    var i;
                    e = "string" == typeof e ? {
                        name: e
                    } : e, i = e.location, t[e.name] = {
                        name: e.name,
                        location: i || e.name,
                        main: (e.main || "main").replace(currDirRegExp, "").replace(jsSuffixRegExp, "")
                    }
                }), y.pkgs = t), eachProp(k, function(e, t) {
                    e.inited || e.map.unnormalized || (e.map = o(t))
                }), (e.deps || e.callback) && q.require(e.deps || [], e.callback)
            },
            makeShimExports: function(e) {
                function t() {
                    var t;
                    return e.init && (t = e.init.apply(global, arguments)), t || e.exports && getGlobal(e.exports)
                }
                return t
            },
            makeRequire: function(t, n) {
                function a(i, r, c) {
                    var p, d, f;
                    return n.enableBuildCallback && r && isFunction(r) && (r.__requireJsBuild = !0), "string" == typeof i ? isFunction(r) ? u(makeError("requireargs", "Invalid require call"), c) : t && hasProp(E, i) ? E[i](k[t.id]) : req.get ? req.get(q, i, t, a) : (d = o(i, t, !1, !0), p = d.id, hasProp(j, p) ? j[p] : u(makeError("notloaded", 'Module name "' + p + '" has not been loaded yet for context: ' + e + (t ? "" : ". Use require([])")))) : (v(), q.nextTick(function() {
                        v(), f = s(o(null, t)), f.skipMap = n.skipMap, f.init(i, r, c, {
                            enabled: !0
                        }), l()
                    }), a)
                }
                return n = n || {}, mixin(a, {
                    isBrowser: isBrowser,
                    toUrl: function(e) {
                        var r, n = e.lastIndexOf("."),
                            a = e.split("/")[0],
                            o = "." === a || ".." === a;
                        return -1 !== n && (!o || n > 1) && (r = e.substring(n, e.length), e = e.substring(0, n)), q.nameToUrl(i(e, t && t.id, !0), r, !0)
                    },
                    defined: function(e) {
                        return hasProp(j, o(e, t, !1, !0).id)
                    },
                    specified: function(e) {
                        return e = o(e, t, !1, !0).id, hasProp(j, e) || hasProp(k, e)
                    }
                }), t || (a.undef = function(e) {
                    p();
                    var i = o(e, t, !0),
                        n = getOwn(k, e);
                    r(e), delete j[e], delete P[i.url], delete O[e], n && (n.events.defined && (O[e] = n.events), d(e))
                }), a
            },
            enable: function(e) {
                var t = getOwn(k, e.id);
                t && s(e).enable()
            },
            completeLoad: function(e) {
                var t, i, r, a = getOwn(y.shim, e) || {}, o = a.exports;
                for (p(); M.length;) {
                    if (i = M.shift(), null === i[0]) {
                        if (i[0] = e, t) break;
                        t = !0
                    } else i[0] === e && (t = !0);
                    h(i)
                }
                if (r = getOwn(k, e), !t && !hasProp(j, e) && r && !r.inited) {
                    if (!(!y.enforceDefine || o && getGlobal(o))) return n(e) ? void 0 : u(makeError("nodefine", "No define call for " + e, null, [e]));
                    h([e, a.deps || [], a.exportsFn])
                }
                l()
            },
            nameToUrl: function(e, t, i) {
                var r, n, a, o, s, c, u, p, d;
                if (req.jsExtRegExp.test(e)) p = e + (t || "");
                else {
                    for (r = y.paths, n = y.pkgs, s = e.split("/"), c = s.length; c > 0; c -= 1) {
                        if (u = s.slice(0, c).join("/"), a = getOwn(n, u), d = getOwn(r, u)) {
                            isArray(d) && (d = d[0]), s.splice(0, c, d);
                            break
                        }
                        if (a) {
                            o = e === a.name ? a.location + "/" + a.main : a.location, s.splice(0, c, o);
                            break
                        }
                    }
                    p = s.join("/"), p += t || (/^data\:|\?/.test(p) || i ? "" : ".js"), p = ("/" === p.charAt(0) || p.match(/^[\w\+\.\-]+:/) ? "" : y.baseUrl) + p
                }
                return y.urlArgs ? p + ((-1 === p.indexOf("?") ? "?" : "&") + y.urlArgs) : p
            },
            load: function(e, t) {
                req.load(q, e, t)
            },
            execCb: function(e, t, i, r) {
                return t.apply(r, i)
            },
            onScriptLoad: function(e) {
                if ("load" === e.type || readyRegExp.test((e.currentTarget || e.srcElement).readyState)) {
                    interactiveScript = null;
                    var t = g(e);
                    q.completeLoad(t.id)
                }
            },
            onScriptError: function(e) {
                var t = g(e);
                return n(t.id) ? void 0 : u(makeError("scripterror", "Script error for: " + t.id, e, [t.id]))
            }
        }, q.require = q.makeRequire(), q
    }
    function getInteractiveScript() {
        return interactiveScript && "interactive" === interactiveScript.readyState ? interactiveScript : (eachReverse(scripts(), function(e) {
            return "interactive" === e.readyState ? interactiveScript = e : void 0
        }), interactiveScript)
    }
    var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = "2.1.9",
        commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//,
        op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty,
        ap = Array.prototype,
        apsp = ap.splice,
        isBrowser = !("undefined" == typeof window || "undefined" == typeof navigator || !window.document),
        isWebWorker = !isBrowser && "undefined" != typeof importScripts,
        readyRegExp = isBrowser && "PLAYSTATION 3" === navigator.platform ? /^complete$/ : /^(complete|loaded)$/,
        defContextName = "_",
        isOpera = "undefined" != typeof opera && "[object Opera]" === opera.toString(),
        contexts = {}, cfg = {}, globalDefQueue = [],
        useInteractive = !1;
    if ("undefined" == typeof define) {
        if ("undefined" != typeof requirejs) {
            if (isFunction(requirejs)) return;
            cfg = requirejs, requirejs = void 0
        }
        "undefined" == typeof require || isFunction(require) || (cfg = require, require = void 0), req = requirejs = function(e, t, i, r) {
            var n, a, o = defContextName;
            return isArray(e) || "string" == typeof e || (a = e, isArray(t) ? (e = t, t = i, i = r) : e = []), a && a.context && (o = a.context), n = getOwn(contexts, o), n || (n = contexts[o] = req.s.newContext(o)), a && n.configure(a), n.require(e, t, i)
        }, req.config = function(e) {
            return req(e)
        }, req.nextTick = "undefined" != typeof setTimeout ? function(e) {
            setTimeout(e, 4)
        } : function(e) {
            e()
        }, require || (require = req), req.version = version, req.jsExtRegExp = /^\/|:|\?|\.js$/, req.isBrowser = isBrowser, s = req.s = {
            contexts: contexts,
            newContext: newContext
        }, req({}), each(["toUrl", "undef", "defined", "specified"], function(e) {
            req[e] = function() {
                var t = contexts[defContextName];
                return t.require[e].apply(t, arguments)
            }
        }), isBrowser && (head = s.head = document.getElementsByTagName("head")[0], baseElement = document.getElementsByTagName("base")[0], baseElement && (head = s.head = baseElement.parentNode)), req.onError = defaultOnError, req.createNode = function(e) {
            var t = e.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script");
            return t.type = e.scriptType || "text/javascript", t.charset = "utf-8", t.async = !0, t
        }, req.load = function(e, t, i) {
            var r, n = e && e.config || {};
            if (isBrowser) return r = req.createNode(n, t, i), r.setAttribute("data-requirecontext", e.contextName), r.setAttribute("data-requiremodule", t), !r.attachEvent || r.attachEvent.toString && r.attachEvent.toString().indexOf("[native code") < 0 || isOpera ? (r.addEventListener("load", e.onScriptLoad, !1), r.addEventListener("error", e.onScriptError, !1)) : (useInteractive = !0, r.attachEvent("onreadystatechange", e.onScriptLoad)), r.src = i, currentlyAddingScript = r, baseElement ? head.insertBefore(r, baseElement) : head.appendChild(r), currentlyAddingScript = null, r;
            if (isWebWorker) try {
                importScripts(i), e.completeLoad(t)
            } catch (a) {
                e.onError(makeError("importscripts", "importScripts failed for " + t + " at " + i, a, [t]))
            }
        }, isBrowser && !cfg.skipDataMain && eachReverse(scripts(), function(e) {
            return head || (head = e.parentNode), dataMain = e.getAttribute("data-main"), dataMain ? (mainScript = dataMain, cfg.baseUrl || (src = mainScript.split("/"), mainScript = src.pop(), subPath = src.length ? src.join("/") + "/" : "./", cfg.baseUrl = subPath), mainScript = mainScript.replace(jsSuffixRegExp, ""), req.jsExtRegExp.test(mainScript) && (mainScript = dataMain), cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript], !0) : void 0
        }), define = function(e, t, i) {
            var r, n;
            "string" != typeof e && (i = t, t = e, e = null), isArray(t) || (i = t, t = null), !t && isFunction(i) && (t = [], i.length && (i.toString().replace(commentRegExp, "").replace(cjsRequireRegExp, function(e, i) {
                t.push(i)
            }), t = (1 === i.length ? ["require"] : ["require", "exports", "module"]).concat(t))), useInteractive && (r = currentlyAddingScript || getInteractiveScript(), r && (e || (e = r.getAttribute("data-requiremodule")), n = contexts[r.getAttribute("data-requirecontext")])), (n ? n.defQueue : globalDefQueue).push([e, t, i])
        }, define.amd = {
            jQuery: !0
        }, req.exec = function(text) {
            return eval(text)
        }, req(cfg)
    }
})(this);
(function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
})("undefined" != typeof window ? window : this, function(e, t) {
    function n(e) {
        var t = e.length,
            n = ot.type(e);
        return "function" === n || ot.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
    }
    function r(e, t, n) {
        if (ot.isFunction(t)) return ot.grep(e, function(e, r) {
            return !!t.call(e, r, e) !== n
        });
        if (t.nodeType) return ot.grep(e, function(e) {
            return e === t !== n
        });
        if ("string" == typeof t) {
            if (pt.test(t)) return ot.filter(t, e, n);
            t = ot.filter(t, e)
        }
        return ot.grep(e, function(e) {
            return ot.inArray(e, t) >= 0 !== n
        })
    }
    function i(e, t) {
        do e = e[t];
        while (e && 1 !== e.nodeType);
        return e
    }
    function o(e) {
        var t = wt[e] = {};
        return ot.each(e.match(xt) || [], function(e, n) {
            t[n] = !0
        }), t
    }
    function a() {
        mt.addEventListener ? (mt.removeEventListener("DOMContentLoaded", s, !1), e.removeEventListener("load", s, !1)) : (mt.detachEvent("onreadystatechange", s), e.detachEvent("onload", s))
    }
    function s() {
        (mt.addEventListener || "load" === event.type || "complete" === mt.readyState) && (a(), ot.ready())
    }
    function l(e, t, n) {
        if (void 0 === n && 1 === e.nodeType) {
            var r = "data-" + t.replace(kt, "-$1").toLowerCase();
            if (n = e.getAttribute(r), "string" == typeof n) {
                try {
                    n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : Et.test(n) ? ot.parseJSON(n) : n
                } catch (i) {}
                ot.data(e, t, n)
            } else n = void 0
        }
        return n
    }
    function u(e) {
        var t;
        for (t in e) if (("data" !== t || !ot.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
        return !0
    }
    function c(e, t, n, r) {
        if (ot.acceptData(e)) {
            var i, o, a = ot.expando,
                s = e.nodeType,
                l = s ? ot.cache : e,
                u = s ? e[a] : e[a] && a;
            if (u && l[u] && (r || l[u].data) || void 0 !== n || "string" != typeof t) return u || (u = s ? e[a] = J.pop() || ot.guid++ : a), l[u] || (l[u] = s ? {} : {
                toJSON: ot.noop
            }), ("object" == typeof t || "function" == typeof t) && (r ? l[u] = ot.extend(l[u], t) : l[u].data = ot.extend(l[u].data, t)), o = l[u], r || (o.data || (o.data = {}), o = o.data), void 0 !== n && (o[ot.camelCase(t)] = n), "string" == typeof t ? (i = o[t], null == i && (i = o[ot.camelCase(t)])) : i = o, i
        }
    }
    function d(e, t, n) {
        if (ot.acceptData(e)) {
            var r, i, o = e.nodeType,
                a = o ? ot.cache : e,
                s = o ? e[ot.expando] : ot.expando;
            if (a[s]) {
                if (t && (r = n ? a[s] : a[s].data)) {
                    ot.isArray(t) ? t = t.concat(ot.map(t, ot.camelCase)) : t in r ? t = [t] : (t = ot.camelCase(t), t = t in r ? [t] : t.split(" ")), i = t.length;
                    for (; i--;) delete r[t[i]];
                    if (n ? !u(r) : !ot.isEmptyObject(r)) return
                }(n || (delete a[s].data, u(a[s]))) && (o ? ot.cleanData([e], !0) : rt.deleteExpando || a != a.window ? delete a[s] : a[s] = null)
            }
        }
    }
    function f() {
        return !0
    }
    function p() {
        return !1
    }
    function h() {
        try {
            return mt.activeElement
        } catch (e) {}
    }
    function m(e) {
        var t = Ot.split("|"),
            n = e.createDocumentFragment();
        if (n.createElement) for (; t.length;) n.createElement(t.pop());
        return n
    }
    function g(e, t) {
        var n, r, i = 0,
            o = typeof e.getElementsByTagName !== Nt ? e.getElementsByTagName(t || "*") : typeof e.querySelectorAll !== Nt ? e.querySelectorAll(t || "*") : void 0;
        if (!o) for (o = [], n = e.childNodes || e; null != (r = n[i]); i++)!t || ot.nodeName(r, t) ? o.push(r) : ot.merge(o, g(r, t));
        return void 0 === t || t && ot.nodeName(e, t) ? ot.merge([e], o) : o
    }
    function v(e) {
        Lt.test(e.type) && (e.defaultChecked = e.checked)
    }
    function y(e, t) {
        return ot.nodeName(e, "table") && ot.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }
    function b(e) {
        return e.type = (null !== ot.find.attr(e, "type")) + "/" + e.type, e
    }
    function x(e) {
        var t = Jt.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }
    function w(e, t) {
        for (var n, r = 0; null != (n = e[r]); r++) ot._data(n, "globalEval", !t || ot._data(t[r], "globalEval"))
    }
    function T(e, t) {
        if (1 === t.nodeType && ot.hasData(e)) {
            var n, r, i, o = ot._data(e),
                a = ot._data(t, o),
                s = o.events;
            if (s) {
                delete a.handle, a.events = {};
                for (n in s) for (r = 0, i = s[n].length; i > r; r++) ot.event.add(t, n, s[n][r])
            }
            a.data && (a.data = ot.extend({}, a.data))
        }
    }
    function C(e, t) {
        var n, r, i;
        if (1 === t.nodeType) {
            if (n = t.nodeName.toLowerCase(), !rt.noCloneEvent && t[ot.expando]) {
                i = ot._data(t);
                for (r in i.events) ot.removeEvent(t, r, i.handle);
                t.removeAttribute(ot.expando)
            }
            "script" === n && t.text !== e.text ? (b(t).text = e.text, x(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), rt.html5Clone && e.innerHTML && !ot.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Lt.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
        }
    }
    function N(t, n) {
        var r = ot(n.createElement(t)).appendTo(n.body),
            i = e.getDefaultComputedStyle ? e.getDefaultComputedStyle(r[0]).display : ot.css(r[0], "display");
        return r.detach(), i
    }
    function E(e) {
        var t = mt,
            n = en[e];
        return n || (n = N(e, t), "none" !== n && n || (Zt = (Zt || ot("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = (Zt[0].contentWindow || Zt[0].contentDocument).document, t.write(), t.close(), n = N(e, t), Zt.detach()), en[e] = n), n
    }
    function k(e, t) {
        return {
            get: function() {
                var n = e();
                if (null != n) return n ? void delete this.get : (this.get = t).apply(this, arguments)
            }
        }
    }
    function S(e, t) {
        if (t in e) return t;
        for (var n = t.charAt(0).toUpperCase() + t.slice(1), r = t, i = hn.length; i--;) if (t = hn[i] + n, t in e) return t;
        return r
    }
    function A(e, t) {
        for (var n, r, i, o = [], a = 0, s = e.length; s > a; a++) r = e[a], r.style && (o[a] = ot._data(r, "olddisplay"), n = r.style.display, t ? (o[a] || "none" !== n || (r.style.display = ""), "" === r.style.display && Dt(r) && (o[a] = ot._data(r, "olddisplay", E(r.nodeName)))) : o[a] || (i = Dt(r), (n && "none" !== n || !i) && ot._data(r, "olddisplay", i ? n : ot.css(r, "display"))));
        for (a = 0; s > a; a++) r = e[a], r.style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? o[a] || "" : "none"));
        return e
    }
    function D(e, t, n) {
        var r = cn.exec(t);
        return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
    }
    function j(e, t, n, r, i) {
        for (var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; 4 > o; o += 2) "margin" === n && (a += ot.css(e, n + At[o], !0, i)), r ? ("content" === n && (a -= ot.css(e, "padding" + At[o], !0, i)), "margin" !== n && (a -= ot.css(e, "border" + At[o] + "Width", !0, i))) : (a += ot.css(e, "padding" + At[o], !0, i), "padding" !== n && (a += ot.css(e, "border" + At[o] + "Width", !0, i)));
        return a
    }
    function L(e, t, n) {
        var r = !0,
            i = "width" === t ? e.offsetWidth : e.offsetHeight,
            o = tn(e),
            a = rt.boxSizing() && "border-box" === ot.css(e, "boxSizing", !1, o);
        if (0 >= i || null == i) {
            if (i = nn(e, t, o), (0 > i || null == i) && (i = e.style[t]), on.test(i)) return i;
            r = a && (rt.boxSizingReliable() || i === e.style[t]), i = parseFloat(i) || 0
        }
        return i + j(e, t, n || (a ? "border" : "content"), r, o) + "px"
    }
    function H(e, t, n, r, i) {
        return new H.prototype.init(e, t, n, r, i)
    }
    function q() {
        return setTimeout(function() {
            mn = void 0
        }), mn = ot.now()
    }
    function _(e, t) {
        var n, r = {
            height: e
        }, i = 0;
        for (t = t ? 1 : 0; 4 > i; i += 2 - t) n = At[i], r["margin" + n] = r["padding" + n] = e;
        return t && (r.opacity = r.width = e), r
    }
    function M(e, t, n) {
        for (var r, i = (wn[t] || []).concat(wn["*"]), o = 0, a = i.length; a > o; o++) if (r = i[o].call(n, t, e)) return r
    }
    function F(e, t, n) {
        var r, i, o, a, s, l, u, c, d = this,
            f = {}, p = e.style,
            h = e.nodeType && Dt(e),
            m = ot._data(e, "fxshow");
        n.queue || (s = ot._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, l = s.empty.fire, s.empty.fire = function() {
            s.unqueued || l()
        }), s.unqueued++, d.always(function() {
            d.always(function() {
                s.unqueued--, ot.queue(e, "fx").length || s.empty.fire()
            })
        })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [p.overflow, p.overflowX, p.overflowY], u = ot.css(e, "display"), c = E(e.nodeName), "none" === u && (u = c), "inline" === u && "none" === ot.css(e, "float") && (rt.inlineBlockNeedsLayout && "inline" !== c ? p.zoom = 1 : p.display = "inline-block")), n.overflow && (p.overflow = "hidden", rt.shrinkWrapBlocks() || d.always(function() {
            p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
        }));
        for (r in t) if (i = t[r], vn.exec(i)) {
            if (delete t[r], o = o || "toggle" === i, i === (h ? "hide" : "show")) {
                if ("show" !== i || !m || void 0 === m[r]) continue;
                h = !0
            }
            f[r] = m && m[r] || ot.style(e, r)
        }
        if (!ot.isEmptyObject(f)) {
            m ? "hidden" in m && (h = m.hidden) : m = ot._data(e, "fxshow", {}), o && (m.hidden = !h), h ? ot(e).show() : d.done(function() {
                ot(e).hide()
            }), d.done(function() {
                var t;
                ot._removeData(e, "fxshow");
                for (t in f) ot.style(e, t, f[t])
            });
            for (r in f) a = M(h ? m[r] : 0, r, d), r in m || (m[r] = a.start, h && (a.end = a.start, a.start = "width" === r || "height" === r ? 1 : 0))
        }
    }
    function O(e, t) {
        var n, r, i, o, a;
        for (n in e) if (r = ot.camelCase(n), i = t[r], o = e[n], ot.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), a = ot.cssHooks[r], a && "expand" in a) {
            o = a.expand(o), delete e[r];
            for (n in o) n in e || (e[n] = o[n], t[n] = i)
        } else t[r] = i
    }
    function B(e, t, n) {
        var r, i, o = 0,
            a = xn.length,
            s = ot.Deferred().always(function() {
                delete l.elem
            }),
            l = function() {
                if (i) return !1;
                for (var t = mn || q(), n = Math.max(0, u.startTime + u.duration - t), r = n / u.duration || 0, o = 1 - r, a = 0, l = u.tweens.length; l > a; a++) u.tweens[a].run(o);
                return s.notifyWith(e, [u, o, n]), 1 > o && l ? n : (s.resolveWith(e, [u]), !1)
            }, u = s.promise({
                elem: e,
                props: ot.extend({}, t),
                opts: ot.extend(!0, {
                    specialEasing: {}
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: mn || q(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n) {
                    var r = ot.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                    return u.tweens.push(r), r
                },
                stop: function(t) {
                    var n = 0,
                        r = t ? u.tweens.length : 0;
                    if (i) return this;
                    for (i = !0; r > n; n++) u.tweens[n].run(1);
                    return t ? s.resolveWith(e, [u, t]) : s.rejectWith(e, [u, t]), this
                }
            }),
            c = u.props;
        for (O(c, u.opts.specialEasing); a > o; o++) if (r = xn[o].call(u, e, c, u.opts)) return r;
        return ot.map(c, M, u), ot.isFunction(u.opts.start) && u.opts.start.call(e, u), ot.fx.timer(ot.extend(l, {
            elem: e,
            anim: u,
            queue: u.opts.queue
        })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
    }
    function P(e) {
        return function(t, n) {
            "string" != typeof t && (n = t, t = "*");
            var r, i = 0,
                o = t.toLowerCase().match(xt) || [];
            if (ot.isFunction(n)) for (; r = o[i++];) "+" === r.charAt(0) ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
        }
    }
    function R(e, t, n, r) {
        function i(s) {
            var l;
            return o[s] = !0, ot.each(e[s] || [], function(e, s) {
                var u = s(t, n, r);
                return "string" != typeof u || a || o[u] ? a ? !(l = u) : void 0 : (t.dataTypes.unshift(u), i(u), !1)
            }), l
        }
        var o = {}, a = e === Xn;
        return i(t.dataTypes[0]) || !o["*"] && i("*")
    }
    function W(e, t) {
        var n, r, i = ot.ajaxSettings.flatOptions || {};
        for (r in t) void 0 !== t[r] && ((i[r] ? e : n || (n = {}))[r] = t[r]);
        return n && ot.extend(!0, e, n), e
    }
    function $(e, t, n) {
        for (var r, i, o, a, s = e.contents, l = e.dataTypes;
        "*" === l[0];) l.shift(), void 0 === i && (i = e.mimeType || t.getResponseHeader("Content-Type"));
        if (i) for (a in s) if (s[a] && s[a].test(i)) {
            l.unshift(a);
            break
        }
        if (l[0] in n) o = l[0];
        else {
            for (a in n) {
                if (!l[0] || e.converters[a + " " + l[0]]) {
                    o = a;
                    break
                }
                r || (r = a)
            }
            o = o || r
        }
        return o ? (o !== l[0] && l.unshift(o), n[o]) : void 0
    }
    function z(e, t, n, r) {
        var i, o, a, s, l, u = {}, c = e.dataTypes.slice();
        if (c[1]) for (a in e.converters) u[a.toLowerCase()] = e.converters[a];
        for (o = c.shift(); o;) if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = c.shift()) if ("*" === o) o = l;
        else if ("*" !== l && l !== o) {
            if (a = u[l + " " + o] || u["* " + o], !a) for (i in u) if (s = i.split(" "), s[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]])) {
                a === !0 ? a = u[i] : u[i] !== !0 && (o = s[0], c.unshift(s[1]));
                break
            }
            if (a !== !0) if (a && e["throws"]) t = a(t);
            else try {
                t = a(t)
            } catch (d) {
                return {
                    state: "parsererror",
                    error: a ? d : "No conversion from " + l + " to " + o
                }
            }
        }
        return {
            state: "success",
            data: t
        }
    }
    function I(e, t, n, r) {
        var i;
        if (ot.isArray(t)) ot.each(t, function(t, i) {
            n || Yn.test(e) ? r(e, i) : I(e + "[" + ("object" == typeof i ? t : "") + "]", i, n, r)
        });
        else if (n || "object" !== ot.type(t)) r(e, t);
        else for (i in t) I(e + "[" + i + "]", t[i], n, r)
    }
    function X() {
        try {
            return new e.XMLHttpRequest
        } catch (t) {}
    }
    function U() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {}
    }
    function V(e) {
        return ot.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1
    }
    var J = [],
        Y = J.slice,
        G = J.concat,
        Q = J.push,
        K = J.indexOf,
        Z = {}, et = Z.toString,
        tt = Z.hasOwnProperty,
        nt = "".trim,
        rt = {}, it = "1.11.0",
        ot = function(e, t) {
            return new ot.fn.init(e, t)
        }, at = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        st = /^-ms-/,
        lt = /-([\da-z])/gi,
        ut = function(e, t) {
            return t.toUpperCase()
        };
    ot.fn = ot.prototype = {
        jquery: it,
        constructor: ot,
        selector: "",
        length: 0,
        toArray: function() {
            return Y.call(this)
        },
        get: function(e) {
            return null != e ? 0 > e ? this[e + this.length] : this[e] : Y.call(this)
        },
        pushStack: function(e) {
            var t = ot.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        },
        each: function(e, t) {
            return ot.each(this, e, t)
        },
        map: function(e) {
            return this.pushStack(ot.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack(Y.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (0 > e ? t : 0);
            return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: Q,
        sort: J.sort,
        splice: J.splice
    }, ot.extend = ot.fn.extend = function() {
        var e, t, n, r, i, o, a = arguments[0] || {}, s = 1,
            l = arguments.length,
            u = !1;
        for ("boolean" == typeof a && (u = a, a = arguments[s] || {}, s++), "object" == typeof a || ot.isFunction(a) || (a = {}), s === l && (a = this, s--); l > s; s++) if (null != (i = arguments[s])) for (r in i) e = a[r], n = i[r], a !== n && (u && n && (ot.isPlainObject(n) || (t = ot.isArray(n))) ? (t ? (t = !1, o = e && ot.isArray(e) ? e : []) : o = e && ot.isPlainObject(e) ? e : {}, a[r] = ot.extend(u, o, n)) : void 0 !== n && (a[r] = n));
        return a
    }, ot.extend({
        expando: "jQuery" + (it + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isFunction: function(e) {
            return "function" === ot.type(e)
        },
        isArray: Array.isArray || function(e) {
            return "array" === ot.type(e)
        },
        isWindow: function(e) {
            return null != e && e == e.window
        },
        isNumeric: function(e) {
            return e - parseFloat(e) >= 0
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        isPlainObject: function(e) {
            var t;
            if (!e || "object" !== ot.type(e) || e.nodeType || ot.isWindow(e)) return !1;
            try {
                if (e.constructor && !tt.call(e, "constructor") && !tt.call(e.constructor.prototype, "isPrototypeOf")) return !1
            } catch (n) {
                return !1
            }
            if (rt.ownLast) for (t in e) return tt.call(e, t);
            for (t in e);
            return void 0 === t || tt.call(e, t)
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? Z[et.call(e)] || "object" : typeof e
        },
        globalEval: function(t) {
            t && ot.trim(t) && (e.execScript || function(t) {
                e.eval.call(e, t)
            })(t)
        },
        camelCase: function(e) {
            return e.replace(st, "ms-").replace(lt, ut)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t, r) {
            var i, o = 0,
                a = e.length,
                s = n(e);
            if (r) {
                if (s) for (; a > o && (i = t.apply(e[o], r), i !== !1); o++);
                else for (o in e) if (i = t.apply(e[o], r), i === !1) break
            } else if (s) for (; a > o && (i = t.call(e[o], o, e[o]), i !== !1); o++);
            else for (o in e) if (i = t.call(e[o], o, e[o]), i === !1) break;
            return e
        },
        trim: nt && !nt.call("﻿ ") ? function(e) {
            return null == e ? "" : nt.call(e)
        } : function(e) {
            return null == e ? "" : (e + "").replace(at, "")
        },
        makeArray: function(e, t) {
            var r = t || [];
            return null != e && (n(Object(e)) ? ot.merge(r, "string" == typeof e ? [e] : e) : Q.call(r, e)), r
        },
        inArray: function(e, t, n) {
            var r;
            if (t) {
                if (K) return K.call(t, e, n);
                for (r = t.length, n = n ? 0 > n ? Math.max(0, r + n) : n : 0; r > n; n++) if (n in t && t[n] === e) return n
            }
            return -1
        },
        merge: function(e, t) {
            for (var n = +t.length, r = 0, i = e.length; n > r;) e[i++] = t[r++];
            if (n !== n) for (; void 0 !== t[r];) e[i++] = t[r++];
            return e.length = i, e
        },
        grep: function(e, t, n) {
            for (var r, i = [], o = 0, a = e.length, s = !n; a > o; o++) r = !t(e[o], o), r !== s && i.push(e[o]);
            return i
        },
        map: function(e, t, r) {
            var i, o = 0,
                a = e.length,
                s = n(e),
                l = [];
            if (s) for (; a > o; o++) i = t(e[o], o, r), null != i && l.push(i);
            else for (o in e) i = t(e[o], o, r), null != i && l.push(i);
            return G.apply([], l)
        },
        guid: 1,
        proxy: function(e, t) {
            var n, r, i;
            return "string" == typeof t && (i = e[t], t = e, e = i), ot.isFunction(e) ? (n = Y.call(arguments, 2), r = function() {
                return e.apply(t || this, n.concat(Y.call(arguments)))
            }, r.guid = e.guid = e.guid || ot.guid++, r) : void 0
        },
        now: function() {
            return +new Date
        },
        support: rt
    }), ot.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
        Z["[object " + t + "]"] = t.toLowerCase()
    });
    var ct = function(e) {
        function t(e, t, n, r) {
            var i, o, a, s, l, u, d, h, m, g;
            if ((t ? t.ownerDocument || t : R) !== H && L(t), t = t || H, n = n || [], !e || "string" != typeof e) return n;
            if (1 !== (s = t.nodeType) && 9 !== s) return [];
            if (_ && !r) {
                if (i = yt.exec(e)) if (a = i[1]) {
                    if (9 === s) {
                        if (o = t.getElementById(a), !o || !o.parentNode) return n;
                        if (o.id === a) return n.push(o), n
                    } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(a)) && B(t, o) && o.id === a) return n.push(o), n
                } else {
                    if (i[2]) return Z.apply(n, t.getElementsByTagName(e)), n;
                    if ((a = i[3]) && C.getElementsByClassName && t.getElementsByClassName) return Z.apply(n, t.getElementsByClassName(a)), n
                }
                if (C.qsa && (!M || !M.test(e))) {
                    if (h = d = P, m = t, g = 9 === s && e, 1 === s && "object" !== t.nodeName.toLowerCase()) {
                        for (u = f(e), (d = t.getAttribute("id")) ? h = d.replace(xt, "\\$&") : t.setAttribute("id", h), h = "[id='" + h + "'] ", l = u.length; l--;) u[l] = h + p(u[l]);
                        m = bt.test(e) && c(t.parentNode) || t, g = u.join(",")
                    }
                    if (g) try {
                        return Z.apply(n, m.querySelectorAll(g)), n
                    } catch (v) {} finally {
                        d || t.removeAttribute("id")
                    }
                }
            }
            return w(e.replace(lt, "$1"), t, n, r)
        }
        function n() {
            function e(n, r) {
                return t.push(n + " ") > N.cacheLength && delete e[t.shift()], e[n + " "] = r
            }
            var t = [];
            return e
        }
        function r(e) {
            return e[P] = !0, e
        }
        function i(e) {
            var t = H.createElement("div");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }
        function o(e, t) {
            for (var n = e.split("|"), r = e.length; r--;) N.attrHandle[n[r]] = t
        }
        function a(e, t) {
            var n = t && e,
                r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || J) - (~e.sourceIndex || J);
            if (r) return r;
            if (n) for (; n = n.nextSibling;) if (n === t) return -1;
            return e ? 1 : -1
        }
        function s(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return "input" === n && t.type === e
            }
        }
        function l(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }
        function u(e) {
            return r(function(t) {
                return t = +t, r(function(n, r) {
                    for (var i, o = e([], n.length, t), a = o.length; a--;) n[i = o[a]] && (n[i] = !(r[i] = n[i]))
                })
            })
        }
        function c(e) {
            return e && typeof e.getElementsByTagName !== V && e
        }
        function d() {}
        function f(e, n) {
            var r, i, o, a, s, l, u, c = I[e + " "];
            if (c) return n ? 0 : c.slice(0);
            for (s = e, l = [], u = N.preFilter; s;) {
                (!r || (i = ut.exec(s))) && (i && (s = s.slice(i[0].length) || s), l.push(o = [])), r = !1, (i = ct.exec(s)) && (r = i.shift(), o.push({
                    value: r,
                    type: i[0].replace(lt, " ")
                }), s = s.slice(r.length));
                for (a in N.filter)!(i = ht[a].exec(s)) || u[a] && !(i = u[a](i)) || (r = i.shift(), o.push({
                    value: r,
                    type: a,
                    matches: i
                }), s = s.slice(r.length));
                if (!r) break
            }
            return n ? s.length : s ? t.error(e) : I(e, l).slice(0)
        }
        function p(e) {
            for (var t = 0, n = e.length, r = ""; n > t; t++) r += e[t].value;
            return r
        }
        function h(e, t, n) {
            var r = t.dir,
                i = n && "parentNode" === r,
                o = $++;
            return t.first ? function(t, n, o) {
                for (; t = t[r];) if (1 === t.nodeType || i) return e(t, n, o)
            } : function(t, n, a) {
                var s, l, u = [W, o];
                if (a) {
                    for (; t = t[r];) if ((1 === t.nodeType || i) && e(t, n, a)) return !0
                } else for (; t = t[r];) if (1 === t.nodeType || i) {
                    if (l = t[P] || (t[P] = {}), (s = l[r]) && s[0] === W && s[1] === o) return u[2] = s[2];
                    if (l[r] = u, u[2] = e(t, n, a)) return !0
                }
            }
        }
        function m(e) {
            return e.length > 1 ? function(t, n, r) {
                for (var i = e.length; i--;) if (!e[i](t, n, r)) return !1;
                return !0
            } : e[0]
        }
        function g(e, t, n, r, i) {
            for (var o, a = [], s = 0, l = e.length, u = null != t; l > s; s++)(o = e[s]) && (!n || n(o, r, i)) && (a.push(o), u && t.push(s));
            return a
        }
        function v(e, t, n, i, o, a) {
            return i && !i[P] && (i = v(i)), o && !o[P] && (o = v(o, a)), r(function(r, a, s, l) {
                var u, c, d, f = [],
                    p = [],
                    h = a.length,
                    m = r || x(t || "*", s.nodeType ? [s] : s, []),
                    v = !e || !r && t ? m : g(m, f, e, s, l),
                    y = n ? o || (r ? e : h || i) ? [] : a : v;
                if (n && n(v, y, s, l), i) for (u = g(y, p), i(u, [], s, l), c = u.length; c--;)(d = u[c]) && (y[p[c]] = !(v[p[c]] = d));
                if (r) {
                    if (o || e) {
                        if (o) {
                            for (u = [], c = y.length; c--;)(d = y[c]) && u.push(v[c] = d);
                            o(null, y = [], u, l)
                        }
                        for (c = y.length; c--;)(d = y[c]) && (u = o ? tt.call(r, d) : f[c]) > -1 && (r[u] = !(a[u] = d))
                    }
                } else y = g(y === a ? y.splice(h, y.length) : y), o ? o(null, a, y, l) : Z.apply(a, y)
            })
        }
        function y(e) {
            for (var t, n, r, i = e.length, o = N.relative[e[0].type], a = o || N.relative[" "], s = o ? 1 : 0, l = h(function(e) {
                return e === t
            }, a, !0), u = h(function(e) {
                return tt.call(t, e) > -1
            }, a, !0), c = [function(e, n, r) {
                return !o && (r || n !== A) || ((t = n).nodeType ? l(e, n, r) : u(e, n, r))
            }]; i > s; s++) if (n = N.relative[e[s].type]) c = [h(m(c), n)];
            else {
                if (n = N.filter[e[s].type].apply(null, e[s].matches), n[P]) {
                    for (r = ++s; i > r && !N.relative[e[r].type]; r++);
                    return v(s > 1 && m(c), s > 1 && p(e.slice(0, s - 1).concat({
                        value: " " === e[s - 2].type ? "*" : ""
                    })).replace(lt, "$1"), n, r > s && y(e.slice(s, r)), i > r && y(e = e.slice(r)), i > r && p(e))
                }
                c.push(n)
            }
            return m(c)
        }
        function b(e, n) {
            var i = n.length > 0,
                o = e.length > 0,
                a = function(r, a, s, l, u) {
                    var c, d, f, p = 0,
                        h = "0",
                        m = r && [],
                        v = [],
                        y = A,
                        b = r || o && N.find.TAG("*", u),
                        x = W += null == y ? 1 : Math.random() || .1,
                        w = b.length;
                    for (u && (A = a !== H && a); h !== w && null != (c = b[h]); h++) {
                        if (o && c) {
                            for (d = 0; f = e[d++];) if (f(c, a, s)) {
                                l.push(c);
                                break
                            }
                            u && (W = x)
                        }
                        i && ((c = !f && c) && p--, r && m.push(c))
                    }
                    if (p += h, i && h !== p) {
                        for (d = 0; f = n[d++];) f(m, v, a, s);
                        if (r) {
                            if (p > 0) for (; h--;) m[h] || v[h] || (v[h] = Q.call(l));
                            v = g(v)
                        }
                        Z.apply(l, v), u && !r && v.length > 0 && p + n.length > 1 && t.uniqueSort(l)
                    }
                    return u && (W = x, A = y), m
                };
            return i ? r(a) : a
        }
        function x(e, n, r) {
            for (var i = 0, o = n.length; o > i; i++) t(e, n[i], r);
            return r
        }
        function w(e, t, n, r) {
            var i, o, a, s, l, u = f(e);
            if (!r && 1 === u.length) {
                if (o = u[0] = u[0].slice(0), o.length > 2 && "ID" === (a = o[0]).type && C.getById && 9 === t.nodeType && _ && N.relative[o[1].type]) {
                    if (t = (N.find.ID(a.matches[0].replace(wt, Tt), t) || [])[0], !t) return n;
                    e = e.slice(o.shift().value.length)
                }
                for (i = ht.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i], !N.relative[s = a.type]);) if ((l = N.find[s]) && (r = l(a.matches[0].replace(wt, Tt), bt.test(o[0].type) && c(t.parentNode) || t))) {
                    if (o.splice(i, 1), e = r.length && p(o), !e) return Z.apply(n, r), n;
                    break
                }
            }
            return S(e, u)(r, t, !_, n, bt.test(e) && c(t.parentNode) || t), n
        }
        var T, C, N, E, k, S, A, D, j, L, H, q, _, M, F, O, B, P = "sizzle" + -new Date,
            R = e.document,
            W = 0,
            $ = 0,
            z = n(),
            I = n(),
            X = n(),
            U = function(e, t) {
                return e === t && (j = !0), 0
            }, V = "undefined",
            J = 1 << 31,
            Y = {}.hasOwnProperty,
            G = [],
            Q = G.pop,
            K = G.push,
            Z = G.push,
            et = G.slice,
            tt = G.indexOf || function(e) {
                for (var t = 0, n = this.length; n > t; t++) if (this[t] === e) return t;
                return -1
            }, nt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            rt = "[\\x20\\t\\r\\n\\f]",
            it = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            ot = it.replace("w", "w#"),
            at = "\\[" + rt + "*(" + it + ")" + rt + "*(?:([*^$|!~]?=)" + rt + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + ot + ")|)|)" + rt + "*\\]",
            st = ":(" + it + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + at.replace(3, 8) + ")*)|.*)\\)|)",
            lt = new RegExp("^" + rt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + rt + "+$", "g"),
            ut = new RegExp("^" + rt + "*," + rt + "*"),
            ct = new RegExp("^" + rt + "*([>+~]|" + rt + ")" + rt + "*"),
            dt = new RegExp("=" + rt + "*([^\\]'\"]*?)" + rt + "*\\]", "g"),
            ft = new RegExp(st),
            pt = new RegExp("^" + ot + "$"),
            ht = {
                ID: new RegExp("^#(" + it + ")"),
                CLASS: new RegExp("^\\.(" + it + ")"),
                TAG: new RegExp("^(" + it.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + at),
                PSEUDO: new RegExp("^" + st),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + rt + "*(even|odd|(([+-]|)(\\d*)n|)" + rt + "*(?:([+-]|)" + rt + "*(\\d+)|))" + rt + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + nt + ")$", "i"),
                needsContext: new RegExp("^" + rt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + rt + "*((?:-\\d)?\\d*)" + rt + "*\\)|)(?=[^-]|$)", "i")
            }, mt = /^(?:input|select|textarea|button)$/i,
            gt = /^h\d$/i,
            vt = /^[^{]+\{\s*\[native \w/,
            yt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            bt = /[+~]/,
            xt = /'|\\/g,
            wt = new RegExp("\\\\([\\da-f]{1,6}" + rt + "?|(" + rt + ")|.)", "ig"),
            Tt = function(e, t, n) {
                var r = "0x" + t - 65536;
                return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
            };
        try {
            Z.apply(G = et.call(R.childNodes), R.childNodes), G[R.childNodes.length].nodeType
        } catch (Ct) {
            Z = {
                apply: G.length ? function(e, t) {
                    K.apply(e, et.call(t))
                } : function(e, t) {
                    for (var n = e.length, r = 0; e[n++] = t[r++];);
                    e.length = n - 1
                }
            }
        }
        C = t.support = {}, k = t.isXML = function(e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return t ? "HTML" !== t.nodeName : !1
        }, L = t.setDocument = function(e) {
            var t, n = e ? e.ownerDocument || e : R,
                r = n.defaultView;
            return n !== H && 9 === n.nodeType && n.documentElement ? (H = n, q = n.documentElement, _ = !k(n), r && r !== r.top && (r.addEventListener ? r.addEventListener("unload", function() {
                L()
            }, !1) : r.attachEvent && r.attachEvent("onunload", function() {
                L()
            })), C.attributes = i(function(e) {
                return e.className = "i", !e.getAttribute("className")
            }), C.getElementsByTagName = i(function(e) {
                return e.appendChild(n.createComment("")), !e.getElementsByTagName("*").length
            }), C.getElementsByClassName = vt.test(n.getElementsByClassName) && i(function(e) {
                return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 2 === e.getElementsByClassName("i").length
            }), C.getById = i(function(e) {
                return q.appendChild(e).id = P, !n.getElementsByName || !n.getElementsByName(P).length
            }), C.getById ? (N.find.ID = function(e, t) {
                if (typeof t.getElementById !== V && _) {
                    var n = t.getElementById(e);
                    return n && n.parentNode ? [n] : []
                }
            }, N.filter.ID = function(e) {
                var t = e.replace(wt, Tt);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }) : (delete N.find.ID, N.filter.ID = function(e) {
                var t = e.replace(wt, Tt);
                return function(e) {
                    var n = typeof e.getAttributeNode !== V && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }), N.find.TAG = C.getElementsByTagName ? function(e, t) {
                return typeof t.getElementsByTagName !== V ? t.getElementsByTagName(e) : void 0
            } : function(e, t) {
                var n, r = [],
                    i = 0,
                    o = t.getElementsByTagName(e);
                if ("*" === e) {
                    for (; n = o[i++];) 1 === n.nodeType && r.push(n);
                    return r
                }
                return o
            }, N.find.CLASS = C.getElementsByClassName && function(e, t) {
                return typeof t.getElementsByClassName !== V && _ ? t.getElementsByClassName(e) : void 0
            }, F = [], M = [], (C.qsa = vt.test(n.querySelectorAll)) && (i(function(e) {
                e.innerHTML = "<select t=''><option selected=''></option></select>", e.querySelectorAll("[t^='']").length && M.push("[*^$]=" + rt + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || M.push("\\[" + rt + "*(?:value|" + nt + ")"), e.querySelectorAll(":checked").length || M.push(":checked")
            }), i(function(e) {
                var t = n.createElement("input");
                t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && M.push("name" + rt + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || M.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), M.push(",.*:")
            })), (C.matchesSelector = vt.test(O = q.webkitMatchesSelector || q.mozMatchesSelector || q.oMatchesSelector || q.msMatchesSelector)) && i(function(e) {
                C.disconnectedMatch = O.call(e, "div"), O.call(e, "[s!='']:x"), F.push("!=", st)
            }), M = M.length && new RegExp(M.join("|")), F = F.length && new RegExp(F.join("|")), t = vt.test(q.compareDocumentPosition), B = t || vt.test(q.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e,
                    r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
            } : function(e, t) {
                if (t) for (; t = t.parentNode;) if (t === e) return !0;
                return !1
            }, U = t ? function(e, t) {
                if (e === t) return j = !0, 0;
                var r = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return r ? r : (r = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & r || !C.sortDetached && t.compareDocumentPosition(e) === r ? e === n || e.ownerDocument === R && B(R, e) ? -1 : t === n || t.ownerDocument === R && B(R, t) ? 1 : D ? tt.call(D, e) - tt.call(D, t) : 0 : 4 & r ? -1 : 1)
            } : function(e, t) {
                if (e === t) return j = !0, 0;
                var r, i = 0,
                    o = e.parentNode,
                    s = t.parentNode,
                    l = [e],
                    u = [t];
                if (!o || !s) return e === n ? -1 : t === n ? 1 : o ? -1 : s ? 1 : D ? tt.call(D, e) - tt.call(D, t) : 0;
                if (o === s) return a(e, t);
                for (r = e; r = r.parentNode;) l.unshift(r);
                for (r = t; r = r.parentNode;) u.unshift(r);
                for (; l[i] === u[i];) i++;
                return i ? a(l[i], u[i]) : l[i] === R ? -1 : u[i] === R ? 1 : 0
            }, n) : H
        }, t.matches = function(e, n) {
            return t(e, null, null, n)
        }, t.matchesSelector = function(e, n) {
            if ((e.ownerDocument || e) !== H && L(e), n = n.replace(dt, "='$1']"), !(!C.matchesSelector || !_ || F && F.test(n) || M && M.test(n))) try {
                var r = O.call(e, n);
                if (r || C.disconnectedMatch || e.document && 11 !== e.document.nodeType) return r
            } catch (i) {}
            return t(n, H, null, [e]).length > 0
        }, t.contains = function(e, t) {
            return (e.ownerDocument || e) !== H && L(e), B(e, t)
        }, t.attr = function(e, t) {
            (e.ownerDocument || e) !== H && L(e);
            var n = N.attrHandle[t.toLowerCase()],
                r = n && Y.call(N.attrHandle, t.toLowerCase()) ? n(e, t, !_) : void 0;
            return void 0 !== r ? r : C.attributes || !_ ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }, t.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }, t.uniqueSort = function(e) {
            var t, n = [],
                r = 0,
                i = 0;
            if (j = !C.detectDuplicates, D = !C.sortStable && e.slice(0), e.sort(U), j) {
                for (; t = e[i++];) t === e[i] && (r = n.push(i));
                for (; r--;) e.splice(n[r], 1)
            }
            return D = null, e
        }, E = t.getText = function(e) {
            var t, n = "",
                r = 0,
                i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent) return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling) n += E(e)
                } else if (3 === i || 4 === i) return e.nodeValue
            } else for (; t = e[r++];) n += E(t);
            return n
        }, N = t.selectors = {
            cacheLength: 50,
            createPseudo: r,
            match: ht,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(wt, Tt), e[3] = (e[4] || e[5] || "").replace(wt, Tt), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                },
                PSEUDO: function(e) {
                    var t, n = !e[5] && e[2];
                    return ht.CHILD.test(e[0]) ? null : (e[3] && void 0 !== e[4] ? e[2] = e[4] : n && ft.test(n) && (t = f(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(wt, Tt).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    } : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = z[e + " "];
                    return t || (t = new RegExp("(^|" + rt + ")" + e + "(" + rt + "|$)")) && z(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== V && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(e, n, r) {
                    return function(i) {
                        var o = t.attr(i, e);
                        return null == o ? "!=" === n : n ? (o += "", "=" === n ? o === r : "!=" === n ? o !== r : "^=" === n ? r && 0 === o.indexOf(r) : "*=" === n ? r && o.indexOf(r) > -1 : "$=" === n ? r && o.slice(-r.length) === r : "~=" === n ? (" " + o + " ").indexOf(r) > -1 : "|=" === n ? o === r || o.slice(0, r.length + 1) === r + "-" : !1) : !0
                    }
                },
                CHILD: function(e, t, n, r, i) {
                    var o = "nth" !== e.slice(0, 3),
                        a = "last" !== e.slice(-4),
                        s = "of-type" === t;
                    return 1 === r && 0 === i ? function(e) {
                        return !!e.parentNode
                    } : function(t, n, l) {
                        var u, c, d, f, p, h, m = o !== a ? "nextSibling" : "previousSibling",
                            g = t.parentNode,
                            v = s && t.nodeName.toLowerCase(),
                            y = !l && !s;
                        if (g) {
                            if (o) {
                                for (; m;) {
                                    for (d = t; d = d[m];) if (s ? d.nodeName.toLowerCase() === v : 1 === d.nodeType) return !1;
                                    h = m = "only" === e && !h && "nextSibling"
                                }
                                return !0
                            }
                            if (h = [a ? g.firstChild : g.lastChild], a && y) {
                                for (c = g[P] || (g[P] = {}), u = c[e] || [], p = u[0] === W && u[1], f = u[0] === W && u[2], d = p && g.childNodes[p]; d = ++p && d && d[m] || (f = p = 0) || h.pop();) if (1 === d.nodeType && ++f && d === t) {
                                    c[e] = [W, p, f];
                                    break
                                }
                            } else if (y && (u = (t[P] || (t[P] = {}))[e]) && u[0] === W) f = u[1];
                            else for (;
                            (d = ++p && d && d[m] || (f = p = 0) || h.pop()) && ((s ? d.nodeName.toLowerCase() !== v : 1 !== d.nodeType) || !++f || (y && ((d[P] || (d[P] = {}))[e] = [W, f]), d !== t)););
                            return f -= i, f === r || f % r === 0 && f / r >= 0
                        }
                    }
                },
                PSEUDO: function(e, n) {
                    var i, o = N.pseudos[e] || N.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                    return o[P] ? o(n) : o.length > 1 ? (i = [e, e, "", n], N.setFilters.hasOwnProperty(e.toLowerCase()) ? r(function(e, t) {
                        for (var r, i = o(e, n), a = i.length; a--;) r = tt.call(e, i[a]), e[r] = !(t[r] = i[a])
                    }) : function(e) {
                        return o(e, 0, i)
                    }) : o
                }
            },
            pseudos: {
                not: r(function(e) {
                    var t = [],
                        n = [],
                        i = S(e.replace(lt, "$1"));
                    return i[P] ? r(function(e, t, n, r) {
                        for (var o, a = i(e, null, r, []), s = e.length; s--;)(o = a[s]) && (e[s] = !(t[s] = o))
                    }) : function(e, r, o) {
                        return t[0] = e, i(t, null, o, n), !n.pop()
                    }
                }),
                has: r(function(e) {
                    return function(n) {
                        return t(e, n).length > 0
                    }
                }),
                contains: r(function(e) {
                    return function(t) {
                        return (t.textContent || t.innerText || E(t)).indexOf(e) > -1
                    }
                }),
                lang: r(function(e) {
                    return pt.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(wt, Tt).toLowerCase(),
                    function(t) {
                        var n;
                        do if (n = _ ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-");
                        while ((t = t.parentNode) && 1 === t.nodeType);
                        return !1
                    }
                }),
                target: function(t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                },
                root: function(e) {
                    return e === q
                },
                focus: function(e) {
                    return e === H.activeElement && (!H.hasFocus || H.hasFocus()) && !! (e.type || e.href || ~e.tabIndex)
                },
                enabled: function(e) {
                    return e.disabled === !1
                },
                disabled: function(e) {
                    return e.disabled === !0
                },
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !! e.checked || "option" === t && !! e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling) if (e.nodeType < 6) return !1;
                    return !0
                },
                parent: function(e) {
                    return !N.pseudos.empty(e)
                },
                header: function(e) {
                    return gt.test(e.nodeName)
                },
                input: function(e) {
                    return mt.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: u(function() {
                    return [0]
                }),
                last: u(function(e, t) {
                    return [t - 1]
                }),
                eq: u(function(e, t, n) {
                    return [0 > n ? n + t : n]
                }),
                even: u(function(e, t) {
                    for (var n = 0; t > n; n += 2) e.push(n);
                    return e
                }),
                odd: u(function(e, t) {
                    for (var n = 1; t > n; n += 2) e.push(n);
                    return e
                }),
                lt: u(function(e, t, n) {
                    for (var r = 0 > n ? n + t : n; --r >= 0;) e.push(r);
                    return e
                }),
                gt: u(function(e, t, n) {
                    for (var r = 0 > n ? n + t : n; ++r < t;) e.push(r);
                    return e
                })
            }
        }, N.pseudos.nth = N.pseudos.eq;
        for (T in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) N.pseudos[T] = s(T);
        for (T in {
            submit: !0,
            reset: !0
        }) N.pseudos[T] = l(T);
        return d.prototype = N.filters = N.pseudos, N.setFilters = new d, S = t.compile = function(e, t) {
            var n, r = [],
                i = [],
                o = X[e + " "];
            if (!o) {
                for (t || (t = f(e)), n = t.length; n--;) o = y(t[n]), o[P] ? r.push(o) : i.push(o);
                o = X(e, b(i, r))
            }
            return o
        }, C.sortStable = P.split("").sort(U).join("") === P, C.detectDuplicates = !! j, L(), C.sortDetached = i(function(e) {
            return 1 & e.compareDocumentPosition(H.createElement("div"))
        }), i(function(e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || o("type|href|height|width", function(e, t, n) {
            return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), C.attributes && i(function(e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || o("value", function(e, t, n) {
            return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
        }), i(function(e) {
            return null == e.getAttribute("disabled")
        }) || o(nt, function(e, t, n) {
            var r;
            return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }), t
    }(e);
    ot.find = ct, ot.expr = ct.selectors, ot.expr[":"] = ot.expr.pseudos, ot.unique = ct.uniqueSort, ot.text = ct.getText, ot.isXMLDoc = ct.isXML, ot.contains = ct.contains;
    var dt = ot.expr.match.needsContext,
        ft = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        pt = /^.[^:#\[\.,]*$/;
    ot.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? ot.find.matchesSelector(r, e) ? [r] : [] : ot.find.matches(e, ot.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }, ot.fn.extend({
        find: function(e) {
            var t, n = [],
                r = this,
                i = r.length;
            if ("string" != typeof e) return this.pushStack(ot(e).filter(function() {
                for (t = 0; i > t; t++) if (ot.contains(r[t], this)) return !0
            }));
            for (t = 0; i > t; t++) ot.find(e, r[t], n);
            return n = this.pushStack(i > 1 ? ot.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n
        },
        filter: function(e) {
            return this.pushStack(r(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(r(this, e || [], !0))
        },
        is: function(e) {
            return !!r(this, "string" == typeof e && dt.test(e) ? ot(e) : e || [], !1).length
        }
    });
    var ht, mt = e.document,
        gt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        vt = ot.fn.init = function(e, t) {
            var n, r;
            if (!e) return this;
            if ("string" == typeof e) {
                if (n = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : gt.exec(e), !n || !n[1] && t) return !t || t.jquery ? (t || ht).find(e) : this.constructor(t).find(e);
                if (n[1]) {
                    if (t = t instanceof ot ? t[0] : t, ot.merge(this, ot.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : mt, !0)), ft.test(n[1]) && ot.isPlainObject(t)) for (n in t) ot.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                    return this
                }
                if (r = mt.getElementById(n[2]), r && r.parentNode) {
                    if (r.id !== n[2]) return ht.find(e);
                    this.length = 1, this[0] = r
                }
                return this.context = mt, this.selector = e, this
            }
            return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : ot.isFunction(e) ? "undefined" != typeof ht.ready ? ht.ready(e) : e(ot) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), ot.makeArray(e, this))
        };
    vt.prototype = ot.fn, ht = ot(mt);
    var yt = /^(?:parents|prev(?:Until|All))/,
        bt = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    ot.extend({
        dir: function(e, t, n) {
            for (var r = [], i = e[t]; i && 9 !== i.nodeType && (void 0 === n || 1 !== i.nodeType || !ot(i).is(n));) 1 === i.nodeType && r.push(i), i = i[t];
            return r
        },
        sibling: function(e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        }
    }), ot.fn.extend({
        has: function(e) {
            var t, n = ot(e, this),
                r = n.length;
            return this.filter(function() {
                for (t = 0; r > t; t++) if (ot.contains(this, n[t])) return !0
            })
        },
        closest: function(e, t) {
            for (var n, r = 0, i = this.length, o = [], a = dt.test(e) || "string" != typeof e ? ot(e, t || this.context) : 0; i > r; r++) for (n = this[r]; n && n !== t; n = n.parentNode) if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && ot.find.matchesSelector(n, e))) {
                o.push(n);
                break
            }
            return this.pushStack(o.length > 1 ? ot.unique(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? ot.inArray(this[0], ot(e)) : ot.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(ot.unique(ot.merge(this.get(), ot(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), ot.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return ot.dir(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return ot.dir(e, "parentNode", n)
        },
        next: function(e) {
            return i(e, "nextSibling")
        },
        prev: function(e) {
            return i(e, "previousSibling")
        },
        nextAll: function(e) {
            return ot.dir(e, "nextSibling")
        },
        prevAll: function(e) {
            return ot.dir(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return ot.dir(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return ot.dir(e, "previousSibling", n)
        },
        siblings: function(e) {
            return ot.sibling((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return ot.sibling(e.firstChild)
        },
        contents: function(e) {
            return ot.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : ot.merge([], e.childNodes)
        }
    }, function(e, t) {
        ot.fn[e] = function(n, r) {
            var i = ot.map(this, t, n);
            return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (i = ot.filter(r, i)), this.length > 1 && (bt[e] || (i = ot.unique(i)), yt.test(e) && (i = i.reverse())), this.pushStack(i)
        }
    });
    var xt = /\S+/g,
        wt = {};
    ot.Callbacks = function(e) {
        e = "string" == typeof e ? wt[e] || o(e) : ot.extend({}, e);
        var t, n, r, i, a, s, l = [],
            u = !e.once && [],
            c = function(o) {
                for (n = e.memory && o, r = !0, a = s || 0, s = 0, i = l.length, t = !0; l && i > a; a++) if (l[a].apply(o[0], o[1]) === !1 && e.stopOnFalse) {
                    n = !1;
                    break
                }
                t = !1, l && (u ? u.length && c(u.shift()) : n ? l = [] : d.disable())
            }, d = {
                add: function() {
                    if (l) {
                        var r = l.length;
                        (function o(t) {
                            ot.each(t, function(t, n) {
                                var r = ot.type(n);
                                "function" === r ? e.unique && d.has(n) || l.push(n) : n && n.length && "string" !== r && o(n)
                            })
                        })(arguments), t ? i = l.length : n && (s = r, c(n))
                    }
                    return this
                },
                remove: function() {
                    return l && ot.each(arguments, function(e, n) {
                        for (var r;
                        (r = ot.inArray(n, l, r)) > -1;) l.splice(r, 1), t && (i >= r && i--, a >= r && a--)
                    }), this
                },
                has: function(e) {
                    return e ? ot.inArray(e, l) > -1 : !(!l || !l.length)
                },
                empty: function() {
                    return l = [], i = 0, this
                },
                disable: function() {
                    return l = u = n = void 0, this
                },
                disabled: function() {
                    return !l
                },
                lock: function() {
                    return u = void 0, n || d.disable(), this
                },
                locked: function() {
                    return !u
                },
                fireWith: function(e, n) {
                    return !l || r && !u || (n = n || [], n = [e, n.slice ? n.slice() : n], t ? u.push(n) : c(n)), this
                },
                fire: function() {
                    return d.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!r
                }
            };
        return d
    }, ot.extend({
        Deferred: function(e) {
            var t = [
                ["resolve", "done", ot.Callbacks("once memory"), "resolved"],
                ["reject", "fail", ot.Callbacks("once memory"), "rejected"],
                ["notify", "progress", ot.Callbacks("memory")]
            ],
                n = "pending",
                r = {
                    state: function() {
                        return n
                    },
                    always: function() {
                        return i.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var e = arguments;
                        return ot.Deferred(function(n) {
                            ot.each(t, function(t, o) {
                                var a = ot.isFunction(e[t]) && e[t];
                                i[o[1]](function() {
                                    var e = a && a.apply(this, arguments);
                                    e && ot.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[o[0] + "With"](this === r ? n.promise() : this, a ? [e] : arguments)
                                })
                            }), e = null
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? ot.extend(e, r) : r
                    }
                }, i = {};
            return r.pipe = r.then, ot.each(t, function(e, o) {
                var a = o[2],
                    s = o[3];
                r[o[1]] = a.add, s && a.add(function() {
                    n = s
                }, t[1 ^ e][2].disable, t[2][2].lock), i[o[0]] = function() {
                    return i[o[0] + "With"](this === i ? r : this, arguments), this
                }, i[o[0] + "With"] = a.fireWith
            }), r.promise(i), e && e.call(i, i), i
        },
        when: function(e) {
            var t, n, r, i = 0,
                o = Y.call(arguments),
                a = o.length,
                s = 1 !== a || e && ot.isFunction(e.promise) ? a : 0,
                l = 1 === s ? e : ot.Deferred(),
                u = function(e, n, r) {
                    return function(i) {
                        n[e] = this, r[e] = arguments.length > 1 ? Y.call(arguments) : i, r === t ? l.notifyWith(n, r) : --s || l.resolveWith(n, r)
                    }
                };
            if (a > 1) for (t = new Array(a), n = new Array(a), r = new Array(a); a > i; i++) o[i] && ot.isFunction(o[i].promise) ? o[i].promise().done(u(i, r, o)).fail(l.reject).progress(u(i, n, t)) : --s;
            return s || l.resolveWith(r, o), l.promise()
        }
    });
    var Tt;
    ot.fn.ready = function(e) {
        return ot.ready.promise().done(e), this
    }, ot.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? ot.readyWait++ : ot.ready(!0)
        },
        ready: function(e) {
            if (e === !0 ? !--ot.readyWait : !ot.isReady) {
                if (!mt.body) return setTimeout(ot.ready);
                ot.isReady = !0, e !== !0 && --ot.readyWait > 0 || (Tt.resolveWith(mt, [ot]), ot.fn.trigger && ot(mt).trigger("ready").off("ready"))
            }
        }
    }), ot.ready.promise = function(t) {
        if (!Tt) if (Tt = ot.Deferred(), "complete" === mt.readyState) setTimeout(ot.ready);
        else if (mt.addEventListener) mt.addEventListener("DOMContentLoaded", s, !1), e.addEventListener("load", s, !1);
        else {
            mt.attachEvent("onreadystatechange", s), e.attachEvent("onload", s);
            var n = !1;
            try {
                n = null == e.frameElement && mt.documentElement
            } catch (r) {}
            n && n.doScroll && function i() {
                if (!ot.isReady) {
                    try {
                        n.doScroll("left")
                    } catch (e) {
                        return setTimeout(i, 50)
                    }
                    a(), ot.ready()
                }
            }()
        }
        return Tt.promise(t)
    };
    var Ct, Nt = "undefined";
    for (Ct in ot(rt)) break;
    rt.ownLast = "0" !== Ct, rt.inlineBlockNeedsLayout = !1, ot(function() {
        var e, t, n = mt.getElementsByTagName("body")[0];
        n && (e = mt.createElement("div"), e.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", t = mt.createElement("div"), n.appendChild(e).appendChild(t), typeof t.style.zoom !== Nt && (t.style.cssText = "border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1", (rt.inlineBlockNeedsLayout = 3 === t.offsetWidth) && (n.style.zoom = 1)), n.removeChild(e), e = t = null)
    }),
    function() {
        var e = mt.createElement("div");
        if (null == rt.deleteExpando) {
            rt.deleteExpando = !0;
            try {
                delete e.test
            } catch (t) {
                rt.deleteExpando = !1
            }
        }
        e = null
    }(), ot.acceptData = function(e) {
        var t = ot.noData[(e.nodeName + " ").toLowerCase()],
            n = +e.nodeType || 1;
        return 1 !== n && 9 !== n ? !1 : !t || t !== !0 && e.getAttribute("classid") === t
    };
    var Et = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        kt = /([A-Z])/g;
    ot.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(e) {
            return e = e.nodeType ? ot.cache[e[ot.expando]] : e[ot.expando], !! e && !u(e)
        },
        data: function(e, t, n) {
            return c(e, t, n)
        },
        removeData: function(e, t) {
            return d(e, t)
        },
        _data: function(e, t, n) {
            return c(e, t, n, !0)
        },
        _removeData: function(e, t) {
            return d(e, t, !0)
        }
    }), ot.fn.extend({
        data: function(e, t) {
            var n, r, i, o = this[0],
                a = o && o.attributes;
            if (void 0 === e) {
                if (this.length && (i = ot.data(o), 1 === o.nodeType && !ot._data(o, "parsedAttrs"))) {
                    for (n = a.length; n--;) r = a[n].name, 0 === r.indexOf("data-") && (r = ot.camelCase(r.slice(5)), l(o, r, i[r]));
                    ot._data(o, "parsedAttrs", !0)
                }
                return i
            }
            return "object" == typeof e ? this.each(function() {
                ot.data(this, e)
            }) : arguments.length > 1 ? this.each(function() {
                ot.data(this, e, t)
            }) : o ? l(o, e, ot.data(o, e)) : void 0
        },
        removeData: function(e) {
            return this.each(function() {
                ot.removeData(this, e)
            })
        }
    }), ot.extend({
        queue: function(e, t, n) {
            var r;
            return e ? (t = (t || "fx") + "queue", r = ot._data(e, t), n && (!r || ot.isArray(n) ? r = ot._data(e, t, ot.makeArray(n)) : r.push(n)), r || []) : void 0
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = ot.queue(e, t),
                r = n.length,
                i = n.shift(),
                o = ot._queueHooks(e, t),
                a = function() {
                    ot.dequeue(e, t)
                };
            "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, a, o)), !r && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return ot._data(e, n) || ot._data(e, n, {
                empty: ot.Callbacks("once memory").add(function() {
                    ot._removeData(e, t + "queue"), ot._removeData(e, n)
                })
            })
        }
    }), ot.fn.extend({
        queue: function(e, t) {
            var n = 2;
            return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? ot.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                var n = ot.queue(this, e, t);
                ot._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && ot.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                ot.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, r = 1,
                i = ot.Deferred(),
                o = this,
                a = this.length,
                s = function() {
                    --r || i.resolveWith(o, [o])
                };
            for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;) n = ot._data(o[a], e + "queueHooks"), n && n.empty && (r++, n.empty.add(s));
            return s(), i.promise(t)
        }
    });
    var St = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        At = ["Top", "Right", "Bottom", "Left"],
        Dt = function(e, t) {
            return e = t || e, "none" === ot.css(e, "display") || !ot.contains(e.ownerDocument, e)
        }, jt = ot.access = function(e, t, n, r, i, o, a) {
            var s = 0,
                l = e.length,
                u = null == n;
            if ("object" === ot.type(n)) {
                i = !0;
                for (s in n) ot.access(e, t, s, n[s], !0, o, a)
            } else if (void 0 !== r && (i = !0, ot.isFunction(r) || (a = !0), u && (a ? (t.call(e, r), t = null) : (u = t, t = function(e, t, n) {
                return u.call(ot(e), n)
            })), t)) for (; l > s; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
            return i ? e : u ? t.call(e) : l ? t(e[0], n) : o
        }, Lt = /^(?:checkbox|radio)$/i;
    (function() {
        var e = mt.createDocumentFragment(),
            t = mt.createElement("div"),
            n = mt.createElement("input");
        if (t.setAttribute("className", "t"), t.innerHTML = "  <link/><table></table><a href='/a'>a</a>", rt.leadingWhitespace = 3 === t.firstChild.nodeType, rt.tbody = !t.getElementsByTagName("tbody").length, rt.htmlSerialize = !! t.getElementsByTagName("link").length, rt.html5Clone = "<:nav></:nav>" !== mt.createElement("nav").cloneNode(!0).outerHTML, n.type = "checkbox", n.checked = !0, e.appendChild(n), rt.appendChecked = n.checked, t.innerHTML = "<textarea>x</textarea>", rt.noCloneChecked = !! t.cloneNode(!0).lastChild.defaultValue, e.appendChild(t), t.innerHTML = "<input type='radio' checked='checked' name='t'/>", rt.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, rt.noCloneEvent = !0, t.attachEvent && (t.attachEvent("onclick", function() {
            rt.noCloneEvent = !1
        }), t.cloneNode(!0).click()), null == rt.deleteExpando) {
            rt.deleteExpando = !0;
            try {
                delete t.test
            } catch (r) {
                rt.deleteExpando = !1
            }
        }
        e = t = n = null
    })(),
    function() {
        var t, n, r = mt.createElement("div");
        for (t in {
            submit: !0,
            change: !0,
            focusin: !0
        }) n = "on" + t, (rt[t + "Bubbles"] = n in e) || (r.setAttribute(n, "t"), rt[t + "Bubbles"] = r.attributes[n].expando === !1);
        r = null
    }();
    var Ht = /^(?:input|select|textarea)$/i,
        qt = /^key/,
        _t = /^(?:mouse|contextmenu)|click/,
        Mt = /^(?:focusinfocus|focusoutblur)$/,
        Ft = /^([^.]*)(?:\.(.+)|)$/;
    ot.event = {
        global: {},
        add: function(e, t, n, r, i) {
            var o, a, s, l, u, c, d, f, p, h, m, g = ot._data(e);
            if (g) {
                for (n.handler && (l = n, n = l.handler, i = l.selector), n.guid || (n.guid = ot.guid++), (a = g.events) || (a = g.events = {}), (c = g.handle) || (c = g.handle = function(e) {
                    return typeof ot === Nt || e && ot.event.triggered === e.type ? void 0 : ot.event.dispatch.apply(c.elem, arguments)
                }, c.elem = e), t = (t || "").match(xt) || [""], s = t.length; s--;) o = Ft.exec(t[s]) || [], p = m = o[1], h = (o[2] || "").split(".").sort(), p && (u = ot.event.special[p] || {}, p = (i ? u.delegateType : u.bindType) || p, u = ot.event.special[p] || {}, d = ot.extend({
                    type: p,
                    origType: m,
                    data: r,
                    handler: n,
                    guid: n.guid,
                    selector: i,
                    needsContext: i && ot.expr.match.needsContext.test(i),
                    namespace: h.join(".")
                }, l), (f = a[p]) || (f = a[p] = [], f.delegateCount = 0, u.setup && u.setup.call(e, r, h, c) !== !1 || (e.addEventListener ? e.addEventListener(p, c, !1) : e.attachEvent && e.attachEvent("on" + p, c))), u.add && (u.add.call(e, d), d.handler.guid || (d.handler.guid = n.guid)), i ? f.splice(f.delegateCount++, 0, d) : f.push(d), ot.event.global[p] = !0);
                e = null
            }
        },
        remove: function(e, t, n, r, i) {
            var o, a, s, l, u, c, d, f, p, h, m, g = ot.hasData(e) && ot._data(e);
            if (g && (c = g.events)) {
                for (t = (t || "").match(xt) || [""], u = t.length; u--;) if (s = Ft.exec(t[u]) || [], p = m = s[1], h = (s[2] || "").split(".").sort(), p) {
                    for (d = ot.event.special[p] || {}, p = (r ? d.delegateType : d.bindType) || p, f = c[p] || [], s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = f.length; o--;) a = f[o], !i && m !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || r && r !== a.selector && ("**" !== r || !a.selector) || (f.splice(o, 1), a.selector && f.delegateCount--, d.remove && d.remove.call(e, a));
                    l && !f.length && (d.teardown && d.teardown.call(e, h, g.handle) !== !1 || ot.removeEvent(e, p, g.handle), delete c[p])
                } else for (p in c) ot.event.remove(e, p + t[u], n, r, !0);
                ot.isEmptyObject(c) && (delete g.handle, ot._removeData(e, "events"))
            }
        },
        trigger: function(t, n, r, i) {
            var o, a, s, l, u, c, d, f = [r || mt],
                p = tt.call(t, "type") ? t.type : t,
                h = tt.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = c = r = r || mt, 3 !== r.nodeType && 8 !== r.nodeType && !Mt.test(p + ot.event.triggered) && (p.indexOf(".") >= 0 && (h = p.split("."), p = h.shift(), h.sort()), a = p.indexOf(":") < 0 && "on" + p, t = t[ot.expando] ? t : new ot.Event(p, "object" == typeof t && t), t.isTrigger = i ? 2 : 3, t.namespace = h.join("."), t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = r), n = null == n ? [t] : ot.makeArray(n, [t]), u = ot.event.special[p] || {}, i || !u.trigger || u.trigger.apply(r, n) !== !1)) {
                if (!i && !u.noBubble && !ot.isWindow(r)) {
                    for (l = u.delegateType || p, Mt.test(l + p) || (s = s.parentNode); s; s = s.parentNode) f.push(s), c = s;
                    c === (r.ownerDocument || mt) && f.push(c.defaultView || c.parentWindow || e)
                }
                for (d = 0;
                (s = f[d++]) && !t.isPropagationStopped();) t.type = d > 1 ? l : u.bindType || p, o = (ot._data(s, "events") || {})[t.type] && ot._data(s, "handle"), o && o.apply(s, n), o = a && s[a], o && o.apply && ot.acceptData(s) && (t.result = o.apply(s, n), t.result === !1 && t.preventDefault());
                if (t.type = p, !i && !t.isDefaultPrevented() && (!u._default || u._default.apply(f.pop(), n) === !1) && ot.acceptData(r) && a && r[p] && !ot.isWindow(r)) {
                    c = r[a], c && (r[a] = null), ot.event.triggered = p;
                    try {
                        r[p]()
                    } catch (m) {}
                    ot.event.triggered = void 0, c && (r[a] = c)
                }
                return t.result
            }
        },
        dispatch: function(e) {
            e = ot.event.fix(e);
            var t, n, r, i, o, a = [],
                s = Y.call(arguments),
                l = (ot._data(this, "events") || {})[e.type] || [],
                u = ot.event.special[e.type] || {};
            if (s[0] = e, e.delegateTarget = this, !u.preDispatch || u.preDispatch.call(this, e) !== !1) {
                for (a = ot.event.handlers.call(this, e, l), t = 0;
                (i = a[t++]) && !e.isPropagationStopped();) for (e.currentTarget = i.elem, o = 0;
                (r = i.handlers[o++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(r.namespace)) && (e.handleObj = r, e.data = r.data, n = ((ot.event.special[r.origType] || {}).handle || r.handler).apply(i.elem, s), void 0 !== n && (e.result = n) === !1 && (e.preventDefault(), e.stopPropagation()));
                return u.postDispatch && u.postDispatch.call(this, e), e.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, o, a = [],
                s = t.delegateCount,
                l = e.target;
            if (s && l.nodeType && (!e.button || "click" !== e.type)) for (; l != this; l = l.parentNode || this) if (1 === l.nodeType && (l.disabled !== !0 || "click" !== e.type)) {
                for (i = [], o = 0; s > o; o++) r = t[o], n = r.selector + " ", void 0 === i[n] && (i[n] = r.needsContext ? ot(n, this).index(l) >= 0 : ot.find(n, this, null, [l]).length), i[n] && i.push(r);
                i.length && a.push({
                    elem: l,
                    handlers: i
                })
            }
            return s < t.length && a.push({
                elem: this,
                handlers: t.slice(s)
            }), a
        },
        fix: function(e) {
            if (e[ot.expando]) return e;
            var t, n, r, i = e.type,
                o = e,
                a = this.fixHooks[i];
            for (a || (this.fixHooks[i] = a = _t.test(i) ? this.mouseHooks : qt.test(i) ? this.keyHooks : {}), r = a.props ? this.props.concat(a.props) : this.props, e = new ot.Event(o), t = r.length; t--;) n = r[t], e[n] = o[n];
            return e.target || (e.target = o.srcElement || mt), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !! e.metaKey, a.filter ? a.filter(e, o) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var n, r, i, o = t.button,
                    a = t.fromElement;
                return null == e.pageX && null != t.clientX && (r = e.target.ownerDocument || mt, i = r.documentElement, n = r.body, e.pageX = t.clientX + (i && i.scrollLeft || n && n.scrollLeft || 0) - (i && i.clientLeft || n && n.clientLeft || 0), e.pageY = t.clientY + (i && i.scrollTop || n && n.scrollTop || 0) - (i && i.clientTop || n && n.clientTop || 0)), !e.relatedTarget && a && (e.relatedTarget = a === e.target ? t.toElement : a), e.which || void 0 === o || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0), e
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== h() && this.focus) try {
                        return this.focus(), !1
                    } catch (e) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === h() && this.blur ? (this.blur(), !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return ot.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                },
                _default: function(e) {
                    return ot.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function(e, t, n, r) {
            var i = ot.extend(new ot.Event, n, {
                type: e,
                isSimulated: !0,
                originalEvent: {}
            });
            r ? ot.event.trigger(i, null, t) : ot.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault()
        }
    }, ot.removeEvent = mt.removeEventListener ? function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    } : function(e, t, n) {
        var r = "on" + t;
        e.detachEvent && (typeof e[r] === Nt && (e[r] = null), e.detachEvent(r, n))
    }, ot.Event = function(e, t) {
        return this instanceof ot.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && (e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault()) ? f : p) : this.type = e, t && ot.extend(this, t), this.timeStamp = e && e.timeStamp || ot.now(), void(this[ot.expando] = !0)) : new ot.Event(e, t)
    }, ot.Event.prototype = {
        isDefaultPrevented: p,
        isPropagationStopped: p,
        isImmediatePropagationStopped: p,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = f, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = f, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = f, this.stopPropagation()
        }
    }, ot.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(e, t) {
        ot.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, r = this,
                    i = e.relatedTarget,
                    o = e.handleObj;
                return (!i || i !== r && !ot.contains(r, i)) && (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
            }
        }
    }), rt.submitBubbles || (ot.event.special.submit = {
        setup: function() {
            return ot.nodeName(this, "form") ? !1 : void ot.event.add(this, "click._submit keypress._submit", function(e) {
                var t = e.target,
                    n = ot.nodeName(t, "input") || ot.nodeName(t, "button") ? t.form : void 0;
                n && !ot._data(n, "submitBubbles") && (ot.event.add(n, "submit._submit", function(e) {
                    e._submit_bubble = !0
                }), ot._data(n, "submitBubbles", !0))
            })
        },
        postDispatch: function(e) {
            e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && ot.event.simulate("submit", this.parentNode, e, !0))
        },
        teardown: function() {
            return ot.nodeName(this, "form") ? !1 : void ot.event.remove(this, "._submit")
        }
    }), rt.changeBubbles || (ot.event.special.change = {
        setup: function() {
            return Ht.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (ot.event.add(this, "propertychange._change", function(e) {
                "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
            }), ot.event.add(this, "click._change", function(e) {
                this._just_changed && !e.isTrigger && (this._just_changed = !1), ot.event.simulate("change", this, e, !0)
            })), !1) : void ot.event.add(this, "beforeactivate._change", function(e) {
                var t = e.target;
                Ht.test(t.nodeName) && !ot._data(t, "changeBubbles") && (ot.event.add(t, "change._change", function(e) {
                    !this.parentNode || e.isSimulated || e.isTrigger || ot.event.simulate("change", this.parentNode, e, !0)
                }), ot._data(t, "changeBubbles", !0))
            })
        },
        handle: function(e) {
            var t = e.target;
            return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return ot.event.remove(this, "._change"), !Ht.test(this.nodeName)
        }
    }), rt.focusinBubbles || ot.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = function(e) {
            ot.event.simulate(t, e.target, ot.event.fix(e), !0)
        };
        ot.event.special[t] = {
            setup: function() {
                var r = this.ownerDocument || this,
                    i = ot._data(r, t);
                i || r.addEventListener(e, n, !0), ot._data(r, t, (i || 0) + 1)
            },
            teardown: function() {
                var r = this.ownerDocument || this,
                    i = ot._data(r, t) - 1;
                i ? ot._data(r, t, i) : (r.removeEventListener(e, n, !0), ot._removeData(r, t))
            }
        }
    }), ot.fn.extend({
        on: function(e, t, n, r, i) {
            var o, a;
            if ("object" == typeof e) {
                "string" != typeof t && (n = n || t, t = void 0);
                for (o in e) this.on(o, t, n, e[o], i);
                return this
            }
            if (null == n && null == r ? (r = t, n = t = void 0) : null == r && ("string" == typeof t ? (r = n, n = void 0) : (r = n, n = t, t = void 0)), r === !1) r = p;
            else if (!r) return this;
            return 1 === i && (a = r, r = function(e) {
                return ot().off(e), a.apply(this, arguments)
            }, r.guid = a.guid || (a.guid = ot.guid++)), this.each(function() {
                ot.event.add(this, e, r, n, t)
            })
        },
        one: function(e, t, n, r) {
            return this.on(e, t, n, r, 1)
        },
        off: function(e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj) return r = e.handleObj, ot(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
            if ("object" == typeof e) {
                for (i in e) this.off(i, t, e[i]);
                return this
            }
            return (t === !1 || "function" == typeof t) && (n = t, t = void 0), n === !1 && (n = p), this.each(function() {
                ot.event.remove(this, e, n, t)
            })
        },
        trigger: function(e, t) {
            return this.each(function() {
                ot.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            return n ? ot.event.trigger(e, t, n, !0) : void 0
        }
    });
    var Ot = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        Bt = / jQuery\d+="(?:null|\d+)"/g,
        Pt = new RegExp("<(?:" + Ot + ")[\\s/>]", "i"),
        Rt = /^\s+/,
        Wt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        $t = /<([\w:]+)/,
        zt = /<tbody/i,
        It = /<|&#?\w+;/,
        Xt = /<(?:script|style|link)/i,
        Ut = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Vt = /^$|\/(?:java|ecma)script/i,
        Jt = /^true\/(.*)/,
        Yt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        Gt = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: rt.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        }, Qt = m(mt),
        Kt = Qt.appendChild(mt.createElement("div"));
    Gt.optgroup = Gt.option, Gt.tbody = Gt.tfoot = Gt.colgroup = Gt.caption = Gt.thead, Gt.th = Gt.td, ot.extend({
        clone: function(e, t, n) {
            var r, i, o, a, s, l = ot.contains(e.ownerDocument, e);
            if (rt.html5Clone || ot.isXMLDoc(e) || !Pt.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (Kt.innerHTML = e.outerHTML, Kt.removeChild(o = Kt.firstChild)), !(rt.noCloneEvent && rt.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || ot.isXMLDoc(e))) for (r = g(o), s = g(e), a = 0; null != (i = s[a]); ++a) r[a] && C(i, r[a]);
            if (t) if (n) for (s = s || g(e), r = r || g(o), a = 0; null != (i = s[a]); a++) T(i, r[a]);
            else T(e, o);
            return r = g(o, "script"), r.length > 0 && w(r, !l && g(e, "script")), r = s = i = null, o
        },
        buildFragment: function(e, t, n, r) {
            for (var i, o, a, s, l, u, c, d = e.length, f = m(t), p = [], h = 0; d > h; h++) if (o = e[h], o || 0 === o) if ("object" === ot.type(o)) ot.merge(p, o.nodeType ? [o] : o);
            else if (It.test(o)) {
                for (s = s || f.appendChild(t.createElement("div")), l = ($t.exec(o) || ["", ""])[1].toLowerCase(), c = Gt[l] || Gt._default, s.innerHTML = c[1] + o.replace(Wt, "<$1></$2>") + c[2], i = c[0]; i--;) s = s.lastChild;
                if (!rt.leadingWhitespace && Rt.test(o) && p.push(t.createTextNode(Rt.exec(o)[0])), !rt.tbody) for (o = "table" !== l || zt.test(o) ? "<table>" !== c[1] || zt.test(o) ? 0 : s : s.firstChild, i = o && o.childNodes.length; i--;) ot.nodeName(u = o.childNodes[i], "tbody") && !u.childNodes.length && o.removeChild(u);
                for (ot.merge(p, s.childNodes), s.textContent = ""; s.firstChild;) s.removeChild(s.firstChild);
                s = f.lastChild
            } else p.push(t.createTextNode(o));
            for (s && f.removeChild(s), rt.appendChecked || ot.grep(g(p, "input"), v), h = 0; o = p[h++];) if ((!r || -1 === ot.inArray(o, r)) && (a = ot.contains(o.ownerDocument, o), s = g(f.appendChild(o), "script"), a && w(s), n)) for (i = 0; o = s[i++];) Vt.test(o.type || "") && n.push(o);
            return s = null, f
        },
        cleanData: function(e, t) {
            for (var n, r, i, o, a = 0, s = ot.expando, l = ot.cache, u = rt.deleteExpando, c = ot.event.special; null != (n = e[a]); a++) if ((t || ot.acceptData(n)) && (i = n[s], o = i && l[i])) {
                if (o.events) for (r in o.events) c[r] ? ot.event.remove(n, r) : ot.removeEvent(n, r, o.handle);
                l[i] && (delete l[i], u ? delete n[s] : typeof n.removeAttribute !== Nt ? n.removeAttribute(s) : n[s] = null, J.push(i))
            }
        }
    }), ot.fn.extend({
        text: function(e) {
            return jt(this, function(e) {
                return void 0 === e ? ot.text(this) : this.empty().append((this[0] && this[0].ownerDocument || mt).createTextNode(e))
            }, null, e, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = y(this, e);
                    t.appendChild(e)
                }
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = y(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        remove: function(e, t) {
            for (var n, r = e ? ot.filter(e, this) : this, i = 0; null != (n = r[i]); i++) t || 1 !== n.nodeType || ot.cleanData(g(n)), n.parentNode && (t && ot.contains(n.ownerDocument, n) && w(g(n, "script")), n.parentNode.removeChild(n));
            return this
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++) {
                for (1 === e.nodeType && ot.cleanData(g(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
                e.options && ot.nodeName(e, "select") && (e.options.length = 0)
            }
            return this
        },
        clone: function(e, t) {
            return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
                return ot.clone(this, e, t)
            })
        },
        html: function(e) {
            return jt(this, function(e) {
                var t = this[0] || {}, n = 0,
                    r = this.length;
                if (void 0 === e) return 1 === t.nodeType ? t.innerHTML.replace(Bt, "") : void 0;
                if (!("string" != typeof e || Xt.test(e) || !rt.htmlSerialize && Pt.test(e) || !rt.leadingWhitespace && Rt.test(e) || Gt[($t.exec(e) || ["", ""])[1].toLowerCase()])) {
                    e = e.replace(Wt, "<$1></$2>");
                    try {
                        for (; r > n; n++) t = this[n] || {}, 1 === t.nodeType && (ot.cleanData(g(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (i) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var e = arguments[0];
            return this.domManip(arguments, function(t) {
                e = this.parentNode, ot.cleanData(g(this)), e && e.replaceChild(t, this)
            }), e && (e.length || e.nodeType) ? this : this.remove()
        },
        detach: function(e) {
            return this.remove(e, !0)
        },
        domManip: function(e, t) {
            e = G.apply([], e);
            var n, r, i, o, a, s, l = 0,
                u = this.length,
                c = this,
                d = u - 1,
                f = e[0],
                p = ot.isFunction(f);
            if (p || u > 1 && "string" == typeof f && !rt.checkClone && Ut.test(f)) return this.each(function(n) {
                var r = c.eq(n);
                p && (e[0] = f.call(this, n, r.html())), r.domManip(e, t)
            });
            if (u && (s = ot.buildFragment(e, this[0].ownerDocument, !1, this), n = s.firstChild, 1 === s.childNodes.length && (s = n), n)) {
                for (o = ot.map(g(s, "script"), b), i = o.length; u > l; l++) r = s, l !== d && (r = ot.clone(r, !0, !0), i && ot.merge(o, g(r, "script"))), t.call(this[l], r, l);
                if (i) for (a = o[o.length - 1].ownerDocument, ot.map(o, x), l = 0; i > l; l++) r = o[l], Vt.test(r.type || "") && !ot._data(r, "globalEval") && ot.contains(a, r) && (r.src ? ot._evalUrl && ot._evalUrl(r.src) : ot.globalEval((r.text || r.textContent || r.innerHTML || "").replace(Yt, "")));
                s = n = null
            }
            return this
        }
    }), ot.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        ot.fn[e] = function(e) {
            for (var n, r = 0, i = [], o = ot(e), a = o.length - 1; a >= r; r++) n = r === a ? this : this.clone(!0), ot(o[r])[t](n), Q.apply(i, n.get());
            return this.pushStack(i)
        }
    });
    var Zt, en = {};
    (function() {
        var e, t, n = mt.createElement("div"),
            r = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
        n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", e = n.getElementsByTagName("a")[0], e.style.cssText = "float:left;opacity:.5", rt.opacity = /^0.5/.test(e.style.opacity), rt.cssFloat = !! e.style.cssFloat, n.style.backgroundClip = "content-box", n.cloneNode(!0).style.backgroundClip = "", rt.clearCloneStyle = "content-box" === n.style.backgroundClip, e = n = null, rt.shrinkWrapBlocks = function() {
            var e, n, i, o;
            if (null == t) {
                if (e = mt.getElementsByTagName("body")[0], !e) return;
                o = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px", n = mt.createElement("div"), i = mt.createElement("div"), e.appendChild(n).appendChild(i), t = !1, typeof i.style.zoom !== Nt && (i.style.cssText = r + ";width:1px;padding:1px;zoom:1", i.innerHTML = "<div></div>", i.firstChild.style.width = "5px", t = 3 !== i.offsetWidth), e.removeChild(n), e = n = i = null
            }
            return t
        }
    })();
    var tn, nn, rn = /^margin/,
        on = new RegExp("^(" + St + ")(?!px)[a-z%]+$", "i"),
        an = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (tn = function(e) {
        return e.ownerDocument.defaultView.getComputedStyle(e, null)
    }, nn = function(e, t, n) {
        var r, i, o, a, s = e.style;
        return n = n || tn(e), a = n ? n.getPropertyValue(t) || n[t] : void 0, n && ("" !== a || ot.contains(e.ownerDocument, e) || (a = ot.style(e, t)), on.test(a) && rn.test(t) && (r = s.width, i = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = r, s.minWidth = i, s.maxWidth = o)), void 0 === a ? a : a + ""
    }) : mt.documentElement.currentStyle && (tn = function(e) {
        return e.currentStyle
    }, nn = function(e, t, n) {
        var r, i, o, a, s = e.style;
        return n = n || tn(e), a = n ? n[t] : void 0, null == a && s && s[t] && (a = s[t]), on.test(a) && !an.test(t) && (r = s.left, i = e.runtimeStyle, o = i && i.left, o && (i.left = e.currentStyle.left), s.left = "fontSize" === t ? "1em" : a, a = s.pixelLeft + "px", s.left = r, o && (i.left = o)), void 0 === a ? a : a + "" || "auto"
    }),
    function() {
        function t() {
            var t, n, r = mt.getElementsByTagName("body")[0];
            r && (t = mt.createElement("div"), n = mt.createElement("div"), t.style.cssText = u, r.appendChild(t).appendChild(n), n.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;display:block;padding:1px;border:1px;width:4px;margin-top:1%;top:1%", ot.swap(r, null != r.style.zoom ? {
                zoom: 1
            } : {}, function() {
                i = 4 === n.offsetWidth
            }), o = !0, a = !1, s = !0, e.getComputedStyle && (a = "1%" !== (e.getComputedStyle(n, null) || {}).top, o = "4px" === (e.getComputedStyle(n, null) || {
                width: "4px"
            }).width), r.removeChild(t), n = r = null)
        }
        var n, r, i, o, a, s, l = mt.createElement("div"),
            u = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px",
            c = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
        l.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = l.getElementsByTagName("a")[0], n.style.cssText = "float:left;opacity:.5", rt.opacity = /^0.5/.test(n.style.opacity), rt.cssFloat = !! n.style.cssFloat, l.style.backgroundClip = "content-box", l.cloneNode(!0).style.backgroundClip = "", rt.clearCloneStyle = "content-box" === l.style.backgroundClip, n = l = null, ot.extend(rt, {
            reliableHiddenOffsets: function() {
                if (null != r) return r;
                var e, t, n, i = mt.createElement("div"),
                    o = mt.getElementsByTagName("body")[0];
                if (o) return i.setAttribute("className", "t"), i.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", e = mt.createElement("div"), e.style.cssText = u, o.appendChild(e).appendChild(i), i.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", t = i.getElementsByTagName("td"), t[0].style.cssText = "padding:0;margin:0;border:0;display:none", n = 0 === t[0].offsetHeight, t[0].style.display = "", t[1].style.display = "none", r = n && 0 === t[0].offsetHeight, o.removeChild(e), i = o = null, r
            },
            boxSizing: function() {
                return null == i && t(), i
            },
            boxSizingReliable: function() {
                return null == o && t(), o
            },
            pixelPosition: function() {
                return null == a && t(), a
            },
            reliableMarginRight: function() {
                var t, n, r, i;
                if (null == s && e.getComputedStyle) {
                    if (t = mt.getElementsByTagName("body")[0], !t) return;
                    n = mt.createElement("div"), r = mt.createElement("div"), n.style.cssText = u, t.appendChild(n).appendChild(r), i = r.appendChild(mt.createElement("div")), i.style.cssText = r.style.cssText = c, i.style.marginRight = i.style.width = "0", r.style.width = "1px", s = !parseFloat((e.getComputedStyle(i, null) || {}).marginRight), t.removeChild(n)
                }
                return s
            }
        })
    }(), ot.swap = function(e, t, n, r) {
        var i, o, a = {};
        for (o in t) a[o] = e.style[o], e.style[o] = t[o];
        i = n.apply(e, r || []);
        for (o in t) e.style[o] = a[o];
        return i
    };
    var sn = /alpha\([^)]*\)/i,
        ln = /opacity\s*=\s*([^)]*)/,
        un = /^(none|table(?!-c[ea]).+)/,
        cn = new RegExp("^(" + St + ")(.*)$", "i"),
        dn = new RegExp("^([+-])=(" + St + ")", "i"),
        fn = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        }, pn = {
            letterSpacing: 0,
            fontWeight: 400
        }, hn = ["Webkit", "O", "Moz", "ms"];
    ot.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = nn(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": rt.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, a, s = ot.camelCase(t),
                    l = e.style;
                if (t = ot.cssProps[s] || (ot.cssProps[s] = S(l, s)), a = ot.cssHooks[t] || ot.cssHooks[s], void 0 === n) return a && "get" in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t];
                if (o = typeof n, "string" === o && (i = dn.exec(n)) && (n = (i[1] + 1) * i[2] + parseFloat(ot.css(e, t)), o = "number"), null != n && n === n && ("number" !== o || ot.cssNumber[s] || (n += "px"), rt.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), !(a && "set" in a && void 0 === (n = a.set(e, n, r))))) try {
                    l[t] = "", l[t] = n
                } catch (u) {}
            }
        },
        css: function(e, t, n, r) {
            var i, o, a, s = ot.camelCase(t);
            return t = ot.cssProps[s] || (ot.cssProps[s] = S(e.style, s)), a = ot.cssHooks[t] || ot.cssHooks[s], a && "get" in a && (o = a.get(e, !0, n)), void 0 === o && (o = nn(e, t, r)), "normal" === o && t in pn && (o = pn[t]), "" === n || n ? (i = parseFloat(o), n === !0 || ot.isNumeric(i) ? i || 0 : o) : o
        }
    }), ot.each(["height", "width"], function(e, t) {
        ot.cssHooks[t] = {
            get: function(e, n, r) {
                return n ? 0 === e.offsetWidth && un.test(ot.css(e, "display")) ? ot.swap(e, fn, function() {
                    return L(e, t, r)
                }) : L(e, t, r) : void 0
            },
            set: function(e, n, r) {
                var i = r && tn(e);
                return D(e, n, r ? j(e, t, r, rt.boxSizing() && "border-box" === ot.css(e, "boxSizing", !1, i), i) : 0)
            }
        }
    }), rt.opacity || (ot.cssHooks.opacity = {
        get: function(e, t) {
            return ln.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        },
        set: function(e, t) {
            var n = e.style,
                r = e.currentStyle,
                i = ot.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                o = r && r.filter || n.filter || "";
            n.zoom = 1, (t >= 1 || "" === t) && "" === ot.trim(o.replace(sn, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || r && !r.filter) || (n.filter = sn.test(o) ? o.replace(sn, i) : o + " " + i)
        }
    }), ot.cssHooks.marginRight = k(rt.reliableMarginRight, function(e, t) {
        return t ? ot.swap(e, {
            display: "inline-block"
        }, nn, [e, "marginRight"]) : void 0
    }), ot.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        ot.cssHooks[e + t] = {
            expand: function(n) {
                for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; 4 > r; r++) i[e + At[r] + t] = o[r] || o[r - 2] || o[0];
                return i
            }
        }, rn.test(e) || (ot.cssHooks[e + t].set = D)
    }), ot.fn.extend({
        css: function(e, t) {
            return jt(this, function(e, t, n) {
                var r, i, o = {}, a = 0;
                if (ot.isArray(t)) {
                    for (r = tn(e), i = t.length; i > a; a++) o[t[a]] = ot.css(e, t[a], !1, r);
                    return o
                }
                return void 0 !== n ? ot.style(e, t, n) : ot.css(e, t)
            }, e, t, arguments.length > 1)
        },
        show: function() {
            return A(this, !0)
        },
        hide: function() {
            return A(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                Dt(this) ? ot(this).show() : ot(this).hide()
            })
        }
    }), ot.Tween = H, H.prototype = {
        constructor: H,
        init: function(e, t, n, r, i, o) {
            this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (ot.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = H.propHooks[this.prop];
            return e && e.get ? e.get(this) : H.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = H.propHooks[this.prop];
            return this.pos = t = this.options.duration ? ot.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : H.propHooks._default.set(this), this
        }
    }, H.prototype.init.prototype = H.prototype, H.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = ot.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
            },
            set: function(e) {
                ot.fx.step[e.prop] ? ot.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[ot.cssProps[e.prop]] || ot.cssHooks[e.prop]) ? ot.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    }, H.propHooks.scrollTop = H.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, ot.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    }, ot.fx = H.prototype.init, ot.fx.step = {};
    var mn, gn, vn = /^(?:toggle|show|hide)$/,
        yn = new RegExp("^(?:([+-])=|)(" + St + ")([a-z%]*)$", "i"),
        bn = /queueHooks$/,
        xn = [F],
        wn = {
            "*": [function(e, t) {
                var n = this.createTween(e, t),
                    r = n.cur(),
                    i = yn.exec(t),
                    o = i && i[3] || (ot.cssNumber[e] ? "" : "px"),
                    a = (ot.cssNumber[e] || "px" !== o && +r) && yn.exec(ot.css(n.elem, e)),
                    s = 1,
                    l = 20;
                if (a && a[3] !== o) {
                    o = o || a[3], i = i || [], a = +r || 1;
                    do s = s || ".5", a /= s, ot.style(n.elem, e, a + o);
                    while (s !== (s = n.cur() / r) && 1 !== s && --l)
                }
                return i && (a = n.start = +a || +r || 0, n.unit = o, n.end = i[1] ? a + (i[1] + 1) * i[2] : +i[2]), n
            }]
        };
    ot.Animation = ot.extend(B, {
        tweener: function(e, t) {
            ot.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
            for (var n, r = 0, i = e.length; i > r; r++) n = e[r], wn[n] = wn[n] || [], wn[n].unshift(t)
        },
        prefilter: function(e, t) {
            t ? xn.unshift(e) : xn.push(e)
        }
    }), ot.speed = function(e, t, n) {
        var r = e && "object" == typeof e ? ot.extend({}, e) : {
            complete: n || !n && t || ot.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !ot.isFunction(t) && t
        };
        return r.duration = ot.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in ot.fx.speeds ? ot.fx.speeds[r.duration] : ot.fx.speeds._default, (null == r.queue || r.queue === !0) && (r.queue = "fx"), r.old = r.complete, r.complete = function() {
            ot.isFunction(r.old) && r.old.call(this), r.queue && ot.dequeue(this, r.queue)
        }, r
    }, ot.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(Dt).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(e, t, n, r) {
            var i = ot.isEmptyObject(e),
                o = ot.speed(t, n, r),
                a = function() {
                    var t = B(this, ot.extend({}, e), o);
                    (i || ot._data(this, "finish")) && t.stop(!0)
                };
            return a.finish = a, i || o.queue === !1 ? this.each(a) : this.queue(o.queue, a)
        },
        stop: function(e, t, n) {
            var r = function(e) {
                var t = e.stop;
                delete e.stop, t(n)
            };
            return "string" != typeof e && (n = t, t = e, e = void 0), t && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                var t = !0,
                    i = null != e && e + "queueHooks",
                    o = ot.timers,
                    a = ot._data(this);
                if (i) a[i] && a[i].stop && r(a[i]);
                else for (i in a) a[i] && a[i].stop && bn.test(i) && r(a[i]);
                for (i = o.length; i--;) o[i].elem !== this || null != e && o[i].queue !== e || (o[i].anim.stop(n), t = !1, o.splice(i, 1));
                (t || !n) && ot.dequeue(this, e)
            })
        },
        finish: function(e) {
            return e !== !1 && (e = e || "fx"), this.each(function() {
                var t, n = ot._data(this),
                    r = n[e + "queue"],
                    i = n[e + "queueHooks"],
                    o = ot.timers,
                    a = r ? r.length : 0;
                for (n.finish = !0, ot.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                for (t = 0; a > t; t++) r[t] && r[t].finish && r[t].finish.call(this);
                delete n.finish
            })
        }
    }), ot.each(["toggle", "show", "hide"], function(e, t) {
        var n = ot.fn[t];
        ot.fn[t] = function(e, r, i) {
            return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(_(t, !0), e, r, i)
        }
    }), ot.each({
        slideDown: _("show"),
        slideUp: _("hide"),
        slideToggle: _("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        ot.fn[e] = function(e, n, r) {
            return this.animate(t, e, n, r)
        }
    }), ot.timers = [], ot.fx.tick = function() {
        var e, t = ot.timers,
            n = 0;
        for (mn = ot.now(); n < t.length; n++) e = t[n], e() || t[n] !== e || t.splice(n--, 1);
        t.length || ot.fx.stop(), mn = void 0
    }, ot.fx.timer = function(e) {
        ot.timers.push(e), e() ? ot.fx.start() : ot.timers.pop()
    }, ot.fx.interval = 13, ot.fx.start = function() {
        gn || (gn = setInterval(ot.fx.tick, ot.fx.interval))
    }, ot.fx.stop = function() {
        clearInterval(gn), gn = null
    }, ot.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, ot.fn.delay = function(e, t) {
        return e = ot.fx ? ot.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
            var r = setTimeout(t, e);
            n.stop = function() {
                clearTimeout(r)
            }
        })
    },
    function() {
        var e, t, n, r, i = mt.createElement("div");
        i.setAttribute("className", "t"), i.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", e = i.getElementsByTagName("a")[0], n = mt.createElement("select"), r = n.appendChild(mt.createElement("option")), t = i.getElementsByTagName("input")[0], e.style.cssText = "top:1px", rt.getSetAttribute = "t" !== i.className, rt.style = /top/.test(e.getAttribute("style")), rt.hrefNormalized = "/a" === e.getAttribute("href"), rt.checkOn = !! t.value, rt.optSelected = r.selected, rt.enctype = !! mt.createElement("form").enctype, n.disabled = !0, rt.optDisabled = !r.disabled, t = mt.createElement("input"), t.setAttribute("value", ""), rt.input = "" === t.getAttribute("value"), t.value = "t", t.setAttribute("type", "radio"), rt.radioValue = "t" === t.value, e = t = n = r = i = null
    }();
    var Tn = /\r/g;
    ot.fn.extend({
        val: function(e) {
            var t, n, r, i = this[0]; {
                if (arguments.length) return r = ot.isFunction(e), this.each(function(n) {
                    var i;
                    1 === this.nodeType && (i = r ? e.call(this, n, ot(this).val()) : e, null == i ? i = "" : "number" == typeof i ? i += "" : ot.isArray(i) && (i = ot.map(i, function(e) {
                        return null == e ? "" : e + ""
                    })), t = ot.valHooks[this.type] || ot.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, i, "value") || (this.value = i))
                });
                if (i) return t = ot.valHooks[i.type] || ot.valHooks[i.nodeName.toLowerCase()], t && "get" in t && void 0 !== (n = t.get(i, "value")) ? n : (n = i.value, "string" == typeof n ? n.replace(Tn, "") : null == n ? "" : n)
            }
        }
    }), ot.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = ot.find.attr(e, "value");
                    return null != t ? t : ot.text(e)
                }
            },
            select: {
                get: function(e) {
                    for (var t, n, r = e.options, i = e.selectedIndex, o = "select-one" === e.type || 0 > i, a = o ? null : [], s = o ? i + 1 : r.length, l = 0 > i ? s : o ? i : 0; s > l; l++) if (n = r[l], !(!n.selected && l !== i || (rt.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && ot.nodeName(n.parentNode, "optgroup"))) {
                        if (t = ot(n).val(), o) return t;
                        a.push(t)
                    }
                    return a
                },
                set: function(e, t) {
                    for (var n, r, i = e.options, o = ot.makeArray(t), a = i.length; a--;) if (r = i[a], ot.inArray(ot.valHooks.option.get(r), o) >= 0) try {
                        r.selected = n = !0
                    } catch (s) {
                        r.scrollHeight
                    } else r.selected = !1;
                    return n || (e.selectedIndex = -1), i
                }
            }
        }
    }), ot.each(["radio", "checkbox"], function() {
        ot.valHooks[this] = {
            set: function(e, t) {
                return ot.isArray(t) ? e.checked = ot.inArray(ot(e).val(), t) >= 0 : void 0
            }
        }, rt.checkOn || (ot.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    });
    var Cn, Nn, En = ot.expr.attrHandle,
        kn = /^(?:checked|selected)$/i,
        Sn = rt.getSetAttribute,
        An = rt.input;
    ot.fn.extend({
        attr: function(e, t) {
            return jt(this, ot.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                ot.removeAttr(this, e)
            })
        }
    }), ot.extend({
        attr: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (e && 3 !== o && 8 !== o && 2 !== o) return typeof e.getAttribute === Nt ? ot.prop(e, t, n) : (1 === o && ot.isXMLDoc(e) || (t = t.toLowerCase(), r = ot.attrHooks[t] || (ot.expr.match.bool.test(t) ? Nn : Cn)), void 0 === n ? r && "get" in r && null !== (i = r.get(e, t)) ? i : (i = ot.find.attr(e, t), null == i ? void 0 : i) : null !== n ? r && "set" in r && void 0 !== (i = r.set(e, n, t)) ? i : (e.setAttribute(t, n + ""), n) : void ot.removeAttr(e, t))
        },
        removeAttr: function(e, t) {
            var n, r, i = 0,
                o = t && t.match(xt);
            if (o && 1 === e.nodeType) for (; n = o[i++];) r = ot.propFix[n] || n, ot.expr.match.bool.test(n) ? An && Sn || !kn.test(n) ? e[r] = !1 : e[ot.camelCase("default-" + n)] = e[r] = !1 : ot.attr(e, n, ""), e.removeAttribute(Sn ? n : r)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!rt.radioValue && "radio" === t && ot.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        }
    }), Nn = {
        set: function(e, t, n) {
            return t === !1 ? ot.removeAttr(e, n) : An && Sn || !kn.test(n) ? e.setAttribute(!Sn && ot.propFix[n] || n, n) : e[ot.camelCase("default-" + n)] = e[n] = !0, n
        }
    }, ot.each(ot.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = En[t] || ot.find.attr;
        En[t] = An && Sn || !kn.test(t) ? function(e, t, r) {
            var i, o;
            return r || (o = En[t], En[t] = i, i = null != n(e, t, r) ? t.toLowerCase() : null, En[t] = o), i
        } : function(e, t, n) {
            return n ? void 0 : e[ot.camelCase("default-" + t)] ? t.toLowerCase() : null
        }
    }), An && Sn || (ot.attrHooks.value = {
        set: function(e, t, n) {
            return ot.nodeName(e, "input") ? void(e.defaultValue = t) : Cn && Cn.set(e, t, n)
        }
    }), Sn || (Cn = {
        set: function(e, t, n) {
            var r = e.getAttributeNode(n);
            return r || e.setAttributeNode(r = e.ownerDocument.createAttribute(n)), r.value = t += "", "value" === n || t === e.getAttribute(n) ? t : void 0
        }
    }, En.id = En.name = En.coords = function(e, t, n) {
        var r;
        return n ? void 0 : (r = e.getAttributeNode(t)) && "" !== r.value ? r.value : null
    }, ot.valHooks.button = {
        get: function(e, t) {
            var n = e.getAttributeNode(t);
            return n && n.specified ? n.value : void 0
        },
        set: Cn.set
    }, ot.attrHooks.contenteditable = {
        set: function(e, t, n) {
            Cn.set(e, "" === t ? !1 : t, n)
        }
    }, ot.each(["width", "height"], function(e, t) {
        ot.attrHooks[t] = {
            set: function(e, n) {
                return "" === n ? (e.setAttribute(t, "auto"), n) : void 0
            }
        }
    })), rt.style || (ot.attrHooks.style = {
        get: function(e) {
            return e.style.cssText || void 0
        },
        set: function(e, t) {
            return e.style.cssText = t + ""
        }
    });
    var Dn = /^(?:input|select|textarea|button|object)$/i,
        jn = /^(?:a|area)$/i;
    ot.fn.extend({
        prop: function(e, t) {
            return jt(this, ot.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return e = ot.propFix[e] || e, this.each(function() {
                try {
                    this[e] = void 0, delete this[e]
                } catch (t) {}
            })
        }
    }), ot.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(e, t, n) {
            var r, i, o, a = e.nodeType;
            if (e && 3 !== a && 8 !== a && 2 !== a) return o = 1 !== a || !ot.isXMLDoc(e), o && (t = ot.propFix[t] || t, i = ot.propHooks[t]), void 0 !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get" in i && null !== (r = i.get(e, t)) ? r : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = ot.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : Dn.test(e.nodeName) || jn.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        }
    }), rt.hrefNormalized || ot.each(["href", "src"], function(e, t) {
        ot.propHooks[t] = {
            get: function(e) {
                return e.getAttribute(t, 4)
            }
        }
    }), rt.optSelected || (ot.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        }
    }), ot.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        ot.propFix[this.toLowerCase()] = this
    }), rt.enctype || (ot.propFix.enctype = "encoding");
    var Ln = /[\t\r\n\f]/g;
    ot.fn.extend({
        addClass: function(e) {
            var t, n, r, i, o, a, s = 0,
                l = this.length,
                u = "string" == typeof e && e;
            if (ot.isFunction(e)) return this.each(function(t) {
                ot(this).addClass(e.call(this, t, this.className))
            });
            if (u) for (t = (e || "").match(xt) || []; l > s; s++) if (n = this[s], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(Ln, " ") : " ")) {
                for (o = 0; i = t[o++];) r.indexOf(" " + i + " ") < 0 && (r += i + " ");
                a = ot.trim(r), n.className !== a && (n.className = a)
            }
            return this
        },
        removeClass: function(e) {
            var t, n, r, i, o, a, s = 0,
                l = this.length,
                u = 0 === arguments.length || "string" == typeof e && e;
            if (ot.isFunction(e)) return this.each(function(t) {
                ot(this).removeClass(e.call(this, t, this.className))
            });
            if (u) for (t = (e || "").match(xt) || []; l > s; s++) if (n = this[s], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(Ln, " ") : "")) {
                for (o = 0; i = t[o++];) for (; r.indexOf(" " + i + " ") >= 0;) r = r.replace(" " + i + " ", " ");
                a = e ? ot.trim(r) : "", n.className !== a && (n.className = a)
            }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(ot.isFunction(e) ? function(n) {
                ot(this).toggleClass(e.call(this, n, this.className, t), t)
            } : function() {
                if ("string" === n) for (var t, r = 0, i = ot(this), o = e.match(xt) || []; t = o[r++];) i.hasClass(t) ? i.removeClass(t) : i.addClass(t);
                else(n === Nt || "boolean" === n) && (this.className && ot._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : ot._data(this, "__className__") || "")
            })
        },
        hasClass: function(e) {
            for (var t = " " + e + " ", n = 0, r = this.length; r > n; n++) if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(Ln, " ").indexOf(t) >= 0) return !0;
            return !1
        }
    }), ot.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
        ot.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), ot.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        },
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    });
    var Hn = ot.now(),
        qn = /\?/,
        _n = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    ot.parseJSON = function(t) {
        if (e.JSON && e.JSON.parse) return e.JSON.parse(t + "");
        var n, r = null,
            i = ot.trim(t + "");
        return i && !ot.trim(i.replace(_n, function(e, t, i, o) {
            return n && t && (r = 0), 0 === r ? e : (n = i || t, r += !o - !i, "")
        })) ? Function("return " + i)() : ot.error("Invalid JSON: " + t)
    }, ot.parseXML = function(t) {
        var n, r;
        if (!t || "string" != typeof t) return null;
        try {
            e.DOMParser ? (r = new DOMParser, n = r.parseFromString(t, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(t))
        } catch (i) {
            n = void 0
        }
        return n && n.documentElement && !n.getElementsByTagName("parsererror").length || ot.error("Invalid XML: " + t), n
    };
    var Mn, Fn, On = /#.*$/,
        Bn = /([?&])_=[^&]*/,
        Pn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        Rn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Wn = /^(?:GET|HEAD)$/,
        $n = /^\/\//,
        zn = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        In = {}, Xn = {}, Un = "*/".concat("*");
    try {
        Fn = location.href
    } catch (Vn) {
        Fn = mt.createElement("a"), Fn.href = "", Fn = Fn.href
    }
    Mn = zn.exec(Fn.toLowerCase()) || [], ot.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Fn,
            type: "GET",
            isLocal: Rn.test(Mn[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Un,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": ot.parseJSON,
                "text xml": ot.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? W(W(e, ot.ajaxSettings), t) : W(ot.ajaxSettings, e)
        },
        ajaxPrefilter: P(In),
        ajaxTransport: P(Xn),
        ajax: function(e, t) {
            function n(e, t, n, r) {
                var i, c, v, y, x, T = t;
                2 !== b && (b = 2, s && clearTimeout(s), u = void 0, a = r || "", w.readyState = e > 0 ? 4 : 0, i = e >= 200 && 300 > e || 304 === e, n && (y = $(d, w, n)), y = z(d, y, w, i), i ? (d.ifModified && (x = w.getResponseHeader("Last-Modified"), x && (ot.lastModified[o] = x), x = w.getResponseHeader("etag"), x && (ot.etag[o] = x)), 204 === e || "HEAD" === d.type ? T = "nocontent" : 304 === e ? T = "notmodified" : (T = y.state, c = y.data, v = y.error, i = !v)) : (v = T, (e || !T) && (T = "error", 0 > e && (e = 0))), w.status = e, w.statusText = (t || T) + "", i ? h.resolveWith(f, [c, T, w]) : h.rejectWith(f, [w, T, v]), w.statusCode(g), g = void 0, l && p.trigger(i ? "ajaxSuccess" : "ajaxError", [w, d, i ? c : v]), m.fireWith(f, [w, T]), l && (p.trigger("ajaxComplete", [w, d]), --ot.active || ot.event.trigger("ajaxStop")))
            }
            "object" == typeof e && (t = e, e = void 0), t = t || {};
            var r, i, o, a, s, l, u, c, d = ot.ajaxSetup({}, t),
                f = d.context || d,
                p = d.context && (f.nodeType || f.jquery) ? ot(f) : ot.event,
                h = ot.Deferred(),
                m = ot.Callbacks("once memory"),
                g = d.statusCode || {}, v = {}, y = {}, b = 0,
                x = "canceled",
                w = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (2 === b) {
                            if (!c) for (c = {}; t = Pn.exec(a);) c[t[1].toLowerCase()] = t[2];
                            t = c[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function() {
                        return 2 === b ? a : null
                    },
                    setRequestHeader: function(e, t) {
                        var n = e.toLowerCase();
                        return b || (e = y[n] = y[n] || e, v[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return b || (d.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e) if (2 > b) for (t in e) g[t] = [g[t], e[t]];
                        else w.always(e[w.status]);
                        return this
                    },
                    abort: function(e) {
                        var t = e || x;
                        return u && u.abort(t), n(0, t), this
                    }
                };
            if (h.promise(w).complete = m.add, w.success = w.done, w.error = w.fail, d.url = ((e || d.url || Fn) + "").replace(On, "").replace($n, Mn[1] + "//"), d.type = t.method || t.type || d.method || d.type, d.dataTypes = ot.trim(d.dataType || "*").toLowerCase().match(xt) || [""], null == d.crossDomain && (r = zn.exec(d.url.toLowerCase()), d.crossDomain = !(!r || r[1] === Mn[1] && r[2] === Mn[2] && (r[3] || ("http:" === r[1] ? "80" : "443")) === (Mn[3] || ("http:" === Mn[1] ? "80" : "443")))), d.data && d.processData && "string" != typeof d.data && (d.data = ot.param(d.data, d.traditional)), R(In, d, t, w), 2 === b) return w;
            l = d.global, l && 0 === ot.active++ && ot.event.trigger("ajaxStart"), d.type = d.type.toUpperCase(), d.hasContent = !Wn.test(d.type), o = d.url, d.hasContent || (d.data && (o = d.url += (qn.test(o) ? "&" : "?") + d.data, delete d.data), d.cache === !1 && (d.url = Bn.test(o) ? o.replace(Bn, "$1_=" + Hn++) : o + (qn.test(o) ? "&" : "?") + "_=" + Hn++)), d.ifModified && (ot.lastModified[o] && w.setRequestHeader("If-Modified-Since", ot.lastModified[o]), ot.etag[o] && w.setRequestHeader("If-None-Match", ot.etag[o])), (d.data && d.hasContent && d.contentType !== !1 || t.contentType) && w.setRequestHeader("Content-Type", d.contentType), w.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ("*" !== d.dataTypes[0] ? ", " + Un + "; q=0.01" : "") : d.accepts["*"]);
            for (i in d.headers) w.setRequestHeader(i, d.headers[i]);
            if (d.beforeSend && (d.beforeSend.call(f, w, d) === !1 || 2 === b)) return w.abort();
            x = "abort";
            for (i in {
                success: 1,
                error: 1,
                complete: 1
            }) w[i](d[i]);
            if (u = R(Xn, d, t, w)) {
                w.readyState = 1, l && p.trigger("ajaxSend", [w, d]), d.async && d.timeout > 0 && (s = setTimeout(function() {
                    w.abort("timeout")
                }, d.timeout));
                try {
                    b = 1, u.send(v, n)
                } catch (T) {
                    if (!(2 > b)) throw T;
                    n(-1, T)
                }
            } else n(-1, "No Transport");
            return w
        },
        getJSON: function(e, t, n) {
            return ot.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return ot.get(e, void 0, t, "script")
        }
    }), ot.each(["get", "post"], function(e, t) {
        ot[t] = function(e, n, r, i) {
            return ot.isFunction(n) && (i = i || r, r = n, n = void 0), ot.ajax({
                url: e,
                type: t,
                dataType: i,
                data: n,
                success: r
            })
        }
    }), ot.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        ot.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), ot._evalUrl = function(e) {
        return ot.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        })
    }, ot.fn.extend({
        wrapAll: function(e) {
            if (ot.isFunction(e)) return this.each(function(t) {
                ot(this).wrapAll(e.call(this, t))
            });
            if (this[0]) {
                var t = ot(e, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                    for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                    return e
                }).append(this)
            }
            return this
        },
        wrapInner: function(e) {
            return this.each(ot.isFunction(e) ? function(t) {
                ot(this).wrapInner(e.call(this, t))
            } : function() {
                var t = ot(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = ot.isFunction(e);
            return this.each(function(n) {
                ot(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                ot.nodeName(this, "body") || ot(this).replaceWith(this.childNodes)
            }).end()
        }
    }), ot.expr.filters.hidden = function(e) {
        return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !rt.reliableHiddenOffsets() && "none" === (e.style && e.style.display || ot.css(e, "display"))
    }, ot.expr.filters.visible = function(e) {
        return !ot.expr.filters.hidden(e)
    };
    var Jn = /%20/g,
        Yn = /\[\]$/,
        Gn = /\r?\n/g,
        Qn = /^(?:submit|button|image|reset|file)$/i,
        Kn = /^(?:input|select|textarea|keygen)/i;
    ot.param = function(e, t) {
        var n, r = [],
            i = function(e, t) {
                t = ot.isFunction(t) ? t() : null == t ? "" : t, r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
        if (void 0 === t && (t = ot.ajaxSettings && ot.ajaxSettings.traditional), ot.isArray(e) || e.jquery && !ot.isPlainObject(e)) ot.each(e, function() {
            i(this.name, this.value)
        });
        else for (n in e) I(n, e[n], t, i);
        return r.join("&").replace(Jn, "+")
    }, ot.fn.extend({
        serialize: function() {
            return ot.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = ot.prop(this, "elements");
                return e ? ot.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !ot(this).is(":disabled") && Kn.test(this.nodeName) && !Qn.test(e) && (this.checked || !Lt.test(e))
            }).map(function(e, t) {
                var n = ot(this).val();
                return null == n ? null : ot.isArray(n) ? ot.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Gn, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Gn, "\r\n")
                }
            }).get()
        }
    }), ot.ajaxSettings.xhr = void 0 !== e.ActiveXObject ? function() {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && X() || U()
    } : X;
    var Zn = 0,
        er = {}, tr = ot.ajaxSettings.xhr();
    e.ActiveXObject && ot(e).on("unload", function() {
        for (var e in er) er[e](void 0, !0)
    }), rt.cors = !! tr && "withCredentials" in tr, tr = rt.ajax = !! tr, tr && ot.ajaxTransport(function(e) {
        if (!e.crossDomain || rt.cors) {
            var t;
            return {
                send: function(n, r) {
                    var i, o = e.xhr(),
                        a = ++Zn;
                    if (o.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields) for (i in e.xhrFields) o[i] = e.xhrFields[i];
                    e.mimeType && o.overrideMimeType && o.overrideMimeType(e.mimeType), e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
                    for (i in n) void 0 !== n[i] && o.setRequestHeader(i, n[i] + "");
                    o.send(e.hasContent && e.data || null), t = function(n, i) {
                        var s, l, u;
                        if (t && (i || 4 === o.readyState)) if (delete er[a], t = void 0, o.onreadystatechange = ot.noop, i) 4 !== o.readyState && o.abort();
                        else {
                            u = {}, s = o.status, "string" == typeof o.responseText && (u.text = o.responseText);
                            try {
                                l = o.statusText
                            } catch (c) {
                                l = ""
                            }
                            s || !e.isLocal || e.crossDomain ? 1223 === s && (s = 204) : s = u.text ? 200 : 404
                        }
                        u && r(s, l, u, o.getAllResponseHeaders())
                    }, e.async ? 4 === o.readyState ? setTimeout(t) : o.onreadystatechange = er[a] = t : t()
                },
                abort: function() {
                    t && t(void 0, !0)
                }
            }
        }
    }), ot.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(e) {
                return ot.globalEval(e), e
            }
        }
    }), ot.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), ot.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var t, n = mt.head || ot("head")[0] || mt.documentElement;
            return {
                send: function(r, i) {
                    t = mt.createElement("script"), t.async = !0, e.scriptCharset && (t.charset = e.scriptCharset), t.src = e.url, t.onload = t.onreadystatechange = function(e, n) {
                        (n || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null, t.parentNode && t.parentNode.removeChild(t), t = null, n || i(200, "success"))
                    }, n.insertBefore(t, n.firstChild)
                },
                abort: function() {
                    t && t.onload(void 0, !0)
                }
            }
        }
    });
    var nr = [],
        rr = /(=)\?(?=&|$)|\?\?/;
    ot.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = nr.pop() || ot.expando + "_" + Hn++;
            return this[e] = !0, e
        }
    }), ot.ajaxPrefilter("json jsonp", function(t, n, r) {
        var i, o, a, s = t.jsonp !== !1 && (rr.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && rr.test(t.data) && "data");
        return s || "jsonp" === t.dataTypes[0] ? (i = t.jsonpCallback = ot.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(rr, "$1" + i) : t.jsonp !== !1 && (t.url += (qn.test(t.url) ? "&" : "?") + t.jsonp + "=" + i), t.converters["script json"] = function() {
            return a || ot.error(i + " was not called"), a[0]
        }, t.dataTypes[0] = "json", o = e[i], e[i] = function() {
            a = arguments
        }, r.always(function() {
            e[i] = o, t[i] && (t.jsonpCallback = n.jsonpCallback, nr.push(i)), a && ot.isFunction(o) && o(a[0]), a = o = void 0
        }), "script") : void 0
    }), ot.parseHTML = function(e, t, n) {
        if (!e || "string" != typeof e) return null;
        "boolean" == typeof t && (n = t, t = !1), t = t || mt;
        var r = ft.exec(e),
            i = !n && [];
        return r ? [t.createElement(r[1])] : (r = ot.buildFragment([e], t, i), i && i.length && ot(i).remove(), ot.merge([], r.childNodes))
    };
    var ir = ot.fn.load;
    ot.fn.load = function(e, t, n) {
        if ("string" != typeof e && ir) return ir.apply(this, arguments);
        var r, i, o, a = this,
            s = e.indexOf(" ");
        return s >= 0 && (r = e.slice(s, e.length), e = e.slice(0, s)), ot.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (o = "POST"), a.length > 0 && ot.ajax({
            url: e,
            type: o,
            dataType: "html",
            data: t
        }).done(function(e) {
            i = arguments, a.html(r ? ot("<div>").append(ot.parseHTML(e)).find(r) : e)
        }).complete(n && function(e, t) {
            a.each(n, i || [e.responseText, t, e])
        }), this
    }, ot.expr.filters.animated = function(e) {
        return ot.grep(ot.timers, function(t) {
            return e === t.elem
        }).length
    };
    var or = e.document.documentElement;
    ot.offset = {
        setOffset: function(e, t, n) {
            var r, i, o, a, s, l, u, c = ot.css(e, "position"),
                d = ot(e),
                f = {};
            "static" === c && (e.style.position = "relative"), s = d.offset(), o = ot.css(e, "top"), l = ot.css(e, "left"), u = ("absolute" === c || "fixed" === c) && ot.inArray("auto", [o, l]) > -1, u ? (r = d.position(), a = r.top, i = r.left) : (a = parseFloat(o) || 0, i = parseFloat(l) || 0), ot.isFunction(t) && (t = t.call(e, n, s)), null != t.top && (f.top = t.top - s.top + a), null != t.left && (f.left = t.left - s.left + i), "using" in t ? t.using.call(e, f) : d.css(f)
        }
    }, ot.fn.extend({
        offset: function(e) {
            if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                ot.offset.setOffset(this, e, t)
            });
            var t, n, r = {
                top: 0,
                left: 0
            }, i = this[0],
                o = i && i.ownerDocument;
            if (o) return t = o.documentElement, ot.contains(t, i) ? (typeof i.getBoundingClientRect !== Nt && (r = i.getBoundingClientRect()), n = V(o), {
                top: r.top + (n.pageYOffset || t.scrollTop) - (t.clientTop || 0),
                left: r.left + (n.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
            }) : r
        },
        position: function() {
            if (this[0]) {
                var e, t, n = {
                    top: 0,
                    left: 0
                }, r = this[0];
                return "fixed" === ot.css(r, "position") ? t = r.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), ot.nodeName(e[0], "html") || (n = e.offset()), n.top += ot.css(e[0], "borderTopWidth", !0), n.left += ot.css(e[0], "borderLeftWidth", !0)), {
                    top: t.top - n.top - ot.css(r, "marginTop", !0),
                    left: t.left - n.left - ot.css(r, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent || or; e && !ot.nodeName(e, "html") && "static" === ot.css(e, "position");) e = e.offsetParent;
                return e || or
            })
        }
    }), ot.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, t) {
        var n = /Y/.test(t);
        ot.fn[e] = function(r) {
            return jt(this, function(e, r, i) {
                var o = V(e);
                return void 0 === i ? o ? t in o ? o[t] : o.document.documentElement[r] : e[r] : void(o ? o.scrollTo(n ? ot(o).scrollLeft() : i, n ? i : ot(o).scrollTop()) : e[r] = i)
            }, e, r, arguments.length, null)
        }
    }), ot.each(["top", "left"], function(e, t) {
        ot.cssHooks[t] = k(rt.pixelPosition, function(e, n) {
            return n ? (n = nn(e, t), on.test(n) ? ot(e).position()[t] + "px" : n) : void 0
        })
    }), ot.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        ot.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, r) {
            ot.fn[r] = function(r, i) {
                var o = arguments.length && (n || "boolean" != typeof r),
                    a = n || (r === !0 || i === !0 ? "margin" : "border");
                return jt(this, function(t, n, r) {
                    var i;
                    return ot.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (i = t.documentElement, Math.max(t.body["scroll" + e], i["scroll" + e], t.body["offset" + e], i["offset" + e], i["client" + e])) : void 0 === r ? ot.css(t, n, a) : ot.style(t, n, r, a)
                }, t, o ? r : void 0, o, null)
            }
        })
    }), ot.fn.size = function() {
        return this.length
    }, ot.fn.andSelf = ot.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
        return ot
    });
    var ar = e.jQuery,
        sr = e.$;
    return ot.noConflict = function(t) {
        return e.$ === ot && (e.$ = sr), t && e.jQuery === ot && (e.jQuery = ar), ot
    }, typeof t === Nt && (e.jQuery = e.$ = ot), ot
});
(function() {
    var n = this,
        t = n._,
        r = {}, e = Array.prototype,
        u = Object.prototype,
        i = Function.prototype,
        a = e.push,
        o = e.slice,
        c = e.concat,
        l = u.toString,
        f = u.hasOwnProperty,
        s = e.forEach,
        p = e.map,
        h = e.reduce,
        v = e.reduceRight,
        g = e.filter,
        d = e.every,
        m = e.some,
        y = e.indexOf,
        b = e.lastIndexOf,
        x = Array.isArray,
        w = Object.keys,
        _ = i.bind,
        j = function(n) {
            return n instanceof j ? n : this instanceof j ? void(this._wrapped = n) : new j(n)
        };
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = j), exports._ = j) : n._ = j, j.VERSION = "1.6.0";
    var A = j.each = j.forEach = function(n, t, e) {
        if (null == n) return n;
        if (s && n.forEach === s) n.forEach(t, e);
        else if (n.length === +n.length) {
            for (var u = 0, i = n.length; i > u; u++) if (t.call(e, n[u], u, n) === r) return
        } else for (var a = j.keys(n), u = 0, i = a.length; i > u; u++) if (t.call(e, n[a[u]], a[u], n) === r) return;
        return n
    };
    j.map = j.collect = function(n, t, r) {
        var e = [];
        return null == n ? e : p && n.map === p ? n.map(t, r) : (A(n, function(n, u, i) {
            e.push(t.call(r, n, u, i))
        }), e)
    };
    var O = "Reduce of empty array with no initial value";
    j.reduce = j.foldl = j.inject = function(n, t, r, e) {
        var u = arguments.length > 2;
        if (null == n && (n = []), h && n.reduce === h) return e && (t = j.bind(t, e)), u ? n.reduce(t, r) : n.reduce(t);
        if (A(n, function(n, i, a) {
            u ? r = t.call(e, r, n, i, a) : (r = n, u = !0)
        }), !u) throw new TypeError(O);
        return r
    }, j.reduceRight = j.foldr = function(n, t, r, e) {
        var u = arguments.length > 2;
        if (null == n && (n = []), v && n.reduceRight === v) return e && (t = j.bind(t, e)), u ? n.reduceRight(t, r) : n.reduceRight(t);
        var i = n.length;
        if (i !== +i) {
            var a = j.keys(n);
            i = a.length
        }
        if (A(n, function(o, c, l) {
            c = a ? a[--i] : --i, u ? r = t.call(e, r, n[c], c, l) : (r = n[c], u = !0)
        }), !u) throw new TypeError(O);
        return r
    }, j.find = j.detect = function(n, t, r) {
        var e;
        return k(n, function(n, u, i) {
            return t.call(r, n, u, i) ? (e = n, !0) : void 0
        }), e
    }, j.filter = j.select = function(n, t, r) {
        var e = [];
        return null == n ? e : g && n.filter === g ? n.filter(t, r) : (A(n, function(n, u, i) {
            t.call(r, n, u, i) && e.push(n)
        }), e)
    }, j.reject = function(n, t, r) {
        return j.filter(n, function(n, e, u) {
            return !t.call(r, n, e, u)
        }, r)
    }, j.every = j.all = function(n, t, e) {
        t || (t = j.identity);
        var u = !0;
        return null == n ? u : d && n.every === d ? n.every(t, e) : (A(n, function(n, i, a) {
            return (u = u && t.call(e, n, i, a)) ? void 0 : r
        }), !! u)
    };
    var k = j.some = j.any = function(n, t, e) {
        t || (t = j.identity);
        var u = !1;
        return null == n ? u : m && n.some === m ? n.some(t, e) : (A(n, function(n, i, a) {
            return u || (u = t.call(e, n, i, a)) ? r : void 0
        }), !! u)
    };
    j.contains = j.include = function(n, t) {
        return null == n ? !1 : y && n.indexOf === y ? -1 != n.indexOf(t) : k(n, function(n) {
            return n === t
        })
    }, j.invoke = function(n, t) {
        var r = o.call(arguments, 2),
            e = j.isFunction(t);
        return j.map(n, function(n) {
            return (e ? t : n[t]).apply(n, r)
        })
    }, j.pluck = function(n, t) {
        return j.map(n, j.property(t))
    }, j.where = function(n, t) {
        return j.filter(n, j.matches(t))
    }, j.findWhere = function(n, t) {
        return j.find(n, j.matches(t))
    }, j.max = function(n, t, r) {
        if (!t && j.isArray(n) && n[0] === +n[0] && n.length < 65535) return Math.max.apply(Math, n);
        var e = -1 / 0,
            u = -1 / 0;
        return A(n, function(n, i, a) {
            var o = t ? t.call(r, n, i, a) : n;
            o > u && (e = n, u = o)
        }), e
    }, j.min = function(n, t, r) {
        if (!t && j.isArray(n) && n[0] === +n[0] && n.length < 65535) return Math.min.apply(Math, n);
        var e = 1 / 0,
            u = 1 / 0;
        return A(n, function(n, i, a) {
            var o = t ? t.call(r, n, i, a) : n;
            u > o && (e = n, u = o)
        }), e
    }, j.shuffle = function(n) {
        var t, r = 0,
            e = [];
        return A(n, function(n) {
            t = j.random(r++), e[r - 1] = e[t], e[t] = n
        }), e
    }, j.sample = function(n, t, r) {
        return null == t || r ? (n.length !== +n.length && (n = j.values(n)), n[j.random(n.length - 1)]) : j.shuffle(n).slice(0, Math.max(0, t))
    };
    var E = function(n) {
        return null == n ? j.identity : j.isFunction(n) ? n : j.property(n)
    };
    j.sortBy = function(n, t, r) {
        return t = E(t), j.pluck(j.map(n, function(n, e, u) {
            return {
                value: n,
                index: e,
                criteria: t.call(r, n, e, u)
            }
        }).sort(function(n, t) {
            var r = n.criteria,
                e = t.criteria;
            if (r !== e) {
                if (r > e || void 0 === r) return 1;
                if (e > r || void 0 === e) return -1
            }
            return n.index - t.index
        }), "value")
    };
    var F = function(n) {
        return function(t, r, e) {
            var u = {};
            return r = E(r), A(t, function(i, a) {
                var o = r.call(e, i, a, t);
                n(u, o, i)
            }), u
        }
    };
    j.groupBy = F(function(n, t, r) {
        j.has(n, t) ? n[t].push(r) : n[t] = [r]
    }), j.indexBy = F(function(n, t, r) {
        n[t] = r
    }), j.countBy = F(function(n, t) {
        j.has(n, t) ? n[t]++ : n[t] = 1
    }), j.sortedIndex = function(n, t, r, e) {
        r = E(r);
        for (var u = r.call(e, t), i = 0, a = n.length; a > i;) {
            var o = i + a >>> 1;
            r.call(e, n[o]) < u ? i = o + 1 : a = o
        }
        return i
    }, j.toArray = function(n) {
        return n ? j.isArray(n) ? o.call(n) : n.length === +n.length ? j.map(n, j.identity) : j.values(n) : []
    }, j.size = function(n) {
        return null == n ? 0 : n.length === +n.length ? n.length : j.keys(n).length
    }, j.first = j.head = j.take = function(n, t, r) {
        return null == n ? void 0 : null == t || r ? n[0] : 0 > t ? [] : o.call(n, 0, t)
    }, j.initial = function(n, t, r) {
        return o.call(n, 0, n.length - (null == t || r ? 1 : t))
    }, j.last = function(n, t, r) {
        return null == n ? void 0 : null == t || r ? n[n.length - 1] : o.call(n, Math.max(n.length - t, 0))
    }, j.rest = j.tail = j.drop = function(n, t, r) {
        return o.call(n, null == t || r ? 1 : t)
    }, j.compact = function(n) {
        return j.filter(n, j.identity)
    };
    var M = function(n, t, r) {
        return t && j.every(n, j.isArray) ? c.apply(r, n) : (A(n, function(n) {
            j.isArray(n) || j.isArguments(n) ? t ? a.apply(r, n) : M(n, t, r) : r.push(n)
        }), r)
    };
    j.flatten = function(n, t) {
        return M(n, t, [])
    }, j.without = function(n) {
        return j.difference(n, o.call(arguments, 1))
    }, j.partition = function(n, t, r) {
        t = E(t);
        var e = [],
            u = [];
        return A(n, function(n) {
            (t.call(r, n) ? e : u).push(n)
        }), [e, u]
    }, j.uniq = j.unique = function(n, t, r, e) {
        j.isFunction(t) && (e = r, r = t, t = !1);
        var u = r ? j.map(n, r, e) : n,
            i = [],
            a = [];
        return A(u, function(r, e) {
            (t ? e && a[a.length - 1] === r : j.contains(a, r)) || (a.push(r), i.push(n[e]))
        }), i
    }, j.union = function() {
        return j.uniq(j.flatten(arguments, !0))
    }, j.intersection = function(n) {
        var t = o.call(arguments, 1);
        return j.filter(j.uniq(n), function(n) {
            return j.every(t, function(t) {
                return j.contains(t, n)
            })
        })
    }, j.difference = function(n) {
        var t = c.apply(e, o.call(arguments, 1));
        return j.filter(n, function(n) {
            return !j.contains(t, n)
        })
    }, j.zip = function() {
        for (var n = j.max(j.pluck(arguments, "length").concat(0)), t = new Array(n), r = 0; n > r; r++) t[r] = j.pluck(arguments, "" + r);
        return t
    }, j.object = function(n, t) {
        if (null == n) return {};
        for (var r = {}, e = 0, u = n.length; u > e; e++) t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1];
        return r
    }, j.indexOf = function(n, t, r) {
        if (null == n) return -1;
        var e = 0,
            u = n.length;
        if (r) {
            if ("number" != typeof r) return e = j.sortedIndex(n, t), n[e] === t ? e : -1;
            e = 0 > r ? Math.max(0, u + r) : r
        }
        if (y && n.indexOf === y) return n.indexOf(t, r);
        for (; u > e; e++) if (n[e] === t) return e;
        return -1
    }, j.lastIndexOf = function(n, t, r) {
        if (null == n) return -1;
        var e = null != r;
        if (b && n.lastIndexOf === b) return e ? n.lastIndexOf(t, r) : n.lastIndexOf(t);
        for (var u = e ? r : n.length; u--;) if (n[u] === t) return u;
        return -1
    }, j.range = function(n, t, r) {
        arguments.length <= 1 && (t = n || 0, n = 0), r = arguments[2] || 1;
        for (var e = Math.max(Math.ceil((t - n) / r), 0), u = 0, i = new Array(e); e > u;) i[u++] = n, n += r;
        return i
    };
    var R = function() {};
    j.bind = function(n, t) {
        var r, e;
        if (_ && n.bind === _) return _.apply(n, o.call(arguments, 1));
        if (!j.isFunction(n)) throw new TypeError;
        return r = o.call(arguments, 2), e = function() {
            if (!(this instanceof e)) return n.apply(t, r.concat(o.call(arguments)));
            R.prototype = n.prototype;
            var u = new R;
            R.prototype = null;
            var i = n.apply(u, r.concat(o.call(arguments)));
            return Object(i) === i ? i : u
        }
    }, j.partial = function(n) {
        var t = o.call(arguments, 1);
        return function() {
            for (var r = 0, e = t.slice(), u = 0, i = e.length; i > u; u++) e[u] === j && (e[u] = arguments[r++]);
            for (; r < arguments.length;) e.push(arguments[r++]);
            return n.apply(this, e)
        }
    }, j.bindAll = function(n) {
        var t = o.call(arguments, 1);
        if (0 === t.length) throw new Error("bindAll must be passed function names");
        return A(t, function(t) {
            n[t] = j.bind(n[t], n)
        }), n
    }, j.memoize = function(n, t) {
        var r = {};
        return t || (t = j.identity),
        function() {
            var e = t.apply(this, arguments);
            return j.has(r, e) ? r[e] : r[e] = n.apply(this, arguments)
        }
    }, j.delay = function(n, t) {
        var r = o.call(arguments, 2);
        return setTimeout(function() {
            return n.apply(null, r)
        }, t)
    }, j.defer = function(n) {
        return j.delay.apply(j, [n, 1].concat(o.call(arguments, 1)))
    }, j.throttle = function(n, t, r) {
        var e, u, i, a = null,
            o = 0;
        r || (r = {});
        var c = function() {
            o = r.leading === !1 ? 0 : j.now(), a = null, i = n.apply(e, u), e = u = null
        };
        return function() {
            var l = j.now();
            o || r.leading !== !1 || (o = l);
            var f = t - (l - o);
            return e = this, u = arguments, 0 >= f ? (clearTimeout(a), a = null, o = l, i = n.apply(e, u), e = u = null) : a || r.trailing === !1 || (a = setTimeout(c, f)), i
        }
    }, j.debounce = function(n, t, r) {
        var e, u, i, a, o, c = function() {
            var l = j.now() - a;
            t > l ? e = setTimeout(c, t - l) : (e = null, r || (o = n.apply(i, u), i = u = null))
        };
        return function() {
            i = this, u = arguments, a = j.now();
            var l = r && !e;
            return e || (e = setTimeout(c, t)), l && (o = n.apply(i, u), i = u = null), o
        }
    }, j.once = function(n) {
        var t, r = !1;
        return function() {
            return r ? t : (r = !0, t = n.apply(this, arguments), n = null, t)
        }
    }, j.wrap = function(n, t) {
        return j.partial(t, n)
    }, j.compose = function() {
        var n = arguments;
        return function() {
            for (var t = arguments, r = n.length - 1; r >= 0; r--) t = [n[r].apply(this, t)];
            return t[0]
        }
    }, j.after = function(n, t) {
        return function() {
            return --n < 1 ? t.apply(this, arguments) : void 0
        }
    }, j.keys = function(n) {
        if (!j.isObject(n)) return [];
        if (w) return w(n);
        var t = [];
        for (var r in n) j.has(n, r) && t.push(r);
        return t
    }, j.values = function(n) {
        for (var t = j.keys(n), r = t.length, e = new Array(r), u = 0; r > u; u++) e[u] = n[t[u]];
        return e
    }, j.pairs = function(n) {
        for (var t = j.keys(n), r = t.length, e = new Array(r), u = 0; r > u; u++) e[u] = [t[u], n[t[u]]];
        return e
    }, j.invert = function(n) {
        for (var t = {}, r = j.keys(n), e = 0, u = r.length; u > e; e++) t[n[r[e]]] = r[e];
        return t
    }, j.functions = j.methods = function(n) {
        var t = [];
        for (var r in n) j.isFunction(n[r]) && t.push(r);
        return t.sort()
    }, j.extend = function(n) {
        return A(o.call(arguments, 1), function(t) {
            if (t) for (var r in t) n[r] = t[r]
        }), n
    }, j.pick = function(n) {
        var t = {}, r = c.apply(e, o.call(arguments, 1));
        return A(r, function(r) {
            r in n && (t[r] = n[r])
        }), t
    }, j.omit = function(n) {
        var t = {}, r = c.apply(e, o.call(arguments, 1));
        for (var u in n) j.contains(r, u) || (t[u] = n[u]);
        return t
    }, j.defaults = function(n) {
        return A(o.call(arguments, 1), function(t) {
            if (t) for (var r in t) void 0 === n[r] && (n[r] = t[r])
        }), n
    }, j.clone = function(n) {
        return j.isObject(n) ? j.isArray(n) ? n.slice() : j.extend({}, n) : n
    }, j.tap = function(n, t) {
        return t(n), n
    };
    var S = function(n, t, r, e) {
        if (n === t) return 0 !== n || 1 / n == 1 / t;
        if (null == n || null == t) return n === t;
        n instanceof j && (n = n._wrapped), t instanceof j && (t = t._wrapped);
        var u = l.call(n);
        if (u != l.call(t)) return !1;
        switch (u) {
            case "[object String]":
                return n == String(t);
            case "[object Number]":
                return n != +n ? t != +t : 0 == n ? 1 / n == 1 / t : n == +t;
            case "[object Date]":
            case "[object Boolean]":
                return +n == +t;
            case "[object RegExp]":
                return n.source == t.source && n.global == t.global && n.multiline == t.multiline && n.ignoreCase == t.ignoreCase
        }
        if ("object" != typeof n || "object" != typeof t) return !1;
        for (var i = r.length; i--;) if (r[i] == n) return e[i] == t;
        var a = n.constructor,
            o = t.constructor;
        if (a !== o && !(j.isFunction(a) && a instanceof a && j.isFunction(o) && o instanceof o) && "constructor" in n && "constructor" in t) return !1;
        r.push(n), e.push(t);
        var c = 0,
            f = !0;
        if ("[object Array]" == u) {
            if (c = n.length, f = c == t.length) for (; c-- && (f = S(n[c], t[c], r, e)););
        } else {
            for (var s in n) if (j.has(n, s) && (c++, !(f = j.has(t, s) && S(n[s], t[s], r, e)))) break;
            if (f) {
                for (s in t) if (j.has(t, s) && !c--) break;
                f = !c
            }
        }
        return r.pop(), e.pop(), f
    };
    j.isEqual = function(n, t) {
        return S(n, t, [], [])
    }, j.isEmpty = function(n) {
        if (null == n) return !0;
        if (j.isArray(n) || j.isString(n)) return 0 === n.length;
        for (var t in n) if (j.has(n, t)) return !1;
        return !0
    }, j.isElement = function(n) {
        return !(!n || 1 !== n.nodeType)
    }, j.isArray = x || function(n) {
        return "[object Array]" == l.call(n)
    }, j.isObject = function(n) {
        return n === Object(n)
    }, A(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(n) {
        j["is" + n] = function(t) {
            return l.call(t) == "[object " + n + "]"
        }
    }), j.isArguments(arguments) || (j.isArguments = function(n) {
        return !(!n || !j.has(n, "callee"))
    }), "function" != typeof / . / && (j.isFunction = function(n) {
        return "function" == typeof n
    }), j.isFinite = function(n) {
        return isFinite(n) && !isNaN(parseFloat(n))
    }, j.isNaN = function(n) {
        return j.isNumber(n) && n != +n
    }, j.isBoolean = function(n) {
        return n === !0 || n === !1 || "[object Boolean]" == l.call(n)
    }, j.isNull = function(n) {
        return null === n
    }, j.isUndefined = function(n) {
        return void 0 === n
    }, j.has = function(n, t) {
        return f.call(n, t)
    }, j.noConflict = function() {
        return n._ = t, this
    }, j.identity = function(n) {
        return n
    }, j.constant = function(n) {
        return function() {
            return n
        }
    }, j.property = function(n) {
        return function(t) {
            return t[n]
        }
    }, j.matches = function(n) {
        return function(t) {
            if (t === n) return !0;
            for (var r in n) if (n[r] !== t[r]) return !1;
            return !0
        }
    }, j.times = function(n, t, r) {
        for (var e = Array(Math.max(0, n)), u = 0; n > u; u++) e[u] = t.call(r, u);
        return e
    }, j.random = function(n, t) {
        return null == t && (t = n, n = 0), n + Math.floor(Math.random() * (t - n + 1))
    }, j.now = Date.now || function() {
        return (new Date).getTime()
    };
    var T = {
        escape: {
            "&": "&",
            "<": "<",
            ">": ">",
            '"': """,
            "'": "'"
        }
    };
    T.unescape = j.invert(T.escape);
    var I = {
        escape: new RegExp("[" + j.keys(T.escape).join("") + "]", "g"),
        unescape: new RegExp("(" + j.keys(T.unescape).join("|") + ")", "g")
    };
    j.each(["escape", "unescape"], function(n) {
        j[n] = function(t) {
            return null == t ? "" : ("" + t).replace(I[n], function(t) {
                return T[n][t]
            })
        }
    }), j.result = function(n, t) {
        if (null == n) return void 0;
        var r = n[t];
        return j.isFunction(r) ? r.call(n) : r
    }, j.mixin = function(n) {
        A(j.functions(n), function(t) {
            var r = j[t] = n[t];
            j.prototype[t] = function() {
                var n = [this._wrapped];
                return a.apply(n, arguments), z.call(this, r.apply(j, n))
            }
        })
    };
    var N = 0;
    j.uniqueId = function(n) {
        var t = ++N + "";
        return n ? n + t : t
    }, j.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var q = /(.)^/,
        B = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "	": "t",
            "\u2028": "u2028",
            "\u2029": "u2029"
        }, D = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    j.template = function(n, t, r) {
        var e;
        r = j.defaults({}, r, j.templateSettings);
        var u = new RegExp([(r.escape || q).source, (r.interpolate || q).source, (r.evaluate || q).source].join("|") + "|$", "g"),
            i = 0,
            a = "__p+='";
        n.replace(u, function(t, r, e, u, o) {
            return a += n.slice(i, o).replace(D, function(n) {
                return "\\" + B[n]
            }), r && (a += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'"), e && (a += "'+\n((__t=(" + e + "))==null?'':__t)+\n'"), u && (a += "';\n" + u + "\n__p+='"), i = o + t.length, t
        }), a += "';\n", r.variable || (a = "with(obj||{}){\n" + a + "}\n"), a = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + a + "return __p;\n";
        try {
            e = new Function(r.variable || "obj", "_", a)
        } catch (o) {
            throw o.source = a, o
        }
        if (t) return e(t, j);
        var c = function(n) {
            return e.call(this, n, j)
        };
        return c.source = "function(" + (r.variable || "obj") + "){\n" + a + "}", c
    }, j.chain = function(n) {
        return j(n).chain()
    };
    var z = function(n) {
        return this._chain ? j(n).chain() : n
    };
    j.mixin(j), A(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(n) {
        var t = e[n];
        j.prototype[n] = function() {
            var r = this._wrapped;
            return t.apply(r, arguments), "shift" != n && "splice" != n || 0 !== r.length || delete r[0], z.call(this, r)
        }
    }), A(["concat", "join", "slice"], function(n) {
        var t = e[n];
        j.prototype[n] = function() {
            return z.call(this, t.apply(this._wrapped, arguments))
        }
    }), j.extend(j.prototype, {
        chain: function() {
            return this._chain = !0, this
        },
        value: function() {
            return this._wrapped
        }
    }), "function" == typeof define && define.amd && define("underscore", [], function() {
        return j
    })
}).call(this);
(function(t) {
    Q = t(), define("q", [], function() {
        return Q
    })
})(function() {
    function t(t) {
        return function() {
            return X.apply(t, arguments)
        }
    }
    function n(t) {
        return t === Object(t)
    }
    function e(t) {
        return "[object StopIteration]" === on(t) || t instanceof H
    }
    function r(t, n) {
        if (L && n.stack && "object" == typeof t && null !== t && t.stack && -1 === t.stack.indexOf(cn)) {
            for (var e = [], r = n; r; r = r.source) r.stack && e.unshift(r.stack);
            e.unshift(t.stack);
            var i = e.join("\n" + cn + "\n");
            t.stack = o(i)
        }
    }
    function o(t) {
        for (var n = t.split("\n"), e = [], r = 0; r < n.length; ++r) {
            var o = n[r];
            c(o) || i(o) || !o || e.push(o)
        }
        return e.join("\n")
    }
    function i(t) {
        return -1 !== t.indexOf("(module.js:") || -1 !== t.indexOf("(node.js:")
    }
    function u(t) {
        var n = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(t);
        if (n) return [n[1], Number(n[2])];
        var e = /at ([^ ]+):(\d+):(?:\d+)$/.exec(t);
        if (e) return [e[1], Number(e[2])];
        var r = /.*@(.+):(\d+)$/.exec(t);
        return r ? [r[1], Number(r[2])] : void 0
    }
    function c(t) {
        var n = u(t);
        if (!n) return !1;
        var e = n[0],
            r = n[1];
        return e === G && r >= J && ln >= r
    }
    function s() {
        if (L) try {
            throw new Error
        } catch (t) {
            var n = t.stack.split("\n"),
                e = n[0].indexOf("@") > 0 ? n[1] : n[2],
                r = u(e);
            if (!r) return;
            return G = r[0], r[1]
        }
    }
    function f(t, n, e) {
        return function() {
            return "undefined" != typeof console && "function" == typeof console.warn && console.warn(n + " is deprecated, use " + e + " instead.", new Error("").stack), t.apply(t, arguments)
        }
    }
    function p(t) {
        return m(t) ? t : g(t) ? D(t) : S(t)
    }
    function a() {
        function t(t) {
            n = t, i.source = t, Z(e, function(n, e) {
                W(function() {
                    t.promiseDispatch.apply(t, e)
                })
            }, void 0), e = void 0, r = void 0
        }
        var n, e = [],
            r = [],
            o = nn(a.prototype),
            i = nn(h.prototype);
        if (i.promiseDispatch = function(t, o, i) {
            var u = Y(arguments);
            e ? (e.push(u), "when" === o && i[1] && r.push(i[1])) : W(function() {
                n.promiseDispatch.apply(n, u)
            })
        }, i.valueOf = f(function() {
            if (e) return i;
            var t = v(n);
            return m(t) && (n = t), t
        }, "valueOf", "inspect"), i.inspect = function() {
            return n ? n.inspect() : {
                state: "pending"
            }
        }, p.longStackSupport && L) try {
            throw new Error
        } catch (u) {
            i.stack = u.stack.substring(u.stack.indexOf("\n") + 1)
        }
        return o.promise = i, o.resolve = function(e) {
            n || t(p(e))
        }, o.fulfill = function(e) {
            n || t(S(e))
        }, o.reject = function(e) {
            n || t(N(e))
        }, o.notify = function(t) {
            n || Z(r, function(n, e) {
                W(function() {
                    e(t)
                })
            }, void 0)
        }, o
    }
    function l(t) {
        if ("function" != typeof t) throw new TypeError("resolver must be a function.");
        var n = a();
        try {
            t(n.resolve, n.reject, n.notify)
        } catch (e) {
            n.reject(e)
        }
        return n.promise
    }
    function d(t) {
        return l(function(n, e) {
            for (var r = 0, o = t.length; o > r; r++) p(t[r]).then(n, e)
        })
    }
    function h(t, n, e) {
        void 0 === n && (n = function(t) {
            return N(new Error("Promise does not support operation: " + t))
        }), void 0 === e && (e = function() {
            return {
                state: "unknown"
            }
        });
        var r = nn(h.prototype);
        if (r.promiseDispatch = function(e, o, i) {
            var u;
            try {
                u = t[o] ? t[o].apply(r, i) : n.call(r, o, i)
            } catch (c) {
                u = N(c)
            }
            e && e(u)
        }, r.inspect = e, e) {
            var o = e();
            "rejected" === o.state && (r.exception = o.reason), r.valueOf = f(function() {
                var t = e();
                return "pending" === t.state || "rejected" === t.state ? r : t.value
            })
        }
        return r
    }
    function y(t, n, e, r) {
        return p(t).then(n, e, r)
    }
    function v(t) {
        if (m(t)) {
            var n = t.inspect();
            if ("fulfilled" === n.state) return n.value
        }
        return t
    }
    function m(t) {
        return n(t) && "function" == typeof t.promiseDispatch && "function" == typeof t.inspect
    }
    function g(t) {
        return n(t) && "function" == typeof t.then
    }
    function k(t) {
        return m(t) && "pending" === t.inspect().state
    }
    function j(t) {
        return !m(t) || "fulfilled" === t.inspect().state
    }
    function w(t) {
        return m(t) && "rejected" === t.inspect().state
    }
    function b() {
        pn = !0
    }
    function x() {
        for (var t = 0; t < sn.length; t++) {
            var n = sn[t];
            console.warn("Unhandled rejection reason:", n)
        }
    }
    function R() {
        sn.length = 0, fn.length = 0, pn = !1, an || (an = !0, "undefined" != typeof process && process.on && process.on("exit", x))
    }
    function O(t, n) {
        an && (fn.push(t), sn.push(n && "undefined" != typeof n.stack ? n.stack : "(no stack) " + n), b(), T(n))
    }
    function T(t) {
        if (t && t instanceof Error && t.constructor !== Error) throw t
    }
    function E(t) {
        if (an) {
            var n = _(fn, t); - 1 !== n && (fn.splice(n, 1), sn.splice(n, 1))
        }
    }
    function N(t) {
        var n = h({
            when: function(n) {
                return n && E(this), n ? n(t) : this
            }
        }, function() {
            return this
        }, function() {
            return {
                state: "rejected",
                reason: t
            }
        });
        return O(n, t), n
    }
    function S(t) {
        return h({
            when: function() {
                return t
            },
            get: function(n) {
                return t[n]
            },
            set: function(n, e) {
                t[n] = e
            },
            "delete": function(n) {
                delete t[n]
            },
            post: function(n, e) {
                return null === n || void 0 === n ? t.apply(void 0, e) : t[n].apply(t, e)
            },
            apply: function(n, e) {
                return t.apply(n, e)
            },
            keys: function() {
                return rn(t)
            }
        }, void 0, function() {
            return {
                state: "fulfilled",
                value: t
            }
        })
    }
    function D(t) {
        var n = a();
        return W(function() {
            try {
                t.then(n.resolve, n.reject, n.notify)
            } catch (e) {
                n.reject(e)
            }
        }), n.promise
    }
    function P(t) {
        return h({
            isDef: function() {}
        }, function(n, e) {
            return M(t, n, e)
        }, function() {
            return p(t).inspect()
        })
    }
    function A(t, n, e) {
        return p(t).spread(n, e)
    }
    function C(t) {
        return function() {
            function n(t, n) {
                var u;
                if (un) {
                    try {
                        u = r[t](n)
                    } catch (c) {
                        return N(c)
                    }
                    return u.done ? u.value : y(u.value, o, i)
                }
                try {
                    u = r[t](n)
                } catch (c) {
                    return e(c) ? c.value : N(c)
                }
                return y(u, o, i)
            }
            var r = t.apply(this, arguments),
                o = n.bind(n, "next"),
                i = n.bind(n, "throw");
            return o()
        }
    }
    function F(t) {
        p.done(p.async(t)())
    }
    function I(t) {
        throw new H(t)
    }
    function U(t) {
        return function() {
            return A([this, $(arguments)], function(n, e) {
                return t.apply(n, e)
            })
        }
    }
    function M(t, n, e) {
        return p(t).dispatch(n, e)
    }
    function $(t) {
        return y(t, function(t) {
            var n = 0,
                e = a();
            return Z(t, function(r, o, i) {
                var u;
                m(o) && "fulfilled" === (u = o.inspect()).state ? t[i] = u.value : (++n, y(o, function(r) {
                    t[i] = r, 0 === --n && e.resolve(t)
                }, e.reject, function(t) {
                    e.notify({
                        index: i,
                        value: t
                    })
                }))
            }, void 0), 0 === n && e.resolve(t), e.promise
        })
    }
    function B(t) {
        return y(t, function(t) {
            return t = tn(t, p), y($(tn(t, function(t) {
                return y(t, K, K)
            })), function() {
                return t
            })
        })
    }
    function Q(t) {
        return p(t).allSettled()
    }
    function V(t, n) {
        return p(t).then(void 0, void 0, n)
    }
    function q(t, n) {
        return p(t).nodeify(n)
    }
    var L = !1;
    try {
        throw new Error
    } catch (z) {
        L = !! z.stack
    }
    var G, H, J = s(),
        K = function() {}, W = function() {
            function t() {
                for (; n.next;) {
                    n = n.next;
                    var e = n.task;
                    n.task = void 0;
                    var o = n.domain;
                    o && (n.domain = void 0, o.enter());
                    try {
                        e()
                    } catch (u) {
                        if (i) throw o && o.exit(), setTimeout(t, 0), o && o.enter(), u;
                        setTimeout(function() {
                            throw u
                        }, 0)
                    }
                    o && o.exit()
                }
                r = !1
            }
            var n = {
                task: void 0,
                next: null
            }, e = n,
                r = !1,
                o = void 0,
                i = !1;
            if (W = function(t) {
                e = e.next = {
                    task: t,
                    domain: i && process.domain,
                    next: null
                }, r || (r = !0, o())
            }, "undefined" != typeof process && process.nextTick) i = !0, o = function() {
                process.nextTick(t)
            };
            else if ("function" == typeof setImmediate) o = "undefined" != typeof window ? setImmediate.bind(window, t) : function() {
                setImmediate(t)
            };
            else if ("undefined" != typeof MessageChannel) {
                var u = new MessageChannel;
                u.port1.onmessage = function() {
                    o = c, u.port1.onmessage = t, t()
                };
                var c = function() {
                    u.port2.postMessage(0)
                };
                o = function() {
                    setTimeout(t, 0), c()
                }
            } else o = function() {
                setTimeout(t, 0)
            };
            return W
        }(),
        X = Function.call,
        Y = t(Array.prototype.slice),
        Z = t(Array.prototype.reduce || function(t, n) {
            var e = 0,
                r = this.length;
            if (1 === arguments.length) for (;;) {
                if (e in this) {
                    n = this[e++];
                    break
                }
                if (++e >= r) throw new TypeError
            }
            for (; r > e; e++) e in this && (n = t(n, this[e], e));
            return n
        }),
        _ = t(Array.prototype.indexOf || function(t) {
            for (var n = 0; n < this.length; n++) if (this[n] === t) return n;
            return -1
        }),
        tn = t(Array.prototype.map || function(t, n) {
            var e = this,
                r = [];
            return Z(e, function(o, i, u) {
                r.push(t.call(n, i, u, e))
            }, void 0), r
        }),
        nn = Object.create || function(t) {
            function n() {}
            return n.prototype = t, new n
        }, en = t(Object.prototype.hasOwnProperty),
        rn = Object.keys || function(t) {
            var n = [];
            for (var e in t) en(t, e) && n.push(e);
            return n
        }, on = t(Object.prototype.toString);
    H = "undefined" != typeof ReturnValue ? ReturnValue : function(t) {
        this.value = t
    };
    var un;
    try {
        new Function("(function* (){ yield 1; })"), un = !0
    } catch (z) {
        un = !1
    }
    var cn = "From previous event:";
    p.resolve = p, p.nextTick = W, p.longStackSupport = !1, p.defer = a, a.prototype.makeNodeResolver = function() {
        var t = this;
        return function(n, e) {
            n ? t.reject(n) : t.resolve(arguments.length > 2 ? Y(arguments, 1) : e)
        }
    }, p.promise = l, p.passByCopy = function(t) {
        return t
    }, h.prototype.passByCopy = function() {
        return this
    }, p.join = function(t, n) {
        return p(t).join(n)
    }, h.prototype.join = function(t) {
        return p([this, t]).spread(function(t, n) {
            if (t === n) return t;
            throw new Error("Can't join: not the same: " + t + " " + n)
        })
    }, p.race = d, h.prototype.race = function() {
        return this.then(p.race)
    }, p.makePromise = h, h.prototype.toString = function() {
        return "[object Promise]"
    }, h.prototype.then = function(t, n, e) {
        function o(n) {
            try {
                return "function" == typeof t ? t(n) : n
            } catch (e) {
                return N(e)
            }
        }
        function i(t) {
            if ("function" == typeof n) {
                r(t, c);
                try {
                    return n(t)
                } catch (e) {
                    return N(e)
                }
            }
            return N(t)
        }
        function u(t) {
            return "function" == typeof e ? e(t) : t
        }
        var c = this,
            s = a(),
            f = !1;
        return W(function() {
            c.promiseDispatch(function(t) {
                f || (f = !0, s.resolve(o(t)))
            }, "when", [function(t) {
                f || (f = !0, s.resolve(i(t)))
            }])
        }), c.promiseDispatch(void 0, "when", [void 0, function(t) {
            var n, e = !1;
            try {
                n = u(t)
            } catch (r) {
                if (e = !0, !p.onerror) throw r;
                p.onerror(r)
            }
            e || s.notify(n)
        }]), s.promise
    }, p.when = y, h.prototype.thenResolve = function(t) {
        return this.then(function() {
            return t
        })
    }, p.thenResolve = function(t, n) {
        return p(t).thenResolve(n)
    }, h.prototype.thenReject = function(t) {
        return this.then(function() {
            throw t
        })
    }, p.thenReject = function(t, n) {
        return p(t).thenReject(n)
    }, p.nearer = v, p.isPromise = m, p.isPromiseAlike = g, p.isPending = k, h.prototype.isPending = function() {
        return "pending" === this.inspect().state
    }, p.isFulfilled = j, h.prototype.isFulfilled = function() {
        return "fulfilled" === this.inspect().state
    }, p.isRejected = w, h.prototype.isRejected = function() {
        return "rejected" === this.inspect().state
    };
    var sn = [],
        fn = [],
        pn = !1,
        an = !0;
    p.resetUnhandledRejections = R, p.getUnhandledReasons = function() {
        return sn.slice()
    }, p.stopUnhandledRejectionTracking = function() {
        R(), "undefined" != typeof process && process.on && process.removeListener("exit", x), an = !1
    }, R(), p.reject = N, p.fulfill = S, p.master = P, p.spread = A, h.prototype.spread = function(t, n) {
        return this.all().then(function(n) {
            return t.apply(void 0, n)
        }, n)
    }, p.async = C, p.spawn = F, p["return"] = I, p.promised = U, p.dispatch = M, h.prototype.dispatch = function(t, n) {
        var e = this,
            r = a();
        return W(function() {
            e.promiseDispatch(r.resolve, t, n)
        }), r.promise
    }, p.get = function(t, n) {
        return p(t).dispatch("get", [n])
    }, h.prototype.get = function(t) {
        return this.dispatch("get", [t])
    }, p.set = function(t, n, e) {
        return p(t).dispatch("set", [n, e])
    }, h.prototype.set = function(t, n) {
        return this.dispatch("set", [t, n])
    }, p.del = p["delete"] = function(t, n) {
        return p(t).dispatch("delete", [n])
    }, h.prototype.del = h.prototype["delete"] = function(t) {
        return this.dispatch("delete", [t])
    }, p.mapply = p.post = function(t, n, e) {
        return p(t).dispatch("post", [n, e])
    }, h.prototype.mapply = h.prototype.post = function(t, n) {
        return this.dispatch("post", [t, n])
    }, p.send = p.mcall = p.invoke = function(t, n) {
        return p(t).dispatch("post", [n, Y(arguments, 2)])
    }, h.prototype.send = h.prototype.mcall = h.prototype.invoke = function(t) {
        return this.dispatch("post", [t, Y(arguments, 1)])
    }, p.fapply = function(t, n) {
        return p(t).dispatch("apply", [void 0, n])
    }, h.prototype.fapply = function(t) {
        return this.dispatch("apply", [void 0, t])
    }, p["try"] = p.fcall = function(t) {
        return p(t).dispatch("apply", [void 0, Y(arguments, 1)])
    }, h.prototype.fcall = function() {
        return this.dispatch("apply", [void 0, Y(arguments)])
    }, p.fbind = function(t) {
        var n = p(t),
            e = Y(arguments, 1);
        return function() {
            return n.dispatch("apply", [this, e.concat(Y(arguments))])
        }
    }, h.prototype.fbind = function() {
        var t = this,
            n = Y(arguments);
        return function() {
            return t.dispatch("apply", [this, n.concat(Y(arguments))])
        }
    }, p.keys = function(t) {
        return p(t).dispatch("keys", [])
    }, h.prototype.keys = function() {
        return this.dispatch("keys", [])
    }, p.all = $, h.prototype.all = function() {
        return $(this)
    }, p.allResolved = f(B, "allResolved", "allSettled"), h.prototype.allResolved = function() {
        return B(this)
    }, p.allSettled = Q, h.prototype.allSettled = function() {
        return this.then(function(t) {
            return $(tn(t, function(t) {
                function n() {
                    return t.inspect()
                }
                return t = p(t), t.then(n, n)
            }))
        })
    }, p.fail = p["catch"] = function(t, n) {
        return p(t).then(void 0, n)
    }, h.prototype.fail = h.prototype["catch"] = function(t) {
        return this.then(void 0, t)
    }, p.progress = V, h.prototype.progress = function(t) {
        return this.then(void 0, void 0, t)
    }, p.fin = p["finally"] = function(t, n) {
        return p(t)["finally"](n)
    }, h.prototype.fin = h.prototype["finally"] = function(t) {
        return t = p(t), this.then(function(n) {
            return t.fcall().then(function() {
                return n
            })
        }, function(n) {
            return t.fcall().then(function() {
                throw n
            })
        })
    }, p.done = function(t, n, e, r) {
        return p(t).done(n, e, r)
    }, h.prototype.done = function(t, n, e) {
        var o = function(t) {
            W(function() {
                if (r(t, i), !p.onerror) throw t;
                p.onerror(t)
            })
        }, i = t || n || e ? this.then(t, n, e) : this;
        "object" == typeof process && process && process.domain && (o = process.domain.bind(o)), i.then(void 0, o)
    }, p.timeout = function(t, n, e) {
        return p(t).timeout(n, e)
    }, h.prototype.timeout = function(t, n) {
        var e = a(),
            r = setTimeout(function() {
                e.reject(new Error(n || "Timed out after " + t + " ms"))
            }, t);
        return this.then(function(t) {
            clearTimeout(r), e.resolve(t)
        }, function(t) {
            clearTimeout(r), e.reject(t)
        }, e.notify), e.promise
    }, p.delay = function(t, n) {
        return void 0 === n && (n = t, t = void 0), p(t).delay(n)
    }, h.prototype.delay = function(t) {
        return this.then(function(n) {
            var e = a();
            return setTimeout(function() {
                e.resolve(n)
            }, t), e.promise
        })
    }, p.nfapply = function(t, n) {
        return p(t).nfapply(n)
    }, h.prototype.nfapply = function(t) {
        var n = a(),
            e = Y(t);
        return e.push(n.makeNodeResolver()), this.fapply(e).fail(n.reject), n.promise
    }, p.nfcall = function(t) {
        var n = Y(arguments, 1);
        return p(t).nfapply(n)
    }, h.prototype.nfcall = function() {
        var t = Y(arguments),
            n = a();
        return t.push(n.makeNodeResolver()), this.fapply(t).fail(n.reject), n.promise
    }, p.nfbind = p.denodeify = function(t) {
        var n = Y(arguments, 1);
        return function() {
            var e = n.concat(Y(arguments)),
                r = a();
            return e.push(r.makeNodeResolver()), p(t).fapply(e).fail(r.reject), r.promise
        }
    }, h.prototype.nfbind = h.prototype.denodeify = function() {
        var t = Y(arguments);
        return t.unshift(this), p.denodeify.apply(void 0, t)
    }, p.nbind = function(t, n) {
        var e = Y(arguments, 2);
        return function() {
            function r() {
                return t.apply(n, arguments)
            }
            var o = e.concat(Y(arguments)),
                i = a();
            return o.push(i.makeNodeResolver()), p(r).fapply(o).fail(i.reject), i.promise
        }
    }, h.prototype.nbind = function() {
        var t = Y(arguments, 0);
        return t.unshift(this), p.nbind.apply(void 0, t)
    }, p.nmapply = p.npost = function(t, n, e) {
        return p(t).npost(n, e)
    }, h.prototype.nmapply = h.prototype.npost = function(t, n) {
        var e = Y(n || []),
            r = a();
        return e.push(r.makeNodeResolver()), this.dispatch("post", [t, e]).fail(r.reject), r.promise
    }, p.nsend = p.nmcall = p.ninvoke = function(t, n) {
        var e = Y(arguments, 2),
            r = a();
        return e.push(r.makeNodeResolver()), p(t).dispatch("post", [n, e]).fail(r.reject), r.promise
    }, h.prototype.nsend = h.prototype.nmcall = h.prototype.ninvoke = function(t) {
        var n = Y(arguments, 1),
            e = a();
        return n.push(e.makeNodeResolver()), this.dispatch("post", [t, n]).fail(e.reject), e.promise
    }, p.nodeify = q, h.prototype.nodeify = function(t) {
        return t ? void this.then(function(n) {
            W(function() {
                t(null, n)
            })
        }, function(n) {
            W(function() {
                t(n)
            })
        }) : this
    };
    var ln = s();
    return p
});
(function(t, e) {
    if ("function" == typeof define && define.amd) define("backbone", ["underscore", "jquery", "exports"], function(i, n, s) {
        t.Backbone = e(t, s, i, n)
    });
    else if ("undefined" != typeof exports) {
        var i = require("underscore");
        e(t, exports, i)
    } else t.Backbone = e(t, {}, t._, t.jQuery || t.Zepto || t.ender || t.$)
})(this, function(t, e, i, n) {
    {
        var s = t.Backbone,
            r = [],
            a = (r.push, r.slice);
        r.splice
    }
    e.VERSION = "1.1.2", e.$ = n, e.noConflict = function() {
        return t.Backbone = s, this
    }, e.emulateHTTP = !1, e.emulateJSON = !1;
    var o = e.Events = {
        on: function(t, e, i) {
            if (!u(this, "on", t, [e, i]) || !e) return this;
            this._events || (this._events = {});
            var n = this._events[t] || (this._events[t] = []);
            return n.push({
                callback: e,
                context: i,
                ctx: i || this
            }), this
        },
        once: function(t, e, n) {
            if (!u(this, "once", t, [e, n]) || !e) return this;
            var s = this,
                r = i.once(function() {
                    s.off(t, r), e.apply(this, arguments)
                });
            return r._callback = e, this.on(t, r, n)
        },
        off: function(t, e, n) {
            var s, r, a, o, h, c, l, d;
            if (!this._events || !u(this, "off", t, [e, n])) return this;
            if (!t && !e && !n) return this._events = void 0, this;
            for (o = t ? [t] : i.keys(this._events), h = 0, c = o.length; c > h; h++) if (t = o[h], a = this._events[t]) {
                if (this._events[t] = s = [], e || n) for (l = 0, d = a.length; d > l; l++) r = a[l], (e && e !== r.callback && e !== r.callback._callback || n && n !== r.context) && s.push(r);
                s.length || delete this._events[t]
            }
            return this
        },
        trigger: function(t) {
            if (!this._events) return this;
            var e = a.call(arguments, 1);
            if (!u(this, "trigger", t, e)) return this;
            var i = this._events[t],
                n = this._events.all;
            return i && c(i, e), n && c(n, arguments), this
        },
        stopListening: function(t, e, n) {
            var s = this._listeningTo;
            if (!s) return this;
            var r = !e && !n;
            n || "object" != typeof e || (n = this), t && ((s = {})[t._listenId] = t);
            for (var a in s) t = s[a], t.off(e, n, this), (r || i.isEmpty(t._events)) && delete this._listeningTo[a];
            return this
        }
    }, h = /\s+/,
        u = function(t, e, i, n) {
            if (!i) return !0;
            if ("object" == typeof i) {
                for (var s in i) t[e].apply(t, [s, i[s]].concat(n));
                return !1
            }
            if (h.test(i)) {
                for (var r = i.split(h), a = 0, o = r.length; o > a; a++) t[e].apply(t, [r[a]].concat(n));
                return !1
            }
            return !0
        }, c = function(t, e) {
            var i, n = -1,
                s = t.length,
                r = e[0],
                a = e[1],
                o = e[2];
            switch (e.length) {
                case 0:
                    for (; ++n < s;)(i = t[n]).callback.call(i.ctx);
                    return;
                case 1:
                    for (; ++n < s;)(i = t[n]).callback.call(i.ctx, r);
                    return;
                case 2:
                    for (; ++n < s;)(i = t[n]).callback.call(i.ctx, r, a);
                    return;
                case 3:
                    for (; ++n < s;)(i = t[n]).callback.call(i.ctx, r, a, o);
                    return;
                default:
                    for (; ++n < s;)(i = t[n]).callback.apply(i.ctx, e);
                    return
            }
        }, l = {
            listenTo: "on",
            listenToOnce: "once"
        };
    i.each(l, function(t, e) {
        o[e] = function(e, n, s) {
            var r = this._listeningTo || (this._listeningTo = {}),
                a = e._listenId || (e._listenId = i.uniqueId("l"));
            return r[a] = e, s || "object" != typeof n || (s = this), e[t](n, s, this), this
        }
    }), o.bind = o.on, o.unbind = o.off, i.extend(e, o);
    var d = e.Model = function(t, e) {
        var n = t || {};
        e || (e = {}), this.cid = i.uniqueId("c"), this.attributes = {}, e.collection && (this.collection = e.collection), e.parse && (n = this.parse(n, e) || {}), n = i.defaults({}, n, i.result(this, "defaults")), this.set(n, e), this.changed = {}, this.initialize.apply(this, arguments)
    };
    i.extend(d.prototype, o, {
        changed: null,
        validationError: null,
        idAttribute: "id",
        initialize: function() {},
        toJSON: function() {
            return i.clone(this.attributes)
        },
        sync: function() {
            return e.sync.apply(this, arguments)
        },
        get: function(t) {
            return this.attributes[t]
        },
        escape: function(t) {
            return i.escape(this.get(t))
        },
        has: function(t) {
            return null != this.get(t)
        },
        set: function(t, e, n) {
            var s, r, a, o, h, u, c, l;
            if (null == t) return this;
            if ("object" == typeof t ? (r = t, n = e) : (r = {})[t] = e, n || (n = {}), !this._validate(r, n)) return !1;
            a = n.unset, h = n.silent, o = [], u = this._changing, this._changing = !0, u || (this._previousAttributes = i.clone(this.attributes), this.changed = {}), l = this.attributes, c = this._previousAttributes, this.idAttribute in r && (this.id = r[this.idAttribute]);
            for (s in r) e = r[s], i.isEqual(l[s], e) || o.push(s), i.isEqual(c[s], e) ? delete this.changed[s] : this.changed[s] = e, a ? delete l[s] : l[s] = e;
            if (!h) {
                o.length && (this._pending = n);
                for (var d = 0, f = o.length; f > d; d++) this.trigger("change:" + o[d], this, l[o[d]], n)
            }
            if (u) return this;
            if (!h) for (; this._pending;) n = this._pending, this._pending = !1, this.trigger("change", this, n);
            return this._pending = !1, this._changing = !1, this
        },
        unset: function(t, e) {
            return this.set(t, void 0, i.extend({}, e, {
                unset: !0
            }))
        },
        clear: function(t) {
            var e = {};
            for (var n in this.attributes) e[n] = void 0;
            return this.set(e, i.extend({}, t, {
                unset: !0
            }))
        },
        hasChanged: function(t) {
            return null == t ? !i.isEmpty(this.changed) : i.has(this.changed, t)
        },
        changedAttributes: function(t) {
            if (!t) return this.hasChanged() ? i.clone(this.changed) : !1;
            var e, n = !1,
                s = this._changing ? this._previousAttributes : this.attributes;
            for (var r in t) i.isEqual(s[r], e = t[r]) || ((n || (n = {}))[r] = e);
            return n
        },
        previous: function(t) {
            return null != t && this._previousAttributes ? this._previousAttributes[t] : null
        },
        previousAttributes: function() {
            return i.clone(this._previousAttributes)
        },
        fetch: function(t) {
            t = t ? i.clone(t) : {}, void 0 === t.parse && (t.parse = !0);
            var e = this,
                n = t.success;
            return t.success = function(i) {
                return e.set(e.parse(i, t), t) ? (n && n(e, i, t), void e.trigger("sync", e, i, t)) : !1
            }, U(this, t), this.sync("read", this, t)
        },
        save: function(t, e, n) {
            var s, r, a, o = this.attributes;
            if (null == t || "object" == typeof t ? (s = t, n = e) : (s = {})[t] = e, n = i.extend({
                validate: !0
            }, n), s && !n.wait) {
                if (!this.set(s, n)) return !1
            } else if (!this._validate(s, n)) return !1;
            s && n.wait && (this.attributes = i.extend({}, o, s)), void 0 === n.parse && (n.parse = !0);
            var h = this,
                u = n.success;
            return n.success = function(t) {
                h.attributes = o;
                var e = h.parse(t, n);
                return n.wait && (e = i.extend(s || {}, e)), i.isObject(e) && !h.set(e, n) ? !1 : (u && u(h, t, n), void h.trigger("sync", h, t, n))
            }, U(this, n), r = this.isNew() ? "create" : n.patch ? "patch" : "update", "patch" === r && (n.attrs = s), a = this.sync(r, this, n), s && n.wait && (this.attributes = o), a
        },
        destroy: function(t) {
            t = t ? i.clone(t) : {};
            var e = this,
                n = t.success,
                s = function() {
                    e.trigger("destroy", e, e.collection, t)
                };
            if (t.success = function(i) {
                (t.wait || e.isNew()) && s(), n && n(e, i, t), e.isNew() || e.trigger("sync", e, i, t)
            }, this.isNew()) return t.success(), !1;
            U(this, t);
            var r = this.sync("delete", this, t);
            return t.wait || s(), r
        },
        url: function() {
            var t = i.result(this, "urlRoot") || i.result(this.collection, "url") || j();
            return this.isNew() ? t : t.replace(/([^\/])$/, "$1/") + encodeURIComponent(this.id)
        },
        parse: function(t) {
            return t
        },
        clone: function() {
            return new this.constructor(this.attributes)
        },
        isNew: function() {
            return !this.has(this.idAttribute)
        },
        isValid: function(t) {
            return this._validate({}, i.extend(t || {}, {
                validate: !0
            }))
        },
        _validate: function(t, e) {
            if (!e.validate || !this.validate) return !0;
            t = i.extend({}, this.attributes, t);
            var n = this.validationError = this.validate(t, e) || null;
            return n ? (this.trigger("invalid", this, n, i.extend(e, {
                validationError: n
            })), !1) : !0
        }
    });
    var f = ["keys", "values", "pairs", "invert", "pick", "omit"];
    i.each(f, function(t) {
        d.prototype[t] = function() {
            var e = a.call(arguments);
            return e.unshift(this.attributes), i[t].apply(i, e)
        }
    });
    var p = e.Collection = function(t, e) {
        e || (e = {}), e.model && (this.model = e.model), void 0 !== e.comparator && (this.comparator = e.comparator), this._reset(), this.initialize.apply(this, arguments), t && this.reset(t, i.extend({
            silent: !0
        }, e))
    }, g = {
        add: !0,
        remove: !0,
        merge: !0
    }, v = {
        add: !0,
        remove: !1
    };
    i.extend(p.prototype, o, {
        model: d,
        initialize: function() {},
        toJSON: function(t) {
            return this.map(function(e) {
                return e.toJSON(t)
            })
        },
        sync: function() {
            return e.sync.apply(this, arguments)
        },
        add: function(t, e) {
            return this.set(t, i.extend({
                merge: !1
            }, e, v))
        },
        remove: function(t, e) {
            var n = !i.isArray(t);
            t = n ? [t] : i.clone(t), e || (e = {});
            var s, r, a, o;
            for (s = 0, r = t.length; r > s; s++) o = t[s] = this.get(t[s]), o && (delete this._byId[o.id], delete this._byId[o.cid], a = this.indexOf(o), this.models.splice(a, 1), this.length--, e.silent || (e.index = a, o.trigger("remove", o, this, e)), this._removeReference(o, e));
            return n ? t[0] : t
        },
        set: function(t, e) {
            e = i.defaults({}, e, g), e.parse && (t = this.parse(t, e));
            var n = !i.isArray(t);
            t = n ? t ? [t] : [] : i.clone(t);
            var s, r, a, o, h, u, c, l = e.at,
                f = this.model,
                p = this.comparator && null == l && e.sort !== !1,
                v = i.isString(this.comparator) ? this.comparator : null,
                m = [],
                y = [],
                _ = {}, b = e.add,
                w = e.merge,
                x = e.remove,
                E = !p && b && x ? [] : !1;
            for (s = 0, r = t.length; r > s; s++) {
                if (h = t[s] || {}, a = h instanceof d ? o = h : h[f.prototype.idAttribute || "id"], u = this.get(a)) x && (_[u.cid] = !0), w && (h = h === o ? o.attributes : h, e.parse && (h = u.parse(h, e)), u.set(h, e), p && !c && u.hasChanged(v) && (c = !0)), t[s] = u;
                else if (b) {
                    if (o = t[s] = this._prepareModel(h, e), !o) continue;
                    m.push(o), this._addReference(o, e)
                }
                o = u || o, !E || !o.isNew() && _[o.id] || E.push(o), _[o.id] = !0
            }
            if (x) {
                for (s = 0, r = this.length; r > s; ++s) _[(o = this.models[s]).cid] || y.push(o);
                y.length && this.remove(y, e)
            }
            if (m.length || E && E.length) if (p && (c = !0), this.length += m.length, null != l) for (s = 0, r = m.length; r > s; s++) this.models.splice(l + s, 0, m[s]);
            else {
                E && (this.models.length = 0);
                var k = E || m;
                for (s = 0, r = k.length; r > s; s++) this.models.push(k[s])
            }
            if (c && this.sort({
                silent: !0
            }), !e.silent) {
                for (s = 0, r = m.length; r > s; s++)(o = m[s]).trigger("add", o, this, e);
                (c || E && E.length) && this.trigger("sort", this, e)
            }
            return n ? t[0] : t
        },
        reset: function(t, e) {
            e || (e = {});
            for (var n = 0, s = this.models.length; s > n; n++) this._removeReference(this.models[n], e);
            return e.previousModels = this.models, this._reset(), t = this.add(t, i.extend({
                silent: !0
            }, e)), e.silent || this.trigger("reset", this, e), t
        },
        push: function(t, e) {
            return this.add(t, i.extend({
                at: this.length
            }, e))
        },
        pop: function(t) {
            var e = this.at(this.length - 1);
            return this.remove(e, t), e
        },
        unshift: function(t, e) {
            return this.add(t, i.extend({
                at: 0
            }, e))
        },
        shift: function(t) {
            var e = this.at(0);
            return this.remove(e, t), e
        },
        slice: function() {
            return a.apply(this.models, arguments)
        },
        get: function(t) {
            return null == t ? void 0 : this._byId[t] || this._byId[t.id] || this._byId[t.cid]
        },
        at: function(t) {
            return this.models[t]
        },
        where: function(t, e) {
            return i.isEmpty(t) ? e ? void 0 : [] : this[e ? "find" : "filter"](function(e) {
                for (var i in t) if (t[i] !== e.get(i)) return !1;
                return !0
            })
        },
        findWhere: function(t) {
            return this.where(t, !0)
        },
        sort: function(t) {
            if (!this.comparator) throw new Error("Cannot sort a set without a comparator");
            return t || (t = {}), i.isString(this.comparator) || 1 === this.comparator.length ? this.models = this.sortBy(this.comparator, this) : this.models.sort(i.bind(this.comparator, this)), t.silent || this.trigger("sort", this, t), this
        },
        pluck: function(t) {
            return i.invoke(this.models, "get", t)
        },
        fetch: function(t) {
            t = t ? i.clone(t) : {}, void 0 === t.parse && (t.parse = !0);
            var e = t.success,
                n = this;
            return t.success = function(i) {
                var s = t.reset ? "reset" : "set";
                n[s](i, t), e && e(n, i, t), n.trigger("sync", n, i, t)
            }, U(this, t), this.sync("read", this, t)
        },
        create: function(t, e) {
            if (e = e ? i.clone(e) : {}, !(t = this._prepareModel(t, e))) return !1;
            e.wait || this.add(t, e);
            var n = this,
                s = e.success;
            return e.success = function(t, i) {
                e.wait && n.add(t, e), s && s(t, i, e)
            }, t.save(null, e), t
        },
        parse: function(t) {
            return t
        },
        clone: function() {
            return new this.constructor(this.models)
        },
        _reset: function() {
            this.length = 0, this.models = [], this._byId = {}
        },
        _prepareModel: function(t, e) {
            if (t instanceof d) return t;
            e = e ? i.clone(e) : {}, e.collection = this;
            var n = new this.model(t, e);
            return n.validationError ? (this.trigger("invalid", this, n.validationError, e), !1) : n
        },
        _addReference: function(t) {
            this._byId[t.cid] = t, null != t.id && (this._byId[t.id] = t), t.collection || (t.collection = this), t.on("all", this._onModelEvent, this)
        },
        _removeReference: function(t) {
            this === t.collection && delete t.collection, t.off("all", this._onModelEvent, this)
        },
        _onModelEvent: function(t, e, i, n) {
            ("add" !== t && "remove" !== t || i === this) && ("destroy" === t && this.remove(e, n), e && t === "change:" + e.idAttribute && (delete this._byId[e.previous(e.idAttribute)], null != e.id && (this._byId[e.id] = e)), this.trigger.apply(this, arguments))
        }
    });
    var m = ["forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "difference", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain", "sample"];
    i.each(m, function(t) {
        p.prototype[t] = function() {
            var e = a.call(arguments);
            return e.unshift(this.models), i[t].apply(i, e)
        }
    });
    var y = ["groupBy", "countBy", "sortBy", "indexBy"];
    i.each(y, function(t) {
        p.prototype[t] = function(e, n) {
            var s = i.isFunction(e) ? e : function(t) {
                    return t.get(e)
                };
            return i[t](this.models, s, n)
        }
    });
    var _ = e.View = function(t) {
        this.cid = i.uniqueId("view"), t || (t = {}), i.extend(this, i.pick(t, w)), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents()
    }, b = /^(\S+)\s*(.*)$/,
        w = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
    i.extend(_.prototype, o, {
        tagName: "div",
        $: function(t) {
            return this.$el.find(t)
        },
        initialize: function() {},
        render: function() {
            return this
        },
        remove: function() {
            return this.$el.remove(), this.stopListening(), this
        },
        setElement: function(t, i) {
            return this.$el && this.undelegateEvents(), this.$el = t instanceof e.$ ? t : e.$(t), this.el = this.$el[0], i !== !1 && this.delegateEvents(), this
        },
        delegateEvents: function(t) {
            if (!t && !(t = i.result(this, "events"))) return this;
            this.undelegateEvents();
            for (var e in t) {
                var n = t[e];
                if (i.isFunction(n) || (n = this[t[e]]), n) {
                    var s = e.match(b),
                        r = s[1],
                        a = s[2];
                    n = i.bind(n, this), r += ".delegateEvents" + this.cid, "" === a ? this.$el.on(r, n) : this.$el.on(r, a, n)
                }
            }
            return this
        },
        undelegateEvents: function() {
            return this.$el.off(".delegateEvents" + this.cid), this
        },
        _ensureElement: function() {
            if (this.el) this.setElement(i.result(this, "el"), !1);
            else {
                var t = i.extend({}, i.result(this, "attributes"));
                this.id && (t.id = i.result(this, "id")), this.className && (t["class"] = i.result(this, "className"));
                var n = e.$("<" + i.result(this, "tagName") + ">").attr(t);
                this.setElement(n, !1)
            }
        }
    }), e.sync = function(t, n, s) {
        var r = E[t];
        i.defaults(s || (s = {}), {
            emulateHTTP: e.emulateHTTP,
            emulateJSON: e.emulateJSON
        });
        var a = {
            type: r,
            dataType: "json"
        };
        if (s.url || (a.url = i.result(n, "url") || j()), null != s.data || !n || "create" !== t && "update" !== t && "patch" !== t || (a.contentType = "application/json", a.data = JSON.stringify(s.attrs || n.toJSON(s))), s.emulateJSON && (a.contentType = "application/x-www-form-urlencoded", a.data = a.data ? {
            model: a.data
        } : {}), s.emulateHTTP && ("PUT" === r || "DELETE" === r || "PATCH" === r)) {
            a.type = "POST", s.emulateJSON && (a.data._method = r);
            var o = s.beforeSend;
            s.beforeSend = function(t) {
                return t.setRequestHeader("X-HTTP-Method-Override", r), o ? o.apply(this, arguments) : void 0
            }
        }
        "GET" === a.type || s.emulateJSON || (a.processData = !1), "PATCH" === a.type && x && (a.xhr = function() {
            return new ActiveXObject("Microsoft.XMLHTTP")
        });
        var h = s.xhr = e.ajax(i.extend(a, s));
        return n.trigger("request", n, h, s), h
    };
    var x = !("undefined" == typeof window || !window.ActiveXObject || window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent),
        E = {
            create: "POST",
            update: "PUT",
            patch: "PATCH",
            "delete": "DELETE",
            read: "GET"
        };
    e.ajax = function() {
        return e.$.ajax.apply(e.$, arguments)
    };
    var k = e.Router = function(t) {
        t || (t = {}), t.routes && (this.routes = t.routes), this._bindRoutes(), this.initialize.apply(this, arguments)
    }, T = /\((.*?)\)/g,
        $ = /(\(\?)?:\w+/g,
        S = /\*\w+/g,
        H = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    i.extend(k.prototype, o, {
        initialize: function() {},
        route: function(t, n, s) {
            i.isRegExp(t) || (t = this._routeToRegExp(t)), i.isFunction(n) && (s = n, n = ""), s || (s = this[n]);
            var r = this;
            return e.history.route(t, function(i) {
                var a = r._extractParameters(t, i);
                r.execute(s, a), r.trigger.apply(r, ["route:" + n].concat(a)), r.trigger("route", n, a), e.history.trigger("route", r, n, a)
            }), this
        },
        execute: function(t, e) {
            t && t.apply(this, e)
        },
        navigate: function(t, i) {
            return e.history.navigate(t, i), this
        },
        _bindRoutes: function() {
            if (this.routes) {
                this.routes = i.result(this, "routes");
                for (var t, e = i.keys(this.routes); null != (t = e.pop());) this.route(t, this.routes[t])
            }
        },
        _routeToRegExp: function(t) {
            return t = t.replace(H, "\\$&").replace(T, "(?:$1)?").replace($, function(t, e) {
                return e ? t : "([^/?]+)"
            }).replace(S, "([^?]*?)"), new RegExp("^" + t + "(?:\\?([\\s\\S]*))?$")
        },
        _extractParameters: function(t, e) {
            var n = t.exec(e).slice(1);
            return i.map(n, function(t, e) {
                return e === n.length - 1 ? t || null : t ? decodeURIComponent(t) : null
            })
        }
    });
    var A = e.History = function() {
        this.handlers = [], i.bindAll(this, "checkUrl"), "undefined" != typeof window && (this.location = window.location, this.history = window.history)
    }, I = /^[#\/]|\s+$/g,
        N = /^\/+|\/+$/g,
        R = /msie [\w.]+/,
        O = /\/$/,
        P = /#.*$/;
    A.started = !1, i.extend(A.prototype, o, {
        interval: 50,
        atRoot: function() {
            return this.location.pathname.replace(/[^\/]$/, "$&/") === this.root
        },
        getHash: function(t) {
            var e = (t || this).location.href.match(/#(.*)$/);
            return e ? e[1] : ""
        },
        getFragment: function(t, e) {
            if (null == t) if (this._hasPushState || !this._wantsHashChange || e) {
                t = decodeURI(this.location.pathname + this.location.search);
                var i = this.root.replace(O, "");
                t.indexOf(i) || (t = t.slice(i.length))
            } else t = this.getHash();
            return t.replace(I, "")
        },
        start: function(t) {
            if (A.started) throw new Error("Backbone.history has already been started");
            A.started = !0, this.options = i.extend({
                root: "/"
            }, this.options, t), this.root = this.options.root, this._wantsHashChange = this.options.hashChange !== !1, this._wantsPushState = !! this.options.pushState, this._hasPushState = !! (this.options.pushState && this.history && this.history.pushState);
            var n = this.getFragment(),
                s = document.documentMode,
                r = R.exec(navigator.userAgent.toLowerCase()) && (!s || 7 >= s);
            if (this.root = ("/" + this.root + "/").replace(N, "/"), r && this._wantsHashChange) {
                var a = e.$('<iframe src="javascript:0" tabindex="-1">');
                this.iframe = a.hide().appendTo("body")[0].contentWindow, this.navigate(n)
            }
            this._hasPushState ? e.$(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !r ? e.$(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = n;
            var o = this.location;
            if (this._wantsHashChange && this._wantsPushState) {
                if (!this._hasPushState && !this.atRoot()) return this.fragment = this.getFragment(null, !0), this.location.replace(this.root + "#" + this.fragment), !0;
                this._hasPushState && this.atRoot() && o.hash && (this.fragment = this.getHash().replace(I, ""), this.history.replaceState({}, document.title, this.root + this.fragment))
            }
            return this.options.silent ? void 0 : this.loadUrl()
        },
        stop: function() {
            e.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl), this._checkUrlInterval && clearInterval(this._checkUrlInterval), A.started = !1
        },
        route: function(t, e) {
            this.handlers.unshift({
                route: t,
                callback: e
            })
        },
        checkUrl: function() {
            var t = this.getFragment();
            return t === this.fragment && this.iframe && (t = this.getFragment(this.getHash(this.iframe))), t === this.fragment ? !1 : (this.iframe && this.navigate(t), void this.loadUrl())
        },
        loadUrl: function(t) {
            return t = this.fragment = this.getFragment(t), i.any(this.handlers, function(e) {
                return e.route.test(t) ? (e.callback(t), !0) : void 0
            })
        },
        navigate: function(t, e) {
            if (!A.started) return !1;
            e && e !== !0 || (e = {
                trigger: !! e
            });
            var i = this.root + (t = this.getFragment(t || ""));
            if (t = t.replace(P, ""), this.fragment !== t) {
                if (this.fragment = t, "" === t && "/" !== i && (i = i.slice(0, - 1)), this._hasPushState) this.history[e.replace ? "replaceState" : "pushState"]({}, document.title, i);
                else {
                    if (!this._wantsHashChange) return this.location.assign(i);
                    this._updateHash(this.location, t, e.replace), this.iframe && t !== this.getFragment(this.getHash(this.iframe)) && (e.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, t, e.replace))
                }
                return e.trigger ? this.loadUrl(t) : void 0
            }
        },
        _updateHash: function(t, e, i) {
            if (i) {
                var n = t.href.replace(/(javascript:|#).*$/, "");
                t.replace(n + "#" + e)
            } else t.hash = "#" + e
        }
    }), e.history = new A;
    var C = function(t, e) {
        var n, s = this;
        n = t && i.has(t, "constructor") ? t.constructor : function() {
            return s.apply(this, arguments)
        }, i.extend(n, s, e);
        var r = function() {
            this.constructor = n
        };
        return r.prototype = s.prototype, n.prototype = new r, t && i.extend(n.prototype, t), n.__super__ = s.prototype, n
    };
    d.extend = p.extend = k.extend = _.extend = A.extend = C;
    var j = function() {
        throw new Error('A "url" property or function must be specified')
    }, U = function(t, e) {
        var i = e.error;
        e.error = function(n) {
            i && i(t, n, e), t.trigger("error", t, n, e)
        }
    };
    return e
});
(function(t) {
    var e = function(e, i, n, s) {
        window.space = t(e, i, n, s)
    };
    "function" == typeof define && define.amd ? define("space", ["jquery", "underscore", "q", "backbone"], e) : e($, _, Q, Backbone)
})(function(t, e, i, n) {
    var s = {};
    return function(t) {
        var i = {
            listenTo: function() {
                return this._bindEvents("listenTo", arguments), this
            },
            listenToOnce: function() {
                return this._bindEvents("listenToOnce", arguments), this
            },
            _bindEvents: function(t, i) {
                var s = this,
                    r = i[0],
                    o = i[1],
                    a = i[2];
                e.isObject(o) ? e.each(o, function(e, i) {
                    s[t](r, i, e)
                }) : -1 !== o.indexOf(",") ? e.each(o.split(","), function(e) {
                    e = e.replace(/^\s+|\s+$/g, ""), e && s[t](r, e, a)
                }) : n.Events[t].apply(this, i)
            }
        };
        t.Events = i
    }(s),
    function(t) {
        var n = function(t) {
            this._name = t || e.uniqueId("flow"), this._isAborted = !1, this._isRunning = !1, this.promise = i.resolve(), this._children = [], this._resolvedValue = null, this._isSavedValue = !1, this._context = null, this._parent = null, this._handlers = {}
        };
        e.extend(n.prototype, {
            next: function(t, e, n) {
                var s, r, o = this,
                    a = function(e) {
                        var i;
                        return o.isAborted() ? void 0 : (t = o._bind(t), o._isRunning = !0, i = t(e), o._isRunning = !1, o.trigger("next", e), o.isFlow(i) ? i.getPromise() : i)
                    };
                return this.isAborted() ? this : (this.isPending() ? this.promise = this.promise.then(a, e, n).fail(function(t) {
                    return o._stop(t)
                }) : this.promise.isRejected() || (r = this._getResolvedValue(), s = a(r), i.isPromise(s) ? (this.promise = s, this.promise.isRejected() ? this._stop(this._getRejectedValue()) : this.promise.fail(function(t) {
                    return o._stop(t)
                })) : this._setResolvedValue(s)), this)
            },
            isAborted: function() {
                return this._isAborted || this.promise.isRejected()
            },
            abort: function(t) {
                if (!this._isAborted) {
                    this.promise.isRejected() || (this.promise = i.reject()), this._parent && this._parent.removeChildFlow(this);
                    for (var e = 0; e < this._children.length; e++) this._children[e].abort(t);
                    this._isAborted = !0, this._children = null, t || this.trigger("abort")
                }
            },
            isPending: function(t) {
                return t && this.isChildFlowPending() ? !0 : this.isAborted() ? !1 : this.promise.isPending()
            },
            isChildFlowPending: function(t) {
                for (var e = 0, i = this._children.length; i > e; e++) if (t && this._children[e].getName() === t || !t && this._children[e].isPending()) return this._children[e].isPending();
                return !1
            },
            getChildFlow: function(t) {
                for (var e = 0, i = this._children.length; i > e; e++) if (this._children[e].getName() === t) return this._children[e];
                return null
            },
            isIdle: function() {
                return !this.isAborted() && !this.isPending() && !this._isRunning
            },
            fork: function(t) {
                var i, s, r = this._name + "_";
                if (this._parent) throw new Error("부모 흐름이 있는 흐름은 fork를 할 수 없습니다");
                return this.isAborted() ? this : (t && (s = this.getChildFlow(t), s && (s.abort(!0), s = null)), this._removeIdleChildFlows(), i = new n(t || e.uniqueId(r)), this._context && i.setContext(this._context), i.setParent(this), this._children.push(i), i)
            },
            forkWith: function(t, e) {
                var n = this.fork(e);
                return n.promise = t.fail(function(t) {
                    return n.trigger("stop", t), i.reject(t)
                }), n
            },
            getName: function() {
                return this._name
            },
            _getResolvedValue: function() {
                var t;
                if (!this.promise.isPending() && !this.isAborted()) return this._isSavedValue ? (t = this._resolvedValue, this._resetResolvedValue(), t) : this.promise.inspect().value
            },
            _getRejectedValue: function() {
                return this.promise.isRejected() ? this.promise.inspect().reason : null
            },
            _resetResolvedValue: function() {
                this._isSavedValue = !1, this._resolvedValue = null
            },
            _setResolvedValue: function(t) {
                this._isSavedValue = !0, this._resolvedValue = t
            },
            _bind: function(t) {
                return null !== this._context ? e.bind(t, this._context) : t
            },
            removeChildFlow: function(t) {
                for (var e = 0, i = this._children.length; i > e; e++) if (this._children[e] === t) return void this._children.splice(e, 1)
            },
            _removeIdleChildFlows: function() {
                for (var t = 0; t < this._children.length; t++) this._children[t].isIdle() && (this._children[t].abort(!0), this._children.splice(t--, 1))
            },
            _stop: function(t) {
                return this._isAborted ? void 0 : (this._isAborted = !0, this.trigger("stop", t), i.reject(t))
            },
            setContext: function(t) {
                return this._context = t, this
            },
            setParent: function(t) {
                this._parent = t
            },
            on: function(t, e) {
                for (var i = this._handlers[t] = this._handlers[t] || [], n = 0, s = i.length; s > n; n++) if (i[n] === e) return;
                i.push(e)
            },
            off: function(t, e) {
                if (this._handlers[t]) {
                    var i = this._handlers[t];
                    if (e) {
                        for (var n = 0, s = i.length; s > n; n++) if (i[n] === e) return void i.splice(n, 1)
                    } else delete this._handlers[t]
                }
            },
            trigger: function() {
                var t, e = arguments[0],
                    i = this._handlers[e],
                    n = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1, arguments.length) : null;
                if (i) for (var s = 0, r = i.length; r > s; s++) if (t = i[s].apply(i[s], n), "undefined" != typeof t) return t
            },
            getPromise: function() {
                var t = this;
                return this.isAborted() ? this.promise : this.promise.then(function() {
                    return t._getResolvedValue()
                }).fail(function() {
                    return i.reject(t._getRejectedValue())
                })
            },
            fin: function(t) {
                return t = this._bind(t), this.promise.isPending() ? this.promise.fin(t) : t(), this
            },
            stopped: function(t) {
                return t = this._bind(t), this.isPending() ? this.on("stop", t) : this.isAborted() && t(this._getRejectedValue()), this
            },
            isFlow: function(t) {
                return t && t instanceof n
            }
        }), t.Flow = n
    }(s),
    function(i) {
        var s = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"],
            r = n.View.extend({
                skipGlobalEvents: !1,
                windowEvents: null,
                documentEvents: null,
                ui: null,
                options: null,
                constructor: function(t) {
                    this._windowEvents = null, this._documentEvents = null, this._delegateEventSplitter = /^([\S,]+)\s*(.*)$/, this._optionSetters = {}, this._isAttachedGlobalEvents = !1, t && e.extend(this, e.pick(t, e.keys(r.prototype))), this.events && (this.events = this._splitEventName(this.events)), this.windowEvents && (this._windowEvents = this.parseEvents(this.windowEvents), this.windowEvents = null), this.documentEvents && (this._documentEvents = this.parseEvents(this.documentEvents), this.documentEvents = null), this.ui && (this._uiOptions = this.ui, this.ui = null), this.options && (this._optionSetters = this._parseOptions(this.options)), this._initialize(t)
                },
                _initialize: function(t) {
                    this.cid = e.uniqueId("view"), t = t || {}, e.extend(this, e.pick(t, s)), this.initialize.call(this, t), this.setOptions(t)
                },
                setElement: function(t, e) {
                    var i = this.$el && this.$el.parent(),
                        s = this.$el;
                    n.View.prototype.setElement.call(this, t, e), i && (this.$el.insertBefore(s), s.remove())
                },
                setOptions: function(t) {
                    var i = this;
                    t = t || {}, e.isEmpty(t) || e.each(t, function(t, e) {
                        "undefined" != typeof i[e] && (i[e] = t), i._optionSetters[e] && i._optionSetters[e](t)
                    })
                },
                parseEvents: function(t) {
                    var i = {};
                    return t = this._splitEventName(t), e.each(t, function(t, n) {
                        var s = n.match(this._delegateEventSplitter),
                            r = s[1],
                            o = s[2];
                        e.isFunction(t) || (t = this[t]), t && (t = e.bind(t, this), i[r] = i[r] || [], i[r].push({
                            selector: o,
                            method: t
                        }))
                    }, this), i
                },
                _parseOptions: function(t) {
                    var i = {}, n = e.bind(function(t, i, s) {
                        return -1 !== i.indexOf(",") ? void e.each(i.split(","), function(e) {
                            n(t, e.replace(/^\s+|\s+$/g, ""), s)
                        }) : (s = "string" == typeof s ? this[s] : s, void(s && (t[i] = e.bind(s, this))))
                    }, this);
                    return e.each(t, function(t, e) {
                        n(i, e, t)
                    }), i
                },
                attachGlobalEvents: function() {
                    var i, n, s = ".delegateEvents" + this.cid;
                    this._isAttachedGlobalEvents || (this._windowEvents && (i = t(window), e.each(this._windowEvents, function(t, e) {
                        for (var n = 0; n < t.length; n++) i.on(e + s, "string" == typeof t[n].method ? this[t[n].method] : t[n].method)
                    }, this)), this._documentEvents && (n = t(document), e.each(this._documentEvents, function(t, e) {
                        for (var i = 0; i < t.length; i++) n.on(e + s, t[i].selector, "string" == typeof t[i].method ? this[t[i].method] : t[i].method)
                    }, this)), this._isAttachedGlobalEvents = !0)
                },
                detachGlobalEvents: function() {
                    var e = ".delegateEvents" + this.cid;
                    this._isAttachedGlobalEvents && (this._windowEvents && t(window).off(e), this._documentEvents && t(document).off(e), this._isAttachedGlobalEvents = !1)
                },
                createUi: function() {
                    this._uiOptions && (this.ui = {}, e.each(this._uiOptions, function(t, e) {
                        this.ui[e] = this.$(t)
                    }, this))
                },
                show: function() {
                    this.$el.show()
                },
                hide: function() {
                    this.$el.hide()
                },
                toggle: function(t) {
                    "undefined" == typeof t && (t = !this.isShown()), t ? this.show() : this.hide()
                },
                isShown: function() {
                    return this.$el.is(":visible")
                },
                _splitEventName: function(t) {
                    var i = {};
                    return e.each(t, function(t, n) {
                        var s, r, o;
                        return -1 !== n.indexOf(",") && (n = n.toString().replace(/\s*,\s*/g, ","), s = n.match(this._delegateEventSplitter), r = s[1].split(","), o = s[2], r.length > 1) ? void e.each(r, function(e) {
                            var n = e + (o ? " " + o : "");
                            i[n] = t
                        }) : void(i[n] = t)
                    }, this), i
                }
            });
        e.extend(r.prototype, i.Events), i.View = r
    }(s),
    function(s) {
        var r = "itemPart:",
            o = s.View.extend({
                name: null,
                template: null,
                model: null,
                parent: null,
                collection: null,
                childParts: null,
                itemPart: null,
                itemPartContainer: null,
                itemFilter: null,
                emptyPart: null,
                modelEvents: null,
                collectionEvents: null,
                el: function() {
                    var t = this.template && this.template.wrap || "<" + e.result(this, "tagName") + ">",
                        i = n.$(t),
                        s = e.extend({}, e.result(this, "attributes"));
                    return this.id && (s.id = e.result(this, "id")), this.className && (s.className = e.result(this, "className")), this.model && this.model.getPrimaryValue() && (s["data-model"] = this.model.getPrimaryValue()), i.attr(s), i
                },
                constructor: function(t) {
                    this._renderedPartCount = 0, this._isRendered = !1, this._partOptions = {}, this._isStarted = !1, this._itemPartMap = {}, this._itemPartList = [], this._totalPartCount = 0, this._isTriggeredRenderAll = !1, this._isAttachedModelEvents = !1, this.isAppendedToParent = !1, this._isDomReady = !1, this._isTriggeredDomReady = !1, this._$replacedContainer = null, this._childPartContainers = null, this._isItemPart = t && t.isItemPart ? !0 : !1, t && e.extend(this, e.pick(t, e.keys(o.prototype))), this.flow = new s.Flow(this.name).setContext(this), this._itemPartContainer = this.itemPartContainer, this.itemPartContainer = null, this._initChildParts(), this._loadView(), s.View.apply(this, arguments), this._isItemPart && this.listenTo(this, "all", function() {
                        var t = arguments[0],
                            e = Array.prototype.slice.call(arguments, 1);
                        e.unshift(r + t), this.parent.trigger.apply(this.parent, e)
                    })
                },
                serializeData: function() {
                    var t = {};
                    return this.model ? t = this.model.toData() : this.collection && (t = {
                        length: this.collection.length,
                        items: this.itemFilter ? e.filter(this.collection.models, this.itemFilter) : this.collection.toData()
                    }), this.extendData && e.extend(t, this.extendData()), t
                },
                addPart: function(t, n, s) {
                    var r = this,
                        o = this.flow.fork();
                    s = s || {};
                    var a = s.options,
                        h = s.listeners,
                        l = s.selector;
                    return this.hasChildPart(t) ? (this.isAvailableChildPart(t) && a && this.childParts[t].setOptions(a), o.next(function() {
                        return !1
                    })) : (a = e.extend(a || {}, {
                        name: t,
                        parent: this
                    }), !e.isEmpty(this._childPartContainers) && this._childPartContainers[t] && (l = this._childPartContainers[t]), this._partOptions[t] = {
                        name: t,
                        selector: l,
                        module: n,
                        isReserved: !1,
                        isDynamic: !0
                    }, o.next(function() {
                        var e, s = n;
                        return "string" == typeof n ? (e = i.defer(), require([n], function(i) {
                            r.childParts[t] = new i(a), e.resolve()
                        }), e.promise) : void(r.childParts[t] = new s(a))
                    }), o.next(function() {
                        h && r.listenTo(r.childParts[t], h)
                    }), (this._isRendered || "string" == typeof n) && (o.next(function() {
                        if (r.isStarted()) {
                            var e = r.childParts[t];
                            if (!e) return i.reject();
                            e.template || (e.el = r._getElementBySelector(l)), e.start()
                        }
                    }), this._partOptions[t].isReserved = !0), o.next(function() {
                        return !0
                    }))
                },
                removePart: function(t) {
                    if ("string" == typeof t && this.childParts[t]) {
                        if (!this._partOptions[t].isDynamic) throw new Error("removePart는 동적으로 추가된 파트에만 할 수 있습니다");
                        this.childParts[t].stop(), this.stopListening(this.childParts[t]), delete this.childParts[t], delete this._partOptions[t]
                    } else e.some(this.childParts, function(e, i) {
                        return e === t ? (this.removePart(i), !0) : void 0
                    }, this)
                },
                route: function(t, i, n) {
                    var s = this;
                    e.isEmpty(this._partOptions) || this.flow.next(function() {
                        e.each(s.childParts, function(e) {
                            e.route(t, i, n)
                        })
                    }), this.onRoute && this.flow.next(function() {
                        return s.onRoute(t, i, n)
                    })
                },
                start: function() {
                    var t = this,
                        i = arguments;
                    return this._isStarted ? this : (this.flow.isAborted() && (this.flow = new s.Flow(this.name).setContext(this)), this.$el || this._ensureElement(), this.flow.next(function() {
                        t._loadChildParts(), t.delegateEvents()
                    }), this.onSetup && this.flow.next(function() {
                        return t.onSetup.apply(t, i)
                    }), this.flow.next(function() {
                        e.isEmpty(t._partOptions) || (t._totalPartCount = e.size(t._partOptions), e.each(t.childParts, function(e) {
                            t.listenTo(e, "renderAll", this._onRenderChildPart), e.start.apply(e, i)
                        }))
                    }), this.flow.next(function() {
                        t.skipGlobalEvents || t.attachGlobalEvents(), t.attachModelEvents()
                    }), this.onStart && this.flow.next(function() {
                        return t.onStart.apply(t, i)
                    }), this._isStarted = !0, this.renderAfterStart(), this)
                },
                render: function(t) {
                    return this._isStarted ? (this.clearItemParts(), this._removeAppendedChildParts(), this.renderAfterStart(t === !0 ? !1 : !0), e.invoke(this.childParts, "render", !0), this) : void 0
                },
                renderAfterStart: function(t) {
                    var e = this,
                        i = !this._isRendered;
                    return this.flow.next(function() {
                        e.template && (e.$el[0].innerHTML = e.template(e.serializeData())), e._getChildPartContainers(), e._renderCollection(), e.createUi(), e._isRendered = !0, e._isDomReady && e._triggerDomReady()
                    }), this.onRender && this.flow.next(function() {
                        return e.onRender()
                    }), i && this.flow.next(function() {
                        e._triggerRenderAll(), e._reserveAppendingChildParts()
                    }), !t && this.parent && this.parent.isRendered() && !this._isItemPart && this.flow.next(function() {
                        e.parent.addNextFlow(function() {
                            e.parent.appendChildPart(e.name)
                        })
                    }), this
                },
                stop: function() {
                    var t = this;
                    return this._isStarted ? (this.flow.abort(), this.detachGlobalEvents(), this.stopListening(), this._$replacedContainer ? (this._$replacedContainer.insertBefore(this.$el), this.$el.detach()) : this.template && this.$el.detach(), this.undelegateEvents(), this._isAttachedModelEvents = !1, this._$replacedContainer = null, this._childPartContainers = null, this._renderedPartCount = 0, this._totalPartCount = 0, this._isRendered = !1, this._isStarted = !1, this._isTriggeredRenderAll = !1, this._isDomReady = !1, this._isTriggeredDomReady = !1, e.isEmpty(this._partOptions) || e.each(this.childParts, function(e, i) {
                        e.stop(), t.stopListening(e), t._partOptions[i].isDynamic && delete t._partOptions[i], delete t.childParts[i]
                    }), this.clearItemParts(), this.onStop && t.onStop(), this) : this
                },
                isStarted: function() {
                    return this._isStarted
                },
                isRendered: function() {
                    return this._isRendered
                },
                isDomReady: function() {
                    return this._isTriggeredDomReady
                },
                hasChildPart: function(t) {
                    return this._partOptions && this._partOptions[t] ? !0 : !1
                },
                isAvailableChildPart: function(t) {
                    return this.hasChildPart(t) && this.childParts[t] && this.childParts[t].isStarted() ? !0 : !1
                },
                addNextFlow: function(t, e, i) {
                    return this.flow.next(t, e, i)
                },
                _getChildPartContainers: function() {
                    var i = this;
                    this._childPartContainers = {}, e.each(this.$("[data-part]"), function(e) {
                        var n = t(e),
                            s = n.data("part");
                        i._childPartContainers[s] = n, n.removeAttr("data-part")
                    })
                },
                domReady: function(t) {
                    this._isDomReady || (this._isDomReady = !0, t && (this.isAppendedToParent = !0), e.isEmpty(this._partOptions) || e.invoke(this.childParts, "domReady"), e.isEmpty(this._itemPartList) || e.invoke(this._itemPartList, "domReady")), this._triggerDomReady()
                },
                _triggerDomReady: function() {
                    this._isDomReady && !this._isTriggeredDomReady && this._isRendered && this.isAppendedToParent && (this._isTriggeredDomReady = !0, this.onDomReady && this.onDomReady(), this.trigger("domReady"))
                },
                _onRenderChildPart: function() {
                    this._renderedPartCount++, this._triggerRenderAll()
                },
                _triggerRenderAll: function() {
                    this._isTriggeredRenderAll || !this._isRendered || !e.isEmpty(this._partOptions) && this._totalPartCount !== this._renderedPartCount || (this._isTriggeredRenderAll = !0, this.trigger("renderAll"), this._triggerDomReady())
                },
                _reserveAppendingChildParts: function() {
                    var t = this;
                    e.isEmpty(this._partOptions) || this.flow.next(function() {
                        e.each(t._partOptions, function(e, i) {
                            e.isDynamic && e.isReserved || t.appendChildPart(i)
                        })
                    })
                },
                _removeAppendedChildParts: function() {
                    var t = this;
                    e.isEmpty(this._partOptions) || e.each(this.childParts, function(e, i) {
                        (!t._partOptions[i].isDynamic || e.template) && e.detachFromParent(), t._partOptions[i].isDynamic && t.removePart(i)
                    })
                },
                detachFromParent: function() {
                    this._$replacedContainer ? (this._$replacedContainer.insertBefore(this.$el), this.$el.detach()) : this.$el.detach(), this._isDomReady = !1, this._isTriggeredDomReady = !1
                },
                appendChildPart: function(t) {
                    var i, n = this,
                        s = this._partOptions[t],
                        r = this.childParts[t];
                    if (r && s) {
                        if (s.isDynamic && !r.template) return void this._appendedChildPart(r);
                        s.selector && (i = this._getElementBySelector(s.selector)), !e.isEmpty(this._childPartContainers) && this._childPartContainers[t] && (i = this._childPartContainers[t]), i && i.length && r.addNextFlow(function() {
                            r.replaceElement(i, t), n._appendedChildPart(r)
                        })
                    }
                },
                replaceElement: function(t, e) {
                    this._$replacedContainer = t, this.$el.attr("data-part-name", e).insertBefore(this._$replacedContainer), this._$replacedContainer.detach()
                },
                _addItemPart: function(t) {
                    var e = t.model && t.model.getPrimaryValue() ? t.model.getPrimaryValue() : t.cid;
                    this._itemPartMap[e] = t, this._itemPartList.push(t), t.start()
                },
                _renderItemPart: function(t) {
                    var e, i;
                    return e = this.itemPart.prototype instanceof s.Part ? this.itemPart : this.itemPart(t), i = new e({
                        model: t,
                        parent: this,
                        isItemPart: !0
                    }), this._addItemPart(i), i
                },
                _renderEmptyPart: function() {
                    var t, e;
                    return t = this.emptyPart.prototype instanceof s.Part ? this.emptyPart : this.emptyPart(), e = new t({
                        parent: this,
                        isItemPart: !0
                    }), this._addItemPart(e), e
                },
                _renderCollection: function() {
                    var t;
                    if (this.itemPartContainer = this._itemPartContainer && "string" == typeof this._itemPartContainer ? this.$(this._itemPartContainer) : this.itemPartContainer || this.$el, (this.itemPart || this.emptyPart) && this.collection) {
                        if (t = this.itemFilter ? e.filter(this.collection.models, this.itemFilter) : this.collection.models, this.itemPart) for (var i = 0, n = t.length; n > i; i++) this._appendItemPart(this._renderItemPart(t[i], i));
                        0 === t.length && this.emptyPart && this._appendItemPart(this._renderEmptyPart())
                    }
                },
                _appendItemPart: function(t, i) {
                    var n, s = t.$el,
                        r = this.itemPartContainer;
                    e.isNumber(i) && -1 !== i ? 0 === i ? r.prepend(s) : (n = r.children().eq(i), n.length ? n.before(s) : r.append(s)) : r.append(s), this._appendedChildPart(t), this.trigger("renderItemPart", t)
                },
                _appendedChildPart: function(t) {
                    t.isAppendedToParent = !0, this._isDomReady && t.domReady()
                },
                addItemPart: function(t, e, i) {
                    var n;
                    return this.itemFilter && !this.itemFilter(t) ? !1 : (n = this._renderItemPart(t), this._appendItemPart(n, i && i.at), n)
                },
                removeItemPart: function(t) {
                    var i = this._itemPartMap[t.getPrimaryValue()];
                    i && (i.stop(), delete this._itemPartMap[t.getPrimaryValue()], this._itemPartList.splice(e.indexOf(this._itemPartList, i), 1))
                },
                clearItemParts: function() {
                    e.invoke(this._itemPartMap, "stop"), this._itemPartMap = {}, this._itemPartList = []
                },
                renderItemParts: function() {
                    this.clearItemParts(), this._renderCollection()
                },
                getItemPart: function(t) {
                    return this._itemPartMap[t.getPrimaryValue()]
                },
                getItemParts: function() {
                    return this._itemPartList
                },
                _loadView: function() {
                    var t = this,
                        n = {};
                    this.itemPart && "string" == typeof this.itemPart && (n.itemPart = this.itemPart), this.emptyPart && "string" == typeof this.emptyPart && (n.emptyPart = this.emptyPart), e.isEmpty(n) || this.flow.next(function() {
                        var s = i.defer();
                        return require(e.values(n), function() {
                            e.each(n, function(e, i) {
                                t[i] = require(e)
                            }), s.resolve()
                        }), s.promise
                    })
                },
                _initChildParts: function() {
                    var t = this,
                        n = {};
                    this.childParts ? (this._partOptions = this._parseModuleOption(this.childParts), this.childParts = {}, e.each(this._partOptions, function(t, e) {
                        "string" == typeof t.module && (n[e] = t.module)
                    }), e.isEmpty(n) || this.flow.next(function() {
                        var s = i.defer();
                        return require(e.values(n), function() {
                            e.each(n, function(e, i) {
                                t._partOptions[i].module = require(e)
                            }), s.resolve()
                        }), s.promise
                    })) : (this.childParts = {}, this._partOptions = {})
                },
                _loadChildParts: function() {
                    var t = this;
                    e.isEmpty(this._partOptions) || e.each(this._partOptions, function(e, i) {
                        var n = e.module;
                        e.isDynamic || (t.childParts[i] = new n({
                            name: i,
                            parent: t
                        }))
                    })
                },
                _parseModuleOption: function(t) {
                    var i = {}, n = ["name", "selector", "module"];
                    return e.each(t, function(t, s) {
                        var r = s.split(" ");
                        r.push(r.splice(1, r.length - 1).join(" ")), r.push(t), i[r[0]] = e.object(n, r)
                    }), i
                },
                attachModelEvents: function() {
                    var t = this;
                    this._isAttachedModelEvents || (this.modelEvents && this.model && e.each(e.result(this, "modelEvents"), function(i, n) {
                        var s = n.split(/\s*,\s*/);
                        e.each(s, function(e) {
                            t.listenTo(t.model, e, "string" == typeof i ? t[i] : i)
                        })
                    }), this.collectionEvents && this.collection && e.each(e.result(this, "collectionEvents"), function(i, n) {
                        var s = n.split(/\s*,\s*/);
                        e.each(s, function(e) {
                            t.listenTo(t.collection, e, "string" == typeof i ? t[i] : i)
                        })
                    }, this))
                },
                _getElementBySelector: function(t) {
                    var i;
                    return i = e.isString(t) ? "*" === t ? this.$el : this.$(t) : t
                },
                showAll: function() {
                    e.invoke(this.childParts, "showAll"), this.show()
                },
                hideAll: function() {
                    this.hide(), e.invoke(this.childParts, "hideAll")
                },
                onSetup: null,
                onStart: null,
                onStop: null,
                onRender: null,
                onRoute: null,
                onDomReady: null,
                extendData: null
            });
        s.Part = o
    }(s),
    function(t) {
        var i = n.Model.extend({
            parent: null,
            virtuals: null,
            constructor: function(i, s) {
                var r;
                this._virtuals = {}, this.parent = s && s.parent ? s.parent : null, n.Model.apply(this, arguments), r = e.keys(this.defaults), e.each(this.defaults, function(i, n) {
                    e.isFunction(i) && !(e.isFunction(this.attributes[n]) || this.attributes[n] instanceof t.Collection || this.attributes[n] instanceof t.Model) && this._addModel(n, this.defaults[n], this.attributes[n])
                }, this), e.each(this.virtuals, function(t, i) {
                    if (e.contains(r, i)) throw new Error("defaults 에서 사용하는 " + i + "을 가상 데이터에서 사용하려 합니다");
                    if (e.isFunction(t) || (t = this[t]), !t) throw new Error(i + " 가상 데이터의 getter가 정의되지 않았습니다");
                    t = e.bind(t, this), this._virtuals[i] = t
                }, this)
            },
            set: function(t, i, s) {
                var r;
                if ("object" == typeof t) r = t, s = i, e.each(r, function(t, e, i) {
                    this._setter(e, t) && delete i[e]
                }, this);
                else if (this._setter(t, i)) return this;
                return n.Model.prototype.set.apply(this, arguments)
            },
            get: function(t) {
                return t && this._virtuals && this._virtuals[t] ? this._virtuals[t]() : n.Model.prototype.get.apply(this, arguments)
            },
            getPrimaryValue: function() {
                return this.get(this.idAttribute) || this.cid
            },
            _setter: function(i, n) {
                var s = this.attributes[i];
                if (this._virtuals && this._virtuals[i]) throw new Error("가상 데이터에서 사용하는 속성은 set을 사용할 수 없습니다");
                return e.isFunction(n) ? (this._addModel(i, n), !0) : e.isObject(s) && n ? (s instanceof t.Model ? s.set(n) : s instanceof t.Collection ? s.add(n) : this.attributes[i] = e.clone(n), !0) : !1
            },
            _addModel: function(t, e, i) {
                this.attributes[t] = new e(i || null, {
                    parent: this
                })
            },
            toJSON: function() {
                var t = {};
                return e.each(this.attributes, function(e, i) {
                    t[i] = e && "undefined" != typeof e.toJSON ? e.toJSON() : this.get(i)
                }, this), t
            },
            toData: function() {
                var i = {};
                return e.each(this.attributes, function(e, n) {
                    e instanceof t.Collection || (i[n] = e && "undefined" != typeof e.toData ? e.toData() : e && "undefined" != typeof e.toJSON ? e.toJSON() : this.get(n))
                }, this), e.each(this._virtuals, function(t, e) {
                    i[e] = t()
                }), i
            }
        });
        e.extend(i.prototype, t.Events), t.Model = i
    }(s),
    function(t) {
        var s = n.Collection.extend({
            parent: null,
            constructor: function(t, e) {
                this.parent = e && e.parent ? e.parent : null, n.Collection.apply(this, arguments)
            },
            createAndWait: function(t, n) {
                return n = n ? e.clone(n) : {}, (t = this._prepareModel(t, n)) ? t.save(null, n) : i.reject("Can't create a model")
            },
            toData: function() {
                return this.map(function(t) {
                    return t.toData()
                })
            }
        });
        e.extend(s.prototype, t.Events), t.Collection = s
    }(s),
    function(s) {
        var r = "(/)",
            o = /\(\/\)$/,
            a = null,
            h = {}, l = {
                name: null,
                args: null,
                url: null,
                isSameUrl: !1,
                router: null,
                params: {}
            }, u = function(t) {
                var e = /^https?:\/\/([a-z0-9._-]+)(\:(\d+))?/i,
                    i = "",
                    n = t,
                    s = "";
                return e.test(t) && (i = RegExp.$1, s = RegExp.$3, n = t.replace(e, "")), {
                    host: i,
                    port: s,
                    path: n,
                    isSameHost: !i || location.host === i
                }
            };
        n.history.on("route", function(t, i, n) {
            var s, r = d.getPath(),
                o = null;
            l.name = i, l.args = n, l.isSameUrl = null === l.url || l.url === r, l.url = r, l.router = t, - 1 !== l.url.indexOf("?") && (o = {}, s = e.rest(l.url.split("?")).join("?"), e.each(s.split("&"), function(t) {
                var i = t.split("="),
                    n = e.first(i),
                    s = e.rest(i).join("=");
                o[n] = s
            }), h = e.defaults(o, h || {})), l.params = h, h = {}
        });
        var d = n.Router.extend({
            routes: null,
            resolvers: null,
            staticPath: null,
            staticModules: null,
            isInterceptAnchorEvent: !0,
            onRoute: null,
            errorResolverName: "",
            constructor: function(t) {
                var s, h, l = this;
                if (t = t || {}, s = this.routes || t.routes, e.extend(this, e.pick(t, e.keys(d.prototype))), this.promise = i.resolve(), this._isStarted = !1, this._currentResolver = null, this._resolvers = {}, this._staticModules = [], this._routeInfo = {
                    name: null,
                    args: null,
                    isSameUrl: null,
                    url: null
                }, e.isArray(this.routes)) {
                    for (var u = s.length - 1; u >= 0; u--) this.route(e.isRegExp(s[u].route) ? s[u].route : s[u].route + r, s[u].resolverName);
                    this.routes = t.routes = null
                } else h = {}, e.each(this.routes, function(t, i) {
                    e.isString(i) && !o.test(i) && (i += r), h[i] = t
                }), this.routes = h;
                n.Router.apply(this, arguments), this.resolvers && (e.each(this.resolvers, function(t, e) {
                    l.addResolver(e, t)
                }), this.on("route", e.bind(this._onRoute, this))), a = this
            },
            _onRoute: function(t, i, n) {
                var s, r, o = this,
                    a = this._resolvers[t],
                    h = this._currentResolver,
                    l = d.getPath();
                return this._routeInfo.name = t, this._routeInfo.args = i, this._routeInfo.isSameUrl = null === this._routeInfo.url || this._routeInfo.url === l, this._routeInfo.url = l, r = this._routeInfo.isSameUrl && h === a, logger.trace("onRoute", this._routeInfo), a ? (s = d._getBeforeUnloadPromise(), void(s = s.then(function() {
                    o._currentResolver = a, a.prepareModels(), o.onRoute && o.next(function() {
                        return o.onRoute.apply(o, i)
                    }), o.next(function() {
                        e.invoke(o._staticModules, "route", t, i, o)
                    }), a.route(t, i), r && n !== !0 ? a.routeModule(t, i) : (h && h.stop(a), a.start(t, i))
                }))) : void(this.onRouteError && this.onRouteError.apply(this, arguments))
            },
            triggerRoute: function(t, e) {
                this._onRoute(t, e, !0)
            },
            next: function(t, e, n) {
                var s;
                return this.promise.isPending() ? this.promise = this.promise.then(t, e, n) : (s = t(), i.isPromise(s) && (this.promise = s)), this.promise
            },
            addResolver: function(t, e) {
                this._resolvers[t] = new c(t, e), this._resolvers[t].setRouter(this)
            },
            _startStaticModules: function() {
                var t = this;
                e.isArray(this.staticModules) && this.next(function() {
                    var e = i.defer();
                    return require(t.staticModules, function() {
                        for (var i, n = 0, s = arguments.length; s > n; n++) i = arguments[n], i.start(), t._staticModules.push(i);
                        e.resolve()
                    }), e.promise
                })
            },
            start: function(t) {
                var i = this;
                this._isStarted || (t = e.defaults(t || {}, {
                    pushState: !0
                }), this._startStaticModules(), this.next(function() {
                    n.history.start(t), i.isInterceptAnchorEvent && i._attachAnchorEvent()
                }), i._isStarted = !0)
            },
            _attachAnchorEvent: function() {
                t(document).on("click.router", "a", e.bind(function(i) {
                    var n = t(i.currentTarget),
                        s = n.attr("href"),
                        r = u(s);
                    r.path && 0 === r.path.indexOf("/") && 0 !== r.path.indexOf("/#") && r.isSameHost && (n.attr("data-skip-navigate") && "true" === n.attr("data-skip-navigate") || e.contains(this.staticPath, r.path.substr(1)) || this.containsRoutes(r.path) && "_blank" !== n.attr("target") && (i.metaKey || i.shiftKey || i.ctrlKey || i.altKey || (i.preventDefault(), d.navigate(r.path))))
                }, this))
            },
            isStarted: function() {
                return this._isStarted
            },
            getModel: function(t) {
                return this._currentResolver && this._currentResolver.models[t] ? this._currentResolver.models[t] : null
            },
            getResolver: function() {
                return this._currentResolver
            },
            containsRoutes: function(t) {
                return e.some(n.history.handlers, function(e) {
                    var i = t ? t.substr(1) : "";
                    return e.route.test(i)
                })
            }
        });
        d.navigate = function(t, s) {
            var r, o = i.resolve();
            if (!t) throw new Error("url이 없습니다");
            if (r = u(t), !r.isSameHost) throw new Error("유효하지 않은 경로입니다");
            return s = e.defaults(s || {}, {
                trigger: !0
            }), s.replace || (o = d._getBeforeUnloadPromise()), s.params && (h = e.clone(s.params)), o.then(function() {
                logger.trace("navigate:", d.getPath(r.path)), s.trigger && l.url === d.getPath(r.path) ? l.router.triggerRoute(l.name, l.args) : n.Router.prototype.navigate.call(n.Router, r.path, s)
            })
        }, d.getPath = function(t) {
            var e = n.history.getFragment(t);
            return e = e.replace(/\/$/, "")
        }, d.getParams = function() {
            return l.params
        }, d.onBeforeUnload = null, d._getBeforeUnloadPromise = function() {
            var t, e = i.resolve();
            return d.onBeforeUnload && (t = d.onBeforeUnload(), i.isPromise(t) && (e = t), e = e.then(function() {
                d.onBeforeUnload = null
            })), e
        }, d.getCurrentRouter = function() {
            return a
        };
        var c = function(t, i) {
            this.models = {}, this._name = t, this._renderedModuleCount = 0, this._router = null, this._routePath = null, this._routeName = null, this._routeArgs = null, this._options = i, this._fOnRenderAll = e.bind(this._onRenderAll, this)
        };
        e.extend(c.prototype, {
            models: null,
            setRouter: function(t) {
                this._router = t
            },
            getRouter: function() {
                return this._router
            },
            getRoutingPath: function() {
                return this._routePath
            },
            getName: function() {
                return this._name
            },
            prepareModels: function() {
                var t = this;
                e.isEmpty(this._options.models) || this._next(function() {
                    var n = i.defer();
                    return require(e.values(t._options.models), function() {
                        e.each(t._options.models, function(e, i) {
                            var n = require(e);
                            t.models[i] = new n
                        }), n.resolve()
                    }), n.promise
                })
            },
            route: function(t, e) {
                var i = this;
                this._options.onRoute && this._next(function() {
                    return i._options.onRoute.apply(i, e)
                })
            },
            start: function(e, n) {
                var s = this,
                    r = new RegExp("^" + location.protocol + "//" + location.host);
                this._routeName = e, this._routeArgs = n, this._routePath = location.href.toString().replace(r, ""), this._renderedModuleCount = 0, this._next(function() {
                    return s._options.onBeforeStart ? s._options.onBeforeStart() : void 0
                }), this._next(function() {
                    var r = i.defer();
                    return s._options.isResetScroll !== !1 && t(window).scrollTop(0), s._options.title && (document.title = s._options.title), require(s._options.modules, function() {
                        for (var t, i = 0, o = arguments.length; o > i; i++) t = arguments[i], t.once("renderAll", s._fOnRenderAll), t.start.apply(t, n), t.route(e, n, s._router);
                        r.resolve()
                    }), r.promise
                }), this._next(function() {
                    return s._options.onStart ? s._options.onStart() : void 0
                })
            },
            stop: function(t) {
                var n = this;
                this._next(function() {
                    var s = i.defer();
                    return e.isEmpty(n._options.modules) ? s.resolve() : require(n._options.modules, function() {
                        for (var e = 0, i = arguments.length; i > e; e++) arguments[e].keepAlive && t && t.hasModule(n._options.modules[e]) || arguments[e].stop();
                        s.resolve()
                    }), s.promise
                }), this._next(function() {
                    n.models = {}
                })
            },
            routeModule: function(t, i) {
                var n = this;
                e.isEmpty(this._options.modules) || this._next(function() {
                    require(n._options.modules, function() {
                        for (var e, s = 0, r = arguments.length; r > s; s++) e = arguments[s], e.route(t, i, n._router)
                    })
                })
            },
            hasModule: function(t) {
                return e.contains(this._options.modules, t)
            },
            isSameRouting: function(t, i) {
                return this._routeName === t && e.isEqual(this._routeArgs, i)
            },
            _next: function() {
                this._router.next.apply(this._router, arguments)
            },
            _onRenderAll: function() {
                this._renderedModuleCount++, this._renderedModuleCount === this._options.modules.length && (this._options.onRenderAll && this._options.onRenderAll(), this._router.trigger("renderAll"))
            }
        }), e.extend(d.prototype, s.Events), s.Router = d
    }(s),
    function(i) {
        var n = i.Part.extend({
            name: null,
            keepAlive: !1,
            constructor: function() {
                if (i.Part.apply(this, arguments), !this.name) throw new Error("Requires a name property")
            },
            renderAfterStart: function() {
                i.Part.prototype.renderAfterStart.apply(this, arguments), this.flow.next(e.bind(function() {
                    t('[data-module~="' + this.name + '"],[data-module~="*"]').not('[data-module-exclude~="' + this.name + '"]').append(this.$el), this.domReady(!0)
                }, this))
            }
        });
        i.Module = n
    }(s),
    function(t) {
        var e = t.Part.extend({});
        t.StaticModule = e
    }(s), s
});
define("common/logger", [], function() {
    var n = "debug",
        e = {
            trace: 0,
            debug: 1,
            info: 2,
            warn: 3,
            error: 4
        }, r = e[n],
        o = "console",
        t = null,
        i = function(n) {
            for (var e = [+new Date], r = 0, o = n.length; o > r; r++) e.push(n[r]);
            return e
        }, u = function(n, e) {
            if ("console" === o) {
                e.shift(), "trace" === n && (n = "log");
                try {
                    throw new Error("A Fake error for logging")
                } catch (r) {
                    var i = c(r.stack);
                    if (i) {
                        if (t && !t.test(i)) return;
                        e.push("<" + i + ">")
                    }
                    if ("undefined" != typeof console) try {
                        console[n].apply(console, e)
                    } catch (r) {}
                }
            }
        }, c = function(n) {
            if (!n) return null;
            var e = n.match(/\/([^\/]+\.js:[0-9]+)/g);
            if (e) for (var r = 0, o = e.length; o > r; r++) if (-1 === e[r].indexOf("/logger")) return e[r].substr(1);
            return null
        };
    return window.logger = {
        setLogLevel: function(n) {
            r = e[n]
        },
        setLogMode: function(n) {
            n = n || "console", o = n
        },
        setFilter: function(n) {
            t = n
        },
        trace: function() {
            r <= e.trace && u("trace", i(arguments))
        },
        debug: function() {
            r <= e.debug && u("debug", i(arguments))
        },
        info: function() {
            r <= e.info && u("info", i(arguments))
        },
        warn: function() {
            r <= e.warn && u("warn", i(arguments))
        },
        error: function() {
            r <= e.error && u("error", i(arguments))
        },
        time: function(n) {
            console.time(n)
        },
        timeEnd: function(n) {
            console.timeEnd(n)
        }
    }, window.logger
});
define("common/intl", [], function() {
    var n, r = "locales",
        t = "/",
        u = ".json",
        o = "_plural",
        e = "__",
        i = e,
        f = {
            lng: "en-US",
            files: null,
            msgs: null,
            onerror: null
        }, l = f.lng,
        c = {}, a = function(n) {
            var r = f.onerror;
            r && "function" == typeof r && r(n)
        }, v = function(n) {
            return _.extend(f, n), f
        }, g = function(n) {
            return c[n]
        }, s = function(n, r) {
            c[n] = r
        }, p = function(n) {
            c[n] || (c[n] = {}), l = n
        }, m = function(n, o) {
            for (var e = [], i = 0, f = o.length; f > i; i++) e.push(r + t + n + t + o[i] + u);
            return e
        }, w = function(n, r) {
            for (var t = 0, u = r.length; u > t; t++) d(n, r[t])
        }, d = function(n, r) {
            var t = g(n);
            $.ajax(r, {
                success: function(n) {
                    for (var r in n) t[r] = n[r]
                },
                error: function(n, r) {
                    a(r)
                }
            })
        }, h = function(r) {
            var t = x(l, r);
            return t === n && a(r + "에 해당하는 메시지가 없습니다."), t
        }, j = function(r, t) {
            for (var u, o = t.split("."), e = 0, i = o.length; i > e; e++) {
                if (r = r[o[e]], null === r || r === n) return n;
                if (e === i - 1) {
                    if ("object" == typeof r) return n;
                    u = r
                }
            }
            return u
        }, x = function(r, t) {
            var u = g(r);
            return u ? j(u, t) : n
        }, y = function(n) {
            for (var r in n) {
                var t = n[r];
                if ("number" == typeof t && t >= 2) return !0
            }
            return !1
        }, b = function(r, t, u) {
            var f = x(r, t),
                l = t + o,
                c = x(r, l),
                a = f !== n ? !0 : !1,
                v = c !== n ? !0 : !1,
                g = y(u),
                s = f;
            if (!a && !v) return n;
            g && v && (s = c);
            for (var p in u) {
                var m = e + p + i;
                s = s.replace(new RegExp(m, "g"), u[p])
            }
            return s
        }, E = function(r, t) {
            var u = b(l, r, t);
            return u === n && a(r + "에 해당하는 메시지가 없습니다."), u
        };
    return window.intl = {
        init: function(n) {
            var r, t;
            n = v(n || {}), t = n.msgs, p(n.lng), t ? s(n.lng, t) : (r = m(n.lng, n.files), w(n.lng, r))
        },
        t: function(n, r) {
            return r ? E(n, r) : h(n)
        }
    }, window.intl
});
(function() {
    var e = "data-kant-id",
        t = "data-kant-option",
        n = "data-kant-ignore",
        r = ",",
        a = ":",
        i = !1,
        o = (new Date).getTime(),
        d = {}, f = {
            trackId: "",
            host: "//ad1-kant.kakao.com/web/track.gif",
            eventName: "click",
            pagePattern: "",
            additionalValue: ""
        }, u = function(i) {
            var o, d = $(i.currentTarget),
                f = d.attr(e),
                u = d.attr(t),
                s = d.attr(n),
                p = u;
            "false" !== f && "true" !== s && (_.isString(u) && (p = {}, _.each(u.split(r), function(e) {
                var t = e.split(a);
                p[t[0]] = t[1]
            }), u = p, p = null), o = c.trigger("beforeDomSend", i, {
                pageId: f,
                additionalValue: u
            }), o && (f = o.pageId, u = o.additionalValue), c.send(f, u))
        }, s = function() {
            return encodeURIComponent(document.referrer || "")
        }, p = function(e) {
            var t = "";
            if ("string" != typeof e) {
                for (var n in e) e.hasOwnProperty(n) && (t += r + n + a + e[n]);
                t && (t = t.substr(1))
            } else t = e;
            return t
        }, g = function(e, t) {
            var n = new Image(1, 1);
            t && $(n).one("load error", function() {
                t()
            }), n.src = e
        }, l = function(e, t) {
            for (var n in t) t.hasOwnProperty(n) && "undefined" == typeof e[n] && (e[n] = t[n]);
            return e
        }, c = {
            setOptions: function(e) {
                for (var t in e) e.hasOwnProperty(t) && (f[t] = e[t], "eventName" === t && i && (this.stop(), this.start()))
            },
            getOptions: function(e) {
                return e ? f[e] : f
            },
            send: function(e, t, n, r) {
                var a, i, d, u = s();
                if (n = l(n || {}, f), t && t.referrer && (u = t.referrer, delete t.referrer), d = this.trigger("beforeSend", {
                    pageId: e,
                    additionalValue: t,
                    options: n
                }), d && (e = d.pageId, t = d.additionalValue, n = d.options), a = "", i = {
                    ttype: "",
                    tpage: "",
                    opt2: p(t) || "",
                    durtime: Math.round(((new Date).getTime() - o) / 1e3),
                    refer: u,
                    ads: n.trackId,
                    ts: Math.round((new Date).getTime() / 1e3)
                }, !e && !n.pagePattern) throw new Error("정의된 페이지 아이디나 규칙이 없습니다.");
                e ? (i.ttype = "fieldById", i.tpage = e) : (i.ttype = "filterByName", i.tpage = n.pagePattern);
                for (var c in i) i.hasOwnProperty(c) && (a += "&" + c + "=" + i[c]);
                g(n.host + "?" + a.substr(1), r), this.trigger("send", {
                    pageId: e,
                    additionalValue: t,
                    duration: i.durtime
                }), this.resetTime()
            },
            resetTime: function() {
                o = (new Date).getTime()
            },
            start: function(t) {
                this.setOptions(t), i || ($(document).on(f.eventName, "[" + e + "]", u), i = !0)
            },
            stop: function() {
                $(document).off(f.eventName, "[" + e + "]", u), i = !1
            },
            on: function(e, t) {
                for (var n = d[e] = d[e] || [], r = 0, a = n.length; a > r; r++) if (n[r] === t) return;
                n.push(t)
            },
            off: function(e, t) {
                if (d[e]) {
                    var n = d[e];
                    if (t) {
                        for (var r = 0, a = n.length; a > r; r++) if (n[r] === t) return void n.splice(r, 1)
                    } else delete d[e]
                }
            },
            trigger: function() {
                var e, t = arguments[0],
                    n = d[t],
                    r = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1, arguments.length) : null;
                if (n) for (var a = 0, i = n.length; i > a; a++) if (e = n[a].apply(n[a], r), "undefined" != typeof e) return e
            },
            DATA_ATTRIBUTE_ID_NAME: e,
            DATA_ATTRIBUTE_OPTION_NAME: t,
            DATA_ATTRIBUTE_IGNORE_NAME: n
        };
    "undefined" != typeof define && define.amd ? define("kant", [], function() {
        return c
    }) : (window.kakao = window.kakao || {}, window.kakao.kant = c)
})();
var swfobject = function() {
    function e() {
        if (!U) {
            try {
                var e = M.getElementsByTagName("body")[0].appendChild(h("span"));
                e.parentNode.removeChild(e)
            } catch (t) {
                return
            }
            U = !0;
            for (var n = R.length, a = 0; n > a; a++) R[a]()
        }
    }
    function t(e) {
        U ? e() : R[R.length] = e
    }
    function n(e) {
        if (typeof x.addEventListener != L) x.addEventListener("load", e, !1);
        else if (typeof M.addEventListener != L) M.addEventListener("load", e, !1);
        else if (typeof x.attachEvent != L) m(x, "onload", e);
        else if ("function" == typeof x.onload) {
            var t = x.onload;
            x.onload = function() {
                t(), e()
            }
        } else x.onload = e
    }
    function a() {
        P ? i() : r()
    }
    function i() {
        var e = M.getElementsByTagName("body")[0],
            t = h(j);
        t.setAttribute("type", O);
        var n = e.appendChild(t);
        if (n) {
            var a = 0;
            (function() {
                if (typeof n.GetVariable != L) {
                    var i = n.GetVariable("$version");
                    i && (i = i.split(" ")[1].split(","), X.pv = [parseInt(i[0], 10), parseInt(i[1], 10), parseInt(i[2], 10)])
                } else if (10 > a) return a++, void setTimeout(arguments.callee, 10);
                e.removeChild(t), n = null, r()
            })()
        } else r()
    }
    function r() {
        var e = D.length;
        if (e > 0) for (var t = 0; e > t; t++) {
            var n = D[t].id,
                a = D[t].callbackFn,
                i = {
                    success: !1,
                    id: n
                };
            if (X.pv[0] > 0) {
                var r = y(n);
                if (r) if (!g(D[t].swfVersion) || X.wk && X.wk < 312) if (D[t].expressInstall && s()) {
                    var f = {};
                    f.data = D[t].expressInstall, f.width = r.getAttribute("width") || "0", f.height = r.getAttribute("height") || "0", r.getAttribute("class") && (f.styleclass = r.getAttribute("class")), r.getAttribute("align") && (f.align = r.getAttribute("align"));
                    for (var d = {}, u = r.getElementsByTagName("param"), p = u.length, v = 0; p > v; v++) "movie" != u[v].getAttribute("name").toLowerCase() && (d[u[v].getAttribute("name")] = u[v].getAttribute("value"));
                    l(f, d, n, a)
                } else c(r), a && a(i);
                else b(n, !0), a && (i.success = !0, i.ref = o(n), a(i))
            } else if (b(n, !0), a) {
                var h = o(n);
                h && typeof h.SetVariable != L && (i.success = !0, i.ref = h), a(i)
            }
        }
    }
    function o(e) {
        var t = null,
            n = y(e);
        if (n && "OBJECT" == n.nodeName) if (typeof n.SetVariable != L) t = n;
        else {
            var a = n.getElementsByTagName(j)[0];
            a && (t = a)
        }
        return t
    }
    function s() {
        return !G && g("6.0.65") && (X.win || X.mac) && !(X.wk && X.wk < 312)
    }
    function l(e, t, n, a) {
        G = !0, A = a || null, I = {
            success: !1,
            id: n
        };
        var i = y(n);
        if (i) {
            "OBJECT" == i.nodeName ? (E = f(i), S = null) : (E = i, S = n), e.id = F, (typeof e.width == L || !/%$/.test(e.width) && parseInt(e.width, 10) < 310) && (e.width = "310"), (typeof e.height == L || !/%$/.test(e.height) && parseInt(e.height, 10) < 137) && (e.height = "137"), M.title = M.title.slice(0, 47) + " - Flash Player Installation";
            var r = X.ie && X.win ? "ActiveX" : "PlugIn",
                o = "MMredirectURL=" + encodeURI(window.location).toString().replace(/&/g, "%26") + "&MMplayerType=" + r + "&MMdoctitle=" + M.title;
            if (typeof t.flashvars != L ? t.flashvars += "&" + o : t.flashvars = o, X.ie && X.win && 4 != i.readyState) {
                var s = h("div");
                n += "SWFObjectNew", s.setAttribute("id", n), i.parentNode.insertBefore(s, i), i.style.display = "none",
                function() {
                    4 == i.readyState ? i.parentNode.removeChild(i) : setTimeout(arguments.callee, 10)
                }()
            }
            d(e, t, n)
        }
    }
    function c(e) {
        if (X.ie && X.win && 4 != e.readyState) {
            var t = h("div");
            e.parentNode.insertBefore(t, e), t.parentNode.replaceChild(f(e), t), e.style.display = "none",
            function() {
                4 == e.readyState ? e.parentNode.removeChild(e) : setTimeout(arguments.callee, 10)
            }()
        } else e.parentNode.replaceChild(f(e), e)
    }
    function f(e) {
        var t = h("div");
        if (X.win && X.ie) t.innerHTML = e.innerHTML;
        else {
            var n = e.getElementsByTagName(j)[0];
            if (n) {
                var a = n.childNodes;
                if (a) for (var i = a.length, r = 0; i > r; r++) 1 == a[r].nodeType && "PARAM" == a[r].nodeName || 8 == a[r].nodeType || t.appendChild(a[r].cloneNode(!0))
            }
        }
        return t
    }
    function d(e, t, n) {
        var a, i = y(n);
        if (X.wk && X.wk < 312) return a;
        if (i) if (typeof e.id == L && (e.id = n), X.ie && X.win) {
            var r = "";
            for (var o in e) e[o] != Object.prototype[o] && ("data" == o.toLowerCase() ? t.movie = e[o] : "styleclass" == o.toLowerCase() ? r += ' class="' + e[o] + '"' : "classid" != o.toLowerCase() && (r += " " + o + '="' + e[o] + '"'));
            var s = "";
            for (var l in t) t[l] != Object.prototype[l] && (s += '<param name="' + l + '" value="' + t[l] + '" />');
            i.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + r + ">" + s + "</object>", W[W.length] = e.id, a = y(e.id)
        } else {
            var c = h(j);
            c.setAttribute("type", O);
            for (var f in e) e[f] != Object.prototype[f] && ("styleclass" == f.toLowerCase() ? c.setAttribute("class", e[f]) : "classid" != f.toLowerCase() && c.setAttribute(f, e[f]));
            for (var d in t) t[d] != Object.prototype[d] && "movie" != d.toLowerCase() && u(c, d, t[d]);
            i.parentNode.replaceChild(c, i), a = c
        }
        return a
    }
    function u(e, t, n) {
        var a = h("param");
        a.setAttribute("name", t), a.setAttribute("value", n), e.appendChild(a)
    }
    function p(e) {
        var t = y(e);
        t && "OBJECT" == t.nodeName && (X.ie && X.win ? (t.style.display = "none", function() {
            4 == t.readyState ? v(e) : setTimeout(arguments.callee, 10)
        }()) : t.parentNode.removeChild(t))
    }
    function v(e) {
        var t = y(e);
        if (t) {
            for (var n in t) "function" == typeof t[n] && (t[n] = null);
            t.parentNode.removeChild(t)
        }
    }
    function y(e) {
        var t = null;
        try {
            t = M.getElementById(e)
        } catch (n) {}
        return t
    }
    function h(e) {
        return M.createElement(e)
    }
    function m(e, t, n) {
        e.attachEvent(t, n), H[H.length] = [e, t, n]
    }
    function g(e) {
        var t = X.pv,
            n = e.split(".");
        return n[0] = parseInt(n[0], 10), n[1] = parseInt(n[1], 10) || 0, n[2] = parseInt(n[2], 10) || 0, t[0] > n[0] || t[0] == n[0] && t[1] > n[1] || t[0] == n[0] && t[1] == n[1] && t[2] >= n[2] ? !0 : !1
    }
    function w(e, t, n, a) {
        if (!X.ie || !X.mac) {
            var i = M.getElementsByTagName("head")[0];
            if (i) {
                var r = n && "string" == typeof n ? n : "screen";
                if (a && (N = null, T = null), !N || T != r) {
                    var o = h("style");
                    o.setAttribute("type", "text/css"), o.setAttribute("media", r), N = i.appendChild(o), X.ie && X.win && typeof M.styleSheets != L && M.styleSheets.length > 0 && (N = M.styleSheets[M.styleSheets.length - 1]), T = r
                }
                X.ie && X.win ? N && typeof N.addRule == j && N.addRule(e, t) : N && typeof M.createTextNode != L && N.appendChild(M.createTextNode(e + " {" + t + "}"))
            }
        }
    }
    function b(e, t) {
        if (J) {
            var n = t ? "visible" : "hidden";
            U && y(e) ? y(e).style.visibility = n : w("#" + e, "visibility:" + n)
        }
    }
    function C(e) {
        var t = /[\\\"<>\.;]/,
            n = null != t.exec(e);
        return n && typeof encodeURIComponent != L ? encodeURIComponent(e) : e
    } {
        var E, S, A, I, N, T, L = "undefined",
            j = "object",
            k = "Shockwave Flash",
            B = "ShockwaveFlash.ShockwaveFlash",
            O = "application/x-shockwave-flash",
            F = "SWFObjectExprInst",
            $ = "onreadystatechange",
            x = window,
            M = document,
            V = navigator,
            P = !1,
            R = [a],
            D = [],
            W = [],
            H = [],
            U = !1,
            G = !1,
            J = !0,
            X = function() {
                var e = typeof M.getElementById != L && typeof M.getElementsByTagName != L && typeof M.createElement != L,
                    t = V.userAgent.toLowerCase(),
                    n = V.platform.toLowerCase(),
                    a = /win/.test(n ? n : t),
                    i = /mac/.test(n ? n : t),
                    r = /webkit/.test(t) ? parseFloat(t.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1,
                    o = !1,
                    s = [0, 0, 0],
                    l = null;
                if (typeof V.plugins != L && typeof V.plugins[k] == j) l = V.plugins[k].description, !l || typeof V.mimeTypes != L && V.mimeTypes[O] && !V.mimeTypes[O].enabledPlugin || (P = !0, o = !1, l = l.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), s[0] = parseInt(l.replace(/^(.*)\..*$/, "$1"), 10), s[1] = parseInt(l.replace(/^.*\.(.*)\s.*$/, "$1"), 10), s[2] = /[a-zA-Z]/.test(l) ? parseInt(l.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0);
                else if (typeof x.ActiveXObject != L) try {
                    var c = new ActiveXObject(B);
                    c && (l = c.GetVariable("$version"), l && (o = !0, l = l.split(" ")[1].split(","), s = [parseInt(l[0], 10), parseInt(l[1], 10), parseInt(l[2], 10)]))
                } catch (f) {}
                return {
                    w3: e,
                    pv: s,
                    wk: r,
                    ie: o,
                    win: a,
                    mac: i
                }
            }();
        (function() {
            X.w3 && ((typeof M.readyState != L && "complete" == M.readyState || typeof M.readyState == L && (M.getElementsByTagName("body")[0] || M.body)) && e(), U || (typeof M.addEventListener != L && M.addEventListener("DOMContentLoaded", e, !1), X.ie && X.win && (M.attachEvent($, function() {
                "complete" == M.readyState && (M.detachEvent($, arguments.callee), e())
            }), x == top && function() {
                if (!U) {
                    try {
                        M.documentElement.doScroll("left")
                    } catch (t) {
                        return void setTimeout(arguments.callee, 0)
                    }
                    e()
                }
            }()), X.wk && function() {
                return U ? void 0 : /loaded|complete/.test(M.readyState) ? void e() : void setTimeout(arguments.callee, 0)
            }(), n(e)))
        })(),
        function() {
            X.ie && X.win && window.attachEvent("onunload", function() {
                for (var e = H.length, t = 0; e > t; t++) H[t][0].detachEvent(H[t][1], H[t][2]);
                for (var n = W.length, a = 0; n > a; a++) p(W[a]);
                for (var i in X) X[i] = null;
                X = null;
                for (var r in swfobject) swfobject[r] = null;
                swfobject = null
            })
        }()
    }
    return {
        registerObject: function(e, t, n, a) {
            if (X.w3 && e && t) {
                var i = {};
                i.id = e, i.swfVersion = t, i.expressInstall = n, i.callbackFn = a, D[D.length] = i, b(e, !1)
            } else a && a({
                success: !1,
                id: e
            })
        },
        getObjectById: function(e) {
            return X.w3 ? o(e) : void 0
        },
        embedSWF: function(e, n, a, i, r, o, c, f, u, p) {
            var v = {
                success: !1,
                id: n
            };
            X.w3 && !(X.wk && X.wk < 312) && e && n && a && i && r ? (b(n, !1), t(function() {
                a += "", i += "";
                var t = {};
                if (u && typeof u === j) for (var y in u) t[y] = u[y];
                t.data = e, t.width = a, t.height = i;
                var h = {};
                if (f && typeof f === j) for (var m in f) h[m] = f[m];
                if (c && typeof c === j) for (var w in c) typeof h.flashvars != L ? h.flashvars += "&" + w + "=" + c[w] : h.flashvars = w + "=" + c[w];
                if (g(r)) {
                    var C = d(t, h, n);
                    t.id == n && b(n, !0), v.success = !0, v.ref = C
                } else {
                    if (o && s()) return t.data = o, void l(t, h, n, p);
                    b(n, !0)
                }
                p && p(v)
            })) : p && p(v)
        },
        switchOffAutoHideShow: function() {
            J = !1
        },
        ua: X,
        getFlashPlayerVersion: function() {
            return {
                major: X.pv[0],
                minor: X.pv[1],
                release: X.pv[2]
            }
        },
        hasFlashPlayerVersion: g,
        createSWF: function(e, t, n) {
            return X.w3 ? d(e, t, n) : void 0
        },
        showExpressInstall: function(e, t, n, a) {
            X.w3 && s() && l(e, t, n, a)
        },
        removeSWF: function(e) {
            X.w3 && p(e)
        },
        createCSS: function(e, t, n, a) {
            X.w3 && w(e, t, n, a)
        },
        addDomLoadEvent: t,
        addLoadEvent: n,
        getQueryParamValue: function(e) {
            var t = M.location.search || M.location.hash;
            if (t) {
                if (/\?/.test(t) && (t = t.split("?")[1]), null == e) return C(t);
                for (var n = t.split("&"), a = 0; a < n.length; a++) if (n[a].substring(0, n[a].indexOf("=")) == e) return C(n[a].substring(n[a].indexOf("=") + 1))
            }
            return ""
        },
        expressInstallCallback: function() {
            if (G) {
                var e = y(F);
                e && E && (e.parentNode.replaceChild(E, e), S && (b(S, !0), X.ie && X.win && (E.style.display = "block")), A && A(I)), G = !1
            }
        }
    }
}();
define("swfobject", [], function() {
    return swfobject
});
define("common/agent", ["underscore", "swfobject", "jquery"], function(e, t, s) {
    var i = 5,
        o = 5,
        n = 768,
        r = null,
        h = null,
        d = null,
        a = window.agent = {
            OSES: ["android", "ios", "windows", "mac", "unknown"],
            TYPES: ["tablet", "desktop", "mobile"],
            VENDORS: ["samsung", "apple", "unknown"],
            BROWSERS: ["ie", "chrome", "firefox", "safari", "unknown"],
            os: {},
            type: {},
            vendor: {},
            browser: {},
            support: {},
            _setIsProperty: function(t, s, i) {
                t.is = t.is || {}, e.each(s, function(e) {
                    t.is[e] = i === e
                })
            },
            _setOs: function(e) {
                this._setIsProperty(this.os, this.OSES, e), this.os.name = e
            },
            _setOsVersion: function(e) {
                this.os.version = e
            },
            _setType: function(e) {
                this._setIsProperty(this.type, this.TYPES, e), this.type.name = e
            },
            _setVendor: function(e) {
                this._setIsProperty(this.vendor, this.VENDORS, e), this.vendor.name = e
            },
            _setBrowser: function(e) {
                this._setIsProperty(this.browser, this.BROWSERS, e), this.browser.name = e
            },
            _setBrowserVersion: function(e) {
                this.browser.version = e
            },
            _setSupport: function(e) {
                this.support[e] = !0
            },
            getCssPrefix: function(e, t) {
                var s, i = "";
                if (null === r && (r = "undefined" != typeof document.body.style.webkitTransform ? "-webkit-" : "undefined" != typeof document.body.style.MozTransform ? "-moz-" : "undefined" != typeof document.body.style.OTransform ? "-o-" : "undefined" != typeof document.body.style.msTransform ? "-ms-" : ""), i = r + (e ? e : ""), t) {
                    s = i.split("-"), i = "";
                    for (var o = 0, n = s.length; n > o; o++) s[o] && (i += i ? s[o].substr(0, 1).toUpperCase() + s[o].substr(1) : s[o]);
                    ("-moz-" === r || "-o-" === r) && (i = i.substr(0, 1).toUpperCase() + i.substr(1))
                }
                return i
            },
            reset: function(e, t, i) {
                var o, r;
                this._clear(), /android/i.test(e) ? (o = e.match(/android ([0-9]\.[0-9])\.?([0-9]?)/i), this._setOs("android"), this._setBrowser("android"), o && o[1] && (r = (parseFloat(o[1]) + (o[2] ? .01 * o[2] : 0)).toFixed(2), this._setOsVersion(Number(r))), this._setType(/mobile/i.test(e) ? "mobile" : "tablet"), this._setVendor(/samsung/i.test(e) ? "samsung" : "unknown")) : /(iphone|ipad|ipod)/i.test(e) ? (this._setOs("ios"), this._setVendor("apple"), o = e.match(/([0-9]_[0-9])/i), o && o[1] && this._setOsVersion(parseFloat(o[1].replace(/_/, "."))), this._setType(/ipad/i.test(e) ? "tablet" : "mobile")) : new RegExp("(webos|blackberry|iemobile|opera mini|opera mobile|kindle|mobile.+firefox)", "i").test(e) ? (this._setOs("unknown"), this._setType("mobile")) : /(MacIntel|MacPPC)/i.test(t) ? (this._setOs("mac"), this._setType("desktop"), o = /Mac OS X (\d{2})[_.](\d{1})/.exec(e), o && this._setOsVersion(parseFloat(o[1] + "." + o[2]))) : /(win32|win64)/i.test(t) ? (this._setOs("windows"), this._setType("desktop"), o = /Windows NT (\d+.\d+)/.exec(e), o && this._setOsVersion(parseFloat(o[1]))) : (this._setOs("unknown"), this._setType("desktop")), /MSIE|Trident/i.test(e) && (this._setBrowser("ie"), o = /MSIE (\d+[.]\d+)/.exec(e), o && this._setBrowserVersion(parseFloat(o[1])), o = /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(e), o && this._setBrowserVersion(parseFloat(o[1])), 7 === this.browser.version && /Trident/i.test(e) && this._setBrowserVersion(8)), /firefox/i.test(e) && (this._setBrowser("firefox"), this._setBrowserVersion(parseFloat(/firefox\/\d+[.]\d+/i.exec(e)[0].split("/")[1]))), /chrome/i.test(e) ? (this._setBrowser("chrome"), o = /Chrome\/([\d.]+)/.exec(e), o && this._setBrowserVersion(parseFloat(o[1]))) : !this.os.is.android && /safari/i.test(e) && this._setBrowser("safari"), window.devicePixelRatio && window.devicePixelRatio >= 1.5 && this._setSupport("retina"), this.type.is.tablet && i && i.width && Math.min(i.width, i.height) < n && this._setType("mobile"), this.type.is.mobile && i && i.width && Math.min(i.width, i.height) >= n && this._setType("tablet"), "ontouchstart" in window && this._setSupport("touch"), "undefined" == typeof document.body.style[this.getCssPrefix("perspective", !0)] && "undefined" == typeof document.body.style.perspective || this.os.android && !(this.os.version >= 4) || this._setSupport("css3d"), s.support.cors && this._setSupport("cors"), XMLHttpRequest && "undefined" != typeof(new XMLHttpRequest).upload && "undefined" != typeof FormData && this._setSupport("xhrUpload"), document.createRange && this._setSupport("w3cRange")
            },
            _clear: function() {
                this._setOs("unknown"), this._setOsVersion(0), this._setType("desktop"), this._setBrowser("unknown"), this._setBrowserVersion(0), this._setVendor("unknown")
            },
            isIe8AndBelow: function() {
                return this.browser.is.ie && this.browser.version < 9
            },
            isIe9AndBelow: function() {
                return this.browser.is.ie && this.browser.version < 10
            },
            isIe10AndBelow: function() {
                return this.browser.is.ie && this.browser.version < 11
            },
            isNativeAndroidBrowser: function() {
                return this.os.is.android && this.vendor.is.samsung
            },
            getTouchEvent: function(e) {
                return this.support.touch && e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e || window.event
            },
            isClick: function(e, t, s, o) {
                return Math.abs(e - s) <= i && Math.abs(t - o) <= i
            },
            getFlashVersion: function() {
                return null === h && (h = t.getFlashPlayerVersion()), h && h.major > 0 ? h.major + "." + h.minor + "." + h.release : !1
            },
            getScreen: function() {
                return "undefined" != typeof window.screen ? {
                    width: window.screen.width,
                    height: window.screen.height,
                    pixelDepth: window.screen.pixelDepth || 0
                } : !1
            },
            getWheelDelta: function(e) {
                var t, s = e.originalEvent;
                return t = "undefined" != typeof s.deltaY ? -1 * s.deltaY : "undefined" != typeof s.wheelDeltaY ? s.wheelDeltaY : s.wheelDelta / o
            },
            getScrollBarWidth: function() {
                var e, t, s, i, o;
                return d || (t = $('<div style="position:absolute;width:100px;height:100px;top:-500px;left:-500px;visibility:hidden;overflow:hidden"></div>'), e = $('<p style="width:100%;height:100%;"></p>').appendTo(t), $(document.body).append(t), s = e.width(), t.css("overflow", "scroll"), i = e.width(), o = t[0].clientWidth, s === i && o && (i = o), t.detach(), t = null, e = null, d = s - i), d
            }
        };
    return a.reset(navigator.userAgent, navigator.platform, window.screen), a
});
define("common/api", ["backbone"], function(e) {
    var t = 100,
        n = 2e4,
        r = 1e3,
        a = 18e4,
        i = /^(GET|HEAD)$/i,
        c = /\?/,
        u = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        o = function(e) {
            var t = {}, n = 0,
                r = {
                    has: function(e) {
                        return this.checkExpiration(e)
                    },
                    get: function(e) {
                        var n;
                        return this.checkExpiration(e) ? (n = t[e].data, _.clone(n)) : null
                    },
                    checkExpiration: function(e) {
                        if (!(e in t)) return !1;
                        var n = (new Date).getTime();
                        return n <= t[e].expireTime ? !0 : (this.remove(e), !1)
                    },
                    add: function(n, r, a) {
                        a = a || e.defaultExpiredIn;
                        var i = (new Date).getTime(),
                            c = i + a;
                        t[n] = {
                            data: _.clone(r),
                            createTime: i,
                            expireTime: c
                        }, this.clearExpiredCache(i)
                    },
                    remove: function(e) {
                        delete t[e]
                    },
                    getCreateTime: function(e) {
                        var n = t[e];
                        return n && n.createTime
                    },
                    inspect: function() {
                        return t
                    },
                    clear: function() {
                        _.each(t, _.bind(function(e, t) {
                            this.remove(t)
                        }, this))
                    },
                    clearExpiredCache: function(e) {
                        n > e || (_.each(t, _.bind(function(e, t) {
                            this.checkExpiration(t)
                        }, this)), n = e + a)
                    }
                };
            return r
        }, f = function(e) {
            var t, r, a;
            return e = v(e, {
                Accept: "application/json",
                "X-Kakao-ApiLevel": 16,
                "X-Kakao-DeviceInfo": "web:-;-;-",
                "Accept-Language": "ko"
            }), e.url = p(e.url), e = _.extend({
                dataType: "json",
                timeout: n,
                cache: !1
            }, e), h(e) ? (t = l(e), E.has(t) ? (r = E.get(t), a = Q.fcall(function() {
                return e.extraData !== !0 && delete r._extra, r
            })) : g.has(t) ? a = g.get(t).then(function(t) {
                return t = _.clone(t), e.extraData !== !0 && delete t._extra, t
            }) : (a = s(e), a = a.fin(function(e) {
                return g.remove(t), e
            }), a = a.then(function(n) {
                return E.add(t, n, e.responseCacheTimeout), e.extraData !== !0 && delete n._extra, n
            }), g.add(t, a))) : a = s(e).then(function(t) {
                return e.extraData !== !0 && delete t._extra, t
            }), a
        }, s = function(e) {
            var t = Q.defer();
            try {
                $.ajax(e).then(function(e, n, r) {
                    e = e || {}, e._extra = {
                        responseHeaders: d(r)
                    }, t.resolve(e)
                }, function(e) {
                    t.reject(e)
                })
            } catch (n) {
                t.reject(n)
            }
            return t.promise
        }, d = function(e) {
            for (var t = e.getAllResponseHeaders(), n = {}; u.test(t);) n[RegExp.$1.toLowerCase()] = RegExp.$2;
            return n
        }, p = function(e) {
            return "/api" + (0 === e.indexOf("/") ? "" : "/") + e
        }, h = function(e) {
            return i.test(x(e)) && e.forceRequest !== !0
        }, l = function(e) {
            return x(e) + " " + m(e)
        }, x = function(e) {
            var t = e.type || e.method || "GET";
            return t.toUpperCase()
        }, m = function(e) {
            var t = e.url;
            if (!e.data) return t;
            var n = $.param(e.data),
                r = c.test(t) ? "&" : "?";
            return t + r + n
        }, v = function(e, t) {
            return e = e || {}, e.headers = _.extend(e.headers || {}, t), e
        }, g = o({
            defaultExpiredIn: n
        }),
        E = o({
            defaultExpiredIn: r
        });
    return function() {
        e.ajax = f
    }(), {
        request: f,
        _requesting: g,
        _responseCache: E,
        clearResponseCache: function(e) {
            e.url = p(e.url);
            var n, r, a = l(e),
                i = E.getCreateTime(a);
            return i ? (n = (new Date).getTime(), r = n - i, r > t ? (E.remove(a), !0) : !1) : !1
        }
    }
});
var mejs = mejs || {};
define("mediaelement", ["jquery"], function() {
    mejs.version = "2.13.2", mejs.meIndex = 0, mejs.plugins = {
        silverlight: [{
            version: [3, 0],
            types: ["video/mp4", "video/m4v", "video/mov", "video/wmv", "audio/wma", "audio/m4a", "audio/mp3", "audio/wav", "audio/mpeg"]
        }],
        flash: [{
            version: [9, 0, 124],
            types: ["video/mp4", "video/m4v", "video/mov", "video/flv", "video/rtmp", "video/x-flv", "audio/flv", "audio/x-flv", "audio/mp3", "audio/m4a", "audio/mpeg", "video/youtube", "video/x-youtube"]
        }],
        youtube: [{
            version: null,
            types: ["video/youtube", "video/x-youtube", "audio/youtube", "audio/x-youtube"]
        }],
        vimeo: [{
            version: null,
            types: ["video/vimeo", "video/x-vimeo"]
        }]
    }, mejs.Utility = {
        encodeUrl: function(e) {
            return encodeURIComponent(e)
        },
        escapeHTML: function(e) {
            return e.toString().split("&").join("&").split("<").join("<").split('"').join(""")
        },
        absolutizeUrl: function(e) {
            var t = document.createElement("div");
            return t.innerHTML = '<a href="' + this.escapeHTML(e) + '">x</a>', t.firstChild.href
        },
        getScriptPath: function(e) {
            for (var t, i, n, s, o, a, r = 0, l = "", d = "", u = document.getElementsByTagName("script"), c = u.length, m = e.length; c > r; r++) {
                for (s = u[r].src, i = s.lastIndexOf("/"), i > -1 ? (a = s.substring(i + 1), o = s.substring(0, i + 1)) : (a = s, o = ""), t = 0; m > t; t++) if (d = e[t], n = a.indexOf(d), n > -1) {
                    l = o;
                    break
                }
                if ("" !== l) break
            }
            return l
        },
        secondsToTimeCode: function(e, t, i, n) {
            "undefined" == typeof i ? i = !1 : "undefined" == typeof n && (n = 25);
            var s = Math.floor(e / 3600) % 24,
                o = Math.floor(e / 60) % 60,
                a = Math.floor(e % 60),
                r = Math.floor((e % 1 * n).toFixed(3)),
                l = (t || s > 0 ? (10 > s ? "0" + s : s) + ":" : "") + (10 > o ? "0" + o : o) + ":" + (10 > a ? "0" + a : a) + (i ? ":" + (10 > r ? "0" + r : r) : "");
            return l
        },
        timeCodeToSeconds: function(e, t, i, n) {
            "undefined" == typeof i ? i = !1 : "undefined" == typeof n && (n = 25);
            var s = e.split(":"),
                o = parseInt(s[0], 10),
                a = parseInt(s[1], 10),
                r = parseInt(s[2], 10),
                l = 0,
                d = 0;
            return i && (l = parseInt(s[3]) / n), d = 3600 * o + 60 * a + r + l
        },
        convertSMPTEtoSeconds: function(e) {
            if ("string" != typeof e) return !1;
            e = e.replace(",", ".");
            var t = 0,
                i = -1 != e.indexOf(".") ? e.split(".")[1].length : 0,
                n = 1;
            e = e.split(":").reverse();
            for (var s = 0; s < e.length; s++) n = 1, s > 0 && (n = Math.pow(60, s)), t += Number(e[s]) * n;
            return Number(t.toFixed(i))
        },
        removeSwf: function(e) {
            var t = document.getElementById(e);
            t && /object|embed/i.test(t.nodeName) && (mejs.MediaFeatures.isIE ? (t.style.display = "none", function() {
                4 == t.readyState ? mejs.Utility.removeObjectInIE(e) : setTimeout(arguments.callee, 10)
            }()) : t.parentNode.removeChild(t))
        },
        removeObjectInIE: function(e) {
            var t = document.getElementById(e);
            if (t) {
                for (var i in t) "function" == typeof t[i] && (t[i] = null);
                t.parentNode.removeChild(t)
            }
        }
    }, mejs.PluginDetector = {
        hasPluginVersion: function(e, t) {
            var i = this.plugins[e];
            return t[1] = t[1] || 0, t[2] = t[2] || 0, i[0] > t[0] || i[0] == t[0] && i[1] > t[1] || i[0] == t[0] && i[1] == t[1] && i[2] >= t[2] ? !0 : !1
        },
        nav: window.navigator,
        ua: window.navigator.userAgent.toLowerCase(),
        plugins: [],
        addPlugin: function(e, t, i, n, s) {
            this.plugins[e] = this.detectPlugin(t, i, n, s)
        },
        detectPlugin: function(e, t, i, n) {
            var s, o, a, r = [0, 0, 0];
            if ("undefined" != typeof this.nav.plugins && "object" == typeof this.nav.plugins[e]) {
                if (s = this.nav.plugins[e].description, s && ("undefined" == typeof this.nav.mimeTypes || !this.nav.mimeTypes[t] || this.nav.mimeTypes[t].enabledPlugin)) for (r = s.replace(e, "").replace(/^\s+/, "").replace(/\sr/gi, ".").split("."), o = 0; o < r.length; o++) r[o] = parseInt(r[o].match(/\d+/), 10)
            } else if ("undefined" != typeof window.ActiveXObject) try {
                a = new ActiveXObject(i), a && (r = n(a))
            } catch (l) {}
            return r
        }
    }, mejs.PluginDetector.addPlugin("flash", "Shockwave Flash", "application/x-shockwave-flash", "ShockwaveFlash.ShockwaveFlash", function(e) {
        var t = [],
            i = e.GetVariable("$version");
        return i && (i = i.split(" ")[1].split(","), t = [parseInt(i[0], 10), parseInt(i[1], 10), parseInt(i[2], 10)]), t
    }), mejs.PluginDetector.addPlugin("silverlight", "Silverlight Plug-In", "application/x-silverlight-2", "AgControl.AgControl", function(e) {
        var t = [0, 0, 0, 0],
            i = function(e, t, i, n) {
                for (; e.isVersionSupported(t[0] + "." + t[1] + "." + t[2] + "." + t[3]);) t[i] += n;
                t[i] -= n
            };
        return i(e, t, 0, 1), i(e, t, 1, 1), i(e, t, 2, 1e4), i(e, t, 2, 1e3), i(e, t, 2, 100), i(e, t, 2, 10), i(e, t, 2, 1), i(e, t, 3, 1), t
    }), mejs.MediaFeatures = {
        init: function() {
            var e, t, i = this,
                n = document,
                s = mejs.PluginDetector.nav,
                o = mejs.PluginDetector.ua.toLowerCase(),
                a = ["source", "track", "audio", "video"];
            i.isiPad = null !== o.match(/ipad/i), i.isiPhone = null !== o.match(/iphone/i), i.isiOS = i.isiPhone || i.isiPad, i.isAndroid = null !== o.match(/android/i), i.isBustedAndroid = null !== o.match(/android 2\.[12]/), i.isBustedNativeHTTPS = "https:" === location.protocol && (null !== o.match(/android [12]\./) || null !== o.match(/macintosh.* version.* safari/)), i.isIE = -1 != s.appName.toLowerCase().indexOf("microsoft") || null !== s.appName.toLowerCase().match(/trident/gi), i.isChrome = null !== o.match(/chrome/gi), i.isFirefox = null !== o.match(/firefox/gi), i.isWebkit = null !== o.match(/webkit/gi), i.isGecko = null !== o.match(/gecko/gi) && !i.isWebkit && !i.isIE, i.isOpera = null !== o.match(/opera/gi), i.hasTouch = "ontouchstart" in window, i.svg = !! document.createElementNS && !! document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect;
            for (e = 0; e < a.length; e++) t = document.createElement(a[e]);
            i.supportsMediaTag = "undefined" != typeof t.canPlayType || i.isBustedAndroid;
            try {
                t.canPlayType("video/mp4")
            } catch (r) {
                i.supportsMediaTag = !1
            }
            i.hasSemiNativeFullScreen = "undefined" != typeof t.webkitEnterFullscreen, i.hasNativeFullscreen = "undefined" != typeof t.requestFullscreen, i.hasWebkitNativeFullScreen = "undefined" != typeof t.webkitRequestFullScreen, i.hasMozNativeFullScreen = "undefined" != typeof t.mozRequestFullScreen, i.hasMsNativeFullScreen = "undefined" != typeof t.msRequestFullscreen, i.hasTrueNativeFullScreen = i.hasWebkitNativeFullScreen || i.hasMozNativeFullScreen || i.hasMsNativeFullScreen, i.nativeFullScreenEnabled = i.hasTrueNativeFullScreen, i.hasMozNativeFullScreen ? i.nativeFullScreenEnabled = document.mozFullScreenEnabled : i.hasMsNativeFullScreen && (i.nativeFullScreenEnabled = document.msFullscreenEnabled), i.isChrome && (i.hasSemiNativeFullScreen = !1), i.hasTrueNativeFullScreen && (i.fullScreenEventName = "", i.hasWebkitNativeFullScreen ? i.fullScreenEventName = "webkitfullscreenchange" : i.hasMozNativeFullScreen ? i.fullScreenEventName = "mozfullscreenchange" : i.hasMsNativeFullScreen && (i.fullScreenEventName = "MSFullscreenChange"), i.isFullScreen = function() {
                return t.mozRequestFullScreen ? n.mozFullScreen : t.webkitRequestFullScreen ? n.webkitIsFullScreen : t.hasMsNativeFullScreen ? null !== n.msFullscreenElement : void 0
            }, i.requestFullScreen = function(e) {
                i.hasWebkitNativeFullScreen ? e.webkitRequestFullScreen() : i.hasMozNativeFullScreen ? e.mozRequestFullScreen() : i.hasMsNativeFullScreen && e.msRequestFullscreen()
            }, i.cancelFullScreen = function() {
                i.hasWebkitNativeFullScreen ? document.webkitCancelFullScreen() : i.hasMozNativeFullScreen ? document.mozCancelFullScreen() : i.hasMsNativeFullScreen && document.msExitFullscreen()
            }), i.hasSemiNativeFullScreen && o.match(/mac os x 10_5/i) && (i.hasNativeFullScreen = !1, i.hasSemiNativeFullScreen = !1)
        }
    }, mejs.MediaFeatures.init(), mejs.HtmlMediaElement = {
        pluginType: "native",
        isFullScreen: !1,
        setCurrentTime: function(e) {
            this.currentTime = e
        },
        setMuted: function(e) {
            this.muted = e
        },
        setVolume: function(e) {
            this.volume = e
        },
        stop: function() {
            this.pause()
        },
        setSrc: function(e) {
            for (var t = this.getElementsByTagName("source"); t.length > 0;) this.removeChild(t[0]);
            if ("string" == typeof e) this.src = e;
            else {
                var i, n;
                for (i = 0; i < e.length; i++) if (n = e[i], this.canPlayType(n.type)) {
                    this.src = n.src;
                    break
                }
            }
        },
        setVideoSize: function(e, t) {
            this.width = e, this.height = t
        }
    }, mejs.PluginMediaElement = function(e, t, i) {
        this.id = e, this.pluginType = t, this.src = i, this.events = {}, this.attributes = {}
    }, mejs.PluginMediaElement.prototype = {
        pluginElement: null,
        pluginType: "",
        isFullScreen: !1,
        playbackRate: -1,
        defaultPlaybackRate: -1,
        seekable: [],
        played: [],
        paused: !0,
        ended: !1,
        seeking: !1,
        duration: 0,
        error: null,
        tagName: "",
        muted: !1,
        volume: 1,
        currentTime: 0,
        play: function() {
            null != this.pluginApi && ("youtube" == this.pluginType ? this.pluginApi.playVideo() : this.pluginApi.playMedia(), this.paused = !1)
        },
        load: function() {
            null != this.pluginApi && ("youtube" == this.pluginType || this.pluginApi.loadMedia(), this.paused = !1)
        },
        pause: function() {
            null != this.pluginApi && ("youtube" == this.pluginType ? this.pluginApi.pauseVideo() : this.pluginApi.pauseMedia(), this.paused = !0)
        },
        stop: function() {
            null != this.pluginApi && ("youtube" == this.pluginType ? this.pluginApi.stopVideo() : this.pluginApi.stopMedia(), this.paused = !0)
        },
        canPlayType: function(e) {
            var t, i, n, s = mejs.plugins[this.pluginType];
            for (t = 0; t < s.length; t++) if (n = s[t], mejs.PluginDetector.hasPluginVersion(this.pluginType, n.version)) for (i = 0; i < n.types.length; i++) if (e == n.types[i]) return "probably";
            return ""
        },
        positionFullscreenButton: function(e, t, i) {
            null != this.pluginApi && this.pluginApi.positionFullscreenButton && this.pluginApi.positionFullscreenButton(Math.floor(e), Math.floor(t), i)
        },
        hideFullscreenButton: function() {
            null != this.pluginApi && this.pluginApi.hideFullscreenButton && this.pluginApi.hideFullscreenButton()
        },
        setSrc: function(e) {
            if ("string" == typeof e) this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(e)), this.src = mejs.Utility.absolutizeUrl(e);
            else {
                var t, i;
                for (t = 0; t < e.length; t++) if (i = e[t], this.canPlayType(i.type)) {
                    this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(i.src)), this.src = mejs.Utility.absolutizeUrl(e);
                    break
                }
            }
        },
        setCurrentTime: function(e) {
            null != this.pluginApi && ("youtube" == this.pluginType ? this.pluginApi.seekTo(e) : this.pluginApi.setCurrentTime(e), this.currentTime = e)
        },
        setVolume: function(e) {
            null != this.pluginApi && (this.pluginApi.setVolume("youtube" == this.pluginType ? 100 * e : e), this.volume = e)
        },
        setMuted: function(e) {
            null != this.pluginApi && ("youtube" == this.pluginType ? (e ? this.pluginApi.mute() : this.pluginApi.unMute(), this.muted = e, this.dispatchEvent("volumechange")) : this.pluginApi.setMuted(e), this.muted = e)
        },
        setVideoSize: function(e, t) {
            this.pluginElement.style && (this.pluginElement.style.width = e + "px", this.pluginElement.style.height = t + "px"), null != this.pluginApi && this.pluginApi.setVideoSize && this.pluginApi.setVideoSize(e, t)
        },
        setFullscreen: function(e) {
            null != this.pluginApi && this.pluginApi.setFullscreen && this.pluginApi.setFullscreen(e)
        },
        enterFullScreen: function() {
            null != this.pluginApi && this.pluginApi.setFullscreen && this.setFullscreen(!0)
        },
        exitFullScreen: function() {
            null != this.pluginApi && this.pluginApi.setFullscreen && this.setFullscreen(!1)
        },
        addEventListener: function(e, t) {
            this.events[e] = this.events[e] || [], this.events[e].push(t)
        },
        removeEventListener: function(e, t) {
            if (!e) return this.events = {}, !0;
            var n = this.events[e];
            if (!n) return !0;
            if (!t) return this.events[e] = [], !0;
            for (i = 0; i < n.length; i++) if (n[i] === t) return this.events[e].splice(i, 1), !0;
            return !1
        },
        dispatchEvent: function(e) {
            var t, i, n = this.events[e];
            if (n) for (i = Array.prototype.slice.call(arguments, 1), t = 0; t < n.length; t++) n[t].apply(null, i)
        },
        hasAttribute: function(e) {
            return e in this.attributes
        },
        removeAttribute: function(e) {
            delete this.attributes[e]
        },
        getAttribute: function(e) {
            return this.hasAttribute(e) ? this.attributes[e] : ""
        },
        setAttribute: function(e, t) {
            this.attributes[e] = t
        },
        remove: function() {
            mejs.Utility.removeSwf(this.pluginElement.id), mejs.MediaPluginBridge.unregisterPluginElement(this.pluginElement.id)
        }
    }, mejs.MediaPluginBridge = {
        pluginMediaElements: {},
        htmlMediaElements: {},
        registerPluginElement: function(e, t, i) {
            this.pluginMediaElements[e] = t, this.htmlMediaElements[e] = i
        },
        unregisterPluginElement: function(e) {
            delete this.pluginMediaElements[e], delete this.htmlMediaElements[e]
        },
        initPlugin: function(e) {
            var t = this.pluginMediaElements[e],
                i = this.htmlMediaElements[e];
            if (t) {
                switch (t.pluginType) {
                    case "flash":
                        t.pluginElement = t.pluginApi = document.getElementById(e);
                        break;
                    case "silverlight":
                        t.pluginElement = document.getElementById(t.id), t.pluginApi = t.pluginElement.Content.MediaElementJS
                }
                null != t.pluginApi && t.success && t.success(t, i)
            }
        },
        fireEvent: function(e, t, i) {
            var n, s, o, a = this.pluginMediaElements[e];
            if (a) {
                n = {
                    type: t,
                    target: a
                };
                for (s in i) a[s] = i[s], n[s] = i[s];
                o = i.bufferedTime || 0, n.target.buffered = n.buffered = {
                    start: function() {
                        return 0
                    },
                    end: function() {
                        return o
                    },
                    length: 1
                }, a.dispatchEvent(n.type, n)
            }
        }
    }, mejs.MediaElementDefaults = {
        mode: "auto",
        plugins: ["flash", "silverlight", "youtube", "vimeo"],
        enablePluginDebug: !1,
        httpsBasicAuthSite: !1,
        type: "",
        pluginPath: mejs.Utility.getScriptPath(["mediaelement.js", "mediaelement.min.js", "mediaelement-and-player.js", "mediaelement-and-player.min.js"]),
        flashName: "flashmediaelement.swf",
        flashStreamer: "",
        enablePluginSmoothing: !1,
        enablePseudoStreaming: !1,
        pseudoStreamingStartQueryParam: "start",
        silverlightName: "silverlightmediaelement.xap",
        defaultVideoWidth: 480,
        defaultVideoHeight: 270,
        pluginWidth: -1,
        pluginHeight: -1,
        pluginVars: [],
        timerRate: 250,
        startVolume: .8,
        success: function() {},
        error: function() {}
    }, mejs.MediaElement = function(e, t) {
        return mejs.HtmlMediaElementShim.create(e, t)
    }, mejs.HtmlMediaElementShim = {
        create: function(e, t) {
            var i, n, s = mejs.MediaElementDefaults,
                o = "string" == typeof e ? document.getElementById(e) : e,
                a = o.tagName.toLowerCase(),
                r = "audio" === a || "video" === a,
                l = o.getAttribute(r ? "src" : "href"),
                d = o.getAttribute("poster"),
                u = o.getAttribute("autoplay"),
                c = o.getAttribute("preload"),
                m = o.getAttribute("controls");
            for (n in t) s[n] = t[n];
            return l = "undefined" == typeof l || null === l || "" == l ? null : l, d = "undefined" == typeof d || null === d ? "" : d, c = "undefined" == typeof c || null === c || "false" === c ? "none" : c, u = !("undefined" == typeof u || null === u || "false" === u), m = !("undefined" == typeof m || null === m || "false" === m), i = this.determinePlayback(o, s, mejs.MediaFeatures.supportsMediaTag, r, l), i.url = null !== i.url ? mejs.Utility.absolutizeUrl(i.url) : "", "native" == i.method ? (mejs.MediaFeatures.isBustedAndroid && (o.src = i.url, o.addEventListener("click", function() {
                o.play()
            }, !1)), this.updateNative(i, s, u, c)) : "" !== i.method ? this.createPlugin(i, s, d, u, c, m) : (this.createErrorMessage(i, s, d), this)
        },
        determinePlayback: function(e, t, i, n, s) {
            var o, a, r, l, d, u, c, m, p, h, f, v = [],
                g = {
                    method: "",
                    url: "",
                    htmlMediaElement: e,
                    isVideo: "audio" != e.tagName.toLowerCase()
                };
            if ("undefined" != typeof t.type && "" !== t.type) if ("string" == typeof t.type) v.push({
                type: t.type,
                url: s
            });
            else for (o = 0; o < t.type.length; o++) v.push({
                type: t.type[o],
                url: s
            });
            else if (null !== s) u = this.formatType(s, e.getAttribute("type")), v.push({
                type: u,
                url: s
            });
            else for (o = 0; o < e.childNodes.length; o++) d = e.childNodes[o], 1 == d.nodeType && "source" == d.tagName.toLowerCase() && (s = d.getAttribute("src"), u = this.formatType(s, d.getAttribute("type")), f = d.getAttribute("media"), (!f || !window.matchMedia || window.matchMedia && window.matchMedia(f).matches) && v.push({
                type: u,
                url: s
            }));
            if (!n && v.length > 0 && null !== v[0].url && this.getTypeFromFile(v[0].url).indexOf("audio") > -1 && (g.isVideo = !1), mejs.MediaFeatures.isBustedAndroid && (e.canPlayType = function(e) {
                return null !== e.match(/video\/(mp4|m4v)/gi) ? "maybe" : ""
            }), !(!i || "auto" !== t.mode && "auto_plugin" !== t.mode && "native" !== t.mode || mejs.MediaFeatures.isBustedNativeHTTPS && t.httpsBasicAuthSite === !0)) {
                for (n || (h = document.createElement(g.isVideo ? "video" : "audio"), e.parentNode.insertBefore(h, e), e.style.display = "none", g.htmlMediaElement = e = h), o = 0; o < v.length; o++) if ("" !== e.canPlayType(v[o].type).replace(/no/, "") || "" !== e.canPlayType(v[o].type.replace(/mp3/, "mpeg")).replace(/no/, "")) {
                    g.method = "native", g.url = v[o].url;
                    break
                }
                if ("native" === g.method && (null !== g.url && (e.src = g.url), "auto_plugin" !== t.mode)) return g
            }
            if ("auto" === t.mode || "auto_plugin" === t.mode || "shim" === t.mode) for (o = 0; o < v.length; o++) for (u = v[o].type, a = 0; a < t.plugins.length; a++) for (c = t.plugins[a], m = mejs.plugins[c], r = 0; r < m.length; r++) if (p = m[r], null == p.version || mejs.PluginDetector.hasPluginVersion(c, p.version)) for (l = 0; l < p.types.length; l++) if (u == p.types[l]) return g.method = c, g.url = v[o].url, g;
            return "auto_plugin" === t.mode && "native" === g.method ? g : ("" === g.method && v.length > 0 && (g.url = v[0].url), g)
        },
        formatType: function(e, t) {
            return e && !t ? this.getTypeFromFile(e) : t && ~t.indexOf(";") ? t.substr(0, t.indexOf(";")) : t
        },
        getTypeFromFile: function(e) {
            e = e.split("?")[0];
            var t = e.substring(e.lastIndexOf(".") + 1).toLowerCase();
            return (/(mp4|m4v|ogg|ogv|webm|webmv|flv|wmv|mpeg|mov)/gi.test(t) ? "video" : "audio") + "/" + this.getTypeFromExtension(t)
        },
        getTypeFromExtension: function(e) {
            switch (e) {
                case "mp4":
                case "m4v":
                    return "mp4";
                case "webm":
                case "webma":
                case "webmv":
                    return "webm";
                case "ogg":
                case "oga":
                case "ogv":
                    return "ogg";
                default:
                    return e
            }
        },
        createErrorMessage: function(e, t, i) {
            var n = e.htmlMediaElement,
                s = document.createElement("div");
            s.className = "me-cannotplay";
            try {
                s.style.width = n.width + "px", s.style.height = n.height + "px"
            } catch (o) {}
            s.innerHTML = t.customError ? t.customError : "" !== i ? '<a href="' + e.url + '"><img src="' + i + '" width="100%" height="100%" /></a>' : '<a href="' + e.url + '"><span>' + mejs.i18n.t("Download File") + "</span></a>", n.parentNode.insertBefore(s, n), n.style.display = "none", t.error(n)
        },
        createPlugin: function(e, t, i, n, s, o) {
            var a, r, l, d = e.htmlMediaElement,
                u = 1,
                c = 1,
                m = "me_" + e.method + "_" + mejs.meIndex++,
                p = new mejs.PluginMediaElement(m, e.method, e.url),
                h = document.createElement("div");
            p.tagName = d.tagName;
            for (var f = 0; f < d.attributes.length; f++) {
                var v = d.attributes[f];
                1 == v.specified && p.setAttribute(v.name, v.value)
            }
            for (r = d.parentNode; null !== r && "body" != r.tagName.toLowerCase();) {
                if ("p" == r.parentNode.tagName.toLowerCase()) {
                    r.parentNode.parentNode.insertBefore(r, r.parentNode);
                    break
                }
                r = r.parentNode
            }
            switch (e.isVideo ? (u = t.pluginWidth > 0 ? t.pluginWidth : t.videoWidth > 0 ? t.videoWidth : null !== d.getAttribute("width") ? d.getAttribute("width") : t.defaultVideoWidth, c = t.pluginHeight > 0 ? t.pluginHeight : t.videoHeight > 0 ? t.videoHeight : null !== d.getAttribute("height") ? d.getAttribute("height") : t.defaultVideoHeight, u = mejs.Utility.encodeUrl(u), c = mejs.Utility.encodeUrl(c)) : t.enablePluginDebug && (u = 320, c = 240), p.success = t.success, mejs.MediaPluginBridge.registerPluginElement(m, p, d), h.className = "me-plugin", h.id = m + "_container", e.isVideo ? d.parentNode.insertBefore(h, d) : document.body.insertBefore(h, document.body.childNodes[0]), l = ["id=" + m, "isvideo=" + (e.isVideo ? "true" : "false"), "autoplay=" + (n ? "true" : "false"), "preload=" + s, "width=" + u, "startvolume=" + t.startVolume, "timerrate=" + t.timerRate, "flashstreamer=" + t.flashStreamer, "height=" + c, "pseudostreamstart=" + t.pseudoStreamingStartQueryParam], null !== e.url && l.push("flash" == e.method ? "file=" + mejs.Utility.encodeUrl(e.url) : "file=" + e.url), t.enablePluginDebug && l.push("debug=true"), t.enablePluginSmoothing && l.push("smoothing=true"), t.enablePseudoStreaming && l.push("pseudostreaming=true"), o && l.push("controls=true"), t.pluginVars && (l = l.concat(t.pluginVars)), e.method) {
                case "silverlight":
                    h.innerHTML = '<object data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="' + m + '" name="' + m + '" width="' + u + '" height="' + c + '" class="mejs-shim"><param name="initParams" value="' + l.join(",") + '" /><param name="windowless" value="true" /><param name="background" value="black" /><param name="minRuntimeVersion" value="3.0.0.0" /><param name="autoUpgrade" value="true" /><param name="source" value="' + t.pluginPath + t.silverlightName + '" /></object>';
                    break;
                case "flash":
                    mejs.MediaFeatures.isIE ? (a = document.createElement("div"), h.appendChild(a), a.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' + m + '" width="' + u + '" height="' + c + '" class="mejs-shim"><param name="movie" value="' + t.pluginPath + t.flashName + "?x=" + new Date + '" /><param name="flashvars" value="' + l.join("&") + '" /><param name="quality" value="high" /><param name="bgcolor" value="#000000" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="true" /><param name="scale" value="default" /></object>') : h.innerHTML = '<embed id="' + m + '" name="' + m + '" play="true" loop="false" quality="high" bgcolor="#000000" wmode="transparent" allowScriptAccess="always" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer" src="' + t.pluginPath + t.flashName + '" flashvars="' + l.join("&") + '" width="' + u + '" height="' + c + '" scale="default"class="mejs-shim"></embed>';
                    break;
                case "youtube":
                    var g = e.url.substr(e.url.lastIndexOf("=") + 1);
                    youtubeSettings = {
                        container: h,
                        containerId: h.id,
                        pluginMediaElement: p,
                        pluginId: m,
                        videoId: g,
                        height: c,
                        width: u
                    }, mejs.PluginDetector.hasPluginVersion("flash", [10, 0, 0]) ? mejs.YouTubeApi.createFlash(youtubeSettings) : mejs.YouTubeApi.enqueueIframe(youtubeSettings);
                    break;
                case "vimeo":
                    p.vimeoid = e.url.substr(e.url.lastIndexOf("/") + 1), h.innerHTML = '<iframe src="http://player.vimeo.com/video/' + p.vimeoid + '?portrait=0&byline=0&title=0" width="' + u + '" height="' + c + '" frameborder="0" class="mejs-shim"></iframe>'
            }
            return d.style.display = "none", d.removeAttribute("autoplay"), p
        },
        updateNative: function(e, t) {
            var i, n = e.htmlMediaElement;
            for (i in mejs.HtmlMediaElement) n[i] = mejs.HtmlMediaElement[i];
            return t.success(n, n), n
        }
    }, mejs.YouTubeApi = {
        isIframeStarted: !1,
        isIframeLoaded: !1,
        loadIframeApi: function() {
            if (!this.isIframeStarted) {
                var e = document.createElement("script");
                e.src = "//www.youtube.com/player_api";
                var t = document.getElementsByTagName("script")[0];
                t.parentNode.insertBefore(e, t), this.isIframeStarted = !0
            }
        },
        iframeQueue: [],
        enqueueIframe: function(e) {
            this.isLoaded ? this.createIframe(e) : (this.loadIframeApi(), this.iframeQueue.push(e))
        },
        createIframe: function(e) {
            var t = e.pluginMediaElement,
                i = new YT.Player(e.containerId, {
                    height: e.height,
                    width: e.width,
                    videoId: e.videoId,
                    playerVars: {
                        controls: 0
                    },
                    events: {
                        onReady: function() {
                            e.pluginMediaElement.pluginApi = i, mejs.MediaPluginBridge.initPlugin(e.pluginId), setInterval(function() {
                                mejs.YouTubeApi.createEvent(i, t, "timeupdate")
                            }, 250)
                        },
                        onStateChange: function(e) {
                            mejs.YouTubeApi.handleStateChange(e.data, i, t)
                        }
                    }
                })
        },
        createEvent: function(e, t, i) {
            var n = {
                type: i,
                target: t
            };
            if (e && e.getDuration) {
                t.currentTime = n.currentTime = e.getCurrentTime(), t.duration = n.duration = e.getDuration(), n.paused = t.paused, n.ended = t.ended, n.muted = e.isMuted(), n.volume = e.getVolume() / 100, n.bytesTotal = e.getVideoBytesTotal(), n.bufferedBytes = e.getVideoBytesLoaded();
                var s = n.bufferedBytes / n.bytesTotal * n.duration;
                n.target.buffered = n.buffered = {
                    start: function() {
                        return 0
                    },
                    end: function() {
                        return s
                    },
                    length: 1
                }
            }
            t.dispatchEvent(n.type, n)
        },
        iFrameReady: function() {
            for (this.isLoaded = !0, this.isIframeLoaded = !0; this.iframeQueue.length > 0;) {
                var e = this.iframeQueue.pop();
                this.createIframe(e)
            }
        },
        flashPlayers: {},
        createFlash: function(e) {
            this.flashPlayers[e.pluginId] = e;
            var t, i = "//www.youtube.com/apiplayer?enablejsapi=1&playerapiid=" + e.pluginId + "&version=3&autoplay=0&controls=0&modestbranding=1&loop=0";
            mejs.MediaFeatures.isIE ? (t = document.createElement("div"), e.container.appendChild(t), t.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' + e.pluginId + '" width="' + e.width + '" height="' + e.height + '" class="mejs-shim"><param name="movie" value="' + i + '" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="true" /></object>') : e.container.innerHTML = '<object type="application/x-shockwave-flash" id="' + e.pluginId + '" data="' + i + '" width="' + e.width + '" height="' + e.height + '" style="visibility: visible; " class="mejs-shim"><param name="allowScriptAccess" value="always"><param name="wmode" value="transparent"></object>'
        },
        flashReady: function(e) {
            var t = this.flashPlayers[e],
                i = document.getElementById(e),
                n = t.pluginMediaElement;
            n.pluginApi = n.pluginElement = i, mejs.MediaPluginBridge.initPlugin(e), i.cueVideoById(t.videoId);
            var s = t.containerId + "_callback";
            window[s] = function(e) {
                mejs.YouTubeApi.handleStateChange(e, i, n)
            }, i.addEventListener("onStateChange", s), setInterval(function() {
                mejs.YouTubeApi.createEvent(i, n, "timeupdate")
            }, 250)
        },
        handleStateChange: function(e, t, i) {
            switch (e) {
                case -1:
                    i.paused = !0, i.ended = !0, mejs.YouTubeApi.createEvent(t, i, "loadedmetadata");
                    break;
                case 0:
                    i.paused = !1, i.ended = !0, mejs.YouTubeApi.createEvent(t, i, "ended");
                    break;
                case 1:
                    i.paused = !1, i.ended = !1, mejs.YouTubeApi.createEvent(t, i, "play"), mejs.YouTubeApi.createEvent(t, i, "playing");
                    break;
                case 2:
                    i.paused = !0, i.ended = !1, mejs.YouTubeApi.createEvent(t, i, "pause");
                    break;
                case 3:
                    mejs.YouTubeApi.createEvent(t, i, "progress");
                    break;
                case 5:
            }
        }
    }, window.mejs = mejs, window.MediaElement = mejs.MediaElement,
    function(e, t) {
        var i = {
            locale: {
                language: "",
                strings: {}
            },
            methods: {}
        };
        i.getLanguage = function() {
            var e = i.locale.language || window.navigator.userLanguage || window.navigator.language;
            return e.substr(0, 2).toLowerCase()
        }, "undefined" != typeof mejsL10n && (i.locale.language = mejsL10n.language), i.methods.checkPlain = function(e) {
            var t, i, n = {
                "&": "&",
                '"': """,
                "<": "<",
                ">": ">"
            };
            e = String(e);
            for (t in n) n.hasOwnProperty(t) && (i = new RegExp(t, "g"), e = e.replace(i, n[t]));
            return e
        }, i.methods.t = function(e, t) {
            return i.locale.strings && i.locale.strings[t.context] && i.locale.strings[t.context][e] && (e = i.locale.strings[t.context][e]), i.methods.checkPlain(e)
        }, i.t = function(e, t) {
            if ("string" == typeof e && e.length > 0) {
                var n = i.getLanguage();
                return t = t || {
                    context: n
                }, i.methods.t(e, t)
            }
            throw {
                name: "InvalidArgumentException",
                message: "First argument is either not a string or empty."
            }
        }, t.i18n = i
    }(document, mejs),
    function(e) {
        "undefined" != typeof mejsL10n && (e[mejsL10n.language] = mejsL10n.strings)
    }(mejs.i18n.locale.strings),
    function(e) {
        "undefined" == typeof e.de && (e.de = {
            Fullscreen: "Vollbild",
            "Go Fullscreen": "Vollbild an",
            "Turn off Fullscreen": "Vollbild aus",
            Close: "Schließen"
        })
    }(mejs.i18n.locale.strings),
    function(e) {
        "undefined" == typeof e.zh && (e.zh = {
            Fullscreen: "全螢幕",
            "Go Fullscreen": "全屏模式",
            "Turn off Fullscreen": "退出全屏模式",
            Close: "關閉"
        })
    }(mejs.i18n.locale.strings), "undefined" != typeof jQuery ? mejs.$ = jQuery : "undefined" != typeof ender && (mejs.$ = ender),
    function(e) {
        mejs.MepDefaults = {
            poster: "",
            showPosterWhenEnded: !1,
            defaultVideoWidth: 480,
            defaultVideoHeight: 270,
            videoWidth: -1,
            videoHeight: -1,
            defaultAudioWidth: 400,
            defaultAudioHeight: 30,
            defaultSeekBackwardInterval: function(e) {
                return .05 * e.duration
            },
            defaultSeekForwardInterval: function(e) {
                return .05 * e.duration
            },
            audioWidth: -1,
            audioHeight: -1,
            startVolume: .8,
            loop: !1,
            autoRewind: !0,
            enableAutosize: !0,
            alwaysShowHours: !1,
            showTimecodeFrameCount: !1,
            framesPerSecond: 25,
            autosizeProgress: !0,
            alwaysShowControls: !1,
            hideVideoControlsOnLoad: !1,
            clickToPlayPause: !0,
            iPadUseNativeControls: !1,
            iPhoneUseNativeControls: !1,
            AndroidUseNativeControls: !1,
            features: ["playpause", "current", "progress", "duration", "tracks", "volume", "fullscreen"],
            isVideo: !0,
            enableKeyboard: !0,
            pauseOtherPlayers: !0,
            keyActions: [{
                keys: [32, 179],
                action: function(e, t) {
                    t.paused || t.ended ? e.play() : e.pause()
                }
            }, {
                keys: [38],
                action: function(e, t) {
                    var i = Math.min(t.volume + .1, 1);
                    t.setVolume(i)
                }
            }, {
                keys: [40],
                action: function(e, t) {
                    var i = Math.max(t.volume - .1, 0);
                    t.setVolume(i)
                }
            }, {
                keys: [37, 227],
                action: function(e, t) {
                    if (!isNaN(t.duration) && t.duration > 0) {
                        e.isVideo && (e.showControls(), e.startControlsTimer());
                        var i = Math.max(t.currentTime - e.options.defaultSeekBackwardInterval(t), 0);
                        t.setCurrentTime(i)
                    }
                }
            }, {
                keys: [39, 228],
                action: function(e, t) {
                    if (!isNaN(t.duration) && t.duration > 0) {
                        e.isVideo && (e.showControls(), e.startControlsTimer());
                        var i = Math.min(t.currentTime + e.options.defaultSeekForwardInterval(t), t.duration);
                        t.setCurrentTime(i)
                    }
                }
            }, {
                keys: [70],
                action: function(e) {
                    "undefined" != typeof e.enterFullScreen && (e.isFullScreen ? e.exitFullScreen() : e.enterFullScreen())
                }
            }]
        }, mejs.mepIndex = 0, mejs.players = {}, mejs.MediaElementPlayer = function(t, i) {
            if (!(this instanceof mejs.MediaElementPlayer)) return new mejs.MediaElementPlayer(t, i);
            var n = this;
            return n.$media = n.$node = e(t), n.node = n.media = n.$media[0], "undefined" != typeof n.node.player ? n.node.player : (n.node.player = n, "undefined" == typeof i && (i = n.$node.data("mejsoptions")), n.options = e.extend({}, mejs.MepDefaults, i), n.id = "mep_" + mejs.mepIndex++, mejs.players[n.id] = n, n.init(), n)
        }, mejs.MediaElementPlayer.prototype = {
            hasFocus: !1,
            controlsAreVisible: !0,
            init: function() {
                var t = this,
                    i = mejs.MediaFeatures,
                    n = e.extend(!0, {}, t.options, {
                        success: function(e, i) {
                            t.meReady(e, i)
                        },
                        error: function(e) {
                            t.handleError(e)
                        }
                    }),
                    s = t.media.tagName.toLowerCase();
                if (t.isDynamic = "audio" !== s && "video" !== s, t.isVideo = t.isDynamic ? t.options.isVideo : "audio" !== s && t.options.isVideo, i.isiPad && t.options.iPadUseNativeControls || i.isiPhone && t.options.iPhoneUseNativeControls) t.$media.attr("controls", "controls"), i.isiPad && null !== t.media.getAttribute("autoplay") && t.play();
                else if (i.isAndroid && t.options.AndroidUseNativeControls);
                else {
                    if (t.$media.removeAttr("controls"), t.container = e('<div id="' + t.id + '" class="mejs-container ' + (mejs.MediaFeatures.svg ? "svg" : "no-svg") + '"><div class="mejs-inner"><div class="mejs-mediaelement"></div><div class="mejs-layers"></div><div class="mejs-controls"></div><div class="mejs-clear"></div></div></div>').addClass(t.$media[0].className).insertBefore(t.$media), t.container.addClass((i.isAndroid ? "mejs-android " : "") + (i.isiOS ? "mejs-ios " : "") + (i.isiPad ? "mejs-ipad " : "") + (i.isiPhone ? "mejs-iphone " : "") + (t.isVideo ? "mejs-video " : "mejs-audio ")), i.isiOS) {
                        var o = t.$media.clone();
                        t.container.find(".mejs-mediaelement").append(o), t.$media.remove(), t.$node = t.$media = o, t.node = t.media = o[0]
                    } else t.container.find(".mejs-mediaelement").append(t.$media);
                    t.controls = t.container.find(".mejs-controls"), t.layers = t.container.find(".mejs-layers");
                    var a = t.isVideo ? "video" : "audio",
                        r = a.substring(0, 1).toUpperCase() + a.substring(1);
                    t.width = t.options[a + "Width"] > 0 || t.options[a + "Width"].toString().indexOf("%") > -1 ? t.options[a + "Width"] : "" !== t.media.style.width && null !== t.media.style.width ? t.media.style.width : null !== t.media.getAttribute("width") ? t.$media.attr("width") : t.options["default" + r + "Width"], t.height = t.options[a + "Height"] > 0 || t.options[a + "Height"].toString().indexOf("%") > -1 ? t.options[a + "Height"] : "" !== t.media.style.height && null !== t.media.style.height ? t.media.style.height : null !== t.$media[0].getAttribute("height") ? t.$media.attr("height") : t.options["default" + r + "Height"], t.setPlayerSize(t.width, t.height), n.pluginWidth = t.width, n.pluginHeight = t.height
                }
                mejs.MediaElement(t.$media[0], n), "undefined" != typeof t.container && t.controlsAreVisible && t.container.trigger("controlsshown")
            },
            showControls: function(e) {
                var t = this;
                e = "undefined" == typeof e || e, t.controlsAreVisible || (e ? (t.controls.css("visibility", "visible").stop(!0, !0).fadeIn(200, function() {
                    t.controlsAreVisible = !0, t.container.trigger("controlsshown")
                }), t.container.find(".mejs-control").css("visibility", "visible").stop(!0, !0).fadeIn(200, function() {
                    t.controlsAreVisible = !0
                })) : (t.controls.css("visibility", "visible").css("display", "block"), t.container.find(".mejs-control").css("visibility", "visible").css("display", "block"), t.controlsAreVisible = !0, t.container.trigger("controlsshown")), t.setControlsSize())
            },
            hideControls: function(t) {
                var i = this;
                t = "undefined" == typeof t || t, i.controlsAreVisible && !i.options.alwaysShowControls && (t ? (i.controls.stop(!0, !0).fadeOut(200, function() {
                    e(this).css("visibility", "hidden").css("display", "block"), i.controlsAreVisible = !1, i.container.trigger("controlshidden")
                }), i.container.find(".mejs-control").stop(!0, !0).fadeOut(200, function() {
                    e(this).css("visibility", "hidden").css("display", "block")
                })) : (i.controls.css("visibility", "hidden").css("display", "block"), i.container.find(".mejs-control").css("visibility", "hidden").css("display", "block"), i.controlsAreVisible = !1, i.container.trigger("controlshidden")))
            },
            controlsTimer: null,
            startControlsTimer: function(e) {
                var t = this;
                e = "undefined" != typeof e ? e : 1500, t.killControlsTimer("start"), t.controlsTimer = setTimeout(function() {
                    t.hideControls(), t.killControlsTimer("hide")
                }, e)
            },
            killControlsTimer: function() {
                var e = this;
                null !== e.controlsTimer && (clearTimeout(e.controlsTimer), delete e.controlsTimer, e.controlsTimer = null)
            },
            controlsEnabled: !0,
            disableControls: function() {
                var e = this;
                e.killControlsTimer(), e.hideControls(!1), this.controlsEnabled = !1
            },
            enableControls: function() {
                var e = this;
                e.showControls(!1), e.controlsEnabled = !0
            },
            meReady: function(e, t) {
                var i, n, s = this,
                    o = mejs.MediaFeatures,
                    a = t.getAttribute("autoplay"),
                    r = !("undefined" == typeof a || null === a || "false" === a);
                if (!s.created) {
                    if (s.created = !0, s.media = e, s.domNode = t, !(o.isAndroid && s.options.AndroidUseNativeControls || o.isiPad && s.options.iPadUseNativeControls || o.isiPhone && s.options.iPhoneUseNativeControls)) {
                        s.buildposter(s, s.controls, s.layers, s.media), s.buildkeyboard(s, s.controls, s.layers, s.media), s.buildoverlays(s, s.controls, s.layers, s.media), s.findTracks();
                        for (i in s.options.features) if (n = s.options.features[i], s["build" + n]) try {
                            s["build" + n](s, s.controls, s.layers, s.media)
                        } catch (l) {}
                        s.container.trigger("controlsready"), s.setPlayerSize(s.width, s.height), s.setControlsSize(), s.isVideo && (mejs.MediaFeatures.hasTouch ? s.$media.bind("touchstart", function() {
                            s.controlsAreVisible ? s.hideControls(!1) : s.controlsEnabled && s.showControls(!1)
                        }) : (mejs.MediaElementPlayer.prototype.clickToPlayPauseCallback = function() {
                            s.options.clickToPlayPause && (s.media.paused ? s.play() : s.pause())
                        }, s.media.addEventListener("click", s.clickToPlayPauseCallback, !1), s.container.bind("mouseenter mouseover", function() {
                            s.controlsEnabled && (s.options.alwaysShowControls || (s.killControlsTimer("enter"), s.showControls(), s.startControlsTimer(2500)))
                        }).bind("mousemove", function() {
                            s.controlsEnabled && (s.controlsAreVisible || s.showControls(), s.options.alwaysShowControls || s.startControlsTimer(2500))
                        }).bind("mouseleave", function() {
                            s.controlsEnabled && (s.media.paused || s.options.alwaysShowControls || s.startControlsTimer(1e3))
                        })), s.options.hideVideoControlsOnLoad && s.hideControls(!1), r && !s.options.alwaysShowControls && s.hideControls(), s.options.enableAutosize && s.media.addEventListener("loadedmetadata", function(e) {
                            s.options.videoHeight <= 0 && null === s.domNode.getAttribute("height") && !isNaN(e.target.videoHeight) && (s.setPlayerSize(e.target.videoWidth, e.target.videoHeight), s.setControlsSize(), s.media.setVideoSize(e.target.videoWidth, e.target.videoHeight))
                        }, !1)), e.addEventListener("play", function() {
                            var e;
                            for (e in mejs.players) {
                                var t = mejs.players[e];
                                t.id == s.id || !s.options.pauseOtherPlayers || t.paused || t.ended || t.pause(), t.hasFocus = !1
                            }
                            s.hasFocus = !0
                        }, !1), s.media.addEventListener("ended", function() {
                            if (s.options.autoRewind) try {
                                s.media.setCurrentTime(0)
                            } catch (e) {}
                            s.media.pause(), s.setProgressRail && s.setProgressRail(), s.setCurrentRail && s.setCurrentRail(), s.options.loop ? s.play() : !s.options.alwaysShowControls && s.controlsEnabled && s.showControls()
                        }, !1), s.media.addEventListener("loadedmetadata", function() {
                            s.updateDuration && s.updateDuration(), s.updateCurrent && s.updateCurrent(), s.isFullScreen || (s.setPlayerSize(s.width, s.height), s.setControlsSize())
                        }, !1), setTimeout(function() {
                            s.setPlayerSize(s.width, s.height), s.setControlsSize()
                        }, 50), s.globalBind("resize", function() {
                            s.isFullScreen || mejs.MediaFeatures.hasTrueNativeFullScreen && document.webkitIsFullScreen || s.setPlayerSize(s.width, s.height), s.setControlsSize()
                        }), "youtube" == s.media.pluginType && s.container.find(".mejs-overlay-play").hide()
                    }
                    r && "native" == e.pluginType && s.play(), s.options.success && ("string" == typeof s.options.success ? window[s.options.success](s.media, s.domNode, s) : s.options.success(s.media, s.domNode, s))
                }
            },
            handleError: function(e) {
                var t = this;
                t.controls.hide(), t.options.error && t.options.error(e)
            },
            setPlayerSize: function(t, i) {
                var n = this;
                if ("undefined" != typeof t && (n.width = t), "undefined" != typeof i && (n.height = i), n.height.toString().indexOf("%") > 0 || "100%" === n.$node.css("max-width") || parseInt(n.$node.css("max-width").replace(/px/, ""), 10) / n.$node.offsetParent().width() === 1 || n.$node[0].currentStyle && "100%" === n.$node[0].currentStyle.maxWidth) {
                    var s = n.isVideo ? n.media.videoWidth && n.media.videoWidth > 0 ? n.media.videoWidth : n.options.defaultVideoWidth : n.options.defaultAudioWidth,
                        o = n.isVideo ? n.media.videoHeight && n.media.videoHeight > 0 ? n.media.videoHeight : n.options.defaultVideoHeight : n.options.defaultAudioHeight,
                        a = n.container.parent().closest(":visible").width(),
                        r = n.isVideo || !n.options.autosizeProgress ? parseInt(a * o / s, 10) : o;
                    "body" === n.container.parent()[0].tagName.toLowerCase() && (a = e(window).width(), r = e(window).height()), 0 != r && 0 != a && (n.container.width(a).height(r), n.$media.add(n.container.find(".mejs-shim")).width("100%").height("100%"), n.isVideo && n.media.setVideoSize && n.media.setVideoSize(a, r), n.layers.children(".mejs-layer").width("100%").height("100%"))
                } else n.container.width(n.width).height(n.height), n.layers.children(".mejs-layer").width(n.width).height(n.height);
                var l = n.layers.find(".mejs-overlay-play"),
                    d = l.find(".mejs-overlay-button");
                l.height(n.container.height() - n.controls.height()), d.css("margin-top", "-" + (d.height() / 2 - n.controls.height() / 2).toString() + "px")
            },
            setControlsSize: function() {
                var t = this,
                    i = 0,
                    n = 0,
                    s = t.controls.find(".mejs-time-rail"),
                    o = t.controls.find(".mejs-time-total"),
                    a = (t.controls.find(".mejs-time-current"), t.controls.find(".mejs-time-loaded"), s.siblings());
                t.options && !t.options.autosizeProgress && (n = parseInt(s.css("width"))), 0 !== n && n || (a.each(function() {
                    var t = e(this);
                    "absolute" != t.css("position") && t.is(":visible") && (i += e(this).outerWidth(!0))
                }), n = t.controls.width() - i - (s.outerWidth(!0) - s.width())), s.width(n), o.width(n - (o.outerWidth(!0) - o.width())), t.setProgressRail && t.setProgressRail(), t.setCurrentRail && t.setCurrentRail()
            },
            buildposter: function(t, i, n, s) {
                var o = this,
                    a = e('<div class="mejs-poster mejs-layer"></div>').appendTo(n),
                    r = t.$media.attr("poster");
                "" !== t.options.poster && (r = t.options.poster), "" !== r && null != r ? o.setPoster(r) : a.hide(), s.addEventListener("play", function() {
                    a.hide()
                }, !1), t.options.showPosterWhenEnded && t.options.autoRewind && s.addEventListener("ended", function() {
                    a.show()
                }, !1)
            },
            setPoster: function(t) {
                var i = this,
                    n = i.container.find(".mejs-poster"),
                    s = n.find("img");
                0 == s.length && (s = e('<img width="100%" height="100%" />').appendTo(n)), s.attr("src", t), n.css({
                    "background-image": "url(" + t + ")"
                })
            },
            buildoverlays: function(t, i, n, s) {
                var o = this;
                if (t.isVideo) {
                    var a = e('<div class="mejs-overlay mejs-layer"><div class="mejs-overlay-loading"><span></span></div></div>').hide().appendTo(n),
                        r = e('<div class="mejs-overlay mejs-layer"><div class="mejs-overlay-error"></div></div>').hide().appendTo(n),
                        l = e('<div class="mejs-overlay mejs-layer mejs-overlay-play"><div class="mejs-overlay-button"></div></div>').appendTo(n).bind("click touchstart", function() {
                            o.options.clickToPlayPause && s.paused && o.play()
                        });
                    s.addEventListener("play", function() {
                        l.hide(), a.hide(), i.find(".mejs-time-buffering").hide(), r.hide()
                    }, !1), s.addEventListener("playing", function() {
                        l.hide(), a.hide(), i.find(".mejs-time-buffering").hide(), r.hide()
                    }, !1), s.addEventListener("seeking", function() {
                        a.show(), i.find(".mejs-time-buffering").show()
                    }, !1), s.addEventListener("seeked", function() {
                        a.hide(), i.find(".mejs-time-buffering").hide()
                    }, !1), s.addEventListener("pause", function() {
                        mejs.MediaFeatures.isiPhone || l.show()
                    }, !1), s.addEventListener("waiting", function() {
                        a.show(), i.find(".mejs-time-buffering").show()
                    }, !1), s.addEventListener("loadeddata", function() {
                        a.show(), i.find(".mejs-time-buffering").show()
                    }, !1), s.addEventListener("canplay", function() {
                        a.hide(), i.find(".mejs-time-buffering").hide()
                    }, !1), s.addEventListener("error", function() {
                        a.hide(), i.find(".mejs-time-buffering").hide(), r.show(), r.find("mejs-overlay-error").html("Error loading this resource")
                    }, !1)
                }
            },
            buildkeyboard: function(t, i, n, s) {
                var o = this;
                o.globalBind("keydown", function(e) {
                    if (t.hasFocus && t.options.enableKeyboard) for (var i = 0, n = t.options.keyActions.length; n > i; i++) for (var o = t.options.keyActions[i], a = 0, r = o.keys.length; r > a; a++) if (e.keyCode == o.keys[a]) return e.preventDefault(), o.action(t, s, e.keyCode), !1;
                    return !0
                }), o.globalBind("click", function(i) {
                    0 == e(i.target).closest(".mejs-container").length && (t.hasFocus = !1)
                })
            },
            findTracks: function() {
                var t = this,
                    i = t.$media.find("track");
                t.tracks = [], i.each(function(i, n) {
                    n = e(n), t.tracks.push({
                        srclang: n.attr("srclang") ? n.attr("srclang").toLowerCase() : "",
                        src: n.attr("src"),
                        kind: n.attr("kind"),
                        label: n.attr("label") || "",
                        entries: [],
                        isLoaded: !1
                    })
                })
            },
            changeSkin: function(e) {
                this.container[0].className = "mejs-container " + e, this.setPlayerSize(this.width, this.height), this.setControlsSize()
            },
            play: function() {
                this.load(), this.media.play()
            },
            pause: function() {
                try {
                    this.media.pause()
                } catch (e) {}
            },
            load: function() {
                this.isLoaded || this.media.load(), this.isLoaded = !0
            },
            setMuted: function(e) {
                this.media.setMuted(e)
            },
            setCurrentTime: function(e) {
                this.media.setCurrentTime(e)
            },
            getCurrentTime: function() {
                return this.media.currentTime
            },
            setVolume: function(e) {
                this.media.setVolume(e)
            },
            getVolume: function() {
                return this.media.volume
            },
            setSrc: function(e) {
                this.media.setSrc(e)
            },
            remove: function() {
                var e, t, i = this;
                for (e in i.options.features) if (t = i.options.features[e], i["clean" + t]) try {
                    i["clean" + t](i)
                } catch (n) {}
                i.isDynamic ? i.$node.insertBefore(i.container) : (i.$media.prop("controls", !0), i.$node.clone().show().insertBefore(i.container), i.$node.remove()), "native" !== i.media.pluginType && i.media.remove(), delete mejs.players[i.id], i.container.remove(), i.globalUnbind(), delete i.node.player
            }
        },
        function() {
            function t(t, n) {
                var s = {
                    d: [],
                    w: []
                };
                return e.each((t || "").split(" "), function(e, t) {
                    var o = t + "." + n;
                    0 === o.indexOf(".") ? (s.d.push(o), s.w.push(o)) : s[i.test(t) ? "w" : "d"].push(o)
                }), s.d = s.d.join(" "), s.w = s.w.join(" "), s
            }
            var i = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;
            mejs.MediaElementPlayer.prototype.globalBind = function(i, n, s) {
                var o = this;
                i = t(i, o.id), i.d && e(document).bind(i.d, n, s), i.w && e(window).bind(i.w, n, s)
            }, mejs.MediaElementPlayer.prototype.globalUnbind = function(i, n) {
                var s = this;
                i = t(i, s.id), i.d && e(document).unbind(i.d, n), i.w && e(window).unbind(i.w, n)
            }
        }(), "undefined" != typeof jQuery && (jQuery.fn.mediaelementplayer = function(e) {
            return this.each(e === !1 ? function() {
                var e = jQuery(this).data("mediaelementplayer");
                e && e.remove(), jQuery(this).removeData("mediaelementplayer")
            } : function() {
                jQuery(this).data("mediaelementplayer", new mejs.MediaElementPlayer(this, e))
            }), this
        }), e(document).ready(function() {
            e(".mejs-player").mediaelementplayer()
        }), window.MediaElementPlayer = mejs.MediaElementPlayer
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            playpauseText: mejs.i18n.t("Play/Pause")
        }), e.extend(MediaElementPlayer.prototype, {
            buildplaypause: function(t, i, n, s) {
                var o = this,
                    a = e('<div class="mejs-button mejs-playpause-button mejs-play" ><button type="button" aria-controls="' + o.id + '" title="' + o.options.playpauseText + '" aria-label="' + o.options.playpauseText + '"></button></div>').appendTo(i).click(function(e) {
                        return e.preventDefault(), s.paused ? s.play() : s.pause(), !1
                    });
                s.addEventListener("play", function() {
                    a.removeClass("mejs-play").addClass("mejs-pause")
                }, !1), s.addEventListener("playing", function() {
                    a.removeClass("mejs-play").addClass("mejs-pause")
                }, !1), s.addEventListener("pause", function() {
                    a.removeClass("mejs-pause").addClass("mejs-play")
                }, !1), s.addEventListener("paused", function() {
                    a.removeClass("mejs-pause").addClass("mejs-play")
                }, !1)
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            stopText: "Stop"
        }), e.extend(MediaElementPlayer.prototype, {
            buildstop: function(t, i, n, s) {
                {
                    var o = this;
                    e('<div class="mejs-button mejs-stop-button mejs-stop"><button type="button" aria-controls="' + o.id + '" title="' + o.options.stopText + '" aria-label="' + o.options.stopText + '"></button></div>').appendTo(i).click(function() {
                        s.paused || s.pause(), s.currentTime > 0 && (s.setCurrentTime(0), s.pause(), i.find(".mejs-time-current").width("0px"), i.find(".mejs-time-handle").css("left", "0px"), i.find(".mejs-time-float-current").html(mejs.Utility.secondsToTimeCode(0)), i.find(".mejs-currenttime").html(mejs.Utility.secondsToTimeCode(0)), n.find(".mejs-poster").show())
                    })
                }
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(MediaElementPlayer.prototype, {
            buildprogress: function(t, i, n, s) {
                e('<div class="mejs-time-rail"><span class="mejs-time-total"><span class="mejs-time-buffering"></span><span class="mejs-time-loaded"></span><span class="mejs-time-current"></span><span class="mejs-time-handle"></span><span class="mejs-time-float"><span class="mejs-time-float-current">00:00</span><span class="mejs-time-float-corner"></span></span></span></div>').appendTo(i), i.find(".mejs-time-buffering").hide();
                var o = this,
                    a = i.find(".mejs-time-total"),
                    r = i.find(".mejs-time-loaded"),
                    l = i.find(".mejs-time-current"),
                    d = i.find(".mejs-time-handle"),
                    u = i.find(".mejs-time-float"),
                    c = i.find(".mejs-time-float-current"),
                    m = function(e) {
                        var t = e.pageX,
                            i = a.offset(),
                            n = a.outerWidth(!0),
                            o = 0,
                            r = 0,
                            l = 0;
                        s.duration && (t < i.left ? t = i.left : t > n + i.left && (t = n + i.left), l = t - i.left, o = l / n, r = .02 >= o ? 0 : o * s.duration, p && r !== s.currentTime && s.setCurrentTime(r), mejs.MediaFeatures.hasTouch || (u.css("left", l), c.html(mejs.Utility.secondsToTimeCode(r)), u.show()))
                    }, p = !1,
                    h = !1;
                a.bind("mousedown", function(e) {
                    return 1 === e.which ? (p = !0, m(e), o.globalBind("mousemove.dur", function(e) {
                        m(e)
                    }), o.globalBind("mouseup.dur", function() {
                        p = !1, u.hide(), o.globalUnbind(".dur")
                    }), !1) : void 0
                }).bind("mouseenter", function() {
                    h = !0, o.globalBind("mousemove.dur", function(e) {
                        m(e)
                    }), mejs.MediaFeatures.hasTouch || u.show()
                }).bind("mouseleave", function() {
                    h = !1, p || (o.globalUnbind(".dur"), u.hide())
                }), s.addEventListener("progress", function(e) {
                    t.setProgressRail(e), t.setCurrentRail(e)
                }, !1), s.addEventListener("timeupdate", function(e) {
                    t.setProgressRail(e), t.setCurrentRail(e)
                }, !1), o.loaded = r, o.total = a, o.current = l, o.handle = d
            },
            setProgressRail: function(e) {
                var t = this,
                    i = void 0 != e ? e.target : t.media,
                    n = null;
                i && i.buffered && i.buffered.length > 0 && i.buffered.end && i.duration ? n = i.buffered.end(0) / i.duration : i && void 0 != i.bytesTotal && i.bytesTotal > 0 && void 0 != i.bufferedBytes ? n = i.bufferedBytes / i.bytesTotal : e && e.lengthComputable && 0 != e.total && (n = e.loaded / e.total), null !== n && (n = Math.min(1, Math.max(0, n)), t.loaded && t.total && t.loaded.width(t.total.width() * n))
            },
            setCurrentRail: function() {
                var e = this;
                if (void 0 != e.media.currentTime && e.media.duration && e.total && e.handle) {
                    var t = Math.round(e.total.width() * e.media.currentTime / e.media.duration),
                        i = t - Math.round(e.handle.outerWidth(!0) / 2);
                    e.current.width(t), e.handle.css("left", i)
                }
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            duration: -1,
            timeAndDurationSeparator: "<span> | </span>"
        }), e.extend(MediaElementPlayer.prototype, {
            buildcurrent: function(t, i, n, s) {
                var o = this;
                e('<div class="mejs-time"><span class="mejs-currenttime">' + (t.options.alwaysShowHours ? "00:" : "") + (t.options.showTimecodeFrameCount ? "00:00:00" : "00:00") + "</span></div>").appendTo(i), o.currenttime = o.controls.find(".mejs-currenttime"), s.addEventListener("timeupdate", function() {
                    t.updateCurrent()
                }, !1)
            },
            buildduration: function(t, i, n, s) {
                var o = this;
                i.children().last().find(".mejs-currenttime").length > 0 ? e(o.options.timeAndDurationSeparator + '<span class="mejs-duration">' + (o.options.duration > 0 ? mejs.Utility.secondsToTimeCode(o.options.duration, o.options.alwaysShowHours || o.media.duration > 3600, o.options.showTimecodeFrameCount, o.options.framesPerSecond || 25) : (t.options.alwaysShowHours ? "00:" : "") + (t.options.showTimecodeFrameCount ? "00:00:00" : "00:00")) + "</span>").appendTo(i.find(".mejs-time")) : (i.find(".mejs-currenttime").parent().addClass("mejs-currenttime-container"), e('<div class="mejs-time mejs-duration-container"><span class="mejs-duration">' + (o.options.duration > 0 ? mejs.Utility.secondsToTimeCode(o.options.duration, o.options.alwaysShowHours || o.media.duration > 3600, o.options.showTimecodeFrameCount, o.options.framesPerSecond || 25) : (t.options.alwaysShowHours ? "00:" : "") + (t.options.showTimecodeFrameCount ? "00:00:00" : "00:00")) + "</span></div>").appendTo(i)), o.durationD = o.controls.find(".mejs-duration"), s.addEventListener("timeupdate", function() {
                    t.updateDuration()
                }, !1)
            },
            updateCurrent: function() {
                var e = this;
                e.currenttime && e.currenttime.html(mejs.Utility.secondsToTimeCode(e.media.currentTime, e.options.alwaysShowHours || e.media.duration > 3600, e.options.showTimecodeFrameCount, e.options.framesPerSecond || 25))
            },
            updateDuration: function() {
                var e = this;
                e.container.toggleClass("mejs-long-video", e.media.duration > 3600), e.durationD && (e.options.duration > 0 || e.media.duration) && e.durationD.html(mejs.Utility.secondsToTimeCode(e.options.duration > 0 ? e.options.duration : e.media.duration, e.options.alwaysShowHours, e.options.showTimecodeFrameCount, e.options.framesPerSecond || 25))
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            muteText: mejs.i18n.t("Mute Toggle"),
            hideVolumeOnTouchDevices: !0,
            audioVolume: "horizontal",
            videoVolume: "vertical"
        }), e.extend(MediaElementPlayer.prototype, {
            buildvolume: function(t, i, n, s) {
                if (!mejs.MediaFeatures.hasTouch || !this.options.hideVolumeOnTouchDevices) {
                    var o = this,
                        a = o.isVideo ? o.options.videoVolume : o.options.audioVolume,
                        r = "horizontal" == a ? e('<div class="mejs-button mejs-volume-button mejs-mute"><button type="button" aria-controls="' + o.id + '" title="' + o.options.muteText + '" aria-label="' + o.options.muteText + '"></button></div><div class="mejs-horizontal-volume-slider"><div class="mejs-horizontal-volume-total"></div><div class="mejs-horizontal-volume-current"></div><div class="mejs-horizontal-volume-handle"></div></div>').appendTo(i) : e('<div class="mejs-button mejs-volume-button mejs-mute"><button type="button" aria-controls="' + o.id + '" title="' + o.options.muteText + '" aria-label="' + o.options.muteText + '"></button><div class="mejs-volume-slider"><div class="mejs-volume-total"></div><div class="mejs-volume-current"></div><div class="mejs-volume-handle"></div></div></div>').appendTo(i),
                        l = o.container.find(".mejs-volume-slider, .mejs-horizontal-volume-slider"),
                        d = o.container.find(".mejs-volume-total, .mejs-horizontal-volume-total"),
                        u = o.container.find(".mejs-volume-current, .mejs-horizontal-volume-current"),
                        c = o.container.find(".mejs-volume-handle, .mejs-horizontal-volume-handle"),
                        m = function(e, t) {
                            if (!l.is(":visible") && "undefined" == typeof t) return l.show(), m(e, !0), void l.hide();
                            if (e = Math.max(0, e), e = Math.min(e, 1), 0 == e ? r.removeClass("mejs-mute").addClass("mejs-unmute") : r.removeClass("mejs-unmute").addClass("mejs-mute"), "vertical" == a) {
                                var i = d.height(),
                                    n = d.position(),
                                    s = i - i * e;
                                c.css("top", Math.round(n.top + s - c.height() / 2)), u.height(i - s), u.css("top", n.top + s)
                            } else {
                                var o = d.width(),
                                    n = d.position(),
                                    p = o * e;
                                c.css("left", Math.round(n.left + p - c.width() / 2)), u.width(Math.round(p))
                            }
                        }, p = function(e) {
                            var t = null,
                                i = d.offset();
                            if ("vertical" == a) {
                                var n = d.height(),
                                    o = (parseInt(d.css("top").replace(/px/, ""), 10), e.pageY - i.top);
                                if (t = (n - o) / n, 0 == i.top || 0 == i.left) return
                            } else {
                                var r = d.width(),
                                    l = e.pageX - i.left;
                                t = l / r
                            }
                            t = Math.max(0, t), t = Math.min(t, 1), m(t), s.setMuted(0 == t ? !0 : !1), s.setVolume(t)
                        }, h = !1,
                        f = !1;
                    r.hover(function() {
                        l.show(), f = !0
                    }, function() {
                        f = !1, h || "vertical" != a || l.hide()
                    }), l.bind("mouseover", function() {
                        f = !0
                    }).bind("mousedown", function(e) {
                        return p(e), o.globalBind("mousemove.vol", function(e) {
                            p(e)
                        }), o.globalBind("mouseup.vol", function() {
                            h = !1, o.globalUnbind(".vol"), f || "vertical" != a || l.hide()
                        }), h = !0, !1
                    }), r.find("button").click(function() {
                        s.setMuted(!s.muted)
                    }), s.addEventListener("volumechange", function() {
                        h || (s.muted ? (m(0), r.removeClass("mejs-mute").addClass("mejs-unmute")) : (m(s.volume), r.removeClass("mejs-unmute").addClass("mejs-mute")))
                    }, !1), o.container.is(":visible") && (m(t.options.startVolume), 0 === t.options.startVolume && s.setMuted(!0), "native" === s.pluginType && s.setVolume(t.options.startVolume))
                }
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            usePluginFullScreen: !0,
            newWindowCallback: function() {
                return ""
            },
            fullscreenText: mejs.i18n.t("Fullscreen")
        }), e.extend(MediaElementPlayer.prototype, {
            isFullScreen: !1,
            isNativeFullScreen: !1,
            isInIframe: !1,
            buildfullscreen: function(t, i, n, s) {
                if (t.isVideo) {
                    if (t.isInIframe = window.location != window.parent.location, mejs.MediaFeatures.hasTrueNativeFullScreen) {
                        var o = function() {
                            t.isFullScreen && (mejs.MediaFeatures.isFullScreen() ? (t.isNativeFullScreen = !0, t.setControlsSize()) : (t.isNativeFullScreen = !1, t.exitFullScreen()))
                        };
                        mejs.MediaFeatures.hasMozNativeFullScreen ? t.globalBind(mejs.MediaFeatures.fullScreenEventName, o) : t.container.bind(mejs.MediaFeatures.fullScreenEventName, o)
                    }
                    var a = this,
                        r = (t.container, e('<div class="mejs-button mejs-fullscreen-button"><button type="button" aria-controls="' + a.id + '" title="' + a.options.fullscreenText + '" aria-label="' + a.options.fullscreenText + '"></button></div>').appendTo(i));
                    if ("native" === a.media.pluginType || !a.options.usePluginFullScreen && !mejs.MediaFeatures.isFirefox) r.click(function() {
                        var e = mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen() || t.isFullScreen;
                        e ? t.exitFullScreen() : t.enterFullScreen()
                    });
                    else {
                        var l = null,
                            d = function() {
                                var e, t = document.createElement("x"),
                                    i = document.documentElement,
                                    n = window.getComputedStyle;
                                return "pointerEvents" in t.style ? (t.style.pointerEvents = "auto", t.style.pointerEvents = "x", i.appendChild(t), e = n && "auto" === n(t, "").pointerEvents, i.removeChild(t), !! e) : !1
                            }();
                        if (d && !mejs.MediaFeatures.isOpera) {
                            var u, c, m = !1,
                                p = function() {
                                    if (m) {
                                        for (var e in h) h[e].hide();
                                        r.css("pointer-events", ""), a.controls.css("pointer-events", ""), a.media.removeEventListener("click", a.clickToPlayPauseCallback), m = !1
                                    }
                                }, h = {}, f = ["top", "left", "right", "bottom"],
                                v = function() {
                                    var e = r.offset().left - a.container.offset().left,
                                        t = r.offset().top - a.container.offset().top,
                                        i = r.outerWidth(!0),
                                        n = r.outerHeight(!0),
                                        s = a.container.width(),
                                        o = a.container.height();
                                    for (u in h) h[u].css({
                                        position: "absolute",
                                        top: 0,
                                        left: 0
                                    });
                                    h.top.width(s).height(t), h.left.width(e).height(n).css({
                                        top: t
                                    }), h.right.width(s - e - i).height(n).css({
                                        top: t,
                                        left: e + i
                                    }), h.bottom.width(s).height(o - n - t).css({
                                        top: t + n
                                    })
                                };
                            for (a.globalBind("resize", function() {
                                v()
                            }), u = 0, c = f.length; c > u; u++) h[f[u]] = e('<div class="mejs-fullscreen-hover" />').appendTo(a.container).mouseover(p).hide();
                            r.on("mouseover", function() {
                                if (!a.isFullScreen) {
                                    var e = r.offset(),
                                        i = t.container.offset();
                                    s.positionFullscreenButton(e.left - i.left, e.top - i.top, !1), r.css("pointer-events", "none"), a.controls.css("pointer-events", "none"), a.media.addEventListener("click", a.clickToPlayPauseCallback);
                                    for (u in h) h[u].show();
                                    v(), m = !0
                                }
                            }), s.addEventListener("fullscreenchange", function() {
                                a.isFullScreen = !a.isFullScreen, a.isFullScreen ? a.media.removeEventListener("click", a.clickToPlayPauseCallback) : a.media.addEventListener("click", a.clickToPlayPauseCallback), p()
                            }), a.globalBind("mousemove", function(e) {
                                if (m) {
                                    var t = r.offset();
                                    (e.pageY < t.top || e.pageY > t.top + r.outerHeight(!0) || e.pageX < t.left || e.pageX > t.left + r.outerWidth(!0)) && (r.css("pointer-events", ""), a.controls.css("pointer-events", ""), m = !1)
                                }
                            })
                        } else r.on("mouseover", function() {
                            null !== l && (clearTimeout(l), delete l);
                            var e = r.offset(),
                                i = t.container.offset();
                            s.positionFullscreenButton(e.left - i.left, e.top - i.top, !0)
                        }).on("mouseout", function() {
                            null !== l && (clearTimeout(l), delete l), l = setTimeout(function() {
                                s.hideFullscreenButton()
                            }, 1500)
                        })
                    }
                    t.fullscreenBtn = r, a.globalBind("keydown", function(e) {
                        (mejs.MediaFeatures.hasTrueNativeFullScreen && mejs.MediaFeatures.isFullScreen() || a.isFullScreen) && 27 == e.keyCode && t.exitFullScreen()
                    })
                }
            },
            cleanfullscreen: function(e) {
                e.exitFullScreen()
            },
            containerSizeTimeout: null,
            enterFullScreen: function() {
                var t = this;
                if ("native" === t.media.pluginType || !mejs.MediaFeatures.isFirefox && !t.options.usePluginFullScreen) {
                    if (e(document.documentElement).addClass("mejs-fullscreen"), normalHeight = t.container.height(), normalWidth = t.container.width(), "native" === t.media.pluginType) if (mejs.MediaFeatures.hasTrueNativeFullScreen) mejs.MediaFeatures.requestFullScreen(t.container[0]), t.isInIframe && setTimeout(function n() {
                        t.isNativeFullScreen && (e(window).width() !== screen.width ? t.exitFullScreen() : setTimeout(n, 500))
                    }, 500);
                    else if (mejs.MediaFeatures.hasSemiNativeFullScreen) return void t.media.webkitEnterFullscreen();
                    if (t.isInIframe) {
                        var i = t.options.newWindowCallback(this);
                        if ("" !== i) {
                            if (!mejs.MediaFeatures.hasTrueNativeFullScreen) return t.pause(), void window.open(i, t.id, "top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight + ",resizable=yes,scrollbars=no,status=no,toolbar=no");
                            setTimeout(function() {
                                t.isNativeFullScreen || (t.pause(), window.open(i, t.id, "top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight + ",resizable=yes,scrollbars=no,status=no,toolbar=no"))
                            }, 250)
                        }
                    }
                    t.container.addClass("mejs-container-fullscreen").width("100%").height("100%"), t.containerSizeTimeout = setTimeout(function() {
                        t.container.css({
                            width: "100%",
                            height: "100%"
                        }), t.setControlsSize()
                    }, 500), "native" === t.media.pluginType ? t.$media.width("100%").height("100%") : (t.container.find(".mejs-shim").width("100%").height("100%"), t.media.setVideoSize(e(window).width(), e(window).height())), t.layers.children("div").width("100%").height("100%"), t.fullscreenBtn && t.fullscreenBtn.removeClass("mejs-fullscreen").addClass("mejs-unfullscreen"), t.setControlsSize(), t.isFullScreen = !0
                }
            },
            exitFullScreen: function() {
                var t = this;
                return clearTimeout(t.containerSizeTimeout), "native" !== t.media.pluginType && mejs.MediaFeatures.isFirefox ? void t.media.setFullscreen(!1) : (mejs.MediaFeatures.hasTrueNativeFullScreen && (mejs.MediaFeatures.isFullScreen() || t.isFullScreen) && mejs.MediaFeatures.cancelFullScreen(), e(document.documentElement).removeClass("mejs-fullscreen"), t.container.removeClass("mejs-container-fullscreen").width(normalWidth).height(normalHeight), "native" === t.media.pluginType ? t.$media.width(normalWidth).height(normalHeight) : (t.container.find(".mejs-shim").width(normalWidth).height(normalHeight), t.media.setVideoSize(normalWidth, normalHeight)), t.layers.children("div").width(normalWidth).height(normalHeight), t.fullscreenBtn.removeClass("mejs-unfullscreen").addClass("mejs-fullscreen"), t.setControlsSize(), void(t.isFullScreen = !1))
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            startLanguage: "",
            tracksText: mejs.i18n.t("Captions/Subtitles"),
            hideCaptionsButtonWhenEmpty: !0,
            toggleCaptionsButtonWhenOnlyOne: !1,
            slidesSelector: ""
        }), e.extend(MediaElementPlayer.prototype, {
            hasChapters: !1,
            buildtracks: function(t, i, n, s) {
                if (0 != t.tracks.length) {
                    var o, a = this;
                    if (a.domNode.textTracks) for (var o = a.domNode.textTracks.length - 1; o >= 0; o--) a.domNode.textTracks[o].mode = "hidden";
                    t.chapters = e('<div class="mejs-chapters mejs-layer"></div>').prependTo(n).hide(), t.captions = e('<div class="mejs-captions-layer mejs-layer"><div class="mejs-captions-position mejs-captions-position-hover"><span class="mejs-captions-text"></span></div></div>').prependTo(n).hide(), t.captionsText = t.captions.find(".mejs-captions-text"), t.captionsButton = e('<div class="mejs-button mejs-captions-button"><button type="button" aria-controls="' + a.id + '" title="' + a.options.tracksText + '" aria-label="' + a.options.tracksText + '"></button><div class="mejs-captions-selector"><ul><li><input type="radio" name="' + t.id + '_captions" id="' + t.id + '_captions_none" value="none" checked="checked" /><label for="' + t.id + '_captions_none">' + mejs.i18n.t("None") + "</label></li></ul></div></div>").appendTo(i);
                    var r = 0;
                    for (o = 0; o < t.tracks.length; o++) "subtitles" == t.tracks[o].kind && r++;
                    for (a.options.toggleCaptionsButtonWhenOnlyOne && 1 == r ? t.captionsButton.on("click", function() {
                        if (null == t.selectedTrack) var e = t.tracks[0].srclang;
                        else var e = "none";
                        t.setTrack(e)
                    }) : t.captionsButton.hover(function() {
                        e(this).find(".mejs-captions-selector").css("visibility", "visible")
                    }, function() {
                        e(this).find(".mejs-captions-selector").css("visibility", "hidden")
                    }).on("click", "input[type=radio]", function() {
                        lang = this.value, t.setTrack(lang)
                    }), t.options.alwaysShowControls ? t.container.find(".mejs-captions-position").addClass("mejs-captions-position-hover") : t.container.bind("controlsshown", function() {
                        t.container.find(".mejs-captions-position").addClass("mejs-captions-position-hover")
                    }).bind("controlshidden", function() {
                        s.paused || t.container.find(".mejs-captions-position").removeClass("mejs-captions-position-hover")
                    }), t.trackToLoad = -1, t.selectedTrack = null, t.isLoadingTrack = !1, o = 0; o < t.tracks.length; o++) "subtitles" == t.tracks[o].kind && t.addTrackButton(t.tracks[o].srclang, t.tracks[o].label);
                    t.loadNextTrack(), s.addEventListener("timeupdate", function() {
                        t.displayCaptions()
                    }, !1), "" != t.options.slidesSelector && (t.slidesContainer = e(t.options.slidesSelector), s.addEventListener("timeupdate", function() {
                        t.displaySlides()
                    }, !1)), s.addEventListener("loadedmetadata", function() {
                        t.displayChapters()
                    }, !1), t.container.hover(function() {
                        t.hasChapters && (t.chapters.css("visibility", "visible"), t.chapters.fadeIn(200).height(t.chapters.find(".mejs-chapter").outerHeight()))
                    }, function() {
                        t.hasChapters && !s.paused && t.chapters.fadeOut(200, function() {
                            e(this).css("visibility", "hidden"), e(this).css("display", "block")
                        })
                    }), null !== t.node.getAttribute("autoplay") && t.chapters.css("visibility", "hidden")
                }
            },
            setTrack: function(e) {
                var t, i = this;
                if ("none" == e) i.selectedTrack = null, i.captionsButton.removeClass("mejs-captions-enabled");
                else for (t = 0; t < i.tracks.length; t++) if (i.tracks[t].srclang == e) {
                    null == i.selectedTrack && i.captionsButton.addClass("mejs-captions-enabled"), i.selectedTrack = i.tracks[t], i.captions.attr("lang", i.selectedTrack.srclang), i.displayCaptions();
                    break
                }
            },
            loadNextTrack: function() {
                var e = this;
                e.trackToLoad++, e.trackToLoad < e.tracks.length ? (e.isLoadingTrack = !0, e.loadTrack(e.trackToLoad)) : (e.isLoadingTrack = !1, e.checkForTracks())
            },
            loadTrack: function(t) {
                var i = this,
                    n = i.tracks[t],
                    s = function() {
                        n.isLoaded = !0, i.enableTrackButton(n.srclang, n.label), i.loadNextTrack()
                    };
                e.ajax({
                    url: n.src,
                    dataType: "text",
                    success: function(e) {
                        n.entries = "string" == typeof e && /<tt\s+xml/gi.exec(e) ? mejs.TrackFormatParser.dfxp.parse(e) : mejs.TrackFormatParser.webvvt.parse(e), s(), "chapters" == n.kind && i.media.addEventListener("play", function() {
                            i.media.duration > 0 && i.displayChapters(n)
                        }, !1), "slides" == n.kind && i.setupSlides(n)
                    },
                    error: function() {
                        i.loadNextTrack()
                    }
                })
            },
            enableTrackButton: function(t, i) {
                var n = this;
                "" === i && (i = mejs.language.codes[t] || t), n.captionsButton.find("input[value=" + t + "]").prop("disabled", !1).siblings("label").html(i), n.options.startLanguage == t && e("#" + n.id + "_captions_" + t).click(), n.adjustLanguageBox()
            },
            addTrackButton: function(t, i) {
                var n = this;
                "" === i && (i = mejs.language.codes[t] || t), n.captionsButton.find("ul").append(e('<li><input type="radio" name="' + n.id + '_captions" id="' + n.id + "_captions_" + t + '" value="' + t + '" disabled="disabled" /><label for="' + n.id + "_captions_" + t + '">' + i + " (loading)</label></li>")), n.adjustLanguageBox(), n.container.find(".mejs-captions-translations option[value=" + t + "]").remove()
            },
            adjustLanguageBox: function() {
                var e = this;
                e.captionsButton.find(".mejs-captions-selector").height(e.captionsButton.find(".mejs-captions-selector ul").outerHeight(!0) + e.captionsButton.find(".mejs-captions-translations").outerHeight(!0))
            },
            checkForTracks: function() {
                var e = this,
                    t = !1;
                if (e.options.hideCaptionsButtonWhenEmpty) {
                    for (i = 0; i < e.tracks.length; i++) if ("subtitles" == e.tracks[i].kind) {
                        t = !0;
                        break
                    }
                    t || (e.captionsButton.hide(), e.setControlsSize())
                }
            },
            displayCaptions: function() {
                if ("undefined" != typeof this.tracks) {
                    var e, t = this,
                        i = t.selectedTrack;
                    if (null != i && i.isLoaded) {
                        for (e = 0; e < i.entries.times.length; e++) if (t.media.currentTime >= i.entries.times[e].start && t.media.currentTime <= i.entries.times[e].stop) return t.captionsText.html(i.entries.text[e]), void t.captions.show().height(0);
                        t.captions.hide()
                    } else t.captions.hide()
                }
            },
            setupSlides: function(e) {
                var t = this;
                t.slides = e, t.slides.entries.imgs = [t.slides.entries.text.length], t.showSlide(0)
            },
            showSlide: function(t) {
                if ("undefined" != typeof this.tracks && "undefined" != typeof this.slidesContainer) {
                    var i = this,
                        n = i.slides.entries.text[t],
                        s = i.slides.entries.imgs[t];
                    "undefined" == typeof s || "undefined" == typeof s.fadeIn ? i.slides.entries.imgs[t] = s = e('<img src="' + n + '">').on("load", function() {
                        s.appendTo(i.slidesContainer).hide().fadeIn().siblings(":visible").fadeOut()
                    }) : s.is(":visible") || s.is(":animated") || s.fadeIn().siblings(":visible").fadeOut()
                }
            },
            displaySlides: function() {
                if ("undefined" != typeof this.slides) {
                    var e, t = this,
                        i = t.slides;
                    for (e = 0; e < i.entries.times.length; e++) if (t.media.currentTime >= i.entries.times[e].start && t.media.currentTime <= i.entries.times[e].stop) return void t.showSlide(e)
                }
            },
            displayChapters: function() {
                var e, t = this;
                for (e = 0; e < t.tracks.length; e++) if ("chapters" == t.tracks[e].kind && t.tracks[e].isLoaded) {
                    t.drawChapters(t.tracks[e]), t.hasChapters = !0;
                    break
                }
            },
            drawChapters: function(t) {
                var i, n, s = this,
                    o = 0,
                    a = 0;
                for (s.chapters.empty(), i = 0; i < t.entries.times.length; i++) n = t.entries.times[i].stop - t.entries.times[i].start, o = Math.floor(n / s.media.duration * 100), (o + a > 100 || i == t.entries.times.length - 1 && 100 > o + a) && (o = 100 - a), s.chapters.append(e('<div class="mejs-chapter" rel="' + t.entries.times[i].start + '" style="left: ' + a.toString() + "%;width: " + o.toString() + '%;"><div class="mejs-chapter-block' + (i == t.entries.times.length - 1 ? " mejs-chapter-block-last" : "") + '"><span class="ch-title">' + t.entries.text[i] + '</span><span class="ch-time">' + mejs.Utility.secondsToTimeCode(t.entries.times[i].start) + "–" + mejs.Utility.secondsToTimeCode(t.entries.times[i].stop) + "</span></div></div>")), a += o;
                s.chapters.find("div.mejs-chapter").click(function() {
                    s.media.setCurrentTime(parseFloat(e(this).attr("rel"))), s.media.paused && s.media.play()
                }), s.chapters.show()
            }
        }), mejs.language = {
            codes: {
                af: "Afrikaans",
                sq: "Albanian",
                ar: "Arabic",
                be: "Belarusian",
                bg: "Bulgarian",
                ca: "Catalan",
                zh: "Chinese",
                "zh-cn": "Chinese Simplified",
                "zh-tw": "Chinese Traditional",
                hr: "Croatian",
                cs: "Czech",
                da: "Danish",
                nl: "Dutch",
                en: "English",
                et: "Estonian",
                tl: "Filipino",
                fi: "Finnish",
                fr: "French",
                gl: "Galician",
                de: "German",
                el: "Greek",
                ht: "Haitian Creole",
                iw: "Hebrew",
                hi: "Hindi",
                hu: "Hungarian",
                is: "Icelandic",
                id: "Indonesian",
                ga: "Irish",
                it: "Italian",
                ja: "Japanese",
                ko: "Korean",
                lv: "Latvian",
                lt: "Lithuanian",
                mk: "Macedonian",
                ms: "Malay",
                mt: "Maltese",
                no: "Norwegian",
                fa: "Persian",
                pl: "Polish",
                pt: "Portuguese",
                ro: "Romanian",
                ru: "Russian",
                sr: "Serbian",
                sk: "Slovak",
                sl: "Slovenian",
                es: "Spanish",
                sw: "Swahili",
                sv: "Swedish",
                tl: "Tagalog",
                th: "Thai",
                tr: "Turkish",
                uk: "Ukrainian",
                vi: "Vietnamese",
                cy: "Welsh",
                yi: "Yiddish"
            }
        }, mejs.TrackFormatParser = {
            webvvt: {
                pattern_identifier: /^([a-zA-z]+-)?[0-9]+$/,
                pattern_timecode: /^([0-9]{2}:[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ([0-9]{2}:[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/,
                parse: function(t) {
                    for (var i, n, s = 0, o = mejs.TrackFormatParser.split2(t, /\r?\n/), a = {
                        text: [],
                        times: []
                    }; s < o.length; s++) if (this.pattern_identifier.exec(o[s]) && (s++, i = this.pattern_timecode.exec(o[s]), i && s < o.length)) {
                        for (s++, n = o[s], s++;
                        "" !== o[s] && s < o.length;) n = n + "\n" + o[s], s++;
                        n = e.trim(n).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi, "<a href='$1' target='_blank'>$1</a>"), a.text.push(n), a.times.push({
                            start: 0 == mejs.Utility.convertSMPTEtoSeconds(i[1]) ? .2 : mejs.Utility.convertSMPTEtoSeconds(i[1]),
                            stop: mejs.Utility.convertSMPTEtoSeconds(i[3]),
                            settings: i[5]
                        })
                    }
                    return a
                }
            },
            dfxp: {
                parse: function(t) {
                    t = e(t).filter("tt");
                    var i, n, s = 0,
                        o = t.children("div").eq(0),
                        a = o.find("p"),
                        r = t.find("#" + o.attr("style")),
                        l = {
                            text: [],
                            times: []
                        };
                    if (r.length) {
                        var d = r.removeAttr("id").get(0).attributes;
                        if (d.length) for (i = {}, s = 0; s < d.length; s++) i[d[s].name.split(":")[1]] = d[s].value
                    }
                    for (s = 0; s < a.length; s++) {
                        var u, c = {
                            start: null,
                            stop: null,
                            style: null
                        };
                        if (a.eq(s).attr("begin") && (c.start = mejs.Utility.convertSMPTEtoSeconds(a.eq(s).attr("begin"))), !c.start && a.eq(s - 1).attr("end") && (c.start = mejs.Utility.convertSMPTEtoSeconds(a.eq(s - 1).attr("end"))), a.eq(s).attr("end") && (c.stop = mejs.Utility.convertSMPTEtoSeconds(a.eq(s).attr("end"))), !c.stop && a.eq(s + 1).attr("begin") && (c.stop = mejs.Utility.convertSMPTEtoSeconds(a.eq(s + 1).attr("begin"))), i) {
                            u = "";
                            for (var m in i) u += m + ":" + i[m] + ";"
                        }
                        u && (c.style = u), 0 == c.start && (c.start = .2), l.times.push(c), n = e.trim(a.eq(s).html()).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi, "<a href='$1' target='_blank'>$1</a>"), l.text.push(n), 0 == l.times.start && (l.times.start = 2)
                    }
                    return l
                }
            },
            split2: function(e, t) {
                return e.split(t)
            }
        }, 3 != "x\n\ny".split(/\n/gi).length && (mejs.TrackFormatParser.split2 = function(e, t) {
            var i, n = [],
                s = "";
            for (i = 0; i < e.length; i++) s += e.substring(i, i + 1), t.test(s) && (n.push(s.replace(t, "")), s = "");
            return n.push(s), n
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            contextMenuItems: [{
                render: function(e) {
                    return "undefined" == typeof e.enterFullScreen ? null : mejs.i18n.t(e.isFullScreen ? "Turn off Fullscreen" : "Go Fullscreen")
                },
                click: function(e) {
                    e.isFullScreen ? e.exitFullScreen() : e.enterFullScreen()
                }
            }, {
                render: function(e) {
                    return mejs.i18n.t(e.media.muted ? "Unmute" : "Mute")
                },
                click: function(e) {
                    e.setMuted(e.media.muted ? !1 : !0)
                }
            }, {
                isSeparator: !0
            }, {
                render: function() {
                    return mejs.i18n.t("Download Video")
                },
                click: function(e) {
                    window.location.href = e.media.currentSrc
                }
            }]
        }), e.extend(MediaElementPlayer.prototype, {
            buildcontextmenu: function(t) {
                t.contextMenu = e('<div class="mejs-contextmenu"></div>').appendTo(e("body")).hide(), t.container.bind("contextmenu", function(e) {
                    return t.isContextMenuEnabled ? (e.preventDefault(), t.renderContextMenu(e.clientX - 1, e.clientY - 1), !1) : void 0
                }), t.container.bind("click", function() {
                    t.contextMenu.hide()
                }), t.contextMenu.bind("mouseleave", function() {
                    t.startContextMenuTimer()
                })
            },
            cleancontextmenu: function(e) {
                e.contextMenu.remove()
            },
            isContextMenuEnabled: !0,
            enableContextMenu: function() {
                this.isContextMenuEnabled = !0
            },
            disableContextMenu: function() {
                this.isContextMenuEnabled = !1
            },
            contextMenuTimeout: null,
            startContextMenuTimer: function() {
                var e = this;
                e.killContextMenuTimer(), e.contextMenuTimer = setTimeout(function() {
                    e.hideContextMenu(), e.killContextMenuTimer()
                }, 750)
            },
            killContextMenuTimer: function() {
                var e = this.contextMenuTimer;
                null != e && (clearTimeout(e), delete e, e = null)
            },
            hideContextMenu: function() {
                this.contextMenu.hide()
            },
            renderContextMenu: function(t, i) {
                for (var n = this, s = "", o = n.options.contextMenuItems, a = 0, r = o.length; r > a; a++) if (o[a].isSeparator) s += '<div class="mejs-contextmenu-separator"></div>';
                else {
                    var l = o[a].render(n);
                    null != l && (s += '<div class="mejs-contextmenu-item" data-itemindex="' + a + '" id="element-' + 1e6 * Math.random() + '">' + l + "</div>")
                }
                n.contextMenu.empty().append(e(s)).css({
                    top: i,
                    left: t
                }).show(), n.contextMenu.find(".mejs-contextmenu-item").each(function() {
                    var t = e(this),
                        i = parseInt(t.data("itemindex"), 10),
                        s = n.options.contextMenuItems[i];
                    "undefined" != typeof s.show && s.show(t, n), t.click(function() {
                        "undefined" != typeof s.click && s.click(n), n.contextMenu.hide()
                    })
                }), setTimeout(function() {
                    n.killControlsTimer("rev3")
                }, 100)
            }
        })
    }(mejs.$),
    function(e) {
        e.extend(mejs.MepDefaults, {
            postrollCloseText: mejs.i18n.t("Close")
        }), e.extend(MediaElementPlayer.prototype, {
            buildpostroll: function(t, i, n) {
                var s = this,
                    o = s.container.find('link[rel="postroll"]').attr("href");
                "undefined" != typeof o && (t.postroll = e('<div class="mejs-postroll-layer mejs-layer"><a class="mejs-postroll-close" onclick="$(this).parent().hide();return false;">' + s.options.postrollCloseText + '</a><div class="mejs-postroll-layer-content"></div></div>').prependTo(n).hide(), s.media.addEventListener("ended", function() {
                    e.ajax({
                        dataType: "html",
                        url: o,
                        success: function(e) {
                            n.find(".mejs-postroll-layer-content").html(e)
                        }
                    }), t.postroll.show()
                }, !1))
            }
        })
    }(mejs.$)
});
(function(e) {
    function t() {
        return {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1
        }
    }
    function a(e, t) {
        return function(a) {
            return o(e.call(this, a), t)
        }
    }
    function n(e, t) {
        return function(a) {
            return this.lang().ordinal(e.call(this, a), t)
        }
    }
    function _() {}
    function s(e) {
        k(e), d(this, e)
    }
    function r(e) {
        var t = c(e),
            a = t.year || 0,
            n = t.month || 0,
            _ = t.week || 0,
            s = t.day || 0,
            r = t.hour || 0,
            d = t.minute || 0,
            i = t.second || 0,
            u = t.millisecond || 0;
        this._milliseconds = +u + 1e3 * i + 6e4 * d + 36e5 * r, this._days = +s + 7 * _, this._months = +n + 12 * a, this._data = {}, this._bubble()
    }
    function d(e, t) {
        for (var a in t) t.hasOwnProperty(a) && (e[a] = t[a]);
        return t.hasOwnProperty("toString") && (e.toString = t.toString), t.hasOwnProperty("valueOf") && (e.valueOf = t.valueOf), e
    }
    function i(e) {
        var t, a = {};
        for (t in e) e.hasOwnProperty(t) && ct.hasOwnProperty(t) && (a[t] = e[t]);
        return a
    }
    function u(e) {
        return 0 > e ? Math.ceil(e) : Math.floor(e)
    }
    function o(e, t, a) {
        for (var n = "" + Math.abs(e), _ = e >= 0; n.length < t;) n = "0" + n;
        return (_ ? a ? "+" : "" : "-") + n
    }
    function l(e, t, a, n) {
        var _, s, r = t._milliseconds,
            d = t._days,
            i = t._months;
        r && e._d.setTime(+e._d + r * a), (d || i) && (_ = e.minute(), s = e.hour()), d && e.date(e.date() + d * a), i && e.month(e.month() + i * a), r && !n && nt.updateOffset(e), (d || i) && (e.minute(_), e.hour(s))
    }
    function m(e) {
        return "[object Array]" === Object.prototype.toString.call(e)
    }
    function M(e) {
        return "[object Date]" === Object.prototype.toString.call(e) || e instanceof Date
    }
    function L(e, t, a) {
        var n, _ = Math.min(e.length, t.length),
            s = Math.abs(e.length - t.length),
            r = 0;
        for (n = 0; _ > n; n++)(a && e[n] !== t[n] || !a && y(e[n]) !== y(t[n])) && r++;
        return r + s
    }
    function h(e) {
        if (e) {
            var t = e.toLowerCase().replace(/(.)s$/, "$1");
            e = Vt[e] || Zt[t] || t
        }
        return e
    }
    function c(e) {
        var t, a, n = {};
        for (a in e) e.hasOwnProperty(a) && (t = h(a), t && (n[t] = e[a]));
        return n
    }
    function Y(t) {
        var a, n;
        if (0 === t.indexOf("week")) a = 7, n = "day";
        else {
            if (0 !== t.indexOf("month")) return;
            a = 12, n = "month"
        }
        nt[t] = function(_, s) {
            var r, d, i = nt.fn._lang[t],
                u = [];
            if ("number" == typeof _ && (s = _, _ = e), d = function(e) {
                var t = nt().utc().set(n, e);
                return i.call(nt.fn._lang, t, _ || "")
            }, null != s) return d(s);
            for (r = 0; a > r; r++) u.push(d(r));
            return u
        }
    }
    function y(e) {
        var t = +e,
            a = 0;
        return 0 !== t && isFinite(t) && (a = t >= 0 ? Math.floor(t) : Math.ceil(t)), a
    }
    function f(e, t) {
        return new Date(Date.UTC(e, t + 1, 0)).getUTCDate()
    }
    function p(e) {
        return D(e) ? 366 : 365
    }
    function D(e) {
        return e % 4 === 0 && e % 100 !== 0 || e % 400 === 0
    }
    function k(e) {
        var t;
        e._a && -2 === e._pf.overflow && (t = e._a[ut] < 0 || e._a[ut] > 11 ? ut : e._a[ot] < 1 || e._a[ot] > f(e._a[it], e._a[ut]) ? ot : e._a[lt] < 0 || e._a[lt] > 23 ? lt : e._a[mt] < 0 || e._a[mt] > 59 ? mt : e._a[Mt] < 0 || e._a[Mt] > 59 ? Mt : e._a[Lt] < 0 || e._a[Lt] > 999 ? Lt : -1, e._pf._overflowDayOfYear && (it > t || t > ot) && (t = ot), e._pf.overflow = t)
    }
    function T(e) {
        return null == e._isValid && (e._isValid = !isNaN(e._d.getTime()) && e._pf.overflow < 0 && !e._pf.empty && !e._pf.invalidMonth && !e._pf.nullInput && !e._pf.invalidFormat && !e._pf.userInvalidated, e._strict && (e._isValid = e._isValid && 0 === e._pf.charsLeftOver && 0 === e._pf.unusedTokens.length)), e._isValid
    }
    function g(e) {
        return e ? e.toLowerCase().replace("_", "-") : e
    }
    function w(e, t) {
        return t._isUTC ? nt(e).zone(t._offset || 0) : nt(e).local()
    }
    function v(e, t) {
        return t.abbr = e, ht[e] || (ht[e] = new _), ht[e].set(t), ht[e]
    }
    function b(e) {
        delete ht[e]
    }
    function S(e) {
        var t, a, n, _, s = 0,
            r = function(e) {
                if (!ht[e] && Yt) try {
                    require("./lang/" + e)
                } catch (t) {}
                return ht[e]
            };
        if (!e) return nt.fn._lang;
        if (!m(e)) {
            if (a = r(e)) return a;
            e = [e]
        }
        for (; s < e.length;) {
            for (_ = g(e[s]).split("-"), t = _.length, n = g(e[s + 1]), n = n ? n.split("-") : null; t > 0;) {
                if (a = r(_.slice(0, t).join("-"))) return a;
                if (n && n.length >= t && L(_, n, !0) >= t - 1) break;
                t--
            }
            s++
        }
        return nt.fn._lang
    }
    function j(e) {
        return e.match(/\[[\s\S]/) ? e.replace(/^\[|\]$/g, "") : e.replace(/\\/g, "")
    }
    function W(e) {
        var t, a, n = e.match(Dt);
        for (t = 0, a = n.length; a > t; t++) n[t] = Xt[n[t]] ? Xt[n[t]] : j(n[t]);
        return function(_) {
            var s = "";
            for (t = 0; a > t; t++) s += n[t] instanceof Function ? n[t].call(_, e) : n[t];
            return s
        }
    }
    function x(e, t) {
        return e.isValid() ? (t = z(t, e.lang()), Kt[t] || (Kt[t] = W(t)), Kt[t](e)) : e.lang().invalidDate()
    }
    function z(e, t) {
        function a(e) {
            return t.longDateFormat(e) || e
        }
        var n = 5;
        for (kt.lastIndex = 0; n >= 0 && kt.test(e);) e = e.replace(kt, a), kt.lastIndex = 0, n -= 1;
        return e
    }
    function H(e, t) {
        var a, n = t._strict;
        switch (e) {
            case "DDDD":
                return Ft;
            case "YYYY":
            case "GGGG":
            case "gggg":
                return n ? Et : wt;
            case "Y":
            case "G":
            case "g":
                return Ot;
            case "YYYYYY":
            case "YYYYY":
            case "GGGGG":
            case "ggggg":
                return n ? At : vt;
            case "S":
                if (n) return zt;
            case "SS":
                if (n) return Ht;
            case "SSS":
                if (n) return Ft;
            case "DDD":
                return gt;
            case "MMM":
            case "MMMM":
            case "dd":
            case "ddd":
            case "dddd":
                return St;
            case "a":
            case "A":
                return S(t._l)._meridiemParse;
            case "X":
                return xt;
            case "Z":
            case "ZZ":
                return jt;
            case "T":
                return Wt;
            case "SSSS":
                return bt;
            case "MM":
            case "DD":
            case "YY":
            case "GG":
            case "gg":
            case "HH":
            case "hh":
            case "mm":
            case "ss":
            case "ww":
            case "WW":
                return n ? Ht : Tt;
            case "M":
            case "D":
            case "d":
            case "H":
            case "h":
            case "m":
            case "s":
            case "w":
            case "W":
            case "e":
            case "E":
                return Tt;
            default:
                return a = new RegExp(C(P(e.replace("\\", "")), "i"))
        }
    }
    function F(e) {
        e = e || "";
        var t = e.match(jt) || [],
            a = t[t.length - 1] || [],
            n = (a + "").match(Nt) || ["-", 0, 0],
            _ = +(60 * n[1]) + y(n[2]);
        return "+" === n[0] ? -_ : _
    }
    function E(e, t, a) {
        var n, _ = a._a;
        switch (e) {
            case "M":
            case "MM":
                null != t && (_[ut] = y(t) - 1);
                break;
            case "MMM":
            case "MMMM":
                n = S(a._l).monthsParse(t), null != n ? _[ut] = n : a._pf.invalidMonth = t;
                break;
            case "D":
            case "DD":
                null != t && (_[ot] = y(t));
                break;
            case "DDD":
            case "DDDD":
                null != t && (a._dayOfYear = y(t));
                break;
            case "YY":
                _[it] = y(t) + (y(t) > 68 ? 1900 : 2e3);
                break;
            case "YYYY":
            case "YYYYY":
            case "YYYYYY":
                _[it] = y(t);
                break;
            case "a":
            case "A":
                a._isPm = S(a._l).isPM(t);
                break;
            case "H":
            case "HH":
            case "h":
            case "hh":
                _[lt] = y(t);
                break;
            case "m":
            case "mm":
                _[mt] = y(t);
                break;
            case "s":
            case "ss":
                _[Mt] = y(t);
                break;
            case "S":
            case "SS":
            case "SSS":
            case "SSSS":
                _[Lt] = y(1e3 * ("0." + t));
                break;
            case "X":
                a._d = new Date(1e3 * parseFloat(t));
                break;
            case "Z":
            case "ZZ":
                a._useUTC = !0, a._tzm = F(t);
                break;
            case "w":
            case "ww":
            case "W":
            case "WW":
            case "d":
            case "dd":
            case "ddd":
            case "dddd":
            case "e":
            case "E":
                e = e.substr(0, 1);
            case "gg":
            case "gggg":
            case "GG":
            case "GGGG":
            case "GGGGG":
                e = e.substr(0, 2), t && (a._w = a._w || {}, a._w[e] = t)
        }
    }
    function A(e) {
        var t, a, n, _, s, r, d, i, u, o, l = [];
        if (!e._d) {
            for (n = J(e), e._w && null == e._a[ot] && null == e._a[ut] && (s = function(t) {
                var a = parseInt(t, 10);
                return t ? t.length < 3 ? a > 68 ? 1900 + a : 2e3 + a : a : null == e._a[it] ? nt().weekYear() : e._a[it]
            }, r = e._w, null != r.GG || null != r.W || null != r.E ? d = q(s(r.GG), r.W || 1, r.E, 4, 1) : (i = S(e._l), u = null != r.d ? K(r.d, i) : null != r.e ? parseInt(r.e, 10) + i._week.dow : 0, o = parseInt(r.w, 10) || 1, null != r.d && u < i._week.dow && o++, d = q(s(r.gg), o, u, i._week.doy, i._week.dow)), e._a[it] = d.year, e._dayOfYear = d.dayOfYear), e._dayOfYear && (_ = null == e._a[it] ? n[it] : e._a[it], e._dayOfYear > p(_) && (e._pf._overflowDayOfYear = !0), a = Z(_, 0, e._dayOfYear), e._a[ut] = a.getUTCMonth(), e._a[ot] = a.getUTCDate()), t = 0; 3 > t && null == e._a[t]; ++t) e._a[t] = l[t] = n[t];
            for (; 7 > t; t++) e._a[t] = l[t] = null == e._a[t] ? 2 === t ? 1 : 0 : e._a[t];
            l[lt] += y((e._tzm || 0) / 60), l[mt] += y((e._tzm || 0) % 60), e._d = (e._useUTC ? Z : V).apply(null, l)
        }
    }
    function O(e) {
        var t;
        e._d || (t = c(e._i), e._a = [t.year, t.month, t.day, t.hour, t.minute, t.second, t.millisecond], A(e))
    }
    function J(e) {
        var t = new Date;
        return e._useUTC ? [t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()] : [t.getFullYear(), t.getMonth(), t.getDate()]
    }
    function G(e) {
        e._a = [], e._pf.empty = !0;
        var t, a, n, _, s, r = S(e._l),
            d = "" + e._i,
            i = d.length,
            u = 0;
        for (n = z(e._f, r).match(Dt) || [], t = 0; t < n.length; t++) _ = n[t], a = (d.match(H(_, e)) || [])[0], a && (s = d.substr(0, d.indexOf(a)), s.length > 0 && e._pf.unusedInput.push(s), d = d.slice(d.indexOf(a) + a.length), u += a.length), Xt[_] ? (a ? e._pf.empty = !1 : e._pf.unusedTokens.push(_), E(_, a, e)) : e._strict && !a && e._pf.unusedTokens.push(_);
        e._pf.charsLeftOver = i - u, d.length > 0 && e._pf.unusedInput.push(d), e._isPm && e._a[lt] < 12 && (e._a[lt] += 12), e._isPm === !1 && 12 === e._a[lt] && (e._a[lt] = 0), A(e), k(e)
    }
    function P(e) {
        return e.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(e, t, a, n, _) {
            return t || a || n || _
        })
    }
    function C(e) {
        return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }
    function N(e) {
        var a, n, _, s, r;
        if (0 === e._f.length) return e._pf.invalidFormat = !0, void(e._d = new Date(0 / 0));
        for (s = 0; s < e._f.length; s++) r = 0, a = d({}, e), a._pf = t(), a._f = e._f[s], G(a), T(a) && (r += a._pf.charsLeftOver, r += 10 * a._pf.unusedTokens.length, a._pf.score = r, (null == _ || _ > r) && (_ = r, n = a));
        d(e, n || a)
    }
    function I(e) {
        var t, a, n = e._i,
            _ = Jt.exec(n);
        if (_) {
            for (e._pf.iso = !0, t = 0, a = Pt.length; a > t; t++) if (Pt[t][1].exec(n)) {
                e._f = Pt[t][0] + (_[6] || " ");
                break
            }
            for (t = 0, a = Ct.length; a > t; t++) if (Ct[t][1].exec(n)) {
                e._f += Ct[t][0];
                break
            }
            n.match(jt) && (e._f += "Z"), G(e)
        } else e._d = new Date(n)
    }
    function U(t) {
        var a = t._i,
            n = yt.exec(a);
        a === e ? t._d = new Date : n ? t._d = new Date(+n[1]) : "string" == typeof a ? I(t) : m(a) ? (t._a = a.slice(0), A(t)) : M(a) ? t._d = new Date(+a) : "object" == typeof a ? O(t) : t._d = new Date(a)
    }
    function V(e, t, a, n, _, s, r) {
        var d = new Date(e, t, a, n, _, s, r);
        return 1970 > e && d.setFullYear(e), d
    }
    function Z(e) {
        var t = new Date(Date.UTC.apply(null, arguments));
        return 1970 > e && t.setUTCFullYear(e), t
    }
    function K(e, t) {
        if ("string" == typeof e) if (isNaN(e)) {
            if (e = t.weekdaysParse(e), "number" != typeof e) return null
        } else e = parseInt(e, 10);
        return e
    }
    function $(e, t, a, n, _) {
        return _.relativeTime(t || 1, !! a, e, n)
    }
    function R(e, t, a) {
        var n = dt(Math.abs(e) / 1e3),
            _ = dt(n / 60),
            s = dt(_ / 60),
            r = dt(s / 24),
            d = dt(r / 365),
            i = 45 > n && ["s", n] || 1 === _ && ["m"] || 45 > _ && ["mm", _] || 1 === s && ["h"] || 22 > s && ["hh", s] || 1 === r && ["d"] || 25 >= r && ["dd", r] || 45 >= r && ["M"] || 345 > r && ["MM", dt(r / 30)] || 1 === d && ["y"] || ["yy", d];
        return i[2] = t, i[3] = e > 0, i[4] = a, $.apply({}, i)
    }
    function X(e, t, a) {
        var n, _ = a - t,
            s = a - e.day();
        return s > _ && (s -= 7), _ - 7 > s && (s += 7), n = nt(e).add("d", s), {
            week: Math.ceil(n.dayOfYear() / 7),
            year: n.year()
        }
    }
    function q(e, t, a, n, _) {
        var s, r, d = Z(e, 0, 1).getUTCDay();
        return a = null != a ? a : _, s = _ - d + (d > n ? 7 : 0) - (_ > d ? 7 : 0), r = 7 * (t - 1) + (a - _) + s + 1, {
            year: r > 0 ? e : e - 1,
            dayOfYear: r > 0 ? r : p(e - 1) + r
        }
    }
    function Q(e) {
        var t = e._i,
            a = e._f;
        return null === t ? nt.invalid({
            nullInput: !0
        }) : ("string" == typeof t && (e._i = t = S().preparse(t)), nt.isMoment(t) ? (e = i(t), e._d = new Date(+t._d)) : a ? m(a) ? N(e) : G(e) : U(e), new s(e))
    }
    function B(e, t) {
        nt.fn[e] = nt.fn[e + "s"] = function(e) {
            var a = this._isUTC ? "UTC" : "";
            return null != e ? (this._d["set" + a + t](e), nt.updateOffset(this), this) : this._d["get" + a + t]()
        }
    }
    function et(e) {
        nt.duration.fn[e] = function() {
            return this._data[e]
        }
    }
    function tt(e, t) {
        nt.duration.fn["as" + e] = function() {
            return +this / t
        }
    }
    function at(e) {
        var t = !1,
            a = nt;
        "undefined" == typeof ender && (e ? (rt.moment = function() {
            return !t && console && console.warn && (t = !0, console.warn("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.")), a.apply(null, arguments)
        }, d(rt.moment, a)) : rt.moment = nt)
    }
    for (var nt, _t, st = "2.5.1", rt = this, dt = Math.round, it = 0, ut = 1, ot = 2, lt = 3, mt = 4, Mt = 5, Lt = 6, ht = {}, ct = {
        _isAMomentObject: null,
        _i: null,
        _f: null,
        _l: null,
        _strict: null,
        _isUTC: null,
        _offset: null,
        _pf: null,
        _lang: null
    }, Yt = "undefined" != typeof module && module.exports && "undefined" != typeof require, yt = /^\/?Date\((\-?\d+)/i, ft = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, pt = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/, Dt = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g, kt = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, Tt = /\d\d?/, gt = /\d{1,3}/, wt = /\d{1,4}/, vt = /[+\-]?\d{1,6}/, bt = /\d+/, St = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, jt = /Z|[\+\-]\d\d:?\d\d/gi, Wt = /T/i, xt = /[\+\-]?\d+(\.\d{1,3})?/, zt = /\d/, Ht = /\d\d/, Ft = /\d{3}/, Et = /\d{4}/, At = /[+-]?\d{6}/, Ot = /[+-]?\d+/, Jt = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, Gt = "YYYY-MM-DDTHH:mm:ssZ", Pt = [
        ["YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/],
        ["YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/],
        ["GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/],
        ["GGGG-[W]WW", /\d{4}-W\d{2}/],
        ["YYYY-DDD", /\d{4}-\d{3}/]
    ], Ct = [
        ["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
        ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/],
        ["HH:mm", /(T| )\d\d:\d\d/],
        ["HH", /(T| )\d\d/]
    ], Nt = /([\+\-]|\d\d)/gi, It = "Date|Hours|Minutes|Seconds|Milliseconds".split("|"), Ut = {
        Milliseconds: 1,
        Seconds: 1e3,
        Minutes: 6e4,
        Hours: 36e5,
        Days: 864e5,
        Months: 2592e6,
        Years: 31536e6
    }, Vt = {
        ms: "millisecond",
        s: "second",
        m: "minute",
        h: "hour",
        d: "day",
        D: "date",
        w: "week",
        W: "isoWeek",
        M: "month",
        y: "year",
        DDD: "dayOfYear",
        e: "weekday",
        E: "isoWeekday",
        gg: "weekYear",
        GG: "isoWeekYear"
    }, Zt = {
        dayofyear: "dayOfYear",
        isoweekday: "isoWeekday",
        isoweek: "isoWeek",
        weekyear: "weekYear",
        isoweekyear: "isoWeekYear"
    }, Kt = {}, $t = "DDD w W M D d".split(" "), Rt = "M D H h m s w W".split(" "), Xt = {
        M: function() {
            return this.month() + 1
        },
        MMM: function(e) {
            return this.lang().monthsShort(this, e)
        },
        MMMM: function(e) {
            return this.lang().months(this, e)
        },
        D: function() {
            return this.date()
        },
        DDD: function() {
            return this.dayOfYear()
        },
        d: function() {
            return this.day()
        },
        dd: function(e) {
            return this.lang().weekdaysMin(this, e)
        },
        ddd: function(e) {
            return this.lang().weekdaysShort(this, e)
        },
        dddd: function(e) {
            return this.lang().weekdays(this, e)
        },
        w: function() {
            return this.week()
        },
        W: function() {
            return this.isoWeek()
        },
        YY: function() {
            return o(this.year() % 100, 2)
        },
        YYYY: function() {
            return o(this.year(), 4)
        },
        YYYYY: function() {
            return o(this.year(), 5)
        },
        YYYYYY: function() {
            var e = this.year(),
                t = e >= 0 ? "+" : "-";
            return t + o(Math.abs(e), 6)
        },
        gg: function() {
            return o(this.weekYear() % 100, 2)
        },
        gggg: function() {
            return o(this.weekYear(), 4)
        },
        ggggg: function() {
            return o(this.weekYear(), 5)
        },
        GG: function() {
            return o(this.isoWeekYear() % 100, 2)
        },
        GGGG: function() {
            return o(this.isoWeekYear(), 4)
        },
        GGGGG: function() {
            return o(this.isoWeekYear(), 5)
        },
        e: function() {
            return this.weekday()
        },
        E: function() {
            return this.isoWeekday()
        },
        a: function() {
            return this.lang().meridiem(this.hours(), this.minutes(), !0)
        },
        A: function() {
            return this.lang().meridiem(this.hours(), this.minutes(), !1)
        },
        H: function() {
            return this.hours()
        },
        h: function() {
            return this.hours() % 12 || 12
        },
        m: function() {
            return this.minutes()
        },
        s: function() {
            return this.seconds()
        },
        S: function() {
            return y(this.milliseconds() / 100)
        },
        SS: function() {
            return o(y(this.milliseconds() / 10), 2)
        },
        SSS: function() {
            return o(this.milliseconds(), 3)
        },
        SSSS: function() {
            return o(this.milliseconds(), 3)
        },
        Z: function() {
            var e = -this.zone(),
                t = "+";
            return 0 > e && (e = -e, t = "-"), t + o(y(e / 60), 2) + ":" + o(y(e) % 60, 2)
        },
        ZZ: function() {
            var e = -this.zone(),
                t = "+";
            return 0 > e && (e = -e, t = "-"), t + o(y(e / 60), 2) + o(y(e) % 60, 2)
        },
        z: function() {
            return this.zoneAbbr()
        },
        zz: function() {
            return this.zoneName()
        },
        X: function() {
            return this.unix()
        },
        Q: function() {
            return this.quarter()
        }
    }, qt = ["months", "monthsShort", "weekdays", "weekdaysShort", "weekdaysMin"]; $t.length;) _t = $t.pop(), Xt[_t + "o"] = n(Xt[_t], _t);
    for (; Rt.length;) _t = Rt.pop(), Xt[_t + _t] = a(Xt[_t], 2);
    for (Xt.DDDD = a(Xt.DDD, 3), d(_.prototype, {
        set: function(e) {
            var t, a;
            for (a in e) t = e[a], "function" == typeof t ? this[a] = t : this["_" + a] = t
        },
        _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months: function(e) {
            return this._months[e.month()]
        },
        _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort: function(e) {
            return this._monthsShort[e.month()]
        },
        monthsParse: function(e) {
            var t, a, n;
            for (this._monthsParse || (this._monthsParse = []), t = 0; 12 > t; t++) if (this._monthsParse[t] || (a = nt.utc([2e3, t]), n = "^" + this.months(a, "") + "|^" + this.monthsShort(a, ""), this._monthsParse[t] = new RegExp(n.replace(".", ""), "i")), this._monthsParse[t].test(e)) return t
        },
        _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays: function(e) {
            return this._weekdays[e.day()]
        },
        _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort: function(e) {
            return this._weekdaysShort[e.day()]
        },
        _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin: function(e) {
            return this._weekdaysMin[e.day()]
        },
        weekdaysParse: function(e) {
            var t, a, n;
            for (this._weekdaysParse || (this._weekdaysParse = []), t = 0; 7 > t; t++) if (this._weekdaysParse[t] || (a = nt([2e3, 1]).day(t), n = "^" + this.weekdays(a, "") + "|^" + this.weekdaysShort(a, "") + "|^" + this.weekdaysMin(a, ""), this._weekdaysParse[t] = new RegExp(n.replace(".", ""), "i")), this._weekdaysParse[t].test(e)) return t
        },
        _longDateFormat: {
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D YYYY",
            LLL: "MMMM D YYYY LT",
            LLLL: "dddd, MMMM D YYYY LT"
        },
        longDateFormat: function(e) {
            var t = this._longDateFormat[e];
            return !t && this._longDateFormat[e.toUpperCase()] && (t = this._longDateFormat[e.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(e) {
                return e.slice(1)
            }), this._longDateFormat[e] = t), t
        },
        isPM: function(e) {
            return "p" === (e + "").toLowerCase().charAt(0)
        },
        _meridiemParse: /[ap]\.?m?\.?/i,
        meridiem: function(e, t, a) {
            return e > 11 ? a ? "pm" : "PM" : a ? "am" : "AM"
        },
        _calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[Last] dddd [at] LT",
            sameElse: "L"
        },
        calendar: function(e, t) {
            var a = this._calendar[e];
            return "function" == typeof a ? a.apply(t) : a
        },
        _relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        relativeTime: function(e, t, a, n) {
            var _ = this._relativeTime[a];
            return "function" == typeof _ ? _(e, t, a, n) : _.replace(/%d/i, e)
        },
        pastFuture: function(e, t) {
            var a = this._relativeTime[e > 0 ? "future" : "past"];
            return "function" == typeof a ? a(t) : a.replace(/%s/i, t)
        },
        ordinal: function(e) {
            return this._ordinal.replace("%d", e)
        },
        _ordinal: "%d",
        preparse: function(e) {
            return e
        },
        postformat: function(e) {
            return e
        },
        week: function(e) {
            return X(e, this._week.dow, this._week.doy).week
        },
        _week: {
            dow: 0,
            doy: 6
        },
        _invalidDate: "Invalid date",
        invalidDate: function() {
            return this._invalidDate
        }
    }), nt = function(a, n, _, s) {
        var r;
        return "boolean" == typeof _ && (s = _, _ = e), r = {}, r._isAMomentObject = !0, r._i = a, r._f = n, r._l = _, r._strict = s, r._isUTC = !1, r._pf = t(), Q(r)
    }, nt.utc = function(a, n, _, s) {
        var r;
        return "boolean" == typeof _ && (s = _, _ = e), r = {}, r._isAMomentObject = !0, r._useUTC = !0, r._isUTC = !0, r._l = _, r._i = a, r._f = n, r._strict = s, r._pf = t(), Q(r).utc()
    }, nt.unix = function(e) {
        return nt(1e3 * e)
    }, nt.duration = function(e, t) {
        var a, n, _, s = e,
            d = null;
        return nt.isDuration(e) ? s = {
            ms: e._milliseconds,
            d: e._days,
            M: e._months
        } : "number" == typeof e ? (s = {}, t ? s[t] = e : s.milliseconds = e) : (d = ft.exec(e)) ? (a = "-" === d[1] ? -1 : 1, s = {
            y: 0,
            d: y(d[ot]) * a,
            h: y(d[lt]) * a,
            m: y(d[mt]) * a,
            s: y(d[Mt]) * a,
            ms: y(d[Lt]) * a
        }) : (d = pt.exec(e)) && (a = "-" === d[1] ? -1 : 1, _ = function(e) {
            var t = e && parseFloat(e.replace(",", "."));
            return (isNaN(t) ? 0 : t) * a
        }, s = {
            y: _(d[2]),
            M: _(d[3]),
            d: _(d[4]),
            h: _(d[5]),
            m: _(d[6]),
            s: _(d[7]),
            w: _(d[8])
        }), n = new r(s), nt.isDuration(e) && e.hasOwnProperty("_lang") && (n._lang = e._lang), n
    }, nt.version = st, nt.defaultFormat = Gt, nt.updateOffset = function() {}, nt.lang = function(e, t) {
        var a;
        return e ? (t ? v(g(e), t) : null === t ? (b(e), e = "en") : ht[e] || S(e), a = nt.duration.fn._lang = nt.fn._lang = S(e), a._abbr) : nt.fn._lang._abbr
    }, nt.langData = function(e) {
        return e && e._lang && e._lang._abbr && (e = e._lang._abbr), S(e)
    }, nt.isMoment = function(e) {
        return e instanceof s || null != e && e.hasOwnProperty("_isAMomentObject")
    }, nt.isDuration = function(e) {
        return e instanceof r
    }, _t = qt.length - 1; _t >= 0; --_t) Y(qt[_t]);
    for (nt.normalizeUnits = function(e) {
        return h(e)
    }, nt.invalid = function(e) {
        var t = nt.utc(0 / 0);
        return null != e ? d(t._pf, e) : t._pf.userInvalidated = !0, t
    }, nt.parseZone = function(e) {
        return nt(e).parseZone()
    }, d(nt.fn = s.prototype, {
        clone: function() {
            return nt(this)
        },
        valueOf: function() {
            return +this._d + 6e4 * (this._offset || 0)
        },
        unix: function() {
            return Math.floor(+this / 1e3)
        },
        toString: function() {
            return this.clone().lang("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        },
        toDate: function() {
            return this._offset ? new Date(+this) : this._d
        },
        toISOString: function() {
            var e = nt(this).utc();
            return 0 < e.year() && e.year() <= 9999 ? x(e, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : x(e, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        },
        toArray: function() {
            var e = this;
            return [e.year(), e.month(), e.date(), e.hours(), e.minutes(), e.seconds(), e.milliseconds()]
        },
        isValid: function() {
            return T(this)
        },
        isDSTShifted: function() {
            return this._a ? this.isValid() && L(this._a, (this._isUTC ? nt.utc(this._a) : nt(this._a)).toArray()) > 0 : !1
        },
        parsingFlags: function() {
            return d({}, this._pf)
        },
        invalidAt: function() {
            return this._pf.overflow
        },
        utc: function() {
            return this.zone(0)
        },
        local: function() {
            return this.zone(0), this._isUTC = !1, this
        },
        format: function(e) {
            var t = x(this, e || nt.defaultFormat);
            return this.lang().postformat(t)
        },
        add: function(e, t) {
            var a;
            return a = "string" == typeof e ? nt.duration(+t, e) : nt.duration(e, t), l(this, a, 1), this
        },
        subtract: function(e, t) {
            var a;
            return a = "string" == typeof e ? nt.duration(+t, e) : nt.duration(e, t), l(this, a, - 1), this
        },
        diff: function(e, t, a) {
            var n, _, s = w(e, this),
                r = 6e4 * (this.zone() - s.zone());
            return t = h(t), "year" === t || "month" === t ? (n = 432e5 * (this.daysInMonth() + s.daysInMonth()), _ = 12 * (this.year() - s.year()) + (this.month() - s.month()), _ += (this - nt(this).startOf("month") - (s - nt(s).startOf("month"))) / n, _ -= 6e4 * (this.zone() - nt(this).startOf("month").zone() - (s.zone() - nt(s).startOf("month").zone())) / n, "year" === t && (_ /= 12)) : (n = this - s, _ = "second" === t ? n / 1e3 : "minute" === t ? n / 6e4 : "hour" === t ? n / 36e5 : "day" === t ? (n - r) / 864e5 : "week" === t ? (n - r) / 6048e5 : n), a ? _ : u(_)
        },
        from: function(e, t) {
            return nt.duration(this.diff(e)).lang(this.lang()._abbr).humanize(!t)
        },
        fromNow: function(e) {
            return this.from(nt(), e)
        },
        calendar: function() {
            var e = w(nt(), this).startOf("day"),
                t = this.diff(e, "days", !0),
                a = -6 > t ? "sameElse" : -1 > t ? "lastWeek" : 0 > t ? "lastDay" : 1 > t ? "sameDay" : 2 > t ? "nextDay" : 7 > t ? "nextWeek" : "sameElse";
            return this.format(this.lang().calendar(a, this))
        },
        isLeapYear: function() {
            return D(this.year())
        },
        isDST: function() {
            return this.zone() < this.clone().month(0).zone() || this.zone() < this.clone().month(5).zone()
        },
        day: function(e) {
            var t = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return null != e ? (e = K(e, this.lang()), this.add({
                d: e - t
            })) : t
        },
        month: function(e) {
            var t, a = this._isUTC ? "UTC" : "";
            return null != e ? "string" == typeof e && (e = this.lang().monthsParse(e), "number" != typeof e) ? this : (t = this.date(), this.date(1), this._d["set" + a + "Month"](e), this.date(Math.min(t, this.daysInMonth())), nt.updateOffset(this), this) : this._d["get" + a + "Month"]()
        },
        startOf: function(e) {
            switch (e = h(e)) {
                case "year":
                    this.month(0);
                case "month":
                    this.date(1);
                case "week":
                case "isoWeek":
                case "day":
                    this.hours(0);
                case "hour":
                    this.minutes(0);
                case "minute":
                    this.seconds(0);
                case "second":
                    this.milliseconds(0)
            }
            return "week" === e ? this.weekday(0) : "isoWeek" === e && this.isoWeekday(1), this
        },
        endOf: function(e) {
            return e = h(e), this.startOf(e).add("isoWeek" === e ? "week" : e, 1).subtract("ms", 1)
        },
        isAfter: function(e, t) {
            return t = "undefined" != typeof t ? t : "millisecond", + this.clone().startOf(t) > +nt(e).startOf(t)
        },
        isBefore: function(e, t) {
            return t = "undefined" != typeof t ? t : "millisecond", + this.clone().startOf(t) < +nt(e).startOf(t)
        },
        isSame: function(e, t) {
            return t = t || "ms", + this.clone().startOf(t) === +w(e, this).startOf(t)
        },
        min: function(e) {
            return e = nt.apply(null, arguments), this > e ? this : e
        },
        max: function(e) {
            return e = nt.apply(null, arguments), e > this ? this : e
        },
        zone: function(e) {
            var t = this._offset || 0;
            return null == e ? this._isUTC ? t : this._d.getTimezoneOffset() : ("string" == typeof e && (e = F(e)), Math.abs(e) < 16 && (e = 60 * e), this._offset = e, this._isUTC = !0, t !== e && l(this, nt.duration(t - e, "m"), 1, !0), this)
        },
        zoneAbbr: function() {
            return this._isUTC ? "UTC" : ""
        },
        zoneName: function() {
            return this._isUTC ? "Coordinated Universal Time" : ""
        },
        parseZone: function() {
            return this._tzm ? this.zone(this._tzm) : "string" == typeof this._i && this.zone(this._i), this
        },
        hasAlignedHourOffset: function(e) {
            return e = e ? nt(e).zone() : 0, (this.zone() - e) % 60 === 0
        },
        daysInMonth: function() {
            return f(this.year(), this.month())
        },
        dayOfYear: function(e) {
            var t = dt((nt(this).startOf("day") - nt(this).startOf("year")) / 864e5) + 1;
            return null == e ? t : this.add("d", e - t)
        },
        quarter: function() {
            return Math.ceil((this.month() + 1) / 3)
        },
        weekYear: function(e) {
            var t = X(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return null == e ? t : this.add("y", e - t)
        },
        isoWeekYear: function(e) {
            var t = X(this, 1, 4).year;
            return null == e ? t : this.add("y", e - t)
        },
        week: function(e) {
            var t = this.lang().week(this);
            return null == e ? t : this.add("d", 7 * (e - t))
        },
        isoWeek: function(e) {
            var t = X(this, 1, 4).week;
            return null == e ? t : this.add("d", 7 * (e - t))
        },
        weekday: function(e) {
            var t = (this.day() + 7 - this.lang()._week.dow) % 7;
            return null == e ? t : this.add("d", e - t)
        },
        isoWeekday: function(e) {
            return null == e ? this.day() || 7 : this.day(this.day() % 7 ? e : e - 7)
        },
        get: function(e) {
            return e = h(e), this[e]()
        },
        set: function(e, t) {
            return e = h(e), "function" == typeof this[e] && this[e](t), this
        },
        lang: function(t) {
            return t === e ? this._lang : (this._lang = S(t), this)
        }
    }), _t = 0; _t < It.length; _t++) B(It[_t].toLowerCase().replace(/s$/, ""), It[_t]);
    B("year", "FullYear"), nt.fn.days = nt.fn.day, nt.fn.months = nt.fn.month, nt.fn.weeks = nt.fn.week, nt.fn.isoWeeks = nt.fn.isoWeek, nt.fn.toJSON = nt.fn.toISOString, d(nt.duration.fn = r.prototype, {
        _bubble: function() {
            var e, t, a, n, _ = this._milliseconds,
                s = this._days,
                r = this._months,
                d = this._data;
            d.milliseconds = _ % 1e3, e = u(_ / 1e3), d.seconds = e % 60, t = u(e / 60), d.minutes = t % 60, a = u(t / 60), d.hours = a % 24, s += u(a / 24), d.days = s % 30, r += u(s / 30), d.months = r % 12, n = u(r / 12), d.years = n
        },
        weeks: function() {
            return u(this.days() / 7)
        },
        valueOf: function() {
            return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * y(this._months / 12)
        },
        humanize: function(e) {
            var t = +this,
                a = R(t, !e, this.lang());
            return e && (a = this.lang().pastFuture(t, a)), this.lang().postformat(a)
        },
        add: function(e, t) {
            var a = nt.duration(e, t);
            return this._milliseconds += a._milliseconds, this._days += a._days, this._months += a._months, this._bubble(), this
        },
        subtract: function(e, t) {
            var a = nt.duration(e, t);
            return this._milliseconds -= a._milliseconds, this._days -= a._days, this._months -= a._months, this._bubble(), this
        },
        get: function(e) {
            return e = h(e), this[e.toLowerCase() + "s"]()
        },
        as: function(e) {
            return e = h(e), this["as" + e.charAt(0).toUpperCase() + e.slice(1) + "s"]()
        },
        lang: nt.fn.lang,
        toIsoString: function() {
            var e = Math.abs(this.years()),
                t = Math.abs(this.months()),
                a = Math.abs(this.days()),
                n = Math.abs(this.hours()),
                _ = Math.abs(this.minutes()),
                s = Math.abs(this.seconds() + this.milliseconds() / 1e3);
            return this.asSeconds() ? (this.asSeconds() < 0 ? "-" : "") + "P" + (e ? e + "Y" : "") + (t ? t + "M" : "") + (a ? a + "D" : "") + (n || _ || s ? "T" : "") + (n ? n + "H" : "") + (_ ? _ + "M" : "") + (s ? s + "S" : "") : "P0D"
        }
    });
    for (_t in Ut) Ut.hasOwnProperty(_t) && (tt(_t, Ut[_t]), et(_t.toLowerCase()));
    tt("Weeks", 6048e5), nt.duration.fn.asMonths = function() {
        return (+this - 31536e6 * this.years()) / 2592e6 + 12 * this.years()
    }, nt.lang("en", {
        ordinal: function(e) {
            var t = e % 10,
                a = 1 === y(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th";
            return e + a
        }
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("ar-ma", {
            months: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
            monthsShort: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),
            weekdays: "الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[اليوم على الساعة] LT",
                nextDay: "[غدا على الساعة] LT",
                nextWeek: "dddd [على الساعة] LT",
                lastDay: "[أمس على الساعة] LT",
                lastWeek: "dddd [على الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "في %s",
                past: "منذ %s",
                s: "ثوان",
                m: "دقيقة",
                mm: "%d دقائق",
                h: "ساعة",
                hh: "%d ساعات",
                d: "يوم",
                dd: "%d أيام",
                M: "شهر",
                MM: "%d أشهر",
                y: "سنة",
                yy: "%d سنوات"
            },
            week: {
                dow: 6,
                doy: 12
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("ar", {
            months: "يناير/ كانون الثاني_فبراير/ شباط_مارس/ آذار_أبريل/ نيسان_مايو/ أيار_يونيو/ حزيران_يوليو/ تموز_أغسطس/ آب_سبتمبر/ أيلول_أكتوبر/ تشرين الأول_نوفمبر/ تشرين الثاني_ديسمبر/ كانون الأول".split("_"),
            monthsShort: "يناير/ كانون الثاني_فبراير/ شباط_مارس/ آذار_أبريل/ نيسان_مايو/ أيار_يونيو/ حزيران_يوليو/ تموز_أغسطس/ آب_سبتمبر/ أيلول_أكتوبر/ تشرين الأول_نوفمبر/ تشرين الثاني_ديسمبر/ كانون الأول".split("_"),
            weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysShort: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
            weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[اليوم على الساعة] LT",
                nextDay: "[غدا على الساعة] LT",
                nextWeek: "dddd [على الساعة] LT",
                lastDay: "[أمس على الساعة] LT",
                lastWeek: "dddd [على الساعة] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "في %s",
                past: "منذ %s",
                s: "ثوان",
                m: "دقيقة",
                mm: "%d دقائق",
                h: "ساعة",
                hh: "%d ساعات",
                d: "يوم",
                dd: "%d أيام",
                M: "شهر",
                MM: "%d أشهر",
                y: "سنة",
                yy: "%d سنوات"
            },
            week: {
                dow: 6,
                doy: 12
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("bg", {
            months: "януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),
            monthsShort: "янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),
            weekdays: "неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),
            weekdaysShort: "нед_пон_вто_сря_чет_пет_съб".split("_"),
            weekdaysMin: "нд_пн_вт_ср_чт_пт_сб".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "D.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Днес в] LT",
                nextDay: "[Утре в] LT",
                nextWeek: "dddd [в] LT",
                lastDay: "[Вчера в] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 6:
                            return "[В изминалата] dddd [в] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[В изминалия] dddd [в] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "след %s",
                past: "преди %s",
                s: "няколко секунди",
                m: "минута",
                mm: "%d минути",
                h: "час",
                hh: "%d часа",
                d: "ден",
                dd: "%d дни",
                M: "месец",
                MM: "%d месеца",
                y: "година",
                yy: "%d години"
            },
            ordinal: function(e) {
                var t = e % 10,
                    a = e % 100;
                return 0 === e ? e + "-ев" : 0 === a ? e + "-ен" : a > 10 && 20 > a ? e + "-ти" : 1 === t ? e + "-ви" : 2 === t ? e + "-ри" : 7 === t || 8 === t ? e + "-ми" : e + "-ти"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(t) {
        function a(e, t, a) {
            var n = {
                mm: "munutenn",
                MM: "miz",
                dd: "devezh"
            };
            return e + " " + s(n[a], e)
        }
        function n(e) {
            switch (_(e)) {
                case 1:
                case 3:
                case 4:
                case 5:
                case 9:
                    return e + " bloaz";
                default:
                    return e + " vloaz"
            }
        }
        function _(e) {
            return e > 9 ? _(e % 10) : e
        }
        function s(e, t) {
            return 2 === t ? r(e) : e
        }
        function r(t) {
            var a = {
                m: "v",
                b: "v",
                d: "z"
            };
            return a[t.charAt(0)] === e ? t : a[t.charAt(0)] + t.substring(1)
        }
        return t.lang("br", {
            months: "Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),
            monthsShort: "Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),
            weekdays: "Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),
            weekdaysShort: "Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),
            weekdaysMin: "Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),
            longDateFormat: {
                LT: "h[e]mm A",
                L: "DD/MM/YYYY",
                LL: "D [a viz] MMMM YYYY",
                LLL: "D [a viz] MMMM YYYY LT",
                LLLL: "dddd, D [a viz] MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Hiziv da] LT",
                nextDay: "[Warc'hoazh da] LT",
                nextWeek: "dddd [da] LT",
                lastDay: "[Dec'h da] LT",
                lastWeek: "dddd [paset da] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "a-benn %s",
                past: "%s 'zo",
                s: "un nebeud segondennoù",
                m: "ur vunutenn",
                mm: a,
                h: "un eur",
                hh: "%d eur",
                d: "un devezh",
                dd: a,
                M: "ur miz",
                MM: a,
                y: "ur bloaz",
                yy: n
            },
            ordinal: function(e) {
                var t = 1 === e ? "añ" : "vet";
                return e + t
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t, a) {
            var n = e + " ";
            switch (a) {
                case "m":
                    return t ? "jedna minuta" : "jedne minute";
                case "mm":
                    return n += 1 === e ? "minuta" : 2 === e || 3 === e || 4 === e ? "minute" : "minuta";
                case "h":
                    return t ? "jedan sat" : "jednog sata";
                case "hh":
                    return n += 1 === e ? "sat" : 2 === e || 3 === e || 4 === e ? "sata" : "sati";
                case "dd":
                    return n += 1 === e ? "dan" : "dana";
                case "MM":
                    return n += 1 === e ? "mjesec" : 2 === e || 3 === e || 4 === e ? "mjeseca" : "mjeseci";
                case "yy":
                    return n += 1 === e ? "godina" : 2 === e || 3 === e || 4 === e ? "godine" : "godina"
            }
        }
        return e.lang("bs", {
            months: "januar_februar_mart_april_maj_juni_juli_avgust_septembar_oktobar_novembar_decembar".split("_"),
            monthsShort: "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),
            weekdays: "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),
            weekdaysShort: "ned._pon._uto._sri._čet._pet._sub.".split("_"),
            weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "DD. MM. YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[danas u] LT",
                nextDay: "[sutra u] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[u] [nedjelju] [u] LT";
                        case 3:
                            return "[u] [srijedu] [u] LT";
                        case 6:
                            return "[u] [subotu] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[u] dddd [u] LT"
                    }
                },
                lastDay: "[jučer u] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                        case 3:
                            return "[prošlu] dddd [u] LT";
                        case 6:
                            return "[prošle] [subote] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[prošli] dddd [u] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "prije %s",
                s: "par sekundi",
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: "dan",
                dd: t,
                M: "mjesec",
                MM: t,
                y: "godinu",
                yy: t
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("ca", {
            months: "gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),
            monthsShort: "gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.".split("_"),
            weekdays: "diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),
            weekdaysShort: "dg._dl._dt._dc._dj._dv._ds.".split("_"),
            weekdaysMin: "Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: function() {
                    return "[avui a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                },
                nextDay: function() {
                    return "[demà a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                },
                nextWeek: function() {
                    return "dddd [a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                },
                lastDay: function() {
                    return "[ahir a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                },
                lastWeek: function() {
                    return "[el] dddd [passat a " + (1 !== this.hours() ? "les" : "la") + "] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "en %s",
                past: "fa %s",
                s: "uns segons",
                m: "un minut",
                mm: "%d minuts",
                h: "una hora",
                hh: "%d hores",
                d: "un dia",
                dd: "%d dies",
                M: "un mes",
                MM: "%d mesos",
                y: "un any",
                yy: "%d anys"
            },
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e) {
            return e > 1 && 5 > e && 1 !== ~~ (e / 10)
        }
        function a(e, a, n, _) {
            var s = e + " ";
            switch (n) {
                case "s":
                    return a || _ ? "pár vteřin" : "pár vteřinami";
                case "m":
                    return a ? "minuta" : _ ? "minutu" : "minutou";
                case "mm":
                    return a || _ ? s + (t(e) ? "minuty" : "minut") : s + "minutami";
                case "h":
                    return a ? "hodina" : _ ? "hodinu" : "hodinou";
                case "hh":
                    return a || _ ? s + (t(e) ? "hodiny" : "hodin") : s + "hodinami";
                case "d":
                    return a || _ ? "den" : "dnem";
                case "dd":
                    return a || _ ? s + (t(e) ? "dny" : "dní") : s + "dny";
                case "M":
                    return a || _ ? "měsíc" : "měsícem";
                case "MM":
                    return a || _ ? s + (t(e) ? "měsíce" : "měsíců") : s + "měsíci";
                case "y":
                    return a || _ ? "rok" : "rokem";
                case "yy":
                    return a || _ ? s + (t(e) ? "roky" : "let") : s + "lety"
            }
        }
        var n = "leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_"),
            _ = "led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_");
        return e.lang("cs", {
            months: n,
            monthsShort: _,
            monthsParse: function(e, t) {
                var a, n = [];
                for (a = 0; 12 > a; a++) n[a] = new RegExp("^" + e[a] + "$|^" + t[a] + "$", "i");
                return n
            }(n, _),
            weekdays: "neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),
            weekdaysShort: "ne_po_út_st_čt_pá_so".split("_"),
            weekdaysMin: "ne_po_út_st_čt_pá_so".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[dnes v] LT",
                nextDay: "[zítra v] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[v neděli v] LT";
                        case 1:
                        case 2:
                            return "[v] dddd [v] LT";
                        case 3:
                            return "[ve středu v] LT";
                        case 4:
                            return "[ve čtvrtek v] LT";
                        case 5:
                            return "[v pátek v] LT";
                        case 6:
                            return "[v sobotu v] LT"
                    }
                },
                lastDay: "[včera v] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[minulou neděli v] LT";
                        case 1:
                        case 2:
                            return "[minulé] dddd [v] LT";
                        case 3:
                            return "[minulou středu v] LT";
                        case 4:
                        case 5:
                            return "[minulý] dddd [v] LT";
                        case 6:
                            return "[minulou sobotu v] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "před %s",
                s: a,
                m: a,
                mm: a,
                h: a,
                hh: a,
                d: a,
                dd: a,
                M: a,
                MM: a,
                y: a,
                yy: a
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("cv", {
            months: "кăрлач_нарăс_пуш_ака_май_çĕртме_утă_çурла_авăн_юпа_чӳк_раштав".split("_"),
            monthsShort: "кăр_нар_пуш_ака_май_çĕр_утă_çур_ав_юпа_чӳк_раш".split("_"),
            weekdays: "вырсарникун_тунтикун_ытларикун_юнкун_кĕçнерникун_эрнекун_шăматкун".split("_"),
            weekdaysShort: "выр_тун_ытл_юн_кĕç_эрн_шăм".split("_"),
            weekdaysMin: "вр_тн_ыт_юн_кç_эр_шм".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD-MM-YYYY",
                LL: "YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ]",
                LLL: "YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT",
                LLLL: "dddd, YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT"
            },
            calendar: {
                sameDay: "[Паян] LT [сехетре]",
                nextDay: "[Ыран] LT [сехетре]",
                lastDay: "[Ĕнер] LT [сехетре]",
                nextWeek: "[Çитес] dddd LT [сехетре]",
                lastWeek: "[Иртнĕ] dddd LT [сехетре]",
                sameElse: "L"
            },
            relativeTime: {
                future: function(e) {
                    var t = /сехет$/i.exec(e) ? "рен" : /çул$/i.exec(e) ? "тан" : "ран";
                    return e + t
                },
                past: "%s каялла",
                s: "пĕр-ик çеккунт",
                m: "пĕр минут",
                mm: "%d минут",
                h: "пĕр сехет",
                hh: "%d сехет",
                d: "пĕр кун",
                dd: "%d кун",
                M: "пĕр уйăх",
                MM: "%d уйăх",
                y: "пĕр çул",
                yy: "%d çул"
            },
            ordinal: "%d-мĕш",
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("cy", {
            months: "Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),
            monthsShort: "Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),
            weekdays: "Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),
            weekdaysShort: "Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),
            weekdaysMin: "Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Heddiw am] LT",
                nextDay: "[Yfory am] LT",
                nextWeek: "dddd [am] LT",
                lastDay: "[Ddoe am] LT",
                lastWeek: "dddd [diwethaf am] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "mewn %s",
                past: "%s yn àl",
                s: "ychydig eiliadau",
                m: "munud",
                mm: "%d munud",
                h: "awr",
                hh: "%d awr",
                d: "diwrnod",
                dd: "%d diwrnod",
                M: "mis",
                MM: "%d mis",
                y: "blwyddyn",
                yy: "%d flynedd"
            },
            ordinal: function(e) {
                var t = e,
                    a = "",
                    n = ["", "af", "il", "ydd", "ydd", "ed", "ed", "ed", "fed", "fed", "fed", "eg", "fed", "eg", "eg", "fed", "eg", "eg", "fed", "eg", "fed"];
                return t > 20 ? a = 40 === t || 50 === t || 60 === t || 80 === t || 100 === t ? "fed" : "ain" : t > 0 && (a = n[t]), e + a
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("da", {
            months: "januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),
            monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
            weekdays: "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
            weekdaysShort: "søn_man_tir_ons_tor_fre_lør".split("_"),
            weekdaysMin: "sø_ma_ti_on_to_fr_lø".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D. MMMM, YYYY LT"
            },
            calendar: {
                sameDay: "[I dag kl.] LT",
                nextDay: "[I morgen kl.] LT",
                nextWeek: "dddd [kl.] LT",
                lastDay: "[I går kl.] LT",
                lastWeek: "[sidste] dddd [kl] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "om %s",
                past: "%s siden",
                s: "få sekunder",
                m: "et minut",
                mm: "%d minutter",
                h: "en time",
                hh: "%d timer",
                d: "en dag",
                dd: "%d dage",
                M: "en måned",
                MM: "%d måneder",
                y: "et år",
                yy: "%d år"
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t, a) {
            var n = {
                m: ["eine Minute", "einer Minute"],
                h: ["eine Stunde", "einer Stunde"],
                d: ["ein Tag", "einem Tag"],
                dd: [e + " Tage", e + " Tagen"],
                M: ["ein Monat", "einem Monat"],
                MM: [e + " Monate", e + " Monaten"],
                y: ["ein Jahr", "einem Jahr"],
                yy: [e + " Jahre", e + " Jahren"]
            };
            return t ? n[a][0] : n[a][1]
        }
        return e.lang("de", {
            months: "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
            monthsShort: "Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
            weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
            weekdaysShort: "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
            weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "H:mm [Uhr]",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Heute um] LT",
                sameElse: "L",
                nextDay: "[Morgen um] LT",
                nextWeek: "dddd [um] LT",
                lastDay: "[Gestern um] LT",
                lastWeek: "[letzten] dddd [um] LT"
            },
            relativeTime: {
                future: "in %s",
                past: "vor %s",
                s: "ein paar Sekunden",
                m: t,
                mm: "%d Minuten",
                h: t,
                hh: "%d Stunden",
                d: t,
                dd: t,
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("el", {
            monthsNominativeEl: "Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),
            monthsGenitiveEl: "Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),
            months: function(e, t) {
                return /D/.test(t.substring(0, t.indexOf("MMMM"))) ? this._monthsGenitiveEl[e.month()] : this._monthsNominativeEl[e.month()]
            },
            monthsShort: "Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),
            weekdays: "Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),
            weekdaysShort: "Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),
            weekdaysMin: "Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),
            meridiem: function(e, t, a) {
                return e > 11 ? a ? "μμ" : "ΜΜ" : a ? "πμ" : "ΠΜ"
            },
            longDateFormat: {
                LT: "h:mm A",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendarEl: {
                sameDay: "[Σήμερα {}] LT",
                nextDay: "[Αύριο {}] LT",
                nextWeek: "dddd [{}] LT",
                lastDay: "[Χθες {}] LT",
                lastWeek: "[την προηγούμενη] dddd [{}] LT",
                sameElse: "L"
            },
            calendar: function(e, t) {
                var a = this._calendarEl[e],
                    n = t && t.hours();
                return a.replace("{}", n % 12 === 1 ? "στη" : "στις")
            },
            relativeTime: {
                future: "σε %s",
                past: "%s πριν",
                s: "δευτερόλεπτα",
                m: "ένα λεπτό",
                mm: "%d λεπτά",
                h: "μία ώρα",
                hh: "%d ώρες",
                d: "μία μέρα",
                dd: "%d μέρες",
                M: "ένας μήνας",
                MM: "%d μήνες",
                y: "ένας χρόνος",
                yy: "%d χρόνια"
            },
            ordinal: function(e) {
                return e + "η"
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("en-au", {
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "h:mm A",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            ordinal: function(e) {
                var t = e % 10,
                    a = 1 === ~~ (e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th";
                return e + a
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("en-ca", {
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "h:mm A",
                L: "YYYY-MM-DD",
                LL: "D MMMM, YYYY",
                LLL: "D MMMM, YYYY LT",
                LLLL: "dddd, D MMMM, YYYY LT"
            },
            calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            ordinal: function(e) {
                var t = e % 10,
                    a = 1 === ~~ (e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th";
                return e + a
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("en-gb", {
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            ordinal: function(e) {
                var t = e % 10,
                    a = 1 === ~~ (e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th";
                return e + a
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("eo", {
            months: "januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),
            monthsShort: "jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),
            weekdays: "Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split("_"),
            weekdaysShort: "Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split("_"),
            weekdaysMin: "Di_Lu_Ma_Me_Ĵa_Ve_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "YYYY-MM-DD",
                LL: "D[-an de] MMMM, YYYY",
                LLL: "D[-an de] MMMM, YYYY LT",
                LLLL: "dddd, [la] D[-an de] MMMM, YYYY LT"
            },
            meridiem: function(e, t, a) {
                return e > 11 ? a ? "p.t.m." : "P.T.M." : a ? "a.t.m." : "A.T.M."
            },
            calendar: {
                sameDay: "[Hodiaŭ je] LT",
                nextDay: "[Morgaŭ je] LT",
                nextWeek: "dddd [je] LT",
                lastDay: "[Hieraŭ je] LT",
                lastWeek: "[pasinta] dddd [je] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "je %s",
                past: "antaŭ %s",
                s: "sekundoj",
                m: "minuto",
                mm: "%d minutoj",
                h: "horo",
                hh: "%d horoj",
                d: "tago",
                dd: "%d tagoj",
                M: "monato",
                MM: "%d monatoj",
                y: "jaro",
                yy: "%d jaroj"
            },
            ordinal: "%da",
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("es", {
            months: "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),
            monthsShort: "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),
            weekdays: "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
            weekdaysShort: "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
            weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "DD/MM/YYYY",
                LL: "D [de] MMMM [de] YYYY",
                LLL: "D [de] MMMM [de] YYYY LT",
                LLLL: "dddd, D [de] MMMM [de] YYYY LT"
            },
            calendar: {
                sameDay: function() {
                    return "[hoy a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                nextDay: function() {
                    return "[mañana a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                nextWeek: function() {
                    return "dddd [a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                lastDay: function() {
                    return "[ayer a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                lastWeek: function() {
                    return "[el] dddd [pasado a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "en %s",
                past: "hace %s",
                s: "unos segundos",
                m: "un minuto",
                mm: "%d minutos",
                h: "una hora",
                hh: "%d horas",
                d: "un día",
                dd: "%d días",
                M: "un mes",
                MM: "%d meses",
                y: "un año",
                yy: "%d años"
            },
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t, a, n) {
            var _ = {
                s: ["mõne sekundi", "mõni sekund", "paar sekundit"],
                m: ["ühe minuti", "üks minut"],
                mm: [e + " minuti", e + " minutit"],
                h: ["ühe tunni", "tund aega", "üks tund"],
                hh: [e + " tunni", e + " tundi"],
                d: ["ühe päeva", "üks päev"],
                M: ["kuu aja", "kuu aega", "üks kuu"],
                MM: [e + " kuu", e + " kuud"],
                y: ["ühe aasta", "aasta", "üks aasta"],
                yy: [e + " aasta", e + " aastat"]
            };
            return t ? _[a][2] ? _[a][2] : _[a][1] : n ? _[a][0] : _[a][1]
        }
        return e.lang("et", {
            months: "jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),
            monthsShort: "jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),
            weekdays: "pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),
            weekdaysShort: "P_E_T_K_N_R_L".split("_"),
            weekdaysMin: "P_E_T_K_N_R_L".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Täna,] LT",
                nextDay: "[Homme,] LT",
                nextWeek: "[Järgmine] dddd LT",
                lastDay: "[Eile,] LT",
                lastWeek: "[Eelmine] dddd LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s pärast",
                past: "%s tagasi",
                s: t,
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: t,
                dd: "%d päeva",
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("eu", {
            months: "urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),
            monthsShort: "urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),
            weekdays: "igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),
            weekdaysShort: "ig._al._ar._az._og._ol._lr.".split("_"),
            weekdaysMin: "ig_al_ar_az_og_ol_lr".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "YYYY-MM-DD",
                LL: "YYYY[ko] MMMM[ren] D[a]",
                LLL: "YYYY[ko] MMMM[ren] D[a] LT",
                LLLL: "dddd, YYYY[ko] MMMM[ren] D[a] LT",
                l: "YYYY-M-D",
                ll: "YYYY[ko] MMM D[a]",
                lll: "YYYY[ko] MMM D[a] LT",
                llll: "ddd, YYYY[ko] MMM D[a] LT"
            },
            calendar: {
                sameDay: "[gaur] LT[etan]",
                nextDay: "[bihar] LT[etan]",
                nextWeek: "dddd LT[etan]",
                lastDay: "[atzo] LT[etan]",
                lastWeek: "[aurreko] dddd LT[etan]",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s barru",
                past: "duela %s",
                s: "segundo batzuk",
                m: "minutu bat",
                mm: "%d minutu",
                h: "ordu bat",
                hh: "%d ordu",
                d: "egun bat",
                dd: "%d egun",
                M: "hilabete bat",
                MM: "%d hilabete",
                y: "urte bat",
                yy: "%d urte"
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        var t = {
            1: "۱",
            2: "۲",
            3: "۳",
            4: "۴",
            5: "۵",
            6: "۶",
            7: "۷",
            8: "۸",
            9: "۹",
            0: "۰"
        }, a = {
            "۱": "1",
            "۲": "2",
            "۳": "3",
            "۴": "4",
            "۵": "5",
            "۶": "6",
            "۷": "7",
            "۸": "8",
            "۹": "9",
            "۰": "0"
        };
        return e.lang("fa", {
            months: "ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),
            monthsShort: "ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),
            weekdays: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),
            weekdaysShort: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),
            weekdaysMin: "ی_د_س_چ_پ_ج_ش".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            meridiem: function(e) {
                return 12 > e ? "قبل از ظهر" : "بعد از ظهر"
            },
            calendar: {
                sameDay: "[امروز ساعت] LT",
                nextDay: "[فردا ساعت] LT",
                nextWeek: "dddd [ساعت] LT",
                lastDay: "[دیروز ساعت] LT",
                lastWeek: "dddd [پیش] [ساعت] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "در %s",
                past: "%s پیش",
                s: "چندین ثانیه",
                m: "یک دقیقه",
                mm: "%d دقیقه",
                h: "یک ساعت",
                hh: "%d ساعت",
                d: "یک روز",
                dd: "%d روز",
                M: "یک ماه",
                MM: "%d ماه",
                y: "یک سال",
                yy: "%d سال"
            },
            preparse: function(e) {
                return e.replace(/[۰-۹]/g, function(e) {
                    return a[e]
                }).replace(/،/g, ",")
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                }).replace(/,/g, "،")
            },
            ordinal: "%dم",
            week: {
                dow: 6,
                doy: 12
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t, n, _) {
            var s = "";
            switch (n) {
                case "s":
                    return _ ? "muutaman sekunnin" : "muutama sekunti";
                case "m":
                    return _ ? "minuutin" : "minuutti";
                case "mm":
                    s = _ ? "minuutin" : "minuuttia";
                    break;
                case "h":
                    return _ ? "tunnin" : "tunti";
                case "hh":
                    s = _ ? "tunnin" : "tuntia";
                    break;
                case "d":
                    return _ ? "päivän" : "päivä";
                case "dd":
                    s = _ ? "päivän" : "päivää";
                    break;
                case "M":
                    return _ ? "kuukauden" : "kuukausi";
                case "MM":
                    s = _ ? "kuukauden" : "kuukautta";
                    break;
                case "y":
                    return _ ? "vuoden" : "vuosi";
                case "yy":
                    s = _ ? "vuoden" : "vuotta"
            }
            return s = a(e, _) + " " + s
        }
        function a(e, t) {
            return 10 > e ? t ? _[e] : n[e] : e
        }
        var n = "nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" "),
            _ = ["nolla", "yhden", "kahden", "kolmen", "neljän", "viiden", "kuuden", n[7], n[8], n[9]];
        return e.lang("fi", {
            months: "tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),
            monthsShort: "tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),
            weekdays: "sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),
            weekdaysShort: "su_ma_ti_ke_to_pe_la".split("_"),
            weekdaysMin: "su_ma_ti_ke_to_pe_la".split("_"),
            longDateFormat: {
                LT: "HH.mm",
                L: "DD.MM.YYYY",
                LL: "Do MMMM[ta] YYYY",
                LLL: "Do MMMM[ta] YYYY, [klo] LT",
                LLLL: "dddd, Do MMMM[ta] YYYY, [klo] LT",
                l: "D.M.YYYY",
                ll: "Do MMM YYYY",
                lll: "Do MMM YYYY, [klo] LT",
                llll: "ddd, Do MMM YYYY, [klo] LT"
            },
            calendar: {
                sameDay: "[tänään] [klo] LT",
                nextDay: "[huomenna] [klo] LT",
                nextWeek: "dddd [klo] LT",
                lastDay: "[eilen] [klo] LT",
                lastWeek: "[viime] dddd[na] [klo] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s päästä",
                past: "%s sitten",
                s: t,
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: t,
                dd: t,
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("fo", {
            months: "januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),
            monthsShort: "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
            weekdays: "sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),
            weekdaysShort: "sun_mán_týs_mik_hós_frí_ley".split("_"),
            weekdaysMin: "su_má_tý_mi_hó_fr_le".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D. MMMM, YYYY LT"
            },
            calendar: {
                sameDay: "[Í dag kl.] LT",
                nextDay: "[Í morgin kl.] LT",
                nextWeek: "dddd [kl.] LT",
                lastDay: "[Í gjár kl.] LT",
                lastWeek: "[síðstu] dddd [kl] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "um %s",
                past: "%s síðani",
                s: "fá sekund",
                m: "ein minutt",
                mm: "%d minuttir",
                h: "ein tími",
                hh: "%d tímar",
                d: "ein dagur",
                dd: "%d dagar",
                M: "ein mánaði",
                MM: "%d mánaðir",
                y: "eitt ár",
                yy: "%d ár"
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("fr-ca", {
            months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
            monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
            weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
            weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
            weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "YYYY-MM-DD",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Aujourd'hui à] LT",
                nextDay: "[Demain à] LT",
                nextWeek: "dddd [à] LT",
                lastDay: "[Hier à] LT",
                lastWeek: "dddd [dernier à] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dans %s",
                past: "il y a %s",
                s: "quelques secondes",
                m: "une minute",
                mm: "%d minutes",
                h: "une heure",
                hh: "%d heures",
                d: "un jour",
                dd: "%d jours",
                M: "un mois",
                MM: "%d mois",
                y: "un an",
                yy: "%d ans"
            },
            ordinal: function(e) {
                return e + (1 === e ? "er" : "")
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("fr", {
            months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
            monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
            weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
            weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
            weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Aujourd'hui à] LT",
                nextDay: "[Demain à] LT",
                nextWeek: "dddd [à] LT",
                lastDay: "[Hier à] LT",
                lastWeek: "dddd [dernier à] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dans %s",
                past: "il y a %s",
                s: "quelques secondes",
                m: "une minute",
                mm: "%d minutes",
                h: "une heure",
                hh: "%d heures",
                d: "un jour",
                dd: "%d jours",
                M: "un mois",
                MM: "%d mois",
                y: "un an",
                yy: "%d ans"
            },
            ordinal: function(e) {
                return e + (1 === e ? "er" : "")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("gl", {
            months: "Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro".split("_"),
            monthsShort: "Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),
            weekdays: "Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),
            weekdaysShort: "Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),
            weekdaysMin: "Do_Lu_Ma_Mé_Xo_Ve_Sá".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: function() {
                    return "[hoxe " + (1 !== this.hours() ? "ás" : "á") + "] LT"
                },
                nextDay: function() {
                    return "[mañá " + (1 !== this.hours() ? "ás" : "á") + "] LT"
                },
                nextWeek: function() {
                    return "dddd [" + (1 !== this.hours() ? "ás" : "a") + "] LT"
                },
                lastDay: function() {
                    return "[onte " + (1 !== this.hours() ? "á" : "a") + "] LT"
                },
                lastWeek: function() {
                    return "[o] dddd [pasado " + (1 !== this.hours() ? "ás" : "a") + "] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: function(e) {
                    return "uns segundos" === e ? "nuns segundos" : "en " + e
                },
                past: "hai %s",
                s: "uns segundos",
                m: "un minuto",
                mm: "%d minutos",
                h: "unha hora",
                hh: "%d horas",
                d: "un día",
                dd: "%d días",
                M: "un mes",
                MM: "%d meses",
                y: "un ano",
                yy: "%d anos"
            },
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("he", {
            months: "ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),
            monthsShort: "ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),
            weekdays: "ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),
            weekdaysShort: "א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),
            weekdaysMin: "א_ב_ג_ד_ה_ו_ש".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D [ב]MMMM YYYY",
                LLL: "D [ב]MMMM YYYY LT",
                LLLL: "dddd, D [ב]MMMM YYYY LT",
                l: "D/M/YYYY",
                ll: "D MMM YYYY",
                lll: "D MMM YYYY LT",
                llll: "ddd, D MMM YYYY LT"
            },
            calendar: {
                sameDay: "[היום ב־]LT",
                nextDay: "[מחר ב־]LT",
                nextWeek: "dddd [בשעה] LT",
                lastDay: "[אתמול ב־]LT",
                lastWeek: "[ביום] dddd [האחרון בשעה] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "בעוד %s",
                past: "לפני %s",
                s: "מספר שניות",
                m: "דקה",
                mm: "%d דקות",
                h: "שעה",
                hh: function(e) {
                    return 2 === e ? "שעתיים" : e + " שעות"
                },
                d: "יום",
                dd: function(e) {
                    return 2 === e ? "יומיים" : e + " ימים"
                },
                M: "חודש",
                MM: function(e) {
                    return 2 === e ? "חודשיים" : e + " חודשים"
                },
                y: "שנה",
                yy: function(e) {
                    return 2 === e ? "שנתיים" : e + " שנים"
                }
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        var t = {
            1: "१",
            2: "२",
            3: "३",
            4: "४",
            5: "५",
            6: "६",
            7: "७",
            8: "८",
            9: "९",
            0: "०"
        }, a = {
            "१": "1",
            "२": "2",
            "३": "3",
            "४": "4",
            "५": "5",
            "६": "6",
            "७": "7",
            "८": "8",
            "९": "9",
            "०": "0"
        };
        return e.lang("hi", {
            months: "जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split("_"),
            monthsShort: "जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),
            weekdays: "रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),
            weekdaysShort: "रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),
            weekdaysMin: "र_सो_मं_बु_गु_शु_श".split("_"),
            longDateFormat: {
                LT: "A h:mm बजे",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, LT",
                LLLL: "dddd, D MMMM YYYY, LT"
            },
            calendar: {
                sameDay: "[आज] LT",
                nextDay: "[कल] LT",
                nextWeek: "dddd, LT",
                lastDay: "[कल] LT",
                lastWeek: "[पिछले] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s में",
                past: "%s पहले",
                s: "कुछ ही क्षण",
                m: "एक मिनट",
                mm: "%d मिनट",
                h: "एक घंटा",
                hh: "%d घंटे",
                d: "एक दिन",
                dd: "%d दिन",
                M: "एक महीने",
                MM: "%d महीने",
                y: "एक वर्ष",
                yy: "%d वर्ष"
            },
            preparse: function(e) {
                return e.replace(/[१२३४५६७८९०]/g, function(e) {
                    return a[e]
                })
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                })
            },
            meridiem: function(e) {
                return 4 > e ? "रात" : 10 > e ? "सुबह" : 17 > e ? "दोपहर" : 20 > e ? "शाम" : "रात"
            },
            week: {
                dow: 0,
                doy: 6
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t, a) {
            var n = e + " ";
            switch (a) {
                case "m":
                    return t ? "jedna minuta" : "jedne minute";
                case "mm":
                    return n += 1 === e ? "minuta" : 2 === e || 3 === e || 4 === e ? "minute" : "minuta";
                case "h":
                    return t ? "jedan sat" : "jednog sata";
                case "hh":
                    return n += 1 === e ? "sat" : 2 === e || 3 === e || 4 === e ? "sata" : "sati";
                case "dd":
                    return n += 1 === e ? "dan" : "dana";
                case "MM":
                    return n += 1 === e ? "mjesec" : 2 === e || 3 === e || 4 === e ? "mjeseca" : "mjeseci";
                case "yy":
                    return n += 1 === e ? "godina" : 2 === e || 3 === e || 4 === e ? "godine" : "godina"
            }
        }
        return e.lang("hr", {
            months: "sječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_"),
            monthsShort: "sje._vel._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),
            weekdays: "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),
            weekdaysShort: "ned._pon._uto._sri._čet._pet._sub.".split("_"),
            weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "DD. MM. YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[danas u] LT",
                nextDay: "[sutra u] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[u] [nedjelju] [u] LT";
                        case 3:
                            return "[u] [srijedu] [u] LT";
                        case 6:
                            return "[u] [subotu] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[u] dddd [u] LT"
                    }
                },
                lastDay: "[jučer u] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                        case 3:
                            return "[prošlu] dddd [u] LT";
                        case 6:
                            return "[prošle] [subote] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[prošli] dddd [u] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "prije %s",
                s: "par sekundi",
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: "dan",
                dd: t,
                M: "mjesec",
                MM: t,
                y: "godinu",
                yy: t
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t, a, n) {
            var _ = e;
            switch (a) {
                case "s":
                    return n || t ? "néhány másodperc" : "néhány másodperce";
                case "m":
                    return "egy" + (n || t ? " perc" : " perce");
                case "mm":
                    return _ + (n || t ? " perc" : " perce");
                case "h":
                    return "egy" + (n || t ? " óra" : " órája");
                case "hh":
                    return _ + (n || t ? " óra" : " órája");
                case "d":
                    return "egy" + (n || t ? " nap" : " napja");
                case "dd":
                    return _ + (n || t ? " nap" : " napja");
                case "M":
                    return "egy" + (n || t ? " hónap" : " hónapja");
                case "MM":
                    return _ + (n || t ? " hónap" : " hónapja");
                case "y":
                    return "egy" + (n || t ? " év" : " éve");
                case "yy":
                    return _ + (n || t ? " év" : " éve")
            }
            return ""
        }
        function a(e) {
            return (e ? "" : "[múlt] ") + "[" + n[this.day()] + "] LT[-kor]"
        }
        var n = "vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ");
        return e.lang("hu", {
            months: "január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),
            monthsShort: "jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),
            weekdays: "vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),
            weekdaysShort: "vas_hét_kedd_sze_csüt_pén_szo".split("_"),
            weekdaysMin: "v_h_k_sze_cs_p_szo".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "YYYY.MM.DD.",
                LL: "YYYY. MMMM D.",
                LLL: "YYYY. MMMM D., LT",
                LLLL: "YYYY. MMMM D., dddd LT"
            },
            calendar: {
                sameDay: "[ma] LT[-kor]",
                nextDay: "[holnap] LT[-kor]",
                nextWeek: function() {
                    return a.call(this, !0)
                },
                lastDay: "[tegnap] LT[-kor]",
                lastWeek: function() {
                    return a.call(this, !1)
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "%s múlva",
                past: "%s",
                s: t,
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: t,
                dd: t,
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t) {
            var a = {
                nominative: "հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split("_"),
                accusative: "հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split("_")
            }, n = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(t) ? "accusative" : "nominative";
            return a[n][e.month()]
        }
        function a(e) {
            var t = "հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_");
            return t[e.month()]
        }
        function n(e) {
            var t = "կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split("_");
            return t[e.day()]
        }
        return e.lang("hy-am", {
            months: t,
            monthsShort: a,
            weekdays: n,
            weekdaysShort: "կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),
            weekdaysMin: "կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY թ.",
                LLL: "D MMMM YYYY թ., LT",
                LLLL: "dddd, D MMMM YYYY թ., LT"
            },
            calendar: {
                sameDay: "[այսօր] LT",
                nextDay: "[վաղը] LT",
                lastDay: "[երեկ] LT",
                nextWeek: function() {
                    return "dddd [օրը ժամը] LT"
                },
                lastWeek: function() {
                    return "[անցած] dddd [օրը ժամը] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "%s հետո",
                past: "%s առաջ",
                s: "մի քանի վայրկյան",
                m: "րոպե",
                mm: "%d րոպե",
                h: "ժամ",
                hh: "%d ժամ",
                d: "օր",
                dd: "%d օր",
                M: "ամիս",
                MM: "%d ամիս",
                y: "տարի",
                yy: "%d տարի"
            },
            meridiem: function(e) {
                return 4 > e ? "գիշերվա" : 12 > e ? "առավոտվա" : 17 > e ? "ցերեկվա" : "երեկոյան"
            },
            ordinal: function(e, t) {
                switch (t) {
                    case "DDD":
                    case "w":
                    case "W":
                    case "DDDo":
                        return 1 === e ? e + "-ին" : e + "-րդ";
                    default:
                        return e
                }
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("id", {
            months: "Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),
            monthsShort: "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),
            weekdays: "Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),
            weekdaysShort: "Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),
            weekdaysMin: "Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),
            longDateFormat: {
                LT: "HH.mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY [pukul] LT",
                LLLL: "dddd, D MMMM YYYY [pukul] LT"
            },
            meridiem: function(e) {
                return 11 > e ? "pagi" : 15 > e ? "siang" : 19 > e ? "sore" : "malam"
            },
            calendar: {
                sameDay: "[Hari ini pukul] LT",
                nextDay: "[Besok pukul] LT",
                nextWeek: "dddd [pukul] LT",
                lastDay: "[Kemarin pukul] LT",
                lastWeek: "dddd [lalu pukul] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dalam %s",
                past: "%s yang lalu",
                s: "beberapa detik",
                m: "semenit",
                mm: "%d menit",
                h: "sejam",
                hh: "%d jam",
                d: "sehari",
                dd: "%d hari",
                M: "sebulan",
                MM: "%d bulan",
                y: "setahun",
                yy: "%d tahun"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e) {
            return e % 100 === 11 ? !0 : e % 10 === 1 ? !1 : !0
        }
        function a(e, a, n, _) {
            var s = e + " ";
            switch (n) {
                case "s":
                    return a || _ ? "nokkrar sekúndur" : "nokkrum sekúndum";
                case "m":
                    return a ? "mínúta" : "mínútu";
                case "mm":
                    return t(e) ? s + (a || _ ? "mínútur" : "mínútum") : a ? s + "mínúta" : s + "mínútu";
                case "hh":
                    return t(e) ? s + (a || _ ? "klukkustundir" : "klukkustundum") : s + "klukkustund";
                case "d":
                    return a ? "dagur" : _ ? "dag" : "degi";
                case "dd":
                    return t(e) ? a ? s + "dagar" : s + (_ ? "daga" : "dögum") : a ? s + "dagur" : s + (_ ? "dag" : "degi");
                case "M":
                    return a ? "mánuður" : _ ? "mánuð" : "mánuði";
                case "MM":
                    return t(e) ? a ? s + "mánuðir" : s + (_ ? "mánuði" : "mánuðum") : a ? s + "mánuður" : s + (_ ? "mánuð" : "mánuði");
                case "y":
                    return a || _ ? "ár" : "ári";
                case "yy":
                    return t(e) ? s + (a || _ ? "ár" : "árum") : s + (a || _ ? "ár" : "ári")
            }
        }
        return e.lang("is", {
            months: "janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),
            monthsShort: "jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),
            weekdays: "sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),
            weekdaysShort: "sun_mán_þri_mið_fim_fös_lau".split("_"),
            weekdaysMin: "Su_Má_Þr_Mi_Fi_Fö_La".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "DD/MM/YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY [kl.] LT",
                LLLL: "dddd, D. MMMM YYYY [kl.] LT"
            },
            calendar: {
                sameDay: "[í dag kl.] LT",
                nextDay: "[á morgun kl.] LT",
                nextWeek: "dddd [kl.] LT",
                lastDay: "[í gær kl.] LT",
                lastWeek: "[síðasta] dddd [kl.] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "eftir %s",
                past: "fyrir %s síðan",
                s: a,
                m: a,
                mm: a,
                h: "klukkustund",
                hh: a,
                d: a,
                dd: a,
                M: a,
                MM: a,
                y: a,
                yy: a
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("it", {
            months: "Gennaio_Febbraio_Marzo_Aprile_Maggio_Giugno_Luglio_Agosto_Settembre_Ottobre_Novembre_Dicembre".split("_"),
            monthsShort: "Gen_Feb_Mar_Apr_Mag_Giu_Lug_Ago_Set_Ott_Nov_Dic".split("_"),
            weekdays: "Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),
            weekdaysShort: "Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),
            weekdaysMin: "D_L_Ma_Me_G_V_S".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Oggi alle] LT",
                nextDay: "[Domani alle] LT",
                nextWeek: "dddd [alle] LT",
                lastDay: "[Ieri alle] LT",
                lastWeek: "[lo scorso] dddd [alle] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: function(e) {
                    return (/^[0-9].+$/.test(e) ? "tra" : "in") + " " + e
                },
                past: "%s fa",
                s: "alcuni secondi",
                m: "un minuto",
                mm: "%d minuti",
                h: "un'ora",
                hh: "%d ore",
                d: "un giorno",
                dd: "%d giorni",
                M: "un mese",
                MM: "%d mesi",
                y: "un anno",
                yy: "%d anni"
            },
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("ja", {
            months: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            weekdays: "日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),
            weekdaysShort: "日_月_火_水_木_金_土".split("_"),
            weekdaysMin: "日_月_火_水_木_金_土".split("_"),
            longDateFormat: {
                LT: "Ah時m分",
                L: "YYYY/MM/DD",
                LL: "YYYY年M月D日",
                LLL: "YYYY年M月D日LT",
                LLLL: "YYYY年M月D日LT dddd"
            },
            meridiem: function(e) {
                return 12 > e ? "午前" : "午後"
            },
            calendar: {
                sameDay: "[今日] LT",
                nextDay: "[明日] LT",
                nextWeek: "[来週]dddd LT",
                lastDay: "[昨日] LT",
                lastWeek: "[前週]dddd LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s後",
                past: "%s前",
                s: "数秒",
                m: "1分",
                mm: "%d分",
                h: "1時間",
                hh: "%d時間",
                d: "1日",
                dd: "%d日",
                M: "1ヶ月",
                MM: "%dヶ月",
                y: "1年",
                yy: "%d年"
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t) {
            var a = {
                nominative: "იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split("_"),
                accusative: "იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split("_")
            }, n = /D[oD] *MMMM?/.test(t) ? "accusative" : "nominative";
            return a[n][e.month()]
        }
        function a(e, t) {
            var a = {
                nominative: "კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split("_"),
                accusative: "კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split("_")
            }, n = /(წინა|შემდეგ)/.test(t) ? "accusative" : "nominative";
            return a[n][e.day()]
        }
        return e.lang("ka", {
            months: t,
            monthsShort: "იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),
            weekdays: a,
            weekdaysShort: "კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),
            weekdaysMin: "კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),
            longDateFormat: {
                LT: "h:mm A",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[დღეს] LT[-ზე]",
                nextDay: "[ხვალ] LT[-ზე]",
                lastDay: "[გუშინ] LT[-ზე]",
                nextWeek: "[შემდეგ] dddd LT[-ზე]",
                lastWeek: "[წინა] dddd LT-ზე",
                sameElse: "L"
            },
            relativeTime: {
                future: function(e) {
                    return /(წამი|წუთი|საათი|წელი)/.test(e) ? e.replace(/ი$/, "ში") : e + "ში"
                },
                past: function(e) {
                    return /(წამი|წუთი|საათი|დღე|თვე)/.test(e) ? e.replace(/(ი|ე)$/, "ის წინ") : /წელი/.test(e) ? e.replace(/წელი$/, "წლის წინ") : void 0
                },
                s: "რამდენიმე წამი",
                m: "წუთი",
                mm: "%d წუთი",
                h: "საათი",
                hh: "%d საათი",
                d: "დღე",
                dd: "%d დღე",
                M: "თვე",
                MM: "%d თვე",
                y: "წელი",
                yy: "%d წელი"
            },
            ordinal: function(e) {
                return 0 === e ? e : 1 === e ? e + "-ლი" : 20 > e || 100 >= e && e % 20 === 0 || e % 100 === 0 ? "მე-" + e : e + "-ე"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("ko", {
            months: "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
            monthsShort: "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
            weekdays: "일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),
            weekdaysShort: "일_월_화_수_목_금_토".split("_"),
            weekdaysMin: "일_월_화_수_목_금_토".split("_"),
            longDateFormat: {
                LT: "A h시 mm분",
                L: "YYYY.MM.DD",
                LL: "YYYY년 MMMM D일",
                LLL: "YYYY년 MMMM D일 LT",
                LLLL: "YYYY년 MMMM D일 dddd LT"
            },
            meridiem: function(e) {
                return 12 > e ? "오전" : "오후"
            },
            calendar: {
                sameDay: "오늘 LT",
                nextDay: "내일 LT",
                nextWeek: "dddd LT",
                lastDay: "어제 LT",
                lastWeek: "지난주 dddd LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s 후",
                past: "%s 전",
                s: "%d초",
                ss: "%d초",
                m: "%d분",
                mm: "%d분",
                h: "%d시간",
                hh: "%d시간",
                d: "%d일",
                dd: "%d일",
                M: "%d달",
                MM: "%d달",
                y: "%d년",
                yy: "%d년"
            },
            ordinal: "%d일",
            meridiemParse: /(오전|오후)/,
            isPM: function(e) {
                return "오후" === e
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t, a) {
            var n = {
                m: ["eng Minutt", "enger Minutt"],
                h: ["eng Stonn", "enger Stonn"],
                d: ["een Dag", "engem Dag"],
                dd: [e + " Deeg", e + " Deeg"],
                M: ["ee Mount", "engem Mount"],
                MM: [e + " Méint", e + " Méint"],
                y: ["ee Joer", "engem Joer"],
                yy: [e + " Joer", e + " Joer"]
            };
            return t ? n[a][0] : n[a][1]
        }
        function a(e) {
            var t = e.substr(0, e.indexOf(" "));
            return r(t) ? "a " + e : "an " + e
        }
        function n(e) {
            var t = e.substr(0, e.indexOf(" "));
            return r(t) ? "viru " + e : "virun " + e
        }
        function _() {
            var e = this.format("d");
            return s(e) ? "[Leschte] dddd [um] LT" : "[Leschten] dddd [um] LT"
        }
        function s(e) {
            switch (e = parseInt(e, 10)) {
                case 0:
                case 1:
                case 3:
                case 5:
                case 6:
                    return !0;
                default:
                    return !1
            }
        }
        function r(e) {
            if (e = parseInt(e, 10), isNaN(e)) return !1;
            if (0 > e) return !0;
            if (10 > e) return e >= 4 && 7 >= e ? !0 : !1;
            if (100 > e) {
                var t = e % 10,
                    a = e / 10;
                return r(0 === t ? a : t)
            }
            if (1e4 > e) {
                for (; e >= 10;) e /= 10;
                return r(e)
            }
            return e /= 1e3, r(e)
        }
        return e.lang("lb", {
            months: "Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
            monthsShort: "Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
            weekdays: "Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),
            weekdaysShort: "So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),
            weekdaysMin: "So_Mé_Dë_Më_Do_Fr_Sa".split("_"),
            longDateFormat: {
                LT: "H:mm [Auer]",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Haut um] LT",
                sameElse: "L",
                nextDay: "[Muer um] LT",
                nextWeek: "dddd [um] LT",
                lastDay: "[Gëschter um] LT",
                lastWeek: _
            },
            relativeTime: {
                future: a,
                past: n,
                s: "e puer Sekonnen",
                m: t,
                mm: "%d Minutten",
                h: t,
                hh: "%d Stonnen",
                d: t,
                dd: t,
                M: t,
                MM: t,
                y: t,
                yy: t
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t, a, n) {
            return t ? "kelios sekundės" : n ? "kelių sekundžių" : "kelias sekundes"
        }
        function a(e, t, a, n) {
            return t ? _(a)[0] : n ? _(a)[1] : _(a)[2]
        }
        function n(e) {
            return e % 10 === 0 || e > 10 && 20 > e
        }
        function _(e) {
            return d[e].split("_")
        }
        function s(e, t, s, r) {
            var d = e + " ";
            return 1 === e ? d + a(e, t, s[0], r) : t ? d + (n(e) ? _(s)[1] : _(s)[0]) : r ? d + _(s)[1] : d + (n(e) ? _(s)[1] : _(s)[2])
        }
        function r(e, t) {
            var a = -1 === t.indexOf("dddd LT"),
                n = i[e.weekday()];
            return a ? n : n.substring(0, n.length - 2) + "į"
        }
        var d = {
            m: "minutė_minutės_minutę",
            mm: "minutės_minučių_minutes",
            h: "valanda_valandos_valandą",
            hh: "valandos_valandų_valandas",
            d: "diena_dienos_dieną",
            dd: "dienos_dienų_dienas",
            M: "mėnuo_mėnesio_mėnesį",
            MM: "mėnesiai_mėnesių_mėnesius",
            y: "metai_metų_metus",
            yy: "metai_metų_metus"
        }, i = "pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis_sekmadienis".split("_");
        return e.lang("lt", {
            months: "sausio_vasario_kovo_balandžio_gegužės_biržėlio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_"),
            monthsShort: "sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),
            weekdays: r,
            weekdaysShort: "Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),
            weekdaysMin: "S_P_A_T_K_Pn_Š".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "YYYY-MM-DD",
                LL: "YYYY [m.] MMMM D [d.]",
                LLL: "YYYY [m.] MMMM D [d.], LT [val.]",
                LLLL: "YYYY [m.] MMMM D [d.], dddd, LT [val.]",
                l: "YYYY-MM-DD",
                ll: "YYYY [m.] MMMM D [d.]",
                lll: "YYYY [m.] MMMM D [d.], LT [val.]",
                llll: "YYYY [m.] MMMM D [d.], ddd, LT [val.]"
            },
            calendar: {
                sameDay: "[Šiandien] LT",
                nextDay: "[Rytoj] LT",
                nextWeek: "dddd LT",
                lastDay: "[Vakar] LT",
                lastWeek: "[Praėjusį] dddd LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "po %s",
                past: "prieš %s",
                s: t,
                m: a,
                mm: s,
                h: a,
                hh: s,
                d: a,
                dd: s,
                M: a,
                MM: s,
                y: a,
                yy: s
            },
            ordinal: function(e) {
                return e + "-oji"
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t, a) {
            var n = e.split("_");
            return a ? t % 10 === 1 && 11 !== t ? n[2] : n[3] : t % 10 === 1 && 11 !== t ? n[0] : n[1]
        }
        function a(e, a, _) {
            return e + " " + t(n[_], e, a)
        }
        var n = {
            mm: "minūti_minūtes_minūte_minūtes",
            hh: "stundu_stundas_stunda_stundas",
            dd: "dienu_dienas_diena_dienas",
            MM: "mēnesi_mēnešus_mēnesis_mēneši",
            yy: "gadu_gadus_gads_gadi"
        };
        return e.lang("lv", {
            months: "janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),
            monthsShort: "jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),
            weekdays: "svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),
            weekdaysShort: "Sv_P_O_T_C_Pk_S".split("_"),
            weekdaysMin: "Sv_P_O_T_C_Pk_S".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD.MM.YYYY",
                LL: "YYYY. [gada] D. MMMM",
                LLL: "YYYY. [gada] D. MMMM, LT",
                LLLL: "YYYY. [gada] D. MMMM, dddd, LT"
            },
            calendar: {
                sameDay: "[Šodien pulksten] LT",
                nextDay: "[Rīt pulksten] LT",
                nextWeek: "dddd [pulksten] LT",
                lastDay: "[Vakar pulksten] LT",
                lastWeek: "[Pagājušā] dddd [pulksten] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s vēlāk",
                past: "%s agrāk",
                s: "dažas sekundes",
                m: "minūti",
                mm: a,
                h: "stundu",
                hh: a,
                d: "dienu",
                dd: a,
                M: "mēnesi",
                MM: a,
                y: "gadu",
                yy: a
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("mk", {
            months: "јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),
            monthsShort: "јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),
            weekdays: "недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),
            weekdaysShort: "нед_пон_вто_сре_чет_пет_саб".split("_"),
            weekdaysMin: "нe_пo_вт_ср_че_пе_сa".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "D.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Денес во] LT",
                nextDay: "[Утре во] LT",
                nextWeek: "dddd [во] LT",
                lastDay: "[Вчера во] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 6:
                            return "[Во изминатата] dddd [во] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[Во изминатиот] dddd [во] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "после %s",
                past: "пред %s",
                s: "неколку секунди",
                m: "минута",
                mm: "%d минути",
                h: "час",
                hh: "%d часа",
                d: "ден",
                dd: "%d дена",
                M: "месец",
                MM: "%d месеци",
                y: "година",
                yy: "%d години"
            },
            ordinal: function(e) {
                var t = e % 10,
                    a = e % 100;
                return 0 === e ? e + "-ев" : 0 === a ? e + "-ен" : a > 10 && 20 > a ? e + "-ти" : 1 === t ? e + "-ви" : 2 === t ? e + "-ри" : 7 === t || 8 === t ? e + "-ми" : e + "-ти"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("ml", {
            months: "ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split("_"),
            monthsShort: "ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split("_"),
            weekdays: "ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split("_"),
            weekdaysShort: "ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),
            weekdaysMin: "ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),
            longDateFormat: {
                LT: "A h:mm -നു",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, LT",
                LLLL: "dddd, D MMMM YYYY, LT"
            },
            calendar: {
                sameDay: "[ഇന്ന്] LT",
                nextDay: "[നാളെ] LT",
                nextWeek: "dddd, LT",
                lastDay: "[ഇന്നലെ] LT",
                lastWeek: "[കഴിഞ്ഞ] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s കഴിഞ്ഞ്",
                past: "%s മുൻപ്",
                s: "അൽപ നിമിഷങ്ങൾ",
                m: "ഒരു മിനിറ്റ്",
                mm: "%d മിനിറ്റ്",
                h: "ഒരു മണിക്കൂർ",
                hh: "%d മണിക്കൂർ",
                d: "ഒരു ദിവസം",
                dd: "%d ദിവസം",
                M: "ഒരു മാസം",
                MM: "%d മാസം",
                y: "ഒരു വർഷം",
                yy: "%d വർഷം"
            },
            meridiem: function(e) {
                return 4 > e ? "രാത്രി" : 12 > e ? "രാവിലെ" : 17 > e ? "ഉച്ച കഴിഞ്ഞ്" : 20 > e ? "വൈകുന്നേരം" : "രാത്രി"
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        var t = {
            1: "१",
            2: "२",
            3: "३",
            4: "४",
            5: "५",
            6: "६",
            7: "७",
            8: "८",
            9: "९",
            0: "०"
        }, a = {
            "१": "1",
            "२": "2",
            "३": "3",
            "४": "4",
            "५": "5",
            "६": "6",
            "७": "7",
            "८": "8",
            "९": "9",
            "०": "0"
        };
        return e.lang("mr", {
            months: "जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),
            monthsShort: "जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),
            weekdays: "रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),
            weekdaysShort: "रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),
            weekdaysMin: "र_सो_मं_बु_गु_शु_श".split("_"),
            longDateFormat: {
                LT: "A h:mm वाजता",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, LT",
                LLLL: "dddd, D MMMM YYYY, LT"
            },
            calendar: {
                sameDay: "[आज] LT",
                nextDay: "[उद्या] LT",
                nextWeek: "dddd, LT",
                lastDay: "[काल] LT",
                lastWeek: "[मागील] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s नंतर",
                past: "%s पूर्वी",
                s: "सेकंद",
                m: "एक मिनिट",
                mm: "%d मिनिटे",
                h: "एक तास",
                hh: "%d तास",
                d: "एक दिवस",
                dd: "%d दिवस",
                M: "एक महिना",
                MM: "%d महिने",
                y: "एक वर्ष",
                yy: "%d वर्षे"
            },
            preparse: function(e) {
                return e.replace(/[१२३४५६७८९०]/g, function(e) {
                    return a[e]
                })
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                })
            },
            meridiem: function(e) {
                return 4 > e ? "रात्री" : 10 > e ? "सकाळी" : 17 > e ? "दुपारी" : 20 > e ? "सायंकाळी" : "रात्री"
            },
            week: {
                dow: 0,
                doy: 6
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("ms-my", {
            months: "Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),
            monthsShort: "Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),
            weekdays: "Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),
            weekdaysShort: "Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),
            weekdaysMin: "Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),
            longDateFormat: {
                LT: "HH.mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY [pukul] LT",
                LLLL: "dddd, D MMMM YYYY [pukul] LT"
            },
            meridiem: function(e) {
                return 11 > e ? "pagi" : 15 > e ? "tengahari" : 19 > e ? "petang" : "malam"
            },
            calendar: {
                sameDay: "[Hari ini pukul] LT",
                nextDay: "[Esok pukul] LT",
                nextWeek: "dddd [pukul] LT",
                lastDay: "[Kelmarin pukul] LT",
                lastWeek: "dddd [lepas pukul] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dalam %s",
                past: "%s yang lepas",
                s: "beberapa saat",
                m: "seminit",
                mm: "%d minit",
                h: "sejam",
                hh: "%d jam",
                d: "sehari",
                dd: "%d hari",
                M: "sebulan",
                MM: "%d bulan",
                y: "setahun",
                yy: "%d tahun"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("nb", {
            months: "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
            monthsShort: "jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.".split("_"),
            weekdays: "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
            weekdaysShort: "sø._ma._ti._on._to._fr._lø.".split("_"),
            weekdaysMin: "sø_ma_ti_on_to_fr_lø".split("_"),
            longDateFormat: {
                LT: "H.mm",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY [kl.] LT",
                LLLL: "dddd D. MMMM YYYY [kl.] LT"
            },
            calendar: {
                sameDay: "[i dag kl.] LT",
                nextDay: "[i morgen kl.] LT",
                nextWeek: "dddd [kl.] LT",
                lastDay: "[i går kl.] LT",
                lastWeek: "[forrige] dddd [kl.] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "om %s",
                past: "for %s siden",
                s: "noen sekunder",
                m: "ett minutt",
                mm: "%d minutter",
                h: "en time",
                hh: "%d timer",
                d: "en dag",
                dd: "%d dager",
                M: "en måned",
                MM: "%d måneder",
                y: "ett år",
                yy: "%d år"
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        var t = {
            1: "१",
            2: "२",
            3: "३",
            4: "४",
            5: "५",
            6: "६",
            7: "७",
            8: "८",
            9: "९",
            0: "०"
        }, a = {
            "१": "1",
            "२": "2",
            "३": "3",
            "४": "4",
            "५": "5",
            "६": "6",
            "७": "7",
            "८": "8",
            "९": "9",
            "०": "0"
        };
        return e.lang("ne", {
            months: "जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split("_"),
            monthsShort: "जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split("_"),
            weekdays: "आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split("_"),
            weekdaysShort: "आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),
            weekdaysMin: "आइ._सो._मङ्_बु._बि._शु._श.".split("_"),
            longDateFormat: {
                LT: "Aको h:mm बजे",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, LT",
                LLLL: "dddd, D MMMM YYYY, LT"
            },
            preparse: function(e) {
                return e.replace(/[१२३४५६७८९०]/g, function(e) {
                    return a[e]
                })
            },
            postformat: function(e) {
                return e.replace(/\d/g, function(e) {
                    return t[e]
                })
            },
            meridiem: function(e) {
                return 3 > e ? "राती" : 10 > e ? "बिहान" : 15 > e ? "दिउँसो" : 18 > e ? "बेलुका" : 20 > e ? "साँझ" : "राती"
            },
            calendar: {
                sameDay: "[आज] LT",
                nextDay: "[भोली] LT",
                nextWeek: "[आउँदो] dddd[,] LT",
                lastDay: "[हिजो] LT",
                lastWeek: "[गएको] dddd[,] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%sमा",
                past: "%s अगाडी",
                s: "केही समय",
                m: "एक मिनेट",
                mm: "%d मिनेट",
                h: "एक घण्टा",
                hh: "%d घण्टा",
                d: "एक दिन",
                dd: "%d दिन",
                M: "एक महिना",
                MM: "%d महिना",
                y: "एक बर्ष",
                yy: "%d बर्ष"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        var t = "jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),
            a = "jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_");
        return e.lang("nl", {
            months: "januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),
            monthsShort: function(e, n) {
                return /-MMM-/.test(n) ? a[e.month()] : t[e.month()]
            },
            weekdays: "zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),
            weekdaysShort: "zo._ma._di._wo._do._vr._za.".split("_"),
            weekdaysMin: "Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD-MM-YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[vandaag om] LT",
                nextDay: "[morgen om] LT",
                nextWeek: "dddd [om] LT",
                lastDay: "[gisteren om] LT",
                lastWeek: "[afgelopen] dddd [om] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "over %s",
                past: "%s geleden",
                s: "een paar seconden",
                m: "één minuut",
                mm: "%d minuten",
                h: "één uur",
                hh: "%d uur",
                d: "één dag",
                dd: "%d dagen",
                M: "één maand",
                MM: "%d maanden",
                y: "één jaar",
                yy: "%d jaar"
            },
            ordinal: function(e) {
                return e + (1 === e || 8 === e || e >= 20 ? "ste" : "de")
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("nn", {
            months: "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
            monthsShort: "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
            weekdays: "sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),
            weekdaysShort: "sun_mån_tys_ons_tor_fre_lau".split("_"),
            weekdaysMin: "su_må_ty_on_to_fr_lø".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[I dag klokka] LT",
                nextDay: "[I morgon klokka] LT",
                nextWeek: "dddd [klokka] LT",
                lastDay: "[I går klokka] LT",
                lastWeek: "[Føregående] dddd [klokka] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "om %s",
                past: "for %s siden",
                s: "noen sekund",
                m: "ett minutt",
                mm: "%d minutt",
                h: "en time",
                hh: "%d timar",
                d: "en dag",
                dd: "%d dagar",
                M: "en månad",
                MM: "%d månader",
                y: "ett år",
                yy: "%d år"
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e) {
            return 5 > e % 10 && e % 10 > 1 && ~~ (e / 10) % 10 !== 1
        }
        function a(e, a, n) {
            var _ = e + " ";
            switch (n) {
                case "m":
                    return a ? "minuta" : "minutę";
                case "mm":
                    return _ + (t(e) ? "minuty" : "minut");
                case "h":
                    return a ? "godzina" : "godzinę";
                case "hh":
                    return _ + (t(e) ? "godziny" : "godzin");
                case "MM":
                    return _ + (t(e) ? "miesiące" : "miesięcy");
                case "yy":
                    return _ + (t(e) ? "lata" : "lat")
            }
        }
        var n = "styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_"),
            _ = "stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_");
        return e.lang("pl", {
            months: function(e, t) {
                return /D MMMM/.test(t) ? _[e.month()] : n[e.month()]
            },
            monthsShort: "sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),
            weekdays: "niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),
            weekdaysShort: "nie_pon_wt_śr_czw_pt_sb".split("_"),
            weekdaysMin: "N_Pn_Wt_Śr_Cz_Pt_So".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Dziś o] LT",
                nextDay: "[Jutro o] LT",
                nextWeek: "[W] dddd [o] LT",
                lastDay: "[Wczoraj o] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[W zeszłą niedzielę o] LT";
                        case 3:
                            return "[W zeszłą środę o] LT";
                        case 6:
                            return "[W zeszłą sobotę o] LT";
                        default:
                            return "[W zeszły] dddd [o] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "%s temu",
                s: "kilka sekund",
                m: a,
                mm: a,
                h: a,
                hh: a,
                d: "1 dzień",
                dd: "%d dni",
                M: "miesiąc",
                MM: a,
                y: "rok",
                yy: a
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("pt-br", {
            months: "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),
            monthsShort: "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),
            weekdays: "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),
            weekdaysShort: "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
            weekdaysMin: "Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D [de] MMMM [de] YYYY",
                LLL: "D [de] MMMM [de] YYYY LT",
                LLLL: "dddd, D [de] MMMM [de] YYYY LT"
            },
            calendar: {
                sameDay: "[Hoje às] LT",
                nextDay: "[Amanhã às] LT",
                nextWeek: "dddd [às] LT",
                lastDay: "[Ontem às] LT",
                lastWeek: function() {
                    return 0 === this.day() || 6 === this.day() ? "[Último] dddd [às] LT" : "[Última] dddd [às] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "em %s",
                past: "%s atrás",
                s: "segundos",
                m: "um minuto",
                mm: "%d minutos",
                h: "uma hora",
                hh: "%d horas",
                d: "um dia",
                dd: "%d dias",
                M: "um mês",
                MM: "%d meses",
                y: "um ano",
                yy: "%d anos"
            },
            ordinal: "%dº"
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("pt", {
            months: "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),
            monthsShort: "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),
            weekdays: "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),
            weekdaysShort: "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
            weekdaysMin: "Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D [de] MMMM [de] YYYY",
                LLL: "D [de] MMMM [de] YYYY LT",
                LLLL: "dddd, D [de] MMMM [de] YYYY LT"
            },
            calendar: {
                sameDay: "[Hoje às] LT",
                nextDay: "[Amanhã às] LT",
                nextWeek: "dddd [às] LT",
                lastDay: "[Ontem às] LT",
                lastWeek: function() {
                    return 0 === this.day() || 6 === this.day() ? "[Último] dddd [às] LT" : "[Última] dddd [às] LT"
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "em %s",
                past: "%s atrás",
                s: "segundos",
                m: "um minuto",
                mm: "%d minutos",
                h: "uma hora",
                hh: "%d horas",
                d: "um dia",
                dd: "%d dias",
                M: "um mês",
                MM: "%d meses",
                y: "um ano",
                yy: "%d anos"
            },
            ordinal: "%dº",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t, a) {
            var n = {
                mm: "minute",
                hh: "ore",
                dd: "zile",
                MM: "luni",
                yy: "ani"
            }, _ = " ";
            return (e % 100 >= 20 || e >= 100 && e % 100 === 0) && (_ = " de "), e + _ + n[a]
        }
        return e.lang("ro", {
            months: "ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),
            monthsShort: "ian_feb_mar_apr_mai_iun_iul_aug_sep_oct_noi_dec".split("_"),
            weekdays: "duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),
            weekdaysShort: "Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),
            weekdaysMin: "Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY H:mm",
                LLLL: "dddd, D MMMM YYYY H:mm"
            },
            calendar: {
                sameDay: "[azi la] LT",
                nextDay: "[mâine la] LT",
                nextWeek: "dddd [la] LT",
                lastDay: "[ieri la] LT",
                lastWeek: "[fosta] dddd [la] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "peste %s",
                past: "%s în urmă",
                s: "câteva secunde",
                m: "un minut",
                mm: t,
                h: "o oră",
                hh: t,
                d: "o zi",
                dd: t,
                M: "o lună",
                MM: t,
                y: "un an",
                yy: t
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t, a) {
            var n = e + " ";
            switch (a) {
                case "m":
                    return t ? "jedna minuta" : "jedne minute";
                case "mm":
                    return n += 1 === e ? "minuta" : 2 === e || 3 === e || 4 === e ? "minute" : "minuta";
                case "h":
                    return t ? "jedan sat" : "jednog sata";
                case "hh":
                    return n += 1 === e ? "sat" : 2 === e || 3 === e || 4 === e ? "sata" : "sati";
                case "dd":
                    return n += 1 === e ? "dan" : "dana";
                case "MM":
                    return n += 1 === e ? "mesec" : 2 === e || 3 === e || 4 === e ? "meseca" : "meseci";
                case "yy":
                    return n += 1 === e ? "godina" : 2 === e || 3 === e || 4 === e ? "godine" : "godina"
            }
        }
        return e.lang("rs", {
            months: "januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split("_"),
            monthsShort: "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),
            weekdays: "nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota".split("_"),
            weekdaysShort: "ned._pon._uto._sre._čet._pet._sub.".split("_"),
            weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "DD. MM. YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[danas u] LT",
                nextDay: "[sutra u] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[u] [nedelju] [u] LT";
                        case 3:
                            return "[u] [sredu] [u] LT";
                        case 6:
                            return "[u] [subotu] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[u] dddd [u] LT"
                    }
                },
                lastDay: "[juče u] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                        case 3:
                            return "[prošlu] dddd [u] LT";
                        case 6:
                            return "[prošle] [subote] [u] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[prošli] dddd [u] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "pre %s",
                s: "par sekundi",
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: "dan",
                dd: t,
                M: "mesec",
                MM: t,
                y: "godinu",
                yy: t
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t) {
            var a = e.split("_");
            return t % 10 === 1 && t % 100 !== 11 ? a[0] : t % 10 >= 2 && 4 >= t % 10 && (10 > t % 100 || t % 100 >= 20) ? a[1] : a[2]
        }
        function a(e, a, n) {
            var _ = {
                mm: "минута_минуты_минут",
                hh: "час_часа_часов",
                dd: "день_дня_дней",
                MM: "месяц_месяца_месяцев",
                yy: "год_года_лет"
            };
            return "m" === n ? a ? "минута" : "минуту" : e + " " + t(_[n], + e)
        }
        function n(e, t) {
            var a = {
                nominative: "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),
                accusative: "января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_")
            }, n = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(t) ? "accusative" : "nominative";
            return a[n][e.month()]
        }
        function _(e, t) {
            var a = {
                nominative: "янв_фев_мар_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split("_"),
                accusative: "янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек".split("_")
            }, n = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(t) ? "accusative" : "nominative";
            return a[n][e.month()]
        }
        function s(e, t) {
            var a = {
                nominative: "воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),
                accusative: "воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_")
            }, n = /\[ ?[Вв] ?(?:прошлую|следующую)? ?\] ?dddd/.test(t) ? "accusative" : "nominative";
            return a[n][e.day()]
        }
        return e.lang("ru", {
            months: n,
            monthsShort: _,
            weekdays: s,
            weekdaysShort: "вс_пн_вт_ср_чт_пт_сб".split("_"),
            weekdaysMin: "вс_пн_вт_ср_чт_пт_сб".split("_"),
            monthsParse: [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[й|я]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i],
            longDateFormat: {
                LT: "HH:mm",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY г.",
                LLL: "D MMMM YYYY г., LT",
                LLLL: "dddd, D MMMM YYYY г., LT"
            },
            calendar: {
                sameDay: "[Сегодня в] LT",
                nextDay: "[Завтра в] LT",
                lastDay: "[Вчера в] LT",
                nextWeek: function() {
                    return 2 === this.day() ? "[Во] dddd [в] LT" : "[В] dddd [в] LT"
                },
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[В прошлое] dddd [в] LT";
                        case 1:
                        case 2:
                        case 4:
                            return "[В прошлый] dddd [в] LT";
                        case 3:
                        case 5:
                        case 6:
                            return "[В прошлую] dddd [в] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "через %s",
                past: "%s назад",
                s: "несколько секунд",
                m: a,
                mm: a,
                h: "час",
                hh: a,
                d: "день",
                dd: a,
                M: "месяц",
                MM: a,
                y: "год",
                yy: a
            },
            meridiem: function(e) {
                return 4 > e ? "ночи" : 12 > e ? "утра" : 17 > e ? "дня" : "вечера"
            },
            ordinal: function(e, t) {
                switch (t) {
                    case "M":
                    case "d":
                    case "DDD":
                        return e + "-й";
                    case "D":
                        return e + "-го";
                    case "w":
                    case "W":
                        return e + "-я";
                    default:
                        return e
                }
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e) {
            return e > 1 && 5 > e
        }
        function a(e, a, n, _) {
            var s = e + " ";
            switch (n) {
                case "s":
                    return a || _ ? "pár sekúnd" : "pár sekundami";
                case "m":
                    return a ? "minúta" : _ ? "minútu" : "minútou";
                case "mm":
                    return a || _ ? s + (t(e) ? "minúty" : "minút") : s + "minútami";
                case "h":
                    return a ? "hodina" : _ ? "hodinu" : "hodinou";
                case "hh":
                    return a || _ ? s + (t(e) ? "hodiny" : "hodín") : s + "hodinami";
                case "d":
                    return a || _ ? "deň" : "dňom";
                case "dd":
                    return a || _ ? s + (t(e) ? "dni" : "dní") : s + "dňami";
                case "M":
                    return a || _ ? "mesiac" : "mesiacom";
                case "MM":
                    return a || _ ? s + (t(e) ? "mesiace" : "mesiacov") : s + "mesiacmi";
                case "y":
                    return a || _ ? "rok" : "rokom";
                case "yy":
                    return a || _ ? s + (t(e) ? "roky" : "rokov") : s + "rokmi"
            }
        }
        var n = "január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_"),
            _ = "jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_");
        return e.lang("sk", {
            months: n,
            monthsShort: _,
            monthsParse: function(e, t) {
                var a, n = [];
                for (a = 0; 12 > a; a++) n[a] = new RegExp("^" + e[a] + "$|^" + t[a] + "$", "i");
                return n
            }(n, _),
            weekdays: "nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),
            weekdaysShort: "ne_po_ut_st_št_pi_so".split("_"),
            weekdaysMin: "ne_po_ut_st_št_pi_so".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "DD.MM.YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[dnes o] LT",
                nextDay: "[zajtra o] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[v nedeľu o] LT";
                        case 1:
                        case 2:
                            return "[v] dddd [o] LT";
                        case 3:
                            return "[v stredu o] LT";
                        case 4:
                            return "[vo štvrtok o] LT";
                        case 5:
                            return "[v piatok o] LT";
                        case 6:
                            return "[v sobotu o] LT"
                    }
                },
                lastDay: "[včera o] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[minulú nedeľu o] LT";
                        case 1:
                        case 2:
                            return "[minulý] dddd [o] LT";
                        case 3:
                            return "[minulú stredu o] LT";
                        case 4:
                        case 5:
                            return "[minulý] dddd [o] LT";
                        case 6:
                            return "[minulú sobotu o] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "za %s",
                past: "pred %s",
                s: a,
                m: a,
                mm: a,
                h: a,
                hh: a,
                d: a,
                dd: a,
                M: a,
                MM: a,
                y: a,
                yy: a
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t, a) {
            var n = e + " ";
            switch (a) {
                case "m":
                    return t ? "ena minuta" : "eno minuto";
                case "mm":
                    return n += 1 === e ? "minuta" : 2 === e ? "minuti" : 3 === e || 4 === e ? "minute" : "minut";
                case "h":
                    return t ? "ena ura" : "eno uro";
                case "hh":
                    return n += 1 === e ? "ura" : 2 === e ? "uri" : 3 === e || 4 === e ? "ure" : "ur";
                case "dd":
                    return n += 1 === e ? "dan" : "dni";
                case "MM":
                    return n += 1 === e ? "mesec" : 2 === e ? "meseca" : 3 === e || 4 === e ? "mesece" : "mesecev";
                case "yy":
                    return n += 1 === e ? "leto" : 2 === e ? "leti" : 3 === e || 4 === e ? "leta" : "let"
            }
        }
        return e.lang("sl", {
            months: "januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),
            monthsShort: "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),
            weekdays: "nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),
            weekdaysShort: "ned._pon._tor._sre._čet._pet._sob.".split("_"),
            weekdaysMin: "ne_po_to_sr_če_pe_so".split("_"),
            longDateFormat: {
                LT: "H:mm",
                L: "DD. MM. YYYY",
                LL: "D. MMMM YYYY",
                LLL: "D. MMMM YYYY LT",
                LLLL: "dddd, D. MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[danes ob] LT",
                nextDay: "[jutri ob] LT",
                nextWeek: function() {
                    switch (this.day()) {
                        case 0:
                            return "[v] [nedeljo] [ob] LT";
                        case 3:
                            return "[v] [sredo] [ob] LT";
                        case 6:
                            return "[v] [soboto] [ob] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[v] dddd [ob] LT"
                    }
                },
                lastDay: "[včeraj ob] LT",
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 6:
                            return "[prejšnja] dddd [ob] LT";
                        case 1:
                        case 2:
                        case 4:
                        case 5:
                            return "[prejšnji] dddd [ob] LT"
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "čez %s",
                past: "%s nazaj",
                s: "nekaj sekund",
                m: t,
                mm: t,
                h: t,
                hh: t,
                d: "en dan",
                dd: t,
                M: "en mesec",
                MM: t,
                y: "eno leto",
                yy: t
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("sq", {
            months: "Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),
            monthsShort: "Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),
            weekdays: "E Diel_E Hënë_E Marte_E Mërkure_E Enjte_E Premte_E Shtunë".split("_"),
            weekdaysShort: "Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),
            weekdaysMin: "D_H_Ma_Më_E_P_Sh".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Sot në] LT",
                nextDay: "[Neser në] LT",
                nextWeek: "dddd [në] LT",
                lastDay: "[Dje në] LT",
                lastWeek: "dddd [e kaluar në] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "në %s",
                past: "%s me parë",
                s: "disa sekonda",
                m: "një minut",
                mm: "%d minuta",
                h: "një orë",
                hh: "%d orë",
                d: "një ditë",
                dd: "%d ditë",
                M: "një muaj",
                MM: "%d muaj",
                y: "një vit",
                yy: "%d vite"
            },
            ordinal: "%d.",
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("sv", {
            months: "januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),
            monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
            weekdays: "söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),
            weekdaysShort: "sön_mån_tis_ons_tor_fre_lör".split("_"),
            weekdaysMin: "sö_må_ti_on_to_fr_lö".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "YYYY-MM-DD",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[Idag] LT",
                nextDay: "[Imorgon] LT",
                lastDay: "[Igår] LT",
                nextWeek: "dddd LT",
                lastWeek: "[Förra] dddd[en] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "om %s",
                past: "för %s sedan",
                s: "några sekunder",
                m: "en minut",
                mm: "%d minuter",
                h: "en timme",
                hh: "%d timmar",
                d: "en dag",
                dd: "%d dagar",
                M: "en månad",
                MM: "%d månader",
                y: "ett år",
                yy: "%d år"
            },
            ordinal: function(e) {
                var t = e % 10,
                    a = 1 === ~~ (e % 100 / 10) ? "e" : 1 === t ? "a" : 2 === t ? "a" : 3 === t ? "e" : "e";
                return e + a
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("ta", {
            months: "ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),
            monthsShort: "ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),
            weekdays: "ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split("_"),
            weekdaysShort: "ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split("_"),
            weekdaysMin: "ஞா_தி_செ_பு_வி_வெ_ச".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY, LT",
                LLLL: "dddd, D MMMM YYYY, LT"
            },
            calendar: {
                sameDay: "[இன்று] LT",
                nextDay: "[நாளை] LT",
                nextWeek: "dddd, LT",
                lastDay: "[நேற்று] LT",
                lastWeek: "[கடந்த வாரம்] dddd, LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s இல்",
                past: "%s முன்",
                s: "ஒரு சில விநாடிகள்",
                m: "ஒரு நிமிடம்",
                mm: "%d நிமிடங்கள்",
                h: "ஒரு மணி நேரம்",
                hh: "%d மணி நேரம்",
                d: "ஒரு நாள்",
                dd: "%d நாட்கள்",
                M: "ஒரு மாதம்",
                MM: "%d மாதங்கள்",
                y: "ஒரு வருடம்",
                yy: "%d ஆண்டுகள்"
            },
            ordinal: function(e) {
                return e + "வது"
            },
            meridiem: function(e) {
                return e >= 6 && 10 >= e ? " காலை" : e >= 10 && 14 >= e ? " நண்பகல்" : e >= 14 && 18 >= e ? " எற்பாடு" : e >= 18 && 20 >= e ? " மாலை" : e >= 20 && 24 >= e ? " இரவு" : e >= 0 && 6 >= e ? " வைகறை" : void 0
            },
            week: {
                dow: 0,
                doy: 6
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("th", {
            months: "มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),
            monthsShort: "มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา".split("_"),
            weekdays: "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),
            weekdaysShort: "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),
            weekdaysMin: "อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),
            longDateFormat: {
                LT: "H นาฬิกา m นาที",
                L: "YYYY/MM/DD",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY เวลา LT",
                LLLL: "วันddddที่ D MMMM YYYY เวลา LT"
            },
            meridiem: function(e) {
                return 12 > e ? "ก่อนเที่ยง" : "หลังเที่ยง"
            },
            calendar: {
                sameDay: "[วันนี้ เวลา] LT",
                nextDay: "[พรุ่งนี้ เวลา] LT",
                nextWeek: "dddd[หน้า เวลา] LT",
                lastDay: "[เมื่อวานนี้ เวลา] LT",
                lastWeek: "[วัน]dddd[ที่แล้ว เวลา] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "อีก %s",
                past: "%sที่แล้ว",
                s: "ไม่กี่วินาที",
                m: "1 นาที",
                mm: "%d นาที",
                h: "1 ชั่วโมง",
                hh: "%d ชั่วโมง",
                d: "1 วัน",
                dd: "%d วัน",
                M: "1 เดือน",
                MM: "%d เดือน",
                y: "1 ปี",
                yy: "%d ปี"
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("tl-ph", {
            months: "Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),
            monthsShort: "Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),
            weekdays: "Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),
            weekdaysShort: "Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),
            weekdaysMin: "Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "MM/D/YYYY",
                LL: "MMMM D, YYYY",
                LLL: "MMMM D, YYYY LT",
                LLLL: "dddd, MMMM DD, YYYY LT"
            },
            calendar: {
                sameDay: "[Ngayon sa] LT",
                nextDay: "[Bukas sa] LT",
                nextWeek: "dddd [sa] LT",
                lastDay: "[Kahapon sa] LT",
                lastWeek: "dddd [huling linggo] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "sa loob ng %s",
                past: "%s ang nakalipas",
                s: "ilang segundo",
                m: "isang minuto",
                mm: "%d minuto",
                h: "isang oras",
                hh: "%d oras",
                d: "isang araw",
                dd: "%d araw",
                M: "isang buwan",
                MM: "%d buwan",
                y: "isang taon",
                yy: "%d taon"
            },
            ordinal: function(e) {
                return e
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        var t = {
            1: "'inci",
            5: "'inci",
            8: "'inci",
            70: "'inci",
            80: "'inci",
            2: "'nci",
            7: "'nci",
            20: "'nci",
            50: "'nci",
            3: "'üncü",
            4: "'üncü",
            100: "'üncü",
            6: "'ncı",
            9: "'uncu",
            10: "'uncu",
            30: "'uncu",
            60: "'ıncı",
            90: "'ıncı"
        };
        return e.lang("tr", {
            months: "Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),
            monthsShort: "Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),
            weekdays: "Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),
            weekdaysShort: "Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),
            weekdaysMin: "Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[bugün saat] LT",
                nextDay: "[yarın saat] LT",
                nextWeek: "[haftaya] dddd [saat] LT",
                lastDay: "[dün] LT",
                lastWeek: "[geçen hafta] dddd [saat] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s sonra",
                past: "%s önce",
                s: "birkaç saniye",
                m: "bir dakika",
                mm: "%d dakika",
                h: "bir saat",
                hh: "%d saat",
                d: "bir gün",
                dd: "%d gün",
                M: "bir ay",
                MM: "%d ay",
                y: "bir yıl",
                yy: "%d yıl"
            },
            ordinal: function(e) {
                if (0 === e) return e + "'ıncı";
                var a = e % 10,
                    n = e % 100 - a,
                    _ = e >= 100 ? 100 : null;
                return e + (t[a] || t[n] || t[_])
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("tzm-la", {
            months: "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),
            monthsShort: "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),
            weekdays: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
            weekdaysShort: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
            weekdaysMin: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[asdkh g] LT",
                nextDay: "[aska g] LT",
                nextWeek: "dddd [g] LT",
                lastDay: "[assant g] LT",
                lastWeek: "dddd [g] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "dadkh s yan %s",
                past: "yan %s",
                s: "imik",
                m: "minuḍ",
                mm: "%d minuḍ",
                h: "saɛa",
                hh: "%d tassaɛin",
                d: "ass",
                dd: "%d ossan",
                M: "ayowr",
                MM: "%d iyyirn",
                y: "asgas",
                yy: "%d isgasn"
            },
            week: {
                dow: 6,
                doy: 12
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("tzm", {
            months: "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),
            monthsShort: "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),
            weekdays: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
            weekdaysShort: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
            weekdaysMin: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd D MMMM YYYY LT"
            },
            calendar: {
                sameDay: "[ⴰⵙⴷⵅ ⴴ] LT",
                nextDay: "[ⴰⵙⴽⴰ ⴴ] LT",
                nextWeek: "dddd [ⴴ] LT",
                lastDay: "[ⴰⵚⴰⵏⵜ ⴴ] LT",
                lastWeek: "dddd [ⴴ] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",
                past: "ⵢⴰⵏ %s",
                s: "ⵉⵎⵉⴽ",
                m: "ⵎⵉⵏⵓⴺ",
                mm: "%d ⵎⵉⵏⵓⴺ",
                h: "ⵙⴰⵄⴰ",
                hh: "%d ⵜⴰⵙⵙⴰⵄⵉⵏ",
                d: "ⴰⵙⵙ",
                dd: "%d oⵙⵙⴰⵏ",
                M: "ⴰⵢoⵓⵔ",
                MM: "%d ⵉⵢⵢⵉⵔⵏ",
                y: "ⴰⵙⴳⴰⵙ",
                yy: "%d ⵉⵙⴳⴰⵙⵏ"
            },
            week: {
                dow: 6,
                doy: 12
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        function t(e, t) {
            var a = e.split("_");
            return t % 10 === 1 && t % 100 !== 11 ? a[0] : t % 10 >= 2 && 4 >= t % 10 && (10 > t % 100 || t % 100 >= 20) ? a[1] : a[2]
        }
        function a(e, a, n) {
            var _ = {
                mm: "хвилина_хвилини_хвилин",
                hh: "година_години_годин",
                dd: "день_дні_днів",
                MM: "місяць_місяці_місяців",
                yy: "рік_роки_років"
            };
            return "m" === n ? a ? "хвилина" : "хвилину" : "h" === n ? a ? "година" : "годину" : e + " " + t(_[n], + e)
        }
        function n(e, t) {
            var a = {
                nominative: "січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_"),
                accusative: "січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_")
            }, n = /D[oD]? *MMMM?/.test(t) ? "accusative" : "nominative";
            return a[n][e.month()]
        }
        function _(e, t) {
            var a = {
                nominative: "неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),
                accusative: "неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),
                genitive: "неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")
            }, n = /(\[[ВвУу]\]) ?dddd/.test(t) ? "accusative" : /\[?(?:минулої|наступної)? ?\] ?dddd/.test(t) ? "genitive" : "nominative";
            return a[n][e.day()]
        }
        function s(e) {
            return function() {
                return e + "о" + (11 === this.hours() ? "б" : "") + "] LT"
            }
        }
        return e.lang("uk", {
            months: n,
            monthsShort: "січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),
            weekdays: _,
            weekdaysShort: "нд_пн_вт_ср_чт_пт_сб".split("_"),
            weekdaysMin: "нд_пн_вт_ср_чт_пт_сб".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD.MM.YYYY",
                LL: "D MMMM YYYY р.",
                LLL: "D MMMM YYYY р., LT",
                LLLL: "dddd, D MMMM YYYY р., LT"
            },
            calendar: {
                sameDay: s("[Сьогодні "),
                nextDay: s("[Завтра "),
                lastDay: s("[Вчора "),
                nextWeek: s("[У] dddd ["),
                lastWeek: function() {
                    switch (this.day()) {
                        case 0:
                        case 3:
                        case 5:
                        case 6:
                            return s("[Минулої] dddd [").call(this);
                        case 1:
                        case 2:
                        case 4:
                            return s("[Минулого] dddd [").call(this)
                    }
                },
                sameElse: "L"
            },
            relativeTime: {
                future: "за %s",
                past: "%s тому",
                s: "декілька секунд",
                m: a,
                mm: a,
                h: "годину",
                hh: a,
                d: "день",
                dd: a,
                M: "місяць",
                MM: a,
                y: "рік",
                yy: a
            },
            meridiem: function(e) {
                return 4 > e ? "ночі" : 12 > e ? "ранку" : 17 > e ? "дня" : "вечора"
            },
            ordinal: function(e, t) {
                switch (t) {
                    case "M":
                    case "d":
                    case "DDD":
                    case "w":
                    case "W":
                        return e + "-й";
                    case "D":
                        return e + "-го";
                    default:
                        return e
                }
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("uz", {
            months: "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),
            monthsShort: "янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),
            weekdays: "Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),
            weekdaysShort: "Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),
            weekdaysMin: "Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "D MMMM YYYY, dddd LT"
            },
            calendar: {
                sameDay: "[Бугун соат] LT [да]",
                nextDay: "[Эртага] LT [да]",
                nextWeek: "dddd [куни соат] LT [да]",
                lastDay: "[Кеча соат] LT [да]",
                lastWeek: "[Утган] dddd [куни соат] LT [да]",
                sameElse: "L"
            },
            relativeTime: {
                future: "Якин %s ичида",
                past: "Бир неча %s олдин",
                s: "фурсат",
                m: "бир дакика",
                mm: "%d дакика",
                h: "бир соат",
                hh: "%d соат",
                d: "бир кун",
                dd: "%d кун",
                M: "бир ой",
                MM: "%d ой",
                y: "бир йил",
                yy: "%d йил"
            },
            week: {
                dow: 1,
                doy: 7
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("vn", {
            months: "tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),
            monthsShort: "Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),
            weekdays: "chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),
            weekdaysShort: "CN_T2_T3_T4_T5_T6_T7".split("_"),
            weekdaysMin: "CN_T2_T3_T4_T5_T6_T7".split("_"),
            longDateFormat: {
                LT: "HH:mm",
                L: "DD/MM/YYYY",
                LL: "D MMMM [năm] YYYY",
                LLL: "D MMMM [năm] YYYY LT",
                LLLL: "dddd, D MMMM [năm] YYYY LT",
                l: "DD/M/YYYY",
                ll: "D MMM YYYY",
                lll: "D MMM YYYY LT",
                llll: "ddd, D MMM YYYY LT"
            },
            calendar: {
                sameDay: "[Hôm nay lúc] LT",
                nextDay: "[Ngày mai lúc] LT",
                nextWeek: "dddd [tuần tới lúc] LT",
                lastDay: "[Hôm qua lúc] LT",
                lastWeek: "dddd [tuần rồi lúc] LT",
                sameElse: "L"
            },
            relativeTime: {
                future: "%s tới",
                past: "%s trước",
                s: "vài giây",
                m: "một phút",
                mm: "%d phút",
                h: "một giờ",
                hh: "%d giờ",
                d: "một ngày",
                dd: "%d ngày",
                M: "một tháng",
                MM: "%d tháng",
                y: "một năm",
                yy: "%d năm"
            },
            ordinal: function(e) {
                return e
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("zh-cn", {
            months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
            monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
            weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
            weekdaysMin: "日_一_二_三_四_五_六".split("_"),
            longDateFormat: {
                LT: "Ah点mm",
                L: "YYYY-MM-DD",
                LL: "YYYY年MMMD日",
                LLL: "YYYY年MMMD日LT",
                LLLL: "YYYY年MMMD日ddddLT",
                l: "YYYY-MM-DD",
                ll: "YYYY年MMMD日",
                lll: "YYYY年MMMD日LT",
                llll: "YYYY年MMMD日ddddLT"
            },
            meridiem: function(e, t) {
                var a = 100 * e + t;
                return 600 > a ? "凌晨" : 900 > a ? "早上" : 1130 > a ? "上午" : 1230 > a ? "中午" : 1800 > a ? "下午" : "晚上"
            },
            calendar: {
                sameDay: function() {
                    return 0 === this.minutes() ? "[今天]Ah[点整]" : "[今天]LT"
                },
                nextDay: function() {
                    return 0 === this.minutes() ? "[明天]Ah[点整]" : "[明天]LT"
                },
                lastDay: function() {
                    return 0 === this.minutes() ? "[昨天]Ah[点整]" : "[昨天]LT"
                },
                nextWeek: function() {
                    var t, a;
                    return t = e().startOf("week"), a = this.unix() - t.unix() >= 604800 ? "[下]" : "[本]", 0 === this.minutes() ? a + "dddAh点整" : a + "dddAh点mm"
                },
                lastWeek: function() {
                    var t, a;
                    return t = e().startOf("week"), a = this.unix() < t.unix() ? "[上]" : "[本]", 0 === this.minutes() ? a + "dddAh点整" : a + "dddAh点mm"
                },
                sameElse: "LL"
            },
            ordinal: function(e, t) {
                switch (t) {
                    case "d":
                    case "D":
                    case "DDD":
                        return e + "日";
                    case "M":
                        return e + "月";
                    case "w":
                    case "W":
                        return e + "周";
                    default:
                        return e
                }
            },
            relativeTime: {
                future: "%s内",
                past: "%s前",
                s: "几秒",
                m: "1分钟",
                mm: "%d分钟",
                h: "1小时",
                hh: "%d小时",
                d: "1天",
                dd: "%d天",
                M: "1个月",
                MM: "%d个月",
                y: "1年",
                yy: "%d年"
            },
            week: {
                dow: 1,
                doy: 4
            }
        })
    }),
    function(e) {
        e(nt)
    }(function(e) {
        return e.lang("zh-tw", {
            months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
            monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
            weekdaysShort: "週日_週一_週二_週三_週四_週五_週六".split("_"),
            weekdaysMin: "日_一_二_三_四_五_六".split("_"),
            longDateFormat: {
                LT: "Ah點mm",
                L: "YYYY年MMMD日",
                LL: "YYYY年MMMD日",
                LLL: "YYYY年MMMD日LT",
                LLLL: "YYYY年MMMD日ddddLT",
                l: "YYYY年MMMD日",
                ll: "YYYY年MMMD日",
                lll: "YYYY年MMMD日LT",
                llll: "YYYY年MMMD日ddddLT"
            },
            meridiem: function(e, t) {
                var a = 100 * e + t;
                return 900 > a ? "早上" : 1130 > a ? "上午" : 1230 > a ? "中午" : 1800 > a ? "下午" : "晚上"
            },
            calendar: {
                sameDay: "[今天]LT",
                nextDay: "[明天]LT",
                nextWeek: "[下]ddddLT",
                lastDay: "[昨天]LT",
                lastWeek: "[上]ddddLT",
                sameElse: "L"
            },
            ordinal: function(e, t) {
                switch (t) {
                    case "d":
                    case "D":
                    case "DDD":
                        return e + "日";
                    case "M":
                        return e + "月";
                    case "w":
                    case "W":
                        return e + "週";
                    default:
                        return e
                }
            },
            relativeTime: {
                future: "%s內",
                past: "%s前",
                s: "幾秒",
                m: "一分鐘",
                mm: "%d分鐘",
                h: "一小時",
                hh: "%d小時",
                d: "一天",
                dd: "%d天",
                M: "一個月",
                MM: "%d個月",
                y: "一年",
                yy: "%d年"
            }
        })
    }), nt.lang("en"), Yt ? (module.exports = nt, at(!0)) : "function" == typeof define && define.amd ? define("moment", ["require", "exports", "module"], function(t, a, n) {
        return n.config && n.config() && n.config().noGlobal !== !0 && at(n.config().noGlobal === e), nt
    }) : at()
}).call(this);
(function(t) {
    function e(r, n) {
        function o(t) {
            if (o[t] !== y) return o[t];
            var e;
            if ("bug-string-char-index" == t) e = "a" != "a" [0];
            else if ("json" == t) e = o("json-stringify") && o("json-parse");
            else {
                var r, a = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                if ("json-stringify" == t) {
                    var f = n.stringify,
                        s = "function" == typeof f && d;
                    if (s) {
                        (r = function() {
                            return 1
                        }).toJSON = r;
                        try {
                            s = "0" === f(0) && "0" === f(new c) && '""' == f(new i) && f(v) === y && f(y) === y && f() === y && "1" === f(r) && "[1]" == f([r]) && "[null]" == f([y]) && "null" == f(null) && "[null,null,null]" == f([y, v, null]) && f({
                                a: [r, !0, !1, null, "\x00\b\n\f\r	"]
                            }) == a && "1" === f(null, r) && "[\n 1,\n 2\n]" == f([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == f(new l(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == f(new l(864e13)) && '"-000001-01-01T00:00:00.000Z"' == f(new l(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == f(new l(-1))
                        } catch (u) {
                            s = !1
                        }
                    }
                    e = s
                }
                if ("json-parse" == t) {
                    var h = n.parse;
                    if ("function" == typeof h) try {
                        if (0 === h("0") && !h(!1)) {
                            r = h(a);
                            var p = 5 == r.a.length && 1 === r.a[0];
                            if (p) {
                                try {
                                    p = !h('"	"')
                                } catch (u) {}
                                if (p) try {
                                    p = 1 !== h("01")
                                } catch (u) {}
                                if (p) try {
                                    p = 1 !== h("1.")
                                } catch (u) {}
                            }
                        }
                    } catch (u) {
                        p = !1
                    }
                    e = p
                }
            }
            return o[t] = !! e
        }
        r || (r = t.Object()), n || (n = t.Object());
        var c = r.Number || t.Number,
            i = r.String || t.String,
            a = r.Object || t.Object,
            l = r.Date || t.Date,
            f = r.SyntaxError || t.SyntaxError,
            s = r.TypeError || t.TypeError,
            u = r.Math || t.Math,
            h = r.JSON || t.JSON;
        "object" == typeof h && h && (n.stringify = h.stringify, n.parse = h.parse);
        var p, g, y, b = a.prototype,
            v = b.toString,
            d = new l(-0xc782b5b800cec);
        try {
            d = -109252 == d.getUTCFullYear() && 0 === d.getUTCMonth() && 1 === d.getUTCDate() && 10 == d.getUTCHours() && 37 == d.getUTCMinutes() && 6 == d.getUTCSeconds() && 708 == d.getUTCMilliseconds()
        } catch (C) {}
        if (!o("json")) {
            var j = "[object Function]",
                S = "[object Date]",
                O = "[object Number]",
                T = "[object String]",
                A = "[object Array]",
                _ = "[object Boolean]",
                w = o("bug-string-char-index");
            if (!d) var N = u.floor,
                U = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                x = function(t, e) {
                    return U[e] + 365 * (t - 1970) + N((t - 1969 + (e = +(e > 1))) / 4) - N((t - 1901 + e) / 100) + N((t - 1601 + e) / 400)
                };
            (p = b.hasOwnProperty) || (p = function(t) {
                var e, r = {};
                return (r.__proto__ = null, r.__proto__ = {
                    toString: 1
                }, r).toString != v ? p = function(t) {
                    var e = this.__proto__,
                        r = t in (this.__proto__ = null, this);
                    return this.__proto__ = e, r
                } : (e = r.constructor, p = function(t) {
                    var r = (this.constructor || e).prototype;
                    return t in this && !(t in r && this[t] === r[t])
                }), r = null, p.call(this, t)
            });
            var J = {
                "boolean": 1,
                number: 1,
                string: 1,
                undefined: 1
            }, M = function(t, e) {
                var r = typeof t[e];
                return "object" == r ? !! t[e] : !J[r]
            };
            if (g = function(t, e) {
                var r, n, o, c = 0;
                (r = function() {
                    this.valueOf = 0
                }).prototype.valueOf = 0, n = new r;
                for (o in n) p.call(n, o) && c++;
                return r = n = null, c ? g = 2 == c ? function(t, e) {
                    var r, n = {}, o = v.call(t) == j;
                    for (r in t) o && "prototype" == r || p.call(n, r) || !(n[r] = 1) || !p.call(t, r) || e(r)
                } : function(t, e) {
                    var r, n, o = v.call(t) == j;
                    for (r in t) o && "prototype" == r || !p.call(t, r) || (n = "constructor" === r) || e(r);
                    (n || p.call(t, r = "constructor")) && e(r)
                } : (n = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], g = function(t, e) {
                    var r, o, c = v.call(t) == j,
                        i = !c && "function" != typeof t.constructor && M(t, "hasOwnProperty") ? t.hasOwnProperty : p;
                    for (r in t) c && "prototype" == r || !i.call(t, r) || e(r);
                    for (o = n.length; r = n[--o]; i.call(t, r) && e(r));
                }), g(t, e)
            }, !o("json-stringify")) {
                var m = {
                    92: "\\\\",
                    34: '\\"',
                    8: "\\b",
                    12: "\\f",
                    10: "\\n",
                    13: "\\r",
                    9: "\\t"
                }, k = "000000",
                    D = function(t, e) {
                        return (k + (e || 0)).slice(-t)
                    }, E = "\\u00",
                    P = function(t) {
                        for (var e = '"', r = 0, n = t.length, o = !w || n > 10, c = o && (w ? t.split("") : t); n > r; r++) {
                            var i = t.charCodeAt(r);
                            switch (i) {
                                case 8:
                                case 9:
                                case 10:
                                case 12:
                                case 13:
                                case 34:
                                case 92:
                                    e += m[i];
                                    break;
                                default:
                                    if (32 > i) {
                                        e += E + D(2, i.toString(16));
                                        break
                                    }
                                    e += o ? c[r] : t.charAt(r)
                            }
                        }
                        return e + '"'
                    }, Z = function(t, e, r, n, o, c, i) {
                        var a, l, f, u, h, b, d, C, j, w, U, J, M, m, k, E;
                        try {
                            a = e[t]
                        } catch (F) {}
                        if ("object" == typeof a && a) if (l = v.call(a), l != S || p.call(a, "toJSON")) "function" == typeof a.toJSON && (l != O && l != T && l != A || p.call(a, "toJSON")) && (a = a.toJSON(t));
                        else if (a > -1 / 0 && 1 / 0 > a) {
                            if (x) {
                                for (h = N(a / 864e5), f = N(h / 365.2425) + 1970 - 1; x(f + 1, 0) <= h; f++);
                                for (u = N((h - x(f, 0)) / 30.42); x(f, u + 1) <= h; u++);
                                h = 1 + h - x(f, u), b = (a % 864e5 + 864e5) % 864e5, d = N(b / 36e5) % 24, C = N(b / 6e4) % 60, j = N(b / 1e3) % 60, w = b % 1e3
                            } else f = a.getUTCFullYear(), u = a.getUTCMonth(), h = a.getUTCDate(), d = a.getUTCHours(), C = a.getUTCMinutes(), j = a.getUTCSeconds(), w = a.getUTCMilliseconds();
                            a = (0 >= f || f >= 1e4 ? (0 > f ? "-" : "+") + D(6, 0 > f ? -f : f) : D(4, f)) + "-" + D(2, u + 1) + "-" + D(2, h) + "T" + D(2, d) + ":" + D(2, C) + ":" + D(2, j) + "." + D(3, w) + "Z"
                        } else a = null;
                        if (r && (a = r.call(e, t, a)), null === a) return "null";
                        if (l = v.call(a), l == _) return "" + a;
                        if (l == O) return a > -1 / 0 && 1 / 0 > a ? "" + a : "null";
                        if (l == T) return P("" + a);
                        if ("object" == typeof a) {
                            for (m = i.length; m--;) if (i[m] === a) throw s();
                            if (i.push(a), U = [], k = c, c += o, l == A) {
                                for (M = 0, m = a.length; m > M; M++) J = Z(M, a, r, n, o, c, i), U.push(J === y ? "null" : J);
                                E = U.length ? o ? "[\n" + c + U.join(",\n" + c) + "\n" + k + "]" : "[" + U.join(",") + "]" : "[]"
                            } else g(n || a, function(t) {
                                var e = Z(t, a, r, n, o, c, i);
                                e !== y && U.push(P(t) + ":" + (o ? " " : "") + e)
                            }), E = U.length ? o ? "{\n" + c + U.join(",\n" + c) + "\n" + k + "}" : "{" + U.join(",") + "}" : "{}";
                            return i.pop(), E
                        }
                    };
                n.stringify = function(t, e, r) {
                    var n, o, c, i;
                    if ("function" == typeof e || "object" == typeof e && e) if ((i = v.call(e)) == j) o = e;
                    else if (i == A) {
                        c = {};
                        for (var a, l = 0, f = e.length; f > l; a = e[l++], i = v.call(a), (i == T || i == O) && (c[a] = 1));
                    }
                    if (r) if ((i = v.call(r)) == O) {
                        if ((r -= r % 1) > 0) for (n = "", r > 10 && (r = 10); n.length < r; n += " ");
                    } else i == T && (n = r.length <= 10 ? r : r.slice(0, 10));
                    return Z("", (a = {}, a[""] = t, a), o, c, n, "", [])
                }
            }
            if (!o("json-parse")) {
                var F, $, H = i.fromCharCode,
                    I = {
                        92: "\\",
                        34: '"',
                        47: "/",
                        98: "\b",
                        116: "	",
                        110: "\n",
                        102: "\f",
                        114: "\r"
                    }, Y = function() {
                        throw F = $ = null, f()
                    }, B = function() {
                        for (var t, e, r, n, o, c = $, i = c.length; i > F;) switch (o = c.charCodeAt(F)) {
                            case 9:
                            case 10:
                            case 13:
                            case 32:
                                F++;
                                break;
                            case 123:
                            case 125:
                            case 91:
                            case 93:
                            case 58:
                            case 44:
                                return t = w ? c.charAt(F) : c[F], F++, t;
                            case 34:
                                for (t = "@", F++; i > F;) if (o = c.charCodeAt(F), 32 > o) Y();
                                else if (92 == o) switch (o = c.charCodeAt(++F)) {
                                    case 92:
                                    case 34:
                                    case 47:
                                    case 98:
                                    case 116:
                                    case 110:
                                    case 102:
                                    case 114:
                                        t += I[o], F++;
                                        break;
                                    case 117:
                                        for (e = ++F, r = F + 4; r > F; F++) o = c.charCodeAt(F), o >= 48 && 57 >= o || o >= 97 && 102 >= o || o >= 65 && 70 >= o || Y();
                                        t += H("0x" + c.slice(e, F));
                                        break;
                                    default:
                                        Y()
                                } else {
                                    if (34 == o) break;
                                    for (o = c.charCodeAt(F), e = F; o >= 32 && 92 != o && 34 != o;) o = c.charCodeAt(++F);
                                    t += c.slice(e, F)
                                }
                                if (34 == c.charCodeAt(F)) return F++, t;
                                Y();
                            default:
                                if (e = F, 45 == o && (n = !0, o = c.charCodeAt(++F)), o >= 48 && 57 >= o) {
                                    for (48 == o && (o = c.charCodeAt(F + 1), o >= 48 && 57 >= o) && Y(), n = !1; i > F && (o = c.charCodeAt(F), o >= 48 && 57 >= o); F++);
                                    if (46 == c.charCodeAt(F)) {
                                        for (r = ++F; i > r && (o = c.charCodeAt(r), o >= 48 && 57 >= o); r++);
                                        r == F && Y(), F = r
                                    }
                                    if (o = c.charCodeAt(F), 101 == o || 69 == o) {
                                        for (o = c.charCodeAt(++F), (43 == o || 45 == o) && F++, r = F; i > r && (o = c.charCodeAt(r), o >= 48 && 57 >= o); r++);
                                        r == F && Y(), F = r
                                    }
                                    return +c.slice(e, F)
                                }
                                if (n && Y(), "true" == c.slice(F, F + 4)) return F += 4, !0;
                                if ("false" == c.slice(F, F + 5)) return F += 5, !1;
                                if ("null" == c.slice(F, F + 4)) return F += 4, null;
                                Y()
                        }
                        return "$"
                    }, L = function(t) {
                        var e, r;
                        if ("$" == t && Y(), "string" == typeof t) {
                            if ("@" == (w ? t.charAt(0) : t[0])) return t.slice(1);
                            if ("[" == t) {
                                for (e = []; t = B(), "]" != t; r || (r = !0)) r && ("," == t ? (t = B(), "]" == t && Y()) : Y()), "," == t && Y(), e.push(L(t));
                                return e
                            }
                            if ("{" == t) {
                                for (e = {}; t = B(), "}" != t; r || (r = !0)) r && ("," == t ? (t = B(), "}" == t && Y()) : Y()), ("," == t || "string" != typeof t || "@" != (w ? t.charAt(0) : t[0]) || ":" != B()) && Y(), e[t.slice(1)] = L(B());
                                return e
                            }
                            Y()
                        }
                        return t
                    }, q = function(t, e, r) {
                        var n = z(t, e, r);
                        n === y ? delete t[e] : t[e] = n
                    }, z = function(t, e, r) {
                        var n, o = t[e];
                        if ("object" == typeof o && o) if (v.call(o) == A) for (n = o.length; n--;) q(o, n, r);
                        else g(o, function(t) {
                            q(o, t, r)
                        });
                        return r.call(t, e, o)
                    };
                n.parse = function(t, e) {
                    var r, n;
                    return F = 0, $ = "" + t, r = L(B()), "$" != B() && Y(), F = $ = null, e && v.call(e) == j ? z((n = {}, n[""] = r, n), "", e) : r
                }
            }
        }
        return n.runInContext = e, n
    }
    var r = "function" == typeof define && define.amd,
        n = "object" == typeof global && global;
    if (!n || n.global !== n && n.window !== n || (t = n), "object" != typeof exports || !exports || exports.nodeType || r) {
        var o = t.JSON,
            c = e(t, t.JSON3 = {
                noConflict: function() {
                    return t.JSON = o, c
                }
            });
        t.JSON = {
            parse: c.parse,
            stringify: c.stringify
        }
    } else e(t, exports);
    r && define("json3", [], function() {
        return c
    })
})(this);
var Handlebars = function() {
    var r = function() {
        function r(r) {
            this.string = r
        }
        var e;
        return r.prototype.toString = function() {
            return "" + this.string
        }, e = r
    }(),
        e = function(r) {
            function e(r) {
                return s[r] || "&"
            }
            function t(r, e) {
                for (var t in e) Object.prototype.hasOwnProperty.call(e, t) && (r[t] = e[t])
            }
            function n(r) {
                return r instanceof a ? r.toString() : r || 0 === r ? (r = "" + r, u.test(r) ? r.replace(l, e) : r) : ""
            }
            function i(r) {
                return r || 0 === r ? f(r) && 0 === r.length ? !0 : !1 : !0
            }
            var o = {}, a = r,
                s = {
                    "&": "&",
                    "<": "<",
                    ">": ">",
                    '"': """,
                    "'": "'",
                    "`": "`"
                }, l = /[&<>"'`]/g,
                u = /[&<>"'`]/;
            o.extend = t;
            var c = Object.prototype.toString;
            o.toString = c;
            var p = function(r) {
                return "function" == typeof r
            };
            p(/x/) && (p = function(r) {
                return "function" == typeof r && "[object Function]" === c.call(r)
            });
            var p;
            o.isFunction = p;
            var f = Array.isArray || function(r) {
                    return r && "object" == typeof r ? "[object Array]" === c.call(r) : !1
                };
            return o.isArray = f, o.escapeExpression = n, o.isEmpty = i, o
        }(r),
        t = function() {
            function r(r, e) {
                var n;
                e && e.firstLine && (n = e.firstLine, r += " - " + n + ":" + e.firstColumn);
                for (var i = Error.prototype.constructor.call(this, r), o = 0; o < t.length; o++) this[t[o]] = i[t[o]];
                n && (this.lineNumber = n, this.column = e.firstColumn)
            }
            var e, t = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"];
            return r.prototype = new Error, e = r
        }(),
        n = function(r, e) {
            function t(r, e) {
                this.helpers = r || {}, this.partials = e || {}, n(this)
            }
            function n(r) {
                r.registerHelper("helperMissing", function(r) {
                    if (2 === arguments.length) return void 0;
                    throw new s("Missing helper: '" + r + "'")
                }), r.registerHelper("blockHelperMissing", function(e, t) {
                    var n = t.inverse || function() {}, i = t.fn;
                    return f(e) && (e = e.call(this)), e === !0 ? i(this) : e === !1 || null == e ? n(this) : p(e) ? e.length > 0 ? r.helpers.each(e, t) : n(this) : i(e)
                }), r.registerHelper("each", function(r, e) {
                    var t, n = e.fn,
                        i = e.inverse,
                        o = 0,
                        a = "";
                    if (f(r) && (r = r.call(this)), e.data && (t = g(e.data)), r && "object" == typeof r) if (p(r)) for (var s = r.length; s > o; o++) t && (t.index = o, t.first = 0 === o, t.last = o === r.length - 1), a += n(r[o], {
                        data: t
                    });
                    else for (var l in r) r.hasOwnProperty(l) && (t && (t.key = l, t.index = o, t.first = 0 === o), a += n(r[l], {
                        data: t
                    }), o++);
                    return 0 === o && (a = i(this)), a
                }), r.registerHelper("if", function(r, e) {
                    return f(r) && (r = r.call(this)), !e.hash.includeZero && !r || a.isEmpty(r) ? e.inverse(this) : e.fn(this)
                }), r.registerHelper("unless", function(e, t) {
                    return r.helpers["if"].call(this, e, {
                        fn: t.inverse,
                        inverse: t.fn,
                        hash: t.hash
                    })
                }), r.registerHelper("with", function(r, e) {
                    return f(r) && (r = r.call(this)), a.isEmpty(r) ? void 0 : e.fn(r)
                }), r.registerHelper("log", function(e, t) {
                    var n = t.data && null != t.data.level ? parseInt(t.data.level, 10) : 1;
                    r.log(n, e)
                })
            }
            function i(r, e) {
                d.log(r, e)
            }
            var o = {}, a = r,
                s = e,
                l = "1.3.0";
            o.VERSION = l;
            var u = 4;
            o.COMPILER_REVISION = u;
            var c = {
                1: "<= 1.0.rc.2",
                2: "== 1.0.0-rc.3",
                3: "== 1.0.0-rc.4",
                4: ">= 1.0.0"
            };
            o.REVISION_CHANGES = c;
            var p = a.isArray,
                f = a.isFunction,
                h = a.toString,
                v = "[object Object]";
            o.HandlebarsEnvironment = t, t.prototype = {
                constructor: t,
                logger: d,
                log: i,
                registerHelper: function(r, e, t) {
                    if (h.call(r) === v) {
                        if (t || e) throw new s("Arg not supported with multiple helpers");
                        a.extend(this.helpers, r)
                    } else t && (e.not = t), this.helpers[r] = e
                },
                registerPartial: function(r, e) {
                    h.call(r) === v ? a.extend(this.partials, r) : this.partials[r] = e
                }
            };
            var d = {
                methodMap: {
                    0: "debug",
                    1: "info",
                    2: "warn",
                    3: "error"
                },
                DEBUG: 0,
                INFO: 1,
                WARN: 2,
                ERROR: 3,
                level: 3,
                log: function(r, e) {
                    if (d.level <= r) {
                        var t = d.methodMap[r];
                        "undefined" != typeof console && console[t] && console[t].call(console, e)
                    }
                }
            };
            o.logger = d, o.log = i;
            var g = function(r) {
                var e = {};
                return a.extend(e, r), e
            };
            return o.createFrame = g, o
        }(e, t),
        i = function(r, e, t) {
            function n(r) {
                var e = r && r[0] || 1,
                    t = f;
                if (e !== t) {
                    if (t > e) {
                        var n = h[t],
                            i = h[e];
                        throw new p("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + n + ") or downgrade your runtime to an older version (" + i + ").")
                    }
                    throw new p("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + r[1] + ").")
                }
            }
            function i(r, e) {
                if (!e) throw new p("No environment passed to template");
                var t = function(r, t, n, i, o, a) {
                    var s = e.VM.invokePartial.apply(this, arguments);
                    if (null != s) return s;
                    if (e.compile) {
                        var l = {
                            helpers: i,
                            partials: o,
                            data: a
                        };
                        return o[t] = e.compile(r, {
                            data: void 0 !== a
                        }, e), o[t](n, l)
                    }
                    throw new p("The partial " + t + " could not be compiled when running in runtime-only mode")
                }, n = {
                    escapeExpression: c.escapeExpression,
                    invokePartial: t,
                    programs: [],
                    program: function(r, e, t) {
                        var n = this.programs[r];
                        return t ? n = a(r, e, t) : n || (n = this.programs[r] = a(r, e)), n
                    },
                    merge: function(r, e) {
                        var t = r || e;
                        return r && e && r !== e && (t = {}, c.extend(t, e), c.extend(t, r)), t
                    },
                    programWithDepth: e.VM.programWithDepth,
                    noop: e.VM.noop,
                    compilerInfo: null
                };
                return function(t, i) {
                    i = i || {};
                    var o, a, s = i.partial ? i : e;
                    i.partial || (o = i.helpers, a = i.partials);
                    var l = r.call(n, s, t, o, a, i.data);
                    return i.partial || e.VM.checkRevision(n.compilerInfo), l
                }
            }
            function o(r, e, t) {
                var n = Array.prototype.slice.call(arguments, 3),
                    i = function(r, i) {
                        return i = i || {}, e.apply(this, [r, i.data || t].concat(n))
                    };
                return i.program = r, i.depth = n.length, i
            }
            function a(r, e, t) {
                var n = function(r, n) {
                    return n = n || {}, e(r, n.data || t)
                };
                return n.program = r, n.depth = 0, n
            }
            function s(r, e, t, n, i, o) {
                var a = {
                    partial: !0,
                    helpers: n,
                    partials: i,
                    data: o
                };
                if (void 0 === r) throw new p("The partial " + e + " could not be found");
                return r instanceof Function ? r(t, a) : void 0
            }
            function l() {
                return ""
            }
            var u = {}, c = r,
                p = e,
                f = t.COMPILER_REVISION,
                h = t.REVISION_CHANGES;
            return u.checkRevision = n, u.template = i, u.programWithDepth = o, u.program = a, u.invokePartial = s, u.noop = l, u
        }(e, t, n),
        o = function(r, e, t, n, i) {
            var o, a = r,
                s = e,
                l = t,
                u = n,
                c = i,
                p = function() {
                    var r = new a.HandlebarsEnvironment;
                    return u.extend(r, a), r.SafeString = s, r.Exception = l, r.Utils = u, r.VM = c, r.template = function(e) {
                        return c.template(e, r)
                    }, r
                }, f = p();
            return f.create = p, o = f, define("Handlebars", [], function() {
                return f
            }), o
        }(n, r, t, e, i);
    return o
}();
define("config", [], function() {
    var a = "https://story-web-0.kakaocdn.net",
        e = "https://story-web-1.kakaocdn.net",
        t = "web/6397e40",
        o = a + (t ? "/" + t : ""),
        s = e + (t ? "/" + t : "");
    return {
        staticRoot: o,
        staticRootSub: s,
        rootDomain: "kakao.com",
        dummyPage: "/s/dummy",
        kage: {
            imageUpUrl: "https://up-api-kage-4story.kakao.com",
            imageDnUrl: "https://dn-s-story.kakaocdn.net",
            videoUpUrl: "https://up-api-kage-4story-video.kakao.com",
            videoThumbnailUrl: "https://dn-v-story.kakaocdn.net",
            videoPlayUrl: "https://dn-v-story.kakaocdn.net",
            imageConfigNumber: "webstory-img",
            videoConfigNumber: "webstory-video",
            scrapPreviewImageDnUrl: "kakaocdn.net"
        },
        kakaoLogin: {
            phase: "",
            clientId: "86680234706731008",
            pageUrl: "https://accounts.kakao.com/weblogin",
            createAccount: "/create_account",
            findEmail: "/find_email",
            findPassword: "/find_password"
        },
        serviceUrl: {
            talk: "http://www.kakao.com/services/8",
            group: "http://www.kakao.com/services/11",
            music: "http://www.kakao.com/services/5",
            page: "http://www.kakao.com/services/10",
            game: "http://www.kakao.com/services/4",
            style: "http://www.kakao.com/services/13",
            place: "http://www.kakao.com/services/15",
            home: "http://www.kakao.com/services/7",
            agit: "http://www.kakao.com/services/12",
            account: "http://www.kakao.com/services/account",
            link: "http://www.kakao.com/services/6",
            developers: "https://developers.kakao.com/",
            storyPlus: "https://ch.kakao.com",
            story: "http://www.kakao.com/services/9"
        },
        appLink: {
            ios: {
                store: {
                    app: "https://itunes.apple.com/kr/app/id486244601",
                    web: "https://itunes.apple.com/kr/app/id486244601"
                },
                scheme: "kakaostory://"
            },
            android: {
                store: {
                    app: "market://details?id=com.kakao.story",
                    web: "https://play.google.com/store/apps/details?id=com.kakao.story"
                },
                scheme: "intent://#Intent;package=com.kakao.story;action=android.intent.action.VIEW;scheme=kakaostory;end;"
            }
        },
        videoPlayer: {
            kakaoPlayerPath: o + "/swf/",
            mediaElementPath: o + "/js/lib/mediaelement/"
        },
        uploader: {
            path: t + "/swf/swfupload.swf"
        },
        customer: {
            request: "http://www.kakao.com/requests?category=19&locale=ko&node=NODE0000000823&service=9",
            suggest: "http://www.kakao.com/requests?category=38&locale=ko&node=NODE0000000824&service=9"
        },
        kant: {
            host: "//ad1-kant.kakao.com/web/track.gif",
            trackId: "265",
            pageViewTrackId: "264"
        },
        storyPlus: {
            list: "https://ch.kakao.com/channels"
        },
        redirectServer: "http://redirect-story.kakao.com"
    }
});

function StringBuffer() {
    this.buffer = []
}
function Utf8EncodeEnumerator(t) {
    this._input = t, this._index = -1, this._buffer = []
}
function Base64DecodeEnumerator(t) {
    this._input = t, this._index = -1, this._buffer = []
}
StringBuffer.prototype.append = function(t) {
    return this.buffer.push(t), this
}, StringBuffer.prototype.toString = function() {
    return this.buffer.join("")
};
var Base64 = {
    codex: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
    encode: function(t) {
        for (var e = new StringBuffer, r = new Utf8EncodeEnumerator(t); r.moveNext();) {
            var n = r.current;
            r.moveNext();
            var i = r.current;
            r.moveNext();
            var u = r.current,
                h = n >> 2,
                s = (3 & n) << 4 | i >> 4,
                f = (15 & i) << 2 | u >> 6,
                o = 63 & u;
            isNaN(i) ? f = o = 64 : isNaN(u) && (o = 64), e.append(this.codex.charAt(h) + this.codex.charAt(s) + this.codex.charAt(f) + this.codex.charAt(o))
        }
        return e.toString().replace(new RegExp(this.codex.charAt(64), "g"), "")
    },
    decode: function(t) {
        var e = t.length % 4;
        if (e > 0) for (var r = 0; 4 - e > r; r++) t += this.codex.charAt(64);
        for (var n = new StringBuffer, i = new Base64DecodeEnumerator(t); i.moveNext();) {
            var u = i.current;
            if (128 > u) n.append(String.fromCharCode(u));
            else if (u > 191 && 224 > u) {
                i.moveNext();
                var h = i.current;
                n.append(String.fromCharCode((31 & u) << 6 | 63 & h))
            } else {
                i.moveNext();
                var h = i.current;
                i.moveNext();
                var s = i.current;
                n.append(String.fromCharCode((15 & u) << 12 | (63 & h) << 6 | 63 & s))
            }
        }
        return n.toString()
    }
};
Utf8EncodeEnumerator.prototype = {
    current: Number.NaN,
    moveNext: function() {
        if (this._buffer.length > 0) return this.current = this._buffer.shift(), !0;
        if (this._index >= this._input.length - 1) return this.current = Number.NaN, !1;
        var t = this._input.charCodeAt(++this._index);
        return 13 == t && 10 == this._input.charCodeAt(this._index + 1) && (t = 10, this._index += 2), 128 > t ? this.current = t : t > 127 && 2048 > t ? (this.current = t >> 6 | 192, this._buffer.push(63 & t | 128)) : (this.current = t >> 12 | 224, this._buffer.push(t >> 6 & 63 | 128), this._buffer.push(63 & t | 128)), !0
    }
}, Base64DecodeEnumerator.prototype = {
    current: 64,
    moveNext: function() {
        if (this._buffer.length > 0) return this.current = this._buffer.shift(), !0;
        if (this._index >= this._input.length - 1) return this.current = 64, !1;
        var t = Base64.codex.indexOf(this._input.charAt(++this._index)),
            e = Base64.codex.indexOf(this._input.charAt(++this._index)),
            r = Base64.codex.indexOf(this._input.charAt(++this._index)),
            n = Base64.codex.indexOf(this._input.charAt(++this._index)),
            i = t << 2 | e >> 4,
            u = (15 & e) << 4 | r >> 2,
            h = (3 & r) << 6 | n;
        return this.current = i, 64 != r && this._buffer.push(u), 64 != n && this._buffer.push(h), !0
    }
}, define("base64url", [], function() {
    return Base64
});
define("common/urlUtil", ["config", "base64url"], function(t, r) {
    return {
        URL_REGEX: /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?«»“”‘’]))/gi,
        PROTOCOL_REGEX: /^[a-z][a-z0-9-+\.]*$/i,
        extractFirstUrlFromString: function(t) {
            if (!t) return "";
            var r = t.match(this.URL_REGEX);
            return _.first(r) || ""
        },
        hasUrl: function(t) {
            return !!this.extractFirstUrlFromString(t)
        },
        hasProtocol: function(t) {
            var r = t.indexOf(":"),
                n = t.substring(0, r) || null;
            return !!n && this.PROTOCOL_REGEX.test(n)
        },
        isUrlByWeakRule: function(t) {
            return !!t && -1 !== t.indexOf(".")
        },
        prependProtocol: function(t) {
            return t && this.isUrlByWeakRule(t) ? this.hasProtocol(t) ? t : "http://" + t : ""
        },
        getHostWithProtocol: function(t) {
            var r = $("<a>").attr("href", t);
            return r.prop("protocol") + "//" + r.prop("host")
        },
        getQueryString: function(t) {
            var r;
            return this.hasUrl(t) ? (r = t.split("?"), r.length < 2 ? "" : _.rest(r).join("?")) : ""
        },
        getObjectFromQueryString: function(t) {
            for (var r, n = {}, e = t.split("&"), i = 0, o = e.length; o > i; i++) r = e[i].split("="), n[_.first(r)] = _.rest(r).join("=");
            return n
        },
        getQueryStringFromObject: function(t) {
            return t ? _.map(t, function(t, r) {
                return r + "=" + t
            }).join("&") : ""
        },
        getQueryValueFromUrl: function(t, r) {
            for (var n, e = this.getQueryString(t), i = e.split("&"), o = 0, u = i.length; u > o; o++) if (n = i[o].split("="), _.first(n) === r) return _.rest(n).join("=");
            return ""
        },
        getLastPathFromUrl: function(t) {
            var r;
            return -1 !== t.indexOf("://") && (t = t.substring(t.indexOf("://") + 3)), - 1 !== t.indexOf("?") && (t = t.substring(0, t.indexOf("?"))), r = t.split("/"), r.length > 1 ? _.last(r) : ""
        },
        getOrigin: function() {
            var t = document.location,
                r = t.origin;
            return r || (r = t.protocol + "//" + t.hostname + (t.port ? ":" + t.port : "")), r
        },
        getExtension: function(t) {
            var r = t.split(".");
            return r.length > 1 ? r.pop().toLowerCase() : ""
        },
        appendQueryString: function(t, r) {
            var n = -1 !== t.indexOf("?") ? "&" : "?";
            return t + n + this.getQueryStringFromObject(r)
        },
        tokenizeByUrl: function(t) {
            var r, n, e = [],
                i = 0;
            if (!t) return e;
            for (; null !== (r = this.URL_REGEX.exec(t));) n = r[0], e.push({
                type: "text",
                value: t.substring(i, this.URL_REGEX.lastIndex - n.length)
            }), e.push({
                type: "url",
                value: n
            }), i = this.URL_REGEX.lastIndex;
            return i < t.length && e.push({
                type: "text",
                value: t.substring(i)
            }), e
        },
        getRedirectUrl: function(n, e) {
            var i = t.redirectServer + "/?url=" + r.encode(n);
            return e && e.activityId && (i += "&sai=" + e.activityId), e && e.commentId && (i += "&ci=" + e.commentId), i
        },
        removeWwwFromScrapHost: function(t) {
            return t.replace(/^www\./i, "")
        }
    }
});
define("common/util", ["moment", "common/urlUtil", "config"], function(t, e, n) {
    var r = "_kawlt",
        a = "_karmt",
        i = "_kawltea",
        o = "_karmtea",
        s = "." + n.rootDomain,
        u = "_kslat",
        c = [r, a, i, o],
        l = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            SPACE: 32,
            UP: 38,
            DOWN: 40,
            LEFT: 37,
            RIGHT: 39,
            ESC: 27,
            DELETE: 46
        };
    return _.each(_.range(65, 91), function(t) {
        l[String.fromCharCode(t)] = t
    }), {
        KEY: l,
        hasModifierKey: function(t) {
            return t.altKey || t.shiftKey || t.ctrlKey
        },
        getCaretRange: function(t) {
            var e, n, r, a, i, o = {
                start: 0,
                end: 0
            };
            return "selectionStart" in t ? (o.start = t.selectionStart, o.end = t.selectionEnd) : "selection" in document && (e = document.selection.createRange(), e && e.parentElement() === t && (a = t.value.length, i = t.value.replace(/\r\n/g, "\n"), n = t.createTextRange(), n.moveToBookmark(e.getBookmark()), r = t.createTextRange(), r.collapse(!1), n.compareEndPoints("StartToEnd", r) > -1 ? o.start = o.end = a : (o.start = -n.moveStart("character", - a), o.start += i.slice(0, o.start).split("\n").length - 1, n.compareEndPoints("EndToEnd", r) > -1 ? o.end = a : (o.end = -n.moveEnd("character", - a), o.end += i.slice(0, o.end).split("\n").length - 1)))), o
        },
        isCollapsedRange: function(t) {
            return t.start === t.end
        },
        shiftRange: function(t, e) {
            return {
                start: t.start + e,
                end: t.end + e
            }
        },
        getIntersectRange: function(t, e) {
            return t.start > e.start ? this.getIntersectRange(e, t) : e.start <= t.end ? {
                start: e.start,
                end: Math.min(t.end, e.end)
            } : null
        },
        setCaretPosition: function(t, e) {
            var n;
            "selectionStart" in t ? (t.focus(), t.setSelectionRange(e, e)) : "selection" in document ? (n = t.createTextRange(), n.move("character", e), n.select()) : t.focus()
        },
        getWordBeforePosition: function(t, e) {
            var n = t.substring(0, e).split(/\s+/);
            return _.last(n) || ""
        },
        isBoundsInBounds: function(t, e) {
            return e.top <= t.top && t.bottom <= e.bottom && e.left <= t.left && t.right <= e.right
        },
        getConvertedImagePath: function(t, e) {
            return /convert=\d+h$/.test(t) ? t : t + "?convert=" + (agent.support.retina ? 2 * e : e) + "h"
        },
        escapeHtmlString: function(t) {
            return t = t || "", t.toString().replace(/</g, "<").replace(/>/g, ">").replace(/\n/g, "<br>").replace(/  /g, "  ").replace(/(<br>){2,}/g, function(t) {
                return t.split("<br>").join(" <br>")
            })
        },
        escapeHtmlStringWithUrlAnchor: function(t, n) {
            var r = this,
                a = e.tokenizeByUrl(t);
            return n = n || {}, _.reduce(a, function(t, a) {
                var i = e.prependProtocol(a.value);
                return "url" === a.type ? t + ['<a href="', n.useRedirect ? e.getRedirectUrl(i, n) : i, '" target="_blank" class="_autolink">', r.escapeHtmlString(a.value), "</a>"].join("") : t + r.escapeHtmlString(a.value)
            }, "")
        },
        trim: function(t) {
            return t = (t || "").toString(), "undefined" != typeof String.prototype.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "")
        },
        nl2br: function(t) {
            var e = /\r?\n/g;
            return t.replace(e, "<br>")
        },
        makeSafeString: function(t) {
            return this.trim(this.escapeHtmlString(t))
        },
        isValidDate: function(e, n) {
            return this.isNumber(e) ? t(e, n || "YYYYMMDD").isValid() : !1
        },
        isValidBirthYear: function(t) {
            var e = 1880,
                n = t,
                r = (new Date).getFullYear();
            return this.isNumber(t) ? ("string" == typeof t && (n = parseInt(t, 10)), e > n || n > r ? !1 : !0) : !1
        },
        isValidStoryId: function(t) {
            var e = /^[a-z0-9]{1}[-_a-z0-9]{3,14}$/i;
            return e.test(t)
        },
        isValidStoryIdChar: function(t) {
            var e = /^[a-z0-9]+[-_a-z0-9]*/i;
            return e.test(t)
        },
        isValidStoryNameChar: function(t) {
            var e = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-z]+$/i;
            return e.test(t)
        },
        dateFormat: function(e, n) {
            var r = t(e),
                a = t(),
                i = "";
            return i = n ? r.format("all" === n ? "LL a hh:mm" : n) : r.isAfter(a.subtract("minutes", 1)) ? intl.t("date.justNow") : r.isAfter(a.subtract("hours", 12)) ? r.fromNow() : r.format(r.isSame(a, "day") ? "a hh:mm" : r.isSame(a, "year") ? "MMM Do a hh:mm" : "LL a hh:mm")
        },
        numberFormat: function(t, e, n) {
            return n = n || "+", _.isNumber(e) && t > e ? t = e : n = "", t = t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), t + n
        },
        hasKorean: function(t) {
            var e = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
            return e.test(t)
        },
        isNumber: function(t) {
            var e = /^[0-9]+$/;
            return e.test(t)
        },
        isValidEmail: function(t) {
            var e = /^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i;
            return e.test(t)
        },
        makeValidDate: function(e, n, r, a) {
            var i = t({
                year: parseInt(e, 10),
                month: parseInt(n, 10) - 1,
                day: parseInt(r, 10)
            });
            return i.format(a || "YYYYMMDD")
        },
        isValidBirthday: function(t, e, n) {
            var r = null;
            return this.isNumber(t) && this.isNumber(e) && this.isNumber(n) ? (r = this.makeValidDate(t, e, n), this.isValidBirthYear(t) && this.isValidDate(r)) : !1
        },
        clearSessionCookie: function() {
            var t = this;
            _.each(c, function(e) {
                t.clearCookie(e, s)
            }), this.clearCookie(u, location.hostname)
        },
        clearCookie: function(t, e) {
            document.cookie = t + "=deleted;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + e + ";"
        },
        getCookie: function(t) {
            var e = this,
                n = "",
                r = document.cookie.split(";");
            return _.some(r, function(r) {
                var a = r.split("="),
                    i = e.trim(a[0]) === t;
                return i && (n = a[1]), i
            }), n
        },
        setCookie: function(t, e, n, r) {
            n = new Date(n).toGMTString(), r = r || s, document.cookie = t + "=" + e + ";expires=" + n + ";path=/;domain=" + r + ";"
        },
        convertByteToMb: function(t, e) {
            var n, r = Math.pow(10, e || 0);
            return n = 0 === t ? 0 : Math.round(t / Math.pow(1024, 2) * r) / r
        },
        replaceAll: function(t, e, n) {
            return e = e.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), t.replace(new RegExp(e, "g"), n)
        },
        sum: function(t, e) {
            return e = _.bind(e, this), _.reduce(t, function(t, n) {
                return t + e(n)
            }, 0)
        },
        getFileSize: function(t) {
            return t[0].files ? this.sum(t[0].files, function(t) {
                return t.size
            }) : 0
        }
    }
});
define("common/imgPath", ["config"], function(n) {
    var e = "/img/space.png",
        t = /([\w,\s-]+)(\.[a-zA-Z]{3,4})$/,
        a = n.staticRoot;
    return {
        get: function(n, t) {
            return t = _.defaults(t || {}, {
                retina: !0,
                lang: !1
            }), 0 === n.indexOf("http") ? n : 0 !== n.indexOf("/") ? (logger.error("유효하지 않은 경로입니다. (" + n + ")"), a + e) : (agent.support.retina && t.retina && (n = this._changeToRetinaImage(n)), t.lang, a + n)
        },
        _changeToRetinaImage: function(n) {
            return n.replace(t, "$1_rtn$2")
        }
    }
});
define("common/profileImage", [], function() {
    var e = [40, 60, 100, 150, 250],
        r = /([\w,\s-]+)(_[s|m|l])(\.[a-zA-Z]{3,4})(\?[^\/]+)?$/,
        t = /covert=\d+x\d+\./,
        n = "/public/images/",
        i = "_l";
    return {
        getUrl: function(e, r) {
            return e ? this._isPublicImage(e) ? e : (r = Number(r), !r || isNaN(r) ? e : this._hasSizePattern(e) ? e : (e = this._replaceToLargeSize(e), this._appendSizeQueryString(e, this._getSizeQueryString(r)))) : ""
        },
        _isPublicImage: function(e) {
            return e.indexOf(n) > -1
        },
        _hasSizePattern: function(e) {
            return t.test(e)
        },
        _replaceToLargeSize: function(e) {
            return e.replace(r, "$1" + i + "$3$4")
        },
        _appendSizeQueryString: function(e, r) {
            if (!r) return e;
            var t = e.indexOf("?") > -1 ? "&" : "?";
            return e + t + r
        },
        _getSizeQueryString: function(e) {
            var r = this._getProperSize(e);
            return "convert=" + r + "x" + r
        },
        _getProperSize: function(r) {
            var t = 0,
                n = e[e.length - 1],
                i = e.length;
            if (agent.support.retina && (r *= 2), r >= n) return n;
            for (; i-- && !(r > e[i]);) t = e[i];
            return t
        }
    }
});
define("common/helper", ["Handlebars", "common/intl", "common/util", "common/imgPath", "common/profileImage"], function(e, t, n, r, i) {
    e.registerHelper("t", function() {
        var n, r = _.initial(arguments),
            i = arguments[0],
            a = _.last(arguments);
        return r.length >= 2 && !_.isObject(r[1]) ? n = _.rest(r) : 2 === r.length && (n = r[1]), new e.SafeString(a && a.hash ? t.t(i, a.hash) : "string" == typeof i ? t.t(i, n) : t.t(a.hash.key, i))
    }), e.registerHelper("dateFormat", function() {
        var t = ["date", "format", "options"],
            r = _.object(t, _.initial(arguments)),
            i = n.dateFormat(r.date, r.format);
        return r.format || (i = i.replace(/([\d:\-\/]+)/g, "<em>$1</em>")), new e.SafeString(i)
    }), e.registerHelper("numberFormat", function() {
        var t = ["number", "maxNumber", "ellipsisString", "options"],
            r = _.object(t, _.initial(arguments));
        return new e.SafeString(n.numberFormat(parseInt(r.number, 10), parseInt(r.maxNumber, 10), r.ellipsisString))
    }), e.registerHelper("FIXME", function(t, n) {
        n = n || "#";
        var r = ["overflow: hidden;", "display: inline;", "max-width: 120px;", "padding: 3px;", "color: red;", "background: yellow;", "font-weight: normal;", "font-size: 11px;", "position: absolute;", "white-space: nowrap;", "text-overflow: ellipsis;", "width: initial;", "height: initial;", "line-height: initial;", "z-index: 190;"].join(""),
            i = '<div style="position:relative;width:0;height:0;">';
        return i += '<a target="_blank"', i += ' style="' + r + '"', i += ' href="' + (n || "#") + '"', i += ' title="' + t + '"', i += ">" + t, i += "</a></div>", new e.SafeString(i)
    }), e.registerHelper("img", function(n) {
        var i = "",
            a = function(e, t) {
                return r.get(e, {
                    retina: "false" === t.retina ? !1 : !0,
                    lang: "true" === t.lang
                })
            }, o = function(e) {
                return t.t(e) || ""
            };
        return _.each(n.hash, function(e, t) {
            switch (t) {
                case "src":
                    e = a(e, {
                        retina: n.hash["data-retina"],
                        lang: n.hash["data-lang"]
                    });
                    break;
                case "alt":
                case "title":
                    e = o(e)
            }
            i += " " + t + '="' + e + '"'
        }), new e.SafeString("<img" + i + ">")
    }), e.registerHelper("profileImage", function(e) {
        return i.getUrl(e.hash.url, e.hash.size)
    })
});
define("common/webFontLoader", ["config", "common/agent", "jquery"], function(e) {
    var n = 10.5,
        t = function() {
            return agent.os.is.windows || agent.os.is.mac && agent.os.version < n
        }, o = e.staticRootSub + "/css/web_font.css?t=" + _.now();
    return t() && $("head").append('<link href="' + o + '" rel="stylesheet" type="text/css">'), {}
});
define("lang/ko", [], function() {
    return {
        title: {
            common: "카카오스토리",
            activity: "__name__ - __content__ : 카카오스토리",
            photo: "__name__ - 사진 : 카카오스토리",
            myStory: "__name__ : 카카오스토리",
            hashtag: "__tag__ : 카카오스토리",
            profileSetting: "__name__ - 프로필편집 : 카카오스토리",
            notice: "공지사항 : 카카오스토리",
            setting: "설정 : 카카오스토리",
            privacy: "개인정보 수집 및 이용동의",
            more: "더보기 : 카카오스토리"
        },
        common: {
            layer: {
                close: "레이어 닫기"
            },
            alt: {
                sticon: "(스티콘)"
            }
        },
        dialog: {
            ok: "확인",
            cancel: "취소"
        },
        friend: {
            title: {
                friendTab: "내 친구",
                recommendTab: "추천친구",
                requestsTab: "친구신청",
                newList: "새 친구",
                favoriteList: "관심친구",
                receivedList: "받은신청",
                sentList: "보낸신청",
                wholeList: "친구",
                suggestionList: "친구, 채널 검색결과",
                idSearch: "ID 검색결과",
                storyRecommendList: "추천친구",
                storyPlusRecommendList: "추천 채널",
                gnbFriendTab: "친구",
                gnbRequestsTab: "친구신청",
                gnbNewList: "새 친구",
                gnbFriendList: "내 친구",
                gnbReceivedList: "받은신청",
                gnbRecommendList: "추천친구",
                gnbStoryPlusRecommendList: "추천 채널"
            },
            placeholder: {
                search: "친구, 채널 검색"
            },
            paragraph: {
                noFriend: "아직 스토리친구가 없습니다.",
                noRecommend: "추천친구가 없습니다.",
                noRequests: "받은 친구신청이 없습니다.",
                noSearchResult: "검색 결과가 없습니다.",
                noIdSearchResult: "ID 검색 결과가 없습니다.",
                gnbNoFriend: "아직 스토리친구가 없습니다.",
                gnbNoRequests: "받은 친구신청이 없습니다.",
                followerMessage: "__count__명이 소식을 받고 있습니다."
            },
            alt: {
                music: "음악",
                birthday: "생일",
                loading: "로딩 중"
            },
            btn: {
                search: "검색",
                makeFav: "관심친구 설정",
                makeUnfav: "관심친구 해제",
                follow: "소식받기",
                following: "소식받는 중",
                unfollow: "소식끊기",
                "delete": "친구끊기",
                invite: "친구신청",
                inviting: "요청 중",
                cancel: "요청취소",
                ignore: "무시",
                accept: "수락",
                searchId: "ID 검색결과 보기"
            },
            link: {
                manageFriend: "친구관리",
                showAllRecommend: "추천친구 모두 보기",
                editProfile: "프로필 편집"
            },
            dialog: {
                "delete": "친구를 끊으면 서로의 친구목록에서 확인할 수 없으며<br>친구의 소식도 받아볼 수 없게 됩니다.<br>정말 친구를 끊겠습니까?",
                cancel: "이미 친구신청 메세지가 전송되었습니다.<br>친구 신청을 취소하겠습니까?",
                unfollow: "소식끊기를 하면 친구 목록에서 확인할 수 없으며<br>소식도 받아볼 수 없게 됩니다.<br>정말 소식을 끊겠습니까?",
                ignore: "이 사용자에게 더 이상 친구신청을 받지 않습니다.<br>무시하시겠습니까?",
                ignoreRecommend: "__name__님을 친구추천 목록에서 삭제하고<br>더 이상 추천받지 않으시겠습니까?"
            }
        },
        writing: {
            mode: {
                text: "글",
                photo: "사진",
                video: "동영상",
                music: "뮤직",
                link: "링크"
            },
            textInput: {
                placeholder: "이야기를 들려주세요"
            },
            friendInput: {
                placeholder: "함께하는친구"
            },
            textMode: {
                error: {
                    invalidFile: "알맞은 형식이 아닙니다.<br/>첨부 가능 사진파일: .jpg, .gif, .png, .bmp (최대 20MB)<br/>첨부 가능 동영상파일: .mov, .avi (최대 1분, 500MB)"
                }
            },
            sticon: "스티콘",
            photoMode: {
                uploadPhoto: "사진을 추가하세요",
                maxCountConfirm: "사진은 최대 10장까지 추가할 수 있습니다.",
                maxGifMixedWarning: "GIF파일은 다른형식(.jpg, .gif, .png, .bmp)의 파일과 함께 첨부할 수 없습니다.",
                maxGifCountWarning: "GIF파일은 1개만 첨부할 수 있습니다.",
                addPhoto: "추가하기",
                addPhotoTitle: "사진추가",
                removePreview: "사진삭제",
                error: {
                    badRequest: "잘못된 요청입니다.",
                    entityTooLarge: "20MB이하의 사진을 추가할 수 있습니다.",
                    invalidFile: "알맞은 형식이 아닙니다.<br/>첨부 가능파일: .jpg, .gif, .png, .bmp (최대 20MB)",
                    networkError: "네트워크가 불안하거나 서버에 일시적인 오류가 있습니다.",
                    entityTooLargeGif: "3MB 이하의 GIF 파일을 첨부해 주세요."
                }
            },
            videoMode: {
                uploadVideo: "1분 이하의 동영상을 추가",
                addVideo: "동영상 첨부",
                fileSizeUnit: "MB",
                error: {
                    badRequest: "잘못된 요청입니다.",
                    entityTooLarge: "500MB이하의 동영상을 추가할 수 있습니다.",
                    invalidFile: "알맞은 형식이 아닙니다.<br/>첨부 가능파일: .mov, .avi (최대 1분, 500MB)",
                    networkError: "네트워크가 불안하거나 서버에 일시적인 오류가 있습니다.",
                    exceedPlayTime: "동영상 자동편집<br/>1분을 초과하는 동영상입니다.<br/>재생시간 1분으로 자동편집된 동영상으로 추가할 수 있습니다.<br/>계속하시겠습니까?",
                    uploadError: "동영상 업로드에 실패했습니다."
                }
            },
            musicMode: {
                kakaoMusic: "카카오뮤직",
                tryKakaoMusic: "에서 음원을 구매하시면<br/> 좋아하는 음악을 스토리에 공유할 수 있습니다.",
                playMusicBtn: "음악재생",
                myMusicRoom: "내 카카오 뮤직룸"
            },
            linkMode: {
                title: "링크(URL) 입력",
                placeholder: "링크(URL) 입력",
                previewImgRemoveBtn: "이미지 삭제",
                fail: "링크(URL) 불러오기를 실패했습니다."
            },
            modifyDescription: {
                photo: "사진은 수정할 수 없습니다.",
                video: "동영상은 수정할 수 없습니다.",
                music: "뮤직은 수정할 수 없습니다.",
                link: "링크는 수정할 수 없습니다.",
                share: "원본 글은 수정할 수 없습니다."
            },
            action: {
                post: "올리기",
                modify: "수정완료",
                cancel: "취소",
                retry: "다시시도",
                removeMedia: "취소",
                dropzonePlaceholder: "사진 / 동영상을 여기로 끌어다 놓으세요.",
                dropzonePhoto: "사진을 여기로 끌어다 놓으세요.",
                dropzoneVideo: "동영상을 여기로 끌어다 놓으세요."
            },
            permission: {
                title: "공개설정 변경",
                all: "전체공개",
                friends: "친구공개",
                meOnly: "나만보기",
                meOnlyLayer: "소식을 성공적으로 업로드 했습니다.<br/>'나만보기'로 설정한 글은 내 스토리에서만 볼 수 있습니다.</br>지금 올린 스토리를 확인해보세요. ",
                meOnlyLayerLater: "나중에",
                meOnlyLayerMoveNow: "지금 보러가기",
                tooltipAll: "누구나 보고,<br/>누구나 공유할 수 있습니다.",
                tooltipFriend: "친구만 보고,<br/>친구만 공유할 수 있습니다.",
                allowComment: "친구만 댓글 허용",
                allowShare: "친구의 공유 허용"
            },
            postDialog: {
                cancelWarning: "새소식 작성을 취소하시겠습니까?",
                cancelWriting: "작성취소",
                reloadWarning: "작성중인 소식이 있습니다.<br/>페이지를 이동하면 작성중이던 내용은 삭제됩니다.",
                reloadWarningPlainText: "작성중인 소식이 있습니다.\n페이지를 이동하면 작성중이던 내용은 삭제됩니다."
            },
            modifyDialog: {
                cancelWarning: "글 수정을 취소하시겠습니까?",
                cancelWriting: "수정취소",
                reloadWarning: "수정중인 소식이 있습니다.<br/>페이지를 이동하면 수정한 내용이 취소됩니다.",
                reloadWarningPlainText: "수정중인 소식이 있습니다.\n페이지를 이동하면 수정한 내용이 취소됩니다."
            },
            continueWriting: "계속작성",
            leavePage: "페이지에서 나가기",
            stayHere: "이 페이지에 머물기",
            sharePermissionError: "공유한 스토리가 친구공개인 경우 전체공개로 설정할 수 없습니다.",
            shareDialogTitle: "카카오스토리로 공유하기",
            hashtagLayerPermissionGuide: "전체공개 글만 해시태그 페이지에 노출됩니다.",
            alt: {
                loading: "로딩 중",
                kakaoMusic: "카카오뮤직",
                selectMusicBtn: "선택",
                albumImage: "앨범 이미지",
                linkImage: "링크 이미지",
                inputTitle: "사진 추가",
                cancel: "취소",
                friendInputBtn: "함께하는 친구",
                friendInputTagRemoveBtn: "삭제",
                videoPlayBtn: "동영상재생",
                removeSticonBtn: "스티콘 삭제"
            }
        },
        toastPopup: {
            success: {
                message: "소식을 공유했습니다.",
                viewButton: "보기"
            },
            fail: {
                message: "올리기 실패",
                reloadButton: "다시시도",
                cancelButton: "취소"
            },
            newFeed: {
                message: "새로운 소식 __count__개",
                viewButton: "보기"
            },
            progress: "업로드 __percent__ 중",
            searchFail: {
                message: "검색결과를 불러올 수 없습니다.",
                close: "닫기"
            },
            profileEdited: {
                message: "수정하신 내용을 저장했습니다.",
                close: "닫기"
            },
            activityHidden: {
                message: "소식에서 제거했습니다.<br/>해당 글은 작성자의 스토리에서 계속 볼 수 있습니다.",
                close: "닫기"
            }
        },
        activity: {
            withTag: "__name__님과 함께",
            withTags: "__name__님 외 <strong>__otherCount__</strong>명과 함께",
            withTagCount: "__count__명의 함께한 친구들",
            more: "...더보기",
            moreFeed: "소식 더보기",
            deleteConfirm: "이 스토리를 삭제하시겠습니까?",
            setting: {
                hide: "이 소식 보지 않기",
                report: "신고하기",
                modify: "수정",
                "delete": "삭제",
                allowShare: "친구의 공유 허용",
                allowComment: "친구만 댓글 허용",
                hideMessage: "소식에서 제거했습니다.<br>해당 글은 작성자의 스토리에서는 계속 볼 수 있습니다."
            },
            share: {
                action: "공유",
                text: "공유",
                description: "이 스토리를 공유한 사람들",
                toStory: "스토리로 공유하기",
                toUrl: "URL로 공유하기",
                canBeFriend: "친구공개 스토리입니다.<br>친구를 맺으면 스토리를 확인할 수 있습니다.",
                meOnly: "비공개 스토리입니다.",
                visitStory: "스토리 방문",
                close: "닫기"
            },
            url: {
                title: "이 스토리를 URL로 공유하기",
                description: "링크를 복사해서 공유하고 싶은 곳에 붙여넣기 하세요.",
                windowsDescription: "링크를 복사(Ctrl+C)해서 공유하고 싶은 곳에 붙여넣기(Ctrl+V) 하세요.",
                macDescription: '링크를 복사(<span class="ic">command</span>+C)해서 공유하고 싶은 곳에 붙여넣기(<span class="ic">command</span>+V) 하세요.'
            },
            permission: {
                all: "전체공개",
                friends: "친구공개",
                meOnly: "나만보기",
                canNotChangePermission: "공유한 스토리가 나만보기로 설정되어있습니다.<br />지금 공개범위를 수정하면 __permission__로 다시 변경할 수 없습니다.<br />계속하시겠습니까?",
                canNotChangePermissionOk: "__permission__로 설정",
                canNotChangePermissionCancel: "취소",
                changePermissionSharedActivityToMeOnly: "'나만보기'로 설정한 글은 내 스토리에서만 확인할 수 있고,<br />이미 공유된 스토리에는 내용이 계속 보이게됩니다.<br />설정을 변경하시겠습니까?",
                changePermissionToMeOnly: "'나만보기'로 설정한 글은 내스토리에서만 확인할 수 있습니다.<br />설정을 변경하시겠습니까?"
            },
            emotion: {
                like: "좋아요",
                good: "멋져요",
                pleasure: "기뻐요",
                cheerup: "힘내요 ",
                sad: "슬퍼요"
            },
            like: {
                action: "느낌",
                text: "느낌",
                description: "이 스토리에 느낌을 남긴 사람들"
            },
            comment: {
                text: "댓글",
                reply: "댓글",
                more: "이전 댓글 보기",
                placeholder: "댓글을 입력하세요.",
                commentAllowedForFriend: "친구에게만 댓글 쓰기를 허용한 글입니다.",
                save: "전송",
                saving: "전송중..",
                "delete": "삭제",
                report: "신고",
                deleteConfirm: "댓글을 삭제하시겠습니까?",
                deleteError: "댓글 삭제 중에 오류가 발생했습니다.",
                permissionError: "댓글을 삭제할 권한이 없습니다.",
                image: {
                    text: "사진 첨부",
                    uploadError: "업로드 실패",
                    badRequestError: "잘못된 요청입니다.",
                    entityTooLargeError: "20MB이하의 사진을 추가할 수 있습니다.",
                    invalidFileError: "알맞은 형식이 아닙니다.<br/>첨부 가능파일: .jpg, .png, .bmp (최대 20MB)",
                    networkError: "네트워크가 불안하거나 서버에 일시적인 오류가 있습니다.",
                    invalidFileByGifError: "댓글에는 GIF 사진을 첨부할 수 없습니다."
                },
                sticon: {
                    recentlyUsed: "최근 사용한 스티콘",
                    noRecentlyUsed: "최근에 사용한 스티콘이 없습니다."
                }
            },
            music: {
                kakaoMusic: "카카오 뮤직",
                notSupport: "카카오뮤직 음원은 PC에서 감상하실 수 있습니다."
            },
            image: {
                moreText: "이미지 더보기"
            },
            close: "닫기",
            blockedUserInquiry: "문의하기",
            noRelationship: {
                content: "카카오스토리에서는 친구를 맺거나, 관심사를 구독하여<br>새로운 소식을 받아볼 수 있습니다.<br>멋진 소식을 들려주는 친구들을 찾아보세요!",
                findFriend: "친구찾기"
            },
            modified: "수정됨",
            newFeed: "새 소식",
            video: {
                noFlashPlayer: "동영상 재생을 위해 플래시 플레이어 설치가 필요합니다.",
                installLink: "지금 설치하기"
            },
            alt: {
                setting: "소식 메뉴",
                videoPlay: "비디오재생",
                musicPlay: "음악재생",
                close: "닫기",
                commentWriteTitle: "댓글 입력",
                commentSetting: "댓글 메뉴",
                openSticon: "스티콘 선택",
                sticonDelete: "삭제",
                sticonImage: "스티콘 이미지",
                sticonSelectImage: "스티콘 선택 이미지",
                image: "이미지",
                imageSaving: "전송중..",
                imageDelete: "삭제",
                likeDelete: "느낌 삭제"
            },
            campaign: {
                more: "자세히보기",
                alt: {
                    close: "닫기"
                }
            }
        },
        myStory: {
            menu: {
                photos: "사진",
                music: "뮤직",
                videos: "동영상",
                friends: "친구",
                all: "전체"
            },
            empty: {
                notFound: "페이지가 존재하지 않습니다.<br>URL이 잘못되었거나 삭제된 스토리일 수 있습니다.",
                feed: "아직 스토리가 없습니다.",
                photos: "내가 올린 사진들을 모아 볼 수 있습니다.",
                videos: "내가 올린 동영상들을 모아 볼 수 있습니다.",
                music: "내가 올린 음악들을 모아 볼 수 있습니다.",
                writeButton: "새로운 소식을 올려보세요.",
                photoButton: "사진을 올려보세요",
                videoButton: "동영상을 올려보세요",
                musicButton: "좋아하는 음악을 올려보세요"
            },
            emptyOther: {
                feed: "친구를 맺으면 스토리를 함께 나눌 수 있습니다.",
                photos: "친구를 맺으면 사진을 함께 나눌 수 있습니다.",
                videos: "친구를 맺으면 동영상을 함께 나눌 수 있습니다.",
                music: "친구를 맺으면 음악을 함께 나눌 수 있습니다."
            },
            musicRoom: "의 뮤직룸",
            year: "년"
        },
        mediaView: {
            alt: {
                close: "이미지 닫기"
            }
        },
        profile: {
            birthday: "__month__월 __day__일생",
            birthdayLunar: "(음력)",
            editButton: "프로필 편집",
            playMusic: "음악재생",
            image: {
                editBackground: "배경 이미지 편집",
                upload: "사진 업로드",
                selectFromPhotos: "앨범에서 선택",
                "delete": "삭제",
                changeDefault: "기본 이미지로 변경",
                invalidFileByGif: "GIF 사진은 프로필/배경 사진으로 설정할 수 없습니다.",
                selectImage: "스토리 앨범에서 선택",
                countFirst: "총 ",
                countLast: "개의 이미지"
            },
            friend: "친구",
            removeFriend: "친구끊기",
            requestFriend: "친구신청",
            acceptFriend: "친구수락",
            favoriteFriend: "관심친구",
            requestingFriend: "요청 중",
            cancelRequestingFriend: "요청취소",
            report: "신고하기",
            doNotUseGif: "GIF 사진은 프로필/배경 사진으로 설정할 수 없습니다.",
            storyPlus: {
                follow: "소식받기",
                following: "소식 받는 중",
                unfollow: "소식끊기"
            },
            edit: {
                title: "프로필 편집",
                name: "이름",
                lastName: "이름",
                firstName: "성",
                nameGuide: "<li>스토리에서 바른 내 이름을 사용하세요.</li><li>이름 변경은 횟수/글자 제한이 있으며, 이름 외 광고/홍보성 및 부적합한 <br>콘텐츠는 타인에게 불쾌감을 줄 수 있으므로 사용할 수 없습니다.</li>",
                viewDetail: "자세히 알아보기",
                statusText: "한줄 소개",
                textStatus: "글로 설정",
                textStatusDesc: "나를 표현하는 한줄 소개를 입력해보세요.",
                musicStatus: "음악으로 설정",
                musicStatusDesc: "한줄 소개를 음악으로 설정해보세요.",
                buyMusic: '<a href="http://kakao.com/services/5" target="_blank">카카오뮤직</a>에서 음원을 구매하시면<br>좋아하는 음악을 한줄 소개로 설정할 수 있습니다.',
                noStatus: "설정 안함",
                birthday: "생일",
                year: "년",
                month: "월",
                date: "일",
                lunarCal: "음력",
                nameFullGuide: '<h1>이름 사용 가이드</h1><div class="guide_info"><strong class="tit">스토리에서 바른 내 이름을 사용하세요.</strong><p class="txt">카카오 스토리에서는 친구들과의 커뮤니케이션이 좀 더 원활할 수 있도록 바른 이름 사용을 권장하고 있습니다. 정확한 내 이름을 친구들에게<br/>알려주세요.</p><strong class="tit">이름은 다음을 포함할 수 없습니다.</strong><ul class="txt"><li>- 특수기호, 숫자, 띄어쓰기가 포함된 이름</li><li>- 한글이 포함된 글자수가 10자가 넘는 경우</li><li>- 실명이 아닌 별명</li><li>- 이름 외 광고/홍보성 및 자극적인 컨텐츠</li></ul><strong class="tit">이름 변경 횟수에 제한이 있습니다.</strong><p class="txt">스토리 이름은 본인을 나타내는 중요한 수단입니다.<br>친구들이 나를 정확하게 알아볼 수 있도록, 반복해서 이름을 변경하는 것을 제한하고 있습니다. 변경 횟수를 초과한 경우 올바른 이름으로 변경 신청을 할 수 있으며 적용에 7일 까지 소요될 수 있습니다.</p></div>',
                close: "닫기",
                cancel: "취소",
                submit: "저장",
                profileEdit: "계정설정하러가기",
                firstNameRequired: "성을 입력해주세요.",
                lastNameRequired: "이름을 입력해주세요.",
                invalidBirth: "생일이 올바르지 않습니다.",
                select: "선택",
                selected: "선택됨",
                play: "재생",
                beforeLeave: "저장하지 않은 프로필 변경 내용이 있습니다.<br/>계속하시겠습니까?",
                beforeLeaveNewLine: "저장하지 않은 프로필 변경 내용이 있습니다.\n계속하시겠습니까?",
                leavePage: "페이지에서 나가기",
                stayHere: "이 페이지에 머물기"
            },
            alt: {
                birthdayTitle: "생일",
                editProfileImage: "프로필 이미지 편집",
                toggleLayer: "설정 레이어 열기/닫기",
                warning: "주의",
                howTo: "이름 입력법",
                inputTextStatus: "한줄 소개 글 입력"
            }
        },
        gnb: {
            menu: {
                login: "로그인",
                tooltip: "로그인 후 __name__님의 소식에 느낌과 댓글을 남겨보세요!"
            },
            footer: {
                title: "Kakao",
                kakaoTalk: "카카오톡",
                kakaoGroup: "카카오그룹",
                kakaoMusic: "카카오뮤직",
                kakaoPage: "카카오페이지",
                kakaoGame: "카카오게임",
                kakaoStyle: "카카오스타일",
                kakaoPlace: "카카오플레이스",
                kakaoHome: "카카오홈",
                kakaoAgit: "카카오아지트",
                kakaoAccount: "카카오계정",
                kakaoLink: "카카오링크",
                kakaoDev: "Kakao developers_",
                companyInfo: "회사소개",
                terms: "이용약관",
                privacy: "개인정보취급방침",
                policy: "운영정책",
                kakaoCorp: "KAKAO Corp.",
                copyright: "2014 ©"
            },
            profile: {
                myStory: "내스토리",
                myStoryPlus: "내채널",
                settings: "설정",
                logout: "로그아웃",
                notice: "공지사항",
                help: "도움말",
                inquiry: "문제신고",
                suggest: "개선의견",
                aboutKakaoStory: "About 카카오스토리",
                appstore: "App Store",
                googlePlay: "Google Play",
                alt: {
                    newNotice: "new"
                }
            },
            noti: {
                recent: "최근 알림",
                loading: "로딩 중",
                noRecent: "최근 알림이 없습니다."
            },
            newFeed: "새 소식",
            toggleWriteTooltip: "작성중인 소식이 있습니다.",
            alt: {
                footerFamily: "카카오다른서비스보기",
                news: "새소식",
                kakaostory: "카카오스토리",
                write: "새소식올리기",
                friends: "친구 보기",
                noti: "최근 알림"
            }
        },
        snb: {
            menu: {
                feed: "소식",
                myStory: "내스토리",
                friends: "친구",
                more: "더보기"
            }
        },
        date: {
            justNow: "방금 전"
        },
        report: {
            title: "신고하기",
            warn: "허위 신고시 불이익을 받을 수 있습니다.",
            cancel: "취소",
            submit: "신고하기",
            success: "접수되었습니다.<br/>신고하신 내용은 운영정책에 따라 처리됩니다.",
            harm: {
                title: "유해정보 신고",
                activity: "게시물 신고하기",
                profile: "사용자 신고하기",
                comment: "댓글 신고하기",
                guide: "신고하신 내용은 운영정책에 따라 처리되며, 허위 신고 시 불이익을 받을 수 있습니다.",
                etc: "기타",
                etcPlaceholder: "기타 사유를 적어주세요.",
                reasonPlaceholder: "신고 사유를 입력해주세요.",
                desc: "불법적인 내용이거나, 서비스 이용목적에<br>부합하지 않는 스토리를 신고해 주세요.",
                noCategory: "신고 내용을 선택해주세요.",
                categoryEtc: "기타를 선택하면 사유를 함께 입력해야합니다.",
                maxLength: "사유는 __count__자까지 입력할 수 있습니다.",
                noReason: "신고 사유를 입력해주세요.",
                error: "신고가 접수되지 않았습니다.<br/>잠시 후 다시 시도해주세요."
            },
            libel: {
                title: "권리침해 신고",
                desc: "사생활침해/명예훼손 및 저작권침해 스토리로<br>피해를 받고 있는 경우 신고해 주세요.",
                guide: '권리침해 신고는 먼저 침해한 게시물을 신고 후 \'<a href="http://story-api.kakao.com/rights" target="_blank">카카오 권리침해 신고 사이트</a>\'에서 침해 증빙서류를 다운받아 내용을 작성하여 고객센터로 온라인 접수하면 처리됩니다.',
                reasonPlaceholder: "신고 사유를 입력해주세요.",
                noReason: "신고 사유를 입력해주세요.",
                maxLength: "사유는 __count__자까지 입력할 수 있습니다.",
                error: "신고가 접수되지 않았습니다.<br/>잠시 후 다시 시도해주세요."
            },
            alt: {
                close: "닫기",
                harmEtcTitle: "기타 사유 작성",
                loading: "로딩 중",
                reasonLabel: "신고 사유 입력"
            }
        },
        account: {
            settings: "계정설정",
            profile: {
                myProfile: "내 프로필",
                editProfile: "프로필 편집",
                music: "뮤직"
            },
            storyId: {
                title: "스토리아이디<br>(URL, 검색용)",
                searchable: "아이디 검색을 통해 친구가 나를 찾을 수 있도록 허용합니다.",
                makeId: "스토리아이디 만들기",
                rule: "영문 또는 숫자(4~15자)",
                info: "스토리 아이디는 내스토리 페이지의 URL에 사용되고,<br>친구들이 아이디로 나를 쉽게 찾을 수도 있습니다.<br>한 번 만들어진 아이디는 변경할 수 없으니 신중하게 만들어 주세요.",
                error: "설정 변경 중 문제가 발생했습니다.<br/>다시 시도해주시기 바랍니다.",
                noInput: "사용하실 스토리 아이디를 입력해주세요.",
                noSpace: "스토리 아이디에는 공백을 사용할 수 없습니다.",
                invalidChar: "스토리 아이디는 영문 또는 숫자만 사용할 수 있습니다.",
                longRule: "스토리 아이디는 영문 또는 숫자 4~15자리를 사용할 수 있습니다.",
                confirm: "만들기"
            },
            kakaoAccount: {
                title: "카카오계정",
                changePasswd: "비밀번호 변경",
                logout: "로그아웃"
            },
            quit: {
                title: "카카오스토리 탈퇴하기",
                myStoryPlus: "내 채널"
            },
            quitGuide: {
                cancel: "취소",
                quit: "카카오스토리 탈퇴",
                close: "닫기",
                msgLoadError: "카카오스토리를 탈퇴하지 못했습니다.<br/>잠시 후 다시 시도해주세요.",
                quitConfirm: "카카오스토리를 탈퇴하시겠습니까?",
                title: "카카오스토리 탈퇴하기"
            }
        },
        auth: {
            loginBox: {
                loginTitle: "카카오스토리 이용을 위해<br>로그인해주세요.",
                loginDescription: "로그인해주세요",
                download: "다운로드",
                loginArea: "로그인 영역",
                emailLabel: "카카오계정 입력",
                emailPlaceholder: "카카오계정(이메일)",
                emailTooltipBtn: "도움말 보기",
                emailTooltipText: "카카오계정은 모든 카카오 서비스와 연결된 이메일 형식의 아이디입니다.",
                passwordPlaceholder: "비밀번호",
                keepLoginCheckbox: "로그인 상태 유지",
                loginBtn: "로그인",
                loginBtnIng: "로그인 중...",
                registerBtn: "회원가입",
                registerTooltipText: "카카오톡이나 스토리를 사용하신 적이 있다면 계정이 맞는지 먼저 확인해보세요.",
                registerDescription: "카카오스토리 이용을 위해<br>프로필을 만들어주세요.",
                registerStoryBtn: "카카오스토리 시작하기",
                findEmailBtn: "카카오계정 찾기",
                findPasswordBtn: "비밀번호 찾기",
                tryOtherAccount: "다른 계정으로 로그인",
                closeBtn: "닫기"
            },
            footer: {
                about: "회사소개",
                terms: "이용약관",
                privacy: "개인정보취급방침",
                oppolicy: "운영정책",
                apps: "Apps",
                kakao: "KAKAO Corp.",
                copyright: "2014 ©",
                kakaoCorp: "2014 © KAKAO Corp."
            },
            confirmPassword: {
                description: "서비스 탈퇴 확인을 위해<br/>비밀번호를 다시 한 번 입력해주세요.",
                placeholder: "비밀번호 입력",
                submitBtn: "확인"
            },
            storyPlus: {
                storyPlusAlert: "스토리 플러스가 채널로 변경되었습니다.<br/>채널 웹에서 스토리 플러스를 채널로 변경해주세요.</br>자세한 내용은 채널 웹 페이지에서 확인해주세요.",
                reLogin: "다시 로그인하기",
                goToStoryPlus: "채널 가기"
            },
            alt: {
                kakaoStory: "카카오스토리",
                confirmPasswordArea: "비밀번호 확인 영역"
            }
        },
        register: {
            profileImage: {
                makeProfile: "프로필 만들기",
                description: "카카오스토리에서 사용할 멋진 이름과 사진을 설정해주세요.",
                upload: "직접첨부",
                profileImageUpload: "프로필 이미지 직접 첨부",
                deleteImage: "삭제하기"
            },
            name: {
                name: "이름",
                firstName: "성",
                lastName: "이름",
                required: "(필수)",
                firstNameRequired: "성을 입력해주세요.",
                lastNameRequired: "이름을 입력해주세요."
            },
            birth: {
                birthday: "생일",
                year: "년",
                month: "월",
                date: "일",
                lunarCal: "음력",
                invalidBirth: "생일이 올바르지 않습니다."
            },
            storyId: {
                storyId: "스토리 URL / ID",
                storyUrl: "story.kakao.com/",
                placeholder: "영문 또는 숫자(4~15자)"
            },
            privacy: {
                link: "개인정보 수집 및 이용",
                info: "에 동의합니다. (필수)"
            },
            privacyPopup: {
                title: "[개인정보 수집 및 이용동의]",
                items: "1. 수집 항목",
                mandatory: "(필수) 닉네임(이름), 친구목록",
                optional: "(선택) 프로필사진, 생년월일, 아이디",
                objectives: "2. 수집 및 이용목적",
                objective1: "- 서비스 기본 기능의 제공: 회원식별 및 프로필 구성, 친구 추천 및 찾기, 친구들에게 활동내역, 생일 알림",
                objective2: "- 이용자 안내 및 거래의 이행: 이용자 개별 공지 및 서비스 이용 문의/분쟁 조정, 유료서비스 이용 시 컨텐츠 전송/배송/요금정산",
                objective3: "- 신규 서비스 개발 및 마케팅/광고에의 활용: 맞춤형 서비스 제공을 위한 통계적 분석, 이벤트나 광고성 정보의 제공, 법령 등에 규정된 의무 이행, 법령이나 이용약관에 반하여 이용자에게 피해를 줄 수 있는 부정이용 방지",
                duration: "3. 보유 및 이용기간",
                durationDetail: "회원 탈퇴 시, 관련 법령 또는 회사 내부 방침에 의해 보존할 필요가 있는 경우를 제외하고는 지체 없이 파기함"
            },
            cancel: "취소",
            submit: "확인",
            alt: {
                popupServiceName: "카카오스토리",
                profileImageEdit: "프로필 이미지 편집",
                warning: "주의",
                privacyTitle: "개인정보 수집 및 이용 동의",
                inProgress: "등록 중"
            }
        },
        miniRegister: {
            description: "카카오스토리에서 사용할 멋진 이름을 설정하시면 바로 공유하실 수 있어요!",
            nameLegend: "카카오스토리 이름 설정"
        },
        notice: {
            title: "공지사항"
        },
        error: {
            unknown: "__codeName__일시적인 오류 입니다.",
            general: "예기치못한 오류가 발생하였습니다.<br/>잠시 후 다시 시도해주세요.",
            error50x: {
                message: "일시적인 오류",
                title: "일시적인 오류입니다.",
                content: "잠시 후에 다시 시도해 주세요.",
                prevPage: "이전 페이지",
                home: "스토리 홈"
            },
            error40x: {
                message: "아이코!",
                title: "페이지가 존재하지 않습니다.",
                content: "URL이 잘못됐거나 삭제된 스토리일 수 있습니다.",
                prevPage: "이전 페이지",
                home: "스토리 홈"
            },
            notFound: {
                title: "페이지가 존재하지 않습니다.",
                content: "URL이 잘못되었거나 삭제된 스토리일 수 있습니다.",
                btnHome: "스토리 홈으로",
                btnBack: "이전 페이지로"
            },
            notFoundMember: {
                title: "페이지가 존재하지 않습니다.",
                content: "URL이 잘못되었거나 삭제된 스토리일 수 있습니다.",
                btnHome: "스토리 홈으로",
                btnBack: "이전 페이지로"
            },
            alt: {
                logo: "KakaoStory"
            }
        },
        store: {
            appStore: "https://itunes.apple.com/kr/app/kakaostory/id486244601",
            googlePlay: "https://play.google.com/store/apps/details?id=com.kakao.story"
        },
        mobileAppLinkBanner: {
            openBtn: "<span>카카오스토리</span> 앱 다운받고 편하게 즐기세요!",
            closeBtn: "닫기"
        },
        openGraph: {
            type: "article",
            title: "카카오스토리",
            siteName: "카카오스토리",
            description: "누구에게나 나누고 싶은 순간이 있다. 지금 우리가 꽂힌 이야기."
        },
        about: {
            title: {
                header: "About 카카오스토리",
                story: '누구에게나 나누고픈 순간이 있다.<br>지금 우리가 꽂힌 이야기, <strong>카카오스토리</strong><span class="ico_bu"></span>',
                newStory: '<strong>새로운</strong> 스토리<span class="ico_bu"></span>',
                ourStory: '<strong>우리의</strong> 스토리<span class="ico_bu"></span>',
                history: '스토리의 <strong>히스토리</strong><span class="ico_bu"></span>'
            },
            paragraph: {
                where: "언제 어디서나",
                what: "다양한 이야기를",
                who: "친구들과 함께",
                newStory: "카카오스토리가 새로운 얼굴로 다가갑니다.<br>서비스의 성장과 함께 카카오스토리는<br>현재 우리의 모습과 앞으로 담아내고 싶은 지향점에<br>대한 고민을 함께 하고 있습니다.<br>새롭게 선보이는 BI는 '지금-나누고픈-이야기'의 의미를<br>담아낼 수 있는 기호를 상징적으로 활용했으며<br>바쁜 일상 속에서도 스토리 서비스가<br> 잠깐의 휴식, 여유, 쉼표가 되었으면 하는<br> 바람의 의미까지도 함께 담았습니다.<br>또한 카카오의 상징적인 색상과 기호를 통해<br> 쉬운 인지와 사용의 확장성을 이끌어내고자 합니다.",
                mobileNewStory: "카카오스토리가 새로운 얼굴로 다가갑니다.<br>새롭게 선보이는 BI는<br>'지금-나누고픈-이야기'의 의미를<br>담아낼 수 있는 기호를 상징적으로 활용하였습니다.",
                downloadBi: "스토리의 새로운 BI 및 icon, button을<br>eps, psd, png 등으로 다운받을 수 있습니다.",
                brief: "카카오스토리는 지금 이 순간의 일상과 다양한 관심사를<br>친구들과 함께 나누고 공감하는 서비스입니다.",
                withStoryApp: "카카오스토리 앱을 다운받아<br>더 많은 이야기를 나누세요"
            },
            btn: {
                downloadBi: "스토리 BI <em>내려받기</em>",
                startStory: "스토리 시작하기",
                prevHistory: "이전",
                nextHistory: "다음"
            },
            label: {
                writer: "작성자",
                updateDate: "작성일",
                more: "더보기"
            },
            link: {
                kakaoStory: "카카오스토리",
                kakaoFriends: "카카오프렌즈",
                serviceRequest: "서비스 문의",
                storyPlus: "채널 제휴문의",
                kakaoOfficial: "카카오 공식 홈페이지",
                kakaoTalk: "카카오톡",
                kakaoGroup: "카카오그룹",
                kakaoMusic: "카카오뮤직",
                kakaoPlace: "카카오플레이스"
            },
            alt: {
                playVideo: "재생"
            }
        },
        oldBrowser: {
            header: "브라우저를 업그레이드 하면 더 좋아요!",
            description: "아래에서 카카오스토리 지원 브라우저 최신버전을 설치하시면<br>카카오스토리의 다양한 기능을 사용하실 수 있습니다.",
            later: "나중에 할게요"
        },
        hashtag: {
            writing: "글쓰기",
            empty: {
                message: "이 해시태그를 포함한 스토리가 존재하지 않습니다.",
                prevPage: "이전 페이지",
                home: "스토리 홈"
            }
        },
        search: {
            title: {
                people: "친구",
                storyPlus: "채널",
                hashtag: "해시태그",
                idSearch: "ID 검색결과"
            },
            placeholder: {
                member: "친구, 채널, 해시태그 검색",
                guest: "채널, 해시태그 검색"
            },
            btn: {
                search: "검색",
                searchId: "ID 검색결과 보기",
                clear: "검색어 지우기"
            },
            alt: {
                loading: "로딩 중"
            },
            paragraph: {
                noSearchResult: "검색 결과가 없습니다.",
                noIdSearchResult: "ID 검색 결과가 없습니다.",
                error: "검색결과를 불러올 수 없습니다.<br>잠시 후 다시 시도해주세요."
            }
        },
        event: {
            badRequest: "잘못된 요청입니다.",
            title: {
                header: "이벤트",
                win: "축하드립니다!",
                eventEnd: "완료된 이벤트입니다.",
                noEntry: "다음 이벤트를 기대해주세요."
            },
            inputConfirm: "입력하신 배송 정보가 정확한지 확인해주세요.<br>완료하시면 더이상 수정하실 수 없습니다.",
            result: {
                completeTitle: "주소 입력이<br>완료됐습니다!",
                completeDesc: "선물은 9월 29일 이후 순차적으로 발송됩니다.<br>이벤트에 참여해주셔서 감사합니다.",
                noEntryTitle: "다음 기회에",
                noEntryDesc: "이벤트 당첨자 명단에 포함되어 있지 않습니다.<br>다음 이벤트를 기대해주세요!",
                eventEndTitle: "다음 기회에",
                eventEndDesc: "완료된 이벤트입니다.<br>다음 이벤트를 기대해주세요!",
                revisitDesc: '선물은 9월 29일 이후 순차적으로 발송됩니다.<br>이벤트에 참여해주셔서 감사합니다.<br>문의사항은 <a href="http://www.kakao.com/requests?category=19&locale=ko&service=9" target="_blank">고객센터</a>로 연락부탁드립니다.'
            },
            error: {
                name: "이름을 입력해주세요.",
                tel: "전화번호를 올바르게 입력해주세요.",
                address: "주소를 상세주소까지 입력해주세요.",
                agreement: "이벤트 경품 배송을 위해서는<br>개인정보 수집 및 이용 동의가 필요합니다."
            }
        }
    }
});
define("boot", ["space", "jquery", "underscore", "backbone", "q", "common/logger", "common/intl", "kant", "common/agent", "common/api", "mediaelement", "moment", "json3", "common/helper", "common/webFontLoader", "lang/ko", "config"], function() {
    var e = require("common/intl"),
        o = require("moment"),
        n = require("lang/ko"),
        r = require("kant"),
        t = $("script[data-router]"),
        a = t.attr("data-router"),
        i = t.attr("data-root"),
        s = require("config");
    r.start({
        host: s.kant.host,
        trackId: s.kant.trackId
    }), e.init({
        lng: "ko-KR",
        msgs: n
    }), o.lang("ko"), a && require([a], function(e) {
        e.start({
            root: i || ""
        })
    }), require(["eegg/starter"]), require(["common/util", "common/kantUtil"], function(e, o) {
        var n = $(document.body);
        return n.addClass("__" + agent.type.name + "__"), agent.support.retina && n.addClass("__" + agent.type.name + "_rtn__"), agent.browser.is.ie && 11 === agent.browser.version && n.addClass("__" + agent.browser.name + agent.browser.version + "__"), agent.browser.is.ie && agent.browser.version < 8 && !e.getCookie("_koldbrowser") ? void o.sendPageView("bro", null).then(function() {
            location.href = "/s/oldBrowser?url=" + encodeURIComponent(location.href)
        }) : void 0
    })
});
define("eegg/starter", ["config"], function(e) {
    (function() {
        var n = function() {
            var e = 600;
            return window.outerWidth - window.innerWidth > e
        }, t = function() {
            return agent.type.is.desktop && agent.browser.is.chrome
        };
        e.staticRoot && t() && n() && require(["config"], function(e) {
            require([e.staticRoot + "/js/ca.js"], function() {
                require(["eegg/consoleArt"])
            })
        })
    })()
});
define("common", function() {});
