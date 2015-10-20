{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{Defaults} = require "./Defaults"
{EventEmitter} = require "./EventEmitter"

{LinearAnimator} = require "./Animators/LinearAnimator"
{BezierCurveAnimator} = require "./Animators/BezierCurveAnimator"
{SpringRK4Animator} = require "./Animators/SpringRK4Animator"
{SpringDHOAnimator} = require "./Animators/SpringDHOAnimator"

AnimatorClasses =
	"linear": LinearAnimator
	"bezier-curve": BezierCurveAnimator
	"spring-rk4": SpringRK4Animator
	"spring-dho": SpringDHOAnimator

AnimatorClasses["spring"] = AnimatorClasses["spring-rk4"]
AnimatorClasses["cubic-bezier"] = AnimatorClasses["bezier-curve"]

AnimatorClassBezierPresets = ["ease", "ease-in", "ease-out", "ease-in-out"]

numberRE = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/
relativePropertyRE = new RegExp('^(?:([+-])=|)(' + numberRE.source + ')([a-z%]*)$', 'i')

isRelativeProperty = (v) ->
	_.isString(v) and relativePropertyRE.test(v)

evaluateRelativeProperty = (target, k, v) ->
	[match, sign, number, unit, rest...] = relativePropertyRE.exec(v)
	return target[k] + (sign + 1) * number if sign
	return +number

# _runningAnimations = []

# Todo: this would normally be BaseClass but the properties keyword
# is not compatible and causes problems.
class exports.Animation extends EventEmitter

	constructor: (options={}) ->

		options = Defaults.getDefaults "Animation", options

		super options

		@options = _.clone _.defaults options,
			layer: null
			properties: {}
			transformers: {}
			curve: "linear"
			curveOptions: {}
			time: 1
			repeat: 0
			delay: 0
			debug: false

		if options.origin
			console.warn "Animation.origin: please use layer.originX and layer.originY"

		@options.properties = Animation.filterAnimatableProperties(@options.properties, @options.transformers)

		@_parseAnimatorOptions()
		@_originalState = @_currentState()
		@_repeatCounter = @options.repeat

	start: =>

		if @options.layer is null
			console.error "Animation: missing layer"

		AnimatorClass = @_animatorClass()

		if @options.debug
			console.log "Animation.start #{AnimatorClass.name}", @options.curveOptions

		@_animator = new AnimatorClass @options.curveOptions

		@_target = @options.layer
		@_stateA = @_currentState()
		@_stateB = {}

		for k, v of @options.properties

			# Evaluate function properties
			if _.isFunction(v)
				v = v()

			# Evaluate relative properties
			else if isRelativeProperty(v)
				v = evaluateRelativeProperty(@_target, k, v)

			# Filter out the properties that are equal
			@_stateB[k] = v if @_stateA[k] != v

		if _.keys(@_stateA).length is 0
			console.warn "Animation: nothing to animate, no animatable properties"
			return false

		if _.isEqual(@_stateA, @_stateB)
			console.warn "Animation: nothing to animate, all properties are equal to what it is now"
			return false

		for property, animation of @_target.animatingProperties()
			if @_stateA.hasOwnProperty(property)
				# We used to ignore animations that tried animation already animating properties
				# console.warn "Animation: property #{property} is already being animated for this layer by another animation, so we bail"

				# But after some consideration, we actually just stop the animation that is animation those properties for this one
				animation.stop()

		if @options.debug
			console.log "Animation.start"
			console.log "\t#{k}: #{@_stateA[k]} -> #{@_stateB[k]}" for k, v of @_stateB

		# See if we need to repeat this animation
		# Todo: more repeat behaviours:
		# 1) add (from end position) 2) reverse (loop between a and b)
		if @_repeatCounter > 0
			@once "end", =>
				for k, v of @_stateA
					@_target[k] = v
				@_repeatCounter--
				@start()

		# If we have a delay, we wait a bit for it to start
		if @options.delay
			Utils.delay(@options.delay, @_start)
		else
			@_start()

		return true

	stop: (emit=true)->
		
		@options.layer._context._animationList = _.without(
			@options.layer._context._animationList, @)

		@emit("stop") if emit
		Framer.Loop.off("update", @_update)

	reverse: ->
		# TODO: Add some tests
		options = _.clone(@options)
		options.properties = @_originalState
		animation = new Animation options
		animation

	copy: -> return new Animation(_.clone(@options))

	# A bunch of common aliases to minimize frustration
	revert: -> 	@reverse()
	inverse: -> @reverse()
	invert: -> 	@reverse()

	emit: (event) ->
		super
		# Also emit this to the layer with self as argument
		@options.layer.emit(event, @)

	animatingProperties: ->
		_.keys(@_stateA)

	_start: =>
		@options.layer._context._animationList.push(@)
		@emit("start")
		Framer.Loop.on("update", @_update)

	_update: (delta) =>
		if @_animator.finished()
			@_updateValue(1)
			@stop(emit=false)
			@emit("end")
			@emit("stop")
		else
			@_updateValue(@_animator.next(delta))

	_updateValue: (value) =>

		for k, v of @_stateB
			mapRange = Utils.mapRange

			# See if there's a transformation that needs to be applied:
			transformers = @options.transformers[k]
			if transformers?
				mapRange = transformers.mapRange
				console.log mapRange(value, 0, 1, @_stateA[k], @_stateB[k])

			@_target[k] = mapRange(value, 0, 1, @_stateA[k], @_stateB[k])

		return

	_currentState: ->
		_.pick @options.layer, _.keys(@options.properties)

	_animatorClass: ->

		parsedCurve = Utils.parseFunction(@options.curve)
		animatorClassName = parsedCurve.name.toLowerCase()

		if AnimatorClasses.hasOwnProperty(animatorClassName)
			return AnimatorClasses[animatorClassName]

		if animatorClassName in AnimatorClassBezierPresets
			return BezierCurveAnimator

		return LinearAnimator

	_parseAnimatorOptions: ->

		animatorClass = @_animatorClass()
		parsedCurve = Utils.parseFunction @options.curve
		animatorClassName = parsedCurve.name.toLowerCase()

		# This is for compatibility with the direct Animation.time argument. This should
		# ideally also be passed as a curveOption

		if animatorClass in [LinearAnimator, BezierCurveAnimator]
			if _.isString(@options.curveOptions) or _.isArray(@options.curveOptions)
				@options.curveOptions =
					values: @options.curveOptions

			@options.curveOptions.time ?= @options.time

		# Support ease-in etc
		if animatorClass in [BezierCurveAnimator] and animatorClassName in AnimatorClassBezierPresets
			@options.curveOptions.values = animatorClassName
			@options.curveOptions.time ?= @options.time

		# All this is to support curve: "spring(100,20,10)". In the future we'd like people
		# to start using curveOptions: {tension:100, friction:10} etc

		if parsedCurve.args.length

			# console.warn "Animation.curve arguments are deprecated. Please use Animation.curveOptions"

			if animatorClass is BezierCurveAnimator
				@options.curveOptions.values = parsedCurve.args.map (v) -> parseFloat(v) or 0

			if animatorClass is SpringRK4Animator
				for k, i in ["tension", "friction", "velocity", "tolerance"]
					value = parseFloat parsedCurve.args[i]
					@options.curveOptions[k] = value if value

			if animatorClass is SpringDHOAnimator
				for k, i in ["stiffness", "damping", "mass", "tolerance"]
					value = parseFloat parsedCurve.args[i]
					@options.curveOptions[k] = value if value

	@filterAnimatableProperties = (properties, transformers) ->
		# Function to filter only animatable properties out of a given set
		animatableProperties = {}

		# Only animate numeric properties for now
		for k, v of properties
			if _.isNumber(v) or _.isFunction(v) or isRelativeProperty(v)
				animatableProperties[k] = v
			else if Utils.isColorString(v)
				animatableProperties[k] = v
				transformers[k] = {
					mapRange: Utils.mapRangeColor
				}

		return animatableProperties
