Framer.Extras.Hints.enable()

sketch = Framer.Importer.load("imported/Mail2@2x")

nav = new NavComponent
nav.push(sketch.inbox)

sketch.hamburger.onTap -> nav.modal(sketch.menu)
sketch.mail.onTap -> nav.back()

for row in sketch.yesterday.children
	row.onTap -> nav.push(sketch.mail)

# Set up menu bar
sketch.status.parent = null
sketch.status.point = 0
sketch.status.bringToFront()
