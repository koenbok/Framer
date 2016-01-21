Utils = require "./Utils"

{BaseClass} = require "./BaseClass"
{Events} = require "./Events"
{Gestures} = require "./Gestures"

Events.PinchStart = "pinchstart"
Events.Pinch = "pinch"
Events.PinchEnd = "pinchend"
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
	@define "rotateMin", @simpleProperty("rotateMin", 0)
	@define "rotateMax", @simpleProperty("rotateMax", 0)
	@define "rotateFactor", @simpleProperty("rotateFactor", 1)

	constructor: (@layer) ->
		super

		@_attach()

	_attach: ->
		@layer.on(Gestures.PinchStart, @_pinchStart)
		@layer.on(Gestures.Pinch, @_pinch)
		@layer.on(Gestures.PinchEnd, @_pinchEnd)

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
			scale = Utils.clamp(scale, @scaleMin, @scaleMax) if (@scaleMin and @scaleMax)
			scale = Utils.nearestIncrement(scale, @scaleIncrements) if @scaleIncrements
			@layer.scale = scale
			@emit(Events.Scale, event)

		if @rotate
			@_rotationStart ?= @layer.rotation
			@_rotationOffset ?= event.rotation
			rotation = event.rotation - @_rotationOffset + @_rotationStart
			rotation = rotation * @rotateFactor
			rotation = Utils.clamp(rotation, @rotateMin, @rotateMax) if (@rotateMin and @rotateMax)
			rotation = Utils.nearestIncrement(rotation, @rotateIncrements) if @rotateIncrements
			@layer.rotation = rotation
			@emit(Events.Rotate, event)

		@emit(Events.Pinch, event)

	_pinchEnd: (event) =>
		@_reset()
		@emit(Events.PinchEnd, event)
		@emit(Events.ScaleEnd, event) if @scale
		@emit(Events.RotateEnd, event) if @rotate

	emit: (eventName, event) ->
		@layer.emit(eventName, event, @)
		super eventName, event, @

	onPinchStart: (cb) -> @on(Events.PinchStart, cb)
	onPinch: (cb) -> @on(Events.Pinch, cb)
	onPinchEnd: (cb) -> @on(Events.PinchEnd, cb)
	onRotateStart: (cb) -> @on(Events.RotateStart, cb)
	onRotate: (cb) -> @on(Events.Rotate, cb)
	onRotateEnd: (cb) -> @on(Events.RotateEnd, cb)
	onScaleStart: (cb) -> @on(Events.ScaleStart, cb)
	onScale: (cb) -> @on(Events.Scale, cb)
	onScaleEnd: (cb) -> @on(Events.ScaleEnd, cb)
