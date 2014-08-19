layerA = new Layer x:100, y:100, width:100, height:100
layerA.clip = false
layerB = new Layer x:300, y:300, width:100, height:100, backgroundColor:"red", superLayer:layerA

# assert.equal layerB.screenFrame.x, 400
# assert.equal layerB.screenFrame.y, 400

# print _.pick(layerA, ["x", "y", "width", "height"])

newFrame = Utils.convertPoint({x:200, y:200}, null, layerA)

print newFrame

layerB.frame = newFrame

print layerB.x

layerB.superLayer = null



# assert.equal layerB.screenFrame.x, 1000
# assert.equal layerB.screenFrame.y, 1000