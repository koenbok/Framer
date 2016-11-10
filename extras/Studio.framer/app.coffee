# Card
class Card extends Layer
	constructor: (options={}) ->
		options.size ?= Screen
		options.backgroundColor ?= Utils.randomColor()
		options.visible = false
		super options
		Utils.labelLayer(@, "Card #{@id}")

c1 = new Card()
c2 = new Card()
c3 = new Card(size: 400)

nav = new NavComponent
nav.showNext(c1)

nav.header = new Layer
	height: 80
	width: Screen.width

nav.header.onClick -> nav.showPrevious()

Utils.labelLayer(nav.header, "Header")

c1.onClick -> nav.showNext(c2)
c2.onClick -> nav.showOverlayCenter(c3)