/**
 * <pre>
 * 공통 스크립트 모듈
 * </pre>
 * 
 * @namespace
 * @author 김왕기
 * @version 1.0(2013. 03. 07) 최초 생성
 */
var Common = {
	/**
	 * 날짜 파싱
	 * @param date
	 */
	parseDate: function( dt ) {
		if ( ! ( dt instanceof Date ) ) {
			dt = new Date();
		}
		
		var year = dt.getFullYear(),
			month = dt.getMonth() + 1,
			date = dt.getDate(),
			day = dt.getDay(),
			hours = dt.getHours(),
			minutes = dt.getMinutes(),
			seconds = dt.getSeconds(),
			lastDate = new Date( year, month, 0 ).getDate();
		
		return {
			year: year,
			month: month,
			date: date,
			day: day,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
			firstDate: 1,
			lastDate: lastDate,
			isFirstDate: ( date === 1 ),
			isLastDate: ( date === lastDate )
		};
	},
		
    /**
     * 왼쪽 문자 채우기
     * 
     * @param {String} val 값
     * @param {Number} len 길이
     * @param {String} str 문자
     */
    lpad: function( val, len, str ) {
    	var v = new String( val ),
    	    n = ( len || 2 ) - v.length,
    		s = str || '0',	
    		p = '',
    		i;
    	
		for ( i = 0; i < n; i += 1 ) {
			p += s;
		}
    	
    	return p + v;
    },
    
    /**
     * <pre>
     * 비밀번호 레벨 확인
     * </pre>
     * @function
     * @param {String} value 비밀번호
     */
    getPasswordLevel: function() {
    	var REGEXP_PASSWORD_LV1 = /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{10,12}$/,
			REGEXP_PASSWORD_LV2 = /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{13,15}$/,
			REGEXP_PASSWORD_LV3 = /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{16,}$/;
	    	
    	return function( value ) {
			if ( REGEXP_PASSWORD_LV1.test( value ) ) {
    			return 1;
    		} else if ( REGEXP_PASSWORD_LV2.test( value ) ) {
    			return 2;
    		} else if ( REGEXP_PASSWORD_LV3.test( value ) ) {
    			return 3;
    		}
			
    		return 0;
    	};
    }(),
    
    /**
     * <pre>
     * 비밀번호 검증
     * </pre>
     * 
     * @function
     * @param {jQuery} input 입력 객체 셀렉터
     * @param {jQuery} valid 검증 객체 셀렉터
     * @param {jQuery} message 메세지 객체 셀렉터
     */
    validatePassword: function( input, valid, message ) {
		var $input = $( input ),
    		$valid = $( valid ),
    		$message = $( message );
    	
    	$input.unbind( '.valid' ).bind( 'keyup.valid', function() {
    		var cls, lvl, msg;
    			
    		switch ( Common.getPasswordLevel( this.value ) ) {
    		case 1:
    			cls = 'low';
    			lvl = '안전도 : <em style="font-style:normal;">낮음</em>';
    			msg = '예측하기 쉬운 비밀번호이니 다른 비밀번호로 변경을 권장합니다.';
    			break;
    		case 2:
    			cls = 'normal';
    			lvl = '안전도 : <em style="font-style:normal;">적정</em>';
    			msg = '적정하게 사용하실 수 있는 비밀번호입니다.';
    			break;
    		case 3:
    			cls = 'high';
    			lvl = '안전도 : <em style="font-style:normal;">높음</em>';
    			msg = '예측하기 힘든 비밀번호입니다.';
    			break;
			default:
				cls = 'bad';
    			lvl = '안전도 : <em style="font-style:normal;">사용불가</em>';
    			msg = ''; //비밀번호는 영문 숫자 혼합 10자 이상으로 입력해 주시기 바랍니다.';
				break;
    		}
    		
    		$valid[ this.value ? 'show' : 'hide' ]();
    		$message[ this.value ? 'show' : 'hide' ]();
    		
    		$valid.removeClass( 'bad low normal high' ).addClass( cls );
    		$valid.html( lvl );
    		$message.html( msg );
    	}).keyup();
    },
    
    /**
     * <pre>
     * 입력 글자 수 제한
     * </pre>
     * @param {jQuery} $input
     * @param {jQuery} $label
     * @param {Number} maxlength 최대 글자 수
     */
    limitMaxLength: function( $input, $label, maxlength ) {
    	if ( typeof $label === 'number' ) {
    		maxlength = $label;
    		$label = undefined;
    	}
    	
    	function fn() {
    		if ( this.value.length > maxlength ) {
    			this.value = this.value.substr( 0, maxlength );
    			alert( '최대 ' + maxlength + '자 입력이 가능합니다.' );
    		}
    		
    		if ( $label ) {
    			$label.text( this.value.length );
    		}
    	};
    	
    	$input.unbind( '.maxlength' );
    	$input.die( '.maxlength' );
    	
    	$input.bind( 'keydown.maxlength', fn );
    	$input.bind( 'keyup.maxlength', fn );
    	$input.live( 'input paste.maxlength', fn );
    	
    	$input.trigger( 'keydown.maxlength' );
    },
    
    /**
     * <pre>
     * 팝업 열기
     * </pre>
     * 
     * @param url
     * @param options
     */
    openPopup: function( url, options ) {
    	var opts = $.extend({ target: '_blank', width: 500, height: 500, scrollbars: 'no' }, options),
		    param = '',
		    name = '';
    	
    	for ( name in opts ) {
    		if ( name !== 'target' ) {
    			param += ',' + name + '=' + opts[ name ];
    		}
    	}
    	
    	param = param.replace( /^,/, '' );
    	
    	window.open( url, opts.target, param );
    },
    
    /**
     * <pre>
     * 레이어 로드
     * </pre>
     * 
     * @function
     * @param {String} url 주소
     */
    loadLayer: function( url, options ) {
    	var $block = $('.blockPage');
    	
    	if ( $block[ 0 ] ) {
	    	$.ajax($.extend({
				url: url,
				type: 'POST',
				dataType: 'html',
				success: function( html ) {
					$block.html( html );
				}
			}, options));
    	}
    },
    
    /**
     * <pre>
     * 레이어 열기
     * </pre>
     * 
     * @function
     * @param {String} url 주소
     */
    showLayer: function( url ) {
    	var isApp = url.indexOf('/app') > -1;
    	
    	$.ajax({
    		url: url,
    		dataType: 'html',
    		success: function( html ) {
    			var $document = $( document ),
    				$block = null,
    				$layer = null;
    			
    			$.blockUI.customOnBlock = null;
    			
    			if ( isApp ) {
    				$( 'body' ).block({ message: html, css: { width: '100%' } });
    				$block = $( 'body > .blockElement' );
    				$layer = $block.children();
    			} else {
    				$.blockUI({ message: html });
    				$block = $( 'body > .blockPage' );
    				$layer = $block.children();
    				
    			}
    			
    			if ( isApp ) {
    				$block.css({ top: 0 });
    			} else {
    				//$layer.position({ at: 'center', of: window });
    				$layer.draggable({ handle: 'h1' });
    			}
    			
    			$document.off( '.layer' );
    			
    			$document.on( 'click.layer', '.blockPage .close, .blockElement .btn-close', function( event ) {
    				event.preventDefault();
					event.stopPropagation();
    				Common.hideLayer();
    			});
    			
    			$document.on( 'keydown.layer', function( event ) {
    				if ( event.keyCode === 27 ) {
    					event.preventDefault();
    					event.stopPropagation();
    					Common.hideLayer();
    				}
    			});
    		}
    	});
    },
    
    /**
     * <pre>
     * 레이어 닫기
     * </pre>
     * 
     * @function
     */
    hideLayer: function() {
    	$.unblockUI();
    	$( document ).off( '.layer' );
    },
    
    /**
     * <pre>
     * 로그인 레이어 열기
     * </pre>
     * 
     * @function
     */
    showLoginLayer: function() {
    	Common.hideLayer();
    	Common.showLayer( '/web/user/login.do' );
    },
    
    /**
     * <pre>
     * 시퀀스 엘리먼트 생성
     * </pre>
     * @function
     * @param {jQuery} $container 컨테이너
     * @param {String} format 포멧
     * @param {Number} length 개수
     */
    createSequenceElement: function( $container, format, length ) {
    	var t = '<img src="' + format + '" alt="" style="display:none;" />',
    		h = [],
    		i;
    	
    	for ( i = 1; i <= length; i += 1 ) {
    		h.push(t.replace( /#+/, function( $0 ) { return Common.lpad( i, $0.length ); }));
    	}
    	
    	$container.html( h.join( '' ) );
    	$container.children( ':first' ).show();
    },
    
    /**
     * <pre>
     * 시퀀스 엘리먼트 시작
     * </pre>
     * @function
     * @param {jQuery} $container 컨테이너
     */
    startSequenceElement: function( $container, options ) {
    	var timer = $container.data( 'seq_timer' ),
    		opts = $.extend( { fps: 30, loop: true, first: false, complete: null }, options );
    	
    	if ( ! timer ) {
    		var $els = $container.children(),
    			length = $els.length,
    			index = opts.first ? 0 : $els.filter( ':visible:first' ).index();
    		
    		$els.eq( index ).siblings().hide();
    		
    		timer = setInterval(function() {
    			$els.eq( index ).hide();
    			$els.eq( index = ++index % length ).show();
    			
    			if ( ! opts.loop && index === length - 1 ) {
    				Common.stopSequenceElement( $container );
    				if ( opts.complete ) opts.complete.apply( $container[ 0 ] );
    			}
    		}, Math.floor( 1000 / opts.fps ));
    		
    		$container.data( 'seq_timer', timer );
    	}
    },
    
    /**
     * <pre>
     * 시퀀스 엘리먼트 정지
     * </pre>
     * @function
     * @param {jQuery} $container 컨테이너
     */
    stopSequenceElement: function( $container ) {
    	var timer = $container.data( 'seq_timer' );
    	
    	if ( timer ) {
			clearInterval( timer );
			$container.data( 'seq_timer', null );
		}
    },
	
	/**
	 * 로고 애니메이션 실행
	 * @function
	 */
	animateLogo: function() {
		var $a = $( '#d_logo_a' ).stop( true ).css({ opacity: 1 }),
			$b = $( '#d_logo_b' ).stop( true ).css({ opacity: 1 }),
			op = {
				loop: false,
				first: true,
				complete: function() {
					$( this ).animate({ opacity: 0 }).animate({ opacity: 1 });
				}
			};
		
		Common.stopSequenceElement( $a );
		Common.stopSequenceElement( $b );
		Common.startSequenceElement( $a, op );
		Common.startSequenceElement( $b, op );
	},
	
	/**
	 * SNS 공유
	 * 
	 * @param {String} type 유형
	 */
	shareSns: function( type ) {
		var url = [],
			opt = '';
		
		switch (type) {
		case 'facebook':
			url = [
			    'https://www.facebook.com/sharer/sharer.php',
			    '?t=', encodeURIComponent( 'LTE 무한능력, 눝' ),
			    '&u=', encodeURIComponent( 'http://lte.skt-lte.co.kr' )
			];
			opt = 'width=1000,height=650';
			break;
		case 'twitter':
			url = [
			   'https://twitter.com/intent/tweet',
			   '?text=', encodeURIComponent( 'LTE 무한능력, 눝' ),
			   '&url=', encodeURIComponent( 'http://lte.skt-lte.co.kr' )
			];
			opt = 'width=600,height=380';
			break;
		}
		
		window.open( url.join( '' ), 'winSnsShare', opt );
	}
};

// jQuery AJAX 기본 설정
(function() {
	var requests = {},
		$loader = $( '<div class="ajax_loader"><img src="/images/pre/ajax_loader.gif" alt="ajax_loader" /></div>' );
	
	$.ajaxSetup({
		cache: false
	});
	
	$( document ).ajaxStart(function() {
		var $layer = $( '.lay_contents' );
		
		if ( $layer[ 0 ] ) {
			$loader.css({ position: 'absolute' }).appendTo( $layer );
		} else {
			$loader.css({ position: 'fixed' }).appendTo( 'body' );
		}
	});
	
	$( document ).ajaxStop(function() {
		$loader.remove();
	});
	
	$( document ).ajaxSend(function( event, jqXHR, ajaxOptions ) {
		var url = ajaxOptions.url;
		
		if ( requests[ url ] ) {
			requests[ url ]++;
			jqXHR.abort();
			return false;
		} else {
			requests[ url ] = 1;
		}
	});
	
	$( document ).ajaxComplete(function( event, xhr, ajaxOptions ) {
		var url = ajaxOptions.url;
		
		if ( requests[ url ] ) {
			requests[ url ]--;
		}
		
		if ( requests[ url ] === 0 ) {
			delete requests[ url ];
		}
	});
	
	$( document ).ajaxStop(function( event, xhr, ajaxOptions ) {
		requests = {};
	});
})();

// jQuery Cookie 기본 설정
if ( $ && $.cookie ) {
	$.cookie.defaults.expires = 7;
	$.cookie.defaults.path = '/';
}

// jQuery Validator 기본 설정
if ( $ && $.validator ) {
	$.validator.setDefaults({ 
		ignore: null,
	    onfocusout: false,
	    onkeyup: false,
	    onclick: false,
	    focusInvalid: false,
	    showErrors: function(errorMap, errorList) {
	        if (this.numberOfInvalids() && errorList.length) {
	            alert(errorList[0].message);
	            errorList[0].element.focus();
	        }
	    }
	});
	
	$.extend($.fn, {
		validateDelegate: function(delegate, type, handler) {
			if (window.IS_MOBILE && type === 'click') {
				type = 'touchstart';
			}
			
			return this.bind(type, function(event) {
				var target = $(event.target);
				if (target.is(delegate)) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
	
	$.validator.addMethod( 'isPattern', function( value, element, param ) {
		return this.optional( element ) || new RegExp( param ).test( value );
	});
	
	$.validator.addMethod( 'isEqual', function( value, element, param ) {
		return value === param;
	});
	
	$.validator.addMethod( 'isNotEqual', function( value, element, param ) {
		return value !== param;
	});
	
	$.validator.addMethod( 'isEmailUser', function( value, element ) {
		return $.validator.methods.email.call( this, value + '@dummy.com', element );
	});
	
	$.validator.addMethod( 'isEmailDomain', function( value, element ) {
		return $.validator.methods.email.call( this, 'dummy@' + value, element );
	});
	
	$.validator.addMethod( 'kor_eng', function( value, element ) {
		return this.optional(element) || /^[가-힣a-zA-Z]+$/.test(value);
	});
}

//jQuery BlockUI 기본 설정
if ( $ && $.blockUI ) {
	$.blockUI.defaults.css.top = '10%';
	$.blockUI.defaults.css.textAlign = 'left';
	$.blockUI.defaults.css.border = 0;
	$.blockUI.defaults.css.cursor = 'default';
	$.blockUI.defaults.overlayCSS.cursor = 'default';
	$.blockUI.defaults.onBlock = function() {
		if ($.blockUI.customOnBlock) {
			$.blockUI.customOnBlock();
		}
	};
}

// 메인 이동 함수
function goMain(gubun){
	location.href = "/index.jsp";
}

// 웹뷰용 alert 재정의
if ( window.sktlte ) {
	window.alert = function( msg ) {
		window.sktlte.alert( msg );
	};
}

// ======================================== //
// 페이지 로드								//
// ======================================== //
$(function() {
	// 익명 로그인
	$( 'button.anon, a.anon' ).click(function( event ) {
		event.preventDefault();
		Common.showLayer( '/web/user/login.do' );
	});
	
	// 로고 애니메이션
	Common.createSequenceElement( $('#d_logo_a'), '/images/pre/swf/bg_logo_a##.png', 31 );
	Common.createSequenceElement( $('#d_logo_b'), '/images/pre/swf/bg_logo_b##.png', 31 );
	Common.animateLogo();
});
