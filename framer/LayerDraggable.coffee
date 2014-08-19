{_} = require "./Underscore"

Utils = require "./Utils"
{EventEmitter} = require "./EventEmitter"
{Events} = require "./Events"

# Add specific events for draggable
Events.DragStart = "dragstart"
Events.DragMove = "dragmove"
Events.DragEnd = "dragend"

"""
This takes any layer and makes it draggable by the user on mobile or desktop.

Some interesting things are:

- The draggable.calculateVelocity().x|y contains the current average speed 
  in the last 100ms (defined with VelocityTimeOut).
- You can enable/disable or slowdown/speedup scrolling with
  draggable.speed.x|y

"""

class exports.LayerDraggable extends EventEmitter

	@VelocityTimeOut = 100

	constructor: (@layer) ->

		@_deltas = []
		@_isDragging = false

		@enabled = true
		@speedX = 1.0
		@speedY = 1.0
		
		@maxDragFrame = null

		# @resistancePointX = null
		# @resistancePointY = null
		# @resistanceDistance = null

		@attach()

	attach: -> @layer.on  Events.TouchStart, @_touchStart
	remove: -> @layer.off Events.TouchStart, @_touchStart

	emit: (eventName, event) ->
		# We override this to get all events both on the draggable
		# and the encapsulated layer.
		@layer.emit eventName, event

		super eventName, event


	calculateVelocity: ->

		if @_deltas.length < 2
			return {x:0, y:0}

		curr = @_deltas[-1..-1][0]
		prev = @_deltas[-2..-2][0]
		time = curr.t - prev.t

		# Bail out if the last move updates where a while ago
		timeSinceLastMove = (new Date().getTime() - prev.t)

		if timeSinceLastMove > @VelocityTimeOut
			return {x:0, y:0}

		velocity =
			x: (curr.x - prev.x) / time
			y: (curr.y - prev.y) / time

		velocity.x = 0 if velocity.x is Infinity
		velocity.y = 0 if velocity.y is Infinity

		velocity

	_updatePosition: (event) =>

		if @enabled is false
			return

		@emit Events.DragMove, event

		touchEvent = Events.touchEvent event

		delta =
			x: touchEvent.clientX - @_start.x
			y: touchEvent.clientY - @_start.y

		# Correct for current drag speed
		correctedDelta =
			x: delta.x * @speedX
			y: delta.y * @speedY
			t: event.timeStamp

		newX = @_start.x + correctedDelta.x - @_offset.x
		newY = @_start.y + correctedDelta.y - @_offset.y

		if @maxDragFrame

			maxDragFrame = @maxDragFrame
			maxDragFrame = maxDragFrame() if _.isFunction maxDragFrame

			minX = Utils.frameGetMinX(@maxDragFrame)
			maxX = Utils.frameGetMaxX(@maxDragFrame) - @layer.width
			minY = Utils.frameGetMinY(@maxDragFrame)
			maxY = Utils.frameGetMaxY(@maxDragFrame) - @layer.height

			newX = minX if newX < minX
			newX = maxX if newX > maxX
			newY = minY if newY < minY
			newY = maxY if newY > maxY


		# We use the requestAnimationFrame to update the position
		@nextX = newX
		@nextY = newY
		window.requestAnimationFrame @_setLayerPositions

		@_deltas.push correctedDelta

		@emit Events.DragMove, event

	_setLayerPositions: () =>
		@layer.x = @nextX
		@layer.y = @nextY

	_touchStart: (event) =>

		@layer.animateStop()

		@_isDragging = true

		touchEvent = Events.touchEvent event

		@_start =
			x: touchEvent.clientX
			y: touchEvent.clientY

		@_offset =
			x: touchEvent.clientX - @layer.x
			y: touchEvent.clientY - @layer.y

		document.addEventListener Events.TouchMove, @_updatePosition
		document.addEventListener Events.TouchEnd, @_touchEnd

		@emit Events.DragStart, event

	_touchEnd: (event) =>

		@_isDragging = false

		document.removeEventListener Events.TouchMove, @_updatePosition
		document.removeEventListener Events.TouchEnd, @_touchEnd

		@emit Events.DragEnd, event

		@_deltas = []