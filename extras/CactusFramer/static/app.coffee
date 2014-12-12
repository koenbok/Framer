layer = new Layer
layer.states.add
	stateA: {backgroundColor:"red", x:500}

# layer.scroll.should.equal false
# layer.x.should.equal 0

layer.states.on Events.StateDidSwitch, ->
	print "done", layer.backgroundColor



layer.states.switch "stateA", {curve:"ease-in-out", time:1}