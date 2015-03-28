
constraints = new Layer
	width: Screen.width - 100
	height: Screen.height - 100
constraints.clip = false
constraints.backgroundColor = "rgba(0,0,0,.1)"
constraints.center()

layer = new Layer
layer.superLayer = constraints
layer.draggable.enabled = true
layer.draggable.constraints = constraints.size
layer.draggable.momentum = true
layer.draggable.bounce = true
layer.draggable.overdrag = true