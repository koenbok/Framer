layerA = new Layer
layerB = new Layer

layerA.states.open = x: 500
layerB.states.open = y: 500

ag = new AnimationStateGroup(layerA, layerB)

ag.onStart -> print "start"
ag.onHalt -> print "halt"
ag.onStop -> print "stop"
ag.onEnd -> print "end", @

ag.stateCycle()

print ag.states