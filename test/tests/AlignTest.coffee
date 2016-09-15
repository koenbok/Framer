describe "Align", ->

	createAlignedLayers = (property,value,properties={}) ->
		properties.width ?= 500
		properties.height ?= 300
		parent = new Layer properties
		child = createSublayer(parent,property,value)
		{parent: parent, child: child}

	createSublayer = (layer,property, value) ->
		layer = new Layer
			width: 100
			height: 200
			superLayer: layer
		layer[property] = value
		layer

	describe "center", ->

		it "should center the layer", ->
			{child} = createAlignedLayers("x",Align.center)
			child.x.should.equal 200
			{child} = createAlignedLayers("y",Align.center)
			child.y.should.equal 50

		it "should work when the layer has no parent", ->
			layer = new Layer
				width: 100
				height: 150
				x: Align.center
				y: Align.center
			layer.x.should.equal 150
			layer.y.should.equal 75

		it "should take borderWidth into account", ->
			{child} = createAlignedLayers("x",Align.center,{borderWidth:30})
			child.x.should.equal 170
			{child} = createAlignedLayers("y",Align.center,{borderWidth:30})
			child.y.should.equal 20


	describe "left", ->

		it "should left align the layer", ->
			{child} = createAlignedLayers("x",Align.left)
			child.x.should.equal 0

		it "should work when the layer has no parent", ->
			layer = new Layer
				width: 100
				x: Align.left
			layer.x.should.equal 0

		it "should take borderWidth into account", ->
			{child} = createAlignedLayers("x",Align.left,{borderWidth:30})
			child.x.should.equal 0

	describe "right", ->

		it "should right align the layer", ->
			{child} = createAlignedLayers("x",Align.right)
			child.x.should.equal 400

		it "should work when the layer has no parent", ->
			layer = new Layer
				width: 100
				x: Align.right
			layer.x.should.equal 300

		it "should take borderWidth into account", ->
			{child} = createAlignedLayers("x",Align.right,{borderWidth:30})
			child.x.should.equal 340

	describe "top", ->

		it "should top align the layer", ->
			{child} = createAlignedLayers("y",Align.top)
			child.y.should.equal 0

		it "should work when the layer has no parent", ->
			layer = new Layer
				height: 100
				y: Align.top
			layer.y.should.equal 0

		it "should take borderWidth into account", ->
			{child} = createAlignedLayers("y",Align.top,{borderWidth:30})
			child.y.should.equal 0

	describe "bottom", ->

		it "should bottom align the layer", ->
			{child} = createAlignedLayers("y",Align.bottom)
			child.y.should.equal 100

		it "should work when the layer has no parent", ->
			layer = new Layer
				height: 100
				y: Align.bottom
			layer.y.should.equal 200

		it "should take borderWidth into account", ->
			{child} = createAlignedLayers("y",Align.bottom,{borderWidth:30})
			child.y.should.equal 40

	describe "constructors", ->

		it "should work with size", ->
			test = new Layer
				parent: new Layer size: 200
				x: Align.center
				y: Align.center
				size: 100

			test.x.should.equal 50
			test.y.should.equal 50

		it "should work with point and size", ->
			test = new Layer
				parent: new Layer size: 200
				size: 100
				point: Align.center

			test.x.should.equal 50
			test.y.should.equal 50

		it "should work with point", ->
			test = new Layer
				parent: new Layer size: 200
				width: 100
				height: 100
				point: Align.center

			test.x.should.equal 50
			test.y.should.equal 50

		it "should work with both size and width height", ->
			test = new Layer
				parent: new Layer size: 200
				width: 100
				height: 100
				point: Align.center
				size: 200

			test.x.should.equal 50
			test.y.should.equal 50
