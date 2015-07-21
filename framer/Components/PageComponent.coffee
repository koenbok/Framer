{Events} = require "../Events"
{ScrollComponent} = require "./ScrollComponent"

"""
PageComponent

originX <number>
originY <number>

velocityThreshold <number>
animationOptions <animationOptions={}>
currentPage <Layer>
closestPage(<originX:n, originY:n>) <Layer>

nextPage(direction="", currentPage)
snapToNextPage(direction="", animate, animationOptions={})

"""

class exports.PageComponent extends ScrollComponent

	@define "originX", @simpleProperty("originX", .5)
	@define "originY", @simpleProperty("originY", .5)
	@define "velocityThreshold", @simpleProperty("velocityThreshold", 0.1)
	@define "animationOptions", @simpleProperty("animationOptions", {curve:"spring(500,50,0)"})

	constructor: ->
		super

		@content.draggable.momentum = false
		@content.draggable.bounce = false

		@on(Events.ScrollStart, @_scrollStart)
		@on(Events.ScrollEnd, @_scrollEnd)

		@content.on("change:frame", _.debounce(@_scrollMove, 16))
		@content.on("change:subLayers", @_resetHistory)

		@_resetHistory()

	@define "closestPage",  get: -> @closestContentLayerForScrollPoint(@_originScrollPoint(), @originX, @originY)
	@define "currentPage",  get: -> _.last(@_previousPages)
	@define "previousPage", get: -> @_previousPages[@_previousPages.length-2]

	nextPage: (direction="right", currentPage=null) ->

		currentPage ?= @currentPage

		# Figure out the point from where to look for next layers in a direction
		point = {x:0, y:0}
		point = Utils.framePointForOrigin(currentPage, @originX, @originY) if currentPage

		layers = @content.subLayersAbove(point, @originX, @originY) if direction in ["up", "top", "north"]
		layers = @content.subLayersBelow(point, @originX, @originY) if direction in ["down", "bottom", "south"]
		layers = @content.subLayersLeft(point, @originX, @originY) if direction in ["left", "west"]
		layers = @content.subLayersRight(point, @originX, @originY) if direction in ["right", "east"]

		# See if there is one close by that we should go to
		layers = _.without(layers, currentPage)
		layers = Utils.frameSortByAbsoluteDistance(point, layers, @originX, @originY)
		
		return _.first(layers)

	snapToPage: (page, animate=true, animationOptions=null) ->
		@scrollToLayer(page, @originX, @originY, animate, animationOptions)

		if @currentPage isnt page
			@_previousPages.push(page)
			@emit("change:previousPage", @previousPage)
			@emit("change:currentPage", @currentPage)

	snapToNextPage: (direction="right", animate=true, animationOptions=null) ->
		animationOptions ?= @animationOptions
		nextPage  = @nextPage(direction)
		nextPage ?= @closestPage
		@snapToPage(nextPage, animate, animationOptions)

	snapToPreviousPage: ->
		return unless @previousPage
		@snapToPage(@previousPage)

		# Modify the previous page stack so we don"t end up in a loop
		@_previousPages = @_previousPages[0..@_previousPages.length-3]

	addPage: (page, direction="right") ->

		# We only allow adding pages to the right and bottom for now, because it shouldn"t
		# be hard to insert them in the right order, and if we need to manage that for you
		# we"d have to change the position of every content layer so the new page fits.
		# Ergo: too much magic.
		directions = ["down", "bottom", "south"] + ["right", "east"]

		if not direction in directions
			direction = "right"
			throw new Error("#{direction} should be in #{directions}")

		point = {x:0, y:0}

		if @content.subLayers.length
			point.x = Utils.frameGetMaxX(@content.contentFrame()) if direction in ["right", "east"]
			point.y = Utils.frameGetMaxY(@content.contentFrame()) if direction in ["down", "bottom", "south"]

		page.point = point
		
		if page.superLayer isnt @content
			page.superLayer = @content
		else
			@updateContent()

	setContentLayer: (contentLayer) ->
		if @content
			@_onAminateStop()
			@content.off(Events.AnimationStart, @_onAminationStart)
			@content.off(Events.AnimationStop, @_onAminationEnd)
		super contentLayer
		@content.on(Events.AnimationStart, @_onAminationStart)
		@content.on(Events.AnimationStop, @_onAminationEnd)

	horizontalPageIndex: (page) ->
		(_.sortBy(@content.subLayers, (l) -> l.x)).indexOf(page)

	verticalPageIndex: (page) ->
		(_.sortBy(@content.subLayers, (l) -> l.y)).indexOf(page)

	_scrollStart: =>
		@_currentPage = @currentPage

	_scrollMove: =>

		currentPage = @currentPage

		if currentPage not in [_.last(@_previousPages), undefined]
			@_previousPages.push(currentPage)
			@emit("change:currentPage", {old:@previousPage, new:currentPage})

	_onAminationStart: => 
		@_isMoving = true
		@_isAnimating = true
		@content.on("change:frame", @_onAminationStep)
	
	_onAminationStep: =>
		@emit(Events.Move, @content.point)

	_onAminationEnd: =>
		@_isMoving = false
		@_isAnimating = false
		@content.off("change:frame", @_onAminationStep)

	_scrollEnd: =>

		velocity = @content.draggable.velocity

		# See if we meet the minimum velocity to scroll to the next page. If not we snap
		# to the layer closest to the scroll point.

		xDisabled = !@scrollHorizontal and (@direction == "right" or @direction == "left")
		yDisabled = !@scrollVertical and (@direction == "down" or @direction == "up")

		xLock = @content.draggable._directionLockEnabledX and (@direction == "right" or @direction == "left")
		yLock = @content.draggable._directionLockEnabledY and (@direction == "down" or @direction == "up")

		if Math.max(Math.abs(velocity.x), Math.abs(velocity.y)) < @velocityThreshold or xLock or yLock or xDisabled or yDisabled
			# print "velocity"
			@snapToPage(@closestPage, true, @animationOptions)
			return 

		# Figure out which direction we are scrolling to and make a sorted list of
		# layers on that side, sorted by absolute distance so we can pick the first.
		nextPage = @nextPage(@direction, @_currentPage)

		# If not, we scroll to the closest layer that we have available, often the one
		# that we are already at.
		nextPage ?= @closestPage

		# print Math.max(Math.abs(velocity.x), Math.abs(velocity.y))
		# print @direction, nextPage
		
		@snapToPage(nextPage, true, @animationOptions)

	_originScrollPoint: ->
		scrollPoint = @scrollPoint
		scrollPoint.x += @width * @originX
		scrollPoint.y += @height * @originY
		return scrollPoint

	_resetHistory: =>
		@_currentPage = @closestPage
		@_previousPages = [@_currentPage]
