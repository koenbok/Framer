{Layer} = require "./Layer"

"""
Todo: make it work in a parent layer
"""

class exports.BackgroundLayer extends Layer
	
	constructor: (options={}) ->
		
		options.backgroundColor ?= "#fff"
		options.name = "Background"
		
		super options
		
		@sendToBack()
		@layout()
		
		Screen.on "resize", @layout
	
	layout: =>
		@width =  Screen.width
		@height = Screen.height