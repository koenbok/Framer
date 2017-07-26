assert = require "assert"
{expect} = require "chai"

shortText = "Awesome title"
mediumText = "What about this text that probably spans just over two lines"
longText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas posuere odio nisi, non elementum ipsum posuere ac. Vestibulum et faucibus ante. Praesent mi eros, scelerisque non venenatis at, tempus ut purus. Morbi volutpat velit lacus, id convallis lacus vulputate id. Nullam eu ex sed purus accumsan finibus sed eget lorem. Maecenas vulputate ante non ipsum luctus cursus. Nam dapibus purus ut lorem laoreet sollicitudin. Sed ullamcorper odio sed risus viverra, in vehicula lectus malesuada. Morbi porttitor, augue vel mollis pulvinar, sem lacus fringilla dui, facilisis venenatis lacus velit vitae velit. Suspendisse dictum elit in quam feugiat, nec ornare neque tempus. Duis eget arcu risus. Sed vitae turpis sit amet sapien pharetra consequat quis a dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla laoreet quis augue ac venenatis. Aenean nec lorem sodales, finibus purus in, ornare elit. Maecenas ut feugiat tellus."
simpleStyledTextOptions = {blocks: [{inlineStyles: [{startIndex: 0, endIndex: 5, css: {fontSize: "16px", WebkitTextFillColor: "#000000", letterSpacing: "0px", fontWeight: 400, lineHeight: "2.5", tabSize: 4, fontFamily: "'Roboto-Regular', 'Roboto', 'Times New Roman'"}}], text: "Color"}]}
exampleStyledTextOptions = {blocks: [{inlineStyles: [{startIndex: 0, endIndex: 6, css: {fontSize: "48px", WebkitTextFillColor: "#000000", letterSpacing: "0px", fontWeight: 800, lineHeight: "1.2", tabSize: 4, fontFamily: "'.SFNSText-Heavy', '.SFUIText-Heavy', 'SF UI Text', 'Times New Roman'"}}], text: "Header"}, {inlineStyles: [{startIndex: 0, endIndex: 8, css: {fontSize: "20px", WebkitTextFillColor: "rgb(153, 153, 153)", letterSpacing: "0px", fontWeight: 400, lineHeight: "1.2", tabSize: 4, fontFamily: "'.SFNSText', 'SFUIText-Regular', '.SFUIText', 'SF UI Text', 'Times New Roman'"}}], text: "Subtitle"}, {inlineStyles: [{startIndex: 0, endIndex: 6, css: {fontSize: "16px", WebkitTextFillColor: "rgb(238, 68, 68)", letterSpacing: "0px", fontWeight: 200, lineHeight: "1.2", tabSize: 4, fontFamily: "'.SFNSText-Light', 'SFUIText-Light', '.SFUIText-Light', 'SF UI Text', 'Times New Roman'"}}, {startIndex: 6, endIndex: 16, css: {fontSize: "12px", WebkitTextFillColor: "#000000", letterSpacing: "0px", fontWeight: 400, lineHeight: "1.2", tabSize: 4, fontFamily: "'.SFNSText', 'SFUIText-Regular', '.SFUIText', 'SF UI Text', 'Times New Roman'"}}], text: "Leader Body text"}], alignment: "left"}
differentFonts = {"blocks": [{"inlineStyles": [{"startIndex": 0, "endIndex": 14, "css": {"fontSize": "60px", "WebkitTextFillColor": "#000000", "letterSpacing": "0px", "fontWeight": 400, "lineHeight": "1.2", "tabSize": 4, "fontFamily": "'.SFNSText', 'SFUIText-Regular', '.SFUIText', 'SF UI Text', sans-serif"}}], "text": "This is Roboto"}, {"inlineStyles": [{"startIndex": 0, "endIndex": 0, "css": {"fontSize": "47px", "WebkitTextFillColor": "#000000", "letterSpacing": "0px", "fontWeight": 400, "lineHeight": "1.2", "tabSize": 4, "fontFamily": "'Roboto-Regular', 'Roboto', sans-serif"}}], "text": ""}, {"inlineStyles": [{"startIndex": 0, "endIndex": 14, "css": {"fontSize": "60px", "WebkitTextFillColor": "#000000", "letterSpacing": "0px", "fontWeight": 400, "lineHeight": "1.2", "tabSize": 4, "fontFamily": "'Roboto-Regular', 'Roboto', sans-serif"}}], "text": "This is Roboto"}, {"inlineStyles": [{"startIndex": 0, "endIndex": 27, "css": {"fontSize": "60px", "WebkitTextFillColor": "#000000", "letterSpacing": "0px", "fontWeight": 400, "lineHeight": "1.2", "tabSize": 4, "fontFamily": "'VesperLibre-Regular', 'Vesper Libre', serif"}}], "text": "With a little bit of Vesper"}, {"inlineStyles": [{"startIndex": 0, "endIndex": 0, "css": {"fontSize": "10px", "WebkitTextFillColor": "rgb(255, 0, 0)", "letterSpacing": "0px", "fontWeight": 400, "lineHeight": "1.2", "tabSize": 4, "fontFamily": "'Lato-Regular', 'Lato', serif"}}], "text": ""}, {"inlineStyles": [{"startIndex": 0, "endIndex": 16, "css": {"fontSize": "12px", "WebkitTextFillColor": "#000000", "letterSpacing": "0px", "fontWeight": 400, "lineHeight": "1.2", "tabSize": 4, "fontFamily": "'Alcubierre', serif"}}], "text": "And some Raleway"}]}

