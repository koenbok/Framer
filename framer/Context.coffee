Utils = require "./Utils"

{_} = require "./Underscore"
{BaseClass} = require "./BaseClass"
{Config} = require "./Config"
{DOMEventManager} = require "./DOMEventManager"

Counter = 1

###

Context
	name
	parent
	domEventManager
	--
	setup()
	run(fn)
	--
	reset()
	destroy()
	--
	freeze()
	unfreeze()
	--
	width √
	heigh √
	size √
	frame √
	--
	patch()
	unpatch()
	--
	resetTimers()
	resetIntervals()
	--
	addLayer()
	removeLayer()
	layers
	
###

class exports.Context extends BaseClass

	@define "parent",
		get: -> @_parent

	constructor: (options={}) ->
		
		super

		Counter++

		options = _.defaults options,
			contextName: null
			parent: null
			name: null

		if not options.name
			throw Error("Contexts need a name")

		@_parent = options.parent
		@_name = options.name
		
		@reset()

	reset: ->

		@domEventManager?.reset()
		@domEventManager = new DOMEventManager

		# Create a fresh root element:
		@_createRootElement()

		@_delayTimers?.map (timer) -> window.clearTimeout(timer)
		@_delayIntervals?.map (timer) -> window.clearInterval(timer)

		@stopAnimations()

		@_layerList = []
		@_animationList = []
		@_delayTimers = []
		@_delayIntervals = []
		@_layerIdCounter = 1
		@_frozenEvents = null

		@emit("reset", @)

	destroy: ->
		@reset()

	getRootElement: ->
		@_rootElement

	getLayers: ->
		_.clone(@_layerList)

	addLayer: (layer) ->
		return if layer in @_layerList
		@_layerList.push(layer)
		return null

	removeLayer: (layer) ->
		@_layerList = _.without(@_layerList, layer)
		return null

	layerCount: ->
		return @_layerList.length

	nextLayerId: ->
		@_layerIdCounter++


	run: (f) ->
		previousContext = Framer.CurrentContext
		Framer.CurrentContext = @
		f()
		Framer.CurrentContext = previousContext

	stopAnimations: ->
		if @_animationList
			for animation in @_animationList
				animation.stop(false)

	# Freezing

	freeze: ->

		events = {}

		for layer in @_layerList
			events[@_layerList.indexOf(layer)] = layer.listeners()
			layer.removeAllListeners()


		@stopAnimations()

		@_frozenEvents = events


	resume: ->

		for layerId, events of @_frozenEvents
			layer = @_layerList[layerId]
			for eventName, listeners of events
				for listener in listeners
					layer.on(eventName, listener)


	# DOM

	_destroyRootElement: ->

		if @_rootElement?.parentNode
			@_rootElement.parentNode.removeChild(@_rootElement)

		if @__pendingElementAppend
			Utils.domCompleteCancel(@__pendingElementAppend)
			@__pendingElementAppend = null

		@_rootElement = null

	_createRootElement: ->

		@_destroyRootElement()

		@_rootElement = document.createElement("div")
		@_rootElement.id = "FramerContextRoot-#{@_name}"
		@_rootElement.classList.add("framerContext")

		@__pendingElementAppend = =>
			parentElement = @_parent?._element
			parentElement ?= document.body
			parentElement.appendChild(@_rootElement)

		Utils.domComplete(@__pendingElementAppend)

	# Geometry

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

