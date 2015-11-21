Utils = require "./Utils"
{GestureManagerElement} = require "./GestureManager"

EventManagerIdCounter = 0

class EventManagerElement

	constructor: (@element) ->
		@_events = {}
		@_elementGestureManager = new GestureManagerElement(@element)

	addEventListener: (eventName, listener) ->
		
		# Filter out all the events that are not dom valid or a gesture
		return unless Utils.domValidEvent(@element, eventName) or Events.isGestureEvent eventName
		
		@_events[eventName] ?= []
		@_events[eventName].push(listener)
		
		if Events.isGestureEvent eventName
			@_elementGestureManager.addEventListener(eventName, listener)
		else
			@element.addEventListener(eventName, listener)

	removeEventListener: (eventName, listener) ->
		return unless @_events
		return unless @_events[eventName]

		@_events[eventName] = _.without @_events[eventName], listener		
		
		if Events.isGestureEvent eventName
			@_elementGestureManager.removeEventListener(eventName, listener)
		else
			@element.removeEventListener(eventName, listener)

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

		@_elements[element._eventManagerId]
	
	reset: ->
		for element, elementEventManager of @_elements
			elementEventManager.removeAllEventListeners()