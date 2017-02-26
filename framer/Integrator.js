export let Integrator = class Integrator {
	static initClass() {
	
		`\
Usage:
	- Instantiate with a function that takes (state) -> acceleration
	- Call integrateState with state={x, v} and delta\
`;
	}

	constructor(_accelerationForState) {

		this._accelerationForState = _accelerationForState;
		if (!_.isFunction(this._accelerationForState)) {
			console.warn("Integrator: an integrator must be constructed with an acceleration function");
			this._accelerationForState = () => 0;
		}
	}

	integrateState(state, dt) {

		let a = this._evaluateState(state);
		let b = this._evaluateStateWithDerivative(state, dt * 0.5, a);
		let c = this._evaluateStateWithDerivative(state, dt * 0.5, b);
		let d = this._evaluateStateWithDerivative(state, dt, c);

		let dxdt = (1.0/6.0) * (a.dx + (2.0 * (b.dx + c.dx)) + d.dx);
		let dvdt = (1.0/6.0) * (a.dv + (2.0 * (b.dv + c.dv)) + d.dv);

		state.x = state.x + (dxdt * dt);
		state.v = state.v + (dvdt * dt);

		return state;
	}

	_evaluateState(initialState) {

		let output = {};
		output.dx = initialState.v;
		output.dv = this._accelerationForState(initialState);

		return output;
	}

	_evaluateStateWithDerivative(initialState, dt, derivative) {

		let state = {};
		state.x = initialState.x + (derivative.dx * dt);
		state.v = initialState.v + (derivative.dv * dt);

		let output = {};
		output.dx = state.v;
		output.dv = this._accelerationForState(state);

		return output;
	}
};
undefined.initClass();
