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
/*!******************************!*\
  !*** ./framer/Framer.coffee ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var Defaults, Framer, _;
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	Framer = {};
	
	Framer._ = _;
	
	Framer.Utils = __webpack_require__(/*! ./Utils */ 4);
	
	Framer.Color = (__webpack_require__(/*! ./Color */ 9)).Color;
	
	Framer.Layer = (__webpack_require__(/*! ./Layer */ 10)).Layer;
	
	Framer.BackgroundLayer = (__webpack_require__(/*! ./BackgroundLayer */ 30)).BackgroundLayer;
	
	Framer.VideoLayer = (__webpack_require__(/*! ./VideoLayer */ 31)).VideoLayer;
	
	Framer.Events = (__webpack_require__(/*! ./Events */ 22)).Events;
	
	Framer.Animation = (__webpack_require__(/*! ./Animation */ 13)).Animation;
	
	Framer.AnimationGroup = (__webpack_require__(/*! ./AnimationGroup */ 32)).AnimationGroup;
	
	Framer.Screen = (__webpack_require__(/*! ./Screen */ 5)).Screen;
	
	Framer.Canvas = (__webpack_require__(/*! ./Canvas */ 33)).Canvas;
	
	Framer.print = (__webpack_require__(/*! ./Print */ 34)).print;
	
	Framer.ScrollComponent = (__webpack_require__(/*! ./Components/ScrollComponent */ 37)).ScrollComponent;
	
	Framer.PageComponent = (__webpack_require__(/*! ./Components/PageComponent */ 38)).PageComponent;
	
	Framer.SliderComponent = (__webpack_require__(/*! ./Components/SliderComponent */ 39)).SliderComponent;
	
	Framer.DeviceComponent = (__webpack_require__(/*! ./Components/DeviceComponent */ 40)).DeviceComponent;
	
	Framer.DeviceView = Framer.DeviceComponent;
	
	if (window) {
	  _.extend(window, Framer);
	}
	
	Framer.Context = (__webpack_require__(/*! ./Context */ 35)).Context;
	
	Framer.Config = (__webpack_require__(/*! ./Config */ 11)).Config;
	
	Framer.EventEmitter = (__webpack_require__(/*! ./EventEmitter */ 7)).EventEmitter;
	
	Framer.BaseClass = (__webpack_require__(/*! ./BaseClass */ 6)).BaseClass;
	
	Framer.LayerStyle = (__webpack_require__(/*! ./LayerStyle */ 20)).LayerStyle;
	
	Framer.AnimationLoop = (__webpack_require__(/*! ./AnimationLoop */ 41)).AnimationLoop;
	
	Framer.LinearAnimator = (__webpack_require__(/*! ./Animators/LinearAnimator */ 14)).LinearAnimator;
	
	Framer.BezierCurveAnimator = (__webpack_require__(/*! ./Animators/BezierCurveAnimator */ 16)).BezierCurveAnimator;
	
	Framer.SpringDHOAnimator = (__webpack_require__(/*! ./Animators/SpringDHOAnimator */ 19)).SpringDHOAnimator;
	
	Framer.SpringRK4Animator = (__webpack_require__(/*! ./Animators/SpringRK4Animator */ 17)).SpringRK4Animator;
	
	Framer.LayerDraggable = (__webpack_require__(/*! ./LayerDraggable */ 23)).LayerDraggable;
	
	Framer.Importer = (__webpack_require__(/*! ./Importer */ 42)).Importer;
	
	Framer.Debug = (__webpack_require__(/*! ./Debug */ 43)).Debug;
	
	Framer.Extras = __webpack_require__(/*! ./Extras/Extras */ 44);
	
	Framer.Loop = new Framer.AnimationLoop();
	
	Utils.domComplete(Framer.Loop.start);
	
	if (window) {
	  window.Framer = Framer;
	}
	
	Framer.DefaultContext = new Framer.Context({
	  name: "Default"
	});
	
	Framer.CurrentContext = Framer.DefaultContext;
	
	if (Utils.isMobile()) {
	  Framer.Extras.MobileScrollFix.enable();
	}
	
	Defaults = (__webpack_require__(/*! ./Defaults */ 12)).Defaults;
	
	Defaults.setup();
	
	Framer.resetDefaults = Defaults.reset;


/***/ },
/* 1 */
/*!**********************************!*\
  !*** ./framer/Underscore.coffee ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	exports._ = __webpack_require__(/*! lodash */ 2);


/***/ },
/* 2 */
/*!***************************!*\
  !*** ./~/lodash/index.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * @license
	 * lodash 3.10.0 (Custom Build) <https://lodash.com/>
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
	  var VERSION = '3.10.0';
	
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! (webpack)/buildin/module.js */ 3)(module), (function() { return this; }())))

/***/ },
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
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
/*!*****************************!*\
  !*** ./framer/Utils.coffee ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var Screen, Utils, _, __domComplete, __domReady, _textSizeNode,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	  slice = [].slice;
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	Screen = __webpack_require__(/*! ./Screen */ 5).Screen;
	
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
	  var len, m, ref, ref1, result;
	  result = obj;
	  if (ref = !".", indexOf.call(key, ref) >= 0) {
	    return obj[key];
	  }
	  ref1 = key.split(".");
	  for (m = 0, len = ref1.length; m < len; m++) {
	    key = ref1[m];
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
	  Framer.CurrentContext._delayTimers.push(timer);
	  return timer;
	};
	
	Utils.interval = function(time, f) {
	  var timer;
	  timer = setInterval(f, time * 1000);
	  Framer.CurrentContext._delayIntervals.push(timer);
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
	  var c;
	  if (alpha == null) {
	    alpha = 1.0;
	  }
	  c = function() {
	    return parseInt(Math.random() * 255);
	  };
	  return "rgba(" + (c()) + ", " + (c()) + ", " + (c()) + ", " + alpha + ")";
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
	  var Enum, i, j, len, m, name;
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
	  for (i = m = 0, len = names.length; m < len; i = ++m) {
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
	  try {
	    if (_.isObject(obj)) {
	      return JSON.stringify(obj);
	    }
	  } catch (_error) {
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
	  var className, extract, ref, ref1, ref2;
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
	  className = extract(item.toString());
	  if (className) {
	    return className;
	  }
	  className = extract((ref2 = item.constructor) != null ? ref2.toString() : void 0);
	  if (className) {
	    return className.replace("Constructor", "");
	  }
	  return item;
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
	  var chars, digit, m, output, r, random;
	  chars = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
	  output = new Array(36);
	  random = 0;
	  for (digit = m = 1; m <= 32; digit = ++m) {
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
	  return window.ontouchstart === null;
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
	
	__domComplete = [];
	
	__domReady = false;
	
	if (typeof document !== "undefined" && document !== null) {
	  document.onreadystatechange = (function(_this) {
	    return function(event) {
	      var f, results;
	      if (document.readyState === "complete") {
	        __domReady = true;
	        results = [];
	        while (__domComplete.length) {
	          results.push(f = __domComplete.shift()());
	        }
	        return results;
	      }
	    };
	  })(this);
	}
	
	Utils.domComplete = function(f) {
	  if (document.readyState === "complete") {
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
	  var e, handleError, ref, request;
	  request = new XMLHttpRequest();
	  request.open("GET", path, false);
	  try {
	    request.send(null);
	  } catch (_error) {
	    e = _error;
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
	  context.eventManager.wrap(element).addEventListener("load", function(event) {
	    return callback();
	  });
	  context.eventManager.wrap(element).addEventListener("error", function(event) {
	    return callback(true);
	  });
	  return element.src = url;
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
	
	Utils.pointDistance = function(pointA, pointB) {
	  var distance;
	  return distance = {
	    x: Math.abs(pointB.x - pointA.x),
	    y: Math.abs(pointB.y - pointA.y)
	  };
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
	
	Utils.framePointForOrigin = function(frame, originX, originY) {
	  return frame = {
	    x: frame.x + (originX * frame.width),
	    y: frame.y + (originY * frame.height),
	    width: frame.width,
	    height: frame.height
	  };
	};
	
	Utils.frameInset = function(frame, inset) {
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
	    result = Utils.pointDistance(point, Utils.framePointForOrigin(frame, originX, originY));
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
	
	Utils.pointAngle = function(p1, p2) {
	  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
	};
	
	Utils.convertPoint = function(input, layerA, layerB, context) {
	  var layer, len, len1, m, o, point, superLayersA, superLayersB;
	  if (context == null) {
	    context = false;
	  }
	  point = _.defaults(input, {
	    x: 0,
	    y: 0
	  });
	  superLayersA = (layerA != null ? layerA.superLayers(context) : void 0) || [];
	  superLayersB = (layerB != null ? layerB.superLayers(context) : void 0) || [];
	  if (layerB) {
	    superLayersB.push(layerB);
	  }
	  for (m = 0, len = superLayersA.length; m < len; m++) {
	    layer = superLayersA[m];
	    point.x += layer.x;
	    point.y += layer.y;
	  }
	  for (o = 0, len1 = superLayersB.length; o < len1; o++) {
	    layer = superLayersB[o];
	    point.x -= layer.x;
	    point.y -= layer.y;
	  }
	  return point;
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
/*!******************************!*\
  !*** ./framer/Screen.coffee ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, ScreenClass,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	BaseClass = __webpack_require__(/*! ./BaseClass */ 6).BaseClass;
	
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
	      return {
	        width: this.width,
	        height: this.height
	      };
	    }
	  });
	
	  ScreenClass.define("frame", {
	    get: function() {
	      return {
	        x: 0,
	        y: 0,
	        width: this.width,
	        height: this.height
	      };
	    }
	  });
	
	  return ScreenClass;
	
	})(BaseClass);
	
	exports.Screen = new ScreenClass;


/***/ },
/* 6 */
/*!*********************************!*\
  !*** ./framer/BaseClass.coffee ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var CounterKey, DefinedPropertiesKey, DefinedPropertiesValuesKey, EventEmitter, Utils, _, capitalizeFirstLetter,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	EventEmitter = __webpack_require__(/*! ./EventEmitter */ 7).EventEmitter;
	
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
/*!************************************!*\
  !*** ./framer/EventEmitter.coffee ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var EventEmitter;
	
	EventEmitter = __webpack_require__(/*! eventemitter3 */ 8).EventEmitter;
	
	exports.EventEmitter = EventEmitter;


/***/ },
/* 8 */
/*!**********************************!*\
  !*** ./~/eventemitter3/index.js ***!
  \**********************************/
