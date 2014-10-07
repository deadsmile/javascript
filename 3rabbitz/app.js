var Category = Class.create({initialize: function() {
        $$(".category_panel").each(function(a) {
            this.configure(a)
        }.bind(this));
        window.executer.shortcut.bind("return", this.enter.bind(this));
        window.executer.shortcut.bind("escape", this.escape.bind(this))
    },configure: function(a) {
        a.select(".category_tree div").each(function(b) {
            b.insert("<span class='mover'></span><span class='remove'></span>")
        });
        a.on("mousedown", "span.mover", this.start.bind(this));
        a.on("click", "a.add_category", this.addCategory.bind(this));
        a.on("click", "span.remove", this.remove.bind(this));
        a.on("click", "li div", this.edit.bind(this));
        a.on("click", "a.save", this.save.bind(this));
        a.on("click", "a.clear", this.clear.bind(this))
    },enter: function(c, a, b) {
        this.save(b)
    },save: function(c) {
        var b = this.getForm();
        if (b) {
            var d = b.down("input").value;
            var f = b.previous();
            if (f) {
                var e = b.up("li").getAttribute("data-id");
                new Ajax.Request("/r/category/update/" + e, {parameters: {name: d},onSuccess: function(g) {
                        b.fadeOut(function() {
                            f.update(g.responseText + "<span class='mover'></span><span class='remove'></span>");
                            f.show();
                            b.remove()
                        })
                    }.bind(this)})
            } else {
                var a = b.up(".category_tree").getAttribute("data-subject");
                new Ajax.Request("/r/category/create/" + a, {parameters: {name: d},onSuccess: function(g) {
                        b.fadeOut(function() {
                            b.up("li").insert("<div>" + g.responseText + "<span class='mover'></span><span class='remove'></span></div>");
                            b.remove()
                        })
                    }.bind(this)})
            }
        }
        c.stop()
    },escape: function(c, a, b) {
        this.clear(b)
    },clear: function(b) {
        var a = this.getForm();
        if (a) {
            var c = a.previous();
            if (c) {
                c.show();
                a.remove()
            } else {
                a.up("li").remove()
            }
        }
        b.stop()
    },remove: function(b) {
        if (I18n.confirm("label.confirm_remove")) {
            var a = b.findElement("li");
            var c = a.getAttribute("data-id");
            new Ajax.Request("/r/category/remove/" + c, {onSuccess: function(d) {
                    a.fadeOut(function() {
                        a.remove()
                    })
                }})
        }
        b.stop()
    },addCategory: function(b) {
        if (!this.getForm()) {
            var a = b.findElement(".category_panel").down(".category_tree");
            a.insert("<li>" + this.getFormHtml() + "</li>");
            a.down("input").focus()
        }
        b.stop()
    },edit: function(b) {
        if (!b.findElement("span.remove") && !this.getForm()) {
            var c = b.findElement("div");
            c.hide();
            c.insert({after: this.getFormHtml()});
            var a = c.next().down("input");
            a.value = c.innerText;
            a.focus()
        }
        b.stop()
    },getForm: function() {
        return $(document.body).down(".category_form")
    },getFormHtml: function() {
        var a = "<form class='category_form'><div>";
        a += "<input type='text' class='medium' />";
        a += "<a class='clear' href='#'><img src='/resource/image/app/clear.png' title='" + I18n.get("label.close") + "' /></a>";
        a += "<a class='save' href='#'><img src='/resource/image/app/save.png' title='" + I18n.get("label.save") + "' /></a>";
        a += "</div></form>";
        return a
    },start: function(c) {
        if (this.target || this.getForm()) {
            return
        }
        var a = c.findElement("span.mover");
        if (a) {
            var b = a.up("li");
            var d = b.up().cumulativeScrollOffset();
            var e = b.clone(true).clonePosition(b);
            this.target = e;
            this.target.addClassName("transient");
            a.up(".category_tree").insert(e);
            this.actual = b;
            this.actual.addClassName("pick_upped");
            this.x = c.pointerX();
            this.y = c.pointerY();
            this.moveHandler = document.on("mousemove", this.move.bind(this));
            this.upHandler = document.on("mouseup", this.done.bind(this));
            c.stop()
        }
    },move: function(a) {
        var f = a.pointerX();
        var e = a.pointerY();
        var k = this.x - f;
        var j = this.y - e;
        var c = this.target.getLayout();
        this.target.setStyle({left: (c.get("left") - k) + "px",top: (c.get("top") - j) + "px"});
        this.x = f;
        this.y = e;
        if (this.overlapped) {
            this.overlapped.removeAttribute("class");
            delete this.overlapped
        }
        var g = this.getOverlapped();
        if (g) {
            var d = g.getLayout();
            var i = c.get("top") - d.get("top");
            var b = d.get("height");
            if (i < b / 3) {
                g.addClassName("over_top")
            } else {
                if (i < b * 2 / 3) {
                    g.addClassName("over_center")
                } else {
                    g.addClassName("over_bottom")
                }
            }
            this.overlapped = g
        }
    },done: function() {
        var a = this.target.up(".category_panel");
        var d = this.target.getLayout();
        var b = d.get("left");
        var h = d.get("top");
        var e = d.get("height");
        var c;
        if (this.overlapped) {
            this.target.removeAttribute("style");
            this.target.removeClassName("transient");
            if (this.overlapped.hasClassName("over_top")) {
                c = "before";
                this.overlapped.up().insert({before: this.target})
            } else {
                if (this.overlapped.hasClassName("over_bottom")) {
                    c = "after";
                    this.overlapped.up().insert({after: this.target})
                } else {
                    c = "bottom";
                    var g = this.overlapped.next();
                    if (!g) {
                        this.overlapped.insert({after: "<ul></ul>"})
                    }
                    this.overlapped.next().insert({top: this.target})
                }
            }
            this.overlapped.removeAttribute("class");
            new Ajax.Request("/r/category/move/" + c + "/" + this.target.getAttribute("data-id") + "/" + this.overlapped.up("li").getAttribute("data-id"));
            var i = this.actual.getLayout().get("height");
            this.actual.setStyle({overflow: "hidden"});
            new PeriodicalExecuter(function(j) {
                if (i < 3) {
                    this.actual.remove();
                    j.stop()
                } else {
                    i -= 3;
                    this.actual.setStyle({height: i + "px"})
                }
            }.bind(this), 0.05);
            var f = this.target;
            f.setStyle({overflow: "hidden",height: "0px"});
            i = 0;
            new PeriodicalExecuter(function(j) {
                if (i > e - 3) {
                    f.removeAttribute("style");
                    j.stop()
                } else {
                    i += 3;
                    f.setStyle({height: i + "px"})
                }
            }.bind(this), 0.05)
        } else {
            this.actual.removeClassName("picked_upped");
            this.target.remove()
        }
        delete this.target;
        delete this.overlapped;
        this.moveHandler.stop();
        this.upHandler.stop()
    },getOverlapped: function() {
        var a = this.target.up(".category_tree");
        var b = this.target.getLayout();
        var d = b.get("left");
        var c = b.get("top");
        return a.select("div").find(function(j) {
            if (!j.up().hasClassName("pick_upped")) {
                b = j.getLayout();
                var f = b.get("left");
                var g = b.get("top");
                var e = b.get("width");
                var i = b.get("height");
                if (f < d && f + e > d && g < c && g + i > c) {
                    return j
                }
            }
        })
    }});
