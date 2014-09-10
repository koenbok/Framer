
# ctx = new Framer.Context(name:"UI")
# ctx.run ->
# 	layer = new Layer
# 	layer.on "click", ->

# 		Framer.CurrentContext.run ->

# 			Framer.CurrentContext.reset()

# 			# for i in [1..100]
# 			# 	layer = new Layer
# 			# 		x: Math.random() * Framer.CurrentDevice.content.width
# 			# 		y: Math.random() * Framer.CurrentDevice.content.height

# 			# 	# console.timeline("boo")

# 			# 	layer.animate
# 			# 		properties:
# 			# 			x: Math.random() * Framer.CurrentDevice.content.width
# 			# 			y: Math.random() * Framer.CurrentDevice.content.height
# 			# 		curve: "spring(40,10,0)"
# 			# 		delay: 1

# 			# 	# layer.on Events.AnimationEnd, ->
# 			# 	# 	console.timelineEnd("boo")



main = ->
	layer = new Layer

	for i in [1..100]
		new Layer
			x: Math.random() * Framer.CurrentDevice.content.width
			y: Math.random() * Framer.CurrentDevice.content.height

	Utils.delay 1, ->
		Framer.CurrentContext.reset()
		main()

main()
