Utils = require "./Utils"

{_} = require "./Underscore"
{BaseClass} = require "./BaseClass"
{Config} = require "./Config"
{EventManager} = require "./EventManager"

Counter = 1

class exports.Context extends BaseClass
	
	constructor: (options={}) ->
		
		super

		Counter++

		options = _.defaults options,
			contextName: null
			parentLayer: null
			name: null


		if not options.name
			throw Error("Contexts need a name")

		@_parentLayer = options.parentLayer
		@_name = options.name
		
		if options.perspective != undefined
			@perspective = options.perspective
		else
			@perspective = 1200
		
		@reset()

	reset: ->

		@eventManager?.reset()
		@eventManager = new EventManager

		if @_rootElement
			# Clean up the current root element:
			if @_rootElement.parentNode
				# Already attached to the DOM - remove it:
				@_rootElement.parentNode.removeChild(@_rootElement)
			else
				# Not on the DOM yet. Prevent it from being added (for this happens
				# async):
				@_rootElement.__cancelAppendChild = true

		# Create a fresh root element:
		@_createRootElement()

		@_delayTimers?.map (timer) -> window.clearTimeout(timer)
		@_delayIntervals?.map (timer) -> window.clearInterval(timer)

		if @_animationList
			for animation in @_animationList
				animation.stop(false)

		@_layerList = []
		@_animationList = []
		@_delayTimers = []
		@_delayIntervals = []
		@_layerIdCounter = 1

		@perspective = @perspective

		@emit("reset", @)

	destroy: ->
		@reset()
		if @_rootElement.parentNode
			@_rootElement.parentNode.removeChild(@_rootElement)
		Utils.domCompleteCancel(@_appendRootElement)

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

	_createRootElement: ->

		@_rootElement = document.createElement("div")
		@_rootElement.id = "FramerContextRoot-#{@_name}"
		@_rootElement.classList.add("framerContext")

		if @_parentLayer
			@_appendRootElement()
		else
			Utils.domComplete(@_appendRootElement)

	_appendRootElement: =>
		parentElement = @_parentLayer?._element
		parentElement ?= document.body
		parentElement.appendChild(@_rootElement)

	run: (f) ->
		previousContext = Framer.CurrentContext
		Framer.CurrentContext = @
		f()
		Framer.CurrentContext = previousContext

	@define "width", 
		get: -> 
			return @_parentLayer.width if @_parentLayer
			return window.innerWidth

	@define "height",
		get: -> 
			return @_parentLayer.height if @_parentLayer
			return window.innerHeight

	@define "perspective",
		get: ->
			return @_perspective
		set: (value) ->
			if _.isNumber(value)
				@_perspective = value
				@_rootElement?.style["perspective"] = @_perspective
				@_rootElement?.style["webkitPerspective"] = @_perspective

	_updatePerspective: ->
		@_rootElement?.style["webkitPerspectiveOrigin"] = "#{@perspectiveOriginX * 100}% #{@perspectiveOriginY * 100}%"

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

