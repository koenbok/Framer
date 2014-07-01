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
		layer.width + "px"
	
	height: (layer) ->
		layer.height + "px"

	display: (layer) ->
		if layer.visible is true
			return "block"
		return "none"

	opacity: (layer) ->
		layer.opacity

	overflow: (layer) ->
		if layer.scrollHorizontal is true or layer.scrollVertical is true
			return "auto"
		if layer.clip is true
			return "hidden"
		return "visible"

	overflowX: (layer) ->
		if layer.scrollHorizontal is true
			return "scroll"
		if layer.clip is true
			return "hidden"
		return "visible"

	overflowY: (layer) ->
		if layer.scrollVertical is true
			return "scroll"
		if layer.clip is true
			return "hidden"
		return "visible"

	zIndex: (layer) ->
		layer.index

	webkitFilter: (layer) ->

		# This is mostly an optimization for Chrome. If you pass in the webkit filters
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

		if layer._prefer2d
			return exports.LayerStyle.webkitTransformPrefer2d(layer)

		"
		translate3d(#{layer.x}px,#{layer.y}px,#{layer.z}px) 
		scale(#{layer.scale})
		scale3d(#{layer.scaleX},#{layer.scaleY},#{layer.scaleZ})
		skew(#{layer.skew}deg,#{layer.skew}deg) 
		skewX(#{layer.skewX}deg)  
		skewY(#{layer.skewY}deg) 
		rotateX(#{layer.rotationX}deg) 
		rotateY(#{layer.rotationY}deg) 
		rotateZ(#{layer.rotationZ}deg) 
		"


	webkitTransformPrefer2d: (layer) ->

		# This detects if we use 3d properties, if we don't it only uses
		# 2d properties to disable gpu rendering.

		css = []

		if layer.z != 0
			css.push "translate3d(#{layer.x}px,#{layer.y}px,#{layer.z}px)"
		else
			css.push "translate(#{layer.x}px,#{layer.y}px)"

		if layer.scale != 1
			css.push "scale(#{layer.scale})"

		if layer.scaleX != 1 or layer.scaleY != 1 or layer.scaleZ != 1
			css.push "scale3d(#{layer.scaleX},#{layer.scaleY},#{layer.scaleZ})"

		if layer.skew
			css.push "skew(#{layer.skew}deg,#{layer.skew}deg)"

		if layer.skewX
			css.push "skewX(#{layer.skewX}deg)"

		if layer.skewY
			css.push "skewY(#{layer.skewY}deg)"

		if layer.rotationX
			css.push "rotateX(#{layer.rotationX}deg)"

		if layer.rotationY
			css.push "rotateY(#{layer.rotationY}deg)"

		if layer.rotationZ
			css.push "rotateZ(#{layer.rotationZ}deg)"


		return css.join(" ")

		# "
		# translate3d(#{layer.x}px,#{layer.y}px,#{layer.z}px) 
		# scale(#{layer.scale})
		# scale3d(#{layer.scaleX},#{layer.scaleY},#{layer.scaleZ})
		# skew(#{layer.skew}deg,#{layer.skew}deg) 
		# skewX(#{layer.skewX}deg)  
		# skewY(#{layer.skewY}deg) 
		# rotateX(#{layer.rotationX}deg) 
		# rotateY(#{layer.rotationY}deg) 
		# rotateZ(#{layer.rotationZ}deg) 
		# "

	webkitTransformOrigin: (layer) ->
		"#{layer.originX * 100}% #{layer.originY * 100}%"

		# Todo: Origin z is in pixels. I need to read up on this.
		# "#{layer.originX * 100}% #{layer.originY * 100}% #{layer.originZ * 100}%"

	pointerEvents: (layer) ->
		if layer.ignoreEvents
			return "none"
		else
			return "auto"

	boxShadow: (layer) ->

		if not layer.shadowColor
			return ""
		
		return "#{layer.shadowX}px #{layer.shadowY}px #{layer.shadowBlur}px #{layer.shadowSpread}px #{layer.shadowColor}"

	# css: ->
	# 	css = {}
	# 	for k, v of exports.LayerStyle layer
	# 		if k isnt "css"
	# 			css[k] = v()
	# 	css




