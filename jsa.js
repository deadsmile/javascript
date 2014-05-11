/*!
 * @author 김승일
 * @email comahead@nate.com
 * @description 코어 라이브러리
 *
 *
 * @Searching List
 * @jQuery
 *  $.fn
 *      .showLayer() : div를 표시하고 layershown 이벤트 발생.
 *      .hideLayer() : div를 숨기고 layerhidden 이벤트 발생.
 *      .disabled() : disabled속성 변경과 disabled 클래스 토글.
 *      .checked() : checked속성 변경과 changed이벤트 발생
 *      .replaceClass() : 클래스 변환
 *      .checkedValues() : 체크된 값을 반환
 *      .activeItem() : 이전에 추가된 'on'를 지우고 현재 요소에 'on'클래스를 삽입
 *      .trimVal() : 폼요소의 값에서 앞뒤 스페이스를 제거한 값을 반환
 *      .buildUIControls() : 요소에 포함된 공통 UI모듈을 빌드
 *
 *
 * @Core : 코어 함수
 * jsa
 *          .$win : $(window)
 *          .$doc : $(document)
 *          .$body : $(document.body)
 *          .each() : 반복자
 *          .extend() :  속성 복사
 *          .namespace() : 네임스페이스 생성
 *          .define() : jsa를 루트로 한 네임스페이스 생성
 *          .hasOwn() : Object.prototype.hasOwnProperty 단축명
 *          .is() : 타입 체크
 *          .isEmpty() : 빈값 체크
 *          .toArray() : 주어진 값을 배열로 변환
 *          .getUniqId() : 고유값 생성(32자리)
 *          .nextSeq() : 0에서 1씩 증가시킨 순번을 반환
 *          .template() : 템플릿 생성
 *          .Class() : OOP 클래스 정의함수
 *          .Base : OOP 클래스의 Root
 *
 *
 * @Browser : 브라우저 정보
 * jsa.browser
 *          .isMobile   : 모바일여부
 *          .isRetina   : 레티나 여부
 *          .isAndroid  : 안드로이드 여부
 *          .isOpera    : 오페라
 *          .isWebKit   : 웹킷
 *          .isTouch    : 터치여부
 *          .isIE       : IE
 *          .isIE6      : IE 6버전
 *          .isIE7      : IE 7버전
 *          .isOldIE    : IE 6, 7, 8버전
 *          .version    : IE버전
 *          .isChrome   : 크롬
 *          .isGecko    : 파폭
 *          .isMac      : 맥 OS
 *          .isAir      : Adobe Air
 *          .isIDevice  : 모바일 디바이스
 *          .isSafari   : 사파리
 *          .isIETri4   : 쿼크
 *
 * @Util : Util함수 모음
 * jsa.util
 *          .png24(...)              : png 투명 처리
 *          .openPopup(...)          : 팝업 띄우기
 *          .resizePopup(...)        : 팝업 리사이즈
 *          .popupCoords(...)        : 팝업을 화면 가운데에 위치시키기
 *          .centeringImage(...)     : 이미지를 가운데 위치시키기
 *          .lazyImages(...)         : 이미지로딩 대기
 *          .getDocHeight(...)       : 도큐먼트 height
 *          .getDocWidth(...)        : 도큐먼트 width
 *          .getWinWidth(...)        : 윈도우 width
 *          .getWinHeight(...)       : 윈도우 height
 *
 * @UI : UI 모듈
 * jsa.ui
 * 		    .AccordionList             : 아코디언 리스트
 * 		    .Calendar                  : 달력
 * 	        .Modal                     : 모달
 *          .Paginate                  : 페이지네이션
 *          .Placeholder               : 플레이스홀더
 *          .ScrollView                : 커스텀스크롤
 *          .Selectbox                 : 스킨형 셀렉트박스
 *          .Slider                    : 슬라이더
 *          .Tab                       : 탭컨트롤
 *
 */
