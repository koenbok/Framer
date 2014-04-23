{_} = require "./Underscore"

{BaseClass} = require "./BaseClass"

EmptyMatrix = new WebKitCSSMatrix()

matrixProperty = (name, fallback) ->
	exportable: true
	default: fallback
	get: -> @_getPropertyValue name
	set: (value) -> @_setPropertyValue name, value

class exports.Matrix extends BaseClass
	
	constructor: (matrix) ->
		if matrix instanceof WebKitCSSMatrix
			@from matrix

		super
	
	@define "x", matrixProperty "x", 0
	@define "y", matrixProperty "y", 0
	@define "z", matrixProperty "z", 0

	@define "scaleX", matrixProperty "scaleX", 1
	@define "scaleY", matrixProperty "scaleY", 1
	@define "scaleZ", matrixProperty "scaleZ", 1

	@define "rotationX", matrixProperty "rotationX", 0
	@define "rotationY", matrixProperty "rotationY", 0
	@define "rotationZ", matrixProperty "rotationZ", 0

	# @define "scale",
	# 	get: -> (@_scaleX + @_scaleY) / 2.0
	# 	set: (value) -> @_scaleX = @_scaleY = value
	
	# @define "rotation",
	# 	get: -> @rotationZ
	# 	set: (value) -> 
	# 		@rotationZ = value

	decompose: (m) ->
		
		result = {}
		
		result.translation =
			x: m.m41
			y: m.m42
			z: m.m43
		
		result.scale =
			x: Math.sqrt(m.m11*m.m11 + m.m12*m.m12 + m.m13*m.m13)
			y: Math.sqrt(m.m21*m.m21 + m.m22*m.m22 + m.m23*m.m23)
			z: Math.sqrt(m.m31*m.m31 + m.m32*m.m32 + m.m33*m.m33)
		
		# http://blog.bwhiting.co.uk/?p=26
		# Todo: There is still a bug here, where it sometimes rotations in reverse
		result.rotation =
			x: -Math.atan2(m.m32/result.scale.z, m.m33/result.scale.z)
			y: Math.asin(m.m31/result.scale.z)
			z: -Math.atan2(m.m21/result.scale.y, m.m11/result.scale.x)
		
		return result
		
		# Requires: https://raw.github.com/joelambert/morf/master/
		#	js/src/WebkitCSSMatrix.ext.js
		#
		# d = m.decompose()
		# 
		# result = {}
		# 
		# result =
		# 	translation: d.translate
		# 	scale: d.scale
		# 	rotation: d.rotation
		# 
		# return result
		
	from: (matrix) ->
		
		v = @decompose matrix
		
		@x = v.translation.x
		@y = v.translation.y
		
		@scaleX = v.scale.x
		@scaleY = v.scale.y
		@scaleZ = v.scale.z
		
		@rotationX = v.rotation.x / Math.PI * 180
		@rotationY = v.rotation.y / Math.PI * 180
		@rotationZ = v.rotation.z / Math.PI * 180

	css: ->
		m = EmptyMatrix
		
		if @x or @y or @x
			m = m.translate @x, @y, @z

		if @rotationX or @rotationY or @rotationZ
			m = m.rotate @rotationX, @rotationY, @rotationZ

		if @scaleX or @scaleY or @scaleZ
			m = m.scale @scaleX, @scaleY, @scaleZ
		
		return m.toString()