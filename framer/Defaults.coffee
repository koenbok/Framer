{_} = require "./Underscore"

Utils = require "./Utils"

# You can set Framer Defaults before loading Framer (sort of enviroment variables) in window.FramerDefaults

Originals = 
	Layer:
		backgroundColor: "rgba(0,124,255,.5)"
		width: 100
		height: 100
	Animation:
		curve: "linear"
		time: 1
	DeviceView:
		fullScreen: false
		padding: 50
		deviceType: "iphone-5s-spacegray"
		deviceZoom: "fit"
		contentZoom: 1
		orientation: "portrait"
		keyboard: false
		animationOptions:
			curve: "spring(400,40,0)"
	LayerDraggable:
		momentum: true
		momentumOptions:
			friction: 2.1 
			tolerance: 1/10 
		bounce: true
		bounceOptions:
			friction: 40
			tension: 200
			tolerance: 1/10000
		lockDirection: false
		lockDirectionThreshold: 
			x: 10
			y: 10
		overdrag: true
		overdragScale: 0.5
		pixelAlign: true
		velocityTimeout: 100
		velocityScale: 890
	FrictionSimulator:
		friction: 2
		tolerance: 1/10
	SpringSimulator:
		tension: 500
		friction: 10
		tolerance: 1/10000
	MomentumBounceSimulator:
		momentum:
			friction: 2
			tolerance: 1/10
		bounce:
			tension: 500
			friction: 10
			tolerance: 1/10000

exports.Defaults =

	getDefaults: (className, options) ->

		# Always start with the originals
		defaults = _.clone Originals[className]

		# Copy over the user defined options
		for k, v of Framer.Defaults[className]
			defaults[k] = if _.isFunction(v) then v() else v

		# Then copy over the default keys to the options
		for k, v of defaults
			if not options.hasOwnProperty k
				options[k] = v

		# Include a secret property with the default keys
		# options._defaultValues = defaults
		
		options

	setup: ->
		# This should only be called once when Framer loads. It looks if there
		# are already options defined and updates them with the originals.
		if window.FramerDefaults
			for className, classValues of window.FramerDefaults
				for k, v of classValues
					Originals[className][k] = v

		exports.Defaults.reset()

	reset: ->
		window.Framer.Defaults = _.clone Originals