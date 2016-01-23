layer =  new Layer
	width: Screen.width / 2
	height: Screen.height / 2

layer.center()

layer.draggable.enabled = true
layer.pinchable.enabled = true
layer.pinchable.rotate = false


Utils.labelLayer(layer, "ALT to emulate touch, CMD to pan")

# layer.on Gestures.PinchStart, (e) -> print e.type
# layer.on Gestures.Pinch, (e) -> print e.type
# layer.on Gestures.PinchEnd, (e) -> print e.type
# 
# layer.on Gestures.RotateStart, (e) -> print e.type
# layer.on Gestures.Rotate, (e) -> print e.type
# layer.on Gestures.RotateEnd, (e) -> print e.type




