var Clipboard = Class.create({initialize: function(b, a, c) {
        this.target = $(b);
        this.startHandler = a;
        this.stopHandler = c
    },setType: function(a) {
        this.type = a
    },supported: function() {
        return !Prototype.Browser.IE && window.FileReader
    },start: function() {
        if (!this.supported()) {
            return
        }
        document.onpaste = function(f) {
            var c = f.clipboardData.items;
            var e;
            for (var d = 0; d < c.length; d++) {
                if (c[d].type === "image/png") {
                    e = c[d]
                }
            }
            if (e) {
                Progress.start(this.target);
                var b = e.getAsFile();
                var a = new FileReader();
                a.onload = this.load.bind(this);
                a.readAsDataURL(b)
            }
        }.bind(this)
    },load: function(a) {
        new Ajax.Request("/r/clipboard", {parameters: {t: a.target.result,type: this.type || ""},onComplete: function(b) {
                this.startHandler && this.startHandler(b.headerJSON.id);
                Progress.stop()
            }.bind(this)})
    },stop: function() {
        this.stopHandler && this.stopHandler();
        if (document.onpaste) {
            delete document.onpaste
        }
    }});
var Drag = Class.create({initialize: function(a, b) {
        this.element = $(a);
        this.handler = b;
        this.viewportHeight = document.viewport.getHeight()
    },maintainPosition: function() {
        this.maintainPositionStyle = true
    },configure: function(a) {
        if (this.handler.get) {
            this.element = this.handler.get(this.element)
        }
        this.element.setStyle({position: "absolute",width: this.element.getLayout().get("width") + "px"});
        this.documentHeight = $(document.body).getHeight() - document.viewport.getHeight() + 200;
        document.body.style.cursor = "move";
        this.moveHandler = document.on("mousemove", this.move.bind(this));
        this.upHandler = document.on("mouseup", this.done.bind(this));
        a.stop();
        this.running = true
    },move: function(a) {
        this.moveCount = this.moveCount || 0;
        this.moveCount += 1;
        if (this.moveCount > 2) {
            this.moved = true
        }
        var c = this.element.viewportOffset().top;
        if (c < 50) {
            var b = document.viewport.getScrollOffsets().top;
            window.scrollTo(0, b - 60);
            c = a.pointerY() - 50
        } else {
            if (c > this.viewportHeight && this.element.getStyle("top")) {
                var b = Math.min(this.documentHeight, document.viewport.getScrollOffsets().top + 60);
                window.scrollTo(0, b);
                c = a.pointerY() + 70
            } else {
                c = a.pointerY() + 10
            }
        }
        this.element.style.left = a.pointerX() + "px";
        this.element.style.top = c + "px";
        a.stop()
    },done: function(a) {
        this.handler.done(this.element);
        this.close();
        a.stop()
    },cancel: function(a) {
        this.close();
        this.element.writeAttribute("style", "");
        this.element.removeAttribute("style");
        if (a) {
            a(this.element)
        }
    },close: function() {
        delete this.running;
        delete this.moved;
        delete this.moveCount;
        document.body.style.cursor = "auto";
        if (!this.maintainPositionStyle) {
            this.element.writeAttribute("style", "");
            this.element.removeAttribute("style")
        }
        this.moveHandler.stop();
        this.upHandler.stop()
    }});
var Executer = Class.create({initialize: function(a) {
        this.menuManager = a;
        this.shortcut = new Shortcut(document)
    },start: function() {
        new PeriodicalExecuter(this.check.bind(this), 0.3)
    },check: function(a) {
        if (!document.location.hash) {
            return
        }
        var b = document.location.hash.replace("#", "");
        if (b === this.hash) {
            return
        }
        if (b.startsWith("/r/my_profile")) {
            $("layout_first_menus").select(".selected").each(function(c) {
                c.removeClassName("selected")
            });
            $("layout_second_menus").update();
            $("layout_second_menus").addClassName("empty")
        }
        this.shortcut.clear();
        this.hash = b;
        if (b === "/r/font/list") {
            Progress.showLoadingMessage()
        }
        $("layout_inner_main").setAttribute("class", this.getKlass(b));
        new Ajax.Updater($("layout_inner_main"), b, {method: "GET"})
    },update: function(a) {
        $("layout_inner_main").update(a)
    },getKlass: function(b) {
        if (!b) {
            return ""
        }
        var a = "inner_main";
        b.split("/").each(function(d, c) {
            if (c < 2 || c > 3) {
                return
            }
            a += "_" + d
        });
        return a
    },execute: function(a) {
        if (this.hash === a) {
            this.hash = ""
        }
        window.location.href = "#" + a
    },bind: function(a, b) {
        this.shortcut.bind(a, b)
    }});
var Favorite = Class.create({initialize: function() {
        $A(arguments).each(function(a) {
            $(a) && $(a).on("click", "span.starred, span.not_starred", this.click.bind(this))
        }.bind(this))
    },click: function(b) {
        var a = b.findElement();
        if (a.hasClassName("starred")) {
            this.unstar(a)
        } else {
            this.star(a)
        }
        b.stop()
    },star: function(a) {
        a.removeClassName("not_starred");
        a.addClassName("starred");
        a.writeAttribute("title", I18n.get("label.starred"));
        new Ajax.Request("/r/favorite/star/" + a.getAttribute("data-type") + "/" + a.getAttribute("data-subject"))
    },unstar: function(a) {
        a.addClassName("not_starred");
        a.removeClassName("starred");
        a.writeAttribute("title", I18n.get("label.not_starred"));
        new Ajax.Request("/r/favorite/unstar/" + a.getAttribute("data-type") + "/" + a.getAttribute("data-subject"))
    }});
var FileLink = Class.create({initialize: function(a) {
        this.form = $(a);
        this.file = this.form.down();
        this.form.on("mousemove", this.maintainCursor.bind(this))
    },maintainCursor: function(d) {
        var e = this.form.cumulativeOffset();
        var c = this.form.getWidth();
        var b = this.form.getHeight();
        var a = d.pointerX() - e.left;
        var f = d.pointerY() - e.top;
        if (a < 0 || a > c || f < 0 || f > b) {
            this.file.hide()
        } else {
            this.file.show();
            this.file.setStyle({left: (-120 + a) + "px",top: (f - 10) + "px"})
        }
    }});
