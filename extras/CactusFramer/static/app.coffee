document.ontouchmove = (event) ->
	if event.target is document.body
		event.preventDefault()
	#event.preventDefault()
	#event.stopPropagation()
	#event.stopImmediatePropagation()


# checkIfElementShouldScroll = (element) ->
# 	print typeof element
# 	return true

# document.ontouchmove = (e) ->
	
# 	target = e.currentTarget
		
# 	while (target)

# 		if checkIfElementShouldScroll(target)
# 			return

# 		target = target.parentNode

# 	e.preventDefault()


ScrollFix = (elem) ->
	
	# Variables to track inputs
	startY = undefined
	startTopScroll = undefined
	elem = elem or document.querySelector(elem)
	
	# If there is no element, then do nothing	
	return  unless elem
	
	# Handle the start of interactions
	elem.addEventListener "touchstart", ((event) ->
		startY = event.touches[0].pageY
		startTopScroll = elem.scrollTop
		elem.scrollTop = 1  if startTopScroll <= 0
		elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1  if startTopScroll + elem.offsetHeight >= elem.scrollHeight
		return
	), false
	return




margin = 300

scrollingLayer = new Layer
	width:  window.innerWidth - margin
	height: window.innerHeight - margin

contentLayer = new Layer
	width:  scrollingLayer.width
	height: scrollingLayer.height * 3
	image: "http://goo.gl/gpEHNR"
	superLayer: scrollingLayer

scrollingLayer.center()
scrollingLayer.scrollVertical = true


ScrollFix(document)
