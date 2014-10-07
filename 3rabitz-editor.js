declarePackage("visual.base").DataHandler = Class.create({initialize: function(a) {
        this.type = a
    },openVisualEditor: function(a) {
        if (!this.panel) {
            this.createBlock();
            this.createPanel()
        } else {
            this.getVisualController().load()
        }
        $(document.body).addClassName("overlay_opened");
        this.block.show();
        this.panel.show();
        a && a.stop()
    },createBlock: function() {
        this.block = new Element("div", {"class": "overlay_block"});
        this.block.setOpacity(0.5);
        this.block.on("click", this.close.bind(this));
        document.body.appendChild(this.block)
    },createPanel: function() {
        this.panel = new Element("div", {id: "visual_panel"});
        this.panel.update("<iframe width='100%' height='100' src='/r/visual'></iframe>");
        this.panel.down("iframe").on("load", function() {
            var a = this.getVisualController();
            a.setDataHandler(this);
            a.window.$$(".overlay_close")[0].show().on("click", this.close.bind(this));
            a.load()
        }.bind(this));
        document.body.appendChild(this.panel)
    },load: function() {
        var a = this.getVisualController();
        a.undoManager.clear();
        new Ajax.Request("/r/" + this.type + "_visual/get/" + this.getId(), {onComplete: function(b) {
                a.load(b.responseJSON || "ERROR")
            }.bind(this)})
    },save: function() {
        var b = this.getVisualController();
        Progress.start(b.canvas);
        var a = this.getElement();
        new Ajax.Updater(a, "/r/" + this.type + "_visual/save", {insertion: "after",parameters: this.getParameter(a),onComplete: function() {
                b.menu.refresh();
                var c = a.next();
                a.remove();
                this.saved && this.saved(c);
                this.close();
                Progress.stop()
            }.bind(this)})
    },getParameter: function() {
        var b = this.getVisualController();
        var a = minY = Number.MAX_VALUE;
        var c = maxY = 10;
        b.each(function(i) {
            if (i.type !== "group") {
                var e = Number(i.borderWidth || 1);
                var f = i.get("left", true);
                var d = i.get("right", true);
                var h = i.get("top", true);
                var g = i.get("bottom", true);
                a = Math.min(a, f - e);
                minY = Math.min(minY, h - e);
                c = Math.max(c, d + e);
                maxY = Math.max(maxY, g + e)
            }
        });
        return {id: this.getId(),t: b.toDataURL(),d: b.toJSON(),min_x: Math.ceil(a),min_y: Math.ceil(minY),max_x: Math.ceil(c),max_y: Math.ceil(maxY)}
    },close: function(a) {
        if (!this.getVisualController().requireSave() || !confirm(I18n.get("label.confirm_visual_editor_close"))) {
            $(document.body).removeClassName("overlay_opened");
            this.block.hide();
            this.panel.hide()
        } else {
            this.getVisualController().save()
        }
    },getVisualController: function() {
        for (var b = 0; b < window.frames.length; b++) {
            if (window.frames[b].visualController) {
                var a = window.frames[b].visualController;
                a.window = window.frames[b];
                return a
            }
        }
    }});
var editor = {base: {},element: {},rich: {},table: {},task: {},util: {}};
editor.base.AbstractEditor = Class.create({initialize: function(a) {
        this.controller = a
    },getEditor: function() {
        if (!this.editor) {
            this.editor = this.makeEditor();
            this.editor.controller = this.controller;
            this.editor.contentPanel = this.controller.content;
            this.editor.on("click", "button", this.save.bind(this));
            this.editor.on("click", "a.cancel", this.cancel.bind(this))
        }
        return this.editor
    },getRichEditor: function() {
        return this.controller.getRichEditor()
    },getElement: function() {
        return this.element
    },add: function(b) {
        this.startExecuter();
        var a = this.getEditor();
        this.element = EditorUtil.addPseudoElement(b, a.contentPanel);
        EditorUtil.configuireEditor(a, this.element);
        this.configureFootnote();
        this.editorOpened(a, this.element);
        return this.element
    },open: function(a) {
        this.startExecuter();
        var b = this.getEditor();
        EditorUtil.openEditor(b, a);
        this.element = a;
        this.configureFootnote();
        this.editorOpened(b, a);
        EditorUtil.configuireEditor(b, a)
    },save: function(f) {
        var b = this.getElement();
        var e = this.getParameter(b);
        if (!e) {
            alert(I18n.get("label.cannot_save_empty_content"));
            f && f.stop();
            return
        }
        if (EditorUtil.hasFootnote(b)) {
            b.footnote = b.next()
        }
        var d = this.getEditor();
        var a = "/r/editor/save";
        var c = d.getAttribute("id");
        if (c === "image_editor") {
            a = "/r/editor_image/save"
        } else {
            if (c === "table_editor") {
                a = "/r/editor_table/save"
            } else {
                if (c === "object_editor") {
                    a = "/r/editor_object/save"
                }
            }
        }
        new Ajax.Updater(b, a, {parameters: e,insertion: "after",onComplete: this.endEditor.bind(this)});
        f && f.stop()
    },cancel: function(d) {
        var a = this.controller;
        var c = this.getEditor();
        if (c.hasClassName("disabled")) {
            d && d.stop();
            return
        }
        var b = this.getElement();
        this.closeEditor();
        if (EditorUtil.isNew(b)) {
            b.remove()
        } else {
            var e = b.getAttribute("merge");
            if (e) {
                b.removeAttribute("merge");
                e.split("|").each(function(f) {
                    $(f).show()
                })
            }
            a.selector.select(b)
        }
        this.editorClosed && this.editorClosed(c, b);
        a.endEdit();
        d && d.stop()
    },endEditor: function(b) {
        var a = this.controller;
        a.getUndoManager().enable();
        var d = this.getEditor();
        var c = this.getElement();
        if (b.headerJSON && b.headerJSON.code) {
            new editor.util.Synchronizer(a).show(c, b.headerJSON)
        } else {
            if (c.footnote) {
                c.footnote.remove()
            }
            this.closeEditor();
            var e = c.next();
            c.remove();
            a.selector.select(e);
            e.fadeIn();
            a.endEdit();
            if (b.headerJSON && b.headerJSON.version) {
                new editor.util.VersionChecker(a).show(e, b.headerJSON)
            }
        }
        this.editorClosed && this.editorClosed(d, c, b.request.options.parameters, e)
    },closeEditor: function() {
        if (this.pe) {
            this.pe.stop();
            delete this.pe
        }
        if (document.activeElement) {
            try {
                if (document.activeElement.nodeName.toLowerCase() != "body") {
                    document.activeElement.blur()
                }
            } catch (b) {
            }
        }
        var a = this.getElement();
        a.removeClassName("pseudo");
        a.setStyle({marginBottom: "0"});
        this.getEditor().hide()
    },startExecuter: function() {
        this.pe = new PeriodicalExecuter(function(a) {
            var b = this.getElement();
            var c = this.getEditor();
            b.setStyle({marginBottom: (c.getLayout().get("margin-box-height") + 10) + "px"});
            c.select(".editable img").each(function(f) {
                if (!f.hasAttribute("width")) {
                    var d = f.getWidth();
                    var e = f.getHeight();
                    if (d > 0 && e > 0) {
                        f.setAttribute("width", d);
                        f.setAttribute("height", e)
                    }
                }
            });
            if (document.body.hasClassName("chromexxx")) {
                c.select(".editable span[style]").each(function(g) {
                    var f = g.getAttribute("class");
                    if ((!f || !f.startsWith("r_")) && f !== "callout" && !g.hasClassName("mark") && g.up().tagName !== "CITE") {
                        this.removeBlankSpace(g.previousSibling);
                        this.removeBlankSpace(g.nextSibling);
                        g.insert({before: g.innerHTML});
                        g.remove();
                        var e = window.getSelection();
                        var d = e.getRangeAt(0);
                        if (e.rangeCount > 0) {
                            e.removeAllRanges()
                        }
                        e.addRange(d)
                    }
                }.bind(this))
            }
        }.bind(this), 0.1)
    },removeBlankSpace: function(a) {
        if (a && a.length === 1) {
            a.textContent = ""
        }
    },configureFootnote: function() {
        this.editable || this.getEditor();
        if (!this.editable) {
            return
        }
        var c = 0;
        var b = this.getElement();
        var e = this.controller.getElementPanel().select(".element");
        for (var a = 0; a < e.size(); a++) {
            var d = e[a];
            if (d === b) {
                break
            } else {
                c += d.select("cite").size()
            }
        }
        this.editable.setStyle({counterReset: "editable_cite " + c})
    },getEditorContent: function() {
        var a = this.editable.select("img");
        if (a.size() !== 0) {
            var b = window.location.protocol + "//" + window.location.host;
            a.each(function(d) {
                var e = d.getAttribute("src");
                if (!e) {
                    d.remove()
                } else {
                    if (e.startsWith(b) || e.startsWith("../../image/get/")) {
                        var c = d.previousSibling;
                        if (c && c.nodeType == Node.TEXT_NODE) {
                            if (c.nodeValue === "\n") {
                                c.nodeValue = ""
                            }
                        }
                        if (e.startsWith(b)) {
                            d.setAttribute("src", e.gsub(b, ""))
                        } else {
                            d.setAttribute("src", e.gsub("../../image/get/", "/r/image/get/"))
                        }
                    }
                }
            })
        }
        return this.editable.innerHTML
    }});
editor.base.Editor = Class.create({initialize: function(c, a) {
        Ajax.Responders.register({onCreate: function(e, d) {
                d.request.options.requestHeaders = {editor: a};
                if (d.request.container) {
                    Progress.start(d.request.container.success)
                }
            },onComplete: function(e, d) {
                if (d.getHeader("Signout") === "true") {
                    $login(d.getHeader("login_path"));
                    return
                }
                if (d.request.container) {
                    Progress.stop()
                }
            }});
        Event.observe(window, "beforeunload", function(d) {
            if (window.preventBeforeunload) {
                window.preventBeforeunload = null
            } else {
                new Ajax.Request("/r/editor/close_editor", {asynchronous: !Prototype.Browser.Safari})
            }
        });
        EditorUtil.id = c;
        EditorUtil.editorId = a;
        this.edit = false;
        this.drag = false;
        this.selector = new editor.util.Selector(this);
        this.contentPanel = $("element_panel");
        this.content = this.contentPanel.down();
        this.editorTitleUpdater = new editor.util.Title(this, c);
        this.mouseHandler = new editor.base.MouseHandler(this);
        this.keyHandler = new editor.base.KeyHandler(this);
        this.taskPanel = new EditorTaskPanel(this, c);
        this.richEditor = new editor.rich.RichEditor();
        this.textEditor = new editor.base.TextEditor(this);
        this.imageEditor = new editor.base.ImageEditor(this);
        this.tableEditor = new editor.base.TableEditor(this);
        this.objectEditor = new editor.base.ObjectEditor(this);
        this.content.setStyle({visibility: "visible"});
        $$("a.to_top")[0].on("click", function(d) {
            window.scrollTo(0, 0);
            this.selector.select(this.content.down())
        }.bind(this));
        if (window.location.hash) {
            var b = window.location.hash.substring(1);
            window.location.hash = "";
            document.observe("dom:loaded", function() {
                setTimeout("EditorUtil.moveTo($('" + b + "'))", 100)
            })
        }
        new Favorite($("top_panel"))
    },getElementPanel: function() {
        return this.content
    },getRichEditor: function() {
        return this.richEditor
    },selectAllElements: function(a) {
        this.selector.selectAll(a)
    },selectFirstElement: function(b) {
        var a = this.content.down();
        if (a && a !== this.selector.get()) {
            this.selector.select(a, b);
            EditorUtil.scrollTo(a)
        }
    },removeElement: function() {
        this.mouseHandler.removeElement()
    },startEdit: function() {
        this.edit = true;
        if (this.currentElement) {
            this.currentElement.removeClassName("over");
            delete this.currentElement
        }
        this.mouseHandler.disable();
        this.keyHandler.toEditMode()
    },endEdit: function() {
        this.edit = false;
        delete this.openedEditor;
        this.mouseHandler.enable();
        this.keyHandler.toNormalMode()
    },startDrag: function() {
        this.drag = true;
        this.mouseHandler.disable()
    },endDrag: function() {
        this.drag = false;
        this.mouseHandler.enable()
    },save: function(c) {
        if (this.openedEditor) {
            var b = true;
            var d = $$(".re_overlay").find(function(e) {
                if (e.visible()) {
                    return e
                }
            });
            if (d) {
                b = false
            } else {
                var a = $$(".context_menu").find(function(e) {
                    if (e.visible()) {
                        return e
                    }
                });
                if (a) {
                    b = false
                }
            }
            b && this.openedEditor.save(c)
        }
    },cancel: function() {
        if (this.openedEditor) {
            var b = true;
            var c = $$(".re_overlay").find(function(d) {
                if (d.visible()) {
                    return d
                }
            });
            if (c) {
                this.richEditor.closeOverlay(c.getAttribute("id"));
                b = false
            } else {
                var a = $$(".context_menu").find(function(d) {
                    if (d.visible()) {
                        return d
                    }
                });
                if (a) {
                    a.hide();
                    if (window._currentRange) {
                        window._currentRange.focus();
                        window._currentRange = null
                    }
                    ContextMenu.disableShortCut();
                    b = false
                }
            }
            b && this.openedEditor.cancel()
        } else {
            if (this.drag) {
                this.mouseHandler.cancel();
                this.endDrag()
            } else {
                if (this.taskPanel.visible()) {
                    this.taskPanel.close(null, true)
                } else {
                    this.mouseHandler.clearCopiedElements();
                    this.selector.clear()
                }
            }
        }
    },getOpenedEditor: function() {
        return this.openedEditor
    },addElement: function(b, a) {
        this.clearCopiedElements();
        this.startEdit();
        this.openedEditor = this[b + "Editor"];
        a = this.openedEditor.add(a);
        EditorUtil.scrollTo(a)
    },editElement: function(b) {
        if (this.selector.isEmpty() || this.selector.singleSelected()) {
            this.clearCopiedElements();
            b = b || this.selector.get() || this.currentElement;
            if (!b) {
                return
            }
            this.selector.clear();
            this.selector.setCandidate(b);
            var c = EditorUtil.getType(b);
            this.startEdit();
            b.removeClassName("over");
            if (c != "image" && c != "table") {
                c = this.isObjectType(c) ? "object" : "text"
            }
            this.openedEditor = this[c + "Editor"];
            this.openedEditor.open(b);
            EditorUtil.scrollTo(b)
        } else {
            var d = this.selector.getAll();
            for (var a = 0; a < d.size(); a++) {
                var c = EditorUtil.getType(d[a]);
                if (c != "normal" && c != "headline" && c != "ordered_list" && c != "unordered_list" && c != "definition_list" && c != "blockquote" && c != "epigraph" && c != "pre" && c != "code" && c != "command" && c != "callout_list") {
                    alert(I18n.get("label.invalid_merge_selection_type"));
                    return
                }
            }
            var b = d.first();
            var e = b.getAttribute("id");
            d.each(function(f) {
                if (f != b) {
                    f.hide();
                    e += "|" + f.getAttribute("id")
                }
            });
            b.setAttribute("merge", e);
            this.selector.clear();
            this.editElement(b)
        }
    },isObjectType: function(a) {
        return EditorUtil.isObject(a)
    },showElementTools: function() {
        this.mouseHandler.showElementTools()
    },append: function(a) {
        this.contentPanel.appendChild(a)
    },undo: function() {
        this.getUndoManager().undo()
    },redo: function() {
        this.getUndoManager().redo()
    },getUndoManager: function() {
        return this.undoManager = this.undoManager || new editor.util.UndoManager(this)
    },expand: function() {
        if (this.selector.singleSelected()) {
            var a = this.selector.get();
            if (EditorUtil.isHeadingType(a) && a.down().hasClassName("collapsed")) {
                this.mouseHandler.outline.expand(a.down())
            }
        }
    },collapse: function(a) {
        if (this.selector.singleSelected()) {
            var a = this.selector.get();
            if (EditorUtil.isHeadingType(a) && !a.down().hasClassName("collapsed")) {
                this.mouseHandler.outline.collapse(a.down())
            }
        }
    },getTaskPanel: function() {
        return this.taskPanel
    },getVisualEditor: function() {
        return (this.visualEditor = this.visualEditor || new editor.base.VisualEditor(this))
    },closeTaskPanel: function() {
        return this.taskPanel.close()
    },updateOutline: function() {
        this.taskPanel.updateOutline()
    },viewElementRevision: function() {
        this.taskPanel.viewElementRevision()
    },clearCopiedElements: function() {
        this.mouseHandler.elementTool.clearCopiedElements()
    }});
editor.base.ImageEditor = Class.create(editor.base.AbstractEditor, {makeEditor: function() {
        this.mode = "file";
        var a = $("image_editor");
        a.on("click", "input[name='mode']", this.toggle.bind(this));
        this.editable = a.down(".editable");
        $("omit_image_caption").on("click", this.toggleCaption.bind(this));
        $("image_upload_editor_id").value = EditorUtil.editorId;
        $("image_upload_file").on("change", this.configureFilename.bind(this));
        this.referencedImage = new editor.base.ReferencedImage();
        this.getRichEditor().enable(a);
        this.undoManager = new editor.rich.UndoManager(this.editable);
        return a
    },configureFilename: function(c) {
        try {
            if (EditorUtil.isBlank(this.editable) || this.editable.innerHTML === this.filename) {
                this.undoManager.saveState(true);
                var a = $F("image_upload_file");
                var b = "/";
                if (a.match(/\\/)) {
                    b = "\\"
                }
                a = a.substring(a.lastIndexOf(b) + 1, a.lastIndexOf("."));
                this.editable.innerHTML = a;
                this.editable.focus();
                this.filename = a
            }
            this.save()
        } catch (d) {
        }
    },editorOpened: function(c, b) {
        if (Prototype.Browser.IE) {
            c.reset();
            c.select("input[value='" + this.mode + "']")[0].checked = true
        }
        $("image_upload_caption").value = "";
        $("image_upload_file").value = "";
        $("image_upload_url").value = "";
        $("image_upload_other").value = "";
        $("omit_image_caption").checked = false;
        if (!EditorUtil.isNew(b)) {
            this.mode = b.getAttribute("data-mode");
            if (this.mode === "reference") {
                c.select("input[name='mode']")[1].checked = true;
                var d = b.select("p.content")[0];
                if (d) {
                    var f = d.next();
                    $("image_reference").value = f.getAttribute("data-element");
                    this.referencedImage.setBookAndChapter(f.getAttribute("data-book"), f.getAttribute("data-chapter"))
                }
            } else {
                if (this.mode === "url") {
                    c.select("input[name='mode']")[2].checked = true;
                    $("image_upload_url").value = b.select("p.content img")[0].src
                } else {
                    if (this.mode === "other") {
                        c.select("input[name='mode']")[3].checked = true;
                        var e = b.down("p.content");
                        if (e.down() && e.down().tagName === "IMG") {
                            $("image_upload_other").value = e.down().src
                        } else {
                            $("image_upload_other").value = e.innerHTML
                        }
                    } else {
                        c.select("input[name='mode']")[0].checked = true
                    }
                }
            }
            var a = b.select("p.caption");
            this.editable.update(a.size() > 0 ? a[0].innerHTML : "");
            $("omit_image_caption").checked = "true" === b.getAttribute("data-omit-caption")
        } else {
            this.editable.update()
        }
        this.toggle();
        this.getRichEditor().setUndoManager(this.undoManager);
        if (!this.clipboard) {
            this.clipboard = new Clipboard("image_editor", function(g) {
                $("clipboard_image").src = "/r/image/get/" + g;
                $("clipboard_image").show();
                $("clipboard_image_id").value = g
            }, function() {
                $("clipboard_image_id").value = "";
                $("clipboard_image").hide()
            })
        }
        this.clipboard.start()
    },editorClosed: function(e, c, f, b) {
        this.getRichEditor().setUndoManager();
        var g = b && b.down("img");
        if (g) {
            var a = g.height;
            if (a < 18) {
                var d = g.on("load", function(h) {
                    _editor.mouseHandler.showElementTools();
                    d.stop()
                })
            }
        }
        delete this.filename;
        this.clipboard && this.clipboard.stop()
    },save: function($super, c) {
        var b = this.getEditor();
        var a = this.getElement();
        $("image_upload_chapter_id").value = EditorUtil.getChapterId();
        $("image_upload_id").value = a.getAttribute("id");
        $("image_upload_caption").value = this.getEditorContent();
        if (this.mode === "file" && $F("image_upload_file") !== "") {
            if (Prototype.Browser.Gecko) {
                $("omit_image_caption").focus()
            }
            if (EditorUtil.hasFootnote(a)) {
                a.footnote = a.next()
            }
            var d = EditorUtil.surround(a, {});
            $("image_upload_previous_id").value = d.previous_id || "";
            $("image_upload_next_id").value = d.next_id || "";
            this.uploader = this.uploader || new Uploader("editor_image", this.getEditor(), this.uploadCompleted.bind(this));
            this.uploader.upload();
            c && c.stop()
        } else {
            $super(c)
        }
    },getParameter: function(b) {
        var a = EditorUtil.surround(b, this.getEditor().serialize(true));
        a.version = b.getAttribute("data-version");
        return a
    },toggle: function(b) {
        this.mode = b ? $F(b.findElement()) : this.mode;
        this.editor.select(".item").invoke("hide");
        this.editor.select("." + this.mode).invoke("show");
        this.toggleCaption();
        var a = $("image_upload_" + this.mode);
        if (a && a.tagName === "TEXTAREA") {
            a.focus()
        }
    },toggleCaption: function(a) {
        if ($("omit_image_caption").checked) {
            this.editable.up().hide()
        } else {
            this.editable.up().show()
        }
    },uploadCompleted: function() {
        var b = this.getElement();
        var a = "/r/editor_image/view/";
        if (EditorUtil.isNew(b)) {
            a += this.uploader.getUuid()
        } else {
            a += b.getAttribute("id")
        }
        new Ajax.Updater(b, a, {parameters: {version: b.getAttribute("data-version")},insertion: "after",onComplete: this.endEditor.bind(this)})
    }});
editor.base.ReferencedImage = Class.create({initialize: function() {
        this.selector = new editor.util.BookElementSelector({books: $("image_editor_book_id"),chapters: $("image_editor_chapter_id"),panel: $("image_eidtor_figure_panel"),path: "/r/figure/by_chapter",selectElement: this.selectElement.bind(this),bindSelection: this.bindSelection.bind(this)})
    },setBookAndChapter: function(b, a) {
        this.selector.setBookAndChapter(b, a)
    },bindSelection: function(a) {
        var b = $("reference_" + $F("image_reference"));
        b && b.addClassName("selected")
    },selectElement: function(b) {
        var a = $("reference_" + $F("image_reference"));
        a && a.removeClassName("selected");
        a = b.findElement();
        a.addClassName("selected");
        $("image_reference").value = a.getAttribute("id").replace("reference_", "")
    }});
