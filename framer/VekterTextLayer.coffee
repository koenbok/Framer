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

applyStylesToBlock = (block, styles) ->
	styles.map (s) ->
		s.startIndex = 0
		s.endIndex = block.text.length
	block.inlineStyles = styles

class InlineStyle
	startIndex: 0
	endIndex: 0
	css: {}
	text: ""
	element: null

	constructor: (configuration, text) ->
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
		if LayerStyle[style]?
			value = LayerStyle[style]
		value =
		@css[style] = value

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
		@inlineStyles = configuration.inlineStyles.map((i) -> new InlineStyle(i, text))

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

	setText: (text) ->
		@text = text
		firstStyle = _.first(@inlineStyles)
		firstStyle.setText(text)
		@inlineStyles = [firstStyle]

	resetStyle: (style) ->
		@inlineStyles.map (inlineStyle) -> inlineStyle.resetStyle(style)

	setStyle: (style, value) ->
		@inlineStyles.map (inlineStyle) -> inlineStyle.setStyle(style, value)

	getStyle: (style) ->
		_.first(@inlineStyles).getStyle(style)

class StyledText
	blocks: []
	element: null

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
		@defaultStyles.textAlign = configuration.alignment
		@blocks = configuration.blocks.map((b) -> new StyledTextBlock(b))

	setElement: (element) ->
		@element = element
		for style, value of @defaultStyles
			@element.style[style] = value

	render: ->
		return if not @element?

		while @element.hasChildNodes()
			@element.removeChild(@element.lastChild)

		for block in @blocks
			blockDiv = block.createElement()
			block.element = blockDiv
			@element.appendChild blockDiv

	setText: (text) ->
		firstBlock = _.first(@blocks)
		firstBlock.setText(text)
		@blocks = [firstBlock]

	resetStyle: (style) ->
		@blocks.map (block) -> block.resetStyle(style)

	measure: (width) ->
		m = getMeasureElement({width: width})
		measuredWidth = 0
		measuredHeight = 0
		parent = @element.parentNode
		m.appendChild @element
		for block in @blocks
			size = block.measure()
			measuredWidth = Math.max(measuredWidth, size.width)
			measuredHeight += size.height
		m.removeChild @element
		parent?.appendChild @element
		return {width: Math.ceil(measuredWidth), height: Math.ceil(measuredHeight)}

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

	constructor: (options) ->
		_.defaults options,
			shadowType: "text"

		super options

		if options.styledText?
			@_styledText = new StyledText(options.styledText)
		else
			throw new Error("Not setting styled text not supported yet")

		@_createHTMLElementIfNeeded()
		@_styledText.setElement(@_elementHTML)
		@renderText()
		for property in VekterTextLayer._textStyleProperties
			do (property) =>
				@on "change:#{property}", =>
					@_styledText.resetStyle(property)
					@renderText()

	#Vekter properties
	@define "autoSize", layerProperty(@, "autoSize", null, false)

	@define "fontFamily", textProperty(@, "fontFamily", _.isString, fontFamilyFromObject, (layer, value) -> layer.font = value)
	@define "fontWeight", textProperty(@, "fontWeight")
	@define "fontStyle", textProperty(@, "fontStyle", "normal", _.isString)
	@define "textDecoration", textProperty(@, "textDecoration", null, _.isString)
	@define "fontSize", textProperty(@, "fontSize", null, _.isNumber)
	@define "textAlign", textProperty(@, "textAlign")
	@define "letterSpacing", textProperty(@, "letterSpacing", null, _.isNumber)
	@define "lineHeight", textProperty(@, "lineHeight", null, _.isNumber)

	#Custom properties
	@define "wordSpacing", textProperty(@, "wordSpacing", null, _.isNumber)
	@define "textTransform", textProperty(@, "textTransform", "none", _.isString)
	@define "textIndent", textProperty(@, "textIndent", null, _.isNumber)


	@define "whiteSpace", textProperty(@, "whiteSpace", null, _.isString)
	@define "direction", textProperty(@, "direction", null, _.isString)

	@define "font", layerProperty @, "font", null, null, validateFont, null, {}, (layer, value) ->
		print value
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
		get: -> @_styledText.blocks.map((b) -> b.text).join("\n")
		set: (value) ->
			@_styledText.setText(value)
			@renderText()
			@emit("change:text", value)

	renderText: ->
		@_styledText.render()
		@_updateHTMLScale()
		if @autoSize
			@size = @_styledText.measure()