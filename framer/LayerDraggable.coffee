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
Events.DidStartAnimation     = "didstartanimation"
Events.DidEndAnimation       = "didendanimation"
Events.DidStartLockDirection = "didstartlockdirection"

"""
TODO:

- Check if all events are thrown correctly
- Deal with nested draggables
	- Event propagation (click vs move)
	- Multiple scroll moves
	- Multiple lock directions
	
"""

class exports.LayerDraggable extends BaseClass

	@define "speedX", @simpleProperty "speedX", 1, true
	@define "speedY", @simpleProperty "speedY", 1, true

	@define "horizontal", @simpleProperty "horizontal", true, true
	@define "vertical", @simpleProperty "vertical", true, true

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
		# @_propagateEvents = false

		# We don't expose this for now because it's more a constant that maps
		# dragging to simulator velocity correctly.
		@_momentumVelocityMultiplier = 890

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

		# @_propagateEvents = true if (@multipleDraggables && @lockDirection)

		@layer.animateStop()
		@_stopSimulation()
		@_resetLockDirection()

		# event.preventDefault()
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
		
		if @constraints and @bounce
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

		# event.preventDefault()
		# event.stopPropagation() unless @_propagateEvents

		@emit(Events.DragWillMove, event)

		touchEvent = Events.touchEvent(event)

		@_eventBuffer.push
			x: touchEvent.clientX
			y: touchEvent.clientY
			t: Date.now() # We don't use timeStamp because it's different on Chrome/Safari

		delta =
			x: touchEvent.clientX - @_cursorStartPoint.x
			y: touchEvent.clientY - @_cursorStartPoint.y

		# Correct for current drag speed and scale
		correctedDelta =
			x: delta.x * @speedX * (1 / @_screenScale.x)
			y: delta.y * @speedY * (1 / @_screenScale.y)
			t: Date.now()

		point = 
			x: @layer.x
			y: @layer.y

		point.x = @_cursorStartPoint.x + correctedDelta.x - @_layerCursorOffset.x if @horizontal
		point.y = @_cursorStartPoint.y + correctedDelta.y - @_layerCursorOffset.y if @vertical


		# Direction lock
		if @lockDirection
			if not @_lockDirectionEnabledX and not @_lockDirectionEnabledY
				@_updateLockDirection(correctedDelta) 
				return
			else
				point.x = @_layerStartPoint.x if @_lockDirectionEnabledX
				point.y = @_layerStartPoint.y if @_lockDirectionEnabledY

		# Constraints
		if @_constraints
			point = @_constrainPosition(point, @_constraints)

		# Pixel align all moves
		if @pixelAlign
			point.x = parseInt(point.x)
			point.y = parseInt(point.y)

		@layer.point = @updatePosition(point)

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

	##############################################################
	# Velocity

	@define "velocity",
		get: ->
			return @_eventBuffer.velocity if @isDragging
			return @_calculateSimulationVelocity() if @isAnimating
			return {x:0, y:0}

	@define "angle",
		get: -> @_eventBuffer.angle

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

	_updateLockDirection: (correctedDelta) ->
		
		@_lockDirectionEnabledX = Math.abs(correctedDelta.y) > @lockDirectionThreshold.y
		@_lockDirectionEnabledY = Math.abs(correctedDelta.x) > @lockDirectionThreshold.x
		
		xSlightlyPreferred = Math.abs(correctedDelta.y) > @lockDirectionThreshold.y / 2
		ySlightlyPreferred = Math.abs(correctedDelta.x) > @lockDirectionThreshold.x / 2
		
		# Allow locking in both directions at the same time
		@_lockDirectionEnabledX = @_lockDirectionEnabledY = true if (xSlightlyPreferred and ySlightlyPreferred)

		if @_lockDirectionEnabledX or @_lockDirectionEnabledY

			@emit Events.DirectionLock, 
				x: @_lockDirectionEnabledX
				y: @_lockDirectionEnabledY

			# @_propagateEvents = false if @multipleDraggables


	_resetLockDirection: ->
		@_lockDirectionEnabledX = false
		@_lockDirectionEnabledY = false


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

		simulation.on Events.SimulationStep, (state) => @_onSimulationStep(axis, state)
		simulation.on Events.SimulationStop, (state) => @_onSimulationStop(axis, state)
		simulation

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

	_onSimulationStep: (axis, state) =>

		return if axis is "x" and (@_lockDirectionEnabledX or @horizontal is false)
		return if axis is "y" and (@_lockDirectionEnabledY or @vertical is false)

		# The simulation state has x as value, it can look confusing here
		# as we're working with x and y.

		# TODO: Maybe we need to take speedX, speedY into account here
		updatePoint = {}

		if @constraints
			if @bounce
				updatePoint[axis] = state.x
			else
				{minX, maxX, minY, maxY} = @_calculateConstraints(@_constraints)
				updatePoint[axis] = Utils.clamp(state.x, minX, maxX) if axis is "x"
				updatePoint[axis] = Utils.clamp(state.x, minY, maxY) if axis is "y"
		else
			updatePoint[axis] = state.x

		@layer[axis] = @updatePosition(updatePoint)[axis]

	_onSimulationStop: (axis, state) =>

		@emit(Events.DidEndAnimation, {axis:axis})

		# Round the end position to whole pixels
		@layer[axis] = parseInt(@layer[axis]) if @pixelAlign

		# See if both simulators are stopped
		if @_simulation.x.finished() and @_simulation.y.finished()
			@_stopSimulation()

	_startSimulation: ->

		return unless @momentum or @bounce

		@_isAnimating = true
		@_setupSimulation()

		velocity = @velocity

		
		@_simulation.x.setState
			x: @layer.x
			v: velocity.x * @_momentumVelocityMultiplier
		@_simulation.x.start()

		
		@_simulation.y.setState
			x: @layer.y
			v: velocity.y * @_momentumVelocityMultiplier
		@_simulation.y.start()

		@emit(Events.DidStartAnimation)

	_stopSimulation: =>
		@_simulation?.x.stop()
		@_simulation?.y.stop()
		@_isAnimating = false
		@emit(Events.DidEndAnimation)

	animateStop: ->
		@_stopSimulation()


