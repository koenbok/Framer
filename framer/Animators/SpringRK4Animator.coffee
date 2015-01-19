Utils = require "../Utils"

{Animator} = require "../Animator"
{Integrator} = require "../Integrator"

class exports.SpringRK4Animator extends Animator

	setup: (options) ->

		@options = Utils.setDefaultProperties options,
			tension: 500
			friction: 10
			velocity: 0
			tolerance: 1/10000
			time: null # Hack

		@_time = 0
		@_value = 0
		@_velocity = @options.velocity
		@_stopSpring = false

		@_integrator = new Integrator (state) =>
			return - @options.tension * state.x - @options.friction * state.v

	next: (delta) ->

		if @finished()
			return 1

		@_time += delta

		stateBefore = {}
		stateAfter = {}
		
		# Calculate previous state
		stateBefore.x = @_value - 1
		stateBefore.v = @_velocity
		
		# Calculate new state
		stateAfter = @_integrator.integrateState stateBefore, delta
		@_value = 1 + stateAfter.x
		finalVelocity = stateAfter.v
		netFloat = stateAfter.x
		net1DVelocity = stateAfter.v

		# See if we reached the end state
		netValueIsLow = Math.abs(netFloat) < @options.tolerance
		netVelocityIsLow = Math.abs(net1DVelocity) < @options.tolerance
				
		@_stopSpring = netValueIsLow and netVelocityIsLow
		@_velocity = finalVelocity

		@_value

	finished: =>
		@_stopSpring
