/**
 * @module Browser
 *
 * 操作浏览器
 */

(function (name, definition) {
	if (typeof define == 'function') {
		define(definition);
	} else if (typeof module != 'undefined' && module.exports) {
		module.exports = definition;
	} else {
		window[name] = definition;
	}
})('Browser', function () {
	var Browser = {
		/**
		 * 判断浏览器是否支持某个事件
		 * @param {object String} eventName 事件名
		 * @return {object Boolean}
		 */
		//可以通过in来检测一个事件是否存在于一个元素,ff不支持
		//将一个事件属性设置给要检测的元素.如果元素可以识别这个事件,
		//那么这个事件会有一个事件句柄
		//http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
		eventSupported : function (eventName) {
			var el = document.createElement("div");
			eventName = "on" + eventName;

			var isSupported = (eventName in el);
			if (!isSupported) {
				el.setAttribute(eventName, "return;");
				isSupported = typeof el[eventName] === "function";
			}
			el = null;

			return isSupported;
		};

	};
	/**
	 * 添加收藏夹
	 * @param {object String} title
	 * @param {object String} url
	 * @return {object Boolean}
	 */
	Browser.addFavorite = function (title, url) {
		title = title || document.title;
		url = url || location.href;
		if (window.sidebar) {
			window.sidebar.addPanel(title, url, '');
		} else if (window.external) {
			window.external.addFavorite(url, title);
		} else {
			return false;
		}
		return true;
	}
	/**
	 * 设为主页
	 * @param {String} url
	 * @return {Boolean}
	 */
	Browser.setHomepage = function (url) {
		url = url || location.href;

		if (document.body && document.body.setHomePage) {
			document.body.style.behavior = "url(#default#homepage)";
			document.body.setHomePage(url);
			return true;
		}

		return false;
	}
	/**
	 *获取访问来源
	 * @return {object String}
	 */
	Browser.ref = function () {
		return document.referrer;
	}
	/**
	 *判断页面是否最小化
	 * @return {object Boolean}
	 * thanks to franky
	 */
	Browser.isPageMinimized = function () { //判断窗口是否最小化.
		/*

		借助 HTML5 Visibility API 判断有一个致命缺陷就是, 非前景的Tab 标签 也会被认为是不可见的.所以并不能严谨的判断是否是最小化.
		//document.hidden || document.visibilityStats == 'hidden' (HTML5 Visibility API)Firefox10+, IE10+, Chrome14+
		var list = ['mozHidden', 'msHidden', 'webkitHidden', 'oHidden'];
		for (var i = list.length ; i-- ; ){
		if(typeof document[list[i]] === 'boolean'){
		return document[list[i]];
		}
		}

		 */

		if (typeof window.screenTop === 'number') { //Opera, Safari, Chrome,IE9
			return window.screenTop < -30000; //不考虑Safari的话,其实 <0 即可判断.
		}

		/*
		此段,针对非Mac 以及 Linux下的 Firefox, 其实就是针对windows平台的FF . 其他平台outerWidth 似乎总是无变化.
		最小化后 其实outerWidth 始终是160, outerHeight始终是27 .
		虽然用鼠标拖拽方式把FF变的极限小窗状态时outerWidth 能拿到比160抵的数,但outerHeight却无法拿到比27更小的值.
		所以该方式,windows平台 可信任.
		 */
		return window.outerWidth <= 160 && window.outerHeight <= 27;

	};
	var sUserAgent = navigator.userAgent;
	/**
	 * 查询ua字符串
	 * @param {String} 字符串
	 * @return {Boolean} 
	 * @private
	 */
	function find(feature) {
		if (sUserAgent.indexOf(feature) !== -1) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * 检测操作系统
	 * @return {String} 操作系统
	 */

	Browser.detectOS = function () {

		//iphone ipod ipad android
		var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
		var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
		if (isMac)
			return "Mac";
		var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
		if (isUnix)
			return "Unix";
		var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
		if (isLinux)
			return "Linux";
		if (isWin) {
			var isWin2K = find("Windows NT 5.0") || find("Windows 2000");
			if (isWin2K)
				return "Win2000";
			var isWinXP = find("Windows NT 5.1") || find("Windows XP");
			if (isWinXP)
				return "WinXP";
			var isWin2003 = find("Windows NT 5.2") || find("Windows 2003");
			if (isWin2003)
				return "Win2003";
			var isWinVista = find("Windows NT 6.0") || find("Windows Vista");
			if (isWinVista)
				return "WinVista";
			var isWin7 = find("Windows NT 6.1") || find("Windows 7");
			if (isWin7)
				return "Win7";
		}
		return "other";
	}
	/**
	 * 检测设备方向
	 * @return {String} 方向
	 */
	Browser.direction = function () {
		if (Math.abs(window.orientation === 90)) {
			return 'landscape';
		} else {
			return 'portrait';
		}
	}
	/**
	 * 检测设备类型
	 * @return {Object} 提供了一系列检测设备的方法
	 * Browser.detectDevice.isios 检测ios设备
	 * Browser.detectDevice.isiphone 检测iphone
	 * Browser.detectDevice.isipod 检测ipod
	 * Browser.detectDevice.isipad 检测ipad
	 * Browser.detectDevice.isandroid 检测安卓
	 * Browser.detectDevice.isandroidPhone 检测安卓移动设备
	 * Browser.detectDevice.isandroidTablet 检测安卓平板
	 * Browser.detectDevice.isblackberry 检测黑莓
	 * Browser.detectDevice.isblackberryPhone 检测黑莓移动设备
	 * Browser.detectDevice.isblackberryPhone 检测黑莓平板
	 * Browser.detectDevice.iswindows 检测windows设备
	 * Browser.detectDevice.iswindowsPhone 检测windows移动设备
	 * Browser.detectDevice.iswindowsTablet 检测windows平板
	 * Browser.detectDevice.ismobile 检测移动设备
	 * Browser.detectDevice.istablet 检测平板
	 * https://github.com/matthewhudson/device.js/blob/master/lib/device.js
	 */
	Browser.detectDevice = function () {
		var support = {
			isios : function () {
				return support.isiphone() || support.isipod() || support.isipad();
			},
			isiphone : function () {
				return find('iphone');
			},
			isipod = function () {
				return find('ipod');
			},
			isipad = function () {
				return find('ipad');
			},
			isandroid = function () {
				return find('android');
			},
			isandroidPhone = function () {
				return support.isandroid() && find('mobile');
			},
			isandroidTablet = function () {
				return support.android() && !find('mobile');
			},
			isblackberry = function () {
				return find('blackberry' || find('bb10' || find('rim')));
			},
			isblackberryPhone = function () {
				return support.blackberry() && !find('tablet');
			},
			isblackberryTablet = function () {
				return support.blackberry() && find('tablet');
			},
			iswindows = function () {
				return find('windows');
			},
			iswindowsPhone = function () {
				return support.windows() && find('phone');
			},
			iswindowsTablet = function () {
				return support.windows() && find('touch');
			},
			ismobile = function () {
				return support.androidPhone() || support.iphone() || support.ipod() || support.windowsPhone() || support.blackberryPhone();
			},
			istablet = function () {
				return support.ipad() || support.androidTablet() || support.blackberryTablet() || support.windowsTablet();
			},
		}
		return support
	}
	/**
	 * 检测浏览器
	 * @return {Object} 浏览器嗅探结果
	 * obj.chrome Chrome版本号
	 * obj.firefox firefox版本号
	 * obj.ie ie版本号
	 * obj.isGecko 判断是否是gecko(mozilla家的)
	 * obj.isStrict 判断是否为严格模式 http://www.cnblogs.com/fullhouse/archive/2012/01/17/2324706.html
	 * obj.isWebkit 判断是否是webkit浏览器
	 * obj.opera opera版本号
	 * obj.maxthon 傲游浏览器版本号
	 * obj.safari safari浏览器版本号
	 * obj.isSupportFixed 判断是否支持position.fixed 
	 */
	Browser.browser = function(ua){
	var res = {
            chrome : /chrome\/(\d+\.\d+)/i.test(ua) ? + RegExp.$1 : undefined,
            firefox : /firefox\/(\d+\.\d+)/i.test(ua) ? + RegExp.$1 : undefined,
            ie : /msie (\d+\.\d+)/i.test(ua) ? (document.documentMode || + RegExp.$1) : undefined,
            isGecko : /gecko/i.test(ua) && !/like gecko/i.test(ua),
            isStrict : document.compatMode === "CSS1Compat",
            isWebkit : /webkit/i.test(ua),
            opera : /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(ua) ?  + (RegExp.$6 || RegExp.$2) : undefined
        };
        try {
            if (/(\d+\.\d+)/.test(window.external.max_version)) {
                res.maxthon = + RegExp.$1;//遨游
            }
        } catch (e) {}
        res.safari = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? + (RegExp.$1 || RegExp.$2) : undefined;
        res.isSupportFixed = !res.ie || res.ie >= 7;
        return res;
	}
	
	
	
	
	
	//https://github.com/acelan86/sinaads/blob/master/src/sinaadToolkit.js
	//http://www.baidufe.com/item/af0bb5872f2a1ef337ce.html
	//http://www.cnblogs.com/_franky/archive/2010/10/25/1860649.html
	Browser.cookie = {
        /**
         * @private
         * @param  {String} key 要验证的cookie的key
         * @return {Boolean}    是否为符合规则的key
         */
        // http://www.w3.org/Protocols/rfc2109/rfc2109
        // Syntax:  General
        // The two state management headers, Set-Cookie and Cookie, have common
        // syntactic properties involving attribute-value pairs.  The following
        // grammar uses the notation, and tokens DIGIT (decimal digits) and
        // token (informally, a sequence of non-special, non-white space
        // characters) from the HTTP/1.1 specification [RFC 2068] to describe
        // their syntax.
        // av-pairs   = av-pair *(";" av-pair)
        // av-pair    = attr ["=" value] ; optional value
        // attr       = token
        // value      = word
        // word       = token | quoted-string
         
        // http://www.ietf.org/rfc/rfc2068.txt
        // token      = 1*<any CHAR except CTLs or tspecials>
        // CHAR       = <any US-ASCII character (octets 0 - 127)>
        // CTL        = <any US-ASCII control character
        //              (octets 0 - 31) and DEL (127)>
        // tspecials  = "(" | ")" | "<" | ">" | "@"
        //              | "," | ";" | ":" | "\" | <">
        //              | "/" | "[" | "]" | "?" | "="
        //              | "{" | "}" | SP | HT
        // SP         = <US-ASCII SP, space (32)>
        // HT         = <US-ASCII HT, horizontal-tab (9)>
        _isValidKey : function (key) {
            return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
        },
        /**
         * 从cookie中获取key所对应的值
         * @private
         * @param  {String} key 要获取的cookie的key
         * @return {String}     cookie对应该key的值
         */
        _getRaw : function (key) {
            if (Browser.cookie._isValidKey(key)) {
                var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
                    result = reg.exec(document.cookie);
                     
                if (result) {
                    return result[2] || null;
                }
            }
            return null;
        },
        /**
         * 将cookie中key的值设置为value, 并带入一些参数
         * @private
         * @param  {String} key 要设置的cookie的key
         * @param  {String} value 要设置的值
         * @param  {Object} options 选项
         */
        _setRaw : function (key, value, options) {
            if (!Browser.cookie._isValidKey(key)) {
                return;
            }
             
            options = options || {};

            // 计算cookie过期时间
            var expires = options.expires;
            if ('number' === typeof options.expires) {
                expires = new Date();
                expires.setTime(expires.getTime() + options.expires);
            }
             
            document.cookie =
                key + "=" + value +
                (options.path ? "; path=" + options.path : "") +
                (expires ? "; expires=" + expires.toGMTString() : "") +
                (options.domain ? "; domain=" + options.domain : "") +
                (options.secure ? "; secure" : '');

        },
        /**
         * 获取cookie中key的值
         * @param  {String} key 要获取的key
         * @return {String}     cookie值
         */
        get : function (key) {
            var value = Browser.cookie._getRaw(key);
            if ('string' === typeof value) {
                value = decodeURIComponent(value);
                return value;
            }
            return null;
        },
        /**
         * 设置cookie值
         * @param  {String} key     要设置的key
         * @param  {String} value   要设置的value   
         * @param  {object} options 选项
         */
        set : function (key, value, options) {
            Browser.cookie._setRaw(key, encodeURIComponent(value), options);
        },
        /**
         * 移除key相关的cookie
         * @param  {String} key     要移除的cookie的key
         * @param  {Object} options 选项
         */
        remove : function (key, options) {
            options = options || {};
            options.expires = new Date(0);
            Browser.cookie._setRaw(key, '', options);
        }
    };
	
	
	
	Browser.store = function () {
		
		var storeType;
		if (window.localStorage) {
			//带有过期时间的本地存储方案,localStorage 的本质是同步,使用时要遵循以下最佳实践
			//1. 使用 localStorage 的 getItem() 而不是直接通过 key 来读取数据的效率会更好。
			//2. 频繁调用 localStorage 的 API 会影响性能。
			//3. 数据的大小不会对 API 调用产生影响，因此应该尽量向一个条目中存储多的内容。
			storeType = {
				getItem : function (key) {
					return window.localStorage.getItem(key);
				},
				setItem : function (key, value, expires) {
					window.localStorage.setItem(key, value + (expires ? ';expires=' + (+new Date() + expires) : ''));
				},
				removeItem : function (key) {
					window.localStorage.removeItem(key);
				}
			}

		} else if (Browser.browser.ie && Browser.browser.ie < 8) {

			storeType = {
				node : null, //以dom节点来存储数据
				name : location.hostname,

				init : function () {
					var node = UserData.userData;
					if (!node) {
						try {
							node = document.createElement('INPUT');
							node.type = "hidden";
							node.style.display = "none";
							node.addBehavior("#default#userData");
							document.body.appendChild(node);
							var expires = new Date();
							expires.setDate(expires.getDate() + 365);
							node.expires = expires.toUTCString();
						} catch (e) {
							return false;
						}
					}
					return node; //返回这个存储节点
				},

				setItem : function (key, value, expires) {
					var node = UserData.init();
					if (node) {
						node.load(UserData.name);
						node.setAttribute(key, value + (expires ? ';expires=' + (+new Date() + expires) : '')); //存储过期时间
						node.save(UserData.name);
					}
				},

				getItem : function (key) {
					var node = UserData.init();
					if (node) {
						node.load(UserData.name);
						return node.getAttribute(key)
					}
				},

				removeItem : function (key) {
					var node = UserData.init();

					if (node) {
						node.load(UserData.name);
						node.removeAttribute(key);
						node.save(UserData.name);
					}

				}
			}

		} else {
			storeType = {

				getItem : function (key) {
					return Browser.cookie.get(key);
				},
				setItem : function (key, value, expires) {
					Browser.cookie.set(key, value, {
						expires : expires || 0
					});
				},
				removeItem : function (key) {
					Browser.cookie.remove(key);
				}

			}

		}
		
		return {
			/**
			 * 获取本地存储的key的值
			 * @param  {String} key key
			 * @return {String}     取得的值
			 */
			get : function (key) {
				try {
					var value = storeType.getItem(key);
					if (value) {
						value = value.split(';');
						if (value[1] && (+ new Date()) > parseInt(value[1].split('=')[1])) {//若存在过期时间
							storeType.removeItem(key);
							return null;
						} else {
							return value[0];
						}
					}
					return null;
				} catch (e) {
					console.log(e)
					return null;
				}
			},
			/**
			 * 设置本地存储key的值为value
			 * 注意：请不要设置非字符串格式形式的值到本地存储
			 * @param  {String} key     设置的key
			 * @param  {String} value   设置的value
			 * @param  {Number} expires 过期时间毫秒数
			 */
			set : function (key, value, expires) {
				try {
					storeType.setItem(key, value, expires);
				} catch (e) {
					console.log(e)
				}
			},
			/**
			 * 移除本地存储中key的值
			 * @param  {String} key 要移除的key
			 */
			remove : function (key) {
				try {
					storeType.removeItem(key);
				} catch (e) {
					console.log(e)
				}
			}

		}
	}
	/**
	* 获取浏览器的flash版本
	* @return {String}     flash版本 eg:"11.8.800.0"
	*/
	Browser.swfVersion = function () {
		var n = navigator;
		if (n.plugins && n.mimeTypes.length) {
			var plugin = n.plugins["Shockwave Flash"];
			if (plugin && plugin.description) {
				return plugin.description
				.replace(/([a-zA-Z]|\s)+/, "")
				.replace(/(\s)+r/, ".") + ".0";
			}
		} else if (window.ActiveXObject && !window.opera) {
			for (var i = 12; i >= 2; i--) {
				try {
					var c = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + i);
					if (c) {
						var version = c.GetVariable("$version");
						return version.replace(/WIN/g, '').replace(/,/g, '.');
					}
				} catch (e) {}
			}
		}
	}

	
	
	
	return Browser
}
	())