{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{Events} = require "./Events"
{Defaults} = require "./Defaults"
{BaseClass} = require "./BaseClass"
{EventEmitter} = require "./EventEmitter"
{Color} = require "./Color"
{Animation} = require "./Animation"
{LayerStyle} = require "./LayerStyle"
{LayerStates} = require "./LayerStates"
{LayerDraggable} = require "./LayerDraggable"
{LayerLayout} = require "./LayerLayout"
{Matrix} = require "./Matrix"
{GestureManager} = require "./GestureManager"

NoCacheDateKey = Date.now()

layerValueTypeError = (name, value) ->
	throw new Error("Layer.#{name}: value '#{value}' of type '#{typeof(value)}'' is not valid")

layerProperty = (obj, name, cssProperty, fallback, validator, transformer, options={}, set) ->
	result = 
		default: fallback
		get: -> 
			
			# console.log "Layer.#{name}.get #{@_properties[name]}", @_properties.hasOwnProperty(name)
			
			return @_properties[name] if @_properties.hasOwnProperty(name)
			return fallback

		set: (value) ->

			# console.log "Layer.#{name}.set #{value} current:#{@[name]}"

			if transformer
				value = transformer(value)

			# Return unless we get a new value
			return if value is @_properties[name]

			if value and validator and not validator(value)
				layerValueTypeError(name, value)

			@_properties[name] = value
			if cssProperty != null
				@_element.style[cssProperty] = LayerStyle[cssProperty](@)

			set?(@, value)
			@emit("change:#{name}", value)
			@emit("change:point", value) if name in ["x", "y"]
			@emit("change:size", value)  if name in ["width", "height"]
			@emit("change:frame", value) if name in ["x", "y", "width", "height"]
			@emit("change:rotation", value) if name in ["rotationZ"]

	result = _.extend(result, options)

class exports.Layer extends BaseClass

	constructor: (options={}) ->

		# Set needed private variables
		@_properties = {}
		@_style = {}
		@_children = []

		# Special power setting for 2d rendering path. Only enable this
		# if you know what you are doing. See LayerStyle for more info.
		@_prefer2d = false
		@_alwaysUseImageCache = false

		# Private setting for canceling of click event if wrapped in moved draggable
		@_cancelClickEventInDragSession = true
		@_cancelClickEventInDragSessionTolerance = 4

		# We have to create the element before we set the defaults
		@_createElement()

		if options.hasOwnProperty "frame"
			options = _.extend(options, options.frame)

		if options.hasOwnProperty "layout"
			options = _.extend(options, options.layout)

		options = Defaults.getDefaults "Layer", options

		super options

		# Add this layer to the current context
		@_context.addLayer(@)

		@_id = @_context.layerCounter

		# Backwards compatibility for superLayer
		if not options.parent and options.hasOwnProperty("superLayer")
			options.parent = options.superLayer

		# Insert the layer into the dom or the parent element
		if not options.parent
			@_insertElement() if not options.shadow
		else
			@parent = options.parent

		# If an index was set, we would like to use that one
		if options.hasOwnProperty("index")
			@index = options.index

		@_context.emit("layer:create", @)

	##############################################################
	# Properties

	# Readonly context property
	@define "context", get: -> @_context

	# A placeholder for layer bound properties defined by the user:
	@define "custom", @simpleProperty("custom", undefined)

	# Css properties
	@define "width",  layerProperty(@, "width",  "width", 100, _.isNumber)
	@define "height", layerProperty(@, "height", "height", 100, _.isNumber)

	@define "visible", layerProperty(@, "visible", "display", true, _.isBoolean)
	@define "opacity", layerProperty(@, "opacity", "opacity", 1, _.isNumber)
	@define "index", layerProperty(@, "index", "zIndex", 0, _.isNumber, null, {importable:false, exportable:false})
	@define "clip", layerProperty(@, "clip", "overflow", true, _.isBoolean)
	
	@define "scrollHorizontal", layerProperty @, "scrollHorizontal", "overflowX", false, _.isBoolean, null, {}, (layer, value) ->
		layer.ignoreEvents = false if value is true
	
	@define "scrollVertical", layerProperty @, "scrollVertical", "overflowY", false, _.isBoolean, null, {}, (layer, value) ->
		layer.ignoreEvents = false if value is true

	@define "scroll",
		get: -> @scrollHorizontal is true or @scrollVertical is true
		set: (value) -> @scrollHorizontal = @scrollVertical = value

	# Behaviour properties
	@define "ignoreEvents", layerProperty(@, "ignoreEvents", "pointerEvents", true, _.isBoolean)

	# Matrix properties
	@define "x", layerProperty(@, "x", "webkitTransform", 0, _.isNumber)
	@define "y", layerProperty(@, "y", "webkitTransform", 0, _.isNumber)
	@define "z", layerProperty(@, "z", "webkitTransform", 0, _.isNumber)

	@define "scaleX", layerProperty(@, "scaleX", "webkitTransform", 1, _.isNumber)
	@define "scaleY", layerProperty(@, "scaleY", "webkitTransform", 1, _.isNumber)
	@define "scaleZ", layerProperty(@, "scaleZ", "webkitTransform", 1, _.isNumber)
	@define "scale", layerProperty(@, "scale", "webkitTransform", 1, _.isNumber)

	@define "skewX", layerProperty(@, "skewX", "webkitTransform", 0, _.isNumber)
	@define "skewY", layerProperty(@, "skewY", "webkitTransform", 0, _.isNumber)
	@define "skew", layerProperty(@, "skew", "webkitTransform", 0, _.isNumber)

	# @define "scale",
	# 	get: -> (@scaleX + @scaleY + @scaleZ) / 3.0
	# 	set: (value) -> @scaleX = @scaleY = @scaleZ = value

	@define "originX", layerProperty(@, "originX", "webkitTransformOrigin", 0.5, _.isNumber)
	@define "originY", layerProperty(@, "originY", "webkitTransformOrigin", 0.5, _.isNumber)
	@define "originZ", layerProperty(@, "originZ", null, 0, _.isNumber)

	@define "perspective", layerProperty(@, "perspective", "webkitPerspective", 0, _.isNumber)
	@define "perspectiveOriginX", layerProperty(@, "perspectiveOriginX", "webkitPerspectiveOrigin", 0.5, _.isNumber)
	@define "perspectiveOriginY", layerProperty(@, "perspectiveOriginY", "webkitPerspectiveOrigin", 0.5, _.isNumber)

	@define "rotationX", layerProperty(@, "rotationX", "webkitTransform", 0, _.isNumber)
	@define "rotationY", layerProperty(@, "rotationY", "webkitTransform", 0, _.isNumber)
	@define "rotationZ", layerProperty(@, "rotationZ", "webkitTransform", 0, _.isNumber)
	@define "rotation",
		#exportable: false
		get: -> @rotationZ
		set: (value) -> @rotationZ = value

	# Filter properties
	@define "blur", layerProperty(@, "blur", "webkitFilter", 0, _.isNumber)
	@define "brightness", layerProperty(@, "brightness", "webkitFilter", 100, _.isNumber)
	@define "saturate", layerProperty(@, "saturate", "webkitFilter", 100, _.isNumber)
	@define "hueRotate", layerProperty(@, "hueRotate", "webkitFilter", 0, _.isNumber)
	@define "contrast", layerProperty(@, "contrast", "webkitFilter", 100, _.isNumber)
	@define "invert", layerProperty(@, "invert", "webkitFilter", 0, _.isNumber)
	@define "grayscale", layerProperty(@, "grayscale", "webkitFilter", 0, _.isNumber)
	@define "sepia", layerProperty(@, "sepia", "webkitFilter", 0, _.isNumber)

	# Shadow properties
	@define "shadowX", layerProperty(@, "shadowX", "boxShadow", 0, _.isNumber)
	@define "shadowY", layerProperty(@, "shadowY", "boxShadow", 0, _.isNumber)
	@define "shadowBlur", layerProperty(@, "shadowBlur", "boxShadow", 0, _.isNumber)
	@define "shadowSpread", layerProperty(@, "shadowSpread", "boxShadow", 0, _.isNumber)
	@define "shadowColor", layerProperty(@, "shadowColor", "boxShadow", "", Color.validColorValue, Color.toColor)

	# Color properties
	@define "backgroundColor", layerProperty(@, "backgroundColor", "backgroundColor", null, Color.validColorValue, Color.toColor)
	@define "color", layerProperty(@, "color", "color", null, Color.validColorValue, Color.toColor)

	# Border properties
	# Todo: make this default, for compat we still allow strings but throw a warning
	# @define "borderRadius", layerProperty(@, "borderRadius", "borderRadius", 0, _.isNumber
	@define "borderColor", layerProperty(@, "borderColor", "border", null, Color.validColorValue, Color.toColor)
	@define "borderWidth", layerProperty(@, "borderWidth", "border", 0, _.isNumber)

	@define "force2d", layerProperty(@, "force2d", "webkitTransform", false, _.isBoolean)
	@define "flat", layerProperty(@, "flat", "webkitTransformStyle", false, _.isBoolean)
	@define "backfaceVisible", layerProperty(@, "backfaceVisible", "webkitBackfaceVisibility", true, _.isBoolean)

	# Layout properties
	for layoutProp in LayerLayout.layoutProps
		do (layoutProp) =>
			@define layoutProp, 
				default: undefined
				get: -> 
					@_getPropertyValue layoutProp
				set: (value) ->
					@_setPropertyValue layoutProp, value
					# Set the layout attribute on LayerLayout
					@layout().updateProperty(layoutProp, value)

	##############################################################
	# Identity

	@define "name",
		default: ""
		get: -> 
			@_getPropertyValue "name"
		set: (value) ->
			@_setPropertyValue "name", value
			# Set the name attribute of the dom element too
			# See: https://github.com/koenbok/Framer/issues/63
			@_element.setAttribute "name", value

	##############################################################
	# Matrices

	# matrix of layer transforms
	@define "matrix",
		get: ->
			if @force2d
				return @_matrix2d
			return new Matrix()
				.translate(@x, @y, @z)
				.scale(@scale)
				.scale(@scaleX, @scaleY, @scaleZ)
				.skew(@skew)
				.skewX(@skewX)
				.skewY(@skewY)
				.translate(0, 0, @originZ)
				.rotate(@rotationX, 0, 0)
				.rotate(0, @rotationY, 0)
				.rotate(0, 0, @rotationZ)
				.translate(0, 0, -@originZ)

	# matrix of layer transforms when 2d is forced
	@define "_matrix2d",
		get: ->
			return new Matrix()
				.translate(@x, @y)
				.scale(@scale)
				.skewX(@skew)
				.skewY(@skew)
				.rotate(0, 0, @rotationZ)

	# matrix of layer transforms with transform origin applied
	@define "transformMatrix",
		get: ->
			return new Matrix()
				.translate(@originX * @width, @originY * @height)
				.multiply(@matrix)
				.translate(-@originX * @width, -@originY * @height)

	_perspectiveProjectionMatrix: (element) =>
		p = element.perspective
		m = new Matrix()
		m.m34 = -1/p if p? and p isnt 0
		return m

	# matrix of perspective projection with perspective origin applied
	_perspectiveMatrix: (element) =>
		ox = element.perspectiveOriginX * element.width
		oy = element.perspectiveOriginY * element.height
		ppm = @_perspectiveProjectionMatrix(element)
		return new Matrix()
			.translate(ox, oy)
			.multiply(ppm)
			.translate(-ox, -oy)

	# matrix of layer transforms with perspective applied
	@define "matrix3d",
		get: ->
			parent = @superLayer or @context
			ppm = @_perspectiveMatrix(parent)
			return new Matrix()
				.multiply(ppm)
				.multiply(@transformMatrix)

	##############################################################
	# Border radius compatibility

	@define "borderRadius",
		importable: true
		exportable: true
		default: 0
		get: -> 
			@_properties["borderRadius"]

		set: (value) ->

			if value and not _.isNumber(value)
				console.warn "Layer.borderRadius should be a numeric property, not type #{typeof(value)}"

			@_properties["borderRadius"] = value
			@_element.style["borderRadius"] = LayerStyle["borderRadius"](@)

			@emit("change:borderRadius", value)

	# And, because it should be cornerRadius, we alias it here
	@define "cornerRadius",
		importable: false
		exportable: false
		# exportable: no
		get: -> @borderRadius
		set: (value) -> @borderRadius = value

	##############################################################
	# Geometry

	@define "point",
		get: -> _.pick(@, ["x", "y"])
		set: (point) ->
			return if not point
			for k in ["x", "y"]
				@[k] = point[k] if point.hasOwnProperty(k)
				
	@define "size",
		get: -> _.pick(@, ["width", "height"])
		set: (size) ->
			return if not size
			for k in ["width", "height"]
				@[k] = size[k] if size.hasOwnProperty(k)

	@define "frame",
		get: -> _.pick(@, ["x", "y", "width", "height"])
		set: (frame) ->
			return if not frame
			for k in ["x", "y", "width", "height"]
				@[k] = frame[k] if frame.hasOwnProperty(k)

	@define "minX",
		importable: true
		exportable: false
		get: -> @x
		set: (value) -> @x = value

	@define "midX",
		importable: true
		exportable: false
		get: -> Utils.frameGetMidX @
		set: (value) -> Utils.frameSetMidX @, value

	@define "maxX",
		importable: true
		exportable: false
		get: -> Utils.frameGetMaxX @
		set: (value) -> Utils.frameSetMaxX @, value

	@define "minY",
		importable: true
		exportable: false
		get: -> @y
		set: (value) -> @y = value

	@define "midY",
		importable: true
		exportable: false
		get: -> Utils.frameGetMidY @
		set: (value) -> Utils.frameSetMidY @, value

	@define "maxY",
		importable: true
		exportable: false
		get: -> Utils.frameGetMaxY @
		set: (value) -> Utils.frameSetMaxY @, value

	convertPointFromScreen: (point) ->
		return Utils.convertPointFromContext(point, @, false)

	convertPointFromCanvas: (point) ->
		return Utils.convertPointFromContext(point, @, true)

	convertPointToScreen: (point) ->
		return Utils.convertPointToContext(point, @, false)

	convertPointToCanvas: (point) ->
		return Utils.convertPointToContext(point, @, true)

	@define "canvasFrame",
		importable: true
		exportable: false
		get: ->
			return Utils.boundingFrame(@)
		set: (frame) ->
			@frame = Utils.convertFrameFromContext(frame, @, true, false)

	@define "screenFrame",
		importable: true
		exportable: false
		get: ->
			return Utils.boundingFrame(@, false)
		set: (frame) ->
			@frame = Utils.convertFrameFromContext(frame, @, false, false)

	contentFrame: ->
		return {x:0, y:0, width:0, height:0} unless @children.length
		Utils.frameMerge(_.pluck(@children, "frame"))

	centerFrame: ->
		# Get the centered frame for its parent
		if @parent
			frame = @frame
			Utils.frameSetMidX(frame, parseInt((@parent.width  / 2.0) - @superLayer.borderWidth))
			Utils.frameSetMidY(frame, parseInt((@parent.height / 2.0) - @superLayer.borderWidth))
			return frame
		else
			frame = @frame
			Utils.frameSetMidX(frame, parseInt(@_context.width  / 2.0))
			Utils.frameSetMidY(frame, parseInt(@_context.height / 2.0))
			return frame

	center: ->
		@frame = @centerFrame() # Center  in parent
		@
	
	centerX: (offset=0) ->
		@x = @centerFrame().x + offset # Center x in parent
		@
	
	centerY: (offset=0) ->
		@y = @centerFrame().y + offset # Center y in parent
		@

	pixelAlign: ->
		@x = parseInt @x
		@y = parseInt @y


	##############################################################
	# SCREEN GEOMETRY

	# TODO: Rotation/Skew

	# screenOriginX = ->
	# 	if @_parentOrContext()
	# 		return @_parentOrContext().screenOriginX()
	# 	return @originX
	
	# screenOriginY = ->
	# 	if @_parentOrContext()
	# 		return @_parentOrContext().screenOriginY()
	# 	return @originY

	canvasScaleX: ->
		scale = @scale * @scaleX
		for parent in @ancestors(context=true)
			scale = scale * parent.scale * parent.scaleX
		return scale

	canvasScaleY: ->
		scale = @scale * @scaleY
		for parent in @ancestors(context=true)
			scale = scale * parent.scale * parent.scaleY
		return scale

	screenScaleX: ->
		scale = @scale * @scaleX
		for parent in @ancestors(context=false)
			scale = scale * parent.scale * parent.scaleX
		return scale

	screenScaleY: ->
		scale = @scale * @scaleY
		for parent in @ancestors(context=false)
			scale = scale * parent.scale * parent.scaleY
		return scale


	screenScaledFrame: ->

		# TODO: Scroll position

		frame =
			x: 0
			y: 0
			width:  @width  * @screenScaleX()
			height: @height * @screenScaleY()
		
		layers = @ancestors(context=true)
		layers.push(@)
		layers.reverse()
		
		for parent in layers
			factorX = if parent._parentOrContext() then parent._parentOrContext().screenScaleX() else 1
			factorY = if parent._parentOrContext() then parent._parentOrContext().screenScaleY() else 1
			layerScaledFrame = parent.scaledFrame()
			frame.x += layerScaledFrame.x * factorX
			frame.y += layerScaledFrame.y * factorY

		return frame

	scaledFrame: ->

		# Get the scaled frame for a layer, taking into account 
		# the transform origins.

		frame = @frame
		scaleX = @scale * @scaleX
		scaleY = @scale * @scaleY

		frame.width  *= scaleX
		frame.height *= scaleY
		frame.x += (1 - scaleX) * @originX * @width
		frame.y += (1 - scaleY) * @originY * @height
		
		return frame

	##############################################################
	# CSS

	@define "style",
		importable: true
		exportable: false
		get: -> @_element.style
		set: (value) ->
			_.extend @_element.style, value
			@emit "change:style"

	computedStyle: ->
		# This is an expensive operation

		getComputedStyle  = document.defaultView.getComputedStyle
		getComputedStyle ?= window.getComputedStyle
		
		return getComputedStyle(@_element)

	@define "classList",
		importable: true
		exportable: false
		get: -> @_element.classList

	##############################################################
	# DOM ELEMENTS

	_createElement: ->
		return if @_element?
		@_element = document.createElement "div"
		@_element.classList.add("framerLayer")

	_insertElement: ->
		@bringToFront()
		@_context.element.appendChild(@_element)

	@define "html",
		get: ->
			@_elementHTML?.innerHTML or ""

		set: (value) ->

			# Insert some html directly into this layer. We actually create
			# a child node to insert it in, so it won't mess with Framers
			# layer hierarchy.

			if not @_elementHTML
				@_elementHTML = document.createElement "div"
				@_element.appendChild @_elementHTML

			@_elementHTML.innerHTML = value

			# If the contents contains something else than plain text
			# then we turn off ignoreEvents so buttons etc will work.

			# if not (
			# 	@_elementHTML.childNodes.length == 1 and
			# 	@_elementHTML.childNodes[0].nodeName == "#text")
			# 	@ignoreEvents = false

			@emit "change:html"

	querySelector: (query) -> @_element.querySelector(query)
	querySelectorAll: (query) -> @_element.querySelectorAll(query)

	destroy: ->
		
		# Todo: check this

		if @parent
			@parent._children = _.without(@parent._children, @)

		@_element.parentNode?.removeChild @_element
		@removeAllListeners()
		@gestures.removeAllListeners()
		
		@_context.removeLayer(@)
		@_context.emit("layer:destroy", @)


	##############################################################
	## COPYING

	copy: ->

		# Todo: what about events, states, etc.

		layer = @copySingle()

		for child in @children
			copiedChild = child.copy()
			copiedChild.parent = layer

		layer

	copySingle: ->
		copy = new @constructor(@props)
		return copy

	##############################################################
	## IMAGE

	@define "image",
		default: ""
		get: ->
			@_getPropertyValue "image"
		set: (value) ->

			if not (_.isString(value) or value is null)
				layerValueTypeError("image", value)

			currentValue = @_getPropertyValue "image"

			if currentValue == value
				return @emit "load"

			# Todo: this is not very nice but I wanted to have it fixed
			# defaults = Defaults.getDefaults "Layer", {}

			# console.log defaults.backgroundColor
			# console.log @_defaultValues?.backgroundColor

			# if defaults.backgroundColor == @_defaultValues?.backgroundColor
			# 	@backgroundColor = null

			@backgroundColor = null

			# Set the property value
			@_setPropertyValue("image", value)

			if value in [null, ""]
				@style["background-image"] = null
				return

			imageUrl = value

			# Optional base image value
			# imageUrl = Config.baseUrl + imageUrl

			if @_alwaysUseImageCache is false and Utils.isLocalAssetUrl(imageUrl)
				imageUrl += "?nocache=#{NoCacheDateKey}"

			# As an optimization, we will only use a loader
			# if something is explicitly listening to the load event
			
			if @_domEventManager.listeners(Events.ImageLoaded) or @_domEventManager.listeners(Events.ImageLoadError)

				loader = new Image()
				loader.name = imageUrl
				loader.src = imageUrl

				loader.onload = =>
					@style["background-image"] = "url('#{imageUrl}')"
					@emit Events.ImageLoaded, loader

				loader.onerror = =>
					@emit Events.ImageLoadError, loader

			else
				@style["background-image"] = "url('#{imageUrl}')"

	##############################################################
	## HIERARCHY

	@define "parent",
		enumerable: false
		exportable: false
		importable: true
		get: ->
			@_parent or null
		set: (layer) ->

			return if layer is @_parent

			# Check the type
			if not layer instanceof Layer
				throw Error "Layer.parent needs to be a Layer object"

			# Cancel previous pending insertions
			Utils.domCompleteCancel @__insertElement

			# Remove from previous parent children
			if @_parent
				@_parent._children = _.without @_parent._children, @
				@_parent._element.removeChild @_element
				@_parent.emit "change:children", {added:[], removed:[@]}
				@_parent.emit "change:subLayers", {added:[], removed:[@]}

			# Either insert the element to the new parent element or into dom
			if layer
				layer._element.appendChild @_element
				layer._children.push @
				layer.emit "change:children", {added:[@], removed:[]}
				layer.emit "change:subLayers", {added:[@], removed:[]}
			else
				@_insertElement()

			# Set the parent
			@_parent = layer

			# Place this layer on top of its siblings
			@bringToFront()

			@emit "change:parent"
			@emit "change:superLayer"

	@define "children",
		enumerable: false
		exportable: false
		importable: false
		get: -> _.clone @_children

	@define "siblings",
		enumerable: false
		exportable: false
		importable: false
		get: ->

			# If there is no parent we need to walk through the root
			if @parent is null
				return _.filter @_context.getLayers(), (layer) =>
					layer isnt @ and layer.parent is null

			return _.without @parent.children, @

	@define "descendants",
		enumerable: false
		exportable: false
		importable: false
		get: ->
			result = []
			
			f = (layer) ->
				result.push(layer)
				layer.children.map(f)
			
			@children.map(f)
				
			return result

	addChild: (layer) ->
		layer.parent = @

	removeChild: (layer) ->

		if layer not in @children
			return

		layer.parent = null

	childrenWithName: (name) ->
		_.filter @children, (layer) -> layer.name == name

	siblingsWithName: (name) ->
		_.filter @siblingLayers, (layer) -> layer.name == name

	ancestors: (context=false) ->

		parents = []
		currentLayer = @

		if context is false
			while currentLayer.parent
				parents.push(currentLayer.parent)
				currentLayer = currentLayer.parent
		else
			while currentLayer._parentOrContext()
				parents.push(currentLayer._parentOrContext())
				currentLayer = currentLayer._parentOrContext()

		return parents

	childrenAbove: (point, originX=0, originY=0) -> _.filter @children, (layer) -> 
		Utils.framePointForOrigin(layer.frame, originX, originY).y < point.y
	childrenBelow: (point, originX=0, originY=0) -> _.filter @children, (layer) -> 
		Utils.framePointForOrigin(layer.frame, originX, originY).y > point.y
	childrenLeft: (point, originX=0, originY=0) -> _.filter @children, (layer) -> 
		Utils.framePointForOrigin(layer.frame, originX, originY).x < point.x
	childrenRight: (point, originX=0, originY=0) -> _.filter @children, (layer) -> 
		Utils.framePointForOrigin(layer.frame, originX, originY).x > point.x

	_parentOrContext: ->
		if @parent
			return @parent
		if @_context._parent
			return @_context._parent

	##############################################################
	# Backwards superLayer and children compatibility

	@define "superLayer",
		enumerable: false
		exportable: false
		importable: false
		get: -> @parent
		set: (value) -> @parent = value

	@define "subLayers",
		enumerable: false
		exportable: false
		importable: false
		get: -> @children

	@define "siblingLayers",
		enumerable: false
		exportable: false
		importable: false
		get: -> @siblings

	superLayers: (context=false) -> @ancestors(context)
	addSubLayer: (layer) -> @addChild(layer)
	removeSubLayer: (layer) -> @removeChild(layer)
	subLayersByName: (name) -> @childrenWithName(name)
	siblingLayersByName: (name) -> @siblingsWithName(name)
	subLayersAbove: (point, originX=0, originY=0) -> @childrenAbove(point, originX, originY)
	subLayersBelow: (point, originX=0, originY=0) -> @childrenBelow(point, originX, originY)
	subLayersLeft: (point, originX=0, originY=0) -> @childrenLeft(point, originX, originY)
	subLayersRight: (point, originX=0, originY=0) -> @childrenRight(point, originX, originY)
	_superOrParentLayer: -> @_parentOrContext()

	##############################################################
	## ANIMATION

	animate: (options) ->

		start = options.start
		start ?= true
		delete options.start

		options.layer = @
		animation = new Animation options
		animation.start() if start
		animation

	animations: ->
		# Current running animations on this layer
		_.filter @_context.animations, (animation) =>
			animation.options.layer == @

	animatingProperties: ->

		properties = {}

		for animation in @animations()
			for propertyName in animation.animatingProperties()
				properties[propertyName] = animation

		return properties

	@define "isAnimating",
		enumerable: false
		exportable: false
		get: -> @animations().length isnt 0

	animateStop: ->
		_.invoke(@animations(), "stop")
		@_draggable?.animateStop()

	##############################################################
	## INDEX ORDERING

	bringToFront: ->
		@index = _.max(_.union([0], @siblingLayers.map (layer) -> layer.index)) + 1

	sendToBack: ->
		@index = _.min(_.union([0], @siblingLayers.map (layer) -> layer.index)) - 1

	placeBefore: (layer) ->
		return if layer not in @siblingLayers

		for l in @siblingLayers
			if l.index <= layer.index
				l.index -= 1

		@index = layer.index + 1

	placeBehind: (layer) ->
		return if layer not in @siblingLayers

		for l in @siblingLayers
			if l.index >= layer.index
				l.index += 1

		@index = layer.index - 1

	##############################################################
	## STATES

	@define "states",
		enumerable: false
		exportable: false
		importable: false
		get: -> @_states ?= new LayerStates @

	#############################################################################
	## Draggable

	@define "draggable",
		importable: false
		exportable: false
		get: ->
			@_draggable ?= new LayerDraggable(@)
		set: (value) ->
			@draggable.enabled = value if _.isBoolean(value)


	#############################################################################
	## Layout

	layout: ->
		if not @_layout
			@_layout = new LayerLayout(@)
		else
			@_layout

	##############################################################
	## SCROLLING

	@define "scrollFrame",
		importable: false
		get: ->
			frame = 
				x: @scrollX
				y: @scrollY
				width: @width
				height: @height
		set: (frame) ->
			@scrollX = frame.x
			@scrollY = frame.y

	@define "scrollX",
		get: -> @_element.scrollLeft
		set: (value) ->
			layerValueTypeError("scrollX", value) if not _.isNumber(value)
			@_element.scrollLeft = value

	@define "scrollY",
		get: -> @_element.scrollTop
		set: (value) -> 
			layerValueTypeError("scrollY", value) if not _.isNumber(value)
			@_element.scrollTop = value

	##############################################################
	## EVENTS

	@define "_domEventManager",
		get: -> @_context.domEventManager.wrap(@_element)

	emit: (eventName, args...) ->

		# If this layer has a parent draggable view and its position moved
		# while dragging we automatically cancel click events. This is what
		# you expect when you add a button to a scroll content layer.

		if @_cancelClickEventInDragSession
			if eventName is Events.Click
				parentDraggableLayer = @_parentDraggableLayer()
				if parentDraggableLayer
					offset = parentDraggableLayer.draggable.offset
					return if Math.abs(0 - offset.x) > @_cancelClickEventInDragSessionTolerance
					return if Math.abs(0 - offset.y) > @_cancelClickEventInDragSessionTolerance

		# Always scope the event this to the layer and pass the layer as
		# last argument for every event.
		super(eventName, args..., @)

	once: (eventName, listener) =>
		super(eventName, listener)
		@_addListener(eventName, listener)

	addListener: (eventName, listener) =>
		super(eventName, listener)
		@_addListener(eventName, listener)

	removeListener: (eventName, listener) ->
		super(eventName, listener)
		@_removeListener(eventName, listener)

	_addListener: (eventName, listener) ->

		# If this is a dom event, we want the actual dom node to let us know
		# when it gets triggered, so we can emit the event through the system.
		if Utils.domValidEvent(@_element, eventName)
			if not @_domEventManager.listeners(eventName).length
				@_domEventManager.addEventListener eventName, (event) =>
					@emit(eventName, event)

		# Make sure we stop ignoring events once we add a user event listener
		if not _.startsWith eventName, "change:"
			@ignoreEvents = false

	_removeListener: (eventName, listener) ->

		# Do cleanup for dom events if this is the last one of it's type.
		# We are assuming we're the only ones adding dom events to the manager.
		if not @listeners(eventName).length
			@_domEventManager.removeAllListeners(eventName)

	_parentDraggableLayer: ->
		for layer in @ancestors().concat(@)
			return layer if layer._draggable?.enabled
		return null 

	on: @::addListener
	off: @::removeListener

	##############################################################
	## EVENTS

	@define "gestures",
		get: ->
			@_gestures ?= new GestureManager(@)
			return @_gestures

	##############################################################
	## EVENT HELPERS

	onClick: (cb) -> @on(Events.Click, cb)
	onDoubleClick: (cb) -> @on(Events.DoubleClick, cb)
	onScroll: (cb) -> @on(Events.Scroll, cb)
	
	onTouchStart: (cb) -> @on(Events.TouchStart, cb)
	onTouchEnd: (cb) -> @on(Events.TouchEnd, cb)
	onTouchMove: (cb) -> @on(Events.TouchMove, cb)

	onMouseUp: (cb) -> @on(Events.MouseUp, cb)
	onMouseDown: (cb) -> @on(Events.MouseDown, cb)
	onMouseOver: (cb) -> @on(Events.MouseOver, cb)
	onMouseOut: (cb) -> @on(Events.MouseOut, cb)
	onMouseMove: (cb) -> @on(Events.MouseMove, cb)
	onMouseWheel: (cb) -> @on(Events.MouseWheel, cb)

	onAnimationStart: (cb) -> @on(Events.AnimationStart, cb)
	onAnimationStop: (cb) -> @on(Events.AnimationStop, cb)
	onAnimationEnd: (cb) -> @on(Events.AnimationEnd, cb)
	onAnimationDidStart: (cb) -> @on(Events.AnimationDidStart, cb)
	onAnimationDidStop: (cb) -> @on(Events.AnimationDidStop, cb)
	onAnimationDidEnd: (cb) -> @on(Events.AnimationDidEnd, cb)

	onImageLoaded: (cb) -> @on(Events.ImageLoaded, cb)
	onImageLoadError: (cb) -> @on(Events.ImageLoadError, cb)
	
	onMove: (cb) -> @on(Events.Move, cb)
	onDragStart: (cb) -> @on(Events.DragStart, cb)
	onDragWillMove: (cb) -> @on(Events.DragWillMove, cb)
	onDragMove: (cb) -> @on(Events.DragMove, cb)
	onDragDidMove: (cb) -> @on(Events.DragDidMove, cb)
	onDrag: (cb) -> @on(Events.Drag, cb)
	onDragEnd: (cb) -> @on(Events.DragEnd, cb)
	onDragAnimationDidStart: (cb) -> @on(Events.DragAnimationDidStart, cb)
	onDragAnimationDidEnd: (cb) -> @on(Events.DragAnimationDidEnd, cb)
	onDirectionLockDidStart: (cb) -> @on(Events.DirectionLockDidStart, cb)

	##############################################################
	## DESCRIPTOR

	toInspect: ->

		round = (value) ->
			if parseInt(value) == value
				return parseInt(value)
			return Utils.round(value, 1)

		if @name
			return "<#{@constructor.name} id:#{@id} name:#{@name} (#{round(@x)},#{round(@y)}) #{round(@width)}x#{round(@height)}>"
		return "<#{@constructor.name} id:#{@id} (#{round(@x)},#{round(@y)}) #{round(@width)}x#{round(@height)}>"
