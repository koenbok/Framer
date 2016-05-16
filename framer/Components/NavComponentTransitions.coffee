Utils = require "../Utils"

{Layer} = require "../Layer"
{LayerStates} = require "../LayerStates"


class NavComponentTransition

	constructor: (@navComponent, @layerA, @layerB) ->

		if @layerA
			@statesA = new LayerStates(@layerA)
			@statesA.add
				a: {opacity: 0, x: 0 - parseInt(@navComponent.width / 2)}
				b: {opacity: 1, x: 0}

		if @layerB
			@statesB = new LayerStates(@layerB)
			@statesB.add
				a: {x: 0}
				b: {x: @navComponent.width}

		@animationOptions =
			curve: "spring(300,35,0)"

	forward: (animate=true) ->
		options = _.extend(@animationOptions, {animate:animate})
		@statesA?.switch("a", options)
		@statesB?.switchInstant("b")
		@statesB?.switch("a", options)
		@statesB?.once Events.StateDidSwitch, =>
			@layerA?.visible = false

	back: (animate=true) ->
		options = _.extend(@animationOptions, {animate:animate})
		@layerA?.visible = true
		@statesA?.switch("b", options)
		@statesB?.switch("b", options)


class NavComponentBackgroundTransition

	forward: (animate=true) ->

		@background?.placeBehind(@layerB)

		@statesB?.animationOptions.animate = animate
		@statesB?.switchInstant("a")
		@statesB?.switch("b")

		@statesBackground?.animationOptions.animate = animate
		@statesBackground?.switchInstant("a")
		@statesBackground?.switch("b")

	back: (animate=true) ->

		@statesB?.animationOptions.animate = animate
		@statesB?.switch("a")

		@statesBackground?.animationOptions.animate = animate
		@statesBackground?.switch("a")
		@statesBackground?.once Events.StateDidSwitch, =>
			@background?.visible = false

class NavComponentDialogTransition extends NavComponentBackgroundTransition

	constructor: (@navComponent, @layerA, @layerB) ->
		
		if @layerB
			@statesB = new LayerStates(@layerB)
			@statesB.add
				a: 
					point: Align.center
					scale: 0.8
					opacity: 0
				b:
					scale: 1
					opacity: 1
			@statesB.animationOptions =
				curve: "spring(800,28,0)"

		if @navComponent.background
			@background = @navComponent.background
			@statesBackground = new LayerStates(@background)
			@statesBackground.add
				a:
					frame: @navComponent.frame
					opacity: 0
					visible: true
				b:
					opacity: 0.5
			@statesBackground.animationOptions =
				curve: "ease-out"
				time: 0.2

class NavComponentModalTransition extends NavComponentBackgroundTransition

	constructor: (@navComponent, @layerA, @layerB) ->
		
		if @layerB
			@statesB = new LayerStates(@layerB)
			@statesB.add
				a: 
					x: Align.center
					y: @navComponent.height
				b:
					y: Align.bottom
			@statesB.animationOptions =
				curve: "spring(300,35,0)"

		if @navComponent.background
			@background = @navComponent.background
			@statesBackground = new LayerStates(@background)
			@statesBackground.add
				a:
					frame: @navComponent.frame
					opacity: 0
					visible: true
				b:
					opacity: 0.5
			@statesBackground.animationOptions =
				curve: "ease-out"
				time: 0.2

_.extend exports,
	default: NavComponentTransition
	dialog: NavComponentDialogTransition
	modal: NavComponentModalTransition