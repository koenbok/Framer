class exports.EventEmitter
	
	constructor: ->
		@events = {}

	emit: (event, args...) ->
		
		if not @events?[event]
			return
		
		for listener in @events[event]
			listener args...

	addListener: (event, listener) ->
		
		# @emit "addListener", event, listener
		
		@events ?= {}
		@events[event] ?= []
		@events[event].push listener

	removeListener: (event, listener) ->
		
		# @emit "removeListener", event, listener
		
		return unless @events
		return unless @events[event]
		
		@events[event] = (l for l in @events[event] when l isnt listener)

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