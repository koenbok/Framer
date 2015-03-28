page = new PageComponent
	width: Screen.width - 200
	height: Screen.height - 200
page.center()


rows = 3
cols = 3

gutter = 0

for rowIndex in [0..rows-1]
	for colIndex in [0..cols-1]
		
		cellLayer = new Layer
			width:  page.width -  100
			height: page.height - 100
			x: colIndex * (page.width + gutter)
			y: rowIndex * (page.height + gutter)
			superLayer: page.content
			backgroundColor: Utils.randomColor()
		
		Utils.labelLayer cellLayer, "#{rowIndex}:#{colIndex}"