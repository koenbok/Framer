assert = require "assert"
{expect} = require "chai"

describe.only "TextLayer", ->

	describe "defaults", ->
		it "should set the correct defaults", ->
			text = new TextLayer
			text.html.should.equal "Add text"
			text.color.isEqual("#888").should.equal true
			text.backgroundColor.isEqual("transparent").should.equal true
			text.padding.should.eql Utils.rectZero()
			text.fontFamily.should.equal "-apple-system, 'SF UI Text', 'Helvetica Neue'"

		it "should not set the default fontFamily default if the fontFamily property is set", ->
			text = new TextLayer
				fontFamily: "Monaco"
			text.fontFamily.should.equal "Monaco"

		it "should not set the default fontFamily default if the font property is set", ->
			text = new TextLayer
				font: "Monaco"
			text.fontFamily.should.equal "Monaco"

	describe "Auto-sizing", ->

		it "should auto size the layer based on the Screen width", ->
			text = new TextLayer
			text.width.should.equal Screen.width
			text.height.should.equal 16

		it "should auto size the layer if the width is set explicitly", ->
			text = new TextLayer
				width: 100
				text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas posuere odio nisi, non elementum ipsum posuere ac. Vestibulum et faucibus ante. Praesent mi eros, scelerisque non venenatis at, tempus ut purus. Morbi volutpat velit lacus, id convallis lacus vulputate id. Nullam eu ex sed purus accumsan finibus sed eget lorem. Maecenas vulputate ante non ipsum luctus cursus. Nam dapibus purus ut lorem laoreet sollicitudin. Sed ullamcorper odio sed risus viverra, in vehicula lectus malesuada. Morbi porttitor, augue vel mollis pulvinar, sem lacus fringilla dui, facilisis venenatis lacus velit vitae velit. Suspendisse dictum elit in quam feugiat, nec ornare neque tempus. Duis eget arcu risus. Sed vitae turpis sit amet sapien pharetra consequat quis a dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla laoreet quis augue ac venenatis. Aenean nec lorem sodales, finibus purus in, ornare elit. Maecenas ut feugiat tellus."
			text.width.should.equal 100
			text.height.should.equal 1216

		it "should auto size the layer based on it's parent", ->
			layer = new Layer width: 150
			text = new TextLayer
				parent: layer
			text.width.should.equal 150
			text.height.should.equal 16

		it "should auto size the layer when its parent is set afterwards", ->
			layer = new Layer width: 150
			text = new TextLayer
			text.parent = layer
			text.width.should.equal 150
			text.height.should.equal 16

		it "should adjust its size on when a new text is set", (done) ->
			text = new TextLayer
			text.on "change:size", ->
				text.size.should.eql width: 400, height: 272
				done()
			text.text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas posuere odio nisi, non elementum ipsum posuere ac. Vestibulum et faucibus ante. Praesent mi eros, scelerisque non venenatis at, tempus ut purus. Morbi volutpat velit lacus, id convallis lacus vulputate id. Nullam eu ex sed purus accumsan finibus sed eget lorem. Maecenas vulputate ante non ipsum luctus cursus. Nam dapibus purus ut lorem laoreet sollicitudin. Sed ullamcorper odio sed risus viverra, in vehicula lectus malesuada. Morbi porttitor, augue vel mollis pulvinar, sem lacus fringilla dui, facilisis venenatis lacus velit vitae velit. Suspendisse dictum elit in quam feugiat, nec ornare neque tempus. Duis eget arcu risus. Sed vitae turpis sit amet sapien pharetra consequat quis a dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla laoreet quis augue ac venenatis. Aenean nec lorem sodales, finibus purus in, ornare elit. Maecenas ut feugiat tellus."
