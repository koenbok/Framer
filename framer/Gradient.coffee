{_} = require "./Underscore"
{BaseClass} = require "./BaseClass"
{Color} = require "./Color"

class exports.Gradient extends BaseClass
	constructor: (options = {}) ->

		if options instanceof Gradient then return options

		options.start ?= "black"
		options.end ?= "white"
		options.angle ?= 0
		super options

	@define "start",
		get: -> @_start
		set: (value) ->
			@_start = new Color(value)

	@define "end",
		get: -> @_end
		set: (value) ->
			@_end = new Color(value)

	@define "angle",
		get: -> @_angle
		set: (value) ->
			@_angle = value if _.isNumber(value)

	toCSS: =>
		return "linear-gradient(#{this.angle}deg, #{this.start}, #{this.end})"

	mix: (gradientB, fraction, model) =>
		return Gradient.mix(@, gradientB, fraction, model)

	isEqual: (gradientB) ->
		return Gradient.equal(@, gradientB)

	toInspect: =>
		return "<#{@constructor.name} start:#{@start} end:#{@end} angle:#{@angle}>"

	##############################################################
	## Class methods

	@mix: (gradientA, gradientB, fraction = 0.5, model) ->
		fraction = Utils.clamp(fraction, 0, 1)
		start = Color.mix(gradientA.start, gradientB.start, fraction, false, model)
		end = Color.mix(gradientA.end, gradientB.end, fraction, false, model)

		startAngle = gradientA.angle
		endAngle = gradientB.angle
		normalizer = Utils.rotationNormalizer()
		normalizer(startAngle)
		endAngle = normalizer(endAngle)
		angle = startAngle + (endAngle - startAngle) * fraction

		return new Gradient
			start: start
			end: end
			angle: angle

	@random: ->
		hue = Math.random() * 360
		colorA = new Color h: hue
		colorB = new Color h: hue + 40
		return new Gradient
			start: colorA
			end: colorB
			angle: Math.random() * 360

	@isGradient: (gradient) -> return gradient instanceof Gradient

	@equal: (gradientA, gradientB) ->
		return false unless Gradient.isGradient(gradientA)
		return false unless Gradient.isGradient(gradientB)
		equalAngle = Math.abs(gradientA.angle - gradientB.angle) % 360 is 0
		equalStart = Color.equal(gradientA.start, gradientB.start)
		equalEnd = Color.equal(gradientA.end, gradientB.end)
		return equalAngle and equalStart and equalEnd

	@_asPlainObject: (gradient) ->
		_.pick(gradient, ["start", "end", "angle"])
