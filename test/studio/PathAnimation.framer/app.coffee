layer = new Layer 
	x: 100, y: 100
	width: 50, height: 50
	backgroundColor: '#cbf'
	borderRadius: 25

layer.animateTo
	path: 'M0,108.613281 C0,108.613281 21.515625,1.42108547e-14 86.7773438,0 C152.039062,0 102.847656,160.578125 172.316406,160.578125 C241.785156,160.578125 282.722656,4.80859375 282.722656,4.80859375'
	options:
		time: 4
		debug: true
	
# layer2 = new Layer
# 	x: 100, y: 300
# 	width: 50, height: 50
# 	backgroundColor: '#cdf'
# 	borderRadius: 25
# 	
# complexPath = "M62.9 14.9c-25-7.74-56.6 4.8-60.4 24.3-3.73 19.6 21.6 35 39.6 37.6 42.8 6.2 72.9-53.4 116-58.9 65-18.2 191 101 215 28.8 5-16.7-7-49.1-34-44-34 11.5-31 46.5-14 69.3 9.38 12.6 24.2 20.6 39.8 22.9 91.4 9.05 102-98.9 176-86.7 18.8 3.81 33 17.3 36.7 34.6 2.01 10.2.124 21.1-5.18 30.1"
#   
# layer2.animateTo
# 	path: complexPath
# 	options:
# 		time: 4
# 		debug: true
