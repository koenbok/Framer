(function() {
  var frames, overLayer;

  frames = [0, 1, 2, 3].map(function() {
    var layer;
    return layer = new Layer({
      x: Utils.mapRange(Math.random(), 0, 1, 0, 500),
      y: Utils.mapRange(Math.random(), 0, 1, 0, 500),
      width: Utils.mapRange(Math.random(), 0, 1, 0, 500),
      height: Utils.mapRange(Math.random(), 0, 1, 0, 500)
    });
  });

  overLayer = new Layer;

  overLayer.backgroundColor = Utils.randomColor(.5);

  overLayer.frame = Utils.frameMerge(frames);

}).call(this);
