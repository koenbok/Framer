{Layer} = require "./Layer"

class exports.TextLayer extends Layer
	constructor: (options={}) ->

		options.width ?= 300
		options.backgroundColor ?= "transparent"
		options.html ?= "Type Something"
		options.color ?= "#808080"

		super options

		# Set type defaults
		if not @fontFamily

			currentDevice = Framer.Device.deviceType

			# Apple Device: SF UI
			if currentDevice.indexOf("apple") > -1
				@_setStyle("-apple-system, SF UI Text, Helvetica Neue", @fontSize, @fontWeight, @lineHeight)

			# Google Device: Roboto
			if currentDevice.indexOf("google") > -1
				@_setStyle("Roboto, Helvetica Neue", @fontSize, @fontWeight, @lineHeight)

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

	_setStyle: (fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textAlign) =>
		@style =
			fontFamily: fontFamily
			fontWeight: "#{fontWeight}"
			fontSize: "#{fontSize}px"
			lineHeight: "#{lineHeight}"
			letterSpacing: "#{letterSpacing}px"
			textAlign: textAlign

	_setSize: (width, height) =>

		# Get current style
		currentStyle =
			fontFamily: @fontFamily
			fontSize: @fontSize
			fontWeight: @fontWeight
			lineHeight: @lineHeight
			letterSpacing: @letterSpacing
			textAlign: @textAlign

		# Set width and height based on style
		constraints = width: @width

		if width and not height
			@width = Utils.textSize(@text, currentStyle).width
		if height and not width
			@height = Utils.textSize(@text, currentStyle, constraints).height
		if width and height
			@size = Utils.textSize(@text, currentStyle)

	@define "text",
		get: -> @html
		set: (value) -> @html = value

	@define "fontFamily",
		get: -> @style.fontFamily
		set: (value) -> @_setStyle(value, @fontSize, @fontWeight, @lineHeight, @letterSpacing, @textAlign)

	@define "fontSize",
		get: -> @style.fontSize
		set: (value) -> @_setStyle(@fontFamily, value, @fontWeight, @lineHeight, @letterSpacing, @textAlign)

	@define "fontWeight",
		get: -> @style.fontWeight
		set: (value) -> @_setStyle(@fontFamily, @fontSize, value, @lineHeight, @letterSpacing, @textAlign)

	@define "lineHeight",
		get: -> @style.lineHeight
		set: (value) -> @_setStyle(@fontFamily, @fontSize, @fontWeight, value, @letterSpacing, @textAlign)

	@define "letterSpacing",
		get: -> @style.letterSpacing
		set: (value) -> @_setStyle(@fontFamily, @fontSize, @fontWeight, @lineHeight, value, @textAlign)

	@define "textAlign",
		get: -> @style.textAlign
		set: (value) -> @_setStyle(@fontFamily, @fontSize, @fontWeight, @lineHeight, @letterSpacing, value)

	@define "autoWidth", @simpleProperty("autoWidth", false)
	@define "autoHeight", @simpleProperty("autoHeight", false)
