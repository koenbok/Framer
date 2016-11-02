Utils = require "./Utils"

FramerCSS = """
body {
	margin: 0;
}

.framerContext {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
}

.framerLayer {
	display: block;
	position: absolute;
	left: 0;
	top: 0;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	-webkit-overflow-scrolling: touch;
	-webkit-box-sizing: border-box;
	-webkit-user-select: none;
}

.framerLayer input,
.framerLayer textarea,
.framerLayer select,
.framerLayer option,
.framerLayer div[contenteditable=true]
{
	pointer-events: auto;
	-webkit-user-select: auto;
}

.framerDebug {
	padding: 6px;
	color: #fff;
	font: 10px/1em Monaco;
}

"""

# We only apply this to Safari as Chrome actually pixelates this at 1x,
# meaning that all images get really ugly on 2x screens. But for now
# this doesn't work on Safari, only tech preview.

# https://github.com/motif/company/issues/1642

# FramerCSSSafari = """
# @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
# 	.framerLayer {
# 		image-rendering: pixelated;
# 	}
# }
# """

Utils.domComplete ->
	Utils.insertCSS(FramerCSS)
	# Utils.insertCSS(FramerCSSSafari) if Utils.isSafari()
