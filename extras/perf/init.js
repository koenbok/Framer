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
  var allResults, c, callback, minFPS, tooSlow, tooSlowMax;
  c = 0;
  allResults = [];
  minFPS = 50;
  tooSlow = 0;
  tooSlowMax = 2;
  callback = function(results) {
    var buildTotal, layerTotal, output;
    if (results) {
      allResults.push(results);
      output = "" + c + " - " + results.layers;
      output += "\tBuild: " + (Utils.round(results.buildTotal, 0)) + "ms /" + (Utils.round(results.buildLayer, 2)) + "ms";
      output += "\tFPS: " + (Utils.round(results.fps.fps, 1));
      console.log(output);
      if (results.fps.fps < minFPS) {
        tooSlow++;
      }
    }
    if (c < 30 && tooSlow < tooSlowMax) {
      c++;
      return run({
        n: c * 20
      }, callback);
    } else {
      buildTotal = Utils.round(Utils.average(_.map(allResults, function(i) {
        return i.buildLayer;
      })), 3) * 1000;
      layerTotal = Utils.round(Utils.average(_.map(allResults, function(i) {
        return i.fps.fps / i.layers;
      })), 3) * 1000;
      print("" + buildTotal + " (build)");
      print("" + layerTotal + " (layer)");
      if (buildTotal > 440) {
        print("BUILD LOOKS SLOW > 440");
      }
      if (layerTotal > 760) {
        print("LAYER LOOKS SLOW > 760");
      }
      return window.phantomComplete = true;
    }
  };
  return callback();
});


},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rb2VuL0RvY3VtZW50cy9Qcm9qZWN0cy9GcmFtZXIzL3BlcmYvaW5pdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsdUNBQUE7R0FBQSwrRUFBQTs7QUFBQSxDQUFBLEVBQVUsQ0FBSSxHQUFkOztBQUVBLENBQUEsRUFBRyxHQUFILEtBQWM7Q0FDYixDQUFBLENBQVUsSUFBVixFQUFVO0NBQWUsRUFBWixRQUFBO0NBQWIsRUFBVTtFQUhYOztBQVVNLENBVk47Q0FZYyxDQUFBLENBQUEsZUFBQTtDQUFHLG9DQUFBO0NBQUEsR0FBQSxDQUFBO0NBQWhCLEVBQWE7O0NBQWIsRUFFTyxFQUFQLElBQU87Q0FDTixFQUFlLENBQWYsT0FBQTtDQUFBLEVBQ2MsQ0FBZCxHQUFjLEdBQWQ7Q0FFTyxDQUFQLEVBQVcsQ0FBWCxDQUFNLEVBQU4sR0FBQTtDQU5ELEVBRU87O0NBRlAsRUFRTSxDQUFOLEtBQU07Q0FFTCxPQUFBLEtBQUE7Q0FBQSxFQUFPLENBQVAsR0FBTyxHQUFQO0NBQUEsQ0FFMEIsQ0FBMUIsQ0FBQSxDQUFBLENBQU0sRUFBTjtDQUZBLEVBS0MsQ0FERCxHQUFBO0NBQ0MsQ0FBTSxFQUFOLEVBQUE7Q0FBQSxDQUNRLEVBQUMsRUFBVCxLQURBO0NBQUEsQ0FFSyxDQUFMLENBQUssRUFBTCxLQUFZO0NBUGIsS0FBQTtDQVNBLE1BQUEsSUFBTztDQW5CUixFQVFNOztDQVJOLEVBcUJPLEVBQVAsSUFBTztBQUNOLENBQUMsR0FBQSxPQUFEO0NBdEJELEVBcUJPOztDQXJCUDs7Q0FaRDs7QUFvQ0EsQ0FwQ0EsRUFvQ29CLENBQUEsQ0FBQSxRQUFwQjtDQUEwQixDQUFBLENBQUEsRUFBQTtDQUFBLENBQVcsQ0FBWCxHQUFXO0NBQVgsQ0FBdUIsS0FBdkIsUUFBdUI7Q0FwQ2pELENBb0NvQjs7QUFDcEIsQ0FyQ0EsS0FxQ0EsT0FBYTs7QUFDYixDQXRDQSxFQXNDNkIsRUFBVixDQUFuQixPQUFhLEdBdENiOztBQXdD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UUFOQTtDQU9BLEVBQStDLENBQWIsRUFBbEMsSUFBa0M7Q0FBbEMsSUFBQSxHQUFBLGdCQUFBO1FBUEE7Q0FTTyxFQUFrQixHQUFuQixPQUFOLEVBQUE7TUE5QlM7Q0FSWCxFQVFXO0NBZ0NYLE9BQUEsQ0FBQTtDQTFDaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbImdldFRpbWUgPSBEYXRlLm5vd1xuXG5pZiBwZXJmb3JtYW5jZT8ubm93XG5cdGdldFRpbWUgPSAtPiBwZXJmb3JtYW5jZS5ub3coKVxuXG4jIGNsYXNzIFRpbWVyXG4jIFx0Y29uc3RydWN0b3I6IC0+IEBzdGFydCgpXG4jIFx0c3RhcnQ6IC0+IEBfc3RhcnRUaW1lID0gZ2V0VGltZSgpXG4jIFx0c3RvcDogIC0+IGdldFRpbWUoKSAtIEBfc3RhcnRUaW1lXG5cbmNsYXNzIEZQU1RpbWVyXG5cblx0Y29uc3RydWN0b3I6IC0+IEBzdGFydCgpXG5cblx0c3RhcnQ6IC0+XG5cdFx0QF9mcmFtZUNvdW50ID0gMFxuXHRcdEBfc3RhcnRUaW1lID0gZ2V0VGltZSgpXG5cblx0XHRGcmFtZXIuTG9vcC5vbihcInJlbmRlclwiLCBAX3RpY2spXG5cblx0c3RvcDogLT5cblxuXHRcdHRpbWUgPSBnZXRUaW1lKCkgLSBAX3N0YXJ0VGltZVxuXG5cdFx0RnJhbWVyLkxvb3Aub2ZmKFwicmVuZGVyXCIsIEBfdGljaylcblx0XHRcblx0XHRyZXN1bHRzID1cblx0XHRcdHRpbWU6IHRpbWVcblx0XHRcdGZyYW1lczogQF9mcmFtZUNvdW50XG5cdFx0XHRmcHM6IDEwMDAgLyAodGltZSAvIEBfZnJhbWVDb3VudClcblxuXHRcdHJldHVybiByZXN1bHRzXG5cblx0X3RpY2s6ID0+XG5cdFx0QF9mcmFtZUNvdW50KytcblxuX2NvbnRleHRMYXllciA9IG5ldyBMYXllciB3aWR0aDo4MDAsIGhlaWdodDo4MDAsIGJhY2tncm91bmRDb2xvcjpcIndoaXRlXCJcbl9jb250ZXh0TGF5ZXIuY2VudGVyKClcbl9jb250ZXh0TGF5ZXIuc3R5bGUuYm9yZGVyID0gXCIxcHggc29saWQgZ3JleVwiXG5cbnJ1biA9IChvcHRpb25zLCBjYWxsYmFjaykgLT5cblx0XG5cdGNvbnRleHQgPSBuZXcgRnJhbWVyLkNvbnRleHQobmFtZTpcIlRlc3RSdW5cIiwgcGFyZW50TGF5ZXI6X2NvbnRleHRMYXllcilcblx0Y29udGV4dC5ydW4gLT4gX3J1biBvcHRpb25zLCAocmVzdWx0cykgLT5cblx0XHRjb250ZXh0LnJlc2V0KClcblx0XHRjYWxsYmFjayhyZXN1bHRzKVxuXG5fcnVuID0gKG9wdGlvbnMsIGNhbGxiYWNrKSAtPlxuXG5cdHN0YXJ0VGltZSA9IGdldFRpbWUoKVxuXHRyZXN1bHRzID0ge31cblxuXHRMQVlFUlMgPSBmb3IgaSBpbiBbMS4ub3B0aW9ucy5uXVxuXG5cdFx0bGF5ZXJDID0gbmV3IExheWVyIFxuXHRcdFx0eDogTWF0aC5yYW5kb20oKSAqIDgwMCwgXG5cdFx0XHR5OiBNYXRoLnJhbmRvbSgpICogODAwXG5cdFxuXHRyZXN1bHRzLmxheWVycyA9IEZyYW1lci5DdXJyZW50Q29udGV4dC5fbGF5ZXJMaXN0Lmxlbmd0aFxuXHRyZXN1bHRzLmJ1aWxkVG90YWwgPSBnZXRUaW1lKCkgLSBzdGFydFRpbWVcblx0cmVzdWx0cy5idWlsZExheWVyID0gcmVzdWx0cy5idWlsZFRvdGFsIC8gcmVzdWx0cy5sYXllcnNcblxuXHR0MSA9IG5ldyBGUFNUaW1lclxuXG5cdGZvciBsYXllciBpbiBMQVlFUlNcblx0XHRcblx0XHRsYXllci5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRtaWRYOiBNYXRoLnJhbmRvbSgpICogd2luZG93LmlubmVyV2lkdGgsIFxuXHRcdFx0XHRtaWRZOiBNYXRoLnJhbmRvbSgpICogd2luZG93LmlubmVySGVpZ2h0XG5cdFx0XHRjdXJ2ZTogXCJsaW5lYXJcIlxuXHRcdFx0dGltZTogMC4xXG5cblx0bGF5ZXIub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgLT5cblx0XHRyZXN1bHRzLmZwcyA9IHQxLnN0b3AoKVxuXHRcdGNhbGxiYWNrKHJlc3VsdHMpXG5cblV0aWxzLmRvbUNvbXBsZXRlIC0+XG5cblx0YyA9IDBcblxuXHRhbGxSZXN1bHRzID0gW11cblxuXHRtaW5GUFMgPSA1MFxuXHR0b29TbG93ID0gMFxuXHR0b29TbG93TWF4ID0gMlxuXG5cdGNhbGxiYWNrID0gKHJlc3VsdHMpIC0+XG5cblx0XHRpZiByZXN1bHRzXG5cblx0XHRcdGFsbFJlc3VsdHMucHVzaChyZXN1bHRzKVxuXG5cdFx0XHRvdXRwdXQgPSAgXCIje2N9IC0gI3tyZXN1bHRzLmxheWVyc31cIlxuXHRcdFx0b3V0cHV0ICs9IFwiXFx0QnVpbGQ6ICN7VXRpbHMucm91bmQocmVzdWx0cy5idWlsZFRvdGFsLCAwKX1tcyAvI3tVdGlscy5yb3VuZChyZXN1bHRzLmJ1aWxkTGF5ZXIsIDIpfW1zXCJcblx0XHRcdG91dHB1dCArPSBcIlxcdEZQUzogI3tVdGlscy5yb3VuZChyZXN1bHRzLmZwcy5mcHMsIDEpfVwiXG5cblx0XHRcdGNvbnNvbGUubG9nIG91dHB1dFxuXG5cdFx0XHRpZiByZXN1bHRzLmZwcy5mcHMgPCBtaW5GUFNcblx0XHRcdFx0dG9vU2xvdysrXG5cblx0XHQjIGlmIGMgPCAxMDAgYW5kIHRvb1Nsb3cgPCB0b29TbG93TWF4XG5cdFx0aWYgYyA8IDMwIGFuZCB0b29TbG93IDwgdG9vU2xvd01heFxuXHRcdFx0YysrXG5cdFx0XHRydW4ge246IGMgKiAyMH0sIGNhbGxiYWNrXG5cdFx0ZWxzZVxuXG5cdFx0XHRidWlsZFRvdGFsID0gVXRpbHMucm91bmQoVXRpbHMuYXZlcmFnZShfLm1hcChhbGxSZXN1bHRzLCAoaSkgLT4gaS5idWlsZExheWVyKSksIDMpICogMTAwMFxuXHRcdFx0bGF5ZXJUb3RhbCA9IFV0aWxzLnJvdW5kKFV0aWxzLmF2ZXJhZ2UoXy5tYXAoYWxsUmVzdWx0cywgKGkpIC0+IGkuZnBzLmZwcyAvIGkubGF5ZXJzKSksIDMpICogMTAwMFxuXG5cdFx0XHRwcmludCBcIiN7YnVpbGRUb3RhbH0gKGJ1aWxkKVwiXG5cdFx0XHRwcmludCBcIiN7bGF5ZXJUb3RhbH0gKGxheWVyKVwiXG5cblx0XHRcdHByaW50IFwiQlVJTEQgTE9PS1MgU0xPVyA+IDQ0MFwiIGlmIGJ1aWxkVG90YWwgPiA0NDAgXG5cdFx0XHRwcmludCBcIkxBWUVSIExPT0tTIFNMT1cgPiA3NjBcIiBpZiBsYXllclRvdGFsID4gNzYwIFxuXG5cdFx0XHR3aW5kb3cucGhhbnRvbUNvbXBsZXRlID0gdHJ1ZVxuXG5cdGNhbGxiYWNrKClcblxuXG5cblxuIl19
;