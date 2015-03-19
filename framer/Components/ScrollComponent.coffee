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
		get: -> throw Error("You likely want to use content.draggable")

	@define "content",
		get: -> @_content

	@define "mouseWheelSpeedMultiplier", @simpleProperty("mouseWheelSpeedMultiplier", 1, true, _.isNumber)

	constructor: (options={}) ->
		
		# options.backgroundColor ?= null
		options.clip ?= true
		options.name ?= "ScrollComponent"
		options.mouseWheelEnabled ?= false

		super options

		for k in ["contentInset", "scrollPoint", "scrollX", "scrollY", "scrollFrame", "mouseWheelEnabled"]
			@[k] = options[k] if options.hasOwnProperty(k)

		@_contentInset = Utils.zeroRect()

		@setContentLayer(new Layer)
		
		@_enableMouseWheelHandling()
		# @_enableNativeScrollCapture()

	calculateContentSize: ->
		# Calculates the size of the content. By default this returns the total
		# size of all the content layers based on width and height. You can override
		# this for example to take scaling into account.
		@content.contentFrame()

	setContentLayer: (layer) ->

		@_content.destroy() if @content

		@_content = layer
		@_content.superLayer = @
		@_content.name = "ScrollContent"
		@_content.clip = false
		@_content.backgroundColor = null
		@_content.draggable.enabled = true
		@_content.draggable.momentum = true
		@_content.on("change:subLayers", @_updateContent)

		@_updateContent()
		@scrollPoint = {x:0, y:0}

		return @_content


	_updateContent: (info) =>

		contentFrame = @calculateContentSize()
		contentFrame.x += @_contentInset.left
		contentFrame.y += @_contentInset.top
		@content.frame = contentFrame

		constraintsFrame = @content.contentFrame()
		constraintsFrame =
			x: -constraintsFrame.width  + @width - @_contentInset.right
			y: -constraintsFrame.height + @height - @_contentInset.bottom
			width: 	constraintsFrame.width  + constraintsFrame.width  - @width + @_contentInset.left + @_contentInset.right
			height: constraintsFrame.height + constraintsFrame.height - @height + @_contentInset.top + @_contentInset.bottom
		# constraintsFrame = Utils.frameInset(constraintsFrame, @_contentInset)

		# for layer in @content.subLayers
		# 	layer.off

		# if info?.added
		# 	for layer in info.added
		# 		layer.on("change:width", @_updateContent)
		# 		layer.on("change:height", @_updateContent)
		# if info?.removed
		# 	for layer in info.removed
		# 		layer.off("change:width", @_updateContent)
		# 		layer.off("change:height", @_updateContent)



		@content.draggable.constraints = constraintsFrame

	@define "scroll",
		get: -> @scrollHorizontal is true or @scrollVertical is true
		set: (value) ->
			@content.animateStop() if value is false
			@scrollHorizontal = @scrollVertical = value

	@define "scrollX",
		get: -> -@content.x
		set: (value) -> @content.x = @_pointInConstraints({x:-value, y:0}).x

	@define "scrollY",
		get: -> -@content.y
		set: (value) -> @content.y = @_pointInConstraints({x:0, y:-value}).y 

	@define "scrollPoint",
		get: -> 
			point =
				x: @scrollX
				y: @scrollY
		set: (point) ->
			@content.animateStop()
			@content.point = @_pointInConstraints(point)

	@define "scrollFrame",
		get: ->
			rect = @scrollPoint
			rect.width = @width
			rect.height = @height
			rect

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
			@point = point

	scrollToLayer: (contentLayer, originX=0, originY=0, animate=true, animationOptions={curve:"spring(500,50,0)"}) ->
		
		if contentLayer.superLayer isnt @content
			throw Error("This layer is not in the scroll component")

		@scrollToPoint(@_scrollPointForLayer(contentLayer, originX, originY), animate, animationOptions)

	scrollToClosestLayer: (originX=0, originY=0) ->
		@scrollToLayer(@closestContentLayer(originX, originY), originX, originY)

	closestContentLayer: (originX=0, originY=0) ->
		scrollPoint = Utils.framePointForOrigin(@scrollFrame, originX, originY)
		return @closestContentLayerForScrollPoint(scrollPoint, originX, originY)

	closestContentLayerForScrollPoint: (scrollPoint, originX=0, originY=0) ->
		return _.first(@_contentLayersSortedByDistanceForScrollPoint(scrollPoint, originX, originY))

	_scrollPointForLayer: (layer, originX=0, originY=0, clamp=true) ->
		point = Utils.framePointForOrigin(layer.frame, originX, originY)
		point.x -= originX * @width
		point.y -= originY * @height
		point = @_pointInConstraints(point) if clamp is true
		return point

	_contentLayersSortedByDistanceForScrollPoint: (scrollPoint, originX=0, originY=0) ->
		distance = (layer) =>
			result = Utils.pointDistance(scrollPoint, @_scrollPointForLayer(layer, originX, originY))
			result = Utils.pointAbs(result)
			result = Utils.pointTotal(result)
			result

		return @content.subLayers.sort (a, b) -> distance(a) - distance(b)

	_pointInConstraints: (point) ->

		{minX, maxX, minY, maxY} = @content.draggable.
			_calculateConstraints(@content.draggable.constraints)

		point = 
			x: -Utils.clamp(-point.x, minX, maxX)
			y: -Utils.clamp(-point.y, minY, maxY)

		return point

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

	# ##############################################################
	# # MouseWheel event capturing
	
	# _enableNativeScrollCapture: ->
	# 	@_setupNativeScrollCaptureLayer()
	# 	@on("mousewheel", @_updateNativeScrollCaptureLayer)
	# 	@content.on("change:subLayers", @_updateNativeScrollCaptureLayer)
	# 	@content.draggable.on(Events.DragMove, @_updateNativeScrollCaptureLayerScrollPoint)

	# _disableNativeScrollCapture: ->
	# 	@_nativeScrollCaptureLayer?.destroy()
	# 	@off("mousewheel", @_updateNativeScrollCaptureLayer)
	# 	@content.off("change:subLayers", @_updateNativeScrollCaptureLayer)
	# 	@content.draggable.off(Events.DragMove, @_updateNativeScrollCaptureLayerScrollPoint)
	
	# _setupNativeScrollCaptureLayer: (event) =>
	# 	# Create the capturing scroll layer as an invisible overlay.
	# 	if not @_nativeScrollCaptureLayer
	# 		# TODO: Put in separate context
	# 		@_nativeScrollCaptureLayer = new Layer
	# 			backgroundColor: null
	# 		@_nativeScrollCaptureLayer.content = new Layer
	# 			backgroundColor: null
	# 			superLayer: @_nativeScrollCaptureLayer
	# 		@_nativeScrollCaptureLayer.scroll = true
	# 		@_nativeScrollCaptureLayer.opacity = 0
	# 		@_nativeScrollCaptureLayer.on("mousewheel", @_onMouseWheelCaptureLayer)
	# 		@_nativeScrollCaptureLayer.on("scroll", @_onScrollCaptureLayer)
	# 		@_nativeScrollCaptureLayer.on(Events.TouchStart, @content.draggable._touchStart)

	# 		# TODO: I sincerely don't know what to do here. By layering the capturing scroll view
	# 		# on top of the rest, I don't get any click events below. I can move the scroll view to
	# 		# the back, but then I don't get scroll events.

	# 		# What really I need is to have _nativeScrollCaptureLayer capture only mousewheel and scroll
	# 		# events, but nothing else.
			
	# 	@_updateNativeScrollCaptureLayer()

	# _updateNativeScrollCaptureLayer: (event) =>
	# 	return unless @_nativeScrollCaptureLayer
		
	# 	# Update the capturing scroll layer to match the state of the real scroll component
	# 	# which means the size including scrollbars and the size of the content.
	# 	scrollBarWidth = 16
	# 	@_nativeScrollCaptureLayer.frame = @screenFrame
	# 	@_nativeScrollCaptureLayer.width += scrollBarWidth
	# 	@_nativeScrollCaptureLayer.height += scrollBarWidth
	# 	contentFrame = @content.frame
	# 	contentFrame.width += @_contentInset.right
	# 	contentFrame.height += @_contentInset.bottom
	# 	@_nativeScrollCaptureLayer.content.frame = contentFrame

	# _updateNativeScrollCaptureLayerScrollPoint: =>
	# 	# Handle a scroll event on the actual scroll component, update the capturing layer
	# 	# to have the same scroll position as the real scroll component. Because this triggers
	# 	# a scroll event we need to not listen to then for a moment.
	# 	@_ignoreNextScrollEvent = true
	# 	@_nativeScrollCaptureLayer._element.scrollLeft = Utils.round(-@content.x, 0)
	# 	@_nativeScrollCaptureLayer._element.scrollTop = Utils.round(-@content.y, 0)

	# _onMouseWheelCaptureLayer: (event) =>
	# 	# Handle a mouse wheel event, stop all running momentum/bounce animations
	# 	# and start listening to the scroll wheel events from the user.
	# 	@content.draggable.animateStop()
	# 	@_ignoreNextScrollEvent = false

	# _onScrollCaptureLayer: (event) =>
	# 	# Handle a scroll event on the capturing scroll layer
		
	# 	# We might want to skip this scroll event if it was triggered with code
	# 	# and not an actual scroll action by the user.
	# 	if @_ignoreNextScrollEvent is true
	# 		@_ignoreNextScrollEvent = false
	# 		return

	# 	event.preventDefault()
	# 	@content.animateStop()

	# 	# Update the velocity from the mouse. This won't be great for a real mousewheel, 
	# 	# but fine for a trackpad.
	# 	@content.draggable._eventBuffer.push
	# 		x: @content.x - @_nativeScrollCaptureLayer.scrollX
	# 		y: @content.y - @_nativeScrollCaptureLayer.scrollY
	# 		t: Date.now()

	# 	# Copy over the scroll position from the capture layer to the real scrollview
	# 	@content.x = -@_nativeScrollCaptureLayer.scrollX + @_contentInset.left
	# 	@content.y = -@_nativeScrollCaptureLayer.scrollY + @_contentInset.top

	# 	# Throw the scroll event
	# 	# TODO: Add some data that matches the other scroll events
	# 	@emit(Events.Scroll, event)

	# 	@_ignoreNextScrollEvent = false


	@wrap = (layer) ->
		# This function wraps the given layer into a scroll or page component

		scroll = new @
			backgroundColor: null
		scroll.frame = layer.frame

		layerIndex = layer.index
		scroll.superLayer = layer.superLayer
		scroll.index = layerIndex
		
		# Correct the position for the scroll content

		contentFrame = layer.contentFrame()
		layer.width =  Math.max(layer.contentFrame().width,  layer.width) + contentFrame.x
		layer.height = Math.max(layer.contentFrame().height, layer.height) + contentFrame.y
		layer.x = 0
		layer.y = 0

		scroll.content.addSubLayer(layer)

		return scroll
