Utils = require "../Utils"

{Layer} = require "../Layer"
{Events} = require "../Events"
{LayerStates} = require "../LayerStates"
Transitions = require "./NavComponentTransitions"

NavComponentLayerScrollKey = "_navComponentWrapped"

Events.TransitionStart = "transitionstart"
Events.TransitionEnd = "transitionend"
Events.Forward = "forward"
Events.Back = "back"

class exports.NavComponent extends Layer

	constructor: (options={}) ->

		options = _.defaults options,
			width: Screen.width
			height: Screen.height
			backgroundColor: "white"

		super options

		@_stack = []
		@_current = null

		@background = new Layer
			name: "background"
			parent: @
			size: @size
			backgroundColor: "black"
			visible: false

		# Screen.onEdgeSwipeLeftEnd (e) =>
		# 	@back()

	_wrapLayer: (layer) ->

		# See if we need to wrap the layer in a scroll view

		# If we already created a scroll, we can use that one
		if layer[NavComponentLayerScrollKey]
			return layer[NavComponentLayerScrollKey]

		# If the layer size is exactly equal to the size of the NavComponent
		# we can just use it directly.
		if layer.width is @width and layer.height is @height
			return layer

		# If the layer size is smaller then the size of the NavComponent we
		# still need to add a backgound layer so it covers up the background.
		# TODO: Implement this
		if layer.width < @width and layer.height < @height
			return layer

		# If this layer is a ScrollComponent we do not have to add another one
		if layer instanceof ScrollComponent
			return layer

		layer.point = Utils.pointZero()

		scroll = new ScrollComponent
		scroll.name = "scroll"
		scroll.size = @size
		scroll.backgroundColor = @backgroundColor
		scroll.scrollHorizontal = layer.width > @width
		scroll.scrollVertical = layer.height > @height
		layer.parent = scroll.content

		layer[NavComponentLayerScrollKey] = scroll

		return scroll

	_wrappedLayer: (layer) ->
		return null unless layer
		return layer[NavComponentLayerScrollKey] or layer

	push: (layer, TransitionType, animate, wrap) ->

		throw new Error "NavComponent.push expects a layer" unless layer
		return if layer is @current

		# Set the default values
		TransitionType ?= Transitions.default
		animate ?= if @_stack.length then true else false
		wrap ?= true

		# Make sure the layer is visible
		layer.visible = true
		layer.opacity = 1

		# Wrap the layer and set this as the parent
		wrappedLayer = layer
		wrappedLayer = @_wrapLayer(layer) if wrap
		wrappedLayer.parent = @

		transition = new TransitionType(@, @_wrappedLayer(@current), wrappedLayer)
		@_runTransition(transition, "forward", animate, @current, layer)
		@_stack.push({layer:layer, transition:transition})

	dialog: (layer, animate) ->
		@push(layer, Transitions.dialog, animate, false)

	modal: (layer, animate) ->
		@push(layer, Transitions.modal, animate, false)

	back: (animate=true) =>
		return unless @previous
		#return if @isTransitioning
		previous = @_stack.pop()
		@_runTransition(previous?.transition, "back", animate, @current, previous.layer)

	@define "isTransitioning",
		get: -> @_isTransitioning

	@define "stack",
		get: -> _.clone(@_stack)

	@define "current",
		get: -> return @_stack[@_stack.length - 1]?.layer

	@define "previous",
		get: -> return @_stack[@_stack.length - 2]?.layer

	_runTransition: (transition, direction, animate, from, to) =>
		
		@_isTransitioning = true
		@emit(Events.TransitionStart, from, to, direction)
		@emit(direction, from, to)
		
		transition[direction] animate, =>
			@_isTransitioning = false
			@emit(Events.TransitionEnd, from, to, direction)
			@emit(direction, from, to)