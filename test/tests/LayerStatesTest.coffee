assert = require "assert"

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

		it.skip "should convert string to colors in states", ->
			layer = new Layer
			layer.states.test =
					backgroundColor:"fff"
					color: "000"
			layer.states.test.backgroundColor.isEqual(new Color("fff")).should.be.true
			layer.states.test.color.isEqual(new Color("000")).should.be.true



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

			layer.animateTo "stateA",
				instant: true
			layer.states.currentName.should.equal "stateA"
			layer.x.should.equal 123

			layer.animateTo "stateB"
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

			layer.on "end", ready
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
