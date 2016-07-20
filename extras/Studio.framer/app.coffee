layerA = new Layer
	backgroundColor: "blue"
	width: Align.parent(.8)

layerB = new Layer
	backgroundColor: "red"
	frame: Align.children

layerC = new Layer
	parent: layerB
		
layerD = new Layer
	parent: layerB
	y: Screen.height - 200

layerB.frame = Align.children