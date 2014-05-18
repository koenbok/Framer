




layerA = new Layer
	width: 100
	height: 100

layerB = new Layer
	width: 20
	height: 20
	superLayer: layerA

layerB.draggable.enabled = true
layerB.draggable.maxDragFrame = layerA.frame

