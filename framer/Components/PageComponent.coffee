{Events} = require "../Events"
{ScrollComponent} = require "./ScrollComponent"

"""
PageComponent

originX <number>
originY <number>

velocityThreshold <number>
animationOptions <animationOptions={}>
currentPage <Layer>
closestLayer(<originX:n, originY:n>) <Layer>

nextPage(direction="", currentPage)
snapToNextPage(direction="", animate, animationOptions={})

"""

class exports.PageComponent extends ScrollComponent

	@define "originX", @simpleProperty("originX", .5, true)
	@define "originY", @simpleProperty("originY", .5, true)
	@define "velocityThreshold", @simpleProperty("velocityThreshold", 0.1, true)
	@define "animationOptions", @simpleProperty("animationOptions", {curve:"spring(500,50,0)"}, true)
	@define "currentPage", 
		importable: false
		exportable: false
		get: -> @closestLayer()

	constructor: ->
		super

		@content.draggable.momentum = false
		@content.draggable.bounce = false

		@on(Events.ScrollStart, @_scrollStart)
		@on(Events.ScrollEnd, @_scrollEnd)


		@content.on("change:frame", _.debounce(@_scrollMove, 1))
		@_content.on "change:subLayers", => 
			@_currentLayer = @closestLayer()

		@_currentLayer = null

	closestLayer: ->
		@closestContentLayerForScrollPoint(@_originScrollPoint(), @originX, @originY)

	nextPage: (direction="right", currentPage=null) ->

		currentPage ?= @currentPage

		# Figure out the point from where to look for next layers in a direction
		if currentPage
			point = Utils.framePointForOrigin(currentPage, @originX, @originY)
		else
			point = {x:0, y:0}

		layers = @contentLayersAbove(point) if direction is "up"
		layers = @contentLayersRight(point) if direction is "right"
		layers = @contentLayersBottom(point) if direction is "bottom"
		layers = @contentLayersLeft(point) if direction is "left"

		# See if there is one close by that we should go to
		layers = _.without(layers, currentPage)
		layers = Utils.frameSortByAbsoluteDistance(point, layers, @originX, @originY)
		
		return _.first(layers)

	snapToNextPage: (direction="right", animate=true, animationOptions=null) ->
		animationOptions ?= @animationOptions
		nextPage = @nextPage(direction)

		if not nextPage
			@scrollToClosestLayer(@originX, @originY, true, animationOptions)
		else
			@scrollToLayer(nextPage, @originX, @originY, true, animationOptions)

	_scrollStart: =>
		@_currentPage = @currentPage

	_scrollMove: =>

		currentPage = @currentPage

		if @_lastCurrentPage not in [currentPage, null]
			@emit("change:currentPage", {old:@_lastCurrentPage, new:currentPage})

		@_lastCurrentPage = currentPage

	_scrollEnd: =>

		if not @content.draggable.isDragging
			return

		velocity = @content.draggable.velocity

		# See if we meet the minimum velocity to scroll to the next page. If not we snap
		# to the layer closest to the scroll point.
		if Math.max(Math.abs(velocity.x), Math.abs(velocity.y)) < @velocityThreshold
			@scrollToClosestLayer(@originX, @originY, true, @animationOptions)

		# Figure out which direction we are scrolling to and make a sorted list of
		# layers on that side, sorted by absolute distance so we can pick the first.
		layer = @nextPage(@content.draggable.direction, @_currentPage)

		# If not, we scroll to the closest layer that we have available, often the one
		# that we are already at.
		if not layer
			@scrollToClosestLayer(@originX, @originY, true, @animationOptions)
		else
			@scrollToLayer(layer, @originX, @originY, true, @animationOptions)

	# _updateCurrentPage: (currentPage): ->
	# 	@emit("change:currentPage", {old:@_currentLayer, new:currentPage})
	# 	@_currentLayer = currentPage

	_originScrollPoint: ->
		scrollPoint = @scrollPoint
		scrollPoint.x += @width * @originX
		scrollPoint.y += @height * @originY
		return scrollPoint
