# Test Page Component Vertical Flicking

page = new PageComponent
	width:Framer.Device.screen.width
	height:Framer.Device.screen.height
	backgroundColor:"#fff"
page.scrollHorizontal = false

for index in [0..30]
	pageContent = new Layer
		width:  page.width
		height: page.height
		y: index * (page.height + 4)
		backgroundColor: Utils.randomColor(.5)
		superLayer: page.content

	pageContent.html = "#{index}"
	pageContent.style = {
		"font-size" : "100px"
		"font-weight" : "100"
		"text-align" : "center"
		"line-height" : "#{Framer.Device.screen.height}px"
		}

# page.velocityMultiplier = 50

Utils.interval 0.5, ->
	page.snapToNextPage("bottom")
