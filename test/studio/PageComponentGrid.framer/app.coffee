page = new PageComponent
	width: Screen.width - 20
	height: Screen.height - 20
	contentInset: {top: 200, left:200, right:200}
page.center()


rows = 3
cols = 3

gutter = 0

allLayers = []

for rowIndex in [0..rows-1]
	for colIndex in [0..cols-1]
		
		cellLayer = new Layer
			width:  page.width -  10
			height: page.height - 10
			x: colIndex * (page.width + gutter)
			y: rowIndex * (page.height + gutter)
			superLayer: page.content
			backgroundColor: Utils.randomColor()
		
		Utils.labelLayer cellLayer, "#{rowIndex}:#{colIndex}"
		
		allLayers.push(cellLayer)
		
		
page.snapToPage(allLayers[4], false)