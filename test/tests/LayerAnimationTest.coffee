assert = require "assert"

AnimationTime = 0.05
AnimationProperties = ["x", "y", "midY", "rotation"]

describe "LayerAnimation", ->

	describe "Defaults", ->

		it "should use defaults", ->

			Framer.Defaults.Animation =
				curve: "spring(1, 2, 3)"

			animation = new Animation new Layer(),
				x: 50

			animation.options.curve.should.equal "spring(1, 2, 3)"

			Framer.resetDefaults()

		it "should use linear", ->

			# We shouldn't change the linear default, people rely on it

			animation = new Animation new Layer(),
				x: 50

			animation.options.curve.should.equal "ease"
			animation.options.time.should.equal 1

	describe "Properties", ->

		AnimationProperties.map (p) ->

			it "should still support the deprecated API for property #{p}", (done) ->

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

			it "should animate property #{p}", (done) ->

				layer = new Layer()

				properties = {}
				properties[p] = 100
				options =
					curve: "linear"
					time: AnimationTime

				animation = layer.animate properties, options
				animation.options.curve.should.equal "linear"
				layer.on "end", ->
					layer[p].should.equal 100
					done()

			it "should support options key for property #{p}", (done) ->
				layer = new Layer()

				properties = {}
				properties[p] = 100
				properties.options =
					curve: "linear"
					time: AnimationTime

				animation = layer.animate properties
				animation.options.curve.should.equal "linear"

				layer.on "end", ->
					layer[p].should.equal 100
					done()

			it "should animate property #{p} with positive offset from current value", (done) ->

				layer = new Layer()
				layer[p] = 50

				properties = {}
				properties[p] = "+=50"

				layer.animate properties,
					curve: "linear"
					time: AnimationTime


				layer.on "end", ->
					layer[p].should.equal 100
					done()

			it "should animate property #{p} with negative offset from current value", (done) ->

				layer = new Layer()
				layer[p] = 50

				properties = {}
				properties[p] = "+=50"

				layer.animate properties,
					curve: "linear"
					time: AnimationTime


				layer.on "end", ->
					layer[p].should.equal 100
					done()


		it "should animate dynamic properties", (done) ->

			layer = new Layer()

			layer.animate
				scale: -> layer.scale + 1
				options:
					curve: "linear"
					time: AnimationTime

			layer.on "end", ->
				layer.scale.should.equal 2
				done()

		it "should animate colors", (done) ->

			color = "red"
			layer = new Layer()

			layer.animate
				backgroundColor: color
				options:
					curve: "linear"
					time: AnimationTime

			layer.on "end", ->
				layer.backgroundColor.toName().should.eql color
				done()

		it "should not animate non-animatable properties that are set to null", ->

			layerA = new Layer
			layerB = new Layer parent: layerA

			layerB.animate
				parent: null
				options:
					instant: true

			assert.equal(layerB.parent, layerA)


	describe "Basic", ->

		it "should stop", (done) ->

			layer = new Layer()

			animation = new Animation layer,
				x: 50
				options:
					curve: "linear"
					time: 0.5

			animation.start()

			Utils.delay animation.options.time / 2.0, ->
				animation.stop()
				layer.x.should.be.within(10, 45)
				done()

		it "should cancel previous animation for the same property", ->

			layer = new Layer()

			animationA = new Animation layer,
				x: 50
				options:
					curve: "linear"
					time: 0.5

			animationB = new Animation layer,
				x: 50
				options:
					curve: "linear"
					time: 0.5

			stopped = false
			animationA.on "stop", -> stopped = true

			animationA.start().should.equal true
			animationB.start().should.equal true

			stopped.should.equal true

		it "should work, even with MobileScrollFix enabled", (done) ->
			layer = new Layer()
			Framer.Extras.MobileScrollFix.enable()
			layer.animationOptions = time: AnimationTime
			animation = layer.animate x: 100
			animation.start()
			Utils.delay animation.options.time, ->
				done()

		it "copy should work", (done) ->
			layer = new Layer
				x: 50
			animation = new Animation layer, {x: 100}, {time: AnimationTime}
			copy = animation.copy()
			copy.onAnimationEnd ->
				layer.x.should.equal 100
				done()
			copy.start()

		it "reverse should work", (done) ->
			layer = new Layer
				x: 50
			animation = new Animation layer, {x: 100}, {time: AnimationTime}
			animation.onAnimationEnd ->
				layer.x.should.equal 100
				a = animation.reverse()
				a.once Events.AnimationEnd, ->
					layer.x.should.equal 50
					done()
				a.start()
			animation.start()

		it "it should set the noop property", ->
			layer = new Layer
			animation = layer.animate
				x: 50
			animation.isNoop.should.be.equal false
			animation.finish()
			layer.x.should.be.equal 50
			animation2 = layer.animate
				x: 50
			animation2.isNoop.should.be.equal true

		it "In shouldn't crash when finish on delayed animation", ->
			layer = new Layer
			animation = layer.animate
				x: 50
				options:
					delay: 1
			animation.finish.should.not.throw()

		it "should work with derived properties like size", (done) ->
			layer = new Layer
			animation = layer.animate
				x: 300
				size:
					width: 400
					height: 500

			animation.onAnimationEnd ->
				layer.x.should.equal 300
				layer.width.should.equal 400
				layer.height.should.equal 500
				done()

		it "should work with using objects that have more properties", (done) ->
			layer = new Layer
			animation = layer.animate
				x: 300
				size: Screen

			animation.onAnimationEnd ->
				layer.x.should.equal 300
				layer.width.should.equal Screen.width
				layer.height.should.equal Screen.height
				done()

		it "should work with a single number for derived properties", (done) ->
			layer = new Layer
			animation = layer.animate
				x: 300
				size: 400

			animation.onAnimationEnd ->
				layer.x.should.equal 300
				layer.width.should.equal 400
				layer.height.should.equal 400
				done()

	describe "Context", ->

		it "should list running animations", ->

			layer = new Layer()
			animation = layer.animate
				x: 100
				options:
					time: 0.5

			(animation in layer.animations()).should.be.true
			layer.animateStop()
			(animation in layer.animations()).should.be.false

		it "should list running animations correctly", (done) ->

			layer = new Layer()

			animation = layer.animate
				x: 100
				options:
					time: 0.5

			count = 0

			test = ->
				layer.animations().length.should.equal 0
				count++

				if count is 2
					done()

			animation.on "end", test
			animation.on "stop", test

		it "shouldn't return delayed animations from layer.animations()", (done) ->
			layer = new Layer()
			animation = layer.animate
				x: 100
				options:
					time: 0.1
					delay: 0.1
			count = 0
			test = ->
				layer.animations().length.should.equal 0
				count++
				if count is 3
					done()
			test()
			animation.on "end", test
			animation.on "stop", test

		it "should return delayed animations when calling layer.animations(true)", (done) ->
			layer = new Layer
			animation = layer.animate
				x: 100
				options:
					time: 0.1
					delay: 0.1
			count = 0
			test = ->
				(animation in layer.animations(true)).should.equal true
				count++
				if count is 2
					done()
			test()
			animation.on "start", test

		it "should tell you if animations are running", ->

			layer = new Layer()
			animation = layer.animate
				x: 100
				options:
					time: 0.5

			layer.isAnimating.should.equal(true)
			layer.animateStop()
			layer.isAnimating.should.equal(false)

		it "should tell you if delayed animations are running", (done) ->
			layer = new Layer()
			animation = layer.animate
				x: 100
				options:
					time: 0.3
					delay: 0.1
			animation.isAnimating.should.equal(false)
			Utils.delay 0.2, ->
				animation.isAnimating.should.equal(true)
				done()


	describe "Events", ->

		it "should throw start", (done) ->

			layer = new Layer()

			animation = new Animation layer,
				x: 50
				options:
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

			animation = new Animation layer,
				x: 50
				options:
					curve: "linear"
					time: AnimationTime

			count = 0
			test = -> count++; done() if count is 2

			animation.on "end", test
			layer.on "end", test

			animation.start()


		it "should throw stop", (done) ->

			layer = new Layer()

			animation = new Animation layer,
				x: 50
				options:
					curve: "linear"
					time: AnimationTime * 2

			count = 0
			test = -> count++; done() if count is 2

			animation.on "stop", test
			layer.on "stop", test

			animation.start()

			Utils.delay AnimationTime, ->
				animation.stop()

	describe "Delay", ->

		it "should start after a while", (done) ->

			layer = new Layer()

			animation = new Animation layer,
				x: 50
				options:
					curve: "linear"
					time: AnimationTime
					delay: AnimationTime

			animation.start()

			Utils.delay AnimationTime, ->
				layer.x.should.be.within(0, 1)
				Utils.delay AnimationTime, ->
					layer.x.should.be.within(30, 50)
					done()

		it "should stop when stopped before delay ends", (done) ->
			layer = new Layer()
			animation = new Animation layer,
				properties: {x: 50}
				curve: "linear"
				time: 0.5
				delay: 0.3

			animation.start()
			animation.stop()
			Utils.delay 0.3, ->
				layer.x.should.equal 0
				Utils.delay 0.5, ->
					layer.x.should.equal 0
					done()

		it "pending flag should be false by default", ->
			layer = new Layer
			a = layer.animate
				x: 100
			a.isPending.should.equal false
			a.stop()

		it "should add a pending flag for delayed animations", (done) ->
			layer = new Layer
			a = layer.animate
				x: 100
				options:
					delay: 0.3
			a.isPending.should.equal true
			Utils.delay 0.3, ->
				a.isPending.should.equal false
				done()

		it "should add pending animations to the context", ->
			layer = new Layer
			a = layer.animate
				x: 100
				options:
					delay: 0.3
			(a in layer.context.animations).should.equal true


	describe "Repeat", ->

		it "should start repeatedly", (done) ->

			layer = new Layer()

			animation = new Animation layer,
				x: -> layer.x + 100
				options:
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

			layerA = new Layer width: 80, height: 80
			layerA.name = "layerA"
			layerA.animate
				y: 300
				options:
					time: 2 * AnimationTime

			layerB = new Layer width: 80, height: 80, x: 100, backgroundColor: "red"
			layerB.name = "layerB"
			layerB.animate
				y: 300
				options:
					time: 5 * AnimationTime

			layerC = new Layer width: 80, height: 80, x: 200, backgroundColor: "orange"
			layerC.name = "layerC"
			layerC.animate
				y: 300
				options:
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
			describe "Curve function", ->
				it "should handle Bezier curve functions", ->
					animation = new Animation @layer,
						x: 100
						options:
							curve: Bezier(0, 0, 0.58, 1)
							time: 2

					animation.start()
					animation._animator.options.time.should.equal 2
					animation._animator.options.values.should.eql [0, 0, .58, 1]

				it "should handle Spring curve functions", ->
					animation = new Animation @layer,
						x: 100
						options:
							curve: Spring(0.5)
							time: 0.5
					animation.start()
					animation._animator.options.time.should.equal 0.5
					animation._animator.options.tension.should.equal 646.8780063665112
					animation._animator.options.friction.should.equal 25.43379653859233
					animation._animator.options.velocity.should.equal 0

				it "should handle Spring curve functions", ->
					animation = new Animation @layer,
						x: 100
						options:
							curve: Spring.tfv(6, 3, 1)
					animation.start()
					assert.equal(animation._animator.options.time, null)
					animation._animator.options.tension.should.equal 6
					animation._animator.options.friction.should.equal 3
					animation._animator.options.velocity.should.equal 1

			describe "BezierCurveAnimator", ->

				it "should create animation with bezier curve defined by values array and time in curveOptions", ->
					animation = new Animation @layer,
						x: 100
						options:
							curve: "cubic-bezier"
							curveOptions:
								time: 2
								values: [0, 0, 0.58, 1]

					animation.start()
					animation._animator.options.time.should.equal 2
					animation._animator.options.values.should.eql [0, 0, .58, 1]

				it "should create animation with bezier curve defined by named bezier curve in values and time in curveOptions", ->
					animation = new Animation @layer,
						x: 100
						options:
							curve: "cubic-bezier"
							curveOptions:
								time: 2
								values: "ease-out"

					animation.start()
					animation._animator.options.time.should.equal 2
					animation._animator.options.values.should.eql [0, 0, .58, 1]

				it "should create animation with named bezier curve", ->
					animation = new Animation @layer,
						x: 100
						options:
							curve: "cubic-bezier"
							curveOptions: "ease-out"

					animation.start()
					animation._animator.options.time.should.equal 1
					animation._animator.options.values.should.eql [0, 0, .58, 1]

				it "should create animation with named bezier curve and time", ->
					animation = new Animation @layer,
						x: 100
						options:
							time: 2
							curve: "cubic-bezier"
							curveOptions: "ease-out"

					animation.start()
					animation._animator.options.time.should.equal 2
					animation._animator.options.values.should.eql [0, 0, .58, 1]

				it "should create animation with bezier curve function passed in as a string and time", ->
					animation = new Animation @layer,
						x: 100
						options:
							time: 2
							curve: "cubic-bezier(0, 0, 0.58, 1)"

					animation.start()
					animation._animator.options.time.should.equal 2
					animation._animator.options.values.should.eql [0, 0, .58, 1]

				it "should create animation with bezier curve defined by an array and time", ->
					animation = new Animation @layer,
						x: 100
						options:
							time: 2
							curve: "cubic-bezier"
							curveOptions: [0, 0, 0.58, 1]

					animation.start()
					animation._animator.options.time.should.equal 2
					animation._animator.options.values.should.eql [0, 0, .58, 1]

		describe "LinearAnimator", ->

			it "should create linear animation with time defined outside of curveOptions", ->
				animation = new Animation @layer,
					x: 100
					options:
						curve: "linear"
						time: 2

				animation.start()
				animation._animator.options.time.should.equal 2

			it "should create linear animation with time defined inside curveOptions", ->
				animation = new Animation @layer,
					x: 100
					options:
						curve: "linear"
						curveOptions:
							time: 2

				animation.start()
				animation._animator.options.time.should.equal 2

		describe "Instant", ->

			it "should not animate if animate is disabled", ->

				animation = new Animation @layer,
					x: 100
					options:
						curve: "spring"
						time: 2
						animate: false

				calledEvents = []

				["start", "stop", "end"].map (eventName) ->
					animation.on eventName, ->
						calledEvents.push(eventName)

				animation.start()

				@layer.x.should.equal 100
				calledEvents.should.eql(["start", "stop", "end"])

			it "should listen to instant: true to disable animation", ->
				animation = @layer.animate
					x: 100
					options:
						curve: "spring"
						time: 2
						instant: true
						start: false

				calledEvents = []

				["start", "stop", "end"].map (eventName) ->
					animation.on eventName, ->
						calledEvents.push(eventName)

				animation.start()

				@layer.x.should.equal 100
				calledEvents.should.eql(["start", "stop", "end"])

		describe "Callbacks", ->

			it "should call start", (done) ->
				layer = new Layer
				layer.animate
					x: 100
					options:
						time: AnimationTime
						onStart: ->
							layer.x.should.eql 0
							done()

			it "should call halt", (done) ->
				layer = new Layer
				layer.animate
					x: 100
					options:
						time: AnimationTime
						onHalt: ->
							done()
				layer.animateStop()

			it "should call stop", (done) ->
				layer = new Layer
				layer.animate
					x: 100
					options:
						time: AnimationTime
						onStop: ->
							layer.x.should.eql 100
							done()

			it "should call end", (done) ->
				layer = new Layer
				layer.animate
					x: 100
					options:
						time: AnimationTime
						onEnd: ->
							layer.x.should.eql 100
							done()

		describe "Backwards compatibility", ->

			it "should support the original api", ->

				layer = new Layer()

				animation = new Animation
					layer: layer
					properties:
						x: 50
					curve: "linear"
					time: 0.1

				animation.layer.should.equal layer
				animation.properties.should.eql {x: 50}
				animation.options.curve.should.equal "linear"
				animation.options.time.should.equal 0.1

			it "should support the original api variation 1", ->

				layer = new Layer()

				animation = new Animation layer,
					properties:
						x: 50
					options:
						curve: "linear"
						time: 0.1

				animation.layer.should.equal layer
				animation.properties.should.eql {x: 50}
				animation.options.curve.should.equal "linear"
				animation.options.time.should.equal 0.1


		describe "API Variations", ->

			it "should support properties", (done) ->
				layer = new Layer
				layer.animationOptions = time: AnimationTime
				animation = layer.animate x: 10
				animation.on Events.AnimationEnd, ->
					layer.x.should.equal 10
					done()

			it "should support properties with options", (done) ->
				layer = new Layer
				layer.animationOptions = time: AnimationTime
				animation = layer.animate({x: 10}, {curve: "linear"})
				animation.options.curve.should.equal "linear"
				animation.on Events.AnimationEnd, ->
					layer.x.should.equal 10
					done()

			it "should support properties with options as object", (done) ->
				layer = new Layer
				layer.animationOptions = time: AnimationTime
				animation = layer.animate
					x: 10
					options:
						curve: "linear"

				animation.options.curve.should.equal "linear"
				animation.on Events.AnimationEnd, ->
					layer.x.should.equal 10
					done()

			it "should support properties with options that have undefined curveOptions as object", (done) ->
				layer = new Layer
				layer.animationOptions = time: AnimationTime
				animation = layer.animate
					x: 10
					options:
						curve: "linear"
						curveOptions: undefined

				animation.options.curve.should.equal "linear"
				animation.on Events.AnimationEnd, ->
					layer.x.should.equal 10
				done()

			it "should support states", (done) ->
				layer = new Layer
				layer.animationOptions = time: AnimationTime
				layer.states.test = {x: 10}
				animation = layer.animate "test"
				animation.on Events.AnimationEnd, ->
					layer.x.should.equal 10
					done()

			it "should support state with options", (done) ->
				layer = new Layer
				layer.animationOptions = time: AnimationTime
				layer.states.test = {x: 10}
				animation = layer.animate("test", {curve: "linear"})
				animation.options.curve.should.equal "linear"
				animation.on Events.AnimationEnd, ->
					layer.x.should.equal 10
					done()

			it "should support state with options as object", (done) ->
				layer = new Layer
				layer.animationOptions = time: AnimationTime
				layer.states.test = {x: 10}
				animation = layer.animate "test",
					options:
						curve: "linear"

				animation.options.curve.should.equal "linear"
				animation.on Events.AnimationEnd, ->
					layer.x.should.equal 10
					done()
