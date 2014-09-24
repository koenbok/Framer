reactEventMap =
	"mouseup": "onMouseUp"
	"click": "onClick"
	"mouseover": "onMouseOver"
	# onDrag onDragEnd
	# onDragEnter
	# onDragExit
	# onDragLeave
	# onDragOver
	# onDragStart
	# onDrop
	# onMouseDown
	# onMouseEnter
	# onMouseLeave
	# onMouseMove
	# onMouseOut
	# onMouseOver
	# onMouseUp

main = ->

	layerA = new Layer

	layerA.backgroundColor = "red"
	layerA.borderRadius = 10

	# layerB = new Layer x:300

	# layerC = new Layer superLayer:layerB, x:10


	# layerC.backgroundColor = "Red"

	# layerC.image = "https://fbcdn-sphotos-b-a.akamaihd.net/hphotos-ak-xpf1/v/t1.0-9/10525814_10204137411226418_7683209453049109891_n.jpg?oh=dcc7c9b58113dc478a780a84e7c1ffce&oe=5485F5B6&__gda__=1422635977_045b7d67949ebb950ad970187dfb6113"

	# layerA = new Layer
	# layerB = new Layer x:300

	# layerB.on Events.Click, ->
	# 	@animate
	# 		properties: x:500

	# console.log layerB._events

	# # console.log layerA._style

	# for i in [1..50]

	# 	layerC = new Layer 
	# 		x: Math.random() * window.innerWidth, 
	# 		y: Math.random() * window.innerHeight

	# 	layerC.on Events.MouseOver, ->
	# 		@animate
	# 			properties:
	# 				x: Math.random() * window.innerWidth, 
	# 				y: Math.random() * window.innerHeight
	# 			curve: "spring(5,1, 0)"

	pointOnCircle = (cx, cy, r, a) ->
		point = 
			x: cx + r * Math.sin(a)
			y: cy + r * Math.cos(a)

	radians = (degrees) -> degrees * (Math.PI / 180)
	degrees = (radians) -> radians * (180 / Math.PI)


	circle = new Layer width:200, height:200
	circle.borderRadius = circle.height
	circle.backgroundColor = "rgba(255, 100, 100, 0.1)"
	circle.center()


	n = 20

	for i in [1..n]
		
		layer = new Layer midX:circle.midX, midY:circle.midY, width:50, height:50
		layer.borderRadius = layer.height	
		
		
		point = pointOnCircle circle.midX, circle.midY, circle.width/2, radians(360.0 / n * i)
			
		layer.animate
			properties:
				x: point.x - layer.width  / 2.0
				y: point.y - layer.height / 2.0
			curve: "spring(100,20,-)"
			delay: 0.05 * i

main()

# eventMap =
# 	Events.Click: "onClick"

# reactElementList = (layers) ->
# 	_.map(layers, (layer) -> layer._reactElement())

# clicker = (e) -> console.log "click", e

# Layer::_reactElement = ->

# 	options = 
# 		className: "framerLayer"
# 		style: @_style

# 	# todo: make this work on the moment you add an event
# 	for eventName in _.keys(@_events)
# 		if reactEventMap.hasOwnProperty(eventName)
# 			options[reactEventMap[eventName]] = (e) => @emit(eventName, e)
	

# 	React.DOM.div(options, null, reactElementList(@subLayers)...)


# FramerApplication = React.createClass
# 	render: ->
# 		# Todo: cache the root layers
# 		rootLayers = _.filter(Framer.CurrentContext._layerList, (layer) -> !layer.superLayer)
	
# 		React.DOM.div({style:Framer.Config.rootBaseCSS}, null, reactElementList(rootLayers)...)

		


# start = new Date().getTime()

# contentNode = document.createElement("div")






# css = """
# body {
# 	overflow: hidden;
# 	pointer-events: none
# }

# .framerLayer {
# 	display: block;
# 	position: absolute;
# 	background-repeat: no-repeat;
# 	background-size: cover;
# 	-webkit-overflow-scrolling: touch;
# 	-webkit-box-sizing: border-box;
# 	-webkit-user-select: none;
# }

# """




# Utils.domComplete ->
# 	Utils.insertCSS(css)
# 	document.body.appendChild(contentNode)
# 	main()

# 	Framer.Loop.on "render", ->
# 		React.renderComponent(FramerApplication(), contentNode)


