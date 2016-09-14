assert = require "assert"
{expect} = require "chai"

describe "LayerStates", ->

	describe "Events", ->

		beforeEach ->
			@layer = new Layer()
			@layer.states.a = {x:100, y:100}
			@layer.states.b = {x:200, y:200}

		it "should emit willSwitch when switching", (done) ->

			test = (previous, current, states) =>
				previous.should.equal 'initial'
				current.should.equal 'a'
				@layer.states.currentName.should.equal 'initial'
				@layer.states.current.should.equal @layer.states.initial
				done()

			@layer.on Events.StateWillSwitch, test
			@layer.animate 'a', instant: true

		it "should emit didSwitch when switching", (done) ->

			test = (previous, current, states) =>
				previous.should.equal 'initial'
				current.should.equal 'a'
				@layer.states.currentName.should.equal 'a'
				@layer.states.current.should.equal @layer.states.a
				done()

			@layer.on Events.StateDidSwitch, test
			@layer.animate 'a', instant: true


	describe "Defaults", ->

		it "should set defaults", ->

			layer = new Layer
			layer.states.test = {x:123}
			animation = layer.animate "test"

			animation.options.curve.should.equal Framer.Defaults.Animation.curve

			Framer.Defaults.Animation =
				curve: "spring(1, 2, 3)"

			layer = new Layer
			layer.states.test = {x:456}
			animation = layer.animate "test"

			animation.options.curve.should.equal "spring(1, 2, 3)"

			Framer.resetDefaults()

	describe "Adding", ->
		describe "when setting multiple states", ->
			it "should override existing states", ->
				layer = new Layer
				layer.states.test = x: 100
				layer.states =
					stateA: x:200
					stateB: scale: 0.5
				assert.deepEqual layer.stateNames, ['initial','stateA','stateB']

			it "should reset the previous and current states", ->
				layer = new Layer
				layer.states.test = x: 100
				layer.switchInstant 'test'
				layer.states =
					stateA: x:200
					stateB: scale: 0.5
				assert.equal layer.states.previousName, null
				layer.states.currentName.should.equal 'initial'




	describe "Switch", ->

		it "should switch instant", ->

			layer = new Layer
			layer.states =
				stateA:
					x:123
				stateB:
					y:123
					options:
						instant: true

			layer.switchInstant "stateA"
			layer.states.currentName.should.equal "stateA"
			layer.x.should.equal 123

			layer.switchInstant "stateB"
			layer.states.currentName.should.equal "stateB"
			layer.y.should.equal 123

		it "should not change html when using switch instant", ->
			layer = new Layer
				html: "fff"
			layer.states.stateA = {x: 100}
			layer.animate 'stateA', instant: true
			layer.html.should.equal "fff"

		it "should switch non animatable properties", ->
			layer = new Layer
			layer.states.stateA = {x: 100, image:"static/test2.png"}
			layer.animate 'stateA', instant: true
			layer.x.should.equal 100
			layer.image.should.equal "static/test2.png"

		it "should not convert html to a color value if used in a state", ->
			layer = new Layer
			layer.states.stateA = {x: 100, html: 'aaa'}
			layer.animate 'stateA', instant: true
			layer.html.should.equal "aaa"

		it "should not change style when going back to initial", ->
			layer = new Layer
			layer.style.fontFamily = "Arial"
			layer.style.fontFamily.should.equal "Arial"

			layer.states =
				test: {x: 500}

			layer.animate "test", instant: true
			layer.x.should.equal 500
			layer.style.fontFamily = "Helvetica"
			layer.style.fontFamily.should.equal "Helvetica"

			layer.animate "initial", instant: true
			layer.x.should.equal 0
			layer.style.fontFamily.should.equal "Helvetica"

		it "should be a no-op to change to the current state", ->
			layer = new Layer
			layer.states.stateA = {x: 100}
			layer.switchInstant 'stateA'
			animation = layer.animate 'stateA', time: 0.05
			assert.equal(animation,null)

		it "should change to a state when the properties defined are not the current", (done) ->
			layer = new Layer
			layer.states.stateA = {x: 100}
			layer.switchInstant 'stateA'
			layer.x = 150
			layer.onStateDidSwitch ->
				layer.x.should.equal 100
				done()
			animation = layer.animate 'stateA', time: 0.05

	describe "Properties", ->

		it "should bring back the 'initial' state values when using 'animateToNextState'", (done) ->

			layer = new Layer
			layer.states =
				stateA: {x:100, rotation: 90, options: time: 0.05}
				stateB: {x:200, rotation: 180, options: time: 0.05}

			layer.x.should.equal 0

			ready = (animation, layer) ->
				switch layer.states.currentName
					when "stateA"
						layer.x.should.equal 100
						layer.rotation.should.equal 90
						layer.animateToNextState()
					when "stateB"
						layer.x.should.equal 200
						layer.rotation.should.equal 180
						layer.animateToNextState(time: 0.05)
					when "initial"
						layer.x.should.equal 0
						layer.rotation.should.equal 0
						done()

			layer.on Events.AnimationEnd, ready
			layer.animateToNextState()

		it "should bring cycle when using 'animateToNextState'", (done) ->

			layer = new Layer

			layer.states.stateA =
				x: 302
				y: 445

			layer.x.should.equal 0

			count = 0
			ready = (animation, layer) ->
				if count == 4
					done()
					return
				count++
				switch layer.states.currentName
					when "stateA"
						layer.x.should.equal 302
						layer.y.should.equal 445
						layer.animateToNextState(time: 0.05)
					when "initial"
						layer.x.should.equal 0
						layer.rotation.should.equal 0
						layer.animateToNextState(time: 0.05)

			layer.on Events.AnimationEnd, ready
			layer.animateToNextState(time: 0.05)

		it "ignoreEvents should not be part of the initial state", ->

			layer = new Layer

			layer.states.stateA =
				backgroundColor: "rgba(255,0,255,1)"

			layer.onClick ->
				layer.animateToNextState()

			layer.x.should.equal 0

			layer.animateToNextState(instant: true)
			layer.animateToNextState(instant: true)
			layer.animateToNextState(instant: true)
			layer.ignoreEvents.should.equal false


		it "should set scroll property", ->

			layer = new Layer
			layer.states =
				stateA: {scroll:true}
				stateB: {scroll:false}

			layer.animate "stateA", instant: true
			layer.scroll.should.equal true

			layer.animate "stateB", instant: true
			layer.scroll.should.equal false

			layer.animate "stateA", instant: true
			layer.scroll.should.equal true

		it "should set non numeric properties with animation", (done) ->

			layer = new Layer
			layer.states =
				stateA: {scroll:true, backgroundColor:"red"}

			layer.scroll.should.equal false

			layer.on Events.StateDidSwitch, ->
				layer.scroll.should.equal true
				layer.style.backgroundColor.should.equal new Color("red").toString()
				done()

			layer.animate "stateA"

		it "should set non and numeric properties with animation", (done) ->

			layer = new Layer
			layer.states =
				stateA: {x:200, backgroundColor:"red"}

			# layer.scroll.should.equal false
			layer.x.should.equal 0

			layer.on Events.StateDidSwitch, ->
				# layer.scroll.should.equal true
				layer.x.should.equal 200
				layer.style.backgroundColor.should.equal new Color("red").toString()
				done()

			layer.animate "stateA", {curve:"linear", time:0.1}

		it "should restore the initial state when using non exportable properties", ->

			layer = new Layer
			layer.states =
				stateA: {midX:200}

			layer.x.should.equal 0

			layer.animate "stateA", instant: true
			layer.x.should.equal 200 - (layer.width // 2)

			layer.animate "initial", instant: true
			layer.x.should.equal 0

		it "should set the parent", ->

			layerA = new Layer
			layerB = new Layer
				parent: layerA
			layerC = new Layer

			layerB.states =
				noParent:
					parent: null
				parentC:
					parent: layerC

			assert.equal(layerB.parent, layerA)
			layerB.animate "parentC", instant: true
			assert.equal(layerB.parent, layerC)
			layerB.animate "noParent", instant: true
			assert.equal(layerB.parent, null)

			layerB.animate "initial", instant: true
			# assert.equal(layerB.parent, layerA)

		it "should set the current and previous states when switching", ->
			layer = new Layer
			layer.states =
				first: x: 100, options: instant: true
				second: y: 200, options: instant: true

			assert.equal(layer.states.previous, null)
			assert.equal(layer.states.current, layer.states.initial)
			layer.animate 'first'
			assert.equal(layer.states.previous, layer.states.initial)
			layer.states.current.should.equal layer.states.first
			layer.x.should.equal 100
			layer.animate 'second'
			assert.equal(layer.states.previous, layer.states.first)
			layer.states.current.should.equal layer.states.second
			layer.y.should.equal 200


		it "should set the initial state when creating a Layer", ->
			layer = new Layer
			layer.states.currentName.should.equal 'initial'
			layer.states.initial.x.should.equal 0
			assert.deepEqual layer.stateNames, ['initial']

		it "should listen to options provided to animateToNextState", ->
			layer = new Layer
			layer.states =
				stateA: x: 300
				stateB: y: 300
			animation = layer.animateToNextState ['stateA','stateB'],
				curve: "linear"
			animation.options.curve.should.equal 'linear'

		it "should correctly switch to next state without using an array animateToNextState", ->
			layer = new Layer
			layer.states =
				stateA: x: 300
				stateB: y: 300
			layer.animateToNextState 'stateA','stateB'
			layer.states.currentName.should.equal 'stateA'
			layer.animateToNextState 'stateA','stateB'
			layer.states.currentName.should.equal 'stateB'
			layer.animateToNextState 'stateA','stateB'
			layer.states.currentName.should.equal 'stateA'

		it "should listen to options provided to animateToNextState when no states are provided", ->
			layer = new Layer
			layer.states.test = x: 300
			animation = layer.animateToNextState
				curve: "linear"
			animation.options.curve.should.equal 'linear'

		it "should throw an error when you try to override a special state", ->
			layer = new Layer
			throwing = ->
				layer.states.initial = x: 300
			expect(throwing).to.throw(/You can't override special state 'initial'/)

		it "should throw an error when one fo the states is a special state", ->
			layer = new Layer
			throwing = ->
				layer.states =
					state: y: 10
					previous: x: 300
			expect(throwing).to.throw(/You can't override special state 'previous'/)

	describe "Options", ->
		it "should listen to layer.options", ->
			layer = new Layer
			layer.animationOptions =
				time: 4
			animation = layer.animate
				x: 100
			animation.options.time.should.equal 4
	describe "Backwards compatibility", ->
		it "should still support layer.states.add", ->
				layer = new Layer
				layer.states.add
					stateA: x: 200
					stateB: scale: 0.5
				assert.deepEqual layer.stateNames, ['initial','stateA','stateB']
				assert.deepEqual layer.states.stateA, x: 200
				assert.deepEqual layer.states.stateB, scale: 0.5

		it "should still support layer.states.remove", ->
			layer = new Layer
			layer.states =
				stateA: x: 200
				stateB: scale: 0.5
			assert.deepEqual layer.stateNames, ['initial','stateA','stateB']
			layer.states.remove 'stateA'
			assert.deepEqual layer.stateNames, ['initial','stateB']

		it "should still support layer.states.switch", (done) ->
			layer = new Layer
			layer.states =
				stateA: x: 200
				stateB: scale: 0.5
			layer.onStateDidSwitch ->
				assert.equal layer.states.currentName, 'stateA'
				done()
			layer.states.switch 'stateA'

		it "should still support layer.states.switchInstant", ->
			layer = new Layer
			layer.states =
				stateA: x: 200
				stateB: scale: 0.5
			layer.states.switchInstant 'stateB'
			assert.equal layer.states.currentName, 'stateB'

		it "should still support layer.states.all", ->
			layer = new Layer
			layer.states =
				stateA: x: 200
				stateB: scale: 0.5
			assert.deepEqual layer.states.all, ['initial','stateA','stateB']

		it "should still support layer.states.states", ->
			layer = new Layer
			layer.states =
				stateA: x: 200
				stateB: scale: 0.5
			assert.deepEqual layer.states.states, ['initial','stateA','stateB']

		it "should still support layer.states.animatingKeys", ->
			layer = new Layer
			layer.states =
				stateA: x: 200, y: 300
				stateB: scale: 0.5
			assert.deepEqual layer.states.animatingKeys(), ["width", "height", "visible", "opacity", "clip", "scrollHorizontal", "scrollVertical", "x", "y", "z", "scaleX", "scaleY", "scaleZ", "scale", "skewX", "skewY", "skew", "originX", "originY", "originZ", "perspective", "perspectiveOriginX", "perspectiveOriginY", "rotationX", "rotationY", "rotationZ", "rotation", "blur", "brightness", "saturate", "hueRotate", "contrast", "invert", "grayscale", "sepia", "shadowX", "shadowY", "shadowBlur", "shadowSpread", "shadowColor", "backgroundColor", "color", "borderColor", "borderWidth", "force2d", "flat", "backfaceVisible", "name", "borderRadius", "html", "image", "scrollX", "scrollY", "mouseWheelSpeedMultiplier", "velocityThreshold", "constrained"]
			delete layer.states.initial
			assert.deepEqual layer.states.animatingKeys(), ["x","y","scale"]

		it "should still support layer.states.next", (done) ->
			layer = new Layer
			layer.states =
				stateA: x: 200
				stateB: scale: 0.5
			layer.onStateDidSwitch ->
				assert.equal layer.states.currentName, 'stateA'
				done()
			layer.states.next()

		it "should still support layer.states.last", (done) ->
			layer = new Layer
			layer.states =
				stateA: x: 200
				stateB: scale: 0.5
			layer.switchInstant 'stateB'
			layer.switchInstant 'stateA'
			layer.switchInstant 'stateB'
			layer.onStateDidSwitch ->
				assert.equal layer.states.currentName, 'stateA'
				done()
			layer.states.last()

		it "should still support layer.states.animationOptions", ->
			layer = new Layer
			layer.states =
				stateA: x: 200
			layer.states.animationOptions =
				time: 4
			animation = layer.animate "stateA"
			animation.options.time.should.equal 4

		it "should work when using one of the deprecated methods as statename", ->
			layer = new Layer
			layer.states =
				add: x: 200
			layer.animate "add", instant: true
			assert.equal layer.states.add.x, 200
			assert.equal layer.x, 200

		it "should work when mixing old and new API's", ->
			layerA = new Layer
			layerA.states =
				add: y: 100
				next: x: 200
			layerB = new Layer
			layerB.states.add
				a: y: 300
				b: x: 400
			layerA.animate "next", instant: true
			layerA.animate "add", instant: true
			assert.equal layerA.states.next.x, 200
			assert.equal layerA.x, 200
			assert.equal layerA.states.add.y, 100
			assert.equal layerA.y, 100
			layerB.states.next(instant: true)
			layerB.states.next(instant: true)
			assert.equal layerB.y, 300
			assert.equal layerB.x, 400
