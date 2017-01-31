interface LinearCurveOptions {
	time: number
}

export abstract class AnimationCurve {

}

export class Linear extends AnimationCurve {

	private _time: number

    constructor(time=1) {
		super()
		this._time = time
	}

	value(time: number) {
		return time * this._time
	}
}