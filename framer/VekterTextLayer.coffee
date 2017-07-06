{Layer, layerProperty, updateShadow} = require "./Layer"
{LayerStyle} = require "./LayerStyle"

validateFont = (arg) ->
	return _.isString(arg) or _.isObject(arg)

fontFamilyFromObject = (font) ->
	return if _.isObject(font) then font.fontFamily else font

_measureElement = null


getMeasureElement = (constraints={}) ->
	if not _measureElement
		_measureElement = document.createElement("div")
		_measureElement.id = "_measureElement"
		_measureElement.style.position = "fixed"
		_measureElement.style.visibility = "hidden"
		_measureElement.style.top = "-10000px"
		_measureElement.style.left = "-10000px"
		window.document.body.appendChild(_measureElement)

	while _measureElement.hasChildNodes()
		_measureElement.removeChild(_measureElement.lastChild)

	_measureElement.style.width = "10000px"
	if constraints.max
		_measureElement.style.maxWidth = "#{constraints.width}px" if constraints.width
		_measureElement.style.maxHeight = "#{constraints.height}px" if constraints.height
	else
		_measureElement.style.width = "#{constraints.width}px" if constraints.width
		_measureElement.style.height = "#{constraints.height}px" if constraints.height
	return _measureElement

class InlineStyle
	startIndex: 0
	endIndex: 0
	css: {}
	text: ""
	element: null

	constructor: (configuration, text) ->
		if _.isString configuration
			@text = configuration
			@startIndex = 0
			@endIndex = @text.length
			@css = text
		else
			@startIndex = configuration.startIndex
			@endIndex = configuration.endIndex
			@css = configuration.css
			@text = text.substring(@startIndex, @endIndex)

	createElement: ->
		span = document.createElement "span"
		for prop, value of @css
			span.style[prop] = value
		span.textContent = @text
		return span

	setText: (text) ->
		@text = text
		@endIndex = @startIndex + text.length

	resetStyle: (style) ->
		delete @css[style]
		if style is "color"
			delete @css["WebkitTextFillColor"]

	setStyle: (style, value) ->
		@css[style] = value
		@element?.style[style] = value

	getStyle: (style) ->
		return @css[style]

	measure: ->
		rect = @element.getBoundingClientRect()
		size =
			width: rect.right - rect.left
			height: rect.bottom - rect.top
		return size

class StyledTextBlock
	text: ""
	inlineStyles: []
	element: null

	constructor: (configuration) ->
		text = configuration.text
		@text = text
		if configuration.inlineStyles?
			@inlineStyles = configuration.inlineStyles.map((i) -> new InlineStyle(i, text))
		else if configuration.css?
			inlineStyle = new InlineStyle @text, configuration.css
			@inlineStyles = [inlineStyle]
		else
			throw new Error("Should specify inlineStyles or css")

	createElement: ->
		div = document.createElement "div"
		div.style.fontSize = "1px"
		for style in @inlineStyles
			span = style.createElement()
			style.element = span
			div.appendChild span
		return div

	measure: ->
		totalWidth = 0
		for style in @inlineStyles
			totalWidth += style.measure().width
		rect = @element.getBoundingClientRect()
		size =
			width: totalWidth
			height: rect.bottom - rect.top
		return size

	clone: ->
		new Block
			text: ""
			css: _.first(@inlineStyles).css

	setText: (text) ->
		@text = text
		firstStyle = _.first(@inlineStyles)
		firstStyle.setText(text)
		@inlineStyles = [firstStyle]

	setTextOverflow: (textOverflow, maxLines=1) ->
		if textOverflow in ["ellipsis", "clip"]
			@setStyle("overflow", "hidden")

			multiLineOverflow = textOverflow is "ellipsis"
			if multiLineOverflow
				@setStyle("WebkitLineClamp", maxLines)
				@setStyle("WebkitBoxOrient", "vertical")
				@setStyle("display", "-webkit-box")
			else
				@resetStyle("WebkitLineClamp")
				@resetStyle("WebkitBoxOrient")
				@setStyle("display", "block")
				@setStyle("whiteSpace", "nowrap")
				@setStyle("textOverflow", textOverflow)
		else
			@resetStyle("whiteSpace")
			@resetStyle("textOverflow")

			@resetStyle("display")
			@resetStyle("overflow")
			@resetStyle("WebkitLineClamp")
			@resetStyle("WebkitBoxOrient")

	resetStyle: (style) ->
		@inlineStyles.map (inlineStyle) -> inlineStyle.resetStyle(style)

	setStyle: (style, value) ->
		@inlineStyles.map (inlineStyle) -> inlineStyle.setStyle(style, value)

	getStyle: (style) ->
		_.first(@inlineStyles).getStyle(style)

