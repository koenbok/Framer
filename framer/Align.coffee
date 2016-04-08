center = (layer, property, offset=0) ->
	parent = Screen
	parent = layer.parent if layer.parent
	return (parent.width / 2) - (layer.width / 2) + offset if property is "x"
	return (parent.height / 2) - (layer.height / 2) + offset if property is "y"
	return 0

left = (layer, property, offset=0) ->
	throw Error "Align.left only works for x" unless property is "x"
	parent = Screen
	parent = layer.parent if layer.parent
	return 0 + offset

right = (layer, property, offset=0) ->
	throw Error "Align.right only works for x" unless property is "x"
	parent = Screen
	parent = layer.parent if layer.parent
	return parent.width - layer.width + offset

top = (layer, property, offset=0) ->
	throw Error "Align.top only works for y" unless property is "y"
	parent = Screen
	parent = layer.parent if layer.parent
	return 0 + offset

bottom = (layer, property, offset=0) ->
	throw Error "Align.bottom only works for y" unless property is "y"
	parent = Screen
	parent = layer.parent if layer.parent
	return parent.height - layer.height + offset

wrapper = (f) ->
	return (a, b) ->
		return ((l, p) -> f(l, p, a)) if not a? or _.isNumber(a)
		return f(a, b, 0)

exports.Align =
	center: wrapper(center)
	left: wrapper(left)
	right: wrapper(right)
	top: wrapper(top)
	bottom: wrapper(bottom)