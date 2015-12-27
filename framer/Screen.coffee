{BaseClass} = require "./BaseClass"

class ScreenClass extends BaseClass
	
	@define "width",  get: -> Framer.CurrentContext.width
	@define "height", get: -> Framer.CurrentContext.height
	@define "size", get: -> {width:@width, height:@height}
	@define "frame", get: -> {x:0, y:0, width:@width, height:@height}

	# Todo: maybe resize based on parent layer

	toInspect: ->

		round = (value) ->
			if parseInt(value) == value
				return parseInt(value)
			return Utils.round(value, 1)

		return "<Screen #{round(@width)}x#{round(@height)}>"

	
# We use this as a singleton
exports.Screen = new ScreenClass