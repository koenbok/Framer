EventManagerIdCounter = 0

class EventManagerElement

	constructor: (@element) ->
		@_events = {}

	addEventListener: (eventName, listener) ->
		@_events[eventName] ?= []
		@_events[eventName].push listener
		@element.addEventListener(eventName, listener)

	removeEventListener: (event, listener) ->
		return unless @_events
		return unless @_events[event]
		
		@_events[event] = _.without @_events[event], listener		
		@element.removeEventListener(event, listener)

		return

	removeAllEventListeners: (eventName) ->
		
		events = if eventName then [eventName] else _.keys(@_events)

		for eventName in events
			for eventListener in @_events[eventName]
				@removeEventListener eventName, eventListener

		return

	once: (event, listener) ->

		fn = =>
			@removeListener event, fn
			listener arguments...

		@on event, fn

	on: @::addEventListener
	off: @::removeEventListener
	
class exports.EventManager

	constructor: (element) ->
		@_elements = {}

	wrap: (element) =>

		if not element._eventManagerId
			element._eventManagerId = EventManagerIdCounter++
		
		if not @_elements[element._eventManagerId]
			@_elements[element._eventManagerId] = new EventManagerElement(element)
		
		console.log @_elements

		@_elements[element._eventManagerId]
	
	reset: ->
		for element, elementEventManager of @_elements
			elementEventManager.removeAllEventListeners()