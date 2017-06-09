{Context} = require "../Context"

class Hints

	constructor: ->

		@_context = new Framer.Context(name: "Hints")
		@_context.index = 10000

		@_context.run =>
			# Events.TouchStart and TouchEnd are mapped to Mouse or Pointer events automatically
			Events.wrap(document).addEventListener(Events.TouchStart, @_handleDown, capture=true)
			Events.wrap(document).addEventListener(Events.TouchEnd, @_handleUp, capture=true)

	_handleDown: (event) =>
		return if @_isPreloading()
		@_target = event.target

	_handleUp: (event) =>
		return if @_isPreloading()

		# See what layer we actually tapped
		layer = Framer.CurrentContext.layerForElement(@_target)

		# If this is not a layer in this context, we see if it belongs
		# to another. If so we don't really have to throw a hint, because
		# you are very likely clicking on print or share info.
		if not layer
			for context in Context.all()
				continue if context is Framer.DefaultContext
				continue if context is Framer.CurrentContext
				return if context.layerForElement(@_target)

		# If this is a layer with interaction, we do not show any hints
		if layer and layer.willSeemToDoSomething()
			return

		@showHints()

	_isPreloading: ->
		return Framer.Preloader?.isLoading is true

	showHints: ->
		context = Framer.CurrentContext
		@_context.run -> _.invokeMap(context.rootLayers, "_showHint")

	destroy: ->
		@_context.destroy()

hints = null

exports.enable = ->
	hints ?= new Hints(Framer.CurrentContext)

exports.disable = ->
	return unless hints
	hints.destroy()
	hints = null

exports.showHints = ->
	return unless hints
	Utils.delay 0.5, -> hints.showHints()
