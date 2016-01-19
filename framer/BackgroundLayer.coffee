{Layer} = require "./Layer"

"""
Todo: make it work in a parent layer
"""

class exports.BackgroundLayer extends Layer
	
	constructor: (options={}) ->
		
		options.backgroundColor ?= "#fff"
		
		super options
		
		@sendToBack()
		@backgroundLayout()
		@_context.domEventManager.wrap(window).addEventListener("resize", @backgroundLayout)
	
	backgroundLayout: =>
		if @parent
			@frame = @parent.frame
		else
			@frame = @_context.frame