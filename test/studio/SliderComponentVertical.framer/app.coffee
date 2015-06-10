document.body.style.cursor = "auto"

slider = new SliderComponent 
	width: 6
	height: 200
	min: 0, max: 50
	value: 25
	knobSize: 30

slider.center()
slider.x += 75
	
val = new Layer 
	backgroundColor: "transparent"
	clip: false
	
val.style = {
	"font": "100 92px/1 Helvetica Neue"
	"color": "#333"
	"text-align": "center"
}

val.html = slider.value
val.center()
val.x -= 75
	
slider2 = new SliderComponent 
	width: 200
	height: 6
	min: 0, max: 50
	value: 25
	knobSize: 30

slider2.center()
slider2.y -= 150
slider2.x -= 50

slider.on "change:value", ->
	val.html = Math.round this.value
	slider2.value = this.value 

slider2.on "change:value", ->
	val.html = Math.round this.value
	slider.value = this.value 