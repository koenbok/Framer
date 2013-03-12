_ = require "underscore"
utils = require "../utils"
css = require "../css"

{EventEmitter} = require "./eventemitter"
{Matrix} = require "../primitives/matrix"

spring = require "../curves/spring"
bezier = require "../curves/bezier"

parseCurve = (a, prefix) ->

	# "spring(1, 2, 3)" -> 1, 2, 3

	a = a.replace prefix, ""
	a = a.replace /\s+/g, ""
	a = a.replace "(", ""
	a = a.replace ")", ""
	a = a.split ","

	return a.map (i) -> parseFloat i


class Animation extends EventEmitter
	
	AnimationProperties: [
		"view", "properties", "curve", "time", 
		"origin", "tolerance", "precision"
	]
	AnimatableCSSProperties: {
		opacity: "",
		width: "px",
		height: "px",
	}
	AnimatableMatrixProperties: [
		"x", "y", "z", 
		"scaleX", "scaleY", "scaleZ", # "scale",  
		"rotateX", "rotateY", "rotateZ", # "rotate"
	] # width, height, opacity

	constructor: (args) ->
		
		console.log "Animation.constructor", args
		
		# Set all properties
		for p in @AnimationProperties
			@[p] = args[p]
		
		# Set all the defaults
		@time ?= 1000
		@curve ?= "linear"
		@precision ?= 30
		@curveValues = @_parseCurve @curve
		@count = 0
		@animationId = utils.uuid()[..8]

	start: (callback) =>
		
		@count++
		@animationName = "framer-animation-#{@animationId}-#{@count}"
		
		console.log "Animation.start #{@animationName}"
		
		# TODO: test if we are trying to animate something that cannot animate
		
		propertiesA = @view.properties
		propertiesB = @properties
		
		# Set the derived properties scale and rotation
		if propertiesB.scale
			propertiesB.scaleX = propertiesB.scale
			propertiesB.scaleY = propertiesB.scale
		
		if propertiesB.rotate
			propertiesB.rotateZ = propertiesB.rotate
			
		@propertiesA = {}
		@propertiesB = {}
		
		# Build up the matrix animation properties
		
		for k in @AnimatableMatrixProperties 
			
			@propertiesA[k] = propertiesA[k]
			
			if propertiesB.hasOwnProperty k
				@propertiesB[k] = propertiesB[k]
			else
				@propertiesB[k] = propertiesA[k]
			
		# Build up the css animation properties
		
		for k, v of @AnimatableCSSProperties
			
			if propertiesB.hasOwnProperty k
				@propertiesA[k] = propertiesA[k]
				@propertiesB[k] = propertiesB[k]
		
		@keyFrameAnimationCSS = @_css()
		
		# for k of @propertiesA
		# 	console.log " .#{k} #{@propertiesA[k]} -> #{@propertiesB[k]}"
		
		# We stop all other animations on this view. Maybe we should revisit
		# this or give an option to disable it, but for now it makes sens because 1)
		# you almost always want this and 2) we don't support simultaneous animations.
		
		# TODO: This breaks stuff.
		# @view.animateStop()
		
		@view._currentAnimations.push @
		
		css.addStyle "
			#{@keyFrameAnimationCSS}
		
			.#{@animationName} {
				-webkit-animation-duration: #{@time/1000}s;
				-webkit-animation-name: #{@animationName};
				-webkit-animation-timing-function: linear;
				-webkit-animation-fill-mode: both;
			}"

		@view.addClass @animationName
			
		finalize = =>
			
			# Copy over the end state properties for this animation so we can safely
			# remove the animation.
			@view._matrix = utils.extend new Matrix(), @propertiesB
			
			# Copy over the end state css properties
			calculatedStyles = {}
			for k, v of @AnimatableCSSProperties
				calculatedStyles[k] = @propertiesB[k] + v
			@view.style = calculatedStyles
			
			callback?()
			@_cleanup()
		
		@view.once "webkitAnimationEnd", finalize

	
	stop: =>
		@view.style["-webkit-animation-play-state"] = "paused"
		
		# Copy over the calculated properties at this point in the animation so
		# we can safely remove it without the element jumping around.
		@view._matrix = @view._computedMatrix()
		
		# Copy over the end state css properties
		calculatedStyles = {}
		computedStyles = @view.computedStyles
		for k, v of @AnimatableCSSProperties
			calculatedStyles[k] = computedStyles 
		@view.style = calculatedStyles
		
		@_cleanup()
	
	reverse: =>
		
		# Return the inverse of this animation

		options = {}
		
		for p in @AnimationProperties
			options[p] = @[p]
		
		options.properties = {}

		for k, v of @properties
			options.properties[k] = @view[k]
			
		return new Animation options
	
	_cleanup: =>
		
		# Remove this animation from the current ones for this view
		@view._currentAnimations = _.without @view._currentAnimations, [@]
		@view.removeClass @animationName
		@emit "end"
		
	_css: ->
		
		# Build the css for the keyframe animation. I wish there was a nicer
		# way to do this, but this will work for now.
		
		stepIncrement = 0
		stepDelta = 100 / (@curveValues.length - 1)
		
		cssString = []
		cssString.push "@-webkit-keyframes #{@animationName} {\n"
		
		deltas = {}
		
		for propertyName, value of @propertiesA
			deltas[propertyName] = (@propertiesB[propertyName] - @propertiesA[propertyName]) / 100.0
		
		@curveValues.map (springValue) =>
			
			position = stepIncrement * stepDelta

			cssString.push "\t#{position.toFixed(2)}%\t{ -webkit-transform: "
			
			# Add the matrix based values
			
			m = new Matrix()
			
			for propertyName in @AnimatableMatrixProperties
				value = springValue * deltas[propertyName] + @propertiesA[propertyName]
				m[propertyName] = value
			
			cssString.push m.matrix().cssValues() + "; "
			
			for propertyName, unit of @AnimatableCSSProperties
				value = springValue * deltas[propertyName] + @propertiesA[propertyName]
				cssString.push "#{propertyName}:#{value.toFixed 5}#{unit}; "
				
			cssString.push "}\n"
			
			stepIncrement++
			
		cssString.push "}\n"
		
		return cssString.join ""

	_parseCurve: (curve) ->
		
		curve ?= ""
		curve = curve.toLowerCase()
		
		if curve in ["linear"]
			return bezier.defaults.Linear @precision, @time
		else if curve in ["ease"]
			return bezier.defaults.Ease @precision, @time
		else if curve in ["ease-in"]
			return bezier.defaults.EaseIn @precision, @time
		else if curve in ["ease-out"]
			return bezier.defaults.EaseOut @precision, @time
		else if curve in ["ease-in-out"]
			return bezier.defaults.EaseInOut @precision, @time
		else if curve[.."cubic-bezier".length-1] is "cubic-bezier"
			v = parseCurve curve, "cubic-bezier"
			return bezier.BezierCurve v[0], v[1], v[2], v[3], @precision, @time
		else if curve[.."spring".length-1] is "spring"
			v = parseCurve curve, "spring"
			return spring.SpringCurve v[0], v[1], v[2], @precision
		else

			# The default curve is linear
			console.log "Animation.parseCurve: could not parse curve '#{curve}'"
			return bezier.defaults.Linear @precision, @time


exports.Animation = Animation