{_} = require "./Underscore"
{EventEmitter} = require "./EventEmitter"

Utils = require "./Utils"

EventManagerIdCounter = 0

class DOMEventManagerElement extends EventEmitter

	constructor: (@element) ->

	addListener: (eventName, listener) ->	
		super(eventName, listener)
		@element.addEventListener(eventName, listener)

	removeListener: (eventName, listener) ->
		super(eventName, listener)
		@element.removeEventListener(eventName, listener)

	# Keep the DOM API working
	addEventListener: @::addListener
	removeEventListener: @::removeListener
	
class exports.DOMEventManager

	constructor: (element) ->
		@_elements = {}

	wrap: (element) =>

		if not element._eventManagerId
			element._eventManagerId = EventManagerIdCounter++
		
		if not @_elements[element._eventManagerId]
			@_elements[element._eventManagerId] = new DOMEventManagerElement(element)

		@_elements[element._eventManagerId]
	
	reset: ->
		for element, elementEventManager of @_elements
			elementEventManager.removeAllListeners()