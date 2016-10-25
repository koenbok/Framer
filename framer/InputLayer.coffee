Utils = require "./Utils"

{Layer} = require "./Layer"
{TextLayer} = require "./TextLayer"
{Events} = require "./Events"

Events.EnterKey  = "EnterKey"
Events.BackspaceKey  = "BackspaceKey"
Events.InputValueChange = "InputValueChange"
Events.InputFocus = "InputFocus"
Events.InputBlur = "InputBlur"

class exports.InputLayer extends TextLayer

	constructor: (options={}) ->

		_.defaults options,
			backgroundColor: "#FFF"
			width: 500
			height: 100

		super options

		# Layer containing input element
		@input = new Layer
			backgroundColor: "transparent"
			x: 30
			width: @width - 60
			height: @height
			parent: @
			name: "input"

		if @multiLine
			@_inputElement = document.createElement("textarea")
			@input.y = 25
		else
			@_inputElement = document.createElement("input")

		# The id serves to differentiate multiple input elements from one another.
		# To allow styling the placeholder colors of seperate elements.
		@_id = Utils.round(Utils.randomNumber(0, 100))
		@_inputElement.className = "input" + @_id

		@on "change:width", =>
			@_inputElement.style.width = "#{@input.width}px}"

		# Append element
		@input._element.appendChild(@_inputElement)

		# Match TextLayer defaults and type properties
		@_setTextProperties()

		# All inherited properties
		textProperties =
			{@fontFamily, @fontSize, @lineHeight, @fontWeight, @color, @backgroundColor, @width, @height}

		for property, value of textProperties

			@on "change:#{property}", (value) =>
				@_setTextProperties()
				@_setPlaceholder()

		# Set default placeholder text
		@_defaultText = @text
		@_setPlaceholder()

		# Override text property setting the html
		@html = ""

		# Check if in focus
		@_isFocused = false

		# Default focus interaction
		@_inputElement.onfocus = (e) =>

			@focusColor = "#000"

			# Emit focus event
			@emit(Events.InputFocus, event)

			@_isFocused = true

		# On blur event
		@_inputElement.onblur = (e) =>
			# Emit blur event
			@emit(Events.InputBlur, event)

		@_inputElement.onkeyup = (e) =>

			# Check last character
			lastCharacter = @_inputElement.value.substr(@_inputElement.value.length - 1)

			# Exclude enter, shift, caps lock, control, alt, command etc.
			unless e.which in [13, 16, 17, 18, 20, 91, 93]
				@emit("change:value", @value)
				@emit(Events.InputValueChange, @value)

			# If enter key is pressed
			if e.which is 13
				@emit(Events.EnterKey, event)

			# If backspace key
			if e.which is 8
				@emit(Events.BackspaceKey, event)

			# Revert to placeholder
			if @value is ""
				@_setPlaceholder()

	_setPlaceholder: =>
		@_inputElement.placeholder = @_defaultText

		unless @_isFocused
			@_inputElement.style.color = @color ? "#aaa"
			@_setPlaceholderColor(@_id, @color)

	_setPlaceholderColor: (id, color) ->
		document.styleSheets[0].addRule(".input#{id}::-webkit-input-placeholder", "color: #{color}")

	_setTextProperties: =>
		@_inputElement.style.fontFamily = @fontFamily
		@_inputElement.style.fontSize = @fontSize
		@_inputElement.style.lineHeight = @lineHeight
		@_inputElement.style.fontWeight = @fontWeight
		@_inputElement.style.color = @color
		@_inputElement.style.outline = "none"
		@_inputElement.style.backgroundColor = "transparent"
		@_inputElement.style.width = "#{@width - 64}px"
		@_inputElement.style.height = "#{@height}px"
		@_inputElement.style.cursor = "auto"
		@_inputElement.style.webkitAppearance = "none"
		@_inputElement.style.resize = "none"

	@define "value",
		get: -> @_inputElement.value
		set: (value) -> @_inputElement.value = value

	@define "focusColor",
		get: -> @_inputElement.style.color
		set: (value) -> @_inputElement.style.color = value

	@define "multiLine", @simpleProperty("multiLine", false)

	onEnterKey: (cb) -> @on(Events.EnterKey, cb)
	onBackspaceKey: (cb) -> @on(Events.BackspaceKey, cb)
	onInputChange: (cb) -> @on(Events.InputValueChange, cb)
	onInputFocus: (cb) -> @on(Events.InputFocus, cb)
	onInputBlur: (cb) -> @on(Events.InputBlur, cb)
