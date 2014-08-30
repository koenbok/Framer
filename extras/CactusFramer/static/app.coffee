layer = new Layer width:500, height:500

layer.x = 100


ctx = new Framer.Context rootElement:layer._element

codeFunction = ->
	layer = new Layer backgroundColor:"red"

	layer.on Events.Click, ->
		ctx.reset()




ctx.run codeFunction
