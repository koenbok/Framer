{_} = require "./Underscore"

Utils = require "./Utils"

EventManagerIdCounter = 0

class EventManagerElement

	constructor: (@element) ->
		@_events = {}

	addEventListener: (eventName, listener) ->
		
		# Filter out all the events that are not dom valid
		if not Utils.domValidEvent(@element, eventName)
			return

		@_events[eventName] ?= []
		@_events[eventName].push(listener)
		
		@element.addEventListener(eventName, listener)

	removeEventListener: (eventName, listener) ->
		return unless @_events
		return unless @_events[eventName]

		@_events[eventName] = _.without @_events[eventName], listener		
		@element.removeEventListener(eventName, listener)

		return

	removeEventListeners: (eventName) ->
		@removeAllEventListeners(eventName)

	removeAllEventListeners: (eventName) ->

		events = if eventName then [eventName] else _.keys(@_events)

		for eventName in events
			continue unless @_events[eventName]
			for eventListener in @_events[eventName]
				@removeEventListener eventName, eventListener

		return

	listeners: ->
		return _.clone(@_events)

	listenersForEvent: (eventName) ->
		return [] unless @_events
		return [] unless @_events[eventName]
		return _.clone(@_events[eventName])

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

		@_elements[element._eventManagerId]
	
	reset: ->
		for element, elementEventManager of @_elements
			elementEventManager.removeAllEventListeners()