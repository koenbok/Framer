# logEventListeners = ->
# 	
# 	return if window.__logEventListeners
# 	window.__logEventListeners = true
# 	
# 	addEventListener = Element::addEventListener
# 	removeEventListener = Element::removeEventListener
# 	
# 	Element::addEventListener = () ->
# 		print "addEventListener", arguments[0], @
# 		addEventListener.apply(@, arguments)
# 		
# 	
# 	Element::removeEventListener = () ->
# 		print "removeEventListener", arguments, @
# 		removeEventListener.apply(@, arguments)
# 
# logEventListeners()

layer =  new Layer
	width: Screen.width / 2
	height: Screen.height / 2

layer.center()


layer.pinchable.enabled = true
#layer.draggable.enabled = true


p = new Layer width: 10, height: 10

layer.on Gestures.Pinch, (e) ->
	print "pinch", p.point = event.center

