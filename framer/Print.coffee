Utils = require "./Utils"
{Context} = require "./Context"

"""

Todo:
- Better looks
- Resizable
- Live in own space on top of all Framer stuff

"""

printContext = null
printLayer = null

exports.print = (args...) ->

	if not printContext
		printContext = new Context(name:"Print")

	printContext.run ->

		if not printLayer

			printLayer = new Layer
			printLayer.scrollVertical = true
			printLayer.ignoreEvents = false
			printLayer.html = ""
			printLayer.style =
				"font": "12px/1.35em Menlo"
				"color": "rgba(0,0,0,.7)"
				"padding": "8px"
				"padding-bottom": "30px"
				"border-top": "1px solid #d9d9d9"

			printLayer.opacity = 0.9
			printLayer.style.zIndex = 999 # Always stay on top
			printLayer.visible = true
			printLayer.backgroundColor = "white"
			# printLayer.bringToFront()

			update = ->
				printLayer.width = window.innerWidth
				printLayer.height = 160
				printLayer.maxY = window.innerHeight

			update()

			printContext.domEventManager.wrap(window).addEventListener("resize", update)

		printPrefix = "» "
		printNode = document.createElement("div")
		printNode.innerHTML = _.escape(printPrefix + args.map((obj) -> Utils.inspect(obj)).join(", ")) + "<br>"
		printNode.style["-webkit-user-select"] = "text"
		printNode.style["cursor"] = "auto"

		printLayer._element.appendChild(printNode)

	Utils.delay 0, ->
		printLayer._element.scrollTop = printLayer._element.scrollHeight
