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
		@_animations = []
		
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
	
	# Geometry
	
	@define "frame"
		get: -> new Frame {x:@x, y:@y, width:@width, height:@height}
		set: (value) ->
			return if not value
			for p in ["x", "y", "width", "height"]
				@[p] = value[p]
	
	@define "x"
		get: ->
			new Matrix(@_matrix).x
		set: (value) -> 
			m = new Matrix(@_matrix)
			m.x = value
			m.set @

			@emit "change:x"
			@emit "change:frame"
	
	@define "y"
		get: ->
			new Matrix(@_matrix).y
		set: (value) -> 
			m = new Matrix(@_matrix)
			m.y = value
			m.set @

			@emit "change:y"
			@emit "change:frame"

	
	@define "z"
		get: ->
			new Matrix(@_matrix).z
		set: (value) -> 
			m = new Matrix(@_matrix)
			m.z = value
			m.set @

			@emit "change:z"
			@emit "change:frame"

	@define "scaleX"
		get: ->
			new Matrix(@_matrix).scaleX
		set: (value) ->
			m = new Matrix(@_matrix)
			m.scaleX = value
			m.set @

			@emit "change:scaleX"
			@emit "change:scale"
	
	@define "scaleY"
		get: ->
			new Matrix(@_matrix).scaleY
		set: (value) ->
			m = new Matrix(@_matrix)
			m.scaleY = value
			m.set @

			@emit "change:scaleY"
			@emit "change:scale"
	
	@define "scaleZ"
		get: ->
			new Matrix(@_matrix).scaleZ
		set: (value) ->
			m = new Matrix(@_matrix)
			m.scaleZ = value
			m.set @

			@emit "change:scaleZ"
			@emit "change:scale"

	@define "scale"
		get: ->
			new Matrix(@_matrix).scale
		set: (value) ->
			m = new Matrix(@_matrix)
			m.scale = value
			m.set @

			@emit "change:scale"

	@define "rotateX"
		get: ->
			new Matrix(@_matrix).rotateX
		set: (value) -> 
			m = new Matrix(@_matrix)
			m.rotateX = value
			m.set @
			
			@emit "change:rotateX"
			@emit "change:rotate"
	
	@define "rotateY"
		get: ->
			new Matrix(@_matrix).rotateY
		set: (value) -> 
			m = new Matrix(@_matrix)
			m.rotateY = value
			m.set @

			@emit "change:rotateX"
			@emit "change:rotate"

	@define "rotateZ"
		get: ->
			new Matrix(@_matrix).rotateZ
		set: (value) -> 
			m = new Matrix(@_matrix)
			m.rotateZ = value
			m.set @

			@emit "change:rotateZ"
			@emit "change:rotate"

	@define "rotate"
		get: ->
			new Matrix(@_matrix).rotate
		set: (value) -> 
			m = new Matrix(@_matrix)
			m.rotate = value
			m.set @

			@emit "change:rotate"



	@define "width"
		get: -> 
			@style.width
		set: (value) -> 
			@style.width = "#{value}px"
			@emit "change:width"
			@emit "change:frame"	

	@define "height"
		get: -> 
			@style.height
		set: (value) -> 
			@style.height = "#{value}px"
			@emit "change:height"
			@emit "change:frame"



	@define "_matrix"
		get: -> 
			if not @__matrix
				@__matrix = new WebKitCSSMatrix @_element.style.webkitTransform
			return @__matrix
			
			# return new WebKitCSSMatrix @_element.style.webkitTransform
			# return new WebKitCSSMatrix window.getComputedStyle(@._element).webkitTransform
			
		set: (m) ->
			
			m ?= @__matrix
			
			if not m instanceof Matrix
				@__matrix = null
				@element_.style.webkitTransform = null
				return
			else
				@__matrix = m
			
			@_element.style.webkitTransform = @__matrix.cssValues() 
			

	convertPoint: (point) ->
		# Convert a point on screen to this views coordinate system
		utils.convertPoint point, null, @
		
	screenFrame: ->
		# Get this views absolute frame on the screen
		utils.convertPoint @frame, @, null

	# Scale, Opacity
	
	@define "opacity"
		get: ->
			@_opacity or 1
			# @_getPropertyCSSValue("opacity")
			# 	.getFloatValue CSSPrimitiveValue.CSS_NUMBER
		set: (value) -> 
			@_opacity = value
			@style["opacity"] = value
			@emit "change:opacity"
	
	# @define "scale"
	# 	get: -> 
	# 		@_scale
	# 		# @_matrix.m11
	# 	set: (value) ->  
	# 		@_scale = value
	# 		@_matrix = utils.extend @_matrix, 
	# 			{m11:value, m22:value, m33:value}
	# 		@emit "change:scale"





	
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
	

	# Hierarchy
	
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
	

	# Animation

	@define "_animated"
		get: -> @__animated or false
		set: (value) ->
			
			return if value not in [true, false]

			# @addClass "animated" if value is true
			# @removeClass "animated" if value is false
			
			@__animated = value

			# Small hack to go to next event tick and make sure
			# that the css gets added so animations start working
			# after this call
			# @_animationDuration

	@define "_animationDuration"
		get: -> 
			@__animationDuration
			# @_getPropertyCSSValue "-webkit-transition-duration", CSSPrimitiveValue.CSS_MS
		set: (value) -> 
			@__animationDuration = value
			@style["-webkit-transition-duration"] = "#{value}ms"

	@define "_animationTimingFunction"
		get: -> @computedStyle["-webkit-transition-timing-function"]
		set: (value) -> @style["-webkit-transition-timing-function"] = value

	@define "_animationTransformOrigin"
		get: -> @computedStyle["-webkit-transform-origin"]
		set: (value) -> @style["-webkit-transform-origin"] = value
	
	animate: (args, callback) =>
		args.view = @
		animation = new Animation args
		animation.start callback
		return animation
	
	animateStop: ->
		@_animations.map (animation) ->
			animation.stop()



	# Html helpers

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

	_getPropertyCSSValue: (name) ->
		
		cs = @_element.style
		# cs = @computedStyle
		
		value = cs.getPropertyCSSValue name
		
		# console.log cs["width"]
		# console.log "_getPropertyCSSValue", name, value
		
		if value instanceof CSSValueList
			return value[value.length - 1]

		return value

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


	# Dom element events

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

	#### TODO
	
	
	
	# FRAME

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
