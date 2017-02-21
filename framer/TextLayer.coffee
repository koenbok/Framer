{Layer, layerProperty} = require "./Layer"
{LayerStyle} = require "./LayerStyle"
{Color} = require "./Color"
{Events} = require "./Events"

class exports.TextLayer extends Layer

	explicitWidth: false

	constructor: (options={}) ->

		_.defaults options,
			backgroundColor: "transparent"
			html: "Add text"
			color: "#888"

		super options

		# Set padding
		@_padding = options.padding or Utils.rectZero()

		# Set default width
		@explicitWidth = options.width?

		# Set type defaults
		if not @fontFamily and not @font
			@fontFamily = @defaultFont()

		# Reset width and height
		@autoSize()

		@on "change:parent", =>
			@autoSize()

		@on "change:text", =>
			@autoSize()

	defaultFont: ->
		# Android Device: Roboto
		if Utils.isAndroid()
			return "Roboto, Helvetica Neue"
		# Edge Device: Segoe UI
		if Utils.isEdge?()
			return "Segoe UI, Helvetica Neue"
		# General default: macOS, SF UI
		return "-apple-system, SF UI Text, Helvetica Neue"

	autoSize: ->
		constraints =
			max: true
		if @explicitWidth
			constraints.width = @width
		else
			constraints.width = if @parent? then @parent.width else Screen.width
		size = Utils.textSize(@text, _.clone(@style), constraints)
		if size.width isnt @width
			@width = size.width
		if size.height isnt @height
			@height = size.height

		# Calculate new height on font property changes
		@_fontProperties = [
			"fontFamily"
			"fontSize"
			"fontWeight"
			"fontStyle"
			"lineHeight"
			"letterSpacing"
			"wordSpacing"
			"textAlign"
			"textTransform"
			"textDecoration"
			"textIndent"
		]

		for property in @_fontProperties
			@on "change:#{property}", =>
				@_setSize(@autoWidth, @autoHeight)

	_setDefaults: (fontFamily, fontSize, fontWeight, lineHeight) =>
		@style =
			fontFamily: fontFamily
			fontSize: "#{fontSize}px"
			fontWeight: "#{fontWeight}"
			lineHeight: "#{lineHeight}"

	_setSize: (autoWidth, autoHeight) =>

		# Get current style
		currentStyle =
			fontFamily: @fontFamily
			fontSize: @fontSize
			fontWeight: @fontWeight
			fontStyle: @fontStyle
			lineHeight: @lineHeight
			letterSpacing: @letterSpacing
			wordSpacing: @wordSpacing
			textAlign: @textAlign
			textTransform: @textTransform
			textDecoration: @textDecoration
			textIndent: @textIndent
			direction: @direction

		# Set width and height based on style
		constraints = width: @width

		if autoWidth and not autoHeight
			@width = Utils.textSize(@text, currentStyle).width

		if autoHeight and not autoWidth
			@height = Utils.textSize(@text, currentStyle, constraints).height

		if autoWidth and autoHeight
			@size = Utils.textSize(@text, currentStyle)

		@emit("change:size")

	@define "text",
		get: -> @html
		set: (value) ->
			@html = value
			@emit("change:text", value)

	@define "padding",
		get: ->
			_.clone(@_padding)

		set: (padding) ->
			@_padding = Utils.rectZero(Utils.parseRect(padding))

			# Top, Right, Bottom, Left
			@style.padding =
				"#{@_padding.top}px #{@_padding.right}px #{@_padding.bottom}px #{@_padding.left}px"

	@define "fontFamily",
		get: -> @style.fontFamily
		set: (value) ->
			@style.fontFamily = value
			@emit("change:fontFamily", value)

	@define "fontSize",
		get: -> @style.fontSize or 40
		set: (value) ->
			@style.fontSize = "#{value}px"
			@emit("change:fontSize", value)

	@define "fontWeight",
		get: -> @style.fontWeight or 400
		set: (value) ->
			@style.fontWeight = "#{value}"
			@emit("change:fontWeight", value)

	@define "fontStyle",
		get: -> @style.fontStyle
		set: (value) ->
			@style.fontStyle = value
			@emit("change:fontStyle", value)

	@define "lineHeight",
		get: -> @style.lineHeight or 1.25
		set: (value) ->
			@style.lineHeight = "#{value}"
			@emit("change:lineHeight", value)

	@define "letterSpacing",
		get: -> @style.letterSpacing
		set: (value) ->
			@style.letterSpacing = "#{value}px"
			@emit("change:letterSpacing", value)

	@define "wordSpacing",
		get: -> @style.wordSpacing
		set: (value) ->
			@style.wordSpacing = "#{value}px"
			@emit("change:wordSpacing", value)

	@define "textAlign",
		get: -> @style.textAlign
		set: (value) ->

			if value is Align.left
				@style.textAlign = "left"
			if value is Align.center
				@style.textAlign = "center"
			if value is Align.right
				@style.textAlign = "right"
			else
				@style.textAlign = value

			@emit("change:textAlign", value)

	@define "textTransform",
		get: -> @style.textTransform
		set: (value) ->
			@style.textTransform = value
			@emit("change:textTransform", value)

	@define "textDecoration",
		get: -> @style.textDecoration
		set: (value) ->
			@style.textDecoration = value
			@emit("change:textDecoration", value)

	@define "textIndent",
		get: -> @style.textIndent
		set: (value) ->
			@style.textIndent = "#{value}px"
			@emit("change:textIndent", value)

	@define "direction",
		get: -> @style.direction
		set: (value) ->

			if value is "right-to-left"
				@style.direction = "rtl"

			if value is "left-to-right"
				@style.direction = "ltr"

			else
				@style.direction = value

			@emit("change:direction", value)

	@define "font",
		get: -> @style.font
		set: (value) ->

			# Check if value contains number. We then assume proper use of font.
			# Otherwise, we default to setting the fontFamily.
			if /\d/.test(value)
				@style.font = value
			else
				@style.fontFamily = value

			@emit("change:font", value)

	# Map shadow properties to text shadow
	@define "shadowX", layerProperty(@, "shadowX", "textShadow", 0, _.isNumber)
	@define "shadowY", layerProperty(@, "shadowY", "textShadow", 0, _.isNumber)
	@define "shadowBlur", layerProperty(@, "shadowBlur", "textShadow", 0, _.isNumber)
	@define "shadowColor", layerProperty(@, "shadowColor", "textShadow", "", Color.validColorValue, Color.toColor)

	# Set width and height automatically
	@define "autoWidth", @simpleProperty("autoWidth", false)
	@define "autoHeight", @simpleProperty("autoHeight", false)
