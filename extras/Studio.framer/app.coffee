scroll = new ScrollComponent
	name: "MainScroll"
	height: Framer.Screen.height
	width: Framer.Screen.width
	scrollHorizontal: false
	directionLock: true
	backgroundColor: 'white'

rows = []

for i in [0...4]
	row = new Layer
		height: 400
		width: 400
		x: 25
		y: 25 + 425 * i
		parent: scroll.content
		backgroundColor: 'white'
		name: "row#{i}"
	rows.push(row)

for row in rows
	storyScroll =  new ScrollComponent
		name: "StoryScroll"
		height: 400
		width: Framer.Screen.width
		x: 0
		y: 0
		parent: row
		backgroundColor: 'white'
		scrollVertical: false
		directionLock: true
		name: "units#{row.index}"

	# Add story units
	for i in [0..4]
		unit = new Layer
			width: 400
			height: 400
			parent: storyScroll.content
			x: 425 * i
			backgroundColor: Utils.randomColor()
			name: "unit#{i}"
			