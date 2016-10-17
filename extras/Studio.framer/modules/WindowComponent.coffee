"""
WindowComponent

minWidth 	  <number>
minHeight 	  <number>
toolbarHeight <number>
topConstraint <number>

onResize (window, content<layer>) ->
"""

class DocumentWindowConstants
	@onResize = "onResize"

class exports.WindowComponent extends Layer

	constructor: (options) ->
		super _.defaults options,
			x: Align.center
			y: Align.center
			width: 400
			height: 540
			minWidth: 200
			minHeight: 200
			toolbarHeight: 36
			backgroundColor: null
			shadowY: 10
			shadowBlur: 25
			borderRadius: 5
			shadowColor: "rgba(0,0,0,0.5)"
			topConstraint: 0
		
		@content = new Layer
			name: "content"
			parent: @
			backgroundColor: "white"
			clip: true
		
		@toolbar = new Layer
			name: "toolbar"
			parent: @
			shadowY: 1, shadowColor: "rgba(0,0,0,0.25)"
			style: background: "linear-gradient(#FFF, #DDD)"
		
		@title = new Layer
			height: 36
			name: "title"
			html: @name
			parent: @toolbar
			backgroundColor: null
			color: "black"
			style:
				fontSize: "13px"
				textAlign:"center"
				lineHeight:"36px"
		
		windowButton = (buttonName, buttonColor, xPos) =>
			new Layer
				x: xPos
				y: 12
				size: 12
				borderRadius: 6
				borderWidth: 1
				borderColor: "rgba(0,0,0,0.2)"
				parent: @toolbar
				name: buttonName
				backgroundColor: buttonColor
		@close = windowButton("close", "FF504F", 12)
		@minimize = windowButton("minimize", "FFB900", 32)
		@maximize = windowButton("maximize", "00CD16", 52)
		
		@_makeDraggable()
		@_makeResizable()
		
		@_layout()
		@onChange "borderRadius", @_layout

		@onChange "size", =>
			@_layout()
			@emit(DocumentWindowConstants.onResize, @, @content)
	
	_layout: =>
		@y = Math.max(@topConstraint, @y) if @topConstraint?
		@width = Math.max(@minWidth, @width) if @minWidth?
		@height = Math.max(@minHeight, @height) if @minHeight?
		@toolbar?.style.borderRadius = "#{@borderRadius}px #{@borderRadius}px 0 0"
		@content?.style.borderRadius = "0 0 #{@borderRadius}px #{@borderRadius}px"
		@content?.y = @toolbarHeight
		@content?.width = @width
		@content?.height = @height - @toolbarHeight
		@toolbar?.width = @width
		@toolbar?.height = @toolbarHeight
		@title?.width = @width
		
		margin = 10
		@_resizeLayers?.forEach (l) =>
			offsetY = 0
			offsetY = -margin / 2 if l.resizingIndex < 3
			offsetY = @height - margin / 2 if l.resizingIndex > 5
			offsetX = 0
			offsetX = -margin / 2 if l.resizingIndex % 3 is 0
			offsetX = @width - margin / 2 if (l.resizingIndex - 2) % 3 is 0
			width = margin
			width = @width if (l.resizingIndex - 1) % 3 is 0
			height = margin
			height = @height if Math.floor(l.resizingIndex / 3) is 1
			l.x = offsetX
			l.y = offsetY
			l.width = width
			l.height = height
			l.bringToFront() if l.resizingIndex % 2 is 0
	
	_makeDraggable: =>
		@toolbar.onPanStart (e) =>
			@_state = "auto"
			@_windowStartPoint = @point
			@_panStartPoint = Canvas.convertPointToScreen({x: e.pageX, y: e.pageY})
		@toolbar.onPanEnd =>
			@_state = null
			@pixelAlign()
		@toolbar.onPan (e) =>
			panPoint = Canvas.convertPointToScreen({x: e.pageX, y: e.pageY})
			panOffset = Utils.pointSubtract(@_panStartPoint, panPoint)
			windowPoint = Utils.pointSubtract(@_windowStartPoint, panOffset)
			windowPoint.y = Math.max(windowPoint.y, @topConstraint)
			@point = windowPoint
	
	_makeResizable: =>
		cursors = ["nwse-resize", "ns-resize", "nesw-resize", "ew-resize"]
		@_resizeLayers = []
	
		for resizingIndex in [0...9]
			continue if resizingIndex is 4

			resizeLayer = new Layer
				parent: @
				name: ".resizingHandle"
				backgroundColor: null
			resizeLayer.resizingIndex = resizingIndex
			cursorIndex = resizingIndex
			cursorIndex = 8 - resizingIndex if resizingIndex > 4
			resizeLayer.custom = cursor: cursors[cursorIndex]
			@_resizeLayers.push(resizeLayer)
			
			do (resizeLayer) =>
			
				resizeLayer.onMouseMove (e) =>
					document.body.style.cursor = resizeLayer.custom.cursor unless @_state?
				resizeLayer.onMouseOut (e) =>
					document.body.style.cursor = "auto" unless @_state?
				
				resizeLayer.onPanStart (e) =>
					@_state = resizeLayer.custom.cursor
					document.body.style.cursor = @_state
					@_windowStartPoint = @point
					@_panStartPoint = Canvas.convertPointToScreen({x: e.pageX, y: e.pageY})
					@_windowStartSize = @size
				
				resizeLayer.onPanEnd (e) =>
					@_state = null
					document.body.style.cursor = "auto"
				
				resizeLayer.onPan (e) =>
					panPoint = Canvas.convertPointToScreen({x: e.pageX, y: e.pageY})
					panOffset = Utils.pointSubtract(@_panStartPoint, panPoint)
					
					maxX = @maxX - @minWidth
					maxY = @maxY - @minHeight
					
					left = resizeLayer.resizingIndex % 3 is 0
					right = (resizeLayer.resizingIndex - 2) % 3 is 0
					top = resizeLayer.resizingIndex < 3
					bottom = resizeLayer.resizingIndex > 5
					
					if left
						@x = Math.min(maxX, @_windowStartPoint.x - panOffset.x)
						@width = Math.max(@_windowStartSize.width + panOffset.x, @minWidth)
					if right
						@width = Math.max(@_windowStartSize.width - panOffset.x, @minWidth)
					if top
						maxHeight = @.maxY - @topConstraint
						@y = Math.max(@topConstraint, Math.min(maxY, @_windowStartPoint.y - panOffset.y))
						@height = Math.min(maxHeight ,Math.max(@_windowStartSize.height + panOffset.y, @minHeight))
					if bottom
						@height = Math.max(@_windowStartSize.height - panOffset.y, @minHeight)
	
	@define "toolbarHeight",
		get: -> return @_toolbarHeight
		set: (value) ->
			return unless _.isNumber(value)
			@_toolbarHeight = value
			@_layout()
	
	@define "minWidth",
		get: -> return @_minWidth
		set: (value) ->
			return unless _.isNumber(value)
			@_minWidth = value
			@width = value if @width < value
	
	@define "minHeight",
		get: -> return @_minHeight
		set: (value) ->
			return unless _.isNumber(value)
			@_minHeight = value
			@height = value if @height < value

	@define "topConstraint",
		get: -> return @_topConstraint
		set: (value) ->
			return unless _.isNumber(value)
			@_topConstraint = value
			@_layout()

	##############################################################
	## EVENTS

	onResize: (cb) -> @on(DocumentWindowConstants.onResize, cb)

