scroll = new ScrollComponent
	width: Screen.width - 200
	height: Screen.height - 200
scroll.center()

[originX, originY] = [.5, .5]
size = [3000, 3000]

layers = for i in [0..300]
	layer = new Layer
		midX: _.random(0, size[0])
		midY: _.random(0, size[1])
		superLayer: scroll.content


update = ->
	for layer in layers
		layer.backgroundColor = "rgba(0,255,255, 0.5)"
	closest = scroll.closestContentLayer(originX, originY)
	closest.backgroundColor = "rgba(255,0,0,.5)"

update()

scroll.on Events.Scroll, update
scroll.on Events.ScrollEnd, ->
	closest = scroll.closestContentLayer(originX, originY)
	scroll.scrollToLayer(closest, originX, originY)
