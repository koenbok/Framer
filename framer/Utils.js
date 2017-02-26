import { _ } from "./Underscore";
import { Screen } from "./Screen";
import { Matrix } from "./Matrix";

let Utils = {};

Utils.reset = () => Framer.CurrentContext.reset();

Utils.getValue = function(value) {
	if (_.isFunction(value)) { return value(); }
	return value;
};

Utils.getValueForKeyPath = function(obj, key) {
	let result = obj;
	if (Array.from(key).includes(!".")) { return obj[key]; }
	for (key of Array.from(key.split("."))) {
		result = result[key];
	}
	return result;
};

Utils.setValueForKeyPath = function(obj, path, val) {
	let fields = path.split(".");
	let result = obj;
	let i = 0;
	let n = fields.length;
	while ((i < n) && (result !== undefined)) {
		let field = fields[i];
		if (i === (n - 1)) {
			result[field] = val;
		} else {
			if ((typeof result[field] === "undefined") || !_.isObject(result[field])) {
				result[field] = {};
			}
			result = result[field];
		}
		i++;
	}
};

Utils.valueOrDefault = function(value, defaultValue) {

	if ([undefined, null].includes(value)) {
		value = defaultValue;
	}

	return value;
};

Utils.arrayNext = (arr, item) => arr[arr.indexOf(item) + 1] || _.head(arr);

Utils.arrayPrev = (arr, item) => arr[arr.indexOf(item) - 1] || _.last(arr);


//#####################################################
// MATH

Utils.sum = arr => _.reduce(arr, (a, b) => a + b);
Utils.average = arr => Utils.sum(arr) / arr.length;
Utils.mean = Utils.average;
Utils.median = function(x) {
	if (x.length === 0) { return null; }

	let sorted = x.slice().sort((a, b) => a - b);

	if ((sorted.length % 2) === 1) {
		return sorted[(sorted.length - 1) / 2];
	} else {
		return (sorted[(sorted.length / 2) - 1] + sorted[sorted.length / 2]) / 2;
	}
};

Utils.nearestIncrement = function(x, increment) {
	if (!increment) { return x; }
	return Math.round(x * (1 / increment)) / (1 / increment);
};

//#####################################################
// ANIMATION

// This is a little hacky, but I want to avoid wrapping the function
// in another one as it gets called at 60 fps. So we make it a global.
if (window.requestAnimationFrame == null) { window.requestAnimationFrame = window.webkitRequestAnimationFrame; }
if (window.requestAnimationFrame == null) { window.requestAnimationFrame = f => Utils.delay(1/60, f); }

//#####################################################
// TIME FUNCTIONS

// Note: in Framer 3 we try to keep all times in seconds

// Used by animation engine, needs to be very performant
if (window.performance) {
	Utils.getTime = () => window.performance.now() / 1000;
} else {
	Utils.getTime = () => Date.now() / 1000;
}

Utils.delay = function(time, f) {
	let timer = setTimeout(f, time * 1000);
	Framer.CurrentContext.addTimer(timer);
	return timer;
};

Utils.interval = function(time, f) {
	let timer = setInterval(f, time * 1000);
	Framer.CurrentContext.addInterval(timer);
	return timer;
};

