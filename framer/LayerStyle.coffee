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

		# This is how I used to do it before, and it works well in Safari
		
		# "
		# blur(#{filterFormat layer.blur, "px"}) 
		# brightness(#{filterFormat layer.brightness, "%"}) 
		# saturate(#{filterFormat layer.saturate, "%"}) 
		# hue-rotate(#{filterFormat layer.hueRotate, "deg"}) 
		# contrast(#{filterFormat layer.contrast, "%"}) 
		# invert(#{filterFormat layer.invert, "%"}) 
		# grayscale(#{filterFormat layer.grayscale, "%"}) 
		# sepia(#{filterFormat layer.sepia, "%"})
		# "

	webkitTransform: (layer) ->
		# TODO: On Chrome it seems that adding any other transform property
		# together with a blur, it breaks the blur and performance. I'll just
		# wait for the Chrome guys to fix this I guess.
		"
		translate3d(#{layer.x}px,#{layer.y}px,#{layer.z}px) 
		scale(#{layer.scale})
		scale3d(#{layer.scaleX},#{layer.scaleY},#{layer.scaleZ}) 
		rotateX(#{layer.rotationX}deg) 
		rotateY(#{layer.rotationY}deg) 
		rotateZ(#{layer.rotationZ}deg) 
		"

	webkitTransformOrigin: (layer) ->
		"#{layer.originX * 100}% #{layer.originY * 100}%"

		# Todo: Origin z is in pixels. I need to read up on this.
		# "#{layer.originX * 100}% #{layer.originY * 100}% #{layer.originZ * 100}%"

	pointerEvents: (layer) ->
		if layer.ignoreEvents
			return "none"
		"auto"


	# css: ->
	# 	css = {}
	# 	for k, v of exports.LayerStyle layer
	# 		if k isnt "css"
	# 			css[k] = v()
	# 	css




