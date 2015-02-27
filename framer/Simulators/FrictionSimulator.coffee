Utils = require "../Utils"

{Simulator} = require "../Simulator"
{Integrator} = require "../Integrator"

class exports.FrictionSimulator extends Simulator

	setup: (options) ->

		@options = Defaults.getDefaults "FrictionSimulator", options
		@options = Utils.setDefaultProperties options,
			velocity: 0
			position: 0

		@_state =
			x: @options.position
			v: @options.velocity

		@_integrator = new Integrator (state) =>
			return - (@options.friction * state.v)

	next: (delta) ->
		
		@_state = @_integrator.integrateState(@_state, delta)

		return @_state

	finished: =>
		
		Math.abs(@_state.v) < @options.tolerance

