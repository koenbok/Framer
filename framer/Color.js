import { _ } from "./Underscore";
import { BaseClass } from "./BaseClass";
import libhusl from "husl";

// the Color class is inspired by TinyColor https://github.com/bgrins/TinyColor

let ColorType = {
	RGB: "rgb",
	HSL: "hsl",
	HEX: "hex",
	NAME: "name"
};

export let Color = class Color extends BaseClass {
	static initClass() {
	
		this.define("r",
			{get() { return this._r; }});
	
		this.define("g",
			{get() { return this._g; }});
	
		this.define("b",
			{get() { return this._b; }});
	
		this.define("a",
			{get() { return this._a; }});
	
		this.define("h",
			{get() { return this._h; }});
	
		this.define("s",
			{get() { return this._s; }});
	
		this.define("l",
			{get() { return this._l; }});
	}
	constructor(color1, r, g, b) {

		this.toInspect = this.toInspect.bind(this);
		this.color = color1;
		if (this.color === "") {
			this.color = null;
		}

		let { color } = this;

		// If input already is a Color object return input
		if (Color.isColorObject(color)) { return color; }

		// Convert input to RGB
		let input = inputData(color, r, g, b);

		this._type = input.type;
		this._r = input.r;
		this._g = input.g;
		this._b = input.b;
		this._a = input.a;
		this._h = input.h;
		this._s = input.s;
		this._l = input.l;
		this._roundA = Math.round(100*this._a) / 100;
	}

	toHex(allow3Char) {
		return rgbToHex(this._r, this._g, this._b, allow3Char);
	}

	toHexString(allow3Char) {
		return `#${this.toHex(allow3Char)}`;
	}

	toRgb() {
		if (this._rgb === undefined) {
			this._rgb = {
				r: Math.round(this._r),
				g: Math.round(this._g),
				b: Math.round(this._b),
				a: this._a
			};
		}
		return _.clone(this._rgb);
	}

	toRgbString() {
		if (this._a === 1) { return `rgb(${Utils.round(this._r, 0)}, ${Utils.round(this._g, 0)}, ${Utils.round(this._b, 0)})`;
		} else { return `rgba(${Utils.round(this._r, 0)}, ${Utils.round(this._g, 0)}, ${Utils.round(this._b, 0)}, ${this._roundA})`; }
	}

	toHsl() {
		if (this._hsl === undefined) {
			this._hsl = {
				h: this.h,
				s: this.s,
				l: this.l,
				a: this.a
			};
		}
		return _.clone(this._hsl);
	}

	toHusl() {
		if (this._husl === undefined) {
			let c = libhusl._conv;
			let husl = c.lch.husl(c.luv.lch(c.xyz.luv(c.rgb.xyz([this.r/255, this.g/255, this.b/255]))));
			this._husl = {h: husl[0], s: husl[1], l: husl[2]};
		}

		return _.clone(this._husl);
	}

	toHslString() {
		if (this._hslString === undefined) {
			let hsl = this.toHsl();
			let h = Math.round(hsl.h);
			let s = Math.round(hsl.s * 100);
			let l = Math.round(hsl.l * 100);
			if (this._a === 1) {
				this._hslString = `hsl(${h}, ${s}%, ${l}%)`;
			} else {
				this._hslString = `hsla(${h}, ${s}%, ${l}%, ${this._roundA})`;
			}
		}
		return this._hslString;
	}

	toName() {
		if (this._a === 0) { return "transparent"; }
		if (this._a < 1) { return false; }
		let hex = rgbToHex(this._r, this._g, this._b, true);

		for (let key of Array.from(_.keys(cssNames))) {
			let value = cssNames[key];
			if (value === hex) {
				return key;
			}
		}

		return false;
	}

	lighten(amount) {
		if (amount == null) { amount = 10; }
		let hsl = this.toHsl();
		hsl.l += amount / 100;
		hsl.l = Math.min(1, Math.max(0, hsl.l));
		return new Color(hsl);
	}

	brighten(amount) {
		if (amount == null) { amount = 10; }
		let rgb = this.toRgb();
		rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
		rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
		rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
		return new Color(rgb);
	}

	darken(amount) {
		if (amount == null) { amount = 10; }
		let hsl = this.toHsl();
		hsl.l -= amount / 100;
		hsl.l = Math.min(1, Math.max(0, hsl.l));
		return new Color(hsl);
	}

	desaturate(amount) {
		if (amount == null) { amount = 10; }
		let hsl = this.toHsl();
		hsl.s -= amount / 100;
		hsl.s = Math.min(1, Math.max(0, hsl.s));
		return new Color(hsl);
	}

	saturate(amount) {
		if (amount == null) { amount = 10; }
		let hsl = this.toHsl();
		hsl.s += amount / 100;
		hsl.s = Math.min(1, Math.max(0, hsl.s));
		return new Color(hsl);
	}

	grayscale() {
		let hsl = this.toHsl();
		return new Color(hsl).desaturate(100);
	}

	toString() {
		return this.toRgbString();
	}

	alpha(alpha) {
		let result;
		if (alpha == null) { alpha = 1; }
		return result = new Color({
			r: this.r,
			g: this.g,
			b: this.b,
			a: alpha
		});
	}

	transparent() {
		return this.alpha(0);
	}

	mix(colorB, fraction, limit, model) {
		if (limit == null) { limit = false; }
		return Color.mix(this, colorB, fraction, limit, model);
	}

	copy() {
		return new Color(this);
	}

	isEqual(colorB) {
		return Color.equal(this, colorB);
	}

	toInspect() {
		if (this._type === ColorType.HSL) {
			return `<${this.constructor.name} h:${this.h} s:${this.s} l:${this.l} a:${this.a}>`;
		} else if ((this._type === ColorType.HEX) || (this._type === ColorType.NAME)) {
			return `<${this.constructor.name} \"${this.color}\">`;
		} else {
			return `<${this.constructor.name} r:${this.r} g:${this.g} b:${this.b} a:${this.a}>`;
		}
	}

	//#############################################################
	//# Class methods

	static mix(colorA, colorB, fraction, limit, model) {

		if (fraction == null) { fraction = .5; }
		if (limit == null) { limit = false; }
		let result = null;

		//
		if ((typeof colorA === "string") && this.isColorString(colorA)) {
			colorA = new Color(colorA);
		}
		if ((typeof colorB === "string") && this.isColorString(colorB)) {
			colorB = new Color(colorB);
		}

		if (!(colorA instanceof Color) && colorB instanceof Color) {
			colorA = colorB.transparent();
		} else if (colorA instanceof Color && (colorA._a === 0) && colorB instanceof Color && (colorB._a !== 0)) {
			colorA = colorB.transparent();
		} else if (!(colorB instanceof Color) && colorA instanceof Color) {
			colorB = colorA.transparent();
		} else if (colorB instanceof Color && (colorB._a === 0) && colorA instanceof Color && (colorA._a !== 0)) {
			colorB = colorA.transparent();
		}

		if (colorB instanceof Color) {

			if (ColorModel.isRGB(model)) {

				// rgb model
				result = new Color({
					r: Utils.modulate(fraction, [0, 1], [colorA._r, colorB._r], limit),
					g: Utils.modulate(fraction, [0, 1], [colorA._g, colorB._g], limit),
					b: Utils.modulate(fraction, [0, 1], [colorA._b, colorB._b], limit),
					a: Utils.modulate(fraction, [0, 1], [colorA._a, colorB._a], limit)
				});

			} else {

				let hslA, hslB;
				hslA;
				hslB;

				if (ColorModel.isHSL(model)) {
					// hsl model
					hslA = colorA.toHsl();
					hslB = colorB.toHsl();
				} else {
					// husl model
					hslA = colorA.toHusl();
					hslB = colorB.toHusl();
				}

				if (hslA.s === 0) {
					hslA.h = hslB.h;
				} else if (hslB.s === 0) {
					hslB.h = hslA.h;
				}

				let fromH = hslA.h;
				let toH = hslB.h;
				let deltaH = toH - fromH;

				if (deltaH > 180) {
					deltaH = (toH - 360) - fromH;
				} else if (deltaH < -180) {
					deltaH = (toH + 360) - fromH;
				}

				let tween = {
					h: Utils.modulate(fraction, [0, 1], [fromH, fromH + deltaH], limit),
					s: Utils.modulate(fraction, [0, 1], [hslA.s, hslB.s], limit),
					l: Utils.modulate(fraction, [0, 1], [hslA.l, hslB.l], limit),
					a: Utils.modulate(fraction, [0, 1], [colorA.a, colorB.a], limit)
				};

				if (ColorModel.isHSL(model)) {
					// hsl model
					result = new Color(tween);
				} else {
					// husl model
					result = new Color(rgbaFromHusl(tween));
				}
			}
		}

		return result;
	}

	static random(alpha) {
		if (alpha == null) { alpha = 1.0; }
		let c = () => parseInt(Math.random() * 255);
		return new Color(`rgba(${c()}, ${c()}, ${c()}, ${alpha})`);
	}

	static grey(g, alpha) {
		if (g == null) { g = 0.5; }
		if (alpha == null) { alpha = 1; }
		g = parseInt(g * 255);
		return new Color(`rgba(${g}, ${g}, ${g}, ${alpha})`);
	}

	static gray(...args) { return this.grey(...args); }

	static toColor(color) { return new Color(color); }
	static validColorValue(color) { return color instanceof Color || (color === null); }

	static isColor(color) {
		if (_.isString(color)) {
			return this.isColorString(color);
		} else {
			return this.isColorObject(color);
		}
	}

	static isColorObject(color) { return color instanceof Color; }

	static isColorString(colorString) {
		if (_.isString(colorString)) {
			return stringToObject(colorString) !== false;
		}
		return false;
	}

	static isValidColorProperty(name, value) {
		// We check if the property name ends with color, because we don't want
		// to convert every string that looks like a Color, like the html property containing "add"
		if (_.endsWith(name.toLowerCase(), "color") && _.isString(value) && Color.isColorString(value)) {
			return true;
		}

		return false;
	}

	static equal(colorA, colorB) {

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

		if (colorA.r !== colorB.r) { return false; }
		if (colorA.g !== colorB.g) { return false; }
		if (colorA.b !== colorB.b) { return false; }
		if (colorA.a !== colorB.a) { return false; }
		return true;
	}

	static rgbToHsl(a, b, c) {
		return rgbToHsl(a, b, c);
	}
};
undefined.initClass();

