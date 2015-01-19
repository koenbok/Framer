{_} = require "./Underscore"

Utils = require "./Utils"

{Config} = require "./Config"
{Defaults} = require "./Defaults"
{EventEmitter} = require "./EventEmitter"
{Events} = require "./Events"

{SpringSimulator} = require "./Simulators/SpringSimulator"
{FrictionSimulator} = require "./Simulators/FrictionSimulator"
{InertialScrollSimulator} = require "./Simulators/InertialScrollSimulator"

Events.SimulationStart = 'simulationStart'
Events.SimulationStep = 'simulationStep'
Events.SimulationStop = 'simulationStop'

SimulatorClasses =
	"spring": SpringSimulator
	"friction": FrictionSimulator
	"inertial-scroll": InertialScrollSimulator

class exports.Simulation extends EventEmitter

	constructor: (options={}) ->

		# options = Defaults.getDefaults "Simulation", options

		super options

		@options = Utils.setDefaultProperties options,
			layer: null
			properties: {}
			model: "spring"
			modelOptions: {}
			delay: 0
			debug: false

		@_running = false

		SimulatorClass = SimulatorClasses[@options.model] or SpringSimulator

		@_simulator = new SimulatorClass @options.modelOptions

	# Though properties aren't modified directly by the simulation, it's still
	# necessary to return them so that conflicting animations/simulations can
	# detect one another and not run at the same time.
	animatingProperties: ->
		_.keys(@options.properties)

	start: =>

		if @options.layer is null
			console.error "Simulation: missing layer"

		if @options.debug
			console.log "Simulation.start #{@_simulator.constructor.name}", @options.modelOptions

		animatingProperties = @animatingProperties()
		for property, animation of @options.layer.animatingProperties()
			if property in animatingProperties
				animation.stop()

		if @options.delay
			Utils.delay(@options.delay, @_start)
		else
			@_start()

		return true

	stop: (emit=true)->
		return if ! @_running

		@_running = false
		
		@options.layer._context._animationList = _.without(
			@options.layer._context._animationList, @)

		@emit(Events.SimulationStop) if emit
		Framer.Loop.off("update", @_update)

	copy: -> return new Simulation(_.clone(@options))

	emit: (event) ->
		super
		# Also emit this to the layer with self as argument
		@options.layer.emit(event, @)

	_start: =>
		return if @_running

		@_running = true

		@options.layer._context._animationList.push(@)

		@emit(Events.SimulationStart)
		Framer.Loop.on("update", @_update)

	_update: (delta) =>
		if @_simulator.finished()
			@stop(emit=false)
			@emit("end")
			@emit(Events.SimulationStop)
		else
			result = @_simulator.next(delta)
			@emit(Events.SimulationStep, result, delta)

	##############################################################
	# Passthrough to simulator

	getState: ->
		return @_simulator.getState()

	setState: (state) ->
		@_simulator.setState(state)

	setOptions: (options) ->
		@_simulator.setOptions(options)

	finished: ->
		return @_simulator.finished()
