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
		@_seen = []
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

	transition: (layer, animate, wrap, transitionFunction) ->

		# Transition over to a new layer using a specific transtition function.

		# Some basic error checking
		throw new Error "NavComponent.transition expects a layer" unless layer
		throw new Error "NavComponent.transition expects transitionFunction" unless transitionFunction

		return if layer is @current

		# Set the default values so we get some expected results (visibility,
		# correct parent, events, wrapping, etcetera).

		# If this is the first layer we navigate to, we skip the animation
		animate ?= if @_stack.length then true else false
		wrap ?= true

		# Make sure the layer is visible
		layer.visible = true
		layer.opacity = 1

		# We want the layer to block events so you can't click on layers
		# that end up behind it without knowing it.
		layer.ignoreEvents = false

		# Wrap the layer into a ScrollComponent if it exceeds the size
		# and correct the parent if needed.
		wrappedLayer = layer
		wrappedLayer = @_wrapLayer(layer) if wrap
		wrappedLayer.parent = @
		wrappedLayer.visible = false

		# Build the transition function to setup all the states, using the
		# transition, current and new layer, and optionally a background.
		transition = @_buildTransition(transitionFunction,
			@_wrappedLayer(@current), wrappedLayer, @background)

		# Run the transition and update the history
		@_runTransition(transition, "forward", animate, @current, layer)
		@_stack.push({layer:layer, transition:transition})

	show: (layer, animate) ->
		@transition(layer, animate, false, Transitions.push)

	# Modal transitions never get wrapped. If you'd like them to be scrollable
	# you can put them into a ScrollComponent yourself and then insert them.

	showModalCenter: (layer, animate) ->
		@transition(layer, animate, false, Transitions.modalCenter)

	showModalLeft: (layer, animate) ->
		@transition(layer, animate, false, Transitions.modalLeft)

	showModalRight: (layer, animate) ->
		@transition(layer, animate, false, Transitions.modalRight)
	
	showModalTop: (layer, animate) ->
		@transition(layer, animate, false, Transitions.modalTop)

	showModalBottom: (layer, animate) ->
		@transition(layer, animate, false, Transitions.modalBottom)

	back: (animate=true) =>
		return unless @previous
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
		scroll.size = layer.size
		# scroll.width = Math.min(layer.width, @width)
		# scroll.height = Math.min(layer.height, @height)
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

		# Start the transition with a small delay added so it only runs after all
		# js has been processed. It's also important for hints, as they rely on 
		# ignoreEvents to be false at the moment of a click.

		Utils.delay 0, =>
			transition[direction] animate, =>
				@_isTransitioning = false
				@emit(Events.TransitionEnd, from, to, direction)
				@emit(direction, from, to)

	_buildTransition: (transitionFunction, layerA, layerB, background) ->

		# Get the executed template data by passing in the layers for this transition
		template = transitionFunction(@, layerA, layerB, background)

		# Buld a new transtition object with empty states
		transition = {}
		transition.states = {}

		seen = @_seen

		# For every layer that exists, add the states form the template
		if layerA and template.layerA
			transition.states.layerA = new LayerStates(layerA)
			transition.states.layerA.add(template.layerA)

		if layerB and template.layerB
			transition.states.layerB = new LayerStates(layerB)
			transition.states.layerB.add(template.layerB)

		if background and template.background
			transition.states.background = new LayerStates(background)
			transition.states.background.add(template.background)

		options = (layerName, animate) ->
			templateOptions = template[layerName]?.options
			return {animate:animate} unless templateOptions
			return _.extend(templateOptions, {animate:animate})

		# We could optionally automatically hide the layers that are done animating,
		# but it's really tricky to get right.

		if not transition.states.background
			transition.states.layerA?.on Events.StateSwitchEnd, (previous, current) ->
				# print "layerA.done #{current}", layerB.point
				# layerA?.visible = false if current is "hide"
				# layerB?.bringToFront() if current is "hide"
			transition.states.layerB?.on Events.StateSwitchEnd, (previous, current) ->
				# print "layerB.done #{current}", layerB.point
				# layerB?.visible = false if current is "hide"
				# layerA?.bringToFront() if current is "hide"

		# Add the forward function for this state to transition forward
		transition.forward = (animate=true, callback) =>

			# If this transition build on a background we need it to be
			# visible and at the right index, just behind the layerB.
			if transition.states.background
				background.ignoreEvents = false
				background.visible = true
				background.placeBehind(layerB)

			# If not, we make sure the background layer is not visible, and
			# we want the dissapearing layer to ge invisible after the
			# transition stops.
			else
				background.ignoreEvents = true
				background.visible = false

			animationCount = 0

			onTransitionEnd = ->
				animationCount--
				callback?() if animationCount is 0

			if transition.states.layerB
				animationCount++
			
				# We only need to set the initial push if we have never seen this layer
				# before, because it might be in a half-transition from goin back, and 
				# then we don't want to mess with it.
				if layerB in @_seen is false
					@_seen.push(layerB)
					transition.states.layerB.switchInstant("hide")

				layerB.visible = true
				layerB.ignoreEvents = true
				# layerB.bringToFront()				
				transition.states.layerB.switch("show", options("layerB", animate))
				transition.states.layerB.once(Events.StateSwitchStop, onTransitionEnd)


			if transition.states.layerA
				animationCount++
				transition.states.layerA.switch("hide", options("layerB", animate))
				layerA.visible = true
				layerB.ignoreEvents = false
				transition.states.layerA.once(Events.StateSwitchStop, onTransitionEnd)


			if transition.states.background
				animationCount++
				transition.states.background.switchInstant("hide")
				background.visible = true
				transition.states.background.switch("show", options("layerB", animate))
				transition.states.background.once(Events.StateSwitchStop, onTransitionEnd)


		transition.back = (animate=true, callback) =>

			# If this transition build on a background we need it to be
			# visible and at the right index, just behind the layerB.
			if transition.states.background
				background.ignoreEvents = true

			animationCount = 0

			onTransitionEnd = ->
				animationCount--
				callback?() if animationCount is 0

			if transition.states.layerB
				animationCount++
				transition.states.layerB.switch("hide", options("layerB", animate))
				transition.states.layerB.once(Events.StateSwitchStop, onTransitionEnd)
				layerB.visible = true
				layerB.ignoreEvents = true

				# if not transition.states.background
				# 	transition.states.layerB.once Events.StateSwitchEnd, ->
				# 		layerB?.visible = false

			if transition.states.layerA
				animationCount++
				layerA.visible = true
				layerA.ignoreEvents = false
				# layerA.bringToFront()
				transition.states.layerA.switch("show", options("layerB", animate))
				transition.states.layerA.once(Events.StateSwitchStop, onTransitionEnd)


			if transition.states.background
				animationCount++
				transition.states.background.switchInstant("show")
				transition.states.background.switch("hide", options("layerB", animate))
				transition.states.background.once(Events.StateSwitchStop, onTransitionEnd)
				background.visible = true

		return transition

