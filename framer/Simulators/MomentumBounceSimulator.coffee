
Utils = require "../Utils"

{Defaults}   = require "../Defaults"
{Simulator} = require "../Simulator"

{SpringSimulator} = require "./SpringSimulator"
{FrictionSimulator} = require "./FrictionSimulator"

class exports.MomentumBounceSimulator extends Simulator

	setup: (options) ->

		@options = Defaults.getDefaults("MomentumBounceSimulator", options)
		@options = _.defaults options,
			velocity: 0
			position: 0
			min: 0
			max: 0

		@_frictionSimulator = new FrictionSimulator
			friction: @options.momentum.friction
			tolerance: @options.momentum.tolerance
			velocity: @options.velocity
			position: @options.position

		@_springSimulator = new SpringSimulator
			tension: @options.bounce.tension
			friction: @options.bounce.friction
			tolerance: @options.bounce.tolerance
			velocity: @options.velocity
			position: @options.position

		@_state =
			x: @options.position
			v: @options.velocity

		@_useSpring = false

	next: (delta) ->

		if @_useSpring
			@_state = @_springSimulator.next(delta)
		else
			@_state = @_frictionSimulator.next(delta)
			@_tryTransitionToSpring(@_state)

		return @_state

	finished: =>
		return @_springSimulator.finished() if @_useSpring
		return @_frictionSimulator.finished()

	setState: (state) ->

		@_state =
			x: state.x
			v: state.v

		@_frictionSimulator.setState(@_state)

		if @_isValidState()
			@_tryTransitionToSpring()
		else
			bound = @options.min if @_state.x <= @options.min
			bound = @options.max if @_state.x >= @options.max
			@_transitionToSpring(bound)

	# If the position is outside the min and max bounds, and traveling
	# further away, then transition from friction to spring simulation
	_tryTransitionToSpring: (force) ->

		belowMinWithVelocity = @_state.x < @options.min && @_state.v <= 0
		aboveMaxWithVelocity = @_state.x > @options.max && @_state.v >= 0

		if (belowMinWithVelocity || aboveMaxWithVelocity)
			bound = @options.min if belowMinWithVelocity
			bound = @options.max if aboveMaxWithVelocity
			@_transitionToSpring(bound)
		else
			@_useSpring = false

	_transitionToSpring: (bound) ->
		@_useSpring = true
		@_springSimulator.options.offset = bound
		@_springSimulator.setState(@_state)

	# If the position is outside the min and max bounds, but traveling
	# back towards the bounds, check if the velocity is sufficient to
	# carry the position back within bounds. If it is, let friction do the
	# work. If not, the state is invalid, so use the spring.
	_isValidState: ->

		# Note that if velocity is 0, the state is still valid (should use spring,
		# not friction), and we don't want to divide by 0 later in the check.
		belowMinTravelingBack = @_state.x < @options.min && @_state.v > 0
		aboveMaxTravelingBack = @_state.x > @options.max && @_state.v < 0

		check = false

		if (belowMinTravelingBack)
			bound = @options.min
			check = true
		else if (aboveMaxTravelingBack)
			bound = @options.max
			check = true

		if check
			friction = @_frictionSimulator.options.friction
			solution = 1 - (friction * (bound - @_state.x)) / @_state.v

			return solution > 0

		return true

	# The math behind _isValidState:
	#
	# 1. Integrate the friction simulator's acceleration to find velocity
	#
	#         a = - k * v
	#     dv/dt = - k * v
	# Int(dv/v) = - k * Int(dt)
	#      ln v = - k * t + C
	#
	# => Solve for C at t = 0
	#
	# ln v(0) = - k * 0 + C
	# ln v(0) = C
	#
	# => Plug C back into v(t)
	#
	#     ln v = - k * t + ln v(0)
	# e^(ln v) = e^(- k * t) + e^(ln v(0))
	#        v = v(0) * e^(- k * t)
	#
	# 2. Integrate velocity to find position
	#
	# Int(v) = v(0) * Int(e^(- k * t))
	#      x = - v(0) * e^(-k * t) / k + C
	#
	# => Solve for C at t = 0
	#
	#            x(0) = - v(0) * e^(-k * 0) / k + C
	#            x(0) = - v(0) / k + C
	# x(0) + v(0) / k = C
	#
	# => Plug C back into x(t)
	#
	# x = - v(0) * e^(-k * t) / k + x(0) + v(0) / k
	#
	# 3. Check if a (real) solution exists for t for position x
	#
	#                                x = - v(0) * e^(-k * t) / k + x(0) + v(0) / k
	#                         x - x(0) = - v(0) * e^(-k * t) / k + v(0) / k
	#                   k * (x - x(0)) = - v(0) * e^(-k * t) + v(0)
	#            k * (x - x(0)) - v(0) = - v(0) * e^(-k * t)
	# (k * (x - x(0)) - v(0)) / - v(0) = e^(-k * t)
	#       1 - (k * (x - x(0)) / v(0) = e^(-k * t)
	#   ln(1 - (k * (x - x(0)) / v(0)) = -k * t
	#
	# Therefore, a real solution exists if 1 - (k * (x - x(0)) / v(0) > 0
