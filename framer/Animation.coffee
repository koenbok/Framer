{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{Defaults} = require "./Defaults"
{BaseClass} = require "./BaseClass"
{Animator} = require "./Animators/Animator"
{LinearAnimator} = require "./Animators/LinearAnimator"
{SVG, SVGPath} = require "./SVG"
Curves = require "./Animators/Curves"

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

			options = {}

			if properties.options?
				options = _.clone(properties.options)

			if args[2]
				options = _.extend({}, options, args[2])

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

		@properties = Animation.filterAnimatableProperties(properties, layer)

		if properties.origin
			console.warn "Animation.origin: please use layer.originX and layer.originY"

		if _.isString @options.curve
			@options.curve = Curves.fromString(@options.curve)
		if @options.curve is Curves.Spring or @options.curve is Curves.Bezier
			@options.curve = @options.curve.call()
		@_originalState = @_currentState()
		@_repeatCounter = @options.repeat

	@define "layer",
		get: -> @_layer

	@define "isPending", get: -> @_delayTimer?

	@define "isAnimating",
		get: -> @ in @layer.animations()

	@define "looping",
		get: -> @options.looping
		set: (value) ->
			@options?.looping = value
			if @options?.looping and @layer? and not @isAnimating
				@restart()

	@define "isNoop", @simpleProperty("isNoop", false)

	start: =>
		@_animator = @options.curve(@options)
		@_target = @layer
		@_stateA = @_currentState()
		@_stateB = {}

		for k, v of @properties

			# Filter out properties that are literally equal
			continue if @_stateA[k] is v

			# Evaluate function properties
			if _.isFunction(v)
				v = v(@layer, k)

			# Evaluate relative properties
			else if isRelativeProperty(v)
				v = evaluateRelativeProperty(@_target, k, v)

			# Filter out the properties that have equal values
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
		@on(Events.AnimationHalt, @options.onHalt) if _.isFunction(@options.onHalt)
		@on(Events.AnimationStop, @options.onStop) if _.isFunction(@options.onStop)
		@on(Events.AnimationEnd, @options.onEnd) if _.isFunction(@options.onEnd)

		# See if we need to repeat this animation
		# Todo: more repeat behaviours:
		# 1) add (from end position) 2) reverse (loop between a and b)
		@once "end", =>
			if @_repeatCounter > 0 or @looping
				@restart()
				if not @looping
					@_repeatCounter--

		# Figure out what kind of values we have so we don't have to do it in
		# the actual update loop. This saves a lot of frame budget.
		@_prepareUpdateValues()

		# The option keywords animate and instant trigger an instant animation
		if @options.animate is false or @options.instant is true
			# If animate is false we set everything immediately and skip the actual animation
			start = @_instant
		else
			start = @_start

		@layer.context.addAnimation(@)
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
		@emit(Events.AnimationHalt) if emit
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
		@_updateValues(1)
		@emit(Events.AnimationStop)
		@emit(Events.AnimationEnd)

	_noop: =>
		@isNoop = true
		# We don't emit these so you can call layer.animate safely
		# from the same layers layer.onAnimationEnd handler
		# @emit(Events.AnimationStart)
		# @emit(Events.AnimationStop)
		# @emit(Events.AnimationEnd)
		return not @isNoop

	_start: =>
		@_delayTimer = null
		@emit(Events.AnimationStart)
		@_previousValue = 0
		Framer.Loop.on("update", @_update)

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
			if SVGPath.isPath(v)
				path = new SVGPath(v)
				direction = null
				start = null
				end = null
				switch k
					when "x", "minX", "midX", "maxX", "width"
						direction = "horizontal"
					when "y", "minY", "midY", "maxY", "height"
						direction = "vertical"
					when "rotation", "rotationZ", "rotationX", "rotationY"
						direction = "angle"

				@_valueUpdaters[k] = path.valueUpdater(direction, @_target, @_target[k])
			else if Color.isColorObject(v) or Color.isColorObject(@_stateA[k])
				@_valueUpdaters[k] = @_updateColorValue
			else if Gradient.isGradient(v) or Gradient.isGradient(@_stateA[k])
				@_valueUpdaters[k] = @_updateGradientValue
				# If the begin state is not set, animate from the same state but with alpha 0
				@_stateA[k] ?= Gradient.multiplyAlpha(v, 0)
			else if k is "borderWidth"
				@_valueUpdaters[k] = @_updateNumericObjectValue.bind(this, ["top", "left", "bottom", "right"])
			else if k is "borderRadius"
				@_valueUpdaters[k] = @_updateNumericObjectValue.bind(this, ["topLeft", "topRight", "bottomRight", "bottomLeft"])
			else if k is "template"
				@_valueUpdaters[k] = @_updateTemplateValue
			else if k is "shadows"
				@_valueUpdaters[k] = @_updateShadows
			else
				@_valueUpdaters[k] = @_updateNumberValue

	_updateValues: (value) =>
		delta = value - @_previousValue
		@_previousValue = value
		@_valueUpdaters[k](k, value, delta) for k, v of @_stateB
		return null

	_updateNumberValue: (key, value) =>
		@_target[key] = Utils.mapRange(value, 0, 1, @_stateA[key], @_stateB[key])

	_interpolateNumericObjectValues: (propKeys, valueA, valueB, value, flatten=true) ->
		result = {}

		for propKey in propKeys
			keyValueA = if _.isNumber(valueA) then valueA else valueA?[propKey]
			keyValueB = if _.isNumber(valueB) then valueB else valueB?[propKey]
			# If the key value is undefined in one state, use the value from the other
			keyValueA ?= keyValueB
			keyValueB ?= keyValueA
			result[propKey] = Utils.mapRange(value, 0, 1, keyValueA, keyValueB)

		# Flatten to a single number if all properties have the same value
		if flatten and _.uniq(_.values(result)).length is 1
			result = result[propKeys[0]]
		return result

	_calculateNumericObjectValue: (propKeys, key, value, flatten=true) =>
		valueA = @_stateA[key]
		valueB = @_stateB[key]

		return @_interpolateNumericObjectValues(propKeys, valueA, valueB, value, flatten)

	_updateNumericObjectValue: (propKeys, key, value, flatten=true) =>
		result = @_calculateNumericObjectValue(propKeys, key, value, flatten)
		@_target[key] = result

	_updateColorValue: (key, value) =>
		@_target[key] = Color.mix(@_stateA[key], @_stateB[key], value, false, @options.colorModel)

	_updateGradientValue: (key, value) =>
		if not @_stateB[key] and value is 1
			@_target[key] = @_stateB[key]
			return

		gradientA = Gradient._asPlainObject(@_stateA[key])
		# If the end state is not set, animate to the same state but with alpha 0
		gradientB = Gradient._asPlainObject(@_stateB[key] ? Gradient.multiplyAlpha(gradientA, 0))

		@_target[key] = Gradient.mix(
			_.defaults(gradientA, gradientB)
			_.defaults(gradientB, gradientA)
			value
			@options.colorModel
		)

	_updateShadows: (key, value) =>
		if value is 1
			@_target[key] = @_stateB[key]
			return

		result = []
		numShadows = Math.max(@_stateA[key]?.length ? 0, @_stateB[key]?.length ? 0)
		for index in [0...numShadows]
			fromShadow = @_stateA[key]?[index]
			toShadow = @_stateB[key]?[index]
			if not toShadow? and not fromShadow?
				continue
			type = toShadow?.type ? fromShadow?.type ? Framer.Defaults.Shadow.type
			fromShadow ?= _.defaults {color: null, type: type}, Framer.Defaults.Shadow
			toShadow ?= _.defaults {color: null, type: type}, Framer.Defaults.Shadow
			result[index] = @_interpolateNumericObjectValues(["x", "y", "blur", "spread"], fromShadow, toShadow, value, false)
			result[index].color = Color.mix(fromShadow.color, toShadow.color, value, false, @options.colorModel)
			result[index].type = type

		@_target[key] = result


	# shallow mix all end state `{key: value}`s if `value` is a number, otherwise just takes `value`
	_updateTemplateValue: (key, value) =>
		fromData = @_stateA[key]
		toData = @_stateB[key]
		targetData = {}

		if not _.isObject(toData)
			k = @_target._styledText?.buildTemplate()
			return if not k
			valueB = toData
			if _.isNumber(valueB)
				valueA = if _.isObject(fromData) then fromData[k] else fromData
				valueA = 0 unless _.isNumber(valueA)
				valueB = Utils.mapRange(value, 0, 1, valueA, valueB)
			targetData[k] = valueB
			@_target.template = targetData
			return

		for k, valueB of toData
			if _.isNumber(valueB)
				valueA = if _.isObject(fromData) then fromData[k] else fromData
				valueA = 0 unless _.isNumber(valueA)
				valueB = Utils.mapRange(value, 0, 1, valueA, valueB)
			targetData[k] = valueB
		@_target.template = targetData

	_currentState: ->
		return _.pick(@layer, _.keys(@properties))

	@isAnimatable = (v) ->
		_.isNumber(v) or _.isFunction(v) or isRelativeProperty(v) or Color.isColorObject(v) or Gradient.isGradientObject(v) or SVGPath.isPath(v)

	# Special cases that animate with different types of objects
	@isAnimatableKey = (k) ->
		k in ["gradient", "borderWidth", "borderRadius", "template", "shadows"]

	@filterAnimatableProperties = (properties, layer) ->
		# Function to filter only animatable properties out of a given set
		animatableProperties = {}

		# Only animate numeric properties for now
		for k, v of properties
			if k in ["frame", "size", "point"] # Derived properties
				switch k
					when "frame" then derivedKeys = ["x", "y", "width", "height"]
					when "size" then derivedKeys = ["width", "height"]
					when "point" then derivedKeys = ["x", "y"]
					else derivedKeys = []
				if SVGPath.isPath(v)
					for derivedKey in derivedKeys
						animatableProperties[derivedKey] = v
				else if _.isObject(v)
					_.defaults(animatableProperties, _.pick(v, derivedKeys))
				else if _.isNumber(v)
					for derivedKey in derivedKeys
						animatableProperties[derivedKey] = v
			else if @isAnimatable(v)
				animatableProperties[k] = v
			else if Color.isValidColorProperty(k, v)
				animatableProperties[k] = new Color(v)
			else if @isAnimatableKey(k)
				animatableProperties[k] = v
			else if matches = k.match(/^shadow([1-9])$/)
				animatableProperties.shadows ?= _.clone(layer.shadows) ? []
				shadowIndex = parseInt(matches[1]) - 1
				if animatableProperties.shadows[shadowIndex]?
					_.defaults v, animatableProperties.shadows[shadowIndex]
				animatableProperties.shadows[shadowIndex] = v
		return animatableProperties

	toInspect: ->
		return "<#{@constructor.name} id:#{@id} layer:#{@layer?.toName()} [#{_.keys(@properties).join(", ")}] isAnimating:#{@isAnimating}>"


	##############################################################
	## EVENT HELPERS

	onAnimationStart: (cb) -> @on(Events.AnimationStart, cb)
	onAnimationHalt: (cb) -> @on(Events.AnimationHalt, cb)
	onAnimationStop: (cb) -> @on(Events.AnimationStop, cb)
	onAnimationEnd: (cb) -> @on(Events.AnimationEnd, cb)
	onAnimationDidStart: (cb) -> @on(Events.AnimationDidStart, cb)
	onAnimationDidStop: (cb) -> @on(Events.AnimationDidStop, cb)
	onAnimationDidEnd: (cb) -> @on(Events.AnimationDidEnd, cb)
