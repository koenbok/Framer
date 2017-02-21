assert = require "assert"

describe.only "TextLayer", ->

	it "should create a TextLayer with defaults", ->
		text = new TextLayer
		text.html.should.equal "Add text"
		text.color.isEqual("#888").should.equal true
		text.backgroundColor.isEqual("transparent").should.equal true
		text.padding.should.eql Utils.rectZero()

		text.fontFamily.should.equal "-apple-system, 'SF UI Text', 'Helvetica Neue'"

	describe "Auto-sizing", ->

		it "should auto size the layer based on the Screen width", ->
			text = new TextLayer
			text.width.should.equal Screen.width
			# text.height.should.equal 24

		it "should auto size the layer based on it's parent", ->
			layer = new Layer width: 150
			text = new TextLayer
				parent: layer
			text.width.should.equal 150
			# text.height.should.equal 24

		it.skip "should auto size the layer when its parent is set afterwards", ->
			layer = new Layer width: 150
			text = new TextLayer
			text.parent = layer
			text.width.should.equal 150

		it "should adjust its size on when a new text is set", (done) ->
			text = new TextLayer
			text.on "change:size", ->
				# console.log text.size
				done()
			text.text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas posuere odio nisi, non elementum ipsum posuere ac. Vestibulum et faucibus ante. Praesent mi eros, scelerisque non venenatis at, tempus ut purus. Morbi volutpat velit lacus, id convallis lacus vulputate id. Nullam eu ex sed purus accumsan finibus sed eget lorem. Maecenas vulputate ante non ipsum luctus cursus. Nam dapibus purus ut lorem laoreet sollicitudin. Sed ullamcorper odio sed risus viverra, in vehicula lectus malesuada. Morbi porttitor, augue vel mollis pulvinar, sem lacus fringilla dui, facilisis venenatis lacus velit vitae velit. Suspendisse dictum elit in quam feugiat, nec ornare neque tempus. Duis eget arcu risus. Sed vitae turpis sit amet sapien pharetra consequat quis a dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla laoreet quis augue ac venenatis. Aenean nec lorem sodales, finibus purus in, ornare elit. Maecenas ut feugiat tellus."
