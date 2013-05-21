_ = require "underscore"
{config} = require "./config"
utils = require "./utils"
css = require "./css"

{EventEmitter} = require "./eventemitter"
{Matrix} = require "./primitives/matrix"

spring = require "./curves/spring"
bezier = require "./curves/bezier"

AnimationCounter = 0
AnimationList = []

# Parses arguments from an easing function call provided
# as a string, and its corresponding prefix.
#
# "spring(1,2,3)", "spring" # => [1, 2, 3]
#
parseCurve = (a, prefix) ->

	a = a.replace(prefix, "")
		.replace(/\s+/g, "")
		.replace("(", "")
		.replace(")", "")
		.split(",")

	parseFloat(float) for float in a

# TODO: Standardize on Arrays or Objects for these lists

AnimationProperties = [
	"view", "properties", "curve", "time",
	"origin", "tolerance", "precision", "modifiers",
	"limits", "debug", "profile", "callback"
]

AnimatableCSSProperties = {
	opacity: ""
	width: "px"
	height: "px"
}

AnimatableMatrixProperties = [
	"x", "y", "z",
	"scaleX", "scaleY", "scaleZ", # "scale",
	"rotationX", "rotationY", "rotationZ", # "rotation"
]

class Animation extends EventEmitter
	
	constructor: (options) ->
		
		# console.log "Animation.constructor", options
		
		# Set all properties
		for p in AnimationProperties
			@[p] = options[p]

		AnimationCounter += 1

		_.defaults @,
			id: AnimationCounter
			time: 1000
			curve: "linear"
			origin: "50% 50%"
			count: 0

			precision: config.animationPrecision
			debug: config.animationDebug
			profile: config.animationProfile

		
	@define "view",
		get: -> 
			@_view
			
		set: (view) ->
			return if view in [null, @_view]
			@_originalProperties = view.properties
			@_view = view
		
	start: (callback) =>
		
		AnimationList.push @
		
		# Check if we have a view to animate
		if @view is null
			throw new Error "Animation does not have a view to animate"
		
		
		# Set up some variables to start with
		#
		startTime = new Date().getTime()
		
		@count++
		@animationName = "framer-animation-#{@animationId}-#{@count}"
		
		console.log "Animation[#{@animationId}].start" if @debug
		console.log "Animation[#{@animationId}].view = #{@view.name}" if @debug
		console.profile @animationName if @profile

		
		# Deal with other animations on this view
		@view.animateStop()
		@view._currentAnimations.push @
		
		
		# Calculate the curve values
		@curveValues = @_parseCurve @curve
		@totalTime = (@curveValues.length / @precision) * 1000

		
		# Build a property list that we want to animate
		# TODO: test if we are trying to animate something that cannot animate
		#
		propertiesA = @view.properties
		propertiesB = @properties
		
		# Set the derived properties scale and rotation
		if propertiesB.scale
			propertiesB.scaleX = propertiesB.scale
			propertiesB.scaleY = propertiesB.scale
		
		if propertiesB.rotation
			propertiesB.rotationZ = propertiesB.rotation
			
		@propertiesA = {}
		@propertiesB = {}
		
		# Build up the matrix animation properties
		#
		for k in AnimatableMatrixProperties
			
			@propertiesA[k] = propertiesA[k]
			
			if propertiesB.hasOwnProperty k
				@propertiesB[k] = propertiesB[k]
			else
				@propertiesB[k] = propertiesA[k]
			
		# Build up the css animation properties
		#
		for k, v of AnimatableCSSProperties
			
			if propertiesB.hasOwnProperty k
				@propertiesA[k] = propertiesA[k]
				@propertiesB[k] = propertiesB[k]
		
		
		# Check which properties actually will animate
		#
		animatedProperties = []
		
		for k of @propertiesA
			if @propertiesA[k] isnt @propertiesB[k]
				console.log " .#{k} #{@propertiesA[k]} -> #{@propertiesB[k]}" if @debug
				animatedProperties.push k
		
		# Throw a warning if we have nothing to animate
		if animatedProperties.length is 0
			console.log "Animation[#{@animationId}] Warning: nothing to animate"
			return

		# Generate the keyframe css and insert
		#
		@keyFrameAnimationCSS = @_css()
		@view.once "webkitAnimationEnd", (event) =>
			# If we don't do this, all animations on parent views will be stopped
			event.stopPropagation()
			@_finalize()
		
		# Only enable backside visibility if we are actually going to animate rotation
		backsideVisibility = "hidden"
		if "rotationX" in animatedProperties or "rotationY" in animatedProperties
			backsideVisibility = "visible"
		
		
		css.addStyle """
			#{@keyFrameAnimationCSS}
		
			.#{@animationName} {
				-webkit-animation-duration: #{@totalTime / 1000}s;
				-webkit-animation-name: #{@animationName};
				-webkit-animation-timing-function: linear;
				-webkit-animation-fill-mode: both;
				-webkit-transform-origin: #{@origin};
				-webkit-backface-visibility: #{backsideVisibility};
			}"""
		
		@view.addClass @animationName
		
		
		# Finalize
		#
		@view.once "webkitAnimationStart", (event) =>
			@emit "start", event
			if @debug
				endTime = new Date().getTime() - startTime
				console.log "Animation[#{@animationId}].setupTime = #{endTime}ms"
				console.log "Animation[#{@animationId}].totalTime = #{utils.round @totalTime, 0}ms"
		
		console.profileEnd @animationName if @profile

	# Return the inverse of this animation
	#
	reverse: =>
		
		options = {}
		
		# Copy the animation settings
		for p in AnimationProperties
			options[p] = @[p]
		
		options.properties = {}
		
		# Add the original view properties to animate to 
		for k, v of @_originalProperties
			options.properties[k] = @_originalProperties[k]
			
		return new Animation options


	
	stop: =>
		
		console.log "Animation[#{@animationId}].stop #{@animationName}" if @debug
		
		@_canceled = true
		
		# @view.style["-webkit-animation-play-state"] = "paused"

		@_cleanup false
		
		# @view.style["-webkit-animation-play-state"] = "running"
	

	_finalize: =>
		
		return if @_canceled
		
		console.log "Animation[#{@animationId}].end #{@animationName}" if @debug
		
		@_cleanup true
		
		@callback?()


	_cleanup: (completed) =>

		# Remove this animation from the current ones for this view
		@view._currentAnimations = _.without(@view._currentAnimations, @)
		
		if completed
			
			# A matrix with the defined end state
			endMatrix = utils.extend new Matrix(), @propertiesB
			endStyles = {}
			
			for k, v of AnimatableCSSProperties
				endStyles[k] = @propertiesB[k] + v

		else
			# A matrix from the current state
			endMatrix = new Matrix(@view._computedMatrix())
			endStyles = {}

			computedStyles = @view.computedStyle

			for k, v of AnimatableCSSProperties
				endStyles[k] = computedStyles[k]
		
		# Remove the animation class
		@view.removeClass @animationName
		
		# Set the end states
		@view._matrix = endMatrix
		@view.style = endStyles
		
		@callback? @
		@emit "end"
		
	_keyFrames: ->
		
		# Build keyframes based on our values
		
		stepIncrement = 0
		stepDelta = 100 / (@curveValues.length - 1)
		
		deltas = @_deltas()
		keyFrames = {}
		
		for curveValue in @curveValues
			
			position = stepIncrement * stepDelta
			position = utils.round position, config.roundingDecimals
			
			currentKeyFrame = {}
			
			for propertyName of @propertiesA
				currentKeyFrame[propertyName] = curveValue * deltas[propertyName] + @propertiesA[propertyName]
			
			keyFrames[position] = currentKeyFrame
			
			stepIncrement++
		
		keyFrames

	_css: ->
		
		# Create the css from a set of keyframes
		
		keyFrames = @_keyFrames()
		
		cssString = []
		cssString.push "@-webkit-keyframes #{@animationName} {\n"
		
		matrix = new Matrix()
		
		for position, values of keyFrames
			
			cssString.push "\t#{position}%\t{ -webkit-transform: "
			
			# Add the matrix based values
			for propertyName in AnimatableMatrixProperties
				if values.hasOwnProperty propertyName
					matrix[propertyName] = values[propertyName]
				else
					matrix[propertyName] = @view[propertyName]

			cssString.push matrix.matrix().cssValues() + "; "
			
			# Add the css based values
			for propertyName, unit of AnimatableCSSProperties
				continue if not values.hasOwnProperty propertyName
				cssString.push "#{propertyName}:#{ utils.round values[propertyName], config.roundingDecimals}#{unit}; "
				
			cssString.push "}\n"
			
		cssString.push "}\n"
		cssString.join ""

	_deltas: ->
		
		deltas = {}
		
		# Pre-calculate the delta values
		for k of @propertiesA
			deltas[k] = (@propertiesB[k] - @propertiesA[k]) / 100.0
		
		return deltas
		
	_parseCurve: (curve) ->
		
		curve ?= ""
		curve = curve.toLowerCase()
		
		# If the shift key is pressed, we would like to play the animation slowly.
		factor = config.timeSpeedFactor
		
		precision = @precision * factor
		time = @time * factor

		args = [@precision, time]
		
		# "ease-in-out" => "EaseInOut"
		animationClass = utils.titleize(utils.camelize(curve))

		# Determine the correct easing function
		switch

			when utils.startsWith(curve, "bezier-curve")
				v = parseCurve curve, "bezier-curve"
				bezier.BezierCurve v[0...3].concat(args)...

			when utils.startsWith(curve, "spring")
				v = parseCurve curve, "spring"
				spring.springCurve v[0...2].concat(args)...

			# Easing functions which accept only the default
			# arguments. ('ease', 'ease-in-out', 'easeIn', etc...)
			#
			when animationClass of bezier.defaults
				bezier.defaults[animationClass] args...

			# Fall back to linear easing
			#
			else
				console.log "Animation.parseCurve: could not parse curve '#{curve}'"
				bezier.defaults.Linear args...

exports.Animation = Animation