/***/ function(module, exports) {

	'use strict';
	
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
	 * @returns {Array}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event) {
	  if (!this._events || !this._events[event]) return [];
	  if (this._events[event].fn) return [this._events[event].fn];
	
	  for (var i = 0, l = this._events[event].length, ee = new Array(l); i < l; i++) {
	    ee[i] = this._events[event][i].fn;
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
	  if (!this._events || !this._events[event]) return false;
	
	  var listeners = this._events[event]
	    , len = arguments.length
	    , args
	    , i;
	
	  if ('function' === typeof listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, true);
	
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
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, true);
	
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
	  var listener = new EE(fn, context || this);
	
	  if (!this._events) this._events = {};
	  if (!this._events[event]) this._events[event] = listener;
	  else {
	    if (!this._events[event].fn) this._events[event].push(listener);
	    else this._events[event] = [
	      this._events[event], listener
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
	  var listener = new EE(fn, context || this, true);
	
	  if (!this._events) this._events = {};
	  if (!this._events[event]) this._events[event] = listener;
	  else {
	    if (!this._events[event].fn) this._events[event].push(listener);
	    else this._events[event] = [
	      this._events[event], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Remove event listeners.
	 *
	 * @param {String} event The event we want to remove.
	 * @param {Function} fn The listener that we need to find.
	 * @param {Boolean} once Only remove once listeners.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, once) {
	  if (!this._events || !this._events[event]) return this;
	
	  var listeners = this._events[event]
	    , events = [];
	
	  if (fn) {
	    if (listeners.fn && (listeners.fn !== fn || (once && !listeners.once))) {
	      events.push(listeners);
	    }
	    if (!listeners.fn) for (var i = 0, length = listeners.length; i < length; i++) {
	      if (listeners[i].fn !== fn || (once && !listeners[i].once)) {
	        events.push(listeners[i]);
	      }
	    }
	  }
	
	  //
	  // Reset the array, or remove it completely if we have no more listeners.
	  //
	  if (events.length) {
	    this._events[event] = events.length === 1 ? events[0] : events;
	  } else {
	    delete this._events[event];
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
	
	  if (event) delete this._events[event];
	  else this._events = {};
	
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
	// Expose the module.
	//
	EventEmitter.EventEmitter = EventEmitter;
	EventEmitter.EventEmitter2 = EventEmitter;
	EventEmitter.EventEmitter3 = EventEmitter;
	
	//
	// Expose the module.
	//
	module.exports = EventEmitter;


/***/ },
/* 9 */
/*!*****************************!*\
  !*** ./framer/Color.coffee ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, bound01, boundAlpha, convertToPercentage, correctAlpha, cssNames, hslToRgb, hsvToRgb, inputToRGB, isOnePointZero, isPercentage, matchers, pad2, rgbToHex, rgbToHsl, rgbToHsv, rgbToRgb, stringToObject,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	BaseClass = __webpack_require__(/*! ./BaseClass */ 6).BaseClass;
	
	exports.Color = (function(superClass) {
	  extend(Color, superClass);
	
	  function Color(color1) {
	    var color, rgb;
	    this.color = color1;
	    color = this.color;
	    if (color instanceof Color) {
	      return color;
	    }
	    if (this.color === null) {
	      this.red = 0;
	      this.green = 0;
	      this.blue = 0;
	      this.alpha = 0;
	      return;
	    }
	    rgb = inputToRGB(color);
	    this.red = rgb.r;
	    this.green = rgb.g;
	    this.blue = rgb.b;
	    this.alpha = rgb.a;
	  }
	
	  Color.define("red", {
	    get: function() {
	      return this._r;
	    },
	    set: function(value) {
	      return this._r = Utils.clamp(value, 0, 255);
	    }
	  });
	
	  Color.define("green", {
	    get: function() {
	      return this._g;
	    },
	    set: function(value) {
	      return this._g = Utils.clamp(value, 0, 255);
	    }
	  });
	
	  Color.define("blue", {
	    get: function() {
	      return this._b;
	    },
	    set: function(value) {
	      return this._b = Utils.clamp(value, 0, 255);
	    }
	  });
	
	  Color.define("alpha", {
	    get: function() {
	      return this._a;
	    },
	    set: function(value) {
	      this._a = Utils.clamp(value, 0, 1);
	      return this._roundA = Math.round(100 * this._a) / 100;
	    }
	  });
	
	  Color.define("r", {
	    get: function() {
	      return this.red;
	    },
	    set: function(value) {
	      return this.red = value;
	    }
	  });
	
	  Color.define("g", {
	    get: function() {
	      return this.green;
	    },
	    set: function(value) {
	      return this.green = value;
	    }
	  });
	
	  Color.define("b", {
	    get: function() {
	      return this.blue;
	    },
	    set: function(value) {
	      return this.blue = value;
	    }
	  });
	
	  Color.define("a", {
	    get: function() {
	      return this.alpha;
	    },
	    set: function(value) {
	      return this.alpha = value;
	    }
	  });
	
	  Color.prototype.toHex = function(allow3Char) {
	    return rgbToHex(this._r, this._g, this._b, allow3Char);
	  };
	
	  Color.prototype.toHexString = function(allow3Char) {
	    return '#' + this.toHex(allow3Char);
	  };
	
	  Color.prototype.toRgb = function() {
	    return {
	      r: Math.round(this._r),
	      g: Math.round(this._g),
	      b: Math.round(this._b),
	      a: this._a
	    };
	  };
	
	  Color.prototype.toRgbString = function() {
	    if (this._a === 1) {
	      return "rgb(" + (Utils.round(this._r, 0)) + ", " + (Utils.round(this._g, 0)) + ", " + (Utils.round(this._b, 0)) + ")";
	    } else {
	      return "rgba(" + (Utils.round(this._r, 0)) + ", " + (Utils.round(this._g, 0)) + ", " + (Utils.round(this._b, 0)) + ", " + this._roundA + ")";
	    }
	  };
	
	  Color.prototype.toHsl = function() {
	    var hsl;
	    hsl = rgbToHsl(this._r, this._g, this._b);
	    return {
	      h: hsl.h * 360,
	      s: hsl.s,
	      l: hsl.l,
	      a: this._a
	    };
	  };
	
	  Color.prototype.toHslString = function() {
	    var h, hsl, l, s;
	    hsl = rgbToHsl(this._r, this._g, this._b);
	    h = Math.round(hsl.h * 360);
	    s = Math.round(hsl.s * 100);
	    l = Math.round(hsl.l * 100);
	    if (this._a === 1) {
	      return "hsl(" + h + ", " + s + "%, " + l + "%)";
	    } else {
	      return "hsl(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
	    }
	  };
	
	  Color.prototype.toName = function() {
	    if (this._a === 0) {
	      return "transparent";
	    }
	    if (this._a < 1) {
	      return false;
	    }
	    return cssNames[rgbToHex(this._r, this._g, this._b, this)] || false;
	  };
	
	  Color.prototype.lighten = function(amount) {
	    var hsl;
	    hsl = this.toHsl();
	    print(hsl);
	    hsl.l += amount / 100;
	    hsl.l = Math.min(1, Math.max(0, hsl.l));
	    return new Color(hsl);
	  };
	
	  Color.prototype.brighten = function(amount) {
	    var rgb;
	    rgb = this.toRgb();
	    rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
	    rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
	    rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
	    return new Color(rgb);
	  };
	
	  Color.prototype.darken = function(amount) {
	    var hsl;
	    hsl = this.toHsl();
	    hsl.l -= amount / 100;
	    hsl.l = Math.min(1, Math.max(0, hsl.l));
	    return new Color(hsl);
	  };
	
	  Color.prototype.desaturate = function(amount) {
	    var hsl;
	    hsl = this.toHsl();
	    hsl.s -= amount / 100;
	    hsl.s = Math.min(1, Math.max(0, hsl.s));
	    return new Color(hsl);
	  };
	
	  Color.prototype.saturate = function(amount) {
	    var hsl;
	    hsl = this.toHsl();
	    hsl.s += amount / 100;
	    hsl.s = Math.min(1, Math.max(0, hsl.s));
	    return new Color(hsl);
	  };
	
	  Color.prototype.greyscale = function() {
	    return new Color(hsl).desaturate(100);
	  };
	
	  Color.prototype.toString = function() {
	    return this.toRgbString();
	  };
	
	  Color.prototype.copy = function() {
	    var copy;
	    copy = new Color({
	      r: this._r,
	      g: this._g,
	      b: this._b,
	      a: this._a
	    });
	    return copy;
	  };
	
	  Color.modulateFromToColor = function(fromColor, toColor, fraction) {
	    var result;
	    result = null;
	    if (!(fromColor instanceof Color) && toColor instanceof Color) {
	      fromColor = toColor.copy();
	      fromColor.a = 0;
	    } else if (fromColor instanceof Color && fromColor._a === 0 && toColor instanceof Color && toColor._a !== 0) {
	      fromColor = toColor.copy();
	      fromColor.a = 0;
	    } else if (!(toColor instanceof Color) && fromColor instanceof Color) {
	      toColor = fromColor.copy();
	      toColor.a = 0;
	    } else if (toColor instanceof Color && toColor._a === 0 && fromColor instanceof Color && fromColor._a !== 0) {
	      toColor = fromColor.copy();
	      toColor.a = 0;
	    }
	    if (toColor instanceof Color) {
	      result = new Color({
	        r: Utils.modulate(fraction, [0, 1], [fromColor._r, toColor._r], true),
	        g: Utils.modulate(fraction, [0, 1], [fromColor._g, toColor._g], true),
	        b: Utils.modulate(fraction, [0, 1], [fromColor._b, toColor._b], true),
	        a: Utils.modulate(fraction, [0, 1], [fromColor._a, toColor._a], true)
	      });
	    }
	    return result;
	  };
	
	  Color.toColor = function(color) {
	    return new Color(color);
	  };
	
	  Color.isColor = function(color) {
	    return color instanceof Color;
	  };
	
	  Color.isColorString = function(colorString) {
	    return stringToObject(colorString) !== false;
	  };
	
	  return Color;
	
	})(BaseClass);
	
	inputToRGB = function(color) {
	  var a, ok, rgb;
	  rgb = {
	    r: 0,
	    g: 0,
	    b: 0
	  };
	  a = 1;
	  ok = false;
	  if (typeof color === 'string') {
	    color = stringToObject(color);
	  }
	  if (typeof color === 'object') {
	    if (color.hasOwnProperty('r') && color.hasOwnProperty('g') && color.hasOwnProperty('b')) {
	      rgb = rgbToRgb(color.r, color.g, color.b);
	      ok = true;
	    } else if (color.hasOwnProperty('h') && color.hasOwnProperty('s') && color.hasOwnProperty('v')) {
	      color.s = convertToPercentage(color.s);
	      color.v = convertToPercentage(color.v);
	      rgb = hsvToRgb(color.h, color.s, color.v);
	      ok = true;
	    } else if (color.hasOwnProperty('h') && color.hasOwnProperty('s') && color.hasOwnProperty('l')) {
	      color.s = convertToPercentage(color.s);
	      color.l = convertToPercentage(color.l);
	      rgb = hslToRgb(color.h, color.s, color.l);
	      ok = true;
	    }
	    if (color.hasOwnProperty('a')) {
	      a = color.a;
	    }
	  }
	  a = correctAlpha(a);
	  return {
	    ok: ok,
	    r: Math.min(255, Math.max(rgb.r, 0)),
	    g: Math.min(255, Math.max(rgb.g, 0)),
	    b: Math.min(255, Math.max(rgb.b, 0)),
	    a: a
	  };
	};
	
	rgbToRgb = function(r, g, b) {
	  return {
	    r: bound01(r, 255) * 255,
	    g: bound01(g, 255) * 255,
	    b: bound01(b, 255) * 255
	  };
	};
	
	rgbToHex = function(r, g, b, allow3Char) {
	  var hex;
	  hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];
	  if (allow3Char && hex[0].charAt(0) === hex[0].charAt(1) && hex[1].charAt(0) === hex[1].charAt(1) && hex[2].charAt(0) === hex[2].charAt(1)) {
	    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
	  }
	  return hex.join('');
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
	    h: h,
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
	  s = bound01(s, 100);
	  l = bound01(l, 100);
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
	
	rgbToHsv = function(r, g, b) {
	  var d, h, max, min, ref, s, v;
	  r = bound01(r, 255);
	  g = bound01(g, 255);
	  b = bound01(b, 255);
	  max = mathMax(r, g, b);
	  min = mathMin(r, g, b);
	  h;
	  s;
	  v = max;
	  d = max - min;
	  s = (ref = max === 0) != null ? ref : {
	    0: d / max
	  };
	  if (max === min) {
	    h = 0;
	  } else {
	    h = (function() {
	      var ref1;
	      switch (max) {
	        case r:
	          return (g - b) / d + ((ref1 = g < b) != null ? ref1 : {
	            6: 0
	          });
	        case g:
	          return (b - r) / d + 2;
	        case b:
	          return (r - g) / d + 4;
	      }
	    })();
	    h /= 6;
	  }
	  return {
	    h: h,
	    s: s,
	    v: v
	  };
	};
	
	hsvToRgb = function(h, s, v) {
	  var b, f, g, i, mod, p, q, r, t;
	  h = bound01(h, 360) * 6;
	  s = bound01(s, 100);
	  v = bound01(v, 100);
	  i = Math.floor(h);
	  f = h - i;
	  p = v * (1 - s);
	  q = v * (1 - f * s);
	  t = v * (1 - (1 - f) * s);
	  mod = i % 6;
	  r = [v, q, p, p, t, v][mod];
	  g = [t, v, v, q, p, p][mod];
	  b = [p, p, t, v, v, q][mod];
	  return {
	    r: r * 255,
	    g: g * 255,
	    b: b * 255
	  };
	};
	
	boundAlpha = function(a) {
	  a = parseFloat(a);
	  if (isNaN(a) || a < 0 || a > 1) {
	    a = 1;
	  }
	  return a;
	};
	
	convertToPercentage = function(n) {
	  if (n <= 1) {
	    n = n * 100 + '%';
	  }
	  return n;
	};
	
	correctAlpha = function(a) {
	  a = parseFloat(a);
	  if (isNaN(a) || a < 0 || a > 1) {
	    a = 1;
	  }
	  return a;
	};
	
	bound01 = function(n, max) {
	  var processPercent;
	  if (isOnePointZero(n)) {
	    n = '100%';
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
	  return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
	};
	
	isPercentage = function(n) {
	  return typeof n === 'string' && n.indexOf('%') !== -1;
	};
	
	pad2 = function(char) {
	  if (char.length === 1) {
	    return '0' + char;
	  } else {
	    return '' + char;
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
	    hsv: new RegExp('hsv' + permissive_match3),
	    hsva: new RegExp('hsva' + permissive_match4),
	    hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	    hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	  };
	})();
	
	stringToObject = function(color) {
	  var match, named, trimLeft, trimRight;
	  trimLeft = /^[\s,#]+/;
	  trimRight = /\s+$/;
	  color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase();
	  named = false;
	  if (cssNames[color]) {
	    color = cssNames[color];
	    named = true;
	  } else if (color === 'transparent') {
	    return {
	      r: 0,
	      g: 0,
	      b: 0,
	      a: 0
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
	      s: match[2],
	      l: match[3]
	    };
	  }
	  if (match = matchers.hsla.exec(color)) {
	    return {
	      h: match[1],
	      s: match[2],
	      l: match[3],
	      a: match[4]
	    };
	  }
	  if (match = matchers.hsv.exec(color)) {
	    return {
	      h: match[1],
	      s: match[2],
	      v: match[3]
	    };
	  }
	  if (match = matchers.hsva.exec(color)) {
	    return {
	      h: match[1],
	      s: match[2],
	      v: match[3],
	      a: match[4]
	    };
	  }
	  if (match = matchers.hex6.exec(color) || (match = matchers.hex6.exec(cssNames[color]))) {
	    return {
	      r: parseInt(match[1], 16),
	      g: parseInt(match[2], 16),
	      b: parseInt(match[3], 16),
	      a: 1
	    };
	  }
	  if (match = matchers.hex3.exec(color) || (match = matchers.hex3.exec(cssNames[color]))) {
	    return {
	      r: parseInt(match[1] + '' + match[1], 16),
	      g: parseInt(match[2] + '' + match[2], 16),
	      b: parseInt(match[3] + '' + match[3], 16)
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
/* 10 */
/*!*****************************!*\
  !*** ./framer/Layer.coffee ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var Animation, BaseClass, Color, Config, Defaults, EventEmitter, LayerDraggable, LayerStates, LayerStyle, NoCacheDateKey, Utils, _, layerProperty, layerValueTypeError,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	  slice = [].slice;
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	Config = __webpack_require__(/*! ./Config */ 11).Config;
	
	Defaults = __webpack_require__(/*! ./Defaults */ 12).Defaults;
	
	BaseClass = __webpack_require__(/*! ./BaseClass */ 6).BaseClass;
	
	EventEmitter = __webpack_require__(/*! ./EventEmitter */ 7).EventEmitter;
	
	Color = __webpack_require__(/*! ./Color */ 9).Color;
	
	Animation = __webpack_require__(/*! ./Animation */ 13).Animation;
	
	LayerStyle = __webpack_require__(/*! ./LayerStyle */ 20).LayerStyle;
	
	LayerStates = __webpack_require__(/*! ./LayerStates */ 21).LayerStates;
	
	LayerDraggable = __webpack_require__(/*! ./LayerDraggable */ 23).LayerDraggable;
	
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
	      if (value && transformer) {
	        value = transformer(value);
	      } else if (value === null && transformer) {
	        value = transformer(value);
	      }
	      if (value && validator && !validator(value)) {
	        layerValueTypeError(name, value);
	      }
	      this._properties[name] = value;
	      this._element.style[cssProperty] = LayerStyle[cssProperty](this);
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
	    this._properties = {};
	    this._style = {};
	    this._prefer2d = false;
	    this._alwaysUseImageCache = false;
	    this._createElement();
	    if (options.hasOwnProperty("frame")) {
	      options = _.extend(options, options.frame);
	    }
	    options = Defaults.getDefaults("Layer", options);
	    Layer.__super__.constructor.call(this, options);
	    this._context.addLayer(this);
	    this._id = this._context.nextLayerId();
	    if (!options.superLayer) {
	      if (!options.shadow) {
	        this._insertElement();
	      }
	    } else {
	      this.superLayer = options.superLayer;
	    }
	    if (options.hasOwnProperty("index")) {
	      this.index = options.index;
	    }
	    this._subLayers = [];
	    this._context.emit("layer:create", this);
	  }
	
	  Layer.define("custom", Layer.simpleProperty("custom", void 0));
	
	  Layer.define("width", layerProperty(Layer, "width", "width", 100, _.isNumber));
	
	  Layer.define("height", layerProperty(Layer, "height", "height", 100, _.isNumber));
	
	  Layer.define("visible", layerProperty(Layer, "visible", "display", true, _.isBoolean));
	
	  Layer.define("opacity", layerProperty(Layer, "opacity", "opacity", 1, _.isNumber));
	
	  Layer.define("index", layerProperty(Layer, "index", "zIndex", 0, _.isNumber, null, {
	    importable: false,
	    exportable: false
	  }));
	
	  Layer.define("clip", layerProperty(Layer, "clip", "overflow", true, _.isBoolean));
	
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
	
	  Layer.define("perspective", layerProperty(Layer, "perspective", "webkitPerspective", 0, _.isNumber));
	
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
	
	  Layer.define("shadowColor", layerProperty(Layer, "shadowColor", "boxShadow", "", Color.isColor, Color.toColor));
	
	  Layer.define("backgroundColor", layerProperty(Layer, "backgroundColor", "backgroundColor", null, Color.isColor, Color.toColor));
	
	  Layer.define("color", layerProperty(Layer, "color", "color", null, Color.isColor, Color.toColor));
	
	  Layer.define("borderColor", layerProperty(Layer, "borderColor", "border", null, Color.isColor, Color.toColor));
	
	  Layer.define("borderWidth", layerProperty(Layer, "borderWidth", "border", 0, _.isNumber));
	
	  Layer.define("force2d", layerProperty(Layer, "force2d", "webkitTransform", false, _.isBoolean));
	
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
	
	  Layer.prototype.convertPoint = function(point) {
	    return Utils.convertPoint(point, null, this);
	  };
	
	  Layer.define("canvasFrame", {
	    importable: true,
	    exportable: false,
	    get: function() {
	      var context;
	      return Utils.convertPoint(this.frame, this, null, context = true);
	    },
	    set: function(frame) {
	      var context;
	      if (!this.superLayer) {
	        return this.frame = frame;
	      } else {
	        return this.frame = Utils.convertPoint(frame, null, this.superLayer, context = true);
	      }
	    }
	  });
	
	  Layer.define("screenFrame", {
	    importable: true,
	    exportable: false,
	    get: function() {
	      var context;
	      return Utils.convertPoint(this.frame, this, null, context = false);
	    },
	    set: function(frame) {
	      var context;
	      if (!this.superLayer) {
	        return this.frame = frame;
	      } else {
	        return this.frame = Utils.convertPoint(frame, null, this.superLayer, context = false);
	      }
	    }
	  });
	
	  Layer.prototype.contentFrame = function() {
	    if (!this.subLayers.length) {
	      return {
	        x: 0,
	        y: 0,
	        width: 0,
	        height: 0
	      };
	    }
	    return Utils.frameMerge(_.pluck(this.subLayers, "frame"));
	  };
	
	  Layer.prototype.centerFrame = function() {
	    var frame;
	    if (this.superLayer) {
	      frame = this.frame;
	      Utils.frameSetMidX(frame, parseInt(this.superLayer.width / 2.0));
	      Utils.frameSetMidY(frame, parseInt(this.superLayer.height / 2.0));
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
	    var context, i, len, ref, scale, superLayer;
	    scale = this.scale * this.scaleX;
	    ref = this.superLayers(context = true);
	    for (i = 0, len = ref.length; i < len; i++) {
	      superLayer = ref[i];
	      scale = scale * superLayer.scale * superLayer.scaleX;
	    }
	    return scale;
	  };
	
	  Layer.prototype.canvasScaleY = function() {
	    var context, i, len, ref, scale, superLayer;
	    scale = this.scale * this.scaleY;
	    ref = this.superLayers(context = true);
	    for (i = 0, len = ref.length; i < len; i++) {
	      superLayer = ref[i];
	      scale = scale * superLayer.scale * superLayer.scaleY;
	    }
	    return scale;
	  };
	
	  Layer.prototype.screenScaleX = function() {
	    var context, i, len, ref, scale, superLayer;
	    scale = this.scale * this.scaleX;
	    ref = this.superLayers(context = false);
	    for (i = 0, len = ref.length; i < len; i++) {
	      superLayer = ref[i];
	      scale = scale * superLayer.scale * superLayer.scaleX;
	    }
	    return scale;
	  };
	
	  Layer.prototype.screenScaleY = function() {
	    var context, i, len, ref, scale, superLayer;
	    scale = this.scale * this.scaleY;
	    ref = this.superLayers(context = false);
	    for (i = 0, len = ref.length; i < len; i++) {
	      superLayer = ref[i];
	      scale = scale * superLayer.scale * superLayer.scaleY;
	    }
	    return scale;
	  };
	
	  Layer.prototype.screenScaledFrame = function() {
	    var context, factorX, factorY, frame, i, layerScaledFrame, layers, len, superLayer;
	    frame = {
	      x: 0,
	      y: 0,
	      width: this.width * this.screenScaleX(),
	      height: this.height * this.screenScaleY()
	    };
	    layers = this.superLayers(context = true);
	    layers.push(this);
	    layers.reverse();
	    for (i = 0, len = layers.length; i < len; i++) {
	      superLayer = layers[i];
	      factorX = superLayer._superOrParentLayer() ? superLayer._superOrParentLayer().screenScaleX() : 1;
	      factorY = superLayer._superOrParentLayer() ? superLayer._superOrParentLayer().screenScaleY() : 1;
	      layerScaledFrame = superLayer.scaledFrame();
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
	    return this._context.getRootElement().appendChild(this._element);
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
	    if (this.superLayer) {
	      this.superLayer._subLayers = _.without(this.superLayer._subLayers, this);
	    }
	    if ((ref = this._element.parentNode) != null) {
	      ref.removeChild(this._element);
	    }
	    this.removeAllListeners();
	    this._context.removeLayer(this);
	    return this._context.emit("layer:destroy", this);
	  };
	
	  Layer.prototype.copy = function() {
	    var copiedSublayer, i, layer, len, ref, subLayer;
	    layer = this.copySingle();
	    ref = this.subLayers;
	    for (i = 0, len = ref.length; i < len; i++) {
	      subLayer = ref[i];
	      copiedSublayer = subLayer.copy();
	      copiedSublayer.superLayer = layer;
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
	      var currentValue, imageUrl, loader, ref, ref1;
	      if (!(_.isString(value) || value === null)) {
	        layerValueTypeError("image", value);
	      }
	      currentValue = this._getPropertyValue("image");
	      if (currentValue === value) {
	        return this.emit("load");
	      }
	      this.backgroundColor = null;
	      this._setPropertyValue("image", value);
	      if (value === null || value === "") {
	        this.style["background-image"] = null;
	        return;
	      }
	      imageUrl = value;
	      if (this._alwaysUseImageCache === false && Utils.isLocalAssetUrl(imageUrl)) {
	        imageUrl += "?nocache=" + NoCacheDateKey;
	      }
	      if ((ref = this._eventListeners) != null ? ref.hasOwnProperty("load" || ((ref1 = this._eventListeners) != null ? ref1.hasOwnProperty("error") : void 0)) : void 0) {
	        loader = new Image();
	        loader.name = imageUrl;
	        loader.src = imageUrl;
	        loader.onload = (function(_this) {
	          return function() {
	            _this.style["background-image"] = "url('" + imageUrl + "')";
	            return _this.emit("load", loader);
	          };
	        })(this);
	        return loader.onerror = (function(_this) {
	          return function() {
	            return _this.emit("error", loader);
	          };
	        })(this);
	      } else {
	        return this.style["background-image"] = "url('" + imageUrl + "')";
	      }
	    }
	  });
	
	  Layer.define("superLayer", {
	    enumerable: false,
	    exportable: false,
	    importable: true,
	    get: function() {
	      return this._superLayer || null;
	    },
	    set: function(layer) {
	      if (layer === this._superLayer) {
	        return;
	      }
	      if (!layer instanceof Layer) {
	        throw Error("Layer.superLayer needs to be a Layer object");
	      }
	      Utils.domCompleteCancel(this.__insertElement);
	      if (this._superLayer) {
	        this._superLayer._subLayers = _.without(this._superLayer._subLayers, this);
	        this._superLayer._element.removeChild(this._element);
	        this._superLayer.emit("change:subLayers", {
	          added: [],
	          removed: [this]
	        });
	      }
	      if (layer) {
	        layer._element.appendChild(this._element);
	        layer._subLayers.push(this);
	        layer.emit("change:subLayers", {
	          added: [this],
	          removed: []
	        });
	      } else {
	        this._insertElement();
	      }
	      this._superLayer = layer;
	      this.bringToFront();
	      return this.emit("change:superLayer");
	    }
	  });
	
	  Layer.define("subLayers", {
	    enumerable: false,
	    exportable: false,
	    importable: false,
	    get: function() {
	      return _.clone(this._subLayers);
	    }
	  });
	
	  Layer.define("siblingLayers", {
	    enumerable: false,
	    exportable: false,
	    importable: false,
	    get: function() {
	      if (this.superLayer === null) {
	        return _.filter(this._context.getLayers(), (function(_this) {
	          return function(layer) {
	            return layer !== _this && layer.superLayer === null;
	          };
	        })(this));
	      }
	      return _.without(this.superLayer.subLayers, this);
	    }
	  });
	
	  Layer.prototype.addSubLayer = function(layer) {
	    return layer.superLayer = this;
	  };
	
	  Layer.prototype.removeSubLayer = function(layer) {
	    if (indexOf.call(this.subLayers, layer) < 0) {
	      return;
	    }
	    return layer.superLayer = null;
	  };
	
	  Layer.prototype.subLayersByName = function(name) {
	    return _.filter(this.subLayers, function(layer) {
	      return layer.name === name;
	    });
	  };
	
	  Layer.prototype.siblingLayersByName = function(name) {
	    return _.filter(this.siblingLayers, function(layer) {
	      return layer.name === name;
	    });
	  };
	
	  Layer.prototype.superLayers = function(context) {
	    var currentLayer, superLayers;
	    if (context == null) {
	      context = false;
	    }
	    superLayers = [];
	    currentLayer = this;
	    if (context === false) {
	      while (currentLayer.superLayer) {
	        superLayers.push(currentLayer.superLayer);
	        currentLayer = currentLayer.superLayer;
	      }
	    } else {
	      while (currentLayer._superOrParentLayer()) {
	        superLayers.push(currentLayer._superOrParentLayer());
	        currentLayer = currentLayer._superOrParentLayer();
	      }
	    }
	    return superLayers;
	  };
	
	  Layer.prototype._superOrParentLayer = function() {
	    if (this.superLayer) {
	      return this.superLayer;
	    }
	    if (this._context._parentLayer) {
	      return this._context._parentLayer;
	    }
	  };
	
	  Layer.prototype.subLayersAbove = function(point, originX, originY) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    return _.filter(this.subLayers, function(layer) {
	      return Utils.framePointForOrigin(layer.frame, originX, originY).y < point.y;
	    });
	  };
	
	  Layer.prototype.subLayersBelow = function(point, originX, originY) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    return _.filter(this.subLayers, function(layer) {
	      return Utils.framePointForOrigin(layer.frame, originX, originY).y > point.y;
	    });
	  };
	
	  Layer.prototype.subLayersLeft = function(point, originX, originY) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    return _.filter(this.subLayers, function(layer) {
	      return Utils.framePointForOrigin(layer.frame, originX, originY).x < point.x;
	    });
	  };
	
	  Layer.prototype.subLayersRight = function(point, originX, originY) {
	    if (originX == null) {
	      originX = 0;
	    }
	    if (originY == null) {
	      originY = 0;
	    }
	    return _.filter(this.subLayers, function(layer) {
	      return Utils.framePointForOrigin(layer.frame, originX, originY).x > point.x;
	    });
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
	    return _.filter(this._context._animationList, (function(_this) {
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
	
	  Layer.prototype.addListener = function() {
	    var eventName, eventNames, i, j, len, listener, originalListener, results;
	    eventNames = 2 <= arguments.length ? slice.call(arguments, 0, i = arguments.length - 1) : (i = 0, []), originalListener = arguments[i++];
	    if (!originalListener) {
	      return;
	    }
	    listener = (function(_this) {
	      return function() {
	        var args;
	        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	        return originalListener.call.apply(originalListener, [_this].concat(slice.call(args), [_this]));
	      };
	    })(this);
	    originalListener.modifiedListener = listener;
	    if (typeof eventNames === 'string') {
	      eventNames = [eventNames];
	    }
	    results = [];
	    for (j = 0, len = eventNames.length; j < len; j++) {
	      eventName = eventNames[j];
	      results.push((function(_this) {
	        return function(eventName) {
	          var base;
	          Layer.__super__.addListener.call(_this, eventName, listener);
	          _this._context.eventManager.wrap(_this._element).addEventListener(eventName, listener);
	          if (_this._eventListeners == null) {
	            _this._eventListeners = {};
	          }
	          if ((base = _this._eventListeners)[eventName] == null) {
	            base[eventName] = [];
	          }
	          _this._eventListeners[eventName].push(listener);
	          if (!_.startsWith(eventName, "change:")) {
	            return _this.ignoreEvents = false;
	          }
	        };
	      })(this)(eventName));
	    }
	    return results;
	  };
	
	  Layer.prototype.removeListener = function() {
	    var eventName, eventNames, i, j, len, listener, results;
	    eventNames = 2 <= arguments.length ? slice.call(arguments, 0, i = arguments.length - 1) : (i = 0, []), listener = arguments[i++];
	    if (listener.modifiedListener) {
	      listener = listener.modifiedListener;
	    }
	    if (typeof eventNames === 'string') {
	      eventNames = [eventNames];
	    }
	    results = [];
	    for (j = 0, len = eventNames.length; j < len; j++) {
	      eventName = eventNames[j];
	      results.push((function(_this) {
	        return function(eventName) {
	          Layer.__super__.removeListener.call(_this, eventName, listener);
	          _this._context.eventManager.wrap(_this._element).removeEventListener(eventName, listener);
	          if (_this._eventListeners) {
	            return _this._eventListeners[eventName] = _.without(_this._eventListeners[eventName], listener);
	          }
	        };
	      })(this)(eventName));
	    }
	    return results;
	  };
	
	  Layer.prototype.once = function(eventName, listener) {
	    var originalListener;
	    originalListener = listener;
	    listener = (function(_this) {
	      return function() {
	        var args;
	        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	        originalListener.call.apply(originalListener, [_this].concat(slice.call(args), [_this]));
	        return _this.removeListener(eventName, listener);
	      };
	    })(this);
	    return this.addListener(eventName, listener);
	  };
	
	  Layer.prototype.removeAllListeners = function() {
	    var eventName, listener, listeners, ref, results;
	    if (!this._eventListeners) {
	      return;
	    }
	    ref = this._eventListeners;
	    results = [];
	    for (eventName in ref) {
	      listeners = ref[eventName];
	      results.push((function() {
	        var i, len, results1;
	        results1 = [];
	        for (i = 0, len = listeners.length; i < len; i++) {
	          listener = listeners[i];
	          results1.push(this.removeListener(eventName, listener));
	        }
	        return results1;
	      }).call(this));
	    }
	    return results;
	  };
	
	  Layer.prototype.on = Layer.prototype.addListener;
	
	  Layer.prototype.off = Layer.prototype.removeListener;
	
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
/* 11 */
/*!******************************!*\
  !*** ./framer/Config.coffee ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var FramerCSS, Utils;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	FramerCSS = "body {\n	margin: 0;\n}\n\n.framerContext {	\n	position: absolute;\n	left: 0;\n	top: 0;\n	right: 0;\n	bottom: 0;\n	pointer-events: none;\n	overflow: hidden;\n}\n\n.framerLayer {\n	display: block;\n	position: absolute;\n	left: 0;\n	top: 0;\n	background-repeat: no-repeat;\n	background-size: cover;\n	-webkit-overflow-scrolling: touch;\n	-webkit-box-sizing: border-box;\n	-webkit-user-select: none;\n}\n\n.framerLayer input,\n.framerLayer textarea,\n.framerLayer select,\n.framerLayer option,\n.framerLayer div[contenteditable=true]\n{\n	pointer-events: auto;\n	-webkit-user-select: auto;\n}\n\n.framerDebug {\n	padding: 6px;\n	color: #fff;\n	font: 10px/1em Monaco;\n}\n";
	
	Utils.domComplete(function() {
	  return Utils.insertCSS(FramerCSS);
	});


/***/ },
/* 12 */
/*!********************************!*\
  !*** ./framer/Defaults.coffee ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	var Originals, Utils, _;
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	Originals = {
	  Layer: {
	    backgroundColor: "rgba(0,124,255,.5)",
	    width: 100,
	    height: 100
	  },
	  Animation: {
	    curve: "ease",
	    time: 1
	  },
	  DeviceComponent: {
	    fullScreen: false,
	    padding: 50,
	    deviceType: "iphone-5s-spacegray",
	    deviceZoom: "fit",
	    contentZoom: 1,
	    orientation: "portrait",
	    keyboard: false,
	    animationOptions: {
	      curve: "spring(400,40,0)"
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
/* 13 */
/*!*********************************!*\
  !*** ./framer/Animation.coffee ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var AnimatorClassBezierPresets, AnimatorClasses, BezierCurveAnimator, Config, Defaults, EventEmitter, LinearAnimator, SpringDHOAnimator, SpringRK4Animator, Utils, _, evaluateRelativeProperty, isRelativeProperty, numberRE, relativePropertyRE,
	  slice = [].slice,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	Config = __webpack_require__(/*! ./Config */ 11).Config;
	
	Defaults = __webpack_require__(/*! ./Defaults */ 12).Defaults;
	
	EventEmitter = __webpack_require__(/*! ./EventEmitter */ 7).EventEmitter;
	
	LinearAnimator = __webpack_require__(/*! ./Animators/LinearAnimator */ 14).LinearAnimator;
	
	BezierCurveAnimator = __webpack_require__(/*! ./Animators/BezierCurveAnimator */ 16).BezierCurveAnimator;
	
	SpringRK4Animator = __webpack_require__(/*! ./Animators/SpringRK4Animator */ 17).SpringRK4Animator;
	
	SpringDHOAnimator = __webpack_require__(/*! ./Animators/SpringDHOAnimator */ 19).SpringDHOAnimator;
	
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
	
	exports.Animation = (function(superClass) {
	  extend(Animation, superClass);
	
	  function Animation(options) {
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
	      debug: false
	    }));
	    if (options.origin) {
	      console.warn("Animation.origin: please use layer.originX and layer.originY");
	    }
	    this.options.properties = Animation.filterAnimatableProperties(this.options.properties);
	    this._parseAnimatorOptions();
	    this._originalState = this._currentState();
	    this._repeatCounter = this.options.repeat;
	  }
	
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
	    if (emit == null) {
	      emit = true;
	    }
	    this.options.layer._context._animationList = _.without(this.options.layer._context._animationList, this);
	    if (emit) {
	      this.emit("stop");
	    }
	    return Framer.Loop.off("update", this._update);
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
	    this.options.layer._context._animationList.push(this);
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
	    var k, ref, v;
	    ref = this._stateB;
	    for (k in ref) {
	      v = ref[k];
	      if (v instanceof Color) {
	        this._target[k] = Color.modulateFromToColor(this._stateA[k], this._stateB[k], value);
	      } else {
	        this._target[k] = Utils.mapRange(value, 0, 1, this._stateA[k], this._stateB[k]);
	      }
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
	      if (_.isNumber(v) || _.isFunction(v) || isRelativeProperty(v) || v instanceof Color) {
	        animatableProperties[k] = v;
	      } else if (_.isString(v)) {
	        if (Color.isColorString(v)) {
	          animatableProperties[k] = new Color(v);
	        }
	      }
	    }
	    return animatableProperties;
	  };
	
	  return Animation;
	
	})(EventEmitter);


/***/ },
/* 14 */
/*!************************************************!*\
  !*** ./framer/Animators/LinearAnimator.coffee ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Animator, Utils,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(/*! ../Utils */ 4);
	
	Animator = __webpack_require__(/*! ../Animator */ 15).Animator;
	
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
/* 15 */
/*!********************************!*\
  !*** ./framer/Animator.coffee ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	var Config, Utils;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	Config = __webpack_require__(/*! ./Config */ 11).Config;
	
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
/* 16 */
/*!*****************************************************!*\
  !*** ./framer/Animators/BezierCurveAnimator.coffee ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Animator, BezierCurveDefaults, UnitBezier, Utils, _,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(/*! ../Underscore */ 1)._;
	
	Utils = __webpack_require__(/*! ../Utils */ 4);
	
	Animator = __webpack_require__(/*! ../Animator */ 15).Animator;
	
	BezierCurveDefaults = {
	  "linear": [0, 0, 1, 1],
	  "ease": [.25, .1, .25, 1],
	  "ease-in": [.42, 0, 1, 1],
	  "ease-out": [0, 0, .58, 1],
	  "ease-in-out": [.42, 0, .58, 1]
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
/* 17 */
/*!***************************************************!*\
  !*** ./framer/Animators/SpringRK4Animator.coffee ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Animator, Integrator, Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(/*! ../Utils */ 4);
	
	Animator = __webpack_require__(/*! ../Animator */ 15).Animator;
	
	Integrator = __webpack_require__(/*! ../Integrator */ 18).Integrator;
	
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
/* 18 */
/*!**********************************!*\
  !*** ./framer/Integrator.coffee ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var Config, Utils;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	Config = __webpack_require__(/*! ./Config */ 11).Config;
	
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
/* 19 */
/*!***************************************************!*\
  !*** ./framer/Animators/SpringDHOAnimator.coffee ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Animator, Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(/*! ../Utils */ 4);
	
	Animator = __webpack_require__(/*! ../Animator */ 15).Animator;
	
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
/* 20 */
/*!**********************************!*\
  !*** ./framer/LayerStyle.coffee ***!
  \**********************************/
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
	    return "translate3d(" + layer._properties.x + "px," + layer._properties.y + "px," + layer._properties.z + "px) scale(" + layer._properties.scale + ") scale3d(" + layer._properties.scaleX + "," + layer._properties.scaleY + "," + layer._properties.scaleZ + ") skew(" + layer._properties.skew + "deg," + layer._properties.skew + "deg) skewX(" + layer._properties.skewX + "deg) skewY(" + layer._properties.skewY + "deg) rotateX(" + layer._properties.rotationX + "deg) rotateY(" + layer._properties.rotationY + "deg) rotateZ(" + layer._properties.rotationZ + "deg)";
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
	  pointerEvents: function(layer) {
	    if (layer._properties.ignoreEvents) {
	      return "none";
	    } else {
	      return "auto";
	    }
	  },
	  boxShadow: function(layer) {
	    if (!layer._properties.shadowColor) {
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
/* 21 */
/*!***********************************!*\
  !*** ./framer/LayerStates.coffee ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, Defaults, Events, LayerStatesIgnoredKeys, _,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	  slice = [].slice;
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	Events = __webpack_require__(/*! ./Events */ 22).Events;
	
	BaseClass = __webpack_require__(/*! ./BaseClass */ 6).BaseClass;
	
	Defaults = __webpack_require__(/*! ./Defaults */ 12).Defaults;
	
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
	      } else if (v instanceof Color) {
	        animatablePropertyKeys.push(k);
	      }
	    }
	    if (animatablePropertyKeys.length === 0) {
	      instant = true;
	    }
	    if (instant === true) {
	      this.layer.props = properties;
	      return this.emit(Events.StateDidSwitch, _.last(this._previousStates), stateName, this);
	    } else {
	      if (animationOptions == null) {
	        animationOptions = this.animationOptions;
	      }
	      animationOptions.properties = properties;
	      if ((ref1 = this._animation) != null) {
	        ref1.stop();
	      }
	      this._animation = this.layer.animate(animationOptions);
	      return this._animation.on("stop", (function(_this) {
	        return function() {
	          for (k in properties) {
	            v = properties[k];
	            if (!(_.isNumber(v) || v instanceof Color)) {
	              _this.layer[k] = v;
	            }
	          }
	          return _this.emit(Events.StateDidSwitch, _.last(_this._previousStates), stateName, _this);
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
	      } else if (_.isNumber(v) || _.isFunction(v) || _.isBoolean(v) || _.isString(v) || v instanceof Color) {
	        stateProperties[k] = v;
	      }
	    }
	    return stateProperties;
	  };
	
	  return LayerStates;
	
	})(BaseClass);


