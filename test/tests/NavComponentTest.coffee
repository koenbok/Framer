assert = require "assert"

describe "NavComponent", ->

	it "should not animate first show", ->

		nav = new NavComponent size: 100
		cardA = new Layer size: 100
		cardB = new Layer size: 100

		nav.showNext(cardA)
		nav.current.should.equal cardA

	it "should go back", ->

		nav = new NavComponent size: 100
		cardA = new Layer size: 100
		cardB = new Layer size: 100

		nav.showNext(cardA)
		nav.showNext(cardB, animate: false)
		nav.stack.should.eql [cardA, cardB]
		nav.showPrevious(animate: false)
		nav.current.should.equal cardA

	it "should allow constructor options", ->
		nav = new NavComponent size: 100
		nav.width.should.equal 100
		nav.height.should.equal 100

	it "should allow constructor options with initial layer", ->
		cardA = new Layer size: 100
		nav = new NavComponent(cardA, size: 100)
		nav.width.should.equal 100
		nav.height.should.equal 100
		nav.current.should.equal cardA

	describe "Header Footer", ->

		it "should add header", ->

			nav = new NavComponent size: 200
			nav.header = new Layer width: 200, height: 20
			nav.showNext new Layer width: 200, height: 200

			nav.children[1].should.equal nav.header
			nav.children[2].constructor.name.should.equal "ScrollComponent"
			nav.children[2].scrollHorizontal.should.equal false
			nav.children[2].scrollVertical.should.equal true
			nav.children[2].contentInset.should.eql {top: 20, right: 0, bottom: 0, left: 0}

		it "should add footer", ->

			nav = new NavComponent size: 200
			nav.footer = new Layer width: 200, height: 20
			nav.showNext new Layer width: 200, height: 200

			nav.children[1].should.equal nav.footer
			nav.children[2].constructor.name.should.equal "ScrollComponent"
			nav.children[2].scrollHorizontal.should.equal false
			nav.children[2].scrollVertical.should.equal true
			nav.children[2].contentInset.should.eql {top: 0, right: 0, bottom: 20, left: 0}


	describe "Scroll", ->

		it "should make views scrollable", ->

			nav = new NavComponent size: 100
			cardA = new Layer width: 200, height: 200

			nav.showNext(cardA, scroll: true)
			nav.children[1].constructor.name.should.equal "ScrollComponent"
			nav.children[1].scrollHorizontal.should.equal true
			nav.children[1].scrollVertical.should.equal true

		it "should make views scrollable horizontal", ->

			nav = new NavComponent size: 100
			cardA = new Layer width: 200, height: 100

			nav.showNext(cardA, scroll: true)
			nav.children[1].constructor.name.should.equal "ScrollComponent"
			nav.children[1].scrollHorizontal.should.equal true
			nav.children[1].scrollVertical.should.equal false

		it "should make views scrollable vertical", ->

			nav = new NavComponent size: 100
			cardA = new Layer width: 100, height: 200

			nav.showNext(cardA, scroll: true)
			nav.children[1].constructor.name.should.equal "ScrollComponent"
			nav.children[1].scrollHorizontal.should.equal false
			nav.children[1].scrollVertical.should.equal true

		it "should not make views scrollable", ->

			nav = new NavComponent size: 100
			cardA = new Layer width: 100, height: 200

			nav.showNext(cardA, scroll: false)
			nav.children[1].constructor.name.should.not.equal "ScrollComponent"

	describe "Events", ->

		it "should throw the right events", (done) ->

			events = []

			cardA = new Layer name: "cardA", size: 100
			cardB = new Layer name: "cardB", size: 100

			nav = new NavComponent()
			nav.showNext(cardA)
			nav.current.should.equal cardA

			nav.onTransitionStart (args...) ->
				events.push(Events.TransitionStart)

			nav.onTransitionEnd (args...) ->
				events.push(Events.TransitionEnd)

			nav.showNext(cardB)

			nav.onTransitionEnd (args...) ->
				events.should.eql ["transitionstart", "transitionend"]
				done()
