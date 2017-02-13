import {AnimationCurve} from "AnimationCurve"

export type AnimationCurveLinearOptions = {
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
		return time >= this._options.time
	}

}