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
		@content.draggable.on Events.DragDidMove, (event) => @emit(Events.Scroll, event)

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
		@on("mousewheel", @_updateNativeScrollCaptureLayer)
		@content.on("change:subLayers", @_updateNativeScrollCaptureLayer)
		@content.draggable.on(Events.DragMove, @_updateNativeScrollCaptureLayerScrollPoint)

	_disableNativeScrollCapture: ->
		@_nativeScrollCaptureLayer?.destroy()
		@off("mousewheel", @_updateNativeScrollCaptureLayer)
		@content.off("change:subLayers", @_updateNativeScrollCaptureLayer)
		@content.draggable.off(Events.DragMove, @_updateNativeScrollCaptureLayerScrollPoint)
	
	_setupNativeScrollCaptureLayer: (event) =>
		# Create the capturing scroll layer as an invisible overlay.
		if not @_nativeScrollCaptureLayer
			# TODO: Put in separate context
			@_nativeScrollCaptureLayer = new Layer
				backgroundColor: null
			@_nativeScrollCaptureLayer.content = new Layer
				backgroundColor: null
				superLayer: @_nativeScrollCaptureLayer
			@_nativeScrollCaptureLayer.scroll = true
			@_nativeScrollCaptureLayer.opacity = 0
			@_nativeScrollCaptureLayer.on("mousewheel", @_onMouseWheelCaptureLayer)
			@_nativeScrollCaptureLayer.on("scroll", @_onScrollCaptureLayer)
			@_nativeScrollCaptureLayer.on(Events.TouchStart, @content.draggable._touchStart)
			
		@_updateNativeScrollCaptureLayer()

	_updateNativeScrollCaptureLayer: (event) =>
		return unless @_nativeScrollCaptureLayer
		
		# Update the capturing scroll layer to match the state of the real scroll component
		# which means the size including scrollbars and the size of the content.
		scrollBarWidth = 16
		@_nativeScrollCaptureLayer.frame = @screenFrame
		@_nativeScrollCaptureLayer.width += scrollBarWidth
		@_nativeScrollCaptureLayer.height += scrollBarWidth
		@_nativeScrollCaptureLayer.content.frame = @content.frame

	_updateNativeScrollCaptureLayerScrollPoint: =>
		# Handle a scroll event on the actual scroll component, update the capturing layer
		# to have the same scroll position as the real scroll component. Because this triggers
		# a scroll event we need to not listen to then for a moment.
		@_ignoreNextScrollEvent = true
		@_nativeScrollCaptureLayer._element.scrollLeft = Utils.round(-@content.x, 0)
		@_nativeScrollCaptureLayer._element.scrollTop = Utils.round(-@content.y, 0)

	_onMouseWheelCaptureLayer: (event) =>
		# Handle a mouse wheel event, stop all running momentum/bounce animations
		# and start listening to the scroll wheel events from the user.
		@content.draggable.animateStop()
		@_ignoreNextScrollEvent = false

	_onScrollCaptureLayer: (event) =>
		# Handle a scroll event on the capturing scroll layer
		
		# We might want to skip this scroll event if it was triggered with code
		# and not an actual scroll action by the user.
		if @_ignoreNextScrollEvent is true
			@_ignoreNextScrollEvent = false
			return

		event.preventDefault()
		@content.animateStop()

		# Update the velocity from the mouse. This won't be great for a real mousewheel, 
		# but fine for a trackpad.
		@content.draggable._eventBuffer.push
			x: @content.x - @_nativeScrollCaptureLayer.scrollX
			y: @content.y - @_nativeScrollCaptureLayer.scrollY
			t: Date.now()

		# Copy over the scroll position from the capture layer to the real scrollview
		@content.x = -@_nativeScrollCaptureLayer.scrollX
		@content.y = -@_nativeScrollCaptureLayer.scrollY

		# Throw the scroll event
		# TODO: Add some data that matches the other scroll events
		@emit(Events.Scroll, event)

		@_ignoreNextScrollEvent = false