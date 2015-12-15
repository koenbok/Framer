
Utils = require "./Utils"

{Config} = require "./Config"

class exports.Integrator

	"""
	Usage:
		- Instantiate with a function that takes (state) -> acceleration
		- Call integrateState with state={x, v} and delta
	"""

	constructor: (@_accelerationForState) ->
		
		unless _.isFunction(@_accelerationForState)
			console.warn "Integrator: an integrator must be constructed with an acceleration function"
			@_accelerationForState = -> 0

	integrateState: (state, dt) ->

		a = @_evaluateState(state)
		b = @_evaluateStateWithDerivative(state, dt * 0.5, a)
		c = @_evaluateStateWithDerivative(state, dt * 0.5, b)
		d = @_evaluateStateWithDerivative(state, dt, c)

		dxdt = 1.0/6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx)
		dvdt = 1.0/6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv)

		state.x = state.x + dxdt * dt
		state.v = state.v + dvdt * dt

		return state

	_evaluateState: (initialState) ->

		output = {}
		output.dx = initialState.v
		output.dv = @_accelerationForState(initialState)

		return output

	_evaluateStateWithDerivative: (initialState, dt, derivative) ->

		state = {}
		state.x = initialState.x + derivative.dx * dt
		state.v = initialState.v + derivative.dv * dt

		output = {}
		output.dx = state.v
		output.dv = @_accelerationForState(state)

		return output
