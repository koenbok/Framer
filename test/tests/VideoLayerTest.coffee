describe "VideoLayer", ->

	describe "Defaults", ->

		it "should create video", ->
			
			videoLayer = new VideoLayer video:"static/test.mp4"
			videoLayer._element.innerHTML.should.equal '<video src="static/test.mp4" style="width: 100%; height: 100%;"></video>'