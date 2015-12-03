{BaseClass} = require "./BaseClass"

class exports.Color extends BaseClass
	constructor: (@color, r, g, b) ->

		color = @color

		# If input already is a Color object return input
		if Color.isColor(color) then return color

		# Convert input to RGB
		rgb = inputToRGB(color, r, g, b)

		@_r = rgb.r
		@_g = rgb.g
		@_b = rgb.b
		@_a = rgb.a
		@_roundA = Math.round(100*@_a) / 100

	@define "r",
		get: -> @_r

	@define "g",
		get: -> @_g

	@define "b",
		get: -> @_b

	@define "a",
		get: -> @_a

	toHex: (allow3Char) ->
		return rgbToHex(@_r, @_g, @_b, allow3Char)

	toHexString: (allow3Char) ->
		return "#" + @toHex(allow3Char)

	toRgb: ->
		r: Math.round(@_r)
		g: Math.round(@_g)
		b: Math.round(@_b)
		a: @_a

	toRgbString: ->
		if @_a == 1 then "rgb(#{Utils.round(@_r, 0)}, #{Utils.round(@_g, 0)}, #{Utils.round(@_b, 0)})"
		else "rgba(#{Utils.round(@_r, 0)}, #{Utils.round(@_g, 0)}, #{Utils.round(@_b, 0)}, #{@_roundA})"

	toHsl: ->
		@_hsl = rgbToHsl(@_r, @_g, @_b) if @_hsl == undefined
		return { h: @_hsl.h * 360, s: @_hsl.s, l: @_hsl.l, a: @_a }

	toHusl: ->
		if @_husl == undefined
			husl = lchToHusl luvToLch xyzToLuv rgbToXyz([@r/255, @g/255, @b/255])
			@_husl = { h: husl[0], s: husl[1], l: husl[2] }

		return @_husl

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

	greyscale: ->
		hsl = @toHsl()
		return new Color(hsl).desaturate(100)

	toString: ->
		return @toRgbString()

	transparent: ->
		result = new Color
			r: @r
			g: @g
			b: @b
			a: 0

	mix: (colorB, fraction, limit = false) ->
		return Color.mix(@, colorB, fraction, limit)

	toInspect: =>
		"<#{@constructor.name} r:#{@r} g:#{@g} b:#{@b} a:#{@a}>"

	##############################################################
	## Class methods

	@mix: (colorA, colorB, fraction = .5, limit = false, model = "husl") ->

		result = null

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

			if model == "rgba" || model == "rgb"

				# rgb model
				result = new Color
					r: Utils.modulate(fraction, [0, 1], [colorA._r, colorB._r], limit)
					g: Utils.modulate(fraction, [0, 1], [colorA._g, colorB._g], limit)
					b: Utils.modulate(fraction, [0, 1], [colorA._b, colorB._b], limit)
					a: Utils.modulate(fraction, [0, 1], [colorA._a, colorB._a], limit)

			else

				hslA
				hslB

				if model == "hsl" || model == "hsla"
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

				if model == "hsl" || model == "hsla"
					# hsl model
					result = new Color
						h: tween.h
						s: tween.s
						l: tween.l
						a: tween.a
				else
					rgb = xyzToRgb luvToXyz lchToLuv huslToLch([tween.h, tween.s, tween.l])

					result = new Color
						r: rgb[0] * 255
						g: rgb[1] * 255
						b: rgb[2] * 255
						a: tween.a

		return result

	@random: (alpha = 1.0) ->
		c = -> parseInt(Math.random() * 255)
		return new Color "rgba(#{c()}, #{c()}, #{c()}, #{alpha})"

	@toColor: (color) -> return new Color(color)
	@isColor: (color) -> return color instanceof Color
	@validColorValue: (color) -> return color instanceof Color or color == null

	@isColorString: (colorString) -> stringToObject(colorString) != false

