
describe "Utils", ->

	describe "valueOrDefault", ->

		it "should get a value", ->
			Utils.valueOrDefault(10, 0).should.equal 10

		it "should get the default value", ->
			Utils.valueOrDefault(null, 0).should.equal 0

		# it "should get the fallback value", ->
		# 	Utils.valueOrDefault(undefined, undefined, 0).should.equal 0

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
			result = Utils.parseFunction "spring(100, 50)"
			result.name.should.equal "spring"
			result.args.should.eql ["100", "50"]

		it "should cleanup arguments", ->
			result = Utils.parseFunction "spring(100, 50)"
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
				{width: 100, height: 100},
				{width: 100, height: 100},
			]).should.eql {width: 100, height: 100}

			Utils.sizeMax([
				{width: 1000, height: 1000},
				{width: 100, height: 100},
			]).should.eql {width: 1000, height: 1000}

	describe "pathJoin", ->

		it "should work", ->
			Utils.pathJoin("test", "monkey").should.equal "test/monkey"


	describe "sizeMin", ->

		it "should work", ->

			Utils.sizeMin([
				{width: 100, height: 100},
				{width: 100, height: 100},
			]).should.eql {width: 100, height: 100}

			Utils.sizeMin([
				{width: 1000, height: 1000},
				{width: 100, height: 100},
			]).should.eql {width: 100, height: 100}


	describe "points", ->

		it "should get points from frame", ->

			frame = {x: 200, y: -60, width: 200, height: 200}
			points = Utils.pointsFromFrame(frame)

			points.length.should.eql 4
			points[0].x.should.eql 200
			points[1].y.should.eql 140
			points[3].y.should.eql -60

		it "should get frame from points", ->

			points = [{x: 200, y: -60}, {x: 200, y: 140}, {x: 400, y: 140}, {x: 400, y: -60}]
			frame = Utils.frameFromPoints(points)

			frame.x.should.eql 200
			frame.y.should.eql -60
			frame.width.should.eql 200
			frame.height.should.eql 200

	describe "frameMerge", ->

		it "should work", ->

			compare = (frames, result) ->
				frame = Utils.frameMerge frames
				for p in ["x", "y", "width", "height"]
					frame[p].should.equal result[p], p

			compare [
				{x: 0, y: 0, width: 100, height: 100},
				{x: 0, y: 0, width: 100, height: 100},
			],  {x: 0, y: 0, width: 100, height: 100}

			compare [
				{x: 0, y: 0, width: 100, height: 100},
				{x: 0, y: 0, width: 500, height: 500},
			],  {x: 0, y: 0, width: 500, height: 500}

			compare [
				{x: 0, y: 0, width: 100, height: 100},
				{x: 100, y: 100, width: 500, height: 500},
			],  {x: 0, y: 0, width: 600, height: 600}

			compare [
				{x: 100, y: 100, width: 100, height: 100},
				{x: 100, y: 100, width: 500, height: 500},
			],  {x: 100, y: 100, width: 500, height: 500}

			# Bla bla. This works. Doing a visual comparison is so much easier
			# Start the cactus project and go to /test.html

	describe "framePointForOrigin", ->

		it "should work", ->
			Utils.framePointForOrigin({x: 100, y: 100, width: 100, height: 100}, 0, 0).should.eql(
				{x: 100, y: 100, width: 100, height: 100})
			Utils.framePointForOrigin({x: 100, y: 100, width: 100, height: 100}, 0, 0).should.eql(
				{x: 100, y: 100, width: 100, height: 100})
			Utils.framePointForOrigin({x: 100, y: 100, width: 100, height: 100}, 0, 0).should.eql(
				{x: 100, y: 100, width: 100, height: 100})
			Utils.framePointForOrigin({x: 100, y: 100, width: 100, height: 100}, 0, 0).should.eql(
				{x: 100, y: 100, width: 100, height: 100})




	# describe "domLoadData", (callback) ->

	# 	it "should load data async", (callback) ->

	# 		data = Utils.domLoadData "static/test.txt", (err, data) ->
	# 			data.should.equal "TEST HELLO"
	# 			callback()

	# 	it "should load throw error on nonexisting", (callback) ->

	# 		data = Utils.domLoadData "static/test123.txt", (err, data) ->
	# 			err.should.equal true
	# 			callback()

	# describe "domLoadDataSync", ->

	# 	it "should load data async", ->
	# 		data = Utils.domLoadDataSync "static/test.txt"
	# 		data.should.equal "TEST HELLO"

	# 	it "should load throw error on nonexisting", ->

	# 		test = -> Utils.domLoadDataSync("static/nonexisting.txt")
	# 		test.should.throw()

	describe "layerMatchesSelector", ->
		it "should match exact", ->
			layerA = new Layer name: "layerA"
			Utils.layerMatchesSelector(layerA,'layerA').should.equal true

		it "should match anything below", ->
			layerA = new Layer name: "layerA"
			layerB = new Layer name: "layerB", parent: layerA
			layerC = new Layer name: "layerC", parent: layerB
			Utils.layerMatchesSelector(layerB,'layerA > *').should.equal true

		it "should match descendant with wildcard", ->
			layerA = new Layer name: "layerA"
			layerB = new Layer name: "layerB", parent: layerA
			layerC = new Layer name: "layerC", parent: layerB
			Utils.layerMatchesSelector(layerC,'layerA layer*').should.equal true

		it "should match containing", ->
			layerA = new Layer name: "layerA1"
			layerB = new Layer name: "layerB1", parent: layerA
			layerC = new Layer name: "layerC1", parent: layerB
			Utils.layerMatchesSelector(layerB,'*rB*').should.equal true

		it "should match multiple direct children", ->
			layerA = new Layer name: "layerA"
			layerB = new Layer name: "layerB", parent: layerA
			layerC = new Layer name: "layerC", parent: layerB
			Utils.layerMatchesSelector(layerC,'layerA>layerB>layerC').should.equal true

		it "should match multiple direct children", ->
			layerA = new Layer name: "layerA"
			layerB = new Layer name: "layerB", parent: layerA
			layerC = new Layer name: "layerC", parent: layerB
			Utils.layerMatchesSelector(layerA,'layerB,layerC').should.equal false
			Utils.layerMatchesSelector(layerB,'layerB,layerC').should.equal true
			Utils.layerMatchesSelector(layerC,'layerB,layerC').should.equal true

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

	describe "clamp", ->

		it "should have the right results", ->
			Utils.clamp(3, 4, 6).should.equal 4
			Utils.clamp(3, 6, 4).should.equal 4
			Utils.clamp(5, 6, 4).should.equal 5
			Utils.clamp(5, 6, -4).should.equal 5

	describe "textSize", ->

		it "should have the right text size", ->

			# Todo: for some reason these don't work reliable in phantomjs

			text  = "Hello Koen Bok"
			style = {font: "20px/1em Menlo"}

			# it "should return the right size", ->
			# 	Utils.textSize(text, style).should.eql({width: 168, height: 20})

			# it "should return the right size with width constraint", ->
			# 	Utils.textSize(text, style, {width: 100}).should.eql({width: 100, height: 40})

			# it "should return the right size with height constraint", ->
			# 	Utils.textSize(text, style, {height: 100}).should.eql(width: 168, height: 100)

	describe "loadWebFont", ->
		it "loads fonts at different weights" , ->
			raleway = Utils.loadWebFont("Raleway")
			raleway200 = Utils.loadWebFont("Raleway", 200)
			raleway800 = Utils.loadWebFont("Raleway", 800)
			raleway.should.eql {fontFamily: "Raleway", fontWeight: undefined}
			raleway200.should.eql {fontFamily: "Raleway", fontWeight: 200}
			raleway800.should.eql {fontFamily: "Raleway", fontWeight: 800}

		it "returns the same when reloading the same fonts", ->
			raleway200 = Utils.loadWebFont("Raleway", 800)
			raleway200.should.eql {fontFamily: "Raleway", fontWeight: 800}
			raleway200 = Utils.loadWebFont("Raleway", 800)
			raleway200.should.eql {fontFamily: "Raleway", fontWeight: 800}


	describe "frameSortByAbsoluteDistance", ->

		it "should sort x", ->

			layerA = new Layer x: 300, y: 100
			layerB = new Layer x: 100, y: 100
			layerC = new Layer x: 200, y: 100

			Utils.frameSortByAbsoluteDistance({x: 0, y: 0}, [layerA, layerB, layerC]).should.eql([layerB, layerC, layerA])

		it "should sort", ->

			layerA = new Layer x: 500, y: 500
			layerB = new Layer x: 300, y: 300
			layerC = new Layer x: 100, y: 100

			Utils.frameSortByAbsoluteDistance({x: 0, y: 0}, [layerA, layerB, layerC]).should.eql([layerC, layerB, layerA])


	describe "inspect", ->

		it "should work for strings", ->
			Utils.inspect("a").should.equal("\"a\"")

		it "should work for booleans", ->
			Utils.inspect(true).should.equal("true")

		it "should work for numbers", ->
			Utils.inspect(12.34).should.equal("12.34")

		it "should work for null", ->
			Utils.inspect(null).should.equal("null")

		it "should work for undefined", ->
			Utils.inspect(undefined).should.equal("undefined")

		it "should work for arrays", ->
			Utils.inspect(["a", 1, ["b", "c"]]).should.equal("[\"a\", 1, [\"b\", \"c\"]]")

		it "should work for objects", ->
			Utils.inspect({a: 1, b: [1, 2, 3]}).should.equal("{a:1, b:[1, 2, 3]}")

		it "should work for functions", ->
			test = -> return "a"
			Utils.inspect(test).should.equal("<Function () { return \"a\"; }>")

		it "should work for functions with arguments", ->
			test = (a) -> return "a"
			Utils.inspect(test).should.equal("<Function (a) { return \"a\"; }>")

		it "should work for named functions", ->
			# There are no named function in coffee script
			# coffeelint: disable=no_backticks
			`function test(a) { return "a"; }`
			# coffeelint: enable=no_backticks
			Utils.inspect(test).should.equal("<Function test(a) { return \"a\"; }>")

		it "should work for long functions", ->
			test = ->
				its = 1
				very = 1
				rainy = 1
				today = 1
				down = 1
				here = 1
				return "a"
			Utils.inspect(test).should.equal("<Function () { var down, here, its, rainy, today, very; its = 1; very = 1; rainy = 1; today = 1; down = 1; here = 1; return \"a\"; }>")
			Utils.inspect([test]).should.equal("[<Function () { var down, here, its, rainy, today, very; its =… }>]")

		it "should work for classes", ->
			class TestClass
				constructor: ->
					@a = 1
			instance = new TestClass
			Utils.inspect(instance).should.equal("<TestClass {a:1}>")

		it "should work for subclasses", ->
			class TestClass
				constructor: ->
					@a = 1
			class SubTestClass extends TestClass
			instance = new SubTestClass
			Utils.inspect(instance).should.equal("<SubTestClass {a:1}>")

		it "should work with Colors", ->
			instance = new Color "red"
			Utils.inspect(instance).should.equal("<Color \"red\">")

			instance = new Color "#28affa"
			Utils.inspect(instance).should.equal("<Color \"#28affa\">")

			instance = new Color
				r: 200
				g: 100
				b: 20
				a: 1
			Utils.inspect(instance).should.equal("<Color r:200 g:100 b:20 a:1>")

			instance = new Color
				h: 200
				s: 1
				l: .2
				a: 1
			Utils.inspect(instance).should.equal("<Color h:200 s:1 l:0.2 a:1>")

		it "should work with toInspect", ->
			class TestClass
				toInspect: -> return "Hello"
			instance = new TestClass
			Utils.inspect(instance).should.equal("Hello")

		it "should work with WebKitCSSMatrix", ->
			instance = new WebKitCSSMatrix()
			Utils.inspect(instance).should.equal("<WebKitCSSMatrix {e:0, m33:1, f:0, m42:0, m44:1, m24:0, m31:0, m32:0, m21:0, m14:0, c:0, m34:0, m13:0, m12:0, m11:1, m41:0, m23:0, b:0, d:1, m22:1, a:1, m43:0}>")

		it "should work with HTMLDivElement", ->
			instance = document.createElement("div")
			Utils.inspect(instance).should.equal("<HTMLDivElement>")

		it "should work with HTMLDivElementConstructor", ->
			instance = document.createElement("div")
			Utils.inspectObjectType(instance.constructor).should.equal("HTMLDivElementConstructor")
			Utils.inspect(instance.constructor).should.equal("<HTMLDivElementConstructor>")

		it "should work with CSSStyleDeclaration", ->
			instance = document.createElement("div")
			Utils.inspect(instance.style).should.equal("<CSSStyleDeclaration {}>")

		it "should work with LayerDraggable", ->
			layer = new Layer
			Utils.inspectObjectType(layer.draggable).should.equal("LayerDraggable")

		it "should work with a layer on an object", ->
			varName = "123"
			g = {}
			g[varName] = new Layer
			Utils.inspect(_.keys(g)).should.equal("[\"123\"]")

		it "should work with align", ->
			options =
				x: Align.center
				y: Align.center
			Utils.inspect(options).should.equal("{x:Align.center, y:Align.center}")

	describe "keyPath", ->

		it "should get with single", ->
			obj = {foo: "bar"}
			Utils.getValueForKeyPath(obj, "foo").should.equal("bar")

		it "should get with multipe", ->
			obj = {fooA: {fooB: {fooC: "bar"}}}
			Utils.getValueForKeyPath(obj, "fooA.fooB.fooC").should.equal("bar")

		it "should set with single", ->
			obj = {}
			Utils.setValueForKeyPath(obj, "foo", "bar")
			obj.should.eql({foo: "bar"})

		it "should set with multiple", ->
			obj = {fooA: {fooB: {}}}
			Utils.setValueForKeyPath(obj, "fooA.fooB.fooC", "bar")
			obj.should.eql({fooA: {fooB: {fooC: "bar"}}})

	describe "isFileUrl", ->
		it "should work", ->
			Utils.isFileUrl("file:///Users/koen/Desktop/index.html").should.equal(true)
			Utils.isFileUrl("http://apple.com/index.html").should.equal(false)
			Utils.isFileUrl("https://apple.com/index.html").should.equal(false)

	describe "isDataUrl", ->
		it "should work", ->
			dataUrlGif = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
			dataUrlPng = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAADUlEQVQI12P4z8DwHwAFAAH/cpxSZwAAAABJRU5ErkJggg=="
			Utils.isDataUrl(dataUrlGif).should.equal(true)
			Utils.isDataUrl(dataUrlPng).should.equal(true)
			Utils.isDataUrl("file:///Users/koen/Desktop/foo.gif").should.equal(false)
			Utils.isDataUrl("http://data.com/1x1.png").should.equal(false)

	describe "isRelativeUrl", ->
		it "should work", ->
			Utils.isRelativeUrl("Desktop/index.html").should.equal(true)
			Utils.isRelativeUrl("/Desktop/index.html").should.equal(true)
			Utils.isRelativeUrl("./Desktop/index.html").should.equal(true)
			Utils.isRelativeUrl(".././Desktop/index.html").should.equal(true)
			Utils.isRelativeUrl("https://apple.com/index.html").should.equal(false)

	describe "isLocalServerUrl", ->
		it "should work", ->
			Utils.isLocalServerUrl("/Desktop/index.html").should.equal(false)
			Utils.isLocalServerUrl("http://localhost/index.html").should.equal(true)
			Utils.isLocalServerUrl("http://127.0.0.1/index.html").should.equal(true)
			Utils.isLocalServerUrl("https://localhost/index.html").should.equal(true)
			Utils.isLocalServerUrl("https://127.0.0.1/index.html").should.equal(true)
			Utils.isLocalServerUrl(".././Desktop/index.html").should.equal(false)
			Utils.isLocalServerUrl("https://apple.com/index.html").should.equal(false)
			Utils.isLocalServerUrl("https://apple.com/?url=http%3A%2F%2F127.0.0.1").should.equal(false)

	describe "isLocalAssetUrl", ->
		it "should work", ->
			dataUrl = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
			Utils.isLocalAssetUrl("Desktop/index.html", "http://localhost/index.html").should.equal(true)
			Utils.isLocalAssetUrl("/Desktop/index.html", "http://localhost/index.html").should.equal(true)
			Utils.isLocalAssetUrl("Desktop/index.html", "http://127.0.0.1/index.html").should.equal(true)
			Utils.isLocalAssetUrl("Desktop/index.html", "http://apple.com/index.html").should.equal(false)
			Utils.isLocalAssetUrl("file:///Desktop/index.html", "http://apple.com/index.html").should.equal(true)
			Utils.isLocalAssetUrl("http://apple.com/index.html", "http://127.0.0.1/index.html").should.equal(false)
			Utils.isLocalAssetUrl("Desktop/index.html", dataUrl).should.equal(false)
