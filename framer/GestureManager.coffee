{_} = require "./Underscore"
Hammer = require "hammerjs"

Utils = require "./Utils"
{EventEmitter} = require "./EventEmitter"
{Gestures} = require "./Gestures"

class exports.GestureManager extends EventEmitter

	constructor: (@layer) ->

	once: (eventName, listener) =>
		super(eventName, listener)
		@_addListener eventName, (e) =>
			@removeListener(eventName, listener)
			listener.apply(@layer, [e, @layer])

	addListener: (eventName, listener) =>
		super(eventName, listener)
		@_addListener(eventName, listener)

	removeListener: (eventName, listener) ->
		super(eventName, listener)
		@_removeListener(eventName, listener)

	_addListener: (eventName, listener) ->

		throw new Error("No event name defined") unless eventName
		throw new Error("No listener defined") unless listener

		@_manager = Hammer(@layer._element)

		# Make sure we have a hammer instance and layer listeners enabled
		@layer.ignoreEvents = false

		eventFamily = @_getEventFamily(eventName)
		throw new Error("Cannot find gesture family for #{eventName}") unless eventName

		recognizer = @_getRecognizer(eventFamily)
		throw new Error("Cannot find gesture recognizer for #{eventFamily}") unless eventFamily

		# Add other recognizers if they existed already
		existingRecognizers = @_getDependentRecognizersForEventFamily(eventFamily)

		if existingRecognizers.length > 0
			recognizer.recognizeWith(existingRecognizers)

		@_manager.add(recognizer)

		# Wrap this layer so we control the scope
		listener._actual = (event) =>
			listener.apply(@layer, [event, @layer])

		@_manager.on(eventName, listener._actual)

	_removeListener: (eventName, listener) ->

		# If this is the last listener we detroy the hammer element
		if @listenerEvents().length is 1 and @listenerEvents()[0] is eventName
			@_manager.destroy()
		else
			listener = listener._actual if listener._actual
			@_manager.off(eventName, listener)

	destroy: ->
		@_manager.destroy()
		@_manager = null

	on: @::addListener
	off: @::removeListener

	_getEventFamily: (eventName) ->
		
		switch eventName
			
			when Gestures.Pan, Gestures.PanStart, Gestures.PanMove, Gestures.PanEnd, Gestures.PanCancel, Gestures.PanLeft, Gestures.PanRight,	Gestures.PanUp, Gestures.PanDown
				return Gestures.Pan
			
			when Gestures.Pinch, Gestures.PinchStart, Gestures.PinchMove, Gestures.PinchEnd, Gestures.PinchCancel, Gestures.PinchIn, Gestures.PinchOut
				return Gestures.Pinch
			
			when Gestures.Press, Gestures.PressUp
				return Gestures.Press
			
			when Gestures.Rotate, Gestures.RotateStart, Gestures.RotateMove, Gestures.RotateEnd, Gestures.RotateCancel
				return Gestures.Rotate
			
			when Gestures.Swipe, Gestures.SwipeLeft, Gestures.SwipeRight, Gestures.SwipeUp, Gestures.SwipeDown
				return Gestures.Swipe
			
			when Gestures.Tap, Gestures.SingleTap
				return Gestures.Tap
			
			when Gestures.DoubleTap # Tap and DoubleTap need different type of recognizers
				return Gestures.DoubleTap

	_getRecognizer: (eventFamily) ->

		switch eventFamily
			
			when Gestures.Pan
				return new Hammer.Pan({event:Gestures.Pan})
			
			when Gestures.Pinch
				return new Hammer.Pinch({event:Gestures.Pinch})
			
			when Gestures.Press
				return new Hammer.Press({event:Gestures.Press})
			
			when Gestures.Rotate
				return new Hammer.Rotate({event:Gestures.Rotate})
			
			when Gestures.Swipe
				return new Hammer.Swipe({event:Gestures.Swipe})
			
			when Gestures.Tap
				return new Hammer.Tap({event:Gestures.Tap})
			
			when Gestures.DoubleTap
				return new Hammer.Tap({event:Gestures.DoubleTap, taps:2})

	_getDependentRecognizersForEventFamily: (eventFamily) ->

		# We need to add simultaneous recognition for certain gestures to be detected together
		# See http://hammerjs.github.io/recognize-with/
		
		# All these dependencies come from 
		# https://cdn.rawgit.com/hammerjs/hammer.js/master/tests/manual/visual.html
		
		existingRecognizers = []
		
		switch eventFamily
			
			when Gestures.Pan # Pan depends on Swipe, Rotate and Pinch
				if swipe = @_manager.get(Gestures.Swipe)
					existingRecognizers.push(swipe)
				if rotate = @_manager.get(Gestures.Rotate)
					existingRecognizers.push(rotate)
				if pinch = @_manager.get(Gestures.Pinch)
					existingRecognizers.push(pinch)
			
			when Gestures.Swipe # Swipe depends on Pan
				if pan = @_manager.get(Gestures.Pan)
					existingRecognizers.push(pan)
			
			when Gestures.Rotate # Rotate depends on Pan and Pinch
				if pan = @_manager.get(Gestures.Pan)
					existingRecognizers.push(pan)
				if pinch = @_manager.get(Gestures.Pinch)
					existingRecognizers.push(pinch)
			
			when Gestures.Pinch # Pinch depends on Pan and Rotate
				if pan = @_manager.get(Gestures.Pan)
					existingRecognizers.push(pan)
				if rotate = @_manager.get(Gestures.Rotate)
					existingRecognizers.push(rotate)

			when Gestures.DoubleTap # DoubleTap depends on Tap
				if tap = @_manager.get(Gestures.Tap)
					existingRecognizers.push(tap)
		
		return existingRecognizers			

	# onPan: (cb) -> @on(Gestures.Pan, cb)
	# onPanStart: (cb) -> @on(Gestures.PanStart, cb)
	# onPanMove: (cb) -> @on(Gestures.PanMove, cb)
	# onPanEnd: (cb) -> @on(Gestures.PanEnd, cb)
	# onPanCancel: (cb) -> @on(Gestures.PanCancel, cb)
	# onPanLeft: (cb) -> @on(Gestures.PanLeft, cb)
	# onPanRight: (cb) -> @on(Gestures.PanRight, cb)
	# onPanUp: (cb) -> @on(Gestures.PanUp, cb)
	# onPanDown: (cb) -> @on(Gestures.PanDown, cb)

	# onPinch: (cb) -> @on(Gestures.Pinch, cb)
	# onPinchStart: (cb) -> @on(Gestures.PinchStart, cb)
	# onPinchMove: (cb) -> @on(Gestures.PinchMove, cb)
	# onPinchEnd: (cb) -> @on(Gestures.PinchEnd, cb)
	# onPinchCancel: (cb) -> @on(Gestures.PinchCancel, cb)
	# onPinchIn: (cb) -> @on(Gestures.PinchIn, cb)
	# onPinchOut: (cb) -> @on(Gestures.PinchOut, cb)

	# onPress: (cb) -> @on(Gestures.Press, cb)
	# onPressUp: (cb) -> @on(Gestures.PressUp, cb)

	# onRotate: (cb) -> @on(Gestures.Rotate, cb)
	# onRotateStart: (cb) -> @on(Gestures.RotateStart, cb)
	# onRotateMove: (cb) -> @on(Gestures.RotateMove, cb)
	# onRotateEnd: (cb) -> @on(Gestures.RotateEnd, cb)
	# onRotateCancel: (cb) -> @on(Gestures.RotateCancel, cb)

	# onSwipe: (cb) -> @on(Gestures.Swipe, cb)
	# onSwipeLeft: (cb) -> @on(Gestures.SwipeLeft, cb)
	# onSwipeRight: (cb) -> @on(Gestures.SwipeRight, cb)
	# onSwipeUp: (cb) -> @on(Gestures.SwipeUp, cb)
	# onSwipeDown: (cb) -> @on(Gestures.SwipeDown, cb)

	# onTap: (cb) -> @on(Gestures.Tap, cb)
	# onSingleTap: (cb) -> @on(Gestures.SingleTap, cb)
	# onDoubleTap: (cb) -> @on(Gestures.DoubleTap, cb)


