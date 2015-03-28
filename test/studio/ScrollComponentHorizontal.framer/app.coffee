scroll = new ScrollComponent
scroll.size = Screen.size
scroll.scrollVertical = false
scroll.backgroundColor = null

rows = 40

gutter = 8
width  = 100
height = scroll.height

for rowIndex in [0..rows-1]
		
	cellLayer = new Layer
		width:  width
		height: height
		x: rowIndex * (width + gutter)
		backgroundColor: Utils.randomColor(.5)
		superLayer: scroll.content

	Utils.labelLayer cellLayer, rowIndex