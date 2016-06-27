{Layer} = require "./Layer"

"""
Todo: make it work in a parent layer
"""

class exports.BackgroundLayer extends Layer

	constructor: (options={}) ->

		options.backgroundColor ?= "#fff"

		super options

		@sendToBack()
		@layout()
		@_context.domEventManager.wrap(window).addEventListener("resize", @layout)
		Framer.Device.on("change:orientation", @layout)

	layout: =>
		if @parent
			@frame = @parent.frame
		else
			@frame = @_context.frame
