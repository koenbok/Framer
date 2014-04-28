layerA = new Layer
layerB = new Layer x:500, y:20

layerB.on "click", ->
	layerA.animate
		properties: {y:100}
