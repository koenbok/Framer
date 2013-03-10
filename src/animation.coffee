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
	
	AnimationProperties: ["view", "curve", "time", "origin", "tolerance", "precision"]
	AnimatableProperties: [
		"x", "y", "z", 
		"scaleX", "scaleY", "scaleZ", #"scale",  
		"rotateX", "rotateY", "rotateZ", #"rotate"
	] # width, height, opacity

	constructor: (args) ->
		
		# Set all properties
		for p in @AnimationProperties
			@[p] = args[p]
		
		# Set all the defaults
		
		@time ?= 1000
		@curve ?= "linear"
		@precision ?= 30
		
		@curveValues = @_parseCurve @curve
		
		@animationName = "framer-animation-#{utils.uuid()[..8]}"
		
		# Clean up the animation wishes
		
		# TODO: test if we are trying to animate something that cannot animate
		
		propertiesA = @view.properties
		propertiesB = args.properties
		
		# Set the derived properties scale and rotation
		if propertiesB.scale
			propertiesB.scaleX = propertiesB.scale
			propertiesB.scaleY = propertiesB.scale
		
		if propertiesB.rotate
			propertiesB.rotateZ = propertiesB.rotate
			
		
		@propertiesA = {}
		@propertiesB = {}
		
		for k in @AnimatableProperties 
			
			@propertiesA[k] = propertiesA[k]
			
			if propertiesB.hasOwnProperty k
				@propertiesB[k] = propertiesB[k]
			else
				@propertiesB[k] = propertiesA[k]
			
			# console.log "#{k} #{@propertiesA[k]} -> #{@propertiesB[k]}"
		
		@keyFrameAnimationCSS = @_css()
	
	start: (callback) =>
		
		# console.log "Animation.start #{@animationName}"
		
		# TODO: see if other animations are running and cancel them
		
		css.addStyle "
			#{@keyFrameAnimationCSS}
		
			.#{@animationName} {
				-webkit-animation-duration: #{@time/1000}s;
				-webkit-animation-name: #{@animationName};
				-webkit-animation-timing-function: linear;
				-webkit-animation-fill-mode: both;
			
			}"

		@view.class += " #{@animationName}"
			
		finalize = =>
			
			@view._element.removeEventListener "webkitAnimationEnd", finalize
			@view.removeClass @animationName
			
			m = new Matrix()
			
			for k, v of @propertiesB
				m[k] = @propertiesB[k]
			
			m.set @view
			
			@emit "end"
			callback?()
		
		@view._element.addEventListener "webkitAnimationEnd", finalize
		

		
	
	stop: =>
		@view.style["-webkit-animation-play-state"] = "paused"
		@view._matrix = new WebKitCSSMatrix @view.computedStyle["-webkit-transform"]
		@view.removeClass @keyFrameAnimation.name
		
	_css: ->
		
		animationName = @animationName
		
		stepIncrement = 0
		stepDelta = 100 / (@curveValues.length - 1)
		
		cssString = []
		cssString.push "@-webkit-keyframes #{animationName} {\n"
		
		deltas = {}
		
		for propertyName, value of @propertiesA
			deltas[propertyName] = (@propertiesB[propertyName] - @propertiesA[propertyName]) / 100.0
		
		@curveValues.map (springValue) =>
			
			position = stepIncrement * stepDelta

			cssString.push "\t#{position.toFixed(2)}%\t{ -webkit-transform: "
			
			m = new Matrix()
			
			for propertyName, value of @propertiesA
				m[propertyName] = springValue * deltas[propertyName] + @propertiesA[propertyName]
				
			cssString.push m.matrix().cssValues() + "; }\n"
			
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