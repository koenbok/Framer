# Framer.Device = new Framer.DeviceView()
# Framer.Device.setupContext()

# Example 1 - Buy Button
# container = new Layer width: 640, height: 1136, backgroundColor: '#fff', scroll: true
# list = new Layer width: container.width, backgroundColor: '#fff', height: 42 * 88, superLayer: container
# header = new Layer width: container.width, height: 128, backgroundColor: 'rgba(255, 255, 255, 0.95)'
# header.style.borderBottom = '1px solid #C8C7CC'
# tabs = new Layer width: container.width, height: 98, y: container.height - 98, backgroundColor: 'rgba(255, 255, 255, 0.95)'
# tabs.style.borderTop = '1px solid #C8C7CC'
#
# items = for i in [0..42]
#   item = new Layer width: list.width - 50, height: 88, x: 50, y: header.maxY + i * 88, superLayer: list, backgroundColor: '#fff'
#   item.style =
#     'border-bottom': '1px solid #C8C7CC'
#     'font': '28px/88px "Helvetica Neue", sans-serif'
#
#   button = new Layer width: 140, height: 50, x: container.width - 140 - 50, y: 19, superLayer: item, borderRadius: 6, backgroundColor: '#fff'
#   button.html = 'BUY'
#   button.style =
#     'font': '22px/50px "Helvetica Neue", sans-serif'
#     'letter-spacing': '1px'
#     'text-align': 'center'
#     color: '#037AFF'
#     border: '2px solid #037AFF'
#
#   item.html = "Item #{i}"
#
#   button.on Events.Click, (event) ->
#     frame = @screenFrame
#     ghost = new Layer width: 50, height: 50, x: frame.x + 50, y: frame.y - 50
#     ghost.animate
#       properties:
#         opacity: 0
#         rotationZ: -60
#       path: Path.curve(from: { x: ghost.midX, y: ghost.midY }, to: { x: container.width / 2, y: container.height }, control1: { x: ghost.x - 150, y: ghost.y - 200 })
#       pathOptions: { autoRotate: false }
#       debug: false
#       curve: 'ease-out'
#       time: 1
#
#   item

# Example 2 - Avatar Transition
# container = new Layer width: 640, height: 1136, backgroundColor: '#fff', scroll: true
# list = new Layer width: container.width, backgroundColor: '#fff', height: 42 * 88, superLayer: container
# header = new Layer width: container.width, height: 128, backgroundColor: 'rgba(255, 255, 255, 0.95)'
# header.style.borderBottom = '1px solid #C8C7CC'
# tabs = new Layer width: container.width, height: 98, y: container.height - 98, backgroundColor: 'rgba(255, 255, 255, 0.95)'
# tabs.style.borderTop = '1px solid #C8C7CC'
#
# details = new Layer width: container.width, height: container.height, backgroundColor: '#fff', y: container.height
# details.html = "<h1>Koen Bok</h1>"
#
# items = for i in [0..42]
#   item = new Layer width: list.width - 120, height: 88, x: 120, y: header.maxY + i * 88, superLayer: list, backgroundColor: '#fff'
#   item.clip = false
#   item.style =
#     'border-bottom': '1px solid #C8C7CC'
#     'font': '28px/88px "Helvetica Neue", sans-serif'
#
#   avatar = new Layer width: 76, height: 76, x: -96, y: 6, superLayer: item, borderRadius: 38, backgroundColor: '#ccc'
#
#   item.html = "Item #{i}"
#
#   avatar.on Events.Click, (event) ->
#     frame = @screenFrame
#     @visible = false
#
#     clone = new Layer width: @width * 2, height: @height * 2, midX: frame.x + frame.width / 2, midY: frame.y + frame.height / 2, backgroundColor: @backgroundColor, borderRadius: @borderRadius * 2, scale: 0.5
#     clone.animate
#       # path: new Path.QuadraticBezierCurve(from: clone, to: { x: container.width / 2, y: 150 }, control: { x: container.width / 2, y: clone.y })
#       path: Path.curve(from: { x: clone.midX, y: clone.midY }, to: { x: container.width / 2, y: 150 }, control1: { x: container.width / 2, y: clone.y })
#       pathOptions: { autoRotate: false }
#       debug: true
#       curve: 'spring(180, 30, 0)'
#       time: 0.5
#
#     clone.animate
#       properties:
#         scale: 1
#       curve: 'spring(180, 40, 0)'
#
#     details.animate
#       properties:
#         y: 0
#       curve: 'spring(180, 25, 0)'
#
#   item

# Example 3 - Flower

petalWidth = 100
petalHeight = 100

numPetals = 10
petals = for i in [0..numPetals-1]
  petal = new Layer width: petalWidth, height: petalHeight, borderRadius: petalWidth / 2, opacity: 0, backgroundColor: Utils.randomColor(.5)
  petal.center()
  petal

unfold = ->
  for petal, i in petals
    angle = (2 * Math.PI / numPetals) * i
    distance = 200
    x = petal.midX - Math.cos(angle) * distance
    y = petal.midY - Math.sin(angle) * distance

    cangle = (2 * Math.PI / numPetals) * (i - 1)
    cx = petal.midX - Math.cos(cangle) * distance
    cy = petal.midY - Math.sin(cangle) * distance

    petal.animate
      properties: { opacity: 1, scale: 1 }
      path: new Path.curve(from: {x: petal.midX, y: petal.midY}, to: {x: x, y: y}, control1: {x: cx, y: cy})
      debug: true
      delay: i * 0.1
      curve: 'spring(180,40,0)'

