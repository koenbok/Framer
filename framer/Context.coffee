{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{Defaults} = require "./Defaults"

{BaseClass} = require "./BaseClass"
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

Contexts = []

class exports.Context extends BaseClass

	@all = -> return _.clone(Contexts)

	@define "parent", get: -> @_parent

	@define "element", get: -> @_element

	constructor: (options={}) ->

		options = Defaults.getDefaults("Context", options)

		super

		if not options.name
			throw Error("Contexts need a name")

		@_parent = options.parent
		@_name = options.name

		@perspective = options.perspective
		@perspectiveOriginX = options.perspectiveOriginX
		@perspectiveOriginY = options.perspectiveOriginY

		@reset()

		if options.hasOwnProperty("index")
			@index = options.index
		else
			@index = @id

		Contexts.push(@)

	reset: ->

		@_createDOMEventManager()
		@_createRootElement()

		@resetFrozenEvents()
		@resetLayers()
		@resetAnimations()
		@resetTimers()
		@resetIntervals()

		@emit("reset", @)

	destroy: ->
		@reset()
		@_destroyRootElement()
		_.remove(Contexts, @)

	##############################################################
	# Collections

	# Layers
	@define "layers", get: -> _.clone(@_layers)
	@define "layerCounter", get: -> @_layerCounter
	@define "rootLayers", get: -> _.filter @_layers, (layer) -> layer.parent is null

	@define "visible",
		get: -> @_visible or true
		set: (value) ->
			return if value is @_visible
			@_element?.style.visibility = if value then "visible" else "hidden"
			@_visible = value

	addLayer: (layer) ->
		return if layer in @_layers
		@_layerCounter++
		@_layers.push(layer)

	removeLayer: (layer) ->
		@_layers = _.without(@_layers, layer)

	resetLayers: ->
		@resetGestures()
		@_layers = []
		@_layerCounter = 0

	layerForId: (layerId) ->
		for layer in @_layers
			return layer if layer.id is layerId
		return null

	_layerForElement: (element) ->
		for layer in @_layers
			return layer if layer._element is element
		return null

	layerForElement: (element) ->
		# Returns the framer layer containing the element
		return null unless element
		layer = @_layerForElement(element)
		return layer if layer
		return @layerForElement(element.parentNode)

	selectLayers: (selector) -> 
		return _.filter @_layers, (layer) -> Utils.layerMatchesSelector(layer, selector)

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

	resetFrozenEvents: ->
		delete @_frozenEvents

	# Timers
	@define "timers", get: -> _.clone(@_timers)

	addTimer: (timer) ->
		return if timer in @_timers
		@_timers.push(timer)

	removeTimer: (timer) ->
		window.clearTimeout(timer)
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

	# Gestures
	resetGestures: ->
		return unless @_layers
		for layer in @_layers
			if layer._gestures
				layer._gestures.destroy()

		return

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

		@resetFrozenEvents()


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
		@_element.style["webkitPerspective"] = @perspective
		@_element.style["backgroundColor"] = @backgroundColor

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
			return @parent.width if @parent?
			return window.innerWidth

	@define "height",
		get: ->
			return @parent.height if @parent?
			return window.innerHeight

	@define "frame", get: -> {x: 0, y: 0, width: @width, height: @height}
	@define "size",  get: -> _.pick(@frame, ["width", "height"])
	@define "point", get: -> _.pick(@frame, ["x", "y"])
	@define "canvasFrame",
		get: ->
			return @frame if not @parent?
			return @parent.canvasFrame

	@define "backgroundColor",
		get: ->
			return @_backgroundColor if Color.isColor(@_backgroundColor)
			return "transparent"
		set: (value) ->
			if Color.isColor(value)
				@_backgroundColor = value
				@_element?.style["backgroundColor"] = new Color value.toString()

	@define "perspective",
		get: ->
			return @_perspective
		set: (value) ->
			if _.isNumber(value)
				@_perspective = value
				@_element?.style["webkitPerspective"] = @_perspective

	_updatePerspective: ->
		@_element?.style["webkitPerspectiveOrigin"] = "#{@perspectiveOriginX * 100}% #{@perspectiveOriginY * 100}%"

	@define "perspectiveOriginX",
		get: ->
			return @_perspectiveOriginX if _.isNumber(@_perspectiveOriginX)
			return 0.5
		set: (value) ->
			if _.isNumber(value)
				@_perspectiveOriginX = value
				@_updatePerspective()

	@define "perspectiveOriginY",
		get: ->
			return @_perspectiveOriginY if _.isNumber(@_perspectiveOriginY)
			return .5
		set: (value) ->
			if _.isNumber(value)
				@_perspectiveOriginY = value
				@_updatePerspective()

	@define "index",
		get: -> @_element?.style["z-index"] or 0 or 0
		set: (value) ->
			return unless @_element
			@_element.style["z-index"] = value

	ancestors: (args...) ->
		return @_parent?.ancestors(args...) or []

	toInspect: ->

		round = (value) ->
			if parseInt(value) is value
				return parseInt(value)
			return Utils.round(value, 1)

		return "<#{@constructor.name} id:#{@id} name:#{@_name} #{round(@width)}x#{round(@height)}>"
