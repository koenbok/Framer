{_} = require "./Underscore"

Utils = require "./Utils"

Events = {}

# Standard touch events
Events.TouchStart = "touchstart"
Events.TouchEnd = "touchend"
Events.TouchMove = "touchmove"

# Standard dom events
Events.MouseUp = "mouseup"
Events.MouseDown = "mousedown"
Events.MouseOver = "mouseover"
Events.MouseOut = "mouseout"
Events.MouseMove = "mousemove"
Events.MouseWheel = "mousewheel"
Events.DoubleClick = "dblclick"

# Let's make sure the touch events work on desktop too
if not Utils.isTouch()
	Events.TouchStart = Events.MouseDown
	Events.TouchEnd = Events.MouseUp
	Events.TouchMove = Events.MouseMove

Events.Click = Events.TouchEnd

# Animation events
Events.AnimationStart = "start"
Events.AnimationStop = "stop"
Events.AnimationEnd = "end"
Events.AnimationDidStart = "start"
Events.AnimationDidStop = "stop"
Events.AnimationDidEnd = "end"

# Scroll events
Events.Scroll = "scroll"

# Image events
Events.ImageLoaded = "load"
Events.ImageLoadError = "error"

# Extract touch events for any event
Events.touchEvent = (event) ->
	touchEvent =  event.touches?[0]
	touchEvent ?= event.changedTouches?[0]
	touchEvent ?= event
	touchEvent

Events.wrap = (element) ->
	Framer.CurrentContext.domEventManager.wrap(element)

Events.addHelpers = (obj) ->

	# Add event helpers to an object like:
	# layer.onClick, layer.onScroll, etc.

	_.keys(Events).map (eventName) ->
		return unless _.isString(eventName)
		obj::["on#{eventName}"] = (callback) ->
			@on(Events[eventName], callback)

	obj::onChange = (p, callback) ->
		@on("change:#{p}", callback)

exports.Events = Events