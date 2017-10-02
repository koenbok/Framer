describe "Preloader", ->
	it "should not preload gradients", ->
		Framer.CurrentContext = new Framer.Context(name: "test")
		Framer.CurrentContext.run ->
			new Layer
				gradient:
					start: "red"
		Framer.Extras.Preloader.enable()
		Framer.Preloader.addImagesFromContext(Framer.CurrentContext)
		Framer.Preloader._media.length.should.equal 0
