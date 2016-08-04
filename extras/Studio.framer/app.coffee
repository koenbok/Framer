# Framer.Extras.Hints.disable()

Framer.Info =
	title: ""
	author: "Koen Bok"
	twitter: ""
	description: ""

# Framer.Extras.Preloader.enable()

grid = new GridComponent
	size: Screen

grid.renderCell = (layer) ->
	layer.image = Utils.randomImage(layer) + "cache=#{Date.now()}"
	
	layer.onTap ->