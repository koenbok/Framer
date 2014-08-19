exports.enable = (module=window) ->

	ClassWrapper = (Klass)->
		CreateWrapper = (args...) ->
			if @ is window
				return new Klass args...
			else
				@prototype = new Klass args...
		return CreateWrapper

	module.Frame = ClassWrapper(Framer.Frame)
	module.Layer = ClassWrapper(Framer.Layer)
	module.BackgroundLayer = ClassWrapper(Framer.BackgroundLayer)
	module.VideoLayer = ClassWrapper(Framer.VideoLayer)
	module.Animation = ClassWrapper(Framer.Animation)