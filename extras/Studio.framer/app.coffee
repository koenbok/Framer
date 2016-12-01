# Create layers 
layerA = new Layer
	size: Screen.size
	backgroundColor: "#00AAFF"
 
layerB = new Layer
	size: Screen.size
	backgroundColor: "#FFCC33"
 
# Create FlowComponent and show layer 
flow = new FlowComponent
flow.showNext(layerA)
 
# Instantly show layerB on click 
layerA.onClick ->
	flow.showNext(layerB)
layerB.onClick ->
	flow.showPrevious(layerA)