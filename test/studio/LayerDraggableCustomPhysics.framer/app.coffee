
constraints = new Layer
	width: Screen.width - 100
	height: Screen.height - 400
constraints.clip = false
constraints.backgroundColor = "rgba(0, 0, 0, .1)"
constraints.center()

layer = new Layer
layer.superLayer = constraints
layer.draggable.enabled = true
layer.draggable.constraints = constraints.size
# layer.draggable.momentum = true
# layer.draggable.bounce = true
# layer.draggable.overdrag = true

print layer.draggable.momentumOptions
print layer.draggable.bounceOptions

layer.draggable.momentumOptions = {friction:.5, tolerance:1}
layer.draggable.bounceOptions = {friction:10, tension:400, tolerance:1}
	