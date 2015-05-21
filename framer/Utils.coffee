{_} = require "./Underscore"
{Screen} = require "./Screen"

Utils = {}

Utils.reset = ->
	Framer.CurrentContext.reset()

Utils.getValue = (value) ->
	return value() if _.isFunction value
	return value

Utils.getValueForKeyPath = (obj, key) ->
	result = obj
	return obj[key] if not "." in key
	result = result[key] for key in key.split(".")
	result

Utils.setValueForKeyPath = (obj, path, val) ->
	fields = path.split('.')
	result = obj
	i = 0
	n = fields.length
	while i < n and result != undefined
		field = fields[i]
		if i == n - 1
			result[field] = val
		else
			if typeof result[field] == 'undefined' or !_.isObject(result[field])
				result[field] = {}
			result = result[field]
		i++
	return

Utils.valueOrDefault = (value, defaultValue) ->

	if value in [undefined, null]
		value = defaultValue

	return value

Utils.arrayNext = (arr, item) ->
	arr[arr.indexOf(item) + 1] or _.first arr

Utils.arrayPrev = (arr, item) ->
	arr[arr.indexOf(item) - 1] or _.last arr


######################################################
# MATH

Utils.sum = (arr) -> _.reduce arr, (a, b) -> a + b
Utils.average = (arr) -> Utils.sum(arr) / arr.length
Utils.mean = Utils.average
Utils.median = (x) ->
	return null if x.length is 0

	sorted = x.slice().sort (a, b) ->
		a - b

	if sorted.length % 2 is 1
		sorted[(sorted.length - 1) / 2]
	else
		(sorted[(sorted.length / 2) - 1] + sorted[sorted.length / 2]) / 2

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
if window.performance
	Utils.getTime = -> window.performance.now() / 1000
else
	Utils.getTime = -> Date.now() / 1000

Utils.delay = (time, f) ->
	timer = setTimeout(f, time * 1000)
	Framer.CurrentContext._delayTimers.push(timer)
	return timer

Utils.interval = (time, f) ->
	timer = setInterval(f, time * 1000)
	Framer.CurrentContext._delayIntervals.push(timer)
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

# Taken from http://addyosmani.com/blog/faster-javascript-memoization/
Utils.memoize = (fn) -> ->
	args = Array::slice.call(arguments)
	hash = ""
	i = args.length
	currentArg = null
	while i--
		currentArg = args[i]
		hash += (if (currentArg is Object(currentArg)) then JSON.stringify(currentArg) else currentArg)
		fn.memoize or (fn.memoize = {})
	(if (hash of fn.memoize) then fn.memoize[hash] else fn.memoize[hash] = fn.apply(this, args))


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

Utils.defineEnum = (names = [], offset = 0, geometric = 0) ->
	Enum = {}
	for name, i in names
		j = i
		j = if ! offset    then j else j + offset
		j = if ! geometric then j else Math.pow geometric, j
		Enum[Enum[name] = j] = name
	return Enum

Utils.labelLayer = (layer, text, style={}) ->

	style = _.extend({
		font: "10px/1em Menlo"
		lineHeight: "#{layer.height}px"
		textAlign: "center"
		color: "#fff"
	}, style)

	layer.style = style
	layer.html = text

Utils.stringify = (obj) ->
	try
		return JSON.stringify obj if _.isObject obj
	catch
		""
	return "null" if obj is null
	return "undefined" if obj is undefined
	return obj.toString() if obj.toString
	return obj

Utils.inspectObjectType = (item) ->
	# This is a hacky way to get nice object names, it tries to
	# parse them from the .toString methods for objects.

	if item.constructor?.name? and item.constructor?.name != "Object"
		return item.constructor.name

	extract = (str) ->
		return null unless str
		regex = /\[object (\w+)\]/
		match = regex.exec(str)
		return match[1] if match
		return null

	className = extract(item.toString())
	return className if className
	className = extract(item.constructor?.toString())
	return className.replace("Constructor", "") if className
	return item

Utils.inspect = (item, max=5, l=0) ->

	return "null" if item is null
	return "undefined" if item is undefined

	if _.isFunction(item.toInspect)
		return item.toInspect()
	if _.isString(item)
		return "\"#{item}\""
	if _.isNumber(item)
		return "#{item}"
	if _.isFunction(item)
		code = item.toString()["function ".length..].replace(/\n/g, "").replace(/\s+/g, " ")
		# We limit the size of a function body if it's in a strucutre
		limit = 50
		code = "#{_.trimRight(code[..limit])}… }" if code.length > limit and l > 0
		return "<Function #{code}>"
	if _.isArray(item)
		return "[...]" if l > max
		return "[" + _.map(item, (i) -> Utils.inspect(i, max, l+1)).join(", ") + "]"
	if _.isObject(item)
		objectType = Utils.inspectObjectType(item)
		# We should not loop over dom trees because we will have a bad time
		return "<#{objectType}>" if /HTML\w+?Element/.test(objectType)
		if l > max
			objectInfo = "{...}"
		else
			objectInfo = "{" + _.map(item, (v, k) -> "#{k}:#{Utils.inspect(v, max, l+1)}").join(", ") + "}"
		return objectInfo if objectType is "Object"
		return "<#{objectType} #{objectInfo}>"

	return "#{item}"

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
	return args[0] if _.isArray(args[0])
	return Array.prototype.slice.call(args)

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
	window.WebKitCSSMatrix isnt undefined

