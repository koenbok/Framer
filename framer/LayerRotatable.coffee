{BaseClass} = require "./BaseClass"
{Events} = require "./Events"
{Gestures} = require "./Gestures"

Events.RotateStart = Gestures.RotateStart
Events.RotateEnd = Gestures.RotateEnd
Events.Rotate = Gestures.Rotate

class exports.LayerRotatable extends BaseClass

	@define "enabled", @simpleProperty("enabled", true)
	@define "threshold", @simpleProperty("threshold", 10)

	constructor: (@layer) ->
		super
		@layer.gestures.on(Gestures.RotateStart, @_rotateStart)
		@layer.gestures.on(Gestures.Rotate, @_rotate)
		@layer.gestures.on(Gestures.RotateEnd, @_rotateEnd)

	_rotateStart: (event) =>	
		@_rotationStart = null
		@_rotationOffset = null
		@emit(Events.RotateStart, event)
		
	_rotate: (event) =>

		return unless event.pointers.length is 2
		
		pointA =
			x: event.pointers[0].pageX
			y: event.pointers[0].pageY
		pointB =
			x: event.pointers[1].pageX
			y: event.pointers[1].pageY

		return unless Utils.pointTotal(Utils.pointAbs(Utils.pointSubtract(pointA, pointB))) > @threshold

		@_rotationStart ?= @layer.rotation
		@_rotationOffset ?= event.rotation
		@layer.rotation = event.rotation - @_rotationOffset + @_rotationStart
		@emit(Events.Rotate, event)

	_rotateEnd: (event) =>
		@emit(Events.RotateEnd, event)