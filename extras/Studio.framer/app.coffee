slider = new SliderComponent
	point: Align.center
	knobSize: 80
	height: 600
	width: 20

slider.onValueChange -> print slider.value

slider.width = 500
slider.height = 20
slider.point = Align.center

