{BezierCurveAnimator} = require "./BezierCurveAnimator"
{computeDerivedCurveOptions, computeDuration, computeDampingRatio} = require "./SpringCurveValueConverter"
{SpringRK4Animator} = require "./SpringRK4Animator"
{Defaults} = require "../Defaults"

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

Spring = (dampingRatio, mass, velocity) ->
	curveOptions = {}
	if dampingRatio? and _.isFinite(dampingRatio)
		curveOptions.dampingRatio = dampingRatio
	if mass?
		curveOptions.mass = mass
	if velocity?
		curveOptions.velocity = velocity
	if not _.isFinite(dampingRatio) and typeof dampingRatio is 'object'
		curveOptions = dampingRatio
		if curveOptions.damping? and not curveOptions.dampingRatio?
			curveOptions.dampingRatio = curveOptions.damping
	if not curveOptions.tension? and not curveOptions.friction?
		curveOptions = Defaults.getDefaults "Spring", curveOptions


	return (options) ->
		if curveOptions.dampingRatio?
			duration = options?.time ? 1
			derivedOptions = computeDerivedCurveOptions(curveOptions.dampingRatio, duration, curveOptions.velocity, curveOptions.mass)
			curveOptions = _.defaults derivedOptions, curveOptions
		else
			delete options?.time
		options = _.defaults curveOptions, options
		animator = new SpringRK4Animator(options)
		if duration?
			animator.time = duration
		animator

_.assign Bezier, BezierDefaults
Spring.computeDerivedCurveOptions = computeDerivedCurveOptions
Spring.computeDuration = computeDuration
Spring.computeDampingRatio = computeDampingRatio


exports.Spring = Spring
exports.Bezier = Bezier
parseFunction = (string) ->
	return null unless _.isString string

	# This parses functions with or without arguments like Bezier(0.1, 0.2, 0.3, 0.4) and Spring(damping: 0.5)
	regex = /.*(Spring|Bezier)(?:\(\s*{?([\w:\s,.]*)}?\s*\)|\.(\w+))?/
	matches = regex.exec(string)
	return null unless matches?
	[match, type, args, prop] = matches
	result = {name: type, property: null, arguments: null}
	if prop?
		result.property = prop
		return result
	if not args?
		return result
	if args.length is 0
		result.arguments = []


	argumentsRegex = /\s*([\w]+)\s*:\s*([\d.]+)\s*,?/g
	argumentObject = {}
	while matches = argumentsRegex.exec(args)
		[match, property, value] = matches
		value = parseFloat(value)
		if not isNaN(value)
			argumentObject[property] = value
	if _.size(argumentObject) > 0
		result.arguments = argumentObject
		return result

	numbersRegex = /\s*([.\d]+)\s*/g
	numbers = []
	while matches = numbersRegex.exec(args)
		[match, value] = matches
		value = parseFloat(value)
		numbers.push(value)
	result.arguments = numbers
	return result

fromDefinition = (definition) ->
	return null unless definition?
	curve = Framer.Curves[definition.name]
	return null unless curve?

	if definition.property?
		return curve[definition.property]
	if not definition.arguments?
		return curve

	if _.isArray(definition.arguments)
		return curve(definition.arguments...)

	return curve(definition.arguments)

exports.parseFunction = parseFunction
exports.fromDefinition = fromDefinition
exports.fromString = (string) ->
	return null unless _.isString string
	func = fromDefinition(parseFunction(string))
	if func?
		return func
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
		when "spring", "spring-rk4", "spring-dho"
			pairs = _.zipWith(["tension", "friction", "velocity", "tolerance"], args, [250, 25, 0, 1 / 100], (key, value, defaults) -> [key, value ? defaults])
			object = _.fromPairs(pairs)
			Spring(object)
		else
			return Bezier.linear
