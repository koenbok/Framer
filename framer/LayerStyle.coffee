filterFormat = (value, unit) ->
	"#{Utils.round value, 2}#{unit}"
	# "#{value}#{unit}"

exports.LayerStyle =

	width: (layer) ->
		layer.width + "px"
	
	height: (layer) ->
		layer.height + "px"

	visibility: (layer) ->
		if layer.visible is true
			return "visible"
		return "hidden"

	opacity: (layer) ->
		layer.opacity

	overflow: (layer) ->
		if layer.clip is true
			return "hidden"
		return "visible"

	zIndex: (layer) ->
		layer.index

	webkitFilter: (layer) ->
		"
		blur(#{filterFormat layer.blur, "px"}) 
		brightness(#{filterFormat layer.brightness, "%"}) 
		saturate(#{filterFormat layer.saturate, "%"}) 
		hue-rotate(#{filterFormat layer.hueRotate, "deg"}) 
		contrast(#{filterFormat layer.contrast, "%"}) 
		invert(#{filterFormat layer.invert, "%"}) 
		grayscale(#{filterFormat layer.grayscale, "%"}) 
		sepia(#{filterFormat layer.sepia, "%"})
		"

	webkitTransform: (layer) ->
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




