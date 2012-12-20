{Frame} = require "../primitives/frame"
{View} = require "./view"

class exports.ScrollView extends View
	constructor: ->
		super
		@style["overflow"] = "scroll"
		@style["-webkit-overflow-scrolling"] = "touch"
		@style["overflow-x"] = "scroll"
		@style["overflow-y"] = "scroll"
		
		
		# # Hack to disable rubber banding on ios devices
		# startY = startTopScroll = deltaY = undefined
		# 
		# @on "touchstart", =>
		# 	el = @layer.element
		# 	startY = event.touches[0].pageY
		# 	startTopScroll = el.scrollTop
		# 	if startTopScroll <= 0
		# 		el.scrollTop = 1
		# 	if startTopScroll + el.offsetHeight >= el.scrollHeight
		# 		el.scrollTop = el.scrollHeight - el.offsetHeight - 1
		# , false

	@define "scrollVertical"
		get: ->
			@style["overflow-y"] != "hidden"
		set: (value) ->
			@style["overflow-y"] = if value then "scroll" else "hidden"

	@define "scrollHorizontal"
		get: ->
			@style["overflow-x"] != "hidden"
		set: (value) ->
			@style["overflow-x"] = if value then "scroll" else "hidden"

	scrollToTop: ->
		@layer.element.scrollTop = 0
	
	scrollToBottom: ->
		setTimeout =>
			@scrollPoint = @layer.element.scrollHeight - @frame.height
		, 0
	
	@define "scrollPoint"
		get: ->
			@layer.element.scrollTop
		set: (value) ->
			@layer.element.scrollTop = value

	@define "scrollFrame"
		get: ->
			return new Frame {
				x: @layer.element.scrollLeft
				y: @layer.element.scrollTop
				width: @width
				height: @height
			}
		set: (frame) ->
			@layer.element.scrollLeft = frame.x
			@layer.element.scrollTop = frame.y
			# @layer.element.innerWidth = frame.width
			# @layer.element.innerHeight = frame.height