describe "LayerStates", ->
	
	describe "Events", ->

		beforeEach ->
			@layer = new Layer()
			@layer.states.add("a", {x:100, y:100})
			@layer.states.add("b", {x:200, y:200})

		it "should emit willSwitch when switching", (done) ->
			
			test = (previous, current, states) =>
				previous.should.equal 'default'
				current.should.equal 'a'
				@layer.states.state.should.equal 'default'
				done()

			@layer.states.on 'willSwitch', test
			@layer.states.switchInstant 'a'

		it "should emit didSwitch when switching", (done) ->
			
			test = (previous, current, states) =>
				previous.should.equal 'default'
				current.should.equal 'a'
				@layer.states.state.should.equal 'a'
				done()

			@layer.states.on 'didSwitch', test
			@layer.states.switchInstant 'a'


	describe "Defaults", ->
		
		it "should set defaults", ->

			layer = new Layer
			layer.states.add "test", {x:123}
			layer.states.switch "test"

			layer.states._animation.options.curve.should.equal Framer.Defaults.Animation.curve

			Framer.Defaults.Animation =
				curve: "spring(1, 2, 3)"

			layer = new Layer
			layer.states.add "test", {x:456}
			layer.states.switch "test"

			layer.states._animation.options.curve.should.equal "spring(1, 2, 3)"

			Framer.resetDefaults()



	describe "Switch", ->

		it "should switch instant", ->

			layer = new Layer
			layer.states.add
				stateA: {x:123}
				stateB: {y:123}

			layer.states.switchInstant "stateA"
			layer.states.current.should.equal "stateA"
			layer.x.should.equal 123

			layer.states.switchInstant "stateB"
			layer.states.current.should.equal "stateB"
			layer.y.should.equal 123


	describe "Properties", ->

		it "should bring back the 'default' state values when using 'next'", (done) ->

			layer = new Layer
			layer.states.add
				stateA: {x:100, rotation: 90}
				stateB: {x:200, rotation: 180}
			layer.states.animationOptions =
				curve: "linear"
				time: 0.05
			
			layer.x.should.equal 0

			ready = (animation, layer) ->
				switch layer.states.current
					when "stateA"
						layer.x.should.equal 100
						layer.rotation.should.equal 90
						layer.states.next()
					when "stateB"
						layer.x.should.equal 200
						layer.rotation.should.equal 180
						layer.states.next()
					when "default"
						layer.x.should.equal 0
						layer.rotation.should.equal 0
						done()

			layer.on "end", ready
			layer.states.next()
			
		it "should set scroll property", ->

			layer = new Layer
			layer.states.add
				stateA: {scroll:true}
				stateB: {scroll:false}

			layer.states.switchInstant "stateA"
			layer.scroll.should.equal true

			layer.states.switchInstant "stateB"
			layer.scroll.should.equal false

			layer.states.switchInstant "stateA"
			layer.scroll.should.equal true

		it "should set non numeric properties with animation", (done) ->

			layer = new Layer
			layer.states.add
				stateA: {scroll:true, backgroundColor:"red"}

			layer.scroll.should.equal false

			layer.states.on Events.StateDidSwitch, ->
				layer.scroll.should.equal true
				layer.style.backgroundColor.should.equal new Color("red").toString()
				done()

			layer.states.switch "stateA"

		it "should set non and numeric properties with animation", (done) ->

			layer = new Layer
			layer.states.add
				stateA: {x:200, backgroundColor:"red"}

			# layer.scroll.should.equal false
			layer.x.should.equal 0

			layer.states.on Events.StateDidSwitch, ->
				# layer.scroll.should.equal true
				layer.x.should.equal 200
				layer.style.backgroundColor.should.equal new Color("red").toString()
				done()

			layer.states.switch "stateA", {curve:"linear", time:0.1}

		it "should restore the default state when using non exportable properties", ->

			layer = new Layer
			layer.states.add
				stateA: {midX:200}

			layer.x.should.equal 0

			layer.states.switchInstant "stateA"
			layer.x.should.equal 200 - (layer.width // 2)

			layer.states.switchInstant "default"
			layer.x.should.equal 0

