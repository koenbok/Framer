describe "VideoLayer", ->

	describe "Defaults", ->

		# This allways errs in Safari
		if not Utils.isSafari()
			it "should create video", ->
							
				videoLayer = new VideoLayer video:"static/test.mp4"
				videoLayer.player.src.should.equal "static/test.mp4"
