
# constraintLayer = new Layer
# 	width:  window.innerWidth - 100
# 	height: window.innerHeight - 100
# 	clip: false
# 	backgroundColor: "rgba(255,0,0,.1)"

# constraintLayer.center()


# layer = new Layer
# 	width: 300
# 	height: 300
# 	superLayer:constraintLayer
# layer.center()

# constraintLayer.scale = 0.8


# layer.draggable.enabled = true
# layer.draggable.momentum = true
# layer.draggable.bounce = true
# layer.draggable.constraints = constraintLayer.size
# layer.draggable.overdrag = true
# layer.draggable.overdragScale = 0.1
# # layer.draggable.lockDirection = true

# layer.on Events.DragMove, ->
# 	print layer.draggable.velocity


scroll = new ScrollComponent width:window.innerWidth, height:window.innerHeight
scroll.content.draggable.horizontal = false

scroll.contentInset = {top:100, right:0, bottom:0, left:0}

scroll.content.on Events.Scroll, ->
	console.log scroll.velocity

h = 400

for i in [0..30]
	layer = new Layer
		y: i * h
		width: scroll.width
		height: h
		superLayer: scroll.content
		backgroundColor: Utils.randomColor(.5)
	# Utils.labelLayer(layer, "Layer #{i}")

# Utils.delay 1, -> scroll.scrollToLayer(layer)


# scroll.content.on Events.DragMove, ->
# 	print scroll.scrollY

# layer = new Layer
# content = new Layer height:500, superLayer:layer
# layer.scroll = true

# layer.on Events.Scroll, ->
# 	print layer.scrollY