Transitions = {}

Transitions.push = (nav, layerA, layerB, background) ->
	transition =
		layerA:
			show: {x: 0, y:0}
			hide: {x: 0 - layerA?.width / 2, y:0}
			options: {curve: "spring(300, 35, 0)"}
		layerB:
			show: {x: 0}
			hide: {x: layerB.width}
			options: {curve: "spring(300, 35, 0)"}

Transitions.modalCenter = (nav, layerA, layerB, background) ->
	transition =
		layerB:
			show: {x:Align.center, y:Align.center, scale:1.0, opacity:1}
			hide: {x:Align.center, y:Align.center, scale:0.5, opacity:0}
			options: {curve: "spring(800, 30, 0)"}
		background:
			show: {opacity: 0.3}
			hide: {opacity: 0}
			options: {time: 0.1}

Transitions.modalLeft = (nav, layerA, layerB, background) ->
	transition =
		layerB:
			show: {y: 0, x: 0}
			hide: {y: 0, x: 0 - layerB?.width}
			options: {curve: "spring(300, 35, 0)"}
		background:
			show: {opacity: .5}
			hide: {opacity: 0}
			options: {time: 0.1}

Transitions.modalRight = (nav, layerA, layerB, background) ->
	transition =
		layerB:
			show: {y: 0, x: nav?.width - layerB?.width}
			hide: {y: 0, x: nav?.width}
			options: {curve: "spring(300, 35, 0)"}
		background:
			show: {opacity: .5}
			hide: {opacity: 0}
			options: {time: 0.1}

Transitions.modalTop = (nav, layerA, layerB, background) ->
	transition =
		layerB:
			show: {x: Align.center, y: 0}
			hide: {x: Align.center, maxY: 0}
			options: {curve: "spring(300, 35, 0)"}
		background:
			show: {opacity: .5}
			hide: {opacity: 0}
			options: {time: 0.1}

Transitions.modalBottom = (nav, layerA, layerB, background) ->
	transition =
		layerB:
			show: {x: Align.center, y: nav?.height - layerB?.height}
			hide: {x: Align.center, y: nav?.height}
			options: {curve: "spring(300, 35, 0)"}
		background:
			show: {opacity: .5}
			hide: {opacity: 0}
			options: {time: 0.1}
