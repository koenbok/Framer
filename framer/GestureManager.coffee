Hammer = require "hammerjs"

class exports.GestureManager

	constructor: (@element) ->
		@_events = {}
		@_manager = null
	
	addEventListener: (eventName, listener) ->
		#Lazy creation
		@_manager ?= new Hammer.Manager(@element)
		
		# Add recognizer if needed
		switch eventName
			when Events.Press, Events.PressUp
				if not @_manager.get(Events.Press)
					@_manager.add new Hammer.Press({ event: Events.Press})
				recognizer = new Hammer.Press({ event: Events.Press }) 
			when Events.Pinch, Events.PinchStart, Events.PinchEnd
				if not @_manager.get(Events.Pinch)
					@_manager.add new Hammer.Pinch({ event: Events.Pinch})
			when Events.Pan
				recognizer = new Hammer.Pan({ event: Events.Pan })
			when Events.Swipe, Events.SwipeLeft, Events.SwipeRight, Events.SwipeUp, Events.SwipeDown
				if not @_manager.get(Events.Swipe)
					# TODO Handle different directions
					@_manager.add new Hammer.Swipe({ event: Events.Swipe})
			else
		
		@_manager.on eventName, listener

	removeEventListener: (eventName, listener) ->
