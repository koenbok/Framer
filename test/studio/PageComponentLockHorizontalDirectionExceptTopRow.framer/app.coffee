horizontalPages = 3
verticalPages = 4

pageComp = new PageComponent
	size: Screen.size
	directionLock: true

verticalPCs = []

for horizontalPageIndex in [0...horizontalPages]
	for verticalPageIndex in [0...verticalPages]
		page = new Layer
			x: horizontalPageIndex * Screen.width
			y: verticalPageIndex * Screen.height
			size: Screen.size
			backgroundColor: "#28affa"
			superLayer: pageComp.content
			html: "#{horizontalPageIndex}:#{verticalPageIndex}"
			style:
				lineHeight: "#{Screen.height}px"
				textAlign: "center"
				fontSize: "240px"
				fontWeight: "100"
				fontFamily: "Helvetica Neue"

pageComp.on Events.Move, (scrollOffset) ->
	if scrollOffset.y == 0
		pageComp.scrollHorizontal = true
	else
		if pageComp.scrollHorizontal
			pageComp.scrollHorizontal = false