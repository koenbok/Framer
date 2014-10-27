class LayerDraggable extends Framer.BaseClass

	constructor: (@layer) ->

		@_deltas = []
		@_isDragging = false

		@_start = null
		@_offset = null
		@_delta = null
		@_cursorOffset = null

		@enabled = true
		@speedX = 1.0
		@speedY = 1.0
		
		# @maxDragFrame = null

		@_attach()


	update: (event, point) ->
		@layer.x = point.x
		@layer.y = point.y

	_attach: -> @layer.on  Events.TouchStart, @_touchStart
	_remove: -> @layer.off Events.TouchStart, @_touchStart

	_updatePosition: (event) =>

		if @enabled is false
			return

		touchEvent = Events.touchEvent(event)

		offset =
			x: touchEvent.clientX - @_start.x
			y: touchEvent.clientY - @_start.y

		delta =
			x: offset.x - @_offset.x
			y: offset.y - @_offset.y
			t: event.timeStamp

		@_offset =
			x: @_offset.x + delta.x
			y: @_offset.y + delta.y

		# Correct the next point with the drag speed and screen scale
		delta.x = delta.x * @speedX * (1 / @layer.screenScaleX())
		delta.y = delta.y * @speedY * (1 / @layer.screenScaleY())

		@_deltas.push(delta)
		@_delta = delta

		# point = 
		# 	x: parseInt(layer.x + delta.x)
		# 	y: parseInt(layer.y + delta.y)

		print @_offset.x, @speedX, @_offset.x * @speedX

		point =
			x: parseInt(@_start.x - @_cursorOffset.x + (@_offset.x * @speedX))
			y: parseInt(@_start.y - @_cursorOffset.y + (@_offset.y * @speedY))

		# Add some extras to the event we're about to emit
		event.offset = @_offset
		event.delta = @_delta

		@emit(Events.DragWillMove, event)
		@update(event, point)
		@emit(Events.DragMove, event)
		@emit(Events.DragDidMove, event)

	_touchStart: (event) =>

		# Beacuse the dragging is going to update the x and y, we look if there
		# are any animations running on those properties and stop them.
		for propertyName, animation of @layer.animatingProperties()
			animation.stop() if k in ["x", "y"]

		@_isDragging = true

		touchEvent = Events.touchEvent(event)

		@_start =
			x: touchEvent.clientX
			y: touchEvent.clientY

		@_cursorOffset =
			x: touchEvent.clientX - @layer.x
			y: touchEvent.clientY - @layer.y

		@_offset = x:0, y:0
		@_delta  = x:0, y:0

		document.addEventListener(Events.TouchMove, @_updatePosition)
		document.addEventListener(Events.TouchEnd, @_touchEnd)

		@emit(Events.DragStart, event)

	_touchEnd: (event) =>

		@_isDragging = false

		document.removeEventListener(Events.TouchMove, @_updatePosition)
		document.removeEventListener(Events.TouchEnd, @_touchEnd)

		@emit Events.DragEnd, event

		@_deltas = []

	velocity: (time=0.1) ->

		if @_deltas.length < 1
			return {x:0, y:0}

		index = @_deltas.length
		distance = x:0, y:0

		while index >= 0
			index--
			delta = @_deltas[index]
			distance.x += Math.abs(delta.x)
			distance.y += Math.abs(delta.y)
			
			if (Date.now() - delta.t) > (time * 1000)
				break

		timeDelta = (Date.now() - delta.t) / 1000

		velocity =
			x: distance.x / timeDelta
			y: distance.y / timeDelta

		velocity.x = 0 if velocity.x is Infinity
		velocity.y = 0 if velocity.y is Infinity

		velocity

	emit: (eventName, event) ->
		# We override this to get all events both on the draggable
		# and the encapsulated layer.
		@layer.emit eventName, event

		super eventName, event



layer = new Layer

layer.d = new LayerDraggable(layer)



layer.on Events.DragMove, ->


	layer.d.speedX = Utils.round(Utils.modulate(layer.d._offset.x, [0, 1000], [1, 0], true), 3)
	# print "layer.x", layer.x, layer.d.speedX

	v = layer.d.velocity()
	Utils.labelLayer layer, "#{Utils.round(v.x, 0)} #{Utils.round(v.y, 0)}"