Utils.debounce = function(threshold, fn, immediate) {
	if (threshold == null) { threshold = 0.1; }
	let timeout = null;
	threshold *= 1000;
	return function(...args) {
		let obj = this;
		let delayed = function() {
			if (!immediate) { fn.apply(obj, args); }
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
	if (delay === 0) { return fn; }
	delay *= 1000;
	let timer = false;
	return function() {
		if (timer) { return; }
		timer = true;
		if (delay !== -1) { setTimeout((() => timer = false), delay); }
		return fn(...arguments);
	};
};

// Taken from http://addyosmani.com/blog/faster-javascript-memoization/
Utils.memoize = fn => function() {
	let args = Array.prototype.slice.call(arguments);
	let hash = "";
	let i = args.length;
	let currentArg = null;
	while (i--) {
		currentArg = args[i];
		hash += ((currentArg === Object(currentArg)) ? JSON.stringify(currentArg) : currentArg);
		fn.memoize || (fn.memoize = {});
	}
	((hash in fn.memoize) ? fn.memoize[hash] : fn.memoize[hash] = fn.apply(this, args));
} ;


//#####################################################
// HANDY FUNCTIONS

Utils.randomColor = function(alpha) {
	if (alpha == null) { alpha = 1.0; }
	return Color.random(alpha);
};

Utils.randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];

Utils.randomNumber = function(a, b) {
	// Return a random number between a and b
	if (a == null) { a = 0; }
	if (b == null) { b = 1; }
	return Utils.mapRange(Math.random(), 0, 1, a, b);
};

Utils.randomImage = function(layer, offset) {

	if (offset == null) { offset = 50; }
	if (_.isNumber(layer)) {
		layer = {id: layer};
	}

	let photos = ["1417733403748-83bbc7c05140", "1423841265803-dfac59ebf718", "1433689056001-018e493576bc", "1430812411929-de4cf1d1fe73", "1457269449834-928af64c684d", "1443616839562-036bb2afd9a2", "1461535676131-2de1f7054d3f", "1462393582935-1ac76b85dcf1", "1414589530802-cb54ce0575d9", "1422908132590-117a051fc5cd", "1438522014717-d7ce32b9bab9", "1451650804883-52fb86cc5b18", "1462058164249-2dcdcda67ce7", "1456757014009-0614a080ff7f", "1434238255348-4fb0d9caa0a4", "1448071792026-7064a01897e7", "1458681842652-019f4eeda5e5", "1460919920543-d8c45f4bd621", "1447767961238-038617b84a2b", "1449089299624-89ce41e8306c", "1414777410116-81e404502b52", "1433994349623-0a18966ee9c0", "1452567772283-91d67178f409", "1458245229726-a8ba04cb5969", "1422246719650-cb30d19825e3", "1417392639864-2c88dd07f460", "1442328166075-47fe7153c128", "1448467258552-6b3982373a13", "1447023362548-250f3a7b80ed", "1451486242265-24b0c0ef9a51", "1414339372428-797ec111646d"];
	let photo = Utils.randomChoice(photos);
	if (layer != null ? layer.id : undefined) { photo = photos[(layer.id) % photos.length]; }

	let increment = 100;
	let size = 1024;

	if (layer) {
		size = Math.max(layer.width, layer.height);
		size = Math.ceil(size / increment) * increment;
		if (size < increment) { size = increment; }
		size = Utils.devicePixelRatio() * size;
		size = parseInt(size);
	}

	// width = Utils.round(layer.width, 0, 100, 100)
	// height = Utils.round(layer.height, 0, 100, 100)

	return `https://images.unsplash.com/photo-${photo}?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=${size}&h=${size}&fit=max`;
};

Utils.defineEnum = function(names, offset, geometric) {
	// TODO: What is this doing here?
	if (names == null) { names = []; }
	if (offset == null) { offset = 0; }
	if (geometric == null) { geometric = 0; }
	let Enum = {};
	for (let i = 0; i < names.length; i++) {
		let name = names[i];
		let j = i;
		j = !offset    ? j : j + offset;
		j = !geometric ? j : Math.pow(geometric, j);
		Enum[Enum[name] = j] = name;
	}
	return Enum;
};

Utils.labelLayer = function(layer, text, style) {

	if (style == null) { style = {}; }
	if (!text) { return; }
	if (text === "") { return; }
	if (typeof(text) !== "string") { return; }

	let fontSize = Math.max(Math.min(48, parseInt(layer.height / 3.2)), 14);

	style = _.extend({
		font: `${fontSize}px/1em ${Utils.deviceFont()}`,
		lineHeight: `${layer.height}px`,
		textAlign: "center",
		color: "#fff"
	}, style);

	layer.style = style;
	return layer.html = text;
};

Utils.stringify = function(obj) {
	try {
		if (_.isObject(obj)) { return JSON.stringify(obj); }
	} catch (error) {
		"";
	}
	if (obj === null) { return "null"; }
	if (obj === undefined) { return "undefined"; }
	if (obj.toString) { return obj.toString(); }
	return obj;
};

Utils.inspectObjectType = function(item) {
	// This is a hacky way to get nice object names, it tries to
	// parse them from the .toString methods for objects.

	let className;
	if (((item.constructor != null ? item.constructor.name : undefined) != null) && ((item.constructor != null ? item.constructor.name : undefined) !== "Object")) {
		return item.constructor.name;
	}

	let extract = function(str) {
		if (!str) { return null; }
		let regex = /\[object (\w+)\]/;
		let match = regex.exec(str);
		if (match) { return match[1]; }
		return null;
	};

	if (item.toString) {
		className = extract(item.toString());
		if (className) { return className; }
	}

	if (item.constructor != null ? item.constructor.toString : undefined) {
		className = extract(item.constructor != null ? item.constructor.toString() : undefined);
		if (className) { return className.replace("Constructor", ""); }
	}

	return "Object";
};

Utils.inspect = function(item, max, l) {

	if (max == null) { max = 5; }
	if (l == null) { l = 0; }
	if (item === null) { return "null"; }
	if (item === undefined) { return "undefined"; }

	if (_.isFunction(item.toInspect)) {
		return item.toInspect();
	}
	if (_.isString(item)) {
		return `\"${item}\"`;
	}
	if (_.isNumber(item)) {
		return `${item}`;
	}
	if (_.isFunction(item)) {
		let code = item.toString().slice("function ".length).replace(/\n/g, "").replace(/\s+/g, " ");
		// We limit the size of a function body if it's in a strucutre
		let limit = 50;
		if ((code.length > limit) && (l > 0)) { code = `${_.trimEnd(code.slice(0, limit + 1 || undefined))}… }`; }
		return `<Function ${code}>`;
	}
	if (_.isArray(item)) {
		if (l > max) { return "[...]"; }
		return `[${_.map(item, i => Utils.inspect(i, max, l+1)).join(", ")}]`;
	}
	if (_.isObject(item)) {
		let objectInfo;
		let objectType = Utils.inspectObjectType(item);
		// We should not loop over dom trees because we will have a bad time
		if (/HTML\w+?Element/.test(objectType)) { return `<${objectType}>`; }
		if (l > max) {
			objectInfo = "{...}";
		} else {
			objectInfo = `{${_.map(item, (v, k) => `${k}:${Utils.inspect(v, max, l+1)}`).join(", ")}}`;
		}
		if (objectType === "Object") { return objectInfo; }
		return `<${objectType} ${objectInfo}>`;
	}

	return `${item}`;
};

Utils.uuid = function() {

	let chars = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
	let output = new Array(36);
	let random = 0;

	for (let digit = 1; digit <= 32; digit++) {
		if (random <= 0x02) { random = (0x2000000 + (Math.random() * 0x1000000)) | 0; }
		let r = random & 0xf;
		random = random >> 4;
		output[digit] = chars[digit === 19 ? (r & 0x3) | 0x8 : r];
	}

	return output.join("");
};

Utils.arrayFromArguments = function(args) {
	// Convert an arguments object to an array
	if (_.isArray(args[0])) { return args[0]; }
	return Array.prototype.slice.call(args);
};

Utils.cycle = function() {

	// Returns a function that cycles through a list of values with each call.

	let args = Utils.arrayFromArguments(arguments);

	let curr = -1;
	return function() {
		curr++;
		if (curr >= args.length) { curr = 0; }
		return args[curr];
	};
};

// Backwards compatibility
Utils.toggle = Utils.cycle;

Utils.callAfterCount = function(total, callback) {
	// This calls a function after this method is called total times
	let callAfterCount;
	let count = 0;
	return callAfterCount = function() {
		count += 1;
		if (count === total) { return (typeof callback === 'function' ? callback() : undefined); }
	};
};

//#####################################################
// ENVIROMENT FUNCTIONS

Utils.isWebKit = () => (window.WebKitCSSMatrix !== undefined) && !Utils.isEdge();

Utils.webkitVersion = function() {
	let version = -1;
	let regexp = /AppleWebKit\/([\d.]+)/;
	let result = regexp.exec(navigator.userAgent);
	if (result) { version = parseFloat(result[1]); }
	return version;
};

Utils.isChrome = () => /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

Utils.isSafari = () => /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

Utils.isEdge = () => /Edge/.test(navigator.userAgent);

Utils.isAndroid = () => /(android)/i.test(navigator.userAgent);

Utils.isIOS = () => /(iPhone|iPod|iPad)/i.test(navigator.platform);

Utils.isMacOS = () => /Mac/.test(navigator.platform);

Utils.isWindows = () => /Win/.test(navigator.platform);

Utils.isTouch = () =>
	(window.ontouchstart === null) &&
	(window.ontouchmove === null) &&
	(window.ontouchend === null)
;

Utils.isDesktop = () => Utils.deviceType() === "desktop";

Utils.isPhone = () => Utils.deviceType() === "phone";

Utils.isTablet = () => Utils.deviceType() === "tablet";

Utils.isMobile = () => Utils.isPhone() || Utils.isTablet();

Utils.isFileUrl = url => _.startsWith(url, "file://");

Utils.isDataUrl = url => _.startsWith(url, "data:");

Utils.isRelativeUrl = url => !/^([a-zA-Z]{1,8}:\/\/).*$/.test(url);

Utils.isLocalServerUrl = url => (url.indexOf("127.0.0.1") !== -1) || (url.indexOf("localhost")  !== -1);

Utils.isLocalUrl = function(url) {
	if (Utils.isFileUrl(url)) { return true; }
	if (Utils.isLocalServerUrl(url)) { return true; }
	return false;
};

Utils.isLocalAssetUrl = function(url, baseUrl) {
	if (baseUrl == null) { baseUrl = window.location.href; }
	if (Utils.isDataUrl(url)) { return false; }
	if (Utils.isLocalUrl(url)) { return true; }
	if (Utils.isRelativeUrl(url) && Utils.isLocalUrl(baseUrl)) { return true; }
	return false;
};

Utils.isFramerStudio = () => navigator.userAgent.indexOf("FramerStudio") !== -1;

Utils.framerStudioVersion = function() {

	if (Utils.isFramerStudio()) {

		let version;
		let isBeta = navigator.userAgent.indexOf("FramerStudio/beta") >= 0;
		let isLocal = navigator.userAgent.indexOf("FramerStudio/local") >= 0;
		let isFuture = navigator.userAgent.indexOf("FramerStudio/future") >= 0;
		if (isBeta || isLocal || isFuture) { return Number.MAX_VALUE; }

		let matches = navigator.userAgent.match(/\d+$/);
		if (matches && (matches.length > 0)) { version = parseInt(matches[0]); }
		if (_.isNumber(version)) { return version; }
	}

	// if we don't know the version we are probably running the beta or a local build
	return Number.MAX_VALUE;
};

Utils.devicePixelRatio = () => window.devicePixelRatio;

Utils.isJP2Supported = () => Utils.isWebKit() && !Utils.isChrome();

Utils.isWebPSupported = () => Utils.isChrome();

Utils.deviceType = function() {

	// Taken from
	// https://github.com/jeffmcmahan/device-detective/blob/master/bin/device-detect.js

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

Utils.deviceFont = function(os) {

	// https://github.com/jonathantneal/system-font-css

	if (!os) {
		if (Utils.isMacOS()) { os = "macos"; }
		if (Utils.isIOS()) { os = "ios"; }
		if (Utils.isAndroid()) { os = "android"; }
		if (Utils.isWindows()) { os = "windows"; }
	}

	if (os === "macos") { return "-apple-system, SF UI Text, Helvetica Neue"; }
	if (os === "ios") { return "-apple-system, SF UI Text, Helvetica Neue"; }
	if (os === "android") { return "Roboto, Helvetica Neue"; }
	if (os === "windows") { return "Segoe UI"; }
	return "Helvetica";
};

//#####################################################
// MATH FUNCTIONS

Utils.round = function(value, decimals, increment, min, max) {

	if (decimals == null) { decimals = 0; }
	if (increment == null) { increment = null; }
	if (min == null) { min = null; }
	if (max == null) { max = null; }
	let d = Math.pow(10, decimals);

	if (increment) { value = Math.round(value / increment) * increment; }
	value = Math.round(value * d) / d;

	if (min && (value < min)) { return min; }
	if (max && (value > max)) { return max; }
	return value;
};

Utils.roundWhole = function(value, decimals) {
	// Return integer if whole value, else include decimals
	if (decimals == null) { decimals = 1; }
	if (parseInt(value) === value) { return parseInt(value); }
	return Utils.round(value, decimals);
};

Utils.clamp = function(value, a, b) {

	let min = Math.min(a, b);
	let max = Math.max(a, b);

	if (value < min) { value = min; }
	if (value > max) { value = max; }
	return value;
};

// Taken from http://jsfiddle.net/Xz464/7/
// Used by animation engine, needs to be very performant
Utils.mapRange = (value, fromLow, fromHigh, toLow, toHigh) => toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow));