/***/ },
/* 22 */
/*!******************************!*\
  !*** ./framer/Events.coffee ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var Events, Utils, _;
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
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
	  return Framer.CurrentContext.eventManager.wrap(element);
	};
	
	exports.Events = Events;


/***/ },
/* 23 */
/*!**************************************!*\
  !*** ./framer/LayerDraggable.coffee ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, Defaults, EventBuffer, Events, Simulation, Utils, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	BaseClass = __webpack_require__(/*! ./BaseClass */ 6).BaseClass;
	
	Events = __webpack_require__(/*! ./Events */ 22).Events;
	
	Simulation = __webpack_require__(/*! ./Simulation */ 24).Simulation;
	
	Defaults = __webpack_require__(/*! ./Defaults */ 12).Defaults;
	
	EventBuffer = __webpack_require__(/*! ./EventBuffer */ 29).EventBuffer;
	
	Events.Move = "move";
	
	Events.DragStart = "dragstart";
	
	Events.DragWillMove = "dragwillmove";
	
	Events.DragMove = "dragmove";
	
	Events.DragDidMove = "dragmove";
	
	Events.Drag = "dragmove";
	
	Events.DragEnd = "dragend";
	
	Events.DragAnimationDidStart = "draganimationdidstart";
	
	Events.DragAnimationDidEnd = "draganimationdidend";
	
	Events.DirectionLockDidStart = "directionlockdidstart";
	
	"         \n┌──────┐                   │         \n│      │                             \n│      │  ───────────────▶ │ ◀────▶  \n│      │                             \n└──────┘                   │         \n                                     \n════════  ═════════════════ ═══════  \n                                     \n  Drag         Momentum      Bounce  \n                                         ";
	
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
	        this._constraints = _.defaults(value, {
	          x: 0,
	          y: 0,
	          width: 0,
	          height: 0
	        });
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
	    this.touchStart = bind(this.touchStart, this);
	    options = Defaults.getDefaults("LayerDraggable", {});
	    LayerDraggable.__super__.constructor.call(this, options);
	    _.extend(this, options);
	    this.enabled = true;
	    this._eventBuffer = new EventBuffer;
	    this._constraints = null;
	    this.attach();
	  }
	
	  LayerDraggable.prototype.attach = function() {
	    return this.layer.on(Events.TouchStart, this._touchStart);
	  };
	
	  LayerDraggable.prototype.remove = function() {
	    return this.layer.off(Events.TouchStart, this._touchStart);
	  };
	
	  LayerDraggable.prototype.updatePosition = function(point) {
	    return point;
	  };
	
	  LayerDraggable.prototype.touchStart = function(event) {
	    return this._touchStart(event);
	  };
	
	  LayerDraggable.prototype._touchStart = function(event) {
	    var touchEvent;
	    this._isMoving = this.isAnimating;
	    this.layer.animateStop();
	    this._stopSimulation();
	    this._resetdirectionLock();
	    event.preventDefault();
	    if (!this.propagateEvents) {
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
	    document.addEventListener(Events.TouchMove, this._touchMove);
	    document.addEventListener(Events.TouchEnd, this._touchEnd);
	    return this.emit(Events.DragStart, event);
	  };
	
	  LayerDraggable.prototype._touchMove = function(event) {
	    var offset, point, touchEvent;
	    if (!this.enabled) {
	      return;
	    }
	    event.preventDefault();
	    if (!this.propagateEvents) {
	      event.stopPropagation();
	    }
	    touchEvent = Events.touchEvent(event);
	    this._eventBuffer.push({
	      x: touchEvent.clientX,
	      y: touchEvent.clientY,
	      t: Date.now()
	    });
	    offset = {
	      x: touchEvent.clientX - this._correctedLayerStartPoint.x - this._layerCursorOffset.x,
	      y: touchEvent.clientY - this._correctedLayerStartPoint.y - this._layerCursorOffset.y
	    };
	    offset.x = offset.x * this.speedX * (1 / this.layer.canvasScaleX()) * this.layer.scaleX * this.layer.scale;
	    offset.y = offset.y * this.speedY * (1 / this.layer.canvasScaleY()) * this.layer.scaleY * this.layer.scale;
	    point = this.layer.point;
	    if (this.horizontal) {
	      point.x = this._correctedLayerStartPoint.x + offset.x;
	    }
	    if (this.vertical) {
	      point.y = this._correctedLayerStartPoint.y + offset.y;
	    }
	    if (this._constraints) {
	      point = this._constrainPosition(point, this._constraints, this.overdragScale);
	    }
	    if (this.directionLock) {
	      if (!this._directionLockEnabledX && !this._directionLockEnabledY) {
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
	    if (this.pixelAlign) {
	      point.x = parseInt(point.x);
	      point.y = parseInt(point.y);
	    }
	    if (point.x !== this._layerStartPoint.x || point.y !== this._layerStartPoint.y) {
	      this._isDragging = true;
	      this._isMoving = true;
	    }
	    if (this.isDragging) {
	      this.emit(Events.DragWillMove, event);
	    }
	    this.layer.point = this.updatePosition(point);
	    if (this.isDragging) {
	      this.emit(Events.Move, this.layer.point);
	      return this.emit(Events.DragDidMove, event);
	    }
	  };
	
	  LayerDraggable.prototype._touchEnd = function(event) {
	    if (!this.propagateEvents) {
	      event.stopPropagation();
	    }
	    document.removeEventListener(Events.TouchMove, this._touchMove);
	    document.removeEventListener(Events.TouchEnd, this._touchEnd);
	    this._startSimulation();
	    this.emit(Events.DragEnd, event);
	    return this._isDragging = false;
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
	    this.layer.emit(eventName, event, this);
	    return LayerDraggable.__super__.emit.call(this, eventName, event, this);
	  };
	
	  LayerDraggable.prototype._updatedirectionLock = function(correctedDelta) {
	    this._directionLockEnabledX = Math.abs(correctedDelta.y) > this.directionLockThreshold.y;
	    this._directionLockEnabledY = Math.abs(correctedDelta.x) > this.directionLockThreshold.x;
	    if (this._directionLockEnabledX || this._directionLockEnabledY) {
	      return this.emit(Events.DirectionLockDidStart, {
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
	      updatePoint[axis] = updatePoint[axis] + (delta * this.speedX);
	    }
	    if (axis === "y") {
	      updatePoint[axis] = updatePoint[axis] + (delta * this.speedY);
	    }
	    this.updatePosition(updatePoint);
	    this.layer[axis] = this.updatePosition(updatePoint)[axis];
	    return this.emit(Events.Move, this.layer.point);
	  };
	
	  LayerDraggable.prototype._onSimulationStop = function(axis, state) {
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
	    return this.emit(Events.DragAnimationDidStart);
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
	    return this.emit(Events.DragAnimationDidEnd);
	  };
	
	  LayerDraggable.prototype.animateStop = function() {
	    return this._stopSimulation();
	  };
	
	  return LayerDraggable;
	
	})(BaseClass);


/***/ },
/* 24 */
/*!**********************************!*\
  !*** ./framer/Simulation.coffee ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, Config, Defaults, Events, FrictionSimulator, MomentumBounceSimulator, SimulatorClasses, SpringSimulator, Utils, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	Config = __webpack_require__(/*! ./Config */ 11).Config;
	
	Defaults = __webpack_require__(/*! ./Defaults */ 12).Defaults;
	
	BaseClass = __webpack_require__(/*! ./BaseClass */ 6).BaseClass;
	
	Events = __webpack_require__(/*! ./Events */ 22).Events;
	
	SpringSimulator = __webpack_require__(/*! ./Simulators/SpringSimulator */ 25).SpringSimulator;
	
	FrictionSimulator = __webpack_require__(/*! ./Simulators/FrictionSimulator */ 27).FrictionSimulator;
	
	MomentumBounceSimulator = __webpack_require__(/*! ./Simulators/MomentumBounceSimulator */ 28).MomentumBounceSimulator;
	
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
	    this.options.layer._context._animationList = _.without(this.options.layer._context._animationList, this);
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
	    this.options.layer._context._animationList.push(this);
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
/* 25 */
/*!**************************************************!*\
  !*** ./framer/Simulators/SpringSimulator.coffee ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Defaults, Integrator, Simulator, Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(/*! ../Utils */ 4);
	
	Defaults = __webpack_require__(/*! ../Defaults */ 12).Defaults;
	
	Simulator = __webpack_require__(/*! ../Simulator */ 26).Simulator;
	
	Integrator = __webpack_require__(/*! ../Integrator */ 18).Integrator;
	
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
/* 26 */
/*!*********************************!*\
  !*** ./framer/Simulator.coffee ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, Config, Utils, _,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	Config = __webpack_require__(/*! ./Config */ 11).Config;
	
	BaseClass = __webpack_require__(/*! ./BaseClass */ 6).BaseClass;
	
	exports.Simulator = (function(superClass) {
	  "The simulator class runs a physics simulation based on a set of input values \nat setup({input values}), and emits an output state {x, v}";
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
/* 27 */
/*!****************************************************!*\
  !*** ./framer/Simulators/FrictionSimulator.coffee ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Defaults, Integrator, Simulator, Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(/*! ../Utils */ 4);
	
	Defaults = __webpack_require__(/*! ../Defaults */ 12).Defaults;
	
	Simulator = __webpack_require__(/*! ../Simulator */ 26).Simulator;
	
	Integrator = __webpack_require__(/*! ../Integrator */ 18).Integrator;
	
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
/* 28 */
/*!**********************************************************!*\
  !*** ./framer/Simulators/MomentumBounceSimulator.coffee ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Defaults, FrictionSimulator, Simulator, SpringSimulator, Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(/*! ../Utils */ 4);
	
	Defaults = __webpack_require__(/*! ../Defaults */ 12).Defaults;
	
	Simulator = __webpack_require__(/*! ../Simulator */ 26).Simulator;
	
	SpringSimulator = __webpack_require__(/*! ./SpringSimulator */ 25).SpringSimulator;
	
	FrictionSimulator = __webpack_require__(/*! ./FrictionSimulator */ 27).FrictionSimulator;
	
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
/* 29 */
/*!***********************************!*\
  !*** ./framer/EventBuffer.coffee ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, Events, Utils, _,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	BaseClass = __webpack_require__(/*! ./BaseClass */ 6).BaseClass;
	
	Events = __webpack_require__(/*! ./Events */ 22).Events;
	
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
/* 30 */
/*!***************************************!*\
  !*** ./framer/BackgroundLayer.coffee ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	var Layer,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Layer = __webpack_require__(/*! ./Layer */ 10).Layer;
	
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
	    this._context.eventManager.wrap(window).addEventListener("resize", this.layout);
	  }
	
	  BackgroundLayer.prototype.layout = function() {
	    if (this.superLayer) {
	      return this.frame = {
	        x: 0,
	        y: 0,
	        width: this.superLayer.width,
	        height: this.superLayer.height
	      };
	    } else if (this._context._parentLayer) {
	      return this.frame = {
	        x: 0,
	        y: 0,
	        width: this._context._parentLayer.width,
	        height: this._context._parentLayer.height
	      };
	    } else {
	      return this.frame = {
	        x: 0,
	        y: 0,
	        width: window.innerWidth,
	        height: window.innerHeight
	      };
	    }
	  };
	
	  return BackgroundLayer;
	
	})(Layer);


