Utils = require "../Utils"
{BaseClass} = require "../BaseClass"

createTouch = (event, identifier, offset={x:0, y:0}) ->
	return touch =
		identifier: identifier
		target: event.target
		pageX: event.pageX + offset.x
		pageY: event.pageY + offset.y
		clientX: event.clientX + offset.x
		clientY: event.clientY + offset.y
		screenX: event.screenX + offset.x
		screenY: event.screenY + offset.y

dispatchTouchEvent = (type, event, offset) ->
	
	touchEvent = document.createEvent("MouseEvent")
	touchEvent.initMouseEvent(type, true, true, window, 
		event.detail, event.screenX, event.screenY, 
		event.clientX, event.clientY, 
		event.ctrlKey, event.shiftKey, event.altKey, event.metaKey, 
		event.button, event.relatedTarget)
	
	touches = []
	touches.push(createTouch(event, 1))
	touches.push(createTouch(event, 2, offset)) if offset
			
	touchEvent.touches = touchEvent.changedTouches = touchEvent.targetTouches = touches
	
	print "Touch", type

	event.target.dispatchEvent(touchEvent)


cancelEvent = (event) ->
	event.preventDefault()
	event.stopPropagation()


class TouchEmulator extends BaseClass

	constructor: ->
		
		if not @isHammerTouchSupported()
			throw new Error "Touch emulation for hammer is not supported"
		
		@mouseCursorImage = "framer/images/cursor@2x.png"
		@mouseCursorImageActive = "framer/images/cursor-active@2x.png"
		@mouseCursorImageSize = 64
		@keyPinchCode = 16 # Shift
		@keyPanCode = 91 # Command
		@minimalOffset = 40
		
		@context = new Framer.Context name:"TouchEmulator"
		@context._element.style.zIndex = 10000
		@wrap = @context.domEventManager.wrap
		
		@wrap(document).addEventListener("mousedown", @mousedown, true)
		@wrap(document).addEventListener("mousemove", @mousemovePosition, true)
		@wrap(document).addEventListener("keydown", @keydown, true)
		
		@isMouseDown = false
		@isPinchKeyDown = false
		@isPanKeyDown = false
		
		@context.run =>
			@imageLayer = new Layer
				width: @mouseCursorImageSize
				height: @mouseCursorImageSize
				image: @mouseCursorImage
				opacity: 0
			@imageLayer.states.add
				show: {opacity:1, scale:1}
				hide: {opacity:0, scale:1.2}
			@imageLayer.states.animationOptions =
				time: 0.08
	
	isHammerTouchSupported: ->
		window.ontouchstart is null 
	
	keydown: (event) =>
		
		if event.keyCode is @keyPinchCode	
			@isPinchKeyDown = true
			@startPoint = @centerPoint = null
			@imageLayer.states.switch("show")
			@imageLayer.midX = @point.x
			@imageLayer.midY = @point.y
			@wrap(document).addEventListener("keyup", @keyup, true)
			@wrap(document).addEventListener("mousemove", @mousemove, true)
			
		if event.keyCode is @keyPanCode
			@isPanKeyDown = true
			cancelEvent(event)
			
	keyup: (event) =>
	
		if event.keyCode is @keyPinchCode
			cancelEvent(event)	
			@isPinchKeyDown = false
			@imageLayer.states.switch("hide")
			
			@wrap(document).removeEventListener("mousemove", @mousemove, true)
		
		if event.keyCode is @keyPanCode
			cancelEvent(event)
			@centerPoint = Utils.pointCenter(@touchPoint, @point)
			@isPanKeyDown = false
			

	mousedown: (event) =>
	
		cancelEvent(event)
		
		@isMouseDown = true
			
		@wrap(document).addEventListener("mousemove", @mousemove, true)
		@wrap(document).addEventListener("mouseup", @mouseup, true)

		if @isPinchKeyDown
			dispatchTouchEvent("touchstart", event, @touchPointDelta)
		else
			dispatchTouchEvent("touchstart", event)
		
		@imageLayer.image = @mouseCursorImageActive

	mousemovePosition: (event) =>
		@point =
			x: event.pageX
			y: event.pageY
	
	mousemove: (event) =>
		
		cancelEvent(event)
		
		@startPoint ?=
			x: event.pageX
			y: event.pageY
		
		@centerPoint ?= @startPoint
		
		if @isPinchKeyDown and not @isPanKeyDown
			@touchPoint = @pinchPoint(@point, @centerPoint)
			@touchPointDelta = Utils.pointSubtract(@point, @touchPoint)
			
		if @isPinchKeyDown and @isPanKeyDown
			@touchPoint = @panPoint(@point, @touchPointDelta)

		if @isPinchKeyDown or @isPanKeyDown
			@imageLayer.visible = true
			@imageLayer.midX = @touchPoint.x
			@imageLayer.midY = @touchPoint.y
	
		if @isPinchKeyDown or @isPanKeyDown
			dispatchTouchEvent("touchmove", event, @touchPointDelta)
		else
			dispatchTouchEvent("touchmove", event)

	mouseup: (event) =>
		
		@isMouseDown = false
		
		cancelEvent(event)
		
		@wrap(document).removeEventListener("mousemove", @mousemove, true)
		@wrap(document).removeEventListener("mouseup", @mouseup, true)

		if @isPinchKeyDown or @isPanKeyDown
			dispatchTouchEvent("touchend", event, @touchPointDelta)
		else
			dispatchTouchEvent("touchend", event)
	
		@imageLayer.image = @mouseCursorImage
		@imageLayer.states.switch("hide")
	
	pinchPoint: (point, centerPoint) ->
		return Utils.pointSubtract(centerPoint, 
			Utils.pointSubtract(point, centerPoint))
	
	panPoint: (point, offsetPoint) ->
		return Utils.pointSubtract(point, offsetPoint)

exports.enable = ->
	emulator = new TouchEmulator()