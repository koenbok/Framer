{createSVGElement} = require "./Utils"

class exports.SVGPathProxy
  constructor: (string) ->
    @node = createSVGElement "path",
      d: string
      fill: "transparent"

    @length = @getTotalLength()
    @start = @getPointAtLength(0)
    @end = @getPointAtLength(@length)

  getPointAtLength: (length) ->
    @node.getPointAtLength(length)

  getTotalLength: ->
    @node.getTotalLength()
