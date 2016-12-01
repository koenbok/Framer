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
c3 = new Card()

nav = new NavComponent(c1)

c1.onTap -> nav.showNext(c2)
c2.onTap -> nav.showPrevious()

nav.onTransitionEnd (args...) ->
	print "end", @, args