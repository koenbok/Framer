


layerB = new Layer y:50

layerB.states.add "small", {scale:1, y:400}
layerB.states.add "big", {scale:1, y:0}
layerB.states.add "benjamin", {scale:1, y:48}

layer = new Layer

layer.states.add "small", {scale:2, blur:29}
layer.states.add "big", {scale:5, blur:0}
layer.states.add "benjamin", {scale:1, x:48}

layer.states.defaultAnimationOptions =
	curve: "linear"

layer.on "click", ->
	layer.states.next()
	layerB.states.next()

































layer.states.states().map (stateName, i) ->
	button = new Layer y:i*50, height:40, x:400
	button._element.innerHTML = stateName
	button.on "click", => layer.states.switch stateName