var FormUI = Class.create({initialize: function(b, a) {
        this.form = $(b);
        this.validators = $A();
        this.validatorUI = new ValidatorUI();
        this.parameterBuilder = a
    },validateBeforeAction: function() {
        var a = true;
        this.validators.each(function(b) {
            if (this.validate(b)) {
                a = false
            }
        }.bind(this));
        return a
    },submit: function(c, a, b) {
        if (this.validateBeforeAction()) {
            Progress.start(this.form);
            this.disableButtons();
            new Ajax.Request(c, {parameters: this.getParameters(),onComplete: function(d) {
                    Progress.stop();
                    var f = d.getHeader("send_to");
                    if (f) {
                        window.location.href = "/!#" + d.getHeader("send_to");
                        var e = d.getHeader("reload");
                        if (e) {
                            window.location.reload()
                        }
                    } else {
                        (a || $("layout_inner_main")).update(d.responseText);
                        if (b) {
                            b()
                        }
                    }
                }})
        }
    },request: function(a, c) {
        var b = true;
        this.validators.each(function(d) {
            if (this.validate(d)) {
                b = false
            }
        }.bind(this));
        if (b) {
            new Ajax.Request(a, {parameters: this.getParameters(),onComplete: function(d) {
                    c && c()
                }})
        }
        return b
    },send: function(a) {
        var b = true;
        this.validators.each(function(c) {
            if (this.validate(c)) {
                b = false
            }
        }.bind(this));
        if (b) {
            this.disableButtons();
            this.form.action = a;
            this.form.submit()
        }
    },disableButtons: function() {
        if (this.form) {
            this.form.select("button").each(function(a) {
                a.disabled = true
            })
        }
    },enableButtons: function() {
        if (this.form) {
            this.form.select("button").each(function(a) {
                a.disabled = false
            })
        }
    },getParameters: function() {
        if (this.parameterBuilder) {
            return this.parameterBuilder(this.form)
        }
        return this.form ? this.form.serialize() : {}
    },addValidatorSeperately: function(b) {
        var a = $(b.element);
        if (!a) {
            return this
        }
        a.on("change", function() {
            this.validatorUI.removeInvalidMessage(a);
            this.validate(b)
        }.bind(this));
        a.on("focus", function() {
            this.validatorUI.removeInvalidMessage(a)
        }.bind(this));
        return this
    },addValidator: function(b) {
        var a = $(b.element);
        if (!a) {
            return this
        }
        if (Object.isUndefined(b.ajax)) {
            this.validators.push(b)
        }
        a.on("change", function() {
            this.validate(b)
        }.bind(this));
        a.on("focus", function() {
            this.validatorUI.removeInvalidMessage(a)
        }.bind(this));
        return this
    },removeInvalidMessageEvent: function(a) {
        var b = $(a);
        b.on("focus", function() {
            this.validatorUI.removeInvalidMessage(b)
        }.bind(this))
    },addTextValidator: function(a) {
        return this.addValidator(new TextValidator(a.element, a))
    },addPasswordValidator: function(a) {
        return this.addValidator(new PasswordValidator(a.input1, a.input2))
    },validate: function(a) {
        var b = a.validate();
        if (b) {
            this.validatorUI.render(a.element, I18n.get(b))
        }
        return b
    },removeMessage: function(a) {
        this.validatorUI.removeInvalidMessage($(a))
    }});
var Jmx = Class.create({initialize: function(a, b) {
        $("app_header").on("click", "input", this.show.bind(this));
        $("jmx_container").on("click", "a", this.showMBeanDetail.bind(this))
    },show: function(a) {
        if ($("jmx_platform").checked) {
            $("platform_table").show();
            $("tomcat_table").hide()
        } else {
            $("platform_table").hide();
            $("tomcat_table").show()
        }
    },showMBeanDetail: function(a) {
        var c = a.findElement("a");
        var b = $("jmx_platform").checked ? "platform" : "tomcat";
        if (c.next()) {
            c.next().remove()
        } else {
            new Ajax.Updater(c, "/r/jmx/mbean", {insertion: "after",parameters: {server: b,name: c.down().innerHTML}})
        }
        a.stop()
    }});
var Layout = Class.create({load: function() {
        Element.addMethods({clear: function(a) {
                a.update()
            }});
        Ajax.Responders.register({onCreate: function(b, a) {
                if (a.request.container) {
                    a.request.options.evalScripts = true;
                    Progress.start(a.request.container.success)
                }
            },onComplete: function(d, b) {
                if (b.getHeader("Signout") === "true") {
                    $login(b.getHeader("login_path"));
                    return
                }
                if (b.request.container) {
                    Progress.stop();
                    var a = $(b.request.container.success).select("form");
                    if (a.length > 0) {
                        var c = a[0].findFirstElement();
                        if (c && c.type !== "file") {
                            a[0].focusFirstElement()
                        }
                    }
                }
            }});
        window.executer = new Executer(new MenuManager());
        executer.start()
    }});
var LayoutFunction = Class.create({initialize: function(a) {
        this.menuManager = a;
        $("layout_functions").on("click", "span", this.click.bind(this));
        this.notificationPanel = new NotificationLayoutOverlay()
    },setApp: function(a) {
        if (a) {
            a.up("li").hide();
            $("layout_app").innerHTML = a.innerHTML
        }
    },click: function(b) {
        var a = b.findElement();
        var c = a.getAttribute("id");
        if (c === "notification_count") {
            a = a.up();
            c = a.getAttribute("id")
        }
        if (a.hasClassName("selected")) {
            this.hide(b);
            b.stop();
            return
        }
        if (this.opened) {
            this.hide();
            if (this.notificationPanel) {
                this.notificationPanel.removeDetails()
            }
        }
        if (c === "layout_home") {
            this.home(a)
        } else {
            if (c === "layout_notification") {
                this.opened = this.showNotification()
            } else {
                if (c === "layout_favorite") {
                    this.opened = this.showFavorite()
                } else {
                    if (c === "layout_opened") {
                        this.opened = this.showOpened()
                    } else {
                        this.opened = this.showMenu(c + "_menu")
                    }
                }
            }
        }
        if (this.opened) {
            a.addClassName("selected");
            this.hideHandler = document.body.on("click", function(d) {
                if (!d.findElement(".layout_overlay")) {
                    this.hide(d)
                }
            }.bind(this))
        }
        b.stop()
    },home: function(a) {
        if (a.hasClassName("home_enabled")) {
            window.location.href = "/r/app/home"
        } else {
            this.menuManager.clickLogo()
        }
    },showNotification: function() {
        this.notificationPanel.open();
        return this.notificationPanel
    },showFavorite: function() {
        this.favoritePanel = this.favoritePanel || new FavoriteLayoutOverlay();
        this.favoritePanel.open();
        return this.favoritePanel
    },showOpened: function() {
        this.openedPanel = this.openedPanel || new OpenedLayoutOverlay();
        this.openedPanel.open();
        return this.openedPanel
    },showMenu: function(a) {
        this.layoutFunctionMenu = this.layoutFunctionMenu || new LayoutFunctionMenu();
        this.layoutFunctionMenu.open(a);
        return this.layoutFunctionMenu
    },hide: function(a) {
        if (this.opened) {
            this.opened.close()
        }
        $("layout_functions").select("span.selected").each(function(b) {
            b.removeClassName("selected")
        });
        if (this.hideHandler) {
            this.hideHandler.stop();
            delete this.hideHandler
        }
    }});
var LayoutFunctionMenu = Class.create({initialize: function() {
    },open: function(a) {
        var a = $(a);
        if (a.select("li").size() < 2) {
            return
        }
        a.show();
        this.opened = a
    },close: function() {
        this.opened && this.opened.hide()
    }});
var AbstractLayoutOverlay = Class.create({initialize: function(a) {
        if (!this.panel) {
            this.loadPanel(a)
        }
    },loadPanel: function(a) {
        this.panel = new Element("div", {id: a,"class": "layout_overlay",style: "display: none;"});
        this.panel.update('<div></div><span class="arrow"></span');
        $("layout_header").insert(this.panel);
        if (this.configureEvent) {
            this.configureEvent(this.panel.down("div"))
        }
    },open: function() {
        this.load(this.panel.down("div"));
        this.panel.show()
    },close: function() {
        this.panel.hide()
    }});
var FavoriteLayoutOverlay = Class.create(AbstractLayoutOverlay, {initialize: function($super) {
        $super("favorite_overlay")
    },configureEvent: function(a) {
        new Favorite("favorite_overlay")
    },load: function(a) {
        new Ajax.Updater(a, "/r/book_favorite/star")
    }});
