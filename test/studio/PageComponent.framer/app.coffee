page = new PageComponent width:400, height:600, backgroundColor:"#fff"
page.center()
page.scrollVertical = false

for index in [0..10]
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
		"line-height" : "600px"
		}