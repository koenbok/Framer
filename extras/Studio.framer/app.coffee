if not Utils.isFramerStudio()
	Framer.Extras.Preloader.enable()
	Framer.Extras.Hints.enable()

layer = new Layer
	size: Screen

layer.onTap (e) ->
	print Screen
	print e.point
	
	point = Utils.convertPoint(e.point, null, Framer.CurrentContext, true)
	
	new Layer
		midX: point.x
		midY: point.y
		











# 
# nav = new NavComponent
# 
# grid = new GridComponent
# 	width: Screen.width * 2
# 	height: Screen.height * 2
# 	rows: 10
# 	columns: 10
# 
# nav.push(grid)
# 
# grid.renderCell = (layer) ->
# 	layer.image = Utils.randomImage(layer) + "?date=#{Date.now()}"
# 
# 	layer.onClick ->
# 		
# 		large = new Layer
# 			size: Utils.frameInset(nav, 80)
# 			image: @image
# 					
# 		large.onTap ->
# 			nav.back()
# 		
# 		nav.modal(large)
# 
