describe "BaseClass", ->

	testProperty = (name, fallback) ->
		exportable: true
		default: fallback
		get: -> @_getPropertyValue name
		set: (value) -> @_setPropertyValue name, value
		
	describe "Defaults", ->

		it "should be unique per instance", ->

			class TestClassA extends Framer.BaseClass
				@define "testA", testProperty "testA", 100

			class TestClassB extends Framer.BaseClass
				@define "testB", testProperty "testB", 100

			a = new TestClassA()
			b = new TestClassB()

			a.properties.should.eql {testA: 100}
			b.properties.should.eql {testB: 100}

		class TestClass extends Framer.BaseClass
			@define "width", testProperty "width", 0
			@define "height", testProperty "height", 0

		it "should set defaults", ->
			
			testClass = new TestClass()

			testClass.width.should.equal 0
			testClass.height.should.equal 0

		it "should set defaults on construction", ->
			
			testClass = new TestClass width:100, height:100

			testClass.width.should.equal 100
			testClass.height.should.equal 100

		it "should set a property value", ->
			
			testClass = new TestClass()
			testClass.width = 500

			testClass.width.should.equal 500
			testClass.height.should.equal 0

		it "should set to zero", ->

			class TestClass2 extends Framer.BaseClass
				@define "test", testProperty "test", 100

			testClass = new TestClass2()
			testClass.test.should.equal 100

			testClass.test = 0
			testClass.test.should.equal 0

		it "should override defaults", ->

			testClass = new TestClass
				width: 500

			testClass.width.should.equal 500
			testClass.height.should.equal 0

		it "should get properties", ->

			testClass = new TestClass
				width: 500

			testClass.properties.should.eql
				width: 500
				height: 0

		it "should set properties", ->

			testClass = new TestClass

			testClass.properties.should.eql
				width: 0
				height: 0

			testClass.properties = {width: 500, height: 500}

			testClass.properties.should.eql
				width: 500
				height: 500




		# # # it "should display css", ->
			
		# # # 	testClass = new TestClass width:100

		# # # 	console.log testClass.css()

		# # it "should set properties", ->
			
		# # 	class TestClass3 extends Framer.BaseClass
		# # 		@define "width", new Framer.Property "width", "px", 100

		# # 		testClass = new TestClass3()
		# # 		testClass.width.should.equal 100
