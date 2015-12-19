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
Events.MouseDoubleClick = "dblclick" # Alias for consistent naming

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

# Pan
_gestures.push Events.Pan = "pan" # This event includes all the other Pan events
_gestures.push Events.PanStart = "panstart"
_gestures.push Events.PanMove = "panmove"
_gestures.push Events.PanEnd = "panend"
_gestures.push Events.PanCancel = "pancancel"
_gestures.push Events.PanLeft = "panleft"
_gestures.push Events.PanRight = "panright"
_gestures.push Events.PanUp = "panup"
_gestures.push Events.PanDown = "pandown"

# Pinch
_gestures.push Events.Pinch = "pinch" # This event includes all the other Pinch events
_gestures.push Events.PinchStart = "pinchstart"
_gestures.push Events.PinchMove = "pinchmove"
_gestures.push Events.PinchEnd = "pinchend"
_gestures.push Events.PinchCancel = "pinchcancel"
_gestures.push Events.PinchIn = "pinchin"
_gestures.push Events.PinchOut = "pinchout"

# Press
_gestures.push Events.Press = "press"
_gestures.push Events.PressUp = "pressup"

# Rotate
_gestures.push Events.Rotate = "rotate" # This event includes all the other Rotate events
_gestures.push Events.RotateStart = "rotatestart"
_gestures.push Events.RotateMove = "rotatemove"
_gestures.push Events.RotateEnd = "rotateend"
_gestures.push Events.RotateCancel = "rotatecancel"

# Swipe
_gestures.push Events.Swipe = "swipe"
_gestures.push Events.SwipeLeft = "swipeleft"
_gestures.push Events.SwipeRight = "swiperight"
_gestures.push Events.SwipeUp = "swipeup"
_gestures.push Events.SwipeDown = "swipedown"

# Tap
_gestures.push Events.Tap = "tap"
_gestures.push Events.SingleTap = "singletap"
_gestures.push Events.DoubleTap = "doubletap"

# Scroll events
Events.Scroll = "scroll"

# Image events
Events.ImageLoaded = "load"
Events.ImageLoadError = "error"

Events.isGestureEvent = (eventName) ->
	return eventName in _gestures

# Extract touch events for any event
Events.touchEvent = (event) ->
	touchEvent =  event.touches?[0]
	touchEvent ?= event.changedTouches?[0]
	touchEvent ?= event
	touchEvent

Events.wrap = (element) ->
	Framer.CurrentContext.domEventManager.wrap(element)

exports.Events = Events