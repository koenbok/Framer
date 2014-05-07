Utils = require "./Utils"

_debugLayers = null

createDebugLayer = (layer) ->

	overLayer = new Layer
		frame: layer.screenFrame()
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

# window.document.onkeydown = (event) ->
	
# 	if event.keyCode == EventKeys.Shift
# 		config.timeSpeedFactor = 25


window.document.onkeyup = (event) ->
	if event.keyCode == EventKeys.Escape
		toggleDebug()()
		

# # Throw a warning on a javascript error

# window.onerror = exports.errorWarning