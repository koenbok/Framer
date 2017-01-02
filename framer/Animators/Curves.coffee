{BezierCurveAnimator} = require "./BezierCurveAnimator"
{computeDerivedCurveOptions} = require "./SpringCurveValueConverter"
{SpringRK4Animator} = require "./SpringRK4Animator"

console.log BezierCurveAnimator

SpringDefaults =

Bezier = (values...) ->
	(options) ->
		options.values = values
		new BezierCurveAnimator(options)


BezierDefaults =
	linear: Bezier(0, 0, 1, 1)
	ease: Bezier(.25, .1, .25, 1)
	easeIn: Bezier(.42, 0, 1, 1)
	easeOut: Bezier(0, 0, .58, 1)
	easeInOut: Bezier(.42, 0, .58, 1)


Spring = (dampingRatio, mass = 1, velocity = 0) ->
	(options) ->
		duration = options.time ? 1
		options = _.defaults computeDerivedCurveOptions(dampingRatio, duration, velocity, mass), options
		new SpringRK4Animator(options)

SpringVariants =
	tfv: (tension, friction, velocity = 0, tolerance = 1/100) ->
		(options) ->
			new SpringRK4Animator
				tension: tension
				friction: friction
				velocity: velocity
				tolerance: tolerance
	timed: Spring

_.assign Bezier, BezierDefaults
_.assign Spring, SpringVariants

exports.Spring = Spring
exports.Bezier = Bezier
exports.fromString = (string) ->
