describe "Layer", ->

	describe "Draggable", ->

		it "should stop x and y animations on drag start", ->

			layer = new Layer
			layer.draggable.enabled = true

			a1 = layer.animate x:100
			a2 = layer.animate y:100
			a3 = layer.animate blur:1

			a1.isAnimating.should.equal true
			a2.isAnimating.should.equal true
			a3.isAnimating.should.equal true

			layer.draggable.touchStart(document.createEvent("MouseEvent"))

			a1.isAnimating.should.equal false
			a2.isAnimating.should.equal false
			a3.isAnimating.should.equal true

		describe "Simulation", ->
			it.only "should be cancelled when animating the same property", (done) ->
				layerA = new Layer
				time = 0.04
				for i in [0..3]
					do (i) ->
						Utils.delay i*time, ->
							move = document.createEvent("MouseEvent")
							move.delta =
								x: i
								y: 0
							move.touches = [
								{clientX: i, clientY: 0}
							]
							layerA.draggable._touchMove(move)
				Utils.delay i*time, ->
					layerA.draggable._touchEnd(document.createEvent("MouseEvent"))
				layerA.onDragEnd ->
					simulation = layerA.draggable._simulation.x
					a = @animate
						x: 10
						options:
							time: 0.1
					simulation._running.should.equal false
					a.onAnimationStop (animation) ->
						Utils.delay 0.1, ->
							layerA.x.should.equal 10
							done()
