{_} = require "./Underscore"

Utils        = require "./Utils"
{BaseClass}  = require "./BaseClass"
{Events}     = require "./Events"
{Frame}      = require "./Frame"
{Simulation} = require "./Simulation"
{Defaults}   = require "./Defaults"

{EventBuffer} = require "./EventBuffer"
{PanRecognizer} = require "./Recognizers/PanRecognizer"

Events.DragStart             = "dragstart"
Events.DragWillMove          = "dragwillmove"
Events.DragDidMove           = "dragmove"
Events.DragMove              = "dragmove"
Events.DragEnd               = "dragend"
Events.DidStartDecelerating  = "didstartdecelerating"
Events.DidEndDecelerating    = "didenddecelerating"
Events.DidStartBounce        = "didstartbounce"
Events.DidEndBounce          = "didendbounce"
Events.DidStartLockDirection = "didstartlockdirection"

class exports.LayerDraggable extends BaseClass

	STATE = Utils.defineEnum [
		"RESTING"
		"DRAGGING"
		"SIMULATING"
	]

	@define "horizontal", @simpleProperty "horizontal", true, true
	@define "vertical", @simpleProperty "vertical", true, true

	@define "speedX", @simpleProperty "speedX", 1, true
	@define "speedY", @simpleProperty "speedY", 1, true

	@define "lockDirection", @simpleProperty "lockDirection", false, true

	@define "constraints",
		get: -> @_constraints
		set: (@_constraints) -> @_updateInertialScrollConstraints value if value

	@define "velocity",
		get: -> {x:0, y:0}
		set: -> throw Error "You can't set velocity on a draggable"

	@define "angle",
		get: -> 0
		set: -> throw Error "You can't set angle on a draggable"

	# TODO: what to do with this?
	# Should there be a tap event?
	@define "multipleDraggables", @simpleProperty "multipleDraggables", false, true

	constructor: (@layer) ->

		_.extend(@, Defaults.getDefaults "LayerDraggable", {})

		# @momentum             = defaults.momentum
		# @momentumOptions      = defaults.momentumOptions
		# @bounce               = defaults.bounce
		# @bounceOptions        = defaults.bounceOptions
		# @lockDirectionOptions = defaults.lockDirectionOptions

		# @overscrollScale      = defaults.overscrollScale
		# @velocityTimeout      = defaults.velocityTimeout
		# @velocityScale        = defaults.velocityScale

		super

		@enabled = true
		@state = STATE.RESTING

		@_eventBuffer = new EventBuffer

		# TODO: will have to change panRecognizer's horizontal/vertical etc 
		# when they are changed on the LayerDraggable
		# @_panRecognizer = new PanRecognizer @eventBuffer
		
		@_constraints = null
		@_propagateEvents = false

		@attach()

	attach: -> 
		@layer.on Events.TouchStart, @_touchStart

		@_panRecognizer.on Events.DidStartPan, (direction) =>
			@emit Events.DidStartLockDirection direction

	_touchStart: (event) =>

		# @_propagateEvents = true if (@multipleDraggables && @directionLock)

		@layer.animateStop()

		event.preventDefault()
		# event.stopPropagation() if ! @_propagateEvents

		# Extract the event (mobile may have multiple)
		touchEvent = Events.touchEvent(event)

		@_eventBuffer.push
			x: touchEvent.clientX
			y: touchEvent.clientY
			t: touchEvent.timeStamp

		# Store original layer position
		@_position =
			x: @layer.x
			y: @layer.y
		
		# if @bounce
		# 	@_position = @_constrainPosition(@_position, @constraints, 1 / @overscrollScale)

		# Store start cursor position
		@_start =
			x: touchEvent.clientX
			y: touchEvent.clientY

		# Store cursor/layer offset
		@_offset =
			x: touchEvent.clientX - @_position.x
			y: touchEvent.clientY - @_position.y

		# Store the current layer scale so we can correct movement for it
		@_screenScale =
			x: @layer.screenScaleX()
			y: @layer.screenScaleY()

		document.addEventListener(Events.TouchMove, @_touchMove)
		document.addEventListener(Events.TouchEnd, @_touchEnd)

		@state = STATE.DRAGGING

		@emit(Events.DragStart, event)

	_touchMove: (event) =>

		event.preventDefault()
		event.stopPropagation() if not @_propagateEvents

		return unless @enabled

		@emit(Events.DragWillMove, event)

		touchEvent = Events.touchEvent event

		@_eventBuffer.push
			x: touchEvent.clientX
			y: touchEvent.clientY
			t: touchEvent.timeStamp

		delta =
			x: touchEvent.clientX - @_start.x
			y: touchEvent.clientY - @_start.y

		# Correct for current drag speed and scale
		correctedDelta =
			x: delta.x * @speedX * (1 / @_screenScale.x)
			y: delta.y * @speedY * (1 / @_screenScale.y)
			t: event.timeStamp

		# Pixel align all moves
		@_position.x = parseInt(@_start.x + correctedDelta.x - @_offset.x)
		@_position.y = parseInt(@_start.y + correctedDelta.y - @_offset.y)

		if @maxDragFrame
			# TODO: Should we realign to pixel first?
			@_position = @_constrainPosition(@_position, 
				@constraints, @constructor.OverscrollScale)

		if @directionLock
			@_updateDirectionLock(correctedDelta) if ! @_directionIsLocked
			
			@layer.x = @_position.x if @_xAxisLock
			@layer.y = @_position.y if @_yAxisLock	
		else
			@layer.x = @_position.x
			@layer.y = @_position.y

		@emit Events.DragMove, event

	##############################################################
	# Scroll bounds

	_clampAndScale: (value, min, max, scale) ->
		value = min + (value - min) * scale if value < min
		value = max + (value - max) * scale if value > max
		return value

	_constrainPosition: (position, bounds, scale) ->
		{minX, maxX, minY, maxY} = bounds

		newPosition = {}

		if @overscroll
			newPosition.x = @_clampAndScale position.x, minX, maxX, scale
			newPosition.y = @_clampAndScale position.y, minY, maxY, scale
		else
			newPosition.x = Utils.clamp position.x, minX, maxX
			newPosition.y = Utils.clamp position.y, minY, maxY

		return newPosition 

	# A convenience method for getting scrolling behavior from LayerDraggable.
	# The layer will pan around within the frame passed.
	# 
	# If the layer dimensions are smaller then the frame passed, the layer will
	# not move at all (unless overscroll is on, in which case the layer will
	# move, but spring back to 0 when dragging has finished).
	setScrollConstraints: (constraints) ->
		layerWidthTooSmall = @layer.width < constraints.width
		layerHeightTooSmall = @layer.height < constraints.height

		if layerWidthTooSmall
			x = 0
			width = @layer.width
		else
			x = - @layer.width + constraints.width
			width = @layer.width * 2 - constraints.width

		if layerHeightTooSmall
			y = 0
			height = @layer.height
		else
			y = - @layer.height + constraints.height
			height = @layer.height * 2 - constraints.height

		@constraints = {x, y, width, height}

	##############################################################
	# Velocity

	_calculateInertialScrollingVelocity: ->

		xFinished = @simulation['x'].finished()
		yFinished = @simulation['y'].finished()

		velocity = {x:0, y:0}
		velocity.x = (@simulation['x'].getState().v / @velocityScale) if ! xFinished
		velocity.y = (@simulation['y'].getState().v / @velocityScale) if ! yFinished

		return velocity

	calculateVelocity: ->
		if @_isDragging
			return @_calculateDraggingVelocity()
		else if @_inertialScroll
			return @_calculateInertialScrollingVelocity()
		else
			return {x:0, y:0}

	##############################################################
	# Event Handling

	remove: -> @layer.off Events.TouchStart, @_touchStart

	emit: (eventName, event) ->
		# We override this to get all events both on the draggable
		# and the encapsulated layer.
		@layer.emit eventName, event

		super eventName, event

	_updateDirectionLock: (correctedDelta) ->
		
		@_xAxisLock = Math.abs(correctedDelta.x) > @constructor.DragThreshold
		@_yAxisLock = Math.abs(correctedDelta.y) > @constructor.DragThreshold
		
		xSlightlyPreferred = Math.abs(correctedDelta.x) > @constructor.DragThreshold / 2
		ySlightlyPreferred = Math.abs(correctedDelta.y) > @constructor.DragThreshold / 2
		
		# Allow locking in both directions at the same time
		@_xAxisLock = @_yAxisLock = true if (xSlightlyPreferred && ySlightlyPreferred)

		if @_xAxisLock || @_yAxisLock

			@_directionIsLocked = true

			@emit Events.DirectionLock, 
				x: @_xAxisLock
				y: @_yAxisLock

			@_propagateEvents = false if @multipleDraggables

	_touchEnd: (event) =>

		document.removeEventListener Events.TouchMove, @_touchMove
		document.removeEventListener Events.TouchEnd, @_touchEnd

		# Start the simulation prior to emitting the DragEnd event.
		# This way, if the user calls layer.animate on DragEnd, the simulation will 
		# be canceled by the user's animation (if the user animates x and/or y).
		@_startSimulation() if @inertialScroll

		@emit Events.DragEnd, event

		# Set _isDragging after DragEnd is fired, so that calls to calculateVelocity() 
		# still returns dragging velocity - both in case the user calls calculateVelocity(),
		# (which would return a stale value before the simulation had finished one tick)
		# and because @_startSimulation currently calls calculateVelocity().
		@_isDragging = false

		@_deltas.length = 0

	##############################################################
	# Inertial scroll simulation

	_setupSimulation: ->
		return if @simulation['?']

		createSimulation = (axis) =>
			
			properties = {}
			properties[axis] = true

			simulation = new Simulation
				layer: @layer
				properties: properties
				model: "inertial-scroll"
				modelOptions:
					momentum: @momentumOptions
					bounce: @bounceOptions

			simulation.on Events.SimulationStep, (state) =>
				if @bounce
					@layer[axis] = parseInt state.x
				else
					# TODO: scrollBounds or similar should take 'x' and 'y' as param?
					# XXX: need to fix before compiles
					{minX, maxX} = @constraints
					@layer[axis] = parseInt Utils.clamp(state.x, minX, maxX)

			return simulation

		@simulation[axis] = createSimulation axis for axis in ['x', 'y']

		@_updateInertialScrollConstraints()
		@_startSimulation()

	_updateInertialScrollConstraints: (constraints) ->
		{minX, maxX, minY, maxY} = @constraints

		@simulation['x'].setOptions {min: minX, max: maxX}
		@simulation['y'].setOptions {min: minY, max: maxY}

	_startSimulation: ->
		velocity = @calculateVelocity()

		@simulation['y'].start()
		@simulation['y'].setState
			x: @layer.y
			v: velocity.y * @constructor.VelocityMultiplier

		@simulation['x'].start()
		@simulation['x'].setState
			x: @layer.x
			v: velocity.x * @constructor.VelocityMultiplier

	_stopSimulation: =>
		@simulation['x']?.stop()
		@simulation['y']?.stop()

