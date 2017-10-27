Utils = require "../Utils"
{Layer} = require "../Layer"
{Events} = require "../Events"

"""
SliderComponent

knob <layer>
knobSize <width, height>
fill <layer>
min <number>
max <number>

pointForValue(<n>)
valueForPoint(<n>)

animateToValue(value, animationOptions={})
"""

Events.SliderValueChange  = "sliderValueChange"

class Knob extends Layer

	constructor: (options) ->
		super options


class exports.SliderComponent extends Layer

	constructor: (options={}) ->

		_.defaults options,
			backgroundColor: "#ccc"
			borderRadius: 50
			clip: false
			width: 300
			height: 10
			value: 0
			knobSize: 30

		# Set some sensible default for the hit area
		options.hitArea ?= options.knobSize

		@knob = new Knob
			backgroundColor: "#fff"
			shadowY: 2
			shadowBlur: 4
			shadowColor: "rgba(0, 0, 0, 0.3)"
			name: "knob"

		@fill = new Layer
			backgroundColor: "#333"
			width: 0, force2d: true
			name: "fill"

		@sliderOverlay = new Layer
			backgroundColor: null
			name: "sliderOverlay"

		super options

		@knobSize = options.knobSize
		@knob.parent = @fill.parent = @sliderOverlay.parent = @

		# Set fill initially
		if @width > @height
			@fill.height = @height
		else
			@fill.width = @width

		@fill.borderRadius = @sliderOverlay.borderRadius = @borderRadius

		@knob.draggable.enabled = true
		@knob.draggable.overdrag = false
		@knob.draggable.momentum = true
		@knob.draggable.momentumOptions = {friction: 5, tolerance: 0.25}
		@knob.draggable.bounce = false
		@knob.borderRadius = @knobSize / 2

		@_updateFrame()
		@_updateKnob()
		@_updateFill()

		@on("change:frame", @_updateFrame)
		@on("change:borderRadius", @_setRadius)
		@knob.on("change:size", @_updateKnob)
		@knob.on("change:frame", @_updateFill)
		@knob.on("change:frame", @_knobDidMove)

		@sliderOverlay.on(Events.TapStart, @_touchStart)
		@sliderOverlay.on(Events.TapEnd, @_touchEnd)

	_touchStart: (event) =>
		event.preventDefault()

		if @width > @height
			touchX = Events.touchEvent(event).clientX - Screen.canvasFrame.x
			scaleX = @canvasScaleX()
			@value = @valueForPoint(touchX / scaleX - @screenFrame.x)
		else
			touchY = Events.touchEvent(event).clientY - Screen.canvasFrame.y
			scaleY = @canvasScaleY()
			@value = @valueForPoint(touchY / scaleY - @screenFrame.y)

		@knob.draggable._touchStart(event)
		@_updateValue()

	_touchEnd: (event) =>
		@_updateValue()

	_updateFill: =>
		if @width > @height
			@fill.width = @knob.midX
		else
			@fill.height = @knob.midY

	_updateKnob: =>
		if @width > @height
			@knob.midX = @fill.width
			@knob.centerY()
		else
			@knob.midY = @fill.height
			@knob.centerX()

	_updateFrame: =>
		@knob.draggable.constraints =
			x: -@knob.width / 2
			y: -@knob.height / 2
			width: @width + @knob.width
			height: @height + @knob.height

		if @constrained
			@knob.draggable.constraints =
				x: 0
				y: 0
				width: @width
				height: @height

		@hitArea = @hitArea

		if @width > @height
			@fill.height = @height
			@knob.midX = @pointForValue(@value)
			@knob.centerY()
		else
			@fill.width = @width
			@knob.midY = @pointForValue(@value)
			@knob.centerX()

		if @width > @height
			@knob.draggable.speedY = 0
			@knob.draggable.speedX = 1
		else
			@knob.draggable.speedX = 0
			@knob.draggable.speedY = 1

		@sliderOverlay.center()

	_setRadius: =>
		radius = @borderRadius
		@fill.borderRadius =
			topLeft: radius
			bottomLeft: radius

	@define "constrained", @simpleProperty("constrained", false)

	@define "knobSize",
		get: -> @_knobSize
		set: (value) ->
			isRound = @knob.borderRadius * 2 is @_knobSize
			@_knobSize = value
			@knob.width = @_knobSize
			@knob.height = @_knobSize
			@knob.borderRadius = @_knobSize / 2 if isRound
			@_updateFrame()

	@define "hitArea",
		get: ->
			@_hitArea
		set: (value) ->
			@_hitArea = value
			if @width > @height
				@sliderOverlay.width = @width + @hitArea
				@sliderOverlay.height = @hitArea
			else
				@sliderOverlay.width = @hitArea
				@sliderOverlay.height = @height + @hitArea

	@define "min",
		get: -> @_min or 0
		set: (value) -> @_min = value if _.isFinite(value)

	@define "max",
		get: -> @_max or 1
		set: (value) -> @_max = value if _.isFinite(value)

	@define "value",
		get: -> return @_value
		set: (value) ->
			return unless _.isFinite(value)

			@_value = Utils.clamp(value, @min, @max)

			if @width > @height
				@knob.midX = @pointForValue(value)
			else
				@knob.midY = @pointForValue(value)

			@_updateFill()
			@_updateValue()

	_knobDidMove: =>

		if @width > @height
			@value = @valueForPoint(@knob.midX)
		else
			@value = @valueForPoint(@knob.midY)

	_updateValue: =>

		return if @_lastUpdatedValue is @value

		@_lastUpdatedValue = @value
		@emit("change:value", @value)
		@emit(Events.SliderValueChange, @value)

	pointForValue: (value) ->
		if @width > @height
			if @constrained
				return Utils.modulate(value, [@min, @max], [0 + (@knob.width / 2), @width - (@knob.width / 2)], true)
			else
				return Utils.modulate(value, [@min, @max], [0 , @width], true)
		else
			if @constrained
				return Utils.modulate(value, [@min, @max], [0 + (@knob.height / 2), @height - (@knob.height / 2)], true)
			else
				return Utils.modulate(value, [@min, @max], [0, @height], true)

	valueForPoint: (value) ->
		if @width > @height
			if @constrained
				return Utils.modulate(value, [0 + (@knob.width / 2), @width - (@knob.width / 2)], [@min, @max], true)
			else
				return Utils.modulate(value, [0, @width], [@min, @max], true)
		else
			if @constrained
				return Utils.modulate(value, [0 + (@knob.height / 2), @height - (@knob.height / 2)], [@min, @max], true)
			else
				return Utils.modulate(value, [0, @height], [@min, @max], true)

	animateToValue: (value, animationOptions={curve: "spring(300, 25, 0)"}) ->
		return unless _.isFinite(value)
		if @width > @height
			animationOptions.properties = {x: @pointForValue(value) - (@knob.width/2)}
		else
			animationOptions.properties = {y: @pointForValue(value) - (@knob.height/2)}

		@knob.animate(animationOptions)

	##############################################################
	## EVENT HELPERS

	onValueChange: (cb) -> @on(Events.SliderValueChange, cb)
