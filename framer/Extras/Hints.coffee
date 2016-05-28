class Hints

	constructor: ->

		@_context = new Framer.Context(name:"Hints")
		@_context._element.style.zIndex = 1000000

		@_context.run =>
			if Utils.isTouch()
				Events.wrap(document).addEventListener("touchstart", @_handleDown)
				Events.wrap(document).addEventListener("touchend", @_handleUp)
			else
				Events.wrap(document).addEventListener("mousedown", @_handleDown)
				Events.wrap(document).addEventListener("mouseup", @_handleUp)

	_handleDown: (event) =>
		@_target = event.target

	_handleUp: (event) =>

		layer = Framer.CurrentContext.layerForElement(@_target)

		# If this is a layer with interaction, we do not show any hints
		if layer and layer.willSeemToDoSomething(layer)
			return

		@showHints()

	showHints: ->
		context = Framer.CurrentContext
		@_context.run => _.invokeMap(context.rootLayers, "_showHint")

	destroy: ->
		@_context.destroy()

hints = null

exports.enable = ->
	hints ?= new Hints(Framer.CurrentContext)

exports.disable = ->
	return unless hints
	hints.destroy()
	hints = null
