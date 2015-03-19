scroll = new ScrollComponent
scroll.anchor([100,100,100,100])

info = new Layer height:30
info.anchor({left:100, right:100, top:30})

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