{_} = require "./Underscore"

{BaseClass} = require "./BaseClass"

class AnimationGroup extends BaseClass

	constructor: (args...) ->
		super
		@_animations = _.flatten(args)
		@stopAnimations = true
		@stop()
	
	start: ->
		@_start(@_animations)

	stop: ->
		@_stop()
		@_started = []
		@_halted = []
		@_stopped = []
		@_ended = []

	_start: (animations) ->
		
		@stop()
		@_onStart()
		
		animations.map (animation) =>
			
			animation.start()
			@_started.push(animation)

			animation.onAnimationHalt =>
				@_halted.push(animation)
				return if @_halted.length > 1
				@_stop()
				@_onHalt()
			
			animation.onAnimationStop =>
				@_stopped.push(animation)
				@_onStop() if @_stopped.length is @_started.length
			
			animation.onAnimationEnd =>
				@_ended.push(animation)
				@_onEnd() if @_ended.length is @_started.length

	_stop: ->
		return unless @_started
		return unless @stopAnimations is true
		@_started.map (a) -> a.stop() if a.isAnimating
	
	_onStart: -> @emit(Events.AnimationStart)
	_onHalt: -> @emit(Events.AnimationHalt)
	_onStop: -> @emit(Events.AnimationStop)
	_onEnd: -> @emit(Events.AnimationEnd)

	onAnimationStart: (cb) -> @on(Events.AnimationStart, cb)
	onAnimationHalt: (cb) -> @on(Events.AnimationHalt, cb)
	onAnimationStop: (cb) -> @on(Events.AnimationStop, cb)
	onAnimationEnd: (cb) -> @on(Events.AnimationEnd, cb)

	onStart: (cb) -> @onAnimationStart(cb)
	onHalt: (cb) -> @onAnimationHalt(cb)
	onStop: (cb) -> @onAnimationStop(cb)
	onEnd: (cb) -> @onAnimationEnd(cb)


class AnimationStateGroup extends AnimationGroup

	constructor: (layers...) ->
		super
		@_layers = _.flatten(layers)
		@_state = "default"

	animate: (state) ->
		animations = []

		for layer in @_layers
			if layer.states[state]
				animations.push(layer.animate(state, {start: false}))

		return unless animations

		@_start(animations)
		@_state = state

	@define "state",
		get: -> @_state

	@define "states",
		get: ->
			states = []

			for layer in @_layers
				for state in _.keys(layer.states)
					states.push(state) unless state in states

			return states

	stateCycle: (args...) ->
		states = _.flatten(args)
		states = @states if not states.length
		@animate(Utils.arrayNext(states, @state))

exports.AnimationGroup = AnimationGroup
exports.AnimationStateGroup = AnimationStateGroup
