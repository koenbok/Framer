layerA = new Layer

layerA.draggable.enabled = true

layerA.on Events.DragEnd, (event, layer) ->
	
	constant1 = 1000
	constant2 = 0

	velocity = layer.draggable.calculateVelocity()
	totalVelocity = Utils.pointTotal Utils.pointAbs velocity

	animation = layer.animate
		properties:
			x: parseInt(layer.x + (velocity.x * constant1))
			y: parseInt(layer.y + (velocity.y * constant1))
		curve: "spring(100,100,#{totalVelocity * constant2})"