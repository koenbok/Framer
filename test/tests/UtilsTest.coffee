
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

	describe "arrayFromArguments", ->

		it "should work", ->

			f = -> return Utils.arrayFromArguments arguments

			f("a").should.eql ["a"]
			f("a", "b").should.eql ["a", "b"]
			
			f(["a"]).should.eql ["a"]
			f(["a", "b"]).should.eql ["a", "b"]

			f("monkey").should.eql ["monkey"]
			f(["monkey"]).should.eql ["monkey"]

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

	describe "pathJoin", ->

		it "should work", ->
			Utils.pathJoin("test", "monkey").should.equal "test/monkey"


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
			# Start the cactus project and go to /test.html

	describe "domLoadData", (callback) ->

		it "should load data async", (callback) ->

			data = Utils.domLoadData "static/test.txt", (err, data) ->
				data.should.equal "TEST HELLO"
				callback()

		it "should load throw error on nonexisting", (callback) ->

			data = Utils.domLoadData "static/test123.txt", (err, data) ->
				err.should.equal true
				callback()

	describe "domLoadDataSync", ->

		it "should load data async", ->
			data = Utils.domLoadDataSync "static/test.txt"
			data.should.equal "TEST HELLO"

		it "should load throw error on nonexisting", ->

			test = -> Utils.domLoadDataSync("static/nonexisting.txt")
			test.should.throw()

	describe "modulate", ->

		it "should have the right results", ->
			Utils.modulate(0.5, [0, 1], [0, 100]).should.equal 50
			Utils.modulate(1, [0, 1], [0, 100]).should.equal 100
			
			Utils.modulate(2, [0, 1], [0, 100], true).should.equal 100
			Utils.modulate(2, [0, 1], [0, 100], false).should.equal 200

			Utils.modulate(0, [1, 2], [0, 100], true).should.equal 0
			Utils.modulate(0, [1, 2], [0, 100], false).should.equal -100

			Utils.modulate(0, [1, 2], [100, 0], true).should.equal 100
			Utils.modulate(0, [1, 2], [100, 0], false).should.equal 200

	describe "textSize", ->

		# Todo: for some reason these don't work reliable in phantomjs

		text  = "Hello Koen Bok"
		style = {font:"20px/1em Menlo"}

		# it "should return the right size", ->
		# 	Utils.textSize(text, style).should.eql({width:168, height:20})

		# it "should return the right size with width constraint", ->
		# 	Utils.textSize(text, style, {width:100}).should.eql({width:100, height:40})

		# it "should return the right size with height constraint", ->
		# 	Utils.textSize(text, style, {height:100}).should.eql(width:168,height:100)











			