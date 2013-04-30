utils = require "../utils"
_ = require "underscore"

{Frame} = require "../primitives/frame"
{Matrix} = require "../primitives/matrix"

{EventEmitter} = require "../eventemitter"
{Animation} = require "../animation"

exports.ViewList = []


class View extends Frame
	
	constructor: (args) ->
		
		args ?= {}
		@_offset = {x:0, y:0}
		
		# Keep a generic list of all current views
		View.Views.push @
		@id = View.Views.length
		
		# Create the html element for this view
		@_element = document.createElement "div"
		@_element.id = @id
		
		# Add the default css
		@addClass "framer"
		
		@_subViews = []
		@_currentAnimations = []
		
		# Set the view properties
		@clip = args.clip or View.Properties.clip
		@properties = args
		@index = 0
		
		# Overridable creation hook
		@_postCreate?()
		
		
		
		if not args.superView
			@_insertElement()
	

	_postCreate: ->
	
	# Helpers
	
	@define "name",
		get: ->
			@_name or @id
			
		set: (value) ->
			@_name = value
			@_element.setAttribute "name", @_name

	@define "properties",
		get: ->
			p = {}
			for key, value of View.Properties
				p[key] = @[key]
			return p
			
		set: (args) ->
			
			for key, value of View.Properties
				if args[key] not in [null, undefined]
					@[key] = args[key]
			
			for key, value of Frame.CalculatedProperties
				@[key] = args[key] if args[key] not in [null, undefined]
	
	#############################################################################
	## Geometry Utils

	@define "frame",
		get: -> new Frame {x:@x, y:@y, width:@width, height:@height}
		set: (value) ->
			return if not value
			for p in ["x", "y", "width", "height"]
				@[p] = value[p]
	
	convertPoint: (point) ->
		# Convert a point on screen to this views coordinate system
		utils.convertPoint point, null, @
		
	screenFrame: ->
		# Get this views absolute frame on the screen
		utils.convertPoint @frame, @, null
	
	contentFrame: ->
		# Get the total size of all subviews
		
		minX = utils.min _.pluck @subViews, "minX"
		maxX = utils.max _.pluck @subViews, "maxX"
		minY = utils.min _.pluck @subViews, "minY"
		maxY = utils.max _.pluck @subViews, "maxY"
		
		frame =
			x: minX
			y: minY
			width: maxX - minX
			height: maxY - minY

	
	centerX: -> @midX = @superView.width  / 2.0 if @superView
	centerY: -> @midY = @superView.height / 2.0 if @superView
	center: -> @centerX(); @centerY()

	#############################################################################
	## Geometry

	@define "width",
		get: ->
			parseFloat @style.width
		set: (value) ->
			@animateStop()
			@style.width = "#{value}px"
			@emit "change:width"
			@emit "change:frame"

	@define "height",
		get: ->
			parseFloat @style.height
		set: (value) ->
			@animateStop()
			@style.height = "#{value}px"
			@emit "change:height"
			@emit "change:frame"
	
	@define "x",
		get: ->
			@_matrix.x - @_offset.x
		set: (value) ->
			@_setMatrixValue "x", value + @_offset.x
			@emit "change:frame"
	
	@define "y",
		get: ->
			@_matrix.y - @_offset.y
		set: (value) ->
			@_setMatrixValue "y", value + @_offset.y
			@emit "change:frame"

	@define "z",
		get: -> @_matrix.z
		set: (value) ->
			@_setMatrixValue "z", value

	#############################################################################
	## Scale
	
	@define "scale",
		get: -> @_matrix.scale
		set: (value) -> @_setMatrixValue "scale", value

	@define "scaleX",
		get: -> @_matrix.scaleX
		set: (value) -> @_setMatrixValue "scaleX", value
	
	@define "scaleY",
		get: -> @_matrix.scaleY
		set: (value) -> @_setMatrixValue "scaleY", value
	
	@define "scaleZ",
		get: -> @_matrix.scaleZ
		set: (value) -> @_setMatrixValue "scaleZ", value


	#############################################################################
	## Rotation

	@define "rotation",
		get: -> @_matrix.rotation
		set: (value) ->  @_setMatrixValue "rotation", value

	@define "rotationX",
		get: -> @_matrix.rotationX
		set: (value) -> @_setMatrixValue "rotationX", value
	
	@define "rotationY",
		get: -> @_matrix.rotationY
		set: (value) -> @_setMatrixValue "rotationY", value

	@define "rotationZ",
		get: -> @_matrix.rotationZ
		set: (value) -> @_setMatrixValue "rotationZ", value


	#############################################################################
	## Matrix
	
	@define "_matrix",
		get: ->
			if not @__matrix
				@__matrix = new Matrix new WebKitCSSMatrix @_element.style.webkitTransform
			return @__matrix
			
		set: (matrix) ->
			
			if not matrix
				@__matrix = null
				@style.webkitTransform = null
				return
			
			if matrix instanceof WebKitCSSMatrix
				matrix = new Matrix matrix
			
			if not matrix instanceof Matrix
				throw Error "View._matrix.set should be Matrix not #{typeof matrix}"

			@__matrix = matrix
			@style.webkitTransform = @__matrix.matrix().cssValues()
	
	_setMatrixValue: (property, value) ->
		
		@animateStop()
		
		@_matrix[property] = value
		@_matrix = @_matrix

		@emit "change:#{property}"
		
		# Make sure we also emit group changes like scaleX -> scale
		if property[-1..] in ["X", "Y", "Z"]
			@emit "change:#{property[..(property.length - 1)]}"
	
	_computedMatrix: ->
		new WebKitCSSMatrix @computedStyle.webkitTransform


	#############################################################################
	## Visual Properties
	
	@define "opacity",
		get: ->
			parseFloat @style.opacity or 1
		set: (value) ->
			@animateStop()
			@style.opacity = value
			@emit "change:opacity"
	
	@define "clip",
		get: ->
			@_clip
		set: (value) ->
			@_clip = value
			@style.overflow = "hidden" if value is true
			@style.overflow = "visible" if value is false
			@emit "change:clip"
	
	@define "visible",
		get: ->
			@_visible or true
		set: (value) ->
			@_visible = value
			@style.display = "block" if value is true
			@style.display = "none" if value is false
			@emit "change:visible"
	

	#############################################################################
	## Hierarchy
	
	@define "superView",
		get: -> @_superView or null
		set: (view) ->
			
			return if view is @_superView
			
			# Cancel previous pending insertions
			utils.domCompleteCancel @__insertElement
			
			# Remove from previous superview subviews
			if @_superView
				@_superView._element.removeChild @_element
				@_superView._subViews = _.without @_superView._subViews, @
				@_superView.emit "change:subViews", {added:[], removed:[@]}
			
			# Either insert the element to the new superview or into dom
			if view
				view._element.appendChild @_element
				view._subViews.push @
				view.emit "change:subViews", {added:[@], removed:[]}
			else
				@_insertElement()
			
			# Set the superview
			@_superView = view
			
			# Place this view on top of it's siblings
			@bringToFront()
			
			@emit "change:superView"
	
	@define "subViews",
		get: ->
			# Make a shallow copy of the list
			@_subViews.map (view) -> view
	
	@define "siblingViews",
		get: ->
			if @superView is null
				_.filter View.ViewList, (view) =>
					view isnt @ and view.superView
			else
				_.filter @superView.subViews, (view) =>
					view isnt @

	addSubView: (view) ->
		view.superView = @
	
	removeSubView: (view) ->
		
		if view not in @subViews
			return
		
		view.superView = null

	#############################################################################
	## Ordering

	@define "index",
		get: -> parseInt @style['z-index'] or 0
		set: (value) ->
			@style['z-index'] = value
			@emit "change:index"
	
	placeBefore: (view) ->
		@index = view.index + 1

	placeBehind: (view) ->
		@index = view.index - 1

	switchPlaces: (view) ->
		indexA = @index
		indexB = view.index
		view.index = indexA
		@index = indexB
	
	bringToFront: ->
		siblingIndexes = _.pluck @siblingViews, "index"
		@index = (utils.max(siblingIndexes) + 1) or 0
	
	sendToBack: ->
		siblingIndexes = _.pluck @siblingViews, "index"
		@index = (utils.min(siblingIndexes) - 1) or 0

	#############################################################################
	## Animation

	animate: (args, callback) ->
		# Shortcut to create and start animation on this view
		args.view = @
		animation = new Animation args
		animation.start callback
		return animation

	animateStop: ->
		# Stop all animations on this view
		@_currentAnimations.map (animation) ->
			animation.stop()

	#############################################################################
	## HTML Helpers

	@define "html",
		get: -> @_element.innerHTML
		set: (value) ->
			@_element.innerHTML = value
			@emit "change:html"

	@define "style",
		get: -> @_element.style
		set: (value) ->
			utils.extend @_element.style, value
			@emit "change:style"

	@define "computedStyle",
		get: -> document.defaultView.getComputedStyle @_element
		set: (value) ->
			throw Error "computedStyle is readonly"

	# Class helpers

	@define "class",
		get: ->
			@_element.className
		set: (value) ->
			@_element.className = value
			@emit "change:class"

	@define "classes",
		get: ->
			classes = @class.split " "
			classes = _(classes).filter (item) -> item not in ["", null]
			classes = _(classes).unique()
			classes
		set: (value) ->
			@class = value.join " "

	addClass: (className) ->
		classes = @classes
		classes.push className
		@classes = classes

	removeClass: (className) ->
		@classes = _.filter @classes, (item) -> item isnt className
	
	_insertElement: ->
		utils.domComplete @__insertElement
				
	__insertElement: =>
		document.body.appendChild @_element
	
	destroy: ->
		if @_element.parentNode
			@_element.parentNode.removeChild @_element


	#############################################################################
	## Events
	
	# Listen to dom events on the element

	addListener: (event, listener) ->
		super
		# if EventTypes[event]
		@_element.addEventListener event, listener

	removeListener: (event, listener) ->
		super
		# if EventTypes[event]
		@_element.removeEventListener event, listener

	on: @::addListener
	off: @::removeListener


View.Properties = utils.extend Frame.Properties,
	frame: null
	clip: true
	opacity: 1.0
	rotationX: 0
	rotationY: 0
	rotationZ: 0
	rotation: 0
	scale: 1.0
	scaleX: 1.0
	scaleY: 1.0
	scaleZ: 1.0
	style: null
	html: null
	class: ""
	superView: null
	visible: true
	index: 0

View.Views = []

exports.View = View
