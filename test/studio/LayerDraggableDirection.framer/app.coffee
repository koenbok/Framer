layer = new Layer
layer.center()

layer.draggable.enabled = true
layer.draggable.constraints = {x:0, y:0, width:Screen.width, height:Screen.height}

layer.on Events.DragMove, ->
	print layer.draggable.direction