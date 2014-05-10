{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
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

_runningAnimations = []

# Todo: this would normally be BaseClass but the properties keyword
# is not compatible and causes problems.
class exports.Animation extends EventEmitter

	@runningAnimations = ->
		_runningAnimations

	constructor: (options={}) ->
		
		super options

		@options = Utils.setDefaultProperties options,
			layer: null
			properties: {}
			curve: "linear"
			curveOptions: {}
			time: 1
			repeat: 0
			delay: 0
			debug: true

		if options.layer is null
			console.error "Animation: missing layer"

		if options.origin
			console.warn "Animation.origin: please use layer.originX and layer.originY"

		@options.properties = @_filterAnimatableProperties @options.properties

		@_parseAnimatorOptions()
		@_originalState = @_currentState()
		@_repeatCounter = @options.repeat

	_filterAnimatableProperties: (properties) ->
		delete properties.image
		properties

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
			@options.curveOptions.time = @options.time

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
					
	start: =>

		AnimatorClass = @_animatorClass()

		console.debug "Animation.start #{AnimatorClass.name}", @options.curveOptions

		@_animator = new AnimatorClass @options.curveOptions

		target = @options.layer
		stateA = @_currentState()
		stateB = @options.properties

		if _.isEqual stateA, stateB
			console.warn "Nothing to animate"

		console.debug "Animation.start"
		console.debug "\t#{k}: #{stateA[k]} -> #{stateB[k]}" for k, v of stateB

		@_animator.on "start", => @emit "start"
		@_animator.on "stop",  => @emit "stop"
		@_animator.on "end",   => @emit "end"

		# See if we need to repeat this animation
		# Todo: more repeat behaviours:
		# 1) add (from end position) 2) reverse (loop between a and b)
		if @_repeatCounter > 0
			@_animator.on "end", =>
				for k, v of stateA
					target[k] = v
				@_repeatCounter--
				@start()

		# This is the function that sets the actual value to the layer in the 
		# animation loop. It needs to be very fast.
		@_animator.on "tick", (value) ->
			for k, v of stateB
				target[k] = Utils.mapRange value, 0, 1, stateA[k], stateB[k]
			return # For performance

		start = => 
			_runningAnimations.push @
			@_animator.start()

		# If we have a delay, we wait a bit for it to start
		if @options.delay
			Utils.delay @options.delay, start
		else
			start()


	stop: ->
		@_animator.stop()
		_runningAnimations = _.without _runningAnimations, @

	reverse: ->
		# TODO: Add some tests
		options = _.clone @options
		options.properties = @_originalState
		animation = new Animation options
		animation

	# A bunch of common aliases to minimize frustration
	revert: -> 	@reverse()
	inverse: -> @reverse()
	invert: -> 	@reverse()

	emit: (event) ->
		super
		# Also emit this to the layer with self as argument
		@options.layer.emit event, @
