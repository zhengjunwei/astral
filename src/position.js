/**
 * @module Position
 *
 * 提供各种尺寸的操作方法(需要添加注释和兼容来源)
 */

(function (name, definition) {
	if (typeof define == 'function') {
		define(definition);
	} else if (typeof module != 'undefined' && module.exports) {
		module.exports = definition;
	} else {
		window[name] = definition;
	}
})('Position', function () {
	//tester http://jsbin.com/uluq/1
	var Position = {},
	doc = document,
	body = doc.body,
	html = doc.documentElement;
	var pageXjudge = window.pageXOffset;
	var pageYjudge = window.pageYOffset;
	var clientTop = html.clientTop || body.clientTop || 0,
	clientLeft = html.clientLeft || body.clientLeft || 0;

	Position.getScroll = function () {
		var x = (pageXjudge !== undefined) ? pageXjudge : (html || body.parentNode || body).scrollLeft;
		var y = (pageYjudge !== undefined) ? pageYjudge : (html || body.parentNode || body).scrollTop;
		return {
			'x' : x,
			'y' : y
		}
	}

	Position.getCoords = function (el) {
		var box = el.getBoundingClientRect();
		top = box.top + Position.getScroll.x - clientTop,
		left = box.left + osition.getScroll.y - clientLeft
			return {
			'top' : top,
			'left' : left
		};
	}
	Position.getMousePosition = function (e) {
		return {
			x : e.clientX + Position.getScroll.x,
			y : e.clientY + Position.getScroll.y
		}
	}
	Position.getWholeHeight = function () {
		return body.scrollHeight || html.scrollHeight
	}
	Position.windowHeight = function () {
		return self.innerHeight || html && html.clientHeight || body.clientHeight
	}

	Position.selection = {
		getTxt : function (o) {
			var start = this.getStart(o);
			var end = this.getEnd(o);
			return (start != end) ? o.value.substring(start, end) : "";
		},
		getStart : function (o) {
			if (o.createTextRange) {
				var r = document.selection.createRange().duplicate()
					r.moveEnd('character', o.value.length)
					if (r.text == '')
						return o.value.length
						return o.value.lastIndexOf(r.text)
			} else
				return o.selectionStart
		},
		getEnd : function (o) {
			if (o.createTextRange) {
				var r = document.selection.createRange().duplicate()
					r.moveStart('character', -o.value.length)
					return r.text.length
			} else
				return o.selectionEnd
		},
		set : function (o, a, b) {
			//o是当前对象，例如文本域对象
			//a是起始位置，b是终点位置
			var a = parseInt(a, 10),
			b = parseInt(b, 10);
			var l = o.value.length;
			if (l) {
				//如果非数值，则表示从起始位置选择到结束位置
				!a && (a = 0);
				!b && (b = l);
				(a > l) && (a = l);
				(b > l) && (b = l);
				//如果为负值，则与长度值相加
				(a < 0) && (a = l + a);
				(b < 0) && (b = l + b);
				if (o.createTextRange) { //IE浏览器
					var range = o.createTextRange();
					range.moveStart("character", -l);
					range.moveEnd("character", -l);
					range.moveStart("character", a);
					range.moveEnd("character", b);
					range.select();
				} else {
					o.setSelectionRange(a, b);
					o.focus();
				}
			}
		}
	}

	return Position
}
	())