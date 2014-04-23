
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