# Functions 
inputToRGB = (color, g, b, alpha) ->
	rgb = { r:0, g:0, b:0 }
	a = 1
	ok = false

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

		if typeof color == "object"

			if color.hasOwnProperty("r") or color.hasOwnProperty("g") or color.hasOwnProperty("b")
				rgb = rgbToRgb(color.r, color.g, color.b)
				ok = true

			else if color.hasOwnProperty("h") or color.hasOwnProperty("s")

				h = if isNumeric(color.h) then parseFloat(color.h) else 0
				h = (h + 360) % 360
				s = if isNumeric(color.s) then convertToPercentage(color.s) else 1
				if _.isString(color.s) then s = numberFromString(color.s)

				if color.hasOwnProperty("v")
					v = if isNumeric(color.v) then convertToPercentage(color.v) else 0
					if _.isString(color.v) then v = numberFromString(color.v)
					rgb = hsvToRgb(h, s, v)
				else
					l = if isNumeric(color.l) then convertToPercentage(color.l) else 50
					if _.isString(color.l) then l = numberFromString(color.l)
					rgb = hslToRgb(h, s, l)

				ok = true

			if color.hasOwnProperty("a")
				a = color.a
			else if color.hasOwnProperty("alpha")
				a = color.alpha

	a = correctAlpha(a)

	return {
	ok: ok
	r: Math.min(255, Math.max(rgb.r, 0))
	g: Math.min(255, Math.max(rgb.g, 0))
	b: Math.min(255, Math.max(rgb.b, 0))
	a: a
	}

#HUSL

m =
	R: [  3.2409699419045214,   -1.5373831775700935, -0.49861076029300328  ]
	G: [ -0.96924363628087983,   1.8759675015077207,  0.041555057407175613 ]
	B: [  0.055630079696993609, -0.20397695888897657, 1.0569715142428786   ]
m_inv =
	X: [ 0.41239079926595948,  0.35758433938387796, 0.18048078840183429  ]
	Y: [ 0.21263900587151036,  0.71516867876775593, 0.072192315360733715 ]
	Z: [ 0.019330818715591851, 0.11919477979462599, 0.95053215224966058  ]

refU = 0.19783000664283681
refV = 0.468319994938791

# CIE LUV constants
kappa = 903.2962962962963
epsilon = 0.0088564516790356308

# For a given lightness, return a list of 6 lines in slope-intercept
# form that represent the bounds in CIELUV, stepping over which will
# push a value out of the RGB gamut
getBounds = (L) ->
	sub1 = Math.pow(L + 16, 3) / 1560896
	sub2 = if (sub1 > epsilon) then sub1 else (L / kappa)
	ret = []
	for channel in ['R', 'G', 'B']
		[m1, m2, m3] = m[channel]
		for t in [0, 1]

			top1 = (284517 * m1 - 94839 * m3) * sub2
			top2 = (838422 * m3 + 769860 * m2 + 731718 * m1) * L * sub2 - 769860 * t * L
			bottom = (632260 * m3 - 126452 * m2) * sub2 + 126452 * t

			ret.push [top1 / bottom, top2 / bottom]
	return ret

lengthOfRayUntilIntersect = (theta, line) ->
	# theta  -- angle of ray starting at (0, 0)
	# m, b   -- slope and intercept of line
	# x1, y1 -- coordinates of intersection
	# len    -- length of ray until it intersects with line
	#
	# b + m * x1        = y1
	# len              >= 0
	# len * cos(theta)  = x1
	# len * sin(theta)  = y1
	#
	#
	# b + m * (len * cos(theta)) = len * sin(theta)
	# b = len * sin(hrad) - m * len * cos(theta)
	# b = len * (sin(hrad) - m * cos(hrad))
	# len = b / (sin(hrad) - m * cos(hrad))
	#
	[m1, b1] = line
	len = b1 / (Math.sin(theta) - m1 * Math.cos(theta))
	if len < 0
		return null
	return len

intersectLineLine = (line1, line2) ->
	(line1[1] - line2[1]) / (line2[0] - line1[0])

distanceFromPole = (point) ->
	Math.sqrt(Math.pow(point[0], 2) + Math.pow(point[1], 2))

# For given lightness, returns the maximum chroma. Keeping the chroma value
# below this number will ensure that for any hue, the color is within the RGB
# gamut.
maxSafeChromaForL = (L) ->
	lengths = []
	for [m1, b1] in getBounds L
		# x where line intersects with perpendicular running though (0, 0)
		x = intersectLineLine [m1, b1], [-1 / m1, 0]
		lengths.push distanceFromPole [x, b1 + x * m1]
	return Math.min lengths...

maxChromaForLH = (L, H) ->
	hrad = H / 360 * Math.PI * 2
	lengths = []
	for line in getBounds L
		l = lengthOfRayUntilIntersect hrad, line
		if l != null
			lengths.push l
	return Math.min lengths...

dotProduct = (a, b) ->
	ret = 0
	for i in [0..a.length-1]
		ret += a[i] * b[i]
	return ret

