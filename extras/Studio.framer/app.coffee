rk4 = new Framer.SpringRK4Animator	
	tension: 1
	friction: 0
	velocity: 0
	tolerance: 1/10000
	
#Draw a stupid graph

Defaults =
	colors:
        curveWidgetLine: "#999999"
        curveWidgetAxis: "#292929"
        curveWidgetBackground: "#1E1E1E"
class Curve extends Layer

  constructor: (options = {}) ->
    super _.defaults options,
      backgroundColor:        Defaults.colors.curveWidgetBackground
      width:                  120
      height:                 120
      x: 90
      y: 20
      borderRadius:           2
      borderWidth:            1
      borderColor:            Defaults.colors.textInputBorder
      style:
        "box-sizing":       "border-box"

    @canvasSize = @width
    @factor = options.factor ? 1
    #Lines
    @xLine = new Layer
      backgroundColor: Defaults.colors.curveWidgetAxis
      height: 1
      width: @canvasSize-2*@borderWidth
      parent: @

    @xLine.centerY()

    @yLine = new Layer
      backgroundColor: Defaults.colors.curveWidgetAxis
      width: 1
      height: @canvasSize-2*@borderWidth
      parent: @

    @yLine.centerX()

    @canvasLayer = new Layer
      width:@width
      height:@height
      parent:@
      backgroundColor:null

    # Start canvas drawing
    @canvas = document.createElement("canvas")

    # For 2x
    @canvas.width = @canvasSize * 2
    @canvas.height = @canvasSize * 2
    @canvas.style.width = "#{@canvasSize}px"
    @canvas.style.height = "#{@canvasSize}px"

    # Append Canvas
    @canvasLayer._element.appendChild(@canvas)
    @ctx = @canvas.getContext("2d")
    @ctx.scale(2, 2)

    # Style
    @ctx.strokeStyle = Defaults.colors.curveWidgetLine
    @ctx.lineWidth = 1

    # Values
    @values = 0
    @animator = new Framer.LinearAnimator
    @render()



  # Set-up
  render: ->
    @values = @animator.values(1/120,200)
    @ctx.clearRect(0, 0, @width, @height)
    @ctx.beginPath()

    adjustedValues = []
    values = @values

    for index, value of values
      previous = values[index - 1] * (@canvasSize / 2)
      current = values[index] * (@canvasSize / 2)
      delta = previous - current

      if Math.abs(delta) > 0.01
        adjustedValues.push(value)

    for index, value of adjustedValues
      l = adjustedValues.length
      i = index
      x = parseInt(i) * (@canvasSize / (l))
      y = (1-(value * @factor)) * @canvasSize

      @ctx.lineTo(x, y)

    @ctx.stroke()

curve = new Curve
	width: 500
	height: 500
curve.center()
curve.factor = 0.5
curve.animator = rk4
curve.render()
