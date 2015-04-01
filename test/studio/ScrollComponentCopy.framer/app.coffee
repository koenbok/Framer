scroll = new ScrollComponent
	width: Screen.width / 4
	height:Screen.height / 1.2
scroll.centerX(-Screen.width/6)
scroll.centerY()
	
scroll.scrollHorizontal = false
scroll.backgroundColor = null

rows = 40

gutter = 2
width  = scroll.width
height = 80

for rowIndex in [0..rows-1]
		
	cellLayer = new Layer
		width:  width
		height: height
		y: rowIndex * (height + gutter)
		backgroundColor: Utils.randomColor(.5)
		superLayer: scroll.content

	
	
scrollCopy = scroll.copy()
scroll.centerX(Screen.width/6)
scroll.centerY()
