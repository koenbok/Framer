pixelRound = parseInt

center = (layer, property, offset=0) ->

	parent = Screen
	parent = layer.parent if layer.parent

	borderWidth = parent.borderWidth
	borderWidth ?= 0

	x = pixelRound((parent.width / 2) - (layer.width / 2) - borderWidth + offset)
	y = pixelRound((parent.height / 2) - (layer.height / 2) - borderWidth + offset)

	return x if property is "x"
	return y if property is "y"
	return {x:x, y:y} if property is "point"
	return 0

left = (layer, property, offset=0) ->
	throw Error "Align.left only works for x" unless property is "x"
	parent = Screen
	parent = layer.parent if layer.parent
	return pixelRound(0 + offset)

right = (layer, property, offset=0) ->
	throw Error "Align.right only works for x" unless property is "x"
	parent = Screen
	parent = layer.parent if layer.parent
	borderWidth = parent.borderWidth
	borderWidth ?= 0
	return pixelRound(parent.width - (2 * borderWidth) - layer.width + offset)

top = (layer, property, offset=0) ->
	throw Error "Align.top only works for y" unless property is "y"
	parent = Screen
	parent = layer.parent if layer.parent
	return pixelRound(0 + offset)

bottom = (layer, property, offset=0) ->
	throw Error "Align.bottom only works for y" unless property is "y"
	parent = Screen
	parent = layer.parent if layer.parent
	borderWidth = parent.borderWidth
	borderWidth ?= 0
	return pixelRound(parent.height - (2 * borderWidth) - layer.height + offset)

parent = (layer, property, factor=1) ->
	parent = Screen
	parent = layer.parent if layer.parent
	size = {width: parent.width * factor, height: parent.height * factor}
	return size if property is "size"
	return size.width if property is "width"
	return size.height if property is "height"
	return {x: parent.x, y: parent.y, width: size.width, height: size.height} if property is "frame"
	return 0

children = (layer, property, factor=1) ->
	frame = layer.contentFrame()
	size = {width: frame.width * factor, height: frame.height * factor}
	return size if property is "size"
	return size.width if property is "width"
	return size.height if property is "height"
	return {x: frame.x, y: frame.y, width: size.width, height: size.height} if property is "frame"
	return 0

# Helper to see if we are dealing with a function or result of a function
wrapper = (f, name) ->
	align = (a, b) ->
		return ((l, p) -> f(l, p, a)) if not a? or _.isNumber(a)
		return f(a, b)
	align.toInspect = ->
		return "Align.#{name}"
	return align

exports.Align =
	center: wrapper(center, "center")
	left: wrapper(left, "left")
	right: wrapper(right, "right")
	top: wrapper(top, "top")
	bottom: wrapper(bottom, "bottom")
	parent: wrapper(parent, "parent")
	children: wrapper(children, "children")