editor.base.KeyHandler = Class.create({initialize: function(a) {
        this.controller = a;
        this.shortcut = new Shortcut(document);
        this.shortcut.bind("escape", this.escape.bind(this));
        this.insertShortcut = window.navigator.userAgent.indexOf("Linux") != -1 ? "alt_i" : "ctrl_i";
        this.deleteShortcut = window.navigator.userAgent.indexOf("Mac") != -1 ? "backspace" : "delete";
        this.toNormalMode()
    },toNormalMode: function() {
        this.shortcut.unbind("ctrl_s", "ctrl_0", "ctrl_1", "ctrl_2", "ctrl_3", "ctrl_4", "ctrl_5", "ctrl_6", "ctrl_7", "ctrl_8", "ctrl_9", "tab");
        this.shortcut.bind("return", this.edit.bind(this));
        this.shortcut.bind("home", this.home.bind(this));
        this.shortcut.bind("end", this.end.bind(this));
        this.shortcut.bind("pageup", this.pageUp.bind(this));
        this.shortcut.bind("pagedown", this.pageDown.bind(this));
        this.shortcut.bind("up", this.up.bind(this));
        this.shortcut.bind("down", this.down.bind(this));
        this.shortcut.bind("left", this.left.bind(this));
        this.shortcut.bind("right", this.right.bind(this));
        this.shortcut.bind("shift_up", this.up.bind(this));
        this.shortcut.bind("shift_down", this.down.bind(this));
        this.shortcut.bind("tab", this.tab.bind(this));
        this.shortcut.bind("shift_tab", this.shiftTab.bind(this));
        this.shortcut.bind("ctrl_a", this.selectAll.bind(this));
        this.shortcut.bind(this.insertShortcut, this.insert.bind(this));
        this.shortcut.bind(this.deleteShortcut, this.remove.bind(this));
        this.shortcut.bind("alt_ctrl_i", this.insertToTop.bind(this));
        this.shortcut.bind("ctrl_c", this.copy.bind(this));
        this.shortcut.bind("ctrl_v", this.paste.bind(this));
        this.shortcut.bind("ctrl_z", this.undo.bind(this));
        this.shortcut.bind("ctrl_y", this.redo.bind(this));
        this.shortcut.bind("ctrl_f", this.find.bind(this));
        this.shortcut.bind("ctrl_1", this.insert.bind(this));
        this.shortcut.bind("alt_ctrl_1", this.insertToTop.bind(this));
        this.shortcut.bind("ctrl_2", this.insert.bind(this));
        this.shortcut.bind("alt_ctrl_2", this.insertToTop.bind(this));
        this.shortcut.bind("ctrl_3", this.insert.bind(this));
        this.shortcut.bind("alt_ctrl_3", this.insertToTop.bind(this));
        this.shortcut.bind("ctrl_4", this.insert.bind(this));
        this.shortcut.bind("alt_ctrl_4", this.insertToTop.bind(this));
        this.characterContextMenu && this.characterContextMenu.hide();
        this.elementTypeContextMenu && this.elementTypeContextMenu.hide()
    },toEditMode: function() {
        this.disableNormalMode();
        this.shortcut.bind("ctrl_s", this.save.bind(this));
        this.shortcut.bind("ctrl_0", this.changeElementType.bind(this));
        this.shortcut.bind("ctrl_1", this.changeElementType.bind(this));
        this.shortcut.bind("ctrl_2", this.changeElementType.bind(this));
        this.shortcut.bind("ctrl_3", this.changeElementType.bind(this));
        this.shortcut.bind("ctrl_4", this.changeElementType.bind(this));
        this.shortcut.bind("ctrl_5", this.changeElementType.bind(this));
        this.shortcut.bind("ctrl_6", this.changeElementType.bind(this));
        this.shortcut.bind("ctrl_7", this.changeElementType.bind(this));
        this.shortcut.bind("ctrl_8", this.changeElementType.bind(this));
        this.shortcut.bind("ctrl_9", this.changeElementType.bind(this));
        this.shortcut.bind("tab", this.tabInCode.bind(this))
    },disableNormalMode: function() {
        this.shortcut.unbind("return", "home", "end", "pageup", "pagedown", "up", "down", "left", "right", "shift_up", "shift_down", "tab", "shift_tab", "ctrl_a", this.insertShortcut, this.deleteShortcut, "alt_ctrl_i", "ctrl_c", "ctrl_v", "ctrl_z", "ctrl_y", "ctrl_f", "ctrl_1", "alt_ctrl_1", "ctrl_2", "alt_ctrl_2", "ctrl_3", "alt_ctrl_3", "ctrl_4", "alt_ctrl_4")
    },prevent: function() {
        this.preventedHandlers = this.preventedHandlers || $H();
        $A(arguments).each(function(a) {
            this.preventedHandlers.set(a, this.shortcut.getHandler(a));
            this.shortcut.unbind(a)
        }.bind(this))
    },rebind: function() {
        this.preventedHandlers = this.preventedHandlers || $H();
        $A(arguments).each(function(a) {
            this.shortcut.bind(a, this.preventedHandlers.get(a));
            this.preventedHandlers.unset(a)
        }.bind(this))
    },edit: function(d, b, c) {
        if (this.formFocused()) {
            return "ignore"
        }
        var a = this.controller;
        if (a.selector.singleSelected()) {
            a.currentElement = a.selector.get()
        }
        a.editElement()
    },escape: function(c, a, b) {
        this.controller.cancel()
    },save: function(c, a, b) {
        b.stop();
        this.controller.save(b)
    },home: function(c, a, b) {
        if (this.formFocused()) {
            return "ignore"
        }
        this.controller.selectFirstElement(b)
    },end: function(d, b, c) {
        if (this.formFocused()) {
            return "ignore"
        }
        var a = this.controller;
        element = a.contentPanel.down().childElements().last();
        if (element && element !== a.selector.get()) {
            a.selector.select(element, c);
            EditorUtil.scrollTo(element)
        }
    },pageUp: function(e, c, d) {
        var b = this.findElement();
        if (b) {
            var a = this.controller;
            var f = document.viewport.getHeight();
            b = b.previous();
            while (b && b.viewportOffset().top > 90) {
                b = b.previous()
            }
            if (b) {
                a.selector.select(b, d);
                EditorUtil.scrollToBottom(b)
            } else {
                this.home(e, c, d)
            }
        }
    },pageDown: function(f, d, e) {
        var c = this.findElement();
        if (c) {
            var a = this.controller;
            var g = document.viewport.getHeight();
            var c = c.next();
            if (c) {
                var b = c.viewportOffset().top + c.getHeight();
                while ((c.next()) && b < g) {
                    c = c.next();
                    b = c.viewportOffset().top + c.getHeight()
                }
                a.selector.select(c, e);
                EditorUtil.scrollToTop(c)
            } else {
                this.end(f, d, e)
            }
        }
    },up: function(e, c, d) {
        if (this.formFocused()) {
            return "ignore"
        }
        var a = this.controller;
        var b = a.selector.selected() ? a.selector.getRecent() : this.findElement();
        if (b) {
            b = b.previous();
            while (b && !EditorUtil.isValid(b)) {
                b = b.previous()
            }
            if (b) {
                a.selector.select(b, d);
                b.scrollUp()
            }
        }
    },down: function(e, c, d) {
        if (this.formFocused()) {
            return "ignore"
        }
        if (this.down.working) {
            return
        }
        var a = this.controller;
        var b = a.selector.selected() ? a.selector.getRecent() : this.findElement();
        if (b) {
            b = b.next();
            while (b && !EditorUtil.isValid(b)) {
                b = b.next()
            }
            if (b) {
                a.selector.select(b, d);
                b.scrollDown(this.down)
            }
        }
    },left: function(c, a, b) {
        if (this.formFocused()) {
            return "ignore"
        }
        this.controller.collapse()
    },right: function(c, a, b) {
        if (this.formFocused()) {
            return "ignore"
        }
        this.controller.expand()
    },formFocused: function() {
        if (!document.activeElement) {
            return false
        }
        var a = document.activeElement.tagName;
        return a != "BODY" && a != "TABLE" && a != "CAPTION" && a != "TD" && a != "A"
    },findElement: function() {
        var a = this.controller;
        if (a.selector.selected()) {
            return a.selector.last()
        } else {
            var b = a.selector.getCandidate();
            b = b || a.currentElement;
            if (!b) {
                b = a.content.select(".element").find(function(c) {
                    if (c.viewportOffset().top > 100) {
                        return c
                    }
                })
            }
            b = b || a.content.down();
            if (b) {
                a.selector.select(b)
            }
        }
    },selectAll: function(c, a, b) {
        if (this.formFocused()) {
            return "ignore"
        }
        this.controller.selectAllElements()
    },remove: function(c, a, b) {
        if (this.formFocused()) {
            return "ignore"
        }
        this.controller.removeElement()
    },insert: function(c, a, b) {
        this.insertElement("after", this.getInsertType(a))
    },insertToTop: function(d, a, c) {
        var b = "text";
        this.insertElement("before", this.getInsertType(a))
    },getInsertType: function(b) {
        var a = "text";
        if (b.endsWith("2")) {
            a = "image"
        } else {
            if (b.endsWith("3")) {
                a = "table"
            } else {
                if (b.endsWith("4")) {
                    a = "object"
                }
            }
        }
        return a
    },insertElement: function(d, b) {
        var a = this.controller;
        if (a.edit) {
            return "ignore"
        }
        var c;
        if (a.selector.selected()) {
            c = a.selector.last();
            a.selector.clear()
        } else {
            c = a.currentElement;
            if (c) {
                c = $(c.getAttribute("id"))
            }
        }
        if (!c) {
            c = a.selector.getRecent()
        }
        if (c) {
            editor.insertion = d
        } else {
            c = a.getElementPanel();
            editor.insertion = d === "after" ? "bottom" : "top"
        }
        a.addElement(b, c)
    },copy: function(d, b, c) {
        if (this.formFocused()) {
            return "ignore"
        }
        if (new BaseRange(true).isCopyable()) {
            return "ignore"
        }
        var a = this.controller.mouseHandler.elementTool;
        a.copy()
    },paste: function(d, b, c) {
        if (this.formFocused()) {
            return "ignore"
        }
        var a = this.controller.mouseHandler.elementTool;
        a.paste(null, this.controller.selector.last())
    },undo: function(c, a, b) {
        if (this.formFocused()) {
            return "ignore"
        }
        this.controller.undo()
    },redo: function(c, a, b) {
        if (this.formFocused()) {
            return "ignore"
        }
        this.controller.redo()
    },find: function(c, a, b) {
        if (this.formFocused()) {
            return "ignore"
        }
        this.controller.getTaskPanel().click(null, $$(".find_replace")[0])
    },changeElementType: function(d, a, c) {
        if (this.controller.edit) {
            var e = Number(a.substring(5));
            var b = "heading" + e;
            if (e === 0) {
                b = "normal"
            } else {
                if (e === 6) {
                    b = "code"
                } else {
                    if (e === 7) {
                        b = "ordered_list"
                    } else {
                        if (e === 8) {
                            b = "unordered_list"
                        } else {
                            if (e === 9) {
                                b = "note"
                            }
                        }
                    }
                }
            }
            this.controller.textEditor.setElementType(b)
        }
    },tab: function(g, b, e) {
        if (this.formFocused()) {
            return "ignore"
        }
        var a = this.controller;
        if (a.selector.selected()) {
            var d = true;
            a.selector.each(function(h) {
                var i = EditorUtil.getType(h);
                if (i.startsWith("heading")) {
                    if (Number(i.replace("heading", "")) === 5) {
                        d = false
                    }
                }
            });
            if (d) {
                var c = {id: $A(),type: $A(),chapter_id: EditorUtil.getChapterId()};
                var f = $A();
                a.selector.each(function(i) {
                    var j = EditorUtil.getType(i);
                    if (j.startsWith("heading")) {
                        var l = Number(j.replace("heading", "")) + 1;
                        l = Math.min(5, l);
                        var h = "element heading" + l + " selected";
                        var k = new Element("h" + (l), {id: i.getAttribute("id"),"class": h,"data-version": Number(i.getAttribute("data-version")) + 1});
                        k.update(i.innerHTML);
                        i.insert({after: k});
                        i.remove();
                        c.id.push(i.getAttribute("id"));
                        c.type.push("heading" + l);
                        f.push(k)
                    } else {
                        f.push(i)
                    }
                });
                if (c.id.size() > 0) {
                    new Ajax.Request("/r/editor/change_type", {parameters: c,onComplete: function() {
                            a.updateOutline()
                        }});
                    a.selector.setAll(f)
                }
            }
        } else {
            return "ignore"
        }
    },shiftTab: function() {
        if (this.formFocused()) {
            return "ignore"
        }
        var a = this.controller;
        if (a.selector.selected()) {
            var c = true;
            a.selector.each(function(e) {
                var f = EditorUtil.getType(e);
                if (f.startsWith("heading")) {
                    if (Number(f.replace("heading", "")) === 1) {
                        c = false
                    }
                }
            });
            if (c) {
                var b = {id: $A(),type: $A(),chapter_id: EditorUtil.getChapterId()};
                var d = $A();
                a.selector.each(function(f) {
                    var g = EditorUtil.getType(f);
                    if (g.startsWith("heading")) {
                        var i = Number(g.replace("heading", "")) - 1;
                        i = Math.max(1, i);
                        var e = "element heading" + i + " selected";
                        var h = new Element("h" + (i), {id: f.getAttribute("id"),"class": e,"data-version": Number(f.getAttribute("data-version")) + 1});
                        h.update(f.innerHTML);
                        f.insert({after: h});
                        f.remove();
                        b.id.push(f.getAttribute("id"));
                        b.type.push("heading" + i);
                        d.push(h)
                    } else {
                        d.push(f)
                    }
                });
                if (b.id.size() > 0) {
                    new Ajax.Request("/r/editor/change_type", {parameters: b,onComplete: function() {
                            a.updateOutline()
                        }});
                    a.selector.setAll(d)
                }
            }
        } else {
            return "ignore"
        }
    },tabInCode: function(d, b, c) {
        if (document.activeElement && $(document.activeElement).hasClassName("monospace")) {
            var a = new BaseRange(true);
            a.insertText("\u0009")
        } else {
            return "ignore"
        }
    }});
editor.base.MouseHandler = Class.create({initialize: function(a) {
        this.controller = a;
        this.cookie = new Cookie();
        this.controller.contentPanel.on("mouseleave", this.out.bind(this));
        this.controller.content.on("mouseover", this.over.bind(this));
        this.controller.content.on("mousedown", function(b) {
            if (!a.edit && b.shiftKey) {
                b.stop()
            }
        });
        this.controller.content.on("click", this.select.bind(this));
        this.controller.content.on("dblclick", this.edit.bind(this));
        this.elementAdder = new editor.element.Adder(a);
        this.elementMover = new editor.element.Mover(a);
        this.elementTool = new editor.element.Tool(a);
        this.dropPosition = new editor.util.DropPosition(a);
        this.outline = new editor.util.Outline()
    },enable: function() {
        this.elementAdder.enable();
        this.dropPosition.hide()
    },disable: function(a) {
        if (!a) {
            this.elementAdder.disable()
        }
        this.elementMover.disable();
        this.elementTool.disable()
    },cancel: function() {
        this.elementAdder.cancel();
        this.elementMover.cancel()
    },clearCopiedElements: function() {
        this.elementTool.clearCopiedElements()
    },showElementTools: function() {
        if (this.controller.selector.selected()) {
            var b = this.controller.selector.get();
            var a = this.controller.selector.last();
            this.elementMover.enable(b.cumulativeOffset().top);
            this.elementTool.enable(a.cumulativeOffset().top + a.getLayout().get("margin-box-height"), true)
        } else {
            this.elementMover.disable();
            this.elementTool.disable()
        }
        this.removeHistory()
    },over: function(d) {
        var a = this.controller;
        if (a.edit) {
            d.stop();
            return
        }
        var c = d.findElement(".element");
        if (!c) {
            c = d.findElement(".footnote");
            if (c) {
                c = c.previous()
            } else {
                d.stop();
                return
            }
        }
        var b = a.currentElement;
        if (a.drag) {
            this.dropPosition.show(d, c);
            a.currentElement = c;
            d.stop();
            return
        }
        if (b) {
            b.removeClassName("over")
        }
        var f = d.pointerY() - document.viewport.getScrollOffsets().top;
        if (this.y && f == this.y) {
            return
        } else {
            this.y = f
        }
        a.currentElement = c;
        if (!a.drag) {
            c.addClassName("over");
            if (a.selector.isEmpty()) {
                var e = c.cumulativeOffset().top;
                this.elementMover.enable(e);
                this.elementTool.enable(e + c.getLayout().get("margin-box-height"), false)
            }
        }
        d.stop()
    },out: function(c) {
        var a = this.controller;
        if (a.drag) {
            c.stop();
            return
        }
        var b = a.currentElement;
        if (b && b.hasClassName("over")) {
            b.removeClassName("over");
            if (a.selector.isEmpty()) {
                this.disable(true)
            }
        }
        delete a.currentElement;
        c.stop()
    },select: function(b) {
        var a = b.findElement("a");
        if (a) {
            if (a.hasClassName("edit_single_page_design")) {
                var c = a.up(".element").getAttribute("id");
                window.open("/r/single_page_design/load/" + EditorUtil.getChapterId() + "/" + c)
            } else {
                if (a.hasClassName("view_print_image")) {
                    (this.printImage = this.printImage || new editor.util.PrintImage()).view(a)
                } else {
                    if (a.hasClassName("remove_print_image")) {
                        (this.printImage = this.printImage || new editor.util.PrintImage()).remove(a)
                    } else {
                        this.showTooltip(a)
                    }
                }
            }
            b.stop();
            return
        }
        a = b.findElement("input");
        if (a) {
            (this.printImage = this.printImage || new editor.util.PrintImage()).run(a);
            return
        }
        if (this.controller.edit) {
            return
        }
        a = b.findElement(".image_tool");
        if (a) {
            if (a.hasClassName("open_visual_editor")) {
                this.controller.getVisualEditor().open(a.up(".element"));
                return
            } else {
                if (a.hasClassName("save_image_internally")) {
                    new editor.util.ImageSaver().save(a.up(".element"));
                    return
                }
            }
        }
        a = b.findElement("cite");
        if (a) {
            this.showTooltip(a);
            b.stop();
            return
        }
        this.tooltip && this.tooltip.hide();
        a = b.findElement(".outline_item");
        if (a) {
            this.outline.run(a);
            b.stop();
            return
        }
        a = b.findElement(".element");
        if (!a) {
            a = b.findElement(".footnote");
            a = a && a.previous()
        }
        if (a) {
            this.controller.closeTaskPanel();
            this.controller.selector.select(a, b)
        }
        b.stop()
    },showTooltip: function(a) {
        this.tooltip = this.tooltip || new editor.util.Tooltip();
        this.tooltip.show(a)
    },edit: function(a) {
        this.controller.editElement();
        a.stop()
    },removeElement: function() {
        this.elementTool.remove()
    },removeHistory: function() {
        if (this.controller.historyPanel) {
            this.controller.historyPanel.remove();
            delete this.controller.historyPanel
        }
    }});
