{BaseClass} = require "./BaseClass"

class ScreenClass extends BaseClass

	@define "width",  get: ->
		return @device.screenSize.width if @device
		return Canvas.width
	@define "height", get: ->
		return @device.screenSize.height if @device
		return Canvas.height
	@define "canvasFrame", get: ->
		return @device.context.canvasFrame if @device
		return @frame
	@define "midX", get: -> Utils.frameGetMidX @
	@define "midY", get: -> Utils.frameGetMidY @
	@define "size", get: -> Utils.size(@)
	@define "frame", get: -> Utils.frame(@)
	@define "device", get: -> Framer.CurrentContext.device

	@define "backgroundColor", @proxyProperty("device.screen.backgroundColor")
	@define "perspective", @proxyProperty("device.context.perspective")
	@define "perspectiveOriginX", @proxyProperty("device.context.perspectiveOriginX")
	@define "perspectiveOriginY", @proxyProperty("device.context.perspectiveOriginY")

	toInspect: ->
		return "<Screen #{Utils.roundWhole(@width)}x#{Utils.roundWhole(@height)}>"

	# Point Conversion

	convertPointToLayer: (point, layer) ->
		return Utils.convertPointFromContext(point, layer, false, true)

	convertPointToCanvas: (point) ->
		ctx = Framer.Device.context
		return Utils.convertPointToContext(point, ctx, true, false)

	# Edge Swipe

	onEdgeSwipe:(cb) -> @on(Events.EdgeSwipe, cb)
	onEdgeSwipeStart:(cb) -> @on(Events.EdgeSwipeStart, cb)
	onEdgeSwipeEnd:(cb) -> @on(Events.EdgeSwipeEnd, cb)

	onEdgeSwipeTop:(cb) -> @on(Events.EdgeSwipeTop, cb)
	onEdgeSwipeTopStart:(cb) -> @on(Events.EdgeSwipeTopStart, cb)
	onEdgeSwipeTopEnd:(cb) -> @on(Events.EdgeSwipeTopEnd, cb)

	onEdgeSwipeRight:(cb) -> @on(Events.EdgeSwipeRight, cb)
	onEdgeSwipeRightStart:(cb) -> @on(Events.EdgeSwipeRightStart, cb)
	onEdgeSwipeRightEnd:(cb) -> @on(Events.EdgeSwipeRightEnd, cb)

	onEdgeSwipeBottom:(cb) -> @on(Events.EdgeSwipeBottom, cb)
	onEdgeSwipeBottomStart:(cb) -> @on(Events.EdgeSwipeBottomStart, cb)
	onEdgeSwipeBottomEnd:(cb) -> @on(Events.EdgeSwipeBottomEnd, cb)

	onEdgeSwipeLeft:(cb) -> @on(Events.EdgeSwipeLeft, cb)
	onEdgeSwipeLeftStart:(cb) -> @on(Events.EdgeSwipeLeftStart, cb)
	onEdgeSwipeLeftEnd:(cb) -> @on(Events.EdgeSwipeLeftEnd, cb)

# We use this as a singleton
exports.Screen = new ScreenClass
