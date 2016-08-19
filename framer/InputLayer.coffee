{Layer} = require "./Layer"
{TextLayer} = require "./TextLayer"
{Events} = require "./Events"

Events.EnterKey  = "EnterKey"
Events.BackSpaceKey  = "BackSpaceKey"
Events.InputValueChange = "InputValueChange"
Events.InputFocus = "InputFocus"

class exports.InputLayer extends TextLayer

	constructor: (options={}) ->

		_.defaults options,
			backgroundColor: "#FFF"
			width: 500
			height: 100
			color: "#AAA"

		super options

		if not @multiLine
			@input = document.createElement("input")
		else
			@input = document.createElement("textarea")

		@_element.appendChild(@input)

		# Match TextLayer defaults and type properties
		@input.style.fontFamily = @fontFamily
		@input.style.fontSize = @fontSize
		@input.style.lineHeight = @lineHeight
		@input.style.fontWeight = @fontWeight
		@input.style.outline = "none"
		@input.style.backgroundColor = "transparent"
		@input.style.width = "#{@width - 64}px"
		@input.style.height = "#{@height}px"
		@input.style.cursor = "auto"

		# Set placeholder color
		document.styleSheets[0].addRule("::-webkit-input-placeholder", "color: #{@color}")

		# Input text spacing
		@input.style.marginLeft = "32px"

		if @multiLine
			@input.style.marginTop = "32px"

		# If text has been defined, use that, otherwise default to placeholder
		@_setPlaceholder()

		# Override text property setting the html
		@html = ""

		# Check if in focus
		@_isFocused = false

		# Default focus interaction
		@input.onfocus = (e) =>

			@input.style.color = "#000"
			@input.value = ""

			# Emit focus event
			@emit(Events.InputFocus, event)

			@_isFocused = true


		@input.onkeyup = (e) =>

			# Check last character
			lastCharacter = @input.value.substr(@input.value.length - 1)

			# Exclude enter, shift, caps lock, control, alt, command etc.
			unless e.which in [13, 16, 17, 18, 20, 91, 93]
				@emit("change:value", @value)
				@emit(Events.InputValueChange, @value)

			# If enter key is pressed
			if e.which is 13
				@emit(Events.EnterKey, event)

			# If backspace key
			if e.which is 8
				@emit(Events.BackSpaceKey, event)

			# Revert to placeholder
			if @value is ""
				@_setPlaceholder()

	_setPlaceholder: =>
		@input.placeholder =
			if @text isnt "" and @text isnt "Type Something" then @text else "Placeholder"

		unless @_isFocused
			@input.style.color =
				if @color? then @color else "#aaa"

	@define "value",
		get: -> @input.value

	@define "focusColor",
		get: -> @input.style.color
		set: (value) ->
			@onInputFocus ->
				@input.style.color = value

	@define "multiLine", @simpleProperty("multiLine", false)

	onEnterKey: (cb) -> @on(Events.EnterKey, cb)
	onBackSpaceKey: (cb) -> @on(Events.BackSpaceKey, cb)
	onInputChange: (cb) -> @on(Events.InputValueChange, cb)
	onInputFocus: (cb) -> @on(Events.InputFocus, cb)
