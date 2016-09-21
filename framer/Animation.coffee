{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{Defaults} = require "./Defaults"
{BaseClass} = require "./BaseClass"

{LinearAnimator} = require "./Animators/LinearAnimator"
{BezierCurveAnimator} = require "./Animators/BezierCurveAnimator"
{SpringRK4Animator} = require "./Animators/SpringRK4Animator"
{SpringDHOAnimator} = require "./Animators/SpringDHOAnimator"
{SVGPathProxy} = require "./SVGPathProxy"

AnimatorClasses =
	"linear": LinearAnimator
	"bezier-curve": BezierCurveAnimator
	"spring-rk4": SpringRK4Animator
	"spring-dho": SpringDHOAnimator

AnimatorClasses["spring"] = AnimatorClasses["spring-rk4"]
AnimatorClasses["cubic-bezier"] = AnimatorClasses["bezier-curve"]

AnimatorClassBezierPresets = ["ease", "ease-in", "ease-out", "ease-in-out"]

numberRE = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/
relativePropertyRE = new RegExp("^(?:([+-])=|)(" + numberRE.source + ")([a-z%]*)$", "i")

isRelativeProperty = (v) ->
	_.isString(v) and relativePropertyRE.test(v)

evaluateRelativeProperty = (target, k, v) ->
	[match, sign, number, unit, rest...] = relativePropertyRE.exec(v)
	return target[k] + (sign + 1) * number if sign
	return +number

class exports.Animation extends BaseClass

	constructor: (args...) ->

		# Old API detection

		# animationA = new Animation
		# 	layer: layerA
		# 	properties:
		# 		x: 100

		layer = null
		properties = {}
		options = {}

		# Actual current api
		if arguments.length is 3
			layer = args[0]
			properties = args[1]
			options = args[2]

		# Mix of current and old api
		if arguments.length is 2
			layer = args[0]
			if args[1].properties?
				properties = args[1].properties
			else
				properties = args[1]
			options = args[1].options if args[1].options?

		# Old api
		if arguments.length is 1
			layer = args[0].layer
			properties = args[0].properties
			if args[0].options?
				options = args[0].options
			else
				options = args[0]

		delete options.layer
		delete options.properties
		delete options.options

		@options = _.cloneDeep(Defaults.getDefaults("Animation", options))

		super

		@_layer = layer

		unless layer instanceof Layer
			throw Error("Animation: missing layer") 

		@properties = Animation.filterAnimatableProperties(properties)

		if properties.origin
			console.warn "Animation.origin: please use layer.originX and layer.originY"

		if @properties.path?
			if @properties.x? or @properties.y?
				console.warn "Animation.path: the x and y animation properties are ignored when animating on a path"

			@_path = new SVGPathProxy(@properties.path)
			@properties.x = @layer.x + @_path.end.x - @_path.start.x
			@properties.y = @layer.y + @_path.end.y - @_path.start.x
			delete @properties.path

			if @options.debug
				@_debugLayer = new SVGPathDebugLayer(path: @_path, alignedToLayer: @layer)

		@_parseAnimatorOptions()
		@_originalState = @_currentState()
		@_repeatCounter = @options.repeat

	@define "layer",
		get: -> @_layer

	@define "isAnimating",
		get: -> @ in @layer.context.animations

	@define "looping",
		get: -> @options.looping
		set: (value) ->
			@options?.looping = value
			if @options?.looping and @layer? and !@isAnimating
				@restart()

	start: =>

		@_animator = @_createAnimator()
		@_target = @layer
		@_stateA = @_currentState()
		@_stateB = {}

		for k, v of @properties

			# Evaluate function properties
			if _.isFunction(v)
				v = v(@layer, k)

			# Evaluate relative properties
			else if isRelativeProperty(v)
				v = evaluateRelativeProperty(@_target, k, v)

			# Filter out the properties that are equal
			@_stateB[k] = v if @_stateA[k] isnt v

		if _.keys(@_stateA).length is 0
			console.warn "Animation: nothing to animate, no animatable properties"
			return @_noop()

		if _.isEqual(@_stateA, @_stateB)
			console.warn "Animation: nothing to animate, all properties are equal to what it is now"
			return @_noop()

		# If this animation wants to animate a property that is already being animated, it stops
		# that currently running animation. If not, it allows them both to continue.
		for property, animation of @_target.animatingProperties()

			if @_stateA.hasOwnProperty(property)
				animation.stop()

			# We also need to account for derivatives from x, y
			if property is "x" and (
				@_stateA.hasOwnProperty("minX") or
				@_stateA.hasOwnProperty("midX") or
				@_stateA.hasOwnProperty("maxX"))
				animation.stop()

			if property is "y" and (
				@_stateA.hasOwnProperty("minY") or
				@_stateA.hasOwnProperty("midY") or
				@_stateA.hasOwnProperty("maxY"))
				animation.stop()

		if @options.debug
			console.log "Animation.start"
			console.log "\t#{k}: #{@_stateA[k]} -> #{@_stateB[k]}" for k, v of @_stateB

		# Add the callbacks
		@on(Events.AnimationStart, @options.onStart) if _.isFunction(@options.onStart)
		@on(Events.AnimationStop, @options.onStop) if _.isFunction(@options.onStop)
		@on(Events.AnimationEnd, @options.onEnd) if _.isFunction(@options.onEnd)

		# See if we need to repeat this animation
		# Todo: more repeat behaviours:
		# 1) add (from end position) 2) reverse (loop between a and b)
		@once "end", =>
			if @_repeatCounter > 0 || @looping
				@restart()
				if not @looping
					@_repeatCounter--
		# If animate is false we set everything immediately and skip the actual animation
		start = @_start

		# The option keywords animate and instant trigger an instant animation
		if @options.animate is false or @options.instant is true
			start = @_instant

		# If we have a delay, we wait a bit for it to start
		if @options.delay
			@_delayTimer = Utils.delay(@options.delay, start)
		else
			start()
		
		return true

	stop: (emit=true) ->

		if @_delayTimer?
			Framer.CurrentContext.removeTimer(@_delayTimer)
			@_delayTimer = null
		
		@layer.context.removeAnimation(@)

		@emit(Events.AnimationStop) if emit
		Framer.Loop.off("update", @_update)

		if @options.debug
			animation = @_debugLayer.animate
				properties: { opacity: 0 }
				curve: 'linear'
				time: 0.25
			animation.on 'end', =>
				@_debugLayer.destroy()

	reverse: ->
		# TODO: Add some tests
		properties = _.clone(@_originalState)
		properties.options = _.clone(@options)
		properties.layer = @layer
		animation = new Animation properties
		animation

	reset: ->
		for k, v of @_stateA
			@_target[k] = v

	restart: ->
		@reset()
		@start()

	copy: ->
		properties = _.clone(@properties)
		properties.options = _.clone(@options)
		properties.layer = @layer
		new Animation(properties)

	# A bunch of common aliases to minimize frustration
	revert: -> 	@reverse()
	inverse: -> @reverse()
	invert: -> 	@reverse()

	emit: (event) ->
		super
		# Also emit this to the layer with self as argument
		@layer.emit(event, @)

	animatingProperties: ->
		_.keys(@_stateA)

	_instant: =>
		@emit(Events.AnimationStart)
		@_prepareUpdateValues()
		@_updateValues(1)
		@emit(Events.AnimationStop)
		@emit(Events.AnimationEnd)

	_noop: =>
		@emit(Events.AnimationStart)
		@emit(Events.AnimationStop)
		@emit(Events.AnimationEnd)
		return false

	_start: =>
		@layer.context.addAnimation(@)
		@emit(Events.AnimationStart)
		Framer.Loop.on("update", @_update)

		# Figure out what kind of values we have so we don't have to do it in
		# the actual update loop. This saves a lot of frame budget.
		@_prepareUpdateValues()


	_update: (delta) =>
		if @_animator.finished()
			@_updateValues(1)
			@stop(emit=false)
			@emit(Events.AnimationStop)
			@emit(Events.AnimationEnd)
		else
			@_updateValues(@_animator.next(delta))

	_prepareUpdateValues: =>
		@_valueUpdaters = {}

		for k, v of @_stateB
			if Color.isColorObject(v) or Color.isColorObject(@_stateA[k])
				@_valueUpdaters[k] = @_updateColorValue
			else if @_path? and k in ['x', 'y']
				@_valueUpdaters[k] = @_updatePositionAlongPath
			else
				@_valueUpdaters[k] = @_updateNumberValue

	_updateValues: (value) =>
		for k, v of @_stateB
			@_valueUpdaters[k](k, value)
		return null

	_updateNumberValue: (key, value) =>
		@_target[key] = Utils.mapRange(value, 0, 1, @_stateA[key], @_stateB[key])

		return

	_updatePositionAlongPath: (key, value) =>
		position = @_path.getPointAtLength(@_path.length * value)
		position.x += @_stateA.x - @_path.start.x
		position.y += @_stateA.y - @_path.start.y

		if @options.debug
			@_debugLayer.updatePositionAlongPath(@_path.length * (1 - value))

		if @options.autoRotate
			angle = Math.atan2(position.y - @_target.y, position.x - @_target.x) * 180 / Math.PI
			if position.y != @_target.y && position.x != @_target.x
				@_target.rotationZ = angle

		@_target.x = position.x
		@_target.y = position.y

		return

	_updateColorValue: (key, value) =>
		@_target[key] = Color.mix(@_stateA[key], @_stateB[key], value, false, @options.colorModel)

	_currentState: ->
		return _.pick(@layer, _.keys(@properties))

	_createAnimator: ->
		AnimatorClass = @_animatorClass()

		if @options.debug
			console.log "Animation.start #{AnimatorClass.name}", @options.curveOptions

		return new AnimatorClass @options.curveOptions

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

		# All this is to support curve: "spring(100, 20, 10)". In the future we'd like people
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

	@isAnimatable = (v) ->
		_.isNumber(v) or _.isFunction(v) or isRelativeProperty(v) or Color.isColorObject(v)

	@filterAnimatableProperties = (properties) ->
		# Function to filter only animatable properties out of a given set
		animatableProperties = {}

		# Only animate numeric properties for now
		for k, v of properties
			if @isAnimatable(v) or k == 'path'
				animatableProperties[k] = v
			else if Color.isValidColorProperty(k, v)
				animatableProperties[k] = new Color(v)


		return animatableProperties

	toInspect: ->
		return "<#{@constructor.name} id:#{@id} isAnimating:#{@isAnimating} [#{_.keys(@properties)}]>"


	##############################################################
	## EVENT HELPERS

	onAnimationStart: (cb) -> @on(Events.AnimationStart, cb)
	onAnimationStop: (cb) -> @on(Events.AnimationStop, cb)
	onAnimationEnd: (cb) -> @on(Events.AnimationEnd, cb)
	onAnimationDidStart: (cb) -> @on(Events.AnimationDidStart, cb)
	onAnimationDidStop: (cb) -> @on(Events.AnimationDidStop, cb)
	onAnimationDidEnd: (cb) -> @on(Events.AnimationDidEnd, cb)
