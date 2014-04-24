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

# exports.debounce = (threshold, fn, immediate) ->
# 	timeout = null
# 	(args...) ->
# 		obj = this
# 		delayed = ->
# 			fn.apply(obj, args) unless immediate
# 			timeout = null
# 		if timeout
# 			clearTimeout(timeout)
# 		else if (immediate)
# 			fn.apply(obj, args)
# 		timeout = setTimeout delayed, threshold || 100

# exports.throttle = (delay, fn) ->
# 	return fn if delay is 0
# 	timer = false
# 	return ->
# 		return if timer
# 		timer = true
# 		setTimeout (-> timer = false), delay unless delay is -1
# 		fn arguments...


# exports.getTime = -> performance.now() if performance?.now


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