interface LinearCurveOptions {
	time: number
}

export abstract class AnimationCurve {
	abstract value(time: number): number
	abstract done(time: number): boolean
}



type AnimationCurveLinearOptions = {
	time: number
}

let AnimationCurveLinearDefaultOptions: AnimationCurveLinearOptions = {
	time: 1
}

export class AnimationCurveLinear extends AnimationCurve {
	
	private _options: AnimationCurveLinearOptions
	
	constructor(options=AnimationCurveLinearDefaultOptions) {
		super()
		this._options = options
	}

	value(time) {
		return time / this._options.time
	}

	done(time) {
		return time >= this._options.time
	}

}

export const Linear = (time: number) => {
	return new AnimationCurveLinear({time: time})
}