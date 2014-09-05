layer = new Layer width:500, height:500

layer.x = 100
layer.clip = false


ctx = new Framer.Context parentElement:layer._element

codeFunction = ->

	lastLayer = null

	for i in [1..100]
		layer = new Layer x:i*10, y:i*10
		layer.clip = false
		layer.superLayer = lastLayer if lastLayer

		lastLayer = layer


	# console.timelineEnd("yo")
		# console.log layer



	# layer = new Layer backgroundColor:"red"

	# layer.on Events.Click, ->
	# 	ctx.reset()



ctx.run codeFunction
