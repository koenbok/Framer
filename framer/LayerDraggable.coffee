{_} = require "./Underscore"

Utils        = require "./Utils"
{BaseClass}  = require "./BaseClass"
{Events}     = require "./Events"
{Simulation} = require "./Simulation"
{Defaults}   = require "./Defaults"
{EventBuffer} = require "./EventBuffer"
{Gestures}    = require "./Gestures"

Events.Move                  = "move"
Events.DragStart             = "dragstart"
Events.DragWillMove          = "dragwillmove"
Events.DragMove              = "dragmove"
Events.DragDidMove           = "dragmove"
Events.Drag                  = "dragmove"
Events.DragEnd               = "dragend"
Events.DragAnimationStart 	 = "draganimationstart"
Events.DragAnimationEnd   	 = "draganimationend"
Events.DirectionLockStart = "directionlockstart"

"""
             
    ┌──────┐                   │         
    │      │                             
    │      │  ───────────────▶ │ ◀────▶  
    │      │                             
    └──────┘                   │         
                                         
    ════════  ═════════════════ ═══════  
                                         
      Drag         Momentum      Bounce  
                                             
"""

class exports.LayerDraggable extends BaseClass

	@define "speedX", @simpleProperty("speedX", 1)
	@define "speedY", @simpleProperty("speedY", 1)

	@define "horizontal", @simpleProperty("horizontal", true)
	@define "vertical", @simpleProperty("vertical", true)

	@define "momentumVelocityMultiplier", @simpleProperty("momentumVelocityMultiplier", 800)
	@define "directionLock", @simpleProperty("directionLock", true)
	@define "directionLockThreshold", @simpleProperty("directionLockThreshold", {x:10, y:10})
	@define "propagateEvents", @simpleProperty("propagateEvents", true)

	@define "constraints",
		get: -> @_constraints
		set: (value) -> 
			if value and _.isObject(value)
				@_constraints = _.defaults(value, {x:0, y:0, width:0, height:0})
			else
				@_constraints = {x:0, y:0, width:0, height:0}
			@_updateSimulationConstraints(@_constraints) if @_constraints

	# The isDragging only is true when there was actual movement, so you can
	# use it to determine a click from a drag event.
	@define "isDragging", get: -> @_isDragging or false
	@define "isAnimating", get: -> @_isAnimating or false
	@define "isMoving", get: -> @_isMoving or false

	@define "layerStartPoint", get: -> @_layerStartPoint or @layer.point
	@define "cursorStartPoint", get: -> @_cursorStartPoint or {x:0, y:0}
	@define "layerCursorOffset", get: -> @_layerCursorOffset or {x:0, y:0}

	@define "offset",
		get: ->
			return {x:0, y:0} if not @_correctedLayerStartPoint
			return offset = 
				x: @layer.x - @_correctedLayerStartPoint.x
				y: @layer.y - @_correctedLayerStartPoint.y

	constructor: (@layer) ->

		options = Defaults.getDefaults("LayerDraggable", {})

		super options

		_.extend(@, options)

		@enabled = true

		# TODO: will have to change panRecognizer's horizontal/vertical etc 
		# when they are changed on the LayerDraggable
		# @_panRecognizer = new PanRecognizer @eventBuffer
		
		@_eventBuffer = new EventBuffer
		@_constraints = null
		@_ignoreUpdateLayerPosition = true

		@attach()

	attach: -> 
		@layer.on(Gestures.TapStart, @touchStart)
		@layer.on(Gestures.Pan, @_touchMove)
		@layer.on(Gestures.TapEnd, @_touchEnd)
		@layer.on("change:x", @_updateLayerPosition)
		@layer.on("change:y", @_updateLayerPosition)

	remove: ->
		@layer.off(Gestures.PanStart, @touchStart)
		@layer.off(Gestures.Pan, @_touchMove)
		@layer.off(Gestures.PanEnd, @_touchEnd)

	updatePosition: (point) ->
		# Override this to add your own behaviour to the update position
		return point

	touchStart: (event) =>
		# We expose this publicly so you can start the dragging from an external event
		# this is for example needed with the slider.
		@_touchStart(event)

	_updateLayerPosition: =>
		# This updates the layer position if it's extrenally changed while
		# a drag is going on at the same time.
		return if @_ignoreUpdateLayerPosition is true
		@_point = @layer.point

	_touchStart: (event) =>

		# Only reset isMoving if this was not animating when we were clicking
		# so we can use it to detect a click versus a drag.
		@_isMoving = @isAnimating

		@layer.animateStop()
		@_stopSimulation()
		@_resetdirectionLock()

		event.preventDefault()
		event.stopPropagation() unless @propagateEvents

		# Extract the event (mobile may have multiple)
		touchEvent = Events.touchEvent(event)

		# TODO: we should use the event velocity
		@_eventBuffer.push
			x: touchEvent.clientX
			y: touchEvent.clientY
			t: Date.now()

		# Store original layer position
		@_layerStartPoint = @layer.point
		@_correctedLayerStartPoint = @layer.point
		
		# If we are beyond bounds, we need to correct for the scaled clamping from the last drag, 
		# hence the 1 / overdragScale
		if @constraints and @bounce
			@_correctedLayerStartPoint = @_constrainPosition(
				@_correctedLayerStartPoint, @constraints, 1 / @overdragScale)

		# Store start cursor position
		@_cursorStartPoint =
			x: touchEvent.clientX
			y: touchEvent.clientY

		# Store cursor/layer offset
		@_layerCursorOffset =
			x: touchEvent.clientX - @_correctedLayerStartPoint.x
			y: touchEvent.clientY - @_correctedLayerStartPoint.y

		@_point = @_correctedLayerStartPoint
		@_ignoreUpdateLayerPosition = false

		@emit(Events.DragStart, event)

	_touchMove: (event) =>

		return unless @enabled

		@_lastEvent = event

		event.preventDefault()
		event.stopPropagation() unless @propagateEvents

		touchEvent = Events.touchEvent(event)

		@_eventBuffer.push
			x: touchEvent.clientX
			y: touchEvent.clientY
			t: Date.now() # We don't use timeStamp because it's different on Chrome/Safari

		point = _.clone(@_point)

		scaleX = (1 / @layer.canvasScaleX() * @layer.scale * @layer.scaleX)
		scaleY = (1 / @layer.canvasScaleY() * @layer.scale * @layer.scaleY)

		point.x = @_point.x + (event.delta.x * scaleX) if @horizontal
		point.y = @_point.y + (event.delta.y * scaleY) if @vertical

		# Save the point for the next update so we have the unrounded, unconstrained value
		@_point = _.clone(point)

		# Constraints and overdrag
		point = @_constrainPosition(point, @_constraints, @overdragScale) if @_constraints

		# Direction lock
		if @directionLock
			if not @_directionLockEnabledX and not @_directionLockEnabledY
				@_updatedirectionLock(offset) 
				return
			else
				point.x = @_layerStartPoint.x if @_directionLockEnabledX
				point.y = @_layerStartPoint.y if @_directionLockEnabledY

		# Update the dragging status
		if point.x isnt @_layerStartPoint.x or point.y isnt @_layerStartPoint.y
			@_isDragging = true
			@_isMoving = true

		# Move literally means move. If there is no movement, we do not emit.
		if @isDragging
			@emit(Events.DragWillMove, event)

		# Align every drag to pixels
		if @pixelAlign
			point.x = parseInt(point.x) if @horizontal
			point.y = parseInt(point.y) if @vertical

		# While we update the layer position ourselves, we don't want
		# to trigger the updater for external changes.
		@_ignoreUpdateLayerPosition = true
		@layer.point = @updatePosition(point)
		@_ignoreUpdateLayerPosition = false
 
		if @isDragging
			@emit(Events.Move, @layer.point)
			@emit(Events.DragDidMove, event)

	_touchEnd: (event) =>

		event.stopPropagation() unless @propagateEvents

		# Start the simulation prior to emitting the DragEnd event.
		# This way, if the user calls layer.animate on DragEnd, the simulation will 
		# be canceled by the user's animation (if the user animates x and/or y).
		@_startSimulation()

		@emit(Events.DragEnd, event)

		# Set _isDragging after DragEnd is fired, so that calls to calculateVelocity() 
		# still returns dragging velocity - both in case the user calls calculateVelocity(),
		# (which would return a stale value before the simulation had finished one tick)
		# and because @_start currently calls calculateVelocity().
		@_isDragging = false

		@_ignoreUpdateLayerPosition = true


	##############################################################
	# Constraints

	@define "constraintsOffset",
		get: ->
			return {x:0, y:0} unless @constraints
			{minX, maxX, minY, maxY} = @_calculateConstraints(@constraints)
			point = @layer.point
			constrainedPoint = 
				x: Utils.clamp(point.x, minX, maxX)
				y: Utils.clamp(point.y, minY, maxY)
			offset = 
				x: point.x - constrainedPoint.x
				y: point.y - constrainedPoint.y
			return offset

	@define "isBeyondConstraints",
		get: ->
			constraintsOffset = @constraintsOffset
			return true if constraintsOffset.x != 0
			return true if constraintsOffset.y != 0
			return false

	_clampAndScale: (value, min, max, scale) ->
		# TODO: Move to utils? Combine with clamp?
		value = min + (value - min) * scale if value < min
		value = max + (value - max) * scale if value > max
		return value

	_calculateConstraints: (bounds) ->

		if not bounds
			return constraints = 
				minX: Infinity
				maxX: Infinity
				minY: Infinity
				maxY: Infinity

		constraints = 
			minX: Utils.frameGetMinX(bounds)
			maxX: Utils.frameGetMaxX(bounds)
			minY: Utils.frameGetMinY(bounds)
			maxY: Utils.frameGetMaxY(bounds)

		# It makes sense to take the dimensions of the object into account
		constraints.maxX -= @layer.width
		constraints.maxY -= @layer.height

		return constraints

	_constrainPosition: (proposedPoint, bounds, scale) ->
		
		{minX, maxX, minY, maxY} = @_calculateConstraints(@_constraints)

		if @overdrag
			point = 
				x: @_clampAndScale(proposedPoint.x, minX, maxX, scale)
				y: @_clampAndScale(proposedPoint.y, minY, maxY, scale)
		else
			point = 
				x: Utils.clamp(proposedPoint.x, minX, maxX)
				y: Utils.clamp(proposedPoint.y, minY, maxY)

		point.x = proposedPoint.x if @speedX == 0 or @horizontal is false
		point.y = proposedPoint.y if @speedY == 0 or @vertical   is false

		return point

	##############################################################
	# Velocity

	@define "velocity",
		get: ->
			return @_calculateSimulationVelocity() if @isAnimating
			return @_eventBuffer.velocity 
			return {x:0, y:0}

			# return @_eventBuffer.velocity if @isDragging
			# return @_calculateSimulationVelocity() if @isAnimating
			# return {x:0, y:0}

	@define "angle",
		get: -> @_eventBuffer.angle

	@define "direction",
		get: ->
			# return null if not @isDragging
			velocity = @velocity
			if Math.abs(velocity.x) > Math.abs(velocity.y)
				return "right" if velocity.x > 0
				return "left"
			else
				return "down" if velocity.y > 0
				return "up"

	calculateVelocity: ->
		# Compatibility method
		@velocity

	_calculateSimulationVelocity: ->

		xFinished = @_simulation.x.finished()
		yFinished = @_simulation.y.finished()

		velocity = {x:0, y:0}
		velocity.x = (@_simulation.x.simulator.state.v / @momentumVelocityMultiplier) if not xFinished
		velocity.y = (@_simulation.y.simulator.state.v / @momentumVelocityMultiplier) if not yFinished

		return velocity

	##############################################################
	# Event Handling

	emit: (eventName, event) ->

		# TODO: Add new event properties like position corrected for device

		# Pass this to the layer above
		@layer.emit(eventName, event, @)

		super eventName, event, @

	##############################################################
	# Lock Direction

	_updatedirectionLock: (correctedDelta) ->
		
		@_directionLockEnabledX = Math.abs(correctedDelta.y) > @directionLockThreshold.y
		@_directionLockEnabledY = Math.abs(correctedDelta.x) > @directionLockThreshold.x
		
		# TODO: This wasn't working as advertised. We shouls have a way to scroll diagonally
		# if we were sort of moving into both directions equally.
		
		# xSlightlyPreferred = Math.abs(correctedDelta.y) > @directionLockThreshold.y / 2
		# ySlightlyPreferred = Math.abs(correctedDelta.x) > @directionLockThreshold.x / 2
		
		# # Allow locking in both directions at the same time
		# @_directionLockEnabledX = @_directionLockEnabledY = true if (xSlightlyPreferred and ySlightlyPreferred)

		if @_directionLockEnabledX or @_directionLockEnabledY
			@emit Events.DirectionLockStart, 
				x: @_directionLockEnabledX
				y: @_directionLockEnabledY

	_resetdirectionLock: ->
		@_directionLockEnabledX = false
		@_directionLockEnabledY = false

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
			@_simulation.x.simulator.options = {min:minX, max:maxX}
			@_simulation.y.simulator.options = {min:minY, max:maxY}
		else
			@_simulation.x.simulator.options = {min:-Infinity, max:+Infinity}
			@_simulation.y.simulator.options = {min:-Infinity, max:+Infinity}

	_onSimulationStep: (axis, state) =>

		return if axis is "x" and @horizontal is false
		return if axis is "y" and @vertical is false

		# The simulation state has x as value, it can look confusing here
		# as we're working with x and y.

		if @constraints
			if @bounce
				delta = state.x - @layer[axis]
			else
				{minX, maxX, minY, maxY} = @_calculateConstraints(@_constraints)
				delta = Utils.clamp(state.x, minX, maxX) - @layer[axis] if axis is "x"
				delta = Utils.clamp(state.x, minY, maxY) - @layer[axis] if axis is "y"
		else
			delta = state.x - @layer[axis]

		updatePoint = @layer.point
		updatePoint[axis] = updatePoint[axis] + (delta * @speedX) if axis is "x"
		updatePoint[axis] = updatePoint[axis] + (delta * @speedY) if axis is "y"
		@updatePosition(updatePoint)

		@layer[axis] = @updatePosition(updatePoint)[axis]
		@emit(Events.Move, @layer.point)

	_onSimulationStop: (axis, state) =>

		return if axis is "x" and @horizontal is false
		return if axis is "y" and @vertical is false
		return unless @_simulation

		# Round the end position to whole pixels
		@layer[axis] = parseInt(@layer[axis]) if @pixelAlign

		# See if both simulators are stopped
		if @_simulation.x.finished() and @_simulation.y.finished()
			@_stopSimulation()

	_startSimulation: ->

		# The types of simulation that we can have are:
		# 1) Momentum inside constraints
		# 2) Momentum inside constraints to outside constraints bounce
		# 3) Release outside constraints bounce
		# 4) Momentum without constraints

		return unless @momentum or @bounce
		return if @isBeyondConstraints is false and @momentum is false
		return if @isBeyondConstraints is false and @isDragging is false

		# If overdrag is disabled, we need to not have a bounce animation
		# when the cursor is outside of the dragging bounds for an axis.
		{minX, maxX, minY, maxY} = @_calculateConstraints(@_constraints)

		startSimulationX = @overdrag is true or (@layer.x > minX and @layer.x < maxX)
		startSimulationY = @overdrag is true or (@layer.y > minY and @layer.y < maxY)

		if startSimulationX is startSimulationY is false
			return

		velocity = @velocity

		velocityX = velocity.x * @momentumVelocityMultiplier * @speedX * (1 / @layer.canvasScaleX()) * @layer.scaleX * @layer.scale
		velocityY = velocity.y * @momentumVelocityMultiplier * @speedY * (1 / @layer.canvasScaleY()) * @layer.scaleY * @layer.scale

		@_setupSimulation()
		@_isAnimating = true
		@_isMoving = true
		
		@_simulation.x.simulator.setState
			x: @layer.x
			v: velocityX
		@_simulation.x.start() if startSimulationX

		@_simulation.y.simulator.setState
			x: @layer.y
			v: velocityY
		@_simulation.y.start() if startSimulationY

		@emit(Events.DragAnimationStart)

	_stopSimulation: =>
		@_isAnimating = false
		return unless @_simulation
		@_simulation?.x.stop()
		@_simulation?.y.stop()
		@_simulation = null
		@emit(Events.Move, @layer.point)
		@emit(Events.DragAnimationEnd)

	animateStop: ->
		@_stopSimulation()

	##############################################################
	## EVENT HELPERS
	
	onMove: (cb) -> @on(Events.Move, cb)
	onDragStart: (cb) -> @on(Events.DragStart, cb)
	onDragWillMove: (cb) -> @on(Events.DragWillMove, cb)
	onDragMove: (cb) -> @on(Events.DragMove, cb)
	onDragDidMove: (cb) -> @on(Events.DragDidMove, cb)
	onDrag: (cb) -> @on(Events.Drag, cb)
	onDragEnd: (cb) -> @on(Events.DragEnd, cb)
	onDragAnimationStart: (cb) -> @on(Events.DragAnimationStart, cb)
	onDragAnimationEnd: (cb) -> @on(Events.DragAnimationEnd, cb)
	onDirectionLockStart: (cb) -> @on(Events.DirectionLockStart, cb)

