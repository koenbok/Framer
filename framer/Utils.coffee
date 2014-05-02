# exports.log = ->
# 	console.log arguments.join " "

exports.setDefaultProperties = (obj, defaults, warn=true) ->

	result = {}

	for k, v of defaults
		if obj.hasOwnProperty k
			result[k] = obj[k]
		else
			result[k] = defaults[k]

	if warn
		for k, v of obj
			if not defaults.hasOwnProperty k
				console.warn "Utils.setDefaultProperties: got unexpected option: '#{k} -> #{v}'", obj

	result

exports.valueOrDefault = (value, defaultValue) ->

	if value in [undefined, null]
		value = defaultValue

	return value

exports.arrayToObject = (arr) ->
	obj = {}

	for item in arr
		obj[item[0]] = item[1]

	obj

exports.arrayNext = (arr, item) ->
	arr[arr.indexOf(item) + 1] or _.first arr

exports.arrayPrev = (arr, item) ->
	arr[arr.indexOf(item) - 1] or _.last arr


######################################################
# TIME FUNCTIONS

# Note: in Framer 3 we try to keep all times in seconds

if window.performance
	exports.getTime = -> performance.now() / 1000
else
	exports.getTime = ->  Date.now() / 1000

exports.delay = (time, f) ->
	timer = setTimeout f, time * 1000
	# window._delayTimers ?= []
	# window._delayTimers.push timer
	return timer
	
exports.interval = (time, f) ->
	timer = setInterval f, time * 1000
	# window._delayIntervals ?= []
	# window._delayIntervals.push timer
	return timer

exports.debounce = (threshold=0.1, fn, immediate) ->
	timeout = null
	threshold *= 1000
	(args...) ->
		obj = this
		delayed = ->
			fn.apply(obj, args) unless immediate
			timeout = null
		if timeout
			clearTimeout(timeout)
		else if (immediate)
			fn.apply(obj, args)
		timeout = setTimeout delayed, threshold

exports.throttle = (delay, fn) ->
	return fn if delay is 0
	delay *= 1000
	timer = false
	return ->
		return if timer
		timer = true
		setTimeout (-> timer = false), delay unless delay is -1
		fn arguments...


######################################################
# HANDY FUNCTIONS

exports.randomColor = (alpha = 1.0) ->
	c = -> parseInt(Math.random() * 255)
	"rgba(#{c()}, #{c()}, #{c()}, #{alpha})"

exports.randomChoice = (arr) ->
	arr[Math.floor(Math.random() * arr.length)]

exports.randomNumber = (a=0, b=1) ->
	# Return a random number between a and b
	exports.mapRange Math.random(), 0, 1, a, b

exports.uuid = ->

	chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('')
	output = new Array(36)
	random = 0

	for digit in [1..32]
		random = 0x2000000 + (Math.random() * 0x1000000) | 0 if (random <= 0x02)
		r = random & 0xf
		random = random >> 4
		output[digit] = chars[if digit == 19 then (r & 0x3) | 0x8 else r]

	output.join('')

exports.cycle = ->
	
	# Returns a function that cycles through a list of values with each call.
	
	if _.isArray arguments[0]
		args = arguments[0]
	else
		args = Array.prototype.slice.call arguments
	
	curr = -1
	return ->
		curr++
		curr = 0 if curr >= args.length
		return args[curr]

# Backwards compatibility
exports.toggle = exports.cycle


######################################################
# ENVIROMENT FUNCTIONS

exports.isWebKit = ->
	window.WebKitCSSMatrix isnt null
	
exports.isTouch = ->
	window.ontouchstart is null

exports.isMobile = ->
	(/iphone|ipod|android|ie|blackberry|fennec/).test \
		navigator.userAgent.toLowerCase()

exports.isChrome = ->
	(/chrome/).test \
		navigator.userAgent.toLowerCase()

exports.isLocal = ->
	window.location.href[0..6] == "file://"

exports.devicePixelRatio = ->
	window.devicePixelRatio

######################################################
# MATH FUNCTIONS
		
exports.round = (value, decimals) ->
	d = Math.pow 10, decimals
	Math.round(value * d) / d

# Taken from http://jsfiddle.net/Xz464/7/
exports.mapRange = (value, fromLow, fromHigh, toLow, toHigh) ->
	toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow))

######################################################
# STRING FUNCTIONS

exports.parseFunction = (str) ->

	result = {name: "", args: []}

	if _.endsWith str, ")"
		result.name = str.split("(")[0]
		result.args = str.split("(")[1].split(",").map (a) -> _.trim(_.rtrim(a, ")"))
	else
		result.name = str

	return result

######################################################
# DOM FUNCTIONS

__domComplete = []

if document?
	document.onreadystatechange = (event) =>
		if document.readyState is "complete"
			while __domComplete.length
				f = __domComplete.shift()()

exports.domComplete = (f) ->
	if document.readyState is "complete"
		f()
	else
		__domComplete.push f

exports.domCompleteCancel = (f) ->
	__domComplete = _.without __domComplete, f

exports.domLoadScript = (url, callback) ->
	
	script = document.createElement "script"
	script.type = "text/javascript"
	script.src = url
	
	script.onload = callback
	
	head = document.getElementsByTagName("head")[0]
	head.appendChild script
	
	script

######################################################
# GEOMERTY FUNCTIONS

exports.pointDistance = (pointA, pointB) ->
	distance =
		x: Math.abs(pointB.x - pointA.x)
		y: Math.abs(pointB.y - pointA.y)

exports.pointInvert = (point) ->
	point =
		x: 0 - point.x
		y: 0 - point.y

exports.pointTotal = (point) ->
	point.x + point.y

exports.frameSize = (frame) ->
	size =
		width: frame.width
		height: frame.height

exports.framePoint = (frame) ->
	point =
		x: frame.x
		y: frame.y

exports.pointAbs = (point) ->
	point =
		x: Math.abs point.x
		y: Math.abs point.y

exports.pointInFrame = (point, frame) ->
	return false  if point.x < frame.minX or point.x > frame.maxX
	return false  if point.y < frame.minY or point.y > frame.maxY
	true

exports.convertPoint = (point, view1, view2) ->

	# Public: Convert a point between two view coordinate systems
	#
	# point - The point to be converted
	# view1 - The origin view of the point
	# view2 - The destination view of the point
	# 
	# Returns an Object
	#

	point = _.clone point
	
	traverse = (view) ->
	
		currentView = view
		superViews = []
	
		while currentView and currentView.superView
			superViews.push currentView.superView
			currentView = currentView.superView
	
		return superViews
	
	superViews1 = traverse view1
	superViews2 = traverse view2
	
	superViews2.push view2 if view2
	
	for view in superViews1
		point.x += view.x
		point.y += view.y

		if view.scrollFrame
			point.x -= view.scrollFrame.x
			point.y -= view.scrollFrame.y

	for view in superViews2
		point.x -= view.x
		point.y -= view.y
		
		if view.scrollFrame
			point.x += view.scrollFrame.x
			point.y += view.scrollFrame.y
	
	return point

