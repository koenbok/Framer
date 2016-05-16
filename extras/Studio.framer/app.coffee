nav = new NavComponent

grid = new GridComponent
	width: Screen.width
	height: Screen.height * 2
	rows: 8
	columns: 3

nav.push(grid)

grid.renderCell = (layer) ->
	
	layer.image = Utils.randomImage(layer)

	layer.onClick ->
		
		large = new Layer
			size: Utils.frameInset(nav, 80)
			image: @image
					
		large.onTap ->
			nav.back()
		
		nav.modal(large)


