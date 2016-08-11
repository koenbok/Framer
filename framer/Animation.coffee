{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{Defaults} = require "./Defaults"
{BaseClass} = require "./BaseClass"

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
class exports.Animation extends BaseClass

	constructor: (options={}) ->

		options = Defaults.getDefaults "Animation", options

		super options

		@options = _.clone _.defaults options,
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
			colorModel: "husl"
			animate: true
			looping: false

		if options.properties.path
			@options.path = path = options.properties.path.forLayer(options.layer)
			@options.properties.x = options.layer.x + path.end.x - path.start.x
			@options.properties.y = options.layer.y + path.end.y - path.start.x
			delete options.properties.path

			@pathOptions = _.defaults((options.pathOptions || {}), autoRotate: true)

			if @options.debug
				@_debugLayer = createDebugLayerForPath(path)
				layerScreenFrame = @options.layer.screenFrame
				layerOriginX = layerScreenFrame.x + @options.layer.originX * layerScreenFrame.width
				layerOriginY = layerScreenFrame.y + @options.layer.originY * layerScreenFrame.height
				@_debugLayer.x = layerOriginX - path.start.x + @_debugLayer.pathOffset.x
				@_debugLayer.y = layerOriginY - path.start.y + @_debugLayer.pathOffset.y

		if options.origin
			console.warn "Animation.origin: please use layer.originX and layer.originY"

		@options.properties = Animation.filterAnimatableProperties(@options.properties)
		@_parseAnimatorOptions()
		@_originalState = @_currentState()
		@_repeatCounter = @options.repeat

	@define "isAnimating",
		get: -> @ in @options.layer.context.animations

	@define "looping",
		get: -> @options.looping
		set: (value) ->
			@options?.looping = value
			if @options?.looping and @options?.layer? and !@isAnimating
				@restart()

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
				v = v(@options.layer, k)

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
		start = @_instant if @options.animate is false

		# If we have a delay, we wait a bit for it to start
		if @options.delay
			@_delayTimer = Utils.delay(@options.delay, start)
		else
			start()
		return true

	stop: (emit=true)->
		if @_delayTimer?
			Framer.CurrentContext.removeTimer(@_delayTimer)
			@_delayTimer = null
		@options.layer.context.removeAnimation(@)

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
		options = _.clone(@options)
		options.properties = @_originalState
		animation = new Animation options
		animation

	reset: ->
		for k, v of @_stateA
			@_target[k] = v

	restart: ->
		@reset()
		@start()

	copy: -> new Animation(_.clone(@options))

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

	_instant: =>
		@emit("start")
		@_prepareUpdateValues()
		@_updateValues(1)
		@emit("end")
		@emit("stop")

	_start: =>
		@options.layer.context.addAnimation(@)
		@emit("start")
		Framer.Loop.on("update", @_update)

		# Figure out what kind of values we have so we don't have to do it in
		# the actual update loop. This saves a lot of frame budget.
		@_prepareUpdateValues()


	_update: (delta) =>
		if @_animator.finished()
			@_updateValues(1)
			@stop(emit=false)
			@emit("end")
			@emit("stop")
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
		for k, v of @_stateB
			@_valueUpdaters[k](k, value)
		return null

	_updateNumberValue: (key, value) =>
		@_target[key] = Utils.mapRange(value, 0, 1, @_stateA[key], @_stateB[key])

		if @options.path
			position = @options.path.pointAtLength(@options.path.length * value)
			position.x += @_stateA.x - @options.path.start.x
			position.y += @_stateA.y - @options.path.start.y

			if @_debugLayer
				@_debugLayer.animatedPath.setAttribute('stroke-dashoffset', @options.path.length * (1 - value))

			if @pathOptions.autoRotate
				angle = Math.atan2(position.y - @_target.y, position.x - @_target.x) * 180 / Math.PI
				if position.y != @_target.y && position.x != @_target.x
					@_target.rotationZ = angle

			@_target.x = position.x
			@_target.y = position.y

		return

	_updateColorValue: (key, value) =>
		@_target[key] = Color.mix(@_stateA[key], @_stateB[key], value, false, @options.colorModel)

	_currentState: ->
		return _.pick(@options.layer, _.keys(@options.properties))

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

	@filterAnimatableProperties = (properties) ->
		# Function to filter only animatable properties out of a given set
		animatableProperties = {}

		# Only animate numeric properties for now
		for k, v of properties
			if _.isNumber(v) or _.isFunction(v) or isRelativeProperty(v) or Color.isColorObject(v) or k == 'path' or v == null
				animatableProperties[k] = v
			else if _.isString(v)
				if Color.isColorString(v)
					animatableProperties[k] = new Color(v)


		return animatableProperties

	toInspect: ->
		return "<#{@constructor.name} id:#{@id} isAnimating:#{@isAnimating} [#{_.keys(@options.properties)}]>"


	##############################################################
	## EVENT HELPERS

	onAnimationStart: (cb) -> @on(Events.AnimationStart, cb)
	onAnimationStop: (cb) -> @on(Events.AnimationStop, cb)
	onAnimationEnd: (cb) -> @on(Events.AnimationEnd, cb)
	onAnimationDidStart: (cb) -> @on(Events.AnimationDidStart, cb)
	onAnimationDidStop: (cb) -> @on(Events.AnimationDidStop, cb)
	onAnimationDidEnd: (cb) -> @on(Events.AnimationDidEnd, cb)
