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
		nav.showNext(cardB, animate:false)
		nav.stack.should.eql [cardA, cardB]
		nav.showPrevious(animate:false)
		nav.current.should.equal cardA

	describe "Scroll", ->

		it "should make views scrollable", ->

			nav = new NavComponent size: 100
			cardA = new Layer width: 200, height: 200

			nav.showNext(cardA, scroll:true)
			nav.children[1].constructor.name.should.equal "ScrollComponent"
			nav.children[1].scrollHorizontal.should.equal true
			nav.children[1].scrollVertical.should.equal true

		it "should make views scrollable horizontal", ->

			nav = new NavComponent size: 100
			cardA = new Layer width: 200, height: 100

			nav.showNext(cardA, scroll:true)
			nav.children[1].constructor.name.should.equal "ScrollComponent"
			nav.children[1].scrollHorizontal.should.equal true
			nav.children[1].scrollVertical.should.equal false

		it "should make views scrollable vertical", ->

			nav = new NavComponent size: 100
			cardA = new Layer width: 100, height: 200

			nav.showNext(cardA, scroll:true)
			nav.children[1].constructor.name.should.equal "ScrollComponent"
			nav.children[1].scrollHorizontal.should.equal false
			nav.children[1].scrollVertical.should.equal true

		it "should not make views scrollable", ->

			nav = new NavComponent size: 100
			cardA = new Layer width: 100, height: 200

			nav.showNext(cardA, scroll:false)
			nav.children[1].constructor.name.should.not.equal "ScrollComponent"

	describe "Events", ->

		it "should throw the right events", (done) ->

			cardA = new Layer name: "cardA", size: 100
			cardB = new Layer name: "cardB", size: 100

			nav = new NavComponent()
			nav.showNext(cardA)
			nav.current.should.equal cardA


			# nav.once Events.TransitionStart, (args...) ->
			# 	print Events.TransitionStart, args
			# 	#events.push(Events.TransitionStart)

			nav.once Events.TransitionEnd, (args...) ->
				# print Events.TransitionEnd, args
				# print nav.current, nav._stack
				nav.current.should.equal cardB
				done()
				#events.push(Events.TransitionEnd)

			nav.showNext(cardB)
			# nav.back()
