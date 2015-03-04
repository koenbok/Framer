{Layer} = require "../Layer"

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


class exports.ScrollComponent extends Layer

	# Proxy properties directly from the draggable
	@define "velocity", @proxyProperty("content.draggable.velocity", true)
	@define "angle", @proxyProperty("content.draggable.angle", true)
	@define "scrollHorizontal", @proxyProperty("content.draggable.horizontal", true)
	@define "scrollVertical", @proxyProperty("content.draggable.vertical", true)
	@define "speedX", @proxyProperty("content.draggable.speedX", true)
	@define "speedY", @proxyProperty("content.draggable.speedY", true)

	constructor: (options) ->
		
		options.backgroundColor ?= null

		super

		@content = new Layer 
			width: @width
			height: @height
			backgroundColor: null
			superLayer:@
		@content.draggable.enabled = true
		@content.draggable.momentum = true
		@_updateContent()

		# @_contentInset = {top:100, right:0, bottom:0, left:0}
		@scrollWheelSpeedMultiplier = .33

		@content.on "change:subLayers", @_updateContent
		@content.draggable.on Events.DragDidMove, (event) -> @emit(Events.Scroll, event)

		@_enableNativeScrollCapture()

	_updateContent: =>

		# TODO: contentInset
		# TODO: contentOffset

		contentFrame = @content.contentFrame()
		contentFrame.width  = @width  if contentFrame.width  < @width
		contentFrame.height = @height if contentFrame.height < @height
		@content.frame = contentFrame

		@content.draggable.constraints =
			x: -contentFrame.width  + @width
			y: -contentFrame.height + @height
			width: 	contentFrame.width  + contentFrame.width  - @width
			height: contentFrame.height + contentFrame.height - @height

	@define "scroll",
		exportable: true
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
		get: -> @_contentInset
		set: (@_contentInset) ->
			@_updateContent()

	scrollToPoint: (point, animate=true, animationOptions={curve:"spring(500,50,0)"}) ->
		
		point = @_pointInConstraints(point)

		if animate
			point.x = -point.x if point.x
			point.y = -point.y if point.y
			animationOptions.properties = point
			@content.animate(animationOptions)
		else
			@point = point

	scrollToLayer: (contentLayer, animate=true, animationOptions={curve:"spring(500,50,0)"}) ->
		
		if contentLayer.superLayer isnt @content
			throw Error("This layer is not in the scroll component")

		# TODO: For now we can only scroll to top left. We should make that better.
		@scrollToPoint(contentLayer.point, animate, animationOptions)

	_pointInConstraints: (point) ->

		{minX, maxX, minY, maxY} = @content.draggable.
			_calculateConstraints(@content.draggable.constraints)

		point = 
			x: -Utils.clamp(-point.x, minX, maxX)
			y: -Utils.clamp(-point.y, minY, maxY)

		return point

	##############################################################
	# MouseWheel event capturing
	
	_enableNativeScrollCapture: ->
		@_setupNativeScrollCaptureLayer()
		@on "mousewheel", @_updateNativeScrollCaptureLayer
		@content.on "change:subLayers", @_updateNativeScrollCaptureLayer

		@content.draggable.on Events.DragMove, @_updateNativeScrollCaptureLayerScrollPoint

	# _disableNativeScrollCapture: ->
	# 	@_nativeScrollCaptureLayer?.destroy()
	# 	@off "mousewheel", @_updateNativeScrollCaptureLayer
	# 	@content.off "change:subLayers", @_updateNativeScrollCaptureLayer
	# 	# @content.off "change:x", @_updateNativeScrollCaptureLayerScrollPoint
	# 	# @content.off "change:y", @_updateNativeScrollCaptureLayerScrollPoint
	
	_setupNativeScrollCaptureLayer: (event) =>
		if not @_nativeScrollCaptureLayer
			# TODO: Put in separate context
			@_nativeScrollCaptureLayer = new Layer
				backgroundColor: null
			@_nativeScrollCaptureLayer.content = new Layer
				backgroundColor: null
				superLayer: @_nativeScrollCaptureLayer
			@_nativeScrollCaptureLayer.scroll = true
			@_nativeScrollCaptureLayer.on "mousewheel", 
				@_onMouseWheelCaptureLayer
			@_nativeScrollCaptureLayer.on "scroll", 
				@_onScrollCaptureLayer
			@_nativeScrollCaptureLayer.on Events.TouchStart,
				@content.draggable._touchStart
			@_nativeScrollCaptureLayer.opacity = 0
		@_updateNativeScrollCaptureLayer()

	_updateNativeScrollCaptureLayer: (event) =>
		return unless @_nativeScrollCaptureLayer
		
		scrollBarWidth = 16
		@_nativeScrollCaptureLayer.frame = @screenFrame
		@_nativeScrollCaptureLayer.width += scrollBarWidth
		@_nativeScrollCaptureLayer.height += scrollBarWidth
		@_nativeScrollCaptureLayer.content.frame = @content.frame

	_updateNativeScrollCaptureLayerScrollPoint: =>
		
		scrollX = Utils.round(-@content.x, 0)
		scrollY = Utils.round(-@content.y, 0)

		@_ignoreNextScrollEvent = true
		@_nativeScrollCaptureLayer._element.scrollLeft = scrollX
		@_nativeScrollCaptureLayer._element.scrollTop = scrollY


	_onMouseWheelCaptureLayer: (event) =>
		@content.draggable.animateStop()
		@_ignoreNextScrollEvent = false

	_onScrollCaptureLayer: (event) =>
		if @_ignoreNextScrollEvent is true
			@_ignoreNextScrollEvent = false
			return

		event.preventDefault()
		@content.animateStop()
		@content.x = -@_nativeScrollCaptureLayer.scrollX
		@content.y = -@_nativeScrollCaptureLayer.scrollY

		@_ignoreNextScrollEvent = false



	# _onMouseWheel: (event) =>

	# 	# TODO: Maybe this needs to move to draggable, I'm not sure.
	# 	# In any case this should go through the eventBuffer from draggable
	# 	# so we get sensible velocity and angles back.

	# 	@content.animateStop()
		
	# 	{minX, maxX, minY, maxY} = @content.draggable._calculateConstraints(
	# 		@content.draggable.constraints)
		
	# 	point = 
	# 		x: @content.x + (event.wheelDeltaX * @scrollWheelSpeedMultiplier * @speedX)
	# 		y: @content.y + (event.wheelDeltaY * @scrollWheelSpeedMultiplier * @speedY)
		
	# 	clampedPoint =
	# 		x: Utils.clamp(point.x, minX, maxX)
	# 		y: Utils.clamp(point.y, minY, maxY)


	# 	# TODO: We need to determine wether this scrollwheel is coming from a mouse
	# 	# or trackpad. There does not seem to be a way to do that. Also, the trackpad
	# 	# emulates it's own physics and you cannot distinguish emulated events from 
	# 	# real finger-generated events.

	# 	# I was thinking to maybe capture scroll events in a separate invisible layer
	# 	# with the same content height and to send them back here. I know that is how
	# 	# Facebook used to do it.

	# 	@content.draggable.emit(Events.DragWillMove, event)
	# 	@content.point = clampedPoint

	# 	event.preventDefault()

	# 	@content.draggable._eventBuffer.push
	# 		x: event.wheelDeltaX
	# 		y: event.wheelDeltaY
	# 		t: Date.now()

	# 	@content.draggable.emit(Events.DragMove, event)
	# 	@content.draggable.emit(Events.DragDidMove, event)