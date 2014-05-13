describe "LayerStates", ->
	
	describe "Events", ->
		beforeEach ->
			@layer = new Layer()
			@layer.states.add 'a', x: 100, y: 100
			@layer.states.add 'b', x: 200, y: 200

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
