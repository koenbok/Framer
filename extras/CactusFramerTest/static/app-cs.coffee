viewA = new View x:20, y:20, width:100, height:100
viewB = new View x:0, y:0, width:50, height:50, superView: viewA
viewC = new ImageView x:20, y:20, width:20, height:20, superView: viewB
viewC.image = "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/t1.0-1/c9.9.112.112/s50x50/1002105_10201417272264644_314604545_s.jpg"


for i in [1..10]
	viewACopy = viewA.copy()
	viewACopy.x = 25 * i
	viewACopy.y = 25 * i
