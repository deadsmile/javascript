/*!
 * @description jsa 프레임웍
 * @version 0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.1
 */
(function (context, $, undefined) {
    "use strict";
    /* jshint expr: true, validthis: true */
    /* global jsa, alert, escape, unescape, Base64 */

    var $root = $(document.documentElement);

    $root.addClass('js').one('touchstart MSGestureStart', function () {
        $root.addClass('touch');
    });

    /**
     * @namespace
     * @name jsa
     * @description root namespace of jsa
     */
    var jsa = context.jsa || (context.jsa = {});

    var toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        doc = context.document,
        emptyFn = function () {};

    if (typeof Function.prototype.bind === 'undefined') {
        /**
         * 함수내의 컨텐스트를 지정
         * @param {Object} context 컨텍스트
         * @param {Mixed} ... 두번째 인자부터는 실제로 싱행될 함수로 전달된다.
         * @example
         * function Test(){
         *                alert(this.name);
         * }.bind({name: 'axl rose'});
         *
         * Test(); -> alert('axl rose');
         */
        Function.prototype.bind = function () {
            var __method = this,
                args = Array.prototype.slice.call(arguments),
                object = args.shift();

            return function () {
                // bind로 넘어오는 인자와 원본함수의 인자를 병합하여 넘겨줌. 
                var local_args = args.concat(Array.prototype.slice.call(arguments));
                if (this !== window) {
                    local_args.push(this);
                }
                return __method.apply(object, local_args);
            };
        };
    }

    /**
     * jQuery 객체
     * @class
     * @name $
     */

    /**
     * value값을 URI인코딩하여 반환
     * @function
     * @name $#encodeURI
     * @return {String} 인코딩된 문자열
     */
    $.fn.encodeURI = function (value) {
        if (arguments.length === 0) {
            return encodeURIComponent($.trim(this.val()));
        } else {
            return this.val(encodeURIComponent(value));
        }
    };

    /**
     * value값의 앞뒤 스페이스문자 또는 old ie인경우에 placeholder를 제거하여 실제 값만 반환
     * @function
     * @name $#trimVal
     * @return {String} 문자열
     */
    $.fn.trimVal = (function () {
        var supportPlaceholder = ('placeholder' in document.createElement('input'));

        return supportPlaceholder ? function (value) {
            if (arguments.length === 0) {
                return $.trim(this.val());
            } else {
                return this.val($.trim(value));
            }
        } : function (value) {
            if (arguments.length === 0) {
                if (this.val() === this.attr('placeholder')) {
                    return '';
                }
                return $.trim(this.val());
            } else {
                value = $.trim(value) || this.attr('placeholder');
                return this.val(value);
            }
        };
    })();

    /**
     * 체크여부를 지정할 때, changed 이벤트를 발생시킨다.(연결된 label에 on클래스를 토글링하고자 할 때 사용)
     * @function
     * @name $#checked
     * @param {Boolean} checked 체크여부
     * @fires $#changed
     * @example
     * // 먼저 changed 이벤트 바인딩
     * $('input:checkbox').on('changed', function(e, isChecked){ $(this).parent()[isChecked?'addClass':'removeClass']('on'); });
     * ..
     * // checked 값을 변경
     * $('input:checkbox').checked(true); // 해당체크박스의 부모에 on클래스가 추가된다.
     */
    $.fn.checked = function (checked) {
        return this.each(function () {
            if (this.type !== 'checkbox' && this.type !== 'radio') {
                return;
            }
            /**
             * @event $#changed
             * @type {object}
             * @peoperty {boolean} checked - 체크 여부
             */
            var $this = $(this).prop('checked', checked).trigger('changed', [checked]);
        });
    };

    /**
     * 클래스 치환
     * @function
     * @name $#replaceClass
     * @param {String} old 대상클래스
     * @param {String} newCls 치환클래스
     */
    $.fn.replaceClass = function (old, newCls) {
        return this.each(function () {
            $(this).removeClass(old).addClass(newCls);
        });
    };

    /**
     * 레이어 표시 담당:
     * - 단순히 show를 하는게 아니라, 레이어가 표시되기전에 beforeshow이벤트를, 표시된 후에 show이벤트를 발생시켜준다.
     * - 레이어를 띄운 버튼을 보관한다. 닫을때, 버튼에 어떠한 액션을 취하고자 할 때 유용
     * @function
     * @name $#showLayer
     * @param {Element|jQuery} options.button (Optional) 버튼
     * @param {Function} options.onShow (Optional) 표시될 때 실행될 함수
     */
    $.fn.showLayer = function (options) {
        options = $.extend({
            onShow: jsa.emptyFn,
            opener: null
        }, options);

        return this.each(function () {
            var $this = $(this),
                evt;
            if (options.opener) {
                $this.data('opener', options.opener);
                $(options.opener).attr({
                    'aria-pressed': 'true',
                    'aria-expand': 'true'
                });
            }

            $this.trigger(evt = $.Event('beforeshow'));
            if (evt.isDefaultPrevented()) {
                return;
            }

            // 표시될 때 d_open 클래스 추가
            $this.addClass('d_open').show().trigger('show');
            options.onShow.call($this[0]);
        });
    };

    /**
     * 레이어 숨김 담당:
     * - 단순히 hide를 하는게 아니라, 숨겨진 후에 hide이벤트를 발생시켜준다.
     * @function
     * @name $#hideLayer
     * @param {Boolean} options.focusOpener (Optional) 숨겨진 후에 버튼에 포커스를 줄것인지 여부
     * @param {Function} options.onHide (Optional) 숨겨진 후에 실행될 함수
     */
    $.fn.hideLayer = function (options) {
        options = $.extend({
            onHide: jsa.emptyFn,
            focusOpener: false
        }, options);

        return this.each(function () {
            var $this = $(this);
            $this.removeClass('d_open').hide().trigger('hide');
            options.onHide.call($this[0]);

            // 숨겨진 후에 열었던 원래버튼에 포커스를 강제로 준다.
            if ($this.data('opener')) {
                var $btn = $($this.data('opener'));
                $btn.attr({
                    'aria-pressed': 'false',
                    'aria-expand': 'false'
                });
                if (options.focusOpener === true) {
                    $btn.focus();
                }
            }
        });
    };

    /**
     * 아무것도 안하는 빈함수
     * @function
     * @name $#noop
     * @example
     * $(this)[ isDone ? 'show' : 'noop' ](); // isDone이 true에 show하되 false일때는 아무것도 안함.
     */
    $.fn.noop = function () {
        return this;
    };

    /**
     * 체크된 항목의 값을 배열에 담아서 반환
     * @function
     * @name $#checkedValues
     * @return {Array}
     */
    $.fn.checkedValues = function () {
        var results = [];
        this.each(function () {
            if ((this.type === 'checkbox' || this.type === 'radio') && this.checked === true) {
                results[results.length] = this.value;
            }
        });
        return results;
    };

    /**
     * 같은 레벨에 있는 다른 row에서 on를 제거하고 현재 row에 on 추가
     * @function
     * @name $#activeRow
     * @param {String} cls 활성 클래스명
     * @return {jQuery}
     */
    $.fn.activeRow = function (cls) {
        cls = cls || 'on';
        return this.addClass(cls).siblings().removeClass(cls).end();
    };

    /**
     * timeStart("name")로 name값을 키로하는 타이머가 시작되며, timeEnd("name")로 해당 name값의 지난 시간을 로그에 출력해준다.
     * @memberOf jsa
     * @name timeStart
     * @function
     *
     * @param {String} name 타이머의 키값
     * @param {Boolean} reset 리셋(초기화) 여부
     *
     * @example
     * jsa.timeStart('animate');
     * ...
     * jsa.timeEnd('animate'); -> animate: 10203ms
     */
    jsa.timeStart = function (name, reset) {
        if (!name) {
            return;
        }
        var time = new Date().getTime(),
            key = "KEY" + name.toString();

        this.timeCounters || (this.timeCounters = {});
        if (!reset && this.timeCounters[key]) {
            return;
        }
        this.timeCounters[key] = time;
    };

    /**
     * timeStart("name")에서 지정한 해당 name값의 지난 시간을 로그에 출력해준다.
     * @memberOf jsa
     * @name timeEnd
     * @function
     *
     * @param {String} name 타이머의 키값
     * @return {Number} 걸린 시간
     *
     * @example
     * jsa.timeStart('animate');
     * ...
     * jsa.timeEnd('animate'); -> animate: 10203ms
     */
    jsa.timeEnd = function (name) {
        if (!this.timeCounters) {
            return;
        }

        var time = new Date().getTime(),
            key = "key_" + name.toString(),
            timeCounter = this.timeCounters[key],
            diff, label;

        if (timeCounter) {
            diff = time - timeCounter;
            label = name + ": " + diff + "ms";
            console.log(label);
            delete this.timeCounters[key];
        }
        return diff;
    };

    /**
     * 네임스페이스 공간을 생성하고 객체를 설정<br>
     * js의 네이티브에서 제공하지 않는 기능이지만,<br>
     * 객체리터럴을 이용하여 여타 컴파일 언어의 네임스페이스처럼 쓸 수 있다.
     *
     * @function
     * @memberOf jsa
     * @name namespace
     *
     * @param {String} name 네임스페이스명
     * @param {Object} obj {Optional} 지정된 네임스페이스에 등록할 객체, 함수 등
     * @return {Object} 생성된 네임스페이스
     *
     * @example
     * jsa.namesapce('jsa.widget.Tabcontrol', TabControl)
     *
     * ex) jsa.namespace('jsa.widget.Control', function(){}) 를 네이티브로 풀어서 작성한다면 다음과 같다.
     *
     * var jsa = jsa || {};
     * jsa.ui = jsa.ui || {};
     * jsa.widget.Control = jsa.widget.Control || function(){};
     */
    jsa.namespace = function (name, obj) {
        if (typeof name !== 'string') {
            obj && (name = obj);
            return name;
        }
        var root = context,
            names = name.split('.'),
            isSet = arguments.length === 2;

        if (isSet) {
            for (var i = -1, item; item = names[++i];) {
                root = root[item] || (root[item] = (i === names.length - 1 ? obj : {}));
            }
        } else { // isGet
            for (var i = -1, item; item = names[++i];) {
                if (item in root) {
                    root = root[item]
                } else {
                    throw Error(name + '은(는) 정의되지 않은 네임스페이스입니다.');
                }
            }
        }

        return root;
    };

    /**
     * codej를 루트로 하여 네임스페이스를 생성하여 새로운 속성을 추가하는 함수
     *
     * @function
     * @memberOf jsa
     * @name define
     *
     * @param {String} name .를 구분자로 해서 jk를 시작으로 하위 네임스페이스를 생성. 없으면 jk에 추가된다.
     * @param {Object|Function} object
     * @param {Boolean} (Optional) isExecFn object값이 함수형일 때 실행을 시킨 후에 설정할 것인가 여부
     *
     * @example
     * jsa.jsa.define('', [], {});
     * jsa.
     */
    jsa.define = function (name, object, isExecFn) {
        if (typeof name !== 'string') {
            object = name;
            name = '';
        }

        var root = jsa,
            names = name ? name.replace(/^codej\.?/, '').split('.') : [],
            ln = names.length - 1,
            leaf = names[ln];

        if (isExecFn !== false && typeof object === 'function' && !hasOwn.call(object, 'classType')) {
            object = object.call(root);
        }

        for (var i = 0; i < ln; i++) {
            root = root[names[i]] || (root[names[i]] = {});
        }

        (leaf && (root[leaf] ? $.extend(root[leaf], object) : (root[leaf] = object))) || $.extend(root, object);
    };

    /**
     * jsa.jsa.define 를 통해 정의된 모듈을 변수에 담아서 사용하고자 할 경우
     *
     * @function
     * @memberOf jsa
     * @name use
     *
     * @param {String} name 네임스페이스
     * @return {Object} 함수를 실행한 결과값
     *
     * @example
     * jsa.jsa.define('test', function(){
     *         return {
     *                init: function(){
     *                         alert(0);
     *                }
     *        });
     * var test = jsa.use('test');
     * test.init()        => alert(0)
     */
    jsa._prefix = 'jsa.';
    jsa.use = function (name) {
        var obj = jsa.namespace(jsa._prefix + name);
        if (jsa.isFunction(obj) && !hasOwn.call(obj, 'classType')) {
            obj = obj();
        }
        return obj;
    };

    jsa.define( /** @lends jsa */ {
        /**
         * document jQuery wrapper
         */
        $doc: $(document),
        /**
         * window jQuery wrapper
         */
        $win: $(window),
        /**
         * 빈 함수
         * @function
         * @example
         * var func = jsa.emptyFn
         */
        emptyFn: emptyFn,

        /**
         * 임시 노드: css3스타일의 지원여부와 html을 인코딩/디코딩하거나 노드생성할 때  사용
         */
        tmpNode: doc.createElement('div'),

        /**
         * html5 속성의 지원여부를 체크할 때 사용
         * @example
         * is = 'placeholder' in jsa.tmpInput;  // placeholder를 지원하는가
         */
        tmpInput: doc.createElement('input'),

        /**
         * 터치기반 디바이스 여부
         */
        isTouch: !! ('ontouchstart' in window),

        /**
         * 객체 자체에 주어진 이름의 속성이 있는지 조회
         *
         * @param {Object} obj 객체
         * @param {String} name 키 이름
         * @return {Boolean} 키의 존재 여부
         */
        hasOwn: function (obj, name) {
            return hasOwn.call(obj, name);
        },

        /**
         * 브라우저의 Detect 정보: 되도록이면 Modernizr 라이브러리를 사용할 것을 권함
         *
         * @example
         * jsa.browser.isOpera // 오페라
         * jsa.browser.isWebKit // 웹킷
         * jsa.browser.isIE // IE
         * jsa.browser.isIE6 // IE56
         * jsa.browser.isIE7 // IE567
         * jsa.browser.isOldIE // IE5678
         * jsa.browser.version // IE의 브라우저
         * jsa.browser.isChrome // 크롬
         * jsa.browser.isGecko // 파이어폭스
         * jsa.browser.isMac // 맥OS
         * jsa.browser.isAir // 어도비 에어
         * jsa.browser.isIDevice // 아이폰, 아이패드
         * jsa.browser.isSafari // 사파리
         * jsa.browser.isIETri4 // IE엔진
         */
        browser: (function () {
            var t = {},
                win = context,
                na = win.navigator,
                ua = na.userAgent,
                match;

            t.isOpera = win.opera && win.opera.buildNumber;
            t.isWebKit = /WebKit/.test(ua);

            match = /(msie) ([\w.]+)/.exec(ua.toLowerCase()) || /(trident)(?:.*rv.?([\w.]+))?/.exec(ua.toLowerCase()) || ['', null, -1];
            t.isIE = !t.isWebKit && !t.isOpera && match[1] !== null; //(/MSIE/gi).test(ua) && (/Explorer/gi).test(na.appName);
            t.isIE6 = t.isIE && /MSIE [56]/i.test(ua);
            t.isIE7 = t.isIE && /MSIE [567]/i.test(ua);
            t.isOldIE = t.isIE && /MSIE [5678]/i.test(ua);
            t.version = parseInt(match[2], 10); // 사용법: if(jsa.browser.isIE && jsa.browser.version > 8) { // 9이상인 ie브라우저

            t.isChrome = (ua.indexOf('Chrome') !== -1);
            t.isGecko = (ua.indexOf('Firefox') !== -1);
            t.isMac = (ua.indexOf('Mac') !== -1);
            t.isAir = ((/adobeair/i).test(ua));
            t.isIDevice = /(iPad|iPhone)/.test(ua);
            t.isSafari = (/Safari/).test(ua);
            t.isIETri4 = (t.isIE && ua.indexOf('Trident/4.0') !== -1);

            return t;
        }()),

        /**
         * 주어진 인자가 빈값인지 체크
         *
         * @param {Object} value 체크할 문자열
         * @param {Boolean} allowEmptyString (Optional: false) 빈문자를 허용할 것인지 여부
         * @return {Boolean}
         */
        isEmpty: function (value, allowEmptyString) {
            return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (this.isArray(value) && value.length === 0);
        },

        /**
         * 배열인지 체크
         *
         * @function
         * @param {Object} value 체크할 값
         * @return {Boolean}
         */
        isArray: function (value) {
            return value && (value.constructor === Array || !! value.push);
        },

        /**
         * 날짜형인지 체크
         * @param {Object} value 체크할 값
         * @return {Boolean}
         */
        isDate: function (value) {
            return toString.call(value) === '[object Date]';
        },

        /**
         * JSON 객체인지 체크
         *
         * @function
         * @param {Object} value 체크할 값
         * @return {Boolean}
         */
        isObject: (toString.call(null) === '[object Object]') ? function (value) {
            return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
        } : function (value) {
            return toString.call(value) === '[object Object]';
        },

        /**
         * 함수형인지 체크
         *
         * @function
         * @param {Object} value 체크할 값
         * @return {Boolean}
         */
        isFunction: (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function (value) {
            return toString.call(value) === '[object Function]';
        } : function (value) {
            return typeof value === 'function';
        },

        /**
         * 숫자 타입인지 체크.
         * @param {Object} value 체크할 값
         * @return {Boolean}
         */
        isNumber: function (value) {
            return typeof value === 'number' && isFinite(value);
        },

        /**
         * 숫지인지 체크하되 .를 허용
         * @param {Object} value 예: 1, '1', '2.34'
         * @return {Boolean}
         */
        isNumeric: function (value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        /**
         * 문자형인지 체크
         * @param {Object} value 체크할 값
         * @return {Boolean}
         */
        isString: function (value) {
            return typeof value === 'string';
        },

        /**
         * 불린형인지 체크
         *
         * @param {Object} value 체크할 값
         * @return {Boolean}
         */
        isBoolean: function (value) {
            return typeof value === 'boolean';
        },

        /**
         * 엘리먼트인지 체크
         * @param {Object} value 체크할 값
         * @return {Boolean}
         */
        isElement: function (value) {
            return value ? value.nodeType === 1 : false;
        },

        /**
         * 텍스트노드인지 체크
         * @param {Object} value 체크할 값
         * @return {Boolean}
         */
        isTextNode: function (value) {
            return value ? value.nodeName === "#text" : false;
        },

        /**
         * 정의된 값인지 체크
         * @param {Object} 체크할 값
         * @return {Boolean}
         */
        isDefined: function (value) {
            return typeof value !== 'undefined';
        },

        /**
         * 주어진 값을 배열로 변환
         *
         * @param {Mixed} 배열로 변환하고자 하는 값
         * @return {Array}
         *
         * @example
         * jsa.toArray('abcd"); => ["a", "b", "c", "d"]
         * jsa.toArray(arguments);  => arguments를 객체를 array로 변환하여 Array에서 지원하는 유틸함수(slice, reverse ...)를 쓸수 있다.
         */
        toArray: function (value) {
            return Array.prototype.slice.apply(value, Array.prototype.slice.call(arguments, 1));
        },

        /**
         * 15자의 숫자로 이루어진 유니크한 값 생성
         *
         * @return {String}
         */
        getUniqId: function () {
            return Number(String(Math.random() * 10).replace(/\D/g, ''));
        },

        /**
         * 순번으로 유니크값 을 생성해서 반환
         * @function
         * @return {Number}
         */
        getUniqKey: (function () {
            var uniqKey = 1;
            return function () {
                return (uniqKey += 1);
            };
        }())

    });

    /**
     * 문자열 관련 유틸 함수 모음
     *
     * @namespace
     * @name jsa.string
     * @description
     */
    jsa.define('string', function () {
        var escapeChars = {
            '&': '&amp;',
            '>': '&gt;',
            '<': '&lt;',
            '"': '&quot;',
            "'": '&#39;'
        },
            unescapeChars = (function (escapeChars) {
                var results = {};
                $.each(escapeChars, function (k, v) {
                    results[v] = k;
                });
                return results;
            })(escapeChars),
            escapeRegexp = /[&><'"]/g,
            unescapeRegexp = /(&amp;|&gt;|&lt;|&quot;|&#39;|&#[0-9]{1,5};)/g,
            tagRegexp = /<\/?[^>]+>/gi,
            scriptRegexp = /<script[^>]*>([\\S\\s]*?)<\/script>/img;

        return /** @lends jsa.string */ {
            /**
             * 정규식이나 검색문자열을 사용하여 문자열에서 텍스트를 교체
             *
             * @param {String} value 교체를 수행할 문자열
             * @param {RegExp|String} 검색할 문자열이나 정규식 패턴
             * @param {String} 대체할 문자열
             * @return {String} 대체된 결과 문자열
             *
             * @example
             * jsa.replaceAll("a1b2c3d", /[0-9]/g, ''); => "abcd"
             */
            replaceAll: function (value, find, rep) {
                if (find.constructor === RegExp) {
                    return value.replace(new RegExp(find.toString().replace(/^\/|\/$/gi, ""), "gi"), rep);
                }
                return value.split(find).join(rep);
            },

            /**
             * 주어진 문자열의 바이트길이 반환
             *
             * @param {String} value 길이를 계산할 문자열
             * @return {Number}
             *
             * @example
             * jsa.byteLength("동해물과"); => 8
             */
            byteLength: function (value) {
                var l = 0;
                for (var i = 0, len = value.length; i < len; i++) {
                    l += (value.charCodeAt(i) > 255) ? 2 : 1;
                }
                return l;
            },

            /**
             * 주어진 문자열을 지정된 길이(바이트)만큼 자른 후, 꼬리글을 덧붙여 반환
             *
             * @param {String} value 문자열
             * @param {Number} length 잘라낼 길이
             * @param {String} truncation (Optional: '...') 꼬리글
             * @return {String} 결과 문자열
             *
             * @example
             * jsa.string.cutByByte("동해물과", 3, "..."); => "동..."
             */
            cutByByte: function (value, length, truncation) {
                var str = value,
                    chars = this.charsByByte(value, length);

                truncation || (truncation = '');
                if (str.length > chars) {
                    return str.substring(0, chars) + truncation;
                }
                return str;
            },

            /**
             * 주어진 바이트길이에 해당하는 char index 반환
             *
             * @param {String} value 문자열
             * @param {Number} length 제한 문자수
             * @return {Number} chars count
             */
            charsByByte: function (value, length) {
                var str = value,
                    l = 0,
                    len = 0,
                    i = 0;
                for (i = 0, len = str.length; i < len; i++) {
                    l += (str.charCodeAt(i) > 255) ? 2 : 1;
                    if (l > length) {
                        return i;
                    }
                }
                return i;
            },

            /**
             * 첫글자를 대문자로 변환하고 이후의 문자들은 소문자로 변환
             *
             * @param {String} value 문자열
             * @return {String} 결과 문자열
             *
             * @example
             * jsa.string.capitalize("abCdEfg"); => "Abcdefg"
             */
            capitalize: function (value) {
                return value ? value.charAt(0).toUpperCase() + value.substring(1) : value;
            },

            /**
             * 카멜 형식으로 변환
             *
             * @param {String} value 문자열
             * @return {String} 결과 문자열
             *
             * @example
             * jsa.string.capitalize("ab-cd-efg"); => "abCdEfg"
             */
            camelize: function (value) {
                return value ? value.replace(/(\-|_|\s)+(.)?/g, function (a, b, c) {
                    return (c ? c.toUpperCase() : '');
                }) : value
            },

            /**
             * 대쉬 형식으로 변환
             *
             * @param {String} value 문자열
             * @return {String} 결과 문자열
             *
             * @example
             * jsa.string.dasherize("abCdEfg"); => "ab-cd-efg"
             */
            dasherize: function (value) {
                return value ? value.replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').toLowerCase() : value;
            },

            /**
             * 주어진 문자열을 지정한 수만큼 반복하여 조합
             *
             * @param {String} value 문자열
             * @param {Number} cnt 반복 횟수
             * @return {String} 결과 문자열
             *
             * @example
             * jsa.string.repeat("ab", 4); => "abababab"
             */
            repeat: function (value, cnt, sep) {
                sep || (sep = '');
                var result = [];

                for (var i = 0; i < cnt; i++) {
                    result.push(value);
                }
                return result.join(sep);
            },

            /**
             * 특수기호를 HTML ENTITY로 변환
             *
             * @param {String} value 특수기호
             * @return {String} 결과 문자열
             *
             * @example
             * jsa.string.escapeHTML('<div><a href="#">링크</a></div>'); => "&lt;div&gt;&lt;a href=&quot;#&quot;&gt;링크&lt;/a&gt;&lt;/div&gt;"
             */
            escapeHTML: function (value) {
                return value ? (value + "").replace(escapeRegexp, function (m) {
                    return escapeChars[m];
                }) : value;
            },

            /**
             * HTML ENTITY로 변환된 문자열을 원래 기호로 변환
             *
             * @param {String} value 문자열
             * @return {String} 결과 문자열
             *
             * @example
             * jsa.string.unescapeHTML('&lt;div&gt;&lt;a href=&quot;#&quot;&gt;링크&lt;/a&gt;&lt;/div&gt;');  => '<div><a href="#">링크</a></div>'
             */
            unescapeHTML: function (value) {
                return value ? (value + "").replace(unescapeRegexp, function (m) {
                    console.log(unescapeChars, m);
                    return unescapeChars[m];
                }) : value;
            },

            /** 
             * string === value이면 other를,  string !== value 이면 value를 반환
             *
             * @param {String} value
             * @param {String} these
             * @param {String} other
             * @return {String}
             *
             * @example
             * jsa.string.toggle('ASC", "ASC", "DESC"); => "DESC"
             * jsa.string.toggle('DESC", "ASC", "DESC"); => "ASC"
             */
            toggle: function (value, these, other) {
                return these === value ? other : value;
            },

            /**
             * 주어진 문자열에 있는 {인덱스} 부분을 인수로 대테하여 반환
             *
             * @param {String} format 문자열
             * @param {String} ... 대체할 문자열
             * @return {String} 결과 문자열
             *
             * @example
             * jsa.string.format("{0}:{1}:{2} {0}", "a", "b", "c");  => "a:b:c a"
             */
            format: function (format) {
                var args = jsa.toArray(arguments).slice(1);

                return format.replace(/{([0-9]+)}/g, function (m, i) {
                    return args[i];
                });
            },

            /**
             * 주어진 문자열에서 HTML를 제거
             *
             * @param {String} value 문자열
             * @return {String}
             */
            stripTags: function (value) {
                return value.replace(tagRegexp, '');
            },

            /**
             * 주어진 문자열에서 스크립트를 제거
             *
             * @param {String} value 문자열
             * @return {String}
             */
            stripScripts: function (value) {
                return value.replace(scriptRegexp, '');
            }

        };
    });


    /**
     * @namespace
     * @name jsa.uri
     * @description
     */
    jsa.define('uri', /** @lends jsa.uri */ {

        /**
         * 주어진 url에 쿼리스츠링을 조합
         *
         * @param {String} url
         * @param {String:Object} string
         * @return {String}
         *
         * @example
         * jsa.uri.urlAppend("board.do", {"a":1, "b": 2, "c": {"d": 4}}); => "board.do?a=1&b=2&c[d]=4"
         * jsa.uri.urlAppend("board.do?id=123", {"a":1, "b": 2, "c": {"d": 4}}); => "board.do?id=123&a=1&b=2&c[d]=4"
         */
        addToQueryString: function (url, string) {
            if (jsa.isObject(string)) {
                string = jsa.object.toQueryString(string);
            }
            if (!jsa.isEmpty(string)) {
                return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
            }

            return url;
        },

        /**
         * 쿼리스트링을 객체로 변환
         *
         * @param {String} query
         * @return {Object}
         *
         * @example
         * jsa.uri.parseQuery("a=1&b=2"); => {"a": 1, "b": 2}
         */
        parseQuery: function (query) {
            if (!query) {
                return {};
            }
            if (query.length > 0 && query.charAt(0) === '?') {
                query = query.substr(1);
            }

            var params = (query + '').split('&');
            var obj = {};
            var params_length = 0,
                tmp = '',
                x = 0;
            params_length = params.length;
            for (x = 0; x < params_length; x++) {
                tmp = params[x].split('=');
                obj[unescape(tmp[0])] = unescape(tmp[1]).replace(/[+]/g, ' ');
            }
            return obj;
        },

        /**
         * url를 파싱하여 host, port, protocol 등을 추출
         *
         * @function
         * @param {String} str url 문자열
         * @return {Object}
         *
         * @example
         * jsa.uri.parseUrl("http://www.jsa.com:8080/list.do?a=1&b=2#comment");
         * => {scheme: "http", host: "www.jsa.com", port: "8080", path: "/list.do", query: "a=1&b=2"…}
         */
        parseUrl: (function () {
            var o = {
                strictMode: false,
                key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
                q: {
                    name: "queryKey",
                    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                },
                parser: {
                    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                }
            };

            return function (str) {
                if (str.length > 2 && str[0] === '/' && str[1] === '/') {
                    str = window.location.protocol + str;
                }
                var m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
                    uri = {}, i = 14;
                while (i--) {
                    uri[o.key[i]] = m[i] || "";
                }
                var retArr = {};
                if (uri.protocol !== '') {
                    retArr.scheme = uri.protocol;
                }
                if (uri.host !== '') {
                    retArr.host = uri.host;
                }
                if (uri.port !== '') {
                    retArr.port = uri.port;
                }
                if (uri.user !== '') {
                    retArr.user = uri.user;
                }
                if (uri.password !== '') {
                    retArr.pass = uri.password;
                }
                if (uri.path !== '') {
                    retArr.path = uri.path;
                }
                if (uri.query !== '') {
                    retArr.query = uri.query;
                }
                if (uri.anchor !== '') {
                    retArr.fragment = uri.anchor;
                }
                return retArr;
            };
        })(),

        /**
         * 주어진 url에서 해쉬문자열 제거
         *
         * @param {String} url url 문자열
         * @return {String} 결과 문자열
         *
         * @example
         * jsa.uri.removeHash("list.do#comment"); => "list.do"
         */
        removeHash: function (url) {
            return url ? url.replace(/.*(?=#[^\s]+$)/, '') : url;
        }
    });

    /**
     * 숫자관련 유틸함수 모음
     *
     * @namespace
     * @name jsa.number
     * @description
     */
    jsa.define('number', /** @lends jsa.number */ {
        /**
         * 주어진 수를 자릿수만큼 앞자리에 0을 채워서 반환
         *
         * @param {String} value
         * @param {Number} size (Optional: 2)
         * @param {String} character (Optional: '0')
         * @return {String}
         *
         * @example
         * jsa.number.zeroPad(2, 3); => "002"
         */
        zeroPad: function (value, size, character) {
            var result = String(value);
            character = character || "0";
            size || (size = 2);

            while (result.length < size) {
                result = character + result;
            }
            return result;
        },

        /**
         * 세자리마다 ,를 삽입
         *
         * @param {Number} value
         * @return {String}
         *
         * @example
         * jsa.number.addComma(21342); => "21,342"
         */
        addComma: function (value) {
            value += '';
            var x = value.split('.'),
                x1 = x[0],
                x2 = x.length > 1 ? '.' + x[1] : '',
                re = /(\d+)(\d{3})/;

            while (re.test(x1)) {
                x1 = x1.replace(re, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },

        /**
         * min ~ max사이의 랜덤값 반환
         *
         * @param {Number} min 최소값
         * @param {Number} max 최대값
         * @return {Number} 랜덤값
         */
        random: function (min, max) {
            if (max === null) {
                max = min;
                min = 0;
            }
            return min + Math.floor(Math.random() * (max - min + 1));
        },

        /**
         * 상하한값을 반환. value가 min보다 작을 경우 min을, max보다 클 경우 max를 반환
         *
         * @param {Number} value
         * @param {Number} min 최소값
         * @param {Number} max 최대값
         * @return {Number}
         */
        limit: function (value, min, max) {
            if (value < min) {
                return min;
            } else if (value > max) {
                return max;
            }
            return value;
        }
    });


    /**
     * 배열관련 유틸함수
     * @namespace
     * @name jsa.array
     */
    jsa.define('array', /** @lends jsa.array */ {
        /**
         * 콜백함수로 하여금 요소를 가공하는 함수
         *
         * @param {Array} obj 배열
         * @param {Function} cb 콜백함수
         * @return {Array}
         *
         * @example
         * jsa.array.map([1, 2, 3], function(item, index){
         *                return item * 10;
         * });
         * => [10, 20, 30]
         */
        map: function (obj, cb) {
            var results = [];
            if (!jsa.isArray(obj) || !jsa.isFunction(cb)) {
                return results;
            }

            for (var i = 0, len = obj.length; i < len; i++) {
                results[results.length] = cb(obj[i], i, obj);
            }
            return results;
        },

        /**
         * 배열 요소의 순서를 섞어주는 함수
         *
         * @param {Array} obj 배열
         * @return {Array} 순서가 섞인 새로운 배열
         */
        shuffle: function (obj) {
            var rand,
                index = 0,
                shuffled = [],
                number = jsa.number;

            $.each(obj, function (k, value) {
                rand = number.random(index++);
                shuffled[index - 1] = shuffled[rand], shuffled[rand] = value;
            });
            return shuffled;
        },

        /**
         * 콜백함수로 하여금 요소를 걸려내는 함수
         *
         * @param {Array} obj 배열
         * @param {Function} cb 콜백함수
         * @return {Array}
         *
         * @example
         * jsa.array.filter([1, '일', 2, '이', 3, '삼'], function(item, index){
         *                return typeof item === 'string';
         * });
         * => ['일','이','삼']
         */
        filter: function (obj, cb) {
            var results = [];
            if (!jsa.isArray(obj) || !jsa.isFunction(cb)) {
                return results;
            }
            for (var i = 0, len = obj.length; i < len; i++) {
                cb(obj[i], i, obj) && (results[results.length] = obj[i]);
            }
            return results;
        },

        /**
         * 주어진 배열에 지정된 값이 존재하는지 체크
         *
         * @param {Array} obj 배열
         * @param {Function} cb 콜백함수
         * @return {Array}
         *
         * @example
         * jsa.array.include([1, '일', 2, '이', 3, '삼'], '삼');  => true
         */
        include: function (arr, value, b) {
            return jsa.array.indexOf(arr, value, b) > -1;
        },

        /**
         * 주어진 인덱스의 요소를 반환
         *
         * @param {Array} obj 배열
         * @param {Function} cb 콜백함수
         * @return {Array}
         *
         * @example
         * jsa.array.indexOf([1, '일', 2, '이', 3, '삼'], '일');  => 1
         */
        indexOf: function (arr, value, b) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if ((b !== false && arr[i] === value) || (b === false && arr[i] == value)) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * 주어진 배열에서 index에 해당하는 요소를 삭제
         *
         * @param {Array} value 배열
         * @param {Number} index 삭제할 인덱스
         * @return {Array} 지정한 요소가 삭제된 배열
         */
        remove: function (value, index) {
            if (!jsa.isArray(value)) {
                return value;
            }
            return value.slice(index, 1);
        },

        /**
         * 주어진 배열에서 가장 큰 요소를 반환
         *
         * @param {Array} array 배열
         * @return {Mix}
         */
        max: function (array) {
            return Math.max.apply(Math, array);
        },

        /**
         * 주어진 배열에서 가장 작은 요소를 반환
         *
         * @param {Array} array 배열
         * @return {Mix}
         */
        min: function (array) {
            return Math.min.apply(Math, array);
        }
    });

    /**
     * JSON객체 관련 유틸함수
     * @namespace
     * @name jsa.object
     */
    jsa.define('object', /** @lends jsa.object */ {

        /**
         * 개체의 열거가능한 속성 및 메서드 이름을 배열로 반환
         *
         * @param {Object} obj 리터럴 객체
         * @return {Array} 객체의 열거가능한 속성의 이름이 포함된 배열
         *
         * @example
         * jsa.object.keys({"name": "Axl rose", "age": 50}); => ["name", "age"]
         */
        keys: function (obj) {
            var results = [];
            $.each(obj, function (k) {
                results[results.length] = k;
            });
            return results;
        },

        /**
         * 개체의 열거가능한 속성의 값을 배열로 반환
         *
         * @param {Object} obj 리터럴 객체
         * @return {Array} 객체의 열거가능한 속성의 값들이 포함된 배열
         *
         * @example
         * jsa.object.values({"name": "Axl rose", "age": 50}); => ["Axl rose", 50]
         */
        values: function (obj) {
            var results = [];
            $.each(obj, function (k, v) {
                results[results.length] = v;
            });
            return results;
        },

        /**
         * 콜백함수로 하여금 요소를 가공하는 함수
         *
         * @param {JSON} obj 배열
         * @param {Function} cb 콜백함수
         * @return {JSON}
         *
         * @example
         * jsa.object.map({1; 'one', 2: 'two', 3: 'three'}, function(item, key){
         *                return item + '__';
         * });
         * => {1: 'one__', 2: 'two__', 3: 'three__'}
         */
        map: function (obj, cb) {
            if (!jsa.isObject(obj) || !jsa.isFunction(cb)) {
                return obj;
            }
            var results = {};
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    results[k] = cb(obj[k], k, obj);
                }
            }
            return results;
        },

        /**
         * 요소가 있는 json객체인지 체크
         *
         *
         * @param {Object} value json객체
         * @return {Boolean} 요소가 하나라도 있는지 여부
         */
        hasItems: function (value) {
            if (!jsa.isObject(value)) {
                return false;
            }

            for (var key in value) {
                if (value.hasOwnProperty(key)) {
                    return true;
                }
            }
            return false;
        },


        /**
         * 객체를 쿼리스크링으로 변환
         *
         * @param {Object} obj 문자열
         * @param {Boolean} isEncode {Optional} URL 인코딩할지 여부
         * @return {String} 결과 문자열
         *
         * @example
         * jsa.object.toQueryString({"a":1, "b": 2, "c": {"d": 4}}); => "a=1&b=2&c[d]=4"
         */
        toQueryString: function (params, isEncode) {
            if (typeof params === 'string') {
                return params;
            }
            var queryString = '',
                encode = isEncode === false ? function (v) {
                    return v;
                } : encodeURIComponent;

            $.each(params, function (key, value) {
                if (typeof (value) === 'object') {
                    $.each(value, function (innerKey, innerValue) {
                        if (queryString !== '') {
                            queryString += '&';
                        }
                        queryString += encode(key) + '[' + encode(innerKey) + ']=' + encode(innerValue);
                    });
                } else if (typeof (value) !== 'undefined') {
                    if (queryString !== '') {
                        queryString += '&';
                    }
                    queryString += encode(key) + '=' + encode(value);
                }
            });
            return queryString;
        },

        /**
         * 주어진 배열를 키와 요소를 맞바꾸어 반환
         *
         * @param {Array} obj 배열
         * @return {Object}
         *
         * @example
         * jsa.object.travere({1:a, 2:b, 3:c, 4:d]);
         * => {a:1, b:2, c:3, d:4}
         */
        traverse: function (obj) {
            var result = {};
            $.each(obj, function (index, item) {
                result[item] = index;
            });
            return result;
        },

        /**
         * 주어진 리터럴에서 index에 해당하는 요소를 삭제
         *
         * @param {Array} value 리터럴
         * @param {Number} key 삭제할 키
         * @return 지정한 요소가 삭제된 리터럴
         */
        remove: function (value, key) {
            if (!jsa.isObject(value)) {
                return value;
            }
            value[key] = null;
            delete value[key];
            return value;
        }
    });


    /**
     * 날짜관련 유틸함수
     * @namespace
     * @name jsa.date
     */
    jsa.define('date', function () {
        var months = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
            fullMonths = "January,Febrary,March,April,May,June,July,Augst,September,October,November,December".split(",");


        function compare(d1, d2) {
            return d1.getTime() > d2.getTime() ? -1 : (d1.getTime() === d2.getTime() ? 0 : 1);
        }

        return /** @lends jsa.date */ {
            /**
             * 날짜형식을 지정한 포맷의 문자열로 변환
             *
             * @param {Date} formatDate
             * @param {String} formatString} 포맷 문자열
             * @return {String} 결과 문자열
             *
             * @example
             * jsa.date.format(new Date(), "yy:MM:dd");
             * =>
             */
            format: function (formatDate, formatString) {
                formatString || (formatString = 'yyyy-MM-dd');
                if (formatDate instanceof Date) {
                    var yyyy = formatDate.getFullYear(),
                        yy = yyyy.toString().substring(2),
                        M = formatDate.getMonth() + 1,
                        MM = M < 10 ? "0" + M : M,
                        MMM = months[M - 1],
                        MMMM = fullMonths[M - 1],
                        d = formatDate.getDate(),
                        dd = d < 10 ? "0" + d : d,
                        h = formatDate.getHours(),
                        hh = h < 10 ? "0" + h : h,
                        m = formatDate.getMinutes(),
                        mm = m < 10 ? "0" + m : m,
                        s = formatDate.getSeconds(),
                        ss = s < 10 ? "0" + s : s,
                        x = h > 11 ? "PM" : "AM",
                        H = h % 12;

                    if (H === 0) {
                        H = 12;
                    }
                    return formatString.replace(/yyyy/g, yyyy).replace(/yy/g, yy).replace(/MMMM/g, MMMM).replace(/MMM/g, MMM).replace(/MM/g, MM).replace(/M/g, M).replace(/dd/g, dd).replace(/d/g, d).replace(/hh/g, hh).replace(/h/g, h).replace(/mm/g, mm).replace(/m/g, m).replace(/ss/g, ss).replace(/s/g, s).replace(/!!!!/g, MMMM).replace(/!!!/g, MMM).replace(/H/g, H).replace(/x/g, x);
                } else {
                    return "";
                }
            },

            /**
             * date가 start와 end사이인지 여부
             *
             * @param {Date} date 날짜
             * @param {Date} start 시작일시
             * @param {Date} end 만료일시
             * @return {Boolean}
             */
            between: function (date, start, end) {
                return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
            },

            /**
             * 날짜 비교
             *
             * @function
             * @param {Date} date1 날짜1
             * @param {Date} date2 날짜2
             * @return {Number} -1: date1가 이후, 0: 동일, 1:date2가 이후
             */
            compare: compare,

            /**
             * 년월일이 동일한가
             *
             * @param {Date} date1 날짜1
             * @param {Date} date2 날짜2
             * @return {Boolean}
             */
            equalsYMH: function (a, b) {
                var ret = true;
                if (!a || !a.getDate || !b || !b.getDate) {
                    return false;
                }
                $.each(['getFullYear', 'getMonth', 'getDate'], function (i, fn) {
                    ret = ret && (a[fn]() === b[fn]());
                    if (!ret) {
                        return false;
                    }
                });
                return ret;
            },

            /**
             * value날짜가 date이후인지 여부
             *
             * @param {Date} value 날짜
             * @param {Date} date
             * @return {Boolean}
             */
            isAfter: function (value, date) {
                return compare(value, date || new Date()) === 1;
            },

            /**
             * value날짜가 date이전인지 여부
             *
             * @param {Date} value 날짜
             * @param {Date} date
             * @return {Boolean}
             */
            isBefore: function (value, date) {
                return compare(value, date || new Date()) === -1;
            },

            /**
             * 주어진 날짜 형식의 문자열을 Date객체로 변환
             *
             * @function
             * @param {String} dateStringInRange 날짜 형식의 문자열
             * @return {Date}
             */
            parseDate: (function () {
                var isoExp = /^\s*(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?\s*$/;
                return function (dateStringInRange) {
                    var date, month, parts;

                    if (dateStringInRange instanceof Date) {
                        return dateStringInRange;
                    }

                    dateStringInRange = dateStringInRange.replace(/[^\d]+/g, '');
                    date = new Date(dateStringInRange);
                    if (!isNaN(date)) {
                        return date;
                    }

                    date = new Date(NaN);
                    parts = isoExp.exec(dateStringInRange);

                    if (parts) {
                        month = +parts[2];
                        date.setFullYear(parts[1] | 0, month - 1, parts[3] | 0);
                        date.setHours(parts[4] | 0);
                        date.setMinutes(parts[5] | 0);
                        date.setSeconds(parts[6] | 0);
                        if (month != date.getMonth() + 1) {
                            date.setTime(NaN);
                        }
                    }
                    return date;
                };
            })(),

            /**
             * 주어진 년월의 일수를 반환
             *
             * @param {Number} year 년도
             * @param {Number} month 월
             * @return {Date}
             */
            daysInMonth: function (year, month) {
                var dd = new Date(year | 0, month | 0, 0);
                return dd.getDate();
            },

            /**
             * 주어진 시간이 현재부터 몇시간 이전인지 표현(예: -54000 -> 54초 이전)
             *
             * @function
             * @param {Date|Interval} time 시간
             * @return {String}
             *
             * @example
             * jsa.date.prettyTimeDiff(new Date() - 51811); -> "52초 이전"
             */
            prettyTimeDiff: (function () {
                var ints = {
                    '초': 1,
                    '분': 60,
                    '시': 3600,
                    '일': 86400,
                    '주': 604800,
                    '월': 2592000,
                    '년': 31536000
                };

                return function (time) {

                    time = +new Date(time);

                    var gap = ((+new Date()) - time) / 1000,
                        amount, measure;

                    for (var i in ints) {
                        if (gap > ints[i]) {
                            measure = i;
                        }
                    }

                    amount = gap / ints[measure];
                    amount = gap > ints.day ? (Math.round(amount * 100) / 100) : Math.round(amount);
                    amount += measure + ' 이전';

                    return amount;
                };
            }()),
            /**
             * 주어진 시간이 현재부터 몇시간 이전인지 표현(예: -54000 -> 54초 이전)
             *
             * @function
             * @param {Date|Interval} time 시간
             * @return {String}
             *
             * @example
             * jsa.date.timeDiff(new Date() - 51811); -> "00:00:52"
             */
            timeDiff: function (t1, t2) {
                var zeroPad = jsa.number.zeroPad;
                var amount = (t1.getTime() - t2.getTime()) / 1000,
                    days = 0,
                    hours = 0,
                    mins = 0,
                    secs = 0;

                days = Math.floor(amount / 86400);
                amount = amount % 86400;
                hours = Math.floor(amount / 3600);
                amount = amount % 3600;
                mins = Math.floor(amount / 60);
                amount = amount % 60;
                secs = Math.floor(amount);

                return zeroPad(hours) + ':' + zeroPad(mins) + ':' + zeroPad(secs);
            }
        };
    });


    /**
         * prototype 을 이용한 클래스 생성
         * @namespace
         * @name jsa.Class
         * @example
         * var Person = Class({
        *        $extend: Object, // 상속받을 부모클래스
        *        $singleton: true, // 싱글톤 여부
        *        $statics: { // 클래스 속성 및 함수 
        *                live: function() {} // Person.live(); 으로 호출
        *        }, 
        *        $mixins: [Animal, Robot], // 특정 클래스에서 메소드들을 빌려오고자 할 때 해당 클래스를 지정(다중으로도 가능),
        *        initialize: function(name) {
        *                this.name = name;
        *        },
        *        say: function(job){
        *                alert("I'm Person: " + job);
        *        },
        *        run: function(){
        *                alert("i'm running...");
        *        }
        *`});
        *
        * var Man = Class({
        *        $extend: Person,
        *        initialize: function(name, age) {
        *                this.supr(name);  // Person(부모클래스)의 initialize메소드를 호출 or this.suprMethod('initialize', name);
        *                this.age = age;
        *        },
        *        // say를 오버라이딩함
        *        say: function(job) {
        *                this.suprMethod('say', 'programer'); // 부모클래스의 say 메소드 호출 - 첫번째인자는 메소드명, 두번째부터는 해당 메소드로 전달될 인자

        *                alert("I'm Man: "+ job);
        *        }
        * });
        * var man = new Man('kim', 20);
        * man.say('freeman');  // 결과: alert("I'm Person: programer"); alert("I'm Man: freeman");
        * man.run(); // 결과: alert("i'm running...");
        */


    jsa.define('Class', function () {
        var isFn = jsa.isFunction,
            emptyFn = jsa.emptyFn,
            include = jsa.array.include,
            ignoreNames = ['superclass', 'members', 'statics'];


        // 부모클래스의 함수에 접근할 수 있도록 .supr 속성에 부모함수를 래핑하여 설정
        function wrap(k, fn, supr) {
            return function () {
                var tmp = this.supr,
                    undef, ret;

                this.supr = supr.prototype[k];
                ret = undefined;
                try {
                    ret = fn.apply(this, arguments);
                } finally {
                    this.supr = tmp;
                }
                return ret;
            };
        }

        // 속성 중에 부모클래스에 똑같은 이름의 함수가 있을 경우 래핑처리
        function process(what, o, supr) {
            for (var k in o) {
                if (o.hasOwnProperty(k)) {
                    what[k] = isFn(o[k]) && isFn(supr.prototype[k]) ? wrap(k, o[k], supr) : o[k];
                }
            }
        }

        /**
         * 클래스 정의
         *
         * @memberOf jsa.Class
         *
         * @param {String} ns (Optional) 네임스페이스
         * @param {Object} attr 속성
         * @return {Class}
         */
        return function (attr) {
            var supr, statics, mixins, singleton, Parent, instance;

            if (isFn(attr)) {
                attr = attr();
            }

            // 생성자 몸체
            function constructor() {
                if (singleton) {
                    if (instance) {
                        return instance;
                    } else {
                        instance = this;
                    }
                }
                // ***** 해당클래스가 호출되기 전 초기화해야 할 글로벌 작업이 있을 경우, 
                // 메모리를 아끼기 위해 미리 실행하지 않고 클래스가 한번이라도 호출될 때 실행하도록
                // 콜백함수를 제공
                // ex) var Test = Class({...}); Test.onClassCreate = function(){ window.onresize = ...; };
                if (this.constructor.onClassCreate) {
                    this.constructor.onClassCreate();
                    delete this.constructor.onClassCreate;
                }

                if (this.initialize) {
                    this.initialize.apply(this, arguments);
                } else {
                    supr.prototype.initialize && supr.prototype.initialize.apply(this, arguments);
                }
            }

            function Class() {
                constructor.apply(this, arguments);
            }

            supr = attr.$extend || emptyFn;
            singleton = attr.$singleton || false;
            statics = attr.$statics || false;
            mixins = attr.$mixins || false;

            Parent = emptyFn;
            Parent.prototype = supr.prototype;

            Class.prototype = new Parent;
            Class.prototype.constructor = Class;

            /** 
             * 메소드 내에서 부모클래스에 접근할 때 사용
             * @memberOf jsa.Class
             * @property
             */
            Class.superclass = supr.prototype;
            Class.classType = Class;

            if (singleton) {
                /** 
                 * 싱글톤 클래스일 경우 싱글톤 인스턴스를 반환
                 * @memberOf jsa.Class
                 * @property
                 */
                Class.getInstance = function () {
                    if (!instance) {
                        instance = new Class();
                    }
                    return instance;
                };
            }

            /** 
             * 부모클래스의 메소드를 호출할 수 있는 래핑함수
             * @memberOf jsa.Class
             * @name suprMethod
             * @function
             * @param {String} name 호출하고자 하는 부모함수명
             * @return {Mix} 부모함수의 반환값
             * @example
             * this.suprMethod('show', true);  -> 부모클래스의 show(true) 메소드 호출
             */
            Class.prototype.suprMethod = function (name) {
                var args = [].slice.call(arguments, 1);
                return supr.prototype[name].apply(this, args);
            };

            /** 
             * func의 컨텍스트를 this로 지정
             * @memberOf jsa.Class
             * @name proxy
             * @function
             * @param {function} function 함수
             * @return {Function}
             * @example
             * function test(){
             *                alert(this.name);
             * }
             * var Person = Class({
             *                initialize: function() {
             *                        this.name = 'axl rose',
             *                        this.proxy(test)();  // = test.bind(this)와 동일, test함수의 컨텍스틑 this로 지정 -> 결과: alert('axl rose');
             *                }
             * });
             */
            Class.prototype.proxy = function (func) {
                var _this = this;
                return function () {
                    func.apply(_this, [].slice.call(arguments));
                };
            };


            /** 
             * 여러 클래스를 mixins방식으로 merge
             * @memberOf jsa.Class
             * @name mixins
             * @function
             * @param {function} o 객체
             * @example
             * var A = Class({
             *                funcA: function(){ ... }
             * });
             * var B = Class({
             *                funcB: function(){ ... }
             * });
             * var Person = Class({
             *                initialize: function() {
             *                        ...
             *                }
             * });
             * Person.mixins([A, B]);
             * var person = new Person();
             * person.funcA();
             * person.funcB();
             */
            Class.mixins = function (o) {
                if (!o.push) {
                    o = [o];
                }
                $.each(o, function (index, value) {
                    $.each(value, function (key, item) {
                        Class.prototype[key] = item;
                    });
                });
            };
            mixins && Class.mixins.call(Class, mixins);


            /** 
             * 클래스에 메소드  추가
             * @memberOf jsa.Class
             * @name members
             * @function
             * @param {function} o 객체
             * @example
             * var Person = Class({
             *                initialize: function() {
             *                        ...
             *                }
             * });
             * Person.members({
             *                newFunc: function() { ... }
             * });
             * var person = new Person();
             * person.newFunc();
             */
            Class.members = function (o) {
                process(Class.prototype, o, supr);
            };
            attr && Class.members.call(Class, attr);

            /*
             * 클래스함수 추가함수
             * @memberOf jsa.Class
             * @name statics
             * @function
             * @param {function} o 객체
             * @example
             * var Person = Class({
             *                initialize: function() {
             *                        ...
             *                }
             * });
             * Person.statics({
             *                staticFunc: function() { ... }
             * });
             * Person.staticFunc();
             */
            Class.statics = function (o) {
                o = o || {};
                for (var k in o) {
                    if (!include(ignoreNames, k)) {
                        Class[k] = o[k];
                    }
                }
                return Class;
            };
            Class.statics.call(Class, supr);
            statics && Class.statics.call(Class, statics);

            return Class;
        };
    });

    jsa.define( /** @lends jsa */ {
        /**
         * 설정 값들이 들어갈 리터럴
         *
         * @private
         * @type {Object}
         */
        configs: {},

        /**
         * 설정값을 꺼내오는 함수
         *
         * @param {String} name 설정명. `.`를 구분값으로 단계별로 값을 가져올 수 있다.
         * @param {Object} def {Optional} 설정된 값이 없을 경우 사용할 기본값
         * @return {Object} 설정값
         */
        getConfig: function (name, def) {
            var root = jsa.configs,
                names = name.split('.'),
                pair = root;

            for (var i = 0, len = names.length; i < len; i++) {
                if (!(pair = pair[names[i]])) {
                    return def;
                }
            }
            return pair;
        },

        /**
         * 설정값을 지정하는 함수
         *
         * @param {String} name 설정명. `.`를 구분값으로 단계를 내려가서 설정할 수 있다.
         * @param {Object} value 설정값
         * @return {Object} 설정값
         */
        setConfig: function (name, value) {
            var root = jsa.configs,
                names = name.split('.'),
                len = names.length,
                last = len - 1,
                pair = root;

            for (var i = 0; i < last; i++) {
                pair = pair[names[i]] || (pair[names[i]] = {});
            }
            return (pair[names[last]] = value);
        }
    });

    /**
     * @namespace
     * @name jsa.Cookie
     */
    jsa.define('Cookie', /** @lends jsa.Cookie */ {
        /**
         * 쿠키를 설정
         *
         * @param {String} name 쿠키명
         * @param {String} value 쿠키값
         * @param {Date} (Optional) options.expires 만료시간
         * @param {String} (Optional) options.path 쿠키의 유효경로
         * @param {String} (Optional) options.domain 쿠키의 유효 도메인
         * @param {Boolean} (Optional) options.secure https에서만 쿠키 설정이 가능하도록 하는 속성
         */
        set: function (name, value, options) {
            options || (options = {});
            var curCookie = name + "=" + escape(value) +
                ((options.expires) ? "; expires=" + options.expires.toGMTString() : "") +
                ((options.path) ? "; path=" + options.path : "") +
                ((options.domain) ? "; domain=" + options.domain : "") +
                ((options.secure) ? "; secure" : "");
            document.cookie = curCookie;
        },

        /**
         * 쿠키를 설정
         *
         * @param {String} name 쿠키명
         * @return  {String} 쿠키값
         */
        get: function (name) {
            var j, g, h, f;
            j = ";" + document.cookie.replace(/ /g, "") + ";";
            g = ";" + name + "=";
            h = j.indexOf(g);

            if (h !== -1) {
                h += g.length;
                f = j.indexOf(";", h);
                return unescape(j.substr(h, f - h));
            }
            return "";
        },

        /**
         * 쿠키 삭제
         *
         * @param {String} name 쿠키명
         */
        remove: function (name) {
            document.cookie = name + "=;expires=Fri, 31 Dec 1987 23:59:59 GMT;";
        }
    });

    jsa.define( /** @lends jsa */ {
        /**
         * 템플릿 생성
         *
         * @param {String} text 템플릿 문자열
         * @param {Object} data 템플릿 문자열에서 변환될 데이타
         * @param {Object} settings 옵션
         * @return tempalte 함수
         *
         * @example
         * var tmpl = jsa.template('&lt;span>&lt;%=name%>&lt;/span>');
         * var html = tmpl({name: 'Axl rose'}); => &lt;span>Axl rose&lt;/span>
         * $('div').html(html);
         */
        template: function (str, data) {
            var m,
                src = 'var __src = [], escapeHTML=jsa.string.escapeHTML; with(value||{}){ __src.push("';

            src += str.replace(/\r|\n|\t/g, " ")
                .replace(/<%(.*?)%>/g, function (a, b) {
                    return '<%' + b.replace(/"/g, '\t') + '%>';
                })
                .replace(/"/g, '\\"')
                .replace(/<%(.*?)%>/g, function (a, b) {
                    return '<%' + b.replace(/\t/g, '"') + '%>';
                })
                .replace(/<%=(.+?)%>/g, '", $1, "')
                .replace(/<%-(.+?)%>/g, '", escapeHTML($1), "')
                .replace(/(<%|%>)/g, function (a, b) {
                    return b === '<%' ? '");' : '__src.push("'
                });

            src += '"); }; return __src.join("")';

            var f = new Function('value', 'data', src);
            if (data) {
                return f(data);
            }
            return f;
        }
    });


    /**
     * @namespace
     * @name jsa.valid
     * @description 밸리데이션 함수 모음
     */
    jsa.define('valid', function () {
        var trim = $.trim,
            isString = jsa.isString,
            isNumber = jsa.isNumber,
            isElement = jsa.isElement;

        return /** @lends jsa.valid */ {
            empty: jsa.isEmpty,
            /**
             * 필수입력 체크
             *
             * @param {String} str
             * @return {Boolean} 빈값이면 false 반환
             */
            require: function (str) {
                isString(str) || (isElement(str) && (str = str.value));
                return !!str;
            },
            /**
             * 유효한 이메일형식인지 체크
             *
             * @param {String} str
             * @return {Boolean}
             */
            email: function (str) {
                isString(str) || (isElement(str) && (str = str.value));
                return (str = trim(str)) ? (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,4}$/).test(str) : false;
            },
            /**
             * 한글인지 체크
             *
             * @param {String} str
             * @return {Boolean}
             */
            kor: function (str) {
                isString(str) || (isElement(str) && (str = str.value));
                return (str = trim(str)) ? (/^[가-힝]+$/).test(str) : false;
            },
            /**
             * 영문 체크
             *
             * @param {String} str
             * @return {Boolean}
             */
            eng: function (str) {
                isString(str) || (isElement(str) && (str = str.value));
                return (str = trim(str)) ? (/^[a-zA-Z]+$/).test(str) : false;
            },
            /**
             * 숫자 체크
             *
             * @param {String} str
             * @return {Boolean}
             */
            num: function (str) {
                isString(str) || (isElement(str) && (str = str.value));
                return (str = trim(str)) ? isNumber(str) : false;
            },
            /**
             * 유효한 url형식인지 체크
             *
             * @param {String} str
             * @return {Boolean}
             */
            url: function (str) {
                isString(str) || (isElement(str) && (str = str.value));
                return (str = trim(str)) ? (/^https?:\/\/([\w\-]+\.)+/).test(str) : false;
            },
            /**
             * 특수기호 유무 체크
             *
             * @param {String} str
             * @return {Boolean}
             */
            special: function (str) {
                isString(str) || (isElement(str) && (str = str.value));
                return (str = trim(str)) ? (/^[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]+$/).test(str) : false;
            },
            /**
             * 유효한 전화번호형식인지 체크
             *
             * @param {String} str
             * @return {Boolean}
             */
            phone: function (str) {
                isString(str) || (isElement(str) && (str = str.value));
                return (str = trim(str)) ? (/^\d{1,3}-\d{3,4}-\d{4}$/).test(str) : false;
            },
            /**
             * 유효한 yyyy-MM-dd형식인지 체크
             *
             * @param {String} str
             * @return {Boolean}
             */
            dateYMD: function (str) {
                isString(str) || (isElement(str) && (str = str.value));
                return (str = trim(str)) ? (/^\d{4}-\d{2}-\d{2}$/).test(str) : false;
            },
            /**
             * 유효한 yyyy-MM-dd hh:mm:ss형식인지 체크
             *
             * @param {String} str
             * @return {Boolean}
             */
            dateYMDHMS: function (str) {
                isString(str) || (isElement(str) && (str = str.value));
                return (str = trim(str)) ? (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/).test(str) : false;
            },
            /**
             * 유효한 주민번호인지 체크
             *
             * @param {String} strSsn1 앞주민번호.
             * @param {String} strSsn2 (Optional) 뒷주민번호. 값이 없으면 strSsn1만으로 체크
             * @return {Boolean}
             */
            SSN: function (sid1, sid2) {
                var num = sid1 + (sid2 ? sid2 : ""),
                    pattern = /^(\d{6})-?(\d{7})$/,
                    sum = 0,
                    last, mod,
                    bases = "234567892345";

                if (!pattern.test(num)) {
                    return false;
                }
                num = RegExp.$1 + RegExp.$2;

                last = num.charCodeAt(12) - 0x30;

                for (var i = 0; i < 12; i++) {
                    if (isNaN(num.substring(i, i + 1))) {
                        return false;
                    }
                    sum += (num.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30);
                }
                mod = sum % 11;
                return ((11 - mod) % 10 === last) ? true : false;
            },
            /**
             * 유효한 외국인주민번호인지 체크
             *
             * @param {String} strSsn1 앞주민번호.
             * @param {String} strSsn2 (Optional) 뒷주민번호. 값이 없으면 strSsn1만으로 체크
             * @return {Boolean}
             */
            FgnSSN: function (sid1, sid2) {
                var num = sid1 + (sid2 ? sid2 : ""),
                    pattern = /^(\d{6})-?(\d{7})$/,
                    sum = 0,
                    odd, buf,
                    multipliers = "234567892345".split("");

                if (!pattern.test(num)) {
                    return false;
                }
                num = RegExp.$1 + RegExp.$2;

                buf = jsa.toArray(num);
                odd = buf[7] * 10 + buf[8];

                if (odd % 2 !== 0) {
                    return false;
                }

                if ((buf[11] !== 6) && (buf[11] !== 7) && (buf[11] !== 9)) {
                    return false;
                }

                for (var i = 0; i < 12; i++) {
                    sum += (buf[i] *= multipliers[i]);
                }

                sum = 11 - (sum % 11);
                if (sum >= 10) {
                    sum -= 10;
                }

                sum += 2;
                if (sum >= 10) {
                    sum -= 10;
                }

                if (sum !== buf[12]) {
                    return false;
                }

                return true;
            }
        };
    });

    /**
     * @namespace
     * @name jsa.css
     * @description 벤더별 css명칭 생성
     */
    jsa.define('css', function () {

        var _tmpDiv = jsa.tmpNode,
            _prefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'],
            _style = _tmpDiv.style,
            _vendor = (function () {
                var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
                    transform,
                    i = 0,
                    l = vendors.length;

                for (; i < l; i++) {
                    transform = vendors[i] + 'ransform';
                    if (transform in _style) return vendors[i].substr(0, vendors[i].length - 1);
                }

                return false;
            })(),
            string = jsa.string;

        function prefixStyle(name) {
            if (_vendor === false) return false;
            if (_vendor === '') return name;
            return _vendor + string.capitalize(name);
        }

        return /** @lends jsa.css */ {
            supportTransition: _vendor !== false,
            /**
             * 현재 브라우저의 css prefix명 (webkit or Moz or ms or O)
             * @function
             * @return {String}
             */
            vendor: _vendor,
            /**
             * 주어진 css속성을 지원하는지 체크
             *
             * @param {String} cssName 체크하고자 하는 css명
             * @return {Boolean} 지원여부
             */
            hasCSS3: function (name) {
                var a = _prefixes.length;
                if (name in _style) {
                    return true;
                }
                name = string.capitalize(name);
                while (a--) {
                    if (_prefixes[a] + name in _style) {
                        return true;
                    }
                }
                return false;
            },

            /**
             * 주어진 css명 앞에 현재 브라우저에 해당하는 prefix를 붙여준다.
             *
             * @function
             * @param {String} cssName css명
             * @return {String}
             * @example
             * jsa.css.prefixStyle('transition'); // => webkitTransition
             */
            prefixStyle: prefixStyle
        };
    });

    /**
     * @namespace
     * @name jsa.util
     */
    jsa.define('util', function () {

        return /** @lends jsa.util */ {
            /**
             * png Fix
             */
            pngFix: function () {
                var s, bg;
                $('img[@src*=".png"]', document.body).each(function () {
                    this.css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + this.src + '\', sizingMethod=\'\')');
                    this.src = jsa.getSite() + jsa.Urls.getBlankImage() || '/resource/images/common/blank.gif';
                });
                $('.pngfix', document.body).each(function () {
                    var $this = $(this);

                    s = $this.css('background-image');
                    if (s && /\.(png)/i.test(s)) {
                        bg = /url\("(.*)"\)/.exec(s)[1];
                        $this.css('background-image', 'none');
                        $this.css('filter', "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + bg + "',sizingMethod='scale')");
                    }
                });
            },

            /**
             * 페이지에 존재하는 플래쉬의 wmode모드를 opaque로 변경
             */
            wmode: function () {
                $('object').each(function () {
                    var $this;
                    if (this.classid.toLowerCase() === 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' || this.type.toLowerCase() === 'application/x-shockwave-flash') {
                        if (!this.wmode || this.wmode.toLowerCase() === 'window') {
                            this.wmode = 'opaque';
                            $this = $(this);
                            if (typeof this.outerHTML === 'undefined') {
                                $this.replaceWith($this.clone(true));
                            } else {
                                this.outerHTML = this.outerHTML;
                            }
                        }
                    }
                });
                $('embed[type="application/x-shockwave-flash"]').each(function () {
                    var $this = $(this),
                        wm = $this.attr('wmode');
                    if (!wm || wm.toLowerCase() === 'window') {
                        $this.attr('wmode', 'opaque');
                        if (typeof this.outerHTML === 'undefined') {
                            $this.replaceWith($this.clone(true));
                        } else {
                            this.outerHTML = this.outerHTML;
                        }
                    }
                });
            },

            /**
             * 팝업. (jsa.openPopup으로도 사용가능)
             * @param {string} url 주소
             * @param {number=} width 너비.
             * @param {number=} height 높이.
             * @param {opts=} 팝업 창 모양 제어 옵션.
             */
            openPopup: function (url, width, height, opts) {
                opts = $.extend({

                }, opts);
                width = width || 600;
                height = height || 400;
                //var winCoords = jsa.util.popupCoords(width, height),
                var target = opts.target || '',
                    feature = 'app_, ',
                    tmp = [];

                delete opts.name;
                for (var key in opts) {
                    tmp.push(key + '=' + opts[key]);
                }
                jsa.browser.isSafari && tmp.push('location=yes');
                tmp.push('height=' + height);
                tmp.push('width=' + width);
                /* + ', top=' + winCoords.top + ', left=' + winCoords.left;*/
                feature += tmp.join(', ');

                window.open(
                    url,
                    target,
                    feature
                );
            },

            /**
             * 팝업의 사이즈를 $el 사이즈에 맞게 조절
             */
            resizePopup: function ($el) {
                if (!($el instanceof jQuery)) {
                    $el = $($el);
                }
                window.resizeTo($el.width(), $el.height());
            },

            /**
             * 팝업의 사이즈에 따른 화면상의 중앙 위치좌표를 반환
             * @param {number} w 너비.
             * @param {number} h 높이.
             * @return {JSON} {left: 값, top: 값}
             */
            popupCoords: function (w, h) {
                var wLeft = window.screenLeft ? window.screenLeft : window.screenX,
                    wTop = window.screenTop ? window.screenTop : window.screenY,
                    wWidth = window.outerWidth ? window.outerWidth : document.documentElement.clientWidth,
                    wHeight = window.outerHeight ? window.outerHeight : document.documentElement.clientHeight;

                return {
                    left: wLeft + (wWidth / 2) - (w / 2),
                    top: wTop + (wHeight / 2) - (h / 2) - 25
                };
            },

            /**
             * data-src에 있는 이미지주소를 실제로 불러들인 다음, 주어진 사이즈내에서 자동으로 리사이징 처리
             * @param {jQuery} $imgs
             * @param {Number} wrapWidth 최대 너비 값
             * @param {Number} wrapHeight 최대 높이 값
             * @param {Function} [onError] (optional) 이미지를 불어오지 못했을 경우 실행할 콜백함수
             * @return {Boolean} true 불러들인 이미지가 있었는지 여부
             */
            lazyLoadImage: function ($imgs, wrapWidth, wrapHeight, onError) {
                var hasLazyImage = false;
                var dataSrcAttr = 'data-src';

                $imgs.filter('img[data-src]').each(function (i) {
                    var $img = $(this);
                    wrapWidth = wrapWidth || $img.parent().width();
                    wrapHeight = wrapHeight || $img.parent().height();

                    // 이미지가 로드되면, 실제 사이즈를 체크해서 가로이미지인지 세로이미지인지에 따라 기준이 되는 width, height에 지정한다.
                    $img.one('load', function () {
                        $img.removeAttr('width height').css({
                            'width': 'auto',
                            'height': 'auto'
                        });
                        if ($img.attr('data-no-height') === 'true' && this.width > wrapWidth) {
                            $img.css('width', wrapWidth);
                        } else if ($img.attr('data-no-width') === 'true' && this.height > wrapHeight) {
                            $img.css('height', wrapWidth);
                        } else {
                            var isHoriz = this.width > this.height;
                            if (isHoriz) { // 가로로 긴 이미지
                                $img.css('width', Math.min(this.width, wrapWidth));
                            } else { // 세로로 긴 이미지
                                $img.css('height', Math.min(this.height, wrapHeight));
                            }
                        }
                    }).attr('src', $img.attr('data-src')).removeAttr('data-src');
                });
                return hasLazyImage;
            },

            /**
             * 도큐먼트의 높이를 반환
             * @return {Number}
             */
            getDocHeight: function () {
                var doc = document,
                    bd = doc.body,
                    de = doc.documentElement;

                return Math.max(
                    Math.max(bd.scrollHeight, de.scrollHeight),
                    Math.max(bd.offsetHeight, de.offsetHeight),
                    Math.max(bd.clientHeight, de.clientHeight)
                );
            },

            /**
             * 도큐먼트의 너비를 반환
             * @return {Number}
             */
            getDocWidth: function () {
                var doc = document,
                    bd = doc.body,
                    de = doc.documentElement;
                return Math.max(
                    Math.max(bd.scrollWidth, de.scrollWidth),
                    Math.max(bd.offsetWidth, de.offsetWidth),
                    Math.max(bd.clientWidth, de.clientWidth)
                );
            },

            /**
             * 창의 너비를 반환
             * @return {Number}
             */
            getWinWidth: function () {
                var w = 0;
                if (self.innerWidth) {
                    w = self.innerWidth;
                } else if (document.documentElement && document.documentElement.clientHeight) {
                    w = document.documentElement.clientWidth;
                } else if (document.body) {
                    w = document.body.clientWidth;
                }
                return w;
            },

            /**
             * 창의 높이를 반환
             * @return {Number}
             */
            getWinHeight: function () {
                var w = 0;
                if (self.innerHeight) {
                    w = self.innerHeight;
                } else if (document.documentElement && document.documentElement.clientHeight) {
                    w = document.documentElement.clientHeight;
                } else if (document.body) {
                    w = document.body.clientHeight;
                }
                return w;
            }
        };
    });

    jsa.openPopup = jsa.util.openPopup;

})(window, jQuery);


(function (context, $, jsa) {
    "use strict";
    /* jshint expr: true, validthis: true */

    var $win = jsa.$win,
        $doc = jsa.$doc,
        Class = jsa.Class,
        dateUtil = jsa.date,
        stringUtil = jsa.string,
        numberUtil = jsa.number,
        View; // ui.View

    /*
     * @namespace
     * @name jsa.EVENTS
     */
    jsa.define('EVENTS', {
        ON_BEFORE_SHOW: 'beforeshow',
        ON_SHOW: 'show',
        ON_BEFORE_HIDE: 'beforehide',
        ON_HIDE: 'hide'
    });


    jsa.define( /** @lends jsa */ {
        /**
         * 작성된 클래스를 jQuery의 플러그인으로 사용할 수 있도록 바인딩시켜 주는 함수
         *
         * @param {Class} klass 클래스
         * @param {String} name 플러그인명
         *
         * @example
         * // 클래스 정의
         * var Slider = jsa.Class({
         *   initialize: function(el, options) { // 생성자의 형식을 반드시 지킬 것..(첫번째 인수: 대상 엘리먼트, 두번째 인수: 옵션값들)
         *   ...
         *   },
         *   ...
         * });
         * jsa.bindjQuery(Slider, 'jkSlider');
         * // 실제 사용시
         * $('#slider').jkSlider({count: 10});
         */
        bindjQuery: function (Klass, name) {
            var old = $.fn[name];

            $.fn[name] = function (options) {
                var a = arguments,
                    args = [].slice.call(a, 1),
                    me = this,
                    returnValue = this;

                this.each(function () {
                    var $this = $(this),
                        methodValue,
                        instance;

                    if (!(instance = $this.data(name)) || (a.length === 1 && typeof options !== 'string')) {
                        instance && (instance.destroy(), instance = null);
                        $this.data(name, (instance = new Klass(this, $.extend({}, $this.data(), options), me)));
                    }

                    if (typeof options === 'string' && jsa.isFunction(instance[options])) {
                        try {
                            methodValue = instance[options].apply(instance, args);
                        } catch (e) {}

                        if (typeof methodValue !== 'undefined') {
                            returnValue = methodValue;
                            return false;
                        }
                    }
                });
                return returnValue;
            };

            // 기존의 모듈로 복구
            $.fn[name].noConflict = function () {
                $.fn[name] = old;
                return this;
            };
        }
    });


    jsa.define('Listener', function () {
        /**
         * 이벤트 리스너
         * @class
         * @name jsa.Listener
         */
        var Listener = Class( /** @lends jsa.Listener# */ {
            /**
             * 생성자
             */
            initialize: function () {
                this._listeners = $({});
            },

            /**
             * 이벤트 핸들러 등록
             * @param {Object} name 이벤트명
             * @param {Object} cb 핸들러
             */
            on: function () {
                var lsn = this._listeners;
                lsn.on.apply(lsn, arguments);
                return this;
            },

            /**
             * 한번만 실행할 이벤트 핸들러 등록
             * @param {Object} name 이벤트명
             * @param {Object} cb 핸들러
             */
            once: function () {
                var lsn = this._listeners;
                lsn.once.apply(lsn, arguments);
                return this;
            },

            /**
             * 이벤트 핸들러 삭제
             * @param {Object} name 삭제할 이벤트명
             * @param {Object} cb {Optional} 삭제할 핸들러. 이 인자가 없을 경우 name에 등록된 모든 핸들러를 삭제.
             */
            off: function () {
                var lsn = this._listeners;
                lsn.off.apply(lsn, arguments);
                return this;
            },

            /**
             * 이벤트 발생
             * @param {Object} name 발생시킬 이벤트명
             */
            trigger: function () {
                var lsn = this._listeners;
                lsn.trigger.apply(lsn, arguments);
                return this;
            }
        });

        return Listener;
    });


    /**
     * @namespace
     * @name jsa.PubSub
     * @description 발행/구독 객체: 상태변화를 관찰하는 옵저버(핸들러)를 등록하여, 상태변화가 있을 때마다 옵저버를 발행(실행)
     * 하도록 하는 객체이다.
     * @example
     * // 옵저버 등록
     * jsa.PubSub.on('customevent', function(){
     *         alert('안녕하세요');
     * });
     *
     * // 등록된 옵저버 실행
     * jsa.PubSub.trigger('customevent');
     */
    jsa.define('PubSub', function () {

        var PubSub = new jsa.Listener();
        PubSub.attach = PubSub.on;
        PubSub.unattach = PubSub.off;

        return PubSub;
    });


    /**
     * @namespace
     * @name jsa.ui
     */
    View = jsa.define('ui.View', function () {
        var isFn = jsa.isFunction,
            execObject = function (obj, ctx) {
                return isFn(obj) ? obj.call(ctx) : obj;
            };

        /**
         * 모든 UI요소 클래스의 최상위 클래스로써, UI클래스를 작성함에 있어서 편리한 기능을 제공해준다.
         * @class
         * @name jsa.ui.View
         *
         * @example
         *
         * var Slider = Class({
         *                $extend: jsa.ui.View,
         *                // 기능1) events 속성을 통해 이벤트핸들러를 일괄 등록할 수 있다. ('이벤트명 selector': '핸들러함수명')
         *        events: {
         *                click ul>li.item': 'onItemClick',                // this.$el.on('click', 'ul>li.item', this.onItemClick.bind(this)); 를 자동 수행
         *                'mouseenter ul>li.item>a': 'onMouseEnter'        // this.$el.on('mouseenter', 'ul>li.item>a', this.onMouseEnter.bind(this)); 를 자동 수행
         *        },
         *        // 기능2) selectors 속성을 통해 지정한 selector에 해당하는 노드를 주어진 이름의 멤버변수에 자동으로 설정해 준다.
         *        selectors: {
         *                box: 'ul',                        // this.$box = this.$el.find('ul') 를 자동수행
         *                items: 'ul>li.item',        // this.$items = this.$el.find('ul>li.item') 를 자동수행
         *                prevBtn: 'button.prev', // this.$prevBtn = this.$el.find('button.prev') 를 자동 수행
         *                nextBtn: 'button..next' // this.$nextBtn = this.$el.find('button.next') 를 자동 수행
         *        },
         *        initialize: function(el, options) {
         *        this.supr(el, options);        // 기능4) this.$el, this.options가 자동으로 설정된다.
         *        },
         *        onItemClick: function(e) {
         *                ...
         *        },
         *        onMouseEnter: function(e) {
         *                ...
         *        }
         * });
         *
         * new jsa.ui.Slider('#slider', {count: 10});
         */
        var View = Class( /** @lends jsa.ui.View# */ {
            $statics: {
                _instances: [] // 모든 인스턴스를 갖고 있는다..
            },
            /**
             * 생성자
             * @param {String|Element|jQuery} el 해당 엘리먼트(노드, id, jQuery 어떤 형식이든 상관없다)
             * @param {Object} options 옵션값
             * @return {Mixes} false 가 반환되면, 이미 해당 엘리먼트에 해당 모듈이 빌드되어 있거나 disabled 상태임을 의미한다.
             */
            initialize: function (el, options) {
                options || (options = {});

                var me = this,
                    eventPattern = /^([a-z]+) ?([^$]*)$/i,
                    moduleName;

                if (!me.name) {
                    throw new Error('클래스의 이름이 없습니다');
                }

                moduleName = me.moduleName = me.name.replace(/^[A-Z]/, function (s) {
                    return s.toLowerCase();
                });
                me.$el = el instanceof jQuery ? el : $(el);
                // 강제로 리빌드 시킬 것인가
                if (options.rebuild === true) {
                    try {
                        me.$el.data(moduleName).destroy();
                    } catch (e) {}
                    me.$el.removeData(moduleName);
                } else {
                    // 이미 빌드된거면 false 반환
                    if (me.$el.data(moduleName)) {
                        return false;
                    }
                }

                // disabled상태면 false 반환
                if (me.$el.hasClass('disabled') || me.$el.attr('data-readony') === 'true' || me.$el.attr('data-disabled') === 'true') {
                    return false;
                }

                View._instances.push(me);

                me.el = me.$el[0]; // 원래 엘리먼트도 변수에 설정
                me.options = $.extend({}, me.defaults, options); // 옵션 병합
                me._uid = jsa.getUniqKey(); // 객체 고유 키
                me._eventNamespace = '.' + me.name + '_' + me._uid; // 객체 고유 이벤트 네임스페이스명
                me.subviews = {}; // 하위 컨트롤를 관리하기 위함

                // selectors 속성 처리
                // selectors: {
                //  box: 'ul',                        // => this.$box = this.$el.find('ul');
                //  items: 'ul>li.item'  // => this.$items = this.$el.find('ul>li.item');  
                // }
                me.options.selectors = $.extend({}, execObject(me.selectors, me), execObject(me.options.selectors, me));
                $.each(me.options.selectors, function (key, value) {
                    if (typeof value === 'string') {
                        me['$' + key] = me.$el.find(value);
                    } else if (value instanceof jQuery) {
                        me['$' + key] = value;
                    } else {
                        me['$' + key] = $(value);
                    }
                });

                // events 속성 처리
                // events: {
                //        'click ul>li.item': 'onItemClick', //=> this.$el.on('click', 'ul>li.item', this.onItemClick); 으로 변환   
                // }
                me.options.events = $.extend({}, execObject(me.events, me), execObject(me.options.events, me));
                $.each(me.options.events, function (key, value) {
                    if (!eventPattern.test(key)) {
                        return false;
                    }

                    var name = RegExp.$1,
                        selector = RegExp.$2,
                        args = [name],
                        func = isFn(value) ? value : (isFn(me[value]) ? me[value] : jsa.emptyFn);

                    if (selector) {
                        args[args.length] = $.trim(selector);
                    }

                    args[args.length] = function () {
                        func.apply(me, arguments);
                    };

                    me.on.apply(me, args);
                });

                // options.on에 지정한 이벤트들을 클래스에 바인딩
                $.each(me.options.on || {}, function (key, value) {
                    me.on(key, value);
                });

                // on으로 시작하는 속성명을 클래스에 이벤트로 바인딩. : onClick => me.on('click', onClick);
                $.each(me.options, function (key, value) {
                    if (!isFn(value)) {
                        return;
                    }

                    var m = key.match(/^on([a-z]+)$/i);
                    if (m) {
                        me.on((m[1] + "").toLowerCase(), value);
                    }
                });

            },

            /**
             * 파괴자
             */
            destroy: function () {
                var me = this;

                me.$el.removeData(me.moduleName);
                me.$el.off();
                // me.subviews에 등록된 자식들의 파괴자 호출
                $.each(me.subviews, function (key, item) {
                    item.destroy && item.destroy();
                });
            },

            /**
             * 옵션 설정함수
             *
             * @param {String} name 옵션명
             * @param {Mixed} value 옵션값
             */
            setOption: function (name, value) {
                this.options[name] = value;
            },

            /**
             * 옵션값 반환함수
             *
             * @param {String} name 옵션명
             * @param {Mixed} def 옵션값이 없을 경우 기본값
             * @return {Mixed} 옵션값
             */
            getOption: function (name, def) {
                return (name in this.options && this.options[name]) || def;
            },

            /**
             * 인자수에 따라 옵션값을 설정하거나 반환해주는 함수
             *
             * @param {String} name 옵션명
             * @param {Mixed} value {Optional} 옵션값: 없을 경우 name에 해당하는 값을 반환
             * @return {Mixed}
             * @example
             * $('...').tabs('option', 'startIndex', 2);
             */
            option: function (name, value) {
                if (typeof value === 'undefined') {
                    return this.getOption(name);
                } else {
                    this.setOption(name, value);
                    this.on('optionchange', [name, value]);
                }
            },

            /**
             * 이벤트명에 현재 클래스 고유의 네임스페이스를 붙여서 반환 (ex: 'click mousedown' -> 'click.MyClassName mousedown.MyClassName')
             * @private
             * @param {String} eventNames 네임스페이스가 없는 이벤트명
             * @return {String} 네임스페이스가 붙어진 이벤트명
             */
            _generateEventNamespace: function (eventNames) {
                if (eventNames instanceof $.Event) {
                    return eventNames;
                }

                var me = this,
                    m = (eventNames || "").match(/^(\w+)\s*$/);
                if (!m) {
                    return eventNames;
                }

                var name, tmp = [];
                for (var i = 1, len = m.length; i < len; i++) {
                    name = m[i];
                    if (!name) {
                        continue;
                    }
                    if (name.indexOf('.') === -1) {
                        tmp[tmp.length] = name + me._eventNamespace;
                    } else {
                        tmp[tmp.length] = name;
                    }
                }
                return tmp.join(' ');
            },

            /**
             * 현재 클래스의 이벤트네임스페이스를 반환
             * @return {String} 이벤트 네임스페이스
             */
            getEventNamespace: function () {
                return this._eventNamespace;
            },

            offEvents: function () {
                this.$el.off(this.getEventNamespace());
            },

            /**
             * me.$el에 이벤트를 바인딩
             */
            on: function () {
                var args = [].slice.call(arguments);
                args[0] = this._generateEventNamespace(args[0]);

                this.$el.on.apply(this.$el, args);
                return this;
            },

            /**
             * me.$el에 등록된 이벤트를 언바인딩
             */
            off: function () {
                var args = [].slice.call(arguments);
                this.$el.off.apply(this.$el, args);
                return this;
            },

            /**
             * me.$el에 일회용 이벤트를 바인딩
             */
            one: function () {
                var args = [].slice.call(arguments);
                args[0] = this._generateEventNamespace(args[0]);

                this.$el.one.apply(this.$el, args);
                return this;
            },

            /**
             * me.$el에 등록된 이벤트를 실행
             */
            trigger: function () {
                var args = [].slice.call(arguments);
                this.$el.trigger.apply(this.$el, args);
                return this;
            },

            /**
             * me.$el에 등록된 이벤트 핸들러를 실행
             */
            triggerHandler: function () {
                var args = [].slice.call(arguments);
                this.$el.triggerHandler.apply(this.$el, args);
                return this;
            },

            /**
             * 해당 엘리먼트에 바인딩된 클래스 인스턴스를 반환
             * @return {Class}
             * @example
             * var tabs = $('div').Tabs('instance');
             */
            instance: function () {
                return this;
            },

            /**
             * 해당 클래스의 소속 엘리먼트를 반환
             * @return {jQuery}
             */
            getElement: function () {
                return this.$el;
            }
        });

        return View;
    });

    jsa.define('ui.Layout', function () {
        /**
         *
         * @class
         * @name jsa.ui.Layout
         * @extends jsa.ui.View
         */
        var Layout = Class({
            name: 'CodeJLayout',
            $extend: jsa.ui.View,
            $statics: /** @lends jsa.ui.Layout*/ {
                /**
                                 * 해상도 타입별 사이즈 정의<br>
                                 * {<br>
                                        small: [0, 1280],<br>
                                        medium: [1281, 1360],<br>
                                        large: [1361, 1000000]<br>
                                 * }<br>
                                 * @static
                                 */
                SIZES: {
                    small: [0, 1280],
                    medium: [1281, 1360],
                    large: [1361, 1000000]
                },
                /**
                 * resizeEnd 이벤트명 : 리사이징이 끝났을 때 발생,<br>
                 * resize이벤트는 발생주기가 짧아, UI 재배치와 같은 로직이 있을 경우 상당한 reflow가 발생하는데,
                 * 리사이징 액션이 끝나는 시점을 체크하여 이때 비로소 UI적인 변화를 처리하게 하여
                 * reflow 발생을 최소화시키기 위해 만든 이벤트다.
                 * @static
                 */
                ON_RESIZE_END: 'resizeend',
                /**
                 * scrollEnd 이벤트명 : 스크롤링 도중 일정시간 동안 멈췄을 때 발생
                 * @static
                 */
                ON_SCROLL_END: 'scrollend',
                /**
                 * mediaQueryChange 이벤트명 : 미디어쿼리가 바뀌었을 때 발생
                 * @static
                 */
                ON_MEDIAQUERY_CHANGE: 'mediaquerychange'
            },
            /**
             * 싱글톤
             */
            $singleton: true,
            /**
             * 기본 옵션값
             * @property
             */
            defaults: {
                interval: 300
            },
            /**
             * 생성자
             * @param {String|Element|jQuery} el
             * @param {Object} options
             */
            initialize: function (el, options) {
                var me = this;

                // 부모 크래스 호출(필수)
                if (me.supr(el, options) === false) {
                    return;
                }

                me._initLayout();

                $(function () {
                    me.trigger('resize');
                    me.trigger(Layout.ON_RESIZE_END);
                });
            },


            /**
             * 이벤트 바인딩 등 초기화 작업 수행
             *
             * @private
             */
            _initLayout: function () {
                var me = this,
                    resizeTimer, scrollTimer,
                    prevMediaType = me.getWidthType();

                me.$el.off('.jkLayout').on('resize.jkLayout', function (e) {

                    //me.trigger('resize');
                    var w = $win.innerWidth();

                    if (resizeTimer) {
                        clearTimeout(resizeTimer);
                    }

                    // trigger resizeEnd : 리사이징 도중에 잠시 interval동안 멈췄을 때 발생
                    resizeTimer = setTimeout(function () {
                        me.trigger(me.constructor.ON_RESIZE_END);
                    }, me.options.interval);

                    // trigger mediaQueryChange
                    $.each(Layout.SIZES, function (key, size) {
                        var type = me.getWidthType(w);
                        if (prevMediaType != type) {
                            me.trigger(me.constructor.ON_MEDIAQUERY_CHANGE, [type, prevMediaType]);

                            prevMediaType = type;
                            return false;
                        }
                    });

                }).on('scroll.jkLayout', function (e) {

                    if (scrollTimer) {
                        clearTimeout(scrollTimer);
                    }

                    scrollTimer = setTimeout(function () {
                        // trigger scrollEnd : 스크롤링 도중에 잠시 interval동안 멈췄을 때 발생
                        me.trigger(me.constructor.ON_SCROLL_END);
                    }, me.options.interval);

                });
            },

            /**
             * 현재 브라우저의 해상도가 지정된 type인지 체크
             * @param {String} type small, medium, large, xlarge
             * @return {Boolean}
             */
            is: function (type) {
                return this.getWidthType() === type;
            },

            /**
             * 현재 브라우저 해상도의 type를 반환(small, medium, large)
             * @param {Number} w {Optional} width값, 없으면 현재 window의 width로 계산
             * @return {String} (small, medium, large, xlarge)
             */
            getWidthType: function (w) {
                var me = this,
                    size = !! w ? false : me.getWinSize(),
                    w = w || size.width,
                    hasOwn = jsa.hasOwn,
                    SIZES = Layout.SIZES;

                for (var name in SIZES) {
                    if (hasOwn(SIZES, name) && w > SIZES[name][0] && w <= SIZES[name][1]) {
                        return name;
                    }
                }
                return 'unknown';
            },

            /**
             * scrollTop값 반환
             * @return {Number}
             */
            getScrollTop: function () {
                return $win.scrollTop();
            },

            /**
             *  도큐먼트의 사이즈 반환
             * @return {Object} {width, height}
             */
            getDocSize: function () {
                return {
                    width: $doc.innerWidth(),
                    height: $doc.innerHeight()
                };
            },

            /**
             * 브라우저의 사이즈 반환
             * @return {Object} {width, height}
             */
            getWinSize: function () {
                return {
                    width: $win.innerWidth(),
                    height: $win.innerHeight()
                };
            }
        });

        return Layout;
    });


    jsa.define('ui.Modal', function () {
        var $doc = jsa.$doc;
        /**
         * 모달 클래스<br />
         * // 옵션 <br />
         * options.overlay:true 오버레이를 깔것인가<br />
         * options.clone: true        복제해서 띄울 것인가<br />
         * options.closeByEscape: true        // esc키를 눌렀을 때 닫히게 할 것인가<br />
         * options.removeOnClose: false        // 닫을 때 dom를 삭제할것인가<br />
         * options.draggable: true                                // 드래그를 적용할 것인가<br />
         * options.dragHandle: 'h1.title'                // 드래그대상 요소<br />
         * options.show: true                                        // 호출할 때 바로 표시할 것인가...
         *
         * @class
         * @name jsa.ui.Modal
         * @extends jsa.ui.View
         * @example
         */
        var Modal = Class( /** @lends jsa.ui.Modal# */ {
            $extend: jsa.ui.View,
            name: 'Modal',
            $statics: /** @lends jsa.ui.Modal */ {
                /**
                 * 모달 생성시 발생되는 이벤트
                 * @static
                 */
                ON_MODAL_CREATED: 'created',
                /**
                 * 모달 표시 전에 발생되는 이벤트
                 * @static
                 */
                ON_MODAL_SHOW: 'modalshow',
                /**
                 * 모달 표시 후에 발생되는 이벤트
                 * @static
                 */
                ON_MODAL_SHOWN: 'modalshown', // 표시 후
                /**
                 * 모달이 숨기기 전에 발생되는 이벤트
                 * @static
                 */
                ON_MODAL_HIDE: 'modalhide', // 숨기기 전
                /**
                 * 모달이 숨겨진 후에 발생되는 이벤트
                 * @static
                 */
                ON_MODAL_HIDDEN: 'modalhidden' // 숨긴 후
            },
            defaults: {
                overlay: true,
                clone: true,
                closeByEscape: true,
                removeOnClose: false,
                draggable: true,
                dragHandle: 'h1.title',
                show: true
            },

            events: {
                'click button[data-role]': function (e) {
                    var me = this,
                        $btn = $(e.currentTarget),
                        role = ($btn.attr('data-role') || ''),
                        e;

                    if (role) {
                        me.trigger(e = $.Event(role), [me]);
                        if (e.isDefaultPrevented()) {
                            return;
                        }
                    }

                    this.hide();
                },
                'click .d_close': function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    this.hide();
                }
            },
            /**
             * 생성자
             * @constructors
             * @param {String|Element|jQuery} el
             * @param {Object} options
             * @param {Boolean}  options.overlay:true 오버레이를 깔것인가
             * @param {Boolean}  options.clone: true        복제해서 띄울 것인가
             * @param {Boolean}  options.closeByEscape: true        // esc키를 눌렀을 때 닫히게 할 것인가
             * @param {Boolean}  options.removeOnClose: false        // 닫을 때 dom를 삭제할것인가
             * @param {Boolean}  options.draggable: true                                // 드래그를 적용할 것인가
             * @param {Boolean}  options.dragHandle: 'h1.title'                // 드래그대상 요소
             * @param {Boolean}  options.show: true                                        // 호출할 때 바로 표시할 것인가...
             */
            initialize: function (el, options) {
                var me = this;
                options = options || {};


                if (me.supr(el, options) === false) {
                    return;
                }

                // 열릴때 body로 옮겼다가, 닫힐 때 다시 원복하기 위해 임시요소를 넣어놓는다.
                me._createHolder();

                me.isShown = false;
                me._originalDisplay = me.$el.css('display');

                if (me.options.remote) {
                    me.$el.load(me.options.remote).done(function () {
                        me.options.show && me.show();
                    });
                } else {
                    me.options.show && me.show();
                }

                me.$el.on('mousewheel.modal', function (e) {
                    e.stopPropagation();
                });

                me.trigger('created');
            },

            /**
             * zindex때문에 모달을 body바로 위로 옮긴 후에 띄우는데, 닫을 때 원래 위치로 복구시켜야 하므로,
             * 원래 위치에 임시 홀더를 만들어 놓는다.
             * @private
             */
            _createHolder: function () {
                var me = this;

                if (me.$el.parent().is('body')) {
                    return;
                }

                me.$holder = $('<span class="d_modal_area" style="display:none;"></span>').insertAfter(me.$el);
                me.$el.appendTo('body');
            },
            /**
             * 원래 위치로 복구시키고 홀더는 제거
             * @private
             */
            _replaceHolder: function () {
                var me = this;

                if (me.$holder) {
                    me.$el.insertBefore(me.$holder);
                    me.$holder.remove();
                }
            },

            /**
             * 토글
             */
            toggle: function () {
                var me = this;

                me[me.isShown ? 'hide' : 'show']();
            },

            /**
             * 표시
             */
            show: function () {
                if (this.isShown && Modal.active === this) {
                    return;
                }

                Modal.close();
                Modal.active = this;

                var me = this,
                    e = $.Event('modalshow');

                me.$el.trigger(e);
                if (me.isShown || e.isDefaultPrevented()) {
                    return;
                }

                me.isShown = true;

                me.layout();
                me._escape();
                me._overlay();
                me._draggabled();
                me._enforceFocus();

                if (me.options.title) {
                    me.$el.find('h1.d_title').html(me.options.title || '알림');
                }

                me.$el.stop().addClass('d_modal_container')
                    .css({
                        position: 'fixed',
                        left: '50%',
                        top: '50%',
                        zIndex: 9900,
                        backgroundColor: '#ffffff',
                        outline: 'none',
                        backgroundClip: 'padding-box'
                    }).fadeIn('fast', function () {
                        me.$el.trigger('modalshown').focus();
                        me.layout();
                    });


                jsa.PubSub.trigger('hide:modal');

            },

            /**
             * 숨김
             */
            hide: function (e) {
                if (e) {
                    e.preventDefault();
                }

                var me = this;
                e = $.Event('modalhide');
                me.$el.trigger(e);
                if (!me.isShown || e.isDefaultPrevented()) {
                    return;
                }

                $doc.off('focusin.modal');
                me.$el.off('click.modal keyup.modal');

                me.isShown = false;
                me._escape();
                me.hideModal();

                me.$el.trigger('modalhidden');

                Modal.active = null;
            },

            /**
             * 뒷처리 담당
             */
            hideModal: function () {
                var me = this;
                me.$el.hide().removeData(me.moduleName).removeClass('d_modal_container');
                me.offEvents();
                me._replaceHolder();

                if (me.options.removeOnClose) {
                    me.$el.remove();
                }

                if (me.$overlay) {
                    me.$overlay.hide().remove(), me.$overlay = null;
                }
            },

            /**
             * 도큐먼트의 가운데에 위치하도록 지정
             */
            layout: function () {
                var me = this,
                    width = 0,
                    height = 0;

                me.$el.css({
                    'display': 'inline',
                    'position': 'fixed'
                });
                width = me.$el.width();
                height = me.$el.height();
                me.$el.css({
                    'display': ''
                });

                me.$el.css({
                    'width': width,
                    'marginTop': Math.ceil(height / 2) * -1,
                    'marginLeft': Math.ceil(width / 2) * -1
                });
            },

            /**
             * 타이틀 영역을 드래그기능 빌드
             * @private
             */
            _draggabled: function () {
                var me = this,
                    options = me.options;

                if (!options.draggable || me.bindedDraggable) {
                    return;
                }
                me.bindedDraggable = true;

                if (options.dragHandle) {
                    me.$el.find(options.dragHandle).css('cursor', 'move');
                    me.$el.draggable({
                        handle: options.dragHandle
                    });
                } else {
                    me.$el.draggable('cancel');
                }
            },

            /**
             * 모달이 띄워진 상태에서 탭키를 누를 때, 모달안에서만 포커스가 움직이게
             * @private
             */
            _enforceFocus: function () {
                var me = this;

                $doc
                    .off('focusin.modal')
                    .on('focusin.modal', me.proxy(function (e) {
                        if (me.$el[0] !== e.target && !$.contains(me.$el[0], e.target)) {
                            me.$el.find(':focusable').first().focus();
                            e.stopPropagation();
                        }
                    }));
            },

            /**
             * esc키를 누를 때 닫히도록
             * @private
             */
            _escape: function () {
                var me = this;

                if (me.isShown && me.options.closeByEscape) {
                    me.$el.off('keyup.modal').on('keyup.modal', me.proxy(function (e) {
                        e.which === 27 && me.hide();
                    }));
                } else {
                    me.$el.off('keyup.modal');
                }
            },

            /**
             * 오버레이 생성
             * @private
             */
            _overlay: function () {
                var me = this;

                me.$overlay = $('<div class="d_modal_overlay" />');
                me.$overlay.css({
                    'backgroundColor': '#ffffff',
                    'opacity': 0.6,
                    'position': 'fixed',
                    'top': 0,
                    'left': 0,
                    'right': 0,
                    'bottom': 0,
                    'zIndex': 9000
                }).appendTo('body');

                me.$overlay.off('click.modal').on('click.modal', function (e) {
                    if (e.target != e.currentTarget) {
                        return;
                    }
                    me.$overlay.off('click.modal');
                    me.hide();
                });
            },

            /**
             * 모달의 사이즈가 변경되었을 때 가운데위치를 재조절
             * @example
             * $('...').modal(); // 모달을 띄운다.
             * $('...').find('.content').html( '...');        // 모달내부의 컨텐츠를 변경
             * $('...').modal('center');        // 컨텐츠의 변경으로 인해 사이즈가 변경되었으로, 사이즈에 따라 화면가운데로 강제 이동
             */
            center: function () {
                this.layout();
            },

            /**
             * 닫기
             */
            close: function () {
                this.hide();
            },

            destroy: function () {
                var me = this;

                me.supr();
                me.$el.off('.modal').removeClass('d_modal_container');
                me.$overlay.add(me.$el).off('.modal').remove();
                $doc.off('.modal');
                $win.off('.jkModal');
            }
        });

        /**
         */
        Modal.close = function (e) {
            if (!Modal.active) return;
            if (e) e.preventDefault();
            Modal.active.hide();
            Modal.active = null;
        };

        // 모달모듈이 한번이라도 호출되면, 이 부분이 실행됨, 모달모듈이 단 한번도 사용안하는 경우도 있는데, 
        // 무조건 바인딩시켜놓는건 비효율적인 듯 해서 이와 같이 처리함
        Modal.onClassCreate = function () {

            jsa.PubSub.on('hide:modal', function (e, force) {
                if (force === false) {
                    if (Modal.active) {
                        Modal.close();
                    }
                }
            });

        };

        jsa.bindjQuery(Modal, 'modal');

        jsa.modal = function (el, options) {
            $(el).modal(options);
        };

        return Modal;

    });


    jsa.define('alert', function () {
        var Modal = jsa.ui.Modal;

        var tmpl = ['<div class="layer_popup small" style="display:none">',
            '<h1 class="title d_title">알림창</h1>',
            '<div class="cntt">',
            '<div class="d_content">',
            '</div>',
            '<div class="wrap_btn_c">',
            '<button type="button" class="btn_emphs_small" data-role="ok"><span><span>확인</span></span></button>',
            '</div>',
            '</div>',
            '<button type="button" class="btn_close d_close"><span>닫기</span></button>',
            '<span class="shadow"></span>',
            '</div>'
        ].join('');
        /**
         * 얼럿레이어
         * @memberOf jsa
         * @name alert
         * @function
         * @param {String} msg 얼럿 메세지
         * @param {JSON} options 모달 옵션
         * @example
         * jsa.alert('안녕하세요');
         */
        return function (msg, options) {
            if (typeof msg !== 'string' && arguments.length === 0) {
                options = msg;
                msg = '';
            };
            var el = $(tmpl).appendTo('body').find('div.d_content').html(msg).end();
            var modal = new Modal(el, options);
            return modal.on('modalhidden', function () {
                el.remove();
            });
        };
    });

    // ajaxModal
    jsa.define('ajaxModal', function () {
        /**
         * ajax 레이어
         * @memberOf jsa
         * @name ajaxModal
         * @function
         * @param {String} url url
         * @param {JSON} options ajax options
         * @example
         * jsa.ajaxModal('MP1.1.1.6T.2L_ajax.html');
         */
        return function (url, options) {
            var defer = $.Deferred();
            $.ajax($.extend({
                url: url
            }, options)).done(function (html) {
                defer.resolve();
                var $div = $(html.replace(/\n|\r/g, "")).appendTo('body');
                $div.modal().on('modalhidden', function () {
                    $div.remove();
                });
            }).fail(function () {
                defer.reject();
                jsa.alert('죄송합니다.<br>알수 없는 이유로 작업이 중단되었습니다.', {
                    title: '에러'
                });
            });
            return defer.promise();
        };
    });

    // confirm
    jsa.define('confirm', function () {
        var Modal = jsa.ui.Modal,
            Confirm = Class({
                name: 'Confirm',
                $extend: Modal,
                defaults: $.extend({}, Modal.prototype.defaults, {
                    modal: true,
                    containerCss: {
                        backgroundColor: '#fffff'
                    }
                })
            });

        var tmpl = ['<div class="layer_popup small" style="display:none">',
            '<h1 class="title d_title">확인창</h1>',
            '<div class="cntt">',
            '<div class="d_content">',
            '</div>',
            '<div class="wrap_btn_c">',
            '<button type="button" class="btn_emphs_small" data-role="ok"><span><span>확인</span></span></button>&nbsp;',
            '<button type="button" class="btn_emphs02_small d_close" data-role="cancel"><span><span>취소</span></span></button>',
            '</div>',
            '</div>',
            '<button type="button" class="btn_close d_close"><span>닫기</span></button>',
            '<span class="shadow"></span>',
            '</div>'
        ].join('');
        /**
         * 컨펌레이어
         * @memberOf jsa
         * @name confirm
         * @param {String} msg 컨펌 메세지
         * @param {JSON} options 모달 옵션
         * @example
         * jsa.confirm('안녕하세요', {
         *                onOk: function() {},
         *                onCancel: function() {}
         *        });
         */
        return function (msg, options) {
            if (typeof msg !== 'string' && arguments.length === 0) {
                options = msg;
                msg = '';
            };
            var el = $(tmpl).appendTo('body').find('div.d_content').html(msg).end();
            var modal = new Modal(el, options);
            return modal.on('modalhidden', function () {
                el.remove();
            });
        };
    });


    jsa.define('ui.Selectbox', function () {
        var $dropdown = $(),
            isIE7 = jsa.browser.isIE && jsa.browser.version <= 7;

        /**
         * 커스텀 셀렉트박스<br />
         * wrapClasses: ''<br />
         * disabledClass: 'disabled'<br />
         * bottomClass: 'bottomHover'<br />
         *
         * @class
         * @name jsa.ui.Selectbox
         * @extends jsa.ui.View
         */
        var Selectbox = Class( /** @lends jsa.ui.Selectbox# */ {
            name: 'Selectbox',
            $extend: jsa.ui.View,
            $statics: {
                /**
                 * @static
                 */
                ON_CHANGED: 'changed'
            },
            /**
             * 옵션
             * @property {JSON}
             */
            defaults: {
                wrapClasses: '',
                disabledClass: 'disabled',
                bottomClass: 'bottomHover'
            },
            /** 
             * 생성자
             * @param {jQuery|Node|String} el 대상 엘리먼트
             * @param {JSON} options {Optional} 옵션
             */
            initialize: function (el, options) {
                var me = this;
                if (me.supr(el, options) === false) {
                    return;
                }

                me._create();
            },

            _create: function () {
                var me = this,
                    cls = me.$el.attr('data-class') || 'select_type01',
                    timer = null;

                // 리스트 표시
                function openList() {
                    $dropdown = me.$list.show();
                    me.$selectbox.triggerHandler('openlist');
                }

                // 리스트 숨김
                function closeList() {
                    $dropdown.hide(), me.$selectbox.triggerHandler('closelist');
                }

                me.width = parseInt(me.$el.css('width'), 10);
                // 셀렉트박스
                me.$selectbox = $('<div class="' + cls + '"></div>').addClass(me.options.wrapClasses);
                // 레이블
                me.$label = $('<span class="select_box" tabindex="0" title="' + (me.$el.attr('title') || '셀렉트박스') + '"><span class="sel_r" style="width:190px;">&nbsp;</span></span>');

                /////// Label //////////////////////////////////////////////////////////////////////////////////////////
                me.$label.on('click', '.sel_r', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (me.$list != $dropdown) {
                        // 이미 열려있는 다른 셀렉트박스의 리스트가 있으면 닫는다.
                        closeList();
                    }

                    if (!me.$label.hasClass(me.options.disabledClass)) {
                        // 현재 셀렉트박스가 열려있으면 닫고, 닫혀있으면 열어준다.
                        if (me.$label.hasClass('open')) {
                            closeList();
                        } else {
                            openList()
                        }
                    }
                });
                // 키보드에 의해서도 작동되도록 바인딩
                !jsa.isTouch && me.$label.on('keydown', function (e) {
                    if (e.keyCode === 13) {
                        $(this).find('.sel_r').trigger('click');
                    } else if (e.keyCode === $.ui.keyCode.DOWN) {
                        openList();
                        me.$list.find(':focusable:first').focus();
                    }
                });
                me.$label.find('.sel_r').css('width', me.width);
                /////////////////////////////////////////////////////////////////////////////////////////////////////

                /////// List /////////////////////////////////////////////////////////////////////////////////////////
                me.$list = $('<div class="select_open" style="position:absolute;" tabindex="0"></div>');
                me.$list.hide().on('click', function (e) {
                    me.$list.focus();
                }).on('click', 'li>a', function (e) {
                    // 아이템을 클릭했을 때
                    e.preventDefault();
                    e.stopPropagation();

                    me.selectedIndex($(this).parent().index());
                    closeList();
                    me.$label.focus();
                });
                !jsa.isTouch && me.$list.on('keydown', 'li a', function (e) {
                    // 키보드의 위/아래 키로 이동
                    var index = $(this).parent().index(),
                        items = me.$list.find('li'),
                        count = items.length;

                    switch (e.keyCode) {
                    case $.ui.keyCode.UP:
                        e.stopPropagation();
                        e.preventDefault();
                        items.eq(Math.max(0, index - 1)).children().focus();
                        break;
                    case $.ui.keyCode.DOWN:
                        e.stopPropagation();
                        e.preventDefault();
                        items.eq(Math.min(count - 1, index + 1)).children().focus();
                        break;
                    }
                });
                //////////////////////////////////////////////////////////////////////////////////////////////////////
                me.$selectbox.insertAfter(me.$el.hide());
                me.$selectbox.append(me.$label);
                me.$selectbox.append(me.$list);

                me.$selectbox.on('openlist closelist', function (e) {
                    // 리스트가 열리거나 닫힐 때 zindex 처리
                    var zindexSelector = me.$el.attr('data-zindex-target'),
                        $zIndexTargets = zindexSelector ? me.$el.parents(zindexSelector) : false;

                    if (e.type === 'openlist') {
                        me.$label.addClass('open');
                        me.$el.closest('div.select_wrap').addClass('on');
                        $zIndexTargets && $zIndexTargets.addClass('on');

                        jsa.isTouch && $('body').on('touchend.selectbox', function () {
                            closeList();
                        });
                    } else {
                        me.$label.removeClass('open');
                        me.$el.closest('div.select_wrap').removeClass('on');
                        $zIndexTargets && $zIndexTargets.removeClass('on');
                        clearTimeout(timer), timer = null;

                        jsa.isTouch && $('body').off('touchend.selectbox');
                    }
                });

                // 비터치 기반일 때에 대한 이벤트 처리
                if (!jsa.isTouch) {
                    // 셀렉트박스에서 포커스가 벗어날 경우 자동으로 닫히게
                    me.$selectbox.on('focusin focusout', function (e) {
                        if (e.type === 'focusout' && me.$label.hasClass('open')) {
                            timer = setTimeout(function () {
                                closeList();
                            }, 600);
                        } else {
                            clearTimeout(timer);
                            timer = null;
                        }
                    }).on('keydown', function (e) {
                        if (e.keyCode === $.ui.keyCode.ESCAPE) {
                            closeList();
                            me.$label.focus();
                        }
                    });
                } else {
                    me.$selectbox.on('touchend', function (e) {
                        e.stopPropagation();
                    });
                }

                me.$el.on('change.selectbox', function (e) {
                    me.selectedIndex(this.selectedIndex, false);
                });

                me.$el.closest('form').on('reset', function () {
                    me.update();
                });

                me.update();
            },

            /** 
             * index에 해당하는 option항목을 선택
             *
             * @param {Number} index 선택하고자 하는 option의 인덱스
             * @param {Boolean} trigger change이벤트를 발생시킬 것인지 여부
             */
            selectedIndex: function (index, trigger) {
                if (arguments.length === 0) {
                    return this.$el[0].selectedIndex;
                }

                var me = this,
                    item = me.$el.find('option')
                        .prop('selected', false).removeAttr('selected')
                        .eq(index).prop('selected', true).attr('selected', 'selected');

                if (trigger !== false) {
                    me.$el.trigger('change', [index]);
                }

                me.$list.find('li').removeClass('on').eq(index).addClass('on');
                me.$label.children().text(item.text());
            },

            /** 
             * value 에 해당하는 option항목을 선택, 인자가 없을땐 현재 선택되어진 value를 반환
             *
             * @param {String} index 선택하고자 하는 option의 인덱스
             * @param {Boolean} trigger change이벤트를 발생시킬 것인지 여부
             * @return {String}
             * @example
             * &lt;select id="sel">&lt;option value="1">1&lt;/option>&lt;option value="2">2&lt;/option>&lt;/select>
             *
             * $('#sel').selectbox('value', 2);
             * value = $('#sel').selectbox('value'); // = $('#sel')[0].value 와 동일
             */
            value: function (_value) {
                var me = this;

                if (arguments.length === 0) {
                    return me.$el[0].options[me.$el[0].selectedIndex].value;
                } else {
                    $.each(me.$el[0].options, function (i, item) {
                        if (item.value == _value) {
                            me.selectedIndex(i);
                            return false;
                        }
                    });
                }
            },
            /** 
             * 동적으로 select의 항목들이 변경되었을 때, UI에 반영
             *
             * @example
             * &lt;select id="sel">&lt;option value="1">1&lt;/option>&lt;option value="2">2&lt;/option>&lt;/select>
             *
             * $('#sel')[0].options[2] = new Option(3, 3);
             * $('#sel')[0].options[3] = new Option(4, 4);
             * $('#sel').selectbox('update');
             */
            update: function () {
                var me = this,
                    html = '',
                    index = -1,
                    text = '';

                $.each(me.$el[0].options, function (i, item) {
                    if ($(item).prop('selected')) {
                        index = i;
                        text = item.text;
                    }
                    html += '<li><a href="#" data-value="' + item.value + '" data-text="' + item.text + '">' + item.text + '</a></li>';
                });
                me.$list.empty().html('<ul>' + html + '</ul>').find('li:eq(' + index + ')').addClass('on');
                me.$label.children().text(text);

                if (me.$el.prop(me.options.disabledClass)) {
                    me.$label.addClass(me.options.disabledClass).removeAttr('tabIndex');
                } else {
                    me.$label.removeClass(me.options.disabledClass).attr('tabIndex', 0);
                }
            },

            /**
             * 소멸자
             */
            destroy: function () {
                var me = this;

                me.supr();
                me.$label.off().remove();
                me.$list.off().remove();
                me.$el.unwrap('<div></div>');
                me.$el.off('change.selectbox').show();
            }
        });

        // 셀렉트박스 모듈이 한번이라도 호출되면, 이 부분이 실행됨, 셀렉트박스 모듈이 단 한번도 사용안하는 경우도 있는데, 
        // 무조건 바인딩시켜놓는건 비효율적인 듯 해서 이와 같이 처리함
        Selectbox.onClassCreate = function () {
            jsa.$doc.on('click.selectbox', function (e) {
                $dropdown.hide().trigger('closelist');
            });
        };

        jsa.bindjQuery(Selectbox, 'selectbox');
        return Selectbox;
    });

    jsa.define('ui.Dropdown', function () {

        var $dropdown = $();

        /**
         * 드롭다운 레이어
         * @class
         * @name jsa.ui.Dropdown
         * @extends jsa.ui.View
         * @example
         * // dropdown 옵션들
         * &lt;button data-control="dropdown">드롭다운 보이기&lt;/button>
         * &lt;div class="d_notpos" data-zindex-target="div.wrap">...&lt;/div>
         * //1. d_notpos 클래스 : 강제 위치 재조절에서 제외시키는 옵션
         * //2. data-zindex-target 속성: ie7이하에서는 position:absolute인 노드가 overflow:hidden영역을 못벗어나는 문제가 있는데,
         * // 이때 특정부모 노드의 zindex값도 같이 올려주어야 하므로 이 속성에다 부모 노드의 selector를 지정해 주면 된다.(,를 구분자로 여러개 지정 가능)
         */
        var Dropdown = Class( /** @lends jsa.ui.Dropdown# */ {
            name: 'Dropdown',
            $extend: jsa.ui.View,
            $statics: {
                ON_BEFORE_SHOW: 'beforeshow', // $.fn.showLayer에서 발생
                ON_SHOW: 'show', // $.fn.showLayer에서 발생
                ON_HIDE: 'hide' // $.fn.hideLayer에서 발생
            },
            defaults: {
                dropdownTarget: ''
            },
            /** 
             * 생성자
             * @param {jQuery|Node|String} el 대상 엘리먼트
             * @param {JSON} options {Optional} 옵션
             */
            initialize: function (el, options) {
                var me = this;

                if (me.supr(el, options) === false) {
                    return;
                }

                me.$dropdown = me.$el.attr('data-dropdown-target') ? $(me.$el.attr('data-dropdown-target')) : me.$el.next('div');
                me.$dropdown.addClass('d_layer').addClass('d_dropdown');

                me.$el.attr('aria-haspopup', 'true');
                me.on('mousedown keydown', me.toggle.bind(me));
                me.$el.add(me.$dropdown)
                    .on('keydown.dropdown', function (e) {
                        if (e.keyCode === $.ui.keyCode.ESCAPE) {
                            me.$dropdown.hideLayer({
                                focusOpener: true
                            });
                            return;
                        }
                    });

                me.$dropdown.on('click', '.d_close, .btn_close', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    me.$dropdown.hideLayer();
                }).on('click.dropdown', 'a', function (e) {
                    if (e.isDefaultPrevented()) {
                        return;
                    }

                    me.$dropdown.hideLayer();
                });
            },

            /**
             * 드롭다운 레이어를 띄울 때, $dropdown이 $el를 기준으로 가시영역 내에서 보이도록 위치를 재조절
             * @private
             * @param {jQuery} $el 드롭다운 버튼
             * @param {jQuery} $dropdown 드롭다운 레이어
             */
            _posInArea: function () {
                var $el = this.$el,
                    $dropdown = this.$dropdown,
                    $bullet = $dropdown.find('span[class^=bullet]'),
                    bulletClass = $dropdown.attr('data-ori-bullet') || $bullet.attr('class'),
                    hasBullet = $bullet.length > 0,
                    isNotPos = $dropdown.hasClass('d_notpos');

                if (isNotPos || !hasBullet) {
                    return;
                }

                var $con = (function ($c) {
                    return ($c.length === 0) ? jsa.$win : $c;
                })($el.closest('div.d_scrolldiv')),
                    isIE7 = jsa.browser.isIE7,
                    isWindow = !$con.hasClass('d_scrolldiv'),
                    isRelative = !isWindow && ($con.css('position') === 'relative'),
                    calcBullet = Number($bullet.css('display') !== 'none'),
                    css = {},
                    pos = $el.position(),
                    offset = $el.offset(),
                    conOffset = !isWindow ? $con.offset() : {
                        left: 0,
                        top: 0
                    },
                    scrollPos = {
                        top: $con.scrollTop(),
                        left: $con.scrollLeft()
                    },
                    conSize = {
                        width: $con.width(),
                        height: $con.height()
                    },
                    dropSize = {
                        width: $dropdown.outerWidth(),
                        height: $dropdown.outerHeight()
                    },
                    dropMargin = {
                        left: parseInt($dropdown.css('marginLeft'), 10),
                        top: parseInt($dropdown.css('marginTop'), 10)
                    },
                    btnSize = {
                        width: $el.outerWidth(),
                        height: $el.outerHeight()
                    },
                    bulletSize = hasBullet ? {
                        width: $bullet.width(),
                        height: $bullet.height()
                    } : {
                        width: 0,
                        height: 0
                    },
                    btnPaddingTop = parseInt($el.css('paddingTop'), 10),
                    btnBorder = isIE7 ? {
                        left: 0,
                        top: 0
                    } : {
                        left: parseInt($el.css('borderLeftWidth'), 10) | 0,
                        top: parseInt($el.css('borderTopWidth'), 10) | 0
                    },
                    btnMargin = isIE7 ? {
                        left: 0,
                        top: 0
                    } : {
                        left: parseInt($el.css('marginLeft'), 10),
                        top: parseInt($el.css('marginTop'), 10)
                    },
                    bulletTop = hasBullet ? 9 + Math.floor(bulletSize.height / 2) : 0;

                offset.top -= conOffset.top;
                offset.left -= conOffset.left;

                if (!isWindow && !isRelative) {
                    $con.css('position', 'relative');
                }
                $dropdown.css('marginTop', 0);

                $bullet[0].className = bulletClass;
                if (conSize.height + (scrollPos.top * Number(isWindow)) - 5 < offset.top + dropSize.height) {
                    if (bulletClass === 'bullet_vertical') {
                        if (isWindow) {
                            css.top = scrollPos.top + conSize.height - dropSize.height - offset.top - 5;
                            hasBullet && $bullet.css('top', pos.top - css.top + btnPaddingTop);
                            //console.log('isWindow', css.top);
                        } else {
                            css.top = conSize.height - dropSize.height - 5 - btnPaddingTop + dropMargin.top;
                            if (offset.top - css.top + bulletSize.height > dropSize.height) {
                                css.top += bulletSize.height;
                            }
                            hasBullet && $bullet.css('top', offset.top - css.top);
                            //console.log('not isWindow', css.top);
                        }
                    } else if (bulletClass === 'bullet_top') {
                        if (Math.abs(pos.top - dropSize.height - (9 * calcBullet)) < offset.top - scrollPos.top) {
                            hasBullet && $bullet.attr('class', 'bullet_bottom').css({
                                'top': '',
                                'bottom': -7
                            });
                            css.top = pos.top - dropSize.height - (9 * calcBullet);
                        }
                    } else if (bulletClass === 'bullet') {
                        hasBullet && $bullet.attr('class', 'bullet_bottom').css({
                            'top': '',
                            'bottom': -7,
                            'left': (dropSize.width / 2) - 6
                        });
                        css.top = pos.top - dropSize.height - (9 * calcBullet);
                    }
                } else {
                    if (bulletClass === 'bullet_vertical') {
                        hasBullet && $bullet.css('top', 9);
                        css.top = pos.top + Math.floor(btnSize.height / 2) - bulletTop;
                    } else if (bulletClass === 'bullet_top') {
                        hasBullet && $bullet.css({
                            'bottom': '',
                            'top': -7
                        });
                        css.top = pos.top + btnSize.height + (7 * calcBullet);
                    } else if (bulletClass === 'bullet') {
                        hasBullet && $bullet.css({
                            'bottom': '',
                            'top': -7,
                            'left': '50%'
                        });
                        css.top = pos.top + btnSize.height + (7 * calcBullet);
                    }
                }

                if (conSize.width + scrollPos.left < offset.left + btnSize.width + dropSize.width) {
                    if (bulletClass === 'bullet_vertical') { //174
                        css.left = pos.left - dropSize.width - (9 * calcBullet);
                        hasBullet && ($bullet[0].className = 'bullet_right');
                    } else if (bulletClass === 'bullet_top') {} else if (bulletClass === 'bullet') {
                        css.left = pos.left - Math.ceil((dropSize.width - btnSize.width) / 2);
                    }
                } else {
                    if (bulletClass === 'bullet_vertical') {
                        css.left = pos.left + btnSize.width + (9 * calcBullet);
                    } else if (bulletClass === 'bullet_top') {} else if (bulletClass === 'bullet') {
                        css.left = pos.left - Math.ceil((dropSize.width - btnSize.width) / 2);
                    }
                }

                if (!isWindow) {
                    css.top += btnPaddingTop;
                    css.top += scrollPos.top;
                }
                css.left -= dropMargin.left;
                css.top += btnBorder.top;

                $dropdown.attr('data-ori-bullet', bulletClass).css(css);
            },

            /** 
             * 토글(open &lt; - > close)
             * @param {$.Event} e 이벤트
             */
            toggle: function (e) {
                var me = this;
                if (e.type === 'keydown' && e.keyCode !== 13) {
                    return;
                }
                e.stopPropagation();
                if (me.$dropdown.hasClass('d_open')) {
                    me.close();
                } else {
                    me.open();
                }
            },

            /** 
             * 표시
             */
            open: function () {
                var me = this;
                if (me.$el.is('.disabled, :disabled')) {
                    return;
                }
                if (me.$dropdown.hasClass('d_open')) {
                    return;
                }

                me.$el.attr('aria-pressed', 'true');
                $dropdown.hideLayer();

                me._posInArea(me.$el, me.$dropdown);
                $dropdown = me.$dropdown.css({
                    'zIndex': 9999
                }).showLayer({
                    opener: me.$el
                });

            },

            /** 
             * 숨김
             */
            close: function () {
                var me = this;
                me.$el.attr('aria-pressed', 'false');
                me.$dropdown.hideLayer();
            },

            destroy: function () {
                var me = this;

                me.supr();
                me.$el.off('.dropdown');
                me.$dropdown.off('.dropdown');
            }
        });

        // 드롭다운 모듈이 한번이라도 호출되면, 이 부분이 실행됨, 드롭다운 모듈이 단 한번도 사용안하는 경우도 있는데, 
        // 무조건 바인딩시켜놓는건 비효율적인 듯 해서 이와 같이 처리함
        Dropdown.onClassCreate = function () {
            // ie7에서 드롭다운을 표시할 때 부모 엘리먼트의 zindex도 같이 올려주어야 한다.(data-zindex-target 속성에 부모엘리먼트를 지정)
            if (jsa.browser.isIE7) {
                $doc.on('beforeshow.dropdown hide.dropdown', 'div.d_layer', function (e) {
                    var $this = $(this),
                        attrTarget = $this.attr('data-zindex-target'),
                        zIndexTarget = attrTarget || 'td, li',
                        $target;

                    zIndexTarget = zIndexTarget ? zIndexTarget.split(/\s*,\s*/) : [];
                    for (var i = 0, len = zIndexTarget.length; i < len; i++) {
                        if (!zIndexTarget[i]) {
                            continue;
                        }

                        $target = $this.closest(zIndexTarget[i]);
                        if ($target.length > 0) {
                            $target.toggleClass('on', e.type === 'beforeshow');
                            if (!attrTarget) {
                                break;
                            } // 기본 셀렉터(td, li)일때에는 하나만 실행하기
                        }
                    }
                });
            }

            // 레이어 영역외에서 클릭할 때 닫히게 해준다.
            $doc.on('mousedown.dropdown keydown.dropdown', function (e) {
                if (e.type === 'keydown' && e.keyCode !== 13) {
                    return;
                }

                var $target = $(e.target),
                    $popup = $target.closest('div.d_open.d_layer');

                if ($popup.length === 0) {
                    $dropdown.not('[role=dialog]').hideLayer();
                }
                e.stopPropagation();
            });

            //
            jsa.PubSub.on('hide:modal', function () {
                $dropdown.not('[role=dialog]').hideLayer();
            });
        };

        jsa.bindjQuery(Dropdown, 'dropdown');
        return Dropdown;
    });

    jsa.define('ui.Tooltip', function () {

        /**
         * 툴팁 레이어
         * @class
         * @name jsa.ui.Tooltip
         * @extends jsa.ui.View
         */
        var Tooltip = Class({
            name: 'Tooltip',
            $extend: jsa.ui.View,
            defaults: {
                interval: 300
            },

            /** 
             * 생성자
             * @param {jQuery|Node|String} el 대상 엘리먼트
             * @param {JSON} options {Optional} 옵션
             */
            initialize: function (el, options) {
                var me = this;

                if (me.supr(el, options) === false) {
                    return;
                }

                me.$tooltip = (me.$el.attr('data-tooltip-target') ? $(me.$el.attr('data-tooltip-target')) : me.$el.next('div'));
                me.isShown = false;
                me.timer = null;

                // 마우스가 버튼위에서 .3초이상 머물었을 때만 툴팁이 표시되며, 
                // 마우스가 버튼과 툴팁박스를 완전히 벗어나서 .3초가 지났을 때만 툴팁이 사라지도록 처리 
                // 마우스가 닿을 때마다 보였다안보였다하는 건 너무 난잡해 보여서...
                me.on('focusin mouseenter', me.open.bind(me)).on('mouseleave focusout', me.close.bind(me));

                me.$tooltip.on('focusin.tooltip mouseenter.tooltip', function () {
                    if (me.$tooltip.data('timer')) {
                        clearTimeout(me.$tooltip.data('timer')), me.$tooltip.removeData('timer');
                    }
                }).on('focusout.tooltip mouseleave.tooltip', function () {
                    me.isShown && me.$tooltip.data('timer', setTimeout(function () {
                        me.isShown = false, me.$tooltip.hide();
                        if (me.$tooltip.data('timer')) {
                            clearTimeout(me.$tooltip.data('timer')), me.$tooltip.removeData('timer');
                        }
                    }, me.options.interval));
                });
            },
            /**
             * 표시
             */
            open: function () {
                var me = this,
                    offset = me.$el.offset();

                offset.top += me.$el.height();

                me.timer = setTimeout(function () {
                    me.$tooltip /*.css(offset)*/ .fadeIn('fast');
                    me.isShown = true;
                }, me.options.interval);
            },
            /**
             * 숨김
             */
            close: function () {
                var me = this;

                if (me.isShown) {
                    me.$tooltip.data('timer', setTimeout(function () {
                        me.isShown = false;
                        me.$tooltip.hide();
                    }, me.options.interval));
                } else {
                    clearTimeout(me.timer), me.timer = null;
                }
            },
            /**
             * 소멸자
             */
            destroy: function () {
                var me = this;

                me.supr();
                me.$tooltip.off('.tooltip').removeData('timer');
            }
        });

        jsa.bindjQuery(Tooltip, 'tooltip');
        return Tooltip;
    });

    jsa.define('ui.Carousel', function () {
        var $win = jsa.$win;

        /** 
         * 슬라이더
         * @class
         * @name jsa.ui.Carousel
         * @extends jsa.ui.View
         */
        var Carousel = Class( /** @lends jsa.ui.Carousel# */ {
            name: 'Carousel',
            $extend: jsa.ui.View,
            $statics: {
                ON_BEFORE_SLIDE: 'beforeslide',
                ON_AFTER_SLIDE: 'afterslide'
            },
            defaults: {
                orientation: 'horizontal',
                duration: 300,
                easing: 'ease-in-out',
                minItems: 1,
                start: 0,
                animate: true
            },
            selectors: {
                'sliderBox': '.d_slider_box',
                'panel': '.d_panel',
                'items': '.d_item',
                'prevArrow': '.d_prev',
                'nextArrow': '.d_next'
            },
            /** 
             * 생성자
             * @param {jQuery|Node|String} el 대상 엘리먼트
             * @param {JSON} options {Optional} 옵션
             */
            initialize: function (el, options) {
                var me = this;

                me.supr(el, options);

                me.itemsCount = me.$items.length;
                if (me.itemCount === 0) {
                    me._toggleControls('next', false);
                    me._toggleControls('prev', false);
                    me.destroy();
                    return;
                }

                me.current = me.options.start;
                me.isSliding = false;
                // transition
                me.support = !! jsa.transition;
                me.transEnd = me.support && jsa.transition.end;

                me._layout();
                me._configure();

                if (me.moveItemCount >= me.itemsCount) {
                    me._toggleControls('next', false);
                    me._toggleControls('prev', false);
                    me.destroy();
                    return;
                }

                me._bindEvent();
                me._slideToItem(me.current);

                me.trigger('ready');
            },

            /**
             * 동적으로 내부 컨텐츠가 변경되었을 때, UI를 갱신
             */
            update: function () {
                var me = this;

                me.itemsCount = me.$items.length;
                me._layout();
                me._configure();
            },

            /**
             * 이벤트 바인딩
             * @private
             */
            _bindEvent: function () {
                var me = this;

                $win.on(jsa.ui.Layout.ON_RESIZE_END + '.carousel', function () {
                    me._refresh();
                });

                me.$prevArrow.css('zIndex', 1000).on('click.carousel', function (e) {
                    e.preventDefault();
                    if (me.isSliding) {
                        return;
                    }

                    me._slide('prev');
                });

                me.$nextArrow.css('zIndex', 1000).on('click.carousel', function (e) {
                    e.preventDefault();
                    if (me.isSliding) {
                        return;
                    }

                    me._slide('next');
                });
            },

            /**
             * 레이아웃 사이즈 계산
             */
            _layout: function () {
                var me = this;
                var $img = me.$items.first();

                me.imgSize = {
                    width: $img.outerWidth(true),
                    height: $img.outerHeight(true)
                };

                me.$panel.css({
                    'width': me.$items.size() * me.imgSize.width
                });
            },

            /**
             * 아이템 카운팅
             * @private
             */
            _configure: function () {
                this.moveItemCount = Math.floor(this.$sliderBox.width() / this.imgSize.width);
            },

            /**
             * 좌우 버튼 활성화여부 설정
             * @private
             */
            _toggleControls: function (dir, display) {
                var me = this;

                if (display) {
                    (dir === 'next') ? me.$nextArrow.show() : me.$prevArrow.show();
                } else {
                    (dir === 'next') ? me.$nextArrow.hide() : me.$prevArrow.hide();
                }
            },

            /** 
             * 슬라이딩
             * @private
             */
            _slide: function (dir, pMoveWidth) {
                var me = this,
                    e;

                if (me.isSliding) {
                    return false;
                }

                me.trigger(e = $.Event('beforeslide'))
                if (e.isDefaultPrevented()) {
                    return false;
                };

                if (me.moveItemCount <= me.itemCount) {
                    return;
                }

                me.isSliding = true;

                var currentLeft = me.currentLeft,
                    options = me.options,
                    itemWidth = me.$items.outerWidth(true),
                    totalWidth = me.itemsCount * itemWidth,
                    visibleWidth = me.$sliderBox.width();

                if (pMoveWidth === undefined) {
                    var moveWidth = me.moveItemCount * itemWidth;

                    if (moveWidth < 0) {
                        return false;
                    }

                    if (dir === 'next' && totalWidth - (Math.abs(currentLeft) + moveWidth) < visibleWidth) {

                        moveWidth = totalWidth - (Math.abs(currentLeft) + visibleWidth);

                        me._toggleControls('next', false);
                        me._toggleControls('orev', true);

                    } else if (dir === 'prev' && Math.abs(currentLeft) - moveWidth < 0) {

                        moveWidth = Math.abs(currentLeft);

                        me._toggleControls('next', true);
                        me._toggleControls('prev', false);

                    } else {

                        var ftv = dir === 'next' ? Math.abs(currentLeft) + Math.abs(moveWidth) : Math.abs(currentLeft) - Math.abs(moveWidth);

                        me._toggleControls('prev', ftv > 0);
                        me._toggleControls('next', ftv < totalWidth - visibleWidth);

                    }

                    pMoveWidth = dir === 'next' ? currentLeft - moveWidth : currentLeft + moveWidth;

                } else {

                    var moveWidth = Math.abs(pMoveWidth);

                    if (Math.max(totalWidth, visibleWidth) - moveWidth < visibleWidth) {
                        pMoveWidth = -(Math.max(totalWidth, visibleWidth) - visibleWidth);
                    }

                    me._toggleControls('prev', moveWidth > 0);
                    me._toggleControls('next', Math.max(totalWidth, visibleWidth) - visibleWidth > moveWidth);

                }

                me.currentLeft = pMoveWidth;
                if (currentLeft === pMoveWidth) {
                    me._onEndTransition();
                    return false;
                }

                if (options.animate) {
                    me.$panel.animate({
                        left: pMoveWidth
                    }, {
                        duration: options.duration,
                        onComplete: function () {
                            me._onEndTransition();
                        }
                    });
                } else {
                    me.$panel.css('left', pMoveWidth);
                    me._onEndTransition();
                }

                if (!me.hasTransition) {
                    me._onEndTransition();
                }
            },

            /**
             * 슬라이딩이 끝났을 때 호출
             * @private
             */
            _onEndTransition: function () {
                var me = this;

                me.isSliding = false;
                me.trigger('afterslide');
            },

            /** 
             * 지정된 위치(left)로 슬라이딩
             * @private
             */
            _slideTo: function (pos) {

                var me = this,
                    pos = pos || me.current,
                    currentLeft = parseInt(me.$panel.css('left'), 10),
                    itemWidth = me.$items.outerWidth(true),
                    posR = currentLeft + me.$sliderBox.width(),
                    ftv = Math.abs(pos * itemWidth);

                if (ftv + itemWidth > posR || ftv < currentLeft) {
                    me._slideToItem(pos);
                }
            },

            /**
             * 지정된 위치(index)로 슬라이딩
             * @private
             */
            _slideToItem: function (pos) {
                var moveWidth = pos * this.$items.outerWidth(true);

                this._slide('', -moveWidth);
            },

            /**
             * 내부 아이템들이 동적으로 변경되었을 때 UI를 갱신
             * @private
             */
            _refresh: function () {
                var me = this,
                    currentLeft = me.currentLeft,
                    visibleWidth = me.$sliderBox.width(),
                    totalWidth = me.$panel.width();

                if (Math.abs(currentLeft) + visibleWidth > totalWidth) {
                    currentLeft = visibleWidth - totalWidth;
                }
                me._configure();
                me._slide('prev', currentLeft);
            },

            /**
             * 지정된 index의 항목으로 슬라이딩
             */
            activateItem: function (index) {
                var me = this;

                me.$items.removeClass('on').eq(index).addClass('on');

                var centerCount = Math.floor(me.moveItemCount / 2),
                    startIndex = index - centerCount,
                    startLeft = startIndex * me.itemWidth;

                if (index >= centerCount && index <= (me.itemCount - centerCount)) {
                    me.$panel.css('left', -startLeft);
                } else {
                    var perCount = Math.ceil(me.itemCount / me.moveItemCount);
                    me._slide(Math.ceil(index / perCount));
                }
            },

            /**
             * 소멸자
             */
            destroy: function () {
                var me = this;

                me.supr();
                WENSVC.$win.off('.carousel');
                me.$panel.off(me.transEnd).off('swipeleft swiperight swipeup wipedown');
                me.$prevArrow.off('click.carousel');
                me.$nextArrow.off('click.carousel');
            }

        });

        jsa.bindjQuery(Carousel, 'carousel');

        return Carousel;
    });

    jsa.define('ui.Expander', function () {

        /** 
         * 확장기능 클래스
         * @class
         * @name jsa.ui.Expander
         * @extends jsa.ui.View
         *
         * @example
         * // 지원속성: data-expand-target="#해당요소의 id" // 확장 요소
         */
        var Expander = Class( /** @lends jsa.ui.Expander# */ {
            name: 'Expander',
            $extend: jsa.ui.View,
            $statics: {
                ON_COLLAPSE: 'collapse', // 확장될 때 발생
                ON_EXPAND: 'expand' // 축소될 때 발생
            },
            defaults: {
                interval: 300
            },
            /** 
             * 생성자
             * @param {jQuery|Node|String} el 대상 엘리먼트
             * @param {JSON} options {Optional} 옵션
             */
            initialize: function (el, options) {
                var me = this,
                    $target;

                if (me.supr(el, options) === false) {
                    return;
                }
                if (me.$el.hasClass('disabled')) {
                    return;
                }

                $target = me.$target = me.$el.attr('data-expand-target') ? $(me.$el.attr('data-expand-target')) : me.$el.next('.d_expand');
                if ($target.size() === 0) {
                    return;
                }

                me.on('click', function (e) {
                    e.preventDefault();
                    var $this = $(this),
                        evt,
                        isExpand = $this.hasClass('on');

                    evt = $.Event(isExpand ? 'collapse' : 'expand');
                    me.trigger(evt);
                    if (evt.isDefaultPrevented()) {
                        return;
                    }

                    $this.toggleClass('on', !isExpand);
                    $target.toggle(isExpand);
                });
            },

            /**
             * 토글
             */
            toggle: function () {
                this.trigger('click');
            },

            destroy: function () {
                var me = this;

                me.supr();
            }
        });

        jsa.bindjQuery(Expander, 'expander');

        return Expander;
    });

    jsa.define('ui.Exposer', function () {
        // 펼침기능 베이스클래스
        var BaseExpose = Class({
            initialize: function (el, options) {
                var me = this;

                me.$el = $(el);
                me.options = $.extend({}, me.defaults, me.$el.data(), options);
                me.init();
                me._init();
            },
            _init: function () {
                var me = this;
                me.$el.on('click.expose', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    me.toggle();
                });
            },

            init: function () {},

            expose: function () {},

            unexpose: function () {},

            destroy: function () {
                var me = this;

                me.supr();
                me.$el.off('.expose');
            }
        });

        // show/hide 조절방식의 expose
        var DisplayExpose = Class({
            $extend: BaseExpose,
            defaults: {
                moreClass: 'more',
                exposeClass: 'on'
            },
            init: function () {
                var me = this;
                me.$target = me.$el.attr('data-expose-target') ? $(me.$el.attr('data-expose-target')) : me.$el.siblings('div.text');
            },

            toggle: function () {
                var me = this,
                    evt,
                    isExpose = me.$el.hasClass(me.options.moreClass);

                evt = $.Event(isExpose ? 'expose' : 'unexpose');
                me.$el.trigger(evt, [me.$target[0]]);
                if (evt.isDefaultPrevented()) {
                    return;
                }

                if (isExpose) {
                    me.expose();
                } else {
                    me.unexpose();
                }
            },

            expose: function () {
                var me = this;
                me.$target.addClass(me.options.exposeClass);
                me.$target.attr('tabindex', 0).focus();
            },

            unexpose: function () {
                var me = this;
                me.$target.removeClass(me.options.exposeClass);
                me.$target.find('button.more').focus();
            }
        });

        // height 조절방식의 expose
        var HeightExpose = Class({
            $extend: BaseExpose,
            defaults: {
                exposeClass: 'ws_normal',
                downClass: 'arrow_d',
                upClass: 'arrow_u'
            },
            init: function () {
                //console.log(this.options);
                var me = this;
                me.$target = me.$el.attr('data-expose-target') ? $(me.$el.attr('data-expose-target')) : me.$el.closest('.d_expose');
                me.$el.hasClass(me.options.downClass) && me.$target.data('old_height', parseInt(me.$target.css('height'), 10));
            },

            toggle: function () {
                var me = this,
                    evt,
                    isExpose = me.$el.hasClass(me.options.downClass);

                evt = $.Event(isExpose ? 'expose' : 'unexpose');
                me.$el.trigger(evt, [me.$target[0]]);
                if (evt.isDefaultPrevented()) {
                    return;
                }

                if (isExpose) {
                    me.expose();
                } else {
                    me.unexpose();
                }
            },

            expose: function () {
                var me = this;
                me.$target.css('height', 'auto');
                me.$target.addClass(me.options.exposeClass);
                me.$el.replaceClass(me.options.downClass, me.options.upClass).html('<span class="text">접기</span> <span class="icon"></span>').attr('title', function () {
                    return this.title.replace('더보기', '접기');
                });
            },

            unexpose: function (isExpose) {
                var me = this;
                me.$target.css('height', me.$target.data('old_height'));
                me.$target.removeClass(me.options.exposeClass);
                me.$el.replaceClass(me.options.upClass, me.options.downClass).html('<span class="text">더보기</span> <span class="icon"></span>').attr('title', function () {
                    return this.title.replace('접기', '더보기');
                });
            }
        });

        /**
         * 펼침기능 클래스
         * @class
         * @name jsa.ui.Exposer
         * @extends jsa.ui.View
         *
         * @example
         * data-expose-type="height/display", data-expose-target="#id"
         */
        var Exposer = Class( /** @lends jsa.ui.Exposer# */ {
            name: 'Exposer',
            $statics: {
                ON_EXPOSE: 'expose',
                ON_UNEXPOSE: 'unexpose'
            },
            /** 
             * 생성자
             * @param {jQuery|Node|String} el 대상 엘리먼트
             * @param {JSON} options {Optional} 옵션
             */
            initialize: function (el, options) {
                options || (options = {});

                var me = this,
                    exposeType = $(el).attr('data-expose-type') || options.exposeType || 'height';

                if (exposeType === 'height') {
                    me.exposer = new HeightExpose(el, options);
                } else {
                    me.exposer = new DisplayExpose(el, options);
                }
            },

            /**
             * 토글(expose or unexpose)
             */
            toggle: function () {
                this.exposer.toggle();
            },

            /**
             * 펼치기
             */
            expose: function () {
                this.exposer.expose();
            },

            /**
             * 닫기
             */
            unexpose: function () {
                this.exposer.unexpose();
            },

            /**
             * 소멸자
             */
            destroy: function () {
                var me = this;

                me.exposer.destroy();
            }
        });

        jsa.bindjQuery(Exposer, 'exposer');

        return Exposer;
    });


    jsa.define('ui.Placeholder', function () {
        /**
         * placeholder를 지원하지 않는 IE7~8상에서 placeholder효과를 처리하는 클래스
         * @class
         * @name jsa.ui.Placeholder
         * @extends jsa.ui.View
         * @example
         * new jsa.Placeholder( $('input[placeholder]'), {});
         * // 혹은 jquery 플러그인 방식으로도 호출 가능
         * $('input[placeholder]').placeholder({});
         */
        var Placeholder = Class( /** @lends jsa.ui.Placeholder# */ {
            name: 'Placeholder',
            $extend: jsa.ui.View,
            defaults: {
                foreColor: ''
            },
            /**
             * 생성자
             * @param {String|Element|jQuery} el 해당 엘리먼트(노드, id, jQuery 어떤 형식이든 상관없다)
             * @param {Object} options 옵션값
             */
            initialize: function (el, options) {
                var me = this,
                    is = 'placeholder' in jsa.tmpInput;

                if (is) {
                    return;
                }

                if (me.supr(el, options) === false) {
                    return;
                }
                me.placeholder = me.$el.attr('placeholder');
                me._foreColor = me.options.foreColor;

                var isPassword = me.$el.attr('type') === 'password';

                me.on('focusin click', function () {
                    if ($.trim(this.value) === me.placeholder || !$.trim(this.value)) {
                        me.$el.removeClass(me._foreColor);
                        if (isPassword) {
                            me.$el.removeClass('placeholder');
                        }
                        this.value = '';
                    }
                }).on('focusout', function () {
                    if (this.value === '' || this.value === me.placeholder) {
                        if (isPassword) {
                            me.$el.val('').addClass('placeholder');
                        } else {
                            me.$el.val(me.placeholder).addClass(me._foreColor);
                        }
                    }
                }).triggerHandler('focusout');
            },

            /**
             * placeholder 갱신(only ie9 이하)
             */
            update: function () {
                var me = this;
                me.$el.val(me.placeholder);
            },

            /**
             * 파괴자 : 자동으로 호출되지 않으므로, 필요할 때는 직접 호출해주어야 한다.
             */
            destroy: function () {
                var me = this;

                me.$el.removeData();
                me.supr();
            }
        });

        // 플레이스홀더 모듈이 한번이라도 호출되면, 이 부분이 실행됨, 플레이스홀더 모듈이 단 한번도 사용안하는 경우도 있는데, 
        // 무조건 바인딩시켜놓는건 비효율적인 듯 해서 이와 같이 처리함
        Placeholder.onClassCreate = function () {
            if (!('placeholder' in jsa.tmpInput)) {
                $doc.on('submit.placeholder', 'form', function (e) {
                    $('input[placeholder], textarea[placeholder]').each(function () {
                        if ($(this).attr('placeholder') === this.value) {
                            $(this).removeClass(Placeholder.prototype.defaults.foreColor);
                            this.value = '';
                        }
                    });
                });
            }

        };

        jsa.bindjQuery(Placeholder, 'placeholder');
        return Placeholder;
    });

    jsa.define('ui.TextCounter', function () {
        var browser = jsa.browser,
            byteLength = jsa.string.byteLength,
            charsByByte = jsa.string.charsByByte;

        /**
         * 입력제한 기능을 담당하는 클래스
         * @class
         * @name jsa.ui.TextCounter
         * @extends jsa.ui.View
         * @example
         * new jsa.TextCounter( $('input.d_textcounter'), {});
         * // 혹은 jquery 플러그인 방식으로도 호출 가능
         * $('input.d_textcounter').textcounter({});
         */
        var TextCounter = Class( /** @lends jsa.ui.TextCounter# */ {
            name: 'TextCounter',
            $extend: jsa.ui.View,
            $statics: {
                ON_TEXTCOUNT_CHANGE: 'textcounterchange' // 글자수가 변경되었을 때 발생
            },
            defaults: {
                countType: 'byte',
                limit: 100 // 최대 글자 수(바이트)
            },

            /**
             * 생성자
             * @param {String|Element|jQuery} el 해당 엘리먼트(노드, id, jQuery 어떤 형식이든 상관없다)
             * @param {Object} options 옵션값
             */
            initialize: function (el, options) {
                this.supr(el, options);

                var me = this;

                me.currentLength = 0;
                me.placeholder = 'placeholder' in jsa.tmpInput ? '' : me.$el.attr('placeholder');

                if (jsa.browser.isGecko) {
                    me._forceKeyup();
                }

                me.on('keydown keyup cut paste blur', function (e) {
                    var isOver = me._checkLimit();

                    if (e.type === 'keyup') {
                        if (isOver) {
                            alert('입력하신 글자 수가 초과되었습니다.');
                            this.focus();
                        }
                    }
                    me.trigger('textcounterchange', [me.currentLength]);
                });
                me._checkLimit();
                me.trigger('textcounterchange', [me.currentLength]);
            },

            /**
             * str의 길이 계산(options.countType이 char일 땐, 글자수, byte일땐 바이트수로 계산)
             */
            textLength: function (str) {
                var me = this;

                if (me.options.countType === 'byte') {
                    return byteLength(str);
                }
                return (str || '').length;
            },

            /**
             */
            _checkLimit: function () {
                var me = this,
                    o = me.options,
                    isOver = false;

                me.currentLength = me.textLength(me.$el[0].value);
                if (me.currentLength > o.limit) {
                    me._truncateValue();
                    isOver = true;
                }
                return isOver;
            },

            /**
             * 텍스트박스의 문자열이 제한길이를 초과했을 경우, 자르는 역할을 담당
             * @private
             */
            _truncateValue: function () {
                var me = this,
                    $el = me.$el,
                    value = browser.isOldIE && $el[0].value === me.placeholder ? '' : $el[0].value,
                    limit = me.options.limit,
                    chars = 0;

                if (limit === 0) {
                    $el[0].value = me.placeholder;
                    me.currentLength = limit;
                } else if (limit < me.currentLength) {
                    chars = (me.options.countType === 'byte' ? charsByByte(value, limit) : limit);
                    $el[0].blur();
                    $el[0].value = value.substring(0, chars);
                    $el[0].focus();
                    me.currentLength = limit;
                }
            },

            /**
             * 파이어폭스에서 한글을 입력할 경우, keyup이벤트가 발생하지 않는 버그가 있어서,
             * timeout를 이용하여 value값이 변경됐을 때 강제로 keyup를 이벤트 날려주는 로직을 설정하는 함수
             * @private
             */
            _forceKeyup: function () {
                // 파이어폭스에서 한글을 입력할 때 keyup이벤트가 발생하지 않는 버그가 있어서 
                // 타이머로 value값이 변경된걸 체크해서 강제로 keyup 이벤트를 발생시켜 주어야 한다.
                var me = this,
                    $el = me.$el,
                    el = $el[0],
                    prevValue,
                    win = window,
                    doc = document,

                    // keyup 이벤트 발생함수: 크로스브라우징 처리
                    fireEvent = (function () {
                        if (doc.createEvent) {
                            // anti ie
                            return function () {
                                var e;
                                if (win.KeyEvent) {
                                    e = doc.createEvent('KeyEvents');
                                    e.initKeyEvent('keyup', true, true, win, false, false, false, false, 65, 0);
                                } else {
                                    e = doc.createEvent('UIEvents');
                                    e.initUIEvent('keyup', true, true, win, 1);
                                    e.keyCode = 65;
                                }
                                el.dispatchEvent(e);
                            };
                        } else {
                            // ie: :(
                            return function () {
                                var e = doc.createEventObject();
                                e.keyCode = 65;
                                el.fireEvent('onkeyup', e);
                            };
                        }
                    })();

                me.timer = null;

                me.on('focus', function () {
                    if (me.timer) {
                        return;
                    }
                    me.timer = setInterval(function () {
                        if (prevValue !== el.value) {
                            prevValue = el.value;
                            fireEvent();
                        }
                    }, 60);
                }).on('blur', function () {
                    if (me.timer) {
                        clearInterval(me.timer);
                        me.timer = null;
                    }
                });
            },

            /**
             * 파괴자 : 자동으로 호출되지 않으므로, 필요할 땐 직접 호출해주어야 한다.
             */
            destroy: function () {
                var me = this;

                me.timer && clearInterval(me.timer);
                me.supr();
            }
        });

        jsa.bindjQuery(TextCounter, 'textCounter');
        return TextCounter;
    });

    jsa.define('ui.TextControl', function () {
        /**
         * textarea, input에서 글자수 체크 및 자동리사이징 처리를 담당하는 클래스
         * @class
         * @name jsa.ui.TextControl
         * @extends jsa.ui.View
         * @example
         * new jsa.ui.TextControl( $('textarea'), {counting: true});
         * // or
         * $('textarea').textControl({counting: true});
         */
        var TextControl = Class( /** @lends jsa.ui.TextControl# */ {
            name: 'TextControl',
            $extend: jsa.ui.View,
            $statics: {
                ON_INIT: 'init',
                ON_CHANGE: 'textcontrolchange'
            },
            defaults: {
                counting: false,
                limit: 100,
                limitTarget: '',
                autoResize: false,
                allowPaste: false
            },
            /**
             * 생성자
             * @param {String|Element|jQuery} el 해당 엘리먼트(노드, id, jQuery 어떤 형식이든 상관없다)
             * @param {Object} options 옵션값
             */
            initialize: function (el, options) {
                var me = this;

                if (me.supr(el, options) === false) {
                    return;
                }

                me._initTextControl();
                me.trigger(TextControl.ON_INIT);
            },

            /**
             * 초기화 작업
             * @private
             */
            _initTextControl: function () {
                var me = this,
                    o = me.options;

                // 붙여넣기 
                if (!o.allowPaste) {
                    me.on('paste', function (e) {
                        e.preventDefault();
                        alert("죄송합니다. \n도배글 등을 방지하기 위해 붙여넣기를 하실 수 없습니다.");
                    });
                }

                // 자동 리사이징
                if (me.$el.is('textarea') && o.autoResize) {
                    me._autoResize();
                }

                // 입력글자 수 체크
                if (o.counting) {
                    // subviews에다 설정하면 destroy가 호출될 때, subviews에 들어있는 컨트롤들의 destroy도 알아서 호출해준다.
                    me.textCounter = me.subviews.counter = new jsa.ui.TextCounter(me.$el, {
                        countType: o.countType,
                        limit: o.limit,
                        on: {
                            'textcounterchange': (function () {
                                var $limitTarget = $(me.options.limitTarget);
                                return function (e, len) {
                                    $limitTarget.html('<strong>' + len + '</strong> / ' + o.limit + '자');
                                };
                            }())
                        }
                    });
                }
            },

            /**
             * 텍스트박스의 리사이징을 위한 초기화 작업 담당
             * @private
             */
            _autoResize: function () {
                var me = this,
                    isOldIE = jsa.browser.isOldIE,
                    $clone, oriHeight, offset = 0;


                me.$el.css({
                    overflow: 'hidden',
                    resize: 'none' /*, height: 'auto'*/
                });

                $clone = isOldIE ? me.$el.clone().removeAttr('name').removeAttr('id').addClass('d_tmp_textarea').val('').appendTo(me.$el.parent()) : me.$el;
                oriHeight = $clone.height();
                $clone[0].scrollHeight; // for ie6 ~ 8

                if ($clone[0].scrollHeight !== oriHeight) {
                    offset = $clone.innerHeight() - oriHeight;
                }
                isOldIE && $clone.hide();

                me.on('keyup change input paste focusin focusout', function () {
                    this._layout(this, this.$el, $clone, oriHeight, offset);
                }.bind(me));
                me._layout(me, me.$el, $clone, oriHeight, offset);
            },

            /**
             * 텍스트박스의 scrollHeight에 따라 height를 늘려주는 역할을 담당
             * @private
             */
            _layout: function (me, $el, $clone, initialHeight, offset) {
                var current = $el.val(),
                    prev = me.prevVal,
                    isOldIE = jsa.browser.isOldIE,
                    scrollHeight, height;

                if (current === prev) {
                    return;
                }
                me.prevVal = current;

                $clone.css('height', '');
                isOldIE && $clone.val(current).show()[0].scrollHeight; // for IE6-8
                scrollHeight = $clone[0].scrollHeight;
                height = scrollHeight - offset;
                isOldIE && $clone.hide();

                $el.height(height = Math.max(height, initialHeight));
                me.triggerHandler(TextControl.ON_CHANGE, [height]);
            },

            /**
             * 파괴자 : 자동으로 호출되지 않으므로, 직접 호출해주어야 한다.
             */
            destroy: function () {
                var me = this;

                me.supr();
            }
        });

        jsa.bindjQuery(TextControl, 'textControl');

        return TextControl;
    });

    jsa.define('ui.FormValidator', function () {
        var ruleRegex = /^(.+?)\(([^\)]+)\)?$/,
            numericRegex = /^[0-9]+$/,
            integerRegex = /^\-?[0-9]+$/,
            floatRegex = /^\-?[0-9]*\.?[0-9]+$/,
            emailRegex = /[\S]+@[\w-]+(.[\w-]+)+/,
            alphaRegex = /^[a-z]+$/i,
            alphaNumericRegex = /^[a-z0-9]+$/i,
            alphaDashRegex = /^[a-z0-9_\-]+$/i,
            numberRegex = /^[1-9][0-9]+$/i,
            numericDashRegex = /^[0-9\-]+$/,
            urlRegex = /^(http|https|ftp)\:\/\/[a-z0-9\-\.]+\.[a-z]{2,3}(:[0-9]*)?\/?[a-z0-9\-\._\?\,\'\/+&amp;%\$#\=~]*$/i,
            phoneRegex = /^[0-9]{2,4}\-?[0-9]{3,4}\-?[0-9]{4}$/i,
            korRegex = /^[가-힝]+$/;

        var messages = {
            required: '필수입력 항목입니다.',
            match: '동일한 값이어야 합니다.',
            email: '이메일 형식이 잘못 되엇습니다.',
            url: 'URL 형식이 잘못 되었습니다.',
            min_chars: '유효하지 않은 길이입니다.',
            max_chars: '유효하지 않은 길이입니다.',
            exact_chars: '유효하지 않은 길이입니다.',
            alpha: '유효하지 않은 값입니다.',
            alpha_numeric: '유효하지 않은 값입니다.',
            numeric: '유효하지 않은 값입니다.',
            integer: '유효하지 않은 값입니다.',
            decimal: '유효하지 않은 값입니다.(예: -0.2)',
            kor: '한글만 입력해 주세요.',
            file_exts: '유효하지 않은 확장자입니다.',
            ssn: '잘못된 주민등록번호입니다.'
        };

        /**
         * 폼밸리데이터
         * @class
         * @name jsa.FormValidator
         */
        var FormValidator = Class( /** @lends jsa.FormValidator# */ {
            name: 'Validator',
            defaults: {},
            /**
             * 생성자
             * @param {jQuery} el 노드
             * @param {Object} options 옵션
             */
            initialize: function (el, options) {
                var me = this;

                me.$el = el instanceof jQuery ? el : $(el);
                me.options = $.extend({}, me.defaults, options);
                me.messages = me.handlers = {};
                me.fields = me.errors = {};

                // ready
                $.each(me.$el[0].elements, function (i, eitem) {
                    var $item = $(eitem),
                        rules;
                    if (!$item.is(':disabled, :hidden') && (rules = $item.attr('data-valid-rules'))) {
                        me.fields[$item.attr('name')] = rules;
                    }
                });
                me.fields = $.extend(me.fields, me.options.fields || {});
            },

            _clearPlaceholder: function () {
                var me = this,
                    elems = me.$el[0].elements,
                    ph;

                for (var i = 0, el; el = elements[i++];) {
                    if ((ph = el.getAttribute('placeholder')) && ph === el.value) {
                        el.value = '';
                    }
                }
            },

            _generateRule: function (rule) {
                var pairs = ruleRegex.exec(rule);

                return {
                    name: pairs && pairs[1] || rule,
                    params: (pairs && pairs[2] && pairs[2].replace(/\s/g, '').split(',')) || []
                };
            },

            /**
             * 실행
             * @return {Boolean}
             */
            run: function () {
                return this._validate();
            },

            _validate: function (e) {
                var me = this,
                    fields = me.fields,
                    els = me.$el[0].elements,
                    rules, rule, el;

                for (var name in fields) {
                    if (fields.hasOwnProperty(name)) {
                        rules = fields[name].split('|');
                        for (var i = 0, len = rules.length; i < len; i++) {
                            rule = me._generateRule(rules[i]), el = els[name];
                            if (me._valid[rule.name] && (me._valid[rule.name].apply(me, [el].concat(rule.params)) === false)) {
                                messages[rule.name] && alert(messages[rule.name]);
                                el.focus();
                                el.select();
                                return false;
                            }
                        }
                    }
                }
            },

            /** 
             * @namespace
             * @name jsa.FormValidator._valid
             */
            _valid: /** @lends jsa.FormValidator._valid */ {
                /**
                 * 필수입력 체크
                 * @param {Node} el 인풋박스
                 * @return {Boolean}
                 */
                required: function (el) {
                    var val = el.value,
                        form = el.form;

                    if (el.type === 'checkbox' || el.type === 'radio') {
                        return el.checked === true;
                    }

                    return !!val;
                },
                /**
                 * 인자로 받은 두 인풋의 값이 동일한가 체크
                 * @param {Node} el 인풋박스
                 * @param {Node} targetName 인풋박스
                 * @return {Boolean}
                 */
                match: function (el, targetName) {
                    var target = el.form[targetName];
                    if (target) {
                        return el.value === target.value;
                    }
                    return false;
                },
                /**
                 * 이메일 체크
                 * @param {Node} el 인풋박스
                 * @return {Boolean}
                 */
                email: function (el) {
                    return emailRegex.test(el.value);
                },
                /**
                 * url 체크
                 * @param {Node} el 인풋박스
                 * @return {Boolean}
                 */
                url: function (el) {
                    return urlRegex.test(el.value);
                },
                /**
                 * 최소 입력 글자 수 체크
                 * @param {Node} el 인풋박스
                 * @param {Number} len 최소 입력 글자 수
                 * @return {Boolean}
                 */
                min_chars: function (el, len) {
                    return el.value.length >= parseInt(len, 10);
                },
                /**
                 * 최대 입력 글자 수 체크
                 * @param {Node} el 인풋박스
                 * @param {Number} len 최대 입력 글자 수
                 * @return {Boolean}
                 */
                max_chars: function (el, len) {
                    return el.value.length <= parseInt(len, 10);
                },
                /**
                 * 고정 입력 글자 수 체크
                 * @param {Node} el 인풋박스
                 * @param {Number} len 고정 입력 글자 수
                 * @return {Boolean}
                 */
                exact_chars: function (el, len) {
                    return el.value.length === parseInt(len, 10);
                },
                /**
                 * 알파벳 체크
                 * @param {Node} el 인풋박스
                 * @return {Boolean}
                 */
                alpha: function (el) {
                    return alphaRegex.test(el.value);
                },
                /**
                 * 알파벳+숫자 체크
                 * @param {Node} el 인풋박스
                 * @return {Boolean}
                 */
                alpha_numeric: function (el) {
                    return alphaNumericRegex.test(el.value);
                },
                /**
                 * 숫자 체크
                 * @param {Node} el 인풋박스
                 * @return {Boolean}
                 */
                numeric: function (el) {
                    return numericRegex.test(el.value);
                },
                /**
                 * 숫자 체크(-, . 허용)
                 * @param {Node} el 인풋박스
                 * @return {Boolean}
                 */
                integer: function (el) {
                    return integerRegex.test(el.value);
                },
                /**
                 * 소수점 숫자 체크(-, . 허용)
                 * @param {Node} el 인풋박스
                 * @return {Boolean}
                 */
                decimal: function (el) {
                    return decimalRegex.test(el.value);
                },
                /**
                 * 한글 체크
                 * @param {Node} el 인풋박스
                 * @return {Boolean}
                 */
                kor: function (el) {
                    return korRegex.test(el.value);
                },
                /**
                 * 파일 확장자 체크
                 * @param {Node} el 인풋박스
                 * @param {String} exts 허용할 확장자
                 * @return {Boolean}
                 */
                file_exts: function (el, exts) {
                    var types = exts.split('|'),
                        ext = el.value.substr(el.value.lastIndexOf('.') + 1);
                    for (var i = 0, len = types.length; i < len; i++) {
                        if (ext === types[i]) {
                            return true;
                        }
                    }
                    return false;
                },
                /**
                 * 주민번호 체크
                 * @param {Node} el 인풋박스
                 * @param {Node} other {Optional} 입력칸이 두개일 때 두번째 인풋박스
                 * @return {Boolean}
                 */
                ssn: function (el, other) {
                    var val = el.value + (other && other.value);
                    return jsa.valid.SSN(val);
                }
            }
        });

        jsa.bindjQuery(FormValidator, 'validator');
        return FormValidator;
    });

    jsa.define('ui.Tabs', function () {
        // 일반 탭(탭버튼과 컨텐츠가 따로 존재할 경우 사용)
        var NormalTabs = Class({
            name: 'NormalTabs',
            $extend: jsa.ui.View,
            $statics: {
                ON_SELECTED: 'selected'
            },
            defaults: {
                selectedIndex: 0,
                selectEvent: 'click'
            },
            selectors: {
                tabs: '.d_tab',
                contents: '.d_content'
            },
            // 생성자
            initialize: function (el, options) {
                var me = this;

                if (me.supr(el, options) === false) {
                    return;
                }
                me.on(me.options.selectEvent, me.options.selectors.tabs, function (e) {
                    e.preventDefault();
                    var $this = $(e.currentTarget),
                        index = me.$tabs.parent().index($this.parent());

                    me.select(index);
                });

                if (me.$el.find('li.on').index() >= 0) {
                    me.options.selectedIndex = me.$el.find('li.on').index();
                }
                me.select(me.options.selectedIndex);
            },

            // index에 해당하는 탭 활성화
            select: function (index) {
                var me = this,
                    $tabs = me.$tabs,
                    $contents = me.$contents;

                $tabs.parent().siblings('.on').removeClass('on').end().eq(index).addClass('on');
                $contents.hide().eq(index).show();
                me.trigger(NormalTabs.ON_SELECTED, [index]); // 이벤트를 날림.
            }
        });

        // 컨텐츠가 li안에 있고, li에 on클래스를 추가하면 컨텐츠가 표시되는 형태일 때 사용
        var ParentOnTabs = Class({
            name: 'ParentOnTabs',
            $extend: jsa.ui.View,
            $statics: {
                ON_SELECTED: 'selected'
            },
            defaults: {
                selectedIndex: 0,
                selectEvent: 'click'
            },
            selectors: {
                tabs: '>li>a'
            },
            // 생성자
            initialize: function (el, options) {
                var me = this;

                if (me.supr(el, options) === false) {
                    return;
                }
                me.on(me.options.selectEvent, me.options.selectors.tabs, function (e) {
                    e.preventDefault();
                    var $this = $(e.currentTarget);

                    me.select($this.parent().index());
                });
                // 
                if (me.$el.find('li.on').index() >= 0) {
                    me.options.selectedIndex = me.$el.find('li.on').index();
                }
                me.select(me.options.selectedIndex);
            },

            // index에 해당하는 탭 활성화
            select: function (index) {
                var me = this,
                    $tabs = me.$tabs;

                $tabs.parent().filter('.on').removeClass('on').end().eq(index).addClass('on');
                me.trigger(ParentOnTabs.ON_SELECTED, [index]); // 이벤트를 날림.
            }
        });

        /**
         * 탭컨트롤
         * @class
         * @name jsa.ui.Tabs
         * @extends jsa.ui.View
         */
        var Tabs = Class( /** @lends jsa.ui.Tabs# */ {
            name: 'Tabs',
            $statics: {
                ON_SELECTED: 'selected',
                TYPES: {
                    NORMAL: 'normal',
                    PARENT_ON: 'parent-on'
                }
            },
            defaults: {
                type: 'parent-on', // or 'display'
                selectedIndex: 0
            },
            /**
             * 생성자
             * @param {jQuery|Element|String} el 대상 엘리먼트
             * @param {JSON} options
             */
            initialize: function (el, options) {
                var me = this;
                options = $.extend({}, this.defaults, options);
                if (options.type === 'parent-on') {
                    me.tabs = new ParentOnTabs(el, options);
                } else {
                    me.tabs = new NormalTabs(el, options);
                }
            },

            /**
             * index에 해당하는 탭 활성화
             * @param {Number} index
             */
            select: function (index) {
                this.tabs.select(index);
            }
        });

        jsa.bindjQuery(Tabs, 'tabs'); // 이 부분을 실행하면 $(..).tabs()로도 호출이 가능해진다.
        return Tabs;
    });

    jsa.define('ui.ToggleSlider', function () {
        /**
         * 토글 슬라이더
         * @class
         * @name jsa.ui.ToggleSlider
         */
        var ToggleSlider = Class( /** @lends jsa.ui.ToggleSlider# */ {
            name: 'ToggleSlider',
            $extend: jsa.ui.View,
            $statics: {
                ON_CHANGED: 'togglesliderchanged'
            },
            defaults: {
                selectedIndex: 0,
                selectEvent: 'click'
            },
            selectors: {
                tabs: '>div.wrap_page>div.page>span.wrap_btn>a', // 탭버튼
                contents: '>div.wrap_list_mv>ul', // 컨텐츠
                nowpages: '>div.wrap_page>div.page>span.page_num>strong', // 현재 페이지 표시영역
                totalpages: '>div.wrap_page>div.page>span.page_num>span' // 전체 페이지 표시영역
            },

            /**
             * 생성자
             * @param {jQuery|Element|String} el 대상 엘리먼트
             * @param {JSON} options
             */
            initialize: function (el, options) {
                var me = this;
                if (me.supr(el, options) === false) {
                    return;
                }

                me.nowpage = 0;
                me.maxpage = me.$contents.size() - 1;
                me.$totalpages.html(me.maxpage + 1);

                if (me.maxpage === 0) {
                    me.$tabs.addClass('disabled');
                } else {
                    me.$tabs.eq(0).addClass('disabled');
                }

                me.on(me.options.selectEvent, me.options.selectors.tabs, function (e) {
                    e.preventDefault();
                    if ($(this).hasClass('disabled')) return;

                    if (me.$tabs.index(this) === 0 && me.nowpage > 0) {
                        me.nowpage = me.nowpage - 1;
                    } else if (me.$tabs.index(this) === 1 && me.nowpage < me.maxpage) {
                        me.nowpage = me.nowpage + 1;
                    }

                    me._toggleButtons();

                    me.$nowpages[0].innerHTML = me.nowpage + 1;
                    me.select(me.nowpage);
                });
                me.select(me.options.selectedIndex);
            },

            /**
             * index에 해당하는 컨텐츠 표시
             * @param {Number} index 인덱스
             */
            select: function (index) {
                var me = this,
                    $tabs = me.$tabs,
                    $contents = me.$contents;

                $contents.hide().eq(index).show();
                // START : 131126_수정
                me.trigger(ToggleSlider.ON_CHANGED, [index]); // 이벤트를 날림.
                // END : 131126_수정
            },

            /**
             * 이전/다음 버튼 활성화 토글링
             * @private
             */
            // START : 131126_수정
            _toggleButtons: function () {
                var me = this;
                if (me.maxpage === 0) {
                    me.$tabs.attr('disabled', 'disabled').addClass('disabled');
                } else if (me.nowpage === 0) {
                    me.$tabs.eq(0).attr('disabled', 'disabled').addClass('disabled');
                    me.$tabs.eq(1).removeAttr('disabled').removeClass('disabled');
                } else if (me.nowpage === me.maxpage) {
                    me.$tabs.eq(0).removeAttr('disabled').removeClass('disabled');
                    me.$tabs.eq(1).attr('disabled', 'disabled').addClass('disabled');
                } else {
                    me.$tabs.removeAttr('disabled').removeClass('disabled');
                }
            },
            // END : 131126_수정

            /**
             * 컨텐츠가 변경됐을 경우, 갱신
             * @example
             * $('div.slider').toggleSlider('update');
             */
            update: function () {
                var me = this;

                me.$contents = me.$el.find(me.options.selectors.contents);
                me.$contents.hide().first().show();

                me.nowpage = 0;
                me.maxpage = me.$contents.size() - 1;
                me.$nowpages[0].innerHTML = me.nowpage + 1;
                me.$totalpages.html(me.maxpage + 1);

                me._toggleButtons();
            }
        });

        jsa.bindjQuery(ToggleSlider, 'toggleSlider'); // 이 부분을 실행하면 $(..).tabs()로도 호출이 가능해진다.
        return ToggleSlider;
    });

    jsa.define('ui.StarRating', function () {
        /**
         * 별점주기
         * @class
         * @name jsa.ui.StarRating
         * @extends jsa.ui.View
         */
        var StarRating = Class( /** @lends jsa.ui.StarRating# */ {
            name: 'StarRating',
            $extend: jsa.ui.View,
            $statics: {
                ON_CHANGED_RATE: 'changedrate'
            },
            defaults: {
                activateClass: 'on',
                ratio: 0.5
            },
            selectors: {
                stars: 'label'
            },
            /**
             * 생성자
             * @param {String|Element|jQuery} el
             * @param {Object} options
             */
            initialize: function (el, options) {
                var me = this;

                if (me.supr(el, options) === false) {
                    return;
                }
                me._initStarRating();
            },

            _initStarRating: function () {
                var me = this,
                    $stars = me.$stars,
                    index = me.$stars.filter('.on:last').index();

                $stars.on('click', function (e) {
                    e.preventDefault();

                    index = $(this).index();
                    me.activate(index);
                    me.trigger(StarRating.ON_CHANGED_RATE, {
                        rate: (index + 1) * me.options.ratio
                    });
                }).on('mouseenter focus', function () {
                    me.activate($(this).index());
                }).on('mouseleave blur', function () {
                    me.activate(index);
                });

            },
            /**
             * idx에 해당하는 별점를 활성화
             * @param {Number} idx 별점
             * @example
             * $('#starRating').startRating('activate', 3.5);
             */
            activate: function (idx) {
                var me = this,
                    $stars = me.$stars,
                    onCls = me.options.activateClass;

                if (idx < 0) {
                    $stars.removeClass(onCls);
                } else {
                    $stars.eq(idx).nextAll().removeClass(onCls).end().prevAll().addBack().addClass(onCls);
                }
            }
        });

        jsa.bindjQuery(StarRating, 'starRating');
        return StarRating;
    });

    jsa.define('ui.SimpleBanner', function () {
        /**
         * 단순한 배너 모듈
         * @class
         * @name jsa.ui.SimpleBanner
         */
        var SimpleBanner = Class({
            name: 'SimpleBanner',
            $extend: jsa.ui.View,
            $statics: {
                ON_SLIDE_END: 'simplebannerslideend',
                ON_PLAY: 'simplebannerplay',
                ON_STOP: 'simplebannerstop'
            },
            defaults: {
                start: 0,
                interval: 3000,
                useFade: true,
                autoStart: true,
                buttonDisabled: false
            },
            selectors: {
                items: 'li',
                indicators: 'a.d_indicator',
                btnPlay: '.d_btn_ctrl.play',
                btnPause: '.d_btn_ctrl.pause'
            },
            events: {
                'click .d_btn_ctrl': function (e) {
                    e.preventDefault();
                    var me = this,
                        $this = $(e.currentTarget);

                    if ($this.hasClass('pre') || $this.hasClass('prev')) {
                        me.prev();
                    } else if ($this.hasClass('pause')) {
                        me.stop();
                    } else if ($this.hasClass('play')) {
                        me.play();
                    } else if ($this.hasClass('next')) {
                        me.next();
                    }
                }
            },
            initialize: function (el, options) {
                var me = this;
                if (me.supr(el, options) === false) {
                    me.destroy();
                    return;
                }
                me._current = 0;
                me._count = me.$items.length;

                if (me._count === 0) {
                    me.destroy();
                    return;
                }

                me._isMouseOver = false;

                me.$indicators.on('click', function (e) {
                    e.preventDefault();
                    me.select($(this).index());
                });

                me.on('mouseenter focusin mouseleave focusout', function (e) {
                    switch (e.type) {
                    case 'mouseenter':
                    case 'focusin':
                        me._isMouseOver = true;
                        break;
                    default:
                        me._isMouseOver = false;
                        break;
                    }
                });

                me.select(me.options.start);
                me.options.autoStart && me.play();
            },
            select: function (index) {
                var me = this;
                if (index < 0) {
                    index = me._count - 1;
                } else if (index >= me._count) {
                    index = 0;
                }

                if (me.options.type === 'show') {
                    me.$items.hide().eq(index).show();
                } else {
                    me.$items.removeClass('on').eq(index).addClass('on');
                }
                me.$indicators.removeClass('on').eq(index).addClass('on');
                if (me.options.buttonDisabled) {
                    me.$el.find('button.d_btn_ctrl')
                        .filter('.pre').prop('disabled', index === 0).toggleClass('disabled', index === 0).end().
                    filter('.next').prop('disabled', index + 1 === me._count).toggleClass('disabled', index + 1 === me._count);
                }
                me._current = index;
                me.triggerHandler('simplebannerslideend', [index]);
            },
            play: function () {
                var me = this,
                    seltor = me.options.selectors;
                if (me.timer) {
                    return;
                }

                me.timer = setInterval(function () {
                    if (me._isMouseOver) {
                        return;
                    }
                    me.next();
                }, me.options.interval);

                var $btn = me.$el.find(seltor.btnPlay);
                $btn.attr('title', ($btn.attr('title') || '').replace('재생', '일시정지')).replaceClass('play', 'pause').children().html('일시정지');
                me.triggerHandler('simplebannerplay');
            },
            stop: function () {
                var me = this,
                    seltor = me.options.selectors;
                if (me.timer) {
                    clearInterval(me.timer);
                    me.timer = null;
                }

                var $btn = me.$el.find(seltor.btnPause);
                $btn.attr('title', ($btn.attr('title') || '').replace('일시정지', '재생')).replaceClass('pause', 'play').children().html('재생');
                me.triggerHandler('simplebannerstop');
            },
            prev: function () {
                var me = this;

                me.select(me._current - 1);
            },
            next: function () {
                var me = this;

                me.select(me._current + 1);
            }
        });

        jsa.bindjQuery(SimpleBanner, 'simpleBanner');

        return SimpleBanner;
    });


    jsa.define('ui.WeekCalendar', function () {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            dateUtil = jsa.date;
        /**
         * 주간 달력
         * @class
         * @name jsa.ui.WeekCalendar
         * @extends jsa.ui.View
         * @example
         * // 속성 : data-active-start="2013-12-12" : 선택된 주간의 시작일
         * // 속성 : data-active-end="2013-12-19" : 선택된 주간의 종료일
         * // 속성 : data-last-date="2013-12-19" : 선택할 수 있는 마지막 날짜
         * // 속성 : data-limit-week="12" : 12주 이전부터 선택가능
         */
        var WeekCalendar = Class( /** @lends jsa.ui.WeekCalendar# */ {
            name: 'WeekCalendar',
            $extend: jsa.ui.View,
            $statics: {
                ON_SELECTED: 'selected', // 날짜 선택시 발생되는 이벤트
                ON_SELECTED_WEEK: 'selectedweek', // 날짜 선택시 발생되는 이벤트
                ON_SHOWCALENDAR: 'showcalendar', // 달력이 표시될 때 발생되는 이벤트
                ON_HIDECALENDAR: 'hidecalendar' // 달력이 숨겨질 때 발생되는 이벤트
            },
            defaults: {
                weekNames: ['월', '화', '수', '목', '금', '토', '일'],
                monthNames: '1월,2월,3월,4월,5월,6월,7월,8월,9월,10월,11월,12월'.split(','),
                startDate: '19700101',
                endDate: '21001231',
                limitWeek: 12,
                title: '',
                // 테이블의 캡션부분을 표시될 문구 생성(클래스 생성시 오버라이딩 가능)
                getCaption: function (type, wname, sy, sm, sd, ey, em, ed) {
                    if (!this.options.title) {
                        return '';
                    }

                    switch (type) {
                    case 'active':
                        return '선택된 주간입니다.(' + sy + '.' + sm + '.' + sd + ' ~ ' + ey + '.' + em + '.' + ed + ')';
                    case 'before':
                    case 'after':
                        return '선택할 수 없는 주간입니다.';
                    }
                    return wname + '입니다.(' + sy + '.' + sm + '.' + sd + ' ~ ' + ey + '.' + em + '.' + ed + ')';
                },
                // 각 날짜의 title속성에 표시할 문구 생성(클래스 생성시 오버라이딩 가능)
                getTitle: function () {
                    return this.options.getCaption.apply(this, arguments);
                }
            },
            template: ['<div class="l_calendar" tabindex="0" style="position:absolute; z-index:13; left:35px; top:55px;"><dl class="cntt"><dt>',
                '<button type="button" class="btn_round small pre"><span><span>이전 달</span></span></button>',
                '<span class="date"></span>',
                '<button type="button" class="btn_round small next"><span><span>다음 달</span></span></button>',
                '</dt><dd class="week_calendar"><table border="1">',
                '<caption></caption>',
                '<colgroup><col /><col style="width:36px;" /><col style="width:36px;" /><col style="width:36px;" /><col style="width:36px;" /><col style="width:36px;" /><col style="width:36px;" /><col style="width:36px;" /></colgroup>',
                '<thead><tr><th>주 선택란</th><th id="week01">월</th><th id="week02">화</th><th id="week03">수</th><th id="week04">목</th><th id="week05">금</th><th id="week06">토</th><th id="week07">일</th></tr></thead>',
                '<tbody class="days"><!-- 내용부분 --></tbody></table></dd>',
                '</dl><button type="button" class="btn_close"><span>닫기</span></button><span class="shadow"></span></div>'
            ].join(''),
            events: {
                // 달력버튼을 클릭할 때
                'click': function (e) {
                    if (WeekCalendar.active === this) {
                        this.close();
                    } else {
                        this.open();
                    }
                }
            },

            /**
             * 생성자
             * @param {String|Element|jQuery} el
             * @param {Object} options
             */
            initialize: function (el, options) {
                var me = this;

                me.supr(el, options);
                me.limitWeek = me.$el.data('limitWeek') || me.options.limitWeek;
                me._initWeekCalendar();
            },

            /**
             * 초기화
             * @private
             */
            _initWeekCalendar: function () {
                var me = this;
            },

            /**
             * 버튼의 data속성을 바탕으로 표시할 날짜를 계산
             * @private
             */
            _configure: function () {
                var me = this,
                    activeStart = me.$el.attr('data-active-start') || me.options.activeStart,
                    activeEnd = me.$el.attr('data-active-end') || me.options.activeEnd,
                    lastDate = me.$el.attr('data-last-date') || me.options.lastDate;

                me.lastDate = lastDate && dateUtil.parseDate(lastDate) || (function () {
                    var d = new Date();
                    d.setDate(d.getDate() - d.getDay());
                    return d;
                }());
                me.startDate = activeStart && dateUtil.parseDate(activeStart) || (function () {
                    var d = new Date(me.lastDate.getTime());
                    d.setDate(d.getDate() - d.getDay() - 6);
                    return d;
                }());
                me.endDate = activeEnd && dateUtil.parseDate(activeEnd) || (function () {
                    var d = new Date(me.startDate.getTime());
                    d.setDate(d.getDate() + 6);
                    return d;
                }());
                me.currentDate = new Date(me.endDate.getTime());

                me.startLimitDate = new Date(me.lastDate.getTime() - (1000 * 60 * 60 * 24 * 7 * (me.limitWeek)) + (1000 * 60 * 60 * 24));
                me.endLimitDate = new Date(me.lastDate.getTime());
            },

            destroy: function () {
                var me = this;

                me.supr();
                $doc.off(me._eventNamespace);
                me.$calendar.off().remove();
            },

            /**
             * 이벤트 바인딩 및 달력표시
             */
            open: function () {
                var me = this;

                me._configure();

                me.$calendar = $(me.template).hide().insertAfter(me.$el[0]);
                me.$calendar
                    .css('zIndex', 9999)
                    .css(me.options.css || {})
                    .on('click', 'button.pre, button.next', function (e) {
                        // 이전, 다음 클릭
                        me.currentDate.setMonth(me.currentDate.getMonth() + (this.className.indexOf('pre') > -1 ? -1 : 1));
                        me.render(new Date(me.currentDate));
                    }).on('click mouseenter mouseleave focusin focusout', 'tbody tr.d_week', function (e) {
                        // 주간 row에 대한 이벤트 바인딩
                        switch (e.type) {
                        case 'mouseenter':
                        case 'focusin':
                            // 활성화
                            $(this).closest('tr').siblings().removeClass('mfocus').end().addClass('mfocus');
                            break;
                        case 'mouseleave':
                        case 'focusout':
                            // 비활성화
                            $(this).closest('tr').removeClass('mfocus');
                            break;
                        case 'click':
                            // 주간 클릭
                            var $this = $(this),
                                value = {};

                            if (!$this.hasClass('on')) {
                                value = {
                                    startDate: $this.attr('data-start-date'),
                                    endDate: $this.attr('data-end-date'),
                                    startYear: $this.attr('data-start-year'),
                                    startMonth: $this.attr('data-start-month'),
                                    startDay: $this.attr('data-start-day'),
                                    endYear: $this.attr('data-end-year'),
                                    endMonth: $this.attr('data-end-month'),
                                    endDay: $this.attr('data-end-day'),
                                    isFirstDate: $this.attr('data-start-date') === dateUtil.format(me.startLimitDate, 'yyyyMMdd'),
                                    isLastDate: $this.attr('data-end-date') === dateUtil.format(me.endLimitDate, 'yyyyMMdd'),
                                    week: $this.attr('data-week')
                                };

                                me.$el.triggerHandler(WeekCalendar.ON_SELECTED, [
                                    value.startDate, value.endDate,
                                    value.startYear, value.startMonth, value.startDay,
                                    value.endYear, value.endMonth, value.endDay,
                                    value.isFirst,
                                    value.isLast,
                                    value.week
                                ]);
                                me.$el.triggerHandler(WeekCalendar.ON_SELECTED_WEEK, [value]);
                            }
                            break;
                        }
                    }).on('click', 'tbody th>a', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $(this).closest('tr').click();
                    }).on('click', function (e) {
                        // 달력내에서 마우스다운시 닫히지 않도록
                        e.stopPropagation();
                    }).on('click', 'button.btn_close', function (e) {
                        // 닫기 버튼
                        e.stopPropagation();
                        me.close();
                    });

                if (jsa.browser.isIE7) {
                    // zindex fix
                    me.$calendar.on('beforeshow hide', function (e) {
                        if (e.type === 'beforeshow') {
                            $(this).closest('div.summ_prid').addClass('on');
                        } else {
                            $(this).closest('div.summ_prid').removeClass('on');
                        }
                    });
                }

                // 달력밖에서 클릭시 닫는다.
                $doc.on('click' + me._eventNamespace, function (e) {
                    if (me.$el[0] !== e.target && !$.contains(me.$el[0], e.target) &&
                        me.$calendar[0] !== e.target && !$.contains(me.$calendar[0], e.target)) {

                        WeekCalendar.active && WeekCalendar.active.close();
                    }
                });

                me.show();
            },

            /**
             * 달력표시
             */
            show: function () {
                var me = this;

                WeekCalendar.active = me;

                me.render(me.currentDate);
                me.$calendar.showLayer().focus();
                me.trigger(WeekCalendar.ON_SHOWCALENDAR, [me.$calendar]);
            },

            /**
             * 달력숨김
             */
            hide: function () {
                var me = this;
                me.isShown = false;
                this.$calendar.hideLayer();
                me.trigger(WeekCalendar.ON_HIDECALENDAR, [me.$calendar]);
            },

            /**
             * 달력닫기
             */
            close: function () {
                var me = this;

                $doc.off('click' + me._eventNamespace);
                me.hide();
                me.$calendar.off().remove();
                WeekCalendar.active = null;
            },

            /**
             * 이전 주 계산
             * @param date 현재 날짜
             * @return {JSON} 이전 주에 해당하는 값들
             */
            _getPrevWeek: function (date) {
                var d = new Date(date.getTime() - (1000 * 60 * 60 * 24 * 7));
                return {
                    startDate: new Date(d.getTime()),
                    endDate: new Date(d.getTime() + (1000 * 60 * 60 * 24 * 6))
                };
            },

            /**
             * 다음 주 계산
             * @param date 현재 날짜
             * @return {JSON} 이전 주에 해당하는 값들
             */
            _getNextWeek: function (date) {
                var d = new Date(date.getTime() + (1000 * 60 * 60 * 24 * 7));
                return {
                    startDate: new Date(d.getTime()),
                    endDate: new Date(d.getTime() + (1000 * 60 * 60 * 24 * 6))
                };
            },

            _sameWeekDate: function (date, d) {
                return date.getFullYear() === d.year && date.getMonth() === d.month - 1 && date.getDate() === d.day;
            },

            /**
             * 달력 렌더링
             * @param {Date} 렌더링시 기준 날짜
             */
            render: function (date) {
                var me = this,
                    zeroPad = jsa.number.zeroPad,
                    data = me._getDateList(date),
                    startLimit = me.startLimitDate.getTime(),
                    endLimit = me.endLimitDate.getTime(),
                    title = me.options.title,
                    getCaption = me.options.getCaption,
                    getTitle = me.options.getTitle,
                    html = '',
                    curr, headerId, isOn, cls, wn, wi, week, startWeek, endWeek, sy, sm, sd, ey, em, ed, args;

                for (var i = 0; i < data.length; i++) {
                    week = data[i];
                    startWeek = week[0];
                    endWeek = week[6];
                    curr = new Date(startWeek.year, startWeek.month - 1, startWeek.day, 0, 0, 0);
                    isOn = me._sameWeekDate(me.startDate, startWeek) && me._sameWeekDate(me.endDate, endWeek);
                    cls = isOn ? "on" : "d_btn";
                    headerId = 'cycle0' + (i + 1);
                    sy = startWeek.year;
                    sm = zeroPad(startWeek.month);
                    sd = zeroPad(startWeek.day);
                    ey = endWeek.year;
                    em = zeroPad(endWeek.month);
                    ed = zeroPad(endWeek.day);

                    if (i > 1 && startWeek.month !== endWeek.month) {
                        wn = endWeek.month + '월 1주차';
                        wi = 1;
                    } else {
                        wn = endWeek.month + '월 ' + (wi = (i + 1)) + '주차';
                    }

                    args = [wn, sy, sm, sd, ey, em, ed];
                    if (startLimit <= curr.getTime() && endLimit > curr.getTime()) {
                        html += '<tr class="d_week ' + cls + '" title="' + getTitle.apply(me, [isOn ? 'active' : 'normal'].concat(args)) + '" ';
                        html += 'data-start-date="' + sy + sm + sd + '" data-start-year="' + sy + '" data-start-month="' + sm + '" data-start-day="' + sd + '" ';
                        html += 'data-end-date="' + ey + em + ed + '" data-end-year="' + ey + '" data-end-month="' + em + '" data-end-day="' + ed + '" data-week="' + wi + '">';

                        if (isOn) {
                            html += '<th id="' + headerId + '">' + getCaption.apply(me, ['active'].concat(args)) + '</th>';
                        } else {
                            html += '<th id="' + headerId + '"><a href="#" title="' + getCaption.apply(me, ['normal'].concat(args)) + '">' + (i + 1) + '</a></th>';
                        }
                    } else {
                        html += '<tr class="end">';

                        if (startLimit > curr.getTime()) {
                            html += '<tr class="end" title="' + getTitle.apply(me, ['before'].concat(args)) + '">';
                            html += '<th>' + getCaption.apply(me, ['before'].concat(args)) + '</th>';
                        } else {
                            html += '<tr class="end" title="' + getTitle.apply(me, ['after'].concat(args)) + '">';
                            html += '<th>' + getCaption.apply(me, ['after'].concat(args)) + '</th>';
                        }
                    }

                    for (var j = 0, len = week.length; j < len; j++) {
                        if (j === 0) {
                            cls = 'first';
                        } else if (j === len - 1) {
                            cls = 'end';
                        } else {
                            cls = '';
                        }
                        html += '<td headers="' + headerId + ' week0' + (j + 1) + '" class="' + cls + '">' + (week[j].month - 1 === date.getMonth() ? '' : '<span class="none">' + week[j].month + '월</span>') + week[j].day + '</td>';
                    }
                    html += '</tr>';
                }

                // 날짜 제한에 따른 이전, 다음 버튼 활성화
                if (me.startLimitDate.getFullYear() === date.getFullYear() && me.startLimitDate.getMonth() === date.getMonth()) {
                    me.$calendar.find('button.pre').addClass('disabled').prop('disabled', true);
                } else {
                    me.$calendar.find('button.pre').removeClass('disabled').prop('disabled', false);
                }
                var now = me.endLimitDate;
                if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
                    me.$calendar.find('button.next').addClass('disabled').prop('disabled', true);
                } else {
                    me.$calendar.find('button.next').removeClass('disabled').prop('disabled', false);
                }

                me.$calendar.find('tbody.days').html(html);
                me.$calendar.find('span.date').html(date.getFullYear() + '<span class="none">년</span>.' + zeroPad(date.getMonth() + 1) + '<span class="none">월</span>');
                me.$calendar.find('caption').html(date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월 주간 선택 달력 테이블');
            },

            /**
             * 날짜 데이타 계산
             * @param {Date} date 렌더링할 날짜 데이타 생성
             * @return {Array}
             */
            _getDateList: function (date) {
                date.setDate(1);

                var me = this,
                    month = date.getMonth() + 1,
                    year = date.getFullYear(),
                    startOnWeek = date.getDay() === 0 ? 7 : date.getDay(), // 1일의 요일
                    last = daysInMonth[date.getMonth()], // 마지막날
                    prevLast = daysInMonth[date.getMonth() === 0 ? 11 : date.getMonth() - 1], // 이전달의 마지막날
                    startPrevMonth = prevLast - startOnWeek, // 이전달의 시작일
                    y = year,
                    m = month;

                if (month > 12) {
                    month -= 12, year += 1;
                } else {
                    if (month == 2 && me._isLeapYear(year)) {
                        last = 29;
                    }
                }

                var weekDay = 0,
                    data = [],
                    week = [];

                if (startOnWeek > 0) {
                    if (month == 3 && me._isLeapYear(year)) {
                        startPrevMonth += 1;
                    }
                    if ((m = month - 1) < 1) {
                        m = 12, y = year - 1;
                    }
                    for (var i = 1; i < startOnWeek; i++) {
                        week.push({
                            year: y,
                            month: m,
                            day: startPrevMonth + i + 1
                        }); // ***** +1
                    }
                    if (week.length > 6) {
                        data.push(week), week = [];
                    }
                }

                for (var i = 1; i <= last; i++) {
                    week.push({
                        year: year,
                        month: month,
                        day: i
                    });
                    if (week.length > 6) {
                        data.push(week), week = [];
                    }
                }

                if (week.length > 0 && week.length < 7) {
                    if ((m = month + 1) > 12) {
                        m -= 12, y = year + 1;
                    }
                    for (var i = week.length, d = 1; i < 7; i++, d++) {
                        week.push({
                            year: y,
                            month: m,
                            day: d
                        });
                    }
                }
                week.length && data.push(week);
                return data;
            },

            /**
             * 윤년 여부
             * @param {Date} date 렌더링할 날짜 데이타 생성
             * @return {Boolean} 윤년 여부
             */
            _isLeapYear: function (year) {
                return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
            },

            /**
             * 현재 표시된 주가 제한값의 시작주인가
             * @return {Boolean}
             */
            isFirstDate: function () {
                var me = this;
                me._configure();
                return dateUtil.format(me.startDate, 'yyyyMMdd') === dateUtil.format(me.startLimitDate, 'yyyyMMdd');
            },

            /**
             * 현재 표시된 주가 제한값의 마지막주인가
             * @return {Boolean}
             */
            isLastDate: function () {
                var me = this;
                me._configure();
                return dateUtil.format(me.endDate, 'yyyyMMdd') === dateUtil.format(me.endLimitDate, 'yyyyMMdd');
            },

            /**
             * 전주, 다음주 계산
             * @private
             * @param {Number} 1: 다음주, -1: 전주
             * @return {JSON} 주간정보
             */
            _calc: function (n) {
                var me = this,
                    value;

                me._configure();
                value = n > 0 ? me._getNextWeek(me.startDate) : me._getPrevWeek(me.startDate);

                if (value.startDate.getMonth() !== value.endDate.getMonth()) {
                    value.week = 1;
                } else {
                    value.week = Math.ceil((value.startDate.getDay() + value.startDate.getDate()) / 7);
                }

                value.startYear = value.startDate.getFullYear();
                value.startMonth = numberUtil.zeroPad(value.startDate.getMonth() + 1);
                value.startDay = numberUtil.zeroPad(value.startDate.getDate());

                value.endYear = value.endDate.getFullYear();
                value.endMonth = numberUtil.zeroPad(value.endDate.getMonth() + 1);
                value.endDay = numberUtil.zeroPad(value.endDate.getDate());

                value.startDate = dateUtil.format(value.startDate, 'yyyyMMdd');
                value.endDate = dateUtil.format(value.endDate, 'yyyyMMdd');

                value.isFirstDate = value.startDate === dateUtil.format(me.startLimitDate, 'yyyyMMdd');
                value.isLastDate = value.endDate === dateUtil.format(me.endLimitDate, 'yyyyMMdd');

                return value;
            },

            /**
             * 전주
             * @return {JSON} 전주 정보
             */
            prev: function () {
                return this._calc(-1);
            },

            /**
             * 다음주
             * @return {JSON} 다음주 정보
             */
            next: function () {
                return this._calc(1);
            }
        });

        // 달력 모듈이 한번이라도 호출되면, 이 부분이 실행됨, 달력 모듈이 단 한번도 사용안하는 경우도 있는데, 
        // 무조건 바인딩시켜놓는건 비효율적인 듯 해서 이와 같이 처리함
        WeekCalendar.onClassCreate = function () {
            jsa.PubSub.on('hide:modal', function () {
                WeekCalendar.active && WeekCalendar.active.close();
            });
        };
        jsa.bindjQuery(WeekCalendar, 'weekCalendar');
        return WeekCalendar;
    });

    jsa.define('ui.MonthCalendar', function () {
        var dateUtil = jsa.date;

        /**
         * 월간 달력
         * @class
         * @name jsa.ui.MonthCalendar
         * @extends jsa.ui.View
         */
        var MonthCalendar = Class( /** @lends jsa.ui.MonthCalendar# */ {
            name: 'MonthCalendar',
            $extend: jsa.ui.View,
            $statics: {
                ON_SELECTED: 'selected', // 날짜 선택시 발생되는 이벤트
                ON_SHOWCALENDAR: 'showcalendar', // 달력이 표시될 때 발생되는 이벤트
                ON_HIDECALENDAR: 'hidecalendar' // 달력이 숨겨질 때 발생되는 이벤트
            },
            events: {
                // 달력버튼을 클릭할 때
                'click': function (e) {
                    if (MonthCalendar.active === this) {
                        this.close();
                    } else {
                        this.open();
                    }
                }
            },
            template: ['<div class="l_calendar" tabindex="0" style="position:absolute; z-index:13; left:35px; top:55px;"><dl class="cntt"><dt>',
                '<button type="button" class="btn_round small pre"><span><span>이전 년도</span></span></button>',
                '<span class="date">2013<span class="none">년</span></span>',
                '<button type="button" class="btn_round small next"><span><span>다음 년도</span></span></button>',
                '</dt><dd class="month_calendar"><ul>',
                '</ul></dd></dl><button type="button" class="btn_close"><span>닫기</span></button>',
                '<span class="shadow"></span>',
                '</div>'
            ].join(''),
            defaults: {
                limitMonth: 0,
                title: '',
                // 테이블의 캡션부분을 표시될 문구 생성(클래스 생성시 오버라이딩 가능)
                getCaption: function () {
                    return '';
                },
                // 각 날짜의 title속성에 표시할 문구 생성(클래스 생성시 오버라이딩 가능)
                getTitle: function () {
                    return '';
                }
            },
            /**
             * 생성자
             * @param {String|Element|jQuery} el
             * @param {Object} options
             */
            initialize: function (el, options) {
                var me = this;

                me.supr(el, options);
                me._initMonthCalendar();
            },

            /**
             * 초기화
             * @private
             */
            _initMonthCalendar: function () {
                var me = this;

            },

            /**
             * 버튼의 data속성을 바탕으로 표시할 날짜를 계산
             * @private
             */
            _configure: function () {
                var me = this,
                    limitMonth = me.$el.data('limitMonth') || me.options.limitMonth,
                    lastDate = me.$el.attr('data-last-date') || me.options.lastDate,
                    activeDate = me.$el.attr('data-active-date') || me.options.activeDate;

                me.endDate = lastDate && dateUtil.parseDate(lastDate + '.01') || (function () {
                    var d = new Date();
                    d.setMonth(d.getMonth() - 1);
                    return d;
                }());

                me.activeDate = activeDate && dateUtil.parseDate(activeDate + '.01') || new Date(me.endDate.getTime());
                me.currentDate = new Date(me.activeDate.getTime());
                me.limitDate = new Date(me.endDate.getTime());
                if (limitMonth) {
                    me.limitDate.setMonth(me.limitDate.getMonth() - limitMonth);
                } else {
                    me.limitDate.setYear(me.limitDate.getFullYear() - 1);
                    me.limitDate.setMonth(0); // - limitMonth
                }
            },


            /**
             * 이벤트 바인딩 및 달력표시
             */
            open: function () {
                var me = this;

                me._configure();

                me.$calendar = $(me.template).hide().insertAfter(me.$el);
                if (me.options.style) {
                    me.$calendar[0].style.cssText = me.options.style;
                }
                me.$calendar
                    .css('zIndex', 9999)
                    .on('click', 'li>a', function (e) {
                        e.preventDefault();
                        var $this = $(this);
                        // selected 이벤트 트리거
                        me.trigger(MonthCalendar.ON_SELECTED, [
                            $this.attr('data-date'),
                            $this.attr('data-year'),
                            $this.attr('data-month'),
                            $this.attr('data-date') === dateUtil.format(me.limitDate, 'yyyyMM'),
                            $this.attr('data-date') === dateUtil.format(me.endDate, 'yyyyMM')
                        ]);
                    })
                    .on('click', 'button.pre, button.next', function (e) {
                        me.currentDate.setYear(me.currentDate.getFullYear() + (this.className.indexOf('pre') > -1 ? -1 : 1));
                        me.render(new Date(me.currentDate));
                    })
                    .on('click', 'button.btn_close', function (e) {
                        e.stopPropagation();
                        me.close();
                    });

                if (jsa.browser.isIE7) {
                    // z-index 문제 해결
                    me.$calendar.on('beforeshow hide', function (e) {
                        if (e.type === 'beforeshow') {
                            $(this).closest('div.summ_prid').addClass('on');
                        } else {
                            $(this).closest('div.summ_prid').removeClass('on');
                        }
                    });
                }

                $doc.on('click' + me._eventNamespace, function (e) {
                    // 달력 영역 바깥에서 클릭하면 닫는다.
                    if (me.$el[0] !== e.target && !$.contains(me.$el[0], e.target) &&
                        me.$calendar[0] !== e.target && !$.contains(me.$calendar[0], e.target)) {
                        MonthCalendar.active && MonthCalendar.active.close();
                    }
                });
                me.show();
            },

            /**
             * 현재 표시된 월이 제한값의 시작월인가
             */
            isFirstDate: function () {
                var me = this;
                me._configure();
                return dateUtil.format(me.activeDate, 'yyyyMM') === dateUtil.format(me.limitDate, 'yyyyMM');
            },

            /**
             * 현재 표시된 월이 제한값의 마지막월인가
             */
            isLastDate: function () {
                var me = this;
                me._configure();
                return dateUtil.format(me.activeDate, 'yyyyMM') === dateUtil.format(me.endDate, 'yyyyMM');
            },

            /**
             * 달력표시
             */
            show: function () {
                var me = this;

                MonthCalendar.active = me;

                me.render(me.currentDate);
                me.$calendar.showLayer().focus();
                me.trigger(MonthCalendar.ON_SHOWCALENDAR, [me.$calendar]);
            },

            /**
             * 달력숨김
             */
            hide: function () {
                var me = this;

                this.$calendar.hide();
                me.trigger(MonthCalendar.ON_HIDECALENDAR, [me.$calendar]);
            },

            /**
             * 달력삭제
             */
            close: function () {
                var me = this;

                $doc.off('click' + me._eventNamespace);
                me.hide();
                me.$calendar.off().remove();
                MonthCalendar.active = null;
            },

            /**
             * 달력 렌더링
             * @param {Date} date 렌더링시 기준 날짜
             */
            render: function (date) {
                var me = this,
                    html = '',
                    title = me.options.title,
                    year = date.getFullYear(),
                    limitDate = parseInt(dateUtil.format(me.limitDate, 'yyyyMM'), 10),
                    endDate = parseInt(dateUtil.format(me.endDate, 'yyyyMM'), 10),
                    getCaption = function () {
                        return me.options.getCaption.apply(me, arguments);
                    },
                    getTitle = function () {
                        return me.options.getTitle.apply(me, arguments);
                    },
                    curr, isOn

                for (var i = 1; i <= 12; i++) {
                    curr = parseInt(date.getFullYear() + "" + numberUtil.zeroPad(i), 10);
                    isOn = (me.activeDate.getFullYear() === date.getFullYear() && me.activeDate.getMonth() === (i - 1));

                    if (limitDate <= curr && endDate >= curr) {
                        html += '<li><a href="#" data-date="' + curr + '" title="' + getTitle(isOn ? 'active' : 'normal', year, i) + '" data-year="' + date.getFullYear() + '" data-month="' + numberUtil.zeroPad(i) + '" class="btn' + (isOn ? ' on' : '') + '"><span><span class="none">' + year + '년도</span>' + i + '월</span></a></li>';
                    } else {
                        if (limitDate > curr) {
                            // 이전
                            html += '<li class="d_before"><span class="btn disabled"><span><span class="none">' + year + '년도</span>' + i + '월<span class="none">' + getTitle('before', year, i) + '</span></span></span></li>';
                        } else {
                            // 이후
                            html += '<li class="d_nodata"><span class="btn disabled"><span><span class="none">' + year + '년도</span>' + i + '월<span class="none">' + getTitle('after', year, i) + '</span></span></span></li>';
                        }
                    }
                }

                me.$calendar.find('dd.month_calendar>ul').html(html);
                // 날짜 제한에 따른 이전, 다음 버튼 활성화
                if (me.limitDate.getFullYear() === date.getFullYear()) {
                    me.$calendar.find('button.pre').addClass('disabled').prop('disabled', true);
                } else {
                    me.$calendar.find('button.pre').removeClass('disabled').prop('disabled', false);
                }
                if (date.getFullYear() === (new Date()).getFullYear()) {
                    me.$calendar.find('button.next').addClass('disabled').prop('disabled', true);
                } else {
                    me.$calendar.find('button.next').removeClass('disabled').prop('disabled', false);
                }
                me.$calendar.find('span.date').html(date.getFullYear() + '<span class="none">년</span>');
            },

            /**
             * 이전달, 다음달 계산
             * @private
             * @param {Number} 1: 다음달, -1: 이전달
             * @return {JSON} 월간 정보
             */
            _calc: function (n) {
                var me = this,
                    date;

                me._configure();
                me.activeDate.setMonth(me.activeDate.getMonth() + n);
                date = dateUtil.format(me.activeDate, 'yyyyMM');

                var value = {
                    date: date,
                    year: me.activeDate.getFullYear() + "",
                    month: numberUtil.zeroPad(me.activeDate.getMonth() + 1),
                    isFirstDate: date === dateUtil.format(me.limitDate, 'yyyyMM'),
                    isLastDate: date === dateUtil.format(me.endDate, 'yyyyMM')
                };

                // 변경된 날짜를 버튼에 셋팅
                me.$el.attr('data-active-date', value.date);
                return value;
            },

            /**
             * 이전달
             * @return {JSON} 이전달 정보
             */
            prev: function () {
                return this._calc(-1);
            },

            /**
             * 다음달
             * @return {JSON} 다음달 정보
             */
            next: function () {
                return this._calc(1);
            }

        });

        // 달력 모듈이 한번이라도 호출되면, 이 부분이 실행됨, 달력 모듈이 단 한번도 사용안하는 경우도 있는데, 
        // 무조건 바인딩시켜놓는건 비효율적인 듯 해서 이와 같이 처리함
        MonthCalendar.onClassCreate = function () {

            jsa.PubSub.on('hide:modal', function () {
                MonthCalendar.active && MonthCalendar.active.close();
            });

        };

        jsa.bindjQuery(MonthCalendar, 'monthCalendar');
        return MonthCalendar;
    });

    jsa.define('ui.Timeline', function () {
        /**
         * 아티스트 상세 타임라인
         * @class jsa.ui.Timeline
         * @extends jsa.ui.View
         */
        var Timeline = Class( /** @lends jsa.ui.Timeline# */ {
            $extend: View,
            name: 'timeline',
            defaults: {
                arrowHeight: 48, // 40 + 8    : 아이콘의 사이즈
                boxTopMargin: 24 // 박스간의 간격
            },
            /**
             * @constructor
             */
            initialize: function (el, options) {
                var me = this;

                if (me.supr(el, options) === false) {
                    return;
                }

                // 각 아이템이 배치될 위치(좌 or 우)를 결정할 때 기준이 되는 값 :
                // 좌우에 차례로 배치되면서 각 아이템의 top+height를 계속 더해간다.(좌측에 배치되면 left에, 우측에 배치되면 right에)
                me.measure = {
                    left: 0, // 왼쪽 높이
                    center: 0, // 가운데부분 높이
                    right: 0 // 오른쪽부분 높이
                };

                // 배치 시작
                me.update();
            },
            /**
             * 요소들을 배치
             * @param {Integer} start 몇번째 항목부터 배치할 것인가...더보기를 했을 때, ajax로 가져온 항목들을 append한 후, 새로 append된 아이템부터 배치하기 위함
             */
            update: function (start) {
                // 몇번째 항목부터 배치할 것인가...더보기를 했을 때, ajax로 가져온 항목들을 append한 후, 새로 append된 아이템부터 배치하기 위함
                // (이미 배치된 항목을 다시 배치할 필요는 없음)
                start = start || 0;

                var me = this,
                    $items = me.$el.find('>ul>li').filter(function (i) {
                        return i >= start;
                    }), // 새로 추가된 항목을 필터링
                    items = [],
                    measure = me.measure,
                    ARROW_HEIGHT = me.options.arrowHeight, // 아이콘의 높이
                    BOX_TOP_MARGIN = me.options.boxTopMargin; // 박스간의 간격

                // UI요소가 차지하는 화면상의 사이즈를 계산하기 위해선 display가 none이 아니어야 되므로, 
                // 대신 visibility:hidden으로 해놓고, display:block으로 변경
                me.$el.css('visibility', 'hidden').show();
                if (start === 0) {
                    // 첫항목부터 배치되어야 하는 경우, 배치값을 초기화.
                    measure.left = measure.center = measure.right = 0;
                }

                // 각각 li 항목의 좌우위치와 높이, 그리고 그에따른 아이콘 위치를 계산해서 items에 담는다.(아직 배치전)
                $items.each(function (i) {
                    var $li = $(this),
                        boxHeight = $li.show().height(),
                        align, targetTopOffset, arrowTopOffset;

                    align = (measure.left <= measure.right) ? 'left' : 'right';
                    targetTopOffset = measure[align];
                    arrowTopOffset = Math.max(measure.center - targetTopOffset, 0);

                    items.push({
                        $target: $li.hide(), // 대상
                        css: align, // 위치
                        top: targetTopOffset, // top 위치
                        arrowTop: arrowTopOffset // 아이콘 위치
                    });

                    measure[align] += boxHeight + BOX_TOP_MARGIN; // 좌측, 우측의 위치별로 최종 top를 저장(다음 항목의 top를 계산하기 위해)
                    measure.center = targetTopOffset + arrowTopOffset + ARROW_HEIGHT; // 중앙쪽에 최종 top를 저장(다음 항목의 top를 계산하기 위해)
                });

                // 위에서 계산 위치를 바탕으로 실제로 배치(top css)
                $.each(items, function (i, item) {
                    item.$target.removeClass('lc_left lc_right')
                        .addClass('lc_' + item.css) // 좌 or 우
                    .css({
                        'top': item.top
                    }) // top 설정
                    .fadeIn('slow')
                        .find('div.wrap_icon').css({
                            'top': item.arrowTop
                        }); // 아이콘
                });

                // 가장밑에 배치된 항목을 기준으로 컨테이너 높이를 지정
                me.$el.css({
                    'visibility': '',
                    height: Math.max(measure.left, measure.right)
                });
                me.trigger('completed'); // 완료 이벤트를 발생
            }
        });

        jsa.bindjQuery(Timeline, 'timeline');
        return Timeline;
    });


    jsa.define('ui.TimeSlider', function () {

        /**
         * 실시간차트의 타임슬라이더
         * @class jsa.ui.TimeSlider
         */
        var TimeSlider = Class( /** @lends jsa.ui.TimeSlider# */ {
            name: 'TimeSlider',
            $extend: jsa.ui.View,
            defaults: {
                orientation: 'horizontal', // 방향(가로)
                duration: 300, // 슬라이딩 duration
                easing: 'ease-in-out', // 이징
                animate: true, // 애니메이트 사용여부
                render: false // true: 동적으로 그릴 것인가(false: 서버에서 뿌릴 것인가)
            },
            selectors: {
                'sliderBox': '.d_slider_box', // 컨테이너
                'panel': '.d_panel', // 움직이는 박스
                'prevArrow': '.d_prev', // 왼쪽 버튼
                'nextArrow': '.d_next' // 오른쪽 버튼
            },

            initialize: function (el, options) {
                var me = this;

                if (me.supr(el, options) === false) {
                    me.destroy();
                    return;
                }

                // 마지막 시간
                me.lastTime = me.options.lastTime || me.$el.attr('data-last-time') || dateUtil.format(new Date(), 'hh:00');
                // 선택된 시간
                me._activeTime = me.options.activeTime || me.$el.attr('data-active-time') || me.lastTime; // 131104_수정: onTime -> activeTime
                // start: 131104_수정
                // 통계자료가 있는 시간(01:00;02:00;03:00...)
                me._enableTimes = me.options.enableTimes || me.$el.attr('data-disable-times') || "";
                // end: 131104_수정

                me._initTimeSlider();
                // 옵션으로 받은 시간을 활성화
                me.active(me._activeTime); // 131104_수정
            },

            /**
             * 기본 작업
             * @private
             */
            _initTimeSlider: function () {
                var me = this;

                me.$panel.css('width', me.totalWidth); // 

                me.$prevArrow.on('click', function () {
                    me._slide('prev');
                });

                me.$nextArrow.on('click', function () {
                    me._slide('next');
                });

                me.on('click', 'a', function (e) {
                    e.preventDefault();

                    me.trigger('selected', [$(this).text()]);
                });

            },

            /**
             * time에 해당하는 요소를 활성화
             * @param {String} time ex) 13:00
             */
            active: function (time) {
                var me = this,
                    left = 0,
                    centerPos = 0,
                    t = time.match(/^\d+/);

                if (t) {
                    me._activeTime = time; // 131104_수정
                    me.options.render && me.render(); // 스크립트에서 그린것인가

                    me.$items = me.$panel.find('>li'); // 시간 아이템들 
                    me.itemCount = me.$items.length; // 갯수
                    me.moveWidth = me.$sliderBox.width(); // 한번에 움직일 width
                    me.itemWidth = me.$items.eq(0).width(); // 아이템 하나의 width
                    me.totalWidth = me.itemWidth * me.itemCount; // 총 너비
                    me.limitLeft = me.moveWidth - me.totalWidth; // 움직일 수 있는 최대 left값

                    centerPos = Math.floor((me.moveWidth / me.itemWidth) / 2);
                    t = parseInt(t[0], 10); // 13:00 에서 13을 추출

                    if (t < centerPos) {
                        left = 0;
                    } else if (centerPos >= (me.itemCount - t)) {
                        left = me.limitLeft;
                    } else {
                        left = -((t - centerPos) * me.itemWidth);
                    }

                    me._slide('cur', left);
                }
            },

            _slide: function (dir, currentLeft) {
                var me = this;

                currentLeft = typeof currentLeft === 'undefined' ? parseInt(me.$panel.css('left'), 10) : currentLeft;

                if (dir === 'prev') {
                    // 왼쪽 방향
                    currentLeft = Math.min(0, currentLeft + me.moveWidth);
                } else if (dir === 'next') {
                    // 오른쪽 방향
                    currentLeft = Math.max(me.limitLeft, currentLeft - me.moveWidth);
                }
                // 애니메이트
                me.$panel.stop().animate({
                    'left': currentLeft
                }, {
                    'easing': 'easeInOutCubic',
                    'duration': 600
                });
                // 왼쪽, 오른쪽 버튼의 토글링
                if (currentLeft === 0) {
                    me.$prevArrow.addClass('disabled').prop('disabled', true);
                    me.$nextArrow.removeClass('disabled').prop('disabled', false);
                } else if (currentLeft === me.limitLeft) {
                    me.$prevArrow.removeClass('disabled').prop('disabled', false);
                    me.$nextArrow.addClass('disabled').prop('disabled', true);
                } else {
                    me.$prevArrow.removeClass('disabled').prop('disabled', false);
                    me.$nextArrow.removeClass('disabled').prop('disabled', false);
                }
            },
            // 스크립트로 렌더링
            render: function () {
                // start: 131104_수정
                var me = this,
                    nowHour = parseInt(me.lastTime.split(':')[0], 10),
                    html = '',
                    h, t, isOn;

                for (var i = 0; i < 24; i++) {
                    h = numberUtil.zeroPad(i), t = h + ':00';
                    isOn = (t === me._activeTime);
                    if (!isOn && i <= nowHour) {
                        // 이전 시간이지만, disable 하고자 하는 시간인지 여부
                        if (me._enableTimes.indexOf(h) >= 0) {
                            html += '<li data-time="' + t + '"><a href="#" title="' + h + '시 실시간 급상승 TOP100 페이지로 이동">' + t + '</a></li>';
                        } else {
                            html += '<li data-time="' + t + '"><span>' + t + '</span></li>';
                        }
                    } else {
                        html += '<li data-time="' + t + '"' + (isOn ? ' class="on"' : "") + '><span>' + t + '</span></li>';
                    }
                }
                // end: 131104_수정

                me.$panel.html(html);
            }
        });

        jsa.bindjQuery(TimeSlider, 'timeSlider');

        return TimeSlider;
    });

    /**
     * 인기배틀의 인기상 후보 타임라인 모듈
     * @class jsa.ui.Timeline
     */
    var Timeline = Class( /** @lends jsa.ui.Timeline# */ {
        $extend: jsa.ui.View,
        name: 'timeline',
        defaults: {
            arrowHeight: 48, // 40 + 8        // 아이콘 크기
            boxTopMargin: 24 // 박스간 간격
        },
        /** 
         * 생성자
         */
        initialize: function (el, options) {
            var me = this;

            if (me.supr(el, options) === false) {
                return;
            }

            me.measure = {
                left: 0,
                center: 0,
                right: 0
            };

            me.update();
        },
        /**
         * 자세한 설명은 codejweb_artist.js의 timeline 모듈 참조
         */
        update: function (start) {
            start = start || 0;

            var me = this,
                $items = me.$el.find('>ul>li').filter(function (i) {
                    return i >= start;
                }), // 이후에 추가된 항목
                items = [],
                measure = me.measure,
                ARROW_HEIGHT = me.options.arrowHeight,
                BOX_TOP_MARGIN = me.options.boxTopMargin;

            me.$el.css('visibility', 'hidden').show(); // 정확한 사이즈계산을 위해 visibility:hidden, display:block로 변경
            if (start === 0) {
                measure.left = measure.center = measure.right = 0;
            }


            $items.each(function (i) {
                var $li = $(this),
                    boxHeight = $li.show().height(),
                    align, targetTopOffset, arrowTopOffset;

                align = (measure.left <= measure.right) ? 'left' : 'right';
                targetTopOffset = measure[align];
                arrowTopOffset = Math.max(measure.center - targetTopOffset, 0);

                items.push({
                    $target: $li.hide(),
                    css: align,
                    top: targetTopOffset,
                    arrowTop: arrowTopOffset
                });

                measure[align] += boxHeight + BOX_TOP_MARGIN;
                measure.center = targetTopOffset + arrowTopOffset + ARROW_HEIGHT;
            });

            // 위에서 계산된 위치정보를 바탕으로 요소를 배치시킨다.
            $.each(items, function (i, item) {
                item.$target.removeClass('lc_left lc_right')
                    .addClass('lc_' + item.css)
                    .css({
                        'top': item.top
                    })
                    .fadeIn('slow')
                    .find('div.wrap_icon').css({
                        'top': item.arrowTop
                    });
            });

            // 컨텐이너의 크기를 최종적으로 배치된 높이에 맞게 변경
            me.$el.css({
                'visibility': '',
                height: Math.max(measure.left, measure.right)
            });
            me.triggerHandler('completed');
        }
    });

    jsa.bindjQuery(Timeline, 'timeline');

    /**
     * 롤링카운터 모듈
     * @class jsa.ui.RollingCounter
     */
    var RollingCounter = Class( /** @lends jsa.ui.RollingCounter# */ {
        name: 'RollingCounter',
        $extend: jsa.ui.View,
        $statics: {
            ON_ROLLING_END: 'rollingcounterend'
        },
        defaults: {
            height: 75, // 높이
            duration: 1000, // 애니메이션 duration
            delay: 300, // 자릿수간에 애니메이션 간격
            easing: 'easeInOutQuart'
        },
        initialize: function (el, options) {
            var me = this;

            if (me.supr(el, options) === false) {
                return;
            }

            me._$items = [].reverse.call(me.$el.find('>span')); // 숫자에 해당하는 각 요소를 찾아서 거꾸로 정렬시켜서 가지고 있는다.(일단위부터 애니메이션을 시작)
            me._numbers = (me.$el.attr('data-value') || parseInt(me.$el.text() || 0)) + ""; // 뿌려질 숫자값

            me.start();
        },
        // 시작
        start: function () {
            var me = this,
                opts = me.options,
                numbers = [].reverse.call(me._numbers.split('')).join(''), // 숫자를 거꾸로 정렬
                cssUtil = jsa.css,
                ease = opts.easing,
                len = numbers.length;

            me._$items.attr('style', 'background-position:0 75px').stop(true).each(function (i) {
                if (i >= len) {
                    return false;
                }

                var $el = $(this),
                    n = parseInt(numbers.substr(i, 1), 10), // i번째 숫자를 가져옴
                    y = ((n * opts.height) + 750); // n에 해당하는 top를 계산

                $el.data('number', n); // n를 보관(동일한 숫자일 때 애니메이트를 안하기 위함)
                $el.delay(i * opts.delay).queue(function () {
                    // ie9, firefox에서 backgroundPosition에 대한 animate기능이 문제가 있어서 트릭으로 구현
                    $el.prop({
                        ypos: -y
                    }).stop().animate({
                        ypos: 0
                    }, {
                        duration: opts.duration,
                        easing: opts.easing,
                        step: function (now) {
                            $el.css('background-position', '0 ' + (y + now + 75) + 'px');
                        }
                    });
                    $el.dequeue(); // 큐를 제거
                });
                $el.children().html(n);
            });
        },
        // 업데이트
        // @param {Interger} newNumber 새로운 숫자값
        // $('..').rollingCounter('update', 1234); 로 호출하면 숫자가 변경됨
        update: function (newNumber) {
            var me = this;

            me.$el.attr('data-value', newNumber)
            me._numbers = newNumber + "";
            me._$items.attr('style', 'background-position:0 75px').children().html(0);
            me.start();
        }
    });
    jsa.bindjQuery(RollingCounter, 'rollingCounter');


    // 시간 타이머
    var TimeCountdown = Class({
        name: 'TimeCountdown',
        $extend: jsa.ui.View,
        $statics: {
            ON_TIMER_END: 'timecountdownend'
        },
        defaults: {
            height: 75,
            duration: 400,
            easing: 'easeInOutQuart',
            serverTime: 0,
            limits: [9, 5, 9, 5, 9, 9] // 각 요소별 최대수(초단위, 십초단위, 분단위, 십분단위, 시단위, 열시단위]
        },
        initialize: function (el, options) {
            var me = this;

            if (me.supr(el, options) === false) {
                me.destroy();
                return;
            }

            me._time = jsa.date.parseDate(me.options.time);
            me._timeGap = (+new Date) - me.options.serverTime; // 서버와 로컬의 시간차를 가지고 타이머를 시작한다.(보다 정확한 타이밍을 위해)
            me._$items = [].reverse.call(me.$el.find('>span')); // 숫자 노드를 찾아서 거꾸로 정렬

            me._init();
            me._timer();
        },

        // 초기 시간을 셋팅
        _init: function () {
            var me = this,
                time = me._time.getTime() - (+new Date) + me._timeGap;

            if (time < 0) {
                return;
            }

            var numbers = me._convertReverseTime(time);
            me._$items.css('background-position', '0 75px').data('number', 0).children().html(0); // 초기화(0위치로 설정)
            me._$items.each(function (i) {
                if (i >= numbers.length) {
                    return false;
                } // 자릿수까지 왔으면 멈춘다.(더이상의 처리는 무의미하므로...)

                var $el = me._$items.eq(i),
                    n = parseInt(numbers.substr(i, 1), 10); // 자릿수에 해당하는 수를 추출

                if (n == $el.data('number')) {
                    return;
                } // 현재 표시된 수와 동일하면 무시
                // n에 해당하는 백그라운드 위치를 지정
                $el.data('number', n).css('background-position', '0 ' + ((n + 1) * me.options.height) + 'px').children().html(n);
            });
        },
        // 타이머 실행
        _timer: function () {
            var me = this,
                time = me._time.getTime();

            // 완료
            if (time < 0) {
                me.$el.triggerHandler(TimeCountdown.ON_TIMER_END);
                clearInterval(me.interval);
                return;
            }

            // interval은 시간이 지날수록 오차가 커지므로, 로컬시간+서버시간과의 갭을 기준으로 잔여시간 계산
            me.interval = setInterval(function () {
                var now = time - (+new Date) + me._timeGap;
                if (now <= 0) {
                    clearInterval(me.interval);
                    me.$el.triggerHandler(TimeCountdown.ON_TIMER_END);
                } else {
                    me._update(now);
                }
            }, 200);
        },
        // 밀리초인 amount를 시분초로 변환한 후, 역으로 정렬
        _convertReverseTime: function (amount) {
            var zeroPad = jsa.number.zeroPad,
                days = 0,
                hours = 0,
                mins = 0,
                secs = 0;

            amount = amount / 1000;
            days = Math.floor(amount / 86400), amount = amount % 86400;
            hours = Math.floor(amount / 3600), amount = amount % 3600;
            mins = Math.floor(amount / 60), amount = amount % 60;
            secs = Math.floor(amount);

            return [].reverse.call((zeroPad(hours + (24 * days)) + zeroPad(mins) + zeroPad(secs)).split('')).join('');
        },
        // 애니메이트 수행
        _update: function (time) {
            var me = this,
                opts = me.options,
                limits = opts.limits,
                numbers = me._convertReverseTime(time);

            me._$items.each(function (i) {
                // 주어진 값의 자릿수까지 왔으면 멈춘다.
                if (i >= numbers.length) {
                    return false;
                }

                var $el = me._$items.eq(i),
                    no = $el.data('number'),
                    n = parseInt(numbers.substr(i, 1), 10),
                    y; // i번째 숫자를 가져옴

                if (n == no) {
                    return;
                } // 현재 표시된 숫자와 동일하면 무시함
                $el.data('number', n).children().html(n);
                y = (n + 1) * opts.height;

                // ie9, firefox에서 backgroundPosition에 대한 animate기능이 문제가 있어서 트릭으로 구현
                $el.prop('ypos', -75).stop().animate({
                    ypos: 0
                }, {
                    duration: opts.duration,
                    easing: opts.easing,
                    step: function (now) {
                        $el.css('background-position', '0 ' + (y - now) + 'px');
                    },
                    complete: function () {
                        // 한바퀴 돌았으면 다시 원위치 시킨다.
                        if (y === 0) {
                            $el.attr('style', 'background-position:0 ' + ((limits[i] + 2) * 75) + 'px');
                        }
                    }
                });
            });
        }
    });
    jsa.bindjQuery(TimeCountdown, 'timeCountdown');

    jsa.define('ui.Tiles', function () {

        // 소식함 타일 클래스
        var Tiles = Class({
            $extend: View,
            name: 'tiles',
            defaults: {
                itemWidth: 310,
                space: 18,
                scrollLoad: false,
                itemSelector: 'div.wrap_feed_cntt'
            },
            initialize: function (el, options) {
                var me = this;

                if (me.supr(el, options) === false) {
                    return;
                }

                me.init();
                me._configure();
                me.update();
            },
            // 기본작업
            init: function () {
                var me = this,
                    timer = null,
                    getDocHeight = jsa.util.getDocHeight;

                // 스크롤을 내릴때 새로 추가된 노드에 대해서 재배치
                me.options.scrollLoad && $(window).on('scroll.tiles', function () {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        var clientHeight = $(this).height(),
                            scrollTop = $(this).scrollTop(),
                            docHeight = getDocHeight();

                        if (docHeight - 100 < clientHeight + scrollTop) {
                            me.update(me.$el.find(me.options.itemSelector).length);
                        }
                    }, 400);
                });
            },
            // 갯수, 컬럼 계산
            _configure: function () {
                var me = this,
                    opts = me.options;

                me._width = me.$el.width(); // 컨테이너 너비
                me._itemWidth = opts.itemWidth + opts.space; // 아이템 너비
                me._colCount = Math.ceil(me._width / me._itemWidth); // 열 갯수

                // 컬럼당 height를 0으로 초기화
                me._colsHeight = [];
                for (var i = 0; i < me._colCount; i++) {
                    me._colsHeight[i] = 0;
                }
            },
            // 렬 중에서 가장 짧은 렬 반환
            _getMinCol: function () {
                var heights = this._colsHeight,
                    col = 0;
                for (var i = 0, len = heights.length; i < len; i++) {
                    if (heights[i] < heights[col]) {
                        col = i;
                    }
                }
                return col;
            },

            // 렬 중에서 가장 긴 렬 반환
            _getMaxCol: function () {
                var heights = this._colsHeight,
                    col = 0;
                for (var i = 0, len = heights.length; i < len; i++) {
                    if (heights[i] > heights[col]) {
                        col = i;
                    }
                }
                return col;
            },
            // 요소배치 수행
            // @param {Integer} start start번째 요소부터 배치수행(ajax에 의해 append된 요소부터 배치시키기 위함)
            update: function (start) {
                start = start || 0;

                var me = this,
                    space = me.options.space, // 박스간 간격
                    boxes = me.$el.find(me.options.itemSelector).filter(function (i) {
                        return i >= start;
                    }); // start이후의 요소를 필터링

                me.$el.css('visibility', 'hidden').show();

                boxes.each(function (i) {
                    var $this = $(this),
                        thisWidth = $this.width(),
                        thisHeight = $this.height(),
                        isBigItem = thisWidth > me._itemWidth,
                        col, top;

                    col = me._getMinCol(); // 젤 짧은 렬 검색
                    top = me._colsHeight[col];

                    // 두칸짜리이고 전체너비를 초과하는 경우에, 다음 행에 표시
                    if (isBigItem) {
                        if (col === me._colCount - 1) {
                            col = 0;
                        }

                        if (me._colsHeight.length > col) {
                            top = Math.max(me._colsHeight[col], me._colsHeight[col + 1]);
                            me._colsHeight[col + 1] = top + thisHeight + space;
                        }
                    }
                    // 컬럼마다 요소를 배치시키고, top+height를 기록(다음 요소의 top를 계산할 때 기준이 된다)
                    me._colsHeight[col] = top + thisHeight + space;

                    // 배치
                    // start: 131128
                    $this.css({
                        'top': top,
                        'left': col * me._itemWidth
                    });
                    // end: 131128
                });

                col = me._getMaxCol(me._colsHeight);
                me.$el.css({
                    'height': me._colsHeight[col] - space,
                    'visibility': ''
                });
                // start: 131128
                boxes.fadeIn();
                // end: 131128
            }
        });

        jsa.bindjQuery(Tiles, 'tiles');
        return Tiles;
    });

    jsa.define('ui.Search.KeywordRolling', function () {
        var KeywordRolling = Class({
            name: 'KeywordRolling',
            $extend: jsa.ui.View,
            $statics: {
                ON_SLIDE_END: 'slideend'
            },
            defaults: {
                start: 0,
                interval: 3000,
                useFade: true,
                autoStart: true
            },
            selectors: {
                items: 'ol>li',
                btnPlay: 'button.btn_keywd_control.play',
                btnPause: 'button.btn_keywd_control.stop',
                btnPrev: 'button.btn_keywd_control.pre',
                btnNext: 'button.btn_keywd_control.next',
                indicators: 'a.d_indicator'
            },
            events: {
                'click div.keywd_control button': function (e) {
                    e.preventDefault();
                    var me = this,
                        $this = $(e.currentTarget);

                    if ($this.hasClass('pre')) {
                        me.prev();
                    } else if ($this.hasClass('stop')) {
                        me.stop();
                        me.$btnPlay.focus();
                    } else if ($this.hasClass('play')) {
                        me.play();
                        me.$btnPause.focus();
                    } else if ($this.hasClass('next')) {
                        me.next();
                    }
                }
            },
            initialize: function (el, options) {
                var me = this;
                if (me.supr(el, options) === false) {
                    me.destroy();
                    return;
                }
                me._current = 0;
                me._count = me.$items.length;
                me._isMouseOver = false;
                me._isPlay = true;
                me._isMouseOver = false;

                if (me._count === 0) {
                    me.destroy();
                    return;
                }

                me.on('mouseenter', 'li', function (e) {
                    me.select($(this).index());
                }).on('mouseenter focusin mouseleave focusout', function (e) {
                    switch (e.type) {
                    case 'mouseenter':
                    case 'focusin':
                        me._isMouseOver = true;
                        break;
                    case 'mouseleave':
                    case 'focusout':
                        me._isMouseOver = false;
                        break;
                    }
                });

                me.select(me.options.start);
                me.options.autoStart && me.play();
            },
            select: function (index) {
                var me = this;
                if (index < 0) {
                    index = me._count - 1;
                } else if (index >= me._count) {
                    index = 0;
                }

                me.$items.removeClass('on').eq(index).addClass('on');
                me.$indicators.removeClass('on').eq(index).addClass('on');
                me._current = index;

                me.triggerHandler('slideend', [index]);
            },
            play: function () {
                var me = this;
                if (me.timer) {
                    return;
                }

                me.timer = setInterval(function () {
                    if (me._isMouseOver) {
                        return;
                    }
                    me.next();
                }, me.options.interval);

                me._isPlay = true;

                me.$btnPlay.hide();
                me.$btnPause.show();
                me.triggerHandler('play');
            },
            stop: function () {
                var me = this;
                if (me.timer) {
                    clearInterval(me.timer);
                    me.timer = null;
                }

                me._isPlay = false;

                me.$btnPlay.show();
                me.$btnPause.hide();
                me.triggerHandler('stop');
            },
            prev: function () {
                var me = this;

                me.select(me._current - 1);
            },
            next: function () {
                var me = this;

                me.select(me._current + 1);
            }
        });

        //code.bindjQuery(KeywordRolling, 'KeywordRolling');

        return KeywordRolling;
    });

    jsa.define('ui.SpyScroller', function () {
        /**
         * SCROLL 추척 메뉴
         * @class
         * @name jsa.ui.SpyScroller
         * @example
         * new jsa.ui.SpyScroller('#nav');
         * // or
         * $('#nav').spyScroller();
         */
        var SpyScroller = Class({
            name: 'SpyScroller',
            $extend: jsa.ui.View,
            defaults: {
                activeClass: 'on',
                offset: 43,
                duration: 300,
                easing: 'easeInQuart',
                zIndex: 9999
            },
            selectors: {
                items: 'a'
            },
            /**
             * 생성자
             * @function
             * @name jsa.ui.SpyScroller#initialize
             */
            initialize: function (el, options) {
                var me = this;

                me.supr(el, options);

                me.$panels = $([]);
                me.$items.each(function (i) {
                    me.$panels.push($($(this).attr('href')));
                });
                if (me.$panels.length === 0) {
                    return;
                }


                me.$el.css('zIndex', 100);
                me.$parent = me.$el.parent();
                me.$body = $('html, body');
                me.defaultId = me.$panels.get(0)[0].id;
                me.minScroll = me.$panels.get(0).offset().top;
                me.originalPos = me.$el.offset();
                me.parentPadding = parseInt(me.$parent.css('paddingLeft'), 10);
                me.$tmpEl = $('<div class="' + me.$el[0].className + '" style="height:' + me.$el.height() + 'px;display:none"></div>');
                me.$tmpEl.insertAfter(me.$el);

                me._initSpyScroller();
                me.onScrolling();
            },

            /**
             * 초기화 작업 수행: window.onscroll 바인딩, 메뉴 클릭 바인딩, 공간유지를 위한 빈복제본 생성
             * @function
             * @private
             * @name jsa.ui.SpyScroller#_initSpyScroller
             */
            _initSpyScroller: function () {
                var me = this,
                    ns = me.getEventNamespace();

                me.$scrollEl = $win.off(ns).on('resize' + ns + ' scroll' + ns, me.onScrolling.bind(me));

                me.$el.on('click', 'a', function (e) {
                    e.preventDefault();
                    var $el = $(this),
                        href = $el.data('target') || $el.attr('href'),
                        $href = $(href);

                    if ($href.length === 0) {
                        return false;
                    }

                    var top = $href.offset().top;
                    me.$body.stop().animate({
                        scrollTop: top - me.options.offset
                    }, {
                        duration: me.options.duration,
                        easing: me.options.easing,
                        complete: function () {
                            //location.hash = href;
                        }
                    });
                });

            },

            /**
             * window.onscroll 핸들러
             * @function
             * @name jsa.ui.SpyScroller#onScrolling
             */
            onScrolling: function (e) {
                var me = this,
                    scrollTop = me.$scrollEl.scrollTop(),
                    scrollLeft = me.$scrollEl.scrollLeft(),
                    scrollTopOffset = scrollTop + me.options.offset,
                    scrollHeight = me.$scrollEl[0].scrollHeight || me.$body[0].scrollHeight,
                    maxScroll = scrollHeight - me.$scrollEl.height(),
                    activeId = me.activeId,
                    $panels = me.$panels,
                    $p, id = me.defaultId,
                    style = {};

                if (me.originalPos.top < scrollTop) {
                    if (!me.fixed) {
                        me.$el.css({
                            position: 'fixed',
                            zIndex: me.options.zIndex,
                            top: 0
                        });
                        me.$tmpEl.show();
                    }
                    me.fixed = true;
                    if (scrollLeft > 0) {
                        me.$el.css('left', me.$parent.offset().left - scrollLeft + me.parentPadding);
                    } else {
                        me.$el.css('left', '');
                    }
                } else {
                    if (me.fixed) {
                        me.$el.css({
                            position: '',
                            zIndex: '',
                            top: '',
                            left: ''
                        });
                        me.$tmpEl.hide();
                    }
                    me.fixed = false;
                    me.activate(me.defaultId);
                    return;
                }

                if (scrollTop >= maxScroll) {
                    return activeId !== (id = $panels.last().get(0)[0].id) && me.activate(id);
                }

                for (var i = 0, len = $panels.size(); i < len; i++) {
                    $p = $panels.get(i);
                    if ($p.offset().top > scrollTopOffset) {
                        break;
                    }
                    id = $p[0].id;
                };

                if (activeId !== id) {
                    me.activate(id);
                }
            },

            /**
             * 파괴자 :
             * @function
             * @name jsa.ui.SpyScroller#destroy
             */
            destroy: function () {
                var me = this;

                me.supr();
                $win.off(me.getEventNamespace());
                me.$tmpEl.remove();
            },

            /**
             * 현재 화면안에 들어와 있는 영역의 해당 메뉴를 활성화 시켜준다.
             * @function
             * @name jsa.ui.SpyScroller#activate
             */
            activate: function (id) {
                var me = this,
                    activeClass = me.options.activeClass,
                    active;

                me.activeId = id;
                me.$items
                    .parent('li')
                    .removeClass(activeClass);

                active = me.$items.filter('[href=#' + id + ']')
                    .parent('li')
                    .addClass(activeClass);
                // TODO
                me.trigger('activate', [active]);
            }
        });

        jsa.bindjQuery(SpyScroller, 'spyScroller');

        return SpyScroller;
    });


    // 아티스트 파인더 모듈
    jsa.define('ui.ArtistFinder', function () {

        // 각 장르에 해당하는 세부장르 셋팅
        // 가요 : 0101, 팝 : 0201, OST : 0301, 일본음악 : 0401, 클래식 : 0501, CCM : 0601, 어린이 : 0701, 뉴에이지 : 0801, 재즈 : 0901, 월드 : 1001, 종교음악 : 1101, 국악 : 1201, 중국음악 : 1301
        var genres = {
            '0101': [{
                'cd': '0102',
                'name': '발라드'
            }, {
                'cd': '0103',
                'name': '댄스'
            }, {
                'cd': '0104',
                'name': '랩/힙합'
            }, {
                'cd': '0105',
                'name': 'R&B/소울'
            }, {
                'cd': '0106',
                'name': '락'
            }, {
                'cd': '0107',
                'name': '일렉트로니카'
            }, {
                'cd': '0108',
                'name': '트로트'
            }, {
                'cd': '0109',
                'name': '포크'
            }, {
                'cd': '0110',
                'name': '인디음악'
            }],
            '0201': [{
                'cd': '0202',
                'name': '팝'
            }, {
                'cd': '0203',
                'name': '락'
            }, {
                'cd': '0204',
                'name': '얼터너티브락'
            }, {
                'cd': '0205',
                'name': '하드락'
            }, {
                'cd': '0206',
                'name': '모던락'
            }, {
                'cd': '0207',
                'name': '헤비메탈'
            }, {
                'cd': '0208',
                'name': '뉴 메탈/하드코어'
            }, {
                'cd': '0209',
                'name': '프로그레시브/아트락'
            }, {
                'cd': '0210',
                'name': '일렉트로니카'
            }, {
                'cd': '0211',
                'name': '클럽뮤직'
            }, {
                'cd': '0212',
                'name': '랩/힙합'
            }, {
                'cd': '0213',
                'name': 'R&amp;B/소울'
            }, {
                'cd': '0214',
                'name': 'Urban'
            }, {
                'cd': '0215',
                'name': '올디스'
            }, {
                'cd': '0216',
                'name': '포크'
            }, {
                'cd': '0217',
                'name': '블루스'
            }, {
                'cd': '0218',
                'name': '컨트리'
            }, {
                'cd': '0219',
                'name': '월드팝'
            }],
            '0301': [{
                'cd': '0301',
                'name': '국내영화'
            }, {
                'cd': '0302',
                'name': '국외영화'
            }, {
                'cd': '0303',
                'name': '국내드라마'
            }, {
                'cd': '0304',
                'name': '국외드라마'
            }, {
                'cd': '0305',
                'name': '애니메이션/게임'
            }, {
                'cd': '0306',
                'name': '국내뮤지컬'
            }, {
                'cd': '0307',
                'name': '국외뮤지컬'
            }],
            '0401': [{
                'cd': '0402',
                'name': 'J-POP'
            }, {
                'cd': '0403',
                'name': 'J-Rock'
            }, {
                'cd': '0404',
                'name': '일렉트로니카'
            }, {
                'cd': '0405',
                'name': '랩/힙합'
            }, {
                'cd': '0406',
                'name': 'R&amp;B/소울'
            }, {
                'cd': '0407',
                'name': '시부야케이'
            }, {
                'cd': '0408',
                'name': '뉴에이지'
            }, {
                'cd': '0409',
                'name': '재즈'
            }],
            '0501': [{
                'cd': '0501',
                'name': '관현악곡'
            }, {
                'cd': '0502',
                'name': '교향곡'
            }, {
                'cd': '0503',
                'name': '실내악'
            }, {
                'cd': '0504',
                'name': '협주곡'
            }, {
                'cd': '0505',
                'name': '독주곡'
            }, {
                'cd': '0506',
                'name': '오페라'
            }, {
                'cd': '0507',
                'name': '크로스오버'
            }, {
                'cd': '0508',
                'name': '현대음악'
            }, {
                'cd': '0509',
                'name': '성악/합창곡'
            }, {
                'cd': '0510',
                'name': '발레/무용곡'
            }],
            '0601': [{
                'cd': '0601',
                'name': '국내CCM'
            }, {
                'cd': '0602',
                'name': '국외CCM'
            }, {
                'cd': '0603',
                'name': '워십'
            }, {
                'cd': '0604',
                'name': '찬송가'
            }, {
                'cd': '0605',
                'name': '성가'
            }, {
                'cd': '0606',
                'name': '연주곡'
            }, {
                'cd': '0607',
                'name': '어린이'
            }],
            '0701': [{
                'cd': '0701',
                'name': '동요세상'
            }, {
                'cd': '0702',
                'name': '동화나라'
            }, {
                'cd': '0703',
                'name': '만화잔치'
            }, {
                'cd': '0704',
                'name': '영어마을'
            }, {
                'cd': '0705',
                'name': '어린이클래식'
            }],
            '0801': [{
                'cd': '0801',
                'name': '이지 리스닝'
            }, {
                'cd': '0802',
                'name': 'J-Newage'
            }, {
                'cd': '0803',
                'name': '기능성 음악'
            }, {
                'cd': '0804',
                'name': '뉴에이지 피아노'
            }],
            '0901': [{
                'cd': '0902',
                'name': 'Acid Jazz'
            }, {
                'cd': '0903',
                'name': 'Bop'
            }, {
                'cd': '0904',
                'name': 'Bossa nova'
            }, {
                'cd': '0905',
                'name': 'J-Jazz'
            }, {
                'cd': '0906',
                'name': 'Latin Jazz'
            }, {
                'cd': '0907',
                'name': 'Big Bang/Swing'
            }],
            '1001': [{
                'cd': '1002',
                'name': 'French Pop/Chanson'
            }, {
                'cd': '1003',
                'name': 'Itanlian Pop/Canzone'
            }, {
                'cd': '1004',
                'name': 'Celtic/Irish'
            }, {
                'cd': '1005',
                'name': 'Brazil'
            }, {
                'cd': '1006',
                'name': 'Tango/Flamenco'
            }, {
                'cd': '1007',
                'name': 'Latin'
            }, {
                'cd': '1008',
                'name': 'Reggae'
            }, {
                'cd': '1009',
                'name': 'Fado'
            }],
            '1101': [{
                'cd': '1102',
                'name': '불교음악'
            }, {
                'cd': '1103',
                'name': '가톨릭음악'
            }],
            '1201': [{
                'cd': '1201',
                'name': '국악 크로스오버'
            }, {
                'cd': '1202',
                'name': '국악가요'
            }, {
                'cd': '1203',
                'name': '민요'
            }, {
                'cd': '1204',
                'name': '판소리/단가'
            }, {
                'cd': '1205',
                'name': '풍물/사물놀이'
            }],
            '1301': [{
                'cd': '1302',
                'name': 'C-POP'
            }, {
                'cd': '1303',
                'name': 'C-Rock'
            }]
        },
            isTouch = jsa.isTouch;


        // 연대 슬라이더 클래스(private)
        var PeriodSlider = Class({
            $extend: jsa.ui.View,
            name: 'PeriodSlider',
            defaults: {
                width: 588, // 총너비
                distance: 84, // 눈금당 간격
                items: [0, 1960, 1970, 1980, 1990, 2000, 2010, 2020],
                startYear: 0,
                endYear: 2020
            },
            selectors: {
                btnMin: 'div.yearlk_bar.last', // 연대 왼쪽버튼
                btnMax: 'div.yearlk_bar.start', // 연대 오른쪽 버튼
                sliderBar: 'div.yearlk_bar.bar_year'
            },
            initialize: function (el, options) {
                var me = this;

                if (me.supr(el, options) === false) {
                    return;
                }

                me.$btnMin.css('zIndex', 101);
                me.$btnMax.css('zIndex', 100);

                me._moveX = me._downX = me._currX = 0; // 드래그앤드롭을 위한 속성값
                me._isMouseDown = false;
                me.$activeBtn = me.$lastMovedBtn = null; // 현재 드래그중인 버튼, 마지막으로 움직인 버튼을 기억하기 위함
                me._currStartLeft = parseInt(me.$btnMin.css('width'), 10); // 왼쪽버튼의 위치(너비값으로 위치 조절)
                me._currEndLeft = parseInt(me.$btnMax.css('width'), 10); // 오른쪽버튼의 위치(너비값으로 위치 조절)
                me._maxWidth = me.options.width;

                // 년대 링크를 클릭할 때 해당 위치로 이동
                me.on('click', 'div.yearlk_text>a', function (e) {
                    e.preventDefault();

                    var left = $(this).index() * me.options.distance,
                        diffMin = Math.abs(me._currStartLeft - left),
                        diffMax = Math.abs(me._currEndLeft - left);

                    if (me._currStartLeft > left) {
                        me.$activeBtn = me.$btnMin;
                    } else if (me._currEndLeft < left) {
                        me.$activeBtn = me.$btnMax;
                    } else if (diffMin > diffMax) {
                        me.$activeBtn = me.$btnMax;
                    } else if (diffMin < diffMax) {
                        me.$activeBtn = me.$btnMin;
                    } else if (me.$lastMovedBtn) {
                        me.$activeBtn = me.$lastMovedBtn;
                    } else {
                        return;
                    }

                    me._move(left);
                    me.$activeBtn = null;
                });

                // 드래그 시작
                me.on('mousedown touchstart', 'div.last>div.sel, div.start>div.sel', function (e) {
                    e.preventDefault();
                    if (isTouch) {
                        e.stopPropagation();
                    }

                    me._isMouseDown = true;
                    me._currX = parseInt($(this).parent().css('width'), 10);
                    me._downX = me._getX(e);
                    me.$activeBtn = $(this).parent();

                    return false;
                }).on('keydown', 'div.yearlk_bar div.sel', function (e) {
                    //좌우 버튼
                    var $btn = $(this).parent(),
                        left = parseInt($btn.css('width'), 10);

                    switch (e.keyCode) {
                    case 37: // left
                        left -= me.options.distance;
                        break;
                    case 39: // right
                        left += me.options.distance;
                        break;
                    }
                    me.$activeBtn = $btn;
                    me._move(left);
                    me.$activeBtn = null;
                });

                // 드래그 종료
                $doc.on('mouseup.artistfinder touchend.artistfinder mousemove.artistfinder touchmove.artistfinder', function (e) {
                    if (!me._isMouseDown) {
                        return;
                    }

                    switch (e.type) {
                    case 'mouseup':
                    case 'touchend':
                        me._isMouseDown = false;
                        me._moveX = 0;
                        // 드래그가 끝났을 때, 해당 위치에서 가장 가까운 눈금으로 이동
                        me._fixPos();

                        me.$activeBtn = null;
                        break;
                    case 'mousemove':
                    case 'touchmove':
                        me._moveX = me._getX(e);
                        me._move(me._currX - (me._downX - me._moveX));

                        e.preventDefault();
                        break
                    }
                });

                me.init();
            },

            // 초기화 함수
            init: function () {
                var me = this;

                me.moveByYear(me.options.startYear, me.options.endYear);
            },

            // 마우스 이벤트로부터 x좌표 추출
            _getX: function (e) {
                if (isTouch && e.originalEvent.touches) {
                    e = e.originalEvent.touches[0];
                }
                return e.pageX;
            },

            // 현재 활성화된 버튼을 left위치로 이동
            _move: function (left) {
                var me = this,
                    distance = me.options.distance;

                if (!me.$activeBtn) {
                    return;
                }

                if (me.$activeBtn.hasClass('last')) {
                    if (left >= me._currEndLeft - distance) {
                        left = me._currEndLeft - distance;
                    } else if (left < 0) {
                        left = 0;
                    }
                    me._currStartLeft = left;
                } else {
                    if (left < me._currStartLeft + distance) {
                        left = me._currStartLeft + distance;
                    } else if (left > me._maxWidth) {
                        left = me._maxWidth;
                    }
                    me._currEndLeft = left;
                }
                me.$lastMovedBtn = me.$activeBtn.css('width', left);
            },

            // 주어진 년대에 해당하는 위치에 버튼을 옮김
            moveByYear: function (startYear, endYear) {
                var me = this,
                    distance = me.options.distance,
                    startIdx = jsa.array.indexOf(me.options.items, startYear),
                    endIdx = jsa.array.indexOf(me.options.items, endYear);

                if (startIdx > 0) {
                    me.$activeBtn = me.$btnMin;
                    me._move(startIdx * distance);
                }
                if (endIdx > 0) {
                    me.$activeBtn = me.$btnMax;
                    me._move(endIdx * distance);
                }
                me.$activeBtn = null;
            },

            // 버튼이 놓여진 위치에서 가장 가까운 눈금의 위치로 이동
            _fixPos: function () {
                var me = this,
                    distance = me.options.distance;
                if (!me.$activeBtn) {
                    return;
                }

                var left = parseInt(me.$activeBtn.css('width'), 10);

                left = (Math.round(left / distance) * distance);
                me._move(left);
            },

            // 년대값을 조합해서 반환
            getValue: function () {
                var me = this,
                    distance = me.options.distance,
                    items = me.options.items,
                    startIndex = Math.round(me._currStartLeft / distance),
                    endIndex = Math.round(me._currEndLeft / distance),
                    startTitle = '',
                    endTitle = '',
                    value = [],
                    isSelected = false;

                if (startIndex !== 0 || endIndex !== items.length - 1) {
                    isSelected = true;
                    startTitle = startIndex === 0 ? items[1] + ' 이전' : items[startIndex];
                    endTitle = endIndex === items.length - 1 ? items[items.length - 2] + ' 이후' : items[endIndex];

                    for (var i = startIndex; i <= endIndex; i++) {
                        value.push(items[i]);
                    }
                }

                return {
                    'isYearSelected': isSelected, // 년대가 변경되었는가...(두 버튼이 양쪽끝에 위치해 있으면 변경이 없었던 걸로 판단)
                    'startYear': startTitle,
                    'endYear': endTitle,
                    'startTitle': startTitle,
                    'endTitle': endTitle,
                    'years': value // 시작년대와 마지막년대 사이의 년대를 배열로 조합
                }
            }
        });

        /**
         * 아티스트파인더 검색영역 담당클래스
         * @class
         * @name jsa.ui.ArtistFinder
         * @extends jsa.ui.View
         */
        var ArtistFinder = Class( /** @lends jsa.ui.ArtistFinder# */ {
            $extend: jsa.ui.View,
            $statics: {
                ON_SEARCH: 'artistfindersearch'
            },
            name: 'ArtistFinder',
            defaults: {

            },
            selectors: {

            },
            events: {
                // 성별, 활동유현, 국적 선택시
                'click dl:not(.gnr) input:radio:not(:disabled)': function (e) {
                    var me = this,
                        $radio = $(e.target);

                    $radio.parent().activeRow('on');
                    me.triggerHandler(ArtistFinder.ON_SEARCH, [me.getValue(), me.getPeriodValue()]);
                },
                // 장르 선택시 세부장르 표시
                'click dl.gnr input:radio:not(:disabled)': function (e) {
                    var me = this,
                        $radio = $(e.target),
                        $dd = me.$el.find('dl.gnr_dtl>dd'), // 리스트 영역
                        html = '',
                        key = '',
                        name = '';;

                    $dd.find('>label').remove();
                    if (genres[$radio.val()]) {
                        // 세부장르가 있느냐
                        $dd.find('>div.finder_wrong').hide();

                        html += ['<label class="on"><input type="radio" name="genreCd" value="' + $radio.val() + '" class="input_radio" checked="checked" />',
                            '<span class="text">전체</span></label>'
                        ].join('');

                        $.each(genres[$radio.val()], function (i, item) {
                            html += ['<label><input type="radio" name="genreCd" value="' + item.cd + '" class="input_radio" />',
                                '<span class="text">' + item.name + '</span></label>'
                            ].join('');

                        });
                        $dd.append(html);
                    } else {
                        // 세부장르가 없느냐

                        $dd.find('>div.finder_wrong').show();
                        html += ['<label style="display:none;"><input type="radio" name="genreCd" value="' + $radio.val() + '" class="input_radio" checked="checked" /></label>'].join('');
                        $dd.append(html);
                    }

                    $radio.parent().activeRow('on');
                    me.triggerHandler(ArtistFinder.ON_SEARCH, [me.getValue()]);
                }
            },
            /**
             * 생성자
             * @param {String|Element|jQuery} el 해당 엘리먼트(노드, id, jQuery 어떤 형식이든 상관없다)
             * @param {Object} options 옵션값
             */
            initialize: function (el, options) {
                var me = this;

                if (me.supr(el, options) === false) {
                    return;
                }

                // 연대 슬라이더 생성
                me.periodSlider = new PeriodSlider(me.options.periodSelector);

                // 연대적용 버튼 클릭시
                me.$el.find('button.btn_big.calendar').on('click', function () {
                    me.triggerHandler(ArtistFinder.ON_SEARCH, [me.getValue(), me.getPeriodValue()]);
                });
            },

            /**
             * 선택된 라디오들의 값을 조합해서 반환
             * @return {JSON}
             */
            getValue: function () {
                var me = this,
                    data = {};

                me.$el.find('input:radio:checked:not(:disabled)').each(function () {
                    var $radio = $(this);
                    data[$radio.attr('name')] = $radio.val();
                });
                return data;
            },

            /**
             * 연대값 반환
             * @return {JSON}
             */
            getPeriodValue: function () {
                var me = this;

                return me.periodSlider.getValue()
            },

            /**
             * 선택된 값들의 텍스트를 배열에 담아 반환, 연대는 시작연대~마지막연대 로 담겨짐
             * @return {Array}
             */
            getSearchTitles: function () {
                var me = this,
                    titles = [],
                    periodValue = me.periodSlider.getValue();

                me.$el.find('input:radio:checked:not(:disabled)').each(function () {
                    if (this.value === '') {
                        return;
                    }

                    var $radio = $(this),
                        title = $radio.next().text();
                    title && titles.push(title);
                });

                if (periodValue.isYearSelected) {
                    titles.push(periodValue.startTitle + '~' + periodValue.endTitle)
                }
                return titles;
            },

            /**
             * 소멸자
             */
            destroy: function () {
                var me = this;

                me.periodSlider.destroy();
                me.periodSlider = null;
                me.supr();
            }
        });

        jsa.bindjQuery(ArtistFinder, 'artistFinder');

        return ArtistFinder;
    });

    // 년월일 셀렉트 박스
    jsa.define('ui.DatePulldown', function () {
        var dateUtil = jsa.date;

        /**
         * 년월일 셀렉트박스
         * @class
         * @name jsa.ui.DatePulldown
         * @extends jsa.ui.View
         * @example
         * $('select.d_name').datePulldown({year: 'select.d_year', month: 'select.d_month'});
         */
        var DatePulldown = Class( /** @lends jsa.ui.DatePulldown# */ {
            name: 'DatePulldown',
            $extends: jsa.ui.View,
            $statics: {
                ON_CHANGE: 'change'
            },
            /**
             * 생성자
             * @param {String|Element|jQuery} el 해당 엘리먼트(노드, id, jQuery 어떤 형식이든 상관없다)
             * @param {Object} options 옵션값
             */
            initialize: function (el, options) {
                options || (options = {});
                if (!options.year || !options.month) {
                    return;
                }

                var me = this,
                    $year, $month;

                $year = $(options.year);
                if ($year.length === 0) {
                    return;
                }

                $month = $(options.month);
                if ($month.length === 0) {
                    return;
                }

                if (me.supr(el, options) === false) {
                    return;
                }

                $year.add($month).on('change', function () {
                    me.$el[0].options.length = 1;

                    var year = $year.val(),
                        month = $month.val(),
                        days = 0;

                    if (year && month) {
                        days = dateUtil.daysInMonth(year, month);
                        for (var i = 1; i <= days; i++) {
                            me.$el[0].options[i] = new Option(i, i);
                        }
                    }

                    me.$el.selectbox('update');
                });
                $year.triggerHandler('change');
            }
        });

        jsa.bindjQuery(DatePulldown, 'datePulldown');

        return DatePulldown;
    });

})(window, jQuery, jsa);
