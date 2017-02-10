export interface LinearCurveOptions {
	time: number
}

export abstract class AnimationCurve {
	abstract value(time: number): number
	abstract done(time: number): boolean
}