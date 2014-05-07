
layer = new Layer

layer.states.add
	one: {x: 100}
	two: {x: 500}

layer.on Events.Click, ->
	@animate
		properties: x:500
		repeat: 5