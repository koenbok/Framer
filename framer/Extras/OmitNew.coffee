exports.enable = (module=window) ->

	ClassWrapper = (Klass) -> (args...) ->
		@prototype = new Klass(args...)

	module.Frame = ClassWrapper(Framer.Frame)
	module.Layer = ClassWrapper(Framer.Layer)
	module.BackgroundLayer = ClassWrapper(Framer.BackgroundLayer)
	module.VideoLayer = ClassWrapper(Framer.VideoLayer)
	module.Animation = ClassWrapper(Framer.Animation)
