{_} = require "./Underscore"
{BaseClass} = require "./BaseClass"
libhusl		= require "husl"

# the Color class is inspired by TinyColor https://github.com/bgrins/TinyColor

ColorType =
	RGB: "rgb"
	HSL: "hsl"
	HEX: "hex"
	NAME: "name"

class exports.Color extends BaseClass
	constructor: (@color, r, g, b) ->

		if @color == ""
			@color = null

		color = @color

		# If input already is a Color object return input
		if Color.isColorObject(color) then return color

		# Convert input to RGB
		input = inputData(color, r, g, b)

		@_type = input.type
		@_r = input.r
		@_g = input.g
		@_b = input.b
		@_a = input.a
		@_h = input.h
		@_s = input.s
		@_l = input.l
		@_roundA = Math.round(100*@_a) / 100

	@define "r",
		get: -> @_r

	@define "g",
		get: -> @_g

	@define "b",
		get: -> @_b

	@define "a",
		get: -> @_a

	@define "h",
		get: -> @_h

	@define "s",
		get: -> @_s

	@define "l",
		get: -> @_l

	toHex: (allow3Char) ->
		return rgbToHex(@_r, @_g, @_b, allow3Char)

	toHexString: (allow3Char) ->
		return "#" + @toHex(allow3Char)

	toRgb: ->
		if @_rgb == undefined
			@_rgb =
				r: Math.round(@_r)
				g: Math.round(@_g)
				b: Math.round(@_b)
				a: @_a
		return _.clone(@_rgb)

	toRgbString: ->
		if @_a == 1 then "rgb(#{Utils.round(@_r, 0)}, #{Utils.round(@_g, 0)}, #{Utils.round(@_b, 0)})"
		else "rgba(#{Utils.round(@_r, 0)}, #{Utils.round(@_g, 0)}, #{Utils.round(@_b, 0)}, #{@_roundA})"

	toHsl: ->
		if @_hsl == undefined
			@_hsl =
				h: @h
				s: @s
				l: @l
				a: @a
		return _.clone(@_hsl)

	toHusl: ->
		if @_husl == undefined
			c = libhusl._conv
			husl = c.lch.husl c.luv.lch c.xyz.luv c.rgb.xyz([@r/255, @g/255, @b/255])
			@_husl = { h: husl[0], s: husl[1], l: husl[2] }

		return _.clone(@_husl)

	toHslString: ->
		if @_hslString == undefined
			hsl = @toHsl()
			h = Math.round(hsl.h)
			s = Math.round(hsl.s * 100)
			l = Math.round(hsl.l * 100)
			if @_a == 1
				@_hslString = "hsl(#{h}, #{s}%, #{l}%)"
			else
				@_hslString = "hsla(#{h}, #{s}%, #{l}%, #{@_roundA})"
		return @_hslString

	toName: ->
		if @_a is 0 then return "transparent"
		if @_a < 1 then return false
		hex = rgbToHex(@_r, @_g, @_b, true)

		for key in _.keys cssNames
			value = cssNames[key]
			if value == hex
				return key

		return false

	lighten: (amount = 10) ->
		hsl = @toHsl()
		hsl.l += amount / 100
		hsl.l = Math.min(1, Math.max(0, hsl.l))
		return new Color(hsl)

	brighten: (amount = 10) ->
		rgb = @toRgb()
		rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))))
		rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))))
		rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))))
		return new Color(rgb)

	darken: (amount = 10) ->
		hsl = @toHsl()
		hsl.l -= amount / 100
		hsl.l = Math.min(1, Math.max(0, hsl.l))
		return new Color(hsl)

	desaturate: (amount = 10) ->
		hsl = @toHsl()
		hsl.s -= amount / 100
		hsl.s = Math.min(1, Math.max(0, hsl.s))
		new Color(hsl)

	saturate: (amount = 10) ->
		hsl = @toHsl()
		hsl.s += amount / 100
		hsl.s = Math.min(1, Math.max(0, hsl.s))
		return new Color(hsl)

	grayscale: ->
		hsl = @toHsl()
		return new Color(hsl).desaturate(100)

	toString: ->
		return @toRgbString()

	alpha: (alpha = 1) ->
		result = new Color
			r: @r
			g: @g
			b: @b
			a: alpha

	transparent: ->
		@alpha(0)

	mix: (colorB, fraction, limit = false, model) ->
		return Color.mix(@, colorB, fraction, limit, model)

	copy: ->
		return new Color(@)

	isEqual: (colorB) ->
		return Color.equal(@, colorB)

	toInspect: =>
		if @_type == ColorType.HSL
			return "<#{@constructor.name} h:#{@h} s:#{@s} l:#{@l} a:#{@a}>"
		else if @_type == ColorType.HEX || @_type == ColorType.NAME
			return "<#{@constructor.name} \"#{@color}\">"
		else
			return "<#{@constructor.name} r:#{@r} g:#{@g} b:#{@b} a:#{@a}>"

	##############################################################
	## Class methods

	@mix: (colorA, colorB, fraction = .5, limit = false, model) ->

		result = null

		#
		if typeof colorA is "string" and @isColorString(colorA)
			colorA = new Color colorA
		if typeof colorB is "string" and @isColorString(colorB)
			colorB = new Color colorB

		if colorA not instanceof Color and colorB instanceof Color
			colorA = colorB.transparent()
		else if colorA instanceof Color and colorA._a == 0 and colorB instanceof Color and colorB._a != 0
			colorA = colorB.transparent()
		else if colorB not instanceof Color and colorA instanceof Color
			colorB = colorA.transparent()
		else if colorB instanceof Color and colorB._a == 0 and colorA instanceof Color and colorA._a != 0
			colorB = colorA.transparent()

		if colorB instanceof Color

			if ColorModel.isRGB(model)

				# rgb model
				result = new Color
					r: Utils.modulate(fraction, [0, 1], [colorA._r, colorB._r], limit)
					g: Utils.modulate(fraction, [0, 1], [colorA._g, colorB._g], limit)
					b: Utils.modulate(fraction, [0, 1], [colorA._b, colorB._b], limit)
					a: Utils.modulate(fraction, [0, 1], [colorA._a, colorB._a], limit)

			else

				hslA
				hslB

				if ColorModel.isHSL(model)
					# hsl model
					hslA = colorA.toHsl()
					hslB = colorB.toHsl()
				else
					# husl model
					hslA = colorA.toHusl()
					hslB = colorB.toHusl()

				if hslA.s == 0
					hslA.h = hslB.h
				else if hslB.s == 0
					hslB.h = hslA.h

				fromH = hslA.h
				toH = hslB.h
				deltaH = toH - fromH

				if deltaH > 180
					deltaH = (toH - 360) - fromH
				else if deltaH < -180
					deltaH = (toH + 360) - fromH

				tween =
					h: Utils.modulate(fraction, [0, 1], [fromH, fromH + deltaH], limit)
					s: Utils.modulate(fraction, [0, 1], [hslA.s, hslB.s], limit)
					l: Utils.modulate(fraction, [0, 1], [hslA.l, hslB.l], limit)
					a: Utils.modulate(fraction, [0, 1], [colorA.a, colorB.a], limit)

				if ColorModel.isHSL(model)
					# hsl model
					result = new Color tween
				else
					# husl model
					result = new Color rgbaFromHusl(tween)

		return result

	@random: (alpha = 1.0) ->
		c = -> parseInt(Math.random() * 255)
		return new Color "rgba(#{c()}, #{c()}, #{c()}, #{alpha})"

	@grey: (g = 0.5, alpha = 1) ->
		g = parseInt(g * 255)
		return new Color "rgba(#{g}, #{g}, #{g}, #{alpha})"

	@gray: (args...) -> @grey(args...)

	@toColor: (color) -> return new Color(color)
	@validColorValue: (color) -> return color instanceof Color or color == null

	@isColor: (color) ->
		if _.isString(color)
			return @isColorString(color)
		else
			return @isColorObject(color)

	@isColorObject: (color) -> return color instanceof Color

	@isColorString: (colorString) ->
		if _.isString(colorString)
			return stringToObject(colorString) != false
		return false

	@equal: (colorA, colorB) ->

		if !@validColorValue(colorA)
			if !Color.isColorString(colorA)
				return false

		if !@validColorValue(colorB)
			if !Color.isColorString(colorB)
				return false

		colorA = new Color(colorA)
		colorB = new Color(colorB)

		return false if colorA.r isnt colorB.r
		return false if colorA.g isnt colorB.g
		return false if colorA.b isnt colorB.b
		return false if colorA.a isnt colorB.a
		return true

	@rgbToHsl: (a, b, c) ->
		return rgbToHsl(a, b, c)

