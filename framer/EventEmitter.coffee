{_} = require "./Underscore"



class exports.EventEmitter
	
	constructor: ->
		@events = {}

	_eventCheck: (event, method) ->
		if not event
			console.warn "#{@constructor.name}.#{method} missing event (like 'click')"

	emit: (event, args...) ->
		
		# We skip it here because we need all the perf we can get
		# @_eventCheck event, "emit"

		if not @events?[event]
			return
		
		for listener in @events[event]
			listener args...
		
		return

	addListener: (event, listener) ->
		
		@_eventCheck event, "addListener"
		
		@events ?= {}
		@events[event] ?= []
		@events[event].push listener

	removeListener: (event, listener) ->
		
		@_eventCheck event, "removeListener"
		
		return unless @events
		return unless @events[event]
		
		@events[event] = _.without @events[event], listener

		return

	once: (event, listener) ->

		fn = =>
			@removeListener event, fn
			listener arguments...

		@on event, fn

	removeAllListeners: (event) ->
		
		return unless @events
		return unless @events[event]
		
		for listener in @events[event]
			@removeListener event, listener
	
	on: @::addListener
	off: @::removeListener