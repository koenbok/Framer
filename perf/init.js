;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var FPSTimer, getTime, run, _contextLayer, _run,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

getTime = Date.now;

if (typeof performance !== "undefined" && performance !== null ? performance.now : void 0) {
  getTime = function() {
    return performance.now();
  };
}

FPSTimer = (function() {
  function FPSTimer() {
    this._tick = __bind(this._tick, this);
    this.start();
  }

  FPSTimer.prototype.start = function() {
    this._frameCount = 0;
    this._startTime = getTime();
    return Framer.Loop.on("render", this._tick);
  };

  FPSTimer.prototype.stop = function() {
    var results, time;
    time = getTime() - this._startTime;
    Framer.Loop.off("render", this._tick);
    results = {
      time: time,
      frames: this._frameCount,
      fps: 1000 / (time / this._frameCount)
    };
    return results;
  };

  FPSTimer.prototype._tick = function() {
    return this._frameCount++;
  };

  return FPSTimer;

})();

_contextLayer = new Layer({
  width: 800,
  height: 800,
  backgroundColor: "white"
});

_contextLayer.center();

_contextLayer.style.border = "1px solid grey";

run = function(options, callback) {
  var context;
  context = new Framer.Context({
    name: "TestRun",
    parentLayer: _contextLayer
  });
  return context.run(function() {
    return _run(options, function(results) {
      context.reset();
      return callback(results);
    });
  });
};

_run = function(options, callback) {
  var LAYERS, i, layer, layerC, results, startTime, t1, _i, _len;
  startTime = getTime();
  results = {};
  LAYERS = (function() {
    var _i, _ref, _results;
    _results = [];
    for (i = _i = 1, _ref = options.n; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
      _results.push(layerC = new Layer({
        x: Math.random() * 800,
        y: Math.random() * 800
      }));
    }
    return _results;
  })();
  results.layers = Framer.CurrentContext._layerList.length;
  results.buildTotal = getTime() - startTime;
  results.buildLayer = results.buildTotal / results.layers;
  t1 = new FPSTimer;
  for (_i = 0, _len = LAYERS.length; _i < _len; _i++) {
    layer = LAYERS[_i];
    layer.animate({
      properties: {
        midX: Math.random() * window.innerWidth,
        midY: Math.random() * window.innerHeight
      },
      curve: "linear",
      time: 0.1
    });
  }
  return layer.on(Events.AnimationEnd, function() {
    results.fps = t1.stop();
    return callback(results);
  });
};

