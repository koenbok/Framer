layer = new Layer

layer.on Events.MouseOver, (event, layer) ->
	layer.backgroundColor = "red"

layer.on Events.MouseOut, (event, layer) ->
	layer.backgroundColor = "green"