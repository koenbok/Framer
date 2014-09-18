{_} = require "./Underscore"

Utils = require "./Utils"

Events = {}

if Utils.isTouch()
	Events.TouchStart = "touchstart"
	Events.TouchEnd = "touchend"
	Events.TouchMove = "touchmove"
else
	Events.TouchStart = "mousedown"
	Events.TouchEnd = "mouseup"
	Events.TouchMove = "mousemove"

Events.Click = Events.TouchEnd

# Standard dom events
Events.MouseOver = "mouseover"
Events.MouseOut = "mouseout"
Events.MouseMove = "mousemove"

# Animation events
Events.AnimationStart = "start"
Events.AnimationStop = "stop"
Events.AnimationEnd = "end"

# Scroll events
Events.Scroll = "scroll"

# Extract touch events for any event
Events.touchEvent = (event) ->
	touchEvent = event.touches?[0]
	touchEvent ?= event.changedTouches?[0]
	touchEvent ?= event
	touchEvent

Events.wrap = (element) ->
	Framer.CurrentContext.eventManager.wrap(element)
	
exports.Events = Events