(function (context, $, undefined) {


    "use strict";
    /* jshint expr: true, validthis: true */
    /* global jsa, alert, escape, unescape */

    var LIB_NAME = window.LIB_NAME = 'jsa';
    var $root = $(document.documentElement).addClass('js');
    ('ontouchstart' in context) && $root.addClass('touch');
    ('orientation' in context) && $root.addClass('mobile');

    /**
     * @namespace
     * @name jsa
     * @description root namespace of hib site
     */
    var _core = context[LIB_NAME] || (context[LIB_NAME] = {});

    var arrayProto = Array.prototype,
        objectProto = Object.prototype,
        toString = objectProto.toString,
        hasOwn = objectProto.hasOwnProperty,
        arraySlice = arrayProto.slice,
        doc = context.document,
        tmpInput = doc.createElement('input'),
        tmpNode = doc.createElement('div'),
        emptyFn = function () {},
        /**
         * 반복 함수
         * @function
         * @name jsa.each
         * @param {Array|JSON} obj 배열 및 json객체
         * @param {function(this:Array|Object, value, index)} cb
         * @param {Object} ctx
         * @returns {*}
         */
        each = function (obj, cb, ctx) {
            if (!obj) {
                return obj;
            }
            var i = 0,
                len = 0,
                isArray = obj.push && ('length' in obj);

            if (isArray) {
                if (obj.forEach) {
                    if (obj.forEach(cb, ctx || obj) === false) {

                    }
                } else {
                    for (i = 0, len = obj.length; i < len; i++) {
                        if (cb.call(ctx || obj, obj[i], i, obj) === false) {
                            break;
                        }
                    }
                }
            } else {
                for (i in obj) {
                    if (hasOwn.call(obj, i)) {
                        if (cb.call(ctx || obj, obj[i], i, obj) === false) {
                            break;
                        }
                    }
                }
            }
            return obj;
        },
        /**
         * 확장 함수
         * @function
         * @name jsa.extend
         * @param {JSON} obj...
         * @returns {*}
         */
        extend = function (deep, obj) {
            var args;
            if(deep === true) {
                args = arraySlice.call(arguments, 2);
            } else {
                obj = deep;
                deep = false;
                args = arraySlice.call(arguments, 1);
            }
            each(args, function (source) {
                if(!source) { return; }

                each(source, function (val, key) {
                    if(deep && (_core.isArray(val) || _core.isPlainObject(val))) {
                        obj[key] || (obj[key] = _core.isArray(val) ? [] : {});
                        obj[key] = extend(deep, obj[key], val);
                    } else {
                        obj[key] = val;
                    }
                });
            });
            return obj;
        },
        /**
         * 복제 함수
         * @function
         * @name jsa.clone
         * @param {JSON} obj 배열 및 json객체
         * @returns {*}
         */
        clone = function (obj) {
            if (null == obj || "object" != typeof obj) return obj;

            if (obj instanceof Date) {
                var copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }

            if (obj instanceof Array) {
                var copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = clone(obj[i]);
                }
                return copy;
            }

            if (obj instanceof Object) {
                var copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
                }
                return copy;
            }
            throw new Error('oops!! clone is fail');
        };

    _core.name = LIB_NAME;

    extend(_core, {
        each: each,
        extend: extend,
        clone: clone
    });

    if (typeof Function.prototype.bind === 'undefined') {
        /**
         * 함수내의 컨텐스트를 지정
         * @param {Object} context 컨텍스트
         * @param {Mixed} ... 두번째 인자부터는 실제로 싱행될 함수로 전달된다.
         * @example
         * function Test() {
         *		alert(this.name);
         * }.bind({name: 'axl rose'});
         *
         * Test(); -> alert('axl rose');
         */
        Function.prototype.bind = function () {
            var __method = this,
                args = arraySlice.call(arguments),
                object = args.shift();

            return function (context) {
                // bind로 넘어오는 인자와 원본함수의 인자를 병합하여 넘겨줌.
                var local_args = args.concat(arraySlice.call(arguments));
                if (this !== window) {
                    local_args.push(this);
                }
                return __method.apply(object, local_args);
            };
        };
    }

    if (!window.console) {
        window.console = {};
        each(['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'],
            function (method) {
                console[method] = function () {};
            });
    }

    /**
     * jQuery 객체
     * @class
     * @name $
     */

    $.extend(jQuery.expr[':'], {
        focusable: function (el, index, selector) {
            return $(el).is('a, button, :input, [tabindex]');
        }
    });

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
        var supportPlaceholder = ('placeholder' in tmpInput);

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
     * @param {Boolean} isBubble 버블링 여부
     * @returns {jQuery}
     * @fires $#changed
     * @example
     * // 먼저 changed 이벤트 바인딩
     * $('input:checkbox').on('changed', function(e, isChecked) { $(this).parent()[isChecked?'addClass':'removeClass']('on'); });
     * ..
     * // checked 값을 변경
     * $('input:checkbox').checked(true); // 해당체크박스의 부모에 on클래스가 추가된다.
     */
    $.fn.checked = function (checked, isBubble) {
        return this.each(function () {
            if (this.type !== 'checkbox' && this.type !== 'radio') {
                return;
            }
            /**
             * @event $#changed
             * @type {object}
             * @peoperty {boolean} checked - 체크 여부
             */
            $(this).prop('checked', checked)[isBubble === false ? 'triggerHandler' : 'trigger']('checkedchanged', [checked])
                .parent().toggleClass('on', checked);
        });
    };

    /**
     * 클래스 치환
     * @function
     * @name $#replaceClass
     * @param {String} old 대상클래스
     * @param {String} newCls 치환클래스
     * @returns {jQuery}
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
    $.fn.showLayer = function (options, isBubble) {
        options = extend({
            onShow: _core.emptyFn,
            opener: null
        }, options);

        return this.each(function () {
            var $this = $(this),
                trigger = [isBubble === false ? 'triggerHandler' : 'trigger'],
                evt;
            if (options.opener) {
                $this.data('opener', options.opener);
                $(options.opener).attr({
                    'aria-pressed': 'true',
                    'aria-expand': 'true'
                });
            }

            $this[trigger](evt = $.Event('layerbeforeshow'));
            if (evt.isDefaultPrevented()) {
                return;
            }

            // 표시될 때 d_open 클래스 추가
            $this.addClass('d-open').show()[trigger]('layershown');
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
    $.fn.hideLayer = function (options, isBubble) {
        options = extend({
            onHide: _core.emptyFn,
            focusOpener: false
        }, options);

        return this.each(function () {
            var $this = $(this);
            $this.removeClass('d-open').hide()[isBubble === false ? 'triggerHandler' : 'trigger']('layerhidden');
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
                results.push(this.value);
            }
        });
        return results;
    };

    /**
     * 같은 레벨에 있는 다른 row에서 on를 제거하고 현재 row에 on 추가
     * @function
     * @name $#activeItem
     * @param {String} cls 활성 클래스명
     * @return {jQuery}
     */
    $.fn.activeItem = function (cls) {
        cls = cls || 'on';
        return this.addClass(cls).siblings().removeClass(cls).end();
    };

    /**
     * disabled 및 flag에 따라 클래스 토글
     * @function
     * @name $#disabled
     * @param {String} (Optional) name
     * @param {Boolean} flag
     * @returns {*}
     */
    $.fn.disabled = function (name, flag) {
        if (typeof name !== 'string') {
            flag = name;
            name = 'disable';
        }
        return this.prop('disabled', flag).toggleClass(name, flag);
    };

    extend(_core, /** @lends jsa */ {
        /**
         * timeStart("name")로 name값을 키로하는 타이머가 시작되며, timeEnd("name")로 해당 name값의 지난 시간을 로그에 출력해준다.
         *
         * @param {String} name 타이머의 키값
         * @param {Boolean} reset 리셋(초기화) 여부
         *
         * @example
         * jsa.timeStart('animate');
         * ...
         * jsa.timeEnd('animate'); -> animate: 10203ms
         */
        timeStart: function (name, reset) {
            if (!name) {
                return;
            }
            var time = +new Date,
                key = "KEY" + name.toString();

            this.timeCounters || (this.timeCounters = {});
            if (!reset && this.timeCounters[key]) {
                return;
            }
            this.timeCounters[key] = time;
        },

        /**
         * timeStart("name")에서 지정한 해당 name값의 지난 시간을 로그에 출력해준다.
         *
         * @param {String} name 타이머의 키값
         * @return {Number} 걸린 시간
         *
         * @example
         * jsa.timeStart('animate');
         * ...
         * jsa.timeEnd('animate'); -> animate: 10203ms
         */
        timeEnd: function (name) {
            if (!this.timeCounters) {
                return null;
            }

            var time = +new Date,
                key = "KEY" + name.toString(),
                timeCounter = this.timeCounters[key],
                diff, label;

            if (timeCounter) {
                diff = time - timeCounter;
                label = name + ": " + diff + "ms";
                // 이 콘솔은 디버깅을 위한 것이므로 지우지 말것.
                console.log('[' + name + '] ' + label + 'ms');
                delete this.timeCounters[key];
            }
            return diff;
        }
    });

    /**
     * 네임스페이스 공간을 생성하고 객체를 설정<br>
     * js의 네이티브에서 제공하지 않는 기능이지만,<br>
     * 객체리터럴을 이용하여 여타 컴파일 언어의 네임스페이스처럼 쓸 수 있다.
     *
     * @function
     * @name jsa.namespace
     *
     * @param {String} name 네임스페이스명
     * @param {Object} obj {Optional) 지정된 네임스페이스에 등록할 객체, 함수 등
     * @return {Object} 생성된 네임스페이스
     *
     * @example
     * jsa.namesapce('jsa.widget.Tabcontrol', TabControl)
     *
     * ex) jsa.namespace('jsa.widget.Control', function() {}) 를 네이티브로 풀어서 작성한다면 다음과 같다.
     *
     * var jsa = jsa || {};
     * jsa.ui = jsa.ui || {};
     * jsa.widget.Control = jsa.widget.Control || function() {};
     */
    _core.namespace = function (name, obj) {
        if (typeof name !== 'string') {
            obj && (name = obj);
            return name;
        }
        var root = context,
            names = name.split('.'),
            isSet = arguments.length === 2,
            i, item;

        if (isSet) {
            for (i = -1; item = names[++i];) {
                root = root[item] || (root[item] = (i === names.length - 1 ? obj : {}));
            }
        } else { // isGet
            for (i = -1; item = names[++i];) {
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
     * common를 루트로 하여 네임스페이스를 생성하여 새로운 속성을 추가하는 함수
     *
     * @function
     * @name jsa.define
     *
     * @param {String} name .를 구분자로 해서 common를 시작으로 하위 네임스페이스를 생성. 없으면 common에 추가된다.
     * @param {Object|Function} object
     * @param {Boolean} isExecFn (Optional) object값이 함수형일 때 실행한 값을 설정할 것인가 여부
     *
     * @example
     * jsa.define('', [], {});
     * jsa.
     */
    _core.define = function (name, object, isExecFn) {
        if (typeof name !== 'string') {
            object = name;
            name = '';
        }

        var root = _core,
            names = name ? name.replace(/^_core\.?/, '').split('.') : [],
            ln = names.length - 1,
            leaf = names[ln];

        if (isExecFn !== false && typeof object === 'function' && !hasOwn.call(object, 'superclass')) {
            object = object.call(root);
        }

        for (var i = 0; i < ln; i++) {
            root = root[names[i]] || (root[names[i]] = {});
        }

        return (leaf && (root[leaf] ? extend(root[leaf], object) : (root[leaf] = object))) || extend(root, object), object;
    };

    _core._prefix = LIB_NAME + '.';

    _core.define( /** @lends jsa */ {
        /**
         * document jQuery wrapper
         */
        $doc: $(document),
        /**
         * window jQuery wrapper
         */
        $win: $(window),

        /**
         * body jQuery wrapper
         */
        $body: $("body"),
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
        tmpNode: tmpNode,

        /**
         * html5 속성의 지원여부를 체크할 때 사용
         * @example
         * is = 'placeholder' in jsa.tmpInput;  // placeholder를 지원하는가
         */
        tmpInput: tmpInput,

        /**
         * 터치기반 디바이스 여부
         */
        isTouch: !! ('ontouchstart' in window),

        /**
         * 키 코드
         */
        keyCode: {
            BACKSPACE: 8,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        },

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
            var detect = {},
                win = context,
                na = win.navigator,
                ua = na.userAgent,
                match;

            detect.isMobile = typeof orientation !== 'undefined';
            detect.isRetina = 'devicePixelRatio' in window && window.devicePixelRatio > 1;
            detect.isAndroid = ua.indexOf('android') !== -1;
            detect.isOpera = win.opera && win.opera.buildNumber;
            detect.isWebKit = /WebKit/.test(ua);
            detect.isTouch = !! ('ontouchstart' in window);

            match = /(msie) ([\w.]+)/.exec(ua.toLowerCase()) || /(trident)(?:.*rv.?([\w.]+))?/.exec(ua.toLowerCase()) || ['', null, -1];
            detect.isIE = !detect.isWebKit && !detect.isOpera && match[1] !== null; //(/MSIE/gi).test(ua) && (/Explorer/gi).test(na.appName);
            detect.isIE6 = detect.isIE && /MSIE [56]/i.test(ua);
            detect.isIE7 = detect.isIE && /MSIE [567]/i.test(ua);
            detect.isOldIE = detect.isIE && /MSIE [5678]/i.test(ua);
            detect.version = parseInt(match[2], 10); // 사용법: if (browser.isIE && browser.version > 8) { // 9이상인 ie브라우저

            detect.isChrome = (ua.indexOf('Chrome') !== -1);
            detect.isGecko = (ua.indexOf('Firefox') !== -1);
            detect.isMac = (ua.indexOf('Mac') !== -1);
            detect.isAir = ((/adobeair/i).test(ua));
            detect.isIDevice = /(iPad|iPhone)/.test(ua);
            detect.isSafari = !detect.isChrome && (/Safari/).test(ua);
            detect.isIETri4 = (detect.isIE && ua.indexOf('Trident/4.0') !== -1);

            return detect;
        }()),

        is: function (o, typeName) {
            if (o === null) {
                return typeName === 'null';
            }

            if (o && (o.nodeType === 1 || o.nodeType === 9)) {
                return typeName === 'element';
            }

            var s = toString.call(o),
                type = s.match(/\[object (.*?)\]/)[1].toLowerCase();

            if (type === 'number') {
                if (isNaN(o)) {
                    return typeName === 'nan';
                }
                if (!isFinite(o)) {
                    return typeName === 'infinity';
                }
            }

            return type === typeName;
        },

        /**
         * 주어진 인자가 빈값인지 체크
         *
         * @param {Object} value 체크할 문자열
         * @param {Boolean} allowEmptyString (Optional: false) 빈문자를 허용할 것인지 여부
         * @return {Boolean}
         */
        isEmpty: function (value, allowEmptyString) {
            return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (this.is(value, 'array') && value.length === 0);
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
         * @name jsa.isObject
         * @param {Object} value 체크할 값
         * @return {Boolean}
         */
        isPlainObject: function (obj) {
            if (!obj
                || !_core.is(obj, 'object')
                || obj.nodeType
                || /*jshint eqeqeq:false*/obj.window == obj) {
                return false;
            }

            var key, objConstructor;

            try {
                if ((objConstructor = obj.constructor)
                    && !hasOwn.call(obj, 'constructor')
                    && !hasOwn.call(objConstructor.prototype, 'isPrototypeOf')) {
                    return false;
                }
            } catch (e) {
                return false;
            }

            /*jshint noempty:false*/
            for (key in obj) {
            }

            return ((key === undefined) || hasOwn.call(obj, key));
        },

        toType: function(val) {
           switch(true) {
               case val === "false":
                   return false;
               case val === "true":
                   return true;
               case _core.is(val, 'number'):
                   return val|0;
           }
           return val;
        },

        /**
         * 함수형인지 체크
         *
         * @function
         * @name jsa.isFunction
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
         *
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
         * 주어진 값을 배열로 변환
         *
         * @param {Mixed} value 배열로 변환하고자 하는 값
         * @return {Array}
         *
         * @example
         * jsa.toArray('abcd"); => ["a", "b", "c", "d"]
         * jsa.toArray(arguments);  => arguments를 객체를 array로 변환하여 Array에서 지원하는 유틸함수(slice, reverse ...)를 쓸수 있다.
         */
        toArray: function (value) {
            try {
                return arraySlice.apply(value, arraySlice.call(arguments, 1));
            } catch (e) {}

            var ret = [];
            try {
                for (var i = 0, len = value.length; i < len; i++) {
                    ret.push(value[i]);
                }
            } catch (e) {}
            return ret;
        },

        /**
         * 15자의 숫자로 이루어진 유니크한 값 생성
         *
         * @return {String}
         */
        getUniqId: function (len) {
            len = len || 32;
            var rdmString = "";
            for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
            return rdmString.substr(0, len);
        },

        /**
         * 순번으로 유니크값 을 생성해서 반환
         * @function
         * @return {Number}
         */
        nextSeq: (function () {
            var seq = 0;
            return function (prefix) {
                return (prefix || '') + (seq += 1);
            };
        }()),

        /**
         * 템플릿 생성
         *
         * @param {String} text 템플릿 문자열
         * @param {Object} data 템플릿 문자열에서 변환될 데이타
         * @param {Object} settings 옵션
         * @return {Function} tempalte 함수
         *
         * @example
         * var tmpl = jsa.template('&lt;span>&lt;%=name%>&lt;/span>');
         * var html = tmpl({name: 'Axl rose'}); => &lt;span>Axl rose&lt;/span>
         * $('div').html(html);
         */
        template: function (str, data) {
            var m,
                src = 'var __src = [], escapeHTML=' + LIB_NAME + '.string.escapeHTML; with(value||{}) { __src.push("';
            str = $.trim(str);
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
     * 문자열 관련 유틸 함수 모음
     *
     * @namespace
     * @name jsa.string
     * @description
     */
    _core.define('string', function () {
        var escapeChars = {
                '&': '&amp;',
                '>': '&gt;',
                '<': '&lt;',
                '"': '&quot;',
                "'": '&#39;'
            },
            unescapeChars = (function (escapeChars) {
                var results = {};
                each(escapeChars, function (v, k) {
                    results[v] = k;
                });
                return results;
            })(escapeChars),
            escapeRegexp = /[&><'"]/g,
            unescapeRegexp = /(&amp;|&gt;|&lt;|&quot;|&#39;|&#[0-9]{1,5};)/g,
            tagRegexp = /<\/?[^>]+>/gi,
            scriptRegexp = /<script[^>]*>([\\S\\s]*?)<\/script>/img;

        return /** @lends jsa.string */ {
            trim: function (value) {
                return value ? value.replace(/^\s+|\s+$/g, "") : value;
            },
            /**
             * 정규식이나 검색문자열을 사용하여 문자열에서 텍스트를 교체
             *
             * @param {String} value 교체를 수행할 문자열
             * @param {RegExp|String} find 검색할 문자열이나 정규식 패턴
             * @param {String} rep 대체할 문자열
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
             * 첫글자를 소문자로 변환
             * @param {String} value
             * @returns {string}
             */
            toFirstLower: function (value) {
                return value ? value.replace(/^[A-Z]/, function (s) {
                    return s.toLowerCase();
                }) : value;
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
                var args = _core.toArray(arguments).slice(1);

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
    _core.define('uri', /** @lends jsa.uri */ {

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
        urlAppend: function (url, string) {
            if (_core.is(string, 'object')) {
                string = _core.object.toQueryString(string);
            }
            if (!_core.isEmpty(string)) {
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

            var params = (query + '').split('&'),
                obj = {},
                params_length = params.length,
                tmp = '',
                i;

            for (i = 0; i < params_length; i++) {
                tmp = params[i].split('=');
                obj[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1]).replace(/[+]/g, ' ');
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
                return uri;
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
    _core.define('number', /** @lends jsa.number */ {
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

    function nativeCall(f) {
        return f ? function (obj) {
            return f.apply(obj, arraySlice.call(arguments, 1));
        } : false;
    }
    /**
     * 배열관련 유틸함수
     * @namespace
     * @name jsa.array
     */
    _core.define('array', /** @lends jsa.array */ {
        /**
         * 배열 병합
         * @param {Array, Array, ...} arr
         * @returns {*}
         */
        append: function (arr) {
            var args = arraySlice.call(arguments);
            arrayProto.push.apply.apply(args);
            return args[0];
        },
        /**
         * 콜백함수로 하여금 요소를 가공하는 함수
         *
         * @function
         * @name jsa.array.map
         * @param {Array} obj 배열
         * @param {Function} cb 콜백함수
         * @param {Object} (optional) 컨텍스트
         * @return {Array}
         *
         * @example
         * jsa.array.map([1, 2, 3], function(item, index) {
         *		return item * 10;
         * });
         * => [10, 20, 30]
         */
        map: nativeCall(arrayProto.map) || function (obj, cb, ctx) {
            var results = [];
            if (!_core.is(obj, 'array') || !_core.is(cb, 'function')) {
                return results;
            }
            // vanilla js~
            for (var i = 0, len = obj.length; i < len; i++) {
                results[results.length] = cb.call(ctx || obj, obj[i], i, obj);
            }
            return results;
        },

        /**
         * 반복자함수의 반환값이 true가 아닐 때까지 반복
         * @function
         * @name jsa.array.every
         * @return {Boolean} 최종 결과
         */
        every: nativeCall(arrayProto.every) || function (arr, cb, ctx) {
            var isTrue = true;
            if (!_core.is(arr, 'array') || !_core.is(cb, 'function')) {
                return isTrue;
            }
            each(arr, function (v, k) {
                if (cb.call(ctx || this, v, k) !== true) {
                    return isTrue = false, false;
                }
            });
            return isTrue;
        },

        /**
         * 반복자함수의 반환값이 true일 때까지 반복
         * @function
         * @name jsa.array.any
         */
        any: nativeCall(arrayProto.any) || function (arr, cb, ctx) {
            var isTrue = false;
            if (!_core.is(arr, 'array') || !_core.is(cb, 'function')) {
                return isTrue;
            }
            each(arr, function (v, k) {
                if (cb.call(ctx || this, v, k) === true) {
                    return isTrue = true, false;
                }
            });
            return isTrue;
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
                number = _core.number;

            each(obj, function (value, k) {
                rand = number.random(index++);
                shuffled[index - 1] = shuffled[rand], shuffled[rand] = value;
            });
            return shuffled;
        },

        /**
         * 콜백함수로 하여금 요소를 걸려내는 함수
         * @function
         * @name jsa.array.filter
         * @param {Array} obj 배열
         * @param {Function} cb 콜백함수
         * @param {Object} (optional) 컨텍스트
         * @returns {Array}
         *
         * @example
         * jsa.array.filter([1, '일', 2, '이', 3, '삼'], function(item, index) {
         *		return typeof item === 'string';
         * });
         * => ['일','이','삼']
         */
        filter: nativeCall(arrayProto.filter) || function (obj, cb, ctx) {
            var results = [];
            if (!_core.is(obj, 'array') || !_core.is(cb, 'function')) {
                return results;
            }
            for (var i = 0, len = obj.length; i < len; i++) {
                cb.call(ctx || obj, obj[i], i, obj) && (results[results.length] = obj[i]);
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
            return _core.array.indexOf(arr, value, b) > -1;
        },

        /**
         * 주어진 인덱스의 요소를 반환
         * @function
         * @name jsa.array.indexOf
         * @param {Array} obj 배열
         * @param {Function} cb 콜백함수
         * @return {Array}
         *
         * @example
         * jsa.array.indexOf([1, '일', 2, '이', 3, '삼'], '일');  => 1
         */
        indexOf: nativeCall(arrayProto.indexOf) || function (arr, value, b) {
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
            if (!_core.is(value, 'array')) {
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
    _core.define('object', /** @lends jsa.object */ {

        /**
         * 개체의 열거가능한 속성 및 메서드 이름을 배열로 반환
         * @function
         * @name jsa.object.keys
         * @param {Object} obj 리터럴 객체
         * @return {Array} 객체의 열거가능한 속성의 이름이 포함된 배열
         *
         * @example
         * jsa.object.keys({"name": "Axl rose", "age": 50}); => ["name", "age"]
         */
        keys: Object.keys || function (obj) {
            var results = [];
            each(obj, function (v, k) {
                results.push(k);
            });
            return results;
        },

        /**
         * 개체의 열거가능한 속성의 값을 배열로 반환
         * @function
         * @name jsa.object.values
         * @param {Object} obj 리터럴 객체
         * @return {Array} 객체의 열거가능한 속성의 값들이 포함된 배열
         *
         * @example
         * jsa.object.values({"name": "Axl rose", "age": 50}); => ["Axl rose", 50]
         */
        values: Object.values || function (obj) {
            var results = [];
            each(obj, function (v) {
                results.push(v);
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
         * jsa.object.map({1; 'one', 2: 'two', 3: 'three'}, function(item, key) {
         *		return item + '__';
         * });
         * => {1: 'one__', 2: 'two__', 3: 'three__'}
         */
        map: function (obj, cb) {
            if (!_core.is(obj, 'object') || !_core.is(cb, 'function')) {
                return obj;
            }
            var results = {};
            each(obj, function (v, k) {
                results[k] = cb(obj[k], k, obj);
            });
            return results;
        },

        /**
         * 요소가 있는 json객체인지 체크
         *
         *
         * @param {Object} obj json객체
         * @return {Boolean} 요소가 하나라도 있는지 여부
         */
        hasItems: function (obj) {
            if (!_core.is(obj, 'object')) {
                return false;
            }

            var has = false;
            each(obj, function (v) {
                return has = true, false;
            });
            return has;
        },


        /**
         * 객체를 쿼리스크링으로 변환
         *
         * @param {Object} obj 문자열
         * @param {Boolean} isEncode (Optional) URL 인코딩할지 여부
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

            each(params, function (value, key) {
                if (typeof (value) === 'object') {
                    each(value, function (innerValue, innerKey) {
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
            each(obj, function (item, index) {
                result[item] = index;
            });
            return result;
        },

        /**
         * 주어진 리터럴에서 key에 해당하는 요소를 삭제
         *
         * @param {Object} value 리터럴
         * @param {Number} key 삭제할 키
         * @return 지정한 요소가 삭제된 리터럴
         */
        remove: function (value, key) {
            if (!_core.is(value, 'object')) {
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
    _core.define('date', function () {
        var months = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
            fullMonths = "January,Febrary,March,April,May,June,July,Augst,September,October,November,December".split(",");


        function compare(d1, d2) {
            return d1.getTime() > d2.getTime() ? -1 : (d1.getTime() === d2.getTime() ? 0 : 1);
        }

        return /** @lends jsa.date */ {
            MONTHS_NAME: months,
            MONTHS_FULLNAME: fullMonths,

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
                        MMM = this.MONTHS_NAME[M - 1],
                        MMMM = this.MONTHS_FULLNAME[M - 1],
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
             * @name jsa.date.compare
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
                each(['getFullYear', 'getMonth', 'getDate'], function (fn) {
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
             * @name jsa.date.parseDate
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
             * @name jsa.date.prettyTimeDiff
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
                var zeroPad = _core.number.zeroPad;
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
     * @name jsa.Base
     * @example
     * var Person = Base.extend({
	*	$singleton: true, // 싱글톤 여부
	*	$statics: { // 클래스 속성 및 함수
	*		live: function() {} // Person.live(); 으로 호출
	*	},
	*	$mixins: [Animal, Robot], // 특정 클래스에서 메소드들을 빌려오고자 할 때 해당 클래스를 지정(다중으로도 가능),
	*	initialize: function(name) {
	*		this.name = name;
	*	},
	*	say: function(job) {
	*		alert("I'm Person: " + job);
	*	},
	*	run: function() {
	*		alert("i'm running...");
	*	}
	*`});
     *
     * var Man = Person.extend({
	*	initialize: function(name, age) {
	*		this.supr(name);  // Person(부모클래스)의 initialize메소드를 호출 or this.suprMethod('initialize', name);
	*		this.age = age;
	*	},
	*	// say를 오버라이딩함
	*	say: function(job) {
	*		this.suprMethod('say', 'programer'); // 부모클래스의 say 메소드 호출 - 첫번째인자는 메소드명, 두번째부터는 해당 메소드로 전달될 인자

	*		alert("I'm Man: "+ job);
	*	}
	* });
     * var man = new Man('kim', 20);
     * man.say('freeman');  // 결과: alert("I'm Person: programer"); alert("I'm Man: freeman");
     * man.run(); // 결과: alert("i'm running...");
     */
    var Base = (function () {
        var isFn = _core.isFunction,
            emptyFn = _core.emptyFn,
            include = _core.array.include,
            F = function () {},
            ignoreNames = ['superclass', 'members', 'statics'];


        // 부모클래스의 함수에 접근할 수 있도록 .supr 속성에 부모함수를 래핑하여 설정
        function wrap(k, fn, supr) {
            return function () {
                var tmp = this.callParent,
                    ret;

                this.callParent = supr.prototype[k];
                ret = undefined;
                try {
                    ret = fn.apply(this, arguments);
                } finally {
                    this.callParent = tmp;
                }
                return ret;
            };
        }

        // 속성 중에 부모클래스에 똑같은 이름의 함수가 있을 경우 래핑처리
        function inherits(what, o, supr) {
            each(o, function (v, k) {
                what[k] = isFn(v) && isFn(supr.prototype[k]) ? wrap(k, v, supr) : v;
            });
        }

        function classExtend(attr, c) {
            var supr = c ? (attr.$extend || Object) : this,
                statics, mixins, singleton, instance;

            if (isFn(attr)) {
                attr = attr();
            }

            singleton = attr.$singleton || false;
            statics = attr.$statics || false;
            mixins = attr.$mixins || false;


            function ctor() {
                if (singleton && instance) {
                    return instance;
                } else {
                    instance = this;
                }

                var args = arraySlice.call(arguments),
                    me = this;
                each(me.constructor.hooks.init, function (fn, i) {
                    fn.call(me);
                });

                if (me.initialize) {
                    me.initialize.apply(this, args);
                } else {
                    supr.prototype.initialize && supr.prototype.initialize.apply(me, args);
                }
            }

            function Class() {
                ctor.apply(this, arguments);
            }

            F.prototype = supr.prototype;
            Class.prototype = new F;
            Class.prototype.constructor = Class;
            Class.superclass = supr.prototype;
            Class.extend = classExtend;
            Class.hooks = extend({
                init: []
            }, supr.hooks);


            if (singleton) {
                Class.getInstance = function () {
                    if (!instance) {
                        instance = new Class();
                    }
                    return instance;
                };
            }

            Class.prototype.suprMethod = function (name) {
                var args = arraySlice.call(arguments, 1);
                return supr.prototype[name].apply(this, args);
            };

            Class.mixins = function (o) {
                if (!o.push) {
                    o = [o];
                }
                var proto = this.prototype;
                each(o, function (mixObj, i) {
                    each(mixObj, function (fn, key) {
                        if (key === 'init' && Class.hooks) {
                            Class.hooks.init.push(fn)
                        } else {
                            proto[key] = fn;
                        }
                    });
                });
            };
            mixins && Class.mixins.call(Class, mixins);

            Class.members = function (o) {
                inherits(this.prototype, o, supr);
            };
            attr && Class.members.call(Class, attr);

            Class.statics = function (o) {
                o = o || {};
                for (var k in o) {
                    if (!_core.array.include(ignoreNames, k)) {
                        this[k] = o[k];
                    }
                }
                return Class;
            };
            Class.statics.call(Class, supr);
            statics && Class.statics.call(Class, statics);

            return Class;
        }

        var Base = function () {
            throw new Error('Base는 객체로 생성할 수 없습니다.');
        };
        Base.prototype.initialize = function () {};
        Base.prototype.release = function () {};
        Base.extend = classExtend;

        _core.Class = function (attr) {
            return classExtend.apply(this, [attr, true]);
        };
        return _core.Base = Base;
    })();

    _core.define('Env', /** @lends jsa */ {
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
         * @param {Object} def (Optional) 설정된 값이 없을 경우 사용할 기본값
         * @return {Object} 설정값
         */
        get: function (name, def) {
            var root = this.configs,
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
        set: function (name, value) {
            var root = this.configs,
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
     * @name jsa.valid
     * @description 밸리데이션 함수 모음
     */
    _core.define('valid', function () {
        var trim = $.trim,
            isString = _core.isString,
            isNumber = _core.isNumber,
            isElement = _core.isElement;

        return /** @lends jsa.valid */ {
            empty: _core.isEmpty,
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
            date: function (str) {
                isString(str) || (isElement(str) && (str = str.value));
                return (str = trim(str)) ? (/^\d{4}-?\d{2}-?\d{2}$/).test(str) : false;
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
             * @param {String} sid1 앞주민번호.
             * @param {String} sid2 (Optional) 뒷주민번호. 값이 없으면 strSsn1만으로 체크
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
             * @param {String} sid1 앞주민번호.
             * @param {String} sid2 (Optional) 뒷주민번호. 값이 없으면 strSsn1만으로 체크
             * @return {Boolean}
             */
            fgnSSN: function (sid1, sid2) {
                var num = sid1 + (sid2 ? sid2 : ""),
                    pattern = /^(\d{6})-?(\d{7})$/,
                    sum = 0,
                    odd, buf,
                    multipliers = "234567892345".split("");

                if (!pattern.test(num)) {
                    return false;
                }
                num = RegExp.$1 + RegExp.$2;

                buf = _core.toArray(num);
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
            },

            _getRules: function(el) {
                var res = {},
                    rules,
                    strUtil = _core.string;

                rules = res[el.name] = {};
                each(el.attributes, function(attr) {
                    if(attr.name && attr.name.indexOf('data-rule-') > -1) {
                        rules[ strUtil.camelize(attr.name.substr(10)) ] = _core.toType(attr.value);
                    }
                });
                return res;
            },

            _rules: {
                required: function(el, ruleName, ruleValue){
                    var isValid = false;

                    if(el.type === 'checkbox' || el.type === 'radio') {
                        for(var i = 0; i < el.length; i++) {
                            if(el[i].checked) {
                                isValid = true;
                                break;
                            }
                        }
                    } else {
                        if ($.trim(el.value) != '') {
                            isValid = true;
                        }
                    }

                    if(!isValid) {
                        throw _core.valid._error.apply(null, arguments);
                    }
                },
                minLength: function(el, ruleName, ruleValue) {
                    var isValid = false,
                        val = $.trim(el.value);
                    if(val.length >= parseInt(ruleValue, 10)) {
                        isValid = true;
                    }

                    if(!isValid) {
                        throw _core.valid._error.apply(null, arguments);
                    }
                },
                maxLength: function(el, ruleName, ruleValue) {
                    var isValid = false,
                        val = $.trim(el.value);

                    if(val.length <= parseInt(ruleValue, 10)) {
                        isValid = true;
                    }

                    if(!isValid) {
                        throw _core.valid._error.apply(null, arguments);
                    }
                },
                type: function(el, ruleName, ruleValue) {
                    var valid = _core.valid,
                        val = valid._joins(el);

                    if(!valid[ruleName === 'type' ? ruleValue : el.type]($.trim(val))) {
                        throw valid._error(el, ruleName, ruleValue);
                    }
                },
                pattern: function(el, ruleName, ruleValue) {
                    var valid = _core.valid,
                        val = valid._joins(el);

                    var regexp = new RegExp(ruleValue);
                    if(!val.test(regexp)) {
                        throw valid._error(el, ruleName, ruleValue);
                    }
                },
                custom: function(el, ruleName, ruleValue) {
                    var valid = _core.valid,
                        val = valid._joins(el);

                }
            },

            _error: function(el, ruleName, ruleValue, rules) {
                var ne = new Error(_core.valid._messages[ruleName]);
                ne.getElement = function() { return el; };
                ne.getRule = function(){ return {name: ruleName, value: ruleValue}; }
                return ne;
            },

            _messages: {
                required: '필수입력',
                email: '이메일',
                minChecked: '',
                maxChecked: '',
                same: '동',
                number: '',
                date: ''
            },
            /*
                run(frm, {
                    'name': {
                        reuired: true,
                        minLength: 5,
                        maxLength: 10
                    }
                });
            */
            _joins: (function(){
                var ptn = /[a-z0-9]+/ig;
                return function(el) {
                    var frm = el.form,
                        joins = el.getAttribute('data-joins');

                    if(!joins) {
                        return el.value;
                    }

                    joins = joins.replace(ptn, function(n){
                        return $.trim(frm[n].value);
                    });

                }
            })(),
            _type: function(el){
                var t = (el.type || el.tagName || "").toLowerCase();
                switch(t){
                    case "email":
                    case "number":
                    case "tel":
                    case "email":
                    case "url":
                    case "date":
                        return "text";
                    default:
                        return t;
                }
            },
            run: function (frm, validators) {
                var valid = _core.valid;
                validators || (validators = {});

                each(frm.elements, function (el, i) {
                    if(!el.name) return;
                    extend(true, validators, valid._getRules(el));
                });

                try {
                    each(validators, function (rules, name) {
                        var el = frm[name];

                        each(rules, function(ruleValue, ruleName) {
                            if(valid._rules[ruleName]){
                                valid._rules[ruleName](el, ruleName, ruleValue);
                            }
                            /*val = valid._joins(el);
                            if(valid._type(el) === 'text' || ruleName === 'type'){  // email, url, number, tel, eng, kor, date
                                if(!valid[ruleName === 'type' ? ruleValue : el.type]($.trim(val))) {
                                    throw valid._error(el, ruleName, ruleValue);
                                }
                            } else if(ruleName === 'regexp') {
                                var regexp = new RegExp(ruleValue);
                                if(!val.test(regexp)) {
                                    throw valid._error(el, ruleName, ruleValue);
                                }
                            } else if(ruleName === )*/
                        });
                    });
                } catch(e) {
                    alert(e);
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
    _core.define('css', function () {

        var _tmpDiv = _core.tmpNode,
            _prefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'],
            _style = _tmpDiv.style,
            _noReg = /^([0-9]+)[px]+$/,
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
            string = _core.string;

        function prefixStyle(name, def) {
            if (_vendor === false) return def || false;
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
            prefixStyle: prefixStyle,
            get: function (el, style) {
                if (!el || !_core.is(el, 'element')) {
                    return null;
                }
                var value;
                if (el.currentStyle) {
                    value = el.currentStyle[string.camelize(style)];
                } else {
                    value = window.getComputedStyle(el, null)[string.camelize(style)];
                }
                if (_noReg.test(value)) {
                    return parseInt(RegExp.$1, 10);
                }
                return value;
            }
        };
    });

    _core.define('class', {
        has: function (el, c) {
            if (!el || !_core.is(el, 'element')) {
                return false;
            }
            var classes = el.className;
            if (!classes) {
                return false;
            }
            if (classes == c) {
                return true;
            }
            return classes.search("\\b" + c + "\\b") !== -1;
        },
        add: function (el, c) {
            if (!el || !_core.is(el, 'element')) {
                return;
            }
            if (this.has(el, c)) {
                return;
            }
            if (el.className) {
                c = " " + c;
            }
            return el.className += c, this;
        },
        remove: function (el, c) {
            if (!el || !_core.is(el, 'element')) {
                return;
            }
            return el.className = el.className.replace(new RegExp("\\b" + c + "\\b\\s*", "g"), ""), this;
        },
        replace: function (el, c, n) {
            if (!el || !_core.is(el, 'element')) {
                return null;
            }
            return this.remove(el, c), this.add(el, n), this;
        }
    });

    /**
     * @namespace
     * @name jsa.util
     */
    _core.define('util', function () {

        return /** @lends jsa.util */ {


            /**
             * png
             */
            png24: function (selector) {
                var $target;
                if (typeof (selector) == 'string') {
                    $target = $(selector + ' img');
                } else {
                    $target = selector.find(' img');
                }
                var c = new Array();
                $target.each(function (j) {
                    c[j] = new Image();
                    c[j].src = this.src;
                    if (navigator.userAgent.match(/msie/i))
                        this.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='scale',src='" + this.src + "')";
                });
            },

            /**
             * png Fix
             */
            pngFix: function () {
                var s, bg;
                $('img[@src*=".png"]', document.body).each(function () {
                    this.css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + this.src + '\', sizingMethod=\'\')');
                    this.src = '/resource/images/_core/blank.gif';
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
                opts = extend({

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
                _core.browser.isSafari && tmp.push('location=yes');
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
            centeringImage: function ($imgs, wrapWidth, wrapHeight, onError) {
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
             * 이미지 로드 체크
             * @param { jquery/string } target 이미지 요소
             * @param { jquery/string } loadingClip
             * @return { jquery } deferred
             */
            lazyImages: function (target, loadingClip) {
                var $img = $(target),
                    $loading = $(loadingClip),
                    len = $img.length,
                    def = $.Deferred();

                function loaded(e) {
                    if (e.type === 'error') {
                        def.reject(e.target);
                        return;
                    }

                    len--;
                    if (!len) {
                        if ($loading) {
                            $loading.addClass("none");
                            def.resolve();
                            $img.off("load");
                        }
                    }
                }

                if ($loading) {
                    $loading.removeClass("none");
                }

                $img.each(function (value, index) {
                    var $t = $(this);
                    var src = $t.attr("data-src");

                    if (src) {
                        $t.attr("src", src);
                    } else if (this.complete) {
                        $t.trigger("load");
                    }

                    $t.on("error", loaded);

                }).on("load", loaded);

                return def;
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
    _core.openPopup = _core.util.openPopup;

    _core.define('Cookie', {
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
            var curCookie = name + "=" + encodeURIComponent(value) +
                ((options.expires instanceof Date) ? "; expires=" + options.expires.toGMTString() : "") +
                ((options.path) ? "; path=" + options.path : ";path=/") +
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
                return decodeURIComponent(j.substr(h, f - h));
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var $win = _core.$win,
        $doc = _core.$doc,
        View; // jsa.ui.View

    _core.define( /** @lends jsa */ {
        /**
         * 작성된 클래스를 jQuery의 플러그인으로 사용할 수 있도록 바인딩시켜 주는 함수
         *
         * @param {Class} Klass 클래스
         * @param {String} name 플러그인명
         *
         * @example
         * // 클래스 정의
         * var Slider = jsa.ui.View({
         *   initialize: function(el, options) { // 생성자의 형식을 반드시 지킬 것..(첫번째 인수: 대상 엘리먼트, 두번째
         *   인수: 옵션값들)
         *   ...
         *   },
         *   ...
         * });
         * jsa.bindjQuery(Slider, 'hibSlider');
         * // 실제 사용시
         * $('#slider').hibSlider({count: 10});
         */
        bindjQuery: function (Klass, name) {
            var old = $.fn[name];

            $.fn[name] = function (options) {
                var a = arguments,
                    args = arraySlice.call(a, 1),
                    me = this,
                    returnValue = this;

                this.each(function () {
                    var $this = $(this),
                        methodValue,
                        instance;

                    if (!(instance = $this.data(name)) || (a.length === 1 && typeof options !== 'string')) {
                        instance && (instance.release(), instance = null);
                        $this.data(name, (instance = new Klass(this, extend({}, $this.data(), options), me)));
                    }

                    if (typeof options === 'string' && _core.is(instance[options], 'function')) {
                        if (options[0] === '_') {
                            throw new Error('[bindjQuery] private 메소드는 호출할 수 없습니다.');
                        }

                        try {
                            methodValue = instance[options].apply(instance, args);
                        } catch (e) {
                            console.error('[jQuery bind error] ' + e);
                        }

                        if ( /*methodValue !== instance && */ methodValue !== undefined) {
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


    _core.define('Listener', function () {
        /**
         * 이벤트 리스너
         * @class
         * @name jsa.Listener
         */
        var Listener = /** @lends jsa.Listener# */ {
            /**
             * 생성자
             */
            init: function () {
                this._listeners = $(this);
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
             * @param {Object} cb (Optional) 삭제할 핸들러. 이 인자가 없을 경우 name에 등록된 모든 핸들러를 삭제.
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
        };

        return Listener;
    });

    /**
     * @namespace
     * @name jsa.PubSub
     * @description 발행/구독 객체: 상태변화를 관찰하는 옵저버(핸들러)를 등록하여, 상태변화가 있을 때마다 옵저버를 발행(실행)
     * 하도록 하는 객체이다.
     * @example
     * // 옵저버 등록
     * jsa.PubSub.on('customevent', function() {
     *	 alert('안녕하세요');
     * });
     *
     * // 등록된 옵저버 실행
     * jsa.PubSub.trigger('customevent');
     */
    _core.define('PubSub', function () {

        var PubSub = $(window);
        PubSub.attach = PubSub.on;
        PubSub.unattach = PubSub.off;

        return PubSub;
    });

    /**
     * @name jsa.ui
     * @param name
     * @param attr
     * @returns {*}
     */
    _core.ui = function ( /*String*/ name, supr, /*Object*/ attr) {
        if (!attr) {
            attr = supr;
            supr = null;
        }
        var bindName = attr.bindjQuery,
            Klass;

        delete attr.bindjQuery;
        if (_core.isFunction(attr)) {
            Klass = attr(_core.ui.View);
        } else {
            attr.name = name, Klass = (_core.ui[supr] || _core.ui.View).extend(attr);
        }
        _core.define('ui.' + name, Klass);
        if (bindName) {
            _core.bindjQuery(Klass, bindName);
        }
        return Klass;
    };

    View = _core.define('ui.View', function () {
        var isFn = _core.isFunction,
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
         *		$extend: jsa.ui.View,
         *		// 기능1) events 속성을 통해 이벤트핸들러를 일괄 등록할 수 있다. ('이벤트명 selector': '핸들러함수명')
         *	events: {
         *		click ul>li.item': 'onItemClick',		// this.$el.on('click', 'ul>li.item', this.onItemClick.bind(this)); 를 자동 수행
         *		'mouseenter ul>li.item>a': 'onMouseEnter'	// this.$el.on('mouseenter', 'ul>li.item>a', this.onMouseEnter.bind(this)); 를 자동 수행
         *	},
         *	// 기능2) selectors 속성을 통해 지정한 selector에 해당하는 노드를 주어진 이름의 멤버변수에 자동으로 설정해 준다.
         *	selectors: {
         *		box: 'ul',			// this.$box = this.$el.find('ul') 를 자동수행
         *		items: 'ul>li.item',	// this.$items = this.$el.find('ul>li.item') 를 자동수행
         *		prevBtn: 'button.prev', // this.$prevBtn = this.$el.find('button.prev') 를 자동 수행
         *		nextBtn: 'button..next' // this.$nextBtn = this.$el.find('button.next') 를 자동 수행
         *	},
         *	initialize: function(el, options) {
         *	this.supr(el, options);	// 기능4) this.$el, this.options가 자동으로 설정된다.
         *	},
         *	onItemClick: function(e) {
         *		...
         *	},
         *	onMouseEnter: function(e) {
         *		...
         *	}
         * });
         *
         * new jsa.ui.Slider('#slider', {count: 10});
         */
        var View = _core.Base.extend( /** @lends jsa.ui.View# */ {
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
                    moduleName, superClass;

                if (!me.name) {
                    throw new Error('클래스의 이름이 없습니다');
                }

                moduleName = me.moduleName = _core.string.toFirstLower(me.name);
                me.$el = el instanceof jQuery ? el : $(el);

                // 강제로 리빌드 시킬 것인가 ///////////////////////////////////////////////////////////////
                if (options.rebuild === true) {
                    try {
                        me.$el.data(moduleName).release();
                    } catch (e) {}
                    me.$el.removeData(moduleName);
                } else {
                    // 이미 빌드된거면 false 반환 - 중복 빌드 방지
                    if (me.$el.data(moduleName)) {
                        return false;
                    }
                    me.$el.data(moduleName, this);
                }


                // disabled상태면 false 반환
                if (me.$el.hasClass('disabled') || me.$el.attr('data-readony') === 'true' || me.$el.attr('data-disabled') === 'true') {
                    return false;
                }

                superClass = me.constructor.superclass;
                // TODO
                // View._instances.push(me);
                me.el = me.$el[0]; // 원래 엘리먼트도 변수에 설정
                me.options = $.extend(true, {}, superClass.defaults, me.defaults, me.$el.data(), options); // 옵션 병합
                me.cid = moduleName + '_' + _core.nextSeq(); // 객체 고유 키
                me.subViews = {}; // 하위 컨트롤를 관리하기 위함
                me._eventNamespace = '.' + me.cid; // 객체 고유 이벤트 네임스페이스명

                me.updateSelectors();

                // events 속성 처리
                // events: {
                //	'click ul>li.item': 'onItemClick', //=> this.$el.on('click', 'ul>li.item', this.onItemClick); 으로 변환
                // }
                me.options.events = _core.extend({},
                    execObject(me.events, me),
                    execObject(me.options.events, me));
                _core.each(me.options.events, function (value, key) {
                    if (!eventPattern.test(key)) {
                        return false;
                    }

                    var name = RegExp.$1,
                        selector = RegExp.$2,
                        args = [name],
                        func = isFn(value) ? value : (isFn(me[value]) ? me[value] : _core.emptyFn);

                    if (selector) {
                        args[args.length] = $.trim(selector);
                    }

                    args[args.length] = function () {
                        func.apply(me, arguments);
                    };
                    me.on.apply(me, args);
                });

                // options.on에 지정한 이벤트들을 클래스에 바인딩
                me.options.on && _core.each(me.options.on, function (value, key) {
                    me.on(key, value);
                });

            },

            /**
             * this.selectors를 기반으로 엘리먼트를 조회해서 멤버변수에 겍팅
             * @returns {jsa.ui.View}
             */
            updateSelectors: function () {
                var me = this;
                // selectors 속성 처리
                // selectors: {
                //  box: 'ul',			// => this.$box = this.$el.find('ul');
                //  items: 'ul>li.item'  // => this.$items = this.$el.find('ul>li.item');
                // }
                me.selectors = _core.extend({},
                    execObject(me.constructor.superclass.selectors, me),
                    execObject(me.selectors, me),
                    execObject(me.options.selectors, me));
                _core.each(me.selectors, function (value, key) {
                    if (typeof value === 'string') {
                        me['$' + key] = me.$el.find(value);
                    } else if (value instanceof jQuery) {
                        me['$' + key] = value;
                    } else {
                        me['$' + key] = $(value);
                    }
                    me.subViews['$' + key] = me['$' + key];
                });

                return me;
            },

            /**
             * this.$el하위에 있는 엘리먼트를 조회
             * @param {String} selector 셀렉터
             * @returns {jQuery}
             */
            $: function (selector) {
                return this.$el.find(selector);
            },

            /**
             * 파괴자
             */
            release: function () {
                var me = this;

                me.$el.off(me._eventNamespace);

                // me.subviews에 등록된 자식들의 파괴자 호출
                _core.each(me.subViews, function (item, key) {
                    if (key.substr(0, 1) === '$') {
                        item.off(me._eventNamespace);
                    } else {
                        item.release && item.release();
                    }
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
             * @param {Mixed} value (Optional) 옵션값: 없을 경우 name에 해당하는 값을 반환
             * @return {Mixed}
             * @example
             * $('...').tabs('option', 'startIndex', 2);
             */
            option: function (name, value) {
                if (typeof value === 'undefined') {
                    return this.getOption(name);
                } else {
                    this.setOption(name, value);
                    this.triggerHandler('optionchange', [name, value]);
                }
            },

            /**
             * 이벤트명에 현재 클래스 고유의 네임스페이스를 붙여서 반환 (ex: 'click mousedown' -> 'click.MyClassName mousedown.MyClassName')
             * @private
             * @param {String} eventNames 네임스페이스가 없는 이벤트명
             * @return {String} 네임스페이스가 붙어진 이벤트명
             */
            _normalizeEventNamespace: function (eventNames) {
                if (eventNames instanceof $.Event) {
                    return eventNames;
                }

                var me = this,
                    m = (eventNames || "").split(/\s/);
                if (!m || !m.length) {
                    return eventNames;
                }

                var name, tmp = [],
                    i;
                for (i = -1; name = m[++i];) {
                    if (name.indexOf('.') === -1) {
                        tmp.push(name + me._eventNamespace);
                    } else {
                        tmp.push(name);
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

            proxy: function (fn) {
                var me = this;
                return function () {
                    return fn.apply(me, arguments);
                };
            },


            /**
             * me.$el에 이벤트를 바인딩
             */
            on: function () {
                var args = arraySlice.call(arguments);
                args[0] = this._normalizeEventNamespace(args[0]);

                this.$el.on.apply(this.$el, args);
                return this;
            },

            /**
             * me.$el에 등록된 이벤트를 언바인딩
             */
            off: function () {
                var args = arraySlice.call(arguments);
                this.$el.off.apply(this.$el, args);
                return this;
            },

            /**
             * me.$el에 일회용 이벤트를 바인딩
             */
            one: function () {
                var args = arraySlice.call(arguments);
                args[0] = this._normalizeEventNamespace(args[0]);

                this.$el.one.apply(this.$el, args);
                return this;
            },

            /**
             * me.$el에 등록된 이벤트를 실행
             */
            trigger: function () {
                var args = arraySlice.call(arguments);
                this.$el.trigger.apply(this.$el, args);
                return this;
            },

            /**
             * me.$el에 등록된 이벤트 핸들러를 실행
             */
            triggerHandler: function () {
                var args = arraySlice.call(arguments);
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
            },

            show: function () {},
            hide: function () {},
            setDisabled: function () {}
        });

        return View;
    });


})(window, jQuery);

(function ($, core, ui, undefined) {
    "use strict";

    var $doc = core.$doc,
        $win = core.$win;


    /**
     * 모달 클래스<br />
     * // 옵션 <br />
     * options.overlay:true 오버레이를 깔것인가<br />
     * options.clone: true  복제해서 띄울 것인가<br />
     * options.closeByEscape: true  // esc키를 눌렀을 때 닫히게 할 것인가<br />
     * options.removeOnClose: false // 닫을 때 dom를 삭제할것인가<br />
     * options.draggable: true              // 드래그를 적용할 것인가<br />
     * options.dragHandle: 'h1.title'       // 드래그대상 요소<br />
     * options.show: true                   // 호출할 때 바로 표시할 것인가...
     *
     * @class
     * @name jsa.ui.Modal
     * @extends jsa.ui.View
     * @example
     */
    var Modal = core.ui('Modal', /** @lends jsa.ui.Modal# */ {
        bindjQuery: 'modal',
        $statics: /** @lends jsa.ui.Modal */ {
            /**
             * 모달 생성시 발생되는 이벤트
             * @static
             */
            ON_MODAL_CREATED: 'modalcreated',
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
                    me.triggerHandler(e = $.Event(role), [me]);
                    if (e.isDefaultPrevented()) {
                        return;
                    }
                }

                this.hide();
            },
            'click .d-close': function (e) {
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
         * @param {Boolean}  options.clone: true    복제해서 띄울 것인가
         * @param {Boolean}  options.closeByEscape: true    // esc키를 눌렀을 때 닫히게 할 것인가
         * @param {Boolean}  options.removeOnClose: false   // 닫을 때 dom를 삭제할것인가
         * @param {Boolean}  options.draggable: true                // 드래그를 적용할 것인가
         * @param {Boolean}  options.dragHandle: 'h1.title'     // 드래그대상 요소
         * @param {Boolean}  options.show: true                 // 호출할 때 바로 표시할 것인가...
         */
        initialize: function (el, options) {
            var me = this;
            if (me.callParent(el, options) === false) {
                return me.release();
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

            me.on('mousewheel.modal', function (e) {
                e.stopPropagation();
            });
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

            me.$holder = $('<span class="d-modal-area" style="display:none;"></span>').insertAfter(me.$el);
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

            Modal.active = this;

            var me = this,
                e = $.Event('modalshow');

            me.trigger(e);
            if (me.isShown || e.isDefaultPrevented()) {
                return;
            }

            me.isShown = true;

            me.layout();
            me._draggabled();
            if (me.options.overlay !== false) {
                me._overlay();
            }
            if (!core.browser.isTouch) {
                me._escape();
                me._enforceFocus();
            }

            if (me.options.title) {
                me.$el.find('h1.d-modal-title').html(me.options.title || '알림');
            }

            me.$el.stop().addClass('d-modal-container')
                .css({
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    zIndex: 9900,
                    backgroundColor: '#ffffff',
                    outline: 'none',
                    backgroundClip: 'padding-box'
                }).fadeIn('fast', function () {
                    me.trigger('modalshown', {
                        module: this
                    });
                    me.layout();
                    me.$el.focus();
                });


            core.PubSub.trigger('hide:modal');
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
            me.trigger(e);
            if (!me.isShown || e.isDefaultPrevented()) {
                return;
            }

            $doc.off('focusin.modal');
            me.off('click.modal keyup.modal');

            me.isShown = false;
            if (!core.browser.isTouch) {
                me._escape();
            }
            me.hideModal();

            me.trigger('modalhidden');
            Modal.active = null;
        },

        /**
         * 뒷처리 담당
         */
        hideModal: function () {
            var me = this;
            me.$el.hide().removeData(me.moduleName).removeClass('d-modal-container');
            me.off(me.getEventNamespace());
            me._replaceHolder();

            if (me.options.removeOnClose) {
                me.$el.remove();
            }
            //140113추가
            if (me.options.opener) {
                me.options.opener.focus();
            }
            //140113추가 end

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
                me.$el.css('position', 'absolute');
                core.css.prefixStyle('user-select') && me.$(options.dragHandle).css(core.css.prefixStyle('user-select'), 'none');
                me.$el.on('mousedown.modaldrag touchstart.modaldrag', options.dragHandle, function (e) {
                    e.preventDefault();

                    var isMouseDown = true,
                        pos = me.$el.position(),
                        size = {
                            width: me.$el.width(),
                            height: me.$el.height()
                        },
                        docSize = {
                            width: core.util.getDocWidth(),
                            height: core.util.getDocHeight()
                        },
                        oriPos = {
                            left: e.pageX - pos.left,
                            top: e.pageY - pos.top
                        };

                    $doc.on('mousemove.modaldrag mouseup.modaldrag touchmove.modaldrag touchend.modaldrag touchcancel.modaldrag', function (e) {
                        switch (e.type) {
                            case 'mousemove':
                            case 'touchmove':
                                if (!isMouseDown) {
                                    return;
                                }
                                if (e.pageX + size.width > docSize.width || e.pageY + size.height > docSize.height || e.pageX - oriPos.left < 0 || e.pageY - oriPos.top < 0) {
                                    return;
                                }

                                me.$el.css({
                                    left: e.pageX - oriPos.left,
                                    top: e.pageY - oriPos.top
                                });
                                break;
                            case 'mouseup':
                                isMouseDown = false;
                                $doc.off('.modaldrag');
                                break;
                        }
                    });
                });

                me.$el.find(options.dragHandle).css('cursor', 'move');
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
            if ($('.d-modal-overlay').length > 0) {
                return false;
            } //140123_추가

            me.$overlay = $('<div class="d-modal-overlay" />');
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
         * $('...').find('.content').html( '...');  // 모달내부의 컨텐츠를 변경
         * $('...').modal('center');    // 컨텐츠의 변경으로 인해 사이즈가 변경되었으로, 사이즈에 따라 화면가운데로 강제 이동
         */
        center: function () {
            this.layout();
        },

        /**
         * 열기
         */
        open: function () {
            this.show();
        },

        /**
         * 닫기
         */
        close: function () {
            this.hide();
        },

        destroy: function () {
            var me = this;

            me.callParent();
            me.$el.add(me.$overlay).off('.modal').remove();
            $doc.off('.modal');
            $win.off('.modal');
        }
    });

    Modal.close = function (e) {
        if (!Modal.active) return;
        if (e) e.preventDefault();
        Modal.active.hide();
        Modal.active = null;
    };

    core.PubSub.on('hide:modal', function (e, force) {
        if (force === false) {
            if (Modal.active) {
                Modal.close();
            }
        }
    });

    core.modal = function (el, options) {
        $(el).modal(options);
    };

})(jQuery, window[LIB_NAME], window[LIB_NAME].ui);

(function ($, core, ui, undefined) {
    "use strict";

    var $win = core.$win,
        $doc = core.$doc,
        strUtil = core.string,
        dateUtil = core.date,
        numberUtil = core.number,

        daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        Calendar;

    /**
     * @class
     * @description 달력
     * @name jsa.ui.Calendar
     * @extends jsa.ui.View
     */
    Calendar = ui('Calendar', {
        bindjQuery: 'calendar',
        defaults: {
            weekNames: ['일', '월', '화', '수', '목', '금', '토'],
            monthNames: '1월,2월,3월,4월,5월,6월,7월,8월,9월,10월,11월,12월'.split(','),

            weekendDisabled: false, // 주말을 disabled시킬 것인가
            labelType: false, // 날짜가 선택되게 할 것인가
            inputTarget: '', // 날짜를 선택했을 때, 날짜가 들어갈 인풋박스의 셀렉터
            showDate: new Date(), // 처음에 표시할 기본 날짜
            template: {
                header: '<button class="d-calendar-prev">이전달</button>' +
                    '<span class="d-calendar-text"></span>' +
                    '<button class="d-calendar-next">다음달</button>',

                label: '<span class="d-calendar-day" title="<%-title%>"><%=day%></span>',
                button: '<button class="d-calendar-day <%-cls%>" title="<%-title%>" <%-disabled%>><%=day%></button>'
            },
            holidays: [], // 휴일 날짜 -> ['2014-04-05', '2014-05-12']
            canSelectHoliday: false // 휴일을 선택하게 할 것인가
        },
        events: {

        },

        /**
         *
         * @param el
         * @param options
         * @returns {boolean}
         */
        initialize: function (el, options) {
            var me = this;
            if (me.callParent(el, options) === false) {
                return me.release();
            }

            me.isInline = !me.$el.is('button, input');
            me.currDate = dateUtil.parseDate(me.options.showDate);

            //data-holidays속성을 이용한 경우 문자열로 넘어오기 때문에 배열로 변환해주어야 한다.
            if (core.is(me.options.holidays, 'string')) {
                try {
                    me.options.holidays = eval(me.options.holidays);
                } catch (e) {
                    me.options.holidays = [];
                }
            }

            if (me.isInline) {
                me._render();
            } else {
                me.$el.on('click', function (e) {
                    e.stopPropagation();
                    if (me.$calendar && me.$calendar.is(':visible')) {
                        me.close();
                        return;
                    }
                    me.open();
                });
            }
        },

        /**
         * 위치 재조절
         */
        _reposition: function () {
            var me = this,
                offset = me.$el.offset(),
                height = me.$el.height();

            me.$calendar.css({
                left: offset.left,
                top: offset.top + height
            }).focus();

            return me;
        },

        /**
         * 모달 띄우기
         * @returns {Calendar}
         */
        open: function () {
            var me = this;

            Calendar.active && Calendar.active.close();
            Calendar.active = this;

            me._render();
            me._reposition();
            me.show();

            return me;
        },

        /**
         * 모달 닫기
         * @returns {Calendar}
         */
        close: function () {
            if (this.isInline) {
                return;
            }

            this._remove();
            $doc.off('.calendar');
            Calendar.active = null;

            return this;
        },

        /**
         * 모달 표시
         * @returns {Calendar}
         */
        show: function () {
            var me = this;

            if (!me.isInline) {
                $doc.on('click.calendar', function (e) {
                    if (me.$calendar[0].contains(e.target)) {
                        e.stopPropagation();
                        return;
                    }

                    me.close();
                });
                me.$calendar.showLayer({
                    opener: me.$el
                });
            }

            return me;
        },

        /**
         * DOM 삭제
         * @returns {Calendar}
         */
        _remove: function () {
            var me = this;

            if (me.$calendar) {
                me.$calendar.off();
                me.$calendar.remove();
                me.$calendar = null;
            }

            return me;
        },

        /**
         * 렌더링
         */
        _render: function () {
            var me = this,
                opts = me.options,
                timer, tmpl;

            tmpl = '<div class="d-calendar-container">' +
                '<div class="d-calendar-header">' +
                opts.template.header +
                '</div>' +
                '<div class="d-calendar-date"></div>' +
                '</div>'

            me._remove();
            me.$calendar = $(tmpl);
            if (me.isInline) {
                // 인라인
                me.$el.empty().append(me.$calendar);
            } else {
                // 모달
                me.$calendar.css({
                    position: 'absolute'
                });
                me.$el.after(me.$calendar);
            }
            me.$calendar.on('click.calendar mousedown.calendar', '.d-calendar-prev, .d-calendar-next', function (e) {
                // 이전 / 다음
                var $el = $(e.currentTarget),
                    isPrev = $el.hasClass('d-calendar-prev');

                switch (e.type) {
                    case 'click':
                        me[isPrev ? 'prev' : 'next']();
                        break;
                    case 'mousedown':
                        clearInterval(timer);
                        timer = null;
                        timer = setInterval(function () {
                            me[isPrev ? 'prev' : 'next']();
                        }, 300);
                        $doc.on('mouseup.calendar', function () {
                            clearInterval(timer);
                            timer = null;
                            $doc.off('mouseup.calendar');
                        });
                        break;
                }
            }).on('click', 'button.d-calendar-day', function (e) {
                // 날짜 클릭
                var $this = $(this).parent(),
                    data = $this.data(),
                    date = new Date(data.year, data.month - 1, data.day),
                    format = dateUtil.format(date, opts.format || ''),
                    e;

                if (opts.inputTarget) {
                    $(opts.inputTarget).val(format)
                }

                me.$el.triggerHandler(e = $.Event('calendarselected'), {
                    year: $this.data('year'),
                    month: $this.data('month'),
                    day: $this.data('day'),
                    value: format,
                    date: date
                });

                if (!e.isDefaultPrevented() && !me.isInline) {
                    me.close();
                }
            });

            me._renderDate();

            return me;
        },

        /**
         * 휴일 여부
         * @param {Number} y 년도
         * @param {Number} m 월
         * @param {Number} d 일
         * @returns {boolean} 휴일여부
         * @private
         */
        _isHoliday: function (y, m, d) {
            var me = this,
                holidays = me.options.holidays,
                i, date, item;

            for (var i = -1; item = holidays[++i];) {
                date = dateUtil.parseDate(item);
                if (date.getFullYear() === y && date.getMonth() + 1 === m && date.getDate() === d) {
                    return true;
                }
            }

            return false;
        },

        /**
         * 달력 그리기
         * @returns {Calendar}
         * @private
         */
        _renderDate: function () {
            var me = this,
                opts = me.options,
                renderItem = opts.renderItem,
                date = me._getDateList(me.currDate),
                html = '',
                tmpl = core.template(opts.labelType ? opts.template.label : opts.template.button),
                isHoliday = false,
                i, j, y, m, d, week, len, cell;

            html += '<table class="d-calendar-table"><caption></caption>';
            html += '<thead>';
            for (i = 0; i < 7; i++) {
                html += '<th class="d-calendar-dayname ' + (i === 0 ? ' d-calendar-sunday' : i === 6 ? ' d-calendar-saturday' : '') + '">';
                html += opts.weekNames[i];
                html += '</th>';
            }
            html += '</thead><tbody>';

            for (i = 0, len = date.length; i < len; i++) {
                week = date[i];

                html += '<tr>';
                for (j = 0; j < 7; j++) {
                    y = week[j].year, m = week[j].month, d = week[j].day;
                    if (renderItem) {
                        cell = renderItem(new Date(y, m, d));
                    } else {
                        cell = {
                            cls: '',
                            html: '',
                            disabled: ''
                        };
                    }
                    isHoliday = ((j === 0 || j === 6) && opts.weekendDisabled) || me._isHoliday(y, m, d);

                    html += '<td class="d-calendar-cell' + (isHoliday ? ' d-calendar-holiday' : '') + (j === 0 ? ' d-calendar-sunday' : j === 6 ? ' d-calendar-saturday' : '') + '" data-year="' + y + '" data-month="' + m + '" data-day="' + d + '">';
                    if (cell.html) {
                        html += cell.html;
                    } else {
                        html += tmpl({
                            title: y + '년 ' + m + '월 ' + d + '일',
                            cls: cell.cls,
                            disabled: isHoliday || cell.disabled ? 'disabled="disabled" ' : '',
                            day: d
                        });
                    }
                }
                html += '</tr>'
            }

            html += '</tbody></table>';

            me.$calendar.find('.d-calendar-date').html(html);
            me.$calendar.find('.d-calendar-text').text(dateUtil.format(me.currDate, 'yyyy-MM'));

            return me;
        },

        /**
         * 날짜 변경
         * @param date
         */
        setDate: function (date) {
            if (!date) {
                return;
            }

            try {
                this.currDate = core.is(date, 'date') ? date : dateUtil.parseDate(date);
                this._renderDate();
            } catch (e) {
                throw new Error('Calendar#setDate(): 날짜 형식이 잘못 되었습니다.');
            }
            return this;
        },

        /**
         * 이전달
         * @returns {Calendar}
         */
        prev: function () {
            this.currDate.setMonth(this.currDate.getMonth() - 1);
            this._renderDate();

            return this;
        },

        /**
         * 다음달
         * @returns {Calendar}
         */
        next: function () {
            this.currDate.setMonth(this.currDate.getMonth() + 1);
            this._renderDate();

            return this;
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
                startOnWeek = date.getDay() + 1,
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

            var data = [],
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
        }
    });

})(jQuery, window[LIB_NAME], window[LIB_NAME].ui);

(function ($, core, ui, undefined) {
    "use strict";

    var $win = core.$win,
        $doc = core.$doc,
        strUtil = core.string,
        dateUtil = core.date,
        numberUtil = core.number;

    /**
     * @class
     * @name jsa.ui.Paginate
     * @description 페이징모듈
     * @extends jsa.ui.View
     */
    ui('Paginate', /** @lends jsa.ui.Paginate# */ {
        bindjQuery: 'paginate',
        $statics: /** @lends jsa.ui.Paginate */ {
            ON_CLICK_PAGE: 'paginateclickpage'
        },
        defaults: {
            pageSize: 10, // 페이지 수
            page: 1, // 기본 페이지
            totalCount: 0, // 전체 리스트 수
            paramName: 'page',
            isRenderLayout: false,

            ajax: false,

            firstImgSrc: 'first.gif',
            prevImgSrc: 'prev.gif',
            nextImgSrc: 'next.gif',
            lastImgSrc: 'last.gif'
        },

        events: {
            // 페이지링크 클릭
            'click a, button': function (e) {
                e.preventDefault();

                var me = this,
                    $btn = $(e.currentTarget),
                    page;

                if ($btn.hasClass('disable')) {
                    return;
                }

                if ($btn.hasClass('d-paginate-first')) {
                    // 첫 페이지
                    page = 1;
                } else if ($btn.hasClass('d-paginate-prev')) {
                    // 이전 페이지
                    page = Math.max(1, me.page - 1);
                } else if ($btn.hasClass('d-paginate-next')) {
                    // 다음 페이지
                    page = Math.min(me.options.totalCount, me.page + 1);
                } else if ($btn.hasClass('d-paginate-last')) {
                    // 마지막 페이지
                    page = me.options.totalCount;
                } else {
                    // 클릭한 페이지
                    page = $btn.data('page');
                }

                if (me.options.ajax) {
                    me.loadPage(page);
                } else {
                    me.setPage(page);
                }
            }
        },
        selectors: {},
        /**
         *
         * @param el
         * @param options
         */
        initialize: function (el, options) {
            var me = this;

            if (me.callParent(el, options) === false) {
                return me.release();
            }

            /*if(!me.options.ajax){
             throw new Error('ajax 옵션을 지정해 주세요.');
             }*/

            me.rowTmpl = me.$('.d-paginate-list').first().html();
            me.$('.d-paginate-list').empty();

            me._configure();
            me._render();
            if (me.options.ajax) {
                me.loadPage(me.options.page);
            } else {
                me.setPage(me.options.page);
            }

            me.$el.show();
        },

        /**
         * 멤버변수 초기화
         * @private
         */
        _configure: function () {
            var me = this;

            me.page = 1;
            me.currPage = 1;
            me.totalPage = Math.ceil(me.options.totalCount / me.options.pageSize);
        },

        /**
         * 기본 DOM 생성
         * @private
         */
        _render: function () {
            var me = this,
                opts = me.options,
                html = '';

            if (opts.isRenderLayout) {
                html = '<ul class="d-paginate-box">' +
                    '<li><button class="d-paginate-first" title="첫 페이지로 이동" >' +
                    '<img src="' + opts.firstImgSrc + '"/></button></li>' +
                    '<li><button href="#" class="d-paginate-prev" title="이전 페이지로 이동" >' +
                    '<img src="' + opts.prevImgSrc + '"/></button></li><li class="d-paginate-list"></li>' +
                    '<li><button href="#" class="d-paginate-next" title="다음 페이지로 이동" >' +
                    '<img src="' + opts.nextImgSrc + '"/></button></li>' +
                    '<li><button href="#" class="d-paginate-last" title="마지막 페이지로 이동" >' +
                    '<img src="' + opts.lastImgSrc + '"/></button></li></ul>';

                me.$el.html(html);
            }

        },

        /**
         * 페이지 번호 DOM 생성
         * @private
         */
        _renderPage: function () {
            var me = this,
                tmpNode = null,
                item = null,
                opts = me.options,
                total = opts.totalCount,
                nowPage, start, end;

            me.$('.d-paginate-first').prop('disabled', total === 0 || me.page === 1);
            me.$('.d-paginate-prev').prop('disabled', total === 0 || me.page <= 1);
            me.$('.d-paginate-next').prop('disabled', total === 0 || me.page >= total);
            me.$('.d-paginate-last').prop('disabled', total === 0 || me.page === total);

            if (total <= 0) {
                me.$el.find('.d-paginate-list').empty();
                me.$items = null;
                return;
            }

            nowPage = Math.floor((me.page - 1) / opts.pageSize);
            if (me.currPage !== nowPage && nowPage < me.totalPage) {
                me.currPage = nowPage;
                start = opts.pageSize * nowPage;
                end = Math.min(opts.totalCount, start + opts.pageSize);

                tmpNode = $('<ul>');
                for (var i = start + 1; i <= end; i++) {
                    item = $($.trim(me.rowTmpl.replace(/\{0\}/g, i)));
                    item.find('.d-paginate-page').attr('data-page', i);
                    tmpNode.append(item);
                }
                me.$('.d-paginate-list').empty().append(tmpNode.children());
                me.$items = me.$('.d-paginate-page');
                tmpNode = null;
            }

            me.$items.eq((me.page % opts.pageSize) - 1).parent().activeItem('on');
        },

        setPage: function (page) {
            this.page = page;
            this._renderPage();
        },

        /**
         * ajax 호출
         * @param {JSON} params 추가파라미터
         * @returns {Deferred}
         * @private
         */
        _ajax: function (params) {
            var me = this,
                opts = me.options;

            if (!opts.ajax) {
                return;
            }
            opts.ajax.data = $.extend({}, opts.ajax.data, params);
            return $.ajax(opts.ajax);
        },

        /**
         * ajax 호출 및 해당 페이지번호 활성화
         * @param {Number} page 페이지
         */
        loadPage: function (page) {
            var me = this,
                opts = me.options;

            if (page > 0) {
                var params = {},
                    e;

                params[opts.paramName] = page;
                me._ajax(params).done(function (res) {
                    var data = {
                        page: page,
                        result: res
                    };

                    me.triggerHandler(e = $.Event('paginatecomplete'), data);
                    if (e.isDefaultPrevented()) {
                        return;
                    }

                    me.setPage(page);
                    if ((!opts.ajax.dataType || opts.ajax.dataType === 'html' || data.type === 'html') && opts.listTarget) {
                        $(opts.listTarget).html(data.result);
                    }
                });
            }
        },

        /**
         * UI 새로고침
         * @param {JSON} options 변경할 옵션
         */
        update: function (options) {
            var me = this;

            me.options = $.extend({}, me.options, options);
            me._configure();
            me._renderPage();
        },

        release: function () {
            var me = this;

            me.callParent();
        }
    });

})(jQuery, window[LIB_NAME], window[LIB_NAME].ui);


(function ($, core, ui, undefined) {
    "use strict";

    var $win = core.$win,
        $doc = core.$doc,
        strUtil = core.string,
        dateUtil = core.date,
        numberUtil = core.number;

    /**
     * placeholder를 지원하지 않는 IE7~8상에서 placeholder효과를 처리하는 클래스
     * @class
     * @name jsa.ui.Placeholder
     * @extends jsa.ui.View
     * @example
     * new jsa.ui.Placeholder( $('input[placeholder]'), {});
     * // 혹은 jquery 플러그인 방식으로도 호출 가능
     * $('input[placeholder]').placeholder({});
     */
    var Placeholder = ui('Placeholder', /** @lends jsa.ui.Placeholder# */ {
        bindjQuery: 'placeholder',
        defaults: {
            foreColor: '',
            placeholderClass: 'placeholder'
        },
        /**
         * 생성자
         * @param {String|Element|jQuery} el 해당 엘리먼트(노드, id, jQuery 어떤 형식이든 상관없다)
         * @param {Object} options 옵션값
         */
        initialize: function (el, options) {
            var me = this,
                is = 'placeholder' in core.tmpInput;

            if (is) {
                return me.release();
            }
            if (me.callParent(el, options) === false) {
                // 암호인풋인 경우 백그라운으로 처리
                if (me.$el.attr('type') === 'password') {
                    me.$el.addClass(me.options.placeholderClass);
                } else {
                    me.$el.val(me.$el.attr('placeholder'));
                }
                return me.release();
            }
            me.placeholder = me.$el.attr('placeholder');
            me._foreColor = me.options.foreColor;

            var isPassword = me.$el.attr('type') === 'password';

            me.on('focusin click', function () {
                if (strUtil.trim(this.value) === me.placeholder || !$.trim(this.value)) {
                    me.$el.removeClass(me._foreColor);
                    // 암호요소인 경우 백그라운드로 처리
                    if (isPassword) {
                        me.$el.removeClass(me.options.placeholderClass);
                    }
                    this.value = '';
                }
            }).on('focusout', function () {
                if (this.value === '' || this.value === me.placeholder) {
                    if (isPassword) {
                        me.$el.val('').addClass(me.options.placeholderClass);
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
            me.callParent();
        }
    });

    if (!('placeholder' in core.tmpInput)) {
        $doc.on('submit.placeholder', 'form', function (e) {
            $('input[placeholder], textarea[placeholder]').each(function () {
                var $el;
                if (($el = $(this)).attr('placeholder') === this.value) {
                    $el.removeClass(Placeholder.prototype.defaults.foreColor);
                    this.value = '';
                }
            });
        });
    }


})(jQuery, window[LIB_NAME], window[LIB_NAME].ui);

(function ($, core, ui, undefined) {
    "use strict";

    var $win = core.$win,
        $doc = core.$doc,
        browser = core.browser,
        isTouch = browser.isTouch;

    /**
     * 커스텀스크롤이 붙은 컨텐츠담당 클래스
     * @class
     * @name jsa.ui.ScrollView
     * @extends jsa.ui.View
     * @example
     * new ScrollView('select.d_name', {});
     */
    var ScrollView = ui('ScrollView', /**@lends jsa.ui.ScrollView# */ {
        selectors: {

        },
        /**
         * 생성자
         * @param {String|Element|jQuery} el 해당 엘리먼트(노드, id, jQuery 어떤 형식이든 상관없다)
         * @param {Object} options 옵션값
         */
        initialize: function (el, options) {
            var me = this;

            if (me.callParent(el, options) === false) {
                return me.release();
            }

            if (!me.$el.has('.d-scrollview')) {
                me._createScrollbar();
            }

            // 스크롤 컨테이너
            me.$scrollView = me.$('.d-scrollview');
            // 스크롤바
            me.$scrollBar = me.$('.d-scrollbar');
            // 컨텐츠
            me.$content = me.$('.d-scrollcontent');

            me._configure();
            me._isMouseEnter = false;
            me._isMouseDown = false;
            me.isScrollForceHide = false;

            me.$scrollBar.parent().hide();

            if (isTouch) {
                // 터치기반 디바이스일 때, 터치이벤트 바인딩
                me._bindTouch();
            } else {
                me._bindMouse();
            }

            me.update();
        },

        _createScrollbar: function () {
            var me = this;

            me.$el.append('<div class="scroll_wrap" style="display: none;">' +
                '<div class="scroll d-scrollbar" style="height: 94px; top: 0px;">' +
                '<div class="body" style="height: 100px;"></div>' +
                '<div class="bottom"></div>' +
                '</div></div>');
        },

        /**
         * 마우스기반 디바이스에서는 마우스 이벤트 바인딩
         * @private
         */
        _bindMouse: function () {
            var me = this;

            // 스크롤바 드래그 시작 준비
            me.$scrollBar.on('mousedown', function (e) {
                e.preventDefault();
                if (isTouch) {
                    e.stopPropagation();
                }

                me._isMouseDown = true;
                me._currY = parseInt($(this).css('top'), 10);
                me._downY = me._getY(e); // 마우스의 y 위치

                // 글로벌 이벤트 등록
                me._bindDocEvent();
                return false;
            });

            // 스크롤 시, 커스텀스크롤바 위치 조절
            me.$scrollView.on('scroll', function () {
                if (!me._isMouseDown) { // 마우스휠에 의한 스크롤일 때만 스크롤바 위치 조절
                    me.update();
                }
            }).on('mousewheel DOMMouseScroll', function (e) {
                // 마우스 휠로 스크롤링 할때 내부컨텐츠 scrollTop 갱신
                e.preventDefault();
                e = e.originalEvent;
                var delta = e.wheelDelta || -e.detail;

                me.$scrollView.scrollTop(me.$scrollView.scrollTop() - delta);
            });
            // 탭키로 리스트에 접근했을 때, 스크롤바를 표시....
            // (timer를 쓰는 이유는 포커스가 옮겨질때마다 레이아웃을 새로 그려지는 걸 방지하기 위함으로,
            // ul내부에 포커스가 처음 들어올 때, 마지막으로 빠져나갈 때만 발생한다.)
            me.on('focusin focusout', '.d-scrollcontent', (function () {
                var timer = null;
                return function (e) {
                    clearTimeout(timer), timer = null;
                    if (e.type === 'focusin') {
                        !me._isMouseEnter && (timer = setTimeout(function () {
                            me.$el.triggerHandler('mouseenter');
                        }, 200));
                    } else {
                        me._isMouseEnter && (timer = setTimeout(function () {
                            me.$el.triggerHandler('mouseleave');
                        }, 200));
                    }
                };
            })());

            me.$el.on('mouseenter mouseleave', function (e) {
                if (e.type === 'mouseenter' && !me.isScrollForceHide) {
                    // 마우스가 컨텐츠영역 안으로 들어올 때 스크롤 위치를 계산후, 표시
                    me._isMouseEnter = true;
                    me._configure();
                    me._toggleScrollbar(true);
                } else {
                    // 마우스가 컨텐츠영역 밖으로 벗어날 때 숨김
                    me._isMouseEnter = false;
                    if (!me._isMouseDown) {
                        me._toggleScrollbar(false);
                    }
                }
            });
        },

        /**
         * 터치기반 디바이스에서는 터치이벤트 바인딩
         * @private
         */
        _bindTouch: function () {
            var me = this,
                $con = me.$scrollView,
                scrollTop = 0,
                startY = 0;

            me.on('touchstart touchmove touchend touchcancel', '.d-scrollview>ul', function (e) {
                var oe = e.originalEvent;
                if (oe.touches.length != 1) {
                    return;
                }
                var touchY = oe.touches[0].pageY;

                switch (e.type) {
                    case 'touchstart':
                        scrollTop = $con.scrollTop();
                        startY = touchY;
                        break;
                    case 'touchmove':
                        e.preventDefault();
                        e.stopPropagation();
                        $con.scrollTop(scrollTop + (startY - touchY));
                        break;
                    default:
                        break;
                }
            });
        },

        /**
         * 스크롤바 드래그를 위한 글로벌 이벤트 바인딩
         * @private
         */
        _bindDocEvent: function () {
            var me = this;

            $doc.off('.scrollview').on('mouseup.scrollview touchend.scrollview mousemove.scrollview touchmove.scrollview', function (e) {
                switch (e.type) {
                    case 'mouseup':
                    case 'touchend':
                        // 드래그 끝
                        me._isMouseDown = false;
                        me._moveY = 0;

                        $doc.off('.scrollview');
                        if (!me._isMouseEnter) {
                            me._toggleScrollbar(false);
                        }
                        break;
                    case 'mousemove':
                    case 'touchmove':
                        // 드래그 중
                        me._moveY = me._getY(e);
                        me._move(me._currY - (me._downY - me._moveY));

                        e.preventDefault();
                        break
                }
            });
        },
        /**
         * 현 시점에 컨텐츠 길이와 컨테이너 길이를 바탕으로 스크롤바 사이즈와 위치를 재계산
         * @private
         */
        _configure: function () {
            var me = this;

            me._moveY = 0;
            me._containerHeight = me.$scrollView.height(); // 컨테이너 높이
            me._contentHeight = me.$content.innerHeight(); // 컨텐츠 높이
            me._scrollRate = me._containerHeight / me._contentHeight; // 스크롤 사이즈 비율
            me._scrollBarHeight = me._containerHeight * me._scrollRate; // 스크롤바 크기
            if (me._scrollBarHeight < 20) { // 최소 크기: 20
                me._scrollRate = (me._containerHeight - (20 - me._scrollBarHeight)) / me._contentHeight;
                me._scrollBarHeight = 20;
            }
            me._scrollHeight = me._containerHeight - me._scrollBarHeight; // 실제 스크롤 영역 크기
            me._contentTop = me.$scrollView.scrollTop(); // 현재 컨텐츠의 scrollTop
        },

        /**
         * _configure에서 계산된 값을 바탕으로 스크롤바 위치 조절
         * @private
         */
        _scrollLayout: function () {
            var me = this;
            // 컨텐츠가 컨테이너보다 클 경우에만...
            if (me._contentHeight > me._containerHeight) {
                me.$scrollBar.css({
                    'height': me._scrollBarHeight,
                    'top': Math.min(me._contentTop * me._scrollRate, me._scrollHeight)
                })
                    .children('div.body').css('height', me._scrollBarHeight - 6);
            }
        },

        /**
         * 스크롤바 표시 토글링
         * @private
         * @param {Boolean} isShow 표시여부
         */
        _toggleScrollbar: function (isShow) {
            var me = this;
            if (me._contentHeight < me._containerHeight) {
                me.$scrollBar.parent().hide();
            } else {
                me._scrollLayout();
                me.$scrollBar.parent().toggle(isShow);
            }
        },
        /**
         * 드래그 시 호출되는 함수
         * @private
         * @param {Integer} top 마우스의 y 위치
         */
        _move: function (top) {
            var me = this;

            top = Math.max(0, Math.min(top, me._scrollHeight));

            me.$scrollBar.css('top', top);
            me.$scrollView.scrollTop((me._contentHeight - me._containerHeight) * (top / me._scrollHeight));
        },

        /**
         * 터치이벤트, 마우스이벤트에 따른 y좌표값 반환(_bindDocEvent에서 호출됨)
         * @param {jQuery#Event} e jquery 이벤트
         * @return {Integer}
         */
        _getY: function (e) {
            if (isTouch && e.originalEvent.touches) {
                e = e.originalEvent.touches[0];
            }
            return e.pageY;
        },
        /**
         * 스크롤를 다시 계산하여 표시하기
         */
        update: function () {
            var me = this;

            me._configure();
            me._scrollLayout();

            return this;
        }
    });

})(jQuery, window[LIB_NAME], window[LIB_NAME].ui);

(function ($, core, ui, undefined) {
    "use strict";

    var $win = core.$win,
        $doc = core.$doc,
        isTouch = core.browser.isTouch;

    /**
     * 커스텀 셀렉트박스<br />
     * wrapClasses: ''<br />
     * disabledClass: 'disabled'<br />
     *
     * @class
     * @name jsa.ui.Selectbox
     * @extends jsa.ui.View
     */
    var Selectbox = ui('Selectbox', /** @lends jsa.ui.Selectbox# */ {
        bindjQuery: 'selectbox',
        $statics: {
            ON_CHANGED: 'selectboxchanged'
        },
        /**
         * 옵션
         * @property {JSON}
         */
        defaults: {
            wrapClasses: '',
            disabledClass: 'disabled'
        },
        /**
         * 생성자
         * @param {jQuery|Node|String} el 대상 엘리먼트
         * @param {JSON} options {Optional} 옵션
         */
        initialize: function (el, options) {
            var me = this;
            if (me.callParent(el, options) === false) {
                return me.release();
            }
            me._create();
        },

        /**
         * select 컨트롤을 기반으로 UI DOM 생성
         * @private
         */
        _create: function () {
            var me = this,
                cls = me.$el.attr('data-class') || 'select_type01',
                timer = null;

            me.width = parseInt(me.$el.css('width'), 10);
            // 셀렉트박스
            me.$selectbox = $('<div class="' + cls + '"></div>').addClass(me.options.wrapClasses);
            me.$selectbox.insertAfter(me.$el.hide());

            me._createLabel();
            me._createList();

            me.$selectbox.on('selectboxopen selectboxclose', function (e) {
                e.stopPropagation();

                // 리스트가 열리거나 닫힐 때 zindex 처리
                var zindexSelector = me.$el.attr('data-zindex-target'),
                    $zIndexTargets = zindexSelector ? me.$el.parents(zindexSelector) : false;

                if (e.type === 'selectboxopen') {
                    me.$label.addClass('open');
                    me.$el.closest('div.select_wrap').addClass('on');
                    $zIndexTargets && $zIndexTargets.addClass('on');

                    isTouch && $('body').on('touchend.selectbox', function () {
                        me.close();
                    });
                } else {
                    me.$label.removeClass('open');
                    me.$el.closest('div.select_wrap').removeClass('on');
                    $zIndexTargets && $zIndexTargets.removeClass('on');
                    clearTimeout(timer), timer = null;

                    isTouch && $('body').off('touchend.selectbox');
                }
            });

            // 비터치 기반일 때에 대한 이벤트 처리
            if (!isTouch) {
                // 셀렉트박스에서 포커스가 벗어날 경우 자동으로 닫히게
                me.$selectbox.on('focusin focusout', function (e) {
                    clearTimeout(timer), timer = null;
                    if (e.type === 'focusout' && me.$label.hasClass('open')) {
                        timer = setTimeout(function () {
                            me.close();
                        }, 100);
                    }
                }).on('keydown', function (e) {
                    if (e.keyCode === core.keyCode.ESCAPE) {
                        me.close();
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
         * 레이블 생성
         * @private
         */
        _createLabel: function () {
            var me = this;

            me.$label = $('<span class="select_box" tabindex="0" title="' + (me.$el.attr('title') || '셀렉트박스') + '"><span class="sel_r" style="width:190px;">&nbsp;</span></span>');
            me.$label.on('click', '.sel_r', function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (me === Selectbox.active) {
                    me.close();
                    return;
                }

                if (!me.$label.hasClass(me.options.disabledClass)) {
                    // 현재 셀렉트박스가 열려있으면 닫고, 닫혀있으면 열어준다.
                    if (me.$label.hasClass('open')) {
                        me.close();
                    } else {
                        me.open();
                    }
                }
            });

            // 키보드에 의해서도 작동되도록 바인딩
            !isTouch && me.$label.on('keydown', function (e) {
                if (e.keyCode === 13) {
                    $(this).find('.sel_r').trigger('click');
                } else if (e.keyCode === core.keyCode.DOWN) {
                    me.open();
                    me.$list.find(':focusable:first').focus();
                }
            });
            me.$label.find('.sel_r').css('width', me.width);
            me.$selectbox.append(me.$label);
        },

        /**
         * 리스트 생성
         * @private
         */
        _createList: function () {
            var me = this;

            me.$list = $('<div class="select_open" style="position:absolute;" tabindex="0"></div>');
            me.$list.hide().on('click', function (e) {
                me.$list.focus();
            }).on('click', 'li>a', function (e) {
                // 아이템을 클릭했을 때
                e.preventDefault();
                e.stopPropagation();

                me.selectedIndex($(this).parent().index());
                me.close();
                me.$label.focus();
            }).on('mousedown', 'li>a', function () {
                this.focus();
            });

            !isTouch && me.$list.on('keydown', 'li a', function (e) {
                // 키보드의 위/아래 키로 이동
                var index = $(this).parent().index(),
                    items = me.$list.find('li'),
                    count = items.length;

                switch (e.keyCode) {
                    case core.keyCode.UP:
                        e.stopPropagation();
                        e.preventDefault();
                        items.eq(Math.max(0, index - 1)).children().focus();
                        break;
                    case core.keyCode.DOWN:
                        e.stopPropagation();
                        e.preventDefault();
                        items.eq(Math.min(count - 1, index + 1)).children().focus();
                        break;
                }
            });
            me.$selectbox.append(me.$list);
        },

        /**
         * 리스트 표시
         */
        open: function () {
            var me = this,
                scrollTop = $win.scrollTop(),
                winHeight = $win.height(),
                offset = me.$selectbox.offset(),
                listHeight = me.$list.height();

            Selectbox.active && Selectbox.active.close();

            me.$list.css('visibility', 'hidden').show();
            if (offset.top + listHeight > scrollTop + winHeight) {
                me.$list.css('marginTop', (listHeight + me.$selectbox.height()) * -1);
            } else {
                me.$list.css('marginTop', '');
            }

            me.$list.css('visibility', '');
            me.$selectbox.triggerHandler('selectboxopen');
            Selectbox.active = me;
            $doc.on('click.selectbox', function (e) {
                Selectbox.active && Selectbox.active.close();
            });
        },

        /**
         * 리스트 닫기
         */
        close: function () {
            var me = this;

            me.$list.hide(), me.$selectbox.triggerHandler('selectboxclose');
            $doc.off('.selectbox');
            Selectbox.active = null;
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
                me.trigger('change', {
                    selectedIndex: index
                });
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
                core.each(me.$el[0].options, function (item, i) {
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
        update: function (list) {
            var me = this,
                opts = me.options,
                html = '',
                index = -1,
                text = '';

            if (core.isArray(list)) {
                // list 값이 있으면 select를 갱신시킨다.
                me.el.options.length = 1;
                core.each(list, function (item, i) {
                    me.el.options.add(new Option(item.text || item.value, item.value));
                });
            }

            // select에 있는 options를 바탕으로 UI를 새로 생성한다.
            core.each(core.toArray(me.$el[0].options), function (item, i) {
                if ($(item).prop('selected')) {
                    index = i;
                    text = item.text;
                }
                html += '<li><a href="#" data-value="' + item.value + '" data-text="' + item.text + '">' + item.text + '</a></li>';
            });
            me.$list.empty().html('<ul>' + html + '</ul>').find('li:eq(' + index + ')').addClass('on');
            me.$label.children().text(text);

            if (me.$el.prop('disabled')) {
                me.$label.addClass(opts.disabledClass).removeAttr('tabIndex');
            } else {
                me.$label.removeClass(opts.disabledClass).attr('tabIndex', 0);
            }
        },

        /**
         * 소멸자
         */
        release: function () {
            var me = this;

            me.callParent();
            me.$label.off().remove();
            me.$list.off().remove();
            me.$el.unwrap('<div></div>');
            me.$el.off('change.selectbox').show();
        }
    });

})(jQuery, window[LIB_NAME], window[LIB_NAME].ui);

(function ($, core, ui, undefined) {
    "use strict";

    var $win = core.$win,
        $doc = core.$doc,
        strUtil = core.string,
        dateUtil = core.date,
        numberUtil = core.number;

    /**
     * @class
     * @name jsa.ui.Tab
     * @description 페이징모듈
     * @extends jsa.ui.View
     */
    ui('Tab', /** @lends jsa.ui.Tab# */ {
        bindjQuery: 'tab',
        $statics: /** @lends jsa.ui.Tab */ {
            ON_TAB_CHANGED: 'tabchanged'
        },
        defaults: {
            selectedIndex: 0,
            onClassName: 'on'
        },

        events: {
            // 페이지링크 클릭
            'click >ul>li>a': function (e) {
                e.preventDefault();

                var me = this,
                    $btn = $(e.currentTarget),
                    index = $btn.parent().index();

                me.selectTab(index);
            }
        },
        selectors: {
            tab: '>ul>li'
        },
        /**
         *
         * @param el
         * @param options
         */
        initialize: function (el, options) {
            var me = this;

            if (me.callParent(el, options) === false) {
                return me.release();
            }

            me.selectTab(me.options.selectedIndex);
        },

        selectTab: function (index) {
            var me = this;

            me.selectedIndex = index;
            me.$tab.eq(index).activeItem(me.options.onClassName);
            me.triggerHandler('tabchanged', {
                selectedIndex: index
            });
        }
    });

})(jQuery, window[LIB_NAME], window[LIB_NAME].ui);

(function ($, core, ui, undefined) {
    var $win = core.$win,
        $doc = core.$doc,
        $body = core.$body;


    /**
     * 아코디언  이벤트
     * @name ui.AccordionListEvent
     * @class AccordionListEvent Class
     */
    core.define("ui.AccordionListEvent", {
        /** @lends ui.AccordionListEvent */
        /** @property { String } EXPAND 리스트 열기  */
        EXPAND: "expand",
        /** @property { String } FOLD 리스트 닫기  */
        FOLD: "fold",
        /** @property { String } EXPAND 리스트 열림*/
        EXPANDED: "expanded",
        /** @property { String } EXPAND 리스트 닫힘*/
        FOLDED: "folded"
    });


    /**********************************************************************************************
     *
     * AccordionList
     *
     **********************************************************************************************/

    /**
     * ...
     * @class
     * @name ui.AccordionList
     */
    ui('AccordionList', /**@lends ui.AccordionList# */ {
        bindjQuery: 'accordion',
        $statics: /**@lends ui.AccordionList */ {

        },

        $mixins: [ui.Listener],

        defaults: {
            selectedClass: "on",
            disabledTitleClass: "disable",
            noneClass: "none",
            isSlideType: false,
            slideTime: 300,
            foldOthers: true,
            defaultOpenIndex: -1
        },

        selectors: {
            list: ".d-accord-content",
            toggleClassTarget: ".d-accord-content",
            toggleButton: ".d-toggle-button",
            content: ".cont"
        },

        events: {},

        /**
         *
         * @param el
         * @param options
         */
        initialize: function (el, options) {
            if (this.callParent(el, options) === false) {
                return;
            }
            this.isAniComplete = true;
            this.currentIndex;
            this.$contentList;

            if (this.options.isSlideType == "false") {
                this.options.isSlideType = false
            }

            if (this.options.defaultOpenIndex != -1) {
                this._visibleExpand(this.options.defaultOpenIndex);
            }

            this._setHandlerOption();
            this._bindEvent();
        },

        /**
         * _option.isSlideType에 따라 핸들러 함수 설정
         * @private
         */
        _setHandlerOption: function () {
            this.fold = this._visibleFold;
            this.expand = this._visibleExpand;
            if (this.options.isSlideType) {
                this.fold = this._slideFold;
                this.expand = this._slideExpand;
            }
        },

        /**
         * 이벤트 바인딩
         * @private
         */
        _bindEvent: function () {
            var me = this;
            var gnbTimer = undefined;
            var clicked = false;
            var isTouch = jsa.browser.isTouch;

            function setClickedTimer() {
                clicked = true;
                clearTimeout(gnbTimer);
                gnbTimer = setTimeout(function () {
                    clicked = false;
                }, 500);
            }

            var count = 0;
            this.$el.on("click dblclick", this.selectors.toggleButton, function (e) {
                if (isTouch && clicked) {
                    e.preventDefault();
                    return
                };

                if (isTouch) {
                    setClickedTimer();
                }

                var $t = $(this);
                if ($t.hasClass(me.options.disabledTitleClass)) {
                    return;
                }

                var $currentTarget = $t.closest(me.selectors.list);
                var $classTarget;
                if (me.selectors.toggleClassTarget == me.selectors.list) {
                    $classTarget = $currentTarget;
                } else {
                    $classTarget = $currentTarget.find(me.selectors.toggleClassTarget);
                }

                me.$contentList = me.$el.find(me.selectors.list);
                var index = me.$contentList.index($currentTarget);

                if ($currentTarget.find(me.selectors.content).length) {
                    e.preventDefault();
                }

                if ($classTarget.hasClass(me.options.selectedClass)) {
                    me.fold(index);
                } else {
                    me.expand(index);
                }
            });
        },

        /**
         * 거리에 따른 duration 계산
         * @return { Integer }
         */
        _getDuration: function (dist, value) {
            var time = (dist / value) * this.options.slideTime;
            if (time < 200) {
                time = 200
            };
            if (time > 700) {
                time = 700
            };
            return time;
        },

        /**
         * slide effect expand handler
         * @private
         * @param { Integer } target index
         */
        _slideExpand: function (index) {
            var targetData = this._getTargetData(index);
            if (!targetData.isExe) {
                return;
            }

            var $targetCont = targetData.$targetCont,
                $scaleTarget = targetData.$scaleTarget,
                $classTarget = targetData.$classTarget;

            this.isAniComplete = false;
            $scaleTarget.removeClass(this.options.noneClass);
            $classTarget.addClass(this.options.selectedClass);

            var duration = this.options.slideTime;
            if (this.options.foldOthers && index != this.currentIndex) {
                this.isAniComplete = true;
                this._slideFold(this.currentIndex, duration);
            }

            $scaleTarget.stop().height(0).animate({
                "height": $scaleTarget.children().outerHeight()
            }, duration, $.proxy(function () {
                this.isAniComplete = true;
                this.trigger(ui.AccordionListEvent.EXPANDED);
                $scaleTarget.height("");
            }, this));

            this.currentIndex = index;
        },

        _getTargetData: function (index) {
            var $targetCont;
            if (this.$contentList) {
                $targetCont = this.$contentList.eq(index);
            } else {
                $targetCont = this.$el.find(this.selectors.list).eq(index);
            }

            var $scaleTarget = $targetCont.find(this.selectors.content);

            var isExe = true;
            if (!this.isAniComplete || $scaleTarget.length == 0) {
                isExe = false
            }

            var $classTarget;
            if (this.selectors.toggleClassTarget == this.selectors.list) {
                $classTarget = $targetCont;
            } else {
                $classTarget = $targetCont.find(me.selectors.toggleClassTarget);
            }

            return {
                $targetCont: $targetCont,
                $scaleTarget: $scaleTarget,
                $classTarget: $classTarget,
                isExe: isExe
            }
        },


        /**
         * slide effect fold handler
         * @private
         * @param { Integer } target index
         */
        _slideFold: function (index, duration) {

            var targetData = this._getTargetData(index);
            if (!targetData.isExe) {
                return;
            }

            var $targetCont = targetData.$targetCont,
                $scaleTarget = targetData.$scaleTarget,
                $classTarget = targetData.$classTarget;

            this.isAniComplete = false;

            $classTarget.removeClass(this.options.selectedClass);
            if (duration == undefined) {
                duration = this.options.slideTime;
                //duration = this._getDuration( $scaleTarget.height(), 500);
            }

            $scaleTarget.stop().animate({
                "height": 0
            }, duration, $.proxy(function () {
                $scaleTarget.addClass(this.options.noneClass);
                this.trigger(ui.AccordionListEvent.FOLDED);
                this.isAniComplete = true;
            }, this));
        },

        /**
         * expand handler
         * @private
         * @param { Integer } target index
         */
        _visibleExpand: function (index) {
            var targetData = this._getTargetData(index);
            if (!targetData.isExe) {
                return;
            }

            var $targetCont = targetData.$targetCont,
                $scaleTarget = targetData.$scaleTarget,
                $classTarget = targetData.$classTarget;

            $scaleTarget.removeClass(this.options.noneClass);
            $classTarget.addClass(this.options.selectedClass);

            if (this.options.foldOthers && index != this.currentIndex) {
                this._visibleFold(this.currentIndex);
            }
            $scaleTarget.removeClass(this.options.noneClass);

            this.currentIndex = index;
        },

        /**
         * fold handler
         * @private
         * @param { Integer } target index
         */
        _visibleFold: function (index) {
            var targetData = this._getTargetData(index);
            if (!targetData.isExe) {
                return;
            }

            var $targetCont = targetData.$targetCont,
                $scaleTarget = targetData.$scaleTarget,
                $classTarget = targetData.$classTarget;

            $classTarget.removeClass(this.options.selectedClass);
            $scaleTarget.addClass(this.options.noneClass);
        },

        release: function () {

        }
    });
})(jQuery, window[LIB_NAME], window[LIB_NAME].ui);


(function ($, core, ui, undefined) {
    "use strict";

    // 글로벌 기능들 구현 부분
    // modal, selectbox

    var $doc = core.$doc,
        win = window,
        _isInit = false;

    /**
     * 주어진 엘리먼트 하위에 속한 공통 UI들을 빌드
     * @function
     * @name $#buildUIControls
     * @param {String} types (Optional) "tab,selectbox,calendar,placeholder"
     */
    $.fn.buildUIControls = function () {
        this.find('.d-selectbox').selectbox(); // 셀렉트박스 스킨모드로 변경
        this.find('.d-tab').tab(); // 탭
        this.find('.d-calendar').calendar(); // 달력
        this.find('.d-accordion').accordion(); // 아코디온
        if (!('placeholder' in core.tmpInput)) { // placeholder
            this.find('input[placeholder], textarea[placeholder]').placeholder();
        }
    };

    // 공통 UI와 관련하여 이벤트 정의
    core.GlobalUI = {
        init: function () {
            if (_isInit) {
                return;
            }

            this.base();
            // TODO : 체크박스, 라디오박스가 스킨형을 사용하지 않음
            //this.checkbox();
            //this.radiobox();
            this.hover();
            this.modal();
            this.windowPopup();
            this.print();
        },


        base: function () {
            // tab, selectbox, calendar, placeholder
            $doc.buildUIControls();
        },

        hover: function () {
            // 호버 효과
            $doc.on('mouseenter.globalui', '.d-hover', function (e) {
                $(this).addClass('hover');
            });

            $doc.on('mouseleave.globalui', '.d-hover', function (e) {
                $(this).removeClass('hover');
            });
        },

        checkbox: function () {
            // 체크박스
            $doc.on('click.globalui', 'input:checkbox', function (e) {
                $(this).parent().toggleClass('on', this.checked);
            });
        },

        radiobox: function () {
            // 라디오박스
            $doc.on('click.globalui', 'input:radio', function (e) {
                $(this).closest('form')
                    .find('input[name=' + this.name + ']')
                    .parent().removeClass('on');
                $(this).parent().addClass('on');
            });
        },


        windowPopup: function () {
            //윈도우 창 닫기 기능
            $doc.on("click.globalui", ".d-win-close", function () {
                win.open('', '_self').close();
            });
        },

        print: function () {
            //인쇄 기능
            $doc.on("click.globalui", ".d-print", function (e) {
                e.preventDefault();
                win.print();
            });
        },

        modal: function () {
            // 모달 띄우기
            $.fn.modal && $doc.on('click.globalui', '[data-control=modal]', function (e) {
                e.preventDefault();
                var $el = $(this),
                    target = $el.attr('href') || $el.attr('data-target'),
                    $modal;
                if (target) {
                    // ajax형 모달인 경우
                    if (!/^#/.test(target)) {
                        $.ajax({
                            url: target
                        }).done(function (html) {
                            $modal = $('<div class="d-modal-ajax d-modal-new" style="display:none"></div>').html(html).insertAfter($el);
                            $modal.modal({
                                removeOnClose: true
                            });
                        });
                        return;
                    } else {
                        $modal = $(target);
                    }
                } else {
                    $modal = $(this).next('div.d-layerpop');
                }

                if ($modal && $modal.length > 0) {
                    $modal.modal();
                }
            });

            // ajax로 생성된 레이어팝업이면 표시때, 내부에 속한 공통 UI 들을 빌드
            $doc.on('modalshown.globalui', '.d-modal-new', function (e) {
                $(this).buildUIControls().removeClass('d-modal-new');
            });
        },

        selectAjax: function () {
            // 단계 셀렉트박스 : 테스트임
            $doc.on('change', 'select[data-next-target]', function (e) {
                var $next = $(this.getAttribute('data-next-target')),
                    el = this,
                    url;
                if ($next.length === 0 || !(url = $next.attr('data-url'))) {
                    return;
                }

                $.ajax({
                    url: url.replace(/\{0\}/g, el.value),
                    contentType: 'json'
                }).done(function (res) {
                    if (res.success) {
                        $(el).selectbox('update', res.list);
                    }
                });
            });
        }
    };

})(jQuery, window[LIB_NAME], window[LIB_NAME].ui);

(function ($, core, ui, undefined) {
    "use strict";

    var $doc = core.$doc,
        $win = core.$win;

    // ui를 글로벌에 설정
    window.ui = ui;
    window.strUtil = core.string; // 문자열 유틸함수
    window.numUtil = core.number; // 숫자 유틸함수
    window.dateUtil = core.date; // 날짜 유틸함수
    window.arrUtil = core.array; // 배열 유틸함수
    window.objUtil = core.object; // 오브젝트 유틸함수


    // placeholder 암호 백그라운드 class
    ui.Placeholder.prototype.defaults.placeholderClass = 'user_pw';

    $(function () {
        core.GlobalUI.init();
    });

})(jQuery, window[LIB_NAME], window[LIB_NAME].ui);
