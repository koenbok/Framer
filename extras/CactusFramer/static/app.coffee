

# linear, ease-in, ease-out
# bezier-curve(a, b, c, d)
# spring(tension, friction, velocity)

# AnimatorClasses =
# 	"linear": LinearAnimator
# 	"bezier-curve": BezierCurveAnimator
# 	"spring-rk4": SpringRK4Animator
# 	"spring-dho": SpringDHOAnimator

# AnimatorClasses["spring"] = AnimatorClasses["spring-rk4"]
# AnimatorClasses["cubic-bezier"] = AnimatorClasses["bezier-curve"]


tests = [
	{curve: "linear"},
	{curve: "linear", time:2},
	{curve: "spring-rk4"},
	{curve: "spring-dho(100,20)"},
	{curve: "cubic-bezier"},
	{curve: "cubic-bezier", curveOptions: "ease-in"},
	{curve: "cubic-bezier", curveOptions: "ease-out"},
	{curve: "cubic-bezier", curveOptions: "ease-in-out"},
	{curve: "cubic-bezier(0.95, 0.05, 0.795, 0.035)"}
	{curve: "cubic-bezier", curveOptions:[0.95, 0.05, 0.795, 0.035]}
]

for options, index in tests

	layer = new Layer
		width:  parseInt window.innerWidth/tests.length
		height: parseInt window.innerWidth/tests.length
		backgroundColor: Utils.randomColor 0.8

	layer.x = index * layer.width

	layer.html = "#{options.curve}<br>#{options.curveOptions or ""}"
	layer.style =
		font: "10px/1.35em Menlo"
		textAlign: "center"
		color: "white"
		paddingTop: "12px"

	options.properties =
		y: parseInt ((window.innerHeight * 0.8) - layer.height)

	layer.animate options