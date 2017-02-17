Utils = require "../Utils"

{Layer} = require "../Layer"
{Events} = require "../Events"
{LayerStates} = require "../LayerStates"
{LayerStateMachine} = require "../LayerStateMachine"
{AnimationGroup} = require "../AnimationGroup"

FlowComponentLayerScrollKey = "_flowComponentWrapped"

Events.TransitionStart = "transitionstart"
Events.TransitionHalt = "transitionhalt"
Events.TransitionStop = "transitionstop"
Events.TransitionEnd = "transitionend"

class exports.FlowComponent extends Layer

	constructor: (layerOrOptions={}, options={}) ->

		layer = null

		if layerOrOptions instanceof Layer
			layer = layerOrOptions
			options = options
		else
			options = layerOrOptions

		options = _.defaults {}, options,
			backgroundColor: "black"

		if not options.size
			options.width ?= Screen.width
			options.height ?= Screen.height

		options.clip ?= true

		super options

		@reset()

		@overlay = new Layer
			name: "overlay"
			parent: @
			size: 0
			backgroundColor: "black"
			visible: false

		@overlay.onTap(@_handleOverlayTap)

		if layer
			@showNext(layer)
		else
			@_tempScroll = new ScrollComponent
				name: "scrollComponent"
				parent: @
				width: @width
				height: @height


	reset: ->

		if @_stack
			for item in @_stack
				item.layer.visible = false unless item.layer is @_initial

		@_stack = []
		@_seen = []
		@_current = null
		@_isModal = false

		@showNext(@_initial, animate: false) if @_initial

	# @define "isTransitioning",
	# 	get: -> @_runningTransition

	@define "isModal",
		get: -> @_isModal

	@define "stack",
		get: -> @_stack.map (item) -> item.layer

	@define "current",
		get: -> return @_stack[@_stack.length - 1]?.layer

	@define "previous",
		get: -> return @_stack[@_stack.length - 2]?.layer

	##############################################################
	# Header and footer

	@define "header",
		get: -> @_header
		set: (layer) ->
			return unless layer instanceof Layer
			@_header = layer
			@_header.name = "header"
			@_header.parent = @
			@_header.x = Align.center
			@_header.y = Align.top
			@_wrapLayer(@current) if @current

	@define "footer",
		get: -> @_footer
		set: (layer) ->
			return unless layer instanceof Layer
			@_footer = layer
			@_footer.name = "footer"
			@_footer.parent = @
			@_footer.x = Align.center
			@_footer.y = Align.bottom
			@_wrapLayer(@current) if @current

	##############################################################
	# Transitions

	transition: (layer, transitionFunction, options={}) ->

		# Transition over to a new layer using a specific transtition function.

		# Some basic error checking
		throw new Error "FlowComponent.transition expects a layer" unless layer
		throw new Error "FlowComponent.transition expects transitionFunction" unless transitionFunction

		return if layer is @current

		# Remove the temporary scroll component when the first layer gets added
		@_tempScroll?.destroy()

		# Set the default values so we get some expected results (visibility,
		# correct parent, events, wrapping, etcetera).

		# If this is the first layer we navigate to, we skip the animation

		options = _.defaults {}, options,
			animate: if @_firstTransition is true then true else false
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
		wrappedLayer.visible = not options.animate

		layerA = @_wrappedLayer(@current)
		layerB = wrappedLayer
		overlay = @overlay

		# Get the executed template data by passing in the layers for this transition
		template = transitionFunction(@, layerA, layerB, overlay)

		# Build the transition function to setup all the states, using the
		# transition, current and new layer, and optionally a background.
		transition = @_buildTransition(template, layerA, layerB, overlay)

		# Run the transition and update the history
		@_runTransition(transition, "forward", options.animate, @current, layer)
		@_stack.push({layer: layer, transition: transition})


	showNext: (layer, options={}) ->
		@_initial ?= layer
		@transition(layer, Transitions.show, options)

	showPrevious: (options={}) =>
		return unless @previous
		return if @isTransitioning

		# Maybe people (Jorn) pass in a layer accidentally
		options = {} if options instanceof(Framer._Layer)

		options = _.defaults({}, options, {count: 1, animate: true})

		if options.count > 1
			count = options.count
			@showPrevious(animate: false, count: 1) for n in [2..count]

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

	##############################################################
	# Internal methods

	_showOverlay: (layer, transition, options={}) ->
		@transition(layer, transition, _.defaults({}, options,
			{animate: true, scroll: false, modal: false}))

	_handleOverlayTap: =>
		@showPrevious() if not @isModal

	_wrapLayer: (layer) ->

		# Wrap the layer in a ScrollComponent if the size exceeds the size of
		# the FlowComponent. Also set the horizontal/vertical scrollin if only
		# one of the sizes exceeds.

		# TODO: what about FlowComponent changing size, do we need to account?

		scroll = null

		# Calculate the available width and height based on header and footer
		width = @width

		height = @height
		height =- @header.height if @header
		height =- @footer.height if @footer

		# If we already created a scroll, we can use that one
		if layer[FlowComponentLayerScrollKey]
			scroll = layer[FlowComponentLayerScrollKey]

		# If the layer size is exactly equal to the size of the FlowComponent
		# we can just use it directly.
		else if layer.width is @width and layer.height is height
			return layer

		# If the layer size is smaller then the size of the FlowComponent we
		# still need to add a backgound layer so it covers up the background.
		# TODO: Implement this
		else if layer.width < @width and layer.height < height
			return layer

		# If this layer is a ScrollComponent we do not have to add another one
		if layer instanceof ScrollComponent
			scroll = layer
			scroll._originalContentInset ?= scroll.contentInset

		layer.point = Utils.pointZero()

		if not scroll
			scroll = new ScrollComponent
			scroll.name = "scrollComponent"
			scroll.backgroundColor = @backgroundColor
			layer[FlowComponentLayerScrollKey] = scroll
			layer.parent = scroll.content

			# Forward the events to the wrapped layer so we can listen on it for
			# scroll events. This is not "pure". But you don't really have a way
			# to access the magically created scroll component.
			_addListener = layer.addListener
			layer.on = (event, args...) ->

				_addListener.apply(layer, [event, args...])

				# But only the actual scroll events
				if event in [
					Events.ScrollStart,
					Events.Scroll,
					Events.ScrollMove,
					Events.ScrollEnd,
					Events.ScrollAnimationDidStart,
					Events.ScrollAnimationDidEnd]
						scroll.addListener(event, args...)

		scroll.parent = @
		scroll.size = @size
		# scroll.width = Math.min(layer.width, @width)
		# scroll.height = Math.min(layer.height, @height)
		scroll.scrollHorizontal = layer.width > width
		scroll.scrollVertical = layer.height > height

		contentInset =
			top: scroll._originalContentInset?.top ? 0
			bottom: scroll._originalContentInset?.bottom ? 0
		contentInset.top += @header.height if @header
		contentInset.bottom += @footer.height if @footer
		scroll.contentInset = contentInset

		return scroll

	_wrappedLayer: (layer) ->
		# Get the ScrollComponent for a layer if it was wrapped,
		# or just the layer itself if it was not.
		return null unless layer
		return layer[FlowComponentLayerScrollKey] or layer

	_runTransition: (transition, direction, animate, from, to) =>

		if direction is "forward"
			a = from
			b = to
		else
			a = to
			b = from

		@emit(Events.TransitionStart, a, b, direction)

		# Start the transition with a small delay added so it only runs after all
		# js has been processed. It's also important for hints, as they rely on
		# ignoreEvents to be false at the moment of a click.

		Utils.delay 0, =>
			@_firstTransition = true
			transition[direction](animate)

	_buildTransition: (template, layerA, layerB, overlay) ->

		# # Buld a new transtition object with empty states
		transition = {}

		# Add the forward function for this state to transition forward
		transition.forward = (animate=true, callback) =>

			forwardEvents = (group, direction) =>
				group.once Events.AnimationHalt, => @emit(Events.TransitionHalt, layerA, layerB, direction)
				group.once Events.AnimationStop, => @emit(Events.TransitionStop, layerA, layerB, direction)
				group.once Events.AnimationEnd, => @emit(Events.TransitionEnd, layerA, layerB, direction)

			animations = []
			options = {instant: not animate}

			if layerA and template.layerA
				layerA.visible = true
				animations.push(new Animation(layerA, template.layerA.hide, options))

			if layerB and template.layerB
				layerB.props = template.layerB.hide
				# layerB.props = template.layerB.hide if animate # This breaks events now
				layerB.bringToFront()
				layerB.visible = true
				animations.push(new Animation(layerB, template.layerB.show, options))

			if overlay and template.overlay
				overlay.visible = true
				overlay.ignoreEvents = false
				overlay.placeBehind(layerB)
				overlay.props = template.overlay.hide
				animations.push(new Animation(overlay, template.overlay.show, options))

			# Set the right layer indexes for the header and footer if they are there.
			if overlay and template.overlay
				@header.placeBehind(overlay) if @header
				@footer.placeBehind(overlay) if @footer
			else
				@header.bringToFront() if @header
				@footer.bringToFront() if @footer

			group = new AnimationGroup(animations)
			forwardEvents(group, "forward")

			group.once Events.AnimationEnd, ->
				if layerA and template.layerA and not (overlay and template.overlay)
					layerA.visible = false

			group.start()

		transition.back = (animate=true, callback) =>

			forwardEvents = (group, direction) =>
				group.once Events.AnimationHalt, => @emit(Events.TransitionHalt, layerB, layerA, direction)
				group.once Events.AnimationStop, => @emit(Events.TransitionStop, layerB, layerA, direction)
				group.once Events.AnimationEnd, => @emit(Events.TransitionEnd, layerB, layerA, direction)

			animations = []
			options = {instant: not animate}

			if overlay and template.overlay
				overlay.visible = true
				overlay.ignoreEvents = true
				animations.push(new Animation(overlay, template.overlay.hide, options))

			if layerA and template.layerA
				layerA.visible = true
				animations.push(new Animation(layerA, template.layerA.show, options))

			if layerB and template.layerB
				layerB.visible = true
				animations.push(new Animation(layerB, template.layerB.hide, options))

			group = new AnimationGroup(animations)
			group.stopAnimations = false
			forwardEvents(group, "back")

			group.once Events.AnimationEnd, ->
				if layerB and template.layerB
					layerB.visible = false

			group.start()

		return transition

	##############################################################
	# Event helpers

	onTransitionStart: (cb) -> @on(Events.TransitionStart, cb)
	onTransitionHalt: (cb) -> @on(Events.TransitionHalt, cb)
	onTransitionStop: (cb) -> @on(Events.TransitionStop, cb)
	onTransitionEnd: (cb) -> @on(Events.TransitionEnd, cb)

	onStart: (cb) -> @onTransitionStart(cb)
	onHalt: (cb) -> @onTransitionHalt(cb)
	onStop: (cb) -> @onTransitionStop(cb)
	onEnd: (cb) -> @onTransitionEnd(cb)

