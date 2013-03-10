

TRANSFORM_PROPERTY_MAP =
	x: {name: "translateX", unit: "px"}
	y: {name: "translateY", unit: "px"}
	z: {name: "translateZ", unit: "px"}
	rotateX: {name: "rotateX", unit: "deg"}
	rotateY: {name: "rotateY", unit: "deg"}
	rotateZ: {name: "rotateZ", unit: "deg"}
	scale: {name: "scale", unit: ""}



class KeyFrameAnimation
	
	constructor: (@propertiesA, @propertiesB, @values, @fps) ->
		
		@name = "framer-animation-#{utils.uuid()}"
		@time = @values.length / @fps
		
		console.log "Animation.time = #{@time.toFixed(2)}s"
		
	css: ->
		
		animationName = @name
		
		stepIncrement = 0
		stepDelta = 100 / @values.length
		
		css = []
		css.push "@-webkit-keyframes #{animationName} {\n"
		
		deltas = {}
		
		for propertyName, value of @propertiesA
			deltas[propertyName] = (@propertiesB[propertyName] - @propertiesA[propertyName]) / 100.0
		
		lastValues = {}
		
		calculateCurrentValue = (springValue, propertyName) =>
			(springValue * deltas[propertyName] + @propertiesA[propertyName]).toFixed()
		
		addKeyFrame = (position, springValue) =>
			
			# console.log "addKeyFrame"
			
			css.push "\t#{position.toFixed(2)}%\t{ -webkit-transform: "
			
			for propertyName, value of @propertiesA
				
				property = TRANSFORM_PROPERTY_MAP[propertyName]
				currentValue = springValue * deltas[propertyName] + @propertiesA[propertyName]
			
				css.push "#{property.name}(#{currentValue.toFixed(2)}#{property.unit}) "
			
			css.push "; }\n"
			
			stepIncrement++

		
		addKeyFrame 0, 0
		
		@values.map (springValue) ->
			addKeyFrame stepIncrement * stepDelta, springValue
		
		addKeyFrame 100, 100
			

		css.push "}\n"
		
		return css.join ""
		
exports.KeyFrameAnimation = KeyFrameAnimation



