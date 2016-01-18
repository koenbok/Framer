{_} = require "./Underscore"
{EventEmitter} = require "./EventEmitter"
{GestureManagerElement} = require "./GestureManager"

Utils = require "./Utils"

EventManagerIdCounter = 0

class DOMEventManagerElement extends EventEmitter

	constructor: (@element) ->

	addListener: (eventName, listener, capture=false) ->	
		super(eventName, listener)
		@element.addEventListener(eventName, listener, false)

	removeListener: (eventName, listener) ->
		super(eventName, listener)
		@element.removeEventListener(eventName, listener, false)

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
