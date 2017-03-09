{Layer, layerProperty} = require "./Layer"
{LayerStyle} = require "./LayerStyle"
{Color} = require "./Color"
{Events} = require "./Events"
Utils = require "./Utils"

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
			html: "Add text"
			color: "#888"
			fontSize: 40
			fontWeight: 400
			lineHeight: 1.25

		super options

		# Set padding
		@padding = options.padding or Utils.rectZero()

		# Keeps track if the width or height are explicitly set, so we shouldn't update it afterwards
		@explicitWidth = options.width?
		@explicitHeight = options.height?

		# Reset width and height
		@autoSize()

		# Calculate new height on font property changes

		for property in @constructor._textProperties
			@on "change:#{property}", =>
				@autoSize()

		@on "change:size", @autoSize
		@on "change:parent", @autoSize

		@on "change:width", @updateExplicitWidth
		@on "change:height", @updateExplicitHeight

	@defaultFont: ->
		# Android Device: Roboto
		if Utils.isAndroid()
			return "Roboto, Helvetica Neue"
		# Edge Device: Segoe UI
		if Utils.isEdge()
			return "Segoe UI, Helvetica Neue"
		# General default: macOS, SF UI
		return "-apple-system, SF UI Text, Helvetica Neue"

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


	updateExplicitWidth: (value) =>
		return if @enableExplicitUpdating
		@explicitWidth = true

	updateExplicitHeight: (value) =>
		return if @disableExplicitUpdating
		@explicitHeight = true

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

	@define "fontFamily", layerProperty(@, "fontFamily", "fontFamily", @defaultFont(), _.isString, null, {}, (layer, value) -> layer.font = value)
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
	@define "direction", layerProperty(@, "direction", "direction", null, _.isString)

	@define "font", layerProperty @, "font", null, null, _.isString, null, {}, (layer, value) ->
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

	# Map shadow properties to text shadow
	@define "shadowX", layerProperty(@, "shadowX", "textShadow", 0, _.isNumber)
	@define "shadowY", layerProperty(@, "shadowY", "textShadow", 0, _.isNumber)
	@define "shadowBlur", layerProperty(@, "shadowBlur", "textShadow", 0, _.isNumber)
	@define "shadowColor", layerProperty(@, "shadowColor", "textShadow", "", Color.validColorValue, Color.toColor)
