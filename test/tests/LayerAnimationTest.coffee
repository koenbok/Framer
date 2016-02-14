AnimationTime = 0.05
AnimationProperties = ["x", "y", "midY", "rotation"]

describe "LayerAnimation", ->

	describe "Defaults", ->

		it "should use defaults", ->

			Framer.Defaults.Animation =
				curve: "spring(1,2,3)"

			animation = new Animation
				layer: new Layer()
				properties: {x:50}

			animation.options.curve.should.equal "spring(1,2,3)"

			Framer.resetDefaults()

		it "should use linear", ->

			# We shouldn't change the linear default, people rely on it

			animation = new Animation
				layer: new Layer()
				properties: {x:50}

			animation.options.curve.should.equal "ease"
			animation.options.time.should.equal 1

	describe "Properties", ->

		AnimationProperties.map (p) ->

			it "should animate property #{p}", (done) ->

				layer = new Layer()

				properties = {}
				properties[p] = 100

				layer.animate
					properties: properties
					curve: "linear"
					time: AnimationTime

				layer.on "end", ->
					layer[p].should.equal 100
					done()

			it "should animate property #{p} with positive offset from current value", (done) ->

				layer = new Layer()
				layer[p] = 50

				properties = {}
				properties[p] = '+=50'

				layer.animate
					properties: properties
					curve: "linear"
					time: AnimationTime

				layer.on "end", ->
					layer[p].should.equal 100
					done()

			it "should animate property #{p} with negative offset from current value", (done) ->

				layer = new Layer()
				layer[p] = 50

				properties = {}
				properties[p] = '+=50'

				layer.animate
					properties: properties
					curve: "linear"
					time: AnimationTime

				layer.on "end", ->
					layer[p].should.equal 100
					done()

		it "should animate dynamic properties", (done) ->

			layer = new Layer()

			layer.animate
				properties:
					scale: -> layer.scale + 1
				curve: "linear"
				time: AnimationTime

			layer.on "end", ->
				layer.scale.should.equal 2
				done()

		it "should animate colors", (done) ->

			color = "red"
			layer = new Layer()

			layer.animate
				properties:
					backgroundColor: color
				curve: "linear"
				time: AnimationTime

			layer.on "end", ->
				layer.backgroundColor.toName().should.eql color
				done()

	describe "Basic", ->

		it "should stop", (done) ->

			layer = new Layer()

			animation = new Animation
				layer: layer
				properties: {x:50}
				curve: "linear"
				time: 0.5

			animation.start()

			Utils.delay animation.options.time / 2.0, ->
				animation.stop()
				layer.x.should.be.within(10, 40)
				done()

		it "should cancel previous animation for the same property", ->

			layer = new Layer()

			animationA = new Animation
				layer: layer
				properties: {x:50}
				curve: "linear"
				time: 0.5

			animationB = new Animation
				layer: layer
				properties: {x:50}
				curve: "linear"
				time: 0.5

			stopped = false
			animationA.on "stop", -> stopped = true

			animationA.start().should.equal true
			animationB.start().should.equal true

			stopped.should.equal true

	describe "Context", ->

		it "should list running animations", ->

			layer = new Layer()
			animation = layer.animate
				properties: {x: 100}
				time: 0.5

			(animation in layer.animations()).should.be.true
			layer.animateStop()
			(animation in layer.animations()).should.be.false

		it "should list running animations correctly", (done) ->

			layer = new Layer()

			animation = layer.animate
				properties: {x: 100}
				time: 0.5

			count = 0

			test = ->
				layer.animations().length.should.equal 0
				count++

				if count is 2
					done()

			animation.on "end", test
			animation.on "stop", test

		it "should tell you if animations are running", ->

			layer = new Layer()
			animation = layer.animate
				properties: {x: 100}
				time: 0.5

			layer.isAnimating.should.equal(true)
			layer.animateStop()
			layer.isAnimating.should.equal(false)


	describe "Events", ->

		it "should throw start", (done) ->

			layer = new Layer()

			animation = new Animation
				layer: layer
				properties: {x:50}
				curve: "linear"
				time: AnimationTime

			count = 0

			animation.on "start", -> count++
			layer.on "start", -> count++

			animation.start()

			layer.on "end", ->
				count.should.equal 2
				done()

		it "should throw end", (done) ->

			layer = new Layer()

			animation = new Animation
				layer: layer
				properties: {x:50}
				curve: "linear"
				time: AnimationTime

			count = 0
			test = -> count++; done() if count == 2

			animation.on "end", test
			layer.on "end", test

			animation.start()


		it "should throw stop", (done) ->

			layer = new Layer()

			animation = new Animation
				layer: layer
				properties: {x:50}
				curve: "linear"
				time: AnimationTime * 2

			count = 0
			test = -> count++; done() if count == 2

			animation.on "stop", test
			layer.on "stop", test

			animation.start()

			Utils.delay AnimationTime, ->
				animation.stop()

	describe "Delay", ->

		it "should start after a while", (done) ->

			layer = new Layer()

			animation = new Animation
				layer: layer
				properties: {x:50}
				curve: "linear"
				time: AnimationTime
				delay: AnimationTime

			animation.start()

			Utils.delay AnimationTime, ->
				layer.x.should.be.within(0, 1)
				Utils.delay AnimationTime, ->
					layer.x.should.be.within(30, 50)
					done()

	describe "Repeat", ->

		it "should start repeatedly", (done) ->

			layer = new Layer()

			animation = new Animation
				layer: layer
				properties: {x: -> layer.x + 100}
				curve: "linear"
				time: AnimationTime
				repeat: 5

			animation.start()

			count = 0

			layer.on "end", ->
				count++
				if count is animation.options.repeat
					done()


	describe "AnimationLoop", ->

		it "should only stop when all animations are done", (done) ->

			layerA = new Layer width:80, height:80
			layerA.name = "layerA"
			layerA.animate
				properties: {y:300}
				time: 2 * AnimationTime

			layerB = new Layer width:80, height:80, x:100, backgroundColor:"red"
			layerB.name = "layerB"
			layerB.animate
				properties: {y:300}
				time: 5 * AnimationTime

			layerC = new Layer width:80, height:80, x:200, backgroundColor:"orange"
			layerC.name = "layerC"
			layerC.animate
				properties: {y:300}
				time: 2 * AnimationTime
				curve: "cubic-bezier"

			readyLayers = []

			ready = (animation, layer) ->

				(layer in readyLayers).should.equal false

				readyLayers.push layer

				if readyLayers.length is 3
					layerA.y.should.equal 300
					layerB.y.should.equal 300
					layerC.y.should.equal 300
					done()

			layerA.on "end", ready
			layerB.on "end", ready
			layerC.on "end", ready


	describe "Animation", ->

		beforeEach ->
			@layer = new Layer x: 0, y: 0, width: 80, height: 80

		describe "Parsing Animation Options", ->

			describe "BezierCurveAnimator", ->

				it "should create animation with bezier curve defined by values array and time in curveOptions", ->
					animation = new Animation
						layer: @layer
						properties: { x: 100 }
						curve: 'cubic-bezier'
						curveOptions:
							time: 2
							values: [0, 0, 0.58, 1]

					animation.start()
					animation._animator.options.time.should.equal 2
					animation._animator.options.values.should.eql [0, 0, .58, 1]

				it "should create animation with bezier curve defined by named bezier curve in values and time in curveOptions", ->
					animation = new Animation
						layer: @layer
						properties: { x: 100 }
						curve: 'cubic-bezier'
						curveOptions:
							time: 2
							values: 'ease-out'

					animation.start()
					animation._animator.options.time.should.equal 2
					animation._animator.options.values.should.eql [0, 0, .58, 1]

				it "should create animation with named bezier curve", ->
					animation = new Animation
						layer: @layer
						properties: { x: 100 }
						curve: 'cubic-bezier'
						curveOptions: 'ease-out'

					animation.start()
					animation._animator.options.time.should.equal 1
					animation._animator.options.values.should.eql [0, 0, .58, 1]

				it "should create animation with named bezier curve and time", ->
					animation = new Animation
						layer: @layer
						properties: { x: 100 }
						time: 2
						curve: 'cubic-bezier'
						curveOptions: 'ease-out'

					animation.start()
					animation._animator.options.time.should.equal 2
					animation._animator.options.values.should.eql [0, 0, .58, 1]

				it "should create animation with bezier curve function passed in as a string and time", ->
					animation = new Animation
						layer: @layer
						properties: { x: 100 }
						time: 2
						curve: 'cubic-bezier(0, 0, 0.58, 1)'

					animation.start()
					animation._animator.options.time.should.equal 2
					animation._animator.options.values.should.eql [0, 0, .58, 1]

				it "should create animation with bezier curve defined by an array and time", ->
					animation = new Animation
						layer: @layer
						properties: { x: 100 }
						time: 2
						curve: 'cubic-bezier'
						curveOptions: [0, 0, 0.58, 1]

					animation.start()
					animation._animator.options.time.should.equal 2
					animation._animator.options.values.should.eql [0, 0, .58, 1]

		describe "LinearAnimator", ->

			it "should create linear animation with time defined outside of curveOptions", ->
				animation = new Animation
					layer: @layer
					properties: { x: 100 }
					curve: 'linear'
					time: 2

				animation.start()
				animation._animator.options.time.should.equal 2

			it "should create linear animation with time defined inside curveOptions", ->
				animation = new Animation
					layer: @layer
					properties: { x: 100 }
					curve: 'linear'
					curveOptions:
						time: 2

				animation.start()
				animation._animator.options.time.should.equal 2
