/**
 * @module Util
 *
 * 基础工具库,提供重要的几个方法
 */

(function (name, definition) {
	if (typeof define == 'function') {
		define(definition);
	} else if (typeof module != 'undefined' && module.exports) {
		module.exports = definition;
	} else {
		window[name] = definition;
	}
})('Util', function () {
	var Util = {};
	var objProto = Object.prototype,
	hasOwn = objProto.hasOwnProperty;
	/**
	 * Returns internal [[Class]] property of an object
	 *
	 * Ecma-262, 15.2.4.2
	 * Object.prototype.toString( )
	 *
	 * When the toString method is called, the following steps are taken:
	 * 1. Get the [[Class]] property of this object.
	 * 2. Compute a string value by concatenating the three strings "[object ", Result (1), and "]".
	 * 3. Return Result (2).
	 *
	 * getType(5); // => "Number"
	 * getType({}); // => "Object"
	 * getType(/foo/); // => "RegExp"
	 * getType(''); // => "String"
	 * getType(true); // => "Boolean"
	 * getType([]); // => "Array"
	 * getType(undefined); // => "Window"
	 * getType(Element); // => "Constructor"
	 *
	 */
	Util.getType = function (object) {
		return objProto.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
	};
	/**
	 * 揉杂，合并对象
	 *
	 * @param {"[object Object]"} base 揉杂的接受者
	 * @param {"[object Object]"} supplier  提供者
	 * @param {"[object Boolean]"} bOverwrite 存在相同key时,若不覆盖原对象，取true. 默认为false,覆盖原对象
	 * @return {"[object Object]"} 揉杂结果
	 * @public
	mixin({a:111,b:222,c:333},{a:222})//{a: 222, b: 222, c: 333}
	mixin({a:111,b:222,c:333},{a:222},true)//{a: 111, b: 222, c: 333}
	 **/
	Util.mixin = function (base, supplier, bOverwrite) {
		var base = base || {},
		key,
		bOverwrite = bOverwrite || false;
		for (key in supplier) {
			if (supplier.hasOwnProperty(key)) { //不像 for in operator, hasownproperty 不追踪prototype chain
				if (typeof(base[key]) != 'undefined' && bOverwrite) {
					continue;
				}
				base[key] = supplier[key];
			}
		}
		return base;
	}
	/**
	 * 遍历器
	 *
	 * @param {"[object Object]"} O 被遍历对象
	 * @param {"[object Function]"} 回调函数
	 * @return {"[object Object]"}
	 * @public
	mixin({a:111,b:222,c:333},{a:222})//{a: 222, b: 222, c: 333}
	mixin({a:111,b:222,c:333},{a:222},true)//{a: 111, b: 222, c: 333}
	 **/

	Util.each = function (O, callbackfn) {

		var T,
		k = 0,
		kValue,
		len;

		if (O == null) {
			throw new TypeError('this is null or not defined');
		}

		O = Object(O);
		len = O.length >>> 0;

		if (Util.getType(callbackfn) != 'Function') {
			throw new TypeError(callbackfn + ' is not a function');
		}

		if (Util.getType(O) == 'Array') {
			while (k < len) {
				if (hasOwn.call(O, k)) {
					kValue = O[k];
					if (callbackfn.call(kValue, k + 1, kValue, O) === false)
						break;
				}
				k++;
			}
		} else {
			for (k in O) {
				if (hasOwn.call(O, k)) {
					kValue = O[k];
					if (callbackfn.call(kValue, kValue, k, O) === false)
						break;
				}
			}
		}
		return undefined;
	}

	/**
	 * 判定两个对象的值是否相同
	 * @param {Any} a
	 * @param {Any} b
	 * @return {Boolean}
	 * @public
	 */

	Util.isEqual = function (a, b) {
		if (a === b) {
			return true;
		} else if (a === null || b === null || typeof a === "undefined" || typeof b === "undefined" || $.type(a) !== $.type(b)) {
			return false;
		} else {
			switch ($.type(a)) {
			case "String":
			case "Boolean":
			case "Number":
			case "Null":
			case "Undefined":
				//处理简单类型的伪对象与字面值相比较的情况,如1 v new Number(1)
				if (b instanceof a.constructor || a instanceof b.constructor) {
					return a == b;
				}
				return a === b;
			case "NaN":
				return isNaN(b);
			case "Date":
				return +a === +b;
			case "NodeList":
			case "Arguments":
			case "Array":
				var len = a.length;
				if (len !== b.length)
					return false;
				for (var i = 0; i < len; i++) {
					if (!isEqual(a[i], b[i])) {
						return false;
					}
				}
				return true;
			default:
				for (var key in b) {
					if (!isEqual(a[key], b[key])) {
						return false;
					}
				}
				return true;
			}
		}
	}
	//from jquery
	Util.isWindow = function (win) {
		return (win && typeof win === "object" && "setInterval" in win);
	}
	Util.isEmpty =function (object) {
        if (Util.getType(object)=='Array') {
            return object.length == 0;
        } else {
            for (var k in object) {
                return false;
            }
            return true;
        }
    }
	/**
	 * 在指定的上下文中生成命名空间
	 * @param {String} 命名空间表达式
	 * @return {Object}
	 * @public
	 */
	//Util.namespace('C.E.F')
	//C.E.F.g = function a(){alert('b')}
	//C.E.F.g()
	Util.namespace = function(namespace,context) {
        var namespaceParts = namespace.split('.'),
            namespacePart,
            cur = context || this;
        for (var i = 0, n = namespaceParts.length; i < n; i++) {
            namespacePart = namespaceParts[i];
            cur = cur[namespacePart] = cur[namespacePart] || {};
        }
        return cur;
    };
	
	
	var tplCache = {};
	
	Util.render = function(tpl,data){
	var exec;
	if(!!!tplCache[tpl]){
	
	  exec = "var s='';s+=\'" +//开始拼接字符串
            tpl.replace(/[\r\t\n]/g, " ")//去掉换行，tab
            .split("'").join("\\'") //出现属性时,转义包裹属性的引号,因为之后进行函数拼接时引号会出错
            .replace(/\{\{#([\w]*)\}\}(.*)\{\{\/(\1)\}\}/ig, function (match, $1, $2) {
                return "\';var i=0,l=data." + $1 + ".length,d=data." + $1 + ";for(;i<l;i++){s+=\'" + $2.replace(/\{\{(\.|this)\}\}/g, "'+d[i]+'").replace(/\{\{([\w]*)\}\}/g, "'+d[i].$1+'") + "\'}s+=\'";
            })
            .replace(/\{\{(.+?)\}\}/g, "'+data.$1+'") +//把{{}}包裹的属性替换为对象相应属性的数据
            "';return s;";

        tplCache[tpl] = exec;
	
	}
	return new Function("data", content)(data);
	
	}
	
	
	var readyList = [];//为了触发多个docready做准备

	function ready() {
		Util.each(readyList, function (i, callback) {
			callback();
		});
		document.removeEventListener('DOMContentLoaded', ready, false);
	}

	Util.ready = function (callback) {
		if (document.readyState === 'complete') ////当页面加载状态为完全结束时
		{
			return setTimeout(callback, 1);
		}
		if (document.addEventListener) {
			readyList.push(callback);
			document.addEventListener('DOMContentLoaded', ready, false); //绑定domContentLoad事件

			return;
		}
		//对ie进行处理
		var domready = function () {
			try {
				document.documentElement.doScroll('left');
			} catch (e) {
				setTimeout(domready, 10);//通过不断测试doScroll方法来..你懂的
				return;
			}
			callback();
		};
		domready();
	},
	
	
	

	return Util
}
	())