fold = ->
  for petal, i in petals
    angle = (2 * Math.PI / numPetals) * i
    distance = 200
    x = petal.midX - Math.cos(angle) * distance
    y = petal.midY - Math.sin(angle) * distance

    cangle = (2 * Math.PI / numPetals) * (i - 1)
    cx = petal.midX - Math.cos(cangle) * distance
    cy = petal.midY - Math.sin(cangle) * distance

    petal.animate
      properties: { opacity: 0, x: button.x, y: button.y, scale: 0.5 }
      curve: 'ease-out'
      time: 0.15

toggleFold = Utils.toggle unfold, fold

button = new Layer width: petalWidth, height: petalHeight, borderRadius: petalWidth / 2
button.center()

button.on Events.TouchStart, ->
  button.animate
    properties:
      scale: 0.75
    curve: 'spring(300,30,0)'

button.on Events.TouchEnd, ->
  button.animate
    properties:
      scale: 1
    curve: 'spring(200,10,0)'

button.on Events.Click, ->
  toggleFold()()

# Example 4 - Curve Fitting

# circle = new Layer width: 50, height: 50, borderRadius: 25, x: 200, y: 500
# distance = 200
# circle.animate
#   path: new Path.CubicBezierCurve(
#     from: circle,
#     to: { x: circle.midX + distance, y: circle.midY },
#     control1: { x: circle.midX + distance/4, y: circle.midY - 125 },
#     control2: { x: circle.midX + distance/4*5, y: circle.midY + 225 })
#   debug: true
#   time: 5

# path = Path.fromString('M0,0 c50,20 80,-50 100,200 0,50 140,0 200,0')

# p1 = { x: circle.midX, y: circle.midY }
# p2 = { x: 300, y: 100 }
# p3 = { x: 400, y: 350 }
# p4 = { x: 500, y: 200 }
# p5 = { x: 240, y: 250 }
#
# circle.animate
#   path: Path.thru([p1, p2, p3, p4, p5])
#   debug: true
#   time: 5

# path = Path()
#   .moveTo(x: 20, y: 500)
#   .lineTo(x: 400, y: 500)

# circle = new Layer width: 50, height: 50, borderRadius: 25, x: 200, y: 200
# circle2 = new Layer width: 50, height: 50, borderRadius: 25, x: 400, y: 250
#
# path2 = Path.curve
#   from:     { x: circle.midX, y: circle.midY },
#   to:       { x: circle2.midX, y: circle2.midY },
#   control1: { x: 300, y: 100 },
#   control2: { x: 350, y: 300 }
#
# circle.animate
#   path: path2
#   debug: true
#   time: 5

# circle2 = document.createElement('div')
# circle2.setAttribute('style', 'position: absolute; width: 50px; height: 50px; background: rgba(0, 0, 0, 0.5); border-radius: 25px; top: 200px; left: 200px; z-index: 1000')
#
# Utils.domComplete ->
#   document.body.appendChild(circle2)
#   TweenMax.to circle2, 5,
#     bezier:
#       type: 'cubic'
#       values: [{ x: 0, y: 0}, { x: 0 + distance/4, y: 0 - 125 }, { x: 0 + distance/4*5, y: 0 + 225 }, { x: 0 + distance, y: 0 }]
#       timeResolution: 9
#     ease: Elastic.easeInOut

# layer = new Layer borderRadius: 3, midX: 200, midY: 400
#
# layer.animate
#   path: Path.fromString('M0.99609375,204 L57.9960938,64 L189.996094,175 C189.996094,175 212.996094,5 316.996094,1 C420.996094,-3 516.996094,257 516.996094,257 C516.996094,257 643.996094,254 690.996094,148')
#   # path: Path.fromString('M1,326.996094 C1,326.996094 140,-95.0039062 291,124.996094 C442,344.996094 571,564.996095 721,344.996094 C871,124.996093 702,0.99609375 702,0.99609375 L147,396.996094')
#   debug: true
#   curve: 'ease-in-out'
#   time: 2

# layer2 = new Layer borderRadius: 3, midX: 200, midY: 500, backgroundColor: Utils.randomColor(0.8)
# layer3 = new Layer borderRadius: 3, midX: x2, midY: y2, backgroundColor: Utils.randomColor(0.8)

# layer2.animate
#   path: new Arc(from: layer2, to: { x: x2, y: y2 }, part: 'bottom')
#   debug: true
#   curve: 'ease-out'
#   time: 2

# layer2.animate
#   path: new QuadraticBezierCurve(from: layer2, to: { x: x2, y: y2 }, control: { x: layer2.x - 100, y: layer2.y - 100 })
#   debug: true
#   curve: 'ease-out'
#   time: 2

# layer2.animate
#   path: new Path.CubicBezierCurve(
#     from: layer2,
#     to: { x: x2, y: y2 },
#     control1: { x: layer2.midX - 100, y: layer2.midY - 100 },
#     control2: { x: layer2.x - 100, y: layer2.y - 100 })
#   pathOptions:
#     autoRotate: true
#   debug: true
#   curve: 'ease-out'
#   time: 2

# layer2.animate
#   path: new Path.QuadraticBezierCurve(
#     from: layer2
#     to: { x: x2, y: y2 }
#     control: { x: layer2.x - 100, y: layer2.y - 100 })
#   pathOptions:
#     autoRotate: true
#   debug: true
#   curve: 'ease-out'
#   time: 2
#
# circle.animate
#   path: Path.loadPath('static/path.svg')
#   pathOptions:
#     autoRotate: false
#   debug: true
#   curve: 'spring(20, 10, 0)'
