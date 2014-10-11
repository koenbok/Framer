Utils = require "./Utils"

{Context} = require "./Context"

###############################################################
# Debug overview

_debugStyle =
	border: "1px solid rgba(50,150,200,.35)"
	backgroundColor: "rgba(50,150,200,.35)"

showDebug = -> 

	for layer in Framer.CurrentContext.getLayers()
		
		layer._debugStyle = _.pick(layer.style, _.keys(_debugStyle))
		layer.style = _debugStyle

		layer._debugElement = document.createElement("div")
		layer._debugElement.innerHTML = layer.name or layer.id
		layer._debugElement.classList.add("framerDebug")
		
		layer._element.appendChild(layer._debugElement)

hideDebug = ->
	
	for layer in Framer.CurrentContext.getLayers()
		layer.style = layer._debugStyle
		layer._debugElement.parentElement.removeChild(layer._debugElement)
		layer._debugElement = null

toggleDebug = Utils.toggle(showDebug, hideDebug)

EventKeys =
	Shift: 16
	Escape: 27

window.document.onkeyup = (event) ->
	if event.keyCode == EventKeys.Escape
		toggleDebug()()

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
