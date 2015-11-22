Hammer = require "hammerjs"

class exports.GestureManagerElement

	constructor: (@element) ->
		
		@_events = {}
		@_manager = null
	
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


	_getExistingRecognizersForEventFamily: (eventFamily) ->

		# We need to mix recognizers for some gestures to be detected together
		# All these dependencies come from https://cdn.rawgit.com/hammerjs/hammer.js/master/tests/manual/visual.html
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
			else
		
		return existingRecognizers			


	addEventListener: (eventName, listener) ->
		#Lazy creation
		@_manager ?= new Hammer.Manager(@element)
		
		validEvent = true
		recognizer = undefined

		# Get event family to add different recognizers
		eventFamily = @_getEventFamily(eventName)

		# Add recognizer if needed
		switch eventFamily
			
			when Events.Pan
				if not @_manager.get(Events.Pan)
					recognizer = new Hammer.Pan({ event: Events.Pan})
			
			when Events.Pinch
				if not @_manager.get(Events.Pinch)
					recognizer = new Hammer.Pinch({ event: Events.Pinch})
			
			when Events.Press
				if not @_manager.get(Events.Press)
					recognizer = new Hammer.Press({ event: Events.Press})
			
			when Events.Rotate
				if not @_manager.get(Events.Rotate)
					recognizer = new Hammer.Rotate({ event: Events.Rotate})
			
			when Events.Swipe
				if not @_manager.get(Events.Swipe)
					recognizer = new Hammer.Swipe({ event: Events.Swipe})
			
			when Events.Tap
				if not @_manager.get(Events.Tap)
					recognizer = new Hammer.Tap({ event: Events.Tap})
			
			when Events.DoubleTap
				if not @_manager.get(Events.DoubleTap)
					recognizer = new Hammer.Tap({ event: Events.DoubleTap, taps: 2})
			
			else
				validEvent = false

		if recognizer
			# Add other recognizers if they existed already
			existingRecognizers = @_getExistingRecognizersForEventFamily(eventFamily)
			if existingRecognizers.length > 0
				@_manager.add(recognizer).recognizeWith(existingRecognizers)
			else
				@_manager.add recognizer

		if validEvent
			@_manager.on eventName, listener

	removeEventListener: (eventName, listener) ->