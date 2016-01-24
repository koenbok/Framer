Utils = require "./Utils"

{DOMEventManager} = require "./DOMEventManager"

class exports.GestureInputRecognizer
	
	constructor: ->
		@em = new DOMEventManager()
		@em.wrap(window).addEventListener("touchstart", @touchstart)

	destroy: ->
		@em.removeAllListeners()

	cancel: ->
		window.clearTimeout(@session.pressTimer)
		@session = null
	
	touchstart: (event) =>
		@em.wrap(window).addEventListener("touchmove", @touchmove)
		@em.wrap(window).addEventListener("touchend", @touchend)
		@session =
			startEvent: @_getGestureEvent(event)
			startTime: Date.now()
			pressTimer: window.setTimeout(@longpress, 250)
		event = @_getGestureEvent(event)
		@tapstart(event)
		@_process(event)

	touchmove: (event) =>
		@_process(@_getGestureEvent(event))
		
	touchend: (event) =>
		@em.wrap(window).removeEventListener("touchmove", @touchmove)
		@em.wrap(window).removeEventListener("touchend", @touchend)
		event = @_getGestureEvent(event)
		@_process(event)
		@panend(event) if @session.panStartEvent
		@pinchend(event) if @session.pinchStartEvent
		@tap(event)
		@tapend(event)
		@cancel()

	# Tap

	tap: => @_dispatchEvent("tap", event)
	tapstart: => @_dispatchEvent("tapstart", event)
	tapend: => @_dispatchEvent("tapend", event)

	# Press

	longpress: =>
		return unless @session
		return if @session.longpressStartEvent
		event = @_getGestureEvent(@session.startEvent)
		@session.longpressStartEvent = event
		@_dispatchEvent("longpress", event)

	# Pan

	panstart: (event) =>
		@session.panStartEvent = event
		@_dispatchEvent("panstart", event, @session.panStartEvent.target)

	pan: (event) =>
		@_dispatchEvent("pan", event, @session.panStartEvent.target)
		direction = @_getDirection(event.delta)
		@["pan#{direction}"](event) if direction
		
	panend: (event) =>
		@_dispatchEvent("panend", event, @session.panStartEvent.target)
		@session.panStartEvent = null

	panup: (event) => @_dispatchEvent("panup", event, @session.panStartEvent.target)
	pandown: (event) => @_dispatchEvent("pandown", event, @session.panStartEvent.target)
	panleft: (event) => @_dispatchEvent("panleft", event, @session.panStartEvent.target)
	panright: (event) => @_dispatchEvent("panright", event, @session.panStartEvent.target)

	# Pinch

	pinchstart: (event) =>
		@session.pinchStartEvent = event
		@scalestart(event, @session.pinchStartEvent.target)
		@rotatestart(event, @session.pinchStartEvent.target)
		@_dispatchEvent("pinchstart", event)

	pinch: (event) =>
		@_dispatchEvent("pinch", event)
		@scale(event, @session.pinchStartEvent.target)
		@rotate(event, @session.pinchStartEvent.target)
		
	pinchend: (event) =>
		@_dispatchEvent("pinchend", event)
		@scaleend(event, @session.pinchStartEvent.target)
		@rotateend(event, @session.pinchStartEvent.target)
		@session.pinchStartEvent = null


	scalestart: (event) => @_dispatchEvent("scalestart", event)
	scale: (event) => @_dispatchEvent("scale", event)
	scaleend: (event) => @_dispatchEvent("scaleend", event)

	rotatestart: (event) => @_dispatchEvent("rotatestart", event)
	rotate: (event) => @_dispatchEvent("rotate", event)
	rotateend: (event) => @_dispatchEvent("rotateend", event)

	# Swipe
	
	swipe: (event) =>
		@_dispatchEvent("swipe", event)
		@session.swipeStartEvent = event
	
	swipeup: (event) ->
		@_dispatchEvent("swipeup", event)
		maxY = Utils.frameGetMaxY(Screen.canvasFrame)
		if maxY - 30 < event.start.y < maxY
			event = @_createEvent("edgeswipebottom", event)
			Screen.emit("edgeswipe", event)
			Screen.emit("edgeswipebottom", event)
		
	swipedown: (event) ->
		@_dispatchEvent("swipedown", event)
		if 0 < event.start.y - Screen.canvasFrame.y < 30
			event = @_createEvent("edgeswipetop", event)
			Screen.emit("edgeswipe", event)
			Screen.emit("edgeswipetop", event)
	
	swipeleft: (event) ->
		@_dispatchEvent("swipeleft", event)
		maxX = Utils.frameGetMaxX(Screen.canvasFrame)
		if maxX - 30 < event.start.x < maxX
			event = @_createEvent("edgeswiperight", event)
			Screen.emit("edgeswipe", event)
			Screen.emit("edgeswiperight", event)
	
	swiperight: (event) ->
		@_dispatchEvent("swiperight", event)
		if 0 < event.start.x - Screen.canvasFrame.x < 30
			event = @_createEvent("edgeswipeleft", event)
			Screen.emit("edgeswipe", event)
			Screen.emit("edgeswipeleft", event)

	_process: (event) =>
		
		return unless @session 

		# Detect pan events
		if event.fingers == 1
			if not @session.panStartEvent and (Math.abs(event.offset.x) > 0 or Math.abs(event.offset.y) > 0)
				@panstart(event)
			else if @session.panStartEvent
				@pan(event)

		
		# Detect pinch, rotate and scale events
		if @session.pinchStartEvent and event.fingers == 1
			@pinchend(event)
		else if not @session.pinchStartEvent and event.fingers == 2 
			@pinchstart(event)	
		else if @session.pinchStartEvent
			@pinch(event)
			
		# Detect swipe events
		if not @session.swipeStartEvent and  event.fingers == 1
			if Math.abs(event.offset.x) > 30 or Math.abs(event.offset.y) > 30
				@swipe(event)
				@["swipe#{event.direction}"](event)
		
		@session.lastEvent = event

	_getGestureEvent: (event) ->
		
		_.extend event,
			time: Date.now() # Current time
			
			point: {x:event.pageX, y:event.pageY} # Current point
			start: {x:event.pageX, y:event.pageY} # Start point
			previous: {x:event.pageX, y:event.pageY} # Previous point
			
			offset: {x:0, y:0} # Offset since start
			offsetTime: 0 # Time since start
			offsetAngle: 0 # Angle from start
			offsetDirection: null # Direction from start (up, down, left, right)

			delta: {x:0, y:0} # Offset since last event
			deltaTime: 0 # Time since last event
			deltaAngle: 0 # Angle from last event
			deltaDirection: null # Direction from last event

			velocity: {x:0, y:0} # Velocity average over the last few events
			
			fingers: event.touches.length # Number of fingers used
			touchCenter: {x:event.pageX, y:event.pageY} # Center between two fingers
			touchDistance: 0 # Distance between two fingers
			touchOffset: {x:0, y:0} # Offset between two fingers
			scale: 1 # Scale value from two fingers
			rotation: 0 # Rotation value from two fingers

		if @session?.startEvent
			event.start = @session.startEvent.point
			event.offsetTime = event.time - @session.startEvent.time
			event.offset = Utils.pointSubtract(event.point, event.start)

		if @session?.lastEvent
			event.deltaTime = event.time - @session.lastEvent.time
			event.previous = @session.lastEvent.point
			event.delta = Utils.pointSubtract(event.point, event.previous)

		if event.touches.length > 0
			
			event.angle = 0
			
			if @session?.startEvent
				pointA = @_getTouchPoint(@session.startEvent, 0)
				pointB = @_getTouchPoint(event, 0)
				event.angle = Utils.pointAngle(pointA, pointB)
			
			event.direction = @_getDirection(event.offset)
		
		if event.touches.length > 1
			pointA = @_getTouchPoint(event, 0)
			pointB = @_getTouchPoint(event, 1)
			event.center = Utils.pointCenter(pointB, pointA)
			event.rotation = Utils.pointAngle(pointA, pointB)
			event.distance = Utils.pointDistance(pointA, pointB)
			event.scale = 1
		
		if @session?.pinchStartEvent
			event.scale = event.distance / @session.pinchStartEvent.distance

		# Convert point style event properties to dom style:
		# event.delta -> event.deltaX, event.deltaY
		for pointKey in ["point", "start", "previous", "offset", "delta", "velocity", "touchCenter", "touchOffset"]
			event["#{pointKey}X"] = event[pointKey].x
			event["#{pointKey}Y"] = event[pointKey].y
			
		return event
	
	_getTouchPoint: (event, index) ->
		return point =
			x: event.touches[index].pageX
			y: event.touches[index].pageY
			
	_getDirection: (offset) ->
		if Math.abs(offset.x) > Math.abs(offset.y)
			return "right" if offset.x > 0
			return "left"  if offset.x < 0
		if Math.abs(offset.x) < Math.abs(offset.y)
			return "up"    if offset.y < 0
			return "down"  if offset.y > 0
		return null
	
	_createEvent: (type, event) ->

		touchEvent = document.createEvent("MouseEvent")
		touchEvent.initMouseEvent(type, true, true, window, 
			event.detail, event.screenX, event.screenY, 
			event.clientX, event.clientY, 
			event.ctrlKey, event.shiftKey, event.altKey, event.metaKey, 
			event.button, event.relatedTarget)
			
		touchEvent.touches = event.touches
		touchEvent.changedTouches = event.touches
		touchEvent.targetTouches = event.touches
		
		for k, v of event
			touchEvent[k] = v

		return touchEvent

	_dispatchEvent: (type, event, target) ->
		touchEvent = @_createEvent(type, event)
		target ?= event.target
		target.dispatchEvent(touchEvent)