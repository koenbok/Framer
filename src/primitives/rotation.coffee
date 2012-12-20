class exports.Rotation

	constructor: (@layer) ->
		#@layer = @view.layer

	@define "x"
		get: -> @layer.rotation.x
		set: (value) -> @layer.rotation.x = value

	@define "y"
		get: -> @layer.rotation.y
		set: (value) -> @layer.rotation.y = value

	@define "z"
		get: -> @layer.rotation.z
		set: (value) -> @layer.rotation.z = value

	update: (values) ->
		for p in ["x", "y", "z"]
			@[p] = values[p] if values[p] not in [null, undefined]