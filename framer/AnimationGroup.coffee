{_} = require "./Underscore"

{EventEmitter} = require "./EventEmitter"

class AnimationGroup extends EventEmitter

	constructor: (animations=[]) ->
		@setAnimations(animations)
		@_currentAnimation = null

	setAnimations: (animations) ->
		# Copy all animations so we can use the same one for repeat
		@_animations = _.map animations, (animation) -> animation.copy()

	start: ->
		@emit("start")

		_.map @_animations, (animation, index) =>

			nextAnimation = @_animations[index+1]

			if nextAnimation
				animation.on Events.AnimationEnd, =>
					nextAnimation.start()
					@_currentAnimation = animation
			else
				animation.on Events.AnimationEnd, =>
					@emit("end")
					@_currentAnimation = null

		@_animations[0].start()

	stop: ->
		@_currentAnimation?.stop()
