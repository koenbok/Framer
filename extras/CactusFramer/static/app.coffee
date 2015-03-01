
constraintLayer = new Layer
	width:  window.innerWidth / 2
	height: window.innerHeight / 2
	clip: false
	backgroundColor: "rgba(255,0,0,.1)"

constraintLayer.center()


layer = new Layer superLayer:constraintLayer
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


scroll = new ScrollComponent width:200, height:window.innerHeight
scroll.content.draggable.horizontal = false
h = 100

for i in [0..300]
	new Layer
		y: i * h
		width: scroll.width
		height: h
		superLayer: scroll.content
		backgroundColor: Utils.randomColor(.5)

