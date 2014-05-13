Utils = require "./Utils"

exports.Config =
	
	# Animation
	targetFPS: 60

	rootBaseCSS:
		"-webkit-perspective": 1000
		
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
		"-webkit-transform-style": "preserve-3d"
		"-webkit-backface-visibility": "visible"
		#"-webkit-backface-visibility": ""
		#"-webkit-perspective": 500
		# "pointer-events": "none"
		"background-repeat": "no-repeat"
		"background-size": "cover"
		"-webkit-overflow-scrolling": "touch"