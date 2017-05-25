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

	@define "scroll",
		get: -> return @current?._flowScroll

	##############################################################
	# Header and footer

	@define "header",
		get: -> @_header
		set: (layer) ->
			return unless layer instanceof Layer
			@_header = layer
			@_header.name = "header"
			@_header.width = @width
			@_header.setParentPreservingConstraintValues(@)
			if not @_header.constraintValues?
				@_header.x = Align.center
				@_header.y = Align.top
			@_wrapLayer(@current) if @current

	@define "footer",
		get: -> @_footer
		set: (layer) ->
			return unless layer instanceof Layer
			@_footer = layer
			@_footer.name = "footer"
			@_footer.width = @width
			@_footer.setParentPreservingConstraintValues(@)
			if not @_footer.constraintValues?
				@_footer.x = Align.center
				@_footer.y = Align.bottom
			@_wrapLayer(@current) if @current

	##############################################################
	# Transitions

	transition: (layer, transitionFunction, options={}) ->

		# Transition over to a new layer using a specific transtition function.

		# Some basic error checking
		throw new Error "FlowComponent.transition expects a layer" unless layer instanceof Layer
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
			wrap: true
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
		wrappedLayer = @_wrapLayer(layer) if options.scroll and options.wrap

		wrappedLayer.parent = @
		wrappedLayer.visible = not options.animate

		layerA = @current
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

	_wrapLayer: (flowLayer) ->

		flowLayer._flowLayer = flowLayer

		return flowLayer if flowLayer instanceof ScrollComponent
		return flowLayer if flowLayer._flowWrapped

		# Make the layer at least match the device size
		flowLayer.width = Math.max(flowLayer.width, @width)
		flowLayer.height = Math.max(flowLayer.height, @height)

		size = @size
		layer = layoutPage(flowLayer, size)
		layer = layoutScroll(layer, size)

		# Mark the layer so we don't layout it twice'
		layer._flowLayer = flowLayer

		# Forward the scroll events from created scroll components
		for scroll in [layer, layer.children...]

			@_forwardScrollEvents(scroll)

			if scroll instanceof ScrollComponent
				inset = {}
				inset.top = @header?.height or 0 if scroll.y is 0
				inset.bottom = @footer?.height or 0 if scroll.maxY is @height
				scroll.contentInset = inset
				flowLayer._flowScroll = scroll

		# Set the background color for he created scroll component
		if layer instanceof ScrollComponent
			layer.backgroundColor = @backgroundColor

		return layer

	_forwardScrollEvents: (scroll) =>

		return unless scroll instanceof ScrollComponent
		return if scroll._flowForward is true

		# But only the actual scroll events
		for event in [
			Events.Move,
			Events.ScrollStart,
			Events.ScrollMove,
			Events.ScrollEnd,
			Events.ScrollAnimationDidStart,
			Events.ScrollAnimationDidEnd]
				do (event) => scroll.on event, => @emit(event, scroll)

		scroll._flowForward = true

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

##############################################################
# Layout helpers

findPossibleHeader = (layer) ->

	candidate = null

	for child in layer.children
		if child.x is 0 and child.width is layer.width and child.y is 0
			return if candidate
			candidate = child

	return unless candidate

	for child in layer.children
		continue if candidate is child
		return if child.minY < candidate.maxY

	return candidate

findPossibleFooter = (layer) ->

	candidate = null

	for child in layer.children
		if child.x is 0 and child.width is layer.width and child.maxY is layer.height
			return if candidate
			candidate = child

	return unless candidate

	for child in layer.children
		continue if candidate is child
		return if child.maxY > candidate.minY

	return candidate

findHeader = (layer) ->
	header = findPossibleHeader(layer)
	footer = findPossibleFooter(layer)

	if header and footer
		if header.maxY is footer.minY
			return if header.height >= footer.height

	return header

findFooter = (layer) ->
	header = findPossibleHeader(layer)
	footer = findPossibleFooter(layer)

	if header and footer
		if header.maxY is footer.minY
			return if footer.height >= header.height

	return footer

findBody = (layer, header, footer) ->

	return unless header or footer

	for child in layer.children

		continue if child is header
		continue if child is footer

		if child.x is 0 and child.width is layer.width
			if header and footer and child.minY is header.maxY and child.maxY is footer.minY
				return child
			else if header and child.minY is header.maxY and child.maxY is layer.height
				return child
			else if footer and child.minY is 0 and child.maxY is footer.minY
				return child

guessBodyFrame = (layer, header, footer) ->

	return unless header or footer
	return if header?.maxY is footer?.minY

	if header and footer
		frame = {x: 0, y: header.height, width: layer.width, height: layer.height - header.height - footer.height}
	else if header
		frame = {x: 0, y: header.height, width: layer.width, height: layer.height - header.height}
	else if footer
		frame = {x: 0, y: 0, width: layer.width, height: layer.height - footer.height}
	else
		return

	return if (header?.height or 0) > frame.height
	return if (footer?.height or 0) > frame.height

	return frame

layoutPage = (layer, size) ->

	header = findHeader(layer)
	footer = findFooter(layer)
	return layer unless header or footer

	body = findBody(layer, header, footer)

	if not body
		bodyFrame = guessBodyFrame(layer, header, footer)

		if bodyFrame

			body = new Layer
				frame: bodyFrame
				backgroundColor: null

			for child in layer.children
				continue if child is header
				continue if child is footer
				frame = child.screenFrame
				child.parent = body
				child.screenFrame = frame


	return layer unless body

	bodyFrame = body.frame
	bodyFrame.width = size.width
	bodyFrame.height = size.height - (header?.height or 0) - (footer?.height or 0)

	body.point = 0
	scroll = layoutScroll(body, bodyFrame)
	scroll.parent = layer
	scroll.frame = bodyFrame

	layer.size = size

	if footer?.maxY > size.height
		footer.maxY = size.height

	header?.bringToFront()
	footer?.bringToFront()

	return layer

layoutScroll = (layer, size) ->

	if layer.width <= size.width and layer.height <= size.height
		return layer

	scroll = new ScrollComponent
		size: size
		name: "scroll"

	height = layer.height
	scroll.propagateEvents = false

	constraints = layer.constraintValues

	layer.point = 0
	layer.parent = scroll.content
	layer.constraintValues = constraints

	scroll.scrollHorizontal = layer.maxX > size.width
	scroll.scrollVertical = layer.maxY > size.height

	return scroll


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