Transitions = {}

Transitions.show = (nav, layerA, layerB, overlay) ->
	options = {curve: "spring(300, 35, 0)"}
	transition =
		layerA:
			show: {options: options, x: 0, y: 0}
			hide: {options: options, x: 0 - layerA?.width / 2, y: 0}
		layerB:
			show: {options: options, x: 0, y: 0}
			hide: {options: options, x: layerB.width, y: 0}

Transitions.overlayCenter = (nav, layerA, layerB, overlay) ->
	transition =
		layerB:
			show: {options: {curve: "spring(500, 35, 0)"}, x: Align.center, y: Align.center, scale: 1.0, opacity: 1}
			hide: {options: {curve: "spring(500, 35, 0)"}, x: Align.center, y: Align.center, scale: 0.5, opacity: 0}
		overlay:
			show: {options: {time: 0.1}, opacity: .5, x: 0, y: 0, size: nav.size}
			hide: {options: {time: 0.1}, opacity: 0, x: 0, y: 0, size: nav.size}

Transitions.overlayLeft = (nav, layerA, layerB, overlay) ->
	transition =
		layerB:
			show: {options: {curve: "spring(300, 35, 0)"}, y: 0, x: 0}
			hide: {options: {curve: "spring(300, 35, 0)"}, y: 0, x: 0 - layerB?.width}
		overlay:
			show: {options: {time: 0.1}, opacity: .5, x: 0, y: 0, size: nav.size}
			hide: {options: {time: 0.1}, opacity: 0, x: 0, y: 0, size: nav.size}