var NotificationLayoutOverlay = Class.create(AbstractLayoutOverlay, {initialize: function($super) {
        $super("notification_overlay");
        this.controllerUrl = "/r/notification";
        new PeriodicalExecuter(this.checkCount.bind(this), 60)
    },configureEvent: function(a) {
        a.on("click", this.click.bind(this))
    },load: function(a) {
        this.checkCount();
        new Ajax.Updater(a, this.controllerUrl + "/get_panel")
    },checkCount: function() {
        new Ajax.Request(this.controllerUrl + "/get_not_read_count", {onComplete: function(a) {
                var b = a.headerJSON.count;
                this.changeCount(b)
            }.bind(this)})
    },changeCount: function(b) {
        var c = "";
        if (b.length < 3) {
            c = b
        } else {
            c = "99+"
        }
        var a = $("notification_count");
        a.update(c);
        if (b === "0") {
            a.hide()
        } else {
            a.show()
        }
    },click: function(c) {
        var b = c.findElement("a");
        if (b) {
            if (b.hasClassName("mark_all_as_read")) {
                this.markAllAsRead()
            } else {
                if (b.hasClassName("mark_as_read")) {
                    this.markAsRead(b)
                } else {
                    if (b.hasClassName("event_link")) {
                        this.view(b)
                    } else {
                        if (b.hasClassName("view_details")) {
                            this.markAsRead(b);
                            this.viewDetails(b)
                        } else {
                            if (b.hasClassName("back")) {
                                this.toList()
                            } else {
                                var a = b.readAttribute("href");
                                if (a && a.startsWith("http")) {
                                    window.open(a)
                                }
                            }
                        }
                    }
                }
            }
        } else {
            var d = c.findElement("li");
            if (d) {
                var b = d.down();
                this.view(b)
            }
        }
        c.stop()
    },view: function(b) {
        this.markAsRead(b);
        var a = b.readAttribute("href");
        if (a.startsWith("/!#")) {
            executer.execute(a.replace("/!#", ""))
        } else {
            window.open(a)
        }
    },markAllAsRead: function() {
        new Ajax.Request(this.controllerUrl + "/mark_all_as_read", {onComplete: function(a) {
                this.changeCount("0");
                this.panel.select(".is_not_read").each(function(b) {
                    this.removeReadClassName(b)
                }.bind(this))
            }.bind(this)})
    },markAsRead: function(a) {
        var b = a.up("li");
        var c = b.readAttribute("id");
        new Ajax.Request(this.controllerUrl + "/mark_as_read/" + c, {onComplete: function(d) {
                if (b.hasClassName("is_not_read")) {
                    this.removeReadClassName(b);
                    this.decreaseCount()
                }
            }.bind(this)})
    },removeReadClassName: function(a) {
        a.removeClassName("is_not_read")
    },decreaseCount: function() {
        var a = Number($("notification_count").innerHTML) - 1;
        this.changeCount(a.toString())
    },viewDetails: function(a) {
        if (!this.detailsContentPanel) {
            this.makeDetailsPanel()
        }
        this.hideList();
        var b = a.up("li").select(".notification_details")[0];
        this.updateDetailsPanel(b.innerHTML);
        this.panel.insert(this.detailsPanel)
    },makeDetailsPanel: function() {
        this.detailsPanel = new Element("div", {id: "detailPanel"});
        var b = new Element("div", {"class": "tools"});
        var c = new Element("span");
        c.update(I18n.get("label.details"));
        b.insert(c);
        var a = new Element("a", {"class": "back link",href: "#"});
        a.update(I18n.get("label.back"));
        b.insert(a);
        this.detailsPanel.insert(b);
        this.detailsContentPanel = new Element("div", {"class": "details_content"});
        this.detailsPanel.insert(this.detailsContentPanel);
        this.detailsPanel.on("click", "a", this.click.bind(this))
    },updateDetailsPanel: function(a) {
        var b = this.detailsPanel.select(".details_content")[0];
        b.update(a)
    },toList: function() {
        this.removeDetails();
        this.showList()
    },removeDetails: function() {
        var a = $("detailPanel");
        if (a) {
            a.remove()
        }
    },showList: function() {
        var a = this.getList();
        a.show()
    },hideList: function() {
        var a = this.getList();
        a.hide()
    },getList: function() {
        return this.panel.down("ul")
    }});
var OpenedLayoutOverlay = Class.create(AbstractLayoutOverlay, {initialize: function($super) {
        $super("opened_overlay")
    },load: function(a) {
        new Ajax.Updater(a, "/r/book_favorite/opened")
    }});
var List = Class.create();
List.prototype = {initialize: function(a) {
        this.target = $(a)
    },add: function(b, a) {
        this.target.options[this.size()] = new Option(b, a)
    },remove: function() {
        for (var a = this.size(); a > 0; a--) {
            this.target.remove(a - 1)
        }
    },select: function() {
        var b = this.size();
        if (arguments.length == 0) {
            for (var a = 0; a < b; a++) {
                this.target.options[a].selected = true
            }
        } else {
            $A(arguments).each(function(d, c) {
                this.target.options[d].selected = true
            }, this)
        }
    },deselect: function() {
        var b = this.size();
        for (var a = 0; a < b; a++) {
            this.target.options[a].selected = false
        }
    },up: function() {
        var d = this.target.options;
        var b = this.size();
        for (var a = 0; a < b; a++) {
            if (d[a].selected) {
                if (a == 0) {
                    return false
                }
                var e = d[a - 1].text;
                var c = d[a - 1].value;
                d[a - 1].text = d[a].text;
                d[a - 1].value = d[a].value;
                d[a - 1].selected = true;
                d[a].text = e;
                d[a].value = c;
                d[a].selected = false
            }
        }
    },down: function() {
        var d = this.target.options;
        var b = this.size();
        for (var a = b - 1; a >= 0; a--) {
            if (d[a].selected) {
                if (a == (b - 1)) {
                    return false
                }
                var e = d[a + 1].text;
                var c = d[a + 1].value;
                d[a + 1].text = d[a].text;
                d[a + 1].value = d[a].value;
                d[a + 1].selected = true;
                d[a].text = e;
                d[a].value = c;
                d[a].selected = false
            }
        }
    },size: function() {
        return this.target.options.length
    }};
var ListMenu = Class.create({initialize: function(b, a) {
        var b = $(b);
        b.on("click", "a", this.click.bind(this));
        this.runnable = a;
        this.run(b.down(1))
    },click: function(c) {
        var a = c.findElement();
        if (a.next()) {
            var d = a.next();
            var b = d.getStyle("display");
            if (b == "none" || b == "") {
                d.style.display = "block"
            } else {
                d.style.display = "none"
            }
        } else {
            this.run(a)
        }
        c.stop()
    },run: function(a) {
        if (this.selected) {
            this.selected.removeClassName("selected")
        }
        this.selected = a;
        this.selected.addClassName("selected");
        this.runnable(a)
    },getSelected: function() {
        return this.selected
    }});
var ListSelection = Class.create({initialize: function(b, a) {
        this.name = b;
        this.target = $(b);
        this.target.on("click", "button", this.click.bind(this));
        this.adder = a
    },addItem: function(d, a) {
        var b = new Template('<label><input name="#{name}" value="#{id}" type="checkbox" class="checkbox" />#{label}</label>');
        var c = new Element("li");
        c.update(b.evaluate({id: d,name: this.name,label: a}));
        this.target.select("ul")[0].insert(c)
    },click: function(b) {
        var a = b.findElement();
        if (a) {
            this[a.className]()
        }
        b.stop()
    },up: function() {
        var b = null;
        var a = null;
        this.target.select("input").each(function(c) {
            if (c.checked) {
                a = c.up(1)
            } else {
                if (a && b) {
                    b.remove();
                    a.insert({after: b});
                    a = b = null
                }
                b = c.up(1)
            }
        });
        if (a && b) {
            b.remove();
            a.insert({after: b})
        }
    },down: function() {
        var a = null;
        var b = null;
        this.target.select("input").each(function(c) {
            if (c.checked) {
                b = b || c.up(1)
            } else {
                a = c.up(1);
                if (b) {
                    a.remove();
                    b.insert({before: a});
                    b = a = null
                }
            }
        });
        if (b && a) {
            a.remove();
            b.insert({before: a})
        }
    },add: function() {
        this.adder()
    },remove: function() {
        this.target.select("input").each(function(a) {
            a.checked && a.up(1).remove()
        })
    }});
