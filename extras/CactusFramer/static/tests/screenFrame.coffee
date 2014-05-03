
layers = [1..10].map ->
	layer = new Layer
		x: parseInt Utils.mapRange Math.random(), 0, 1, 0, 100
		y: parseInt Utils.mapRange Math.random(), 0, 1, 0, 100
		width: parseInt Utils.mapRange Math.random(), 0, 1, 0, 300
		height: parseInt Utils.mapRange Math.random(), 0, 1, 0, 300
		clip: false

lastLayer = null

for layer in layers

	if lastLayer
		layer.superLayer = lastLayer

	lastLayer = layer


highlightLayer = (event, layer) ->

	console.log "Click Layer #{layer.id}", layer.frame.toString()

	event.stopPropagation()

	screenFrame = layer.screenFrame()
	screenLayer = new Layer

	screenLayer.animate
		properties: screenFrame
		curve: "spring(500,50,0)"

	Utils.delay 0.8, ->
		screenLayer.visible = false
	
for layer in layers
	layer.on Events.Click, highlightLayer



	
	
	
	


