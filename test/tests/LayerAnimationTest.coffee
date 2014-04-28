AnimationTime = 0.05
AnimationProperties = ["x", "y", "rotation"]


describe "LayerAnimation", ->

	describe "Simple", ->

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