# Used for rgb conversions
fromLinear = (c) ->
	if c <= 0.0031308
		12.92 * c
	else
		1.055 * Math.pow(c, 1 / 2.4) - 0.055

toLinear = (c) ->
	a = 0.055
	if c > 0.04045
		Math.pow (c + a) / (1 + a), 2.4
	else
		c / 12.92

# In these formulas, Yn refers to the reference white point. We are using
# illuminant D65, so Yn (see refY in Maxima file) equals 1. The formula is
# simplified accordingly.
Y_to_L = (Y) ->
	if Y <= epsilon
		Y * kappa
	else
		116 * Math.pow(Y, 1/3) - 16
L_to_Y = (L) ->
	if L <= 8
		L / kappa
	else
		Math.pow((L + 16) / 116, 3)

xyzToRgb = (tuple) ->
	R = fromLinear dotProduct m.R, tuple
	G = fromLinear dotProduct m.G, tuple
	B = fromLinear dotProduct m.B, tuple
	return [R, G, B]

rgbToXyz = (tuple) ->
	[R, G, B] = tuple
	rgbl = [toLinear(R), toLinear(G), toLinear(B)]
	X = dotProduct m_inv.X, rgbl
	Y = dotProduct m_inv.Y, rgbl
	Z = dotProduct m_inv.Z, rgbl
	[X, Y, Z]

xyzToLuv = (tuple) ->
	[X, Y, Z] = tuple
	# Black will create a divide-by-zero error in
	# the following two lines
	if Y is 0
		return [0, 0, 0]
	L = Y_to_L(Y)
	varU = (4 * X) / (X + (15 * Y) + (3 * Z))
	varV = (9 * Y) / (X + (15 * Y) + (3 * Z))
	U = 13 * L * (varU - refU)
	V = 13 * L * (varV - refV)
	luv = [L, U, V]
	return luv

luvToXyz = (tuple) ->
	[L, U, V] = tuple
	# Black will create a divide-by-zero error
	if L is 0
		return [0, 0, 0]
	varU = U / (13 * L) + refU
	varV = V / (13 * L) + refV
	Y = L_to_Y(L)
	X = 0 - (9 * Y * varU) / ((varU - 4) * varV - varU * varV)
	Z = (9 * Y - (15 * varV * Y) - (varV * X)) / (3 * varV)
	[X, Y, Z]

luvToLch = (tuple) ->
	[L, U, V] = tuple
	C = Math.sqrt(Math.pow(U, 2) + Math.pow(V, 2))
	# Greys: disambiguate hue
	if C < 0.00000001
		H = 0
	else  
		Hrad = Math.atan2 V, U
		H = Hrad * 360 / 2 / Math.PI
		H = 360 + H if H < 0
	[L, C, H]

lchToLuv = (tuple) ->
	[L, C, H] = tuple
	Hrad = H / 360 * 2 * Math.PI
	U = Math.cos(Hrad) * C
	V = Math.sin(Hrad) * C
	[L, U, V]

huslToLch = (tuple) ->
	[H, S, L] = tuple
	# White and black: disambiguate chroma
	if L > 99.9999999 or L < 0.00000001
		C = 0
	else
		max = maxChromaForLH L, H
		C = max / 100 * S
	return [L, C, H]

lchToHusl = (tuple) ->
	[L, C, H] = tuple
	# White and black: disambiguate saturation
	if L > 99.9999999 or L < 0.00000001
		S = 0
	else
		max = maxChromaForLH L, H
		S = C / max * 100
	return [H, S, L]

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
	v = max

	d = max - min
	s = if max is 0 then 0 else d / max

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
	if n <= 1 then n = n * 100 + "%"
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
	hsv: new RegExp('hsv' + permissive_match3)
	hsva: new RegExp('hsva' + permissive_match4)
	hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/
	hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	}

isNumeric = (value) ->
	return !isNaN(value) && isFinite(value)

stringToObject = (color) ->
	trimLeft = /^[\s,#]+/
	trimRight = /\s+$/

	color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase()

	named = false

	if cssNames[color]
		color = cssNames[color]
		named = true

	else if color == "transparent"
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
		r: parseInt(match[1] + "" + match[1], 16)
		g: parseInt(match[2] + "" + match[2], 16)
		b: parseInt(match[3] + "" + match[3], 16)
		}
	else return false

# CSS Colors 
cssNames = {aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"}
