Utils = require "../Utils"
{Layer} = require "../Layer"
{Events} = require "../Events"

"""
RangedSliderComponent

knob <layer>
knobSize <width, height>
fill <layer>
min <number>
max <number>
ranged <boolean>

pointForValue(<n>)
valueForPoint(<n>)

animateToMinValue(value, animationOptions={})
animateToMaxValue(value, animationOptions={})
"""

Events.SliderValueChange  = "sliderValueChange"
Events.SliderMinValueChange = "sliderMinValueChange"
Events.SliderMaxValueChange = "sliderMaxValueChange"

class Knob extends Layer

	constructor: (options={}) ->
		_.defaults options,
			backgroundColor: "#fff"
			shadowY: 2
			shadowBlur: 4
			shadowColor: "rgba(0, 0, 0, 0.2)"

		super options

class exports.RangedSliderComponent extends Layer

	constructor: (options={}) ->

		_.defaults options,
			backgroundColor: "#ccc"
			borderRadius: 50
			clip: false
			width: 300
			height: 6
			value: 0
			knobSize: 30

		# Set some sensible default for the hit area
		options.hitArea ?= options.knobSize

		@minKnob = new Knob
			name: "minKnob"
			size: @knobSize or 30

		@maxKnob = new Knob
			name: "maxKnob"
			size: @knobSize or 30

		@fill = new Layer
			backgroundColor: "#333"
			width: 0
			force2d: true
			name: "fill"

		@sliderOverlay = new Layer
			backgroundColor: null
			name: "sliderOverlay"

		super options

		# Set fill initially
		if @width > @height
			@fill.height = @height
		else
			@fill.width = @width

		@fill.borderRadius = @sliderOverlay.borderRadius = @borderRadius
		@knobSize = options.knobSize

		@_styleKnob(@minKnob)
		@_styleKnob(@maxKnob)
		@_updateFrame()
		@_updateFill()
		@_updateKnob()

		@on("change:frame", @_updateFrame)
		@on("change:borderRadius", @_setRadius)

		for knob in [@minKnob, @maxKnob]
			knob.on("change:size", @_updateKnob)
			knob.on("change:frame", @_updateFill)
			knob.on("change:frame", @_knobDidMove)
			knob.on("change:frame", @_updateFrame)

		@sliderOverlay.on(Events.TapStart, @_touchStart)
		@sliderOverlay.on(Events.TapEnd, @_touchEnd)

	@define "constrained", @simpleProperty("constrained", false)

	_touchStart: (event) =>
		event.preventDefault()

		offsetX = (@min / @canvasScaleX()) - @min
		offsetY = (@min / @canvasScaleY()) - @min

		if @width > @height
			clickedValue = @valueForPoint(Events.touchEvent(event).clientX - @screenScaledFrame().x) / @canvasScaleX() - offsetX

			if clickedValue > @maxValue
				@maxValue = clickedValue
				@maxKnob.draggable._touchStart(event)

			if clickedValue < @minValue
				@minValue = clickedValue
				@minKnob.draggable._touchStart(event)

		else
			clickedValue = @valueForPoint(Events.touchEvent(event).clientY - @screenScaledFrame().y) / @canvasScaleY() - offsetY

			if clickedValue > @maxValue
				@maxValue = clickedValue
				@maxKnob.draggable._touchStart(event)

			if clickedValue < @minValue
				@minValue = clickedValue
				@minKnob.draggable._touchStart(event)

		@_updateValue()

	_touchEnd: (event) =>
		@_updateValue()

	_styleKnob: (knob) =>
		knob.parent = @fill.parent = @sliderOverlay.parent = @
		knob.draggable.enabled = true
		knob.draggable.overdrag = false
		knob.draggable.momentum = true
		knob.draggable.momentumOptions = {friction: 5, tolerance: 0.25}
		knob.draggable.bounce = false
		knob.borderRadius = @knobSize / 2

	_updateFill: =>
		if @width > @height
			@fill.x = @minKnob.midX
			@fill.width = @maxKnob.midX - @minKnob.midX

		else
			@fill.y = @minKnob.midY
			@fill.height = @maxKnob.midY - @minKnob.midY

	_updateKnob: =>
		if @width > @height
			@minKnob.midX = @fill.x
			@minKnob.centerY()

			@maxKnob.midX = @fill.x + @fill.width
			@maxKnob.centerY()

		else
			@minKnob.midY = @fill.y
			@minKnob.centerX()

			@maxKnob.midY = @fill.y + @fill.height
			@maxKnob.centerX()

	_updateFrame: =>

		@minKnob.draggable.constraints =
			x: -@minKnob.width / 2
			y: -@minKnob.height / 2
			width: @maxKnob.midX
			height: @maxKnob.midY

		@maxKnob.draggable.constraints =
			x: @minKnob.maxX
			y: @minKnob.maxY
			width: @width + @maxKnob.width
			height: @height + @maxKnob.height

		@hitArea = @hitArea

		if @width > @height
			@fill.height = @height
			@minKnob.midX = @pointForValue(@minValue)
			@maxKnob.midX = @pointForValue(@maxValue)
			@minKnob.centerY()

		else
			@fill.width = @width
			@minKnob.midY = @pointForValue(@minValue)
			@maxKnob.midY = @pointForValue(@maxValue)
			@minKnob.centerX()

		if @width > @height
			for knob in [@minKnob, @maxKnob]
				knob.draggable.speedY = 0
				knob.draggable.speedX = 1
		else
			for knob in [@minKnob, @maxKnob]
				knob.draggable.speedX = 0
				knob.draggable.speedY = 1

		@sliderOverlay.center()

	_setRadius: =>
		radius = @borderRadius
		@fill.style.borderRadius = "#{radius}px 0 0 #{radius}px"

	@define "knobSize",
		get: -> @_knobSize
		set: (value) ->

			for knob in [@minKnob, @maxKnob]
				isRound = knob.borderRadius * 2 is @_knobSize
				@_knobSize = value
				knob.size = @_knobSize
				knob.borderRadius = @_knobSize / 2 if isRound

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

	@define "minValue",
		get: -> @_minValue or 0
		set: (value) ->
			return unless _.isFinite(value)
			@_minValue = value

			if @width > @height
				@minKnob.midX = @pointForValue(value)
			else
				@minKnob.midY = @pointForValue(value)

			@_updateFill()
			@_updateValue()

	@define "maxValue",
		get: -> @_maxValue or 0.5
		set: (value) ->
			return unless _.isFinite(value)
			@_maxValue = value

			if @width > @height
				@maxKnob.midX = @pointForValue(value)
			else
				@maxKnob.midY = @pointForValue(value)

			@_updateFill()
			@_updateValue()


	_knobDidMove: =>
		if @width > @height
			@minValue = @valueForPoint(@minKnob.midX)
			@maxValue = @valueForPoint(@maxKnob.midX)
		else
			@minValue = @valueForPoint(@minKnob.midY)
			@maxValue = @valueForPoint(@maxKnob.midY)

	_updateValue: =>
		@emit(Events.SliderValueChange)
		@emit(Events.SliderMinValueChange, @minValue)
		@emit(Events.SliderMaxValueChange, @maxValue)

	pointForValue: (value) ->
		for knob in [@minKnob, @maxKnob]
			if @width > @height
				if @constrained
					return Utils.modulate(value, [@min, @max], [0 + (knob.width / 2), @width - (knob.width / 2)], true)
				else
					return Utils.modulate(value, [@min, @max], [0 , @width], true)
			else
				if @constrained
					return Utils.modulate(value, [@min, @max], [0 + (knob.height / 2), @height - (knob.height / 2)], true)
				else
					return Utils.modulate(value, [@min, @max], [0, @height], true)

	valueForPoint: (value) ->
		for knob in [@minKnob, @maxKnob]
			if @width > @height
				if @constrained
					return Utils.modulate(value, [0 + (knob.width / 2), @width - (knob.width / 2)], [@min, @max], true)
				else
					return Utils.modulate(value, [0, @width], [@min, @max], true)
			else
				if @constrained
					return Utils.modulate(value, [0 + (knob.height / 2), @height - (knob.height / 2)], [@min, @max], true)
				else
					return Utils.modulate(value, [0, @height], [@min, @max], true)

	animateToMinValue: (value, animationOptions={curve: "spring(250, 25, 0)"}) ->
		return unless _.isFinite(value)
		if @width > @height
			animationOptions.properties = {x: @pointForValue(value) - (@minKnob.width/2)}
		else
			animationOptions.properties = {y: @pointForValue(value) - (@minKnob.height/2)}

		@minKnob.animate(animationOptions)

	animateToMaxValue: (value, animationOptions={curve: "spring(250, 25, 0)"}) ->
		return unless _.isFinite(value)
		if @width > @height
			animationOptions.properties = {x: @pointForValue(value) - (@maxKnob.width/2)}
		else
			animationOptions.properties = {y: @pointForValue(value) - (@maxKnob.height/2)}

		@maxKnob.animate(animationOptions)

	##############################################################
	## EVENT HELPERS

	onValueChange: (cb) -> @on(Events.SliderValueChange, cb)
	onMinValueChange: (cb) -> @on(Events.SliderMinValueChange, cb)
	onMaxValueChange: (cb) -> @on(Events.SliderMaxValueChange, cb)
