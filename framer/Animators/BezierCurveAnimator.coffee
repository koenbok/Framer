{Animator} = require "../Animator"

BezierCurveDefaults =
	"linear": [0, 0, 1, 1]
	"ease": [.25, .1, .25, 1]
	"ease-in": [.42, 0, 1, 1]
	"ease-out": [0, 0, .58, 1]
	"ease-in-out": [.42, 0, .58, 1]

class exports.BezierCurveAnimator extends Animator

	setup: (options) ->

		# Input is a one of the named bezier curves
		if _.isString(options) and BezierCurveDefaults.hasOwnProperty options.toLowerCase()
			options = { values: BezierCurveDefaults[options.toLowerCase()] }

		# Input values is one of the named bezier curves
		if options.values and _.isString(options.values) and BezierCurveDefaults.hasOwnProperty options.values.toLowerCase()
			options = { values: BezierCurveDefaults[options.values.toLowerCase()], time: options.time }

		# Input is a single array of 4 values
		if _.isArray(options) and options.length is 4
			options = { values: options }

		@options = _.defaults options,
			values: BezierCurveDefaults["ease-in-out"]
			time: 1
			precision: 1/1000

		@_unitBezier = new UnitBezier \
			@options.values[0],
			@options.values[1],
			@options.values[2],
			@options.values[3],

		@_time = 0


	next: (delta) ->

		@_time += delta

		if @finished()
			return 1

		@_unitBezier.solve @_time / @options.time

	finished: ->
		@_time >= @options.time - @options.precision


# WebKit implementation found on http://stackoverflow.com/a/11697909

class UnitBezier

	epsilon: 1e-6 # Precision

	constructor: (p1x, p1y, p2x, p2y) ->

		# pre-calculate the polynomial coefficients
		# First and last control points are implied to be (0, 0) and (1.0, 1.0)
		@cx = 3.0 * p1x
		@bx = 3.0 * (p2x - p1x) - @cx
		@ax = 1.0 - @cx - @bx
		@cy = 3.0 * p1y
		@by = 3.0 * (p2y - p1y) - @cy
		@ay = 1.0 - @cy - @by

	sampleCurveX: (t) ->
		((@ax * t + @bx) * t + @cx) * t

	sampleCurveY: (t) ->
		((@ay * t + @by) * t + @cy) * t

	sampleCurveDerivativeX: (t) ->
		(3.0 * @ax * t + 2.0 * @bx) * t + @cx

	solveCurveX: (x) ->

		# First try a few iterations of Newton's method -- normally very fast.
		t2 = x
		i = 0

		while i < 8
			x2 = @sampleCurveX(t2) - x
			return t2	if Math.abs(x2) < @epsilon
			d2 = @sampleCurveDerivativeX(t2)
			break	if Math.abs(d2) < @epsilon
			t2 = t2 - x2 / d2
			i++

		# No solution found - use bi-section
		t0 = 0.0
		t1 = 1.0
		t2 = x
		return t0	if t2 < t0
		return t1	if t2 > t1
		while t0 < t1
			x2 = @sampleCurveX(t2)
			return t2	if Math.abs(x2 - x) < @epsilon
			if x > x2
				t0 = t2
			else
				t1 = t2
			t2 = (t1 - t0) * .5 + t0

		# Give up
		t2

	solve: (x) ->
		@sampleCurveY @solveCurveX(x)
