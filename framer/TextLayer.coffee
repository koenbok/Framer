{Layer} = require "./Layer"

class exports.TextLayer extends Layer
	constructor: (options={}) ->

		options.backgroundColor ?= "transparent"
		options.html ?= "Type Something"
		options.color ?= "#eee"

		super options

		# Set type defaults
		if not @fontFamily
			@_setStyle("-apple-system, SF UI Text, Helvetica Neue", @fontSize, @fontWeight, @lineHeight)

		if not @fontSize
			@_setStyle(@fontFamily, 40, @fontWeight, @lineHeight)

		if not @fontWeight
			@_setStyle(@fontFamily, @fontSize, 400, @lineHeight)

		if not @lineHeight
			@_setStyle(@fontFamily, @fontSize, @fontWeight, 1.25)

		# Reset width and height
		if @autoWidth
			@_setSize(true, false)
		if @autoHeight
			@_setSize(false, true)

	_setStyle: (fontFamily, fontSize, fontWeight, lineHeight) =>
		@style =
			fontFamily: fontFamily
			fontWeight: "#{fontWeight}"
			fontSize: "#{fontSize}px"
			lineHeight: "#{lineHeight}"

	_setSize: (width, height) =>

		# Get current style
		currentStyle =
			fontFamily: @fontFamily
			fontSize: @fontSize
			fontWeight: @fontWeight
			lineHeight: @lineHeight

		# Set width and height based on style
		constraints = width: @width

		if width
			@width = Utils.textSize(@text, currentStyle).width
		if height
			@height = Utils.textSize(@text, currentStyle, constraints).height

	@define "text",
		get: -> @html
		set: (value) -> @html = value

	@define "fontFamily",
		get: -> @style.fontFamily
		set: (value) -> @_setStyle(value, @fontSize, @fontWeight, @lineHeight)

	@define "fontSize",
		get: -> @style.fontSize
		set: (value) -> @_setStyle(@fontFamily, value, @fontWeight, @lineHeight)

	@define "fontWeight",
		get: -> @style.fontWeight
		set: (value) -> @_setStyle(@fontFamily, @fontSize, value, @lineHeight)

	@define "lineHeight",
		get: -> @style.lineHeight
		set: (value) -> @_setStyle(@fontFamily, @fontSize, @fontWeight, value)

	@define "autoWidth", @simpleProperty("autoWidth", false)
	@define "autoHeight", @simpleProperty("autoHeight", false)