var ListSorter = Class.create({initialize: function(a, b) {
        this.panel = a;
        this.handler = b;
        this.panel.on("mouseover", this.over.bind(this));
        this.panel.on("mouseleave", this.out.bind(this))
    },over: function(c) {
        var a = c.findElement("li.insertable");
        if (!a) {
            c.stop();
            return
        }
        if (a != this.selected) {
            if (this.selected) {
                this.selected.removeClassName("over")
            }
            this.selected = a;
            if (this.status !== "move") {
                this.selected.addClassName("over");
                var d = this.getMoveHandler();
                var f = a.cumulativeOffset();
                d.setStyle({display: "block",left: f.left + "px",top: f.top + "px"})
            }
        }
        if (this.status === "move") {
            var f = a.cumulativeOffset();
            var e = f.top;
            var g = this.dragged.getLayout().get("top");
            var b = a.getLayout().get("padding-box-height");
            if (g < e + b / 2) {
                this.position = "before"
            } else {
                this.position = "after";
                e = e + b
            }
            this.dropLine.setStyle({display: "block",top: e + "px"})
        }
        c.stop()
    },out: function(a) {
        if (this.selected) {
            this.selected.removeClassName("over");
            delete this.selected;
            this.dropLine && this.dropLine.hide();
            this.moveHandler.hide()
        }
        a.stop()
    },get: function(a) {
        if (!this.dropLine) {
            this.dropLine = new Element("div", {"class": "drop_line"});
            this.dropLine.setStyle({left: this.panel.cumulativeOffset().left + "px",width: this.panel.getWidth() + "px"});
            this.panel.appendChild(this.dropLine)
        }
        this.status = "move";
        this.dropLine.show();
        this.moveHandler.hide();
        this.dragged = this.selected;
        this.dragged.addClassName("dragged");
        this.dragged.removeClassName("insertable");
        return this.dragged
    },done: function(a) {
        this.status = "";
        this.dragged.addClassName("insertable");
        this.dragged.removeClassName("dragged");
        if (this.selected && this.selected !== a) {
            var b = this.selected;
            var d = this.dropLine.getLayout().get("left");
            var c = this.dropLine.getLayout().get("top");
            a.move(d, c, function() {
                var e = {};
                e[this.position] = a;
                b.insert(e);
                this.handler && this.handler(this.panel, a)
            }.bind(this))
        } else {
            a.removeAttribute("style")
        }
        this.dropLine.hide()
    },getMoveHandler: function() {
        if (!this.moveHandler) {
            this.moveHandler = new Element("span", {"class": "drag_handler",title: I18n.get("label.move")});
            this.panel.appendChild(this.moveHandler);
            this.dragHandler = new Drag(null, this);
            this.dragHandler.maintainPosition();
            this.moveHandler.on("mousedown", this.dragHandler.configure.bind(this.dragHandler))
        }
        return this.moveHandler
    }});
var Log = Class.create({initialize: function(a) {
        $("level").value = a;
        $("button_update").on("click", this.changeLevel.bind(this));
        $("level").on("click", this.hideMessage.bind(this));
        $("log_table").on("click", "a", this.tableClicked.bind(this))
    },changeLevel: function(a) {
        new Ajax.Request("/r/log/change_level/" + $F("level"), {onComplete: function() {
                $("update_result").show()
            }});
        a.stop()
    },hideMessage: function(a) {
        $("update_result").hide();
        a.stop()
    },tableClicked: function(c) {
        var b = c.findElement();
        var d = b.up("tr");
        var a = d.getAttribute("id");
        if (b.hasClassName("download")) {
            window.location.href = "/r/log/download/" + a
        } else {
            if (b.hasClassName("remove")) {
                if ($confirmRemove(d)) {
                    new Ajax.Request("/r/log/remove/" + a, {onSuccess: function() {
                            d.remove()
                        }})
                }
            }
        }
        c.stop()
    }});
var menuTemplate = new Template("<li><a id='menu_#{id}' href='/!##{path}'>#{name}</a>");
var MenuManager = Class.create({initialize: function() {
        var a = new LayoutFunction(this);
        this.menus = $H();
        var b = this.getHash();
        var c = this.getMenuId(b);
        new Ajax.Request("/r/menu/get/" + c, {onComplete: function(d) {
                this.root = d.responseJSON;
                this.root.level = 0;
                a.setApp($("app_" + this.root.id));
                var h = this.root.children.length;
                for (var g = 0; g < h; g++) {
                    var m = this.root.children[g];
                    this.set(m, this.root);
                    var f = m.children.length;
                    for (var e = 0; e < f; e++) {
                        this.set(m.children[e], m)
                    }
                }
                var l = this.get(c);
                if (!l) {
                    var k = d.headerJSON.menuId;
                    if (k) {
                        l = this.get(k);
                        window.localStorage.setItem("menu_id", k)
                    } else {
                        l = this.get(this.root.children[0].id)
                    }
                    if (!b || ("#" + l.path) !== b) {
                        window.location.href = "/!#" + l.path
                    }
                }
                if (l.level === 1) {
                    this.displayFirstMenus(l)
                } else {
                    if (l.level === 2) {
                        this.displayFirstMenus(l.parent, l)
                    }
                }
            }.bind(this)});
        $("layout_first_menus").on("click", "a", this.clickMenu.bind(this));
        $("layout_second_menus").on("click", "a", this.clickMenu.bind(this));
        $("header_logo").on("click", this.clickLogo.bind(this))
    },getHash: function() {
        var a = window.location.hash;
        if (a === "") {
            var b = window.localStorage.getItem("path_hash");
            if (b) {
                window.localStorage.removeItem("path_hash");
                window.location.href = "/!" + b
            } else {
                window.location.href = $("app_drive") ? "/!#/r/drive" : "/!#/r/book/list";
                window.localStorage.removeItem("menu_id")
            }
            this.resetFavicon()
        }
        return a
    },resetFavicon: function() {
        if (Prototype.Browser.Gecko) {
            var a = $("favicon");
            a.insert({after: a.clone()});
            a.remove()
        }
    },getMenuId: function(c) {
        var a;
        if (c === "#/r/user/list") {
            a = "user"
        } else {
            if (c === "#/r/book/list") {
                a = "book_dashboard"
            } else {
                if (c === "#/r/theme/list") {
                    a = "book_theme"
                } else {
                    if (c === "#/r/drive") {
                        a = "drive"
                    }
                }
            }
        }
        if (a) {
            try {
                window.localStorage.setItem("menu_id", a)
            } catch (b) {
            }
            return a
        } else {
            return window.localStorage.getItem("menu_id") || "book_dashboard"
        }
    },get: function(a) {
        return this.menus.get(a)
    },set: function(b, a) {
        b.level = a.level + 1;
        b.parent = a;
        this.menus.set(b.id, b)
    },clickLogo: function(b) {
        var a = $("layout_first_menus").select("a")[0];
        this.move(a.getAttribute("id").gsub("menu_", ""));
        b && b.stop()
    },move: function(d) {
        var c = this.get(d);
        if (c.level === 2) {
            var a = c;
            c = c.parent
        }
        this.displayFirstMenus(c, a);
        window.localStorage.setItem("menu_id", d);
        var b = a ? a.path : c.path;
        executer.execute(b)
    },clickMenu: function(b) {
        var a = b.findElement();
        a.up("ul").select(".selected").each(function(e) {
            e.removeClassName("selected")
        });
        a.addClassName("selected");
        var d = a.getAttribute("id").substring(5);
        var c = this.get(d);
        if (!c) {
            return
        }
        window.localStorage.setItem("menu_id", d);
        if (c.level === 1) {
            this.displaySecondMenus(c)
        }
    },displayFirstMenus: function(b, a) {
        $("layout_first_menus").update(this.getHtml(this.root));
        $("menu_" + b.id).addClassName("selected");
        this.displaySecondMenus(b, a)
    },displaySecondMenus: function(b, c) {
        var d = b.children;
        if (d.length == 0) {
            $("layout_second_menus").addClassName("empty")
        } else {
            $("layout_second_menus").removeClassName("empty");
            $("layout_second_menus").show().update(this.getHtml(b));
            var a = $("menu_" + b.id).getLayout().get("left");
            $("layout_second_menus").down("ul").setStyle({paddingLeft: this.getSecondMenusPadding(b) + "px"});
            if (c) {
                $("menu_" + c.id).addClassName("selected")
            } else {
                $("menu_" + d.first().id).addClassName("selected")
            }
        }
    },getSecondMenusPadding: function(b) {
        var d = $("menu_" + b.id);
        var a = $("layout_first_menus").getLayout().get("left") + d.getLayout().get("left") + d.getWidth() / 2;
        var c = 0;
        $("layout_second_menus").select("li").each(function(e) {
            c += e.getWidth()
        });
        return Math.max(10, a - c / 2)
    },getHtml: function(b) {
        var a = "<ul>";
        b.children.each(function(c) {
            a += menuTemplate.evaluate(c)
        });
        a += "</ul>";
        return a
    }});
