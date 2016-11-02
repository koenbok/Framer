describe "PageComponent", ->
	it "should have default animationOptions", ->
		page = new PageComponent
		page.animationOptions.should.eql {curve: "spring(500, 50, 0)"}
