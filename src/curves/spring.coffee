defaults =
	tension: 80
	friction: 8
	velocity: 0
	speed: 1/60.0
	tolerance: 0.01
	

springAccelerationForState = (state) ->
	return - state.tension * state.x - state.friction * state.v

springEvaluateState = (initialState) ->

	output = {}
	output.dx = initialState.v
	output.dv = springAccelerationForState initialState

	return output

springEvaluateStateWithDerivative = (initialState, dt, derivative) ->

	state = {}
	state.x = initialState.x + derivative.dx * dt
	state.v = initialState.v + derivative.dv * dt
	state.tension = initialState.tension
	state.friction = initialState.friction

	output = {}
	output.dx = state.v
	output.dv = springAccelerationForState state

	return output

springIntegrateState = (state, speed) ->

	a = springEvaluateState state
	b = springEvaluateStateWithDerivative state, speed * 0.5, a
	c = springEvaluateStateWithDerivative state, speed * 0.5, b
	d = springEvaluateStateWithDerivative state, speed, c

	dxdt = 1.0/6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx)
	dvdt = 1.0/6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv)

	state.x = state.x + dxdt * speed
	state.v = state.v + dvdt * speed

	return state

class Spring
	
	constructor: (args) ->
	
		args = args or {}
	
		@velocity = args.velocity or defaults.velocity
		@tension = args.tension or defaults.tension
		@friction = args.friction or defaults.friction
	
		@speed = args.speed or defaults.speed
		@tolerance = args.tolerance or defaults.tolerance
	
		@reset()
	
	reset: =>
		@startValue = 0
		@currentValue = @startValue
		@endValue = 100
		@moving = true

	next: =>
		
		targetValue = @currentValue

		stateBefore = {}
		stateAfter = {}
		
		# Calculate previous state
		stateBefore.x = targetValue - @endValue
		stateBefore.v = @velocity
		stateBefore.tension = @tension
		stateBefore.friction = @friction
		
		# Calculate new state
		stateAfter = springIntegrateState stateBefore, @speed
		@currentValue = @endValue + stateAfter.x
		finalVelocity = stateAfter.v
		netFloat = stateAfter.x
		net1DVelocity = stateAfter.v

		# See if we reached the end state
		netValueIsLow = Math.abs(netFloat) < @tolerance
		netVelocityIsLow = Math.abs(net1DVelocity) < @tolerance
				
		stopSpring = netValueIsLow and netVelocityIsLow

		@moving = !stopSpring

		if stopSpring
			finalVelocity = 0
			@currentValue = @endValue

		@velocity = finalVelocity
		
		return @currentValue
	
	all: -> 
		@reset()
		count = 0
		while @moving
			if count > 1000
				throw Error "Spring: too many values"
			count++
			@next()
	
	time: ->
		@all().length * @speed

SpringCurve = (tension, friction, velocity, fps) ->
	# console.log "spring.SpringCurve", tension, friction, velocity, fps
	spring = new Spring(tension:tension, friction:friction, velocity:velocity, speed:1/fps)
	spring.all()

exports.SpringCurve = SpringCurve