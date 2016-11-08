layer = new Layer
animation = new Animation layer, {y: 500},
	onStart: -> print "start"
	onBreak: -> print "break"
	onEnd: -> print "end"
	onStop: -> print "stop"
	
animation.start()

Utils.delay 0.3, -> animation.stop()