##############################################################
# PATCH HAMMER

# This is a nasty monkey patch to get Hammer to use the DOMEventManager
# TODO: it would be better if it would use the layer context then current

getWindowForElement = (element) ->
	doc = element.ownerDocument or element
	return doc.defaultView or doc.parentWindow or window

splitStr = (str) ->
	return str.trim().split(/\s+/g)

addEventListeners = (target, types, handler) ->
	splitStr(types).map (type) ->
		#console.log("hammer.addEventListener", type)
		Framer.CurrentContext.domEventManager.wrap(target)
			.addEventListener(type, handler, false)

removeEventListeners = (target, types, handler) ->
	splitStr(types).map (type) ->
		#console.log("hammer.removeEventListener", type)
		Framer.CurrentContext.domEventManager.wrap(target)
			.removeEventListener(type, handler, false)

Hammer.Input::init = ->
	@evEl and addEventListeners(@element, @evEl, @domHandler)
	@evTarget and addEventListeners(@target, @evTarget, @domHandler)
	@evWin and addEventListeners(getWindowForElement(@element), @evWin, @domHandler)
	return

Hammer.Input::destroy = ->
	@evEl and removeEventListeners(@element, @evEl, @domHandler)
	@evTarget and removeEventListeners(@target, @evTarget, @domHandler)
	@evWin and removeEventListeners(getWindowForElement(@element), @evWin, @domHandler)
	return