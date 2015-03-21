
Utils = require "../Utils"
{Layer} = require "../Layer"
{Events} = require "../Events"

"""
SliderComponent

knob <layer>
knoSize <width, height>
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
		options.clip ?= false
		options.width ?= 200
		options.height ?= 10
		super options
				
		@knob = new Layer
			backgroundColor: "#fff"
			superLayer: @
			shadowY: 1
			shadowBlur: 4
			shadowColor: "rgba(0,0,0,0.4)"
		
		@knob.draggable.enabled = true
		@knob.draggable.speedY = 0
		@knob.draggable.overdrag = false
		@knob.draggable.momentum = true
		@knob.draggable.momentumOptions = 
			friction: 10
			tolerance: 1/10 
		@knob.draggable.bounce = false
		@knob.borderRadius = @knob.width
		
		@fill = new Layer 
			backgroundColor: "#333"
			superLayer: @
			height: @height
			width: 0
		
		@fill.force2d = true
		@knob.placeBefore(@fill)
		
		@_updateFrame()
		@on("change:frame", @_updateFrame)
		@on("change:borderRadius", @_setRadius)
		
		@knob.on("change:x", @_updateFill)
		@knob.on("change:x", @_updateValue)
		
		@on "mousedown", (event) =>
			@value = @valueForPoint(event.x - @screenFrame.x)
			@knob.draggable._touchStart(event)

		@knobSize = options.knobSize or 10
	
	_updateFill: =>
		@fill.width = @knob.midX
		
	_updateFrame: =>
		@knob.draggable.constraints = 
			x: -@knobSize / 2
			y: -@knobSize / 2
			width: @width + @knobSize 
			height: @height + @knobSize 
			
		@knob.centerY()
			
	_setRadius: =>
		radius = @borderRadius
		@fill.style.borderRadius = "#{radius}px 0 0 #{radius}px"
		
	@define "knobSize",
		get: -> @_knobSize
		set: (value) ->
			@_knobSize = value
			@knob.width = @_knobSize
			@knob.height = @_knobSize
			@knob.centerY()
			@_updateFrame()
	
	@define "min",
		get: -> @_min or 0
		set: (value) -> @_min = value

	@define "max",
		get: -> @_max or 1
		set: (value) -> @_max = value
		
	@define "value",
		get: -> @valueForPoint(@knob.midX)
		set: (value) -> @knob.midX = @pointForValue(value)
	
	_updateValue: =>
		@emit("change:value", @value)
	
	pointForValue: (value) ->
		return Utils.modulate(value, [@min, @max], [0, @width], true)
			
	valueForPoint: (value) ->
		return Utils.modulate(value, [0, @width], [@min, @max], true)
		
	animateToValue: (value, animationOptions={curve:"spring(400,30,0)"}) ->
		animationOptions.properties = {x:@pointForValue(value)}
		@knob.animate(animationOptions)