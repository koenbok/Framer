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
		
		@strokeWidth = 1
		@progress = 0
		
		@railsColor = Color.grey(.2)
		@progressColor = Color.grey(1)
		
		@svg.appendChild(@rails)
		@svg.appendChild(@circle)
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

	setProgress: (value, animated=true, animationOptions) ->
		return @progress = value unless animated

		# Use dynamic time relative to the delta in progress. Below is
		# the maximum time to travel from 0 to 1.
		maxTime = 0.25

		animationOptions ?=
			curve: "linear"
			time: Math.abs(@progress - value) * maxTime

		animationOptions = _.extend animationOptions,
			properties:
				progress: Utils.clamp(value, 0, 1)

		@animate(animationOptions)
