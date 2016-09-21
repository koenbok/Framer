describe "BaseClass", ->

	testProperty = (name, fallback) ->
		exportable: true
		default: fallback
		get: -> @_getPropertyValue name
		set: (value) -> @_setPropertyValue name, value


	it "should be unique per instance", ->

		class TestClassA extends Framer.BaseClass
			@define "testA", testProperty "testA", 100

		class TestClassB extends Framer.BaseClass
			@define "testB", testProperty "testB", 100

		a = new TestClassA()
		b = new TestClassB()

		a.props.should.eql {testA: 100}
		b.props.should.eql {testB: 100}

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

	it "should get props", ->

		testClass = new TestClass
			width: 500

		testClass.props.should.eql
			width: 500
			height: 0

	it "should set props", ->

		testClass = new TestClass

		testClass.props.should.eql
			width: 0
			height: 0

		testClass.props = {width: 500, height: 500}

		testClass.props.should.eql
			width: 500
			height: 500

	it "should have keys", ->

		class TestClass3 extends Framer.BaseClass
			@define "testA", @simpleProperty "testA", 100
			@define "testB", @simpleProperty "testB", 100

		testClass = new TestClass3()
		testClass.keys().should.eql ["testA", "testB"]

	it "should have keys", ->

		class TestClass3 extends Framer.BaseClass
			@define "testA", @simpleProperty "testA", 100
			@define "testB", @simpleProperty "testB", 100

		testClass = new TestClass3()
		testClass.keys().should.eql ["testA", "testB"]

	# it "should create getters/setters", ->

	# 	class TestClass4 extends Framer.BaseClass
	# 		@define "testA", @simpleProperty "testA", 100

	# 	testClass = new TestClass4()
	# 	testClass.setTestA(500)
	# 	testClass.getTestA().should.equal 500
	# 	testClass.testA.should.equal 500

	# it "should override getters/setters", ->

	# 	class TestClass5 extends Framer.BaseClass
	# 		@define "testA", @simpleProperty "testA", 100

	# 	class TestClass6 extends TestClass5
	# 		setTestA: (value) ->
	# 			super value * 10

	# 	testClass = new TestClass6()
	# 	testClass.setTestA(500)
	# 	testClass.getTestA().should.equal 5000
	# 	testClass.testA.should.equal 5000

	it "should work with proxyProperties", ->

		class TestClass7 extends Framer.BaseClass
			@define "testA", @proxyProperty("poop.hello")

			constructor: ->
				super

				@poop = {hello:100}

		testClass = new TestClass7()
		testClass.poop.hello.should.equal 100
		testClass.testA.should.equal 100
		testClass.testA = 200
		testClass.poop.hello.should.equal 200

	it "should exclude prop from props, when exportable is false", ->

		class TestClass extends Framer.BaseClass
			@define "testProp",
				get: () -> "value"
				exportable: false

		instance = new TestClass()
		props = instance.props

		props.hasOwnProperty("testProp").should.be.false

		props = {}
		for field of instance
			props[field] = true

		props.hasOwnProperty("testProp").should.be.true

	it "should exclude prop from enumeration, when enumerable is lowered", ->

		class TestClass extends Framer.BaseClass
			@define "testProp",
				get: () -> "value"
				enumerable: false

		instance = new TestClass()
		props = {}
		for field of instance
			props[field] = true

		props.hasOwnProperty("testProp").should.be.false

	it.skip "should throw on assignment of read-only prop", ->
		class TestClass extends Framer.BaseClass
			@define "testProp",
				get: () -> "value"

		instance = new TestClass()
		(-> instance.testProp = "foo").should.throw "TestClass.testProp is readonly"

	it "should not set read-only prop via props setter", ->

		class TestClass extends Framer.BaseClass

			@define "testPropA",
				get: -> @_propA
				set: (value) -> @_propA = value

			@define "testPropB",	get: -> "value"

		instance = new TestClass()
		instance.props =
			testPropA: "a"
			testPropB: true

		instance.testPropA.should.equal "a"
		instance.testPropB.should.equal "value"
	it "should not share properties in subclasses", ->

		class LalaLayer extends Framer.BaseClass
			@define "blabla",
				get: -> "hoera"
				set: -> "sdfsd"

		class TestClassD extends LalaLayer
			@define "a",
				get: -> "getClassD"
				set: -> "setClassD"


		class TestClassC extends LalaLayer
			@define "a",
				get: -> "getClassC"
				# set: -> "setClassC"

		expect(TestClassD["_DefinedPropertiesKey"]?.a?.set).to.be.ok
		expect(TestClassC["_DefinedPropertiesKey"]?.a?.set).to.not.be.ok