/***/ },
/* 31 */
/*!**********************************!*\
  !*** ./framer/VideoLayer.coffee ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var Layer,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Layer = __webpack_require__(/*! ./Layer */ 10).Layer;
	
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
	    this.player.on = this.player.addEventListener;
	    this.player.off = this.player.removeEventListener;
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
/* 32 */
/*!**************************************!*\
  !*** ./framer/AnimationGroup.coffee ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var AnimationGroup, EventEmitter, _,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	EventEmitter = __webpack_require__(/*! ./EventEmitter */ 7).EventEmitter;
	
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
/* 33 */
/*!******************************!*\
  !*** ./framer/Canvas.coffee ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, CanvasClass, Events,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	BaseClass = __webpack_require__(/*! ./BaseClass */ 6).BaseClass;
	
	Events = __webpack_require__(/*! ./Events */ 22).Events;
	
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
	
	  return CanvasClass;
	
	})(BaseClass);
	
	exports.Canvas = new CanvasClass;


/***/ },
/* 34 */
/*!*****************************!*\
  !*** ./framer/Print.coffee ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var Context, Utils, printContext, printLayer,
	  slice = [].slice;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	Context = __webpack_require__(/*! ./Context */ 35).Context;
	
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
	      printContext.eventManager.wrap(window).addEventListener("resize", update);
	    }
	    printPrefix = "» ";
	    printNode = document.createElement("div");
	    printNode.innerHTML = _.escape(printPrefix + args.map(Utils.inspect).join(", ")) + "<br>";
	    printNode.style["-webkit-user-select"] = "text";
	    printNode.style["cursor"] = "auto";
	    return printLayer._element.appendChild(printNode);
	  });
	  return Utils.delay(0, function() {
	    return printLayer._element.scrollTop = printLayer._element.scrollHeight;
	  });
	};