var MyProfile = Class.create({initialize: function(a) {
        if (a === "password") {
            $("button_update_password").on("click", this.changePassword.bind(this));
            this.passwordForm = new FormUI("password_form").addTextValidator({element: "current_password",required: true}).addTextValidator({element: "new_password",required: true}).addPasswordValidator({input1: "new_password",input2: "retype_new_password"})
        } else {
            $("button_update_my_profile").on("click", this.changeProfile.bind(this));
            this.userForm = new FormUI("user_form").addTextValidator({element: "user_name",required: true,max: 100}).addValidator(new EmailValidator("user_email", {required: true}))
        }
    },changeProfile: function(a) {
        this.userForm.send("/r/my_profile/update");
        a.stop()
    },changePassword: function(a) {
        this.passwordForm.submit("/r/my_profile/update_password");
        a.stop()
    }});
var Picker = Class.create({initialize: function(b, a, c) {
        this.element = b;
        this.units = a;
        this.type = c;
        this.input = b.select("input")[0];
        this.panel = $("picker_panel");
        if (!this.panel) {
            this.panel = new Element("div", {id: "picker_panel",style: "display: none"});
            document.body.appendChild(this.panel)
        }
        this.unit = a.base;
        var d = this.input.value;
        if (d) {
            if (d.endsWith("em")) {
                this.unit = "em"
            } else {
                if (d.endsWith("px")) {
                    this.unit = "px"
                } else {
                    if (d.endsWith("pt")) {
                        this.unit = "pt"
                    }
                }
            }
        }
    },bind: function() {
        this.element.on("mouseover", "img", this.over.bind(this));
        this.element.on("mouseout", "img", this.out.bind(this));
        this.element.on("click", "img", this.show.bind(this));
        this.element.down().on("focus", this.focus.bind(this));
        this.element.down().on("blur", this.blur.bind(this))
    },over: function(b) {
        var a = b.findElement();
        if (!a.src.include("_on.png")) {
            a.src = a.src.replace(".png", "_on.png")
        }
        b.stop()
    },out: function(b) {
        var a = b.findElement();
        if (a.src.include("_on.png")) {
            a.src = a.src.replace("_on.png", ".png")
        }
        b.stop()
    },focus: function(a) {
        this.element.addClassName("focused");
        a.stop()
    },blur: function(a) {
        this.element.removeClassName("focused");
        a.stop()
    },show: function(a) {
        if (this.panel.visible()) {
            this.panel.hide();
            a.stop();
            return
        }
        this.panel.setAttribute("class", this.type);
        this.updateList();
        var b = this.getPosition(this.element);
        this.panel.setStyle({top: b.top + "px",left: b.left + "px"});
        this.panel.show();
        this.handler = $(document).on("click", this.select.bind(this));
        a.stop()
    },updateList: function() {
        var a = "<ul>";
        var b = this.units[this.unit];
        if (!b) {
            this.unit = this.units.base;
            b = this.units[this.unit]
        }
        b.each(function(c) {
            a += "<li>" + c
        });
        a += "</ul>";
        a += "<div>";
        if (this.units.em) {
            a += "<label><input type='radio' name='unit' value='em' />em</label>"
        }
        if (this.units.px) {
            a += "<label><input type='radio' name='unit' value='px' />px</label>"
        }
        if (this.units.pt) {
            a += "<label><input type='radio' name='unit' value='pt' />pt</label>"
        }
        if (this.units.percent) {
            a += "<label><input type='radio' name='unit' value='percent' />%</label>"
        }
        if (this.units.keyword) {
            a += "<label><input type='radio' name='unit' value='keyword' />keyword</label>"
        }
        if (this.units.number) {
            a += "<label><input type='radio' name='unit' value='number' />number</label>"
        }
        a += "</div>";
        this.panel.update(a);
        this.panel.select("input[value='" + this.unit + "']")[0].checked = true
    },select: function(c) {
        var b = c.findElement("#picker_panel label");
        if (b) {
            var a = b.select("input")[0].value;
            if (this.unit != a) {
                this.unit = a;
                this.updateList()
            }
            return
        }
        b = c.findElement("#picker_panel li");
        if (b) {
            var a = this.unit;
            if (a === "keyword" || a === "number") {
                a = ""
            }
            this.input.value = b.innerHTML + (a === "percent" ? "%" : a);
            this.input.focus()
        }
        this.panel.hide();
        this.handler.stop();
        c.stop()
    },getPosition: function(a) {
        var b = a.cumulativeOffset();
        b.top += a.getLayout().get("margin-box-height");
        return b
    }});
