
{BaseClass} = require "./BaseClass"

class exports.Color extends BaseClass
	constructor: (@color) ->

		color = @color

		# If input is already a Color object, return itself
		if (color instanceof Color) then return color

		# Convert input to RGB
		rgb = inputToRGB(color)

		@_r = rgb.r
		@_g = rgb.g
		@_b = rgb.b
		@_a = rgb.a
		@_roundA = Math.round(100*@_a) / 100

	toHex: (allow3Char) ->
		return rgbToHex(@_r, @_g, @_b, allow3Char)

	toHexString: (allow3Char) ->
		return '#' + @toHex(allow3Char)

	toRgb: ->
		r: Math.round(@_r)
		g: Math.round(@_g)
		b: Math.round(@_b)
		a: @_a

	toRgbString: ->
		if @_a == 1 then "rgb(#{Utils.round(@_r, 0)}, #{Utils.round(@_g, 0)}, #{Utils.round(@_b, 0)})"
		else "rgba(#{Utils.round(@_r, 0)}, #{Utils.round(@_g, 0)}, #{Utils.round(@_b, 0)}, #{@_roundA})"

	toHsl: ->
		hsl = rgbToHsl(@_r, @_g, @_b)
		return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: @_a }

	toHslString: ->
		hsl = rgbToHsl(@_r, @_g, @_b)
		h = Math.round(hsl.h * 360)
		s = Math.round(hsl.s * 100)
		l = Math.round(hsl.l * 100)
		if @_a == 1 then "hsl(#{h}, #{s}%, #{l}%)"
		else "hsl(#{h}, #{s}%, #{l}%, #{@_roundA})"

	toName: ->
		if @_a is 0 then return "transparent"
		if @_a < 1 then return false
		return cssNames[rgbToHex(@_r, @_g, @_b, @)] or false

	setAlpha: (value) ->
		@_a = boundAlpha(value)
		@_roundA = Math.round(100*@_a) / 100
		return @

	lighten: (amount) ->
		hsl = @toHsl()
		print hsl
		hsl.l += amount / 100
		hsl.l = Math.min(1, Math.max(0, hsl.l))
		return new Color(hsl).toRgbString()

	brighten: (amount) ->
		rgb = @toRgb()
		rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))))
		rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))))
		rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))))
		return new Color(rgb).toRgbString()

	darken: (amount) ->
		hsl = @toHsl()
		hsl.l -= amount / 100
		hsl.l = Math.min(1, Math.max(0, hsl.l))
		return new Color(hsl).toRgbString()

	desaturate: (amount) ->
		hsl = @toHsl()
		hsl.s -= amount / 100
		hsl.s = Math.min(1, Math.max(0, hsl.s))
		new Color(hsl).toRgbString()

	saturate: (amount) ->
		hsl = @toHsl()
		hsl.s += amount / 100
		hsl.s = Math.min(1, Math.max(0, hsl.s))
		return new Color(hsl).toRgbString()

	greyscale: ->
		return new Color(hsl).desaturate(100).toRgbString()

	toString: ->
		return @toRgbString()

	@toColor: (color) -> return new Color(color)
	@isColor: (color) -> return color instanceof Color

# Functions 
inputToRGB = (color) ->
	rgb = { r:0, g:0, b:0 }
	a = 1
	ok = false

	if typeof color == 'string'
		color = stringToObject(color)

	if typeof color == 'object'
		if color.hasOwnProperty('r') and color.hasOwnProperty('g') and color.hasOwnProperty('b')
			rgb = rgbToRgb(color.r, color.g, color.b)
			ok = true

		else if color.hasOwnProperty('h') and color.hasOwnProperty('s') and color.hasOwnProperty('v')
			color.s = convertToPercentage(color.s)
			color.v = convertToPercentage(color.v)
			rgb = hsvToRgb(color.h, color.s, color.v)
			ok = true

		else if color.hasOwnProperty('h') and color.hasOwnProperty('s') and color.hasOwnProperty('l')
			color.s = convertToPercentage(color.s)
			color.l = convertToPercentage(color.l)
			rgb = hslToRgb(color.h, color.s, color.l)
			ok = true

		if color.hasOwnProperty('a')
			a = color.a

	a = correctAlpha(a)

	return {
	ok: ok
	r: Math.min(255, Math.max(rgb.r, 0))
	g: Math.min(255, Math.max(rgb.g, 0))
	b: Math.min(255, Math.max(rgb.b, 0))
	a: a
	}

