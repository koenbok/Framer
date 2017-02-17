Utils = require "./Utils"
{Context} = require "./Context"

class Printer

	constructor: ->
		@_context = new Context(name: "PrintConsole")
		@_context.run => Events.wrap(window).addEventListener("resize", @resize)

	createLayer: =>

		return @_printLayer if @_printLayer

		@_context.run =>
			@_container = new Layer
				backgroundColor: null
			@_container.style.zIndex = 999 # Always stay on top

			@_printLayer = new Layer
				parent: @_container

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
			@_printLayer.visible = true
			@_printLayer.backgroundColor = "white"

			@_closeButton = new Layer
				parent: @_container
				html: '<svg><g stroke="#B8B8B8"><path d="M1,1 L8,8"></path><path d="M1,8 L8,1"></path></g></svg>'
				y: 9
				width: 9
				height: 9
				backgroundColor: null
			@_closeButton.style["cursor"] = "auto"
			@_closeButton.onClick =>
				@hide()
		@resize()

		return @_printLayer

	resize: =>
		return unless @_printLayer
		@_container.width = window.innerWidth
		@_container.height = 160
		@_container.maxY = window.innerHeight

		@_printLayer.size = @_container.size
		@_closeButton.maxX = @_container.maxX - @_closeButton.y + 1

	hide: ->
		@_context.visible = false

	print: (args...) =>

		@createLayer()
		@_context.visible = true
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
