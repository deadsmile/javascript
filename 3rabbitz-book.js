declarePackage("ui.svg").BarChart = Class.create({initialize: function(a, b) {
        a = $(a);
        this.chart = a.down();
        this.chart.setAttribute("class", "svg_bar_chart");
        if (b) {
            a.on("click", "rect", this.clicked.bind(this));
            this.handler = b
        }
        this.models = $A()
    },clicked: function(b) {
        var a = b.findElement();
        if (a.getAttribute("class") === "selected") {
            a.removeAttribute("class");
            delete this.selected
        } else {
            if (this.selected) {
                this.selected.removeAttribute("class")
            }
            a.setAttribute("class", "selected");
            this.selected = a
        }
        var c = this.selected ? this.selected.getAttribute("data-id") : null;
        this.handler(c);
        this.refresh(c);
        b.stop()
    },clear: function() {
        this.models.clear()
    },add: function(a) {
        a.value = a.value;
        this.models.push(a)
    },getMaxValue: function() {
        var a = 0;
        this.models.each(function(b) {
            a = Math.max(a, b.value)
        }.bind(this));
        return a
    },getTopValue: function(d) {
        if (d < 50) {
            return 50
        } else {
            if (d < 100) {
                return 100
            }
        }
        var c = "" + d;
        var a = Number(c[0]) + 1;
        for (var b = 1; b < c.length; b++) {
            a += "0"
        }
        return a
    },formatValue: function(d) {
        if (!d) {
            return "0"
        }
        d = "" + d;
        var a = "";
        for (var b = 0; b < d.length; b++) {
            var e = d[d.length - 1 - b];
            if (b !== 0 && b % 3 === 0) {
                a = "," + a
            }
            a = e + a
        }
        return a
    },createLine: function(c, e, b, d) {
        var a = document.createElementNS("http://www.w3.org/2000/svg", "line");
        a.setAttributeNS(null, "x1", c);
        a.setAttributeNS(null, "y1", e);
        a.setAttributeNS(null, "x2", b);
        a.setAttributeNS(null, "y2", d);
        this.chart.appendChild(a)
    },createText: function(b, e, c, a) {
        var d = document.createElementNS("http://www.w3.org/2000/svg", "text");
        d.setAttributeNS(null, "x", b);
        d.setAttributeNS(null, "y", e);
        if (a) {
            d.setAttributeNS(null, "class", a)
        }
        d.innerHTML = c;
        this.chart.appendChild(d)
    },refresh: function(c) {
        this.chart.innerHTML = "";
        var e = this.getMaxValue();
        var d = this.getTopValue(e);
        var f = this.formatValue(d);
        var b = this.chart.height.baseVal.value - 25;
        var a = f.length * 7;
        this.createLine(a, b + 10, this.models.size() * 40 + a, b + 10);
        this.createLine(a, 10, a, b + 10);
        this.createText(a - 3, 10, f, "y_axis");
        this.models.each(function(h) {
            var g = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            var j = b * h.value / d;
            g.setAttributeNS(null, "data-id", h.id);
            g.setAttributeNS(null, "x", a);
            g.setAttributeNS(null, "y", b - j + 10);
            g.setAttributeNS(null, "width", 30);
            g.setAttributeNS(null, "height", j);
            g.setAttributeNS(null, "title", h.value);
            if (h.id === c) {
                this.selected = g;
                g.setAttributeNS(null, "class", "selected")
            }
            this.chart.appendChild(g);
            var i = document.createElementNS("http://www.w3.org/2000/svg", "title");
            i.innerHTML = h.value;
            g.appendChild(i);
            if (h.value === e || h.id === c) {
                this.createText(a + 15, b - j + 8, this.formatValue(h.value))
            }
            this.createText(a + 15, 100, h.label);
            a += 40
        }.bind(this))
    }});
declarePackage("ui.view").DatePicker = Class.create({initialize: function(b, a) {
        this.target = $(b);
        this.handler = a
    },apply: function() {
        this.target.on("click", this.display.bind(this))
    },display: function() {
        if (!$("date_block")) {
            var e = new Element("div", {id: "date_block"});
            document.body.appendChild(e);
            e.on("click", this.close.bind(this))
        }
        if (!this.ui) {
            var b = new Date();
            this.year = b.getFullYear();
            this.month = b.getMonth();
            var a = document.createElement("div");
            a.id = "_calendar";
            document.body.appendChild(a);
            a = $(a);
            this.ui = a;
            var f = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
            var d = "";
            d += "<div class='top'><span class='year'></span>/<span class='month'></span></div>";
            d += "<div class='action previous'></div>";
            d += "<div class='action next'></div>";
            d += "<table><thead><tr>";
            for (var c = 0; c < 7; c++) {
                d += "<th>" + f[c] + "</th>"
            }
            d += "</tr></thead>";
            d += "<tbody></tbody></table>";
            this.ui.update(d);
            this.displayDate(this.year, this.month);
            this.ui.observe("click", this.click.bind(this))
        }
        $("date_block").ui = this.ui;
        $("date_block").show();
        var g = this.target.cumulativeOffset();
        this.ui.setStyle({left: g[0] + "px",top: (g[1] + this.target.getHeight() + 1) + "px"});
        this.ui.show()
    },displayDate: function(k, g) {
        var b = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((k % 4 == 0 && k % 100 != 0) || k % 400 == 0) {
            b[1] = 29
        }
        var m = new Date(k, g, 1);
        var a = (b[g] + m.getDay()) / 7;
        var f = "";
        var h = -m.getDay() + 1;
        var l = new Date();
        for (var e = 0; e < a; e++) {
            f += "<tr>";
            for (var c = 0; c < 7; c++) {
                if (h > 0 && h <= b[g]) {
                    f += "<td>" + h + "</td>"
                } else {
                    f += "<td class='empty'></td>"
                }
                h++
            }
            f += "</tr>"
        }
        this.ui.select("tbody")[0].update(f);
        this.ui.select("span.year")[0].update(k);
        g = g + 1;
        this.ui.select("span.month")[0].update(g < 10 ? "0" + g : g)
    },close: function(b) {
        var a = $("date_block");
        a.ui.hide();
        a.hide();
        b && b.stop()
    },click: function(d) {
        var e = d.findElement("div.action");
        if (e) {
            if (e.hasClassName("previous")) {
                if (this.month == 0) {
                    this.year--;
                    this.month = 11
                } else {
                    this.month--
                }
                this.displayDate(this.year, this.month)
            } else {
                if (e.hasClassName("next")) {
                    if (this.month == 11) {
                        this.year++;
                        this.month = 0
                    } else {
                        this.month++
                    }
                    this.displayDate(this.year, this.month)
                }
            }
        } else {
            var g = d.findElement("td");
            if (g && !g.hasClassName("empty")) {
                var c = this.year, f = this.month + 1, a = Number(g.innerHTML);
                if (f < 10) {
                    f = "0" + f
                }
                if (a < 10) {
                    a = "0" + a
                }
                var b = c + "-" + f + "-" + a;
                this.target.value = b;
                this.close();
                if (this.handler) {
                    this.handler(this.target, b)
                }
            }
        }
        d.stop()
    }});
declarePackage("ui.view").Grid = Class.create({initialize: function(a, b) {
        this.panel = $(a);
        this.template = new Template(b)
    },setSorter: function() {
        var a = this.panel.down("table");
        a.on("mouseover", this.over.bind(this));
        a.on("mouseleave", this.leave.bind(this));
        a.on("click", "thead th", this.sort.bind(this))
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
            this.sortColumn = a.getAttribute("data-headers");
            a = a.down();
            if (this.headCell && this.headCell !== a) {
                this.headCell.removeAttribute("class")
            }
            if (a.hasClassName("asc")) {
                a.removeClassName("asc");
                a.addClassName("desc");
                this.sortMode = "desc"
            } else {
                a.removeClassName("desc");
                a.addClassName("asc");
                this.sortMode = "asc"
            }
            this.headCell = a;
            this.refresh(this.currentModel)
        }
        b.stop()
    },setModel: function(a) {
        this.model = a;
        this.refresh(a)
    },refresh: function(a) {
        a = a || this.model;
        if (this.sortColumn && this.sortMode) {
            a.sort(function(e, d) {
                e = e[this.sortColumn];
                d = d[this.sortColumn];
                if (e < d) {
                    return this.sortMode === "asc" ? -1 : 1
                }
                if (e > d) {
                    return this.sortMode === "asc" ? 1 : -1
                }
                return 0
            }.bind(this))
        }
        var b = "";
        a.each(function(d) {
            b += "<tr>" + this.template.evaluate(d) + "</tr>"
        }.bind(this));
        var c = this.panel.down().next().down("tbody");
        c.update(b);
        this.currentModel = a
    },filter: function(b) {
        if (this.model) {
            var a = this.model.findAll(b);
            this.refresh(a)
        }
    }});
var BookAccessControl = Class.create({initialize: function(b, a) {
        this.action = (a || "/r/book_access/save") + "/" + b;
        $("access_control_form").on("click", "button", this.save.bind(this));
        $("access_control_form").on("click", "input[value=ALL_USERS]", this.allUsersClicked.bind(this))
    },save: function(a) {
        new FormUI("access_control_form").submit(this.action);
        a.stop()
    },allUsersClicked: function(c) {
        var a = c.findElement();
        var b = a.checked;
        a.up(2).select("input").each(function(d) {
            if (a !== d) {
                d.disabled = b
            }
        })
    }});
var BookList = Class.create({initialize: function(a, b) {
        $("book_search_form").on("submit", this.search.bind(this));
        $("book_search_form").on("click", "a.search", this.search.bind(this));
        $("book_search_form").on("click", "a.clear", this.clearSearchField.bind(this));
        this.bookTable = $("book_list_panel");
        if (this.bookTable) {
            this.url = "/r/book/sort";
            this.tableUI = new TableUI(this.bookTable, this);
            $("book_label_panel").on("click", "a", this.clickLabel.bind(this));
            this.projectFilter = $("project_filter");
            this.projectFilter && this.projectFilter.on("change", this.projectChanged.bind(this))
        }
    },search: function(a) {
        if (this.searchInContent()) {
            (this.searcher = this.searcher || new BookSearcher(this)).search()
        } else {
            new Ajax.Updater("layout_inner_main", "/r/book/search/document", {parameters: this.getParameter()})
        }
        a && a.stop()
    },clearSearchField: function(a) {
        $("q_keyword").value = "";
        if (this.searchInContent()) {
            $("q_keyword").focus()
        } else {
            if (this.projectFilter) {
                this.projectFilter.value = ""
            }
            this.clearLabels();
            new Ajax.Updater("layout_inner_main", "/r/book/search", {parameters: this.getParameter()})
        }
        a.stop()
    },searchInContent: function() {
        return $("search_in_content") && $("search_in_content").checked
    },click: function(c) {
        var b = c.findElement();
        if (!b) {
            c.stop();
            return
        }
        var d = b.up(1);
        var e = d.getAttribute("id");
        if (b.hasClassName("view")) {
            executer.execute("/r/book/view/" + e)
        } else {
            if (b.hasClassName("web_viewer")) {
                var a = b.readAttribute("href");
                if (a === "#") {
                    window.open("/r/viewer/book/" + e)
                } else {
                    window.open(a)
                }
            } else {
                if (b.hasClassName("edit_visual")) {
                    window.open("/r/visual/" + e)
                } else {
                    if (b.hasClassName("view_static")) {
                        window.open("/r/static/load/" + e)
                    } else {
                        if (b.hasClassName("copy")) {
                            new Ajax.Updater("layout_inner_main", "/r/book/copy/" + e)
                        } else {
                            if (b.hasClassName("remove")) {
                                if ($confirmRemove(d, null, $("project_filter") ? 2 : 0)) {
                                    new Ajax.Updater("layout_inner_main", "/r/book/remove/" + e)
                                }
                            }
                        }
                    }
                }
            }
        }
        c.stop()
    },getPath: function(b, a) {
        return "/r/book/page/" + b
    },clickLabel: function(b) {
        var a = b.findElement();
        if (a.hasClassName("selected")) {
            a.removeClassName("selected");
            new Ajax.Updater("book_list_panel", "/r/book/search_by_label", {parameters: $("book_search_form").serialize(),onComplete: function(c) {
                    this.projectFilter = $("project_filter");
                    if (this.projectFilter) {
                        this.projectFilter.on("change", this.projectChanged.bind(this))
                    }
                }.bind(this)})
        } else {
            this.clearLabels();
            a.addClassName("selected");
            new Ajax.Updater("book_list_panel", "/r/book/search_by_label", {parameters: this.getParameter(),onComplete: function(c) {
                    this.projectFilter = $("project_filter");
                    if (this.projectFilter) {
                        this.projectFilter.on("change", this.projectChanged.bind(this))
                    }
                }.bind(this)})
        }
        b.stop()
    },projectChanged: function(a) {
        new Ajax.Updater("book_list_panel", "/r/book/search_by_project", {parameters: this.getParameter(),onComplete: function(b) {
                this.projectFilter = $("project_filter");
                if (this.projectFilter) {
                    this.projectFilter.on("change", this.projectChanged.bind(this))
                }
            }.bind(this)})
    },clearLabels: function() {
        $("book_label_panel").select("a.selected").each(function(a) {
            a.removeClassName("selected")
        })
    },getParameter: function() {
        var a = $("book_search_form").serialize(true);
        var b = $("book_label_panel").select("a.selected").first();
        if (b) {
            a.q_label = b.innerHTML
        }
        if (this.projectFilter) {
            a.q_project = this.projectFilter.value
        }
        return a
    }});
