Utils = require "./Utils"

###############################################################
# Debug overview

_debugLayers = null

createDebugLayer = (layer) ->

	overLayer = new Layer
		frame: layer.screenFrame
		backgroundColor: "rgba(50,150,200,.35)"

	overLayer.style =
		textAlign: "center"
		color: "white"
		font: "10px/1em Monaco"
		lineHeight: "#{overLayer.height + 1}px"
		boxShadow: "inset 0 0 0 1px rgba(255,255,255,.5)"

	overLayer.html = layer.name or layer.id

	overLayer.on Events.Click, (event, layer) ->
		layer.scale = 0.8
		layer.animate 
			properties: {scale:1}
			curve: "spring(1000,10,0)"

	overLayer

showDebug = -> _debugLayers = Layer.Layers().map createDebugLayer
hideDebug = -> _debugLayers.map (layer) -> layer.destroy()

toggleDebug = Utils.toggle showDebug, hideDebug

EventKeys =
	Shift: 16
	Escape: 27

window.document.onkeyup = (event) ->
	if event.keyCode == EventKeys.Escape
		toggleDebug()()

###############################################################
# Error warning

_errorWarningLayer = null

errorWarning = ->

	return if _errorWarningLayer

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

window.onerror = errorWarning
