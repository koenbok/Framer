scroll = new ScrollComponent
scroll.size = Screen.size
scroll.scrollHorizontal = false
scroll.backgroundColor = null
scroll.contentInset = {top:Screen.height / 2}

rows = 40

gutter = 0
width  = scroll.width
height = 200

for rowIndex in [0..rows-1]
		
	cellLayer = new Layer
		width:  width
		height: height
		y: rowIndex * (height + gutter)
		backgroundColor: Utils.randomColor(.98)
		superLayer: scroll.content

	Utils.labelLayer cellLayer, rowIndex


scroll.on Events.Move, ->
	print scroll.scrollPoint
	
Utils.delay 1, ->
	scroll.scrollY = 100