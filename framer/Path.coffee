{_} = require "./Underscore"
Utils = require "./Utils"
{Layer} = require "./Layer"

# Adapted from https://gist.github.com/njvack/6925609
# with help from http://pomax.github.io/bezierinfo/
catmullRom2Bezier = (points, closed=false, tension=0.5) ->
  d = []
  l = points.length
  i = 0

  zero = { x: 0, y: 0 }

  for i in [0...(l - !closed)]
    p = [
      points[i - 1] || zero,
      points[i]     || zero,
      points[i + 1] || zero,
      points[i + 2] || zero
      ]

    if closed
      if i is 0
        p[0] = points[l - 1]
      else if i is l - 2
        p[3] = points[0]
      else if i is l - 1
        p[2] = points[0]
        p[3] = points[1]
    else
      if i is l - 2
        p[3] = p[2]
      else if i is 0
        p[0] = points[i]

    t = (tension - 1) * 2

    c1x = p[1].x - (p[2].x - p[0].x) / (6 / t)
    c1y = p[1].y - (p[2].y - p[0].y) / (6 / t)

    c2x = p[2].x + (p[3].x - p[1].x) / (6 / t)
    c2y = p[2].y + (p[3].y - p[1].y) / (6 / t)

    x = p[2].x
    y = p[2].y

    d.push [{ x: c1x, y: c1y }, { x: c2x, y: c2y }, { x: x, y: y}]

  return d

# Adapted from https://github.com/andreaferretti/paths-js
Path = (init) ->
  instructions = init || []

  printInstrunction = ({ command, params }) ->
    "#{ command } #{ params.join ' ' }"

  point = ({ command, params }, [prev_x, prev_y]) ->
    switch command
      when 'M' then [params[0], params[1]]
      when 'L' then [params[0], params[1]]
      when 'H' then [params[0], prev_y]
      when 'V' then [prev_x, params[0]]
      when 'Z' then null
      when 'C' then [params[4], params[5]]
      when 'S' then [params[2], params[3]]
      when 'Q' then [params[2], params[3]]
      when 'T' then [params[0], params[1]]
      when 'A' then [params[5], params[6]]

  push = (arr, el) ->
    copy = arr[0...arr.length]
    copy.push el
    copy

  plus = (instruction) ->
    Path(push instructions, instruction)

  moveTo = ({x, y}) -> plus
    command: 'M'
    params: [x, y]

  lineTo = ({x, y}) -> plus
    command: 'L'
    params: [x, y]

  hlineTo = (x) -> plus
    command: 'H'
    params: [x]

  vlineTo = (y) -> plus
    command: 'V'
    params: [y]

  closePath = -> plus
    command: 'Z'
    params: []

  curve = ({ from, to, control1, control2 }) ->
    p = Path(instructions)

    if from
      p = p.moveTo(from)

    if control1 and not control2
      p = p.qcurveTo(to, control: control1)

    if control1 and control2
      p = p.curveTo(to, {control1, control2})

    p

  curveTo = (to, {control1, control2}) -> plus
    command: 'C'
    params: [control1.x, control1.y, control2.x, control2.y, to.x, to.y]

  smoothCurveTo = (to, {control}) -> plus
    command: 'S'
    params: [control.x, control.y, to.x, to.y]

  qcurveTo = (to, {control}) -> plus
    command: 'Q'
    params: [control.x, control.y, to.x, to.y]

  smoothqCurveTo = ({x, y}) -> plus
    command: 'T'
    params: [x, y]

  arcTo = (to, {rx, ry, xrot, largeArc, sweep}) -> plus
      command: 'A'
      params: [rx, ry, xrot, largeArc, sweep, to.x, to.y]

  thru = (points, {curviness}={}) ->
    curviness ?= 5
    tension = 1 - curviness / 10
    closed = false
    beziers = catmullRom2Bezier(points, closed, tension)

    p = Path(instructions).moveTo(points[0])
    for b in beziers
      p = p.curveTo(b[2], control1: b[0], control2: b[1])

    p

  print = ->
    instructions.map(printInstrunction).join(' ')

  points = ->
    ps = []
    prev = [0, 0]
    for instruction in instructions
      do ->
        p = point(instruction, prev)
        prev = p
        if p then ps.push p

    ps

  getPointAtLength = (length) ->
    node.getPointAtLength(length)

  getTotalLength = ->
    node.getTotalLength()

  getBBox = ->
    node.getBBox()

  elementForDebugRepresentation = ->
    group = Utils.SVG.createElement('g')

    marker = Utils.SVG.createElement 'circle',
    	r: 2
    	cx: 0
    	cy: 0
    	fill: 'red'

    controlMarker = Utils.SVG.createElement 'circle',
      r: 2
      cx: 0
      cy: 0
      fill: 'white'
      stroke: '#aaa'
      'stroke-width': '1px'

    connector = Utils.SVG.createElement 'path',
      d: "M0,0"
      fill: 'transparent'
      stroke: 'rgba(0, 0, 0, 0.25)'
      'stroke-width': '1px'
      'stroke-dasharray': '4 4'

    debugPath = node.cloneNode()

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

      if segment.x || segment.y
        m = marker.cloneNode()
        mx = addx + segment.x || lx
        my = addy + segment.y || ly
        m.setAttribute 'cx', mx
        m.setAttribute 'cy', my

        lx = mx
        ly = my

        elements.push m

      if segment.x1
        c1 = controlMarker.cloneNode()
        c1x = addx + segment.x1
        c1y = addy + segment.y1
        c1.setAttribute 'cx', c1x
        c1.setAttribute 'cy', c1y

        conn = connector.cloneNode()
        conn.setAttribute('d', "M#{olx},#{oly} L#{c1x},#{c1y}")

        elements.push c1
        elements.push conn

        # quadratic curves have a line from the control point to both anchors
        if !segment.x2
          conn2 = connector.cloneNode()
          conn2.setAttribute('d', "M#{mx},#{my} L#{c1x},#{c1y}")
          elements.push conn2

      if segment.x2
        c2 = controlMarker.cloneNode()
        c2x = addx + segment.x2
        c2y = addy + segment.y2
        c2.setAttribute 'cx', c2x
        c2.setAttribute 'cy', c2y

        conn = connector.cloneNode()
        conn.setAttribute('d', "M#{mx},#{my} L#{c2x},#{c2y}")

        elements.push conn
        elements.push c2

    group.appendChild(element) for element in elements

    # debugPath.setAttribute('stroke', 'rgba(0, 0, 0, 0.1)')
    debugPath.setAttribute('stroke', 'rgba(255, 0, 0, 0.75)')
    debugPath.setAttribute('stroke-width', 1)
    debugPath.setAttribute('fill', 'transparent')

    animatedPath = debugPath.cloneNode()
    animatedPath.setAttribute('class', 'animated-path')
    # animatedPath.setAttribute('stroke', 'rgba(255, 0, 0, 0.75)')
    animatedPath.setAttribute('stroke', 'transparent')
    animatedPath.setAttribute('stroke-dasharray', getTotalLength())
    animatedPath.setAttribute('stroke-dashoffset', getTotalLength())
    animatedPath.setAttribute('fill', 'transparent')

    group.appendChild(animatedPath)
    group.appendChild(debugPath)

    group

  node = Utils.SVG.createElement 'path',
    d: print()
    fill: 'transparent'

  start = getPointAtLength(0)
  end = getPointAtLength(getTotalLength())
  offsetX = start.x
  offsetY = start.y

  # Public
  { moveTo, lineTo, hlineTo, vlineTo, closePath, curve, curveTo, smoothCurveTo,
    qcurveTo, smoothqCurveTo, arcTo, thru, print, getPointAtLength, getTotalLength,
    getBBox, elementForDebugRepresentation, start, end, offsetX, offsetY, node }

