{ createSVGElement } = require './Utils'

setAttributes = (el, attributes) ->
  for key, value of attributes
    el.setAttribute key, value

class exports.SVGPathProxy
  constructor: (string) ->
    @_node = createSVGElement 'path',
      d: string
      fill: 'transparent'

    @length = @getTotalLength()
    @start = @getPointAtLength(0)
    @end = @getPointAtLength(@length)

  getPointAtLength: (length) ->
    @_node.getPointAtLength(length)

  getTotalLength: ->
    @_node.getTotalLength()

  elementForDebugRepresentation: ->
    group = createSVGElement 'g'

    marker = createSVGElement 'circle',
      r: 2
      cx: 0
      cy: 0
      fill: 'red'

    controlMarker = createSVGElement 'circle',
      r: 2
      cx: 0
      cy: 0
      fill: 'white'
      stroke: '#aaa'
      'stroke-width': '1px'

    connector = createSVGElement 'path',
      d: 'M0,0'
      fill: 'transparent'
      stroke: 'rgba(0, 0, 0, 0.25)'
      'stroke-width': '1px'
      'stroke-dasharray': '4 4'

    debugPath = @_node.cloneNode()

    lx = 0
    ly = 0
    segments = debugPath.pathSegList
    relativeSegmentTypes = [
      SVGPathSeg.PATHSEG_MOVETO_REL,
      SVGPathSeg.PATHSEG_LINETO_REL,
      SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL,
      SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL,
      SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL,
      SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL,
      SVGPathSeg.PATHSEG_ARC_REL,
      SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL,
      SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL
    ]

    elements = []
    for i in [0...segments.numberOfItems]
      segment = segments.getItem(i)

      if segment.pathSegType in relativeSegmentTypes
        addx = lx
        addy = ly
      else
        addx = 0
        addy = 0

      olx = lx
      oly = ly

      if segment.x? || segment.y?
        m = marker.cloneNode()
        mx = addx + (if typeof segment.x is 'undefined' then lx else segment.x)
        my = addy + (if typeof segment.y is 'undefined' then ly else segment.y)
        setAttributes m,
          cx: mx
          cy: my
          class: 'debug-marker'

        lx = mx
        ly = my

        elements.push m

      if segment.x1?
        c1 = controlMarker.cloneNode()
        c1x = addx + segment.x1
        c1y = addy + segment.y1
        setAttributes c1,
          cx: c1x
          cy: c1y
          class: 'debug-control-marker'

        conn = connector.cloneNode()
        setAttributes conn,
          d: "M#{olx},#{oly} L#{c1x},#{c1y}"
          class: 'debug-connector'

        elements.push c1
        elements.push conn

        # quadratic curves have a line from the control point to both anchors
        if !segment.x2?
          conn2 = connector.cloneNode()
          setAttributes conn2,
            d: "M#{mx},#{my} L#{c1x},#{c1y}"
            class: 'debug-connector'
          elements.push conn2

      if segment.x2?
        c2 = controlMarker.cloneNode()
        c2x = addx + segment.x2
        c2y = addy + segment.y2
        setAttributes c2,
          cx: c2x
          cy: c2y
          class: 'debug-control-marker'

        conn = connector.cloneNode()
        setAttributes conn,
          d: "M#{mx},#{my} L#{c2x},#{c2y}"
          class: 'debug-connector'

        elements.push conn
        elements.push c2

    group.appendChild(element) for element in elements

    setAttributes debugPath,
      stroke: 'rgba(0, 0, 0, 0.1)'
      # stroke: 'rgba(255, 0, 0, 0.75)'
      'stroke-width': 1
      fill: 'transparent'
      class: 'debug-path'

    animatedPath = debugPath.cloneNode()
    setAttributes animatedPath,
      class: 'animated-path'
      stroke: 'rgba(255, 0, 0, 0.75)'
      # stroke: 'transparent'
      'stroke-dasharray': @length
      'stroke-dashoffset': @length
      fill: 'transparent'

    group.appendChild animatedPath
    group.appendChild debugPath

    group
