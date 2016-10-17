{Layer} = require "./Layer"
{Events} = require "./Events"

class exports.TextLayer extends Layer

	constructor: (options={}) ->

		options.width ?= 300
		options.backgroundColor ?= "transparent"
		options.html ?= "Add text"
		options.color ?= "#888"

		super options

		# Set word-break
		# @style.wordBreak = "break-word"

		# Set type defaults
		if not @fontFamily

			currentDevice = Framer.Device.deviceType

			# Apple Device: SF UI
			if currentDevice.indexOf("apple") > -1
				@_setStyle("-apple-system, SF UI Text, Helvetica Neue", @fontSize, @fontWeight, @lineHeight)

			# Google Device: Roboto
			if currentDevice.indexOf("google") > -1
				@_setStyle("Roboto, Helvetica Neue", @fontSize, @fontWeight, @lineHeight)

			if currentDevice.indexOf("microsoft") > -1
				@_setStyle("Segoe UI, Helvetica Neue", @fontSize, @fontWeight, @lineHeight)

			# Else: macOS
			else
				@_setStyle("-apple-system, SF UI Text, Helvetica Neue", @fontSize, @fontWeight, @lineHeight)

		if not @fontSize
			@_setStyle(@fontFamily, 40, @fontWeight, @lineHeight)

		if not @fontWeight
			@_setStyle(@fontFamily, @fontSize, 400, @lineHeight)

		if not @lineHeight
			@_setStyle(@fontFamily, @fontSize, @fontWeight, 1.25)

		# Reset width and height
		if @autoWidth and not @autoHeight
			@_setSize(true, false)

		if @autoHeight and not @autoWidth
			@_setSize(false, true)

		if @autoWidth and @autoHeight
			@_setSize(true, true)

	_setStyle: (fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textAlign, textTransform) =>
		@style =
			fontFamily: fontFamily
			fontSize: "#{fontSize}px"
			fontWeight: "#{fontWeight}"
			lineHeight: "#{lineHeight}"
			letterSpacing: "#{letterSpacing}px"
			textAlign: textAlign
			textTransform: textTransform

	_setSize: (width, height) =>

		# Get current style
		currentStyle =
			fontFamily: @fontFamily
			fontSize: @fontSize
			fontWeight: @fontWeight
			lineHeight: @lineHeight
			letterSpacing: @letterSpacing
			textAlign: @textAlign
			textTransform: @textTransform

		# Set width and height based on style
		constraints = width: @width

		if width and not height
			@width = Utils.textSize(@text, currentStyle).width

		if height and not width
			@height = Utils.textSize(@text, currentStyle, constraints).height

		if width and height
			@size = Utils.textSize(@text, currentStyle)

		@emit("change:size")

	@define "text",
		get: -> @html
		set: (value) -> @html = value

	@define "fontFamily",
		get: -> @style.fontFamily
		set: (value) -> @_setStyle(value, @fontSize, @fontWeight, @lineHeight, @letterSpacing, @textAlign, @textTransform)

	@define "fontSize",
		get: -> @style.fontSize
		set: (value) -> @_setStyle(@fontFamily, value, @fontWeight, @lineHeight, @letterSpacing, @textAlign, @textTransform)

	@define "fontWeight",
		get: -> @style.fontWeight
		set: (value) -> @_setStyle(@fontFamily, @fontSize, value, @lineHeight, @letterSpacing, @textAlign, @textTransform)

	@define "lineHeight",
		get: -> @style.lineHeight
		set: (value) -> @_setStyle(@fontFamily, @fontSize, @fontWeight, value, @letterSpacing, @textAlign, @textTransform)

	@define "letterSpacing",
		get: -> @style.letterSpacing
		set: (value) -> @_setStyle(@fontFamily, @fontSize, @fontWeight, @lineHeight, value, @textAlign, @textTransform)

	@define "textAlign",
		get: -> @style.textAlign
		set: (value) -> @_setStyle(@fontFamily, @fontSize, @fontWeight, @lineHeight, @letterSpacing, value, @textTransform)

	@define "textTransform",
		get: -> @style.textTransform
		set: (value) -> @_setStyle(@fontFamily, @fontSize, @fontWeight, @lineHeight, @letterSpacing, @textAlign, value)

	@define "autoWidth", @simpleProperty("autoWidth", false)
	@define "autoHeight", @simpleProperty("autoHeight", false)
