# Project Info
# This info is presented in a widget when you share.
# http://framerjs.com/docs/#info.info

Framer.Info =
	title: "NavComponent Example"
	author: "Koen Bok"
	twitter: "koenbok"
	description: "A super simple email app NavComponent example. Still very beta©."


Framer.Extras.Hints.enable()

sketch = Framer.Importer.load("imported/Mail@2x")

# Set up the component and add the initial view
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

