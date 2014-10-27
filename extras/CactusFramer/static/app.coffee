Framer.Device = new Framer.DeviceView()
Framer.Device.setupContext()


selectionLayer = null

ctx = new Framer.Context name:"highlight"
ctx.run ->
	selectionLayer = new Layer

selectionLayer.style =
	border: "1px solid red"
	zIndex: 1000

# Welcome to Framer

# Learn how to prototype: http://framerjs.com/learn
# Drop an image on the device, or import a design from Sketch or Photoshop

iconLayer = new Layer width:256, height:256
iconLayer.center()

# Define a set of states with names (the original state is 'default')
iconLayer.states.add
	second: {y:100, scale:0.6, rotationZ:100}
	third:  {y:300, scale:1.3, blur:4}
	fourth: {y:200, scale:0.9, blur:2, rotationZ:200}

# Set the default animation options
iconLayer.states.animationOptions =
	curve: "spring(500,12,0)"

# On a click, go to the next state
iconLayer.on Events.Click, ->
	iconLayer.states.next()

selectionLayer.frame = iconLayer.screenScaledFrame()