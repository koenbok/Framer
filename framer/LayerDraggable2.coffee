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

"""
constraints <x:n, y:n width:n height:n> (the old maxDragFrame)
horizontal <bool>
vertical <bool>
overdrag <bool>
overdragScale <number>
momentum <bool>
momentumOptions <{friction:n, tolerance:n}>
momentumVelocityMultiplier <number>
bounce <bool>
bounceOptions <{friction:n, tension:n, tolerance:n}>
velocity <x:n, y:n> (readonly)
angle <n> (readonly)
speedX <number>
speedY <number>
updatePosition(<{x:n, y:n}>) (to override the actual setting with whatever)
lockDirection <bool>
lockDirectionOptions: <{thresholdX:n, thresholdY:n}>
pixelAlign <bool>
isDragging
isAnimating
"""

class exports.LayerDraggable extends BaseClass

	@define "horizontal", @simpleProperty "horizontal", true, true
	@define "vertical", @simpleProperty "vertical", true, true

	@define "speedX", @simpleProperty "speedX", 1, true
	@define "speedY", @simpleProperty "speedY", 1, true

	@define "lockDirection", @simpleProperty "lockDirection", false, true

	@define "constraints",
		get: -> @_constraints
		set: (value) -> 
			if value and _.isObject(value)
				@_constraints = _.defaults(value, {x:0, y:0, width:0, height:0})
			else
				@_constraints = null
			@_updateSimulationConstraints(@_constraints) if @_constraints

	@define "isDragging", get: -> @_isDragging or false

	@define "isAnimating", get: -> @_isAnimating or false

	# TODO: what to do with this?
	# Should there be a tap event?
	# @define "multipleDraggables", @simpleProperty "multipleDraggables", false, true

	constructor: (@layer) ->

		_.extend(@, Defaults.getDefaults "LayerDraggable", {})

		super

		@enabled = true

		

		# TODO: will have to change panRecognizer's horizontal/vertical etc 
		# when they are changed on the LayerDraggable
		# @_panRecognizer = new PanRecognizer @eventBuffer
		
		@_eventBuffer = new EventBuffer
		@_constraints = null
		@_propagateEvents = false

		@attach()

	attach: -> 
		@layer.on Events.TouchStart, @_touchStart

		# @_panRecognizer.on Events.DidStartPan, (direction) =>
		# 	@emit Events.DidStartLockDirection direction

	remove: -> @layer.off(Events.TouchStart, @_touchStart)

	updatePosition: (point) ->
		# Override this to add your own behaviour to the update position
		return point

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
		@_layerStartPoint =
			x: @layer.x
			y: @layer.y
		
		if @bounce
			@_layerStartPoint = @_constrainPosition(@_layerStartPoint, @constraints, 1 / @overdragScale)

		# Store start cursor position
		@_cursorStartPoint =
			x: touchEvent.clientX
			y: touchEvent.clientY

		# Store cursor/layer offset
		@_layerCursorOffset =
			x: touchEvent.clientX - @_layerStartPoint.x
			y: touchEvent.clientY - @_layerStartPoint.y

		# Store the current layer scale so we can correct movement for it
		@_screenScale =
			x: @layer.screenScaleX()
			y: @layer.screenScaleY()

		document.addEventListener(Events.TouchMove, @_touchMove)
		document.addEventListener(Events.TouchEnd, @_touchEnd)

		@_isDragging = true
		@emit(Events.DragStart, event)

	_touchMove: (event) =>

		return unless @enabled

		event.preventDefault()
		event.stopPropagation() unless @_propagateEvents

		@emit(Events.DragWillMove, event)

		touchEvent = Events.touchEvent(event)

		@_eventBuffer.push
			x: touchEvent.clientX
			y: touchEvent.clientY
			t: touchEvent.timeStamp

		delta =
			x: touchEvent.clientX - @_cursorStartPoint.x
			y: touchEvent.clientY - @_cursorStartPoint.y

		# Correct for current drag speed and scale
		correctedDelta =
			x: delta.x * @speedX * (1 / @_screenScale.x)
			y: delta.y * @speedY * (1 / @_screenScale.y)
			t: event.timeStamp

		# Pixel align all moves
		if @pixelAlign
			point = 
				x: parseInt(@_cursorStartPoint.x + correctedDelta.x - @_layerCursorOffset.x)
				y: parseInt(@_cursorStartPoint.y + correctedDelta.y - @_layerCursorOffset.y)

		# Constraints
		point = @_constrainPosition(point, @_constraints) if @_constraints

		# TODO: Direction lock

		# if @directionLock
		# 	@_updateDirectionLock(correctedDelta) if ! @_directionIsLocked
			
		# 	@layer.x = @_layerStartPoint.x if @_xAxisLock
		# 	@layer.y = @_layerStartPoint.y if @_yAxisLock	
		# else
		# 	@layer.x = @_layerStartPoint.x
		# 	@layer.y = @_layerStartPoint.y


		_.extend(@layer, @updatePosition(point))

		@emit(Events.DragMove, event)
		@emit(Events.DragDidMove, event)

	_touchEnd: (event) =>

		document.removeEventListener(Events.TouchMove, @_touchMove)
		document.removeEventListener(Events.TouchEnd, @_touchEnd)

		# Start the simulation prior to emitting the DragEnd event.
		# This way, if the user calls layer.animate on DragEnd, the simulation will 
		# be canceled by the user's animation (if the user animates x and/or y).
		@_startSimulation() if @momentum

		@emit(Events.DragEnd, event)

		# # Set _isDragging after DragEnd is fired, so that calls to calculateVelocity() 
		# # still returns dragging velocity - both in case the user calls calculateVelocity(),
		# # (which would return a stale value before the simulation had finished one tick)
		# # and because @_start currently calls calculateVelocity().
		@_isDragging = false


	##############################################################
	# Constraints

	_clampAndScale: (value, min, max, scale) ->
		# TODO: Move to utils? Combine with clamp?
		value = min + (value - min) * scale if value < min
		value = max + (value - max) * scale if value > max
		return value

	_calculateConstraints: (bounds) ->

		constraints = 
			minX: Utils.frameGetMinX(bounds)
			maxX: Utils.frameGetMaxX(bounds)
			minY: Utils.frameGetMinY(bounds)
			maxY: Utils.frameGetMaxY(bounds)

		# It makes sense to take the dimensions of the object into account
		constraints.maxX -= @layer.width
		constraints.maxY -= @layer.height

		return constraints

	_constrainPosition: (point, bounds, scale) ->
		
		{minX, maxX, minY, maxY} = @_calculateConstraints(@_constraints)

		if @overdrag
			return point = 
				x: @_clampAndScale(point.x, minX, maxX, @overdragScale)
				y: @_clampAndScale(point.y, minY, maxY, @overdragScale)
		else
			return point = 
				x: Utils.clamp(point.x, minX, maxX)
				y: Utils.clamp(point.y, minY, maxY)

	# A convenience method for getting scrolling behavior from LayerDraggable.
	# The layer will pan around within the frame passed.
	# 
	# If the layer dimensions are smaller then the frame passed, the layer will
	# not move at all (unless overdrag is on, in which case the layer will
	# move, but spring back to 0 when dragging has finished).
	# setScrollConstraints: (constraints) ->
	# 	layerWidthTooSmall = @layer.width < constraints.width
	# 	layerHeightTooSmall = @layer.height < constraints.height

	# 	if layerWidthTooSmall
	# 		x = 0
	# 		width = @layer.width
	# 	else
	# 		x = - @layer.width + constraints.width
	# 		width = @layer.width * 2 - constraints.width

	# 	if layerHeightTooSmall
	# 		y = 0
	# 		height = @layer.height
	# 	else
	# 		y = - @layer.height + constraints.height
	# 		height = @layer.height * 2 - constraints.height

	# 	@constraints = {x, y, width, height}

	##############################################################
	# Velocity

	@define "velocity",
		get: ->
			return @_eventBuffer.velocity if @isDragging
			return @_calculateSimulationVelocity() if @isAnimating
			return {x:0, y:0}
		set: -> throw Error "You can't set velocity on a draggable"

	@define "angle",
		get: -> @_eventBuffer.angle
		set: -> throw Error "You can't set angle on a draggable"


	calculateVelocity: ->
		# Compatibility method
		@velocity

	_calculateSimulationVelocity: ->

		xFinished = @_simulation.x.finished()
		yFinished = @_simulation.y.finished()

		velocity = {x:0, y:0}
		velocity.x = (@_simulation.x.getState().v / @velocityScale) if not xFinished
		velocity.y = (@_simulation.y.getState().v / @velocityScale) if not yFinished

		return velocity

	##############################################################
	# Event Handling

	emit: (eventName, event) ->

		# TODO: Add new event properties like position corrected for device

		# Pass this to the layer above
		@layer.emit(eventName, event, @)

		super eventName, event, @

	# _updateDirectionLock: (correctedDelta) ->
		
	# 	@_xAxisLock = Math.abs(correctedDelta.x) > @constructor.DragThreshold
	# 	@_yAxisLock = Math.abs(correctedDelta.y) > @constructor.DragThreshold
		
	# 	xSlightlyPreferred = Math.abs(correctedDelta.x) > @constructor.DragThreshold / 2
	# 	ySlightlyPreferred = Math.abs(correctedDelta.y) > @constructor.DragThreshold / 2
		
	# 	# Allow locking in both directions at the same time
	# 	@_xAxisLock = @_yAxisLock = true if (xSlightlyPreferred && ySlightlyPreferred)

	# 	if @_xAxisLock || @_yAxisLock

	# 		@_directionIsLocked = true

	# 		@emit Events.DirectionLock, 
	# 			x: @_xAxisLock
	# 			y: @_yAxisLock

	# 		@_propagateEvents = false if @multipleDraggables




	##############################################################
	# Inertial scroll simulation


	_setupSimulation: ->
		return if @_simulation

		@_simulation = 
			x: @_setupSimulationForAxis("x")
			y: @_setupSimulationForAxis("y")

		@_updateSimulationConstraints(@constraints)

	_setupSimulationForAxis: (axis) ->
		
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

			# The simulation state has x as value, it can look confusing here
			# as we're working with x and y.

			if @constraints
				if @bounce
					@layer[axis] = state.x
				else
					{minX, maxX, minY, maxY} = @_calculateConstraints(@_constraints)
					@layer[axis] = Utils.clamp(state.x, minX, maxX) if axis is "x"
					@layer[axis] = Utils.clamp(state.x, minY, maxY) if axis is "y"
			else
				@layer[axis] = state.x

		simulation.on Events.SimulationStop, (state) =>
			# Round the end position to whole pixels
			@layer[axis] = parseInt(@layer[axis])

		return simulation

	_updateSimulationConstraints: (constraints) ->
		# This is where we let the simulator know about our constraints
		return unless @_simulation
		if constraints
			{minX, maxX, minY, maxY} = @_calculateConstraints(@_constraints)
			@_simulation.x.setOptions({min:minX, max:maxX})
			@_simulation.y.setOptions({min:minY, max:maxY})
		else
			@_simulation.x.setOptions({min:-Infinity, max:+Infinity})
			@_simulation.y.setOptions({min:-Infinity, max:+Infinity})

	_startSimulation: ->

		return unless @momentum or @bounce

		@_isAnimating = true
		@_setupSimulation()

		velocity = @velocity

		@_simulation.x.start()
		@_simulation.x.setState
			x: @layer.x
			v: velocity.x * @momentumVelocityMultiplier

		@_simulation.y.start()
		@_simulation.y.setState
			x: @layer.y
			v: velocity.y * @momentumVelocityMultiplier

	_stopSimulation: =>
		@_simulation.x?.stop()
		@_simulation.y?.stop()
		@_isAnimating = false

