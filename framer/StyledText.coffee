_measureElement = null


getMeasureElement = (constraints={}) ->
	shouldCreateElement = not _measureElement
	if shouldCreateElement
		_measureElement = document.createElement("div")
		_measureElement.id = "_measureElement"
		_measureElement.style.position = "fixed"
		_measureElement.style.visibility = "hidden"
		_measureElement.style.top = "-10000px"
		_measureElement.style.left = "-10000px"

	while _measureElement.hasChildNodes()
		_measureElement.removeChild(_measureElement.lastChild)

	_measureElement.style.width = "10000px"
	if constraints.max
		_measureElement.style.maxWidth = "#{constraints.width}px" if constraints.width
		_measureElement.style.maxHeight = "#{constraints.height}px" if constraints.height
	else
		_measureElement.style.width = "#{constraints.width}px" if constraints.width
		_measureElement.style.height = "#{constraints.height}px" if constraints.height

	# This is a trick to call this function before the document ready event
	if not window.document.body
		document.write(_measureElement.outerHTML)
		_textSizeNode = document.getElementById("_measureElement")
	else
		window.document.body.appendChild(_measureElement)
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

	getOptions: ->
		startIndex: @startIndex
		endIndex: @endIndex
		css: _.clone(@css)

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
		if style is "color"
			return @css["color"] ? @css["WebkitTextFillColor"]
		return @css[style]

	measure: ->
		rect = @element.getBoundingClientRect()
		size =
			width: rect.right - rect.left
			height: rect.bottom - rect.top
		return size

	replaceText: (search, replace) ->
		regex = null
		if _.isString search
			regex = new RegExp(search, 'g')
		else if search instanceof RegExp
			regex = search
		if regex?
			@text = @text.replace(regex, replace)
			@endIndex = @startIndex + @text.length

	validate: ->
		return @startIndex isnt @endIndex and @endIndex is (@startIndex + @text.length)

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

	getOptions: ->
		text: @text
		inlineStyles: @inlineStyles.map((i) -> i.getOptions())

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
		new StyledTextBlock
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

	replaceText: (search, replace) ->
		currentIndex = 0
		for style in @inlineStyles
			style.startIndex = currentIndex
			style.replaceText(search, replace)
			currentIndex = style.endIndex
		newText = @inlineStyles.map((i) -> i.text).join('')
		@text = newText
		return newText isnt @text

	validate: ->
		combinedText = ''
		currentIndex = 0
		for style in @inlineStyles
			return false if not (currentIndex is style.startIndex)
			return false if not style.validate()
			currentIndex = style.endIndex
			combinedText += style.text
		return @text is combinedText

class exports.StyledText
	blocks: null
	textAlign: null
	element: null
	autoWidth: false
	autoHeight: false
	textOverflow: null

	@defaultStyles =
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
		@textAlign = configuration?.alignment ? "left"
		if configuration?.blocks?
			@blocks = configuration.blocks.map((b) -> new StyledTextBlock(b))
		else
			@blocks = []

	getOptions: ->
		blocks: @blocks.map((b) -> b.getOptions())
		alignment: @textAlign

	@isStyledText: (styledText) ->
		return styledText?.blocks? and styledText?.alignment? and _.isArray(styledText.blocks) and _.isString(styledText.alignment)

	setElement: (element) ->
		return if not element?
		@element = element
		for style, value of StyledText.defaultStyles
			if not @element.style[style]
				@element.style[style] = value
		if @textAlign? and not @element.style["textAlign"]
			@element.style["textAlign"] = @textAlign

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
			block.setText(text)
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
		return (block ? _.first(@blocks))?.getStyle(style) ? @element?.style[style]

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
		result = {}
		if @autoWidth
			result.width = Math.ceil(measuredWidth)
		if @autoHeight
			result.height = Math.ceil(measuredHeight)
		return result

	replace: (search, replace) ->
		@blocks.map( (b) -> b.replaceText(search, replace))

	validate: ->
		for block in @blocks
			return false if not block.validate()
		return true