Utils.webkitVersion = ->
	version = -1
	regexp = /AppleWebKit\/([\d.]+)/
	result = regexp.exec(navigator.userAgent)
	version = parseFloat(result[1]) if result
	version

Utils.isChrome = ->
	(/chrome/).test(navigator.userAgent.toLowerCase())

Utils.isSafari = ->
	(/safari/).test(navigator.userAgent.toLowerCase())

Utils.isTouch = ->
	window.ontouchstart is null

Utils.isDesktop = ->
	Utils.deviceType() is "desktop"

Utils.isPhone = ->
	Utils.deviceType() is "phone"

Utils.isTablet = ->
	Utils.deviceType() is "tablet"

Utils.isMobile = ->
	Utils.isPhone() or Utils.isTablet()

Utils.isLocal = ->
	Utils.isLocalUrl window.location.href

Utils.isLocalUrl = (url) ->
	url[0..6] == "file://"

Utils.isFramerStudio = ->
	navigator.userAgent.indexOf("FramerStudio") != -1

Utils.devicePixelRatio = ->
	window.devicePixelRatio

Utils.isJP2Supported = ->
	Utils.isWebKit() and not Utils.isChrome()

Utils.deviceType = ->

	# Taken from
	# https://github.com/jeffmcmahan/device-detective/blob/master/bin/device-detect.js

	if /(tablet)|(iPad)|(Nexus 9)/i.test(navigator.userAgent)
		return "tablet"

	if /(mobi)/i.test(navigator.userAgent)
		return "phone"

	return "desktop"


Utils.pathJoin = ->
	Utils.arrayFromArguments(arguments).join("/")

######################################################
# MATH FUNCTIONS

Utils.round = (value, decimals=0) ->
	d = Math.pow 10, decimals
	Math.round(value * d) / d

Utils.clamp = (value, min, max) ->
	value = min if value < min
	value = max if value > max
	return value

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
		if toLow < toHigh
			return toLow if result < toLow
			return toHigh if result > toHigh
		else
			return toLow if result > toLow
			return toHigh if result < toHigh

	result



######################################################
# STRING FUNCTIONS

Utils.parseFunction = (str) ->

	result = {name: "", args: []}

	if _.endsWith str, ")"
		result.name = str.split("(")[0]
		result.args = str.split("(")[1].split(",").map (a) -> _.trim(_.trimRight(a, ")"))
	else
		result.name = str

	return result

######################################################
# DOM FUNCTIONS

__domComplete = []
__domReady = false

if document?
	document.onreadystatechange = (event) =>
		if document.readyState is "complete"
			__domReady = true
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
	request.open("GET", path, false)

	# This does not work in Safari, see below
	try
		request.send(null)
	catch e
		console.debug("XMLHttpRequest.error", e)

	handleError = ->
		throw Error "Utils.domLoadDataSync: #{path} -> [#{request.status} #{request.statusText}]"

	request.onerror = handleError

	if request.status not in [200, 0]
		handleError()

	# Because I can't catch the actual 404 with Safari, I just assume something
	# went wrong if there is no text data returned from the request.
	if not request.responseText
		handleError()

	# console.log "domLoadDataSync", path
	# console.log "xhr.readyState", request.readyState
	# console.log "xhr.status", request.status
	# console.log "xhr.responseText", request.responseText

	return request.responseText

Utils.domLoadJSONSync = (path) ->
	JSON.parse Utils.domLoadDataSync path

Utils.domLoadScriptSync = (path) ->
	scriptData = Utils.domLoadDataSync path
	eval scriptData
	scriptData

Utils.insertCSS = (css) ->

	styleElement = document.createElement("style")
	styleElement.type = "text/css"
	styleElement.innerHTML = css

	Utils.domComplete ->
		document.body.appendChild(styleElement)

Utils.loadImage = (url, callback, context) ->

	# Loads a single image and calls callback.
	# The callback will be called with true if there is an error.

	element = new Image
	context ?= Framer.CurrentContext

	context.eventManager.wrap(element).addEventListener "load", (event) ->
		callback()

	context.eventManager.wrap(element).addEventListener "error", (event) ->
		callback(true)

	element.src = url

######################################################
# GEOMETRY FUNCTIONS

# Point

Utils.pointZero = (args={}) ->
	return _.defaults(args, {x:0, y:0})

Utils.pointMin = ->
	points = Utils.arrayFromArguments arguments
	point =
		x: _.min points.map (size) -> size.x
		y: _.min points.map (size) -> size.y

Utils.pointMax = ->
	points = Utils.arrayFromArguments arguments
	point =
		x: _.max points.map (size) -> size.x
		y: _.max points.map (size) -> size.y

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
	return false if point.x < Utils.frameGetMinX(frame) or point.x > Utils.frameGetMaxX(frame)
	return false if point.y < Utils.frameGetMinY(frame) or point.y > Utils.frameGetMaxY(frame)
	return true

