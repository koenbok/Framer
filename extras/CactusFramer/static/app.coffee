AnimationFactor = 1

layerA = new Layer width:80, height:80
layerA.name = "layerA"
layerA.animate
	properties: {y:300}
	time: 2 * AnimationFactor

layerB = new Layer width:80, height:80, x:100, backgroundColor:"red"
layerB.name = "layerB"
layerB.animate
	properties: {y:300}
	time: 5 * AnimationFactor

layerC = new Layer width:80, height:80, x:200, backgroundColor:"orange"
layerC.name = "layerC"
layerC.animate
	properties: {y:300}
	time: 2 * AnimationFactor
	curve: "cubic-bezier"

readyLayers = []

ready = (animation, layer)->

	console.log layer.name, "end"

	if layer in readyLayers
		console.log "2x", layer.name
		return 

	readyLayers.push layer

	if readyLayers.length is 3
		layerA.y.should.equal 300
		layerB.y.should.equal 300
		layerC.y.should.equal 300

layerA.on "end", ready
layerB.on "end", ready
layerC.on "end", ready