_ = require "underscore"

WebKitCSSMatrix::cssValues = ->
	
	# r = (v) -> v.toFixed 5
	r = (v) -> v
	
	values = "
		matrix3d(
			#{r @m11}, #{r @m12}, #{r @m13}, #{r @m14},
			#{r @m21}, #{r @m22}, #{r @m23}, #{r @m24},
			#{r @m31}, #{r @m32}, #{r @m33}, #{r @m34},
			#{r @m41}, #{r @m42}, #{r @m43}, #{r @m44})"

class Matrix
	
	constructor: (matrix) ->
		if matrix instanceof WebKitCSSMatrix
			@from matrix
	
	@define "x",
		get: -> @_x or 0
		set: (value) -> @_x = value

	@define "y",
		get: -> @_y or 0
		set: (value) -> @_y = value
	
	@define "z",
		get: -> @_z or 0
		set: (value) -> @_z = value


	@define "scaleX",
		get: -> @_scaleX or 1
		set: (value) -> @_scaleX = value
	
	@define "scaleY",
		get: -> @_scaleY or 1
		set: (value) -> @_scaleY = value
	
	@define "scaleZ",
		get: -> @_scaleZ or 1
		set: (value) -> @_scaleZ = value

	@define "scale",
		get: -> (@_scaleX + @_scaleY) / 2.0
		set: (value) -> @_scaleX = @_scaleY = value


	@define "rotateX",
		get: -> @_rotateX or 0
		set: (value) -> @_rotateX = value
	
	@define "rotateY",
		get: -> @_rotateY or 0
		set: (value) -> @_rotateY = value
	
	@define "rotateZ",
		get: -> @_rotateZ or 0
		set: (value) -> @_rotateZ = value
	
	@define "rotate",
		get: -> @rotateZ
		set: (value) -> @rotateZ = value


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
		# Todo: There is still a bug here, where it sometimes rotates in reverse
		result.rotation =
			x: -Math.atan2(m.m32/result.scale.z, m.m33/result.scale.z)
			y: Math.asin(m.m31/result.scale.z)
			z: -Math.atan2(m.m21/result.scale.y, m.m11/result.scale.x)
		
		return result
	
	from: (matrix) ->
		
		v = @decompose matrix
		
		@x = v.translation.x
		@y = v.translation.y
		
		@scaleX = v.scale.x
		@scaleY = v.scale.y
		@scaleZ = v.scale.z
		
		@rotateX = v.rotation.x / Math.PI * 180
		@rotateY = v.rotation.y / Math.PI * 180
		@rotateZ = v.rotation.z / Math.PI * 180
		
	
	matrix: ->
		m = new WebKitCSSMatrix()
		m = m.translate @_x, @_y, @_z
		m = m.rotate @_rotateX, 0, 0
		m = m.rotate 0, @_rotateY, 0
		m = m.rotate 0, 0, @_rotateZ
		m = m.scale @scaleX, @scaleY, @scaleZ
		
		return m
	
	set: (view) ->
		view._matrix = @


exports.Matrix = Matrix