// Color models, husl is default
var ColorModel = {
	RGB: "rgb",
	RGBA: "rgba",
	HSL: "hsl",
	HSLA: "hsla"
};

ColorModel.isRGB = function(colorModel) {
	if (_.isString(colorModel)) { return [ColorModel.RGB, ColorModel.RGBA].includes(colorModel.toLowerCase()); }
	return false;
};

ColorModel.isHSL = function(colorModel) {
	if (_.isString(colorModel)) { return [ColorModel.HSL, ColorModel.HSLA].includes(colorModel.toLowerCase()); }
	return false;
};

var rgbaFromHusl = function(husl) {
	let c = libhusl._conv;
	let rgb = c.xyz.rgb(c.luv.xyz(c.lch.luv(c.husl.lch([husl.h, husl.s, husl.l]))));
	let rgba = {
		r: rgb[0] * 255,
		g: rgb[1] * 255,
		b: rgb[2] * 255,
		a: husl.a
	};
	return rgba;
};

// Functions
var inputData = function(color, g, b, alpha) {
	let h, l, s;
	let rgb = {r: 0, g: 0, b: 0};
	let hsl = {h: 0, s: 0, l: 0};
	let a = 1;
	let ok = false;
	let type = ColorType.RGB;

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
				({ type } = color);
			}
		}

		if (typeof color === "object") {

			if (color.hasOwnProperty("r") || color.hasOwnProperty("g") || color.hasOwnProperty("b")) {
				rgb = rgbToRgb(color.r, color.g, color.b);

			} else if (color.hasOwnProperty("h") || color.hasOwnProperty("s") || color.hasOwnProperty("l")) {

				h = isNumeric(color.h) ? parseFloat(color.h) : 0;
				h = (h + 360) % 360;
				s = isNumeric(color.s) ? color.s : 1;
				if (_.isString(color.s)) { s = numberFromString(color.s); }
				l = isNumeric(color.l) ? color.l : 0.5;
				if (_.isString(color.l)) { l = numberFromString(color.l); }

				rgb = hslToRgb(h, s, l);
				type = ColorType.HSL;
				hsl = {
					h,
					s,
					l
				};
			}

			if (color.hasOwnProperty("a")) {
				({ a } = color);
			}
		}
	}

	a = correctAlpha(a);

	if (type !== ColorType.HSL) {
		hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
	}

	return {
		type,
		r: Math.min(255, Math.max(rgb.r, 0)),
		g: Math.min(255, Math.max(rgb.g, 0)),
		b: Math.min(255, Math.max(rgb.b, 0)),
		h: Utils.clamp(hsl.h, 0, 360),
		s: Utils.clamp(hsl.s, 0, 1),
		l: Utils.clamp(hsl.l, 0, 1),
		a
	};
};

