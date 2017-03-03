const epsilon = 0.001;
const minDuration = 0.01;
const maxDuration = 10.0;
const minDamping = Number.MIN_VALUE;
const maxDamping = 1;

// Newton's method
const approximateRoot = (
	func: Function,
	derivative: Function,
	initialGuess: number,
	times = 12
) => {
	let result = initialGuess;
	for (
		let i = 1, end = times, asc = 1 <= end;
		asc ? i < end : i > end;
		asc ? i++ : i--
	) {
		result = result - func(result) / derivative(result);
	}
	return result;
};

const angularFrequency = (undampedFrequency: number, dampingRatio: number) => {
	return undampedFrequency * Math.sqrt(1 - Math.pow(dampingRatio, 2));
};

const computeDampingRatio = (
	tension: number,
	friction: number,
	mass: number
) => {
	if (mass == null) {
		mass = 1;
	}
	return friction / (2 * Math.sqrt(mass * tension));
};

// Tries to compute the duration of a spring,
// but can't for certain velocities and if dampingRatio >= 1
// In those cases it will return null
export const computeDuration = (
	tension: number,
	friction: number,
	velocity: number
) => {
	let duration;
	if (velocity == null) {
		velocity = 0;
	}
	// TODO: Mass?
	let dampingRatio = computeDampingRatio(tension, friction, 1);
	let undampedFrequency = Math.sqrt(tension / 1 /*mass*/);
	// This is basically duration extracted out of the envelope functions
	if (dampingRatio < 1) {
		let a = Math.sqrt(1 - Math.pow(dampingRatio, 2));
		let b = velocity / (a * undampedFrequency);
		let c = dampingRatio / a;
		let d = -((b - c) / epsilon);
		if (d <= 0) {
			return null;
		}
		duration = Math.log(d) / (dampingRatio * undampedFrequency);
	} else {
		return null;
	}
	return duration;
}

export const computeDerivedCurveOptions = (
	dampingRatio: number,
	duration: number,
	velocity: number,
	mass: number
) => {
	let derivative: Function, envelope: Function;
	if (velocity == null) {
		velocity = 0;
	}
	if (mass == null) {
		mass = 1;
	}
	dampingRatio = Math.max(Math.min(dampingRatio, maxDamping), minDamping);
	duration = Math.max(Math.min(duration, maxDuration), minDuration);

	if (dampingRatio < 1) {
		envelope = function(undampedFrequency: number) {
			let exponentialDecay = undampedFrequency * dampingRatio;
			let currentDisplacement = exponentialDecay * duration;
			let a = exponentialDecay - velocity;
			let b = angularFrequency(undampedFrequency, dampingRatio);
			let c = Math.exp(-currentDisplacement);
			return epsilon - a / b * c;
		};

		derivative = function(undampedFrequency: number) {
			let exponentialDecay = undampedFrequency * dampingRatio;
			let currentDisplacement = exponentialDecay * duration;
			let d = currentDisplacement * velocity + velocity;
			let e = Math.pow(dampingRatio, 2) *
				Math.pow(undampedFrequency, 2) *
				duration;
			let f = Math.exp(-currentDisplacement);
			let g = angularFrequency(
				Math.pow(undampedFrequency, 2),
				dampingRatio
			);
			let factor = -envelope(undampedFrequency) + epsilon > 0 ? -1 : 1;
			return factor * ((d - e) * f) / g;
		};
	} else {
		envelope = function(undampedFrequency: number) {
			let a = Math.exp((-undampedFrequency) * duration);
			let b = (undampedFrequency - velocity) * duration + 1;
			return -epsilon + a * b;
		};

		derivative = function(undampedFrequency: number) {
			let a = Math.exp((-undampedFrequency) * duration);
			let b = (velocity - undampedFrequency) * Math.pow(duration, 2);
			return a * b;
		};
	}

	let result = { tension: 100, friction: 10, velocity };

	let initialGuess = 5 / duration;
	let undampedFrequency = approximateRoot(envelope, derivative, initialGuess);
	if (!isNaN(undampedFrequency)) {
		result.tension = Math.pow(undampedFrequency, 2) * mass;
		result.friction = dampingRatio * 2 * Math.sqrt(mass * result.tension);
	}
	return result;
}
