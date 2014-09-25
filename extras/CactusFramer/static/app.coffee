


LAYERS = for i in [1..200]

	layerC = new Layer 
		x: Math.random() * window.innerWidth, 
		y: Math.random() * window.innerHeight
		
	
Utils.interval .3, ->
	
	layer = _.shuffle(LAYERS)[0];
	
	layer.animate
		properties:
			x: Math.random() * window.innerWidth, 
			y: Math.random() * window.innerHeight
# 			rotationX: Math.random() * 180
# 			rotationY: Math.random() * 180
		curve: "spring(5,1, 0)"


