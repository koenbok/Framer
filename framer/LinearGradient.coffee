{_} = require "./Underscore"
{BaseClass} = require "./BaseClass"
{Color} = require "./Color"

class exports.LinearGradient extends BaseClass
	constructor: (options = {}) ->
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

	toCSS: () =>
		return "linear-gradient(#{this.angle}deg, #{this.start}, #{this.end})"
	
	mix: (gradientB, fraction) =>
		return LinearGradient.mix(@, gradientB, fraction)

	isEqual: (gradientB) ->
		return LinearGradient.equal(@, gradientB)

	toInspect: =>
		return "<#{@constructor.name} start:#{@start} end:#{@end} angle:#{@angle}>"

	##############################################################
	## Class methods

	@mix: (gradientA, gradientB, fraction = 0.5) ->
		fraction = Utils.clamp(fraction, 0, 1)
		start = Color.mix(gradientA.start, gradientB.start, fraction)
		end = Color.mix(gradientA.end, gradientB.end, fraction)

		startAngle = gradientA.angle
		endAngle = gradientB.angle
		normalizer = Utils.rotationNormalizer()
		normalizer(startAngle)
		endAngle = normalizer(endAngle)
		angle = startAngle + (endAngle - startAngle) * fraction

		return new LinearGradient
			start: start
			end: end
			angle: angle

	@random: () ->
		hue = Math.random() * 360
		colorA = new Color h: hue
		colorB = new Color h: hue + 40
		return new LinearGradient
			start: colorA
			end: colorB
			angle: Math.random() * 360

	@isLinearGradient: (gradient) -> return gradient instanceof LinearGradient

	@equal: (gradientA, gradientB) ->
		return false unless LinearGradient.isLinearGradient(gradientA)
		return false unless LinearGradient.isLinearGradient(gradientB)
		equalAngle = Math.abs(gradientA.angle - gradientB.angle) % 360 is 0
		equalStart = Color.equal(gradientA.start, gradientB.start)
		equalEnd = Color.equal(gradientA.end, gradientB.end)
		return equalAngle and equalStart and equalEnd