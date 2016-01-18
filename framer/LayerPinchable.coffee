{BaseClass} = require "./BaseClass"
{Events} = require "./Events"
{Gestures} = require "./Gestures"

Events.PinchStart = Gestures.PinchStart
Events.PinchEnd = Gestures.PinchEnd
Events.Pinch = Gestures.Pinch

class exports.LayerPinchable extends BaseClass

	@define "enabled", @simpleProperty("enabled", true)

	constructor: (@layer) ->
		super
		@layer.gestures.on(Gestures.PinchStart, @_pinch)
		@layer.gestures.on(Gestures.Pinch, @_pinch)
		@layer.gestures.on(Gestures.PinchEnd, @_pinchEnd)

	_pinchStart: (event) =>	
		@_scaleStart = null
		@emit(Events.PinchStart, event)
		
	_pinch: (event) =>
		@_scaleStart ?= @layer.scale
		@layer.scale = event.scale * @_scaleStart
		@emit(Events.Pinch, event)

	_pinchEnd: (event) =>
		@emit(Events.PinchEnd, event)