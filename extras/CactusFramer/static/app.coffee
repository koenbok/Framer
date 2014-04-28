layerA = new Layer

layerA.on "click", ->
	layerA.animate
		properties: {y:parseInt(Math.random() * 300)}
