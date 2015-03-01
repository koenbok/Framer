{Layer} = require "../Layer"

class exports.ScrollComponent extends Layer

	@define "velocity", @proxyProperty("content.draggable.velocity", true)
	@define "angle", @proxyProperty("content.draggable.angle", true)

	constructor: ->
		super

		@content = new Layer 
			width: @width
			height: @height
			superLayer:@
		@content.draggable.enabled = true
		@content.draggable.momentum = true
		@_updateContent()

		@content.on "change:subLayers", @_updateContent

		@scrollWheelSpeedMultiplier = 0.10

		@on("mousewheel", @_onMouseWheel)

	_updateContent: =>

		contentFrame = @content.contentFrame()
		contentFrame.width  = @width  if contentFrame.width  < @width
		contentFrame.height = @height if contentFrame.height < @height
		@content.frame = contentFrame

		@content.draggable.constraints =
			x: -contentFrame.width  + @width
			y: -contentFrame.height + @height
			width: 	contentFrame.width  + contentFrame.width  - @width
			height: contentFrame.height + contentFrame.height - @height

	_onMouseWheel: (event) =>

		# TODO: Maybe this needs to move to draggable, I'm not sure.
		# In any case this should go through the eventBuffer from draggable
		# so we get sensible velocity and angles back.

		@content.animateStop()
		
		{minX, maxX, minY, maxY} = @content.draggable._calculateConstraints(
			@content.draggable.constraints)
		
		point = 
			x: Utils.clamp(@content.x + (event.wheelDeltaX * @scrollWheelSpeedMultiplier), minX, maxX)
			y: Utils.clamp(@content.y + (event.wheelDeltaY * @scrollWheelSpeedMultiplier), minY, maxY)
		
		@content.draggable.emit(Events.DragWillMove, event)

		@content.point = point

		@content.draggable.emit(Events.DragMove, event)
		@content.draggable.emit(Events.DragDidMove, event)

	@define "scrollPoint",
		get: -> 
			point =
				x: @content.x
				y: @content.y
		set: (point) ->
			@content.animateStop()
			@content.point = point

	@define "scrollRect",
		get: ->
			rect = @point
			rect.width = @width
			rect.height = @height