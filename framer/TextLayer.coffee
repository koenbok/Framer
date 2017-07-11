{Layer, layerProperty, updateShadow} = require "./Layer"
{LayerStyle} = require "./LayerStyle"
{StyledText} = require "./StyledText"

validateFont = (arg) ->
	return _.isString(arg) or _.isObject(arg)

fontFamilyFromObject = (font) ->
	return if _.isObject(font) then font.fontFamily else font

textProperty = (obj, name, fallback, validator, transformer, set) ->
	layerProperty(obj, name, name, fallback, validator, transformer, {}, set, "_elementHTML")

class exports.TextLayer extends Layer
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

	@_textStyleProperties = _.pull(_.clone(TextLayer._textProperties), "text").concat(["color", "shadowX", "shadowY", "shadowBlur", "shadowColor"])

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
				explicitWidth = options.width? or _.isNumber(options?.size) or options?.size?.width? or options?.frame?.width?
				@autoWidth = not explicitWidth
			if not options.autoHeight?
				explicitHeight = options.height? or _.isNumber(options?.size) or options?.size?.height? or options?.frame?.height?
				@autoHeight = not explicitHeight

		if not options.styledText?
			@font ?= @fontFamily

		@_styledText.setElement(@_elementHTML)

		delete @__constructor

		@renderText()

		# Executing function properties like Align.center again
		for key, value of options
			if _.isFunction(value) and @[key]?
				@[key] = value

		for property in TextLayer._textStyleProperties
			do (property) =>
				@on "change:#{property}", (value) =>
					# make an exception for fontSize, as it needs to be set on the inner style
					if not (property in ["fontSize", "font"])
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

	copySingle: ->
		props = @props
		delete props["width"] if @autoWidth
		delete props["height"] if @autoHeight
		copy = new @constructor(props)
		copy.style = @style
		copy

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
	@define "wordWrap", textProperty(@, "wordWrap", null, _.isString)

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
			layer._styledText.setStyle("font", value)
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
			if @_padding? then _.clone(@_padding) else Utils.rectZero()

		set: (padding) ->
			if _.isObject(padding)
				padding.left ?= padding.horizontal
				padding.right ?= padding.horizontal
				padding.top ?= padding.vertical
				padding.bottom ?= padding.vertical
			@_padding = Utils.rectZero(Utils.parseRect(padding))

			# Top, Right, Bottom, Left
			@style.padding =
				"#{@_padding.top * @context.pixelMultiplier}px #{@_padding.right * @context.pixelMultiplier}px #{@_padding.bottom * @context.pixelMultiplier}px #{@_padding.left * @context.pixelMultiplier}px"

	renderText: =>
		return if @__constructor
		@_styledText.render()
		@_updateHTMLScale()
		parentWidth = if @parent? then @parent.width else Screen.width
		constrainedWidth = if @autoWidth then parentWidth else @size.width
		constrainedWidth -= (@padding.left + @padding.right)
		if @autoHeight
			constrainedHeight = null
		else
			constrainedHeight = @size.height - (@padding.top + @padding.bottom)
		constraints =
			width: constrainedWidth
			height: constrainedHeight
			multiplier: @context.pixelMultiplier

		calculatedSize = @_styledText.measure constraints
		@disableAutosizeUpdating = true
		if calculatedSize.width?
			@width = calculatedSize.width + @padding.left + @padding.right
		if calculatedSize.height?
			@height = calculatedSize.height + @padding.top + @padding.bottom
		@disableAutosizeUpdating = false

	defaultFont: ->
		return Utils.deviceFont(Framer.Device.platform())

	replace: (search, replace) ->
		oldText = @text
		@_styledText.replace(search, replace)
		if @text isnt oldText
			@renderText()
			@emit("change:text", @text)
