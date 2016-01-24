{BaseClass} = require "./BaseClass"

class ScreenClass extends BaseClass
	
	@define "width",  get: -> Framer.CurrentContext.width
	@define "height", get: -> Framer.CurrentContext.height
	@define "size", get: -> Framer.CurrentContext.size
	@define "frame", get: -> Framer.CurrentContext.frame
	@define "canvasFrame", get: -> Framer.CurrentContext.canvasFrame

	@define "backgroundColor",
		importable: false
		exportable: false
		get: -> Framer.CurrentContext.backgroundColor
		set: (value) ->
			Framer.CurrentContext.backgroundColor = value

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

	toInspect: ->

		round = (value) ->
			if parseInt(value) == value
				return parseInt(value)
			return Utils.round(value, 1)

		return "<Screen #{round(@width)}x#{round(@height)}>"

	
# We use this as a singleton
exports.Screen = new ScreenClass