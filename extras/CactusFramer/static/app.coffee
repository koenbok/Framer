layerA = new Layer
	width: 250
	height: 300
	midX: 200
	clip: true

Utils.labelLayer layerA, "Hello"

layerA.draggable.enabled = true
layerA.draggable.speedY = 0.1