Path.curve = ->
  Path().curve.apply(this, arguments)

Path.thru = ->
  Path().thru.apply(this, arguments)

Path.fromString = (path) ->
  # Parsing code adapted from https://github.com/jkroso/parse-svg-path/blob/master/index.js
  segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig
  length = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }

  instructions = []
  path.replace segment, (p, command, args) ->
    type = command.toLowerCase()
    args = args.match /-?[.0-9]+(?:e[-+]?\d+)?/ig
    if args
      args = args.map(Number)
    else
      args = []

    # overloaded moveTo
    if type == 'm' && args.length > 2
    	instructions.push command: command, params: args.splice(0, 2)
    	type = 'l'
    	command = if command == 'm' then 'l' else 'L'

    while true
    	if args.length == length[type]
    		return instructions.push(command: command, params: args)

    	if (args.length < length[type])
        throw new Error('Malformed path data')

    	instructions.push command: command, params: args.splice(0, length[type])

  Path(instructions)

Path.loadPath = (url) ->
  data = Utils.domLoadDataSync(url)
  parser = new DOMParser()
  svg = parser.parseFromString(data, 'image/svg+xml')
  path = svg.getElementsByTagName('path')?[0]

  unless path
    console.error "Path: no <path> elements found in file loaded from URL: '#{url}'"
    return null

  Path.fromString(path.getAttribute('d')) if path

_.extend exports, {Path}

# class Arc extends Path
#   constructor: (options) ->
#     from = options.from
#     from = { x: from.midX, y: from.midY } if from instanceof Layer
#
#     to = options.to
#     to = { x: to.midX, y: to.midY } if to instanceof Layer
#
#     @rx = options.rx || Math.abs(to.x - from.x)
#     @ry = options.ry || Math.abs(to.y - from.y)
#
#     @frame = Utils.frameFittingPoints(from, to)
#     @start = { x: from.x - @frame.x, y: from.y - @frame.y }
#     @end = { x: to.x - @frame.x, y: to.y - @frame.y }
#
#     part = options.part || 'top'
#     @sweep = part is 'top'
#     @sweep = !@sweep if @end.x < @start.x
#
#     context = Utils.SVG.getContext()
#     node = Utils.SVG.createElement 'path',
#       d: @getInstructions()
#       fill: 'transparent'
#     context.appendChild(node)
#
#     super(node)
#
#   getInstructions: ->
#     "M#{@start.x},#{@start.y} A#{@rx},#{@ry} 0 0,#{if @sweep then 1 else 0} #{@end.x},#{@end.y}"