describe.only "TextLayer.template", ->
	it "should work", ->
		text = new TextLayer({text: "xxx {hello} xxx"})
		text.template({hello: "xxx"})
		text.text.should.eql "xxx xxx xxx"
		text._styledText.validate().should.equal true

		text.template({hello: "again"})
		text.text.should.eql "xxx again xxx"

		text.template({hello: ""})
		text.text.should.eql "xxx  xxx"


		text.replace("again", "HELLO THIS IS ME AND MORE")
		text.text = ""
		text.text.should.eql ""

		text.template({hello: "still works"})
		text.text.should.eql "xxx still works xxx"
		text._styledText.validate().should.equal true

	it "should expand many blocks", ->
		text = new TextLayer({text:"{a},{b},{c},{d}"})
		text.template({a: "AAAAA"})
		text.text.should.eql "AAAAA,{b},{c},{d}"
		text.template({a: "AAAAA", b: "BEE"})
		text.text.should.eql "AAAAA,BEE,{c},{d}"
		text.template({a: "AAAAA", b: "BEE", c: "CEEEE"})
		text.text.should.eql "AAAAA,BEE,CEEEE,{d}"
		text.template({a: "AAAAA", b: "BEE", c: "CEEEE", d: "DEE"})
		text.text.should.eql "AAAAA,BEE,CEEEE,DEE"

	it "should support multiple blocks and inline styles", ->
		text = new TextLayer({text:"{a}\n{b},{c}\n{d}"})
		text.template({a: "AAAAAAA", b: "BEE", c: "CEEEE", d: "DEE"})
		text.text.should.eql "AAAAAAA\nBEE,CEEEE\nDEE"

	it "should support inserting multilines", ->
		text = new TextLayer({text:"{a}\n{b},{c}\n{d}"})
		text._styledText.blocks.length.should.eql 3
		text.template({a: "ALONG", b:"BELOW\nMORE STUFF\nOEPS", c: "CIRCLE", d:"DEAF"})
		text.text.should.eql "ALONG\nBELOW\nMORE STUFF\nOEPS,CIRCLE\nDEAF"
		# text._styledText.blocks.length.should.eql 5

