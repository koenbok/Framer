filterFormat = (value, unit) ->
	"#{Utils.round value, 2}#{unit}"
	# "#{value}#{unit}"

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
			if layer[layerName] != fallback
				css.push "#{cssName}(#{filterFormat layer[layerName], unit})"

		return css.join(" ")


	webkitTransform: (layer) ->


		# We have a special rendering path for layers that prefer 2d rendering.
		# This definitely decreases performance, but is handy in complex drawing
		# scenarios with rounded corners and shadows where gpu drawing gets weird
		# results.

		if layer._properties._prefer2d
			return exports.LayerStyle.WebkitTransformPrefer2d(layer)

		"
		translate3d(#{layer._properties.x}px,#{layer._properties.y}px,#{layer._properties.z}px) 
		scale(#{layer._properties.scale})
		scale3d(#{layer._properties.scaleX},#{layer._properties.scaleY},#{layer._properties.scaleZ})
		skew(#{layer._properties.skew}deg,#{layer._properties.skew}deg) 
		skewX(#{layer._properties.skewX}deg)  
		skewY(#{layer._properties.skewY}deg) 
		rotateX(#{layer._properties.rotationX}deg) 
		rotateY(#{layer._properties.rotationY}deg) 
		rotateZ(#{layer._properties.rotationZ}deg) 
		"


	webkitTransformPrefer2d: (layer) ->

		# This detects if we use 3d properties, if we don't it only uses
		# 2d properties to disable gpu rendering.

		css = []

		if layer._properties.z != 0
			css.push "translate3d(#{layer._properties.x}px,#{layer._properties.y}px,#{layer._properties.z}px)"
		else
			css.push "translate(#{layer._properties.x}px,#{layer._properties.y}px)"

		if layer._properties.scale != 1
			css.push "scale(#{layer._properties.scale})"

		if layer._properties.scaleX != 1 or layer._properties.scaleY != 1 or layer._properties.scaleZ != 1
			css.push "scale3d(#{layer._properties.scaleX},#{layer._properties.scaleY},#{layer._properties.scaleZ})"

		if layer._properties.skew
			css.push "skew(#{layer._properties.skew}deg,#{layer._properties.skew}deg)"

		if layer._properties.skewX
			css.push "skewX(#{layer._properties.skewX}deg)"

		if layer._properties.skewY
			css.push "skewY(#{layer._properties.skewY}deg)"

		if layer._properties.rotationX
			css.push "rotateX(#{layer._properties.rotationX}deg)"

		if layer._properties.rotationY
			css.push "rotateY(#{layer._properties.rotationY}deg)"

		if layer._properties.rotationZ
			css.push "rotateZ(#{layer._properties.rotationZ}deg)"


		return css.join(" ")

		# "
		# translate3d(#{layer._properties.x}px,#{layer._properties.y}px,#{layer._properties.z}px) 
		# scale(#{layer._properties.scale})
		# scale3d(#{layer._properties.scaleX},#{layer._properties.scaleY},#{layer._properties.scaleZ})
		# skew(#{layer._properties.skew}deg,#{layer._properties.skew}deg) 
		# skewX(#{layer._properties.skewX}deg)  
		# skewY(#{layer._properties.skewY}deg) 
		# rotateX(#{layer._properties.rotationX}deg) 
		# rotateY(#{layer._properties.rotationY}deg) 
		# rotateZ(#{layer._properties.rotationZ}deg) 
		# "

	webkitTransformOrigin: (layer) ->
		"#{layer._properties.originX * 100}% #{layer._properties.originY * 100}%"

		# Todo: Origin z is in pixels. I need to read up on this.
		# "#{layer._properties.originX * 100}% #{layer._properties.originY * 100}% #{layer._properties.originZ * 100}%"

	pointerEvents: (layer) ->
		if layer._properties.ignoreEvents
			return "none"
		else
			return "auto"

	boxShadow: (layer) ->

		if not layer._properties.shadowColor
			return ""
		
		return "#{layer._properties.shadowX}px #{layer._properties.shadowY}px #{layer._properties.shadowBlur}px #{layer._properties.shadowSpread}px #{layer._properties.shadowColor}"


	backgroundColor: (layer) ->
		return layer._properties.backgroundColor

	color: (layer) ->
		return layer._properties.color

	borderRadius: (layer) ->
		return layer._properties.borderRadius + "px"

	border: (layer) ->
		return "#{layer._properties.borderWidth}px solid #{layer._properties.borderWidth}"
		

