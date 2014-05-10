AnimationTime = 0.05
AnimationProperties = ["x", "y", "rotation"]

describe "LayerAnimation", ->

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

			ready = (animation, layer)->
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





