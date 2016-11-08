Utils = require "../Utils"

{Layer} = require "../Layer"
{Events} = require "../Events"
{LayerStates} = require "../LayerStates"
{LayerStateMachine} = require "../LayerStateMachine"
# Transitions = require "./NavComponentTransitions"

NavComponentLayerScrollKey = "_navComponentWrapped"

Events.TransitionStart = "transitionstart"
Events.TransitionStop = "transitionstop"
Events.TransitionEnd = "transitionend"

class exports.NavComponent extends Layer

	constructor: (options={}) ->

		options = _.defaults {}, options,
			backgroundColor: "black"

		if not options.size
			options.width ?= Screen.width
			options.height ?= Screen.height

		super options


		@_stack = []
		@_seen = []
		@_current = null
		@_isModal = false

		@overlay = new Layer
			name: "overlay"
			parent: @
			size: 0
			backgroundColor: "black"
			visible: false

		@overlay.onTap(@_handleOverlayTap)

	@define "isTransitioning",
		get: -> @_runningTransition

	@define "isModal",
		get: -> @_isModal

	@define "stack",
		get: -> @_stack.map (item) -> item.layer

	@define "current",
		get: -> return @_stack[@_stack.length - 1]?.layer

	@define "previous",
		get: -> return @_stack[@_stack.length - 2]?.layer


	##############################################################
	# Transitions

	transition: (layer, transitionFunction, options={}) ->

		# Transition over to a new layer using a specific transtition function.

		# Some basic error checking
		throw new Error "NavComponent.transition expects a layer" unless layer
		throw new Error "NavComponent.transition expects transitionFunction" unless transitionFunction

		return if layer is @current

		# Set the default values so we get some expected results (visibility,
		# correct parent, events, wrapping, etcetera).

		# If this is the first layer we navigate to, we skip the animation

		options = _.defaults {}, options,
			animate: if @_stack.length then true else false
			scroll: true
			modal: false

		# Deal with modal transitions, where a click on the overlay goes back
		@_isModal = options.modal

		# Make sure the layer is visible
		layer.visible = true
		layer.opacity = 1

		# We want the layer to block events so you can't click on layers
		# that end up behind it without knowing it.
		layer.ignoreEvents = false

		# Wrap the layer into a ScrollComponent if it exceeds the size
		# and correct the parent if needed.
		wrappedLayer = layer
		wrappedLayer = @_wrapLayer(layer) if options.scroll
		wrappedLayer.parent = @
		wrappedLayer.visible = false

		# Build the transition function to setup all the states, using the
		# transition, current and new layer, and optionally a background.
		transition = @_buildTransition(transitionFunction,
			@_wrappedLayer(@current), wrappedLayer, @overlay)

		# Run the transition and update the history
		@_runTransition(transition, "forward", options.animate, @current, layer)

		@_stack.push({layer:layer, transition:transition})


	showNext: (layer, options={}) ->
		@transition(layer, Transitions.show, options)

	showPrevious: (options={}) =>
		return unless @previous
		return if @isTransitioning
		options = _.defaults({}, {animate: true})
		previous = @_stack.pop()
		@_runTransition(previous?.transition, "back", options.animate, @current, previous.layer)

	showOverlayCenter: (layer, options={}) ->
		@_showOverlay(layer, Transitions.overlayCenter, options)

	showOverlayTop: (layer, options={}) ->
		@_showOverlay(layer, Transitions.overlayTop, options)

	showOverlayRight: (layer, options={}) ->
		@_showOverlay(layer, Transitions.overlayRight, options)

	showOverlayBottom: (layer, options={}) ->
		@_showOverlay(layer, Transitions.overlayBottom, options)

	showOverlayLeft: (layer, options={}) ->
		@_showOverlay(layer, Transitions.overlayLeft, options)

	# emit: (args...) ->
	# 	super
	# 	print args

	##############################################################
	# Internal methods

	_showOverlay: (layer, transition, options={}) ->
		@transition(layer, transition, _.defaults({}, options,
			{animate: true, scroll: false, modal: false}))

	_handleOverlayTap: =>
		@showPrevious() if not @isModal

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
		scroll.name = "scroll: #{layer.name}"
		scroll.size = @size
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

		# @_runningTransition =
		# 	transition: transition
		# 	direction: direction
		# 	animate: animate
		# 	from: from
		# 	to: to

		@emit(Events.TransitionStart, from, to, {direction: direction, modal: @isModal})

		# Start the transition with a small delay added so it only runs after all
		# js has been processed. It's also important for hints, as they rely on
		# ignoreEvents to be false at the moment of a click.

		Utils.delay 0, =>
			transition[direction] animate, =>
				# @_runningTransition = null
				@emit(Events.TransitionEnd, from, to, {direction: direction, modal: @isModal})

	_buildTransition: (transitionFunction, layerA, layerB, overlay) ->

		# Get the executed template data by passing in the layers for this transition
		template = transitionFunction(@, layerA, layerB, overlay)

		# Buld a new transtition object with empty states
		transition =
			states: {}

		seen = @_seen

		layers =
			layerA: layerA
			layerB: layerB
			overlay: overlay

		for layerName, layer of layers

			continue unless (layer and template[layerName])

			throw Error("NavComponent.transition: #{layerName} needs a 'show' state") unless template[layerName].show
			throw Error("NavComponent.transition: #{layerName} needs a 'hide' state") unless template[layerName].hide

			transition.states[layerName] = new LayerStates(layer)
			transition.states[layerName].show = template[layerName].show
			transition.states[layerName].hide = template[layerName].hide

			delete transition.states[layerName].initial


		# Add the forward function for this state to transition forward
		transition.forward = (animate=true, callback) =>

			# If this transition build on a overlay we need it to be
			# visible and at the right index, just behind the layerB.
			if transition.states.overlay
				overlay.size = @size
				overlay.point = Utils.pointZero()
				overlay.ignoreEvents = false
				overlay.visible = true
				overlay.placeBehind(layerB)

			# If not, we make sure the overlay layer is not visible, and
			# we want the dissapearing layer to ge invisible after the
			# transition stops.
			else
				# overlay.ignoreEvents = true
				overlay.visible = false

			animationCount = 0

			onTransitionEnd = ->
				animationCount--
				return unless animationCount is 0
				callback?()

				# TODO: We should only hide it if the transition is fully finished
				# if not transition.states.overlay and layerA
				# 	layerA.visible = false

			if transition.states.layerB
				animationCount++

				# We only need to set the initial push if we have never seen this layer
				# before, because it might be in a half-transition from goin back, and
				# then we don't want to mess with it.
				if layerB in @_seen is false
					@_seen.push(layerB)
					transition.states.layerB.machine.switchInstant("hide")

				layerB.visible = true
				# layerB.ignoreEvents = true
				# layerB.bringToFront()
				transition.states.layerB.machine.switchTo("show", {instant: !animate})
				transition.states.layerB.machine.once(Events.StateSwitchEnd, onTransitionEnd)


			if transition.states.layerA
				animationCount++
				transition.states.layerA.machine.switchTo("hide", {instant: !animate})
				layerA.visible = true
				# layerB.ignoreEvents = false
				transition.states.layerA.machine.once(Events.StateSwitchEnd, onTransitionEnd)

			if transition.states.overlay
				animationCount++
				transition.states.overlay.machine.switchInstant("hide")
				overlay.visible = true
				transition.states.overlay.machine.switchTo("show", {instant: !animate})
				transition.states.overlay.machine.once(Events.StateSwitchEnd, onTransitionEnd)


		transition.back = (animate=true, callback) ->

			# If this transition build on a overlay we need it to be
			# visible and at the right index, just behind the layerB.
			if transition.states.overlay
				overlay.ignoreEvents = true

			animationCount = 0

			onTransitionEnd = ->
				animationCount--
				callback?() if animationCount is 0

				if not transition.states.overlay and layerB
					layerB.visible = false

			if transition.states.layerB
				animationCount++
				transition.states.layerB.machine.switchTo("hide", {instant: !animate})
				transition.states.layerB.machine.once(Events.AnimationStop, onTransitionEnd)
				layerB.visible = true
				# layerB.ignoreEvents = true

			if transition.states.layerA
				animationCount++
				layerA.visible = true
				# layerA.ignoreEvents = false
				# layerA.bringToFront()
				transition.states.layerA.machine.switchTo("show", {instant: !animate})
				transition.states.layerA.machine.once(Events.AnimationStop, onTransitionEnd)


			if transition.states.overlay
				animationCount++
				transition.states.overlay.machine.switchInstant("show")
				transition.states.overlay.machine.switchTo("hide", {instant: !animate})
				transition.states.overlay.machine.once(Events.AnimationStop, onTransitionEnd)
				overlay.visible = true

		return transition

