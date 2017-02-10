export interface Vector {
	x: number
	v: number
}

export interface VectorDelta {
	dx: number
	dv: number
}

export class Integrator {

	_accelerationForState: Function

	constructor(accelerationForState: Function) {
		this._accelerationForState = accelerationForState;
	}

	integrateState(state, dt) {

		let a = this._evaluateState(state);
		let b = this._evaluateStateWithDerivative(state, dt * 0.5, a);
		let c = this._evaluateStateWithDerivative(state, dt * 0.5, b);
		let d = this._evaluateStateWithDerivative(state, dt, c);

		let dxdt = (1.0 / 6.0) * (a.dx + (2.0 * (b.dx + c.dx)) + d.dx);
		let dvdt = (1.0 / 6.0) * (a.dv + (2.0 * (b.dv + c.dv)) + d.dv);

		state.x = state.x + (dxdt * dt);
		state.v = state.v + (dvdt * dt);

		return state;
	}

	_evaluateState(initialState: Vector): VectorDelta {
		return {
			dx: initialState.v,
			dv: this._accelerationForState(initialState)
		};
	}

	_evaluateStateWithDerivative(initialState: Vector, dt: number, derivative: VectorDelta): VectorDelta {

		let state = {
			x: initialState.x + (derivative.dx * dt),
			v: initialState.v + (derivative.dv * dt)
		};

		return {
			dx: state.v,
			dv: this._accelerationForState(state)
		};
	}
};
