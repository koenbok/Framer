Hammer = require "hammerjs"

class exports.GestureManager

	constructor: (@element) ->
		@_events = {}
		@_manager = null
	
	addEventListener: (eventName, listener) ->
		#Lazy creation
		@_manager ?= new Hammer.Manager(@element)
		
		validEvent = true

		# Add recognizer if needed
		switch eventName
			when Events.Pan, Events.PanStart, Events.PanMove, Events.PanEnd, Events.PanCancel, Events.PanLeft, Events.PanRight,	Events.PanUp, Events.PanDown
				if not @_manager.get(Events.Pan)
					@_manager.add new Hammer.Pan({ event: Events.Pan})
				recognizer = new Hammer.Pan({ event: Events.Pan }) 
			when Events.Pinch, Events.PinchStart, Events.PinchMove, Events.PinchEnd, Events.PinchCancel, Events.PinchIn, Events.PinchOut
				if not @_manager.get(Events.Pinch)
					@_manager.add new Hammer.Pinch({ event: Events.Pinch})
			when Events.Press, Events.PressUp
				if not @_manager.get(Events.Press)
					@_manager.add new Hammer.Press({ event: Events.Press})
				recognizer = new Hammer.Press({ event: Events.Press }) 
			when Events.Rotate, Events.RotateStart, Events.RotateMove, Events.RotateEnd, Events.RotateCancel
				if not @_manager.get(Events.Rotate)
					@_manager.add new Hammer.Rotate({ event: Events.Rotate})
				recognizer = new Hammer.Rotate({ event: Events.Rotate }) 
			when Events.Swipe, Events.SwipeLeft, Events.SwipeRight, Events.SwipeUp, Events.SwipeDown
				if not @_manager.get(Events.Swipe)
					@_manager.add new Hammer.Swipe({ event: Events.Swipe})
			when Events.Tap, Events.SingleTap
				if not @_manager.get(Events.Tap)
					@_manager.add new Hammer.Tap({ event: Events.Tap})
			when Events.DoubleTap
				if not @_manager.get(Events.Tap)
					@_manager.add new Hammer.Tap({ event: Events.Tap, taps: 2})
			else
				validEvent = false

		if validEvent
			@_manager.on eventName, listener

	removeEventListener: (eventName, listener) ->