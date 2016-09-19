cardA = new Layer
    size: Screen.size
    backgroundColor: "red"

cardB = new Layer
    size: Screen.size
    backgroundColor: "blue"

nav = new NavComponent()
nav.show(cardA)

cardA.onTap -> nav.show(cardB)
cardB.onTap -> nav.back()

Utils.interval 0.1, ->
	print nav.isTransitioning