describe 'SVGPathProxy', ->
  it 'should accept a valid SVGPathElement path description', ->
    path = new SVGPathProxy('M 0 0 H 300')
    path.length.should.equal 300

  it 'should be able to calculate the total length of a path', ->
    path = new SVGPathProxy('M 0 0 L 50 50')
    path.length.should.be.closeTo(70.71, 0.1)

  it 'should be able to return the coordinates of a point at arbitrary position along a path', ->
    path = new SVGPathProxy('M 0 0 H 50')

    path.getPointAtLength(25).should.have.property 'x', 25
    path.getPointAtLength(25).should.have.property 'y', 0
    path.getPointAtLength(0).should.have.property 'x', 0
    path.getPointAtLength(0).should.have.property 'y', 0
    path.getPointAtLength(50).should.have.property 'x', 50
    path.getPointAtLength(50).should.have.property 'y', 0
