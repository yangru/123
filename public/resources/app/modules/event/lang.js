/**
 * Copyright (C) 2011, Dexter.Yy, MIT License
 *
 */
define(function(require, exports){

    var oz = this,
        String = window.String,
        Object = window.Object;

    if (!String.prototype.trim) {
        // http://blog.stevenlevithan.com/archives/faster-trim-javascript
        // http://perfectionkills.com/whitespace-deviations/
        var _str = "[\x09\x0A\-\x0D\x20\xA0\u1680\u180E\u2000-\u200A\u202F" +
            "\u205F\u3000\u2028\u2029\uFEFF]";
        var trimBeginRegexp = new RegExp("^" + _str + _str + "*");
        var trimEndRegexp = new RegExp(_str + _str + "*$");
        String.prototype.trim = function trim() {
            return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
        };
    }

    if (!Object.keys) {
        Object.keys = function(obj) {
            var keys = [];
            for (var prop in obj) {
                if ( obj.hasOwnProperty(prop) ) {
                    keys.push(prop);
                }
            }
            return keys;
        };
    }

    if (!Object.getPrototypeOf) {
        Object.getPrototypeOf = function getPrototypeOf(obj) {
            return obj.__proto__ || obj.constructor.prototype;
        };
    }

    exports.fnQueue = function(){
        var queue = [], dup = false;
        
        function getCallMethod(type){
            return function(){
                var re, fn;
                for (var i = 0, l = this.length; i < l; i++) {
                    fn = this[i];
                    if (fn) {
                        re = fn[type].apply(fn, arguments);
                    } else {
                        break;
                    }
                }
                return re;
            };
        }

        mix(queue, {
            call: getCallMethod('call'),
            apply: getCallMethod('apply'),
            clear: function(func){
                if (!func) {
                    this.length = 0;
                } else {
                    var size = this.length,
                        popsize = size - dup.length;
                    for (var i = this.length - 1; i >= 0; i--) {
                        if (this[i] === func) {
                            this.splice(i, 1);
                            if (dup && i >= popsize)
                                dup.splice(size - i - 1, 1);
                        }
                    }
                    if (i < 0)
                        return false;
                }
                return true;
            }
        });

        return queue;
    };


    exports.ns = function(namespace, v, parent){
        var i, p = parent || window, n = namespace.split(".").reverse();
        while ((i = n.pop()) && n.length > 0) {
            if (typeof p[i] === 'undefined') {
                p[i] = {};
            } else if (typeof p[i] !== "object") {
                return false;
            }
            p = p[i];
        }
        if (typeof v != "undefined")
            p[i] = v;
        return p[i];
    };

    /**
     * @public mix multiple objects
     * @param {object}
     * @param {object}
     * @param {object}
     * ...
     */ 
    var mix = exports.mix = function(target) {
        var objs = arguments, l = objs.length, o, copy;
        if (l == 1) {
            objs[1] = target;
            l = 2;
            target = this;
        }
        for (var i = 1; i < l; i++) {
            o = objs[i];
            for (var n in o) {
                copy = o[n];
                target[n] = copy;
            }
        }
        return target;
    };

    exports.config = function(cfg, opt, default_cfg){
        for (var i in default_cfg) {
            cfg[i] = opt.hasOwnProperty(i) ? opt[i] : default_cfg[i];
        }
    };

    exports.type = oz._type;

    exports.isFunction = oz._isFunction;

    exports.semver = oz._semver;


	/**
	 * @public 去掉数组里重复成员
	 * @note 支持所有成员类型，包括dom，对象，数组，布尔，null等
	 * @testcase var b=[1,3,5];unique([1,3,4,5,null,false,$(".pack")[0],b,"ab","cc",[1,3],3,6,b,1,false,null,"null","","false","",$(".pack")[0],"cc"]);
	 */
	exports.unique = function(array) {
		var ret = [], record = {}, objs = [], uniq_id = 1, it, tmp;
		var type = {
			"number": function(n){ return "__oz_num" + n; },
			"string": function(n){ return n; },
			"boolean": function(n){ return "__oz" + n; },
            "object": function(n){ 
                if (n === null) {
                    return "__oz_null";
                }
                if (!n.__oz_unique_flag) {
                    n.__oz_unique_flag = ++uniq_id;
                    objs.push(n);
                }
                return n.__oz_unique_flag;
            },
			"undefined": function(n){ return "__oz_undefined"; }
		};
		for (var i = 0, l = array.length; i < l; i++) {
			it = tmp = array[i];
			tmp = type[typeof it](it);
			if (!record[tmp]) {
				ret.push(it);
				record[tmp] = true;
			}
		}
		for (var i = 0, l = objs.length; i < l; i++) {
            delete objs[0].__oz_unique_flag;
        }
		return ret;
	};


});