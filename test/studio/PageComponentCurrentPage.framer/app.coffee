# Test Page Component Horizontal Flicking

page = new PageComponent width:Framer.Device.screen.width, height:Framer.Device.screen.height, backgroundColor:"#fff"
page.scrollVertical = false

for index in [0..30]
	pageContent = new Layer
		width:  page.width
		height: page.height
		x: index * (page.width + 4)
		backgroundColor: Utils.randomColor(.5)
		superLayer: page.content

	pageContent.html = "#{index}"
	pageContent.style = {
		"font-size" : "100px"
		"font-weight" : "100"
		"text-align" : "center"
		"line-height" : "#{Framer.Device.screen.height}px"
		}

page.on Events.Move, ->
	print "closestPage", page.closestPage
	print "currentPage", page.currentPage
	print "previousPage", page.previousPage
	
button = new Layer
	y: 20
	width: 120
	height: 30
button.centerX()
Utils.labelLayer(button, "previous")

button.on Events.Click, ->
	page.snapToPreviousPage()