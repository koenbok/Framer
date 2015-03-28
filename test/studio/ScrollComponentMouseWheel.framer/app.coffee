scroll = new ScrollComponent
	width: Screen.width - 200
	height: Screen.height - 200
scroll.center()

info = new Layer
	height: 30
	width: 200
info.centerX()

rows = 8
cols = 8

gutter = 0

for rowIndex in [0..rows-1]
	for colIndex in [0..cols-1]
		
		cellLayer = new Layer
			width:  scroll.width / 2
			height: scroll.height / 2
			x: colIndex * (scroll.width / 2)
			y: rowIndex * (scroll.height / 2)
			superLayer: scroll.content
			backgroundColor: Utils.randomColor()
		
		Utils.labelLayer cellLayer, "#{rowIndex}:#{colIndex}"

updateInfo = ->
	Utils.labelLayer(info, "MouseWheelEnabled: #{scroll.mouseWheelEnabled}")
	
updateInfo()
	
scroll.on Events.Click, ->
	if not scroll.isDragging
		scroll.mouseWheelEnabled = !scroll.mouseWheelEnabled
		updateInfo()