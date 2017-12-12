describe "Layer", ->

	describe "Draggable", ->

		it "should stop x and y animations on drag start", ->

			layer = new Layer
			layer.draggable.enabled = true

			a1 = layer.animate x: 100
			a2 = layer.animate y: 100
			a3 = layer.animate blur: 1

			a1.isAnimating.should.equal true
			a2.isAnimating.should.equal true
			a3.isAnimating.should.equal true

			event = Framer.GestureInputRecognizer._getGestureEvent(document.createEvent("MouseEvent"))
			layer.draggable.touchStart(event)

			a1.isAnimating.should.equal false
			a2.isAnimating.should.equal false
			a3.isAnimating.should.equal true

		describe "Simulation", ->
			it "should be cancelled when animating the same property", (done) ->
				layerA = new Layer
				start = document.createEvent("MouseEvent")
				event = Framer.GestureInputRecognizer._getGestureEvent(start)
				layerA.draggable._touchStart(start)
				time = 0.001
				for i in [0..3]
					do (i) ->
						Utils.delay i*time, ->
							move = document.createEvent("MouseEvent")
							move.touches = [
								{pageX: i, pageY: 0}
							]
							event = Framer.GestureInputRecognizer._getGestureEvent(move)
							event.delta =
								x: i
								y: 0
							layerA.draggable._touchMove(event)
				Utils.delay i*time, ->
					event = Framer.GestureInputRecognizer._getGestureEvent(document.createEvent("MouseEvent"))
					layerA.draggable._touchEnd(event)
				layerA.onDragEnd ->
					simulation = layerA.draggable._simulation.x
					a = @animate
						x: 10
					simulation._running.should.equal false
					a.onAnimationStop (animation) ->
						Utils.delay a.options.time, ->
							layerA.x.should.equal 10
							done()
