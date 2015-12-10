{BaseClass} = require "./BaseClass"

class ScreenClass extends BaseClass
	
	@define "width",  get: -> Framer.CurrentContext.width
	@define "height", get: -> Framer.CurrentContext.height
	@define "size", get: -> {width:@width, height:@height}
	@define "frame", get: -> {x:0, y:0, width:@width, height:@height}

	@define "perspective",
		importable: false
		exportable: false
		get: -> Framer.CurrentContext.perspective
		set: (value) ->
			Framer.CurrentContext.perspective = value

	@define "perspectiveOriginX",
		importable: false
		exportable: false
		get: -> Framer.CurrentContext.perspectiveOriginX
		set: (value) ->
			Framer.CurrentContext.perspectiveOriginX = value

	@define "perspectiveOriginY",
		importable: false
		exportable: false
		get: -> Framer.CurrentContext.perspectiveOriginY
		set: (value) ->
			Framer.CurrentContext.perspectiveOriginY = value

	# Todo: maybe resize based on parent layer
	
# We use this as a singleton
exports.Screen = new ScreenClass