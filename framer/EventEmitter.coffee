{_} = require "./Underscore"

EventEmitterEventsKey = "_events"

class exports.EventEmitter
	
	constructor: ->
		@[EventEmitterEventsKey] = {}

	_eventCheck: (event, method) ->
		if not event
			console.warn "#{@constructor.name}.#{method} missing event (like 'click')"

	emit: (event, arg1, arg2, arg3, arg4) ->
		
		# We skip it here because we need all the perf we can get
		# @_eventCheck event, "emit"

		if @[EventEmitterEventsKey] and @[EventEmitterEventsKey].hasOwnProperty(event)
			for listener in @[EventEmitterEventsKey][event]
				listener(arg1, arg2, arg3, arg4)

		return 0

	addListener: (event, listener) ->
		
		@_eventCheck event, "addListener"
		
		@[EventEmitterEventsKey] ?= {}
		@[EventEmitterEventsKey][event] ?= []
		@[EventEmitterEventsKey][event].push listener

	removeListener: (event, listener) ->
		
		@_eventCheck event, "removeListener"
		
		return unless @[EventEmitterEventsKey]
		return unless @[EventEmitterEventsKey][event]
		
		@[EventEmitterEventsKey][event] = _.without @[EventEmitterEventsKey][event], listener

		return

	once: (event, listener) ->

		fn = =>
			@removeListener event, fn
			listener arguments...

		@on event, fn

	removeAllListeners: (event) ->
		
		return unless @[EventEmitterEventsKey]
		return unless @[EventEmitterEventsKey][event]
		
		for listener in @[EventEmitterEventsKey][event]
			@removeListener event, listener

		return
	
	on: @::addListener
	off: @::removeListener