# Size

Utils.sizeZero = (args={}) ->
	return _.defaults(args, {width:0, height:0})

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

# Rect

Utils.rectZero = (args={}) ->
	return _.defaults(args, {top:0, right:0, bottom:0, left:0})

Utils.parseRect = (args) ->
	if _.isArray(args) and _.isNumber(args[0])
		return Utils.parseRect({top:args[0]}) if args.length is 1
		return Utils.parseRect({top:args[0], right:args[1]}) if args.length is 2
		return Utils.parseRect({top:args[0], right:args[1], bottom:args[2]}) if args.length is 3
		return Utils.parseRect({top:args[0], right:args[1], bottom:args[2], left:args[3]}) if args.length is 4
	if _.isArray(args) and _.isObject(args[0])
		return args[0]
	if _.isObject(args)
		return args

	return {}

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

Utils.frameZero = (args={}) ->
	return _.defaults(args, {top:0, right:0, bottom:0, left:0})

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

Utils.framePointForOrigin = (frame, originX, originY) ->
	frame =
		x: frame.x + (originX * frame.width)
		y: frame.y + (originY * frame.height)
		width: frame.width
		height: frame.height

Utils.frameInset = (frame, inset) ->
	frame =
		x: frame.x + inset.left
		y: frame.y + inset.top
		width: frame.width - inset.left - inset.right
		height: frame.height - inset.top - inset.bottom

Utils.frameSortByAbsoluteDistance = (point, frames, originX=0, originY=0) ->
	distance = (frame) ->
		result = Utils.pointDistance(point, Utils.framePointForOrigin(frame, originX, originY))
		result = Utils.pointAbs(result)
		result = Utils.pointTotal(result)
		result

	return frames.sort (a, b) -> distance(a) - distance(b)

Utils.pointInPolygon = (point, vs) ->
	# ray-casting algorithm based on
	# http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	x = point[0]
	y = point[1]
	inside = false
	i = 0
	j = vs.length - 1
	while i < vs.length
		xi = vs[i][0]
		yi = vs[i][1]
		xj = vs[j][0]
		yj = vs[j][1]
		intersect = yi > y != yj > y and x < (xj - xi) * (y - yi) / (yj - yi) + xi
		if intersect
			inside = !inside
		j = i++
	inside

Utils.pointAngle = (p1, p2) ->
	Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;


# Coordinate system

Utils.convertPoint = (input, layerA, layerB, context=false) ->

	# Convert a point between two layer coordinate systems

	point = _.defaults(input, {x:0, y:0})

	superLayersA = layerA?.superLayers(context) or []
	superLayersB = layerB?.superLayers(context) or []

	superLayersB.push(layerB) if layerB

	for layer in superLayersA
		point.x += layer.x #- layer.scrollFrame.x
		point.y += layer.y #- layer.scrollFrame.y

	for layer in superLayersB
		point.x -= layer.x #+ layer.scrollFrame.x
		point.y -= layer.y #+ layer.scrollFrame.y

	return point

###################################################################
# Beta additions, use with care

Utils.globalLayers = (importedLayers) ->

	# Beta. Not sure if we should push this but it's nice to have.
	# Use this to make all layers in an imported set available on
	# on the top level, so without the "importedLayers" prefix.

	for layerName, layer of importedLayers

		# Replace all whitespace in layer names
		layerName = layerName.replace(/\s/g,"")

		# Check if there are global variables with the same name
		if window.hasOwnProperty(layerName) and not window.Framer._globalWarningGiven
			print "Warning: Cannot make layer '#{layerName}' a global, a variable with that name already exists"
		else
			window[layerName] = layer

	window.Framer._globalWarningGiven = true


_textSizeNode = null

Utils.textSize = (text, style={}, constraints={}) ->

	# This function takes some text, css style and optionally a width and height and
	# returns the rendered text size. This can be pretty slow, so use sporadically.
	# http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript

	shouldCreateNode = !_textSizeNode

	if shouldCreateNode
		_textSizeNode = document.createElement("div")
		_textSizeNode.id = "_textSizeNode"

	_textSizeNode.innerHTML = text

	style = _.extend style,
		position: "fixed"
		display: "inline"
		visibility: "hidden"
		top: "-10000px"
		left: "-10000px"

	delete style.width
	delete style.height
	delete style.bottom
	delete style.right

	style.width = "#{constraints.width}px" if constraints.width
	style.height = "#{constraints.height}px" if constraints.height

	_.extend(_textSizeNode.style, style)

	if shouldCreateNode
		# This is a trick to call this function before the document ready event
		if not window.document.body
			document.write(_textSizeNode.outerHTML)
			_textSizeNode = document.getElementById("_textSizeNode")
		else
			window.document.body.appendChild(_textSizeNode)

	rect = _textSizeNode.getBoundingClientRect()

	frame =
		width: rect.right - rect.left
		height: rect.bottom - rect.top

_.extend exports, Utils