Utils.domComplete(function() {
  var c, callback, minFPS, tooSlow, tooSlowMax;
  c = 0;
  minFPS = 50;
  tooSlow = 0;
  tooSlowMax = 2;
  callback = function(results) {
    var output;
    if (results) {
      output = "" + c + " - " + results.layers;
      output += "\tBuild: " + (Utils.round(results.buildTotal, 0)) + "ms /" + (Utils.round(results.buildLayer, 2)) + "ms";
      output += "\tFPS: " + (Utils.round(results.fps.fps, 1));
      console.log(output);
      if (results.fps.fps < minFPS) {
        tooSlow++;
      }
    }
    if (c < 100 && tooSlow < tooSlowMax) {
      c++;
      return run({
        n: c * 20
      }, callback);
    } else {
      return window.phantomComplete = true;
    }
  };
  return callback();
});


},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rb2VuL0RvY3VtZW50cy9Qcm9qZWN0cy9GcmFtZXIzL3BlcmYvaW5pdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsdUNBQUE7R0FBQSwrRUFBQTs7QUFBQSxDQUFBLEVBQVUsQ0FBSSxHQUFkOztBQUVBLENBQUEsRUFBRyxHQUFILEtBQWM7Q0FDYixDQUFBLENBQVUsSUFBVixFQUFVO0NBQWUsRUFBWixRQUFBO0NBQWIsRUFBVTtFQUhYOztBQVVNLENBVk47Q0FZYyxDQUFBLENBQUEsZUFBQTtDQUFHLG9DQUFBO0NBQUEsR0FBQSxDQUFBO0NBQWhCLEVBQWE7O0NBQWIsRUFFTyxFQUFQLElBQU87Q0FDTixFQUFlLENBQWYsT0FBQTtDQUFBLEVBQ2MsQ0FBZCxHQUFjLEdBQWQ7Q0FFTyxDQUFQLEVBQVcsQ0FBWCxDQUFNLEVBQU4sR0FBQTtDQU5ELEVBRU87O0NBRlAsRUFRTSxDQUFOLEtBQU07Q0FFTCxPQUFBLEtBQUE7Q0FBQSxFQUFPLENBQVAsR0FBTyxHQUFQO0NBQUEsQ0FFMEIsQ0FBMUIsQ0FBQSxDQUFBLENBQU0sRUFBTjtDQUZBLEVBS0MsQ0FERCxHQUFBO0NBQ0MsQ0FBTSxFQUFOLEVBQUE7Q0FBQSxDQUNRLEVBQUMsRUFBVCxLQURBO0NBQUEsQ0FFSyxDQUFMLENBQUssRUFBTCxLQUFZO0NBUGIsS0FBQTtDQVNBLE1BQUEsSUFBTztDQW5CUixFQVFNOztDQVJOLEVBcUJPLEVBQVAsSUFBTztBQUNOLENBQUMsR0FBQSxPQUFEO0NBdEJELEVBcUJPOztDQXJCUDs7Q0FaRDs7QUFvQ0EsQ0FwQ0EsRUFvQ29CLENBQUEsQ0FBQSxRQUFwQjtDQUEwQixDQUFBLENBQUEsRUFBQTtDQUFBLENBQVcsQ0FBWCxHQUFXO0NBQVgsQ0FBdUIsS0FBdkIsUUFBdUI7Q0FwQ2pELENBb0NvQjs7QUFDcEIsQ0FyQ0EsS0FxQ0EsT0FBYTs7QUFDYixDQXRDQSxFQXNDNkIsRUFBVixDQUFuQixPQUFhLEdBdENiOztBQXdDQSxDQXhDQSxDQXdDZ0IsQ0FBaEIsSUFBTSxDQUFBLENBQUM7Q0FFTixLQUFBLENBQUE7Q0FBQSxDQUFBLENBQWMsQ0FBQSxFQUFNLENBQXBCO0NBQTZCLENBQUssRUFBTCxLQUFBO0NBQUEsQ0FBNEIsRUFBWixPQUFBLEVBQWhCO0NBQTdCLEdBQWM7Q0FDTixFQUFSLElBQU8sRUFBUDtDQUFvQixDQUFTLENBQUEsQ0FBZCxHQUFBLEVBQWUsRUFBZjtDQUNkLElBQUEsQ0FBQSxDQUFPO0NBQ0UsTUFBVCxDQUFBLEtBQUE7Q0FGYyxJQUFjO0NBQTdCLEVBQVk7Q0FIUDs7QUFPTixDQS9DQSxDQStDaUIsQ0FBVixDQUFQLEdBQU8sQ0FBQSxDQUFDO0NBRVAsS0FBQSxvREFBQTtDQUFBLENBQUEsQ0FBWSxJQUFBLEVBQVo7Q0FBQSxDQUNBLENBQVUsSUFBVjtDQURBLENBR0EsSUFBQTs7QUFBUyxDQUFBO0dBQUEsT0FBUyxvRkFBVDtDQUVSLEVBQWEsQ0FBQSxDQUFBLENBQWI7Q0FDQyxDQUFHLENBQWdCLENBQVosRUFBSixFQUFIO0NBQUEsQ0FDRyxDQUFnQixDQUFaLEVBQUosRUFBSDtDQUZELE9BQWE7Q0FGTDs7Q0FIVDtDQUFBLENBU0EsQ0FBaUIsR0FBakIsQ0FBTyxHQUEwQyxJQUFYO0NBVHRDLENBVUEsQ0FBcUIsSUFBZCxFQVZQLENBVUE7Q0FWQSxDQVdBLENBQXFCLEdBWHJCLENBV08sR0FBUDtBQUVLLENBYkwsQ0FhQSxDQUFLLEtBYkw7QUFlQSxDQUFBLE1BQUEsc0NBQUE7d0JBQUE7Q0FFQyxHQUFBLENBQUssRUFBTDtDQUNDLENBQ0MsSUFERCxJQUFBO0NBQ0MsQ0FBTSxDQUFnQixDQUF0QixFQUFNLEVBQU4sRUFBQTtDQUFBLENBQ00sQ0FBZ0IsQ0FBdEIsRUFBTSxFQUFOLEdBREE7UUFERDtDQUFBLENBR08sR0FBUCxDQUFBLEVBSEE7Q0FBQSxDQUlNLENBSk4sQ0FJQSxFQUFBO0NBTEQsS0FBQTtDQUZELEVBZkE7Q0F3Qk0sQ0FBTixDQUE4QixFQUF6QixDQUFVLEdBQWYsR0FBQTtDQUNDLENBQWdCLENBQWhCLENBQUEsR0FBTztDQUNFLE1BQVQsQ0FBQSxHQUFBO0NBRkQsRUFBOEI7Q0ExQnhCOztBQThCUCxDQTdFQSxFQTZFa0IsRUFBYixJQUFhLEVBQWxCO0NBRUMsS0FBQSxrQ0FBQTtDQUFBLENBQUEsQ0FBSTtDQUFKLENBRUEsQ0FBUyxHQUFUO0NBRkEsQ0FHQSxDQUFVLElBQVY7Q0FIQSxDQUlBLENBQWEsT0FBYjtDQUpBLENBTUEsQ0FBVyxJQUFBLENBQVgsQ0FBWTtDQUVYLEtBQUEsRUFBQTtDQUFBLEdBQUEsR0FBQTtDQUVDLENBQVUsQ0FBQSxFQUFBLENBQVYsQ0FBMEI7Q0FBMUIsQ0FDcUQsQ0FBaEMsQ0FBVixDQUFlLENBQTFCLENBQXdDLEdBQW5CLENBQVY7Q0FEWCxDQUVnRCxDQUE3QixDQUFSLENBQWEsQ0FBeEIsQ0FBc0MsRUFBM0I7Q0FGWCxFQUlBLEdBQUEsQ0FBTztDQUVQLEVBQWMsQ0FBWCxFQUFILENBQVU7QUFDVCxDQUFBLENBQUEsS0FBQSxDQUFBO1FBVEY7TUFBQTtDQVdBLEVBQU8sQ0FBUCxHQUFlLEdBQWY7QUFDQyxDQUFBLENBQUEsSUFBQTtDQUNJLEVBQUosVUFBQTtDQUFJLENBQUksQ0FBSSxLQUFQO0NBRk4sQ0FFa0IsTUFBakI7TUFGRDtDQUlRLEVBQWtCLEdBQW5CLE9BQU4sRUFBQTtNQWpCUztDQU5YLEVBTVc7Q0FtQlgsT0FBQSxDQUFBO0NBM0JpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiZ2V0VGltZSA9IERhdGUubm93XG5cbmlmIHBlcmZvcm1hbmNlPy5ub3dcblx0Z2V0VGltZSA9IC0+IHBlcmZvcm1hbmNlLm5vdygpXG5cbiMgY2xhc3MgVGltZXJcbiMgXHRjb25zdHJ1Y3RvcjogLT4gQHN0YXJ0KClcbiMgXHRzdGFydDogLT4gQF9zdGFydFRpbWUgPSBnZXRUaW1lKClcbiMgXHRzdG9wOiAgLT4gZ2V0VGltZSgpIC0gQF9zdGFydFRpbWVcblxuY2xhc3MgRlBTVGltZXJcblxuXHRjb25zdHJ1Y3RvcjogLT4gQHN0YXJ0KClcblxuXHRzdGFydDogLT5cblx0XHRAX2ZyYW1lQ291bnQgPSAwXG5cdFx0QF9zdGFydFRpbWUgPSBnZXRUaW1lKClcblxuXHRcdEZyYW1lci5Mb29wLm9uKFwicmVuZGVyXCIsIEBfdGljaylcblxuXHRzdG9wOiAtPlxuXG5cdFx0dGltZSA9IGdldFRpbWUoKSAtIEBfc3RhcnRUaW1lXG5cblx0XHRGcmFtZXIuTG9vcC5vZmYoXCJyZW5kZXJcIiwgQF90aWNrKVxuXHRcdFxuXHRcdHJlc3VsdHMgPVxuXHRcdFx0dGltZTogdGltZVxuXHRcdFx0ZnJhbWVzOiBAX2ZyYW1lQ291bnRcblx0XHRcdGZwczogMTAwMCAvICh0aW1lIC8gQF9mcmFtZUNvdW50KVxuXG5cdFx0cmV0dXJuIHJlc3VsdHNcblxuXHRfdGljazogPT5cblx0XHRAX2ZyYW1lQ291bnQrK1xuXG5fY29udGV4dExheWVyID0gbmV3IExheWVyIHdpZHRoOjgwMCwgaGVpZ2h0OjgwMCwgYmFja2dyb3VuZENvbG9yOlwid2hpdGVcIlxuX2NvbnRleHRMYXllci5jZW50ZXIoKVxuX2NvbnRleHRMYXllci5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZCBncmV5XCJcblxucnVuID0gKG9wdGlvbnMsIGNhbGxiYWNrKSAtPlxuXHRcblx0Y29udGV4dCA9IG5ldyBGcmFtZXIuQ29udGV4dChuYW1lOlwiVGVzdFJ1blwiLCBwYXJlbnRMYXllcjpfY29udGV4dExheWVyKVxuXHRjb250ZXh0LnJ1biAtPiBfcnVuIG9wdGlvbnMsIChyZXN1bHRzKSAtPlxuXHRcdGNvbnRleHQucmVzZXQoKVxuXHRcdGNhbGxiYWNrKHJlc3VsdHMpXG5cbl9ydW4gPSAob3B0aW9ucywgY2FsbGJhY2spIC0+XG5cblx0c3RhcnRUaW1lID0gZ2V0VGltZSgpXG5cdHJlc3VsdHMgPSB7fVxuXG5cdExBWUVSUyA9IGZvciBpIGluIFsxLi5vcHRpb25zLm5dXG5cblx0XHRsYXllckMgPSBuZXcgTGF5ZXIgXG5cdFx0XHR4OiBNYXRoLnJhbmRvbSgpICogODAwLCBcblx0XHRcdHk6IE1hdGgucmFuZG9tKCkgKiA4MDBcblx0XG5cdHJlc3VsdHMubGF5ZXJzID0gRnJhbWVyLkN1cnJlbnRDb250ZXh0Ll9sYXllckxpc3QubGVuZ3RoXG5cdHJlc3VsdHMuYnVpbGRUb3RhbCA9IGdldFRpbWUoKSAtIHN0YXJ0VGltZVxuXHRyZXN1bHRzLmJ1aWxkTGF5ZXIgPSByZXN1bHRzLmJ1aWxkVG90YWwgLyByZXN1bHRzLmxheWVyc1xuXG5cdHQxID0gbmV3IEZQU1RpbWVyXG5cblx0Zm9yIGxheWVyIGluIExBWUVSU1xuXHRcdFxuXHRcdGxheWVyLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG1pZFg6IE1hdGgucmFuZG9tKCkgKiB3aW5kb3cuaW5uZXJXaWR0aCwgXG5cdFx0XHRcdG1pZFk6IE1hdGgucmFuZG9tKCkgKiB3aW5kb3cuaW5uZXJIZWlnaHRcblx0XHRcdGN1cnZlOiBcImxpbmVhclwiXG5cdFx0XHR0aW1lOiAwLjFcblxuXHRsYXllci5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCAtPlxuXHRcdHJlc3VsdHMuZnBzID0gdDEuc3RvcCgpXG5cdFx0Y2FsbGJhY2socmVzdWx0cylcblxuVXRpbHMuZG9tQ29tcGxldGUgLT5cblxuXHRjID0gMFxuXG5cdG1pbkZQUyA9IDUwXG5cdHRvb1Nsb3cgPSAwXG5cdHRvb1Nsb3dNYXggPSAyXG5cblx0Y2FsbGJhY2sgPSAocmVzdWx0cykgLT5cblxuXHRcdGlmIHJlc3VsdHNcblxuXHRcdFx0b3V0cHV0ID0gIFwiI3tjfSAtICN7cmVzdWx0cy5sYXllcnN9XCJcblx0XHRcdG91dHB1dCArPSBcIlxcdEJ1aWxkOiAje1V0aWxzLnJvdW5kKHJlc3VsdHMuYnVpbGRUb3RhbCwgMCl9bXMgLyN7VXRpbHMucm91bmQocmVzdWx0cy5idWlsZExheWVyLCAyKX1tc1wiXG5cdFx0XHRvdXRwdXQgKz0gXCJcXHRGUFM6ICN7VXRpbHMucm91bmQocmVzdWx0cy5mcHMuZnBzLCAxKX1cIlxuXG5cdFx0XHRjb25zb2xlLmxvZyBvdXRwdXRcblxuXHRcdFx0aWYgcmVzdWx0cy5mcHMuZnBzIDwgbWluRlBTXG5cdFx0XHRcdHRvb1Nsb3crK1xuXG5cdFx0aWYgYyA8IDEwMCBhbmQgdG9vU2xvdyA8IHRvb1Nsb3dNYXhcblx0XHRcdGMrK1xuXHRcdFx0cnVuIHtuOiBjICogMjB9LCBjYWxsYmFja1xuXHRcdGVsc2Vcblx0XHRcdHdpbmRvdy5waGFudG9tQ29tcGxldGUgPSB0cnVlXG5cblx0Y2FsbGJhY2soKVxuXG5cblxuXG4iXX0=
;