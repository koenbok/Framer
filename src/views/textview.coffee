{View} = require "./view"

class TextView extends View
	
	constructor: (args) ->
		super
		@text = args?.text or ""
		
	@define "text",
		get: -> @html
		set: (value) ->
			@html = value
	
	calculateSize: (options)->
		
		view = new TextView()
		view.text = @text
		
		styleOverride = 
			position: "absolute"
			height: "auto"
			width: "auto"
			backgroundColor: "rgba(0,255,0,.2)"
			visbility: "hidden"

		view.style = _.extend {}, @style, styleOverride

		frame = {x:-10000, y:-10000}
		
		options ?= {}
		
		if options.width
			frame.width = options.width
		if options.height
			frame.width = options.height

		view.frame = frame
		view.__insertElement()
		
		size =
			width: view._element.clientWidth
			height: view._element.clientHeight
		
		return size

exports.TextView = TextView