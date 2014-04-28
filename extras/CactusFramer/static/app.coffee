layerA = new Layer

layerA.states.add "test", {y: (-> Math.random() * 100)}

layerA.on "click", ->
	layerA.states.next()