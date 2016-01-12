l = new Layer
	skew: 30
	width: 400
	backgroundColor: "gray"
	scale: 1.4
l.center()

l.animate
	properties: rotation: 360, rotationX: 360
	repeat: 10000
	time: 16
	curve: "linear"

overlay = new Layer
	backgroundColor: null
	borderColor: "magenta"
	borderWidth: 5

l.on "change:rotation", ->
	overlay.frame = l.screenFrame

ctx = new Framer.Context name: "root"
ctx.run =>
	cl = new Layer
		backgroundColor: null
		borderColor: "cyan"
		borderWidth: 2
	l.on "change:rotation", ->
		cl.frame = l.canvasFrame
