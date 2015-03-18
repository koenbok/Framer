# Verify that the click event does not get fired when scrolling


background = new Layer
	width: Screen.width
	height: 400
	image: "https://ununsplash.imgix.net/photo-1423753623104-718aaace6772"

scroll = new ScrollComponent
scroll.anchor([0,0,0,0])
scroll.scrollHorizontal = false
scroll.backgroundColor = null
scroll.contentInset = {top:background.height}

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