Transitions.overlayRight = (nav, layerA, layerB, overlay) ->
	transition =
		layerB:
			show: {options: {curve: "spring(300, 35, 0)"}, y: 0, x: nav?.width - layerB?.width}
			hide: {options: {curve: "spring(300, 35, 0)"}, y: 0, x: nav?.width}
		overlay:
			show: {options: {time: 0.1}, opacity: .5, x: 0, y: 0, size: nav.size}
			hide: {options: {time: 0.1}, opacity: 0, x: 0, y: 0, size: nav.size}

Transitions.overlayTop = (nav, layerA, layerB, overlay) ->
	transition =
		layerB:
			show: {options: {curve: "spring(300, 35, 0)"}, x: Align.center, y: 0}
			hide: {options: {curve: "spring(300, 35, 0)"}, x: Align.center, maxY: 0}
		overlay:
			show: {options: {time: 0.1}, opacity: .5, x: 0, y: 0, size: nav.size}
			hide: {options: {time: 0.1}, opacity: 0, x: 0, y: 0, size: nav.size}

Transitions.overlayBottom = (nav, layerA, layerB, overlay) ->
	transition =
		layerB:
			show: {options: {curve: "spring(300, 35, 0)"}, x: Align.center, y: nav?.height - layerB?.height}
			hide: {options: {curve: "spring(300, 35, 0)"}, x: Align.center, y: nav?.height}
		overlay:
			show: {options: {time: 0.1}, opacity: .5, x: 0, y: 0, size: nav.size}
			hide: {options: {time: 0.1}, opacity: 0, x: 0, y: 0, size: nav.size}
