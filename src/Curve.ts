import {AnimationCurveLinear} from "AnimationCurve/Linear"

export const linear = (time: number) => {
	return new AnimationCurveLinear({time: time})
}

export const Curve = {
    linear: linear
}