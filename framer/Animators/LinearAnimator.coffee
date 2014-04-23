Utils = require "../Utils"

{Animator} = require "../Animator"

class exports.LinearAnimator extends Animator
	
	setup: (options) ->

		@options = Utils.setDefaultProperties options,
			time: 1

		@_time = 0

	next: (delta) ->

		if @finished()
			return 1
		
		@_time += delta
		@_time / @options.time

	finished: ->
		@_time >= @options.time