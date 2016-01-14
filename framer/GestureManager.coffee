{_} = require "./Underscore"
Hammer = require "hammerjs"

Utils = require "./Utils"
{EventEmitter} = require "./EventEmitter"
{Gestures} = require "./Gestures"

class exports.GestureManager extends EventEmitter

	constructor: (@layer) ->
		@_manager = Hammer(@layer._element)

	addListener: (eventName, listener) ->

		super(eventName, listener)

		# Make sure we have a hammer instance and layer listeners enabled
		
		@layer.ignoreEvents = false

		eventFamily = @_getEventFamily(eventName)
		[validEvent, recognizer] = @_getRecognizer(eventFamily)

		if recognizer
			
			# Add other recognizers if they existed already
			existingRecognizers = @_getDependentRecognizersForEventFamily(eventFamily)
			
			if existingRecognizers.length > 0
				@_manager.add(recognizer).recognizeWith(existingRecognizers)
			else
				@_manager.add(recognizer)

		if validEvent

			# Wrap this layer so we control the scope
			listener._actual = (event) =>
				listener.apply(@layer, [event, @layer])

			@_manager.on(eventName, listener._actual)

	removeListener: (eventName, listener) ->
		super(eventName, listener)
		@_manager.off(eventName, listener._actual)

	destroy: ->
		@_manager.destroy()
		@_manager = null

	on: @::addListener
	off: @::removeListener

	_getEventFamily: (eventName) ->
		
		eventFamily = undefined
		
		switch eventName
			
			when Events.Pan, Events.PanStart, Events.PanMove, Events.PanEnd, Events.PanCancel, Events.PanLeft, Events.PanRight,	Events.PanUp, Events.PanDown
				eventFamily = Events.Pan
			
			when Events.Pinch, Events.PinchStart, Events.PinchMove, Events.PinchEnd, Events.PinchCancel, Events.PinchIn, Events.PinchOut
				eventFamily = Events.Pinch
			
			when Events.Press, Events.PressUp
				eventFamily = Events.Press
			
			when Events.Rotate, Events.RotateStart, Events.RotateMove, Events.RotateEnd, Events.RotateCancel
				eventFamily = Events.Rotate
			
			when Events.Swipe, Events.SwipeLeft, Events.SwipeRight, Events.SwipeUp, Events.SwipeDown
				eventFamily = Events.Swipe
			
			when Events.Tap, Events.SingleTap
				eventFamily = Events.Tap
			
			when Events.DoubleTap # Tap and DoubleTap need different type of recognizers
				eventFamily = Events.DoubleTap
			
			else
		
		return eventFamily


	_getRecognizer: (eventFamily) ->

		validEvent = true
		recognizer = undefined

		# Add recognizer if needed
		switch eventFamily
			
			when Events.Pan
				if not @_manager.get(Events.Pan)
					recognizer = new Hammer.Pan({event:Events.Pan})
			
			when Events.Pinch
				if not @_manager.get(Events.Pinch)
					recognizer = new Hammer.Pinch({event:Events.Pinch})
			
			when Events.Press
				if not @_manager.get(Events.Press)
					recognizer = new Hammer.Press({event:Events.Press})
			
			when Events.Rotate
				if not @_manager.get(Events.Rotate)
					recognizer = new Hammer.Rotate({event:Events.Rotate})
			
			when Events.Swipe
				if not @_manager.get(Events.Swipe)
					recognizer = new Hammer.Swipe({event:Events.Swipe})
			
			when Events.Tap
				if not @_manager.get(Events.Tap)
					recognizer = new Hammer.Tap({event:Events.Tap})
			
			when Events.DoubleTap
				if not @_manager.get(Events.DoubleTap)
					recognizer = new Hammer.Tap({event:Events.DoubleTap, taps:2})
			
			else
				validEvent = false

		return [validEvent, recognizer]


	_getDependentRecognizersForEventFamily: (eventFamily) ->

		# We need to add simultaneous recognition for certain gestures to be detected together
		# See http://hammerjs.github.io/recognize-with/
		
		# All these dependencies come from 
		# https://cdn.rawgit.com/hammerjs/hammer.js/master/tests/manual/visual.html
		
		existingRecognizers = []
		
		switch eventFamily
			
			when Events.Pan # Pan depends on Swipe, Rotate and Pinch
				if swipe = @_manager.get(Events.Swipe)
					existingRecognizers.push(swipe)
				if rotate = @_manager.get(Events.Rotate)
					existingRecognizers.push(rotate)
				if pinch = @_manager.get(Events.Pinch)
					existingRecognizers.push(pinch)
			
			when Events.Swipe # Swipe depends on Pan
				if pan = @_manager.get(Events.Pan)
					existingRecognizers.push(pan)
			
			when Events.Rotate # Rotate depends on Pan and Pinch
				if pan = @_manager.get(Events.Pan)
					existingRecognizers.push(pan)
				if pinch = @_manager.get(Events.Pinch)
					existingRecognizers.push(pinch)
			
			when Events.Pinch # Pinch depends on Pan and Rotate
				if pan = @_manager.get(Events.Pan)
					existingRecognizers.push(pan)
				if rotate = @_manager.get(Events.Pinch)
					existingRecognizers.push(rotate)

			when Events.DoubleTap # DoubleTap depends on Tap
				if tap = @_manager.get(Events.Tap)
					existingRecognizers.push(tap)
		
		return existingRecognizers			

	onPan: (cb) -> @on(Gestures.Pan, cb)
	onPanStart: (cb) -> @on(Gestures.PanStart, cb)
	onPanMove: (cb) -> @on(Gestures.PanMove, cb)
	onPanEnd: (cb) -> @on(Gestures.PanEnd, cb)
	onPanCancel: (cb) -> @on(Gestures.PanCancel, cb)
	onPanLeft: (cb) -> @on(Gestures.PanLeft, cb)
	onPanRight: (cb) -> @on(Gestures.PanRight, cb)
	onPanUp: (cb) -> @on(Gestures.PanUp, cb)
	onPanDown: (cb) -> @on(Gestures.PanDown, cb)

	onPinch: (cb) -> @on(Gestures.Pinch, cb)
	onPinchStart: (cb) -> @on(Gestures.PinchStart, cb)
	onPinchMove: (cb) -> @on(Gestures.PinchMove, cb)
	onPinchEnd: (cb) -> @on(Gestures.PinchEnd, cb)
	onPinchCancel: (cb) -> @on(Gestures.PinchCancel, cb)
	onPinchIn: (cb) -> @on(Gestures.PinchIn, cb)
	onPinchOut: (cb) -> @on(Gestures.PinchOut, cb)

	onPress: (cb) -> @on(Gestures.Press, cb)
	onPressUp: (cb) -> @on(Gestures.PressUp, cb)

	onRotate: (cb) -> @on(Gestures.Rotate, cb)
	onRotateStart: (cb) -> @on(Gestures.RotateStart, cb)
	onRotateMove: (cb) -> @on(Gestures.RotateMove, cb)
	onRotateEnd: (cb) -> @on(Gestures.RotateEnd, cb)
	onRotateCancel: (cb) -> @on(Gestures.RotateCancel, cb)

	onSwipe: (cb) -> @on(Gestures.Swipe, cb)
	onSwipeLeft: (cb) -> @on(Gestures.SwipeLeft, cb)
	onSwipeRight: (cb) -> @on(Gestures.SwipeRight, cb)
	onSwipeUp: (cb) -> @on(Gestures.SwipeUp, cb)
	onSwipeDown: (cb) -> @on(Gestures.SwipeDown, cb)

	onTap: (cb) -> @on(Gestures.Tap, cb)
	onSingleTap: (cb) -> @on(Gestures.SingleTap, cb)
	onDoubleTap: (cb) -> @on(Gestures.DoubleTap, cb)


