{_} = require "./Underscore"
{Session} = require "./Session"

Utils = {}

Utils.reset = ->
	Utils.domComplete ->

		for layer in Session._LayerList
			layer.removeAllListeners()

		Session._LayerList = []
		Session._RootElement?.innerHTML = ""

		if Session._delayTimers
			for delayTimer in Session._delayTimers
				clearTimeout delayTimer
			Session._delayTimers = []

		if Session._delayIntervals
			for delayInterval in Session._delayIntervals
				clearInterval delayInterval
			Session._delayIntervals = []

Utils.getValue = (value) ->
	return value() if _.isFunction value
	return value

Utils.setDefaultProperties = (obj, defaults, warn=true) ->

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

Utils.valueOrDefault = (value, defaultValue) ->

	if value in [undefined, null]
		value = defaultValue

	return value

Utils.arrayToObject = (arr) ->
	obj = {}

	for item in arr
		obj[item[0]] = item[1]

	obj

Utils.arrayNext = (arr, item) ->
	arr[arr.indexOf(item) + 1] or _.first arr

Utils.arrayPrev = (arr, item) ->
	arr[arr.indexOf(item) - 1] or _.last arr


######################################################
# ANIMATION

# This is a little hacky, but I want to avoid wrapping the function
# in another one as it gets called at 60 fps. So we make it a global.
window.requestAnimationFrame ?= window.webkitRequestAnimationFrame
window.requestAnimationFrame ?= (f) -> Utils.delay 1/60, f

######################################################
# TIME FUNCTIONS

# Note: in Framer 3 we try to keep all times in seconds

# Used by animation engine, needs to be very performant
Utils.getTime = -> Date.now() / 1000

# This works only in chrome, but we only use it for testing
# if window.performance
# 	Utils.getTime = -> performance.now() / 1000

Utils.delay = (time, f) ->
	timer = setTimeout f, time * 1000
	Session._delayTimers ?= []
	Session._delayTimers.push timer
	return timer
	
Utils.interval = (time, f) ->
	timer = setInterval f, time * 1000
	Session._delayIntervals ?= []
	Session._delayIntervals.push timer
	return timer

Utils.debounce = (threshold=0.1, fn, immediate) ->
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

Utils.throttle = (delay, fn) ->
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

Utils.randomColor = (alpha = 1.0) ->
	c = -> parseInt(Math.random() * 255)
	"rgba(#{c()}, #{c()}, #{c()}, #{alpha})"

Utils.randomChoice = (arr) ->
	arr[Math.floor(Math.random() * arr.length)]

Utils.randomNumber = (a=0, b=1) ->
	# Return a random number between a and b
	Utils.mapRange Math.random(), 0, 1, a, b

Utils.labelLayer = (layer, text, style={}) ->
	
	style = _.extend
		font: "10px/1em Menlo"
		lineHeight: "#{layer.height}px"
		textAlign: "center"
		color: "#fff"
	, style

	layer.style = style
	layer.html = text

Utils.uuid = ->

	chars = "0123456789abcdefghijklmnopqrstuvwxyz".split("")
	output = new Array(36)
	random = 0

	for digit in [1..32]
		random = 0x2000000 + (Math.random() * 0x1000000) | 0 if (random <= 0x02)
		r = random & 0xf
		random = random >> 4
		output[digit] = chars[if digit == 19 then (r & 0x3) | 0x8 else r]

	output.join ""

Utils.arrayFromArguments = (args) ->

	# Convert an arguments object to an array
	
	if _.isArray args[0]
		return args[0]
	
	Array.prototype.slice.call args

Utils.cycle = ->
	
	# Returns a function that cycles through a list of values with each call.
	
	args = Utils.arrayFromArguments arguments
	
	curr = -1
	return ->
		curr++
		curr = 0 if curr >= args.length
		return args[curr]

# Backwards compatibility
Utils.toggle = Utils.cycle


######################################################
# ENVIROMENT FUNCTIONS

Utils.isWebKit = ->
	window.WebKitCSSMatrix isnt null
	
Utils.isTouch = ->
	window.ontouchstart is null

Utils.isMobile = ->
	(/iphone|ipod|android|ie|blackberry|fennec/).test \
		navigator.userAgent.toLowerCase()

Utils.isChrome = ->
	(/chrome/).test \
		navigator.userAgent.toLowerCase()

Utils.isLocal = ->
	Utils.isLocalUrl window.location.href

Utils.isLocalUrl = (url) ->
	url[0..6] == "file://"

Utils.devicePixelRatio = ->
	window.devicePixelRatio

Utils.pathJoin = ->
	Utils.arrayFromArguments(arguments).join("/")

######################################################
# MATH FUNCTIONS
		
Utils.round = (value, decimals) ->
	d = Math.pow 10, decimals
	Math.round(value * d) / d

# Taken from http://jsfiddle.net/Xz464/7/
# Used by animation engine, needs to be very performant
Utils.mapRange = (value, fromLow, fromHigh, toLow, toHigh) ->
	toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow))

# Kind of similar as above but with a better syntax and a limiting option
Utils.modulate = (value, rangeA, rangeB, limit=false) ->
	
	[fromLow, fromHigh] = rangeA
	[toLow, toHigh] = rangeB
	
	result = toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow))

	if limit is true
		return toLow if result < toLow
		return toHigh if result > toHigh

	result



######################################################
# STRING FUNCTIONS

Utils.parseFunction = (str) ->

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

Utils.domComplete = (f) ->
	if document.readyState is "complete"
		f()
	else
		__domComplete.push f

Utils.domCompleteCancel = (f) ->
	__domComplete = _.without __domComplete, f

