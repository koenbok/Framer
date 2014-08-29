layer = new Layer

layer.on Events.Click, ->

	@scale = 2


# ctx = new Framer.Context()

# Framer.CurrentContext = ctx

runInContext = (ctx, f) ->

	previousContext = Framer.CurrentContext

	Framer.CurrentContext = ctx
	f()

	Framer.CurrentContext = previousContext

ctx = new Framer.Context()

runInContext ctx, ->

	layer = new Layer x:300

	layer.on Events.Click, ->
		print layer.id
		@scale = 2

runInContext ctx, ->
	
	layer = new Layer x:500

	layer.on Events.Click, ->
		print layer.id
		@scale = 2

ctx = new Framer.Context()

runInContext ctx, ->

	layer = new Layer x:200

	layer.on Events.Click, ->
		print layer.id
		@scale = 2

runInContext ctx, ->
	
	layer = new Layer x:800

	layer.on Events.Click, ->
		print layer.id
		@scale = 2




# EventManagerEventsKey = "_EventManagerEventsKey"

# class EventManagerElement

# 	constructor: (@element) ->
# 		@_events = {}

# 	addEventListener: (event, listener) ->
# 		@_events[event] ?= []
# 		@_events[event].push listener
# 		@element.addEventListener(event, listener)

# 	removeEventListener: (event, listener) ->
# 		return unless @_events
# 		return unless @_events[event]
		
# 		@_events[event] = _.without @_events[event], listener		
# 		@element.removeEventListener(event, listener)

# 		return

# 	removeAllEventListeners: (eventName) ->
		
# 		events = if eventName then [eventName] else _.keys(@_events)

# 		for eventName in events
# 			for eventListener in @_events[eventName]
# 				@removeEventListener eventName, eventListener

# 		return

# 	once: (event, listener) ->

# 		fn = =>
# 			@removeListener event, fn
# 			listener arguments...

# 		@on event, fn

# 	on: @::addListener
# 	off: @::removeListener
	
# class EventManager

# 	constructor: (element) ->
# 		@_elements = {}

# 	wrap: (element) =>
		
# 		if not @_elements[element]
# 			@_elements[element] = new EventManagerElement(element)
		
# 		@_elements[element]
	
# 	reset: ->
# 		for element, elementEventManager of @_elements
# 			elementEventManager.removeAllEventListeners()


# window.em = new EventManager

# test = ->


# 	em = new EventManager

# 	em.wrap(window).addEventListener Events.Click, ->
# 		console.log "click", @


# em.reset()


