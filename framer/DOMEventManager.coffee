{_} = require "./Underscore"
{EventEmitter} = require "./EventEmitter"

Utils = require "./Utils"

EventManagerIdCounter = 0

class DOMEventManagerElement extends EventEmitter

	constructor: (@element) ->

	addListener: (eventName, listener, capture=false) ->
		listener.capture = capture # Make sure we store capture too
		super(eventName, listener)
		@element.addEventListener(eventName, listener, capture)

	removeListener: (eventName, listener, capture=false) ->
		super(eventName, listener)
		@element.removeEventListener(eventName, listener, listener.capture)

	# Keep the DOM API working
	addEventListener: @::addListener
	removeEventListener: @::removeListener

	# Keep the Node API working
	on: @::addListener
	off: @::removeListener

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