/***/ },
/* 35 */
/*!*******************************!*\
  !*** ./framer/Context.coffee ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseClass, Config, Counter, EventManager, Utils, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	BaseClass = __webpack_require__(/*! ./BaseClass */ 6).BaseClass;
	
	Config = __webpack_require__(/*! ./Config */ 11).Config;
	
	EventManager = __webpack_require__(/*! ./EventManager */ 36).EventManager;
	
	Counter = 1;
	
	exports.Context = (function(superClass) {
	  extend(Context, superClass);
	
	  function Context(options) {
	    if (options == null) {
	      options = {};
	    }
	    this._appendRootElement = bind(this._appendRootElement, this);
	    Context.__super__.constructor.apply(this, arguments);
	    Counter++;
	    options = _.defaults(options, {
	      contextName: null,
	      parentLayer: null,
	      name: null
	    });
	    if (!options.name) {
	      throw Error("Contexts need a name");
	    }
	    this._parentLayer = options.parentLayer;
	    this._name = options.name;
	    this.reset();
	  }
	
	  Context.prototype.reset = function() {
	    var animation, i, len, ref, ref1, ref2, ref3;
	    if ((ref = this.eventManager) != null) {
	      ref.reset();
	    }
	    this.eventManager = new EventManager;
	    if (this._rootElement) {
	      if (this._rootElement.parentNode) {
	        this._rootElement.parentNode.removeChild(this._rootElement);
	      } else {
	        this._rootElement.__cancelAppendChild = true;
	      }
	    }
	    this._createRootElement();
	    if ((ref1 = this._delayTimers) != null) {
	      ref1.map(function(timer) {
	        return window.clearTimeout(timer);
	      });
	    }
	    if ((ref2 = this._delayIntervals) != null) {
	      ref2.map(function(timer) {
	        return window.clearInterval(timer);
	      });
	    }
	    if (this._animationList) {
	      ref3 = this._animationList;
	      for (i = 0, len = ref3.length; i < len; i++) {
	        animation = ref3[i];
	        animation.stop(false);
	      }
	    }
	    this._layerList = [];
	    this._animationList = [];
	    this._delayTimers = [];
	    this._delayIntervals = [];
	    this._layerIdCounter = 1;
	    return this.emit("reset", this);
	  };
	
	  Context.prototype.destroy = function() {
	    this.reset();
	    if (this._rootElement.parentNode) {
	      this._rootElement.parentNode.removeChild(this._rootElement);
	    }
	    return Utils.domCompleteCancel(this._appendRootElement);
	  };
	
	  Context.prototype.getRootElement = function() {
	    return this._rootElement;
	  };
	
	  Context.prototype.getLayers = function() {
	    return _.clone(this._layerList);
	  };
	
	  Context.prototype.addLayer = function(layer) {
	    if (indexOf.call(this._layerList, layer) >= 0) {
	      return;
	    }
	    this._layerList.push(layer);
	    return null;
	  };
	
	  Context.prototype.removeLayer = function(layer) {
	    this._layerList = _.without(this._layerList, layer);
	    return null;
	  };
	
	  Context.prototype.layerCount = function() {
	    return this._layerList.length;
	  };
	
	  Context.prototype.nextLayerId = function() {
	    return this._layerIdCounter++;
	  };
	
	  Context.prototype._createRootElement = function() {
	    this._rootElement = document.createElement("div");
	    this._rootElement.id = "FramerContextRoot-" + this._name;
	    this._rootElement.classList.add("framerContext");
	    if (this._parentLayer) {
	      return this._appendRootElement();
	    } else {
	      return Utils.domComplete(this._appendRootElement);
	    }
	  };
	
	  Context.prototype._appendRootElement = function() {
	    var parentElement, ref;
	    parentElement = (ref = this._parentLayer) != null ? ref._element : void 0;
	    if (parentElement == null) {
	      parentElement = document.body;
	    }
	    return parentElement.appendChild(this._rootElement);
	  };
	
	  Context.prototype.run = function(f) {
	    var previousContext;
	    previousContext = Framer.CurrentContext;
	    Framer.CurrentContext = this;
	    f();
	    return Framer.CurrentContext = previousContext;
	  };
	
	  Context.define("width", {
	    get: function() {
	      if (this._parentLayer) {
	        return this._parentLayer.width;
	      }
	      return window.innerWidth;
	    }
	  });
	
	  Context.define("height", {
	    get: function() {
	      if (this._parentLayer) {
	        return this._parentLayer.height;
	      }
	      return window.innerHeight;
	    }
	  });
	
	  return Context;
	
	})(BaseClass);


