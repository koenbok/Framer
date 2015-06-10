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

class exports.SliderComponent extends Layer

	constructor: (options={}) ->
		options.backgroundColor ?= "#ccc"
		options.borderRadius ?= 50
		options.clip ?= false
		options.width ?= 300
		options.height ?= 10
		options.value ?= 0

		@knob = new Layer
			backgroundColor: "#fff"
			shadowY: 1, shadowBlur: 3
			shadowColor: "rgba(0,0,0,0.35)"

		@fill = new Layer 
			backgroundColor: "#333"
			width: 0, force2d: true

		super options

		@knobSize = options.knobSize or 30
		@knob.superLayer = @fill.superLayer = @

		# Set fill initially
		if @width > @height then @fill.height = @height else @fill.width = @width
		@fill.borderRadius = @borderRadius

		@knob.draggable.enabled = true
		@knob.draggable.overdrag = false
		@knob.draggable.momentum = true
		@knob.draggable.momentumOptions = {friction: 5, tolerance: 0.25}
		@knob.draggable.bounce = false
		@knob.draggable.propagateEvents = false
		@knob.borderRadius = "50%"

		@_updateFrame()
		@_updateKnob()
		@_updateFill()

		@on("change:size", @_updateFrame)
		@on("change:borderRadius", @_setRadius)

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
			
		if @width > @height 
			@fill.height = @height
			@knob.centerY()
		else 
			@fill.width = @width
			@knob.centerX()
			
	_setRadius: =>
		radius = @borderRadius
		@fill.style.borderRadius = "#{radius}px 0 0 #{radius}px"
		
	@define "knobSize",
		get: -> @_knobSize
		set: (value) ->
			@_knobSize = value
			@knob.width = @_knobSize
			@knob.height = @_knobSize
			@_updateFrame()
	
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
				@_updateFill()
			else 
				@knob.midY = @pointForValue(value)
				@_updateFill()
			
	_updateValue: =>
		@emit("change:value", @value)
	
	pointForValue: (value) ->
		if @width > @height
			return Utils.modulate(value, [@min, @max], [0, @width], true)
		else 
			return Utils.modulate(value, [@min, @max], [0, @height], true)
			
	valueForPoint: (value) ->
		if @width > @height
			return Utils.modulate(value, [0, @width], [@min, @max], true)
		else 
			return Utils.modulate(value, [0, @height], [@min, @max], true)
		
	animateToValue: (value, animationOptions={curve:"spring(300,25,0)"}) ->
		if @width > @height
			animationOptions.properties = {x: @pointForValue(value)}
			@knob.on("change:x", @_updateValue)
		else 
			animationOptions.properties = {y: @pointForValue(value)}
			@knob.on("change:y", @_updateValue)

		@knob.animate(animationOptions)
