Utils = require "../Utils"

{Animator} = require "../Animator"

class exports.LinearAnimator extends Animator
	
	setup: (options) ->

		@options = _.defaults options,
			time: 1
			precision: 1/1000

		@_time = 0

	next: (delta) ->
		
		@_time += delta

		if @finished()
			return 1

		return @_time / @options.time

	finished: ->
		@_time >= @options.time - @options.precision