# This project requires full refreshes

Framer.Device.deviceType = "iphone-6-silver"

layer = new Layer
	width: 300
	height: 300
layer.center()

print layer
print layer.screenFrame
print layer.canvasFrame

Framer.DefaultContext.run ->
	new Layer
		frame:layer.canvasFrame
		scaleX:layer.canvasScaleX()
		scaleY:layer.canvasScaleY()

Framer.CurrentContext.run ->
	new Layer
		frame:layer.screenFrame
		scaleX:layer.screenScaleX()
		scaleY:layer.screenScaleY()