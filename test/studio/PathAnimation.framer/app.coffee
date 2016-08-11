layer = new Layer 
	x: 100, y: 100
	width: 50, height: 50
	backgroundColor: '#cbf'
	borderRadius: 25

layer.animateTo
	path: Path.fromString('M0,108.613281 C0,108.613281 21.515625,1.42108547e-14 86.7773438,0 C152.039062,0 102.847656,160.578125 172.316406,160.578125 C241.785156,160.578125 282.722656,4.80859375 282.722656,4.80859375')
	options:
		time: 4
		debug: true
	
layer2 = new Layer
	x: 100, y: 300
	width: 50, height: 50
	backgroundColor: '#cdf'
	borderRadius: 25
	
complexPath = Path.curve(
	to: { x: 400, y: 400}, 
	control1: { x: 200, y: 200 }, 
	control2: { x: 300, y: 300})
  .curve(to: { x: 500, y: 500 }, control1: { x: 350, y: 350 }) # a curve with just one control point is quadratic, instead of cubic
  .lineTo(x: 600, y: 500)
  .vlineTo(400)
  .arc(to: { x: 700, y: 700 }, rx: 200, ry: 250)
  
layer2.animateTo
	path: complexPath
	options:
		time: 4
		debug: true
  	
point1 = { x: 200, y: 100 }
point2 = { x: 400, y: 220 }
point3 = { x: 400, y: 380 }

layer3 = new Layer
	x: 100, y: 100
	width: 50, height: 50
	backgroundColor: '#cef'
	borderRadius: 25

layer3.animateTo
	path: Path.thru([point1, point2, point3], curviness: -10)
	options:
		time: 2
		debug: true