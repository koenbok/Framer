{BaseClass} = require "./BaseClass"
{Events} = require "./Events"
{Gestures} = require "./Gestures"

Events.RotateStart = Gestures.RotateStart
Events.RotateEnd = Gestures.RotateEnd
Events.Rotate = Gestures.Rotate

class exports.LayerRotatable extends BaseClass

	@define "enabled", @simpleProperty("enabled", true)

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
		@_rotationStart ?= @layer.rotation
		@_rotationOffset ?= event.rotation
		@layer.rotation = event.rotation - @_rotationOffset + @_rotationStart
		@emit(Events.Rotate, event)

	_rotateEnd: (event) =>
		@emit(Events.RotateEnd, event)