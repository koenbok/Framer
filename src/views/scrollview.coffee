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
		# 	el = @_element
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
		@_element.scrollTop = 0
	
	scrollToBottom: ->
		setTimeout =>
			@scrollPoint = @_element.scrollHeight - @frame.height
		, 0
	
	@define "scrollPoint"
		get: ->
			@_element.scrollTop
		set: (value) ->
			@_element.scrollTop = value

	@define "scrollFrame"
		get: ->
			return new Frame {
				x: @_element.scrollLeft
				y: @_element.scrollTop
				width: @width
				height: @height
			}
		set: (frame) ->
			@_element.scrollLeft = frame.x
			@_element.scrollTop = frame.y
			# @_element.innerWidth = frame.width
			# @_element.innerHeight = frame.height