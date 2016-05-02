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
			backgroundColor: "#fff"
			width: 500
			height: 100
			color: "#aaa"

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
		@input.style.color = if @color? then @color else "#aaa"
		@input.style.cursor = "auto"

		# Input text spacing
		@input.style.marginLeft = "32px"

		if @multiLine
			@input.style.marginTop = "32px"

		# If text has been defined, use that, otherwise default to placeholder
		@input.value = if @text isnt "Type Something" then @text else "Placeholder"

		# Override text property setting the html
		@html = ""

		# Default focus interaction
		@input.onfocus = (e) =>
			
			@input.style.color = "#000"
			@input.value = ""

			# Emit focus event
			@emit(Events.InputFocus, event)

		@input.onkeyup = (e) =>

			# Check last character
			lastCharacter = @input.value.substr(@input.value.length - 1)

			# Exclude enter, space and caps lock
			unless e.which is 20 or e.which is 13 or @value is ""
				@emit("change:value", @value)
				@emit(Events.InputValueChange, @value)

			# If enter key is pressed
			if e.which is 13
				@emit(Events.EnterKey, event)

			# If backspace key
			if e.which is 8
				@emit(Events.BackSpaceKey, event)


	_updateInput: =>
		@input.style.width = "#{@width - 64}px"
		@input.style.height = "#{@height}px"

	_makeTextArea: (input) =>
		textarea = document.createElement("textarea")
		input.replaceWith(textarea)

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
