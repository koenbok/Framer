describe "View", ->
  view = new View()

  describe "css classes", ->
    it "should allow classes to be added", ->
      view.addClass('foo')
      view.addClass('bar')
      view.class.should.equal 'uilayer textureBacked foo bar'

    it "should allow classes to be removed", ->
      view.addClass('foo')
      view.addClass('bar')
      view.removeClass('bar')
      view.class.should.equal [ 'uilayer', 'textureBackend', 'foo' ]