var BookUI = Class.create({initialize: function(b, a) {
        this.chapterPanel = $(a);
        this.bookId = b;
        if (this.chapterPanel) {
            this.chapterPanel.on("click", "a", this.click.bind(this))
        }
        $("app_header").on("click", "a", this.click.bind(this));
        new Favorite("app_header", "chapters");
        new Watch("app_header");
        new FeedbackStatistics(b);
        if ($("static_upload_panel")) {
            new StaticFileUploader(b)
        }
    },click: function(b, a) {
        this.chapterId = a.up(1).id;
        if (a.hasClassName("remove")) {
            this.removeChapter()
        } else {
            if (a.hasClassName("update_chapter")) {
                this.updateChapter()
            } else {
                if (a.hasClassName("edit_content")) {
                    window.open("/r/editor/edit/" + this.chapterId)
                } else {
                    if (a.hasClassName("review_content")) {
                        window.open("/r/viewer/book/" + this.chapterId)
                    } else {
                        if (a.hasClassName("download_pdf")) {
                            this.pdfBuilder = this.pdfBuilder || new FileBuilder(this.bookId, "pdf");
                            this.pdfBuilder.show(b, I18n.get("label.do_you_start_pdf_build"))
                        } else {
                            if (a.hasClassName("download_epub")) {
                                this.epubBuilder = this.epubBuilder || new FileBuilder(this.bookId, "epub");
                                this.epubBuilder.show(b, I18n.get("label.do_you_start_epub_build"))
                            } else {
                                if (a.hasClassName("download_word")) {
                                    this.wordBuilder = this.wordBuilder || new FileBuilder(this.bookId, "word");
                                    this.wordBuilder.show(b, I18n.get("label.do_you_start_word_build"))
                                } else {
                                    if (a.hasClassName("download_html")) {
                                        this.htmlBuilder = this.htmlBuilder || new FileBuilder(this.bookId, "html");
                                        this.htmlBuilder.show(b, I18n.get("label.do_you_start_html_build"))
                                    } else {
                                        if (a.hasClassName("preview")) {
                                            window.open("/r/index/preview/" + this.bookId)
                                        } else {
                                            return
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        b.stop()
    },removeChapter: function() {
        var a = I18n.get("label.chapter_remove_confirm") + " [" + $(this.chapterId).childNodes[0].nodeValue.strip() + "]";
        if (confirm(a)) {
            new Ajax.Request("/r/chapter/remove/" + this.bookId + "/" + this.chapterId, {onSuccess: function(b) {
                    if (b.getHeader("CONFIRM") === "true") {
                        window.location.href = "/!#/r/chapter/confirm_remove_with_referenced/" + this.bookId + "/" + this.chapterId
                    } else {
                        $(this.chapterId).remove()
                    }
                }.bind(this)})
        }
    },updateChapter: function() {
        executer.execute("/r/chapter/update/" + this.bookId + "/" + this.chapterId)
    }});
var BuildAll = Class.create({initialize: function() {
        this.button = $("button_start_export");
        this.button.on("click", this.start.bind(this));
        this.bookList = $("build_all_book_list");
        this.bookList.on("click", "input", this.select.bind(this));
        this.form = $("build_all").down("form");
        this.form.on("click", this.click.bind(this));
        this.candidates = $("build_all").down("table");
        this.candidates.on("click", "td.remove p", this.remove.bind(this));
        this.candidates.on("click", "td select", this.changeThemeOrLayout.bind(this));
        new TableUI(this.candidates, this);
        this.setUp()
    },setUp: function() {
        var b = localStorage.getItem("build_all_candidates");
        if (b) {
            var a = $A();
            b.split("|").each(function(d) {
                var c = this.findBook(d);
                if (c) {
                    c.checked = true;
                    c.disabled = true;
                    a.push($F(c))
                }
            }.bind(this));
            new Ajax.Updater(this.candidates.down("tbody"), "/r/build_all/gets", {insertion: "bottom",parameters: {book: a},onComplete: function(c) {
                    this.candidates.show()
                }.bind(this)})
        } else {
            this.button.disabled = true;
            this.candidates.hide()
        }
    },enable: function() {
        delete this.disabled;
        this.button.disabled = false;
        this.getThemeOrLayout().each(function(a) {
            a.disabled = false
        })
    },disable: function() {
        this.disabled = true;
        this.button.disabled = true;
        this.getThemeOrLayout().each(function(a) {
            a.disabled = true
        });
        this.candidates.select(".completed").each(function(a) {
            a.removeClassName("completed")
        })
    },select: function(b) {
        if (this.disabled) {
            b.stop();
            return
        }
        var a = b.findElement();
        a.disabled = true;
        new Ajax.Updater(this.candidates.down("tbody"), "/r/build_all/get/" + $F(a), {insertion: "bottom",onComplete: function(c) {
                this.button.disabled = false;
                this.candidates.show();
                this.saveToLocalStorage()
            }.bind(this)})
    },remove: function(b) {
        if (this.disabled) {
            return
        }
        var c = b.findElement("tr");
        var a = this.findBook(c.getAttribute("id"));
        a.checked = false;
        a.disabled = false;
        Progress.start(c);
        c.fadeOut(function() {
            c.remove();
            this.saveToLocalStorage();
            if (this.candidates.select("tbody tr").size() === 0) {
                this.button.disabled = true;
                this.candidates.hide()
            }
            Progress.stop()
        }.bind(this))
    },changeThemeOrLayout: function(b) {
        var a = b.findElement();
        if ($F(a)) {
            a.up().removeClassName("unselected")
        } else {
            a.up().addClassName("unselected")
        }
    },saveToLocalStorage: function() {
        var a;
        this.candidates.select("tbody tr").each(function(c, b) {
            var d = c.getAttribute("id");
            if (b === 0) {
                a = c.id
            } else {
                a += "|" + c.id
            }
        });
        if (a) {
            localStorage.setItem("build_all_candidates", a)
        } else {
            localStorage.removeItem("build_all_candidates")
        }
    },start: function(a) {
        if (this.validate()) {
            this.disable();
            var b = this.candidates.down("tbody tr");
            b.addClassName("over");
            this.type = "web";
            this.touchWeb(b)
        }
        a.stop()
    },validate: function() {
        var a = true;
        this.getThemeOrLayout().each(function(b) {
            if (!$F(b)) {
                b.up().addClassName("unselected");
                a = false
            }
        });
        return a
    },touchWeb: function(c) {
        this.tr = c;
        var a = c.select("select");
        var b = 0;
        $("web_theme").value = a[b++].value;
        if (a.size() === 5) {
            $("web_viewer_layout").value = a[b++].value
        }
        $("pdf_theme").value = a[b++].value;
        $("pdf_page_layout").value = a[b++].value;
        $("epub_theme").value = a[b++].value;
        new Ajax.Request("/r/build_all/touch_web_viewer/" + c.getAttribute("id"), {parameters: this.form.serialize(),onComplete: function(d) {
                this.type = "pdf";
                this.log(c);
                this.build()
            }.bind(this)})
    },build: function() {
        var a = this.tr.getAttribute("id");
        if (this.builder) {
            this.builder.id = a;
            this.builder.type = this.type
        } else {
            this.builder = new FileBuilder(a, this.type)
        }
        this.builder.panel = this.form;
        this.builder.form = new FormUI(this.form);
        this.builder.button = this.button;
        this.builder.handler = this.next.bind(this);
        this.builder.build()
    },next: function(a) {
        if (a) {
            this.enable();
            return
        }
        if (this.type === "pdf") {
            this.type = "epub";
            this.log(this.tr);
            this.build(this.tr)
        } else {
            this.tr.removeClassName("over");
            this.tr.down().addClassName("completed");
            var b = this.tr.next();
            if (b) {
                b.addClassName("over");
                this.type = "web";
                this.log(b);
                this.touchWeb(b)
            } else {
                this.log();
                this.form.down(".progress_panel").hide()
            }
        }
    },click: function(a) {
        this.builder && this.builder.click(a)
    },findBook: function(a) {
        return this.bookList.down("input[value=" + a + "]")
    },getThemeOrLayout: function() {
        return this.candidates.select("select")
    },log: function(b) {
        var a = this.form.down("p");
        if (b) {
            var c = b.down(1).innerHTML + ": <strong>" + this.type.toUpperCase() + "</strong>";
            a.removeClassName("completed")
        } else {
            var c = I18n.get("label.build_completed");
            a.addClassName("completed");
            this.enable()
        }
        a.update(c)
    }});
var FileBuilder = Class.create({initialize: function(b, a) {
        this.id = b;
        this.type = a
    },show: function(a, b) {
        this.overlay = new Overlay(b, 680);
        this.button = this.overlay.addButton("start", this.click.bind(this));
        this.panel = this.overlay.getContentPanel();
        this.panel.on("click", this.click.bind(this));
        new Ajax.Updater(this.panel, this.getUrl(), {onComplete: this.showOverlay.bind(this)})
    },getUrl: function() {
        return "/r/" + this.type + "/form/" + this.id
    },showOverlay: function() {
        this.overlay.show(150, 100);
        if (this.type === "pdf") {
            this.form = new FormUI("export_form").addTextValidator({element: "pdf_theme",required: true}).addTextValidator({element: "pdf_page_layout",required: true})
        } else {
            if (this.type === "word") {
                this.form = new FormUI("export_form").addTextValidator({element: "word_theme",required: true})
            } else {
                this.form = new FormUI("export_form").addTextValidator({element: "epub_theme",required: true})
            }
        }
    },click: function(d) {
        var b = d.findElement();
        if (b.tagName === "BUTTON") {
            this.build()
        } else {
            if (b.tagName === "A") {
                if (b.hasClassName("download") || b.hasClassName("download_recent")) {
                    window.location.href = "/r/" + this.type + "/download/" + this.id
                } else {
                    if (b.hasClassName("select_image")) {
                        if (!this.imagePanel) {
                            this.imagePanel = new ImagePanel(function(e, f) {
                                $("epub_cover_image").value = f.split("/")[4];
                                $("epub_cover_image_thumbnail").src = f;
                                $("epub_cover_image_thumbnail").setStyle({display: "block"})
                            })
                        }
                        this.imagePanel.show()
                    } else {
                        if (b.hasClassName("remove_image")) {
                            $("epub_cover_image").value = "";
                            $("epub_cover_image_thumbnail").setStyle({display: "none"})
                        } else {
                            var c = b.getAttribute("data-group");
                            var a = b.getAttribute("data-element");
                            window.open("/r/editor/edit/" + c + "#" + a)
                        }
                    }
                }
            }
        }
        d.stop()
    },done: function(a) {
        $("build_completed_panel").show();
        this.button.disabled = false
    },build: function() {
        var e = this.type;
        var c = this.panel.down();
        var f = this.id;
        var d = 0;
        if (this.form.request("/r/" + e + "/build/" + f)) {
            var a = $("build_completed_panel");
            this.panel.select(".progress_panel, .build_result").invoke("remove");
            a.hide();
            this.button.disabled = true;
            var b = new ProgressBar(c);
            b.start({run: function() {
                    new Ajax.Request("/r/" + e + "/monitor/" + f, {onComplete: function(g) {
                            var h = g.headerJSON;
                            if (h.code === "error") {
                                a.insert({after: g.responseText});
                                b.errorHappend()
                            }
                            d = h.rate
                        }});
                    return {rate: d}
                },done: this.handler ? this.handler : this.done.bind(this)})
        }
    }});
var ChapterFormUI = Class.create({initialize: function(a, b) {
        this.bookId = a;
        if (b != "null") {
            this.id = b
        }
        this.chapterForm = new FormUI("chapter_form").addTextValidator({element: "chapter_title",required: true,max: 2000}).addTextValidator({element: "chapter_subtitle",max: 2000}).addTextValidator({element: "chapter_author",max: 2000}).addTextValidator({element: "chapter_alias",max: 2000});
        $("button_save").on("click", this.save.bind(this));
        $("chapter_form").on("submit", this.save.bind(this));
        $("chapter_type").on("change", this.changeType.bind(this));
        this.configureAlwaysTop();
        this.configureRenumbered()
    },save: function(a) {
        var b = this.id ? "/r/chapter/update/" + this.bookId + "/" + this.id : "/r/chapter/create/" + this.bookId;
        this.chapterForm.submit(b);
        a.stop()
    },changeType: function(c) {
        var a = c.findElement();
        var b = a.options[a.selectedIndex];
        if (($F("chapter_title") === "") || $F("chapter_title") === this.defaultTitle) {
            this.defaultTitle = b.text;
            $("chapter_title").setValue(this.defaultTitle);
            $("chapter_title").focus()
        }
        this.configureAlwaysTop();
        this.configureRenumbered()
    },configureAlwaysTop: function() {
        $("chapter_always_top").disabled = $F("chapter_type") !== "CHAPTER"
    },configureRenumbered: function() {
        $("chapter_renumbered").disabled = $F("chapter_type") !== "PART"
    }});
var ChapterImporter = Class.create({initialize: function(a) {
        this.bookId = a;
        this.chapterPanel = $("chapters_panel");
        $("book_id").on("change", this.displayChapters.bind(this));
        $("button_save").on("click", this.importChapters.bind(this))
    },displayChapters: function(b) {
        var c = $F("book_id");
        if (c != "") {
            var a = "/r/import_chapter/display_chapters/" + c;
            new Ajax.Updater(this.chapterPanel, a, {onComplete: this.showChapterPanel.bind(this)})
        }
        b.stop()
    },showChapterPanel: function() {
        [this.chapterPanel, this.chapterPanel.next()].invoke("show")
    },importChapters: function(b) {
        var a = "/r/import_chapter/import_chapters/" + this.bookId;
        new FormUI("import_chapter_form").submit(a);
        b.stop()
    }});
var FileChapterImporter = Class.create({initialize: function(a) {
        this.bookId = a;
        this.form = $("chapter_import_form");
        $("file").on("change", this.submit.bind(this))
    },submit: function(b) {
        var a = $F("file");
        if (!a.endsWith(".docx")) {
            alert(I18n.get("label.unsupported_file_for_import"))
        } else {
            new Ajax.Request("/r/uuid", {onComplete: this.importChapter.bind(this)})
        }
        b.stop()
    },importChapter: function(a) {
        this.createUploadTarget();
        var b = a.responseText;
        this.form.action = "/r/import_chapter_from_file/upload/" + this.bookId + "/" + b;
        this.form.submit();
        this.monitor(b)
    },createUploadTarget: function() {
        var a = $("upload_target");
        if (!a) {
            a = new Element("iframe", {id: "upload_target",name: "upload_target",style: "display: none"});
            document.body.appendChild(a)
        }
        this.form.setAttribute("target", "upload_target")
    },monitor: function(c) {
        var a = "/r/import_chapter_from_file/monitor_progress/" + c;
        var b = 0;
        var d = this.bookId;
        new ProgressBar(this.createProgressPanel()).start({run: function() {
                new Ajax.Request(a, {onComplete: function(e) {
                        var f = e.headerJSON;
                        b = f.rate
                    }});
                return {rate: b}
            },done: function() {
                executer.execute("/r/book/view/" + d)
            }})
    },createProgressPanel: function() {
        var a = new Element("div", {id: "progress_bar"});
        a.update("<div></div>");
        this.form.insert({after: a});
        return a.down()
    }});
var BookCommentList = Class.create({initialize: function(a, b) {
        this.controllerUrl = "/r/book_comment";
        this.list = $("book_comment_table");
        this.tableUI = new TableUI(this.list, this)
    },click: function(e) {
        var d = e.findElement("a");
        if (d) {
            var f = d.up(1);
            var g = f.getAttribute("id");
            var c = f.readAttribute("data-category");
            var a = f.readAttribute("data-subject");
            var b = f.readAttribute("data-type");
            if (d.hasClassName("view_all")) {
                this.handlers.viewAll(e, g)
            } else {
                if (d.hasClassName("view")) {
                    this.handlers.view(g, b, a, c)
                } else {
                    if (d.hasClassName("spam")) {
                        this.handlers.spam(g, b, a, c)
                    } else {
                        if (d.hasClassName("approve")) {
                            this.handlers.approve(g, b, a, c)
                        } else {
                            if (d.hasClassName("remove")) {
                                this.handlers.remove(g, b, a, c, f)
                            }
                        }
                    }
                }
            }
            e.stop()
        }
    },getPath: function(b, a) {
        return this.controllerUrl + "/page/" + b
    },viewAll: function(b, e) {
        var c = this.controllerUrl + "/view_all/" + e;
        var j = "label.body";
        var g = new Overlay(j, 550);
        g.addClassName("comment");
        var a = g.getContentPanel();
        var f = b.pointerX() - 550;
        var h = document.viewport;
        var d = h.getScrollOffsets().top;
        var i = b.pointerY() - d;
        var k = h.getHeight();
        if (k - i < 305) {
            i = i - 305
        }
        g.show(f, i);
        new Ajax.Updater(a, c)
    },view: function(e, c, b, d) {
        var a = this.controllerUrl + "/view/" + d + "/" + b + "/" + e + "/" + c;
        window.open(a)
    },spam: function(e, c, b, d) {
        var a = this.controllerUrl + "/spam/" + d + "/" + e;
        new Ajax.Updater("layout_inner_main", a)
    },approve: function(e, c, b, d) {
        var a = this.controllerUrl + "/approve/" + d + "/" + e;
        new Ajax.Updater("layout_inner_main", a)
    },remove: function(g, c, b, e, f) {
        var d = I18n.get("label.confirm_remove");
        d += " [" + f.down("td").next(1).firstChild.nodeValue.replace("\n", "") + "]";
        if (confirm(d)) {
            var a = this.controllerUrl + "/remove/" + e + "/" + g;
            new Ajax.Updater("layout_inner_main", a)
        }
    }});
var BookContentSorter = Class.create({initialize: function(a, b) {
        this.bookId = b;
        if ($(a)) {
            new ListSorter($(a), this.sort.bind(this))
        }
    },sort: function(a, b) {
        var c = a.select("li");
        this.organize(c);
        new Ajax.Request("/r/sort_book_toc", {parameters: this.getParameters(c)})
    },organize: function(c) {
        var a = false;
        for (var b = 0; b < c.length; b++) {
            var d = c[b];
            if (d.hasClassName("part")) {
                a = true
            } else {
                if (d.hasClassName("appendix")) {
                    a = false
                } else {
                    if (d.hasClassName("always_top")) {
                        a = false
                    } else {
                        if (!d.hasClassName("chapter")) {
                            a = false
                        }
                    }
                }
            }
            if (a) {
                if (!d.hasClassName("part")) {
                    d.addClassName("chapter_in_part")
                }
            } else {
                d.removeClassName("chapter_in_part")
            }
        }
    },getParameters: function(b) {
        var a = $A();
        b.each(function(c) {
            a.push(c.id)
        });
        return {book_id: this.bookId,id: a}
    }});
var DriveAdder = Class.create({initialize: function() {
        new DriveExplorer("file", $("drive_source"), this.addFile.bind(this));
        $("button_save").on("click", this.save.bind(this))
    },addFile: function(c) {
        var b = c.findElement();
        var a = new Element("div");
        a.update("<label><input type='checkbox' name='file' value='" + b.getAttribute("id") + "' checked>" + b.innerHTML + "</label>");
        $("drive_target").insert(a)
    },save: function(a) {
        this.form = new FormUI("drive_add_form");
        this.form.submit("/r/drive/save")
    }});
var DriveEncoder = Class.create({initialize: function() {
        this.monitorPanel = $("encode_monitor_panel");
        if (this.monitorPanel && this.monitorPanel.hasClassName("progress")) {
            return
        }
        new Ajax.Request("/r/drive/monitor", {onComplete: function(a) {
                var c = a.headerJSON;
                var b = Number(c.rate);
                if (b < 100) {
                    this.monitor();
                    this.update(c.id, c.name, b)
                }
            }.bind(this)})
    },monitor: function() {
        if (!this.monitorPanel) {
            this.monitorPanel = new Element("div", {id: "encode_monitor_panel","class": "progress"});
            document.body.appendChild(this.monitorPanel)
        }
        var a = new PeriodicalExecuter(function(b) {
            new Ajax.Request("/r/drive/monitor", {onComplete: function(c) {
                    var e = c.headerJSON;
                    var d = Number(e.rate);
                    if (d < 100) {
                        this.update(e.id, e.name, d)
                    } else {
                        this.update(e.id, e.name, d);
                        this.monitorPanel.removeClassName("progress");
                        b.stop()
                    }
                }.bind(this)})
        }.bind(this), 2)
    },update: function(c, a, b) {
        if (b < 100) {
            this.monitorPanel.update("Encoding(" + b + "%): <a href='#/r/drive/view/" + c + "'>" + a + "</a>")
        } else {
            this.monitorPanel.update("Encoding Completed(" + b + "%): <a href='#/r/drive/view/" + c + "'>" + a + "</a>")
        }
    }});
var DriveExplorer = Class.create({initialize: function(c, a, b) {
        this.mode = c;
        this.panel = a;
        this.panel.on("click", ".directory", this.loadFiles.bind(this));
        this.panel.on("click", ".file", b);
        this.loadFiles()
    },loadFiles: function(a) {
        new Ajax.Updater(this.panel, "/r/drive/load_files", {parameters: {path: a ? a.findElement().getAttribute("id") : "",mode: this.mode}});
        a && a.stop()
    }});
var DriveFile = Class.create({initialize: function(g) {
        this.id = g;
        $("app_header").on("click", ".set_subtitles", this.showFilePanel.bind(this));
        var a = $$(".set_ffmpeg")[0];
        if (a) {
            a.on("click", ".set_ffmpeg", this.showFilePanel.bind(this))
        }
        var d = $$(".encoding_file")[0];
        if (d) {
            d.on("click", this.encodingFile.bind(this))
        }
        if ($("video_tab_panel")) {
            new Tab($("video_tab_panel"), $("basics_tab"))
        }
        if ($("file_encoding")) {
            $("file_encoding").on("change", this.changeFileEncoding.bind(this));
            $$(".synchronize_time")[0].on("click", this.toggleSynchronizeTimePanel.bind(this));
            $("synchronize_time_panel").on("change", "select", this.synchronizeTime.bind(this));
            $("script_panel").on("click", ".start_time, .end_time", this.move.bind(this));
            var f = $F("synchronize_time_mode");
            var e = $F("synchronize_time_minute");
            var b = $F("synchronize_time_second");
            var c = Number(e) * 60 + Number(b);
            if (f === "backward") {
                c = -c
            }
            this.timeChanged = c
        }
        new DriveEncoder();
        this.configureScriptPanelHeight()
    },configureScriptPanelHeight: function() {
        if ($("script_panel")) {
            var a = $("video_tab_panel").down(".panels");
            $("script_panel").setStyle({height: (document.viewport.getHeight() - a.getLayout().get("top") - 200) + "px"})
        }
    },encodingFile: function(b) {
        var a = 0;
        new Ajax.Request("/r/drive/encoding_file/" + this.id);
        new ProgressBar($("unsupported_encoding_panel")).start({run: function() {
                new Ajax.Request("/r/drive/monitor", {onComplete: function(c) {
                        var d = c.headerJSON;
                        a = d.rate
                    }});
                return {rate: a}
            },done: function() {
                if ($$(".progress_panel").size() > 0) {
                    this.configured()
                }
            }.bind(this)});
        b.stop()
    },toggleSynchronizeTimePanel: function(a) {
        $("synchronize_time_panel").toggle();
        a.stop()
    },synchronizeTime: function(a) {
        var g = $F("synchronize_time_mode");
        var d = $F("synchronize_time_minute");
        var c = $F("synchronize_time_second");
        new Ajax.Updater("script_panel", "/r/drive/synchronize_time/" + this.id + "/" + g + "/" + d + "/" + c);
        var b = $("video_panel").down("video");
        var f = b.textTracks;
        var h = f[0];
        var e = h.cues;
        var i = Number(d) * 60 + Number(c);
        if (g === "backward") {
            i = -i
        }
        i -= this.timeChanged;
        $A(e).each(function(j) {
            j.startTime += i;
            j.endTime += i
        });
        this.timeChanged = i;
        a.stop()
    },move: function(c) {
        var b = $("video_panel").down("video");
        var a = c.findElement("span").innerHTML;
        var d = Number(a.substring(0, 2)) * 60 * 60 + Number(a.substring(3, 5)) * 60 + Number(a.substring(6, 8));
        b.currentTime = d;
        c.stop()
    },changeFileEncoding: function(a) {
        new Ajax.Updater("script_panel", "/r/drive/change_file_encoding/" + this.id + "/" + a.findElement().value);
        a.stop()
    },showFilePanel: function(a) {
        if (a.findElement("a").hasClassName("set_subtitles")) {
            this.mode = "subtitles"
        } else {
            this.mode = "ffmpeg"
        }
        new DriveExplorer(this.mode, $("drive_explorer"), this.setFile.bind(this));
        $("drive_explorer").show();
        a.stop()
    },setFile: function(a) {
        var b = a.findElement().getAttribute("id");
        if (I18n.confirm("label.confirm_select_file")) {
            new Ajax.Request("/r/drive/set_file/" + this.id + "", {parameters: {path: b,mode: this.mode},onComplete: this.configured.bind(this)});
            a.stop()
        }
    },configured: function() {
        new Ajax.Updater("layout_inner_main", "/r/drive/view/" + this.id)
    }});
var BookExporter = Class.create({initialize: function() {
        this.bookExportForm = $("export_book_form");
        this.bookExportForm.on("submit", this.submit.bind(this));
        $("select_all").on("click", this.toggle.bind(this));
        this.styleExportForm = $("export_style_form");
        this.styleExportForm.on("submit", this.submit.bind(this));
        $("export_type_panel") && $("export_type_panel").on("click", "input", this.changeType.bind(this))
    },submit: function(b) {
        if (this.bookExportForm.visible()) {
            var a = this.bookExportForm.select("ul input").find(function(c) {
                return c.checked
            })
        } else {
            var a = this.styleExportForm.select("select").find(function(c) {
                return c.value !== ""
            })
        }
        if (!a) {
            b.stop()
        }
    },toggle: function(b) {
        var a = b.findElement().checked;
        this.bookExportForm.select("ul input").each(function(c) {
            c.checked = a
        })
    },changeType: function(a) {
        if ($("export_book").checked) {
            this.bookExportForm.show();
            this.styleExportForm.hide()
        } else {
            this.bookExportForm.hide();
            this.styleExportForm.show()
        }
    }});
var FeedbackStatistics = Class.create({initialize: function(b) {
        this.bookId = b;
        var a = $$(".feedback_chapter_selection_panel");
        if (a.size() > 0) {
            this.panel = a[0];
            this.panel.down("select").on("change", this.chapterChanged.bind(this));
            $$(".rabbitz_feedback_statistics_panel")[0].on("click", "a.reset_feedback", this.reset.bind(this))
        }
    },reset: function(a) {
        if (I18n.confirm("label.confirm_reset_feedback")) {
            new Ajax.Request("/r/feedback/reset/" + this.bookId, {onSuccess: function(c) {
                    var b = $$(".rabbitz_feedback_statistics_panel")[0];
                    b.fadeOut(function() {
                        b.remove()
                    })
                }.bind(this)})
        }
        a.stop()
    },chapterChanged: function(a) {
        new Ajax.Updater(this.panel.next(), "/r/feedback/get_statistics/" + $F(a.findElement()))
    }});
var FeedbackStatisticsTool = Class.create({initialize: function(a) {
        this.bookMenu = $("layout_inner_left_panel").down(".list_selection_panel");
        this.bookMenu.on("click", "li", this.load.bind(this));
        var c = $("app_header");
        c.on("click", "a.reset_feedback", this.reset.bind(this));
        c.on("click", "a.web_viewer", this.openWebViewer.bind(this));
        var b = this.getCurrent();
        this.loadStatistics(b);
        b.scrollTo()
    },load: function(a) {
        var c = a.findElement("li");
        if (c.hasClassName("selected")) {
            return
        }
        var b = this.getCurrent();
        if (b) {
            b.removeClassName("selected")
        }
        c.addClassName("selected");
        this.loadStatistics(c)
    },loadStatistics: function(a) {
        new Ajax.Updater($("layout_inner_right_panel"), "/r/feedback/get_book_statistics/" + a.getAttribute("data-id"), {onComplete: this.loaded.bind(this)})
    },loaded: function(c) {
        var b = $("layout_inner_right_panel");
        var d = $("app_header").down("h1 strong");
        d.update(this.getCurrent().down("span").innerHTML);
        var a = b.down("select");
        if (a) {
            a.on("change", this.chapterChanged.bind(this))
        }
    },getCurrent: function() {
        return this.bookMenu.down(".selected")
    },reset: function(a) {
        var b = this.getCurrent();
        if (b && I18n.confirm("label.confirm_reset_feedback")) {
            new Ajax.Request("/r/feedback/reset/" + b.getAttribute("data-id"), {onSuccess: this.resetted.bind(this)})
        }
        a.stop()
    },resetted: function(a) {
        var b = this.getCurrent();
        b.down("span span").remove();
        this.loadStatistics(b)
    },openWebViewer: function(a) {
        var b = this.getCurrent();
        if (b) {
            window.open("/r/viewer/book/" + b.getAttribute("data-id"))
        }
        a.stop()
    },chapterChanged: function(a) {
        var b = $("layout_inner_right_panel").down(".feedback_chapter_selection_panel").next();
        new Ajax.Updater(b, "/r/feedback/get_statistics/" + $F(a.findElement()))
    }});
var BookFigure = Class.create({initialize: function(a) {
        this.bookId = a;
        $("figure_panel").on("mouseover", "img", this.showTool.bind(this));
        $("tool_handle").on("click", this.open.bind(this))
    },showTool: function(c) {
        var a = c.findElement();
        this.configureElement(a);
        var b = a.getWidth() - $("tool_handle").getWidth();
        var d = a.cumulativeOffset();
        $("tool_handle").setStyle({display: "block",left: (d.left + b) + "px",top: (d.top - 20) + "px"});
        c.stop()
    },configureElement: function(a) {
        a = a.up("div");
        this.elementId = a.getAttribute("id");
        this.chapterId = a.previous("h1").getAttribute("id")
    },open: function(a) {
        window.open("/r/editor/edit/" + this.chapterId + "#" + this.elementId)
    }});
var FontUI = Class.create({initialize: function() {
        this.form = $("font_upload_form");
        this.initTableUI();
        this.uploader = new Uploader("font", this.form, this.updateCompleted.bind(this));
        $("font_file").on("change", this.upload.bind(this))
    },initTableUI: function() {
        new TableUI("font_list", {click: this.removeFont.bind(this),url: "/r/font/sort"})
    },removeFont: function(c) {
        var a = c.findElement();
        var d = a.up(1);
        if (a && a.hasClassName("form")) {
            executer.execute("/r/font/update/" + d.getAttribute("id"))
        } else {
            if (a && a.hasClassName("remove")) {
                var b = I18n.get("label.confirm_remove");
                if (a.hasAttribute("title")) {
                    b = a.getAttribute("title")
                }
                if ($confirmRemove(d, b)) {
                    new Ajax.Updater("layout_inner_main", "/r/font/remove/" + d.getAttribute("id"), {onSuccess: function() {
                            d.remove()
                        }})
                }
            }
        }
        c.stop()
    },upload: function(a) {
        this.uploader.upload();
        a.stop()
    },updateCompleted: function() {
        new Ajax.Updater("layout_inner_main", "/r/font/list")
    }});
var FontFormUI = Class.create({initialize: function(a) {
        this.id = a;
        this.panel = new ListSelection("alternative_fonts", this.openFontOverlay.bind(this));
        $("button_save").on("click", this.save.bind(this))
    },save: function(a) {
        this.form = new FormUI("font_form");
        $("font_form").getInputs("checkbox").each(function(b) {
            b.checked = true
        });
        this.form.submit("/r/alternative_font/save/" + this.id);
        a.stop()
    },openFontOverlay: function() {
        this.overlay = new Overlay("label.alternative_fonts", 600);
        this.overlay.addButton("add", this.addItem.bind(this));
        var a = "/r/font/list_font";
        new Ajax.Updater(this.overlay.getContentPanel(), a, {onComplete: this.showOverlay.bind(this)})
    },showOverlay: function() {
        this.overlay.show(150, 100)
    },addItem: function(a) {
        $("select_font_form").getInputs().each(function(b) {
            if (b.checked) {
                var d = b.value;
                var c = b.up().innerText || b.up().textContent;
                this.panel.addItem(d, c)
            }
        }.bind(this));
        this.overlay.close()
    }});
var glossary = {};
glossary.Controller = Class.create({initialize: function() {
        new glossary.GlossaryManager();
        new glossary.TermManager();
        $("app_header").down("select").on("change", this.changeLocale.bind(this))
    },changeLocale: function(a) {
        window.location.hash = "/r/glossary/load/" + a.findElement().value;
        a.stop()
    }});
glossary.FormUI = Class.create({initialize: function() {
        this.glossaryForm = new FormUI("glossary_form").addTextValidator({element: $("glossary_name"),required: true,max: 100}).addTextValidator({element: $("glossary_description"),max: 2000});
        $("button_save").on("click", this.save.bind(this));
        $("glossary_form").on("submit", this.save.bind(this))
    },save: function(a) {
        this.glossaryForm.submit($("glossary_form").getAttribute("action"));
        a.stop()
    }});
glossary.GlossaryManager = Class.create({initialize: function() {
        $("glossary_panel").on("click", "#glossaries li", this.load.bind(this));
        $("glossary_panel").on("click", "#glossaries a.remove", this.remove.bind(this));
        $("glossary_panel").on("click", "#terms_in_glossary li", this.loadTerm.bind(this));
        $("glossary_panel").on("click", "#terms_in_glossary a.remove_term_from_glossary", this.removeTermFromGlossary.bind(this));
        $("glossary_panel").on("click", "#all_terms li", this.loadTerm.bind(this));
        $("glossary_panel").on("click", "#all_terms a.add_term_to_glossary", this.addTermToGlossary.bind(this));
        $("glossary_panel").on("click", "#all_terms a.remove", this.removeTerm.bind(this))
    },load: function(b) {
        if (!b.findElement("a")) {
            var d = $("glossaries");
            var c = $(d.getAttribute("data-current"));
            if (c) {
                c.removeClassName("selected")
            }
            var a = b.findElement("li");
            a.addClassName("selected");
            var e = a.getAttribute("id");
            d.setAttribute("data-current", e);
            new Ajax.Updater(d, "/r/glossary/change_glossary/" + e, {insertion: "after",onSuccess: function(f) {
                    d.next().remove();
                    d.next().remove();
                    this.removeTermEntryPanel()
                }.bind(this)});
            b.stop()
        }
    },remove: function(b) {
        if (confirm(I18n.get("label.confirm_remove"))) {
            var a = b.findElement("li");
            new Ajax.Request("/r/glossary/remove/" + a.getAttribute("id"), {onSuccess: function(c) {
                    a.fadeOut(function() {
                        $("glossaries").removeAttribute("data-current");
                        a.remove();
                        $("terms_in_glossary").down("ul").update();
                        $("all_terms").select(".already_added").each(function(d) {
                            d.removeClassName("already_added")
                        });
                        this.removeTermEntryPanel()
                    }.bind(this))
                }.bind(this)})
        }
        b.stop()
    },loadTerm: function(b) {
        if (!b.findElement("a")) {
            $("terms_in_glossary").select(".selected").each(function(c) {
                c.removeClassName("selected")
            });
            $("all_terms").select(".selected").each(function(c) {
                c.removeClassName("selected")
            });
            var a = b.findElement("li");
            a.addClassName("selected");
            this.removeTermEntryPanel();
            new Ajax.Updater("glossary_container", "/r/term_entry/load/" + a.getAttribute("id"), {insertion: "bottom"});
            b.stop()
        }
    },removeTermEntryPanel: function() {
        var a = $("term_panel");
        if (a) {
            a.remove()
        }
    },addTermToGlossary: function(c) {
        var a = $("glossaries").getAttribute("data-current");
        if (!a) {
            alert(I18n.get("label.select_glossary"));
            c.stop();
            return
        }
        var b = c.findElement("li");
        new Ajax.Updater("glossaries", "/r/glossary/add_term_to_glossary/" + a + "/" + b.getAttribute("id"), {insertion: "after",onSuccess: function(d) {
                b.addClassName("already_added");
                $("glossaries").next().remove()
            }});
        c.stop()
    },removeTermFromGlossary: function(d) {
        var b = $("glossaries").getAttribute("data-current");
        var c = d.findElement("li");
        var a = c.getAttribute("id");
        new Ajax.Request("/r/glossary/remove_term_from_glossary/" + b + "/" + a, {onSuccess: function(e) {
                if (c.hasClassName("selected")) {
                    this.removeTermEntryPanel()
                }
                c.fadeOut(function() {
                    c.remove()
                });
                $("all_terms").down("#" + a).removeClassName("already_added")
            }.bind(this)});
        d.stop()
    },removeTerm: function(c) {
        if (confirm(I18n.get("label.confirm_remove"))) {
            var b = c.findElement("li");
            var a = b.getAttribute("id");
            new Ajax.Request("/r/term/remove/" + a, {onSuccess: function(d) {
                    if (b.hasClassName("selected")) {
                        this.removeTermEntryPanel()
                    }
                    b.fadeOut(function() {
                        b.remove()
                    });
                    var e = $("terms_in_glossary").down("#" + a);
                    if (e) {
                        e.remove()
                    }
                }.bind(this)})
        }
        c.stop()
    }});
glossary.TermEntryFormUI = Class.create({initialize: function() {
        this.termEntryForm = new FormUI("term_entry_form").addTextValidator({element: $("term_entry_name"),required: true,max: 100}).addTextValidator({element: $("term_entry_description"),max: 2000}).addTextValidator({element: $("term_entry_locale"),required: true});
        $("button_save").on("click", this.save.bind(this));
        $("term_entry_form").on("submit", this.save.bind(this))
    },save: function(a) {
        this.termEntryForm.submit($("term_entry_form").getAttribute("action"));
        a.stop()
    }});
glossary.TermManager = Class.create({initialize: function() {
        $("glossary_container").on("click", "#term_panel a.remove", this.remove.bind(this))
    },remove: function(b) {
        var a = b.findElement(".term_entry");
        new Ajax.Request("/r/term_entry/remove/" + a.getAttribute("id"), {onSuccess: function(c) {
                a.fadeOut(function() {
                    a.remove();
                    var d = $("term_panel").getAttribute("data-term-id");
                    var e = $("terms_in_glossary").down("#" + d);
                    e && e.remove();
                    e = $("all_terms").down("#" + d);
                    e && e.remove()
                })
            }});
        b.stop()
    }});
var HyphenationPatternUI = Class.create({initialize: function() {
        this.form = $("hyphenation_pattern_form");
        this.form.previous().on("click", "a.create_hyphenation_pattern", this.showUploadForm.bind(this));
        this.form.on("click", "button", this.upload.bind(this));
        this.form.on("click", "a.cancel", this.hideUploadForm.bind(this));
        this.initTableUI();
        this.uploader = new Uploader("hyphenation_pattern", this.form, this.updateCompleted.bind(this))
    },initTableUI: function() {
        new TableUI("hyphenation_pattern_list", {click: this.tableClicked.bind(this)})
    },tableClicked: function(b) {
        var a = b.findElement();
        var c = a.up(1);
        var d = c.getAttribute("id");
        if (a.hasClassName("form")) {
            executer.execute("/r/hyphenation_pattern/update/" + d)
        } else {
            if (a.hasClassName("remove")) {
                if ($confirmRemove(c, I18n.get("label.confirm_remove"))) {
                    new Ajax.Updater("layout_inner_main", "/r/hyphenation_pattern/remove/" + d)
                }
            }
        }
        b.stop()
    },showUploadForm: function(a) {
        this.form.show();
        a.stop()
    },hideUploadForm: function(a) {
        this.form.hide();
        a.stop()
    },upload: function(a) {
        if (!$F("locale")) {
            alert(I18n.get("label.choose_a_language"))
        } else {
            if (!$F("hyphenation_pattern_file")) {
                alert(I18n.get("label.select_hyphenation_pattern_to_upload"))
            } else {
                this.uploader.upload()
            }
        }
        a.stop()
    },updateCompleted: function() {
        new Ajax.Updater("layout_inner_main", "/r/hyphenation_pattern/list")
    }});
var HyphenationPatternFormUI = Class.create({initialize: function(a) {
        this.id = a;
        $("button_save").on("click", this.save.bind(this))
    },save: function(a) {
        this.form = new FormUI("hyphenation_pattern_form");
        this.form.submit("/r/hyphenation_pattern/update/" + this.id);
        a.stop()
    }});
var ImagePanel = Class.create({initialize: function(a, b) {
        this.returnId = b;
        this.selectionHandler = a
    },show: function(a) {
        if (!this.imageOverlay) {
            this.imageOverlay = new Overlay("label.image", 845, true);
            new Ajax.Updater(this.imageOverlay.getContentPanel(), "/r/image", {onComplete: this.loadPanel.bind(this)})
        }
        this.imageOverlay.show(50, 50)
    },loadPanel: function(a) {
        delete this.uploader;
        delete this.removeHandle;
        this.panel = this.imageOverlay.getContentPanel().select(".image_panel")[0];
        this.panel.on("mouseover", ".image_list div", this.overImage.bind(this));
        this.panel.on("click", ".image_list div", this.selectImage.bind(this));
        this.panel.down("input[type=file]").on("change", this.upload.bind(this))
    },selectImage: function(c) {
        if (this.selectionHandler) {
            var b = c.findElement();
            if (b.tagName != "IMG") {
                b = b.select("img")[0]
            }
            if (b) {
                var d = b.src.replace(window.location.protocol + "//" + window.location.host, "");
                if (this.returnId) {
                    var a = d.split("/");
                    d = a[a.length - 1]
                }
                this.selectionHandler("url(" + d + ")", d);
                this.imageOverlay.close()
            }
        }
        c.stop()
    },overImage: function(b) {
        var a = b.findElement();
        if (a.tagName === "IMG") {
            a = a.up()
        }
        this.removeHandle = this.getRemoveHandler();
        var c = a.positionedOffset();
        this.removeHandle.setStyle({display: "block",left: (c.left + 87 - this.removeHandle.getWidth()) + "px",top: (c.top + 3) + "px"});
        this.currentImage = a;
        b.stop()
    },getRemoveHandler: function() {
        if (!this.removeHandle) {
            this.removeHandle = new Element("div", {id: "tool_handle"});
            this.removeHandle.update(I18n.get("label.remove"));
            this.removeHandle.on("click", this.removeImage.bind(this));
            this.panel.appendChild(this.removeHandle)
        }
        return this.removeHandle
    },removeImage: function(a) {
        var b = this.currentImage.down().getAttribute("src");
        if (confirm(I18n.get("label.confirm_remove"))) {
            new Ajax.Request(b.replace("get", "remove"));
            this.currentImage.remove();
            this.removeHandle.hide()
        }
        a.stop
    },upload: function(a) {
        if (!this.uploader) {
            this.form = this.panel.select("form")[0];
            this.uploader = new Uploader("image", this.form, this.updateCompleted.bind(this))
        }
        this.uploader.upload();
        a.stop()
    },updateCompleted: function() {
        new Ajax.Updater(this.imageOverlay.getContentPanel(), "/r/image", {onComplete: this.loadPanel.bind(this)})
    }});
var BookImporter = Class.create({initialize: function(a) {
        this.panel = $("progress_bar");
        this.form = $("book_import_form");
        this.controllerUrl = "/r/import_book/";
        $("import_file").on("change", this.upload.bind(this))
    },upload: function(a) {
        new Ajax.Request("/r/uuid", {onComplete: this.importBook.bind(this)});
        a.stop()
    },importBook: function(a) {
        if (!this.uploadTarget) {
            this.uploadTarget = new Element("iframe", {id: "upload_target",name: "upload_target",style: "display: none"});
            document.body.appendChild(this.uploadTarget);
            this.form.setAttribute("target", "upload_target")
        }
        var b = a.responseText;
        this.form.action = "/r/import_book/upload/" + b;
        this.form.submit();
        this.monitor(b)
    },monitor: function(e) {
        var b = this.controllerUrl + "monitor_progress/" + e;
        var d = 0;
        var c;
        var a;
        this.panel.select(".progress_panel").invoke("remove");
        var f = this.panel.down();
        new ProgressBar(f).start({run: function() {
                new Ajax.Request(b, {onComplete: function(g) {
                        var h = g.headerJSON;
                        d = h.rate;
                        c = h.value;
                        a = h.error
                    }});
                return {rate: d,type: c,error: a}
            },done: function() {
                executer.menuManager.move(c === "book" ? "book_dashboard" : "book_theme")
            },forwardToAlertPage: function(g) {
                executer.execute("/r/app/invalid_license/" + g)
            }})
    }});
var PdfPageLayout = Class.create({initialize: function(b, a) {
        this.id = b;
        Picker.pdf = true;
        this.singlePageMode = a;
        $("paper_size").on("change", this.changePageSize.bind(this));
        $("page_size_form").select("input").each(function(c) {
            c.on("change", this.changeLayout.bind(this))
        }.bind(this));
        if (!a) {
            $("pdf_page_layout_page_type_panel").select("label")[5].insert({after: "<br>"})
        }
        this.page = $("pdf_page_layout_page");
        this.page.on("click", this.select.bind(this));
        this.page.on("dblclick", this.editText.bind(this));
        this.page.on("mousedown", "div.pdf_page_layout_item", this.move.bind(this));
        this.page.on("mousedown", "div.resize", this.resize.bind(this));
        this.page.on("click", "a.remove", this.remove.bind(this));
        this.page.on("click", "a.copy", this.copy.bind(this));
        this.saveButton = $("button_save_now");
        this.saveButton.on("click", this.save.bind(this));
        this.itemPanel = new PdfPageLayoutItemPanel(this);
        this.itemConroller = new PdfPageLayoutItemController(this);
        this.pageType = PdfPageLayout.DEFAULT_PAGE_TYPE;
        this.typePanel = $("pdf_page_layout_page_type_panel");
        this.typePanel.on("click", "input", this.changePageType.bind(this));
        this.typePanel.on("click", "a", this.paste.bind(this));
        this.pasteLink = this.typePanel.select("a")[0];
        this.pasteLink.addClassName("disabled");
        new PdfPageLayoutShortcut(this, this.itemConroller);
        new PdfPageLayoutPreviewer(this);
        this.setUpPage()
    },setUpPage: function(b, a) {
        if (b) {
            $("page_width").value = b
        }
        if (a) {
            $("page_height").value = a
        }
        this.changeLayout();
        this.changed()
    },changePageSize: function(b) {
        var a = b.findElement().value;
        if (a === "Letter") {
            this.setUpPage(21.59, 27.94)
        } else {
            if (a === "Legal") {
                this.setUpPage(21, 35.56)
            } else {
                if (a === "Executive") {
                    this.setUpPage(18.41, 26.67)
                } else {
                    if (a === "A3") {
                        this.setUpPage(29.7, 42)
                    } else {
                        if (a === "A4") {
                            this.setUpPage(21, 29.7)
                        } else {
                            if (a === "A5") {
                                this.setUpPage(14.8, 21)
                            }
                        }
                    }
                }
            }
        }
        b.stop()
    },save: function(b) {
        if (new PdfPageLayoutMarginChecker().check()) {
            this.saveButton.disabled = true;
            this.saveButton.next().hide();
            var a = this.singlePageMode ? "/r/single_page_design/update/" : "/r/pdf_page_layout/update_page_layout/";
            new Ajax.Request(a + this.id, {parameters: this.getParameters()})
        }
        b.stop()
    },getParameters: function() {
        var a = this.singlePageMode ? {} : $("page_size_form").serialize(true);
        a.item_class = $A();
        a.item_style = $A();
        a.item_content = $A();
        this.page.select(".pdf_page_layout_item").each(function(b) {
            a.item_class.push(b.getAttribute("class"));
            a.item_style.push(b.getAttribute("data-layout"));
            var c = "";
            if (b.hasClassName("text")) {
                c = b.down("img").alt
            } else {
                if (b.hasClassName("image")) {
                    c = b.down("img").getAttribute("src")
                }
            }
            a.item_content.push(c)
        }.bind(this));
        return a
    },getPageStyle: function() {
        var a = {};
        if (this.pageType === "left_page") {
            a.width = ($F("page_width") - $F("margin_outside_left") - $F("margin_inside_left")) + "cm";
            a.height = ($F("page_height") - $F("margin_top") - $F("margin_bottom")) + "cm";
            a.paddingLeft = $F("margin_outside_left") + "cm";
            a.paddingRight = $F("margin_inside_left") + "cm"
        } else {
            a.width = ($F("page_width") - $F("margin_outside_right") - $F("margin_inside_right")) + "cm";
            a.height = ($F("page_height") - $F("margin_top") - $F("margin_bottom")) + "cm";
            a.paddingRight = $F("margin_outside_right") + "cm";
            a.paddingLeft = $F("margin_inside_right") + "cm"
        }
        a.paddingTop = $F("margin_top") + "cm";
        a.paddingBottom = $F("margin_bottom") + "cm";
        return a
    },changePageType: function(a) {
        this.pageType = a.findElement().value;
        this.itemConroller.select();
        this.changeLayout();
        this.page.select(".pdf_page_layout_item").each(function(b) {
            if (b.hasClassName(this.pageType)) {
                b.show()
            } else {
                b.hide()
            }
        }.bind(this));
        a.findElement().blur()
    },changeLayout: function(b) {
        if (this.configured) {
            this.changed()
        }
        var a = this.getPageStyle();
        this.page.setStyle(a)
    },addItem: function(a, b) {
        a.addClassName(this.pageType);
        a.setAttribute("data-layout", a.getAttribute("style"));
        this.page.insert(a);
        this.itemConroller.select(null, a);
        this.changed();
        if (!b) {
            this.editText()
        }
    },select: function(a) {
        if (a.findElement("textarea")) {
            return
        }
        if (this.textField && this.textField.visible()) {
            this.textField.hide();
            if (this.textField.selectedItem.renderText(null, this.textField.value)) {
                this.changed()
            }
        } else {
            this.itemConroller.select(a)
        }
    },editText: function(a) {
        var b = this.itemConroller.selectedItem;
        if (b.isText()) {
            if (!this.textField) {
                this.textField = new Element("textarea", {id: "pdf_page_layout_text_field"});
                this.page.insert(this.textField)
            }
            this.textField.selectedItem = b;
            this.textField.value = b.getText();
            this.textField.setStyle({height: Math.max(100, b.getHeight()) + "px",left: b.getLeft() + "px",top: b.getTop() + "px",width: b.getWidth() + "px"});
            this.textField.show();
            this.textField.focus()
        }
        a && a.stop()
    },move: function(a) {
        this.itemConroller.move(a)
    },resize: function(a) {
        this.itemConroller.resize(a);
        this.changed()
    },copy: function(a) {
        var b = this.itemConroller.selectedItem;
        if (b) {
            this.copiedItem = b.getActual().clone(true);
            this.copiedItem.removeClassName(this.pageType);
            this.copiedItem.removeClassName("selected");
            this.pasteLink.removeClassName("disabled")
        }
        a && a.stop()
    },paste: function(a) {
        if (this.copiedItem) {
            this.addItem(this.copiedItem.clone(true), true)
        }
        a && a.stop()
    },remove: function(a) {
        if (this.itemConroller.remove()) {
            this.changed()
        }
        a && a.stop()
    },changed: function() {
        if (this.configured) {
            this.saveButton.disabled = false;
            this.saveButton.next().show()
        } else {
            this.configured = true;
            this.saveButton.disabled = true;
            this.saveButton.next().hide()
        }
    },getWidth: function() {
        return this.page.getWidth()
    },getHeight: function() {
        return this.page.getHeight()
    }});
PdfPageLayout.DEFAULT_PAGE_TYPE = "left_page";
var PdfPageLayoutFormUI = Class.create({initialize: function(a) {
        if (a != "null") {
            this.id = a
        }
        this.pageLayoutForm = new FormUI("pdf_page_layout_form").addTextValidator({element: "pdf_page_layout_name",required: true,max: 100}).addTextValidator({element: "pdf_page_layout_description",max: 2000});
        $("button_save").on("click", this.save.bind(this));
        $("pdf_page_layout_form").on("submit", this.save.bind(this))
    },save: function(a) {
        var b = this.id ? "/r/pdf_page_layout/update/" + this.id : "/r/pdf_page_layout/create";
        Progress.showLoadingMessage();
        this.pageLayoutForm.submit(b);
        a.stop()
    }});
var PdfPageLayoutImageHandler = Class.create({initialize: function(b, a) {
        this.page = b;
        this.panel = a
    },add: function(b) {
        var c = b.replace("url(", "").replace(")", "");
        var a = this.panel.makeItem("image");
        var b = new Element("img", {src: c});
        a.insert(b);
        b.onload = function() {
            this.adjustImageSize(a, b)
        }.bind(this);
        this.page.addItem(a)
    },adjustImageSize: function(e, f) {
        var d = f.width;
        var a = f.height;
        var b = this.page.getWidth();
        if (d > b) {
            var c = a / d;
            d = b;
            a = d * c
        }
        f.setAttribute("width", d);
        f.setAttribute("height", a);
        e.setStyle({width: d + "px",height: a + "px"})
    }});
var PdfPageLayoutItem = Class.create({initialize: function(b, a) {
        this.element = b;
        this.pageLayout = a
    },getActual: function() {
        return this.element
    },select: function() {
        this.element.addClassName("selected");
        $("paper_size").blur()
    },deselect: function() {
        this.element.removeClassName("selected")
    },isText: function() {
        return this.element.hasClassName("text")
    },isHorizontal: function() {
        return this.element.hasClassName("horizontal")
    },isVertical: function() {
        return this.element.hasClassName("vertical")
    },isImage: function() {
        return this.element.hasClassName("image")
    },isFlag: function() {
        return this.element.hasClassName("start_content_here")
    },getText: function() {
        return this.element.down("img").alt
    },setText: function(c, b) {
        var a = this.element.down("img");
        a.alt = c;
        a.setAttribute("src", b);
        a.removeAttribute("width");
        a.removeAttribute("height")
    },renderText: function(a, b) {
        if (!this.isText()) {
            return
        }
        if (!a && b === this.getText()) {
            return
        }
        if (a) {
            a.width = this.getStyle("width")
        } else {
            a = {};
            a.color = this.getStyle("color");
            a["font-family"] = this.getStyle("font-family");
            a["font-style"] = this.getStyle("font-style");
            a["font-weight"] = this.getStyle("font-weight");
            a["font-size"] = this.getStyle("font-size");
            a["line-height"] = this.getStyle("line-height");
            a["text-align"] = this.getStyle("text-align");
            a.width = this.getStyle("width")
        }
        a.text = b || this.element.down("img").alt;
        Progress.start(this.element);
        new Ajax.Request("/r/pdf_page_layout/preview_text", {parameters: a,onComplete: function(c) {
                Progress.stop();
                this.setText(a.text, c.responseText)
            }.bind(this)});
        return true
    },getHeight: function() {
        return this.element.getHeight()
    },getWidth: function() {
        return this.element.getWidth()
    },getLeft: function() {
        var a = this.element.getLayout().get("left");
        if (!window.getSelection) {
            a -= 1
        }
        return a
    },getTop: function() {
        var a = this.element.getLayout().get("top");
        if (!window.getSelection) {
            a -= 1
        }
        return a
    },getStyle: function(b) {
        if (b) {
            var a = this.element.getStyle(b);
            if (b === "font-family") {
                a = a.gsub('"', "")
            } else {
                if (b === "font-weight") {
                    if (a === "400") {
                        a = "normal"
                    } else {
                        if (a === "700") {
                            a = "bold"
                        }
                    }
                }
            }
            return a
        }
        var a = this.element.getAttribute("data-layout") || "";
        a = a.replace(/; /g, "&");
        a = a.replace(/: /g, "=");
        return a
    },setStyle: function(a) {
        if (Prototype.Browser.Gecko || Prototype.Browser.Opera) {
            var b = {};
            Object.keys(a).each(function(c) {
                b[c.camelize()] = a[c]
            });
            a = b
        }
        this.element.setStyle(a);
        this.element.setAttribute("data-layout", this.element.getAttribute("style"));
        this.pageLayout.changed()
    },startResize: function() {
        document.body.style.cursor = "crosshair";
        this.element.addClassName("resize")
    },endResize: function() {
        document.body.style.cursor = "default";
        this.element.removeClassName("resize")
    },resize: function(c, b) {
        if (this.isText() || this.isHorizontal()) {
            b = 0
        } else {
            if (this.isVertical()) {
                c = 0
            } else {
                if (this.isImage()) {
                    b = c * this.getHeight() / this.getWidth()
                }
            }
        }
        var d = Number(this.getStyle("width").replace("px", ""));
        var a = Number(this.getStyle("height").replace("px", ""));
        this.setStyle({width: (d + c) + "px",height: (a + b) + "px",});
        if (this.isImage()) {
            this.element.down("img").setAttribute("width", d + c);
            this.element.down("img").setAttribute("height", a + b)
        }
    },remove: function() {
        this.element.remove()
    }});
var PdfPageLayoutItemController = Class.create({initialize: function(a) {
        this.pageLayout = a;
        this.formatter = new PdfPageLayoutItemFormatter();
        this.tooltip = new PdfPageLayoutTooltip()
    },select: function(b, a) {
        if (b && b.findElement(".remove, .copy")) {
            return
        }
        if (this.selectedItem) {
            this.selectedItem.deselect();
            delete this.selectedItem;
            this.tooltip.hide()
        }
        a = b ? b.findElement(".pdf_page_layout_item") : a;
        if (a) {
            this.selectedItem = new PdfPageLayoutItem(a, this.pageLayout);
            this.selectedItem.select();
            this.tooltip.show(this.selectedItem)
        }
        this.formatter.setTarget(this.selectedItem)
    },move: function(b) {
        this.select(b);
        if (this.selectedItem && !b.findElement(".resize")) {
            var j = this.selectedItem;
            document.body.style.cursor = "move";
            var d = j.getLeft();
            var h = j.getTop();
            var f = b.pointerX();
            var e = b.pointerY();
            var c = {};
            var i = false;
            var g = document.on("mousemove", function(n) {
                var k = n.pointerX();
                var o = n.pointerY();
                var m = k - f;
                var l = o - e;
                d += m;
                h += l;
                if (m !== 0 || l !== 0) {
                    i = true
                }
                if (!j.isFlag()) {
                    c.left = d + "px"
                }
                c.top = h + "px";
                j.setStyle(c);
                f = k;
                e = o;
                this.tooltip.update();
                n.stop()
            }.bind(this));
            var a = document.on("mouseup", function(k) {
                document.body.style.cursor = "auto";
                g.stop();
                a.stop();
                delete g;
                delete a;
                if (i) {
                    this.pageLayout.changed()
                }
                k.stop()
            }.bind(this))
        }
        b.stop()
    },moveBy: function(c, b) {
        c = c || 0;
        b = b || 0;
        if (this.selectedItem) {
            var a = this.selectedItem.getLeft();
            var d = this.selectedItem.getTop();
            this.selectedItem.setStyle({left: (a + c) + "px",top: (d + b) + "px"});
            this.tooltip.update();
            this.pageLayout.changed()
        }
    },resize: function(c) {
        if (this.selectedItem) {
            var b = this.selectedItem;
            b.startResize();
            var f = c.pointerX();
            var e = c.pointerY();
            var d = document.on("mousemove", function(j) {
                var g = j.pointerX();
                var k = j.pointerY();
                var i = g - f;
                var h = k - e;
                b.resize(i, h);
                f = g;
                e = k;
                this.tooltip.update(b);
                j.stop()
            }.bind(this));
            var a = document.on("mouseup", function(g) {
                b.renderText();
                b.endResize();
                d.stop();
                a.stop();
                delete d;
                delete a;
                g.stop()
            }.bind(this))
        }
        c.stop()
    },remove: function() {
        var a = this.selectedItem;
        if (a && confirm(I18n.get("label.confirm_remove"))) {
            a.remove();
            this.tooltip.hide();
            delete this.selectedItem;
            return true
        }
    }});
var PdfPageLayoutItemFormatter = Class.create({initialize: function() {
        this.sizeForm = $("page_size_form");
        this.textForm = $("pdf_page_layout_text_form");
        this.horizontalForm = $("pdf_page_layout_horizontal_form");
        this.verticalForm = $("pdf_page_layout_vertical_form");
        this.borderDesigner = new BorderDesigner()
    },setTarget: function(a) {
        this.hideForm();
        if (a) {
            this.selectedItem = a;
            this.openForm()
        } else {
            this.sizeForm.show()
        }
    },openForm: function() {
        var a;
        if (this.selectedItem.isText()) {
            a = this.textForm
        } else {
            if (this.selectedItem.isHorizontal()) {
                a = this.horizontalForm
            } else {
                if (this.selectedItem.isVertical()) {
                    a = this.verticalForm
                }
            }
        }
        if (a) {
            a.reset();
            a.setStyle({display: "block"});
            this.bindForm(a);
            this.formObserver = new Form.Observer(a, 0.3, this.formChanged.bind(this))
        }
    },hideForm: function() {
        [this.sizeForm, this.textForm, this.horizontalForm, this.verticalForm].invoke("hide");
        this.stopFormObserver()
    },bindForm: function(c) {
        c.getElements().each(function(f) {
            var d = f.name;
            if (d !== "text" && d != "border_style" && d != "border_color" && d != "border_width") {
                var e = this.selectedItem.getStyle(f.name);
                if (e && e.endsWith("px")) {
                    e = e.replace("px", "pt")
                }
                if (d === "font-family" && Prototype.Browser.Opera) {
                    e = e.gsub('"', "")
                }
                f.setValue(e);
                if (f.name.endsWith("color")) {
                    f.up().setStyle({backgroundColor: e})
                }
            }
        }.bind(this));
        if (this.selectedItem.isText()) {
            var b = "bold" === this.selectedItem.getStyle("font-weight");
            var a = "italic" === this.selectedItem.getStyle("font-style");
            if (b && a) {
                $("font-style").setValue("bold_italic")
            } else {
                if (b) {
                    $("font-style").setValue("bold")
                } else {
                    if (a) {
                        $("font-style").setValue("italic")
                    }
                }
            }
            this.borderDesigner.init()
        }
    },formChanged: function(b, c) {
        var a = b.serialize(true);
        if (this.selectedItem.isText()) {
            var d = a["font-style"];
            if (d === "italic" || d === "bold_italic") {
                a["font-style"] = "italic"
            } else {
                a["font-style"] = "normal"
            }
            if (d === "bold" || d === "bold_italic") {
                a["font-weight"] = "bold"
            } else {
                a["font-weight"] = "normal"
            }
            if (this.textStyleChanged(a)) {
                this.selectedItem.renderText(a)
            }
        }
        this.selectedItem.setStyle(a)
    },textStyleChanged: function(a) {
        if (this.selectedItem.getStyle("font-family") !== a["font-family"] || this.selectedItem.getStyle("font-size") !== a["font-size"] || this.selectedItem.getStyle("font-style") !== a["font-style"] || this.selectedItem.getStyle("font-weight") !== a["font-weight"] || this.selectedItem.getStyle("line-height") !== a["line-height"] || this.selectedItem.getStyle("text-align") !== a["text-align"] || this.selectedItem.getStyle("color") !== a.color) {
            return true
        }
        return false
    },stopFormObserver: function() {
        if (this.formObserver) {
            this.formObserver.stop();
            delete this.formObserver
        }
    }});
var PdfPageLayoutItemPanel = Class.create({initialize: function(a) {
        this.page = a;
        this.itemPanel = $("pdf_page_layout_item_panel");
        this.itemPanel.on("mousedown", "img", this.move.bind(this))
    },move: function(b) {
        var i = b.findElement("img");
        if (i) {
            i = this.copyHandler(i);
            document.body.style.cursor = "move";
            var d = b.pointerX();
            var h = b.pointerY();
            var f = d;
            var e = h;
            var c = {};
            var g = document.on("mousemove", function(m) {
                var j = m.pointerX();
                var n = m.pointerY();
                var l = j - f;
                var k = n - e;
                d += l;
                h += k;
                c.left = (d - 10) + "px";
                c.top = h + "px";
                i.setStyle(c);
                f = j;
                e = n;
                m.stop()
            }.bind(this));
            var a = document.on("mouseup", function(k) {
                document.body.style.cursor = "auto";
                g.stop();
                a.stop();
                delete g;
                delete a;
                var j = i.className;
                var l = $("pdf_page_layout_page").cumulativeOffset();
                this.x = f - l.left;
                this.y = Math.max(30, e - l.top);
                if (j === "image") {
                    this.openImagePanel()
                } else {
                    this.page.addItem(this.makeItem(j))
                }
                i.remove();
                k.stop()
            }.bind(this))
        }
        b.stop()
    },copyHandler: function(b) {
        var a = new Element("img");
        a.src = b.src;
        a.className = b.className;
        a.title = b.title;
        a.setStyle({position: "absolute"});
        document.body.appendChild(a);
        return a
    },addItemToPage: function(b) {
        var a = this.getItemType(b);
        if (a === "image") {
            this.openImagePanel()
        } else {
            this.page.addItem(this.makeItem(a))
        }
        b.stop()
    },getItemType: function(a) {
        return a.findElement().className
    },openImagePanel: function() {
        if (!this.imagePanel) {
            this.imagePanel = new ImagePanel(this.addImageToPage.bind(this))
        }
        this.imagePanel.show()
    },addImageToPage: function(a) {
        this.imageHandler = this.imageHandler || new PdfPageLayoutImageHandler(this.page, this);
        this.imageHandler.add(a)
    },makeItem: function(c, b, e) {
        var a = new Element("div", {"class": "pdf_page_layout_item " + c});
        a.insert(new Element("div", {"class": "item_action resize"}));
        if (c === "text") {
            var d = new Element("img", {src: "/resource/image/book/layout/default_text.png",alt: I18n.get("label.add_text")});
            a.setStyle({color: "rgb(0, 0, 0)",fontFamily: "NanumGothic",fontSize: "10pt",lineHeight: "1.5em",width: ($("pdf_page_layout_page_content").getWidth() - 2) + "px"});
            a.insert(d)
        } else {
            if (c === "horizontal") {
                a.setStyle({borderTopStyle: "solid",borderTopColor: "rgb(0, 0, 0)",borderTopWidth: "1pt",height: "5px",width: $("pdf_page_layout_page_content").getWidth() + "px"})
            } else {
                if (c === "vertical") {
                    a.setStyle({borderLeftStyle: "solid",borderLeftColor: "rgb(0, 0, 0)",borderLeftWidth: "1pt",height: "100px",width: "5px"})
                }
            }
        }
        a.setStyle({left: this.x + "px",top: this.y + "px"});
        return a
    }});
PdfPageLayoutItemPanel.DEFAULT_PAGE_TYPE = "left_page";
var PdfPageLayoutMarginChecker = Class.create({check: function() {
        var c = Number($F("margin_outside_left"));
        var d = Number($F("margin_inside_left"));
        var b = Number($F("margin_outside_right"));
        var a = Number($F("margin_inside_right"));
        var e = (c + d) - (b + a);
        if (e !== 0) {
            alert(I18n.get("label.must_be_equal_the_sum_of_inner_and_outer_margin"));
            return false
        } else {
            return true
        }
    }});
var PdfPageLayoutPreviewer = Class.create({initialize: function(a) {
        this.pageLayout = a;
        this.pageLayoutId = a.id;
        this.form = new FormUI("page_size_form", this.buildParameters.bind(this)).addTextValidator({element: "pdf_theme",required: true}).addTextValidator({element: "book_id",required: true});
        $("button_preview").on("click", this.preview.bind(this));
        $("preview_panel").on("click", "a", this.checkError.bind(this))
    },buildParameters: function(b) {
        var a = this.pageLayout.getParameters();
        a.pdf_theme = $F("pdf_theme");
        a.book_id = $F("book_id");
        return a
    },preview: function(d) {
        if (!new PdfPageLayoutMarginChecker().check()) {
            d.stop();
            return
        }
        var c = $("preview_panel").down(".build_result");
        if (c) {
            c.remove()
        }
        var e = $F("book_id");
        var b = 0;
        if (this.form.request("/r/pdf_page_layout_previwer/preview/" + this.pageLayoutId)) {
            $("button_preview").disabled = true;
            var a = new ProgressBar($("preview_panel"));
            a.start({run: function() {
                    new Ajax.Request("/r/pdf_page_layout_previwer/monitor/" + e, {onComplete: function(f) {
                            var g = f.headerJSON;
                            if (g.code === "error") {
                                $("preview_panel").insert(f.responseText);
                                a.errorHappend()
                            }
                            b = g.rate
                        }});
                    return {rate: b}
                },done: function(f) {
                    $("button_preview").disabled = false;
                    $("pdf_page_layout").select(".progress_panel").invoke("remove");
                    window.location.href = "/r/pdf_page_layout_previwer/download/" + e
                }})
        }
        d.stop()
    },checkError: function(d) {
        var b = d.findElement();
        var c = b.getAttribute("data-group");
        var a = b.getAttribute("data-element");
        window.open("/r/editor/edit/" + c + "#" + a);
        d.stop()
    }});
var PdfPageLayoutShortcut = Class.create({initialize: function(a, b) {
        this.pageLayout = a;
        this.itemController = b;
        if (!window.shortcutExecuter) {
            window.shortcutExecuter = {shortcut: new Shortcut(document)};
            window.shortcutExecuter.bind = function(c, d) {
                this.shortcut.bind(c, d)
            }
        }
        shortcutExecuter.bind("ctrl_c", this.copy.bind(this));
        shortcutExecuter.bind("ctrl_v", this.paste.bind(this));
        shortcutExecuter.bind("delete", this.remove.bind(this));
        shortcutExecuter.bind("up", this.move.bind(this));
        shortcutExecuter.bind("down", this.move.bind(this));
        shortcutExecuter.bind("left", this.move.bind(this));
        shortcutExecuter.bind("right", this.move.bind(this))
    },copy: function(c, a, b) {
        if (Shortcut.formFocused()) {
            return "ignore"
        }
        this.pageLayout.copy()
    },paste: function(c, a, b) {
        if (Shortcut.formFocused()) {
            return "ignore"
        }
        this.pageLayout.paste()
    },remove: function(c, a, b) {
        if (Shortcut.formFocused()) {
            return "ignore"
        }
        this.pageLayout.remove()
    },move: function(e, c, d) {
        if (Shortcut.formFocused()) {
            return "ignore"
        }
        var b, a;
        if (c === "up") {
            a = -1
        } else {
            if (c === "down") {
                a = 1
            } else {
                if (c === "left") {
                    b = -1
                } else {
                    if (c === "right") {
                        b = 1
                    }
                }
            }
        }
        this.itemController.moveBy(b, a)
    }});
var PdfPageLayoutTooltip = Class.create({show: function(b) {
        this.item = b;
        if (!this.tooltip) {
            this.tooltip = new Element("div", {"class": "tooltip without_close",});
            var a = "<div><span></span>";
            a += "<a href='#' class='remove'>" + I18n.get("label.remove") + "</a>";
            a += "<a href='#' class='copy'>" + I18n.get("label.copy") + "</a></div>";
            a += "<div class='arrow'></div>";
            this.tooltip.update(a);
            $("pdf_page_layout_page").insert(this.tooltip)
        }
        if (this.item.isFlag()) {
            this.tooltip.select("a").each(function(c) {
                c.hide()
            })
        }
        this.update();
        this.tooltip.show()
    },update: function() {
        var c = this.item;
        var a = c.getLeft();
        var d = c.getTop();
        var b = c.isFlag() ? "y: " + d : "x: " + a + ", y: " + d;
        if (!c.isVertical() && !c.isFlag()) {
            b += ", w: " + c.getWidth()
        }
        if (c.isVertical() || c.isImage()) {
            b += ", h: " + c.getHeight()
        }
        this.tooltip.down("span").update(b);
        this.tooltip.setStyle({left: a + "px",top: (d - 45) + "px"})
    },hide: function() {
        if (this.item.isFlag()) {
            this.tooltip.select("a").each(function(a) {
                a.show()
            })
        }
        this.tooltip.hide()
    }});
var PdfPageLayoutUI = Class.create({initialize: function() {
        $$("a.create_pdf_page_layout")[0].on("click", this.create.bind(this));
        this.initTableUI()
    },initTableUI: function() {
        new TableUI("pdf_page_layout_table", {click: this.clickTable.bind(this),url: "/r/pdf_page_layout/sort"})
    },clickTable: function(b) {
        var a = b.findElement();
        if (a) {
            var c = a.up(1);
            var d = c.getAttribute("id");
            if (a.hasClassName("view")) {
                executer.execute("/r/pdf_page_layout/view/" + d);
                Progress.showLoadingMessage()
            } else {
                if (a.hasClassName("copy")) {
                    new Ajax.Updater("layout_inner_main", "/r/pdf_page_layout/copy/" + d)
                } else {
                    if (a.hasClassName("remove") && $confirmRemove(c)) {
                        new Ajax.Updater("layout_inner_main", "/r/pdf_page_layout/remove/" + d)
                    }
                }
            }
        }
        b.stop()
    },create: function(a) {
        executer.execute("/r/pdf_page_layout/create");
        a.stop()
    }});
var ProgressBar = Class.create({initialize: function(a) {
        this.target = $(a)
    },start: function(c) {
        this.handler = c;
        var a;
        if (c.align === "left") {
            a = "progress_panel left_align"
        } else {
            a = "progress_panel"
        }
        this.panel = new Element("div", {"class": a});
        var d = new Element("div");
        d.setStyle({width: "0%"});
        if (c.name) {
            var b = new Element("span", {"class": "name"});
            b.update(c.name);
            this.panel.insert(b)
        }
        this.label = new Element("span", {"class": "label"});
        this.panel.insert(d);
        this.panel.insert(this.label);
        this.target.insert({after: this.panel});
        this.pe = new PeriodicalExecuter(function(f) {
            var e = c.run();
            if (e.error) {
                f.stop();
                c.forwardToAlertPage(e.error)
            }
            if (e.rate >= 100) {
                f.stop();
                c.done()
            }
            d.setStyle({width: e.rate + "%"});
            this.label.update(e.label || e.rate + "%")
        }.bind(this), 1)
    },errorHappend: function() {
        this.label.update("100%");
        this.panel.addClassName("error");
        this.pe.stop();
        this.handler.done(true)
    }});
var ProjectAllocator = Class.create({initialize: function(a) {
        this.panel = a;
        this.allocate()
    },allocate: function() {
        var g = this.getColumnCount();
        var d = 0;
        var c = this.panel.select("li.insertable");
        var e = c.length;
        for (var b = 0; b < e; b++) {
            var f = c[b];
            if (b != 0 && b % g == 0) {
                for (var a = b - g; a < b; a++) {
                    c[a].setStyle({height: d + "px"})
                }
                d = this.getHeight(f)
            } else {
                if (b === e - 1) {
                    d = Math.max(d, this.getHeight(f));
                    for (var a = b - e % g + 1; a < b + 1; a++) {
                        c[a].setStyle({height: d + "px"})
                    }
                } else {
                    d = Math.max(d, this.getHeight(f))
                }
            }
        }
        this.configureLayout()
    },configureLayout: function() {
        var c = this.panel.getWidth();
        var b = Math.floor(c / 340);
        var a = 330 + Math.floor((c - b * 340) / b);
        this.panel.select("li.project").each(function(d) {
            d.setStyle({width: a + "px"})
        })
    },getColumnCount: function() {
        return Math.floor(this.panel.getWidth() / 340)
    },getHeight: function(b) {
        var a = b.getAttribute("data-height");
        if (!a) {
            a = b.getHeight();
            b.setAttribute("data-height", a)
        }
        return a
    }});
var ProjectDocAssigner = Class.create({initialize: function(a) {
        this.id = a;
        $("button_save").on("click", this.save.bind(this));
        $("project_doc_assign_form").on("submit", this.save.bind(this))
    },save: function(a) {
        var b = "/r/project/assign_document/" + this.id;
        new FormUI("project_doc_assign_form").submit(b);
        a.stop()
    }});
var ProjectFormUI = Class.create({initialize: function() {
        this.projectForm = new FormUI("project_form").addTextValidator({element: "project_name",required: true,max: 100}).addTextValidator({element: "project_description",max: 2000});
        $("button_save").on("click", this.save.bind(this));
        $("project_form").on("submit", this.save.bind(this))
    },save: function(a) {
        var b = $("project_form").action;
        this.projectForm.submit(b);
        a.stop()
    }});
var ProjectList = Class.create({initialize: function() {
        this.panel = $("project_list_panel");
        this.panel.on("click", "a.remove", this.remove.bind(this));
        this.allocator = new ProjectAllocator(this.panel);
        new ProjectSorter(this.panel, this.sort.bind(this), this.allocator);
        window.onresize = function(a) {
            if ($("project_list_panel")) {
                this.allocator.allocate()
            }
        }.bind(this)
    },remove: function(a) {
        a.stop();
        if (I18n.confirm("label.confirm_remove")) {
            var b = a.findElement(".project");
            Progress.start(b);
            new Ajax.Request("/r/project/remove/" + b.getAttribute("id"), {onComplete: function(c) {
                    b.fadeOut(function() {
                        b.remove();
                        Progress.stop();
                        this.allocator.allocate()
                    }.bind(this))
                }.bind(this)})
        }
    },sort: function(a, b) {
        var c = {project: $A()};
        a.select("li.insertable").each(function(d) {
            c.project.push(d.getAttribute("id"))
        });
        new Ajax.Request("/r/project/sort", {parameters: c})
    }});
var ProjectSorter = Class.create({initialize: function(a, c, b) {
        this.panel = a;
        this.handler = c;
        this.allocator = b;
        this.panel.on("mouseover", this.over.bind(this));
        this.panel.on("mouseleave", this.out.bind(this))
    },over: function(d) {
        var c = d.findElement("li.insertable");
        if (!c) {
            d.stop();
            return
        }
        if (c != this.selected) {
            if (this.selected) {
                this.selected.removeClassName("over")
            }
            this.selected = c;
            if (this.status !== "move") {
                this.selected.addClassName("over");
                var e = this.getMoveHandler();
                var g = c.cumulativeOffset();
                e.setStyle({display: "block",left: (g.left + this.selected.getWidth() - 20) + "px",top: (g.top + 10) + "px"})
            }
        }
        if (this.status === "move") {
            var g = c.cumulativeOffset();
            var f = g.left;
            var a = this.dragged.getLayout().get("left");
            var b = c.getLayout().get("padding-box-width");
            if (a < f + b / 2) {
                this.position = "before";
                f -= 10
            } else {
                this.position = "after";
                f = f + b
            }
            this.dropLine.setStyle({display: "block",top: g.top + "px",left: f + "px",height: c.getLayout().get("padding-box-height") + "px"})
        }
        d.stop()
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
            this.dropLine.setStyle({left: this.panel.cumulativeOffset().left + "px"});
            this.panel.appendChild(this.dropLine)
        }
        this.status = "move";
        this.dropLine.show();
        this.moveHandler.hide();
        this.dragged = this.selected;
        this.dragged.addClassName("dragged");
        this.dragged.removeClassName("insertable");
        this.allocator.allocate();
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
                this.allocator.allocate();
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
var BookPublishing = Class.create({initialize: function(b, a) {
        this.controllerUrl = "/r/publishing";
        this.bookId = b;
        this.panel = $(a);
        this.panel.on("click", "a", this.click.bind(this))
    },click: function(b) {
        var a = b.findElement();
        if (a && a.hasClassName("link")) {
            if (a.hasClassName("update_publishing")) {
                this.update(a)
            } else {
                if (a.hasClassName("rebuild_file")) {
                    this.publishingId = this.getId(a);
                    this.openRebuildOverlay(b, "ALWAYS_PRESENT")
                } else {
                    if (a.hasClassName("change_to_present_time")) {
                        this.publishingId = this.getId(a);
                        this.openRebuildOverlay(b, "TIME_TAG")
                    } else {
                        if (a.readAttribute("href")) {
                            this.showTooltip(a)
                        }
                    }
                }
            }
            b.stop()
        }
    },update: function(b) {
        var a = this.controllerUrl + "/load/" + this.bookId;
        var c = this.getId(b);
        if (c) {
            a += "/" + c
        }
        executer.execute(a)
    },openRebuildOverlay: function(e, d) {
        var c = this.controllerUrl + "/get_rebuild_panel/" + this.publishingId;
        var h;
        if (d === "ALWAYS_PRESENT") {
            h = "label.rebuild_file"
        } else {
            if (d === "TIME_TAG") {
                h = "label.change_to_present_time"
            }
        }
        this.overlay = new Overlay(h, 380);
        this.overlay.addButton("rebuild", function() {
            this.rebuildFile(d)
        }.bind(this));
        var b = this.overlay.getContentPanel();
        var g = e.pointerX() + 50;
        var a = document.viewport.getScrollOffsets().top;
        var f = e.pointerY() - a;
        if (a < 400) {
            f = f - 350
        }
        this.overlay.show(g, f);
        new Ajax.Updater(b, c, {onComplete: function(i) {
                this.form = $("rebuild_form");
                this.formUI = new FormUI("rebuild_form");
                this.formUI.addTextValidator({element: "pdf_theme",required: true});
                this.formUI.addTextValidator({element: "pdf_page_layout",required: true});
                this.formUI.addTextValidator({element: "epub_theme",required: true});
                if (d === "TIME_TAG") {
                    this.formUI.addTextValidator({element: "tag_name",required: true,max: 100})
                }
            }.bind(this)})
    },rebuildFile: function(a) {
        if (!this.formUI.validateBeforeAction()) {
            return
        }
        if (a === "TIME_TAG") {
            new Ajax.Request("/r/uuid", {onComplete: function(b) {
                    var c = b.responseText;
                    this.buildForPresentTime(this.bookId, this.publishingId, c, this.form, a)
                }.bind(this)})
        } else {
            this.buildForAlwaysPresent(this.bookId, this.publishingId, this.form, a)
        }
    },buildForPresentTime: function(e, f, a, d, c) {
        var b = new BookPublishingBuilder(e, a, d, c);
        b.build({beforeBuild: function() {
                var g = "/r/publishing/change_to_present_time/" + f + "/" + a;
                new Ajax.Request(g, {parameters: d.serialize()})
            }.bind(this),callback: function() {
                this.rebuildComplete()
            }.bind(this),progressTarget: this.form.down()})
    },buildForAlwaysPresent: function(e, d, c, b) {
        var a = new BookPublishingBuilder(e, d, c, b);
        a.build({callback: function() {
                new Ajax.Request("/r/publishing/remove_web_page_cache/" + d);
                this.rebuildComplete()
            }.bind(this),progressTarget: this.form.down()})
    },rebuildComplete: function() {
        this.overlay.close();
        executer.execute("/r/book/view/" + this.bookId)
    },getId: function(a) {
        return a.up(".buttons").next().readAttribute("id")
    },showTooltip: function(a) {
        if (this.tooltip) {
            this.tooltip.hide()
        } else {
            this.tooltip = new AppTooltip()
        }
        if (a.hasClassName("web_viewer")) {
            this.tooltip.show(a)
        } else {
            if (a.hasClassName("pdf") || a.hasClassName("epub")) {
                this.tooltip.show(a, "label.download")
            }
        }
    }});
var BookPublishingBuilder = Class.create({initialize: function(d, c, b, a) {
        this.bookId = d;
        this.publishingId = c;
        this.form = b;
        this.type = a;
        this.form.on("click", "ul.build_result", this.click.bind(this))
    },click: function(d) {
        var c = d.findElement("a");
        if (c) {
            var b = c.getAttribute("data-group");
            var a = c.getAttribute("data-element");
            window.open("/r/editor/edit/" + b + "#" + a);
            d.stop()
        }
    },build: function(a) {
        var b = $("button_rebuild");
        if (b) {
            b.disabled = true
        }
        if (a.beforeBuild) {
            a.beforeBuild()
        }
        this.callback = a.callback;
        this.progressTarget = a.progressTarget;
        this.buildPdf()
    },buildPdf: function() {
        var a = "/r/pdf/build_for_publishing/" + this.bookId + "/" + this.publishingId + "/" + this.type;
        new Ajax.Request(a, {parameters: this.form.serialize()});
        this.monitorPdf()
    },monitorPdf: function() {
        var b = "/r/pdf/monitor/" + this.publishingId;
        var c = 0;
        var a = new ProgressBar(this.progressTarget);
        a.start({name: I18n.get("label.pdf_building"),run: function() {
                new Ajax.Request(b, {onComplete: function(d) {
                        var e = d.headerJSON;
                        if (e.code === "error") {
                            $$(".progress_panel")[0].insert({after: d.responseText});
                            a.errorHappend()
                        }
                        c = e.rate
                    }});
                return {rate: c}
            },done: function(d) {
                if (!d) {
                    this.buildEpub()
                }
            }.bind(this),align: "left"})
    },buildEpub: function() {
        var a = "/r/epub/build_for_publishing/" + this.bookId + "/" + this.publishingId + "/" + this.type;
        new Ajax.Request(a, {parameters: this.form.serialize()});
        this.monitorEpub()
    },monitorEpub: function() {
        var a = "/r/epub/monitor/" + this.publishingId;
        var b = 0;
        new ProgressBar(this.progressTarget).start({name: I18n.get("label.epub_building"),run: function() {
                new Ajax.Request(a, {onComplete: function(c) {
                        var d = c.headerJSON;
                        b = d.rate
                    }});
                return {rate: b}
            },done: this.callback,align: "left"})
    }});
var BookPublishingForm = Class.create({initialize: function(b, a, c) {
        this.bookId = b;
        this.publishingId = a;
        this.initialLink = c;
        this.defaultUrlPanel = $("default_url");
        this.customeUrlPanel = $("custom_url");
        this.documentLinkLabel = $("document_link_label");
        this.documentLink = $("document_link");
        this.customLink = $("custom_link");
        this.setUpForm()
    },setUpForm: function() {
        this.form = $("publishing_form");
        this.formUI = new FormUI("publishing_form");
        this.progressTarget = this.form.select(".buttons")[0].previous();
        this.form.on("click", "input[type=radio][name=is_public]", this.changeIsPublic.bind(this));
        this.form.on("change", "input[type=radio][name=publishing_type]", this.changeType.bind(this));
        this.form.on("click", "input[type=radio][name=url_type]", this.changeUrlType.bind(this));
        this.form.on("click", "input[value=ALL_USERS]", this.allUsersClicked.bind(this));
        this.changeIsPublic();
        this.changeUrlType();
        this.setUpValidation()
    },changeIsPublic: function(a) {
        var b = $RF(this.form, "is_public");
        if (b === "true") {
            this.showPublishingInfo()
        } else {
            this.hidePublishingInfo()
        }
    },showPublishingInfo: function() {
        BaseUtil.showElements("show_if_publishing");
        this.documentLinkLabel.addClassName("required");
        this.changeType()
    },hidePublishingInfo: function() {
        this.documentLinkLabel.removeClassName("required");
        BaseUtil.hideElements("show_if_publishing")
    },changeType: function() {
        var a = $RF(this.form, "publishing_type");
        if (a === "ALWAYS_PRESENT") {
            BaseUtil.hideElements("show_if_present_time");
            BaseUtil.hideElements("show_if_time_tag");
            BaseUtil.showElements("show_if_always_present")
        } else {
            if (a === "PRESENT_TIME") {
                BaseUtil.hideElements("show_if_time_tag");
                BaseUtil.hideElements("show_if_always_present");
                BaseUtil.showElements("show_if_present_time")
            } else {
                if (a === "TIME_TAG") {
                    BaseUtil.hideElements("show_if_present_time");
                    BaseUtil.hideElements("show_if_always_present");
                    BaseUtil.showElements("show_if_time_tag");
                    this.setUpTags()
                }
            }
        }
    },setUpTags: function() {
        var a = $RF(this.form, "tag_id");
        if (!a) {
            $RS(this.form, "tag_id", this.publishingId)
        }
    },changeUrlType: function(a) {
        var b = $RF(this.form, "url_type");
        if (b === "custom") {
            this.defaultUrlPanel.hide();
            this.customeUrlPanel.show()
        } else {
            this.defaultUrlPanel.show();
            this.customeUrlPanel.hide()
        }
    },allUsersClicked: function(c) {
        var a = c.findElement();
        var b = a.checked;
        a.up(2).select("input").each(function(d) {
            if (a !== d) {
                d.disabled = b
            }
        })
    },setUpValidation: function() {
        this.PDFThemeVaidator = new TextValidator("pdf_theme", {required: true});
        this.formUI.addValidatorSeperately(this.PDFThemeVaidator);
        this.PDFPageLayoutValidator = new TextValidator("pdf_page_layout", {required: true});
        this.formUI.addValidatorSeperately(this.PDFPageLayoutValidator);
        this.EPUBValidator = new TextValidator("epub_theme", {required: true});
        this.formUI.addValidatorSeperately(this.EPUBValidator);
        this.tagNameValidator = new TextValidator("tag_name", {required: true,max: 100});
        this.formUI.addValidatorSeperately(this.tagNameValidator);
        this.tagIdValidator = new RadioGroupValidator("tag_id_list", {form: this.form,name: "tag_id",required: true});
        this.formUI.addValidatorSeperately(this.tagIdValidator)
    },submit: function(a) {
        this.formUI.disableButtons();
        if (!this.validate()) {
            this.formUI.enableButtons();
            return
        }
        this.createWithDocumentLink(a)
    },validate: function() {
        var a = $RF(this.form, "publishing_type");
        var b = $RF(this.form, "is_public");
        if ((a === "ALWAYS_PRESENT" && b === "true") || a === "PRESENT_TIME") {
            if (this.formUI.validate(this.PDFThemeVaidator)) {
                return false
            } else {
                if (this.formUI.validate(this.PDFPageLayoutValidator)) {
                    return false
                } else {
                    if (this.formUI.validate(this.EPUBValidator)) {
                        return false
                    }
                }
            }
        }
        if (a === "PRESENT_TIME") {
            if (this.formUI.validate(this.tagNameValidator)) {
                return false
            }
        }
        if (a === "TIME_TAG") {
            if (this.formUI.validate(this.tagIdValidator)) {
                return false
            }
        }
        return true
    },createWithDocumentLink: function(a) {
        var c = $RF(this.form, "url_type");
        var b;
        if (c === "custom") {
            b = this.customLink.getValue()
        } else {
            b = this.bookId
        }
        if (b) {
            if (b != this.initialLink) {
                new Ajax.Request("/r/publishing/is_unique", {parameters: {link: b},onComplete: function(e) {
                        var d = e.headerJSON;
                        if (d.msg === "ok") {
                            this.documentLink.setValue(b);
                            this.create(a)
                        } else {
                            this.writeLinkMessage(d.msg)
                        }
                    }.bind(this)})
            } else {
                this.documentLink.setValue(b);
                this.create(a)
            }
        } else {
            var c = $RF(this.form, "is_public");
            if (c === "true") {
                this.writeLinkMessage("message.field_is_required")
            } else {
                this.create(a)
            }
        }
    },create: function(a) {
        var b = $RF(this.form, "is_public");
        var c = $RF(this.form, "publishing_type");
        if (b === "true" && c !== "TIME_TAG") {
            new Ajax.Request("/r/uuid", {onComplete: function(e) {
                    var d = e.responseText;
                    this.buildFile(a, d, c)
                }.bind(this)})
        } else {
            if (c === "TIME_TAG") {
                a += ("/" + $RF(this.form, "tag_id"))
            }
            this.formUI.submit(a)
        }
    },buildFile: function(b, c, d) {
        if (d === "PRESENT_TIME") {
            d = "TIME_TAG"
        }
        var a = new BookPublishingBuilder(this.bookId, c, this.form, d);
        a.build({callback: function() {
                b += ("/" + c);
                this.formUI.submit(b)
            }.bind(this),progressTarget: this.progressTarget})
    },writeLinkMessage: function(a) {
        this.formUI.validatorUI.render(this.customLink, I18n.get(a));
        this.customLink.on("click", this.removeLinkMessage.bind(this));
        this.formUI.enableButtons();
        Progress.stop()
    },removeLinkMessage: function() {
        var a = this.customLink.next();
        if (a && a.hasClassName("invalid")) {
            a.remove();
            this.customLink.removeClassName("invalid")
        }
    }});
var DocResetRevision = Class.create({initialize: function(a) {
        this.panel = $(a);
        this.panel.on("click", "a", this.click.bind(this));
        this.controllerUrl = "/r/revision/"
    },click: function(b) {
        var a = b.findElement();
        if (a && !this.isTaskStarted) {
            if (a.hasClassName("reset_all_revision")) {
                this.disable();
                this.executeResetAll()
            }
        }
        b.stop()
    },executeResetAll: function() {
        new Ajax.Request("/r/uuid", {onComplete: this.resetAll.bind(this)})
    },resetAll: function(a) {
        var b = a.responseText;
        new Ajax.Request(this.controllerUrl + "reset_all/" + b);
        this.monitor(b, this.enable.bind(this))
    },monitor: function(c, d) {
        var a = this.controllerUrl + "monitor_progress/" + c;
        var b = 0;
        this.panel.select(".progress_panel").invoke("remove");
        var e = this.panel.down();
        new ProgressBar(e).start({run: function() {
                new Ajax.Request(a, {onComplete: function(f) {
                        var g = f.headerJSON;
                        b = g.rate
                    }});
                return {rate: b}
            },done: d})
    },enable: function() {
        this.isTaskStarted = false
    },disable: function() {
        this.isTaskStarted = true
    }});
var BookSearcher = Class.create({initialize: function(a) {
        this.bookList = a
    },search: function(b) {
        if (!$F("q_keyword")) {
            $("q_keyword").focus();
            return
        }
        var a = 1;
        if (b) {
            a = b.findElement("a").getAttribute("data-page")
        } else {
            this.hideOtherPanels()
        }
        new Ajax.Updater(this.getSearchPanel().down("#content"), "/r/book/search/" + a, {parameters: this.bookList.getParameter()});
        b && b.stop()
    },getSearchPanel: function() {
        if (!this.searchPanel) {
            this.searchPanel = new Element("div", {id: "search_panel"});
            this.searchPanel.update("<div><a class='back' href='#'>" + I18n.get("label.back") + '</a></div><div id="content"></div>');
            this.searchPanel.on("click", "a.back", this.back.bind(this));
            this.searchPanel.on("click", "#page_navigation a", this.search.bind(this));
            $("layout_inner_main").insert(this.searchPanel);
            this.loadContentCss()
        }
        return this.searchPanel
    },back: function(a) {
        var b = window.location.hash;
        window.location.hash = b === "#/r/book" ? "#/r/book/list" : "#/r/book";
        a.stop()
    },loadContentCss: function() {
        var a = document.getElementsByTagName("link");
        if (a) {
            var c = a.length;
            if (c && a[c - 1].href.endsWith("/r/book/get_css")) {
                return
            }
        }
        var b = document.createElement("link");
        b.rel = "stylesheet";
        b.type = "text/css";
        b.href = "/r/book/get_css";
        document.getElementsByTagName("head")[0].appendChild(b)
    },hideOtherPanels: function() {
        var a = $("dashboard_toggle_panel");
        if (a) {
            a.hide()
        }
        [$("project_list_panel"), $("book_label_panel"), $("book_list_panel")].invoke("hide")
    }});
var StaticFileUploader = Class.create({initialize: function(a) {
        this.form = $("static_upload_form");
        this.uploader = new Uploader("static", this.form, this.updateCompleted.bind(this));
        this.uploader.setType(a);
        $("static_file").on("change", this.upload.bind(this))
    },upload: function(a) {
        this.uploader.upload();
        a.stop()
    },updateCompleted: function() {
    }});
var BookTag = Class.create({initialize: function(b, a) {
        this.controllerUrl = "/r/tag";
        this.bookId = b;
        this.panel = $(a);
        this.panel.on("click", "a", this.click.bind(this))
    },click: function(c) {
        var b = c.findElement();
        if (b && b.hasClassName("link")) {
            if (b.hasClassName("create_tag")) {
                var a = this.controllerUrl + "/create/" + this.bookId;
                executer.execute(a)
            } else {
                if (b.hasClassName("view_details")) {
                    var a = this.controllerUrl + "/view_details/" + this.bookId;
                    executer.execute(a)
                } else {
                    if (b.hasClassName("update")) {
                        this.update(b)
                    } else {
                        if (b.hasClassName("copy_book_from_tag")) {
                            this.copyBook(b)
                        } else {
                            if (b.hasClassName("remove")) {
                                this.remove(b)
                            }
                        }
                    }
                }
            }
            c.stop()
        }
    },update: function(b) {
        var c = this.getId(b);
        var a = this.controllerUrl + "/update/" + c;
        executer.execute(a)
    },copyBook: function(c) {
        var g = this.getId(c);
        var e = $(g);
        var b = e.down();
        var f = b.next();
        var d = I18n.get("message.copy_book_from_tag_confirm") + "\n[" + b.innerHTML + " : " + f.innerHTML + "]";
        if (!confirm(d)) {
            return
        }
        var a = this.controllerUrl + "/copy_book/" + g;
        new Ajax.Request(a, {onComplete: function(i) {
                var h = i.headerJSON;
                if (h && h.result === "ok") {
                    executer.execute("/r/book/list")
                } else {
                    executer.update(i.responseText)
                }
            }.bind(this)})
    },remove: function(c) {
        var g = this.getId(c);
        var e = $(g);
        var b = e.down();
        var f = b.next();
        var d = I18n.get("message.publishing_remove_confirm") + "\n[" + b.innerHTML + " : " + f.innerHTML + "]";
        if (!confirm(d)) {
            return
        }
        var a = this.controllerUrl + "/remove/" + g;
        $("tag_list").remove();
        new Ajax.Updater(this.panel.down(".buttons"), a, {insertion: "after"})
    },getId: function(a) {
        return a.up("tr").readAttribute("id")
    }});
var BookTagDetails = Class.create({initialize: function(b, a) {
        this.controllerUrl = "/r/tag_details";
        this.bookId = b;
        this.panel = $(a);
        this.panel.on("click", "a", this.click.bind(this))
    },click: function(b) {
        var a = b.findElement();
        if (a && a.hasClassName("link")) {
            if (a.hasClassName("update")) {
                this.update(a)
            } else {
                if (a.hasClassName("remove")) {
                    this.remove(a)
                }
            }
            b.stop()
        }
    },update: function(b) {
        var c = this.getId(b);
        var a = this.controllerUrl + "/update/" + c;
        executer.execute(a)
    },remove: function(c) {
        var g = this.getId(c);
        var e = $(g);
        var b = e.down();
        var f = b.next();
        var d = I18n.get("message.publishing_remove_confirm") + "\n[" + b.innerHTML + " : " + f.innerHTML + "]";
        if (!confirm(d)) {
            return
        }
        var a = this.controllerUrl + "/remove/" + g;
        new Ajax.Request(a, {onSuccess: function() {
                e.remove()
            }})
    },getId: function(a) {
        return a.up("tr").readAttribute("id")
    }});
var BookTagForm = Class.create({initialize: function(b, a) {
        this.bookId = b;
        this.isCreate = a;
        this.form = $("tag_form");
        this.formUI = new FormUI("tag_form");
        this.documentLink = $("document_link");
        this.customLink = $("custom_link");
        if (this.customLink) {
            this.initialLink = this.customLink.getValue()
        }
        this.progressTarget = this.form.select(".buttons")[0].previous();
        this.setUpValidation()
    },setUpValidation: function() {
        this.formUI.addTextValidator({element: "name",required: true,max: 100});
        if (this.isCreate === "true") {
            this.formUI.addTextValidator({element: "pdf_theme",required: true});
            this.formUI.addTextValidator({element: "pdf_page_layout",required: true});
            this.formUI.addTextValidator({element: "epub_theme",required: true})
        }
    },submit: function(a) {
        this.formUI.disableButtons();
        if (!this.formUI.validateBeforeAction()) {
            this.formUI.enableButtons();
            return
        }
        var b;
        if (this.customLink) {
            b = this.customLink.getValue()
        }
        if (b && b != this.initialLink) {
            new Ajax.Request("/r/publishing/is_unique", {parameters: {link: b},onComplete: function(d) {
                    var c = d.headerJSON;
                    if (c.msg === "ok") {
                        this.documentLink.setValue(b);
                        this.create(a)
                    } else {
                        this.writeLinkMessage(c.msg)
                    }
                }.bind(this)})
        } else {
            if (this.documentLink) {
                this.documentLink.setValue(b)
            }
            this.create(a)
        }
    },create: function(a) {
        if (this.isCreate === "true") {
            new Ajax.Request("/r/uuid", {onComplete: function(b) {
                    var c = b.responseText;
                    this.buildFile(a, c)
                }.bind(this)})
        } else {
            this.formUI.submit(a)
        }
    },buildFile: function(b, c) {
        var a = new BookPublishingBuilder(this.bookId, c, this.form, "TIME_TAG");
        a.build({callback: function() {
                b = b + "/" + c;
                this.formUI.submit(b)
            }.bind(this),progressTarget: this.progressTarget})
    },writeLinkMessage: function(a) {
        this.formUI.validatorUI.render(this.customLink, I18n.get(a));
        this.customLink.on("click", this.removeLinkMessage.bind(this));
        this.formUI.enableButtons();
        Progress.stop()
    },removeLinkMessage: function() {
        var a = this.customLink.next();
        if (a && a.hasClassName("invalid")) {
            a.remove();
            this.customLink.removeClassName("invalid")
        }
    }});
var BorderDesigner = Class.create({initialize: function() {
        this.panel = $("style_border_design");
        if (this.panel) {
            this.box = this.panel.select(".box")[0];
            this.panel.on("click", "img", this.toggleBorder.bind(this));
            this.init()
        }
    },init: function() {
        this.panel.select("img").each(this.initButton.bind(this))
    },refresh: function() {
        this.panel.select("img").each(function(a) {
            if (a.src.include("_on.png")) {
                a.src = a.src.replace("_on.png", ".png")
            }
        });
        this.init()
    },initButton: function(c) {
        if (c.src.include("_on.png")) {
            c.src = c.src.replace("_on.png", ".png")
        }
        var e = c.className;
        var f = $F("style_border_" + e + "_style");
        if (f == "none" || f == "") {
            var d = {};
            d[("border-" + e).camelize()] = f;
            this.box.setStyle(d);
            return
        }
        $("border_style").value = f;
        $("border_width").value = $F("style_border_" + e + "_width");
        var b = $F("style_border_" + e + "_color");
        $("border_color").value = b;
        $("border_color").up().setStyle({backgroundColor: b});
        if ($("border_radius")) {
            var g = this.getRadiusKeyword(e);
            var a = $F("style_border_" + g + "_radius");
            if (a != "none" && a != "") {
                $("border_radius").value = a
            }
        }
        this.toggleBorder(null, c)
    },toggleBorder: function(e, a) {
        a = a || e.findElement();
        var c = a.className;
        var g = this.getRadiusKeyword(c);
        var f = this.toggleButton(a) ? this.getBorderMaxWidth() + " " + $F("border_style") + " " + $F("border_color") : "none";
        if (f === "none") {
            $("style_border_" + c + "_style").value = "none"
        } else {
            $("style_border_" + c + "_color").value = $F("border_color");
            $("style_border_" + c + "_style").value = $F("border_style");
            $("style_border_" + c + "_width").value = $F("border_width");
            if ($("border_radius")) {
                $("style_border_" + g + "_radius").value = $F("border_radius")
            }
        }
        var b = {};
        b[("border-" + c).camelize()] = f;
        this.box.setStyle(b);
        b = {};
        var d = this.box.getLayout();
        b.height = (81 - this.getBorderWidth("Top") - this.getBorderWidth("Bottom")) + "px";
        b.width = (93 - this.getBorderWidth("Right") - this.getBorderWidth("Left")) + "px";
        b.visibility = "visible";
        this.box.setStyle(b);
        if (e) {
            e.stop()
        }
    },getBorderMaxWidth: function() {
        var a = $F("border_width");
        if (Number(a.gsub(/\D/, "")) > 20) {
            return "25pt"
        } else {
            return a
        }
    },getBorderWidth: function(c) {
        var b = this.box.getStyle("border" + c + "Width");
        var a = Number(this.box.getStyle("border" + c + "Width").gsub(/\D/, ""));
        if (b.endsWith("pt")) {
            a = a * 96 / 72
        }
        return a
    },toggleButton: function(a) {
        if (a.src.include("_on.png")) {
            a.src = a.src.replace("_on.png", ".png");
            return false
        } else {
            a.src = a.src.replace(".png", "_on.png");
            return true
        }
    },getRadiusKeyword: function(a) {
        var b;
        if (a === "top") {
            b = "top_left"
        } else {
            if (a === "right") {
                b = "top_right"
            } else {
                if (a === "bottom") {
                    b = "bottom_right"
                } else {
                    if (a === "left") {
                        b = "bottom_left"
                    }
                }
            }
        }
        return b
    }});
var ThemeControl = Class.create({initialize: function(b, a) {
        this.id = b;
        Picker.pdf = a;
        this.form = $("theme_style_form");
        this.previewPanel = $("theme_preview").down().next();
        this.listMenu = new ListMenu("theme_item_list", this.openMenu.bind(this));
        this.saveButton = $("button_save_now");
        this.saveButton.on("click", this.save.bind(this));
        this.saveButton.disabled = true;
        this.cancelLink = $$(".cancel")[0];
        this.cancelLink.on("click", this.cancel.bind(this));
        this.optionForm = new ThemeOptionForm(this)
    },openMenu: function(a) {
        this.refreshed = true;
        if (!this.title) {
            this.title = new Element("strong");
            $("app_header").down().insert(this.title)
        }
        this.title.update(" — " + a.innerHTML);
        this.styleType = a.type;
        this.loadStyle()
    },loadStyle: function() {
        this.stopPreview();
        var a = "/r/theme/view_style/" + this.id + "/" + this.styleType;
        new Ajax.Updater(this.form.down(), a, {onComplete: this.startPreview.bind(this)})
    },startPreview: function() {
        this.formChanged();
        this.disableSaveButton();
        this.optionForm.start(this.styleType);
        this.observer = new Form.Observer(this.form, 0.3, this.formChanged.bind(this))
    },stopPreview: function() {
        if (this.observer) {
            this.observer.stop();
            delete this.observer
        }
        this.optionForm && this.optionForm.stop()
    },formChanged: function(b, c) {
        if (this.refreshed) {
            this.refreshed = false
        } else {
            this.enableSaveButton()
        }
        b = b || this.form;
        c = c || b.serialize();
        var a = "/r/theme/preview/" + this.id + "/" + this.listMenu.getSelected().type;
        new Ajax.Updater(this.previewPanel, a, {parameters: c,onComplete: function(d) {
                if (this.styleType === "footnote" && Prototype.Browser.IE && !Picker.pdf) {
                    $("theme_preview").down().next().hide();
                    setTimeout("$('theme_preview').down().next().show();", 100)
                }
            }.bind(this)})
    },save: function(b) {
        this.disableSaveButton();
        var a = "/r/theme/update_style/" + this.id + "/" + this.listMenu.getSelected().type;
        new Ajax.Request(a, {parameters: this.form.serialize()});
        b.stop()
    },cancel: function(a) {
        if (confirm(I18n.get("label.cancel_of_change"))) {
            this.disableSaveButton();
            this.loadStyle()
        }
        a.stop()
    },enableSaveButton: function() {
        this.saveButton.disabled = false;
        this.saveButton.next().show()
    },disableSaveButton: function() {
        this.saveButton.disabled = true;
        this.saveButton.next().hide()
    },openImageOverlay: function(a) {
        if (!this.imagePanel) {
            this.imagePanel = new ImagePanel(function(b) {
                $("style_background_image").value = b;
                var c = b.replace("url(", "").replace(")", "");
                $("background_image_preview").update("<img src='" + c + "'/>")
            })
        }
        this.imagePanel.show()
    }});
var ThemeCssFormUI = Class.create({initialize: function(a) {
        this.id = a;
        this.saveButton = $("button_save");
        this.saveButton.on("click", this.save.bind(this));
        $("theme_form").on("submit", this.save.bind(this));
        $("theme_css").on("keydown", this.enableButton.bind(this))
    },save: function(a) {
        this.saveButton.disabled = true;
        new Ajax.Request("/r/theme/configure_css/" + this.id, {parameters: $("theme_form").serialize(),onSuccess: function() {
                this.saveButton.previous().show()
            }.bind(this)});
        a.stop()
    },enableButton: function(a) {
        this.saveButton.disabled = false;
        this.saveButton.previous().hide()
    }});
var ThemeFormUI = Class.create({initialize: function(a) {
        if (a != "null") {
            this.id = a;
            $("theme_type_group").select("input").each(function(b) {
                b.disabled = true
            })
        }
        this.themeForm = new FormUI("theme_form").addTextValidator({element: "theme_name",required: true,max: 100}).addTextValidator({element: "theme_description",max: 2000});
        $("button_save").on("click", this.save.bind(this));
        $("theme_form").on("submit", this.save.bind(this))
    },save: function(a) {
        var b = this.id ? "/r/theme/update/" + this.id : "/r/theme/create";
        this.themeForm.submit(b);
        a.stop()
    }});
var ThemeOptionForm = Class.create({initialize: function(a) {
        this.themeControl = a;
        this.form = $("theme_option_form");
        this.form.down(".select_image").on("click", this.openImageOverlay.bind(this));
        this.form.down(".remove_image").on("click", this.removeImage.bind(this));
        this.tab = new Tab("option_tab", "font_tab");
        this.unsupportedStyleTypes = $H();
        this.unsupportedStyleTypes.set("general", 1);
        this.unsupportedStyleTypes.set("space", 1);
        this.unsupportedStyleTypes.set("blank_page", 1);
        this.unsupportedStyleTypes.set("horizontal_line", 1);
        this.unsupportedStyleTypes.set("clear_float", 1);
        this.unsupportedStyleTypes.set("strong", 1);
        this.unsupportedStyleTypes.set("emphasis", 1);
        this.unsupportedStyleTypes.set("small", 1);
        this.unsupportedStyleTypes.set("inline_code", 1);
        this.unsupportedStyleTypes.set("keyboard", 1);
        this.unsupportedStyleTypes.set("subscript", 1);
        this.unsupportedStyleTypes.set("superscript", 1);
        this.unsupportedStyleTypes.set("delete", 1);
        this.unsupportedStyleTypes.set("insert", 1);
        this.unsupportedStyleTypes.set("link", 1);
        this.type1 = $H();
        this.type1.set("normal", 1);
        this.type1.set("headline", 1);
        this.type1.set("ordered_list", 1);
        this.type1.set("unordered_list", 1);
        this.type1.set("definition_list", 1);
        this.type1.set("definition_list_term", 1);
        this.type1.set("definition_list_description", 1);
        this.type1.set("callout_list", 1);
        this.type1.set("callout_list1", 1);
        this.type1.set("step1", 1);
        this.type1.set("toc_front_matter", 1);
        this.type1.set("toc_part", 1);
        this.type1.set("toc_chapter", 1);
        this.type1.set("toc_heading1", 1);
        this.type1.set("toc_heading2", 1);
        this.type1.set("toc_heading3", 1);
        this.type1.set("toc_heading4", 1);
        this.type1.set("toc_heading5", 1);
        this.type1.set("toc_appendix", 1);
        this.type1.set("toc_back_matter", 1);
        this.type1.set("index", 1);
        this.type1.set("index_group", 1);
        this.type1.set("index_entry", 1);
        this.type1.set("index_subentry", 1);
        this.type1.set("footnote_item", 1);
        this.type2 = $H();
        this.type2.set("code", 1);
        this.type2.set("command", 1);
        this.type2.set("pre", 1);
        this.type2.set("blockquote", 1);
        this.type2.set("epigraph", 1);
        this.type2.set("note", 1);
        this.type2.set("tip", 1);
        this.type2.set("important", 1);
        this.type2.set("warning", 1);
        this.type2.set("caution", 1);
        this.type2.set("table", 1);
        this.type2.set("table_header", 1);
        this.type2.set("table_header_cell", 1);
        this.type2.set("table_row", 1);
        this.type2.set("table_cell", 1);
        this.type3 = $H();
        this.type3.set("chapter_title", 1);
        this.type3.set("ordered_list1", 1);
        this.type3.set("ordered_list2", 1);
        this.type3.set("ordered_list3", 1);
        this.type3.set("unordered_list1", 1);
        this.type3.set("unordered_list2", 1);
        this.type3.set("unordered_list3", 1);
        this.type3.set("image_caption", 1);
        this.type3.set("table_caption", 1);
        this.type3.set("code_caption", 1);
        this.type4 = $H();
        this.type4.set("table", 1);
        this.type5 = $H();
        this.type5.set("heading1", 1);
        this.type5.set("heading2", 1);
        this.type5.set("heading3", 1);
        this.type5.set("heading4", 1);
        this.type5.set("heading5", 1)
    },selectFirstTab: function(a) {
        var b = $("substyle_menu");
        if (b) {
            b.on("click", "li", this.selectSubstyle.bind(this))
        }
        $("paragraph_tab_panel").select(".section_indent").each(function(c) {
            c.hide()
        });
        if (a === "heading") {
            a = "heading1";
            $("paragraph_tab_panel").select(".section_indent").each(function(c) {
                c.show()
            })
        } else {
            if (a === "ordered_list") {
                a = "ordered_list1"
            } else {
                if (a === "unordered_list") {
                    a = "unordered_list1"
                } else {
                    if (a === "definition_list" || a.endsWith("_dl")) {
                        a = a + "_term"
                    } else {
                        if (a === "callout_list") {
                            a = "callout_list1"
                        } else {
                            if (a === "toc") {
                                a = "toc_front_matter"
                            } else {
                                if (a === "index") {
                                    a = "index_group"
                                } else {
                                    if (a === "footnote") {
                                        a = "footnote_item"
                                    } else {
                                        if (a === "image") {
                                            a = "image_caption"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (b) {
            b.down("." + a).addClassName("selected")
        }
        return a
    },isUnsupportedType: function(a) {
        return this.unsupportedStyleTypes.get(a) || a.endsWith("_span")
    },isType1: function(a) {
        return this.type1.get(a) || a.endsWith("_p") || a.endsWith("_term")
    },isType2: function(a) {
        return this.type2.get(a) || a.endsWith("_pre") || a.endsWith("_div")
    },isType3: function(a) {
        return this.type3.get(a)
    },isType4: function(a) {
        return this.type4.get(a)
    },isType5: function(a) {
        return this.type5.get(a)
    },start: function(c) {
        if (this.isUnsupportedType(c)) {
            return
        }
        this.styleType = this.selectFirstTab(c);
        if (this.isType1(this.styleType)) {
            this.tab.hide("border_tab, background_tab, numbering_tab")
        } else {
            if (this.isType2(this.styleType)) {
                this.tab.hide("numbering_tab")
            } else {
                if (this.isType3(this.styleType)) {
                    this.tab.hide("border_tab, background_tab")
                } else {
                    if (this.isType4(this.styleType)) {
                        this.tab.hide("background_tab, numbering_tab")
                    } else {
                        if (this.isType5(this.styleType)) {
                            this.tab.hide()
                        }
                    }
                }
            }
        }
        var a = this.tab.getCurrent();
        if (!a || !a.visible()) {
            a = $("font_tab")
        }
        this.tab.selectMenu(a);
        this.bindForm();
        this.borderDesigner = new BorderDesigner();
        this.observer = new Form.Observer(this.form, 0.3, this.formChanged.bind(this));
        if (c === "ordered_list1" || c === "unordered_list1") {
            $("numbering_tab_panel").select("dt").each(function(e, d) {
                if (d !== 1) {
                    e.hide()
                }
            });
            $("numbering_tab_panel").select("dd").each(function(e, d) {
                if (d !== 1) {
                    e.hide()
                }
            });
            $("numbering_tab_font_panel").hide()
        } else {
            $("numbering_tab_panel").select("dt, dd").invoke("show");
            $("numbering_tab_font_panel").show()
        }
        for (var b = 0; b < 11; b++) {
            $("style_list_style_type").options[b].disabled = false
        }
        if (c === "ordered_list1") {
            for (var b = 8; b < 11; b++) {
                $("style_list_style_type").options[b].disabled = true
            }
        } else {
            if (c === "unordered_list1") {
                for (var b = 1; b < 8; b++) {
                    $("style_list_style_type").options[b].disabled = true
                }
            }
        }
        this.form.show()
    },stop: function() {
        if (this.observer) {
            this.observer.stop();
            delete this.observer
        }
        if (this.form) {
            this.form.reset();
            this.form.hide()
        }
    },selectSubstyle: function(d) {
        $("substyle_menu").select("li.selected").each(function(e) {
            e.removeClassName("selected")
        });
        var b = d.findElement();
        b.addClassName("selected");
        var c = $w(b.className)[0];
        if (this.isType1(c)) {
            this.tab.hide("border_tab, background_tab, numbering_tab")
        } else {
            if (this.isType2(c)) {
                this.tab.hide("numbering_tab")
            } else {
                if (this.isType3(c)) {
                    this.tab.hide("border_tab, background_tab")
                } else {
                    if (this.isType4(c)) {
                        this.tab.hide("background_tab, numbering_tab")
                    } else {
                        if (this.isType5(c)) {
                            this.tab.hide()
                        }
                    }
                }
            }
        }
        this.styleType = c;
        this.themeControl.refreshed = true;
        this.form.reset();
        this.bindForm();
        this.borderDesigner.refresh();
        var a = this.tab.getCurrent();
        if (!a || !a.visible()) {
            a = $("font_tab")
        }
        this.tab.selectMenu(a);
        d.stop()
    },formChanged: function(a, b) {
        $("substyle_" + this.styleType).value = this.form.serialize()
    },bindForm: function() {
        this.form.select(".color_picker_value").each(function(c) {
            c.down().setStyle({backgroundColor: "inherit"})
        });
        this.form.select("input, select").each(function(d) {
            var c = d.getAttribute("type");
            if (c === "radio" || c === "checkbox" || d.checked) {
                d.checked = false
            } else {
                d.value = ""
            }
        });
        var b = $("substyle_" + this.styleType).value.toQueryParams();
        var a = this.form;
        Object.keys(b).each(function(h) {
            if ($(h)) {
                var g = $(h).getAttribute("type");
                if (g === "radio" || g === "checkbox") {
                    $(h).checked = "true" === b[h]
                } else {
                    $(h).value = b[h];
                    if (h.endsWith("_color")) {
                        var c = $(h).up();
                        if (c.tagName === "SPAN") {
                            c.setStyle({backgroundColor: b[h]})
                        }
                    }
                }
            } else {
                var f = a[h];
                if (f) {
                    if (f.length) {
                        for (var e = 0; e < f.length; e++) {
                            if (b[h].toString().indexOf(f[e].value) != -1) {
                                f[e].checked = true
                            }
                        }
                    } else {
                        f.value = b[h]
                    }
                } else {
                    if (h === "style_background_position") {
                        var d = b[h].split(" ");
                        $("style_background_position_x").value = d[0];
                        $("style_background_position_y").value = d[1]
                    }
                }
            }
        });
        ["style_letter_spacing", "style_word_spacing", "style_margin_top", "style_margin_bottom", "style_text_indent", "style_margin_left", "style_margin_right", "style_padding_top", "style_padding_right", "style_padding_bottom", "style_padding_left", "style_background_position_x", "style_background_position_y"].each(function(c) {
            if ($F(c) === "") {
                $(c).value = 0
            }
        });
        ["style_text_align", "style_line_break"].each(function(c) {
            if ($(c) && !$F(c)) {
                $(c).value = "inherit"
            }
        })
    },openImageOverlay: function(a) {
        if (!this.imagePanel) {
            this.imagePanel = new ImagePanel(function(b) {
                $("style_background_image").value = b
            })
        }
        this.imagePanel.show();
        a.stop()
    },removeImage: function(a) {
        $("style_background_image").value = "";
        a.stop()
    }});
var ThemeUI = Class.create({initialize: function() {
        $$("a.create_theme")[0].on("click", this.create.bind(this));
        $$("a.user_style_type")[0].on("click", this.manageUserStyleType.bind(this));
        this.initTableUI()
    },initTableUI: function() {
        new TableUI("theme_table", {click: this.clickTable.bind(this),url: "/r/theme/sort"})
    },clickTable: function(b) {
        var a = b.findElement();
        if (a) {
            var c = a.up(1);
            var d = c.getAttribute("id");
            if (a.hasClassName("view")) {
                executer.execute("/r/theme/view/" + d);
                Progress.showLoadingMessage()
            } else {
                if (a.hasClassName("copy")) {
                    new Ajax.Updater("layout_inner_main", "/r/theme/copy/" + d)
                } else {
                    if (a.hasClassName("remove") && $confirmRemove(c)) {
                        new Ajax.Updater("layout_inner_main", "/r/theme/remove/" + d)
                    }
                }
            }
        }
        b.stop()
    },create: function(a) {
        executer.execute("/r/theme/create");
        a.stop()
    },manageUserStyleType: function(a) {
        executer.execute("/r/user_style_type");
        a.stop()
    }});
var UserStyleType = Class.create({initialize: function() {
        $$("a.create_user_style_type")[0].on("click", this.showForm.bind(this));
        this.panel = $("custom_style_type_panel");
        this.panel.on("click", "span", this.changeName.bind(this));
        this.panel.on("click", "a.remove", this.remove.bind(this));
        this.panel.select("fieldset").each(function(a) {
            new ListSorter(a, this.sort.bind(this))
        }.bind(this))
    },create: function(a) {
        new Ajax.Request("/r/user_style_type/validate_key/" + $F("key") + "/" + $F("type"), {onComplete: function(b) {
                if (b.headerJSON) {
                    this.formUI.validatorUI.render($("key"), decodeURIComponent(b.headerJSON.code).gsub("+", " "))
                } else {
                    this.formUI.submit("/r/user_style_type/create")
                }
            }.bind(this)});
        a.stop()
    },sort: function(a, b) {
        var c = $A();
        a.select("li").each(function(d) {
            c.push(d.getAttribute("id"))
        });
        new Ajax.Request("/r/user_style_type/sort", {parameters: {id: c}})
    },changeName: function(a) {
        this.name = this.name || new UserStyleTypeName();
        if (!this.name.visible()) {
            this.name.show(a.findElement())
        }
        a.stop()
    },remove: function(c) {
        if (I18n.confirm("label.confirm_remove")) {
            var b = c.findElement("li");
            var a = b.getAttribute("id");
            Progress.start(b);
            new Ajax.Request("/r/user_style_type/remove/" + a, {onSuccess: function(d) {
                    if (!b.next() && !b.previous()) {
                        b = b.up("fieldset")
                    }
                    b.addClassName("fade_out");
                    b.fadeOut(function() {
                        b.remove();
                        Progress.stop()
                    })
                }})
        }
        c.stop()
    },showForm: function(a) {
        if (!this.form) {
            this.form = $("user_style_type_form");
            this.form.on("click", "button", this.create.bind(this));
            this.form.on("click", "a.cancel", this.hideForm.bind(this));
            this.formUI = new FormUI(this.form).addTextValidator({element: "key",required: true,max: 20}).addTextValidator({element: "name",required: true,max: 100})
        }
        this.form.show();
        this.form.focusFirstElement();
        a.stop()
    },hideForm: function(a) {
        this.form.hide();
        a.stop()
    }});
var UserStyleTypeName = Class.create({initialize: function() {
        this.form = $("change_name_form");
        this.form.on("submit", this.save.bind(this));
        this.form.on("click", "a.clear", this.close.bind(this));
        this.form.on("click", "a.save", this.save.bind(this));
        this.name = this.form.down("input")
    },visible: function() {
        return this.form.visible()
    },show: function(a) {
        this.element = a;
        a.setStyle({visibility: "hidden"});
        this.form.setStyle({display: "block",top: (a.cumulativeOffset().top - 4) + "px"});
        this.name.value = a.getAttribute("title");
        this.name.focus()
    },save: function(c) {
        Progress.start(this.form);
        var d = this.element.up().getAttribute("id");
        var a = $F(this.name);
        this.element.innerHTML = a;
        this.element.setAttribute("title", a);
        var b = this.element.up();
        new Ajax.Request("/r/user_style_type/change_name/" + d, {parameters: {name: a},onSuccess: function(e) {
                this.element.innerHTML = e.responseText;
                this.close();
                b.addClassName("fade_out");
                b.fadeOut(function() {
                    Progress.stop();
                    b.removeClassName("fade_out")
                })
            }.bind(this)});
        c.stop()
    },close: function(a) {
        this.element.setStyle({visibility: "visible"});
        this.form.hide();
        a && a.stop()
    }});
var BookTodo = Class.create({initialize: function(a) {
        this.bookId = a;
        $("todo_panel").on("mouseover", ".item", this.showTool.bind(this));
        $("tool_handle").on("click", this.open.bind(this))
    },showTool: function(c) {
        var a = c.findElement(".item");
        this.configureElement(a);
        var b = a.getWidth() - $("tool_handle").getWidth();
        var d = a.cumulativeOffset();
        $("tool_handle").setStyle({display: "block",left: (d.left + b) + "px",top: (d.top - 20) + "px"});
        c.stop()
    },configureElement: function(a) {
        this.elementId = a.getAttribute("id");
        this.chapterId = a.previous("h1").getAttribute("id")
    },open: function(a) {
        window.open("/r/editor/edit/" + this.chapterId + "#" + this.elementId)
    }});
var VisitStatisticsTool = Class.create({initialize: function(a) {
        new ui.view.DatePicker("start_date", this.configureDate.bind(this)).apply();
        new ui.view.DatePicker("end_date", this.configureDate.bind(this)).apply();
        $("button_view").on("click", this.loadStatistics.bind(this));
        $$(".list_selection_panel")[0].on("click", ".list_selection_panel li", this.documentSelected.bind(this));
        this.loadStatistics()
    },configureDate: function(c, b) {
        if (c.getAttribute("id") === "start_date") {
            var d = new Date(b.substring(0, 4), Number(b.substring(5, 7)) - 1, b.substring(8));
            b = $F("end_date");
            if (b) {
                var a = new Date(b.substring(0, 4), Number(b.substring(5, 7)) - 1, b.substring(8));
                if (a < d) {
                    d.setDate(d.getDate() + 7);
                    this.setDate($("end_date"), d)
                } else {
                    d.setDate(d.getDate() + 7);
                    if (d < a) {
                        this.setDate($("end_date"), d)
                    }
                }
            } else {
                d.setDate(d.getDate() + 7);
                this.setDate($("end_date"), d)
            }
        } else {
            var a = new Date(b.substring(0, 4), Number(b.substring(5, 7)) - 1, b.substring(8));
            b = $F("start_date");
            if (b) {
                var d = new Date(b.substring(0, 4), Number(b.substring(5, 7)) - 1, b.substring(8));
                if (a < d) {
                    a.setDate(a.getDate() - 7);
                    this.setDate($("start_date"), a)
                } else {
                    a.setDate(a.getDate() - 7);
                    if (d < a) {
                        this.setDate($("start_date"), a)
                    }
                }
            } else {
                a.setDate(a.getDate() - 7);
                this.setDate($("start_date"), a)
            }
        }
    },setDate: function(e, b) {
        var f = b.getDate();
        var a = b.getMonth() + 1;
        var g = b.getFullYear();
        var c = g + "-";
        if (a < 10) {
            c += "0"
        }
        c += a + "-";
        if (f < 10) {
            c += "0"
        }
        c += f;
        e.value = c
    },gridFilter: function(a) {
        return (!this.date || a.date === this.date) && (!this.document || a.document_id === this.document)
    },barClicked: function(a) {
        this.date = a;
        this.grid.filter(this.gridFilter.bind(this));
        new Ajax.Request("/r/visit_statistics/get_documents/" + (this.date || ""), {onComplete: function(b) {
                this.refreshDocumentList(b.responseJSON)
            }.bind(this)})
    },documentSelected: function(c) {
        var a = c.findElement("li");
        if (a.hasClassName("selected")) {
            a.removeClassName("selected");
            delete this.document
        } else {
            var b = a.up().down(".selected");
            if (b) {
                b.removeClassName("selected")
            }
            a.addClassName("selected");
            this.document = a.getAttribute("data-id")
        }
        this.grid.filter(this.gridFilter.bind(this));
        new Ajax.Request("/r/visit_statistics/get_bar/" + (this.document || ""), {onComplete: function(d) {
                this.refreshBar(d.responseJSON)
            }.bind(this)});
        c.stop()
    },getBarChart: function() {
        if (!this.barChart) {
            this.barChart = new ui.svg.BarChart("visit_statistics_bar_chart", this.barClicked.bind(this))
        }
        return this.barChart
    },refreshBar: function(a) {
        this.barChart = this.getBarChart();
        this.barChart.clear();
        a.models.each(function(b) {
            this.barChart.add(b)
        }.bind(this));
        this.barChart.refresh(this.date)
    },refreshDocumentList: function(b) {
        var a = $H();
        b.documentModels.each(function(d) {
            a.set(d.id, d.value)
        });
        var c = $$(".list_selection_panel")[0].down();
        c.select("li").each(function(d) {
            d.down("span span").update(a.get(d.getAttribute("data-id")) || "0")
        })
    },loadStatistics: function() {
        delete this.date;
        delete this.document;
        Progress.showLoadingMessage();
        Progress.start("visit_user_grid");
        new Ajax.Request("/r/visit_statistics/get", {parameters: {start_date: $F("start_date"),end_date: $F("end_date"),bot_filter: $F("bot_filter")},onComplete: this.loaded.bind(this)})
    },loaded: function(a) {
        var c = a.responseJSON;
        this.refreshBar(c);
        var b = "";
        var d = new Template('<li data-id="#{id}"><label><span class="#{type}_type">#{label}<span>#{value}</span></span></label></li>');
        c.documentModels.each(function(f) {
            b += d.evaluate(f)
        }.bind(this));
        var e = $$(".list_selection_panel")[0].down();
        e.update(b);
        if (!this.grid) {
            this.grid = new ui.view.Grid("visit_user_grid", "<td>#{document}</td><td>#{chapter}</td><td>#{user}</td><td>#{uuid}</td><td>#{referrer}</td><td>#{userAgent}</td><td>#{time}</td>");
            this.grid.setSorter()
        }
        this.grid.setModel(c.userModels);
        Progress.stop()
    }});
var WebPageFormUI = Class.create({initialize: function(a) {
        this.id = a;
        this.webPageForm = new FormUI("web_page_form").addTextValidator({element: "web_page_name",required: true,max: 100}).addTextValidator({element: "web_page_locale",required: true});
        $("button_save").on("click", this.save.bind(this));
        $("web_page_form").on("submit", this.save.bind(this))
    },save: function(a) {
        var b = this.id ? "/r/web_page/update/" + this.id : "/r/web_page/create";
        this.webPageForm.submit(b);
        a.stop()
    }});
var WebPagePublishingFormUI = Class.create({initialize: function(c, b) {
        this.id = c;
        this.type = b;
        this.form = new FormUI("web_page_publishing_form");
        $("button_save").on("click", this.save.bind(this));
        $("web_page_publishing_form").on("submit", this.save.bind(this));
        $("web_page_publishing_form").on("click", "input[type=radio]", this.change.bind(this));
        this.change();
        var a = $("url");
        if (this.isPublished()) {
            a.focus()
        }
        a.on("keydown", function(d) {
            this.form.removeMessage(a)
        }.bind(this))
    },save: function(a) {
        a.stop();
        new FormUI("web_page_publishing_form").submit("/r/" + this.type + "/publish/" + this.id)
    },change: function(a) {
        $("url").disabled = !this.isPublished()
    },isPublished: function() {
        return $("web_page_publishing_form").down("input[type=radio]").checked
    }});
var WebPageUI = Class.create({initialize: function() {
        this.initTableUI()
    },initTableUI: function() {
        new TableUI("web_page_table", {click: this.clickTable.bind(this),url: "/r/web_page/sort"})
    },clickTable: function(b) {
        var a = b.findElement();
        if (a) {
            var c = a.up(1);
            var d = c.getAttribute("id");
            if (a.hasClassName("view")) {
                executer.execute("/r/web_page/view/" + d);
                Progress.showLoadingMessage()
            } else {
                if (a.hasClassName("open") || a.hasClassName("web_page")) {
                    window.open("/r/web_page/load/" + d)
                } else {
                    if (a.hasClassName("edit")) {
                        window.open("/r/web_page/edit/" + d)
                    } else {
                        if (a.hasClassName("remove") && $confirmRemove(c)) {
                            new Ajax.Updater("layout_inner_main", "/r/web_page/remove/" + d)
                        }
                    }
                }
            }
        }
        b.stop()
    }});
var BookWebViewerStyleBackgroundHandler = Class.create({initialize: function(a) {
        a.on("click", "a.select_image, a.select_logo", this.openImageOverlay.bind(this));
        a.on("click", "a.remove_image, a.remove_logo", this.removeImage.bind(this))
    },openImageOverlay: function(a) {
        this.target = a.findElement().next(1);
        if (!this.imagePanel) {
            this.imagePanel = new ImagePanel(this.setImage.bind(this))
        }
        this.imagePanel.show();
        a.stop()
    },setImage: function(a, b) {
        if (this.target.getAttribute("id") === "logo_id") {
            this.target.value = b.replace("/r/image/get/", "")
        } else {
            this.target.value = a
        }
    },removeImage: function(a) {
        a.findElement().next().setValue("");
        a.stop()
    },changeValue: function() {
    }});
var BookWebViewerStyleControl = Class.create({initialize: function(a) {
        this.id = a;
        this.form = $("item_form");
        this.form.setAttribute("target", "preview_iframe");
        new BookWebViewerStyleBackgroundHandler(this.form);
        this.saveButton = $("button_save_now");
        this.saveButton.on("click", this.save.bind(this));
        this.cancelLink = $$(".cancel")[0];
        this.cancelLink.on("click", this.cancel.bind(this));
        this.controllerUrl = "/r/web_viewer_style";
        this.listMenu = new ListMenu("web_viewer_style_item_list", this.openMenu.bind(this));
        $("preview_iframe").onload = function() {
            $("web_browser_title").innerHTML = this.contentWindow.document.title
        }
    },openMenu: function(a) {
        this.refreshed = true;
        this.form.removeClassName(this.type);
        this.type = a.type;
        this.form.addClassName(this.type);
        this.loadLayout()
    },loadLayout: function() {
        this.disableSaveButton();
        this.stopPreview();
        var a = this.controllerUrl + "/view_item/" + this.id + "/" + this.type;
        new Ajax.Updater($("item_inner_panel"), a, {onComplete: function() {
                this.changeExecuter();
                this.startPreview()
            }.bind(this)})
    },changeExecuter: function() {
        var a = this.controllerUrl + "/preview/" + this.id + "/" + this.type;
        this.form.setAttribute("action", a)
    },save: function() {
        this.disableSaveButton();
        var a = this.controllerUrl + "/update_item/" + this.id + "/" + this.type;
        new Ajax.Request(a, {parameters: this.form.serialize()})
    },cancel: function(a) {
        if (confirm(I18n.get("label.cancel_of_change"))) {
            this.loadLayout()
        }
        a.stop()
    },enableSaveButton: function() {
        this.saveButton.disabled = false;
        this.saveButton.next().show()
    },disableSaveButton: function() {
        this.saveButton.disabled = true;
        this.saveButton.next().hide()
    },startPreview: function() {
        this.observer = new Form.Observer(this.form, 2, this.formChanged.bind(this));
        this.preview()
    },stopPreview: function() {
        if (this.observer) {
            this.observer.stop();
            delete this.observer
        }
    },formChanged: function(a) {
        this.stopPreview();
        try {
            this.enableSaveButton()
        }finally {
            this.startPreview()
        }
    },preview: function() {
        this.form.submit()
    }});
var DocWebViewerStyleFormUI = Class.create({initialize: function(a) {
        this.controllerUrl = "/r/web_viewer_style";
        if (a != "null") {
            this.id = a
        }
        this.WebviewerStyleForm = new FormUI("web_viewer_style_form").addTextValidator({element: "web_viewer_style_name",required: true,max: 100}).addTextValidator({element: "web_viewer_style_description",max: 2000});
        $("button_save").on("click", this.save.bind(this));
        $("web_viewer_style_form").on("submit", this.save.bind(this));
        $("web_viewer_style_form").on("click", "input[type=radio]", this.changeType.bind(this))
    },save: function(a) {
        var b = this.id ? this.controllerUrl + "/update/" + this.id : this.controllerUrl + "/create";
        this.WebviewerStyleForm.submit(b);
        a.stop()
    },changeType: function(c) {
        var b = c.findElement();
        if (b.getAttribute("name") === "web_viewer_style[type]") {
            var a = b.up("dd");
            if (b.getValue() === "BOOK") {
                a.next("dt").show();
                a.next("dd").show()
            } else {
                a.next("dt").hide();
                a.next("dd").hide()
            }
        }
    }});
var DocWebViewerStyleUI = Class.create({initialize: function() {
        this.initTableUI()
    },initTableUI: function() {
        new TableUI("web_viewer_style_table", {click: this.clickTable.bind(this),url: "/r/web_viewer_style/sort"})
    },clickTable: function(b) {
        var a = b.findElement();
        if (a) {
            var c = a.up(1);
            var d = c.getAttribute("id");
            if (a.hasClassName("view")) {
                executer.execute("/r/web_viewer_style/view/" + d)
            } else {
                if (a.hasClassName("copy")) {
                    new Ajax.Updater("layout_inner_main", "/r/web_viewer_style/copy/" + d)
                } else {
                    if (a.hasClassName("remove") && $confirmRemove(c)) {
                        new Ajax.Updater("layout_inner_main", "/r/web_viewer_style/remove/" + d)
                    }
                }
            }
        }
        b.stop()
    }});
