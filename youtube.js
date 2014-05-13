/*!
 * YouTube Player
 * 
 * @author 김왕기
 * @version 1.0(2013-04-06) 최초 생성
 */
(function( $ ) {
	"use strict";
	
	// ======================================== //
	// 익명함수내 전역 변수						//
	// ======================================== //
	var IDENTIFIER = 'ytplayer',
		STATE_UNSTARTED = -1,
		STATE_ENDED = 0,
		STATE_PLAYING = 1,
		STATE_PAUSED = 2,
		STATE_BUFFERING = 3,
		STATE_CUED = 5;
	
	// ======================================== //
	// 유틸 메서드								//
	// ======================================== //
	/**
	 * <pre>
	 * 아이디 생성
	 * </pre>
	 * @private
	 * @function
	 * @returns
	 */
	function genId() {
		var num = 0;
		
		genId = function() {
			return IDENTIFIER + num++;
		};
		
		return genId();
	};
	
	/**
	 * <pre>
	 * 속성복사 함수
	 * </pre>
	 * @private
	 * @function 
	 * @param src {JSON}
	 * @param dest {JSON}
	 */
	function extend () {
        var args = [].slice.call( arguments ),
            src = args.shift(),
            over = args[ args.length - 1 ] === false ? args.pop() : true,
    		hasProp = Object.prototype.hasOwnProperty,
            obj;
        
        while ( obj = args.shift() ) {
            for( var name in obj ){
            	if ( ! hasProp.call( obj, name ) || ( !over && ( name in src ) ) ) { continue; }
                	src[ name ] = obj[ name ];
            }
        }
        
        return src;
	}
	
	/**
	 * <pre>
	 * 엘리먼트 생성
	 * </pre>
	 * @private
	 * @function
	 * @param {String} html HTML
	 * @returns {Element} 엘리먼트
	 */
	function createElement( html ) {
		var dummy = document.createElement( 'div' );
		dummy.innerHTML = html;
		return dummy.firstChild;
	}
	
	// ======================================== //
	// 플러그인 기본 설정							//
	// ======================================== //
	window[ IDENTIFIER ] = {
		defaults: {
			width: 640,
			height: 360,
			autoHide: 2000,
			quality: 'hd720', // [small|medium|large|hd720|hd1080|highres|default]
			playlist: [],
			playerParams: {
				allowScriptAccess: 'always',
				wmode: 'transparent'
			},
			onPlayerReady: null,
			onStateChange: null,
			onPlaybackQualityChange: null,
			onPlaybackRateChange: null,
			onError: null,
			onApiChange: null,
			onShowUI: null,
			onHideUI: null
		}
	};
	
	// ======================================== //
	// 모듈 생성자								//
	// ======================================== //
	/**
	 * <pre>
	 * YouTube Player
	 * </pre>
	 * @class
	 * @param {String} element 엘리먼트 또는 아이디
	 * @param {JSON} [options] 옵션 객체
	 */
	function YouTube( element, options ) {
		var that = this;
		
		// 멤버
		this.uuid = genId();
		this.options = extend( {}, window[ IDENTIFIER ].defaults, options );
		this.element = document.getElementById( element ) || element;
		this.ui = {};
		this.player = null;
		this.state = STATE_UNSTARTED;
		this.videos = [];
		this.autoTimer = null;
		this.isShowUI = true;
		
		// 비디오 배열
		if ( this.options.playlist ) {
			for ( var i = 0, p; p = this.options.playlist[ i ]; i += 1 ) {
				this.videos.push( p.videoId );
			}
		}
		
		// YouTube API 콜백
		if ( ! window.onYouTubePlayerReady ) {
			window.onYouTubePlayerReady = function( id ) {
				if ( window[ IDENTIFIER ][ id ] ) {
					window[ IDENTIFIER ][ id ].onYouTubePlayerReady();
				}
			};
		}
		
		// YouTube API 이벤트 등록
		window[ IDENTIFIER ][ this.uuid ] = {
			onYouTubePlayerReady: function() {
				that.player = document.getElementById( that.uuid );
				
				window[ IDENTIFIER ][ that.uuid ].onStateChange = function(){ that._onStateChange.apply( that, arguments ); };
				window[ IDENTIFIER ][ that.uuid ].onPlaybackQualityChange = function(){ that._onPlaybackQualityChange.apply( that, arguments ); };
				window[ IDENTIFIER ][ that.uuid ].onPlaybackRateChange = function(){ that._onPlaybackRateChange.apply( that, arguments ); };
				window[ IDENTIFIER ][ that.uuid ].onError = function(){ that._onError.apply( that, arguments ); };
				window[ IDENTIFIER ][ that.uuid ].onApiChange = function(){ that._onApiChange.apply( that, arguments ); };
				
				that.player.addEventListener('onStateChange', IDENTIFIER + '.' + that.uuid + '.onStateChange');
				that.player.addEventListener('onPlaybackQualityChange', IDENTIFIER + '.' + that.uuid + '.onPlaybackQualityChange');
				that.player.addEventListener('onPlaybackRateChange', IDENTIFIER + '.' + that.uuid + '.onPlaybackRateChange');
				that.player.addEventListener('onError', IDENTIFIER + '.' + that.uuid + '.onError');
				that.player.addEventListener('onApiChange', IDENTIFIER + '.' + that.uuid + '.onApiChange');
				
				that._onPlayerReady.apply( that );
			}
		};
		
		// 실행
		this._createUI();
		this._bindEvent();
	};
	
	// ======================================== //
	// 모듈 메서드								//
	// ======================================== //
	extend(YouTube.prototype, {
		/**
		 * <pre>
		 * UI 생성
		 * </pre>
		 * @private
		 * @function
		 */
		_createUI: function() {
			var uuid = this.uuid,
				opts = this.options,
				el = this.element,
				ui = this.ui;
			
			$( el ).addClass( 'ytplayer' );
			ui.object = createElement( '<div class="ytplayer-object"><div id="tmp-' + uuid + '"></div></div>' );
			ui.overlay = createElement( '<div class="ytplayer-overlay"></div>' );
			ui.loader = createElement( '<div class="ytplayer-loader"></div>' );
			ui.poster = createElement( '<div class="ytplayer-poster"><img src="/images/pre/sample_img_main.jpg" alt="" /></div>' );
			ui.playbutton = createElement( '<div class="ytplayer-button play"></div>' );
			
			el.innerHTML = '';
			el.appendChild( ui.object );
			el.appendChild( ui.overlay );
			ui.overlay.appendChild( ui.loader );
			ui.overlay.appendChild( ui.poster );
			ui.overlay.appendChild( ui.playbutton );
			
			swfobject.embedSWF( '//www.youtube.com/apiplayer?enablejsapi=1&playerapiid=' + uuid, 'tmp-' + uuid, opts.width, opts.height, '8', null, null, opts.playerParams, { id: uuid });
		},
		/**
		 * <pre>
		 * 이벤트 등록
		 * </pre>
		 * @private
		 * @function
		 */
		_bindEvent: function() {
			var that = this,
				uuid = this.uuid,
				opts = this.options,
				ui = this.ui,
				x = 0,
				y = 0;
			
			if ( opts.autoHide ) {
				$( this.element ).bind( 'mousemove.' + uuid, function( event ) {
					clearTimeout( that.autoTimer );
					
					if ( x !== event.clientX && y !== event.clientY ) {
						that.showUI();
					}
					
					x = event.clientX;
					y = event.clientY;
					
					if ( that.state === STATE_PLAYING ) {
						that.autoTimer = setTimeout(function() {
							that.hideUI();
						}, opts.autoHide);
					}
				});
			}
			
			$( ui.playbutton ).bind( 'click.' + uuid, function() {
				that.toggleVideo();
			});
		},
		/**
		 * <pre>
		 * 영상 토글
		 * </pre>
		 * @function
		 */
		toggleVideo: function() {
			if ( this.player ) {
				if ( this.state === STATE_PLAYING ) {
					this.player.pauseVideo();
				} else {
					if ( this.state === STATE_UNSTARTED ) {
						this.ui.loader.style.display = 'block';
					}
					this.player.playVideo();
				}
				
				this.ui.poster.style.display = 'none';
			}
		},
		/**
		 * <pre>
		 * UI 보임
		 * </pre>
		 * @function
		 * @param {Boolean) [force]
		 */
		showUI: function( force ) {
			var ui = this.ui;
			
			clearTimeout( this.autoTimer );
			
			if ( force || ! this.isShowUI ) {
				this.isShowUI = true;
				
				ui.overlay.style.cursor = '';
				ui.playbutton.style.display = 'block';
				
				if ( this.options.onShowUI ) {
					this.options.onShowUI.apply( this.element );
				}
			}
		},
		/**
		 * <pre>
		 * UI 숨김
		 * </pre>
		 * @function
		 * @param {Boolean} [force]
		 */
		hideUI: function( force ) {
			var ui = this.ui;
			
			clearTimeout( this.autoTimer );
			
			if ( force || this.isShowUI ) {
				this.isShowUI = false;
				
				ui.overlay.style.cursor = 'none';
				ui.playbutton.style.display = 'none';
				
				if ( this.options.onHideUI ) {
					this.options.onHideUI.apply( this.element );
				}
			}
		},
		/**
		 * <pre>
		 * UI 갱신
		 * </pre>
		 * @function
		 * @param {Number} [state] 플레이어 상태
		 */
		updateUI: function( state ) {
			var ui = this.ui,
				st = ( state !== undefined ? state : this.state );
			
			switch ( st ) {
			case STATE_UNSTARTED:
				ui.poster.style.display = 'block';
				break;
			case STATE_ENDED:
				ui.poster.style.display = 'block';
				this.showUI( true );
				break;
			case STATE_PLAYING:
				ui.poster.style.display = 'none';
				if ( this.options.autoHide ) {
					this.hideUI( true );
				}
				break;
			case STATE_PAUSED:
				break;
			case STATE_BUFFERING:
				ui.poster.style.display = 'none';
				break;
			case STATE_CUED:
				break;
			}
			
			// Loader
			if ( st === STATE_BUFFERING ) {
				ui.loader.style.display = 'block';
			} else {
				ui.loader.style.display = 'none';
			}
			
			// Play Button
			if ( st === STATE_PLAYING || st === STATE_BUFFERING ) {
				$( ui.playbutton ).removeClass( 'play' ).addClass( 'pause' );
			} else {
				$( ui.playbutton ).removeClass( 'pause' ).addClass( 'play' );
			}
		},
		/**
		 * <pre>
		 * YouTube 플레이어 반환 
		 * </pre>
		 * @function
		 * @returns {YouTubePlayer} 유튜브 플레이어
		 */
		getPlayer: function() {
			return this.player;
		}
	});
	
	// ======================================== //
	// 모듈 YouTube API 메서드					//
	// ======================================== //
	(function() {
		var api = [
			'cueVideoById', 'loadVideoById', 'cueVideoByUrl', 'loadVideoByUrl',			// Queueing functions for videos
			'cuePlaylist', 'loadPlaylist',												// Queueing functions for lists
			'playVideo', 'pauseVideo', 'stopVideo', 'seekTo', 'clearVideo',				// Playing a video
		    'nextVideo', 'previousVideo', 'playVideoAt',								// Playing a video in a playlist
		    'mute', 'unMute', 'isMuted', 'setVolume', 'getVolume',						// Changing the player volume
		    'getPlaybackRate', 'setPlaybackRate', 'getAvailablePlaybackRates',			// Setting the playback rate
		    'setLoop', 'setShuffle', 													// Setting playback behavior for playlists
		    'getVideoLoadedFraction', 'getPlayerState', 'getCurrentTime', 				// Playback status
		    'getVideoStartBytes', 'getVideoBytesLoaded', 'getVideoBytesTotal',			// Playback status
		    'getPlaybackQuality', 'setPlaybackQuality',	'getAvailableQualityLevels',	// Playback quality
		    'getDuration', 'getVideoUrl', 'getVideoEmbedCode',							// Retrieving video information
		    'getPlaylist', 'getPlaylistIndex'											// Retrieving playlist information
		];
		
		for ( var i = 0, e; e = api[ i ]; i += 1 ) {
			(function() {
				var fn = e;
				
				YouTube.prototype[ fn ] = function() {
					if ( this.player && this.player[ fn ] ) {
						return this.player[ fn ].apply( this.player, arguments );
					}
				};
			})();
		}
	})();
	
	// ======================================== //
	// 모듈 YouTube API 이벤트					//
	// ======================================== //
	extend(YouTube.prototype, {
		_onPlayerReady: function() {
			if ( this.videos.length ) {
				this.player.cuePlaylist( this.videos, 0, 0, this.options.quality );
			}
			
			if ( this.options.onPlayerReady ) {
				this.options.onPlayerReady.apply( this.element, arguments );
			}
		},
		_onStateChange: function() {
			this.state = arguments[ 0 ];
			this.updateUI();
			
			if ( this.options.onStateChange ) {
				this.options.onStateChange.apply( this.element, arguments );
			}
		},
		_onPlaybackQualityChange: function() {
			this.ui.loader.style.display = 'block';
			
			if ( this.options.onPlaybackQualityChange ) {
				this.options.onPlaybackQualityChange.apply( this.element, arguments );
			}
		},
		_onPlaybackRateChange: function() {
			this.ui.loader.style.display = 'block';
			
			if ( this.options.onPlaybackRateChange ) {
				this.options.onPlaybackRateChange.apply( this.element, arguments );
			}
		},
		_onError: function() {
			if ( this.options.onError ) {
				this.options.onError.apply( this.element, arguments );
			}
		},
		_onApiChange: function() {
			if ( this.options.onApiChange ) {
				this.options.onApiChange.apply( this.element, arguments );
			}
		}
	});
	
	// ======================================== //
	// jQuery 플러그인 등록						//
	// ======================================== //
	$.fn.youtube = function( method ) {
		var args = arguments,
			rslt = undefined;
		
		this.each(function() {
			var obj = $.data( this, IDENTIFIER );
			
			if ( obj ) {
				if ( obj[ method ] ) {
					rslt = obj[ method ].apply( obj, Array.prototype.slice.call( args, 1 ) );
				} else {
					$.error( 'Method ' +  method + ' does not exist on jQuery.youtube' );
				}
			} else {
				if ( typeof method === 'object' || ! method ) {
					$.data( this, IDENTIFIER, new YouTube( this, method ) );
				}
			}
		});
		
		return ( rslt !== undefined ) ? rslt : this;
	};
	
})( jQuery );
