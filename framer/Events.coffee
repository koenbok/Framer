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

# Gesture events
_gestures = []
_gestures.push Events.Press = "press"
_gestures.push Events.PressUp = "pressup"
_gestures.push Events.Pinch = "pinch"
_gestures.push Events.PinchStart = "pinchstart"
_gestures.push Events.PinchEnd = "pinchend"
_gestures.push Events.Pan = "pan"
_gestures.push Events.Swipe = "swipe"
_gestures.push Events.SwipeLeft = "swipeleft"
_gestures.push Events.SwipeRight = "swiperight"
_gestures.push Events.SwipeUp = "swipeup"
_gestures.push Events.SwipeDown = "swipedown"

# Scroll events
Events.Scroll = "scroll"

# Image events
Events.ImageLoaded = "load"
Events.ImageLoadError = "error"

Events.isGestureEvent = (eventName) ->
	return eventName in _gestures

# Extract touch events for any event
Events.touchEvent = (event) ->
	touchEvent = event.touches?[0]
	touchEvent ?= event.changedTouches?[0]
	touchEvent ?= event
	touchEvent

Events.wrap = (element) ->
	Framer.CurrentContext.eventManager.wrap(element)
	
exports.Events = Events