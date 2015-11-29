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
	
	layout: =>
	
		if @superLayer
			@frame = {x:0, y:0, width:@superLayer.width, height:@superLayer.height}
		else if @_context._parentLayer
			@frame = {x:0, y:0, width:@_context._parentLayer.width, height:@_context._parentLayer.height}
		else
			@frame = {x:0, y:0, width:window.innerWidth, height:window.innerHeight}