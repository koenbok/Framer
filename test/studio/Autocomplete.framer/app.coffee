document.body.style.cursor = "auto"

OUTPUT = []

layer = new Layer
	size: Screen.size
	backgroundColor: "white"
	ignoreEvents: false

layer.scrollVertical = true

print = (args...) ->
	layer.html += args.join(" ") + "<br>"

framerObjects = [
	"Layer",
	"BackgroundLayer",
	"VideoLayer",
	"Animation",
	"ScrollComponent",
	"PageComponent",
	"SliderComponent",
	"DeviceComponent",
]

# All the Framer objects
for cls in framerObjects

	print ""
	print cls

	instance = new Framer[cls]
	
	keys = for k, v of instance
		continue if _.startsWith(k, "_")
		continue if _.startsWith(k, "get")
		continue if _.startsWith(k, "set")
		k
	
	print keys.join(" ")
		

layer.bringToFront()
Utils.delay .1, ->
	layer._element.scrollTop = layer._element.scrollHeight
	
layer.style =
	color: "black"
	font: "14px/1.5em Menlo"
	padding: "30px"
	"-webkit-user-select": "auto"
	"pointer-events": "auto"
	
layer._elementHTML.style["-webkit-user-select"] = "auto"