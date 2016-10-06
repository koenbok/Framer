Utils = require "./Utils"
{Context} = require "./Context"

class Printer

	constructor: ->
		@_context = new Context(name:"PrintConsole")
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
				html: '<svg><g><path d="M6.73184358,5 L10,1.73184358 L8.26815642,0 L5,3.26815642 L1.73184358,0 L0,1.73184358 L3.26815642,5 L0,8.26815642 L1.73184358,10 L5,6.73184358 L8.26815642,10 L10,8.26815642 L6.73184358,5 Z" fill="#BDBDBD"></path></g></svg>'
				y: 6
				width: 10
				height: 10
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
		@_closeButton.maxX = @_container.maxX - @_closeButton.y

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
