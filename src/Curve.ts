import {AnimationCurveLinear} from "AnimationCurve/Linear"
import {AnimationCurveSpringRK4} from "AnimationCurve/SpringRK4"

export const linear = (time: number) => {
	return new AnimationCurveLinear({time: time})
}

export const springrk4 = (
	friction= 300,
	tension= 30,
	velocity= 0,
	tolerance= 1 / 100
	) => {

	// return new AnimationCurveSpringRK4()
	return new AnimationCurveSpringRK4({
		tension: friction,
		friction: tension,
		velocity: velocity,
		tolerance: tolerance
	})
}

export const Curve = {
	linear: linear,
	springrk4: springrk4
}