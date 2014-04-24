layer = new Layer

a1 = layer.animate
	properties: 
		x: 100
	curve: "spring(500,15,1)"


a2 = a1.inverse()

# a1.on "end", a2.start
# a2.on "end", a1.start




