WebKitCSSMatrix::skew = (skew) ->
	return @ if not skew
	rad = skew * Math.PI / 180
	value = Math.tan(rad)
	m = new WebKitCSSMatrix()
	m.m12 = value
	m.m21 = value
	return @multiply(m)

WebKitCSSMatrix::point = (point = {}) ->
	{x, y, z} = _.defaults(point, {x: 0, y: 0, z: 0})
	w = @m14 * x + @m24 * y + @m34 * z + @m44
	w = w or 1
	return point =
		x: (@m11 * x + @m21 * y + @m31 * z + @m41) / w
		y: (@m12 * x + @m22 * y + @m32 * z + @m42) / w
		z: (@m13 * x + @m23 * y + @m33 * z + @m43) / w

exports.Matrix = WebKitCSSMatrix
