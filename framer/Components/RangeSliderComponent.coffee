Utils = require "../Utils"
{Layer} = require "../Layer"
{Events} = require "../Events"

"""
RangeSliderComponent

minKnob <layer>
maxKnob <layer>
knobSize <width, height>
fill <layer>

min <number>
max <number>
minValue <number>
maxValue <number>

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
			shadowColor: "rgba(0, 0, 0, 0.3)"

		super options

class exports.RangeSliderComponent extends Layer

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

	_touchStart: (event) =>
		event.preventDefault()

		if @width > @height
			touchX = Events.touchEvent(event).clientX - Screen.canvasFrame.x
			scaleX = @canvasScaleX()
			clickedValue = @valueForPoint(touchX / scaleX - @x)

			if clickedValue > @maxValue
				@maxValue = clickedValue
				@maxKnob.draggable._touchStart(event)
				@emit(Events.SliderMaxValueChange, @maxValue)

			if clickedValue < @minValue
				@minValue = clickedValue
				@minKnob.draggable._touchStart(event)
				@emit(Events.SliderMinValueChange, @minValue)

		else
			touchY = Events.touchEvent(event).clientY - Screen.canvasFrame.y
			scaleY = @canvasScaleY()
			clickedValue = @valueForPoint(touchY / scaleY - @y)

			if clickedValue > @maxValue
				@maxValue = clickedValue
				@maxKnob.draggable._touchStart(event)
				@emit(Events.SliderMaxValueChange, @maxValue)

			if clickedValue < @minValue
				@minValue = clickedValue
				@minKnob.draggable._touchStart(event)
				@emit(Events.SliderMinValueChange, @minValue)

		@_updateValue()

	_touchEnd: (event) =>
		@_updateValue()

	_styleKnob: (knob) =>
		knob.parent = @fill.parent = @sliderOverlay.parent = @
		knob.borderRadius = @knobSize / 2

		_.extend knob.draggable,
			enabled: true
			overdrag: false
			momentum: true
			bounce: false
			momentumOptions: {friction: 5, tolerance: 0.25}

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
		@fill.borderRadius =
			topLeft: radius
			bottomLeft: radius

	@define "constrained", @simpleProperty("constrained", false)

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

		if @minKnob.draggable.isMoving
			@emit(Events.SliderMinValueChange, @minValue)

		if @maxKnob.draggable.isMoving
			@emit(Events.SliderMaxValueChange, @maxValue)

	# Retrieve the point (x or y coordinate) of a certain numeric value.
	pointForValue: (value) ->
		for knob in [@minKnob, @maxKnob]

			# For horizontal (default) sliders.
			if @width > @height
				if @constrained
					return Utils.modulate(value, [@min, @max], [0 + (knob.width / 2), @width - (knob.width / 2)], true)
				else
					return Utils.modulate(value, [@min, @max], [0 , @width], true)

			# For vertical sliders.
			else
				if @constrained
					return Utils.modulate(value, [@min, @max], [0 + (knob.height / 2), @height - (knob.height / 2)], true)
				else
					return Utils.modulate(value, [@min, @max], [0, @height], true)

	# Retrieve the numeric value of a certain point (x or y coordinate).
	valueForPoint: (value) ->
		for knob in [@minKnob, @maxKnob]
			# For horizontal (default) sliders.
			if @width > @height
				if @constrained
					return Utils.modulate(value, [0 + (knob.width / 2), @width - (knob.width / 2)], [@min, @max], true)
				else
					return Utils.modulate(value, [0, @width], [@min, @max], true)

			# For vertical sliders.
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
