Utils = require "./Utils"

{BaseClass} = require "./BaseClass"
{Events} = require "./Events"
{Gestures} = require "./Gestures"

Events.PinchStart = "pinchstart"
Events.PinchEnd = "pinchstart"
Events.Pinch = "pinchstart"
Events.RotateStart = "rotatestart"
Events.Rotate = "rotate"
Events.RotateEnd = "rotateend"
Events.ScaleStart = "scalestart"
Events.Scale = "scale"
Events.ScaleEnd = "scaleend"

class exports.LayerPinchable extends BaseClass

	@define "enabled", @simpleProperty("enabled", true)
	@define "threshold", @simpleProperty("threshold", 64)
	@define "setOrigin", @simpleProperty("setOrigin", true)

	@define "scale", @simpleProperty("scale", true)
	@define "scaleIncrements", @simpleProperty("scaleIncrements", 0)
	@define "scaleMin", @simpleProperty("scaleMin", 0)
	@define "scaleMax", @simpleProperty("scaleMax", Number.MAX_VALUE)
	@define "scaleFactor", @simpleProperty("scaleFactor", 1)

	@define "rotate", @simpleProperty("rotate", true)
	@define "rotateIncrements", @simpleProperty("rotateIncrements", 0)
	@define "rotateMin", @simpleProperty("rotateMin", Number.MIN_VALUE)
	@define "rotateMax", @simpleProperty("rotateMax", Number.MAX_VALUE)
	@define "rotateFactor", @simpleProperty("rotateFactor", 1)

	constructor: (@layer) ->
		super
		@layer.gestures.on(Gestures.PinchStart, @_pinch)
		@layer.gestures.on(Gestures.Pinch, @_pinch)
		@layer.gestures.on(Gestures.PinchEnd, @_pinchEnd)

	_reset: ->
		@_scaleStart = null
		@_rotationStart = null
		@_rotationOffset = null

	_pinchStart: (event) =>
		@_reset()
		@emit(Events.PinchStart, event)
		@emit(Events.ScaleStart, event) if @scale
		@emit(Events.RotateStart, event) if @rotate
		
	_pinch: (event) =>

		return unless event.pointers.length is 2
		return unless @enabled
		
		pointA =
			x: event.pointers[0].pageX
			y: event.pointers[0].pageY

		pointB =
			x: event.pointers[1].pageX
			y: event.pointers[1].pageY

		return unless Utils.pointTotal(Utils.pointAbs(Utils.pointSubtract(pointA, pointB))) > @threshold

		# TODO
		# if @setOrigin

		if @scale
			@_scaleStart ?= @layer.scale
			scale = event.scale * @_scaleStart
			scale = scale * @scaleFactor
			scale = Utils.clamp(scale, @scaleMin, @scaleMax)
			scale = Utils.nearestIncrement(scale, @scaleIncrements)
			@layer.scale = scale
			@emit(Events.Scale, event)

		if @rotate
			@_rotationStart ?= @layer.rotation
			@_rotationOffset ?= event.rotation
			rotation = event.rotation - @_rotationOffset + @_rotationStart
			rotation = rotation * @rotateFactor
			rotation = Utils.clamp(rotation, @rotateMin, @rotateMax)
			rotation = Utils.nearestIncrement(rotation, @rotateIncrements)
			@layer.rotation = rotation
			@emit(Events.Rotate, event)

	_pinchEnd: (event) =>
		@_reset()
		@emit(Events.PinchEnd, event)
		@emit(Events.ScaleEnd, event) if @scale
		@emit(Events.RotateEnd, event) if @rotate


	##############################################################
	# Event Handling

	emit: (eventName, event) ->

		# TODO: Add new event properties like position corrected for device

		# Pass this to the layer above
		@layer.emit(eventName, event, @)

		super eventName, event, @