# Color models, husl is default
ColorModel =
	RGB: "rgb"
	RGBA: "rgba"
	HSL: "hsl"
	HSLA: "hsla"

ColorModel.isRGB = (colorModel) ->
	return colorModel.toLowerCase() in [ColorModel.RGB, ColorModel.RGBA] if _.isString(colorModel)
	return false

ColorModel.isHSL = (colorModel) ->
	return colorModel.toLowerCase() in [ColorModel.HSL, ColorModel.HSLA] if _.isString(colorModel)
	return false

rgbaFromHusl = (husl) ->
	c = libhusl._conv
	rgb = c.xyz.rgb c.luv.xyz c.lch.luv c.husl.lch([husl.h, husl.s, husl.l])
	rgba =
		r: rgb[0] * 255
		g: rgb[1] * 255
		b: rgb[2] * 255
		a: husl.a
	return rgba

# Functions
inputData = (color, g, b, alpha) ->
	rgb = { r:0, g:0, b:0 }
	hsl = { h:0, s:0, l:0 }
	a = 1
	ok = false
	type = ColorType.RGB

	if color == null
		a = 0
	else if _.isNumber(color)
		rgb.r = color

		if _.isNumber(g)
			rgb.g = g
		if _.isNumber(b)
			rgb.b = b
		if _.isNumber(alpha)
			a = alpha
	else

		if typeof color == "string"
			color = stringToObject(color)

			if !color
				color =
					r:0
					g:0
					b:0
					a:0

			if color.hasOwnProperty("type")
				type = color.type

		if typeof color == "object"

			if color.hasOwnProperty("r") or color.hasOwnProperty("g") or color.hasOwnProperty("b")
				rgb = rgbToRgb(color.r, color.g, color.b)

			else if color.hasOwnProperty("h") or color.hasOwnProperty("s") or color.hasOwnProperty("l")

				h = if isNumeric(color.h) then parseFloat(color.h) else 0
				h = (h + 360) % 360
				s = if isNumeric(color.s) then color.s else 1
				if _.isString(color.s) then s = numberFromString(color.s)
				l = if isNumeric(color.l) then color.l else 0.5
				if _.isString(color.l) then l = numberFromString(color.l)

				rgb = hslToRgb(h, s, l)
				type = ColorType.HSL
				hsl =
					h: h
					s: s
					l: l

			if color.hasOwnProperty("a")
				a = color.a

	a = correctAlpha(a)

	if type != ColorType.HSL
		hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

	return {
		type: type
		r: Math.min(255, Math.max(rgb.r, 0))
		g: Math.min(255, Math.max(rgb.g, 0))
		b: Math.min(255, Math.max(rgb.b, 0))
		h: Utils.clamp(hsl.h, 0, 360)
		s: Utils.clamp(hsl.s, 0, 1)
		l: Utils.clamp(hsl.l, 0, 1)
		a: a
	}

