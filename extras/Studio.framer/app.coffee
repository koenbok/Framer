class AnimationGroup

	constructor: (args...) ->
		@_animations = args
		@_started = []
		@_stopped = []
		@_ended = []
		
	start: (stateName) ->
		
		@stop()
		@_onStart()
		
		@_animations.map (animation) =>
			@_started.push(animation.start())
			
			animation.onAnimationStop =>
				@_stopped.push(animation)
				print "stop", animation
			
			animation.onAnimationEnd =>
				@_ended.push(animation)
				@_onEnd if @_ended.length is @_started.length
				print "end", @_ended.length, @_started.length
	
	stop: ->
		_.invoke(@_animations, "stop")
		@_running  = []
		@_
		
	_onStart: -> print "start"
	_onStop: ->
	_onEnd: -> print "end"


class StateGroup



layerA = new Layer
layerB = new Layer

a1 = new Animation layerA, x: 500
a2 = new Animation layerB, y: 500

ag = new AnimationGroup(a1, a2)
ag.start()