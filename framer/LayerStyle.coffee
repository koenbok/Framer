filterFormat = (value, unit) ->
	"#{Utils.round value, 2}#{unit}"
	# "#{value}#{unit}"

roundToZero = (num) ->
	if (-1e-6 < num and num < 1e-6)
		return 0
	return num


# TODO: Ideally these should be read out from the layer defined properties
_WebkitProperties = [
	["blur", "blur", 0, "px"],
	["brightness", "brightness", 100, "%"],
	["saturate", "saturate", 100, "%"],
	["hue-rotate", "hueRotate", 0, "deg"],
	["contrast", "contrast", 100, "%"],
	["invert", "invert", 0, "%"],
	["grayscale", "grayscale", 0, "%"],
	["sepia", "sepia", 0, "%"],
]

_Force2DProperties =
	"z": 0
	"scaleX": 1
	"scaleY": 1
	"scaleZ": 1
	"skewX": 0
	"skewY": 0
	"rotationX": 0
	"rotationY": 0


exports.LayerStyle =

	width: (layer) ->
		layer._properties.width + "px"

	height: (layer) ->
		layer._properties.height + "px"

	display: (layer) ->
		if layer._properties.visible is true
			return "block"
		return "none"

	opacity: (layer) ->
		layer._properties.opacity

	webkitTransformStyle: (layer) ->
		if layer._properties.flat
			return "flat"
		else
			return "preserve-3d"

	webkitBackfaceVisibility: (layer) ->
		if layer._properties.backfaceVisible
			return "visible"
		else
			return "hidden"

	overflow: (layer) ->
		if layer._properties.scrollHorizontal is true or layer._properties.scrollVertical is true
			return "auto"
		if layer._properties.clip is true
			return "hidden"
		return "visible"

	overflowX: (layer) ->
		if layer._properties.scrollHorizontal is true
			return "scroll"
		if layer._properties.clip is true
			return "hidden"
		return "visible"

	overflowY: (layer) ->
		if layer._properties.scrollVertical is true
			return "scroll"
		if layer._properties.clip is true
			return "hidden"
		return "visible"

	zIndex: (layer) ->
		layer._properties.index

	webkitFilter: (layer) ->

		# This is mostly an optimization for Chrome. If you pass in the Webkit filters
		# with the defaults, it still takes a shitty rendering path. So I compare them
		# first and only add the ones that have a non default value.

		css = []

		for [cssName, layerName, fallback, unit] in _WebkitProperties
			if layer._properties.hasOwnProperty(layerName) and layer[layerName] isnt fallback
				css.push("#{cssName}(#{filterFormat(layer[layerName], unit)})")

		return css.join(" ")

	webkitTransform: (layer) ->
		# We have a special rendering path for layers that prefer 2d rendering.
		# This definitely decreases performance, but is handy in complex drawing
		# scenarios with rounded corners and shadows where gpu drawing gets weird
		# results.

		if layer._prefer2d or layer._properties.force2d
			return exports.LayerStyle.webkitTransformForce2d(layer)
		"
		translate3d(
			#{roundToZero(layer._properties.x)}px,
			#{roundToZero(layer._properties.y)}px,
			#{roundToZero(layer._properties.z)}px)
		scale3d(
			#{roundToZero(layer._properties.scaleX * layer._properties.scale)},
			#{roundToZero(layer._properties.scaleY * layer._properties.scale)},
			#{roundToZero(layer._properties.scaleZ)})
		skew(#{roundToZero(layer._properties.skew)}deg,#{roundToZero(layer._properties.skew)}deg)
		skewX(#{roundToZero(layer._properties.skewX)}deg)
		skewY(#{roundToZero(layer._properties.skewY)}deg)
		translateZ(#{roundToZero(layer._properties.originZ)}px)
		rotateX(#{roundToZero(layer._properties.rotationX)}deg)
		rotateY(#{roundToZero(layer._properties.rotationY)}deg)
		rotateZ(#{roundToZero(layer._properties.rotationZ)}deg)
		translateZ(#{roundToZero(-layer._properties.originZ)}px)
		"

	webkitTransformForce2d: (layer) ->

		# This detects if we use 3d properties, if we don't it only uses
		# 2d properties to disable gpu rendering.

		css = []

		for p, v of _Force2DProperties
			if layer._properties[p] isnt v
				console.warn "Layer property '#{p}'' will be ignored with force2d enabled"

		css.push "translate(#{roundToZero(layer._properties.x)}px,#{roundToZero(layer._properties.y)}px)"
		css.push "scale(#{roundToZero(layer._properties.scale)})"
		css.push "skew(#{roundToZero(layer._properties.skew)}deg,#{roundToZero(layer._properties.skew)}deg)"
		css.push "rotate(#{roundToZero(layer._properties.rotationZ)}deg)"

		return css.join(" ")

	webkitTransformOrigin: (layer) ->
		"#{layer._properties.originX * 100}% #{layer._properties.originY * 100}%"

	webkitPerspective: (layer) ->
		"#{layer._properties.perspective}"

	webkitPerspectiveOrigin: (layer) ->
		"#{layer._properties.perspectiveOriginX * 100}% #{layer._properties.perspectiveOriginY * 100}%"

	pointerEvents: (layer) ->
		if layer._properties.ignoreEvents
			return "none"
		else
			return "auto"

	boxShadow: (layer) ->

		props = layer._properties

		if not props.shadowColor
			return ""
		else if props.shadowX is 0 and props.shadowY is 0 and props.shadowBlur is 0 and props.shadowSpread is 0
			return ""

		return "#{layer._properties.shadowX}px #{layer._properties.shadowY}px #{layer._properties.shadowBlur}px #{layer._properties.shadowSpread}px #{layer._properties.shadowColor}"

	textShadow: (layer) ->

		props = layer._properties

		if not props.shadowColor
			return ""
		else if props.shadowX is 0 and props.shadowY is 0 and props.shadowBlur is 0 and props.shadowSpread is 0
			return ""

		return "#{layer._properties.shadowX}px #{layer._properties.shadowY}px #{layer._properties.shadowBlur}px #{layer._properties.shadowColor}"

	backgroundColor: (layer) ->
		return layer._properties.backgroundColor

	color: (layer) ->
		return layer._properties.color

	borderRadius: (layer) ->

		# Compatibility fix, remove later
		if not _.isNumber(layer._properties.borderRadius)
			return layer._properties.borderRadius

		return layer._properties.borderRadius + "px"

	border: (layer) ->
		return "#{layer._properties.borderWidth}px solid #{layer._properties.borderColor}"
