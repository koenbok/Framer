



nav = new NavComponent

grid = new GridComponent
	width: Screen.width * 2
	height: Screen.height * 2
	rows: 10
	columns: 10

nav.push(grid)

grid.renderCell = (layer) ->
	layer.image = Utils.randomImage(layer)

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




	
# photo = new Layer
# 	width: 1400
# 	height: 933
# 	image: "images/photo.jpg"
# 
# photo.draggable.enabled = true

cover = new Layer
	size: Screen
	backgroundColor: Color.grey(0, 1)

progress = new CircularProgressComponent
	parent: cover
	point: Align.center()


progress.strokeWidth = 1
# progress.railsColor = Color.grey(1, 1)
# progress.progressColor = Color.grey(0, 0.5)

imageLayers = _.filter Framer.CurrentContext.layers, (layer) ->
	layer.image

counter = 0

for imageLayer in imageLayers
	Utils.loadImage imageLayer.image, ->
		counter += 1
		progress.setProgress counter / imageLayers.length
		
		
		
		if counter is imageLayers.length
			cover.destroy()
# 			cover.animate
# 				properties:
# 					opacity: 0
# 				time: 0.4
# 				delay: 1.3
