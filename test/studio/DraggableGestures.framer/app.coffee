# Try this on mobile

layerA = new Layer
	width: 300
	height: 300

layerA.ignoreEvents = false
layerA.center()

layerA.draggable.enabled = true
layerA.draggable.rotatable = true
layerA.draggable.pinchable = true

layerA.on Events.Pinch, -> print "pinch"