// Kind of similar as above but with a better syntax and a limiting option
Utils.modulate = function(value, rangeA, rangeB, limit) {

	if (limit == null) { limit = false; }
	let [fromLow, fromHigh] = Array.from(rangeA);
	let [toLow, toHigh] = Array.from(rangeB);

	// if rangeB consists of Colors we return a color tween
	// if Color.isColor(toLow) or _.isString(toLow) and Color.isColorString(toLow)
	// 	ratio = Utils.modulate(value, rangeA, [0, 1])
	// 	result = Color.mix(toLow, toHigh, ratio)
	// 	return result

	let result = toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow));

	if (limit === true) {
		if (toLow < toHigh) {
			if (result < toLow) { return toLow; }
			if (result > toHigh) { return toHigh; }
		} else {
			if (result > toLow) { return toLow; }
			if (result < toHigh) { return toHigh; }
		}
	}

	return result;
};



//#####################################################
// STRING FUNCTIONS

Utils.parseFunction = function(str) {
	let result = {name: "", args: []};

	if (_.endsWith(str, ")")) {
		result.name = str.split("(")[0];
		result.args = str.split("(")[1].split(",").map(a => _.trim(_.trimEnd(a, ")")));
	} else {
		result.name = str;
	}

	return result;
};

//#####################################################
// DOM FUNCTIONS

