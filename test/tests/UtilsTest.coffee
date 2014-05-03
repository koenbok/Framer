
describe "Utils", ->
		
	describe "setDefaultProperties", ->

		it "should set defaults", ->
			
			defaults = x: 100, y: 100

			objectA = Utils.setDefaultProperties {}, defaults

			objectA.x.should.equal 100
			objectA.y.should.equal 100

		it "should override", ->
			
			objectA = {x:1000}
			defaults = x: 100, y: 100

			objectA = Utils.setDefaultProperties objectA, defaults

			objectA.x.should.equal 1000
			objectA.y.should.equal 100

	describe "valueOrDefault", ->

		it "should get a value", ->
			Utils.valueOrDefault(10, 0).should.equal 10

		it "should get the default value", ->
			Utils.valueOrDefault(null, 0).should.equal 0

		# it "should get the fallback value", ->
		# 	Utils.valueOrDefault(undefined, undefined, 0).should.equal 0
	
	describe "arrayToObject", ->

		it "should work", ->
			Utils.arrayToObject([["a", 1], ["b", 2]]).should.eql({"a": 1, "b": 2})

	describe "parseFunction", ->

		it "should work without arguments", ->
			result = Utils.parseFunction "spring"
			result.name.should.equal "spring"
			result.args.should.eql []

		it "should work with a single argument", ->
			result = Utils.parseFunction "spring(100)"
			result.name.should.equal "spring"
			result.args.should.eql ["100"]

		it "should work with multiple arguments", ->
			result = Utils.parseFunction "spring(100,50)"
			result.name.should.equal "spring"
			result.args.should.eql ["100", "50"]

		it "should cleanup arguments", ->
			result = Utils.parseFunction "spring(100 , 50 )"
			result.name.should.equal "spring"
			result.args.should.eql ["100", "50"]

	describe "arrayNext", ->

		it "should work", ->
			Utils.arrayNext(["a", "b", "c"], "a").should.equal "b"
			Utils.arrayNext(["a", "b", "c"], "b").should.equal "c"
			Utils.arrayNext(["a", "b", "c"], "c").should.equal "a"

	describe "arrayPrev", ->

		it "should work", ->
			Utils.arrayPrev(["a", "b", "c"], "a").should.equal "c"
			Utils.arrayPrev(["a", "b", "c"], "b").should.equal "a"
			Utils.arrayPrev(["a", "b", "c"], "c").should.equal "b"

	describe "sizeMax", ->

		it "should work", ->

			Utils.sizeMax([
				{width:100, height:100},
				{width:100, height:100},
			]).should.eql {width:100, height:100}

			Utils.sizeMax([
				{width:1000, height:1000},
				{width:100, height:100},
			]).should.eql {width:1000, height:1000}

	describe "sizeMin", ->

		it "should work", ->

			Utils.sizeMin([
				{width:100, height:100},
				{width:100, height:100},
			]).should.eql {width:100, height:100}

			Utils.sizeMin([
				{width:1000, height:1000},
				{width:100, height:100},
			]).should.eql {width:100, height:100}
		

	describe "frameMerge", ->

		it "should work", ->

			compare = (frames, result) ->
				frame = Utils.frameMerge frames
				for p in ["x", "y", "width", "height"]
					frame[p].should.equal result[p], p

			compare [
				{x:0, y:0, width:100, height:100},
				{x:0, y:0, width:100, height:100},
			],  {x:0, y:0, width:100, height:100}

			compare [
				{x:0, y:0, width:100, height:100},
				{x:0, y:0, width:500, height:500},
			],  {x:0, y:0, width:500, height:500}

			compare [
				{x:0, y:0, width:100, height:100},
				{x:100, y:100, width:500, height:500},
			],  {x:0, y:0, width:600, height:600}

			compare [
				{x:100, y:100, width:100, height:100},
				{x:100, y:100, width:500, height:500},
			],  {x:100, y:100, width:500, height:500}

			# Bla bla. This works. Doing a visual comparison is so much easier
			# Just add this code to some random thing

			# frames = [0..3].map ->
			# 	layer = new Layer
			# 		x: Utils.mapRange Math.random(), 0, 1, 0, 500
			# 		y: Utils.mapRange Math.random(), 0, 1, 0, 500
			# 		width: Utils.mapRange Math.random(), 0, 1, 0, 500
			# 		height: Utils.mapRange Math.random(), 0, 1, 0, 500

			# overLayer = new Layer
			# overLayer.backgroundColor = Utils.randomColor .5
			# overLayer.frame = Utils.frameMerge frames


			