describe 'Path', ->
  it 'should have methods corresponding to the SVG path spec', ->
    path = Path()
    path.should.have.property 'moveTo'
    path.should.have.property 'lineTo'
    path.should.have.property 'hlineTo'
    path.should.have.property 'vlineTo'
    path.should.have.property 'closePath'
    path.should.have.property 'curveTo'
    path.should.have.property 'smoothCurveTo'
    path.should.have.property 'qcurveTo'
    path.should.have.property 'smoothqCurveTo'
    path.should.have.property 'arc'
    path.should.have.property 'points'

  it 'can represent a path as a string that conforms to the SVG path syntax', ->
    path = Path
      .moveTo(x: 10, y: 20)
      .lineTo(x: 50, y: 30)
      .vlineTo(50)
      .curve(to: { x: 100, y: 100 }, control: { x: 200, y: 100 })

    path.toString().should.eql "M 10 20 L 50 30 V 50 Q 200 100 100 100"

  it 'should correctly set the path origin to the layer\'s origin', ->
    # the layer's origin is at x: 75, y: 75
    layer = new Layer width: 100, height: 100, x: 50, y: 50, originX: 0.25, originY: 0.25
    path = Path.curve(to: { x: 200, y: 200 }, control: { x: 100, y: 100 }).forLayer(layer)
    path.points().should.eql [[75, 75], [200, 200]]

  it 'should be able to create a path from a string in the SVG path syntax', ->
    string = 'M 670,60 C 110,50 250,440 530,415'
    path = Path.fromString(string)

    path.points().length.should.eql 2
    path.instructions.length.should.eql 2
    path.instructions[0].command.should.eql "M"
    path.instructions[0].params.should.eql [670, 60]
    path.instructions[1].command.should.eql "C"
    path.instructions[1].params.should.eql [110, 50, 250, 440, 530, 415]

  it 'should be able to calculate the total length of a path', ->
    path = Path.moveTo(x: 0, y: 0).lineTo(x: 50, y: 50)
    path.length.should.be.closeTo(70.71, 0.1)

  it 'should be able to return the coordinates of a point at arbitrary position along a path', ->
    path = Path.moveTo(x: 0, y: 0).hlineTo(50)

    path.pointAtLength(25).should.have.property 'x', 25
    path.pointAtLength(25).should.have.property 'y', 0
    path.pointAtLength(0).should.have.property 'x', 0
    path.pointAtLength(0).should.have.property 'y', 0
    path.pointAtLength(50).should.have.property 'x', 50
    path.pointAtLength(50).should.have.property 'y', 0

  describe 'curve', ->
    it 'should produce a quadratic curve if only one control point is given', ->
      path = Path.curve(to: { x: 10, y: 20 }, control: { x: 50, y: 30 })
      path.toString().should.eql "Q 50 30 10 20"

    it 'should produce a cubic curve if two control points are given', ->
      path = Path.curve(to: { x: 10, y: 20 }, control1: { x: 50, y: 30 }, control2: { x: 70, y: 60 })
      path.toString().should.eql "C 50 30 70 60 10 20"

    it 'should ignore curve if no control points are given', ->
      path = Path.moveTo(x: 10, y: 10).curve(to: { x: 50, y: 50 }).lineTo(x: 100, y: 100)
      path.toString().should.eql "M 10 10 L 100 100"

  describe 'arc', ->
    it 'should assume a horizontal and vertical radius equal to the horizontal and vertical distance between two points', ->
      point1 = { x: 10, y: 10 }
      point2 = { x: 100, y: 100 }

      path = Path.moveTo(point1).arc(to: point2)
      path.toString().should.eql "M #{point1.x} #{point1.y} A #{point2.x - point1.x} #{point2.y - point1.y} 0 0 1 #{point2.x} #{point2.y}"

    it 'should assume that you want a smaller arc by default', ->
      point1 = { x: 10, y: 10 }
      point2 = { x: 100, y: 100 }

      path = Path.moveTo(point1).arc(to: point2)
      path.toString().should.match /M \d+ \d+ A \d+ \d+ \d 0 \d \d+ \d+/

    it 'should let you pick the larger arc', ->
      point1 = { x: 10, y: 10 }
      point2 = { x: 100, y: 100 }

      path = Path.moveTo(point1).arc(to: point2, largeArc: true)
      path.toString().should.match /M \d+ \d+ A \d+ \d+ \d 1 \d \d+ \d+/

    it 'should default to a positive angle arc sweep', ->
      point1 = { x: 10, y: 10 }
      point2 = { x: 100, y: 100 }

      path = Path.moveTo(point1).arc(to: point2)
      path.toString().should.match /M \d+ \d+ A \d+ \d+ \d \d 1 \d+ \d+/

    it 'should let you pick the negative angle arc sweep', ->
      point1 = { x: 10, y: 10 }
      point2 = { x: 100, y: 100 }

      path = Path.moveTo(point1).arc(to: point2, sweep: 0)
      path.toString().should.match /M \d+ \d+ A \d+ \d+ \d \d 0 \d+ \d+/

    it 'should let you specify a horizontal and vertical radius for the arc', ->
      point1 = { x: 10, y: 10 }
      point2 = { x: 100, y: 100 }

      path = Path.moveTo(point1).arc(to: point2, rx: 50, ry: 30)
      path.toString().should.match /A 50 30/

  describe 'thru', ->
    it 'should create a smooth path through the given points', ->
      point1 = { x: 200, y: 100 }
      point2 = { x: 400, y: 220 }
      point3 = { x: 400, y: 380 }

      path = Path.thru([point1, point2, point3])
      path.points().should.eql [[200, 100], [400, 220], [400, 380]]
      path.toString().should.eql "M 200 100 C 233.33333333333334 120 366.6666666666667 173.33333333333334 400 220 C 433.3333333333333 266.6666666666667 400 353.3333333333333 400 380"

    describe 'curviness', ->
      it 'should create a path composed of straight lines when curviness is 0', ->
        point1 = { x: 200, y: 100 }
        point2 = { x: 400, y: 220 }
        point3 = { x: 400, y: 380 }

        path = Path.thru([point1, point2, point3], curviness: 0)

        # technically, we're still using bezier curves, but our control points
        # are equal to the points we're drawing our path through, which results
        # in straight lines between them
        path.toString().should.eql "M #{point1.x} #{point1.y} C #{point1.x} #{point1.y} #{point2.x} #{point2.y} #{point2.x} #{point2.y} C #{point2.x} #{point2.y} #{point3.x} #{point3.y} #{point3.x} #{point3.y}"

      it 'should handle negative curviness values', ->
        point1 = { x: 200, y: 100 }
        point2 = { x: 400, y: 220 }
        point3 = { x: 400, y: 380 }

        path = Path.thru([point1, point2, point3], curviness: -10)

        # with negative curviness, the control points are reflected through the
        # anchor points, so the first control should come *after* the anchor,
        # creating a small loop around it
        control = x: path.instructions[1].params[2], y: path.instructions[1].params[3]
        control.x.should.be.greaterThan point2.x
        control.y.should.be.greaterThan point2.y
