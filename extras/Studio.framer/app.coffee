rk4 = new Framer.SpringRK4Animator
	friction: 5
	tension: 90

values = rk4.values(1/60*2)

# Draw a stupid graph

graph = new Layer
	point: Align.center

for index, value of values
	new Layer
		parent: graph
		size: 6
		borderRadius: 6
		x: parseInt(index) * (graph.width / values.length)
		y: value * (graph.height / 2)
		
