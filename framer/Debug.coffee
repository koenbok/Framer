Utils = require "./Utils"

{Context} = require "./Context"

###############################################################
# Error warning

_errorContext = null
_errorShown = false

errorWarning = (event) ->

	if not _errorContext
		_errorContext = new Context(name:"Error")

	return if _errorShown

	_errorShown = true

	layer = new Layer {x:20, y:-50, width:300, height:40}

	layer.states.add
		visible: {x:20, y:20, width:300, height:40}

	layer.html = "Javascript Error, see the console"
	layer.style =
		font: "12px/1.35em Menlo"
		color: "white"
		textAlign: "center"
		lineHeight: "#{layer.height}px"
		borderRadius: "5px"
		backgroundColor: "rgba(255,0,0,.8)"

	layer.states.animationOptions =
		curve: "spring"
		curveOptions:
			tension: 1000
			friction: 30

	layer.states.switch "visible"

	layer.on Events.Click, ->
		@states.switch "default"

	_errorWarningLayer = layer

window.error = errorWarning
