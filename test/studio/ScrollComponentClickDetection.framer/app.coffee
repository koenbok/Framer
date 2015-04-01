# Verify that the click event does not get fired when scrolling


scroll = new ScrollComponent
scroll.size = Screen.size

scroll.scrollHorizontal = false
scroll.backgroundColor = null

rows = 40
width = Framer.Device.screen.width
gutter = 8
height = 200

for rowIndex in [0..rows-1]
		
	cellLayer = new Layer
		width:  width
		height: height
		y: rowIndex * (height + gutter)
		backgroundColor: Utils.randomColor(.5)
		superLayer: scroll.content
		
	cellLayer.on Events.Click, (event, layer) ->

		if not scroll.isMoving
			layer.scale = 1.5
			layer.animate
				properties: {scale:1}

	Utils.labelLayer cellLayer, rowIndex
