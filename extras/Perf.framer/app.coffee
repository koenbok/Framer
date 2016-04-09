class FPS

	constructor: ->
		@start()
		
	start: ->
		@_start = Utils.getTime()
		@_time = @_start
		@_frames = []
		Framer.Loop.on("update", @tick)
	
	stop: ->
		Framer.Loop.off("update", @tick)

	tick: =>
		now = Utils.getTime()
		@_frames.push(now - @_time)
		@_time = now
	
	totalTime: ->
		@_time - @_start
		
	
	droppedFrames: ->
		_.filter @_frames, (t) -> t > (1 / 60) * 1.1
	
	droppedFrameRate: ->
		Utils.round(@droppedFrames().length / @totalTime(), 1)
		
	averageFPS: ->
		Utils.round(@_frames.length / Utils.sum(@_frames), 1)

testLayers = (n, options={}, callback) ->
		
	options = _.defaults options,
		width: 500
		height: 500
		time: 1
	
	Framer.CurrentContext.reset()

	counter = 0
	
	endGame = ->
		
		counter++
		
		if counter == n
			fps.stop()
			callback?(fps)
	
	root = new Layer
		width: options.width
		height: options.height
		backgroundColor: "rgba(0, 0, 0, .1)"
	
	root.center()
			
	layers = for i in [0..n]
		
		layer = new Layer
			x: Math.random() * options.width - (.5 * 100)
			y: Math.random() * options.height - (.5 * 100)
			backgroundColor: Color.random(.3)
			superLayer: root

	fps = new FPS

	for layer in layers

		animation = layer.animate
			properties:
				x: Math.random() * options.width
				y: Math.random() * options.height
			time: options.time
		
		animation.on(Events.AnimationEnd, endGame)
		


start = 40
current = start
minFPS = 40
stats = []

next = ->

	testLayers current, {}, (fps) ->
		
		print "#{current} layers at #{fps.averageFPS()} fps"
		
		stats.push([current, fps.averageFPS()])
		current = current + start
		
		if fps.averageFPS() > minFPS
			next()
		else
			Framer.CurrentContext.reset()
			drawChart(stats)

next()


drawChart = (stats) ->
	
	canvasLayer = new Layer
		width: 500
		height: 300
		backgroundColor: "white"
		
	canvasLayer.center()
	canvasLayer.html = """<canvas 
		width='#{canvasLayer.width - 20}px' 
		height='#{canvasLayer.height-20}px'>
	</canvas>"""
	
	canvasElement = canvasLayer.querySelectorAll("canvas")[0]
	
	data =
	    labels: stats.map (i) -> i[0].toString()
	    datasets: [
	        {
	            fillColor: "rgba(220,220,220,0.2)"
	            strokeColor: "rgba(220,220,220,1)"
	            pointColor: "rgba(220,220,220,1)"
	            pointStrokeColor: "#fff"
	            pointHighlightFill: "#fff"
	            pointHighlightStroke: "rgba(220,220,220,1)"
	            data: stats.map (i) -> i[1]
	        }
	    ]
	
	options = {}

	
	lineChart = new Chart(canvasElement.getContext("2d")).Line(data, options)
	
	print Framer.Version

	