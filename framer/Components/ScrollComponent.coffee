{_} = require "../Underscore"
Utils = require "../Utils"

{Layer} = require "../Layer"
{Events} = require "../Events"


"""
ScrollComponent

content <Layer>
contentSize <{width:n, height:n}>
contentInset <{top:n, right:n, bottom:n, left:n}> TODO
contentOffset <{x:n, y:n}> TODO
scrollFrame <{x:n, y:n, width:n, height:n}>
scrollPoint <{x:n, y:n}>
scrollHorizontal <bool>
scrollVertical <bool>
speedX <number>
speedY <number>
delaysContentTouches <bool> TODO
loadPreset(<"ios"|"android">) TODO
scrollToPoint(<{x:n, y:n}>, animate=true, animationOptions={})
scrollToLayer(contentLayer, originX=0, originY=0)

scrollFrameForContentLayer(<x:n, y:n>) <{x:n, y:n, width:n, height:n}> TODO
closestContentLayer(<x:n, y:n>) <Layer> TODO


ScrollComponent Events TODO

(all of the draggable events)
ScrollStart -> DragStart
ScrollWillMove -> DragWillMove
ScrollDidMove -> DragDidMove
scroll -> DragMove (html compat)
ScrollEnd -> DragEnd
"""

Events.ScrollStart = "scrollstart"
Events.Scroll = "scroll"
Events.ScrollEnd = "scrollend"

EventMappers = {}
EventMappers[Events.ScrollStart] = Events.DragStart
EventMappers[Events.Scroll] = Events.DragMove
EventMappers[Events.ScrollEnd] = Events.DragEnd

