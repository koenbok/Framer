Utils = require "./Utils"
{Context} = require "./Context"

class Printer

	constructor: ->
		@_context = new Context(name:"Print")
		@_context.run => Events.wrap(window).addEventListener("resize", @resize)

	createLayer: =>
		
		return @_printLayer if @_printLayer
		
		@_context.run =>

			@_printLayer = new Layer
			@_printLayer.scrollVertical = true
			@_printLayer.ignoreEvents = false
			@_printLayer.html = ""
			@_printLayer.style =
				"font": "12px/1.35em Menlo"
				"color": "rgba(0, 0, 0, .7)"
				"padding": "8px"
				"padding-bottom": "30px"
				"border-top": "1px solid #d9d9d9"

			@_printLayer.opacity = 0.9
			@_printLayer.style.zIndex = 999 # Always stay on top
			@_printLayer.visible = true
			@_printLayer.backgroundColor = "white"

		@resize()

		return @_printLayer

	resize: =>
		return unless @_printLayer
		@_printLayer.width = window.innerWidth
		@_printLayer.height = 160
		@_printLayer.maxY = window.innerHeight

	print: (args...) =>
		
		@createLayer()

		printPrefix = "» "
		
		printNode = document.createElement("div")
		printNode.style["-webkit-user-select"] = "text"
		printNode.style["cursor"] = "auto"
		printNode.innerHTML = _.escape(printPrefix + args.map((obj) -> Utils.inspect(obj)).join(", ")) + "<br>"
		
		@_printLayer._element.appendChild(printNode)

		@scrollToBottom()
		Utils.delay(0, @scrollToBottom)

	scrollToBottom: =>
		return unless @_printLayer
		@_printLayer._element.scrollTop = @_printLayer._element.scrollHeight

_printer = null

exports.print = (args...) ->
	_printer ?= new Printer
	_printer.print(args...)
