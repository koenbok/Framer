# WebKit implementation found on http://stackoverflow.com/a/11697909

class UnitBezier
	
	epsilon: 1e-6 # Precision
	
	constructor: (p1x, p1y, p2x, p2y) ->

		# pre-calculate the polynomial coefficients
		# First and last control points are implied to be (0,0) and (1.0, 1.0)
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

BezierCurve = (a, b, c, d, time, fps) ->
	
	# console.log "bezier.BezierCurve", a, b, c, d, time, fps
	
	curve = new UnitBezier a, b, c, d
	
	values = []
	steps = (time / 1000) * fps
	
	if steps > 3000
		throw Error "Bezier: too many values"

	for step in [0..steps]
		values.push curve.solve(step/steps) * 100
	
	values

defaults = {}

defaults.Linear = (time, fps) -> 
	BezierCurve 0, 0, 1, 1, time, fps
defaults.Ease = (time, fps) -> 
	BezierCurve .25, .1, .25, 1, time, fps
defaults.EaseIn = (time, fps) -> 
	BezierCurve .42, 0, 1, 1, time, fps
defaults.EaseOut = (time, fps) -> 
	BezierCurve 0, 0, .58, 1, time, fps
defaults.EaseInOut = (time, fps) -> 
	BezierCurve .42, 0, .58, 1, time, fps

exports.defaults = defaults
exports.BezierCurve = BezierCurve

