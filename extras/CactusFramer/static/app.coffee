# Framer.Loop._delta = null

# {Config} = require "./Config"
# {EventEmitter} = require "./EventEmitter"

# if window.performance
# 	getTime = -> window.performance.now()
# else
# 	getTime = -> Date.now()


# class AnimationLoop extends Framer.EventEmitter

# 	constructor: ->
# 		@_delta = 1/60

# 	start: =>
		
# 		animationLoop = @
# 		_timestamp = getTime()

# 		update = ->

# 			timestamp = getTime()
# 			delta = (timestamp - _timestamp) / 1000
# 			_timestamp = timestamp

# 			# if Math.abs(delta - 1/60) > (1/60 / 4)
# 			# 	print "Boom", delta

# 			document.body.style.display = 'none'
# 			document.body.style.offsetHeight;
# 			document.body.style.display='block';

# 			animationLoop.emit("update", delta)
# 			animationLoop.emit("render", delta)

# 		tick = (timestamp) ->
# 			# setTimeout(update, 0)
# 			update()
# 			window.requestAnimationFrame(tick)


# 		tick()

# Framer.Loop = new AnimationLoop()

# Utils.delay 0.2, ->

# 	Framer.Loop.start()



# Welcome to Framer

# Learn how to prototype: http://framerjs.com/learn
# Drop an image on the device, or import a design from Sketch or Photoshop

iconLayer = new Layer 

iconLayer.center()

# Define a set of states with names (the original state is 'default')
iconLayer.states.add
	second: {y:100, scale:0.6, rotationZ:100}
	third:  {y:300, scale:1.3, blur:4}
	fourth: {y:200, scale:0.9, blur:2, rotationZ:200}

# Set the default animation options
iconLayer.states.animationOptions =
	curve: "spring(1,1,0)"

# On a click, go to the next state
iconLayer.on Events.Click, ->
	iconLayer.states.next()