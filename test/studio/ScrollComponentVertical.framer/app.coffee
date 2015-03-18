scroll = new ScrollComponent
scroll.anchor([0,0,0,0])
scroll.scrollHorizontal = false
scroll.backgroundColor = null

rows = 40

gutter = 8
width  = scroll.width
height = 200

for rowIndex in [0..rows-1]
		
	cellLayer = new Layer
		width:  width
		height: height
		y: rowIndex * (height + gutter)
		backgroundColor: Utils.randomColor(.5)
		superLayer: scroll.content

	Utils.labelLayer cellLayer, rowIndex