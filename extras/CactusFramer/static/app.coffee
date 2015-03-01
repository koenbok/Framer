
constraintLayer = new Layer
	width:  window.innerWidth - 100
	height: window.innerHeight - 100
	clip: false
	backgroundColor: "rgba(255,0,0,.1)"

constraintLayer.center()


layer = new Layer
	width: 300
	height: 300
	superLayer:constraintLayer
layer.center()

constraintLayer.scale = 0.8


layer.draggable.enabled = true
layer.draggable.momentum = true
layer.draggable.bounce = true
layer.draggable.constraints = constraintLayer.size
layer.draggable.overdrag = true
layer.draggable.overdragScale = 0.1
# # layer.draggable.lockDirection = true

# layer.on Events.DragMove, ->
# 	print layer.draggable.velocity


# scroll = new ScrollComponent width:window.innerWidth, height:window.innerHeight
# scroll.content.draggable.horizontal = false
# h = 400

# for i in [0..30]
# 	layer = new Layer
# 		y: i * h
# 		width: scroll.width
# 		height: h
# 		superLayer: scroll.content
# 		backgroundColor: Utils.randomColor(.5)
# 	# Utils.labelLayer(layer, "Layer #{i}")

