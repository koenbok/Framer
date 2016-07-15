Utils = require "../Utils"

{Layer} = require "../Layer"
{Events} = require "../Events"
{LayerStates} = require "../LayerStates"
# Transitions = require "./NavComponentTransitions"

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
			backgroundColor: "black"

		super options

		@_stack = []
		@_current = null

		@background = new Layer
			name: "background"
			parent: @
			size: @size
			backgroundColor: "black"
			visible: false

		@background.onTap => @back()

	@define "isTransitioning",
		get: -> @_isTransitioning

	@define "stack",
		get: -> _.clone(@_stack)

	@define "current",
		get: -> return @_stack[@_stack.length - 1]?.layer

	@define "previous",
		get: -> return @_stack[@_stack.length - 2]?.layer


	##############################################################
	# Transitions

	push: (layer, transitionFunction, animate, wrap) ->

		throw new Error "NavComponent.push expects a layer" unless layer
		return if layer is @current

		# Set the default values
		# TransitionType ?= Transitions.default
		animate ?= if @_stack.length then true else false
		wrap ?= true

		# Make sure the layer is visible
		layer.visible = true
		layer.opacity = 1

		# Wrap the layer and set this as the parent
		wrappedLayer = layer
		wrappedLayer = @_wrapLayer(layer) if wrap
		wrappedLayer.parent = @

		transitionFunction ?= Transitions.push
		transition = @_buildTransition(transitionFunction, 
			@_wrappedLayer(@current), wrappedLayer)

		@_runTransition(transition, "forward", animate, @current, layer)
		@_stack.push({layer:layer, transition:transition})

	dialog: (layer, animate) ->
		@push(layer, Transitions.dialog, animate, false)

	modal: (layer, animate) ->
		@modalRight(layer, animate)
	
	modalLeft: (layer, animate) ->
		@push(layer, Transitions.modalLeft, animate)

	modalRight: (layer, animate) ->
		@push(layer, Transitions.modalRight, animate, false)

	back: (animate=true) =>
		return unless @previous
		#return if @isTransitioning
		previous = @_stack.pop()
		@_runTransition(previous?.transition, "back", animate, @current, previous.layer)


	##############################################################
	# Internal methods

	_wrapLayer: (layer) ->

		# Wrap the layer in a ScrollComponent if the size exceeds the size of
		# the NavComponent. Also set the horizontal/vertical scrollin if only
		# one of the sizes exceeds.

		# TODO: what about NavComponent changing size, do we need to account?

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
		# Get the ScrollComponent for a layer if it was wrapped, 
		# or just the layer itself if it was not.
		return null unless layer
		return layer[NavComponentLayerScrollKey] or layer

	_runTransition: (transition, direction, animate, from, to) =>

		
		@_isTransitioning = true
		@emit(Events.TransitionStart, from, to, direction)
		@emit(direction, from, to)
		
		transition[direction] animate, =>
			@_isTransitioning = false
			@emit(Events.TransitionEnd, from, to, direction)
			@emit(direction, from, to)

	_buildTransition: (template, layerA, layerB, animationOptions={}) ->

		background = @background
		template = template(layerA, layerB, background)

		transition = {}

		
		

		if layerA and template.layerA
			transition._statesA = new LayerStates(layerA)
			transition._statesA.add(template.layerA)
		if layerB and template.layerB
			transition._statesB = new LayerStates(layerB)
			transition._statesB.add(template.layerB)
		if background and template.background
			transition._statesBackground = new LayerStates(background)
			transition._statesBackground.add(template.background)

		animationOptions = template.layerB.options # FIXME

		transition.forward = (animate=true, callback) ->
			
			print "transition.forward"

			options = _.extend(animationOptions, {animate:animate})

			if transition._statesBackground
				background.ignoreEvents = false
				background.visible = true
				background.placeBehind(layerB)
			else
				transition._statesB?.once Events.StateDidSwitch, =>
					layerA?.visible = false
					callback?()

			transition._statesB?.switchInstant("hide")
			transition._statesB?.switch("show", options)

			transition._statesA?.switch("hide", options)

			transition._statesBackground?.switchInstant("hide")
			transition._statesBackground?.switch("show", options)

		transition.back = (animate=true, callback) ->

			print "transition.back"

			options = _.extend(animationOptions, {animate:true})
			layerA?.visible = true
			transition._statesA?.switch("show", options)
			transition._statesB?.switch("hide", options)
			transition._statesBackground?.switch("hide", options)

			background?.ignoreEvents = true

			transition._statesBackground?.once Events.StateDidSwitch, ->
				background.visible = false

			
			# f = Utils.callAfterCount(2, callback)
			# transition._statesA?.once(Events.StateDidSwitch, f)
			# transition._statesB?.once(Events.StateDidSwitch, f)



		return transition

Transitions = {}

Transitions.push = (layerA, layerB, background) ->
	transition = 
		layerA:
			show: {x: 0}
			hide: {x: 0 - layerA?.width / 2}
			options: {curve: "spring(300, 35, 0)"}
		layerB:
			show: {x: 0}
			hide: {x: layerB.width}
			options: {curve: "spring(300, 35, 0)"}

Transitions.modalRight = (layerA, layerB, background) ->
	print "modalRight"
	transition = 
		layerB:
			show: {x: 0}
			hide: {x: 0 - layerB?.width}
			options: {curve: "spring(300, 35, 0)"}
		background:
			show: {opacity: 1}
			hide: {opacity: 0}
			options: {time: 0.2}

Transitions.dialog = (layerA, layerB, background) ->
	print "dialog"
	transition = 
		layerB:
			show: {x:Align.center, y:Align.center, scale:1.0, opacity:1}
			hide: {x:Align.center, y:Align.center, scale:0.5, opacity:0}
			options: {curve: "spring(800, 30, 0)"}
		background:
			show: {opacity: 0.3}
			hide: {opacity: 0}
			options: {time: 0.1}

