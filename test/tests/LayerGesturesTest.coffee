simulate = require "simulate"

describe "LayerGestures", ->
	

	# describe "Simulation", ->

		# it "should work with Tap", (done) ->

		# 	layer = new Layer

		# 	layer.gestures.onTap ->
		# 		done()

		# 	simulate.mousedown(layer._element)

	describe "Gesture events", ->

		it "should not be listened to until a listener is added", ->
			
			layer = new Layer()
			layer.ignoreEvents.should.equal true

			layer.on Events.Pinch, ->
				console.log "hello"

			layer.ignoreEvents.should.equal false

		it "should call the handler when added and do nothing when removed", ->

			layer = new Layer
			
			pinchCount = 0

			handler = ->
				pinchCount++

			layer.on Events.Pinch, handler

			layer.emit Events.Pinch
			pinchCount.should.equal 1

			layer.off Events.Pinch, handler

			layer.emit Events.Pinch
			pinchCount.should.equal 1

		it "should only run once when using 'once'", ->
			
			layerA = new Layer
			count = 0

			layerA.once Events.Pinch, (layer) ->
				count++
				layerA.should.equal layer

			for i in [0..10]
				layerA.emit(Events.Pinch)

			count.should.equal 1

		it "should list all gesture events", ->
			layerA = new Layer
			handler = -> console.log "hello"
			layerA.on(Events.Pinch, handler)
			layerA.listeners(Events.Pinch).length.should.equal 1

		it "should remove all gesture events", ->
			layerA = new Layer
			handler = -> console.log "hello"
			layerA.on(Events.Pinch, handler)
			layerA.removeAllListeners(Events.Pinch)
			layerA.listeners(Events.Pinch).length.should.equal 0

		it "should route a gesture event to the gesture event manager", ->

			context = new Framer.Context name:"test123"

			context.run ->
				layerA = new Layer
				
				layerA.on Gestures.Pinch, ->
				layerA._domEventManager.listenerEvents().should.eql [
					"touchstart", "touchmove", "touchend", "touchcancel", "mousedown"]

				layerA.off Gestures.Pinch, ->
				layerA._domEventManager.listenerEvents().should.eql []
