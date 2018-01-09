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

exports.SVG = SVG
