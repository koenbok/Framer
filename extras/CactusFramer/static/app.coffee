layerA = new Layer
layerB = new Layer superLayer:layerA

layerA.borderRadius = layerA.height / 4
layerA.center()

# layerA._prefer2d = true
layerB.force2d = true