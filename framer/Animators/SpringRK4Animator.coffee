Utils = require "../Utils"

{Animator} = require "../Animator"

class exports.SpringRK4Animator extends Animator

	setup: (options) ->

		@options = Utils.setDefaultProperties options,
			tension: 500
			friction: 25
			velocity: 0
			tolerance: 1/10000
			time: null # Hack

		@_time = 0
		@_value = 0
		@_velocity = @options.velocity
		@_stopSpring = false

	next: (delta) ->

		if @finished()
			return 1

		@_time += delta

		stateBefore = {}
		stateAfter = {}
		
		# Calculate previous state
		stateBefore.x = @_value - 1
		stateBefore.v = @_velocity
		stateBefore.tension = @options.tension
		stateBefore.friction = @options.friction
		
		# Calculate new state
		stateAfter = springIntegrateState stateBefore, delta
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


springAccelerationForState = (state) ->
	return - state.tension * state.x - state.friction * state.v

springEvaluateState = (initialState) ->

	output = {}
	output.dx = initialState.v
	output.dv = springAccelerationForState initialState

	return output

springEvaluateStateWithDerivative = (initialState, dt, derivative) ->

	state = {}
	state.x = initialState.x + derivative.dx * dt
	state.v = initialState.v + derivative.dv * dt
	state.tension = initialState.tension
	state.friction = initialState.friction

	output = {}
	output.dx = state.v
	output.dv = springAccelerationForState state

	return output

springIntegrateState = (state, speed) ->

	a = springEvaluateState state
	b = springEvaluateStateWithDerivative state, speed * 0.5, a
	c = springEvaluateStateWithDerivative state, speed * 0.5, b
	d = springEvaluateStateWithDerivative state, speed, c

	dxdt = 1.0/6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx)
	dvdt = 1.0/6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv)

	state.x = state.x + dxdt * speed
	state.v = state.v + dvdt * speed

	return state