describe "TextLayer", ->
	describe "defaults", ->
		it "should set the correct defaults", ->
			text = new TextLayer
			text.text.should.equal "Hello World"
			text.html.should.equal '<div style="font-size: 1px;"><span style="font-size: 40px;">Hello World</span></div>'
			text._elementHTML.outerHTML.should.equal '<div style="zoom: 1; overflow: visible; color: rgb(136, 136, 136); font-family: -apple-system, BlinkMacSystemFont, \'SF UI Text\', \'Helvetica Neue\'; font-weight: 400; font-style: normal; font-size: 40px; line-height: 1.25; text-transform: none; outline: none; white-space: pre-wrap; word-wrap: break-word; text-align: left;"><div style="font-size: 1px;"><span style="font-size: 40px;">Hello World</span></div></div>'
			text.color.isEqual("#888").should.equal true
			text.backgroundColor.isEqual("transparent").should.equal true
			text.padding.should.eql 0
			text.fontSize.should.equal 40
			text.fontWeight.should.equal 400
			text.lineHeight.should.equal 1.25
			text.fontStyle.should.equal "normal"
			text._elementHTML.style.fontFamily.should.equal "-apple-system, BlinkMacSystemFont, 'SF UI Text', 'Helvetica Neue'"

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

		it "should render correctly when switching to the default state", ->
			text = new TextLayer
				styledText: simpleStyledTextOptions
			textSize = text.size
			options = text.styledTextOptions
			text.stateSwitch("default")
			text.styledTextOptions.should.eql options
			text.size.should.eql textSize

		it "should provide the same text options that have been put in", ->
			l = new TextLayer
				styledText: exampleStyledTextOptions
			l.styledTextOptions.should.eql exampleStyledTextOptions

		it "setting the alignment shouldn't influence other layers", ->
			a = new TextLayer
				styledText:
					blocks: []
					alignment: "left"

			b = new TextLayer
				styledText:
					blocks: []
					alignment: "center"

			a.styledTextOptions.alignment.should.equal "left"
			b.styledTextOptions.alignment.should.equal "center"

		it "should render all lines at the correct fontsize", ->
			l = new TextLayer
				styledText: differentFonts
			l._styledText.blocks[1].inlineStyles[0].css.fontSize.should.equal "47px"
			l._styledText.blocks[4].inlineStyles[0].css.fontSize.should.equal "10px"

		it "should render empty newlines", ->
			l = new TextLayer
				styledText: differentFonts
			l._styledText.blocks.length.should.equal 6

	describe "animation", ->
		it "should start animating from the textcolor the layer has", (done) ->
			text = new TextLayer
				styledText: simpleStyledTextOptions

			text.onAnimationStart ->
				black = new Color("black")
				text.color.toRgbString().should.equal black.toRgbString()
				done()
			#
			text.animate
				color: "red"

		it "should start animating from the fontsize the layer has", (done) ->
			text = new TextLayer
				styledText: simpleStyledTextOptions

			text.onAnimationStart ->
				text.fontSize.should.equal 16
				done()
			#
			text.animate
				color: "red"

		it "should animate padding", (done) ->
			text = new TextLayer
				styledText: simpleStyledTextOptions
			text.padding = 10

			text.onAnimationStart ->
				text.padding.should.equal 10

			text.onAnimationEnd ->
				text.padding.should.equal 20
				done()

			text.animate
				padding: 20


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
			text.width.should.be.lessThan Screen.width
			text.height.should.equal 250

		it "should auto size the layer if the width is set explicitly", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: mediumText
				width: 100
			text.width.should.equal 100
			text.height.should.equal 750

		it "should not auto size the layer the size the layer if the width and height are explictly set", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: mediumText
				width: 123
				height: 456
			text.size.should.eql width: 123, height: 456


		it "should not auto size the layer the size the layer if the size is explictly set to a number", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: mediumText
				size: 123
			text.size.should.eql width: 123, height: 123

		it "should not auto size the layer the size the layer if the size is explictly set", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: mediumText
				size:
					width: 123
					height: 456
			text.size.should.eql width: 123, height: 456

		it "should not auto size the layer the size the layer if the frame is explictly set", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: mediumText
				frame:
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
			text.width.should.equal 144
			text.height.should.equal 600

		it "should auto size the layer when its parent is set afterwards", ->
			layer = new Layer width: 150
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: mediumText
			text.parent = layer
			text.width.should.equal 144
			text.height.should.equal 600

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

		it "should not take border width into account", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: shortText
				borderWidth: 5
			text.size.should.eql width: 312, height: 50

		it "should autosize with the right width when inside a parent", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: shortText
				borderWidth: 5
				padding: 3
			parent = new Layer
			text.parent = parent
			text.size.width.should.be.lessThan 100
			text.size.height.should.equal 256

		it "should ignore the parents border when autosizing", ->
			text = new TextLayer
				fontFamily: "Courier, Liberation Mono"
				text: shortText
				borderWidth: 5
				padding: 3
			parent = new Layer
				size: 200
				borderWidth: 10
			text.parent = parent
			text.size.should.eql width: 198, height: 106

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
			text.padding.should.equal 0

		it "should all padding when given a numeric value", ->
			text = new TextLayer
				padding: 10

			text.style.padding.should.equal "10px"
			text.padding.should.equal 10

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

		it "should have a default padding when setting styledText", ->
			text = new TextLayer
				styledText: {}
			text.padding.should.equal 0

		it "should take the devicePixelRatio into account", ->
			device = new DeviceComponent()
			device.deviceType = "apple-iphone-7-black"
			device.context.run ->
				layerA = new TextLayer
					size: 100
					padding: 10
				layerA.style.padding.should.equal "20px"

	describe "Fonts", ->
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

		it "should set the font property correctly", ->
			tagLayer1 = new TextLayer
				x: 24
				y: 24
				text: "tag"
				fontSize: 15
				fontFamily: "Courier"
				fontWeight: 400
				lineHeight: 1.6
				color: "white"
				backgroundColor: "red"

			tagLayer2 = new TextLayer
				x: 24
				y: 200
				text: "tag"
				font: "400 15px/1.6 Courier"
				color: "white"
				backgroundColor: "red"

			tagLayer1.size.should.eql tagLayer2.size

	describe "textOverflow", ->
		it "should enable clipping", ->
			l = new TextLayer
				textOverflow: "ellipsis"
			l.clip.should.equal true

		it "should enable multilineOverflow setting a specific height", ->
			l = new TextLayer
				textOverflow: "ellipsis"
				height: 20
				autoWidth: false
			l._styledText.getStyle("WebkitLineClamp").should.equal 1

		it "should should disable multilineOverflow when using clipping and setting a specific height", ->
			l = new TextLayer
				textOverflow: "clip"
				height: 20
				autoWidth: false
			l._styledText.getStyle("WebkitLineClamp").should.equal ''
			l._styledText.getStyle("whiteSpace").should.equal "nowrap"

		it "should set whitespace to pre-wrap setting no height", ->
			l = new TextLayer
				textOverflow: "ellipsis"
			l._styledText.getStyle("whiteSpace").should.equal "pre-wrap"
			l._styledText.getStyle("WebkitLineClamp").should.equal ''

		it "should disable line clamp property when it's disabled", ->
			l = new TextLayer
				textOverflow: "ellipsis"
				height: 20
				autoWidth: false
			l.textOverflow = null
			l._styledText.getStyle("WebkitLineClamp").should.equal ''

		it "should disable line whitespace property when it's disabled", ->
			l = new TextLayer
				textOverflow: "clip"
				height: 20
				autoWidth: false
			l.textOverflow = null
			l._styledText.getStyle("whiteSpace").should.equal "pre-wrap"

		it "should update the line-clamp when the height is updated", ->
			l = new TextLayer
				text: longText
				textOverflow: "ellipsis"
				height: 150
				autoWidth: false
			l._styledText.getStyle("WebkitLineClamp").should.equal 3
			l.height = 400
			l._styledText.getStyle("WebkitLineClamp").should.equal 8

		it "should not set the line-clamp when not using textOverflow", ->
			l = new TextLayer
				text: longText
				height: 150
			l._styledText.getStyle("WebkitLineClamp").should.equal ''
			l.height = 400
			l._styledText.getStyle("WebkitLineClamp").should.equal ''

	describe "truncate", ->
		it "should set textOverflow to ellipsis", ->
			l = new TextLayer
				text: longText
				truncate: true
			l.truncate.should.equal true
			l.textOverflow.should.equal "ellipsis"
			l._styledText.getStyle("WebkitLineClamp").should.equal 2
			l.truncate = false
			l.truncate.should.equal false
			expect(l.textOverflow).to.equal null
			expect(l._styledText.getStyle("WebkitLineClamp")).to.equal ''

	describe "Replacing Text", ->
		subject = null

		beforeEach ->
			subject = new TextLayer styledText: exampleStyledTextOptions

		it "should start with a valid text", ->
			subject._styledText.validate().should.equal true

		describe "Setting the text property", ->

			it "should replace the text with the provided text", ->
				lines = ["One", "Two", "Three"]
				newText = lines.join("\n")
				subject.text = newText
				subject.text.should.eql newText
				for block, index in subject._styledText.blocks
					block.text.should.equal lines[index]
					block.inlineStyles[0].text.should.equal lines[index]
				subject._styledText.validate().should.equal true


			it "should set the styles when setting a string with multiple lines", ->
				lines = ["One", "Two", "Three"]
				subject.text = lines.join("\n")
				for block, index in subject._styledText.blocks
					block.inlineStyles.length.should.equal 1
					style = block.inlineStyles[0]
					style.css.should.eql exampleStyledTextOptions.blocks[index].inlineStyles[0].css
					style.startIndex.should.eql 0
					style.endIndex.should.eql lines[index].length
				subject._styledText.validate().should.equal true

			it "should remove the blocks when setting a text with less lines then the existing text", ->
				lines = ["One", "Two"]
				subject.text = lines.join("\n")
				subject._styledText.blocks.length.should.equal 2
				subject._styledText.validate().should.equal true

			it "should continue using the last style when setting a text with more lines then the existing text", ->
				lines = ["One", "Two", "Three", "Fourteen"]
				text = lines.join("\n")
				subject.text = text
				subject.text.should.equal text
				subject._styledText.blocks.length.should.equal 4
				subject._styledText.blocks[3].inlineStyles.length.should.equal 1
				style = subject._styledText.blocks[3].inlineStyles[0]
				style.text.should.equal lines[3]
				style.startIndex.should.equal 0
				style.endIndex.should.equal lines[3].length
				style.css.should.eql exampleStyledTextOptions.blocks[2].inlineStyles[0].css
				subject._styledText.validate().should.equal true


		it "should replace the full text", ->
			searchText = "Search text"
			subject.text = searchText
			subject.replace(searchText, "Replacement")
			subject.text.should.equal "Replacement"
			subject._styledText.validate().should.equal true

		it "should have the same style as the original text", ->
			searchText = "Search text"
			replaceText = "Replacement"
			subject.text = searchText
			subject.replace(searchText, replaceText)
			style = subject._styledText.blocks[0].inlineStyles[0]
			style.startIndex.should.equal 0
			style.endIndex.should.equal replaceText.length
			style.css.should.equal exampleStyledTextOptions.blocks[0].inlineStyles[0].css
			subject._styledText.validate().should.equal true

		it "should replace partial text", ->
			subject.replace("ea", "oooo")
			subject.text.should.equal "Hooooder\nSubtitle\nLooooder Body text"
			subject.replace("o", "%")
			subject.text.should.equal "H%%%%der\nSubtitle\nL%%%%der B%dy text"
			subject._styledText.validate().should.equal true

		it "should handle replacing with the same text correctly", ->
			subject.replace("e", "e")
			subject.text.should.equal "Header\nSubtitle\nLeader Body text"
			subject.replace("e", "ee")
			subject.text.should.equal "Heeadeer\nSubtitlee\nLeeadeer Body teext"
			subject._styledText.validate().should.equal true

		it "should keep the styling in place when replacing text", ->
			searchText = "Search text"
			subject.text = searchText
			subject.replace(searchText, "Replacement")
			subject._styledText.blocks[0].inlineStyles[0].css.should.eql exampleStyledTextOptions.blocks[0].inlineStyles[0].css
			subject._styledText.validate().should.equal true

		it "should apply the style to the replaced partial text", ->
			subject.replace("e", "xxx")
			for block, blockIndex in subject._styledText.blocks
				for style, styleIndex in block.inlineStyles
					style.css.should.eql exampleStyledTextOptions.blocks[blockIndex].inlineStyles[styleIndex].css
			subject._styledText.validate().should.equal true

		it "should work with regexes", ->
			subject.replace(/d[ey]+/, "die")
			subject.text.should.equal "Headier\nSubtitle\nLeadier Bodie text"
			subject._styledText.validate().should.equal true

		it "should rerender the text when replacing it", ->
			htmlBefore = subject.html
			subject.replace("a", "b")
			subject.html.should.not.equal htmlBefore

		it "should emit change:text event only when the text has changed", (done) ->
			subject.on "change:text", ->
				done()
			subject.replace("a", "b")

		it "should not emit a change:text event when the text doesn't change", (done) ->
			subject.on "change:text", ->
				throw new Error("change:text event should not be emitted")
			subject.replace("e", "e")
			done()

	describe "value transformer", ->
		it "should set a value property", ->
			l = new TextLayer
				value: 123
			l.value.should.equal 123

		it "should set the text when setting the value property", ->
			l = new TextLayer
				value: 456
			l.text.should.equal "456"

		it "should only allow function for the transform property", ->
			(-> new TextLayer transform: 3).should.throw "Layer.transform: value '3' of type 'number' is not valid"

		it "should transform the value if the transform function is set", ->
			l = new TextLayer
				value: 123
				transform: (value) -> value + 456
			l.value.should.equal 123
			l.text.should.equal "579"

		it "should be able to animate text through the transform function", (done) ->
			l = new TextLayer
				value: 75
				transform: (value) ->
					minutes = Math.floor(value / 60)
					seconds = Math.round(value - (minutes * 60))
					return "#{minutes}:#{seconds}"

			l.onAnimationStart ->
				l.text.should.equal "1:15"

			l.onAnimationEnd ->
				l.text.should.equal "1:50"
				done()

			Utils.delay 0.1, ->
				l.text.substring(0, 3).should.equal "1:3"

			a = l.animate
				value: 110
				options:
					curve: Bezier.linear
					time: 0.2

		it "should treat non-numeric values as-is when states", (done) ->
			l = new TextLayer
				value: "hiep hiep"
			l.text.should.equal "hiep hiep"
			l.states.test =
				rotation: 100
				value: "hoera"
			l.onAnimationEnd ->
				l.text.should.equal "hoera"
				done()

			l.animate "test"

		it "should be able to animate back to the value of the default state", ->
			l = new TextLayer
				value: 3
			l.states.test = value: 10
			l.stateSwitch "test"
			l.text.should.equal "10"
			l.stateSwitch "default"
			l.text.should.equal "3"
			l.stateSwitch "test"
			l.text.should.equal "10"
