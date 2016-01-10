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

class Knob extends Layer

	constructor: (options) ->
		super options

	@define "constrained", @simpleProperty("constrained", false)


class exports.SliderComponent extends Layer

	constructor: (options={}) ->
		options.backgroundColor ?= "#ccc"
		options.borderRadius ?= 50
		options.clip ?= false
		options.width ?= 300
		options.height ?= 10
		options.value ?= 0

		@knob = new Knob
			backgroundColor: "#fff"
			shadowY: 1, shadowBlur: 3
			shadowColor: "rgba(0,0,0,0.35)"
			name: "knob"

		@fill = new Layer
			backgroundColor: "#333"
			width: 0, force2d: true
			name: "fill"

		@knobOverlay = new Layer
			backgroundColor: null
			name: "knobOverlay"

		@sliderOverlay = new Layer
			backgroundColor: null
			name: "sliderOverlay"

		super options

		@knobSize = options.knobSize or 30
		@knob.parent = @fill.parent = @knobOverlay.parent = @sliderOverlay.parent = @

		# Set fill initially
		if @width > @height
			@fill.height = @height
		else
			@fill.width = @width

		# Link knobOverlay to knob
		@knobOverlay.on Events.Move, ->
			if @width > @height
				@knob.x = @x
			else
				@knob.y = @y

		@fill.borderRadius = @sliderOverlay.borderRadius = @borderRadius

		@knob.draggable.enabled = true
		@knob.draggable.overdrag = false
		@knob.draggable.momentum = true
		@knob.draggable.momentumOptions = {friction: 5, tolerance: 0.25}
		@knob.draggable.bounce = false
		@knob.draggable.propagateEvents = false
		@knob.borderRadius = @knobSize / 2
		@knobOverlay.borderRadius = (@knob.borderRadius * 2) + (@hitArea / 4)

		# If hitArea isn't defined, remove the overlays
		if not @hitArea
			@knobOverlay.destroy()
			@sliderOverlay.destroy()

		@_updateFrame()
		@_updateKnob()
		@_updateFill()

		@on("change:size", @_updateFrame)
		@on("change:borderRadius", @_setRadius)
		@knob.on("change:borderRadius", @_setOverlayRadius)

		# Check for vertical sliders
		if @width > @height
			@knob.draggable.speedY = 0
			@knob.on("change:x", @_updateFill)
		else
			@knob.draggable.speedX = 0
			@knob.on("change:y", @_updateFill)

		@knob.on("change:size", @_updateKnob)

		@knob.on Events.Move, =>
			@_updateFrame()
			@_updateValue()

		# On click/touch of the slider, update the value
		@on(Events.TouchStart, @_touchDown)
		@sliderOverlay.on(Events.TouchStart, @_touchDown)

	_touchDown: (event) =>
		event.preventDefault()
		event.stopPropagation()

		offsetX = (@min / @canvasScaleX()) - @min
		offsetY = (@min / @canvasScaleY()) - @min

		if @width > @height
			@value = @valueForPoint(Events.touchEvent(event).clientX - @screenScaledFrame().x) / @canvasScaleX() - offsetX
		else
			@value = @valueForPoint(Events.touchEvent(event).clientY - @screenScaledFrame().y) / @canvasScaleY() - offsetY

		@knob.draggable._touchStart(event)
		@_updateValue()

	_updateFill: =>
		if @width > @height
			@fill.width = @knobOverlay.midX = @knob.midX
		else
			@fill.height = @knobOverlay.midY = @knob.midY

	_updateKnob: =>
		if @width > @height
			@knob.midX = @knobOverlay.midX = @fill.width
			@knob.centerY()

		else
			@knob.midY = @knobOverlay.midX = @fill.height
			@knob.centerX()
			@knobOverlay.midY = @knob.midY

	_updateFrame: =>
		@knob.draggable.constraints =
			x: -@knob.width / 2
			y: -@knob.height / 2
			width: @width + @knob.width
			height: @height + @knob.height

		if @knob.constrained
			@knob.draggable.constraints =
				x: 0
				y: 0
				width: @width
				height: @height

		if @width > @height
			@fill.height = @height
			@knob.centerY()
			@knobOverlay.centerY()
		else
			@fill.width = @width
			@knob.centerX()
			@knobOverlay.centerX()

		@sliderOverlay.center()

	_setRadius: =>
		radius = @borderRadius
		@fill.style.borderRadius = "#{radius}px 0 0 #{radius}px"

	_setOverlayRadius: =>
		@knobOverlay.borderRadius = (@knob.borderRadius * 2) + (@hitArea / 4)

	@define "knobSize",
		get: -> @_knobSize
		set: (value) ->
			@_knobSize = value
			@knob.width = @_knobSize
			@knob.height = @_knobSize
			@_updateFrame()

	@define "hitArea",
		get: -> @_hitArea

		set: (value) ->

			@_hitArea = value

			@knobOverlay.props =
				width: @knobSize or 30 + @_hitArea
				height:	@knobSize or 30 + @_hitArea

			@sliderOverlay.props =
				width: @width + @_hitArea
				height:	@height + @_hitArea

	@define "min",
		get: -> @_min or 0
		set: (value) -> @_min = value

	@define "max",
		get: -> @_max or 1
		set: (value) -> @_max = value

	@define "value",
		get: ->
			if @width > @height
				@valueForPoint(@knob.midX)
			else
				@valueForPoint(@knob.midY)

		set: (value) ->
			if @width > @height
				@knob.midX = @pointForValue(value)
			else
				@knob.midY = @pointForValue(value)

			@_updateFill()
			@_updateValue()

	_updateValue: =>
		@emit("change:value", @value)

	pointForValue: (value) ->
		if @width > @height
			if @knob.constrained
				return Utils.modulate(value, [@min, @max], [0 + (@knob.width / 2), @width - (@knob.width / 2)], true)
			else
				return Utils.modulate(value, [@min, @max], [0 , @width], true)
		else
			if @knob.constrained
				return Utils.modulate(value, [@min, @max], [0 + (@knob.height / 2), @height - (@knob.height / 2)], true)
			else
				return Utils.modulate(value, [@min, @max], [0, @height], true)

	valueForPoint: (value) ->
		if @width > @height
			if @knob.constrained
				return Utils.modulate(value, [0 + (@knob.width / 2), @width - (@knob.width / 2)], [@min, @max], true)
			else
				return Utils.modulate(value, [0, @width], [@min, @max], true)
		else
			if @knob.constrained
				return Utils.modulate(value, [0 + (@knob.height / 2), @height - (@knob.height / 2)], [@min, @max], true)
			else
				return Utils.modulate(value, [0, @height], [@min, @max], true)

	animateToValue: (value, animationOptions={curve:"spring(300,25,0)"}) ->
		if @width > @height
			animationOptions.properties = {x: @pointForValue(value) - (@knob.width/2)}
			@knob.on("change:x", @_updateValue)
		else
			animationOptions.properties = {y: @pointForValue(value) - (@knob.height/2)}
			@knob.on("change:y", @_updateValue)

		@knob.animate(animationOptions)
