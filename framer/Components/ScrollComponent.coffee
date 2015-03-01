{Layer} = require "../Layer"

class exports.ScrollComponent extends Layer

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

		@on "mousewheel", @_onMouseWheel

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

		@content.animateStop()
		
		{minX, maxX, minY, maxY} = @content.draggable._calculateConstraints(
			@content.draggable.constraints)
		
		point = 
			x: Utils.clamp(@content.x + (event.wheelDeltaX * @scrollWheelSpeedMultiplier), minX, maxX)
			y: Utils.clamp(@content.y + (event.wheelDeltaY * @scrollWheelSpeedMultiplier), minY, maxY)
		
		@content.point = point

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