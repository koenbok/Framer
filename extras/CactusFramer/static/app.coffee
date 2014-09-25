margin = 300

scrollingLayer = new Layer
	width:  window.innerWidth - margin
	height: window.innerHeight - margin

contentLayer = new Layer
	width:  scrollingLayer.width
	height: scrollingLayer.height * 3
	image: "http://goo.gl/gpEHNR"
	superLayer: scrollingLayer

scrollingLayer.center()
scrollingLayer.scrollVertical = true
