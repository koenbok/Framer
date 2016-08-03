Framer.Extras.Preloader.enable()
Framer.Extras.Hints.enable()
Framer.Extras.ShareInfo.enable()


for i in [0..10]
	layer = new Layer
		y: i * 210
	
	layer.image = Utils.randomImage() + "?cache=" + Date.now()
	layer.onClick ->