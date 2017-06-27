{_} = require "./Underscore"
{Color} = require "./Color"
{Layer, layerProperty} = require "./Layer"

class exports.SVGLayer extends Layer

	constructor: (options={}) ->
		options.backgroundColor ?= null
		options.fill ?= "black"
		super options

	@define "backgroundColor", layerProperty(@, "fill", "fill", null, Color.validColorValue, Color.toColor)

	@define "gradient",
		get: ->
			return @_gradient
		set: (value) ->
			if LinearGradient.isLinearGradient(value)
				@_gradient = value
			else
				gradientOptions = LinearGradient._asPlainObject(value)
				if not _.isEmpty(gradientOptions)
					@_gradient = new LinearGradient(gradientOptions)
				else
					@_gradient = null
			@updateGradientSVG()
			
	updateGradientSVG: =>

		isGradient = LinearGradient.isLinearGradient @_gradient

		if not @_elementGradientSVG and isGradient
			@_elementGradientSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
			@_element.appendChild @_elementGradientSVG

		if isGradient
			id = "#{@id}-gradient"
			@_elementGradientSVG.innerHTML = """
				<linearGradient id='#{id}' gradientTransform='rotate(#{@gradient.angle - 90}, 0.5, 0.5)' >
					<stop offset="0" stop-color='##{@gradient.start.toHex()}' stop-opacity='#{@gradient.start.a}' />
					<stop offset="1" stop-color='##{@gradient.end.toHex()}' stop-opacity='#{@gradient.end.a}' />
				</linearGradient>
			"""
			@style.fill = "url(##{id})"
		else
			@_elementGradientSVG.innerHTML = ""
			@fill = @fill