Picker.bind = function(d, g, e) {
    if (d.getAttribute("binded") != "true") {
        d.setAttribute("binded", "true");
        var b = {};
        if (e === "font") {
            b.em = [1, 1.2, 1.5, 1.7, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10];
            if (Picker.pdf) {
                b.pt = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]
            } else {
                b.px = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]
            }
            b.base = Picker.pdf ? "pt" : "px"
        } else {
            if (e === "box") {
                b.em = [0, 1, 1.2, 1.5, 1.7, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10];
                if (Picker.pdf) {
                    b.pt = [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90]
                } else {
                    b.px = [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90]
                }
                b.base = Picker.pdf ? "pt" : "px"
            } else {
                if (e === "line") {
                    if (Picker.pdf) {
                        b.pt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20]
                    } else {
                        b.px = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20]
                    }
                    b.base = Picker.pdf ? "pt" : "px"
                } else {
                    if (e === "percent") {
                        b.percent = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
                        b.base = "percent"
                    } else {
                        if (e === "position_x") {
                            if (Picker.pdf) {
                                b.pt = [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90]
                            } else {
                                b.px = [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90]
                            }
                            b.keyword = ["left", "center", "right"];
                            b.base = Picker.pdf ? "pt" : "px"
                        } else {
                            if (e === "position_y") {
                                if (Picker.pdf) {
                                    b.pt = [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90]
                                } else {
                                    b.px = [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90]
                                }
                                b.keyword = ["top", "center", "bottom"];
                                b.base = Picker.pdf ? "pt" : "px"
                            } else {
                                if (e === "font_family") {
                                    var f = ["굴림, Gulim, sans-serif", "돋움, Dotum, sans-serif", "궁서, Gungsuh, serif", "바탕, Batang, serif", "'맑은 고딕', 'Malgun Gothic', 굴림, Gulim, sans-serif", "'맑은 고딕', 'Malgun Gothic', 돋움, Dotum, sans-serif"];
                                    var a = ["Arial, sans-serif", "Arial, Helvetica, sans-serif", "Verdana, Arial, Helvetica, sans-serif", "'Lucida Grande', Arial, Verdana, sans-serif", "'Lucida Grande', Tahoma, Verdana, Arial, sans-serif", "Georgia, 'Times New Roman', Times, serif"];
                                    b.keyword = [];
                                    if (I18n.isKorean()) {
                                        b.keyword = b.keyword.concat(f)
                                    }
                                    b.keyword = b.keyword.concat(a);
                                    b.base = "keyword"
                                } else {
                                    if (e === "font_monospace_family") {
                                        b.keyword = ["Consolas, 'Bitstream Vera Sans Mono', 'Courier New', Courier, monospace"];
                                        b.base = "keyword"
                                    } else {
                                        if (e === "number") {
                                            b.number = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
                                            b.base = "number"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var c = new Picker(d, b, e);
        c.bind()
    }
};
var ServerProperties = Class.create({initialize: function(a, b) {
        $("app_header").on("click", "input", this.show.bind(this))
    },show: function(a) {
        $("properties_container").select("table").each(function(b) {
            b.hide()
        });
        $("app_header").select("input").each(function(b) {
            if (b.checked) {
                $(b.getAttribute("id") + "_table").show()
            }
        })
    }});
var TableUI = Class.create({initialize: function(a, b) {
        this.target = $(a);
        this.target.on("mouseover", this.over.bind(this));
        this.target.on("mouseleave", this.leave.bind(this));
        this.handlers = b;
        if (b && b.click) {
            this.target.on("click", "table a", b.click.bind(this))
        }
        if (b && b.url) {
            this.target.on("click", "thead th", this.sort.bind(this));
            this.url = b.url
        }
        if (this.target.select("span.previous_page").size() > 0) {
            this.target.on("click", "div.page_panel span", this.page.bind(this))
        }
    },over: function(b) {
        var a = b.findElement("thead th");
        if (a) {
            if (this.overed) {
                this.overed.removeClassName("over")
            }
            this.overed = a;
            this.overed.addClassName("over")
        } else {
            var c = b.findElement("tbody tr");
            if (c) {
                if (this.overed) {
                    this.overed.removeClassName("over")
                }
                this.overed = c;
                this.overed.addClassName("over")
            }
        }
        b.stop()
    },leave: function(a) {
        if (this.overed) {
            this.overed.removeClassName("over")
        }
        a.stop()
    },sort: function(b) {
        var a = b.findElement("thead th");
        if (a && a.getAttribute("data-headers")) {
            if (a.down().hasClassName("asc")) {
                this.sortMode = "desc"
            } else {
                this.sortMode = "asc"
            }
            new Ajax.Updater(this.target, this.url, {parameters: {sort_column: a.getAttribute("data-headers"),sort_mode: this.sortMode}})
        }
        b.stop()
    },page: function(c) {
        var b = c.findElement("span");
        if (b.hasClassName("disabled")) {
            c.stop();
            return
        }
        var a = Number(b.up().getAttribute("data-page"));
        if (b.hasClassName("next_page")) {
            a++
        } else {
            a--
        }
        var d = this.handlers.getPath(a, false);
        new Ajax.Updater(this.target, d);
        c.stop()
    },getPosition: function(a) {
        var b = a.cumulativeOffset();
        b.left += a.getWidth() / 2;
        return b
    }});
var Tab = Class.create({initialize: function(b, a) {
        this.target = $(b);
        this.selectMenu($(a));
        (this.target.down(".menu") || this.target.down(".tabs")).on("click", "li", this.select.bind(this))
    },select: function(a) {
        this.selectMenu(a.findElement())
    },selectMenu: function(b) {
        if (this.current) {
            this.current.removeClassName("selected");
            var a = this.getPanel();
            a.removeClassName("selected");
            a.hide()
        }
        this.current = b;
        this.current.addClassName("selected");
        var a = this.getPanel();
        a.addClassName("selected");
        a.show()
    },getCurrent: function() {
        return this.current
    },getPanel: function() {
        return $(this.current.getAttribute("id") + "_panel")
    },hide: function(a) {
        a = a || "";
        this.target.select("ul.menu li").each(function(b) {
            if (a.include(b.getAttribute("id"))) {
                b.hide()
            } else {
                b.show()
            }
        })
    },addTab: function() {
        this.current.insert({after: "<li class='selected'>Unnamed"})
    }});
var TextArea = Class.create({initialize: function(a) {
        this.target = $(a)
    },get: function() {
        var a;
        if (Prototype.Browser.IE) {
            a = document.selection.createRange().text
        } else {
            a = this.target.value.substr(this.target.selectionStart, (this.target.selectionEnd - this.target.selectionStart))
        }
        return a == "" ? this.target.value : a
    }});
var ToggleElement = {};
ToggleElement.toggle = function(a, b) {
    b = $(b);
    if (b.visible()) {
        b.hide();
        a.src = a.src.replace("hide", "open")
    } else {
        b.show();
        a.src = a.src.replace("open", "hide")
    }
};
var AppTooltip = Class.create({show: function(c, a) {
        this.base = c;
        this.label = a || "label.open";
        this.tooltip = this.tooptip || this.createTooltip();
        this.tooltip.down(1).update(c.getAttribute("href"));
        this.openLink.show();
        this.tooltip.setStyle({visibility: "hidden"});
        this.tooltip.show();
        var f = c.cumulativeOffset();
        var b = this.tooltip.getLayout();
        var e = f.top - b.get("margin-box-height") - 10;
        var d = Math.max(10, f.left - b.get("margin-box-width") / 2);
        this.tooltip.setStyle({left: d + "px",top: e + "px",visibility: "visible"});
        this.clickHandler = this.clickHandler || document.on("click", this.clickTooltip.bind(this));
        this.clickHandler.start()
    },createTooltip: function() {
        var a = new Element("div", {"class": "tooltip"});
        a.update("<div><span></span><a href='#' class='open'>" + I18n.get(this.label) + "</a></div><div class='close'></div><div class='arrow'></div>");
        a.hide();
        document.body.appendChild(a);
        this.openLink = a.select("a.open")[0];
        return a
    },clickTooltip: function(c) {
        var b = c.findElement(".tooltip");
        if (!b) {
            this.hide()
        } else {
            b = c.findElement();
            if (b.hasClassName("open")) {
                var a = this.tooltip.down(1).innerHTML;
                a = a.unescapeHTML();
                window.open(a);
                this.hide()
            } else {
                if (b.hasClassName("close")) {
                    this.hide()
                } else {
                    if (b.tagName === "A") {
                        var a = b.href;
                        window.open(a);
                        this.hide()
                    }
                }
            }
        }
        c.stop()
    },hide: function() {
        if (this.tooltip.visible()) {
            this.clickHandler.stop();
            this.tooltip.hide()
        }
    }});
var Tree = Class.create({initialize: function(a) {
        this.panel = $(a);
        this.panel.on("click", "li", this.toggle.bind(this))
    },setLazyLoader: function(a) {
        this.lazyLoader = a
    },toggle: function(b) {
        if (b.findElement("label")) {
            return
        }
        var a = b.findElement();
        if (a.tagName === "LI") {
            if (a.hasClassName("closed")) {
                if (this.lazyLoader && a.hasClassName("lazy_load")) {
                    this.lazyLoader(a, this)
                } else {
                    a.removeClassName("closed").addClassName("opened")
                }
            } else {
                if (a.hasClassName("opened")) {
                    a.removeClassName("opened").addClassName("closed")
                } else {
                    if (a.hasClassName("last_closed")) {
                        if (this.lazyLoader && a.hasClassName("lazy_load")) {
                            this.lazyLoader(a, this)
                        } else {
                            a.removeClassName("last_closed").addClassName("last_opened")
                        }
                    } else {
                        if (a.hasClassName("last_opened")) {
                            a.removeClassName("last_opened").addClassName("last_closed")
                        }
                    }
                }
            }
        }
        b.stop()
    },loadChildren: function(a, b) {
        a.down("ul").remove();
        new Ajax.Updater(a, b, {insertion: "bottom",onComplete: function(c) {
                if (c.headerJSON && c.headerJSON.leaf_node) {
                    a.removeClassName("lazy_load").removeClassName("closed").removeClassName("last_closed");
                    if (a.next()) {
                        a.addClassName("leaf")
                    } else {
                        a.addClassName("last_leaf")
                    }
                } else {
                    if (a.hasClassName("closed")) {
                        a.removeClassName("lazy_load").removeClassName("closed").addClassName("opened")
                    } else {
                        a.removeClassName("lazy_load").removeClassName("last_closed").addClassName("last_opened")
                    }
                }
            }})
    }});
var SoftwareUpdater = Class.create({initialize: function() {
        this.updatePanel = $("update_panel");
        this.updatePanel.on("click", "a.update_check", this.check.bind(this));
        this.updatePanel.on("click", "a.download_update", this.download.bind(this));
        this.updatePanel.on("click", "a.cancel", this.cancel.bind(this));
        $("software_file").on("change", this.uploadFile.bind(this))
    },check: function(a) {
        new Ajax.Updater(this.updatePanel, "/r/software_update/check", {onComplete: function(b) {
                if (b.headerJSON && b.headerJSON.code === "disconnected") {
                    $("software_upload_form").show()
                }
            }});
        a.stop()
    },download: function(b) {
        var a = 0;
        new Ajax.Request("/r/software_update/download/" + b.findElement().getAttribute("id"));
        new ProgressBar(this.updatePanel).start({run: function() {
                new Ajax.Request("/r/software_update/monitor/", {onComplete: function(c) {
                        var d = c.headerJSON;
                        a = d.rate
                    }});
                return {rate: a}
            },done: function() {
                new Ajax.Updater("layout_inner_main", "/r/software_update")
            }});
        b.stop()
    },cancel: function(a) {
        if (confirm(I18n.get("label.confirm_cancel"))) {
            new Ajax.Updater("layout_inner_main", "/r/software_update/cancel")
        }
        a.stop()
    },uploadFile: function(a) {
        if (!this.uploader) {
            this.uploader = new SoftwareUpdateUploader()
        }
        this.uploader.upload();
        a.stop()
    }});
var SoftwareUpdateUploader = Class.create({initialize: function() {
        this.uploader = new Uploader("software_update_upload", $("software_upload_form"), this.updateCompleted.bind(this))
    },upload: function() {
        this.uploader.upload()
    },updateCompleted: function() {
        new Ajax.Updater("layout_inner_main", "/r/software_update")
    }});
var Uploader = Class.create({initialize: function(d, b, c, a) {
        this.id = d;
        this.form = b;
        this.onComplete = c;
        this.disableProgressbar = a
    },setType: function(a) {
        this.type = a
    },getUuid: function() {
        return this.uuid
    },upload: function() {
        this.disableButtons();
        new Ajax.Request("/r/uuid", {onComplete: this.uploadFile.bind(this)})
    },uploadFile: function(a) {
        var b = a.responseText;
        this.uuid = b;
        if (!window.uploadTarget) {
            window.uploadTarget = new Element("iframe", {id: "upload_target",name: "upload_target",style: "display: none"});
            document.body.appendChild(window.uploadTarget)
        }
        this.form.action = "/r/" + this.id + "/upload/" + b;
        if (this.type) {
            this.form.action += "/" + this.type
        }
        this.form.setAttribute("target", "upload_target");
        this.form.submit();
        this.monitor(b)
    },enableButtons: function() {
        this.form.select("button").each(function(a) {
            a.disabled = false
        })
    },disableButtons: function() {
        this.form.select("button").each(function(a) {
            a.disabled = true
        })
    },monitor: function(b) {
        this.uuid = b;
        var a = "/r/" + this.id + "/monitor_progress/" + b;
        new Uploader.Monitor(this, a)
    }});
Uploader.Monitor = Class.create({initialize: function(b, a) {
        this.uploader = b;
        this.monitorUrl = a;
        if (!this.uploader.disableProgressbar) {
            this.initProgressbarPanel()
        }
        this.pe = new PeriodicalExecuter(this.execute.bind(this), 0.3)
    },execute: function(a) {
        new Ajax.Request(this.monitorUrl, {onComplete: this.update.bind(this)})
    },update: function(a) {
        var b = a.headerJSON;
        if (!b) {
            this.uploader.enableButtons();
            this.pe.stop();
            if (this.uploader.onComplete) {
                this.uploader.onComplete(a);
                if (this.progressbar) {
                    this.uploader.progressbarPanel.remove();
                    delete this.uploader.progressbarPanel
                }
            }
            return
        }
        if (this.progressbar) {
            this.progressbar.setStyle({display: "block",width: b.rate + "%"});
            this.summary.update(b.rate + "% / " + b.size)
        }
    },initProgressbarPanel: function() {
        if (!this.uploader.progressbarPanel) {
            var a = new Element("div", {"class": "progressbar_panel"});
            a.update('<div class="progressbar"><div></div></div><div class="summary"></div>');
            var b = this.uploader.form.down("section");
            if (b) {
                b.insert(a)
            } else {
                var c = this.uploader.form.down("div.progress_bar");
                if (c) {
                    c.insert(a)
                } else {
                    this.uploader.form.insert({after: a})
                }
            }
            this.progressbar = a.down(1);
            this.summary = a.select(".summary")[0];
            this.uploader.progressbarPanel = a
        }
        this.uploader.progressbarPanel.show()
    }});
var Watch = Class.create({initialize: function() {
        this.contollerUrl = "/r/watch";
        $A(arguments).each(function(a) {
            $(a) && $(a).on("click", "span.watched, span.not_watched", this.click.bind(this))
        }.bind(this))
    },click: function(b) {
        var a = b.findElement();
        if (a.hasClassName("watched")) {
            this.unwatch(a)
        } else {
            this.watch(a)
        }
        b.stop()
    },watch: function(b) {
        var a = this.contollerUrl + "/watch/" + b.getAttribute("data-type") + "/" + b.getAttribute("data-subject");
        new Ajax.Request(a, {onSuccess: function(c) {
                b.removeClassName("not_watched");
                b.addClassName("watched");
                b.writeAttribute("title", I18n.get("label.watched"))
            }})
    },unwatch: function(b) {
        var a = this.contollerUrl + "/unwatch/" + b.getAttribute("data-type") + "/" + b.getAttribute("data-subject");
        new Ajax.Request(a, {onSuccess: function(c) {
                b.addClassName("not_watched");
                b.removeClassName("watched");
                b.writeAttribute("title", I18n.get("label.not_watched"))
            }})
    }});
