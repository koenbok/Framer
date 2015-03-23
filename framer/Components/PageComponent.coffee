{Events} = require "../Events"
{ScrollComponent} = require "./ScrollComponent"

class exports.PageComponent extends ScrollComponent

	@define "originX", @simpleProperty("originX", .5, true)
	@define "originY", @simpleProperty("originY", .5, true)
	@define "velocityMultiplier", @simpleProperty("velocityMultiplier", 60, true)
	@define "animationOptions", @simpleProperty("animationOptions", {curve:"spring(500,50,0)"}, true)

	constructor: ->
		super

		@content.draggable.momentum = false
		@content.draggable.bounce = false

		@on(Events.ScrollEnd, @snapToPage)
		# @_content.on("change:subLayers", @snapToPage)

	# calculateContentSize: ->
	# 	frame = @content.contentFrame()
	# 	frame

	# _updateContent: =>
	# 	super
	# 	@snapToPage(false)

	snapToPage: (animate=true) =>
		velocity = @content.draggable.velocity
		scrollPoint = @scrollPoint
		scrollPoint.x -= velocity.x * @velocityMultiplier
		scrollPoint.y -= velocity.y * @velocityMultiplier
		closestLayer = @closestContentLayerForScrollPoint(scrollPoint, @originX, @originY)
		print "closestLayer", closestLayer
		return unless closestLayer
		@scrollToLayer(closestLayer, @originX, @originY, animate, @animationOptions)