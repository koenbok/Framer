utils = require "../utils"
_ = require "underscore"

{Frame} = require "../primitives/frame"
{Matrix} = require "../primitives/matrix"

{EventTypes} = require "../primitives/events"
{EventClass} = require "../primitives/events"

{EventEmitter} = require "../eventemitter"
{Animation} = require "../animation"

exports.ViewList = []

class View extends Frame
	
	constructor: (args) ->
		
		args ?= {}
		
		View.Views.push @
		@id = View.Views.length
		
		@_element = document.createElement "div"
		@_element.id = @id
		
		@addClass "uilayer"
		# @addClass "textureBacked"
		# @addClass "animated"
		
		@clip = args.clip or View.Properties.clip
		
		@properties = args
		
		if not args.superView
			@_insertElement()
		
		@_subViews = []
		@_currentAnimations = []
		
		# Override this prototype to change all behaviour
		@_postCreate()
	
	_postCreate: ->
	
	# Helpers

	@define "name"
		get: ->
			@_name or @id
			
		set: (value) ->
			@_name = value
			@_element.setAttribute "name", @_name

	@define "properties"
		get: ->
			p = {}
			for key, value of View.Properties
				p[key] = @[key] or View.Properties[key]
			return p
			
		set: (args) ->
			
			for key, value of View.Properties
				if args[key] not in [null, undefined]
					@[key] = args[key]
			
			for key, value of Frame.CalculatedProperties
				@[key] = args[key] if args[key] not in [null, undefined]
	
	#############################################################################
	## Geometry Utils

	@define "frame"
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


	#############################################################################
	## Geometry

	@define "width"
		get: ->
			parseFloat @style.width
		set: (value) ->
			@style.width = "#{value}px"
			@emit "change:width"
			@emit "change:frame"

	@define "height"
		get: ->
			parseFloat @style.height
		set: (value) ->
			@style.height = "#{value}px"
			@emit "change:height"
			@emit "change:frame"
	
	@define "x"
		get: -> @_matrix.x
		set: (value) ->
			@_matrix.x = value
			@_matrix = @_matrix

			@emit "change:x"
			@emit "change:frame"
	
	@define "y"
		get: -> @_matrix.y
		set: (value) ->
			@_matrix.y = value
			@_matrix = @_matrix

			@emit "change:y"
			@emit "change:frame"

	@define "z"
		get: -> @_matrix.z
		set: (value) ->
			@_matrix.z = value
			@_matrix = @_matrix

			@emit "change:z"
			@emit "change:frame"

	
	#############################################################################
	## Scale
	
	@define "scale"
		get: -> @_matrix.scale
		set: (value) ->
			@_matrix.scale = value
			@_matrix = @_matrix

			@emit "change:scale"

	@define "scaleX"
		get: -> @_matrix.scaleX
		set: (value) ->
			@_matrix.scaleX = value
			@_matrix = @_matrix

			@emit "change:scaleX"
			@emit "change:scale"
	
	@define "scaleY"
		get: -> @_matrix.scaleY
		set: (value) ->
			@_matrix.scaleY = value
			@_matrix = @_matrix

			@emit "change:scaleY"
			@emit "change:scale"
	
	@define "scaleZ"
		get: -> @_matrix.scaleZ
		set: (value) ->
			@_matrix.scaleZ = value
			@_matrix = @_matrix

			@emit "change:scaleZ"
			@emit "change:scale"


	#############################################################################
	## Rotate

	@define "rotate"
		get: -> @_matrix.rotate
		set: (value) ->
			@_matrix.rotate = value
			@_matrix = @_matrix

			@emit "change:rotate"

	@define "rotateX"
		get: -> @_matrix.rotateX
		set: (value) ->
			@_matrix.rotateX = value
			@_matrix = @_matrix
			
			@emit "change:rotateX"
			@emit "change:rotate"
	
	@define "rotateY"
		get: -> @_matrix.rotateY
		set: (value) ->
			@_matrix.rotateY = value
			@_matrix = @_matrix

			@emit "change:rotateX"
			@emit "change:rotate"

	@define "rotateZ"
		get: -> @_matrix.rotateZ
		set: (value) ->
			@_matrix.rotateZ = value
			@_matrix = @_matrix

			@emit "change:rotateZ"
			@emit "change:rotate"


	#############################################################################
	## Matrix
	
	@define "_matrix"
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
	
	_computedMatrix: ->
		new WebKitCSSMatrix @computedStyle.webkitTransform


	#############################################################################
	## Visual Properties
	
	@define "opacity"
		get: ->
			parseFloat @style.opacity or 1
		set: (value) ->
			@style.opacity = value
			@style["opacity"] = value
			@emit "change:opacity"
	
	@define "clip"
		get: ->
			@_clip
		set: (value) ->
			@_clip = value
			@style.overflow = "hidden" if value is true
			@style.overflow = "visible" if value is false
			@emit "change:clip"
	
	@define "visible"
		get: ->
			@_visible
		set: (value) ->
			@_visible = value
			@style.display = "block" if value is true
			@style.display = "none" if value is false
			@emit "change:visible"
	

	#############################################################################
	## Hierarchy
	
	removeFromSuperview: ->
		@superView = null
	
	@define "superView"
		get: -> @_superView or null
		set: (value) ->
			
			return if value is @_superView
			
			# Cancel previous pending insertions
			document.removeEventListener "DOMContentLoaded", @__insertElement
			
			# Remove from previous superview subviews
			if @_superView
				@_superView._element.removeChild @_element
				utils.remove @_superView._subViews, @
			
			# Either insert the element to the new superview or into dom
			if value
				value._element.appendChild @_element
				value._subViews.push @
			else
				@__insertElement()
			
			@_superView = value
			@emit "change:superView"
	
	@define "subViews"
		get: -> @_subViews
	

	#############################################################################
	## Animation
	
	animate: (args, callback) =>
		args.view = @
		animation = new Animation args
		animation.start callback
		return animation
	
	animateStop: ->
		@_currentAnimations.map (animation) ->
			animation.stop()


	#############################################################################
	## HTML Helpers

	@define "html"
		get: -> @_element.innerHTML
		set: (value) ->
			@_element.innerHTML = value
			@emit "change:html"

	@define "style"
		get: -> @_element.style
		set: (value) ->
			utils.extend @_element.style, value
			@emit "change:style"

	@define "computedStyle"
		get: -> document.defaultView.getComputedStyle @_element
		set: (value) ->
			throw Error "computedStyle is readonly"

	# Class helpers

	@define "class"
		get: ->
			@_element.className
		set: (value) ->
			@_element.className = value
			@emit "change:class"

	@define "classes"
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
		
		# If we are loaded we insert the node immediately, if not we wait
		if document.readyState is "complete" or document.readySate is "loaded"
			@__insertElement()
		else
			document.addEventListener "DOMContentLoaded", @__insertElement

	__insertElement: =>
		document.body.appendChild @_element


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
	rotateX: 0
	rotateY: 0
	rotateZ: 0
	rotate: 0
	scale: 1.0
	scaleX: 1.0
	scaleY: 1.0
	scaleZ: 1.0
	style: null
	html: null
	class: ""
	superView: null
	visible: true

View.Views = []

exports.View = View
