import {AnimationCurve} from "AnimationCurve"

type AnimationCurveBezierOptions = {
	time: number
}

let AnimationCurveBezierDefaultOptions: AnimationCurveBezierOptions = {
	time: 1
}

export class AnimationCurveBezier extends AnimationCurve {

	private _options: AnimationCurveBezierOptions



	value(time: number) {
		return time / this._options.time
	}

	done(time: number) {
		// console.log(time, this._options.time, time >= this._options.time);

		return time >= this._options.time
	}

}