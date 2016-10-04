AnimatorClasses = {}

AnimatorClassBezierPresets = ["ease", "ease-in", "ease-out", "ease-in-out"]

class exports.Animator

	"""
	The animator class is a very simple class that
		- Takes a set of input values at setup({input values})
		- Emits an output value for progress (0 -> 1) in value(progress)
	"""

	constructor: (options={}) ->
		@setup options

	setup: (options) ->
		throw Error "Not implemented"

	next: (delta) ->
		throw Error "Not implemented"

	finished: ->
		throw Error "Not implemented"

	values: (delta=1/60, limit=100)->
		values = []
		for i in [0..limit]
			values.push(@next(delta))
			if @finished()
				break
		return values

	@classForCurve: (curve) ->
		parsedCurve = Utils.parseFunction(curve)
		animatorClassName = parsedCurve.name.toLowerCase()

		if AnimatorClasses.hasOwnProperty(animatorClassName)
			return AnimatorClasses[animatorClassName]

		if animatorClassName in AnimatorClassBezierPresets
			return BezierCurveAnimator

		return null

	@curveOptionsFor: (options={}) ->
		curveOptions = options.curveOptions ? {}
		animatorClass = @classForCurve(options.curve)
		parsedCurve = Utils.parseFunction options.curve
		animatorClassName = parsedCurve.name.toLowerCase()

		# This is for compatibility with the direct Animation.time argument. This should
		# ideally also be passed as a curveOption

		if animatorClass in [LinearAnimator, BezierCurveAnimator]
			if _.isString(curveOptions) or _.isArray(curveOptions)
				curveOptions =
					values: curveOptions

			curveOptions.time ?= options.time

		# Support ease-in etc
		if animatorClass in [BezierCurveAnimator] and animatorClassName in AnimatorClassBezierPresets
			curveOptions.values = animatorClassName
			curveOptions.time ?= options.time

		# All this is to support curve: "spring(100, 20, 10)". In the future we'd like people
		# to start using curveOptions: {tension:100, friction:10} etc

		if parsedCurve.args.length

			# console.warn "Animation.curve arguments are deprecated. Please use Animation.curveOptions"

			if animatorClass is BezierCurveAnimator
				curveOptions.values = parsedCurve.args.map (v) -> parseFloat(v) or 0

			if animatorClass is SpringRK4Animator
				for k, i in ["tension", "friction", "velocity", "tolerance"]
					value = parseFloat parsedCurve.args[i]
					curveOptions[k] = value if value

			if animatorClass is SpringDHOAnimator
				for k, i in ["stiffness", "damping", "mass", "tolerance"]
					value = parseFloat parsedCurve.args[i]
					curveOptions[k] = value if value
		return curveOptions

	# start: -> Framer.Loop.on("update", )
	# stop: -> AnimationLoop.remove @

{LinearAnimator} = require "./Animators/LinearAnimator"
{BezierCurveAnimator} = require "./Animators/BezierCurveAnimator"
{SpringRK4Animator} = require "./Animators/SpringRK4Animator"
{SpringDHOAnimator} = require "./Animators/SpringDHOAnimator"
AnimatorClasses["linear"] = LinearAnimator
AnimatorClasses["bezier-curve"] = BezierCurveAnimator
AnimatorClasses["spring-rk4"] = SpringRK4Animator
AnimatorClasses["spring-dho"] = SpringDHOAnimator

AnimatorClasses["spring"] = AnimatorClasses["spring-rk4"]
AnimatorClasses["cubic-bezier"] = AnimatorClasses["bezier-curve"]
