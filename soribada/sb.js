/* made by soribada build system */
(function() {
  "use strict";
  var e = this,
      t = e.S = e.S || {},
      i = e.$ || e.jQuery,
      n = e._,
      o = e.Backbone,
      a = e.CONTEXT_PATH,
      s = e.console,
      r = e.Syncworker,
      c = {
      init: function() {
        t.slog = function() {}, "development" === t.Config.getMode() && (t.slog = function() {
          if (void 0 !== s) {
            var e = [];
            e.push("[S]"), e = e.concat(i.makeArray(arguments));
            var t = s.log;
            "function" == typeof t ? t.apply(s, e) : s.log(e)
          }
        }), t.Utils.consoleFallback(), t.slog("------------------ " + t.Config.getMode() + " mode" + "------------------ ")
      }
      },
      l = {
      POOL: {},
      POOLIndex: 0,
      POOLLength: 10,
      POOLIndexHelper: [],
      currentContentPOOLStatus: !1,
      check: function() {
        var e = this.getPoolId();
        return this.currentContentPOOLStatus = !1, this.POOL.hasOwnProperty(e) ? (this.currentContentPOOLStatus = !0, t.slog("POOL CACHING : " + e, this.POOL[e]), this.POOL[e]) : !1
      },
      push: function(e) {
        var i = this.getPoolId();
        this.POOLIndex > this.POOLLength && (this.POOLIndex = 0), this.POOL[this.POOLIndexHelper[this.POOLIndex]] && (this.POOL[this.POOLIndexHelper[this.POOLIndex]].undelegateEvents(), this.POOL[this.POOLIndexHelper[this.POOLIndex]].remove(), this.POOL[this.POOLIndexHelper[this.POOLIndex]] = null, delete this.POOL[this.POOLIndexHelper[this.POOLIndex]]), this.POOL[i] = e, this.POOLIndexHelper[this.POOLIndex] = i, t.slog("POOL PUSHED : " + i + ", POOLength : " + (parseInt(this.POOLIndex, 10) + 1) + "/" + this.POOLLength), this.POOLIndex += 1
      },
      getPoolId: function() {
        var e = window.location.hash || window.location.pathname;
        return e
      },
      getContentPoolStatus: function() {
        return this.currentContentPOOLStatus
      },
      isViewInPoolByCid: function(e) {
        for (var t = 0; this.POOLLength > t; t++) if (this.POOL[this.POOLIndexHelper[t]] && this.POOL[this.POOLIndexHelper[t]].cid == e) return !0;
        return !1
      }
      },
      u = {},
      d = {},
      p = {
      load: function(e, n) {
        var o = this,
            a = new r;
        t.LoadIndicator.show(), i(".tse-scroll-content").scrollTop(0), a.addWork(function() {
          o.loadJSs(t.loaderJSON[e].JS, function() {
            a.worksDone()
          })
        }).addWork(function() {
          o.loadHtmls(t.loaderJSON[e].HTML, function() {
            a.worksDone()
          })
        }).done(function() {
          n(), a = null, t.LoadIndicator.hide()
        }).start()
      },
      loadHtmls: function(e, o) {
        var s = this,
            c = new r;
        n.each(e, function(e) {
          c.addWork(function() {
            var o, r;
            u[e] ? c.worksDone() : (o = t.loaderVersion.HTML[e] || (new Date).valueOf(), r = "/template/" + e + ".html?lver=" + o, s.loadHTMLByAjax(r, function(o) {
              u[e] = n.filter(i(o), function(e) {
                return 1 === e.nodeType
              }), u[e] && void 0 !== u[e] && "" !== u[e] || t.slog("Loader: " + a + "/template/" + e + ".html" + " 의 내용이 없거나 로드중 문제가 발생했습니다."), c.worksDone()
            }))
          })
        }), c.done(function() {
          o(), c = null
        }).start()
      },
      loadJSs: function(e, o) {
        var a = this,
            s = new r({
            relay: !0
          });
        n.each(e, function(e) {
          s.addWork(function() {
            var n, o;
            d[e] ? s.worksDone() : (n = t.loaderVersion.JS[e] || (new Date).valueOf(), o = "/js/s/" + e + ".js?lver=" + n, "development" === t.Config.getMode() ? a.loadJSByScriptTag(o, function() {
              d[e] = !0, s.worksDone()
            }) : i.getScript(o, function() {
              d[e] = !0, s.worksDone()
            }))
          })
        }), s.done(function() {
          o(), s = null
        }).start()
      },
      loadHTMLByAjax: function(e, n) {
        i.ajax({
          url: e,
          success: function(e) {
            n(e)
          },
          error: function() {
            t.slog("Loader: " + e + "라는 파일이 없거나 로드할수없습니다..")
          },
          cache: !0,
          dataType: "html"
        })
      },
      loadJSByScriptTag: function(e, t) {
        var i = document.getElementsByTagName("head")[0],
            n = !1,
            o = document.createElement("script");
        o.type = "text/javascript", o.charset = "utf-8", o.src = a + e, i.appendChild(o), o.onreadystatechange = function() {
          ("loaded" == this.readyState || "complete" == this.readyState) && (t(), n = !1)
        }, o.onload = function() {
          n || t()
        }
      },
      get: function(e, t) {
        var o;
        if (u[e]) {
          if (o = n.find(u[e], function(e) {
            return e.id === t
          })) return i.trim(i(o).html());
          s.error("Loader: " + e + ".html에 " + t + "가없습니다.")
        } else s.error("Loader: " + e + ".html가 로드되지 않고 사용되었습니다.")
      }
      },
      v = function(e) {
      e.hasOwnProperty("data") && !e.data.hasOwnProperty("authKey") && n.extend(e.data, {
        authKey: t.AuthInfo.AUTH_KEY
      }), i.ajax({
        url: e.method || e.url,
        type: e.type || "GET",
        dataType: e.dataType || "json",
        data: e.data,
        success: function(i) {
          t.slog("API RESULT : " + (e.method ? e.method : e.url), i), e.hasOwnProperty("success") && e.success(i)
        },
        error: function(i) {
          t.slog("API RESULT : " + (e.method ? e.method : e.url), data), e.hasOwnProperty("error") && e.error(i)
        },
        cache: e.cache || !0
      })
      },
      m = {
      addSubView: function(e, t) {
        var n = this;
        this.subViews || (this.subViews = []);
        var o = this.findSubViewWithString(e);
        return t && !i.isArray(t) ? t.parentView = n : t.push = function(e) {
          e.parentView = n, Array.prototype.push.call(this, e)
        }, -1 === o ? this.subViews.push({
          name: e,
          view: t
        }) : this.subViews[o].view = t, t
      },
      subView: function(e) {
        var t, i = typeof e;
        return "number" === i ? this.subViews[e].view : "string" === i && (t = this.findSubViewWithString(e), t > -1) ? this.subViews[t].view : !1
      },
      findSubViewWithString: function(e) {
        if (this.subViews) for (var t = this.subViews.length, i = 0; t > i; i++) if (this.subViews[i].name === e) return i;
        return -1
      },
      subViewCount: function() {
        return this.subViews.length
      },
      subViewEach: function(e) {
        n.each(this.subViews, function(t) {
          i.isArray(t.view) ? n.each(t.view, function(t) {
            e(t)
          }) : e(t.view)
        })
      },
      getParentView: function() {
        return this.parentView ? this.parentView : (t.slog("SubViewManager : getParentView는 setSubView이후 시점부터 사용할수있습니다. 즉 initialize에서는 사용할수없음"), void 0)
      }
      };
  n.extend(o.View.prototype, m), n.extend(o.View.prototype, {
    isRendered: function() {
      return this.renderStatus
    },
    isPool: function() {
      return t.Pool.getContentPoolStatus()
    },
    ready: function(e) {
      return this.isPool() ? (this.onReady(), !0) : (this.onReady = e, void 0)
    },
    onReady: function() {
      t.slog("WARRNING: " + viewName + "이 onReady가 정의되기 전에 onReady가 실행되었습니다."), t.app.contentChange(this)
    }
  });
  var w = function(e, a) {
    if (t.Views.hasOwnProperty(e)) t.slog(e + "는 이미 있는 View 이름입니다.");
    else {
      var s = a.initialize || !1;
      a.initialize = function(e) {
        return this.renderStatus = !1, s && s.apply(this, i.makeArray(e)), this
      };
      var r = a.render || !1;
      a.render = function() {
        return r && r.apply(this, i.makeArray(arguments)), this.renderStatus = !0, this
      }, a.extend ? (a.constructor = function() {
        this.events = n.extend({}, t.Views[a.extend].prototype.events || {}, this.events || {}), t.Views[a.extend].prototype.constructor.apply(this, arguments)
      }, a._Super = t.Views[a.extend].prototype, a.Super = function() {
        var e = arguments[0],
            t = [].slice.call(arguments, 1);
        return this._Super[e].apply(this, t)
      }, t.Views[e] = t.Views[a.extend].extend(a)) : t.Views[e] = o.View.extend(a)
    }
  },
      g = function() {
      var e = arguments[0],
          i = [].slice.call(arguments, 1),
          n = !1,
          o = null,
          a = -1 !== e.indexOf("_Content");
      if (a && (n = t.Pool.check())) return n;
      if (t.Views.hasOwnProperty(e)) {
        if (o = new t.Views[e](i)) return a && (t.slog("VIEW CREATE : " + e, o), "NOPOOL" != o.poolFlag && t.Pool.push(o)), o;
        t.slog(e + "가 정상적으로 생성되지 않았습니다.")
      } else t.slog(e + "라는 View는 정의 되지 않았습니다.")
      };
  n.extend(o.Model.prototype, {
    _oGet: o.Model.prototype.get,
    get: function(e) {
      if (-1 !== e.indexOf(".") || this._isStringArray(e)) {
        var t = this._getFirstNode(e);
        return e = e.split("."), e = n.rest(e), 0 !== e.length ? this.getSafeJson(e.join("."), t) : t
      }
      return this._oGet(e)
    },
    getSafeJson: function(e, i) {
      var o, a, s = i;
      for (e = e.split("."), o = e.length; o;) {
        if (s = this._nextNode(e[0], s), void 0 === s) return t.slog("데이터를 파싱하는중 에러가 발생했습니다. " + a + "에 " + e[0] + "가 없습니다. 모델객체 : ", this), void 0;
        a = e[0], e = n.rest(e), o -= 1
      }
      return s
    },
    _getFirstNode: function(e) {
      var t, i;
      return e = e.split("."), this._isStringArray(e[0]) ? (i = this._getSplitArray(e[0]), t = this._oGet(i[0]), t[i[1]]) : this._oGet(e[0])
    },
    _nextNode: function(e, t) {
      var i;
      return t ? this._isStringArray(e) ? (i = this._getSplitArray(e), void 0 !== t[i[0]] ? t[i[0]][i[1]] : void 0) : void 0 !== t[e] ? t[e] : void 0 : void 0
    },
    _isStringArray: function(e) {
      return -1 === e.indexOf("[") ? !1 : !0
    },
    _getSplitArray: function(e) {
      var t = e.indexOf("["),
          i = e.indexOf("]"),
          n = [];
      return n.push(e.substring(0, t)), n.push(e.slice(t + 1, i) - 0), n
    }
  });
  var f = function(e, a) {
    if (a && a.hasOwnProperty("AMFlag") && a.AMFlag) {
      var r = {
        setAMOptions: function(e) {
          this.AMOptions || this.initOptions(), this.AMOptions = n.extend(this.AMOptions, e || {})
        },
        setAMApiOptions: function(e) {
          this.AMOptions || this.initOptions(), this.AMOptions.apiOptions = n.extend(this.AMOptions.apiOptions, e)
        },
        initOptions: function() {
          this.infiniteReadFlag = !0, this.AMOptions = {
            pageAttr: "page",
            apiOptions: {},
            apiUrl: null,
            dataType: "jsonp"
          }
        },
        getAMApiOption: function(e) {
          return this.AMOptions.apiOptions[e]
        },
        read: function(e) {
          this.apiCall(e)
        },
        infiniteRead: function(e) {
          this.infiniteReadFlag ? (t.LoadIndicator.show(), this.AMOptions.apiOptions[this.AMOptions.pageAttr] += 1, this.read(function() {
            t.LoadIndicator.hide(), e && e()
          })) : e && e()
        },
        stopInfiniteRead: function() {
          this.infiniteReadFlag = !1
        },
        apiCall: function(e) {
          var o = this;
          this.AMOptions.apiUrl ? (t.slog("Api Manager: APICALL - " + this.AMOptions.apiUrl + ", Options - ", n.extend(this.AMOptions.apiOptions, {
            authKey: t.AuthInfo.AUTH_KEY
          })), this.jqXHR = i.ajax({
            url: this.AMOptions.apiUrl,
            data: this.AMOptions.apiOptions,
            success: function(i) {
              t.slog("Api Manager: API SUCCESS - " + o.AMOptions.apiUrl + ", data - ", i), o.restructure(i), e && e()
            },
            error: function(e, t) {
              "abort" != t && s.error("ApiManager : API ERROR - " + o.AMOptions.apiUrl + " API호출할때 에러가 발생했습니다, " + t)
            },
            dataType: this.AMOptions.dataType
          })) : t.slog("Api Manager: AMOptions이 제대로 설정되어있지 않습니다.")
        },
        abortApiCall: function() {
          this.jqXHR && this.jqXHR.abort()
        },
        restructure: function() {
          t.slog("Api Manager: restructure를 구현해주세요!")
        }
      };
      a = n.extend(r, a)
    } else if (a && a.hasOwnProperty("AMCFlag") && a.AMCFlag) {
      var c = {
        setAM: function(e, t) {
          var i;
          return this.AMs || (this.AMs = []), i = this.AMs.length, this.AMs[i] = {
            name: e,
            AM: t
          }, t
        },
        AM: function(e) {
          var t = typeof e,
              i = this.AMs.length;
          if ("number" === t) return this.AMs[e].AM;
          if ("string" === t) for (var n = 0; i > n; n++) if (this.AMs[n].name === e) return this.AMs[n].AM;
          return !1
        },
        read: function(e) {
          var t, i;
          t = i = this.AMs.length;
          for (var n = function() {
            t -= 1, t || (e(), t = null, i = null)
          }, o = 0; i > o; o++) this.AM(o).read(n)
        }
      };
      a = n.extend(c, a)
    }
    t.Models.hasOwnProperty(e) ? t.slog(e + "는 이미 있는 Model 이름입니다.") : t.Models[e] = -1 !== e.indexOf("_C") ? o.Collection.extend(a) : o.Model.extend(a)
  },
      h = function() {
      function e() {
        return n.apply(this, o)
      }
      var i = arguments[0],
          n = t.Models[i],
          o = [].slice.call(arguments, 1),
          a = null;
      return t.Models.hasOwnProperty(i) ? (o.length ? (e.prototype = n.prototype, a = new e) : a = new n, a) : (t.slog(i + "라는 Model 정의 되지 않았습니다."), void 0)
      },
      y = o.View.extend({
      tagName: "div",
      className: "loadIndicator",
      retainCount: 0,
      indicatorEL: null,
      render: function() {
        return this.$el.append("<div id='indi'><img src='//image.soribada.com/image/v25/common/large.png' alt='로딩바'></div>"), this
      },
      show: function() {
        if (0 > this.retainCount ? this.retainCount = 1 : this.retainCount += 1, 1 == this.retainCount) {
          this.$el.css("display", "block");
          var e = function() {
            i("#indi img").rotate({
              angle: 0,
              animateTo: 500,
              callback: e,
              easing: function(e, t, i, n, o) {
                return n * (t / o) + i
              }
            })
          };
          e()
        }
      },
      hide: function() {
        var e = this;
        this.retainCount -= 1, 1 > this.retainCount && setTimeout(function() {
          e.hideAction(), e = null
        }, 350)
      },
      hideAction: function() {
        1 > this.retainCount && ("" !== this.$el.css("display") && i("#indi img").stopRotate(), this.$el.css("display", "none"))
      },
      isLoading: function() {
        return this.retainCount > 0 ? !0 : !1
      },
      reset: function() {
        this.retainCount = 0, this.hideAction()
      }
    }),
      L = function(e, n) {
      t.Config.init({
        appType: e
      }), i("body").addClass(t.Utils.BrowserDetect.OS + " " + t.Utils.BrowserDetect.browser + " " + "version" + parseInt(t.Utils.BrowserDetect.version, 10)), n && n(), t.con.init()
      };
  t.rootPath = window.location.protocol + "//" + window.location.hostname, t.Config = {
    init: function(e) {
      this.attr = n.extend({
        appType: !1
      }, e || {});
      var i = t.Utils.JSCookies.getCookie("SoribadaAppMode");
      this.attr.mode = i ? i : "product"
    },
    setMode: function(e) {
      this.attr.mode = e, t.Utils.JSCookies.setCookie("SoribadaAppMode", e, 30)
    },
    getMode: function() {
      return this.attr.mode
    }
  }, t.Const.SORIBADAWWW = 1, t.Const.SORIBADAMOBILEWEB = 2, t.Const.SORIBADAP2P = 3, t.Views = {}, t.Views.extend = w, t.Views.create = g, t.Models = {}, t.Models.extend = f, t.Models.create = h, t.Loader = p, t.Pool = l, t.LoadIndicator = new y, t.con = c, t.Api = v, t.init = L, "Explorer" == t.Utils.BrowserDetect.browser && 8 >= parseInt(t.Utils.BrowserDetect.version, 10) && -1 != navigator.appVersion.indexOf("Windows NT 5.1") ? (t.Utils.Osver = !0, t.Utils.SEEKING = 1e3, t.Utils.MainIndex = 4, t.Utils.Mtimeout = 0, t.Utils.Settime = 0) : (t.Utils.Osver = !1, t.Utils.SEEKING = 500, t.Utils.MainIndex = 3, t.Utils.Mtimeout = 5e3, t.Utils.Settime = 50), t.slog = function() {}, t.hasOwnProperty("loaderVersion") || (t.loaderVersion = {
    JS: {},
    HTML: {}
  }), t.app = {}, o.Model.prototype.resetToDefaults = function() {
    this.clear(), this.set(this.defaults)
  }, o.Model.prototype.resetToDatas = function(e) {
    this.clear(), this.set(e)
  }, o.Model.prototype.cloneInstance = function() {
    return n.clone(this)
  }, t.Models.extend("GlobalDispatch", {
    setFavorite: function(e) {
      this.trigger("favorite", e)
    }
  }), t.GlobalDispatch = t.Models.create("GlobalDispatch")
}).call(this), function(e, t) {
  t.Router = Backbone.Router.extend({
    routes: {
      "": "main",
      "event/list/motion/:type/:page": "motionList",
      "event/list/win/:type/:page": "winList",
      "event/show/:no": "eventShowDetail",
      "event/album/:no": "eventAlbumDetail",
      "event/promotion/:no": "eventPromotionDetail",
      "event/winner/:no": "eventWinDetail",
      "cs/faq/list": "faqList",
      "cs/faq/detail": "faqDetail",
      "cs/qa": "qa",
      "mypage/ticket": "myPageTicket",
      "mypage/payment": "myPagePayment",
      "mypage/os_payment": "myPageOSPayment",
      "mypage/settings": "myPageSettings",
      "mypage/info": "myPageInfo",
      mypage: "myPageTicket",
      "ticket/hit": "ticketHit",
      "ticket/smart": "ticketSmart",
      "ticket/all": "ticketAll",
      "ticket/coupon": "ticketCoupon",
      coupon: "ticketCoupon",
      "music/genre": "genre",
      "music/genre/:code": "genre",
      "music/genre/:code/:subDepth": "genre",
      "music/chart": "chart",
      "music/chart/:type": "chart",
      "music/chart/:type/:query": "chart",
      "music/new": "newRelease",
      "music/new/:subDepth": "newRelease",
      "music/new/:subDepth/:idx": "newRelease",
      "music/album/:tid": "album",
      "music/album/:tid/:type": "album",
      "music/artist": "artist",
      "music/artist/:type": "artist",
      "music/artist/:type/:subDepth": "artist",
      "music/artist/:type/:subDepth/:twpDepth": "artist",
      "music/song": "song",
      "music/song/:kid": "song",
      "music/video": "mvideo",
      "music/today/:y/:m/:d": "todayMusic",
      "writestar/:aid/:temp": "writestar",
      "music/theme": "theme",
      "music/theme/:type": "theme",
      favorite: "favorite",
      ":id/favorite": "favorite",
      ":id/favorite/:type": "favorite",
      mychart: "mychart",
      ":id/mychart": "mychart",
      "search/:type/.*": "search",
      "search/:type/:query": "search",
      "search/:type/:query/:Oquery": "search",
      playlist: "playlists",
      ":id/playlist": "playlists",
      ":id/playlist/:pid": "PlaylistDetail",
      playerque: "playerque",
      "cloud/nowplaying": "nowPlaying",
      ":id/cloud/buysong": "buySong",
      ":id/cloud/recentsong": "recentSong",
      cloud: "cloud",
      "music/story/:code": "story",
      "music/profile/:id": "profileTest",
      "cloud/friend/follow": "friendFollow",
      "cloud/friend/facebook": "friendFacebook",
      "cloud/friend/orgel": "friendOrgel",
      ":id/follows": "followList",
      ":id/followers": "followerList",
      "cloud/friend/notic": "noticFeed",
      ":id": "profile",
      ":id/cloud": "cloud",
      ":id/facebook": "friendFacebook",
      ":id/listencloud": "listencloud",
      "*other": "defaultRoute"
    },
    initialize: function() {
      var t = this;
      e("a").unbind("click"), e(document).on("click", "a", function(i) {
        var n = e(this);
        "_top" != n.attr("target") && "_blank" != n.attr("target") && (i.preventDefault(), t.anchorClick(this, t))
      })
    },
    main: function() {
      t.Loader.load(["Main"], function() {
        var e = t.Views.create("Main_Content");
        e.render().renderStatus && (t.app.contentChange(e), t.Views.create("Main2_Content"))
      })
    },
    main_old: function() {
      t.Loader.load(["Main"], function() {
        var i, n = t.Views.create("Main_Content");
        n.ready(function() {
          t.app.contentChange(n), i = t.Utils.Osver ? null : 5e3, e(".album-event .album-wrap").after('<div class="pageControl">').cycle({
            fx: "fade",
            speed: "fast",
            timeout: i,
            pager: e(".album-event .pageControl"),
            pagerAnchorBuilder: function() {
              return '<button class="btn"><span class="ir"></span></button>'
            },
            pause: !0
          }), e(".writeStar ul").after('<div class="pageControl">').cycle({
            fx: "fade",
            speed: "fast",
            timeout: i,
            prev: ".starPrev",
            next: ".starNext",
            pause: !0
          })
        })
      })
    },
    profile: function(e) {
      e || (t.AuthInfo.isLogin ? e = t.AuthInfo.USERID : t.Utils.login()), e == t.AuthInfo.USERID ? t.Loader.load(["Friend"], function() {
        var i = t.Views.create("followList_Content", e);
        t.app.contentChange(i)
      }) : t.Loader.load(["Cloud"], function() {
        var i = t.Views.create("Cloud_Content", e);
        t.app.contentChange(i)
      })
    },
    listencloud: function(e) {
      e || (t.AuthInfo.isLogin ? e = t.AuthInfo.USERID : t.Utils.login()), t.Loader.load(["Listencloud"], function() {
        var i = t.Views.create("Listencloud_Content", e);
        t.app.contentChange(i)
      })
    },
    theme: function(e) {
      t.Loader.load(["Theme"], function() {
        var i = t.Views.create("Theme_Content", e);
        t.app.contentChange(i)
      })
    },
    story: function() {
      var e = {
        stype: 1,
        typeId: "KD0007237001001",
        page: 1,
        count: 10
      };
      t.Loader.load(["Story"], function() {
        var i = t.Views.create("storyView", e);
        i.ready(function() {
          t.app.contentChange(i)
        })
      })
    },
    noticFeed: function() {
      t.Loader.load(["Friend"], function() {
        var e = t.Views.create("notice_Content");
        t.app.contentChange(e)
      })
    },
    friendFollow: function() {
      t.AuthInfo.isLogin ? t.Loader.load(["Friend"], function() {
        var e = t.Views.create("follow_Content");
        t.app.contentChange(e)
      }) : t.Utils.login()
    },
    friendFacebook: function(e) {
      t.AuthInfo.USERID == e ? t.AuthInfo.isLogin ? t.Loader.load(["Friend"], function() {
        if (1 > t.AuthInfo.FACEBOOKID.length) return alert("페이스북 계정이 연결되지 않았습니다.\n마이페이지에서 페이스북 계정 연결 후 다시 시도해주세요."), t.router.navigateExt("/mypage/info"), !1;
        var i = t.Views.create("Friend_Content", e);
        t.app.contentChange(i)
      }) : t.Utils.login() : t.router.navigateExt("/" + e)
    },
    friendOrgel: function() {
      t.Loader.load(["Friend"], function() {
        var e = t.Views.create("orgel_Content");
        t.app.contentChange(e)
      })
    },
    followList: function(e) {
      t.Loader.load(["Friend"], function() {
        var i = t.Views.create("followList_Content", e);
        t.app.contentChange(i)
      })
    },
    followerList: function(e) {
      t.Loader.load(["Friend"], function() {
        var i = t.Views.create("followerList_Content", e);
        t.app.contentChange(i)
      })
    },
    motionList: function(e, i) {
      var n = {
        type: e,
        page: i,
        menu: "motion"
      };
      t.Loader.load(["Event"], function() {
        var e = t.Views.create("motionList_Content", n);
        t.app.contentChange(e)
      })
    },
    winList: function(e, i) {
      var n = {
        type: e,
        page: i
      };
      t.Loader.load(["Event"], function() {
        var e = t.Views.create("winList_Content", n);
        t.app.contentChange(e)
      })
    },
    eventShowDetail: function(e) {
      t.Loader.load(["Event"], function() {
        var i = t.Views.create("eventShowDetail_Content", e);
        t.app.contentChange(i)
      })
    },
    eventAlbumDetail: function(e) {
      t.Loader.load(["Event"], function() {
        var i = t.Views.create("eventAlbumDetail_Content", e);
        t.app.contentChange(i)
      })
    },
    eventPromotionDetail: function(e) {
      -1 != e.indexOf("?") && (e = e.split("?")[0]);
      var i = "pageView_" + e + "_PCWEB";
      _gaq.push(["_trackEvent", "kanu", i, "EventPageView"]), t.Loader.load(["Event"], function() {
        var i = t.Views.create("eventPromotionDetail_Content", e);
        i.ready(function() {
          t.app.contentChange(i)
        })
      })
    },
    eventWinDetail: function(e) {
      t.Loader.load(["Event"], function() {
        var i = t.Views.create("eventWinDetail_Content", e);
        i.ready(function() {
          t.app.contentChange(i)
        })
      })
    },
    myPageTicket: function() {
      t.AuthInfo.isLogin || t.Utils.login(), t.Loader.load(["MyPage"], function() {
        var e = t.Views.create("MyPageTicket_Content");
        t.app.contentChange(e)
      })
    },
    myPagePayment: function() {
      t.AuthInfo.isLogin || t.Utils.login(), t.Loader.load(["MyPage"], function() {
        var e = t.Views.create("MyPagePayment_Content");
        t.app.contentChange(e)
      })
    },
    myPageOSPayment: function() {
      t.AuthInfo.isLogin || t.Utils.login(), t.Loader.load(["MyPage"], function() {
        var e = t.Views.create("MyPageOSPayment_Content");
        t.app.contentChange(e)
      })
    },
    myPageSettings: function() {
      t.AuthInfo.isLogin || t.Utils.login(), t.Loader.load(["MyPage"], function() {
        var e = t.Views.create("MyPageSettings_Content");
        t.app.contentChange(e)
      })
    },
    myPageInfo: function() {
      t.AuthInfo.isLogin || t.Utils.login(), t.Loader.load(["MyPage"], function() {
        var e = t.Views.create("MyPageInfo_Content");
        t.app.contentChange(e)
      })
    },
    ticketHit: function() {
      t.Loader.load(["Ticket"], function() {
        var e = t.Views.create("TicketHit_Content");
        t.app.contentChange(e)
      })
    },
    ticketSmart: function() {
      t.Loader.load(["Ticket"], function() {
        var e = t.Views.create("TicketSmart_Content");
        t.app.contentChange(e)
      })
    },
    ticketAll: function() {
      t.Loader.load(["Ticket"], function() {
        var e = t.Views.create("TicketAll_Content");
        t.app.contentChange(e)
      })
    },
    ticketCoupon: function() {
      t.Loader.load(["Ticket"], function() {
        var e = t.Views.create("TicketCoupon_Content");
        t.app.contentChange(e)
      })
    },
    genre: function(e, i) {
      e ? (i || (i = "main"), t.Loader.load(["GenreDetail"], function() {
        var n = t.Views.create("NewGenreDetail_Content", e, i);
        n.ready(function() {
          t.app.contentChange(n)
        })
      })) : t.Loader.load(["GenreMain"], function() {
        var e = t.Views.create("Genremain_Content");
        e.ready(function() {
          t.app.contentChange(e)
        })
      })
    },
    nowPlaying: function() {
      t.Loader.load(["NowPlaying"], function() {
        var e = t.Views.create("NowPlaying_Content");
        e.ready(function() {
          t.app.contentChange(e)
        })
      })
    },
    buySong: function(e) {
      t.Loader.load(["BuySong"], function() {
        var i = t.Views.create("BuySong_Content", e);
        i.ready(function() {
          t.app.contentChange(i)
        })
      })
    },
    recentSong: function() {
      t.Loader.load(["recentSong"], function() {
        var e = t.Views.create("RecentSong_Content");
        e.ready(function() {
          t.app.contentChange(e)
        })
      })
    },
    chart: function(e, i) {
      t.Loader.load(["Chart"], function() {
        var n = t.Views.create("Chart_Content", e, i);
        n.ready(function() {
          t.app.contentChange(n)
        })
      })
    },
    favorite: function(e, i) {
      var n = e;
      n || (t.AuthInfo.isLogin ? n = t.AuthInfo.USERID : t.Utils.login()), t.Loader.load(["Favorite"], function() {
        var e = t.Views.create("Favorite_Content", n, i);
        e.ready(function() {
          t.app.contentChange(e)
        })
      })
    },
    mychart: function(e) {
      var i = e;
      i || (t.AuthInfo.isLogin ? i = t.AuthInfo.USERID : t.Utils.login()), t.Loader.load(["Mychart"], function() {
        var e = t.Views.create("Mychart_Content", i);
        e.ready(function() {
          t.app.contentChange(e)
        })
      })
    },
    newRelease: function(e, i) {
      t.Loader.load(["NewRelease"], function() {
        var n = t.Views.create("NewAlbums_Content", e, i);
        t.app.contentChange(n)
      })
    },
    album: function(i, n) {
      i && t.Loader.load(["Album"], function() {
        var o = t.Views.create("AlbumDetail_Content", i);
        "KD0010619" == i && e.getJSON("/api/album/event_log/" + i + "/" + n), o.ready(function() {
          t.app.contentChange(o)
        })
      })
    },
    artist: function(e, i, n) {
      void 0 !== e && "daily" != e && "weekly" != e && "monthly" != e && "all" != e ? (i || (i = "main"), n || (n = "all"), t.Loader.load(["ArtistDetail"], function() {
        var o = t.Views.create("NewArtistDetail_Content", e, i, n);
        o.ready(function() {
          t.app.contentChange(o)
        })
      })) : t.Loader.load(["ArtistMain"], function() {
        var i = t.Views.create("Artist_Content", e);
        t.app.contentChange(i)
      })
    },
    song: function(e) {
      t.router.navigateExt("/music/album/" + e.substring(0, 9))
    },
    PlaylistDetail: function(e, i) {
      t.Loader.load(["PlaylistDetail"], function() {
        var e = t.Views.create("PlaylistDetail_Content", i);
        e.ready(function() {
          t.app.contentChange(e)
        })
      })
    },
    playlists: function(e) {
      var i = e;
      i || (t.AuthInfo.isLogin ? i = t.AuthInfo.USERID : t.Utils.login()), t.Loader.load(["Playlists"], function() {
        var e = t.Views.create("Playlists_Content", i);
        e.ready(function() {
          t.app.contentChange(e)
        })
      })
    },
    cloud: function(e) {
      e || (t.AuthInfo.isLogin ? e = t.AuthInfo.USERID : t.Utils.login()), t.Loader.load(["Cloud"], function() {
        var i = t.Views.create("Cloud_Content", e);
        t.app.contentChange(i)
      })
    },
    search: function(i) {
      var n = ("" + window.location.href).split("?")[1] || "",
          o = {
          q1: void 0,
          q2: void 0
          };
      e.each(("" + n).split("&"), function(e, t) {
        var i = t.match(/q1=.*/i),
            n = t.match(/q2=.*/i);
        null !== i && (o.q1 = i[0].replace("q1=", "")), null !== n && (o.q2 = n[0].replace("q2=", ""))
      }), void 0 === o.q1 && (location.href = "/"), t.Loader.load(["Search"], function() {
        var e = t.Views.create("Search_Content", i, o.q1, o.q2);
        t.app.contentChange(e)
      })
    },
    yswon: function() {
      t.Loader.load(["Yswon"], function() {
        var e = t.Views.create("Yswon_Content");
        e.ready(function() {
          t.app.contentChange(e)
        })
      })
    },
    todayMusic: function(e, i, n) {
      var o = {
        y: e,
        m: i,
        d: n
      };
      t.Loader.load(["Today"], function() {
        var e = t.Views.create("Today_Content", o);
        t.app.contentChange(e)
      })
    },
    writestar: function(e) {
      var i = {
        aid: e
      };
      t.Loader.load(["Writestar"], function() {
        var e = t.Views.create("Writestar_Content", i);
        t.app.contentChange(e)
      })
    },
    mvideo: function() {
      t.Loader.load(["Video"], function() {
        var e = t.Views.create("Musicvideo_Content");
        t.app.contentChange(e)
      })
    },
    defaultRoute: function() {},
    anchorClick: function(i) {
      var n = e(i).attr("href"),
          o = e(i).children("img").attr("target");
      if (n) {
        -1 !== n.indexOf(t.rootPath) && (n = n.split(t.rootPath)[1]), "bnr-topright" == i.className && "_blank" == o ? window.open(n) : this.navigateExt(n);
        var a = t.AuthInfo.VID;
        e.getJSON("/api/member/get_auth_info?callback=?", function(e) {
          a != e.VID && window.location.reload()
        })
      }
    },
    navigateExt: function(e, i) {
      t.Scroll.reset(), t.LoadIndicator.reset(), t.app.player.resetCallback(), void 0 === i ? this.navigate(e, {
        trigger: !0
      }) : i === !1 && this.navigate(e, {
        trigger: !1
      }), document.title = t.app.noticeCounterText + "소리바다", _gaq.push(["_trackPageview", e])
    }
  })
}(jQuery, window.S = window.S || {}), function(e, t) {
  t.loaderJSON = {
    App_old: {
      JS: ["model/artist", "model/genre", "model/song", "model/album", "model/localstorage", "model/playlist", "model/musicvideo", "model/player", "model/cart", "model/friend", "model/event", "model/nowplaying", "model/app", "view/searchbox", "view/player", "view/song", "view/cart", "view/video", "view/tabs", "view/app", "view/actionbutton", "viewc/app"],
      HTML: ["common/layout", "player/player", "player/video", "common/cart", "common/ticketpop", "event/event", "common/popup", "common/actionbutton", "music/song"]
    },
    AppNew: {
      JS: ["model/app", "view/app", "viewc/app", "model/song", "view/song", "model/artist", "model/genre", "model/album", "model/localstorage", "model/playlist", "model/musicvideo", "model/player", "view/player", "model/cart", "view/cart", "model/friend", "model/event", "view/searchbox", "view/video", "view/tabs", "view/actionbutton"],
      HTML: ["common/layout", "player/player", "player/video", "common/cart", "common/ticketpop", "event/event", "common/popup", "common/actionbutton", "music/song"]
    },
    Main: {
      JS: ["viewc/maincontents"],
      HTML: ["common/main"]
    },
    Main_old: {
      JS: ["viewc/maincontents", "view/catalog", "view/pagination"],
      HTML: ["common/main", "music/gallerylist"]
    },
    Chart: {
      JS: ["view/song", "view/tabs", "viewc/chart"],
      HTML: ["music/storecont", "music/song"]
    },
    Favorite: {
      JS: ["view/tabs", "view/catalog", "viewc/favorite", "view/playlistlist", "model/artist", "viewc/playlists", "viewc/playlistdetail"],
      HTML: ["music/storecont", "music/gallerylist", "cloud/playlistcont", "music/favorite"]
    },
    Mychart: {
      JS: ["model/profile", "model/song", "model/artist", "model/album", "model/story", "view/cloudcommon", "viewc/mychart", "view/song", "view/catalog", "view/story"],
      HTML: ["cloud/profile", "cloud/playhistorycont", "music/song", "music/gallerylist", "story/story"]
    },
    MyPage: {
      JS: ["model/mypage", "viewc/mypage", "viewc/mypage_info", "view/mypage"],
      HTML: ["user/mypage", "user/mypage_info"]
    },
    Ticket: {
      JS: ["viewc/ticket", "view/ticket"],
      HTML: ["user/ticket"]
    },
    Friend: {
      JS: ["viewc/friend", "model/profile", "view/cloudcommon"],
      HTML: ["friend/friend", "cloud/profile"]
    },
    Event: {
      JS: ["model/event", "model/address", "viewc/event"],
      HTML: ["event/event", "event/promotion"]
    },
    Cs: {
      JS: ["model/cs", "viewc/cs"],
      HTML: ["event/cs"]
    },
    NewRelease: {
      JS: ["view/catalog", "view/tabs", "viewc/newrelease"],
      HTML: ["music/storecont", "music/gallerylist"]
    },
    ArtistDetail: {
      JS: ["model/story", "model/musicListen", "view/song", "view/tabs", "view/catalog", "view/infobox", "view/relatedgenre", "view/activebox", "view/story", "view/musicListen", "viewc/artistdetail"],
      HTML: ["music/storecont", "music/artistdetail", "music/infobox", "music/song", "music/gallerylist", "story/story"]
    },
    ArtistMain: {
      JS: ["view/catalog", "viewc/artistmain", "view/tabs"],
      HTML: ["music/storecont", "music/gallerylist", "music/artist"]
    },
    GenreDetail: {
      JS: ["view/tabs", "view/song", "view/catalog", "view/relatedgenre", "viewc/genredetail"],
      HTML: ["music/storecont", "music/song", "music/gallerylist"]
    },
    GenreMain: {
      JS: ["view/catalog", "viewc/genremain"],
      HTML: ["music/storecont", "music/gallerylist"]
    },
    Album: {
      JS: ["model/story", "model/musicListen", "view/catalog", "view/song", "view/tabs", "view/infobox", "view/relatedgenre", "view/activebox", "view/story", "view/musicListen", "viewc/albumdetail", "viewc/event"],
      HTML: ["music/storecont", "music/infobox", "music/song", "music/gallerylist", "story/story"]
    },
    Song: {
      JS: ["model/story", "model/musicListen", "view/catalog", "view/song", "view/tabs", "view/infobox", "view/relatedgenre", "view/activebox", "view/story", "viewc/playlists", "view/musicListen", "viewc/songdetail"],
      HTML: ["music/storecont", "music/infobox", "music/song", "music/gallerylist", "story/story"]
    },
    Story: {
      JS: ["model/story", "view/story"],
      HTML: ["story/story"]
    },
    NowPlaying: {
      JS: ["model/nowplaying", "view/song", "viewc/nowplaying"],
      HTML: ["music/song", "cloud/nowplaying"]
    },
    BuySong: {
      JS: ["viewc/buysong", "view/song"],
      HTML: ["cloud/buysong", "music/song"]
    },
    recentSong: {
      JS: ["viewc/recentsong", "view/song"],
      HTML: ["cloud/recentsong", "music/song"]
    },
    Listencloud: {
      JS: ["view/catalog", "viewc/listencloud"],
      HTML: ["cloud/playhistorycont", "music/gallerylist"]
    },
    Profile: {
      JS: ["model/profile", "model/song", "model/artist", "model/album", "model/story", "view/cloudcommon", "viewc/profile", "view/song", "view/catalog", "view/story"],
      HTML: ["cloud/profile", "cloud/playhistorycont", "music/song", "music/gallerylist", "story/story"]
    },
    Playlists: {
      JS: ["model/profile", "view/cloudcommon", "view/song", "view/playlistlist", "viewc/playlists", "viewc/playlistdetail"],
      HTML: ["music/song", "cloud/profile", "cloud/playlistcont"]
    },
    PlaylistDetail: {
      JS: ["view/song", "viewc/playlistdetail"],
      HTML: ["music/song", "cloud/playlistcont"]
    },
    Cloud: {
      JS: ["model/profile", "view/cloudcommon", "view/song", "view/tabs", "view/catalog", "viewc/cloud"],
      HTML: ["cloud/profile", "music/song", "music/gallerylist", "cloud/cloudcont"]
    },
    Search: {
      JS: ["view/song", "view/tabs", "view/catalog", "view/playlistlist", "viewc/search", "viewc/playlistdetail"],
      HTML: ["music/song", "music/gallerylist", "cloud/playlistcont", "music/search"]
    },
    Guide: {
      JS: ["model/musicvideo", "model/player", "view/player", "view/video"],
      HTML: ["etc/serviceguide", "player/video"]
    },
    Yswon: {
      JS: ["viewc/yswon", "model/yswon"],
      HTML: ["music/storecont"]
    },
    ContDetailTest: {
      JS: ["view/song", "view/tabs", "view/infobox"],
      HTML: ["music/storecont", "music/song"]
    },
    Jcseong: {
      JS: ["viewc/jcseong", "model/jcseong"],
      HTML: ["temp/jcseong"]
    },
    Skkim: {
      JS: ["view/song", "view/tabs", "viewc/skkim"],
      HTML: ["music/storecont", "music/song"]
    },
    Video: {
      JS: ["viewc/videomain", "view/video", "model/musicvideo"],
      HTML: ["music/mvideo"]
    },
    Today: {
      JS: ["viewc/today", "model/today", "view/song"],
      HTML: ["content/today"]
    },
    Theme: {
      JS: ["viewc/theme", "view/tabs", "viewc/playlistdetail"],
      HTML: ["music/theme"]
    },
    Writestar: {
      JS: ["viewc/writestar", "model/writestar", "model/musicvideo", "view/video", "viewc/app", "model/app", "model/story", "view/story", "viewc/starsonglist"],
      HTML: ["writestar/writestar", "player/video", "music/mvideo", "story/story", "writestar/hyoryn"]
    },
    AppStar: {
      JS: ["model/song", "model/album", "model/localstorage", "model/playlist", "model/musicvideo", "model/player", "model/cart", "model/app", "view/searchbox", "view/player", "view/song", "view/cart", "view/video", "view/tabs", "view/app", "view/actionbutton", "viewc/app"],
      HTML: ["common/layout", "player/player", "player/video", "common/cart", "common/ticketpop", "event/event", "common/popup", "common/actionbutton", "music/song"]
    }
  }
}(jQuery, window.S = window.S || {}), function(e, t) {
  t.loaderVersion = {
    JS: {
      "model/artist": "20140127",
      "model/genre": "20140127",
      "model/song": "20140127",
      "model/album": "20140127",
      "model/localstorage": "201404091545",
      "model/playlist": "20140127",
      "model/musicvideo": "20140127",
      "model/player": "201404012124",
      "model/cart": "201404012124",
      "model/friend": "20140127",
      "model/event": "20140127",
      "model/nowplaying": "20140127",
      "model/mypage": "20140127",
      "model/profile": "20140127",
      "model/cs": "20140127",
      "model/address": "20140127",
      "model/story": "20140127",
      "model/musicListen": "20140127",
      "model/app": "20140127",
      "model/writestar": "20140130",
      "view/player": "201404091453",
      "view/cart": "201404012124",
      "view/infobox": "20140127",
      "view/relatedgenre": "20140127",
      "view/activebox": "20140127",
      "view/story": "20140311",
      "view/musicListen": "20140127",
      "view/cloudcommon": "20140127",
      "view/video": "2014032515",
      "view/app": "20140127",
      "view/searchbox": "20140127",
      "view/catalog": "20140127",
      "view/pagination": "20140127",
      "view/song": "20140127",
      "view/tabs": "20140127",
      "view/mypage": "20140127",
      "view/playlistlist": "20140127",
      "view/ticket": "20140311",
      "view/actionbutton": "20140127",
      "viewc/chart": "2014032515",
      "viewc/cs": "20140127",
      "viewc/artistdetail": "201402041",
      "viewc/artistmain": "20140127",
      "viewc/albumdetail": "20140211",
      "viewc/newrelease": "20140127",
      "viewc/playlistdetail": "20140127",
      "viewc/playlists": "20140127",
      "viewc/songdetail": "20140127",
      "viewc/cloud": "20140127",
      "viewc/genredetail": "20140127",
      "viewc/profile": "20140127",
      "viewc/nowplaying": "20140127",
      "viewc/genremain": "20140127",
      "viewc/event": "20140127",
      "viewc/friend": "20140127",
      "viewc/buysong": "20140127",
      "viewc/search": "20140203",
      "viewc/recentsong": "20140127",
      "viewc/maincontents": "20140206",
      "viewc/app": "20140310",
      "viewc/ticket": "20140127",
      "viewc/mypage_info": "20140127",
      "viewc/mypage": "20140127",
      "viewc/favorite": "20140127",
      "viewc/today": "20140127",
      "viewc/writestar": "20140130",
      "viewc/theme": "20140127"
    },
    HTML: {
      "common/layout": "20140127",
      "common/cart": "2014022619",
      "common/ticketpop": "20140127",
      "common/popup": "20140127",
      "common/main": "20140127",
      "common/gallerylist": "20140127",
      "common/actionbutton": "20140127",
      "event/event": "20140127",
      "event/cs": "20140127",
      "player/player": "2014032515",
      "player/video": "2014032515",
      "user/mypage": "20140127",
      "user/mypage_info": "20140127",
      "user/ticket": "20140127",
      "story/story": "20140127",
      "friend/friend": "20140127",
      "cloud/profile": "20140127",
      "cloud/nowplaying": "20140127",
      "cloud/buysong": "20140127",
      "cloud/recentsong": "20140127",
      "cloud/playhistorycont": "20140127",
      "cloud/playlistcont": "20140127",
      "cloud/cloudcont": "20140127",
      "music/infobox": "20140127",
      "music/song": "20140127",
      "music/search": "20140127",
      "music/gallerylist": "20140127",
      "music/storecont": "20140127",
      "content/today": "20140127",
      "writestar/writestar": "20140130"
    }
  }
}(jQuery, window.S = window.S || {});
