{_} = require "./Underscore"
{EventEmitter} = require "eventemitter3"

# exports.EventEmitter = EventEmitter

EventKey = "_events"

class exports.EventEmitter

	emit: (eventName, args...) ->
		return false unless @[EventKey]
		return false unless @[EventKey][eventName]
		@callListener(eventName, listener, args...) for listener in @[EventKey][eventName]
		return true

	addListener: (eventName, listener) ->

		if not eventName
			throw Error "addListener needs an eventName"

		if not listener
			throw Error "addListener needs a listener"

		@[EventKey] = {} if not @[EventKey]
		@[EventKey][eventName] = [] if not @[EventKey][eventName]
		@[EventKey][eventName].push(listener)
		return null

	removeListener: (eventName, listener) ->

		if not listener
			throw Error "removeListener needs a listener object. You can use removeListeners(eventName)"

		return @ unless @[EventKey]
		return @ unless @[EventKey][eventName]

		@[EventKey][eventName] = (l for l in @[EventKey][eventName] when l isnt listener)

		# This is not really needed, but cleans the keys for event listeners when
		# there are none left. Avoids confusion when looking at .listeners()
		if not @listenersForEvent(eventName).length
			delete @[EventKey][eventName]

		return null

	callListener: (eventName, listener, args...) ->
		listener(args...)
		return null

	on: @::addListener
	off: @::removeListener

	# Utility methods

	once: (eventName, listener) ->
		fn = =>
			@removeListener(eventName, fn)
			@callListener(eventName, listener, arguments...)
		@on(eventName, fn)
		return @

	listeners: ->
		return _.clone(@[EventKey])

	listenersForEvent: (eventName) ->
		return [] unless @[EventKey]
		return [] unless @[EventKey][eventName]
		return _.clone(@[EventKey][eventName])

	removeListeners: (eventName) ->
		return @ unless @[EventKey]
		return @ unless @[EventKey][eventName]
		for listener in @[EventKey][eventName]
			@removeListener(eventName, listener)

	removeAllListeners: (filterEventName) ->
		return @ unless @[EventKey]
		for eventName, eventListeners of @[EventKey]
			for listener in eventListeners
				@removeListener(eventName, listener)

