{BezierCurveAnimator} = require "./BezierCurveAnimator"
{computeDerivedCurveOptions, computeDuration} = require "./SpringCurveValueConverter"
{SpringRK4Animator} = require "./SpringRK4Animator"

Bezier = (values...) ->
	(options = {}) ->
		options.values = values
		new BezierCurveAnimator(options)

BezierDefaults =
	linear: Bezier(0, 0, 1, 1)
	ease: Bezier(.25, .1, .25, 1)
	easeIn: Bezier(.42, 0, 1, 1)
	easeOut: Bezier(0, 0, .58, 1)
	easeInOut: Bezier(.42, 0, .58, 1)


Spring = (dampingRatio = 0.5, mass = 1, velocity = 0) ->
	if not _.isFinite(dampingRatio) and typeof dampingRatio is 'object'
		argumentObject = dampingRatio
		dampingRatio = null
		if (argumentObject.damping? or argumentObject.dampingRatio?)
			dampingRatio = argumentObject.dampingRatio ? argumentObject.damping
		if argumentObject.mass?
			mass = argumentObject.mass
		if argumentObject.velocity?
			velocity = argumentObject.velocity
	return (options) ->
		if dampingRatio?
			duration = options?.time ? 1
			derivedOptions = computeDerivedCurveOptions(dampingRatio, duration, velocity, mass)
		else
			delete options?.time
			derivedOptions = argumentObject
		options = _.defaults derivedOptions, options
		animator = new SpringRK4Animator(options)
		if duration?
			animator.time = duration
		animator

_.assign Bezier, BezierDefaults
Spring.computeDerivedCurveOptions = computeDerivedCurveOptions
Spring.computeDuration = computeDerivedCurveOptions

exports.Spring = Spring
exports.Bezier = Bezier
exports.fromString = (string) ->
	return null unless _.isString string
	func = Utils.parseFunction(string)
	args = func.args.map(parseFloat)
	switch func.name
		when "linear" then Bezier.linear
		when "ease" then Bezier.ease
		when "ease-in" then Bezier.easeIn
		when "ease-out" then Bezier.easeOut
		when "ease-in-out" then Bezier.easeInOut
		when "bezier-curve", "cubic-bezier"
			Bezier(args...)
		when "spring", "spring-rk4", "spring-tfv"
			pairs = _.zip(["tension", "friction", "velocity", "tolerance"], args)
			object = _.fromPairs(pairs)
			Spring(object)
		when "spring-dd"
			Spring(args...)
		else
			return Bezier.linear
