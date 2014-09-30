layer = new Layer



a = new Animation
	layer: layer
	properties:
		x: -> layer.x + 100
	time: 2.5
	repeat: 5


a.start()