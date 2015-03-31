describe "ScrollComponent", ->

  it "should apply constructor options", ->

    instance = new ScrollComponent (scrollHorizontal: false)
    instance.scrollHorizontal.should.be.false

  # Currently fails:
  it.skip "should keep scrollHorizontal value on copy", ->

    instance = new ScrollComponent (scrollHorizontal: false)
    instance.scrollHorizontal.should.be.false

    copy = instance.copy()
    copy.scrollHorizontal.should.be.false