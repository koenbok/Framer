
constraints = new Layer
constraints.clip = false
constraints.anchor([100,100,100,100])
constraints.backgroundColor = "rgba(0,0,0,.1)"

layer = new Layer
layer.superLayer = constraints
layer.draggable.enabled = true
layer.draggable.constraints = constraints.size
layer.draggable.momentum = true
layer.draggable.bounce = true
layer.draggable.overdrag = true