class StyledText
	blocks: []
	element: null
	autoWidth: false
	autoHeight: false
	textOverflow: null

	defaultStyles:
		fontStyle: "normal"
		fontVariantCaps: "normal"
		fontWeight: "normal"
		fontSize: "16px"
		lineHeight: "normal"
		fontFamily: "-apple-system, BlinkMacSystemFont"
		outline: "none"
		whiteSpace: "pre-wrap"
		wordWrap: "break-word"

	constructor: (configuration) ->
		@defaultStyles.textAlign = configuration?.alignment ? "left"
		if configuration?.blocks?
			@blocks = configuration.blocks.map((b) -> new StyledTextBlock(b))
		else
			@blocks = []

	setElement: (element) ->
		@element = element
		for style, value of @defaultStyles
			if not @element.style[style]
				@element.style[style] = value

	render: ->
		return if not @element?

		while @element.hasChildNodes()
			@element.removeChild(@element.lastChild)

		for block in @blocks
			blockDiv = block.createElement()
			block.element = blockDiv
			@element.appendChild blockDiv

	addBlock: (text, css = null) ->
		if css?
			block = new StyledTextBlock
				text: text
				css: css
		else if @blocks.length > 0
			block = _.last(@blocks).clone()
		else
			block = new StyledTextBlock
				text: text
				css: {}

		@blocks.push(block)

	getText: ->
		@blocks.map((b) -> b.text).join("\n")

	setText: (text) ->
		values = text.split("\n")
		@blocks = @blocks.slice(0, values.length)
		for value, index in values
			if @blocks[index]?
				block = @blocks[index]
				block.setText(value)
			else
				@addBlock value

	setTextOverflow: (textOverflow) ->
		@textOverflow = textOverflow

	setStyle: (style, value) ->
		@blocks.map (block) -> block.setStyle(style, value)

	resetStyle: (style) ->
		@blocks.map (block) -> block.resetStyle(style)

	getStyle: (style, block=null) ->
		return (block ? _.first(@blocks))?.getStyle(style) ? @element.style[style]

	measure: (currentSize) ->
		constraints = {}
		constraints.width = currentSize.width * currentSize.multiplier
		constraints.height = currentSize.height * currentSize.multiplier
		m = getMeasureElement(constraints)
		measuredWidth = 0
		measuredHeight = 0
		parent = @element.parentNode
		m.appendChild @element
		for block in @blocks
			size = block.measure()
			measuredWidth = Math.max(measuredWidth, size.width)
			constrainedHeight = if constraints.height? then constraints.height / currentSize.multiplier else null
			if  not @autoWidth and
				@textOverflow? and @textOverflow in ["clip", "ellipsis"] and
				constrainedHeight? and (measuredHeight + size.height) > constrainedHeight
					fontSize = parseFloat(@getStyle("fontSize", block))
					lineHeight = parseFloat(@getStyle("lineHeight", block))
					availableHeight = constrainedHeight - measuredHeight
					if availableHeight > 0
						visibleLines = Math.max(1, Math.floor(availableHeight / (fontSize*lineHeight)))
						block.setTextOverflow(@textOverflow, visibleLines)
					else
						block.setStyle("visibility", "hidden")
					size.height = availableHeight
			else
				block.setTextOverflow(null)
			measuredHeight += size.height

		m.removeChild @element
		parent?.appendChild @element
		result = {} #currentSize
		if @autoWidth
			result.width = Math.ceil(measuredWidth)
		if @autoHeight
			result.height = Math.ceil(measuredHeight)
		return result


textProperty = (obj, name, fallback, validator, transformer, set) ->
	layerProperty(obj, name, name, fallback, validator, transformer, {}, set, "_elementHTML")

