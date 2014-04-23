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
	"spring": SpringRK4Animator
	"spring-rk4": SpringRK4Animator
	"spring-dho": SpringDHOAnimator

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
			# origin: "50% 50%"
			repeat: 0
			delay: 0
			debug: true

		@options.curveOptions = Utils.setDefaultProperties @options.curveOptions,
			{time: @options.time}, false

		if options.layer is null
			console.error "Animation: missing layer"

		@_creationState = _.pick @options.layer, _.keys(@options.properties)
		@_repeatCounter = @options.repeat

	_animatorClass: ->
		
		animatorClassName = @options.curve.toLowerCase()

		if AnimatorClasses.hasOwnProperty animatorClassName
			return AnimatorClasses[animatorClassName]

		return BezierCurveAnimator

	_animatorOptions: ->
		@options.curveOptions

	start: ->

		AnimatorClass = @_animatorClass()
		animatorOptions = @_animatorOptions()

		@_animator = new AnimatorClass @_animatorOptions()

		target = @options.layer
		stateB = @options.properties
		# stateA = _.pick target, _.keys(stateB)
		stateA = @_creationState

		if _.isEqual stateA, stateB
			console.warn "Nothing to animate"

		console.debug "Animation.start"
		console.debug "\t#{k}: #{stateA[k]} -> #{stateB[k]}" for k, v of stateB

		@_animator.on "start", => @emit "start"
		@_animator.on "stop",  => @emit "stop"
		@_animator.on "end",   => @emit "end"

		# See if we need to repeat this animation
		if @_repeatCounter > 0
			@_animator.on "end", =>
				@_repeatCounter--
				@start()

		@_animator.on "tick", (value) ->
			for k, v of stateB
				target[k] = Utils.mapRange value, 0, 1, stateA[k], stateB[k]

		Utils.delay @options.delay, =>
			_runningAnimations.push @
			@_animator.start()

	stop: ->
		@_animator.stop()
		_runningAnimations = _.without _runningAnimations, @

	emit: (event) ->
		super
		# Also emit this to the layer with self as argument
		@options.layer.emit event, @
