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
			points[i]		 || zero,
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

	functor = (f, args) ->
		if typeof f is 'function'
			f(instructions)
		else
			f

	instructionToString = ({ command, params }) ->
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

	unshift = (arr, el) ->
		copy = arr[0...arr.length]
		copy.unshift el
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

	curve = ({ to, control, control1, control2 }) ->
		p = Path(instructions)

		if control
			control1 = control

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

	originOrZero = (instructions) ->
		if instructions[0]?.command is 'M'
			{ x: instructions[0].params[0], y: instructions[0].params[1] }
		else
			{ x: 0, y: 0 }

	arc = ({ to, rx, ry, xrot, largeArc, sweep}) ->
		xrot ||= 0
		rx ||= (instructions) ->
			o = originOrZero(instructions)
			to.x - o.x

		ry ||= (instructions) ->
			o = originOrZero(instructions)
			to.y - o.y

		largeArc ||= 0
		sweep ||= 1

		plus
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

	toString = ->
		evaluate = (instruction, i) ->
			command: instruction.command
			params: instruction.params.map(functor)

		instructions.map(evaluate).map(instructionToString).join(' ')

	points = ->
		ps = []
		prev = [0, 0]
		for instruction in instructions
			do ->
				p = point(instruction, prev)
				prev = p
				if p then ps.push p

		ps

	pointAtLength = (length) ->
		node.getPointAtLength(length)

	getTotalLength = ->
		node.getTotalLength()

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
				mx = addx + (if typeof segment.x is 'undefined' then lx else segment.x)
				my = addy + (if typeof segment.y is 'undefined' then ly else segment.y)
				m.setAttribute 'cx', mx
				m.setAttribute 'cy', my
				m.setAttribute 'class', 'debug-marker'

				lx = mx
				ly = my

				elements.push m

			if segment.x1
				c1 = controlMarker.cloneNode()
				c1x = addx + segment.x1
				c1y = addy + segment.y1
				c1.setAttribute 'cx', c1x
				c1.setAttribute 'cy', c1y
				c1.setAttribute 'class', 'debug-control-marker'

				conn = connector.cloneNode()
				conn.setAttribute('d', "M#{olx},#{oly} L#{c1x},#{c1y}")
				conn.setAttribute 'class', 'debug-connector'

				elements.push c1
				elements.push conn

				# quadratic curves have a line from the control point to both anchors
				if !segment.x2
					conn2 = connector.cloneNode()
					conn2.setAttribute 'd', "M#{mx},#{my} L#{c1x},#{c1y}"
					conn2.setAttribute 'class', 'debug-connector'
					elements.push conn2

			if segment.x2
				c2 = controlMarker.cloneNode()
				c2x = addx + segment.x2
				c2y = addy + segment.y2
				c2.setAttribute 'cx', c2x
				c2.setAttribute 'cy', c2y
				c2.setAttribute 'class', 'debug-control-marker'

				conn = connector.cloneNode()
				conn.setAttribute 'd', "M#{mx},#{my} L#{c2x},#{c2y}"
				conn.setAttribute 'class', 'debug-connector'

				elements.push conn
				elements.push c2

		group.appendChild(element) for element in elements

		# debugPath.setAttribute 'stroke', 'rgba(0, 0, 0, 0.1)'
		debugPath.setAttribute 'stroke', 'rgba(255, 0, 0, 0.75)'
		debugPath.setAttribute 'stroke-width', 1
		debugPath.setAttribute 'fill', 'transparent'
		debugPath.setAttribute 'class', 'debug-path'

		animatedPath = debugPath.cloneNode()
		animatedPath.setAttribute 'class', 'animated-path'
		# animatedPath.setAttribute 'stroke', 'rgba(255, 0, 0, 0.75)'
		animatedPath.setAttribute 'stroke', 'transparent'
		animatedPath.setAttribute 'stroke-dasharray', getTotalLength()
		animatedPath.setAttribute 'stroke-dashoffset', getTotalLength()
		animatedPath.setAttribute 'fill', 'transparent'

		group.appendChild animatedPath
		group.appendChild debugPath

		group

	hasOrigin = ->
		'M' in _.pluck(instructions, 'command')

	# modifies the path's origin, so it matches the attachment point of a layer
	forLayer = (layer) ->
		x = layer.x + layer.originX * layer.width
		y = layer.y + layer.originY * layer.height

		unless hasOrigin()
			return Path unshift(instructions, command: 'M', params: [x, y])

		Path(instructions)

	node = null
	length = null
	start = null
	end = null

	if hasOrigin()
		node = Utils.SVG.createElement 'path',
			d: toString()
			fill: 'transparent'

		length = getTotalLength()
		start = pointAtLength(0)
		end = pointAtLength(length)

	# Public
	{ moveTo, lineTo, hlineTo, vlineTo, closePath, curve, curveTo, smoothCurveTo,
		qcurveTo, smoothqCurveTo, arc, thru, pointAtLength,
		elementForDebugRepresentation, start, end, length, node, forLayer, toString }

# Initializers that let you write Path.curve, instead of Path().curve
for method in ['curve', 'arc', 'thru', 'moveTo']
	Path[method] = ((m) -> -> Path()[m].apply(this, arguments))(method)

Path.stringToInstructions = (path) ->
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

	instructions

Path.fromString = (path) ->
	Path(Path.stringToInstructions(path))

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
