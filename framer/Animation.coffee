{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{Defaults} = require "./Defaults"
{BaseClass} = require "./BaseClass"
{Animator} = require "./Animator"

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

		unless layer instanceof _Layer
			throw Error("Animation: missing layer")

		@properties = Animation.filterAnimatableProperties(properties)

		if properties.origin
			console.warn "Animation.origin: please use layer.originX and layer.originY"

		@options.curveOptions = Animator.curveOptionsFor(@options)
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

	@define "isNoop", @simpleProperty("isNoop", false)

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

		if _.keys(@_stateB).length is 0
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

	reverse: ->
		# TODO: Add some tests
		properties = _.clone(@_originalState)
		options = _.clone(@options)
		new Animation @layer, properties, options

	reset: ->
		for k, v of @_stateA
			@_target[k] = v

	restart: ->
		@reset()
		@start()

	copy: ->
		properties = _.clone(@properties)
		options = _.clone(@options)
		new Animation(@layer, properties, options)

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
		@isNoop = true
		@emit(Events.AnimationStart)
		@emit(Events.AnimationStop)
		@emit(Events.AnimationEnd)
		return not @isNoop

	_start: =>
		@layer.context.addAnimation(@)
		@emit(Events.AnimationStart)
		Framer.Loop.on("update", @_update)

		# Figure out what kind of values we have so we don't have to do it in
		# the actual update loop. This saves a lot of frame budget.
		@_prepareUpdateValues()

	finish: =>
		@stop()
		@_updateValues(1)

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
			else
				@_valueUpdaters[k] = @_updateNumberValue

	_updateValues: (value) =>
		@_valueUpdaters[k](k, value) for k, v of @_stateB
		return null

	_updateNumberValue: (key, value) =>
		@_target[key] = Utils.mapRange(value, 0, 1, @_stateA[key], @_stateB[key])

	_updateColorValue: (key, value) =>
		@_target[key] = Color.mix(@_stateA[key], @_stateB[key], value, false, @options.colorModel)

	_currentState: ->
		return _.pick(@layer, _.keys(@properties))

	_createAnimator: ->
		AnimatorClass = Animator.classForCurve(@options.curve) ? LinearAnimator

		if @options.debug
			console.log "Animation.start #{AnimatorClass.name}", @options.curveOptions

		return new AnimatorClass @options.curveOptions

	@isAnimatable = (v) ->
		_.isNumber(v) or _.isFunction(v) or isRelativeProperty(v) or Color.isColorObject(v)

	@filterAnimatableProperties = (properties) ->
		# Function to filter only animatable properties out of a given set
		animatableProperties = {}

		# Only animate numeric properties for now
		for k, v of properties
			if @isAnimatable(v)
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