# Conversion Functions
# RGB to RGB
rgbToRgb = (r, g, b) ->
	r: bound01(r, 255) * 255
	g: bound01(g, 255) * 255
	b: bound01(b, 255) * 255

# RGB to HEX
rgbToHex = (r, g, b, allow3Char) ->
	hex = [
		pad2(Math.round(r).toString(16))
		pad2(Math.round(g).toString(16))
		pad2(Math.round(b).toString(16))
	]
	if allow3Char and hex[0].charAt(0) == hex[0].charAt(1) and hex[1].charAt(0) == hex[1].charAt(1) and hex[2].charAt(0) == hex[2].charAt(1)
		return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0)
	hex.join ''

# RGB to HSL
rgbToHsl = (r, g, b) ->
	r = bound01(r, 255)
	g = bound01(g, 255)
	b = bound01(b, 255)

	max = Math.max(r, g, b)
	min = Math.min(r, g, b)
	h = s = l = (max + min) / 2

	if max == min then h = s = 0
	else
		d = max - min
		s = if l > 0.5 then d / (2 - max - min) else d / (max + min)
		switch max
			when r then h = (g - b) / d + (if g < b then 6 else 0)
			when g then h = (b - r) / d + 2
			when b then h = (r - g) / d + 4
		h /= 6
	return { h:h, s:s, l:l }

# HSL to RGB
hslToRgb = (h, s, l) ->
	r = undefined
	g = undefined
	b = undefined

	h = bound01(h, 360)
	s = bound01(s, 100)
	l = bound01(l, 100)

	hue2rgb = (p, q, t) ->
		if t < 0 then t += 1
		if t > 1 then t -= 1
		if t < 1 / 6 then return p + (q - p) * 6 * t
		if t < 1 / 2 then return q
		if t < 2 / 3 then return p + (q - p) * (2 / 3 - t) * 6
		return p

	if s == 0
		r = g = b = l # Achromatic

	else
		q = if l < 0.5 then l * (1 + s) else l + s - l * s
		p = 2 * l - q
		r = hue2rgb(p, q, h + 1 / 3)
		g = hue2rgb(p, q, h)
		b = hue2rgb(p, q, h - (1 / 3))

	return { r:r*255, g:g*255, b:b*255 }

# RGB to HSV
rgbToHsv = (r, g, b) ->
	r = bound01(r, 255);
	g = bound01(g, 255);
	b = bound01(b, 255);

	max = mathMax(r, g, b)
	min = mathMin(r, g, b)
	h
	s
	v = max

	d = max - min
	s = max is 0 ? 0 : d / max

	if(max == min)
		h = 0  # achromatic
	else
		h = switch(max)
			when r then (g - b) / d + (g < b ? 6 : 0)
			when g then (b - r) / d + 2
			when b then (r - g) / d + 4
		h /= 6;

	h: h, s: s, v: v

# HSV to RGB
hsvToRgb = (h, s, v) ->

	h = bound01(h, 360) * 6;
	s = bound01(s, 100);
	v = bound01(v, 100);

	i = Math.floor(h)
	f = h - i
	p = v * (1 - s)
	q = v * (1 - f * s)
	t = v * (1 - (1 - f) * s)
	mod = i % 6
	r = [v, q, p, p, t, v][mod]
	g = [t, v, v, q, p, p][mod]
	b = [p, p, t, v, v, q][mod]

	return { r: r * 255, g: g * 255, b: b * 255 }

# Utility Functions
boundAlpha = (a) ->
	a = parseFloat(a)
	if isNaN(a) or a < 0 or a > 1 then a = 1
	return a

