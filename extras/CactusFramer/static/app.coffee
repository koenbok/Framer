layerA = new Layer
	width: 250
	height: 300
	midX: 200
	clip: true

layerB = new Layer
	y: layerA.maxY-20
	height: 100
	width: layerA.width
	superLayer: layerA