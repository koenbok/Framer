{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{Events} = require "./Events"
{Defaults} = require "./Defaults"
{BaseClass} = require "./BaseClass"
{EventEmitter} = require "./EventEmitter"
{Color} = require "./Color"
{Matrix} = require "./Matrix"
{Animation} = require "./Animation"
{LayerStyle} = require "./LayerStyle"
{LayerStates} = require "./LayerStates"
{LayerDraggable} = require "./LayerDraggable"
{LayerPinchable} = require "./LayerPinchable"
{Gestures} = require "./Gestures"

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

			# console.log "#{@constructor.name}.#{name}.set #{value} current:#{@[name]}"

			# Convert the value
			value = transformer(value, @, name) if transformer

			# Return unless we get a new value
			return if value is @_properties[name]

			if value and validator and not validator(value)
				layerValueTypeError(name, value)

			@_properties[name] = value

			if cssProperty isnt null
				if name is cssProperty and not LayerStyle[cssProperty]?
					@_element.style[cssProperty] = @_properties[name]
				else
					@_element.style[cssProperty] = LayerStyle[cssProperty](@)

			set?(@, value)

			# We try to not send any events while we run the constructor, it just
			# doesn't make sense, because no one can listen to use yet.
			return if @__constructor

			@emit("change:#{name}", value)
			@emit("change:point", value) if name in ["x", "y"]
			@emit("change:size", value)  if name in ["width", "height"]
			@emit("change:frame", value) if name in ["x", "y", "width", "height"]
			@emit("change:rotation", value) if name in ["rotationZ"]

	result = _.extend(result, options)

exports.layerProperty = layerProperty

layerPropertyPointTransformer = (value, layer, property) ->
	if _.isFunction(value)
		value = value(layer, property)

	return value

layerPropertyIgnore = (options, propertyName, properties) ->
	return options unless options.hasOwnProperty(propertyName)

	for p in properties
		if options.hasOwnProperty(p)
			delete options[propertyName]
			return options

	return options

class exports.Layer extends BaseClass

	constructor: (options={}) ->

		# Make sure we never call the constructor twice
		throw Error("Layer.constructor #{@toInspect()} called twice") if @__constructorCalled
		@__constructorCalled = true
		@__constructor = true

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
		@_cancelClickEventInDragSessionVelocity = 0.1
		@_cancelClickEventInDragSessionOffset = 8

		# We have to create the element before we set the defaults
		@_createElement()

		# Sanitize calculated property setters so direct properties always win
		layerPropertyIgnore(options, "point", ["x", "y"])
		layerPropertyIgnore(options, "size", ["width", "height"])
		layerPropertyIgnore(options, "frame", ["x", "y", "width", "height"])

		# Backwards compatibility for superLayer
		if not options.hasOwnProperty("parent") and options.hasOwnProperty("superLayer")
			options.parent = options.superLayer
			delete options.superLayer

		super Defaults.getDefaults("Layer", options)

		# Add this layer to the current context
		@_context.addLayer(@)
		@_id = @_context.layerCounter

		# Insert the layer into the dom or the parent element
		if not options.parent
			@_insertElement() if not options.shadow
		else
			@parent = options.parent

		# Set some calculated properties
		# Make sure we set the right index
		if options.hasOwnProperty("index")
			@index = options.index

		# x and y always win from point, frame or size
		for p in ["x", "y", "width", "height"]
			if options.hasOwnProperty(p)
				@[p] = options[p]

		@_context.emit("layer:create", @)

		# Make sure the layer is always centered
		@label = @label

		delete @__constructor

	##############################################################
	# Properties

	# Readonly context property
	@define "context", get: -> @_context

	@define "label",
		get: -> @_label
		set: (value="") ->
			@_label = value
			Utils.labelLayer(@, @_label)

	# A placeholder for layer bound properties defined by the user:
	@define "custom", @simpleProperty("custom", undefined)

	# Default animation options for every animation of this layer
	@define "animationOptions", @simpleProperty("animationOptions", {})

	# Css properties
	@define "width",  layerProperty(@, "width",  "width", 100, _.isNumber)
	@define "height", layerProperty(@, "height", "height", 100, _.isNumber)

	@define "visible", layerProperty(@, "visible", "display", true, _.isBoolean)
	@define "opacity", layerProperty(@, "opacity", "opacity", 1, _.isNumber)
	@define "index", layerProperty(@, "index", "zIndex", 0, _.isNumber, null, {importable: false, exportable: false})
	@define "clip", layerProperty(@, "clip", "overflow", false, _.isBoolean)

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
	@define "x", layerProperty(@, "x", "webkitTransform", 0, _.isNumber,
		layerPropertyPointTransformer, {depends: ["width", "height"]})
	@define "y", layerProperty(@, "y", "webkitTransform", 0, _.isNumber,
		layerPropertyPointTransformer, {depends: ["width", "height"]})
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

	##############################################################
	# Identity

	@define "name",
		default: ""
		get: ->
			name = @_getPropertyValue("name")
			return if name? then "#{name}" else ""

		set: (value) ->
			@_setPropertyValue("name", value)
			# Set the name attribute of the dom element too
			# See: https://github.com/koenbok/Framer/issues/63
			@_element.setAttribute("name", value)

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

	# matrix of layer transforms with perspective applied
	@define "matrix3d",
		get: ->
			parent = @parent or @context
			ppm = Utils.perspectiveMatrix(parent)
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

			if value and not (_.isNumber(value) or _.isArray(value))
				console.warn "Layer.borderRadius should be a numeric property or an array, not type #{typeof(value)}"

			if value and _.isArray(value) and value.length > 4
				 console.warn "Layer.borderRadius should not be set to more than 4 values"

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

	_setGeometryValues: (input, keys) ->

		# If this is a number, we set everything to that number
		if _.isNumber(input)
			for k in keys
				@[k] = input
		else
			# If there is nothing to work with we exit
			return unless input

			# Set every numeric value for eacht key
			for k in keys
				@[k] = input[k] if _.isNumber(input[k])

	@define "point",
		importable: true
		exportable: false
		depends: ["width", "height", "size", "parent"]
		get: -> Utils.point(@)
		set: (input) ->
			input = layerPropertyPointTransformer(input, @, "point")
			@_setGeometryValues(input, ["x", "y"])

	@define "size",
		importable: true
		exportable: false
		get: -> Utils.size(@)
		set: (input) -> @_setGeometryValues(input, ["width", "height"])

	@define "frame",
		importable: true
		exportable: false
		get: -> Utils.frame(@)
		set: (input) -> @_setGeometryValues(input, ["x", "y", "width", "height"])


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

	convertPointToScreen: (point) =>
		return Utils.convertPointToContext(point, @, false)

	convertPointToCanvas: (point) =>
		return Utils.convertPointToContext(point, @, true)

	convertPointToLayer: (point, layer) =>
		return Utils.convertPoint(point, @, layer, true)

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
		return {x: 0, y: 0, width: 0, height: 0} unless @children.length
		return Utils.frameMerge(_.map(@children, "frame"))

	totalFrame: ->
		return Utils.frameMerge(@frame, @contentFrame())

	centerFrame: ->
		# Get the centered frame for its parent
		if @parent
			frame = @frame
			Utils.frameSetMidX(frame, parseInt((@parent.width  / 2.0) - @parent.borderWidth))
			Utils.frameSetMidY(frame, parseInt((@parent.height / 2.0) - @parent.borderWidth))
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

	canvasScaleX: (self=true) ->
		scale = 1
		scale = @scale * @scaleX if self
		for parent in @ancestors(context=true)
			scale = scale * parent.scale * parent.scaleX
		return scale

	canvasScaleY: (self=true) ->
		scale = 1
		scale = @scale * @scaleY if self
		for parent in @ancestors(context=true)
			scale = scale * parent.scale * parent.scaleY
		return scale

	screenScaleX: (self=true) ->
		scale = 1
		scale = @scale * @scaleX if self
		for parent in @ancestors(context=false)
			scale = scale * parent.scale * parent.scaleX
		return scale

	screenScaleY: (self=true) ->
		scale = 1
		scale = @scale * @scaleY if self
		for parent in @ancestors(context=false)
			scale = scale * parent.scale * parent.scaleY
		return scale


	screenScaledFrame: ->

		# TODO: Scroll position

		frame =
			x: 0
			y: 0
			width: @width  * @screenScaleX()
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
			# 	@_elementHTML.childNodes.length is 1 and
			# 	@_elementHTML.childNodes[0].nodeName is "#text")
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

		@_context.removeLayer(@)
		@_context.emit("layer:destroy", @)


	##############################################################
	## COPYING

	copy: ->

		layer = @copySingle()

		for child in @children
			copiedChild = child.copy()
			copiedChild.parent = layer

		return layer

	copySingle: ->
		copy = new @constructor(@props)
		copy.style = @style
		copy

	##############################################################
	## IMAGE

	_cleanupImageLoader: ->
		@_imageEventManager?.removeAllListeners()
		@_imageEventManager = null
		@_imageLoader = null


	@define "image",
		default: ""
		get: ->
			@_getPropertyValue "image"
		set: (value) ->

			if not (_.isString(value) or value is null)
				layerValueTypeError("image", value)

			currentValue = @_getPropertyValue "image"

			if currentValue is value
				return @emit "load"

			# Unset the background color only if it’s the default color
			defaults = Defaults.getDefaults "Layer", {}
			if @backgroundColor?.isEqual(defaults.backgroundColor)
				@backgroundColor = null

			# Set the property value
			@_setPropertyValue("image", value)
			if value in [null, ""]
				if @_imageLoader?
					@_imageEventManager.removeAllListeners()
					@_imageLoader.src = null

				@style["background-image"] = null

				if @_imageLoader?
					@emit Events.ImageLoadCancelled, @_imageLoader
					@_cleanupImageLoader()

				return

			# Show placeholder image on any browser that doesn't support inline pdf
			if _.endsWith(value.toLowerCase?(), ".pdf") and (not Utils.isWebKit() or Utils.isChrome())
				@style["background-image"] = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAVlJREFUaAXtlwEOwiAMRdF4Cr3/0fQaSre9ZFSYLCrQpSSG/FLW9v92agghXJdP3KZlCp/J2up+WiUuzMt6zNukzPDYvALCsKme1/maV8BnQHqw9/IZ6KmAz0BP9ontMwATPXafgR6s65g+A5qRlrhmBu6FhG6LXf9/+JU/YclROkVWEs/8r9FLrChb2apSqVqWZgKmtRKz9/f+CdPxoVl8CAWylcWKUQZGwfhjB3OOHcw5djDn2MH6fBNLC42yaEnyoTXB2V36+lPlz+zN9x6HKfxrZwZ/HUbf5/lJviMpoBPWBWWxFJCtLNqplItIWuvPffx5Dphz7GB9vonNv4X2zICWuMTM3p7Gv/b5iVLmFaiZgb3M/Ns/Ud68AvIGkJ6ir8xh8wrQrzAve9Jjo2PzCsC8z4Aw0WP5DPRgXcf07wHNSEvsM9CS7VIsn4ESMy3sPgMtWN6K8QKfubDo2UqVogAAAABJRU5ErkJggg==')"
				return

			imageUrl = value

			# Optional base image value
			# imageUrl = Config.baseUrl + imageUrl

			if @_alwaysUseImageCache is false and Utils.isLocalAssetUrl(imageUrl)
				imageUrl += if /\?/.test(imageUrl) then '&' else '?'
				imageUrl += "nocache=#{NoCacheDateKey}"

			# As an optimization, we will only use a loader
			# if something is explicitly listening to the load event

			if @listeners(Events.ImageLoaded, true) or @listeners(Events.ImageLoadError, true) or @listeners(Events.ImageLoadCancelled, true)
				@_imageLoader = new Image()
				@_imageLoader.name = imageUrl
				@_imageLoader.src = imageUrl
				@_imageEventManager = @_context.domEventManager.wrap(@_imageLoader)
				@_imageEventManager.addEventListener "load", =>
					@style["background-image"] = "url('#{imageUrl}')"
					@emit Events.ImageLoaded, @_imageLoader
					@_cleanupImageLoader()

				@_imageEventManager.addEventListener "error", =>
					@emit Events.ImageLoadError, @_imageLoader
					@_cleanupImageLoader()

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

			throw Error("Layer.parent: a layer cannot be it's own parent.") if layer is @

			# Check the type
			if not layer instanceof Layer
				throw Error "Layer.parent needs to be a Layer object"

			# Cancel previous pending insertions
			Utils.domCompleteCancel(@__insertElement)

			# Remove from previous parent children
			if @_parent
				@_parent._children = _.without @_parent._children, @
				@_parent._element.removeChild @_element
				@_parent.emit "change:children", {added: [], removed: [@]}
				@_parent.emit "change:subLayers", {added: [], removed: [@]}

			# Either insert the element to the new parent element or into dom
			if layer
				layer._element.appendChild @_element
				layer._children.push @
				layer.emit "change:children", {added: [@], removed: []}
				layer.emit "change:subLayers", {added: [@], removed: []}
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
				return _.filter @_context.layers, (layer) =>
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
		_.filter @children, (layer) -> layer.name is name

	siblingsWithName: (name) ->
		_.filter @siblingLayers, (layer) -> layer.name is name

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

	root: (context=false) ->
		return @ if @parent is null
		return _.last(@ancestors(context=context))


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

	animate: (properties, options={}) ->

		# If the properties are a string, we assume it's a state name
		if _.isString(properties)

			stateName = properties

			# Support options as an object
			options = options.options if options.options?

			return @states.machine.switchTo(stateName, options)
		# We need to clone the properties so we don't modify them unexpectedly
		properties = _.clone(properties)

		# Support the old properties syntax, we add all properties top level and
		# move the options into an options property.
		if properties.properties?
			options = properties
			properties = options.properties
			delete options.properties

		# With the new api we treat the properties as animatable properties, and use
		# the special options keyword for animation options.
		if properties.options?
			options = _.defaults({}, options, properties.options)
			delete properties.options

		# Merge the animation options with the default animation options for this layer
		options = _.defaults({}, options, @animationOptions)
		options.start ?= true

		animation = new Animation(@, properties, options)
		animation.start() if options.start

		return animation

	stateCycle: (args...) ->
		states = _.flatten(args)
		if _.isObject(_.last(states))
			options = states.pop()
		@animate(@states.machine.next(states), options)

	stateSwitch: (stateName, options={}) ->
		unless stateName?
			throw new Error("Missing required argument 'stateName' in stateSwitch()")
		return @animate(stateName, options) if options.animate is true
		return @animate(stateName, _.defaults({}, options, {instant: true}))

	animations: (includePending=false) ->
		# Current running animations on this layer
		_.filter @_context.animations, (animation) =>
			return false unless (animation.layer is @)
			return includePending or not animation.isPending

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
		_.invokeMap(@animations(), "stop")
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
		get: ->
			@_states ?= new LayerStates(@)
			return @_states
		set: (states) ->
			@states.machine.reset()
			_.extend(@states, states)

	@define "stateNames",
		enumerable: false
		exportable: false
		importable: false
		get: -> @states.machine.stateNames

	#############################################################################
	## Draggable, Pinchable

	@define "draggable",
		importable: false
		exportable: false
		get: -> @_draggable ?= new LayerDraggable(@)
		set: (value) -> @draggable.enabled = value if _.isBoolean(value)

	@define "pinchable",
		importable: false
		exportable: false
		get: -> @_pinchable ?= new LayerPinchable(@)
		set: (value) -> @pinchable.enabled = value if _.isBoolean(value)

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
		# you expect when you add a button to a scroll content layer. We only
		# want to do this if this layer is not draggable itself because that
		# would break nested ScrollComponents.

		if @_cancelClickEventInDragSession and not @_draggable

			if eventName in [
				Events.Click, Events.Tap, Events.TapStart, Events.TapEnd,
				Events.LongPress, Events.LongPressStart, Events.LongPressEnd]

					parentDraggableLayer = @_parentDraggableLayer()

					if parentDraggableLayer

						# If we had a reasonable scrolling offset we cancel the click
						offset = parentDraggableLayer.draggable.offset
						return if Math.abs(offset.x) > @_cancelClickEventInDragSessionOffset
						return if Math.abs(offset.y) > @_cancelClickEventInDragSessionOffset

						# If there is still some velocity (scroll is moving) we cancel the click
						velocity = parentDraggableLayer.draggable.velocity
						return if Math.abs(velocity.x) > @_cancelClickEventInDragSessionVelocity
						return if Math.abs(velocity.y) > @_cancelClickEventInDragSessionVelocity

		# Always scope the event this to the layer and pass the layer as
		# last argument for every event.
		super(eventName, args..., @)

	once: (eventName, listener) =>
		super(eventName, listener)
		@_addListener(eventName, listener)

	addListener: (eventName, listener) =>
		throw Error("Layer.on needs a valid event name") unless eventName
		throw Error("Layer.on needs an event listener") unless listener
		super(eventName, listener)
		@_addListener(eventName, listener)

	removeListener: (eventName, listener) ->
		throw Error("Layer.off needs a valid event name") unless eventName
		super(eventName, listener)
		@_removeListener(eventName, listener)

	_addListener: (eventName, listener) ->

		# Make sure we stop ignoring events once we add a user event listener
		if not _.startsWith(eventName, "change:")
			@ignoreEvents = false

		# If this is a dom event, we want the actual dom node to let us know
		# when it gets triggered, so we can emit the event through the system.
		if Utils.domValidEvent(@_element, eventName) or eventName in _.values(Gestures)
			if not @_domEventManager.listeners(eventName).length
				@_domEventManager.addEventListener eventName, (event) =>
					@emit(eventName, event)

	_removeListener: (eventName, listener) ->

		# Do cleanup for dom events if this is the last one of it's type.
		# We are assuming we're the only ones adding dom events to the manager.
		if not @listeners(eventName).length
			@_domEventManager.removeAllListeners(eventName)

	_parentDraggableLayer: ->
		for layer in @ancestors()
			return layer if layer._draggable?.enabled
		return null

	on: @::addListener
	off: @::removeListener

	##############################################################
	## EVENT HELPERS

	onClick: (cb) -> @on(Events.Click, cb)
	onDoubleClick: (cb) -> @on(Events.DoubleClick, cb)
	onScrollStart: (cb) -> @on(Events.ScrollStart, cb)
	onScroll: (cb) -> @on(Events.Scroll, cb)
	onScrollEnd: (cb) -> @on(Events.ScrollEnd, cb)
	onScrollAnimationDidStart: (cb) -> @on(Events.ScrollAnimationDidStart, cb)
	onScrollAnimationDidEnd: (cb) -> @on(Events.ScrollAnimationDidEnd, cb)

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
	onAnimationDidStart: (cb) -> @on(Events.AnimationDidStart, cb) # Deprecated
	onAnimationDidStop: (cb) -> @on(Events.AnimationDidStop, cb) # Deprecated
	onAnimationDidEnd: (cb) -> @on(Events.AnimationDidEnd, cb) # Deprecated

	onImageLoaded: (cb) -> @on(Events.ImageLoaded, cb)
	onImageLoadError: (cb) -> @on(Events.ImageLoadError, cb)
	onImageLoadCancelled: (cb) -> @on(Events.ImageLoadCancelled, cb)

	onMove: (cb) -> @on(Events.Move, cb)
	onDragStart: (cb) -> @on(Events.DragStart, cb)
	onDragWillMove: (cb) -> @on(Events.DragWillMove, cb)
	onDragMove: (cb) -> @on(Events.DragMove, cb)
	onDragDidMove: (cb) -> @on(Events.DragDidMove, cb)
	onDrag: (cb) -> @on(Events.Drag, cb)
	onDragEnd: (cb) -> @on(Events.DragEnd, cb)
	onDragAnimationStart: (cb) -> @on(Events.DragAnimationStart, cb)
	onDragAnimationEnd: (cb) -> @on(Events.DragAnimationEnd, cb)
	onDirectionLockStart: (cb) -> @on(Events.DirectionLockStart, cb)

	onStateSwitchStart: (cb) -> @on(Events.StateSwitchStart, cb)
	onStateSwitchStop: (cb) -> @on(Events.StateSwitchStop, cb)
	onStateSwitchEnd: (cb) -> @on(Events.StateSwitchEnd, cb)

	onStateWillSwitch: (cb) -> @on(Events.StateSwitchStart, cb) # Deprecated
	onStateDidSwitch: (cb) -> @on(Events.StateSwitchEnd, cb) # Deprecated

	# Gestures

	# Tap
	onTap: (cb) -> @on(Events.Tap, cb)
	onTapStart: (cb) -> @on(Events.TapStart, cb)
	onTapEnd: (cb) -> @on(Events.TapEnd, cb)
	onDoubleTap: (cb) -> @on(Events.DoubleTap, cb)

	# Force Tap
	onForceTap: (cb) -> @on(Events.ForceTap, cb)
	onForceTapChange: (cb) -> @on(Events.ForceTapChange, cb)
	onForceTapStart: (cb) -> @on(Events.ForceTapStart, cb)
	onForceTapEnd: (cb) -> @on(Events.ForceTapEnd, cb)

	# Press
	onLongPress: (cb) -> @on(Events.LongPress, cb)
	onLongPressStart: (cb) -> @on(Events.LongPressStart, cb)
	onLongPressEnd: (cb) -> @on(Events.LongPressEnd, cb)

	# Swipe
	onSwipe: (cb) -> @on(Events.Swipe, cb)
	onSwipeStart: (cb) -> @on(Events.SwipeStart, cb)
	onSwipeEnd: (cb) -> @on(Events.SwipeEnd, cb)

	onSwipeUp: (cb) -> @on(Events.SwipeUp, cb)
	onSwipeUpStart: (cb) -> @on(Events.SwipeUpStart, cb)
	onSwipeUpEnd: (cb) -> @on(Events.SwipeUpEnd, cb)

	onSwipeDown: (cb) -> @on(Events.SwipeDown, cb)
	onSwipeDownStart: (cb) -> @on(Events.SwipeDownStart, cb)
	onSwipeDownEnd: (cb) -> @on(Events.SwipeDownEnd, cb)

	onSwipeLeft: (cb) -> @on(Events.SwipeLeft, cb)
	onSwipeLeftStart: (cb) -> @on(Events.SwipeLeftStart, cb)
	onSwipeLeftEnd: (cb) -> @on(Events.SwipeLeftEnd, cb)

	onSwipeRight: (cb) -> @on(Events.SwipeRight, cb)
	onSwipeRightStart: (cb) -> @on(Events.SwipeRightStart, cb)
	onSwipeRightEnd: (cb) -> @on(Events.SwipeRightEnd, cb)

	# Pan
	onPan: (cb) -> @on(Events.Pan, cb)
	onPanStart: (cb) -> @on(Events.PanStart, cb)
	onPanEnd: (cb) -> @on(Events.PanEnd, cb)
	onPanLeft: (cb) -> @on(Events.PanLeft, cb)
	onPanRight: (cb) -> @on(Events.PanRight, cb)
	onPanUp: (cb) -> @on(Events.PanUp, cb)
	onPanDown: (cb) -> @on(Events.PanDown, cb)

	# Pinch
	onPinch: (cb) -> @on(Events.Pinch, cb)
	onPinchStart: (cb) -> @on(Events.PinchStart, cb)
	onPinchEnd: (cb) -> @on(Events.PinchEnd, cb)

	# Scale
	onScale: (cb) -> @on(Events.Scale, cb)
	onScaleStart: (cb) -> @on(Events.ScaleStart, cb)
	onScaleEnd: (cb) -> @on(Events.ScaleEnd, cb)

	# Rotate
	onRotate: (cb) -> @on(Events.Rotate, cb)
	onRotateStart: (cb) -> @on(Events.RotateStart, cb)
	onRotateEnd: (cb) -> @on(Events.RotateEnd, cb)


	##############################################################
	## HINT

	_showHint: (targetLayer) ->

		# If this layer isnt visible we can just exit
		return if not @visible
		return if @opacity is 0

		# If we don't need to show a hint exit but pass to children
		unless @shouldShowHint(targetLayer)
			layer._showHint(targetLayer) for layer in @children
			return null

		# Figure out the frame we want to show the hint in, if any of the
		# parent layers clip, we need to intersect the rectangle with it.
		frame = @canvasFrame

		for parent in @ancestors(context=true)
			if parent.clip
				frame = Utils.frameIntersection(frame, parent.canvasFrame)
			if not frame
				return

		# Show the actual hint
		@showHint(frame)

		# Tell the children to show their hints
		_.invokeMap(@children, "_showHint")

	willSeemToDoSomething: ->

		if @ignoreEvents
			return false

		if @_draggable
			if @_draggable.isDragging is false and @_draggable.isMoving is false
				return false

		return true

	shouldShowHint: ->

		# Don't show hints if the layer is not interactive
		if @ignoreEvents is true
			return false

		# Don't show any hints while we are animating
		if @isAnimating
			return false

		for parent in @ancestors()
			return false if parent.isAnimating

		# Don't show hints if there is a draggable that cannot be dragged.
		if @_draggable and @_draggable.horizontal is false and @_draggable.vertical is false
			return false

		# Don't show hint if this layer is invisible
		return false if @opacity is 0

		# See if this layer is visible and not covered by another layer
		# We don't do this for now because, trying to figure this out will
		# introduce another class of edge cases, and it is easier to understand
		# the default logic than some magic logic written by me to try and figure
		# out what is covered and what not.

		# rootLayer = @root()

		# rootLayers = _.filter @context.layers, (layer) ->
		# 	return layer.parent is null and layer.index < rootLayer.index

		# for layer in rootLayers
		# 	if Utils.frameInFrame(@screenFrame, layer.totalFrame())
		# 		return false

		# If we don't ignore events on this layer, make sure the layer is listening to
		# an interactive event so there is a decent change something is happening after
		# we click it.

		for eventName in @listenerEvents()
			return true if Events.isInteractive(eventName)

		return false

	showHint: (highlightFrame) ->

		# Don't show anything if this element covers the entire screen
		# if Utils.frameInFrame(@context.canvasFrame, highlightFrame)
		#	return

		# Start an animation with a rectangle fading out over time
		layer = new Layer
			frame: Utils.frameInset(highlightFrame, -1)
			backgroundColor: null
			borderColor: Framer.Defaults.Hints.color
			borderRadius: @borderRadius * Utils.average([@canvasScaleX(), @canvasScaleY()])
			borderWidth: 3

		# Only show outlines for draggables
		if @_draggable
			layer.backgroundColor = null

		# Only show outlines if a highlight is fullscreen
		if Utils.frameInFrame(@context.canvasFrame, highlightFrame)
			layer.backgroundColor = null

		animation = layer.animate
			properties: {opacity: 0}
			curve: "ease-out"
			time: 0.5

		animation.onAnimationEnd ->
			layer.destroy()

	##############################################################
	## DESCRIPTOR

	toName: ->
		return name if @name
		return @__framerInstanceInfo?.name or ""

	toInspect: (constructor) ->
		constructor ?= @constructor.name
		name = if @name then "name:#{@name} " else ""
		return "<#{constructor} #{@toName()} id:#{@id} #{name}
			(#{Utils.roundWhole(@x)}, #{Utils.roundWhole(@y)})
			#{Utils.roundWhole(@width)}x#{Utils.roundWhole(@height)}>"
