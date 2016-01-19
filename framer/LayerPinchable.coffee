{BaseClass} = require "./BaseClass"
{Events} = require "./Events"
{Gestures} = require "./Gestures"

Events.PinchStart = Gestures.PinchStart
Events.PinchEnd = Gestures.PinchEnd
Events.Pinch = Gestures.Pinch

class exports.LayerPinchable extends BaseClass

	@define "enabled", @simpleProperty("enabled", true)
	@define "threshold", @simpleProperty("threshold", 64)

	constructor: (@layer) ->
		super
		@layer.gestures.on(Gestures.PinchStart, @_pinch)
		@layer.gestures.on(Gestures.Pinch, @_pinch)
		@layer.gestures.on(Gestures.PinchEnd, @_pinchEnd)

	_pinchStart: (event) =>
		@_scaleStart = null
		@emit(Events.PinchStart, event)
		
	_pinch: (event) =>

		return unless event.pointers.length is 2
		
		pointA =
			x: event.pointers[0].pageX
			y: event.pointers[0].pageY
		pointB =
			x: event.pointers[1].pageX
			y: event.pointers[1].pageY

		return unless Utils.pointTotal(Utils.pointAbs(Utils.pointSubtract(pointA, pointB))) > @threshold

		@_scaleStart ?= @layer.scale
		@layer.scale = event.scale * @_scaleStart
		@emit(Events.Pinch, event)

	_pinchEnd: (event) =>
		@_scaleStart = null
		@emit(Events.PinchEnd, event)