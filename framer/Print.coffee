Utils = require "./Utils"
{Session} = require "./Session"

"""

Todo:
- Better looks
- Resizable
- Live in own space on top of all Framer stuff

"""

exports.print = (args...) ->
	
	printLayer = Session.printLayer

	if not printLayer

		printLayer = new Layer
		printLayer.scrollVertical = true
		printLayer.html = ""
		printLayer.style =
			"font": "12px/1.35em Menlo"
			"color": "rgba(0,0,0,.7)"
			"padding": "8px"
			"padding-bottom": "30px"
			"zIndex": 9999
			"border-top": "1px solid #ccc"
			"backgroundColor": "#fff"
		
		update = ->
			printLayer.width = window.innerWidth
			printLayer.height = 160
			printLayer.maxY = window.innerHeight
		
		update()
		
		Screen.on "resize", update
	
	printLayer.visible = true

	printLayer.html += "&raquo; #{args.map(Utils.stringify).join ', '}<br>"
	printLayer._element.scrollTop = printLayer._element.scrollHeight

	Session.printLayer = printLayer