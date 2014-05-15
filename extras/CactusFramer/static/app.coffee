layerA = new Layer
	width: 250
	height: 300
	midX: 200
	clip: true

layerA.states.add "hello", {x:500}

layerA.y = 300

layerA.states.add "other", layerA.properties


layerA.states.switchInstant "hello"
layerA.states.switch "other"

# console.log typeof layerA.properties.visible