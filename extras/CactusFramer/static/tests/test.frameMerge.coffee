
frames = [0..3].map ->
	layer = new Layer
		x: Utils.mapRange Math.random(), 0, 1, 0, 500
		y: Utils.mapRange Math.random(), 0, 1, 0, 500
		width: Utils.mapRange Math.random(), 0, 1, 0, 500
		height: Utils.mapRange Math.random(), 0, 1, 0, 500


overLayer = new Layer
overLayer.backgroundColor = Utils.randomColor .5
overLayer.frame = Utils.frameMerge frames
