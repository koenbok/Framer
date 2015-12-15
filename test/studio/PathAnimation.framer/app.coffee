layer = new Layer 
	x: 100, y: 100
	width: 50, height: 50
	backgroundColor: '#cbf'
	borderRadius: 50

point1 = { x: 200, y: 100 }
point2 = { x: 400, y: 220 }
point3 = { x: 400, y: 580 }

layer.animate
	time: 4
	path: Path.fromString('M0,108.613281 C0,108.613281 21.515625,1.42108547e-14 86.7773438,0 C152.039062,0 102.847656,160.578125 172.316406,160.578125 C241.785156,160.578125 282.722656,4.80859375 282.722656,4.80859375')
	debug: true