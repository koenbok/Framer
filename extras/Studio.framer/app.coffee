

grid = new GridComponent
	size: Screen

grid.renderCell = (layer) ->
	layer.image = Utils.randomImage() + "?cache=#{Date.now()}"