layerA = new Layer

layerA.blur = 5

layerA.on Events.Click, ->
	@scale = 0.5
	# @blur = 50
	@animate
		properties: {scale:1.0}
		curve: "spring(1000,10,0)"