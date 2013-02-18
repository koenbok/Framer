Function::define = (prop, desc) ->
	Object.defineProperty @prototype, prop, desc
	Object.__

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

exports.update = (a, b) ->
	keys = exports.keys a
	exports.extend a, (exports.filter b, (k) -> k in keys)
	a
		

exports.copy = (a) ->
	exports.extend {}, a

exports.filter = (a, f) ->
	b = {}
	for key, value of a
		if f key, value
			b[key] = value
	return b

exports.union = ->
	Array.prototype.concat.apply Array.prototype, arguments

exports.toggle = ->
	args = Array.prototype.slice.call arguments
	curr = -1
	return ->
		curr++
		curr = 0 if curr >= args.length
		return args[curr]

exports.randomColor = (alpha) ->
	a = alpha or 1.0
	c = -> parseInt(Math.random() * 255)
	"rgba(#{c()}, #{c()}, #{c()}, #{a})"

exports.delay = (time, f) ->
	timer = setTimeout f, time
	window._delayTimers ?= []
	window._delayTimers.push timer
	return timer

exports.interval = (time, f) ->
	timer = setInterval f, time
	window._delayIntervals ?= []
	window._delayIntervals.push timer
	return timer

exports.remove = (a, e) -> 
	a.splice(t,1)[0] if (t = a.indexOf(e)) > -1
	a
	
exports.debounce = (func, threshold, execAsap) ->
	timeout = null
	(args...) ->
		obj = this
		delayed = ->
			func.apply(obj, args) unless execAsap
			timeout = null
		if timeout
			clearTimeout(timeout)
		else if (execAsap)
			func.apply(obj, args)
		timeout = setTimeout delayed, threshold || 100

exports.throttle = (fn, delay) ->
	return fn if delay is 0
	timer = false
	return ->
		return if timer
		timer = true
		setTimeout (-> timer = false), delay unless delay is -1
		fn arguments...

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
	
	# console.log "superViewsB1", (v.name for v in superViews1)
	# console.log "superViewsB2", (v.name for v in superViews2)
	
	return point

exports.max = (obj) ->
	for n in obj
		if !max or n > max then max = n
	max

exports.min = (obj) ->
	for n in obj
		if !min or n < min then min = n
	min

exports.sum = (a) ->
	if a.length > 0
		a.reduce (x, y) -> x + y
	else
		0

exports.isWebKit = ->
	
	isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
	isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)

	return true in [isChrome, isSafari]
	
	
	
	
