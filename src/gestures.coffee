# Adapted from http://alxgbsn.co.uk/


class Gesture

	Gestures = ["tap", "tapend"]
	ListenEvents = ["touchmove", "touchend", "touchcancel", "mousemove", "mouseup"]
	
	MoveCancelAllowance = 10

	constructor: (@element, @gesture, @callback) ->

		@moved = false
		@startX = 0
		@startY = 0
		@hasTouchEventOccured = false
		
		@element.addEventListener "touchstart", @handleEvent, false
		@element.addEventListener "mousedown", @handleEvent, false

	start: (e) ->
		@hasTouchEventOccured = true if e.type is "touchstart"
		@moved = false
		@startX = (if e.type is "touchstart" then e.touches[0].clientX else e.clientX)
		@startY = (if e.type is "touchstart" then e.touches[0].clientY else e.clientY)
		
		for event in @ListenEvents
			@element.addEventListener event, @handleEvent, false

	
	move: (e) ->
		x = (if e.type is "touchmove" then e.touches[0].clientX else e.clientX)
		y = (if e.type is "touchmove" then e.touches[0].clientY else e.clientY)
			
		#if finger moves more than 10px flag to cancel

		p = @MoveCancelAllowance

		if Math.abs(x - @startX) > p or Math.abs(y - @startY) > p
			@moved = true

	end: (e) ->
		
		# evt = undefined
		
		# # Weird situation where 
		# if @hasTouchEventOccured and e.type is "mouseup"
		# 	e.preventDefault()
		# 	e.stopPropagation()
		# 	@hasTouchEventOccured = false
		# 	return
		
		unless @moved
			evt = document.createEvent("Event")
			evt.initEvent "tap", true, true
			e.target.dispatchEvent evt

		for event in @ListenEvents
			@element.removeEventListener event, @handleEvent, false

	cancel: (e) ->

		@moved = false
		@startX = 0
		@startY = 0

		for event in @ListenEvents
			@element.removeEventListener event, @handleEvent, false

	handleEvent: (e) ->
		switch e.type
			when "touchstart"
				@start e
			when "touchmove"
				@move e
			when "touchend"
				@end e
			when "touchcancel"
				@cancel e
			when "mousedown"
				@start e
			when "mousemove"
				@move e
			when "mouseup"
				@end e
