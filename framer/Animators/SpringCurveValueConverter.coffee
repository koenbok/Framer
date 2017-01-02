epsilon =  0.001
minDuration = 0.01
maxDuration = 10.0
minDamping = Number.MIN_VALUE
maxDamping = 1

# Newton's method
approximateRoot = (func, derivative, initialGuess, times=12) ->
	result = initialGuess
	for i in [1...times]
		result = result - func(result) / derivative(result)
	return result

angularFrequency = (undampedFrequency, dampingRatio) ->
	undampedFrequency * Math.sqrt(1 - Math.pow(dampingRatio, 2))

computeDampingRatio = (tension, friction, mass = 1) ->
	friction / (2 * Math.sqrt(mass * tension))

# Tries to compute the duration of a spring,
# but can't for certain velocities and if dampingRatio >= 1
# In those cases it will return null
computeDuration = (tension, friction, velocity = 0) ->
	dampingRatio = computeDampingRatio(tension, friction)
	undampedFrequency = Math.sqrt(tension / mass)
	# This is basically duration extracted out of the envelope functions
	if dampingRatio < 1
		a = Math.sqrt(1 - Math.pow(dampingRatio, 2))
		b = velocity / (a * undampedFrequency)
		c = dampingRatio / a
		d = - ((b - c) / epsilon)
		if d <= 0
			return null
		duration = Math.log(d) / (dampingRatio * undampedFrequency)
	else
		return null
	return duration

computeDerivedCurveOptions = (dampingRatio, duration, velocity = 0, mass = 1) ->
	dampingRatio = Math.max(Math.min(dampingRatio, maxDamping), minDamping)
	duration = Math.max(Math.min(duration, maxDuration), minDuration)

	if dampingRatio < 1
		envelope = (undampedFrequency) ->
			exponentialDecay = undampedFrequency * dampingRatio
			currentDisplacement = exponentialDecay * duration
			a = (exponentialDecay) - velocity
			b = angularFrequency(undampedFrequency, dampingRatio)
			c = Math.exp(-currentDisplacement)
			return epsilon - (a / b) * c

		derivative = (undampedFrequency) ->
			exponentialDecay = undampedFrequency * dampingRatio
			currentDisplacement = exponentialDecay * duration
			d = currentDisplacement * velocity + velocity
			e = Math.pow(dampingRatio, 2) * Math.pow(undampedFrequency, 2) * duration
			f = Math.exp(-currentDisplacement)
			g = angularFrequency(Math.pow(undampedFrequency, 2), dampingRatio)
			factor = if (- envelope(undampedFrequency) + epsilon) > 0 then -1 else 1
			return factor * ((d - e) * f) / g
	else
		envelope = (undampedFrequency) ->
			a = Math.exp(-undampedFrequency * duration)
			b = (undampedFrequency - velocity) * duration + 1
			return -epsilon + a * b

		derivative = (undampedFrequency) ->
			a = Math.exp(-undampedFrequency * duration)
			b = (velocity - undampedFrequency) * Math.pow(duration, 2)
			return a * b

	result =
		tension: 100
		friction: 10
		velocity: velocity

	initialGuess = 5 / duration
	undampedFrequency = approximateRoot(envelope, derivative, initialGuess)
	unless isNaN(undampedFrequency)
		result.tension = Math.pow(undampedFrequency, 2) * mass
		result.friction = dampingRatio * 2 * Math.sqrt(mass * result.tension)
	return result

exports.computeDerivedCurveOptions = computeDerivedCurveOptions
exports.computeDuration = computeDuration
