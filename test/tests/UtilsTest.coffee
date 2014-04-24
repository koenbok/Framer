
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