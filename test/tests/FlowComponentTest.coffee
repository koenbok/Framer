assert = require "assert"

describe "FlowComponent", ->

	it "should not animate first show", ->

		nav = new FlowComponent size: 100
		cardA = new Layer size: 100
		cardB = new Layer size: 100

		nav.showNext(cardA)
		nav.current.should.equal cardA

	it "should go back", ->

		nav = new FlowComponent size: 100
		cardA = new Layer size: 100
		cardB = new Layer size: 100

		nav.showNext(cardA)
		nav.showNext(cardB, animate: false)
		nav.stack.should.eql [cardA, cardB]
		nav.showPrevious(animate: false)
		nav.current.should.equal cardA

	it "should allow constructor options", ->
		nav = new FlowComponent size: 100
		nav.width.should.equal 100
		nav.height.should.equal 100

	it "should allow constructor options with initial layer", ->
		cardA = new Layer size: 100
		nav = new FlowComponent(cardA, size: 100)
		nav.width.should.equal 100
		nav.height.should.equal 100
		nav.current.should.equal cardA

	describe.only "Header Footer", ->

		flowSize =
			width: 300
			height: 600

		makeLayer = (height=40) ->
			new Layer
				width: flowSize.width
				height: height
				backgroundColor: Utils.randomColor()

		stackVertically = (layers) ->
			layers.map (layer, i) ->
				layer.y = layers[i-1].maxY unless i is 0
				return layer

		makePage = (layers) ->
			page = new Layer
				size: flowSize
			layers.forEach (l) -> l.parent = page
			page.height = Math.max((layers.map (l) -> l.maxY)...)
			return page

		it "should fix header if content exceeds", ->

			flow = new FlowComponent size: flowSize

			flow.showNext(makePage(stackVertically([
				makeLayer(100),
				makeLayer(600)])))

			flow.current.children[0].frame.should.eql {x: 0, y: 0, width: 300, height: 100}
			flow.current.children[1].frame.should.eql {x: 0, y: 100, width: 300, height: 500}
			(flow.current.children[1] instanceof ScrollComponent).should.be.true
			flow.current.children[1].contentInset.should.eql({bottom: 0, right: 0, top: 0, left: 0})

		it "should fix footer if content exceeds", ->

			flow = new FlowComponent size: flowSize

			flow.showNext(makePage(stackVertically([
				makeLayer(600),
				makeLayer(100)])))

			flow.current.children[0].frame.should.eql {x: 0, y: 500, width: 300, height: 100}
			flow.current.children[1].frame.should.eql {x: 0, y: 0, width: 300, height: 500}
			(flow.current.children[1] instanceof ScrollComponent).should.be.true
			flow.current.children[1].contentInset.should.eql({bottom: 0, right: 0, top: 0, left: 0})

		it "should fix header and footer if content exceeds", ->

			flow = new FlowComponent size: flowSize

			flow.showNext(makePage(stackVertically([
				makeLayer(40),
				makeLayer(600 - 40 - 80 + 100),
				makeLayer(80)])))

			flow.current.children[0].frame.should.eql {x: 0, y: 0, width: 300, height: 40}
			flow.current.children[1].frame.should.eql {x: 0, y: 520, width: 300, height: 80}
			flow.current.children[2].frame.should.eql {x: 0, y: 40, width: 300, height: 480}
			(flow.current.children[2] instanceof ScrollComponent).should.be.true
			flow.current.children[2].contentInset.should.eql({bottom: 0, right: 0, top: 0, left: 0})

		it "should do nothing if header is misaligned x", ->

			flow = new FlowComponent size: flowSize

			page = makePage(stackVertically([
				makeLayer(40),
				makeLayer(600 - 40 - 80 + 100),
				makeLayer(80)]))

			page.children[0].x = -1
			flow.showNext(page)
			(flow.current.children[2] instanceof ScrollComponent).should.be.false

		it "should do nothing if header is misaligned y", ->

			flow = new FlowComponent size: flowSize

			page = makePage(stackVertically([
				makeLayer(40),
				makeLayer(600 - 40 - 80 + 100),
				makeLayer(80)]))

			page.children[0].y = -1
			flow.showNext(page)
			(flow.current.children[2] instanceof ScrollComponent).should.be.false

		it "should set contentInset without page header but with global header", ->

			flow = new FlowComponent size: flowSize
			flow.header = new Layer width: flowSize.width, height: 60

			page = makePage(stackVertically([
				makeLayer(600),
				makeLayer(100)]))

			flow.showNext(page)

			flow.current.frame.should.eql {x: 0, y: 0, width: 300, height: 600}
			flow.current.children[0].frame.should.eql {x: 0, y: 500, width: 300, height: 100}
			flow.current.children[1].frame.should.eql {x: 0, y: 0, width: 300, height: 500}
			(flow.current.children[1] instanceof ScrollComponent).should.be.true
			flow.current.children[1].contentInset.should.eql({bottom: 0, right: 0, top: 60, left: 0})

		it "should set contentInset without page footer but with global footer", ->

			flow = new FlowComponent size: flowSize
			flow.footer = new Layer width: flowSize.width, height: 60

			page = makePage(stackVertically([
				makeLayer(100),
				makeLayer(600)]))

			flow.showNext(page)

			flow.current.frame.should.eql {x: 0, y: 0, width: 300, height: 600}
			flow.current.children[0].frame.should.eql {x: 0, y: 0, width: 300, height: 100}
			flow.current.children[1].frame.should.eql {x: 0, y: 100, width: 300, height: 500}
			(flow.current.children[1] instanceof ScrollComponent).should.be.true
			flow.current.children[1].contentInset.should.eql({bottom: 60, right: 0, top: 0, left: 0})

		it "should make content scrollable if exceeds bounds", ->

			flow = new FlowComponent size: flowSize

			page = makePage(stackVertically([
				makeLayer(800)]))

			flow.showNext(page)

			flow.current.frame.should.eql {x: 0, y: 0, width: 300, height: 800}
			flow.current.parent.parent.frame.should.eql {x: 0, y: 0, width: 300, height: 600}
			(flow.current.parent.parent instanceof ScrollComponent).should.be.true
			flow.current.parent.parent.contentInset.should.eql({bottom: 0, right: 0, top: 0, left: 0})

		it "should make content scrollable if exceeds bounds and set contentInset for global header and footer", ->

			flow = new FlowComponent size: flowSize
			flow.header = new Layer width: flowSize.width, height: 60
			flow.footer = new Layer width: flowSize.width, height: 60
			page = makePage(stackVertically([
				makeLayer(800)]))

			flow.showNext(page)

			flow.current.frame.should.eql {x: 0, y: 0, width: 300, height: 800}
			flow.current.parent.parent.frame.should.eql {x: 0, y: 0, width: 300, height: 600}
			(flow.current.parent.parent instanceof ScrollComponent).should.be.true
			flow.current.parent.parent.contentInset.should.eql({bottom: 60, right: 0, top: 60, left: 0})

	describe "Events", ->

		it "should throw the right events", (done) ->

			events = []

			cardA = new Layer name: "cardA", size: 100
			cardB = new Layer name: "cardB", size: 100

			nav = new FlowComponent()

			nav.onTransitionStart (args...) ->
				events.push(Events.TransitionStart)

			nav.onTransitionEnd (args...) ->
				events.push(Events.TransitionEnd)

			nav.onTransitionEnd (args...) ->
				events.should.eql ["transitionstart", "transitionend"]
				done()

			nav.showNext(cardA)
			nav.current.should.equal cardA
