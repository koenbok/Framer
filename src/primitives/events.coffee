_ = require "underscore"

utils = require "../utils"

Events = {}

if utils.isTouch()
	Events.TouchStart = "touchstart"
	Events.TouchEnd = "touchend"
	Events.TouchMove = "touchmove"
else
	Events.TouchStart = "mousedown"
	Events.TouchEnd = "mouseup"
	Events.TouchMove = "mousemove"

# Standard dom events

Events.MouseOver = "mouseover"
Events.MouseOut = "mouseout"

# Specific Framer events

Events.DragStart = "dragstart"
Events.DragMove = "dragmove"
Events.DragEnd = "dragend"


Events.sanitize = (event) ->
	touchEvent = event.touches?[0]
	touchEvent ?= event.changedTouches?[0]
	touchEvent ?= event
	touchEvent
	
exports.Events = Events