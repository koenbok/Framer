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
			@layer.animateTo 'a', instant: true

		it "should emit didSwitch when switching", (done) ->

			test = (previous, current, states) =>
				previous.should.equal 'initial'
				current.should.equal 'a'
				@layer.states.currentName.should.equal 'a'
				@layer.states.current.should.equal @layer.states.a
				done()

			@layer.on Events.StateDidSwitch, test
			@layer.animateTo 'a', instant: true


	describe "Defaults", ->

		it "should set defaults", ->

			layer = new Layer
			layer.states.test = {x:123}
			animation = layer.animateTo "test"

			animation.options.curve.should.equal Framer.Defaults.Animation.curve

			Framer.Defaults.Animation =
				curve: "spring(1, 2, 3)"

			layer = new Layer
			layer.states.test = {x:456}
			animation = layer.animateTo "test"

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
				layer.switchTo 'test'
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

			layer.switchTo "stateA"
			layer.states.currentName.should.equal "stateA"
			layer.x.should.equal 123

			layer.switchTo "stateB"
			layer.states.currentName.should.equal "stateB"
			layer.y.should.equal 123

		it "should not change html when using switch instant", ->
			layer = new Layer
				html: "fff"
			layer.states.stateA = {x: 100}
			layer.animateTo 'stateA', instant: true
			layer.html.should.equal "fff"

		it "should switch non animatable properties", ->
			layer = new Layer
			layer.states.stateA = {x: 100, image:"static/test2.png"}
			layer.animateTo 'stateA', instant: true
			layer.x.should.equal 100
			layer.image.should.equal "static/test2.png"

		it "should not convert html to a color value if used in a state", ->
			layer = new Layer
			layer.states.stateA = {x: 100, html: 'aaa'}
			layer.animateTo 'stateA', instant: true
			layer.html.should.equal "aaa"

		it "should not change style when going back to initial", ->
			layer = new Layer
			layer.style.fontFamily = "Arial"
			layer.style.fontFamily.should.equal "Arial"

			layer.states =
				test: {x: 500}

			layer.animateTo "test", instant: true
			layer.x.should.equal 500
			layer.style.fontFamily = "Helvetica"
			layer.style.fontFamily.should.equal "Helvetica"

			layer.animateTo "initial", instant: true
			layer.x.should.equal 0
			layer.style.fontFamily.should.equal "Helvetica"

	describe "Properties", ->

		it "should bring back the 'initial' state values when using 'animateToNext'", (done) ->

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
						layer.animateToNext()
					when "stateB"
						layer.x.should.equal 200
						layer.rotation.should.equal 180
						layer.animateToNext()
					when "initial"
						layer.x.should.equal 0
						layer.rotation.should.equal 0
						done()

			layer.on Events.AnimationEnd, ready
			layer.animateToNext()

		it "should set scroll property", ->

			layer = new Layer
			layer.states =
				stateA: {scroll:true}
				stateB: {scroll:false}

			layer.animateTo "stateA", instant: true
			layer.scroll.should.equal true

			layer.animateTo "stateB", instant: true
			layer.scroll.should.equal false

			layer.animateTo "stateA", instant: true
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

			layer.animateTo "stateA"

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

			layer.animateTo "stateA", {curve:"linear", time:0.1}

		it "should restore the initial state when using non exportable properties", ->

			layer = new Layer
			layer.states =
				stateA: {midX:200}

			layer.x.should.equal 0

			layer.animateTo "stateA", instant: true
			layer.x.should.equal 200 - (layer.width // 2)

			layer.animateTo "initial", instant: true
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
			layerB.animateTo "parentC", instant: true
			assert.equal(layerB.parent, layerC)
			layerB.animateTo "noParent", instant: true
			assert.equal(layerB.parent, null)

			layerB.animateTo "initial", instant: true
			# assert.equal(layerB.parent, layerA)

		it "should set the current and previous states when switching", ->
			layer = new Layer
			layer.states =
				first: x: 100, options: instant: true
				second: y: 200, options: instant: true

			assert.equal(layer.states.previous, null)
			assert.equal(layer.states.current, layer.states.initial)
			layer.animateTo('first')
			assert.equal(layer.states.previous, layer.states.initial)
			layer.states.current.should.equal layer.states.first
			layer.x.should.equal 100
			layer.animateTo('second')
			assert.equal(layer.states.previous, layer.states.first)
			layer.states.current.should.equal layer.states.second
			layer.y.should.equal 200


		it "should set the initial state when creating a Layer", ->
			layer = new Layer
			layer.states.currentName.should.equal 'initial'
			layer.states.initial.x.should.equal 0
			assert.deepEqual layer.stateNames, ['initial']

		it "should listen to options provided to animateToNext", ->
			layer = new Layer
			layer.states =
				stateA: x: 300
				stateB: y: 300
			animation = layer.animateToNext ['stateA','stateB'],
				curve: "linear"
			animation.options.curve.should.equal 'linear'

		it "should correctly switch to next state without using an array animateToNext", ->
			layer = new Layer
			layer.states =
				stateA: x: 300
				stateB: y: 300
			layer.animateToNext 'stateA','stateB'
			layer.states.currentName.should.equal 'stateA'
			layer.animateToNext 'stateA','stateB'
			layer.states.currentName.should.equal 'stateB'
			layer.animateToNext 'stateA','stateB'
			layer.states.currentName.should.equal 'stateA'

		it "should listen to options provided to animateToNext when no states are provided", ->
			layer = new Layer
			layer.states.test = x: 300
			animation = layer.animateToNext
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
			layer.options =
				time: 4
			animation = layer.animateTo
				x: 100
			animation.options.time.should.equal 4