# extract number from string
numberFromString = (string) ->
	return string.match(/\d+/)[0]

# Conversion Functions
# RGB to RGB
rgbToRgb = (r, g, b) ->
	r: if isNumeric(r) then bound01(r, 255) * 255 else 0
	g: if isNumeric(g) then bound01(g, 255) * 255 else 0
	b: if isNumeric(b) then bound01(b, 255) * 255 else 0

# RGB to HEX
rgbToHex = (r, g, b, allow3Char) ->
	hex = [
		pad2(Math.round(r).toString(16))
		pad2(Math.round(g).toString(16))
		pad2(Math.round(b).toString(16))
	]
	if allow3Char and hex[0].charAt(0) == hex[0].charAt(1) and hex[1].charAt(0) == hex[1].charAt(1) and hex[2].charAt(0) == hex[2].charAt(1)
		return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0)
	hex.join ""

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
	return { h:h * 360, s:s, l:l }

# HSL to RGB
hslToRgb = (h, s, l) ->
	r = undefined
	g = undefined
	b = undefined

	h = bound01(h, 360)
	s = bound01(s * 100, 100)
	l = bound01(l * 100, 100)

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

# Utility Functions

convertToPercentage = (n) ->
	if n <= 1 then n = n * 100 + "%"
	return n