// extract number from string
var numberFromString = string => string.match(/\d+/)[0];

// Conversion Functions
// RGB to RGB
var rgbToRgb = (r, g, b) =>
	({
		r: isNumeric(r) ? bound01(r, 255) * 255 : 0,
		g: isNumeric(g) ? bound01(g, 255) * 255 : 0,
		b: isNumeric(b) ? bound01(b, 255) * 255 : 0
	})
;

// RGB to HEX
var rgbToHex = function(r, g, b, allow3Char) {
	let hex = [
		pad2(Math.round(r).toString(16)),
		pad2(Math.round(g).toString(16)),
		pad2(Math.round(b).toString(16))
	];
	if (allow3Char && (hex[0].charAt(0) === hex[0].charAt(1)) && (hex[1].charAt(0) === hex[1].charAt(1)) && (hex[2].charAt(0) === hex[2].charAt(1))) {
		return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
	}
	return hex.join("");
};

// RGB to HSL
var rgbToHsl = function(r, g, b) {
	let l, s;
	r = bound01(r, 255);
	g = bound01(g, 255);
	b = bound01(b, 255);

	let max = Math.max(r, g, b);
	let min = Math.min(r, g, b);
	let h = s = l = (max + min) / 2;

	if (max === min) { h = s = 0;
	} else {
		let d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r: h = ((g - b) / d) + (g < b ? 6 : 0); break;
			case g: h = ((b - r) / d) + 2; break;
			case b: h = ((r - g) / d) + 4; break;
		}
		h /= 6;
	}
	return {h: h * 360, s, l};
};

