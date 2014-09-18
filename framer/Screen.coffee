{BaseClass} = require "./BaseClass"

class ScreenClass extends BaseClass
	
	@define "width",  get: -> window.innerWidth
	@define "height", get: -> window.innerHeight

	addListener: (eventName, listener) =>
		
		if eventName is "resize"
			Framer.CurrentContext.eventManager.wrap(window).addEventListener "resize", =>
				@emit("resize")
		
		super(eventName, listener)

	on: @::addListener
	
# We use this as a singleton
exports.Screen = new ScreenClass