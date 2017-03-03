import {Integrator, Vector, VectorDelta} from "Integrator"
import {AnimationCurve} from "AnimationCurve"

export type AnimationCurveSpringRK4Options = {
	tension?: number
	friction?: number
	velocity?: number
	tolerance?: number
}

let AnimationCurveSpringRK4DefaultOptions = {
	tension: 250,
	friction: 20,
	velocity: 0,
	tolerance: 1 / 100
}

let SpringRKAnimationCurveTimeStep = 1 / 60

export class AnimationCurveSpringRK4 extends AnimationCurve {

	private _options = AnimationCurveSpringRK4DefaultOptions
	private _time = 0;
	private _value = 0;
	private _velocity: number
	private _stopSpring = false
	private _integrator: Integrator
	private _values: number[]

	constructor(options: AnimationCurveSpringRK4Options= {}) {
		super()

		Object.assign(this._options, options)
		this._velocity = this._options.velocity


		this._integrator = new Integrator((state: Vector) => {
			return (- this._options.tension * state.x) - (this._options.friction * state.v);
		})

		// FIXME: This is not great.

		let count = 0
		let values: number[] = []

		while (!this.finished() && count < 5000) {
			values.push(this.next(SpringRKAnimationCurveTimeStep))
			count++
		}

		this._values = values


	}

	value(time: number) {
		return this._values[Math.round(time / SpringRKAnimationCurveTimeStep)]
	}

	done(time: number) {
		return time > this._values.length * SpringRKAnimationCurveTimeStep
	}

	next(delta: number) {

		if (this.finished()) {
			return 1;
		}

		this._time += delta;

		let stateBefore: Vector = {
			x: this._value - 1,
			v: this._velocity
		};
		let stateAfter: Vector = this._integrator.integrateState(stateBefore, delta);
		this._value = 1 + stateAfter.x;
		let finalVelocity = stateAfter.v;
		let netFloat = stateAfter.x;
		let net1DVelocity = stateAfter.v;

		// See if we reached the end state
		let netValueIsLow = Math.abs(netFloat) < this._options.tolerance;
		let netVelocityIsLow = Math.abs(net1DVelocity) < this._options.tolerance;

		this._stopSpring = netValueIsLow && netVelocityIsLow;
		this._velocity = finalVelocity;

		return this._value;
	}

	finished() {
		return this._stopSpring;
	}
}