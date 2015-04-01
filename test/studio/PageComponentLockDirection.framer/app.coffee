# Test Page Component Horizontal Flicking

page = new PageComponent
	width:Framer.Device.screen.width,
	height:Framer.Device.screen.height
	backgroundColor:"#fff"

page.scrollVertical = false
page.directionLock = true

for index in [0..8]
	
	pageContent = new ScrollComponent
		width:  page.width
		height: page.height
		x: index * (page.width + 4)
		backgroundColor: Utils.randomColor(.5)
		superLayer: page.content
	
	pageContent.scrollHorizontal = false
	pageContent.directionLock = true
	
	rows = 10
	gutter = 2
	height = 200
	
	for rowIndex in [0..rows-1]
			
		cellLayer = new Layer
			width:  page.width
			height: height
			y: rowIndex * (height + gutter)
			superLayer: pageContent.content

		cellLayer.html = "#{rowIndex}"
		cellLayer.style =
			"font-size": "30px"
			"font-weight": "100"
			"text-align": "center"
			"line-height": "#{cellLayer.height}px"

