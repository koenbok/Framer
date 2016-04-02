/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Defaults, Framer, _;
	
	_ = __webpack_require__(1)._;
	
	if (window.ontouchstart === void 0) {
	  window.ontouchstart = null;
	}
	
	Framer = {};
	
	Framer._ = _;
	
	Framer.Utils = __webpack_require__(4);
	
	Framer.Color = (__webpack_require__(10)).Color;
	
	Framer.Layer = (__webpack_require__(13)).Layer;
	
	Framer.BackgroundLayer = (__webpack_require__(35)).BackgroundLayer;
	
	Framer.VideoLayer = (__webpack_require__(36)).VideoLayer;
	
	Framer.Events = (__webpack_require__(15)).Events;
	
	Framer.Gestures = (__webpack_require__(16)).Gestures;
	
	Framer.Animation = (__webpack_require__(18)).Animation;
	
	Framer.AnimationGroup = (__webpack_require__(37)).AnimationGroup;
	
	Framer.Screen = (__webpack_require__(5)).Screen;
	
	Framer.Path = (__webpack_require__(38)).Path;
	
	Framer.Canvas = (__webpack_require__(39)).Canvas;
	
	Framer.print = (__webpack_require__(40)).print;
	
	Framer.ScrollComponent = (__webpack_require__(43)).ScrollComponent;
	
	Framer.PageComponent = (__webpack_require__(44)).PageComponent;
	
	Framer.SliderComponent = (__webpack_require__(45)).SliderComponent;
	
	Framer.DeviceComponent = (__webpack_require__(46)).DeviceComponent;
	
	Framer.DeviceView = Framer.DeviceComponent;
	
	if (window) {
	  _.extend(window, Framer);
	}
	
	Framer.Context = (__webpack_require__(41)).Context;
	
	Framer.Config = (__webpack_require__(14)).Config;
	
	Framer.EventEmitter = (__webpack_require__(7)).EventEmitter;
	
	Framer.BaseClass = (__webpack_require__(6)).BaseClass;
	
	Framer.LayerStyle = (__webpack_require__(25)).LayerStyle;
	
	Framer.AnimationLoop = (__webpack_require__(47)).AnimationLoop;
	
	Framer.LinearAnimator = (__webpack_require__(19)).LinearAnimator;
	
	Framer.BezierCurveAnimator = (__webpack_require__(21)).BezierCurveAnimator;
	
	Framer.SpringDHOAnimator = (__webpack_require__(24)).SpringDHOAnimator;
	
	Framer.SpringRK4Animator = (__webpack_require__(22)).SpringRK4Animator;
	
	Framer.LayerDraggable = (__webpack_require__(27)).LayerDraggable;
	
	Framer.Importer = (__webpack_require__(48)).Importer;
	
	Framer.Extras = __webpack_require__(49);
	
	Framer.GestureInputRecognizer = new (__webpack_require__(53)).GestureInputRecognizer;
	
	Framer.Version = __webpack_require__(54);
	
	Framer.Loop = new Framer.AnimationLoop();
	
	Utils.domComplete(Framer.Loop.start);
	
	if (window) {
	  window.Framer = Framer;
	}
	
	Defaults = (__webpack_require__(17)).Defaults;
	
	Defaults.setup();
	
	Framer.resetDefaults = Defaults.reset;
	
	Framer.DefaultContext = new Framer.Context({
	  name: "Default"
	});
	
	Framer.DefaultContext.backgroundColor = "white";
	
	Framer.CurrentContext = Framer.DefaultContext;
	
	if (Utils.isMobile()) {
	  Framer.Extras.MobileScrollFix.enable();
	}
	
	if (!Utils.isTouch()) {
	  Framer.Extras.TouchEmulator.enable();
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	exports._ = __webpack_require__(2);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * @license
	 * lodash 3.10.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern -d -o ./index.js`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	;(function() {
	
	  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
	  var undefined;
	
	  /** Used as the semantic version number. */
	  var VERSION = '3.10.1';
	
	  /** Used to compose bitmasks for wrapper metadata. */
	  var BIND_FLAG = 1,
	      BIND_KEY_FLAG = 2,
	      CURRY_BOUND_FLAG = 4,
	      CURRY_FLAG = 8,
	      CURRY_RIGHT_FLAG = 16,
	      PARTIAL_FLAG = 32,
	      PARTIAL_RIGHT_FLAG = 64,
	      ARY_FLAG = 128,
	      REARG_FLAG = 256;
	
	  /** Used as default options for `_.trunc`. */
	  var DEFAULT_TRUNC_LENGTH = 30,
	      DEFAULT_TRUNC_OMISSION = '...';
	
	  /** Used to detect when a function becomes hot. */
	  var HOT_COUNT = 150,
	      HOT_SPAN = 16;
	
	  /** Used as the size to enable large array optimizations. */
	  var LARGE_ARRAY_SIZE = 200;
	
	  /** Used to indicate the type of lazy iteratees. */
	  var LAZY_FILTER_FLAG = 1,
	      LAZY_MAP_FLAG = 2;
	
	  /** Used as the `TypeError` message for "Functions" methods. */
	  var FUNC_ERROR_TEXT = 'Expected a function';
	
	  /** Used as the internal argument placeholder. */
	  var PLACEHOLDER = '__lodash_placeholder__';
	
	  /** `Object#toString` result references. */
	  var argsTag = '[object Arguments]',
	      arrayTag = '[object Array]',
	      boolTag = '[object Boolean]',
	      dateTag = '[object Date]',
	      errorTag = '[object Error]',
	      funcTag = '[object Function]',
	      mapTag = '[object Map]',
	      numberTag = '[object Number]',
	      objectTag = '[object Object]',
	      regexpTag = '[object RegExp]',
	      setTag = '[object Set]',
	      stringTag = '[object String]',
	      weakMapTag = '[object WeakMap]';
	
	  var arrayBufferTag = '[object ArrayBuffer]',
	      float32Tag = '[object Float32Array]',
	      float64Tag = '[object Float64Array]',
	      int8Tag = '[object Int8Array]',
	      int16Tag = '[object Int16Array]',
	      int32Tag = '[object Int32Array]',
	      uint8Tag = '[object Uint8Array]',
	      uint8ClampedTag = '[object Uint8ClampedArray]',
	      uint16Tag = '[object Uint16Array]',
	      uint32Tag = '[object Uint32Array]';
	
	  /** Used to match empty string literals in compiled template source. */
	  var reEmptyStringLeading = /\b__p \+= '';/g,
	      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
	      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
	
	  /** Used to match HTML entities and HTML characters. */
	  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
	      reUnescapedHtml = /[&<>"'`]/g,
	      reHasEscapedHtml = RegExp(reEscapedHtml.source),
	      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
	
	  /** Used to match template delimiters. */
	  var reEscape = /<%-([\s\S]+?)%>/g,
	      reEvaluate = /<%([\s\S]+?)%>/g,
	      reInterpolate = /<%=([\s\S]+?)%>/g;
	
	  /** Used to match property names within property paths. */
	  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
	      reIsPlainProp = /^\w*$/,
	      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
	
	  /**
	   * Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns)
	   * and those outlined by [`EscapeRegExpPattern`](http://ecma-international.org/ecma-262/6.0/#sec-escaperegexppattern).
	   */
	  var reRegExpChars = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,
	      reHasRegExpChars = RegExp(reRegExpChars.source);
	
	  /** Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks). */
	  var reComboMark = /[\u0300-\u036f\ufe20-\ufe23]/g;
	
	  /** Used to match backslashes in property paths. */
	  var reEscapeChar = /\\(\\)?/g;
	
	  /** Used to match [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components). */
	  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
	
	  /** Used to match `RegExp` flags from their coerced string values. */
	  var reFlags = /\w*$/;
	
	  /** Used to detect hexadecimal string values. */
	  var reHasHexPrefix = /^0[xX]/;
	
	  /** Used to detect host constructors (Safari > 5). */
	  var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	  /** Used to detect unsigned integer values. */
	  var reIsUint = /^\d+$/;
	
	  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
	  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;
	
	  /** Used to ensure capturing order of template delimiters. */
	  var reNoMatch = /($^)/;
	
	  /** Used to match unescaped characters in compiled string literals. */
	  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
	
	  /** Used to match words to create compound words. */
	  var reWords = (function() {
	    var upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
	        lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';
	
	    return RegExp(upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
	  }());
	
	  /** Used to assign default `context` object properties. */
	  var contextProps = [
	    'Array', 'ArrayBuffer', 'Date', 'Error', 'Float32Array', 'Float64Array',
	    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Math', 'Number',
	    'Object', 'RegExp', 'Set', 'String', '_', 'clearTimeout', 'isFinite',
	    'parseFloat', 'parseInt', 'setTimeout', 'TypeError', 'Uint8Array',
	    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap'
	  ];
	
	  /** Used to make template sourceURLs easier to identify. */
	  var templateCounter = -1;
	
	  /** Used to identify `toStringTag` values of typed arrays. */
	  var typedArrayTags = {};
	  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	  typedArrayTags[uint32Tag] = true;
	  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
	
	  /** Used to identify `toStringTag` values supported by `_.clone`. */
	  var cloneableTags = {};
	  cloneableTags[argsTag] = cloneableTags[arrayTag] =
	  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
	  cloneableTags[dateTag] = cloneableTags[float32Tag] =
	  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
	  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
	  cloneableTags[numberTag] = cloneableTags[objectTag] =
	  cloneableTags[regexpTag] = cloneableTags[stringTag] =
	  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
	  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	  cloneableTags[errorTag] = cloneableTags[funcTag] =
	  cloneableTags[mapTag] = cloneableTags[setTag] =
	  cloneableTags[weakMapTag] = false;
	
	  /** Used to map latin-1 supplementary letters to basic latin letters. */
	  var deburredLetters = {
	    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
	    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
	    '\xc7': 'C',  '\xe7': 'c',
	    '\xd0': 'D',  '\xf0': 'd',
	    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
	    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
	    '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
	    '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
	    '\xd1': 'N',  '\xf1': 'n',
	    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
	    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
	    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
	    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
	    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
	    '\xc6': 'Ae', '\xe6': 'ae',
	    '\xde': 'Th', '\xfe': 'th',
	    '\xdf': 'ss'
	  };
	
	  /** Used to map characters to HTML entities. */
	  var htmlEscapes = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#39;',
	    '`': '&#96;'
	  };
	
	  /** Used to map HTML entities to characters. */
	  var htmlUnescapes = {
	    '&amp;': '&',
	    '&lt;': '<',
	    '&gt;': '>',
	    '&quot;': '"',
	    '&#39;': "'",
	    '&#96;': '`'
	  };
	
	  /** Used to determine if values are of the language type `Object`. */
	  var objectTypes = {
	    'function': true,
	    'object': true
	  };
	
	  /** Used to escape characters for inclusion in compiled regexes. */
	  var regexpEscapes = {
	    '0': 'x30', '1': 'x31', '2': 'x32', '3': 'x33', '4': 'x34',
	    '5': 'x35', '6': 'x36', '7': 'x37', '8': 'x38', '9': 'x39',
	    'A': 'x41', 'B': 'x42', 'C': 'x43', 'D': 'x44', 'E': 'x45', 'F': 'x46',
	    'a': 'x61', 'b': 'x62', 'c': 'x63', 'd': 'x64', 'e': 'x65', 'f': 'x66',
	    'n': 'x6e', 'r': 'x72', 't': 'x74', 'u': 'x75', 'v': 'x76', 'x': 'x78'
	  };
	
	  /** Used to escape characters for inclusion in compiled string literals. */
	  var stringEscapes = {
	    '\\': '\\',
	    "'": "'",
	    '\n': 'n',
	    '\r': 'r',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };
	
	  /** Detect free variable `exports`. */
	  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
	
	  /** Detect free variable `module`. */
	  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
	
	  /** Detect free variable `global` from Node.js. */
	  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;
	
	  /** Detect free variable `self`. */
	  var freeSelf = objectTypes[typeof self] && self && self.Object && self;
	
	  /** Detect free variable `window`. */
	  var freeWindow = objectTypes[typeof window] && window && window.Object && window;
	
	  /** Detect the popular CommonJS extension `module.exports`. */
	  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
	
	  /**
	   * Used as a reference to the global object.
	   *
	   * The `this` value is used if it's the global object to avoid Greasemonkey's
	   * restricted `window` object, otherwise the `window` object is used.
	   */
	  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;
	
	  /*--------------------------------------------------------------------------*/
	
	  /**
	   * The base implementation of `compareAscending` which compares values and
	   * sorts them in ascending order without guaranteeing a stable sort.
	   *
	   * @private
	   * @param {*} value The value to compare.
	   * @param {*} other The other value to compare.
	   * @returns {number} Returns the sort order indicator for `value`.
	   */
	  function baseCompareAscending(value, other) {
	    if (value !== other) {
	      var valIsNull = value === null,
	          valIsUndef = value === undefined,
	          valIsReflexive = value === value;
	
	      var othIsNull = other === null,
	          othIsUndef = other === undefined,
	          othIsReflexive = other === other;
	
	      if ((value > other && !othIsNull) || !valIsReflexive ||
	          (valIsNull && !othIsUndef && othIsReflexive) ||
	          (valIsUndef && othIsReflexive)) {
	        return 1;
	      }
	      if ((value < other && !valIsNull) || !othIsReflexive ||
	          (othIsNull && !valIsUndef && valIsReflexive) ||
	          (othIsUndef && valIsReflexive)) {
	        return -1;
	      }
	    }
	    return 0;
	  }
	
	  /**
	   * The base implementation of `_.findIndex` and `_.findLastIndex` without
	   * support for callback shorthands and `this` binding.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {Function} predicate The function invoked per iteration.
	   * @param {boolean} [fromRight] Specify iterating from right to left.
	   * @returns {number} Returns the index of the matched value, else `-1`.
	   */
	  function baseFindIndex(array, predicate, fromRight) {
	    var length = array.length,
	        index = fromRight ? length : -1;
	
	    while ((fromRight ? index-- : ++index < length)) {
	      if (predicate(array[index], index, array)) {
	        return index;
	      }
	    }
	    return -1;
	  }
	
	  /**
	   * The base implementation of `_.indexOf` without support for binary searches.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {*} value The value to search for.
	   * @param {number} fromIndex The index to search from.
	   * @returns {number} Returns the index of the matched value, else `-1`.
	   */
	  function baseIndexOf(array, value, fromIndex) {
	    if (value !== value) {
	      return indexOfNaN(array, fromIndex);
	    }
	    var index = fromIndex - 1,
	        length = array.length;
	
	    while (++index < length) {
	      if (array[index] === value) {
	        return index;
	      }
	    }
	    return -1;
	  }
	
	  /**
	   * The base implementation of `_.isFunction` without support for environments
	   * with incorrect `typeof` results.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	   */
	  function baseIsFunction(value) {
	    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
	    // See https://github.com/jashkenas/underscore/issues/1621 for more details.
	    return typeof value == 'function' || false;
	  }
	
	  /**
	   * Converts `value` to a string if it's not one. An empty string is returned
	   * for `null` or `undefined` values.
	   *
	   * @private
	   * @param {*} value The value to process.
	   * @returns {string} Returns the string.
	   */
	  function baseToString(value) {
	    return value == null ? '' : (value + '');
	  }
	
	  /**
	   * Used by `_.trim` and `_.trimLeft` to get the index of the first character
	   * of `string` that is not found in `chars`.
	   *
	   * @private
	   * @param {string} string The string to inspect.
	   * @param {string} chars The characters to find.
	   * @returns {number} Returns the index of the first character not found in `chars`.
	   */
	  function charsLeftIndex(string, chars) {
	    var index = -1,
	        length = string.length;
	
	    while (++index < length && chars.indexOf(string.charAt(index)) > -1) {}
	    return index;
	  }
	
	  /**
	   * Used by `_.trim` and `_.trimRight` to get the index of the last character
	   * of `string` that is not found in `chars`.
	   *
	   * @private
	   * @param {string} string The string to inspect.
	   * @param {string} chars The characters to find.
	   * @returns {number} Returns the index of the last character not found in `chars`.
	   */
	  function charsRightIndex(string, chars) {
	    var index = string.length;
	
	    while (index-- && chars.indexOf(string.charAt(index)) > -1) {}
	    return index;
	  }
	
	  /**
	   * Used by `_.sortBy` to compare transformed elements of a collection and stable
	   * sort them in ascending order.
	   *
	   * @private
	   * @param {Object} object The object to compare.
	   * @param {Object} other The other object to compare.
	   * @returns {number} Returns the sort order indicator for `object`.
	   */
	  function compareAscending(object, other) {
	    return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
	  }
	
	  /**
	   * Used by `_.sortByOrder` to compare multiple properties of a value to another
	   * and stable sort them.
	   *
	   * If `orders` is unspecified, all valuess are sorted in ascending order. Otherwise,
	   * a value is sorted in ascending order if its corresponding order is "asc", and
	   * descending if "desc".
	   *
	   * @private
	   * @param {Object} object The object to compare.
	   * @param {Object} other The other object to compare.
	   * @param {boolean[]} orders The order to sort by for each property.
	   * @returns {number} Returns the sort order indicator for `object`.
	   */
	  function compareMultiple(object, other, orders) {
	    var index = -1,
	        objCriteria = object.criteria,
	        othCriteria = other.criteria,
	        length = objCriteria.length,
	        ordersLength = orders.length;
	
	    while (++index < length) {
	      var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
	      if (result) {
	        if (index >= ordersLength) {
	          return result;
	        }
	        var order = orders[index];
	        return result * ((order === 'asc' || order === true) ? 1 : -1);
	      }
	    }
	    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
	    // that causes it, under certain circumstances, to provide the same value for
	    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
	    // for more details.
	    //
	    // This also ensures a stable sort in V8 and other engines.
	    // See https://code.google.com/p/v8/issues/detail?id=90 for more details.
	    return object.index - other.index;
	  }
	
	  /**
	   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
	   *
	   * @private
	   * @param {string} letter The matched letter to deburr.
	   * @returns {string} Returns the deburred letter.
	   */
	  function deburrLetter(letter) {
	    return deburredLetters[letter];
	  }
	
	  /**
	   * Used by `_.escape` to convert characters to HTML entities.
	   *
	   * @private
	   * @param {string} chr The matched character to escape.
	   * @returns {string} Returns the escaped character.
	   */
	  function escapeHtmlChar(chr) {
	    return htmlEscapes[chr];
	  }
	
	  /**
	   * Used by `_.escapeRegExp` to escape characters for inclusion in compiled regexes.
	   *
	   * @private
	   * @param {string} chr The matched character to escape.
	   * @param {string} leadingChar The capture group for a leading character.
	   * @param {string} whitespaceChar The capture group for a whitespace character.
	   * @returns {string} Returns the escaped character.
	   */
	  function escapeRegExpChar(chr, leadingChar, whitespaceChar) {
	    if (leadingChar) {
	      chr = regexpEscapes[chr];
	    } else if (whitespaceChar) {
	      chr = stringEscapes[chr];
	    }
	    return '\\' + chr;
	  }
	
	  /**
	   * Used by `_.template` to escape characters for inclusion in compiled string literals.
	   *
	   * @private
	   * @param {string} chr The matched character to escape.
	   * @returns {string} Returns the escaped character.
	   */
	  function escapeStringChar(chr) {
	    return '\\' + stringEscapes[chr];
	  }
	
	  /**
	   * Gets the index at which the first occurrence of `NaN` is found in `array`.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {number} fromIndex The index to search from.
	   * @param {boolean} [fromRight] Specify iterating from right to left.
	   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
	   */
	  function indexOfNaN(array, fromIndex, fromRight) {
	    var length = array.length,
	        index = fromIndex + (fromRight ? 0 : -1);
	
	    while ((fromRight ? index-- : ++index < length)) {
	      var other = array[index];
	      if (other !== other) {
	        return index;
	      }
	    }
	    return -1;
	  }
	
	  /**
	   * Checks if `value` is object-like.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	   */
	  function isObjectLike(value) {
	    return !!value && typeof value == 'object';
	  }
	
	  /**
	   * Used by `trimmedLeftIndex` and `trimmedRightIndex` to determine if a
	   * character code is whitespace.
	   *
	   * @private
	   * @param {number} charCode The character code to inspect.
	   * @returns {boolean} Returns `true` if `charCode` is whitespace, else `false`.
	   */
	  function isSpace(charCode) {
	    return ((charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160) || charCode == 5760 || charCode == 6158 ||
	      (charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279)));
	  }
	
	  /**
	   * Replaces all `placeholder` elements in `array` with an internal placeholder
	   * and returns an array of their indexes.
	   *
	   * @private
	   * @param {Array} array The array to modify.
	   * @param {*} placeholder The placeholder to replace.
	   * @returns {Array} Returns the new array of placeholder indexes.
	   */
	  function replaceHolders(array, placeholder) {
	    var index = -1,
	        length = array.length,
	        resIndex = -1,
	        result = [];
	
	    while (++index < length) {
	      if (array[index] === placeholder) {
	        array[index] = PLACEHOLDER;
	        result[++resIndex] = index;
	      }
	    }
	    return result;
	  }
	
	  /**
	   * An implementation of `_.uniq` optimized for sorted arrays without support
	   * for callback shorthands and `this` binding.
	   *
	   * @private
	   * @param {Array} array The array to inspect.
	   * @param {Function} [iteratee] The function invoked per iteration.
	   * @returns {Array} Returns the new duplicate-value-free array.
	   */
	  function sortedUniq(array, iteratee) {
	    var seen,
	        index = -1,
	        length = array.length,
	        resIndex = -1,
	        result = [];
	
	    while (++index < length) {
	      var value = array[index],
	          computed = iteratee ? iteratee(value, index, array) : value;
	
	      if (!index || seen !== computed) {
	        seen = computed;
	        result[++resIndex] = value;
	      }
	    }
	    return result;
	  }
	
	  /**
	   * Used by `_.trim` and `_.trimLeft` to get the index of the first non-whitespace
	   * character of `string`.
	   *
	   * @private
	   * @param {string} string The string to inspect.
	   * @returns {number} Returns the index of the first non-whitespace character.
	   */
	  function trimmedLeftIndex(string) {
	    var index = -1,
	        length = string.length;
	
	    while (++index < length && isSpace(string.charCodeAt(index))) {}
	    return index;
	  }
	
	  /**
	   * Used by `_.trim` and `_.trimRight` to get the index of the last non-whitespace
	   * character of `string`.
	   *
	   * @private
	   * @param {string} string The string to inspect.
	   * @returns {number} Returns the index of the last non-whitespace character.
	   */
	  function trimmedRightIndex(string) {
	    var index = string.length;
	
	    while (index-- && isSpace(string.charCodeAt(index))) {}
	    return index;
	  }
	
	  /**
	   * Used by `_.unescape` to convert HTML entities to characters.
	   *
	   * @private
	   * @param {string} chr The matched character to unescape.
	   * @returns {string} Returns the unescaped character.
	   */
	  function unescapeHtmlChar(chr) {
	    return htmlUnescapes[chr];
	  }
	
	  /*--------------------------------------------------------------------------*/
	
	  /**
	   * Create a new pristine `lodash` function using the given `context` object.
	   *
	   * @static
	   * @memberOf _
	   * @category Utility
	   * @param {Object} [context=root] The context object.
	   * @returns {Function} Returns a new `lodash` function.
	   * @example
	   *
	   * _.mixin({ 'foo': _.constant('foo') });
	   *
	   * var lodash = _.runInContext();
	   * lodash.mixin({ 'bar': lodash.constant('bar') });
	   *
	   * _.isFunction(_.foo);
	   * // => true
	   * _.isFunction(_.bar);
	   * // => false
	   *
	   * lodash.isFunction(lodash.foo);
	   * // => false
	   * lodash.isFunction(lodash.bar);
	   * // => true
	   *
	   * // using `context` to mock `Date#getTime` use in `_.now`
	   * var mock = _.runInContext({
	   *   'Date': function() {
	   *     return { 'getTime': getTimeMock };
	   *   }
	   * });
	   *
	   * // or creating a suped-up `defer` in Node.js
	   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
	   */
	  function runInContext(context) {
	    // Avoid issues with some ES3 environments that attempt to use values, named
	    // after built-in constructors like `Object`, for the creation of literals.
	    // ES5 clears this up by stating that literals must use built-in constructors.
	    // See https://es5.github.io/#x11.1.5 for more details.
	    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;
	
	    /** Native constructor references. */
	    var Array = context.Array,
	        Date = context.Date,
	        Error = context.Error,
	        Function = context.Function,
	        Math = context.Math,
	        Number = context.Number,
	        Object = context.Object,
	        RegExp = context.RegExp,
	        String = context.String,
	        TypeError = context.TypeError;
	
	    /** Used for native method references. */
	    var arrayProto = Array.prototype,
	        objectProto = Object.prototype,
	        stringProto = String.prototype;
	
	    /** Used to resolve the decompiled source of functions. */
	    var fnToString = Function.prototype.toString;
	
	    /** Used to check objects for own properties. */
	    var hasOwnProperty = objectProto.hasOwnProperty;
	
	    /** Used to generate unique IDs. */
	    var idCounter = 0;
	
	    /**
	     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	     * of values.
	     */
	    var objToString = objectProto.toString;
	
	    /** Used to restore the original `_` reference in `_.noConflict`. */
	    var oldDash = root._;
	
	    /** Used to detect if a method is native. */
	    var reIsNative = RegExp('^' +
	      fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	    );
	
	    /** Native method references. */
	    var ArrayBuffer = context.ArrayBuffer,
	        clearTimeout = context.clearTimeout,
	        parseFloat = context.parseFloat,
	        pow = Math.pow,
	        propertyIsEnumerable = objectProto.propertyIsEnumerable,
	        Set = getNative(context, 'Set'),
	        setTimeout = context.setTimeout,
	        splice = arrayProto.splice,
	        Uint8Array = context.Uint8Array,
	        WeakMap = getNative(context, 'WeakMap');
	
	    /* Native method references for those with the same name as other `lodash` methods. */
	    var nativeCeil = Math.ceil,
	        nativeCreate = getNative(Object, 'create'),
	        nativeFloor = Math.floor,
	        nativeIsArray = getNative(Array, 'isArray'),
	        nativeIsFinite = context.isFinite,
	        nativeKeys = getNative(Object, 'keys'),
	        nativeMax = Math.max,
	        nativeMin = Math.min,
	        nativeNow = getNative(Date, 'now'),
	        nativeParseInt = context.parseInt,
	        nativeRandom = Math.random;
	
	    /** Used as references for `-Infinity` and `Infinity`. */
	    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY,
	        POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
	
	    /** Used as references for the maximum length and index of an array. */
	    var MAX_ARRAY_LENGTH = 4294967295,
	        MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
	        HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
	
	    /**
	     * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	     * of an array-like value.
	     */
	    var MAX_SAFE_INTEGER = 9007199254740991;
	
	    /** Used to store function metadata. */
	    var metaMap = WeakMap && new WeakMap;
	
	    /** Used to lookup unminified function names. */
	    var realNames = {};
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a `lodash` object which wraps `value` to enable implicit chaining.
	     * Methods that operate on and return arrays, collections, and functions can
	     * be chained together. Methods that retrieve a single value or may return a
	     * primitive value will automatically end the chain returning the unwrapped
	     * value. Explicit chaining may be enabled using `_.chain`. The execution of
	     * chained methods is lazy, that is, execution is deferred until `_#value`
	     * is implicitly or explicitly called.
	     *
	     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
	     * fusion is an optimization strategy which merge iteratee calls; this can help
	     * to avoid the creation of intermediate data structures and greatly reduce the
	     * number of iteratee executions.
	     *
	     * Chaining is supported in custom builds as long as the `_#value` method is
	     * directly or indirectly included in the build.
	     *
	     * In addition to lodash methods, wrappers have `Array` and `String` methods.
	     *
	     * The wrapper `Array` methods are:
	     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
	     * `splice`, and `unshift`
	     *
	     * The wrapper `String` methods are:
	     * `replace` and `split`
	     *
	     * The wrapper methods that support shortcut fusion are:
	     * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
	     * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
	     * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
	     * and `where`
	     *
	     * The chainable wrapper methods are:
	     * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
	     * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
	     * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defaultsDeep`,
	     * `defer`, `delay`, `difference`, `drop`, `dropRight`, `dropRightWhile`,
	     * `dropWhile`, `fill`, `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`,
	     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
	     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
	     * `invoke`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`,
	     * `matchesProperty`, `memoize`, `merge`, `method`, `methodOf`, `mixin`,
	     * `modArgs`, `negate`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
	     * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
	     * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `restParam`,
	     * `reverse`, `set`, `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`,
	     * `sortByOrder`, `splice`, `spread`, `take`, `takeRight`, `takeRightWhile`,
	     * `takeWhile`, `tap`, `throttle`, `thru`, `times`, `toArray`, `toPlainObject`,
	     * `transform`, `union`, `uniq`, `unshift`, `unzip`, `unzipWith`, `values`,
	     * `valuesIn`, `where`, `without`, `wrap`, `xor`, `zip`, `zipObject`, `zipWith`
	     *
	     * The wrapper methods that are **not** chainable by default are:
	     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clone`, `cloneDeep`,
	     * `deburr`, `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`,
	     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`,
	     * `floor`, `get`, `gt`, `gte`, `has`, `identity`, `includes`, `indexOf`,
	     * `inRange`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
	     * `isEmpty`, `isEqual`, `isError`, `isFinite` `isFunction`, `isMatch`,
	     * `isNative`, `isNaN`, `isNull`, `isNumber`, `isObject`, `isPlainObject`,
	     * `isRegExp`, `isString`, `isUndefined`, `isTypedArray`, `join`, `kebabCase`,
	     * `last`, `lastIndexOf`, `lt`, `lte`, `max`, `min`, `noConflict`, `noop`,
	     * `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`, `random`, `reduce`,
	     * `reduceRight`, `repeat`, `result`, `round`, `runInContext`, `shift`, `size`,
	     * `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`, `startCase`,
	     * `startsWith`, `sum`, `template`, `trim`, `trimLeft`, `trimRight`, `trunc`,
	     * `unescape`, `uniqueId`, `value`, and `words`
	     *
	     * The wrapper method `sample` will return a wrapped value when `n` is provided,
	     * otherwise an unwrapped value is returned.
	     *
	     * @name _
	     * @constructor
	     * @category Chain
	     * @param {*} value The value to wrap in a `lodash` instance.
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var wrapped = _([1, 2, 3]);
	     *
	     * // returns an unwrapped value
	     * wrapped.reduce(function(total, n) {
	     *   return total + n;
	     * });
	     * // => 6
	     *
	     * // returns a wrapped value
	     * var squares = wrapped.map(function(n) {
	     *   return n * n;
	     * });
	     *
	     * _.isArray(squares);
	     * // => false
	     *
	     * _.isArray(squares.value());
	     * // => true
	     */
	    function lodash(value) {
	      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
	        if (value instanceof LodashWrapper) {
	          return value;
	        }
	        if (hasOwnProperty.call(value, '__chain__') && hasOwnProperty.call(value, '__wrapped__')) {
	          return wrapperClone(value);
	        }
	      }
	      return new LodashWrapper(value);
	    }
	
	    /**
	     * The function whose prototype all chaining wrappers inherit from.
	     *
	     * @private
	     */
	    function baseLodash() {
	      // No operation performed.
	    }
	
	    /**
	     * The base constructor for creating `lodash` wrapper objects.
	     *
	     * @private
	     * @param {*} value The value to wrap.
	     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
	     * @param {Array} [actions=[]] Actions to peform to resolve the unwrapped value.
	     */
	    function LodashWrapper(value, chainAll, actions) {
	      this.__wrapped__ = value;
	      this.__actions__ = actions || [];
	      this.__chain__ = !!chainAll;
	    }
	
	    /**
	     * An object environment feature flags.
	     *
	     * @static
	     * @memberOf _
	     * @type Object
	     */
	    var support = lodash.support = {};
	
	    /**
	     * By default, the template delimiters used by lodash are like those in
	     * embedded Ruby (ERB). Change the following template settings to use
	     * alternative delimiters.
	     *
	     * @static
	     * @memberOf _
	     * @type Object
	     */
	    lodash.templateSettings = {
	
	      /**
	       * Used to detect `data` property values to be HTML-escaped.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'escape': reEscape,
	
	      /**
	       * Used to detect code to be evaluated.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'evaluate': reEvaluate,
	
	      /**
	       * Used to detect `data` property values to inject.
	       *
	       * @memberOf _.templateSettings
	       * @type RegExp
	       */
	      'interpolate': reInterpolate,
	
	      /**
	       * Used to reference the data object in the template text.
	       *
	       * @memberOf _.templateSettings
	       * @type string
	       */
	      'variable': '',
	
	      /**
	       * Used to import variables into the compiled template.
	       *
	       * @memberOf _.templateSettings
	       * @type Object
	       */
	      'imports': {
	
	        /**
	         * A reference to the `lodash` function.
	         *
	         * @memberOf _.templateSettings.imports
	         * @type Function
	         */
	        '_': lodash
	      }
	    };
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
	     *
	     * @private
	     * @param {*} value The value to wrap.
	     */
	    function LazyWrapper(value) {
	      this.__wrapped__ = value;
	      this.__actions__ = [];
	      this.__dir__ = 1;
	      this.__filtered__ = false;
	      this.__iteratees__ = [];
	      this.__takeCount__ = POSITIVE_INFINITY;
	      this.__views__ = [];
	    }
	
	    /**
	     * Creates a clone of the lazy wrapper object.
	     *
	     * @private
	     * @name clone
	     * @memberOf LazyWrapper
	     * @returns {Object} Returns the cloned `LazyWrapper` object.
	     */
	    function lazyClone() {
	      var result = new LazyWrapper(this.__wrapped__);
	      result.__actions__ = arrayCopy(this.__actions__);
	      result.__dir__ = this.__dir__;
	      result.__filtered__ = this.__filtered__;
	      result.__iteratees__ = arrayCopy(this.__iteratees__);
	      result.__takeCount__ = this.__takeCount__;
	      result.__views__ = arrayCopy(this.__views__);
	      return result;
	    }
	
	    /**
	     * Reverses the direction of lazy iteration.
	     *
	     * @private
	     * @name reverse
	     * @memberOf LazyWrapper
	     * @returns {Object} Returns the new reversed `LazyWrapper` object.
	     */
	    function lazyReverse() {
	      if (this.__filtered__) {
	        var result = new LazyWrapper(this);
	        result.__dir__ = -1;
	        result.__filtered__ = true;
	      } else {
	        result = this.clone();
	        result.__dir__ *= -1;
	      }
	      return result;
	    }
	
	    /**
	     * Extracts the unwrapped value from its lazy wrapper.
	     *
	     * @private
	     * @name value
	     * @memberOf LazyWrapper
	     * @returns {*} Returns the unwrapped value.
	     */
	    function lazyValue() {
	      var array = this.__wrapped__.value(),
	          dir = this.__dir__,
	          isArr = isArray(array),
	          isRight = dir < 0,
	          arrLength = isArr ? array.length : 0,
	          view = getView(0, arrLength, this.__views__),
	          start = view.start,
	          end = view.end,
	          length = end - start,
	          index = isRight ? end : (start - 1),
	          iteratees = this.__iteratees__,
	          iterLength = iteratees.length,
	          resIndex = 0,
	          takeCount = nativeMin(length, this.__takeCount__);
	
	      if (!isArr || arrLength < LARGE_ARRAY_SIZE || (arrLength == length && takeCount == length)) {
	        return baseWrapperValue((isRight && isArr) ? array.reverse() : array, this.__actions__);
	      }
	      var result = [];
	
	      outer:
	      while (length-- && resIndex < takeCount) {
	        index += dir;
	
	        var iterIndex = -1,
	            value = array[index];
	
	        while (++iterIndex < iterLength) {
	          var data = iteratees[iterIndex],
	              iteratee = data.iteratee,
	              type = data.type,
	              computed = iteratee(value);
	
	          if (type == LAZY_MAP_FLAG) {
	            value = computed;
	          } else if (!computed) {
	            if (type == LAZY_FILTER_FLAG) {
	              continue outer;
	            } else {
	              break outer;
	            }
	          }
	        }
	        result[resIndex++] = value;
	      }
	      return result;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a cache object to store key/value pairs.
	     *
	     * @private
	     * @static
	     * @name Cache
	     * @memberOf _.memoize
	     */
	    function MapCache() {
	      this.__data__ = {};
	    }
	
	    /**
	     * Removes `key` and its value from the cache.
	     *
	     * @private
	     * @name delete
	     * @memberOf _.memoize.Cache
	     * @param {string} key The key of the value to remove.
	     * @returns {boolean} Returns `true` if the entry was removed successfully, else `false`.
	     */
	    function mapDelete(key) {
	      return this.has(key) && delete this.__data__[key];
	    }
	
	    /**
	     * Gets the cached value for `key`.
	     *
	     * @private
	     * @name get
	     * @memberOf _.memoize.Cache
	     * @param {string} key The key of the value to get.
	     * @returns {*} Returns the cached value.
	     */
	    function mapGet(key) {
	      return key == '__proto__' ? undefined : this.__data__[key];
	    }
	
	    /**
	     * Checks if a cached value for `key` exists.
	     *
	     * @private
	     * @name has
	     * @memberOf _.memoize.Cache
	     * @param {string} key The key of the entry to check.
	     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	     */
	    function mapHas(key) {
	      return key != '__proto__' && hasOwnProperty.call(this.__data__, key);
	    }
	
	    /**
	     * Sets `value` to `key` of the cache.
	     *
	     * @private
	     * @name set
	     * @memberOf _.memoize.Cache
	     * @param {string} key The key of the value to cache.
	     * @param {*} value The value to cache.
	     * @returns {Object} Returns the cache object.
	     */
	    function mapSet(key, value) {
	      if (key != '__proto__') {
	        this.__data__[key] = value;
	      }
	      return this;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     *
	     * Creates a cache object to store unique values.
	     *
	     * @private
	     * @param {Array} [values] The values to cache.
	     */
	    function SetCache(values) {
	      var length = values ? values.length : 0;
	
	      this.data = { 'hash': nativeCreate(null), 'set': new Set };
	      while (length--) {
	        this.push(values[length]);
	      }
	    }
	
	    /**
	     * Checks if `value` is in `cache` mimicking the return signature of
	     * `_.indexOf` by returning `0` if the value is found, else `-1`.
	     *
	     * @private
	     * @param {Object} cache The cache to search.
	     * @param {*} value The value to search for.
	     * @returns {number} Returns `0` if `value` is found, else `-1`.
	     */
	    function cacheIndexOf(cache, value) {
	      var data = cache.data,
	          result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];
	
	      return result ? 0 : -1;
	    }
	
	    /**
	     * Adds `value` to the cache.
	     *
	     * @private
	     * @name push
	     * @memberOf SetCache
	     * @param {*} value The value to cache.
	     */
	    function cachePush(value) {
	      var data = this.data;
	      if (typeof value == 'string' || isObject(value)) {
	        data.set.add(value);
	      } else {
	        data.hash[value] = true;
	      }
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a new array joining `array` with `other`.
	     *
	     * @private
	     * @param {Array} array The array to join.
	     * @param {Array} other The other array to join.
	     * @returns {Array} Returns the new concatenated array.
	     */
	    function arrayConcat(array, other) {
	      var index = -1,
	          length = array.length,
	          othIndex = -1,
	          othLength = other.length,
	          result = Array(length + othLength);
	
	      while (++index < length) {
	        result[index] = array[index];
	      }
	      while (++othIndex < othLength) {
	        result[index++] = other[othIndex];
	      }
	      return result;
	    }
	
	    /**
	     * Copies the values of `source` to `array`.
	     *
	     * @private
	     * @param {Array} source The array to copy values from.
	     * @param {Array} [array=[]] The array to copy values to.
	     * @returns {Array} Returns `array`.
	     */
	    function arrayCopy(source, array) {
	      var index = -1,
	          length = source.length;
	
	      array || (array = Array(length));
	      while (++index < length) {
	        array[index] = source[index];
	      }
	      return array;
	    }
	
	    /**
	     * A specialized version of `_.forEach` for arrays without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns `array`.
	     */
	    function arrayEach(array, iteratee) {
	      var index = -1,
	          length = array.length;
	
	      while (++index < length) {
	        if (iteratee(array[index], index, array) === false) {
	          break;
	        }
	      }
	      return array;
	    }
	
	    /**
	     * A specialized version of `_.forEachRight` for arrays without support for
	     * callback shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns `array`.
	     */
	    function arrayEachRight(array, iteratee) {
	      var length = array.length;
	
	      while (length--) {
	        if (iteratee(array[length], length, array) === false) {
	          break;
	        }
	      }
	      return array;
	    }
	
	    /**
	     * A specialized version of `_.every` for arrays without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {boolean} Returns `true` if all elements pass the predicate check,
	     *  else `false`.
	     */
	    function arrayEvery(array, predicate) {
	      var index = -1,
	          length = array.length;
	
	      while (++index < length) {
	        if (!predicate(array[index], index, array)) {
	          return false;
	        }
	      }
	      return true;
	    }
	
	    /**
	     * A specialized version of `baseExtremum` for arrays which invokes `iteratee`
	     * with one argument: (value).
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {Function} comparator The function used to compare values.
	     * @param {*} exValue The initial extremum value.
	     * @returns {*} Returns the extremum value.
	     */
	    function arrayExtremum(array, iteratee, comparator, exValue) {
	      var index = -1,
	          length = array.length,
	          computed = exValue,
	          result = computed;
	
	      while (++index < length) {
	        var value = array[index],
	            current = +iteratee(value);
	
	        if (comparator(current, computed)) {
	          computed = current;
	          result = value;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * A specialized version of `_.filter` for arrays without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {Array} Returns the new filtered array.
	     */
	    function arrayFilter(array, predicate) {
	      var index = -1,
	          length = array.length,
	          resIndex = -1,
	          result = [];
	
	      while (++index < length) {
	        var value = array[index];
	        if (predicate(value, index, array)) {
	          result[++resIndex] = value;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * A specialized version of `_.map` for arrays without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns the new mapped array.
	     */
	    function arrayMap(array, iteratee) {
	      var index = -1,
	          length = array.length,
	          result = Array(length);
	
	      while (++index < length) {
	        result[index] = iteratee(array[index], index, array);
	      }
	      return result;
	    }
	
	    /**
	     * Appends the elements of `values` to `array`.
	     *
	     * @private
	     * @param {Array} array The array to modify.
	     * @param {Array} values The values to append.
	     * @returns {Array} Returns `array`.
	     */
	    function arrayPush(array, values) {
	      var index = -1,
	          length = values.length,
	          offset = array.length;
	
	      while (++index < length) {
	        array[offset + index] = values[index];
	      }
	      return array;
	    }
	
	    /**
	     * A specialized version of `_.reduce` for arrays without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {*} [accumulator] The initial value.
	     * @param {boolean} [initFromArray] Specify using the first element of `array`
	     *  as the initial value.
	     * @returns {*} Returns the accumulated value.
	     */
	    function arrayReduce(array, iteratee, accumulator, initFromArray) {
	      var index = -1,
	          length = array.length;
	
	      if (initFromArray && length) {
	        accumulator = array[++index];
	      }
	      while (++index < length) {
	        accumulator = iteratee(accumulator, array[index], index, array);
	      }
	      return accumulator;
	    }
	
	    /**
	     * A specialized version of `_.reduceRight` for arrays without support for
	     * callback shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {*} [accumulator] The initial value.
	     * @param {boolean} [initFromArray] Specify using the last element of `array`
	     *  as the initial value.
	     * @returns {*} Returns the accumulated value.
	     */
	    function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
	      var length = array.length;
	      if (initFromArray && length) {
	        accumulator = array[--length];
	      }
	      while (length--) {
	        accumulator = iteratee(accumulator, array[length], length, array);
	      }
	      return accumulator;
	    }
	
	    /**
	     * A specialized version of `_.some` for arrays without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {boolean} Returns `true` if any element passes the predicate check,
	     *  else `false`.
	     */
	    function arraySome(array, predicate) {
	      var index = -1,
	          length = array.length;
	
	      while (++index < length) {
	        if (predicate(array[index], index, array)) {
	          return true;
	        }
	      }
	      return false;
	    }
	
	    /**
	     * A specialized version of `_.sum` for arrays without support for callback
	     * shorthands and `this` binding..
	     *
	     * @private
	     * @param {Array} array The array to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {number} Returns the sum.
	     */
	    function arraySum(array, iteratee) {
	      var length = array.length,
	          result = 0;
	
	      while (length--) {
	        result += +iteratee(array[length]) || 0;
	      }
	      return result;
	    }
	
	    /**
	     * Used by `_.defaults` to customize its `_.assign` use.
	     *
	     * @private
	     * @param {*} objectValue The destination object property value.
	     * @param {*} sourceValue The source object property value.
	     * @returns {*} Returns the value to assign to the destination object.
	     */
	    function assignDefaults(objectValue, sourceValue) {
	      return objectValue === undefined ? sourceValue : objectValue;
	    }
	
	    /**
	     * Used by `_.template` to customize its `_.assign` use.
	     *
	     * **Note:** This function is like `assignDefaults` except that it ignores
	     * inherited property values when checking if a property is `undefined`.
	     *
	     * @private
	     * @param {*} objectValue The destination object property value.
	     * @param {*} sourceValue The source object property value.
	     * @param {string} key The key associated with the object and source values.
	     * @param {Object} object The destination object.
	     * @returns {*} Returns the value to assign to the destination object.
	     */
	    function assignOwnDefaults(objectValue, sourceValue, key, object) {
	      return (objectValue === undefined || !hasOwnProperty.call(object, key))
	        ? sourceValue
	        : objectValue;
	    }
	
	    /**
	     * A specialized version of `_.assign` for customizing assigned values without
	     * support for argument juggling, multiple sources, and `this` binding `customizer`
	     * functions.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @param {Function} customizer The function to customize assigned values.
	     * @returns {Object} Returns `object`.
	     */
	    function assignWith(object, source, customizer) {
	      var index = -1,
	          props = keys(source),
	          length = props.length;
	
	      while (++index < length) {
	        var key = props[index],
	            value = object[key],
	            result = customizer(value, source[key], key, object, source);
	
	        if ((result === result ? (result !== value) : (value === value)) ||
	            (value === undefined && !(key in object))) {
	          object[key] = result;
	        }
	      }
	      return object;
	    }
	
	    /**
	     * The base implementation of `_.assign` without support for argument juggling,
	     * multiple sources, and `customizer` functions.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @returns {Object} Returns `object`.
	     */
	    function baseAssign(object, source) {
	      return source == null
	        ? object
	        : baseCopy(source, keys(source), object);
	    }
	
	    /**
	     * The base implementation of `_.at` without support for string collections
	     * and individual key arguments.
	     *
	     * @private
	     * @param {Array|Object} collection The collection to iterate over.
	     * @param {number[]|string[]} props The property names or indexes of elements to pick.
	     * @returns {Array} Returns the new array of picked elements.
	     */
	    function baseAt(collection, props) {
	      var index = -1,
	          isNil = collection == null,
	          isArr = !isNil && isArrayLike(collection),
	          length = isArr ? collection.length : 0,
	          propsLength = props.length,
	          result = Array(propsLength);
	
	      while(++index < propsLength) {
	        var key = props[index];
	        if (isArr) {
	          result[index] = isIndex(key, length) ? collection[key] : undefined;
	        } else {
	          result[index] = isNil ? undefined : collection[key];
	        }
	      }
	      return result;
	    }
	
	    /**
	     * Copies properties of `source` to `object`.
	     *
	     * @private
	     * @param {Object} source The object to copy properties from.
	     * @param {Array} props The property names to copy.
	     * @param {Object} [object={}] The object to copy properties to.
	     * @returns {Object} Returns `object`.
	     */
	    function baseCopy(source, props, object) {
	      object || (object = {});
	
	      var index = -1,
	          length = props.length;
	
	      while (++index < length) {
	        var key = props[index];
	        object[key] = source[key];
	      }
	      return object;
	    }
	
	    /**
	     * The base implementation of `_.callback` which supports specifying the
	     * number of arguments to provide to `func`.
	     *
	     * @private
	     * @param {*} [func=_.identity] The value to convert to a callback.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {number} [argCount] The number of arguments to provide to `func`.
	     * @returns {Function} Returns the callback.
	     */
	    function baseCallback(func, thisArg, argCount) {
	      var type = typeof func;
	      if (type == 'function') {
	        return thisArg === undefined
	          ? func
	          : bindCallback(func, thisArg, argCount);
	      }
	      if (func == null) {
	        return identity;
	      }
	      if (type == 'object') {
	        return baseMatches(func);
	      }
	      return thisArg === undefined
	        ? property(func)
	        : baseMatchesProperty(func, thisArg);
	    }
	
	    /**
	     * The base implementation of `_.clone` without support for argument juggling
	     * and `this` binding `customizer` functions.
	     *
	     * @private
	     * @param {*} value The value to clone.
	     * @param {boolean} [isDeep] Specify a deep clone.
	     * @param {Function} [customizer] The function to customize cloning values.
	     * @param {string} [key] The key of `value`.
	     * @param {Object} [object] The object `value` belongs to.
	     * @param {Array} [stackA=[]] Tracks traversed source objects.
	     * @param {Array} [stackB=[]] Associates clones with source counterparts.
	     * @returns {*} Returns the cloned value.
	     */
	    function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
	      var result;
	      if (customizer) {
	        result = object ? customizer(value, key, object) : customizer(value);
	      }
	      if (result !== undefined) {
	        return result;
	      }
	      if (!isObject(value)) {
	        return value;
	      }
	      var isArr = isArray(value);
	      if (isArr) {
	        result = initCloneArray(value);
	        if (!isDeep) {
	          return arrayCopy(value, result);
	        }
	      } else {
	        var tag = objToString.call(value),
	            isFunc = tag == funcTag;
	
	        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
	          result = initCloneObject(isFunc ? {} : value);
	          if (!isDeep) {
	            return baseAssign(result, value);
	          }
	        } else {
	          return cloneableTags[tag]
	            ? initCloneByTag(value, tag, isDeep)
	            : (object ? value : {});
	        }
	      }
	      // Check for circular references and return its corresponding clone.
	      stackA || (stackA = []);
	      stackB || (stackB = []);
	
	      var length = stackA.length;
	      while (length--) {
	        if (stackA[length] == value) {
	          return stackB[length];
	        }
	      }
	      // Add the source value to the stack of traversed objects and associate it with its clone.
	      stackA.push(value);
	      stackB.push(result);
	
	      // Recursively populate clone (susceptible to call stack limits).
	      (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
	        result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
	      });
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.create` without support for assigning
	     * properties to the created object.
	     *
	     * @private
	     * @param {Object} prototype The object to inherit from.
	     * @returns {Object} Returns the new object.
	     */
	    var baseCreate = (function() {
	      function object() {}
	      return function(prototype) {
	        if (isObject(prototype)) {
	          object.prototype = prototype;
	          var result = new object;
	          object.prototype = undefined;
	        }
	        return result || {};
	      };
	    }());
	
	    /**
	     * The base implementation of `_.delay` and `_.defer` which accepts an index
	     * of where to slice the arguments to provide to `func`.
	     *
	     * @private
	     * @param {Function} func The function to delay.
	     * @param {number} wait The number of milliseconds to delay invocation.
	     * @param {Object} args The arguments provide to `func`.
	     * @returns {number} Returns the timer id.
	     */
	    function baseDelay(func, wait, args) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      return setTimeout(function() { func.apply(undefined, args); }, wait);
	    }
	
	    /**
	     * The base implementation of `_.difference` which accepts a single array
	     * of values to exclude.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {Array} values The values to exclude.
	     * @returns {Array} Returns the new array of filtered values.
	     */
	    function baseDifference(array, values) {
	      var length = array ? array.length : 0,
	          result = [];
	
	      if (!length) {
	        return result;
	      }
	      var index = -1,
	          indexOf = getIndexOf(),
	          isCommon = indexOf == baseIndexOf,
	          cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
	          valuesLength = values.length;
	
	      if (cache) {
	        indexOf = cacheIndexOf;
	        isCommon = false;
	        values = cache;
	      }
	      outer:
	      while (++index < length) {
	        var value = array[index];
	
	        if (isCommon && value === value) {
	          var valuesIndex = valuesLength;
	          while (valuesIndex--) {
	            if (values[valuesIndex] === value) {
	              continue outer;
	            }
	          }
	          result.push(value);
	        }
	        else if (indexOf(values, value, 0) < 0) {
	          result.push(value);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.forEach` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array|Object|string} Returns `collection`.
	     */
	    var baseEach = createBaseEach(baseForOwn);
	
	    /**
	     * The base implementation of `_.forEachRight` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array|Object|string} Returns `collection`.
	     */
	    var baseEachRight = createBaseEach(baseForOwnRight, true);
	
	    /**
	     * The base implementation of `_.every` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {boolean} Returns `true` if all elements pass the predicate check,
	     *  else `false`
	     */
	    function baseEvery(collection, predicate) {
	      var result = true;
	      baseEach(collection, function(value, index, collection) {
	        result = !!predicate(value, index, collection);
	        return result;
	      });
	      return result;
	    }
	
	    /**
	     * Gets the extremum value of `collection` invoking `iteratee` for each value
	     * in `collection` to generate the criterion by which the value is ranked.
	     * The `iteratee` is invoked with three arguments: (value, index|key, collection).
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {Function} comparator The function used to compare values.
	     * @param {*} exValue The initial extremum value.
	     * @returns {*} Returns the extremum value.
	     */
	    function baseExtremum(collection, iteratee, comparator, exValue) {
	      var computed = exValue,
	          result = computed;
	
	      baseEach(collection, function(value, index, collection) {
	        var current = +iteratee(value, index, collection);
	        if (comparator(current, computed) || (current === exValue && current === result)) {
	          computed = current;
	          result = value;
	        }
	      });
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.fill` without an iteratee call guard.
	     *
	     * @private
	     * @param {Array} array The array to fill.
	     * @param {*} value The value to fill `array` with.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns `array`.
	     */
	    function baseFill(array, value, start, end) {
	      var length = array.length;
	
	      start = start == null ? 0 : (+start || 0);
	      if (start < 0) {
	        start = -start > length ? 0 : (length + start);
	      }
	      end = (end === undefined || end > length) ? length : (+end || 0);
	      if (end < 0) {
	        end += length;
	      }
	      length = start > end ? 0 : (end >>> 0);
	      start >>>= 0;
	
	      while (start < length) {
	        array[start++] = value;
	      }
	      return array;
	    }
	
	    /**
	     * The base implementation of `_.filter` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {Array} Returns the new filtered array.
	     */
	    function baseFilter(collection, predicate) {
	      var result = [];
	      baseEach(collection, function(value, index, collection) {
	        if (predicate(value, index, collection)) {
	          result.push(value);
	        }
	      });
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
	     * without support for callback shorthands and `this` binding, which iterates
	     * over `collection` using the provided `eachFunc`.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to search.
	     * @param {Function} predicate The function invoked per iteration.
	     * @param {Function} eachFunc The function to iterate over `collection`.
	     * @param {boolean} [retKey] Specify returning the key of the found element
	     *  instead of the element itself.
	     * @returns {*} Returns the found element or its key, else `undefined`.
	     */
	    function baseFind(collection, predicate, eachFunc, retKey) {
	      var result;
	      eachFunc(collection, function(value, key, collection) {
	        if (predicate(value, key, collection)) {
	          result = retKey ? key : value;
	          return false;
	        }
	      });
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.flatten` with added support for restricting
	     * flattening and specifying the start index.
	     *
	     * @private
	     * @param {Array} array The array to flatten.
	     * @param {boolean} [isDeep] Specify a deep flatten.
	     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
	     * @param {Array} [result=[]] The initial result value.
	     * @returns {Array} Returns the new flattened array.
	     */
	    function baseFlatten(array, isDeep, isStrict, result) {
	      result || (result = []);
	
	      var index = -1,
	          length = array.length;
	
	      while (++index < length) {
	        var value = array[index];
	        if (isObjectLike(value) && isArrayLike(value) &&
	            (isStrict || isArray(value) || isArguments(value))) {
	          if (isDeep) {
	            // Recursively flatten arrays (susceptible to call stack limits).
	            baseFlatten(value, isDeep, isStrict, result);
	          } else {
	            arrayPush(result, value);
	          }
	        } else if (!isStrict) {
	          result[result.length] = value;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `baseForIn` and `baseForOwn` which iterates
	     * over `object` properties returned by `keysFunc` invoking `iteratee` for
	     * each property. Iteratee functions may exit iteration early by explicitly
	     * returning `false`.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {Function} keysFunc The function to get the keys of `object`.
	     * @returns {Object} Returns `object`.
	     */
	    var baseFor = createBaseFor();
	
	    /**
	     * This function is like `baseFor` except that it iterates over properties
	     * in the opposite order.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {Function} keysFunc The function to get the keys of `object`.
	     * @returns {Object} Returns `object`.
	     */
	    var baseForRight = createBaseFor(true);
	
	    /**
	     * The base implementation of `_.forIn` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     */
	    function baseForIn(object, iteratee) {
	      return baseFor(object, iteratee, keysIn);
	    }
	
	    /**
	     * The base implementation of `_.forOwn` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     */
	    function baseForOwn(object, iteratee) {
	      return baseFor(object, iteratee, keys);
	    }
	
	    /**
	     * The base implementation of `_.forOwnRight` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Object} object The object to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Object} Returns `object`.
	     */
	    function baseForOwnRight(object, iteratee) {
	      return baseForRight(object, iteratee, keys);
	    }
	
	    /**
	     * The base implementation of `_.functions` which creates an array of
	     * `object` function property names filtered from those provided.
	     *
	     * @private
	     * @param {Object} object The object to inspect.
	     * @param {Array} props The property names to filter.
	     * @returns {Array} Returns the new array of filtered property names.
	     */
	    function baseFunctions(object, props) {
	      var index = -1,
	          length = props.length,
	          resIndex = -1,
	          result = [];
	
	      while (++index < length) {
	        var key = props[index];
	        if (isFunction(object[key])) {
	          result[++resIndex] = key;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `get` without support for string paths
	     * and default values.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array} path The path of the property to get.
	     * @param {string} [pathKey] The key representation of path.
	     * @returns {*} Returns the resolved value.
	     */
	    function baseGet(object, path, pathKey) {
	      if (object == null) {
	        return;
	      }
	      if (pathKey !== undefined && pathKey in toObject(object)) {
	        path = [pathKey];
	      }
	      var index = 0,
	          length = path.length;
	
	      while (object != null && index < length) {
	        object = object[path[index++]];
	      }
	      return (index && index == length) ? object : undefined;
	    }
	
	    /**
	     * The base implementation of `_.isEqual` without support for `this` binding
	     * `customizer` functions.
	     *
	     * @private
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @param {Function} [customizer] The function to customize comparing values.
	     * @param {boolean} [isLoose] Specify performing partial comparisons.
	     * @param {Array} [stackA] Tracks traversed `value` objects.
	     * @param {Array} [stackB] Tracks traversed `other` objects.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     */
	    function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
	      if (value === other) {
	        return true;
	      }
	      if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	        return value !== value && other !== other;
	      }
	      return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
	    }
	
	    /**
	     * A specialized version of `baseIsEqual` for arrays and objects which performs
	     * deep comparisons and tracks traversed objects enabling objects with circular
	     * references to be compared.
	     *
	     * @private
	     * @param {Object} object The object to compare.
	     * @param {Object} other The other object to compare.
	     * @param {Function} equalFunc The function to determine equivalents of values.
	     * @param {Function} [customizer] The function to customize comparing objects.
	     * @param {boolean} [isLoose] Specify performing partial comparisons.
	     * @param {Array} [stackA=[]] Tracks traversed `value` objects.
	     * @param {Array} [stackB=[]] Tracks traversed `other` objects.
	     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	     */
	    function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	      var objIsArr = isArray(object),
	          othIsArr = isArray(other),
	          objTag = arrayTag,
	          othTag = arrayTag;
	
	      if (!objIsArr) {
	        objTag = objToString.call(object);
	        if (objTag == argsTag) {
	          objTag = objectTag;
	        } else if (objTag != objectTag) {
	          objIsArr = isTypedArray(object);
	        }
	      }
	      if (!othIsArr) {
	        othTag = objToString.call(other);
	        if (othTag == argsTag) {
	          othTag = objectTag;
	        } else if (othTag != objectTag) {
	          othIsArr = isTypedArray(other);
	        }
	      }
	      var objIsObj = objTag == objectTag,
	          othIsObj = othTag == objectTag,
	          isSameTag = objTag == othTag;
	
	      if (isSameTag && !(objIsArr || objIsObj)) {
	        return equalByTag(object, other, objTag);
	      }
	      if (!isLoose) {
	        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
	
	        if (objIsWrapped || othIsWrapped) {
	          return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
	        }
	      }
	      if (!isSameTag) {
	        return false;
	      }
	      // Assume cyclic values are equal.
	      // For more information on detecting circular references see https://es5.github.io/#JO.
	      stackA || (stackA = []);
	      stackB || (stackB = []);
	
	      var length = stackA.length;
	      while (length--) {
	        if (stackA[length] == object) {
	          return stackB[length] == other;
	        }
	      }
	      // Add `object` and `other` to the stack of traversed objects.
	      stackA.push(object);
	      stackB.push(other);
	
	      var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);
	
	      stackA.pop();
	      stackB.pop();
	
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.isMatch` without support for callback
	     * shorthands and `this` binding.
	     *
	     * @private
	     * @param {Object} object The object to inspect.
	     * @param {Array} matchData The propery names, values, and compare flags to match.
	     * @param {Function} [customizer] The function to customize comparing objects.
	     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	     */
	    function baseIsMatch(object, matchData, customizer) {
	      var index = matchData.length,
	          length = index,
	          noCustomizer = !customizer;
	
	      if (object == null) {
	        return !length;
	      }
	      object = toObject(object);
	      while (index--) {
	        var data = matchData[index];
	        if ((noCustomizer && data[2])
	              ? data[1] !== object[data[0]]
	              : !(data[0] in object)
	            ) {
	          return false;
	        }
	      }
	      while (++index < length) {
	        data = matchData[index];
	        var key = data[0],
	            objValue = object[key],
	            srcValue = data[1];
	
	        if (noCustomizer && data[2]) {
	          if (objValue === undefined && !(key in object)) {
	            return false;
	          }
	        } else {
	          var result = customizer ? customizer(objValue, srcValue, key) : undefined;
	          if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
	            return false;
	          }
	        }
	      }
	      return true;
	    }
	
	    /**
	     * The base implementation of `_.map` without support for callback shorthands
	     * and `this` binding.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {Array} Returns the new mapped array.
	     */
	    function baseMap(collection, iteratee) {
	      var index = -1,
	          result = isArrayLike(collection) ? Array(collection.length) : [];
	
	      baseEach(collection, function(value, key, collection) {
	        result[++index] = iteratee(value, key, collection);
	      });
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.matches` which does not clone `source`.
	     *
	     * @private
	     * @param {Object} source The object of property values to match.
	     * @returns {Function} Returns the new function.
	     */
	    function baseMatches(source) {
	      var matchData = getMatchData(source);
	      if (matchData.length == 1 && matchData[0][2]) {
	        var key = matchData[0][0],
	            value = matchData[0][1];
	
	        return function(object) {
	          if (object == null) {
	            return false;
	          }
	          return object[key] === value && (value !== undefined || (key in toObject(object)));
	        };
	      }
	      return function(object) {
	        return baseIsMatch(object, matchData);
	      };
	    }
	
	    /**
	     * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
	     *
	     * @private
	     * @param {string} path The path of the property to get.
	     * @param {*} srcValue The value to compare.
	     * @returns {Function} Returns the new function.
	     */
	    function baseMatchesProperty(path, srcValue) {
	      var isArr = isArray(path),
	          isCommon = isKey(path) && isStrictComparable(srcValue),
	          pathKey = (path + '');
	
	      path = toPath(path);
	      return function(object) {
	        if (object == null) {
	          return false;
	        }
	        var key = pathKey;
	        object = toObject(object);
	        if ((isArr || !isCommon) && !(key in object)) {
	          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
	          if (object == null) {
	            return false;
	          }
	          key = last(path);
	          object = toObject(object);
	        }
	        return object[key] === srcValue
	          ? (srcValue !== undefined || (key in object))
	          : baseIsEqual(srcValue, object[key], undefined, true);
	      };
	    }
	
	    /**
	     * The base implementation of `_.merge` without support for argument juggling,
	     * multiple sources, and `this` binding `customizer` functions.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @param {Function} [customizer] The function to customize merged values.
	     * @param {Array} [stackA=[]] Tracks traversed source objects.
	     * @param {Array} [stackB=[]] Associates values with source counterparts.
	     * @returns {Object} Returns `object`.
	     */
	    function baseMerge(object, source, customizer, stackA, stackB) {
	      if (!isObject(object)) {
	        return object;
	      }
	      var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
	          props = isSrcArr ? undefined : keys(source);
	
	      arrayEach(props || source, function(srcValue, key) {
	        if (props) {
	          key = srcValue;
	          srcValue = source[key];
	        }
	        if (isObjectLike(srcValue)) {
	          stackA || (stackA = []);
	          stackB || (stackB = []);
	          baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
	        }
	        else {
	          var value = object[key],
	              result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
	              isCommon = result === undefined;
	
	          if (isCommon) {
	            result = srcValue;
	          }
	          if ((result !== undefined || (isSrcArr && !(key in object))) &&
	              (isCommon || (result === result ? (result !== value) : (value === value)))) {
	            object[key] = result;
	          }
	        }
	      });
	      return object;
	    }
	
	    /**
	     * A specialized version of `baseMerge` for arrays and objects which performs
	     * deep merges and tracks traversed objects enabling objects with circular
	     * references to be merged.
	     *
	     * @private
	     * @param {Object} object The destination object.
	     * @param {Object} source The source object.
	     * @param {string} key The key of the value to merge.
	     * @param {Function} mergeFunc The function to merge values.
	     * @param {Function} [customizer] The function to customize merged values.
	     * @param {Array} [stackA=[]] Tracks traversed source objects.
	     * @param {Array} [stackB=[]] Associates values with source counterparts.
	     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	     */
	    function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
	      var length = stackA.length,
	          srcValue = source[key];
	
	      while (length--) {
	        if (stackA[length] == srcValue) {
	          object[key] = stackB[length];
	          return;
	        }
	      }
	      var value = object[key],
	          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
	          isCommon = result === undefined;
	
	      if (isCommon) {
	        result = srcValue;
	        if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
	          result = isArray(value)
	            ? value
	            : (isArrayLike(value) ? arrayCopy(value) : []);
	        }
	        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
	          result = isArguments(value)
	            ? toPlainObject(value)
	            : (isPlainObject(value) ? value : {});
	        }
	        else {
	          isCommon = false;
	        }
	      }
	      // Add the source value to the stack of traversed objects and associate
	      // it with its merged value.
	      stackA.push(srcValue);
	      stackB.push(result);
	
	      if (isCommon) {
	        // Recursively merge objects and arrays (susceptible to call stack limits).
	        object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
	      } else if (result === result ? (result !== value) : (value === value)) {
	        object[key] = result;
	      }
	    }
	
	    /**
	     * The base implementation of `_.property` without support for deep paths.
	     *
	     * @private
	     * @param {string} key The key of the property to get.
	     * @returns {Function} Returns the new function.
	     */
	    function baseProperty(key) {
	      return function(object) {
	        return object == null ? undefined : object[key];
	      };
	    }
	
	    /**
	     * A specialized version of `baseProperty` which supports deep paths.
	     *
	     * @private
	     * @param {Array|string} path The path of the property to get.
	     * @returns {Function} Returns the new function.
	     */
	    function basePropertyDeep(path) {
	      var pathKey = (path + '');
	      path = toPath(path);
	      return function(object) {
	        return baseGet(object, path, pathKey);
	      };
	    }
	
	    /**
	     * The base implementation of `_.pullAt` without support for individual
	     * index arguments and capturing the removed elements.
	     *
	     * @private
	     * @param {Array} array The array to modify.
	     * @param {number[]} indexes The indexes of elements to remove.
	     * @returns {Array} Returns `array`.
	     */
	    function basePullAt(array, indexes) {
	      var length = array ? indexes.length : 0;
	      while (length--) {
	        var index = indexes[length];
	        if (index != previous && isIndex(index)) {
	          var previous = index;
	          splice.call(array, index, 1);
	        }
	      }
	      return array;
	    }
	
	    /**
	     * The base implementation of `_.random` without support for argument juggling
	     * and returning floating-point numbers.
	     *
	     * @private
	     * @param {number} min The minimum possible value.
	     * @param {number} max The maximum possible value.
	     * @returns {number} Returns the random number.
	     */
	    function baseRandom(min, max) {
	      return min + nativeFloor(nativeRandom() * (max - min + 1));
	    }
	
	    /**
	     * The base implementation of `_.reduce` and `_.reduceRight` without support
	     * for callback shorthands and `this` binding, which iterates over `collection`
	     * using the provided `eachFunc`.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {*} accumulator The initial value.
	     * @param {boolean} initFromCollection Specify using the first or last element
	     *  of `collection` as the initial value.
	     * @param {Function} eachFunc The function to iterate over `collection`.
	     * @returns {*} Returns the accumulated value.
	     */
	    function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
	      eachFunc(collection, function(value, index, collection) {
	        accumulator = initFromCollection
	          ? (initFromCollection = false, value)
	          : iteratee(accumulator, value, index, collection);
	      });
	      return accumulator;
	    }
	
	    /**
	     * The base implementation of `setData` without support for hot loop detection.
	     *
	     * @private
	     * @param {Function} func The function to associate metadata with.
	     * @param {*} data The metadata.
	     * @returns {Function} Returns `func`.
	     */
	    var baseSetData = !metaMap ? identity : function(func, data) {
	      metaMap.set(func, data);
	      return func;
	    };
	
	    /**
	     * The base implementation of `_.slice` without an iteratee call guard.
	     *
	     * @private
	     * @param {Array} array The array to slice.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns the slice of `array`.
	     */
	    function baseSlice(array, start, end) {
	      var index = -1,
	          length = array.length;
	
	      start = start == null ? 0 : (+start || 0);
	      if (start < 0) {
	        start = -start > length ? 0 : (length + start);
	      }
	      end = (end === undefined || end > length) ? length : (+end || 0);
	      if (end < 0) {
	        end += length;
	      }
	      length = start > end ? 0 : ((end - start) >>> 0);
	      start >>>= 0;
	
	      var result = Array(length);
	      while (++index < length) {
	        result[index] = array[index + start];
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.some` without support for callback shorthands
	     * and `this` binding.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {boolean} Returns `true` if any element passes the predicate check,
	     *  else `false`.
	     */
	    function baseSome(collection, predicate) {
	      var result;
	
	      baseEach(collection, function(value, index, collection) {
	        result = predicate(value, index, collection);
	        return !result;
	      });
	      return !!result;
	    }
	
	    /**
	     * The base implementation of `_.sortBy` which uses `comparer` to define
	     * the sort order of `array` and replaces criteria objects with their
	     * corresponding values.
	     *
	     * @private
	     * @param {Array} array The array to sort.
	     * @param {Function} comparer The function to define sort order.
	     * @returns {Array} Returns `array`.
	     */
	    function baseSortBy(array, comparer) {
	      var length = array.length;
	
	      array.sort(comparer);
	      while (length--) {
	        array[length] = array[length].value;
	      }
	      return array;
	    }
	
	    /**
	     * The base implementation of `_.sortByOrder` without param guards.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
	     * @param {boolean[]} orders The sort orders of `iteratees`.
	     * @returns {Array} Returns the new sorted array.
	     */
	    function baseSortByOrder(collection, iteratees, orders) {
	      var callback = getCallback(),
	          index = -1;
	
	      iteratees = arrayMap(iteratees, function(iteratee) { return callback(iteratee); });
	
	      var result = baseMap(collection, function(value) {
	        var criteria = arrayMap(iteratees, function(iteratee) { return iteratee(value); });
	        return { 'criteria': criteria, 'index': ++index, 'value': value };
	      });
	
	      return baseSortBy(result, function(object, other) {
	        return compareMultiple(object, other, orders);
	      });
	    }
	
	    /**
	     * The base implementation of `_.sum` without support for callback shorthands
	     * and `this` binding.
	     *
	     * @private
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @returns {number} Returns the sum.
	     */
	    function baseSum(collection, iteratee) {
	      var result = 0;
	      baseEach(collection, function(value, index, collection) {
	        result += +iteratee(value, index, collection) || 0;
	      });
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.uniq` without support for callback shorthands
	     * and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to inspect.
	     * @param {Function} [iteratee] The function invoked per iteration.
	     * @returns {Array} Returns the new duplicate-value-free array.
	     */
	    function baseUniq(array, iteratee) {
	      var index = -1,
	          indexOf = getIndexOf(),
	          length = array.length,
	          isCommon = indexOf == baseIndexOf,
	          isLarge = isCommon && length >= LARGE_ARRAY_SIZE,
	          seen = isLarge ? createCache() : null,
	          result = [];
	
	      if (seen) {
	        indexOf = cacheIndexOf;
	        isCommon = false;
	      } else {
	        isLarge = false;
	        seen = iteratee ? [] : result;
	      }
	      outer:
	      while (++index < length) {
	        var value = array[index],
	            computed = iteratee ? iteratee(value, index, array) : value;
	
	        if (isCommon && value === value) {
	          var seenIndex = seen.length;
	          while (seenIndex--) {
	            if (seen[seenIndex] === computed) {
	              continue outer;
	            }
	          }
	          if (iteratee) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	        else if (indexOf(seen, computed, 0) < 0) {
	          if (iteratee || isLarge) {
	            seen.push(computed);
	          }
	          result.push(value);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.values` and `_.valuesIn` which creates an
	     * array of `object` property values corresponding to the property names
	     * of `props`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array} props The property names to get values for.
	     * @returns {Object} Returns the array of property values.
	     */
	    function baseValues(object, props) {
	      var index = -1,
	          length = props.length,
	          result = Array(length);
	
	      while (++index < length) {
	        result[index] = object[props[index]];
	      }
	      return result;
	    }
	
	    /**
	     * The base implementation of `_.dropRightWhile`, `_.dropWhile`, `_.takeRightWhile`,
	     * and `_.takeWhile` without support for callback shorthands and `this` binding.
	     *
	     * @private
	     * @param {Array} array The array to query.
	     * @param {Function} predicate The function invoked per iteration.
	     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Array} Returns the slice of `array`.
	     */
	    function baseWhile(array, predicate, isDrop, fromRight) {
	      var length = array.length,
	          index = fromRight ? length : -1;
	
	      while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}
	      return isDrop
	        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
	        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
	    }
	
	    /**
	     * The base implementation of `wrapperValue` which returns the result of
	     * performing a sequence of actions on the unwrapped `value`, where each
	     * successive action is supplied the return value of the previous.
	     *
	     * @private
	     * @param {*} value The unwrapped value.
	     * @param {Array} actions Actions to peform to resolve the unwrapped value.
	     * @returns {*} Returns the resolved value.
	     */
	    function baseWrapperValue(value, actions) {
	      var result = value;
	      if (result instanceof LazyWrapper) {
	        result = result.value();
	      }
	      var index = -1,
	          length = actions.length;
	
	      while (++index < length) {
	        var action = actions[index];
	        result = action.func.apply(action.thisArg, arrayPush([result], action.args));
	      }
	      return result;
	    }
	
	    /**
	     * Performs a binary search of `array` to determine the index at which `value`
	     * should be inserted into `array` in order to maintain its sort order.
	     *
	     * @private
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {boolean} [retHighest] Specify returning the highest qualified index.
	     * @returns {number} Returns the index at which `value` should be inserted
	     *  into `array`.
	     */
	    function binaryIndex(array, value, retHighest) {
	      var low = 0,
	          high = array ? array.length : low;
	
	      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
	        while (low < high) {
	          var mid = (low + high) >>> 1,
	              computed = array[mid];
	
	          if ((retHighest ? (computed <= value) : (computed < value)) && computed !== null) {
	            low = mid + 1;
	          } else {
	            high = mid;
	          }
	        }
	        return high;
	      }
	      return binaryIndexBy(array, value, identity, retHighest);
	    }
	
	    /**
	     * This function is like `binaryIndex` except that it invokes `iteratee` for
	     * `value` and each element of `array` to compute their sort ranking. The
	     * iteratee is invoked with one argument; (value).
	     *
	     * @private
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function} iteratee The function invoked per iteration.
	     * @param {boolean} [retHighest] Specify returning the highest qualified index.
	     * @returns {number} Returns the index at which `value` should be inserted
	     *  into `array`.
	     */
	    function binaryIndexBy(array, value, iteratee, retHighest) {
	      value = iteratee(value);
	
	      var low = 0,
	          high = array ? array.length : 0,
	          valIsNaN = value !== value,
	          valIsNull = value === null,
	          valIsUndef = value === undefined;
	
	      while (low < high) {
	        var mid = nativeFloor((low + high) / 2),
	            computed = iteratee(array[mid]),
	            isDef = computed !== undefined,
	            isReflexive = computed === computed;
	
	        if (valIsNaN) {
	          var setLow = isReflexive || retHighest;
	        } else if (valIsNull) {
	          setLow = isReflexive && isDef && (retHighest || computed != null);
	        } else if (valIsUndef) {
	          setLow = isReflexive && (retHighest || isDef);
	        } else if (computed == null) {
	          setLow = false;
	        } else {
	          setLow = retHighest ? (computed <= value) : (computed < value);
	        }
	        if (setLow) {
	          low = mid + 1;
	        } else {
	          high = mid;
	        }
	      }
	      return nativeMin(high, MAX_ARRAY_INDEX);
	    }
	
	    /**
	     * A specialized version of `baseCallback` which only supports `this` binding
	     * and specifying the number of arguments to provide to `func`.
	     *
	     * @private
	     * @param {Function} func The function to bind.
	     * @param {*} thisArg The `this` binding of `func`.
	     * @param {number} [argCount] The number of arguments to provide to `func`.
	     * @returns {Function} Returns the callback.
	     */
	    function bindCallback(func, thisArg, argCount) {
	      if (typeof func != 'function') {
	        return identity;
	      }
	      if (thisArg === undefined) {
	        return func;
	      }
	      switch (argCount) {
	        case 1: return function(value) {
	          return func.call(thisArg, value);
	        };
	        case 3: return function(value, index, collection) {
	          return func.call(thisArg, value, index, collection);
	        };
	        case 4: return function(accumulator, value, index, collection) {
	          return func.call(thisArg, accumulator, value, index, collection);
	        };
	        case 5: return function(value, other, key, object, source) {
	          return func.call(thisArg, value, other, key, object, source);
	        };
	      }
	      return function() {
	        return func.apply(thisArg, arguments);
	      };
	    }
	
	    /**
	     * Creates a clone of the given array buffer.
	     *
	     * @private
	     * @param {ArrayBuffer} buffer The array buffer to clone.
	     * @returns {ArrayBuffer} Returns the cloned array buffer.
	     */
	    function bufferClone(buffer) {
	      var result = new ArrayBuffer(buffer.byteLength),
	          view = new Uint8Array(result);
	
	      view.set(new Uint8Array(buffer));
	      return result;
	    }
	
	    /**
	     * Creates an array that is the composition of partially applied arguments,
	     * placeholders, and provided arguments into a single array of arguments.
	     *
	     * @private
	     * @param {Array|Object} args The provided arguments.
	     * @param {Array} partials The arguments to prepend to those provided.
	     * @param {Array} holders The `partials` placeholder indexes.
	     * @returns {Array} Returns the new array of composed arguments.
	     */
	    function composeArgs(args, partials, holders) {
	      var holdersLength = holders.length,
	          argsIndex = -1,
	          argsLength = nativeMax(args.length - holdersLength, 0),
	          leftIndex = -1,
	          leftLength = partials.length,
	          result = Array(leftLength + argsLength);
	
	      while (++leftIndex < leftLength) {
	        result[leftIndex] = partials[leftIndex];
	      }
	      while (++argsIndex < holdersLength) {
	        result[holders[argsIndex]] = args[argsIndex];
	      }
	      while (argsLength--) {
	        result[leftIndex++] = args[argsIndex++];
	      }
	      return result;
	    }
	
	    /**
	     * This function is like `composeArgs` except that the arguments composition
	     * is tailored for `_.partialRight`.
	     *
	     * @private
	     * @param {Array|Object} args The provided arguments.
	     * @param {Array} partials The arguments to append to those provided.
	     * @param {Array} holders The `partials` placeholder indexes.
	     * @returns {Array} Returns the new array of composed arguments.
	     */
	    function composeArgsRight(args, partials, holders) {
	      var holdersIndex = -1,
	          holdersLength = holders.length,
	          argsIndex = -1,
	          argsLength = nativeMax(args.length - holdersLength, 0),
	          rightIndex = -1,
	          rightLength = partials.length,
	          result = Array(argsLength + rightLength);
	
	      while (++argsIndex < argsLength) {
	        result[argsIndex] = args[argsIndex];
	      }
	      var offset = argsIndex;
	      while (++rightIndex < rightLength) {
	        result[offset + rightIndex] = partials[rightIndex];
	      }
	      while (++holdersIndex < holdersLength) {
	        result[offset + holders[holdersIndex]] = args[argsIndex++];
	      }
	      return result;
	    }
	
	    /**
	     * Creates a `_.countBy`, `_.groupBy`, `_.indexBy`, or `_.partition` function.
	     *
	     * @private
	     * @param {Function} setter The function to set keys and values of the accumulator object.
	     * @param {Function} [initializer] The function to initialize the accumulator object.
	     * @returns {Function} Returns the new aggregator function.
	     */
	    function createAggregator(setter, initializer) {
	      return function(collection, iteratee, thisArg) {
	        var result = initializer ? initializer() : {};
	        iteratee = getCallback(iteratee, thisArg, 3);
	
	        if (isArray(collection)) {
	          var index = -1,
	              length = collection.length;
	
	          while (++index < length) {
	            var value = collection[index];
	            setter(result, value, iteratee(value, index, collection), collection);
	          }
	        } else {
	          baseEach(collection, function(value, key, collection) {
	            setter(result, value, iteratee(value, key, collection), collection);
	          });
	        }
	        return result;
	      };
	    }
	
	    /**
	     * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
	     *
	     * @private
	     * @param {Function} assigner The function to assign values.
	     * @returns {Function} Returns the new assigner function.
	     */
	    function createAssigner(assigner) {
	      return restParam(function(object, sources) {
	        var index = -1,
	            length = object == null ? 0 : sources.length,
	            customizer = length > 2 ? sources[length - 2] : undefined,
	            guard = length > 2 ? sources[2] : undefined,
	            thisArg = length > 1 ? sources[length - 1] : undefined;
	
	        if (typeof customizer == 'function') {
	          customizer = bindCallback(customizer, thisArg, 5);
	          length -= 2;
	        } else {
	          customizer = typeof thisArg == 'function' ? thisArg : undefined;
	          length -= (customizer ? 1 : 0);
	        }
	        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	          customizer = length < 3 ? undefined : customizer;
	          length = 1;
	        }
	        while (++index < length) {
	          var source = sources[index];
	          if (source) {
	            assigner(object, source, customizer);
	          }
	        }
	        return object;
	      });
	    }
	
	    /**
	     * Creates a `baseEach` or `baseEachRight` function.
	     *
	     * @private
	     * @param {Function} eachFunc The function to iterate over a collection.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new base function.
	     */
	    function createBaseEach(eachFunc, fromRight) {
	      return function(collection, iteratee) {
	        var length = collection ? getLength(collection) : 0;
	        if (!isLength(length)) {
	          return eachFunc(collection, iteratee);
	        }
	        var index = fromRight ? length : -1,
	            iterable = toObject(collection);
	
	        while ((fromRight ? index-- : ++index < length)) {
	          if (iteratee(iterable[index], index, iterable) === false) {
	            break;
	          }
	        }
	        return collection;
	      };
	    }
	
	    /**
	     * Creates a base function for `_.forIn` or `_.forInRight`.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new base function.
	     */
	    function createBaseFor(fromRight) {
	      return function(object, iteratee, keysFunc) {
	        var iterable = toObject(object),
	            props = keysFunc(object),
	            length = props.length,
	            index = fromRight ? length : -1;
	
	        while ((fromRight ? index-- : ++index < length)) {
	          var key = props[index];
	          if (iteratee(iterable[key], key, iterable) === false) {
	            break;
	          }
	        }
	        return object;
	      };
	    }
	
	    /**
	     * Creates a function that wraps `func` and invokes it with the `this`
	     * binding of `thisArg`.
	     *
	     * @private
	     * @param {Function} func The function to bind.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @returns {Function} Returns the new bound function.
	     */
	    function createBindWrapper(func, thisArg) {
	      var Ctor = createCtorWrapper(func);
	
	      function wrapper() {
	        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
	        return fn.apply(thisArg, arguments);
	      }
	      return wrapper;
	    }
	
	    /**
	     * Creates a `Set` cache object to optimize linear searches of large arrays.
	     *
	     * @private
	     * @param {Array} [values] The values to cache.
	     * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
	     */
	    function createCache(values) {
	      return (nativeCreate && Set) ? new SetCache(values) : null;
	    }
	
	    /**
	     * Creates a function that produces compound words out of the words in a
	     * given string.
	     *
	     * @private
	     * @param {Function} callback The function to combine each word.
	     * @returns {Function} Returns the new compounder function.
	     */
	    function createCompounder(callback) {
	      return function(string) {
	        var index = -1,
	            array = words(deburr(string)),
	            length = array.length,
	            result = '';
	
	        while (++index < length) {
	          result = callback(result, array[index], index);
	        }
	        return result;
	      };
	    }
	
	    /**
	     * Creates a function that produces an instance of `Ctor` regardless of
	     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
	     *
	     * @private
	     * @param {Function} Ctor The constructor to wrap.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createCtorWrapper(Ctor) {
	      return function() {
	        // Use a `switch` statement to work with class constructors.
	        // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
	        // for more details.
	        var args = arguments;
	        switch (args.length) {
	          case 0: return new Ctor;
	          case 1: return new Ctor(args[0]);
	          case 2: return new Ctor(args[0], args[1]);
	          case 3: return new Ctor(args[0], args[1], args[2]);
	          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
	          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
	          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
	          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
	        }
	        var thisBinding = baseCreate(Ctor.prototype),
	            result = Ctor.apply(thisBinding, args);
	
	        // Mimic the constructor's `return` behavior.
	        // See https://es5.github.io/#x13.2.2 for more details.
	        return isObject(result) ? result : thisBinding;
	      };
	    }
	
	    /**
	     * Creates a `_.curry` or `_.curryRight` function.
	     *
	     * @private
	     * @param {boolean} flag The curry bit flag.
	     * @returns {Function} Returns the new curry function.
	     */
	    function createCurry(flag) {
	      function curryFunc(func, arity, guard) {
	        if (guard && isIterateeCall(func, arity, guard)) {
	          arity = undefined;
	        }
	        var result = createWrapper(func, flag, undefined, undefined, undefined, undefined, undefined, arity);
	        result.placeholder = curryFunc.placeholder;
	        return result;
	      }
	      return curryFunc;
	    }
	
	    /**
	     * Creates a `_.defaults` or `_.defaultsDeep` function.
	     *
	     * @private
	     * @param {Function} assigner The function to assign values.
	     * @param {Function} customizer The function to customize assigned values.
	     * @returns {Function} Returns the new defaults function.
	     */
	    function createDefaults(assigner, customizer) {
	      return restParam(function(args) {
	        var object = args[0];
	        if (object == null) {
	          return object;
	        }
	        args.push(customizer);
	        return assigner.apply(undefined, args);
	      });
	    }
	
	    /**
	     * Creates a `_.max` or `_.min` function.
	     *
	     * @private
	     * @param {Function} comparator The function used to compare values.
	     * @param {*} exValue The initial extremum value.
	     * @returns {Function} Returns the new extremum function.
	     */
	    function createExtremum(comparator, exValue) {
	      return function(collection, iteratee, thisArg) {
	        if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
	          iteratee = undefined;
	        }
	        iteratee = getCallback(iteratee, thisArg, 3);
	        if (iteratee.length == 1) {
	          collection = isArray(collection) ? collection : toIterable(collection);
	          var result = arrayExtremum(collection, iteratee, comparator, exValue);
	          if (!(collection.length && result === exValue)) {
	            return result;
	          }
	        }
	        return baseExtremum(collection, iteratee, comparator, exValue);
	      };
	    }
	
	    /**
	     * Creates a `_.find` or `_.findLast` function.
	     *
	     * @private
	     * @param {Function} eachFunc The function to iterate over a collection.
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new find function.
	     */
	    function createFind(eachFunc, fromRight) {
	      return function(collection, predicate, thisArg) {
	        predicate = getCallback(predicate, thisArg, 3);
	        if (isArray(collection)) {
	          var index = baseFindIndex(collection, predicate, fromRight);
	          return index > -1 ? collection[index] : undefined;
	        }
	        return baseFind(collection, predicate, eachFunc);
	      };
	    }
	
	    /**
	     * Creates a `_.findIndex` or `_.findLastIndex` function.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new find function.
	     */
	    function createFindIndex(fromRight) {
	      return function(array, predicate, thisArg) {
	        if (!(array && array.length)) {
	          return -1;
	        }
	        predicate = getCallback(predicate, thisArg, 3);
	        return baseFindIndex(array, predicate, fromRight);
	      };
	    }
	
	    /**
	     * Creates a `_.findKey` or `_.findLastKey` function.
	     *
	     * @private
	     * @param {Function} objectFunc The function to iterate over an object.
	     * @returns {Function} Returns the new find function.
	     */
	    function createFindKey(objectFunc) {
	      return function(object, predicate, thisArg) {
	        predicate = getCallback(predicate, thisArg, 3);
	        return baseFind(object, predicate, objectFunc, true);
	      };
	    }
	
	    /**
	     * Creates a `_.flow` or `_.flowRight` function.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify iterating from right to left.
	     * @returns {Function} Returns the new flow function.
	     */
	    function createFlow(fromRight) {
	      return function() {
	        var wrapper,
	            length = arguments.length,
	            index = fromRight ? length : -1,
	            leftIndex = 0,
	            funcs = Array(length);
	
	        while ((fromRight ? index-- : ++index < length)) {
	          var func = funcs[leftIndex++] = arguments[index];
	          if (typeof func != 'function') {
	            throw new TypeError(FUNC_ERROR_TEXT);
	          }
	          if (!wrapper && LodashWrapper.prototype.thru && getFuncName(func) == 'wrapper') {
	            wrapper = new LodashWrapper([], true);
	          }
	        }
	        index = wrapper ? -1 : length;
	        while (++index < length) {
	          func = funcs[index];
	
	          var funcName = getFuncName(func),
	              data = funcName == 'wrapper' ? getData(func) : undefined;
	
	          if (data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && data[9] == 1) {
	            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
	          } else {
	            wrapper = (func.length == 1 && isLaziable(func)) ? wrapper[funcName]() : wrapper.thru(func);
	          }
	        }
	        return function() {
	          var args = arguments,
	              value = args[0];
	
	          if (wrapper && args.length == 1 && isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
	            return wrapper.plant(value).value();
	          }
	          var index = 0,
	              result = length ? funcs[index].apply(this, args) : value;
	
	          while (++index < length) {
	            result = funcs[index].call(this, result);
	          }
	          return result;
	        };
	      };
	    }
	
	    /**
	     * Creates a function for `_.forEach` or `_.forEachRight`.
	     *
	     * @private
	     * @param {Function} arrayFunc The function to iterate over an array.
	     * @param {Function} eachFunc The function to iterate over a collection.
	     * @returns {Function} Returns the new each function.
	     */
	    function createForEach(arrayFunc, eachFunc) {
	      return function(collection, iteratee, thisArg) {
	        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
	          ? arrayFunc(collection, iteratee)
	          : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
	      };
	    }
	
	    /**
	     * Creates a function for `_.forIn` or `_.forInRight`.
	     *
	     * @private
	     * @param {Function} objectFunc The function to iterate over an object.
	     * @returns {Function} Returns the new each function.
	     */
	    function createForIn(objectFunc) {
	      return function(object, iteratee, thisArg) {
	        if (typeof iteratee != 'function' || thisArg !== undefined) {
	          iteratee = bindCallback(iteratee, thisArg, 3);
	        }
	        return objectFunc(object, iteratee, keysIn);
	      };
	    }
	
	    /**
	     * Creates a function for `_.forOwn` or `_.forOwnRight`.
	     *
	     * @private
	     * @param {Function} objectFunc The function to iterate over an object.
	     * @returns {Function} Returns the new each function.
	     */
	    function createForOwn(objectFunc) {
	      return function(object, iteratee, thisArg) {
	        if (typeof iteratee != 'function' || thisArg !== undefined) {
	          iteratee = bindCallback(iteratee, thisArg, 3);
	        }
	        return objectFunc(object, iteratee);
	      };
	    }
	
	    /**
	     * Creates a function for `_.mapKeys` or `_.mapValues`.
	     *
	     * @private
	     * @param {boolean} [isMapKeys] Specify mapping keys instead of values.
	     * @returns {Function} Returns the new map function.
	     */
	    function createObjectMapper(isMapKeys) {
	      return function(object, iteratee, thisArg) {
	        var result = {};
	        iteratee = getCallback(iteratee, thisArg, 3);
	
	        baseForOwn(object, function(value, key, object) {
	          var mapped = iteratee(value, key, object);
	          key = isMapKeys ? mapped : key;
	          value = isMapKeys ? value : mapped;
	          result[key] = value;
	        });
	        return result;
	      };
	    }
	
	    /**
	     * Creates a function for `_.padLeft` or `_.padRight`.
	     *
	     * @private
	     * @param {boolean} [fromRight] Specify padding from the right.
	     * @returns {Function} Returns the new pad function.
	     */
	    function createPadDir(fromRight) {
	      return function(string, length, chars) {
	        string = baseToString(string);
	        return (fromRight ? string : '') + createPadding(string, length, chars) + (fromRight ? '' : string);
	      };
	    }
	
	    /**
	     * Creates a `_.partial` or `_.partialRight` function.
	     *
	     * @private
	     * @param {boolean} flag The partial bit flag.
	     * @returns {Function} Returns the new partial function.
	     */
	    function createPartial(flag) {
	      var partialFunc = restParam(function(func, partials) {
	        var holders = replaceHolders(partials, partialFunc.placeholder);
	        return createWrapper(func, flag, undefined, partials, holders);
	      });
	      return partialFunc;
	    }
	
	    /**
	     * Creates a function for `_.reduce` or `_.reduceRight`.
	     *
	     * @private
	     * @param {Function} arrayFunc The function to iterate over an array.
	     * @param {Function} eachFunc The function to iterate over a collection.
	     * @returns {Function} Returns the new each function.
	     */
	    function createReduce(arrayFunc, eachFunc) {
	      return function(collection, iteratee, accumulator, thisArg) {
	        var initFromArray = arguments.length < 3;
	        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
	          ? arrayFunc(collection, iteratee, accumulator, initFromArray)
	          : baseReduce(collection, getCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
	      };
	    }
	
	    /**
	     * Creates a function that wraps `func` and invokes it with optional `this`
	     * binding of, partial application, and currying.
	     *
	     * @private
	     * @param {Function|string} func The function or method name to reference.
	     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
	     * @param {Array} [holders] The `partials` placeholder indexes.
	     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
	     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
	     * @param {Array} [argPos] The argument positions of the new function.
	     * @param {number} [ary] The arity cap of `func`.
	     * @param {number} [arity] The arity of `func`.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
	      var isAry = bitmask & ARY_FLAG,
	          isBind = bitmask & BIND_FLAG,
	          isBindKey = bitmask & BIND_KEY_FLAG,
	          isCurry = bitmask & CURRY_FLAG,
	          isCurryBound = bitmask & CURRY_BOUND_FLAG,
	          isCurryRight = bitmask & CURRY_RIGHT_FLAG,
	          Ctor = isBindKey ? undefined : createCtorWrapper(func);
	
	      function wrapper() {
	        // Avoid `arguments` object use disqualifying optimizations by
	        // converting it to an array before providing it to other functions.
	        var length = arguments.length,
	            index = length,
	            args = Array(length);
	
	        while (index--) {
	          args[index] = arguments[index];
	        }
	        if (partials) {
	          args = composeArgs(args, partials, holders);
	        }
	        if (partialsRight) {
	          args = composeArgsRight(args, partialsRight, holdersRight);
	        }
	        if (isCurry || isCurryRight) {
	          var placeholder = wrapper.placeholder,
	              argsHolders = replaceHolders(args, placeholder);
	
	          length -= argsHolders.length;
	          if (length < arity) {
	            var newArgPos = argPos ? arrayCopy(argPos) : undefined,
	                newArity = nativeMax(arity - length, 0),
	                newsHolders = isCurry ? argsHolders : undefined,
	                newHoldersRight = isCurry ? undefined : argsHolders,
	                newPartials = isCurry ? args : undefined,
	                newPartialsRight = isCurry ? undefined : args;
	
	            bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
	            bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);
	
	            if (!isCurryBound) {
	              bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
	            }
	            var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity],
	                result = createHybridWrapper.apply(undefined, newData);
	
	            if (isLaziable(func)) {
	              setData(result, newData);
	            }
	            result.placeholder = placeholder;
	            return result;
	          }
	        }
	        var thisBinding = isBind ? thisArg : this,
	            fn = isBindKey ? thisBinding[func] : func;
	
	        if (argPos) {
	          args = reorder(args, argPos);
	        }
	        if (isAry && ary < args.length) {
	          args.length = ary;
	        }
	        if (this && this !== root && this instanceof wrapper) {
	          fn = Ctor || createCtorWrapper(func);
	        }
	        return fn.apply(thisBinding, args);
	      }
	      return wrapper;
	    }
	
	    /**
	     * Creates the padding required for `string` based on the given `length`.
	     * The `chars` string is truncated if the number of characters exceeds `length`.
	     *
	     * @private
	     * @param {string} string The string to create padding for.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the pad for `string`.
	     */
	    function createPadding(string, length, chars) {
	      var strLength = string.length;
	      length = +length;
	
	      if (strLength >= length || !nativeIsFinite(length)) {
	        return '';
	      }
	      var padLength = length - strLength;
	      chars = chars == null ? ' ' : (chars + '');
	      return repeat(chars, nativeCeil(padLength / chars.length)).slice(0, padLength);
	    }
	
	    /**
	     * Creates a function that wraps `func` and invokes it with the optional `this`
	     * binding of `thisArg` and the `partials` prepended to those provided to
	     * the wrapper.
	     *
	     * @private
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
	     * @param {*} thisArg The `this` binding of `func`.
	     * @param {Array} partials The arguments to prepend to those provided to the new function.
	     * @returns {Function} Returns the new bound function.
	     */
	    function createPartialWrapper(func, bitmask, thisArg, partials) {
	      var isBind = bitmask & BIND_FLAG,
	          Ctor = createCtorWrapper(func);
	
	      function wrapper() {
	        // Avoid `arguments` object use disqualifying optimizations by
	        // converting it to an array before providing it `func`.
	        var argsIndex = -1,
	            argsLength = arguments.length,
	            leftIndex = -1,
	            leftLength = partials.length,
	            args = Array(leftLength + argsLength);
	
	        while (++leftIndex < leftLength) {
	          args[leftIndex] = partials[leftIndex];
	        }
	        while (argsLength--) {
	          args[leftIndex++] = arguments[++argsIndex];
	        }
	        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
	        return fn.apply(isBind ? thisArg : this, args);
	      }
	      return wrapper;
	    }
	
	    /**
	     * Creates a `_.ceil`, `_.floor`, or `_.round` function.
	     *
	     * @private
	     * @param {string} methodName The name of the `Math` method to use when rounding.
	     * @returns {Function} Returns the new round function.
	     */
	    function createRound(methodName) {
	      var func = Math[methodName];
	      return function(number, precision) {
	        precision = precision === undefined ? 0 : (+precision || 0);
	        if (precision) {
	          precision = pow(10, precision);
	          return func(number * precision) / precision;
	        }
	        return func(number);
	      };
	    }
	
	    /**
	     * Creates a `_.sortedIndex` or `_.sortedLastIndex` function.
	     *
	     * @private
	     * @param {boolean} [retHighest] Specify returning the highest qualified index.
	     * @returns {Function} Returns the new index function.
	     */
	    function createSortedIndex(retHighest) {
	      return function(array, value, iteratee, thisArg) {
	        var callback = getCallback(iteratee);
	        return (iteratee == null && callback === baseCallback)
	          ? binaryIndex(array, value, retHighest)
	          : binaryIndexBy(array, value, callback(iteratee, thisArg, 1), retHighest);
	      };
	    }
	
	    /**
	     * Creates a function that either curries or invokes `func` with optional
	     * `this` binding and partially applied arguments.
	     *
	     * @private
	     * @param {Function|string} func The function or method name to reference.
	     * @param {number} bitmask The bitmask of flags.
	     *  The bitmask may be composed of the following flags:
	     *     1 - `_.bind`
	     *     2 - `_.bindKey`
	     *     4 - `_.curry` or `_.curryRight` of a bound function
	     *     8 - `_.curry`
	     *    16 - `_.curryRight`
	     *    32 - `_.partial`
	     *    64 - `_.partialRight`
	     *   128 - `_.rearg`
	     *   256 - `_.ary`
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param {Array} [partials] The arguments to be partially applied.
	     * @param {Array} [holders] The `partials` placeholder indexes.
	     * @param {Array} [argPos] The argument positions of the new function.
	     * @param {number} [ary] The arity cap of `func`.
	     * @param {number} [arity] The arity of `func`.
	     * @returns {Function} Returns the new wrapped function.
	     */
	    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
	      var isBindKey = bitmask & BIND_KEY_FLAG;
	      if (!isBindKey && typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      var length = partials ? partials.length : 0;
	      if (!length) {
	        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
	        partials = holders = undefined;
	      }
	      length -= (holders ? holders.length : 0);
	      if (bitmask & PARTIAL_RIGHT_FLAG) {
	        var partialsRight = partials,
	            holdersRight = holders;
	
	        partials = holders = undefined;
	      }
	      var data = isBindKey ? undefined : getData(func),
	          newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];
	
	      if (data) {
	        mergeData(newData, data);
	        bitmask = newData[1];
	        arity = newData[9];
	      }
	      newData[9] = arity == null
	        ? (isBindKey ? 0 : func.length)
	        : (nativeMax(arity - length, 0) || 0);
	
	      if (bitmask == BIND_FLAG) {
	        var result = createBindWrapper(newData[0], newData[2]);
	      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
	        result = createPartialWrapper.apply(undefined, newData);
	      } else {
	        result = createHybridWrapper.apply(undefined, newData);
	      }
	      var setter = data ? baseSetData : setData;
	      return setter(result, newData);
	    }
	
	    /**
	     * A specialized version of `baseIsEqualDeep` for arrays with support for
	     * partial deep comparisons.
	     *
	     * @private
	     * @param {Array} array The array to compare.
	     * @param {Array} other The other array to compare.
	     * @param {Function} equalFunc The function to determine equivalents of values.
	     * @param {Function} [customizer] The function to customize comparing arrays.
	     * @param {boolean} [isLoose] Specify performing partial comparisons.
	     * @param {Array} [stackA] Tracks traversed `value` objects.
	     * @param {Array} [stackB] Tracks traversed `other` objects.
	     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	     */
	    function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
	      var index = -1,
	          arrLength = array.length,
	          othLength = other.length;
	
	      if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
	        return false;
	      }
	      // Ignore non-index properties.
	      while (++index < arrLength) {
	        var arrValue = array[index],
	            othValue = other[index],
	            result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;
	
	        if (result !== undefined) {
	          if (result) {
	            continue;
	          }
	          return false;
	        }
	        // Recursively compare arrays (susceptible to call stack limits).
	        if (isLoose) {
	          if (!arraySome(other, function(othValue) {
	                return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	              })) {
	            return false;
	          }
	        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
	          return false;
	        }
	      }
	      return true;
	    }
	
	    /**
	     * A specialized version of `baseIsEqualDeep` for comparing objects of
	     * the same `toStringTag`.
	     *
	     * **Note:** This function only supports comparing values with tags of
	     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	     *
	     * @private
	     * @param {Object} object The object to compare.
	     * @param {Object} other The other object to compare.
	     * @param {string} tag The `toStringTag` of the objects to compare.
	     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	     */
	    function equalByTag(object, other, tag) {
	      switch (tag) {
	        case boolTag:
	        case dateTag:
	          // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	          return +object == +other;
	
	        case errorTag:
	          return object.name == other.name && object.message == other.message;
	
	        case numberTag:
	          // Treat `NaN` vs. `NaN` as equal.
	          return (object != +object)
	            ? other != +other
	            : object == +other;
	
	        case regexpTag:
	        case stringTag:
	          // Coerce regexes to strings and treat strings primitives and string
	          // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	          return object == (other + '');
	      }
	      return false;
	    }
	
	    /**
	     * A specialized version of `baseIsEqualDeep` for objects with support for
	     * partial deep comparisons.
	     *
	     * @private
	     * @param {Object} object The object to compare.
	     * @param {Object} other The other object to compare.
	     * @param {Function} equalFunc The function to determine equivalents of values.
	     * @param {Function} [customizer] The function to customize comparing values.
	     * @param {boolean} [isLoose] Specify performing partial comparisons.
	     * @param {Array} [stackA] Tracks traversed `value` objects.
	     * @param {Array} [stackB] Tracks traversed `other` objects.
	     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	     */
	    function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	      var objProps = keys(object),
	          objLength = objProps.length,
	          othProps = keys(other),
	          othLength = othProps.length;
	
	      if (objLength != othLength && !isLoose) {
	        return false;
	      }
	      var index = objLength;
	      while (index--) {
	        var key = objProps[index];
	        if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
	          return false;
	        }
	      }
	      var skipCtor = isLoose;
	      while (++index < objLength) {
	        key = objProps[index];
	        var objValue = object[key],
	            othValue = other[key],
	            result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;
	
	        // Recursively compare objects (susceptible to call stack limits).
	        if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
	          return false;
	        }
	        skipCtor || (skipCtor = key == 'constructor');
	      }
	      if (!skipCtor) {
	        var objCtor = object.constructor,
	            othCtor = other.constructor;
	
	        // Non `Object` object instances with different constructors are not equal.
	        if (objCtor != othCtor &&
	            ('constructor' in object && 'constructor' in other) &&
	            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	          return false;
	        }
	      }
	      return true;
	    }
	
	    /**
	     * Gets the appropriate "callback" function. If the `_.callback` method is
	     * customized this function returns the custom method, otherwise it returns
	     * the `baseCallback` function. If arguments are provided the chosen function
	     * is invoked with them and its result is returned.
	     *
	     * @private
	     * @returns {Function} Returns the chosen function or its result.
	     */
	    function getCallback(func, thisArg, argCount) {
	      var result = lodash.callback || callback;
	      result = result === callback ? baseCallback : result;
	      return argCount ? result(func, thisArg, argCount) : result;
	    }
	
	    /**
	     * Gets metadata for `func`.
	     *
	     * @private
	     * @param {Function} func The function to query.
	     * @returns {*} Returns the metadata for `func`.
	     */
	    var getData = !metaMap ? noop : function(func) {
	      return metaMap.get(func);
	    };
	
	    /**
	     * Gets the name of `func`.
	     *
	     * @private
	     * @param {Function} func The function to query.
	     * @returns {string} Returns the function name.
	     */
	    function getFuncName(func) {
	      var result = func.name,
	          array = realNames[result],
	          length = array ? array.length : 0;
	
	      while (length--) {
	        var data = array[length],
	            otherFunc = data.func;
	        if (otherFunc == null || otherFunc == func) {
	          return data.name;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
	     * customized this function returns the custom method, otherwise it returns
	     * the `baseIndexOf` function. If arguments are provided the chosen function
	     * is invoked with them and its result is returned.
	     *
	     * @private
	     * @returns {Function|number} Returns the chosen function or its result.
	     */
	    function getIndexOf(collection, target, fromIndex) {
	      var result = lodash.indexOf || indexOf;
	      result = result === indexOf ? baseIndexOf : result;
	      return collection ? result(collection, target, fromIndex) : result;
	    }
	
	    /**
	     * Gets the "length" property value of `object`.
	     *
	     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	     * that affects Safari on at least iOS 8.1-8.3 ARM64.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {*} Returns the "length" value.
	     */
	    var getLength = baseProperty('length');
	
	    /**
	     * Gets the propery names, values, and compare flags of `object`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the match data of `object`.
	     */
	    function getMatchData(object) {
	      var result = pairs(object),
	          length = result.length;
	
	      while (length--) {
	        result[length][2] = isStrictComparable(result[length][1]);
	      }
	      return result;
	    }
	
	    /**
	     * Gets the native function at `key` of `object`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {string} key The key of the method to get.
	     * @returns {*} Returns the function if it's native, else `undefined`.
	     */
	    function getNative(object, key) {
	      var value = object == null ? undefined : object[key];
	      return isNative(value) ? value : undefined;
	    }
	
	    /**
	     * Gets the view, applying any `transforms` to the `start` and `end` positions.
	     *
	     * @private
	     * @param {number} start The start of the view.
	     * @param {number} end The end of the view.
	     * @param {Array} transforms The transformations to apply to the view.
	     * @returns {Object} Returns an object containing the `start` and `end`
	     *  positions of the view.
	     */
	    function getView(start, end, transforms) {
	      var index = -1,
	          length = transforms.length;
	
	      while (++index < length) {
	        var data = transforms[index],
	            size = data.size;
	
	        switch (data.type) {
	          case 'drop':      start += size; break;
	          case 'dropRight': end -= size; break;
	          case 'take':      end = nativeMin(end, start + size); break;
	          case 'takeRight': start = nativeMax(start, end - size); break;
	        }
	      }
	      return { 'start': start, 'end': end };
	    }
	
	    /**
	     * Initializes an array clone.
	     *
	     * @private
	     * @param {Array} array The array to clone.
	     * @returns {Array} Returns the initialized clone.
	     */
	    function initCloneArray(array) {
	      var length = array.length,
	          result = new array.constructor(length);
	
	      // Add array properties assigned by `RegExp#exec`.
	      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
	        result.index = array.index;
	        result.input = array.input;
	      }
	      return result;
	    }
	
	    /**
	     * Initializes an object clone.
	     *
	     * @private
	     * @param {Object} object The object to clone.
	     * @returns {Object} Returns the initialized clone.
	     */
	    function initCloneObject(object) {
	      var Ctor = object.constructor;
	      if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
	        Ctor = Object;
	      }
	      return new Ctor;
	    }
	
	    /**
	     * Initializes an object clone based on its `toStringTag`.
	     *
	     * **Note:** This function only supports cloning values with tags of
	     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	     *
	     * @private
	     * @param {Object} object The object to clone.
	     * @param {string} tag The `toStringTag` of the object to clone.
	     * @param {boolean} [isDeep] Specify a deep clone.
	     * @returns {Object} Returns the initialized clone.
	     */
	    function initCloneByTag(object, tag, isDeep) {
	      var Ctor = object.constructor;
	      switch (tag) {
	        case arrayBufferTag:
	          return bufferClone(object);
	
	        case boolTag:
	        case dateTag:
	          return new Ctor(+object);
	
	        case float32Tag: case float64Tag:
	        case int8Tag: case int16Tag: case int32Tag:
	        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
	          var buffer = object.buffer;
	          return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);
	
	        case numberTag:
	        case stringTag:
	          return new Ctor(object);
	
	        case regexpTag:
	          var result = new Ctor(object.source, reFlags.exec(object));
	          result.lastIndex = object.lastIndex;
	      }
	      return result;
	    }
	
	    /**
	     * Invokes the method at `path` on `object`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the method to invoke.
	     * @param {Array} args The arguments to invoke the method with.
	     * @returns {*} Returns the result of the invoked method.
	     */
	    function invokePath(object, path, args) {
	      if (object != null && !isKey(path, object)) {
	        path = toPath(path);
	        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
	        path = last(path);
	      }
	      var func = object == null ? object : object[path];
	      return func == null ? undefined : func.apply(object, args);
	    }
	
	    /**
	     * Checks if `value` is array-like.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	     */
	    function isArrayLike(value) {
	      return value != null && isLength(getLength(value));
	    }
	
	    /**
	     * Checks if `value` is a valid array-like index.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	     */
	    function isIndex(value, length) {
	      value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	      length = length == null ? MAX_SAFE_INTEGER : length;
	      return value > -1 && value % 1 == 0 && value < length;
	    }
	
	    /**
	     * Checks if the provided arguments are from an iteratee call.
	     *
	     * @private
	     * @param {*} value The potential iteratee value argument.
	     * @param {*} index The potential iteratee index or key argument.
	     * @param {*} object The potential iteratee object argument.
	     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	     */
	    function isIterateeCall(value, index, object) {
	      if (!isObject(object)) {
	        return false;
	      }
	      var type = typeof index;
	      if (type == 'number'
	          ? (isArrayLike(object) && isIndex(index, object.length))
	          : (type == 'string' && index in object)) {
	        var other = object[index];
	        return value === value ? (value === other) : (other !== other);
	      }
	      return false;
	    }
	
	    /**
	     * Checks if `value` is a property name and not a property path.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @param {Object} [object] The object to query keys on.
	     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	     */
	    function isKey(value, object) {
	      var type = typeof value;
	      if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
	        return true;
	      }
	      if (isArray(value)) {
	        return false;
	      }
	      var result = !reIsDeepProp.test(value);
	      return result || (object != null && value in toObject(object));
	    }
	
	    /**
	     * Checks if `func` has a lazy counterpart.
	     *
	     * @private
	     * @param {Function} func The function to check.
	     * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
	     */
	    function isLaziable(func) {
	      var funcName = getFuncName(func);
	      if (!(funcName in LazyWrapper.prototype)) {
	        return false;
	      }
	      var other = lodash[funcName];
	      if (func === other) {
	        return true;
	      }
	      var data = getData(other);
	      return !!data && func === data[0];
	    }
	
	    /**
	     * Checks if `value` is a valid array-like length.
	     *
	     * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	     */
	    function isLength(value) {
	      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	    }
	
	    /**
	     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	     *
	     * @private
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` if suitable for strict
	     *  equality comparisons, else `false`.
	     */
	    function isStrictComparable(value) {
	      return value === value && !isObject(value);
	    }
	
	    /**
	     * Merges the function metadata of `source` into `data`.
	     *
	     * Merging metadata reduces the number of wrappers required to invoke a function.
	     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
	     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
	     * augment function arguments, making the order in which they are executed important,
	     * preventing the merging of metadata. However, we make an exception for a safe
	     * common case where curried functions have `_.ary` and or `_.rearg` applied.
	     *
	     * @private
	     * @param {Array} data The destination metadata.
	     * @param {Array} source The source metadata.
	     * @returns {Array} Returns `data`.
	     */
	    function mergeData(data, source) {
	      var bitmask = data[1],
	          srcBitmask = source[1],
	          newBitmask = bitmask | srcBitmask,
	          isCommon = newBitmask < ARY_FLAG;
	
	      var isCombo =
	        (srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG) ||
	        (srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8]) ||
	        (srcBitmask == (ARY_FLAG | REARG_FLAG) && bitmask == CURRY_FLAG);
	
	      // Exit early if metadata can't be merged.
	      if (!(isCommon || isCombo)) {
	        return data;
	      }
	      // Use source `thisArg` if available.
	      if (srcBitmask & BIND_FLAG) {
	        data[2] = source[2];
	        // Set when currying a bound function.
	        newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
	      }
	      // Compose partial arguments.
	      var value = source[3];
	      if (value) {
	        var partials = data[3];
	        data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
	        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4]);
	      }
	      // Compose partial right arguments.
	      value = source[5];
	      if (value) {
	        partials = data[5];
	        data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
	        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6]);
	      }
	      // Use source `argPos` if available.
	      value = source[7];
	      if (value) {
	        data[7] = arrayCopy(value);
	      }
	      // Use source `ary` if it's smaller.
	      if (srcBitmask & ARY_FLAG) {
	        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
	      }
	      // Use source `arity` if one is not provided.
	      if (data[9] == null) {
	        data[9] = source[9];
	      }
	      // Use source `func` and merge bitmasks.
	      data[0] = source[0];
	      data[1] = newBitmask;
	
	      return data;
	    }
	
	    /**
	     * Used by `_.defaultsDeep` to customize its `_.merge` use.
	     *
	     * @private
	     * @param {*} objectValue The destination object property value.
	     * @param {*} sourceValue The source object property value.
	     * @returns {*} Returns the value to assign to the destination object.
	     */
	    function mergeDefaults(objectValue, sourceValue) {
	      return objectValue === undefined ? sourceValue : merge(objectValue, sourceValue, mergeDefaults);
	    }
	
	    /**
	     * A specialized version of `_.pick` which picks `object` properties specified
	     * by `props`.
	     *
	     * @private
	     * @param {Object} object The source object.
	     * @param {string[]} props The property names to pick.
	     * @returns {Object} Returns the new object.
	     */
	    function pickByArray(object, props) {
	      object = toObject(object);
	
	      var index = -1,
	          length = props.length,
	          result = {};
	
	      while (++index < length) {
	        var key = props[index];
	        if (key in object) {
	          result[key] = object[key];
	        }
	      }
	      return result;
	    }
	
	    /**
	     * A specialized version of `_.pick` which picks `object` properties `predicate`
	     * returns truthy for.
	     *
	     * @private
	     * @param {Object} object The source object.
	     * @param {Function} predicate The function invoked per iteration.
	     * @returns {Object} Returns the new object.
	     */
	    function pickByCallback(object, predicate) {
	      var result = {};
	      baseForIn(object, function(value, key, object) {
	        if (predicate(value, key, object)) {
	          result[key] = value;
	        }
	      });
	      return result;
	    }
	
	    /**
	     * Reorder `array` according to the specified indexes where the element at
	     * the first index is assigned as the first element, the element at
	     * the second index is assigned as the second element, and so on.
	     *
	     * @private
	     * @param {Array} array The array to reorder.
	     * @param {Array} indexes The arranged array indexes.
	     * @returns {Array} Returns `array`.
	     */
	    function reorder(array, indexes) {
	      var arrLength = array.length,
	          length = nativeMin(indexes.length, arrLength),
	          oldArray = arrayCopy(array);
	
	      while (length--) {
	        var index = indexes[length];
	        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
	      }
	      return array;
	    }
	
	    /**
	     * Sets metadata for `func`.
	     *
	     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
	     * period of time, it will trip its breaker and transition to an identity function
	     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
	     * for more details.
	     *
	     * @private
	     * @param {Function} func The function to associate metadata with.
	     * @param {*} data The metadata.
	     * @returns {Function} Returns `func`.
	     */
	    var setData = (function() {
	      var count = 0,
	          lastCalled = 0;
	
	      return function(key, value) {
	        var stamp = now(),
	            remaining = HOT_SPAN - (stamp - lastCalled);
	
	        lastCalled = stamp;
	        if (remaining > 0) {
	          if (++count >= HOT_COUNT) {
	            return key;
	          }
	        } else {
	          count = 0;
	        }
	        return baseSetData(key, value);
	      };
	    }());
	
	    /**
	     * A fallback implementation of `Object.keys` which creates an array of the
	     * own enumerable property names of `object`.
	     *
	     * @private
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     */
	    function shimKeys(object) {
	      var props = keysIn(object),
	          propsLength = props.length,
	          length = propsLength && object.length;
	
	      var allowIndexes = !!length && isLength(length) &&
	        (isArray(object) || isArguments(object));
	
	      var index = -1,
	          result = [];
	
	      while (++index < propsLength) {
	        var key = props[index];
	        if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	          result.push(key);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * Converts `value` to an array-like object if it's not one.
	     *
	     * @private
	     * @param {*} value The value to process.
	     * @returns {Array|Object} Returns the array-like object.
	     */
	    function toIterable(value) {
	      if (value == null) {
	        return [];
	      }
	      if (!isArrayLike(value)) {
	        return values(value);
	      }
	      return isObject(value) ? value : Object(value);
	    }
	
	    /**
	     * Converts `value` to an object if it's not one.
	     *
	     * @private
	     * @param {*} value The value to process.
	     * @returns {Object} Returns the object.
	     */
	    function toObject(value) {
	      return isObject(value) ? value : Object(value);
	    }
	
	    /**
	     * Converts `value` to property path array if it's not one.
	     *
	     * @private
	     * @param {*} value The value to process.
	     * @returns {Array} Returns the property path array.
	     */
	    function toPath(value) {
	      if (isArray(value)) {
	        return value;
	      }
	      var result = [];
	      baseToString(value).replace(rePropName, function(match, number, quote, string) {
	        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	      });
	      return result;
	    }
	
	    /**
	     * Creates a clone of `wrapper`.
	     *
	     * @private
	     * @param {Object} wrapper The wrapper to clone.
	     * @returns {Object} Returns the cloned wrapper.
	     */
	    function wrapperClone(wrapper) {
	      return wrapper instanceof LazyWrapper
	        ? wrapper.clone()
	        : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, arrayCopy(wrapper.__actions__));
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates an array of elements split into groups the length of `size`.
	     * If `collection` can't be split evenly, the final chunk will be the remaining
	     * elements.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to process.
	     * @param {number} [size=1] The length of each chunk.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Array} Returns the new array containing chunks.
	     * @example
	     *
	     * _.chunk(['a', 'b', 'c', 'd'], 2);
	     * // => [['a', 'b'], ['c', 'd']]
	     *
	     * _.chunk(['a', 'b', 'c', 'd'], 3);
	     * // => [['a', 'b', 'c'], ['d']]
	     */
	    function chunk(array, size, guard) {
	      if (guard ? isIterateeCall(array, size, guard) : size == null) {
	        size = 1;
	      } else {
	        size = nativeMax(nativeFloor(size) || 1, 1);
	      }
	      var index = 0,
	          length = array ? array.length : 0,
	          resIndex = -1,
	          result = Array(nativeCeil(length / size));
	
	      while (index < length) {
	        result[++resIndex] = baseSlice(array, index, (index += size));
	      }
	      return result;
	    }
	
	    /**
	     * Creates an array with all falsey values removed. The values `false`, `null`,
	     * `0`, `""`, `undefined`, and `NaN` are falsey.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to compact.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * _.compact([0, 1, false, 2, '', 3]);
	     * // => [1, 2, 3]
	     */
	    function compact(array) {
	      var index = -1,
	          length = array ? array.length : 0,
	          resIndex = -1,
	          result = [];
	
	      while (++index < length) {
	        var value = array[index];
	        if (value) {
	          result[++resIndex] = value;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * Creates an array of unique `array` values not included in the other
	     * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {...Array} [values] The arrays of values to exclude.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * _.difference([1, 2, 3], [4, 2]);
	     * // => [1, 3]
	     */
	    var difference = restParam(function(array, values) {
	      return (isObjectLike(array) && isArrayLike(array))
	        ? baseDifference(array, baseFlatten(values, false, true))
	        : [];
	    });
	
	    /**
	     * Creates a slice of `array` with `n` elements dropped from the beginning.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to drop.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.drop([1, 2, 3]);
	     * // => [2, 3]
	     *
	     * _.drop([1, 2, 3], 2);
	     * // => [3]
	     *
	     * _.drop([1, 2, 3], 5);
	     * // => []
	     *
	     * _.drop([1, 2, 3], 0);
	     * // => [1, 2, 3]
	     */
	    function drop(array, n, guard) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (guard ? isIterateeCall(array, n, guard) : n == null) {
	        n = 1;
	      }
	      return baseSlice(array, n < 0 ? 0 : n);
	    }
	
	    /**
	     * Creates a slice of `array` with `n` elements dropped from the end.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to drop.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.dropRight([1, 2, 3]);
	     * // => [1, 2]
	     *
	     * _.dropRight([1, 2, 3], 2);
	     * // => [1]
	     *
	     * _.dropRight([1, 2, 3], 5);
	     * // => []
	     *
	     * _.dropRight([1, 2, 3], 0);
	     * // => [1, 2, 3]
	     */
	    function dropRight(array, n, guard) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (guard ? isIterateeCall(array, n, guard) : n == null) {
	        n = 1;
	      }
	      n = length - (+n || 0);
	      return baseSlice(array, 0, n < 0 ? 0 : n);
	    }
	
	    /**
	     * Creates a slice of `array` excluding elements dropped from the end.
	     * Elements are dropped until `predicate` returns falsey. The predicate is
	     * bound to `thisArg` and invoked with three arguments: (value, index, array).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that match the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.dropRightWhile([1, 2, 3], function(n) {
	     *   return n > 1;
	     * });
	     * // => [1]
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': true },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': false }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.pluck(_.dropRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
	     * // => ['barney', 'fred']
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.pluck(_.dropRightWhile(users, 'active', false), 'user');
	     * // => ['barney']
	     *
	     * // using the `_.property` callback shorthand
	     * _.pluck(_.dropRightWhile(users, 'active'), 'user');
	     * // => ['barney', 'fred', 'pebbles']
	     */
	    function dropRightWhile(array, predicate, thisArg) {
	      return (array && array.length)
	        ? baseWhile(array, getCallback(predicate, thisArg, 3), true, true)
	        : [];
	    }
	
	    /**
	     * Creates a slice of `array` excluding elements dropped from the beginning.
	     * Elements are dropped until `predicate` returns falsey. The predicate is
	     * bound to `thisArg` and invoked with three arguments: (value, index, array).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.dropWhile([1, 2, 3], function(n) {
	     *   return n < 3;
	     * });
	     * // => [3]
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': false },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': true }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.pluck(_.dropWhile(users, { 'user': 'barney', 'active': false }), 'user');
	     * // => ['fred', 'pebbles']
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.pluck(_.dropWhile(users, 'active', false), 'user');
	     * // => ['pebbles']
	     *
	     * // using the `_.property` callback shorthand
	     * _.pluck(_.dropWhile(users, 'active'), 'user');
	     * // => ['barney', 'fred', 'pebbles']
	     */
	    function dropWhile(array, predicate, thisArg) {
	      return (array && array.length)
	        ? baseWhile(array, getCallback(predicate, thisArg, 3), true)
	        : [];
	    }
	
	    /**
	     * Fills elements of `array` with `value` from `start` up to, but not
	     * including, `end`.
	     *
	     * **Note:** This method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to fill.
	     * @param {*} value The value to fill `array` with.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3];
	     *
	     * _.fill(array, 'a');
	     * console.log(array);
	     * // => ['a', 'a', 'a']
	     *
	     * _.fill(Array(3), 2);
	     * // => [2, 2, 2]
	     *
	     * _.fill([4, 6, 8], '*', 1, 2);
	     * // => [4, '*', 8]
	     */
	    function fill(array, value, start, end) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
	        start = 0;
	        end = length;
	      }
	      return baseFill(array, value, start, end);
	    }
	
	    /**
	     * This method is like `_.find` except that it returns the index of the first
	     * element `predicate` returns truthy for instead of the element itself.
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {number} Returns the index of the found element, else `-1`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': false },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': true }
	     * ];
	     *
	     * _.findIndex(users, function(chr) {
	     *   return chr.user == 'barney';
	     * });
	     * // => 0
	     *
	     * // using the `_.matches` callback shorthand
	     * _.findIndex(users, { 'user': 'fred', 'active': false });
	     * // => 1
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.findIndex(users, 'active', false);
	     * // => 0
	     *
	     * // using the `_.property` callback shorthand
	     * _.findIndex(users, 'active');
	     * // => 2
	     */
	    var findIndex = createFindIndex();
	
	    /**
	     * This method is like `_.findIndex` except that it iterates over elements
	     * of `collection` from right to left.
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {number} Returns the index of the found element, else `-1`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': true },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': false }
	     * ];
	     *
	     * _.findLastIndex(users, function(chr) {
	     *   return chr.user == 'pebbles';
	     * });
	     * // => 2
	     *
	     * // using the `_.matches` callback shorthand
	     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
	     * // => 0
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.findLastIndex(users, 'active', false);
	     * // => 2
	     *
	     * // using the `_.property` callback shorthand
	     * _.findLastIndex(users, 'active');
	     * // => 0
	     */
	    var findLastIndex = createFindIndex(true);
	
	    /**
	     * Gets the first element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @alias head
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {*} Returns the first element of `array`.
	     * @example
	     *
	     * _.first([1, 2, 3]);
	     * // => 1
	     *
	     * _.first([]);
	     * // => undefined
	     */
	    function first(array) {
	      return array ? array[0] : undefined;
	    }
	
	    /**
	     * Flattens a nested array. If `isDeep` is `true` the array is recursively
	     * flattened, otherwise it is only flattened a single level.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to flatten.
	     * @param {boolean} [isDeep] Specify a deep flatten.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Array} Returns the new flattened array.
	     * @example
	     *
	     * _.flatten([1, [2, 3, [4]]]);
	     * // => [1, 2, 3, [4]]
	     *
	     * // using `isDeep`
	     * _.flatten([1, [2, 3, [4]]], true);
	     * // => [1, 2, 3, 4]
	     */
	    function flatten(array, isDeep, guard) {
	      var length = array ? array.length : 0;
	      if (guard && isIterateeCall(array, isDeep, guard)) {
	        isDeep = false;
	      }
	      return length ? baseFlatten(array, isDeep) : [];
	    }
	
	    /**
	     * Recursively flattens a nested array.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to recursively flatten.
	     * @returns {Array} Returns the new flattened array.
	     * @example
	     *
	     * _.flattenDeep([1, [2, 3, [4]]]);
	     * // => [1, 2, 3, 4]
	     */
	    function flattenDeep(array) {
	      var length = array ? array.length : 0;
	      return length ? baseFlatten(array, true) : [];
	    }
	
	    /**
	     * Gets the index at which the first occurrence of `value` is found in `array`
	     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
	     * from the end of `array`. If `array` is sorted providing `true` for `fromIndex`
	     * performs a faster binary search.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
	     *  to perform a binary search on a sorted array.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     * @example
	     *
	     * _.indexOf([1, 2, 1, 2], 2);
	     * // => 1
	     *
	     * // using `fromIndex`
	     * _.indexOf([1, 2, 1, 2], 2, 2);
	     * // => 3
	     *
	     * // performing a binary search
	     * _.indexOf([1, 1, 2, 2], 2, true);
	     * // => 2
	     */
	    function indexOf(array, value, fromIndex) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return -1;
	      }
	      if (typeof fromIndex == 'number') {
	        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex;
	      } else if (fromIndex) {
	        var index = binaryIndex(array, value);
	        if (index < length &&
	            (value === value ? (value === array[index]) : (array[index] !== array[index]))) {
	          return index;
	        }
	        return -1;
	      }
	      return baseIndexOf(array, value, fromIndex || 0);
	    }
	
	    /**
	     * Gets all but the last element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.initial([1, 2, 3]);
	     * // => [1, 2]
	     */
	    function initial(array) {
	      return dropRight(array, 1);
	    }
	
	    /**
	     * Creates an array of unique values that are included in all of the provided
	     * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @returns {Array} Returns the new array of shared values.
	     * @example
	     * _.intersection([1, 2], [4, 2], [2, 1]);
	     * // => [2]
	     */
	    var intersection = restParam(function(arrays) {
	      var othLength = arrays.length,
	          othIndex = othLength,
	          caches = Array(length),
	          indexOf = getIndexOf(),
	          isCommon = indexOf == baseIndexOf,
	          result = [];
	
	      while (othIndex--) {
	        var value = arrays[othIndex] = isArrayLike(value = arrays[othIndex]) ? value : [];
	        caches[othIndex] = (isCommon && value.length >= 120) ? createCache(othIndex && value) : null;
	      }
	      var array = arrays[0],
	          index = -1,
	          length = array ? array.length : 0,
	          seen = caches[0];
	
	      outer:
	      while (++index < length) {
	        value = array[index];
	        if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value, 0)) < 0) {
	          var othIndex = othLength;
	          while (--othIndex) {
	            var cache = caches[othIndex];
	            if ((cache ? cacheIndexOf(cache, value) : indexOf(arrays[othIndex], value, 0)) < 0) {
	              continue outer;
	            }
	          }
	          if (seen) {
	            seen.push(value);
	          }
	          result.push(value);
	        }
	      }
	      return result;
	    });
	
	    /**
	     * Gets the last element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {*} Returns the last element of `array`.
	     * @example
	     *
	     * _.last([1, 2, 3]);
	     * // => 3
	     */
	    function last(array) {
	      var length = array ? array.length : 0;
	      return length ? array[length - 1] : undefined;
	    }
	
	    /**
	     * This method is like `_.indexOf` except that it iterates over elements of
	     * `array` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to search.
	     * @param {*} value The value to search for.
	     * @param {boolean|number} [fromIndex=array.length-1] The index to search from
	     *  or `true` to perform a binary search on a sorted array.
	     * @returns {number} Returns the index of the matched value, else `-1`.
	     * @example
	     *
	     * _.lastIndexOf([1, 2, 1, 2], 2);
	     * // => 3
	     *
	     * // using `fromIndex`
	     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
	     * // => 1
	     *
	     * // performing a binary search
	     * _.lastIndexOf([1, 1, 2, 2], 2, true);
	     * // => 3
	     */
	    function lastIndexOf(array, value, fromIndex) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return -1;
	      }
	      var index = length;
	      if (typeof fromIndex == 'number') {
	        index = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1;
	      } else if (fromIndex) {
	        index = binaryIndex(array, value, true) - 1;
	        var other = array[index];
	        if (value === value ? (value === other) : (other !== other)) {
	          return index;
	        }
	        return -1;
	      }
	      if (value !== value) {
	        return indexOfNaN(array, index, true);
	      }
	      while (index--) {
	        if (array[index] === value) {
	          return index;
	        }
	      }
	      return -1;
	    }
	
	    /**
	     * Removes all provided values from `array` using
	     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * **Note:** Unlike `_.without`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {...*} [values] The values to remove.
	     * @returns {Array} Returns `array`.
	     * @example
	     *
	     * var array = [1, 2, 3, 1, 2, 3];
	     *
	     * _.pull(array, 2, 3);
	     * console.log(array);
	     * // => [1, 1]
	     */
	    function pull() {
	      var args = arguments,
	          array = args[0];
	
	      if (!(array && array.length)) {
	        return array;
	      }
	      var index = 0,
	          indexOf = getIndexOf(),
	          length = args.length;
	
	      while (++index < length) {
	        var fromIndex = 0,
	            value = args[index];
	
	        while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
	          splice.call(array, fromIndex, 1);
	        }
	      }
	      return array;
	    }
	
	    /**
	     * Removes elements from `array` corresponding to the given indexes and returns
	     * an array of the removed elements. Indexes may be specified as an array of
	     * indexes or as individual arguments.
	     *
	     * **Note:** Unlike `_.at`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
	     *  specified as individual indexes or arrays of indexes.
	     * @returns {Array} Returns the new array of removed elements.
	     * @example
	     *
	     * var array = [5, 10, 15, 20];
	     * var evens = _.pullAt(array, 1, 3);
	     *
	     * console.log(array);
	     * // => [5, 15]
	     *
	     * console.log(evens);
	     * // => [10, 20]
	     */
	    var pullAt = restParam(function(array, indexes) {
	      indexes = baseFlatten(indexes);
	
	      var result = baseAt(array, indexes);
	      basePullAt(array, indexes.sort(baseCompareAscending));
	      return result;
	    });
	
	    /**
	     * Removes all elements from `array` that `predicate` returns truthy for
	     * and returns an array of the removed elements. The predicate is bound to
	     * `thisArg` and invoked with three arguments: (value, index, array).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * **Note:** Unlike `_.filter`, this method mutates `array`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to modify.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the new array of removed elements.
	     * @example
	     *
	     * var array = [1, 2, 3, 4];
	     * var evens = _.remove(array, function(n) {
	     *   return n % 2 == 0;
	     * });
	     *
	     * console.log(array);
	     * // => [1, 3]
	     *
	     * console.log(evens);
	     * // => [2, 4]
	     */
	    function remove(array, predicate, thisArg) {
	      var result = [];
	      if (!(array && array.length)) {
	        return result;
	      }
	      var index = -1,
	          indexes = [],
	          length = array.length;
	
	      predicate = getCallback(predicate, thisArg, 3);
	      while (++index < length) {
	        var value = array[index];
	        if (predicate(value, index, array)) {
	          result.push(value);
	          indexes.push(index);
	        }
	      }
	      basePullAt(array, indexes);
	      return result;
	    }
	
	    /**
	     * Gets all but the first element of `array`.
	     *
	     * @static
	     * @memberOf _
	     * @alias tail
	     * @category Array
	     * @param {Array} array The array to query.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.rest([1, 2, 3]);
	     * // => [2, 3]
	     */
	    function rest(array) {
	      return drop(array, 1);
	    }
	
	    /**
	     * Creates a slice of `array` from `start` up to, but not including, `end`.
	     *
	     * **Note:** This method is used instead of `Array#slice` to support node
	     * lists in IE < 9 and to ensure dense arrays are returned.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to slice.
	     * @param {number} [start=0] The start position.
	     * @param {number} [end=array.length] The end position.
	     * @returns {Array} Returns the slice of `array`.
	     */
	    function slice(array, start, end) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
	        start = 0;
	        end = length;
	      }
	      return baseSlice(array, start, end);
	    }
	
	    /**
	     * Uses a binary search to determine the lowest index at which `value` should
	     * be inserted into `array` in order to maintain its sort order. If an iteratee
	     * function is provided it is invoked for `value` and each element of `array`
	     * to compute their sort ranking. The iteratee is bound to `thisArg` and
	     * invoked with one argument; (value).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {number} Returns the index at which `value` should be inserted
	     *  into `array`.
	     * @example
	     *
	     * _.sortedIndex([30, 50], 40);
	     * // => 1
	     *
	     * _.sortedIndex([4, 4, 5, 5], 5);
	     * // => 2
	     *
	     * var dict = { 'data': { 'thirty': 30, 'forty': 40, 'fifty': 50 } };
	     *
	     * // using an iteratee function
	     * _.sortedIndex(['thirty', 'fifty'], 'forty', function(word) {
	     *   return this.data[word];
	     * }, dict);
	     * // => 1
	     *
	     * // using the `_.property` callback shorthand
	     * _.sortedIndex([{ 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
	     * // => 1
	     */
	    var sortedIndex = createSortedIndex();
	
	    /**
	     * This method is like `_.sortedIndex` except that it returns the highest
	     * index at which `value` should be inserted into `array` in order to
	     * maintain its sort order.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The sorted array to inspect.
	     * @param {*} value The value to evaluate.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {number} Returns the index at which `value` should be inserted
	     *  into `array`.
	     * @example
	     *
	     * _.sortedLastIndex([4, 4, 5, 5], 5);
	     * // => 4
	     */
	    var sortedLastIndex = createSortedIndex(true);
	
	    /**
	     * Creates a slice of `array` with `n` elements taken from the beginning.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to take.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.take([1, 2, 3]);
	     * // => [1]
	     *
	     * _.take([1, 2, 3], 2);
	     * // => [1, 2]
	     *
	     * _.take([1, 2, 3], 5);
	     * // => [1, 2, 3]
	     *
	     * _.take([1, 2, 3], 0);
	     * // => []
	     */
	    function take(array, n, guard) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (guard ? isIterateeCall(array, n, guard) : n == null) {
	        n = 1;
	      }
	      return baseSlice(array, 0, n < 0 ? 0 : n);
	    }
	
	    /**
	     * Creates a slice of `array` with `n` elements taken from the end.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {number} [n=1] The number of elements to take.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.takeRight([1, 2, 3]);
	     * // => [3]
	     *
	     * _.takeRight([1, 2, 3], 2);
	     * // => [2, 3]
	     *
	     * _.takeRight([1, 2, 3], 5);
	     * // => [1, 2, 3]
	     *
	     * _.takeRight([1, 2, 3], 0);
	     * // => []
	     */
	    function takeRight(array, n, guard) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (guard ? isIterateeCall(array, n, guard) : n == null) {
	        n = 1;
	      }
	      n = length - (+n || 0);
	      return baseSlice(array, n < 0 ? 0 : n);
	    }
	
	    /**
	     * Creates a slice of `array` with elements taken from the end. Elements are
	     * taken until `predicate` returns falsey. The predicate is bound to `thisArg`
	     * and invoked with three arguments: (value, index, array).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.takeRightWhile([1, 2, 3], function(n) {
	     *   return n > 1;
	     * });
	     * // => [2, 3]
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': true },
	     *   { 'user': 'fred',    'active': false },
	     *   { 'user': 'pebbles', 'active': false }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.pluck(_.takeRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
	     * // => ['pebbles']
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.pluck(_.takeRightWhile(users, 'active', false), 'user');
	     * // => ['fred', 'pebbles']
	     *
	     * // using the `_.property` callback shorthand
	     * _.pluck(_.takeRightWhile(users, 'active'), 'user');
	     * // => []
	     */
	    function takeRightWhile(array, predicate, thisArg) {
	      return (array && array.length)
	        ? baseWhile(array, getCallback(predicate, thisArg, 3), false, true)
	        : [];
	    }
	
	    /**
	     * Creates a slice of `array` with elements taken from the beginning. Elements
	     * are taken until `predicate` returns falsey. The predicate is bound to
	     * `thisArg` and invoked with three arguments: (value, index, array).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to query.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the slice of `array`.
	     * @example
	     *
	     * _.takeWhile([1, 2, 3], function(n) {
	     *   return n < 3;
	     * });
	     * // => [1, 2]
	     *
	     * var users = [
	     *   { 'user': 'barney',  'active': false },
	     *   { 'user': 'fred',    'active': false},
	     *   { 'user': 'pebbles', 'active': true }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.pluck(_.takeWhile(users, { 'user': 'barney', 'active': false }), 'user');
	     * // => ['barney']
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.pluck(_.takeWhile(users, 'active', false), 'user');
	     * // => ['barney', 'fred']
	     *
	     * // using the `_.property` callback shorthand
	     * _.pluck(_.takeWhile(users, 'active'), 'user');
	     * // => []
	     */
	    function takeWhile(array, predicate, thisArg) {
	      return (array && array.length)
	        ? baseWhile(array, getCallback(predicate, thisArg, 3))
	        : [];
	    }
	
	    /**
	     * Creates an array of unique values, in order, from all of the provided arrays
	     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @returns {Array} Returns the new array of combined values.
	     * @example
	     *
	     * _.union([1, 2], [4, 2], [2, 1]);
	     * // => [1, 2, 4]
	     */
	    var union = restParam(function(arrays) {
	      return baseUniq(baseFlatten(arrays, false, true));
	    });
	
	    /**
	     * Creates a duplicate-free version of an array, using
	     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons, in which only the first occurence of each element
	     * is kept. Providing `true` for `isSorted` performs a faster search algorithm
	     * for sorted arrays. If an iteratee function is provided it is invoked for
	     * each element in the array to generate the criterion by which uniqueness
	     * is computed. The `iteratee` is bound to `thisArg` and invoked with three
	     * arguments: (value, index, array).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias unique
	     * @category Array
	     * @param {Array} array The array to inspect.
	     * @param {boolean} [isSorted] Specify the array is sorted.
	     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Array} Returns the new duplicate-value-free array.
	     * @example
	     *
	     * _.uniq([2, 1, 2]);
	     * // => [2, 1]
	     *
	     * // using `isSorted`
	     * _.uniq([1, 1, 2], true);
	     * // => [1, 2]
	     *
	     * // using an iteratee function
	     * _.uniq([1, 2.5, 1.5, 2], function(n) {
	     *   return this.floor(n);
	     * }, Math);
	     * // => [1, 2.5]
	     *
	     * // using the `_.property` callback shorthand
	     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
	     * // => [{ 'x': 1 }, { 'x': 2 }]
	     */
	    function uniq(array, isSorted, iteratee, thisArg) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      if (isSorted != null && typeof isSorted != 'boolean') {
	        thisArg = iteratee;
	        iteratee = isIterateeCall(array, isSorted, thisArg) ? undefined : isSorted;
	        isSorted = false;
	      }
	      var callback = getCallback();
	      if (!(iteratee == null && callback === baseCallback)) {
	        iteratee = callback(iteratee, thisArg, 3);
	      }
	      return (isSorted && getIndexOf() == baseIndexOf)
	        ? sortedUniq(array, iteratee)
	        : baseUniq(array, iteratee);
	    }
	
	    /**
	     * This method is like `_.zip` except that it accepts an array of grouped
	     * elements and creates an array regrouping the elements to their pre-zip
	     * configuration.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array of grouped elements to process.
	     * @returns {Array} Returns the new array of regrouped elements.
	     * @example
	     *
	     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
	     * // => [['fred', 30, true], ['barney', 40, false]]
	     *
	     * _.unzip(zipped);
	     * // => [['fred', 'barney'], [30, 40], [true, false]]
	     */
	    function unzip(array) {
	      if (!(array && array.length)) {
	        return [];
	      }
	      var index = -1,
	          length = 0;
	
	      array = arrayFilter(array, function(group) {
	        if (isArrayLike(group)) {
	          length = nativeMax(group.length, length);
	          return true;
	        }
	      });
	      var result = Array(length);
	      while (++index < length) {
	        result[index] = arrayMap(array, baseProperty(index));
	      }
	      return result;
	    }
	
	    /**
	     * This method is like `_.unzip` except that it accepts an iteratee to specify
	     * how regrouped values should be combined. The `iteratee` is bound to `thisArg`
	     * and invoked with four arguments: (accumulator, value, index, group).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array of grouped elements to process.
	     * @param {Function} [iteratee] The function to combine regrouped values.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Array} Returns the new array of regrouped elements.
	     * @example
	     *
	     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
	     * // => [[1, 10, 100], [2, 20, 200]]
	     *
	     * _.unzipWith(zipped, _.add);
	     * // => [3, 30, 300]
	     */
	    function unzipWith(array, iteratee, thisArg) {
	      var length = array ? array.length : 0;
	      if (!length) {
	        return [];
	      }
	      var result = unzip(array);
	      if (iteratee == null) {
	        return result;
	      }
	      iteratee = bindCallback(iteratee, thisArg, 4);
	      return arrayMap(result, function(group) {
	        return arrayReduce(group, iteratee, undefined, true);
	      });
	    }
	
	    /**
	     * Creates an array excluding all provided values using
	     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {Array} array The array to filter.
	     * @param {...*} [values] The values to exclude.
	     * @returns {Array} Returns the new array of filtered values.
	     * @example
	     *
	     * _.without([1, 2, 1, 3], 1, 2);
	     * // => [3]
	     */
	    var without = restParam(function(array, values) {
	      return isArrayLike(array)
	        ? baseDifference(array, values)
	        : [];
	    });
	
	    /**
	     * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
	     * of the provided arrays.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to inspect.
	     * @returns {Array} Returns the new array of values.
	     * @example
	     *
	     * _.xor([1, 2], [4, 2]);
	     * // => [1, 4]
	     */
	    function xor() {
	      var index = -1,
	          length = arguments.length;
	
	      while (++index < length) {
	        var array = arguments[index];
	        if (isArrayLike(array)) {
	          var result = result
	            ? arrayPush(baseDifference(result, array), baseDifference(array, result))
	            : array;
	        }
	      }
	      return result ? baseUniq(result) : [];
	    }
	
	    /**
	     * Creates an array of grouped elements, the first of which contains the first
	     * elements of the given arrays, the second of which contains the second elements
	     * of the given arrays, and so on.
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to process.
	     * @returns {Array} Returns the new array of grouped elements.
	     * @example
	     *
	     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
	     * // => [['fred', 30, true], ['barney', 40, false]]
	     */
	    var zip = restParam(unzip);
	
	    /**
	     * The inverse of `_.pairs`; this method returns an object composed from arrays
	     * of property names and values. Provide either a single two dimensional array,
	     * e.g. `[[key1, value1], [key2, value2]]` or two arrays, one of property names
	     * and one of corresponding values.
	     *
	     * @static
	     * @memberOf _
	     * @alias object
	     * @category Array
	     * @param {Array} props The property names.
	     * @param {Array} [values=[]] The property values.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * _.zipObject([['fred', 30], ['barney', 40]]);
	     * // => { 'fred': 30, 'barney': 40 }
	     *
	     * _.zipObject(['fred', 'barney'], [30, 40]);
	     * // => { 'fred': 30, 'barney': 40 }
	     */
	    function zipObject(props, values) {
	      var index = -1,
	          length = props ? props.length : 0,
	          result = {};
	
	      if (length && !values && !isArray(props[0])) {
	        values = [];
	      }
	      while (++index < length) {
	        var key = props[index];
	        if (values) {
	          result[key] = values[index];
	        } else if (key) {
	          result[key[0]] = key[1];
	        }
	      }
	      return result;
	    }
	
	    /**
	     * This method is like `_.zip` except that it accepts an iteratee to specify
	     * how grouped values should be combined. The `iteratee` is bound to `thisArg`
	     * and invoked with four arguments: (accumulator, value, index, group).
	     *
	     * @static
	     * @memberOf _
	     * @category Array
	     * @param {...Array} [arrays] The arrays to process.
	     * @param {Function} [iteratee] The function to combine grouped values.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Array} Returns the new array of grouped elements.
	     * @example
	     *
	     * _.zipWith([1, 2], [10, 20], [100, 200], _.add);
	     * // => [111, 222]
	     */
	    var zipWith = restParam(function(arrays) {
	      var length = arrays.length,
	          iteratee = length > 2 ? arrays[length - 2] : undefined,
	          thisArg = length > 1 ? arrays[length - 1] : undefined;
	
	      if (length > 2 && typeof iteratee == 'function') {
	        length -= 2;
	      } else {
	        iteratee = (length > 1 && typeof thisArg == 'function') ? (--length, thisArg) : undefined;
	        thisArg = undefined;
	      }
	      arrays.length = length;
	      return unzipWith(arrays, iteratee, thisArg);
	    });
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a `lodash` object that wraps `value` with explicit method
	     * chaining enabled.
	     *
	     * @static
	     * @memberOf _
	     * @category Chain
	     * @param {*} value The value to wrap.
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'age': 36 },
	     *   { 'user': 'fred',    'age': 40 },
	     *   { 'user': 'pebbles', 'age': 1 }
	     * ];
	     *
	     * var youngest = _.chain(users)
	     *   .sortBy('age')
	     *   .map(function(chr) {
	     *     return chr.user + ' is ' + chr.age;
	     *   })
	     *   .first()
	     *   .value();
	     * // => 'pebbles is 1'
	     */
	    function chain(value) {
	      var result = lodash(value);
	      result.__chain__ = true;
	      return result;
	    }
	
	    /**
	     * This method invokes `interceptor` and returns `value`. The interceptor is
	     * bound to `thisArg` and invoked with one argument; (value). The purpose of
	     * this method is to "tap into" a method chain in order to perform operations
	     * on intermediate results within the chain.
	     *
	     * @static
	     * @memberOf _
	     * @category Chain
	     * @param {*} value The value to provide to `interceptor`.
	     * @param {Function} interceptor The function to invoke.
	     * @param {*} [thisArg] The `this` binding of `interceptor`.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * _([1, 2, 3])
	     *  .tap(function(array) {
	     *    array.pop();
	     *  })
	     *  .reverse()
	     *  .value();
	     * // => [2, 1]
	     */
	    function tap(value, interceptor, thisArg) {
	      interceptor.call(thisArg, value);
	      return value;
	    }
	
	    /**
	     * This method is like `_.tap` except that it returns the result of `interceptor`.
	     *
	     * @static
	     * @memberOf _
	     * @category Chain
	     * @param {*} value The value to provide to `interceptor`.
	     * @param {Function} interceptor The function to invoke.
	     * @param {*} [thisArg] The `this` binding of `interceptor`.
	     * @returns {*} Returns the result of `interceptor`.
	     * @example
	     *
	     * _('  abc  ')
	     *  .chain()
	     *  .trim()
	     *  .thru(function(value) {
	     *    return [value];
	     *  })
	     *  .value();
	     * // => ['abc']
	     */
	    function thru(value, interceptor, thisArg) {
	      return interceptor.call(thisArg, value);
	    }
	
	    /**
	     * Enables explicit method chaining on the wrapper object.
	     *
	     * @name chain
	     * @memberOf _
	     * @category Chain
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * // without explicit chaining
	     * _(users).first();
	     * // => { 'user': 'barney', 'age': 36 }
	     *
	     * // with explicit chaining
	     * _(users).chain()
	     *   .first()
	     *   .pick('user')
	     *   .value();
	     * // => { 'user': 'barney' }
	     */
	    function wrapperChain() {
	      return chain(this);
	    }
	
	    /**
	     * Executes the chained sequence and returns the wrapped result.
	     *
	     * @name commit
	     * @memberOf _
	     * @category Chain
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var array = [1, 2];
	     * var wrapped = _(array).push(3);
	     *
	     * console.log(array);
	     * // => [1, 2]
	     *
	     * wrapped = wrapped.commit();
	     * console.log(array);
	     * // => [1, 2, 3]
	     *
	     * wrapped.last();
	     * // => 3
	     *
	     * console.log(array);
	     * // => [1, 2, 3]
	     */
	    function wrapperCommit() {
	      return new LodashWrapper(this.value(), this.__chain__);
	    }
	
	    /**
	     * Creates a new array joining a wrapped array with any additional arrays
	     * and/or values.
	     *
	     * @name concat
	     * @memberOf _
	     * @category Chain
	     * @param {...*} [values] The values to concatenate.
	     * @returns {Array} Returns the new concatenated array.
	     * @example
	     *
	     * var array = [1];
	     * var wrapped = _(array).concat(2, [3], [[4]]);
	     *
	     * console.log(wrapped.value());
	     * // => [1, 2, 3, [4]]
	     *
	     * console.log(array);
	     * // => [1]
	     */
	    var wrapperConcat = restParam(function(values) {
	      values = baseFlatten(values);
	      return this.thru(function(array) {
	        return arrayConcat(isArray(array) ? array : [toObject(array)], values);
	      });
	    });
	
	    /**
	     * Creates a clone of the chained sequence planting `value` as the wrapped value.
	     *
	     * @name plant
	     * @memberOf _
	     * @category Chain
	     * @returns {Object} Returns the new `lodash` wrapper instance.
	     * @example
	     *
	     * var array = [1, 2];
	     * var wrapped = _(array).map(function(value) {
	     *   return Math.pow(value, 2);
	     * });
	     *
	     * var other = [3, 4];
	     * var otherWrapped = wrapped.plant(other);
	     *
	     * otherWrapped.value();
	     * // => [9, 16]
	     *
	     * wrapped.value();
	     * // => [1, 4]
	     */
	    function wrapperPlant(value) {
	      var result,
	          parent = this;
	
	      while (parent instanceof baseLodash) {
	        var clone = wrapperClone(parent);
	        if (result) {
	          previous.__wrapped__ = clone;
	        } else {
	          result = clone;
	        }
	        var previous = clone;
	        parent = parent.__wrapped__;
	      }
	      previous.__wrapped__ = value;
	      return result;
	    }
	
	    /**
	     * Reverses the wrapped array so the first element becomes the last, the
	     * second element becomes the second to last, and so on.
	     *
	     * **Note:** This method mutates the wrapped array.
	     *
	     * @name reverse
	     * @memberOf _
	     * @category Chain
	     * @returns {Object} Returns the new reversed `lodash` wrapper instance.
	     * @example
	     *
	     * var array = [1, 2, 3];
	     *
	     * _(array).reverse().value()
	     * // => [3, 2, 1]
	     *
	     * console.log(array);
	     * // => [3, 2, 1]
	     */
	    function wrapperReverse() {
	      var value = this.__wrapped__;
	
	      var interceptor = function(value) {
	        return (wrapped && wrapped.__dir__ < 0) ? value : value.reverse();
	      };
	      if (value instanceof LazyWrapper) {
	        var wrapped = value;
	        if (this.__actions__.length) {
	          wrapped = new LazyWrapper(this);
	        }
	        wrapped = wrapped.reverse();
	        wrapped.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
	        return new LodashWrapper(wrapped, this.__chain__);
	      }
	      return this.thru(interceptor);
	    }
	
	    /**
	     * Produces the result of coercing the unwrapped value to a string.
	     *
	     * @name toString
	     * @memberOf _
	     * @category Chain
	     * @returns {string} Returns the coerced string value.
	     * @example
	     *
	     * _([1, 2, 3]).toString();
	     * // => '1,2,3'
	     */
	    function wrapperToString() {
	      return (this.value() + '');
	    }
	
	    /**
	     * Executes the chained sequence to extract the unwrapped value.
	     *
	     * @name value
	     * @memberOf _
	     * @alias run, toJSON, valueOf
	     * @category Chain
	     * @returns {*} Returns the resolved unwrapped value.
	     * @example
	     *
	     * _([1, 2, 3]).value();
	     * // => [1, 2, 3]
	     */
	    function wrapperValue() {
	      return baseWrapperValue(this.__wrapped__, this.__actions__);
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates an array of elements corresponding to the given keys, or indexes,
	     * of `collection`. Keys may be specified as individual arguments or as arrays
	     * of keys.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {...(number|number[]|string|string[])} [props] The property names
	     *  or indexes of elements to pick, specified individually or in arrays.
	     * @returns {Array} Returns the new array of picked elements.
	     * @example
	     *
	     * _.at(['a', 'b', 'c'], [0, 2]);
	     * // => ['a', 'c']
	     *
	     * _.at(['barney', 'fred', 'pebbles'], 0, 2);
	     * // => ['barney', 'pebbles']
	     */
	    var at = restParam(function(collection, props) {
	      return baseAt(collection, baseFlatten(props));
	    });
	
	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through `iteratee`. The corresponding value
	     * of each key is the number of times the key was returned by `iteratee`.
	     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * _.countBy([4.3, 6.1, 6.4], function(n) {
	     *   return Math.floor(n);
	     * });
	     * // => { '4': 1, '6': 2 }
	     *
	     * _.countBy([4.3, 6.1, 6.4], function(n) {
	     *   return this.floor(n);
	     * }, Math);
	     * // => { '4': 1, '6': 2 }
	     *
	     * _.countBy(['one', 'two', 'three'], 'length');
	     * // => { '3': 2, '5': 1 }
	     */
	    var countBy = createAggregator(function(result, value, key) {
	      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
	    });
	
	    /**
	     * Checks if `predicate` returns truthy for **all** elements of `collection`.
	     * The predicate is bound to `thisArg` and invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias all
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {boolean} Returns `true` if all elements pass the predicate check,
	     *  else `false`.
	     * @example
	     *
	     * _.every([true, 1, null, 'yes'], Boolean);
	     * // => false
	     *
	     * var users = [
	     *   { 'user': 'barney', 'active': false },
	     *   { 'user': 'fred',   'active': false }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.every(users, { 'user': 'barney', 'active': false });
	     * // => false
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.every(users, 'active', false);
	     * // => true
	     *
	     * // using the `_.property` callback shorthand
	     * _.every(users, 'active');
	     * // => false
	     */
	    function every(collection, predicate, thisArg) {
	      var func = isArray(collection) ? arrayEvery : baseEvery;
	      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
	        predicate = undefined;
	      }
	      if (typeof predicate != 'function' || thisArg !== undefined) {
	        predicate = getCallback(predicate, thisArg, 3);
	      }
	      return func(collection, predicate);
	    }
	
	    /**
	     * Iterates over elements of `collection`, returning an array of all elements
	     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
	     * invoked with three arguments: (value, index|key, collection).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias select
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the new filtered array.
	     * @example
	     *
	     * _.filter([4, 5, 6], function(n) {
	     *   return n % 2 == 0;
	     * });
	     * // => [4, 6]
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': true },
	     *   { 'user': 'fred',   'age': 40, 'active': false }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
	     * // => ['barney']
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.pluck(_.filter(users, 'active', false), 'user');
	     * // => ['fred']
	     *
	     * // using the `_.property` callback shorthand
	     * _.pluck(_.filter(users, 'active'), 'user');
	     * // => ['barney']
	     */
	    function filter(collection, predicate, thisArg) {
	      var func = isArray(collection) ? arrayFilter : baseFilter;
	      predicate = getCallback(predicate, thisArg, 3);
	      return func(collection, predicate);
	    }
	
	    /**
	     * Iterates over elements of `collection`, returning the first element
	     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
	     * invoked with three arguments: (value, index|key, collection).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias detect
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {*} Returns the matched element, else `undefined`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney',  'age': 36, 'active': true },
	     *   { 'user': 'fred',    'age': 40, 'active': false },
	     *   { 'user': 'pebbles', 'age': 1,  'active': true }
	     * ];
	     *
	     * _.result(_.find(users, function(chr) {
	     *   return chr.age < 40;
	     * }), 'user');
	     * // => 'barney'
	     *
	     * // using the `_.matches` callback shorthand
	     * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
	     * // => 'pebbles'
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.result(_.find(users, 'active', false), 'user');
	     * // => 'fred'
	     *
	     * // using the `_.property` callback shorthand
	     * _.result(_.find(users, 'active'), 'user');
	     * // => 'barney'
	     */
	    var find = createFind(baseEach);
	
	    /**
	     * This method is like `_.find` except that it iterates over elements of
	     * `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {*} Returns the matched element, else `undefined`.
	     * @example
	     *
	     * _.findLast([1, 2, 3, 4], function(n) {
	     *   return n % 2 == 1;
	     * });
	     * // => 3
	     */
	    var findLast = createFind(baseEachRight, true);
	
	    /**
	     * Performs a deep comparison between each element in `collection` and the
	     * source object, returning the first element that has equivalent property
	     * values.
	     *
	     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
	     * numbers, `Object` objects, regexes, and strings. Objects are compared by
	     * their own, not inherited, enumerable properties. For comparing a single
	     * own or inherited property value see `_.matchesProperty`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to search.
	     * @param {Object} source The object of property values to match.
	     * @returns {*} Returns the matched element, else `undefined`.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': true },
	     *   { 'user': 'fred',   'age': 40, 'active': false }
	     * ];
	     *
	     * _.result(_.findWhere(users, { 'age': 36, 'active': true }), 'user');
	     * // => 'barney'
	     *
	     * _.result(_.findWhere(users, { 'age': 40, 'active': false }), 'user');
	     * // => 'fred'
	     */
	    function findWhere(collection, source) {
	      return find(collection, baseMatches(source));
	    }
	
	    /**
	     * Iterates over elements of `collection` invoking `iteratee` for each element.
	     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
	     * (value, index|key, collection). Iteratee functions may exit iteration early
	     * by explicitly returning `false`.
	     *
	     * **Note:** As with other "Collections" methods, objects with a "length" property
	     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
	     * may be used for object iteration.
	     *
	     * @static
	     * @memberOf _
	     * @alias each
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Array|Object|string} Returns `collection`.
	     * @example
	     *
	     * _([1, 2]).forEach(function(n) {
	     *   console.log(n);
	     * }).value();
	     * // => logs each value from left to right and returns the array
	     *
	     * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
	     *   console.log(n, key);
	     * });
	     * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
	     */
	    var forEach = createForEach(arrayEach, baseEach);
	
	    /**
	     * This method is like `_.forEach` except that it iterates over elements of
	     * `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @alias eachRight
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Array|Object|string} Returns `collection`.
	     * @example
	     *
	     * _([1, 2]).forEachRight(function(n) {
	     *   console.log(n);
	     * }).value();
	     * // => logs each value from right to left and returns the array
	     */
	    var forEachRight = createForEach(arrayEachRight, baseEachRight);
	
	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through `iteratee`. The corresponding value
	     * of each key is an array of the elements responsible for generating the key.
	     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * _.groupBy([4.2, 6.1, 6.4], function(n) {
	     *   return Math.floor(n);
	     * });
	     * // => { '4': [4.2], '6': [6.1, 6.4] }
	     *
	     * _.groupBy([4.2, 6.1, 6.4], function(n) {
	     *   return this.floor(n);
	     * }, Math);
	     * // => { '4': [4.2], '6': [6.1, 6.4] }
	     *
	     * // using the `_.property` callback shorthand
	     * _.groupBy(['one', 'two', 'three'], 'length');
	     * // => { '3': ['one', 'two'], '5': ['three'] }
	     */
	    var groupBy = createAggregator(function(result, value, key) {
	      if (hasOwnProperty.call(result, key)) {
	        result[key].push(value);
	      } else {
	        result[key] = [value];
	      }
	    });
	
	    /**
	     * Checks if `value` is in `collection` using
	     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
	     * from the end of `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @alias contains, include
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to search.
	     * @param {*} target The value to search for.
	     * @param {number} [fromIndex=0] The index to search from.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
	     * @returns {boolean} Returns `true` if a matching element is found, else `false`.
	     * @example
	     *
	     * _.includes([1, 2, 3], 1);
	     * // => true
	     *
	     * _.includes([1, 2, 3], 1, 2);
	     * // => false
	     *
	     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
	     * // => true
	     *
	     * _.includes('pebbles', 'eb');
	     * // => true
	     */
	    function includes(collection, target, fromIndex, guard) {
	      var length = collection ? getLength(collection) : 0;
	      if (!isLength(length)) {
	        collection = values(collection);
	        length = collection.length;
	      }
	      if (typeof fromIndex != 'number' || (guard && isIterateeCall(target, fromIndex, guard))) {
	        fromIndex = 0;
	      } else {
	        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
	      }
	      return (typeof collection == 'string' || !isArray(collection) && isString(collection))
	        ? (fromIndex <= length && collection.indexOf(target, fromIndex) > -1)
	        : (!!length && getIndexOf(collection, target, fromIndex) > -1);
	    }
	
	    /**
	     * Creates an object composed of keys generated from the results of running
	     * each element of `collection` through `iteratee`. The corresponding value
	     * of each key is the last element responsible for generating the key. The
	     * iteratee function is bound to `thisArg` and invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns the composed aggregate object.
	     * @example
	     *
	     * var keyData = [
	     *   { 'dir': 'left', 'code': 97 },
	     *   { 'dir': 'right', 'code': 100 }
	     * ];
	     *
	     * _.indexBy(keyData, 'dir');
	     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
	     *
	     * _.indexBy(keyData, function(object) {
	     *   return String.fromCharCode(object.code);
	     * });
	     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
	     *
	     * _.indexBy(keyData, function(object) {
	     *   return this.fromCharCode(object.code);
	     * }, String);
	     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
	     */
	    var indexBy = createAggregator(function(result, value, key) {
	      result[key] = value;
	    });
	
	    /**
	     * Invokes the method at `path` of each element in `collection`, returning
	     * an array of the results of each invoked method. Any additional arguments
	     * are provided to each invoked method. If `methodName` is a function it is
	     * invoked for, and `this` bound to, each element in `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Array|Function|string} path The path of the method to invoke or
	     *  the function invoked per iteration.
	     * @param {...*} [args] The arguments to invoke the method with.
	     * @returns {Array} Returns the array of results.
	     * @example
	     *
	     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
	     * // => [[1, 5, 7], [1, 2, 3]]
	     *
	     * _.invoke([123, 456], String.prototype.split, '');
	     * // => [['1', '2', '3'], ['4', '5', '6']]
	     */
	    var invoke = restParam(function(collection, path, args) {
	      var index = -1,
	          isFunc = typeof path == 'function',
	          isProp = isKey(path),
	          result = isArrayLike(collection) ? Array(collection.length) : [];
	
	      baseEach(collection, function(value) {
	        var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
	        result[++index] = func ? func.apply(value, args) : invokePath(value, path, args);
	      });
	      return result;
	    });
	
	    /**
	     * Creates an array of values by running each element in `collection` through
	     * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
	     * arguments: (value, index|key, collection).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * Many lodash methods are guarded to work as iteratees for methods like
	     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
	     *
	     * The guarded methods are:
	     * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
	     * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
	     * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
	     * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
	     * `sum`, `uniq`, and `words`
	     *
	     * @static
	     * @memberOf _
	     * @alias collect
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Array} Returns the new mapped array.
	     * @example
	     *
	     * function timesThree(n) {
	     *   return n * 3;
	     * }
	     *
	     * _.map([1, 2], timesThree);
	     * // => [3, 6]
	     *
	     * _.map({ 'a': 1, 'b': 2 }, timesThree);
	     * // => [3, 6] (iteration order is not guaranteed)
	     *
	     * var users = [
	     *   { 'user': 'barney' },
	     *   { 'user': 'fred' }
	     * ];
	     *
	     * // using the `_.property` callback shorthand
	     * _.map(users, 'user');
	     * // => ['barney', 'fred']
	     */
	    function map(collection, iteratee, thisArg) {
	      var func = isArray(collection) ? arrayMap : baseMap;
	      iteratee = getCallback(iteratee, thisArg, 3);
	      return func(collection, iteratee);
	    }
	
	    /**
	     * Creates an array of elements split into two groups, the first of which
	     * contains elements `predicate` returns truthy for, while the second of which
	     * contains elements `predicate` returns falsey for. The predicate is bound
	     * to `thisArg` and invoked with three arguments: (value, index|key, collection).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the array of grouped elements.
	     * @example
	     *
	     * _.partition([1, 2, 3], function(n) {
	     *   return n % 2;
	     * });
	     * // => [[1, 3], [2]]
	     *
	     * _.partition([1.2, 2.3, 3.4], function(n) {
	     *   return this.floor(n) % 2;
	     * }, Math);
	     * // => [[1.2, 3.4], [2.3]]
	     *
	     * var users = [
	     *   { 'user': 'barney',  'age': 36, 'active': false },
	     *   { 'user': 'fred',    'age': 40, 'active': true },
	     *   { 'user': 'pebbles', 'age': 1,  'active': false }
	     * ];
	     *
	     * var mapper = function(array) {
	     *   return _.pluck(array, 'user');
	     * };
	     *
	     * // using the `_.matches` callback shorthand
	     * _.map(_.partition(users, { 'age': 1, 'active': false }), mapper);
	     * // => [['pebbles'], ['barney', 'fred']]
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.map(_.partition(users, 'active', false), mapper);
	     * // => [['barney', 'pebbles'], ['fred']]
	     *
	     * // using the `_.property` callback shorthand
	     * _.map(_.partition(users, 'active'), mapper);
	     * // => [['fred'], ['barney', 'pebbles']]
	     */
	    var partition = createAggregator(function(result, value, key) {
	      result[key ? 0 : 1].push(value);
	    }, function() { return [[], []]; });
	
	    /**
	     * Gets the property value of `path` from all elements in `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Array|string} path The path of the property to pluck.
	     * @returns {Array} Returns the property values.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.pluck(users, 'user');
	     * // => ['barney', 'fred']
	     *
	     * var userIndex = _.indexBy(users, 'user');
	     * _.pluck(userIndex, 'age');
	     * // => [36, 40] (iteration order is not guaranteed)
	     */
	    function pluck(collection, path) {
	      return map(collection, property(path));
	    }
	
	    /**
	     * Reduces `collection` to a value which is the accumulated result of running
	     * each element in `collection` through `iteratee`, where each successive
	     * invocation is supplied the return value of the previous. If `accumulator`
	     * is not provided the first element of `collection` is used as the initial
	     * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
	     * (accumulator, value, index|key, collection).
	     *
	     * Many lodash methods are guarded to work as iteratees for methods like
	     * `_.reduce`, `_.reduceRight`, and `_.transform`.
	     *
	     * The guarded methods are:
	     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `sortByAll`,
	     * and `sortByOrder`
	     *
	     * @static
	     * @memberOf _
	     * @alias foldl, inject
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [accumulator] The initial value.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * _.reduce([1, 2], function(total, n) {
	     *   return total + n;
	     * });
	     * // => 3
	     *
	     * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
	     *   result[key] = n * 3;
	     *   return result;
	     * }, {});
	     * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
	     */
	    var reduce = createReduce(arrayReduce, baseEach);
	
	    /**
	     * This method is like `_.reduce` except that it iterates over elements of
	     * `collection` from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @alias foldr
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [accumulator] The initial value.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * var array = [[0, 1], [2, 3], [4, 5]];
	     *
	     * _.reduceRight(array, function(flattened, other) {
	     *   return flattened.concat(other);
	     * }, []);
	     * // => [4, 5, 2, 3, 0, 1]
	     */
	    var reduceRight = createReduce(arrayReduceRight, baseEachRight);
	
	    /**
	     * The opposite of `_.filter`; this method returns the elements of `collection`
	     * that `predicate` does **not** return truthy for.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Array} Returns the new filtered array.
	     * @example
	     *
	     * _.reject([1, 2, 3, 4], function(n) {
	     *   return n % 2 == 0;
	     * });
	     * // => [1, 3]
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': false },
	     *   { 'user': 'fred',   'age': 40, 'active': true }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.pluck(_.reject(users, { 'age': 40, 'active': true }), 'user');
	     * // => ['barney']
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.pluck(_.reject(users, 'active', false), 'user');
	     * // => ['fred']
	     *
	     * // using the `_.property` callback shorthand
	     * _.pluck(_.reject(users, 'active'), 'user');
	     * // => ['barney']
	     */
	    function reject(collection, predicate, thisArg) {
	      var func = isArray(collection) ? arrayFilter : baseFilter;
	      predicate = getCallback(predicate, thisArg, 3);
	      return func(collection, function(value, index, collection) {
	        return !predicate(value, index, collection);
	      });
	    }
	
	    /**
	     * Gets a random element or `n` random elements from a collection.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to sample.
	     * @param {number} [n] The number of elements to sample.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {*} Returns the random sample(s).
	     * @example
	     *
	     * _.sample([1, 2, 3, 4]);
	     * // => 2
	     *
	     * _.sample([1, 2, 3, 4], 2);
	     * // => [3, 1]
	     */
	    function sample(collection, n, guard) {
	      if (guard ? isIterateeCall(collection, n, guard) : n == null) {
	        collection = toIterable(collection);
	        var length = collection.length;
	        return length > 0 ? collection[baseRandom(0, length - 1)] : undefined;
	      }
	      var index = -1,
	          result = toArray(collection),
	          length = result.length,
	          lastIndex = length - 1;
	
	      n = nativeMin(n < 0 ? 0 : (+n || 0), length);
	      while (++index < n) {
	        var rand = baseRandom(index, lastIndex),
	            value = result[rand];
	
	        result[rand] = result[index];
	        result[index] = value;
	      }
	      result.length = n;
	      return result;
	    }
	
	    /**
	     * Creates an array of shuffled values, using a version of the
	     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to shuffle.
	     * @returns {Array} Returns the new shuffled array.
	     * @example
	     *
	     * _.shuffle([1, 2, 3, 4]);
	     * // => [4, 1, 3, 2]
	     */
	    function shuffle(collection) {
	      return sample(collection, POSITIVE_INFINITY);
	    }
	
	    /**
	     * Gets the size of `collection` by returning its length for array-like
	     * values or the number of own enumerable properties for objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to inspect.
	     * @returns {number} Returns the size of `collection`.
	     * @example
	     *
	     * _.size([1, 2, 3]);
	     * // => 3
	     *
	     * _.size({ 'a': 1, 'b': 2 });
	     * // => 2
	     *
	     * _.size('pebbles');
	     * // => 7
	     */
	    function size(collection) {
	      var length = collection ? getLength(collection) : 0;
	      return isLength(length) ? length : keys(collection).length;
	    }
	
	    /**
	     * Checks if `predicate` returns truthy for **any** element of `collection`.
	     * The function returns as soon as it finds a passing value and does not iterate
	     * over the entire collection. The predicate is bound to `thisArg` and invoked
	     * with three arguments: (value, index|key, collection).
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias any
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {boolean} Returns `true` if any element passes the predicate check,
	     *  else `false`.
	     * @example
	     *
	     * _.some([null, 0, 'yes', false], Boolean);
	     * // => true
	     *
	     * var users = [
	     *   { 'user': 'barney', 'active': true },
	     *   { 'user': 'fred',   'active': false }
	     * ];
	     *
	     * // using the `_.matches` callback shorthand
	     * _.some(users, { 'user': 'barney', 'active': false });
	     * // => false
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.some(users, 'active', false);
	     * // => true
	     *
	     * // using the `_.property` callback shorthand
	     * _.some(users, 'active');
	     * // => true
	     */
	    function some(collection, predicate, thisArg) {
	      var func = isArray(collection) ? arraySome : baseSome;
	      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
	        predicate = undefined;
	      }
	      if (typeof predicate != 'function' || thisArg !== undefined) {
	        predicate = getCallback(predicate, thisArg, 3);
	      }
	      return func(collection, predicate);
	    }
	
	    /**
	     * Creates an array of elements, sorted in ascending order by the results of
	     * running each element in a collection through `iteratee`. This method performs
	     * a stable sort, that is, it preserves the original sort order of equal elements.
	     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
	     * (value, index|key, collection).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Array} Returns the new sorted array.
	     * @example
	     *
	     * _.sortBy([1, 2, 3], function(n) {
	     *   return Math.sin(n);
	     * });
	     * // => [3, 1, 2]
	     *
	     * _.sortBy([1, 2, 3], function(n) {
	     *   return this.sin(n);
	     * }, Math);
	     * // => [3, 1, 2]
	     *
	     * var users = [
	     *   { 'user': 'fred' },
	     *   { 'user': 'pebbles' },
	     *   { 'user': 'barney' }
	     * ];
	     *
	     * // using the `_.property` callback shorthand
	     * _.pluck(_.sortBy(users, 'user'), 'user');
	     * // => ['barney', 'fred', 'pebbles']
	     */
	    function sortBy(collection, iteratee, thisArg) {
	      if (collection == null) {
	        return [];
	      }
	      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
	        iteratee = undefined;
	      }
	      var index = -1;
	      iteratee = getCallback(iteratee, thisArg, 3);
	
	      var result = baseMap(collection, function(value, key, collection) {
	        return { 'criteria': iteratee(value, key, collection), 'index': ++index, 'value': value };
	      });
	      return baseSortBy(result, compareAscending);
	    }
	
	    /**
	     * This method is like `_.sortBy` except that it can sort by multiple iteratees
	     * or property names.
	     *
	     * If a property name is provided for an iteratee the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If an object is provided for an iteratee the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {...(Function|Function[]|Object|Object[]|string|string[])} iteratees
	     *  The iteratees to sort by, specified as individual values or arrays of values.
	     * @returns {Array} Returns the new sorted array.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'fred',   'age': 48 },
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 42 },
	     *   { 'user': 'barney', 'age': 34 }
	     * ];
	     *
	     * _.map(_.sortByAll(users, ['user', 'age']), _.values);
	     * // => [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
	     *
	     * _.map(_.sortByAll(users, 'user', function(chr) {
	     *   return Math.floor(chr.age / 10);
	     * }), _.values);
	     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
	     */
	    var sortByAll = restParam(function(collection, iteratees) {
	      if (collection == null) {
	        return [];
	      }
	      var guard = iteratees[2];
	      if (guard && isIterateeCall(iteratees[0], iteratees[1], guard)) {
	        iteratees.length = 1;
	      }
	      return baseSortByOrder(collection, baseFlatten(iteratees), []);
	    });
	
	    /**
	     * This method is like `_.sortByAll` except that it allows specifying the
	     * sort orders of the iteratees to sort by. If `orders` is unspecified, all
	     * values are sorted in ascending order. Otherwise, a value is sorted in
	     * ascending order if its corresponding order is "asc", and descending if "desc".
	     *
	     * If a property name is provided for an iteratee the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If an object is provided for an iteratee the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
	     * @param {boolean[]} [orders] The sort orders of `iteratees`.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
	     * @returns {Array} Returns the new sorted array.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'fred',   'age': 48 },
	     *   { 'user': 'barney', 'age': 34 },
	     *   { 'user': 'fred',   'age': 42 },
	     *   { 'user': 'barney', 'age': 36 }
	     * ];
	     *
	     * // sort by `user` in ascending order and by `age` in descending order
	     * _.map(_.sortByOrder(users, ['user', 'age'], ['asc', 'desc']), _.values);
	     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
	     */
	    function sortByOrder(collection, iteratees, orders, guard) {
	      if (collection == null) {
	        return [];
	      }
	      if (guard && isIterateeCall(iteratees, orders, guard)) {
	        orders = undefined;
	      }
	      if (!isArray(iteratees)) {
	        iteratees = iteratees == null ? [] : [iteratees];
	      }
	      if (!isArray(orders)) {
	        orders = orders == null ? [] : [orders];
	      }
	      return baseSortByOrder(collection, iteratees, orders);
	    }
	
	    /**
	     * Performs a deep comparison between each element in `collection` and the
	     * source object, returning an array of all elements that have equivalent
	     * property values.
	     *
	     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
	     * numbers, `Object` objects, regexes, and strings. Objects are compared by
	     * their own, not inherited, enumerable properties. For comparing a single
	     * own or inherited property value see `_.matchesProperty`.
	     *
	     * @static
	     * @memberOf _
	     * @category Collection
	     * @param {Array|Object|string} collection The collection to search.
	     * @param {Object} source The object of property values to match.
	     * @returns {Array} Returns the new filtered array.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
	     *   { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
	     * ];
	     *
	     * _.pluck(_.where(users, { 'age': 36, 'active': false }), 'user');
	     * // => ['barney']
	     *
	     * _.pluck(_.where(users, { 'pets': ['dino'] }), 'user');
	     * // => ['fred']
	     */
	    function where(collection, source) {
	      return filter(collection, baseMatches(source));
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Gets the number of milliseconds that have elapsed since the Unix epoch
	     * (1 January 1970 00:00:00 UTC).
	     *
	     * @static
	     * @memberOf _
	     * @category Date
	     * @example
	     *
	     * _.defer(function(stamp) {
	     *   console.log(_.now() - stamp);
	     * }, _.now());
	     * // => logs the number of milliseconds it took for the deferred function to be invoked
	     */
	    var now = nativeNow || function() {
	      return new Date().getTime();
	    };
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * The opposite of `_.before`; this method creates a function that invokes
	     * `func` once it is called `n` or more times.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {number} n The number of calls before `func` is invoked.
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var saves = ['profile', 'settings'];
	     *
	     * var done = _.after(saves.length, function() {
	     *   console.log('done saving!');
	     * });
	     *
	     * _.forEach(saves, function(type) {
	     *   asyncSave({ 'type': type, 'complete': done });
	     * });
	     * // => logs 'done saving!' after the two async saves have completed
	     */
	    function after(n, func) {
	      if (typeof func != 'function') {
	        if (typeof n == 'function') {
	          var temp = n;
	          n = func;
	          func = temp;
	        } else {
	          throw new TypeError(FUNC_ERROR_TEXT);
	        }
	      }
	      n = nativeIsFinite(n = +n) ? n : 0;
	      return function() {
	        if (--n < 1) {
	          return func.apply(this, arguments);
	        }
	      };
	    }
	
	    /**
	     * Creates a function that accepts up to `n` arguments ignoring any
	     * additional arguments.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to cap arguments for.
	     * @param {number} [n=func.length] The arity cap.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
	     * // => [6, 8, 10]
	     */
	    function ary(func, n, guard) {
	      if (guard && isIterateeCall(func, n, guard)) {
	        n = undefined;
	      }
	      n = (func && n == null) ? func.length : nativeMax(+n || 0, 0);
	      return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
	    }
	
	    /**
	     * Creates a function that invokes `func`, with the `this` binding and arguments
	     * of the created function, while it is called less than `n` times. Subsequent
	     * calls to the created function return the result of the last `func` invocation.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {number} n The number of calls at which `func` is no longer invoked.
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * jQuery('#add').on('click', _.before(5, addContactToList));
	     * // => allows adding up to 4 contacts to the list
	     */
	    function before(n, func) {
	      var result;
	      if (typeof func != 'function') {
	        if (typeof n == 'function') {
	          var temp = n;
	          n = func;
	          func = temp;
	        } else {
	          throw new TypeError(FUNC_ERROR_TEXT);
	        }
	      }
	      return function() {
	        if (--n > 0) {
	          result = func.apply(this, arguments);
	        }
	        if (n <= 1) {
	          func = undefined;
	        }
	        return result;
	      };
	    }
	
	    /**
	     * Creates a function that invokes `func` with the `this` binding of `thisArg`
	     * and prepends any additional `_.bind` arguments to those provided to the
	     * bound function.
	     *
	     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
	     * may be used as a placeholder for partially applied arguments.
	     *
	     * **Note:** Unlike native `Function#bind` this method does not set the "length"
	     * property of bound functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to bind.
	     * @param {*} thisArg The `this` binding of `func`.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new bound function.
	     * @example
	     *
	     * var greet = function(greeting, punctuation) {
	     *   return greeting + ' ' + this.user + punctuation;
	     * };
	     *
	     * var object = { 'user': 'fred' };
	     *
	     * var bound = _.bind(greet, object, 'hi');
	     * bound('!');
	     * // => 'hi fred!'
	     *
	     * // using placeholders
	     * var bound = _.bind(greet, object, _, '!');
	     * bound('hi');
	     * // => 'hi fred!'
	     */
	    var bind = restParam(function(func, thisArg, partials) {
	      var bitmask = BIND_FLAG;
	      if (partials.length) {
	        var holders = replaceHolders(partials, bind.placeholder);
	        bitmask |= PARTIAL_FLAG;
	      }
	      return createWrapper(func, bitmask, thisArg, partials, holders);
	    });
	
	    /**
	     * Binds methods of an object to the object itself, overwriting the existing
	     * method. Method names may be specified as individual arguments or as arrays
	     * of method names. If no method names are provided all enumerable function
	     * properties, own and inherited, of `object` are bound.
	     *
	     * **Note:** This method does not set the "length" property of bound functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Object} object The object to bind and assign the bound methods to.
	     * @param {...(string|string[])} [methodNames] The object method names to bind,
	     *  specified as individual method names or arrays of method names.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * var view = {
	     *   'label': 'docs',
	     *   'onClick': function() {
	     *     console.log('clicked ' + this.label);
	     *   }
	     * };
	     *
	     * _.bindAll(view);
	     * jQuery('#docs').on('click', view.onClick);
	     * // => logs 'clicked docs' when the element is clicked
	     */
	    var bindAll = restParam(function(object, methodNames) {
	      methodNames = methodNames.length ? baseFlatten(methodNames) : functions(object);
	
	      var index = -1,
	          length = methodNames.length;
	
	      while (++index < length) {
	        var key = methodNames[index];
	        object[key] = createWrapper(object[key], BIND_FLAG, object);
	      }
	      return object;
	    });
	
	    /**
	     * Creates a function that invokes the method at `object[key]` and prepends
	     * any additional `_.bindKey` arguments to those provided to the bound function.
	     *
	     * This method differs from `_.bind` by allowing bound functions to reference
	     * methods that may be redefined or don't yet exist.
	     * See [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
	     * for more details.
	     *
	     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for partially applied arguments.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Object} object The object the method belongs to.
	     * @param {string} key The key of the method.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new bound function.
	     * @example
	     *
	     * var object = {
	     *   'user': 'fred',
	     *   'greet': function(greeting, punctuation) {
	     *     return greeting + ' ' + this.user + punctuation;
	     *   }
	     * };
	     *
	     * var bound = _.bindKey(object, 'greet', 'hi');
	     * bound('!');
	     * // => 'hi fred!'
	     *
	     * object.greet = function(greeting, punctuation) {
	     *   return greeting + 'ya ' + this.user + punctuation;
	     * };
	     *
	     * bound('!');
	     * // => 'hiya fred!'
	     *
	     * // using placeholders
	     * var bound = _.bindKey(object, 'greet', _, '!');
	     * bound('hi');
	     * // => 'hiya fred!'
	     */
	    var bindKey = restParam(function(object, key, partials) {
	      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
	      if (partials.length) {
	        var holders = replaceHolders(partials, bindKey.placeholder);
	        bitmask |= PARTIAL_FLAG;
	      }
	      return createWrapper(key, bitmask, object, partials, holders);
	    });
	
	    /**
	     * Creates a function that accepts one or more arguments of `func` that when
	     * called either invokes `func` returning its result, if all `func` arguments
	     * have been provided, or returns a function that accepts one or more of the
	     * remaining `func` arguments, and so on. The arity of `func` may be specified
	     * if `func.length` is not sufficient.
	     *
	     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
	     * may be used as a placeholder for provided arguments.
	     *
	     * **Note:** This method does not set the "length" property of curried functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to curry.
	     * @param {number} [arity=func.length] The arity of `func`.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Function} Returns the new curried function.
	     * @example
	     *
	     * var abc = function(a, b, c) {
	     *   return [a, b, c];
	     * };
	     *
	     * var curried = _.curry(abc);
	     *
	     * curried(1)(2)(3);
	     * // => [1, 2, 3]
	     *
	     * curried(1, 2)(3);
	     * // => [1, 2, 3]
	     *
	     * curried(1, 2, 3);
	     * // => [1, 2, 3]
	     *
	     * // using placeholders
	     * curried(1)(_, 3)(2);
	     * // => [1, 2, 3]
	     */
	    var curry = createCurry(CURRY_FLAG);
	
	    /**
	     * This method is like `_.curry` except that arguments are applied to `func`
	     * in the manner of `_.partialRight` instead of `_.partial`.
	     *
	     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for provided arguments.
	     *
	     * **Note:** This method does not set the "length" property of curried functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to curry.
	     * @param {number} [arity=func.length] The arity of `func`.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Function} Returns the new curried function.
	     * @example
	     *
	     * var abc = function(a, b, c) {
	     *   return [a, b, c];
	     * };
	     *
	     * var curried = _.curryRight(abc);
	     *
	     * curried(3)(2)(1);
	     * // => [1, 2, 3]
	     *
	     * curried(2, 3)(1);
	     * // => [1, 2, 3]
	     *
	     * curried(1, 2, 3);
	     * // => [1, 2, 3]
	     *
	     * // using placeholders
	     * curried(3)(1, _)(2);
	     * // => [1, 2, 3]
	     */
	    var curryRight = createCurry(CURRY_RIGHT_FLAG);
	
	    /**
	     * Creates a debounced function that delays invoking `func` until after `wait`
	     * milliseconds have elapsed since the last time the debounced function was
	     * invoked. The debounced function comes with a `cancel` method to cancel
	     * delayed invocations. Provide an options object to indicate that `func`
	     * should be invoked on the leading and/or trailing edge of the `wait` timeout.
	     * Subsequent calls to the debounced function return the result of the last
	     * `func` invocation.
	     *
	     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	     * on the trailing edge of the timeout only if the the debounced function is
	     * invoked more than once during the `wait` timeout.
	     *
	     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	     * for details over the differences between `_.debounce` and `_.throttle`.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to debounce.
	     * @param {number} [wait=0] The number of milliseconds to delay.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.leading=false] Specify invoking on the leading
	     *  edge of the timeout.
	     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
	     *  delayed before it is invoked.
	     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	     *  edge of the timeout.
	     * @returns {Function} Returns the new debounced function.
	     * @example
	     *
	     * // avoid costly calculations while the window size is in flux
	     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	     *
	     * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
	     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
	     *   'leading': true,
	     *   'trailing': false
	     * }));
	     *
	     * // ensure `batchLog` is invoked once after 1 second of debounced calls
	     * var source = new EventSource('/stream');
	     * jQuery(source).on('message', _.debounce(batchLog, 250, {
	     *   'maxWait': 1000
	     * }));
	     *
	     * // cancel a debounced call
	     * var todoChanges = _.debounce(batchLog, 1000);
	     * Object.observe(models.todo, todoChanges);
	     *
	     * Object.observe(models, function(changes) {
	     *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
	     *     todoChanges.cancel();
	     *   }
	     * }, ['delete']);
	     *
	     * // ...at some point `models.todo` is changed
	     * models.todo.completed = true;
	     *
	     * // ...before 1 second has passed `models.todo` is deleted
	     * // which cancels the debounced `todoChanges` call
	     * delete models.todo;
	     */
	    function debounce(func, wait, options) {
	      var args,
	          maxTimeoutId,
	          result,
	          stamp,
	          thisArg,
	          timeoutId,
	          trailingCall,
	          lastCalled = 0,
	          maxWait = false,
	          trailing = true;
	
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      wait = wait < 0 ? 0 : (+wait || 0);
	      if (options === true) {
	        var leading = true;
	        trailing = false;
	      } else if (isObject(options)) {
	        leading = !!options.leading;
	        maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
	        trailing = 'trailing' in options ? !!options.trailing : trailing;
	      }
	
	      function cancel() {
	        if (timeoutId) {
	          clearTimeout(timeoutId);
	        }
	        if (maxTimeoutId) {
	          clearTimeout(maxTimeoutId);
	        }
	        lastCalled = 0;
	        maxTimeoutId = timeoutId = trailingCall = undefined;
	      }
	
	      function complete(isCalled, id) {
	        if (id) {
	          clearTimeout(id);
	        }
	        maxTimeoutId = timeoutId = trailingCall = undefined;
	        if (isCalled) {
	          lastCalled = now();
	          result = func.apply(thisArg, args);
	          if (!timeoutId && !maxTimeoutId) {
	            args = thisArg = undefined;
	          }
	        }
	      }
	
	      function delayed() {
	        var remaining = wait - (now() - stamp);
	        if (remaining <= 0 || remaining > wait) {
	          complete(trailingCall, maxTimeoutId);
	        } else {
	          timeoutId = setTimeout(delayed, remaining);
	        }
	      }
	
	      function maxDelayed() {
	        complete(trailing, timeoutId);
	      }
	
	      function debounced() {
	        args = arguments;
	        stamp = now();
	        thisArg = this;
	        trailingCall = trailing && (timeoutId || !leading);
	
	        if (maxWait === false) {
	          var leadingCall = leading && !timeoutId;
	        } else {
	          if (!maxTimeoutId && !leading) {
	            lastCalled = stamp;
	          }
	          var remaining = maxWait - (stamp - lastCalled),
	              isCalled = remaining <= 0 || remaining > maxWait;
	
	          if (isCalled) {
	            if (maxTimeoutId) {
	              maxTimeoutId = clearTimeout(maxTimeoutId);
	            }
	            lastCalled = stamp;
	            result = func.apply(thisArg, args);
	          }
	          else if (!maxTimeoutId) {
	            maxTimeoutId = setTimeout(maxDelayed, remaining);
	          }
	        }
	        if (isCalled && timeoutId) {
	          timeoutId = clearTimeout(timeoutId);
	        }
	        else if (!timeoutId && wait !== maxWait) {
	          timeoutId = setTimeout(delayed, wait);
	        }
	        if (leadingCall) {
	          isCalled = true;
	          result = func.apply(thisArg, args);
	        }
	        if (isCalled && !timeoutId && !maxTimeoutId) {
	          args = thisArg = undefined;
	        }
	        return result;
	      }
	      debounced.cancel = cancel;
	      return debounced;
	    }
	
	    /**
	     * Defers invoking the `func` until the current call stack has cleared. Any
	     * additional arguments are provided to `func` when it is invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to defer.
	     * @param {...*} [args] The arguments to invoke the function with.
	     * @returns {number} Returns the timer id.
	     * @example
	     *
	     * _.defer(function(text) {
	     *   console.log(text);
	     * }, 'deferred');
	     * // logs 'deferred' after one or more milliseconds
	     */
	    var defer = restParam(function(func, args) {
	      return baseDelay(func, 1, args);
	    });
	
	    /**
	     * Invokes `func` after `wait` milliseconds. Any additional arguments are
	     * provided to `func` when it is invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to delay.
	     * @param {number} wait The number of milliseconds to delay invocation.
	     * @param {...*} [args] The arguments to invoke the function with.
	     * @returns {number} Returns the timer id.
	     * @example
	     *
	     * _.delay(function(text) {
	     *   console.log(text);
	     * }, 1000, 'later');
	     * // => logs 'later' after one second
	     */
	    var delay = restParam(function(func, wait, args) {
	      return baseDelay(func, wait, args);
	    });
	
	    /**
	     * Creates a function that returns the result of invoking the provided
	     * functions with the `this` binding of the created function, where each
	     * successive invocation is supplied the return value of the previous.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {...Function} [funcs] Functions to invoke.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var addSquare = _.flow(_.add, square);
	     * addSquare(1, 2);
	     * // => 9
	     */
	    var flow = createFlow();
	
	    /**
	     * This method is like `_.flow` except that it creates a function that
	     * invokes the provided functions from right to left.
	     *
	     * @static
	     * @memberOf _
	     * @alias backflow, compose
	     * @category Function
	     * @param {...Function} [funcs] Functions to invoke.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var addSquare = _.flowRight(square, _.add);
	     * addSquare(1, 2);
	     * // => 9
	     */
	    var flowRight = createFlow(true);
	
	    /**
	     * Creates a function that memoizes the result of `func`. If `resolver` is
	     * provided it determines the cache key for storing the result based on the
	     * arguments provided to the memoized function. By default, the first argument
	     * provided to the memoized function is coerced to a string and used as the
	     * cache key. The `func` is invoked with the `this` binding of the memoized
	     * function.
	     *
	     * **Note:** The cache is exposed as the `cache` property on the memoized
	     * function. Its creation may be customized by replacing the `_.memoize.Cache`
	     * constructor with one whose instances implement the [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
	     * method interface of `get`, `has`, and `set`.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to have its output memoized.
	     * @param {Function} [resolver] The function to resolve the cache key.
	     * @returns {Function} Returns the new memoizing function.
	     * @example
	     *
	     * var upperCase = _.memoize(function(string) {
	     *   return string.toUpperCase();
	     * });
	     *
	     * upperCase('fred');
	     * // => 'FRED'
	     *
	     * // modifying the result cache
	     * upperCase.cache.set('fred', 'BARNEY');
	     * upperCase('fred');
	     * // => 'BARNEY'
	     *
	     * // replacing `_.memoize.Cache`
	     * var object = { 'user': 'fred' };
	     * var other = { 'user': 'barney' };
	     * var identity = _.memoize(_.identity);
	     *
	     * identity(object);
	     * // => { 'user': 'fred' }
	     * identity(other);
	     * // => { 'user': 'fred' }
	     *
	     * _.memoize.Cache = WeakMap;
	     * var identity = _.memoize(_.identity);
	     *
	     * identity(object);
	     * // => { 'user': 'fred' }
	     * identity(other);
	     * // => { 'user': 'barney' }
	     */
	    function memoize(func, resolver) {
	      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      var memoized = function() {
	        var args = arguments,
	            key = resolver ? resolver.apply(this, args) : args[0],
	            cache = memoized.cache;
	
	        if (cache.has(key)) {
	          return cache.get(key);
	        }
	        var result = func.apply(this, args);
	        memoized.cache = cache.set(key, result);
	        return result;
	      };
	      memoized.cache = new memoize.Cache;
	      return memoized;
	    }
	
	    /**
	     * Creates a function that runs each argument through a corresponding
	     * transform function.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to wrap.
	     * @param {...(Function|Function[])} [transforms] The functions to transform
	     * arguments, specified as individual functions or arrays of functions.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function doubled(n) {
	     *   return n * 2;
	     * }
	     *
	     * function square(n) {
	     *   return n * n;
	     * }
	     *
	     * var modded = _.modArgs(function(x, y) {
	     *   return [x, y];
	     * }, square, doubled);
	     *
	     * modded(1, 2);
	     * // => [1, 4]
	     *
	     * modded(5, 10);
	     * // => [25, 20]
	     */
	    var modArgs = restParam(function(func, transforms) {
	      transforms = baseFlatten(transforms);
	      if (typeof func != 'function' || !arrayEvery(transforms, baseIsFunction)) {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      var length = transforms.length;
	      return restParam(function(args) {
	        var index = nativeMin(args.length, length);
	        while (index--) {
	          args[index] = transforms[index](args[index]);
	        }
	        return func.apply(this, args);
	      });
	    });
	
	    /**
	     * Creates a function that negates the result of the predicate `func`. The
	     * `func` predicate is invoked with the `this` binding and arguments of the
	     * created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} predicate The predicate to negate.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * function isEven(n) {
	     *   return n % 2 == 0;
	     * }
	     *
	     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
	     * // => [1, 3, 5]
	     */
	    function negate(predicate) {
	      if (typeof predicate != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      return function() {
	        return !predicate.apply(this, arguments);
	      };
	    }
	
	    /**
	     * Creates a function that is restricted to invoking `func` once. Repeat calls
	     * to the function return the value of the first call. The `func` is invoked
	     * with the `this` binding and arguments of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to restrict.
	     * @returns {Function} Returns the new restricted function.
	     * @example
	     *
	     * var initialize = _.once(createApplication);
	     * initialize();
	     * initialize();
	     * // `initialize` invokes `createApplication` once
	     */
	    function once(func) {
	      return before(2, func);
	    }
	
	    /**
	     * Creates a function that invokes `func` with `partial` arguments prepended
	     * to those provided to the new function. This method is like `_.bind` except
	     * it does **not** alter the `this` binding.
	     *
	     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for partially applied arguments.
	     *
	     * **Note:** This method does not set the "length" property of partially
	     * applied functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new partially applied function.
	     * @example
	     *
	     * var greet = function(greeting, name) {
	     *   return greeting + ' ' + name;
	     * };
	     *
	     * var sayHelloTo = _.partial(greet, 'hello');
	     * sayHelloTo('fred');
	     * // => 'hello fred'
	     *
	     * // using placeholders
	     * var greetFred = _.partial(greet, _, 'fred');
	     * greetFred('hi');
	     * // => 'hi fred'
	     */
	    var partial = createPartial(PARTIAL_FLAG);
	
	    /**
	     * This method is like `_.partial` except that partially applied arguments
	     * are appended to those provided to the new function.
	     *
	     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
	     * builds, may be used as a placeholder for partially applied arguments.
	     *
	     * **Note:** This method does not set the "length" property of partially
	     * applied functions.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to partially apply arguments to.
	     * @param {...*} [partials] The arguments to be partially applied.
	     * @returns {Function} Returns the new partially applied function.
	     * @example
	     *
	     * var greet = function(greeting, name) {
	     *   return greeting + ' ' + name;
	     * };
	     *
	     * var greetFred = _.partialRight(greet, 'fred');
	     * greetFred('hi');
	     * // => 'hi fred'
	     *
	     * // using placeholders
	     * var sayHelloTo = _.partialRight(greet, 'hello', _);
	     * sayHelloTo('fred');
	     * // => 'hello fred'
	     */
	    var partialRight = createPartial(PARTIAL_RIGHT_FLAG);
	
	    /**
	     * Creates a function that invokes `func` with arguments arranged according
	     * to the specified indexes where the argument value at the first index is
	     * provided as the first argument, the argument value at the second index is
	     * provided as the second argument, and so on.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to rearrange arguments for.
	     * @param {...(number|number[])} indexes The arranged argument indexes,
	     *  specified as individual indexes or arrays of indexes.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var rearged = _.rearg(function(a, b, c) {
	     *   return [a, b, c];
	     * }, 2, 0, 1);
	     *
	     * rearged('b', 'c', 'a')
	     * // => ['a', 'b', 'c']
	     *
	     * var map = _.rearg(_.map, [1, 0]);
	     * map(function(n) {
	     *   return n * 3;
	     * }, [1, 2, 3]);
	     * // => [3, 6, 9]
	     */
	    var rearg = restParam(function(func, indexes) {
	      return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes));
	    });
	
	    /**
	     * Creates a function that invokes `func` with the `this` binding of the
	     * created function and arguments from `start` and beyond provided as an array.
	     *
	     * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to apply a rest parameter to.
	     * @param {number} [start=func.length-1] The start position of the rest parameter.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var say = _.restParam(function(what, names) {
	     *   return what + ' ' + _.initial(names).join(', ') +
	     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	     * });
	     *
	     * say('hello', 'fred', 'barney', 'pebbles');
	     * // => 'hello fred, barney, & pebbles'
	     */
	    function restParam(func, start) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
	      return function() {
	        var args = arguments,
	            index = -1,
	            length = nativeMax(args.length - start, 0),
	            rest = Array(length);
	
	        while (++index < length) {
	          rest[index] = args[start + index];
	        }
	        switch (start) {
	          case 0: return func.call(this, rest);
	          case 1: return func.call(this, args[0], rest);
	          case 2: return func.call(this, args[0], args[1], rest);
	        }
	        var otherArgs = Array(start + 1);
	        index = -1;
	        while (++index < start) {
	          otherArgs[index] = args[index];
	        }
	        otherArgs[start] = rest;
	        return func.apply(this, otherArgs);
	      };
	    }
	
	    /**
	     * Creates a function that invokes `func` with the `this` binding of the created
	     * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
	     *
	     * **Note:** This method is based on the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to spread arguments over.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var say = _.spread(function(who, what) {
	     *   return who + ' says ' + what;
	     * });
	     *
	     * say(['fred', 'hello']);
	     * // => 'fred says hello'
	     *
	     * // with a Promise
	     * var numbers = Promise.all([
	     *   Promise.resolve(40),
	     *   Promise.resolve(36)
	     * ]);
	     *
	     * numbers.then(_.spread(function(x, y) {
	     *   return x + y;
	     * }));
	     * // => a Promise of 76
	     */
	    function spread(func) {
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      return function(array) {
	        return func.apply(this, array);
	      };
	    }
	
	    /**
	     * Creates a throttled function that only invokes `func` at most once per
	     * every `wait` milliseconds. The throttled function comes with a `cancel`
	     * method to cancel delayed invocations. Provide an options object to indicate
	     * that `func` should be invoked on the leading and/or trailing edge of the
	     * `wait` timeout. Subsequent calls to the throttled function return the
	     * result of the last `func` call.
	     *
	     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	     * on the trailing edge of the timeout only if the the throttled function is
	     * invoked more than once during the `wait` timeout.
	     *
	     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	     * for details over the differences between `_.throttle` and `_.debounce`.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {Function} func The function to throttle.
	     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.leading=true] Specify invoking on the leading
	     *  edge of the timeout.
	     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	     *  edge of the timeout.
	     * @returns {Function} Returns the new throttled function.
	     * @example
	     *
	     * // avoid excessively updating the position while scrolling
	     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
	     *
	     * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
	     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
	     *   'trailing': false
	     * }));
	     *
	     * // cancel a trailing throttled call
	     * jQuery(window).on('popstate', throttled.cancel);
	     */
	    function throttle(func, wait, options) {
	      var leading = true,
	          trailing = true;
	
	      if (typeof func != 'function') {
	        throw new TypeError(FUNC_ERROR_TEXT);
	      }
	      if (options === false) {
	        leading = false;
	      } else if (isObject(options)) {
	        leading = 'leading' in options ? !!options.leading : leading;
	        trailing = 'trailing' in options ? !!options.trailing : trailing;
	      }
	      return debounce(func, wait, { 'leading': leading, 'maxWait': +wait, 'trailing': trailing });
	    }
	
	    /**
	     * Creates a function that provides `value` to the wrapper function as its
	     * first argument. Any additional arguments provided to the function are
	     * appended to those provided to the wrapper function. The wrapper is invoked
	     * with the `this` binding of the created function.
	     *
	     * @static
	     * @memberOf _
	     * @category Function
	     * @param {*} value The value to wrap.
	     * @param {Function} wrapper The wrapper function.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var p = _.wrap(_.escape, function(func, text) {
	     *   return '<p>' + func(text) + '</p>';
	     * });
	     *
	     * p('fred, barney, & pebbles');
	     * // => '<p>fred, barney, &amp; pebbles</p>'
	     */
	    function wrap(value, wrapper) {
	      wrapper = wrapper == null ? identity : wrapper;
	      return createWrapper(wrapper, PARTIAL_FLAG, undefined, [value], []);
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
	     * otherwise they are assigned by reference. If `customizer` is provided it is
	     * invoked to produce the cloned values. If `customizer` returns `undefined`
	     * cloning is handled by the method instead. The `customizer` is bound to
	     * `thisArg` and invoked with two argument; (value [, index|key, object]).
	     *
	     * **Note:** This method is loosely based on the
	     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
	     * The enumerable properties of `arguments` objects and objects created by
	     * constructors other than `Object` are cloned to plain `Object` objects. An
	     * empty object is returned for uncloneable values such as functions, DOM nodes,
	     * Maps, Sets, and WeakMaps.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to clone.
	     * @param {boolean} [isDeep] Specify a deep clone.
	     * @param {Function} [customizer] The function to customize cloning values.
	     * @param {*} [thisArg] The `this` binding of `customizer`.
	     * @returns {*} Returns the cloned value.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney' },
	     *   { 'user': 'fred' }
	     * ];
	     *
	     * var shallow = _.clone(users);
	     * shallow[0] === users[0];
	     * // => true
	     *
	     * var deep = _.clone(users, true);
	     * deep[0] === users[0];
	     * // => false
	     *
	     * // using a customizer callback
	     * var el = _.clone(document.body, function(value) {
	     *   if (_.isElement(value)) {
	     *     return value.cloneNode(false);
	     *   }
	     * });
	     *
	     * el === document.body
	     * // => false
	     * el.nodeName
	     * // => BODY
	     * el.childNodes.length;
	     * // => 0
	     */
	    function clone(value, isDeep, customizer, thisArg) {
	      if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
	        isDeep = false;
	      }
	      else if (typeof isDeep == 'function') {
	        thisArg = customizer;
	        customizer = isDeep;
	        isDeep = false;
	      }
	      return typeof customizer == 'function'
	        ? baseClone(value, isDeep, bindCallback(customizer, thisArg, 1))
	        : baseClone(value, isDeep);
	    }
	
	    /**
	     * Creates a deep clone of `value`. If `customizer` is provided it is invoked
	     * to produce the cloned values. If `customizer` returns `undefined` cloning
	     * is handled by the method instead. The `customizer` is bound to `thisArg`
	     * and invoked with two argument; (value [, index|key, object]).
	     *
	     * **Note:** This method is loosely based on the
	     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
	     * The enumerable properties of `arguments` objects and objects created by
	     * constructors other than `Object` are cloned to plain `Object` objects. An
	     * empty object is returned for uncloneable values such as functions, DOM nodes,
	     * Maps, Sets, and WeakMaps.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to deep clone.
	     * @param {Function} [customizer] The function to customize cloning values.
	     * @param {*} [thisArg] The `this` binding of `customizer`.
	     * @returns {*} Returns the deep cloned value.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney' },
	     *   { 'user': 'fred' }
	     * ];
	     *
	     * var deep = _.cloneDeep(users);
	     * deep[0] === users[0];
	     * // => false
	     *
	     * // using a customizer callback
	     * var el = _.cloneDeep(document.body, function(value) {
	     *   if (_.isElement(value)) {
	     *     return value.cloneNode(true);
	     *   }
	     * });
	     *
	     * el === document.body
	     * // => false
	     * el.nodeName
	     * // => BODY
	     * el.childNodes.length;
	     * // => 20
	     */
	    function cloneDeep(value, customizer, thisArg) {
	      return typeof customizer == 'function'
	        ? baseClone(value, true, bindCallback(customizer, thisArg, 1))
	        : baseClone(value, true);
	    }
	
	    /**
	     * Checks if `value` is greater than `other`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if `value` is greater than `other`, else `false`.
	     * @example
	     *
	     * _.gt(3, 1);
	     * // => true
	     *
	     * _.gt(3, 3);
	     * // => false
	     *
	     * _.gt(1, 3);
	     * // => false
	     */
	    function gt(value, other) {
	      return value > other;
	    }
	
	    /**
	     * Checks if `value` is greater than or equal to `other`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if `value` is greater than or equal to `other`, else `false`.
	     * @example
	     *
	     * _.gte(3, 1);
	     * // => true
	     *
	     * _.gte(3, 3);
	     * // => true
	     *
	     * _.gte(1, 3);
	     * // => false
	     */
	    function gte(value, other) {
	      return value >= other;
	    }
	
	    /**
	     * Checks if `value` is classified as an `arguments` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isArguments(function() { return arguments; }());
	     * // => true
	     *
	     * _.isArguments([1, 2, 3]);
	     * // => false
	     */
	    function isArguments(value) {
	      return isObjectLike(value) && isArrayLike(value) &&
	        hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
	    }
	
	    /**
	     * Checks if `value` is classified as an `Array` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isArray([1, 2, 3]);
	     * // => true
	     *
	     * _.isArray(function() { return arguments; }());
	     * // => false
	     */
	    var isArray = nativeIsArray || function(value) {
	      return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	    };
	
	    /**
	     * Checks if `value` is classified as a boolean primitive or object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isBoolean(false);
	     * // => true
	     *
	     * _.isBoolean(null);
	     * // => false
	     */
	    function isBoolean(value) {
	      return value === true || value === false || (isObjectLike(value) && objToString.call(value) == boolTag);
	    }
	
	    /**
	     * Checks if `value` is classified as a `Date` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isDate(new Date);
	     * // => true
	     *
	     * _.isDate('Mon April 23 2012');
	     * // => false
	     */
	    function isDate(value) {
	      return isObjectLike(value) && objToString.call(value) == dateTag;
	    }
	
	    /**
	     * Checks if `value` is a DOM element.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
	     * @example
	     *
	     * _.isElement(document.body);
	     * // => true
	     *
	     * _.isElement('<body>');
	     * // => false
	     */
	    function isElement(value) {
	      return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
	    }
	
	    /**
	     * Checks if `value` is empty. A value is considered empty unless it is an
	     * `arguments` object, array, string, or jQuery-like collection with a length
	     * greater than `0` or an object with own enumerable properties.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {Array|Object|string} value The value to inspect.
	     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
	     * @example
	     *
	     * _.isEmpty(null);
	     * // => true
	     *
	     * _.isEmpty(true);
	     * // => true
	     *
	     * _.isEmpty(1);
	     * // => true
	     *
	     * _.isEmpty([1, 2, 3]);
	     * // => false
	     *
	     * _.isEmpty({ 'a': 1 });
	     * // => false
	     */
	    function isEmpty(value) {
	      if (value == null) {
	        return true;
	      }
	      if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) ||
	          (isObjectLike(value) && isFunction(value.splice)))) {
	        return !value.length;
	      }
	      return !keys(value).length;
	    }
	
	    /**
	     * Performs a deep comparison between two values to determine if they are
	     * equivalent. If `customizer` is provided it is invoked to compare values.
	     * If `customizer` returns `undefined` comparisons are handled by the method
	     * instead. The `customizer` is bound to `thisArg` and invoked with three
	     * arguments: (value, other [, index|key]).
	     *
	     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
	     * numbers, `Object` objects, regexes, and strings. Objects are compared by
	     * their own, not inherited, enumerable properties. Functions and DOM nodes
	     * are **not** supported. Provide a customizer function to extend support
	     * for comparing other values.
	     *
	     * @static
	     * @memberOf _
	     * @alias eq
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @param {Function} [customizer] The function to customize value comparisons.
	     * @param {*} [thisArg] The `this` binding of `customizer`.
	     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     * var other = { 'user': 'fred' };
	     *
	     * object == other;
	     * // => false
	     *
	     * _.isEqual(object, other);
	     * // => true
	     *
	     * // using a customizer callback
	     * var array = ['hello', 'goodbye'];
	     * var other = ['hi', 'goodbye'];
	     *
	     * _.isEqual(array, other, function(value, other) {
	     *   if (_.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/)) {
	     *     return true;
	     *   }
	     * });
	     * // => true
	     */
	    function isEqual(value, other, customizer, thisArg) {
	      customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
	      var result = customizer ? customizer(value, other) : undefined;
	      return  result === undefined ? baseIsEqual(value, other, customizer) : !!result;
	    }
	
	    /**
	     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
	     * `SyntaxError`, `TypeError`, or `URIError` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
	     * @example
	     *
	     * _.isError(new Error);
	     * // => true
	     *
	     * _.isError(Error);
	     * // => false
	     */
	    function isError(value) {
	      return isObjectLike(value) && typeof value.message == 'string' && objToString.call(value) == errorTag;
	    }
	
	    /**
	     * Checks if `value` is a finite primitive number.
	     *
	     * **Note:** This method is based on [`Number.isFinite`](http://ecma-international.org/ecma-262/6.0/#sec-number.isfinite).
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
	     * @example
	     *
	     * _.isFinite(10);
	     * // => true
	     *
	     * _.isFinite('10');
	     * // => false
	     *
	     * _.isFinite(true);
	     * // => false
	     *
	     * _.isFinite(Object(10));
	     * // => false
	     *
	     * _.isFinite(Infinity);
	     * // => false
	     */
	    function isFinite(value) {
	      return typeof value == 'number' && nativeIsFinite(value);
	    }
	
	    /**
	     * Checks if `value` is classified as a `Function` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isFunction(_);
	     * // => true
	     *
	     * _.isFunction(/abc/);
	     * // => false
	     */
	    function isFunction(value) {
	      // The use of `Object#toString` avoids issues with the `typeof` operator
	      // in older versions of Chrome and Safari which return 'function' for regexes
	      // and Safari 8 equivalents which return 'object' for typed array constructors.
	      return isObject(value) && objToString.call(value) == funcTag;
	    }
	
	    /**
	     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	     * @example
	     *
	     * _.isObject({});
	     * // => true
	     *
	     * _.isObject([1, 2, 3]);
	     * // => true
	     *
	     * _.isObject(1);
	     * // => false
	     */
	    function isObject(value) {
	      // Avoid a V8 JIT bug in Chrome 19-20.
	      // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	      var type = typeof value;
	      return !!value && (type == 'object' || type == 'function');
	    }
	
	    /**
	     * Performs a deep comparison between `object` and `source` to determine if
	     * `object` contains equivalent property values. If `customizer` is provided
	     * it is invoked to compare values. If `customizer` returns `undefined`
	     * comparisons are handled by the method instead. The `customizer` is bound
	     * to `thisArg` and invoked with three arguments: (value, other, index|key).
	     *
	     * **Note:** This method supports comparing properties of arrays, booleans,
	     * `Date` objects, numbers, `Object` objects, regexes, and strings. Functions
	     * and DOM nodes are **not** supported. Provide a customizer function to extend
	     * support for comparing other values.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {Object} object The object to inspect.
	     * @param {Object} source The object of property values to match.
	     * @param {Function} [customizer] The function to customize value comparisons.
	     * @param {*} [thisArg] The `this` binding of `customizer`.
	     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	     * @example
	     *
	     * var object = { 'user': 'fred', 'age': 40 };
	     *
	     * _.isMatch(object, { 'age': 40 });
	     * // => true
	     *
	     * _.isMatch(object, { 'age': 36 });
	     * // => false
	     *
	     * // using a customizer callback
	     * var object = { 'greeting': 'hello' };
	     * var source = { 'greeting': 'hi' };
	     *
	     * _.isMatch(object, source, function(value, other) {
	     *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
	     * });
	     * // => true
	     */
	    function isMatch(object, source, customizer, thisArg) {
	      customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
	      return baseIsMatch(object, getMatchData(source), customizer);
	    }
	
	    /**
	     * Checks if `value` is `NaN`.
	     *
	     * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
	     * which returns `true` for `undefined` and other non-numeric values.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	     * @example
	     *
	     * _.isNaN(NaN);
	     * // => true
	     *
	     * _.isNaN(new Number(NaN));
	     * // => true
	     *
	     * isNaN(undefined);
	     * // => true
	     *
	     * _.isNaN(undefined);
	     * // => false
	     */
	    function isNaN(value) {
	      // An `NaN` primitive is the only value that is not equal to itself.
	      // Perform the `toStringTag` check first to avoid errors with some host objects in IE.
	      return isNumber(value) && value != +value;
	    }
	
	    /**
	     * Checks if `value` is a native function.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	     * @example
	     *
	     * _.isNative(Array.prototype.push);
	     * // => true
	     *
	     * _.isNative(_);
	     * // => false
	     */
	    function isNative(value) {
	      if (value == null) {
	        return false;
	      }
	      if (isFunction(value)) {
	        return reIsNative.test(fnToString.call(value));
	      }
	      return isObjectLike(value) && reIsHostCtor.test(value);
	    }
	
	    /**
	     * Checks if `value` is `null`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
	     * @example
	     *
	     * _.isNull(null);
	     * // => true
	     *
	     * _.isNull(void 0);
	     * // => false
	     */
	    function isNull(value) {
	      return value === null;
	    }
	
	    /**
	     * Checks if `value` is classified as a `Number` primitive or object.
	     *
	     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
	     * as numbers, use the `_.isFinite` method.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isNumber(8.4);
	     * // => true
	     *
	     * _.isNumber(NaN);
	     * // => true
	     *
	     * _.isNumber('8.4');
	     * // => false
	     */
	    function isNumber(value) {
	      return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag);
	    }
	
	    /**
	     * Checks if `value` is a plain object, that is, an object created by the
	     * `Object` constructor or one with a `[[Prototype]]` of `null`.
	     *
	     * **Note:** This method assumes objects created by the `Object` constructor
	     * have no inherited enumerable properties.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     * }
	     *
	     * _.isPlainObject(new Foo);
	     * // => false
	     *
	     * _.isPlainObject([1, 2, 3]);
	     * // => false
	     *
	     * _.isPlainObject({ 'x': 0, 'y': 0 });
	     * // => true
	     *
	     * _.isPlainObject(Object.create(null));
	     * // => true
	     */
	    function isPlainObject(value) {
	      var Ctor;
	
	      // Exit early for non `Object` objects.
	      if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
	          (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
	        return false;
	      }
	      // IE < 9 iterates inherited properties before own properties. If the first
	      // iterated property is an object's own property then there are no inherited
	      // enumerable properties.
	      var result;
	      // In most environments an object's own properties are iterated before
	      // its inherited properties. If the last iterated property is an object's
	      // own property then there are no inherited enumerable properties.
	      baseForIn(value, function(subValue, key) {
	        result = key;
	      });
	      return result === undefined || hasOwnProperty.call(value, result);
	    }
	
	    /**
	     * Checks if `value` is classified as a `RegExp` object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isRegExp(/abc/);
	     * // => true
	     *
	     * _.isRegExp('/abc/');
	     * // => false
	     */
	    function isRegExp(value) {
	      return isObject(value) && objToString.call(value) == regexpTag;
	    }
	
	    /**
	     * Checks if `value` is classified as a `String` primitive or object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isString('abc');
	     * // => true
	     *
	     * _.isString(1);
	     * // => false
	     */
	    function isString(value) {
	      return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
	    }
	
	    /**
	     * Checks if `value` is classified as a typed array.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	     * @example
	     *
	     * _.isTypedArray(new Uint8Array);
	     * // => true
	     *
	     * _.isTypedArray([]);
	     * // => false
	     */
	    function isTypedArray(value) {
	      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	    }
	
	    /**
	     * Checks if `value` is `undefined`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to check.
	     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
	     * @example
	     *
	     * _.isUndefined(void 0);
	     * // => true
	     *
	     * _.isUndefined(null);
	     * // => false
	     */
	    function isUndefined(value) {
	      return value === undefined;
	    }
	
	    /**
	     * Checks if `value` is less than `other`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if `value` is less than `other`, else `false`.
	     * @example
	     *
	     * _.lt(1, 3);
	     * // => true
	     *
	     * _.lt(3, 3);
	     * // => false
	     *
	     * _.lt(3, 1);
	     * // => false
	     */
	    function lt(value, other) {
	      return value < other;
	    }
	
	    /**
	     * Checks if `value` is less than or equal to `other`.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to compare.
	     * @param {*} other The other value to compare.
	     * @returns {boolean} Returns `true` if `value` is less than or equal to `other`, else `false`.
	     * @example
	     *
	     * _.lte(1, 3);
	     * // => true
	     *
	     * _.lte(3, 3);
	     * // => true
	     *
	     * _.lte(3, 1);
	     * // => false
	     */
	    function lte(value, other) {
	      return value <= other;
	    }
	
	    /**
	     * Converts `value` to an array.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {Array} Returns the converted array.
	     * @example
	     *
	     * (function() {
	     *   return _.toArray(arguments).slice(1);
	     * }(1, 2, 3));
	     * // => [2, 3]
	     */
	    function toArray(value) {
	      var length = value ? getLength(value) : 0;
	      if (!isLength(length)) {
	        return values(value);
	      }
	      if (!length) {
	        return [];
	      }
	      return arrayCopy(value);
	    }
	
	    /**
	     * Converts `value` to a plain object flattening inherited enumerable
	     * properties of `value` to own properties of the plain object.
	     *
	     * @static
	     * @memberOf _
	     * @category Lang
	     * @param {*} value The value to convert.
	     * @returns {Object} Returns the converted plain object.
	     * @example
	     *
	     * function Foo() {
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.assign({ 'a': 1 }, new Foo);
	     * // => { 'a': 1, 'b': 2 }
	     *
	     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	     * // => { 'a': 1, 'b': 2, 'c': 3 }
	     */
	    function toPlainObject(value) {
	      return baseCopy(value, keysIn(value));
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Recursively merges own enumerable properties of the source object(s), that
	     * don't resolve to `undefined` into the destination object. Subsequent sources
	     * overwrite property assignments of previous sources. If `customizer` is
	     * provided it is invoked to produce the merged values of the destination and
	     * source properties. If `customizer` returns `undefined` merging is handled
	     * by the method instead. The `customizer` is bound to `thisArg` and invoked
	     * with five arguments: (objectValue, sourceValue, key, object, source).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @param {Function} [customizer] The function to customize assigned values.
	     * @param {*} [thisArg] The `this` binding of `customizer`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * var users = {
	     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
	     * };
	     *
	     * var ages = {
	     *   'data': [{ 'age': 36 }, { 'age': 40 }]
	     * };
	     *
	     * _.merge(users, ages);
	     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
	     *
	     * // using a customizer callback
	     * var object = {
	     *   'fruits': ['apple'],
	     *   'vegetables': ['beet']
	     * };
	     *
	     * var other = {
	     *   'fruits': ['banana'],
	     *   'vegetables': ['carrot']
	     * };
	     *
	     * _.merge(object, other, function(a, b) {
	     *   if (_.isArray(a)) {
	     *     return a.concat(b);
	     *   }
	     * });
	     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
	     */
	    var merge = createAssigner(baseMerge);
	
	    /**
	     * Assigns own enumerable properties of source object(s) to the destination
	     * object. Subsequent sources overwrite property assignments of previous sources.
	     * If `customizer` is provided it is invoked to produce the assigned values.
	     * The `customizer` is bound to `thisArg` and invoked with five arguments:
	     * (objectValue, sourceValue, key, object, source).
	     *
	     * **Note:** This method mutates `object` and is based on
	     * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
	     *
	     * @static
	     * @memberOf _
	     * @alias extend
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @param {Function} [customizer] The function to customize assigned values.
	     * @param {*} [thisArg] The `this` binding of `customizer`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
	     * // => { 'user': 'fred', 'age': 40 }
	     *
	     * // using a customizer callback
	     * var defaults = _.partialRight(_.assign, function(value, other) {
	     *   return _.isUndefined(value) ? other : value;
	     * });
	     *
	     * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	     * // => { 'user': 'barney', 'age': 36 }
	     */
	    var assign = createAssigner(function(object, source, customizer) {
	      return customizer
	        ? assignWith(object, source, customizer)
	        : baseAssign(object, source);
	    });
	
	    /**
	     * Creates an object that inherits from the given `prototype` object. If a
	     * `properties` object is provided its own enumerable properties are assigned
	     * to the created object.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} prototype The object to inherit from.
	     * @param {Object} [properties] The properties to assign to the object.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * function Shape() {
	     *   this.x = 0;
	     *   this.y = 0;
	     * }
	     *
	     * function Circle() {
	     *   Shape.call(this);
	     * }
	     *
	     * Circle.prototype = _.create(Shape.prototype, {
	     *   'constructor': Circle
	     * });
	     *
	     * var circle = new Circle;
	     * circle instanceof Circle;
	     * // => true
	     *
	     * circle instanceof Shape;
	     * // => true
	     */
	    function create(prototype, properties, guard) {
	      var result = baseCreate(prototype);
	      if (guard && isIterateeCall(prototype, properties, guard)) {
	        properties = undefined;
	      }
	      return properties ? baseAssign(result, properties) : result;
	    }
	
	    /**
	     * Assigns own enumerable properties of source object(s) to the destination
	     * object for all destination properties that resolve to `undefined`. Once a
	     * property is set, additional values of the same property are ignored.
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	     * // => { 'user': 'barney', 'age': 36 }
	     */
	    var defaults = createDefaults(assign, assignDefaults);
	
	    /**
	     * This method is like `_.defaults` except that it recursively assigns
	     * default properties.
	     *
	     * **Note:** This method mutates `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The destination object.
	     * @param {...Object} [sources] The source objects.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
	     * // => { 'user': { 'name': 'barney', 'age': 36 } }
	     *
	     */
	    var defaultsDeep = createDefaults(merge, mergeDefaults);
	
	    /**
	     * This method is like `_.find` except that it returns the key of the first
	     * element `predicate` returns truthy for instead of the element itself.
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
	     * @example
	     *
	     * var users = {
	     *   'barney':  { 'age': 36, 'active': true },
	     *   'fred':    { 'age': 40, 'active': false },
	     *   'pebbles': { 'age': 1,  'active': true }
	     * };
	     *
	     * _.findKey(users, function(chr) {
	     *   return chr.age < 40;
	     * });
	     * // => 'barney' (iteration order is not guaranteed)
	     *
	     * // using the `_.matches` callback shorthand
	     * _.findKey(users, { 'age': 1, 'active': true });
	     * // => 'pebbles'
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.findKey(users, 'active', false);
	     * // => 'fred'
	     *
	     * // using the `_.property` callback shorthand
	     * _.findKey(users, 'active');
	     * // => 'barney'
	     */
	    var findKey = createFindKey(baseForOwn);
	
	    /**
	     * This method is like `_.findKey` except that it iterates over elements of
	     * a collection in the opposite order.
	     *
	     * If a property name is provided for `predicate` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `predicate` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to search.
	     * @param {Function|Object|string} [predicate=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
	     * @example
	     *
	     * var users = {
	     *   'barney':  { 'age': 36, 'active': true },
	     *   'fred':    { 'age': 40, 'active': false },
	     *   'pebbles': { 'age': 1,  'active': true }
	     * };
	     *
	     * _.findLastKey(users, function(chr) {
	     *   return chr.age < 40;
	     * });
	     * // => returns `pebbles` assuming `_.findKey` returns `barney`
	     *
	     * // using the `_.matches` callback shorthand
	     * _.findLastKey(users, { 'age': 36, 'active': true });
	     * // => 'barney'
	     *
	     * // using the `_.matchesProperty` callback shorthand
	     * _.findLastKey(users, 'active', false);
	     * // => 'fred'
	     *
	     * // using the `_.property` callback shorthand
	     * _.findLastKey(users, 'active');
	     * // => 'pebbles'
	     */
	    var findLastKey = createFindKey(baseForOwnRight);
	
	    /**
	     * Iterates over own and inherited enumerable properties of an object invoking
	     * `iteratee` for each property. The `iteratee` is bound to `thisArg` and invoked
	     * with three arguments: (value, key, object). Iteratee functions may exit
	     * iteration early by explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forIn(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'a', 'b', and 'c' (iteration order is not guaranteed)
	     */
	    var forIn = createForIn(baseFor);
	
	    /**
	     * This method is like `_.forIn` except that it iterates over properties of
	     * `object` in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forInRight(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'c', 'b', and 'a' assuming `_.forIn ` logs 'a', 'b', and 'c'
	     */
	    var forInRight = createForIn(baseForRight);
	
	    /**
	     * Iterates over own enumerable properties of an object invoking `iteratee`
	     * for each property. The `iteratee` is bound to `thisArg` and invoked with
	     * three arguments: (value, key, object). Iteratee functions may exit iteration
	     * early by explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forOwn(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'a' and 'b' (iteration order is not guaranteed)
	     */
	    var forOwn = createForOwn(baseForOwn);
	
	    /**
	     * This method is like `_.forOwn` except that it iterates over properties of
	     * `object` in the opposite order.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.forOwnRight(new Foo, function(value, key) {
	     *   console.log(key);
	     * });
	     * // => logs 'b' and 'a' assuming `_.forOwn` logs 'a' and 'b'
	     */
	    var forOwnRight = createForOwn(baseForOwnRight);
	
	    /**
	     * Creates an array of function property names from all enumerable properties,
	     * own and inherited, of `object`.
	     *
	     * @static
	     * @memberOf _
	     * @alias methods
	     * @category Object
	     * @param {Object} object The object to inspect.
	     * @returns {Array} Returns the new array of property names.
	     * @example
	     *
	     * _.functions(_);
	     * // => ['after', 'ary', 'assign', ...]
	     */
	    function functions(object) {
	      return baseFunctions(object, keysIn(object));
	    }
	
	    /**
	     * Gets the property value at `path` of `object`. If the resolved value is
	     * `undefined` the `defaultValue` is used in its place.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the property to get.
	     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
	     * @returns {*} Returns the resolved value.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	     *
	     * _.get(object, 'a[0].b.c');
	     * // => 3
	     *
	     * _.get(object, ['a', '0', 'b', 'c']);
	     * // => 3
	     *
	     * _.get(object, 'a.b.c', 'default');
	     * // => 'default'
	     */
	    function get(object, path, defaultValue) {
	      var result = object == null ? undefined : baseGet(object, toPath(path), path + '');
	      return result === undefined ? defaultValue : result;
	    }
	
	    /**
	     * Checks if `path` is a direct property.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path to check.
	     * @returns {boolean} Returns `true` if `path` is a direct property, else `false`.
	     * @example
	     *
	     * var object = { 'a': { 'b': { 'c': 3 } } };
	     *
	     * _.has(object, 'a');
	     * // => true
	     *
	     * _.has(object, 'a.b.c');
	     * // => true
	     *
	     * _.has(object, ['a', 'b', 'c']);
	     * // => true
	     */
	    function has(object, path) {
	      if (object == null) {
	        return false;
	      }
	      var result = hasOwnProperty.call(object, path);
	      if (!result && !isKey(path)) {
	        path = toPath(path);
	        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
	        if (object == null) {
	          return false;
	        }
	        path = last(path);
	        result = hasOwnProperty.call(object, path);
	      }
	      return result || (isLength(object.length) && isIndex(path, object.length) &&
	        (isArray(object) || isArguments(object)));
	    }
	
	    /**
	     * Creates an object composed of the inverted keys and values of `object`.
	     * If `object` contains duplicate values, subsequent values overwrite property
	     * assignments of previous values unless `multiValue` is `true`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to invert.
	     * @param {boolean} [multiValue] Allow multiple values per key.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Object} Returns the new inverted object.
	     * @example
	     *
	     * var object = { 'a': 1, 'b': 2, 'c': 1 };
	     *
	     * _.invert(object);
	     * // => { '1': 'c', '2': 'b' }
	     *
	     * // with `multiValue`
	     * _.invert(object, true);
	     * // => { '1': ['a', 'c'], '2': ['b'] }
	     */
	    function invert(object, multiValue, guard) {
	      if (guard && isIterateeCall(object, multiValue, guard)) {
	        multiValue = undefined;
	      }
	      var index = -1,
	          props = keys(object),
	          length = props.length,
	          result = {};
	
	      while (++index < length) {
	        var key = props[index],
	            value = object[key];
	
	        if (multiValue) {
	          if (hasOwnProperty.call(result, value)) {
	            result[value].push(key);
	          } else {
	            result[value] = [key];
	          }
	        }
	        else {
	          result[value] = key;
	        }
	      }
	      return result;
	    }
	
	    /**
	     * Creates an array of the own enumerable property names of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects. See the
	     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	     * for more details.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.keys(new Foo);
	     * // => ['a', 'b'] (iteration order is not guaranteed)
	     *
	     * _.keys('hi');
	     * // => ['0', '1']
	     */
	    var keys = !nativeKeys ? shimKeys : function(object) {
	      var Ctor = object == null ? undefined : object.constructor;
	      if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	          (typeof object != 'function' && isArrayLike(object))) {
	        return shimKeys(object);
	      }
	      return isObject(object) ? nativeKeys(object) : [];
	    };
	
	    /**
	     * Creates an array of the own and inherited enumerable property names of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property names.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.keysIn(new Foo);
	     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	     */
	    function keysIn(object) {
	      if (object == null) {
	        return [];
	      }
	      if (!isObject(object)) {
	        object = Object(object);
	      }
	      var length = object.length;
	      length = (length && isLength(length) &&
	        (isArray(object) || isArguments(object)) && length) || 0;
	
	      var Ctor = object.constructor,
	          index = -1,
	          isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	          result = Array(length),
	          skipIndexes = length > 0;
	
	      while (++index < length) {
	        result[index] = (index + '');
	      }
	      for (var key in object) {
	        if (!(skipIndexes && isIndex(key, length)) &&
	            !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	          result.push(key);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * The opposite of `_.mapValues`; this method creates an object with the
	     * same values as `object` and keys generated by running each own enumerable
	     * property of `object` through `iteratee`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns the new mapped object.
	     * @example
	     *
	     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
	     *   return key + value;
	     * });
	     * // => { 'a1': 1, 'b2': 2 }
	     */
	    var mapKeys = createObjectMapper(true);
	
	    /**
	     * Creates an object with the same keys as `object` and values generated by
	     * running each own enumerable property of `object` through `iteratee`. The
	     * iteratee function is bound to `thisArg` and invoked with three arguments:
	     * (value, key, object).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to iterate over.
	     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	     *  per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Object} Returns the new mapped object.
	     * @example
	     *
	     * _.mapValues({ 'a': 1, 'b': 2 }, function(n) {
	     *   return n * 3;
	     * });
	     * // => { 'a': 3, 'b': 6 }
	     *
	     * var users = {
	     *   'fred':    { 'user': 'fred',    'age': 40 },
	     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
	     * };
	     *
	     * // using the `_.property` callback shorthand
	     * _.mapValues(users, 'age');
	     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	     */
	    var mapValues = createObjectMapper();
	
	    /**
	     * The opposite of `_.pick`; this method creates an object composed of the
	     * own and inherited enumerable properties of `object` that are not omitted.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The source object.
	     * @param {Function|...(string|string[])} [predicate] The function invoked per
	     *  iteration or property names to omit, specified as individual property
	     *  names or arrays of property names.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * var object = { 'user': 'fred', 'age': 40 };
	     *
	     * _.omit(object, 'age');
	     * // => { 'user': 'fred' }
	     *
	     * _.omit(object, _.isNumber);
	     * // => { 'user': 'fred' }
	     */
	    var omit = restParam(function(object, props) {
	      if (object == null) {
	        return {};
	      }
	      if (typeof props[0] != 'function') {
	        var props = arrayMap(baseFlatten(props), String);
	        return pickByArray(object, baseDifference(keysIn(object), props));
	      }
	      var predicate = bindCallback(props[0], props[1], 3);
	      return pickByCallback(object, function(value, key, object) {
	        return !predicate(value, key, object);
	      });
	    });
	
	    /**
	     * Creates a two dimensional array of the key-value pairs for `object`,
	     * e.g. `[[key1, value1], [key2, value2]]`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the new array of key-value pairs.
	     * @example
	     *
	     * _.pairs({ 'barney': 36, 'fred': 40 });
	     * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
	     */
	    function pairs(object) {
	      object = toObject(object);
	
	      var index = -1,
	          props = keys(object),
	          length = props.length,
	          result = Array(length);
	
	      while (++index < length) {
	        var key = props[index];
	        result[index] = [key, object[key]];
	      }
	      return result;
	    }
	
	    /**
	     * Creates an object composed of the picked `object` properties. Property
	     * names may be specified as individual arguments or as arrays of property
	     * names. If `predicate` is provided it is invoked for each property of `object`
	     * picking the properties `predicate` returns truthy for. The predicate is
	     * bound to `thisArg` and invoked with three arguments: (value, key, object).
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The source object.
	     * @param {Function|...(string|string[])} [predicate] The function invoked per
	     *  iteration or property names to pick, specified as individual property
	     *  names or arrays of property names.
	     * @param {*} [thisArg] The `this` binding of `predicate`.
	     * @returns {Object} Returns the new object.
	     * @example
	     *
	     * var object = { 'user': 'fred', 'age': 40 };
	     *
	     * _.pick(object, 'user');
	     * // => { 'user': 'fred' }
	     *
	     * _.pick(object, _.isString);
	     * // => { 'user': 'fred' }
	     */
	    var pick = restParam(function(object, props) {
	      if (object == null) {
	        return {};
	      }
	      return typeof props[0] == 'function'
	        ? pickByCallback(object, bindCallback(props[0], props[1], 3))
	        : pickByArray(object, baseFlatten(props));
	    });
	
	    /**
	     * This method is like `_.get` except that if the resolved value is a function
	     * it is invoked with the `this` binding of its parent object and its result
	     * is returned.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @param {Array|string} path The path of the property to resolve.
	     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
	     * @returns {*} Returns the resolved value.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
	     *
	     * _.result(object, 'a[0].b.c1');
	     * // => 3
	     *
	     * _.result(object, 'a[0].b.c2');
	     * // => 4
	     *
	     * _.result(object, 'a.b.c', 'default');
	     * // => 'default'
	     *
	     * _.result(object, 'a.b.c', _.constant('default'));
	     * // => 'default'
	     */
	    function result(object, path, defaultValue) {
	      var result = object == null ? undefined : object[path];
	      if (result === undefined) {
	        if (object != null && !isKey(path, object)) {
	          path = toPath(path);
	          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
	          result = object == null ? undefined : object[last(path)];
	        }
	        result = result === undefined ? defaultValue : result;
	      }
	      return isFunction(result) ? result.call(object) : result;
	    }
	
	    /**
	     * Sets the property value of `path` on `object`. If a portion of `path`
	     * does not exist it is created.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to augment.
	     * @param {Array|string} path The path of the property to set.
	     * @param {*} value The value to set.
	     * @returns {Object} Returns `object`.
	     * @example
	     *
	     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	     *
	     * _.set(object, 'a[0].b.c', 4);
	     * console.log(object.a[0].b.c);
	     * // => 4
	     *
	     * _.set(object, 'x[0].y.z', 5);
	     * console.log(object.x[0].y.z);
	     * // => 5
	     */
	    function set(object, path, value) {
	      if (object == null) {
	        return object;
	      }
	      var pathKey = (path + '');
	      path = (object[pathKey] != null || isKey(path, object)) ? [pathKey] : toPath(path);
	
	      var index = -1,
	          length = path.length,
	          lastIndex = length - 1,
	          nested = object;
	
	      while (nested != null && ++index < length) {
	        var key = path[index];
	        if (isObject(nested)) {
	          if (index == lastIndex) {
	            nested[key] = value;
	          } else if (nested[key] == null) {
	            nested[key] = isIndex(path[index + 1]) ? [] : {};
	          }
	        }
	        nested = nested[key];
	      }
	      return object;
	    }
	
	    /**
	     * An alternative to `_.reduce`; this method transforms `object` to a new
	     * `accumulator` object which is the result of running each of its own enumerable
	     * properties through `iteratee`, with each invocation potentially mutating
	     * the `accumulator` object. The `iteratee` is bound to `thisArg` and invoked
	     * with four arguments: (accumulator, value, key, object). Iteratee functions
	     * may exit iteration early by explicitly returning `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Array|Object} object The object to iterate over.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [accumulator] The custom accumulator value.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {*} Returns the accumulated value.
	     * @example
	     *
	     * _.transform([2, 3, 4], function(result, n) {
	     *   result.push(n *= n);
	     *   return n % 2 == 0;
	     * });
	     * // => [4, 9]
	     *
	     * _.transform({ 'a': 1, 'b': 2 }, function(result, n, key) {
	     *   result[key] = n * 3;
	     * });
	     * // => { 'a': 3, 'b': 6 }
	     */
	    function transform(object, iteratee, accumulator, thisArg) {
	      var isArr = isArray(object) || isTypedArray(object);
	      iteratee = getCallback(iteratee, thisArg, 4);
	
	      if (accumulator == null) {
	        if (isArr || isObject(object)) {
	          var Ctor = object.constructor;
	          if (isArr) {
	            accumulator = isArray(object) ? new Ctor : [];
	          } else {
	            accumulator = baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined);
	          }
	        } else {
	          accumulator = {};
	        }
	      }
	      (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
	        return iteratee(accumulator, value, index, object);
	      });
	      return accumulator;
	    }
	
	    /**
	     * Creates an array of the own enumerable property values of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property values.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.values(new Foo);
	     * // => [1, 2] (iteration order is not guaranteed)
	     *
	     * _.values('hi');
	     * // => ['h', 'i']
	     */
	    function values(object) {
	      return baseValues(object, keys(object));
	    }
	
	    /**
	     * Creates an array of the own and inherited enumerable property values
	     * of `object`.
	     *
	     * **Note:** Non-object values are coerced to objects.
	     *
	     * @static
	     * @memberOf _
	     * @category Object
	     * @param {Object} object The object to query.
	     * @returns {Array} Returns the array of property values.
	     * @example
	     *
	     * function Foo() {
	     *   this.a = 1;
	     *   this.b = 2;
	     * }
	     *
	     * Foo.prototype.c = 3;
	     *
	     * _.valuesIn(new Foo);
	     * // => [1, 2, 3] (iteration order is not guaranteed)
	     */
	    function valuesIn(object) {
	      return baseValues(object, keysIn(object));
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Checks if `n` is between `start` and up to but not including, `end`. If
	     * `end` is not specified it is set to `start` with `start` then set to `0`.
	     *
	     * @static
	     * @memberOf _
	     * @category Number
	     * @param {number} n The number to check.
	     * @param {number} [start=0] The start of the range.
	     * @param {number} end The end of the range.
	     * @returns {boolean} Returns `true` if `n` is in the range, else `false`.
	     * @example
	     *
	     * _.inRange(3, 2, 4);
	     * // => true
	     *
	     * _.inRange(4, 8);
	     * // => true
	     *
	     * _.inRange(4, 2);
	     * // => false
	     *
	     * _.inRange(2, 2);
	     * // => false
	     *
	     * _.inRange(1.2, 2);
	     * // => true
	     *
	     * _.inRange(5.2, 4);
	     * // => false
	     */
	    function inRange(value, start, end) {
	      start = +start || 0;
	      if (end === undefined) {
	        end = start;
	        start = 0;
	      } else {
	        end = +end || 0;
	      }
	      return value >= nativeMin(start, end) && value < nativeMax(start, end);
	    }
	
	    /**
	     * Produces a random number between `min` and `max` (inclusive). If only one
	     * argument is provided a number between `0` and the given number is returned.
	     * If `floating` is `true`, or either `min` or `max` are floats, a floating-point
	     * number is returned instead of an integer.
	     *
	     * @static
	     * @memberOf _
	     * @category Number
	     * @param {number} [min=0] The minimum possible value.
	     * @param {number} [max=1] The maximum possible value.
	     * @param {boolean} [floating] Specify returning a floating-point number.
	     * @returns {number} Returns the random number.
	     * @example
	     *
	     * _.random(0, 5);
	     * // => an integer between 0 and 5
	     *
	     * _.random(5);
	     * // => also an integer between 0 and 5
	     *
	     * _.random(5, true);
	     * // => a floating-point number between 0 and 5
	     *
	     * _.random(1.2, 5.2);
	     * // => a floating-point number between 1.2 and 5.2
	     */
	    function random(min, max, floating) {
	      if (floating && isIterateeCall(min, max, floating)) {
	        max = floating = undefined;
	      }
	      var noMin = min == null,
	          noMax = max == null;
	
	      if (floating == null) {
	        if (noMax && typeof min == 'boolean') {
	          floating = min;
	          min = 1;
	        }
	        else if (typeof max == 'boolean') {
	          floating = max;
	          noMax = true;
	        }
	      }
	      if (noMin && noMax) {
	        max = 1;
	        noMax = false;
	      }
	      min = +min || 0;
	      if (noMax) {
	        max = min;
	        min = 0;
	      } else {
	        max = +max || 0;
	      }
	      if (floating || min % 1 || max % 1) {
	        var rand = nativeRandom();
	        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1)))), max);
	      }
	      return baseRandom(min, max);
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the camel cased string.
	     * @example
	     *
	     * _.camelCase('Foo Bar');
	     * // => 'fooBar'
	     *
	     * _.camelCase('--foo-bar');
	     * // => 'fooBar'
	     *
	     * _.camelCase('__foo_bar__');
	     * // => 'fooBar'
	     */
	    var camelCase = createCompounder(function(result, word, index) {
	      word = word.toLowerCase();
	      return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word);
	    });
	
	    /**
	     * Capitalizes the first character of `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to capitalize.
	     * @returns {string} Returns the capitalized string.
	     * @example
	     *
	     * _.capitalize('fred');
	     * // => 'Fred'
	     */
	    function capitalize(string) {
	      string = baseToString(string);
	      return string && (string.charAt(0).toUpperCase() + string.slice(1));
	    }
	
	    /**
	     * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
	     * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to deburr.
	     * @returns {string} Returns the deburred string.
	     * @example
	     *
	     * _.deburr('déjà vu');
	     * // => 'deja vu'
	     */
	    function deburr(string) {
	      string = baseToString(string);
	      return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
	    }
	
	    /**
	     * Checks if `string` ends with the given target string.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to search.
	     * @param {string} [target] The string to search for.
	     * @param {number} [position=string.length] The position to search from.
	     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
	     * @example
	     *
	     * _.endsWith('abc', 'c');
	     * // => true
	     *
	     * _.endsWith('abc', 'b');
	     * // => false
	     *
	     * _.endsWith('abc', 'b', 2);
	     * // => true
	     */
	    function endsWith(string, target, position) {
	      string = baseToString(string);
	      target = (target + '');
	
	      var length = string.length;
	      position = position === undefined
	        ? length
	        : nativeMin(position < 0 ? 0 : (+position || 0), length);
	
	      position -= target.length;
	      return position >= 0 && string.indexOf(target, position) == position;
	    }
	
	    /**
	     * Converts the characters "&", "<", ">", '"', "'", and "\`", in `string` to
	     * their corresponding HTML entities.
	     *
	     * **Note:** No other characters are escaped. To escape additional characters
	     * use a third-party library like [_he_](https://mths.be/he).
	     *
	     * Though the ">" character is escaped for symmetry, characters like
	     * ">" and "/" don't need escaping in HTML and have no special meaning
	     * unless they're part of a tag or unquoted attribute value.
	     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
	     * (under "semi-related fun fact") for more details.
	     *
	     * Backticks are escaped because in Internet Explorer < 9, they can break out
	     * of attribute values or HTML comments. See [#59](https://html5sec.org/#59),
	     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
	     * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
	     * for more details.
	     *
	     * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
	     * to reduce XSS vectors.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to escape.
	     * @returns {string} Returns the escaped string.
	     * @example
	     *
	     * _.escape('fred, barney, & pebbles');
	     * // => 'fred, barney, &amp; pebbles'
	     */
	    function escape(string) {
	      // Reset `lastIndex` because in IE < 9 `String#replace` does not.
	      string = baseToString(string);
	      return (string && reHasUnescapedHtml.test(string))
	        ? string.replace(reUnescapedHtml, escapeHtmlChar)
	        : string;
	    }
	
	    /**
	     * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
	     * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to escape.
	     * @returns {string} Returns the escaped string.
	     * @example
	     *
	     * _.escapeRegExp('[lodash](https://lodash.com/)');
	     * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
	     */
	    function escapeRegExp(string) {
	      string = baseToString(string);
	      return (string && reHasRegExpChars.test(string))
	        ? string.replace(reRegExpChars, escapeRegExpChar)
	        : (string || '(?:)');
	    }
	
	    /**
	     * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the kebab cased string.
	     * @example
	     *
	     * _.kebabCase('Foo Bar');
	     * // => 'foo-bar'
	     *
	     * _.kebabCase('fooBar');
	     * // => 'foo-bar'
	     *
	     * _.kebabCase('__foo_bar__');
	     * // => 'foo-bar'
	     */
	    var kebabCase = createCompounder(function(result, word, index) {
	      return result + (index ? '-' : '') + word.toLowerCase();
	    });
	
	    /**
	     * Pads `string` on the left and right sides if it's shorter than `length`.
	     * Padding characters are truncated if they can't be evenly divided by `length`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to pad.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the padded string.
	     * @example
	     *
	     * _.pad('abc', 8);
	     * // => '  abc   '
	     *
	     * _.pad('abc', 8, '_-');
	     * // => '_-abc_-_'
	     *
	     * _.pad('abc', 3);
	     * // => 'abc'
	     */
	    function pad(string, length, chars) {
	      string = baseToString(string);
	      length = +length;
	
	      var strLength = string.length;
	      if (strLength >= length || !nativeIsFinite(length)) {
	        return string;
	      }
	      var mid = (length - strLength) / 2,
	          leftLength = nativeFloor(mid),
	          rightLength = nativeCeil(mid);
	
	      chars = createPadding('', rightLength, chars);
	      return chars.slice(0, leftLength) + string + chars;
	    }
	
	    /**
	     * Pads `string` on the left side if it's shorter than `length`. Padding
	     * characters are truncated if they exceed `length`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to pad.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the padded string.
	     * @example
	     *
	     * _.padLeft('abc', 6);
	     * // => '   abc'
	     *
	     * _.padLeft('abc', 6, '_-');
	     * // => '_-_abc'
	     *
	     * _.padLeft('abc', 3);
	     * // => 'abc'
	     */
	    var padLeft = createPadDir();
	
	    /**
	     * Pads `string` on the right side if it's shorter than `length`. Padding
	     * characters are truncated if they exceed `length`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to pad.
	     * @param {number} [length=0] The padding length.
	     * @param {string} [chars=' '] The string used as padding.
	     * @returns {string} Returns the padded string.
	     * @example
	     *
	     * _.padRight('abc', 6);
	     * // => 'abc   '
	     *
	     * _.padRight('abc', 6, '_-');
	     * // => 'abc_-_'
	     *
	     * _.padRight('abc', 3);
	     * // => 'abc'
	     */
	    var padRight = createPadDir(true);
	
	    /**
	     * Converts `string` to an integer of the specified radix. If `radix` is
	     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
	     * in which case a `radix` of `16` is used.
	     *
	     * **Note:** This method aligns with the [ES5 implementation](https://es5.github.io/#E)
	     * of `parseInt`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} string The string to convert.
	     * @param {number} [radix] The radix to interpret `value` by.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {number} Returns the converted integer.
	     * @example
	     *
	     * _.parseInt('08');
	     * // => 8
	     *
	     * _.map(['6', '08', '10'], _.parseInt);
	     * // => [6, 8, 10]
	     */
	    function parseInt(string, radix, guard) {
	      // Firefox < 21 and Opera < 15 follow ES3 for `parseInt`.
	      // Chrome fails to trim leading <BOM> whitespace characters.
	      // See https://code.google.com/p/v8/issues/detail?id=3109 for more details.
	      if (guard ? isIterateeCall(string, radix, guard) : radix == null) {
	        radix = 0;
	      } else if (radix) {
	        radix = +radix;
	      }
	      string = trim(string);
	      return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
	    }
	
	    /**
	     * Repeats the given string `n` times.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to repeat.
	     * @param {number} [n=0] The number of times to repeat the string.
	     * @returns {string} Returns the repeated string.
	     * @example
	     *
	     * _.repeat('*', 3);
	     * // => '***'
	     *
	     * _.repeat('abc', 2);
	     * // => 'abcabc'
	     *
	     * _.repeat('abc', 0);
	     * // => ''
	     */
	    function repeat(string, n) {
	      var result = '';
	      string = baseToString(string);
	      n = +n;
	      if (n < 1 || !string || !nativeIsFinite(n)) {
	        return result;
	      }
	      // Leverage the exponentiation by squaring algorithm for a faster repeat.
	      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
	      do {
	        if (n % 2) {
	          result += string;
	        }
	        n = nativeFloor(n / 2);
	        string += string;
	      } while (n);
	
	      return result;
	    }
	
	    /**
	     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the snake cased string.
	     * @example
	     *
	     * _.snakeCase('Foo Bar');
	     * // => 'foo_bar'
	     *
	     * _.snakeCase('fooBar');
	     * // => 'foo_bar'
	     *
	     * _.snakeCase('--foo-bar');
	     * // => 'foo_bar'
	     */
	    var snakeCase = createCompounder(function(result, word, index) {
	      return result + (index ? '_' : '') + word.toLowerCase();
	    });
	
	    /**
	     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to convert.
	     * @returns {string} Returns the start cased string.
	     * @example
	     *
	     * _.startCase('--foo-bar');
	     * // => 'Foo Bar'
	     *
	     * _.startCase('fooBar');
	     * // => 'Foo Bar'
	     *
	     * _.startCase('__foo_bar__');
	     * // => 'Foo Bar'
	     */
	    var startCase = createCompounder(function(result, word, index) {
	      return result + (index ? ' ' : '') + (word.charAt(0).toUpperCase() + word.slice(1));
	    });
	
	    /**
	     * Checks if `string` starts with the given target string.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to search.
	     * @param {string} [target] The string to search for.
	     * @param {number} [position=0] The position to search from.
	     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
	     * @example
	     *
	     * _.startsWith('abc', 'a');
	     * // => true
	     *
	     * _.startsWith('abc', 'b');
	     * // => false
	     *
	     * _.startsWith('abc', 'b', 1);
	     * // => true
	     */
	    function startsWith(string, target, position) {
	      string = baseToString(string);
	      position = position == null
	        ? 0
	        : nativeMin(position < 0 ? 0 : (+position || 0), string.length);
	
	      return string.lastIndexOf(target, position) == position;
	    }
	
	    /**
	     * Creates a compiled template function that can interpolate data properties
	     * in "interpolate" delimiters, HTML-escape interpolated data properties in
	     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
	     * properties may be accessed as free variables in the template. If a setting
	     * object is provided it takes precedence over `_.templateSettings` values.
	     *
	     * **Note:** In the development build `_.template` utilizes
	     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
	     * for easier debugging.
	     *
	     * For more information on precompiling templates see
	     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
	     *
	     * For more information on Chrome extension sandboxes see
	     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The template string.
	     * @param {Object} [options] The options object.
	     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
	     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
	     * @param {Object} [options.imports] An object to import into the template as free variables.
	     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
	     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
	     * @param {string} [options.variable] The data object variable name.
	     * @param- {Object} [otherOptions] Enables the legacy `options` param signature.
	     * @returns {Function} Returns the compiled template function.
	     * @example
	     *
	     * // using the "interpolate" delimiter to create a compiled template
	     * var compiled = _.template('hello <%= user %>!');
	     * compiled({ 'user': 'fred' });
	     * // => 'hello fred!'
	     *
	     * // using the HTML "escape" delimiter to escape data property values
	     * var compiled = _.template('<b><%- value %></b>');
	     * compiled({ 'value': '<script>' });
	     * // => '<b>&lt;script&gt;</b>'
	     *
	     * // using the "evaluate" delimiter to execute JavaScript and generate HTML
	     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
	     * compiled({ 'users': ['fred', 'barney'] });
	     * // => '<li>fred</li><li>barney</li>'
	     *
	     * // using the internal `print` function in "evaluate" delimiters
	     * var compiled = _.template('<% print("hello " + user); %>!');
	     * compiled({ 'user': 'barney' });
	     * // => 'hello barney!'
	     *
	     * // using the ES delimiter as an alternative to the default "interpolate" delimiter
	     * var compiled = _.template('hello ${ user }!');
	     * compiled({ 'user': 'pebbles' });
	     * // => 'hello pebbles!'
	     *
	     * // using custom template delimiters
	     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
	     * var compiled = _.template('hello {{ user }}!');
	     * compiled({ 'user': 'mustache' });
	     * // => 'hello mustache!'
	     *
	     * // using backslashes to treat delimiters as plain text
	     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
	     * compiled({ 'value': 'ignored' });
	     * // => '<%- value %>'
	     *
	     * // using the `imports` option to import `jQuery` as `jq`
	     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
	     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
	     * compiled({ 'users': ['fred', 'barney'] });
	     * // => '<li>fred</li><li>barney</li>'
	     *
	     * // using the `sourceURL` option to specify a custom sourceURL for the template
	     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
	     * compiled(data);
	     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
	     *
	     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
	     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
	     * compiled.source;
	     * // => function(data) {
	     * //   var __t, __p = '';
	     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
	     * //   return __p;
	     * // }
	     *
	     * // using the `source` property to inline compiled templates for meaningful
	     * // line numbers in error messages and a stack trace
	     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
	     *   var JST = {\
	     *     "main": ' + _.template(mainText).source + '\
	     *   };\
	     * ');
	     */
	    function template(string, options, otherOptions) {
	      // Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
	      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
	      var settings = lodash.templateSettings;
	
	      if (otherOptions && isIterateeCall(string, options, otherOptions)) {
	        options = otherOptions = undefined;
	      }
	      string = baseToString(string);
	      options = assignWith(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);
	
	      var imports = assignWith(baseAssign({}, options.imports), settings.imports, assignOwnDefaults),
	          importsKeys = keys(imports),
	          importsValues = baseValues(imports, importsKeys);
	
	      var isEscaping,
	          isEvaluating,
	          index = 0,
	          interpolate = options.interpolate || reNoMatch,
	          source = "__p += '";
	
	      // Compile the regexp to match each delimiter.
	      var reDelimiters = RegExp(
	        (options.escape || reNoMatch).source + '|' +
	        interpolate.source + '|' +
	        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
	        (options.evaluate || reNoMatch).source + '|$'
	      , 'g');
	
	      // Use a sourceURL for easier debugging.
	      var sourceURL = '//# sourceURL=' +
	        ('sourceURL' in options
	          ? options.sourceURL
	          : ('lodash.templateSources[' + (++templateCounter) + ']')
	        ) + '\n';
	
	      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
	        interpolateValue || (interpolateValue = esTemplateValue);
	
	        // Escape characters that can't be included in string literals.
	        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
	
	        // Replace delimiters with snippets.
	        if (escapeValue) {
	          isEscaping = true;
	          source += "' +\n__e(" + escapeValue + ") +\n'";
	        }
	        if (evaluateValue) {
	          isEvaluating = true;
	          source += "';\n" + evaluateValue + ";\n__p += '";
	        }
	        if (interpolateValue) {
	          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
	        }
	        index = offset + match.length;
	
	        // The JS engine embedded in Adobe products requires returning the `match`
	        // string in order to produce the correct `offset` value.
	        return match;
	      });
	
	      source += "';\n";
	
	      // If `variable` is not specified wrap a with-statement around the generated
	      // code to add the data object to the top of the scope chain.
	      var variable = options.variable;
	      if (!variable) {
	        source = 'with (obj) {\n' + source + '\n}\n';
	      }
	      // Cleanup code by stripping empty strings.
	      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
	        .replace(reEmptyStringMiddle, '$1')
	        .replace(reEmptyStringTrailing, '$1;');
	
	      // Frame code as the function body.
	      source = 'function(' + (variable || 'obj') + ') {\n' +
	        (variable
	          ? ''
	          : 'obj || (obj = {});\n'
	        ) +
	        "var __t, __p = ''" +
	        (isEscaping
	           ? ', __e = _.escape'
	           : ''
	        ) +
	        (isEvaluating
	          ? ', __j = Array.prototype.join;\n' +
	            "function print() { __p += __j.call(arguments, '') }\n"
	          : ';\n'
	        ) +
	        source +
	        'return __p\n}';
	
	      var result = attempt(function() {
	        return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
	      });
	
	      // Provide the compiled function's source by its `toString` method or
	      // the `source` property as a convenience for inlining compiled templates.
	      result.source = source;
	      if (isError(result)) {
	        throw result;
	      }
	      return result;
	    }
	
	    /**
	     * Removes leading and trailing whitespace or specified characters from `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to trim.
	     * @param {string} [chars=whitespace] The characters to trim.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {string} Returns the trimmed string.
	     * @example
	     *
	     * _.trim('  abc  ');
	     * // => 'abc'
	     *
	     * _.trim('-_-abc-_-', '_-');
	     * // => 'abc'
	     *
	     * _.map(['  foo  ', '  bar  '], _.trim);
	     * // => ['foo', 'bar']
	     */
	    function trim(string, chars, guard) {
	      var value = string;
	      string = baseToString(string);
	      if (!string) {
	        return string;
	      }
	      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
	        return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
	      }
	      chars = (chars + '');
	      return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
	    }
	
	    /**
	     * Removes leading whitespace or specified characters from `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to trim.
	     * @param {string} [chars=whitespace] The characters to trim.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {string} Returns the trimmed string.
	     * @example
	     *
	     * _.trimLeft('  abc  ');
	     * // => 'abc  '
	     *
	     * _.trimLeft('-_-abc-_-', '_-');
	     * // => 'abc-_-'
	     */
	    function trimLeft(string, chars, guard) {
	      var value = string;
	      string = baseToString(string);
	      if (!string) {
	        return string;
	      }
	      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
	        return string.slice(trimmedLeftIndex(string));
	      }
	      return string.slice(charsLeftIndex(string, (chars + '')));
	    }
	
	    /**
	     * Removes trailing whitespace or specified characters from `string`.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to trim.
	     * @param {string} [chars=whitespace] The characters to trim.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {string} Returns the trimmed string.
	     * @example
	     *
	     * _.trimRight('  abc  ');
	     * // => '  abc'
	     *
	     * _.trimRight('-_-abc-_-', '_-');
	     * // => '-_-abc'
	     */
	    function trimRight(string, chars, guard) {
	      var value = string;
	      string = baseToString(string);
	      if (!string) {
	        return string;
	      }
	      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
	        return string.slice(0, trimmedRightIndex(string) + 1);
	      }
	      return string.slice(0, charsRightIndex(string, (chars + '')) + 1);
	    }
	
	    /**
	     * Truncates `string` if it's longer than the given maximum string length.
	     * The last characters of the truncated string are replaced with the omission
	     * string which defaults to "...".
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to truncate.
	     * @param {Object|number} [options] The options object or maximum string length.
	     * @param {number} [options.length=30] The maximum string length.
	     * @param {string} [options.omission='...'] The string to indicate text is omitted.
	     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {string} Returns the truncated string.
	     * @example
	     *
	     * _.trunc('hi-diddly-ho there, neighborino');
	     * // => 'hi-diddly-ho there, neighbo...'
	     *
	     * _.trunc('hi-diddly-ho there, neighborino', 24);
	     * // => 'hi-diddly-ho there, n...'
	     *
	     * _.trunc('hi-diddly-ho there, neighborino', {
	     *   'length': 24,
	     *   'separator': ' '
	     * });
	     * // => 'hi-diddly-ho there,...'
	     *
	     * _.trunc('hi-diddly-ho there, neighborino', {
	     *   'length': 24,
	     *   'separator': /,? +/
	     * });
	     * // => 'hi-diddly-ho there...'
	     *
	     * _.trunc('hi-diddly-ho there, neighborino', {
	     *   'omission': ' [...]'
	     * });
	     * // => 'hi-diddly-ho there, neig [...]'
	     */
	    function trunc(string, options, guard) {
	      if (guard && isIterateeCall(string, options, guard)) {
	        options = undefined;
	      }
	      var length = DEFAULT_TRUNC_LENGTH,
	          omission = DEFAULT_TRUNC_OMISSION;
	
	      if (options != null) {
	        if (isObject(options)) {
	          var separator = 'separator' in options ? options.separator : separator;
	          length = 'length' in options ? (+options.length || 0) : length;
	          omission = 'omission' in options ? baseToString(options.omission) : omission;
	        } else {
	          length = +options || 0;
	        }
	      }
	      string = baseToString(string);
	      if (length >= string.length) {
	        return string;
	      }
	      var end = length - omission.length;
	      if (end < 1) {
	        return omission;
	      }
	      var result = string.slice(0, end);
	      if (separator == null) {
	        return result + omission;
	      }
	      if (isRegExp(separator)) {
	        if (string.slice(end).search(separator)) {
	          var match,
	              newEnd,
	              substring = string.slice(0, end);
	
	          if (!separator.global) {
	            separator = RegExp(separator.source, (reFlags.exec(separator) || '') + 'g');
	          }
	          separator.lastIndex = 0;
	          while ((match = separator.exec(substring))) {
	            newEnd = match.index;
	          }
	          result = result.slice(0, newEnd == null ? end : newEnd);
	        }
	      } else if (string.indexOf(separator, end) != end) {
	        var index = result.lastIndexOf(separator);
	        if (index > -1) {
	          result = result.slice(0, index);
	        }
	      }
	      return result + omission;
	    }
	
	    /**
	     * The inverse of `_.escape`; this method converts the HTML entities
	     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
	     * corresponding characters.
	     *
	     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
	     * entities use a third-party library like [_he_](https://mths.be/he).
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to unescape.
	     * @returns {string} Returns the unescaped string.
	     * @example
	     *
	     * _.unescape('fred, barney, &amp; pebbles');
	     * // => 'fred, barney, & pebbles'
	     */
	    function unescape(string) {
	      string = baseToString(string);
	      return (string && reHasEscapedHtml.test(string))
	        ? string.replace(reEscapedHtml, unescapeHtmlChar)
	        : string;
	    }
	
	    /**
	     * Splits `string` into an array of its words.
	     *
	     * @static
	     * @memberOf _
	     * @category String
	     * @param {string} [string=''] The string to inspect.
	     * @param {RegExp|string} [pattern] The pattern to match words.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Array} Returns the words of `string`.
	     * @example
	     *
	     * _.words('fred, barney, & pebbles');
	     * // => ['fred', 'barney', 'pebbles']
	     *
	     * _.words('fred, barney, & pebbles', /[^, ]+/g);
	     * // => ['fred', 'barney', '&', 'pebbles']
	     */
	    function words(string, pattern, guard) {
	      if (guard && isIterateeCall(string, pattern, guard)) {
	        pattern = undefined;
	      }
	      string = baseToString(string);
	      return string.match(pattern || reWords) || [];
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Attempts to invoke `func`, returning either the result or the caught error
	     * object. Any additional arguments are provided to `func` when it is invoked.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {Function} func The function to attempt.
	     * @returns {*} Returns the `func` result or error object.
	     * @example
	     *
	     * // avoid throwing errors for invalid selectors
	     * var elements = _.attempt(function(selector) {
	     *   return document.querySelectorAll(selector);
	     * }, '>_>');
	     *
	     * if (_.isError(elements)) {
	     *   elements = [];
	     * }
	     */
	    var attempt = restParam(function(func, args) {
	      try {
	        return func.apply(undefined, args);
	      } catch(e) {
	        return isError(e) ? e : new Error(e);
	      }
	    });
	
	    /**
	     * Creates a function that invokes `func` with the `this` binding of `thisArg`
	     * and arguments of the created function. If `func` is a property name the
	     * created callback returns the property value for a given element. If `func`
	     * is an object the created callback returns `true` for elements that contain
	     * the equivalent object properties, otherwise it returns `false`.
	     *
	     * @static
	     * @memberOf _
	     * @alias iteratee
	     * @category Utility
	     * @param {*} [func=_.identity] The value to convert to a callback.
	     * @param {*} [thisArg] The `this` binding of `func`.
	     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	     * @returns {Function} Returns the callback.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * // wrap to create custom callback shorthands
	     * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
	     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
	     *   if (!match) {
	     *     return callback(func, thisArg);
	     *   }
	     *   return function(object) {
	     *     return match[2] == 'gt'
	     *       ? object[match[1]] > match[3]
	     *       : object[match[1]] < match[3];
	     *   };
	     * });
	     *
	     * _.filter(users, 'age__gt36');
	     * // => [{ 'user': 'fred', 'age': 40 }]
	     */
	    function callback(func, thisArg, guard) {
	      if (guard && isIterateeCall(func, thisArg, guard)) {
	        thisArg = undefined;
	      }
	      return isObjectLike(func)
	        ? matches(func)
	        : baseCallback(func, thisArg);
	    }
	
	    /**
	     * Creates a function that returns `value`.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {*} value The value to return from the new function.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     * var getter = _.constant(object);
	     *
	     * getter() === object;
	     * // => true
	     */
	    function constant(value) {
	      return function() {
	        return value;
	      };
	    }
	
	    /**
	     * This method returns the first argument provided to it.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {*} value Any value.
	     * @returns {*} Returns `value`.
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     *
	     * _.identity(object) === object;
	     * // => true
	     */
	    function identity(value) {
	      return value;
	    }
	
	    /**
	     * Creates a function that performs a deep comparison between a given object
	     * and `source`, returning `true` if the given object has equivalent property
	     * values, else `false`.
	     *
	     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
	     * numbers, `Object` objects, regexes, and strings. Objects are compared by
	     * their own, not inherited, enumerable properties. For comparing a single
	     * own or inherited property value see `_.matchesProperty`.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {Object} source The object of property values to match.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36, 'active': true },
	     *   { 'user': 'fred',   'age': 40, 'active': false }
	     * ];
	     *
	     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
	     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
	     */
	    function matches(source) {
	      return baseMatches(baseClone(source, true));
	    }
	
	    /**
	     * Creates a function that compares the property value of `path` on a given
	     * object to `value`.
	     *
	     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
	     * numbers, `Object` objects, regexes, and strings. Objects are compared by
	     * their own, not inherited, enumerable properties.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {Array|string} path The path of the property to get.
	     * @param {*} srcValue The value to match.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var users = [
	     *   { 'user': 'barney' },
	     *   { 'user': 'fred' }
	     * ];
	     *
	     * _.find(users, _.matchesProperty('user', 'fred'));
	     * // => { 'user': 'fred' }
	     */
	    function matchesProperty(path, srcValue) {
	      return baseMatchesProperty(path, baseClone(srcValue, true));
	    }
	
	    /**
	     * Creates a function that invokes the method at `path` on a given object.
	     * Any additional arguments are provided to the invoked method.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {Array|string} path The path of the method to invoke.
	     * @param {...*} [args] The arguments to invoke the method with.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var objects = [
	     *   { 'a': { 'b': { 'c': _.constant(2) } } },
	     *   { 'a': { 'b': { 'c': _.constant(1) } } }
	     * ];
	     *
	     * _.map(objects, _.method('a.b.c'));
	     * // => [2, 1]
	     *
	     * _.invoke(_.sortBy(objects, _.method(['a', 'b', 'c'])), 'a.b.c');
	     * // => [1, 2]
	     */
	    var method = restParam(function(path, args) {
	      return function(object) {
	        return invokePath(object, path, args);
	      };
	    });
	
	    /**
	     * The opposite of `_.method`; this method creates a function that invokes
	     * the method at a given path on `object`. Any additional arguments are
	     * provided to the invoked method.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {Object} object The object to query.
	     * @param {...*} [args] The arguments to invoke the method with.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var array = _.times(3, _.constant),
	     *     object = { 'a': array, 'b': array, 'c': array };
	     *
	     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
	     * // => [2, 0]
	     *
	     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
	     * // => [2, 0]
	     */
	    var methodOf = restParam(function(object, args) {
	      return function(path) {
	        return invokePath(object, path, args);
	      };
	    });
	
	    /**
	     * Adds all own enumerable function properties of a source object to the
	     * destination object. If `object` is a function then methods are added to
	     * its prototype as well.
	     *
	     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
	     * avoid conflicts caused by modifying the original.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {Function|Object} [object=lodash] The destination object.
	     * @param {Object} source The object of functions to add.
	     * @param {Object} [options] The options object.
	     * @param {boolean} [options.chain=true] Specify whether the functions added
	     *  are chainable.
	     * @returns {Function|Object} Returns `object`.
	     * @example
	     *
	     * function vowels(string) {
	     *   return _.filter(string, function(v) {
	     *     return /[aeiou]/i.test(v);
	     *   });
	     * }
	     *
	     * _.mixin({ 'vowels': vowels });
	     * _.vowels('fred');
	     * // => ['e']
	     *
	     * _('fred').vowels().value();
	     * // => ['e']
	     *
	     * _.mixin({ 'vowels': vowels }, { 'chain': false });
	     * _('fred').vowels();
	     * // => ['e']
	     */
	    function mixin(object, source, options) {
	      if (options == null) {
	        var isObj = isObject(source),
	            props = isObj ? keys(source) : undefined,
	            methodNames = (props && props.length) ? baseFunctions(source, props) : undefined;
	
	        if (!(methodNames ? methodNames.length : isObj)) {
	          methodNames = false;
	          options = source;
	          source = object;
	          object = this;
	        }
	      }
	      if (!methodNames) {
	        methodNames = baseFunctions(source, keys(source));
	      }
	      var chain = true,
	          index = -1,
	          isFunc = isFunction(object),
	          length = methodNames.length;
	
	      if (options === false) {
	        chain = false;
	      } else if (isObject(options) && 'chain' in options) {
	        chain = options.chain;
	      }
	      while (++index < length) {
	        var methodName = methodNames[index],
	            func = source[methodName];
	
	        object[methodName] = func;
	        if (isFunc) {
	          object.prototype[methodName] = (function(func) {
	            return function() {
	              var chainAll = this.__chain__;
	              if (chain || chainAll) {
	                var result = object(this.__wrapped__),
	                    actions = result.__actions__ = arrayCopy(this.__actions__);
	
	                actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
	                result.__chain__ = chainAll;
	                return result;
	              }
	              return func.apply(object, arrayPush([this.value()], arguments));
	            };
	          }(func));
	        }
	      }
	      return object;
	    }
	
	    /**
	     * Reverts the `_` variable to its previous value and returns a reference to
	     * the `lodash` function.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @returns {Function} Returns the `lodash` function.
	     * @example
	     *
	     * var lodash = _.noConflict();
	     */
	    function noConflict() {
	      root._ = oldDash;
	      return this;
	    }
	
	    /**
	     * A no-operation function that returns `undefined` regardless of the
	     * arguments it receives.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @example
	     *
	     * var object = { 'user': 'fred' };
	     *
	     * _.noop(object) === undefined;
	     * // => true
	     */
	    function noop() {
	      // No operation performed.
	    }
	
	    /**
	     * Creates a function that returns the property value at `path` on a
	     * given object.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {Array|string} path The path of the property to get.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var objects = [
	     *   { 'a': { 'b': { 'c': 2 } } },
	     *   { 'a': { 'b': { 'c': 1 } } }
	     * ];
	     *
	     * _.map(objects, _.property('a.b.c'));
	     * // => [2, 1]
	     *
	     * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
	     * // => [1, 2]
	     */
	    function property(path) {
	      return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
	    }
	
	    /**
	     * The opposite of `_.property`; this method creates a function that returns
	     * the property value at a given path on `object`.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {Object} object The object to query.
	     * @returns {Function} Returns the new function.
	     * @example
	     *
	     * var array = [0, 1, 2],
	     *     object = { 'a': array, 'b': array, 'c': array };
	     *
	     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
	     * // => [2, 0]
	     *
	     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
	     * // => [2, 0]
	     */
	    function propertyOf(object) {
	      return function(path) {
	        return baseGet(object, toPath(path), path + '');
	      };
	    }
	
	    /**
	     * Creates an array of numbers (positive and/or negative) progressing from
	     * `start` up to, but not including, `end`. If `end` is not specified it is
	     * set to `start` with `start` then set to `0`. If `end` is less than `start`
	     * a zero-length range is created unless a negative `step` is specified.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {number} [start=0] The start of the range.
	     * @param {number} end The end of the range.
	     * @param {number} [step=1] The value to increment or decrement by.
	     * @returns {Array} Returns the new array of numbers.
	     * @example
	     *
	     * _.range(4);
	     * // => [0, 1, 2, 3]
	     *
	     * _.range(1, 5);
	     * // => [1, 2, 3, 4]
	     *
	     * _.range(0, 20, 5);
	     * // => [0, 5, 10, 15]
	     *
	     * _.range(0, -4, -1);
	     * // => [0, -1, -2, -3]
	     *
	     * _.range(1, 4, 0);
	     * // => [1, 1, 1]
	     *
	     * _.range(0);
	     * // => []
	     */
	    function range(start, end, step) {
	      if (step && isIterateeCall(start, end, step)) {
	        end = step = undefined;
	      }
	      start = +start || 0;
	      step = step == null ? 1 : (+step || 0);
	
	      if (end == null) {
	        end = start;
	        start = 0;
	      } else {
	        end = +end || 0;
	      }
	      // Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
	      // See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
	      var index = -1,
	          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
	          result = Array(length);
	
	      while (++index < length) {
	        result[index] = start;
	        start += step;
	      }
	      return result;
	    }
	
	    /**
	     * Invokes the iteratee function `n` times, returning an array of the results
	     * of each invocation. The `iteratee` is bound to `thisArg` and invoked with
	     * one argument; (index).
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {number} n The number of times to invoke `iteratee`.
	     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {Array} Returns the array of results.
	     * @example
	     *
	     * var diceRolls = _.times(3, _.partial(_.random, 1, 6, false));
	     * // => [3, 6, 4]
	     *
	     * _.times(3, function(n) {
	     *   mage.castSpell(n);
	     * });
	     * // => invokes `mage.castSpell(n)` three times with `n` of `0`, `1`, and `2`
	     *
	     * _.times(3, function(n) {
	     *   this.cast(n);
	     * }, mage);
	     * // => also invokes `mage.castSpell(n)` three times
	     */
	    function times(n, iteratee, thisArg) {
	      n = nativeFloor(n);
	
	      // Exit early to avoid a JSC JIT bug in Safari 8
	      // where `Array(0)` is treated as `Array(1)`.
	      if (n < 1 || !nativeIsFinite(n)) {
	        return [];
	      }
	      var index = -1,
	          result = Array(nativeMin(n, MAX_ARRAY_LENGTH));
	
	      iteratee = bindCallback(iteratee, thisArg, 1);
	      while (++index < n) {
	        if (index < MAX_ARRAY_LENGTH) {
	          result[index] = iteratee(index);
	        } else {
	          iteratee(index);
	        }
	      }
	      return result;
	    }
	
	    /**
	     * Generates a unique ID. If `prefix` is provided the ID is appended to it.
	     *
	     * @static
	     * @memberOf _
	     * @category Utility
	     * @param {string} [prefix] The value to prefix the ID with.
	     * @returns {string} Returns the unique ID.
	     * @example
	     *
	     * _.uniqueId('contact_');
	     * // => 'contact_104'
	     *
	     * _.uniqueId();
	     * // => '105'
	     */
	    function uniqueId(prefix) {
	      var id = ++idCounter;
	      return baseToString(prefix) + id;
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * Adds two numbers.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} augend The first number to add.
	     * @param {number} addend The second number to add.
	     * @returns {number} Returns the sum.
	     * @example
	     *
	     * _.add(6, 4);
	     * // => 10
	     */
	    function add(augend, addend) {
	      return (+augend || 0) + (+addend || 0);
	    }
	
	    /**
	     * Calculates `n` rounded up to `precision`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} n The number to round up.
	     * @param {number} [precision=0] The precision to round up to.
	     * @returns {number} Returns the rounded up number.
	     * @example
	     *
	     * _.ceil(4.006);
	     * // => 5
	     *
	     * _.ceil(6.004, 2);
	     * // => 6.01
	     *
	     * _.ceil(6040, -2);
	     * // => 6100
	     */
	    var ceil = createRound('ceil');
	
	    /**
	     * Calculates `n` rounded down to `precision`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} n The number to round down.
	     * @param {number} [precision=0] The precision to round down to.
	     * @returns {number} Returns the rounded down number.
	     * @example
	     *
	     * _.floor(4.006);
	     * // => 4
	     *
	     * _.floor(0.046, 2);
	     * // => 0.04
	     *
	     * _.floor(4060, -2);
	     * // => 4000
	     */
	    var floor = createRound('floor');
	
	    /**
	     * Gets the maximum value of `collection`. If `collection` is empty or falsey
	     * `-Infinity` is returned. If an iteratee function is provided it is invoked
	     * for each value in `collection` to generate the criterion by which the value
	     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
	     * arguments: (value, index, collection).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {*} Returns the maximum value.
	     * @example
	     *
	     * _.max([4, 2, 8, 6]);
	     * // => 8
	     *
	     * _.max([]);
	     * // => -Infinity
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.max(users, function(chr) {
	     *   return chr.age;
	     * });
	     * // => { 'user': 'fred', 'age': 40 }
	     *
	     * // using the `_.property` callback shorthand
	     * _.max(users, 'age');
	     * // => { 'user': 'fred', 'age': 40 }
	     */
	    var max = createExtremum(gt, NEGATIVE_INFINITY);
	
	    /**
	     * Gets the minimum value of `collection`. If `collection` is empty or falsey
	     * `Infinity` is returned. If an iteratee function is provided it is invoked
	     * for each value in `collection` to generate the criterion by which the value
	     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
	     * arguments: (value, index, collection).
	     *
	     * If a property name is provided for `iteratee` the created `_.property`
	     * style callback returns the property value of the given element.
	     *
	     * If a value is also provided for `thisArg` the created `_.matchesProperty`
	     * style callback returns `true` for elements that have a matching property
	     * value, else `false`.
	     *
	     * If an object is provided for `iteratee` the created `_.matches` style
	     * callback returns `true` for elements that have the properties of the given
	     * object, else `false`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {*} Returns the minimum value.
	     * @example
	     *
	     * _.min([4, 2, 8, 6]);
	     * // => 2
	     *
	     * _.min([]);
	     * // => Infinity
	     *
	     * var users = [
	     *   { 'user': 'barney', 'age': 36 },
	     *   { 'user': 'fred',   'age': 40 }
	     * ];
	     *
	     * _.min(users, function(chr) {
	     *   return chr.age;
	     * });
	     * // => { 'user': 'barney', 'age': 36 }
	     *
	     * // using the `_.property` callback shorthand
	     * _.min(users, 'age');
	     * // => { 'user': 'barney', 'age': 36 }
	     */
	    var min = createExtremum(lt, POSITIVE_INFINITY);
	
	    /**
	     * Calculates `n` rounded to `precision`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {number} n The number to round.
	     * @param {number} [precision=0] The precision to round to.
	     * @returns {number} Returns the rounded number.
	     * @example
	     *
	     * _.round(4.006);
	     * // => 4
	     *
	     * _.round(4.006, 2);
	     * // => 4.01
	     *
	     * _.round(4060, -2);
	     * // => 4100
	     */
	    var round = createRound('round');
	
	    /**
	     * Gets the sum of the values in `collection`.
	     *
	     * @static
	     * @memberOf _
	     * @category Math
	     * @param {Array|Object|string} collection The collection to iterate over.
	     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
	     * @param {*} [thisArg] The `this` binding of `iteratee`.
	     * @returns {number} Returns the sum.
	     * @example
	     *
	     * _.sum([4, 6]);
	     * // => 10
	     *
	     * _.sum({ 'a': 4, 'b': 6 });
	     * // => 10
	     *
	     * var objects = [
	     *   { 'n': 4 },
	     *   { 'n': 6 }
	     * ];
	     *
	     * _.sum(objects, function(object) {
	     *   return object.n;
	     * });
	     * // => 10
	     *
	     * // using the `_.property` callback shorthand
	     * _.sum(objects, 'n');
	     * // => 10
	     */
	    function sum(collection, iteratee, thisArg) {
	      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
	        iteratee = undefined;
	      }
	      iteratee = getCallback(iteratee, thisArg, 3);
	      return iteratee.length == 1
	        ? arraySum(isArray(collection) ? collection : toIterable(collection), iteratee)
	        : baseSum(collection, iteratee);
	    }
	
	    /*------------------------------------------------------------------------*/
	
	    // Ensure wrappers are instances of `baseLodash`.
	    lodash.prototype = baseLodash.prototype;
	
	    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
	    LodashWrapper.prototype.constructor = LodashWrapper;
	
	    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
	    LazyWrapper.prototype.constructor = LazyWrapper;
	
	    // Add functions to the `Map` cache.
	    MapCache.prototype['delete'] = mapDelete;
	    MapCache.prototype.get = mapGet;
	    MapCache.prototype.has = mapHas;
	    MapCache.prototype.set = mapSet;
	
	    // Add functions to the `Set` cache.
	    SetCache.prototype.push = cachePush;
	
	    // Assign cache to `_.memoize`.
	    memoize.Cache = MapCache;
	
	    // Add functions that return wrapped values when chaining.
	    lodash.after = after;
	    lodash.ary = ary;
	    lodash.assign = assign;
	    lodash.at = at;
	    lodash.before = before;
	    lodash.bind = bind;
	    lodash.bindAll = bindAll;
	    lodash.bindKey = bindKey;
	    lodash.callback = callback;
	    lodash.chain = chain;
	    lodash.chunk = chunk;
	    lodash.compact = compact;
	    lodash.constant = constant;
	    lodash.countBy = countBy;
	    lodash.create = create;
	    lodash.curry = curry;
	    lodash.curryRight = curryRight;
	    lodash.debounce = debounce;
	    lodash.defaults = defaults;
	    lodash.defaultsDeep = defaultsDeep;
	    lodash.defer = defer;
	    lodash.delay = delay;
	    lodash.difference = difference;
	    lodash.drop = drop;
	    lodash.dropRight = dropRight;
	    lodash.dropRightWhile = dropRightWhile;
	    lodash.dropWhile = dropWhile;
	    lodash.fill = fill;
	    lodash.filter = filter;
	    lodash.flatten = flatten;
	    lodash.flattenDeep = flattenDeep;
	    lodash.flow = flow;
	    lodash.flowRight = flowRight;
	    lodash.forEach = forEach;
	    lodash.forEachRight = forEachRight;
	    lodash.forIn = forIn;
	    lodash.forInRight = forInRight;
	    lodash.forOwn = forOwn;
	    lodash.forOwnRight = forOwnRight;
	    lodash.functions = functions;
	    lodash.groupBy = groupBy;
	    lodash.indexBy = indexBy;
	    lodash.initial = initial;
	    lodash.intersection = intersection;
	    lodash.invert = invert;
	    lodash.invoke = invoke;
	    lodash.keys = keys;
	    lodash.keysIn = keysIn;
	    lodash.map = map;
	    lodash.mapKeys = mapKeys;
	    lodash.mapValues = mapValues;
	    lodash.matches = matches;
	    lodash.matchesProperty = matchesProperty;
	    lodash.memoize = memoize;
	    lodash.merge = merge;
	    lodash.method = method;
	    lodash.methodOf = methodOf;
	    lodash.mixin = mixin;
	    lodash.modArgs = modArgs;
	    lodash.negate = negate;
	    lodash.omit = omit;
	    lodash.once = once;
	    lodash.pairs = pairs;
	    lodash.partial = partial;
	    lodash.partialRight = partialRight;
	    lodash.partition = partition;
	    lodash.pick = pick;
	    lodash.pluck = pluck;
	    lodash.property = property;
	    lodash.propertyOf = propertyOf;
	    lodash.pull = pull;
	    lodash.pullAt = pullAt;
	    lodash.range = range;
	    lodash.rearg = rearg;
	    lodash.reject = reject;
	    lodash.remove = remove;
	    lodash.rest = rest;
	    lodash.restParam = restParam;
	    lodash.set = set;
	    lodash.shuffle = shuffle;
	    lodash.slice = slice;
	    lodash.sortBy = sortBy;
	    lodash.sortByAll = sortByAll;
	    lodash.sortByOrder = sortByOrder;
	    lodash.spread = spread;
	    lodash.take = take;
	    lodash.takeRight = takeRight;
	    lodash.takeRightWhile = takeRightWhile;
	    lodash.takeWhile = takeWhile;
	    lodash.tap = tap;
	    lodash.throttle = throttle;
	    lodash.thru = thru;
	    lodash.times = times;
	    lodash.toArray = toArray;
	    lodash.toPlainObject = toPlainObject;
	    lodash.transform = transform;
	    lodash.union = union;
	    lodash.uniq = uniq;
	    lodash.unzip = unzip;
	    lodash.unzipWith = unzipWith;
	    lodash.values = values;
	    lodash.valuesIn = valuesIn;
	    lodash.where = where;
	    lodash.without = without;
	    lodash.wrap = wrap;
	    lodash.xor = xor;
	    lodash.zip = zip;
	    lodash.zipObject = zipObject;
	    lodash.zipWith = zipWith;
	
	    // Add aliases.
	    lodash.backflow = flowRight;
	    lodash.collect = map;
	    lodash.compose = flowRight;
	    lodash.each = forEach;
	    lodash.eachRight = forEachRight;
	    lodash.extend = assign;
	    lodash.iteratee = callback;
	    lodash.methods = functions;
	    lodash.object = zipObject;
	    lodash.select = filter;
	    lodash.tail = rest;
	    lodash.unique = uniq;
	
	    // Add functions to `lodash.prototype`.
	    mixin(lodash, lodash);
	
	    /*------------------------------------------------------------------------*/
	
	    // Add functions that return unwrapped values when chaining.
	    lodash.add = add;
	    lodash.attempt = attempt;
	    lodash.camelCase = camelCase;
	    lodash.capitalize = capitalize;
	    lodash.ceil = ceil;
	    lodash.clone = clone;
	    lodash.cloneDeep = cloneDeep;
	    lodash.deburr = deburr;
	    lodash.endsWith = endsWith;
	    lodash.escape = escape;
	    lodash.escapeRegExp = escapeRegExp;
	    lodash.every = every;
	    lodash.find = find;
	    lodash.findIndex = findIndex;
	    lodash.findKey = findKey;
	    lodash.findLast = findLast;
	    lodash.findLastIndex = findLastIndex;
	    lodash.findLastKey = findLastKey;
	    lodash.findWhere = findWhere;
	    lodash.first = first;
	    lodash.floor = floor;
	    lodash.get = get;
	    lodash.gt = gt;
	    lodash.gte = gte;
	    lodash.has = has;
	    lodash.identity = identity;
	    lodash.includes = includes;
	    lodash.indexOf = indexOf;
	    lodash.inRange = inRange;
	    lodash.isArguments = isArguments;
	    lodash.isArray = isArray;
	    lodash.isBoolean = isBoolean;
	    lodash.isDate = isDate;
	    lodash.isElement = isElement;
	    lodash.isEmpty = isEmpty;
	    lodash.isEqual = isEqual;
	    lodash.isError = isError;
	    lodash.isFinite = isFinite;
	    lodash.isFunction = isFunction;
	    lodash.isMatch = isMatch;
	    lodash.isNaN = isNaN;
	    lodash.isNative = isNative;
	    lodash.isNull = isNull;
	    lodash.isNumber = isNumber;
	    lodash.isObject = isObject;
	    lodash.isPlainObject = isPlainObject;
	    lodash.isRegExp = isRegExp;
	    lodash.isString = isString;
	    lodash.isTypedArray = isTypedArray;
	    lodash.isUndefined = isUndefined;
	    lodash.kebabCase = kebabCase;
	    lodash.last = last;
	    lodash.lastIndexOf = lastIndexOf;
	    lodash.lt = lt;
	    lodash.lte = lte;
	    lodash.max = max;
	    lodash.min = min;
	    lodash.noConflict = noConflict;
	    lodash.noop = noop;
	    lodash.now = now;
	    lodash.pad = pad;
	    lodash.padLeft = padLeft;
	    lodash.padRight = padRight;
	    lodash.parseInt = parseInt;
	    lodash.random = random;
	    lodash.reduce = reduce;
	    lodash.reduceRight = reduceRight;
	    lodash.repeat = repeat;
	    lodash.result = result;
	    lodash.round = round;
	    lodash.runInContext = runInContext;
	    lodash.size = size;
	    lodash.snakeCase = snakeCase;
	    lodash.some = some;
	    lodash.sortedIndex = sortedIndex;
	    lodash.sortedLastIndex = sortedLastIndex;
	    lodash.startCase = startCase;
	    lodash.startsWith = startsWith;
	    lodash.sum = sum;
	    lodash.template = template;
	    lodash.trim = trim;
	    lodash.trimLeft = trimLeft;
	    lodash.trimRight = trimRight;
	    lodash.trunc = trunc;
	    lodash.unescape = unescape;
	    lodash.uniqueId = uniqueId;
	    lodash.words = words;
	
	    // Add aliases.
	    lodash.all = every;
	    lodash.any = some;
	    lodash.contains = includes;
	    lodash.eq = isEqual;
	    lodash.detect = find;
	    lodash.foldl = reduce;
	    lodash.foldr = reduceRight;
	    lodash.head = first;
	    lodash.include = includes;
	    lodash.inject = reduce;
	
	    mixin(lodash, (function() {
	      var source = {};
	      baseForOwn(lodash, function(func, methodName) {
	        if (!lodash.prototype[methodName]) {
	          source[methodName] = func;
	        }
	      });
	      return source;
	    }()), false);
	
	    /*------------------------------------------------------------------------*/
	
	    // Add functions capable of returning wrapped and unwrapped values when chaining.
	    lodash.sample = sample;
	
	    lodash.prototype.sample = function(n) {
	      if (!this.__chain__ && n == null) {
	        return sample(this.value());
	      }
	      return this.thru(function(value) {
	        return sample(value, n);
	      });
	    };
	
	    /*------------------------------------------------------------------------*/
	
	    /**
	     * The semantic version number.
	     *
	     * @static
	     * @memberOf _
	     * @type string
	     */
	    lodash.VERSION = VERSION;
	
	    // Assign default placeholders.
	    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
	      lodash[methodName].placeholder = lodash;
	    });
	
	    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
	    arrayEach(['drop', 'take'], function(methodName, index) {
	      LazyWrapper.prototype[methodName] = function(n) {
	        var filtered = this.__filtered__;
	        if (filtered && !index) {
	          return new LazyWrapper(this);
	        }
	        n = n == null ? 1 : nativeMax(nativeFloor(n) || 0, 0);
	
	        var result = this.clone();
	        if (filtered) {
	          result.__takeCount__ = nativeMin(result.__takeCount__, n);
	        } else {
	          result.__views__.push({ 'size': n, 'type': methodName + (result.__dir__ < 0 ? 'Right' : '') });
	        }
	        return result;
	      };
	
	      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
	        return this.reverse()[methodName](n).reverse();
	      };
	    });
	
	    // Add `LazyWrapper` methods that accept an `iteratee` value.
	    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
	      var type = index + 1,
	          isFilter = type != LAZY_MAP_FLAG;
	
	      LazyWrapper.prototype[methodName] = function(iteratee, thisArg) {
	        var result = this.clone();
	        result.__iteratees__.push({ 'iteratee': getCallback(iteratee, thisArg, 1), 'type': type });
	        result.__filtered__ = result.__filtered__ || isFilter;
	        return result;
	      };
	    });
	
	    // Add `LazyWrapper` methods for `_.first` and `_.last`.
	    arrayEach(['first', 'last'], function(methodName, index) {
	      var takeName = 'take' + (index ? 'Right' : '');
	
	      LazyWrapper.prototype[methodName] = function() {
	        return this[takeName](1).value()[0];
	      };
	    });
	
	    // Add `LazyWrapper` methods for `_.initial` and `_.rest`.
	    arrayEach(['initial', 'rest'], function(methodName, index) {
	      var dropName = 'drop' + (index ? '' : 'Right');
	
	      LazyWrapper.prototype[methodName] = function() {
	        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
	      };
	    });
	
	    // Add `LazyWrapper` methods for `_.pluck` and `_.where`.
	    arrayEach(['pluck', 'where'], function(methodName, index) {
	      var operationName = index ? 'filter' : 'map',
	          createCallback = index ? baseMatches : property;
	
	      LazyWrapper.prototype[methodName] = function(value) {
	        return this[operationName](createCallback(value));
	      };
	    });
	
	    LazyWrapper.prototype.compact = function() {
	      return this.filter(identity);
	    };
	
	    LazyWrapper.prototype.reject = function(predicate, thisArg) {
	      predicate = getCallback(predicate, thisArg, 1);
	      return this.filter(function(value) {
	        return !predicate(value);
	      });
	    };
	
	    LazyWrapper.prototype.slice = function(start, end) {
	      start = start == null ? 0 : (+start || 0);
	
	      var result = this;
	      if (result.__filtered__ && (start > 0 || end < 0)) {
	        return new LazyWrapper(result);
	      }
	      if (start < 0) {
	        result = result.takeRight(-start);
	      } else if (start) {
	        result = result.drop(start);
	      }
	      if (end !== undefined) {
	        end = (+end || 0);
	        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
	      }
	      return result;
	    };
	
	    LazyWrapper.prototype.takeRightWhile = function(predicate, thisArg) {
	      return this.reverse().takeWhile(predicate, thisArg).reverse();
	    };
	
	    LazyWrapper.prototype.toArray = function() {
	      return this.take(POSITIVE_INFINITY);
	    };
	
	    // Add `LazyWrapper` methods to `lodash.prototype`.
	    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
	      var checkIteratee = /^(?:filter|map|reject)|While$/.test(methodName),
	          retUnwrapped = /^(?:first|last)$/.test(methodName),
	          lodashFunc = lodash[retUnwrapped ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName];
	
	      if (!lodashFunc) {
	        return;
	      }
	      lodash.prototype[methodName] = function() {
	        var args = retUnwrapped ? [1] : arguments,
	            chainAll = this.__chain__,
	            value = this.__wrapped__,
	            isHybrid = !!this.__actions__.length,
	            isLazy = value instanceof LazyWrapper,
	            iteratee = args[0],
	            useLazy = isLazy || isArray(value);
	
	        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
	          // Avoid lazy use if the iteratee has a "length" value other than `1`.
	          isLazy = useLazy = false;
	        }
	        var interceptor = function(value) {
	          return (retUnwrapped && chainAll)
	            ? lodashFunc(value, 1)[0]
	            : lodashFunc.apply(undefined, arrayPush([value], args));
	        };
	
	        var action = { 'func': thru, 'args': [interceptor], 'thisArg': undefined },
	            onlyLazy = isLazy && !isHybrid;
	
	        if (retUnwrapped && !chainAll) {
	          if (onlyLazy) {
	            value = value.clone();
	            value.__actions__.push(action);
	            return func.call(value);
	          }
	          return lodashFunc.call(undefined, this.value())[0];
	        }
	        if (!retUnwrapped && useLazy) {
	          value = onlyLazy ? value : new LazyWrapper(this);
	          var result = func.apply(value, args);
	          result.__actions__.push(action);
	          return new LodashWrapper(result, chainAll);
	        }
	        return this.thru(interceptor);
	      };
	    });
	
	    // Add `Array` and `String` methods to `lodash.prototype`.
	    arrayEach(['join', 'pop', 'push', 'replace', 'shift', 'sort', 'splice', 'split', 'unshift'], function(methodName) {
	      var func = (/^(?:replace|split)$/.test(methodName) ? stringProto : arrayProto)[methodName],
	          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
	          retUnwrapped = /^(?:join|pop|replace|shift)$/.test(methodName);
	
	      lodash.prototype[methodName] = function() {
	        var args = arguments;
	        if (retUnwrapped && !this.__chain__) {
	          return func.apply(this.value(), args);
	        }
	        return this[chainName](function(value) {
	          return func.apply(value, args);
	        });
	      };
	    });
	
	    // Map minified function names to their real names.
	    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
	      var lodashFunc = lodash[methodName];
	      if (lodashFunc) {
	        var key = lodashFunc.name,
	            names = realNames[key] || (realNames[key] = []);
	
	        names.push({ 'name': methodName, 'func': lodashFunc });
	      }
	    });
	
	    realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [{ 'name': 'wrapper', 'func': undefined }];
	
	    // Add functions to the lazy wrapper.
	    LazyWrapper.prototype.clone = lazyClone;
	    LazyWrapper.prototype.reverse = lazyReverse;
	    LazyWrapper.prototype.value = lazyValue;
	
	    // Add chaining functions to the `lodash` wrapper.
	    lodash.prototype.chain = wrapperChain;
	    lodash.prototype.commit = wrapperCommit;
	    lodash.prototype.concat = wrapperConcat;
	    lodash.prototype.plant = wrapperPlant;
	    lodash.prototype.reverse = wrapperReverse;
	    lodash.prototype.toString = wrapperToString;
	    lodash.prototype.run = lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
	
	    // Add function aliases to the `lodash` wrapper.
	    lodash.prototype.collect = lodash.prototype.map;
	    lodash.prototype.head = lodash.prototype.first;
	    lodash.prototype.select = lodash.prototype.filter;
	    lodash.prototype.tail = lodash.prototype.rest;
	
	    return lodash;
	  }
	
	  /*--------------------------------------------------------------------------*/
	
	  // Export lodash.
	  var _ = runInContext();
	
	  // Some AMD build optimizers like r.js check for condition patterns like the following:
	  if (true) {
	    // Expose lodash to the global object when an AMD loader is present to avoid
	    // errors in cases where lodash is loaded by a script tag and not intended
	    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
	    // more details.
	    root._ = _;
	
	    // Define as an anonymous module so, through path mapping, it can be
	    // referenced as the "underscore" module.
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
	  else if (freeExports && freeModule) {
	    // Export for Node.js or RingoJS.
	    if (moduleExports) {
	      (freeModule.exports = _)._ = _;
	    }
	    // Export for Rhino with CommonJS support.
	    else {
	      freeExports._ = _;
	    }
	  }
	  else {
	    // Export for a browser or Rhino.
	    root._ = _;
	  }
	}.call(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module), (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Matrix, Screen, Utils, _, __domComplete, __domCompleteState, __domReady, _textSizeNode,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	  slice = [].slice;
	
	_ = __webpack_require__(1)._;
	
	Screen = __webpack_require__(5).Screen;
	
	Matrix = __webpack_require__(9).Matrix;
	
	Utils = {};
	
	Utils.reset = function() {
	  return Framer.CurrentContext.reset();
	};
	
	Utils.getValue = function(value) {
	  if (_.isFunction(value)) {
	    return value();
	  }
	  return value;
	};
	
	Utils.getValueForKeyPath = function(obj, key) {
	  var len, o, ref, ref1, result;
	  result = obj;
	  if (ref = !".", indexOf.call(key, ref) >= 0) {
	    return obj[key];
	  }
	  ref1 = key.split(".");
	  for (o = 0, len = ref1.length; o < len; o++) {
	    key = ref1[o];
	    result = result[key];
	  }
	  return result;
	};
	
	Utils.setValueForKeyPath = function(obj, path, val) {
	  var field, fields, i, n, result;
	  fields = path.split('.');
	  result = obj;
	  i = 0;
	  n = fields.length;
	  while (i < n && result !== void 0) {
	    field = fields[i];
	    if (i === n - 1) {
	      result[field] = val;
	    } else {
	      if (typeof result[field] === 'undefined' || !_.isObject(result[field])) {
	        result[field] = {};
	      }
	      result = result[field];
	    }
	    i++;
	  }
	};
	
	Utils.valueOrDefault = function(value, defaultValue) {
	  if (value === (void 0) || value === null) {
	    value = defaultValue;
	  }
	  return value;
	};
	
	Utils.arrayNext = function(arr, item) {
	  return arr[arr.indexOf(item) + 1] || _.first(arr);
	};
	
	Utils.arrayPrev = function(arr, item) {
	  return arr[arr.indexOf(item) - 1] || _.last(arr);
	};
	
	Utils.sum = function(arr) {
	  return _.reduce(arr, function(a, b) {
	    return a + b;
	  });
	};
	
	Utils.average = function(arr) {
	  return Utils.sum(arr) / arr.length;
	};
	
	Utils.mean = Utils.average;
	
	Utils.median = function(x) {
	  var sorted;
	  if (x.length === 0) {
	    return null;
	  }
	  sorted = x.slice().sort(function(a, b) {
	    return a - b;
	  });
	  if (sorted.length % 2 === 1) {
	    return sorted[(sorted.length - 1) / 2];
	  } else {
	    return (sorted[(sorted.length / 2) - 1] + sorted[sorted.length / 2]) / 2;
	  }
	};
	
	Utils.nearestIncrement = function(x, increment) {
	  if (!increment) {
	    return x;
	  }
	  return Math.round(x * (1 / increment)) / (1 / increment);
	};
	
	if (window.requestAnimationFrame == null) {
	  window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	}
	
	if (window.requestAnimationFrame == null) {
	  window.requestAnimationFrame = function(f) {
	    return Utils.delay(1 / 60, f);
	  };
	}
	
	if (window.performance) {
	  Utils.getTime = function() {
	    return window.performance.now() / 1000;
	  };
	} else {
	  Utils.getTime = function() {
	    return Date.now() / 1000;
	  };
	}
	
	Utils.delay = function(time, f) {
	  var timer;
	  timer = setTimeout(f, time * 1000);
	  Framer.CurrentContext.addTimer(timer);
	  return timer;
	};
	
	Utils.interval = function(time, f) {
	  var timer;
	  timer = setInterval(f, time * 1000);
	  Framer.CurrentContext.addInterval(timer);
	  return timer;
	};
	
	Utils.debounce = function(threshold, fn, immediate) {
	  var timeout;
	  if (threshold == null) {
	    threshold = 0.1;
	  }
	  timeout = null;
	  threshold *= 1000;
	  return function() {
	    var args, delayed, obj;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    obj = this;
	    delayed = function() {
	      if (!immediate) {
	        fn.apply(obj, args);
	      }
	      return timeout = null;
	    };
	    if (timeout) {
	      clearTimeout(timeout);
	    } else if (immediate) {
	      fn.apply(obj, args);
	    }
	    return timeout = setTimeout(delayed, threshold);
	  };
	};
	
	Utils.throttle = function(delay, fn) {
	  var timer;
	  if (delay === 0) {
	    return fn;
	  }
	  delay *= 1000;
	  timer = false;
	  return function() {
	    if (timer) {
	      return;
	    }
	    timer = true;
	    if (delay !== -1) {
	      setTimeout((function() {
	        return timer = false;
	      }), delay);
	    }
	    return fn.apply(null, arguments);
	  };
	};
	
	Utils.memoize = function(fn) {
	  return function() {
	    var args, currentArg, hash, i;
	    args = Array.prototype.slice.call(arguments);
	    hash = "";
	    i = args.length;
	    currentArg = null;
	    while (i--) {
	      currentArg = args[i];
	      hash += (currentArg === Object(currentArg) ? JSON.stringify(currentArg) : currentArg);
	      fn.memoize || (fn.memoize = {});
	    }
	    if (hash in fn.memoize) {
	      return fn.memoize[hash];
	    } else {
	      return fn.memoize[hash] = fn.apply(this, args);
	    }
	  };
	};
	
	Utils.randomColor = function(alpha) {
	  if (alpha == null) {
	    alpha = 1.0;
	  }
	  return Color.random(alpha);
	};
	
	Utils.randomChoice = function(arr) {
	  return arr[Math.floor(Math.random() * arr.length)];
	};
	
	Utils.randomNumber = function(a, b) {
	  if (a == null) {
	    a = 0;
	  }
	  if (b == null) {
	    b = 1;
	  }
	  return Utils.mapRange(Math.random(), 0, 1, a, b);
	};
	
	Utils.defineEnum = function(names, offset, geometric) {
	  var Enum, i, j, len, name, o;
	  if (names == null) {
	    names = [];
	  }
	  if (offset == null) {
	    offset = 0;
	  }
	  if (geometric == null) {
	    geometric = 0;
	  }
	  Enum = {};
	  for (i = o = 0, len = names.length; o < len; i = ++o) {
	    name = names[i];
	    j = i;
	    j = !offset ? j : j + offset;
	    j = !geometric ? j : Math.pow(geometric, j);
	    Enum[Enum[name] = j] = name;
	  }
	  return Enum;
	};
	
	Utils.labelLayer = function(layer, text, style) {
	  if (style == null) {
	    style = {};
	  }
	  style = _.extend({
	    font: "10px/1em Menlo",
	    lineHeight: layer.height + "px",
	    textAlign: "center",
	    color: "#fff"
	  }, style);
	  layer.style = style;
	  return layer.html = text;
	};
	
	Utils.stringify = function(obj) {
	  var error;
	  try {
	    if (_.isObject(obj)) {
	      return JSON.stringify(obj);
	    }
	  } catch (error) {
	    "";
	  }
	  if (obj === null) {
	    return "null";
	  }
	  if (obj === void 0) {
	    return "undefined";
	  }
	  if (obj.toString) {
	    return obj.toString();
	  }
	  return obj;
	};
	
	Utils.inspectObjectType = function(item) {
	  var className, extract, ref, ref1, ref2, ref3;
	  if ((((ref = item.constructor) != null ? ref.name : void 0) != null) && ((ref1 = item.constructor) != null ? ref1.name : void 0) !== "Object") {
	    return item.constructor.name;
	  }
	  extract = function(str) {
	    var match, regex;
	    if (!str) {
	      return null;
	    }
	    regex = /\[object (\w+)\]/;
	    match = regex.exec(str);
	    if (match) {
	      return match[1];
	    }
	    return null;
	  };
	  if (item.toString) {
	    className = extract(item.toString());
	    if (className) {
	      return className;
	    }
	  }
	  if ((ref2 = item.constructor) != null ? ref2.toString : void 0) {
	    className = extract((ref3 = item.constructor) != null ? ref3.toString() : void 0);
	    if (className) {
	      return className.replace("Constructor", "");
	    }
	  }
	  return "Object";
	};
	
	Utils.inspect = function(item, max, l) {
	  var code, limit, objectInfo, objectType;
	  if (max == null) {
	    max = 5;
	  }
	  if (l == null) {
	    l = 0;
	  }
	  if (item === null) {
	    return "null";
	  }
	  if (item === void 0) {
	    return "undefined";
	  }
	  if (_.isFunction(item.toInspect)) {
	    return item.toInspect();
	  }
	  if (_.isString(item)) {
	    return "\"" + item + "\"";
	  }
	  if (_.isNumber(item)) {
	    return "" + item;
	  }
	  if (_.isFunction(item)) {
	    code = item.toString().slice("function ".length).replace(/\n/g, "").replace(/\s+/g, " ");
	    limit = 50;
	    if (code.length > limit && l > 0) {
	      code = (_.trimRight(code.slice(0, +limit + 1 || 9e9))) + "… }";
	    }
	    return "<Function " + code + ">";
	  }
	  if (_.isArray(item)) {
	    if (l > max) {
	      return "[...]";
	    }
	    return "[" + _.map(item, function(i) {
	      return Utils.inspect(i, max, l + 1);
	    }).join(", ") + "]";
	  }
	  if (_.isObject(item)) {
	    objectType = Utils.inspectObjectType(item);
	    if (/HTML\w+?Element/.test(objectType)) {
	      return "<" + objectType + ">";
	    }
	    if (l > max) {
	      objectInfo = "{...}";
	    } else {
	      objectInfo = "{" + _.map(item, function(v, k) {
	        return k + ":" + (Utils.inspect(v, max, l + 1));
	      }).join(", ") + "}";
	    }
	    if (objectType === "Object") {
	      return objectInfo;
	    }
	    return "<" + objectType + " " + objectInfo + ">";
	  }
	  return "" + item;
	};
	
	Utils.uuid = function() {
	  var chars, digit, o, output, r, random;
	  chars = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
	  output = new Array(36);
	  random = 0;
	  for (digit = o = 1; o <= 32; digit = ++o) {
	    if (random <= 0x02) {
	      random = 0x2000000 + (Math.random() * 0x1000000) | 0;
	    }
	    r = random & 0xf;
	    random = random >> 4;
	    output[digit] = chars[digit === 19 ? (r & 0x3) | 0x8 : r];
	  }
	  return output.join("");
	};
	
	Utils.arrayFromArguments = function(args) {
	  if (_.isArray(args[0])) {
	    return args[0];
	  }
	  return Array.prototype.slice.call(args);
	};
	
	Utils.cycle = function() {
	  var args, curr;
	  args = Utils.arrayFromArguments(arguments);
	  curr = -1;
	  return function() {
	    curr++;
	    if (curr >= args.length) {
	      curr = 0;
	    }
	    return args[curr];
	  };
	};
	
	Utils.toggle = Utils.cycle;
	
	Utils.isWebKit = function() {
	  return window.WebKitCSSMatrix !== void 0;
	};
	
	Utils.webkitVersion = function() {
	  var regexp, result, version;
	  version = -1;
	  regexp = /AppleWebKit\/([\d.]+)/;
	  result = regexp.exec(navigator.userAgent);
	  if (result) {
	    version = parseFloat(result[1]);
	  }
	  return version;
	};
	
	Utils.isChrome = function() {
	  return /chrome/.test(navigator.userAgent.toLowerCase());
	};
	
	Utils.isSafari = function() {
	  return /safari/.test(navigator.userAgent.toLowerCase());
	};
	
	Utils.isTouch = function() {
	  return window.ontouchstart === null && window.ontouchmove === null && window.ontouchend === null;
	};
	
	Utils.isDesktop = function() {
	  return Utils.deviceType() === "desktop";
	};
	
	Utils.isPhone = function() {
	  return Utils.deviceType() === "phone";
	};
	
	Utils.isTablet = function() {
	  return Utils.deviceType() === "tablet";
	};
	
	Utils.isMobile = function() {
	  return Utils.isPhone() || Utils.isTablet();
	};
	
	Utils.isFileUrl = function(url) {
	  return _.startsWith(url, "file://");
	};
	
	Utils.isRelativeUrl = function(url) {
	  return !/^([a-zA-Z]{1,8}:\/\/).*$/.test(url);
	};
	
	Utils.isLocalServerUrl = function(url) {
	  return url.indexOf("127.0.0.1") !== -1 || url.indexOf("localhost") !== -1;
	};
	
	Utils.isLocalUrl = function(url) {
	  if (Utils.isFileUrl(url)) {
	    return true;
	  }
	  if (Utils.isLocalServerUrl(url)) {
	    return true;
	  }
	  return false;
	};
	
	Utils.isLocalAssetUrl = function(url, baseUrl) {
	  if (baseUrl == null) {
	    baseUrl = window.location.href;
	  }
	  if (Utils.isLocalUrl(url)) {
	    return true;
	  }
	  if (Utils.isRelativeUrl(url) && Utils.isLocalUrl(baseUrl)) {
	    return true;
	  }
	  return false;
	};
	
	Utils.isFramerStudio = function() {
	  return navigator.userAgent.indexOf("FramerStudio") !== -1;
	};
	
	Utils.framerStudioVersion = function() {
	  var isBeta, isFuture, isLocal, matches, version;
	  if (Utils.isFramerStudio()) {
	    isBeta = navigator.userAgent.indexOf("FramerStudio/beta") >= 0;
	    isLocal = navigator.userAgent.indexOf("FramerStudio/local") >= 0;
	    isFuture = navigator.userAgent.indexOf("FramerStudio/future") >= 0;
	    if (isBeta || isLocal || isFuture) {
	      return Number.MAX_VALUE;
	    }
	    matches = navigator.userAgent.match(/\d+$/);
	    if (matches && matches.length > 0) {
	      version = parseInt(matches[0]);
	    }
	    if (_.isNumber(version)) {
	      return version;
	    }
	  }
	  return Number.MAX_VALUE;
	};
	
	Utils.devicePixelRatio = function() {
	  return window.devicePixelRatio;
	};
	
	Utils.isJP2Supported = function() {
	  return Utils.isWebKit() && !Utils.isChrome();
	};
	
	Utils.deviceType = function() {
	  if (/(tablet)|(iPad)|(Nexus 9)/i.test(navigator.userAgent)) {
	    return "tablet";
	  }
	  if (/(mobi)/i.test(navigator.userAgent)) {
	    return "phone";
	  }
	  return "desktop";
	};
	
	Utils.pathJoin = function() {
	  return Utils.arrayFromArguments(arguments).join("/");
	};
	
	Utils.round = function(value, decimals) {
	  var d;
	  if (decimals == null) {
	    decimals = 0;
	  }
	  d = Math.pow(10, decimals);
	  return Math.round(value * d) / d;
	};
	
	Utils.clamp = function(value, a, b) {
	  var max, min;
	  min = Math.min(a, b);
	  max = Math.max(a, b);
	  if (value < min) {
	    value = min;
	  }
	  if (value > max) {
	    value = max;
	  }
	  return value;
	};
	
	Utils.mapRange = function(value, fromLow, fromHigh, toLow, toHigh) {
	  return toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow));
	};
	
	Utils.modulate = function(value, rangeA, rangeB, limit) {
	  var fromHigh, fromLow, result, toHigh, toLow;
	  if (limit == null) {
	    limit = false;
	  }
	  fromLow = rangeA[0], fromHigh = rangeA[1];
	  toLow = rangeB[0], toHigh = rangeB[1];
	  result = toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow));
	  if (limit === true) {
	    if (toLow < toHigh) {
	      if (result < toLow) {
	        return toLow;
	      }
	      if (result > toHigh) {
	        return toHigh;
	      }
	    } else {
	      if (result > toLow) {
	        return toLow;
	      }
	      if (result < toHigh) {
	        return toHigh;
	      }
	    }
	  }
	  return result;
	};
	
	Utils.parseFunction = function(str) {
	  var result;
	  result = {
	    name: "",
	    args: []
	  };
	  if (_.endsWith(str, ")")) {
	    result.name = str.split("(")[0];
	    result.args = str.split("(")[1].split(",").map(function(a) {
	      return _.trim(_.trimRight(a, ")"));
	    });
	  } else {
	    result.name = str;
	  }
	  return result;
	};
	
	__domCompleteState = "interactive";
	
	__domComplete = [];
	
	__domReady = false;
	
	if (typeof document !== "undefined" && document !== null) {
	  document.onreadystatechange = function(event) {
	    var f, results;
	    if (document.readyState === __domCompleteState) {
	      __domReady = true;
	      results = [];
	      while (__domComplete.length) {
	        results.push(f = __domComplete.shift()());
	      }
	      return results;
	    }
	  };
	}
	
	Utils.domComplete = function(f) {
	  if (__domReady) {
	    return f();
	  } else {
	    return __domComplete.push(f);
	  }
	};
	
	Utils.domCompleteCancel = function(f) {
	  return __domComplete = _.without(__domComplete, f);
	};
	
	Utils.domValidEvent = function(element, eventName) {
	  if (!eventName) {
	    return;
	  }
	  if (eventName === "touchstart" || eventName === "touchmove" || eventName === "touchend") {
	    return true;
	  }
	  return typeof element["on" + (eventName.toLowerCase())] !== "undefined";
	};
	
	Utils.domLoadScript = function(url, callback) {
	  var head, script;
	  script = document.createElement("script");
	  script.type = "text/javascript";
	  script.src = url;
	  script.onload = callback;
	  head = document.getElementsByTagName("head")[0];
	  head.appendChild(script);
	  return script;
	};
	
	Utils.domLoadData = function(path, callback) {
	  var request;
	  request = new XMLHttpRequest();
	  request.addEventListener("load", function() {
	    return callback(null, request.responseText);
	  }, false);
	  request.addEventListener("error", function() {
	    return callback(true, null);
	  }, false);
	  request.open("GET", path, true);
	  return request.send(null);
	};
	
	Utils.domLoadJSON = function(path, callback) {
	  return Utils.domLoadData(path, function(err, data) {
	    return callback(err, JSON.parse(data));
	  });
	};
	
	Utils.domLoadDataSync = function(path) {
	  var e, error, handleError, ref, request;
	  request = new XMLHttpRequest();
	  request.open("GET", path, false);
	  try {
	    request.send(null);
	  } catch (error) {
	    e = error;
	    console.debug("XMLHttpRequest.error", e);
	  }
	  handleError = function() {
	    throw Error("Utils.domLoadDataSync: " + path + " -> [" + request.status + " " + request.statusText + "]");
	  };
	  request.onerror = handleError;
	  if ((ref = request.status) !== 200 && ref !== 0) {
	    handleError();
	  }
	  if (!request.responseText) {
	    handleError();
	  }
	  return request.responseText;
	};
	
	Utils.domLoadJSONSync = function(path) {
	  return JSON.parse(Utils.domLoadDataSync(path));
	};
	
	Utils.domLoadScriptSync = function(path) {
	  var scriptData;
	  scriptData = Utils.domLoadDataSync(path);
	  eval(scriptData);
	  return scriptData;
	};
	
	Utils.insertCSS = function(css) {
	  var styleElement;
	  styleElement = document.createElement("style");
	  styleElement.type = "text/css";
	  styleElement.innerHTML = css;
	  return Utils.domComplete(function() {
	    return document.body.appendChild(styleElement);
	  });
	};
	
	Utils.loadImage = function(url, callback, context) {
	  var element;
	  element = new Image;
	  if (context == null) {
	    context = Framer.CurrentContext;
	  }
	  context.domEventManager.wrap(element).addEventListener("load", function(event) {
	    return callback();
	  });
	  context.domEventManager.wrap(element).addEventListener("error", function(event) {
	    return callback(true);
	  });
	  return element.src = url;
	};
	
	Utils.pointDivide = function(point, fraction) {
	  return point = {
	    x: point.x / fraction,
	    y: point.y / fraction
	  };
	};
	
	Utils.pointAdd = function(pointA, pointB) {
	  var point;
	  return point = {
	    x: pointA.x + pointB.x,
	    y: pointA.y + pointB.y
	  };
	};
	
	Utils.pointSubtract = function(pointA, pointB) {
	  var point;
	  return point = {
	    x: pointA.x - pointB.x,
	    y: pointA.y - pointB.y
	  };
	};
	
	Utils.pointZero = function(args) {
	  if (args == null) {
	    args = {};
	  }
	  return _.defaults(args, {
	    x: 0,
	    y: 0
	  });
	};
	
	Utils.pointMin = function() {
	  var point, points;
	  points = Utils.arrayFromArguments(arguments);
	  return point = {
	    x: _.min(points.map(function(size) {
	      return size.x;
	    })),
	    y: _.min(points.map(function(size) {
	      return size.y;
	    }))
	  };
	};
	
	Utils.pointMax = function() {
	  var point, points;
	  points = Utils.arrayFromArguments(arguments);
	  return point = {
	    x: _.max(points.map(function(size) {
	      return size.x;
	    })),
	    y: _.max(points.map(function(size) {
	      return size.y;
	    }))
	  };
	};
	
	Utils.pointDelta = function(pointA, pointB) {
	  var delta;
	  return delta = {
	    x: pointB.x - pointA.x,
	    y: pointB.y - pointA.y
	  };
	};
	
	Utils.pointDistance = function(pointA, pointB) {
	  var a, b;
	  a = pointA.x - pointB.x;
	  b = pointA.y - pointB.y;
	  return Math.sqrt((a * a) + (b * b));
	};
	
	Utils.pointInvert = function(point) {
	  return point = {
	    x: 0 - point.x,
	    y: 0 - point.y
	  };
	};
	
	Utils.pointTotal = function(point) {
	  return point.x + point.y;
	};
	
	Utils.pointAbs = function(point) {
	  return point = {
	    x: Math.abs(point.x),
	    y: Math.abs(point.y)
	  };
	};
	
	Utils.pointInFrame = function(point, frame) {
	  if (point.x < Utils.frameGetMinX(frame) || point.x > Utils.frameGetMaxX(frame)) {
	    return false;
	  }
	  if (point.y < Utils.frameGetMinY(frame) || point.y > Utils.frameGetMaxY(frame)) {
	    return false;
	  }
	  return true;
	};
	
	Utils.pointCenter = function(pointA, pointB) {
	  var point;
	  return point = {
	    x: (pointA.x + pointB.x) / 2,
	    y: (pointA.y + pointB.y) / 2
	  };
	};
	
	Utils.pointAngle = function(pointA, pointB) {
	  return Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * 180 / Math.PI;
	};
	
	Utils.sizeZero = function(args) {
	  if (args == null) {
	    args = {};
	  }
	  return _.defaults(args, {
	    width: 0,
	    height: 0
	  });
	};
	
	Utils.sizeMin = function() {
	  var size, sizes;
	  sizes = Utils.arrayFromArguments(arguments);
	  return size = {
	    width: _.min(sizes.map(function(size) {
	      return size.width;
	    })),
	    height: _.min(sizes.map(function(size) {
	      return size.height;
	    }))
	  };
	};
	
	Utils.sizeMax = function() {
	  var size, sizes;
	  sizes = Utils.arrayFromArguments(arguments);
	  return size = {
	    width: _.max(sizes.map(function(size) {
	      return size.width;
	    })),
	    height: _.max(sizes.map(function(size) {
	      return size.height;
	    }))
	  };
	};
	
	Utils.rectZero = function(args) {
	  if (args == null) {
	    args = {};
	  }
	  return _.defaults(args, {
	    top: 0,
	    right: 0,
	    bottom: 0,
	    left: 0
	  });
	};
	
	Utils.parseRect = function(args) {
	  if (_.isArray(args) && _.isNumber(args[0])) {
	    if (args.length === 1) {
	      return Utils.parseRect({
	        top: args[0]
	      });
	    }
	    if (args.length === 2) {
	      return Utils.parseRect({
	        top: args[0],
	        right: args[1]
	      });
	    }
	    if (args.length === 3) {
	      return Utils.parseRect({
	        top: args[0],
	        right: args[1],
	        bottom: args[2]
	      });
	    }
	    if (args.length === 4) {
	      return Utils.parseRect({
	        top: args[0],
	        right: args[1],
	        bottom: args[2],
	        left: args[3]
	      });
	    }
	  }
	  if (_.isArray(args) && _.isObject(args[0])) {
	    return args[0];
	  }
	  if (_.isObject(args)) {
	    return args;
	  }
	  return {};
	};
	
	Utils.frameGetMinX = function(frame) {
	  return frame.x;
	};
	
	Utils.frameSetMinX = function(frame, value) {
	  return frame.x = value;
	};
	
	Utils.frameGetMidX = function(frame) {
	  if (frame.width === 0) {
	    return 0;
	  } else {
	    return frame.x + (frame.width / 2.0);
	  }
	};
	
	Utils.frameSetMidX = function(frame, value) {
	  return frame.x = frame.width === 0 ? 0 : value - (frame.width / 2.0);
	};
	
	Utils.frameGetMaxX = function(frame) {
	  if (frame.width === 0) {
	    return 0;
	  } else {
	    return frame.x + frame.width;
	  }
	};
	
	Utils.frameSetMaxX = function(frame, value) {
	  return frame.x = frame.width === 0 ? 0 : value - frame.width;
	};
	
	Utils.frameGetMinY = function(frame) {
	  return frame.y;
	};
	
	Utils.frameSetMinY = function(frame, value) {
	  return frame.y = value;
	};
	
	Utils.frameGetMidY = function(frame) {
	  if (frame.height === 0) {
	    return 0;
	  } else {
	    return frame.y + (frame.height / 2.0);
	  }
	};
	
	Utils.frameSetMidY = function(frame, value) {
	  return frame.y = frame.height === 0 ? 0 : value - (frame.height / 2.0);
	};
	
	Utils.frameGetMaxY = function(frame) {
	  if (frame.height === 0) {
	    return 0;
	  } else {
	    return frame.y + frame.height;
	  }
	};
	
	Utils.frameSetMaxY = function(frame, value) {
	  return frame.y = frame.height === 0 ? 0 : value - frame.height;
	};
	
	Utils.frameZero = function(args) {
	  if (args == null) {
	    args = {};
	  }
	  return _.defaults(args, {
	    top: 0,
	    right: 0,
	    bottom: 0,
	    left: 0
	  });
	};
	
	Utils.frameSize = function(frame) {
	  var size;
	  return size = {
	    width: frame.width,
	    height: frame.height
	  };
	};
	
	Utils.framePoint = function(frame) {
	  var point;
	  return point = {
	    x: frame.x,
	    y: frame.y
	  };
	};
	
	Utils.pointsFromFrame = function(frame) {
	  var corner1, corner2, corner3, corner4, maxX, maxY, minX, minY;
	  minX = Utils.frameGetMinX(frame);
	  maxX = Utils.frameGetMaxX(frame);
	  minY = Utils.frameGetMinY(frame);
	  maxY = Utils.frameGetMaxY(frame);
	  corner1 = {
	    x: minX,
	    y: minY
	  };
	  corner2 = {
	    x: minX,
	    y: maxY
	  };
	  corner3 = {
	    x: maxX,
	    y: maxY
	  };
	  corner4 = {
	    x: maxX,
	    y: minY
	  };
	  return [corner1, corner2, corner3, corner4];
	};
	
	Utils.frameFromPoints = function(points) {
	  var frame, maxX, maxY, minX, minY, xValues, yValues;
	  xValues = _.pluck(points, "x");
	  yValues = _.pluck(points, "y");
	  minX = _.min(xValues);
	  maxX = _.max(xValues);
	  minY = _.min(yValues);
	  maxY = _.max(yValues);
	  return frame = {
	    x: minX,
	    y: minY,
	    width: maxX - minX,
	    height: maxY - minY
	  };
	};
	
	Utils.pixelAlignedFrame = function(frame) {
	  var result;
	  return result = {
	    width: Math.round(frame.width + (frame.x % 1)),
	    height: Math.round(frame.height + (frame.y % 1)),
	    x: Math.round(frame.x),
	    y: Math.round(frame.y)
	  };
	};
	
	Utils.frameMerge = function() {
	  var frame, frames;
	  frames = Utils.arrayFromArguments(arguments);
	  frame = {
	    x: _.min(frames.map(Utils.frameGetMinX)),
	    y: _.min(frames.map(Utils.frameGetMinY))
	  };
	  frame.width = _.max(frames.map(Utils.frameGetMaxX)) - frame.x;
	  frame.height = _.max(frames.map(Utils.frameGetMaxY)) - frame.y;
	  return frame;
	};
	
	Utils.frameFittingPoints = function() {
	  var max, min, points;
	  points = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	  min = Utils.pointMin.apply(Utils, points);
	  max = Utils.pointMax.apply(Utils, points);
	  return new Frame({
	    x: min.x,
	    y: min.y,
	    width: max.x - min.x,
	    height: max.y - min.y
	  });
	};
	
	Utils.framePointForOrigin = function(frame, originX, originY) {
	  return frame = {
	    x: frame.x + (originX * frame.width),
	    y: frame.y + (originY * frame.height),
	    width: frame.width,
	    height: frame.height
	  };
	};
	
	Utils.frameInset = function(frame, inset) {
	  if (_.isNumber(inset)) {
	    inset = {
	      top: inset,
	      right: inset,
	      bottom: inset,
	      left: inset
	    };
	  }
	  return frame = {
	    x: frame.x + inset.left,
	    y: frame.y + inset.top,
	    width: frame.width - inset.left - inset.right,
	    height: frame.height - inset.top - inset.bottom
	  };
	};
	
	Utils.frameSortByAbsoluteDistance = function(point, frames, originX, originY) {
	  var distance;
	  if (originX == null) {
	    originX = 0;
	  }
	  if (originY == null) {
	    originY = 0;
	  }
	  distance = function(frame) {
	    var result;
	    result = Utils.pointDelta(point, Utils.framePointForOrigin(frame, originX, originY));
	    result = Utils.pointAbs(result);
	    result = Utils.pointTotal(result);
	    return result;
	  };
	  return frames.sort(function(a, b) {
	    return distance(a) - distance(b);
	  });
	};
	
	Utils.pointInPolygon = function(point, vs) {
	  var i, inside, intersect, j, x, xi, xj, y, yi, yj;
	  x = point[0];
	  y = point[1];
	  inside = false;
	  i = 0;
	  j = vs.length - 1;
	  while (i < vs.length) {
	    xi = vs[i][0];
	    yi = vs[i][1];
	    xj = vs[j][0];
	    yj = vs[j][1];
	    intersect = ((yi > y && y !== yj) && yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
	    if (intersect) {
	      inside = !inside;
	    }
	    j = i++;
	  }
	  return inside;
	};
	
	Utils.frameCenterPoint = function(frame) {
	  var point;
	  return point = {
	    x: Utils.frameGetMidX(frame),
	    y: Utils.frameGetMidY(frame)
	  };
	};
	
	Utils.rotationNormalizer = function() {
	  var lastValue;
	  lastValue = null;
	  return (function(_this) {
	    return function(value) {
	      var diff, maxDiff, nTimes;
	      if (lastValue == null) {
	        lastValue = value;
	      }
	      diff = lastValue - value;
	      maxDiff = Math.abs(diff) + 180;
	      nTimes = Math.floor(maxDiff / 360);
	      if (diff < 180) {
	        value -= nTimes * 360;
	      }
	      if (diff > 180) {
	        value += nTimes * 360;
	      }
	      lastValue = value;
	      return value;
	    };
	  })(this);
	};
	
	Utils.convertPointToContext = function(point, layer, rootContext, includeLayer) {
	  var ancestor, ancestors, len, o;
	  if (point == null) {
	    point = {};
	  }
	  if (rootContext == null) {
	    rootContext = false;
	  }
	  if (includeLayer == null) {
	    includeLayer = true;
	  }
	  point = _.defaults(point, {
	    x: 0,
	    y: 0,
	    z: 0
	  });
	  ancestors = layer.ancestors(rootContext);
	  if (includeLayer) {
	    ancestors.unshift(layer);
	  }
	  for (o = 0, len = ancestors.length; o < len; o++) {
	    ancestor = ancestors[o];
	    if (ancestor.flat || ancestor.clip) {
	      point.z = 0;
	    }
	    point = ancestor.matrix3d.point(point);
	    if (!ancestor.parent) {
	      point.z = 0;
	    }
	  }
	  return point;
	};
	
	Utils.convertFrameToContext = function(frame, layer, rootContext, includeLayer) {
	  var convertedCorners, corners;
	  if (frame == null) {
	    frame = {};
	  }
	  if (rootContext == null) {
	    rootContext = false;
	  }
	  if (includeLayer == null) {
	    includeLayer = true;
	  }
	  frame = _.defaults(frame, {
	    x: 0,
	    y: 0,
	    width: 100,
	    height: 100
	  });
	  corners = Utils.pointsFromFrame(frame);
	  convertedCorners = corners.map((function(_this) {
	    return function(point) {
	      return Utils.convertPointToContext(point, layer, rootContext, includeLayer);
	    };
	  })(this));
	  return Utils.frameFromPoints(convertedCorners);
	};
	
	Utils.convertPointFromContext = function(point, layer, rootContext, includeLayer) {
	  var ancestor, ancestors, len, o;
	  if (point == null) {
	    point = {};
	  }
	  if (rootContext == null) {
	    rootContext = false;
	  }
	  if (includeLayer == null) {
	    includeLayer = true;
	  }
	  point = _.defaults(point, {
	    x: 0,
	    y: 0,
	    z: 0
	  });
	  ancestors = layer.ancestors(rootContext);
	  ancestors.reverse();
	  if (includeLayer) {
	    ancestors.push(layer);
	  }
	  for (o = 0, len = ancestors.length; o < len; o++) {
	    ancestor = ancestors[o];
	    point = ancestor.matrix3d.inverse().point(point);
	  }
	  return point;
	};
	
	Utils.convertFrameFromContext = function(frame, layer, rootContext, includeLayer) {
	  var convertedCorners, corners;
	  if (frame == null) {
	    frame = {};
	  }
	  if (rootContext == null) {
	    rootContext = false;
	  }
	  if (includeLayer == null) {
	    includeLayer = true;
	  }
	  frame = _.defaults(frame, {
	    x: 0,
	    y: 0,
	    width: 100,
	    height: 100
	  });
	  corners = Utils.pointsFromFrame(frame);
	  convertedCorners = corners.map((function(_this) {
	    return function(point) {
	      return Utils.convertPointFromContext(point, layer, rootContext, includeLayer);
	    };
	  })(this));
	  return Utils.frameFromPoints(convertedCorners);
	};
	
	Utils.convertPoint = function(input, layerA, layerB, rootContext) {
	  var point;
	  if (rootContext == null) {
	    rootContext = false;
	  }
	  point = _.defaults(input, {
	    x: 0,
	    y: 0,
	    z: 0
	  });
	  if (layerA) {
	    point = Utils.convertPointToContext(point, layerA, rootContext);
	  }
	  if (!layerB) {
	    return point;
	  }
	  return Utils.convertPointFromContext(point, layerB, rootContext);
	};
	
	Utils.boundingFrame = function(layer, rootContext) {
	  var boundingFrame, contextCornerPoints, cornerPoints, frame;
	  if (rootContext == null) {
	    rootContext = true;
	  }
	  frame = {
	    x: 0,
	    y: 0,
	    width: layer.width,
	    height: layer.height
	  };
	  cornerPoints = Utils.pointsFromFrame(frame);
	  contextCornerPoints = cornerPoints.map(function(point) {
	    return Utils.convertPointToContext(point, layer, rootContext);
	  });
	  boundingFrame = Utils.frameFromPoints(contextCornerPoints);
	  return Utils.pixelAlignedFrame(boundingFrame);
	};
	
	Utils.perspectiveProjectionMatrix = function(element) {
	  var m, p;
	  p = element.perspective;
	  m = new Matrix();
	  if ((p != null) && p !== 0) {
	    m.m34 = -1 / p;
	  }
	  return m;
	};
	
	Utils.perspectiveMatrix = function(element) {
	  var ox, oy, ppm;
	  ox = element.perspectiveOriginX * element.width;
	  oy = element.perspectiveOriginY * element.height;
	  ppm = Utils.perspectiveProjectionMatrix(element);
	  return new Matrix().translate(ox, oy).multiply(ppm).translate(-ox, -oy);
	};
	
	Utils.globalLayers = function(importedLayers) {
	  var layer, layerName;
	  for (layerName in importedLayers) {
	    layer = importedLayers[layerName];
	    layerName = layerName.replace(/\s/g, "");
	    if (window.hasOwnProperty(layerName) && !window.Framer._globalWarningGiven) {
	      print("Warning: Cannot make layer '" + layerName + "' a global, a variable with that name already exists");
	    } else {
	      window[layerName] = layer;
	    }
	  }
	  return window.Framer._globalWarningGiven = true;
	};
	
	Utils.SVG = (function() {
	  var createElement, getContext, svgContext, svgNS;
	  svgContext = null;
	  svgNS = 'http://www.w3.org/2000/svg';
	  getContext = function() {
	    if (!svgContext) {
	      svgContext = document.createElementNS(svgNS, 'svg');
	      svgContext.style = "visibility: hidden; width: 0px; height: 0px; position: absolute; top: 0; left: 0";
	      document.documentElement.appendChild(svgContext);
	    }
	    return svgContext;
	  };
	  createElement = function(name, attributes) {
	    var el, key, value;
	    el = document.createElementNS(svgNS, name);
	    for (key in attributes) {
	      value = attributes[key];
	      el.setAttribute(key, value);
	    }
	    return el;
	  };
	  return {
	    getContext: getContext,
	    createElement: createElement
	  };
	})();
	
	_textSizeNode = null;
	
	Utils.textSize = function(text, style, constraints) {
	  var frame, rect, shouldCreateNode;
	  if (style == null) {
	    style = {};
	  }
	  if (constraints == null) {
	    constraints = {};
	  }
	  shouldCreateNode = !_textSizeNode;
	  if (shouldCreateNode) {
	    _textSizeNode = document.createElement("div");
	    _textSizeNode.id = "_textSizeNode";
	  }
	  _textSizeNode.removeAttribute("style");
	  _textSizeNode.innerHTML = text;
	  style = _.extend(_.clone(style), {
	    position: "fixed",
	    display: "inline",
	    visibility: "hidden",
	    top: "-10000px",
	    left: "-10000px"
	  });
	  delete style.width;
	  delete style.height;
	  delete style.bottom;
	  delete style.right;
	  if (constraints.width) {
	    style.width = constraints.width + "px";
	  }
	  if (constraints.height) {
	    style.height = constraints.height + "px";
	  }
	  _.extend(_textSizeNode.style, style);
	  if (shouldCreateNode) {
	    if (!window.document.body) {
	      document.write(_textSizeNode.outerHTML);
	      _textSizeNode = document.getElementById("_textSizeNode");
	    } else {
	      window.document.body.appendChild(_textSizeNode);
	    }
	  }
	  rect = _textSizeNode.getBoundingClientRect();
	  return frame = {
	    width: rect.right - rect.left,
	    height: rect.bottom - rect.top
	  };
	};
	
	_.extend(exports, Utils);


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, ScreenClass,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	BaseClass = __webpack_require__(6).BaseClass;
	
	ScreenClass = (function(superClass) {
	  extend(ScreenClass, superClass);
	
	  function ScreenClass() {
	    return ScreenClass.__super__.constructor.apply(this, arguments);
	  }
	
	  ScreenClass.define("width", {
	    get: function() {
	      return Framer.CurrentContext.width;
	    }
	  });
	
	  ScreenClass.define("height", {
	    get: function() {
	      return Framer.CurrentContext.height;
	    }
	  });
	
	  ScreenClass.define("size", {
	    get: function() {
	      return Framer.CurrentContext.size;
	    }
	  });
	
	  ScreenClass.define("frame", {
	    get: function() {
	      return Framer.CurrentContext.frame;
	    }
	  });
	
	  ScreenClass.define("canvasFrame", {
	    get: function() {
	      return Framer.CurrentContext.canvasFrame;
	    }
	  });
	
	  ScreenClass.define("backgroundColor", {
	    importable: false,
	    exportable: false,
	    get: function() {
	      return Framer.Device.screen.backgroundColor;
	    },
	    set: function(value) {
	      return Framer.Device.screen.backgroundColor = value;
	    }
	  });
	
	  ScreenClass.define("perspective", {
	    importable: false,
	    exportable: false,
	    get: function() {
	      return Framer.CurrentContext.perspective;
	    },
	    set: function(value) {
	      return Framer.CurrentContext.perspective = value;
	    }
	  });
	
	  ScreenClass.define("perspectiveOriginX", {
	    importable: false,
	    exportable: false,
	    get: function() {
	      return Framer.CurrentContext.perspectiveOriginX;
	    },
	    set: function(value) {
	      return Framer.CurrentContext.perspectiveOriginX = value;
	    }
	  });
	
	  ScreenClass.define("perspectiveOriginY", {
	    importable: false,
	    exportable: false,
	    get: function() {
	      return Framer.CurrentContext.perspectiveOriginY;
	    },
	    set: function(value) {
	      return Framer.CurrentContext.perspectiveOriginY = value;
	    }
	  });
	
	  ScreenClass.prototype.toInspect = function() {
	    var round;
	    round = function(value) {
	      if (parseInt(value) === value) {
	        return parseInt(value);
	      }
	      return Utils.round(value, 1);
	    };
	    return "<Screen " + (round(this.width)) + "x" + (round(this.height)) + ">";
	  };
	
	  ScreenClass.prototype.onEdgeSwipe = function(cb) {
	    return this.on(Events.EdgeSwipe, cb);
	  };
	
	  ScreenClass.prototype.onEdgeSwipeStart = function(cb) {
	    return this.on(Events.EdgeSwipeStart, cb);
	  };
	
	  ScreenClass.prototype.onEdgeSwipeEnd = function(cb) {
	    return this.on(Events.EdgeSwipeEnd, cb);
	  };
	
	  ScreenClass.prototype.onEdgeSwipeTop = function(cb) {
	    return this.on(Events.EdgeSwipeTop, cb);
	  };
	
	  ScreenClass.prototype.onEdgeSwipeTopStart = function(cb) {
	    return this.on(Events.EdgeSwipeTopStart, cb);
	  };
	
	  ScreenClass.prototype.onEdgeSwipeTopEnd = function(cb) {
	    return this.on(Events.EdgeSwipeTopEnd, cb);
	  };
	
	  ScreenClass.prototype.onEdgeSwipeRight = function(cb) {
	    return this.on(Events.EdgeSwipeRight, cb);
	  };
	
	  ScreenClass.prototype.onEdgeSwipeRightStart = function(cb) {
	    return this.on(Events.EdgeSwipeRightStart, cb);
	  };
	
	  ScreenClass.prototype.onEdgeSwipeRightEnd = function(cb) {
	    return this.on(Events.EdgeSwipeRightEnd, cb);
	  };
	
	  ScreenClass.prototype.onEdgeSwipeBottom = function(cb) {
	    return this.on(Events.EdgeSwipeBottom, cb);
	  };
	
	  ScreenClass.prototype.onEdgeSwipeBottomStart = function(cb) {
	    return this.on(Events.EdgeSwipeBottomStart, cb);
	  };
	
	  ScreenClass.prototype.onEdgeSwipeBottomEnd = function(cb) {
	    return this.on(Events.EdgeSwipeBottomEnd, cb);
	  };
	
	  ScreenClass.prototype.onEdgeSwipeLeft = function(cb) {
	    return this.on(Events.EdgeSwipeLeft, cb);
	  };
	
	  ScreenClass.prototype.onEdgeSwipeLeftStart = function(cb) {
	    return this.on(Events.EdgeSwipeLeftStart, cb);
	  };
	
	  ScreenClass.prototype.onEdgeSwipeLeftEnd = function(cb) {
	    return this.on(Events.EdgeSwipeLeftEnd, cb);
	  };
	
	  return ScreenClass;
	
	})(BaseClass);
	
	exports.Screen = new ScreenClass;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var CounterKey, DefinedPropertiesKey, DefinedPropertiesValuesKey, EventEmitter, Utils, _, capitalizeFirstLetter,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(1)._;
	
	Utils = __webpack_require__(4);
	
	EventEmitter = __webpack_require__(7).EventEmitter;
	
	CounterKey = "_ObjectCounter";
	
	DefinedPropertiesKey = "_DefinedPropertiesKey";
	
	DefinedPropertiesValuesKey = "_DefinedPropertiesValuesKey";
	
	capitalizeFirstLetter = function(string) {
	  return string.charAt(0).toUpperCase() + string.slice(1);
	};
	
	exports.BaseClass = (function(superClass) {
	  extend(BaseClass, superClass);
	
	  BaseClass.define = function(propertyName, descriptor) {
	    var getName, i, j, len, ref, setName;
	    ref = ["enumerable", "exportable", "importable"];
	    for (j = 0, len = ref.length; j < len; j++) {
	      i = ref[j];
	      if (descriptor.hasOwnProperty(i)) {
	        if (!_.isBoolean(descriptor[i])) {
	          throw Error("woops " + propertyName + " " + descriptor[i]);
	        }
	      }
	    }
	    if (this !== BaseClass) {
	      descriptor.propertyName = propertyName;
	      if (descriptor.enumerable == null) {
	        descriptor.enumerable = true;
	      }
	      if (descriptor.exportable == null) {
	        descriptor.exportable = true;
	      }
	      if (descriptor.importable == null) {
	        descriptor.importable = true;
	      }
	      descriptor.importable = descriptor.importable && descriptor.set;
	      if (descriptor.exportable || descriptor.importable) {
	        if (this[DefinedPropertiesKey] == null) {
	          this[DefinedPropertiesKey] = {};
	        }
	        this[DefinedPropertiesKey][propertyName] = descriptor;
	      }
	    }
	    getName = "get" + (capitalizeFirstLetter(propertyName));
	    this.prototype[getName] = descriptor.get;
	    descriptor.get = this.prototype[getName];
	    if (descriptor.set) {
	      setName = "set" + (capitalizeFirstLetter(propertyName));
	      this.prototype[setName] = descriptor.set;
	      descriptor.set = this.prototype[setName];
	    }
	    return Object.defineProperty(this.prototype, propertyName, descriptor);
	  };
	
	  BaseClass.simpleProperty = function(name, fallback, options) {
	    if (options == null) {
	      options = {};
	    }
	    return _.extend(options, {
	      "default": fallback,
	      get: function() {
	        return this._getPropertyValue(name);
	      },
	      set: function(value) {
	        return this._setPropertyValue(name, value);
	      }
	    });
	  };
	
	  BaseClass.proxyProperty = function(keyPath, options) {
	    var objectKey;
	    if (options == null) {
	      options = {};
	    }
	    objectKey = keyPath.split(".")[0];
	    return _.extend(options, {
	      get: function() {
	        if (!_.isObject(this[objectKey])) {
	          return;
	        }
	        return Utils.getValueForKeyPath(this, keyPath);
	      },
	      set: function(value) {
	        if (!_.isObject(this[objectKey])) {
	          return;
	        }
	        return Utils.setValueForKeyPath(this, keyPath, value);
	      }
	    });
	  };
	
	  BaseClass.prototype._setPropertyValue = function(k, v) {
	    return this[DefinedPropertiesValuesKey][k] = v;
	  };
	
	  BaseClass.prototype._getPropertyValue = function(k) {
	    return Utils.valueOrDefault(this[DefinedPropertiesValuesKey][k], this._getPropertyDefaultValue(k));
	  };
	
	  BaseClass.prototype._getPropertyDefaultValue = function(k) {
	    return this._propertyList()[k]["default"];
	  };
	
	  BaseClass.prototype._propertyList = function() {
	    return this.constructor[DefinedPropertiesKey];
	  };
	
	  BaseClass.prototype.keys = function() {
	    return _.keys(this.props);
	  };
	
	  BaseClass.define("props", {
	    importable: false,
	    exportable: false,
	    get: function() {
	      var descriptor, key, keys, propertyList;
	      keys = [];
	      propertyList = this._propertyList();
	      for (key in propertyList) {
	        descriptor = propertyList[key];
	        if (descriptor.exportable) {
	          keys.push(key);
	        }
	      }
	      return _.pick(this, keys);
	    },
	    set: function(value) {
	      var k, propertyList, ref, results, v;
	      propertyList = this._propertyList();
	      results = [];
	      for (k in value) {
	        v = value[k];
	        if ((ref = propertyList[k]) != null ? ref.importable : void 0) {
	          results.push(this[k] = v);
	        } else {
	          results.push(void 0);
	        }
	      }
	      return results;
	    }
	  });
	
	  BaseClass.define("id", {
	    get: function() {
	      return this._id;
	    }
	  });
	
	  BaseClass.prototype.toInspect = function() {
	    return "<" + this.constructor.name + " id:" + (this.id || null) + ">";
	  };
	
	  BaseClass.prototype.onChange = function(name, cb) {
	    return this.on("change:" + name, cb);
	  };
	
	  function BaseClass(options) {
	    this.toInspect = bind(this.toInspect, this);
	    this._getPropertyValue = bind(this._getPropertyValue, this);
	    this._setPropertyValue = bind(this._setPropertyValue, this);
	    var base;
	    BaseClass.__super__.constructor.apply(this, arguments);
	    this._context = typeof Framer !== "undefined" && Framer !== null ? Framer.CurrentContext : void 0;
	    this[DefinedPropertiesValuesKey] = {};
	    if ((base = this.constructor)[CounterKey] == null) {
	      base[CounterKey] = 0;
	    }
	    this.constructor[CounterKey] += 1;
	    this._id = this.constructor[CounterKey];
	    this._applyOptionsAndDefaults(options);
	  }
	
	  BaseClass.prototype._applyOptionsAndDefaults = function(options) {
	    var descriptor, key, ref, results, value;
	    ref = this._propertyList();
	    results = [];
	    for (key in ref) {
	      descriptor = ref[key];
	      if (descriptor.set) {
	        value = Utils.valueOrDefault((descriptor.importable ? options != null ? options[key] : void 0 : void 0), this._getPropertyDefaultValue(key));
	        if (!(value === null || value === (void 0))) {
	          results.push(this[key] = value);
	        } else {
	          results.push(void 0);
	        }
	      } else {
	        results.push(void 0);
	      }
	    }
	    return results;
	  };
	
	  return BaseClass;
	
	})(EventEmitter);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var EventEmitter3, EventKey, _,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(1)._;
	
	EventEmitter3 = __webpack_require__(8);
	
	EventKey = "_events";
	
	exports.EventEmitter = (function(superClass) {
	  extend(EventEmitter, superClass);
	
	  function EventEmitter() {
	    return EventEmitter.__super__.constructor.apply(this, arguments);
	  }
	
	  EventEmitter.prototype.listenerEvents = function() {
	    return _.keys(this[EventKey]);
	  };
	
	  EventEmitter.prototype.removeAllListeners = function(eventName) {
	    var eventNames, i, len, listener, results;
	    if (eventName) {
	      eventNames = [eventName];
	    } else {
	      eventNames = this.listenerEvents();
	    }
	    results = [];
	    for (i = 0, len = eventNames.length; i < len; i++) {
	      eventName = eventNames[i];
	      results.push((function() {
	        var j, len1, ref, results1;
	        ref = this.listeners(eventName);
	        results1 = [];
	        for (j = 0, len1 = ref.length; j < len1; j++) {
	          listener = ref[j];
	          results1.push(this.removeListener(eventName, listener));
	        }
	        return results1;
	      }).call(this));
	    }
	    return results;
	  };
	
	  return EventEmitter;
	
	})(EventEmitter3);


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	//
	// We store our EE objects in a plain object whose properties are event names.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// `~` to make sure that the built-in object properties are not overridden or
	// used as an attack vector.
	// We also assume that `Object.create(null)` is available when the event name
	// is an ES6 Symbol.
	//
	var prefix = typeof Object.create !== 'function' ? '~' : false;
	
	/**
	 * Representation of a single EventEmitter function.
	 *
	 * @param {Function} fn Event handler to be called.
	 * @param {Mixed} context Context for function execution.
	 * @param {Boolean} once Only emit once
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}
	
	/**
	 * Minimal EventEmitter interface that is molded against the Node.js
	 * EventEmitter interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() { /* Nothing to set */ }
	
	/**
	 * Holds the assigned EventEmitters by name.
	 *
	 * @type {Object}
	 * @private
	 */
	EventEmitter.prototype._events = undefined;
	
	/**
	 * Return a list of assigned event listeners.
	 *
	 * @param {String} event The events that should be listed.
	 * @param {Boolean} exists We only need to know if there are listeners.
	 * @returns {Array|Boolean}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event, exists) {
	  var evt = prefix ? prefix + event : event
	    , available = this._events && this._events[evt];
	
	  if (exists) return !!available;
	  if (!available) return [];
	  if (available.fn) return [available.fn];
	
	  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
	    ee[i] = available[i].fn;
	  }
	
	  return ee;
	};
	
	/**
	 * Emit an event to all registered event listeners.
	 *
	 * @param {String} event The name of the event.
	 * @returns {Boolean} Indication if we've emitted an event.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;
	
	  if (!this._events || !this._events[evt]) return false;
	
	  var listeners = this._events[evt]
	    , len = arguments.length
	    , args
	    , i;
	
	  if ('function' === typeof listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
	
	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }
	
	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }
	
	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;
	
	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
	
	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }
	
	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }
	
	  return true;
	};
	
	/**
	 * Register a new EventListener for the given event.
	 *
	 * @param {String} event Name of the event.
	 * @param {Functon} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this)
	    , evt = prefix ? prefix + event : event;
	
	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;
	  else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);
	    else this._events[evt] = [
	      this._events[evt], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Add an EventListener that's only called once.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true)
	    , evt = prefix ? prefix + event : event;
	
	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;
	  else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);
	    else this._events[evt] = [
	      this._events[evt], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Remove event listeners.
	 *
	 * @param {String} event The event we want to remove.
	 * @param {Function} fn The listener that we need to find.
	 * @param {Mixed} context Only remove listeners matching this context.
	 * @param {Boolean} once Only remove once listeners.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;
	
	  if (!this._events || !this._events[evt]) return this;
	
	  var listeners = this._events[evt]
	    , events = [];
	
	  if (fn) {
	    if (listeners.fn) {
	      if (
	           listeners.fn !== fn
	        || (once && !listeners.once)
	        || (context && listeners.context !== context)
	      ) {
	        events.push(listeners);
	      }
	    } else {
	      for (var i = 0, length = listeners.length; i < length; i++) {
	        if (
	             listeners[i].fn !== fn
	          || (once && !listeners[i].once)
	          || (context && listeners[i].context !== context)
	        ) {
	          events.push(listeners[i]);
	        }
	      }
	    }
	  }
	
	  //
	  // Reset the array, or remove it completely if we have no more listeners.
	  //
	  if (events.length) {
	    this._events[evt] = events.length === 1 ? events[0] : events;
	  } else {
	    delete this._events[evt];
	  }
	
	  return this;
	};
	
	/**
	 * Remove all listeners or only the listeners for the specified event.
	 *
	 * @param {String} event The event want to remove all listeners for.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  if (!this._events) return this;
	
	  if (event) delete this._events[prefix ? prefix + event : event];
	  else this._events = prefix ? {} : Object.create(null);
	
	  return this;
	};
	
	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	
	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};
	
	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;
	
	//
	// Expose the module.
	//
	if (true) {
	  module.exports = EventEmitter;
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	WebKitCSSMatrix.prototype.skew = function(skew) {
	  var m, rad, value;
	  if (!skew) {
	    return this;
	  }
	  rad = skew * Math.PI / 180;
	  value = Math.tan(rad);
	  m = new WebKitCSSMatrix();
	  m.m12 = value;
	  m.m21 = value;
	  return this.multiply(m);
	};
	
	WebKitCSSMatrix.prototype.point = function(point) {
	  var ref, w, x, y, z;
	  if (point == null) {
	    point = {};
	  }
	  ref = _.defaults(point, {
	    x: 0,
	    y: 0,
	    z: 0
	  }), x = ref.x, y = ref.y, z = ref.z;
	  w = this.m14 * x + this.m24 * y + this.m34 * z + this.m44;
	  w = w || 1;
	  return point = {
	    x: (this.m11 * x + this.m21 * y + this.m31 * z + this.m41) / w,
	    y: (this.m12 * x + this.m22 * y + this.m32 * z + this.m42) / w,
	    z: (this.m13 * x + this.m23 * y + this.m33 * z + this.m43) / w
	  };
	};
	
	exports.Matrix = WebKitCSSMatrix;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, ColorModel, ColorType, bound01, convertToPercentage, correctAlpha, cssNames, hslToRgb, inputData, isNumeric, isOnePointZero, isPercentage, libhusl, matchers, numberFromString, pad2, percentToFraction, rgbToHex, rgbToHsl, rgbToRgb, rgbaFromHusl, stringToObject,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	BaseClass = __webpack_require__(6).BaseClass;
	
	libhusl = __webpack_require__(11);
	
	ColorType = {
	  RGB: "rgb",
	  HSL: "hsl",
	  HEX: "hex",
	  NAME: "name"
	};
	
	exports.Color = (function(superClass) {
	  extend(Color, superClass);
	
	  function Color(color1, r, g, b) {
	    var color, input;
	    this.color = color1;
	    this.toInspect = bind(this.toInspect, this);
	    if (this.color === "") {
	      this.color = null;
	    }
	    color = this.color;
	    if (Color.isColorObject(color)) {
	      return color;
	    }
	    input = inputData(color, r, g, b);
	    this._type = input.type;
	    this._r = input.r;
	    this._g = input.g;
	    this._b = input.b;
	    this._a = input.a;
	    this._h = input.h;
	    this._s = input.s;
	    this._l = input.l;
	    this._roundA = Math.round(100 * this._a) / 100;
	  }
	
	  Color.define("r", {
	    get: function() {
	      return this._r;
	    }
	  });
	
	  Color.define("g", {
	    get: function() {
	      return this._g;
	    }
	  });
	
	  Color.define("b", {
	    get: function() {
	      return this._b;
	    }
	  });
	
	  Color.define("a", {
	    get: function() {
	      return this._a;
	    }
	  });
	
	  Color.define("h", {
	    get: function() {
	      return this._h;
	    }
	  });
	
	  Color.define("s", {
	    get: function() {
	      return this._s;
	    }
	  });
	
	  Color.define("l", {
	    get: function() {
	      return this._l;
	    }
	  });
	
	  Color.prototype.toHex = function(allow3Char) {
	    return rgbToHex(this._r, this._g, this._b, allow3Char);
	  };
	
	  Color.prototype.toHexString = function(allow3Char) {
	    return "#" + this.toHex(allow3Char);
	  };
	
	  Color.prototype.toRgb = function() {
	    if (this._rgb === void 0) {
	      this._rgb = {
	        r: Math.round(this._r),
	        g: Math.round(this._g),
	        b: Math.round(this._b),
	        a: this._a
	      };
	    }
	    return this._rgb;
	  };
	
	  Color.prototype.toRgbString = function() {
	    if (this._a === 1) {
	      return "rgb(" + (Utils.round(this._r, 0)) + ", " + (Utils.round(this._g, 0)) + ", " + (Utils.round(this._b, 0)) + ")";
	    } else {
	      return "rgba(" + (Utils.round(this._r, 0)) + ", " + (Utils.round(this._g, 0)) + ", " + (Utils.round(this._b, 0)) + ", " + this._roundA + ")";
	    }
	  };
	
	  Color.prototype.toHsl = function() {
	    if (this._hsl === void 0) {
	      this._hsl = {
	        h: this.h,
	        s: this.s,
	        l: this.l,
	        a: this.a
	      };
	    }
	    return this._hsl;
	  };
	
	  Color.prototype.toHusl = function() {
	    var c, husl;
	    if (this._husl === void 0) {
	      c = libhusl._conv;
	      husl = c.lch.husl(c.luv.lch(c.xyz.luv(c.rgb.xyz([this.r / 255, this.g / 255, this.b / 255]))));
	      this._husl = {
	        h: husl[0],
	        s: husl[1],
	        l: husl[2]
	      };
	    }
	    return this._husl;
	  };
	
	  Color.prototype.toHslString = function() {
	    var h, hsl, l, s;
	    if (this._hslString === void 0) {
	      hsl = this.toHsl();
	      h = Math.round(hsl.h);
	      s = Math.round(hsl.s * 100);
	      l = Math.round(hsl.l * 100);
	      if (this._a === 1) {
	        this._hslString = "hsl(" + h + ", " + s + "%, " + l + "%)";
	      } else {
	        this._hslString = "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
	      }
	    }
	    return this._hslString;
	  };
	
	  Color.prototype.toName = function() {
	    var hex, i, key, len, ref, value;
	    if (this._a === 0) {
	      return "transparent";
	    }
	    if (this._a < 1) {
	      return false;
	    }
	    hex = rgbToHex(this._r, this._g, this._b, true);
	    ref = _.keys(cssNames);
	    for (i = 0, len = ref.length; i < len; i++) {
	      key = ref[i];
	      value = cssNames[key];
	      if (value === hex) {
	        return key;
	      }
	    }
	    return false;
	  };
	
	  Color.prototype.lighten = function(amount) {
	    var hsl;
	    if (amount == null) {
	      amount = 10;
	    }
	    hsl = this.toHsl();
	    hsl.l += amount / 100;
	    hsl.l = Math.min(1, Math.max(0, hsl.l));
	    return new Color(hsl);
	  };
	
	  Color.prototype.brighten = function(amount) {
	    var rgb;
	    if (amount == null) {
	      amount = 10;
	    }
	    rgb = this.toRgb();
	    rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
	    rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
	    rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
	    return new Color(rgb);
	  };
	
	  Color.prototype.darken = function(amount) {
	    var hsl;
	    if (amount == null) {
	      amount = 10;
	    }
	    hsl = this.toHsl();
	    hsl.l -= amount / 100;
	    hsl.l = Math.min(1, Math.max(0, hsl.l));
	    return new Color(hsl);
	  };
	
	  Color.prototype.desaturate = function(amount) {
	    var hsl;
	    if (amount == null) {
	      amount = 10;
	    }
	    hsl = this.toHsl();
	    hsl.s -= amount / 100;
	    hsl.s = Math.min(1, Math.max(0, hsl.s));
	    return new Color(hsl);
	  };
	
	  Color.prototype.saturate = function(amount) {
	    var hsl;
	    if (amount == null) {
	      amount = 10;
	    }
	    hsl = this.toHsl();
	    hsl.s += amount / 100;
	    hsl.s = Math.min(1, Math.max(0, hsl.s));
	    return new Color(hsl);
	  };
	
	  Color.prototype.grayscale = function() {
	    var hsl;
	    hsl = this.toHsl();
	    return new Color(hsl).desaturate(100);
	  };
	
	  Color.prototype.toString = function() {
	    return this.toRgbString();
	  };
	
	  Color.prototype.transparent = function() {
	    var result;
	    return result = new Color({
	      r: this.r,
	      g: this.g,
	      b: this.b,
	      a: 0
	    });
	  };
	
	  Color.prototype.mix = function(colorB, fraction, limit, model) {
	    if (limit == null) {
	      limit = false;
	    }
	    return Color.mix(this, colorB, fraction, limit, model);
	  };
	
	  Color.prototype.isEqual = function(colorB) {
	    return Color.equal(this, colorB);
	  };
	
	  Color.prototype.toInspect = function() {
	    if (this._type === ColorType.HSL) {
	      return "<" + this.constructor.name + " h:" + this.h + " s:" + this.s + " l:" + this.l + " a:" + this.a + ">";
	    } else if (this._type === ColorType.HEX || this._type === ColorType.NAME) {
	      return "<" + this.constructor.name + " \"" + this.color + "\">";
	    } else {
	      return "<" + this.constructor.name + " r:" + this.r + " g:" + this.g + " b:" + this.b + " a:" + this.a + ">";
	    }
	  };
	
	  Color.mix = function(colorA, colorB, fraction, limit, model) {
	    var deltaH, fromH, hslA, hslB, result, toH, tween;
	    if (fraction == null) {
	      fraction = .5;
	    }
	    if (limit == null) {
	      limit = false;
	    }
	    result = null;
	    if (typeof colorA === "string" && this.isColorString(colorA)) {
	      colorA = new Color(colorA);
	    }
	    if (typeof colorB === "string" && this.isColorString(colorB)) {
	      colorB = new Color(colorB);
	    }
	    if (!(colorA instanceof Color) && colorB instanceof Color) {
	      colorA = colorB.transparent();
	    } else if (colorA instanceof Color && colorA._a === 0 && colorB instanceof Color && colorB._a !== 0) {
	      colorA = colorB.transparent();
	    } else if (!(colorB instanceof Color) && colorA instanceof Color) {
	      colorB = colorA.transparent();
	    } else if (colorB instanceof Color && colorB._a === 0 && colorA instanceof Color && colorA._a !== 0) {
	      colorB = colorA.transparent();
	    }
	    if (colorB instanceof Color) {
	      if (ColorModel.isRGB(model)) {
	        result = new Color({
	          r: Utils.modulate(fraction, [0, 1], [colorA._r, colorB._r], limit),
	          g: Utils.modulate(fraction, [0, 1], [colorA._g, colorB._g], limit),
	          b: Utils.modulate(fraction, [0, 1], [colorA._b, colorB._b], limit),
	          a: Utils.modulate(fraction, [0, 1], [colorA._a, colorB._a], limit)
	        });
	      } else {
	        hslA;
	        hslB;
	        if (ColorModel.isHSL(model)) {
	          hslA = colorA.toHsl();
	          hslB = colorB.toHsl();
	        } else {
	          hslA = colorA.toHusl();
	          hslB = colorB.toHusl();
	        }
	        if (hslA.s === 0) {
	          hslA.h = hslB.h;
	        } else if (hslB.s === 0) {
	          hslB.h = hslA.h;
	        }
	        fromH = hslA.h;
	        toH = hslB.h;
	        deltaH = toH - fromH;
	        if (deltaH > 180) {
	          deltaH = (toH - 360) - fromH;
	        } else if (deltaH < -180) {
	          deltaH = (toH + 360) - fromH;
	        }
	        tween = {
	          h: Utils.modulate(fraction, [0, 1], [fromH, fromH + deltaH], limit),
	          s: Utils.modulate(fraction, [0, 1], [hslA.s, hslB.s], limit),
	          l: Utils.modulate(fraction, [0, 1], [hslA.l, hslB.l], limit),
	          a: Utils.modulate(fraction, [0, 1], [colorA.a, colorB.a], limit)
	        };
	        if (ColorModel.isHSL(model)) {
	          result = new Color(tween);
	        } else {
	          result = new Color(rgbaFromHusl(tween));
	        }
	      }
	    }
	    return result;
	  };
	
	  Color.random = function(alpha) {
	    var c;
	    if (alpha == null) {
	      alpha = 1.0;
	    }
	    c = function() {
	      return parseInt(Math.random() * 255);
	    };
	    return new Color("rgba(" + (c()) + ", " + (c()) + ", " + (c()) + ", " + alpha + ")");
	  };
	
	  Color.toColor = function(color) {
	    return new Color(color);
	  };
	
	  Color.validColorValue = function(color) {
	    return color instanceof Color || color === null;
	  };
	
	  Color.isColor = function(color) {
	    if (_.isString(color)) {
	      return this.isColorString(color);
	    } else {
	      return this.isColorObject(color);
	    }
	  };
	
	  Color.isColorObject = function(color) {
	    return color instanceof Color;
	  };
	
	  Color.isColorString = function(colorString) {
	    if (_.isString(colorString)) {
	      return stringToObject(colorString) !== false;
	    }
	    return false;
	  };
	
	  Color.equal = function(colorA, colorB) {
	    if (!this.validColorValue(colorA)) {
	      if (!Color.isColorString(colorA)) {
	        return false;
	      }
	    }
	    if (!this.validColorValue(colorB)) {
	      if (!Color.isColorString(colorB)) {
	        return false;
	      }
	    }
	    colorA = new Color(colorA);
	    colorB = new Color(colorB);
	    if (colorA.r !== colorB.r) {
	      return false;
	    }
	    if (colorA.g !== colorB.g) {
	      return false;
	    }
	    if (colorA.b !== colorB.b) {
	      return false;
	    }
	    if (colorA.a !== colorB.a) {
	      return false;
	    }
	    return true;
	  };
	
	  Color.rgbToHsl = function(a, b, c) {
	    return rgbToHsl(a, b, c);
	  };
	
	  return Color;
	
	})(BaseClass);
	
	ColorModel = {
	  RGB: "rgb",
	  RGBA: "rgba",
	  HSL: "hsl",
	  HSLA: "hsla"
	};
	
	ColorModel.isRGB = function(colorModel) {
	  var ref;
	  if (_.isString(colorModel)) {
	    return (ref = colorModel.toLowerCase()) === ColorModel.RGB || ref === ColorModel.RGBA;
	  }
	  return false;
	};
	
	ColorModel.isHSL = function(colorModel) {
	  var ref;
	  if (_.isString(colorModel)) {
	    return (ref = colorModel.toLowerCase()) === ColorModel.HSL || ref === ColorModel.HSLA;
	  }
	  return false;
	};
	
	rgbaFromHusl = function(husl) {
	  var c, rgb, rgba;
	  c = libhusl._conv;
	  rgb = c.xyz.rgb(c.luv.xyz(c.lch.luv(c.husl.lch([husl.h, husl.s, husl.l]))));
	  rgba = {
	    r: rgb[0] * 255,
	    g: rgb[1] * 255,
	    b: rgb[2] * 255,
	    a: husl.a
	  };
	  return rgba;
	};
	
	inputData = function(color, g, b, alpha) {
	  var a, h, hsl, l, ok, rgb, s, type;
	  rgb = {
	    r: 0,
	    g: 0,
	    b: 0
	  };
	  hsl = {
	    h: 0,
	    s: 0,
	    l: 0
	  };
	  a = 1;
	  ok = false;
	  type = ColorType.RGB;
	  if (color === null) {
	    a = 0;
	  } else if (_.isNumber(color)) {
	    rgb.r = color;
	    if (_.isNumber(g)) {
	      rgb.g = g;
	    }
	    if (_.isNumber(b)) {
	      rgb.b = b;
	    }
	    if (_.isNumber(alpha)) {
	      a = alpha;
	    }
	  } else {
	    if (typeof color === "string") {
	      color = stringToObject(color);
	      if (!color) {
	        color = {
	          r: 0,
	          g: 0,
	          b: 0,
	          a: 0
	        };
	      }
	      if (color.hasOwnProperty("type")) {
	        type = color.type;
	      }
	    }
	    if (typeof color === "object") {
	      if (color.hasOwnProperty("r") || color.hasOwnProperty("g") || color.hasOwnProperty("b")) {
	        rgb = rgbToRgb(color.r, color.g, color.b);
	      } else if (color.hasOwnProperty("h") || color.hasOwnProperty("s") || color.hasOwnProperty("l")) {
	        h = isNumeric(color.h) ? parseFloat(color.h) : 0;
	        h = (h + 360) % 360;
	        s = isNumeric(color.s) ? color.s : 1;
	        if (_.isString(color.s)) {
	          s = numberFromString(color.s);
	        }
	        l = isNumeric(color.l) ? color.l : 0.5;
	        if (_.isString(color.l)) {
	          l = numberFromString(color.l);
	        }
	        rgb = hslToRgb(h, s, l);
	        type = ColorType.HSL;
	        hsl = {
	          h: h,
	          s: s,
	          l: l
	        };
	      }
	      if (color.hasOwnProperty("a")) {
	        a = color.a;
	      }
	    }
	  }
	  a = correctAlpha(a);
	  if (type !== ColorType.HSL) {
	    hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
	  }
	  return {
	    type: type,
	    r: Math.min(255, Math.max(rgb.r, 0)),
	    g: Math.min(255, Math.max(rgb.g, 0)),
	    b: Math.min(255, Math.max(rgb.b, 0)),
	    h: Utils.clamp(hsl.h, 0, 360),
	    s: Utils.clamp(hsl.s, 0, 1),
	    l: Utils.clamp(hsl.l, 0, 1),
	    a: a
	  };
	};
	
	numberFromString = function(string) {
	  return string.match(/\d+/)[0];
	};
	
	rgbToRgb = function(r, g, b) {
	  return {
	    r: isNumeric(r) ? bound01(r, 255) * 255 : 0,
	    g: isNumeric(g) ? bound01(g, 255) * 255 : 0,
	    b: isNumeric(b) ? bound01(b, 255) * 255 : 0
	  };
	};
	
	rgbToHex = function(r, g, b, allow3Char) {
	  var hex;
	  hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];
	  if (allow3Char && hex[0].charAt(0) === hex[0].charAt(1) && hex[1].charAt(0) === hex[1].charAt(1) && hex[2].charAt(0) === hex[2].charAt(1)) {
	    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
	  }
	  return hex.join("");
	};
	
	rgbToHsl = function(r, g, b) {
	  var d, h, l, max, min, s;
	  r = bound01(r, 255);
	  g = bound01(g, 255);
	  b = bound01(b, 255);
	  max = Math.max(r, g, b);
	  min = Math.min(r, g, b);
	  h = s = l = (max + min) / 2;
	  if (max === min) {
	    h = s = 0;
	  } else {
	    d = max - min;
	    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	    switch (max) {
	      case r:
	        h = (g - b) / d + (g < b ? 6 : 0);
	        break;
	      case g:
	        h = (b - r) / d + 2;
	        break;
	      case b:
	        h = (r - g) / d + 4;
	    }
	    h /= 6;
	  }
	  return {
	    h: h * 360,
	    s: s,
	    l: l
	  };
	};
	
	hslToRgb = function(h, s, l) {
	  var b, g, hue2rgb, p, q, r;
	  r = void 0;
	  g = void 0;
	  b = void 0;
	  h = bound01(h, 360);
	  s = bound01(s * 100, 100);
	  l = bound01(l * 100, 100);
	  hue2rgb = function(p, q, t) {
	    if (t < 0) {
	      t += 1;
	    }
	    if (t > 1) {
	      t -= 1;
	    }
	    if (t < 1 / 6) {
	      return p + (q - p) * 6 * t;
	    }
	    if (t < 1 / 2) {
	      return q;
	    }
	    if (t < 2 / 3) {
	      return p + (q - p) * (2 / 3 - t) * 6;
	    }
	    return p;
	  };
	  if (s === 0) {
	    r = g = b = l;
	  } else {
	    q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	    p = 2 * l - q;
	    r = hue2rgb(p, q, h + 1 / 3);
	    g = hue2rgb(p, q, h);
	    b = hue2rgb(p, q, h - (1 / 3));
	  }
	  return {
	    r: r * 255,
	    g: g * 255,
	    b: b * 255
	  };
	};
	
	convertToPercentage = function(n) {
	  if (n <= 1) {
	    n = n * 100 + "%";
	  }
	  return n;
	};
	
	correctAlpha = function(a) {
	  a = parseFloat(a);
	  if (a < 0) {
	    a = 0;
	  }
	  if (isNaN(a) || a > 1) {
	    a = 1;
	  }
	  return a;
	};
	
	bound01 = function(n, max) {
	  var processPercent;
	  if (isOnePointZero(n)) {
	    n = "100%";
	  }
	  processPercent = isPercentage(n);
	  n = Math.min(max, Math.max(0, parseFloat(n)));
	  if (processPercent) {
	    n = parseInt(n * max, 10) / 100;
	  }
	  if (Math.abs(n - max) < 0.000001) {
	    return 1;
	  }
	  return n % max / parseFloat(max);
	};
	
	isOnePointZero = function(n) {
	  return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
	};
	
	isPercentage = function(n) {
	  return typeof n === "string" && n.indexOf("%") !== -1;
	};
	
	pad2 = function(char) {
	  if (char.length === 1) {
	    return "0" + char;
	  } else {
	    return "" + char;
	  }
	};
	
	matchers = (function() {
	  var css_integer, css_number, css_unit, permissive_match3, permissive_match4;
	  css_integer = '[-\\+]?\\d+%?';
	  css_number = "[-\\+]?\\d*\\.\\d+%?";
	  css_unit = "(?:" + css_number + ")|(?:" + css_integer + ")";
	  permissive_match3 = '[\\s|\\(]+(' + css_unit + ')[,|\\s]+(' + css_unit + ')[,|\\s]+(' + css_unit + ')\\s*\\)?';
	  permissive_match4 = '[\\s|\\(]+(' + css_unit + ')[,|\\s]+(' + css_unit + ')[,|\\s]+(' + css_unit + ')[,|\\s]+(' + css_unit + ')\\s*\\)?';
	  return {
	    rgb: new RegExp('rgb' + permissive_match3),
	    rgba: new RegExp('rgba' + permissive_match4),
	    hsl: new RegExp('hsl' + permissive_match3),
	    hsla: new RegExp('hsla' + permissive_match4),
	    hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	    hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	  };
	})();
	
	isNumeric = function(value) {
	  return !isNaN(value) && isFinite(value);
	};
	
	percentToFraction = function(percentage) {
	  return numberFromString(percentage) / 100;
	};
	
	stringToObject = function(color) {
	  var match, named, trimLeft, trimRight;
	  trimLeft = /^[\s,#]+/;
	  trimRight = /\s+$/;
	  color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase();
	  named = false;
	  if (cssNames[color]) {
	    color = cssNames[color];
	    named = true;
	    ({
	      type: ColorType.NAME
	    });
	  } else if (color === "transparent") {
	    return {
	      r: 0,
	      g: 0,
	      b: 0,
	      a: 0,
	      type: ColorType.NAME
	    };
	  }
	  match = void 0;
	  if (match = matchers.rgb.exec(color)) {
	    return {
	      r: match[1],
	      g: match[2],
	      b: match[3]
	    };
	  }
	  if (match = matchers.rgba.exec(color)) {
	    return {
	      r: match[1],
	      g: match[2],
	      b: match[3],
	      a: match[4]
	    };
	  }
	  if (match = matchers.hsl.exec(color)) {
	    return {
	      h: match[1],
	      s: percentToFraction(match[2]),
	      l: percentToFraction(match[3])
	    };
	  }
	  if (match = matchers.hsla.exec(color)) {
	    return {
	      h: match[1],
	      s: percentToFraction(match[2]),
	      l: percentToFraction(match[3]),
	      a: match[4]
	    };
	  }
	  if (match = matchers.hex6.exec(color) || (match = matchers.hex6.exec(cssNames[color]))) {
	    return {
	      r: parseInt(match[1], 16),
	      g: parseInt(match[2], 16),
	      b: parseInt(match[3], 16),
	      a: 1,
	      type: ColorType.HEX
	    };
	  }
	  if (match = matchers.hex3.exec(color) || (match = matchers.hex3.exec(cssNames[color]))) {
	    return {
	      r: parseInt(match[1] + "" + match[1], 16),
	      g: parseInt(match[2] + "" + match[2], 16),
	      b: parseInt(match[3] + "" + match[3], 16),
	      type: ColorType.HEX
	    };
	  } else {
	    return false;
	  }
	};
	
	cssNames = {
	  aliceblue: "f0f8ff",
	  antiquewhite: "faebd7",
	  aqua: "0ff",
	  aquamarine: "7fffd4",
	  azure: "f0ffff",
	  beige: "f5f5dc",
	  bisque: "ffe4c4",
	  black: "000",
	  blanchedalmond: "ffebcd",
	  blue: "00f",
	  blueviolet: "8a2be2",
	  brown: "a52a2a",
	  burlywood: "deb887",
	  burntsienna: "ea7e5d",
	  cadetblue: "5f9ea0",
	  chartreuse: "7fff00",
	  chocolate: "d2691e",
	  coral: "ff7f50",
	  cornflowerblue: "6495ed",
	  cornsilk: "fff8dc",
	  crimson: "dc143c",
	  cyan: "0ff",
	  darkblue: "00008b",
	  darkcyan: "008b8b",
	  darkgoldenrod: "b8860b",
	  darkgray: "a9a9a9",
	  darkgreen: "006400",
	  darkgrey: "a9a9a9",
	  darkkhaki: "bdb76b",
	  darkmagenta: "8b008b",
	  darkolivegreen: "556b2f",
	  darkorange: "ff8c00",
	  darkorchid: "9932cc",
	  darkred: "8b0000",
	  darksalmon: "e9967a",
	  darkseagreen: "8fbc8f",
	  darkslateblue: "483d8b",
	  darkslategray: "2f4f4f",
	  darkslategrey: "2f4f4f",
	  darkturquoise: "00ced1",
	  darkviolet: "9400d3",
	  deeppink: "ff1493",
	  deepskyblue: "00bfff",
	  dimgray: "696969",
	  dimgrey: "696969",
	  dodgerblue: "1e90ff",
	  firebrick: "b22222",
	  floralwhite: "fffaf0",
	  forestgreen: "228b22",
	  fuchsia: "f0f",
	  gainsboro: "dcdcdc",
	  ghostwhite: "f8f8ff",
	  gold: "ffd700",
	  goldenrod: "daa520",
	  gray: "808080",
	  green: "008000",
	  greenyellow: "adff2f",
	  grey: "808080",
	  honeydew: "f0fff0",
	  hotpink: "ff69b4",
	  indianred: "cd5c5c",
	  indigo: "4b0082",
	  ivory: "fffff0",
	  khaki: "f0e68c",
	  lavender: "e6e6fa",
	  lavenderblush: "fff0f5",
	  lawngreen: "7cfc00",
	  lemonchiffon: "fffacd",
	  lightblue: "add8e6",
	  lightcoral: "f08080",
	  lightcyan: "e0ffff",
	  lightgoldenrodyellow: "fafad2",
	  lightgray: "d3d3d3",
	  lightgreen: "90ee90",
	  lightgrey: "d3d3d3",
	  lightpink: "ffb6c1",
	  lightsalmon: "ffa07a",
	  lightseagreen: "20b2aa",
	  lightskyblue: "87cefa",
	  lightslategray: "789",
	  lightslategrey: "789",
	  lightsteelblue: "b0c4de",
	  lightyellow: "ffffe0",
	  lime: "0f0",
	  limegreen: "32cd32",
	  linen: "faf0e6",
	  magenta: "f0f",
	  maroon: "800000",
	  mediumaquamarine: "66cdaa",
	  mediumblue: "0000cd",
	  mediumorchid: "ba55d3",
	  mediumpurple: "9370db",
	  mediumseagreen: "3cb371",
	  mediumslateblue: "7b68ee",
	  mediumspringgreen: "00fa9a",
	  mediumturquoise: "48d1cc",
	  mediumvioletred: "c71585",
	  midnightblue: "191970",
	  mintcream: "f5fffa",
	  mistyrose: "ffe4e1",
	  moccasin: "ffe4b5",
	  navajowhite: "ffdead",
	  navy: "000080",
	  oldlace: "fdf5e6",
	  olive: "808000",
	  olivedrab: "6b8e23",
	  orange: "ffa500",
	  orangered: "ff4500",
	  orchid: "da70d6",
	  palegoldenrod: "eee8aa",
	  palegreen: "98fb98",
	  paleturquoise: "afeeee",
	  palevioletred: "db7093",
	  papayawhip: "ffefd5",
	  peachpuff: "ffdab9",
	  peru: "cd853f",
	  pink: "ffc0cb",
	  plum: "dda0dd",
	  powderblue: "b0e0e6",
	  purple: "800080",
	  rebeccapurple: "663399",
	  red: "f00",
	  rosybrown: "bc8f8f",
	  royalblue: "4169e1",
	  saddlebrown: "8b4513",
	  salmon: "fa8072",
	  sandybrown: "f4a460",
	  seagreen: "2e8b57",
	  seashell: "fff5ee",
	  sienna: "a0522d",
	  silver: "c0c0c0",
	  skyblue: "87ceeb",
	  slateblue: "6a5acd",
	  slategray: "708090",
	  slategrey: "708090",
	  snow: "fffafa",
	  springgreen: "00ff7f",
	  steelblue: "4682b4",
	  tan: "d2b48c",
	  teal: "008080",
	  thistle: "d8bfd8",
	  tomato: "ff6347",
	  turquoise: "40e0d0",
	  violet: "ee82ee",
	  wheat: "f5deb3",
	  white: "fff",
	  whitesmoke: "f5f5f5",
	  yellow: "ff0",
	  yellowgreen: "9acd32"
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {// Generated by CoffeeScript 1.9.3
	(function() {
	  var L_to_Y, Y_to_L, conv, distanceFromPole, dotProduct, epsilon, fromLinear, getBounds, intersectLineLine, kappa, lengthOfRayUntilIntersect, m, m_inv, maxChromaForLH, maxSafeChromaForL, refU, refV, root, toLinear;
	
	  m = {
	    R: [3.2409699419045214, -1.5373831775700935, -0.49861076029300328],
	    G: [-0.96924363628087983, 1.8759675015077207, 0.041555057407175613],
	    B: [0.055630079696993609, -0.20397695888897657, 1.0569715142428786]
	  };
	
	  m_inv = {
	    X: [0.41239079926595948, 0.35758433938387796, 0.18048078840183429],
	    Y: [0.21263900587151036, 0.71516867876775593, 0.072192315360733715],
	    Z: [0.019330818715591851, 0.11919477979462599, 0.95053215224966058]
	  };
	
	  refU = 0.19783000664283681;
	
	  refV = 0.468319994938791;
	
	  kappa = 903.2962962962963;
	
	  epsilon = 0.0088564516790356308;
	
	  getBounds = function(L) {
	    var bottom, channel, j, k, len1, len2, m1, m2, m3, ref, ref1, ref2, ret, sub1, sub2, t, top1, top2;
	    sub1 = Math.pow(L + 16, 3) / 1560896;
	    sub2 = sub1 > epsilon ? sub1 : L / kappa;
	    ret = [];
	    ref = ['R', 'G', 'B'];
	    for (j = 0, len1 = ref.length; j < len1; j++) {
	      channel = ref[j];
	      ref1 = m[channel], m1 = ref1[0], m2 = ref1[1], m3 = ref1[2];
	      ref2 = [0, 1];
	      for (k = 0, len2 = ref2.length; k < len2; k++) {
	        t = ref2[k];
	        top1 = (284517 * m1 - 94839 * m3) * sub2;
	        top2 = (838422 * m3 + 769860 * m2 + 731718 * m1) * L * sub2 - 769860 * t * L;
	        bottom = (632260 * m3 - 126452 * m2) * sub2 + 126452 * t;
	        ret.push([top1 / bottom, top2 / bottom]);
	      }
	    }
	    return ret;
	  };
	
	  intersectLineLine = function(line1, line2) {
	    return (line1[1] - line2[1]) / (line2[0] - line1[0]);
	  };
	
	  distanceFromPole = function(point) {
	    return Math.sqrt(Math.pow(point[0], 2) + Math.pow(point[1], 2));
	  };
	
	  lengthOfRayUntilIntersect = function(theta, line) {
	    var b1, len, m1;
	    m1 = line[0], b1 = line[1];
	    len = b1 / (Math.sin(theta) - m1 * Math.cos(theta));
	    if (len < 0) {
	      return null;
	    }
	    return len;
	  };
	
	  maxSafeChromaForL = function(L) {
	    var b1, j, len1, lengths, m1, ref, ref1, x;
	    lengths = [];
	    ref = getBounds(L);
	    for (j = 0, len1 = ref.length; j < len1; j++) {
	      ref1 = ref[j], m1 = ref1[0], b1 = ref1[1];
	      x = intersectLineLine([m1, b1], [-1 / m1, 0]);
	      lengths.push(distanceFromPole([x, b1 + x * m1]));
	    }
	    return Math.min.apply(Math, lengths);
	  };
	
	  maxChromaForLH = function(L, H) {
	    var hrad, j, l, len1, lengths, line, ref;
	    hrad = H / 360 * Math.PI * 2;
	    lengths = [];
	    ref = getBounds(L);
	    for (j = 0, len1 = ref.length; j < len1; j++) {
	      line = ref[j];
	      l = lengthOfRayUntilIntersect(hrad, line);
	      if (l !== null) {
	        lengths.push(l);
	      }
	    }
	    return Math.min.apply(Math, lengths);
	  };
	
	  dotProduct = function(a, b) {
	    var i, j, ref, ret;
	    ret = 0;
	    for (i = j = 0, ref = a.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
	      ret += a[i] * b[i];
	    }
	    return ret;
	  };
	
	  fromLinear = function(c) {
	    if (c <= 0.0031308) {
	      return 12.92 * c;
	    } else {
	      return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
	    }
	  };
	
	  toLinear = function(c) {
	    var a;
	    a = 0.055;
	    if (c > 0.04045) {
	      return Math.pow((c + a) / (1 + a), 2.4);
	    } else {
	      return c / 12.92;
	    }
	  };
	
	  conv = {
	    'xyz': {},
	    'luv': {},
	    'lch': {},
	    'husl': {},
	    'huslp': {},
	    'rgb': {},
	    'hex': {}
	  };
	
	  conv.xyz.rgb = function(tuple) {
	    var B, G, R;
	    R = fromLinear(dotProduct(m.R, tuple));
	    G = fromLinear(dotProduct(m.G, tuple));
	    B = fromLinear(dotProduct(m.B, tuple));
	    return [R, G, B];
	  };
	
	  conv.rgb.xyz = function(tuple) {
	    var B, G, R, X, Y, Z, rgbl;
	    R = tuple[0], G = tuple[1], B = tuple[2];
	    rgbl = [toLinear(R), toLinear(G), toLinear(B)];
	    X = dotProduct(m_inv.X, rgbl);
	    Y = dotProduct(m_inv.Y, rgbl);
	    Z = dotProduct(m_inv.Z, rgbl);
	    return [X, Y, Z];
	  };
	
	  Y_to_L = function(Y) {
	    if (Y <= epsilon) {
	      return Y * kappa;
	    } else {
	      return 116 * Math.pow(Y, 1 / 3) - 16;
	    }
	  };
	
	  L_to_Y = function(L) {
	    if (L <= 8) {
	      return L / kappa;
	    } else {
	      return Math.pow((L + 16) / 116, 3);
	    }
	  };
	
	  conv.xyz.luv = function(tuple) {
	    var L, U, V, X, Y, Z, varU, varV;
	    X = tuple[0], Y = tuple[1], Z = tuple[2];
	    if (Y === 0) {
	      return [0, 0, 0];
	    }
	    L = Y_to_L(Y);
	    varU = (4 * X) / (X + (15 * Y) + (3 * Z));
	    varV = (9 * Y) / (X + (15 * Y) + (3 * Z));
	    U = 13 * L * (varU - refU);
	    V = 13 * L * (varV - refV);
	    return [L, U, V];
	  };
	
	  conv.luv.xyz = function(tuple) {
	    var L, U, V, X, Y, Z, varU, varV;
	    L = tuple[0], U = tuple[1], V = tuple[2];
	    if (L === 0) {
	      return [0, 0, 0];
	    }
	    varU = U / (13 * L) + refU;
	    varV = V / (13 * L) + refV;
	    Y = L_to_Y(L);
	    X = 0 - (9 * Y * varU) / ((varU - 4) * varV - varU * varV);
	    Z = (9 * Y - (15 * varV * Y) - (varV * X)) / (3 * varV);
	    return [X, Y, Z];
	  };
	
	  conv.luv.lch = function(tuple) {
	    var C, H, Hrad, L, U, V;
	    L = tuple[0], U = tuple[1], V = tuple[2];
	    C = Math.sqrt(Math.pow(U, 2) + Math.pow(V, 2));
	    if (C < 0.00000001) {
	      H = 0;
	    } else {
	      Hrad = Math.atan2(V, U);
	      H = Hrad * 360 / 2 / Math.PI;
	      if (H < 0) {
	        H = 360 + H;
	      }
	    }
	    return [L, C, H];
	  };
	
	  conv.lch.luv = function(tuple) {
	    var C, H, Hrad, L, U, V;
	    L = tuple[0], C = tuple[1], H = tuple[2];
	    Hrad = H / 360 * 2 * Math.PI;
	    U = Math.cos(Hrad) * C;
	    V = Math.sin(Hrad) * C;
	    return [L, U, V];
	  };
	
	  conv.husl.lch = function(tuple) {
	    var C, H, L, S, max;
	    H = tuple[0], S = tuple[1], L = tuple[2];
	    if (L > 99.9999999 || L < 0.00000001) {
	      C = 0;
	    } else {
	      max = maxChromaForLH(L, H);
	      C = max / 100 * S;
	    }
	    return [L, C, H];
	  };
	
	  conv.lch.husl = function(tuple) {
	    var C, H, L, S, max;
	    L = tuple[0], C = tuple[1], H = tuple[2];
	    if (L > 99.9999999 || L < 0.00000001) {
	      S = 0;
	    } else {
	      max = maxChromaForLH(L, H);
	      S = C / max * 100;
	    }
	    return [H, S, L];
	  };
	
	  conv.huslp.lch = function(tuple) {
	    var C, H, L, S, max;
	    H = tuple[0], S = tuple[1], L = tuple[2];
	    if (L > 99.9999999 || L < 0.00000001) {
	      C = 0;
	    } else {
	      max = maxSafeChromaForL(L);
	      C = max / 100 * S;
	    }
	    return [L, C, H];
	  };
	
	  conv.lch.huslp = function(tuple) {
	    var C, H, L, S, max;
	    L = tuple[0], C = tuple[1], H = tuple[2];
	    if (L > 99.9999999 || L < 0.00000001) {
	      S = 0;
	    } else {
	      max = maxSafeChromaForL(L);
	      S = C / max * 100;
	    }
	    return [H, S, L];
	  };
	
	  conv.rgb.hex = function(tuple) {
	    var ch, hex, j, len1;
	    hex = "#";
	    for (j = 0, len1 = tuple.length; j < len1; j++) {
	      ch = tuple[j];
	      ch = Math.round(ch * 1e6) / 1e6;
	      if (ch < 0 || ch > 1) {
	        throw new Error("Illegal rgb value: " + ch);
	      }
	      ch = Math.round(ch * 255).toString(16);
	      if (ch.length === 1) {
	        ch = "0" + ch;
	      }
	      hex += ch;
	    }
	    return hex;
	  };
	
	  conv.hex.rgb = function(hex) {
	    var b, g, j, len1, n, r, ref, results;
	    if (hex.charAt(0) === "#") {
	      hex = hex.substring(1, 7);
	    }
	    r = hex.substring(0, 2);
	    g = hex.substring(2, 4);
	    b = hex.substring(4, 6);
	    ref = [r, g, b];
	    results = [];
	    for (j = 0, len1 = ref.length; j < len1; j++) {
	      n = ref[j];
	      results.push(parseInt(n, 16) / 255);
	    }
	    return results;
	  };
	
	  conv.lch.rgb = function(tuple) {
	    return conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(tuple)));
	  };
	
	  conv.rgb.lch = function(tuple) {
	    return conv.luv.lch(conv.xyz.luv(conv.rgb.xyz(tuple)));
	  };
	
	  conv.husl.rgb = function(tuple) {
	    return conv.lch.rgb(conv.husl.lch(tuple));
	  };
	
	  conv.rgb.husl = function(tuple) {
	    return conv.lch.husl(conv.rgb.lch(tuple));
	  };
	
	  conv.huslp.rgb = function(tuple) {
	    return conv.lch.rgb(conv.huslp.lch(tuple));
	  };
	
	  conv.rgb.huslp = function(tuple) {
	    return conv.lch.huslp(conv.rgb.lch(tuple));
	  };
	
	  root = {};
	
	  root.fromRGB = function(R, G, B) {
	    return conv.rgb.husl([R, G, B]);
	  };
	
	  root.fromHex = function(hex) {
	    return conv.rgb.husl(conv.hex.rgb(hex));
	  };
	
	  root.toRGB = function(H, S, L) {
	    return conv.husl.rgb([H, S, L]);
	  };
	
	  root.toHex = function(H, S, L) {
	    return conv.rgb.hex(conv.husl.rgb([H, S, L]));
	  };
	
	  root.p = {};
	
	  root.p.toRGB = function(H, S, L) {
	    return conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(conv.huslp.lch([H, S, L]))));
	  };
	
	  root.p.toHex = function(H, S, L) {
	    return conv.rgb.hex(conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(conv.huslp.lch([H, S, L])))));
	  };
	
	  root.p.fromRGB = function(R, G, B) {
	    return conv.lch.huslp(conv.luv.lch(conv.xyz.luv(conv.rgb.xyz([R, G, B]))));
	  };
	
	  root.p.fromHex = function(hex) {
	    return conv.lch.huslp(conv.luv.lch(conv.xyz.luv(conv.rgb.xyz(conv.hex.rgb(hex)))));
	  };
	
	  root._conv = conv;
	
	  root._getBounds = getBounds;
	
	  root._maxChromaForLH = maxChromaForLH;
	
	  root._maxSafeChromaForL = maxSafeChromaForL;
	
	  if (!((typeof module !== "undefined" && module !== null) || (typeof jQuery !== "undefined" && jQuery !== null) || (typeof requirejs !== "undefined" && requirejs !== null))) {
	    this.HUSL = root;
	  }
	
	  if (typeof module !== "undefined" && module !== null) {
	    module.exports = root;
	  }
	
	  if (typeof jQuery !== "undefined" && jQuery !== null) {
	    jQuery.husl = root;
	  }
	
	  if ((typeof requirejs !== "undefined" && requirejs !== null) && ("function" !== "undefined" && __webpack_require__(12) !== null)) {
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (root), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	
	}).call(this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Animation, BaseClass, Color, Config, Defaults, EventEmitter, Events, Gestures, LayerDraggable, LayerPinchable, LayerStates, LayerStyle, Matrix, NoCacheDateKey, Utils, _, layerProperty, layerValueTypeError,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	  slice = [].slice;
	
	_ = __webpack_require__(1)._;
	
	Utils = __webpack_require__(4);
	
	Config = __webpack_require__(14).Config;
	
	Events = __webpack_require__(15).Events;
	
	Defaults = __webpack_require__(17).Defaults;
	
	BaseClass = __webpack_require__(6).BaseClass;
	
	EventEmitter = __webpack_require__(7).EventEmitter;
	
	Color = __webpack_require__(10).Color;
	
	Matrix = __webpack_require__(9).Matrix;
	
	Animation = __webpack_require__(18).Animation;
	
	LayerStyle = __webpack_require__(25).LayerStyle;
	
	LayerStates = __webpack_require__(26).LayerStates;
	
	LayerDraggable = __webpack_require__(27).LayerDraggable;
	
	LayerPinchable = __webpack_require__(34).LayerPinchable;
	
	Gestures = __webpack_require__(16).Gestures;
	
	NoCacheDateKey = Date.now();
	
	layerValueTypeError = function(name, value) {
	  throw new Error("Layer." + name + ": value '" + value + "' of type '" + (typeof value) + "'' is not valid");
	};
	
	layerProperty = function(obj, name, cssProperty, fallback, validator, transformer, options, set) {
	  var result;
	  if (options == null) {
	    options = {};
	  }
	  result = {
	    "default": fallback,
	    get: function() {
	      if (this._properties.hasOwnProperty(name)) {
	        return this._properties[name];
	      }
	      return fallback;
	    },
	    set: function(value) {
	      if (transformer) {
	        value = transformer(value);
	      }
	      if (value === this._properties[name]) {
	        return;
	      }
	      if (value && validator && !validator(value)) {
	        layerValueTypeError(name, value);
	      }
	      this._properties[name] = value;
	      if (cssProperty !== null) {
	        this._element.style[cssProperty] = LayerStyle[cssProperty](this);
	      }
	      if (typeof set === "function") {
	        set(this, value);
	      }
	      this.emit("change:" + name, value);
	      if (name === "x" || name === "y") {
	        this.emit("change:point", value);
	      }
	      if (name === "width" || name === "height") {
	        this.emit("change:size", value);
	      }
	      if (name === "x" || name === "y" || name === "width" || name === "height") {
	        this.emit("change:frame", value);
	      }
	      if (name === "rotationZ") {
	        return this.emit("change:rotation", value);
	      }
	    }
	  };
	  return result = _.extend(result, options);
	};
	
	exports.Layer = (function(superClass) {
	  extend(Layer, superClass);
	
	  function Layer(options) {
	    if (options == null) {
	      options = {};
	    }
	    this.addListener = bind(this.addListener, this);
	    this.once = bind(this.once, this);
	    this._properties = {};
	    this._style = {};
	    this._children = [];
	    this._prefer2d = false;
	    this._alwaysUseImageCache = false;
	    this._cancelClickEventInDragSession = true;
	    this._cancelClickEventInDragSessionVelocity = 0.1;
	    this._createElement();
	    if (options.hasOwnProperty("frame")) {
	      options = _.extend(options, options.frame);
	    }
	    options = Defaults.getDefaults("Layer", options);
	    Layer.__super__.constructor.call(this, options);
	    this._context.addLayer(this);
	    this._id = this._context.layerCounter;
	    if (!options.parent && options.hasOwnProperty("superLayer")) {
	      options.parent = options.superLayer;
	    }
	    if (!options.parent) {
	      if (!options.shadow) {
	        this._insertElement();
	      }
	    } else {
	      this.parent = options.parent;
	    }
	    if (options.hasOwnProperty("index")) {
	      this.index = options.index;
	    }
	    this._context.emit("layer:create", this);
	  }
	
	  Layer.define("context", {
	    get: function() {
	      return this._context;
	    }
	  });
	
	  Layer.define("custom", Layer.simpleProperty("custom", void 0));
	
	  Layer.define("width", layerProperty(Layer, "width", "width", 100, _.isNumber));
	
	  Layer.define("height", layerProperty(Layer, "height", "height", 100, _.isNumber));
	
	  Layer.define("visible", layerProperty(Layer, "visible", "display", true, _.isBoolean));
	
	  Layer.define("opacity", layerProperty(Layer, "opacity", "opacity", 1, _.isNumber));
	
	  Layer.define("index", layerProperty(Layer, "index", "zIndex", 0, _.isNumber, null, {
	    importable: false,
	    exportable: false
	  }));
	
	  Layer.define("clip", layerProperty(Layer, "clip", "overflow", false, _.isBoolean));
	
	  Layer.define("scrollHorizontal", layerProperty(Layer, "scrollHorizontal", "overflowX", false, _.isBoolean, null, {}, function(layer, value) {
	    if (value === true) {
	      return layer.ignoreEvents = false;
	    }
	  }));
	
	  Layer.define("scrollVertical", layerProperty(Layer, "scrollVertical", "overflowY", false, _.isBoolean, null, {}, function(layer, value) {
	    if (value === true) {
	      return layer.ignoreEvents = false;
	    }
	  }));
	
	  Layer.define("scroll", {
	    get: function() {
	      return this.scrollHorizontal === true || this.scrollVertical === true;
	    },
	    set: function(value) {
	      return this.scrollHorizontal = this.scrollVertical = value;
	    }
	  });
	
	  Layer.define("ignoreEvents", layerProperty(Layer, "ignoreEvents", "pointerEvents", true, _.isBoolean));
	
	  Layer.define("x", layerProperty(Layer, "x", "webkitTransform", 0, _.isNumber));
	
	  Layer.define("y", layerProperty(Layer, "y", "webkitTransform", 0, _.isNumber));
	
	  Layer.define("z", layerProperty(Layer, "z", "webkitTransform", 0, _.isNumber));
	
	  Layer.define("scaleX", layerProperty(Layer, "scaleX", "webkitTransform", 1, _.isNumber));
	
	  Layer.define("scaleY", layerProperty(Layer, "scaleY", "webkitTransform", 1, _.isNumber));
	
	  Layer.define("scaleZ", layerProperty(Layer, "scaleZ", "webkitTransform", 1, _.isNumber));
	
	  Layer.define("scale", layerProperty(Layer, "scale", "webkitTransform", 1, _.isNumber));
	
	  Layer.define("skewX", layerProperty(Layer, "skewX", "webkitTransform", 0, _.isNumber));
	
	  Layer.define("skewY", layerProperty(Layer, "skewY", "webkitTransform", 0, _.isNumber));
	
	  Layer.define("skew", layerProperty(Layer, "skew", "webkitTransform", 0, _.isNumber));
	
	  Layer.define("originX", layerProperty(Layer, "originX", "webkitTransformOrigin", 0.5, _.isNumber));
	
	  Layer.define("originY", layerProperty(Layer, "originY", "webkitTransformOrigin", 0.5, _.isNumber));
	
	  Layer.define("originZ", layerProperty(Layer, "originZ", null, 0, _.isNumber));
	
	  Layer.define("perspective", layerProperty(Layer, "perspective", "webkitPerspective", 0, _.isNumber));
	
	  Layer.define("perspectiveOriginX", layerProperty(Layer, "perspectiveOriginX", "webkitPerspectiveOrigin", 0.5, _.isNumber));
	
	  Layer.define("perspectiveOriginY", layerProperty(Layer, "perspectiveOriginY", "webkitPerspectiveOrigin", 0.5, _.isNumber));
	
	  Layer.define("rotationX", layerProperty(Layer, "rotationX", "webkitTransform", 0, _.isNumber));
	
	  Layer.define("rotationY", layerProperty(Layer, "rotationY", "webkitTransform", 0, _.isNumber));
	
	  Layer.define("rotationZ", layerProperty(Layer, "rotationZ", "webkitTransform", 0, _.isNumber));
	
	  Layer.define("rotation", {
	    get: function() {
	      return this.rotationZ;
	    },
	    set: function(value) {
	      return this.rotationZ = value;
	    }
	  });
	
	  Layer.define("blur", layerProperty(Layer, "blur", "webkitFilter", 0, _.isNumber));
	
	  Layer.define("brightness", layerProperty(Layer, "brightness", "webkitFilter", 100, _.isNumber));
	
	  Layer.define("saturate", layerProperty(Layer, "saturate", "webkitFilter", 100, _.isNumber));
	
	  Layer.define("hueRotate", layerProperty(Layer, "hueRotate", "webkitFilter", 0, _.isNumber));
	
	  Layer.define("contrast", layerProperty(Layer, "contrast", "webkitFilter", 100, _.isNumber));
	
	  Layer.define("invert", layerProperty(Layer, "invert", "webkitFilter", 0, _.isNumber));
	
	  Layer.define("grayscale", layerProperty(Layer, "grayscale", "webkitFilter", 0, _.isNumber));
	
	  Layer.define("sepia", layerProperty(Layer, "sepia", "webkitFilter", 0, _.isNumber));
	
	  Layer.define("shadowX", layerProperty(Layer, "shadowX", "boxShadow", 0, _.isNumber));
	
	  Layer.define("shadowY", layerProperty(Layer, "shadowY", "boxShadow", 0, _.isNumber));
	
	  Layer.define("shadowBlur", layerProperty(Layer, "shadowBlur", "boxShadow", 0, _.isNumber));
	
	  Layer.define("shadowSpread", layerProperty(Layer, "shadowSpread", "boxShadow", 0, _.isNumber));
	
	  Layer.define("shadowColor", layerProperty(Layer, "shadowColor", "boxShadow", "", Color.validColorValue, Color.toColor));
	
	  Layer.define("backgroundColor", layerProperty(Layer, "backgroundColor", "backgroundColor", null, Color.validColorValue, Color.toColor));
	
	  Layer.define("color", layerProperty(Layer, "color", "color", null, Color.validColorValue, Color.toColor));
	
	  Layer.define("borderColor", layerProperty(Layer, "borderColor", "border", null, Color.validColorValue, Color.toColor));
	
	  Layer.define("borderWidth", layerProperty(Layer, "borderWidth", "border", 0, _.isNumber));
	
	  Layer.define("force2d", layerProperty(Layer, "force2d", "webkitTransform", false, _.isBoolean));
	
	  Layer.define("flat", layerProperty(Layer, "flat", "webkitTransformStyle", false, _.isBoolean));
	
	  Layer.define("backfaceVisible", layerProperty(Layer, "backfaceVisible", "webkitBackfaceVisibility", true, _.isBoolean));
	
	  Layer.define("name", {
	    "default": "",
	    get: function() {
	      return this._getPropertyValue("name");
	    },
	    set: function(value) {
	      this._setPropertyValue("name", value);
	      return this._element.setAttribute("name", value);
	    }
	  });
	
	  Layer.define("matrix", {
	    get: function() {
	      if (this.force2d) {
	        return this._matrix2d;
	      }
	      return new Matrix().translate(this.x, this.y, this.z).scale(this.scale).scale(this.scaleX, this.scaleY, this.scaleZ).skew(this.skew).skewX(this.skewX).skewY(this.skewY).translate(0, 0, this.originZ).rotate(this.rotationX, 0, 0).rotate(0, this.rotationY, 0).rotate(0, 0, this.rotationZ).translate(0, 0, -this.originZ);
	    }
	  });
	
	  Layer.define("_matrix2d", {
	    get: function() {
	      return new Matrix().translate(this.x, this.y).scale(this.scale).skewX(this.skew).skewY(this.skew).rotate(0, 0, this.rotationZ);
	    }
	  });
	
	  Layer.define("transformMatrix", {
	    get: function() {
	      return new Matrix().translate(this.originX * this.width, this.originY * this.height).multiply(this.matrix).translate(-this.originX * this.width, -this.originY * this.height);
	    }
	  });
	
	  Layer.define("matrix3d", {
	    get: function() {
	      var parent, ppm;
	      parent = this.superLayer || this.context;
	      ppm = Utils.perspectiveMatrix(parent);
	      return new Matrix().multiply(ppm).multiply(this.transformMatrix);
	    }
	  });
	
	  Layer.define("borderRadius", {
	    importable: true,
	    exportable: true,
	    "default": 0,
	    get: function() {
	      return this._properties["borderRadius"];
	    },
	    set: function(value) {
	      if (value && !_.isNumber(value)) {
	        console.warn("Layer.borderRadius should be a numeric property, not type " + (typeof value));
	      }
	      this._properties["borderRadius"] = value;
	      this._element.style["borderRadius"] = LayerStyle["borderRadius"](this);
	      return this.emit("change:borderRadius", value);
	    }
	  });
	
	  Layer.define("cornerRadius", {
	    importable: false,
	    exportable: false,
	    get: function() {
	      return this.borderRadius;
	    },
	    set: function(value) {
	      return this.borderRadius = value;
	    }
	  });
	
	  Layer.define("point", {
	    get: function() {
	      return _.pick(this, ["x", "y"]);
	    },
	    set: function(point) {
	      var i, k, len, ref, results;
	      if (!point) {
	        return;
	      }
	      if (_.isNumber(point)) {
	        point = {
	          x: point,
	          y: point
	        };
	      }
	      ref = ["x", "y"];
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        k = ref[i];
	        if (point.hasOwnProperty(k)) {
	          results.push(this[k] = point[k]);
	        } else {
	          results.push(void 0);
	        }
	      }
	      return results;
	    }
	  });
	
	  Layer.define("size", {
	    get: function() {
	      return _.pick(this, ["width", "height"]);
	    },
	    set: function(size) {
	      var i, k, len, ref, results;
	      if (!size) {
	        return;
	      }
	      if (_.isNumber(size)) {
	        size = {
	          width: size,
	          height: size
	        };
	      }
	      ref = ["width", "height"];
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        k = ref[i];
	        if (size.hasOwnProperty(k)) {
	          results.push(this[k] = size[k]);
	        } else {
	          results.push(void 0);
	        }
	      }
	      return results;
	    }
	  });
	
	  Layer.define("frame", {
	    get: function() {
	      return _.pick(this, ["x", "y", "width", "height"]);
	    },
	    set: function(frame) {
	      var i, k, len, ref, results;
	      if (!frame) {
	        return;
	      }
	      ref = ["x", "y", "width", "height"];
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        k = ref[i];
	        if (frame.hasOwnProperty(k)) {
	          results.push(this[k] = frame[k]);
	        } else {
	          results.push(void 0);
	        }
	      }
	      return results;
	    }
	  });
	
	  Layer.define("minX", {
	    importable: true,
	    exportable: false,
	    get: function() {
	      return this.x;
	    },
	    set: function(value) {
	      return this.x = value;
	    }
	  });
	
	  Layer.define("midX", {
	    importable: true,
	    exportable: false,
	    get: function() {
	      return Utils.frameGetMidX(this);
	    },
	    set: function(value) {
	      return Utils.frameSetMidX(this, value);
	    }
	  });
	
	  Layer.define("maxX", {
	    importable: true,
	    exportable: false,
	    get: function() {
	      return Utils.frameGetMaxX(this);
	    },
	    set: function(value) {
	      return Utils.frameSetMaxX(this, value);
	    }
	  });
	
	  Layer.define("minY", {
	    importable: true,
	    exportable: false,
	    get: function() {
	      return this.y;
	    },
	    set: function(value) {
	      return this.y = value;
	    }
	  });
	
	  Layer.define("midY", {
	    importable: true,
	    exportable: false,
	    get: function() {
	      return Utils.frameGetMidY(this);
	    },
	    set: function(value) {
	      return Utils.frameSetMidY(this, value);
	    }
	  });
	
	  Layer.define("maxY", {
	    importable: true,
	    exportable: false,
	    get: function() {
	      return Utils.frameGetMaxY(this);
	    },
	    set: function(value) {
	      return Utils.frameSetMaxY(this, value);
	    }
	  });
	
	  Layer.prototype.convertPointFromScreen = function(point) {
	    return Utils.convertPointFromContext(point, this, false);
	  };
	
	  Layer.prototype.convertPointFromCanvas = function(point) {
	    return Utils.convertPointFromContext(point, this, true);
	  };
	
	  Layer.prototype.convertPointToScreen = function(point) {
	    return Utils.convertPointToContext(point, this, false);
	  };
	
	  Layer.prototype.convertPointToCanvas = function(point) {
	    return Utils.convertPointToContext(point, this, true);
	  };
	
	  Layer.define("canvasFrame", {
	    importable: true,
	    exportable: false,
	    get: function() {
	      return Utils.boundingFrame(this);
	    },
	    set: function(frame) {
	      return this.frame = Utils.convertFrameFromContext(frame, this, true, false);
	    }
	  });
	
	  Layer.define("screenFrame", {
	    importable: true,
	    exportable: false,
	    get: function() {
	      return Utils.boundingFrame(this, false);
	    },
	    set: function(frame) {
	      return this.frame = Utils.convertFrameFromContext(frame, this, false, false);
	    }
	  });
	
	  Layer.prototype.contentFrame = function() {
	    if (!this.children.length) {
	      return {
	        x: 0,
	        y: 0,
	        width: 0,
	        height: 0
	      };
	    }
	    return Utils.frameMerge(_.pluck(this.children, "frame"));
	  };
	
	  Layer.prototype.centerFrame = function() {
	    var frame;
	    if (this.parent) {
	      frame = this.frame;
	      Utils.frameSetMidX(frame, parseInt((this.parent.width / 2.0) - this.superLayer.borderWidth));
	      Utils.frameSetMidY(frame, parseInt((this.parent.height / 2.0) - this.superLayer.borderWidth));
	      return frame;
	    } else {
	      frame = this.frame;
	      Utils.frameSetMidX(frame, parseInt(this._context.width / 2.0));
	      Utils.frameSetMidY(frame, parseInt(this._context.height / 2.0));
	      return frame;
	    }
	  };
	
	  Layer.prototype.center = function() {
	    this.frame = this.centerFrame();
	    return this;
	  };
	
	  Layer.prototype.centerX = function(offset) {
	    if (offset == null) {
	      offset = 0;
	    }
	    this.x = this.centerFrame().x + offset;
	    return this;
	  };
	
	  Layer.prototype.centerY = function(offset) {
	    if (offset == null) {
	      offset = 0;
	    }
	    this.y = this.centerFrame().y + offset;
	    return this;
	  };
	
	  Layer.prototype.pixelAlign = function() {
	    this.x = parseInt(this.x);
	    return this.y = parseInt(this.y);
	  };
	
	  Layer.prototype.canvasScaleX = function() {
	    var context, i, len, parent, ref, scale;
	    scale = this.scale * this.scaleX;
	    ref = this.ancestors(context = true);
	    for (i = 0, len = ref.length; i < len; i++) {
	      parent = ref[i];
	      scale = scale * parent.scale * parent.scaleX;
	    }
	    return scale;
	  };
	
	  Layer.prototype.canvasScaleY = function() {
	    var context, i, len, parent, ref, scale;
	    scale = this.scale * this.scaleY;
	    ref = this.ancestors(context = true);
	    for (i = 0, len = ref.length; i < len; i++) {
	      parent = ref[i];
	      scale = scale * parent.scale * parent.scaleY;
	    }
	    return scale;
	  };
	
	  Layer.prototype.screenScaleX = function() {
	    var context, i, len, parent, ref, scale;
	    scale = this.scale * this.scaleX;
	    ref = this.ancestors(context = false);
	    for (i = 0, len = ref.length; i < len; i++) {
	      parent = ref[i];
	      scale = scale * parent.scale * parent.scaleX;
	    }
	    return scale;
	  };
	
	  Layer.prototype.screenScaleY = function() {
	    var context, i, len, parent, ref, scale;
	    scale = this.scale * this.scaleY;
	    ref = this.ancestors(context = false);
	    for (i = 0, len = ref.length; i < len; i++) {
	      parent = ref[i];
	      scale = scale * parent.scale * parent.scaleY;
	    }
	    return scale;
	  };
	
	  Layer.prototype.screenScaledFrame = function() {
	    var context, factorX, factorY, frame, i, layerScaledFrame, layers, len, parent;
	    frame = {
	      x: 0,
	      y: 0,
	      width: this.width * this.screenScaleX(),
	      height: this.height * this.screenScaleY()
	    };
	    layers = this.ancestors(context = true);
	    layers.push(this);
	    layers.reverse();
	    for (i = 0, len = layers.length; i < len; i++) {
	      parent = layers[i];
	      factorX = parent._parentOrContext() ? parent._parentOrContext().screenScaleX() : 1;
	      factorY = parent._parentOrContext() ? parent._parentOrContext().screenScaleY() : 1;
	      layerScaledFrame = parent.scaledFrame();
	      frame.x += layerScaledFrame.x * factorX;
	      frame.y += layerScaledFrame.y * factorY;
	    }
	    return frame;
	  };
	
	  Layer.prototype.scaledFrame = function() {
	    var frame, scaleX, scaleY;
	    frame = this.frame;
	    scaleX = this.scale * this.scaleX;
	    scaleY = this.scale * this.scaleY;
	    frame.width *= scaleX;
	    frame.height *= scaleY;
	    frame.x += (1 - scaleX) * this.originX * this.width;
	    frame.y += (1 - scaleY) * this.originY * this.height;
	    return frame;
	  };
	
	  Layer.define("style", {
	    importable: true,
	    exportable: false,
	    get: function() {
	      return this._element.style;
	    },
	    set: function(value) {
	      _.extend(this._element.style, value);
	      return this.emit("change:style");
	    }
	  });
	
	  Layer.prototype.computedStyle = function() {
	    var getComputedStyle;
	    getComputedStyle = document.defaultView.getComputedStyle;
	    if (getComputedStyle == null) {
	      getComputedStyle = window.getComputedStyle;
	    }
	    return getComputedStyle(this._element);
	  };
	
	  Layer.define("classList", {
	    importable: true,
	    exportable: false,
	    get: function() {
	      return this._element.classList;
	    }
	  });
	
	  Layer.prototype._createElement = function() {
	    if (this._element != null) {
	      return;
	    }
	    this._element = document.createElement("div");
	    return this._element.classList.add("framerLayer");
	  };
	
	  Layer.prototype._insertElement = function() {
	    this.bringToFront();
	    return this._context.element.appendChild(this._element);
	  };
	
	  Layer.define("html", {
	    get: function() {
	      var ref;
	      return ((ref = this._elementHTML) != null ? ref.innerHTML : void 0) || "";
	    },
	    set: function(value) {
	      if (!this._elementHTML) {
	        this._elementHTML = document.createElement("div");
	        this._element.appendChild(this._elementHTML);
	      }
	      this._elementHTML.innerHTML = value;
	      return this.emit("change:html");
	    }
	  });
	
	  Layer.prototype.querySelector = function(query) {
	    return this._element.querySelector(query);
	  };
	
	  Layer.prototype.querySelectorAll = function(query) {
	    return this._element.querySelectorAll(query);
	  };
	
	  Layer.prototype.destroy = function() {
	    var ref;
	    if (this.parent) {
	      this.parent._children = _.without(this.parent._children, this);
	    }
	    if ((ref = this._element.parentNode) != null) {
	      ref.removeChild(this._element);
	    }
	    this.removeAllListeners();
	    this._context.removeLayer(this);
	    return this._context.emit("layer:destroy", this);
	  };
	
	  Layer.prototype.copy = function() {
	    var child, copiedChild, i, layer, len, ref;
	    layer = this.copySingle();
	    ref = this.children;
	    for (i = 0, len = ref.length; i < len; i++) {
	      child = ref[i];
	      copiedChild = child.copy();
	      copiedChild.parent = layer;
	    }
	    return layer;
	  };
	
	  Layer.prototype.copySingle = function() {
	    var copy;
	    copy = new this.constructor(this.props);
	    return copy;
	  };
	
	  Layer.define("image", {
	    "default": "",
	    get: function() {
	      return this._getPropertyValue("image");
	    },
	    set: function(value) {
	      var currentValue, defaults, imageUrl, loader, ref;
	      if (!(_.isString(value) || value === null)) {
	        layerValueTypeError("image", value);
	      }
	      currentValue = this._getPropertyValue("image");
	      if (currentValue === value) {
	        return this.emit("load");
	      }
	      defaults = Defaults.getDefaults("Layer", {});
	      if ((ref = this.backgroundColor) != null ? ref.isEqual(defaults.backgroundColor) : void 0) {
	        this.backgroundColor = null;
	      }
	      this._setPropertyValue("image", value);
	      if (value === null || value === "") {
	        this.style["background-image"] = null;
	        return;
	      }
	      imageUrl = value;
	      if (this._alwaysUseImageCache === false && Utils.isLocalAssetUrl(imageUrl)) {
	        imageUrl += "?nocache=" + NoCacheDateKey;
	      }
	      if (this._domEventManager.listeners(Events.ImageLoaded) || this._domEventManager.listeners(Events.ImageLoadError)) {
	        loader = new Image();
	        loader.name = imageUrl;
	        loader.src = imageUrl;
	        loader.onload = (function(_this) {
	          return function() {
	            _this.style["background-image"] = "url('" + imageUrl + "')";
	            return _this.emit(Events.ImageLoaded, loader);
	          };
	        })(this);
	        return loader.onerror = (function(_this) {
	          return function() {
	            return _this.emit(Events.ImageLoadError, loader);
	          };
	        })(this);
	      } else {
	        return this.style["background-image"] = "url('" + imageUrl + "')";
	      }
	    }
	  });
	
	  Layer.define("parent", {
	    enumerable: false,
	    exportable: false,
	    importable: true,
	    get: function() {
	      return this._parent || null;
	    },
	    set: function(layer) {
	      if (layer === this._parent) {
	        return;
	      }
	      if (!layer instanceof Layer) {
	        throw Error("Layer.parent needs to be a Layer object");
	      }
	      Utils.domCompleteCancel(this.__insertElement);
	      if (this._parent) {
	        this._parent._children = _.without(this._parent._children, this);
	        this._parent._element.removeChild(this._element);
	        this._parent.emit("change:children", {
	          added: [],
	          removed: [this]
	        });
	        this._parent.emit("change:subLayers", {
	          added: [],
	          removed: [this]
	        });
	      }
	      if (layer) {
	        layer._element.appendChild(this._element);
	        layer._children.push(this);
	        layer.emit("change:children", {
	          added: [this],
	          removed: []
	        });
	        layer.emit("change:subLayers", {
	          added: [this],
	          removed: []
	        });
	      } else {
	        this._insertElement();
	      }
	      this._parent = layer;
	      this.bringToFront();
	      this.emit("change:parent");
	      return this.emit("change:superLayer");
	    }
	  });
	
	  Layer.define("children", {
	    enumerable: false,
	    exportable: false,
	    importable: false,
	    get: function() {
	      return _.clone(this._children);
	    }
	  });
	
	  Layer.define("siblings", {
	    enumerable: false,
	    exportable: false,
	    importable: false,
	    get: function() {
	      if (this.parent === null) {
	        return _.filter(this._context.getLayers(), (function(_this) {
	          return function(layer) {
	            return layer !== _this && layer.parent === null;
	          };
	        })(this));
	      }
	      return _.without(this.parent.children, this);
	    }
	  });
	
	  Layer.define("descendants", {
	    enumerable: false,
	    exportable: false,
	    importable: false,
	    get: function() {
	      var f, result;
	      result = [];
	      f = function(layer) {
	        result.push(layer);
	        return layer.children.map(f);
	      };
	      this.children.map(f);
	      return result;
	    }
	  });
	
	  Layer.prototype.addChild = function(layer) {
	    return layer.parent = this;
	  };
	
	  Layer.prototype.removeChild = function(layer) {
	    if (indexOf.call(this.children, layer) < 0) {
	      return;
	    }
	    return layer.parent = null;
	  };
	
	  Layer.prototype.childrenWithName = function(name) {
	    return _.filter(this.children, function(layer) {
	      return layer.name === name;
	    });
	  };
	
	  Layer.prototype.siblingsWithName = function(name) {
	    return _.filter(this.siblingLayers, function(layer) {
	      return layer.name === name;
	    });
	  };
	
	  Layer.prototype.ancestors = function(context) {
	    var currentLayer, parents;
	    if (context == null) {
	      context = false;
	    }
	    parents = [];
	    currentLayer = this;
	    if (context === false) {
	      while (currentLayer.parent) {
	        parents.push(currentLayer.parent);
	        currentLayer = currentLayer.parent;
	      }
	    } else {
	      while (currentLayer._parentOrContext()) {
	        parents.push(currentLayer._parentOrContext());
	        currentLayer = currentLayer._parentOrContext();
	      }
	    }
	    return parents;
	  };
	
	  Layer.prototype.childrenAbove = function(point, originX, originY) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    return _.filter(this.children, function(layer) {
	      return Utils.framePointForOrigin(layer.frame, originX, originY).y < point.y;
	    });
	  };
	
	  Layer.prototype.childrenBelow = function(point, originX, originY) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    return _.filter(this.children, function(layer) {
	      return Utils.framePointForOrigin(layer.frame, originX, originY).y > point.y;
	    });
	  };
	
	  Layer.prototype.childrenLeft = function(point, originX, originY) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    return _.filter(this.children, function(layer) {
	      return Utils.framePointForOrigin(layer.frame, originX, originY).x < point.x;
	    });
	  };
	
	  Layer.prototype.childrenRight = function(point, originX, originY) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    return _.filter(this.children, function(layer) {
	      return Utils.framePointForOrigin(layer.frame, originX, originY).x > point.x;
	    });
	  };
	
	  Layer.prototype._parentOrContext = function() {
	    if (this.parent) {
	      return this.parent;
	    }
	    if (this._context._parent) {
	      return this._context._parent;
	    }
	  };
	
	  Layer.define("superLayer", {
	    enumerable: false,
	    exportable: false,
	    importable: false,
	    get: function() {
	      return this.parent;
	    },
	    set: function(value) {
	      return this.parent = value;
	    }
	  });
	
	  Layer.define("subLayers", {
	    enumerable: false,
	    exportable: false,
	    importable: false,
	    get: function() {
	      return this.children;
	    }
	  });
	
	  Layer.define("siblingLayers", {
	    enumerable: false,
	    exportable: false,
	    importable: false,
	    get: function() {
	      return this.siblings;
	    }
	  });
	
	  Layer.prototype.superLayers = function(context) {
	    if (context == null) {
	      context = false;
	    }
	    return this.ancestors(context);
	  };
	
	  Layer.prototype.addSubLayer = function(layer) {
	    return this.addChild(layer);
	  };
	
	  Layer.prototype.removeSubLayer = function(layer) {
	    return this.removeChild(layer);
	  };
	
	  Layer.prototype.subLayersByName = function(name) {
	    return this.childrenWithName(name);
	  };
	
	  Layer.prototype.siblingLayersByName = function(name) {
	    return this.siblingsWithName(name);
	  };
	
	  Layer.prototype.subLayersAbove = function(point, originX, originY) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    return this.childrenAbove(point, originX, originY);
	  };
	
	  Layer.prototype.subLayersBelow = function(point, originX, originY) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    return this.childrenBelow(point, originX, originY);
	  };
	
	  Layer.prototype.subLayersLeft = function(point, originX, originY) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    return this.childrenLeft(point, originX, originY);
	  };
	
	  Layer.prototype.subLayersRight = function(point, originX, originY) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    return this.childrenRight(point, originX, originY);
	  };
	
	  Layer.prototype._superOrParentLayer = function() {
	    return this._parentOrContext();
	  };
	
	  Layer.prototype.animate = function(options) {
	    var animation, start;
	    start = options.start;
	    if (start == null) {
	      start = true;
	    }
	    delete options.start;
	    options.layer = this;
	    animation = new Animation(options);
	    if (start) {
	      animation.start();
	    }
	    return animation;
	  };
	
	  Layer.prototype.animations = function() {
	    return _.filter(this._context.animations, (function(_this) {
	      return function(animation) {
	        return animation.options.layer === _this;
	      };
	    })(this));
	  };
	
	  Layer.prototype.animatingProperties = function() {
	    var animation, i, j, len, len1, properties, propertyName, ref, ref1;
	    properties = {};
	    ref = this.animations();
	    for (i = 0, len = ref.length; i < len; i++) {
	      animation = ref[i];
	      ref1 = animation.animatingProperties();
	      for (j = 0, len1 = ref1.length; j < len1; j++) {
	        propertyName = ref1[j];
	        properties[propertyName] = animation;
	      }
	    }
	    return properties;
	  };
	
	  Layer.define("isAnimating", {
	    enumerable: false,
	    exportable: false,
	    get: function() {
	      return this.animations().length !== 0;
	    }
	  });
	
	  Layer.prototype.animateStop = function() {
	    var ref;
	    _.invoke(this.animations(), "stop");
	    return (ref = this._draggable) != null ? ref.animateStop() : void 0;
	  };
	
	  Layer.prototype.bringToFront = function() {
	    return this.index = _.max(_.union([0], this.siblingLayers.map(function(layer) {
	      return layer.index;
	    }))) + 1;
	  };
	
	  Layer.prototype.sendToBack = function() {
	    return this.index = _.min(_.union([0], this.siblingLayers.map(function(layer) {
	      return layer.index;
	    }))) - 1;
	  };
	
	  Layer.prototype.placeBefore = function(layer) {
	    var i, l, len, ref;
	    if (indexOf.call(this.siblingLayers, layer) < 0) {
	      return;
	    }
	    ref = this.siblingLayers;
	    for (i = 0, len = ref.length; i < len; i++) {
	      l = ref[i];
	      if (l.index <= layer.index) {
	        l.index -= 1;
	      }
	    }
	    return this.index = layer.index + 1;
	  };
	
	  Layer.prototype.placeBehind = function(layer) {
	    var i, l, len, ref;
	    if (indexOf.call(this.siblingLayers, layer) < 0) {
	      return;
	    }
	    ref = this.siblingLayers;
	    for (i = 0, len = ref.length; i < len; i++) {
	      l = ref[i];
	      if (l.index >= layer.index) {
	        l.index += 1;
	      }
	    }
	    return this.index = layer.index - 1;
	  };
	
	  Layer.define("states", {
	    enumerable: false,
	    exportable: false,
	    importable: false,
	    get: function() {
	      return this._states != null ? this._states : this._states = new LayerStates(this);
	    }
	  });
	
	  Layer.define("draggable", {
	    importable: false,
	    exportable: false,
	    get: function() {
	      return this._draggable != null ? this._draggable : this._draggable = new LayerDraggable(this);
	    },
	    set: function(value) {
	      if (_.isBoolean(value)) {
	        return this.draggable.enabled = value;
	      }
	    }
	  });
	
	  Layer.define("pinchable", {
	    importable: false,
	    exportable: false,
	    get: function() {
	      return this._pinchable != null ? this._pinchable : this._pinchable = new LayerPinchable(this);
	    },
	    set: function(value) {
	      if (_.isBoolean(value)) {
	        return this.pinchable.enabled = value;
	      }
	    }
	  });
	
	  Layer.define("scrollFrame", {
	    importable: false,
	    get: function() {
	      var frame;
	      return frame = {
	        x: this.scrollX,
	        y: this.scrollY,
	        width: this.width,
	        height: this.height
	      };
	    },
	    set: function(frame) {
	      this.scrollX = frame.x;
	      return this.scrollY = frame.y;
	    }
	  });
	
	  Layer.define("scrollX", {
	    get: function() {
	      return this._element.scrollLeft;
	    },
	    set: function(value) {
	      if (!_.isNumber(value)) {
	        layerValueTypeError("scrollX", value);
	      }
	      return this._element.scrollLeft = value;
	    }
	  });
	
	  Layer.define("scrollY", {
	    get: function() {
	      return this._element.scrollTop;
	    },
	    set: function(value) {
	      if (!_.isNumber(value)) {
	        layerValueTypeError("scrollY", value);
	      }
	      return this._element.scrollTop = value;
	    }
	  });
	
	  Layer.define("_domEventManager", {
	    get: function() {
	      return this._context.domEventManager.wrap(this._element);
	    }
	  });
	
	  Layer.prototype.emit = function() {
	    var args, eventName, ref, velocity;
	    eventName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
	    if (this._cancelClickEventInDragSession) {
	      if (eventName === Events.Click || eventName === Events.Tap || eventName === Events.TapStart || eventName === Events.TapEnd || eventName === Events.LongPress || eventName === Events.LongPressStart || eventName === Events.LongPressEnd) {
	        if (this._parentDraggableLayer()) {
	          velocity = (ref = this._parentDraggableLayer()) != null ? ref.draggable.velocity : void 0;
	          if (Math.abs(velocity.x) > this._cancelClickEventInDragSessionVelocity) {
	            return;
	          }
	          if (Math.abs(velocity.y) > this._cancelClickEventInDragSessionVelocity) {
	            return;
	          }
	        }
	      }
	    }
	    return Layer.__super__.emit.apply(this, [eventName].concat(slice.call(args), [this]));
	  };
	
	  Layer.prototype.once = function(eventName, listener) {
	    Layer.__super__.once.call(this, eventName, listener);
	    return this._addListener(eventName, listener);
	  };
	
	  Layer.prototype.addListener = function(eventName, listener) {
	    if (!eventName) {
	      throw Error("Layer.on needs a valid event name");
	    }
	    if (!listener) {
	      throw Error("Layer.on needs an event listener");
	    }
	    Layer.__super__.addListener.call(this, eventName, listener);
	    return this._addListener(eventName, listener);
	  };
	
	  Layer.prototype.removeListener = function(eventName, listener) {
	    if (!eventName) {
	      throw Error("Layer.off needs a valid event name");
	    }
	    Layer.__super__.removeListener.call(this, eventName, listener);
	    return this._removeListener(eventName, listener);
	  };
	
	  Layer.prototype._addListener = function(eventName, listener) {
	    if (!_.startsWith(eventName, "change:")) {
	      this.ignoreEvents = false;
	    }
	    if (Utils.domValidEvent(this._element, eventName) || indexOf.call(_.values(Gestures), eventName) >= 0) {
	      if (!this._domEventManager.listeners(eventName).length) {
	        return this._domEventManager.addEventListener(eventName, (function(_this) {
	          return function(event) {
	            return _this.emit(eventName, event);
	          };
	        })(this));
	      }
	    }
	  };
	
	  Layer.prototype._removeListener = function(eventName, listener) {
	    if (!this.listeners(eventName).length) {
	      return this._domEventManager.removeAllListeners(eventName);
	    }
	  };
	
	  Layer.prototype._parentDraggableLayer = function() {
	    var i, layer, len, ref, ref1;
	    ref = this.ancestors();
	    for (i = 0, len = ref.length; i < len; i++) {
	      layer = ref[i];
	      if ((ref1 = layer._draggable) != null ? ref1.enabled : void 0) {
	        return layer;
	      }
	    }
	    return null;
	  };
	
	  Layer.prototype.on = Layer.prototype.addListener;
	
	  Layer.prototype.off = Layer.prototype.removeListener;
	
	  Layer.prototype.onClick = function(cb) {
	    return this.on(Events.Click, cb);
	  };
	
	  Layer.prototype.onDoubleClick = function(cb) {
	    return this.on(Events.DoubleClick, cb);
	  };
	
	  Layer.prototype.onScrollStart = function(cb) {
	    return this.on(Events.ScrollStart, cb);
	  };
	
	  Layer.prototype.onScroll = function(cb) {
	    return this.on(Events.Scroll, cb);
	  };
	
	  Layer.prototype.onScrollEnd = function(cb) {
	    return this.on(Events.ScrollEnd, cb);
	  };
	
	  Layer.prototype.onScrollAnimationDidStart = function(cb) {
	    return this.on(Events.ScrollAnimationDidStart, cb);
	  };
	
	  Layer.prototype.onScrollAnimationDidEnd = function(cb) {
	    return this.on(Events.ScrollAnimationDidEnd, cb);
	  };
	
	  Layer.prototype.onTouchStart = function(cb) {
	    return this.on(Events.TouchStart, cb);
	  };
	
	  Layer.prototype.onTouchEnd = function(cb) {
	    return this.on(Events.TouchEnd, cb);
	  };
	
	  Layer.prototype.onTouchMove = function(cb) {
	    return this.on(Events.TouchMove, cb);
	  };
	
	  Layer.prototype.onMouseUp = function(cb) {
	    return this.on(Events.MouseUp, cb);
	  };
	
	  Layer.prototype.onMouseDown = function(cb) {
	    return this.on(Events.MouseDown, cb);
	  };
	
	  Layer.prototype.onMouseOver = function(cb) {
	    return this.on(Events.MouseOver, cb);
	  };
	
	  Layer.prototype.onMouseOut = function(cb) {
	    return this.on(Events.MouseOut, cb);
	  };
	
	  Layer.prototype.onMouseMove = function(cb) {
	    return this.on(Events.MouseMove, cb);
	  };
	
	  Layer.prototype.onMouseWheel = function(cb) {
	    return this.on(Events.MouseWheel, cb);
	  };
	
	  Layer.prototype.onAnimationStart = function(cb) {
	    return this.on(Events.AnimationStart, cb);
	  };
	
	  Layer.prototype.onAnimationStop = function(cb) {
	    return this.on(Events.AnimationStop, cb);
	  };
	
	  Layer.prototype.onAnimationEnd = function(cb) {
	    return this.on(Events.AnimationEnd, cb);
	  };
	
	  Layer.prototype.onAnimationDidStart = function(cb) {
	    return this.on(Events.AnimationDidStart, cb);
	  };
	
	  Layer.prototype.onAnimationDidStop = function(cb) {
	    return this.on(Events.AnimationDidStop, cb);
	  };
	
	  Layer.prototype.onAnimationDidEnd = function(cb) {
	    return this.on(Events.AnimationDidEnd, cb);
	  };
	
	  Layer.prototype.onImageLoaded = function(cb) {
	    return this.on(Events.ImageLoaded, cb);
	  };
	
	  Layer.prototype.onImageLoadError = function(cb) {
	    return this.on(Events.ImageLoadError, cb);
	  };
	
	  Layer.prototype.onMove = function(cb) {
	    return this.on(Events.Move, cb);
	  };
	
	  Layer.prototype.onDragStart = function(cb) {
	    return this.on(Events.DragStart, cb);
	  };
	
	  Layer.prototype.onDragWillMove = function(cb) {
	    return this.on(Events.DragWillMove, cb);
	  };
	
	  Layer.prototype.onDragMove = function(cb) {
	    return this.on(Events.DragMove, cb);
	  };
	
	  Layer.prototype.onDragDidMove = function(cb) {
	    return this.on(Events.DragDidMove, cb);
	  };
	
	  Layer.prototype.onDrag = function(cb) {
	    return this.on(Events.Drag, cb);
	  };
	
	  Layer.prototype.onDragEnd = function(cb) {
	    return this.on(Events.DragEnd, cb);
	  };
	
	  Layer.prototype.onDragAnimationStart = function(cb) {
	    return this.on(Events.DragAnimationStart, cb);
	  };
	
	  Layer.prototype.onDragAnimationEnd = function(cb) {
	    return this.on(Events.DragAnimationEnd, cb);
	  };
	
	  Layer.prototype.onDirectionLockStart = function(cb) {
	    return this.on(Events.DirectionLockStart, cb);
	  };
	
	  Layer.prototype.onStateDidSwitch = function(cb) {
	    return this.on(Events.StateDidSwitch, cb);
	  };
	
	  Layer.prototype.onStateWillSwitch = function(cb) {
	    return this.on(Events.StateWillSwitch, cb);
	  };
	
	  Layer.prototype.onTap = function(cb) {
	    return this.on(Events.Tap, cb);
	  };
	
	  Layer.prototype.onTapStart = function(cb) {
	    return this.on(Events.TapStart, cb);
	  };
	
	  Layer.prototype.onTapEnd = function(cb) {
	    return this.on(Events.TapEnd, cb);
	  };
	
	  Layer.prototype.onDoubleTap = function(cb) {
	    return this.on(Events.DoubleTap, cb);
	  };
	
	  Layer.prototype.onForceTap = function(cb) {
	    return this.on(Events.ForceTap, cb);
	  };
	
	  Layer.prototype.onForceTapChange = function(cb) {
	    return this.on(Events.ForceTapChange, cb);
	  };
	
	  Layer.prototype.onForceTapStart = function(cb) {
	    return this.on(Events.ForceTapStart, cb);
	  };
	
	  Layer.prototype.onForceTapEnd = function(cb) {
	    return this.on(Events.ForceTapEnd, cb);
	  };
	
	  Layer.prototype.onLongPress = function(cb) {
	    return this.on(Events.LongPress, cb);
	  };
	
	  Layer.prototype.onLongPressStart = function(cb) {
	    return this.on(Events.LongPressStart, cb);
	  };
	
	  Layer.prototype.onLongPressEnd = function(cb) {
	    return this.on(Events.LongPressEnd, cb);
	  };
	
	  Layer.prototype.onSwipe = function(cb) {
	    return this.on(Events.Swipe, cb);
	  };
	
	  Layer.prototype.onSwipeStart = function(cb) {
	    return this.on(Events.SwipeStart, cb);
	  };
	
	  Layer.prototype.onSwipeEnd = function(cb) {
	    return this.on(Events.SwipeEnd, cb);
	  };
	
	  Layer.prototype.onSwipeUp = function(cb) {
	    return this.on(Events.SwipeUp, cb);
	  };
	
	  Layer.prototype.onSwipeUpStart = function(cb) {
	    return this.on(Events.SwipeUpStart, cb);
	  };
	
	  Layer.prototype.onSwipeUpEnd = function(cb) {
	    return this.on(Events.SwipeUpEnd, cb);
	  };
	
	  Layer.prototype.onSwipeDown = function(cb) {
	    return this.on(Events.SwipeDown, cb);
	  };
	
	  Layer.prototype.onSwipeDownStart = function(cb) {
	    return this.on(Events.SwipeDownStart, cb);
	  };
	
	  Layer.prototype.onSwipeDownEnd = function(cb) {
	    return this.on(Events.SwipeDownEnd, cb);
	  };
	
	  Layer.prototype.onSwipeLeft = function(cb) {
	    return this.on(Events.SwipeLeft, cb);
	  };
	
	  Layer.prototype.onSwipeLeftStart = function(cb) {
	    return this.on(Events.SwipeLeftStart, cb);
	  };
	
	  Layer.prototype.onSwipeLeftEnd = function(cb) {
	    return this.on(Events.SwipeLeftEnd, cb);
	  };
	
	  Layer.prototype.onSwipeRight = function(cb) {
	    return this.on(Events.SwipeRight, cb);
	  };
	
	  Layer.prototype.onSwipeRightStart = function(cb) {
	    return this.on(Events.SwipeRightStart, cb);
	  };
	
	  Layer.prototype.onSwipeRightEnd = function(cb) {
	    return this.on(Events.SwipeRightEnd, cb);
	  };
	
	  Layer.prototype.onPan = function(cb) {
	    return this.on(Events.Pan, cb);
	  };
	
	  Layer.prototype.onPanStart = function(cb) {
	    return this.on(Events.PanStart, cb);
	  };
	
	  Layer.prototype.onPanEnd = function(cb) {
	    return this.on(Events.PanEnd, cb);
	  };
	
	  Layer.prototype.onPanLeft = function(cb) {
	    return this.on(Events.PanLeft, cb);
	  };
	
	  Layer.prototype.onPanRight = function(cb) {
	    return this.on(Events.PanRight, cb);
	  };
	
	  Layer.prototype.onPanUp = function(cb) {
	    return this.on(Events.PanUp, cb);
	  };
	
	  Layer.prototype.onPanDown = function(cb) {
	    return this.on(Events.PanDown, cb);
	  };
	
	  Layer.prototype.onPinch = function(cb) {
	    return this.on(Events.Pinch, cb);
	  };
	
	  Layer.prototype.onPinchStart = function(cb) {
	    return this.on(Events.PinchStart, cb);
	  };
	
	  Layer.prototype.onPinchEnd = function(cb) {
	    return this.on(Events.PinchEnd, cb);
	  };
	
	  Layer.prototype.onScale = function(cb) {
	    return this.on(Events.Scale, cb);
	  };
	
	  Layer.prototype.onScaleStart = function(cb) {
	    return this.on(Events.ScaleStart, cb);
	  };
	
	  Layer.prototype.onScaleEnd = function(cb) {
	    return this.on(Events.ScaleEnd, cb);
	  };
	
	  Layer.prototype.onRotate = function(cb) {
	    return this.on(Events.Rotate, cb);
	  };
	
	  Layer.prototype.onRotateStart = function(cb) {
	    return this.on(Events.RotateStart, cb);
	  };
	
	  Layer.prototype.onRotateEnd = function(cb) {
	    return this.on(Events.RotateEnd, cb);
	  };
	
	  Layer.prototype.toInspect = function() {
	    var round;
	    round = function(value) {
	      if (parseInt(value) === value) {
	        return parseInt(value);
	      }
	      return Utils.round(value, 1);
	    };
	    if (this.name) {
	      return "<" + this.constructor.name + " id:" + this.id + " name:" + this.name + " (" + (round(this.x)) + "," + (round(this.y)) + ") " + (round(this.width)) + "x" + (round(this.height)) + ">";
	    }
	    return "<" + this.constructor.name + " id:" + this.id + " (" + (round(this.x)) + "," + (round(this.y)) + ") " + (round(this.width)) + "x" + (round(this.height)) + ">";
	  };
	
	  return Layer;
	
	})(BaseClass);


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var FramerCSS, Utils;
	
	Utils = __webpack_require__(4);
	
	FramerCSS = "body {\n	margin: 0;\n}\n\n.framerContext {\n	position: absolute;\n	left: 0;\n	top: 0;\n	right: 0;\n	bottom: 0;\n	pointer-events: none;\n}\n\n.framerLayer {\n	display: block;\n	position: absolute;\n	left: 0;\n	top: 0;\n	background-repeat: no-repeat;\n	background-size: cover;\n	-webkit-overflow-scrolling: touch;\n	-webkit-box-sizing: border-box;\n	-webkit-user-select: none;\n}\n\n.framerLayer input,\n.framerLayer textarea,\n.framerLayer select,\n.framerLayer option,\n.framerLayer div[contenteditable=true]\n{\n	pointer-events: auto;\n	-webkit-user-select: auto;\n}\n\n.framerDebug {\n	padding: 6px;\n	color: #fff;\n	font: 10px/1em Monaco;\n}\n";
	
	Utils.domComplete(function() {
	  return Utils.insertCSS(FramerCSS);
	});


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Events, Gestures, Utils, _,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	Utils = __webpack_require__(4);
	
	_ = __webpack_require__(1)._;
	
	Gestures = __webpack_require__(16).Gestures;
	
	Events = {};
	
	Events.TouchStart = "touchstart";
	
	Events.TouchEnd = "touchend";
	
	Events.TouchMove = "touchmove";
	
	Events.MouseUp = "mouseup";
	
	Events.MouseDown = "mousedown";
	
	Events.MouseOver = "mouseover";
	
	Events.MouseOut = "mouseout";
	
	Events.MouseMove = "mousemove";
	
	Events.MouseWheel = "mousewheel";
	
	Events.DoubleClick = "dblclick";
	
	Events.MouseDoubleClick = "dblclick";
	
	if (!Utils.isTouch()) {
	  Events.TouchStart = Events.MouseDown;
	  Events.TouchEnd = Events.MouseUp;
	  Events.TouchMove = Events.MouseMove;
	}
	
	Events.Click = Events.TouchEnd;
	
	Events.AnimationStart = "start";
	
	Events.AnimationStop = "stop";
	
	Events.AnimationEnd = "end";
	
	Events.AnimationDidStart = "start";
	
	Events.AnimationDidStop = "stop";
	
	Events.AnimationDidEnd = "end";
	
	Events.Scroll = "scroll";
	
	Events.ImageLoaded = "load";
	
	Events.ImageLoadError = "error";
	
	_.extend(Events, Gestures);
	
	Events.touchEvent = function(event) {
	  var ref, ref1, touchEvent;
	  touchEvent = (ref = event.touches) != null ? ref[0] : void 0;
	  if (touchEvent == null) {
	    touchEvent = (ref1 = event.changedTouches) != null ? ref1[0] : void 0;
	  }
	  if (touchEvent == null) {
	    touchEvent = event;
	  }
	  return touchEvent;
	};
	
	Events.wrap = function(element) {
	  return Framer.CurrentContext.domEventManager.wrap(element);
	};
	
	Events.isGesture = function(eventName) {
	  return indexOf.call(Gestures, eventName) >= 0;
	};
	
	exports.Events = Events;


/***/ },
/* 16 */
/***/ function(module, exports) {

	var Gestures;
	
	Gestures = {};
	
	Gestures.Tap = "tap";
	
	Gestures.TapStart = "tapstart";
	
	Gestures.TapEnd = "tapend";
	
	Gestures.DoubleTap = "doubletap";
	
	Gestures.ForceTap = "forcetap";
	
	Gestures.ForceTapChange = "forcetapchange";
	
	Gestures.ForceTapStart = "forcetapstart";
	
	Gestures.ForceTapEnd = "forcetapend";
	
	Gestures.LongPress = "longpress";
	
	Gestures.LongPressStart = "longpressstart";
	
	Gestures.LongPressEnd = "longpressend";
	
	Gestures.Swipe = "swipe";
	
	Gestures.SwipeStart = "swipestart";
	
	Gestures.SwipeEnd = "swipeend";
	
	Gestures.SwipeUp = "swipeup";
	
	Gestures.SwipeUpStart = "swipeupstart";
	
	Gestures.SwipeUpEnd = "swipeupend";
	
	Gestures.SwipeDown = "swipedown";
	
	Gestures.SwipeDownStart = "swipedownstart";
	
	Gestures.SwipeDownEnd = "swipedownend";
	
	Gestures.SwipeLeft = "swipeleft";
	
	Gestures.SwipeLeftStart = "swipeleftstart";
	
	Gestures.SwipeLeftEnd = "swipeleftend";
	
	Gestures.SwipeRight = "swiperight";
	
	Gestures.SwipeRightStart = "swiperightstart";
	
	Gestures.SwipeRightEnd = "swiperightend";
	
	Gestures.EdgeSwipe = "edgeswipe";
	
	Gestures.EdgeSwipeStart = "edgeswipestart";
	
	Gestures.EdgeSwipeEnd = "edgeswipeend";
	
	Gestures.EdgeSwipeTop = "edgeswipetop";
	
	Gestures.EdgeSwipeTopStart = "edgeswipetopstart";
	
	Gestures.EdgeSwipeTopEnd = "edgeswipetopend";
	
	Gestures.EdgeSwipeRight = "edgeswiperight";
	
	Gestures.EdgeSwipeRightStart = "edgeswiperightstart";
	
	Gestures.EdgeSwipeRightEnd = "edgeswiperightend";
	
	Gestures.EdgeSwipeBottom = "edgeswipebottom";
	
	Gestures.EdgeSwipeBottomStart = "edgeswipebottomstart";
	
	Gestures.EdgeSwipeBottomEnd = "edgeswipebottomend";
	
	Gestures.EdgeSwipeLeft = "edgeswipeleft";
	
	Gestures.EdgeSwipeLeftStart = "edgeswipeleftstart";
	
	Gestures.EdgeSwipeLeftEnd = "edgeswipeleftend";
	
	Gestures.Pan = "pan";
	
	Gestures.PanStart = "panstart";
	
	Gestures.PanEnd = "panend";
	
	Gestures.PanLeft = "panleft";
	
	Gestures.PanRight = "panright";
	
	Gestures.PanUp = "panup";
	
	Gestures.PanDown = "pandown";
	
	Gestures.Pinch = "pinch";
	
	Gestures.PinchStart = "pinchstart";
	
	Gestures.PinchEnd = "pinchend";
	
	Gestures.Scale = "scale";
	
	Gestures.ScaleStart = "scalestart";
	
	Gestures.ScaleEnd = "scaleend";
	
	Gestures.Rotate = "rotate";
	
	Gestures.RotateStart = "rotatestart";
	
	Gestures.RotateEnd = "rotateend";
	
	exports.Gestures = Gestures;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var Originals, Utils, _;
	
	_ = __webpack_require__(1)._;
	
	Utils = __webpack_require__(4);
	
	Originals = {
	  Layer: {
	    backgroundColor: "rgba(0, 124, 255, 0.5)",
	    color: "white",
	    shadowColor: "black",
	    width: 100,
	    height: 100
	  },
	  Animation: {
	    curve: "ease",
	    time: 1
	  },
	  Context: {
	    perspective: 0,
	    perspectiveOriginX: 0.5,
	    perspectiveOriginY: 0.5,
	    parent: null,
	    name: null
	  },
	  DeviceComponent: {
	    fullScreen: false,
	    padding: 50,
	    deviceType: "apple-iphone-6s-silver",
	    deviceZoom: "fit",
	    contentZoom: 1,
	    orientation: "portrait",
	    keyboard: false,
	    animationOptions: {
	      time: .3,
	      curve: "ease-in-out"
	    }
	  },
	  LayerDraggable: {
	    momentum: true,
	    momentumOptions: {
	      friction: 2.1,
	      tolerance: 1
	    },
	    bounce: true,
	    bounceOptions: {
	      friction: 40,
	      tension: 200,
	      tolerance: 1
	    },
	    directionLock: false,
	    directionLockThreshold: {
	      x: 10,
	      y: 10
	    },
	    overdrag: true,
	    overdragScale: 0.5,
	    pixelAlign: true,
	    velocityTimeout: 100,
	    velocityScale: 890
	  },
	  FrictionSimulator: {
	    friction: 2,
	    tolerance: 1 / 10
	  },
	  SpringSimulator: {
	    tension: 500,
	    friction: 10,
	    tolerance: 1 / 10000
	  },
	  MomentumBounceSimulator: {
	    momentum: {
	      friction: 2,
	      tolerance: 10
	    },
	    bounce: {
	      tension: 500,
	      friction: 10,
	      tolerance: 1
	    }
	  }
	};
	
	exports.Defaults = {
	  getDefaults: function(className, options) {
	    var defaults, k, ref, v;
	    if (!Originals.hasOwnProperty(className)) {
	      return {};
	    }
	    if (!Framer.Defaults.hasOwnProperty(className)) {
	      return {};
	    }
	    defaults = _.clone(Originals[className]);
	    ref = Framer.Defaults[className];
	    for (k in ref) {
	      v = ref[k];
	      defaults[k] = _.isFunction(v) ? v() : v;
	    }
	    for (k in defaults) {
	      v = defaults[k];
	      if (!options.hasOwnProperty(k)) {
	        options[k] = v;
	      }
	    }
	    return options;
	  },
	  setup: function() {
	    var className, classValues, k, ref, v;
	    if (window.FramerDefaults) {
	      ref = window.FramerDefaults;
	      for (className in ref) {
	        classValues = ref[className];
	        for (k in classValues) {
	          v = classValues[k];
	          Originals[className][k] = v;
	        }
	      }
	    }
	    return exports.Defaults.reset();
	  },
	  reset: function() {
	    return window.Framer.Defaults = _.clone(Originals);
	  }
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var AnimatorClassBezierPresets, AnimatorClasses, BaseClass, BezierCurveAnimator, Config, Defaults, LinearAnimator, SpringDHOAnimator, SpringRK4Animator, Utils, _, createDebugLayerForPath, evaluateRelativeProperty, isRelativeProperty, numberRE, relativePropertyRE,
	  slice = [].slice,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	_ = __webpack_require__(1)._;
	
	Utils = __webpack_require__(4);
	
	Config = __webpack_require__(14).Config;
	
	Defaults = __webpack_require__(17).Defaults;
	
	BaseClass = __webpack_require__(6).BaseClass;
	
	LinearAnimator = __webpack_require__(19).LinearAnimator;
	
	BezierCurveAnimator = __webpack_require__(21).BezierCurveAnimator;
	
	SpringRK4Animator = __webpack_require__(22).SpringRK4Animator;
	
	SpringDHOAnimator = __webpack_require__(24).SpringDHOAnimator;
	
	AnimatorClasses = {
	  "linear": LinearAnimator,
	  "bezier-curve": BezierCurveAnimator,
	  "spring-rk4": SpringRK4Animator,
	  "spring-dho": SpringDHOAnimator
	};
	
	AnimatorClasses["spring"] = AnimatorClasses["spring-rk4"];
	
	AnimatorClasses["cubic-bezier"] = AnimatorClasses["bezier-curve"];
	
	AnimatorClassBezierPresets = ["ease", "ease-in", "ease-out", "ease-in-out"];
	
	numberRE = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/;
	
	relativePropertyRE = new RegExp('^(?:([+-])=|)(' + numberRE.source + ')([a-z%]*)$', 'i');
	
	isRelativeProperty = function(v) {
	  return _.isString(v) && relativePropertyRE.test(v);
	};
	
	evaluateRelativeProperty = function(target, k, v) {
	  var match, number, ref, rest, sign, unit;
	  ref = relativePropertyRE.exec(v), match = ref[0], sign = ref[1], number = ref[2], unit = ref[3], rest = 5 <= ref.length ? slice.call(ref, 4) : [];
	  if (sign) {
	    return target[k] + (sign + 1) * number;
	  }
	  return +number;
	};
	
	createDebugLayerForPath = function(path) {
	  var bbox, debugElementsGroup, debugLayer, padding, ref, sharedContext, svg;
	  padding = 10;
	  sharedContext = Utils.SVG.getContext();
	  svg = Utils.SVG.createElement('svg', {
	    width: '100%',
	    height: '100%'
	  });
	  debugLayer = new Layer({
	    width: 100,
	    height: 100,
	    backgroundColor: 'transparent'
	  });
	  debugLayer._element.appendChild(svg);
	  debugLayer.path = path;
	  debugElementsGroup = path.elementForDebugRepresentation();
	  sharedContext.appendChild(debugElementsGroup);
	  bbox = debugElementsGroup.getBBox();
	  svg.appendChild(debugElementsGroup);
	  debugLayer.width = bbox.width + Math.abs(bbox.x) + padding * 2;
	  debugLayer.height = bbox.height + Math.abs(bbox.y) + padding * 2;
	  debugLayer.pathOffset = {
	    x: bbox.x - padding,
	    y: bbox.y - padding
	  };
	  debugLayer.animatedPath = (ref = debugElementsGroup.getElementsByClassName('animated-path')) != null ? ref[0] : void 0;
	  debugElementsGroup.setAttribute('transform', "translate(" + (-bbox.x + padding) + ", " + (-bbox.y + padding) + ")");
	  return debugLayer;
	};
	
	exports.Animation = (function(superClass) {
	  extend(Animation, superClass);
	
	  function Animation(options) {
	    var layerOriginX, layerOriginY, layerScreenFrame, path;
	    if (options == null) {
	      options = {};
	    }
	    this._updateValue = bind(this._updateValue, this);
	    this._update = bind(this._update, this);
	    this._start = bind(this._start, this);
	    this.start = bind(this.start, this);
	    options = Defaults.getDefaults("Animation", options);
	    Animation.__super__.constructor.call(this, options);
	    this.options = _.clone(_.defaults(options, {
	      layer: null,
	      properties: {},
	      curve: "linear",
	      curveOptions: {},
	      time: 1,
	      repeat: 0,
	      delay: 0,
	      debug: false,
	      path: null,
	      pathOptions: null,
	      colorModel: "husl"
	    }));
	    if (options.path) {
	      this.options.path = path = options.path.forLayer(options.layer);
	      this.options.properties.x = options.layer.x + path.end.x - path.start.x;
	      this.options.properties.y = options.layer.y + path.end.y - path.start.x;
	      this.pathOptions = _.defaults(options.pathOptions || {}, {
	        autoRotate: true
	      });
	      if (this.options.debug) {
	        this._debugLayer = createDebugLayerForPath(path);
	        layerScreenFrame = this.options.layer.screenFrame;
	        layerOriginX = layerScreenFrame.x + this.options.layer.originX * layerScreenFrame.width;
	        layerOriginY = layerScreenFrame.y + this.options.layer.originY * layerScreenFrame.height;
	        this._debugLayer.x = layerOriginX - path.start.x + this._debugLayer.pathOffset.x;
	        this._debugLayer.y = layerOriginY - path.start.y + this._debugLayer.pathOffset.y;
	      }
	    }
	    if (options.origin) {
	      console.warn("Animation.origin: please use layer.originX and layer.originY");
	    }
	    this.options.properties = Animation.filterAnimatableProperties(this.options.properties);
	    this._parseAnimatorOptions();
	    this._originalState = this._currentState();
	    this._repeatCounter = this.options.repeat;
	  }
	
	  Animation.define("isAnimating", {
	    get: function() {
	      return indexOf.call(this.options.layer.context.animations, this) >= 0;
	    }
	  });
	
	  Animation.prototype.start = function() {
	    var AnimatorClass, animation, k, property, ref, ref1, ref2, v;
	    if (this.options.layer === null) {
	      console.error("Animation: missing layer");
	    }
	    AnimatorClass = this._animatorClass();
	    if (this.options.debug) {
	      console.log("Animation.start " + AnimatorClass.name, this.options.curveOptions);
	    }
	    this._animator = new AnimatorClass(this.options.curveOptions);
	    this._target = this.options.layer;
	    this._stateA = this._currentState();
	    this._stateB = {};
	    ref = this.options.properties;
	    for (k in ref) {
	      v = ref[k];
	      if (_.isFunction(v)) {
	        v = v();
	      } else if (isRelativeProperty(v)) {
	        v = evaluateRelativeProperty(this._target, k, v);
	      }
	      if (this._stateA[k] !== v) {
	        this._stateB[k] = v;
	      }
	    }
	    if (_.keys(this._stateA).length === 0) {
	      console.warn("Animation: nothing to animate, no animatable properties");
	      return false;
	    }
	    if (_.isEqual(this._stateA, this._stateB)) {
	      console.warn("Animation: nothing to animate, all properties are equal to what it is now");
	      return false;
	    }
	    ref1 = this._target.animatingProperties();
	    for (property in ref1) {
	      animation = ref1[property];
	      if (this._stateA.hasOwnProperty(property)) {
	        animation.stop();
	      }
	      if (property === "x" && (this._stateA.hasOwnProperty("minX") || this._stateA.hasOwnProperty("midX") || this._stateA.hasOwnProperty("maxX"))) {
	        animation.stop();
	      }
	      if (property === "y" && (this._stateA.hasOwnProperty("minY") || this._stateA.hasOwnProperty("midY") || this._stateA.hasOwnProperty("maxY"))) {
	        animation.stop();
	      }
	    }
	    if (this.options.debug) {
	      console.log("Animation.start");
	      ref2 = this._stateB;
	      for (k in ref2) {
	        v = ref2[k];
	        console.log("\t" + k + ": " + this._stateA[k] + " -> " + this._stateB[k]);
	      }
	    }
	    if (this._repeatCounter > 0) {
	      this.once("end", (function(_this) {
	        return function() {
	          var ref3;
	          ref3 = _this._stateA;
	          for (k in ref3) {
	            v = ref3[k];
	            _this._target[k] = v;
	          }
	          _this._repeatCounter--;
	          return _this.start();
	        };
	      })(this));
	    }
	    if (this.options.delay) {
	      Utils.delay(this.options.delay, this._start);
	    } else {
	      this._start();
	    }
	    return true;
	  };
	
	  Animation.prototype.stop = function(emit) {
	    var animation;
	    if (emit == null) {
	      emit = true;
	    }
	    this.options.layer.context.removeAnimation(this);
	    if (emit) {
	      this.emit("stop");
	    }
	    Framer.Loop.off("update", this._update);
	    if (this._debugLayer) {
	      animation = this._debugLayer.animate({
	        properties: {
	          opacity: 0
	        },
	        curve: 'linear',
	        time: 0.25
	      });
	      return animation.on('end', function() {
	        return this.options.layer.destroy();
	      });
	    }
	  };
	
	  Animation.prototype.reverse = function() {
	    var animation, options;
	    options = _.clone(this.options);
	    options.properties = this._originalState;
	    animation = new Animation(options);
	    return animation;
	  };
	
	  Animation.prototype.copy = function() {
	    return new Animation(_.clone(this.options));
	  };
	
	  Animation.prototype.revert = function() {
	    return this.reverse();
	  };
	
	  Animation.prototype.inverse = function() {
	    return this.reverse();
	  };
	
	  Animation.prototype.invert = function() {
	    return this.reverse();
	  };
	
	  Animation.prototype.emit = function(event) {
	    Animation.__super__.emit.apply(this, arguments);
	    return this.options.layer.emit(event, this);
	  };
	
	  Animation.prototype.animatingProperties = function() {
	    return _.keys(this._stateA);
	  };
	
	  Animation.prototype._start = function() {
	    this.options.layer.context.addAnimation(this);
	    this.emit("start");
	    return Framer.Loop.on("update", this._update);
	  };
	
	  Animation.prototype._update = function(delta) {
	    var emit;
	    if (this._animator.finished()) {
	      this._updateValue(1);
	      this.stop(emit = false);
	      this.emit("end");
	      return this.emit("stop");
	    } else {
	      return this._updateValue(this._animator.next(delta));
	    }
	  };
	
	  Animation.prototype._updateValue = function(value) {
	    var angle, k, position, ref, v;
	    ref = this._stateB;
	    for (k in ref) {
	      v = ref[k];
	      if ((this.options.path && (k !== 'x' && k !== 'y')) || !this.options.path) {
	        if (Color.isColorObject(v) || Color.isColorObject(this._stateA[k])) {
	          this._target[k] = Color.mix(this._stateA[k], this._stateB[k], value, false, this.options.colorModel);
	        } else {
	          this._target[k] = Utils.mapRange(value, 0, 1, this._stateA[k], this._stateB[k]);
	        }
	      }
	    }
	    if (this.options.path) {
	      position = this.options.path.pointAtLength(this.options.path.length * value);
	      position.x += this._stateA.x - this.options.path.start.x;
	      position.y += this._stateA.y - this.options.path.start.y;
	      if (this._debugLayer) {
	        this._debugLayer.animatedPath.setAttribute('stroke-dashoffset', this.options.path.length * (1 - value));
	      }
	      if (this.pathOptions.autoRotate) {
	        angle = Math.atan2(position.y - this._target.y, position.x - this._target.x) * 180 / Math.PI;
	        if (position.y !== this._target.y && position.x !== this._target.x) {
	          this._target.rotationZ = angle;
	        }
	      }
	      this._target.x = position.x;
	      this._target.y = position.y;
	    }
	  };
	
	  Animation.prototype._currentState = function() {
	    return _.pick(this.options.layer, _.keys(this.options.properties));
	  };
	
	  Animation.prototype._animatorClass = function() {
	    var animatorClassName, parsedCurve;
	    parsedCurve = Utils.parseFunction(this.options.curve);
	    animatorClassName = parsedCurve.name.toLowerCase();
	    if (AnimatorClasses.hasOwnProperty(animatorClassName)) {
	      return AnimatorClasses[animatorClassName];
	    }
	    if (indexOf.call(AnimatorClassBezierPresets, animatorClassName) >= 0) {
	      return BezierCurveAnimator;
	    }
	    return LinearAnimator;
	  };
	
	  Animation.prototype._parseAnimatorOptions = function() {
	    var animatorClass, animatorClassName, base, base1, i, j, k, l, len, len1, parsedCurve, ref, ref1, results, value;
	    animatorClass = this._animatorClass();
	    parsedCurve = Utils.parseFunction(this.options.curve);
	    animatorClassName = parsedCurve.name.toLowerCase();
	    if (animatorClass === LinearAnimator || animatorClass === BezierCurveAnimator) {
	      if (_.isString(this.options.curveOptions) || _.isArray(this.options.curveOptions)) {
	        this.options.curveOptions = {
	          values: this.options.curveOptions
	        };
	      }
	      if ((base = this.options.curveOptions).time == null) {
	        base.time = this.options.time;
	      }
	    }
	    if ((animatorClass === BezierCurveAnimator) && indexOf.call(AnimatorClassBezierPresets, animatorClassName) >= 0) {
	      this.options.curveOptions.values = animatorClassName;
	      if ((base1 = this.options.curveOptions).time == null) {
	        base1.time = this.options.time;
	      }
	    }
	    if (parsedCurve.args.length) {
	      if (animatorClass === BezierCurveAnimator) {
	        this.options.curveOptions.values = parsedCurve.args.map(function(v) {
	          return parseFloat(v) || 0;
	        });
	      }
	      if (animatorClass === SpringRK4Animator) {
	        ref = ["tension", "friction", "velocity", "tolerance"];
	        for (i = j = 0, len = ref.length; j < len; i = ++j) {
	          k = ref[i];
	          value = parseFloat(parsedCurve.args[i]);
	          if (value) {
	            this.options.curveOptions[k] = value;
	          }
	        }
	      }
	      if (animatorClass === SpringDHOAnimator) {
	        ref1 = ["stiffness", "damping", "mass", "tolerance"];
	        results = [];
	        for (i = l = 0, len1 = ref1.length; l < len1; i = ++l) {
	          k = ref1[i];
	          value = parseFloat(parsedCurve.args[i]);
	          if (value) {
	            results.push(this.options.curveOptions[k] = value);
	          } else {
	            results.push(void 0);
	          }
	        }
	        return results;
	      }
	    }
	  };
	
	  Animation.filterAnimatableProperties = function(properties) {
	    var animatableProperties, k, v;
	    animatableProperties = {};
	    for (k in properties) {
	      v = properties[k];
	      if (_.isNumber(v) || _.isFunction(v) || isRelativeProperty(v) || Color.isColorObject(v) || v === null) {
	        animatableProperties[k] = v;
	      } else if (_.isString(v)) {
	        if (Color.isColorString(v)) {
	          animatableProperties[k] = new Color(v);
	        }
	      }
	    }
	    return animatableProperties;
	  };
	
	  Animation.prototype.toInspect = function() {
	    return "<" + this.constructor.name + " id:" + this.id + " isAnimating:" + this.isAnimating + " [" + (_.keys(this.options.properties)) + "]>";
	  };
	
	  Animation.prototype.onAnimationStart = function(cb) {
	    return this.on(Events.AnimationStart, cb);
	  };
	
	  Animation.prototype.onAnimationStop = function(cb) {
	    return this.on(Events.AnimationStop, cb);
	  };
	
	  Animation.prototype.onAnimationEnd = function(cb) {
	    return this.on(Events.AnimationEnd, cb);
	  };
	
	  Animation.prototype.onAnimationDidStart = function(cb) {
	    return this.on(Events.AnimationDidStart, cb);
	  };
	
	  Animation.prototype.onAnimationDidStop = function(cb) {
	    return this.on(Events.AnimationDidStop, cb);
	  };
	
	  Animation.prototype.onAnimationDidEnd = function(cb) {
	    return this.on(Events.AnimationDidEnd, cb);
	  };
	
	  return Animation;
	
	})(BaseClass);


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var Animator, Utils,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(4);
	
	Animator = __webpack_require__(20).Animator;
	
	exports.LinearAnimator = (function(superClass) {
	  extend(LinearAnimator, superClass);
	
	  function LinearAnimator() {
	    return LinearAnimator.__super__.constructor.apply(this, arguments);
	  }
	
	  LinearAnimator.prototype.setup = function(options) {
	    this.options = _.defaults(options, {
	      time: 1,
	      precision: 1 / 1000
	    });
	    return this._time = 0;
	  };
	
	  LinearAnimator.prototype.next = function(delta) {
	    this._time += delta;
	    if (this.finished()) {
	      return 1;
	    }
	    return this._time / this.options.time;
	  };
	
	  LinearAnimator.prototype.finished = function() {
	    return this._time >= this.options.time - this.options.precision;
	  };
	
	  return LinearAnimator;
	
	})(Animator);


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var Config, Utils;
	
	Utils = __webpack_require__(4);
	
	Config = __webpack_require__(14).Config;
	
	exports.Animator = (function() {
	  "The animator class is a very simple class that\n	- Takes a set of input values at setup({input values})\n	- Emits an output value for progress (0 -> 1) in value(progress)";
	  function Animator(options) {
	    if (options == null) {
	      options = {};
	    }
	    this.setup(options);
	  }
	
	  Animator.prototype.setup = function(options) {
	    throw Error("Not implemented");
	  };
	
	  Animator.prototype.next = function(delta) {
	    throw Error("Not implemented");
	  };
	
	  Animator.prototype.finished = function() {
	    throw Error("Not implemented");
	  };
	
	  return Animator;

	})();


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var Animator, BezierCurveDefaults, UnitBezier, Utils, _,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(1)._;
	
	Utils = __webpack_require__(4);
	
	Animator = __webpack_require__(20).Animator;
	
	BezierCurveDefaults = {
	  "linear": [0, 0, 1, 1],
	  "ease": [.25, .1, .25, 1],
	  "ease-in": [.42, 0, 1, 1],
	  "ease-out": [0, 0, .58, 1],
	  "ease-in-out": [.42, 0, .58, 1],
	  "ease-in-quad": [0.26, 0, 0.6, 0.2],
	  "ease-out-quad": [0.4, 0.8, 0.74, 1],
	  "ease-in-out-quad": [0.48, 0.04, 0.52, 0.96],
	  "ease-in-cubic": [0.32, 0, 0.66, -0.02],
	  "ease-out-cubic": [0.34, 1.02, 0.68, 1],
	  "ease-in-out-cubic": [0.62, -0.04, 0.38, 1.04],
	  "ease-in-quart": [0.46, 0, 0.74, -0.04],
	  "ease-out-quart": [0.26, 1.04, 0.54, 1],
	  "ease-in-out-quart": [0.7, -0.1, 0.3, 1.1],
	  "ease-in-quint": [0.52, 0, 0.78, -0.1],
	  "ease-out-quint": [0.22, 1.1, 0.48, 1],
	  "ease-in-out-quint": [0.76, -0.14, 0.24, 1.14],
	  "ease-in-sine": [0.32, 0, 0.6, 0.36],
	  "ease-out-sine": [0.4, 0.64, 0.68, 1],
	  "ease-in-out-sine": [0.36, 0, 0.64, 1],
	  "ease-in-expo": [0.62, 0.02, 0.84, -0.08],
	  "ease-out-expo": [0.16, 1.08, 0.38, 0.98],
	  "ease-in-out-expo": [0.84, -0.12, 0.16, 1.12],
	  "ease-in-circ": [0.54, 0, 1, 0.44],
	  "ease-out-circ": [0, 0.56, 0.46, 1],
	  "ease-in-out-circ": [0.88, 0.14, 0.12, 0.86]
	};
	
	exports.BezierCurveAnimator = (function(superClass) {
	  extend(BezierCurveAnimator, superClass);
	
	  function BezierCurveAnimator() {
	    return BezierCurveAnimator.__super__.constructor.apply(this, arguments);
	  }
	
	  BezierCurveAnimator.prototype.setup = function(options) {
	    if (_.isString(options) && BezierCurveDefaults.hasOwnProperty(options.toLowerCase())) {
	      options = {
	        values: BezierCurveDefaults[options.toLowerCase()]
	      };
	    }
	    if (options.values && _.isString(options.values) && BezierCurveDefaults.hasOwnProperty(options.values.toLowerCase())) {
	      options = {
	        values: BezierCurveDefaults[options.values.toLowerCase()],
	        time: options.time
	      };
	    }
	    if (_.isArray(options) && options.length === 4) {
	      options = {
	        values: options
	      };
	    }
	    this.options = _.defaults(options, {
	      values: BezierCurveDefaults["ease-in-out"],
	      time: 1,
	      precision: 1 / 1000
	    });
	    return this._unitBezier = new UnitBezier(this.options.values[0], this.options.values[1], this.options.values[2], this.options.values[3], this._time = 0);
	  };
	
	  BezierCurveAnimator.prototype.next = function(delta) {
	    this._time += delta;
	    if (this.finished()) {
	      return 1;
	    }
	    return this._unitBezier.solve(this._time / this.options.time);
	  };
	
	  BezierCurveAnimator.prototype.finished = function() {
	    return this._time >= this.options.time - this.options.precision;
	  };
	
	  return BezierCurveAnimator;
	
	})(Animator);
	
	UnitBezier = (function() {
	  UnitBezier.prototype.epsilon = 1e-6;
	
	  function UnitBezier(p1x, p1y, p2x, p2y) {
	    this.cx = 3.0 * p1x;
	    this.bx = 3.0 * (p2x - p1x) - this.cx;
	    this.ax = 1.0 - this.cx - this.bx;
	    this.cy = 3.0 * p1y;
	    this.by = 3.0 * (p2y - p1y) - this.cy;
	    this.ay = 1.0 - this.cy - this.by;
	  }
	
	  UnitBezier.prototype.sampleCurveX = function(t) {
	    return ((this.ax * t + this.bx) * t + this.cx) * t;
	  };
	
	  UnitBezier.prototype.sampleCurveY = function(t) {
	    return ((this.ay * t + this.by) * t + this.cy) * t;
	  };
	
	  UnitBezier.prototype.sampleCurveDerivativeX = function(t) {
	    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
	  };
	
	  UnitBezier.prototype.solveCurveX = function(x) {
	    var d2, i, t0, t1, t2, x2;
	    t2 = x;
	    i = 0;
	    while (i < 8) {
	      x2 = this.sampleCurveX(t2) - x;
	      if (Math.abs(x2) < this.epsilon) {
	        return t2;
	      }
	      d2 = this.sampleCurveDerivativeX(t2);
	      if (Math.abs(d2) < this.epsilon) {
	        break;
	      }
	      t2 = t2 - x2 / d2;
	      i++;
	    }
	    t0 = 0.0;
	    t1 = 1.0;
	    t2 = x;
	    if (t2 < t0) {
	      return t0;
	    }
	    if (t2 > t1) {
	      return t1;
	    }
	    while (t0 < t1) {
	      x2 = this.sampleCurveX(t2);
	      if (Math.abs(x2 - x) < this.epsilon) {
	        return t2;
	      }
	      if (x > x2) {
	        t0 = t2;
	      } else {
	        t1 = t2;
	      }
	      t2 = (t1 - t0) * .5 + t0;
	    }
	    return t2;
	  };
	
	  UnitBezier.prototype.solve = function(x) {
	    return this.sampleCurveY(this.solveCurveX(x));
	  };
	
	  return UnitBezier;

	})();


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var Animator, Integrator, Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(4);
	
	Animator = __webpack_require__(20).Animator;
	
	Integrator = __webpack_require__(23).Integrator;
	
	exports.SpringRK4Animator = (function(superClass) {
	  extend(SpringRK4Animator, superClass);
	
	  function SpringRK4Animator() {
	    this.finished = bind(this.finished, this);
	    return SpringRK4Animator.__super__.constructor.apply(this, arguments);
	  }
	
	  SpringRK4Animator.prototype.setup = function(options) {
	    this.options = _.defaults(options, {
	      tension: 500,
	      friction: 10,
	      velocity: 0,
	      tolerance: 1 / 10000,
	      time: null
	    });
	    this._time = 0;
	    this._value = 0;
	    this._velocity = this.options.velocity;
	    this._stopSpring = false;
	    return this._integrator = new Integrator((function(_this) {
	      return function(state) {
	        return -_this.options.tension * state.x - _this.options.friction * state.v;
	      };
	    })(this));
	  };
	
	  SpringRK4Animator.prototype.next = function(delta) {
	    var finalVelocity, net1DVelocity, netFloat, netValueIsLow, netVelocityIsLow, stateAfter, stateBefore;
	    if (this.finished()) {
	      return 1;
	    }
	    this._time += delta;
	    stateBefore = {};
	    stateAfter = {};
	    stateBefore.x = this._value - 1;
	    stateBefore.v = this._velocity;
	    stateAfter = this._integrator.integrateState(stateBefore, delta);
	    this._value = 1 + stateAfter.x;
	    finalVelocity = stateAfter.v;
	    netFloat = stateAfter.x;
	    net1DVelocity = stateAfter.v;
	    netValueIsLow = Math.abs(netFloat) < this.options.tolerance;
	    netVelocityIsLow = Math.abs(net1DVelocity) < this.options.tolerance;
	    this._stopSpring = netValueIsLow && netVelocityIsLow;
	    this._velocity = finalVelocity;
	    return this._value;
	  };
	
	  SpringRK4Animator.prototype.finished = function() {
	    return this._stopSpring;
	  };
	
	  return SpringRK4Animator;
	
	})(Animator);


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var Config, Utils;
	
	Utils = __webpack_require__(4);
	
	Config = __webpack_require__(14).Config;
	
	exports.Integrator = (function() {
	  "Usage:\n	- Instantiate with a function that takes (state) -> acceleration\n	- Call integrateState with state={x, v} and delta";
	  function Integrator(_accelerationForState) {
	    this._accelerationForState = _accelerationForState;
	    if (!_.isFunction(this._accelerationForState)) {
	      console.warn("Integrator: an integrator must be constructed with an acceleration function");
	      this._accelerationForState = function() {
	        return 0;
	      };
	    }
	  }
	
	  Integrator.prototype.integrateState = function(state, dt) {
	    var a, b, c, d, dvdt, dxdt;
	    a = this._evaluateState(state);
	    b = this._evaluateStateWithDerivative(state, dt * 0.5, a);
	    c = this._evaluateStateWithDerivative(state, dt * 0.5, b);
	    d = this._evaluateStateWithDerivative(state, dt, c);
	    dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx);
	    dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);
	    state.x = state.x + dxdt * dt;
	    state.v = state.v + dvdt * dt;
	    return state;
	  };
	
	  Integrator.prototype._evaluateState = function(initialState) {
	    var output;
	    output = {};
	    output.dx = initialState.v;
	    output.dv = this._accelerationForState(initialState);
	    return output;
	  };
	
	  Integrator.prototype._evaluateStateWithDerivative = function(initialState, dt, derivative) {
	    var output, state;
	    state = {};
	    state.x = initialState.x + derivative.dx * dt;
	    state.v = initialState.v + derivative.dv * dt;
	    output = {};
	    output.dx = state.v;
	    output.dv = this._accelerationForState(state);
	    return output;
	  };
	
	  return Integrator;

	})();


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var Animator, Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(4);
	
	Animator = __webpack_require__(20).Animator;
	
	exports.SpringDHOAnimator = (function(superClass) {
	  extend(SpringDHOAnimator, superClass);
	
	  function SpringDHOAnimator() {
	    this.finished = bind(this.finished, this);
	    return SpringDHOAnimator.__super__.constructor.apply(this, arguments);
	  }
	
	  SpringDHOAnimator.prototype.setup = function(options) {
	    this.options = _.defaults(options, {
	      velocity: 0,
	      tolerance: 1 / 10000,
	      stiffness: 50,
	      damping: 2,
	      mass: 0.2,
	      time: null
	    });
	    console.log("SpringDHOAnimator.options", this.options, options);
	    this._time = 0;
	    this._value = 0;
	    return this._velocity = this.options.velocity;
	  };
	
	  SpringDHOAnimator.prototype.next = function(delta) {
	    var F_damper, F_spring, b, k;
	    if (this.finished()) {
	      return 1;
	    }
	    this._time += delta;
	    k = 0 - this.options.stiffness;
	    b = 0 - this.options.damping;
	    F_spring = k * (this._value - 1);
	    F_damper = b * this._velocity;
	    this._velocity += ((F_spring + F_damper) / this.options.mass) * delta;
	    this._value += this._velocity * delta;
	    return this._value;
	  };
	
	  SpringDHOAnimator.prototype.finished = function() {
	    return this._time > 0 && Math.abs(this._velocity) < this.options.tolerance;
	  };
	
	  return SpringDHOAnimator;
	
	})(Animator);


/***/ },
/* 25 */
/***/ function(module, exports) {

	var _Force2DProperties, _WebkitProperties, filterFormat;
	
	filterFormat = function(value, unit) {
	  return "" + (Utils.round(value, 2)) + unit;
	};
	
	_WebkitProperties = [["blur", "blur", 0, "px"], ["brightness", "brightness", 100, "%"], ["saturate", "saturate", 100, "%"], ["hue-rotate", "hueRotate", 0, "deg"], ["contrast", "contrast", 100, "%"], ["invert", "invert", 0, "%"], ["grayscale", "grayscale", 0, "%"], ["sepia", "sepia", 0, "%"]];
	
	_Force2DProperties = {
	  "z": 0,
	  "scaleX": 1,
	  "scaleY": 1,
	  "scaleZ": 1,
	  "skewX": 0,
	  "skewY": 0,
	  "rotationX": 0,
	  "rotationY": 0
	};
	
	exports.LayerStyle = {
	  width: function(layer) {
	    return layer._properties.width + "px";
	  },
	  height: function(layer) {
	    return layer._properties.height + "px";
	  },
	  display: function(layer) {
	    if (layer._properties.visible === true) {
	      return "block";
	    }
	    return "none";
	  },
	  opacity: function(layer) {
	    return layer._properties.opacity;
	  },
	  webkitTransformStyle: function(layer) {
	    if (layer._properties.flat) {
	      return "flat";
	    } else {
	      return "preserve-3d";
	    }
	  },
	  webkitBackfaceVisibility: function(layer) {
	    if (layer._properties.backfaceVisible) {
	      return "visible";
	    } else {
	      return "hidden";
	    }
	  },
	  overflow: function(layer) {
	    if (layer._properties.scrollHorizontal === true || layer._properties.scrollVertical === true) {
	      return "auto";
	    }
	    if (layer._properties.clip === true) {
	      return "hidden";
	    }
	    return "visible";
	  },
	  overflowX: function(layer) {
	    if (layer._properties.scrollHorizontal === true) {
	      return "scroll";
	    }
	    if (layer._properties.clip === true) {
	      return "hidden";
	    }
	    return "visible";
	  },
	  overflowY: function(layer) {
	    if (layer._properties.scrollVertical === true) {
	      return "scroll";
	    }
	    if (layer._properties.clip === true) {
	      return "hidden";
	    }
	    return "visible";
	  },
	  zIndex: function(layer) {
	    return layer._properties.index;
	  },
	  webkitFilter: function(layer) {
	    var css, cssName, fallback, i, layerName, len, ref, unit;
	    css = [];
	    for (i = 0, len = _WebkitProperties.length; i < len; i++) {
	      ref = _WebkitProperties[i], cssName = ref[0], layerName = ref[1], fallback = ref[2], unit = ref[3];
	      if (layer._properties.hasOwnProperty(layerName) && layer[layerName] !== fallback) {
	        css.push(cssName + "(" + (filterFormat(layer[layerName], unit)) + ")");
	      }
	    }
	    return css.join(" ");
	  },
	  webkitTransform: function(layer) {
	    if (layer._prefer2d || layer._properties.force2d) {
	      return exports.LayerStyle.webkitTransformForce2d(layer);
	    }
	    return "translate3d( " + layer._properties.x + "px, " + layer._properties.y + "px, " + layer._properties.z + "px) scale3d( " + (layer._properties.scaleX * layer._properties.scale) + ", " + (layer._properties.scaleY * layer._properties.scale) + ", " + layer._properties.scaleZ + ") skew(" + layer._properties.skew + "deg," + layer._properties.skew + "deg) skewX(" + layer._properties.skewX + "deg) skewY(" + layer._properties.skewY + "deg) translateZ(" + layer._properties.originZ + "px) rotateX(" + layer._properties.rotationX + "deg) rotateY(" + layer._properties.rotationY + "deg) rotateZ(" + layer._properties.rotationZ + "deg) translateZ(" + (-layer._properties.originZ) + "px)";
	  },
	  webkitTransformForce2d: function(layer) {
	    var css, p, v;
	    css = [];
	    for (p in _Force2DProperties) {
	      v = _Force2DProperties[p];
	      if (layer._properties[p] !== v) {
	        console.warn("Layer property '" + p + "'' will be ignored with force2d enabled");
	      }
	    }
	    css.push("translate(" + layer._properties.x + "px," + layer._properties.y + "px)");
	    css.push("scale(" + layer._properties.scale + ")");
	    css.push("skew(" + layer._properties.skew + "deg," + layer._properties.skew + "deg)");
	    css.push("rotate(" + layer._properties.rotationZ + "deg)");
	    return css.join(" ");
	  },
	  webkitTransformOrigin: function(layer) {
	    return (layer._properties.originX * 100) + "% " + (layer._properties.originY * 100) + "%";
	  },
	  webkitPerspective: function(layer) {
	    return "" + layer._properties.perspective;
	  },
	  webkitPerspectiveOrigin: function(layer) {
	    return (layer._properties.perspectiveOriginX * 100) + "% " + (layer._properties.perspectiveOriginY * 100) + "%";
	  },
	  pointerEvents: function(layer) {
	    if (layer._properties.ignoreEvents) {
	      return "none";
	    } else {
	      return "auto";
	    }
	  },
	  boxShadow: function(layer) {
	    var props;
	    props = layer._properties;
	    if (!props.shadowColor) {
	      return "";
	    } else if (props.shadowX === 0 && props.shadowY === 0 && props.shadowBlur === 0 && props.shadowSpread === 0) {
	      return "";
	    }
	    return layer._properties.shadowX + "px " + layer._properties.shadowY + "px " + layer._properties.shadowBlur + "px " + layer._properties.shadowSpread + "px " + layer._properties.shadowColor;
	  },
	  backgroundColor: function(layer) {
	    return layer._properties.backgroundColor;
	  },
	  color: function(layer) {
	    return layer._properties.color;
	  },
	  borderRadius: function(layer) {
	    if (!_.isNumber(layer._properties.borderRadius)) {
	      return layer._properties.borderRadius;
	    }
	    return layer._properties.borderRadius + "px";
	  },
	  border: function(layer) {
	    return layer._properties.borderWidth + "px solid " + layer._properties.borderColor;
	  }
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, Defaults, Events, LayerStatesIgnoredKeys, _,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	  slice = [].slice;
	
	_ = __webpack_require__(1)._;
	
	Events = __webpack_require__(15).Events;
	
	BaseClass = __webpack_require__(6).BaseClass;
	
	Defaults = __webpack_require__(17).Defaults;
	
	LayerStatesIgnoredKeys = ["ignoreEvents"];
	
	Events.StateWillSwitch = "willSwitch";
	
	Events.StateDidSwitch = "didSwitch";
	
	exports.LayerStates = (function(superClass) {
	  extend(LayerStates, superClass);
	
	  function LayerStates(layer) {
	    this.layer = layer;
	    this._states = {};
	    this._orderedStates = [];
	    this.animationOptions = {};
	    this.add("default", this.layer.props);
	    this._currentState = "default";
	    this._previousStates = [];
	    LayerStates.__super__.constructor.apply(this, arguments);
	  }
	
	  LayerStates.prototype.add = function(stateName, properties) {
	    var error, k, v;
	    if (_.isObject(stateName)) {
	      for (k in stateName) {
	        v = stateName[k];
	        this.add(k, v);
	      }
	      return;
	    }
	    error = function() {
	      throw Error("Usage example: layer.states.add(\"someName\", {x:500})");
	    };
	    if (!_.isString(stateName)) {
	      error();
	    }
	    if (!_.isObject(properties)) {
	      error();
	    }
	    this._orderedStates.push(stateName);
	    return this._states[stateName] = LayerStates.filterStateProperties(properties);
	  };
	
	  LayerStates.prototype.remove = function(stateName) {
	    if (!this._states.hasOwnProperty(stateName)) {
	      return;
	    }
	    delete this._states[stateName];
	    return this._orderedStates = _.without(this._orderedStates, stateName);
	  };
	
	  LayerStates.prototype["switch"] = function(stateName, animationOptions, instant) {
	    var animatablePropertyKeys, animatingKeys, k, properties, propertyName, ref, ref1, v, value;
	    if (instant == null) {
	      instant = false;
	    }
	    if (!this._states.hasOwnProperty(stateName)) {
	      throw Error("No such state: '" + stateName + "'");
	    }
	    this.emit(Events.StateWillSwitch, this._currentState, stateName, this);
	    this._previousStates.push(this._currentState);
	    this._currentState = stateName;
	    properties = {};
	    animatingKeys = this.animatingKeys();
	    ref = this._states[stateName];
	    for (propertyName in ref) {
	      value = ref[propertyName];
	      if (indexOf.call(LayerStatesIgnoredKeys, propertyName) >= 0) {
	        continue;
	      }
	      if (indexOf.call(animatingKeys, propertyName) < 0) {
	        continue;
	      }
	      if (_.isFunction(value)) {
	        value = value.call(this.layer, this.layer, stateName);
	      }
	      properties[propertyName] = value;
	    }
	    animatablePropertyKeys = [];
	    for (k in properties) {
	      v = properties[k];
	      if (_.isNumber(v)) {
	        animatablePropertyKeys.push(k);
	      } else if (Color.isColorObject(v)) {
	        animatablePropertyKeys.push(k);
	      } else if (v === null) {
	        animatablePropertyKeys.push(k);
	      }
	    }
	    if (animatablePropertyKeys.length === 0) {
	      instant = true;
	    }
	    if (instant === true) {
	      this.layer.props = properties;
	      return this.emit(Events.StateDidSwitch, _.last(this._previousStates), this._currentState, this);
	    } else {
	      if (animationOptions == null) {
	        animationOptions = this.animationOptions;
	      }
	      animationOptions.properties = properties;
	      if ((ref1 = this._animation) != null) {
	        ref1.stop();
	      }
	      this._animation = this.layer.animate(animationOptions);
	      return this._animation.once("stop", (function(_this) {
	        return function() {
	          for (k in properties) {
	            v = properties[k];
	            if (!(_.isNumber(v) || Color.isColorObject(v))) {
	              _this.layer[k] = v;
	            }
	          }
	          if (_.last(_this._previousStates) !== stateName) {
	            return _this.emit(Events.StateDidSwitch, _.last(_this._previousStates), _this._currentState, _this);
	          }
	        };
	      })(this));
	    }
	  };
	
	  LayerStates.prototype.switchInstant = function(stateName) {
	    return this["switch"](stateName, null, true);
	  };
	
	  LayerStates.define("state", {
	    get: function() {
	      return this._currentState;
	    }
	  });
	
	  LayerStates.define("current", {
	    get: function() {
	      return this._currentState;
	    }
	  });
	
	  LayerStates.define("all", {
	    get: function() {
	      return _.clone(this._orderedStates);
	    }
	  });
	
	  LayerStates.prototype.states = function() {
	    return _.clone(this._orderedStates);
	  };
	
	  LayerStates.prototype.animatingKeys = function() {
	    var keys, ref, state, stateName;
	    keys = [];
	    ref = this._states;
	    for (stateName in ref) {
	      state = ref[stateName];
	      keys = _.union(keys, _.keys(state));
	    }
	    return keys;
	  };
	
	  LayerStates.prototype.previous = function(states, animationOptions) {
	    if (states == null) {
	      states = this.states();
	    }
	    return this["switch"](Utils.arrayPrev(states, this._currentState), animationOptions);
	  };
	
	  LayerStates.prototype.next = function() {
	    var states;
	    states = Utils.arrayFromArguments(arguments);
	    if (!states.length) {
	      states = this.states();
	    }
	    return this["switch"](Utils.arrayNext(states, this._currentState));
	  };
	
	  LayerStates.prototype.last = function(animationOptions) {
	    return this["switch"](_.last(this._previousStates), animationOptions);
	  };
	
	  LayerStates.prototype.emit = function() {
	    var args, ref;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    LayerStates.__super__.emit.apply(this, arguments);
	    return (ref = this.layer).emit.apply(ref, args);
	  };
	
	  LayerStates.filterStateProperties = function(properties) {
	    var k, stateProperties, v;
	    stateProperties = {};
	    for (k in properties) {
	      v = properties[k];
	      if (_.isString(v) && Color.isColorString(v)) {
	        stateProperties[k] = new Color(v);
	      } else if (_.isNumber(v) || _.isFunction(v) || _.isBoolean(v) || _.isString(v) || Color.isColorObject(v) || v === null) {
	        stateProperties[k] = v;
	      }
	    }
	    return stateProperties;
	  };
	
	  return LayerStates;
	
	})(BaseClass);


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, Defaults, EventBuffer, Events, Gestures, Simulation, Utils, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(1)._;
	
	Utils = __webpack_require__(4);
	
	BaseClass = __webpack_require__(6).BaseClass;
	
	Events = __webpack_require__(15).Events;
	
	Simulation = __webpack_require__(28).Simulation;
	
	Defaults = __webpack_require__(17).Defaults;
	
	EventBuffer = __webpack_require__(33).EventBuffer;
	
	Gestures = __webpack_require__(16).Gestures;
	
	Events.Move = "move";
	
	Events.DragStart = "dragstart";
	
	Events.DragWillMove = "dragwillmove";
	
	Events.DragMove = "dragmove";
	
	Events.DragDidMove = "dragmove";
	
	Events.Drag = "dragmove";
	
	Events.DragEnd = "dragend";
	
	Events.DragAnimationStart = "draganimationstart";
	
	Events.DragAnimationEnd = "draganimationend";
	
	Events.DirectionLockStart = "directionlockstart";
	
	Events.DragAnimationDidStart = Events.DragAnimationStart;
	
	Events.DragAnimationDidEnd = Events.DragAnimationEnd;
	
	Events.DirectionLockDidStart = Events.DirectionLockStart;
	
	"\n┌──────┐                   │\n│      │\n│      │  ───────────────▶ │ ◀────▶\n│      │\n└──────┘                   │\n\n════════  ═════════════════ ═══════\n\n  Drag         Momentum      Bounce\n";
	
	exports.LayerDraggable = (function(superClass) {
	  extend(LayerDraggable, superClass);
	
	  LayerDraggable.define("speedX", LayerDraggable.simpleProperty("speedX", 1));
	
	  LayerDraggable.define("speedY", LayerDraggable.simpleProperty("speedY", 1));
	
	  LayerDraggable.define("horizontal", LayerDraggable.simpleProperty("horizontal", true));
	
	  LayerDraggable.define("vertical", LayerDraggable.simpleProperty("vertical", true));
	
	  LayerDraggable.define("momentumVelocityMultiplier", LayerDraggable.simpleProperty("momentumVelocityMultiplier", 800));
	
	  LayerDraggable.define("directionLock", LayerDraggable.simpleProperty("directionLock", true));
	
	  LayerDraggable.define("directionLockThreshold", LayerDraggable.simpleProperty("directionLockThreshold", {
	    x: 10,
	    y: 10
	  }));
	
	  LayerDraggable.define("propagateEvents", LayerDraggable.simpleProperty("propagateEvents", true));
	
	  LayerDraggable.define("constraints", {
	    get: function() {
	      return this._constraints;
	    },
	    set: function(value) {
	      if (value && _.isObject(value)) {
	        value = _.pick(value, ["x", "y", "width", "height"]);
	        value = _.defaults(value, {
	          x: 0,
	          y: 0,
	          width: 0,
	          height: 0
	        });
	        this._constraints = value;
	      } else {
	        this._constraints = {
	          x: 0,
	          y: 0,
	          width: 0,
	          height: 0
	        };
	      }
	      if (this._constraints) {
	        return this._updateSimulationConstraints(this._constraints);
	      }
	    }
	  });
	
	  LayerDraggable.define("isDragging", {
	    get: function() {
	      return this._isDragging || false;
	    }
	  });
	
	  LayerDraggable.define("isAnimating", {
	    get: function() {
	      return this._isAnimating || false;
	    }
	  });
	
	  LayerDraggable.define("isMoving", {
	    get: function() {
	      return this._isMoving || false;
	    }
	  });
	
	  LayerDraggable.define("layerStartPoint", {
	    get: function() {
	      return this._layerStartPoint || this.layer.point;
	    }
	  });
	
	  LayerDraggable.define("cursorStartPoint", {
	    get: function() {
	      return this._cursorStartPoint || {
	        x: 0,
	        y: 0
	      };
	    }
	  });
	
	  LayerDraggable.define("layerCursorOffset", {
	    get: function() {
	      return this._layerCursorOffset || {
	        x: 0,
	        y: 0
	      };
	    }
	  });
	
	  LayerDraggable.define("offset", {
	    get: function() {
	      var offset;
	      if (!this._correctedLayerStartPoint) {
	        return {
	          x: 0,
	          y: 0
	        };
	      }
	      return offset = {
	        x: this.layer.x - this._correctedLayerStartPoint.x,
	        y: this.layer.y - this._correctedLayerStartPoint.y
	      };
	    }
	  });
	
	  function LayerDraggable(layer) {
	    var options;
	    this.layer = layer;
	    this._stopSimulation = bind(this._stopSimulation, this);
	    this._onSimulationStop = bind(this._onSimulationStop, this);
	    this._onSimulationStep = bind(this._onSimulationStep, this);
	    this._touchEnd = bind(this._touchEnd, this);
	    this._touchMove = bind(this._touchMove, this);
	    this._touchStart = bind(this._touchStart, this);
	    this._updateLayerPosition = bind(this._updateLayerPosition, this);
	    this.touchStart = bind(this.touchStart, this);
	    options = Defaults.getDefaults("LayerDraggable", {});
	    LayerDraggable.__super__.constructor.call(this, options);
	    _.extend(this, options);
	    this.enabled = true;
	    this._eventBuffer = new EventBuffer;
	    this._constraints = null;
	    this._ignoreUpdateLayerPosition = true;
	    this.attach();
	  }
	
	  LayerDraggable.prototype.attach = function() {
	    this.layer.on(Gestures.TapStart, this.touchStart);
	    this.layer.on(Gestures.Pan, this._touchMove);
	    this.layer.on(Gestures.TapEnd, this._touchEnd);
	    this.layer.on("change:x", this._updateLayerPosition);
	    return this.layer.on("change:y", this._updateLayerPosition);
	  };
	
	  LayerDraggable.prototype.remove = function() {
	    this.layer.off(Gestures.PanStart, this.touchStart);
	    this.layer.off(Gestures.Pan, this._touchMove);
	    return this.layer.off(Gestures.PanEnd, this._touchEnd);
	  };
	
	  LayerDraggable.prototype.updatePosition = function(point) {
	    return point;
	  };
	
	  LayerDraggable.prototype.touchStart = function(event) {
	    return this._touchStart(event);
	  };
	
	  LayerDraggable.prototype._updateLayerPosition = function() {
	    if (this._ignoreUpdateLayerPosition === true) {
	      return;
	    }
	    return this._point = this.layer.point;
	  };
	
	  LayerDraggable.prototype._touchStart = function(event) {
	    var animation, i, len, properties, ref, touchEvent;
	    this._isMoving = this.isAnimating;
	    ref = this.layer.animations();
	    for (i = 0, len = ref.length; i < len; i++) {
	      animation = ref[i];
	      properties = animation.options.properties;
	      if (properties.hasOwnProperty("x") || properties.hasOwnProperty("y")) {
	        animation.stop();
	      }
	    }
	    this._stopSimulation();
	    this._resetdirectionLock();
	    event.preventDefault();
	    if (this.propagateEvents === false) {
	      event.stopPropagation();
	    }
	    touchEvent = Events.touchEvent(event);
	    this._eventBuffer.push({
	      x: touchEvent.clientX,
	      y: touchEvent.clientY,
	      t: Date.now()
	    });
	    this._layerStartPoint = this.layer.point;
	    this._correctedLayerStartPoint = this.layer.point;
	    if (this.constraints && this.bounce) {
	      this._correctedLayerStartPoint = this._constrainPosition(this._correctedLayerStartPoint, this.constraints, 1 / this.overdragScale);
	    }
	    this._cursorStartPoint = {
	      x: touchEvent.clientX,
	      y: touchEvent.clientY
	    };
	    this._layerCursorOffset = {
	      x: touchEvent.clientX - this._correctedLayerStartPoint.x,
	      y: touchEvent.clientY - this._correctedLayerStartPoint.y
	    };
	    this._point = this._correctedLayerStartPoint;
	    return this._ignoreUpdateLayerPosition = false;
	  };
	
	  LayerDraggable.prototype._touchMove = function(event) {
	    var offset, point, scaleX, scaleY, touchEvent;
	    if (!this.enabled) {
	      return;
	    }
	    if (!this._point) {
	      this.touchStart(event);
	    }
	    this._lastEvent = event;
	    event.preventDefault();
	    if (this.propagateEvents === false) {
	      event.stopPropagation();
	    }
	    touchEvent = Events.touchEvent(event);
	    this._eventBuffer.push({
	      x: touchEvent.clientX,
	      y: touchEvent.clientY,
	      t: Date.now()
	    });
	    point = _.clone(this._point);
	    scaleX = 1 / this.layer.canvasScaleX() * this.layer.scale * this.layer.scaleX;
	    scaleY = 1 / this.layer.canvasScaleY() * this.layer.scale * this.layer.scaleY;
	    if (this.horizontal) {
	      point.x = this._point.x + (event.delta.x * scaleX * this.speedX);
	    }
	    if (this.vertical) {
	      point.y = this._point.y + (event.delta.y * scaleY * this.speedY);
	    }
	    this._point = _.clone(point);
	    if (this._constraints) {
	      point = this._constrainPosition(point, this._constraints, this.overdragScale);
	    }
	    if (this.directionLock) {
	      if (!this._directionLockEnabledX && !this._directionLockEnabledY) {
	        offset = event.offset;
	        offset.x = offset.x * this.speedX * (1 / this.layer.canvasScaleX()) * this.layer.scaleX * this.layer.scale;
	        offset.y = offset.y * this.speedY * (1 / this.layer.canvasScaleY()) * this.layer.scaleY * this.layer.scale;
	        this._updatedirectionLock(offset);
	        return;
	      } else {
	        if (this._directionLockEnabledX) {
	          point.x = this._layerStartPoint.x;
	        }
	        if (this._directionLockEnabledY) {
	          point.y = this._layerStartPoint.y;
	        }
	      }
	    }
	    if (point.x !== this._layerStartPoint.x || point.y !== this._layerStartPoint.y) {
	      if (!this._isDragging) {
	        this._isDragging = true;
	        this._isMoving = true;
	        this.emit(Events.DragStart, event);
	      }
	    }
	    if (this.isDragging) {
	      this.emit(Events.DragWillMove, event);
	    }
	    if (this.pixelAlign) {
	      if (this.horizontal) {
	        point.x = parseInt(point.x);
	      }
	      if (this.vertical) {
	        point.y = parseInt(point.y);
	      }
	    }
	    this._ignoreUpdateLayerPosition = true;
	    this.layer.point = this.updatePosition(point);
	    this._ignoreUpdateLayerPosition = false;
	    if (this.isDragging) {
	      this.emit(Events.Move, this.layer.point);
	      return this.emit(Events.DragDidMove, event);
	    }
	  };
	
	  LayerDraggable.prototype._touchEnd = function(event) {
	    if (this.propagateEvents === false) {
	      event.stopPropagation();
	    }
	    this._startSimulation();
	    this.emit(Events.DragEnd, event);
	    this._isDragging = false;
	    return this._ignoreUpdateLayerPosition = true;
	  };
	
	  LayerDraggable.define("constraintsOffset", {
	    get: function() {
	      var constrainedPoint, maxX, maxY, minX, minY, offset, point, ref;
	      if (!this.constraints) {
	        return {
	          x: 0,
	          y: 0
	        };
	      }
	      ref = this._calculateConstraints(this.constraints), minX = ref.minX, maxX = ref.maxX, minY = ref.minY, maxY = ref.maxY;
	      point = this.layer.point;
	      constrainedPoint = {
	        x: Utils.clamp(point.x, minX, maxX),
	        y: Utils.clamp(point.y, minY, maxY)
	      };
	      offset = {
	        x: point.x - constrainedPoint.x,
	        y: point.y - constrainedPoint.y
	      };
	      return offset;
	    }
	  });
	
	  LayerDraggable.define("isBeyondConstraints", {
	    get: function() {
	      var constraintsOffset;
	      constraintsOffset = this.constraintsOffset;
	      if (constraintsOffset.x !== 0) {
	        return true;
	      }
	      if (constraintsOffset.y !== 0) {
	        return true;
	      }
	      return false;
	    }
	  });
	
	  LayerDraggable.prototype._clampAndScale = function(value, min, max, scale) {
	    if (value < min) {
	      value = min + (value - min) * scale;
	    }
	    if (value > max) {
	      value = max + (value - max) * scale;
	    }
	    return value;
	  };
	
	  LayerDraggable.prototype._calculateConstraints = function(bounds) {
	    var constraints;
	    if (!bounds) {
	      return constraints = {
	        minX: Infinity,
	        maxX: Infinity,
	        minY: Infinity,
	        maxY: Infinity
	      };
	    }
	    if (bounds.width < this.layer.width) {
	      bounds.width = this.layer.width;
	    }
	    if (bounds.height < this.layer.height) {
	      bounds.height = this.layer.height;
	    }
	    constraints = {
	      minX: Utils.frameGetMinX(bounds),
	      maxX: Utils.frameGetMaxX(bounds),
	      minY: Utils.frameGetMinY(bounds),
	      maxY: Utils.frameGetMaxY(bounds)
	    };
	    constraints.maxX -= this.layer.width;
	    constraints.maxY -= this.layer.height;
	    return constraints;
	  };
	
	  LayerDraggable.prototype._constrainPosition = function(proposedPoint, bounds, scale) {
	    var maxX, maxY, minX, minY, point, ref;
	    ref = this._calculateConstraints(this._constraints), minX = ref.minX, maxX = ref.maxX, minY = ref.minY, maxY = ref.maxY;
	    if (this.overdrag) {
	      point = {
	        x: this._clampAndScale(proposedPoint.x, minX, maxX, scale),
	        y: this._clampAndScale(proposedPoint.y, minY, maxY, scale)
	      };
	    } else {
	      point = {
	        x: Utils.clamp(proposedPoint.x, minX, maxX),
	        y: Utils.clamp(proposedPoint.y, minY, maxY)
	      };
	    }
	    if (this.speedX === 0 || this.horizontal === false) {
	      point.x = proposedPoint.x;
	    }
	    if (this.speedY === 0 || this.vertical === false) {
	      point.y = proposedPoint.y;
	    }
	    return point;
	  };
	
	  LayerDraggable.define("velocity", {
	    get: function() {
	      if (this.isAnimating) {
	        return this._calculateSimulationVelocity();
	      }
	      return this._eventBuffer.velocity;
	      return {
	        x: 0,
	        y: 0
	      };
	    }
	  });
	
	  LayerDraggable.define("angle", {
	    get: function() {
	      return this._eventBuffer.angle;
	    }
	  });
	
	  LayerDraggable.define("direction", {
	    get: function() {
	      var velocity;
	      velocity = this.velocity;
	      if (Math.abs(velocity.x) > Math.abs(velocity.y)) {
	        if (velocity.x > 0) {
	          return "right";
	        }
	        return "left";
	      } else {
	        if (velocity.y > 0) {
	          return "down";
	        }
	        return "up";
	      }
	    }
	  });
	
	  LayerDraggable.prototype.calculateVelocity = function() {
	    return this.velocity;
	  };
	
	  LayerDraggable.prototype._calculateSimulationVelocity = function() {
	    var velocity, xFinished, yFinished;
	    xFinished = this._simulation.x.finished();
	    yFinished = this._simulation.y.finished();
	    velocity = {
	      x: 0,
	      y: 0
	    };
	    if (!xFinished) {
	      velocity.x = this._simulation.x.simulator.state.v / this.momentumVelocityMultiplier;
	    }
	    if (!yFinished) {
	      velocity.y = this._simulation.y.simulator.state.v / this.momentumVelocityMultiplier;
	    }
	    return velocity;
	  };
	
	  LayerDraggable.prototype.emit = function(eventName, event) {
	    this.layer.emit(eventName, event);
	    return LayerDraggable.__super__.emit.call(this, eventName, event);
	  };
	
	  LayerDraggable.prototype._updatedirectionLock = function(correctedDelta) {
	    this._directionLockEnabledX = Math.abs(correctedDelta.y) > this.directionLockThreshold.y;
	    this._directionLockEnabledY = Math.abs(correctedDelta.x) > this.directionLockThreshold.x;
	    if (this._directionLockEnabledX || this._directionLockEnabledY) {
	      return this.emit(Events.DirectionLockStart, {
	        x: this._directionLockEnabledX,
	        y: this._directionLockEnabledY
	      });
	    }
	  };
	
	  LayerDraggable.prototype._resetdirectionLock = function() {
	    this._directionLockEnabledX = false;
	    return this._directionLockEnabledY = false;
	  };
	
	  LayerDraggable.prototype._setupSimulation = function() {
	    if (this._simulation) {
	      return;
	    }
	    this._simulation = {
	      x: this._setupSimulationForAxis("x"),
	      y: this._setupSimulationForAxis("y")
	    };
	    return this._updateSimulationConstraints(this.constraints);
	  };
	
	  LayerDraggable.prototype._setupSimulationForAxis = function(axis) {
	    var properties, simulation;
	    properties = {};
	    properties[axis] = true;
	    simulation = new Simulation({
	      layer: this.layer,
	      properties: properties,
	      model: "inertial-scroll",
	      modelOptions: {
	        momentum: this.momentumOptions,
	        bounce: this.bounceOptions
	      }
	    });
	    simulation.on(Events.SimulationStep, (function(_this) {
	      return function(state) {
	        return _this._onSimulationStep(axis, state);
	      };
	    })(this));
	    simulation.on(Events.SimulationStop, (function(_this) {
	      return function(state) {
	        return _this._onSimulationStop(axis, state);
	      };
	    })(this));
	    return simulation;
	  };
	
	  LayerDraggable.prototype._updateSimulationConstraints = function(constraints) {
	    var maxX, maxY, minX, minY, ref;
	    if (!this._simulation) {
	      return;
	    }
	    if (constraints) {
	      ref = this._calculateConstraints(this._constraints), minX = ref.minX, maxX = ref.maxX, minY = ref.minY, maxY = ref.maxY;
	      this._simulation.x.simulator.options = {
	        min: minX,
	        max: maxX
	      };
	      return this._simulation.y.simulator.options = {
	        min: minY,
	        max: maxY
	      };
	    } else {
	      this._simulation.x.simulator.options = {
	        min: -Infinity,
	        max: +Infinity
	      };
	      return this._simulation.y.simulator.options = {
	        min: -Infinity,
	        max: +Infinity
	      };
	    }
	  };
	
	  LayerDraggable.prototype._onSimulationStep = function(axis, state) {
	    var delta, maxX, maxY, minX, minY, ref, updatePoint;
	    if (axis === "x" && this.horizontal === false) {
	      return;
	    }
	    if (axis === "y" && this.vertical === false) {
	      return;
	    }
	    if (this.constraints) {
	      if (this.bounce) {
	        delta = state.x - this.layer[axis];
	      } else {
	        ref = this._calculateConstraints(this._constraints), minX = ref.minX, maxX = ref.maxX, minY = ref.minY, maxY = ref.maxY;
	        if (axis === "x") {
	          delta = Utils.clamp(state.x, minX, maxX) - this.layer[axis];
	        }
	        if (axis === "y") {
	          delta = Utils.clamp(state.x, minY, maxY) - this.layer[axis];
	        }
	      }
	    } else {
	      delta = state.x - this.layer[axis];
	    }
	    updatePoint = this.layer.point;
	    if (axis === "x") {
	      updatePoint[axis] = updatePoint[axis] + delta;
	    }
	    if (axis === "y") {
	      updatePoint[axis] = updatePoint[axis] + delta;
	    }
	    this.updatePosition(updatePoint);
	    this.layer[axis] = this.updatePosition(updatePoint)[axis];
	    return this.emit(Events.Move, this.layer.point);
	  };
	
	  LayerDraggable.prototype._onSimulationStop = function(axis, state) {
	    if (axis === "x" && this.horizontal === false) {
	      return;
	    }
	    if (axis === "y" && this.vertical === false) {
	      return;
	    }
	    if (!this._simulation) {
	      return;
	    }
	    if (this.pixelAlign) {
	      this.layer[axis] = parseInt(this.layer[axis]);
	    }
	    if (this._simulation.x.finished() && this._simulation.y.finished()) {
	      return this._stopSimulation();
	    }
	  };
	
	  LayerDraggable.prototype._startSimulation = function() {
	    var maxX, maxY, minX, minY, ref, startSimulationX, startSimulationY, velocity, velocityX, velocityY;
	    if (!(this.momentum || this.bounce)) {
	      return;
	    }
	    if (this.isBeyondConstraints === false && this.momentum === false) {
	      return;
	    }
	    if (this.isBeyondConstraints === false && this.isDragging === false) {
	      return;
	    }
	    ref = this._calculateConstraints(this._constraints), minX = ref.minX, maxX = ref.maxX, minY = ref.minY, maxY = ref.maxY;
	    startSimulationX = this.overdrag === true || (this.layer.x > minX && this.layer.x < maxX);
	    startSimulationY = this.overdrag === true || (this.layer.y > minY && this.layer.y < maxY);
	    if ((startSimulationX === startSimulationY && startSimulationY === false)) {
	      return;
	    }
	    velocity = this.velocity;
	    velocityX = velocity.x * this.momentumVelocityMultiplier * this.speedX * (1 / this.layer.canvasScaleX()) * this.layer.scaleX * this.layer.scale;
	    velocityY = velocity.y * this.momentumVelocityMultiplier * this.speedY * (1 / this.layer.canvasScaleY()) * this.layer.scaleY * this.layer.scale;
	    this._setupSimulation();
	    this._isAnimating = true;
	    this._isMoving = true;
	    this._simulation.x.simulator.setState({
	      x: this.layer.x,
	      v: velocityX
	    });
	    if (startSimulationX) {
	      this._simulation.x.start();
	    }
	    this._simulation.y.simulator.setState({
	      x: this.layer.y,
	      v: velocityY
	    });
	    if (startSimulationY) {
	      this._simulation.y.start();
	    }
	    return this.emit(Events.DragAnimationStart);
	  };
	
	  LayerDraggable.prototype._stopSimulation = function() {
	    var ref, ref1;
	    this._isAnimating = false;
	    if (!this._simulation) {
	      return;
	    }
	    if ((ref = this._simulation) != null) {
	      ref.x.stop();
	    }
	    if ((ref1 = this._simulation) != null) {
	      ref1.y.stop();
	    }
	    this._simulation = null;
	    this.emit(Events.Move, this.layer.point);
	    return this.emit(Events.DragAnimationEnd);
	  };
	
	  LayerDraggable.prototype.animateStop = function() {
	    return this._stopSimulation();
	  };
	
	  LayerDraggable.prototype.onMove = function(cb) {
	    return this.on(Events.Move, cb);
	  };
	
	  LayerDraggable.prototype.onDragStart = function(cb) {
	    return this.on(Events.DragStart, cb);
	  };
	
	  LayerDraggable.prototype.onDragWillMove = function(cb) {
	    return this.on(Events.DragWillMove, cb);
	  };
	
	  LayerDraggable.prototype.onDragMove = function(cb) {
	    return this.on(Events.DragMove, cb);
	  };
	
	  LayerDraggable.prototype.onDragDidMove = function(cb) {
	    return this.on(Events.DragDidMove, cb);
	  };
	
	  LayerDraggable.prototype.onDrag = function(cb) {
	    return this.on(Events.Drag, cb);
	  };
	
	  LayerDraggable.prototype.onDragEnd = function(cb) {
	    return this.on(Events.DragEnd, cb);
	  };
	
	  LayerDraggable.prototype.onDragAnimationStart = function(cb) {
	    return this.on(Events.DragAnimationStart, cb);
	  };
	
	  LayerDraggable.prototype.onDragAnimationEnd = function(cb) {
	    return this.on(Events.DragAnimationEnd, cb);
	  };
	
	  LayerDraggable.prototype.onDirectionLockStart = function(cb) {
	    return this.on(Events.DirectionLockStart, cb);
	  };
	
	  return LayerDraggable;
	
	})(BaseClass);


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, Config, Defaults, Events, FrictionSimulator, MomentumBounceSimulator, SimulatorClasses, SpringSimulator, Utils, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	_ = __webpack_require__(1)._;
	
	Utils = __webpack_require__(4);
	
	Config = __webpack_require__(14).Config;
	
	Defaults = __webpack_require__(17).Defaults;
	
	BaseClass = __webpack_require__(6).BaseClass;
	
	Events = __webpack_require__(15).Events;
	
	SpringSimulator = __webpack_require__(29).SpringSimulator;
	
	FrictionSimulator = __webpack_require__(31).FrictionSimulator;
	
	MomentumBounceSimulator = __webpack_require__(32).MomentumBounceSimulator;
	
	Events.SimulationStart = 'simulationStart';
	
	Events.SimulationStep = 'simulationStep';
	
	Events.SimulationStop = 'simulationStop';
	
	SimulatorClasses = {
	  "spring": SpringSimulator,
	  "friction": FrictionSimulator,
	  "inertial-scroll": MomentumBounceSimulator
	};
	
	exports.Simulation = (function(superClass) {
	  extend(Simulation, superClass);
	
	  function Simulation(options) {
	    var SimulatorClass;
	    if (options == null) {
	      options = {};
	    }
	    this._update = bind(this._update, this);
	    this._start = bind(this._start, this);
	    this.start = bind(this.start, this);
	    Simulation.__super__.constructor.call(this, options);
	    this.options = _.defaults(options, {
	      layer: null,
	      properties: {},
	      model: "spring",
	      modelOptions: {},
	      delay: 0,
	      debug: false
	    });
	    this._running = false;
	    SimulatorClass = SimulatorClasses[this.options.model] || SpringSimulator;
	    this._simulator = new SimulatorClass(this.options.modelOptions);
	  }
	
	  Simulation.prototype.animatingProperties = function() {
	    return _.keys(this.options.properties);
	  };
	
	  Simulation.prototype.start = function() {
	    var animatingProperties, animation, property, ref;
	    if (this.options.layer === null) {
	      console.error("Simulation: missing layer");
	    }
	    if (this.options.debug) {
	      console.log("Simulation.start " + this._simulator.constructor.name, this.options.modelOptions);
	    }
	    animatingProperties = this.animatingProperties();
	    ref = this.options.layer.animatingProperties();
	    for (property in ref) {
	      animation = ref[property];
	      if (indexOf.call(animatingProperties, property) >= 0) {
	        animation.stop();
	      }
	    }
	    if (this.options.delay) {
	      Utils.delay(this.options.delay, this._start);
	    } else {
	      this._start();
	    }
	    return true;
	  };
	
	  Simulation.prototype.stop = function(emit) {
	    if (emit == null) {
	      emit = true;
	    }
	    if (!this._running) {
	      return;
	    }
	    this._running = false;
	    this.options.layer.context.removeAnimation(this);
	    if (emit) {
	      this.emit(Events.SimulationStop);
	    }
	    return Framer.Loop.off("update", this._update);
	  };
	
	  Simulation.prototype.emit = function(event) {
	    Simulation.__super__.emit.apply(this, arguments);
	    return this.options.layer.emit(event, this);
	  };
	
	  Simulation.prototype._start = function() {
	    if (this._running) {
	      return;
	    }
	    this._running = true;
	    this.options.layer.context.addAnimation(this);
	    this.emit(Events.SimulationStart);
	    return Framer.Loop.on("update", this._update);
	  };
	
	  Simulation.prototype._update = function(delta) {
	    var emit, result;
	    if (this._simulator.finished()) {
	      this.stop(emit = false);
	      this.emit("end");
	      return this.emit(Events.SimulationStop);
	    } else {
	      result = this._simulator.next(delta);
	      return this.emit(Events.SimulationStep, result, delta);
	    }
	  };
	
	  Simulation.define("simulator", {
	    get: function() {
	      return this._simulator;
	    }
	  });
	
	  Simulation.prototype.finished = function() {
	    return this._simulator.finished();
	  };
	
	  return Simulation;
	
	})(BaseClass);


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var Defaults, Integrator, Simulator, Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(4);
	
	Defaults = __webpack_require__(17).Defaults;
	
	Simulator = __webpack_require__(30).Simulator;
	
	Integrator = __webpack_require__(23).Integrator;
	
	exports.SpringSimulator = (function(superClass) {
	  extend(SpringSimulator, superClass);
	
	  function SpringSimulator() {
	    this.finished = bind(this.finished, this);
	    return SpringSimulator.__super__.constructor.apply(this, arguments);
	  }
	
	  SpringSimulator.prototype.setup = function(options) {
	    this.options = Defaults.getDefaults("SpringSimulator", options);
	    this.options = _.defaults(options, {
	      velocity: 0,
	      position: 0,
	      offset: 0
	    });
	    this._state = {
	      x: this.options.position,
	      v: this.options.velocity
	    };
	    return this._integrator = new Integrator((function(_this) {
	      return function(state) {
	        return -_this.options.tension * state.x - _this.options.friction * state.v;
	      };
	    })(this));
	  };
	
	  SpringSimulator.prototype.next = function(delta) {
	    this._state = this._integrator.integrateState(this._state, delta);
	    return this.getState();
	  };
	
	  SpringSimulator.prototype.finished = function() {
	    var positionNearZero, velocityNearZero;
	    positionNearZero = Math.abs(this._state.x) < this.options.tolerance;
	    velocityNearZero = Math.abs(this._state.v) < this.options.tolerance;
	    return positionNearZero && velocityNearZero;
	  };
	
	  SpringSimulator.prototype.setState = function(state) {
	    return this._state = {
	      x: state.x - this.options.offset,
	      v: state.v
	    };
	  };
	
	  SpringSimulator.prototype.getState = function() {
	    var state;
	    return state = {
	      x: this._state.x + this.options.offset,
	      v: this._state.v
	    };
	  };
	
	  return SpringSimulator;
	
	})(Simulator);


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, Config, Utils, _,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(4);
	
	_ = __webpack_require__(1)._;
	
	Config = __webpack_require__(14).Config;
	
	BaseClass = __webpack_require__(6).BaseClass;
	
	exports.Simulator = (function(superClass) {
	  "The simulator class runs a physics simulation based on a set of input values\nat setup({input values}), and emits an output state {x, v}";
	  extend(Simulator, superClass);
	
	  Simulator.define("state", {
	    get: function() {
	      return _.clone(this._state);
	    },
	    set: function(state) {
	      return this._state = _.clone(state);
	    }
	  });
	
	  function Simulator(options) {
	    if (options == null) {
	      options = {};
	    }
	    this._state = {
	      x: 0,
	      v: 0
	    };
	    this.options = null;
	    this.setup(options);
	  }
	
	  Simulator.prototype.setup = function(options) {
	    throw Error("Not implemented");
	  };
	
	  Simulator.prototype.next = function(delta) {
	    throw Error("Not implemented");
	  };
	
	  Simulator.prototype.finished = function() {
	    throw Error("Not implemented");
	  };
	
	  return Simulator;
	
	})(BaseClass);


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var Defaults, Integrator, Simulator, Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(4);
	
	Defaults = __webpack_require__(17).Defaults;
	
	Simulator = __webpack_require__(30).Simulator;
	
	Integrator = __webpack_require__(23).Integrator;
	
	exports.FrictionSimulator = (function(superClass) {
	  extend(FrictionSimulator, superClass);
	
	  function FrictionSimulator() {
	    this.finished = bind(this.finished, this);
	    return FrictionSimulator.__super__.constructor.apply(this, arguments);
	  }
	
	  FrictionSimulator.prototype.setup = function(options) {
	    this.options = Defaults.getDefaults("FrictionSimulator", options);
	    this.options = _.defaults(options, {
	      velocity: 0,
	      position: 0
	    });
	    this._state = {
	      x: this.options.position,
	      v: this.options.velocity
	    };
	    return this._integrator = new Integrator((function(_this) {
	      return function(state) {
	        return -(_this.options.friction * state.v);
	      };
	    })(this));
	  };
	
	  FrictionSimulator.prototype.next = function(delta) {
	    this._state = this._integrator.integrateState(this._state, delta);
	    return this._state;
	  };
	
	  FrictionSimulator.prototype.finished = function() {
	    return Math.abs(this._state.v) < this.options.tolerance;
	  };
	
	  return FrictionSimulator;
	
	})(Simulator);


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var Defaults, FrictionSimulator, Simulator, SpringSimulator, Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(4);
	
	Defaults = __webpack_require__(17).Defaults;
	
	Simulator = __webpack_require__(30).Simulator;
	
	SpringSimulator = __webpack_require__(29).SpringSimulator;
	
	FrictionSimulator = __webpack_require__(31).FrictionSimulator;
	
	exports.MomentumBounceSimulator = (function(superClass) {
	  extend(MomentumBounceSimulator, superClass);
	
	  function MomentumBounceSimulator() {
	    this.finished = bind(this.finished, this);
	    return MomentumBounceSimulator.__super__.constructor.apply(this, arguments);
	  }
	
	  MomentumBounceSimulator.prototype.setup = function(options) {
	    this.options = Defaults.getDefaults("MomentumBounceSimulator", options);
	    this.options = _.defaults(options, {
	      velocity: 0,
	      position: 0,
	      min: 0,
	      max: 0
	    });
	    this._frictionSimulator = new FrictionSimulator({
	      friction: this.options.momentum.friction,
	      tolerance: this.options.momentum.tolerance,
	      velocity: this.options.velocity,
	      position: this.options.position
	    });
	    this._springSimulator = new SpringSimulator({
	      tension: this.options.bounce.tension,
	      friction: this.options.bounce.friction,
	      tolerance: this.options.bounce.tolerance,
	      velocity: this.options.velocity,
	      position: this.options.position
	    });
	    this._state = {
	      x: this.options.position,
	      v: this.options.velocity
	    };
	    return this._useSpring = false;
	  };
	
	  MomentumBounceSimulator.prototype.next = function(delta) {
	    if (this._useSpring) {
	      this._state = this._springSimulator.next(delta);
	    } else {
	      this._state = this._frictionSimulator.next(delta);
	      this._tryTransitionToSpring(this._state);
	    }
	    return this._state;
	  };
	
	  MomentumBounceSimulator.prototype.finished = function() {
	    if (this._useSpring) {
	      return this._springSimulator.finished();
	    }
	    return this._frictionSimulator.finished();
	  };
	
	  MomentumBounceSimulator.prototype.setState = function(state) {
	    var bound;
	    this._state = {
	      x: state.x,
	      v: state.v
	    };
	    this._frictionSimulator.setState(this._state);
	    if (this._isValidState()) {
	      return this._tryTransitionToSpring();
	    } else {
	      if (this._state.x <= this.options.min) {
	        bound = this.options.min;
	      }
	      if (this._state.x >= this.options.max) {
	        bound = this.options.max;
	      }
	      return this._transitionToSpring(bound);
	    }
	  };
	
	  MomentumBounceSimulator.prototype._tryTransitionToSpring = function(force) {
	    var aboveMaxWithVelocity, belowMinWithVelocity, bound;
	    belowMinWithVelocity = this._state.x < this.options.min && this._state.v <= 0;
	    aboveMaxWithVelocity = this._state.x > this.options.max && this._state.v >= 0;
	    if (belowMinWithVelocity || aboveMaxWithVelocity) {
	      if (belowMinWithVelocity) {
	        bound = this.options.min;
	      }
	      if (aboveMaxWithVelocity) {
	        bound = this.options.max;
	      }
	      return this._transitionToSpring(bound);
	    } else {
	      return this._useSpring = false;
	    }
	  };
	
	  MomentumBounceSimulator.prototype._transitionToSpring = function(bound) {
	    this._useSpring = true;
	    this._springSimulator.options.offset = bound;
	    return this._springSimulator.setState(this._state);
	  };
	
	  MomentumBounceSimulator.prototype._isValidState = function() {
	    var aboveMaxTravelingBack, belowMinTravelingBack, bound, check, friction, solution;
	    belowMinTravelingBack = this._state.x < this.options.min && this._state.v > 0;
	    aboveMaxTravelingBack = this._state.x > this.options.max && this._state.v < 0;
	    check = false;
	    if (belowMinTravelingBack) {
	      bound = this.options.min;
	      check = true;
	    } else if (aboveMaxTravelingBack) {
	      bound = this.options.max;
	      check = true;
	    }
	    if (check) {
	      friction = this._frictionSimulator.options.friction;
	      solution = 1 - (friction * (bound - this._state.x)) / this._state.v;
	      return solution > 0;
	    }
	    return true;
	  };
	
	  return MomentumBounceSimulator;
	
	})(Simulator);


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, Events, Utils, _,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(1)._;
	
	Utils = __webpack_require__(4);
	
	BaseClass = __webpack_require__(6).BaseClass;
	
	Events = __webpack_require__(15).Events;
	
	Events.EventBufferReset = "eventbufferreset";
	
	Events.EventBufferUpdated = "eventbufferupdated";
	
	exports.EventBuffer = (function(superClass) {
	  extend(EventBuffer, superClass);
	
	  function EventBuffer(options) {
	    if (options == null) {
	      options = {};
	    }
	    this.options = _.defaults(options, {
	      velocityTimeout: 100
	    });
	    this._events = [];
	  }
	
	  EventBuffer.prototype.push = function(event) {
	    this._events.push(event);
	    return this.emit(Events.EventBufferUpdated, event);
	  };
	
	  EventBuffer.prototype.reset = function() {
	    this._events.length = 0;
	    return this.emit(Events.EventBufferReset);
	  };
	
	  EventBuffer.define("length", {
	    get: function() {
	      return this._events.length;
	    }
	  });
	
	  EventBuffer.define("first", {
	    get: function() {
	      return this._events[0];
	    }
	  });
	
	  EventBuffer.define("offset", {
	    get: function() {
	      var current, first, offset;
	      if (events.length < 2) {
	        return {
	          x: 0,
	          y: 0
	        };
	      }
	      current = events[events.length - 1];
	      first = events[0];
	      return offset = {
	        x: current.x - first.x,
	        y: current.y - first.y
	      };
	    }
	  });
	
	  EventBuffer.define("events", {
	    get: function() {
	      var timeout;
	      timeout = Date.now() - this.options.velocityTimeout;
	      return _.filter(this._events, (function(_this) {
	        return function(event) {
	          return event.t > timeout;
	        };
	      })(this));
	    }
	  });
	
	  EventBuffer.define("angle", {
	    get: function() {
	      var events, p1, p2;
	      events = this.events;
	      if (events.length < 2) {
	        return 0;
	      }
	      p1 = events[0];
	      p2 = events[1];
	      return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
	    }
	  });
	
	  EventBuffer.define("velocity", {
	    get: function() {
	      var current, events, first, time, velocity;
	      events = this.events;
	      if (events.length < 2) {
	        return {
	          x: 0,
	          y: 0
	        };
	      }
	      current = events[events.length - 1];
	      first = events[0];
	      time = current.t - first.t;
	      velocity = {
	        x: (current.x - first.x) / time,
	        y: (current.y - first.y) / time
	      };
	      if (velocity.x === Infinity) {
	        velocity.x = 0;
	      }
	      if (velocity.y === Infinity) {
	        velocity.y = 0;
	      }
	      return velocity;
	    }
	  });
	
	  return EventBuffer;
	
	})(BaseClass);


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, Events, Gestures, Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(4);
	
	BaseClass = __webpack_require__(6).BaseClass;
	
	Events = __webpack_require__(15).Events;
	
	Gestures = __webpack_require__(16).Gestures;
	
	Events.PinchStart = "pinchstart";
	
	Events.Pinch = "pinch";
	
	Events.PinchEnd = "pinchend";
	
	Events.RotateStart = "rotatestart";
	
	Events.Rotate = "rotate";
	
	Events.RotateEnd = "rotateend";
	
	Events.ScaleStart = "scalestart";
	
	Events.Scale = "scale";
	
	Events.ScaleEnd = "scaleend";
	
	exports.LayerPinchable = (function(superClass) {
	  extend(LayerPinchable, superClass);
	
	  LayerPinchable.define("enabled", LayerPinchable.simpleProperty("enabled", true));
	
	  LayerPinchable.define("threshold", LayerPinchable.simpleProperty("threshold", 0));
	
	  LayerPinchable.define("centerOrigin", LayerPinchable.simpleProperty("centerOrigin", true));
	
	  LayerPinchable.define("scale", LayerPinchable.simpleProperty("scale", true));
	
	  LayerPinchable.define("scaleIncrements", LayerPinchable.simpleProperty("scaleIncrements", 0));
	
	  LayerPinchable.define("minScale", LayerPinchable.simpleProperty("minScale", 0));
	
	  LayerPinchable.define("maxScale", LayerPinchable.simpleProperty("maxScale", Number.MAX_VALUE));
	
	  LayerPinchable.define("scaleFactor", LayerPinchable.simpleProperty("scaleFactor", 1));
	
	  LayerPinchable.define("rotate", LayerPinchable.simpleProperty("rotate", true));
	
	  LayerPinchable.define("rotateIncrements", LayerPinchable.simpleProperty("rotateIncrements", 0));
	
	  LayerPinchable.define("rotateMin", LayerPinchable.simpleProperty("rotateMin", 0));
	
	  LayerPinchable.define("rotateMax", LayerPinchable.simpleProperty("rotateMax", 0));
	
	  LayerPinchable.define("rotateFactor", LayerPinchable.simpleProperty("rotateFactor", 1));
	
	  function LayerPinchable(layer) {
	    this.layer = layer;
	    this._pinchEnd = bind(this._pinchEnd, this);
	    this._pinch = bind(this._pinch, this);
	    this._pinchStart = bind(this._pinchStart, this);
	    this._centerOrigin = bind(this._centerOrigin, this);
	    LayerPinchable.__super__.constructor.apply(this, arguments);
	    this._attach();
	  }
	
	  LayerPinchable.prototype._attach = function() {
	    this.layer.on(Gestures.PinchStart, this._pinchStart);
	    this.layer.on(Gestures.Pinch, this._pinch);
	    this.layer.on(Gestures.PinchEnd, this._pinchEnd);
	    return this.layer.on(Gestures.TapStart, this._tapStart);
	  };
	
	  LayerPinchable.prototype._reset = function() {
	    this._scaleStart = null;
	    this._rotationStart = null;
	    return this._rotationOffset = null;
	  };
	
	  LayerPinchable.prototype._tapStart = function(event) {};
	
	  LayerPinchable.prototype._centerOrigin = function(event) {
	    var originDelta, pinchLocation, topInSuperAfter, topInSuperBefore;
	    topInSuperBefore = Utils.convertPoint({}, this.layer, this.layer.superLayer);
	    pinchLocation = Utils.convertPointFromContext(event.touchCenter, this.layer, true, true);
	    this.layer.originX = pinchLocation.x / this.layer.width;
	    this.layer.originY = pinchLocation.y / this.layer.height;
	    topInSuperAfter = Utils.convertPoint({}, this.layer, this.layer.superLayer);
	    originDelta = {
	      x: topInSuperAfter.x - topInSuperBefore.x,
	      y: topInSuperAfter.y - topInSuperBefore.y
	    };
	    this.layer.x -= originDelta.x;
	    return this.layer.y -= originDelta.y;
	  };
	
	  LayerPinchable.prototype._pinchStart = function(event) {
	    this._reset();
	    if (this.centerOrigin) {
	      this._centerOrigin(event);
	    }
	    return this.normalizeRotation = Utils.rotationNormalizer();
	  };
	
	  LayerPinchable.prototype._pinch = function(event) {
	    var pointA, pointB, rotation, scale;
	    if (event.fingers !== 2) {
	      return;
	    }
	    if (!this.enabled) {
	      return;
	    }
	    pointA = {
	      x: event.touches[0].pageX,
	      y: event.touches[0].pageY
	    };
	    pointB = {
	      x: event.touches[1].pageX,
	      y: event.touches[1].pageY
	    };
	    if (!(Utils.pointTotal(Utils.pointAbs(Utils.pointSubtract(pointA, pointB))) > this.threshold)) {
	      return;
	    }
	    if (this.scale) {
	      if (this._scaleStart == null) {
	        this._scaleStart = this.layer.scale;
	      }
	      scale = (((event.scale - 1) * this.scaleFactor) + 1) * this._scaleStart;
	      if (this.minScale && this.maxScale) {
	        scale = Utils.clamp(scale, this.minScale, this.maxScale);
	      } else if (this.minScale) {
	        scale = Utils.clamp(scale, this.minScale, 1000000);
	      } else if (this.maxScale) {
	        scale = Utils.clamp(scale, 0.00001, this.maxScale);
	      }
	      if (this.scaleIncrements) {
	        scale = Utils.nearestIncrement(scale, this.scaleIncrements);
	      }
	      this.layer.scale = scale;
	      this.emit(Events.Scale, event);
	    }
	    if (this.rotate) {
	      if (this._rotationStart == null) {
	        this._rotationStart = this.layer.rotation;
	      }
	      if (this._rotationOffset == null) {
	        this._rotationOffset = event.rotation;
	      }
	      rotation = event.rotation - this._rotationOffset + this._rotationStart;
	      rotation = rotation * this.rotateFactor;
	      rotation = this.normalizeRotation(rotation);
	      if (this.rotateMin && this.rotateMax) {
	        rotation = Utils.clamp(rotation, this.rotateMin, this.rotateMax);
	      }
	      if (this.rotateIncrements) {
	        rotation = Utils.nearestIncrement(rotation, this.rotateIncrements);
	      }
	      return this.layer.rotation = rotation;
	    }
	  };
	
	  LayerPinchable.prototype._pinchEnd = function(event) {
	    return this._reset();
	  };
	
	  return LayerPinchable;
	
	})(BaseClass);


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var Layer,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Layer = __webpack_require__(13).Layer;
	
	"Todo: make it work in a parent layer";
	
	exports.BackgroundLayer = (function(superClass) {
	  extend(BackgroundLayer, superClass);
	
	  function BackgroundLayer(options) {
	    if (options == null) {
	      options = {};
	    }
	    this.layout = bind(this.layout, this);
	    if (options.backgroundColor == null) {
	      options.backgroundColor = "#fff";
	    }
	    BackgroundLayer.__super__.constructor.call(this, options);
	    this.sendToBack();
	    this.layout();
	    this._context.domEventManager.wrap(window).addEventListener("resize", this.layout);
	  }
	
	  BackgroundLayer.prototype.layout = function() {
	    if (this.parent) {
	      return this.frame = this.parent.frame;
	    } else {
	      return this.frame = this._context.frame;
	    }
	  };
	
	  return BackgroundLayer;
	
	})(Layer);


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var Layer,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Layer = __webpack_require__(13).Layer;
	
	exports.VideoLayer = (function(superClass) {
	  extend(VideoLayer, superClass);
	
	  function VideoLayer(options) {
	    if (options == null) {
	      options = {};
	    }
	    this.player = document.createElement("video");
	    this.player.setAttribute("webkit-playsinline", "true");
	    this.player.style.width = "100%";
	    this.player.style.height = "100%";
	    VideoLayer.__super__.constructor.call(this, options);
	    this.player.on = this._context.domEventManager.wrap(this.player).addEventListener;
	    this.player.off = this._context.domEventManager.wrap(this.player).removeEventListener;
	    this.video = options.video;
	    this._element.appendChild(this.player);
	  }
	
	  VideoLayer.define("video", {
	    get: function() {
	      return this.player.src;
	    },
	    set: function(video) {
	      return this.player.src = video;
	    }
	  });
	
	  return VideoLayer;
	
	})(Layer);


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var AnimationGroup, EventEmitter, _,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(1)._;
	
	EventEmitter = __webpack_require__(7).EventEmitter;
	
	AnimationGroup = (function(superClass) {
	  extend(AnimationGroup, superClass);
	
	  function AnimationGroup(animations) {
	    if (animations == null) {
	      animations = [];
	    }
	    this.setAnimations(animations);
	    this._currentAnimation = null;
	  }
	
	  AnimationGroup.prototype.setAnimations = function(animations) {
	    return this._animations = _.map(animations, function(animation) {
	      return animation.copy();
	    });
	  };
	
	  AnimationGroup.prototype.start = function() {
	    this.emit("start");
	    _.map(this._animations, (function(_this) {
	      return function(animation, index) {
	        var nextAnimation;
	        nextAnimation = _this._animations[index + 1];
	        if (nextAnimation) {
	          return animation.on(Events.AnimationEnd, function() {
	            nextAnimation.start();
	            return _this._currentAnimation = animation;
	          });
	        } else {
	          return animation.on(Events.AnimationEnd, function() {
	            _this.emit("end");
	            return _this._currentAnimation = null;
	          });
	        }
	      };
	    })(this));
	    return this._animations[0].start();
	  };
	
	  AnimationGroup.prototype.stop = function() {
	    var ref;
	    return (ref = this._currentAnimation) != null ? ref.stop() : void 0;
	  };
	
	  return AnimationGroup;
	
	})(EventEmitter);


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var Layer, Path, Utils, _, catmullRom2Bezier, j, len, method, ref,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	_ = __webpack_require__(1)._;
	
	Utils = __webpack_require__(4);
	
	Layer = __webpack_require__(13).Layer;
	
	catmullRom2Bezier = function(points, closed, tension) {
	  var c1x, c1y, c2x, c2y, d, i, j, l, p, ref, t, x, y, zero;
	  if (closed == null) {
	    closed = false;
	  }
	  if (tension == null) {
	    tension = 0.5;
	  }
	  d = [];
	  l = points.length;
	  i = 0;
	  zero = {
	    x: 0,
	    y: 0
	  };
	  for (i = j = 0, ref = l - !closed; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	    p = [points[i - 1] || zero, points[i] || zero, points[i + 1] || zero, points[i + 2] || zero];
	    if (closed) {
	      if (i === 0) {
	        p[0] = points[l - 1];
	      } else if (i === l - 2) {
	        p[3] = points[0];
	      } else if (i === l - 1) {
	        p[2] = points[0];
	        p[3] = points[1];
	      }
	    } else {
	      if (i === l - 2) {
	        p[3] = p[2];
	      } else if (i === 0) {
	        p[0] = points[i];
	      }
	    }
	    t = (tension - 1) * 2;
	    c1x = p[1].x - (p[2].x - p[0].x) / (6 / t);
	    c1y = p[1].y - (p[2].y - p[0].y) / (6 / t);
	    c2x = p[2].x + (p[3].x - p[1].x) / (6 / t);
	    c2y = p[2].y + (p[3].y - p[1].y) / (6 / t);
	    x = p[2].x;
	    y = p[2].y;
	    d.push([
	      {
	        x: c1x,
	        y: c1y
	      }, {
	        x: c2x,
	        y: c2y
	      }, {
	        x: x,
	        y: y
	      }
	    ]);
	  }
	  return d;
	};
	
	Path = function(init) {
	  var arc, closePath, curve, curveTo, elementForDebugRepresentation, end, forLayer, functor, getTotalLength, hasOrigin, hlineTo, instructionToString, instructions, length, lineTo, moveTo, node, originOrZero, plus, point, pointAtLength, points, push, qcurveTo, smoothCurveTo, smoothqCurveTo, start, thru, toString, unshift, vlineTo;
	  instructions = init || [];
	  functor = function(f, args) {
	    if (typeof f === 'function') {
	      return f(instructions);
	    } else {
	      return f;
	    }
	  };
	  instructionToString = function(arg) {
	    var command, params;
	    command = arg.command, params = arg.params;
	    return command + " " + (params.join(' '));
	  };
	  point = function(arg, arg1) {
	    var command, params, prev_x, prev_y;
	    command = arg.command, params = arg.params;
	    prev_x = arg1[0], prev_y = arg1[1];
	    switch (command) {
	      case 'M':
	        return [params[0], params[1]];
	      case 'L':
	        return [params[0], params[1]];
	      case 'H':
	        return [params[0], prev_y];
	      case 'V':
	        return [prev_x, params[0]];
	      case 'Z':
	        return null;
	      case 'C':
	        return [params[4], params[5]];
	      case 'S':
	        return [params[2], params[3]];
	      case 'Q':
	        return [params[2], params[3]];
	      case 'T':
	        return [params[0], params[1]];
	      case 'A':
	        return [params[5], params[6]];
	    }
	  };
	  push = function(arr, el) {
	    var copy;
	    copy = arr.slice(0, arr.length);
	    copy.push(el);
	    return copy;
	  };
	  unshift = function(arr, el) {
	    var copy;
	    copy = arr.slice(0, arr.length);
	    copy.unshift(el);
	    return copy;
	  };
	  plus = function(instruction) {
	    return Path(push(instructions, instruction));
	  };
	  moveTo = function(arg) {
	    var x, y;
	    x = arg.x, y = arg.y;
	    return plus({
	      command: 'M',
	      params: [x, y]
	    });
	  };
	  lineTo = function(arg) {
	    var x, y;
	    x = arg.x, y = arg.y;
	    return plus({
	      command: 'L',
	      params: [x, y]
	    });
	  };
	  hlineTo = function(x) {
	    return plus({
	      command: 'H',
	      params: [x]
	    });
	  };
	  vlineTo = function(y) {
	    return plus({
	      command: 'V',
	      params: [y]
	    });
	  };
	  closePath = function() {
	    return plus({
	      command: 'Z',
	      params: []
	    });
	  };
	  curve = function(arg) {
	    var control, control1, control2, p, to;
	    to = arg.to, control = arg.control, control1 = arg.control1, control2 = arg.control2;
	    p = Path(instructions);
	    if (control) {
	      control1 = control;
	    }
	    if (control1 && !control2) {
	      p = p.qcurveTo(to, {
	        control: control1
	      });
	    }
	    if (control1 && control2) {
	      p = p.curveTo(to, {
	        control1: control1,
	        control2: control2
	      });
	    }
	    return p;
	  };
	  curveTo = function(to, arg) {
	    var control1, control2;
	    control1 = arg.control1, control2 = arg.control2;
	    return plus({
	      command: 'C',
	      params: [control1.x, control1.y, control2.x, control2.y, to.x, to.y]
	    });
	  };
	  smoothCurveTo = function(to, arg) {
	    var control;
	    control = arg.control;
	    return plus({
	      command: 'S',
	      params: [control.x, control.y, to.x, to.y]
	    });
	  };
	  qcurveTo = function(to, arg) {
	    var control;
	    control = arg.control;
	    return plus({
	      command: 'Q',
	      params: [control.x, control.y, to.x, to.y]
	    });
	  };
	  smoothqCurveTo = function(arg) {
	    var x, y;
	    x = arg.x, y = arg.y;
	    return plus({
	      command: 'T',
	      params: [x, y]
	    });
	  };
	  originOrZero = function(instructions) {
	    var ref;
	    if (((ref = instructions[0]) != null ? ref.command : void 0) === 'M') {
	      return {
	        x: instructions[0].params[0],
	        y: instructions[0].params[1]
	      };
	    } else {
	      return {
	        x: 0,
	        y: 0
	      };
	    }
	  };
	  arc = function(arg) {
	    var largeArc, rx, ry, sweep, to, xrot;
	    to = arg.to, rx = arg.rx, ry = arg.ry, xrot = arg.xrot, largeArc = arg.largeArc, sweep = arg.sweep;
	    if (xrot == null) {
	      xrot = 0;
	    }
	    if (rx == null) {
	      rx = function(instructions) {
	        var o;
	        o = originOrZero(instructions);
	        return to.x - o.x;
	      };
	    }
	    if (ry == null) {
	      ry = function(instructions) {
	        var o;
	        o = originOrZero(instructions);
	        return to.y - o.y;
	      };
	    }
	    if (largeArc == null) {
	      largeArc = 0;
	    }
	    largeArc = largeArc ? 1 : 0;
	    if (sweep == null) {
	      sweep = 1;
	    }
	    sweep = sweep ? 1 : 0;
	    return plus({
	      command: 'A',
	      params: [rx, ry, xrot, largeArc, sweep, to.x, to.y]
	    });
	  };
	  thru = function(points, arg) {
	    var b, beziers, closed, curviness, j, len, p, tension;
	    curviness = (arg != null ? arg : {}).curviness;
	    if (curviness == null) {
	      curviness = 5;
	    }
	    tension = 1 - curviness / 10;
	    closed = false;
	    beziers = catmullRom2Bezier(points, closed, tension);
	    p = Path(instructions).moveTo(points[0]);
	    for (j = 0, len = beziers.length; j < len; j++) {
	      b = beziers[j];
	      p = p.curveTo(b[2], {
	        control1: b[0],
	        control2: b[1]
	      });
	    }
	    return p;
	  };
	  toString = function() {
	    var evaluate;
	    evaluate = function(instruction, i) {
	      return {
	        command: instruction.command,
	        params: instruction.params.map(functor)
	      };
	    };
	    return instructions.map(evaluate).map(instructionToString).join(' ');
	  };
	  points = function() {
	    var fn, instruction, j, len, prev, ps;
	    ps = [];
	    prev = [0, 0];
	    fn = function() {
	      var p;
	      p = point(instruction, prev);
	      prev = p;
	      if (p) {
	        return ps.push(p);
	      }
	    };
	    for (j = 0, len = instructions.length; j < len; j++) {
	      instruction = instructions[j];
	      fn();
	    }
	    return ps;
	  };
	  pointAtLength = function(length) {
	    return node.getPointAtLength(length);
	  };
	  getTotalLength = function() {
	    return node.getTotalLength();
	  };
	  elementForDebugRepresentation = function() {
	    var addx, addy, animatedPath, c1, c1x, c1y, c2, c2x, c2y, conn, conn2, connector, controlMarker, debugPath, element, elements, group, i, j, k, len, lx, ly, m, marker, mx, my, olx, oly, ref, ref1, relativeSegmentTypes, segment, segments;
	    group = Utils.SVG.createElement('g');
	    marker = Utils.SVG.createElement('circle', {
	      r: 2,
	      cx: 0,
	      cy: 0,
	      fill: 'red'
	    });
	    controlMarker = Utils.SVG.createElement('circle', {
	      r: 2,
	      cx: 0,
	      cy: 0,
	      fill: 'white',
	      stroke: '#aaa',
	      'stroke-width': '1px'
	    });
	    connector = Utils.SVG.createElement('path', {
	      d: "M0,0",
	      fill: 'transparent',
	      stroke: 'rgba(0, 0, 0, 0.25)',
	      'stroke-width': '1px',
	      'stroke-dasharray': '4 4'
	    });
	    debugPath = node.cloneNode();
	    lx = 0;
	    ly = 0;
	    segments = debugPath.pathSegList;
	    relativeSegmentTypes = [SVGPathSeg.PATHSEG_MOVETO_REL, SVGPathSeg.PATHSEG_LINETO_REL, SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL, SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL, SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL, SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL, SVGPathSeg.PATHSEG_ARC_REL, SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL, SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL];
	    elements = [];
	    for (i = j = 0, ref = segments.numberOfItems; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
	      segment = segments.getItem(i);
	      if (ref1 = segment.pathSegType, indexOf.call(relativeSegmentTypes, ref1) >= 0) {
	        addx = lx;
	        addy = ly;
	      } else {
	        addx = 0;
	        addy = 0;
	      }
	      olx = lx;
	      oly = ly;
	      if (segment.x || segment.y) {
	        m = marker.cloneNode();
	        mx = addx + (typeof segment.x === 'undefined' ? lx : segment.x);
	        my = addy + (typeof segment.y === 'undefined' ? ly : segment.y);
	        m.setAttribute('cx', mx);
	        m.setAttribute('cy', my);
	        m.setAttribute('class', 'debug-marker');
	        lx = mx;
	        ly = my;
	        elements.push(m);
	      }
	      if (segment.x1) {
	        c1 = controlMarker.cloneNode();
	        c1x = addx + segment.x1;
	        c1y = addy + segment.y1;
	        c1.setAttribute('cx', c1x);
	        c1.setAttribute('cy', c1y);
	        c1.setAttribute('class', 'debug-control-marker');
	        conn = connector.cloneNode();
	        conn.setAttribute('d', "M" + olx + "," + oly + " L" + c1x + "," + c1y);
	        conn.setAttribute('class', 'debug-connector');
	        elements.push(c1);
	        elements.push(conn);
	        if (!segment.x2) {
	          conn2 = connector.cloneNode();
	          conn2.setAttribute('d', "M" + mx + "," + my + " L" + c1x + "," + c1y);
	          conn2.setAttribute('class', 'debug-connector');
	          elements.push(conn2);
	        }
	      }
	      if (segment.x2) {
	        c2 = controlMarker.cloneNode();
	        c2x = addx + segment.x2;
	        c2y = addy + segment.y2;
	        c2.setAttribute('cx', c2x);
	        c2.setAttribute('cy', c2y);
	        c2.setAttribute('class', 'debug-control-marker');
	        conn = connector.cloneNode();
	        conn.setAttribute('d', "M" + mx + "," + my + " L" + c2x + "," + c2y);
	        conn.setAttribute('class', 'debug-connector');
	        elements.push(conn);
	        elements.push(c2);
	      }
	    }
	    for (k = 0, len = elements.length; k < len; k++) {
	      element = elements[k];
	      group.appendChild(element);
	    }
	    debugPath.setAttribute('stroke', 'rgba(255, 0, 0, 0.75)');
	    debugPath.setAttribute('stroke-width', 1);
	    debugPath.setAttribute('fill', 'transparent');
	    debugPath.setAttribute('class', 'debug-path');
	    animatedPath = debugPath.cloneNode();
	    animatedPath.setAttribute('class', 'animated-path');
	    animatedPath.setAttribute('stroke', 'transparent');
	    animatedPath.setAttribute('stroke-dasharray', getTotalLength());
	    animatedPath.setAttribute('stroke-dashoffset', getTotalLength());
	    animatedPath.setAttribute('fill', 'transparent');
	    group.appendChild(animatedPath);
	    group.appendChild(debugPath);
	    return group;
	  };
	  hasOrigin = function() {
	    return indexOf.call(_.pluck(instructions, 'command'), 'M') >= 0;
	  };
	  forLayer = function(layer) {
	    var x, y;
	    x = layer.x + layer.originX * layer.width;
	    y = layer.y + layer.originY * layer.height;
	    if (!hasOrigin()) {
	      return Path(unshift(instructions, {
	        command: 'M',
	        params: [x, y]
	      }));
	    }
	    return Path(instructions);
	  };
	  node = null;
	  length = null;
	  start = null;
	  end = null;
	  if (hasOrigin()) {
	    node = Utils.SVG.createElement('path', {
	      d: toString(),
	      fill: 'transparent'
	    });
	    length = getTotalLength();
	    start = pointAtLength(0);
	    end = pointAtLength(length);
	  }
	  return {
	    moveTo: moveTo,
	    lineTo: lineTo,
	    hlineTo: hlineTo,
	    vlineTo: vlineTo,
	    closePath: closePath,
	    curve: curve,
	    curveTo: curveTo,
	    smoothCurveTo: smoothCurveTo,
	    qcurveTo: qcurveTo,
	    smoothqCurveTo: smoothqCurveTo,
	    arc: arc,
	    thru: thru,
	    pointAtLength: pointAtLength,
	    elementForDebugRepresentation: elementForDebugRepresentation,
	    start: start,
	    end: end,
	    length: length,
	    node: node,
	    forLayer: forLayer,
	    toString: toString,
	    points: points,
	    instructions: instructions
	  };
	};
	
	ref = ['curve', 'arc', 'thru', 'moveTo'];
	for (j = 0, len = ref.length; j < len; j++) {
	  method = ref[j];
	  Path[method] = (function(m) {
	    return function() {
	      return Path()[m].apply(this, arguments);
	    };
	  })(method);
	}
	
	Path.stringToInstructions = function(path) {
	  var instructions, length, segment;
	  segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
	  length = {
	    a: 7,
	    c: 6,
	    h: 1,
	    l: 2,
	    m: 2,
	    q: 4,
	    s: 4,
	    t: 2,
	    v: 1,
	    z: 0
	  };
	  instructions = [];
	  path.replace(segment, function(p, command, args) {
	    var type;
	    type = command.toLowerCase();
	    args = args.match(/-?[.0-9]+(?:e[-+]?\d+)?/ig);
	    if (args) {
	      args = args.map(Number);
	    } else {
	      args = [];
	    }
	    if (type === 'm' && args.length > 2) {
	      instructions.push({
	        command: command,
	        params: args.splice(0, 2)
	      });
	      type = 'l';
	      command = command === 'm' ? 'l' : 'L';
	    }
	    while (true) {
	      if (args.length === length[type]) {
	        return instructions.push({
	          command: command,
	          params: args
	        });
	      }
	      if (args.length < length[type]) {
	        throw new Error('Malformed path data');
	      }
	      instructions.push({
	        command: command,
	        params: args.splice(0, length[type])
	      });
	    }
	  });
	  return instructions;
	};
	
	Path.fromString = function(path) {
	  return Path(Path.stringToInstructions(path));
	};
	
	Path.loadPath = function(url) {
	  var data, parser, path, ref1, svg;
	  data = Utils.domLoadDataSync(url);
	  parser = new DOMParser();
	  svg = parser.parseFromString(data, 'image/svg+xml');
	  path = (ref1 = svg.getElementsByTagName('path')) != null ? ref1[0] : void 0;
	  if (!path) {
	    console.error("Path: no <path> elements found in file loaded from URL: '" + url + "'");
	    return null;
	  }
	  if (path) {
	    return Path.fromString(path.getAttribute('d'));
	  }
	};
	
	_.extend(exports, {
	  Path: Path
	});


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, CanvasClass, Events,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	BaseClass = __webpack_require__(6).BaseClass;
	
	Events = __webpack_require__(15).Events;
	
	CanvasClass = (function(superClass) {
	  extend(CanvasClass, superClass);
	
	  function CanvasClass() {
	    this.addListener = bind(this.addListener, this);
	    return CanvasClass.__super__.constructor.apply(this, arguments);
	  }
	
	  CanvasClass.define("width", {
	    get: function() {
	      return window.innerWidth;
	    }
	  });
	
	  CanvasClass.define("height", {
	    get: function() {
	      return window.innerHeight;
	    }
	  });
	
	  CanvasClass.define("size", {
	    get: function() {
	      return {
	        width: this.width,
	        height: this.height
	      };
	    }
	  });
	
	  CanvasClass.define("frame", {
	    get: function() {
	      return {
	        x: 0,
	        y: 0,
	        width: this.width,
	        height: this.height
	      };
	    }
	  });
	
	  CanvasClass.define("backgroundColor", {
	    importable: false,
	    exportable: false,
	    get: function() {
	      return Framer.Device.background.backgroundColor;
	    },
	    set: function(value) {
	      return Framer.Device.background.backgroundColor = value;
	    }
	  });
	
	  CanvasClass.define("image", {
	    importable: false,
	    exportable: false,
	    get: function() {
	      return Framer.Device.background.image;
	    },
	    set: function(value) {
	      return Framer.Device.background.image = value;
	    }
	  });
	
	  CanvasClass.prototype.addListener = function(eventName, listener) {
	    if (eventName === "resize") {
	      Events.wrap(window).addEventListener("resize", (function(_this) {
	        return function() {
	          return _this.emit("resize");
	        };
	      })(this));
	    }
	    return CanvasClass.__super__.addListener.call(this, eventName, listener);
	  };
	
	  CanvasClass.prototype.on = CanvasClass.prototype.addListener;
	
	  CanvasClass.prototype.onResize = function(cb) {
	    return this.on("resize", cb);
	  };
	
	  return CanvasClass;
	
	})(BaseClass);
	
	exports.Canvas = new CanvasClass;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var Context, Utils, printContext, printLayer,
	  slice = [].slice;
	
	Utils = __webpack_require__(4);
	
	Context = __webpack_require__(41).Context;
	
	"\nTodo:\n- Better looks\n- Resizable\n- Live in own space on top of all Framer stuff\n";
	
	printContext = null;
	
	printLayer = null;
	
	exports.print = function() {
	  var args;
	  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	  if (!printContext) {
	    printContext = new Context({
	      name: "Print"
	    });
	  }
	  printContext.run(function() {
	    var printNode, printPrefix, update;
	    if (!printLayer) {
	      printLayer = new Layer;
	      printLayer.scrollVertical = true;
	      printLayer.ignoreEvents = false;
	      printLayer.html = "";
	      printLayer.style = {
	        "font": "12px/1.35em Menlo",
	        "color": "rgba(0,0,0,.7)",
	        "padding": "8px",
	        "padding-bottom": "30px",
	        "border-top": "1px solid #d9d9d9"
	      };
	      printLayer.opacity = 0.9;
	      printLayer.style.zIndex = 999;
	      printLayer.visible = true;
	      printLayer.backgroundColor = "white";
	      update = function() {
	        printLayer.width = window.innerWidth;
	        printLayer.height = 160;
	        return printLayer.maxY = window.innerHeight;
	      };
	      update();
	      printContext.domEventManager.wrap(window).addEventListener("resize", update);
	    }
	    printPrefix = "» ";
	    printNode = document.createElement("div");
	    printNode.innerHTML = _.escape(printPrefix + args.map(function(obj) {
	      return Utils.inspect(obj);
	    }).join(", ")) + "<br>";
	    printNode.style["-webkit-user-select"] = "text";
	    printNode.style["cursor"] = "auto";
	    return printLayer._element.appendChild(printNode);
	  });
	  return Utils.delay(0, function() {
	    return printLayer._element.scrollTop = printLayer._element.scrollHeight;
	  });
	};


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, Config, DOMEventManager, Defaults, Utils, _,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	_ = __webpack_require__(1)._;
	
	Utils = __webpack_require__(4);
	
	Config = __webpack_require__(14).Config;
	
	Defaults = __webpack_require__(17).Defaults;
	
	BaseClass = __webpack_require__(6).BaseClass;
	
	DOMEventManager = __webpack_require__(42).DOMEventManager;
	
	
	/*
	
	An easy way to think of the context is a bucket of things related to a set of layers. There
	is always at least one context on the screen, but often many more. For example, the device has
	a special context and replaces the default one (so it renders in the screen), and the print
	function uses on to draw the console.
	
	The default context lives under Framer.DefaultContext and the current one in
	Framer.CurrentContext. You can create layers in any context by using the run function.
	
	A context keeps track of everyting around those layers, so it can clean it up again. We use
	this a lot in Framer Studio's autocomplete function. Async things like running animations and
	timers get stopped too.
	
	Contexts can live inside another context (with a layer as a parent) so you can only reload
	a part of a prototype. This is mainly how device works.
	
	Another feature is to temporarily freeze/resume a context. If you freeze it, all user event
	will temporarily get blocked so in theory nothing will change in the context. You can restore
	these at any time.
	 */
	
	exports.Context = (function(superClass) {
	  extend(Context, superClass);
	
	  Context.define("parent", {
	    get: function() {
	      return this._parent;
	    }
	  });
	
	  Context.define("element", {
	    get: function() {
	      return this._element;
	    }
	  });
	
	  function Context(options) {
	    if (options == null) {
	      options = {};
	    }
	    options = Defaults.getDefaults("Context", options);
	    Context.__super__.constructor.apply(this, arguments);
	    if (!options.name) {
	      throw Error("Contexts need a name");
	    }
	    this._parent = options.parent;
	    this._name = options.name;
	    this.perspective = options.perspective;
	    this.perspectiveOriginX = options.perspectiveOriginX;
	    this.perspectiveOriginY = options.perspectiveOriginY;
	    this.reset();
	  }
	
	  Context.prototype.reset = function() {
	    this._createDOMEventManager();
	    this._createRootElement();
	    this.resetLayers();
	    this.resetAnimations();
	    this.resetTimers();
	    this.resetIntervals();
	    return this.emit("reset", this);
	  };
	
	  Context.define("layers", {
	    get: function() {
	      return _.clone(this._layers);
	    }
	  });
	
	  Context.define("layerCounter", {
	    get: function() {
	      return this._layerCounter;
	    }
	  });
	
	  Context.prototype.addLayer = function(layer) {
	    if (indexOf.call(this._layers, layer) >= 0) {
	      return;
	    }
	    this._layerCounter++;
	    return this._layers.push(layer);
	  };
	
	  Context.prototype.removeLayer = function(layer) {
	    return this._layers = _.without(this._layers, layer);
	  };
	
	  Context.prototype.resetLayers = function() {
	    this.resetGestures();
	    this._layers = [];
	    return this._layerCounter = 0;
	  };
	
	  Context.define("animations", {
	    get: function() {
	      return _.clone(this._animations);
	    }
	  });
	
	  Context.prototype.addAnimation = function(animation) {
	    if (indexOf.call(this._animations, animation) >= 0) {
	      return;
	    }
	    return this._animations.push(animation);
	  };
	
	  Context.prototype.removeAnimation = function(animation) {
	    return this._animations = _.without(this._animations, animation);
	  };
	
	  Context.prototype.resetAnimations = function() {
	    this.stopAnimations();
	    return this._animations = [];
	  };
	
	  Context.prototype.stopAnimations = function() {
	    if (!this._animations) {
	      return;
	    }
	    return this._animations.map(function(animation) {
	      return animation.stop(true);
	    });
	  };
	
	  Context.define("timers", {
	    get: function() {
	      return _.clone(this._timers);
	    }
	  });
	
	  Context.prototype.addTimer = function(timer) {
	    if (indexOf.call(this._timers, timer) >= 0) {
	      return;
	    }
	    return this._timers.push(timer);
	  };
	
	  Context.prototype.removeTimer = function(timer) {
	    return this._timers = _.without(this._timers, timer);
	  };
	
	  Context.prototype.resetTimers = function() {
	    if (this._timers) {
	      this._timers.map(window.clearTimeout);
	    }
	    return this._timers = [];
	  };
	
	  Context.define("intervals", {
	    get: function() {
	      return _.clone(this._intervals);
	    }
	  });
	
	  Context.prototype.addInterval = function(interval) {
	    if (indexOf.call(this._intervals, interval) >= 0) {
	      return;
	    }
	    return this._intervals.push(interval);
	  };
	
	  Context.prototype.removeInterval = function(interval) {
	    return this._intervals = _.without(this._intervals, interval);
	  };
	
	  Context.prototype.resetIntervals = function() {
	    if (this._intervals) {
	      this._intervals.map(window.clearInterval);
	    }
	    return this._intervals = [];
	  };
	
	  Context.prototype.resetGestures = function() {
	    var i, layer, len, ref;
	    if (!this._layers) {
	      return;
	    }
	    ref = this._layers;
	    for (i = 0, len = ref.length; i < len; i++) {
	      layer = ref[i];
	      if (layer._gestures) {
	        layer._gestures.destroy();
	      }
	    }
	  };
	
	  Context.prototype.run = function(fn) {
	    var previousContext;
	    previousContext = Framer.CurrentContext;
	    Framer.CurrentContext = this;
	    fn();
	    return Framer.CurrentContext = previousContext;
	  };
	
	  Context.prototype.freeze = function() {
	    var eventName, i, j, layer, layerId, layerListeners, len, len1, ref, ref1;
	    if (this._frozenEvents != null) {
	      throw new Error("Context is already frozen");
	    }
	    this._frozenEvents = {};
	    ref = this._layers;
	    for (i = 0, len = ref.length; i < len; i++) {
	      layer = ref[i];
	      layerListeners = {};
	      ref1 = layer.listenerEvents();
	      for (j = 0, len1 = ref1.length; j < len1; j++) {
	        eventName = ref1[j];
	        layerListeners[eventName] = layer.listeners(eventName);
	      }
	      layer.removeAllListeners();
	      layerId = this._layers.indexOf(layer);
	      this._frozenEvents[layerId] = layerListeners;
	    }
	    this.stopAnimations();
	    this.resetTimers();
	    return this.resetIntervals();
	  };
	
	  Context.prototype.resume = function() {
	    var eventName, events, i, layer, layerId, len, listener, listeners, ref;
	    if (this._frozenEvents == null) {
	      throw new Error("Context is not frozen, cannot resume");
	    }
	    ref = this._frozenEvents;
	    for (layerId in ref) {
	      events = ref[layerId];
	      layer = this._layers[layerId];
	      for (eventName in events) {
	        listeners = events[eventName];
	        for (i = 0, len = listeners.length; i < len; i++) {
	          listener = listeners[i];
	          layer.on(eventName, listener);
	        }
	      }
	    }
	    return delete this._frozenEvents;
	  };
	
	  Context.prototype._createDOMEventManager = function() {
	    var ref;
	    if ((ref = this.domEventManager) != null) {
	      ref.reset();
	    }
	    return this.domEventManager = new DOMEventManager;
	  };
	
	  Context.prototype._createRootElement = function() {
	    this._destroyRootElement();
	    this._element = document.createElement("div");
	    this._element.id = "FramerContextRoot-" + this._name;
	    this._element.classList.add("framerContext");
	    this._element.style["webkitPerspective"] = this.perspective;
	    this._element.style["backgroundColor"] = this.backgroundColor;
	    this.__pendingElementAppend = (function(_this) {
	      return function() {
	        var parentElement, ref;
	        parentElement = (ref = _this._parent) != null ? ref._element : void 0;
	        if (parentElement == null) {
	          parentElement = document.body;
	        }
	        return parentElement.appendChild(_this._element);
	      };
	    })(this);
	    return Utils.domComplete(this.__pendingElementAppend);
	  };
	
	  Context.prototype._destroyRootElement = function() {
	    var ref;
	    if ((ref = this._element) != null ? ref.parentNode : void 0) {
	      this._element.parentNode.removeChild(this._element);
	    }
	    if (this.__pendingElementAppend) {
	      Utils.domCompleteCancel(this.__pendingElementAppend);
	      this.__pendingElementAppend = null;
	    }
	    return this._element = null;
	  };
	
	  Context.define("width", {
	    get: function() {
	      if (this.parent != null) {
	        return this.parent.width;
	      }
	      return window.innerWidth;
	    }
	  });
	
	  Context.define("height", {
	    get: function() {
	      if (this.parent != null) {
	        return this.parent.height;
	      }
	      return window.innerHeight;
	    }
	  });
	
	  Context.define("frame", {
	    get: function() {
	      return {
	        x: 0,
	        y: 0,
	        width: this.width,
	        height: this.height
	      };
	    }
	  });
	
	  Context.define("size", {
	    get: function() {
	      return _.pick(this.frame, ["width", "height"]);
	    }
	  });
	
	  Context.define("point", {
	    get: function() {
	      return _.pick(this.frame, ["x", "y"]);
	    }
	  });
	
	  Context.define("canvasFrame", {
	    get: function() {
	      if (this.parent == null) {
	        return this.frame;
	      }
	      return this.parent.canvasFrame;
	    }
	  });
	
	  Context.define("backgroundColor", {
	    get: function() {
	      if (Color.isColor(this._backgroundColor)) {
	        return this._backgroundColor;
	      }
	      return "transparent";
	    },
	    set: function(value) {
	      var ref;
	      if (Color.isColor(value)) {
	        this._backgroundColor = value;
	        return (ref = this._element) != null ? ref.style["backgroundColor"] = new Color(value.toString()) : void 0;
	      }
	    }
	  });
	
	  Context.define("perspective", {
	    get: function() {
	      return this._perspective;
	    },
	    set: function(value) {
	      var ref;
	      if (_.isNumber(value)) {
	        this._perspective = value;
	        return (ref = this._element) != null ? ref.style["webkitPerspective"] = this._perspective : void 0;
	      }
	    }
	  });
	
	  Context.prototype._updatePerspective = function() {
	    var ref;
	    return (ref = this._element) != null ? ref.style["webkitPerspectiveOrigin"] = (this.perspectiveOriginX * 100) + "% " + (this.perspectiveOriginY * 100) + "%" : void 0;
	  };
	
	  Context.define("perspectiveOriginX", {
	    get: function() {
	      if (_.isNumber(this._perspectiveOriginX)) {
	        return this._perspectiveOriginX;
	      }
	      return 0.5;
	    },
	    set: function(value) {
	      if (_.isNumber(value)) {
	        this._perspectiveOriginX = value;
	        return this._updatePerspective();
	      }
	    }
	  });
	
	  Context.define("perspectiveOriginY", {
	    get: function() {
	      if (_.isNumber(this._perspectiveOriginY)) {
	        return this._perspectiveOriginY;
	      }
	      return .5;
	    },
	    set: function(value) {
	      if (_.isNumber(value)) {
	        this._perspectiveOriginY = value;
	        return this._updatePerspective();
	      }
	    }
	  });
	
	  Context.prototype.toInspect = function() {
	    var round;
	    round = function(value) {
	      if (parseInt(value) === value) {
	        return parseInt(value);
	      }
	      return Utils.round(value, 1);
	    };
	    return "<" + this.constructor.name + " id:" + this.id + " name:" + this._name + " " + (round(this.width)) + "x" + (round(this.height)) + ">";
	  };
	
	  return Context;
	
	})(BaseClass);


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var DOMEventManagerElement, EventEmitter, EventManagerIdCounter, Utils, _,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	
	_ = __webpack_require__(1)._;
	
	EventEmitter = __webpack_require__(7).EventEmitter;
	
	Utils = __webpack_require__(4);
	
	EventManagerIdCounter = 0;
	
	DOMEventManagerElement = (function(superClass) {
	  extend(DOMEventManagerElement, superClass);
	
	  function DOMEventManagerElement(element1) {
	    this.element = element1;
	  }
	
	  DOMEventManagerElement.prototype.addListener = function(eventName, listener, capture) {
	    if (capture == null) {
	      capture = false;
	    }
	    DOMEventManagerElement.__super__.addListener.call(this, eventName, listener);
	    return this.element.addEventListener(eventName, listener, false);
	  };
	
	  DOMEventManagerElement.prototype.removeListener = function(eventName, listener) {
	    DOMEventManagerElement.__super__.removeListener.call(this, eventName, listener);
	    return this.element.removeEventListener(eventName, listener, false);
	  };
	
	  DOMEventManagerElement.prototype.addEventListener = DOMEventManagerElement.prototype.addListener;
	
	  DOMEventManagerElement.prototype.removeEventListener = DOMEventManagerElement.prototype.removeListener;
	
	  return DOMEventManagerElement;
	
	})(EventEmitter);
	
	exports.DOMEventManager = (function() {
	  function DOMEventManager(element) {
	    this.wrap = bind(this.wrap, this);
	    this._elements = {};
	  }
	
	  DOMEventManager.prototype.wrap = function(element) {
	    if (!element._eventManagerId) {
	      element._eventManagerId = EventManagerIdCounter++;
	    }
	    if (!this._elements[element._eventManagerId]) {
	      this._elements[element._eventManagerId] = new DOMEventManagerElement(element);
	    }
	    return this._elements[element._eventManagerId];
	  };
	
	  DOMEventManager.prototype.reset = function() {
	    var element, elementEventManager, ref, results;
	    ref = this._elements;
	    results = [];
	    for (element in ref) {
	      elementEventManager = ref[element];
	      results.push(elementEventManager.removeAllListeners());
	    }
	    return results;
	  };
	
	  return DOMEventManager;

	})();


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var EventMappers, Events, Layer, Utils, _, wrapComponent,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  slice = [].slice,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	_ = __webpack_require__(1)._;
	
	Utils = __webpack_require__(4);
	
	Layer = __webpack_require__(13).Layer;
	
	Events = __webpack_require__(15).Events;
	
	"ScrollComponent\n\ncontent <Layer>\ncontentSize <{width:n, height:n}>\ncontentInset <{top:n, right:n, bottom:n, left:n}> TODO\ncontentOffset <{x:n, y:n}> TODO\nscrollFrame <{x:n, y:n, width:n, height:n}>\nscrollPoint <{x:n, y:n}>\nscrollHorizontal <bool>\nscrollVertical <bool>\nspeedX <number>\nspeedY <number>\ndelaysContentTouches <bool> TODO\nloadPreset(<\"ios\"|\"android\">) TODO\nscrollToPoint(<{x:n, y:n}>, animate=true, animationOptions={})\nscrollToLayer(contentLayer, originX=0, originY=0)\nscrollFrameForContentLayer(<x:n, y:n>) <{x:n, y:n, width:n, height:n}> TODO\nclosestContentLayer(<x:n, y:n>) <Layer> TODO\n\nScrollComponent Events\n\n(all of the draggable events)\nScrollStart -> DragStart\nScrollWillMove -> DragWillMove\nScrollDidMove -> DragDidMove\nscroll -> DragMove (html compat)\nScrollEnd -> DragEnd";
	
	Events.ScrollStart = "scrollstart";
	
	Events.Scroll = "scroll";
	
	Events.ScrollMove = Events.Scroll;
	
	Events.ScrollEnd = "scrollend";
	
	Events.ScrollAnimationDidStart = "scrollanimationdidstart";
	
	Events.ScrollAnimationDidEnd = "scrollanimationdidend";
	
	EventMappers = {};
	
	EventMappers[Events.Move] = Events.Move;
	
	EventMappers[Events.ScrollStart] = Events.DragStart;
	
	EventMappers[Events.ScrollMove] = Events.DragMove;
	
	EventMappers[Events.ScrollEnd] = Events.DragEnd;
	
	EventMappers[Events.ScrollAnimationDidStart] = Events.DragAnimationStart;
	
	EventMappers[Events.ScrollAnimationDidEnd] = Events.DragAnimationEnd;
	
	EventMappers[Events.DirectionLockStart] = Events.DirectionLockStart;
	
	exports.ScrollComponent = (function(superClass) {
	  extend(ScrollComponent, superClass);
	
	  ScrollComponent.define("velocity", ScrollComponent.proxyProperty("content.draggable.velocity", {
	    importable: false
	  }));
	
	  ScrollComponent.define("scrollHorizontal", ScrollComponent.proxyProperty("content.draggable.horizontal"));
	
	  ScrollComponent.define("scrollVertical", ScrollComponent.proxyProperty("content.draggable.vertical"));
	
	  ScrollComponent.define("speedX", ScrollComponent.proxyProperty("content.draggable.speedX"));
	
	  ScrollComponent.define("speedY", ScrollComponent.proxyProperty("content.draggable.speedY"));
	
	  ScrollComponent.define("isDragging", ScrollComponent.proxyProperty("content.draggable.isDragging", {
	    importable: false
	  }));
	
	  ScrollComponent.define("isMoving", ScrollComponent.proxyProperty("content.draggable.isMoving", {
	    importable: false
	  }));
	
	  ScrollComponent.define("propagateEvents", ScrollComponent.proxyProperty("content.draggable.propagateEvents"));
	
	  ScrollComponent.define("directionLock", ScrollComponent.proxyProperty("content.draggable.directionLock"));
	
	  ScrollComponent.define("directionLockThreshold", ScrollComponent.proxyProperty("content.draggable.directionLockThreshold"));
	
	  ScrollComponent.define("content", {
	    importable: false,
	    exportable: false,
	    get: function() {
	      return this._content;
	    }
	  });
	
	  ScrollComponent.define("mouseWheelSpeedMultiplier", ScrollComponent.simpleProperty("mouseWheelSpeedMultiplier", 1));
	
	  function ScrollComponent(options) {
	    if (options == null) {
	      options = {};
	    }
	    this._onMouseWheel = bind(this._onMouseWheel, this);
	    this.updateContent = bind(this.updateContent, this);
	    if (options.clip == null) {
	      options.clip = true;
	    }
	    if (options.mouseWheelEnabled == null) {
	      options.mouseWheelEnabled = false;
	    }
	    if (options.backgroundColor == null) {
	      options.backgroundColor = null;
	    }
	    ScrollComponent.__super__.constructor.call(this, options);
	    this._contentInset = options.contentInset || Utils.rectZero();
	    this.setContentLayer(new Layer);
	    this._applyOptionsAndDefaults(options);
	    this._enableMouseWheelHandling(options.mouseWheelEnabled);
	    if (options.hasOwnProperty("wrap")) {
	      wrapComponent(this, options.wrap);
	    }
	  }
	
	  ScrollComponent.prototype.calculateContentFrame = function() {
	    var contentFrame, size;
	    contentFrame = this.content.contentFrame();
	    return size = {
	      x: 0,
	      y: 0,
	      width: Math.max(this.width, contentFrame.x + contentFrame.width),
	      height: Math.max(this.height, contentFrame.y + contentFrame.height)
	    };
	  };
	
	  ScrollComponent.prototype.setContentLayer = function(layer) {
	    if (this.content) {
	      this._content.destroy();
	    }
	    this._content = layer;
	    this._content.parent = this;
	    this._content.name = "content";
	    this._content.clip = true;
	    this._content.draggable.enabled = true;
	    this._content.draggable.momentum = true;
	    this._content.on("change:children", this.updateContent);
	    this.on("change:width", this.updateContent);
	    this.on("change:height", this.updateContent);
	    this.updateContent();
	    this.scrollPoint = {
	      x: 0,
	      y: 0
	    };
	    return this._content;
	  };
	
	  ScrollComponent.prototype.updateContent = function() {
	    var constraintsFrame, contentFrame, ref;
	    if (!this.content) {
	      return;
	    }
	    contentFrame = this.calculateContentFrame();
	    this.content.width = contentFrame.width;
	    this.content.height = contentFrame.height;
	    constraintsFrame = this.calculateContentFrame();
	    constraintsFrame = {
	      x: -constraintsFrame.width + this.width - this._contentInset.right,
	      y: -constraintsFrame.height + this.height - this._contentInset.bottom,
	      width: constraintsFrame.width + constraintsFrame.width - this.width + this._contentInset.left + this._contentInset.right,
	      height: constraintsFrame.height + constraintsFrame.height - this.height + this._contentInset.top + this._contentInset.bottom
	    };
	    this.content.draggable.constraints = constraintsFrame;
	    if (this.content.children.length) {
	      if ((ref = this.content.backgroundColor) != null ? ref.isEqual(Framer.Defaults.Layer.backgroundColor) : void 0) {
	        return this.content.backgroundColor = null;
	      }
	    }
	  };
	
	  ScrollComponent.define("scroll", {
	    exportable: false,
	    get: function() {
	      return this.scrollHorizontal === true || this.scrollVertical === true;
	    },
	    set: function(value) {
	      if (!this.content) {
	        return;
	      }
	      if (value === false) {
	        this.content.animateStop();
	      }
	      return this.scrollHorizontal = this.scrollVertical = value;
	    }
	  });
	
	  ScrollComponent.prototype._calculateContentPoint = function(scrollPoint) {
	    var point;
	    scrollPoint = _.defaults(scrollPoint, {
	      x: 0,
	      y: 0
	    });
	    scrollPoint.x -= this.contentInset.left;
	    scrollPoint.y -= this.contentInset.top;
	    point = this._pointInConstraints(scrollPoint);
	    return Utils.pointInvert(point);
	  };
	
	  ScrollComponent.define("scrollX", {
	    get: function() {
	      if (!this.content) {
	        return 0;
	      }
	      return 0 - this.content.x + this.contentInset.left;
	    },
	    set: function(value) {
	      if (!this.content) {
	        return;
	      }
	      this.content.draggable.animateStop();
	      return this.content.x = this._calculateContentPoint({
	        x: value,
	        y: 0
	      }).x;
	    }
	  });
	
	  ScrollComponent.define("scrollY", {
	    get: function() {
	      if (!this.content) {
	        return 0;
	      }
	      return 0 - this.content.y + this.contentInset.top;
	    },
	    set: function(value) {
	      if (!this.content) {
	        return;
	      }
	      this.content.draggable.animateStop();
	      return this.content.y = this._calculateContentPoint({
	        x: 0,
	        y: value
	      }).y;
	    }
	  });
	
	  ScrollComponent.define("scrollPoint", {
	    importable: true,
	    exportable: false,
	    get: function() {
	      var point;
	      return point = {
	        x: this.scrollX,
	        y: this.scrollY
	      };
	    },
	    set: function(point) {
	      if (!this.content) {
	        return;
	      }
	      this.scrollX = point.x;
	      return this.scrollY = point.y;
	    }
	  });
	
	  ScrollComponent.define("scrollFrame", {
	    importable: true,
	    exportable: false,
	    get: function() {
	      var rect;
	      rect = this.scrollPoint;
	      rect.width = this.width;
	      rect.height = this.height;
	      return rect;
	    },
	    set: function(value) {
	      return this.scrollPoint = value;
	    }
	  });
	
	  ScrollComponent.define("contentInset", {
	    get: function() {
	      return _.clone(this._contentInset);
	    },
	    set: function(contentInset) {
	      this._contentInset = Utils.rectZero(Utils.parseRect(contentInset));
	      return this.updateContent();
	    }
	  });
	
	  ScrollComponent.define("direction", {
	    importable: false,
	    exportable: false,
	    get: function() {
	      var direction;
	      direction = this.content.draggable.direction;
	      if (direction === "down") {
	        return "up";
	      }
	      if (direction === "up") {
	        return "down";
	      }
	      if (direction === "right") {
	        return "left";
	      }
	      if (direction === "left") {
	        return "right";
	      }
	      return direction;
	    }
	  });
	
	  ScrollComponent.define("angle", {
	    importable: false,
	    exportable: false,
	    get: function() {
	      if (!this.content) {
	        return 0;
	      }
	      return -this.content.draggable.angle;
	    }
	  });
	
	  ScrollComponent.prototype.scrollToPoint = function(point, animate, animationOptions) {
	    var contentPoint;
	    if (animate == null) {
	      animate = true;
	    }
	    if (animationOptions == null) {
	      animationOptions = {
	        curve: "spring(500,50,0)"
	      };
	    }
	    contentPoint = this._calculateContentPoint(point);
	    this.content.draggable.animateStop();
	    if (animate) {
	      point = {};
	      if (contentPoint.hasOwnProperty("x")) {
	        point.x = contentPoint.x;
	      }
	      if (contentPoint.hasOwnProperty("y")) {
	        point.y = contentPoint.y;
	      }
	      animationOptions.properties = point;
	      this.content.animateStop();
	      return this.content.animate(animationOptions);
	    } else {
	      return this.content.point = contentPoint;
	    }
	  };
	
	  ScrollComponent.prototype.scrollToTop = function(animate, animationOptions) {
	    if (animate == null) {
	      animate = true;
	    }
	    if (animationOptions == null) {
	      animationOptions = {
	        curve: "spring(500,50,0)"
	      };
	    }
	    return this.scrollToPoint({
	      x: 0,
	      y: 0
	    }, animate, animationOptions);
	  };
	
	  ScrollComponent.prototype.scrollToLayer = function(contentLayer, originX, originY, animate, animationOptions) {
	    var scrollPoint;
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    if (animate == null) {
	      animate = true;
	    }
	    if (animationOptions == null) {
	      animationOptions = {
	        curve: "spring(500,50,0)"
	      };
	    }
	    if (contentLayer && contentLayer.parent !== this.content) {
	      throw Error("Can't scroll to this layer because it's not in the ScrollComponent. Add it to the content like layer.parent = scroll.content.");
	    }
	    if (!contentLayer || this.content.children.length === 0) {
	      scrollPoint = {
	        x: 0,
	        y: 0
	      };
	    } else {
	      scrollPoint = this._scrollPointForLayer(contentLayer, originX, originY);
	      scrollPoint.x -= this.width * originX;
	      scrollPoint.y -= this.height * originY;
	    }
	    this.scrollToPoint(scrollPoint, animate, animationOptions);
	    return contentLayer;
	  };
	
	  ScrollComponent.prototype.scrollToClosestLayer = function(originX, originY, animate, animationOptions) {
	    var closestLayer;
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    if (animate == null) {
	      animate = true;
	    }
	    if (animationOptions == null) {
	      animationOptions = {
	        curve: "spring(500,50,0)"
	      };
	    }
	    closestLayer = this.closestContentLayer(originX, originY, animate, animationOptions);
	    if (closestLayer) {
	      this.scrollToLayer(closestLayer, originX, originY);
	      return closestLayer;
	    } else {
	      if (!closestLayer) {
	        this.scrollToPoint({
	          x: 0,
	          y: 0
	        });
	      }
	      return null;
	    }
	  };
	
	  ScrollComponent.prototype.closestContentLayer = function(originX, originY) {
	    var scrollPoint;
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    scrollPoint = Utils.framePointForOrigin(this.scrollFrame, originX, originY);
	    return this.closestContentLayerForScrollPoint(scrollPoint, originX, originY);
	  };
	
	  ScrollComponent.prototype.closestContentLayerForScrollPoint = function(scrollPoint, originX, originY) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    return _.first(this._contentLayersSortedByDistanceForScrollPoint(scrollPoint, originX, originY));
	  };
	
	  ScrollComponent.prototype._scrollPointForLayer = function(layer, originX, originY, clamp) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    if (clamp == null) {
	      clamp = true;
	    }
	    return Utils.framePointForOrigin(layer, originX, originY);
	  };
	
	  ScrollComponent.prototype._contentLayersSortedByDistanceForScrollPoint = function(scrollPoint, originX, originY) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    return Utils.frameSortByAbsoluteDistance(scrollPoint, this.content.children, originX, originY);
	  };
	
	  ScrollComponent.prototype._pointInConstraints = function(point) {
	    var maxX, maxY, minX, minY, ref;
	    ref = this.content.draggable._calculateConstraints(this.content.draggable.constraints), minX = ref.minX, maxX = ref.maxX, minY = ref.minY, maxY = ref.maxY;
	    point = {
	      x: -Utils.clamp(-point.x, minX, maxX),
	      y: -Utils.clamp(-point.y, minY, maxY)
	    };
	    return point;
	  };
	
	  ScrollComponent.prototype.addListener = function() {
	    var eventName, eventNames, i, j, len, listener, results;
	    eventNames = 2 <= arguments.length ? slice.call(arguments, 0, i = arguments.length - 1) : (i = 0, []), listener = arguments[i++];
	    ScrollComponent.__super__.addListener.apply(this, arguments);
	    results = [];
	    for (j = 0, len = eventNames.length; j < len; j++) {
	      eventName = eventNames[j];
	      if (indexOf.call(_.keys(EventMappers), eventName) >= 0) {
	        results.push(this.content.on(EventMappers[eventName], listener));
	      } else {
	        results.push(void 0);
	      }
	    }
	    return results;
	  };
	
	  ScrollComponent.prototype.removeListener = function() {
	    var eventName, eventNames, i, j, len, listener, results;
	    eventNames = 2 <= arguments.length ? slice.call(arguments, 0, i = arguments.length - 1) : (i = 0, []), listener = arguments[i++];
	    ScrollComponent.__super__.removeListener.apply(this, arguments);
	    results = [];
	    for (j = 0, len = eventNames.length; j < len; j++) {
	      eventName = eventNames[j];
	      if (indexOf.call(_.keys(EventMappers), eventName) >= 0) {
	        results.push(this.content.off(EventMappers[eventName], listener));
	      } else {
	        results.push(void 0);
	      }
	    }
	    return results;
	  };
	
	  ScrollComponent.prototype.on = ScrollComponent.prototype.addListener;
	
	  ScrollComponent.prototype.off = ScrollComponent.prototype.removeListener;
	
	  ScrollComponent.define("mouseWheelEnabled", {
	    get: function() {
	      return this._mouseWheelEnabled;
	    },
	    set: function(value) {
	      this._mouseWheelEnabled = value;
	      return this._enableMouseWheelHandling(value);
	    }
	  });
	
	  ScrollComponent.prototype._enableMouseWheelHandling = function(enable) {
	    if (enable) {
	      return this.on(Events.MouseWheel, this._onMouseWheel);
	    } else {
	      return this.off(Events.MouseWheel, this._onMouseWheel);
	    }
	  };
	
	  ScrollComponent.prototype._onMouseWheel = function(event) {
	    var maxX, maxY, minX, minY, point, ref;
	    if (!this._mouseWheelScrolling) {
	      this._mouseWheelScrolling = true;
	      this.emit(Events.ScrollStart, event);
	    }
	    this.content.animateStop();
	    ref = this.content.draggable._calculateConstraints(this.content.draggable.constraints), minX = ref.minX, maxX = ref.maxX, minY = ref.minY, maxY = ref.maxY;
	    point = {
	      x: Utils.clamp(this.content.x + (event.wheelDeltaX * this.mouseWheelSpeedMultiplier), minX, maxX),
	      y: Utils.clamp(this.content.y + (event.wheelDeltaY * this.mouseWheelSpeedMultiplier), minY, maxY)
	    };
	    this.content.point = point;
	    this.emit(Events.Scroll, event);
	    return this._onMouseWheelEnd(event);
	  };
	
	  ScrollComponent.prototype._onMouseWheelEnd = Utils.debounce(0.3, function(event) {
	    this.emit(Events.ScrollEnd, event);
	    return this._mouseWheelScrolling = false;
	  });
	
	  ScrollComponent.prototype.copy = function() {
	    var contentLayer, copy;
	    copy = ScrollComponent.__super__.copy.apply(this, arguments);
	    contentLayer = _.first(_.without(copy.children, copy.content));
	    copy.setContentLayer(contentLayer);
	    copy.props = this.props;
	    return copy;
	  };
	
	  ScrollComponent.wrap = function(layer, options) {
	    return wrapComponent(new this(options), layer, options);
	  };
	
	  return ScrollComponent;
	
	})(Layer);
	
	wrapComponent = function(instance, layer, options) {
	  var i, l, len, ref, ref1, screenFrame, scroll, wrapper;
	  if (options == null) {
	    options = {
	      correct: true
	    };
	  }
	  if (!(layer instanceof Layer)) {
	    throw new Error("ScrollComponent.wrap expects a layer, not " + layer + ". Are you sure the layer exists?");
	  }
	  scroll = instance;
	  if (options.correct === true) {
	    if (layer.children.length === 0) {
	      wrapper = new Layer;
	      wrapper.name = "ScrollComponent";
	      wrapper.frame = layer.frame;
	      layer.parent = wrapper;
	      layer.x = layer.y = 0;
	      layer = wrapper;
	    }
	  }
	  scroll.frame = layer.frame;
	  scroll.parent = layer.parent;
	  scroll.index = layer.index;
	  if (layer.name && layer.name !== "") {
	    scroll.name = layer.name;
	  } else if ((ref = layer.__framerInstanceInfo) != null ? ref.name : void 0) {
	    scroll.name = layer.__framerInstanceInfo.name;
	  }
	  if (layer.image) {
	    scroll.image = layer.image;
	    layer.image = null;
	  }
	  if (instance.constructor.name === "PageComponent") {
	    ref1 = layer.children;
	    for (i = 0, len = ref1.length; i < len; i++) {
	      l = ref1[i];
	      scroll.addPage(l);
	    }
	  } else {
	    scroll.setContentLayer(layer);
	  }
	  if (options.correct === true) {
	    screenFrame = scroll.screenFrame;
	    if (screenFrame.x < Screen.width) {
	      if (screenFrame.x + screenFrame.width > Screen.width) {
	        scroll.width = Screen.width - screenFrame.x;
	      }
	    }
	    if (screenFrame.y < Screen.height) {
	      if (screenFrame.y + screenFrame.height > Screen.height) {
	        scroll.height = Screen.height - screenFrame.y;
	      }
	    }
	  }
	  return scroll;
	};


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var Events, ScrollComponent,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	Events = __webpack_require__(15).Events;
	
	ScrollComponent = __webpack_require__(43).ScrollComponent;
	
	"PageComponent\n\noriginX <number>\noriginY <number>\n\nvelocityThreshold <number>\nanimationOptions <animationOptions={}>\ncurrentPage <Layer>\nclosestPage(<originX:n, originY:n>) <Layer>\n\nnextPage(direction=\"\", currentPage)\nsnapToNextPage(direction=\"\", animate, animationOptions={})\n";
	
	exports.PageComponent = (function(superClass) {
	  extend(PageComponent, superClass);
	
	  PageComponent.define("originX", PageComponent.simpleProperty("originX", .5));
	
	  PageComponent.define("originY", PageComponent.simpleProperty("originY", .5));
	
	  PageComponent.define("velocityThreshold", PageComponent.simpleProperty("velocityThreshold", 0.1));
	
	  PageComponent.define("animationOptions", PageComponent.simpleProperty("animationOptions", {
	    curve: "spring(500,50,0)"
	  }));
	
	  function PageComponent() {
	    this._resetHistory = bind(this._resetHistory, this);
	    this._scrollEnd = bind(this._scrollEnd, this);
	    this._onAnimationStop = bind(this._onAnimationStop, this);
	    this._onAnimationStep = bind(this._onAnimationStep, this);
	    this._onAnimationStart = bind(this._onAnimationStart, this);
	    this._scrollMove = bind(this._scrollMove, this);
	    this._scrollStart = bind(this._scrollStart, this);
	    PageComponent.__super__.constructor.apply(this, arguments);
	    this.content.draggable.momentum = false;
	    this.content.draggable.bounce = false;
	    this.on(Events.ScrollStart, this._scrollStart);
	    this.on(Events.ScrollEnd, this._scrollEnd);
	    this.content.on("change:frame", _.debounce(this._scrollMove, 16));
	    this.content.on("change:children", this._resetHistory);
	    this._resetHistory();
	  }
	
	  PageComponent.define("closestPage", {
	    get: function() {
	      return this.closestContentLayerForScrollPoint(this._originScrollPoint(), this.originX, this.originY);
	    }
	  });
	
	  PageComponent.define("currentPage", {
	    get: function() {
	      return _.last(this._previousPages);
	    }
	  });
	
	  PageComponent.define("previousPage", {
	    get: function() {
	      return this._previousPages[this._previousPages.length - 2];
	    }
	  });
	
	  PageComponent.prototype.nextPage = function(direction, currentPage, withoutCurrentPage) {
	    var layers, point;
	    if (direction == null) {
	      direction = "right";
	    }
	    if (currentPage == null) {
	      currentPage = null;
	    }
	    if (withoutCurrentPage == null) {
	      withoutCurrentPage = true;
	    }
	    if (currentPage == null) {
	      currentPage = this.currentPage;
	    }
	    point = {
	      x: 0,
	      y: 0
	    };
	    if (currentPage) {
	      point = Utils.framePointForOrigin(currentPage, this.originX, this.originY);
	    }
	    if (!withoutCurrentPage) {
	      point = {
	        x: this.scrollX + (this.originX * this.width),
	        y: this.scrollY + (this.originY * this.height)
	      };
	    }
	    if (direction === "up" || direction === "top" || direction === "north") {
	      layers = this.content.childrenAbove(point, this.originX, this.originY);
	    }
	    if (direction === "down" || direction === "bottom" || direction === "south") {
	      layers = this.content.childrenBelow(point, this.originX, this.originY);
	    }
	    if (direction === "left" || direction === "west") {
	      layers = this.content.childrenLeft(point, this.originX, this.originY);
	    }
	    if (direction === "right" || direction === "east") {
	      layers = this.content.childrenRight(point, this.originX, this.originY);
	    }
	    if (withoutCurrentPage) {
	      layers = _.without(layers, currentPage);
	    }
	    layers = Utils.frameSortByAbsoluteDistance(point, layers, this.originX, this.originY);
	    return _.first(layers);
	  };
	
	  PageComponent.prototype.snapToPage = function(page, animate, animationOptions) {
	    if (animate == null) {
	      animate = true;
	    }
	    if (animationOptions == null) {
	      animationOptions = null;
	    }
	    this.scrollToLayer(page, this.originX, this.originY, animate, animationOptions);
	    if (this.currentPage !== page) {
	      this._previousPages.push(page);
	      this.emit("change:previousPage", this.previousPage);
	      return this.emit("change:currentPage", this.currentPage);
	    }
	  };
	
	  PageComponent.prototype.snapToNextPage = function(direction, animate, animationOptions) {
	    var nextPage;
	    if (direction == null) {
	      direction = "right";
	    }
	    if (animate == null) {
	      animate = true;
	    }
	    if (animationOptions == null) {
	      animationOptions = null;
	    }
	    if (animationOptions == null) {
	      animationOptions = this.animationOptions;
	    }
	    nextPage = this.nextPage(direction);
	    if (nextPage == null) {
	      nextPage = this.closestPage;
	    }
	    return this.snapToPage(nextPage, animate, animationOptions);
	  };
	
	  PageComponent.prototype.snapToPreviousPage = function() {
	    if (!this.previousPage) {
	      return;
	    }
	    this.snapToPage(this.previousPage);
	    return this._previousPages = this._previousPages.slice(0, +(this._previousPages.length - 3) + 1 || 9e9);
	  };
	
	  PageComponent.prototype.addPage = function(page, direction) {
	    var directions, point, ref;
	    if (direction == null) {
	      direction = "right";
	    }
	    directions = ["down", "bottom", "south"] + ["right", "east"];
	    if (ref = !direction, indexOf.call(directions, ref) >= 0) {
	      direction = "right";
	      throw new Error(direction + " should be in " + directions);
	    }
	    point = page.point;
	    if (this.content.children.length) {
	      if (direction === "right" || direction === "east") {
	        point.x = Utils.frameGetMaxX(this.content.contentFrame());
	      }
	      if (direction === "down" || direction === "bottom" || direction === "south") {
	        point.y = Utils.frameGetMaxY(this.content.contentFrame());
	      }
	    }
	    page.point = point;
	    if (page.parent !== this.content) {
	      return page.parent = this.content;
	    } else {
	      return this.updateContent();
	    }
	  };
	
	  PageComponent.prototype.setContentLayer = function(contentLayer) {
	    if (this.content) {
	      this._onAnimationStop();
	      this.content.off(Events.AnimationStart, this._onAnimationStart);
	      this.content.off(Events.AnimationStop, this._onAnimationStop);
	    }
	    PageComponent.__super__.setContentLayer.call(this, contentLayer);
	    this.content.on(Events.AnimationStart, this._onAnimationStart);
	    return this.content.on(Events.AnimationStop, this._onAnimationStop);
	  };
	
	  PageComponent.prototype.horizontalPageIndex = function(page) {
	    return (_.sortBy(this.content.children, function(l) {
	      return l.x;
	    })).indexOf(page);
	  };
	
	  PageComponent.prototype.verticalPageIndex = function(page) {
	    return (_.sortBy(this.content.children, function(l) {
	      return l.y;
	    })).indexOf(page);
	  };
	
	  PageComponent.prototype._scrollStart = function() {
	    return this._currentPage = this.currentPage;
	  };
	
	  PageComponent.prototype._scrollMove = function() {
	    var currentPage;
	    currentPage = this.currentPage;
	    if (currentPage !== _.last(this._previousPages) && currentPage !== (void 0)) {
	      this._previousPages.push(currentPage);
	      return this.emit("change:currentPage", {
	        old: this.previousPage,
	        "new": currentPage
	      });
	    }
	  };
	
	  PageComponent.prototype._onAnimationStart = function() {
	    this._isMoving = true;
	    this._isAnimating = true;
	    return this.content.on("change:frame", this._onAnimationStep);
	  };
	
	  PageComponent.prototype._onAnimationStep = function() {
	    return this.emit(Events.Move, this.content.point);
	  };
	
	  PageComponent.prototype._onAnimationStop = function() {
	    this._isMoving = false;
	    this._isAnimating = false;
	    return this.content.off("change:frame", this._onAnimationStep);
	  };
	
	  PageComponent.prototype._scrollEnd = function() {
	    var end, nextPage, start, velocity, xDisabled, xLock, yDisabled, yLock;
	    if (this.content.isAnimating) {
	      return;
	    }
	    velocity = this.content.draggable.velocity;
	    xDisabled = !this.scrollHorizontal && (this.direction === "right" || this.direction === "left");
	    yDisabled = !this.scrollVertical && (this.direction === "down" || this.direction === "up");
	    xLock = this.content.draggable._directionLockEnabledX && (this.direction === "right" || this.direction === "left");
	    yLock = this.content.draggable._directionLockEnabledY && (this.direction === "down" || this.direction === "up");
	    if (Math.max(Math.abs(velocity.x), Math.abs(velocity.y)) < this.velocityThreshold || xLock || yLock || xDisabled || yDisabled) {
	      start = this.content.draggable._layerStartPoint;
	      end = this.content.draggable.layer.point;
	      if ((start != null) && (end != null)) {
	        if (start.x !== end.x || start.y !== end.y) {
	          this.snapToPage(this.closestPage, true, this.animationOptions);
	          return;
	        }
	      }
	    }
	    nextPage = this.nextPage(this.direction, this._currentPage, false);
	    if (nextPage == null) {
	      nextPage = this.closestPage;
	    }
	    return this.snapToPage(nextPage, true, this.animationOptions);
	  };
	
	  PageComponent.prototype._originScrollPoint = function() {
	    var scrollPoint;
	    scrollPoint = this.scrollPoint;
	    scrollPoint.x += this.width * this.originX;
	    scrollPoint.y += this.height * this.originY;
	    return scrollPoint;
	  };
	
	  PageComponent.prototype._resetHistory = function() {
	    this._currentPage = this.closestPage;
	    return this._previousPages = [this._currentPage];
	  };
	
	  return PageComponent;
	
	})(ScrollComponent);


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var Events, Knob, Layer, Utils,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	
	Utils = __webpack_require__(4);
	
	Layer = __webpack_require__(13).Layer;
	
	Events = __webpack_require__(15).Events;
	
	"SliderComponent\n\nknob <layer>\nknobSize <width, height>\nfill <layer>\nmin <number>\nmax <number>\n\npointForValue(<n>)\nvalueForPoint(<n>)\n\nanimateToValue(value, animationOptions={})";
	
	Events.SliderValueChange = "sliderValueChange";
	
	Knob = (function(superClass) {
	  extend(Knob, superClass);
	
	  function Knob(options) {
	    Knob.__super__.constructor.call(this, options);
	  }
	
	  Knob.define("constrained", Knob.simpleProperty("constrained", false));
	
	  return Knob;
	
	})(Layer);
	
	exports.SliderComponent = (function(superClass) {
	  extend(SliderComponent, superClass);
	
	  function SliderComponent(options) {
	    if (options == null) {
	      options = {};
	    }
	    this._updateValue = bind(this._updateValue, this);
	    this._setOverlayRadius = bind(this._setOverlayRadius, this);
	    this._setRadius = bind(this._setRadius, this);
	    this._updateFrame = bind(this._updateFrame, this);
	    this._updateKnob = bind(this._updateKnob, this);
	    this._updateFill = bind(this._updateFill, this);
	    this._touchEnd = bind(this._touchEnd, this);
	    this._touchMove = bind(this._touchMove, this);
	    this._touchStart = bind(this._touchStart, this);
	    if (options.backgroundColor == null) {
	      options.backgroundColor = "#ccc";
	    }
	    if (options.borderRadius == null) {
	      options.borderRadius = 50;
	    }
	    if (options.clip == null) {
	      options.clip = false;
	    }
	    if (options.width == null) {
	      options.width = 300;
	    }
	    if (options.height == null) {
	      options.height = 10;
	    }
	    if (options.value == null) {
	      options.value = 0;
	    }
	    this.knob = new Knob({
	      backgroundColor: "#fff",
	      shadowY: 1,
	      shadowBlur: 3,
	      shadowColor: "rgba(0,0,0,0.35)",
	      name: "knob"
	    });
	    this.fill = new Layer({
	      backgroundColor: "#333",
	      width: 0,
	      force2d: true,
	      name: "fill"
	    });
	    this.knobOverlay = new Layer({
	      backgroundColor: null,
	      name: "knobOverlay"
	    });
	    this.sliderOverlay = new Layer({
	      backgroundColor: null,
	      name: "sliderOverlay"
	    });
	    SliderComponent.__super__.constructor.call(this, options);
	    this.knobSize = options.knobSize || 30;
	    this.knob.parent = this.fill.parent = this.knobOverlay.parent = this.sliderOverlay.parent = this;
	    if (this.width > this.height) {
	      this.fill.height = this.height;
	    } else {
	      this.fill.width = this.width;
	    }
	    this.knobOverlay.on(Events.Move, function() {
	      if (this.width > this.height) {
	        return this.knob.x = this.x;
	      } else {
	        return this.knob.y = this.y;
	      }
	    });
	    this.fill.borderRadius = this.sliderOverlay.borderRadius = this.borderRadius;
	    this.knob.draggable.enabled = true;
	    this.knob.draggable.overdrag = false;
	    this.knob.draggable.momentum = true;
	    this.knob.draggable.momentumOptions = {
	      friction: 5,
	      tolerance: 0.25
	    };
	    this.knob.draggable.bounce = false;
	    this.knob.borderRadius = this.knobSize / 2;
	    this.knobOverlay.borderRadius = (this.knob.borderRadius * 2) + (this.hitArea / 4);
	    if (!this.hitArea) {
	      this.knobOverlay.destroy();
	      this.sliderOverlay.destroy();
	    }
	    this._updateFrame();
	    this._updateKnob();
	    this._updateFill();
	    this.on("change:size", this._updateFrame);
	    this.on("change:borderRadius", this._setRadius);
	    this.knob.on("change:borderRadius", this._setOverlayRadius);
	    if (this.width > this.height) {
	      this.knob.draggable.speedY = 0;
	      this.knob.on("change:x", this._updateFill);
	    } else {
	      this.knob.draggable.speedX = 0;
	      this.knob.on("change:y", this._updateFill);
	    }
	    this.knob.on("change:size", this._updateKnob);
	    this.knob.on(Events.Move, (function(_this) {
	      return function() {
	        _this._updateFrame();
	        return _this._updateValue();
	      };
	    })(this));
	    this.on(Events.TapStart, this._touchStart);
	    this.on(Events.Pan, this._touchMove);
	    this.on(Events.TapEnd, this._touchEnd);
	  }
	
	  SliderComponent.prototype._touchStart = function(event) {
	    var offsetX, offsetY;
	    event.preventDefault();
	    offsetX = (this.min / this.canvasScaleX()) - this.min;
	    offsetY = (this.min / this.canvasScaleY()) - this.min;
	    if (this.width > this.height) {
	      this.value = this.valueForPoint(Events.touchEvent(event).clientX - this.screenScaledFrame().x) / this.canvasScaleX() - offsetX;
	    } else {
	      this.value = this.valueForPoint(Events.touchEvent(event).clientY - this.screenScaledFrame().y) / this.canvasScaleY() - offsetY;
	    }
	    this.knob.draggable._touchStart(event);
	    return this._updateValue();
	  };
	
	  SliderComponent.prototype._touchMove = function(event) {
	    if (event.target === this._element) {
	      return this.knob.draggable._touchMove(event);
	    }
	  };
	
	  SliderComponent.prototype._touchEnd = function(event) {
	    if (event.target === this._element) {
	      return this.knob.draggable._touchEnd(event);
	    }
	  };
	
	  SliderComponent.prototype._updateFill = function() {
	    if (this.width > this.height) {
	      return this.fill.width = this.knobOverlay.midX = this.knob.midX;
	    } else {
	      return this.fill.height = this.knobOverlay.midY = this.knob.midY;
	    }
	  };
	
	  SliderComponent.prototype._updateKnob = function() {
	    if (this.width > this.height) {
	      this.knob.midX = this.knobOverlay.midX = this.fill.width;
	      return this.knob.centerY();
	    } else {
	      this.knob.midY = this.knobOverlay.midX = this.fill.height;
	      this.knob.centerX();
	      return this.knobOverlay.midY = this.knob.midY;
	    }
	  };
	
	  SliderComponent.prototype._updateFrame = function() {
	    this.knob.draggable.constraints = {
	      x: -this.knob.width / 2,
	      y: -this.knob.height / 2,
	      width: this.width + this.knob.width,
	      height: this.height + this.knob.height
	    };
	    if (this.knob.constrained) {
	      this.knob.draggable.constraints = {
	        x: 0,
	        y: 0,
	        width: this.width,
	        height: this.height
	      };
	    }
	    if (this.width > this.height) {
	      this.fill.height = this.height;
	      this.knob.centerY();
	      this.knobOverlay.centerY();
	    } else {
	      this.fill.width = this.width;
	      this.knob.centerX();
	      this.knobOverlay.centerX();
	    }
	    return this.sliderOverlay.center();
	  };
	
	  SliderComponent.prototype._setRadius = function() {
	    var radius;
	    radius = this.borderRadius;
	    return this.fill.style.borderRadius = radius + "px 0 0 " + radius + "px";
	  };
	
	  SliderComponent.prototype._setOverlayRadius = function() {
	    return this.knobOverlay.borderRadius = (this.knob.borderRadius * 2) + (this.hitArea / 4);
	  };
	
	  SliderComponent.define("knobSize", {
	    get: function() {
	      return this._knobSize;
	    },
	    set: function(value) {
	      this._knobSize = value;
	      this.knob.width = this._knobSize;
	      this.knob.height = this._knobSize;
	      return this._updateFrame();
	    }
	  });
	
	  SliderComponent.define("hitArea", {
	    get: function() {
	      return this._hitArea;
	    },
	    set: function(value) {
	      this._hitArea = value;
	      this.knobOverlay.props = {
	        width: this.knobSize || 30 + this._hitArea,
	        height: this.knobSize || 30 + this._hitArea
	      };
	      return this.sliderOverlay.props = {
	        width: this.width + this._hitArea,
	        height: this.height + this._hitArea
	      };
	    }
	  });
	
	  SliderComponent.define("min", {
	    get: function() {
	      return this._min || 0;
	    },
	    set: function(value) {
	      return this._min = value;
	    }
	  });
	
	  SliderComponent.define("max", {
	    get: function() {
	      return this._max || 1;
	    },
	    set: function(value) {
	      return this._max = value;
	    }
	  });
	
	  SliderComponent.define("value", {
	    get: function() {
	      if (this.width > this.height) {
	        return this.valueForPoint(this.knob.midX);
	      } else {
	        return this.valueForPoint(this.knob.midY);
	      }
	    },
	    set: function(value) {
	      if (this.width > this.height) {
	        this.knob.midX = this.pointForValue(value);
	      } else {
	        this.knob.midY = this.pointForValue(value);
	      }
	      this._updateFill();
	      return this._updateValue();
	    }
	  });
	
	  SliderComponent.prototype._updateValue = function() {
	    this.emit("change:value", this.value);
	    return this.emit(Events.SliderValueChange, this.value);
	  };
	
	  SliderComponent.prototype.pointForValue = function(value) {
	    if (this.width > this.height) {
	      if (this.knob.constrained) {
	        return Utils.modulate(value, [this.min, this.max], [0 + (this.knob.width / 2), this.width - (this.knob.width / 2)], true);
	      } else {
	        return Utils.modulate(value, [this.min, this.max], [0, this.width], true);
	      }
	    } else {
	      if (this.knob.constrained) {
	        return Utils.modulate(value, [this.min, this.max], [0 + (this.knob.height / 2), this.height - (this.knob.height / 2)], true);
	      } else {
	        return Utils.modulate(value, [this.min, this.max], [0, this.height], true);
	      }
	    }
	  };
	
	  SliderComponent.prototype.valueForPoint = function(value) {
	    if (this.width > this.height) {
	      if (this.knob.constrained) {
	        return Utils.modulate(value, [0 + (this.knob.width / 2), this.width - (this.knob.width / 2)], [this.min, this.max], true);
	      } else {
	        return Utils.modulate(value, [0, this.width], [this.min, this.max], true);
	      }
	    } else {
	      if (this.knob.constrained) {
	        return Utils.modulate(value, [0 + (this.knob.height / 2), this.height - (this.knob.height / 2)], [this.min, this.max], true);
	      } else {
	        return Utils.modulate(value, [0, this.height], [this.min, this.max], true);
	      }
	    }
	  };
	
	  SliderComponent.prototype.animateToValue = function(value, animationOptions) {
	    if (animationOptions == null) {
	      animationOptions = {
	        curve: "spring(300,25,0)"
	      };
	    }
	    if (this.width > this.height) {
	      animationOptions.properties = {
	        x: this.pointForValue(value) - (this.knob.width / 2)
	      };
	      this.knob.on("change:x", this._updateValue);
	    } else {
	      animationOptions.properties = {
	        y: this.pointForValue(value) - (this.knob.height / 2)
	      };
	      this.knob.on("change:y", this._updateValue);
	    }
	    return this.knob.animate(animationOptions);
	  };
	
	  SliderComponent.prototype.onValueChange = function(cb) {
	    return this.on(Events.SliderValueChange, cb);
	  };
	
	  return SliderComponent;
	
	})(Layer);


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var AppleWatch38BlackLeatherDevice, AppleWatch38Device, AppleWatch42Device, BaseClass, BuiltInDevices, Defaults, Devices, Events, HTCa9BaseDevice, HTCm8BaseDevice, Layer, MSFTLumia950BaseDevice, Nexus4BaseDevice, Nexus5BaseDevice, Nexus6BaseDevice, Nexus9BaseDevice, SamsungGalaxyNote5BaseDevice, Utils, _, iPadAir2BaseDevice, iPadMini4BaseDevice, iPadProBaseDevice, iPhone5BaseDevice, iPhone5CBaseDevice, iPhone6BaseDevice, iPhone6PlusBaseDevice, newDeviceMinVersion, oldDeviceMaxVersion, old_AppleWatch38Device, old_AppleWatch42Device, old_Nexus5BaseDevice, old_Nexus5BaseDeviceHand, old_Nexus9BaseDevice, old_iPadAirBaseDevice, old_iPadAirBaseDeviceHand, old_iPadMiniBaseDevice, old_iPadMiniBaseDeviceHand, old_iPhone5BaseDevice, old_iPhone5BaseDeviceHand, old_iPhone5CBaseDevice, old_iPhone5CBaseDeviceHand, old_iPhone6BaseDevice, old_iPhone6BaseDeviceHand, old_iPhone6PlusBaseDevice, old_iPhone6PlusBaseDeviceHand,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	Utils = __webpack_require__(4);
	
	_ = __webpack_require__(1)._;
	
	BaseClass = __webpack_require__(6).BaseClass;
	
	Layer = __webpack_require__(13).Layer;
	
	Defaults = __webpack_require__(17).Defaults;
	
	Events = __webpack_require__(15).Events;
	
	
	/*
	
	Device._setup()
	Device._update()
	Device._setupContext()
	
	Device.fullScreen bool
	Device.deviceType str
	Device.padding int
	
	Device.orientation(orientation:float)
	Device.orientationName landscape|portrait|unknown
	Device.rotateLeft()
	Device.rotateRight()
	
	Device.setDeviceScale(zoom:float, animate:bool)
	Device.setContentScale(zoom:float, animate:bool)
	
	Device.nextHand()
	
	 * Events
	Events.DeviceTypeDidChange
	Events.DeviceFullScreenDidChange
	 */
	
	exports.DeviceComponent = (function(superClass) {
	  extend(DeviceComponent, superClass);
	
	  DeviceComponent.define("context", {
	    get: function() {
	      return this._context;
	    }
	  });
	
	  function DeviceComponent(options) {
	    var defaults;
	    if (options == null) {
	      options = {};
	    }
	    this._orientationChange = bind(this._orientationChange, this);
	    this._updateDeviceImage = bind(this._updateDeviceImage, this);
	    this._update = bind(this._update, this);
	    defaults = Defaults.getDefaults("DeviceComponent", options);
	    if (Framer.Defaults.hasOwnProperty("DeviceView")) {
	      defaults = _.extend(defaults, Framer.Defaults.DeviceView);
	    }
	    this._setup();
	    this.animationOptions = defaults.animationOptions;
	    this.deviceType = defaults.deviceType;
	    _.extend(this, _.defaults(options, defaults));
	    window.addEventListener("orientationchange", this._orientationChange, true);
	  }
	
	  DeviceComponent.prototype._setup = function() {
	    var i, layer, len, ref;
	    if (this._setupDone) {
	      return;
	    }
	    this._setupDone = true;
	    this.background = new Layer;
	    this.background.clip = true;
	    this.background.backgroundColor = "transparent";
	    this.background.classList.add("DeviceBackground");
	    this.hands = new Layer;
	    this.handsImageLayer = new Layer({
	      parent: this.hands
	    });
	    this.phone = new Layer({
	      parent: this.hands
	    });
	    this.screen = new Layer({
	      parent: this.phone
	    });
	    this.viewport = new Layer({
	      parent: this.screen
	    });
	    this.content = new Layer({
	      parent: this.viewport
	    });
	    this.hands.backgroundColor = "transparent";
	    this.hands._alwaysUseImageCache = true;
	    this.handsImageLayer.backgroundColor = "transparent";
	    this.phone.backgroundColor = "transparent";
	    this.phone.classList.add("DevicePhone");
	    this.screen.classList.add("DeviceScreen");
	    this.screen.clip = true;
	    this.viewport.backgroundColor = "transparent";
	    this.viewport.classList.add("DeviceComponentPort");
	    this.content.backgroundColor = "transparent";
	    this.content.classList.add("DeviceContent");
	    this.content.originX = 0;
	    this.content.originY = 0;
	    if (!Utils.isMobile()) {
	      Framer.CurrentContext.domEventManager.wrap(window).addEventListener("resize", this._update);
	    }
	    ref = [this.background, this.phone, this.viewport, this.content, this.screen];
	    for (i = 0, len = ref.length; i < len; i++) {
	      layer = ref[i];
	      layer.on("touchmove", function(event) {
	        return event.preventDefault();
	      });
	    }
	    this._context = new Framer.Context({
	      parent: this.content,
	      name: "Device"
	    });
	    return this._context.perspective = 1200;
	  };
	
	  DeviceComponent.prototype._update = function() {
	    var backgroundOverlap, contentScaleFactor, height, i, layer, len, ref, ref1, width;
	    contentScaleFactor = this.contentScale;
	    if (contentScaleFactor > 1) {
	      contentScaleFactor = 1;
	    }
	    if (this._shouldRenderFullScreen()) {
	      ref = [this.background, this.hands, this.phone, this.viewport, this.content, this.screen];
	      for (i = 0, len = ref.length; i < len; i++) {
	        layer = ref[i];
	        layer.x = layer.y = 0;
	        layer.width = window.innerWidth / contentScaleFactor;
	        layer.height = window.innerHeight / contentScaleFactor;
	        layer.scale = 1;
	      }
	      return this.content.scale = contentScaleFactor;
	    } else {
	      backgroundOverlap = 100;
	      this.background.x = 0 - backgroundOverlap;
	      this.background.y = 0 - backgroundOverlap;
	      this.background.width = window.innerWidth + (2 * backgroundOverlap);
	      this.background.height = window.innerHeight + (2 * backgroundOverlap);
	      this.hands.scale = this._calculatePhoneScale();
	      this.hands.center();
	      this.phone.center();
	      ref1 = this._getOrientationDimensions(this._device.screenWidth / contentScaleFactor, this._device.screenHeight / contentScaleFactor), width = ref1[0], height = ref1[1];
	      this.screen.width = this.viewport.width = this._device.screenWidth;
	      this.screen.height = this.viewport.height = this._device.screenHeight;
	      this.content.width = width;
	      this.content.height = height;
	      this.screen.center();
	      if (this.selectedHand && this._orientation === 0) {
	        return this.setHand(this.selectedHand);
	      }
	    }
	  };
	
	  DeviceComponent.prototype._shouldRenderFullScreen = function() {
	    if (!this._device) {
	      return true;
	    }
	    if (this.fullScreen === true) {
	      return true;
	    }
	    if (this.deviceType === "fullscreen") {
	      return true;
	    }
	    if (Utils.deviceType() === "phone" && Utils.deviceType() === this._device.deviceType) {
	      return true;
	    }
	    if (Utils.deviceType() === "tablet" && Utils.deviceType() === this._device.deviceType) {
	      return true;
	    }
	    if (Utils.deviceType() === "phone" && this._device.deviceType === "tablet") {
	      return true;
	    }
	    return false;
	  };
	
	  DeviceComponent.prototype.setupContext = function() {
	    return Framer.CurrentContext = this._context;
	  };
	
	  DeviceComponent.define("fullScreen", {
	    get: function() {
	      return this._fullScreen;
	    },
	    set: function(fullScreen) {
	      return this._setFullScreen(fullScreen);
	    }
	  });
	
	  DeviceComponent.prototype._setFullScreen = function(fullScreen) {
	    if (this._deviceType === "fullscreen") {
	      return;
	    }
	    if (!_.isBoolean(fullScreen)) {
	      return;
	    }
	    if (fullScreen === this._fullScreen) {
	      return;
	    }
	    this._fullScreen = fullScreen;
	    if (fullScreen === true) {
	      this.phone.image = "";
	      this.hands.image = "";
	    } else {
	      this._updateDeviceImage();
	    }
	    this._update();
	    return this.emit("change:fullScreen");
	  };
	
	  DeviceComponent.define("deviceType", {
	    get: function() {
	      return this._deviceType;
	    },
	    set: function(deviceType) {
	      var device, i, key, lDevicetype, lKey, len, ref, shouldZoomToFit;
	      if (deviceType === this._deviceType) {
	        return;
	      }
	      device = null;
	      if (_.isString(deviceType)) {
	        lDevicetype = deviceType.toLowerCase();
	        ref = _.keys(Devices);
	        for (i = 0, len = ref.length; i < len; i++) {
	          key = ref[i];
	          lKey = key.toLowerCase();
	          if (lDevicetype === lKey) {
	            device = Devices[key];
	          }
	        }
	      }
	      if (!device) {
	        throw Error("No device named " + deviceType + ". Options are: " + (_.keys(Devices)));
	      }
	      if (this._device === device) {
	        return;
	      }
	      shouldZoomToFit = this._deviceType === "fullscreen";
	      this.screen.backgroundColor = "black";
	      if (device.backgroundColor != null) {
	        this.screen.backgroundColor = device.backgroundColor;
	      }
	      this._device = _.clone(device);
	      this._deviceType = deviceType;
	      this.fullscreen = false;
	      this._updateDeviceImage();
	      this._update();
	      this.emit("change:deviceType");
	      if (shouldZoomToFit) {
	        return this.deviceScale = "fit";
	      }
	    }
	  });
	
	  DeviceComponent.prototype._updateDeviceImage = function() {
	    if (/PhantomJS/.test(navigator.userAgent)) {
	      return;
	    }
	    if (this._shouldRenderFullScreen()) {
	      this.phone.image = "";
	      return this.hands.image = "";
	    } else if (!this._deviceImageUrl(this._deviceImageName())) {
	      return this.phone.image = "";
	    } else {
	      this.phone._alwaysUseImageCache = true;
	      this.phone.image = this._deviceImageUrl(this._deviceImageName());
	      this.phone.width = this._device.deviceImageWidth;
	      this.phone.height = this._device.deviceImageHeight;
	      this.hands.width = this.phone.width;
	      return this.hands.height = this.phone.height;
	    }
	  };
	
	  DeviceComponent.prototype._deviceImageName = function() {
	    if (this._device.hasOwnProperty("deviceImage")) {
	      return this._device.deviceImage;
	    }
	    return this._deviceType + ".png";
	  };
	
	  DeviceComponent.prototype._deviceImageUrl = function(name) {
	    var ref, resourceUrl;
	    if (!name) {
	      return null;
	    }
	    if (_.startsWith(name, "http://") || _.startsWith(name, "https://")) {
	      return name;
	    }
	    if (ref = this._deviceType, indexOf.call(BuiltInDevices, ref) < 0) {
	      return name;
	    }
	    resourceUrl = "//resources.framerjs.com/static/DeviceResources";
	    if (Utils.isFramerStudio() && window.FramerStudioInfo) {
	      if (this._device.minStudioVersion && Utils.framerStudioVersion() >= this._device.minStudioVersion || !this._device.minStudioVersion) {
	        if (this._device.maxStudioVersion && Utils.framerStudioVersion() <= this._device.maxStudioVersion || !this._device.maxStudioVersion) {
	          resourceUrl = window.FramerStudioInfo.deviceImagesUrl;
	        }
	      }
	    }
	    if (Utils.isJP2Supported() && this._device.deviceImageJP2 === true) {
	      return resourceUrl + "/" + (name.replace(".png", ".jp2"));
	    }
	    return resourceUrl + "/" + name;
	  };
	
	  DeviceComponent.define("deviceScale", {
	    get: function() {
	      if (this._shouldRenderFullScreen()) {
	        return 1;
	      }
	      return this._deviceScale || 1;
	    },
	    set: function(deviceScale) {
	      return this.setDeviceScale(deviceScale, false);
	    }
	  });
	
	  DeviceComponent.prototype.setDeviceScale = function(deviceScale, animate) {
	    var phoneScale;
	    if (animate == null) {
	      animate = false;
	    }
	    if (deviceScale === "fit" || deviceScale < 0) {
	      deviceScale = "fit";
	    } else {
	      deviceScale = parseFloat(deviceScale);
	    }
	    if (deviceScale === this._deviceScale) {
	      return;
	    }
	    this._deviceScale = deviceScale;
	    if (this._shouldRenderFullScreen()) {
	      return;
	    }
	    if (deviceScale === "fit") {
	      phoneScale = this._calculatePhoneScale();
	    } else {
	      phoneScale = deviceScale;
	    }
	    this.hands.animateStop();
	    if (animate) {
	      this.hands.animate(_.extend(this.animationOptions, {
	        properties: {
	          scale: phoneScale
	        }
	      }));
	    } else {
	      this.hands.scale = phoneScale;
	      this.hands.center();
	    }
	    return this.emit("change:deviceScale");
	  };
	
	  DeviceComponent.prototype._calculatePhoneScale = function() {
	    var height, paddingOffset, phoneScale, ref, ref1, width;
	    ref = this._getOrientationDimensions(this.phone.width, this.phone.height), width = ref[0], height = ref[1];
	    paddingOffset = ((ref1 = this._device) != null ? ref1.paddingOffset : void 0) || 0;
	    phoneScale = _.min([(window.innerWidth - ((this.padding + paddingOffset) * 2)) / width, (window.innerHeight - ((this.padding + paddingOffset) * 2)) / height]);
	    if (phoneScale > 1) {
	      phoneScale = 1;
	    }
	    this.emit("change:phoneScale", phoneScale);
	    if (this._deviceScale && this._deviceScale !== "fit") {
	      return this._deviceScale;
	    }
	    return phoneScale;
	  };
	
	  DeviceComponent.define("contentScale", {
	    get: function() {
	      return this._contentScale || 1;
	    },
	    set: function(contentScale) {
	      return this.setContentScale(contentScale, false);
	    }
	  });
	
	  DeviceComponent.prototype.setContentScale = function(contentScale, animate) {
	    if (animate == null) {
	      animate = false;
	    }
	    contentScale = parseFloat(contentScale);
	    if (contentScale <= 0) {
	      return;
	    }
	    if (contentScale === this._contentScale) {
	      return;
	    }
	    this._contentScale = contentScale;
	    if (animate) {
	      this.content.animate(_.extend(this.animationOptions, {
	        properties: {
	          scale: this._contentScale
	        }
	      }));
	    } else {
	      this.content.scale = this._contentScale;
	    }
	    this._update();
	    return this.emit("change:contentScale");
	  };
	
	  DeviceComponent.define("orientation", {
	    get: function() {
	      if (Utils.isMobile()) {
	        return window.orientation;
	      }
	      return this._orientation || 0;
	    },
	    set: function(orientation) {
	      return this.setOrientation(orientation, false);
	    }
	  });
	
	  DeviceComponent.prototype.setOrientation = function(orientation, animate) {
	    var animation, contentProperties, height, offset, phoneProperties, ref, ref1, width, x, y;
	    if (animate == null) {
	      animate = false;
	    }
	    if (Utils.framerStudioVersion() === oldDeviceMaxVersion) {
	      orientation *= -1;
	    }
	    if (orientation === "portrait") {
	      orientation = 0;
	    }
	    if (orientation === "landscape") {
	      orientation = 90;
	    }
	    if (this._shouldRenderFullScreen()) {
	      return;
	    }
	    orientation = parseInt(orientation);
	    if (orientation !== 0 && orientation !== 90 && orientation !== (-90)) {
	      return;
	    }
	    if (orientation === this._orientation) {
	      return;
	    }
	    this._orientation = orientation;
	    phoneProperties = {
	      rotationZ: -this._orientation,
	      scale: this._calculatePhoneScale()
	    };
	    ref = this._getOrientationDimensions(this._device.screenWidth, this._device.screenHeight), width = ref[0], height = ref[1];
	    this.content.width = width;
	    this.content.height = height;
	    offset = (this.screen.width - width) / 2;
	    if (this._orientation === -90) {
	      offset *= -1;
	    }
	    ref1 = [0, 0], x = ref1[0], y = ref1[1];
	    if (this.isLandscape()) {
	      x = offset;
	      y = offset;
	    }
	    contentProperties = {
	      rotationZ: this._orientation,
	      x: x,
	      y: y
	    };
	    this.hands.animateStop();
	    this.viewport.animateStop();
	    if (animate) {
	      animation = this.hands.animate(_.extend(this.animationOptions, {
	        properties: phoneProperties
	      }));
	      this.viewport.animate(_.extend(this.animationOptions, {
	        properties: contentProperties
	      }));
	      animation.on(Events.AnimationEnd, (function(_this) {
	        return function() {
	          return _this._update();
	        };
	      })(this));
	    } else {
	      this.hands.props = phoneProperties;
	      this.viewport.props = contentProperties;
	      this._update();
	    }
	    if (this._orientation !== 0) {
	      this.handsImageLayer.image = "";
	    }
	    return this.emit("change:orientation", this._orientation);
	  };
	
	  DeviceComponent.prototype._orientationChange = function() {
	    this._orientation = window.orientation;
	    this._update();
	    return this.emit("change:orientation", window.orientation);
	  };
	
	  DeviceComponent.prototype.isPortrait = function() {
	    return Math.abs(this.orientation) === 0;
	  };
	
	  DeviceComponent.prototype.isLandscape = function() {
	    return !this.isPortrait();
	  };
	
	  DeviceComponent.define("orientationName", {
	    get: function() {
	      if (this.isPortrait()) {
	        return "portrait";
	      }
	      if (this.isLandscape()) {
	        return "landscape";
	      }
	    },
	    set: function(orientationName) {
	      return this.setOrientation(orientationName, false);
	    }
	  });
	
	  DeviceComponent.prototype.rotateLeft = function(animate) {
	    if (animate == null) {
	      animate = true;
	    }
	    if (this.orientation === 90) {
	      return;
	    }
	    return this.setOrientation(this.orientation + 90, animate);
	  };
	
	  DeviceComponent.prototype.rotateRight = function(animate) {
	    if (animate == null) {
	      animate = true;
	    }
	    if (this.orientation === -90) {
	      return;
	    }
	    return this.setOrientation(this.orientation - 90, animate);
	  };
	
	  DeviceComponent.prototype._getOrientationDimensions = function(width, height) {
	    if (this.isLandscape()) {
	      return [height, width];
	    } else {
	      return [width, height];
	    }
	  };
	
	  DeviceComponent.prototype.handSwitchingSupported = function() {
	    return this._device.hands !== void 0;
	  };
	
	  DeviceComponent.prototype.nextHand = function() {
	    var hand, hands, nextHand, nextHandIndex;
	    if (this.hands.rotationZ !== 0) {
	      return;
	    }
	    if (this.handSwitchingSupported()) {
	      hands = _.keys(this._device.hands);
	      if (hands.length > 0) {
	        nextHandIndex = hands.indexOf(this.selectedHand) + 1;
	        nextHand = "";
	        if (nextHandIndex < hands.length) {
	          nextHand = hands[nextHandIndex];
	        }
	        hand = this.setHand(nextHand);
	        this._update();
	        return hand;
	      }
	    }
	    return false;
	  };
	
	  DeviceComponent.prototype.setHand = function(hand) {
	    var handData;
	    this.selectedHand = hand;
	    if (!hand || !this.handSwitchingSupported()) {
	      return this.handsImageLayer.image = "";
	    }
	    handData = this._device.hands[hand];
	    if (handData) {
	      this.hands.width = handData.width;
	      this.hands.height = handData.height;
	      this.hands.center();
	      this.phone.center();
	      this.handsImageLayer.size = this.hands.size;
	      this.handsImageLayer.y = 0;
	      if (handData.offset) {
	        this.handsImageLayer.y = handData.offset;
	      }
	      this.handsImageLayer.image = this.handImageUrl(hand);
	      return hand;
	    }
	  };
	
	  DeviceComponent.prototype.handImageUrl = function(hand) {
	    var resourceUrl;
	    resourceUrl = "//resources.framerjs.com/static/DeviceResources";
	    if (Utils.isFramerStudio() && window.FramerStudioInfo && Utils.framerStudioVersion() >= newDeviceMinVersion) {
	      resourceUrl = window.FramerStudioInfo.deviceImagesUrl;
	    }
	    return resourceUrl + "/" + hand + ".png";
	  };
	
	  return DeviceComponent;
	
	})(BaseClass);
	
	newDeviceMinVersion = 53;
	
	oldDeviceMaxVersion = 52;
	
	iPadAir2BaseDevice = {
	  deviceImageWidth: 1856,
	  deviceImageHeight: 2608,
	  deviceImageJP2: true,
	  screenWidth: 1536,
	  screenHeight: 2048,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion
	};
	
	iPadMini4BaseDevice = {
	  deviceImageWidth: 1936,
	  deviceImageHeight: 2688,
	  deviceImageJP2: true,
	  screenWidth: 1536,
	  screenHeight: 2048,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion
	};
	
	iPadProBaseDevice = {
	  deviceImageWidth: 2448,
	  deviceImageHeight: 3432,
	  deviceImageJP2: true,
	  screenWidth: 2048,
	  screenHeight: 2732,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion
	};
	
	iPhone6BaseDevice = {
	  deviceImageWidth: 874,
	  deviceImageHeight: 1792,
	  deviceImageJP2: true,
	  screenWidth: 750,
	  screenHeight: 1334,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion,
	  hands: {
	    "iphone-hands-2": {
	      width: 2400,
	      height: 3740
	    },
	    "iphone-hands-1": {
	      width: 2400,
	      height: 3740
	    }
	  }
	};
	
	iPhone6PlusBaseDevice = {
	  deviceImageWidth: 1452,
	  deviceImageHeight: 2968,
	  deviceImageJP2: true,
	  screenWidth: 1242,
	  screenHeight: 2208,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion,
	  hands: {
	    "iphone-hands-2": {
	      width: 3987,
	      height: 6212
	    },
	    "iphone-hands-1": {
	      width: 3987,
	      height: 6212
	    }
	  }
	};
	
	iPhone5BaseDevice = {
	  deviceImageWidth: 768,
	  deviceImageHeight: 1612,
	  deviceImageJP2: true,
	  screenWidth: 640,
	  screenHeight: 1136,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion,
	  hands: {
	    "iphone-hands-2": {
	      width: 2098,
	      height: 3269,
	      offset: 19
	    },
	    "iphone-hands-1": {
	      width: 2098,
	      height: 3269,
	      offset: 19
	    }
	  }
	};
	
	iPhone5CBaseDevice = {
	  deviceImageWidth: 776,
	  deviceImageHeight: 1620,
	  deviceImageJP2: true,
	  screenWidth: 640,
	  screenHeight: 1136,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion,
	  hands: {
	    "iphone-hands-2": {
	      width: 2098,
	      height: 3269,
	      offset: 28
	    },
	    "iphone-hands-1": {
	      width: 2098,
	      height: 3269,
	      offset: 28
	    }
	  }
	};
	
	Nexus4BaseDevice = {
	  deviceImageWidth: 860,
	  deviceImageHeight: 1668,
	  deviceImageJP2: true,
	  screenWidth: 768,
	  screenHeight: 1280,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion,
	  hands: {
	    "iphone-hands-2": {
	      width: 2362,
	      height: 3681,
	      offset: -52
	    },
	    "iphone-hands-1": {
	      width: 2362,
	      height: 3681,
	      offset: -52
	    }
	  }
	};
	
	Nexus5BaseDevice = {
	  deviceImageWidth: 1204,
	  deviceImageHeight: 2432,
	  deviceImageJP2: true,
	  screenWidth: 1080,
	  screenHeight: 1920,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion,
	  hands: {
	    "iphone-hands-2": {
	      width: 3292,
	      height: 5130,
	      offset: 8
	    },
	    "iphone-hands-1": {
	      width: 3292,
	      height: 5130,
	      offset: 8
	    }
	  }
	};
	
	Nexus6BaseDevice = {
	  deviceImageWidth: 1576,
	  deviceImageHeight: 3220,
	  deviceImageJP2: true,
	  screenWidth: 1440,
	  screenHeight: 2560,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion,
	  hands: {
	    "iphone-hands-2": {
	      width: 4304,
	      height: 6707,
	      offset: 8
	    },
	    "iphone-hands-1": {
	      width: 4304,
	      height: 6707,
	      offset: 8
	    }
	  }
	};
	
	Nexus9BaseDevice = {
	  deviceImageWidth: 1896,
	  deviceImageHeight: 2648,
	  deviceImageJP2: true,
	  screenWidth: 1536,
	  screenHeight: 2048,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion
	};
	
	HTCa9BaseDevice = {
	  deviceImageWidth: 1252,
	  deviceImageHeight: 2592,
	  deviceImageJP2: true,
	  screenWidth: 1080,
	  screenHeight: 1920,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion,
	  hands: {
	    "iphone-hands-2": {
	      width: 3436,
	      height: 5354,
	      offset: 36
	    },
	    "iphone-hands-1": {
	      width: 3436,
	      height: 5354,
	      offset: 36
	    }
	  }
	};
	
	HTCm8BaseDevice = {
	  deviceImageWidth: 1232,
	  deviceImageHeight: 2572,
	  deviceImageJP2: true,
	  screenWidth: 1080,
	  screenHeight: 1920,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion,
	  hands: {
	    "iphone-hands-2": {
	      width: 3436,
	      height: 5354,
	      offset: 12
	    },
	    "iphone-hands-1": {
	      width: 3436,
	      height: 5354,
	      offset: 12
	    }
	  }
	};
	
	MSFTLumia950BaseDevice = {
	  deviceImageWidth: 1660,
	  deviceImageHeight: 3292,
	  deviceImageJP2: true,
	  screenWidth: 1440,
	  screenHeight: 2560,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion,
	  hands: {
	    "iphone-hands-2": {
	      width: 4494,
	      height: 7003,
	      offset: -84
	    },
	    "iphone-hands-1": {
	      width: 4494,
	      height: 7003,
	      offset: -84
	    }
	  }
	};
	
	SamsungGalaxyNote5BaseDevice = {
	  deviceImageWidth: 1572,
	  deviceImageHeight: 3140,
	  deviceImageJP2: true,
	  screenWidth: 1440,
	  screenHeight: 2560,
	  deviceType: "phone",
	  minStudioVersion: newDeviceMinVersion,
	  hands: {
	    "iphone-hands-2": {
	      width: 4279,
	      height: 6668,
	      offset: -24
	    },
	    "iphone-hands-1": {
	      width: 4279,
	      height: 6668,
	      offset: -84
	    }
	  }
	};
	
	AppleWatch42Device = {
	  deviceImageWidth: 512,
	  deviceImageHeight: 990,
	  deviceImageJP2: true,
	  screenWidth: 312,
	  screenHeight: 390,
	  minStudioVersion: newDeviceMinVersion
	};
	
	AppleWatch38Device = {
	  deviceImageWidth: 472,
	  deviceImageHeight: 772,
	  deviceImageJP2: true,
	  screenWidth: 272,
	  screenHeight: 340,
	  minStudioVersion: newDeviceMinVersion
	};
	
	AppleWatch38BlackLeatherDevice = {
	  deviceImageWidth: 472,
	  deviceImageHeight: 796,
	  deviceImageJP2: true,
	  screenWidth: 272,
	  screenHeight: 340,
	  minStudioVersion: newDeviceMinVersion
	};
	
	old_iPhone6BaseDevice = {
	  deviceImageWidth: 870,
	  deviceImageHeight: 1738,
	  deviceImageJP2: true,
	  screenWidth: 750,
	  screenHeight: 1334,
	  deviceType: "phone",
	  maxStudioVersion: oldDeviceMaxVersion
	};
	
	old_iPhone6BaseDeviceHand = _.extend({}, old_iPhone6BaseDevice, {
	  deviceImageWidth: 1988,
	  deviceImageHeight: 2368,
	  deviceImageJP2: true,
	  paddingOffset: -150,
	  maxStudioVersion: oldDeviceMaxVersion
	});
	
	old_iPhone6PlusBaseDevice = {
	  deviceImageWidth: 1460,
	  deviceImageHeight: 2900,
	  deviceImageJP2: true,
	  screenWidth: 1242,
	  screenHeight: 2208,
	  deviceType: "phone",
	  maxStudioVersion: oldDeviceMaxVersion
	};
	
	old_iPhone6PlusBaseDeviceHand = _.extend({}, old_iPhone6PlusBaseDevice, {
	  deviceImageWidth: 3128,
	  deviceImageHeight: 3487,
	  deviceImageJP2: true,
	  paddingOffset: -150,
	  maxStudioVersion: oldDeviceMaxVersion
	});
	
	old_iPhone5BaseDevice = {
	  deviceImageWidth: 780,
	  deviceImageHeight: 1608,
	  deviceImageJP2: true,
	  screenWidth: 640,
	  screenHeight: 1136,
	  deviceType: "phone",
	  maxStudioVersion: oldDeviceMaxVersion
	};
	
	old_iPhone5BaseDeviceHand = _.extend({}, old_iPhone5BaseDevice, {
	  deviceImageWidth: 1884,
	  deviceImageHeight: 2234,
	  deviceImageJP2: true,
	  paddingOffset: -200,
	  maxStudioVersion: oldDeviceMaxVersion
	});
	
	old_iPhone5CBaseDevice = {
	  deviceImageWidth: 776,
	  deviceImageHeight: 1612,
	  deviceImageJP2: true,
	  screenWidth: 640,
	  screenHeight: 1136,
	  deviceType: "phone",
	  maxStudioVersion: oldDeviceMaxVersion
	};
	
	old_iPhone5CBaseDeviceHand = _.extend({}, old_iPhone5CBaseDevice, {
	  deviceImageWidth: 1894,
	  deviceImageHeight: 2244,
	  deviceImageJP2: true,
	  paddingOffset: -200,
	  maxStudioVersion: oldDeviceMaxVersion
	});
	
	old_iPadMiniBaseDevice = {
	  deviceImageWidth: 872,
	  deviceImageHeight: 1292,
	  deviceImageJP2: true,
	  screenWidth: 768,
	  screenHeight: 1024,
	  deviceType: "tablet",
	  maxStudioVersion: oldDeviceMaxVersion
	};
	
	old_iPadMiniBaseDeviceHand = _.extend({}, old_iPadMiniBaseDevice, {
	  deviceImageWidth: 1380,
	  deviceImageHeight: 2072,
	  deviceImageJP2: true,
	  paddingOffset: -120,
	  maxStudioVersion: oldDeviceMaxVersion
	});
	
	old_iPadAirBaseDevice = {
	  deviceImageWidth: 1769,
	  deviceImageHeight: 2509,
	  deviceImageJP2: true,
	  screenWidth: 1536,
	  screenHeight: 2048,
	  deviceType: "tablet",
	  maxStudioVersion: oldDeviceMaxVersion
	};
	
	old_iPadAirBaseDeviceHand = _.extend({}, old_iPadAirBaseDevice, {
	  deviceImageWidth: 4744,
	  deviceImageHeight: 4101,
	  deviceImageJP2: true,
	  paddingOffset: -120,
	  maxStudioVersion: oldDeviceMaxVersion
	});
	
	old_Nexus5BaseDevice = {
	  deviceImageWidth: 1208,
	  deviceImageHeight: 2440,
	  deviceImageJP2: true,
	  screenWidth: 1080,
	  screenHeight: 1920,
	  deviceType: "phone",
	  maxStudioVersion: oldDeviceMaxVersion
	};
	
	old_Nexus5BaseDeviceHand = _.extend({}, old_Nexus5BaseDevice, {
	  deviceImageWidth: 2692,
	  deviceImageHeight: 2996,
	  deviceImageJP2: true,
	  paddingOffset: -120,
	  maxStudioVersion: oldDeviceMaxVersion
	});
	
	old_Nexus9BaseDevice = {
	  deviceImageWidth: 1733,
	  deviceImageHeight: 2575,
	  deviceImageJP2: true,
	  screenWidth: 1536,
	  screenHeight: 2048,
	  deviceType: "tablet",
	  maxStudioVersion: oldDeviceMaxVersion
	};
	
	old_AppleWatch42Device = {
	  deviceImageWidth: 552,
	  deviceImageHeight: 938,
	  deviceImageJP2: true,
	  screenWidth: 312,
	  screenHeight: 390,
	  maxStudioVersion: oldDeviceMaxVersion
	};
	
	old_AppleWatch38Device = {
	  deviceImageWidth: 508,
	  deviceImageHeight: 900,
	  deviceImageJP2: true,
	  screenWidth: 272,
	  screenHeight: 340,
	  maxStudioVersion: oldDeviceMaxVersion
	};
	
	Devices = {
	  "fullscreen": {
	    name: "Fullscreen",
	    deviceType: "desktop",
	    backgroundColor: "white"
	  },
	  "apple-ipad-air-2-silver": _.clone(iPadAir2BaseDevice),
	  "apple-ipad-air-2-gold": _.clone(iPadAir2BaseDevice),
	  "apple-ipad-air-2-space-gray": _.clone(iPadAir2BaseDevice),
	  "apple-ipad-mini-4-silver": _.clone(iPadMini4BaseDevice),
	  "apple-ipad-mini-4-gold": _.clone(iPadMini4BaseDevice),
	  "apple-ipad-mini-4-space-gray": _.clone(iPadMini4BaseDevice),
	  "apple-ipad-pro-silver": _.clone(iPadProBaseDevice),
	  "apple-ipad-pro-gold": _.clone(iPadProBaseDevice),
	  "apple-ipad-pro-space-gray": _.clone(iPadProBaseDevice),
	  "apple-iphone-6s-gold": _.clone(iPhone6BaseDevice),
	  "apple-iphone-6s-rose-gold": _.clone(iPhone6BaseDevice),
	  "apple-iphone-6s-silver": _.clone(iPhone6BaseDevice),
	  "apple-iphone-6s-space-gray": _.clone(iPhone6BaseDevice),
	  "apple-iphone-6s-plus-gold": _.clone(iPhone6PlusBaseDevice),
	  "apple-iphone-6s-plus-rose-gold": _.clone(iPhone6PlusBaseDevice),
	  "apple-iphone-6s-plus-silver": _.clone(iPhone6PlusBaseDevice),
	  "apple-iphone-6s-plus-space-gray": _.clone(iPhone6PlusBaseDevice),
	  "apple-iphone-5s-gold": _.clone(iPhone5BaseDevice),
	  "apple-iphone-5s-silver": _.clone(iPhone5BaseDevice),
	  "apple-iphone-5s-space-gray": _.clone(iPhone5BaseDevice),
	  "apple-iphone-5c-blue": _.clone(iPhone5CBaseDevice),
	  "apple-iphone-5c-green": _.clone(iPhone5CBaseDevice),
	  "apple-iphone-5c-red": _.clone(iPhone5CBaseDevice),
	  "apple-iphone-5c-white": _.clone(iPhone5CBaseDevice),
	  "apple-iphone-5c-yellow": _.clone(iPhone5CBaseDevice),
	  "apple-watch-38mm-gold-black-leather-closed": _.clone(AppleWatch38BlackLeatherDevice),
	  "apple-watch-38mm-rose-gold-black-leather-closed": _.clone(AppleWatch38BlackLeatherDevice),
	  "apple-watch-38mm-stainless-steel-black-leather-closed": _.clone(AppleWatch38BlackLeatherDevice),
	  "apple-watch-38mm-black-steel-black-closed": _.clone(AppleWatch38Device),
	  "apple-watch-38mm-gold-midnight-blue-closed": _.clone(AppleWatch38Device),
	  "apple-watch-38mm-rose-gold-lavender-closed": _.clone(AppleWatch38Device),
	  "apple-watch-38mm-sport-aluminum-blue-closed": _.clone(AppleWatch38Device),
	  "apple-watch-38mm-sport-aluminum-fog-closed": _.clone(AppleWatch38Device),
	  "apple-watch-38mm-sport-aluminum-green-closed": _.clone(AppleWatch38Device),
	  "apple-watch-38mm-sport-aluminum-red-closed": _.clone(AppleWatch38Device),
	  "apple-watch-38mm-sport-aluminum-walnut-closed": _.clone(AppleWatch38Device),
	  "apple-watch-38mm-sport-aluminum-white-closed": _.clone(AppleWatch38Device),
	  "apple-watch-38mm-sport-aluminum-gold-antique-white-closed": _.clone(AppleWatch38Device),
	  "apple-watch-38mm-sport-aluminum-rose-gold-stone-closed": _.clone(AppleWatch38Device),
	  "apple-watch-38mm-sport-space-gray-black-closed": _.clone(AppleWatch38Device),
	  "apple-watch-42mm-black-steel-black-closed": _.clone(AppleWatch42Device),
	  "apple-watch-42mm-gold-black-leather-closed": _.clone(AppleWatch42Device),
	  "apple-watch-42mm-gold-midnight-blue-closed": _.clone(AppleWatch42Device),
	  "apple-watch-42mm-rose-gold-black-leather-closed": _.clone(AppleWatch42Device),
	  "apple-watch-42mm-rose-gold-lavender-closed": _.clone(AppleWatch42Device),
	  "apple-watch-42mm-sport-aluminum-blue-closed": _.clone(AppleWatch42Device),
	  "apple-watch-42mm-sport-aluminum-fog-closed": _.clone(AppleWatch42Device),
	  "apple-watch-42mm-sport-aluminum-green-closed": _.clone(AppleWatch42Device),
	  "apple-watch-42mm-sport-aluminum-red-closed": _.clone(AppleWatch42Device),
	  "apple-watch-42mm-sport-aluminum-walnut-closed": _.clone(AppleWatch42Device),
	  "apple-watch-42mm-sport-aluminum-white-closed": _.clone(AppleWatch42Device),
	  "apple-watch-42mm-sport-aluminum-gold-antique-white-closed": _.clone(AppleWatch42Device),
	  "apple-watch-42mm-sport-aluminum-rose-gold-stone-closed": _.clone(AppleWatch42Device),
	  "apple-watch-42mm-sport-space-gray-black-closed": _.clone(AppleWatch42Device),
	  "apple-watch-42mm-stainless-steel-black-leather-closed": _.clone(AppleWatch42Device),
	  "google-nexus-4": _.clone(Nexus4BaseDevice),
	  "google-nexus-5x": _.clone(Nexus5BaseDevice),
	  "google-nexus-6p": _.clone(Nexus6BaseDevice),
	  "google-nexus-9": _.clone(Nexus9BaseDevice),
	  "htc-one-a9-black": _.clone(HTCa9BaseDevice),
	  "htc-one-a9-white": _.clone(HTCa9BaseDevice),
	  "htc-one-m8-black": _.clone(HTCm8BaseDevice),
	  "htc-one-m8-gold": _.clone(HTCm8BaseDevice),
	  "htc-one-m8-silver": _.clone(HTCm8BaseDevice),
	  "microsoft-lumia-950-black": _.clone(MSFTLumia950BaseDevice),
	  "microsoft-lumia-950-white": _.clone(MSFTLumia950BaseDevice),
	  "samsung-galaxy-note-5-black": _.clone(SamsungGalaxyNote5BaseDevice),
	  "samsung-galaxy-note-5-gold": _.clone(SamsungGalaxyNote5BaseDevice),
	  "samsung-galaxy-note-5-pink": _.clone(SamsungGalaxyNote5BaseDevice),
	  "samsung-galaxy-note-5-silver-titanium": _.clone(SamsungGalaxyNote5BaseDevice),
	  "samsung-galaxy-note-5-white": _.clone(SamsungGalaxyNote5BaseDevice),
	  "desktop-safari-1024-600": {
	    deviceType: "browser",
	    name: "Desktop Safari 1024 x 600",
	    screenWidth: 1024,
	    screenHeight: 600,
	    deviceImageWidth: 1136,
	    deviceImageHeight: 760,
	    deviceImageJP2: true,
	    backgroundColor: "white"
	  },
	  "desktop-safari-1280-800": {
	    deviceType: "browser",
	    name: "Desktop Safari 1280 x 800",
	    screenWidth: 1280,
	    screenHeight: 800,
	    deviceImageWidth: 1392,
	    deviceImageHeight: 960,
	    deviceImageJP2: true,
	    backgroundColor: "white"
	  },
	  "desktop-safari-1440-900": {
	    deviceType: "browser",
	    name: "Desktop Safari 1440 x 900",
	    screenWidth: 1440,
	    screenHeight: 900,
	    deviceImageWidth: 1552,
	    deviceImageHeight: 1060,
	    deviceImageJP2: true,
	    backgroundColor: "white"
	  },
	  "iphone-6-spacegray": _.clone(old_iPhone6BaseDevice),
	  "iphone-6-spacegray-hand": _.clone(old_iPhone6BaseDeviceHand),
	  "iphone-6-silver": _.clone(old_iPhone6BaseDevice),
	  "iphone-6-silver-hand": _.clone(old_iPhone6BaseDeviceHand),
	  "iphone-6-gold": _.clone(old_iPhone6BaseDevice),
	  "iphone-6-gold-hand": _.clone(old_iPhone6BaseDeviceHand),
	  "iphone-6plus-spacegray": _.clone(old_iPhone6PlusBaseDevice),
	  "iphone-6plus-spacegray-hand": _.clone(old_iPhone6PlusBaseDeviceHand),
	  "iphone-6plus-silver": _.clone(old_iPhone6PlusBaseDevice),
	  "iphone-6plus-silver-hand": _.clone(old_iPhone6PlusBaseDeviceHand),
	  "iphone-6plus-gold": _.clone(old_iPhone6PlusBaseDevice),
	  "iphone-6plus-gold-hand": _.clone(old_iPhone6PlusBaseDeviceHand),
	  "iphone-5s-spacegray": _.clone(old_iPhone5BaseDevice),
	  "iphone-5s-spacegray-hand": _.clone(old_iPhone5BaseDeviceHand),
	  "iphone-5s-silver": _.clone(old_iPhone5BaseDevice),
	  "iphone-5s-silver-hand": _.clone(old_iPhone5BaseDeviceHand),
	  "iphone-5s-gold": _.clone(old_iPhone5BaseDevice),
	  "iphone-5s-gold-hand": _.clone(old_iPhone5BaseDeviceHand),
	  "iphone-5c-green": _.clone(old_iPhone5CBaseDevice),
	  "iphone-5c-green-hand": _.clone(old_iPhone5CBaseDeviceHand),
	  "iphone-5c-blue": _.clone(old_iPhone5CBaseDevice),
	  "iphone-5c-blue-hand": _.clone(old_iPhone5CBaseDeviceHand),
	  "iphone-5c-pink": _.clone(old_iPhone5CBaseDevice),
	  "iphone-5c-pink-hand": _.clone(old_iPhone5CBaseDeviceHand),
	  "iphone-5c-white": _.clone(old_iPhone5CBaseDevice),
	  "iphone-5c-white-hand": _.clone(old_iPhone5CBaseDeviceHand),
	  "iphone-5c-yellow": _.clone(old_iPhone5CBaseDevice),
	  "iphone-5c-yellow-hand": _.clone(old_iPhone5CBaseDeviceHand),
	  "ipad-mini-spacegray": _.clone(old_iPadMiniBaseDevice),
	  "ipad-mini-spacegray-hand": _.clone(old_iPadMiniBaseDeviceHand),
	  "ipad-mini-silver": _.clone(old_iPadMiniBaseDevice),
	  "ipad-mini-silver-hand": _.clone(old_iPadMiniBaseDeviceHand),
	  "ipad-air-spacegray": _.clone(old_iPadAirBaseDevice),
	  "ipad-air-spacegray-hand": _.clone(old_iPadAirBaseDeviceHand),
	  "ipad-air-silver": _.clone(old_iPadAirBaseDevice),
	  "ipad-air-silver-hand": _.clone(old_iPadAirBaseDeviceHand),
	  "nexus-5-black": _.clone(old_Nexus5BaseDevice),
	  "nexus-5-black-hand": _.clone(old_Nexus5BaseDeviceHand),
	  "nexus-9": _.clone(old_Nexus9BaseDevice),
	  "applewatchsport-38-aluminum-sportband-black": _.clone(old_AppleWatch38Device),
	  "applewatchsport-38-aluminum-sportband-blue": _.clone(old_AppleWatch38Device),
	  "applewatchsport-38-aluminum-sportband-green": _.clone(old_AppleWatch38Device),
	  "applewatchsport-38-aluminum-sportband-pink": _.clone(old_AppleWatch38Device),
	  "applewatchsport-38-aluminum-sportband-white": _.clone(old_AppleWatch38Device),
	  "applewatch-38-black-bracelet": _.clone(old_AppleWatch38Device),
	  "applewatch-38-steel-bracelet": _.clone(old_AppleWatch38Device),
	  "applewatchedition-38-gold-buckle-blue": _.clone(old_AppleWatch38Device),
	  "applewatchedition-38-gold-buckle-gray": _.clone(old_AppleWatch38Device),
	  "applewatchedition-38-gold-buckle-red": _.clone(old_AppleWatch38Device),
	  "applewatchedition-38-gold-sportband-black": _.clone(old_AppleWatch38Device),
	  "applewatchedition-38-gold-sportband-white": _.clone(old_AppleWatch38Device),
	  "applewatchsport-42-aluminum-sportband-black": _.clone(old_AppleWatch42Device),
	  "applewatchsport-42-aluminum-sportband-blue": _.clone(old_AppleWatch42Device),
	  "applewatchsport-42-aluminum-sportband-green": _.clone(old_AppleWatch42Device),
	  "applewatchsport-42-aluminum-sportband-pink": _.clone(old_AppleWatch42Device),
	  "applewatchsport-42-aluminum-sportband-white": _.clone(old_AppleWatch42Device),
	  "applewatch-42-black-bracelet": _.clone(old_AppleWatch42Device),
	  "applewatch-42-steel-bracelet": _.clone(old_AppleWatch42Device),
	  "applewatchedition-42-gold-buckle-blue": _.clone(old_AppleWatch42Device),
	  "applewatchedition-42-gold-buckle-gray": _.clone(old_AppleWatch42Device),
	  "applewatchedition-42-gold-buckle-red": _.clone(old_AppleWatch42Device),
	  "applewatchedition-42-gold-sportband-black": _.clone(old_AppleWatch42Device),
	  "applewatchedition-42-gold-sportband-white": _.clone(old_AppleWatch42Device)
	};
	
	exports.DeviceComponent.Devices = Devices;
	
	BuiltInDevices = _.keys(Devices);


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var Config, EventEmitter, Utils, _, getTime,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(1)._;
	
	Utils = __webpack_require__(4);
	
	Config = __webpack_require__(14).Config;
	
	EventEmitter = __webpack_require__(7).EventEmitter;
	
	getTime = function() {
	  return Utils.getTime() * 1000;
	};
	
	exports.AnimationLoop = (function(superClass) {
	  extend(AnimationLoop, superClass);
	
	  function AnimationLoop() {
	    this.start = bind(this.start, this);
	    this.delta = 1 / 60;
	    this.raf = true;
	    if (Utils.webkitVersion() > 600 && Utils.webkitVersion() < 601) {
	      if (Utils.isFramerStudio() || Utils.isDesktop()) {
	        this.raf = false;
	      }
	    }
	    this.maximumListeners = Infinity;
	  }
	
	  AnimationLoop.prototype.start = function() {
	    var _timestamp, animationLoop, tick, update;
	    animationLoop = this;
	    _timestamp = getTime();
	    update = function() {
	      var delta, timestamp;
	      if (animationLoop.delta) {
	        delta = animationLoop.delta;
	      } else {
	        timestamp = getTime();
	        delta = (timestamp - _timestamp) / 1000;
	        _timestamp = timestamp;
	      }
	      animationLoop.emit("update", delta);
	      return animationLoop.emit("render", delta);
	    };
	    tick = function(timestamp) {
	      if (animationLoop.raf) {
	        update();
	        return window.requestAnimationFrame(tick);
	      } else {
	        return window.setTimeout(function() {
	          update();
	          return window.requestAnimationFrame(tick);
	        }, 0);
	      }
	    };
	    return tick();
	  };
	
	  return AnimationLoop;
	
	})(EventEmitter);


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var ChromeAlert, Utils, _, getScaleFromName, resizeFrame, sanitizeLayerName, startsWithNumber;
	
	_ = __webpack_require__(1)._;
	
	Utils = __webpack_require__(4);
	
	ChromeAlert = "Importing layers is currently only supported on Safari. If you really want it to work with Chrome quit it, open a terminal and run:\nopen -a Google\ Chrome -–allow-file-access-from-files";
	
	resizeFrame = function(scale, frame) {
	  var i, key, len, ref, result;
	  if (scale === 1) {
	    return frame;
	  }
	  result = {};
	  ref = ["x", "y", "width", "height"];
	  for (i = 0, len = ref.length; i < len; i++) {
	    key = ref[i];
	    if (frame.hasOwnProperty(key)) {
	      result[key] = frame[key] * scale;
	    }
	  }
	  return result;
	};
	
	getScaleFromName = function(str) {
	  var m, re;
	  re = /@([\d]+|[\d]+.[\d]+)x/;
	  m = void 0;
	  if ((m = re.exec(str)) !== null) {
	    if (m[1]) {
	      return parseFloat(m[1]);
	    }
	  }
	  return null;
	};
	
	startsWithNumber = function(str) {
	  return (new RegExp("^[0-9]")).test(str);
	};
	
	sanitizeLayerName = function(name) {
	  var i, len, ref, suffix;
	  ref = ["*", "-", ".png", ".jpg", ".pdf"];
	  for (i = 0, len = ref.length; i < len; i++) {
	    suffix = ref[i];
	    if (_.endsWith(name.toLowerCase(), suffix)) {
	      name = name.slice(0, +(name.length - suffix.length - 1) + 1 || 9e9);
	    }
	  }
	  return name;
	};
	
	exports.Importer = (function() {
	  function Importer(path1, scale1, extraLayerProperties) {
	    this.path = path1;
	    this.scale = scale1 != null ? scale1 : 1;
	    this.extraLayerProperties = extraLayerProperties != null ? extraLayerProperties : {};
	    this.paths = {
	      layerInfo: Utils.pathJoin(this.path, "layers.json"),
	      images: Utils.pathJoin(this.path, "images"),
	      documentName: this.path.split("/").pop()
	    };
	    this._createdLayers = [];
	    this._createdLayersByName = {};
	  }
	
	  Importer.prototype.load = function() {
	    var i, j, layer, layerInfo, layersByName, len, len1, ref, ref1;
	    layersByName = {};
	    layerInfo = this._loadlayerInfo();
	    if (layerInfo.length === 0) {
	      throw new Error("Importer: no layers. Do you have at least one layer group?");
	    }
	    layerInfo.map((function(_this) {
	      return function(layerItemInfo) {
	        return _this._createLayer(layerItemInfo);
	      };
	    })(this));
	    ref = this._createdLayers;
	    for (i = 0, len = ref.length; i < len; i++) {
	      layer = ref[i];
	      this._correctLayer(layer);
	    }
	    this._correctArtboards(this._createdLayers);
	    ref1 = this._createdLayers;
	    for (j = 0, len1 = ref1.length; j < len1; j++) {
	      layer = ref1[j];
	      if (!layer.parent) {
	        layer.parent = null;
	      }
	    }
	    return this._createdLayersByName;
	  };
	
	  Importer.prototype._loadlayerInfo = function() {
	    var importedKey, ref;
	    importedKey = this.paths.documentName + "/layers.json.js";
	    if ((ref = window.__imported__) != null ? ref.hasOwnProperty(importedKey) : void 0) {
	      return _.cloneDeep(window.__imported__[importedKey]);
	    }
	    return Framer.Utils.domLoadJSONSync(this.paths.layerInfo);
	  };
	
	  Importer.prototype._createLayer = function(info, parent) {
	    var LayerClass, layer, layerInfo, ref, ref1;
	    if (info.layerFrame) {
	      info.layerFrame = resizeFrame(this.scale, info.layerFrame);
	    }
	    if (info.maskFrame) {
	      info.maskFrame = resizeFrame(this.scale, info.maskFrame);
	    }
	    if (((ref = info.image) != null ? ref.frame : void 0) != null) {
	      info.image.frame = resizeFrame(this.scale, info.image.frame);
	    }
	    if (!info.children) {
	      info.children = [];
	    }
	    LayerClass = Layer;
	    layerInfo = {
	      shadow: true,
	      name: sanitizeLayerName(info.name),
	      frame: info.layerFrame,
	      clip: false,
	      backgroundColor: null,
	      visible: (ref1 = info.visible) != null ? ref1 : true
	    };
	    _.extend(layerInfo, this.extraLayerProperties);
	    if (info.image) {
	      layerInfo.frame = info.image.frame;
	      layerInfo.image = Utils.pathJoin(this.path, info.image.path);
	    }
	    if (info.maskFrame) {
	      layerInfo.clip = true;
	    }
	    if (info.kind === "artboard") {
	      layerInfo.backgroundColor = info.backgroundColor;
	    }
	    if (parent != null ? parent.contentLayer : void 0) {
	      layerInfo.parent = parent.contentLayer;
	    } else if (parent) {
	      layerInfo.parent = parent;
	    }
	    if (startsWithNumber(layerInfo.name)) {
	      throw new Error("(" + layerInfo.name + ") Layer or Artboard names can not start with a number");
	    }
	    layer = new LayerClass(layerInfo);
	    layer.name = layerInfo.name;
	    layer.__framerImportedFromPath = this.path;
	    if (layerInfo.name.toLowerCase().indexOf("scroll") !== -1) {
	      layer.scroll = true;
	    }
	    if (layerInfo.name.toLowerCase().indexOf("draggable") !== -1) {
	      layer.draggable.enabled = true;
	    }
	    if (!layer.image && !info.children.length && !info.maskFrame) {
	      layer.frame = Utils.frameZero();
	    }
	    _.clone(info.children).reverse().map((function(_this) {
	      return function(info) {
	        return _this._createLayer(info, layer);
	      };
	    })(this));
	    if (info.kind === "artboard") {
	      layer.point = {
	        x: 0,
	        y: 0
	      };
	    } else if (!layer.image && !info.maskFrame) {
	      layer.frame = layer.contentFrame();
	    }
	    layer._info = info;
	    this._createdLayers.push(layer);
	    return this._createdLayersByName[layer.name] = layer;
	  };
	
	  Importer.prototype._correctArtboards = function(layers) {
	    var i, j, layer, leftMostLayer, len, len1, pointOffset, results;
	    leftMostLayer = null;
	    for (i = 0, len = layers.length; i < len; i++) {
	      layer = layers[i];
	      if (layer._info.kind === "artboard") {
	        layer.point = layer._info.layerFrame;
	        layer.visible = true;
	        if (leftMostLayer === null || layer.x < leftMostLayer.x) {
	          leftMostLayer = layer;
	        }
	      }
	    }
	    if (!leftMostLayer) {
	      return;
	    }
	    pointOffset = leftMostLayer.point;
	    results = [];
	    for (j = 0, len1 = layers.length; j < len1; j++) {
	      layer = layers[j];
	      if (layer._info.kind === "artboard") {
	        layer.x -= pointOffset.x;
	        results.push(layer.y -= pointOffset.y);
	      } else {
	        results.push(void 0);
	      }
	    }
	    return results;
	  };
	
	  Importer.prototype._correctLayer = function(layer) {
	    var traverse;
	    traverse = function(layer) {
	      var child, i, len, ref, results;
	      if (layer.parent) {
	        layer.frame = Utils.convertPoint(layer.frame, null, layer.parent);
	      }
	      ref = layer.children;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        child = ref[i];
	        results.push(traverse(child));
	      }
	      return results;
	    };
	    if (!layer.parent) {
	      return traverse(layer);
	    }
	  };
	
	  return Importer;
	
	})();
	
	exports.Importer.load = function(path, scale) {
	  var importer;
	  if (scale == null) {
	    scale = getScaleFromName(path);
	  }
	  if (scale == null) {
	    scale = 1;
	  }
	  importer = new exports.Importer(path, scale);
	  return importer.load();
	};


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	exports.TouchEmulator = __webpack_require__(50);
	
	exports.MobileScrollFix = __webpack_require__(51);
	
	exports.OmitNew = __webpack_require__(52);


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, TouchEmulator, Utils, cancelEvent, createTouch, dispatchTouchEvent, touchEmulator,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(4);
	
	BaseClass = __webpack_require__(6).BaseClass;
	
	createTouch = function(event, identifier, offset) {
	  var touch;
	  if (offset == null) {
	    offset = {
	      x: 0,
	      y: 0
	    };
	  }
	  return touch = {
	    identifier: identifier,
	    target: event.target,
	    pageX: event.pageX - offset.x,
	    pageY: event.pageY - offset.y,
	    clientX: event.clientX - offset.x,
	    clientY: event.clientY - offset.y,
	    screenX: event.screenX - offset.x,
	    screenY: event.screenY - offset.y
	  };
	};
	
	dispatchTouchEvent = function(type, target, event, offset) {
	  var touchEvent, touches;
	  if (target == null) {
	    target = event.target;
	  }
	  touchEvent = document.createEvent("MouseEvent");
	  touchEvent.initMouseEvent(type, true, true, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.shiftKey, event.altKey, event.metaKey, event.button, event.relatedTarget);
	  touches = [];
	  touches.push(createTouch(event, 1));
	  if (offset) {
	    touches.push(createTouch(event, 2, offset));
	  }
	  touchEvent.touches = touchEvent.changedTouches = touchEvent.targetTouches = touches;
	  return target.dispatchEvent(touchEvent);
	};
	
	cancelEvent = function(event) {
	  event.preventDefault();
	  return event.stopPropagation();
	};
	
	TouchEmulator = (function(superClass) {
	  extend(TouchEmulator, superClass);
	
	  function TouchEmulator() {
	    this.mousemovePosition = bind(this.mousemovePosition, this);
	    this.mouseout = bind(this.mouseout, this);
	    this.mouseup = bind(this.mouseup, this);
	    this.mousemove = bind(this.mousemove, this);
	    this.mousedown = bind(this.mousedown, this);
	    this.keyup = bind(this.keyup, this);
	    this.keydown = bind(this.keydown, this);
	    var touchPointerInitialOffset;
	    this.touchPointerImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAIHpJREFUeAHtnXmsZWWRwN/Sb+luUBYjezMNGBxlZAmgMDFhJkAUGSRpl2EZxTAx0cRoZPQ/TZw/NFHUhBj/MEEnBGQM00YYgwZwQjTYkbigw6YgBGZAIbIjSy/vTf3Oe79L9dfn3HO31+8N3kq+V/VV1VdVX1Wd75x737v3TUyMYZyBcQbGGRhnYJyBcQbGGRhnYJyBcQbGGRhnYJyBcQbGGRhnYJyBcQbGGRhn4FWegclX+f7Y3rB7XHw152jY5Kyl3NTtpY43SMx1TVDHG8T2qq4ZVYJWaxNl/HmeaeIr520xlwXO80xjp5y32V4z8n6TshYCzzHX0fLExJzpurn7KguZ59IlZq28ktbumsVlYtZqoDlO6V6wOuyric57biokfGW9Yuyqm32sKTonZU0FthxMjk8a3I1ukmFS2bL5RmThMi7pco4xeJmvA3nO1wzuNSF7O+AcF7Rz6bp5lkFPLQdd0u5FufMFicAWDF5JM68bLM/8PIcGtLU0WwM/TeQaCKUKIccD7Vy6DlNI+Lvhc889d/6yyy7bfMwxx2x67Wtfe9j8/PyhU1NTB8aYn5ycnA39uRjzMYCXYry8uLi4fWFh4aUYT7z00kuPPvPMM4/cf//9D3/5y19+8Pvf/z46FNCmKHEufqZjSacxoIE10wgmeCms1f1pLBlD52GR4UE7nz7uuOPWXX311SccddRRx2/YsOGvp6enj1iW56KVhQmV3SD70gd4YdeuXf/zwgsv3PPAAw/8+uKLL77jzjvv3Bn8XTG0b0M4z76kcQYNiJdmq/STza02GEPG0HlYaPF0yKcOOuigdbfeeuupmzdvPmNubu5vggefQjBycUh2LpDJF9f51pe48hl2mO98+eWX73zwwQdvPeOMM25/7LHHaIZefOJPnyUO0d4HN773PS951L/FhmvC4UmDHdPf/va3D3v3u9/9D3Glnxz8fWJQ7HLYCOIy+RYgllaQY5Du+AwNeOtiwKMZpJ+Pk+Hn119//X9eeOGFjwSfOPQJxo9YOlgV3xjE8PcqsKnVgOzXZItJMLTYK2/d1q1bN7/rXe/aElf7iSEnaVx5HsW5AUg487qE52RLl/HE0so/cpvAwhNPHjQCY/LFF1/81Q9+8IOtW7ZseTDm/ZwKoV6B8ThfcZw3vuLOlh3oM2OLDa9M+LprrrnmyPe+970XzszMHBdyCktydyxjm8Cig/MVR1JNrBg/0kFWkHnEgDzHlWODpug2Ag+V0DPgHTt2/Pd111137UUXXfRQzG1Q48qxSYdaJ54yLmQrBmxkb4L+wOUoCz992mmnrb/xxhv/cb/99vv70CcxFj4X3yvfZKKXR0w7yYXuB9ritQE8BWgARnUiPP300/91zjnn/Pu2bdteDF6O02bIcUoTH/ReATe4N5zpq1vhaYLqSvrNb35z+pvf/Ob3x8u21wSPgm+PkRuAJDK38GDAROLHREobA3x5rClBmfpZLs/TwZiJm8LTAJwIFY6XlM/GK4Zrjz/++G3BYx80gg0gNmZxqHRih14xcDMr5mDZsH7AjpxA6OpIPfbYY+d//vOfX7rPPvucFjyKzsgNQNEZJItk5qTFtAJ8wNevNHgQaLKHLWTEbyPYBDQA7zVUjfD8889vO/nkk6/87W9/y/sJxG3z5gZ2L8YpDvWVAYJeabAIYEdOmPfOmW9961ub7rrrrn+N4p8Sui/E+HMaHKOMl2PYFCTRJjCRJE3aK6zEWQe6bTTZs5DEYbNSYOIk/udjsIcX2BN7Y48xpykY3kLMh/nJOQu1lQMdrZQH7eeNuVlxdcVEck5/05ve9E8RCHySSSK58h0UwWIH2dcVjn+KbDysz6AMDJT6pXxJ65Wf6hM7NKM60QJ7EnBb4J3HhbvvvvuquL39NGj2lk8CGxV/jiArGjxyINCVAm2bELBFB3eu/IceeujsTZs2bQkeCeEKL6/ynJgQr3nIe/WWQANwS6huCw8//PDWI4888qaY2+A0t/sE2wBgQLw0G9FPizQicx0z2gU7aov/hz/84T0HH3zwWaHHFc+g+HVJCXYHSAZ2m5KiDFwH5fpSv01eZzPzXI9d9k0TMGwCToL5P/7xjzcfcsgh/xF03X73ShM0JShiGhi0CXbUFv+pp566OF7i/W3oed/0yvfebhLagsGPSUdXGjwI9Guvmz4yTjtywO2AJmCsjzEfLxVv23///a8OelWagK5cCWDTjtrix5W/JYp/eujxsOTVz73f4lO8XguonjiW9rwW3RK0I0ae6X70WccgHzQ0R73PMgvkIHLxYpwEW4NfB6wRusWgTl941A3AJgUbAEwTdO75v//978+MY//vgkfxeWKmAbgCaAA2nDcd01bAh0lGWdqEDStvDaBQKP2xH3jgTvGX54vkInLyzNFHH31L8DK4D3jlXrLewDSFGRWwQQDs2OPq/8UvfnFq/Mr2vNDxpZInAMd/efWzaTcuDtZuPPgkVpxpePLFg8i1Iw6znRgyrTz7yDTFZ4/slaZn79VFQE7ITcx9eZhzZz5zjkN1eOCqHBXkIAmeeb73zVxxxRWHnX/++f8cfJJQV/hgV4klkYAJlRZ3k6PTBqNe3689m8L9gafiNnDcgQceeGf8Qon3DoBs1+IvSUb0c1RGc/Gh7V4agNvMTHT4hnvvvfdf4hc6+8W86vrAPvGzUZIiMMeOCZAG10GpX+qU60v9Ul6uL/VLebm+F33WkCeu+OpVQeCN8Yukp974xjdeHn94Qo64LXoqkp+6xgn24EAQw4I23JCY4jPY4NwTTzxx0QEHHHB80GyMYfG9J5K0vyQgT4xOjoLewHjyySd/HSfBNUHnHJEnG0AcrM5FAt030IGjADdj8fMJMHPbbbedFMU/IRxx3/ehjwc+OtyNuSkaoW2oC85027pe5dmmPjLGjjqZzjqZzjrSyNm7D7++FH4xcnUiOQtZL88DoTY4DNsAFFwom6Dq7BNOOGH92972tnNCyQ36xM/RRjJMCHZMmrwsl4cOIM6064fF2SY0voFe4+lVX3vkgkbo5Iickbvg5SbIOQ5RBbkG8nrGQy0OLzmgfNV3jrV4jXt+vMw5NXT5xUg++imSiQqyL2Advl0vPex+moJYaX/ETf6q22VgbgX7PPLII7cffvjh3wu67lZg/ojNPATZH1CoQcFkE7gbwB5zHvxmL7/88sPOPvvs84Muj36P/Rx83oS08hKHyT027Zosc13mZVp5ibNOpvWRcbl2kDk+KGiGyde85jVH7rvvvvfedNNNvCrwVENH/9LWgnlfMPDC8MJaR776q6f+kM0/99xzl8SvQTcFXf1KNDCdnI/+mI5hOQPmkvzxCyNOgY3xdwQPRxP8W9DkLr9TakPkhguV/oDCDQI2jkGDbYLqBPjKV75yWBR/c/C5rzHyMVYXfN4IcuZZT558sXyxfLE2MlYGzrQ6madOxvpq0i/l6onr7CvjAiFXjJfIIbkM2tPVPOfch7i6GMF9AUYGgezcgAiwOvoD80uOC+ITOX8VNPd+bgFsyKM/yK6AfZJkfNJgoE2+pPXKz7Wm/0pke1LVBRRsfmFUPQvEL80ejFcG18acC2mkp8CgzwAklJGLjy3GzGc+85mD3/nOd54VdL76KT7DIoqDtRtPfhOu08+6mUYXyDzocp51Ml3qIquDYe01ra9yvH79+oPibwvv+fGPf+yzQNYnHud1sXXl4aBfsPh1DUDXzseT/3nx5P+moJ+LwZO/XWugrIUexH8s66zVHrwMbfb17fpSv02efUGX+qW8nJf+6uSeppwC+8bfDtwVbxXfELSngBeUtw5icJT2Guc4GRTYRB7VLSA+hLnu9a9//TEh48i38F75BAiUeInb309tsKpMKEmBB26CvF5azJo6OvNKu91kTbpNa4idZwEweZwhp+Q2PrRKzcine0SH0WQrRM3AET4I4FCA7twKvvvd7x4bf8rNSUDxGb7bl5uAYEc5SAb2wJkepY9sK/vItDqZl2nlbZg15Ms3iLaTU3IbPC40813WIUT9Qb8nAA51Kg0moOoEeOtb3/rmoCl8fuhjQ4CYNSRBW9LgQWBYe4Osz7FKi7HHXt2fdD/7Zy0NQG7J5exybu8NmlzTIOg48K0/4whWd8D4IKBTMDbA0/Gu1Ww8rW4KmoDtXo8rNk9gDGlwppX3i7ONTPdqx9MJnOle15d6OYZMq5d5mVYOhs8gj4zt5JYcB00D5Nxbj2D3B4M2gF50TEDTX/ziFzcFJnh/wWHx88bq6JwEN56xCXFtv/quE5fr2Q88AT2gSR++NjINT75YG92wuq4Xkz8vJE7ViS996UtHBqryHdj8IxoI+rkF4AzQqZgmYkyfeuqpRwT23k/gbIDRC5CgbpDl0uJynXwxsUK7B/li1pe0a5ABpbyJl/l5DfxuUKcLjzg6TXDKKaccHvP7Yph35Hm4ps5eqO4O/TQAK3EkZKdVA8RLv0NCyNVPwHZxT4FotAFrI2P8O5fO8WVTxIIMDEirrx0xOplmvlpAzJ4E25dzzAlAzonfEWQFzHuOHSP9gg7FVSfGZ/pmN27ceEAYowFsAgJnAwQkzjS8upF1Mq1u5kEPO4xN+6PGZbxt/rI+ulxQ1SlAjsl1zKu8B7YO4mD1DoM0QLau0+kPf/jDB4bAYHPhy83kzTcVLutkuld91uSRY8i0OpnX5GMYft5DpptsZh1jtAkWlnPtgyA1GBgGuQVYdLBdOBVf0kQDGCQNYBMQHBtFHwxIgweBUdtri2FYf8OsN2fks8pv5JqT9n9jmH/ymIdrgt0d+mmAsljOqyDic25+jp8gLT7dK+SgpMXYgtamtHJtZFzK8ryX9dlWSdfFg44+Slyur5u7ps5OnT952rIBdsRLwdcG0+IjN2/qlmvl74F7bYA6BxiDX434zR9BEWQuft50iBqBRsGODSMNrgPsItO+dNZXVre+jedaMfqZblvfr7xt/8gZVX7j/QAuNvbqCLKiwYI5cV6Le20AF5cO6UJ4U/Fwwt+vWXwwCbOgQe4GBgcWcoLrEoJcfXXF2ChpfWg/Y2XZnrysJ62sSb9Nrh1xqQ8/x1/unzx3chu55hdEndwHbVxgbQfZDv02gBZ1yBx6at26deCqQwOzATaUNxXTDsgXdwSJyDJpMWp1dB0PXZNi3GWCS3v96pfrjUOMPIN8cZZJZ5nxVs8Ay7m2AdR3b857woM2AMZx6JiIr1/FFm8CESQBgw2KzUC7Kele5bG0K/RiHwP671c/r60LxAKBAfYlj3kv/swJ+tJlfrC5ELnmj0cB5I6K0e+PYRpAXwTgCVAFGHMwmzbhQe5Gl3P1xHVy/GQ5OhlKWTmv0806JZ39SYMBdOVVjGVeSZc2lYPrZHU8db0N7IoTwPcBjCfb7YsepAFwquMOvXws5cLnzZRBKcsYW86l9cN6ZaWturm64m46yNQTZ16mlYONEbl0jhd+E2Q76PRiz9wuLOeadfjTZ6aR9QSDNEA2rHN4Xv1sxodAN5rXQLPOTSvLutJidZqwttQv7Q8rL/3qR4y8pI2hXMtcGVgo18PPvE4DFPxsQ1s942EbQEeTOwOiMwnS4kN3g7w5aJPSbU2TjLX4MxnSOYbSH7bk9bIe/QyuhSctzry8JtOlbi/7r14JRKp5q929Zpt906NqgIn4OvUd0QBsikHipQnKzRm0mxejk2nm/YBrM9YndqT1X9ouGwY9eaVuL3Pi0Cf60vrPcWpPnvMSI68GuS6Fg85H1QCLy0F1goyA8tVHfN02iMwkoTssYCsXULqMST+D6BszNqTzHjOtjv5KXLe+1NFGznWdTl+8YRugs8n4/vyd8fXtPKnKExt4xnVBZv06eT88bYnbfJdy14lL3/LF5fpe9Jt0Sn6eV/7IdWLmGBK7N3KQBsChTjt0fBDkxfi2q43Lbjv83sKovYLyUk8HMIB9ecylm+ToZCj1yxMCuby8bqXocj+lH+Op+OR6WSHnOdPl+sY5V+ywgOOF+K8ZfGjBICoe/OXhXDl8eZlWHuJKDgbQAXq1p261KH5gF9B+G84x6XMYjD9tZlqbmQcNiKHRs2kX41PDfNpKe8gHhmEagAAdE/ElyARFkLlb3WCJWecGtJGxsnKd87b1vhIBZ1ofw9rXThMe1n653v3GdiYm4hvFuNiA7H+J0+fPQRsAx0IVXHzDN0FRfMBuXZotFRvaApbYDbqhMgGubbJXrkcPnoA9QL+lvn6bcBlP23p8oSOU/o1DXNor/WEHHfI6dfvtt9edANkf+j2BBWtTRs9B0/hXqbwnzRccrY9Pruwbt4HTgqYR+DgYL1UGCirWrTawVxNOLNKrtR/iIdf8FnBj/LOsbY8//jgfu/Prdsi1p53NQ6yt8fZ6ApSGnOtkMQLaFZ8JpPA2SpBVAB2dLnODbroiShv96pfr2+b5tpHptnWDytv2Qy6rvJJjcl3kEjm+M5TzLOvQvTYAC0qDzi3awu9+97unQ49AAeQdWUErA2tHHKxqnbjORrleO+IyoaWNcn2pX8q1Ky71S/tt89I+e4UnsB7QjrLJ5RzLV0/50qrdbcmrxf00AAZwlEcOZGd8weEzIfePFdEHsr4066Dz+kwrU78Nl/ba1ver7xUHznRbXE3y0n/ee5axXuDCml7Osb9yd13pxzWt2Ku1VTEUqiMoME3D8DmAX01WX2kSX3y8z5/+9KcT4792citgEKjBsd4NSesfvrwgW0HdpvVt8tJBm34pL9eX8Zf6/cqzfWxx/18f77ZufN3rXvereB+Ah0Dyy0fw+BsMG7NsiBB1h35PAKyxmTx0uhCB7bznnnueDTlBm4Syo/PaJjqWd5ol0+pnm5lukmMDPQE9oEkfvnbVyVgZONPqZF6mlbdhYwOby2lyS46XfWbf2R5reoZ+GwBHQnZKMFUXfuc733kyaN5hxLZNkHWh8zEK7Xo31YaxgU5pt2le+ssxZFv6zbxMKy9x1oFuG2U82DMPpe0QVXmcXs4teupmP+gB8HoGCtQP2I0Ul8FtgGJzG+Dl4Ib4LmC+2erY2dlZjqZ8G4hpB2wM/RO0PJSklXcWNhBt60ctL8Mo4y399auvPXJMftfHfyWdiz+8vje+S9iX2X5TCCeCDUHz4JvRE+BgGNCZXbkzAtz5k5/8hCBpDuy7GXXBBmq3Z16mlbfhvCbTrsu8TA8qx0Ye2NFuprNOprNOptWRF2aXrv6f/vSnz5PbmFtwcq4+egMBReoHKCYDkAZTaEZV9Piv2rs+9KEP7R9zAyZQNrW3AH9ATpC8JcnuP5X1qr/76j1no7BnXjldZy+55JJH4h9NcaL66WsvOptFn3tG04VjMbuo7CEyMLG3gc67grFi489+9rNN8XFxmoJ3q+zaJn8Ej2ygTcS6ErSlv1HbL/21zct4Sv26+Mhd9fQfb/0uxLeDPBxzTtb87p95tQnEpf3Geb8nAIZMKjgPAnasi1Ng4QMf+MB+wTNINunwNMgBywu1oQE/gP6kK+YAP4a1V653r037J682wPwHP/jBxyOfFJ6Xfbzta05dn/cZ4t7BYva+or7oNBKj8zAY9Mb4FyiHn3TSSdj2YZBjC8AvQetf2kShk6FNv02ebUG36Zfycn0Z77D6pT2Lvz5yOBH/cvaRCKB8+Mu3gIEbAUf9AsE2DYKiO+nSHZ/85CefCGxzBFkBaw0YnGntoggtoAM06WcbWXdp1Su2tF/q55gyrb8SZ51Ml3rOs06m6+TETF3I28xll13Gy+oqn4G98rHRNELUO+BkEKDjGUDG0ARfjfiPoJPHHHPM7Fve8hbuZWyCDRN4CfLcFPImXuaXdpzjB9CfdsXItJPpJjk6GVzbpN8mz7agsz455KXf3NVXX/3yV7/6Vd5e9yVf0/EfKoOBxet3tesotEX3Sq+CDz4fFt0Qr1033H///QfFW5jcv9gIXeyGg+wJ8MEa/Uo32WnTb5O3BdW2vk3eZJ91Vf7iLfX5uHgee+aZZ7h9MnwG8BTgtLXBbfimfIRqPQx6AmCNYAVpsKM6xuIPGKeeffbZqXPPPZc3igyedQYN3QZuDJzppnVZJ9Pq69sEwpenTjesbtP67BO6nGNbnn7IGzmrXk3F7fP5+Lcx3Pe5cHp5+CvtxbJ2GEUDlMXHq5upcDzILJ544olz8d+w8EfSfBg0OSXGRrcNKXNdv/rExVpjZ32GNvtZ7jp5zrthfYMdxMLVP3v99dcvfOpTn/Lop/i89vf4Rz83HvOBoSkBvRpkvaO678fcWwGdzG8Jq1tBvEU8H383uP/mzZvZDJvyCAuyssFGjEd6qM1h+P8JkDPyNx8v92bjS6CejHf9uF3mo58GIGfmzSYgRwPnCafDggGICcyrnCOfwF+ODW3fsmXL83FLoDHo9FxsN+NabMnT7mpiY1mJ+GKrFayL3KyLHD1HroJTd+wbR87F8vLB0DC3AD16AjDPdCmfiq88r8Z5553H+wU+DFps9PPGutHqggF0gW5rhpFpu3Ky/EOfWaaPzMt0KSdfXITUYf4jH/nI9htvvNF3+mgAj3+vetfX+Q71/mFUDaBnr2rmJV01xy9/+cuJF154Yeass87Cd7kx7bRhE2BC0JfXtnYUcn01+e9FXuUjgiEPc5/+9KcXv/a1r/HQx9HPsPhcKJ485QkQouFgFA1ABG7GaCx+5ktPxm+2JuJ/4cydfvrp8MomMKndMH5Msj67YXW1Wa7vV64dcWmvWyzKvPLn4vt/pz73uc9xv68rfl1+tGHczvvGo2qA0nFuAIJ0jl5F33zzzRNHHHHETLxVzLyts9HJdqTBvYxQ26NhWCdI1+GS55oSqwdfGlwO5J3iX3nlldMf+9jHcuGheQbgys9Xf2lHH6E2OIyyAXKRiaicyzPwyRtuuGFibm5u5u1vf3tbE9AggI0iXTFrfujDpKEiL9NN8tKka5v02+TaY58Uv3qz5wtf+MK6j3/84xz1NgCYh2YbgP26Z7G+QjQ8jLIBiCYXvYk2ajYy+aMf/Wgy/s5t5h3veAf68HrZaLV2Wd+EiIPdKXYdD3kJ6oHrhrHlPZU28ry0p4zi8ypo9hOf+MS6z3/+8xSaovsuH3Nf71v8nI9sN1SHh1E3ABGRpJyoTJcbYD4Zfzsweffdd8/Eu4UT8X4BPDcthpdHTDtFzrQ6mZdp5SXOOtAloA+U65rm6laL4geFZ8zGn3bNXnTRReu++c1vlsXnJKD4jBW974f9DuTidJhDEtoEO0wAmKbjKvCNIt4s4m3i+aOPPnr2uuuuW4h3DX0CJhEmOchGQAdfYEAaXAfD6pc2m/zBZ7DvuXgFNPu+971vOj7cafG5+tlrXfE9Ady/exPHsuFhJU4AompKvBG7CTcHfzH+QeIED0Xx+YKZ+AsYZU2ngHJwWYDMy3rSlT9+LAN8QHmJu9l3nVhbzCl89fZuvMRb/573vGfiiSeeoNgWHuyxn6/8vVL88F1djeCVgF6bAN+dIsc/SJz84Q9/yCdgZ0877bTJ+NKJnFALU8arTpbLK3V7mbu2zl6WaavkeeLNPPDAA3Nx5M9fccUVu2Jv+cqn+B75q1J8gl+pE8DEtDVBp/CxwGRXvPgV8uTXv/71mcXFxbkzzjiDWwG21Mc+tJALoJ1umHWuybRryiteP2LXZn1k3uLI6+xnP/vZje9///un4/N8FJiC+7DnLc6rn73kod3sJ1RGDyvdAETc1gR5k3nji3HFTNx6661T8YcR83FbmD7++OOzLrbVlwb3CtpCX7oO6yPjvIb9MSz+7FVXXbUx3tNf/73vfS+2UF31+di3+OXrfBugyQ8+Rw5txRmVQ/2YLBMm9l5JQ1YvkxKu/iyaeTwkTsXvybd/9KMf5UoigT4tkzyLF2RFY1ueNBiAL4+5tHJ43YD1xIx+J/Y4sTbEf/qejYc84uGq5wp3OPe4L9/kcQ/YNm5xsFYGet3wKLzrC5wHCczDJqgenkJGA+SmmNm0adNU/NuU7RdccMGLRx11lAn1FQOJxL44yD0KDi8D+iQbDEhbAPlgYgWIbyru8TPXXnvt+m984xuz8Xf7Fj4X2wag4MaKXh74ySOm1Ry8ouDGVtRJMq4/cDnKJsiN4MtGm4Hkz8QXU07Hg+JiHLfbL7300j/H7xdoAk+FnFALKU4h1ZJNcRLjdHz0bTperWzcunXr7LZt2/iWVHxSXIvsvT3zcmwWv4zR+MS1wY2S6UZHabPNlj4zJrHMGWUjUOy6ZoBfNQLyaIapE044YTEaYseZZ575UvzKmSLYDEF2HhpzcjONb+bGwBpj4W3ruVtuuWU+Cj5zxx13UHR0LThYuiw6fOMoC8/cGEocopUHNrsakP1C52EziCk+tI1g4cWcDsrQrUY0xEQ8Myxu3rx5IW4TO9/whjfsiLEz/jh1IT64OhHfs7Pr0EMPpQATjz766FR8v9H09u3bJ+KPMafuu+++dTF4CccHXKbink7BUfUqFlt0cB7ImWMfmuJabDE8R5AV2ATOVxznQqy4sxoH+rcBULHw8KTBDgpsweswevDVF+tDHCp7gAURU6w8LCrYItfhvAZbuejQgD6kK+be/kEyVhuMIWOLJKaI0GJPhc4VHzJpC56bwLXIAO0uzZZ+5oJYQIvH3OJDU/RyyHdNxtoW4xEaEC/N9vJPErFWwFgytlBiG4C5hYa2IeTledZlrzYBNDIgF4FCAmAGMmmKLg1mnuXQzqUzDnHHF/xVBxOw6oEsB5DjgXYuXYdtijosr25d3Z5zsTJt0eFB1+Gsn2n8OIcGmK8JMMFrIpgURI7L4iGWVp7nJe2VDj/TupHnnMIKFshiw5e2mCVGJ/PyHBrQ7tJsDfw0kWsglNoQcnzS4G50kwwHymqdJaaFyrikyznL4WW+JuU5XzO414SsdsA5TulesDrE30TnveVClbTzXjF21c0+1hSdk7KmAusSTI65jpYnxlSm6+a6KwuW59IlZq28ktbumsVlYtZsoA2BlfHneaZZXs4bTO7Gbips5rOgnO9mZC1PBknKWt1P3V7qeIPEX1fgOt4gtld1zagStKqbaHE+7B5fFYVuydFYPM7AOAPjDIwzMM7AOAPjDIwzMM7AOAPjDIwz8JeRgf8DaDwRu+DgmJMAAAAASUVORK5CYII=')";
	    this.touchPointerImageActive = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAHipJREFUeAHtnXus3VWVx9v76L19UQptoS8sFCqgDsMrpURBOwjKSHhpBBNGZmAkJhAyf/ivMUZj1MjIEB9MIiRQRV5OjBODjjOAg84MSCmFoVAp0BbaAiOUtvRBe9v5fvY53+O6u79z73nd3tN7z0rWWWuvvdfea6+19t6/3+/87rkTJnSg44GOBzoe6Hig44GOBzoe6Hig44GOBzoe6Hig44GOBzoe6Hig44GOBzoe6Hig44GOBzoe6HhgzHpg4pid2eCJtWKeBwZ3OTZKPWNjGoNmURTsItkgpQYLh31SjJRjGvRnQ2r5HGI58nSel2sZMAa5Gk8/sa6WftuiTSMOaQfDo91FfJEMu6O8qIwsD2Qsm89prud65G0NuUPa2lgZF+01X0SLZMzNcs8zLyOPwct5lyON/FD6HrOtaJED2spAGRNtNB9pzudl5hNlsQxfDYoCG2XwRvqoxrsO2nZgx7SdYTIo2mYemvOW5ZQ5IesKOvBA3kdJenAQke8XOvDmHeyhKLquhwfcT6nUBp92RBuYMsgE2xUpfC1IkI0Tb7/99lnLli07/thjj503efLkuX19fbO7urpmTJw4cZJor9pOKiPB2b1///69Bw4c2CO6fc+ePa9v27bttU2bNq2/7bbb1t51113vqg3tSASjg2x5LMMDlpVKbZQIdrANG21qeyKtFnSvbOq7hSnoDzzwwEIF/PSjjz56SW9v7/EEW3UxWPCAA4a+A+VxY9/mJwwMDGzcvn37mtWrV6/81Kc+9Zx49zsQ+nO/DnqkHjdS+FEDT3jUDCgPHO2Ar4YORgq22qXAP/jgg8ctX778Y0ccccQZCvhMyQmIg7Nb/LYyviO6vcy/J7q3jPtEAe8IfeKnCunryDKFZ7w0JjvE1q1bn7jnnnseuvHGG7dI7iTw2EMlAnWAaak0Cp/R8aMwfBrSNkTqBIgBR0Y5BUEB71+xYsVfH3PMMeco6MdIjuPBncI3hZvL+H+iBJogkxQxUA4A1GOapkBLDuWB2WThgjLOF50uTLboqFj37LPP/utZZ531lGS2A+okpH+QsnmxlQRANirAZEcTPL6dHmkMfiXwN91005Ff/vKXL9MWf67OcVYsjt4l3ChcJ3xVuEfooEMdCNo6AA4IY1JvW8RWLhzzJCARGJMdgmRYInyfkOuInr17925YuXLlA+ecc84zKseEc+BNow3wgGmpdIg+46QP0ZCVYRxsBOahBDsGP62yz33uc9O///3vXz1jxoyl5XoCy+r+X+FLQrZ6As/WTqCpd8BNCQDgAJRKpXL0hfloj5OBBIAn6CQC1xgnCz8g5NggEdbdfffdd1533XUkI2M7GRgXG4oSQeJDnwSeKIMfKvCYkcaA2+msthT8l19++YLjjjvuUm31/ZIR2E1CVtl6IQEn+MgddJyeO1qiioPjamO8WKadgbocvRvF3YBE4Eg4TXiKcIrwwObNmx9asmTJv+zYsQN7YiI4AUxjQlazRV20HpjcoQSPlzuVslc+FOf23HfffSdcccUV13Z3d89XmeC+IXxcyMqKK54V5lVW5FRVtwSi3UWJwHUCF43sUicIJ+nOYcuPf/zj2z//+c9vVNkJ6uS0raYOvqlURhYckJEdpdS7x4pOhI+BZ8Wnlb9+/fqLtOovLxu2Q3SVkO2eizy2epCgV1vtqioEnGtbChsMI7S+5xETwccCO8Bi4TLhEcIB3Trefdppp/23eCdBbreTQE0OOqKQjQg044h6DPI4dpppDH4K/CWXXDLtpz/96Q1Tpkw5VQMQ5FeE/yV8W+hVT+BxpJ0G9RgOkFdRkRxZrLeOxEme1+fyvJ5yOq5EmQdHFchu8GHhImHvm2+++fCcOXPuE4/tTl4nAjZ4PrbNVFUjAxg+0uAxoBEdfDuuVxd582644YZ/0FnPqmGl/0H4rJCrfILPeY/jcBSOMziAdpjHpN51bmsa5eab0Wc+AJSdgItFjgTwLOFfCvt0PbBGTyX/6d13322LJIiOkn0tB/efB54yjvKW3/uzn/3sxMsvv/xGyXAcV/f/KeRiz8H31kmQvOJjwBxEVVeCbpnbUcfYuTzKaBPrXYcccNk0lyEH2QlAJ8FJ4tkNpum5wR/f//7336pjjh2ORPZu4B3A1HabqmlrAUNHEuyMSOPKx0G9jz766OnnnXfe34mn3WvCh4Vs+QSfwLPycYIdIza1hSJHz9QyKFCtDjlgPVPLUqU+GtX3PNkNQG4RFwqXC6crCTYsXbr0lqefftp3MCQCyBw9T2wCAdNSqUWfdkKLuhvUDX27f5wBb6dUVn45+Nerjkm/JPytkMe1HAHeJu0QiRLQV+6QKDNvWlarkCJ5lJk3rSiWmSJ5lJn3vEl0rgnYDUiCvxJO37Vr18uzZ8/+Rx0HPtp8vDFfz9lJkM9XTZoHDBwJwAEGePCg4OsZ/hKt/L9VHRN/QfiIkOf1BN9OwRGA+4ECLtvJUWbe1G1No3wk9R08VjbbPfPaKPyNcLu+nTx+48aNfyOeHYIkYWHYT7bLNkNbDgzSarChNtwT8cSYZO93vvOdeZdddtkN4gnwK8LfCVn53hK9AtxPNSqVSjJUazOUfKT16Z+5kAQkNccax9xv4WfOnHnWiy++eJH43jLaT9FmVSVA1lJgsJGAaDy8J5XO/AsvvHDazTfffJOu9injjEeFMfg+C/N+qpWlflASFMlGUz9PgldkIA+1di9evPjiRx555C/E4w/Q/oJGm1VsLbAaWwkYC0BtvLc1T27SqlWrru/v75+rNlzt/4eQr2tZ+T4D2TqtbwdIlPo1jfKitkWyaN9o6GO7z3Ioxx3XBkfpodep8svjL7zwAtc9PjrcVqKRAZzUarBjoQ4ClAToXbt27cemTZu2RDxv1zwm3CrkfCT4rHwmnduV96Umg1aGx0QOtLM+9jFPAk3S86zjDe2GffoC6RrxXiheOJ4b1BB5yxqiuaMa6qSsFA01T/8gk+q+8847jz/ppJMuFk/AnxRuKfM4gy3SelD0TMUmoAxEu827LTTyrkevXfRJchIeP3BNwJPOnXqhZYkeGX9YvJMA242el+egquahVUeAjYJiMNQZ7Iubvvvvv//v9cUOt0IvCZ8S+j7fK1+iSpDgHTz3G+tjHXKDbaEc20Q+r7Mu9FDpx3FYAIDuCmef+Nhjj/2PvgGtdhT4WIj6Je0GPu2UBlQPUsEgI/3CQ0mEHj3w+Ije0TtGPBd7rP48+NaxHhSwHD6vc5soj3w76xNIdj0CzU6wRshR0PuTn/zkEvEsHHYC5m8fMDej2OaBjpsFDDLYOCh9E/zuj370o9M++MEPflw8Z94zQpLA277YNClT9+e+ojyv8zi5POpEPm832vrYBnAc4JunoXrN7cxvfOMbc8Wno1O0KAkkrvgNviGwQxpSLivRh9GGpsBLzgOOPr1WfdXcuXP5MmST8DdCLgDJerZ+n/1iE7AybFfky9UHkbxNLEf+IMWyIG8Ty5EfSX0Cja+mCD8iPEFfGq2fPn36P4snMVgsJIn9hc+wzSi2MWjFDuCRnQSmaev/7Gc/O0PB5x6XgKcMF2UyGA9gg3WgsWyedm4T+bx9Xj5c9PEFweVBEd9+7tad0gnf/e53F4iPx4DnwzwNkbesZtqUskZB34hxYFz9/Rs2bLhs4cKFZ0u+QfiokNXvjBab9HGAbTHvBCmSI4v11qE/87E+l7ejPn7j3GcXWCZc/Pbbb6896qijVohn8fjReEt3AQLWCsChEdPqP+OMMybPnz+frR/j15apty/aM37UU3FQ2fa5LfVRJ/K0AWJ/h5M+tnsXeFH8Xj0mPvnqq68+Ujz+zOfq+aqqcbCDGunBBkQKT59pF9A7fR8uP+7lid9mIVu/EyCO7T6QWZ5TVVWCC+96yy2zPKduF8dCBkRZruey28W2SblF+t6x8A/+ekO4/9vf/vZ5okNdDGKPbRJbH8TJ1adZau2BbQT9GXv0eJOzn9W/ThiDH9vDo2OZ2MqELIttXB9lY0WfubEL4Ct8tldvD/G6OQngJLBPJGoecFyzYINM0/avzJ2r+/6Z6pyr2NeETgDGi+OiB0TqvqLMbZCNVX12AZAkYMfcqQdnU/VcYJF45gxG39g/EjcGZFUjkBsRyxjZ85nPfIYLPy72mAi7AFsbYKNNS9L6P8eyPr6y76bpOcrpKr8kZBGxwKiPPlcxgY8Rl4eljSZA3rGNSWe/Krt18XeSKAaz+sloG+fAUTYvNkGRzHU5LWpbJMv1XC5qWyRz+5wWtS2S5XouF7VFBkAJMs9NFs2aNetEUXyb7wASNQd02Aw48Kb01/XNb37z2J6enmniedz7ppDJAG6XU9fFCVqWty0qu+1Y0Wc+LB4uBnfpKJ38ve99b4H4oiTAHw1DMwlQFAj667nooovIWLawPwmZCAmQZ7yDpapKZsN7Qq53OdbBuz7n3d71Lh9O+t4J8B0+3Hv++eefIOodljnlKFH9gJPqBQ9sPZfpK2XookWLyFa2fSdAbBsDY91IaZvbFXUiH/XMjwV95kISVHw4b968hWW/MH/8HOer4kFlZMNC7uhhFUKDaAC8A9Otx5jzVMZ4Xu1mIl79tAPiuDnvft2fdSwfL/rMF7/hw316V4BvUvMjQKLGAo8iEJ1fktT/6cDQV/cXvvCFI3XrwmtOPL7kVS8mAXgsBzQG2H3QzvXWcd1407ff8OFe3qPQL5EcJR4/RN/hp4bBTq23AwfJwUEfvuviiy8+VpQznz/ohLqt2Eq2WhYpvNETRCfyro96tIly+KgT+djOeqaxLupEPraxnmmsizqRj22sZxrr0AF87cTX5/t0bTVHlDrXW0eiQX6mXBM0cxvI4AZPskvn/9ESsv3zpY8nENtaZzgadSI/nJ7ro07kXT8cjTqRH07P9VEn8q4fjqID4kN8OaAv1fCtgw/FzwDtvGMkQa0f9SaAjXL/LkNTEuinW/jyAsP4IwgbRX01oE2sj+XIj1d95o0vB/SXxTxZrfi6zEffmbff1WRoqDcBhuotGaYLwBlqRNZidIRonHnqzTvYLhfVIXM7eMDtLXe5qA6Z28EDbm+5y0V1yNwOHnB7y10uqkPmdvCA21vusuuQp8U0depU/mrau63roQ2Dt5N6O8DIiPSTDNP7/nyfzQ7AdwCelMeJOqpO4Akn/UxGkfrxrI8PuKAekG95odb+GMon6NQELd8B9Mtd7pOHGBgJBeBJCFMnA3UAZScMPGAZvPVMx4s+c7cP8S3zz+dOm4bAwWpIuaxkYxLVY0sMZAfwBaADRnO3hY+AHHB9TJTxro9P8OeA3q3IHwDZb/iuIWhFAsSBMQgjk8HlChsJJbBAkcxy7wIuF7Utkrn9WNNnXmkxhQRA1hJoJgEIQgxE4stGYhxJEOuRxXKeDNQDblMqlT4ti3Q86ePLCcG3+CH6wnzJW3V8NpMAcZhoAIEB2bqBWFeSlD6ryWObofjxpO9j0EmPX5qdf/JtqxLAgZrIz60rUzGUowCIhiJ3OfKpoT5y2VDlvI4+ctlQ5byunfXx5QH5lhdr7D/sbRpanQAT9gkmTeJvHNIOQOZyfhly4112MFymPTLvIuNZH5+kxSTXpqPAzmgFzR3caJ8EC3CWwvOOO/3HoEY+jh15t7Guy/QZ+agTebcZK/rMIyVAeQeo+BqHNAvRcfX2hSHRmMTr1694AEQQSABDDIZ56szT3rzlUIPritohK5JbF3q46/Pt6sSyb5lPoe+pqBdwTKsgGaV/orC13CFPBO14RATJUIvcbaxnSh+ug68mdxvXmx5u+syjD6PLvvWiQ9Q00HmzMCgbX331VRIAZ6esLfOU84DEMvUOUBE/3vXTYtIPS74jP9nfphI1Ds0mQMxGLvb2P/XUU7wGxpnlHcCBxkoHNw92lFfjx6M+vgP5DqBrzZo1+Db5WdQQY2BZzbTRBIjZB5+eVEH1e7+8BYwMo7nLqBbQjrw23+BDfHlAbwb7Devoc1VVdgX4uqDeBGDgIkCeUFm6R3/Vynts9M2r4dCiYEt80LZPO8DtI2+ZqetMcznlvM5tYl3eJpYjH3UPlT7jpK+A33nnna3PPPOMv2G1v7Evh2oxytulcr0JgFIcIBrirWlg3bp1/PgTffNugMewAyVKAXZimFrudtCiOrdznanlY0mfo3S6cKLOf3xqH0OB6H+XU0WtHzivEfDApjYsfQn0y1/+cqM6pW+/wJDuY1WOwfG4yIBYZ5nltjO2SUplPberVn846nsu+LDnV7/6FT7la2F8bH/b/6aqqg+io2vVtGE4FSS4II//uF2ZoieBU/VPFa8sPxH8o2RcvQIYij4U8PhFcrcptfyz3njRZ97soCfpCeBEvQ30wHvvvce7gbwd5B+MSAtO5TwhJKoNvDJqaz24FQGKaCMGZOg+/R+9V1RPYvhVZrFDrnLX2yaok82JEsuWWc90rOjjO94B7NKvh26UT6sF2zFg/nWDnVWPYj6gy5UEUGcDX/3qV18QZRK8JMru4ICKHRTYGFTb4+BCred240GfOXP1j+96fvjDH7KLxu3fPocaIm/ZsNSOHrZh1sDBwFCQQIOVY0D81Ndff/3jepOVM2yT8A0hSTIcMJFG7aLvsaCPT2cLF+gofVd/FfSQeLZ//tiWOwG+Fay2I6iqdmCgZgBnR/QuQLbuu/fee58XJZN5n73WZwLY5ARwotVDx4K+fdb9i1/84kX5w6vfF4DR5/ANgx1dbwcxIDgcjLsAj4F5Ejh18+bNF+hnTqaKf72MGIx+EZW4Enz4odoMVYcuMFSboepK2qOjjy9ZMPP1n0T4uThWPxd+IKs/vSEs6mRg0TEXo9jagcEaAQ8WqQ3BsLQDiO7V0yt+984ZzV0CiZInkEQpibDHdZaZIqc+trHMbWKdZaZuG9tY5jaxzjJTt41tLHObWGeZqdvGNpa5DXX4apawW/9Ia60ovuRP7R3w6POcV7P6AAMaBXSNGA4SXL4G5lqAXYBHmFO2bNlyvn7+lAuat4T8ZAzJgi4TAIbiqXc7eMNQOm5PG8DlUqn02Y762MRfAc/S2b9HZ/+/ifetn89+kgH/FSWExPUBQWsG7FioEcNADE34xS9+cZVeZmBy3Nf68bDYQasZWxywyMd2yGOdefTMx/bwgOug5qO8HfRZPCwabv0mfetb33palIs9fBivAfCzd1uxhcmNvCZg0GbAAaMP81Bjcvjzzz+//9xzz+068cQTubLlGNgudPJYT6IUHCiALuB6U8tcNkVunci73rRd9bF9vrBf/tqkn9hl++e890MfkoDAG73gJKr4Er4uiE6pS7Hc2PoYDw8lqUDOMoKdjgF+50Y/Gv0x/eARZZ4MclHIZGoF+nfSoJOXh+snb5+XR1MfW1j5c/TAZ4L+x/C/KwnwUbzwy2/9nACmw9lfWB9XTGGDYYQOiI2AOkOhvoDZs1ego+APOgrokmcDXBM4cXDAcKgmCdyOsczXQsvqFZ120ccH3DGlW2X9V5XVCj6Bz7d/HBf9HHlVNQbNHgGMivOBnFrm4HQ999xzAzNmzNi9bNmyearkvGOSJAkQ9a1juctFbYaqOxz02SnnCvueeOKJ9Zdeeula8Vzw+aIPH/mCz0kgUWvADm22txgEMtpIgnFHALL1J9S/SDtVv3p1vMpc4PA7gpxztoXMBih7lVI2X0SpPxz18Q9X/VPfeuutdxcsWPA7/TdRVj9P/ECf/76wJgGcBPgBbAoIVKvABkWKsb4jIJOZ0B798uXz+meJvN1C9s8TkhgAQQSxy1RsAsscaNsONX846RN87ven8eXZpz/96ZUKvh/04Ctf/edBV1XzgacTwI4rlRr/jJkIH41miweZVCUJTj311Cf1kgPvuPHcgFXABaMDKLYC1QJMg9jePDRCO+oTfM786fqqd/9111335MMPP8xFn1e8E8Bbf1xU9rVpnGvdfKsSwAPnhjoR4i6QzjddE+4+5ZRTVioJeH2MJJgr5LqAAGKXAyo2gW01dTsqi/h21a8En2cjX/rSl1auWLGChZB2R9E8+PZh9C1zbgnYma3ozBkZDbXx0JgEabJseR/60Iee1D9Q9k4wR+14BQqISUAwAQfVNMpyvh31CT7PQngYNvFrX/va0/q3MHxLOtxFn32qpgnsa5cbpnZswx0UKDo4pgTCiAP8qJgtPz0u1jOCPv0b+Q/o7oAHIRwXPChiS2zZRNXXaINXfr+2/QNa+asUfK6DuNhzArAw4tnPosEHLCAnQUt9glGthqGSynVMAj5Nhq3wRz/60Vsnn3zygP69HBdGJAkJgjOYPGBdqLFIbpnbRL28zmXT2LaV+syFefVr1xu45pprnrzjjjvY9Rx4KFs/ye9z30E3bWngNU6CkUgAOrYjS6MUlz2hCn3wwQd37Ny5c7seG8/W+4TcOvKAhHocEwMyFK+mlfGHaletrpX67HwcaTzl69ULMjs+8YlPrPz1r3+9VeU8+F75eQIw/4qPxLcUcMJIgfu2o30mQ0k8kNtAAs0KgXIk9OkHESc/9NBDp+hOgfOSFcDWyE+mskoA+sQpOR2ujnog13N5uLqkXKM+uxhffjG3nscff3yDbn//WL7VI/jMySt/uODHJJBa62CkdgBbiGMj5GXqPDlo2u63bdvGXxj9ST86ufvMM8+cqR+cwIk8K8Cp7Aa0BejPfTrBchntYh1l6+RtXXY9ekA9+viUi7wUfF7m1L/PWXPVVVe9rLM/rnoSwFf8zIm5x+0++sXzVZPWgifa2l4H9+Yx7Fw7EwriMALLbgCt7ATw+qeTffrvY4t0LCws//IITvKFU74jqGoQeOwiB1JneeRjB/Xqk6QEP+1uq1at2nLFFVes1T+C9lM9gu7A+8yP5z725EkgUcVO+JaCJ9jSTgs68zhQME8Cyk4AHwvxaJh0wQUXTNOusFj/fp6LKRzFWYkTca4Tod6AYgs6tq8Rfamn3YnrFQLfrce6u77yla+8cNttt/ECjANuiq0OPnPwmc/YhzT4Gq8ycfiRBjsZavQuYJpWjupjEpAI3hkmffKTn5z29a9/fcHpp5/OMwP6wXE4EQdzlkIbBfdXiz42pWsWUezv1t/v77zrrrteufnmm7m3J8i2x0G3DHvjtp8H3oloquYjA0z4UILHgxpxHryTAIpzfTQ4+JH2LF68uP/WW2+drwurOfqrGQKBEwGc6xVGACjXAjjb9kXeutRhg+3AvmTz5s2bt99///0by4FnTDAPuuXYg60RGS+iiqkMHVHwhEd0kKxzjwmNmCdC3A18PMQAIEt47bXXHnH99dfP1r+qnTV58mSSAWc68PA+Z5G5zglDGT7aYp7xYkIiT3bqgm7P73//+zdvueWWLT//+c93SE6AGcer3NRy2zBU4LEFMC2VRvCTCY0GeFw7OqdpZckwKIngZCAgToZInQzdV1555RR9pz7z7LPPnq7byRnaHbiDABxo80mYfdCGMaHY5HKyT/fx21avXv223tV/+wc/+ME7SgISisA6yF7lLrsuX/W2BQoCOS1JR/iTiY0WeOxIk6NlUFplgXq7JdBOBgc9Utc5cbqWLl3av3z58sn64mmKLiD7Z8+e3ae3bfv5TeO+vr5uoW4uuuhjAl/LDgwM7NOPMQ3ordz3XnvttV1r167dpav5nffcc882vd1MII0EN2IMOnK3i8HPA1+UAFI9dGDnH7oRDx7JNjj4OS1KhhjomBRRDl9JhDJP38gAj1Mq/fnTQTGNW3YMqoOPzAE3dTsHnD7cX04ZGdmoAE5oB7AdkTpApk4EyjGwMdDwsUw7t7WeKfN23/CAgwPvwCMzT4DhHeBIo9w6kbpvKJDTkvQQf+KAdgLbE6mDFGlMBgJOnQPtoEfq+qiHzGDeQUHuoCMzT8DNO+CxDE9765iHAi6bT8LR/PDER9OGfOxok3lorRgTgoADDrxp7LfU4s+fMUh5QF02JSHc3tR1lAHLXbYsVY72hx0x2nYUjR9tMw81omO+GqWNg57zlK0HDzhY5qEEFKAuBtdtq1HrFFFkbQE4oN0h2mg+0pzPy8wPmeUuQ4cCAgtEmvMOvtvFessihW8riE5pK8MKjIm2FvHILB+Ounu3cxnqIBbxros08kU6yNoWihzQtsYGw6LdRXyRDPUoLyojc0DhgVg2n9Nq7VIH7fyRO6Sdba1mWz6HWI48+nm5Wp9R7mAjq8bndVG/rflGHNLWE5JxRXMqktU7jxh86xbJXHdYUG6ZOlCbBw77YNc2zU6rjgc6Huh4oOOBjgc6Huh4oOOBjgc6Huh4oOOBjgc6Huh4oOOBMemB/weNeh3RI/q/7QAAAABJRU5ErkJggg==')";
	    this.touchPointerImageSize = 64;
	    this.touchPointerInitialOffset = {
	      x: 0,
	      y: 0
	    };
	    this.keyPinchCode = 18;
	    this.keyPanCode = 91;
	    this.context = new Framer.Context({
	      name: "TouchEmulator"
	    });
	    this.context._element.style.zIndex = 10000;
	    this.wrap = this.context.domEventManager.wrap;
	    this.wrap(document).addEventListener("mousedown", this.mousedown, true);
	    this.wrap(document).addEventListener("mousemove", this.mousemove, true);
	    this.wrap(document).addEventListener("mouseup", this.mouseup, true);
	    this.wrap(document).addEventListener("keydown", this.keydown, true);
	    this.wrap(document).addEventListener("keyup", this.keyup, true);
	    this.wrap(document).addEventListener("mouseout", this.mouseout, true);
	    this.isMouseDown = false;
	    this.isPinchKeyDown = false;
	    this.isPanKeyDown = false;
	    touchPointerInitialOffset = this.touchPointerInitialOffset;
	    this.context.run((function(_this) {
	      return function() {
	        _this.touchPointLayer = new Layer({
	          width: _this.touchPointerImageSize,
	          height: _this.touchPointerImageSize,
	          backgroundColor: null,
	          opacity: 0
	        });
	        return _this.touchPointLayer.style.backgroundImage = _this.touchPointerImage;
	      };
	    })(this));
	  }
	
	  TouchEmulator.prototype.destroy = function() {
	    this.context.reset();
	    return this.context = null;
	  };
	
	  TouchEmulator.prototype.keydown = function(event) {
	    if (event.keyCode === this.keyPinchCode) {
	      this.isPinchKeyDown = true;
	      this.startPoint = this.centerPoint = null;
	      this.showTouchCursor();
	      this.touchPointLayer.midX = this.point.x;
	      this.touchPointLayer.midY = this.point.y;
	    }
	    if (event.keyCode === this.keyPanCode) {
	      this.isPanKeyDown = true;
	      return cancelEvent(event);
	    }
	  };
	
	  TouchEmulator.prototype.keyup = function(event) {
	    if (event.keyCode === this.keyPinchCode) {
	      cancelEvent(event);
	      this.isPinchKeyDown = false;
	      this.hideTouchCursor();
	    }
	    if (event.keyCode === this.keyPanCode) {
	      cancelEvent(event);
	      if (this.touchPoint && this.point) {
	        this.centerPoint = Utils.pointCenter(this.touchPoint, this.point);
	        return this.isPanKeyDown = false;
	      }
	    }
	  };
	
	  TouchEmulator.prototype.mousedown = function(event) {
	    this.isMouseDown = true;
	    this.target = event.target;
	    if (this.isPinchKeyDown) {
	      dispatchTouchEvent("touchstart", this.target, event, this.touchPointDelta);
	    } else {
	      dispatchTouchEvent("touchstart", this.target, event);
	    }
	    return this.touchPointLayer.style.backgroundImage = this.touchPointerImageActive;
	  };
	
	  TouchEmulator.prototype.mousemove = function(event) {
	    this.point = {
	      x: event.pageX,
	      y: event.pageY
	    };
	    if (this.startPoint == null) {
	      this.startPoint = this.point;
	    }
	    if (this.centerPoint == null) {
	      this.centerPoint = this.point;
	    }
	    if (this.isPinchKeyDown && !this.isPanKeyDown) {
	      if (this.touchPointerInitialOffset && this.centerPoint) {
	        this.touchPoint = Utils.pointAdd(this.touchPointerInitialOffset, this.pinchPoint(this.point, this.centerPoint));
	        this.touchPointDelta = Utils.pointSubtract(this.point, this.touchPoint);
	      }
	    }
	    if (this.isPinchKeyDown && this.isPanKeyDown) {
	      if (this.touchPoint && this.touchPointDelta) {
	        this.touchPoint = this.panPoint(this.point, this.touchPointDelta);
	      }
	    }
	    if (this.isPinchKeyDown || this.isPanKeyDown) {
	      if (this.touchPoint) {
	        this.touchPointLayer.visible = true;
	        this.touchPointLayer.midX = this.touchPoint.x;
	        this.touchPointLayer.midY = this.touchPoint.y;
	      }
	    }
	    if (this.isMouseDown) {
	      if ((this.isPinchKeyDown || this.isPanKeyDown) && this.touchPointDelta) {
	        return dispatchTouchEvent("touchmove", this.target, event, this.touchPointDelta);
	      } else {
	        return dispatchTouchEvent("touchmove", this.target, event);
	      }
	    }
	  };
	
	  TouchEmulator.prototype.mouseup = function(event) {
	    if (this.isPinchKeyDown || this.isPanKeyDown) {
	      dispatchTouchEvent("touchend", this.target, event, this.touchPointDelta);
	    } else {
	      dispatchTouchEvent("touchend", this.target, event);
	    }
	    return this.endMultiTouch();
	  };
	
	  TouchEmulator.prototype.mouseout = function(event) {
	    var fromElement;
	    if (this.isMouseDown) {
	      return;
	    }
	    fromElement = event.relatedTarget || event.toElement;
	    if (!fromElement || fromElement.nodeName === "HTML") {
	      return this.endMultiTouch();
	    }
	  };
	
	  TouchEmulator.prototype.showTouchCursor = function() {
	    this.touchPointLayer.animateStop();
	    this.touchPointLayer.midX = this.point.x;
	    this.touchPointLayer.midY = this.point.y;
	    this.touchPointLayer.scale = 1.8;
	    return this.touchPointLayer.animate({
	      properties: {
	        opacity: 1,
	        scale: 1
	      },
	      time: 0.1,
	      curve: "ease-out"
	    });
	  };
	
	  TouchEmulator.prototype.hideTouchCursor = function() {
	    this.touchPointLayer.animateStop();
	    return this.touchPointLayer.animate({
	      properties: {
	        opacity: 0,
	        scale: 1.2
	      },
	      time: 0.08
	    });
	  };
	
	  TouchEmulator.prototype.mousemovePosition = function(event) {
	    return this.point = {
	      x: event.pageX,
	      y: event.pageY
	    };
	  };
	
	  TouchEmulator.prototype.endMultiTouch = function() {
	    this.isMouseDown = false;
	    this.touchPointLayer.style.backgroundImage = this.touchPointerImage;
	    return this.hideTouchCursor();
	  };
	
	  TouchEmulator.prototype.pinchPoint = function(point, centerPoint) {
	    return Utils.pointSubtract(centerPoint, Utils.pointSubtract(point, centerPoint));
	  };
	
	  TouchEmulator.prototype.panPoint = function(point, offsetPoint) {
	    return Utils.pointSubtract(point, offsetPoint);
	  };
	
	  return TouchEmulator;
	
	})(BaseClass);
	
	touchEmulator = null;
	
	exports.enable = function() {
	  if (Utils.isTouch()) {
	    return;
	  }
	  return touchEmulator != null ? touchEmulator : touchEmulator = new TouchEmulator();
	};
	
	exports.disable = function() {
	  if (!touchEmulator) {
	    return;
	  }
	  touchEmulator.destroy();
	  return touchEmulator = null;
	};


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(4);
	
	exports.enable = function() {
	  var MobileScrollFixLayer, handleScrollingLayerTouchMove, handleScrollingLayerTouchStart;
	  document.ontouchmove = function(event) {
	    if (event.target === document.body) {
	      return event.preventDefault();
	    }
	  };
	  handleScrollingLayerTouchMove = function(event) {
	    return event.stopPropagation();
	  };
	  handleScrollingLayerTouchStart = function(event) {
	    var element, startTopScroll;
	    element = this._element;
	    startTopScroll = element.scrollTop;
	    if (startTopScroll <= 0) {
	      element.scrollTop = 1;
	    }
	    if (startTopScroll + element.offsetHeight >= element.scrollHeight) {
	      return element.scrollTop = element.scrollHeight - element.offsetHeight - 1;
	    }
	  };
	  MobileScrollFixLayer = (function(superClass) {
	    extend(MobileScrollFixLayer, superClass);
	
	    function MobileScrollFixLayer(options) {
	      this._updateScrollListeners = bind(this._updateScrollListeners, this);
	      MobileScrollFixLayer.__super__.constructor.call(this, options);
	      if (this.constructor.name === "Layer") {
	        this.on("change:scrollVertical", this._updateScrollListeners);
	        this._updateScrollListeners();
	      }
	    }
	
	    MobileScrollFixLayer.prototype._updateScrollListeners = function() {
	      if (this.scrollVertical === true) {
	        this.on("touchmove", handleScrollingLayerTouchMove);
	        return this.on("touchstart", handleScrollingLayerTouchStart);
	      } else {
	        this.off("touchmove", handleScrollingLayerTouchMove);
	        return this.off("touchstart", handleScrollingLayerTouchStart);
	      }
	    };
	
	    return MobileScrollFixLayer;
	
	  })(Framer.Layer);
	  return window.Layer = window.Framer.Layer = MobileScrollFixLayer;
	};


/***/ },
/* 52 */
/***/ function(module, exports) {

	var slice = [].slice;
	
	exports.enable = function(module) {
	  var ClassWrapper;
	  if (module == null) {
	    module = window;
	  }
	  ClassWrapper = function(Klass) {
	    return function() {
	      var args;
	      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	      return this.prototype = (function(func, args, ctor) {
	        ctor.prototype = func.prototype;
	        var child = new ctor, result = func.apply(child, args);
	        return Object(result) === result ? result : child;
	      })(Klass, args, function(){});
	    };
	  };
	  module.Frame = ClassWrapper(Framer.Frame);
	  module.Layer = ClassWrapper(Framer.Layer);
	  module.BackgroundLayer = ClassWrapper(Framer.BackgroundLayer);
	  module.VideoLayer = ClassWrapper(Framer.VideoLayer);
	  return module.Animation = ClassWrapper(Framer.Animation);
	};


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var DOMEventManager, GestureInputDoubleTapTime, GestureInputEdgeSwipeDistance, GestureInputForceTapDesktop, GestureInputForceTapMobile, GestureInputForceTapMobilePollTime, GestureInputLongPressTime, GestureInputMinimumFingerDistance, GestureInputSwipeThreshold, GestureInputVelocityTime, TouchEnd, TouchMove, TouchStart, Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	
	Utils = __webpack_require__(4);
	
	GestureInputLongPressTime = 0.5;
	
	GestureInputDoubleTapTime = 0.25;
	
	GestureInputSwipeThreshold = 30;
	
	GestureInputEdgeSwipeDistance = 30;
	
	GestureInputVelocityTime = 0.1;
	
	GestureInputForceTapDesktop = MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN;
	
	GestureInputForceTapMobile = 0.7;
	
	GestureInputForceTapMobilePollTime = 1 / 30;
	
	GestureInputMinimumFingerDistance = 30;
	
	DOMEventManager = __webpack_require__(42).DOMEventManager;
	
	TouchStart = ["touchstart", "mousedown"];
	
	TouchMove = ["touchmove", "mousemove"];
	
	TouchEnd = ["touchend", "mouseup"];
	
	exports.GestureInputRecognizer = (function() {
	  function GestureInputRecognizer() {
	    this._process = bind(this._process, this);
	    this.edgeswipedirectionend = bind(this.edgeswipedirectionend, this);
	    this.edgeswipedirectionstart = bind(this.edgeswipedirectionstart, this);
	    this.edgeswipedirection = bind(this.edgeswipedirection, this);
	    this.swipedirectionend = bind(this.swipedirectionend, this);
	    this.swipedirection = bind(this.swipedirection, this);
	    this.swipedirectionstart = bind(this.swipedirectionstart, this);
	    this.swipeend = bind(this.swipeend, this);
	    this.swipe = bind(this.swipe, this);
	    this.swipestart = bind(this.swipestart, this);
	    this.rotateend = bind(this.rotateend, this);
	    this.rotate = bind(this.rotate, this);
	    this.rotatestart = bind(this.rotatestart, this);
	    this.scaleend = bind(this.scaleend, this);
	    this.scale = bind(this.scale, this);
	    this.scalestart = bind(this.scalestart, this);
	    this.pinchend = bind(this.pinchend, this);
	    this.pinch = bind(this.pinch, this);
	    this.pinchstart = bind(this.pinchstart, this);
	    this.panright = bind(this.panright, this);
	    this.panleft = bind(this.panleft, this);
	    this.pandown = bind(this.pandown, this);
	    this.panup = bind(this.panup, this);
	    this.panend = bind(this.panend, this);
	    this.pan = bind(this.pan, this);
	    this.panstart = bind(this.panstart, this);
	    this.forcetapend = bind(this.forcetapend, this);
	    this.forcetapstart = bind(this.forcetapstart, this);
	    this.forcetapchange = bind(this.forcetapchange, this);
	    this._updateMacForce = bind(this._updateMacForce, this);
	    this._updateTouchForce = bind(this._updateTouchForce, this);
	    this.longpressend = bind(this.longpressend, this);
	    this.longpressstart = bind(this.longpressstart, this);
	    this.doubletap = bind(this.doubletap, this);
	    this.tapend = bind(this.tapend, this);
	    this.tapstart = bind(this.tapstart, this);
	    this.tap = bind(this.tap, this);
	    this.touchend = bind(this.touchend, this);
	    this.touchmove = bind(this.touchmove, this);
	    this.touchstart = bind(this.touchstart, this);
	    this.em = new DOMEventManager();
	    TouchStart.map((function(_this) {
	      return function(e) {
	        return _this.em.wrap(window).addEventListener(e, _this.touchstart);
	      };
	    })(this));
	  }
	
	  GestureInputRecognizer.prototype.destroy = function() {
	    return this.em.removeAllListeners();
	  };
	
	  GestureInputRecognizer.prototype.cancel = function() {
	    window.clearTimeout(this.session.pressTimer);
	    return this.session = null;
	  };
	
	  GestureInputRecognizer.prototype.touchstart = function(event) {
	    if (this.session) {
	      return;
	    }
	    TouchMove.map((function(_this) {
	      return function(e) {
	        return _this.em.wrap(window).addEventListener(e, _this.touchmove);
	      };
	    })(this));
	    TouchEnd.map((function(_this) {
	      return function(e) {
	        return _this.em.wrap(window).addEventListener(e, _this.touchend);
	      };
	    })(this));
	    this.em.wrap(window).addEventListener("webkitmouseforcechanged", this._updateMacForce);
	    this.session = {
	      startEvent: this._getGestureEvent(event),
	      lastEvent: null,
	      startMultiEvent: null,
	      startTime: Date.now(),
	      pressTimer: window.setTimeout(this.longpressstart, GestureInputLongPressTime * 1000),
	      started: {},
	      events: [],
	      eventCount: 0
	    };
	    event = this._getGestureEvent(event);
	    this.tapstart(event);
	    if (Date.now() - this.doubleTapTime < (GestureInputDoubleTapTime * 1000)) {
	      this.doubletap(event);
	    } else {
	      this.doubleTapTime = Date.now();
	    }
	    this._process(event);
	    if (Utils.isTouch()) {
	      return this._updateTouchForce();
	    }
	  };
	
	  GestureInputRecognizer.prototype.touchmove = function(event) {
	    return this._process(this._getGestureEvent(event));
	  };
	
	  GestureInputRecognizer.prototype.touchend = function(event) {
	    var eventName, ref, ref1, value;
	    if (event.touches != null) {
	      if (Utils.isTouch()) {
	        if (!(event.touches.length === 0)) {
	          return;
	        }
	      } else {
	        if (!(event.touches.length === event.changedTouches.length)) {
	          return;
	        }
	      }
	    }
	    TouchMove.map((function(_this) {
	      return function(e) {
	        return _this.em.wrap(window).removeEventListener(e, _this.touchmove);
	      };
	    })(this));
	    TouchEnd.map((function(_this) {
	      return function(e) {
	        return _this.em.wrap(window).removeEventListener(e, _this.touchend);
	      };
	    })(this));
	    this.em.wrap(window).addEventListener("webkitmouseforcechanged", this._updateMacForce);
	    event = this._getGestureEvent(event);
	    ref = this.session.started;
	    for (eventName in ref) {
	      value = ref[eventName];
	      if (value) {
	        this[eventName + "end"](event);
	      }
	    }
	    if (!((ref1 = this.session) != null ? ref1.startEvent : void 0)) {
	      this.tap(event);
	    } else if (this.session.startEvent.target === event.target) {
	      this.tap(event);
	    }
	    this.tapend(event);
	    return this.cancel();
	  };
	
	  GestureInputRecognizer.prototype.tap = function(event) {
	    return this._dispatchEvent("tap", event);
	  };
	
	  GestureInputRecognizer.prototype.tapstart = function(event) {
	    return this._dispatchEvent("tapstart", event);
	  };
	
	  GestureInputRecognizer.prototype.tapend = function(event) {
	    return this._dispatchEvent("tapend", event);
	  };
	
	  GestureInputRecognizer.prototype.doubletap = function(event) {
	    return this._dispatchEvent("doubletap", event);
	  };
	
	  GestureInputRecognizer.prototype.longpressstart = function() {
	    var event;
	    if (!this.session) {
	      return;
	    }
	    if (this.session.started.longpress) {
	      return;
	    }
	    event = this._getGestureEvent(this.session.startEvent);
	    this.session.started.longpress = event;
	    this._dispatchEvent("longpressstart", event);
	    return this._dispatchEvent("longpress", event);
	  };
	
	  GestureInputRecognizer.prototype.longpressend = function(event) {
	    return this._dispatchEvent("longpressend", event);
	  };
	
	  GestureInputRecognizer.prototype._updateTouchForce = function() {
	    var event, ref, ref1;
	    if (!((ref = this.session) != null ? (ref1 = ref.lastEvent) != null ? ref1.touches.length : void 0 : void 0)) {
	      return;
	    }
	    this.session.force = this.session.lastEvent.touches[0].force || 0;
	    event = this._getGestureEvent(this.session.lastEvent);
	    this.forcetapchange(event);
	    if (this.session.force >= GestureInputForceTapMobile) {
	      this.forcetapstart(event);
	    } else {
	      this.forcetapend(event);
	    }
	    return setTimeout(this._updateTouchForce, GestureInputForceTapMobilePollTime);
	  };
	
	  GestureInputRecognizer.prototype._updateMacForce = function(event) {
	    if (!this.session) {
	      return;
	    }
	    this.session.force = Utils.modulate(event.webkitForce, [0, 3], [0, 1]);
	    this.forcetapchange(this._getGestureEvent(event));
	    if (event.webkitForce >= GestureInputForceTapDesktop) {
	      return this.forcetapstart(event);
	    } else {
	      return this.forcetapend(event);
	    }
	  };
	
	  GestureInputRecognizer.prototype.forcetapchange = function(event) {
	    return this._dispatchEvent("forcetapchange", event);
	  };
	
	  GestureInputRecognizer.prototype.forcetapstart = function(event) {
	    if (!this.session) {
	      return;
	    }
	    if (this.session.started.forcetap) {
	      return;
	    }
	    this.session.started.forcetap = event;
	    this._dispatchEvent("forcetapstart", event);
	    return this._dispatchEvent("forcetap", event);
	  };
	
	  GestureInputRecognizer.prototype.forcetapend = function(event) {
	    if (!this.session) {
	      return;
	    }
	    if (!this.session.started.forcetap) {
	      return;
	    }
	    this.session.started.forcetap = null;
	    return this._dispatchEvent("forcetapend", event);
	  };
	
	  GestureInputRecognizer.prototype.panstart = function(event) {
	    this.session.started.pan = event;
	    return this._dispatchEvent("panstart", event, this.session.started.pan.target);
	  };
	
	  GestureInputRecognizer.prototype.pan = function(event) {
	    var direction;
	    this._dispatchEvent("pan", event, this.session.started.pan.target);
	    direction = this._getDirection(event.delta);
	    if (direction) {
	      return this["pan" + direction](event);
	    }
	  };
	
	  GestureInputRecognizer.prototype.panend = function(event) {
	    this._dispatchEvent("panend", event, this.session.started.pan.target);
	    return this.session.started.pan = null;
	  };
	
	  GestureInputRecognizer.prototype.panup = function(event) {
	    return this._dispatchEvent("panup", event, this.session.started.pan.target);
	  };
	
	  GestureInputRecognizer.prototype.pandown = function(event) {
	    return this._dispatchEvent("pandown", event, this.session.started.pan.target);
	  };
	
	  GestureInputRecognizer.prototype.panleft = function(event) {
	    return this._dispatchEvent("panleft", event, this.session.started.pan.target);
	  };
	
	  GestureInputRecognizer.prototype.panright = function(event) {
	    return this._dispatchEvent("panright", event, this.session.started.pan.target);
	  };
	
	  GestureInputRecognizer.prototype.pinchstart = function(event) {
	    this.session.started.pinch = event;
	    this.scalestart(event, this.session.started.pinch.target);
	    this.rotatestart(event, this.session.started.pinch.target);
	    return this._dispatchEvent("pinchstart", event);
	  };
	
	  GestureInputRecognizer.prototype.pinch = function(event) {
	    this._dispatchEvent("pinch", event);
	    this.scale(event, this.session.started.pinch.target);
	    return this.rotate(event, this.session.started.pinch.target);
	  };
	
	  GestureInputRecognizer.prototype.pinchend = function(event) {
	    this._dispatchEvent("pinchend", event);
	    this.scaleend(event, this.session.started.pinch.target);
	    this.rotateend(event, this.session.started.pinch.target);
	    return this.session.started.pinch = null;
	  };
	
	  GestureInputRecognizer.prototype.scalestart = function(event) {
	    return this._dispatchEvent("scalestart", event);
	  };
	
	  GestureInputRecognizer.prototype.scale = function(event) {
	    return this._dispatchEvent("scale", event);
	  };
	
	  GestureInputRecognizer.prototype.scaleend = function(event) {
	    return this._dispatchEvent("scaleend", event);
	  };
	
	  GestureInputRecognizer.prototype.rotatestart = function(event) {
	    return this._dispatchEvent("rotatestart", event);
	  };
	
	  GestureInputRecognizer.prototype.rotate = function(event) {
	    return this._dispatchEvent("rotate", event);
	  };
	
	  GestureInputRecognizer.prototype.rotateend = function(event) {
	    return this._dispatchEvent("rotateend", event);
	  };
	
	  GestureInputRecognizer.prototype.swipestart = function(event) {
	    this._dispatchEvent("swipestart", event);
	    this.session.started.swipe = event;
	    return this.swipedirectionstart(event);
	  };
	
	  GestureInputRecognizer.prototype.swipe = function(event) {
	    this._dispatchEvent("swipe", event);
	    return this.swipedirection(event);
	  };
	
	  GestureInputRecognizer.prototype.swipeend = function(event) {
	    return this._dispatchEvent("swipeend", event);
	  };
	
	  GestureInputRecognizer.prototype.swipedirectionstart = function(event) {
	    var direction, maxX, maxY, ref, ref1, ref2, ref3, swipeEdge;
	    if (!event.offsetDirection) {
	      return;
	    }
	    if (this.session.started.swipedirection) {
	      return;
	    }
	    this.session.started.swipedirection = event;
	    direction = this.session.started.swipedirection.offsetDirection;
	    this._dispatchEvent("swipe" + direction + "start", event);
	    swipeEdge = this._edgeForSwipeDirection(direction);
	    maxX = Utils.frameGetMaxX(Screen.canvasFrame);
	    maxY = Utils.frameGetMaxY(Screen.canvasFrame);
	    if (swipeEdge === "top" && (0 < (ref = event.start.y - Screen.canvasFrame.y) && ref < GestureInputEdgeSwipeDistance)) {
	      this.edgeswipedirectionstart(event);
	    }
	    if (swipeEdge === "right" && (maxX - GestureInputEdgeSwipeDistance < (ref1 = event.start.x) && ref1 < maxX)) {
	      this.edgeswipedirectionstart(event);
	    }
	    if (swipeEdge === "bottom" && (maxY - GestureInputEdgeSwipeDistance < (ref2 = event.start.y) && ref2 < maxY)) {
	      this.edgeswipedirectionstart(event);
	    }
	    if (swipeEdge === "left" && (0 < (ref3 = event.start.x - Screen.canvasFrame.x) && ref3 < GestureInputEdgeSwipeDistance)) {
	      return this.edgeswipedirectionstart(event);
	    }
	  };
	
	  GestureInputRecognizer.prototype.swipedirection = function(event) {
	    var direction;
	    if (!this.session.started.swipedirection) {
	      return;
	    }
	    direction = this.session.started.swipedirection.offsetDirection;
	    this._dispatchEvent("swipe" + direction, event);
	    if (this.session.started.edgeswipedirection) {
	      return this.edgeswipedirection(event);
	    }
	  };
	
	  GestureInputRecognizer.prototype.swipedirectionend = function(event) {
	    var direction;
	    if (!this.session.started.swipedirection) {
	      return;
	    }
	    direction = this.session.started.swipedirection.offsetDirection;
	    return this._dispatchEvent("swipe" + direction + "end", event);
	  };
	
	  GestureInputRecognizer.prototype.edgeswipedirection = function(event) {
	    var swipeEdge;
	    swipeEdge = this._edgeForSwipeDirection(this.session.started.edgeswipedirection.offsetDirection);
	    Screen.emit("edgeswipe", this._createEvent("edgeswipe", event));
	    return Screen.emit("edgeswipe" + swipeEdge, this._createEvent("edgeswipe" + swipeEdge, event));
	  };
	
	  GestureInputRecognizer.prototype.edgeswipedirectionstart = function(event) {
	    var swipeEdge;
	    if (this.session.started.edgeswipedirection) {
	      return;
	    }
	    this.session.started.edgeswipedirection = event;
	    swipeEdge = this._edgeForSwipeDirection(this.session.started.edgeswipedirection.offsetDirection);
	    Screen.emit("edgeswipestart", this._createEvent("edgeswipestart", event));
	    return Screen.emit("edgeswipe" + swipeEdge + "start", this._createEvent("edgeswipe" + swipeEdge + "start", event));
	  };
	
	  GestureInputRecognizer.prototype.edgeswipedirectionend = function(event) {
	    var swipeEdge;
	    swipeEdge = this._edgeForSwipeDirection(this.session.started.edgeswipedirection.offsetDirection);
	    Screen.emit("edgeswipeend", this._createEvent("edgeswipeend", event));
	    return Screen.emit("edgeswipe" + swipeEdge + "end", this._createEvent("edgeswipe" + swipeEdge + "end", event));
	  };
	
	  GestureInputRecognizer.prototype._process = function(event) {
	    if (!this.session) {
	      return;
	    }
	    this.session.events.push(event);
	    event.eventCount = this.session.eventCount++;
	    if (Math.abs(event.delta.x) > 0 || Math.abs(event.delta.y) > 0) {
	      if (!this.session.started.pan) {
	        this.panstart(event);
	      } else {
	        this.pan(event);
	      }
	    }
	    if (this.session.started.pinch && event.fingers === 1) {
	      this.pinchend(event);
	    } else if (!this.session.started.pinch && event.fingers === 2) {
	      this.pinchstart(event);
	    } else if (this.session.started.pinch) {
	      this.pinch(event);
	    }
	    if (!this.session.started.swipe && (Math.abs(event.offset.x) > GestureInputSwipeThreshold || Math.abs(event.offset.y) > GestureInputSwipeThreshold)) {
	      this.swipestart(event);
	    } else if (this.session.started.swipe) {
	      this.swipe(event);
	    }
	    return this.session.lastEvent = event;
	  };
	
	  GestureInputRecognizer.prototype._getEventPoint = function(event) {
	    var ref;
	    if ((ref = event.touches) != null ? ref.length : void 0) {
	      return this._getTouchPoint(event, 0);
	    }
	    return {
	      x: event.pageX,
	      y: event.pageY
	    };
	  };
	
	  GestureInputRecognizer.prototype._getGestureEvent = function(event) {
	    var events, i, len, pointKey, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, touchPointA, touchPointB;
	    _.extend(event, {
	      time: Date.now(),
	      point: this._getEventPoint(event),
	      start: this._getEventPoint(event),
	      previous: this._getEventPoint(event),
	      offset: {
	        x: 0,
	        y: 0
	      },
	      offsetTime: 0,
	      offsetAngle: 0,
	      offsetDirection: null,
	      delta: {
	        x: 0,
	        y: 0
	      },
	      deltaTime: 0,
	      deltaAngle: 0,
	      deltaDirection: null,
	      force: 0,
	      velocity: {
	        x: 0,
	        y: 0
	      },
	      fingers: ((ref = event.touches) != null ? ref.length : void 0) || 0,
	      touchCenter: this._getEventPoint(event),
	      touchOffset: {
	        x: 0,
	        y: 0
	      },
	      touchDistance: 0,
	      scale: 1,
	      scaleDirection: null,
	      rotation: 0
	    });
	    if ((ref1 = this.session) != null ? ref1.startEvent : void 0) {
	      event.start = this.session.startEvent.point;
	      event.offset = Utils.pointSubtract(event.point, event.start);
	      event.offsetTime = event.time - this.session.startEvent.time;
	      event.offsetAngle = Utils.pointAngle(this.session.startEvent.point, event.point);
	      event.offsetDirection = this._getDirection(event.offset);
	      event.touchCenterStart = this.session.startEvent.touchCenter;
	    }
	    if ((ref2 = this.session) != null ? ref2.lastEvent : void 0) {
	      event.previous = this.session.lastEvent.point;
	      event.deltaTime = event.time - this.session.lastEvent.time;
	      event.delta = Utils.pointSubtract(event.point, this.session.lastEvent.point);
	      event.deltaAngle = Utils.pointAngle(event.point, this.session.lastEvent.point);
	      event.deltaDirection = this._getDirection(event.delta);
	    }
	    if (event.fingers > 1) {
	      touchPointA = this._getTouchPoint(event, 0);
	      touchPointB = this._getTouchPoint(event, 1);
	      event.touchCenter = Utils.pointCenter(touchPointB, touchPointA);
	      event.touchOffset = Utils.pointSubtract(touchPointB, touchPointA);
	      event.touchDistance = _.max([GestureInputMinimumFingerDistance, Utils.pointDistance(touchPointA, touchPointB)]);
	      event.rotation = Utils.pointAngle(touchPointA, touchPointB);
	    }
	    if ((ref3 = this.session) != null ? ref3.events : void 0) {
	      events = _.filter(this.session.events, function(e) {
	        if (e.eventCount === 0) {
	          return false;
	        }
	        return e.time > (event.time - (GestureInputVelocityTime * 1000));
	      });
	      event.velocity = this._getVelocity(events);
	    }
	    if ((ref4 = this.session) != null ? ref4.started.pinch : void 0) {
	      event.scale = event.touchDistance / this.session.started.pinch.touchDistance;
	      event.scaleDirection = this._getScaleDirection(event.scale - this.session.lastEvent.scale);
	      if (!event.scaleDirection && ((ref5 = this.session) != null ? ref5.lastEvent : void 0)) {
	        event.scaleDirection = this.session.lastEvent.scaleDirection;
	      }
	    }
	    if ((ref6 = this.session) != null ? ref6.lastEvent : void 0) {
	      if ((event.fingers !== (ref7 = this.session.lastEvent.fingers) && ref7 === 2)) {
	        event.delta = {
	          x: 0,
	          y: 0
	        };
	      }
	      if (event.fingers === 2 && this.session.lastEvent.fingers === 2) {
	        event.delta = Utils.pointSubtract(event.touchCenter, this.session.lastEvent.touchCenter);
	      }
	    }
	    if ((ref8 = this.session) != null ? ref8.lastEvent : void 0) {
	      if (this.session.force) {
	        event.force = this.session.force;
	      }
	    }
	    ref9 = ["point", "start", "previous", "offset", "delta", "velocity", "touchCenter", "touchOffset"];
	    for (i = 0, len = ref9.length; i < len; i++) {
	      pointKey = ref9[i];
	      event[pointKey + "X"] = event[pointKey].x;
	      event[pointKey + "Y"] = event[pointKey].y;
	    }
	    return event;
	  };
	
	  GestureInputRecognizer.prototype._getTouchPoint = function(event, index) {
	    var point;
	    return point = {
	      x: event.touches[index].pageX,
	      y: event.touches[index].pageY
	    };
	  };
	
	  GestureInputRecognizer.prototype._getDirection = function(offset) {
	    if (Math.abs(offset.x) > Math.abs(offset.y)) {
	      if (offset.x > 0) {
	        return "right";
	      }
	      if (offset.x < 0) {
	        return "left";
	      }
	    }
	    if (Math.abs(offset.x) < Math.abs(offset.y)) {
	      if (offset.y < 0) {
	        return "up";
	      }
	      if (offset.y > 0) {
	        return "down";
	      }
	    }
	    return null;
	  };
	
	  GestureInputRecognizer.prototype._edgeForSwipeDirection = function(direction) {
	    if (direction === "down") {
	      return "top";
	    }
	    if (direction === "left") {
	      return "right";
	    }
	    if (direction === "up") {
	      return "bottom";
	    }
	    if (direction === "right") {
	      return "left";
	    }
	    return null;
	  };
	
	  GestureInputRecognizer.prototype._getScaleDirection = function(offset) {
	    if (offset > 0) {
	      return "up";
	    }
	    if (offset < 0) {
	      return "down";
	    }
	    return null;
	  };
	
	  GestureInputRecognizer.prototype._createEvent = function(type, event) {
	    var k, touchEvent, v;
	    touchEvent = document.createEvent("MouseEvent");
	    touchEvent.initMouseEvent(type, true, true, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.shiftKey, event.altKey, event.metaKey, event.button, event.relatedTarget);
	    touchEvent.touches = event.touches;
	    touchEvent.changedTouches = event.touches;
	    touchEvent.targetTouches = event.touches;
	    for (k in event) {
	      v = event[k];
	      touchEvent[k] = v;
	    }
	    return touchEvent;
	  };
	
	  GestureInputRecognizer.prototype._dispatchEvent = function(type, event, target) {
	    var ref, ref1, touchEvent;
	    touchEvent = this._createEvent(type, event);
	    if (target == null) {
	      target = (ref = this.session) != null ? (ref1 = ref.startEvent) != null ? ref1.target : void 0 : void 0;
	    }
	    if (target == null) {
	      target = event.target;
	    }
	    return target.dispatchEvent(touchEvent);
	  };
	
	  GestureInputRecognizer.prototype._getVelocity = function(events) {
	    var current, first, time, velocity;
	    if (events.length < 2) {
	      return {
	        x: 0,
	        y: 0
	      };
	    }
	    current = events[events.length - 1];
	    first = events[0];
	    time = current.time - first.time;
	    velocity = {
	      x: (current.point.x - first.point.x) / time,
	      y: (current.point.y - first.point.y) / time
	    };
	    if (velocity.x === Infinity) {
	      velocity.x = 0;
	    }
	    if (velocity.y === Infinity) {
	      velocity.y = 0;
	    }
	    return velocity;
	  };
	
	  return GestureInputRecognizer;

	})();


/***/ },
/* 54 */
/***/ function(module, exports) {

	exports.date = 1459564654;
	
	exports.branch = "tisho/animation-paths";
	
	exports.hash = "3c251d5";
	
	exports.build = 1642;
	
	exports.version = exports.branch + "/" + exports.hash;


/***/ }
/******/ ]);
//# sourceMappingURL=framer.js.map