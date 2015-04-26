# SliderComponent
sliderA = new SliderComponent
sliderA.center()

sliderA.min = 0
sliderA.max = 100
sliderA.value = 50

# knobSize vs. size
sliderA.knobSize = 60
sliderA.knob.width = sliderA.knob.height = 40

# Visualize value
sliderA.knob.clip = false
valueLayer = new Layer 
	width:60, height:72, image:"images/value.png"
	superLayer: sliderA.knob
	y: sliderA.knob.y - 70
	scale: 0
	
valueLayer.x -= 10

valueLayer.html = sliderA.value
valueLayer.style = {
	"color" : "#fff"
	"font-size" : "32px"
	"font-family" : "Helvetica Neue"
	"font-weight" : "300"
	"line-height" : "#{valueLayer.height - 12}px"
	"text-align" : "center"
}

valueLayer.originY = 1

# Visualize output
sliderA.knob.on Events.DragStart, ->
	valueLayer.animate 
		properties: { scale: 0.8 }
		curve: "spring(500,30,0)"

# Test proper output		
sliderA.on "change:value", ->
	valueLayer.html = Math.round this.value

sliderA.knob.on Events.DragAnimationDidEnd, ->
	valueLayer.animate 
		properties: { scale: 0 }
		curve: "spring(300,30,0)"