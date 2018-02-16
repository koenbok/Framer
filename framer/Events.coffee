Utils = require "./Utils"

{_} = require "./Underscore"
{Gestures} = require "./Gestures"

Events = {}


# Standard dom events
Events.MouseUp = "mouseup"
Events.MouseDown = "mousedown"
Events.MouseOver = "mouseover"
Events.MouseOut = "mouseout"
Events.MouseEnter = "mouseenter"
Events.MouseLeave = "mouseleave"
Events.MouseMove = "mousemove"
Events.MouseWheel = "mousewheel"
Events.DoubleClick = "dblclick"
Events.MouseDoubleClick = "dblclick" # Alias for consistent naming

supportsPointerEvents = window.onpointerdown is null and window.onpointermove is null and window.onpointerup is null

Events.PointerUp = "pointerup"
Events.PointerDown = "pointerdown"
Events.PointerOver = "pointerover"
Events.PointerOut = "pointerout"
Events.PointerMove = "pointermove"

# Standard touch events
Events.enableEmulatedTouchEvents = (enable=true) ->
	# never emulate if the browsers supports pointer events
	return if supportsPointerEvents
	if enable
		Events.TouchStart = Events.MouseDown
		Events.TouchEnd = Events.MouseUp
		Events.TouchMove = Events.MouseMove
		# When we are simulating touch events, click should use the simulated touch-event
		Events.Click = "touchend"
	else
		Events.TouchStart = "touchstart"
		Events.TouchEnd = "touchend"
		Events.TouchMove = "touchmove"
		# When not simulating, click should be based on if touch is supported or not
		Events.Click = if Utils.isTouch() then "touchend" else "mouseup"

# Let's make sure the touch events work on desktop too
Events.enableEmulatedTouchEvents(not Utils.isTouch())

if supportsPointerEvents
	Events.MouseUp = Events.PointerUp
	Events.MouseDown = Events.PointerDown
	Events.MouseOver = Events.PointerOver
	Events.MouseOut = Events.PointerOut
	Events.MouseMove = Events.PointerMove
	Events.TouchStart = Events.PointerDown
	Events.TouchEnd = Events.PointerUp
	Events.TouchMove = Events.PointerMove
	# Use pointerEvents for click
	Events.Click = Events.PointerUp

# Animation events
Events.AnimationStart = "start"
Events.AnimationHalt = "halt"
Events.AnimationStop = "stop"
Events.AnimationEnd = "end"

Events.AnimationDidStart = Events.AnimationStart # Deprecated
Events.AnimationDidStop = Events.AnimationStop # Deprecated
Events.AnimationDidEnd = Events.AnimationEnd # Deprecated

# State events
Events.StateSwitchStart = "stateswitchstart"
Events.StateSwitchStop = "stateswitchstop"
Events.StateSwitchEnd = "stateswitchend"

Events.StateWillSwitch = Events.StateSwitchStart # Deprecated
Events.StateDidSwitch = Events.StateSwitchEnd # Deprecated

# Scroll events
Events.Scroll = "scroll"

# Image events
Events.ImageLoaded = "imageload"
Events.ImageLoadError = "imageerror"
Events.ImageLoadCancelled = "imagecancelled"

# Sensor Events
Events.DeviceOrientation = "deviceorientation"
Events.DeviceMotion = "devicemotion"

# Add all gesture events
_.extend(Events, Gestures)

# Extract touch events for any event
Events.touchEvent = (event) ->
	touchEvent = event.touches?[0]
	touchEvent ?= event.changedTouches?[0]
	touchEvent ?= event
	touchEvent

Events.wrap = (element) ->
	Framer.CurrentContext.domEventManager.wrap(element)

Events.isGesture = (eventName) ->
	return eventName in Gestures

interactiveEvents = _.values(Gestures).concat([
	Events.TouchStart,
	Events.TouchEnd,
	Events.MouseUp,
	Events.MouseDown,
	Events.MouseWheel,
	Events.DoubleClick
])

Events.isInteractive = (eventName) ->
	return eventName in interactiveEvents

exports.Events = Events
