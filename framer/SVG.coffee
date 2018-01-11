{_} = require "./Underscore"
{Color} = require "./Color"

class SVG

	@validFill = (value) ->
		Color.validColorValue(value) or _.startsWith(value, "url(")

	@toFill = (value) ->
		if _.startsWith(value, "url(")
			return value
		else
			Color.toColor(value)
			
	@updateGradientSVG: (svgLayer) ->
		return if svgLayer.__constructor
		if not Gradient.isGradient(svgLayer.gradient)
			svgLayer._elementGradientSVG?.innerHTML = ""
			return

		if not svgLayer._elementGradientSVG
			svgLayer._elementGradientSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
			svgLayer._element.appendChild svgLayer._elementGradientSVG

		id = "#{svgLayer.id}-gradient"
		svgLayer._elementGradientSVG.innerHTML = """
			<linearGradient id='#{id}' gradientTransform='rotate(#{svgLayer.gradient.angle - 90}, 0.5, 0.5)' >
				<stop offset="0" stop-color='##{svgLayer.gradient.start.toHex()}' stop-opacity='#{svgLayer.gradient.start.a}' />
				<stop offset="1" stop-color='##{svgLayer.gradient.end.toHex()}' stop-opacity='#{svgLayer.gradient.end.a}' />
			</linearGradient>
		"""
		svgLayer.fill = "url(##{id})"

exports.SVG = SVG
