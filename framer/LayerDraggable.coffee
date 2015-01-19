{_} = require "./Underscore"

Utils = require "./Utils"
{BaseClass} = require "./BaseClass"
{Events} = require "./Events"
{Frame} = require "./Frame"
{Simulation} = require "./Simulation"

# Add specific events for draggable
Events.DragStart = "dragstart"
Events.DragMove = "dragmove"
Events.DragEnd = "dragend"

Events.DirectionLock = "directionLock"

"""
This takes any layer and makes it draggable by the user on mobile or desktop.

Some interesting things are:

- The draggable.calculateVelocity().x|y contains the current average speed 
  in the last 100ms (defined with VelocityTimeOut).
- You can enable/disable or slowdown/speedup scrolling with
  draggable.speed.x|y

"""

class exports.LayerDraggable extends BaseClass

	@VelocityTimeOut = 100
	@VelocityMultiplier = 890
	@DragThreshold = 10
	@OverscrollScale = 0.5
	@SimulationModelOptions =
		scrollFriction: 2.1
		scrollTolerance: 1/10
		springFriction: 40
		springTension: 200
		springTolerance: 1/10000

	constructor: (@layer) ->

		super

		@_deltas = []
		@_isDragging = false

		@enabled = true
		@speedX = 1.0
		@speedY = 1.0
		
		@_maxDragFrame = null
		@_inertialScroll = false

		@_xAxisLock = false
		@_yAxisLock = false
		@_directionIsLocked = false
		@_propagateEvents = false

		@attach()

	@define "overscroll", @simpleProperty "overscroll", null, true

	@define "directionLock", @simpleProperty "directionLock", false, true

	@define "multipleDraggables", @simpleProperty "multipleDraggables", false, true

	##############################################################
	# Scroll bounds

	@define "maxDragFrame",
		get: -> @_maxDragFrame
		set: (value) ->
			if _.isFunction(value)
				@_maxDragFrame = value
			else
				@_maxDragFrame = new Frame value
				
			@_updateInertialScrollBounds() if @_inertialScroll

	_scrollBounds: =>
		maxDragFrame = _.result(@, 'maxDragFrame')
		if maxDragFrame
			dragFrame =
				minX: maxDragFrame.minX
				minY: maxDragFrame.minY
				maxX: maxDragFrame.maxX - @layer.width
				maxY: maxDragFrame.maxY - @layer.height
		else
			# TODO: A bit of a hack for unconstrained scrolling. Fine for now, as
			# all the maxDragFrame-related methods will likely be rewritten.
			dragFrame = 
				minX: -Infinity
				minY: -Infinity
				maxX: Infinity
				maxY: Infinity
		return dragFrame

	_clamp: (value, min, max) ->
		value = min if value < min
		value = max if value > max
		return value

	_clampAndScalePastBounds: (value, min, max, scale) ->
		value = min + (value - min) * scale if value < min
		value = max + (value - max) * scale if value > max
		return value

	_constrainPositionToBounds: (position, bounds, scale) ->
		{minX, maxX, minY, maxY} = bounds

		newPosition = {}

		if @overscroll
			newPosition.x = @_clampAndScalePastBounds position.x, minX, maxX, scale
			newPosition.y = @_clampAndScalePastBounds position.y, minY, maxY, scale
		else
			newPosition.x = @_clamp position.x, minX, maxX
			newPosition.y = @_clamp position.y, minY, maxY

		return newPosition 

	# A convenience property for getting scrolling behavior from LayerDraggable.
	# The layer will pan around within the frame passed.
	# 
	# If the layer dimensions are smaller then the frame passed, the layer will
	# not move at all (unless overscroll is on, in which case the layer will
	# move, but spring back to 0 when dragging has finished).
	@define "maxScrollFrame",
		get: ->
			throw Error """You can only assign to maxScrollFrame, which computes a new 
			maxDragFrame. Try accessing maxDragFrame instead."""
		set: (value) ->
			layerWidthTooSmall = @layer.width < value.width
			layerHeightTooSmall = @layer.height < value.height

			if layerWidthTooSmall
				x = 0
				width = @layer.width
			else
				x = - @layer.width + value.width
				width = @layer.width * 2 - value.width

			if layerHeightTooSmall
				y = 0
				height = @layer.height
			else
				y = - @layer.height + value.height
				height = @layer.height * 2 - value.height

			@maxDragFrame = {x, y, width, height}

	##############################################################
	# Velocity

	# Take the "average" velocity over the last 100 milliseconds
	_calculateDraggingVelocity: ->

		earliestValidTime = Date.now() - @constructor.VelocityTimeOut
		deltas = _.filter @_deltas, (delta) =>
			delta.t > earliestValidTime

		if deltas.length < 2
			return {x:0, y:0}		

		curr = deltas[deltas.length - 1]
		prev = deltas[0]
		time = curr.t - prev.t

		velocity =
			x: (curr.x - prev.x) / time
			y: (curr.y - prev.y) / time

		velocity.x = 0 if velocity.x is Infinity
		velocity.y = 0 if velocity.y is Infinity

		if @directionLock
			velocity.x = 0 if ! @_xAxisLock
			velocity.y = 0 if ! @_yAxisLock

		return velocity

	_calculateInertialScrollingVelocity: ->

		xFinished = @_simulationX.finished()
		yFinished = @_simulationY.finished()

		correctedVelocity = {x:0, y:0}
		correctedVelocity.x = (@_simulationX.getState().v / @constructor.VelocityMultiplier) if ! xFinished
		correctedVelocity.y = (@_simulationY.getState().v / @constructor.VelocityMultiplier) if ! yFinished

		return correctedVelocity

	calculateVelocity: ->
		if @_isDragging
			return @_calculateDraggingVelocity()
		else if @_inertialScroll
			return @_calculateInertialScrollingVelocity()
		else
			return {x:0, y:0}

	##############################################################
	# Event Handling

	attach: -> @layer.on	Events.TouchStart, @_touchStart
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

	_updatePosition: (event) =>

		event.preventDefault()
		event.stopPropagation() if ! @_propagateEvents

		return if ! @enabled

		@emit Events.DragMove, event

		touchEvent = Events.touchEvent event

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
			@_position = @_constrainPositionToBounds(@_position, 
				@_scrollBounds(), @constructor.OverscrollScale)

		if @directionLock
			@_updateDirectionLock(correctedDelta) if ! @_directionIsLocked
			
			@layer.x = @_position.x if @_xAxisLock
			@layer.y = @_position.y if @_yAxisLock	
		else
			@layer.x = @_position.x
			@layer.y = @_position.y

		@_deltas.push correctedDelta

		@emit Events.DragMove, event

	_touchStart: (event) =>

		@_propagateEvents = true if (@multipleDraggables && @directionLock)

		event.preventDefault()
		event.stopPropagation() if ! @_propagateEvents

		@layer.animateStop()

		@_isDragging = true
		@_directionIsLocked = false
		@_xAxisLock = false
		@_yAxisLock = false

		@_position =
			x: @layer.x
			y: @layer.y
		
		if @overscroll
			@_position = @_constrainPositionToBounds(@_position, 
				@_scrollBounds(), (1 / @constructor.OverscrollScale))

		touchEvent = Events.touchEvent event

		@_start =
			x: touchEvent.clientX
			y: touchEvent.clientY

		@_offset =
			x: touchEvent.clientX - @_position.x
			y: touchEvent.clientY - @_position.y

		@_screenScale =
			x: @layer.screenScaleX()
			y: @layer.screenScaleY()

		document.addEventListener Events.TouchMove, @_updatePosition
		document.addEventListener Events.TouchEnd, @_touchEnd

		@emit Events.DragStart, event

	_touchEnd: (event) =>

		document.removeEventListener Events.TouchMove, @_updatePosition
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

	@define "inertialScroll",
		get: ->
			@_inertialScroll
		set: (value) ->
			@_inertialScroll = value
			if @_inertialScroll

				# Most likely, inertial scroll is coupled with overscroll, so turn
				# overscroll on unless it was explicitly turned off prior to this
				@overscroll ?= true

				@_simulationX ?= new Simulation
					layer: @layer
					properties: {x: true}
					model: "inertial-scroll"
					modelOptions: @constructor.SimulationModelOptions
				@_simulationY ?= new Simulation
					layer: @layer
					properties: {y: true}
					model: "inertial-scroll"
					modelOptions: @constructor.SimulationModelOptions

				# TODO: pixel align moves?
				@_simulationX.on Events.SimulationStep, (state) =>
					if @overscroll
						@layer.x = state.x
					else
						{minX, maxX} = @_scrollBounds()
						@layer.x = @_clamp state.x, minX, maxX

				@_simulationY.on Events.SimulationStep, (state) => 
					if @overscroll
						@layer.y = state.x
					else
						{minY, maxY} = @_scrollBounds()
						@layer.y = @_clamp state.x, minY, maxY

				@_updateInertialScrollBounds()
				@_startSimulation()
			else
				@_simulationX?.off Events.SimulationStep
				@_simulationY?.off Events.SimulationStep
				@_stopSimulation()

	_updateInertialScrollBounds: ->
		{minX, maxX, minY, maxY} = @_scrollBounds()

		@_simulationX.setOptions {min: minX, max: maxX}
		@_simulationY.setOptions {min: minY, max: maxY}

	_startSimulation: ->
		velocity = @calculateVelocity()

		@_simulationY.start()
		@_simulationY.setState
			x: @layer.y
			v: velocity.y * @constructor.VelocityMultiplier

		@_simulationX.start()
		@_simulationX.setState
			x: @layer.x
			v: velocity.x * @constructor.VelocityMultiplier

	_stopSimulation: =>
		@_simulationX?.stop()
		@_simulationY?.stop()

