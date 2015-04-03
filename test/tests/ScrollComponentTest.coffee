expect = chai.expect

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

  describe "wrap", ->

    it "should forward constructor options", ->
      options =
        scrollVertical: false
        mouseWheelEnabled: true
        name: "is a name"

      # 'wrap' ports the 'name' of the layer onto the ScrollComponent
      layer = new Layer name: options.name
      layer.name.should.equal(options.name)

      scroller = ScrollComponent.wrap layer, options
      for key in _.keys options
        expect(scroller[key]).to.equal(options[key])
