computeLayout = require 'css-layout'

class LayerLayout

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


	constructor: (@layer) ->
		@layer.on("change:subLayers", @_updateTree)
		@layer.on("change:superLayer", @_setNeedsUpdate)
		# When the change:subLayers event is triggered, the 'superLayer' property has not been set yet, so we need a way to know
		# if we are dealing with a root layer (i.e. doesn't have any superLayer) or not
		# if isRoot
		# 	@_setupResizeListener()

		# This property contains everything needed in 'computeLayout' to make the calculations
		@_layoutNode =
			style: {}
			children: []

		for property, value of @layer
			if (property in LayerLayout.layoutProps) and value
				@_layoutNode.style[@_getLayoutProperty(property)] = value

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

	_createLayersTree: () =>
		layerTree =
			style: {}
			children: []
		
		if @layer.subLayers
			for subLayer in @layer.subLayers
				if subLayer._layout
					layerTree.children.push(subLayer._layout._createLayersTree())
				else
					console.log("Sublayer has no layout. Name: ", subLayer.name)

		if not @layer.superLayer
			# Add the Screen as root node
			layerTree =
				style:
					width: Screen.width
					height: Screen.height
				children: [layerTree]
		else if not @layer._layout
			# Add the layer as root
			layerTree =
				style:
					width: @layer.width
					height: @layer.height
				children: [layerTree]

		return layerTree

	_updateTree: (layersChanged) =>
		console.log("updating tree of layer " + @layer.name)
		for layerAdded in layersChanged.added
			console.log("Adding layout, ", layerAdded.layout(), " to ", @layer.layout())
			@_layoutNode.children.push(layerAdded.layout()._layoutNode)
		for layerRemoved in layersChanged.removed
			console.log("Removing layout, ", layerRemoved.layout(), " to ", @layer.layout())
			@_layoutNode.children.splice(_layoutNode.indexOf(layerRemoved.layout()._layoutNode), 1)
		
	_setNeedsUpdate: =>
		rootLayer = @layer
		if not rootLayer.superLayer
			console.log("es el superLayer", @layer.name)
		while rootLayer.superLayer
			rootLayer = rootLayer.superLayer
		# Hack to add Screen size
		rootLayoutNode =
			style:
				width: Screen.width
				height: Screen.height
			children: [rootLayer.layout()._layoutNode]
		console.log("tree", rootLayoutNode.style, rootLayoutNode.children)
		computeLayout(rootLayoutNode)
		@_updateLayer()

	_updateLayer: ->
		if @layer.layout()._layoutNode.shouldUpdate
			frame = 
				x: @layer.layout()._layoutNode.layout.left
				y: @layer.layout()._layoutNode.layout.top
				width: @layer.layout()._layoutNode.layout.width
				height: @layer.layout()._layoutNode.layout.height
			@layer.frame = frame
			console.log("setting frame to ", frame) 
		for subLayer in @layer.subLayers
			subLayer.layout()._updateLayer()

exports.LayerLayout = LayerLayout
