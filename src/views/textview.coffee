{View} = require "./view"

class exports.TextView extends View
	
	constructor: (args) ->
		super
		@text = args?.text or ""
		
	@define "text"
		get: -> @html
		set: (value) ->
			@html = value
	
	calculateSize: (options)->
		
		view = new exports.TextView()
		view.text = @text
		view.style = @style
		view.style["position"] = "relative"
		
		frame = {x:-10000, y:-10000}
		
		options ?= {}
		
		if options.width
			frame.width = options.width
		if options.height
			frame.width = options.height

		view.frame = frame
		view.insert()
		
		size =
			width: view.layer.element_.clientWidth
			height: view.layer.element_.clientHeight
		
		return size
	
	autoWidth: (extra) ->
		extra ?= 0
		size = @calculateSize(height:@frame.height)
		@frame.width = size.width + extra

	autoHeight: (extra) ->
		extra ?= 0
		size = @calculateSize(width:@frame.width)
		@frame.height = size.height + extra