##############################################################
# PATCH HAMMER

# This is a nasty monkey patch to get Hammer to use the DOMEventManager
# We're not going to use this for now, but we can if things become slow.

# getWindowForElement = (element) ->
# 	doc = element.ownerDocument or element
# 	return doc.defaultView or doc.parentWindow or window

# splitStr = (str) ->
# 	return str.trim().split(/\s+/g)

# addEventListeners = (target, types, handler) ->
# 	splitStr(types).map (type) ->
# 		Framer.CurrentContext.domEventManager.wrap(target)
# 			.addEventListener(type, handler, false)

# removeEventListeners = (target, types, handler) ->
# 	splitStr(types).map (type) ->
# 		Framer.CurrentContext.domEventManager.wrap(target)
# 			.removeEventListener(type, handler, false)

# Hammer.Input::init = ->
# 	@evEl and addEventListeners(@element, @evEl, @domHandler)
# 	@evTarget and addEventListeners(@target, @evTarget, @domHandler)
# 	@evWin and addEventListeners(getWindowForElement(@element), @evWin, @domHandler)
# 	return

# Hammer.Input::destroy = ->
# 	@evEl and removeEventListeners(@element, @evEl, @domHandler)
# 	@evTarget and removeEventListeners(@target, @evTarget, @domHandler)
# 	@evWin and removeEventListeners(getWindowForElement(@element), @evWin, @domHandler)
# 	return