/***/ },
/* 36 */
/*!************************************!*\
  !*** ./framer/EventManager.coffee ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var EventManagerElement, EventManagerIdCounter, Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	EventManagerIdCounter = 0;
	
	EventManagerElement = (function() {
	  function EventManagerElement(element1) {
	    this.element = element1;
	    this._events = {};
	  }
	
	  EventManagerElement.prototype.addEventListener = function(eventName, listener) {
	    var base;
	    if (!Utils.domValidEvent(this.element, eventName)) {
	      return;
	    }
	    if ((base = this._events)[eventName] == null) {
	      base[eventName] = [];
	    }
	    this._events[eventName].push(listener);
	    return this.element.addEventListener(eventName, listener);
	  };
	
	  EventManagerElement.prototype.removeEventListener = function(eventName, listener) {
	    if (!this._events) {
	      return;
	    }
	    if (!this._events[eventName]) {
	      return;
	    }
	    this._events[eventName] = _.without(this._events[eventName], listener);
	    this.element.removeEventListener(eventName, listener);
	  };
	
	  EventManagerElement.prototype.removeAllEventListeners = function(eventName) {
	    var eventListener, events, i, j, len, len1, ref;
	    events = eventName ? [eventName] : _.keys(this._events);
	    for (i = 0, len = events.length; i < len; i++) {
	      eventName = events[i];
	      ref = this._events[eventName];
	      for (j = 0, len1 = ref.length; j < len1; j++) {
	        eventListener = ref[j];
	        this.removeEventListener(eventName, eventListener);
	      }
	    }
	  };
	
	  EventManagerElement.prototype.once = function(event, listener) {
	    var fn;
	    fn = (function(_this) {
	      return function() {
	        _this.removeListener(event, fn);
	        return listener.apply(null, arguments);
	      };
	    })(this);
	    return this.on(event, fn);
	  };
	
	  EventManagerElement.prototype.on = EventManagerElement.prototype.addEventListener;
	
	  EventManagerElement.prototype.off = EventManagerElement.prototype.removeEventListener;
	
	  return EventManagerElement;
	
	})();
	
	exports.EventManager = (function() {
	  function EventManager(element) {
	    this.wrap = bind(this.wrap, this);
	    this._elements = {};
	  }
	
	  EventManager.prototype.wrap = function(element) {
	    if (!element._eventManagerId) {
	      element._eventManagerId = EventManagerIdCounter++;
	    }
	    if (!this._elements[element._eventManagerId]) {
	      this._elements[element._eventManagerId] = new EventManagerElement(element);
	    }
	    return this._elements[element._eventManagerId];
	  };
	
	  EventManager.prototype.reset = function() {
	    var element, elementEventManager, ref, results;
	    ref = this._elements;
	    results = [];
	    for (element in ref) {
	      elementEventManager = ref[element];
	      results.push(elementEventManager.removeAllEventListeners());
	    }
	    return results;
	  };
	
	  return EventManager;

	})();


/***/ },
/* 37 */
/*!**************************************************!*\
  !*** ./framer/Components/ScrollComponent.coffee ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	var EventMappers, Events, Layer, Utils, _, wrapComponent,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  slice = [].slice,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	_ = __webpack_require__(/*! ../Underscore */ 1)._;
	
	Utils = __webpack_require__(/*! ../Utils */ 4);
	
	Layer = __webpack_require__(/*! ../Layer */ 10).Layer;
	
	Events = __webpack_require__(/*! ../Events */ 22).Events;
	
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
	
	EventMappers[Events.ScrollAnimationDidStart] = Events.DragAnimationDidStart;
	
	EventMappers[Events.ScrollAnimationDidEnd] = Events.DragAnimationDidEnd;
	
	EventMappers[Events.DirectionLockDidStart] = Events.DirectionLockDidStart;
	
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
	    this._enableMouseWheelHandling();
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
	    this._content.superLayer = this;
	    this._content.name = "content";
	    this._content.clip = false;
	    this._content.draggable.enabled = true;
	    this._content.draggable.momentum = true;
	    this._content.on("change:subLayers", this.updateContent);
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
	    var constraintsFrame, contentFrame;
	    if (!this.content) {
	      return;
	    }
	    contentFrame = this.calculateContentFrame();
	    contentFrame.x = contentFrame.x + this._contentInset.left;
	    contentFrame.y = contentFrame.y + this._contentInset.top;
	    this.content.frame = contentFrame;
	    constraintsFrame = this.calculateContentFrame();
	    constraintsFrame = {
	      x: -constraintsFrame.width + this.width - this._contentInset.right,
	      y: -constraintsFrame.height + this.height - this._contentInset.bottom,
	      width: constraintsFrame.width + constraintsFrame.width - this.width + this._contentInset.left + this._contentInset.right,
	      height: constraintsFrame.height + constraintsFrame.height - this.height + this._contentInset.top + this._contentInset.bottom
	    };
	    this.content.draggable.constraints = constraintsFrame;
	    if (this.content.subLayers.length) {
	      if (this.content.backgroundColor === Framer.Defaults.Layer.backgroundColor) {
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
	    if (contentLayer && contentLayer.superLayer !== this.content) {
	      throw Error("This layer is not in the scroll component content");
	    }
	    if (!contentLayer || this.content.subLayers.length === 0) {
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
	    return Utils.frameSortByAbsoluteDistance(scrollPoint, this.content.subLayers, originX, originY);
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
	    contentLayer = _.first(_.without(copy.subLayers, copy.content));
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
	  var i, j, len, len1, propKey, ref, ref1, screenFrame, scroll, subLayer, subLayerIndex, wrapper;
	  if (options == null) {
	    options = {
	      correct: true
	    };
	  }
	  scroll = instance;
	  if (options.correct === true) {
	    if (layer.subLayers.length === 0) {
	      wrapper = new Layer;
	      wrapper.name = "ScrollComponent";
	      wrapper.frame = layer.frame;
	      layer.superLayer = wrapper;
	      layer.x = layer.y = 0;
	      layer = wrapper;
	      console.log("Corrected the scroll component without sub layers");
	    }
	  }
	  ref = ["frame", "image", "name"];
	  for (i = 0, len = ref.length; i < len; i++) {
	    propKey = ref[i];
	    scroll[propKey] = layer[propKey];
	  }
	  if (options.correct === true) {
	    screenFrame = scroll.screenFrame;
	    if (screenFrame.x < Screen.width) {
	      if (screenFrame.x + screenFrame.width > Screen.width) {
	        scroll.width = Screen.width - screenFrame.x;
	        console.log("Corrected the scroll width to " + scroll.width);
	      }
	    }
	    if (screenFrame.y < Screen.height) {
	      if (screenFrame.y + screenFrame.height > Screen.height) {
	        scroll.height = Screen.height - screenFrame.y;
	        console.log("Corrected the scroll height to " + scroll.height);
	      }
	    }
	  }
	  ref1 = layer.subLayers;
	  for (j = 0, len1 = ref1.length; j < len1; j++) {
	    subLayer = ref1[j];
	    subLayerIndex = subLayer.index;
	    subLayer.superLayer = scroll.content;
	    subLayer.index = subLayerIndex;
	  }
	  scroll.superLayer = layer.superLayer;
	  scroll.index = layer.index;
	  layer.destroy();
	  return scroll;
	};


/***/ },
/* 38 */
/*!************************************************!*\
  !*** ./framer/Components/PageComponent.coffee ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Events, ScrollComponent,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	Events = __webpack_require__(/*! ../Events */ 22).Events;
	
	ScrollComponent = __webpack_require__(/*! ./ScrollComponent */ 37).ScrollComponent;
	
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
	    this._onAminationEnd = bind(this._onAminationEnd, this);
	    this._onAminationStep = bind(this._onAminationStep, this);
	    this._onAminationStart = bind(this._onAminationStart, this);
	    this._scrollMove = bind(this._scrollMove, this);
	    this._scrollStart = bind(this._scrollStart, this);
	    PageComponent.__super__.constructor.apply(this, arguments);
	    this.content.draggable.momentum = false;
	    this.content.draggable.bounce = false;
	    this.on(Events.ScrollStart, this._scrollStart);
	    this.on(Events.ScrollEnd, this._scrollEnd);
	    this.content.on("change:frame", _.debounce(this._scrollMove, 16));
	    this.content.on("change:subLayers", this._resetHistory);
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
	      layers = this.content.subLayersAbove(point, this.originX, this.originY);
	    }
	    if (direction === "down" || direction === "bottom" || direction === "south") {
	      layers = this.content.subLayersBelow(point, this.originX, this.originY);
	    }
	    if (direction === "left" || direction === "west") {
	      layers = this.content.subLayersLeft(point, this.originX, this.originY);
	    }
	    if (direction === "right" || direction === "east") {
	      layers = this.content.subLayersRight(point, this.originX, this.originY);
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
	    if (this.content.subLayers.length) {
	      if (direction === "right" || direction === "east") {
	        point.x = Utils.frameGetMaxX(this.content.contentFrame());
	      }
	      if (direction === "down" || direction === "bottom" || direction === "south") {
	        point.y = Utils.frameGetMaxY(this.content.contentFrame());
	      }
	    }
	    page.point = point;
	    if (page.superLayer !== this.content) {
	      return page.superLayer = this.content;
	    } else {
	      return this.updateContent();
	    }
	  };
	
	  PageComponent.prototype.setContentLayer = function(contentLayer) {
	    if (this.content) {
	      this._onAminateStop();
	      this.content.off(Events.AnimationStart, this._onAminationStart);
	      this.content.off(Events.AnimationStop, this._onAminationEnd);
	    }
	    PageComponent.__super__.setContentLayer.call(this, contentLayer);
	    this.content.on(Events.AnimationStart, this._onAminationStart);
	    return this.content.on(Events.AnimationStop, this._onAminationEnd);
	  };
	
	  PageComponent.prototype.horizontalPageIndex = function(page) {
	    return (_.sortBy(this.content.subLayers, function(l) {
	      return l.x;
	    })).indexOf(page);
	  };
	
	  PageComponent.prototype.verticalPageIndex = function(page) {
	    return (_.sortBy(this.content.subLayers, function(l) {
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
	
	  PageComponent.prototype._onAminationStart = function() {
	    this._isMoving = true;
	    this._isAnimating = true;
	    return this.content.on("change:frame", this._onAminationStep);
	  };
	
	  PageComponent.prototype._onAminationStep = function() {
	    return this.emit(Events.Move, this.content.point);
	  };
	
	  PageComponent.prototype._onAminationEnd = function() {
	    this._isMoving = false;
	    this._isAnimating = false;
	    return this.content.off("change:frame", this._onAminationStep);
	  };
	
	  PageComponent.prototype._scrollEnd = function() {
	    var end, nextPage, start, velocity, xDisabled, xLock, yDisabled, yLock;
	    velocity = this.content.draggable.velocity;
	    xDisabled = !this.scrollHorizontal && (this.direction === "right" || this.direction === "left");
	    yDisabled = !this.scrollVertical && (this.direction === "down" || this.direction === "up");
	    xLock = this.content.draggable._directionLockEnabledX && (this.direction === "right" || this.direction === "left");
	    yLock = this.content.draggable._directionLockEnabledY && (this.direction === "down" || this.direction === "up");
	    if (Math.max(Math.abs(velocity.x), Math.abs(velocity.y)) < this.velocityThreshold || xLock || yLock || xDisabled || yDisabled) {
	      start = this.content.draggable._layerStartPoint;
	      end = this.content.draggable.layer.point;
	      if (start.x !== end.x || start.y !== end.y) {
	        this.snapToPage(this.closestPage, true, this.animationOptions);
	      }
	      return;
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
/* 39 */
/*!**************************************************!*\
  !*** ./framer/Components/SliderComponent.coffee ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Events, Layer, Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(/*! ../Utils */ 4);
	
	Layer = __webpack_require__(/*! ../Layer */ 10).Layer;
	
	Events = __webpack_require__(/*! ../Events */ 22).Events;
	
	"SliderComponent\n\nknob <layer>\nknobSize <width, height>\nfill <layer>\nmin <number>\nmax <number>\n\npointForValue(<n>)\nvalueForPoint(<n>)\n\nanimateToValue(value, animationOptions={})";
	
	exports.SliderComponent = (function(superClass) {
	  extend(SliderComponent, superClass);
	
	  function SliderComponent(options) {
	    if (options == null) {
	      options = {};
	    }
	    this._updateValue = bind(this._updateValue, this);
	    this._setRadius = bind(this._setRadius, this);
	    this._updateFrame = bind(this._updateFrame, this);
	    this._updateKnob = bind(this._updateKnob, this);
	    this._updateFill = bind(this._updateFill, this);
	    this._touchDown = bind(this._touchDown, this);
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
	    this.knob = new Layer({
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
	    SliderComponent.__super__.constructor.call(this, options);
	    this.knobSize = options.knobSize || 30;
	    this.knob.superLayer = this.fill.superLayer = this;
	    if (this.width > this.height) {
	      this.fill.height = this.height;
	    } else {
	      this.fill.width = this.width;
	    }
	    this.fill.borderRadius = this.borderRadius;
	    this.knob.draggable.enabled = true;
	    this.knob.draggable.overdrag = false;
	    this.knob.draggable.momentum = true;
	    this.knob.draggable.momentumOptions = {
	      friction: 5,
	      tolerance: 0.25
	    };
	    this.knob.draggable.bounce = false;
	    this.knob.draggable.propagateEvents = false;
	    this.knob.borderRadius = "50%";
	    this._updateFrame();
	    this._updateKnob();
	    this._updateFill();
	    this.on("change:size", this._updateFrame);
	    this.on("change:borderRadius", this._setRadius);
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
	    this.on(Events.TouchStart, this._touchDown);
	  }
	
	  SliderComponent.prototype._touchDown = function(event) {
	    var offsetX, offsetY;
	    event.preventDefault();
	    event.stopPropagation();
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
	
	  SliderComponent.prototype._updateFill = function() {
	    if (this.width > this.height) {
	      return this.fill.width = this.knob.midX;
	    } else {
	      return this.fill.height = this.knob.midY;
	    }
	  };
	
	  SliderComponent.prototype._updateKnob = function() {
	    if (this.width > this.height) {
	      this.knob.midX = this.fill.width;
	      return this.knob.centerY();
	    } else {
	      this.knob.midY = this.fill.height;
	      return this.knob.centerX();
	    }
	  };
	
	  SliderComponent.prototype._updateFrame = function() {
	    this.knob.draggable.constraints = {
	      x: -this.knob.width / 2,
	      y: -this.knob.height / 2,
	      width: this.width + this.knob.width,
	      height: this.height + this.knob.height
	    };
	    if (this.width > this.height) {
	      this.fill.height = this.height;
	      return this.knob.centerY();
	    } else {
	      this.fill.width = this.width;
	      return this.knob.centerX();
	    }
	  };
	
	  SliderComponent.prototype._setRadius = function() {
	    var radius;
	    radius = this.borderRadius;
	    return this.fill.style.borderRadius = radius + "px 0 0 " + radius + "px";
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
	        return this._updateFill();
	      } else {
	        this.knob.midY = this.pointForValue(value);
	        return this._updateFill();
	      }
	    }
	  });
	
	  SliderComponent.prototype._updateValue = function() {
	    return this.emit("change:value", this.value);
	  };
	
	  SliderComponent.prototype.pointForValue = function(value) {
	    if (this.width > this.height) {
	      return Utils.modulate(value, [this.min, this.max], [0, this.width], true);
	    } else {
	      return Utils.modulate(value, [this.min, this.max], [0, this.height], true);
	    }
	  };
	
	  SliderComponent.prototype.valueForPoint = function(value) {
	    if (this.width > this.height) {
	      return Utils.modulate(value, [0, this.width], [this.min, this.max], true);
	    } else {
	      return Utils.modulate(value, [0, this.height], [this.min, this.max], true);
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
	
	  return SliderComponent;
	
	})(Layer);


/***/ },
/* 40 */
/*!**************************************************!*\
  !*** ./framer/Components/DeviceComponent.coffee ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	var AppleWatch38Device, AppleWatch42Device, BaseClass, Defaults, DeviceComponentDefaultDevice, Devices, Events, Layer, Nexus5BaseDevice, Nexus5BaseDeviceHand, Nexus9BaseDevice, Utils, _, iPadAirBaseDevice, iPadAirBaseDeviceHand, iPadMiniBaseDevice, iPadMiniBaseDeviceHand, iPhone5BaseDevice, iPhone5BaseDeviceHand, iPhone5CBaseDevice, iPhone5CBaseDeviceHand, iPhone6BaseDevice, iPhone6BaseDeviceHand, iPhone6PlusBaseDevice, iPhone6PlusBaseDeviceHand,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(/*! ../Utils */ 4);
	
	_ = __webpack_require__(/*! ../Underscore */ 1)._;
	
	DeviceComponentDefaultDevice = "iphone-6-silver";
	
	BaseClass = __webpack_require__(/*! ../BaseClass */ 6).BaseClass;
	
	Layer = __webpack_require__(/*! ../Layer */ 10).Layer;
	
	Defaults = __webpack_require__(/*! ../Defaults */ 12).Defaults;
	
	Events = __webpack_require__(/*! ../Events */ 22).Events;
	
	
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
	
	Device.keyboard bool
	Device.setKeyboard(visible:bool, animate:bool)
	Device.showKeyboard(animate:bool)
	Device.hideKeyboard(animate:bool)
	Device.toggleKeyboard(animate:bool)
	
	
	 * Events
	Events.DeviceTypeDidChange
	Events.DeviceFullScreenDidChange
	Events.DeviceKeyboardWillShow
	Events.DeviceKeyboardDidShow
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
	    this._animateKeyboard = bind(this._animateKeyboard, this);
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
	    this.phone = new Layer;
	    this.screen = new Layer({
	      superLayer: this.phone
	    });
	    this.viewport = new Layer({
	      superLayer: this.screen
	    });
	    this.content = new Layer({
	      superLayer: this.viewport
	    });
	    this.phone.backgroundColor = "transparent";
	    this.phone.classList.add("DevicePhone");
	    this.screen.backgroundColor = "transparent";
	    this.screen.classList.add("DeviceScreen");
	    this.viewport.backgroundColor = "transparent";
	    this.viewport.classList.add("DeviceComponentPort");
	    this.content.backgroundColor = "transparent";
	    this.content.classList.add("DeviceContent");
	    this.content.originX = 0;
	    this.content.originY = 0;
	    this.keyboardLayer = new Layer({
	      superLayer: this.viewport
	    });
	    this.keyboardLayer.on("click", (function(_this) {
	      return function() {
	        return _this.toggleKeyboard();
	      };
	    })(this));
	    this.keyboardLayer.classList.add("DeviceKeyboard");
	    this.keyboardLayer.backgroundColor = "transparent";
	    Framer.CurrentContext.eventManager.wrap(window).addEventListener("resize", this._update);
	    ref = [this.background, this.phone, this.viewport, this.content, this.screen];
	    for (i = 0, len = ref.length; i < len; i++) {
	      layer = ref[i];
	      layer.on("touchmove", function(event) {
	        return event.preventDefault();
	      });
	    }
	    return this._context = new Framer.Context({
	      parentLayer: this.content,
	      name: "Device"
	    });
	  };
	
	  DeviceComponent.prototype._update = function() {
	    var backgroundOverlap, contentScaleFactor, height, i, layer, len, ref, ref1, width;
	    contentScaleFactor = this.contentScale;
	    if (contentScaleFactor > 1) {
	      contentScaleFactor = 1;
	    }
	    if (this._shouldRenderFullScreen()) {
	      ref = [this.background, this.phone, this.viewport, this.content, this.screen];
	      for (i = 0, len = ref.length; i < len; i++) {
	        layer = ref[i];
	        layer.x = layer.y = 0;
	        layer.width = window.innerWidth / contentScaleFactor;
	        layer.height = window.innerHeight / contentScaleFactor;
	        layer.scale = 1;
	      }
	      this.content.scale = contentScaleFactor;
	      return this._positionKeyboard();
	    } else {
	      backgroundOverlap = 100;
	      this.background.x = 0 - backgroundOverlap;
	      this.background.y = 0 - backgroundOverlap;
	      this.background.width = window.innerWidth + (2 * backgroundOverlap);
	      this.background.height = window.innerHeight + (2 * backgroundOverlap);
	      this.phone.scale = this._calculatePhoneScale();
	      this.phone.center();
	      ref1 = this._getOrientationDimensions(this._device.screenWidth / contentScaleFactor, this._device.screenHeight / contentScaleFactor), width = ref1[0], height = ref1[1];
	      this.screen.width = this._device.screenWidth;
	      this.screen.height = this._device.screenHeight;
	      this.viewport.width = this.content.width = width;
	      this.viewport.height = this.content.height = height;
	      return this.screen.center();
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
	    } else {
	      this._updateDeviceImage();
	    }
	    this._update();
	    this.keyboard = false;
	    this._positionKeyboard();
	    return this.emit("change:fullScreen");
	  };
	
	  DeviceComponent.define("deviceType", {
	    get: function() {
	      return this._deviceType;
	    },
	    set: function(deviceType) {
	      var device, shouldZoomToFit;
	      if (deviceType === this._deviceType) {
	        return;
	      }
	      device = null;
	      if (_.isString(deviceType)) {
	        device = Devices[deviceType.toLowerCase()];
	      }
	      if (!device) {
	        throw Error("No device named " + deviceType + ". Options are: " + (_.keys(Devices)));
	      }
	      if (this._device === device) {
	        return;
	      }
	      shouldZoomToFit = this._deviceType === "fullscreen";
	      this._device = _.clone(device);
	      this._deviceType = deviceType;
	      this.fullscreen = false;
	      this._updateDeviceImage();
	      this._update();
	      this.keyboard = false;
	      this._positionKeyboard();
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
	      return this.phone.image = "";
	    } else if (!this._deviceImageUrl(this._deviceImageName())) {
	      return this.phone.image = "";
	    } else {
	      this.phone._alwaysUseImageCache = true;
	      this.phone.image = this._deviceImageUrl(this._deviceImageName());
	      this.phone.width = this._device.deviceImageWidth;
	      return this.phone.height = this._device.deviceImageHeight;
	    }
	  };
	
	  DeviceComponent.prototype._deviceImageName = function() {
	    if (this._device.hasOwnProperty("deviceImage")) {
	      return this._device.deviceImage;
	    }
	    return this._deviceType + ".png";
	  };
	
	  DeviceComponent.prototype._deviceImageUrl = function(name) {
	    var resourceUrl;
	    if (!name) {
	      return null;
	    }
	    if (_.startsWith(name, "http://") || _.startsWith(name, "https://")) {
	      return name;
	    }
	    if (Utils.isFramerStudio() && window.FramerStudioInfo) {
	      resourceUrl = window.FramerStudioInfo.deviceImagesUrl;
	    } else {
	      resourceUrl = "//resources.framerjs.com/static/DeviceResources";
	    }
	    if (Utils.isJP2Supported() && this._device.deviceImageJP2 !== false) {
	      return resourceUrl + "/" + (name.replace(".png", ".jp2"));
	    } else {
	      return resourceUrl + "/" + name;
	    }
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
	    this.phone.animateStop();
	    if (animate) {
	      this.phone.animate(_.extend(this.animationOptions, {
	        properties: {
	          scale: phoneScale
	        }
	      }));
	    } else {
	      this.phone.scale = phoneScale;
	      this.phone.center();
	    }
	    return this.emit("change:deviceScale");
	  };
	
	  DeviceComponent.prototype._calculatePhoneScale = function() {
	    var height, paddingOffset, phoneScale, ref, ref1, width;
	    if (this._deviceScale && this._deviceScale !== "fit") {
	      return this._deviceScale;
	    }
	    ref = this._getOrientationDimensions(this.phone.width, this.phone.height), width = ref[0], height = ref[1];
	    paddingOffset = ((ref1 = this._device) != null ? ref1.paddingOffset : void 0) || 0;
	    phoneScale = _.min([(window.innerWidth - ((this.padding + paddingOffset) * 2)) / width, (window.innerHeight - ((this.padding + paddingOffset) * 2)) / height]);
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
	      return this._orientation || 0;
	    },
	    set: function(orientation) {
	      return this.setOrientation(orientation, false);
	    }
	  });
	
	  DeviceComponent.prototype.setOrientation = function(orientation, animate) {
	    var _hadKeyboard, animation, contentProperties, height, phoneProperties, ref, ref1, width, x, y;
	    if (animate == null) {
	      animate = false;
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
	      rotationZ: this._orientation,
	      scale: this._calculatePhoneScale()
	    };
	    ref = this._getOrientationDimensions(this._device.screenWidth, this._device.screenHeight), width = ref[0], height = ref[1];
	    ref1 = [(this.screen.width - width) / 2, (this.screen.height - height) / 2], x = ref1[0], y = ref1[1];
	    contentProperties = {
	      rotationZ: -this._orientation,
	      width: width,
	      height: height,
	      x: x,
	      y: y
	    };
	    _hadKeyboard = this.keyboard;
	    if (_hadKeyboard) {
	      this.hideKeyboard(false);
	    }
	    this.phone.animateStop();
	    this.viewport.animateStop();
	    if (animate) {
	      animation = this.phone.animate(_.extend(this.animationOptions, {
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
	      if (_hadKeyboard) {
	        animation.on(Events.AnimationEnd, (function(_this) {
	          return function() {
	            return _this.showKeyboard(true);
	          };
	        })(this));
	      }
	    } else {
	      this.phone.props = phoneProperties;
	      this.viewport.props = contentProperties;
	      this._update();
	      if (_hadKeyboard) {
	        this.showKeyboard(true);
	      }
	    }
	    this._renderKeyboard();
	    return this.emit("change:orientation");
	  };
	
	  DeviceComponent.prototype.isPortrait = function() {
	    return Math.abs(this._orientation) !== 90;
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
	
	  DeviceComponent.define("keyboard", {
	    get: function() {
	      return this._keyboard;
	    },
	    set: function(keyboard) {
	      return this.setKeyboard(keyboard, false);
	    }
	  });
	
	  DeviceComponent.prototype.setKeyboard = function(keyboard, animate) {
	    var ref, ref1;
	    if (animate == null) {
	      animate = false;
	    }
	    if (!this._device.hasOwnProperty("keyboards")) {
	      return;
	    }
	    if (_.isString(keyboard)) {
	      if ((ref = keyboard.toLowerCase()) === "1" || ref === "true") {
	        keyboard = true;
	      } else if ((ref1 = keyboard.toLowerCase()) === "0" || ref1 === "false") {
	        keyboard = false;
	      } else {
	        return;
	      }
	    }
	    if (!_.isBoolean(keyboard)) {
	      return;
	    }
	    if (keyboard === this._keyboard) {
	      return;
	    }
	    this._keyboard = keyboard;
	    this.emit("change:keyboard");
	    if (keyboard === true) {
	      this.emit("keyboard:show:start");
	      return this._animateKeyboard(this._keyboardShowY(), animate, (function(_this) {
	        return function() {
	          return _this.emit("keyboard:show:end");
	        };
	      })(this));
	    } else {
	      this.emit("keyboard:hide:start");
	      return this._animateKeyboard(this._keyboardHideY(), animate, (function(_this) {
	        return function() {
	          return _this.emit("keyboard:hide:end");
	        };
	      })(this));
	    }
	  };
	
	  DeviceComponent.prototype.showKeyboard = function(animate) {
	    if (animate == null) {
	      animate = true;
	    }
	    return this.setKeyboard(true, animate);
	  };
	
	  DeviceComponent.prototype.hideKeyboard = function(animate) {
	    if (animate == null) {
	      animate = true;
	    }
	    return this.setKeyboard(false, animate);
	  };
	
	  DeviceComponent.prototype.toggleKeyboard = function(animate) {
	    if (animate == null) {
	      animate = true;
	    }
	    return this.setKeyboard(!this.keyboard, animate);
	  };
	
	  DeviceComponent.prototype._renderKeyboard = function() {
	    if (!this._device.keyboards) {
	      return;
	    }
	    this.keyboardLayer.image = this._deviceImageUrl(this._device.keyboards[this.orientationName].image);
	    this.keyboardLayer.width = this._device.keyboards[this.orientationName].width;
	    return this.keyboardLayer.height = this._device.keyboards[this.orientationName].height;
	  };
	
	  DeviceComponent.prototype._positionKeyboard = function() {
	    this.keyboardLayer.centerX();
	    if (this.keyboard) {
	      return this._animateKeyboard(this._keyboardShowY(), false);
	    } else {
	      return this._animateKeyboard(this._keyboardHideY(), false);
	    }
	  };
	
	  DeviceComponent.prototype._animateKeyboard = function(y, animate, callback) {
	    var animation;
	    this.keyboardLayer.bringToFront();
	    this.keyboardLayer.animateStop();
	    if (animate === false) {
	      this.keyboardLayer.y = y;
	      return typeof callback === "function" ? callback() : void 0;
	    } else {
	      animation = this.keyboardLayer.animate(_.extend(this.animationOptions, {
	        properties: {
	          y: y
	        }
	      }));
	      return animation.on(Events.AnimationEnd, callback);
	    }
	  };
	
	  DeviceComponent.prototype._keyboardShowY = function() {
	    return this.viewport.height - this.keyboardLayer.height;
	  };
	
	  DeviceComponent.prototype._keyboardHideY = function() {
	    return this.viewport.height;
	  };
	
	  return DeviceComponent;
	
	})(BaseClass);
	
	iPhone6BaseDevice = {
	  deviceImageWidth: 870,
	  deviceImageHeight: 1738,
	  deviceImageJP2: true,
	  screenWidth: 750,
	  screenHeight: 1334,
	  deviceType: "phone"
	};
	
	iPhone6BaseDeviceHand = _.extend({}, iPhone6BaseDevice, {
	  deviceImageWidth: 1988,
	  deviceImageHeight: 2368,
	  deviceImageJP2: true,
	  paddingOffset: -150
	});
	
	iPhone6PlusBaseDevice = {
	  deviceImageWidth: 1460,
	  deviceImageHeight: 2900,
	  deviceImageJP2: true,
	  screenWidth: 1242,
	  screenHeight: 2208,
	  deviceType: "phone"
	};
	
	iPhone6PlusBaseDeviceHand = _.extend({}, iPhone6PlusBaseDevice, {
	  deviceImageWidth: 3128,
	  deviceImageHeight: 3487,
	  deviceImageJP2: true,
	  paddingOffset: -150
	});
	
	iPhone5BaseDevice = {
	  deviceImageWidth: 780,
	  deviceImageHeight: 1608,
	  deviceImageJP2: true,
	  screenWidth: 640,
	  screenHeight: 1136,
	  deviceType: "phone"
	};
	
	iPhone5BaseDeviceHand = _.extend({}, iPhone5BaseDevice, {
	  deviceImageWidth: 1884,
	  deviceImageHeight: 2234,
	  deviceImageJP2: true,
	  paddingOffset: -200
	});
	
	iPhone5CBaseDevice = {
	  deviceImageWidth: 776,
	  deviceImageHeight: 1612,
	  deviceImageJP2: true,
	  screenWidth: 640,
	  screenHeight: 1136,
	  deviceType: "phone"
	};
	
	iPhone5CBaseDeviceHand = _.extend({}, iPhone5CBaseDevice, {
	  deviceImageWidth: 1894,
	  deviceImageHeight: 2244,
	  deviceImageJP2: true,
	  paddingOffset: -200
	});
	
	iPadMiniBaseDevice = {
	  deviceImageWidth: 872,
	  deviceImageHeight: 1292,
	  deviceImageJP2: true,
	  screenWidth: 768,
	  screenHeight: 1024,
	  deviceType: "tablet"
	};
	
	iPadMiniBaseDeviceHand = _.extend({}, iPadMiniBaseDevice, {
	  deviceImageWidth: 1380,
	  deviceImageHeight: 2072,
	  deviceImageJP2: true,
	  paddingOffset: -120
	});
	
	iPadAirBaseDevice = {
	  deviceImageWidth: 1769,
	  deviceImageHeight: 2509,
	  deviceImageJP2: true,
	  screenWidth: 1536,
	  screenHeight: 2048,
	  deviceType: "tablet"
	};
	
	iPadAirBaseDeviceHand = _.extend({}, iPadAirBaseDevice, {
	  deviceImageWidth: 4744,
	  deviceImageHeight: 4101,
	  deviceImageJP2: true,
	  paddingOffset: -120
	});
	
	Nexus5BaseDevice = {
	  deviceImageWidth: 1208,
	  deviceImageHeight: 2440,
	  deviceImageJP2: true,
	  screenWidth: 1080,
	  screenHeight: 1920,
	  deviceType: "phone"
	};
	
	Nexus5BaseDeviceHand = _.extend({}, Nexus5BaseDevice, {
	  deviceImageWidth: 2692,
	  deviceImageHeight: 2996,
	  deviceImageJP2: true,
	  paddingOffset: -120
	});
	
	Nexus9BaseDevice = {
	  deviceImageWidth: 1733,
	  deviceImageHeight: 2575,
	  deviceImageJP2: true,
	  screenWidth: 1536,
	  screenHeight: 2048,
	  deviceType: "tablet"
	};
	
	AppleWatch42Device = {
	  deviceImageWidth: 552,
	  deviceImageHeight: 938,
	  deviceImageJP2: true,
	  screenWidth: 312,
	  screenHeight: 390
	};
	
	AppleWatch38Device = {
	  deviceImageWidth: 508,
	  deviceImageHeight: 900,
	  deviceImageJP2: true,
	  screenWidth: 272,
	  screenHeight: 340
	};
	
	Devices = {
	  "fullscreen": {
	    name: "Fullscreen",
	    deviceType: "desktop"
	  },
	  "desktop-safari-1024-600": {
	    deviceType: "browser",
	    name: "Desktop Safari 1024 x 600",
	    screenWidth: 1024,
	    screenHeight: 600,
	    deviceImageWidth: 1136,
	    deviceImageHeight: 760,
	    deviceImageJP2: true
	  },
	  "desktop-safari-1280-800": {
	    deviceType: "browser",
	    name: "Desktop Safari 1280 x 800",
	    screenWidth: 1280,
	    screenHeight: 800,
	    deviceImageWidth: 1392,
	    deviceImageHeight: 960,
	    deviceImageJP2: true
	  },
	  "desktop-safari-1440-900": {
	    deviceType: "browser",
	    name: "Desktop Safari 1440 x 900",
	    screenWidth: 1440,
	    screenHeight: 900,
	    deviceImageWidth: 1552,
	    deviceImageHeight: 1060,
	    deviceImageJP2: true
	  },
	  "iphone-6-spacegray": _.clone(iPhone6BaseDevice),
	  "iphone-6-spacegray-hand": _.clone(iPhone6BaseDeviceHand),
	  "iphone-6-silver": _.clone(iPhone6BaseDevice),
	  "iphone-6-silver-hand": _.clone(iPhone6BaseDeviceHand),
	  "iphone-6-gold": _.clone(iPhone6BaseDevice),
	  "iphone-6-gold-hand": _.clone(iPhone6BaseDeviceHand),
	  "iphone-6plus-spacegray": _.clone(iPhone6PlusBaseDevice),
	  "iphone-6plus-spacegray-hand": _.clone(iPhone6PlusBaseDeviceHand),
	  "iphone-6plus-silver": _.clone(iPhone6PlusBaseDevice),
	  "iphone-6plus-silver-hand": _.clone(iPhone6PlusBaseDeviceHand),
	  "iphone-6plus-gold": _.clone(iPhone6PlusBaseDevice),
	  "iphone-6plus-gold-hand": _.clone(iPhone6PlusBaseDeviceHand),
	  "iphone-5s-spacegray": _.clone(iPhone5BaseDevice),
	  "iphone-5s-spacegray-hand": _.clone(iPhone5BaseDeviceHand),
	  "iphone-5s-silver": _.clone(iPhone5BaseDevice),
	  "iphone-5s-silver-hand": _.clone(iPhone5BaseDeviceHand),
	  "iphone-5s-gold": _.clone(iPhone5BaseDevice),
	  "iphone-5s-gold-hand": _.clone(iPhone5BaseDeviceHand),
	  "iphone-5c-green": _.clone(iPhone5CBaseDevice),
	  "iphone-5c-green-hand": _.clone(iPhone5CBaseDeviceHand),
	  "iphone-5c-blue": _.clone(iPhone5CBaseDevice),
	  "iphone-5c-blue-hand": _.clone(iPhone5CBaseDeviceHand),
	  "iphone-5c-pink": _.clone(iPhone5CBaseDevice),
	  "iphone-5c-pink-hand": _.clone(iPhone5CBaseDeviceHand),
	  "iphone-5c-white": _.clone(iPhone5CBaseDevice),
	  "iphone-5c-white-hand": _.clone(iPhone5CBaseDeviceHand),
	  "iphone-5c-yellow": _.clone(iPhone5CBaseDevice),
	  "iphone-5c-yellow-hand": _.clone(iPhone5CBaseDeviceHand),
	  "ipad-mini-spacegray": _.clone(iPadMiniBaseDevice),
	  "ipad-mini-spacegray-hand": _.clone(iPadMiniBaseDeviceHand),
	  "ipad-mini-silver": _.clone(iPadMiniBaseDevice),
	  "ipad-mini-silver-hand": _.clone(iPadMiniBaseDeviceHand),
	  "ipad-air-spacegray": _.clone(iPadAirBaseDevice),
	  "ipad-air-spacegray-hand": _.clone(iPadAirBaseDeviceHand),
	  "ipad-air-silver": _.clone(iPadAirBaseDevice),
	  "ipad-air-silver-hand": _.clone(iPadAirBaseDeviceHand),
	  "nexus-5-black": _.clone(Nexus5BaseDevice),
	  "nexus-5-black-hand": _.clone(Nexus5BaseDeviceHand),
	  "nexus-9": _.clone(Nexus9BaseDevice),
	  "applewatchsport-38-aluminum-sportband-black": _.clone(AppleWatch38Device),
	  "applewatchsport-38-aluminum-sportband-blue": _.clone(AppleWatch38Device),
	  "applewatchsport-38-aluminum-sportband-green": _.clone(AppleWatch38Device),
	  "applewatchsport-38-aluminum-sportband-pink": _.clone(AppleWatch38Device),
	  "applewatchsport-38-aluminum-sportband-white": _.clone(AppleWatch38Device),
	  "applewatch-38-black-bracelet": _.clone(AppleWatch38Device),
	  "applewatch-38-steel-bracelet": _.clone(AppleWatch38Device),
	  "applewatchedition-38-gold-buckle-blue": _.clone(AppleWatch38Device),
	  "applewatchedition-38-gold-buckle-gray": _.clone(AppleWatch38Device),
	  "applewatchedition-38-gold-buckle-red": _.clone(AppleWatch38Device),
	  "applewatchedition-38-gold-sportband-black": _.clone(AppleWatch38Device),
	  "applewatchedition-38-gold-sportband-white": _.clone(AppleWatch38Device),
	  "applewatchsport-42-aluminum-sportband-black": _.clone(AppleWatch42Device),
	  "applewatchsport-42-aluminum-sportband-blue": _.clone(AppleWatch42Device),
	  "applewatchsport-42-aluminum-sportband-green": _.clone(AppleWatch42Device),
	  "applewatchsport-42-aluminum-sportband-pink": _.clone(AppleWatch42Device),
	  "applewatchsport-42-aluminum-sportband-white": _.clone(AppleWatch42Device),
	  "applewatch-42-black-bracelet": _.clone(AppleWatch42Device),
	  "applewatch-42-steel-bracelet": _.clone(AppleWatch42Device),
	  "applewatchedition-42-gold-buckle-blue": _.clone(AppleWatch42Device),
	  "applewatchedition-42-gold-buckle-gray": _.clone(AppleWatch42Device),
	  "applewatchedition-42-gold-buckle-red": _.clone(AppleWatch42Device),
	  "applewatchedition-42-gold-sportband-black": _.clone(AppleWatch42Device),
	  "applewatchedition-42-gold-sportband-white": _.clone(AppleWatch42Device)
	};
	
	exports.DeviceComponent.Devices = Devices;


/***/ },
/* 41 */
/*!*************************************!*\
  !*** ./framer/AnimationLoop.coffee ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var Config, EventEmitter, Utils, _, getTime,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	Config = __webpack_require__(/*! ./Config */ 11).Config;
	
	EventEmitter = __webpack_require__(/*! ./EventEmitter */ 7).EventEmitter;
	
	getTime = function() {
	  return Utils.getTime() * 1000;
	};
	
	exports.AnimationLoop = (function(superClass) {
	  extend(AnimationLoop, superClass);
	
	  function AnimationLoop() {
	    this.start = bind(this.start, this);
	    this.delta = 1 / 60;
	    this.raf = true;
	    if (Utils.webkitVersion() > 600 && Utils.isDesktop()) {
	      this.raf = false;
	    }
	    if (Utils.webkitVersion() > 600 && Utils.isFramerStudio()) {
	      this.raf = false;
	    }
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
/* 42 */
/*!********************************!*\
  !*** ./framer/Importer.coffee ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	var ChromeAlert, Utils, _,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	_ = __webpack_require__(/*! ./Underscore */ 1)._;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	ChromeAlert = "Importing layers is currently only supported on Safari. If you really want it to work with Chrome quit it, open a terminal and run:\nopen -a Google\ Chrome -–allow-file-access-from-files";
	
	exports.Importer = (function() {
	  function Importer(path1, extraLayerProperties) {
	    this.path = path1;
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
	    ref1 = this._createdLayers;
	    for (j = 0, len1 = ref1.length; j < len1; j++) {
	      layer = ref1[j];
	      if (!layer.superLayer) {
	        layer.superLayer = null;
	      }
	    }
	    return this._createdLayersByName;
	  };
	
	  Importer.prototype._loadlayerInfo = function() {
	    var importedKey, ref;
	    importedKey = this.paths.documentName + "/layers.json.js";
	    if ((ref = window.__imported__) != null ? ref.hasOwnProperty(importedKey) : void 0) {
	      return window.__imported__[importedKey];
	    }
	    return Framer.Utils.domLoadJSONSync(this.paths.layerInfo);
	  };
	
	  Importer.prototype._createLayer = function(info, superLayer) {
	    var LayerClass, layer, layerInfo, ref;
	    LayerClass = Layer;
	    layerInfo = {
	      shadow: true,
	      name: info.name,
	      frame: info.layerFrame,
	      clip: false,
	      backgroundColor: null,
	      visible: (ref = info.visible) != null ? ref : true
	    };
	    _.extend(layerInfo, this.extraLayerProperties);
	    if (info.image) {
	      layerInfo.frame = info.image.frame;
	      layerInfo.image = Utils.pathJoin(this.path, info.image.path);
	    }
	    if (info.maskFrame) {
	      layerInfo.frame = info.maskFrame;
	      layerInfo.clip = true;
	    }
	    if (info.children.length === 0 && indexOf.call(_.pluck(superLayer != null ? superLayer.superLayers() : void 0, "clip"), true) >= 0) {
	      layerInfo.frame = info.image.frame;
	      layerInfo.clip = false;
	    }
	    if (superLayer != null ? superLayer.contentLayer : void 0) {
	      layerInfo.superLayer = superLayer.contentLayer;
	    } else if (superLayer) {
	      layerInfo.superLayer = superLayer;
	    }
	    layer = new LayerClass(layerInfo);
	    layer.name = layerInfo.name;
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
	    if (!layer.image && !info.maskFrame) {
	      layer.frame = layer.contentFrame();
	    }
	    layer._info = info;
	    this._createdLayers.push(layer);
	    return this._createdLayersByName[layer.name] = layer;
	  };
	
	  Importer.prototype._correctLayer = function(layer) {
	    var traverse;
	    traverse = function(layer) {
	      var i, len, ref, results, subLayer;
	      if (layer.superLayer) {
	        layer.frame = Utils.convertPoint(layer.frame, null, layer.superLayer);
	      }
	      ref = layer.subLayers;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        subLayer = ref[i];
	        results.push(traverse(subLayer));
	      }
	      return results;
	    };
	    if (!layer.superLayer) {
	      return traverse(layer);
	    }
	  };
	
	  return Importer;
	
	})();
	
	exports.Importer.load = function(path) {
	  var importer;
	  importer = new exports.Importer(path);
	  return importer.load();
	};


/***/ },
/* 43 */
/*!*****************************!*\
  !*** ./framer/Debug.coffee ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var Context, Utils, _errorContext, _errorShown, errorWarning;
	
	Utils = __webpack_require__(/*! ./Utils */ 4);
	
	Context = __webpack_require__(/*! ./Context */ 35).Context;
	
	_errorContext = null;
	
	_errorShown = false;
	
	errorWarning = function(event) {
	  var _errorWarningLayer, layer;
	  if (!_errorContext) {
	    _errorContext = new Context({
	      name: "Error"
	    });
	  }
	  if (_errorShown) {
	    return;
	  }
	  _errorShown = true;
	  layer = new Layer({
	    x: 20,
	    y: -50,
	    width: 300,
	    height: 40
	  });
	  layer.states.add({
	    visible: {
	      x: 20,
	      y: 20,
	      width: 300,
	      height: 40
	    }
	  });
	  layer.html = "Javascript Error, see the console";
	  layer.style = {
	    font: "12px/1.35em Menlo",
	    color: "white",
	    textAlign: "center",
	    lineHeight: layer.height + "px",
	    borderRadius: "5px",
	    backgroundColor: "rgba(255,0,0,.8)"
	  };
	  layer.states.animationOptions = {
	    curve: "spring",
	    curveOptions: {
	      tension: 1000,
	      friction: 30
	    }
	  };
	  layer.states["switch"]("visible");
	  layer.on(Events.Click, function() {
	    return this.states["switch"]("default");
	  });
	  return _errorWarningLayer = layer;
	};
	
	window.error = errorWarning;


/***/ },
/* 44 */
/*!*************************************!*\
  !*** ./framer/Extras/Extras.coffee ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	exports.MobileScrollFix = __webpack_require__(/*! ./MobileScrollFix */ 45);
	
	exports.OmitNew = __webpack_require__(/*! ./OmitNew */ 46);


/***/ },
/* 45 */
/*!**********************************************!*\
  !*** ./framer/Extras/MobileScrollFix.coffee ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	var Utils,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Utils = __webpack_require__(/*! ../Utils */ 4);
	
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
/* 46 */
/*!**************************************!*\
  !*** ./framer/Extras/OmitNew.coffee ***!
  \**************************************/
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


/***/ }
/******/ ]);
//# sourceMappingURL=framer.debug.js.map