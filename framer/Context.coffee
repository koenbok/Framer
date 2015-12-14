{_} = require "./Underscore"

Utils = require "./Utils"
{BaseClass} = require "./BaseClass"
{Config} = require "./Config"
{DOMEventManager} = require "./DOMEventManager"

###

An easy way to think of the context is a bucket of things related to a set of layers. There
is always at least one context on the screen, but often many more. For example, the device has
a special context and replaces the default one (so it renders in the screen), and the print
function uses on to draw the console.

The default context lives under Framer.DefaultContext and the current one in 
Framer.CurrentContext. You can create layers in any context by using the run function.

A context keeps track of everyting around those layers, so it can clean it up again. We use
this a lot in Framer Studio's autocomplete function. Async things like running animations and
timers get stopped too.

Contexts can live inside another context (with a layer as a parent) so you can only reload
a part of a prototype. This is mainly how device works.

Another feature is to temporarily freeze/resume a context. If you freeze it, all user event
will temporarily get blocked so in theory nothing will change in the context. You can restore
these at any time.

###

class exports.Context extends BaseClass

	@define "parent",
		get: -> @_parent

	@define "element",
		get: -> @_element

	constructor: (options={}) ->
		
		super

		options = _.defaults options,
			parent: null
			name: null

		if not options.name
			throw Error("Contexts need a name")

		@_parent = options.parent
		@_name = options.name
		
		@perspective = 1200
		@perspectiveOriginX = 0.5
		@perspectiveOriginY = 0.5

		@reset()

	reset: ->

		@_createDOMEventManager()
		@_createRootElement()

		@resetLayers()
		@resetAnimations()
		@resetTimers()
		@resetIntervals()

		@perspective = @perspective

		@emit("reset", @)

	# destroy: ->
	# 	@reset()


	##############################################################
	# Collections

	# Layers
	@define "layers", get: -> _.clone(@_layers)
	@define "layerCounter", get: -> @_layerCounter
	
	addLayer: (layer) ->
		return if layer in @_layers
		@_layerCounter++
		@_layers.push(layer)
		
	removeLayer: (layer) ->
		@_layers = _.without(@_layers, layer)
	
	resetLayers: ->
		@_layers = []
		@_layerCounter = 0


	# Animations
	@define "animations", get: -> _.clone(@_animations)
	
	addAnimation: (animation) ->
		return if animation in @_animations
		@_animations.push(animation)
		
	removeAnimation: (animation) ->
		@_animations = _.without(@_animations, animation)
	
	resetAnimations: ->
		@stopAnimations()
		@_animations = []

	stopAnimations: ->
		return unless @_animations
		@_animations.map (animation) -> animation.stop(true)


	# Timers
	@define "timers", get: -> _.clone(@_timers)
	
	addTimer: (timer) ->
		return if timer in @_timers
		@_timers.push(timer)
		
	removeTimer: (timer) ->
		@_timers = _.without(@_timers, timer)
	
	resetTimers: ->
		@_timers.map(window.clearTimeout) if @_timers
		@_timers = []


	# Intervals
	@define "intervals", get: -> _.clone(@_intervals)
	
	addInterval: (interval) ->
		return if interval in @_intervals
		@_intervals.push(interval)
		
	removeInterval: (interval) ->
		@_intervals = _.without(@_intervals, interval)
	
	resetIntervals: ->
		@_intervals.map(window.clearInterval) if @_intervals
		@_intervals = []


	##############################################################
	# Run

	run: (fn) ->
		previousContext = Framer.CurrentContext
		Framer.CurrentContext = @
		fn()
		Framer.CurrentContext = previousContext


	##############################################################
	# Freezing

	freeze: ->

		if @_frozenEvents?
			throw new Error "Context is already frozen"

		@_frozenEvents = {}

		for layer in @_layers

			layerListeners = {}

			for eventName in layer.listenerEvents()
				layerListeners[eventName] = layer.listeners(eventName)
			
			layer.removeAllListeners()
			layerId = @_layers.indexOf(layer)
			
			@_frozenEvents[layerId] = layerListeners
			
		@stopAnimations()

		# TODO: It would be nice to continue at least intervals after a resume
		@resetTimers()
		@resetIntervals()

	resume: ->

		if not @_frozenEvents?
			throw new Error "Context is not frozen, cannot resume"

		for layerId, events of @_frozenEvents
			layer = @_layers[layerId]
			for eventName, listeners of events
				for listener in listeners
					layer.on(eventName, listener)

		delete @_frozenEvents


	##############################################################
	# DOM

	_createDOMEventManager: ->

		# This manages all dom events for any node in this context centrally,
		# so we can clean them up on a reset, avoiding memory leaks and whatnot.
		
		@domEventManager?.reset()
		@domEventManager = new DOMEventManager

	_createRootElement: ->

		# Everything under the context lives in a single div that we either insert
		# directly on the root, or attach to the parent layer. The element append
		# can be pending if the document isn't ready yet.

		@_destroyRootElement()

		@_element = document.createElement("div")
		@_element.id = "FramerContextRoot-#{@_name}"
		@_element.classList.add("framerContext")

		@__pendingElementAppend = =>
			parentElement = @_parent?._element
			parentElement ?= document.body
			parentElement.appendChild(@_element)

		Utils.domComplete(@__pendingElementAppend)

	_destroyRootElement: ->

		# This removes the context element and cancels async insertion if the
		# document wasn't ready yet.

		if @_element?.parentNode
			@_element.parentNode.removeChild(@_element)

		if @__pendingElementAppend
			Utils.domCompleteCancel(@__pendingElementAppend)
			@__pendingElementAppend = null

		@_element = null


	##############################################################
	# Geometry

	# Remember the context doesn't really have height. These are just a reference
	# to it's parent or document.

	@define "width", 
		get: -> 
			return @parent.width if @parent
			return window.innerWidth

	@define "height",
		get: -> 
			return @parent.height if @parent
			return window.innerHeight

	@define "frame", get: -> {x:0, y:0, width:@width, height:@height}
	@define "size",  get: -> _.pluck(@frame, ["x", "y"])
	@define "point", get: -> _.pluck(@frame, ["width", "height"])

	@define "backgroundColor",
		get: ->
			return @_element?.style["backgroundColor"]
		set: (value) ->
			if Color.isColor(value)
				@_element?.style["backgroundColor"] = new Color value.toString()

	@define "perspective",
		get: ->
			return @_perspective
		set: (value) ->
			if _.isNumber(value)
				@_perspective = value
				@_element?.style["perspective"] = @_perspective
				@_element?.style["webkitPerspective"] = @_perspective

	_updatePerspective: ->
		@_element?.style["webkitPerspectiveOrigin"] = "#{@perspectiveOriginX * 100}% #{@perspectiveOriginY * 100}%"

	@define "perspectiveOriginX",
		get: ->
			if _.isNumber(@_perspectiveOriginX)
				return @_perspectiveOriginX
			else
				return .5
		set: (value) ->
			if _.isNumber(value)
				@_perspectiveOriginX = value
				@_updatePerspective()

	@define "perspectiveOriginY",
		get: ->
			if _.isNumber(@_perspectiveOriginY)
				return @_perspectiveOriginY
			else
				return .5
		set: (value) ->
			if _.isNumber(value)
				@_perspectiveOriginY = value
				@_updatePerspective()