class exports.ScrollComponent extends Layer

	# Proxy properties directly from the draggable
	@define "velocity", @proxyProperty("content.draggable.velocity", true)
	@define "angle", @proxyProperty("content.draggable.angle", true)
	@define "scrollHorizontal", @proxyProperty("content.draggable.horizontal", true)
	@define "scrollVertical", @proxyProperty("content.draggable.vertical", true)
	@define "speedX", @proxyProperty("content.draggable.speedX", true)
	@define "speedY", @proxyProperty("content.draggable.speedY", true)
	@define "isDragging", @proxyProperty("content.draggable.isDragging", true)

	# We throw an error here, because you almost never would like the enclosing
	# scroll component to be draggable, but it's an easy mistake to make. If you 
	# do want this, use a LayerDraggable directly.
	@define "draggable",
		excludeFromProps: true
		get: -> throw Error("You likely want to use content.draggable")

	@define "content",
		get: -> @_content

	@define "mouseWheelSpeedMultiplier", @simpleProperty("mouseWheelSpeedMultiplier", 1, true, _.isNumber)

	constructor: (options={}) ->
		
		# options.backgroundColor ?= null
		options.clip ?= true
		options.name ?= @constructor.name
		options.mouseWheelEnabled ?= false
		options.backgroundColor ?= null

		super options

		@_contentInset = Utils.zeroRect()

		@setContentLayer(new Layer)
		
		@_enableMouseWheelHandling()
		# @_enableNativeScrollCapture()

	calculateContentSize: ->
		# Calculates the size of the content. By default this returns the total
		# size of all the content layers based on width and height. You can override
		# this for example to take scaling into account.

		contentFrame = @content.contentFrame()

		return size = 
			width:  Math.max(@width,  contentFrame.x + contentFrame.width)
			height: Math.max(@height, contentFrame.y + contentFrame.height)


	setContentLayer: (layer) ->

		@_content.destroy() if @content

		@_content = layer
		@_content.superLayer = @
		@_content.name = "#{@constructor.name.replace("Component", "")}Content"
		@_content.clip = false
		@_content.draggable.enabled = true
		@_content.draggable.momentum = true
		@_content.on("change:subLayers", @_updateContent)

		# Update the content view size on resizing the ScrollComponent
		@on("change:width", @_updateContent)
		@on("change:height", @_updateContent)

		@_updateContent()
		@scrollPoint = {x:0, y:0}

		return @_content

	_updateContent: =>

		# Update the size of the content layer, and the dragging constraints based on the 
		# content size and contentInset.

		contentFrame = @calculateContentSize()
		contentFrame.x = 0 + @_contentInset.left
		contentFrame.y = 0 + @_contentInset.top
		@content.frame = contentFrame

		constraintsFrame = @calculateContentSize()
		constraintsFrame =
			x: -constraintsFrame.width  + @width - @_contentInset.right
			y: -constraintsFrame.height + @height - @_contentInset.bottom
			width: 	constraintsFrame.width  + constraintsFrame.width  - @width + @_contentInset.left + @_contentInset.right
			height: constraintsFrame.height + constraintsFrame.height - @height + @_contentInset.top + @_contentInset.bottom

		@content.draggable.constraints = constraintsFrame

		# Change the default background color if we added subLayers. We keep the default color around
		# until you set a content layer so you can see the ScrollComponent on your screen after creation.
		if @content.subLayers.length
			if @content.backgroundColor == Framer.Defaults.Layer.backgroundColor
				@content.backgroundColor = null

	@define "scroll",
		get: -> @scrollHorizontal is true or @scrollVertical is true
		set: (value) ->
			@content.animateStop() if value is false
			@scrollHorizontal = @scrollVertical = value

	@define "scrollX",
		get: -> -@content.x
		set: (value) -> @content.x = -@_pointInConstraints({x:value, y:0}).x

	@define "scrollY",
		get: -> -@content.y
		set: (value) -> @content.y = -@_pointInConstraints({x:0, y:value}).y

	@define "scrollPoint",
		get: -> 
			point =
				x: @scrollX
				y: @scrollY
		set: (point) ->
			@content.animateStop()
			@scrollX = point.x
			@scrollY = point.y

	@define "scrollFrame",
		get: ->
			rect = @scrollPoint
			rect.width = @width
			rect.height = @height
			rect
		set: (value) ->
			@scrollPoint = value

	@define "contentInset",
		get: ->
			_.clone(@_contentInset)
		set: (contentInset) ->
			@_contentInset = Utils.zeroRect(Utils.parseRect(contentInset))
			@_updateContent()

	scrollToPoint: (point, animate=true, animationOptions={curve:"spring(500,50,0)"}) ->
		
		point = @_pointInConstraints(point)

		if animate
			_.defer =>
				point.x = -point.x if point.x
				point.y = -point.y if point.y
				animationOptions.properties = point
				@content.animateStop()
				@content.animate(animationOptions)
		else
			@scrollPoint = point

	scrollToLayer: (contentLayer, originX=0, originY=0, animate=true, animationOptions={curve:"spring(500,50,0)"}) ->
		
		if contentLayer.superLayer isnt @content
			throw Error("This layer is not in the scroll component")

		scrollPoint = @_scrollPointForLayer(contentLayer, originX, originY)
		scrollPoint.x -= @width * originX
		scrollPoint.y -= @height * originY

		@scrollToPoint(scrollPoint, animate, animationOptions)

		return contentLayer

	scrollToClosestLayer: (originX=0, originY=0, animate=true, animationOptions={curve:"spring(500,50,0)"}) ->
		closestLayer = @closestContentLayer(originX, originY, animate, animationOptions)
		if closestLayer
			@scrollToLayer(closestLayer, originX, originY)
			return closestLayer
		else
			@scrollToPoint({x:0, y:0}) unless closestLayer
			return null

	closestContentLayer: (originX=0, originY=0) ->
		scrollPoint = Utils.framePointForOrigin(@scrollFrame, originX, originY)
		return @closestContentLayerForScrollPoint(scrollPoint, originX, originY)

	closestContentLayerForScrollPoint: (scrollPoint, originX=0, originY=0) ->
		return _.first(@_contentLayersSortedByDistanceForScrollPoint(scrollPoint, originX, originY))

	contentLayersAbove: (point) -> _.filter @content.subLayers, (l) => 
			Utils.framePointForOrigin(l.frame, @originX, @originY).y > point.y

	contentLayersBelow: (point) -> _.filter @content.subLayers, (l) => 
			Utils.framePointForOrigin(l.frame, @originX, @originY).y < point.y

	contentLayersLeft: (point) -> _.filter @content.subLayers, (l) => 
			Utils.framePointForOrigin(l.frame, @originX, @originY).x < point.x

	contentLayersRight: (point) -> _.filter @content.subLayers, (l) => 
			Utils.framePointForOrigin(l.frame, @originX, @originY).x > point.x

	_scrollPointForLayer: (layer, originX=0, originY=0, clamp=true) ->
		return Utils.framePointForOrigin(layer, originX, originY)
		# point = layer.point
		# point.x += layer.width * originX
		# point.y += layer.height * originY
		# return point

	_contentLayersSortedByDistanceForScrollPoint: (scrollPoint, originX=0, originY=0) ->
		return Utils.frameSortByAbsoluteDistance(scrollPoint, @content.subLayers, originX, originY)

	_pointInConstraints: (point) ->

		{minX, maxX, minY, maxY} = @content.draggable.
			_calculateConstraints(@content.draggable.constraints)

		point = 
			x: -Utils.clamp(-point.x, minX, maxX)
			y: -Utils.clamp(-point.y, minY, maxY)

		return point

	##############################################################
	# Map scroll events to content.draggable

	addListener: (eventNames..., listener) ->
		super
		for eventName in eventNames
			@content.on(EventMappers[eventName], listener) if eventName in _.keys(EventMappers)

	removeListener: (eventNames..., listener) ->
		super
		for eventName in eventNames
			@content.off(EventMappers[eventName], listener) if eventName in _.keys(EventMappers)
	
	on: @::addListener
	off: @::removeListener

	##############################################################
	# MouseWheel handling

	@define "mouseWheelEnabled",
		get: -> @_mouseWheelEnabled
		set: (value) ->
			@_mouseWheelEnabled = value
			@_enableMouseWheelHandling(value)

	_enableMouseWheelHandling: (enable) ->
		if enable
			@on(Events.MouseWheel, @_onMouseWheel)
		else
			@off(Events.MouseWheel, @_onMouseWheel)

	_onMouseWheel: (event) =>

		if not @_mouseWheelScrolling
			@_mouseWheelScrolling = true
			@emit(Events.ScrollStart, event)

		@content.animateStop()
		
		{minX, maxX, minY, maxY} = @content.draggable._calculateConstraints(
			@content.draggable.constraints)
		
		point = 
			x: Utils.clamp(@content.x + (event.wheelDeltaX * @mouseWheelSpeedMultiplier), minX, maxX)
			y: Utils.clamp(@content.y + (event.wheelDeltaY * @mouseWheelSpeedMultiplier), minY, maxY)
		
		@content.point = point

		@emit(Events.Scroll, event)
		@_onMouseWheelEnd(event)

	# Because there is no real scroll end event on a mousewheel, we use a timeout to see if
	# events stop coming in, and throw a scroll event after. Better than nothing.
	_onMouseWheelEnd: Utils.debounce 0.3, (event) ->
		@emit(Events.ScrollEnd, event)
		@_mouseWheelScrolling = false


	##############################################################
	# Convenience function to make a single layer scrollable

	@wrap = (layer) ->
		# This function wraps the given layer into a scroll or page component

		scroll = new @

		# If no superlayer was set, we are going to assume the scrollview will be 
		# as big as the screen, and that you will correct it yourself afterwards.
		if not layer.superLayer
			scroll.width = Screen.width - scroll.x
			scroll.height = Screen.height - scroll.y
		else
			scroll.size = layer.superLayer.size

		layerIndex = layer.index
		scroll.superLayer = layer.superLayer
		scroll.index = layerIndex

		layer.superLayer = scroll.content

		return scroll
