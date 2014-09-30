{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{Defaults} = require "./Defaults"
{EventEmitter} = require "./EventEmitter"
{Frame} = require "./Frame"

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

numberRE = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/
relativePropertyRE = new RegExp('^(?:([+-])=|)(' + numberRE.source + ')([a-z%]*)$', 'i')

isRelativeProperty = (v) ->
	_.isString(v) and relativePropertyRE.test(v)

evaluateRelativeProperty = (target, k, v) ->
	[match, sign, number, unit, rest...] = relativePropertyRE.exec(v)

	if sign
		return target[k] + (sign + 1) * number
	else
		return +number

# _runningAnimations = []

# Todo: this would normally be BaseClass but the properties keyword
# is not compatible and causes problems.
class exports.Animation extends EventEmitter

	# @runningAnimations = ->
	# 	_runningAnimations

	constructor: (options={}) ->

		options = Defaults.getDefaults "Animation", options

		super options

		@options = Utils.setDefaultProperties options,
			layer: null
			properties: {}
			curve: "linear"
			curveOptions: {}
			time: 1
			repeat: 0
			delay: 0
			debug: false

		if options.origin
			console.warn "Animation.origin: please use layer.originX and layer.originY"

		# Convert a frame instance to a regular js object
		if options.properties instanceof Frame
			option.properties = option.properties.properties

		@options.properties = @_filterAnimatableProperties(@options.properties)

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

		# See if another animation targeting the same layer is animating the same properties
		for runningAnimation in @_target.animations()
			for key in _.keys(runningAnimation._stateA)
				if @_stateA.hasOwnProperty(key)
					console.warn "Animation: property #{key} is already being animated for this layer by another animation, so we bail"
					return false

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
		options = _.clone @options
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
			@_target[k] = Utils.mapRange(value, 0, 1, @_stateA[k], @_stateB[k])

		return

	_filterAnimatableProperties: (properties) ->

		animatableProperties = {}

		# Only animate numeric properties for now
		for k, v of properties
			animatableProperties[k] = v if _.isNumber(v) or _.isFunction(v) or isRelativeProperty(v)

		animatableProperties

	_currentState: ->
		_.pick @options.layer, _.keys(@options.properties)

	_animatorClass: ->

		parsedCurve = Utils.parseFunction @options.curve
		animatorClassName = parsedCurve.name.toLowerCase()

		if AnimatorClasses.hasOwnProperty animatorClassName
			return AnimatorClasses[animatorClassName]

		return LinearAnimator

	_parseAnimatorOptions: ->

		animatorClass = @_animatorClass()
		parsedCurve = Utils.parseFunction @options.curve

		# This is for compatibility with the direct Animation.time argument. This should
		# ideally also be passed as a curveOption

		if animatorClass in [LinearAnimator, BezierCurveAnimator]
			if _.isString(@options.curveOptions) or _.isArray(@options.curveOptions)
				@options.curveOptions =
					values: @options.curveOptions

			@options.curveOptions.time ?= @options.time

		# All this is to support curve: "spring(100,20,10)". In the future we'd like people
		# to start using curveOptions: {tension:100, friction:10} etc

		if parsedCurve.args.length

			# console.warn "Animation.curve arguments are deprecated. Please use Animation.curveOptions"

			if animatorClass is BezierCurveAnimator
				@options.curveOptions.values = parsedCurve.args.map (v) -> parseFloat(v) or 0

			if animatorClass is SpringRK4Animator
				for k, i in ["tension", "friction", "velocity"]
					value = parseFloat parsedCurve.args[i]
					@options.curveOptions[k] = value if value

			if animatorClass is SpringDHOAnimator
				for k, i in ["stiffness", "damping", "mass", "tolerance"]
					value = parseFloat parsedCurve.args[i]
					@options.curveOptions[k] = value if value
