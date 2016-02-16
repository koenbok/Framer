describe 'Path', ->
  it 'should have methods corresponding to the SVG path spec', ->
    path = Path()
    path.should.have.property('moveTo')
    path.should.have.property('lineTo')
    path.should.have.property('hlineTo')
    path.should.have.property('vlineTo')
    path.should.have.property('closePath')
    path.should.have.property('curveTo')
    path.should.have.property('smoothCurveTo')
    path.should.have.property('qcurveTo')
    path.should.have.property('smoothqCurveTo')
    path.should.have.property('arc')
    path.should.have.property('points')

  it 'should correctly set the path origin to the layer\'s origin', ->
    # the layer's origin is at x: 75, y: 75
    layer = new Layer width: 100, height: 100, x: 50, y: 50, originX: 0.25, originY: 0.25
    path = Path.curve(to: { x: 200, y: 200 }, control: { x: 100, y: 100 }).forLayer(layer)
    path.points().should.eql([[75, 75], [200, 200]])

  it 'should be able to create a path from a string in the SVG path syntax', ->
    string = 'M 670,60 C 110,50 250,440 530,415'
    path = Path.fromString(string)
    path.points().length.should.eql(2)

  it 'should be able to calculate the total length of a path', ->
    path = Path.moveTo(x: 0, y: 0).lineTo(x: 50, y: 50)
    path.length.should.be.closeTo(70.71, 0.1)

  it 'should be able to return the coordinates of a point at arbitrary position along a path', ->
    path = Path.moveTo(x: 0, y: 0).hlineTo(50)

    path.pointAtLength(25).should.have.property('x', 25)
    path.pointAtLength(25).should.have.property('y', 0)
    path.pointAtLength(0).should.have.property('x', 0)
    path.pointAtLength(0).should.have.property('y', 0)
    path.pointAtLength(50).should.have.property('x', 50)
    path.pointAtLength(50).should.have.property('y', 0)

  describe 'thru', ->
    it 'should create a smooth path through the given points', ->
      point1 = { x: 200, y: 100 }
      point2 = { x: 400, y: 220 }
      point3 = { x: 400, y: 380 }

      path = Path.thru([point1, point2, point3])
      path.points().should.eql([[200, 100], [400, 220], [400, 380]])