# Ensure there's always a correct alpha value.
# If there isn't, it will be set to 1 by default.
correctAlpha = (a) ->
	a = parseFloat(a)
	if a < 0 then a = 0
	if isNaN(a) or a > 1 then a = 1
	return a

# Take input from [0, n] and return it as [0, 1]
bound01 = (n, max) ->
	if isOnePointZero(n)
		n = "100%"
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
	return typeof n == "string" and n.indexOf(".") != -1 and parseFloat(n) == 1

# Check to see if string passed in is a percentage
isPercentage = (n) ->
	return typeof n == "string" and n.indexOf("%") != -1

# Force hex to have 2 characters.
pad2 = (char) ->
	if char.length == 1 then "0" + char
	else "" + char

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
	hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/
	hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	}

isNumeric = (value) ->
	return !isNaN(value) && isFinite(value)

percentToFraction = (percentage) ->
	return numberFromString(percentage) / 100

stringToObject = (color) ->
	trimLeft = /^[\s,#]+/
	trimRight = /\s+$/

	color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase()

	named = false

	if cssNames[color]
		color = cssNames[color]
		named = true
		type: ColorType.NAME

	else if color == "transparent"
		return {
			r:0
			g:0
			b:0
			a:0
			type: ColorType.NAME
		}

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
		s: percentToFraction(match[2])
		l: percentToFraction(match[3])
		}

	if match = matchers.hsla.exec(color)
		return {
		h: match[1]
		s: percentToFraction(match[2])
		l: percentToFraction(match[3])
		a: match[4]
		}

	if match = matchers.hex6.exec(color) or match = matchers.hex6.exec(cssNames[color])
		return {
		r: parseInt(match[1], 16)
		g: parseInt(match[2], 16)
		b: parseInt(match[3], 16)
		a: 1
		type: ColorType.HEX
		}

	if match = matchers.hex3.exec(color) or match = matchers.hex3.exec(cssNames[color])
		return {
		r: parseInt(match[1] + "" + match[1], 16)
		g: parseInt(match[2] + "" + match[2], 16)
		b: parseInt(match[3] + "" + match[3], 16)
		type: ColorType.HEX
		}
	else return false

