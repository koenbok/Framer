{_} = require "./Underscore"

# exports.EventEmitter = EventEmitter

EventKey = "_events"
EventListenersCountKey = "_eventsListenersCount"
DefaultMaximumListeners = 100

class exports.EventEmitter

	emit: (eventName, args...) ->
		return false unless @[EventKey]
		return false unless @[EventKey][eventName]
		@callListener(eventName, listener, args...) for listener in @[EventKey][eventName]
		return true

	addListener: (eventName, listener) ->

		if not eventName
			throw new Error "addListener needs an eventName"

		if not listener
			throw new Error "addListener needs a listener"

		@[EventKey] = {} if not @[EventKey]
		@[EventKey][eventName] = [] if not @[EventKey][eventName]
		@[EventKey][eventName].push(listener)

		@[EventListenersCountKey] ?= 0
		@[EventListenersCountKey]++

		maximumListeners = @maximumListeners or DefaultMaximumListeners

		if @[EventListenersCountKey] > maximumListeners
			throw new Error "More than the maximum allowed listeners #{@[EventListenersCountKey]}, possible leak. You can increase the maximum by setting .maximumListeners"

		return null

	removeListener: (eventName, listener) ->

		if not listener
			throw new Error "removeListener needs a listener object. You can use removeListeners(eventName)"

		return @ unless @[EventKey]
		return @ unless @[EventKey][eventName]

		@[EventKey][eventName] = (l for l in @[EventKey][eventName] when l isnt listener)
		@[EventListenersCountKey]--

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

	removeAllListeners: ->
		return @ unless @[EventKey]
		for eventName, eventListeners of @[EventKey]
			for listener in eventListeners
				@removeListener(eventName, listener)

