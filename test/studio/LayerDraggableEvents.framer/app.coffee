eventKeys = [
	"Move", 
	"DragStart", 
	"DragMove", 
	"DragEnd", 
	"DragAnimationStart", 
	"DragAnimationEnd", 
]

layer = new Layer
layer.center()

layer.draggable.enabled = true
layer.draggable.constraints = {x:0, y:0, width:Screen.width, height:Screen.height}

_.map eventKeys, (eventKey) ->
	layer.on Events[eventKey], ->
		print eventKey, Events[eventKey]
	