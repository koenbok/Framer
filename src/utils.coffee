_ = require "underscore"

{config} = require "./config"

Function::define = (prop, desc) ->
	Object.defineProperty @prototype, prop, desc
	Object.__


######################################################
# TIME FUNCTIONS

exports.delay = (time, f) ->
	timer = setTimeout f, time * config.timeSpeedFactor
	window._delayTimers ?= []
	window._delayTimers.push timer
	return timer
	
exports.interval = (time, f) ->
	timer = setInterval f, time * config.timeSpeedFactor
	window._delayIntervals ?= []
	window._delayIntervals.push timer
	return timer

exports.debounce = (threshold, fn, immediate) ->
	timeout = null
	(args...) ->
		obj = this
		delayed = ->
			fn.apply(obj, args) unless immediate
			timeout = null
		if timeout
			clearTimeout(timeout)
		else if (immediate)
			fn.apply(obj, args)
		timeout = setTimeout delayed, threshold || 100

exports.throttle = (delay, fn) ->
	return fn if delay is 0
	timer = false
	return ->
		return if timer
		timer = true
		setTimeout (-> timer = false), delay unless delay is -1
		fn arguments...

######################################################
# MATH FUNCTIONS

exports.max = (arr) ->
	Math.max arr...

exports.min = (arr) ->
	Math.min arr...

exports.sum = (a) ->
	if a.length > 0
		a.reduce (x, y) -> x + y
	else
		0

exports.round = (value, decimals) ->
	d = Math.pow 10, decimals
	Math.round(value * d) / d


######################################################
# HANDY FUNCTIONS

exports.defaults = (obj, defaults) ->
	
	result = _.extend obj
	
	for k, v of defaults
		if result[k] in [null, undefined]
			result[k] = defaults[k]
	
	result


exports.randomColor = (alpha = 1.0) ->
	c = -> parseInt(Math.random() * 255)
	"rgba(#{c()}, #{c()}, #{c()}, #{alpha})"

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
# DOM FUNCTIONS

__domComplete = []

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

	point = exports.extend {}, point
	
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


######################################################
# BEGIN TODO: Replace these with underscore equivalents

exports.keys = (a) ->
	for key of a
		key

exports.extend = ->
	args = Array.prototype.slice.call arguments
	a = args[0]
	for obj in args[1..]
		for key, value of obj
			a[key] = value
	return a

exports.update = (target, source) ->
	keys = exports.keys target
	exports.extend target, (exports.filter source, (k) -> k in keys)
	a
	
exports.copy = (source) ->
	exports.extend {}, source

exports.filter = (source, iterator) ->
	b = {}
	for key, value of source
		if iterator key, value
			b[key] = value
	return b

exports.union = ->
	Array.prototype.concat.apply Array.prototype, arguments

exports.remove = (a, e) ->
	a.splice(t,1)[0] if (t = a.indexOf(e)) > -1
	a

# END TODO