let __domCompleteState = "interactive";
let __domComplete = [];
let __domReady = false;

if (typeof document !== 'undefined' && document !== null) {
	document.onreadystatechange = function(event) {
		if (document.readyState === __domCompleteState) {
			__domReady = true;
			return (() => {
				let result = [];
				while (__domComplete.length) {
					var f;
					result.push(f = __domComplete.shift()());
				}
				return result;
			})();
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

Utils.domCompleteCancel = f => __domComplete = _.without(__domComplete, f);

Utils.domValidEvent = function(element, eventName) {
	if (!eventName) { return; }
	if (["touchstart", "touchmove", "touchend"].includes(eventName)) { return true; }
	return typeof(element[`on${eventName.toLowerCase()}`]) !== "undefined";
};

Utils.domLoadScript = function(url, callback) {

	let script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;

	script.onload = callback;

	let head = document.getElementsByTagName("head")[0];
	head.appendChild(script);

	return script;
};

Utils.domLoadData = function(path, callback) {

	let request = new XMLHttpRequest();

	// request.addEventListener "progress", updateProgress, false
	// request.addEventListener "abort", transferCanceled, false

	request.addEventListener("load", () => callback(null, request.responseText)
	, false);

	request.addEventListener("error", () => callback(true, null)
	, false);

	request.open("GET", path, true);
	return request.send(null);
};

Utils.domLoadJSON = (path, callback) =>
	Utils.domLoadData(path, (err, data) => callback(err, JSON.parse(data)))
;

Utils.domLoadDataSync = function(path) {

	let request = new XMLHttpRequest();
	request.open("GET", path, false);

	// This does not work in Safari, see below
	try {
		request.send(null);
	} catch (e) {
		console.debug("XMLHttpRequest.error", e);
	}

	let handleError = function() {
		throw Error(`Utils.domLoadDataSync: ${path} -> [${request.status} ${request.statusText}]`);
	};

	request.onerror = handleError;

	if (![200, 0].includes(request.status)) {
		handleError();
	}

	// Because I can't catch the actual 404 with Safari, I just assume something
	// went wrong if there is no text data returned from the request.
	if (!request.responseText) {
		handleError();
	}

	// console.log "domLoadDataSync", path
	// console.log "xhr.readyState", request.readyState
	// console.log "xhr.status", request.status
	// console.log "xhr.responseText", request.responseText

	return request.responseText;
};

Utils.domLoadJSONSync = path => JSON.parse(Utils.domLoadDataSync(path));

Utils.domLoadScriptSync = function(path) {
	let scriptData = Utils.domLoadDataSync(path);
	eval(scriptData);
	return scriptData;
};

Utils.insertCSS = function(css) {

	let styleElement = document.createElement("style");
	styleElement.type = "text/css";
	styleElement.innerHTML = css;

	return Utils.domComplete(() => document.body.appendChild(styleElement));
};

Utils.loadImage = function(url, callback, context) {

	// Loads a single image and calls callback.
	// The callback will be called with true if there is an error.

	let element = new Image;
	if (context == null) { context = Framer.CurrentContext; }

	context.domEventManager.wrap(element).addEventListener("load", event => callback());

	context.domEventManager.wrap(element).addEventListener("error", event => callback(true));

	return element.src = url;
};

Utils.isInsideIframe = () => window !== window.top;

//#####################################################
// GEOMETRY FUNCTIONS

// Point

Utils.point = function(input) {

	if (_.isNumber(input)) { return Utils.pointZero(input); }
	if (!input) { return Utils.pointZero(); }

	let result = Utils.pointZero();

	for (let k of ["x", "y"]) {
		if (_.isNumber(input[k])) { result[k] = input[k]; }
	}

	return result;
};

Utils.pointZero = function(n) {
	if (n == null) { n = 0; }
	return {x: n, y: n};
};

Utils.pointDivide = (point, fraction) =>
	point = {
		x: point.x / fraction,
		y: point.y / fraction
	}
;

Utils.pointAdd = function(pointA, pointB) {
	let point;
	return point = {
		x: pointA.x + pointB.x,
		y: pointA.y + pointB.y
	};
};

Utils.pointSubtract = function(pointA, pointB) {
	let point;
	return point = {
		x: pointA.x - pointB.x,
		y: pointA.y - pointB.y
	};
};

Utils.pointMin = function() {
	let point;
	let points = Utils.arrayFromArguments(arguments);
	return point = {
		x: _.min(points.map(size => size.x)),
		y: _.min(points.map(size => size.y))
	};
};

Utils.pointMax = function() {
	let point;
	let points = Utils.arrayFromArguments(arguments);
	return point = {
		x: _.max(points.map(size => size.x)),
		y: _.max(points.map(size => size.y))
	};
};

Utils.pointDelta = function(pointA, pointB) {
	let delta;
	return delta = {
		x: pointB.x - pointA.x,
		y: pointB.y - pointA.y
	};
};

Utils.pointDistance = function(pointA, pointB) {
	let a = pointA.x - pointB.x;
	let b = pointA.y - pointB.y;
	return Math.sqrt((a * a) + (b * b));
};

Utils.pointInvert = point =>
	point = {
		x: 0 - point.x,
		y: 0 - point.y
	}
;

Utils.pointTotal = point => point.x + point.y;

Utils.pointAbs = point =>
	point = {
		x: Math.abs(point.x),
		y: Math.abs(point.y)
	}
;

Utils.pointInFrame = function(point, frame) {
	if ((point.x < Utils.frameGetMinX(frame)) || (point.x > Utils.frameGetMaxX(frame))) { return false; }
	if ((point.y < Utils.frameGetMinY(frame)) || (point.y > Utils.frameGetMaxY(frame))) { return false; }
	return true;
};

Utils.pointCenter = function(pointA, pointB) {
	let point;
	return point = {
		x: (pointA.x + pointB.x) / 2,
		y: (pointA.y + pointB.y) / 2
	};
};

Utils.pointAngle = (pointA, pointB) => (Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * 180) / Math.PI;


// Size

Utils.size = function(input) {

	if (_.isNumber(input)) { return Utils.sizeZero(input); }
	if (!input) { return Utils.sizeZero(); }

	let result = Utils.sizeZero();

	for (let k of ["width", "height"]) {
		if (_.isNumber(input[k])) { result[k] = input[k]; }
	}

	return result;
};

Utils.sizeZero = function(n) {
	if (n == null) { n = 0; }
	return {width: n, height: n};
};

Utils.sizeMin = function() {
	let size;
	let sizes = Utils.arrayFromArguments(arguments);
	return size  = {
		width: _.min(sizes.map(size => size.width)),
		height: _.min(sizes.map(size => size.height))
	};
};

Utils.sizeMax = function() {
	let size;
	let sizes = Utils.arrayFromArguments(arguments);
	return size  = {
		width: _.max(sizes.map(size => size.width)),
		height: _.max(sizes.map(size => size.height))
	};
};

// Rect

Utils.rectZero = function(args) {
	if (args == null) { args = {}; }
	return _.defaults(args, {top: 0, right: 0, bottom: 0, left: 0});
};

Utils.parseRect = function(args) {
	if (_.isArray(args) && _.isNumber(args[0])) {
		if (args.length === 1) { return Utils.parseRect({top: args[0]}); }
		if (args.length === 2) { return Utils.parseRect({top: args[0], right: args[1]}); }
		if (args.length === 3) { return Utils.parseRect({top: args[0], right: args[1], bottom: args[2]}); }
		if (args.length === 4) { return Utils.parseRect({top: args[0], right: args[1], bottom: args[2], left: args[3]}); }
	}
	if (_.isArray(args) && _.isObject(args[0])) {
		return args[0];
	}
	if (_.isObject(args)) {
		return args;
	}
	if (_.isNumber(args)) {
		return {top: args, right: args, bottom: args, left: args};
	}

	return {};
};

// Frames

// min mid max * x, y

Utils.frameGetMinX = frame => frame.x;
Utils.frameSetMinX = (frame, value) => frame.x = value;

Utils.frameGetMidX = function(frame) {
	if (frame.width === 0) { return frame.x; } else { return frame.x + (frame.width / 2.0); }
};
Utils.frameSetMidX = (frame, value) => frame.x = frame.width === 0 ? value : value - (frame.width / 2.0);

Utils.frameGetMaxX = function(frame) {
	if (frame.width === 0) { return 0; } else { return frame.x + frame.width; }
};
Utils.frameSetMaxX = (frame, value) => frame.x = frame.width === 0 ? 0 : value - frame.width;

Utils.frameGetMinY = frame => frame.y;
Utils.frameSetMinY = (frame, value) => frame.y = value;

Utils.frameGetMidY = function(frame) {
	if (frame.height === 0) { return frame.y; } else { return frame.y + (frame.height / 2.0); }
};
Utils.frameSetMidY = (frame, value) => frame.y = frame.height === 0 ? value : value - (frame.height / 2.0);

Utils.frameGetMaxY = function(frame) {
	if (frame.height === 0) { return 0; } else { return frame.y + frame.height; }
};
Utils.frameSetMaxY = (frame, value) => frame.y = frame.height === 0 ? 0 : value - frame.height;

Utils.frame = function(input) {

	if (_.isNumber(input)) { return Utils.frameZero(input); }
	if (!input) { return Utils.frameZero(); }

	let result = Utils.frameZero();

	for (let k of ["x", "y", "width", "height"]) {
		if (_.isNumber(input[k])) { result[k] = input[k]; }
	}

	return result;
};

Utils.frameZero = function(n) {
	if (n == null) { n = 0; }
	return {x: n, y: n};
};

Utils.frameSize = function(frame) {
	let size;
	return size = {
		width: frame.width,
		height: frame.height
	};
};

Utils.framePoint = function(frame) {
	let point;
	return point = {
		x: frame.x,
		y: frame.y
	};
};

Utils.pointsFromFrame = function(frame) {
	let minX = Utils.frameGetMinX(frame);
	let maxX = Utils.frameGetMaxX(frame);
	let minY = Utils.frameGetMinY(frame);
	let maxY = Utils.frameGetMaxY(frame);
	let corner1 = {x: minX, y: minY};
	let corner2 = {x: minX, y: maxY};
	let corner3 = {x: maxX, y: maxY};
	let corner4 = {x: maxX, y: minY};
	return [corner1, corner2, corner3, corner4];
};

Utils.frameFromPoints = function(points) {

	let frame;
	let xValues = _.map(points, "x");
	let yValues = _.map(points, "y");

	let minX = _.min(xValues);
	let maxX = _.max(xValues);
	let minY = _.min(yValues);
	let maxY = _.max(yValues);

	return frame = {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY
	};
};

Utils.pixelAlignedFrame = function(frame) {
	let result;
	return result = {
		width: Math.round(frame.width + (frame.x % 1)),
		height: Math.round(frame.height + (frame.y % 1)),
		x: Math.round(frame.x),
		y: Math.round(frame.y)
	};
};

Utils.frameMerge = function() {

	// Return a frame that fits all the input frames

	let frames = Utils.arrayFromArguments(arguments);

	let frame = {
		x: _.min(frames.map(Utils.frameGetMinX)),
		y: _.min(frames.map(Utils.frameGetMinY))
	};

	frame.width  = _.max(frames.map(Utils.frameGetMaxX)) - frame.x;
	frame.height = _.max(frames.map(Utils.frameGetMaxY)) - frame.y;

	return frame;
};

Utils.frameInFrame = function(frameA, frameB) {

	for (let point of Array.from(Utils.pointsFromFrame(frameA))) {
		if (!Utils.pointInFrame(point, frameB)) { return false; }
	}

	return true;
};

Utils.framePointForOrigin = (frame, originX, originY) =>
	frame = {
		x: frame.x + (originX * frame.width),
		y: frame.y + (originY * frame.height),
		width: frame.width,
		height: frame.height
	}
;

Utils.frameInset = function(frame, inset) {

	if (_.isNumber(inset)) {
		inset = {top: inset, right: inset, bottom: inset, left: inset};
	}

	frame = Utils.frame(frame);

	return frame = {
		x: frame.x + inset.left,
		y: frame.y + inset.top,
		width: frame.width - inset.left - inset.right,
		height: frame.height - inset.top - inset.bottom
	};
};

Utils.frameSortByAbsoluteDistance = function(point, frames, originX, originY) {
	if (originX == null) { originX = 0; }
	if (originY == null) { originY = 0; }
	let distance = function(frame) {
		let result = Utils.pointDelta(point, Utils.framePointForOrigin(frame, originX, originY));
		result = Utils.pointAbs(result);
		result = Utils.pointTotal(result);
		return result;
	};

	return frames.sort((a, b) => distance(a) - distance(b));
};

Utils.pointInPolygon = function(point, vs) {
	// ray-casting algorithm based on
	// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	let x = point[0];
	let y = point[1];
	let inside = false;
	let i = 0;
	let j = vs.length - 1;
	while (i < vs.length) {
		let xi = vs[i][0];
		let yi = vs[i][1];
		let xj = vs[j][0];
		let yj = vs[j][1];
		let intersect = yi > y && y !== yj && yj > y && (x < ((((xj - xi) * (y - yi)) / (yj - yi)) + xi));
		if (intersect) {
			inside = !inside;
		}
		j = i++;
	}
	return inside;
};

Utils.frameIntersection = function(rectA, rect) {

	let x1 = rect.x;
	let y1 = rect.y;

	let x2 = x1 + rect.width;
	let y2 = y1 + rect.height;

	if (rectA.x > x1) {
		x1 = rectA.x;
	}
	if (rectA.y > y1) {
		y1 = rectA.y;
	}
	if ((rectA.x + rectA.width) < x2) {
		x2 = rectA.x + rectA.width;
	}
	if ((rectA.y + rectA.height) < y2) {
		y2 = rectA.y + rectA.height;
	}
	if ((x2 <= x1) || (y2 <= y1)) {
		return null;
	}

	return rect = {
		x: x1,
		y: y1,
		width: x2 - x1,
		height: y2 - y1
	};
};


Utils.frameCenterPoint = function(frame) {
	let point;
	return point = {
		x: Utils.frameGetMidX(frame),
		y: Utils.frameGetMidY(frame)
	};
};

Utils.frameInFrame = function(frameA, frameB) {

	for (let point of Array.from(Utils.pointsFromFrame(frameA))) {
		if (!Utils.pointInFrame(point, frameB)) { return false; }
	}

	return true;
};


// Rotation

Utils.rotationNormalizer = function() {

	let lastValue = null;

	return function(value) {
		if ((lastValue == null)) { lastValue = value; }

		let diff = lastValue - value;
		let maxDiff = Math.abs(diff) + 180;
		let nTimes = Math.floor(maxDiff / 360);

		if (diff < 180) { value -= (nTimes * 360); }
		if (diff > 180) { value += (nTimes * 360); }

		lastValue = value;
		return value;
	};
};


// Coordinate system

// convert a point from a layer to the context level, with rootContext enabled you can make it cross to the top context
Utils.convertPointToContext = function(point, layer, rootContext, includeLayer) {
	if (point == null) { point = {}; }
	if (rootContext == null) { rootContext = false; }
	if (includeLayer == null) { includeLayer = true; }
	point = _.defaults(point, {x: 0, y: 0, z: 0});
	let ancestors = layer.ancestors(rootContext);
	if (includeLayer) { ancestors.unshift(layer); }

	for (let ancestor of Array.from(ancestors)) {
		if (ancestor.flat || ancestor.clip) { point.z = 0; }
		point = ancestor.matrix3d.point(point);
		if (!ancestor.parent) { point.z = 0; }
	}

	return point;
};

Utils.convertFrameToContext = function(frame, layer, rootContext, includeLayer) {
	if (frame == null) { frame = {}; }
	if (rootContext == null) { rootContext = false; }
	if (includeLayer == null) { includeLayer = true; }
	frame = _.defaults(frame, {x: 0, y: 0, width: 100, height: 100});
	let corners = Utils.pointsFromFrame(frame);
	let convertedCorners = corners.map(point => Utils.convertPointToContext(point, layer, rootContext, includeLayer));
	return Utils.frameFromPoints(convertedCorners);
};

// convert a point from the context level to a layer, with rootContext enabled you can make it cross from the top context
Utils.convertPointFromContext = function(point, layer, rootContext, includeLayer) {

	if (point == null) { point = {}; }
	if (rootContext == null) { rootContext = false; }
	if (includeLayer == null) { includeLayer = true; }
	point = _.defaults(point, {x: 0, y: 0, z: 0});

	if (rootContext && (typeof webkitConvertPointFromPageToNode !== 'undefined' && webkitConvertPointFromPageToNode !== null)) {
		let node;
		if (includeLayer) {
			node = layer._element;
		} else {
			let parent = layer.parent || layer.context;
			node = parent._element;
		}
		return Utils.point(webkitConvertPointFromPageToNode(node, new WebKitPoint(point.x, point.y)));
	}

	let ancestors = layer.ancestors(rootContext);
	ancestors.reverse();
	if (includeLayer) { ancestors.push(layer); }

	for (let ancestor of Array.from(ancestors)) {
		if (!ancestor.matrix3d) { continue; }
		point = ancestor.matrix3d.inverse().point(point);
	}

	return point;
};

// convert a frame from the context level to a layer, with rootContext enabled you can make it start from the top context
Utils.convertFrameFromContext = function(frame, layer, rootContext, includeLayer) {
	if (frame == null) { frame = {}; }
	if (rootContext == null) { rootContext = false; }
	if (includeLayer == null) { includeLayer = true; }
	frame = _.defaults(frame, {x: 0, y: 0, width: 100, height: 100});
	let corners = Utils.pointsFromFrame(frame);
	let convertedCorners = corners.map(point => Utils.convertPointFromContext(point, layer, rootContext, includeLayer));
	return Utils.frameFromPoints(convertedCorners);
};

// convert a point from layerA to layerB via the context
Utils.convertPoint = function(input, layerA, layerB, rootContext) {

	// Convert a point between two layer coordinate systems
	if (rootContext == null) { rootContext = false; }
	let point = _.defaults(input, {x: 0, y: 0, z: 0});
	if (layerA) { point = Utils.convertPointToContext(point, layerA, rootContext); }
	if (layerB != null) {
		return Utils.convertPointFromContext(point, layerB, rootContext);
	} else if ((layerA != null) && rootContext && (typeof webkitConvertPointFromPageToNode !== 'undefined' && webkitConvertPointFromPageToNode !== null)) {
		let node = layerA.context._element;
		return Utils.point(webkitConvertPointFromPageToNode(node, new WebKitPoint(point.x, point.y)));
	} else {
		return point;
	}
};

// get the bounding frame of a layer, either at the canvas (rootcontext) or screen level
Utils.boundingFrame = function(layer, rootContext) {
	if (rootContext == null) { rootContext = true; }
	let frame = {x: 0, y: 0, width: layer.width, height: layer.height};
	let cornerPoints = Utils.pointsFromFrame(frame);
	let contextCornerPoints = cornerPoints.map(point => Utils.convertPointToContext(point, layer, rootContext));
	let boundingFrame = Utils.frameFromPoints(contextCornerPoints);
	return Utils.pixelAlignedFrame(boundingFrame);
};

Utils.perspectiveProjectionMatrix = function(element) {
	let p = element.perspective;
	let m = new Matrix();
	if ((p != null) && (p !== 0)) { m.m34 = -1/p; }
	return m;
};

// matrix of perspective projection with perspective origin applied
Utils.perspectiveMatrix = function(element) {
	let ox = element.perspectiveOriginX * element.width;
	let oy = element.perspectiveOriginY * element.height;
	let ppm = Utils.perspectiveProjectionMatrix(element);
	return new Matrix()
		.translate(ox, oy)
		.multiply(ppm)
		.translate(-ox, -oy);
};

//##################################################################
// Beta additions, use with care

Utils.globalLayers = function(importedLayers) {

	// Beta. Not sure if we should push this but it's nice to have.
	// Use this to make all layers in an imported set available on
	// on the top level, so without the "importedLayers" prefix.

	for (let layerName in importedLayers) {

		// Replace all whitespace in layer names
		let layer = importedLayers[layerName];
		layerName = layerName.replace(/\s/g, "");

		// Check if there are global variables with the same name
		if (window.hasOwnProperty(layerName) && !window.Framer._globalWarningGiven) {
			print(`Warning: Cannot make layer '${layerName}' a global, a variable with that name already exists`);
		} else {
			window[layerName] = layer;
		}
	}

	return window.Framer._globalWarningGiven = true;
};


let _textSizeNode = null;

Utils.textSize = function(text, style, constraints) {

	// This function takes some text, css style and optionally a width and height and
	// returns the rendered text size. This can be pretty slow, so use sporadically.
	// http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript

	let frame;
	if (style == null) { style = {}; }
	if (constraints == null) { constraints = {}; }
	let shouldCreateNode = !_textSizeNode;

	if (shouldCreateNode) {
		_textSizeNode = document.createElement("div");
		_textSizeNode.id = "_textSizeNode";
	}

	// Reset all the previous styles and set the content
	_textSizeNode.removeAttribute("style");
	_textSizeNode.innerHTML = text;

	style = _.extend(_.clone(style), {
		position: "fixed",
		display: "inline",
		visibility: "hidden",
		top: "-10000px",
		left: "-10000px"
	}
	);

	delete style.width;
	delete style.height;
	delete style.bottom;
	delete style.right;

	if (constraints.width) { style.width = `${constraints.width}px`; }
	if (constraints.height) { style.height = `${constraints.height}px`; }

	_.extend(_textSizeNode.style, style);

	if (shouldCreateNode) {
		// This is a trick to call this function before the document ready event
		if (!window.document.body) {
			document.write(_textSizeNode.outerHTML);
			_textSizeNode = document.getElementById("_textSizeNode");
		} else {
			window.document.body.appendChild(_textSizeNode);
		}
	}

	let rect = _textSizeNode.getBoundingClientRect();

	return frame = {
		width: rect.right - rect.left,
		height: rect.bottom - rect.top
	};
};


_.extend(exports, Utils);
