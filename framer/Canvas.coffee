{BaseClass} = require "./BaseClass"
{Events} = require "./Events"

class Canvas extends BaseClass

	@define "width",  get: -> window.innerWidth
	@define "height", get: -> window.innerHeight
	@define "size", get: -> Utils.size(@)
	@define "frame", get: -> Utils.frame(@)

	@define "backgroundColor",
		importable: false
		exportable: false
		get: -> Framer.Device.background.backgroundColor
		set: (value) -> Framer.Device.background.backgroundColor = value

	@define "image",
		importable: false
		exportable: false
		get: -> Framer.Device.background.image
		set: (value) -> Framer.Device.background.image = value

	constructor: (options={}) ->
		super options
		Events.wrap(window).addEventListener("resize", @_handleResize)

	onResize: (cb) -> @on("resize", cb)

	_handleResize: (event) =>
		if not Screen.device?
			Screen.emit("resize")
		@emit("resize")
		@emit("change:width")
		@emit("change:height")
		@emit("change:size")
		@emit("change:frame")

	toInspect: ->
		return "<#{@constructor.name} #{@width}x#{@height}>"

	# Point Conversion

	convertPointToLayer: (point, layer) ->
		return Utils.convertPointFromContext(point, layer, true, true)

	convertPointToScreen: (point) ->
		ctx = Framer.Device.context
		return Utils.convertPointFromContext(point, ctx, true, true)

exports.Canvas = Canvas
