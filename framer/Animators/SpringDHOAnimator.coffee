Utils = require "../Utils"

{Animator} = require "../Animator"

class exports.SpringDHOAnimator extends Animator

	setup: (options) ->

		@options = _.defaults options,
			velocity: 0
			tolerance: 1/10000
			stiffness: 50
			damping: 2
			mass: 0.2
			time: null # Hack

		console.log "SpringDHOAnimator.options", @options, options

		@_time = 0
		@_value = 0
		@_velocity = @options.velocity

	next: (delta) ->

		if @finished()
			return 1

		@_time += delta

		# See the not science comment above
		k = 0 - @options.stiffness
		b = 0 - @options.damping

		F_spring = k * ((@_value) - 1)
		F_damper = b * (@_velocity)

		@_velocity += ((F_spring + F_damper) / @options.mass) * delta
		@_value += @_velocity * delta

		@_value

	finished: =>
		@_time > 0 and Math.abs(@_velocity) < @options.tolerance
