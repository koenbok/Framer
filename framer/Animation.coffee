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

AnimatorClassBezierPresets = ["ease", "ease-in", "ease-out", "ease-in-out"]

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

createDebugLayerForPath = (path) ->
	padding = 10
	sharedContext = Utils.SVG.getContext()
	svg = Utils.SVG.createElement('svg', width: '100%', height: '100%')

	debugLayer = new Layer width: 100, height: 100, backgroundColor: 'transparent'
	debugLayer._element.appendChild(svg)
	debugLayer.path = path

	debugElementsGroup = path.elementForDebugRepresentation()
	sharedContext.appendChild(debugElementsGroup)
	bbox = debugElementsGroup.getBBox()

	svg.appendChild(debugElementsGroup)

	debugLayer.width = bbox.width + Math.abs(bbox.x) + padding * 2
	debugLayer.height = bbox.height + Math.abs(bbox.y) + padding * 2
	debugLayer.pathOffset = { x: bbox.x - padding, y: bbox.y - padding }
	debugLayer.animatedPath = debugElementsGroup.getElementsByClassName('animated-path')?[0]

	debugElementsGroup.setAttribute('transform', "translate(#{-bbox.x + padding}, #{-bbox.y + padding})")

	debugLayer

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
			path: null
			pathOptions: null

		if options.path
			path = options.path
			@options.pathLength = path.getTotalLength()

			@options.properties.x = options.layer.x + path.end.x
			@options.properties.y = options.layer.y + path.end.y

			@pathOptions = Utils.setDefaultProperties (options.pathOptions || {}),
				autoRotate: true

			if @options.debug
				@_debugLayer = createDebugLayerForPath(path)
				layerScreenFrame = @options.layer.screenFrame
				@_debugLayer.x = layerScreenFrame.midX - path.start.x + @_debugLayer.pathOffset.x
				@_debugLayer.y = layerScreenFrame.midY - path.start.y + @_debugLayer.pathOffset.y

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

		if @_debugLayer
			animation = @_debugLayer.animate
				properties: { opacity: 0 }
				curve: 'linear'
				time: 0.25
			animation.on 'end', ->
				@options.layer.destroy()

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

		for k, v of @_stateB when ((@options.path and k not in ['x', 'y']) or !@options.path)
			@_target[k] = Utils.mapRange(value, 0, 1, @_stateA[k], @_stateB[k])

		if @options.path
			position = @options.path.getPointAtLength(@options.pathLength * value)
			position.x += @_stateA.x - @options.path.start.x
			position.y += @_stateA.y - @options.path.start.y

			if @_debugLayer
				@_debugLayer.animatedPath.setAttribute('stroke-dashoffset', @options.pathLength * (1 - value))

			if @pathOptions.autoRotate
				angle = Math.atan2(position.y - @_target.y, position.x - @_target.x) * 180 / Math.PI
				if position.y != @_target.y && position.x != @_target.x
					@_target.rotationZ = angle

			@_target.x = position.x
			@_target.y = position.y

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
				for k, i in ["tension", "friction", "velocity"]
					value = parseFloat parsedCurve.args[i]
					@options.curveOptions[k] = value if value

			if animatorClass is SpringDHOAnimator
				for k, i in ["stiffness", "damping", "mass", "tolerance"]
					value = parseFloat parsedCurve.args[i]
					@options.curveOptions[k] = value if value
