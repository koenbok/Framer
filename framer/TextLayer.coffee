{Layer} = require "./Layer"
{Events} = require "./Events"

class exports.TextLayer extends Layer

	constructor: (options={}) ->

		_.defaults options,
			backgroundColor: "transparent"
			width: 300
			height: 50
			html: "Add text"
			color: "#888"

		super options

		# Set type defaults
		if not @fontFamily

			currentDevice = Framer.Device.deviceType

			# Apple Device: SF UI
			if currentDevice.indexOf("apple") > -1
				@_setDefaults("-apple-system, SF UI Text, Helvetica Neue", @fontSize, @fontWeight, @lineHeight)

			# Google Device: Roboto
			if currentDevice.indexOf("google") > -1
				@_setDefaults("Roboto, Helvetica Neue", @fontSize, @fontWeight, @lineHeight)

			if currentDevice.indexOf("microsoft") > -1
				@_setDefaults("Segoe UI, Helvetica Neue", @fontSize, @fontWeight, @lineHeight)

			# Else: macOS
			else
				@_setDefaults("-apple-system, SF UI Text, Helvetica Neue", @fontSize, @fontWeight, @lineHeight)

		# Reset width and height
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
			lineHeight: @lineHeight
			letterSpacing: @letterSpacing
			textAlign: @textAlign
			textTransform: @textTransform
			textDecoration: @textDecoration

		# Set width and height based on style
		constraints = width: @width

		if autoWidth or autoHeight
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

	@define "textAlign",
		get: -> @style.textAlign
		set: (value) ->
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

	@define "autoWidth", @simpleProperty("autoWidth", false)
	@define "autoHeight", @simpleProperty("autoHeight", false)
