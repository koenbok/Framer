_ = require "underscore"

{Events} = require "../primitives/events"

class exports.Draggable
	
	constructor: (@view) ->
		
		@speed = {x:1.0, y:1.0}
		
		if @view.__draggable
			console.error "Draggable: already registered draggable for #{@view.name}"
		
		@view.__draggable = @
		@_deltas = []
		@_isDragging = false
		
		@attach()
	
	attach: -> @view.on  Events.TouchStart, @_touchStart
	remove: -> @view.off Events.TouchStart, @_touchStart
	
	_updatePosition: (event) =>
		
		touchEvent = Events.sanitize event
		
		delta = 
			x: touchEvent.clientX - @_start.x
			y: touchEvent.clientY - @_start.y
			
		correctedDelta = 
			x: delta.x * @speed.x
			y: delta.y * @speed.y
			t: event.timeStamp
		
		@view.x = @_start.x + correctedDelta.x - @_offset.x
		@view.y = @_start.y + correctedDelta.y - @_offset.y
		
		@_deltas.push correctedDelta
		
		@view.emit Events.DragMove, event
	
	_touchStart: (event) => 
		
		@view.animateStop()
		
		@_isDragging = true
		
		touchEvent = Events.sanitize event
		
		@_start =
			x: touchEvent.clientX
			y: touchEvent.clientY
		
		@_offset = 
			x: touchEvent.clientX - @view.x
			y: touchEvent.clientY - @view.y
		
		document.addEventListener Events.TouchMove, @_updatePosition
		document.addEventListener Events.TouchEnd, @_touchEnd
		
		@view.emit Events.DragStart, event
		
	_touchEnd: (event) => 
		
		@_isDragging = false
		
		document.removeEventListener Events.TouchMove, @_updatePosition
		document.removeEventListener Events.TouchEnd, @_touchEnd
		
		@view.emit Events.DragEnd, event
		@_deltas = []
	
	_calculateVelocity: (time=20) =>
		
		if @_deltas.length < 2
			return {x:0, y:0}
		
		curr = @_deltas[-1..-1][0]
		prev = @_deltas[-2..-2][0]
		time = curr.t - prev.t
		
		# Bail out if the last move updates where a while ago
		timeSinceLastMove = (new Date().getTime() - prev.t)

		if timeSinceLastMove > 100
			return {x:0, y:0}
		
		velocity =
			x: (curr.x - prev.x) / time
			y: (curr.y - prev.y) / time
		
		velocity.x = 0 if velocity.x is Infinity
		velocity.y = 0 if velocity.y is Infinity
		
		velocity
	
	_calculateAverageVelocity: (time=100) =>
		
		if @_deltas.length < 2
			return {x:0, y:0} 
		
		currTime = lastTime = _.last(@_deltas).t
	
		deltas = for i in [@_deltas.length - 1..0] by -1
			
			currDelta = @_deltas[i]
			currTime = currDelta.t
			
			if currTime < (lastTime - time)
				break
			
			currDelta
		
		totalDelta = 
			x: utils.sum(_.pluck deltas, "x")
			y: utils.sum(_.pluck deltas, "y")
		
		totalTime = _.first(deltas).t - _.last(deltas).t
		
		return {x:0, y:0} if totalTime is 0
		
		velocity =
			x: (totalDelta.x / totalTime)
			y: (totalDelta.y / totalTime)