Transitions = {}

Transitions.show = (nav, layerA, layerB, overlay) ->
	options = {curve: "spring(300, 35, 0)"}
	transition =
		layerA:
			show: {options: options, x: 0, y: 0}
			hide: {options: options, x: 0 - layerA?.width / 2, y:0}
		layerB:
			show: {options: options, x: 0}
			hide: {options: options, x: layerB.width}

Transitions.overlayCenter = (nav, layerA, layerB, overlay) ->
	transition =
		layerB:
			show: {options: {curve: "spring(800, 30, 0)"}, x:Align.center, y:Align.center, scale:1.0, opacity:1}
			hide: {options: {curve: "spring(800, 30, 0)"}, x:Align.center, y:Align.center, scale:0.5, opacity:0}
		overlay:
			show: {options: {time: 0.1}, opacity: 0.3}
			hide: {options: {time: 0.1}, opacity: 0}

Transitions.overlayLeft = (nav, layerA, layerB, overlay) ->
	transition =
		layerB:
			show: {options: {curve: "spring(300, 35, 0)"}, y: 0, x: 0}
			hide: {options: {curve: "spring(300, 35, 0)"}, y: 0, x: 0 - layerB?.width}
		overlay:
			show: {options: {time: 0.1}, opacity: .5}
			hide: {options: {time: 0.1}, opacity: 0}

Transitions.overlayRight = (nav, layerA, layerB, overlay) ->
	transition =
		layerB:
			show: {options: {curve: "spring(300, 35, 0)"}, y: 0, x: nav?.width - layerB?.width}
			hide: {options: {curve: "spring(300, 35, 0)"}, y: 0, x: nav?.width}
		overlay:
			show: {options: {time: 0.1}, opacity: .5}
			hide: {options: {time: 0.1}, opacity: 0}

Transitions.overlayTop = (nav, layerA, layerB, overlay) ->
	transition =
		layerB:
			show: {options: {curve: "spring(300, 35, 0)"}, x: Align.center, y: 0}
			hide: {options: {curve: "spring(300, 35, 0)"}, x: Align.center, maxY: 0}
		overlay:
			show: {options: {time: 0.1}, opacity: .5}
			hide: {options: {time: 0.1}, opacity: 0}

Transitions.overlayBottom = (nav, layerA, layerB, overlay) ->
	transition =
		layerB:
			show: {options: {curve: "spring(300, 35, 0)"}, x: Align.center, y: nav?.height - layerB?.height}
			hide: {options: {curve: "spring(300, 35, 0)"}, x: Align.center, y: nav?.height}
		overlay:
			show: {options: {time: 0.1}, opacity: .5}
			hide: {options: {time: 0.1}, opacity: 0}
