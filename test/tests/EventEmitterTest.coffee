describe "EventEmitter", ->
	
	it "should listen", ->
		
		tester = new Framer.EventEmitter
		count = 0
		handler = -> count++

		tester.on "test", handler
		tester.emit "test"

		count.should.equal 1

	it "should stop listening", ->
		
		tester = new Framer.EventEmitter
		count = 0
		handler = -> count++

		tester.on "test", handler
		tester.emit "test"

		count.should.equal 1

		tester.off "test", handler
		tester.emit "test"

		count.should.equal 1

	it "should listen once", ->
		
		tester = new Framer.EventEmitter
		count = 0
		handler = -> count++

		tester.once "test", handler
		tester.emit "test"
		tester.emit "test"
		tester.emit "test"

		count.should.equal 1