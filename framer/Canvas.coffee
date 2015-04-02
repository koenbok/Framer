{BaseClass} = require "./BaseClass"
{Events} = require "./Events"

class CanvasClass extends BaseClass
	
	@define "width",  get: -> window.innerWidth
	@define "height", get: -> window.innerHeight
	@define "size", get: -> {width:@width, height:@height}
	@define "frame", get: -> {x:0, y:0, width:@width, height:@height}

	addListener: (eventName, listener) =>
		if eventName is "resize"
			Events.wrap(window).addEventListener "resize", =>
				@emit("resize")
		
		super(eventName, listener)

	on: @::addListener
	
# We use this as a singleton
exports.Canvas = new CanvasClass