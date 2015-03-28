describe "ScrollComponent", ->

  it "should apply constructor options", ->

    instance = new ScrollComponent (scrollHorizontal: false)
    instance.scrollHorizontal.should.be.false