# CSS Colors
cssNames =
	aliceblue:"f0f8ff"
	antiquewhite:"faebd7"
	aqua:"0ff"
	aquamarine:"7fffd4"
	azure:"f0ffff"
	beige:"f5f5dc"
	bisque:"ffe4c4"
	black:"000"
	blanchedalmond:"ffebcd"
	blue:"00f"
	blueviolet:"8a2be2"
	brown:"a52a2a"
	burlywood:"deb887"
	burntsienna:"ea7e5d"
	cadetblue:"5f9ea0"
	chartreuse:"7fff00"
	chocolate:"d2691e"
	coral:"ff7f50"
	cornflowerblue:"6495ed"
	cornsilk:"fff8dc"
	crimson:"dc143c"
	cyan:"0ff"
	darkblue:"00008b"
	darkcyan:"008b8b"
	darkgoldenrod:"b8860b"
	darkgray:"a9a9a9"
	darkgreen:"006400"
	darkgrey:"a9a9a9"
	darkkhaki:"bdb76b"
	darkmagenta:"8b008b"
	darkolivegreen:"556b2f"
	darkorange:"ff8c00"
	darkorchid:"9932cc"
	darkred:"8b0000"
	darksalmon:"e9967a"
	darkseagreen:"8fbc8f"
	darkslateblue:"483d8b"
	darkslategray:"2f4f4f"
	darkslategrey:"2f4f4f"
	darkturquoise:"00ced1"
	darkviolet:"9400d3"
	deeppink:"ff1493"
	deepskyblue:"00bfff"
	dimgray:"696969"
	dimgrey:"696969"
	dodgerblue:"1e90ff"
	firebrick:"b22222"
	floralwhite:"fffaf0"
	forestgreen:"228b22"
	fuchsia:"f0f"
	gainsboro:"dcdcdc"
	ghostwhite:"f8f8ff"
	gold:"ffd700"
	goldenrod:"daa520"
	gray:"808080"
	green:"008000"
	greenyellow:"adff2f"
	grey:"808080"
	honeydew:"f0fff0"
	hotpink:"ff69b4"
	indianred:"cd5c5c"
	indigo:"4b0082"
	ivory:"fffff0"
	khaki:"f0e68c"
	lavender:"e6e6fa"
	lavenderblush:"fff0f5"
	lawngreen:"7cfc00"
	lemonchiffon:"fffacd"
	lightblue:"add8e6"
	lightcoral:"f08080"
	lightcyan:"e0ffff"
	lightgoldenrodyellow:"fafad2"
	lightgray:"d3d3d3"
	lightgreen:"90ee90"
	lightgrey:"d3d3d3"
	lightpink:"ffb6c1"
	lightsalmon:"ffa07a"
	lightseagreen:"20b2aa"
	lightskyblue:"87cefa"
	lightslategray:"789"
	lightslategrey:"789"
	lightsteelblue:"b0c4de"
	lightyellow:"ffffe0"
	lime:"0f0"
	limegreen:"32cd32"
	linen:"faf0e6"
	magenta:"f0f"
	maroon:"800000"
	mediumaquamarine:"66cdaa"
	mediumblue:"0000cd"
	mediumorchid:"ba55d3"
	mediumpurple:"9370db"
	mediumseagreen:"3cb371"
	mediumslateblue:"7b68ee"
	mediumspringgreen:"00fa9a"
	mediumturquoise:"48d1cc"
	mediumvioletred:"c71585"
	midnightblue:"191970"
	mintcream:"f5fffa"
	mistyrose:"ffe4e1"
	moccasin:"ffe4b5"
	navajowhite:"ffdead"
	navy:"000080"
	oldlace:"fdf5e6"
	olive:"808000"
	olivedrab:"6b8e23"
	orange:"ffa500"
	orangered:"ff4500"
	orchid:"da70d6"
	palegoldenrod:"eee8aa"
	palegreen:"98fb98"
	paleturquoise:"afeeee"
	palevioletred:"db7093"
	papayawhip:"ffefd5"
	peachpuff:"ffdab9"
	peru:"cd853f"
	pink:"ffc0cb"
	plum:"dda0dd"
	powderblue:"b0e0e6"
	purple:"800080"
	rebeccapurple:"663399"
	red:"f00"
	rosybrown:"bc8f8f"
	royalblue:"4169e1"
	saddlebrown:"8b4513"
	salmon:"fa8072"
	sandybrown:"f4a460"
	seagreen:"2e8b57"
	seashell:"fff5ee"
	sienna:"a0522d"
	silver:"c0c0c0"
	skyblue:"87ceeb"
	slateblue:"6a5acd"
	slategray:"708090"
	slategrey:"708090"
	snow:"fffafa"
	springgreen:"00ff7f"
	steelblue:"4682b4"
	tan:"d2b48c"
	teal:"008080"
	thistle:"d8bfd8"
	tomato:"ff6347"
	turquoise:"40e0d0"
	violet:"ee82ee"
	wheat:"f5deb3"
	white:"fff"
	whitesmoke:"f5f5f5"
	yellow:"ff0"
	yellowgreen:"9acd32"
