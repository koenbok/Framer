getTime = Date.now

if performance?.now
	getTime = -> performance.now()

# class Timer
# 	constructor: -> @start()
# 	start: -> @_startTime = getTime()
# 	stop:  -> getTime() - @_startTime

class FPSTimer

	constructor: -> @start()

	start: ->
		@_frameCount = 0
		@_startTime = getTime()

		Framer.Loop.on("render", @_tick)

	stop: ->

		time = getTime() - @_startTime

		Framer.Loop.off("render", @_tick)
		
		results =
			time: time
			frames: @_frameCount
			fps: 1000 / (time / @_frameCount)

		return results

	_tick: =>
		@_frameCount++

_contextLayer = new Layer width:800, height:800, backgroundColor:"white"
_contextLayer.center()
_contextLayer.style.border = "1px solid grey"

run = (options, callback) ->
	
	context = new Framer.Context(name:"TestRun", parent:_contextLayer)
	context.run -> _run options, (results) ->
		context.reset()
		callback(results)

_run = (options, callback) ->

	startTime = getTime()
	results = {}

	LAYERS = for i in [1..options.n]

		layerC = new Layer 
			x: Math.random() * 800, 
			y: Math.random() * 800
	
	results.layers = Framer.CurrentContext._layerList.length
	results.buildTotal = getTime() - startTime
	results.buildLayer = results.buildTotal / results.layers

	t1 = new FPSTimer

	for layer in LAYERS
		
		layer.animate
			properties:
				midX: Math.random() * window.innerWidth, 
				midY: Math.random() * window.innerHeight
			curve: "linear"
			time: 0.1

	layer.on Events.AnimationEnd, ->
		results.fps = t1.stop()
		callback(results)

Utils.domComplete ->

	c = 0

	allResults = []

	minFPS = 50
	tooSlow = 0
	tooSlowMax = 2

	callback = (results) ->

		if results

			allResults.push(results)

			output =  "#{c} - #{results.layers}"
			output += "\tBuild: #{Utils.round(results.buildTotal, 0)}ms /#{Utils.round(results.buildLayer, 2)}ms"
			output += "\tFPS: #{Utils.round(results.fps.fps, 1)}"

			console.log output

			if results.fps.fps < minFPS
				tooSlow++

		# if c < 100 and tooSlow < tooSlowMax
		if c < 30 and tooSlow < tooSlowMax
			c++
			run {n: c * 20}, callback
		else

			buildTotal = Utils.round(Utils.average(_.map(allResults, (i) -> i.buildLayer)), 3) * 1000
			layerTotal = Utils.round(Utils.average(_.map(allResults, (i) -> i.fps.fps / i.layers)), 3) * 1000

			print "#{buildTotal} (build)"
			print "#{layerTotal} (layer)"

			print "BUILD LOOKS SLOW > 440" if buildTotal > 440 
			print "LAYER LOOKS SLOW > 760" if layerTotal > 760 

			window.phantomComplete = true

	callback()