class exports.VekterTextLayer extends Layer
	@_textProperties = [
		"text"
		"fontFamily"
		"fontSize"
		"fontWeight"
		"fontStyle"
		"lineHeight"
		"letterSpacing"
		"wordSpacing"
		"textAlign"
		"textTransform"
		"textIndent"
		"textDecoration"
		"textOverflow"
		"whiteSpace"
		"direction"
		"font"
		"borderWidth"
		"padding"
	]

	@_textStyleProperties = _.pull(_.clone(VekterTextLayer._textProperties), "text").concat(["color", "shadowX", "shadowY", "shadowBlur", "shadowColor"])

	constructor: (options={}) ->
		_.defaults options,
			shadowType: "text"
			clip: true
			createHTMLElement: true

		if options.styledText?
			@_styledText = new StyledText(options.styledText)
		else
			_.defaults options,
				backgroundColor: "transparent"
				text: "Hello World"
				color: "#888"
				fontSize: 40
				fontWeight: 400
				lineHeight: 1.25
				padding: 0
			if not options.font? and not options.fontFamily?
				options.fontFamily = @defaultFont()
			@_styledText = new StyledText()
			@_styledText.addBlock options.text

		super options
		@__constructor = true

		# Keeps track if the width or height are explicitly set, so we shouldn't update it afterwards
		if not options.autoSize? and not options.truncate
			if not options.autoWidth?
				@autoWidth = not options.width?
			if not options.autoHeight?
				@autoHeight = not options.height?

		if not options.styledText?
			@font ?= @fontFamily

		@_styledText.setElement(@_elementHTML)

		delete @__constructor

		@renderText()

		# Executing function properties like Align.center again
		for key, value of options
			if _.isFunction(value) and @[key]?
				@[key] = value

		for property in VekterTextLayer._textStyleProperties
			do (property) =>
				@on "change:#{property}", (value) =>
					# make an exception for fontSize, as it needs to be set on the inner style
					if property isnt "fontSize"
						@_styledText.resetStyle(property)
					@renderText()

		@on "change:width", @updateAutoWidth
		@on "change:height", @updateAutoHeight
		@on "change:parent", @renderText

	updateAutoWidth: (value) =>
		return if @disableAutosizeUpdating
		@autoWidth = false

	updateAutoHeight: (value) =>
		return if @disableAutosizeUpdating
		@autoHeight = false

	#Vekter properties
	@define "autoWidth", @proxyProperty("_styledText.autoWidth",
		didSet: (layer, value) ->
			layer.renderText()
		)
	@define "autoHeight", @proxyProperty("_styledText.autoHeight",
		didSet: (layer, value) ->
			layer.renderText()
		)

	@define "autoSize",
		get: -> @autoWidth and @autoHeight
		set: (value) ->
			@autoWidth = value
			@autoHeight = value
			@renderText()

	@define "fontFamily", textProperty(@, "fontFamily", null, _.isString, fontFamilyFromObject, (layer, value) -> layer.font = value)
	@define "fontWeight", textProperty(@, "fontWeight")
	@define "fontStyle", textProperty(@, "fontStyle", "normal", _.isString)
	@define "textDecoration", textProperty(@, "textDecoration", null, _.isString)
	@define "fontSize", textProperty(@, "fontSize", null, _.isNumber, null, (layer, value) ->
		style = LayerStyle["fontSize"](layer)
		layer._styledText.setStyle("fontSize", style)
	)
	@define "textAlign", textProperty(@, "textAlign")
	@define "letterSpacing", textProperty(@, "letterSpacing", null, _.isNumber)
	@define "lineHeight", textProperty(@, "lineHeight", null, _.isNumber)

	#Custom properties
	@define "wordSpacing", textProperty(@, "wordSpacing", null, _.isNumber)
	@define "textTransform", textProperty(@, "textTransform", "none", _.isString)
	@define "textIndent", textProperty(@, "textIndent", null, _.isNumber)

	@define "textOverflow",
		get: -> @_styledText.textOverflow
		set: (value) ->
			@_styledText.setTextOverflow(value)
			@renderText()

	@define "truncate",
		get: -> @textOverflow is "ellipsis"
		set: (truncate) ->
			if truncate
				@autoSize = false
				@textOverflow = "ellipsis"
			else
				@textOverflow = null

	@define "whiteSpace", textProperty(@, "whiteSpace", null, _.isString)
	@define "direction", textProperty(@, "direction", null, _.isString)

	@define "font", layerProperty @, "font", null, null, validateFont, null, {}, (layer, value) ->
		if _.isObject(value)
			layer.fontFamily = value.fontFamily
			layer.fontWeight = value.fontWeight
			return
		# Check if value contains number. We then assume proper use of font.
		# Otherwise, we default to setting the fontFamily.
		if /\d/.test(value)
			layer._elementHTML.style.font = value
		else
			layer.fontFamily = value
	, "_elementHTML"

	@define "textDirection",
		get: -> @direction
		set: (value) -> @direction = value

	@define "text",
		get: -> @_styledText.getText()
		set: (value) ->
			@_styledText.setText(value)
			@renderText()
			@emit("change:text", value)

	@define "padding",
		get: ->
			_.clone(@_padding)

		set: (padding) ->
			if _.isObject(padding)
				padding.left ?= padding.horizontal
				padding.right ?= padding.horizontal
				padding.top ?= padding.vertical
				padding.bottom ?= padding.vertical
			@_padding = Utils.rectZero(Utils.parseRect(padding))

			# Top, Right, Bottom, Left
			@style.padding =
				"#{@_padding.top}px #{@_padding.right}px #{@_padding.bottom}px #{@_padding.left}px"

	renderText: =>
		return if @__constructor
		@_styledText.render()
		@_updateHTMLScale()
		parentWidth = if @parent? then @parent.width else Screen.width
		constrainedWidth = if @autoWidth then parentWidth else @size.width
		constrainedWidth -= (@_padding.left + @_padding.right)
		if @autoHeight
			constrainedHeight = null
		else
			constrainedHeight = @size.height - (@_padding.top + @_padding.bottom)
		constraints =
			width: constrainedWidth
			height: constrainedHeight
			multiplier: @context.pixelMultiplier

		calculatedSize = @_styledText.measure constraints
		@disableAutosizeUpdating = true
		if calculatedSize.width?
			@width = calculatedSize.width + @_padding.left + @_padding.right
		if calculatedSize.height?
			@height = calculatedSize.height + @_padding.top + @_padding.bottom
		@disableAutosizeUpdating = false

	defaultFont: ->
		return Utils.deviceFont(Framer.Device.platform())

	#TODO: replaceText: (search, replace)