Utils.domLoadScript = (url, callback) ->
	
	script = document.createElement "script"
	script.type = "text/javascript"
	script.src = url
	
	script.onload = callback
	
	head = document.getElementsByTagName("head")[0]
	head.appendChild script
	
	script

Utils.domLoadData = (path, callback) ->

	request = new XMLHttpRequest()

	# request.addEventListener "progress", updateProgress, false
	# request.addEventListener "abort", transferCanceled, false
	
	request.addEventListener "load", ->
		callback null, request.responseText
	, false
	
	request.addEventListener "error", ->
		callback true, null
	, false

	request.open "GET", path, true
	request.send null

Utils.domLoadJSON = (path, callback) ->
	Utils.domLoadData path, (err, data) ->
		callback err, JSON.parse data

Utils.domLoadDataSync = (path) ->

	request = new XMLHttpRequest()
	request.open "GET", path, false

	# This does not work in Safari, see below
	try
		request.send null
	catch e
		console.debug "XMLHttpRequest.error", e

	data = request.responseText

	# Because I can't catch the actual 404 with Safari, I just assume something
	# went wrong if there is no text data returned from the request.
	if not data
		throw Error "Utils.domLoadDataSync: no data was loaded (url not found?)"

	return request.responseText

Utils.domLoadJSONSync = (path) ->
	JSON.parse Utils.domLoadDataSync path

Utils.domLoadScriptSync = (path) ->
	scriptData = Utils.domLoadDataSync path
	eval scriptData
	scriptData

######################################################
# GEOMERTY FUNCTIONS

# Point

Utils.pointMin = ->
	points = Utils.arrayFromArguments arguments
	point = 
		x: _.min point.map (size) -> size.x
		y: _.min point.map (size) -> size.y

Utils.pointMax = ->
	points = Utils.arrayFromArguments arguments
	point = 
		x: _.max point.map (size) -> size.x
		y: _.max point.map (size) -> size.y

Utils.pointDistance = (pointA, pointB) ->
	distance =
		x: Math.abs(pointB.x - pointA.x)
		y: Math.abs(pointB.y - pointA.y)

Utils.pointInvert = (point) ->
	point =
		x: 0 - point.x
		y: 0 - point.y

Utils.pointTotal = (point) ->
	point.x + point.y

Utils.pointAbs = (point) ->
	point =
		x: Math.abs point.x
		y: Math.abs point.y

Utils.pointInFrame = (point, frame) ->
	return false  if point.x < frame.minX or point.x > frame.maxX
	return false  if point.y < frame.minY or point.y > frame.maxY
	true

# Size

Utils.sizeMin = ->
	sizes = Utils.arrayFromArguments arguments
	size  =
		width:  _.min sizes.map (size) -> size.width
		height: _.min sizes.map (size) -> size.height

Utils.sizeMax = ->
	sizes = Utils.arrayFromArguments arguments
	size  =
		width:  _.max sizes.map (size) -> size.width
		height: _.max sizes.map (size) -> size.height

# Frames

# min mid max * x, y

Utils.frameGetMinX = (frame) -> frame.x
Utils.frameSetMinX = (frame, value) -> frame.x = value

Utils.frameGetMidX = (frame) -> 
	if frame.width is 0 then 0 else frame.x + (frame.width / 2.0)
Utils.frameSetMidX = (frame, value) ->
	frame.x = if frame.width is 0 then 0 else value - (frame.width / 2.0)

Utils.frameGetMaxX = (frame) -> 
	if frame.width is 0 then 0 else frame.x + frame.width
Utils.frameSetMaxX = (frame, value) ->
	frame.x = if frame.width is 0 then 0 else value - frame.width

Utils.frameGetMinY = (frame) -> frame.y
Utils.frameSetMinY = (frame, value) -> frame.y = value

Utils.frameGetMidY = (frame) -> 
	if frame.height is 0 then 0 else frame.y + (frame.height / 2.0)
Utils.frameSetMidY = (frame, value) ->
	frame.y = if frame.height is 0 then 0 else value - (frame.height / 2.0)

Utils.frameGetMaxY = (frame) -> 
	if frame.height is 0 then 0 else frame.y + frame.height
Utils.frameSetMaxY = (frame, value) ->
	frame.y = if frame.height is 0 then 0 else value - frame.height


Utils.frameSize = (frame) ->
	size =
		width: frame.width
		height: frame.height

Utils.framePoint = (frame) ->
	point =
		x: frame.x
		y: frame.y

Utils.frameMerge = ->

	# Return a frame that fits all the input frames

	frames = Utils.arrayFromArguments arguments

	frame =
		x: _.min frames.map Utils.frameGetMinX
		y: _.min frames.map Utils.frameGetMinY

	frame.width  = _.max(frames.map Utils.frameGetMaxX) - frame.x
	frame.height = _.max(frames.map Utils.frameGetMaxY) - frame.y

	frame

# Coordinate system

Utils.convertPoint = (input, layerA, layerB) ->

	# Convert a point between two layer coordinate systems

	point = {}

	for k in ["x", "y", "width", "height"]
		point[k] = input[k]

	superLayersA = layerA?.superLayers() or []
	superLayersB = layerB?.superLayers() or []
	
	superLayersB.push layerB if layerB
	
	for layer in superLayersA
		point.x += layer.x - layer.scrollFrame.x
		point.y += layer.y - layer.scrollFrame.y

	for layer in superLayersB
		point.x -= layer.x + layer.scrollFrame.x
		point.y -= layer.y + layer.scrollFrame.y
	
	return point

_.extend exports, Utils

