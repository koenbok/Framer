Framer.Extras.Hints.enable()

sketch = Framer.Importer.load("imported/Mail@2x")

nav = new NavComponent
nav.push(sketch.inbox)

# On a hamburger tap, we show the menu
sketch.hamburger.onTap ->
	nav.modalLeft(sketch.menu)

# If we tap on a few rows, show the mail
for row in sketch.yesterday.children
	row.onTap -> nav.push(sketch.mail)

# If we tap on the mail, we go back again
sketch.mail.onTap -> nav.back()

# Set up menu bar (not so interesting)
sketch.status.parent = null
sketch.status.point = 0
sketch.status.bringToFront()


# sketch.menu.bringToFront()
# sketch.menu.bringToFront.point = 0


# card = -> 
# 	
# 	layer = new Layer
# 		size:Screen
# 		backgroundColor: Utils.randomColor()
# 	
# 	layer.html = "Hello"
# 	
# 	return layer
# 	
# a = card()
# b = card()
# c = card()
# 
# c.frame = Utils.frameInset(c.frame, 100)
# 
# nav = new NavComponent
# nav.push(a)

# a.onTap -> nav.modalBottom(c)

# a.onTap -> nav.push(b)
# b.onTap -> nav.back()

# scaleTransition = (nav, layerA, layerB, background) ->
# 	transition =
# 		layerA:
# 			show: {x: 0, y: 0, scale: 1.0, opacity:1}
# 			hide: {x: 0, y: 0, scale: 0.5, opacity:0}
# 			options: {curve: "spring(300, 35, 0)"}
# 		layerB:
# 			show: {x: 0, y: 0, scale: 1.0, opacity:1}
# 			hide: {x: 0, y: 0, scale: 0.5, opacity:0}
# 			options: {curve: "spring(300, 35, 0)"}
# 
# 
# 
# cardA = new Layer
# 	size: Screen.size
# 	backgroundColor: "red"
# 
# cardB = new Layer
# 	size: Screen.size
# 	backgroundColor: "blue"
# 
# nav = new NavComponent()
# nav.push(cardA)
# 
# cardA.onTap -> nav.push(cardB, true, true, scaleTransition)
# cardB.onTap -> nav.back()