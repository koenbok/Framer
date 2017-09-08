assert = require "assert"

AnimationTime = Framer.Defaults.Animation.time
AnimationProperties = ["x", "y", "midY", "rotation"]

describe "LayerAnimation", ->

	it "should use defaults", ->

		Framer.Defaults.Animation =
			curve: "ease-in"

		animation = new Animation new Layer(),
			x: 50

		animation.options.curve.should.equal Bezier.easeIn

		Framer.resetDefaults()

	it "should handle default spring curves correctly", ->

		Framer.Defaults.Animation =
			curve: Spring(0.5)

		layer = new Layer
		animation = layer.animate
			x: 50

		animation._animator.constructor.name.should.equal "SpringRK4Animator"

		Framer.resetDefaults()


	it "should use linear", ->

		# We shouldn't change the linear default, people rely on it

		animation = new Animation new Layer(),
			x: 50

		animation.options.curve.should.equal Bezier.ease
		animation.options.time.should.equal Framer.Defaults.Animation.time

	describe "Properties", ->

		AnimationProperties.map (p) ->

			it "should still support the deprecated API for property #{p}", (done) ->

				layer = new Layer()

				properties = {}
				properties[p] = 100

				layer.animate
					properties: properties
					curve: "linear"

				layer.on "end", ->
					layer[p].should.equal 100
					done()

			it "should animate property #{p}", (done) ->

				layer = new Layer()

				properties = {}
				properties[p] = 100
				options =
					curve: Bezier.easeInOut

				animation = layer.animate properties, options
				animation.options.curve.should.equal Bezier.easeInOut
				layer.on "end", ->
					layer[p].should.equal 100
					done()

			it "should support options key for property #{p}", (done) ->
				layer = new Layer()

				properties = {}
				properties[p] = 100
				properties.options =
					curve: Bezier.linear

				animation = layer.animate properties
				animation.options.curve.should.equal Bezier.linear

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


				layer.on "end", ->
					layer[p].should.equal 100
					done()


		it "should animate dynamic properties", (done) ->

			layer = new Layer()

			layer.animate
				scale: -> layer.scale + 1
				options:
					curve: "linear"

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

			animationB = new Animation layer,
				x: 50
				options:
					curve: "linear"

			stopped = false
			animationA.on "stop", -> stopped = true

			animationA.start().should.equal true
			animationB.start().should.equal true

			stopped.should.equal true

		it "should work, even with MobileScrollFix enabled", (done) ->
			layer = new Layer()
			Framer.Extras.MobileScrollFix.enable()
			animation = layer.animate x: 100
			animation.start()
			Utils.delay animation.options.time, ->
				done()

		it "copy should work", (done) ->
			layer = new Layer
				x: 50
			animation = new Animation layer, {x: 100}
			copy = animation.copy()
			copy.onAnimationEnd ->
				layer.x.should.equal 100
				done()
			copy.start()

		it "reverse should work", (done) ->
			layer = new Layer
				x: 50
			animation = new Animation layer, {x: 100}
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

			(animation in layer.animations()).should.be.true
			layer.animateStop()
			(animation in layer.animations()).should.be.false

		it "should list running animations correctly", (done) ->

			layer = new Layer()

			animation = layer.animate
				x: 100

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
					time: AnimationTime
					delay: AnimationTime
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
					delay: AnimationTime
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

			layer.isAnimating.should.equal(true)
			layer.animateStop()
			layer.isAnimating.should.equal(false)

		it "should tell you if delayed animations are running", (done) ->
			layer = new Layer()
			animation = layer.animate
				x: 100
				options:
					time: AnimationTime * 2
					delay: AnimationTime
			animation.isAnimating.should.equal(false)
			Utils.delay AnimationTime * 2, ->
				animation.isAnimating.should.equal(true)
				done()


	describe "Events", ->

		it "should throw start", (done) ->

			layer = new Layer()

			animation = new Animation layer,
				x: 50
				options:
					curve: "linear"

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
			time = AnimationTime
			layer = new Layer()
			animation = new Animation layer,
				x: 50
				options:
					curve: "linear"
					time: time
					delay: time

			animation.start()

			Utils.delay time, ->
				layer.x.should.be.within(0, 1)
				Utils.delay time, ->
					layer.x.should.be.within(30, 50)
					done()

		it "should stop when stopped before delay ends", (done) ->
			layer = new Layer()
			animation = new Animation layer,
				properties: {x: 50}
				curve: "linear"
				delay: AnimationTime

			animation.start()
			animation.stop()
			Utils.delay AnimationTime, ->
				layer.x.should.equal 0
				Utils.delay AnimationTime, ->
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
					delay: AnimationTime
			a.isPending.should.equal true
			Utils.delay AnimationTime, ->
				a.isPending.should.equal false
				done()

		it "should add pending animations to the context", ->
			layer = new Layer
			a = layer.animate
				x: 100
				options:
					delay: AnimationTime
			(a in layer.context.animations).should.equal true


	describe "Repeat", ->

		it "should start repeatedly", (done) ->

			layer = new Layer()

			animation = new Animation layer,
				x: -> layer.x + 100
				options:
					curve: "linear"
					repeat: 3

			animation.start()

			count = 0

			layer.on "end", ->
				count++
				if count is animation.options.repeat
					done()


	describe "AnimationLoop", ->

		it "should only stop when all animations are", (done) ->

			layerA = new Layer width: 80, height: 80
			layerA.name = "layerA"
			layerA.animate
				y: 300
				options:
					time: AnimationTime

			layerB = new Layer width: 80, height: 80, x: 100, backgroundColor: "red"
			layerB.name = "layerB"
			layerB.animate
				y: 300
				options:
					time: 2 * AnimationTime

			layerC = new Layer width: 80, height: 80, x: 200, backgroundColor: "orange"
			layerC.name = "layerC"
			layerC.animate
				y: 300
				options:
					time: AnimationTime
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
							curve: Spring(tension: 6, friction: 3, velocity: 1)
					animation.start()
					assert.equal(animation._animator.options.time, null)
					animation._animator.options.tension.should.equal 6
					animation._animator.options.friction.should.equal 3
					animation._animator.options.velocity.should.equal 1

			describe "Spring Animator", ->
				it "should create an animator with the default spring", ->
					animation = new Animation @layer,
						x: 100
						options:
							curve: "spring"

					animation.start()
					animatorOptions = animation._animator.options
					animatorOptions.tension.should.equal 250
					animatorOptions.friction.should.equal 25
					animatorOptions.velocity.should.equal 0


		describe "LinearAnimator", ->

			it "should create linear animation with time defined", ->
				animation = new Animation @layer,
					x: 100
					options:
						curve: "linear"
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
						onStart: ->
							layer.x.should.eql 0
							done()

			it "should call halt", (done) ->
				layer = new Layer
				layer.animate
					x: 100
					options:
						onHalt: ->
							done()
				layer.animateStop()

			it "should call stop", (done) ->
				layer = new Layer
				layer.animate
					x: 100
					options:
						onStop: ->
							layer.x.should.eql 100
							done()

			it "should call end", (done) ->
				layer = new Layer
				layer.animate
					x: 100
					options:
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
				animation.options.curve.should.equal Bezier.linear
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
				animation.options.curve.should.equal Bezier.linear
				animation.options.time.should.equal 0.1


		describe "API Variations", ->

			it "should support properties", (done) ->
				layer = new Layer
				animation = layer.animate x: 10
				animation.on Events.AnimationEnd, ->
					layer.x.should.equal 10
					done()

			it "should support properties with options", (done) ->
				layer = new Layer
				animation = layer.animate({x: 10}, {curve: "linear"})
				animation.options.curve.should.equal Bezier.linear
				animation.on Events.AnimationEnd, ->
					layer.x.should.equal 10
					done()

			it "should support properties with options as object", (done) ->
				layer = new Layer
				animation = layer.animate
					x: 10
					options:
						curve: "linear"

				animation.options.curve.should.equal Bezier.linear
				animation.on Events.AnimationEnd, ->
					layer.x.should.equal 10
					done()

			it "should support states", (done) ->
				layer = new Layer
				layer.states.test = {x: 10}
				animation = layer.animate "test"
				animation.on Events.AnimationEnd, ->
					layer.x.should.equal 10
					done()

			it "should support state with options", (done) ->
				layer = new Layer
				layer.states.test = {x: 10}
				animation = layer.animate("test", {curve: "linear"})
				animation.options.curve.should.equal Bezier.linear
				animation.on Events.AnimationEnd, ->
					layer.x.should.equal 10
					done()

			it "should support state with options as object", (done) ->
				layer = new Layer
				layer.states.test = {x: 10}
				animation = layer.animate "test",
					options:
						curve: "linear"

				animation.options.curve.should.equal Bezier.linear
				animation.on Events.AnimationEnd, ->
					layer.x.should.equal 10
					done()

	describe "Gradients", ->

		it "should animate only the subproperties", (done) ->
			layer = new Layer
			layer.gradient =
				start: "blue"
			layer.states.test =
				gradient:
					end: "red"
			animation = layer.animate "test"
			animation.on Events.AnimationEnd, ->
				layer.gradient.start.isEqual("blue").should.be.true
				layer.gradient.end.isEqual("red").should.be.true
				done()

		it "should animate if no gradient is set yet", (done) ->
			layer = new Layer
			layer.on "change:gradient", ->
				if layer.gradient
					layer.gradient.start.b.should.equal 255
			layer.on Events.AnimationEnd, ->
				layer.gradient.start.isEqual("blue").should.be.true
				done()
			layer.animate
				gradient:
					start: "blue"

		it "should animate to a null gradient", (done) ->
			layer = new Layer
				gradient:
					start: "blue"
					end: "red"
			layer.on Events.AnimationEnd, ->
				assert.equal layer.gradient, null
				done()
			layer.animate
				gradient: null

		it "should animate to a gradient object", (done) ->
			layer = new Layer
				gradient:
					start: "blue"
			layer2 = new Layer
				gradient:
					end: "red"
			layer.on Events.AnimationEnd, ->
				Gradient.equal(layer.gradient, layer2.gradient).should.be.true
				done()
			layer.animate
				gradient: layer2.gradient

		it "should animate to a gradient object in a state", (done) ->
			layer = new Layer
				gradient:
					start: "blue"
			layer2 = new Layer
				gradient:
					end: "red"
			layer.states.test =
				gradient: layer2.gradient
			layer.on Events.AnimationEnd, ->
				Gradient.equal(layer.gradient, layer2.gradient).should.be.true
				done()
			layer.animate "test"

	describe "Border radius animations", ->

		it "should animate border radius from number to number", (done) ->
			layer = new Layer
				borderRadius: 20
			layer.on Events.AnimationEnd, ->
				layer.borderRadius.should.equal 40
				done()
			layer.animate
				borderRadius: 40

		it "should animate border radius from number to object", (done) ->
			layer = new Layer
				borderRadius: 20
			layer.on Events.AnimationEnd, ->
				layer.borderRadius.bottomLeft.should.equal 40
				layer.borderRadius.bottomRight.should.equal 20
				done()
			layer.animate
				borderRadius:
					bottomLeft: 40

		it "should animate border radius from object to object", (done) ->
			layer = new Layer
				borderRadius:
					bottomLeft: 40
					bottomRight: 20
			layer.on Events.AnimationEnd, ->
				layer.borderRadius.bottomLeft.should.equal 10
				layer.borderRadius.bottomRight.should.equal 20
				layer.borderRadius.topLeft.should.equal 0
				layer.borderRadius.topRight.should.equal 20
				done()
			layer.animate
				borderRadius:
					bottomLeft: 10
					topRight: 20

		it "should animate border radius from object to number", (done) ->
			layer = new Layer
				borderRadius:
					bottomLeft: 40
			layer.on Events.AnimationEnd, ->
				layer.borderRadius.should.equal 20
				done()
			layer.animate
				borderRadius: 20

		it "should not touch border radius if its a string", (done) ->
			layer = new Layer
				borderRadius: "100%"
			layer.states.test =
				scale: 1.5
			layer.stateSwitch "test"
			layer.on Events.AnimationEnd, ->
				layer.borderRadius.should.equal "100%"
				done()
			layer.stateCycle()

	describe "Border width animations", ->

		it "should animate border width from number to number", (done) ->
			layer = new Layer
				borderWidth: 10
			layer.on Events.AnimationEnd, ->
				layer.borderWidth.should.equal 30
				done()
			layer.animate
				borderWidth: 30

		it "should animate border width from number to object", (done) ->
			layer = new Layer
				borderWidth: 10
			layer.on Events.AnimationEnd, ->
				layer.borderWidth.top.should.equal 30
				layer.borderWidth.bottom.should.equal 10
				done()
			layer.animate
				borderWidth:
					top: 30

		it "should animate border width from object to object", (done) ->
			layer = new Layer
				borderWidth:
					top: 30
					bottom: 10
			layer.on Events.AnimationEnd, ->
				layer.borderWidth.top.should.equal 10
				layer.borderWidth.bottom.should.equal 10
				layer.borderWidth.left.should.equal 20
				layer.borderWidth.right.should.equal 0
				done()
			layer.animate
				borderWidth:
					top: 10
					left: 20

		it "should animate border width from object to number", (done) ->
			layer = new Layer
				borderWidth:
					top: 30
			layer.on Events.AnimationEnd, ->
				layer.borderWidth.should.equal 10
				done()
			layer.animate
				borderWidth: 10

	describe "template animations", ->

		it "should animate", (done) ->
			textLayer = new TextLayer({text: "{distance}{unit}"})
			textLayer.templateFormatter =
				distance: (v) -> (v / 1000).toFixed(2)
			textLayer.template =
				unit: "KM"
			textLayer.animate
				template: 8000
			textLayer.on Events.AnimationEnd, ->
				textLayer.text.should.equal "8.00KM"
				done()

		it "should work with a start template value", (done) ->
			textLayer = new TextLayer({text: "{distance}{unit}"})
			textLayer.templateFormatter =
				distance: (v) -> (v / 1000).toFixed(2)
			textLayer.template =
				unit: "KM"
			textLayer.template = 0
			textLayer.animate
				template: 8000
			textLayer.on Events.AnimationEnd, ->
				textLayer.text.should.equal "8.00KM"
				done()

		it "should work with multiple properties and formatters", (done) ->
			textLayer = new TextLayer({text: "{distance}{unit}-{scale}"})
			textLayer.templateFormatter =
				distance: (v) -> (v / 1000).toFixed(2)
			textLayer.template =
				unit: "KM"
			textLayer.animate
				template:
					distance: 8000
					scale: "HEAVY"
			textLayer.on Events.AnimationEnd, ->
				textLayer.text.should.equal "8.00KM-HEAVY"
				done()