convertToPercentage = (n) ->
	if n <= 1 then n = n * 100 + '%'
	return n

# Ensure there's always a correct alpha value.
# If there isn't, it will be set to 1 by default.
correctAlpha = (a) ->
	a = parseFloat(a)
	if isNaN(a) or a < 0 or a > 1 then a = 1
	return a

# Take input from [0, n] and return it as [0, 1]
bound01 = (n, max) ->
	if isOnePointZero(n)
		n = '100%'
	processPercent = isPercentage(n)
	n = Math.min(max, Math.max(0, parseFloat(n)))

	# Automatically convert percentage into number
	if processPercent
		n = parseInt(n * max, 10) / 100
	# Handle floating point rounding errors
	if Math.abs(n - max) < 0.000001
		return 1
	# Convert into [0, 1] range if it isn't already
	n % max / parseFloat(max)


isOnePointZero = (n) ->
	return typeof n == 'string' and n.indexOf('.') != -1 and parseFloat(n) == 1

# Check to see if string passed in is a percentage
isPercentage = (n) ->
	return typeof n == 'string' and n.indexOf('%') != -1

# Force hex to have 2 characters.
pad2 = (char) ->
	if char.length == 1 then '0' + char
	else '' + char

# Matchers
matchers = do ->
	css_integer = '[-\\+]?\\d+%?'
	css_number = "[-\\+]?\\d*\\.\\d+%?"
	css_unit = "(?:" + css_number + ")|(?:" + css_integer + ")"

	permissive_match3 = '[\\s|\\(]+(' + css_unit + ')[,|\\s]+(' + css_unit + ')[,|\\s]+(' + css_unit + ')\\s*\\)?'
	permissive_match4 = '[\\s|\\(]+(' + css_unit + ')[,|\\s]+(' + css_unit + ')[,|\\s]+(' + css_unit + ')[,|\\s]+(' + css_unit + ')\\s*\\)?'
	return {
	rgb: new RegExp('rgb' + permissive_match3)
	rgba: new RegExp('rgba' + permissive_match4)
	hsl: new RegExp('hsl' + permissive_match3)
	hsla: new RegExp('hsla' + permissive_match4)
	hsv: new RegExp('hsv' + permissive_match3)
	hsva: new RegExp('hsva' + permissive_match4)
	hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/
	hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	}

stringToObject = (color) ->
	trimLeft = /^[\s,#]+/
	trimRight = /\s+$/

	color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase()

	named = false

	if cssNames[color]
		color = cssNames[color]
		named = true

	else if color == 'transparent'
		return { r:0, g:0, b:0, a:0 }

	match = undefined

	if match = matchers.rgb.exec(color)
		return {
		r: match[1]
		g: match[2]
		b: match[3]
		}

	if match = matchers.rgba.exec(color)
		return {
		r: match[1]
		g: match[2]
		b: match[3]
		a: match[4]
		}

	if match = matchers.hsl.exec(color)
		return {
		h: match[1]
		s: match[2]
		l: match[3]
		}

	if match = matchers.hsla.exec(color)
		return {
		h: match[1]
		s: match[2]
		l: match[3]
		a: match[4]
		}

	if match = matchers.hsv.exec(color)
		return {
		h: match[1]
		s: match[2]
		v: match[3]
		}

	if match = matchers.hsva.exec(color)
		return {
		h: match[1]
		s: match[2]
		v: match[3]
		a: match[4]
		}
	if match = matchers.hex6.exec(color) or match = matchers.hex6.exec(cssNames[color])
		return {
		r: parseInt(match[1], 16)
		g: parseInt(match[2], 16)
		b: parseInt(match[3], 16)
		a: 1
		}

	if match = matchers.hex3.exec(color) or match = matchers.hex3.exec(cssNames[color])
		return {
		r: parseInt(match[1] + '' + match[1], 16)
		g: parseInt(match[2] + '' + match[2], 16)
		b: parseInt(match[3] + '' + match[3], 16)
		}
	else return false

# CSS Colors 
cssNames = {aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"}
