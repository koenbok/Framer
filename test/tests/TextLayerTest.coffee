assert = require "assert"
{expect} = require "chai"

shortText = "Awesome title"
mediumText = "What about this text that probably spans just over two lines"
longText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas posuere odio nisi, non elementum ipsum posuere ac. Vestibulum et faucibus ante. Praesent mi eros, scelerisque non venenatis at, tempus ut purus. Morbi volutpat velit lacus, id convallis lacus vulputate id. Nullam eu ex sed purus accumsan finibus sed eget lorem. Maecenas vulputate ante non ipsum luctus cursus. Nam dapibus purus ut lorem laoreet sollicitudin. Sed ullamcorper odio sed risus viverra, in vehicula lectus malesuada. Morbi porttitor, augue vel mollis pulvinar, sem lacus fringilla dui, facilisis venenatis lacus velit vitae velit. Suspendisse dictum elit in quam feugiat, nec ornare neque tempus. Duis eget arcu risus. Sed vitae turpis sit amet sapien pharetra consequat quis a dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla laoreet quis augue ac venenatis. Aenean nec lorem sodales, finibus purus in, ornare elit. Maecenas ut feugiat tellus."

describe "TextLayer", ->

	describe "defaults", ->
		it "should set the correct defaults", ->
			text = new TextLayer
			text.html.should.equal "Hello World"
			text.color.isEqual("#888").should.equal true
			text.backgroundColor.isEqual("transparent").should.equal true
			text.padding.should.eql Utils.rectZero()
			text.fontSize.should.equal 40
			text.fontWeight.should.equal 400
			text.lineHeight.should.equal 1.25
			text.fontStyle.should.equal "normal"
			text.style.fontFamily.should.equal "-apple-system, BlinkMacSystemFont, 'SF UI Text', 'Helvetica Neue'"

		it "should not set the default fontFamily default if the fontFamily property is set", ->
			text = new TextLayer
				fontFamily: "Monaco"
			text.fontFamily.should.equal "Monaco"

		it "should not set the default fontFamily default if the font property is set", ->
			text = new TextLayer
				font: "Monaco"
			text.fontFamily.should.equal "Monaco"

		it "should set the font property if the fontFamily property is set", ->
			text = new TextLayer
				fontFamily: "Monaco"
			text.font.should.equal "Monaco"

	describe "Auto-sizing", ->

		it "should auto size the layer the size of the text", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: shortText
			text.size.should.eql width: 312, height: 50

		it "should auto size the layer based on the Screen width", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: mediumText
			text.width.should.equal Screen.width
			text.height.should.equal 250

		it "should auto size the layer if the width is set explicitly", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: mediumText
				width: 100
			text.width.should.equal 100
			text.height.should.equal 550

		it "should not auto size the layer the size the layer if it is explictly set", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: mediumText
				width: 123
				height: 456
			text.size.should.eql width: 123, height: 456

		it "should not auto size the layer when changing text after explictly setting width", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
			text.width = 123
			text.text = longText
			text.width.should.equal 123

		it "should not auto size the layer when changing text after explictly setting height", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
			text.height = 456
			text.text = longText
			text.height.should.equal 456

		it "should auto size the layer based on it's parent", ->
			layer = new Layer width: 150
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: mediumText
				parent: layer
			text.width.should.equal 150
			text.height.should.equal 550

		it "should auto size the layer when its parent is set afterwards", ->
			layer = new Layer width: 150
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: mediumText
			text.parent = layer
			text.width.should.equal 150
			text.height.should.equal 550

		it "should adjust its size on when a new text is set", (done) ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
			text.on "change:height", ->
				text.size.should.eql width: 400, height: 3500
				done()
			text.text = longText

		it "should take padding into account", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: shortText
				padding: 10
			text.size.should.eql width: 332, height: 70

		it "should take border width into account", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: shortText
				borderWidth: 5
			text.size.should.eql width: 322, height: 60

		it "should autosize with the right width when inside a parent", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: shortText
				borderWidth: 5
				padding: 3
			parent = new Layer
			text.parent = parent
			text.size.should.eql width: 100, height: 116

		it "should autosize with the right width when inside a parent with a border", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: shortText
				borderWidth: 5
				padding: 3
			parent = new Layer
				borderWidth: 10
			text.parent = parent
			text.size.should.eql width: 80, height: 116

		it "should work together with Align.center", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				fontSize: 5
				x: Align.center
				y: Align.center
				text: shortText
			text.point.should.eql x: 180, y: 147

		it "should autosize when setting the text multiple times", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: "Hi"
			text.size.should.eql width: 48, height: 50
			text.text = "Hello"
			text.size.should.eql width: 120, height: 50
			text.text = "Hello there"
			text.size.should.eql width: 264, height: 50

	describe "Padding", ->
		it "should have no padding initially", ->
			text = new TextLayer
			text.style.padding.should.equal "0px"
			text.padding.top.should.equal 0
			text.padding.bottom.should.equal 0
			text.padding.left.should.equal 0
			text.padding.right.should.equal 0

		it "should all padding when given a numeric value", ->
			text = new TextLayer
				padding: 10

			text.style.padding.should.equal "10px"
			text.padding.top.should.equal 10
			text.padding.bottom.should.equal 10
			text.padding.left.should.equal 10
			text.padding.right.should.equal 10

		it "should set horizontal padding", ->
			text = new TextLayer
				padding:
					horizontal: 10
			text.style.padding.should.equal "0px 10px"
			text.padding.top.should.equal 0
			text.padding.bottom.should.equal 0
			text.padding.left.should.equal 10
			text.padding.right.should.equal 10

		it "should set vertical padding", ->
			text = new TextLayer
				padding:
					vertical: 10
			text.style.padding.should.equal "10px 0px"
			text.padding.top.should.equal 10
			text.padding.bottom.should.equal 10
			text.padding.left.should.equal 0
			text.padding.right.should.equal 0


		it "should set top, left, right and left padding", ->
			text = new TextLayer
				padding:
					top: 1
					bottom: 2
					left: 3
					right: 4
			text.style.padding.should.equal "1px 4px 2px 3px"
			text.padding.top.should.equal 1
			text.padding.bottom.should.equal 2
			text.padding.left.should.equal 3
			text.padding.right.should.equal 4

		it "should keep padding 0 when not explicity set", ->
			text = new TextLayer
				padding:
					horizontal: 3
					bottom: 2
			text.style.padding.should.equal "0px 3px 2px"
			text.padding.top.should.equal 0
			text.padding.bottom.should.equal 2
			text.padding.left.should.equal 3
			text.padding.right.should.equal 3

		it "should have a preference for more specific padding definitions", ->
			text = new TextLayer
				padding:
					horizontal: 3
					right: 2
			text.style.padding.should.equal "0px 2px 0px 3px"
			text.padding.top.should.equal 0
			text.padding.bottom.should.equal 0
			text.padding.left.should.equal 3
			text.padding.right.should.equal 2

	describe "webfonts", ->
		it "sets the weight if the font property is set", ->
			l = new TextLayer
				font: Utils.loadWebFont("Raleway", 800)
			l.fontFamily.should.equal "Raleway"
			l.fontWeight.should.equal 800

		it "doesn't set the weight if the fontFamily property is set", ->
			l = new TextLayer
				fontFamily: Utils.loadWebFont("Raleway", 800)
			l.fontFamily.should.equal "Raleway"
			expect(l.fontWeight).to.equal 400

	describe "textOverflow", ->
		it "should enable clipping", ->
			l = new TextLayer
				textOverflow: "ellipsis"
			l.clip.should.equal true

		it "should enable multilineOverflow setting a specific height", ->
			l = new TextLayer
				textOverflow: "ellipsis"
				height: 20
			l.multiLineOverflow.should.equal true

		it "should should disable multilineOverflow when using clipping and setting a specific height", ->
			l = new TextLayer
				textOverflow: "clip"
				height: 20
			l.multiLineOverflow.should.equal false

		it "should set whitespace to nowrap setting no height", ->
			l = new TextLayer
				textOverflow: "ellipsis"
			l.whiteSpace.should.equal "nowrap"
			l.multiLineOverflow.should.equal false

		it "should disable properties when it's disabled", ->
			l = new TextLayer
				textOverflow: "ellipsis"
			l.textOverflow = null
			l.clip.should.equal false
			expect(l.whitespace).to.equal undefined
			l.multiLineOverflow.should.equal false

		it "should update the line-clamp when the height is updated", ->
			l = new TextLayer
				text: longText
				textOverflow: "ellipsis"
				height: 150
			l._elementHTML.style["-webkit-line-clamp"].should.equal '3'
			l.height = 400
			l._elementHTML.style["-webkit-line-clamp"].should.equal '8'

		it "should not set the line-clamp when not using textOverflow", ->
			l = new TextLayer
				text: longText
				height: 150
			l._elementHTML.style["-webkit-line-clamp"].should.equal ''
			l.height = 400
			l._elementHTML.style["-webkit-line-clamp"].should.equal ''

	describe "truncate", ->
		it "should set textOverflow to ellipsis", ->
			l = new TextLayer
				text: longText
				truncate: true
			l.truncate.should.equal true
			l.textOverflow.should.equal "ellipsis"
			l._elementHTML.style.textOverflow.should.equal "ellipsis"
			l.truncate = false
			l.truncate.should.equal false
			expect(l.textOverflow).to.equal null
			expect(l._elementHTML.style.textOverflow).to.equal ''
