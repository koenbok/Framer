# Framer.Extras.Hints.enable()
# 
# sketch = Framer.Importer.load("imported/Mail@2x")
# 
# nav = new NavComponent
# nav.push(sketch.inbox)
# 
# # On a hamburger tap, we show the menu
# sketch.hamburger.onTap ->
# 	nav.modalRight(sketch.menu)
# 
# # If we tap on a few rows, show the mail
# for row in sketch.yesterday.children
# 	row.onTap -> nav.push(sketch.mail)
# 
# # If we tap on the mail, we go back again
# sketch.mail.onTap -> nav.back()
# 
# Set up menu bar (not so interesting)
# sketch.status.parent = null
# sketch.status.point = 0
# sketch.status.bringToFront()



card = -> 
	
	layer = new Layer
		size:Screen
		backgroundColor: Utils.randomColor()
	
	layer.html = "Hello"
	
	return layer
	
a = card()
b = card()
c = card()

c.frame = Utils.frameInset(c.frame, 100)

nav = new NavComponent
nav.push(a)

a.onTap -> nav.dialog(c)
# b.onTap -> nav.modal(c)