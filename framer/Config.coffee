Utils = require "./Utils"

exports.Config =
	
	# Animation
	targetFPS: 60
	# defaultBackgroundColor: -> Utils.randomColor 0.5
	defaultBackgroundColor: -> "rgba(0,0,255,0.5)"

	layerBaseCSS:
		"display": "block"
		#"visibility": "visible"
		"position": "absolute"
		# "top": "auto"
		# "right": "auto"
		# "bottom": "auto"
		# "left": "auto"
		# "width": "auto"
		# "height": "auto"
		#"overflow": "visible"
		#"z-index": 0
		"-webkit-box-sizing": "border-box"
		"-webkit-transform-origin": "50% 50% 0%"
		#"-webkit-transform-style": "flat"
		#"-webkit-backface-visibility": "hidden"
		#"-webkit-backface-visibility": ""
		#"-webkit-perspective": 500
		# "pointer-events": "none"
		"background-repeat": "no-repeat"
		"background-size": "cover"