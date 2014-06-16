{BaseClass} = require "./BaseClass"

class ScreenClass extends BaseClass
	
	constructor: (options) ->
		super options
		@_setupResizeListener()
	
	@define "width",  get: -> window.innerWidth
	@define "height", get: -> window.innerHeight
	
	_setupResizeListener: ->
		
		oldResizeFunction = window.onresize
		
		window.onresize = =>
			@emit "resize", @
			oldResizeFunction?()
	
# We use this as a singleton
exports.Screen = new ScreenClass