{SVGLayer} = require "../SVGLayer"

class exports.CircularProgressComponent extends SVGLayer
	
	constructor: (options={}) ->
		super
		
		@backgroundColor = null
		@rotation = -90
		
		@rails = @addShape("circle")
		@rails.setAttribute("fill", "transparent")
		@circle = @addShape("circle")
		@circle.setAttribute("fill", "transparent")
		
		@strokeWidth = 8
		@progress = 0
		
		@railsColor = Color.grey(0, .2)
		@progressColor = Color.grey(0, .6)
		
		@_element.appendChild(@svg)

	@define "radius",
		get: -> @width / 2 - @strokeWidth / 2

	@define "strokeWidth",
		get: -> @_strokeWidth or 1
		set: (value) ->
			
			@_strokeWidth = value
			
			@rails.cx.baseVal.value = @width / 2
			@rails.cy.baseVal.value = @width / 2
			@rails.r.baseVal.value = @radius
			@rails.setAttribute("stroke-width", value)
			
			@circle.cx.baseVal.value = @width / 2
			@circle.cy.baseVal.value = @width / 2
			@circle.r.baseVal.value = @radius
			@circle.setAttribute("stroke-width", value)

	@define "progressColor",
		get: -> @_progressColor or Color.grey(1)
		set: (value) -> @circle.setAttribute("stroke", value)

	@define "railsColor",
		get: -> @_progressColor or Color.grey(.1)
		set: (value) -> @rails.setAttribute("stroke", value)
	
	@define "progress",
		get: -> @_progress or 0
		set: (value) ->
			@_progress = Utils.clamp(value, 0, 1)
			strokeDashArray = (@radius * Math.PI * 2)
			strokeDashOffset = (1 - @progress) * strokeDashArray
			@circle.setAttribute("stroke-dasharray", strokeDashArray)
			@circle.setAttribute("stroke-dashoffset", strokeDashOffset)

	setProgress: (value, animated=true, animationOptions={}) ->
		return @progress = value unless animated

		# If no time was given we use a dynamic time based on the relative distance
		# to animate based on the progress delta. The full circle time is 0.3 by default.
		dynamicTime = Math.abs(@progress - value) * 0.3

		animationOptions = _.defaults animationOptions,
			curve: "linear"
			time: dynamicTime

		animationProperties =
			progress: Utils.clamp(value, 0, 1)

		@animate(animationProperties, animationOptions)
