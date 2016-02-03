Utils = require "../Utils"
{BaseClass} = require "../BaseClass"

createTouch = (event, identifier, offset={x:0, y:0}) ->
	return touch =
		identifier: identifier
		target: event.target
		pageX: event.pageX - offset.x
		pageY: event.pageY - offset.y
		clientX: event.clientX - offset.x
		clientY: event.clientY - offset.y
		screenX: event.screenX - offset.x
		screenY: event.screenY - offset.y

dispatchTouchEvent = (type, target, event, offset) ->
	
	target ?= event.target

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

	target.dispatchEvent(touchEvent)

cancelEvent = (event) ->
	event.preventDefault()
	event.stopPropagation()

class TouchEmulator extends BaseClass

	constructor: ->
		
		@touchPointerImage = "framer/images/cursor@2x.png"
		@touchPointerImageActive = "framer/images/cursor-active@2x.png"
		@touchPointerImageSize = 64
		@touchPointerInitialOffset = {x:0, y:0}
		
		@keyPinchCode = 18 # Alt
		@keyPanCode = 91 # Command
		
		@context = new Framer.Context name:"TouchEmulator"
		@context._element.style.zIndex = 10000
		@wrap = @context.domEventManager.wrap
		
		@wrap(document).addEventListener("mousedown", @mousedown, true)
		@wrap(document).addEventListener("mousemove", @mousemove, true)
		@wrap(document).addEventListener("mouseup", @mouseup, true)
		@wrap(document).addEventListener("keydown", @keydown, true)
		@wrap(document).addEventListener("keyup", @keyup, true)
		@wrap(document).addEventListener("mouseout", @mouseout, true)
		
		@isMouseDown = false
		@isPinchKeyDown = false
		@isPanKeyDown = false
		
		touchPointerInitialOffset = @touchPointerInitialOffset

		@context.run =>
			@touchPointLayer = new Layer
				width: @touchPointerImageSize
				height: @touchPointerImageSize
				image: @touchPointerImage
				opacity: 0
	
	destroy: ->
		@context.reset()
		@context = null

	# Event handlers

	keydown: (event) =>

		if event.keyCode is @keyPinchCode	
			@isPinchKeyDown = true
			@startPoint = @centerPoint = null
			@showTouchCursor()
			@touchPointLayer.midX = @point.x
			@touchPointLayer.midY = @point.y
			
		if event.keyCode is @keyPanCode
			@isPanKeyDown = true
			cancelEvent(event)
			
	keyup: (event) =>
	
		if event.keyCode is @keyPinchCode
			cancelEvent(event)	
			@isPinchKeyDown = false
			@hideTouchCursor()
		
		if event.keyCode is @keyPanCode
			cancelEvent(event)
			if @touchPoint and @point
				@centerPoint = Utils.pointCenter(@touchPoint, @point)
				@isPanKeyDown = false
			

	mousedown: (event) =>

		cancelEvent(event)
		
		@isMouseDown = true
		@target = event.target
			
		if @isPinchKeyDown
			dispatchTouchEvent("touchstart", @target, event, @touchPointDelta)
		else
			dispatchTouchEvent("touchstart", @target, event)
		
		@touchPointLayer.image = @touchPointerImageActive
	
	mousemove: (event) =>

		@point =
			x: event.pageX
			y: event.pageY

		cancelEvent(event)

		@startPoint ?= @point 
		@centerPoint ?= @point
		
		if @isPinchKeyDown and not @isPanKeyDown
			if @touchPointerInitialOffset and @centerPoint
				@touchPoint = Utils.pointAdd(@touchPointerInitialOffset, @pinchPoint(@point, @centerPoint))
				@touchPointDelta = Utils.pointSubtract(@point, @touchPoint)
			
		if @isPinchKeyDown and @isPanKeyDown
			if @touchPoint and @touchPointDelta
				@touchPoint = @panPoint(@point, @touchPointDelta)

		if @isPinchKeyDown or @isPanKeyDown
			if @touchPoint
				@touchPointLayer.visible = true
				@touchPointLayer.midX = @touchPoint.x
				@touchPointLayer.midY = @touchPoint.y
	
		if @isMouseDown
			if (@isPinchKeyDown or @isPanKeyDown) and @touchPointDelta
				dispatchTouchEvent("touchmove", @target, event, @touchPointDelta)
			else
				dispatchTouchEvent("touchmove", @target, event)

	mouseup: (event) =>
			
		cancelEvent(event)

		if @isPinchKeyDown or @isPanKeyDown
			dispatchTouchEvent("touchend", @target, event, @touchPointDelta)
		else
			dispatchTouchEvent("touchend", @target, event)

		@endMultiTouch()
	
	mouseout: (event) =>

		return if @isMouseDown

		fromElement = event.relatedTarget or event.toElement

		if not fromElement or fromElement.nodeName is "HTML"
			@endMultiTouch()

	# Utilities

	showTouchCursor: ->
		@touchPointLayer.animateStop()
		@touchPointLayer.midX = @point.x
		@touchPointLayer.midY = @point.y
		@touchPointLayer.scale = 1.8
		@touchPointLayer.animate
			properties:
				opacity: 1
				scale: 1
				# midX: @point.x + @touchPointerInitialOffset.x
				# midY: @point.y + @touchPointerInitialOffset.y
			time: 0.1
			curve: "ease-out"

	hideTouchCursor: ->
		@touchPointLayer.animateStop()
		@touchPointLayer.animate
			properties:
				opacity: 0
				scale: 1.2
			time: 0.08

	mousemovePosition: (event) =>
		@point =
			x: event.pageX
			y: event.pageY

	endMultiTouch: ->
		@isMouseDown = false
		@touchPointLayer.image = @touchPointerImage
		@hideTouchCursor()
	
	pinchPoint: (point, centerPoint) ->
		return Utils.pointSubtract(centerPoint, 
			Utils.pointSubtract(point, centerPoint))
	
	panPoint: (point, offsetPoint) ->
		return Utils.pointSubtract(point, offsetPoint)

touchEmulator = null

exports.enable = ->
	return if Utils.isTouch()
	touchEmulator ?= new TouchEmulator()

exports.disable = ->
	return unless touchEmulator
	touchEmulator.destroy()