// HSL to RGB
var hslToRgb = function(h, s, l) {
	let r = undefined;
	let g = undefined;
	let b = undefined;

	h = bound01(h, 360);
	s = bound01(s * 100, 100);
	l = bound01(l * 100, 100);

	let hue2rgb = function(p, q, t) {
		if (t < 0) { t += 1; }
		if (t > 1) { t -= 1; }
		if (t < (1 / 6)) { return p + ((q - p) * 6 * t); }
		if (t < (1 / 2)) { return q; }
		if (t < (2 / 3)) { return p + ((q - p) * ((2 / 3) - t) * 6); }
		return p;
	};

	if (s === 0) {
		r = g = b = l; // Achromatic

	} else {
		let q = l < 0.5 ? l * (1 + s) : (l + s) - (l * s);
		let p = (2 * l) - q;
		r = hue2rgb(p, q, h + (1 / 3));
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - (1 / 3));
	}

	return {r: r*255, g: g*255, b: b*255};
};

// Utility Functions

let convertToPercentage = function(n) {
	if (n <= 1) { n = (n * 100) + "%"; }
	return n;
};

// Ensure there's always a correct alpha value.
// If there isn't, it will be set to 1 by default.
var correctAlpha = function(a) {
	a = parseFloat(a);
	if (a < 0) { a = 0; }
	if (isNaN(a) || (a > 1)) { a = 1; }
	return a;
};

// Take input from [0, n] and return it as [0, 1]
var bound01 = function(n, max) {
	if (isOnePointZero(n)) {
		n = "100%";
	}
	let processPercent = isPercentage(n);
	n = Math.min(max, Math.max(0, parseFloat(n)));

	// Automatically convert percentage into number
	if (processPercent) {
		n = parseInt(n * max, 10) / 100;
	}
	// Handle floating point rounding errors
	if (Math.abs(n - max) < 0.000001) {
		return 1;
	}
	// Convert into [0, 1] range if it isn't already
	return (n % max) / parseFloat(max);
};


var isOnePointZero = n => (typeof n === "string") && (n.indexOf(".") !== -1) && (parseFloat(n) === 1);

// Check to see if string passed in is a percentage
var isPercentage = n => (typeof n === "string") && (n.indexOf("%") !== -1);

// Force hex to have 2 characters.
var pad2 = function(char) {
	if (char.length === 1) { return `0${char}`;
	} else { return `${char}`; }
};

// Matchers
let matchers = (function() {
	let css_integer = "[-\\+]?\\d+%?";
	let css_number = "[-\\+]?\\d*\\.\\d+%?";
	let css_unit = `(?:${css_number})|(?:${css_integer})`;

	let permissive_match3 = `[\\s|\\(]+(${css_unit})[,|\\s]+(${css_unit})[,|\\s]+(${css_unit})\\s*\\)?`;
	let permissive_match4 = `[\\s|\\(]+(${css_unit})[,|\\s]+(${css_unit})[,|\\s]+(${css_unit})[,|\\s]+(${css_unit})\\s*\\)?`;
	return {
	rgb: new RegExp(`rgb${permissive_match3}`),
	rgba: new RegExp(`rgba${permissive_match4}`),
	hsl: new RegExp(`hsl${permissive_match3}`),
	hsla: new RegExp(`hsla${permissive_match4}`),
	hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	};
})();

var isNumeric = value => !isNaN(value) && isFinite(value);

let percentToFraction = percentage => numberFromString(percentage) / 100;

var stringToObject = function(color) {
	let trimLeft = /^[\s,#]+/;
	let trimRight = /\s+$/;

	color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase();

	let named = false;

	if (cssNames[color]) {
		color = cssNames[color];
		named = true;
		({type: ColorType.NAME});

	} else if (color === "transparent") {
		return {
			r: 0,
			g: 0,
			b: 0,
			a: 0,
			type: ColorType.NAME
		};
	}

	let match = undefined;

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
	} else { return false; }
};

// CSS Colors
var cssNames = {
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
