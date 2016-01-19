computeLayout = require 'css-layout'
{EventEmitter} = require "./EventEmitter"
{_} = require "./Underscore"

class exports.LayerLayout extends EventEmitter

	@layoutProps = [
		"fixedWidth", "fixedHeight", 
		"minWidth", "minHeight", 
		"maxWidth", "maxHeight", 
		"left", "right", "top", "bottom", 
		"margin", "marginLeft", "marginRight", "marginTop", "marginBottom",
		"padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom",
		# "borderWidth", 
		"borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth",
		"flexDirection",
		"justifyContent",
		"alignItems", "alignSelf",
		"flex",
		"flexWrap",
		"position"
	]

	# A string to specify an animation for each new layout
	# It might be interesting to have a different value in a Layer basis
	curve: undefined

	constructor: (@layer) ->
		@layer.on("change:subLayers", @_updateTree)
		@layer._context.domEventManager.wrap(window).addEventListener("resize", @_didResize)
		# When the change:subLayers event is triggered, the 'superLayer' property has not been set yet, so we need a way to know
		# if we are dealing with a root layer (i.e. doesn't have any superLayer) or not
		# if isRoot
		# 	@_setupResizeListener()

		# This property contains everything needed in 'computeLayout' to make the calculations
		@_layoutNode =
			style: {}
			children: []

		for property of LayerLayout.layoutProps
			if @layer[property]
				@_layoutNode.style[@_getLayoutProperty(property)] = @layer[property]

	_didResize: =>
		if not @layer.superLayer
			@_setNeedsUpdate()

	# This is a temporary hack to maintain original 'width' and 'height'
	# We should add support for position 'relative' and 'absolute'
	_getLayoutProperty: (property) ->
		cssLayoutProperty = property
		# We rename 'width' and 'height' css-layout props to 'fixedWidth' and 'fixedHeight'
		# so we don't overwrite Framer original 'width' and 'height' Layer props 
		if cssLayoutProperty is "fixedWidth" then cssLayoutProperty = "width"
		if cssLayoutProperty is "fixedHeight" then cssLayoutProperty = "height"
		return cssLayoutProperty

	updateProperty: (property, value) ->
		if property
			# TODO Check if value exists
			# TODO How can we handle property removal?
			# TODO Check value changes from previous value
			@_layoutNode.style[@_getLayoutProperty(property)] = value
		
		@_setNeedsUpdate()

	_updateTree: (layersChanged) =>
		for layerAdded in layersChanged.added
			@_layoutNode.children.push(layerAdded.layout._layoutNode)
		for layerRemoved in layersChanged.removed
			@_layoutNode.children.splice(_layoutNode.indexOf(layerRemoved.layout._layoutNode), 1)
		@_setNeedsUpdate()

	_setNeedsUpdate: =>
		rootLayer = @layer
		while rootLayer.superLayer
			rootLayer = rootLayer.superLayer
		# Hack to add Screen size
		# TODO Maybe add this root node to the Canvas class?
		rootLayoutNode =
			style:
				width: Screen.width
				height: Screen.height
			children: [rootLayer.layout._layoutNode]
		newTree = _.cloneDeep(rootLayoutNode)
		computeLayout(newTree)
		rootLayer.layout._updateLayer(newTree.children[0])

	_updateLayer: (computedTree) ->
		if computedTree.shouldUpdate
			if not @curve
				frame = 
					x: computedTree.layout.left
					y: computedTree.layout.top
					width: computedTree.layout.width
					height: computedTree.layout.height
				@layer.frame = frame
			else
				@layer.animate
					properties:
						x: computedTree.layout.left
						y: computedTree.layout.top
						width: computedTree.layout.width
						height: computedTree.layout.height
					curve: @curve
		for subLayer, i in @layer.subLayers
			if computedTree.children and computedTree.children.length > i
				subLayer.layout._updateLayer(computedTree.children[i])