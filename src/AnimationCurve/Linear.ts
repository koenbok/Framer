import {AnimationCurve} from "AnimationCurve"

type AnimationCurveLinearOptions = {
	time: number
}

let AnimationCurveLinearDefaultOptions: AnimationCurveLinearOptions = {
	time: 1
}

export class AnimationCurveLinear extends AnimationCurve {

	private _options = AnimationCurveLinearDefaultOptions

	constructor(options= AnimationCurveLinearDefaultOptions) {
		super()
		Object.assign(this._options, options)
	}

	value(time: number) {
		return time / this._options.time
	}

	done(time: number) {
		// console.log(time, this._options.time, time >= this._options.time);

		return time >= this._options.time
	}

}