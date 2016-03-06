{BaseClass} = require "./BaseClass"

class ScreenClass extends BaseClass

	@define "width",  get: -> Framer.CurrentContext.width
	@define "height", get: -> Framer.CurrentContext.height
	@define "size", get: -> Framer.CurrentContext.size
	@define "frame", get: -> Framer.CurrentContext.frame
	@define "canvasFrame", get: -> Framer.CurrentContext.canvasFrame

	@define "backgroundColor",
		importable: false
		exportable: false
		get: -> Framer.Device.screen.backgroundColor
		set: (value) ->
			Framer.Device.screen.backgroundColor = value

	@define "perspective",
		importable: false
		exportable: false
		get: -> Framer.CurrentContext.perspective
		set: (value) ->
			Framer.CurrentContext.perspective = value

	@define "perspectiveOriginX",
		importable: false
		exportable: false
		get: -> Framer.CurrentContext.perspectiveOriginX
		set: (value) ->
			Framer.CurrentContext.perspectiveOriginX = value

	@define "perspectiveOriginY",
		importable: false
		exportable: false
		get: -> Framer.CurrentContext.perspectiveOriginY
		set: (value) ->
			Framer.CurrentContext.perspectiveOriginY = value

	# Todo: maybe resize based on parent layer

	toInspect: ->

		round = (value) ->
			if parseInt(value) == value
				return parseInt(value)
			return Utils.round(value, 1)

		return "<Screen #{round(@width)}x#{round(@height)}>"

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
