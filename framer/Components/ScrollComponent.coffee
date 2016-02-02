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

ScrollComponent Events

(all of the draggable events)
ScrollStart -> DragStart
ScrollWillMove -> DragWillMove
ScrollDidMove -> DragDidMove
scroll -> DragMove (html compat)
ScrollEnd -> DragEnd
"""

Events.ScrollStart = "scrollstart"
Events.Scroll = "scroll"
Events.ScrollMove = Events.Scroll
Events.ScrollEnd = "scrollend"
Events.ScrollAnimationDidStart = "scrollanimationdidstart"
Events.ScrollAnimationDidEnd = "scrollanimationdidend"

EventMappers = {}
EventMappers[Events.Move] = Events.Move
EventMappers[Events.ScrollStart] = Events.DragStart
EventMappers[Events.ScrollMove] = Events.DragMove
EventMappers[Events.ScrollEnd] = Events.DragEnd
EventMappers[Events.ScrollAnimationDidStart] = Events.DragAnimationStart
EventMappers[Events.ScrollAnimationDidEnd] = Events.DragAnimationEnd
EventMappers[Events.DirectionLockStart] = Events.DirectionLockStart

class exports.ScrollComponent extends Layer

	# Proxy properties directly from the draggable
	@define "velocity", @proxyProperty "content.draggable.velocity", importable: false
	@define "scrollHorizontal", @proxyProperty("content.draggable.horizontal")
	@define "scrollVertical", @proxyProperty("content.draggable.vertical")
	@define "speedX", @proxyProperty("content.draggable.speedX")
	@define "speedY", @proxyProperty("content.draggable.speedY")
	@define "isDragging", @proxyProperty "content.draggable.isDragging", importable: false
	@define "isMoving", @proxyProperty "content.draggable.isMoving", importable: false
	@define "propagateEvents", @proxyProperty("content.draggable.propagateEvents")
	@define "directionLock", @proxyProperty("content.draggable.directionLock")
	@define "directionLockThreshold", @proxyProperty("content.draggable.directionLockThreshold")

	@define "content",
		importable: false
		exportable: false
		get: -> @_content

	@define "mouseWheelSpeedMultiplier", @simpleProperty("mouseWheelSpeedMultiplier", 1)

	constructor: (options={}) ->

		# options.backgroundColor ?= null
		options.clip ?= true
		options.mouseWheelEnabled ?= false
		options.backgroundColor ?= null

		super options

		@_contentInset = options.contentInset or Utils.rectZero()
		@setContentLayer(new Layer)

		# Because we did not have a content layer before, we want to re-apply 
		# the options again so everything gets configures properly.
		@_applyOptionsAndDefaults(options)
		@_enableMouseWheelHandling()

		if options.hasOwnProperty("wrap")
			wrapComponent(@, options.wrap)

	calculateContentFrame: ->

		# Calculates the size of the content. By default this returns the total
		# size of all the content layers based on width and height. You can override
		# this for example to take scaling into account.

		contentFrame = @content.contentFrame()

		return size = 
			x: 0
			y: 0
			width:  Math.max(@width,  contentFrame.x + contentFrame.width)
			height: Math.max(@height, contentFrame.y + contentFrame.height)


	setContentLayer: (layer) ->

		# Sets the content layer if you happen to want to replace the default one
		# yourself. Sets some sane defaults too.

		@_content.destroy() if @content

		@_content = layer
		@_content.parent = @
		@_content.name = "content"
		@_content.clip = false
		@_content.draggable.enabled = true
		@_content.draggable.momentum = true
		@_content.on("change:children", @updateContent)

		# Update the content view size on resizing the ScrollComponent
		@on("change:width", @updateContent)
		@on("change:height", @updateContent)

		@updateContent()
		@scrollPoint = {x:0, y:0}

		return @_content

	updateContent: =>

		# This function re-calculates the size of the content, updates the content layer
		# size and the dragging constraints based on the content size and contentInset.
		# It defaults to just the direct sub layers of the content, not recursive.

		# This function automatically gets called when you add or remove content layers,
		# but not when you change the size of the content layers. It's totally okay to 
		# call it yourself, but make sure you don't overdo it.

		return unless @content

		contentFrame = @calculateContentFrame()
		contentFrame.x = contentFrame.x + @_contentInset.left
		contentFrame.y = contentFrame.y + @_contentInset.top
		@content.frame = contentFrame

		constraintsFrame = @calculateContentFrame()
		constraintsFrame =
			x: -constraintsFrame.width  + @width - @_contentInset.right
			y: -constraintsFrame.height + @height - @_contentInset.bottom
			width: 	constraintsFrame.width  + constraintsFrame.width  - @width + 
				@_contentInset.left + @_contentInset.right
			height: constraintsFrame.height + constraintsFrame.height - @height + 
				@_contentInset.top + @_contentInset.bottom

		@content.draggable.constraints = constraintsFrame

		# Change the default background color if we added children. We keep the default 
		# color around until you set a content layer so you can see the ScrollComponent 
		# on your screen after creation.
		if @content.children.length
			if @content.backgroundColor?.isEqual(Framer.Defaults.Layer.backgroundColor)
				@content.backgroundColor = null

	@define "scroll",
		exportable: false
		get: -> @scrollHorizontal is true or @scrollVertical is true
		set: (value) ->
			return unless @content
			@content.animateStop() if value is false
			@scrollHorizontal = @scrollVertical = value

	_calculateContentPoint: (scrollPoint) ->
		scrollPoint.x -= @contentInset.left
		scrollPoint.y -= @contentInset.top
		point = @_pointInConstraints(scrollPoint)
		return Utils.pointInvert(point)

	@define "scrollX",
		get: -> 
			return 0 if not @content
			return 0 - @content.x + @contentInset.left
		set: (value) ->
			return unless @content
			@content.draggable.animateStop()
			@content.x = @_calculateContentPoint({x:value, y:0}).x

	@define "scrollY",
		get: -> 
			return 0 if not @content
			return 0 - @content.y + @contentInset.top
		set: (value) -> 
			return unless @content
			@content.draggable.animateStop()
			@content.y = @_calculateContentPoint({x:0, y:value}).y

	@define "scrollPoint",
		importable: true
		exportable: false
		get: -> 
			point =
				x: @scrollX
				y: @scrollY
		set: (point) ->
			return unless @content
			@scrollX = point.x
			@scrollY = point.y

	@define "scrollFrame",
		importable: true
		exportable: false
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
			@_contentInset = Utils.rectZero(Utils.parseRect(contentInset))
			@updateContent()

	@define "direction",
		importable: false
		exportable: false
		get: ->
			direction = @content.draggable.direction
			return "up" if direction is "down"
			return "down" if direction is "up"
			return "left" if direction is "right"
			return "right" if direction is "left"
			return direction

	@define "angle",
		importable: false
		exportable: false
		get: ->
			return 0 unless @content
			return -@content.draggable.angle

	scrollToPoint: (point, animate=true, animationOptions={curve:"spring(500,50,0)"}) ->
		
		# We never let you scroll to a point that does not make sense (out of bounds). If you still
		# would like to do that, access the .content.y directly.
		contentPoint = @_calculateContentPoint(point)
		@content.draggable.animateStop()

		if animate
			point = {}
			point.x = contentPoint.x if contentPoint.hasOwnProperty("x")
			point.y = contentPoint.y if contentPoint.hasOwnProperty("y")
			animationOptions.properties = point
			@content.animateStop()
			@content.animate(animationOptions)
		else
			@content.point = contentPoint

	scrollToTop: (animate=true, animationOptions={curve:"spring(500,50,0)"}) ->
		@scrollToPoint({x:0, y:0}, animate, animationOptions)

	scrollToLayer: (contentLayer, originX=0, originY=0, animate=true, animationOptions={curve:"spring(500,50,0)"}) ->

		if contentLayer and contentLayer.parent isnt @content
			throw Error("This layer is not in the scroll component content")

		if not contentLayer or @content.children.length == 0
			scrollPoint = {x:0, y:0}
		else
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

	_scrollPointForLayer: (layer, originX=0, originY=0, clamp=true) ->
		return Utils.framePointForOrigin(layer, originX, originY)

	_contentLayersSortedByDistanceForScrollPoint: (scrollPoint, originX=0, originY=0) ->
		return Utils.frameSortByAbsoluteDistance(scrollPoint, @content.children, originX, originY)

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
	# Copying

	copy: ->
		copy = super
		contentLayer = _.first(_.without(copy.children, copy.content))
		copy.setContentLayer(contentLayer)
		copy.props = @props
		return copy


	##############################################################
	# Convenience function to make a single layer scrollable

	@wrap = (layer, options) ->
		return wrapComponent(new @(options), layer, options)


wrapComponent = (instance, layer, options = {correct:true}) ->

	if not (layer instanceof Layer)
		throw new Error("ScrollComponent.wrap expects a layer, not #{layer}. Are you sure the layer exists?")

	# This function wraps the given layer into a scroll or page component. This is
	# great for importing from Sketch or Photoshop.

	scroll = instance

	# If we actually forgot to add a sub layer, so for example if
	# there is just one layer and we want to make it scrollable we
	# correct that here.

	if options.correct is true
		if layer.children.length is 0
			wrapper = new Layer
			wrapper.name = "ScrollComponent"
			wrapper.frame = layer.frame
			layer.parent = wrapper
			layer.x = layer.y = 0
			layer = wrapper

			# console.info "Corrected the scroll component without sub layers"
	
	scroll.frame = layer.frame
	scroll.parent = layer.parent
	scroll.index = layer.index
	
	# Copy over the name, if we don't have it try to use the variable
	# name from Framer Studio if it was given.
	if layer.name and layer.name isnt ""
		scroll.name = layer.name
	else if layer.__framerInstanceInfo?.name
		scroll.name = layer.__framerInstanceInfo.name
		
	# If we have an image set, it makes way more sense to add it to the
	# background of the wrapper then the content.
	if layer.image
		scroll.image = layer.image
		layer.image = null
	
	# Set the original layer as the content layer for the scroll
	scroll.setContentLayer(layer)

	# https://github.com/motif/Company/issues/208

	# This could potentially be smart to avoid an unexpected state if
	# you forgot to add a mask in sketch or photoshop and the scroll
	# component size becomes the same as it's content.

	# This only makes sense if your scroll component is on the screen
	# to begin with so we check that first. Because maybe you put it 
	# offscreen to move it onscreen later.

	# You can turn this off by setting correct to false

	if options.correct is true

		screenFrame = scroll.screenFrame

		if screenFrame.x < Screen.width
			if screenFrame.x + screenFrame.width > Screen.width
				scroll.width = Screen.width - screenFrame.x
				# console.info "Corrected the scroll width to #{scroll.width}"

		if screenFrame.y < Screen.height
			if screenFrame.y + screenFrame.height > Screen.height
				scroll.height = Screen.height - screenFrame.y
				# console.info "Corrected the scroll height to #{scroll.height}"

	return scroll
