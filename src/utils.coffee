_ = require "underscore"
{config} = require "./config"

Function::define = (prop, desc) ->
	Object.defineProperty @prototype, prop, desc
	Object.__

# BEGIN TODO: Replace these with underscore equivalents

# Public: Get the keys of an Object
#
# a - an Object
#
# Returns an Array
#

exports.keys = (a) ->
	for key of a
		key

# Public: Overlay the properties of one or more objects onto another
#
# args - A list of Objects to operate upon, the first being the target
#
# Returns an Object (the first argument)
#
exports.extend = ->
	args = Array.prototype.slice.call arguments
	a = args[0]
	for obj in args[1..]
		for key, value of obj
			a[key] = value
	return a

# Public: Update the properties in common betwen a target Object and 
# a source Object
#
# target - An Object that will be updated
# source - An Object whose common properties will update the target
#
# Returns the target Object
#
exports.update = (target, source) ->
	keys = exports.keys target
	exports.extend target, (exports.filter source, (k) -> k in keys)
	a

# Public: Creates a new Object from a given source Object
#
# source - The Object to copy
#
# Returns an Object
#
exports.copy = (source) ->
	exports.extend {}, source

# Public: Looks through properties of a source object, returning an Object
# of properties that path the iterator's truth test.
#
# NOTE: Although similarly named, exports.filter is not an ES5 compatible
# filter implementation.
#
# source - an object that will be filtered
# iterator - a Function accepting a key and value and returning a Boolean
#
# Returns an Object
#
exports.filter = (source, iterator) ->
	b = {}
	for key, value of source
		if iterator key, value
			b[key] = value
	return b

# Public: Produce an array containing the elements from all
# arguments.
#
# NOTE: This will include duplicate elements.
#
# Returns an Array
#
exports.union = ->
	Array.prototype.concat.apply Array.prototype, arguments

# Public: Remove an element from an array if its present
#
# a - The Array to remove the element from
# e - The element to remove
#
# Returns the passed Array
#
exports.remove = (a, e) ->
	a.splice(t,1)[0] if (t = a.indexOf(e)) > -1
	a

# END TODO

# Public: Creates a Function that toggles between two or more
# values.
#
# args - A list of values to toggle between
#
# Examples
#
#		opacityToggle = exports.cycle(0, 1)
#		dropdown.on 'click', -> dropdown.opacity = opacityToggle()
#
# Returns a Function
#

exports.cycle = ->
	
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

# Public: Returns a String containing a color in rgba(...) format.
#
# alpha - a Float between 0 and 1 specifing the transparency
#					of the outputted color. (default: 1.0)
#
# Returns a String
#
exports.randomColor = (alpha = 1.0) ->
	c = -> parseInt(Math.random() * 255)
	"rgba(#{c()}, #{c()}, #{c()}, #{alpha})"


# Public: Delay the execution of a Function by a given number
# of milliseconds via `setTimeout` and references this Timer
# in a global for bookkeeping purposes.
#
# time - the number of milliseoncds to delay execution
# t - the Function that will be executed
#
# Returns a Timer
#
exports.delay = (time, f) ->
	timer = setTimeout f, time * config.timeSpeedFactor
	# window._delayTimers ?= []
	# window._delayTimers.push timer
	return timer


# Public: Periodically execute a function based on given
# time interval.
#
# time - the period of execution in milliseconds
# f - the Function that will be executed
#
# Returns a Timer
#
exports.interval = (time, f) ->
	timer = setInterval f, time * config.timeSpeedFactor
	window._delayIntervals ?= []
	window._delayIntervals.push timer
	return timer


# Public: Returns a Function that will not be executed until
# repeated calls in a given threshold cease. If `immediate` is passed,
# the Function will be executed immediatly.
#
# fn - a Function to conditionally execute
# threshold - a window in milliseconds that will prevent execution
# immiediate - a Boolean that, if true, will execute the function immediatly.
#
# Returns a Function
#
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


# Public: Returns a Function that, when called, will only be executed
# at most once in a given period of time.
#
# fn - The Function that will be executed
# delay - A window in time in milliseconds
#
# Returns a Function
#
exports.throttle = (delay, fn) ->
	return fn if delay is 0
	timer = false
	return ->
		return if timer
		timer = true
		setTimeout (-> timer = false), delay unless delay is -1
		fn arguments...


# Public: Convert a point between two view coordinate systems
#
# point - The point to be converted
# view1 - The origin view of the point
# view2 - The destination view of the point
# 
# Returns an Object
#
exports.convertPoint = (point, view1, view2) ->
	
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

# Returns the biggest value in an Array
#
exports.max = (arr) -> Math.max arr...

# Returns the lowest value in an Array
#
exports.min = (arr) -> Math.min arr...

# Returns the sum of the elements in an Array
#
exports.sum = (a) ->
	if a.length > 0
		a.reduce (x, y) -> x + y
	else
		0

exports.pointInRect = (point, rect) ->
	alert "Not implemented, you lazy man"

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

exports.round = (value, decimals) ->
	d = Math.pow 10, decimals
	Math.round(value * d) / d

# Public: Returns a Boolean indicating wether the current browser uses the
# Webkit engine.
#
exports.isWebKit = ->
	window.WebKitCSSMatrix isnt null
	
	
# Public: Returns a Boolean indicating wether the current browser is a
# mobile browser.
#
exports.isTouch = ->
	window.ontouchstart is null


# Public: Returns a Boolean indicating wether the current browser is a
# mobile browser.
#
exports.isMobile = ->
	(/iphone|ipod|android|ie|blackberry|fennec/).test \
		navigator.userAgent.toLowerCase()


# Public: Only executes a given function if the dom is loaded
#
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



