{Layer, layerProperty, updateShadow} = require "./Layer"
{LayerStyle} = require "./LayerStyle"
{Color} = require "./Color"
{Events} = require "./Events"
Utils = require "./Utils"

validateFont = (arg) ->
	return _.isString(arg) or _.isObject(arg)

fontFamilyFromObject = (font) ->
	return if _.isObject(font) then font.fontFamily else font

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

	explicitWidth: false

	constructor: (options={}) ->

		_.defaults options, options.textStyle,
			backgroundColor: "transparent"
			html: "Hello World"
			color: "#888"
			fontSize: 40
			fontWeight: 400
			lineHeight: 1.25
			shadowType: "text"

		if not options.font? and not options.fontFamily?
			options.fontFamily = @defaultFont()

		# Keeps track if the width or height are explicitly set, so we shouldn't update it afterwards
		@explicitWidth = options.width?
		@explicitHeight = options.height?

		super options

		@font ?= @fontFamily
		# Set padding
		@padding = options.padding or Utils.rectZero()

		# Reset width and height
		@autoSize()

		for key, value of options
			if _.isFunction(value) and @[key]?
				@[key] = value

		# Calculate new height on font property changes

		for property in @constructor._textProperties
			@on "change:#{property}", =>
				@autoSize()

		@on "change:size", @autoSize
		@on "change:parent", @autoSize

		@on "change:width", @updateExplicitWidth
		@on "change:height", @updateExplicitHeight

	defaultFont: ->
		return Utils.deviceFont(Framer.Device.platform())

	autoSize: =>
		constraints =
			max: true
		borderOffset = @borderWidth * 2
		parentBorder = (@parent?.borderWidth ? 0) * 2
		if @explicitWidth
			constraints.width = @width
		else
			constraints.width = if @parent? then @parent.width - borderOffset - parentBorder - @padding.left - @padding.right else Screen.width
		style = _.pick @style, @constructor._textProperties
		size = Utils.textSize(@text, style, constraints)
		newWidth = Math.ceil(size.width)
		newHeight = Math.ceil(size.height)
		@disableExplicitUpdating = true
		if not @explicitWidth
			newWidth += borderOffset
			@width = newWidth if @width isnt newWidth
		if not @explicitHeight
			newHeight += borderOffset
			@height = newHeight if @height isnt newHeight
		@disableExplicitUpdating = false
		if @multiLineOverflow
			@style["-webkit-line-clamp"] = @maxVisibleLines()

	updateExplicitWidth: (value) =>
		return if @disableExplicitUpdating
		@explicitWidth = true

	updateExplicitHeight: (value) =>
		return if @disableExplicitUpdating
		@explicitHeight = true

	maxVisibleLines: ->
		Math.ceil(@height / (@fontSize*@lineHeight))

	@define "text",
		get: -> @_element.textContent
		set: (value) ->
			@_element.textContent = value
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

	@define "fontFamily", layerProperty(@, "fontFamily", "fontFamily", null, _.isString, fontFamilyFromObject, {}, (layer, value) -> layer.font = value)
	@define "fontSize", layerProperty(@, "fontSize", "fontSize", null, _.isNumber)
	@define "fontWeight", layerProperty(@, "fontWeight", "fontWeight")
	@define "fontStyle", layerProperty(@, "fontStyle", "fontStyle", "normal", _.isString)
	@define "lineHeight", layerProperty(@, "lineHeight", "lineHeight", null, _.isNumber)
	@define "letterSpacing", layerProperty(@, "letterSpacing", "letterSpacing", null, _.isNumber)
	@define "wordSpacing", layerProperty(@, "wordSpacing", "wordSpacing", null, _.isNumber)
	@define "textAlign", layerProperty(@, "textAlign", "textAlign")
	@define "textTransform", layerProperty(@, "textTransform", "textTransform", "none", _.isString)
	@define "textIndent", layerProperty(@, "textIndent", "textIndent", null, _.isNumber)
	@define "textDecoration", layerProperty(@, "textDecoration", "textDecoration", null, _.isString)
	@define "textOverflow", layerProperty(@, "textOverflow", "textOverflow", null, _.isString, null, {}, (layer, value) ->
		if value in ["ellipsis", "clip"]
			layer.clip = true
			if layer.explicitHeight
				layer.multiLineOverflow = value is "ellipsis"
			else
				layer.whiteSpace = "nowrap"
				layer.multiLineOverflow = false
		else
			layer.whiteSpace = null
			layer.clip = false
			layer.multiLineOverflow = false
	)
	@define "whiteSpace", layerProperty(@, "whiteSpace", "whiteSpace", null, _.isString)
	@define "direction", layerProperty(@, "direction", "direction", null, _.isString)

	@define "multiLineOverflow",
		get: ->
			return @_multiLineOverFlow ? false
		set: (value) ->
			@_multiLineOverFlow = value
			if @_multiLineOverFlow
				@style["-webkit-line-clamp"] = @maxVisibleLines()
				@style["-webkit-box-orient"] = "vertical"
				@style["display"] = "-webkit-box"
			else
				@style["-webkit-line-clamp"] = null
				@style["-webkit-box-orient"] = null
				@style["display"] = "block"

	@define "font", layerProperty @, "font", null, null, validateFont, null, {}, (layer, value) ->
		if _.isObject(value)
			layer.fontFamily = value.fontFamily
			layer.fontWeight = value.fontWeight
			return
		# Check if value contains number. We then assume proper use of font.
		# Otherwise, we default to setting the fontFamily.
		if /\d/.test(value)
			layer.style.font = value
		else
			layer.fontFamily = value

	@define "textStyle",
		get: ->
			_.pick @, TextLayer._textStyleProperties
		set: (values) ->
			for key, prop in _.pick values, TextLayer._textStyleProperties
				@[key] = prop


	@define "textDirection",
		get: -> @direction
		set: (value) -> @direction = value

	@define "truncate",
		get: -> @textOverflow is "ellipsis"
		set: (truncate) -> @textOverflow = if truncate then "ellipsis" else null
