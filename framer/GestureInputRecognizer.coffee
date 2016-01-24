Utils = require "./Utils"

class exports.GestureInputRecognizer
	
	constructor: ->
		window.addEventListener("touchstart", @touchstart)
		
	touchstart: (event) =>
		window.addEventListener("touchmove", @touchmove)
		window.addEventListener("touchend", @touchend)
		@session = {startEvent: @_getGestureEvent(event)}
		@_process(@_getGestureEvent(event))

	touchmove: (event) =>
		@_process(@_getGestureEvent(event))
		
	touchend: (event) =>
		window.removeEventListener("touchmove", @touchmove)
		window.removeEventListener("touchend", @touchend)
		@_process(@_getGestureEvent(event))
		@pinchend(event) if @session.pinchStartEvent
		@session = null

	# Pinch

	pinchstart: (event) ->
		@session.pinchStartEvent = event
		@_dispatchEvent("pinchstart", event)

	pinch: (event) ->
		@_dispatchEvent("pinch", event)
		
	pinchend: (event) ->
		@_dispatchEvent("pinchend", event)
		@session.pinchStartEvent = null
		
	# Swipe
	
	swipe: (event) ->
		@_dispatchEvent("swipe", event)
		@session.swipeStartEvent = event
	
	swipeup: (event) -> @_dispatchEvent("swipeup", event)
	swipedown: (event) -> @_dispatchEvent("swipedown", event)
	swipeleft: (event) -> @_dispatchEvent("swipeleft", event)
	swiperight: (event) -> @_dispatchEvent("swiperight", event)
	
	_process: (event) =>
		
		return unless @session 
		
		# Detect pinch events
		if @session.pinchStartEvent and event.touches.length == 1
			@pinchend(event)
		else if not @session.pinchStartEvent and event.touches.length == 2 
			@pinchstart(event)	
		else if @session.pinchStartEvent
			@pinch(event)
			
		# Detect swipe events
		if not @session.swipeStartEvent and  event.touches.length == 1
			if Math.abs(event.offset.x) > 30 or Math.abs(event.offset.y) > 30
				@swipe(event)
				@["swipe#{event.direction}"](event)
		
		@session.lastEvent = event

	_getGestureEvent: (event) ->
		
		if event.touches.length > 0
			
			event.offset = {x:0, y:0}
			event.angle = 0
			
			if @session?.startEvent
				pointA = @_getTouchPoint(@session.startEvent, 0)
				pointB = @_getTouchPoint(event, 0)
				event.offset = Utils.pointDelta(pointA, pointB)
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
		
	_dispatchEvent: (type, event, target) ->
		
		target ?= event.target
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
	
		target.dispatchEvent(touchEvent)