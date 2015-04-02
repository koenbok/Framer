makeTest = (frame, originX, originY) ->
	
	
	scroll = new ScrollComponent
		frame: frame
	
	scroll.scale = .3
	scroll.clip = false

	scroll.backgroundColor = Utils.randomColor(.6)
	# scroll.content.backgroundColor = "rgba(255,0,0,.7)"
	
	rows = 8
	cols = 8
	
	gutter = 40
	width  = frame.width * .75
	height = frame.width * .75
	
	layers = []
	
	for rowIndex in [0..rows-1]
		for colIndex in [0..cols-1]
			
			cellLayer = new Layer
				width:  width
				height: height
				x: colIndex * (width + gutter)
				y: rowIndex * (height + gutter)
				superLayer: scroll.content
				backgroundColor: Utils.randomColor(.1)
			
			layers.push(cellLayer)
			
			Utils.labelLayer cellLayer, "#{rowIndex}:#{colIndex}"
			
# 			cellLayer.on Events.Click, (event, layer) ->
# 				Utils.delay 0.1, ->
# 					# print "hello", layer, scroll, originX, originY
# 					scroll.scrollToLayer(layer, originX, originY)
	
	Utils.interval 3, ->	
		scroll.scrollToLayer(layers[_.random(0, layers.length-1)], originX, originY)
		
		

# makeTest({x:0, y:0, width:Screen.width/2, height:Screen.height/2}, 0, 0)
# makeTest({x:Screen.width/2, y:0, width:Screen.width/2, height:Screen.height/2}, 1, 0)
# makeTest({x:0, y:Screen.height/2, width:Screen.width/2, height:Screen.height/2}, 0, 1)
# makeTest({x:Screen.width/2, y:Screen.height/2, width:Screen.width/2, height:Screen.height/2}, 1, 1)

makeTest({x:0, y:0, width:Screen.width, height:Screen.height}, .5, .5)

