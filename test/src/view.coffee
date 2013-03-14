describe "View", ->
  view = new View()

  describe "css classes", ->
    it "should allow classes to be added", ->
      view.addClass('foo')
      view.addClass('bar')
      view.class.should.equal 'uilayer textureBacked foo bar'

    # it "should allow classes to be removed", ->
    #   view.addClass('foo')
    #   view.addClass('bar')
    #   view.removeClass('bar')
    #   view.class.should.equal [ 'uilayer', 'textureBackend', 'foo' ]

    it "should set x", ->
      view.x = 100
      view.x.should.equal 100

    it "should set y", ->
      view.y = 100
      view.y.should.equal 100

    it "should set frame", ->
      frame = {x:200, y:200, width:200, height:200}
      view.frame = frame
      # view.frame.should.eql frame
      view.x.should.equal frame.x
      view.y.should.equal frame.y
      view.width.should.equal frame.width
      view.height.should.equal frame.height