editor.base.ObjectEditor = Class.create(editor.base.AbstractEditor, {makeEditor: function() {
        var a = $("object_editor");
        a.select(".item").invoke("hide");
        a.down("select").on("change", this.changeType.bind(this));
        this.include = new editor.util.Include(a);
        return a
    },editorOpened: function(d, b) {
        d.reset();
        if (!EditorUtil.isNew(b)) {
            var c = EditorUtil.getType(b);
            $("object_type").value = c;
            if (c === "toc") {
                $("object_toc_level").value = this.getSubvalue(b)
            } else {
                if (c === "space") {
                    $("object_space_height").value = this.getSubvalue(b)
                } else {
                    if (c === "layout_page") {
                        $("object_layout_page").value = this.getSubvalue(b)
                    } else {
                        if (c === "single_design_page") {
                            $("object_description").value = this.getSubvalue(b)
                        } else {
                            if (c === "glossary") {
                                $("object_glossary").value = this.getSubvalue(b)
                            } else {
                                if (c === "index") {
                                    this.configureIndex(b)
                                } else {
                                    if (c === "include") {
                                        $("object_element_to_include").value = b.down("var").innerHTML;
                                        $("object_heading_adjustment").value = b.down("var").getAttribute("data-heading-adjustment");
                                        $("object_description").value = this.getSubvalue(b);
                                        var a = b.down("strong");
                                        if (a) {
                                            this.include.setBookAndChapter(a.getAttribute("data-book"), a.getAttribute("data-chapter"))
                                        } else {
                                            this.include.setBookAndChapter()
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            $("object_element_to_include").value = ""
        }
        this.changeType();
        d.focusFirstElement()
    },getSubvalue: function(a) {
        var b = a.select("span.parameter");
        if (b.length === 0) {
            return ""
        }
        return b[0].getAttribute("data-value") || b[0].innerHTML
    },configureIndex: function(a) {
        var b = a.select("dd.index_sort");
        if (b.length === 1) {
            $("object_index_sort").value = b[0].innerHTML
        }
        b = a.select("dd.see");
        if (b.length === 1) {
            $("object_see").value = b[0].innerHTML
        }
        b = a.select("dd.see_also");
        if (b.length === 1) {
            $("object_see_also").value = b[0].innerHTML
        }
    },getParameter: function() {
        var b = this.getElement();
        var a = this.getEditor().serialize(true);
        a.chapter_id = EditorUtil.getChapterId();
        if (!EditorUtil.isNew(b)) {
            a.id = b.getAttribute("id")
        }
        a.version = b.getAttribute("data-version");
        return EditorUtil.surround(b, a)
    },changeType: function(b) {
        this.editor.select(".item").invoke("hide");
        var a = $F("object_type").toLowerCase();
        this.editor.select("." + a).invoke("show");
        b && b.stop()
    }});
editor.base.TableEditor = Class.create(editor.base.AbstractEditor, {makeEditor: function() {
        var a = $("table_editor");
        a.on("click", "#omit_table_caption", this.toggleCaption.bind(this));
        this.getRichEditor().enable(a);
        this.editable = a.down(".editable");
        this.tableController = new editor.table.Controller(this, this.editable);
        return a
    },editorOpened: function(b, a) {
        if (EditorUtil.isNew(a)) {
            b.down("dl").show();
            b.down("header").hide();
            $("table_editor_panel").hide();
            this.editable.update();
            $("table_caption").setValue("");
            $("table_caption").focus()
        }
    },editorClosed: function(b, a) {
        this.tableController.stop()
    },open: function(a) {
        this.element = a;
        var c = {version: a.getAttribute("data-version")};
        var b = a.down().getAttribute("style");
        if (a.down("colgroup")) {
            b = "table-layout: auto;"
        }
        new Ajax.Request("/r/editor/edit_element/" + a.getAttribute("id"), {parameters: c,onSuccess: function(d) {
                if (d.headerJSON && (d.headerJSON.code || d.headerJSON.version)) {
                    new editor.util.Synchronizer(this.controller).show(a, d.headerJSON)
                } else {
                    EditorUtil.openEditor(this.getEditor(), a);
                    this.tableController.start(d.responseText, b, a);
                    this.startExecuter()
                }
            }.bind(this)})
    },save: function($super, a) {
        if (this.editable.up().visible()) {
            $super(a)
        } else {
            this.tableController.buildTable(this.element);
            a.stop()
        }
    },cancel: function($super, a) {
        if (confirm(I18n.get("label.confirm_cancel_of_edit"))) {
            $super(a)
        } else {
            a && a.stop()
        }
    },getParameter: function(c) {
        this.editable.select("caption", "td", "th").each(function(d) {
            d.removeClassName("selected");
            if (d.tagName != "CAPTION") {
                d = d.down()
            }
            d.removeAttribute("contenteditable")
        });
        var a = {chapter_id: EditorUtil.getChapterId(),omit_table_caption: $("omit_table_caption").checked,content: this.getEditorContent()};
        var b = c.getAttribute("data-version");
        if (b) {
            a.version = b
        }
        if (!EditorUtil.isNew(c)) {
            a.id = c.getAttribute("id")
        }
        return EditorUtil.surround(c, a)
    },toggleCaption: function(a) {
        if ($("omit_table_caption").checked) {
            this.editable.select("caption")[0].hide()
        } else {
            this.editable.select("caption")[0].show()
        }
    }});
editor.base.TextEditor = Class.create(editor.base.AbstractEditor, {makeEditor: function() {
        var a = $("text_editor");
        a.down("footer").down("select").on("change", function(b) {
            this.setElementType($F(b.findElement()))
        }.bind(this));
        this.removeLineBreakLink = a.down("footer").down("a.remove_line_break");
        this.removeLineBreakLink.on("click", this.removeLineBreak.bind(this));
        this.editable = a.down(".editable");
        this.elementType = this.editable.next().down("select");
        this.undoManager = new editor.rich.UndoManager(this.editable);
        this.getRichEditor().enable(a);
        return a
    },getElementType: function() {
        return $F(this.elementType)
    },setElementType: function(a) {
        if (a != "") {
            this.elementType.value = a;
            if (a === "code" || a === "command") {
                this.editable.addClassName("monospace")
            } else {
                this.editable.removeClassName("monospace")
            }
        }
    },editorOpened: function(b, a) {
        this.show(a, "");
        this.setElementType("normal")
    },editorClosed: function(c, a, d) {
        this.undoManager.stop();
        if (d) {
            var b = EditorUtil.getType(a);
            if ((b && b.startsWith("heading")) || d.type.startsWith("heading")) {
                _editor.updateOutline()
            }
        }
    },show: function(b, e) {
        var f = b.getAttribute("merge");
        if (f) {
            this.removeLineBreakLink.show()
        } else {
            this.removeLineBreakLink.hide()
        }
        var d = this.getEditor();
        this.editable.update(e);
        if (!EditorUtil.isNew(b)) {
            EditorUtil.openEditor(this.getEditor(), b)
        }
        this.setElementType(EditorUtil.getType(b));
        this.editable.select("a.reference").each(function(g) {
            if (!g.hasClassName("text")) {
                g.setAttribute("contenteditable", "false")
            }
        });
        this.elementType.focus();
        this.editable.focus();
        if (Prototype.Browser.Safari) {
            var c = window.getSelection();
            if (c.rangeCount > 0) {
                var a = c.getRangeAt(0);
                a.collapse(true);
                c.removeAllRanges();
                c.addRange(a)
            }
        }
        EditorUtil.scrollTo(b);
        this.getRichEditor().setUndoManager(this.undoManager)
    },open: function($super, b) {
        this.element = b;
        var c = {};
        var d = b.getAttribute("merge");
        if (d) {
            var a = "/r/editor/merge_elements";
            c.id = d
        } else {
            var a = "/r/editor/edit_element/" + b.getAttribute("id")
        }
        c.version = b.getAttribute("data-version");
        new Ajax.Request(a, {parameters: c,onSuccess: function(e) {
                if (e.headerJSON && (e.headerJSON.code || e.headerJSON.version)) {
                    new editor.util.Synchronizer(this.controller).show(this.element, e.headerJSON)
                } else {
                    this.configureFootnote();
                    this.show(b, e.responseText);
                    this.startExecuter()
                }
            }.bind(this)})
    },getParameter: function(b) {
        if ((this.editable.innerText || this.editable.textContent).blank()) {
            this.editable.focus();
            return
        }
        var a = EditorUtil.getParameter(b);
        var c = b.getAttribute("merge");
        if (c) {
            a.merge = c;
            b.removeAttribute("merge");
            c.split("|").each(function(e, d) {
                if (d > 0) {
                    e = $(e);
                    if (EditorUtil.hasFootnote(e)) {
                        e.next().remove()
                    }
                    e.remove()
                }
            })
        }
        a.type = this.getElementType() || "normal";
        a.content = this.getEditorContent();
        if (a.type === "code" || a.type === "command" || a.type === "pre" || a.type === "blockquote" || a.type === "epigraph") {
            a.content = a.content.gsub("\n", "<br/>")
        } else {
            a.content = a.content.gsub("\n", " ")
        }
        return a
    },removeLineBreak: function(a) {
        var c = this.editable.innerHTML;
        var b = c.gsub(/(<br>)+[*#+ ]*/i, " ");
        if (c !== b) {
            this.undoManager.saveState(true);
            this.editable.innerHTML = b
        }
        a.stop()
    }});
editor.base.VisualEditor = Class.create(visual.base.DataHandler, {initialize: function($super, a) {
        $super("editor");
        this.controller = a
    },open: function(a) {
        this.element = a;
        this.openVisualEditor()
    },getId: function() {
        return this.element.getAttribute("id")
    },getElement: function() {
        return this.element
    },saved: function(b) {
        if (!document.body.hasClassName("chrome")) {
            var a = b.select("img")[0];
            a.src = a.src
        }
        if (b && b.hasClassName("element")) {
            this.controller.selector.select(b);
            window.focus()
        }
        this.controller.showElementTools()
    }});
editor.element.Adder = Class.create({initialize: function(a) {
        this.controller = a;
        this.addHandler = new Element("div", {"class": "add_handler"});
        this.controller.append(this.addHandler);
        this.dragHandler = new Drag(null, this);
        this.addPanel = $("top_panel").down("menu");
        this.addPanel.on("mousedown", "li.add a.link", this.add.bind(this));
        this.addPanel.on("mouseover", "li img", function(d) {
            d.findElement().addClassName("over");
            d.stop()
        });
        var b = function(d) {
            d.findElement().removeClassName("over");
            d.stop()
        };
        this.addPanel.select("li img").each(function(d) {
            d.on("mouseleave", b)
        });
        this.addPanel.on("click", "li.add a.link", function(d) {
            d.stop()
        });
        this.addPanel.on("click", "a.undo", function(d) {
            a.undo();
            d.stop()
        });
        this.addPanel.on("click", "a.redo", function(d) {
            a.redo();
            d.stop()
        });
        var c = new editor.util.Option(a);
        this.addPanel.on("click", "a.option", function(d) {
            c.show();
            d.stop()
        })
    },enable: function() {
        this.addPanel.removeClassName("disabled")
    },disable: function() {
        this.addPanel.addClassName("disabled")
    },cancel: function() {
        if (this.dragHandler.running) {
            this.dragHandler.cancel(function(a) {
                a.removeClassName("over");
                this.controller.endDrag();
                this.addHandler.hide()
            }.bind(this))
        }
    },add: function(a) {
        if (this.addPanel.hasClassName("disabled")) {
            a.stop();
            return
        }
        this.type = EditorUtil.getAction(a);
        this.addHandler.update(a.findElement("a").innerHTML);
        this.dragHandler.configure(a)
    },get: function(a) {
        this.controller.startDrag();
        this.addHandler.setStyle({display: "block"});
        return this.addHandler
    },done: function(d) {
        var b = this.controller;
        b.endDrag();
        this.addHandler.hide();
        var c = b.currentElement;
        if (c) {
            b.addElement(this.type, c)
        } else {
            if (!this.dragHandler.moved) {
                var a = b.selector;
                if (a.isEmpty()) {
                    b.addElement(this.type)
                } else {
                    editor.insertion = "after";
                    b.addElement(this.type, a.last());
                    a.clear()
                }
            }
        }
    }});
editor.element.Mover = Class.create({initialize: function(a) {
        this.controller = a;
        this.dragHandler = new Drag(null, this);
        this.dragHandler.maintainPosition()
    },getMoveHandler: function() {
        if (!this.moveHandler) {
            this.moveHandler = new Element("div", {"class": "move_handler",title: I18n.get("label.move")});
            this.moveHandler.on("mousedown", this.dragHandler.configure.bind(this.dragHandler));
            this.controller.append(this.moveHandler)
        }
        return this.moveHandler
    },enable: function(a) {
        this.getMoveHandler().setStyle({display: "block",top: (a + 2) + "px"})
    },disable: function() {
        this.getMoveHandler().hide()
    },cancel: function() {
        if (this.dragHandler.running) {
            this.dragHandler.cancel(function(a) {
                this.controller.selector.each(function(b) {
                    b.show();
                    if (EditorUtil.hasFootnote(b)) {
                        b.footnote = b.next();
                        b.footnote.show()
                    }
                });
                this.controller.selector.clear()
            }.bind(this))
        }
    },get: function(b) {
        this.controller.startDrag();
        var a = this.controller.currentElement;
        this.beforePrevious = a.previous(".element");
        this.beforeNext = a.next(".element");
        a.addClassName("move");
        if (EditorUtil.hasFootnote(a)) {
            a.footnote = a.next();
            a.footnote.hide()
        }
        this.controller.selector.each(function(c) {
            if (c != a) {
                c.setAttribute("data-visible", c.visible());
                c.hide();
                if (EditorUtil.hasFootnote(c)) {
                    c.footnote = c.next();
                    c.footnote.hide()
                }
                this.beforeNext = c.next(".element")
            }
        }.bind(this));
        return a
    },done: function(b) {
        this.controller.endDrag();
        b.removeClassName("move");
        var a = this.controller.currentElement;
        if (!a || b == a) {
            b.removeAttribute("style");
            return
        }
        var c = a.getLayout();
        var e = c.get("left");
        var d = c.get("top");
        this.targetElements;
        if (EditorUtil.isHeadingType(b) && b.down(".collapsed")) {
            if (confirm(I18n.get("label.move_children_of_heading"))) {
                this.targetElements = new editor.util.Outline().getAllSection(b, this.controller.selector.getAll());
                this.beforeNext = this.targetElements.last().next(".element")
            } else {
                this.targetElements = $A();
                this.targetElements.push(b);
                new editor.util.Outline().expand(b.down(".collapsed"))
            }
        } else {
            if (this.controller.selector.selected()) {
                this.targetElements = this.controller.selector.getAll()
            } else {
                this.targetElements = $A();
                this.targetElements.push(b)
            }
        }
        if (editor.insertion === "after") {
            d += c.get("margin-box-height");
            if (EditorUtil.hasFootnote(a)) {
                d += a.next().getLayout().get("margin-box-height");
                a = a.next()
            }
        }
        b.move(e, d, function() {
            if (editor.insertion === "after" && a.down(".collapsed")) {
                var i = a.next(".element");
                while (i && !i.visible()) {
                    a = i;
                    i = a.next(".element")
                }
                if (EditorUtil.hasFootnote(a)) {
                    a = a.next()
                }
            }
            a.insert(EditorUtil.getInsertion(b));
            var h = b.getAttribute("id");
            var g = this.targetElements.last().getAttribute("id");
            var f = $(h);
            this.targetElements.each(function(j) {
                if (j === b) {
                    if (j.footnote) {
                        if (!j.down(".collapsed")) {
                            j.footnote.show()
                        }
                        j.footnote.remove();
                        f.insert({after: j.footnote});
                        f = f.next();
                        delete j.footnote
                    }
                    return
                }
                if (j.getAttribute("data-visible") === "true") {
                    j.show()
                }
                j.remove();
                f.insert({after: j});
                f = f.next();
                f.removeClassName("over");
                if (j.footnote) {
                    if (j.getAttribute("data-visible") === "true") {
                        j.footnote.show()
                    }
                    j.footnote.remove();
                    f.insert({after: j.footnote});
                    f = f.next();
                    delete j.footnote
                }
            });
            new Ajax.Request("/r/editor/move", {parameters: this.getParameter(h, g),onComplete: function(j) {
                    if (j.headerJSON) {
                        new editor.util.Synchronizer().show(b, j.headerJSON)
                    }
                }});
            this.controller.selector.clear()
        }.bind(this));
        this.controller.getUndoManager().enable()
    },getParameter: function(e, d) {
        var a = {first: e,last: d};
        var c = $(e).previous(".element");
        if (c) {
            a.previous_id = c.getAttribute("id")
        }
        var b = $(d).next(".element");
        if (b) {
            a.next_id = b.getAttribute("id")
        }
        if (this.beforePrevious) {
            a.before_previous_id = this.beforePrevious.getAttribute("id")
        }
        if (this.beforeNext) {
            a.before_next_id = this.beforeNext.getAttribute("id")
        }
        return a
    }});
editor.element.Tool = Class.create({initialize: function(a) {
        this.controller = a;
        this.toolPanel = $("element_panel").down("menu");
        this.toolPanel.on("click", "a", EditorUtil.dispatch.bind(this));
        this.typeUpdateLink = this.toolPanel.down("a.update_type").up();
        this.pasteLink = this.toolPanel.down("a.paste").up();
        this.optionLink = this.toolPanel.down("a.option");
        this.revisionLink = this.toolPanel.down("a.view_revision").up();
        this.copiedElements = $A();
        this.typeUpdater = new editor.element.TypeUpdater(this.controller);
        new PeriodicalExecuter(function(b) {
            if (window.localStorage.getItem("element_copied")) {
                this.pasteLink.removeClassName("disabled")
            } else {
                this.clearCopiedElements()
            }
        }.bind(this), 1)
    },enable: function(b, a) {
        if (this.typeUpdater.enabled()) {
            this.typeUpdateLink.show()
        } else {
            this.typeUpdateLink.hide()
        }
        if (a) {
            this.toolPanel.addClassName("selected")
        } else {
            this.toolPanel.removeClassName("selected")
        }
        this.toolPanel.setStyle({display: "block",top: (b - 25) + "px"});
        this.toggleOption()
    },disable: function() {
        this.toolPanel.hide();
        this.toggleOption()
    },toggleOption: function() {
        if (!this.revisionLink) {
            return
        }
        if (this.controller.selector.isEmpty() || this.controller.selector.singleSelected()) {
            this.revisionLink.removeClassName("disabled")
        } else {
            this.revisionLink.addClassName("disabled")
        }
        this.typeUpdater.hide()
    },edit: function() {
        this.controller.editElement()
    },copy: function() {
        this.clearCopiedElements();
        if (this.controller.selector.selected()) {
            this.controller.selector.each(function(d) {
                this.copiedElements.push(d)
            }.bind(this));
            this.controller.selector.clear()
        } else {
            var c = this.controller.currentElement;
            if (c) {
                this.copiedElements.push(c)
            }
        }
        var a = null;
        var b = this.copiedElements.size();
        this.copiedElements.each(function(e, d) {
            e.addClassName("copy");
            if (d === b - 1) {
                e.addClassName("end_of_copy")
            }
            if (a) {
                a += "|"
            } else {
                a = ""
            }
            a += e.getAttribute("id")
        });
        if (a) {
            window.localStorage.setItem("element_copied", a);
            this.pasteLink.removeClassName("disabled")
        }
    },paste: function(c, a) {
        var e = window.localStorage.getItem("element_copied");
        if (e) {
            a = a || this.controller.selector.last() || this.controller.currentElement;
            if (!a) {
                a = $(e.split("|").last());
                if (!a) {
                    a = this.controller.content.select(".element").last()
                }
            }
            if (a) {
                var b = EditorUtil.getParameter(a);
                b.id = e;
                b.previous_id = a.getAttribute("id");
                var d = a;
                if (a.next() && a.next().hasClassName("footnote")) {
                    d = a.next()
                }
                new Ajax.Updater(d, "/r/editor/copy_element", {parameters: b,insertion: "after",onComplete: function(g) {
                        if (g.headerJSON) {
                            new editor.util.Synchronizer().show(a, g.headerJSON)
                        } else {
                            var h = e.split("|").length;
                            var f = $A();
                            while (h-- > 0) {
                                a = a.next();
                                f.push(a)
                            }
                            new Effect(f).fadeIn()
                        }
                    }})
            } else {
                new Ajax.Updater(this.controller.getElementPanel(), "/r/editor/copy_element", {parameters: {chapter_id: EditorUtil.getChapterId(),id: e}})
            }
            this.clearCopiedElements();
            this.controller.getUndoManager().enable()
        }
    },clearCopiedElements: function() {
        this.copiedElements.each(function(a) {
            a.removeClassName("copy");
            a.removeClassName("end_of_copy")
        });
        this.copiedElements.clear();
        this.pasteLink.addClassName("disabled");
        window.localStorage.removeItem("element_copied")
    },remove: function() {
        var b = this.controller.currentElement;
        if ((!b && !this.controller.selector.selected()) || !I18n.confirm("label.remove_element_confirm")) {
            if (Prototype.Browser.Gecko) {
                window.focus()
            }
            return
        }
        this.clearCopiedElements();
        var a;
        if (this.controller.selector.selected()) {
            a = $A(this.controller.selector.getAll())
        } else {
            a = $A();
            a.push(b)
        }
        var g = [];
        a.each(function(h) {
            g.push(h.getAttribute("id"))
        });
        var f = a.first().previous();
        var d = a.last().next();
        var c = d || f;
        this.controller.selector.setCandidate(c);
        var e = {id: g};
        if (f) {
            e.previous_id = f.getAttribute("id")
        }
        if (d) {
            e.next_id = d.getAttribute("id")
        }
        new Ajax.Request("/r/editor/remove", {parameters: e,onSuccess: function(h) {
                var i = this.controller.content;
                var j = a.size() === i.select(".element").size() ? i : a;
                new Effect(j).fadeOut(function() {
                    a.each(function(k) {
                        if (EditorUtil.hasFootnote(k)) {
                            k.next().remove()
                        }
                        if (!window.getSelection && k.hasClassName("image")) {
                            k.innerHTML = ""
                        }
                        k.remove()
                    });
                    this.controller.selector.clear()
                }.bind(this));
                if (Prototype.Browser.Gecko) {
                    window.focus()
                }
            }.bind(this)});
        this.controller.mouseHandler.disable(true);
        this.controller.getUndoManager().enable()
    },option: function(a) {
        this.controller.getTaskPanel().click(a)
    },view_revision: function(a) {
        if (this.revisionLink.hasClassName("disabled")) {
            return
        }
        this.controller.getTaskPanel().click(a)
    },update_type: function(a) {
        this.typeUpdater.update(a)
    }});
editor.element.TypeUpdater = Class.create({initialize: function(a) {
        this.controller = a;
        this.selector = a.selector
    },enabled: function(a) {
        if (!a) {
            if (this.selector.selected()) {
                a = this.selector.getAll()
            } else {
                if (this.controller.currentElement) {
                    a = $A();
                    a.push(this.controller.currentElement)
                } else {
                    return false
                }
            }
        }
        if (a.size() === 0) {
            return false
        }
        for (var b = 0; b < a.size(); b++) {
            var c = EditorUtil.getType(a[b]);
            if (c === "image" || c === "table" || EditorUtil.isObject(c)) {
                return false
            }
        }
        return true
    },hide: function() {
        this.contextMenu && this.contextMenu.hide()
    },update: function(a) {
        var b = this.getElements();
        if (!b || !this.enabled(b)) {
            return
        }
        window._$target = b;
        this.contextMenu = this.contextMenu || new ContextMenu("element_type_context_menu", this.changeType.bind(this));
        this.contextMenu.show(a.pointerX(), a.pointerY(), EditorUtil.getType(b[0]))
    },getElements: function() {
        var a;
        if (this.selector.selected()) {
            a = this.selector.getAll()
        } else {
            if (this.controller.currentElement) {
                a = $A();
                this.selector.select(this.controller.currentElement);
                a.push(this.controller.currentElement)
            } else {
                return
            }
        }
        return a
    },changeType: function(h) {
        var a = this.controller;
        var f = window._$target;
        var c = h.getAttribute("value");
        var g = this.changed(c, f);
        if (!g.changed) {
            return
        }
        var e = f.last();
        if (EditorUtil.hasFootnote(e)) {
            e = e.next()
        }
        var d = f.first().previous(".element");
        var b = e.next(".element");
        new Ajax.Updater(e, "/r/editor_type/update/" + c, {parameters: {id: g.id,previous_id: d ? d.getAttribute("id") : "",next_id: b ? b.getAttribute("id") : ""},insertion: "after",onComplete: function(i) {
                a.taskPanel.refreshOrClose();
                if (i.headerJSON && i.headerJSON.code) {
                    new editor.util.Synchronizer(a).show(f.first(), i.headerJSON)
                } else {
                    a.getUndoManager().enable();
                    var j = f.last().next(".element");
                    f.each(function(k) {
                        if (EditorUtil.hasFootnote(k)) {
                            k.next().remove()
                        }
                        k.remove()
                    });
                    a.selector.select(j);
                    j.fadeIn();
                    j = j.next(".element");
                    while (j && j !== b) {
                        a.selector.select(j, {shiftKey: true});
                        j = j.next(".element")
                    }
                }
            }})
    },changed: function(b, c) {
        var a = {id: $A(),changed: false};
        c.each(function(d) {
            a.id.push(d.getAttribute("id"));
            if (!a.changed && b !== EditorUtil.getType(d)) {
                a.changed = true
            }
        });
        return a
    }});
var EditorRevisionViewer = Class.create({initialize: function(a, b) {
        this.chapterId = a;
        this.timeInMills = b;
        this.toolPanel = $$("header")[0];
        this.toolPanel.on("click", "a", this.click.bind(this))
    },click: function(b) {
        var a = b.findElement();
        if (a.hasClassName("restore")) {
            this.restoreChapterElements(this.chapterId, this.timeInMills);
            b.stop()
        }
    },restoreChapterElements: function(a, b) {
        if (confirm(I18n.get("message.restore_revision"))) {
            new Ajax.Request("/r/editor_revision/restore_this_version/", {parameters: {chapter_id: a,time_in_mills: b},onSuccess: function(c) {
                    alert(I18n.get("message.restore_completed"));
                    window.opener.location.reload();
                    window.close()
                }})
        }
    }});
editor.rich.RichEditor = Class.create({initialize: function() {
        this.characterRemoveOverlay = new editor.rich.CharacterRemoveOverlay(this);
        this.linkOverlay = new editor.rich.Link(this);
        this.markOverlay = new editor.rich.Mark(this);
        this.noteOverlay = new editor.rich.Note(this);
        this.inlineImageOverlay = new editor.rich.InlineImage(this);
        this.specialOverlay = new editor.rich.SpecialCharacter(this)
    },enable: function(a) {
        var b;
        if (a.getAttribute("id") === "table_editor") {
            b = $("table_editor").down();
            if (!window.getSelection) {
                a.on("keyup", ".editable", function(c) {
                    window._textRange = document.selection.createRange()
                });
                a.on("mouseup", ".editable", function(c) {
                    window._textRange = document.selection.createRange()
                })
            }
        } else {
            b = a.down(".editable").previous()
        }
        b.on("click", "a", this.click.bind(this));
        b.down().on("change", this.setCharacter.bind(this));
        a.on("dblclick", ".editable", this.editableClicked.bind(this));
        a.on("click", ".editable a", function(c) {
            c.stop()
        })
    },click: function(c) {
        if (c.findElement().up("form.disabled")) {
            c.stop();
            return
        }
        if (Prototype.Browser.IE) {
            this.undoManager.editable.focus()
        }
        var b = new BaseRange(true);
        var a = c.pointerX();
        var e = c.pointerY();
        var d = EditorUtil.getAction(c);
        if (d === "link") {
            this.openLinkOverlay(a, e, b)
        } else {
            if (d === "mark") {
                this.openMarkOverlay(a, e, b)
            } else {
                if (d === "note") {
                    this.openNoteOverlay(a, e, b)
                } else {
                    if (d === "inline_image") {
                        this.openImageOverlay(a, e, b)
                    } else {
                        if (d === "special_character") {
                            this.openSpecialOverlay(a, e, b)
                        } else {
                            if (d === "clear_format") {
                                this.clearFormat()
                            } else {
                                if (d === "undo") {
                                    this.undoManager.undo()
                                } else {
                                    if (d === "redo") {
                                        this.undoManager.redo()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        c.stop()
    },editableClicked: function(e) {
        var d = e.findElement();
        var f = d.getStyle("display");
        if (f === "inline" || f === "inline-block") {
            var a = e.pointerX();
            var g = e.pointerY();
            var b = new BaseRange(true);
            var c = d.tagName;
            if (this.linkClicked(d)) {
                if (c !== "A") {
                    d = d.up()
                }
                this.openLinkOverlay(a, g, b, d)
            } else {
                if (d.hasClassName("mark")) {
                    this.openMarkOverlay(a, g, b, d)
                } else {
                    if (c === "CITE") {
                        this.openNoteOverlay(a, g, b, d)
                    } else {
                        this.characterRemoveOverlay.open(a, g, b, d)
                    }
                }
            }
        }
        e.stop()
    },linkClicked: function(b) {
        var a = b.tagName;
        if (a === "A") {
            return true
        }
        var c = b.up();
        if (c && c.tagName === "A") {
            return true
        }
        return false
    },openLinkOverlay: function(a, d, b, c) {
        if (c) {
            this.linkOverlay.update(a, d, b, c)
        } else {
            this.linkOverlay.create(a, d, b)
        }
    },openMarkOverlay: function(a, d, b, c) {
        if (c) {
            this.markOverlay.update(a, d, b, c)
        } else {
            this.markOverlay.create(a, d, b)
        }
    },openNoteOverlay: function(a, d, b, c) {
        if (c) {
            this.noteOverlay.update(a, d, b, c)
        } else {
            this.noteOverlay.create(a, d, b)
        }
    },openImageOverlay: function(a, c, b) {
        this.inlineImageOverlay.show(a, c, b)
    },openSpecialOverlay: function(a, c, b) {
        this.specialOverlay.show(a, c, b)
    },enableEditor: function() {
        var a = this.undoManager.editable;
        if (!a.down("table")) {
            a.contentEditable = true
        }
        var b = a.up("form");
        b.removeClassName("disabled");
        b.select("select, button").each(function(c) {
            c.disabled = false
        })
    },disableEditor: function() {
        var a = this.undoManager.editable;
        var b = a.up("form");
        b.addClassName("disabled");
        b.select("select, button").each(function(c) {
            c.disabled = true
        })
    },setCharacter: function(c) {
        var b = c.findElement();
        var d = $F(b);
        if (d != "") {
            var a = new BaseRange(true);
            if (!a.isEditable() || a.isEmpty()) {
                alert(I18n.get("label.select_range_to_set_character_style"));
                a.focus()
            } else {
                this.saveState(true);
                if (d.startsWith("r_") || d === "callout") {
                    a.surround("span", {"class": d})
                } else {
                    a.surround(d)
                }
            }
            b.value = ""
        }
        c.stop()
    },removeCharacter: function(a) {
        this.characterRemoveOverlay.remove(null, a)
    },clearFormat: function() {
        this.saveState();
        var a = this.undoManager.editable;
        a.select("iframe").invoke("remove");
        a.select("span.mark").invoke("remove");
        a.select("sup").invoke("remove");
        a.select("cite").invoke("remove");
        if (a.down() && (a.down().tagName === "TABLE")) {
            a.select("th, td").each(function(b) {
                b = b.down();
                b.innerHTML = this.toPlain(b)
            }.bind(this))
        } else {
            a.innerHTML = this.toPlain(a)
        }
    },toPlain: function(a) {
        var c = "";
        var b = function(d) {
            if (d.nodeType === 3) {
                if (d.nodeValue === "\n") {
                    c += "<br>"
                } else {
                    c += d.nodeValue.escapeHTML()
                }
            } else {
                if (d.tagName === "IMG") {
                    c += '<img src="' + d.getAttribute("src") + '"/>'
                } else {
                    if (d.tagName === "BR") {
                        c += "<br>"
                    } else {
                        if (d.nodeType === 1) {
                            if (d.getStyle("display") === "block" && c !== "") {
                                c += "<br>"
                            }
                            $A(d.childNodes).each(b)
                        }
                    }
                }
            }
        };
        $A(a.childNodes).each(b);
        return c
    },saveState: function(a) {
        this.undoManager.saveState(a)
    },getUndoManager: function() {
        return this.undoManager
    },setUndoManager: function(a) {
        if (this.undoManager) {
            this.undoManager.stop()
        }
        this.undoManager = a;
        if (this.undoManager) {
            this.undoManager.start()
        }
    },closeOverlay: function(a) {
        this[a.gsub("_", "-").camelize()].close()
    }});
editor.rich.AbstractRichOverlay = Class.create({initialize: function(a) {
        this.richEditor = a;
        this.overlay = this.makeOverlay();
        this.overlay.insert(new Element("div", {"class": "close"}));
        this.overlay.on("click", "div.close", this.close.bind(this));
        this.overlay.down("header").on("mousedown", this.moveOverlay.bind(this))
    },show: function(a, c, b) {
        this.range = b;
        if (!b.isEditable()) {
            alert(I18n.get("label.set_cursor_to_editor"))
        } else {
            this.showOverlay(a, c)
        }
    },showOverlay: function(a, c) {
        this.getRichEditor().disableEditor();
        var b = document.viewport.getScrollOffsets().top + document.viewport.getHeight() - this.overlay.getLayout().get("margin-box-height");
        if (c > b) {
            c = b
        }
        c -= 20;
        this.overlay.setStyle({display: "block",left: "300px",top: c + "px"});
        this.overlayOpened && this.overlayOpened()
    },moveOverlay: function(b) {
        if (b.findElement().tagName === "SELECT") {
            return
        }
        document.body.style.cursor = "move";
        var e = this.overlay;
        var h = e.getLayout();
        var d = Number(e.getStyle("left").replace("px", ""));
        var j = Number(e.getStyle("top").replace("px", ""));
        var g = b.pointerX();
        var f = b.pointerY();
        var c = {};
        var i = document.on("mousemove", function(n) {
            var k = n.pointerX();
            var o = n.pointerY();
            var m = k - g;
            var l = o - f;
            d += m;
            j += l;
            c.left = Math.max(0, d) + "px";
            c.top = Math.max(0, j) + "px";
            e.setStyle(c);
            g = k;
            f = o;
            n.stop()
        });
        var a = document.on("mouseup", function(k) {
            document.body.style.cursor = "auto";
            i.stop();
            a.stop();
            k.stop()
        });
        b.stop()
    },close: function(a) {
        this.getOverlay().hide();
        this.overlayClosed && this.overlayClosed();
        this.richEditor.enableEditor();
        a && a.stop();
        if (this.range) {
            this.range.focus();
            delete this.range
        }
    },getOverlay: function() {
        return this.overlay
    },getRange: function() {
        return this.range
    },getRichEditor: function() {
        return this.richEditor
    },saveState: function() {
        this.richEditor.saveState(true)
    }});
editor.rich.CharacterRemoveOverlay = Class.create(editor.rich.AbstractRichOverlay, {makeOverlay: function() {
        var a = $("character_remove_overlay");
        a.on("click", "a.remove", function(b) {
            this.remove(b, null)
        }.bind(this));
        this.type = a.down("span");
        return a
    },open: function(b, e, c, d) {
        this.element = d;
        var a = d.tagName.toLowerCase();
        if (a === "img") {
            a = I18n.get("label.image")
        }
        this.type.update(a);
        this.show(b, e, c)
    },show: function(a, d, b, c) {
        this.range = b;
        this.showOverlay(a, d)
    },remove: function(e, c) {
        c = c || this.element;
        if (c) {
            this.saveState();
            var a = c.childNodes;
            var f = c;
            for (var b = 0; b < a.length; b++) {
                if (a[b].nodeType == 3) {
                    var d = document.createTextNode(a[b].textContent || a[b].toString());
                    c.parentNode.insertBefore(d, c)
                } else {
                    var d = document.createElement(a[b].tagName);
                    if (d.tagName === "IMG") {
                        d.setAttribute("src", a[b].getAttribute("src"))
                    } else {
                        d.setAttribute("class", a[b].className);
                        d.innerHTML = a[b].innerHTML
                    }
                    c.parentNode.insertBefore(d, c)
                }
            }
            c.parentNode.removeChild(c);
            delete this.element
        }
        e && this.close(e)
    }});
editor.rich.File = Class.create({initialize: function(a) {
        $("link_file").on("change", this.upload.bind(this));
        this.uploader = new Uploader("file", a, this.updateCompleted.bind(this));
        this.panel = $("file_list");
        this.panel.on("click", ".simple_tool", this.clickTool.bind(this));
        this.controllerUrl = "/r/editor_link_file/"
    },clickTool: function(b) {
        var a = b.findElement("a");
        if (a) {
            if (a.hasClassName("selected")) {
            } else {
                if (a.hasClassName("to_book_file")) {
                    this.loadBookFilePanel()
                } else {
                    if (a.hasClassName("to_owner_file")) {
                        this.loadOwnerFilePanel()
                    }
                }
            }
        }
        b.stop()
    },upload: function(a) {
        this.uploader.upload();
        a.stop()
    },updateCompleted: function() {
        this.loadOwnerFilePanel()
    },load: function() {
        this.loadBookFilePanel()
    },loadBookFilePanel: function() {
        var b = EditorUtil.getChapterId();
        var a = this.controllerUrl + "list_book_file/" + b;
        new Ajax.Updater(this.panel, a, {insertion: "bottom",onComplete: function(c) {
                this.clearOld();
                new TableUI("book_file_list", {click: this.clickList.bind(this),url: this.controllerUrl + "sort_book_file/" + b,getPath: function(e, d) {
                        return this.controllerUrl + "page_book_file/" + b + "/" + e
                    }.bind(this)});
                this.status = "book_file"
            }.bind(this)})
    },loadOwnerFilePanel: function() {
        var b = EditorUtil.getChapterId();
        var a = this.controllerUrl + "list_owner_file/" + b;
        new Ajax.Updater(this.panel, a, {insertion: "bottom",onComplete: function(c) {
                this.clearOld();
                new TableUI("owner_file_list", {click: this.clickList.bind(this),url: this.controllerUrl + "sort_owner_file/" + b,getPath: function(e, d) {
                        return this.controllerUrl + "page_owner_file/" + b + "/" + e
                    }.bind(this)});
                this.status = "owner_file"
            }.bind(this)})
    },clearOld: function() {
        if (this.panel.down().next()) {
            this.panel.down().remove()
        }
    },clickList: function(d) {
        var c = d.findElement("a");
        if (c) {
            if (c.hasClassName("exclude")) {
                var a = this.getFileIdWithLocation(c);
                this.exclude(a)
            } else {
                if (c.hasClassName("remove")) {
                    if (confirm(I18n.get("label.confirm_remove"))) {
                        var a = c.up("tr").readAttribute("id");
                        new Ajax.Request("/r/file/remove/" + a, {onSuccess: function() {
                                this.loadOwnerFilePanel()
                            }.bind(this)})
                    }
                } else {
                    if (c.hasClassName("download")) {
                        var b;
                        if (this.status === "book_file") {
                            b = "/r/book_file/download/" + EditorUtil.getChapterId() + "_"
                        } else {
                            b = "/r/file/download/"
                        }
                        var a = this.getFileIdWithLocation(c);
                        b += a;
                        window.location.href = b
                    }
                }
            }
        }
        d.stop()
    },exclude: function(a) {
        var c = EditorUtil.getChapterId();
        var b = this.controllerUrl + "exclude/" + c + "/" + a;
        new Ajax.Request(b, {onSuccess: function() {
                this.loadBookFilePanel()
            }.bind(this)})
    },getFileIdWithSelect: function(e) {
        var d = $R(this.panel, "file_for_link");
        if (!d) {
            return undefined
        }
        var a = this.getFileIdWithLocation(d);
        if (a && e) {
            var c = EditorUtil.getChapterId();
            var b = this.controllerUrl + "include/" + c + "/" + a;
            new Ajax.Request(b)
        }
        return a
    },getFileIdWithLocation: function(a) {
        return a.up("tr").readAttribute("id")
    }});
editor.rich.InlineImage = Class.create(editor.rich.AbstractRichOverlay, {makeOverlay: function() {
        this.mode = "file";
        var a = $("inline_image_overlay");
        a.select("input[name='mode']")[0].checked = true;
        a.on("click", "input[name='mode']", this.toggle.bind(this));
        a.on("click", "a.add", this.add.bind(this));
        a.on("submit", this.add.bind(this));
        $("inline_image_file").on("change", this.add.bind(this));
        new editor.rich.ReferencedInlineImage(this);
        return a
    },overlayOpened: function() {
        $("inline_image_file").value = "";
        $("inline_image_url").value = "";
        if (this.mode === "url") {
            $("inline_image_url").focus()
        }
        if (!this.clipboard) {
            this.clipboard = new Clipboard("inline_image_overlay", function(a) {
                this.getRange().insertNode("img", {src: "/r/image/get/" + a});
                this.close()
            }.bind(this))
        }
        this.clipboard.start()
    },overlayClosed: function() {
        this.clipboard && this.clipboard.stop()
    },toggle: function(b) {
        this.mode = b ? $F(b.findElement()) : this.mode;
        var a = this.getOverlay();
        a.select(".item").invoke("hide");
        a.select("." + this.mode).invoke("show");
        this.overlayOpened()
    },add: function(a) {
        this.saveState();
        if (this.mode === "file") {
            this.uploader = this.uploader || new Uploader("editor_inline_image", this.getOverlay(), this.uploadCompleted.bind(this));
            this.uploader.upload()
        } else {
            var b = $F("inline_image_url");
            if (!b.empty()) {
                this.range.insertNode("img", {src: b}, null, true, false)
            }
            this.close()
        }
        a && a.stop()
    },addReference: function(a) {
        this.getRange().insertNode("img", {src: a});
        this.close()
    },uploadCompleted: function() {
        this.addReference("/r/image/get/" + this.uploader.getUuid())
    }});
editor.rich.ReferencedInlineImage = Class.create({initialize: function(b) {
        this.inlineImage = b;
        var a = new editor.util.BookElementSelector({books: $("inline_image_book_id"),chapters: $("inline_image_chapter_id"),panel: $("inline_image_panel"),path: "/r/figure/get_inline_image",selectElement: this.selectElement.bind(this),})
    },selectElement: function(a) {
        element = a.findElement();
        this.inlineImage.addReference(element.getAttribute("src"));
        a.stop()
    }});
editor.rich.Link = Class.create(editor.rich.AbstractRichOverlay, {makeOverlay: function() {
        this.mode = "doc";
        var a = $("link_overlay");
        a.on("click", "input[name='mode']", this.toggle.bind(this));
        var b = a.down("footer");
        b.on("click", "a.add", this.link.bind(this));
        b.on("click", "a.remove", this.remove.bind(this));
        b.on("click", "a.refresh", this.refresh.bind(this));
        $("link_enable_text").on("click", this.enableText.bind(this));
        this.chapters = $("link_chapters");
        this.chapters.on("change", this.loadPanel.bind(this));
        this.bookPanel = $("link_book_panel");
        this.bookPanel.on("click", "input", this.selectCrossReference.bind(this));
        this.file = new editor.rich.File(a);
        return a
    },overlayOpened: function() {
        if (this.shortcut) {
            this.shortcut.start()
        } else {
            this.shortcut = new Shortcut(document);
            this.shortcut.bind("return", function(c, a, b) {
                this.link(b)
            }.bind(this))
        }
        this.clearBookPanel()
    },clearBookPanel: function() {
        this.bookPanel.select("input[type=radio]").each(function(a) {
            if (a.checked) {
                a.checked = false
            }
        })
    },overlayClosed: function() {
        this.shortcut.stop()
    },toggle: function(b) {
        var c = b ? $F(b.findElement()) : this.mode;
        var a = this.getOverlay();
        a.down("section").select("> div").each(function(f) {
            var d = f.className;
            if (f.hasClassName(c)) {
                f.show()
            } else {
                f.hide()
            }
        });
        if (c === "file") {
            a.addClassName("extended");
            this.file.load()
        } else {
            a.removeClassName("extended")
        }
        this.mode = c;
        this.focus()
    },loadChapters: function() {
        if (this.bookPanelLoaded) {
            return
        }
        this.bookPanelLoaded = true;
        var a = function(b) {
            b.responseJSON.each(function(c) {
                var d = c[1];
                if (c[2] === "true") {
                    d = "- " + d
                }
                this.chapters.options[this.chapters.options.length] = new Option(d, c[0])
            }.bind(this))
        }.bind(this);
        new Ajax.Request("/r/editor_link/get_chapters/" + EditorUtil.getChapterId(), {onSuccess: a})
    },refresh: function(a) {
        this.bookPanelLoaded = false;
        this.chapters.options.length = 0;
        this.loadChapters();
        a.stop()
    },loadPanel: function(a) {
        var b = $F(this.chapters);
        if (b === "") {
            this.chapters.next().update()
        } else {
            new Ajax.Updater(this.bookPanel, "/r/editor_link/display_panel/" + b)
        }
        a.stop()
    },selectCrossReference: function(b) {
        var a = b.findElement();
        if (a.checked) {
            this.uuid = a.value;
            if (!$("link_enable_text").checked) {
                $("link_text").value = a.up().innerText || a.up().textContent
            }
        }
    },create: function(a, c, b) {
        delete this.uuid;
        delete this.currentElement;
        $("link_url").value = "";
        $("link_email").value = "";
        this.initialText = b.getText();
        $("link_text").value = this.initialText;
        $("link_text").disabled = true;
        $("link_enable_text").checked = false;
        this.getOverlay().select("footer")[0].select("a.link")[0].update(I18n.get("label.add"));
        this.getOverlay().select("footer")[0].select("a.remove")[0].hide();
        this.show(a, c, b)
    },update: function(a, f, c, e) {
        delete this.uuid;
        this.currentElement = e;
        var d = this.getOverlay();
        $("link_url").value = "";
        $("link_email").value = "";
        $("link_text").value = e.innerHTML;
        $("link_text").disabled = !e.hasClassName("text");
        $("link_enable_text").checked = e.hasClassName("text");
        var b = e.getAttribute("href");
        if (b.startsWith("http") || b.startsWith("ftp") || b.startsWith("file")) {
            this.mode = "url";
            d.select("input[name='mode']")[1].checked = true;
            $("link_url").value = b
        } else {
            if (b.startsWith("/r/file/download/")) {
                d.select("input[name='mode']")[2].checked = true;
                this.mode = "file"
            } else {
                if (b.startsWith("mailto:")) {
                    this.mode = "email";
                    d.select("input[name='mode']")[3].checked = true;
                    $("link_email").value = b.replace("mailto:", "")
                } else {
                    d.select("input[name='mode']")[0].checked = true;
                    this.mode = "doc"
                }
            }
        }
        d.select("footer")[0].select("a.link")[0].update(I18n.get("label.update"));
        d.select("footer")[0].select("a.remove")[0].show();
        this.show(a, f, c, e);
        this.toggle()
    },show: function(a, d, b, c) {
        this.range = b;
        if (!c && !this.range.isEditable()) {
            alert(I18n.get("label.select_range_to_link"))
        } else {
            this.showOverlay(a, d);
            this.focus()
        }
    },focus: function() {
        if (this.mode === "doc") {
            this.loadChapters();
            this.chapters.focus()
        } else {
            if (this.mode === "url") {
                $("link_url").select()
            } else {
                if (this.mode === "email") {
                    $("link_email").select()
                }
            }
        }
    },link: function(f) {
        var c;
        this.saveState();
        if (this.mode === "doc") {
            var d = $F("link_text");
            var a = "reference";
            var b = $("link_enable_text").checked;
            if (b) {
                a = "reference text"
            }
            if (this.uuid) {
                c = "#" + this.uuid;
                if (this.currentElement) {
                    this.currentElement.href = c;
                    this.currentElement.innerHTML = d;
                    this.currentElement.setAttribute("class", a);
                    if (b) {
                        this.currentElement.removeAttribute("contenteditable")
                    } else {
                        this.currentElement.setAttribute("contenteditable", "false")
                    }
                } else {
                    this.range.surround("a", {"class": a,href: c}, d)
                }
            } else {
                if (this.currentElement) {
                    if (b) {
                        this.currentElement.innerHTML = d;
                        this.currentElement.setAttribute("class", a);
                        this.currentElement.removeAttribute("contenteditable")
                    } else {
                        this.currentElement.innerHTML = d;
                        this.currentElement.setAttribute("class", a);
                        this.currentElement.setAttribute("contenteditable", "false")
                    }
                }
            }
        } else {
            if (this.mode === "file") {
                var g = this.file.getFileIdWithSelect(true);
                if (!g) {
                    alert(I18n.get("message.not_selected_file"));
                    return
                }
                c = "/r/file/download/" + g
            } else {
                if (this.mode === "email") {
                    c = "mailto:" + $F("link_email")
                } else {
                    c = $F("link_url");
                    if (!c.startsWith("http") && !c.startsWith("ftp") && !c.startsWith("file")) {
                        c = "http://" + c
                    }
                }
            }
            if (c && !c.empty()) {
                if (this.currentElement) {
                    this.currentElement.href = c;
                    var e = this.currentElement.textContent || this.currentElement.innerText;
                    if (e && (e.startsWith("http") || e.startsWith("ftp") || e.startsWith("file"))) {
                        this.currentElement.update(c)
                    }
                    this.currentElement.setAttribute("class", "link");
                    this.currentElement.setAttribute("contenteditable", "true")
                } else {
                    if (this.range.isEmpty()) {
                        var d;
                        switch (this.mode) {
                            case "email":
                                d = $F("link_email");
                                break;
                            case "file":
                                d = I18n.get("label.attachments");
                                break;
                            default:
                                d = $F("link_url");
                                break
                        }
                        this.range.surround("a", {"class": "link",href: c}, d)
                    } else {
                        this.range.surround("a", {"class": "link",href: c})
                    }
                }
            }
        }
        this.close(f)
    },enableText: function(a) {
        $("link_text").disabled = !a.findElement().checked
    },remove: function(a) {
        this.getRichEditor().removeCharacter(this.currentElement);
        this.close(a)
    }});
editor.rich.Mark = Class.create(editor.rich.AbstractRichOverlay, {create: function(a, c, b) {
        delete this.currentElement;
        this.getOverlay().select("a.mark")[0].update(I18n.get("label.add"));
        this.getOverlay().select("a.remove")[0].hide();
        this.show(a, c, b)
    },update: function(a, d, b, c) {
        this.currentElement = c;
        this.getOverlay().select("a.mark")[0].update(I18n.get("label.update"));
        this.getOverlay().select("a.remove")[0].show();
        this.show(a, d, b)
    },makeOverlay: function() {
        var a = $("mark_overlay");
        a.on("click", "a.mark", this.mark.bind(this));
        a.on("click", "a.remove", this.remove.bind(this));
        a.on("submit", this.mark.bind(this));
        this.textField = $("re_mark_text");
        return a
    },overlayOpened: function() {
        this.textField.value = this.currentElement ? this.currentElement.innerHTML : this.getRange().getText();
        this.textField.focus();
        if (this.shortcut) {
            this.shortcut.start()
        } else {
            this.shortcut = new Shortcut(document);
            this.shortcut.bind("return", function(c, a, b) {
                this.mark(b)
            }.bind(this))
        }
    },overlayClosed: function() {
        this.shortcut.stop()
    },mark: function(a) {
        var b = $F(this.textField);
        if (!b.empty()) {
            this.saveState();
            if (this.currentElement) {
                this.currentElement.innerHTML = b
            } else {
                this.getRange().insertNode("span", {"class": "mark index"}, b, true, true)
            }
        }
        this.close(a)
    },remove: function(a) {
        this.currentElement.remove();
        this.close(a)
    }});
editor.rich.Note = Class.create(editor.rich.AbstractRichOverlay, {makeOverlay: function() {
        var a = $("note_overlay");
        a.on("click", "a.note", this.note.bind(this));
        a.on("click", "a.remove", this.remove.bind(this));
        this.getRichEditor().enable(a);
        this.editable = a.down(".editable");
        this.undoManager = new editor.rich.UndoManager(this.editable);
        return a
    },overlayOpened: function() {
        var a = this.getRichEditor();
        this.openerUndoManager = a.getUndoManager();
        a.setUndoManager(this.undoManager);
        this.editable.focus()
    },overlayClosed: function() {
        this.getRichEditor().setUndoManager(this.openerUndoManager)
    },create: function(a, c, b) {
        delete this.currentElement;
        this.editable.update();
        this.getOverlay().select("a.note")[0].update(I18n.get("label.add"));
        this.getOverlay().select("a.remove")[0].hide();
        this.show(a, c, b)
    },update: function(a, d, b, c) {
        this.currentElement = c;
        this.editable.update(c.down().innerHTML);
        this.getOverlay().select("a.note")[0].update(I18n.get("label.update"));
        this.getOverlay().select("a.remove")[0].show();
        this.show(a, d, b)
    },note: function(a) {
        var b = this.editable.innerHTML;
        if (!b.empty()) {
            b = b.gsub("<br>", " ");
            b = b.gsub("<div>", " ").gsub("</div>", "");
            b = b.gsub("<P>", " ").gsub("</P>", "");
            this.openerUndoManager.saveState();
            if (this.currentElement) {
                this.currentElement.down().innerHTML = b
            } else {
                this.range.insertNode("cite", {}, "<span>" + b + "</span>", true, true)
            }
        }
        this.close(a)
    },remove: function(a) {
        this.currentElement.remove();
        this.close(a)
    }});
editor.rich.Shortcut = Class.create({initialize: function(a) {
        this.undoManager = a;
        this.shortcut = new Shortcut(a.editable || document);
        this.contextMenuShortcut = "ctrl_space";
        if (window.navigator.userAgent.indexOf("Linux") != -1) {
            this.contextMenuShortcut = "alt_/"
        } else {
            if (window.navigator.userAgent.indexOf("Mac") != -1) {
                this.contextMenuShortcut = "alt_/"
            }
        }
    },enable: function() {
        this.shortcut.bind("return", this.breakLine.bind(this));
        this.shortcut.bind("ctrl_v", this.saveState.bind(this));
        this.shortcut.bind("ctrl_x", this.saveState.bind(this));
        this.shortcut.bind("ctrl_y", this.redo.bind(this));
        this.shortcut.bind("ctrl_z", this.undo.bind(this));
        this.shortcut.bind("backspace", this.saveState.bind(this));
        this.shortcut.bind("delete", this.saveState.bind(this));
        this.shortcut.bind("up", this.move.bind(this));
        this.shortcut.bind("down", this.move.bind(this));
        this.shortcut.bind("left", this.move.bind(this));
        this.shortcut.bind("right", this.move.bind(this));
        this.shortcut.bind(this.contextMenuShortcut, this.showCharacterList.bind(this));
        this.shortcut.bind("ctrl_/", this.showElementTypeList.bind(this))
    },disable: function() {
        this.shortcut.unbind("return", "ctrl_v", "ctrl_x", "ctrl_y", "ctrl_z", "backspace", "delete", "up", "down", "left", "right", this.contextMenuShortcut, "ctrl_/")
    },keydown: function(c) {
        if (!this.moved) {
            return
        }
        var b = c.keyCode;
        if (b === 16 || b === 17 || b === 18) {
            return
        }
        if (c.ctrlKey) {
            return
        }
        var a = Shortcut.functionKey[b];
        if (!a) {
            delete this.moved;
            this.undoManager.saveState(true)
        }
    },breakLine: function(c, a, b) {
        var d = $$(".re_overlay", ".context_menu").find(function(e) {
            if (e.visible()) {
                return e
            }
        });
        if (d) {
            return "ignore"
        }
        this.undoManager.saveState(true);
        return "ignore"
    },undo: function(c, a, b) {
        this.undoManager.undo()
    },redo: function(c, a, b) {
        this.undoManager.redo()
    },move: function(c, a, b) {
        this.moved = true;
        if (a === "left") {
            this.cursor = this.cursor || new editor.util.Cursor();
            this.cursor.refresh();
            if (this.cursor.enabled()) {
                if (this.cursor.startTagReached()) {
                    this.cursor.addSpaceToFront()
                } else {
                    if (this.cursor.startFootnoteReached()) {
                        this.cursor.addSpaceToFootnote(true)
                    }
                }
            }
        } else {
            if (a === "right") {
                this.cursor = this.cursor || new editor.util.Cursor();
                this.cursor.refresh();
                if (this.cursor.enabled()) {
                    if (this.cursor.endTagReached()) {
                        this.cursor.addSpaceToEnd()
                    } else {
                        if (this.cursor.endFootnoteReached()) {
                            this.cursor.addSpaceToFootnote()
                        }
                    }
                }
            }
        }
        return "ignore"
    },saveState: function(c, a, b) {
        this.undoManager.saveState(true);
        return "ignore"
    },getRange: function() {
        if (window.getSelection) {
            var a = window.getSelection();
            return a.rangeCount > 0 ? a.getRangeAt(0) : null
        } else {
            if (Prototype.Browser.IE) {
                return document.selection.createRange()
            }
        }
    },showCharacterList: function(c, a, b) {
        this.range = new BaseRange();
        this.offset = this.range.getOffset();
        this.characterContextMenu = this.characterContextMenu || new ContextMenu("character_context_menu", function(f) {
            var h = f.getAttribute("value");
            var g = _editor.getRichEditor();
            var d = this.offset.left;
            var i = this.offset.top;
            if (h === "remove_character_style") {
                var e = this.range.getOuter();
                if (e && e.getStyle("display") === "inline") {
                    g.saveState();
                    this.range.removeTag(e);
                    this.range.focus()
                }
            } else {
                if (h === "add_link") {
                    var e = this.range.getOuter();
                    if (e.tagName === "A") {
                        g.openLinkOverlay(d, i, this.range, $(e))
                    } else {
                        g.openLinkOverlay(d, i, this.range)
                    }
                } else {
                    if (h === "add_mark") {
                        g.openMarkOverlay(d, i, this.range)
                    } else {
                        if (h === "add_note") {
                            var e = this.range.getOuter();
                            if (e.tagName === "CITE") {
                                g.openNoteOverlay(d, i, this.range, $(e))
                            } else {
                                g.openNoteOverlay(d, i, this.range)
                            }
                        } else {
                            if (h === "add_inline_image") {
                                g.openImageOverlay(d, i, this.range)
                            } else {
                                if (h === "add_special") {
                                    g.openSpecialOverlay(d, i, this.range)
                                } else {
                                    if (!this.range.isEmpty()) {
                                        _editor.getRichEditor().saveState(true);
                                        if (h === "callout" || h.startsWith("r_")) {
                                            this.range.surround("span", {"class": h})
                                        } else {
                                            this.range.surround(h)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }.bind(this));
        this.characterContextMenu.show(this.offset.left, this.offset.top + 20)
    },showElementTypeList: function(e, c, d) {
        if (!document.activeElement || !document.activeElement.up("#text_editor")) {
            return
        }
        this.range = new BaseRange();
        var b = _editor.getOpenedEditor();
        this.elementTypeContextMenu = this.elementTypeContextMenu || new ContextMenu("element_type_context_menu", function(g) {
            b.setElementType(g.getAttribute("value"))
        }.bind(this));
        var f = this.range.getOffset();
        var a = b.getElementType();
        this.elementTypeContextMenu.show(f.left, f.top + 20, a)
    }});
editor.rich.SpecialCharacter = Class.create(editor.rich.AbstractRichOverlay, {makeOverlay: function() {
        var a = $("special_overlay");
        a.on("mouseover", this.over.bind(this));
        a.on("click", "td", this.insert.bind(this));
        this.select(a.select("td")[1]);
        return a
    },overlayOpened: function() {
        if (this.shortcut) {
            this.shortcut.start()
        } else {
            this.shortcut = new Shortcut(document);
            this.shortcut.bind("return", this.enter.bind(this));
            this.shortcut.bind("up", this.up.bind(this));
            this.shortcut.bind("right", this.right.bind(this));
            this.shortcut.bind("down", this.down.bind(this));
            this.shortcut.bind("left", this.left.bind(this))
        }
    },overlayClosed: function() {
        this.shortcut.stop()
    },over: function(a) {
        this.select(a.findElement("td[id]"))
    },up: function(d, b, c) {
        var e = this.selected.up();
        var a = this.getCellIndex(e);
        var e = e.previous() || e.up().childElements().last();
        this.select(e.childElements()[a])
    },down: function(d, b, c) {
        var e = this.selected.up();
        var a = this.getCellIndex(e);
        var e = e.next() || e.up().childElements().first();
        this.select(e.childElements()[a])
    },getCellIndex: function(c) {
        var a = c.childElements();
        for (var b = 0; b < a.size(); b++) {
            if (this.selected === a[b]) {
                return b
            }
        }
    },left: function(d, b, c) {
        var a = this.selected.previous();
        this.select(a || this.selected.up().childElements().last())
    },right: function(d, b, c) {
        var a = this.selected.next();
        this.select(a || this.selected.up().childElements().first())
    },select: function(a) {
        if (a) {
            this.selected && this.selected.removeClassName("selected");
            this.selected = a;
            this.selected.addClassName("selected")
        }
    },enter: function(c, a, b) {
        this.addCharacter(this.selected)
    },insert: function(a) {
        this.addCharacter(a.findElement(), a)
    },addCharacter: function(a, b) {
        this.saveState();
        var c = a.innerHTML;
        if (c === "&nbsp;") {
            c = " "
        } else {
            if (c === "&amp;") {
                c = "&"
            } else {
                if (c === "&lt;") {
                    c = "<"
                } else {
                    if (c === "&gt;") {
                        c = ">"
                    }
                }
            }
        }
        this.getRange().insertText(c, true);
        this.close()
    }});
editor.rich.UndoManager = Class.create({initialize: function(a) {
        this.editable = a;
        this.undoButton = this.editable.up("form").down("a.undo");
        this.redoButton = this.editable.up("form").down("a.redo");
        this.undoStates = $A();
        this.redoStates = $A();
        this.shortcut = new editor.rich.Shortcut(this)
    },start: function() {
        if (!this.clickHandler) {
            this.enable();
            this.initalState = this.editable.innerHTML;
            this.clickHandler = this.editable.on("click", function(a) {
                this.shortcut.moved = true
            }.bind(this));
            this.keydownHandler = this.editable.on("keydown", function(b) {
                if (!b.altKey && !b.shiftKey) {
                    var a = b.keyCode;
                    if (!b.ctrlKey || a === 86) {
                        if (Shortcut.keyboard[a]) {
                            this.undoButton.addClassName("enable")
                        }
                        this.shortcut.keydown(b)
                    }
                }
            }.bind(this))
        }
    },stop: function() {
        if (this.clickHandler) {
            this.disable();
            this.clear();
            this.clickHandler.stop();
            delete this.clickHandler;
            this.keydownHandler.stop();
            delete this.keydownHandler
        }
    },enable: function() {
        this.shortcut.enable()
    },disable: function() {
        this.shortcut.disable()
    },saveState: function(a) {
        this.redoStates.clear();
        this.redoButton.removeClassName("enable");
        this.memory(a)
    },memory: function(c) {
        var a = false;
        if (!c) {
            var b = window._currentRange;
            if (!b) {
                b = new BaseRange(true);
                a = true
            }
            b.insertNode("span", {id: "dummy_cursor"}, null, true)
        }
        this.undoStates.push(this.editable.innerHTML);
        if (!c) {
            $("dummy_cursor") && $("dummy_cursor").remove()
        }
        if (a) {
            b.close()
        }
        this.undoButton.addClassName("enable")
    },undo: function() {
        if (!this.undoButton.hasClassName("enable")) {
            return
        }
        var a = new BaseRange(true);
        a.insertNode("span", {id: "dummy_cursor"}, null, true);
        this.redoStates.push(this.editable.innerHTML);
        $("dummy_cursor") && $("dummy_cursor").remove();
        a.close();
        this.update(this.undoStates.size() === 0 ? this.initalState : this.undoStates.pop());
        this.redoButton.addClassName("enable");
        if (this.undoStates.size() === 0) {
            this.undoButton.removeClassName("enable")
        }
    },redo: function() {
        if (this.redoStates.size() === 0) {
            return
        }
        this.memory();
        this.update(this.redoStates.pop());
        this.undoButton.addClassName("enable");
        if (this.redoStates.size() === 0) {
            this.redoButton.removeClassName("enable")
        }
    },update: function(a) {
        this.editable.update(a);
        this.setCursor(this.editable)
    },clear: function() {
        this.undoStates.clear();
        this.redoStates.clear();
        this.undoButton.removeClassName("enable");
        this.redoButton.removeClassName("enable");
        delete this.initalState
    },setCursor: function(a) {
        if (document.createRange) {
            var b = document.createRange();
            var d = $("dummy_cursor");
            if (d) {
                b.setStartBefore(d);
                b.setEndBefore(d)
            } else {
                b.selectNodeContents(a)
            }
            b.collapse(false);
            var c = window.getSelection();
            c.removeAllRanges();
            c.addRange(b);
            if (d) {
                d.remove()
            }
        } else {
            if (document.selection) {
                var b = document.body.createTextRange();
                b.moveToElementText(a);
                b.collapse(false);
                b.select()
            }
        }
    }});
editor.table.Builder = Class.create({initialize: function(a) {
        this.controller = a
    },build: function(e) {
        var b = Number($F("number_of_column"));
        var h = Number($F("number_of_header"));
        var g = Number($F("number_of_footer"));
        var f = Number($F("number_of_row"));
        var d = "<table>";
        d += "<caption>" + $F("table_caption") + "</caption>";
        if (h > 0) {
            d += "<thead>";
            for (var c = 0; c < h; c++) {
                d += "<tr>";
                for (var a = 0; a < b; a++) {
                    d += this.getCellHtml(true)
                }
                d += "</tr>"
            }
            d += "</thead>"
        }
        d += "<tbody>";
        for (var c = 0; c < f; c++) {
            d += "<tr>";
            for (var a = 0; a < b; a++) {
                d += this.getCellHtml(false)
            }
            d += "</tr>"
        }
        d += "</tbody>";
        if (g > 0) {
            d += "<tfoot>";
            for (var c = 0; c < g; c++) {
                d += "<tr>";
                for (var a = 0; a < b; a++) {
                    d += this.getCellHtml(true)
                }
                d += "</tr>"
            }
            d += "</tfoot>"
        }
        d += "</table>";
        this.controller.start(d)
    },cut: function() {
        this.copy();
        this.clearContent()
    },copy: function() {
        $("table_clear_clipboard").show();
        if (!$("table_clear_clipboard").loaded) {
            $("table_clear_clipboard").down().on("click", this.clearClipboard.bind(this));
            $("table_clear_clipboard").loaded = true
        }
        window.tableClipboard = new editor.table.CellGroup(this.controller.getSelectedCells()).getData()
    },paste: function() {
        if (!this.hasClipboard()) {
            return
        }
        var a = this.controller.getSelectedCells().first();
        var b;
        this.findColumnCells(a).each(function(f) {
            if (f === a) {
                b = $A()
            }
            if (b) {
                b.push(f)
            }
        });
        for (var d = 0; d < b.size() && d < window.tableClipboard.size(); d++) {
            var a = b[d];
            var e = window.tableClipboard[d];
            for (var c = 0; c < e.size(); c++) {
                if (a) {
                    a.down().update(e[c]);
                    a = a.next()
                }
            }
        }
    },clearContent: function() {
        this.controller.getSelectedCells().each(function(a) {
            a.down().update()
        })
    },hasClipboard: function() {
        return window.tableClipboard
    },clearClipboard: function(a) {
        delete window.tableClipboard;
        $("table_clear_clipboard").hide();
        a && a.stop()
    },insertRow: function(a, d) {
        var f = a.up();
        var e = 0;
        var b = this.findRowCells(a);
        var c = "<tr>";
        b.each(function(g) {
            var h = this.getRowspan(g);
            if ((!d || (d && f != g.up())) && h > 1) {
                this.setRowspan(g, h + 1)
            } else {
                c += this.getCellHtml(g, this.getColspan(g))
            }
        }.bind(this));
        c += "</tr>";
        if (d) {
            f.insert({before: c})
        } else {
            f.insert({after: c})
        }
    },insertSectionRow: function(a, e) {
        var c = this.createRowHtml(this.getColumnCount(a), e === "tbody");
        var d = a.up(2);
        if (d.select(e).size() === 0) {
            var b = new Element(e);
            b.insert(c);
            if (e === "thead") {
                d.down().insert({after: b})
            } else {
                if (e === "tbody") {
                    if (d.select("thead").size() === 0) {
                        d.down().insert({after: b})
                    } else {
                        d.down().next().insert({after: b})
                    }
                } else {
                    d.insert(b)
                }
            }
        } else {
            d.select(e)[0].insert(c)
        }
    },removeRow: function(a) {
        a.each(function(b) {
            var d = b.up();
            var c = d.up();
            if (c) {
                d.select("[rowspan]").each(function(e) {
                    this.unmergeCell(e)
                }.bind(this));
                this.findRowSpanedCell(d).each(function(e) {
                    this.setRowspan(e, this.getRowspan(e) - 1)
                }.bind(this));
                d.remove();
                if (c.childElements().size() === 0) {
                    c.remove()
                }
            }
        }.bind(this))
    },insertColumn: function(a, b) {
        this.findColumnCells(a).each(function(d) {
            var e = this.getColspan(d);
            if (e > 1) {
                this.setColspan(d, e + 1)
            } else {
                var c = this.getCellHtml(d, 1, this.getRowspan(d));
                if (b) {
                    d.insert({before: c})
                } else {
                    d.insert({after: c})
                }
            }
        }.bind(this))
    },removeColumn: function(b) {
        var d = $H();
        var a = $A();
        b.each(function(f) {
            var e = f.cumulativeOffset().left;
            if (!d.get(e)) {
                d.set(e, f);
                a.push(f)
            }
        });
        if (Prototype.Browser.IE) {
            var c = $A();
            a.each(function(e) {
                this.findColumnCells(e).each(function(f) {
                    c.push(f)
                }.bind(this))
            }.bind(this));
            c.each(function(e) {
                var f = this.getColspan(e);
                if (f > 1) {
                    this.setColspan(e, f - 1)
                } else {
                    e.remove()
                }
            }.bind(this))
        } else {
            a.each(function(e) {
                this.findColumnCells(e).each(function(f) {
                    var g = this.getColspan(f);
                    if (g > 1) {
                        this.setColspan(f, g - 1)
                    } else {
                        f.remove()
                    }
                }.bind(this))
            }.bind(this))
        }
        this.controller.getTable().update(this.controller.getTable().innerHTML)
    },toggleHeaderCell: function(a) {
        a.each(function(b) {
            var c = b.tagName === "TH" ? "td" : "th";
            var e = new Element(c);
            var d = this.getRowspan(b);
            if (d > 1) {
                e.setAttribute("rowspan", d)
            }
            var f = this.getColspan(b);
            if (f > 1) {
                e.setAttribute("colspan", f)
            }
            e.innerHTML = b.innerHTML;
            b.insert({after: e});
            b.remove()
        }.bind(this))
    },mergeCell: function(a) {
        new editor.table.CellGroup(a, this).merge()
    },unmergeCell: function(h) {
        var b = this.getRowspan(h);
        var a = this.getColspan(h);
        if (b === 1 && a === 1) {
            return
        }
        var g = h.cumulativeOffset().left;
        var e = $A();
        var j = h.up();
        for (var c = 1; c < b; c++) {
            j = j.next();
            if (j) {
                var f = j.childElements().find(function(i) {
                    var k = i.cumulativeOffset();
                    if ((k.left + i.getLayout().get("margin-box-width")) === g) {
                        return i
                    }
                });
                e.push(f || j)
            }
        }
        var d = "";
        for (var c = 1; c < a; c++) {
            d += this.getCellHtml(h)
        }
        h.insert({after: d});
        d += this.getCellHtml(h);
        e.each(function(i) {
            if (i.tagName === "TR") {
                i.insert({top: d})
            } else {
                i.insert({after: d})
            }
        });
        this.setRowspan(h, 1);
        this.setColspan(h, 1)
    },splitCellVertically: function(a) {
        var b = this.getColspan(a);
        if (b > 1) {
            this.setColspan(a, b - 1);
            a.insert({after: this.getCellHtml(a)});
            this.setRowspan(a.next(), this.getRowspan(a))
        } else {
            this.findColumnCells(a).each(function(c) {
                if (c === a) {
                    a.insert({after: this.getCellHtml(a)});
                    this.setRowspan(a.next(), this.getRowspan(a))
                } else {
                    this.setColspan(c, this.getColspan(c) + 1)
                }
            }.bind(this))
        }
    },splitCellHorizontally: function(b) {
        var d = this.getRowspan(b);
        if (d > 1) {
            var e = b.up();
            while (--d > 0) {
                e = e.next()
            }
            var a = b.cumulativeOffset().left;
            var c = e.childElements().find(function(f) {
                var g = f.cumulativeOffset();
                if ((g.left + f.getLayout().get("margin-box-width")) === a) {
                    return f
                }
            });
            if (c) {
                c.insert({after: this.getCellHtml(b)});
                this.setColspan(c.next(), this.getColspan(b));
                this.setRowspan(b, this.getRowspan(b) - 1)
            } else {
                e.insert({top: this.getCellHtml(b)});
                this.setColspan(e.down(), this.getColspan(b));
                this.setRowspan(b, this.getRowspan(b) - 1)
            }
        } else {
            this.findRowCells(b).each(function(g) {
                if (g === b) {
                    var f = "<tr>" + this.getCellHtml(b) + "</tr>";
                    b.up().insert({after: f});
                    this.setColspan(b.up().next().down(), this.getColspan(g))
                } else {
                    this.setRowspan(g, this.getRowspan(g) + 1)
                }
            }.bind(this))
        }
    },alignCell: function(b) {
        var a = b === "to_top" || b === "to_bottom" || b === "to_middle";
        this.controller.getSelectedCells().each(function(c) {
            if (a) {
                if (c.hasClassName("to_left")) {
                    c.setAttribute("class", "to_left " + b)
                } else {
                    if (c.hasClassName("to_right")) {
                        c.setAttribute("class", "to_right " + b)
                    } else {
                        if (c.hasClassName("to_center")) {
                            c.setAttribute("class", "to_center " + b)
                        } else {
                            if (c.hasClassName("to_justify")) {
                                c.setAttribute("class", "to_justify " + b)
                            } else {
                                c.setAttribute("class", b)
                            }
                        }
                    }
                }
            } else {
                if (c.hasClassName("to_bottom")) {
                    c.setAttribute("class", b + " to_bottom")
                } else {
                    if (c.hasClassName("to_middle")) {
                        c.setAttribute("class", b + " to_middle")
                    } else {
                        c.setAttribute("class", b)
                    }
                }
            }
        })
    },getColumnCount: function(b) {
        var a = 0;
        b.up(2).select("tr")[0].childElements().each(function(c) {
            a += this.getColspan(c)
        }.bind(this));
        return a
    },createRowHtml: function(d, c) {
        var a = "<tr>";
        for (var b = 0; b < d; b++) {
            a += this.getCellHtml(!c)
        }
        return a + "</tr>"
    },getRowspan: function(a) {
        return Math.max(1, Number(a.getAttribute("rowspan")))
    },setRowspan: function(a, b) {
        if (b < 2) {
            a.removeAttribute("rowspan")
        } else {
            a.setAttribute("rowspan", b)
        }
    },getColspan: function(a) {
        return Math.max(1, Number(a.getAttribute("colspan")))
    },setColspan: function(a, b) {
        if (b < 2) {
            a.removeAttribute("colspan")
        } else {
            a.setAttribute("colspan", b)
        }
    },findRowCells: function(a) {
        var b = a.cumulativeOffset().top;
        return a.up(1).select("td", "th").findAll(function(c) {
            var d = c.cumulativeOffset();
            if (d.top === b) {
                return c
            } else {
                if (d.top < b) {
                    if ((d.top + c.getLayout().get("margin-box-height")) > b) {
                        return c
                    }
                }
            }
        })
    },findRowSpanedCell: function(a) {
        var b = a.cumulativeOffset().top;
        return a.up().select("td", "th").findAll(function(c) {
            var d = c.cumulativeOffset();
            if (d.top < b) {
                if ((d.top + c.getLayout().get("margin-box-height")) > b) {
                    return c
                }
            }
        })
    },getColumnIndex: function(b) {
        var a = 0;
        b = b.previous();
        while (b) {
            a++;
            b = b.previous()
        }
        return a
    },findColumnCells: function(c) {
        var b = c.cumulativeOffset().left;
        var d = c.up();
        var e = c.up(2);
        var a = $A();
        e.select("tr").each(function(j) {
            for (var f = 0; f < j.childElements().size(); f++) {
                var g = j.childElements()[f];
                var h = g.cumulativeOffset();
                if (b === h.left) {
                    a.push(g);
                    break
                } else {
                    if (h.left < b) {
                        if ((h.left + g.getLayout().get("margin-box-width")) > b) {
                            a.push(g);
                            break
                        }
                    }
                }
            }
        });
        return a
    },getCellHtml: function(e, d, c) {
        var b;
        if (e.tagName) {
            b = e.tagName.toLowerCase()
        } else {
            b = e ? "th" : "td"
        }
        d = d || 1;
        c = c || 1;
        var a = "<" + b;
        if (d > 1) {
            a += " colspan='" + d + "'"
        }
        if (c > 1) {
            a += " rowspan='" + c + "'"
        }
        return a + "><div contenteditable='true'></div></" + b + ">"
    }});
editor.table.CellGroup = Class.create({initialize: function(b, a) {
        this.cells = b;
        this.builder = a;
        this.rows = $A();
        this.columns = $H();
        b.each(function(c) {
            this.addCell(c)
        }.bind(this))
    },addCell: function(b) {
        if (!this.row || this.row.row != b.up()) {
            this.row = {row: b.up(),values: $A()};
            this.rows.push(this.row)
        }
        this.row.values.push(b);
        var a = b.cumulativeOffset().left;
        var c = this.columns.get(a);
        if (!c) {
            c = $A();
            this.columns.set(a, c)
        }
        c.push(b)
    },merge: function() {
        this.cells.each(function(a, b) {
            if (b === 0) {
                var d = this.getColspan();
                var c = d === this.builder.getColumnCount(a) ? 1 : this.getRowspan();
                this.builder.setRowspan(a, c);
                this.builder.setColspan(a, d)
            } else {
                a.remove()
            }
        }.bind(this))
    },getData: function() {
        var a = $A();
        this.rows.each(function(c) {
            var b = $A();
            a.push(b);
            c.values.each(function(d) {
                b.push(d.down().innerHTML)
            })
        });
        return a
    },getRowspan: function() {
        var a = 0;
        this.columns.values()[0].each(function(b) {
            a += this.builder.getRowspan(b)
        }.bind(this));
        return a
    },getColspan: function() {
        var a = 0;
        this.rows[0].values.each(function(b) {
            a += this.builder.getColspan(b)
        }.bind(this));
        return a
    }});
editor.table.Controller = Class.create({initialize: function(b, a) {
        this.tableEditor = b;
        this.editable = a;
        this.builder = new editor.table.Builder(this);
        this.selector = new editor.table.Selector(this, a);
        this.shortcut = new editor.table.Shortcut(this);
        this.undoManager = new editor.rich.UndoManager(a);
        this.tableType = $("table_type");
        if (this.tableType.options.length === 1) {
            this.tableType.hide()
        } else {
            this.tableType.on("change", this.changeTableType.bind(this))
        }
    },getTable: function() {
        return this.editable.down("table")
    },changeTableType: function(d) {
        var b = d.findElement().value;
        var c = this.getTable();
        var a = c.getAttribute("class").split(" ");
        if (a.size() > 0) {
            var e = a[a.size() - 1]
        }
        if (b) {
            c.setAttribute("class", b + " " + e)
        } else {
            if (e) {
                c.setAttribute("class", "table " + e)
            } else {
                c.setAttribute("class", "table")
            }
        }
        d.stop()
    },start: function(d, f, c) {
        if (c) {
            this.tableType.value = $w(c.down("table").className)[0]
        }
        var e = this.tableEditor.getEditor();
        e.down("dl").hide();
        e.down("header").show();
        $("table_editor_panel").show();
        this.editable.update(d);
        var g = this.getTable();
        if (f) {
            g.setAttribute("style", f)
        }
        var a = g.getAttribute("class");
        if (!a) {
            g.setAttribute("class", "table")
        } else {
            if (a.startsWith("column_count_")) {
                g.setAttribute("class", "table " + a)
            }
        }
        this.editable.select("caption", "th", "td").each(function(h) {
            if (h.tagName === "CAPTION") {
                h.update("<div>" + h.innerHTML + "</div>");
                h.down().setAttribute("contenteditable", "true");
                $("omit_table_caption").checked = c && "true" === c.getAttribute("data-omit-caption");
                this.tableEditor.toggleCaption()
            } else {
                h = h.down();
                h.setAttribute("contenteditable", "true")
            }
        }.bind(this));
        var b = this.editable.select("th", "td");
        if (b.size() > 0) {
            b[0].down().focus()
        }
        this.tableEditor.getRichEditor().setUndoManager(this.undoManager);
        this.shortcut.start()
    },stop: function() {
        this.hideHandlers();
        this.selector.clear();
        this.undoManager.clear();
        this.shortcut.stop()
    },buildTable: function(a) {
        this.builder.build(a)
    },showHandlers: function(g) {
        this.hideContextMenu();
        var h = g.up("table");
        if (!h) {
            return
        }
        this.optionHandler || this.createHandlers();
        var i = h.select("thead", "tbody", "tfoot")[0].cumulativeOffset();
        var a = g.cumulativeOffset();
        var c = g.getLayout();
        var d = c.get("margin-box-height");
        var b = c.get("margin-box-width");
        this.showOptionHandler(g);
        var f = a.left - 3;
        var e = i.top - 13;
        this.showHandler(this.columnAdder1, f, e);
        this.showHandler(this.columnAdder2, f + b, e);
        f = i.left - 13;
        e = a.top - 4;
        this.showHandler(this.rowAdder1, f, e);
        this.showHandler(this.rowAdder2, f, e + d);
        this.cell = g
    },hideHandlers: function() {
        if (this.optionHandler) {
            [this.optionHandler, this.columnAdder1, this.columnAdder2, this.rowAdder1, this.rowAdder2].invoke("hide");
            this.hideContextMenu()
        }
    },createHandlers: function() {
        this.optionHandler = this.createHandler("table_option", "label.option", this.showContextMenu);
        this.columnAdder1 = this.createHandler("table_column_adder", "label.insert_column", this.addColumn);
        this.columnAdder2 = this.createHandler("table_column_adder", "label.insert_column", this.addColumn);
        this.rowAdder1 = this.createHandler("table_row_adder", "label.insert_row", this.addRow);
        this.rowAdder2 = this.createHandler("table_row_adder", "label.insert_row", this.addRow)
    },createHandler: function(c, d, b) {
        var a = new Element("div", {"class": c,title: I18n.get(d)});
        document.body.appendChild(a);
        a.on("click", b.bind(this));
        return a
    },showHandler: function(b, a, c) {
        b.setStyle({left: a + "px",top: c + "px"});
        b.show()
    },showOptionHandler: function(a) {
        if (!a) {
            return
        }
        this.optionHandler || this.createHandlers();
        var e = a.cumulativeOffset();
        var b = a.getLayout();
        var d = e.top + b.get("margin-box-height") - 8;
        var c = e.left + b.get("margin-box-width") - 5;
        this.showHandler(this.optionHandler, c, d);
        this.hideContextMenu()
    },showContextMenu: function(c) {
        this.contextMenu = this.contextMenu || new ContextMenu("table_context_menu", function(f) {
            this.handle(f.getAttribute("value"))
        }.bind(this));
        var b = this.optionHandler.getLayout();
        var e = b.get("top") + 8;
        var d = b.get("left") + 7;
        this.contextMenu.show(d, e);
        this.contextMenu.disable("");
        var a = "";
        if (this.selector.headerCellSelected(this.cell)) {
            a = " .toggle_header_cell"
        }
        if (this.selector.multiCellSelected()) {
            if (this.selector.mergable()) {
                this.contextMenu.disable(".unmerge_cell .split_cell_horizontally .split_cell_vertically" + a)
            } else {
                this.contextMenu.disable(".merge_cell .unmerge_cell .split_cell_horizontally .split_cell_vertically" + a)
            }
        } else {
            if (this.cell.hasAttribute("colspan") || this.cell.hasAttribute("rowspan")) {
                this.contextMenu.disable(".merge_cell" + a)
            } else {
                this.contextMenu.disable(".merge_cell .unmerge_cell" + a)
            }
        }
        c.stop()
    },hideContextMenu: function() {
        this.contextMenu && this.contextMenu.hide()
    },addColumn: function(a) {
        this.undoManager.saveState();
        this.builder.insertColumn(this.cell, this.columnAdder1 === a.findElement());
        this.showHandlers(this.cell);
        a.stop()
    },addRow: function(a) {
        this.undoManager.saveState();
        this.builder.insertRow(this.cell, this.rowAdder1 === a.findElement());
        this.showHandlers(this.cell);
        a.stop()
    },handle: function(a) {
        if (a !== "copy") {
            this.saveState()
        }
        if (a === "cut") {
            this.builder.cut()
        } else {
            if (a === "copy") {
                this.builder.copy()
            } else {
                if (a === "paste") {
                    this.builder.paste()
                } else {
                    if (a === "clear_content") {
                        this.builder.clearContent()
                    } else {
                        if (a === "insert_row") {
                            this.builder.insertSectionRow(this.cell, "tbody")
                        } else {
                            if (a === "insert_header_row") {
                                this.builder.insertSectionRow(this.cell, "thead")
                            } else {
                                if (a === "insert_footer_row") {
                                    this.builder.insertSectionRow(this.cell, "tfoot")
                                } else {
                                    if (a === "remove_row") {
                                        this.builder.removeRow(this.getSelectedCells())
                                    } else {
                                        if (a === "toggle_header_cell") {
                                            this.builder.toggleHeaderCell(this.getSelectedCells())
                                        } else {
                                            if (a === "remove_column") {
                                                this.builder.removeColumn(this.getSelectedCells())
                                            } else {
                                                if (a === "merge_cell") {
                                                    this.builder.mergeCell(this.getSelectedCells())
                                                } else {
                                                    if (a === "unmerge_cell") {
                                                        this.builder.unmergeCell(this.cell)
                                                    } else {
                                                        if (a === "split_cell_horizontally") {
                                                            this.builder.splitCellHorizontally(this.cell)
                                                        } else {
                                                            if (a === "split_cell_vertically") {
                                                                this.builder.splitCellVertically(this.cell)
                                                            } else {
                                                                if (a.startsWith("to_")) {
                                                                    this.builder.alignCell(a)
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        this.hideHandlers()
    },saveState: function() {
        this.undoManager.saveState()
    },hasClipboard: function() {
        return this.builder.hasClipboard()
    },clearClipboard: function() {
        this.builder.clearClipboard()
    },getSelectedCells: function() {
        var a;
        if (this.selector.multiCellSelected()) {
            a = this.selector.selectedCells
        } else {
            a = $A();
            a.push(this.cell)
        }
        return a
    },undo: function(c, a, b) {
        this.undoManager.undo();
        this.hideHandlers()
    },redo: function(c, a, b) {
        this.undoManager.redo();
        this.hideHandlers()
    }});
editor.table.Selector = Class.create({initialize: function(a, b) {
        this.controller = a;
        this.editable = b;
        this.editable.on("click", "th, td", this.click.bind(this));
        this.editable.on("mousedown", "table", this.initSelection.bind(this));
        this.selectedCells = $A()
    },click: function(a) {
        this.moveHandler || this.focus(a.findElement("th, td"));
        a.stop()
    },focus: function(a) {
        if (a) {
            if (a.tagName === "TH" || a.tagName === "TD") {
                a = a.down()
            }
        } else {
            a = $(document.activeElement)
        }
        if (a) {
            a.focus();
            this.clear();
            this.controller.showHandlers(a.up())
        }
    },clear: function() {
        this.editable.select(".selected").each(function(a) {
            a.removeClassName("selected")
        });
        this.selectedCells.clear()
    },initSelection: function(b) {
        var a = b.findElement("td, th");
        if (a) {
            if (!this.moveHandler && new BaseRange(true).isEmpty()) {
                this.controller.hideHandlers();
                this.currentCellX = b.pointerX();
                this.currentCellY = b.pointerY();
                this.moveHandler = document.on("mousemove", this.move.bind(this));
                this.doneHandler = document.on("mouseup", this.done.bind(this))
            } else {
                this.controller.saveState()
            }
        }
    },move: function(e) {
        this.clear();
        var g = e.pointerX();
        var f = e.pointerY();
        if (g > this.currentCellX) {
            var b = this.currentCellX;
            var a = g
        } else {
            var b = g;
            var a = this.currentCellX
        }
        if (f > this.currentCellY) {
            var d = this.currentCellY;
            var c = f
        } else {
            var d = f;
            var c = this.currentCellY
        }
        this.editable.select("th", "td").each(function(i) {
            var m = i.cumulativeOffset();
            var l = i.getLayout();
            var h = m.left;
            var n = h + i.getLayout().get("margin-box-width");
            var k = m.top;
            var j = k + i.getLayout().get("margin-box-height");
            if ((h < b && n > b) || (h < a && n > a) || (h > b && n < a)) {
                if ((k < d && j > d) || (k < c && j > c) || (k > d && j < c)) {
                    this.selectedCells.push(i)
                }
            }
        }.bind(this));
        if (this.multiCellSelected()) {
            this.selectedCells.each(function(h) {
                h.addClassName("selected")
            })
        } else {
            this.selectedCells.clear()
        }
    },done: function(c) {
        if (!this.moveHandler) {
            return
        }
        this.moveHandler.stop();
        this.doneHandler.stop();
        delete this.moveHandler;
        delete this.doneHandler;
        delete this.currentCellX;
        delete this.currentCellY;
        if (this.multiCellSelected()) {
            var b = y1 = Number.MAX_VALUE;
            var a = y2 = 0;
            this.selectedCells.each(function(e) {
                var h = e.cumulativeOffset();
                var g = e.getLayout();
                var f = g.get("margin-box-width");
                var d = g.get("margin-box-height");
                b = Math.min(b, h.left - 1);
                a = Math.max(a, h.left + f + 2);
                y1 = Math.min(y1, h.top - 1);
                y2 = Math.max(y2, h.top + d + 2)
            });
            this.selectedCells.clear();
            this.editable.select("th", "td").each(function(e) {
                var h = e.cumulativeOffset();
                var g = e.getLayout();
                var f = g.get("margin-box-width");
                var d = g.get("margin-box-height");
                if (h.left > b && (h.left + f) < a && h.top > y1 && (h.top + d) < y2) {
                    this.selectedCells.push(e);
                    e.addClassName("selected")
                }
            }.bind(this));
            this.controller.showOptionHandler(this.selectedCells.last())
        }
        c.stop()
    },mergable: function() {
        var a = this.selectedCells;
        var c = a[0].up(1);
        for (var b = 1; b < a.size(); b++) {
            if (c !== a[b].up(1)) {
                return false
            }
        }
        return true
    },multiCellSelected: function() {
        return this.selectedCells.size() > 1
    },headerCellSelected: function(c) {
        if (c && this.isHeaderSection(c)) {
            return true
        }
        var a = this.selectedCells;
        for (var b = 0; b < a.size(); b++) {
            if (this.isHeaderSection(a[b])) {
                return true
            }
        }
        return false
    },isHeaderSection: function(a) {
        var b = a.up(1).tagName;
        return b === "THEAD" || b === "TFOOT"
    }});
editor.table.Shortcut = Class.create({initialize: function(a) {
        this.controller = a;
        this.shortcut = new Shortcut(document);
        this.caret = new Caret()
    },start: function() {
        this.shortcut.bind("ctrl_z", this.controller.undo.bind(this.controller));
        this.shortcut.bind("ctrl_y", this.controller.redo.bind(this.controller));
        this.shortcut.bind("ctrl_x", this.cut.bind(this));
        this.shortcut.bind("ctrl_c", this.copy.bind(this));
        this.shortcut.bind("ctrl_v", this.paste.bind(this));
        this.shortcut.bind("backspace", this.clear.bind(this));
        this.shortcut.bind("delete", this.clear.bind(this));
        this.shortcut.bind("tab", this.tab.bind(this));
        this.shortcut.bind("shift_tab", this.shiftTab.bind(this));
        this.shortcut.bind("up", this.up.bind(this));
        this.shortcut.bind("right", this.right.bind(this));
        this.shortcut.bind("down", this.down.bind(this));
        this.shortcut.bind("left", this.left.bind(this))
    },stop: function() {
        this.shortcut.clear()
    },cut: function(c, a, b) {
        if (this.controller.selector.multiCellSelected()) {
            this.controller.handle("cut")
        } else {
            this.controller.clearClipboard();
            return "ignore"
        }
    },copy: function(c, a, b) {
        if (this.controller.selector.multiCellSelected()) {
            this.controller.handle("copy")
        } else {
            this.controller.clearClipboard();
            return "ignore"
        }
    },paste: function(c, a, b) {
        if (this.controller.hasClipboard()) {
            this.controller.handle("paste")
        } else {
            return "ignore"
        }
    },clear: function(c, a, b) {
        if (this.controller.selector.multiCellSelected()) {
            this.controller.handle("clear_content")
        } else {
            return "ignore"
        }
    },tab: function(e, b, d) {
        var a = document.activeElement;
        if (!a) {
            return "ignore"
        }
        var c = a.up().next();
        if (!c) {
            var f = this.getNextRow(a);
            c = f && f.childElements().first()
        }
        c && this.controller.selector.focus(c)
    },shiftTab: function(e, b, d) {
        var a = document.activeElement;
        if (!a) {
            return "ignore"
        }
        var c = a.up().previous();
        if (!c) {
            var f = this.getPreviousRow(a);
            c = f && f.childElements().last()
        }
        c && this.controller.selector.focus(c)
    },up: function(e, c, d) {
        if (Prototype.Browser.IE && $("character_context_menu") && $("character_context_menu").visible()) {
            return
        }
        var b = document.activeElement;
        if (b && this.caret.isStart()) {
            var a = b.up().cumulativeOffset().left;
            var f = this.getPreviousRow(b);
            if (f) {
                b = this.findCell(f, a);
                while (!b) {
                    f = this.getPreviousRow(f);
                    if (f) {
                        b = this.findCell(f, a)
                    } else {
                        break
                    }
                }
                if (b) {
                    this.controller.selector.focus(b);
                    return
                }
            }
        }
        return "ignore"
    },right: function(e, b, d) {
        var a = document.activeElement;
        if (a && this.caret.isLineEnd()) {
            var c = a.up().next();
            if (c) {
                this.controller.selector.focus(c)
            } else {
                var f = this.getNextRow(a);
                if (f) {
                    this.controller.selector.focus(f.childElements().first())
                }
            }
        } else {
            return "ignore"
        }
    },down: function(e, c, d) {
        if (Prototype.Browser.IE && $("character_context_menu") && $("character_context_menu").visible()) {
            return
        }
        var b = document.activeElement;
        if (b && this.caret.isEnd()) {
            var a = b.up().cumulativeOffset().left;
            var f = this.getNextRow(b);
            if (f) {
                b = this.findCell(f, a);
                while (!b) {
                    f = this.getNextRow(f);
                    if (f) {
                        b = this.findCell(f, a)
                    } else {
                        break
                    }
                }
                if (b) {
                    this.controller.selector.focus(b);
                    return
                }
            }
        }
        return "ignore"
    },left: function(e, b, d) {
        var a = document.activeElement;
        if (a && this.caret.isLineStart()) {
            var c = a.up().previous();
            if (c) {
                this.controller.selector.focus(c);
                this.caret.toEnd()
            } else {
                var f = this.getPreviousRow(a);
                if (f) {
                    this.controller.selector.focus(f.childElements().last());
                    this.caret.toEnd()
                }
            }
        } else {
            return "ignore"
        }
    },getPreviousRow: function(b) {
        var e = b.tagName === "TR" ? b : b.up("tr");
        if (!e) {
            return
        }
        var a = e.previous();
        if (!a) {
            var d = e.up().previous();
            var c = d && d.tagName;
            if (c === "THEAD" || c === "TBODY") {
                a = d.childElements().last()
            }
        }
        return a
    },getNextRow: function(b) {
        var e = b.tagName === "TR" ? b : b.up("tr");
        if (!e) {
            return
        }
        var a = e.next();
        if (!a) {
            var d = e.up().next();
            var c = d && d.tagName;
            if (c === "TBODY" || c === "TFOOT") {
                a = d.childElements().first()
            }
        }
        return a
    },findCell: function(b, a) {
        return b.childElements().find(function(c) {
            if (c.cumulativeOffset().left === a) {
                return c.down()
            }
        })
    }});
editor.task.Abstract = Class.create({initialize: function(a) {
        this.id = a
    },getId: function() {
        return this.id
    },open: function(b) {
        var a = this.getPanel(b);
        a.show();
        if (a.alwaysRefresh) {
            this.refresh && this.refresh()
        }
        this.opened && this.opened()
    },close: function() {
        this.getPanel().hide();
        this.closed && this.closed()
    },getPanel: function(a) {
        if (!this.panel) {
            this.section = a;
            this.panel = new Element("div");
            this.configurePanel && this.configurePanel(this.panel);
            a.insert(this.panel);
            if (!this.panel.alwaysRefresh) {
                this.refresh && this.refresh()
            }
        }
        return this.panel
    },toggleList: function(b) {
        b.toggle();
        var a = b.next();
        if (a) {
            if (a.hasClassName("footnote")) {
                a.toggle()
            }
        }
    }});
editor.task.AbstractRevision = Class.create(editor.task.Abstract, {configurePanel: function(a) {
        a.addClassName("revision_panel");
        a.alwaysRefresh = true;
        a.on("click", "button", this.clinkButton.bind(this));
        a.on("click", "a", this.clickLink.bind(this));
        a.on("click", "input", this.clinkInput.bind(this));
        this.controllerUrl = "/r/editor_revision"
    },refresh: function() {
        var a = this.getInitialUrl();
        new Ajax.Updater(this.getPanel(), a, {onComplete: function(b) {
                this.refreshDiffInfo()
            }.bind(this)})
    },clinkButton: function(b) {
        var a = b.findElement("button");
        if (a) {
            if (a.id === "button_compare") {
                this.compare()
            }
            b.stop()
        }
    },clickLink: function(b) {
        var a = b.findElement("a");
        if (a) {
            if (a.hasClassName("view")) {
                this.view(a, b)
            } else {
                if (a.hasClassName("view_details")) {
                    this.viewDetails(a)
                }
            }
            b.stop()
        }
    },clinkInput: function(b) {
        var a = b.findElement("input");
        if (a.readAttribute("type") === "checkbox") {
            if (a.checked) {
                this.setUpDiffInfoWidhChecked(a)
            } else {
                this.setUpDiffInfoWidhUnchecked(a)
            }
        }
    },setUpDiffInfoWidhChecked: function(a) {
        if (!this.first) {
            this.first = a
        } else {
            if (!this.second) {
                this.second = a
            } else {
                this.second.checked = false;
                this.second = a
            }
        }
    },setUpDiffInfoWidhUnchecked: function(a) {
        if (this.first === a) {
            this.first = this.second;
            this.second = undefined
        } else {
            if (this.second === a) {
                this.second = undefined
            }
        }
    },getTitleOfRevision: function(c) {
        var a = "";
        var b = c.down("label");
        if (b) {
            a = BaseUtil.getText(b)
        }
        return a
    },isInOrder: function() {
        if (isNaN(this.first.getValue())) {
            return true
        } else {
            if (isNaN(this.first.getValue())) {
                return false
            } else {
                if (this.first.getValue() > this.second.getValue()) {
                    return true
                } else {
                    return false
                }
            }
        }
    },refreshDiffInfo: function() {
        var a = this.panel.select('input[value="current_time"]')[0];
        if (a) {
            a.checked = true
        }
        this.first = a;
        this.second = undefined
    },changeExpandLink: function(b, a) {
        if (a && a.visible()) {
            b.writeAttribute("title", I18n.get("label.expand"));
            b.addClassName("expand");
            b.removeClassName("collapse")
        } else {
            b.writeAttribute("title", I18n.get("label.collapse"));
            b.addClassName("collapse");
            b.removeClassName("expand")
        }
    },viewDetails: function(b) {
        this.changeExpandLink(b, b.detail_list);
        var d = b.up("li");
        var e = d.id;
        var c = d.previous(".revision").id;
        var a = this.getDetailListUrl() + "/" + this.getId() + "/" + e + "/" + c;
        if (b.detail_list) {
            b.detail_list.select('input[type="checkbox"]').each(function(f) {
                if (f.checked) {
                    f.checked = false;
                    this.setUpDiffInfoWidhUnchecked(f)
                }
            }.bind(this));
            this.toggleList(b.detail_list)
        } else {
            b.detail_list = new Element("ul", {"class": "revision_detail_list"});
            d.insert({bottom: b.detail_list});
            new Ajax.Updater(b.detail_list, a)
        }
    }});
editor.task.ChapterRevision = Class.create(editor.task.AbstractRevision, {getInitialUrl: function() {
        return this.controllerUrl + "/get_count_list_of_chapter_revision/" + this.getId()
    },compare: function() {
        if (this.first && this.second) {
            var c, b;
            if (this.isInOrder()) {
                c = this.first.getValue();
                b = this.second.getValue()
            } else {
                c = this.second.getValue();
                b = this.first.getValue()
            }
            var a = "/r/differ/diff_chapter/" + this.id + "/" + c + "/" + b;
            window.open(a)
        } else {
            alert(I18n.get("message.select_revision_for_diff"))
        }
    },view: function(c) {
        var b = c.up("li");
        var a = this.controllerUrl + "/view_chapter_revision/" + this.id + "/" + b.id.toString();
        window.open(a)
    },getDetailListUrl: function() {
        return this.controllerUrl + "/get_detail_list_of_chapter_revision"
    }});
editor.task.Alias = Class.create({addValidationUI: function(b) {
        var a = $("alias").addClassName("invalid");
        this.removeMessage(a);
        a.insert({after: '<span class="invalid">' + decodeURIComponent(b).gsub("+", " ") + "</span>"});
        a.on("click", this.removeValidationUI.bind(this))
    },removeValidationUI: function(a) {
        this.removeMessage(a.findElement().removeClassName("invalid"))
    },removeMessage: function(a) {
        var b = a.next();
        if (b && b.hasClassName("invalid")) {
            b.remove()
        }
    }});
editor.task.ElementOption = Class.create(editor.task.Abstract, {configurePanel: function(a) {
        a.addClassName("option_panel");
        a.on("click", "button", this.save.bind(this));
        a.alwaysRefresh = true;
        a.on("click", "input[name=table_layout]", this.changeTableLayout.bind(this))
    },refresh: function() {
        var a = "/r/editor_option/get_element_option";
        if (_editor.selector.singleSelected()) {
            this.element = _editor.selector.get()
        } else {
            if (_editor.selector.isEmpty() && _editor.currentElement) {
                this.element = _editor.currentElement;
                _editor.selector.select(this.element)
            } else {
                delete this.element
            }
        }
        if (this.element) {
            a += "/" + this.element.getAttribute("id")
        }
        new Ajax.Updater(this.panel, a, {onComplete: this.configure.bind(this)})
    },configure: function(f) {
        if (this.element) {
            var b = f.headerJSON;
            $("alias").up("fieldset").down("code").innerHTML = this.element.getAttribute("id");
            var d = this.panel.select("input[name=export_exclude]");
            var c = this.panel.select("input[name=image_float]");
            var j = this.panel.select("input[name=table_layout]");
            if (b) {
                $("alias").value = b.alias ? b.alias : "";
                $("renumbered").checked = b.renumbered === "true";
                if (b.export_exclude) {
                    var e = b.export_exclude;
                    d[0].checked = e.include("web");
                    d[1].checked = e.include("pdf")
                }
                if (b.table_layout === "auto") {
                    j[0].checked = true;
                    $("table_layout_setting").value = "";
                    $("table_layout_setting").up().hide()
                } else {
                    if (b.table_layout === "user") {
                        j[2].checked = true;
                        $("table_layout_setting").value = b.table_layout_setting ? decodeURIComponent(b.table_layout_setting) : "";
                        $("table_layout_setting").up().show()
                    } else {
                        j[1].checked = true;
                        $("table_layout_setting").value = "";
                        $("table_layout_setting").up().hide()
                    }
                }
                if (b.image_float === "left") {
                    c[1].checked = true
                } else {
                    if (b.image_float === "right") {
                        c[2].checked = true
                    }
                }
                $("prevent_image_resize").checked = b.prevent_image_resize === "true";
                $("code_language").value = b.code_language;
                $("code_numbering").checked = b.code_numbering !== "false"
            } else {
                $("alias").value = "";
                $("renumbered").checked = false;
                $("prevent_image_resize").checked = false;
                $("code_language").value = "";
                $("code_numbering").checked = true;
                d[0].checked = false;
                d[1].checked = false;
                j[1].checked = true
            }
            var i = this.panel.select("fieldset")[1];
            var h = EditorUtil.getType(this.element);
            if (h === "code" || h === "image" || h === "table" || h === "ordered_list") {
                i.select("dt", "dd").each(function(k) {
                    if (k.hasClassName(h)) {
                        k.show()
                    } else {
                        k.hide()
                    }
                });
                i.show()
            } else {
                i.hide()
            }
        } else {
            var a = this.panel.select("fieldset");
            var i = a[1];
            i.hide();
            var g = a[2];
            g.hide()
        }
    },save: function(c) {
        if (this.element) {
            _editor.selector.clear();
            var a = this.element;
            new Ajax.Updater(a, "/r/editor_option/save/" + a.getAttribute("id"), {insertion: "after",parameters: $("element_option_form").serialize(),onComplete: function(d) {
                    if (d.headerJSON && d.headerJSON.code === "illegal_alias") {
                        (this.alias = this.alias || new editor.task.Alias()).addValidationUI(d.headerJSON.message);
                        return
                    }
                    if (d.headerJSON && d.headerJSON.code) {
                        new editor.util.Synchronizer(this.controller).show(a, d.headerJSON)
                    } else {
                        var e = a.next(".element");
                        a.remove();
                        if (EditorUtil.hasFootnote(e)) {
                            e.next().remove()
                        }
                        e.fadeIn();
                        _editor.getUndoManager().enable()
                    }
                    this.panel.up(".task_panel").hide()
                }.bind(this)})
        } else {
            var b = $("element_option_form").serialize(true);
            b.id = $A();
            _editor.selector.getAll().each(function(d) {
                b.id.push(d.getAttribute("id"))
            });
            new Ajax.Request("/r/editor_option/save_all/" + EditorUtil.getChapterId(), {parameters: b,onComplete: function(d) {
                    _editor.selector.getAll().each(function(f) {
                        f.setAttribute("data-version", Number(f.getAttribute("data-version")) + 1);
                        f.removeClassName("exclude_web");
                        f.removeClassName("exclude_pdf");
                        f.removeClassName("exclude_web_pdf");
                        var e = b.export_exclude;
                        if (e === "web") {
                            f.addClassName("exclude_web")
                        } else {
                            if (e === "pdf") {
                                f.addClassName("exclude_pdf")
                            } else {
                                if (e) {
                                    f.addClassName("exclude_web_pdf")
                                }
                            }
                        }
                    });
                    this.panel.up(".task_panel").hide();
                    _editor.getUndoManager().enable()
                }.bind(this)})
        }
        c.stop()
    },changeTableLayout: function(a) {
        if (a.findElement("input").value === "user") {
            $("table_layout_setting").up().show()
        } else {
            $("table_layout_setting").up().hide()
        }
    }});
editor.task.ElementRevision = Class.create(editor.task.AbstractRevision, {getInitialUrl: function() {
        var a = _editor.selector.get();
        if (!a) {
            a = _editor.currentElement;
            _editor.selector.select(a)
        }
        this.id = a.getAttribute("id");
        return this.controllerUrl + "/get_count_list_of_element_revision/" + this.getId()
    },compare: function() {
        if (this.first && this.second) {
            var c, b;
            if (this.isInOrder()) {
                c = this.first.getValue();
                b = this.second.getValue()
            } else {
                c = this.second.getValue();
                b = this.first.getValue()
            }
            var a = "/r/differ/diff_element/" + this.getId() + "/" + c + "/" + b;
            this.showDiffOverlay("label.compare_revision", 950, a)
        } else {
            alert(I18n.get("message.select_revision_for_diff"))
        }
    },showDiffOverlay: function(d, c, b) {
        var a = new Overlay(d, c, true);
        a.show(100, 100);
        new Ajax.Updater(a.getContentPanel(), b)
    },view: function(d, c) {
        var b = d.up("li");
        this.timeInMills = b.id;
        var a = this.controllerUrl + "/get_element_revision/" + this.getId() + "/" + this.timeInMills;
        var e = I18n.get("label.revision") + " - " + this.getTitleOfRevision(b);
        this.showViewerOverlay(c, e, 710, a)
    },showViewerOverlay: function(c, e, b, a) {
        this.overlay = new Overlay(e, b);
        var d = Math.max(10, c.pointerX() - b);
        this.overlay.show(d, "200");
        new Ajax.Updater(this.overlay.getContentPanel(), a, {onComplete: function(f) {
                if (this.isExistForRestore()) {
                    this.overlay.addButton("restore", this.restoreElement.bind(this))
                }
            }.bind(this)})
    },isExistForRestore: function() {
        var b = this.overlay.getContentPanel().select("#older_revision")[0];
        if (b) {
            var a = b.select(".empty");
            if (a.length > 0) {
                return false
            }
        }
        return true
    },restoreElement: function() {
        var a = this.controllerUrl + "/restore_element_revision/" + this.getId() + "/" + this.timeInMills;
        var b = _editor.selector.get();
        new Ajax.Updater(b, a, {insertion: "before",onComplete: this.changeElement.bind(this)})
    },changeElement: function() {
        var a = _editor.selector.get();
        if (EditorUtil.hasFootnote(a)) {
            a.next().remove()
        }
        a.remove();
        _editor.selector.select($(this.getId()));
        var b = _editor.selector.get();
        EditorUtil.scrollTo(b);
        this.overlay.close();
        b.fadeIn()
    },getDetailListUrl: function() {
        return this.controllerUrl + "/get_detail_list_of_element_revision"
    }});
editor.task.Export = Class.create(editor.task.Abstract, {configurePanel: function(a) {
        a.on("click", this.click.bind(this))
    },refresh: function() {
        new Ajax.Updater(this.getPanel(), "/r/pdf/form/" + this.id, {onComplete: function() {
                if ($("export_form")) {
                    this.form = new FormUI("export_form").addTextValidator({element: "pdf_theme",required: true}).addTextValidator({element: "pdf_page_layout",required: true})
                }
            }.bind(this)})
    },click: function(b) {
        var a = b.findElement();
        if (a.tagName === "BUTTON") {
            this.build()
        } else {
            if (a.tagName === "A") {
                if (a.hasClassName("download") || a.hasClassName("download_recent")) {
                    window.preventBeforeunload = true;
                    window.location.href = "/r/pdf/download/" + this.id
                } else {
                    var c = $(a.getAttribute("data-element"));
                    if (c) {
                        var d = c.cumulativeOffset();
                        window.scrollTo(d[0], d[1] - 80)
                    }
                }
            }
        }
        b.stop()
    },build: function() {
        var a = new FileBuilder(this.id, "pdf");
        a.panel = this.panel;
        a.form = this.form;
        a.button = $("button_start");
        a.build()
    }});
editor.task.Find = Class.create(editor.task.Abstract, {configurePanel: function(a) {
        a.addClassName("find_panel");
        a.on("keyup", "#find", this.changeButtonLabel.bind(this));
        a.on("click", "button", this.click.bind(this));
        a.on("change", "input#case_sensitive", function(b) {
            this.disableAllButtons()
        }.bind(this))
    },refresh: function() {
        this.closed();
        new Ajax.Updater(this.getPanel(), "/r/editor_find", {onComplete: this.disableAllButtons.bind(this)})
    },opened: function() {
        if ($("find")) {
            $("find").select();
            this.alert("");
            this.disableAllButtons()
        }
    },closed: function() {
        var a = _editor.getElementPanel().select("span.find");
        a.each(function(b) {
            b.insert({before: b.innerHTML});
            b.remove()
        })
    },alert: function(a) {
        $("find_message").update(I18n.get(a))
    },enableAllButtons: function() {
        $("button_replace").disabled = false;
        $("button_replace_find").disabled = false;
        $("button_replace_all").disabled = false;
        this.changeButtonLabel()
    },disableAllButtons: function() {
        delete this.element;
        delete this.selected;
        delete this.text;
        if ($("button_replace")) {
            this.changeButtonLabel();
            $("button_replace").disabled = true;
            $("button_replace_find").disabled = true;
            $("button_replace_all").disabled = true;
            $("find").focus()
        }
    },changeButtonLabel: function(a) {
        if (a && a.keyCode === 13) {
            return
        }
        if (this.text === $F("find")) {
            $("button_find").innerHTML = I18n.get("label.next")
        } else {
            delete this.element;
            delete this.selected;
            delete this.text;
            $("button_find").innerHTML = I18n.get("label.find");
            this.alert("")
        }
    },click: function(a) {
        a.stop();
        if (_editor.edit) {
            this.alert("label.cannot_user_finder_in_editing");
            return
        }
        this[a.findElement().getAttribute("id").replace("button_", "")]()
    },previous: function() {
        if (this.element) {
            var d = this.element;
            var b = this.index - 1;
            delete this.element;
            delete this.index;
            var e = d.select("span.find");
            if (b != -1 && b < e.size()) {
                return e[b]
            }
            d = d.previous();
            while (d) {
                e = d.select("span.find");
                if (e.size() > 0) {
                    return e.last()
                }
                d = d.previous()
            }
        } else {
            if (!this.selected) {
                var e = _editor.getElementPanel().select("span.find");
                if (e.size() > 0) {
                    return e.last()
                }
            } else {
                var d = this.selected.up(".element");
                var e = d.select("span.find");
                for (var c = 0; c < e.size(); c++) {
                    if (this.selected == e[c]) {
                        if (c > 0) {
                            var a = e[c - 1];
                            if (a.up("cite")) {
                                this.selected = a;
                                return this.previous()
                            } else {
                                return a
                            }
                        }
                    }
                }
                d = d.previous();
                while (d) {
                    e = d.select("span.find");
                    if (e.size() > 0) {
                        return e.last()
                    }
                    d = d.previous()
                }
            }
        }
    },next: function() {
        if (this.element) {
            var d = this.element;
            var b = this.index;
            delete this.element;
            delete this.index;
            var e = d.select("span.find");
            if (b < e.size()) {
                var a = e[b];
                if (a.up("cite")) {
                    this.selected = a;
                    return this.next()
                } else {
                    return a
                }
            }
            d = d.next();
            while (d) {
                e = d.select("span.find");
                if (e.size() > 0) {
                    var a = e[0];
                    if (a.up("cite")) {
                        this.selected = a;
                        return this.next()
                    } else {
                        return a
                    }
                }
                d = d.next()
            }
        } else {
            if (!this.selected) {
                var e = _editor.getElementPanel().select("span.find");
                if (e.size() > 0) {
                    var a = e.first();
                    if (a.up("cite")) {
                        this.selected = a;
                        return this.next()
                    } else {
                        return a
                    }
                }
            } else {
                var d = this.selected.up(".element");
                if (!d) {
                    d = this.selected.up(".footnote")
                }
                var e = d.select("span.find");
                for (var c = 0; c < e.size(); c++) {
                    if (this.selected == e[c]) {
                        if (c + 1 < e.size()) {
                            var a = e[c + 1];
                            if (a.up("cite")) {
                                this.selected = a;
                                return this.next()
                            } else {
                                return a
                            }
                        }
                    }
                }
                d = d.next();
                while (d) {
                    e = d.select("span.find");
                    if (e.size() > 0) {
                        return e[0]
                    }
                    d = d.next()
                }
            }
        }
    },find: function() {
        var b = $F("find");
        if (b === "") {
            return
        }
        this.alert("");
        if (this.text === b) {
            this.selected && this.selected.removeClassName("selected");
            this.selected = $("find_down").checked ? this.next() : this.previous();
            if (this.selected) {
                $("button_replace_find").disabled = false;
                $("button_replace").disabled = false;
                this.selected.addClassName("selected");
                EditorUtil.scrollTo(this.selected)
            } else {
                this.alert($("find_down").checked ? "label.reached_end_of_document" : "label.reached_start_of_document")
            }
        } else {
            this.text = b;
            var a = _editor.getElementPanel();
            new Ajax.Updater(a, "/r/editor_find/find/" + this.id, {parameters: {text: b,case_sensitive: $("case_sensitive").checked},onComplete: function(c) {
                    var d = a.select("span.find");
                    if (d.size() == 0) {
                        this.disableAllButtons();
                        this.alert("label.string_not_found")
                    } else {
                        this.element = _editor.selector.get() && $(_editor.selector.get().getAttribute("id"));
                        if (this.element) {
                            this.index = 0
                        }
                        this.selected = $("find_down").checked ? this.next() : this.previous();
                        this.selected.addClassName("selected");
                        EditorUtil.scrollTo(this.selected);
                        this.enableAllButtons()
                    }
                }.bind(this)})
        }
    },replace: function(e) {
        if ($F("replace_with") === "") {
            if (!confirm(I18n.get("label.replace_with_empty_string?"))) {
                return
            }
        }
        $("button_replace").disabled = true;
        $("button_replace_find").disabled = true;
        var b = this.selected.up(".element");
        if (EditorUtil.hasFootnote(b)) {
            b.footnote = b.next()
        }
        var a = 0;
        var g = this.selected.up(".footnote");
        if (g) {
            b = g.previous();
            b.footnote = g;
            var c = 0;
            var d = g.select("span.find");
            for (; c < d.size(); c++) {
                if (d[c] === this.selected) {
                    break
                }
            }
            d = b.select("cite span.find");
            var f = d[c];
            d = b.select("span.find");
            for (; a < d.size(); a++) {
                if (d[a] === f) {
                    break
                }
            }
        } else {
            var d = b.select("span.find");
            for (; a < d.size(); a++) {
                if (d[a] === this.selected) {
                    break
                }
            }
        }
        new Ajax.Updater(b, "/r/editor_find/replace/" + b.getAttribute("id"), {insertion: "after",parameters: this.getParameter(a),onComplete: function(h) {
                if (b.footnote) {
                    b.footnote.remove()
                }
                this.element = b.next();
                this.index = a;
                if (this.hasTextDuplication()) {
                    this.index++
                }
                b.remove();
                if (e) {
                    this.find()
                }
                _editor.getUndoManager().enable()
            }.bind(this)})
    },hasTextDuplication: function() {
        return $("find_down").checked && $F("replace_with").include($F("find"))
    },replace_find: function() {
        this.replace(true)
    },replace_all: function() {
        if ($F("replace_with") === "") {
            if (!confirm(I18n.get("label.replace_with_empty_string?"))) {
                return
            }
        }
        new Ajax.Updater(_editor.getElementPanel(), "/r/editor_find/replace_all/" + this.id, {parameters: this.getParameter(-1),onComplete: function() {
                _editor.getUndoManager().enable()
            }});
        this.disableAllButtons()
    },getParameter: function(b) {
        var a = {text: $F("find"),replace_with: $F("replace_with"),case_sensitive: $("case_sensitive").checked};
        if (b != -1) {
            a.index = b
        }
        return a
    }});
editor.task.Help = Class.create(editor.task.Abstract, {configurePanel: function(a) {
        a.addClassName("help_panel")
    },refresh: function(a) {
        new Ajax.Updater(this.getPanel(), "/r/editor_help")
    }});
editor.task.Outline = Class.create(editor.task.Abstract, {configurePanel: function(a) {
        a.addClassName("outline_panel");
        a.on("click", ".button_panel a", function(c) {
            var b = c.findElement();
            if (!b.hasClassName("selected")) {
                this.refresh(b.className)
            }
            c.stop()
        }.bind(this));
        a.on("click", "li a", this.click);
        a.on("click", ".item", this.click)
    },refresh: function(d) {
        var a = this.getPanel();
        if (a) {
            a.setAttribute("id", "_outline_panel");
            if (!d) {
                var c = a.down(".button_panel a.selected");
                d = c ? $w(c.className)[0] : "heading"
            }
            var b = "/r/editor_tool/display_outline/" + this.getId() + "/" + d;
            new Ajax.Updater(a, b, {onComplete: function(e) {
                    if (Prototype.Browser.IE) {
                        $(a).hide();
                        setTimeout("$('_outline_panel').show();", 100)
                    }
                }.bind(this)})
        }
    },click: function(b) {
        var a = b.findElement("a");
        if (!a) {
            a = b.findElement(".item")
        } else {
            a = a.up()
        }
        EditorUtil.moveTo(a.getAttribute("id").substring(1));
        b.stop()
    }});
var EditorTaskPanel = Class.create({initialize: function(a, b) {
        this.controller = a;
        this.id = b;
        document.body.down().on("click", "a", this.click.bind(this))
    },getPanel: function() {
        if (!this.panel) {
            this.panel = new Element("section", {"class": "task_panel"});
            this.panel.on("click", "a.close", this.close.bind(this));
            this.panel.on("click", "a.refresh", this.refresh.bind(this));
            document.body.appendChild(this.panel);
            var a = "<header>";
            a += "<h1></h1>";
            a += "<span>";
            a += "<a href='#' class='refresh'><img src='/resource/image/app/refresh.png' title='" + I18n.get("label.refresh") + "'></a>";
            a += "<a href='#' class='close'><img src='/resource/image/app/close.png' title='" + I18n.get("label.close") + "'></a>";
            a += "</span>";
            a += "</header>";
            a += "<section></section>";
            this.panel.update(a);
            this.title = this.panel.down("h1");
            this.section = this.panel.down("section")
        }
        return this.panel
    },click: function(b, a) {
        a = b ? b.findElement() : a;
        var c = a.innerHTML;
        if (!c || c === "&nbsp;") {
            c = a.getAttribute("title")
        }
        if (a.hasClassName("web_viewer")) {
            window.open("/r/viewer/book/" + this.id)
        } else {
            if (a.hasClassName("export")) {
                this.exportTask = this.exportTask || new editor.task.Export(this.id);
                this.setTask(this.exportTask, c)
            } else {
                if (a.hasClassName("print")) {
                    window.print()
                } else {
                    if (a.hasClassName("find_replace")) {
                        this.findTask = this.findTask || new editor.task.Find(this.id);
                        this.setTask(this.findTask, c)
                    } else {
                        if (a.hasClassName("view_toc")) {
                            this.outlineTask = this.outlineTask || new editor.task.Outline(this.id);
                            this.setTask(this.outlineTask, c)
                        } else {
                            if (a.hasClassName("view_chapter_revisions")) {
                                this.revisionTask = this.revisionTask || new editor.task.ChapterRevision(this.id);
                                this.setTask(this.revisionTask, c)
                            } else {
                                if (a.hasClassName("view_removed_elements")) {
                                    this.removedTask = this.removedTask || new editor.task.RemovedElement(this.id);
                                    this.setTask(this.removedTask, c)
                                } else {
                                    if (a.hasClassName("see_also")) {
                                        this.seeAlsoTask = this.seeAlsoTask || new editor.task.SeeAlso(this.id);
                                        this.setTask(this.seeAlsoTask, c)
                                    } else {
                                        if (a.hasClassName("help")) {
                                            this.helpTask = this.helpTask || new editor.task.Help(this.id);
                                            this.setTask(this.helpTask, c)
                                        } else {
                                            if (a.hasClassName("option")) {
                                                this.elementOptionTask = this.elementOptionTask || new editor.task.ElementOption();
                                                this.setTask(this.elementOptionTask, c)
                                            } else {
                                                if (a.hasClassName("view_revision")) {
                                                    this.viewElementRevision(c)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        b && b.stop()
    },viewElementRevision: function(a) {
        a = a || I18n.get("label.view_revision");
        this.elementRevisionTask = this.elementRevisionTask || new editor.task.ElementRevision();
        this.setTask(this.elementRevisionTask, a)
    },setTask: function(a, b) {
        this.currentTask && this.currentTask.close();
        b && this.show(b);
        a.open(this.section);
        this.currentTask = a
    },show: function(d) {
        var c = document.viewport.getWidth() - 840;
        var a = document.viewport.getHeight() - 145;
        var b = {display: "block",height: a + "px",left: "830px",width: c + "px"};
        if (c < 400) {
            b.left = (document.viewport.getWidth() - 410) + "px";
            b.width = "400px"
        }
        this.getPanel().setStyle(b);
        this.section.setStyle({height: (a - 81) + "px"});
        this.title.update(d || "")
    },refresh: function(a) {
        if (this.currentTask && this.currentTask.refresh) {
            this.currentTask.refresh()
        }
        a && a.stop()
    },close: function(b, a) {
        if (this.panel && (a || this.currentTask === this.elementOptionTask || this.currentTask === this.elementRevisionTask)) {
            this.currentTask.close();
            this.panel.hide()
        }
        b && b.stop()
    },refreshOrClose: function() {
        if (!this.currentTask) {
            return
        }
        if (this.currentTask === this.elementOptionTask) {
            this.close()
        } else {
            this.refresh()
        }
    },updateOutline: function() {
        this.outlineTask && this.outlineTask.refresh()
    },visible: function() {
        return this.panel && this.getPanel().visible()
    }});
editor.task.RemovedElement = Class.create(editor.task.AbstractRevision, {getInitialUrl: function() {
        return this.controllerUrl + "/get_count_list_of_removed_element/" + this.getId()
    },view: function(c) {
        if (c.detail_view && c.detail_view.visible()) {
            BaseUtil.setText(c, I18n.get("label.view"))
        } else {
            BaseUtil.setText(c, I18n.get("label.hide"))
        }
        if (c.detail_view) {
            this.toggleList(c.detail_view)
        } else {
            var d = c.up("li");
            var a = d.id;
            var b = this.controllerUrl + "/get_removed_element/" + a;
            new Ajax.Updater(d, b, {insertion: "bottom",onComplete: function() {
                    c.detail_view = d.down("div").next();
                    c.detail_view.revisionId = a;
                    this.processElement(c.detail_view)
                }.bind(this)})
        }
    },viewDetails: function(b) {
        this.changeExpandLink(b, b.detail_list);
        var d = b.up("li");
        var f = d.id;
        var e = d.previous();
        var c;
        if (e) {
            c = d.previous().id
        } else {
            c = "current_time"
        }
        var a = this.controllerUrl + "/get_detail_list_of_removed_element/" + this.getId() + "/" + f + "/" + c;
        if (b.detail_list) {
            this.toggleList(b.detail_list)
        } else {
            b.detail_list = new Element("ul", {"class": "removed_element_list"});
            d.insert({bottom: b.detail_list});
            new Ajax.Updater(b.detail_list, a)
        }
    },processElement: function(a) {
        a.mouseover = a.on("mouseover", this.over.bind(this));
        a.mouseleave = a.on("mouseleave", this.out.bind(this));
        a.mousedown = a.on("mousedown", this.drag.bind(this))
    },over: function(b) {
        var a = b.findElement(".element");
        if (a) {
            a.addClassName("over")
        }
    },out: function(b) {
        var a = b.findElement(".element");
        if (a) {
            a.removeClassName("over")
        }
    },drag: function(a) {
        this.baseElement = a.findElement(".element");
        this.element = this.baseElement.clone(true);
        this.element.revisionId = this.baseElement.up("li").id;
        this.element.addClassName("move");
        this.element.setStyle({position: "absolute",left: a.pointerX() + "px",top: a.pointerY() + "px",width: this.baseElement.getWidth() + "px"});
        document.body.appendChild(this.element);
        document.body.style.cursor = "move";
        this.moveHandler = document.on("mousemove", this.move.bind(this));
        this.upHandler = document.on("mouseup", this.done.bind(this));
        a.stop()
    },move: function(d) {
        var f = d.pointerY();
        var e = d.pointerX();
        var c = _editor.getElementPanel();
        var b = c.cumulativeOffset().left + c.getWidth();
        if (e > b) {
            _editor.endDrag();
            _editor.currentElement = undefined;
            _editor.startDrag()
        }
        var a = this.element.viewportOffset().top;
        if (!this.viewPortHeight) {
            this.viewPortHeight = document.viewport.getHeight()
        }
        if (a < 100) {
            window.scrollBy(0, -100)
        } else {
            if (a > this.viewPortHeight - 100) {
                window.scrollBy(0, 100)
            }
        }
        this.element.style.left = e + "px";
        this.element.style.top = f + "px";
        d.stop()
    },done: function(f) {
        this.stopDrag();
        this.blockWindow();
        var c = this.element;
        c.removeClassName("move");
        var b = _editor.currentElement;
        if (!b) {
            this.cancelDrag();
            this.block.remove();
            return
        }
        var e = b.getLayout();
        var h = e.get("left");
        var g = e.get("top");
        if (editor.insertion === "after") {
            g += e.get("margin-box-height");
            if (EditorUtil.hasFootnote(b)) {
                g += b.next().getLayout().get("margin-box-height");
                b = b.next()
            }
        }
        var a = _editor.getElementPanel();
        var d = a.down(".element");
        this.element.setStyle({width: d.getWidth() + "px"});
        c.style.top = g + "px";
        c.style.left = (h + 200) + "px";
        c.move(h, g, function() {
            b.insert(EditorUtil.getInsertion(c));
            if (EditorUtil.hasFootnote(this.baseElement)) {
                c.insert({after: this.baseElement.next().clone(true)})
            }
            var i = {};
            i.id = c.revisionId;
            EditorUtil.surround(c, i);
            new Ajax.Request(this.controllerUrl + "/restore_removed_element", {parameters: i,onComplete: function(j) {
                    this.changeRestoredList();
                    this.block.remove()
                }.bind(this)})
        }.bind(this));
        f.stop()
    },stopDrag: function() {
        document.body.style.cursor = "auto";
        var a = this.element.readAttribute("data-version");
        this.element.writeAttribute("data-version", parseInt(a, 10) + 1);
        this.moveHandler.stop();
        this.upHandler.stop();
        _editor.endDrag()
    },cancelDrag: function() {
        document.body.style.cursor = "auto";
        this.element.remove();
        this.moveHandler.stop();
        this.upHandler.stop();
        _editor.endDrag()
    },changeRestoredList: function() {
        this.baseElement.addClassName("restored");
        this.baseElement.mouseover.stop();
        this.baseElement.mouseleave.stop();
        this.baseElement.mousedown.stop()
    },blockWindow: function() {
        var a = document.viewport.getWidth();
        var b = document.viewport.getHeight();
        this.block = new Element("div");
        this.block.setStyle({width: a + "px",height: b + "px",left: "0",position: "fixed",top: "0",zIndex: "399"});
        document.body.appendChild(this.block)
    }});
editor.task.SeeAlso = Class.create(editor.task.Abstract, {configurePanel: function(a) {
        a.addClassName("see_also_panel");
        a.on("click", "ul a.up", this.up.bind(this));
        a.on("click", "ul a.down", this.down.bind(this));
        a.on("click", "ul a.remove", this.remove.bind(this));
        a.on("click", "#see_also_type input", this.changeMode.bind(this));
        a.on("click", "button", this.add.bind(this));
        a.on("change", "#see_also_book", this.getChapters.bind(this));
        a.on("change", "#see_also_chapter", this.getHeadings.bind(this));
        a.on("click", "#see_also_heading_panel", this.headingClicked.bind(this))
    },refresh: function(a) {
        new Ajax.Updater(this.getPanel(), "/r/see_also/get/" + this.getId())
    },up: function(c) {
        var a = c.findElement("li");
        var b = a.previous();
        if (b) {
            b.insert({before: a});
            a.fadeIn();
            this.sort()
        }
        c.stop()
    },down: function(c) {
        var a = c.findElement("li");
        var b = a.next();
        if (b) {
            b.insert({after: a});
            a.fadeIn();
            this.sort()
        }
        c.stop()
    },sort: function() {
        var a = $A();
        $("see_also_list").select("li").each(function(b) {
            a.push(b.getAttribute("id"))
        });
        new Ajax.Request("/r/see_also/sort/" + this.getId(), {parameters: {value: a}})
    },remove: function(b) {
        var a = b.findElement("li");
        new Ajax.Request("/r/see_also/remove/" + this.getId() + "/" + a.getAttribute("id"), {onComplete: function(c) {
                a.fadeOut(function() {
                    a.remove()
                })
            }});
        b.stop()
    },changeMode: function(a) {
        var b = $("see_also_type").down("input").checked;
        $("see_also_form").setAttribute("class", b ? "book" : "web");
        if (b) {
            $("see_also_book").focus()
        } else {
            $("see_also_title").focus()
        }
    },add: function(a) {
        new Ajax.Updater("see_also_list", "/r/see_also/add/" + this.getId(), {parameters: $("see_also_form").serialize(),onComplete: function(b) {
                $("see_also_reference").value = "";
                $("see_also_title").value = "";
                $("see_also_link").value = ""
            }});
        a.stop()
    },getChapters: function(b) {
        var d = b.findElement("select").value;
        this.setReference(d);
        var a = $("see_also_chapter");
        a.options.length = 0;
        var c = function(e) {
            e.responseJSON.each(function(g, f) {
                if (f !== 0) {
                    var h = g[1];
                    if (g[2] === "true") {
                        h = "- " + h
                    }
                    a.options[a.options.length] = new Option(h, g[0])
                }
            }.bind(this))
        }.bind(this);
        new Ajax.Request("/r/editor_link/get_chapters/" + d, {onSuccess: c});
        b.stop()
    },getHeadings: function(a) {
        var b = a.findElement("select").value;
        this.setReference(b);
        new Ajax.Updater($("see_also_heading_panel"), "/r/editor_link/display_panel/" + b);
        a.stop()
    },headingClicked: function(a) {
        var b = a.findElement("input").value;
        this.setReference(b)
    },setReference: function(a) {
        $("see_also_reference").value = a
    }});
var EditorUtil = {};
EditorUtil.isValid = function(a) {
    return a.hasClassName("element") && a.visible()
};
EditorUtil.getType = function(a) {
    return $w(a.className)[1]
};
EditorUtil.isHeadingType = function(a) {
    return EditorUtil.getType(a).startsWith("heading")
};
EditorUtil.getHeadingLevel = function(a) {
    return Number(EditorUtil.getType(a).replace("heading", ""))
};
EditorUtil.isNew = function(a) {
    var b = (typeof a == "string") ? a : a.getAttribute("id");
    return b.startsWith("unknown")
};
EditorUtil.generateId = function() {
    if (!EditorUtil.unknownId) {
        EditorUtil.unknownId = 1
    }
    return "unknown" + EditorUtil.unknownId++
};
EditorUtil.getChapterId = function() {
    return EditorUtil.id
};
EditorUtil.getParameter = function(c) {
    var a = {chapter_id: EditorUtil.getChapterId()};
    if (!EditorUtil.isNew(c)) {
        a.id = c.getAttribute("id")
    }
    var b = c.getAttribute("data-version");
    if (b) {
        a.version = b
    }
    return EditorUtil.surround(c, a)
};
EditorUtil.surround = function(a, d) {
    if (!a) {
        return d
    }
    var c = a.previous(".element");
    if (c) {
        d.previous_id = c.getAttribute("id")
    }
    var b = a.next(".element");
    while (b && !b.visible()) {
        b = b.next()
    }
    if (b) {
        d.next_id = b.getAttribute("id")
    }
    return d
};
EditorUtil.getAction = function(b) {
    var a = b.findElement("a");
    return $w(a.className.replace("link ", ""))[0]
};
EditorUtil.dispatch = function(a) {
    this[EditorUtil.getAction(a)](a);
    a.stop()
};
EditorUtil.getInsertion = function(b) {
    var a = {};
    a[editor.insertion] = b;
    return a
};
EditorUtil.moveTo = function(a) {
    a = $(a);
    if (a) {
        var b = a.cumulativeOffset();
        window.scrollTo(b[0], b[1] - 80)
    }
};
EditorUtil.scrollTo = function(b) {
    if (b) {
        var d = b.viewportOffset().top;
        if (d < 90) {
            var c = document.viewport.getScrollOffsets().top;
            window.scrollTo(0, c + d - 90)
        } else {
            var a = document.viewport.getHeight();
            d += b.getLayout().get("margin-box-height");
            if (d > a) {
                var c = document.viewport.getScrollOffsets().top;
                window.scrollTo(0, c + (d - a) + 70)
            }
        }
    }
};
EditorUtil.scrollToTop = function(a) {
    if (a) {
        var c = a.viewportOffset().top;
        var b = document.viewport.getScrollOffsets().top;
        window.scrollTo(0, b + c - 90)
    }
};
EditorUtil.scrollToBottom = function(a) {
    if (a) {
        var c = document.viewport.getHeight() - a.getLayout().get("margin-box-height");
        var b = document.viewport.getScrollOffsets().top;
        window.scrollTo(0, b - c)
    }
};
EditorUtil.addPseudoElement = function(d, c) {
    if (d && editor.insertion === "after" && EditorUtil.hasFootnote(d)) {
        d = d.next()
    }
    var f = EditorUtil.generateId();
    var a = new Element("div", {id: f,"class": "element pseudo"});
    var e = {};
    var b = d ? editor.insertion : "bottom";
    e[b] = a;
    (d || c).insert(e);
    return a
};
EditorUtil.openEditor = function(b, a) {
    EditorUtil.configuireEditor(b, a);
    a.addClassName("pseudo")
};
EditorUtil.configuireEditor = function(b, a) {
    b.element = a;
    b.setStyle({top: a.cumulativeOffset().top + "px"});
    a.setStyle({marginBottom: (b.getLayout().get("margin-box-height") + 10) + "px"});
    b.show()
};
EditorUtil.hasFootnote = function(a) {
    if (!a) {
        return false
    }
    a = a.next();
    return a && a.hasClassName("footnote")
};
EditorUtil.isBlank = function(a) {
    if (!a) {
        return false
    }
    if (window.getSelection) {
        return (a.innerText || a.textContent).blank()
    } else {
        return a.innerText.blank()
    }
};
EditorUtil.isObject = function(a) {
    return a === "toc" || a === "list_of_figures" || a === "list_of_tables" || a === "list_of_codes" || a === "glossary" || a === "index" || a === "page_break" || a === "blank_page" || a === "space" || a === "horizontal_line" || a === "clear_float" || a === "layout_page" || a === "single_design_page" || a === "include"
};
editor.util.BookElementSelector = Class.create({initialize: function(a) {
        this.books = a.books;
        this.chapters = a.chapters;
        this.panel = a.panel;
        this.path = a.path;
        this.bindSelection = a.bindSelection;
        this.books.on("change", this.updateChapters.bind(this));
        this.chapters.on("change", this.updateChapterPanel.bind(this));
        this.panel.on("click", a.clickTarget || "img", a.selectElement)
    },setBookAndChapter: function(b, a) {
        this.book = b;
        this.chapter = a;
        if (this.book) {
            this.books.value = this.book;
            this.updateChapters()
        }
    },updateChapters: function(a) {
        this.chapters.options.length = 0;
        var b = this.books.value;
        if (!b) {
            return
        }
        new Ajax.Request("/r/editor_link/get_chapters/" + b, {onSuccess: this.updateChapterOptions.bind(this)})
    },updateChapterOptions: function(a) {
        a.responseJSON.each(function(b) {
            var c = b[1];
            if (b[2] === "true") {
                c = "- " + c
            }
            this.chapters.options[this.chapters.options.length] = new Option(c, b[0])
        }.bind(this));
        if (this.chapter) {
            this.chapters.value = this.chapter;
            if (this.chapters.value) {
                this.updateChapterPanel()
            } else {
                this.chapters.options[0].selected = true
            }
        }
    },updateChapterPanel: function(b) {
        var a = this.chapters.value;
        if (!a) {
            return
        }
        new Ajax.Updater(this.panel, this.path + "/" + a, {onComplete: this.bindSelection})
    }});
editor.util.ContentDisplayer = Class.create({initialize: function(a, b) {
        this.controller = a;
        this.id = b;
        this.title = $(document.body).down("h1 #book_title");
        this.title.on("click", this.click.bind(this))
    },click: function(a) {
        if (!this.controller.edit) {
            this.overlay = new Overlay(this.title.innerHTML, 510);
            new Ajax.Updater(this.overlay.getContentPanel(), "/r/editor_tool/get_contents/" + this.id, {onComplete: function(b) {
                    var c = this.title.cumulativeOffset();
                    this.overlay.show(c.left, this.title.cumulativeOffset().top + 30)
                }.bind(this)})
        }
        a.stop()
    }});
editor.util.Cursor = Class.create({refresh: function(a) {
        this.range = this.getRange();
        if (window.getSelection) {
            this.outer = this.range.endContainer.parentNode;
            if (Prototype.Browser.Opera) {
                while (this.outer.nodeType !== 1) {
                    this.outer = this.outer.parentNode
                }
            }
        } else {
            this.outer = this.range.parentElement()
        }
    },enabled: function() {
        return this.range && this.outer
    },startTagReached: function() {
        return this.isStartTagOfLine() && !this.outerIsContainer() && this.isStartOfTag()
    },endTagReached: function() {
        return this.isEndTagOfLine() && !this.outerIsContainer() && this.isEndOfTag()
    },startFootnoteReached: function() {
        var a = this.range;
        if (window.getSelection) {
            var b = a.startContainer.previousSibling;
            return this.isStartOfTag() && b && b.tagName === "CITE" && !b.previousSibling
        } else {
            this.moveAroundFootnote(false);
            return false
        }
    },endFootnoteReached: function() {
        if (window.getSelection) {
            var a = this.range;
            if (a.startContainer.length - a.endOffset < 2) {
                return false
            }
            var b = a.endContainer.nextSibling;
            return b && b.tagName === "CITE" && !b.nextSibling
        } else {
            this.moveAroundFootnote(true);
            return false
        }
    },moveAroundFootnote: function(a) {
        if (this.outer.tagName !== "SPAN") {
            return
        }
        var c = this.outer.parentElement;
        if (c.tagName === "CITE") {
            var b = document.body.createTextRange();
            if (a && !c.nextSibling) {
                c.insert({after: "&nbsp;"})
            }
            b.moveToElementText(c);
            b.collapse(a ? false : true);
            b.select()
        }
    },outerIsContainer: function() {
        var b = this.outer.tagName;
        if (b === "DIV" || b === "TD" || b === "TH") {
            return true
        }
        if (b === "SPAN") {
            var a = this.outer.getAttribute("class");
            return a !== "mark index" && a != "callout"
        }
        return false
    },isStartTagOfLine: function() {
        return !this.outer.previousSibling
    },isEndTagOfLine: function() {
        var a = this.outer.nextSibling;
        return !a || a.data === "" || a.tagName === "BR"
    },isStartOfTag: function() {
        if (window.getSelection) {
            return this.range.startOffset === 0
        } else {
            var a = document.body.createTextRange();
            a.moveToElementText(this.outer);
            a.setEndPoint("EndToEnd", this.range);
            caretOffset = a.text.length;
            return caretOffset === 0
        }
    },isEndOfTag: function() {
        if (window.getSelection) {
            return this.range.endOffset === this.range.startContainer.length
        } else {
            var b = document.body.createTextRange();
            b.moveToElementText(this.outer);
            var a = b.text.length;
            b.setEndPoint("EndToEnd", this.range);
            offset2 = b.text.length;
            return a === offset2
        }
    },addSpaceToFront: function() {
        this.outer.insert({before: "&nbsp;"})
    },addSpaceToEnd: function() {
        this.outer.insert({after: "&nbsp;"})
    },addSpaceToFootnote: function(a) {
        if (a) {
            this.range.startContainer.previousSibling.insert({before: "&nbsp;"})
        } else {
            this.range.endContainer.nextSibling.insert({after: "&nbsp;"})
        }
    },getRange: function() {
        if (window.getSelection) {
            var a = window.getSelection();
            return a.rangeCount > 0 ? a.getRangeAt(0) : null
        } else {
            if (Prototype.Browser.IE) {
                return document.selection.createRange()
            }
        }
    }});
editor.util.DropPosition = Class.create({initialize: function(a) {
        this.dropPosition = new Element("div", {"class": "drop_position"});
        a.append(this.dropPosition)
    },show: function(d, b) {
        var c = b.getLayout();
        var e = c.get("top");
        var a = c.get("margin-box-height");
        if (EditorUtil.hasFootnote(b)) {
            a += b.next().getLayout().get("margin-box-height")
        }
        if ((d.pointerY() - e) > a / 2) {
            e += a;
            editor.insertion = "after"
        } else {
            editor.insertion = "before"
        }
        this.dropPosition.setStyle({display: "block",top: (e - 15) + "px"})
    },hide: function() {
        this.dropPosition.hide()
    }});
editor.util.ImageSaver = Class.create({save: function(a) {
        new Ajax.Updater(a, "/r/save_image_internally/" + a.getAttribute("id") + "/" + a.getAttribute("data-version"), {insertion: "after",onComplete: function(b) {
                if (b.headerJSON && b.headerJSON.version) {
                    new editor.util.VersionChecker(_editor).show(a, b.headerJSON)
                } else {
                    var c = a.next(".element");
                    a.remove();
                    if (EditorUtil.hasFootnote(c)) {
                        c.next().remove()
                    }
                    c.fadeIn();
                    _editor.getUndoManager().enable()
                }
            }.bind(this)})
    }});
editor.util.Include = Class.create({initialize: function(a) {
        a.down(".select_element_to_include").on("click", this.open.bind(this))
    },setBookAndChapter: function(b, a) {
        this.book = b;
        this.chapter = a
    },open: function(b) {
        var a = "<div id='include_panel'></div>";
        this.overlay = new Overlay("label.include", 750);
        this.overlay.addButton("save", this.save.bind(this));
        new Ajax.Updater("include_panel", "/r/include_element", {onComplete: this.configure.bind(this)});
        this.overlay.show(150, 100, a);
        b.stop()
    },configure: function(a) {
        this.panel = $("include_chapter_panel");
        this.selector = new editor.util.BookElementSelector({books: $("include_select_book"),chapters: $("include_select_chapter"),panel: $("include_chapter_panel"),path: "/r/include_element/get_chapter_panel",clickTarget: "input",selectElement: this.selectElement.bind(this),bindSelection: this.bindSelection.bind(this)});
        if (this.book) {
            this.selector.setBookAndChapter(this.book, this.chapter)
        }
    },save: function(a) {
        this.book = $F("include_select_book");
        this.chapter = $F("include_select_chapter");
        var b;
        this.panel.select("input").each(function(d) {
            if (d.checked && !d.disabled) {
                var c;
                if (d.id === "include_chapter") {
                    c = d.value + "_chapter"
                } else {
                    if (d.hasAttribute("section_selected")) {
                        c = d.value + "_section"
                    } else {
                        c = d.value
                    }
                }
                if (b) {
                    b += ";" + c
                } else {
                    b = c
                }
            }
        });
        if (b) {
            $("object_element_to_include").value = b;
            this.overlay.close(a)
        } else {
            I18n.alert("label.select_element_to_include")
        }
        a.stop()
    },bindSelection: function(a) {
        $F("object_element_to_include").split(";").each(function(d) {
            if (d.endsWith("_chapter")) {
                var b = $("include_chapter");
                if (b) {
                    b.checked = true;
                    this.selectChapter(b)
                }
            } else {
                if (d.endsWith("_section")) {
                    var e = $("include_" + d.replace("_section", ""));
                    if (e) {
                        e.checked = true;
                        this.selectSection(e, true)
                    }
                } else {
                    var c = $("include_" + d);
                    if (c) {
                        c.checked = true
                    }
                }
            }
        }.bind(this));
        this.overlay.contentChanged()
    },selectElement: function(b) {
        var a = b.element();
        if (a.id === "include_chapter") {
            this.selectChapter(a)
        } else {
            if (a.hasAttribute("data-level")) {
                if (a.hasAttribute("section_selected")) {
                    this.selectSection(a, false)
                } else {
                    if (a.checked && confirm(I18n.get("label.select_section"))) {
                        this.selectSection(a, true)
                    }
                }
            }
        }
    },selectChapter: function(a) {
        this.panel.select("input").each(function(b) {
            if (a !== b) {
                b.disabled = a.checked;
                b.checked = a.checked
            }
        })
    },selectSection: function(b, a) {
        if (b.hasAttribute("data-level")) {
            if (a) {
                b.setAttribute("section_selected", "true")
            } else {
                b.removeAttribute("section_selected")
            }
            var d = Number(b.getAttribute("data-level"));
            var c = b.up(1).next();
            while (c) {
                b = c.down(1);
                if (!b.hasAttribute("data-level") || d < Number(b.getAttribute("data-level"))) {
                    b.disabled = a;
                    b.checked = a;
                    c = b.up(1).next()
                } else {
                    break
                }
            }
        }
    }});
editor.util.Option = Class.create({initialize: function(a) {
        this.controller = a;
        this.panel = $("editor_option_panel");
        this.panel.on("click", "li li", this.click.bind(this));
        if (window.localStorage.getItem("hide_character_mark")) {
            this.panel.down(".hide_character_mark").addClassName("checked");
            document.body.addClassName("hide_character_mark")
        }
    },show: function() {
        if (this.panel.visible()) {
            this.close();
            return
        }
        this.closeHandler = document.on("click", function(a) {
            a.findElement("#editor_option_panel");
            if (!a.findElement("#editor_option_panel")) {
                this.close()
            }
        }.bind(this));
        this.panel.setStyle({left: (790 - this.panel.getWidth() - 5) + "px"});
        this.panel.show()
    },close: function() {
        if (this.closeHandler) {
            this.closeHandler.stop();
            delete this.closeHandler
        }
        this.panel.hide()
    },click: function(b) {
        var a = b.findElement("li");
        if (a.hasClassName("hide_character_mark")) {
            this.hideCharacterMark(a)
        } else {
            this.collapseAllSections(a)
        }
        b.stop()
    },hideCharacterMark: function(a) {
        if (a.hasClassName("checked")) {
            a.removeClassName("checked");
            document.body.removeClassName("hide_character_mark");
            window.localStorage.removeItem("hide_character_mark")
        } else {
            a.addClassName("checked");
            document.body.addClassName("hide_character_mark");
            window.localStorage.setItem("hide_character_mark", true)
        }
    },collapseAllSections: function(a) {
        if (a.hasClassName("checked")) {
            a.removeClassName("checked");
            this.expand()
        } else {
            a.addClassName("checked");
            this.collapse();
            this.controller.selectFirstElement(event)
        }
    },collapse: function() {
        var b = $("element_panel").down("h1");
        if (b) {
            var c = b;
            var a = c.getAttribute("id");
            this.toggleHandler(c, "collapse");
            while ((b = b.next(".element"))) {
                if (EditorUtil.isHeadingType(b)) {
                    if (b.tagName === "H1") {
                        c = b
                    } else {
                        if (this.isLowerLevel(c, b)) {
                            c = b;
                            b.setAttribute("outline_owner", a)
                        } else {
                            c = this.getParentHeading(b, c);
                            b.setAttribute("outline_owner", c.getAttribute("outline_owner"))
                        }
                    }
                    a = b.getAttribute("id");
                    this.toggleHandler(b, "collapse")
                } else {
                    b.setAttribute("outline_owner", a)
                }
                if (b.tagName !== "H1") {
                    b.hide();
                    if (EditorUtil.hasFootnote(b)) {
                        b = b.next();
                        b.hide()
                    }
                }
            }
        }
    },getParentHeading: function(a, b) {
        while (this.isLowerLevel(b, a)) {
            b = $(b.getAttribute("outline_owner"))
        }
        return b
    },isLowerLevel: function(a, b) {
        return EditorUtil.getHeadingLevel(a) < EditorUtil.getHeadingLevel(b)
    },expand: function() {
        var a = $("element_panel").down("h1");
        if (!a) {
            return
        }
        this.toggleHandler(a, "expand");
        while ((a = a.next(".element"))) {
            if (EditorUtil.isHeadingType(a)) {
                this.toggleHandler(a, "expand")
            }
            a.removeAttribute("outline_owner");
            a.show();
            if (EditorUtil.hasFootnote(a)) {
                a = a.next();
                a.show()
            }
        }
    },toggleHandler: function(a, c) {
        var b = a.down();
        if (c === "expand") {
            b.removeClassName("collapsed");
            b.setAttribute("title", I18n.get("label.collapsed"))
        } else {
            b.addClassName("collapsed");
            b.setAttribute("title", I18n.get("label.expand"))
        }
    }});
editor.util.Outline = Class.create({run: function(a) {
        if (a.hasClassName("collapsed")) {
            this.expand(a)
        } else {
            this.collapse(a)
        }
    },getSection: function(c) {
        var a = $A();
        a.push(c);
        var b = this.getHeadingLevel(c);
        while ((c = c.next(".element")) && this.isChildren(b, c)) {
            if (EditorUtil.hasFootnote(c)) {
                c.footnote = c.next()
            }
            a.push(c)
        }
        return a
    },getAllSection: function(c, e) {
        if (e.size() > 1) {
            var a = $A();
            e.each(function(f) {
                a.push(f)
            });
            var d = e.last();
            if (EditorUtil.isHeadingType(d) && d.down(".collapsed")) {
                var b = this.getHeadingLevel(d);
                while ((d = d.next(".element")) && this.isChildren(b, d)) {
                    if (EditorUtil.hasFootnote(d)) {
                        d.footnote = d.next()
                    }
                    a.push(d)
                }
            }
            return a
        } else {
            return this.getSection(c)
        }
    },expand: function(c) {
        c.removeClassName("collapsed");
        c.setAttribute("title", I18n.get("label.collapse"));
        c = c.up();
        if (EditorUtil.hasFootnote(c)) {
            c.next().show()
        }
        var a = c.getAttribute("id");
        var b = this.getHeadingLevel(c);
        while ((c = c.next(".element")) && this.isChildren(b, c)) {
            if (c.getAttribute("outline_owner") === a) {
                c.removeAttribute("outline_owner");
                c.show();
                if (EditorUtil.hasFootnote(c)) {
                    c = c.next();
                    c.show()
                }
            }
        }
    },collapse: function(c) {
        c.addClassName("collapsed");
        c.setAttribute("title", I18n.get("label.expand"));
        c = c.up();
        if (EditorUtil.hasFootnote(c)) {
            c.next().hide()
        }
        var a = c.getAttribute("id");
        var b = this.getHeadingLevel(c);
        while ((c = c.next(".element")) && this.isChildren(b, c)) {
            if (c.visible()) {
                c.setAttribute("outline_owner", a);
                c.hide();
                if (EditorUtil.hasFootnote(c)) {
                    c = c.next();
                    c.hide()
                }
            }
        }
    },getHeadingLevel: function(a) {
        return EditorUtil.getHeadingLevel(a)
    },isChildren: function(b, a) {
        var c = EditorUtil.getType(a);
        if (c && c.startsWith("heading")) {
            return b < Number(c.replace("heading", ""))
        } else {
            return true
        }
    }});
editor.util.PrintImage = Class.create({run: function(a) {
        this.element = a;
        if (!a.getAttribute("data-event-configured")) {
            a.on("change", this.upload.bind(this))
        }
    },upload: function(b) {
        var c = this.element.up(".element").getAttribute("id");
        var a = this.element.up("form");
        a.down("input[name='id']").value = c;
        this.uploader = new Uploader("editor_print_image", a, this.uploadCompleted.bind(this));
        this.uploader.upload()
    },uploadCompleted: function() {
        _editor.selector.clear();
        var a = this.element.up(".element");
        var b = a.getAttribute("id");
        new Ajax.Updater(a, "/r/editor_print_image/get/" + b + "/" + EditorUtil.getChapterId(), {insertion: "after",onComplete: function(c) {
                if (c.headerJSON && c.headerJSON.code) {
                    new editor.util.Synchronizer(this.controller).show(a, c.headerJSON)
                } else {
                    var d = a.next(".element");
                    a.remove();
                    if (EditorUtil.hasFootnote(d)) {
                        d.next().remove()
                    }
                    d.fadeIn();
                    _editor.getUndoManager().enable()
                }
            }.bind(this)})
    },view: function(a) {
        var b = a.up(".element").getAttribute("id");
        window.open("/r/editor_print_image/view/" + b + "/" + EditorUtil.getChapterId())
    },remove: function(a) {
        _editor.selector.clear();
        var a = a.up(".element");
        var b = a.getAttribute("id");
        new Ajax.Updater(a, "/r/editor_print_image/remove/" + b + "/" + EditorUtil.getChapterId(), {insertion: "after",onComplete: function(c) {
                if (c.headerJSON && c.headerJSON.code) {
                    new editor.util.Synchronizer(this.controller).show(a, c.headerJSON)
                } else {
                    var d = a.next(".element");
                    a.remove();
                    if (EditorUtil.hasFootnote(d)) {
                        d.next().remove()
                    }
                    d.fadeIn();
                    _editor.getUndoManager().enable()
                }
            }.bind(this)})
    }});
editor.util.Selector = Class.create({initialize: function(a) {
        this.controller = a;
        this.elements = $A()
    },size: function() {
        return this.elements.size()
    },isEmpty: function() {
        return this.size() === 0
    },selected: function() {
        return !this.isEmpty()
    },singleSelected: function() {
        return this.size() === 1
    },get: function() {
        return this.elements.first()
    },getAll: function() {
        return this.elements
    },setAll: function(a) {
        delete this.candidate;
        this.elements = a
    },last: function() {
        return this.elements.last()
    },getRecent: function() {
        return this.recent && $(this.recent.getAttribute("id"))
    },select: function(d, e) {
        if (this.isEmpty()) {
            this.offset = this.recent = this.candidate = d;
            this.add(d)
        } else {
            this.clear();
            this.recent = d;
            var c = this.offset;
            if (c != d) {
                if (e && e.shiftKey) {
                    var b = d;
                    if (b.cumulativeOffset().top < c.cumulativeOffset().top) {
                        b = c;
                        c = d
                    }
                    do {
                        this.add(c);
                        c = c.next(".element")
                    } while (c != b);
                    this.add(b)
                } else {
                    this.select(d, e)
                }
            }
            if (!window.getSelection) {
                var a = document.selection.createRange();
                a.collapse(true);
                a.select()
            }
        }
        this.controller.showElementTools()
    },selectAll: function() {
        this.clear();
        this.controller.content.select(".element").each(function(a) {
            this.add(a)
        }.bind(this));
        this.recent = this.candidate = this.get();
        this.controller.showElementTools()
    },add: function(a) {
        a.addClassName("selected");
        this.elements.push(a)
    },getCandidate: function() {
        return this.candidate && $(this.candidate.getAttribute("id"))
    },setCandidate: function(a) {
        this.candidate = a
    },each: function(a) {
        this.elements.each(a)
    },clear: function() {
        this.each(function(a) {
            a.removeClassName("selected")
        });
        this.elements.clear();
        this.controller.showElementTools()
    }});
editor.util.Synchronizer = Class.create({initialize: function(a) {
        this.controller = a
    },getPanel: function() {
        if (!this.panel) {
            this.panel = new Element("div", {"class": "re_overlay"});
            document.body.appendChild(this.panel);
            this.panel.on("click", "button", this.refresh.bind(this));
            this.panel.on("click", "div.close", this.close.bind(this));
            var a = "<span>" + I18n.get("label.refresh_doc") + "</span>";
            a += "<button>" + I18n.get("label.refresh") + "</button>";
            a += "<div class='close'></div>";
            this.panel.update(a)
        }
        return this.panel
    },getBlock: function() {
        if (!this.block) {
            this.block = new Element("div", {"class": "block"});
            document.body.appendChild(this.block);
            this.block.setOpacity(0.7)
        }
        return this.block
    },show: function(b, c) {
        this.controller.getUndoManager().disable();
        if (b) {
            this.element = b;
            this.element.select("caption", "td", "th").each(function(g) {
                g.removeAttribute("class");
                if (g.tagName != "CAPTION") {
                    g = g.down()
                }
                g.setAttribute("contenteditable", "true")
            });
            var f = b.cumulativeOffset()
        } else {
            var f = document.viewport.getScrollOffsets()
        }
        var a = this.getPanel();
        var d = c && c.code;
        if (d) {
            a.select("span")[0].update(I18n.get("label." + d))
        }
        a.setStyle({left: (f.left + 200) + "px",top: (f.top + 30) + "px"});
        a.show();
        this.mouseWheelHandler = document.on("mousewheel", function(g) {
            g.stop()
        });
        var e = this.getBlock();
        e.setStyle({height: "3000px",width: "3000px"});
        e.show()
    },refresh: function(d) {
        var a = this.getPanel();
        Progress.start(a);
        if (this.element) {
            var c = this.element.previous() && this.element.previous().getAttribute("id");
            var b = this.element.next() && this.element.next().getAttribute("id")
        }
        new Ajax.Updater(_editor.getElementPanel(), "/r/editor/refresh/" + EditorUtil.getChapterId(), {onComplete: function(e) {
                var h = false;
                if (this.element && EditorUtil.isNew(this.element)) {
                    this.element.setOpacity(1);
                    if (c) {
                        var g = $(c);
                        if (g) {
                            g.insert({after: this.element});
                            $("re_content_panel") && $("re_content_panel").focus()
                        }
                        h = true
                    }
                    if (!h && b) {
                        var f = $(b);
                        if (f) {
                            f.insert({before: this.element});
                            $("re_content_panel") && $("re_content_panel").focus()
                        }
                        h = true
                    }
                }
                this.close(null, null, h);
                Progress.stop()
            }.bind(this)});
        d.stop()
    },close: function(b, d, c) {
        delete this.element;
        this.getPanel().hide();
        this.getBlock().hide();
        this.mouseWheelHandler.stop();
        delete this.mouseWheelHandler;
        if (!c) {
            if (this.controller) {
                var a = this.controller.getOpenedEditor();
                a && a.closeEditor();
                this.controller.endEdit()
            }
        }
        b && b.stop()
    }});
editor.util.Title = Class.create({initialize: function(a, c) {
        this.controller = a;
        this.id = c;
        this.title = $(document.body).down("h1 #chapter_title").select("span")[1];
        this.title.on("click", this.click.bind(this));
        var b = 215 - $("book_title").getWidth();
        if (b > 0) {
            $("chapter_title").setStyle({maxWidth: (300 + b) + "px"})
        }
        new editor.util.ContentDisplayer(a, c)
    },click: function(b) {
        if (!this.controller.edit) {
            var a = "<input id='chapter_title_field' type='text' class='text x-large'>";
            this.overlay = new Overlay("label.update_title", 510);
            this.overlay.addButton("save", this.save.bind(this));
            this.overlay.setCloseHandler(this.closed.bind(this));
            this.overlay.show(150, this.title.cumulativeOffset().top + 25, a);
            $("chapter_title_field").value = this.title.innerHTML.unescapeHTML();
            $("chapter_title_field").focus();
            this.shortcut = new Shortcut($("chapter_title_field"));
            this.shortcut.bind("ctrl_s", function(e, c, d) {
                this.save(d)
            }.bind(this));
            this.controller.keyHandler.prevent("return", "ctrl_a")
        }
        b.stop()
    },save: function(a) {
        var b = {title: $F("chapter_title_field")};
        new Ajax.Request("/r/editor_tool/update_title/" + this.id, {parameters: b,onComplete: function() {
                var c = b.title.escapeHTML();
                this.title.innerHTML = c;
                this.title.setAttribute("title", c);
                document.title = b.title;
                this.overlay.close(a);
                delete this.overlay
            }.bind(this)});
        a.stop()
    },closed: function() {
        this.shortcut.unbind("ctrl_s");
        this.controller.keyHandler.rebind("return", "ctrl_a")
    }});
editor.util.Tooltip = Class.create({show: function(a) {
        this.panel = this.panel || this.createPanel();
        if (this.currentElement === a && this.panel.visible()) {
            this.hide();
            return
        }
        this.currentElement = a;
        if (a.tagName === "CITE") {
            this.panel.down(1).update(a.down().innerHTML);
            this.openLink.hide()
        } else {
            if (a.tagName === "MARK") {
                this.panel.down(1).update(a.innerHTML + " (" + I18n.get("label." + a.className) + ")");
                this.openLink.hide()
            } else {
                this.panel.down(1).update(a.getAttribute("href"));
                this.openLink.show()
            }
        }
        this.panel.setStyle({visibility: "hidden"});
        this.panel.show();
        var e = a.cumulativeOffset();
        var b = this.panel.getLayout();
        var d = e.top - b.get("margin-box-height") - 10;
        var c = Math.max(10, e.left - b.get("margin-box-width") / 2);
        this.panel.setStyle({left: c + "px",top: d + "px",visibility: "visible"});
        this.clickHandler = this.clickHandler || document.on("click", this.click.bind(this));
        this.clickHandler.start()
    },hide: function() {
        if (this.panel.visible()) {
            delete this.currentElement;
            this.clickHandler.stop();
            this.panel.hide()
        }
    },click: function(d) {
        var c = d.findElement(".tooltip");
        if (!c) {
            this.hide()
        } else {
            c = d.findElement();
            if (c.hasClassName("open")) {
                var a = this.panel.down(1).innerHTML;
                a = a.unescapeHTML();
                if (a.startsWith("#")) {
                    var e = a.substring(1);
                    if ($(e)) {
                        EditorUtil.moveTo($(e));
                        a = null
                    } else {
                        var b = a.lastIndexOf("_");
                        if (b !== -1) {
                            a = "/r/editor_link/by_element/" + a.substring(b + 1)
                        } else {
                            a = "/r/editor_link/by_element/" + e
                        }
                    }
                }
                if (a) {
                    if (a.startsWith("/r/file/download/")) {
                        window.location.href = a
                    } else {
                        window.open(a)
                    }
                }
                this.hide()
            } else {
                if (c.hasClassName("close")) {
                    this.hide()
                } else {
                    if (c.tagName === "A") {
                        var a = c.href;
                        window.open(a);
                        this.hide()
                    }
                }
            }
        }
        d.stop()
    },createPanel: function() {
        var a = new Element("div", {"class": "tooltip"});
        a.update("<div><span></span><a href='#' class='open'>" + I18n.get("label.open") + "</a></div><div class='close'></div><div class='arrow'></div>");
        a.hide();
        document.body.appendChild(a);
        this.openLink = a.select("a.open")[0];
        return a
    }});
editor.util.UndoManager = Class.create({initialize: function(a) {
        this.controller = a;
        this.undoButton = $("top_panel").down(".undo");
        this.redoButton = $("top_panel").down(".redo");
        this.active = false
    },enable: function() {
        this.undoButton.addClassName("enable")
    },disable: function() {
        this.undoButton.removeClassName("enable");
        this.redoButton.removeClassName("enable")
    },undo: function() {
        if (this.active || !this.undoButton.hasClassName("enable")) {
            return
        }
        this.active = true;
        this.setMessage("label.undo");
        new Ajax.Request("/r/editor/undo/" + EditorUtil.getChapterId(), {asynchronous: false,onComplete: this.process.bind(this)})
    },redo: function() {
        if (this.active || !this.redoButton.hasClassName("enable")) {
            return
        }
        this.active = true;
        this.setMessage("label.redo");
        new Ajax.Request("/r/editor/redo/" + EditorUtil.getChapterId(), {asynchronous: false,onComplete: this.process.bind(this)})
    },process: function(a) {
        try {
            if (a.headerJSON) {
                if (a.headerJSON.undoable) {
                    this.undoButton.addClassName("enable")
                } else {
                    this.undoButton.removeClassName("enable")
                }
                if (a.headerJSON.redoable) {
                    this.redoButton.addClassName("enable")
                } else {
                    this.redoButton.removeClassName("enable")
                }
                var b = a.headerJSON.code.gsub("_", "-").camelize();
                this[b](a.headerJSON, a.responseText);
                this.controller.selector.clear()
            } else {
                this.disable()
            }
        } catch (c) {
            alert(c)
        }finally {
            this.setMessage();
            this.active = false
        }
    },setMessage: function(a) {
        if (!this.message) {
            this.message = new Element("span", {"class": "undo_message"});
            document.body.appendChild(this.message)
        }
        if (a) {
            this.message.update(I18n.get(a));
            this.message.show()
        } else {
            this.message.hide()
        }
    },undoCreate: function(a, b) {
        var c = $A();
        a.id.split("|").each(function(e) {
            var d = $(e);
            if (d) {
                c.push(d)
            }
        });
        if (c.size() === 0) {
            return
        }
        EditorUtil.scrollTo(c.first());
        new Effect(c).fadeOut(function() {
            c.invoke("remove")
        })
    },redoCreate: function(b, d) {
        var a;
        if (b.previous === "top") {
            this.controller.content.insert({top: d});
            a = this.controller.content.down()
        } else {
            var c = $(b.previous);
            if (c) {
                c.insert({after: d});
                a = c.next()
            }
        }
        EditorUtil.scrollTo(a);
        this.controller.selector.select(a)
    },undoUpdate: function(b, c) {
        if (b.remove) {
            var d = $A();
            b.remove.split("|").each(function(f) {
                var e = $(f);
                if (e) {
                    d.push(e)
                }
            });
            if (d.size() > 0) {
                new Effect(d).fadeOut(function() {
                    d.invoke("remove")
                })
            }
        }
        var a = $(b.id);
        EditorUtil.scrollTo(a);
        a.insert({after: c});
        a.next().fadeIn();
        a.remove()
    },redoUpdate: function(a, b) {
        this.undoUpdate(a, b)
    },undoRemove: function(b, d) {
        var a;
        if (b.previous === "top") {
            this.controller.content.insert({top: d});
            a = this.controller.content.down()
        } else {
            var c = $(b.previous);
            if (c) {
                c.insert({after: d});
                a = c.next()
            }
        }
        EditorUtil.scrollTo(a);
        this.controller.selector.select(a)
    },redoRemove: function(a, b) {
        var c = $A();
        a.id.split("|").each(function(e) {
            var d = $(e);
            if (d) {
                c.push(d)
            }
        });
        if (c.size() === 0) {
            return
        }
        EditorUtil.scrollTo(c.first());
        new Effect(c).fadeOut(function() {
            c.invoke("remove")
        })
    },undoMove: function(b, c) {
        var d = $A();
        var a = $(b.first);
        while (a) {
            d.push(a);
            if (a.getAttribute("id") === b.last) {
                break
            }
            a = a.next()
        }
        if (EditorUtil.hasFootnote(a)) {
            d.push(a.next())
        }
        var e;
        if (b.previous === "top") {
            this.controller.content.insert({top: d.shift()});
            e = this.controller.content.down()
        } else {
            e = $(b.previous)
        }
        d.each(function(f) {
            e.insert({after: f});
            e = f
        });
        EditorUtil.scrollTo(e)
    },redoMove: function(a, b) {
        this.undoMove(a, b)
    },undoReplace: function(b, c) {
        var a = $(b.id);
        EditorUtil.scrollTo(a);
        a.insert({after: c});
        a.next().fadeIn();
        a.remove()
    },redoReplace: function(a, b) {
        this.undoReplace(a, b)
    },undoReplaceAll: function(a, b) {
        if (b) {
            this.controller.content.update(b)
        }
    },redoReplaceAll: function(a, b) {
        this.undoReplaceAll(a, b)
    },conflictHappened: function() {
        new editor.util.Synchronizer(this.controller).show(null, {code: "conflict_happened"})
    }});
editor.util.VersionChecker = Class.create({initialize: function(a) {
        this.controller = a
    },getPanel: function() {
        if (!this.panel) {
            this.panel = new Element("div", {"class": "re_overlay"});
            document.body.appendChild(this.panel);
            this.panel.on("click", "button", this.viewRevision.bind(this));
            this.panel.on("click", "div.close", this.close.bind(this));
            var a = "<span>" + I18n.get("label.version_overridded") + "</span>";
            a += "<button>" + I18n.get("label.view_revision") + "</button>";
            a += "<div class='close'></div>";
            this.panel.update(a)
        }
        return this.panel
    },getBlock: function() {
        if (!this.block) {
            this.block = new Element("div", {"class": "block"});
            document.body.appendChild(this.block);
            this.block.setOpacity(0.7)
        }
        return this.block
    },show: function(b, c) {
        this.element = b;
        var f = b.cumulativeOffset();
        var a = this.getPanel();
        var d = c && c.code;
        if (d) {
            a.select("span")[0].update(I18n.get("label." + d))
        }
        a.setStyle({left: (f.left + 200) + "px",top: (f.top + 30) + "px"});
        a.show();
        this.mouseWheelHandler = document.on("mousewheel", function(g) {
            g.stop()
        });
        var e = this.getBlock();
        e.setStyle({height: "3000px",width: "3000px"});
        e.show()
    },viewRevision: function(b) {
        var a = this.getPanel();
        this.controller.viewElementRevision();
        this.close(b)
    },close: function(a) {
        delete this.element;
        this.getPanel().hide();
        this.getBlock().hide();
        this.mouseWheelHandler.stop();
        delete this.mouseWheelHandler;
        a && a.stop()
    }});
