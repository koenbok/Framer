;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AnimatorClasses, BezierCurveAnimator, Config, Defaults, EventEmitter, Frame, LinearAnimator, SpringDHOAnimator, SpringRK4Animator, Utils, _, _runningAnimations,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require("./Underscore")._;

Utils = require("./Utils");

Config = require("./Config").Config;

Defaults = require("./Defaults").Defaults;

EventEmitter = require("./EventEmitter").EventEmitter;

Frame = require("./Frame").Frame;

LinearAnimator = require("./Animators/LinearAnimator").LinearAnimator;

BezierCurveAnimator = require("./Animators/BezierCurveAnimator").BezierCurveAnimator;

SpringRK4Animator = require("./Animators/SpringRK4Animator").SpringRK4Animator;

SpringDHOAnimator = require("./Animators/SpringDHOAnimator").SpringDHOAnimator;

AnimatorClasses = {
  "linear": LinearAnimator,
  "bezier-curve": BezierCurveAnimator,
  "spring-rk4": SpringRK4Animator,
  "spring-dho": SpringDHOAnimator
};

AnimatorClasses["spring"] = AnimatorClasses["spring-rk4"];

AnimatorClasses["cubic-bezier"] = AnimatorClasses["bezier-curve"];

_runningAnimations = [];

exports.Animation = (function(_super) {
  __extends(Animation, _super);

  Animation.runningAnimations = function() {
    return _runningAnimations;
  };

  function Animation(options) {
    if (options == null) {
      options = {};
    }
    this.start = __bind(this.start, this);
    options = Defaults.getDefaults("Animation", options);
    Animation.__super__.constructor.call(this, options);
    this.options = Utils.setDefaultProperties(options, {
      layer: null,
      properties: {},
      curve: "linear",
      curveOptions: {},
      time: 1,
      repeat: 0,
      delay: 0,
      debug: true
    });
    if (options.layer === null) {
      console.error("Animation: missing layer");
    }
    if (options.origin) {
      console.warn("Animation.origin: please use layer.originX and layer.originY");
    }
    if (options.properties instanceof Frame) {
      option.properties = option.properties.properties;
    }
    this.options.properties = this._filterAnimatableProperties(this.options.properties);
    this._parseAnimatorOptions();
    this._originalState = this._currentState();
    this._repeatCounter = this.options.repeat;
  }

  Animation.prototype._filterAnimatableProperties = function(properties) {
    var animatableProperties, k, v;
    animatableProperties = {};
    for (k in properties) {
      v = properties[k];
      if (_.isNumber(v)) {
        animatableProperties[k] = v;
      }
    }
    return animatableProperties;
  };

  Animation.prototype._currentState = function() {
    return _.pick(this.options.layer, _.keys(this.options.properties));
  };

  Animation.prototype._animatorClass = function() {
    var animatorClassName, parsedCurve;
    parsedCurve = Utils.parseFunction(this.options.curve);
    animatorClassName = parsedCurve.name.toLowerCase();
    if (AnimatorClasses.hasOwnProperty(animatorClassName)) {
      return AnimatorClasses[animatorClassName];
    }
    return LinearAnimator;
  };

  Animation.prototype._parseAnimatorOptions = function() {
    var animatorClass, i, k, parsedCurve, value, _base, _i, _j, _len, _len1, _ref, _ref1, _results;
    animatorClass = this._animatorClass();
    parsedCurve = Utils.parseFunction(this.options.curve);
    if (animatorClass === LinearAnimator || animatorClass === BezierCurveAnimator) {
      if (_.isString(this.options.curveOptions) || _.isArray(this.options.curveOptions)) {
        this.options.curveOptions = {
          values: this.options.curveOptions
        };
      }
      if ((_base = this.options.curveOptions).time == null) {
        _base.time = this.options.time;
      }
    }
    if (parsedCurve.args.length) {
      if (animatorClass === BezierCurveAnimator) {
        this.options.curveOptions.values = parsedCurve.args.map(function(v) {
          return parseFloat(v) || 0;
        });
      }
      if (animatorClass === SpringRK4Animator) {
        _ref = ["tension", "friction", "velocity"];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          k = _ref[i];
          value = parseFloat(parsedCurve.args[i]);
          if (value) {
            this.options.curveOptions[k] = value;
          }
        }
      }
      if (animatorClass === SpringDHOAnimator) {
        _ref1 = ["stiffness", "damping", "mass", "tolerance"];
        _results = [];
        for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
          k = _ref1[i];
          value = parseFloat(parsedCurve.args[i]);
          if (value) {
            _results.push(this.options.curveOptions[k] = value);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    }
  };

  Animation.prototype.start = function() {
    var AnimatorClass, k, start, stateA, stateB, target, v, _ref,
      _this = this;
    AnimatorClass = this._animatorClass();
    console.debug("Animation.start " + AnimatorClass.name, this.options.curveOptions);
    this._animator = new AnimatorClass(this.options.curveOptions);
    target = this.options.layer;
    stateA = this._currentState();
    stateB = {};
    _ref = this.options.properties;
    for (k in _ref) {
      v = _ref[k];
      if (stateA[k] !== v) {
        stateB[k] = v;
      }
    }
    if (_.isEqual(stateA, stateB)) {
      console.warn("Nothing to animate");
    }
    console.debug("Animation.start");
    for (k in stateB) {
      v = stateB[k];
      console.debug("\t" + k + ": " + stateA[k] + " -> " + stateB[k]);
    }
    this._animator.on("start", function() {
      return _this.emit("start");
    });
    this._animator.on("stop", function() {
      return _this.emit("stop");
    });
    this._animator.on("end", function() {
      return _this.emit("end");
    });
    if (this._repeatCounter > 0) {
      this._animator.on("end", function() {
        for (k in stateA) {
          v = stateA[k];
          target[k] = v;
        }
        _this._repeatCounter--;
        return _this.start();
      });
    }
    this._animator.on("tick", function(value) {
      for (k in stateB) {
        v = stateB[k];
        target[k] = Utils.mapRange(value, 0, 1, stateA[k], stateB[k]);
      }
    });
    start = function() {
      _runningAnimations.push(_this);
      return _this._animator.start();
    };
    if (this.options.delay) {
      return Utils.delay(this.options.delay, start);
    } else {
      return start();
    }
  };

  Animation.prototype.stop = function() {
    this._animator.stop();
    return _runningAnimations = _.without(_runningAnimations, this);
  };

  Animation.prototype.reverse = function() {
    var animation, options;
    options = _.clone(this.options);
    options.properties = this._originalState;
    animation = new Animation(options);
    return animation;
  };

  Animation.prototype.revert = function() {
    return this.reverse();
  };

  Animation.prototype.inverse = function() {
    return this.reverse();
  };

  Animation.prototype.invert = function() {
    return this.reverse();
  };

  Animation.prototype.emit = function(event) {
    Animation.__super__.emit.apply(this, arguments);
    return this.options.layer.emit(event, this);
  };

  return Animation;

})(EventEmitter);


},{"./Animators/BezierCurveAnimator":4,"./Animators/LinearAnimator":5,"./Animators/SpringDHOAnimator":6,"./Animators/SpringRK4Animator":7,"./Config":10,"./Defaults":12,"./EventEmitter":13,"./Frame":15,"./Underscore":22,"./Utils":23}],2:[function(require,module,exports){
var AnimationLoop, AnimationLoopIndexKey, Config, EventEmitter, Utils, _;

_ = require("./Underscore")._;

Utils = require("./Utils");

Config = require("./Config").Config;

EventEmitter = require("./EventEmitter").EventEmitter;

AnimationLoopIndexKey = "_animationLoopIndex";

AnimationLoop = {
  debug: false,
  _animators: [],
  _running: false,
  _frameCounter: 0,
  _sessionTime: 0,
  _start: function() {
    if (AnimationLoop._running) {
      return;
    }
    if (!AnimationLoop._animators.length) {
      return;
    }
    AnimationLoop._running = true;
    AnimationLoop._time = Utils.getTime();
    AnimationLoop._sessionTime = 0;
    return window.requestAnimationFrame(AnimationLoop._tick);
  },
  _stop: function() {
    console.debug("AnimationLoop._stop");
    return AnimationLoop._running = false;
  },
  _tick: function() {
    var animator, delta, removeAnimators, time, _i, _j, _len, _len1, _ref;
    if (!AnimationLoop._animators.length) {
      return AnimationLoop._stop();
    }
    if (AnimationLoop._sessionTime === 0) {
      console.debug("AnimationLoop._start");
    }
    AnimationLoop._frameCounter++;
    time = Utils.getTime();
    delta = time - AnimationLoop._time;
    AnimationLoop._sessionTime += delta;
    removeAnimators = [];
    _ref = AnimationLoop._animators;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      animator = _ref[_i];
      animator.emit("tick", animator.next(delta));
      if (animator.finished()) {
        animator.emit("tick", 1);
        removeAnimators.push(animator);
      }
    }
    AnimationLoop._time = time;
    for (_j = 0, _len1 = removeAnimators.length; _j < _len1; _j++) {
      animator = removeAnimators[_j];
      AnimationLoop.remove(animator);
      animator.emit("end");
    }
    window.requestAnimationFrame(AnimationLoop._tick);
  },
  add: function(animator) {
    if (animator.hasOwnProperty(AnimationLoopIndexKey)) {
      return;
    }
    animator[AnimationLoopIndexKey] = AnimationLoop._animators.push(animator);
    animator.emit("start");
    return AnimationLoop._start();
  },
  remove: function(animator) {
    AnimationLoop._animators = _.without(AnimationLoop._animators, animator);
    return animator.emit("stop");
  }
};

exports.AnimationLoop = AnimationLoop;


},{"./Config":10,"./EventEmitter":13,"./Underscore":22,"./Utils":23}],3:[function(require,module,exports){
var AnimationLoop, Config, EventEmitter, Utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Utils = require("./Utils");

Config = require("./Config").Config;

EventEmitter = require("./EventEmitter").EventEmitter;

AnimationLoop = require("./AnimationLoop").AnimationLoop;

exports.Animator = (function(_super) {
  __extends(Animator, _super);

  "The animator class is a very simple class that\n	- Takes a set of input values at setup({input values})\n	- Emits an output value for progress (0 -> 1) in value(progress)";

  function Animator(options) {
    if (options == null) {
      options = {};
    }
    this.setup(options);
  }

  Animator.prototype.setup = function(options) {
    throw Error("Not implemented");
  };

  Animator.prototype.next = function(delta) {
    throw Error("Not implemented");
  };

  Animator.prototype.finished = function() {
    throw Error("Not implemented");
  };

  Animator.prototype.start = function() {
    return AnimationLoop.add(this);
  };

  Animator.prototype.stop = function() {
    return AnimationLoop.remove(this);
  };

  return Animator;

})(EventEmitter);


},{"./AnimationLoop":2,"./Config":10,"./EventEmitter":13,"./Utils":23}],4:[function(require,module,exports){
var Animator, BezierCurveDefaults, UnitBezier, Utils, _, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require("../Underscore")._;

Utils = require("../Utils");

Animator = require("../Animator").Animator;

BezierCurveDefaults = {
  "linear": [0, 0, 1, 1],
  "ease": [.25, .1, .25, 1],
  "ease-in": [.42, 0, 1, 1],
  "ease-out": [0, 0, .58, 1],
  "ease-in-out": [.42, 0, .58, 1]
};

exports.BezierCurveAnimator = (function(_super) {
  __extends(BezierCurveAnimator, _super);

  function BezierCurveAnimator() {
    _ref = BezierCurveAnimator.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  BezierCurveAnimator.prototype.setup = function(options) {
    if (_.isString(options) && BezierCurveDefaults.hasOwnProperty(options.toLowerCase())) {
      options = {
        values: BezierCurveDefaults[options.toLowerCase()]
      };
    }
    if (options.values && _.isString(options.values) && BezierCurveDefaults.hasOwnProperty(options.values.toLowerCase())) {
      options = {
        values: BezierCurveDefaults[options.values.toLowerCase()],
        time: options.time
      };
    }
    if (_.isArray(options) && options.length === 4) {
      options = {
        values: options
      };
    }
    this.options = Utils.setDefaultProperties(options, {
      values: BezierCurveDefaults["ease-in-out"],
      time: 1
    });
    return this._unitBezier = new UnitBezier(this.options.values[0], this.options.values[1], this.options.values[2], this.options.values[3], this._time = 0);
  };

  BezierCurveAnimator.prototype.next = function(delta) {
    this._time += delta;
    if (this.finished()) {
      return 1;
    }
    return this._unitBezier.solve(this._time / this.options.time);
  };

  BezierCurveAnimator.prototype.finished = function() {
    return this._time >= this.options.time;
  };

  return BezierCurveAnimator;

})(Animator);

UnitBezier = (function() {
  UnitBezier.prototype.epsilon = 1e-6;

  function UnitBezier(p1x, p1y, p2x, p2y) {
    this.cx = 3.0 * p1x;
    this.bx = 3.0 * (p2x - p1x) - this.cx;
    this.ax = 1.0 - this.cx - this.bx;
    this.cy = 3.0 * p1y;
    this.by = 3.0 * (p2y - p1y) - this.cy;
    this.ay = 1.0 - this.cy - this.by;
  }

  UnitBezier.prototype.sampleCurveX = function(t) {
    return ((this.ax * t + this.bx) * t + this.cx) * t;
  };

  UnitBezier.prototype.sampleCurveY = function(t) {
    return ((this.ay * t + this.by) * t + this.cy) * t;
  };

  UnitBezier.prototype.sampleCurveDerivativeX = function(t) {
    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
  };

  UnitBezier.prototype.solveCurveX = function(x) {
    var d2, i, t0, t1, t2, x2;
    t2 = x;
    i = 0;
    while (i < 8) {
      x2 = this.sampleCurveX(t2) - x;
      if (Math.abs(x2) < this.epsilon) {
        return t2;
      }
      d2 = this.sampleCurveDerivativeX(t2);
      if (Math.abs(d2) < this.epsilon) {
        break;
      }
      t2 = t2 - x2 / d2;
      i++;
    }
    t0 = 0.0;
    t1 = 1.0;
    t2 = x;
    if (t2 < t0) {
      return t0;
    }
    if (t2 > t1) {
      return t1;
    }
    while (t0 < t1) {
      x2 = this.sampleCurveX(t2);
      if (Math.abs(x2 - x) < this.epsilon) {
        return t2;
      }
      if (x > x2) {
        t0 = t2;
      } else {
        t1 = t2;
      }
      t2 = (t1 - t0) * .5 + t0;
    }
    return t2;
  };

  UnitBezier.prototype.solve = function(x) {
    return this.sampleCurveY(this.solveCurveX(x));
  };

  return UnitBezier;

})();


},{"../Animator":3,"../Underscore":22,"../Utils":23}],5:[function(require,module,exports){
var Animator, Utils, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Utils = require("../Utils");

Animator = require("../Animator").Animator;

exports.LinearAnimator = (function(_super) {
  __extends(LinearAnimator, _super);

  function LinearAnimator() {
    _ref = LinearAnimator.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  LinearAnimator.prototype.setup = function(options) {
    this.options = Utils.setDefaultProperties(options, {
      time: 1
    });
    return this._time = 0;
  };

  LinearAnimator.prototype.next = function(delta) {
    if (this.finished()) {
      return 1;
    }
    this._time += delta;
    return this._time / this.options.time;
  };

  LinearAnimator.prototype.finished = function() {
    return this._time >= this.options.time;
  };

  return LinearAnimator;

})(Animator);


},{"../Animator":3,"../Utils":23}],6:[function(require,module,exports){
var Animator, Utils, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Utils = require("../Utils");

Animator = require("../Animator").Animator;

exports.SpringDHOAnimator = (function(_super) {
  __extends(SpringDHOAnimator, _super);

  function SpringDHOAnimator() {
    this.finished = __bind(this.finished, this);
    _ref = SpringDHOAnimator.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SpringDHOAnimator.prototype.setup = function(options) {
    this.options = Utils.setDefaultProperties(options, {
      velocity: 0,
      tolerance: 1 / 10000,
      stiffness: 50,
      damping: 2,
      mass: 0.2,
      time: null
    });
    console.log("SpringDHOAnimator.options", this.options, options);
    this._time = 0;
    this._value = 0;
    return this._velocity = this.options.velocity;
  };

  SpringDHOAnimator.prototype.next = function(delta) {
    var F_damper, F_spring, b, k;
    if (this.finished()) {
      return 1;
    }
    this._time += delta;
    k = 0 - this.options.stiffness;
    b = 0 - this.options.damping;
    F_spring = k * (this._value - 1);
    F_damper = b * this._velocity;
    this._velocity += ((F_spring + F_damper) / this.options.mass) * delta;
    this._value += this._velocity * delta;
    return this._value;
  };

  SpringDHOAnimator.prototype.finished = function() {
    return this._time > 0 && Math.abs(this._velocity) < this.options.tolerance;
  };

  return SpringDHOAnimator;

})(Animator);


},{"../Animator":3,"../Utils":23}],7:[function(require,module,exports){
var Animator, Utils, springAccelerationForState, springEvaluateState, springEvaluateStateWithDerivative, springIntegrateState, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Utils = require("../Utils");

Animator = require("../Animator").Animator;

exports.SpringRK4Animator = (function(_super) {
  __extends(SpringRK4Animator, _super);

  function SpringRK4Animator() {
    this.finished = __bind(this.finished, this);
    _ref = SpringRK4Animator.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SpringRK4Animator.prototype.setup = function(options) {
    this.options = Utils.setDefaultProperties(options, {
      tension: 500,
      friction: 10,
      velocity: 0,
      tolerance: 1 / 10000,
      time: null
    });
    this._time = 0;
    this._value = 0;
    this._velocity = this.options.velocity;
    return this._stopSpring = false;
  };

  SpringRK4Animator.prototype.next = function(delta) {
    var finalVelocity, net1DVelocity, netFloat, netValueIsLow, netVelocityIsLow, stateAfter, stateBefore;
    if (this.finished()) {
      return 1;
    }
    this._time += delta;
    stateBefore = {};
    stateAfter = {};
    stateBefore.x = this._value - 1;
    stateBefore.v = this._velocity;
    stateBefore.tension = this.options.tension;
    stateBefore.friction = this.options.friction;
    stateAfter = springIntegrateState(stateBefore, delta);
    this._value = 1 + stateAfter.x;
    finalVelocity = stateAfter.v;
    netFloat = stateAfter.x;
    net1DVelocity = stateAfter.v;
    netValueIsLow = Math.abs(netFloat) < this.options.tolerance;
    netVelocityIsLow = Math.abs(net1DVelocity) < this.options.tolerance;
    this._stopSpring = netValueIsLow && netVelocityIsLow;
    this._velocity = finalVelocity;
    return this._value;
  };

  SpringRK4Animator.prototype.finished = function() {
    return this._stopSpring;
  };

  return SpringRK4Animator;

})(Animator);

springAccelerationForState = function(state) {
  return -state.tension * state.x - state.friction * state.v;
};

springEvaluateState = function(initialState) {
  var output;
  output = {};
  output.dx = initialState.v;
  output.dv = springAccelerationForState(initialState);
  return output;
};

springEvaluateStateWithDerivative = function(initialState, dt, derivative) {
  var output, state;
  state = {};
  state.x = initialState.x + derivative.dx * dt;
  state.v = initialState.v + derivative.dv * dt;
  state.tension = initialState.tension;
  state.friction = initialState.friction;
  output = {};
  output.dx = state.v;
  output.dv = springAccelerationForState(state);
  return output;
};

springIntegrateState = function(state, speed) {
  var a, b, c, d, dvdt, dxdt;
  a = springEvaluateState(state);
  b = springEvaluateStateWithDerivative(state, speed * 0.5, a);
  c = springEvaluateStateWithDerivative(state, speed * 0.5, b);
  d = springEvaluateStateWithDerivative(state, speed, c);
  dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx);
  dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);
  state.x = state.x + dxdt * speed;
  state.v = state.v + dvdt * speed;
  return state;
};


},{"../Animator":3,"../Utils":23}],8:[function(require,module,exports){
var CounterKey, DefinedPropertiesKey, DefinedPropertiesValuesKey, EventEmitter, Utils, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require("./Underscore")._;

Utils = require("./Utils");

EventEmitter = require("./EventEmitter").EventEmitter;

CounterKey = "_ObjectCounter";

DefinedPropertiesKey = "_DefinedPropertiesKey";

DefinedPropertiesValuesKey = "_DefinedPropertiesValuesKey";

exports.BaseClass = (function(_super) {
  __extends(BaseClass, _super);

  BaseClass.define = function(propertyName, descriptor) {
    if (this !== BaseClass && descriptor.exportable === true) {
      descriptor.propertyName = propertyName;
      if (this[DefinedPropertiesKey] == null) {
        this[DefinedPropertiesKey] = {};
      }
      this[DefinedPropertiesKey][propertyName] = descriptor;
    }
    Object.defineProperty(this.prototype, propertyName, descriptor);
    return Object.__;
  };

  BaseClass.simpleProperty = function(name, fallback, exportable) {
    if (exportable == null) {
      exportable = true;
    }
    return {
      exportable: exportable,
      "default": fallback,
      get: function() {
        return this._getPropertyValue(name);
      },
      set: function(value) {
        return this._setPropertyValue(name, value);
      }
    };
  };

  BaseClass.prototype._setPropertyValue = function(k, v) {
    return this[DefinedPropertiesValuesKey][k] = v;
  };

  BaseClass.prototype._getPropertyValue = function(k) {
    return Utils.valueOrDefault(this[DefinedPropertiesValuesKey][k], this._getPropertyDefaultValue(k));
  };

  BaseClass.prototype._getPropertyDefaultValue = function(k) {
    return this.constructor[DefinedPropertiesKey][k]["default"];
  };

  BaseClass.prototype._propertyList = function() {
    return this.constructor[DefinedPropertiesKey];
  };

  BaseClass.prototype.keys = function() {
    return _.keys(this.properties);
  };

  BaseClass.define("properties", {
    get: function() {
      var k, properties, v, _ref;
      properties = {};
      _ref = this.constructor[DefinedPropertiesKey];
      for (k in _ref) {
        v = _ref[k];
        if (v.exportable !== false) {
          properties[k] = this[k];
        }
      }
      return properties;
    },
    set: function(value) {
      var k, v, _results;
      _results = [];
      for (k in value) {
        v = value[k];
        if (this.constructor[DefinedPropertiesKey].hasOwnProperty(k)) {
          if (this.constructor[DefinedPropertiesKey].exportable !== false) {
            _results.push(this[k] = v);
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  });

  BaseClass.define("id", {
    get: function() {
      return this._id;
    }
  });

  BaseClass.prototype.toString = function() {
    var properties;
    properties = _.map(this.properties, (function(v, k) {
      return "" + k + ":" + v;
    }), 4);
    return "[" + this.constructor.name + " id:" + this.id + " " + (properties.join(" ")) + "]";
  };

  function BaseClass(options) {
    var _base,
      _this = this;
    if (options == null) {
      options = {};
    }
    this.toString = __bind(this.toString, this);
    this._getPropertyValue = __bind(this._getPropertyValue, this);
    this._setPropertyValue = __bind(this._setPropertyValue, this);
    BaseClass.__super__.constructor.apply(this, arguments);
    this[DefinedPropertiesValuesKey] = {};
    if ((_base = this.constructor)[CounterKey] == null) {
      _base[CounterKey] = 0;
    }
    this.constructor[CounterKey] += 1;
    this._id = this.constructor[CounterKey];
    _.map(this.constructor[DefinedPropertiesKey], function(descriptor, name) {
      return _this[name] = Utils.valueOrDefault(options[name], _this._getPropertyDefaultValue(name));
    });
  }

  return BaseClass;

})(EventEmitter);


},{"./EventEmitter":13,"./Underscore":22,"./Utils":23}],9:[function(require,module,exports){
var CompatImageView, CompatLayer, CompatScrollView, CompatView, Layer, compatProperty, compatWarning, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Layer = require("./Layer").Layer;

compatWarning = function(msg) {
  return console.warn(msg);
};

compatProperty = function(name, originalName) {
  return {
    exportable: false,
    get: function() {
      compatWarning("" + originalName + " is a deprecated property");
      return this[name];
    },
    set: function(value) {
      compatWarning("" + originalName + " is a deprecated property");
      return this[name] = value;
    }
  };
};

CompatLayer = (function(_super) {
  var addSubView, removeSubView;

  __extends(CompatLayer, _super);

  function CompatLayer(options) {
    if (options == null) {
      options = {};
    }
    if (options.hasOwnProperty("superView")) {
      options.superLayer = options.superView;
    }
    CompatLayer.__super__.constructor.call(this, options);
  }

  CompatLayer.define("superView", compatProperty("superLayer", "superView"));

  CompatLayer.define("subViews", compatProperty("subLayers", "subViews"));

  CompatLayer.define("siblingViews", compatProperty("siblingLayers", "siblingViews"));

  addSubView = function(layer) {
    return this.addSubLayer(layer);
  };

  removeSubView = function(layer) {
    return this.removeSubLayer(layer);
  };

  return CompatLayer;

})(Layer);

CompatView = (function(_super) {
  __extends(CompatView, _super);

  function CompatView(options) {
    if (options == null) {
      options = {};
    }
    compatWarning("Views are now called Layers");
    CompatView.__super__.constructor.call(this, options);
  }

  return CompatView;

})(CompatLayer);

CompatImageView = (function(_super) {
  __extends(CompatImageView, _super);

  function CompatImageView() {
    _ref = CompatImageView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return CompatImageView;

})(CompatView);

CompatScrollView = (function(_super) {
  __extends(CompatScrollView, _super);

  function CompatScrollView() {
    CompatScrollView.__super__.constructor.apply(this, arguments);
    this.scroll = true;
  }

  return CompatScrollView;

})(CompatView);

window.Layer = CompatLayer;

window.Framer.Layer = CompatLayer;

window.View = CompatView;

window.ImageView = CompatImageView;

window.ScrollView = CompatScrollView;

window.utils = window.Utils;


},{"./Layer":18}],10:[function(require,module,exports){
var Utils;

Utils = require("./Utils");

exports.Config = {
  targetFPS: 60,
  rootBaseCSS: {
    "-webkit-perspective": 1000
  },
  layerBaseCSS: {
    "display": "block",
    "position": "absolute",
    "-webkit-box-sizing": "border-box",
    "background-repeat": "no-repeat",
    "background-size": "cover",
    "-webkit-overflow-scrolling": "touch"
  }
};


},{"./Utils":23}],11:[function(require,module,exports){
var EventKeys, Utils, createDebugLayer, errorWarning, hideDebug, showDebug, toggleDebug, _debugLayers, _errorWarningLayer;

Utils = require("./Utils");

_debugLayers = null;

createDebugLayer = function(layer) {
  var overLayer;
  overLayer = new Layer({
    frame: layer.screenFrame(),
    backgroundColor: "rgba(50,150,200,.35)"
  });
  overLayer.style = {
    textAlign: "center",
    color: "white",
    font: "10px/1em Monaco",
    lineHeight: "" + (overLayer.height + 1) + "px",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,.5)"
  };
  overLayer.html = layer.name || layer.id;
  overLayer.on(Events.Click, function(event, layer) {
    layer.scale = 0.8;
    return layer.animate({
      properties: {
        scale: 1
      },
      curve: "spring(1000,10,0)"
    });
  });
  return overLayer;
};

showDebug = function() {
  return _debugLayers = Layer.Layers().map(createDebugLayer);
};

hideDebug = function() {
  return _debugLayers.map(function(layer) {
    return layer.destroy();
  });
};

toggleDebug = Utils.toggle(showDebug, hideDebug);

EventKeys = {
  Shift: 16,
  Escape: 27
};

window.document.onkeyup = function(event) {
  if (event.keyCode === EventKeys.Escape) {
    return toggleDebug()();
  }
};

_errorWarningLayer = null;

errorWarning = function() {
  var layer;
  if (_errorWarningLayer) {
    return;
  }
  layer = new Layer({
    x: 20,
    y: -50,
    width: 300,
    height: 40
  });
  layer.states.add({
    visible: {
      x: 20,
      y: 20,
      width: 300,
      height: 40
    }
  });
  layer.html = "Javascript Error, see the console";
  layer.style = {
    font: "12px/1.35em Menlo",
    color: "white",
    textAlign: "center",
    lineHeight: "" + layer.height + "px",
    borderRadius: "5px",
    backgroundColor: "rgba(255,0,0,.8)"
  };
  layer.states.animationOptions = {
    curve: "spring",
    curveOptions: {
      tension: 1000,
      friction: 30
    }
  };
  layer.states["switch"]("visible");
  layer.on(Events.Click, function() {
    return this.states["switch"]("default");
  });
  return _errorWarningLayer = layer;
};

window.onerror = errorWarning;


},{"./Utils":23}],12:[function(require,module,exports){
var Originals, Utils, _;

_ = require("./Underscore")._;

Utils = require("./Utils");

Originals = {
  Layer: {
    backgroundColor: "rgba(0,124,255,.5)",
    width: 100,
    height: 100
  },
  Animation: {
    curve: "linear",
    time: 1
  }
};

exports.Defaults = {
  getDefaults: function(className, options) {
    var defaults, k, v, _ref;
    defaults = _.clone(Originals[className]);
    _ref = Framer.Defaults[className];
    for (k in _ref) {
      v = _ref[k];
      defaults[k] = _.isFunction(v) ? v() : v;
    }
    for (k in defaults) {
      v = defaults[k];
      if (!options.hasOwnProperty(k)) {
        options[k] = v;
      }
    }
    return options;
  },
  reset: function() {
    return window.Framer.Defaults = _.clone(Originals);
  }
};


},{"./Underscore":22,"./Utils":23}],13:[function(require,module,exports){
var EventEmitterEventsKey, _,
  __slice = [].slice;

_ = require("./Underscore")._;

EventEmitterEventsKey = "_events";

exports.EventEmitter = (function() {
  function EventEmitter() {
    this[EventEmitterEventsKey] = {};
  }

  EventEmitter.prototype._eventCheck = function(event, method) {
    if (!event) {
      return console.warn("" + this.constructor.name + "." + method + " missing event (like 'click')");
    }
  };

  EventEmitter.prototype.emit = function() {
    var args, event, listener, _i, _len, _ref, _ref1;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!((_ref = this[EventEmitterEventsKey]) != null ? _ref[event] : void 0)) {
      return;
    }
    _ref1 = this[EventEmitterEventsKey][event];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      listener = _ref1[_i];
      listener.apply(null, args);
    }
  };

  EventEmitter.prototype.addListener = function(event, listener) {
    var _base;
    this._eventCheck(event, "addListener");
    if (this[EventEmitterEventsKey] == null) {
      this[EventEmitterEventsKey] = {};
    }
    if ((_base = this[EventEmitterEventsKey])[event] == null) {
      _base[event] = [];
    }
    return this[EventEmitterEventsKey][event].push(listener);
  };

  EventEmitter.prototype.removeListener = function(event, listener) {
    this._eventCheck(event, "removeListener");
    if (!this[EventEmitterEventsKey]) {
      return;
    }
    if (!this[EventEmitterEventsKey][event]) {
      return;
    }
    this[EventEmitterEventsKey][event] = _.without(this[EventEmitterEventsKey][event], listener);
  };

  EventEmitter.prototype.once = function(event, listener) {
    var fn,
      _this = this;
    fn = function() {
      _this.removeListener(event, fn);
      return listener.apply(null, arguments);
    };
    return this.on(event, fn);
  };

  EventEmitter.prototype.removeAllListeners = function(event) {
    var listener, _i, _len, _ref;
    if (!this[EventEmitterEventsKey]) {
      return;
    }
    if (!this[EventEmitterEventsKey][event]) {
      return;
    }
    _ref = this[EventEmitterEventsKey][event];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      this.removeListener(event, listener);
    }
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

  return EventEmitter;

})();


},{"./Underscore":22}],14:[function(require,module,exports){
var Events, Utils, _;

_ = require("./Underscore")._;

Utils = require("./Utils");

Events = {};

if (Utils.isTouch()) {
  Events.TouchStart = "touchstart";
  Events.TouchEnd = "touchend";
  Events.TouchMove = "touchmove";
} else {
  Events.TouchStart = "mousedown";
  Events.TouchEnd = "mouseup";
  Events.TouchMove = "mousemove";
}

Events.Click = Events.TouchEnd;

Events.MouseOver = "mouseover";

Events.MouseOut = "mouseout";

Events.AnimationStart = "start";

Events.AnimationStop = "stop";

Events.AnimationEnd = "end";

Events.Scroll = "scroll";

Events.touchEvent = function(event) {
  var touchEvent, _ref, _ref1;
  touchEvent = (_ref = event.touches) != null ? _ref[0] : void 0;
  if (touchEvent == null) {
    touchEvent = (_ref1 = event.changedTouches) != null ? _ref1[0] : void 0;
  }
  if (touchEvent == null) {
    touchEvent = event;
  }
  return touchEvent;
};

exports.Events = Events;


},{"./Underscore":22,"./Utils":23}],15:[function(require,module,exports){
var BaseClass,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseClass = require("./BaseClass").BaseClass;

exports.Frame = (function(_super) {
  __extends(Frame, _super);

  Frame.define("x", Frame.simpleProperty("x", 0));

  Frame.define("y", Frame.simpleProperty("y", 0));

  Frame.define("width", Frame.simpleProperty("width", 0));

  Frame.define("height", Frame.simpleProperty("height", 0));

  Frame.define("minX", Frame.simpleProperty("x", 0, false));

  Frame.define("minY", Frame.simpleProperty("y", 0, false));

  function Frame(options) {
    var k, _i, _len, _ref;
    if (options == null) {
      options = {};
    }
    Frame.__super__.constructor.call(this, options);
    _ref = ["minX", "midX", "maxX", "minY", "midY", "maxY"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      if (options.hasOwnProperty(k)) {
        this[k] = options[k];
      }
    }
  }

  Frame.define("midX", {
    get: function() {
      return Utils.frameGetMidX(this);
    },
    set: function(value) {
      return Utils.frameSetMidX(this, value);
    }
  });

  Frame.define("maxX", {
    get: function() {
      return Utils.frameGetMaxX(this);
    },
    set: function(value) {
      return Utils.frameSetMaxX(this, value);
    }
  });

  Frame.define("midY", {
    get: function() {
      return Utils.frameGetMidY(this);
    },
    set: function(value) {
      return Utils.frameSetMidY(this, value);
    }
  });

  Frame.define("maxY", {
    get: function() {
      return Utils.frameGetMaxY(this);
    },
    set: function(value) {
      return Utils.frameSetMaxY(this, value);
    }
  });

  return Frame;

})(BaseClass);


},{"./BaseClass":8}],16:[function(require,module,exports){
var Defaults, Framer, _;

_ = require("./Underscore")._;

Framer = {};

Framer._ = _;

Framer.Utils = require("./Utils");

Framer.Frame = (require("./Frame")).Frame;

Framer.Layer = (require("./Layer")).Layer;

Framer.Events = (require("./Events")).Events;

Framer.Animation = (require("./Animation")).Animation;

if (window) {
  _.extend(window, Framer);
}

Framer.Config = (require("./Config")).Config;

Framer.EventEmitter = (require("./EventEmitter")).EventEmitter;

Framer.BaseClass = (require("./BaseClass")).BaseClass;

Framer.LayerStyle = (require("./LayerStyle")).LayerStyle;

Framer.AnimationLoop = (require("./AnimationLoop")).AnimationLoop;

Framer.LinearAnimator = (require("./Animators/LinearAnimator")).LinearAnimator;

Framer.BezierCurveAnimator = (require("./Animators/BezierCurveAnimator")).BezierCurveAnimator;

Framer.SpringDHOAnimator = (require("./Animators/SpringDHOAnimator")).SpringDHOAnimator;

Framer.SpringRK4Animator = (require("./Animators/SpringRK4Animator")).SpringRK4Animator;

Framer.Importer = (require("./Importer")).Importer;

Framer.Debug = (require("./Debug")).Debug;

if (window) {
  window.Framer = Framer;
}

require("./Compat");

Defaults = (require("./Defaults")).Defaults;

Framer.resetDefaults = Defaults.reset;

Framer.resetDefaults();


},{"./Animation":1,"./AnimationLoop":2,"./Animators/BezierCurveAnimator":4,"./Animators/LinearAnimator":5,"./Animators/SpringDHOAnimator":6,"./Animators/SpringRK4Animator":7,"./BaseClass":8,"./Compat":9,"./Config":10,"./Debug":11,"./Defaults":12,"./EventEmitter":13,"./Events":14,"./Frame":15,"./Importer":17,"./Layer":18,"./LayerStyle":21,"./Underscore":22,"./Utils":23}],17:[function(require,module,exports){
var ChromeAlert, Utils, _;

_ = require("./Underscore")._;

Utils = require("./Utils");

ChromeAlert = "Importing layers is currently only supported on Safari. If you really want it to work with Chrome quit it, open a terminal and run:\nopen -a Google\ Chrome -–allow-file-access-from-files";

exports.Importer = (function() {
  function Importer(path, extraLayerProperties) {
    this.path = path;
    this.extraLayerProperties = extraLayerProperties != null ? extraLayerProperties : {};
    this.paths = {
      layerInfo: Utils.pathJoin(this.path, "layers.json"),
      images: Utils.pathJoin(this.path, "images"),
      documentName: this.path.split("/").pop()
    };
    this._createdLayers = [];
    this._createdLayersByName = {};
  }

  Importer.prototype.load = function() {
    var layer, layerInfo, layersByName, _i, _j, _len, _len1, _ref, _ref1,
      _this = this;
    layersByName = {};
    layerInfo = this._loadlayerInfo();
    layerInfo.map(function(layerItemInfo) {
      return _this._createLayer(layerItemInfo);
    });
    _ref = this._createdLayers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      layer = _ref[_i];
      this._correctLayer(layer);
    }
    _ref1 = this._createdLayers;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      layer = _ref1[_j];
      if (!layer.superLayer) {
        layer.superLayer = null;
      }
    }
    return this._createdLayersByName;
  };

  Importer.prototype._loadlayerInfo = function() {
    var importedKey, _ref;
    importedKey = "" + this.paths.documentName + "/layers.json.js";
    if ((_ref = window.__imported__) != null ? _ref.hasOwnProperty(importedKey) : void 0) {
      return window.__imported__[importedKey];
    }
    return Framer.Utils.domLoadJSONSync(this.paths.layerInfo);
  };

  Importer.prototype._createLayer = function(info, superLayer) {
    var LayerClass, layer, layerInfo, _ref,
      _this = this;
    LayerClass = Layer;
    layerInfo = {
      shadow: true,
      name: info.name,
      frame: info.layerFrame,
      clip: false,
      backgroundColor: null,
      visible: (_ref = info.visible) != null ? _ref : true
    };
    _.extend(layerInfo, this.extraLayerProperties);
    if (info.image) {
      layerInfo.frame = info.image.frame;
      layerInfo.image = Utils.pathJoin(this.path, info.image.path);
    }
    if (info.maskFrame) {
      layerInfo.frame = info.maskFrame;
      layerInfo.clip = true;
    }
    if (superLayer != null ? superLayer.contentLayer : void 0) {
      layerInfo.superLayer = superLayer.contentLayer;
    } else if (superLayer) {
      layerInfo.superLayer = superLayer;
    }
    layer = new LayerClass(layerInfo);
    layer.name = layerInfo.name;
    if (!layer.image && !info.children.length && !info.maskFrame) {
      layer.frame = new Frame;
    }
    info.children.reverse().map(function(info) {
      return _this._createLayer(info, layer);
    });
    if (!layer.image && !info.maskFrame) {
      layer.frame = layer.contentFrame();
    }
    layer._info = info;
    this._createdLayers.push(layer);
    return this._createdLayersByName[layer.name] = layer;
  };

  Importer.prototype._correctLayer = function(layer) {
    var traverse;
    traverse = function(layer) {
      var subLayer, _i, _len, _ref, _results;
      if (layer.superLayer) {
        layer.frame = Utils.convertPoint(layer.frame, null, layer.superLayer);
      }
      _ref = layer.subLayers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subLayer = _ref[_i];
        _results.push(traverse(subLayer));
      }
      return _results;
    };
    if (!layer.superLayer) {
      return traverse(layer);
    }
  };

  return Importer;

})();

exports.Importer.load = function(path) {
  var importer;
  importer = new exports.Importer(path);
  return importer.load();
};


},{"./Underscore":22,"./Utils":23}],18:[function(require,module,exports){
var Animation, BaseClass, Config, Defaults, EventEmitter, Frame, LayerDraggable, LayerStates, LayerStyle, Utils, frameProperty, layerProperty, layerStyleProperty, _, _LayerList, _RootElement,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice;

_ = require("./Underscore")._;

Utils = require("./Utils");

Config = require("./Config").Config;

Defaults = require("./Defaults").Defaults;

BaseClass = require("./BaseClass").BaseClass;

EventEmitter = require("./EventEmitter").EventEmitter;

Animation = require("./Animation").Animation;

Frame = require("./Frame").Frame;

LayerStyle = require("./LayerStyle").LayerStyle;

LayerStates = require("./LayerStates").LayerStates;

LayerDraggable = require("./LayerDraggable").LayerDraggable;

_RootElement = null;

_LayerList = [];

layerProperty = function(name, cssProperty, fallback, validator, set) {
  return {
    exportable: true,
    "default": fallback,
    get: function() {
      return this._getPropertyValue(name);
    },
    set: function(value) {
      if (validator(value) === false) {
        throw Error("value '" + value + "' of type " + (typeof value) + " is not valid for a Layer." + name + " property");
      }
      this._setPropertyValue(name, value);
      this.style[cssProperty] = LayerStyle[cssProperty](this);
      this.emit("change:" + name, value);
      if (set) {
        return set(this, value);
      }
    }
  };
};

layerStyleProperty = function(cssProperty) {
  return {
    exportable: true,
    get: function() {
      return this.style[cssProperty];
    },
    set: function(value) {
      this.style[cssProperty] = value;
      return this.emit("change:" + cssProperty, value);
    }
  };
};

frameProperty = function(name) {
  return {
    exportable: false,
    get: function() {
      return this.frame[name];
    },
    set: function(value) {
      var frame;
      frame = this.frame;
      frame[name] = value;
      return this.frame = frame;
    }
  };
};

exports.Layer = (function(_super) {
  __extends(Layer, _super);

  function Layer(options) {
    var frame;
    if (options == null) {
      options = {};
    }
    this.addListener = __bind(this.addListener, this);
    this.__insertElement = __bind(this.__insertElement, this);
    _LayerList.push(this);
    this._createElement();
    this._setDefaultCSS();
    options = Defaults.getDefaults("Layer", options);
    Layer.__super__.constructor.call(this, options);
    this._element.id = "FramerLayer-" + this.id;
    if (options.hasOwnProperty("frame")) {
      frame = new Frame(options.frame);
    } else {
      frame = new Frame(options);
    }
    this.frame = frame;
    if (!options.superLayer) {
      this.bringToFront();
      if (!options.shadow) {
        this._insertElement();
      }
    } else {
      this.superLayer = options.superLayer;
    }
    this._subLayers = [];
  }

  Layer.define("width", layerProperty("width", "width", 100, _.isNumber));

  Layer.define("height", layerProperty("height", "height", 100, _.isNumber));

  Layer.define("visible", layerProperty("visible", "display", true, _.isBool));

  Layer.define("opacity", layerProperty("opacity", "opacity", 1, _.isNumber));

  Layer.define("index", layerProperty("index", "zIndex", 0, _.isNumber));

  Layer.define("clip", layerProperty("clip", "overflow", true, _.isBool));

  Layer.define("scrollHorizontal", layerProperty("scrollHorizontal", "overflowX", false, _.isBool, function(layer, value) {
    if (value === true) {
      return layer.ignoreEvents = false;
    }
  }));

  Layer.define("scrollVertical", layerProperty("scrollVertical", "overflowY", false, _.isBool, function(layer, value) {
    if (value === true) {
      return layer.ignoreEvents = false;
    }
  }));

  Layer.define("scroll", {
    get: function() {
      return this.scrollHorizontal === true || this.scrollVertical === true;
    },
    set: function(value) {
      return this.scrollHorizontal = this.scrollVertical = true;
    }
  });

  Layer.define("ignoreEvents", layerProperty("ignoreEvents", "pointerEvents", true, _.isBool));

  Layer.define("x", layerProperty("x", "webkitTransform", 0, _.isNumber));

  Layer.define("y", layerProperty("y", "webkitTransform", 0, _.isNumber));

  Layer.define("z", layerProperty("z", "webkitTransform", 0, _.isNumber));

  Layer.define("scaleX", layerProperty("scaleX", "webkitTransform", 1, _.isNumber));

  Layer.define("scaleY", layerProperty("scaleY", "webkitTransform", 1, _.isNumber));

  Layer.define("scaleZ", layerProperty("scaleZ", "webkitTransform", 1, _.isNumber));

  Layer.define("scale", layerProperty("scale", "webkitTransform", 1, _.isNumber));

  Layer.define("originX", layerProperty("originX", "webkitTransformOrigin", 0.5, _.isNumber));

  Layer.define("originY", layerProperty("originY", "webkitTransformOrigin", 0.5, _.isNumber));

  Layer.define("rotationX", layerProperty("rotationX", "webkitTransform", 0, _.isNumber));

  Layer.define("rotationY", layerProperty("rotationY", "webkitTransform", 0, _.isNumber));

  Layer.define("rotationZ", layerProperty("rotationZ", "webkitTransform", 0, _.isNumber));

  Layer.define("rotation", layerProperty("rotationZ", "webkitTransform", 0, _.isNumber));

  Layer.define("blur", layerProperty("blur", "webkitFilter", 0, _.isNumber));

  Layer.define("brightness", layerProperty("brightness", "webkitFilter", 100, _.isNumber));

  Layer.define("saturate", layerProperty("saturate", "webkitFilter", 100, _.isNumber));

  Layer.define("hueRotate", layerProperty("hueRotate", "webkitFilter", 0, _.isNumber));

  Layer.define("contrast", layerProperty("contrast", "webkitFilter", 100, _.isNumber));

  Layer.define("invert", layerProperty("invert", "webkitFilter", 0, _.isNumber));

  Layer.define("grayscale", layerProperty("grayscale", "webkitFilter", 0, _.isNumber));

  Layer.define("sepia", layerProperty("sepia", "webkitFilter", 0, _.isNumber));

  Layer.define("backgroundColor", layerStyleProperty("backgroundColor"));

  Layer.define("borderRadius", layerStyleProperty("borderRadius"));

  Layer.define("borderColor", layerStyleProperty("borderColor"));

  Layer.define("borderWidth", layerStyleProperty("borderWidth"));

  Layer.define("name", {
    exportable: true,
    "default": "",
    get: function() {
      return this._getPropertyValue("name");
    },
    set: function(value) {
      this._setPropertyValue("name", value);
      return this._element.setAttribute("name", value);
    }
  });

  Layer.define("frame", {
    get: function() {
      return new Frame(this);
    },
    set: function(frame) {
      var k, _i, _len, _ref, _results;
      if (!frame) {
        return;
      }
      _ref = ["x", "y", "width", "height"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        _results.push(this[k] = frame[k]);
      }
      return _results;
    }
  });

  Layer.define("minX", frameProperty("minX"));

  Layer.define("midX", frameProperty("midX"));

  Layer.define("maxX", frameProperty("maxX"));

  Layer.define("minY", frameProperty("minY"));

  Layer.define("midY", frameProperty("midY"));

  Layer.define("maxY", frameProperty("maxY"));

  Layer.prototype.convertPoint = function(point) {
    return Utils.convertPoint(point, null, this);
  };

  Layer.prototype.screenFrame = function() {
    return Utils.convertPoint(this.frame, this, null);
  };

  Layer.prototype.contentFrame = function() {
    return Utils.frameMerge(this.subLayers.map(function(layer) {
      return layer.frame.properties;
    }));
  };

  Layer.prototype.centerFrame = function() {
    var frame;
    if (this.superLayer) {
      frame = this.frame;
      frame.midX = parseInt(this.superLayer.width / 2.0);
      frame.midY = parseInt(this.superLayer.height / 2.0);
      return frame;
    } else {
      frame = this.frame;
      frame.midX = parseInt(window.innerWidth / 2.0);
      frame.midY = parseInt(window.innerHeight / 2.0);
      return frame;
    }
  };

  Layer.prototype.center = function() {
    return this.frame = this.centerFrame();
  };

  Layer.prototype.centerX = function() {
    return this.x = this.centerFrame().x;
  };

  Layer.prototype.centerY = function() {
    return this.y = this.centerFrame().y;
  };

  Layer.prototype.pixelAlign = function() {
    this.x = parseInt(this.x);
    return this.y = parseInt(this.y);
  };

  Layer.define("style", {
    get: function() {
      return this._element.style;
    },
    set: function(value) {
      _.extend(this._element.style, value);
      return this.emit("change:style");
    }
  });

  Layer.define("html", {
    get: function() {
      var _ref;
      return (_ref = this._elementHTML) != null ? _ref.innerHTML : void 0;
    },
    set: function(value) {
      if (!this._elementHTML) {
        this._elementHTML = document.createElement("div");
        this._element.appendChild(this._elementHTML);
      }
      this._elementHTML.innerHTML = value;
      if (!(this._elementHTML.childNodes.length === 1 && this._elementHTML.childNodes[0].nodeName === "#text")) {
        this.ignoreEvents = false;
      }
      return this.emit("change:html");
    }
  });

  Layer.prototype.computedStyle = function() {
    return document.defaultView.getComputedStyle(this._element);
  };

  Layer.prototype._setDefaultCSS = function() {
    return this.style = Config.layerBaseCSS;
  };

  Layer.define("classList", {
    get: function() {
      return this._element.classList;
    }
  });

  Layer.prototype._createElement = function() {
    if (this._element != null) {
      return;
    }
    return this._element = document.createElement("div");
  };

  Layer.prototype._insertElement = function() {
    return Utils.domComplete(this.__insertElement);
  };

  Layer.prototype.__insertElement = function() {
    if (!_RootElement) {
      _RootElement = document.createElement("div");
      _RootElement.id = "FramerRoot";
      _.extend(_RootElement.style, Config.rootBaseCSS);
      document.body.appendChild(_RootElement);
    }
    return _RootElement.appendChild(this._element);
  };

  Layer.prototype.destroy = function() {
    if (this.superLayer) {
      this.superLayer._subLayers = _.without(this.superLayer._subLayers, this);
    }
    this._element.parentNode.removeChild(this._element);
    this.removeAllListeners();
    return _LayerList = _.without(_LayerList, this);
  };

  Layer.prototype.copy = function() {
    var copiedSublayer, layer, subLayer, _i, _len, _ref;
    layer = this.copySingle();
    _ref = this.subLayers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      subLayer = _ref[_i];
      copiedSublayer = subLayer.copy();
      copiedSublayer.superLayer = layer;
    }
    return layer;
  };

  Layer.prototype.copySingle = function() {
    return new Layer(this.properties);
  };

  Layer.prototype.animate = function(options) {
    var animation;
    options.layer = this;
    options.curveOptions = options;
    animation = new Animation(options);
    animation.start();
    return animation;
  };

  Layer.define("image", {
    exportable: true,
    "default": "",
    get: function() {
      return this._getPropertyValue("image");
    },
    set: function(value) {
      var currentValue, imageUrl, loader, _ref, _ref1,
        _this = this;
      currentValue = this._getPropertyValue("image");
      if (currentValue === value) {
        return this.emit("load");
      }
      this.backgroundColor = null;
      this._setPropertyValue("image", value);
      imageUrl = value;
      if ((_ref = this.events) != null ? _ref.hasOwnProperty("load" || ((_ref1 = this.events) != null ? _ref1.hasOwnProperty("error") : void 0)) : void 0) {
        loader = new Image();
        loader.name = imageUrl;
        loader.src = imageUrl;
        loader.onload = function() {
          _this.style["background-image"] = "url('" + imageUrl + "')";
          return _this.emit("load", loader);
        };
        return loader.onerror = function() {
          return _this.emit("error", loader);
        };
      } else {
        return this.style["background-image"] = "url('" + imageUrl + "')";
      }
    }
  });

  Layer.define("superLayer", {
    exportable: false,
    get: function() {
      return this._superLayer || null;
    },
    set: function(layer) {
      if (layer === this._superLayer) {
        return;
      }
      if (!layer instanceof Layer) {
        throw Error("Layer.superLayer needs to be a Layer object");
      }
      Utils.domCompleteCancel(this.__insertElement);
      if (this._superLayer) {
        this._superLayer._subLayers = _.without(this._superLayer._subLayers, this);
        this._superLayer._element.removeChild(this._element);
        this._superLayer.emit("change:subLayers", {
          added: [],
          removed: [this]
        });
      }
      if (layer) {
        layer._element.appendChild(this._element);
        layer._subLayers.push(this);
        layer.emit("change:subLayers", {
          added: [this],
          removed: []
        });
      } else {
        this._insertElement();
      }
      this._superLayer = layer;
      this.bringToFront();
      return this.emit("change:superLayer");
    }
  });

  Layer.prototype.superLayers = function() {
    var recurse, superLayers;
    superLayers = [];
    recurse = function(layer) {
      if (!layer.superLayer) {
        return;
      }
      superLayers.push(layer.superLayer);
      return recurse(layer.superLayer);
    };
    recurse(this);
    return superLayers;
  };

  Layer.define("subLayers", {
    exportable: false,
    get: function() {
      return _.clone(this._subLayers);
    }
  });

  Layer.define("siblingLayers", {
    exportable: false,
    get: function() {
      var _this = this;
      if (this.superLayer === null) {
        return _.filter(_LayerList, function(layer) {
          return layer !== _this && layer.superLayer === null;
        });
      }
      return _.without(this.superLayer.subLayers, this);
    }
  });

  Layer.prototype.addSubLayer = function(layer) {
    return layer.superLayer = this;
  };

  Layer.prototype.removeSubLayer = function(layer) {
    if (__indexOf.call(this.subLayers, layer) < 0) {
      return;
    }
    return layer.superLayer = null;
  };

  Layer.prototype.subLayersByName = function(name) {
    return _.filter(this.subLayers, function(layer) {
      return layer.name === name;
    });
  };

  Layer.prototype.animate = function(options) {
    var animation, start;
    start = options.start;
    if (start == null) {
      start = true;
    }
    delete options.start;
    options.layer = this;
    animation = new Animation(options);
    if (start) {
      animation.start();
    }
    return animation;
  };

  Layer.prototype.animations = function() {
    var _this = this;
    return _.filter(Animation.runningAnimations(), function(a) {
      return a.options.layer === _this;
    });
  };

  Layer.prototype.animateStop = function() {
    return _.invoke(this.animations(), "stop");
  };

  Layer.prototype.bringToFront = function() {
    return this.index = _.max(_.union([0], this.siblingLayers.map(function(layer) {
      return layer.index;
    }))) + 1;
  };

  Layer.prototype.sendToBack = function() {
    return this.index = _.min(_.union([0], this.siblingLayers.map(function(layer) {
      return layer.index;
    }))) - 1;
  };

  Layer.prototype.placeBefore = function(layer) {
    var l, _i, _len, _ref;
    if (__indexOf.call(this.siblingLayers, layer) < 0) {
      return;
    }
    _ref = this.siblingLayers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      l = _ref[_i];
      if (l.index <= layer.index) {
        l.index -= 1;
      }
    }
    return this.index = layer.index + 1;
  };

  Layer.prototype.placeBehind = function(layer) {
    var l, _i, _len, _ref;
    if (__indexOf.call(this.siblingLayers, layer) < 0) {
      return;
    }
    _ref = this.siblingLayers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      l = _ref[_i];
      if (l.index >= layer.index) {
        l.index += 1;
      }
    }
    return this.index = layer.index - 1;
  };

  Layer.define("states", {
    get: function() {
      return this._states != null ? this._states : this._states = new LayerStates(this);
    }
  });

  Layer.define("draggable", {
    get: function() {
      if (this._draggable == null) {
        this._draggable = new LayerDraggable(this);
      }
      return this._draggable;
    }
  });

  Layer.define("scrollFrame", {
    get: function() {
      return new Frame({
        x: this.scrollX,
        y: this.scrollY,
        width: this.width,
        height: this.height
      });
    },
    set: function(frame) {
      this.scrollX = frame.x;
      return this.scrollY = frame.y;
    }
  });

  Layer.define("scrollX", {
    get: function() {
      return this._element.scrollLeft;
    },
    set: function(value) {
      return this._element.scrollLeft = value;
    }
  });

  Layer.define("scrollY", {
    get: function() {
      return this._element.scrollTop;
    },
    set: function(value) {
      return this._element.scrollTop = value;
    }
  });

  Layer.prototype.addListener = function(event, originalListener) {
    var listener, _base,
      _this = this;
    listener = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return originalListener.call.apply(originalListener, [_this].concat(__slice.call(args), [_this]));
    };
    originalListener.modifiedListener = listener;
    Layer.__super__.addListener.call(this, event, listener);
    this._element.addEventListener(event, listener);
    if (this._eventListeners == null) {
      this._eventListeners = {};
    }
    if ((_base = this._eventListeners)[event] == null) {
      _base[event] = [];
    }
    this._eventListeners[event].push(listener);
    return this.ignoreEvents = false;
  };

  Layer.prototype.removeListener = function(event, listener) {
    if (listener.modifiedListener) {
      listener = listener.modifiedListener;
    }
    Layer.__super__.removeListener.call(this, event, listener);
    this._element.removeEventListener(event, listener);
    return this._eventListeners[event] = _.without(this._eventListeners[event], listener);
  };

  Layer.prototype.removeAllListeners = function() {
    var eventName, listener, listeners, _ref, _results;
    if (!this._eventListeners) {
      return;
    }
    _ref = this._eventListeners;
    _results = [];
    for (eventName in _ref) {
      listeners = _ref[eventName];
      _results.push((function() {
        var _i, _len, _results1;
        _results1 = [];
        for (_i = 0, _len = listeners.length; _i < _len; _i++) {
          listener = listeners[_i];
          _results1.push(this.removeListener(eventName, listener));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  Layer.prototype.on = Layer.prototype.addListener;

  Layer.prototype.off = Layer.prototype.removeListener;

  return Layer;

})(BaseClass);

exports.Layer.Layers = function() {
  return _.clone(_LayerList);
};


},{"./Animation":1,"./BaseClass":8,"./Config":10,"./Defaults":12,"./EventEmitter":13,"./Frame":15,"./LayerDraggable":19,"./LayerStates":20,"./LayerStyle":21,"./Underscore":22,"./Utils":23}],19:[function(require,module,exports){
var EventEmitter, Events, Utils, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require("./Underscore");

Utils = require("./Utils");

EventEmitter = require("./EventEmitter").EventEmitter;

Events = require("./Events").Events;

Events.DragStart = "dragstart";

Events.DragMove = "dragmove";

Events.DragEnd = "dragend";

"This takes any layer and makes it draggable by the user on mobile or desktop.\n\nSome interesting things are:\n\n- The draggable.calculateVelocity().x|y contains the current average speed \n  in the last 100ms (defined with VelocityTimeOut).\n- You can enable/disable or slowdown/speedup scrolling with\n  draggable.speed.x|y\n";

exports.LayerDraggable = (function(_super) {
  __extends(LayerDraggable, _super);

  LayerDraggable.VelocityTimeOut = 100;

  function LayerDraggable(layer) {
    this.layer = layer;
    this._touchEnd = __bind(this._touchEnd, this);
    this._touchStart = __bind(this._touchStart, this);
    this._updatePosition = __bind(this._updatePosition, this);
    this.speedX = 1.0;
    this.speedY = 1.0;
    this._deltas = [];
    this._isDragging = false;
    this.enabled = true;
    this.attach();
  }

  LayerDraggable.prototype.attach = function() {
    return this.layer.on(Events.TouchStart, this._touchStart);
  };

  LayerDraggable.prototype.remove = function() {
    return this.layer.off(Events.TouchStart, this._touchStart);
  };

  LayerDraggable.prototype.emit = function(eventName, event) {
    this.layer.emit(eventName, event);
    return LayerDraggable.__super__.emit.call(this, eventName, event);
  };

  LayerDraggable.prototype.calculateVelocity = function() {
    var curr, prev, time, timeSinceLastMove, velocity;
    if (this._deltas.length < 2) {
      return {
        x: 0,
        y: 0
      };
    }
    curr = this._deltas.slice(-1)[0];
    prev = this._deltas.slice(-2, -1)[0];
    time = curr.t - prev.t;
    timeSinceLastMove = new Date().getTime() - prev.t;
    if (timeSinceLastMove > this.VelocityTimeOut) {
      return {
        x: 0,
        y: 0
      };
    }
    velocity = {
      x: (curr.x - prev.x) / time,
      y: (curr.y - prev.y) / time
    };
    if (velocity.x === Infinity) {
      velocity.x = 0;
    }
    if (velocity.y === Infinity) {
      velocity.y = 0;
    }
    return velocity;
  };

  LayerDraggable.prototype._updatePosition = function(event) {
    var correctedDelta, delta, touchEvent,
      _this = this;
    if (this.enabled === false) {
      return;
    }
    this.emit(Events.DragMove, event);
    touchEvent = Events.touchEvent(event);
    delta = {
      x: touchEvent.clientX - this._start.x,
      y: touchEvent.clientY - this._start.y
    };
    correctedDelta = {
      x: delta.x * this.speedX,
      y: delta.y * this.speedY,
      t: event.timeStamp
    };
    window.requestAnimationFrame(function() {
      _this.layer.x = _this._start.x + correctedDelta.x - _this._offset.x;
      return _this.layer.y = _this._start.y + correctedDelta.y - _this._offset.y;
    });
    this._deltas.push(correctedDelta);
    return this.emit(Events.DragMove, event);
  };

  LayerDraggable.prototype._touchStart = function(event) {
    var touchEvent;
    this.layer.animateStop();
    this._isDragging = true;
    touchEvent = Events.touchEvent(event);
    this._start = {
      x: touchEvent.clientX,
      y: touchEvent.clientY
    };
    this._offset = {
      x: touchEvent.clientX - this.layer.x,
      y: touchEvent.clientY - this.layer.y
    };
    document.addEventListener(Events.TouchMove, this._updatePosition);
    document.addEventListener(Events.TouchEnd, this._touchEnd);
    return this.emit(Events.DragStart, event);
  };

  LayerDraggable.prototype._touchEnd = function(event) {
    this._isDragging = false;
    document.removeEventListener(Events.TouchMove, this._updatePosition);
    document.removeEventListener(Events.TouchEnd, this._touchEnd);
    this.emit(Events.DragEnd, event);
    return this._deltas = [];
  };

  return LayerDraggable;

})(EventEmitter);


},{"./EventEmitter":13,"./Events":14,"./Underscore":22,"./Utils":23}],20:[function(require,module,exports){
var BaseClass, Defaults, Events, LayerStatesIgnoredKeys, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require("./Underscore")._;

Events = require("./Events").Events;

BaseClass = require("./BaseClass").BaseClass;

Defaults = require("./Defaults").Defaults;

LayerStatesIgnoredKeys = ["ignoreEvents"];

Events.StateWillSwitch = "willSwitch";

Events.StateDidSwitch = "didSwitch";

exports.LayerStates = (function(_super) {
  __extends(LayerStates, _super);

  function LayerStates(layer) {
    this.layer = layer;
    this._states = {};
    this._orderedStates = [];
    this.animationOptions = {};
    this.add("default", this.layer.properties);
    this._currentState = "default";
    this._previousStates = [];
    LayerStates.__super__.constructor.apply(this, arguments);
  }

  LayerStates.prototype.add = function(stateName, properties) {
    var error, k, v;
    if (_.isObject(stateName)) {
      for (k in stateName) {
        v = stateName[k];
        this.add(k, v);
      }
      return;
    }
    error = function() {
      throw Error("Usage example: layer.states.add(\"someName\", {x:500})");
    };
    if (!_.isString(stateName)) {
      error();
    }
    if (!_.isObject(properties)) {
      error();
    }
    this._orderedStates.push(stateName);
    return this._states[stateName] = properties;
  };

  LayerStates.prototype.remove = function(stateName) {
    if (!this._states.hasOwnProperty(stateName)) {
      return;
    }
    delete this._states[stateName];
    return this._orderedStates = _.without(this._orderedStates, stateName);
  };

  LayerStates.prototype["switch"] = function(stateName, animationOptions, instant) {
    var animatingKeys, properties, propertyName, value, _ref,
      _this = this;
    if (instant == null) {
      instant = false;
    }
    if (!this._states.hasOwnProperty(stateName)) {
      throw Error("No such state: '" + stateName + "'");
    }
    this.emit(Events.StateWillSwitch, this._currentState, stateName, this);
    this._previousStates.push(this._currentState);
    this._currentState = stateName;
    properties = {};
    animatingKeys = this.animatingKeys();
    _ref = this._states[stateName];
    for (propertyName in _ref) {
      value = _ref[propertyName];
      if (__indexOf.call(LayerStatesIgnoredKeys, propertyName) >= 0) {
        continue;
      }
      if (__indexOf.call(animatingKeys, propertyName) < 0) {
        continue;
      }
      if (_.isFunction(value)) {
        value = value.call(this.layer, this.layer, stateName);
      }
      properties[propertyName] = value;
    }
    if (instant === true) {
      this.layer.properties = properties;
      return this.emit(Events.StateDidSwitch, _.last(this._previousStates), stateName, this);
    } else {
      if (animationOptions == null) {
        animationOptions = this.animationOptions;
      }
      animationOptions.properties = properties;
      this._animation = this.layer.animate(animationOptions);
      return this._animation.on("stop", function() {
        return _this.emit(Events.StateDidSwitch, _.last(_this._previousStates), stateName, _this);
      });
    }
  };

  LayerStates.prototype.switchInstant = function(stateName) {
    return this["switch"](stateName, null, true);
  };

  LayerStates.define("state", {
    get: function() {
      return this._currentState;
    }
  });

  LayerStates.define("current", {
    get: function() {
      return this._currentState;
    }
  });

  LayerStates.prototype.states = function() {
    return _.clone(this._orderedStates);
  };

  LayerStates.prototype.animatingKeys = function() {
    var keys, state, stateName, _ref;
    keys = [];
    _ref = this._states;
    for (stateName in _ref) {
      state = _ref[stateName];
      if (stateName === "default") {
        continue;
      }
      keys = _.union(keys, _.keys(state));
    }
    return keys;
  };

  LayerStates.prototype.previous = function(states, animationOptions) {
    if (states == null) {
      states = this.states();
    }
    return this["switch"](Utils.arrayPrev(states, this._currentState), animationOptions);
  };

  LayerStates.prototype.next = function() {
    var states;
    states = Utils.arrayFromArguments(arguments);
    if (!states.length) {
      states = this.states();
    }
    return this["switch"](Utils.arrayNext(states, this._currentState));
  };

  LayerStates.prototype.last = function(animationOptions) {
    return this["switch"](_.last(this._previousStates), animationOptions);
  };

  return LayerStates;

})(BaseClass);


},{"./BaseClass":8,"./Defaults":12,"./Events":14,"./Underscore":22}],21:[function(require,module,exports){
var filterFormat, _WebkitProperties;

filterFormat = function(value, unit) {
  return "" + (Utils.round(value, 2)) + unit;
};

_WebkitProperties = [["blur", "blur", 0, "px"], ["brightness", "brightness", 100, "%"], ["saturate", "saturate", 100, "%"], ["hue-rotate", "hueRotate", 0, "deg"], ["contrast", "contrast", 100, "%"], ["invert", "invert", 0, "%"], ["grayscale", "grayscale", 0, "%"], ["sepia", "sepia", 0, "%"]];

exports.LayerStyle = {
  width: function(layer) {
    return layer.width + "px";
  },
  height: function(layer) {
    return layer.height + "px";
  },
  display: function(layer) {
    if (layer.visible === true) {
      return "block";
    }
    return "none";
  },
  opacity: function(layer) {
    return layer.opacity;
  },
  overflow: function(layer) {
    if (layer.scrollHorizontal === true || layer.scrollVertical === true) {
      return "auto";
    }
    if (layer.clip === true) {
      return "hidden";
    }
    return "visible";
  },
  overflowX: function(layer) {
    if (layer.scrollHorizontal === true) {
      return "scroll";
    }
    if (layer.clip === true) {
      return "hidden";
    }
    return "visible";
  },
  overflowY: function(layer) {
    if (layer.scrollVertical === true) {
      return "scroll";
    }
    if (layer.clip === true) {
      return "hidden";
    }
    return "visible";
  },
  zIndex: function(layer) {
    return layer.index;
  },
  webkitFilter: function(layer) {
    var css, cssName, fallback, layerName, unit, _i, _len, _ref;
    css = [];
    for (_i = 0, _len = _WebkitProperties.length; _i < _len; _i++) {
      _ref = _WebkitProperties[_i], cssName = _ref[0], layerName = _ref[1], fallback = _ref[2], unit = _ref[3];
      if (layer[layerName] !== fallback) {
        css.push("" + cssName + "(" + (filterFormat(layer[layerName], unit)) + ")");
      }
    }
    return css.join(" ");
  },
  webkitTransform: function(layer) {
    return "		translate3d(" + layer.x + "px," + layer.y + "px," + layer.z + "px) 		scale(" + layer.scale + ")		scale3d(" + layer.scaleX + "," + layer.scaleY + "," + layer.scaleZ + ") 		rotateX(" + layer.rotationX + "deg) 		rotateY(" + layer.rotationY + "deg) 		rotateZ(" + layer.rotationZ + "deg) 		";
  },
  webkitTransformOrigin: function(layer) {
    return "" + (layer.originX * 100) + "% " + (layer.originY * 100) + "%";
  },
  pointerEvents: function(layer) {
    if (layer.ignoreEvents) {
      return "none";
    }
    return "auto";
  }
};


},{}],22:[function(require,module,exports){
var _;

_ = require("lodash");

_.str = require('underscore.string');

_.mixin(_.str.exports());

_.isBool = function(v) {
  return typeof v === 'boolean';
};

exports._ = _;


},{"lodash":24,"underscore.string":25}],23:[function(require,module,exports){
var Utils, _, __domComplete,
  __slice = [].slice,
  _this = this;

_ = require("./Underscore")._;

Utils = {};

Utils.setDefaultProperties = function(obj, defaults, warn) {
  var k, result, v;
  if (warn == null) {
    warn = true;
  }
  result = {};
  for (k in defaults) {
    v = defaults[k];
    if (obj.hasOwnProperty(k)) {
      result[k] = obj[k];
    } else {
      result[k] = defaults[k];
    }
  }
  if (warn) {
    for (k in obj) {
      v = obj[k];
      if (!defaults.hasOwnProperty(k)) {
        console.warn("Utils.setDefaultProperties: got unexpected option: '" + k + " -> " + v + "'", obj);
      }
    }
  }
  return result;
};

Utils.valueOrDefault = function(value, defaultValue) {
  if (value === (void 0) || value === null) {
    value = defaultValue;
  }
  return value;
};

Utils.arrayToObject = function(arr) {
  var item, obj, _i, _len;
  obj = {};
  for (_i = 0, _len = arr.length; _i < _len; _i++) {
    item = arr[_i];
    obj[item[0]] = item[1];
  }
  return obj;
};

Utils.arrayNext = function(arr, item) {
  return arr[arr.indexOf(item) + 1] || _.first(arr);
};

Utils.arrayPrev = function(arr, item) {
  return arr[arr.indexOf(item) - 1] || _.last(arr);
};

if (window.requestAnimationFrame == null) {
  window.requestAnimationFrame = window.webkitRequestAnimationFrame;
}

if (window.requestAnimationFrame == null) {
  window.requestAnimationFrame = function(f) {
    return Utils.delay(1 / 60, f);
  };
}

Utils.getTime = function() {
  return Date.now() / 1000;
};

Utils.delay = function(time, f) {
  var timer;
  timer = setTimeout(f, time * 1000);
  return timer;
};

Utils.interval = function(time, f) {
  var timer;
  timer = setInterval(f, time * 1000);
  return timer;
};

Utils.debounce = function(threshold, fn, immediate) {
  var timeout;
  if (threshold == null) {
    threshold = 0.1;
  }
  timeout = null;
  threshold *= 1000;
  return function() {
    var args, delayed, obj;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    obj = this;
    delayed = function() {
      if (!immediate) {
        fn.apply(obj, args);
      }
      return timeout = null;
    };
    if (timeout) {
      clearTimeout(timeout);
    } else if (immediate) {
      fn.apply(obj, args);
    }
    return timeout = setTimeout(delayed, threshold);
  };
};

Utils.throttle = function(delay, fn) {
  var timer;
  if (delay === 0) {
    return fn;
  }
  delay *= 1000;
  timer = false;
  return function() {
    if (timer) {
      return;
    }
    timer = true;
    if (delay !== -1) {
      setTimeout((function() {
        return timer = false;
      }), delay);
    }
    return fn.apply(null, arguments);
  };
};

Utils.randomColor = function(alpha) {
  var c;
  if (alpha == null) {
    alpha = 1.0;
  }
  c = function() {
    return parseInt(Math.random() * 255);
  };
  return "rgba(" + (c()) + ", " + (c()) + ", " + (c()) + ", " + alpha + ")";
};

Utils.randomChoice = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

Utils.randomNumber = function(a, b) {
  if (a == null) {
    a = 0;
  }
  if (b == null) {
    b = 1;
  }
  return Utils.mapRange(Math.random(), 0, 1, a, b);
};

Utils.labelLayer = function(layer, text, style) {
  if (style == null) {
    style = {};
  }
  style = _.extend({
    font: "10px/1em Menlo",
    lineHeight: "" + layer.height + "px",
    textAlign: "center",
    color: "#fff"
  }, style);
  layer.style = style;
  return layer.html = text;
};

Utils.uuid = function() {
  var chars, digit, output, r, random, _i;
  chars = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
  output = new Array(36);
  random = 0;
  for (digit = _i = 1; _i <= 32; digit = ++_i) {
    if (random <= 0x02) {
      random = 0x2000000 + (Math.random() * 0x1000000) | 0;
    }
    r = random & 0xf;
    random = random >> 4;
    output[digit] = chars[digit === 19 ? (r & 0x3) | 0x8 : r];
  }
  return output.join("");
};

Utils.arrayFromArguments = function(args) {
  if (_.isArray(args[0])) {
    return args[0];
  }
  return Array.prototype.slice.call(args);
};

Utils.cycle = function() {
  var args, curr;
  args = Utils.arrayFromArguments(arguments);
  curr = -1;
  return function() {
    curr++;
    if (curr >= args.length) {
      curr = 0;
    }
    return args[curr];
  };
};

Utils.toggle = Utils.cycle;

Utils.isWebKit = function() {
  return window.WebKitCSSMatrix !== null;
};

Utils.isTouch = function() {
  return window.ontouchstart === null;
};

Utils.isMobile = function() {
  return /iphone|ipod|android|ie|blackberry|fennec/.test(navigator.userAgent.toLowerCase());
};

Utils.isChrome = function() {
  return /chrome/.test(navigator.userAgent.toLowerCase());
};

Utils.isLocal = function() {
  return Utils.isLocalUrl(window.location.href);
};

Utils.isLocalUrl = function(url) {
  return url.slice(0, 7) === "file://";
};

Utils.devicePixelRatio = function() {
  return window.devicePixelRatio;
};

Utils.pathJoin = function() {
  return Utils.arrayFromArguments(arguments).join("/");
};

Utils.round = function(value, decimals) {
  var d;
  d = Math.pow(10, decimals);
  return Math.round(value * d) / d;
};

Utils.mapRange = function(value, fromLow, fromHigh, toLow, toHigh) {
  return toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow));
};

Utils.modulate = function(value, rangeA, rangeB, limit) {
  var fromHigh, fromLow, result, toHigh, toLow;
  if (limit == null) {
    limit = false;
  }
  fromLow = rangeA[0], fromHigh = rangeA[1];
  toLow = rangeB[0], toHigh = rangeB[1];
  result = toLow + (((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow));
  if (limit === true) {
    if (result < toLow) {
      return toLow;
    }
    if (result > toHigh) {
      return toHigh;
    }
  }
  return result;
};

Utils.parseFunction = function(str) {
  var result;
  result = {
    name: "",
    args: []
  };
  if (_.endsWith(str, ")")) {
    result.name = str.split("(")[0];
    result.args = str.split("(")[1].split(",").map(function(a) {
      return _.trim(_.rtrim(a, ")"));
    });
  } else {
    result.name = str;
  }
  return result;
};

__domComplete = [];

if (typeof document !== "undefined" && document !== null) {
  document.onreadystatechange = function(event) {
    var f, _results;
    if (document.readyState === "complete") {
      _results = [];
      while (__domComplete.length) {
        _results.push(f = __domComplete.shift()());
      }
      return _results;
    }
  };
}

Utils.domComplete = function(f) {
  if (document.readyState === "complete") {
    return f();
  } else {
    return __domComplete.push(f);
  }
};

Utils.domCompleteCancel = function(f) {
  return __domComplete = _.without(__domComplete, f);
};

Utils.domLoadScript = function(url, callback) {
  var head, script;
  script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.onload = callback;
  head = document.getElementsByTagName("head")[0];
  head.appendChild(script);
  return script;
};

Utils.domLoadData = function(path, callback) {
  var request;
  request = new XMLHttpRequest();
  request.addEventListener("load", function() {
    return callback(null, request.responseText);
  }, false);
  request.addEventListener("error", function() {
    return callback(true, null);
  }, false);
  request.open("GET", path, true);
  return request.send(null);
};

Utils.domLoadJSON = function(path, callback) {
  return Utils.domLoadData(path, function(err, data) {
    return callback(err, JSON.parse(data));
  });
};

Utils.domLoadDataSync = function(path) {
  var data, e, request;
  request = new XMLHttpRequest();
  request.open("GET", path, false);
  try {
    request.send(null);
  } catch (_error) {
    e = _error;
    console.debug("XMLHttpRequest.error", e);
  }
  data = request.responseText;
  if (!data) {
    throw Error("Utils.domLoadDataSync: no data was loaded (url not found?)");
  }
  return request.responseText;
};

Utils.domLoadJSONSync = function(path) {
  return JSON.parse(Utils.domLoadDataSync(path));
};

Utils.domLoadScriptSync = function(path) {
  var scriptData;
  scriptData = Utils.domLoadDataSync(path);
  eval(scriptData);
  return scriptData;
};

Utils.pointMin = function() {
  var point, points;
  points = Utils.arrayFromArguments(arguments);
  return point = {
    x: _.min(point.map(function(size) {
      return size.x;
    })),
    y: _.min(point.map(function(size) {
      return size.y;
    }))
  };
};

Utils.pointMax = function() {
  var point, points;
  points = Utils.arrayFromArguments(arguments);
  return point = {
    x: _.max(point.map(function(size) {
      return size.x;
    })),
    y: _.max(point.map(function(size) {
      return size.y;
    }))
  };
};

Utils.pointDistance = function(pointA, pointB) {
  var distance;
  return distance = {
    x: Math.abs(pointB.x - pointA.x),
    y: Math.abs(pointB.y - pointA.y)
  };
};

Utils.pointInvert = function(point) {
  return point = {
    x: 0 - point.x,
    y: 0 - point.y
  };
};

Utils.pointTotal = function(point) {
  return point.x + point.y;
};

Utils.pointAbs = function(point) {
  return point = {
    x: Math.abs(point.x),
    y: Math.abs(point.y)
  };
};

Utils.pointInFrame = function(point, frame) {
  if (point.x < frame.minX || point.x > frame.maxX) {
    return false;
  }
  if (point.y < frame.minY || point.y > frame.maxY) {
    return false;
  }
  return true;
};

Utils.sizeMin = function() {
  var size, sizes;
  sizes = Utils.arrayFromArguments(arguments);
  return size = {
    width: _.min(sizes.map(function(size) {
      return size.width;
    })),
    height: _.min(sizes.map(function(size) {
      return size.height;
    }))
  };
};

Utils.sizeMax = function() {
  var size, sizes;
  sizes = Utils.arrayFromArguments(arguments);
  return size = {
    width: _.max(sizes.map(function(size) {
      return size.width;
    })),
    height: _.max(sizes.map(function(size) {
      return size.height;
    }))
  };
};

Utils.frameGetMinX = function(frame) {
  return frame.x;
};

Utils.frameSetMinX = function(frame, value) {
  return frame.x = value;
};

Utils.frameGetMidX = function(frame) {
  if (frame.width === 0) {
    return 0;
  } else {
    return frame.x + (frame.width / 2.0);
  }
};

Utils.frameSetMidX = function(frame, value) {
  return frame.x = frame.width === 0 ? 0 : value - (frame.width / 2.0);
};

Utils.frameGetMaxX = function(frame) {
  if (frame.width === 0) {
    return 0;
  } else {
    return frame.x + frame.width;
  }
};

Utils.frameSetMaxX = function(frame, value) {
  return frame.x = frame.width === 0 ? 0 : value - frame.width;
};

Utils.frameGetMinY = function(frame) {
  return frame.y;
};

Utils.frameSetMinY = function(frame, value) {
  return frame.y = value;
};

Utils.frameGetMidY = function(frame) {
  if (frame.height === 0) {
    return 0;
  } else {
    return frame.y + (frame.height / 2.0);
  }
};

Utils.frameSetMidY = function(frame, value) {
  return frame.y = frame.height === 0 ? 0 : value - (frame.height / 2.0);
};

Utils.frameGetMaxY = function(frame) {
  if (frame.height === 0) {
    return 0;
  } else {
    return frame.y + frame.height;
  }
};

Utils.frameSetMaxY = function(frame, value) {
  return frame.y = frame.height === 0 ? 0 : value - frame.height;
};

Utils.frameSize = function(frame) {
  var size;
  return size = {
    width: frame.width,
    height: frame.height
  };
};

Utils.framePoint = function(frame) {
  var point;
  return point = {
    x: frame.x,
    y: frame.y
  };
};

Utils.frameMerge = function() {
  var frame, frames;
  frames = Utils.arrayFromArguments(arguments);
  frame = {
    x: _.min(frames.map(Utils.frameGetMinX)),
    y: _.min(frames.map(Utils.frameGetMinY))
  };
  frame.width = _.max(frames.map(Utils.frameGetMaxX)) - frame.x;
  frame.height = _.max(frames.map(Utils.frameGetMaxY)) - frame.y;
  return frame;
};

Utils.convertPoint = function(input, layerA, layerB) {
  var k, layer, point, superLayersA, superLayersB, _i, _j, _k, _len, _len1, _len2, _ref;
  point = {};
  _ref = ["x", "y", "width", "height"];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    k = _ref[_i];
    point[k] = input[k];
  }
  superLayersA = (layerA != null ? layerA.superLayers() : void 0) || [];
  superLayersB = (layerB != null ? layerB.superLayers() : void 0) || [];
  if (layerB) {
    superLayersB.push(layerB);
  }
  for (_j = 0, _len1 = superLayersA.length; _j < _len1; _j++) {
    layer = superLayersA[_j];
    point.x += layer.x - layer.scrollFrame.x;
    point.y += layer.y - layer.scrollFrame.y;
  }
  for (_k = 0, _len2 = superLayersB.length; _k < _len2; _k++) {
    layer = superLayersB[_k];
    point.x -= layer.x + layer.scrollFrame.x;
    point.y -= layer.y + layer.scrollFrame.y;
  }
  return point;
};

_.extend(exports, Utils);


},{"./Underscore":22}],24:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};/**
 * @license
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modern -o ./dist/lodash.js`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre ES5 environments */
  var undefined;

  /** Used to pool arrays and objects used internally */
  var arrayPool = [],
      objectPool = [];

  /** Used to generate unique IDs */
  var idCounter = 0;

  /** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
  var keyPrefix = +new Date + '';

  /** Used as the size when optimizations are enabled for large arrays */
  var largeArraySize = 75;

  /** Used as the max size of the `arrayPool` and `objectPool` */
  var maxPoolSize = 40;

  /** Used to detect and test whitespace */
  var whitespace = (
    // whitespace
    ' \t\x0B\f\xA0\ufeff' +

    // line terminators
    '\n\r\u2028\u2029' +

    // unicode category "Zs" space separators
    '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
  );

  /** Used to match empty string literals in compiled template source */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /**
   * Used to match ES6 template delimiters
   * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-literals-string-literals
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match regexp flags from their coerced string values */
  var reFlags = /\w*$/;

  /** Used to detected named functions */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;

  /** Used to match "interpolate" template delimiters */
  var reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match leading whitespace and zeros to be removed */
  var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');

  /** Used to ensure capturing order of template delimiters */
  var reNoMatch = /($^)/;

  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;

  /** Used to match unescaped characters in compiled string literals */
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  /** Used to assign default `context` object properties */
  var contextProps = [
    'Array', 'Boolean', 'Date', 'Function', 'Math', 'Number', 'Object',
    'RegExp', 'String', '_', 'attachEvent', 'clearTimeout', 'isFinite', 'isNaN',
    'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify */
  var templateCounter = 0;

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Used to identify object classifications that `_.clone` supports */
  var cloneableClasses = {};
  cloneableClasses[funcClass] = false;
  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

  /** Used as an internal `_.debounce` options object */
  var debounceOptions = {
    'leading': false,
    'maxWait': 0,
    'trailing': false
  };

  /** Used as the property descriptor for `__bindData__` */
  var descriptor = {
    'configurable': false,
    'enumerable': false,
    'value': null,
    'writable': false
  };

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  /** Used to escape characters for inclusion in compiled string literals */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports` */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `_.indexOf` without support for binary searches
   * or `fromIndex` constraints.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the matched value or `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    var index = (fromIndex || 0) - 1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * An implementation of `_.contains` for cache objects that mimics the return
   * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
   *
   * @private
   * @param {Object} cache The cache object to inspect.
   * @param {*} value The value to search for.
   * @returns {number} Returns `0` if `value` is found, else `-1`.
   */
  function cacheIndexOf(cache, value) {
    var type = typeof value;
    cache = cache.cache;

    if (type == 'boolean' || value == null) {
      return cache[value] ? 0 : -1;
    }
    if (type != 'number' && type != 'string') {
      type = 'object';
    }
    var key = type == 'number' ? value : keyPrefix + value;
    cache = (cache = cache[type]) && cache[key];

    return type == 'object'
      ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1)
      : (cache ? 0 : -1);
  }

  /**
   * Adds a given value to the corresponding cache object.
   *
   * @private
   * @param {*} value The value to add to the cache.
   */
  function cachePush(value) {
    var cache = this.cache,
        type = typeof value;

    if (type == 'boolean' || value == null) {
      cache[value] = true;
    } else {
      if (type != 'number' && type != 'string') {
        type = 'object';
      }
      var key = type == 'number' ? value : keyPrefix + value,
          typeCache = cache[type] || (cache[type] = {});

      if (type == 'object') {
        (typeCache[key] || (typeCache[key] = [])).push(value);
      } else {
        typeCache[key] = true;
      }
    }
  }

  /**
   * Used by `_.max` and `_.min` as the default callback when a given
   * collection is a string value.
   *
   * @private
   * @param {string} value The character to inspect.
   * @returns {number} Returns the code unit of given character.
   */
  function charAtCallback(value) {
    return value.charCodeAt(0);
  }

  /**
   * Used by `sortBy` to compare transformed `collection` elements, stable sorting
   * them in ascending order.
   *
   * @private
   * @param {Object} a The object to compare to `b`.
   * @param {Object} b The object to compare to `a`.
   * @returns {number} Returns the sort order indicator of `1` or `-1`.
   */
  function compareAscending(a, b) {
    var ac = a.criteria,
        bc = b.criteria,
        index = -1,
        length = ac.length;

    while (++index < length) {
      var value = ac[index],
          other = bc[index];

      if (value !== other) {
        if (value > other || typeof value == 'undefined') {
          return 1;
        }
        if (value < other || typeof other == 'undefined') {
          return -1;
        }
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to return the same value for
    // `a` and `b`. See https://github.com/jashkenas/underscore/pull/1247
    //
    // This also ensures a stable sort in V8 and other engines.
    // See http://code.google.com/p/v8/issues/detail?id=90
    return a.index - b.index;
  }

  /**
   * Creates a cache object to optimize linear searches of large arrays.
   *
   * @private
   * @param {Array} [array=[]] The array to search.
   * @returns {null|Object} Returns the cache object or `null` if caching should not be used.
   */
  function createCache(array) {
    var index = -1,
        length = array.length,
        first = array[0],
        mid = array[(length / 2) | 0],
        last = array[length - 1];

    if (first && typeof first == 'object' &&
        mid && typeof mid == 'object' && last && typeof last == 'object') {
      return false;
    }
    var cache = getObject();
    cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

    var result = getObject();
    result.array = array;
    result.cache = cache;
    result.push = cachePush;

    while (++index < length) {
      result.push(array[index]);
    }
    return result;
  }

  /**
   * Used by `template` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {string} match The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(match) {
    return '\\' + stringEscapes[match];
  }

  /**
   * Gets an array from the array pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Array} The array from the pool.
   */
  function getArray() {
    return arrayPool.pop() || [];
  }

  /**
   * Gets an object from the object pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Object} The object from the pool.
   */
  function getObject() {
    return objectPool.pop() || {
      'array': null,
      'cache': null,
      'criteria': null,
      'false': false,
      'index': 0,
      'null': false,
      'number': null,
      'object': null,
      'push': null,
      'string': null,
      'true': false,
      'undefined': false,
      'value': null
    };
  }

  /**
   * Releases the given array back to the array pool.
   *
   * @private
   * @param {Array} [array] The array to release.
   */
  function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
      arrayPool.push(array);
    }
  }

  /**
   * Releases the given object back to the object pool.
   *
   * @private
   * @param {Object} [object] The object to release.
   */
  function releaseObject(object) {
    var cache = object.cache;
    if (cache) {
      releaseObject(cache);
    }
    object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
    if (objectPool.length < maxPoolSize) {
      objectPool.push(object);
    }
  }

  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used instead of `Array#slice` to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|string} collection The collection to slice.
   * @param {number} start The start index.
   * @param {number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);

    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new `lodash` function using the given context object.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns the `lodash` function.
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See http://es5.github.io/#x11.1.5.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references */
    var Array = context.Array,
        Boolean = context.Boolean,
        Date = context.Date,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /**
     * Used for `Array` method references.
     *
     * Normally `Array.prototype` would suffice, however, using an array literal
     * avoids issues in Narwhal.
     */
    var arrayRef = [];

    /** Used for native method references */
    var objectProto = Object.prototype;

    /** Used to restore the original `_` reference in `noConflict` */
    var oldDash = context._;

    /** Used to resolve the internal [[Class]] of values */
    var toString = objectProto.toString;

    /** Used to detect if a method is native */
    var reNative = RegExp('^' +
      String(toString)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/toString| for [^\]]+/g, '.*?') + '$'
    );

    /** Native method shortcuts */
    var ceil = Math.ceil,
        clearTimeout = context.clearTimeout,
        floor = Math.floor,
        fnToString = Function.prototype.toString,
        getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
        hasOwnProperty = objectProto.hasOwnProperty,
        push = arrayRef.push,
        setTimeout = context.setTimeout,
        splice = arrayRef.splice,
        unshift = arrayRef.unshift;

    /** Used to set meta data on functions */
    var defineProperty = (function() {
      // IE 8 only accepts DOM elements
      try {
        var o = {},
            func = isNative(func = Object.defineProperty) && func,
            result = func(o, o, o) && func;
      } catch(e) { }
      return result;
    }());

    /* Native method shortcuts for methods with the same name as other `lodash` methods */
    var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
        nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
        nativeIsFinite = context.isFinite,
        nativeIsNaN = context.isNaN,
        nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random;

    /** Used to lookup a built-in constructor by [[Class]] */
    var ctorByClass = {};
    ctorByClass[arrayClass] = Array;
    ctorByClass[boolClass] = Boolean;
    ctorByClass[dateClass] = Date;
    ctorByClass[funcClass] = Function;
    ctorByClass[objectClass] = Object;
    ctorByClass[numberClass] = Number;
    ctorByClass[regexpClass] = RegExp;
    ctorByClass[stringClass] = String;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps the given value to enable intuitive
     * method chaining.
     *
     * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
     * and `unshift`
     *
     * Chaining is supported in custom builds as long as the `value` method is
     * implicitly or explicitly included in the build.
     *
     * The chainable wrapper functions are:
     * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
     * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
     * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
     * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
     * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
     * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
     * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
     * and `zip`
     *
     * The non-chainable wrapper functions are:
     * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
     * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
     * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
     * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
     * `template`, `unescape`, `uniqueId`, and `value`
     *
     * The wrapper functions `first` and `last` return wrapped values when `n` is
     * provided, otherwise they return unwrapped values.
     *
     * Explicit chaining can be enabled by using the `_.chain` method.
     *
     * @name _
     * @constructor
     * @category Chaining
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns a `lodash` instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(num) {
     *   return num * num;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
      return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
       ? value
       : new lodashWrapper(value);
    }

    /**
     * A fast path for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap in a `lodash` instance.
     * @param {boolean} chainAll A flag to enable chaining for all methods
     * @returns {Object} Returns a `lodash` instance.
     */
    function lodashWrapper(value, chainAll) {
      this.__chain__ = !!chainAll;
      this.__wrapped__ = value;
    }
    // ensure `new lodashWrapper` is an instance of `lodash`
    lodashWrapper.prototype = lodash.prototype;

    /**
     * An object used to flag environments features.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    /**
     * Detect if functions can be decompiled by `Function#toString`
     * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);

    /**
     * Detect if `Function#name` is supported (all but IE).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcNames = typeof Function.name == 'string';

    /**
     * By default, the template delimiters used by Lo-Dash are similar to those in
     * embedded Ruby (ERB). Change the following template settings to use alternative
     * delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': /<%-([\s\S]+?)%>/g,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': /<%([\s\S]+?)%>/g,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*--------------------------------------------------------------------------*/

    /**
     * The base implementation of `_.bind` that creates the bound function and
     * sets its meta data.
     *
     * @private
     * @param {Array} bindData The bind data array.
     * @returns {Function} Returns the new bound function.
     */
    function baseBind(bindData) {
      var func = bindData[0],
          partialArgs = bindData[2],
          thisArg = bindData[4];

      function bound() {
        // `Function#bind` spec
        // http://es5.github.io/#x15.3.4.5
        if (partialArgs) {
          // avoid `arguments` object deoptimizations by using `slice` instead
          // of `Array.prototype.slice.call` and not assigning `arguments` to a
          // variable as a ternary expression
          var args = slice(partialArgs);
          push.apply(args, arguments);
        }
        // mimic the constructor's `return` behavior
        // http://es5.github.io/#x13.2.2
        if (this instanceof bound) {
          // ensure `new bound` is an instance of `func`
          var thisBinding = baseCreate(func.prototype),
              result = func.apply(thisBinding, args || arguments);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisArg, args || arguments);
      }
      setBindData(bound, bindData);
      return bound;
    }

    /**
     * The base implementation of `_.clone` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, callback, stackA, stackB) {
      if (callback) {
        var result = callback(value);
        if (typeof result != 'undefined') {
          return result;
        }
      }
      // inspect [[Class]]
      var isObj = isObject(value);
      if (isObj) {
        var className = toString.call(value);
        if (!cloneableClasses[className]) {
          return value;
        }
        var ctor = ctorByClass[className];
        switch (className) {
          case boolClass:
          case dateClass:
            return new ctor(+value);

          case numberClass:
          case stringClass:
            return new ctor(value);

          case regexpClass:
            result = ctor(value.source, reFlags.exec(value));
            result.lastIndex = value.lastIndex;
            return result;
        }
      } else {
        return value;
      }
      var isArr = isArray(value);
      if (isDeep) {
        // check for circular references and return corresponding clone
        var initedStack = !stackA;
        stackA || (stackA = getArray());
        stackB || (stackB = getArray());

        var length = stackA.length;
        while (length--) {
          if (stackA[length] == value) {
            return stackB[length];
          }
        }
        result = isArr ? ctor(value.length) : {};
      }
      else {
        result = isArr ? slice(value) : assign({}, value);
      }
      // add array properties assigned by `RegExp#exec`
      if (isArr) {
        if (hasOwnProperty.call(value, 'index')) {
          result.index = value.index;
        }
        if (hasOwnProperty.call(value, 'input')) {
          result.input = value.input;
        }
      }
      // exit for shallow clone
      if (!isDeep) {
        return result;
      }
      // add the source value to the stack of traversed objects
      // and associate it with its clone
      stackA.push(value);
      stackB.push(result);

      // recursively populate clone (susceptible to call stack limits)
      (isArr ? forEach : forOwn)(value, function(objValue, key) {
        result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
      });

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    function baseCreate(prototype, properties) {
      return isObject(prototype) ? nativeCreate(prototype) : {};
    }
    // fallback for browsers without `Object.create`
    if (!nativeCreate) {
      baseCreate = (function() {
        function Object() {}
        return function(prototype) {
          if (isObject(prototype)) {
            Object.prototype = prototype;
            var result = new Object;
            Object.prototype = null;
          }
          return result || context.Object();
        };
      }());
    }

    /**
     * The base implementation of `_.createCallback` without support for creating
     * "_.pluck" or "_.where" style callbacks.
     *
     * @private
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     */
    function baseCreateCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      // exit early for no `thisArg` or already bound by `Function#bind`
      if (typeof thisArg == 'undefined' || !('prototype' in func)) {
        return func;
      }
      var bindData = func.__bindData__;
      if (typeof bindData == 'undefined') {
        if (support.funcNames) {
          bindData = !func.name;
        }
        bindData = bindData || !support.funcDecomp;
        if (!bindData) {
          var source = fnToString.call(func);
          if (!support.funcNames) {
            bindData = !reFuncName.test(source);
          }
          if (!bindData) {
            // checks if `func` references the `this` keyword and stores the result
            bindData = reThis.test(source);
            setBindData(func, bindData);
          }
        }
      }
      // exit early if there are no `this` references or `func` is bound
      if (bindData === false || (bindData !== true && bindData[1] & 1)) {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 2: return function(a, b) {
          return func.call(thisArg, a, b);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
      }
      return bind(func, thisArg);
    }

    /**
     * The base implementation of `createWrapper` that creates the wrapper and
     * sets its meta data.
     *
     * @private
     * @param {Array} bindData The bind data array.
     * @returns {Function} Returns the new function.
     */
    function baseCreateWrapper(bindData) {
      var func = bindData[0],
          bitmask = bindData[1],
          partialArgs = bindData[2],
          partialRightArgs = bindData[3],
          thisArg = bindData[4],
          arity = bindData[5];

      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          key = func;

      function bound() {
        var thisBinding = isBind ? thisArg : this;
        if (partialArgs) {
          var args = slice(partialArgs);
          push.apply(args, arguments);
        }
        if (partialRightArgs || isCurry) {
          args || (args = slice(arguments));
          if (partialRightArgs) {
            push.apply(args, partialRightArgs);
          }
          if (isCurry && args.length < arity) {
            bitmask |= 16 & ~32;
            return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
          }
        }
        args || (args = arguments);
        if (isBindKey) {
          func = thisBinding[key];
        }
        if (this instanceof bound) {
          thisBinding = baseCreate(func.prototype);
          var result = func.apply(thisBinding, args);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisBinding, args);
      }
      setBindData(bound, bindData);
      return bound;
    }

    /**
     * The base implementation of `_.difference` that accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {Array} [values] The array of values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     */
    function baseDifference(array, values) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          isLarge = length >= largeArraySize && indexOf === baseIndexOf,
          result = [];

      if (isLarge) {
        var cache = createCache(values);
        if (cache) {
          indexOf = cacheIndexOf;
          values = cache;
        } else {
          isLarge = false;
        }
      }
      while (++index < length) {
        var value = array[index];
        if (indexOf(values, value) < 0) {
          result.push(value);
        }
      }
      if (isLarge) {
        releaseObject(values);
      }
      return result;
    }

    /**
     * The base implementation of `_.flatten` without support for callback
     * shorthands or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
     * @param {number} [fromIndex=0] The index to start from.
     * @returns {Array} Returns a new flattened array.
     */
    function baseFlatten(array, isShallow, isStrict, fromIndex) {
      var index = (fromIndex || 0) - 1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];

        if (value && typeof value == 'object' && typeof value.length == 'number'
            && (isArray(value) || isArguments(value))) {
          // recursively flatten arrays (susceptible to call stack limits)
          if (!isShallow) {
            value = baseFlatten(value, isShallow, isStrict);
          }
          var valIndex = -1,
              valLength = value.length,
              resIndex = result.length;

          result.length += valLength;
          while (++valIndex < valLength) {
            result[resIndex++] = value[valIndex];
          }
        } else if (!isStrict) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.isEqual`, without support for `thisArg` binding,
     * that allows partial "_.where" style comparisons.
     *
     * @private
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `a` objects.
     * @param {Array} [stackB=[]] Tracks traversed `b` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
      // used to indicate that when comparing objects, `a` has at least the properties of `b`
      if (callback) {
        var result = callback(a, b);
        if (typeof result != 'undefined') {
          return !!result;
        }
      }
      // exit early for identical values
      if (a === b) {
        // treat `+0` vs. `-0` as not equal
        return a !== 0 || (1 / a == 1 / b);
      }
      var type = typeof a,
          otherType = typeof b;

      // exit early for unlike primitive values
      if (a === a &&
          !(a && objectTypes[type]) &&
          !(b && objectTypes[otherType])) {
        return false;
      }
      // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
      // http://es5.github.io/#x15.3.4.4
      if (a == null || b == null) {
        return a === b;
      }
      // compare [[Class]] names
      var className = toString.call(a),
          otherClass = toString.call(b);

      if (className == argsClass) {
        className = objectClass;
      }
      if (otherClass == argsClass) {
        otherClass = objectClass;
      }
      if (className != otherClass) {
        return false;
      }
      switch (className) {
        case boolClass:
        case dateClass:
          // coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
          return +a == +b;

        case numberClass:
          // treat `NaN` vs. `NaN` as equal
          return (a != +a)
            ? b != +b
            // but treat `+0` vs. `-0` as not equal
            : (a == 0 ? (1 / a == 1 / b) : a == +b);

        case regexpClass:
        case stringClass:
          // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
          // treat string primitives and their corresponding object instances as equal
          return a == String(b);
      }
      var isArr = className == arrayClass;
      if (!isArr) {
        // unwrap any `lodash` wrapped values
        var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
            bWrapped = hasOwnProperty.call(b, '__wrapped__');

        if (aWrapped || bWrapped) {
          return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
        }
        // exit for functions and DOM nodes
        if (className != objectClass) {
          return false;
        }
        // in older versions of Opera, `arguments` objects have `Array` constructors
        var ctorA = a.constructor,
            ctorB = b.constructor;

        // non `Object` object instances with different constructors are not equal
        if (ctorA != ctorB &&
              !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
              ('constructor' in a && 'constructor' in b)
            ) {
          return false;
        }
      }
      // assume cyclic structures are equal
      // the algorithm for detecting cyclic structures is adapted from ES 5.1
      // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
      var initedStack = !stackA;
      stackA || (stackA = getArray());
      stackB || (stackB = getArray());

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == a) {
          return stackB[length] == b;
        }
      }
      var size = 0;
      result = true;

      // add `a` and `b` to the stack of traversed objects
      stackA.push(a);
      stackB.push(b);

      // recursively compare objects and arrays (susceptible to call stack limits)
      if (isArr) {
        // compare lengths to determine if a deep comparison is necessary
        length = a.length;
        size = b.length;
        result = size == length;

        if (result || isWhere) {
          // deep compare the contents, ignoring non-numeric properties
          while (size--) {
            var index = length,
                value = b[size];

            if (isWhere) {
              while (index--) {
                if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
                  break;
                }
              }
            } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
              break;
            }
          }
        }
      }
      else {
        // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
        // which, in this case, is more costly
        forIn(b, function(value, key, b) {
          if (hasOwnProperty.call(b, key)) {
            // count the number of properties.
            size++;
            // deep compare each property value.
            return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
          }
        });

        if (result && !isWhere) {
          // ensure both objects have the same number of properties
          forIn(a, function(value, key, a) {
            if (hasOwnProperty.call(a, key)) {
              // `size` will be `-1` if `a` has more properties than `b`
              return (result = --size > -1);
            }
          });
        }
      }
      stackA.pop();
      stackB.pop();

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * The base implementation of `_.merge` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     */
    function baseMerge(object, source, callback, stackA, stackB) {
      (isArray(source) ? forEach : forOwn)(source, function(source, key) {
        var found,
            isArr,
            result = source,
            value = object[key];

        if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
          // avoid merging previously merged cyclic sources
          var stackLength = stackA.length;
          while (stackLength--) {
            if ((found = stackA[stackLength] == source)) {
              value = stackB[stackLength];
              break;
            }
          }
          if (!found) {
            var isShallow;
            if (callback) {
              result = callback(value, source);
              if ((isShallow = typeof result != 'undefined')) {
                value = result;
              }
            }
            if (!isShallow) {
              value = isArr
                ? (isArray(value) ? value : [])
                : (isPlainObject(value) ? value : {});
            }
            // add `source` and associated `value` to the stack of traversed objects
            stackA.push(source);
            stackB.push(value);

            // recursively merge objects and arrays (susceptible to call stack limits)
            if (!isShallow) {
              baseMerge(value, source, callback, stackA, stackB);
            }
          }
        }
        else {
          if (callback) {
            result = callback(value, source);
            if (typeof result == 'undefined') {
              result = source;
            }
          }
          if (typeof result != 'undefined') {
            value = result;
          }
        }
        object[key] = value;
      });
    }

    /**
     * The base implementation of `_.random` without argument juggling or support
     * for returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns a random number.
     */
    function baseRandom(min, max) {
      return min + floor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function} [callback] The function called per iteration.
     * @returns {Array} Returns a duplicate-value-free array.
     */
    function baseUniq(array, isSorted, callback) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          result = [];

      var isLarge = !isSorted && length >= largeArraySize && indexOf === baseIndexOf,
          seen = (callback || isLarge) ? getArray() : result;

      if (isLarge) {
        var cache = createCache(seen);
        indexOf = cacheIndexOf;
        seen = cache;
      }
      while (++index < length) {
        var value = array[index],
            computed = callback ? callback(value, index, array) : value;

        if (isSorted
              ? !index || seen[seen.length - 1] !== computed
              : indexOf(seen, computed) < 0
            ) {
          if (callback || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      if (isLarge) {
        releaseArray(seen.array);
        releaseObject(seen);
      } else if (callback) {
        releaseArray(seen);
      }
      return result;
    }

    /**
     * Creates a function that aggregates a collection, creating an object composed
     * of keys generated from the results of running each element of the collection
     * through a callback. The given `setter` function sets the keys and values
     * of the composed object.
     *
     * @private
     * @param {Function} setter The setter function.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter) {
      return function(collection, callback, thisArg) {
        var result = {};
        callback = lodash.createCallback(callback, thisArg, 3);

        var index = -1,
            length = collection ? collection.length : 0;

        if (typeof length == 'number') {
          while (++index < length) {
            var value = collection[index];
            setter(result, value, callback(value, index, collection), collection);
          }
        } else {
          forOwn(collection, function(value, key, collection) {
            setter(result, value, callback(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a function that, when called, either curries or invokes `func`
     * with an optional `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of method flags to compose.
     *  The bitmask may be composed of the following flags:
     *  1 - `_.bind`
     *  2 - `_.bindKey`
     *  4 - `_.curry`
     *  8 - `_.curry` (bound)
     *  16 - `_.partial`
     *  32 - `_.partialRight`
     * @param {Array} [partialArgs] An array of arguments to prepend to those
     *  provided to the new function.
     * @param {Array} [partialRightArgs] An array of arguments to append to those
     *  provided to the new function.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new function.
     */
    function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          isPartial = bitmask & 16,
          isPartialRight = bitmask & 32;

      if (!isBindKey && !isFunction(func)) {
        throw new TypeError;
      }
      if (isPartial && !partialArgs.length) {
        bitmask &= ~16;
        isPartial = partialArgs = false;
      }
      if (isPartialRight && !partialRightArgs.length) {
        bitmask &= ~32;
        isPartialRight = partialRightArgs = false;
      }
      var bindData = func && func.__bindData__;
      if (bindData && bindData !== true) {
        // clone `bindData`
        bindData = slice(bindData);
        if (bindData[2]) {
          bindData[2] = slice(bindData[2]);
        }
        if (bindData[3]) {
          bindData[3] = slice(bindData[3]);
        }
        // set `thisBinding` is not previously bound
        if (isBind && !(bindData[1] & 1)) {
          bindData[4] = thisArg;
        }
        // set if previously bound but not currently (subsequent curried functions)
        if (!isBind && bindData[1] & 1) {
          bitmask |= 8;
        }
        // set curried arity if not yet set
        if (isCurry && !(bindData[1] & 4)) {
          bindData[5] = arity;
        }
        // append partial left arguments
        if (isPartial) {
          push.apply(bindData[2] || (bindData[2] = []), partialArgs);
        }
        // append partial right arguments
        if (isPartialRight) {
          unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
        }
        // merge flags
        bindData[1] |= bitmask;
        return createWrapper.apply(null, bindData);
      }
      // fast path for `_.bind`
      var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
      return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
    }

    /**
     * Used by `escape` to convert characters to HTML entities.
     *
     * @private
     * @param {string} match The matched character to escape.
     * @returns {string} Returns the escaped character.
     */
    function escapeHtmlChar(match) {
      return htmlEscapes[match];
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized, this method returns the custom method, otherwise it returns
     * the `baseIndexOf` function.
     *
     * @private
     * @returns {Function} Returns the "indexOf" function.
     */
    function getIndexOf() {
      var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
      return result;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
     */
    function isNative(value) {
      return typeof value == 'function' && reNative.test(value);
    }

    /**
     * Sets `this` binding data on a given function.
     *
     * @private
     * @param {Function} func The function to set data on.
     * @param {Array} value The data array to set.
     */
    var setBindData = !defineProperty ? noop : function(func, value) {
      descriptor.value = value;
      defineProperty(func, '__bindData__', descriptor);
    };

    /**
     * A fallback implementation of `isPlainObject` which checks if a given value
     * is an object created by the `Object` constructor, assuming objects created
     * by the `Object` constructor have no inherited enumerable properties and that
     * there are no `Object.prototype` extensions.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     */
    function shimIsPlainObject(value) {
      var ctor,
          result;

      // avoid non Object objects, `arguments` objects, and DOM elements
      if (!(value && toString.call(value) == objectClass) ||
          (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
        return false;
      }
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      forIn(value, function(value, key) {
        result = key;
      });
      return typeof result == 'undefined' || hasOwnProperty.call(value, result);
    }

    /**
     * Used by `unescape` to convert HTML entities to characters.
     *
     * @private
     * @param {string} match The matched character to unescape.
     * @returns {string} Returns the unescaped character.
     */
    function unescapeHtmlChar(match) {
      return htmlUnescapes[match];
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Checks if `value` is an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
     * @example
     *
     * (function() { return _.isArguments(arguments); })(1, 2, 3);
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == argsClass || false;
    }

    /**
     * Checks if `value` is an array.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
     * @example
     *
     * (function() { return _.isArray(arguments); })();
     * // => false
     *
     * _.isArray([1, 2, 3]);
     * // => true
     */
    var isArray = nativeIsArray || function(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == arrayClass || false;
    };

    /**
     * A fallback implementation of `Object.keys` which produces an array of the
     * given object's own enumerable property names.
     *
     * @private
     * @type Function
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names.
     */
    var shimKeys = function(object) {
      var index, iterable = object, result = [];
      if (!iterable) return result;
      if (!(objectTypes[typeof object])) return result;
        for (index in iterable) {
          if (hasOwnProperty.call(iterable, index)) {
            result.push(index);
          }
        }
      return result
    };

    /**
     * Creates an array composed of the own enumerable property names of an object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names.
     * @example
     *
     * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
     * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      if (!isObject(object)) {
        return [];
      }
      return nativeKeys(object);
    };

    /**
     * Used to convert characters to HTML entities:
     *
     * Though the `>` character is escaped for symmetry, characters like `>` and `/`
     * don't require escaping in HTML and have no special meaning unless they're part
     * of a tag or an unquoted attribute value.
     * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
     */
    var htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    /** Used to convert HTML entities to characters */
    var htmlUnescapes = invert(htmlEscapes);

    /** Used to match HTML entities and HTML characters */
    var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'),
        reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

    /*--------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources will overwrite property assignments of previous
     * sources. If a callback is provided it will be executed to produce the
     * assigned values. The callback is bound to `thisArg` and invoked with two
     * arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @type Function
     * @alias extend
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize assigning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
     * // => { 'name': 'fred', 'employer': 'slate' }
     *
     * var defaults = _.partialRight(_.assign, function(a, b) {
     *   return typeof a == 'undefined' ? b : a;
     * });
     *
     * var object = { 'name': 'barney' };
     * defaults(object, { 'name': 'fred', 'employer': 'slate' });
     * // => { 'name': 'barney', 'employer': 'slate' }
     */
    var assign = function(object, source, guard) {
      var index, iterable = object, result = iterable;
      if (!iterable) return result;
      var args = arguments,
          argsIndex = 0,
          argsLength = typeof guard == 'number' ? 2 : args.length;
      if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
        var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
      } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
        callback = args[--argsLength];
      }
      while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
        }
        }
      }
      return result
    };

    /**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
     * be cloned, otherwise they will be assigned by reference. If a callback
     * is provided it will be executed to produce the cloned values. If the
     * callback returns `undefined` cloning will be handled by the method instead.
     * The callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * var shallow = _.clone(characters);
     * shallow[0] === characters[0];
     * // => true
     *
     * var deep = _.clone(characters, true);
     * deep[0] === characters[0];
     * // => false
     *
     * _.mixin({
     *   'clone': _.partialRight(_.clone, function(value) {
     *     return _.isElement(value) ? value.cloneNode(false) : undefined;
     *   })
     * });
     *
     * var clone = _.clone(document.body);
     * clone.childNodes.length;
     * // => 0
     */
    function clone(value, isDeep, callback, thisArg) {
      // allows working with "Collections" methods without using their `index`
      // and `collection` arguments for `isDeep` and `callback`
      if (typeof isDeep != 'boolean' && isDeep != null) {
        thisArg = callback;
        callback = isDeep;
        isDeep = false;
      }
      return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
    }

    /**
     * Creates a deep clone of `value`. If a callback is provided it will be
     * executed to produce the cloned values. If the callback returns `undefined`
     * cloning will be handled by the method instead. The callback is bound to
     * `thisArg` and invoked with one argument; (value).
     *
     * Note: This method is loosely based on the structured clone algorithm. Functions
     * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
     * objects created by constructors other than `Object` are cloned to plain `Object` objects.
     * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * var deep = _.cloneDeep(characters);
     * deep[0] === characters[0];
     * // => false
     *
     * var view = {
     *   'label': 'docs',
     *   'node': element
     * };
     *
     * var clone = _.cloneDeep(view, function(value) {
     *   return _.isElement(value) ? value.cloneNode(true) : undefined;
     * });
     *
     * clone.node == view.node;
     * // => false
     */
    function cloneDeep(value, callback, thisArg) {
      return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
    }

    /**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, { 'constructor': Circle });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties ? assign(result, properties) : result;
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional defaults of the same property will be ignored.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param- {Object} [guard] Allows working with `_.reduce` without using its
     *  `key` and `object` arguments as sources.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var object = { 'name': 'barney' };
     * _.defaults(object, { 'name': 'fred', 'employer': 'slate' });
     * // => { 'name': 'barney', 'employer': 'slate' }
     */
    var defaults = function(object, source, guard) {
      var index, iterable = object, result = iterable;
      if (!iterable) return result;
      var args = arguments,
          argsIndex = 0,
          argsLength = typeof guard == 'number' ? 2 : args.length;
      while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (typeof result[index] == 'undefined') result[index] = iterable[index];
        }
        }
      }
      return result
    };

    /**
     * This method is like `_.findIndex` except that it returns the key of the
     * first element that passes the callback check, instead of the element itself.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [callback=identity] The function called per
     *  iteration. If a property name or object is provided it will be used to
     *  create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * var characters = {
     *   'barney': {  'age': 36, 'blocked': false },
     *   'fred': {    'age': 40, 'blocked': true },
     *   'pebbles': { 'age': 1,  'blocked': false }
     * };
     *
     * _.findKey(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (property order is not guaranteed across environments)
     *
     * // using "_.where" callback shorthand
     * _.findKey(characters, { 'age': 1 });
     * // => 'pebbles'
     *
     * // using "_.pluck" callback shorthand
     * _.findKey(characters, 'blocked');
     * // => 'fred'
     */
    function findKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forOwn(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [callback=identity] The function called per
     *  iteration. If a property name or object is provided it will be used to
     *  create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * var characters = {
     *   'barney': {  'age': 36, 'blocked': true },
     *   'fred': {    'age': 40, 'blocked': false },
     *   'pebbles': { 'age': 1,  'blocked': true }
     * };
     *
     * _.findLastKey(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles`, assuming `_.findKey` returns `barney`
     *
     * // using "_.where" callback shorthand
     * _.findLastKey(characters, { 'age': 40 });
     * // => 'fred'
     *
     * // using "_.pluck" callback shorthand
     * _.findLastKey(characters, 'blocked');
     * // => 'pebbles'
     */
    function findLastKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forOwnRight(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over own and inherited enumerable properties of an object,
     * executing the callback for each property. The callback is bound to `thisArg`
     * and invoked with three arguments; (value, key, object). Callbacks may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.move = function(x, y) {
     *   this.x += x;
     *   this.y += y;
     * };
     *
     * _.forIn(new Shape, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
     */
    var forIn = function(collection, callback, thisArg) {
      var index, iterable = collection, result = iterable;
      if (!iterable) return result;
      if (!objectTypes[typeof iterable]) return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        for (index in iterable) {
          if (callback(iterable[index], index, collection) === false) return result;
        }
      return result
    };

    /**
     * This method is like `_.forIn` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.move = function(x, y) {
     *   this.x += x;
     *   this.y += y;
     * };
     *
     * _.forInRight(new Shape, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'move', 'y', and 'x' assuming `_.forIn ` logs 'x', 'y', and 'move'
     */
    function forInRight(object, callback, thisArg) {
      var pairs = [];

      forIn(object, function(value, key) {
        pairs.push(key, value);
      });

      var length = pairs.length;
      callback = baseCreateCallback(callback, thisArg, 3);
      while (length--) {
        if (callback(pairs[length--], pairs[length], object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * Iterates over own enumerable properties of an object, executing the callback
     * for each property. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, key, object). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
     */
    var forOwn = function(collection, callback, thisArg) {
      var index, iterable = collection, result = iterable;
      if (!iterable) return result;
      if (!objectTypes[typeof iterable]) return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (callback(iterable[index], index, collection) === false) return result;
        }
      return result
    };

    /**
     * This method is like `_.forOwn` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
     */
    function forOwnRight(object, callback, thisArg) {
      var props = keys(object),
          length = props.length;

      callback = baseCreateCallback(callback, thisArg, 3);
      while (length--) {
        var key = props[length];
        if (callback(object[key], key, object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * Creates a sorted array of property names of all enumerable properties,
     * own and inherited, of `object` that have function values.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names that have function values.
     * @example
     *
     * _.functions(_);
     * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
     */
    function functions(object) {
      var result = [];
      forIn(object, function(value, key) {
        if (isFunction(value)) {
          result.push(key);
        }
      });
      return result.sort();
    }

    /**
     * Checks if the specified property name exists as a direct property of `object`,
     * instead of an inherited property.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @param {string} key The name of the property to check.
     * @returns {boolean} Returns `true` if key is a direct property, else `false`.
     * @example
     *
     * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
     * // => true
     */
    function has(object, key) {
      return object ? hasOwnProperty.call(object, key) : false;
    }

    /**
     * Creates an object composed of the inverted keys and values of the given object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the created inverted object.
     * @example
     *
     * _.invert({ 'first': 'fred', 'second': 'barney' });
     * // => { 'fred': 'first', 'barney': 'second' }
     */
    function invert(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        result[object[key]] = key;
      }
      return result;
    }

    /**
     * Checks if `value` is a boolean value.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
     * @example
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        value && typeof value == 'object' && toString.call(value) == boolClass || false;
    }

    /**
     * Checks if `value` is a date.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     */
    function isDate(value) {
      return value && typeof value == 'object' && toString.call(value) == dateClass || false;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     */
    function isElement(value) {
      return value && value.nodeType === 1 || false;
    }

    /**
     * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
     * length of `0` and objects with no own enumerable properties are considered
     * "empty".
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({});
     * // => true
     *
     * _.isEmpty('');
     * // => true
     */
    function isEmpty(value) {
      var result = true;
      if (!value) {
        return result;
      }
      var className = toString.call(value),
          length = value.length;

      if ((className == arrayClass || className == stringClass || className == argsClass ) ||
          (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
        return !length;
      }
      forOwn(value, function() {
        return (result = false);
      });
      return result;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent to each other. If a callback is provided it will be executed
     * to compare values. If the callback returns `undefined` comparisons will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (a, b).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'name': 'fred' };
     * var copy = { 'name': 'fred' };
     *
     * object == copy;
     * // => false
     *
     * _.isEqual(object, copy);
     * // => true
     *
     * var words = ['hello', 'goodbye'];
     * var otherWords = ['hi', 'goodbye'];
     *
     * _.isEqual(words, otherWords, function(a, b) {
     *   var reGreet = /^(?:hello|hi)$/i,
     *       aGreet = _.isString(a) && reGreet.test(a),
     *       bGreet = _.isString(b) && reGreet.test(b);
     *
     *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
     * });
     * // => true
     */
    function isEqual(a, b, callback, thisArg) {
      return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
    }

    /**
     * Checks if `value` is, or can be coerced to, a finite number.
     *
     * Note: This is not the same as native `isFinite` which will return true for
     * booleans and empty strings. See http://es5.github.io/#x15.1.2.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
     * @example
     *
     * _.isFinite(-101);
     * // => true
     *
     * _.isFinite('10');
     * // => true
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite('');
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
    }

    /**
     * Checks if `value` is a function.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     */
    function isFunction(value) {
      return typeof value == 'function';
    }

    /**
     * Checks if `value` is the language type of Object.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // check if the value is the ECMAScript language type of Object
      // http://es5.github.io/#x8
      // and avoid a V8 bug
      // http://code.google.com/p/v8/issues/detail?id=2291
      return !!(value && objectTypes[typeof value]);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * Note: This is not the same as native `isNaN` which will return `true` for
     * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // `NaN` as a primitive is the only value that is not equal to itself
      // (perform the [[Class]] check first to avoid errors with some host objects in IE)
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(undefined);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is a number.
     *
     * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(8.4 * 5);
     * // => true
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        value && typeof value == 'object' && toString.call(value) == numberClass || false;
    }

    /**
     * Checks if `value` is an object created by the `Object` constructor.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * _.isPlainObject(new Shape);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     */
    var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
      if (!(value && toString.call(value) == objectClass)) {
        return false;
      }
      var valueOf = value.valueOf,
          objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

      return objProto
        ? (value == objProto || getPrototypeOf(value) == objProto)
        : shimIsPlainObject(value);
    };

    /**
     * Checks if `value` is a regular expression.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
     * @example
     *
     * _.isRegExp(/fred/);
     * // => true
     */
    function isRegExp(value) {
      return value && typeof value == 'object' && toString.call(value) == regexpClass || false;
    }

    /**
     * Checks if `value` is a string.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
     * @example
     *
     * _.isString('fred');
     * // => true
     */
    function isString(value) {
      return typeof value == 'string' ||
        value && typeof value == 'object' && toString.call(value) == stringClass || false;
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     */
    function isUndefined(value) {
      return typeof value == 'undefined';
    }

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new object with values of the results of each `callback` execution.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2, 'c': 3} , function(num) { return num * 3; });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     *
     * var characters = {
     *   'fred': { 'name': 'fred', 'age': 40 },
     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
     * };
     *
     * // using "_.pluck" callback shorthand
     * _.mapValues(characters, 'age');
     * // => { 'fred': 40, 'pebbles': 1 }
     */
    function mapValues(object, callback, thisArg) {
      var result = {};
      callback = lodash.createCallback(callback, thisArg, 3);

      forOwn(object, function(value, key, object) {
        result[key] = callback(value, key, object);
      });
      return result;
    }

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * will overwrite property assignments of previous sources. If a callback is
     * provided it will be executed to produce the merged values of the destination
     * and source properties. If the callback returns `undefined` merging will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var names = {
     *   'characters': [
     *     { 'name': 'barney' },
     *     { 'name': 'fred' }
     *   ]
     * };
     *
     * var ages = {
     *   'characters': [
     *     { 'age': 36 },
     *     { 'age': 40 }
     *   ]
     * };
     *
     * _.merge(names, ages);
     * // => { 'characters': [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred', 'age': 40 }] }
     *
     * var food = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var otherFood = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(food, otherFood, function(a, b) {
     *   return _.isArray(a) ? a.concat(b) : undefined;
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
     */
    function merge(object) {
      var args = arguments,
          length = 2;

      if (!isObject(object)) {
        return object;
      }
      // allows working with `_.reduce` and `_.reduceRight` without using
      // their `index` and `collection` arguments
      if (typeof args[2] != 'number') {
        length = args.length;
      }
      if (length > 3 && typeof args[length - 2] == 'function') {
        var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
      } else if (length > 2 && typeof args[length - 1] == 'function') {
        callback = args[--length];
      }
      var sources = slice(arguments, 1, length),
          index = -1,
          stackA = getArray(),
          stackB = getArray();

      while (++index < length) {
        baseMerge(object, sources[index], callback, stackA, stackB);
      }
      releaseArray(stackA);
      releaseArray(stackB);
      return object;
    }

    /**
     * Creates a shallow clone of `object` excluding the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a callback is provided it will be executed for each
     * property of `object` omitting the properties the callback returns truey
     * for. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [callback] The properties to omit or the
     *  function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object without the omitted properties.
     * @example
     *
     * _.omit({ 'name': 'fred', 'age': 40 }, 'age');
     * // => { 'name': 'fred' }
     *
     * _.omit({ 'name': 'fred', 'age': 40 }, function(value) {
     *   return typeof value == 'number';
     * });
     * // => { 'name': 'fred' }
     */
    function omit(object, callback, thisArg) {
      var result = {};
      if (typeof callback != 'function') {
        var props = [];
        forIn(object, function(value, key) {
          props.push(key);
        });
        props = baseDifference(props, baseFlatten(arguments, true, false, 1));

        var index = -1,
            length = props.length;

        while (++index < length) {
          var key = props[index];
          result[key] = object[key];
        }
      } else {
        callback = lodash.createCallback(callback, thisArg, 3);
        forIn(object, function(value, key, object) {
          if (!callback(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * Creates a two dimensional array of an object's key-value pairs,
     * i.e. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (property order is not guaranteed across environments)
     */
    function pairs(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates a shallow clone of `object` composed of the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a callback is provided it will be executed for each
     * property of `object` picking the properties the callback returns truey
     * for. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [callback] The function called per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object composed of the picked properties.
     * @example
     *
     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
     * // => { 'name': 'fred' }
     *
     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, function(value, key) {
     *   return key.charAt(0) != '_';
     * });
     * // => { 'name': 'fred' }
     */
    function pick(object, callback, thisArg) {
      var result = {};
      if (typeof callback != 'function') {
        var index = -1,
            props = baseFlatten(arguments, true, false, 1),
            length = isObject(object) ? props.length : 0;

        while (++index < length) {
          var key = props[index];
          if (key in object) {
            result[key] = object[key];
          }
        }
      } else {
        callback = lodash.createCallback(callback, thisArg, 3);
        forIn(object, function(value, key, object) {
          if (callback(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * An alternative to `_.reduce` this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable properties through a callback, with each callback execution
     * potentially mutating the `accumulator` object. The callback is bound to
     * `thisArg` and invoked with four arguments; (accumulator, value, key, object).
     * Callbacks may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(result, num) {
     *   num *= num;
     *   if (num % 2) {
     *     return result.push(num) < 3;
     *   }
     * });
     * // => [1, 9, 25]
     *
     * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     * });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function transform(object, callback, accumulator, thisArg) {
      var isArr = isArray(object);
      if (accumulator == null) {
        if (isArr) {
          accumulator = [];
        } else {
          var ctor = object && object.constructor,
              proto = ctor && ctor.prototype;

          accumulator = baseCreate(proto);
        }
      }
      if (callback) {
        callback = lodash.createCallback(callback, thisArg, 4);
        (isArr ? forEach : forOwn)(object, function(value, index, object) {
          return callback(accumulator, value, index, object);
        });
      }
      return accumulator;
    }

    /**
     * Creates an array composed of the own enumerable property values of `object`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property values.
     * @example
     *
     * _.values({ 'one': 1, 'two': 2, 'three': 3 });
     * // => [1, 2, 3] (property order is not guaranteed across environments)
     */
    function values(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array of elements from the specified indexes, or keys, of the
     * `collection`. Indexes may be specified as individual arguments or as arrays
     * of indexes.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [index] The indexes of `collection`
     *   to retrieve, specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns a new array of elements corresponding to the
     *  provided indexes.
     * @example
     *
     * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
     * // => ['a', 'c', 'e']
     *
     * _.at(['fred', 'barney', 'pebbles'], 0, 2);
     * // => ['fred', 'pebbles']
     */
    function at(collection) {
      var args = arguments,
          index = -1,
          props = baseFlatten(args, true, false, 1),
          length = (args[2] && args[2][args[1]] === collection) ? 1 : props.length,
          result = Array(length);

      while(++index < length) {
        result[index] = collection[props[index]];
      }
      return result;
    }

    /**
     * Checks if a given value is present in a collection using strict equality
     * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
     * offset from the end of the collection.
     *
     * @static
     * @memberOf _
     * @alias include
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {*} target The value to check for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {boolean} Returns `true` if the `target` element is found, else `false`.
     * @example
     *
     * _.contains([1, 2, 3], 1);
     * // => true
     *
     * _.contains([1, 2, 3], 1, 2);
     * // => false
     *
     * _.contains({ 'name': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.contains('pebbles', 'eb');
     * // => true
     */
    function contains(collection, target, fromIndex) {
      var index = -1,
          indexOf = getIndexOf(),
          length = collection ? collection.length : 0,
          result = false;

      fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
      if (isArray(collection)) {
        result = indexOf(collection, target, fromIndex) > -1;
      } else if (typeof length == 'number') {
        result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
      } else {
        forOwn(collection, function(value) {
          if (++index >= fromIndex) {
            return !(result = value === target);
          }
        });
      }
      return result;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through the callback. The corresponding value
     * of each key is the number of times the key was returned by the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
    });

    /**
     * Checks if the given callback returns truey value for **all** elements of
     * a collection. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if all elements passed the callback check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes']);
     * // => false
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.every(characters, 'age');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.every(characters, { 'age': 36 });
     * // => false
     */
    function every(collection, callback, thisArg) {
      var result = true;
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          if (!(result = !!callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return (result = !!callback(value, index, collection));
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning an array of all elements
     * the callback returns truey for. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that passed the callback check.
     * @example
     *
     * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [2, 4, 6]
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.filter(characters, 'blocked');
     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
     *
     * // using "_.where" callback shorthand
     * _.filter(characters, { 'age': 36 });
     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
     */
    function filter(collection, callback, thisArg) {
      var result = [];
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            result.push(value);
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result.push(value);
          }
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning the first element that
     * the callback returns truey for. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect, findWhere
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': false },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
     * ];
     *
     * _.find(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => { 'name': 'barney', 'age': 36, 'blocked': false }
     *
     * // using "_.where" callback shorthand
     * _.find(characters, { 'age': 1 });
     * // =>  { 'name': 'pebbles', 'age': 1, 'blocked': false }
     *
     * // using "_.pluck" callback shorthand
     * _.find(characters, 'blocked');
     * // => { 'name': 'fred', 'age': 40, 'blocked': true }
     */
    function find(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            return value;
          }
        }
      } else {
        var result;
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result = value;
            return false;
          }
        });
        return result;
      }
    }

    /**
     * This method is like `_.find` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(num) {
     *   return num % 2 == 1;
     * });
     * // => 3
     */
    function findLast(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forEachRight(collection, function(value, index, collection) {
        if (callback(value, index, collection)) {
          result = value;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over elements of a collection, executing the callback for each
     * element. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * Note: As with other "Collections" methods, objects with a `length` property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
     * // => logs each number and returns '1,2,3'
     *
     * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
     * // => logs each number and returns the object (property order is not guaranteed across environments)
     */
    function forEach(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;

      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        while (++index < length) {
          if (callback(collection[index], index, collection) === false) {
            break;
          }
        }
      } else {
        forOwn(collection, callback);
      }
      return collection;
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
     * // => logs each number from right to left and returns '3,2,1'
     */
    function forEachRight(collection, callback, thisArg) {
      var length = collection ? collection.length : 0;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        while (length--) {
          if (callback(collection[length], length, collection) === false) {
            break;
          }
        }
      } else {
        var props = keys(collection);
        length = props.length;
        forOwn(collection, function(value, key, collection) {
          key = props ? props[--length] : --length;
          return callback(collection[key], key, collection);
        });
      }
      return collection;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of a collection through the callback. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using "_.pluck" callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of the collection through the given callback. The corresponding
     * value of each key is the last element responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keys = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keys, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keys, function(key) { return String.fromCharCode(key.code); });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(characters, function(key) { this.fromCharCode(key.code); }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method named by `methodName` on each element in the `collection`
     * returning an array of the results of each invoked method. Additional arguments
     * will be provided to each invoked method. If `methodName` is a function it
     * will be invoked for, and `this` bound to, each element in the `collection`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|string} methodName The name of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [arg] Arguments to invoke the method with.
     * @returns {Array} Returns a new array of the results of each invoked method.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    function invoke(collection, methodName) {
      var args = slice(arguments, 2),
          index = -1,
          isFunc = typeof methodName == 'function',
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
      });
      return result;
    }

    /**
     * Creates an array of values by running each element in the collection
     * through the callback. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of the results of each `callback` execution.
     * @example
     *
     * _.map([1, 2, 3], function(num) { return num * 3; });
     * // => [3, 6, 9]
     *
     * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
     * // => [3, 6, 9] (property order is not guaranteed across environments)
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(characters, 'name');
     * // => ['barney', 'fred']
     */
    function map(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;

      callback = lodash.createCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        var result = Array(length);
        while (++index < length) {
          result[index] = callback(collection[index], index, collection);
        }
      } else {
        result = [];
        forOwn(collection, function(value, key, collection) {
          result[++index] = callback(value, key, collection);
        });
      }
      return result;
    }

    /**
     * Retrieves the maximum value of a collection. If the collection is empty or
     * falsey `-Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.max(characters, function(chr) { return chr.age; });
     * // => { 'name': 'fred', 'age': 40 };
     *
     * // using "_.pluck" callback shorthand
     * _.max(characters, 'age');
     * // => { 'name': 'fred', 'age': 40 };
     */
    function max(collection, callback, thisArg) {
      var computed = -Infinity,
          result = computed;

      // allows working with functions like `_.map` without using
      // their `index` argument as a callback
      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      if (callback == null && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value > result) {
            result = value;
          }
        }
      } else {
        callback = (callback == null && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current > computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the minimum value of a collection. If the collection is empty or
     * falsey `Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.min(characters, function(chr) { return chr.age; });
     * // => { 'name': 'barney', 'age': 36 };
     *
     * // using "_.pluck" callback shorthand
     * _.min(characters, 'age');
     * // => { 'name': 'barney', 'age': 36 };
     */
    function min(collection, callback, thisArg) {
      var computed = Infinity,
          result = computed;

      // allows working with functions like `_.map` without using
      // their `index` argument as a callback
      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      if (callback == null && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value < result) {
            result = value;
          }
        }
      } else {
        callback = (callback == null && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current < computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the value of a specified property from all elements in the collection.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {string} property The name of the property to pluck.
     * @returns {Array} Returns a new array of property values.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(characters, 'name');
     * // => ['barney', 'fred']
     */
    var pluck = map;

    /**
     * Reduces a collection to a value which is the accumulated result of running
     * each element in the collection through the callback, where each successive
     * callback execution consumes the return value of the previous execution. If
     * `accumulator` is not provided the first element of the collection will be
     * used as the initial `accumulator` value. The callback is bound to `thisArg`
     * and invoked with four arguments; (accumulator, value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var sum = _.reduce([1, 2, 3], function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function reduce(collection, callback, accumulator, thisArg) {
      if (!collection) return accumulator;
      var noaccum = arguments.length < 3;
      callback = lodash.createCallback(callback, thisArg, 4);

      var index = -1,
          length = collection.length;

      if (typeof length == 'number') {
        if (noaccum) {
          accumulator = collection[++index];
        }
        while (++index < length) {
          accumulator = callback(accumulator, collection[index], index, collection);
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          accumulator = noaccum
            ? (noaccum = false, value)
            : callback(accumulator, value, index, collection)
        });
      }
      return accumulator;
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var list = [[0, 1], [2, 3], [4, 5]];
     * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, callback, accumulator, thisArg) {
      var noaccum = arguments.length < 3;
      callback = lodash.createCallback(callback, thisArg, 4);
      forEachRight(collection, function(value, index, collection) {
        accumulator = noaccum
          ? (noaccum = false, value)
          : callback(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The opposite of `_.filter` this method returns the elements of a
     * collection that the callback does **not** return truey for.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that failed the callback check.
     * @example
     *
     * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [1, 3, 5]
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.reject(characters, 'blocked');
     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
     *
     * // using "_.where" callback shorthand
     * _.reject(characters, { 'age': 36 });
     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
     */
    function reject(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg, 3);
      return filter(collection, function(value, index, collection) {
        return !callback(value, index, collection);
      });
    }

    /**
     * Retrieves a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Allows working with functions like `_.map`
     *  without using their `index` arguments as `n`.
     * @returns {Array} Returns the random sample(s) of `collection`.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      if (collection && typeof collection.length != 'number') {
        collection = values(collection);
      }
      if (n == null || guard) {
        return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
      }
      var result = shuffle(collection);
      result.length = nativeMin(nativeMax(0, n), result.length);
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the Fisher-Yates
     * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns a new shuffled collection.
     * @example
     *
     * _.shuffle([1, 2, 3, 4, 5, 6]);
     * // => [4, 1, 6, 3, 5, 2]
     */
    function shuffle(collection) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        var rand = baseRandom(0, ++index);
        result[index] = result[rand];
        result[rand] = value;
      });
      return result;
    }

    /**
     * Gets the size of the `collection` by returning `collection.length` for arrays
     * and array-like objects or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns `collection.length` or number of own enumerable properties.
     * @example
     *
     * _.size([1, 2]);
     * // => 2
     *
     * _.size({ 'one': 1, 'two': 2, 'three': 3 });
     * // => 3
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      var length = collection ? collection.length : 0;
      return typeof length == 'number' ? length : keys(collection).length;
    }

    /**
     * Checks if the callback returns a truey value for **any** element of a
     * collection. The function returns as soon as it finds a passing value and
     * does not iterate over the entire collection. The callback is bound to
     * `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if any element passed the callback check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.some(characters, 'blocked');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.some(characters, { 'age': 1 });
     * // => false
     */
    function some(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          if ((result = callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return !(result = callback(value, index, collection));
        });
      }
      return !!result;
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through the callback. This method
     * performs a stable sort, that is, it will preserve the original sort order
     * of equal elements. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an array of property names is provided for `callback` the collection
     * will be sorted by each property value.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of sorted elements.
     * @example
     *
     * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
     * // => [3, 1, 2]
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'barney',  'age': 26 },
     *   { 'name': 'fred',    'age': 30 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(_.sortBy(characters, 'age'), _.values);
     * // => [['barney', 26], ['fred', 30], ['barney', 36], ['fred', 40]]
     *
     * // sorting by multiple properties
     * _.map(_.sortBy(characters, ['name', 'age']), _.values);
     * // = > [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
     */
    function sortBy(collection, callback, thisArg) {
      var index = -1,
          isArr = isArray(callback),
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      if (!isArr) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      forEach(collection, function(value, key, collection) {
        var object = result[++index] = getObject();
        if (isArr) {
          object.criteria = map(callback, function(key) { return value[key]; });
        } else {
          (object.criteria = getArray())[0] = callback(value, key, collection);
        }
        object.index = index;
        object.value = value;
      });

      length = result.length;
      result.sort(compareAscending);
      while (length--) {
        var object = result[length];
        result[length] = object.value;
        if (!isArr) {
          releaseArray(object.criteria);
        }
        releaseObject(object);
      }
      return result;
    }

    /**
     * Converts the `collection` to an array.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to convert.
     * @returns {Array} Returns the new converted array.
     * @example
     *
     * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
     * // => [2, 3, 4]
     */
    function toArray(collection) {
      if (collection && typeof collection.length == 'number') {
        return slice(collection);
      }
      return values(collection);
    }

    /**
     * Performs a deep comparison of each element in a `collection` to the given
     * `properties` object, returning an array of all elements that have equivalent
     * property values.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Object} props The object of property values to filter by.
     * @returns {Array} Returns a new array of elements that have the given properties.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'pets': ['hoppy'] },
     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.where(characters, { 'age': 36 });
     * // => [{ 'name': 'barney', 'age': 36, 'pets': ['hoppy'] }]
     *
     * _.where(characters, { 'pets': ['dino'] });
     * // => [{ 'name': 'fred', 'age': 40, 'pets': ['baby puss', 'dino'] }]
     */
    var where = filter;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are all falsey.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to compact.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * Creates an array excluding all values of the provided arrays using strict
     * equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
     * // => [1, 3, 4]
     */
    function difference(array) {
      return baseDifference(array, baseFlatten(arguments, true, true, 1));
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element that passes the callback check, instead of the element itself.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': false },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
     * ];
     *
     * _.findIndex(characters, function(chr) {
     *   return chr.age < 20;
     * });
     * // => 2
     *
     * // using "_.where" callback shorthand
     * _.findIndex(characters, { 'age': 36 });
     * // => 0
     *
     * // using "_.pluck" callback shorthand
     * _.findIndex(characters, 'blocked');
     * // => 1
     */
    function findIndex(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0;

      callback = lodash.createCallback(callback, thisArg, 3);
      while (++index < length) {
        if (callback(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': true },
     *   { 'name': 'fred',    'age': 40, 'blocked': false },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': true }
     * ];
     *
     * _.findLastIndex(characters, function(chr) {
     *   return chr.age > 30;
     * });
     * // => 1
     *
     * // using "_.where" callback shorthand
     * _.findLastIndex(characters, { 'age': 36 });
     * // => 0
     *
     * // using "_.pluck" callback shorthand
     * _.findLastIndex(characters, 'blocked');
     * // => 2
     */
    function findLastIndex(array, callback, thisArg) {
      var length = array ? array.length : 0;
      callback = lodash.createCallback(callback, thisArg, 3);
      while (length--) {
        if (callback(array[length], length, array)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Gets the first element or first `n` elements of an array. If a callback
     * is provided elements at the beginning of the array are returned as long
     * as the callback returns truey. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias head, take
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the first element(s) of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.first([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [1, 2]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': false, 'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.first(characters, 'blocked');
     * // => [{ 'name': 'barney', 'blocked': true, 'employer': 'slate' }]
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.first(characters, { 'employer': 'slate' }), 'name');
     * // => ['barney', 'fred']
     */
    function first(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = -1;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[0] : undefined;
        }
      }
      return slice(array, 0, nativeMin(nativeMax(0, n), length));
    }

    /**
     * Flattens a nested array (the nesting can be to any depth). If `isShallow`
     * is truey, the array will only be flattened a single level. If a callback
     * is provided each element of the array is passed through the callback before
     * flattening. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new flattened array.
     * @example
     *
     * _.flatten([1, [2], [3, [[4]]]]);
     * // => [1, 2, 3, 4];
     *
     * _.flatten([1, [2], [3, [[4]]]], true);
     * // => [1, 2, 3, [[4]]];
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.flatten(characters, 'pets');
     * // => ['hoppy', 'baby puss', 'dino']
     */
    function flatten(array, isShallow, callback, thisArg) {
      // juggle arguments
      if (typeof isShallow != 'boolean' && isShallow != null) {
        thisArg = callback;
        callback = (typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array) ? null : isShallow;
        isShallow = false;
      }
      if (callback != null) {
        array = map(array, callback, thisArg);
      }
      return baseFlatten(array, isShallow);
    }

    /**
     * Gets the index at which the first occurrence of `value` is found using
     * strict equality for comparisons, i.e. `===`. If the array is already sorted
     * providing `true` for `fromIndex` will run a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 1
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 4
     *
     * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      if (typeof fromIndex == 'number') {
        var length = array ? array.length : 0;
        fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
      } else if (fromIndex) {
        var index = sortedIndex(array, value);
        return array[index] === value ? index : -1;
      }
      return baseIndexOf(array, value, fromIndex);
    }

    /**
     * Gets all but the last element or last `n` elements of an array. If a
     * callback is provided elements at the end of the array are excluded from
     * the result as long as the callback returns truey. The callback is bound
     * to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     *
     * _.initial([1, 2, 3], 2);
     * // => [1]
     *
     * _.initial([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [1]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.initial(characters, 'blocked');
     * // => [{ 'name': 'barney',  'blocked': false, 'employer': 'slate' }]
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.initial(characters, { 'employer': 'na' }), 'name');
     * // => ['barney', 'fred']
     */
    function initial(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : callback || n;
      }
      return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
    }

    /**
     * Creates an array of unique values present in all provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of shared values.
     * @example
     *
     * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2]
     */
    function intersection() {
      var args = [],
          argsIndex = -1,
          argsLength = arguments.length,
          caches = getArray(),
          indexOf = getIndexOf(),
          trustIndexOf = indexOf === baseIndexOf,
          seen = getArray();

      while (++argsIndex < argsLength) {
        var value = arguments[argsIndex];
        if (isArray(value) || isArguments(value)) {
          args.push(value);
          caches.push(trustIndexOf && value.length >= largeArraySize &&
            createCache(argsIndex ? args[argsIndex] : seen));
        }
      }
      var array = args[0],
          index = -1,
          length = array ? array.length : 0,
          result = [];

      outer:
      while (++index < length) {
        var cache = caches[0];
        value = array[index];

        if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
          argsIndex = argsLength;
          (cache || seen).push(value);
          while (--argsIndex) {
            cache = caches[argsIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
              continue outer;
            }
          }
          result.push(value);
        }
      }
      while (argsLength--) {
        cache = caches[argsLength];
        if (cache) {
          releaseObject(cache);
        }
      }
      releaseArray(caches);
      releaseArray(seen);
      return result;
    }

    /**
     * Gets the last element or last `n` elements of an array. If a callback is
     * provided elements at the end of the array are returned as long as the
     * callback returns truey. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the last element(s) of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     *
     * _.last([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.last([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [2, 3]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.last(characters, 'blocked'), 'name');
     * // => ['fred', 'pebbles']
     *
     * // using "_.where" callback shorthand
     * _.last(characters, { 'employer': 'na' });
     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
     */
    function last(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[length - 1] : undefined;
        }
      }
      return slice(array, nativeMax(0, length - n));
    }

    /**
     * Gets the index at which the last occurrence of `value` is found using strict
     * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
     * as the offset from the end of the collection.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 4
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var index = array ? array.length : 0;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from the given array using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {...*} [value] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull(array) {
      var args = arguments,
          argsIndex = 0,
          argsLength = args.length,
          length = array ? array.length : 0;

      while (++argsIndex < argsLength) {
        var index = -1,
            value = args[argsIndex];
        while (++index < length) {
          if (array[index] === value) {
            splice.call(array, index--, 1);
            length--;
          }
        }
      }
      return array;
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to but not including `end`. If `start` is less than `stop` a
     * zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns a new range array.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      start = +start || 0;
      step = typeof step == 'number' ? step : (+step || 1);

      if (end == null) {
        end = start;
        start = 0;
      }
      // use `Array(length)` so engines like Chakra and V8 avoid slower modes
      // http://youtu.be/XAqIpGU8ZZk#t=17m25s
      var index = -1,
          length = nativeMax(0, ceil((end - start) / (step || 1))),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Removes all elements from an array that the callback returns truey for
     * and returns an array of removed elements. The callback is bound to `thisArg`
     * and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4, 5, 6];
     * var evens = _.remove(array, function(num) { return num % 2 == 0; });
     *
     * console.log(array);
     * // => [1, 3, 5]
     *
     * console.log(evens);
     * // => [2, 4, 6]
     */
    function remove(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      callback = lodash.createCallback(callback, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (callback(value, index, array)) {
          result.push(value);
          splice.call(array, index--, 1);
          length--;
        }
      }
      return result;
    }

    /**
     * The opposite of `_.initial` this method gets all but the first element or
     * first `n` elements of an array. If a callback function is provided elements
     * at the beginning of the array are excluded from the result as long as the
     * callback returns truey. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias drop, tail
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     *
     * _.rest([1, 2, 3], 2);
     * // => [3]
     *
     * _.rest([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [3]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': false,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true, 'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.rest(characters, 'blocked'), 'name');
     * // => ['fred', 'pebbles']
     *
     * // using "_.where" callback shorthand
     * _.rest(characters, { 'employer': 'slate' });
     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
     */
    function rest(array, callback, thisArg) {
      if (typeof callback != 'number' && callback != null) {
        var n = 0,
            index = -1,
            length = array ? array.length : 0;

        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
      }
      return slice(array, n);
    }

    /**
     * Uses a binary search to determine the smallest index at which a value
     * should be inserted into a given sorted array in order to maintain the sort
     * order of the array. If a callback is provided it will be executed for
     * `value` and each element of `array` to compute their sort ranking. The
     * callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([20, 30, 50], 40);
     * // => 2
     *
     * // using "_.pluck" callback shorthand
     * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 2
     *
     * var dict = {
     *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
     * };
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return dict.wordToNumber[word];
     * });
     * // => 2
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return this.wordToNumber[word];
     * }, dict);
     * // => 2
     */
    function sortedIndex(array, value, callback, thisArg) {
      var low = 0,
          high = array ? array.length : low;

      // explicitly reference `identity` for better inlining in Firefox
      callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
      value = callback(value);

      while (low < high) {
        var mid = (low + high) >>> 1;
        (callback(array[mid]) < value)
          ? low = mid + 1
          : high = mid;
      }
      return low;
    }

    /**
     * Creates an array of unique values, in order, of the provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of combined values.
     * @example
     *
     * _.union([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2, 3, 5, 4]
     */
    function union() {
      return baseUniq(baseFlatten(arguments, true, true));
    }

    /**
     * Creates a duplicate-value-free version of an array using strict equality
     * for comparisons, i.e. `===`. If the array is sorted, providing
     * `true` for `isSorted` will use a faster algorithm. If a callback is provided
     * each element of `array` is passed through the callback before uniqueness
     * is computed. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a duplicate-value-free array.
     * @example
     *
     * _.uniq([1, 2, 1, 3, 1]);
     * // => [1, 2, 3]
     *
     * _.uniq([1, 1, 2, 2, 3], true);
     * // => [1, 2, 3]
     *
     * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
     * // => ['A', 'b', 'C']
     *
     * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
     * // => [1, 2.5, 3]
     *
     * // using "_.pluck" callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, callback, thisArg) {
      // juggle arguments
      if (typeof isSorted != 'boolean' && isSorted != null) {
        thisArg = callback;
        callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
        isSorted = false;
      }
      if (callback != null) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      return baseUniq(array, isSorted, callback);
    }

    /**
     * Creates an array excluding all provided values using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to filter.
     * @param {...*} [value] The values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
     * // => [2, 3, 4]
     */
    function without(array) {
      return baseDifference(array, slice(arguments, 1));
    }

    /**
     * Creates an array that is the symmetric difference of the provided arrays.
     * See http://en.wikipedia.org/wiki/Symmetric_difference.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of values.
     * @example
     *
     * _.xor([1, 2, 3], [5, 2, 1, 4]);
     * // => [3, 5, 4]
     *
     * _.xor([1, 2, 5], [2, 3, 5], [3, 4, 5]);
     * // => [1, 4, 5]
     */
    function xor() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var array = arguments[index];
        if (isArray(array) || isArguments(array)) {
          var result = result
            ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result)))
            : array;
        }
      }
      return result || [];
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second
     * elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @alias unzip
     * @category Arrays
     * @param {...Array} [array] Arrays to process.
     * @returns {Array} Returns a new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    function zip() {
      var array = arguments.length > 1 ? arguments : arguments[0],
          index = -1,
          length = array ? max(pluck(array, 'length')) : 0,
          result = Array(length < 0 ? 0 : length);

      while (++index < length) {
        result[index] = pluck(array, index);
      }
      return result;
    }

    /**
     * Creates an object composed from arrays of `keys` and `values`. Provide
     * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
     * or two arrays, one of `keys` and one of corresponding `values`.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Arrays
     * @param {Array} keys The array of keys.
     * @param {Array} [values=[]] The array of values.
     * @returns {Object} Returns an object composed of the given keys and
     *  corresponding values.
     * @example
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject(keys, values) {
      var index = -1,
          length = keys ? keys.length : 0,
          result = {};

      if (!values && length && !isArray(keys[0])) {
        values = [];
      }
      while (++index < length) {
        var key = keys[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that executes `func`, with  the `this` binding and
     * arguments of the created function, only after being called `n` times.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {number} n The number of times the function must be called before
     *  `func` is executed.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('Done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'Done saving!', after all saves have completed
     */
    function after(n, func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with the `this`
     * binding of `thisArg` and prepends any additional `bind` arguments to those
     * provided to the bound function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var func = function(greeting) {
     *   return greeting + ' ' + this.name;
     * };
     *
     * func = _.bind(func, { 'name': 'fred' }, 'hi');
     * func();
     * // => 'hi fred'
     */
    function bind(func, thisArg) {
      return arguments.length > 2
        ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
        : createWrapper(func, 1, null, null, thisArg);
    }

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all the function properties
     * of `object` will be bound.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...string} [methodName] The object method names to
     *  bind, specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() { console.log('clicked ' + this.label); }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs', when the button is clicked
     */
    function bindAll(object) {
      var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
          index = -1,
          length = funcs.length;

      while (++index < length) {
        var key = funcs[index];
        object[key] = createWrapper(object[key], 1, null, null, object);
      }
      return object;
    }

    /**
     * Creates a function that, when called, invokes the method at `object[key]`
     * and prepends any additional `bindKey` arguments to those provided to the bound
     * function. This method differs from `_.bind` by allowing bound functions to
     * reference methods that will be redefined or don't yet exist.
     * See http://michaux.ca/articles/lazy-function-definition-pattern.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'name': 'fred',
     *   'greet': function(greeting) {
     *     return greeting + ' ' + this.name;
     *   }
     * };
     *
     * var func = _.bindKey(object, 'greet', 'hi');
     * func();
     * // => 'hi fred'
     *
     * object.greet = function(greeting) {
     *   return greeting + 'ya ' + this.name + '!';
     * };
     *
     * func();
     * // => 'hiya fred!'
     */
    function bindKey(object, key) {
      return arguments.length > 2
        ? createWrapper(key, 19, slice(arguments, 2), null, object)
        : createWrapper(key, 3, null, null, object);
    }

    /**
     * Creates a function that is the composition of the provided functions,
     * where each function consumes the return value of the function that follows.
     * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
     * Each function is executed with the `this` binding of the composed function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {...Function} [func] Functions to compose.
     * @returns {Function} Returns the new composed function.
     * @example
     *
     * var realNameMap = {
     *   'pebbles': 'penelope'
     * };
     *
     * var format = function(name) {
     *   name = realNameMap[name.toLowerCase()] || name;
     *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
     * };
     *
     * var greet = function(formatted) {
     *   return 'Hiya ' + formatted + '!';
     * };
     *
     * var welcome = _.compose(greet, format);
     * welcome('pebbles');
     * // => 'Hiya Penelope!'
     */
    function compose() {
      var funcs = arguments,
          length = funcs.length;

      while (length--) {
        if (!isFunction(funcs[length])) {
          throw new TypeError;
        }
      }
      return function() {
        var args = arguments,
            length = funcs.length;

        while (length--) {
          args = [funcs[length].apply(this, args)];
        }
        return args[0];
      };
    }

    /**
     * Creates a function which accepts one or more arguments of `func` that when
     * invoked either executes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` can be specified
     * if `func.length` is not sufficient.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var curried = _.curry(function(a, b, c) {
     *   console.log(a + b + c);
     * });
     *
     * curried(1)(2)(3);
     * // => 6
     *
     * curried(1, 2)(3);
     * // => 6
     *
     * curried(1, 2, 3);
     * // => 6
     */
    function curry(func, arity) {
      arity = typeof arity == 'number' ? arity : (+arity || func.length);
      return createWrapper(func, 4, null, null, null, arity);
    }

    /**
     * Creates a function that will delay the execution of `func` until after
     * `wait` milliseconds have elapsed since the last time it was invoked.
     * Provide an options object to indicate that `func` should be invoked on
     * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
     * to the debounced function will return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to debounce.
     * @param {number} wait The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * var lazyLayout = _.debounce(calculateLayout, 150);
     * jQuery(window).on('resize', lazyLayout);
     *
     * // execute `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * });
     *
     * // ensure `batchLog` is executed once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * source.addEventListener('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }, false);
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      wait = nativeMax(0, wait) || 0;
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = options.leading;
        maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      var delayed = function() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0) {
          if (maxTimeoutId) {
            clearTimeout(maxTimeoutId);
          }
          var isCalled = trailingCall;
          maxTimeoutId = timeoutId = trailingCall = undefined;
          if (isCalled) {
            lastCalled = now();
            result = func.apply(thisArg, args);
            if (!timeoutId && !maxTimeoutId) {
              args = thisArg = null;
            }
          }
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      };

      var maxDelayed = function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (trailing || (maxWait !== wait)) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = null;
          }
        }
      };

      return function() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = null;
        }
        return result;
      };
    }

    /**
     * Defers executing the `func` function until the current call stack has cleared.
     * Additional arguments will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to defer.
     * @param {...*} [arg] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) { console.log(text); }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    function defer(func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 1);
      return setTimeout(function() { func.apply(undefined, args); }, 1);
    }

    /**
     * Executes the `func` function after `wait` milliseconds. Additional arguments
     * will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay execution.
     * @param {...*} [arg] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) { console.log(text); }, 1000, 'later');
     * // => logs 'later' after one second
     */
    function delay(func, wait) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 2);
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it will be used to determine the cache key for storing the result
     * based on the arguments provided to the memoized function. By default, the
     * first argument provided to the memoized function is used as the cache key.
     * The `func` is executed with the `this` binding of the memoized function.
     * The result cache is exposed as the `cache` property on the memoized function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] A function used to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var fibonacci = _.memoize(function(n) {
     *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
     * });
     *
     * fibonacci(9)
     * // => 34
     *
     * var data = {
     *   'fred': { 'name': 'fred', 'age': 40 },
     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
     * };
     *
     * // modifying the result cache
     * var get = _.memoize(function(name) { return data[name]; }, _.identity);
     * get('pebbles');
     * // => { 'name': 'pebbles', 'age': 1 }
     *
     * get.cache.pebbles.name = 'penelope';
     * get('pebbles');
     * // => { 'name': 'penelope', 'age': 1 }
     */
    function memoize(func, resolver) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var memoized = function() {
        var cache = memoized.cache,
            key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];

        return hasOwnProperty.call(cache, key)
          ? cache[key]
          : (cache[key] = func.apply(this, arguments));
      }
      memoized.cache = {};
      return memoized;
    }

    /**
     * Creates a function that is restricted to execute `func` once. Repeat calls to
     * the function will return the value of the first call. The `func` is executed
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` executes `createApplication` once
     */
    function once(func) {
      var ran,
          result;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (ran) {
          return result;
        }
        ran = true;
        result = func.apply(this, arguments);

        // clear the `func` variable so the function may be garbage collected
        func = null;
        return result;
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with any additional
     * `partial` arguments prepended to those provided to the new function. This
     * method is similar to `_.bind` except it does **not** alter the `this` binding.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) { return greeting + ' ' + name; };
     * var hi = _.partial(greet, 'hi');
     * hi('fred');
     * // => 'hi fred'
     */
    function partial(func) {
      return createWrapper(func, 16, slice(arguments, 1));
    }

    /**
     * This method is like `_.partial` except that `partial` arguments are
     * appended to those provided to the new function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var defaultsDeep = _.partialRight(_.merge, _.defaults);
     *
     * var options = {
     *   'variable': 'data',
     *   'imports': { 'jq': $ }
     * };
     *
     * defaultsDeep(options, _.templateSettings);
     *
     * options.variable
     * // => 'data'
     *
     * options.imports
     * // => { '_': _, 'jq': $ }
     */
    function partialRight(func) {
      return createWrapper(func, 32, null, slice(arguments, 1));
    }

    /**
     * Creates a function that, when executed, will only call the `func` function
     * at most once per every `wait` milliseconds. Provide an options object to
     * indicate that `func` should be invoked on the leading and/or trailing edge
     * of the `wait` timeout. Subsequent calls to the throttled function will
     * return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to throttle.
     * @param {number} wait The number of milliseconds to throttle executions to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * var throttled = _.throttle(updatePosition, 100);
     * jQuery(window).on('scroll', throttled);
     *
     * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? options.leading : leading;
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      debounceOptions.leading = leading;
      debounceOptions.maxWait = wait;
      debounceOptions.trailing = trailing;

      return debounce(func, wait, debounceOptions);
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Additional arguments provided to the function are appended
     * to those provided to the wrapper function. The wrapper is executed with
     * the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('Fred, Wilma, & Pebbles');
     * // => '<p>Fred, Wilma, &amp; Pebbles</p>'
     */
    function wrap(value, wrapper) {
      return createWrapper(wrapper, 16, [value]);
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'name': 'fred' };
     * var getter = _.constant(object);
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Produces a callback bound to an optional `thisArg`. If `func` is a property
     * name the created callback will return the property value for a given element.
     * If `func` is an object the created callback will return `true` for elements
     * that contain the equivalent object properties, otherwise it will return `false`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
     *   return !match ? func(callback, thisArg) : function(object) {
     *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(characters, 'age__gt38');
     * // => [{ 'name': 'fred', 'age': 40 }]
     */
    function createCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (func == null || type == 'function') {
        return baseCreateCallback(func, thisArg, argCount);
      }
      // handle "_.pluck" style callback shorthands
      if (type != 'object') {
        return property(func);
      }
      var props = keys(func),
          key = props[0],
          a = func[key];

      // handle "_.where" style callback shorthands
      if (props.length == 1 && a === a && !isObject(a)) {
        // fast path the common case of providing an object with a single
        // property containing a primitive value
        return function(object) {
          var b = object[key];
          return a === b && (a !== 0 || (1 / a == 1 / b));
        };
      }
      return function(object) {
        var length = props.length,
            result = false;

        while (length--) {
          if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
            break;
          }
        }
        return result;
      };
    }

    /**
     * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
     * corresponding HTML entities.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} string The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('Fred, Wilma, & Pebbles');
     * // => 'Fred, Wilma, &amp; Pebbles'
     */
    function escape(string) {
      return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'name': 'fred' };
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Adds function properties of a source object to the destination object.
     * If `object` is a function methods will be added to its prototype as well.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Function|Object} [object=lodash] object The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added are chainable.
     * @example
     *
     * function capitalize(string) {
     *   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
     * }
     *
     * _.mixin({ 'capitalize': capitalize });
     * _.capitalize('fred');
     * // => 'Fred'
     *
     * _('fred').capitalize().value();
     * // => 'Fred'
     *
     * _.mixin({ 'capitalize': capitalize }, { 'chain': false });
     * _('fred').capitalize();
     * // => 'Fred'
     */
    function mixin(object, source, options) {
      var chain = true,
          methodNames = source && functions(source);

      if (!source || (!options && !methodNames.length)) {
        if (options == null) {
          options = source;
        }
        ctor = lodashWrapper;
        source = object;
        object = lodash;
        methodNames = functions(source);
      }
      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      var ctor = object,
          isFunc = isFunction(ctor);

      forEach(methodNames, function(methodName) {
        var func = object[methodName] = source[methodName];
        if (isFunc) {
          ctor.prototype[methodName] = function() {
            var chainAll = this.__chain__,
                value = this.__wrapped__,
                args = [value];

            push.apply(args, arguments);
            var result = func.apply(object, args);
            if (chain || chainAll) {
              if (value === result && isObject(result)) {
                return this;
              }
              result = new ctor(result);
              result.__chain__ = chainAll;
            }
            return result;
          };
        }
      });
    }

    /**
     * Reverts the '_' variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      context._ = oldDash;
      return this;
    }

    /**
     * A no-operation function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @example
     *
     * var object = { 'name': 'fred' };
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // no operation performed
    }

    /**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @example
     *
     * var stamp = _.now();
     * _.defer(function() { console.log(_.now() - stamp); });
     * // => logs the number of milliseconds it took for the deferred function to be called
     */
    var now = isNative(now = Date.now) && now || function() {
      return new Date().getTime();
    };

    /**
     * Converts the given value into an integer of the specified radix.
     * If `radix` is `undefined` or `0` a `radix` of `10` is used unless the
     * `value` is a hexadecimal, in which case a `radix` of `16` is used.
     *
     * Note: This method avoids differences in native ES3 and ES5 `parseInt`
     * implementations. See http://es5.github.io/#E.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} value The value to parse.
     * @param {number} [radix] The radix used to interpret the value to parse.
     * @returns {number} Returns the new integer value.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     */
    var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
      // Firefox < 21 and Opera < 15 follow the ES3 specified implementation of `parseInt`
      return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
    };

    /**
     * Creates a "_.pluck" style function, which returns the `key` value of a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} key The name of the property to retrieve.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var characters = [
     *   { 'name': 'fred',   'age': 40 },
     *   { 'name': 'barney', 'age': 36 }
     * ];
     *
     * var getName = _.property('name');
     *
     * _.map(characters, getName);
     * // => ['barney', 'fred']
     *
     * _.sortBy(characters, getName);
     * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
     */
    function property(key) {
      return function(object) {
        return object[key];
      };
    }

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number will be
     * returned. If `floating` is truey or either `min` or `max` are floats a
     * floating-point number will be returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating=false] Specify returning a floating-point number.
     * @returns {number} Returns a random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (typeof min == 'boolean' && noMax) {
          floating = min;
          min = 1;
        }
        else if (!noMax && typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /**
     * Resolves the value of property `key` on `object`. If `key` is a function
     * it will be invoked with the `this` binding of `object` and its result returned,
     * else the property value is returned. If `object` is falsey then `undefined`
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Object} object The object to inspect.
     * @param {string} key The name of the property to resolve.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = {
     *   'cheese': 'crumpets',
     *   'stuff': function() {
     *     return 'nonsense';
     *   }
     * };
     *
     * _.result(object, 'cheese');
     * // => 'crumpets'
     *
     * _.result(object, 'stuff');
     * // => 'nonsense'
     */
    function result(object, key) {
      if (object) {
        var value = object[key];
        return isFunction(value) ? object[key]() : value;
      }
    }

    /**
     * A micro-templating method that handles arbitrary delimiters, preserves
     * whitespace, and correctly escapes quotes within interpolated code.
     *
     * Note: In the development build, `_.template` utilizes sourceURLs for easier
     * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
     *
     * For more information on precompiling templates see:
     * http://lodash.com/custom-builds
     *
     * For more information on Chrome extension sandboxes see:
     * http://developer.chrome.com/stable/extensions/sandboxingEval.html
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} text The template text.
     * @param {Object} data The data object used to populate the text.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as local variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [variable] The data object variable name.
     * @returns {Function|string} Returns a compiled function when no `data` object
     *  is given, else it returns the interpolated text.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= name %>');
     * compiled({ 'name': 'fred' });
     * // => 'hello fred'
     *
     * // using the "escape" delimiter to escape HTML in data property values
     * _.template('<b><%- value %></b>', { 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to generate HTML
     * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
     * _.template('hello ${ name }', { 'name': 'pebbles' });
     * // => 'hello pebbles'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * _.template('<% print("hello " + name); %>!', { 'name': 'barney' });
     * // => 'hello barney!'
     *
     * // using a custom template delimiters
     * _.templateSettings = {
     *   'interpolate': /{{([\s\S]+?)}}/g
     * };
     *
     * _.template('hello {{ name }}!', { 'name': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using the `imports` option to import jQuery
     * var list = '<% jq.each(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['fred', 'barney'] }, { 'imports': { 'jq': jQuery } });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     *   var __t, __p = '', __e = _.escape;
     *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
     *   return __p;
     * }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(text, data, options) {
      // based on John Resig's `tmpl` implementation
      // http://ejohn.org/blog/javascript-micro-templating/
      // and Laura Doktorova's doT.js
      // https://github.com/olado/doT
      var settings = lodash.templateSettings;
      text = String(text || '');

      // avoid missing dependencies when `iteratorTemplate` is not defined
      options = defaults({}, options, settings);

      var imports = defaults({}, options.imports, settings.imports),
          importsKeys = keys(imports),
          importsValues = values(imports);

      var isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // compile the regexp to match each delimiter
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // escape characters that cannot be included in string literals
        source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // replace delimiters with snippets
        if (escapeValue) {
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // the JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value
        return match;
      });

      source += "';\n";

      // if `variable` is not specified, wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain
      var variable = options.variable,
          hasVariable = variable;

      if (!hasVariable) {
        variable = 'obj';
        source = 'with (' + variable + ') {\n' + source + '\n}\n';
      }
      // cleanup code by stripping empty strings
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // frame code as the function body
      source = 'function(' + variable + ') {\n' +
        (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
        "var __t, __p = '', __e = _.escape" +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      // Use a sourceURL for easier debugging.
      // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
      var sourceURL = '\n/*\n//# sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']') + '\n*/';

      try {
        var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
      } catch(e) {
        e.source = source;
        throw e;
      }
      if (data) {
        return result(data);
      }
      // provide the compiled function's source by its `toString` method, in
      // supported environments, or the `source` property as a convenience for
      // inlining compiled templates during the build process
      result.source = source;
      return result;
    }

    /**
     * Executes the callback `n` times, returning an array of the results
     * of each callback execution. The callback is bound to `thisArg` and invoked
     * with one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} n The number of times to execute the callback.
     * @param {Function} callback The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns an array of the results of each `callback` execution.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) { mage.castSpell(n); });
     * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
     *
     * _.times(3, function(n) { this.cast(n); }, mage);
     * // => also calls `mage.castSpell(n)` three times
     */
    function times(n, callback, thisArg) {
      n = (n = +n) > -1 ? n : 0;
      var index = -1,
          result = Array(n);

      callback = baseCreateCallback(callback, thisArg, 1);
      while (++index < n) {
        result[index] = callback(index);
      }
      return result;
    }

    /**
     * The inverse of `_.escape` this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
     * corresponding characters.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} string The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('Fred, Barney &amp; Pebbles');
     * // => 'Fred, Barney & Pebbles'
     */
    function unescape(string) {
      return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return String(prefix == null ? '' : prefix) + id;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps the given value with explicit
     * method chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(characters)
     *     .sortBy('age')
     *     .map(function(chr) { return chr.name + ' is ' + chr.age; })
     *     .first()
     *     .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      value = new lodashWrapper(value);
      value.__chain__ = true;
      return value;
    }

    /**
     * Invokes `interceptor` with the `value` as the first argument and then
     * returns `value`. The purpose of this method is to "tap into" a method
     * chain in order to perform operations on intermediate results within
     * the chain.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3, 4])
     *  .tap(function(array) { array.pop(); })
     *  .reverse()
     *  .value();
     * // => [3, 2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chaining
     * @returns {*} Returns the wrapper object.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(characters).first();
     * // => { 'name': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(characters).chain()
     *   .first()
     *   .pick('age')
     *   .value();
     * // => { 'age': 36 }
     */
    function wrapperChain() {
      this.__chain__ = true;
      return this;
    }

    /**
     * Produces the `toString` result of the wrapped value.
     *
     * @name toString
     * @memberOf _
     * @category Chaining
     * @returns {string} Returns the string result.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return String(this.__wrapped__);
    }

    /**
     * Extracts the wrapped value.
     *
     * @name valueOf
     * @memberOf _
     * @alias value
     * @category Chaining
     * @returns {*} Returns the wrapped value.
     * @example
     *
     * _([1, 2, 3]).valueOf();
     * // => [1, 2, 3]
     */
    function wrapperValueOf() {
      return this.__wrapped__;
    }

    /*--------------------------------------------------------------------------*/

    // add functions that return wrapped values when chaining
    lodash.after = after;
    lodash.assign = assign;
    lodash.at = at;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.chain = chain;
    lodash.compact = compact;
    lodash.compose = compose;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.createCallback = createCallback;
    lodash.curry = curry;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.map = map;
    lodash.mapValues = mapValues;
    lodash.max = max;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.min = min;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.property = property;
    lodash.pull = pull;
    lodash.range = range;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.shuffle = shuffle;
    lodash.sortBy = sortBy;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.values = values;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.zip = zip;
    lodash.zipObject = zipObject;

    // add aliases
    lodash.collect = map;
    lodash.drop = rest;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;
    lodash.unzip = zip;

    // add functions to `lodash.prototype`
    mixin(lodash);

    /*--------------------------------------------------------------------------*/

    // add functions that return unwrapped values when chaining
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.contains = contains;
    lodash.escape = escape;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.has = has;
    lodash.identity = identity;
    lodash.indexOf = indexOf;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isNaN = isNaN;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isUndefined = isUndefined;
    lodash.lastIndexOf = lastIndexOf;
    lodash.mixin = mixin;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.result = result;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.template = template;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;

    // add aliases
    lodash.all = every;
    lodash.any = some;
    lodash.detect = find;
    lodash.findWhere = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.include = contains;
    lodash.inject = reduce;

    mixin(function() {
      var source = {}
      forOwn(lodash, function(func, methodName) {
        if (!lodash.prototype[methodName]) {
          source[methodName] = func;
        }
      });
      return source;
    }(), false);

    /*--------------------------------------------------------------------------*/

    // add functions capable of returning wrapped and unwrapped values when chaining
    lodash.first = first;
    lodash.last = last;
    lodash.sample = sample;

    // add aliases
    lodash.take = first;
    lodash.head = first;

    forOwn(lodash, function(func, methodName) {
      var callbackable = methodName !== 'sample';
      if (!lodash.prototype[methodName]) {
        lodash.prototype[methodName]= function(n, guard) {
          var chainAll = this.__chain__,
              result = func(this.__wrapped__, n, guard);

          return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function')))
            ? result
            : new lodashWrapper(result, chainAll);
        };
      }
    });

    /*--------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = '2.4.1';

    // add "Chaining" functions to the wrapper
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.value = wrapperValueOf;
    lodash.prototype.valueOf = wrapperValueOf;

    // add `Array` functions that return unwrapped values
    forEach(['join', 'pop', 'shift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        var chainAll = this.__chain__,
            result = func.apply(this.__wrapped__, arguments);

        return chainAll
          ? new lodashWrapper(result, chainAll)
          : result;
      };
    });

    // add `Array` functions that return the existing wrapped value
    forEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        func.apply(this.__wrapped__, arguments);
        return this;
      };
    });

    // add `Array` functions that return new wrapped values
    forEach(['concat', 'slice', 'splice'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
      };
    });

    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // expose Lo-Dash
  var _ = runInContext();

  // some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash is loaded with a RequireJS shim config.
    // See http://requirejs.org/docs/api.html#config-shim
    root._ = _;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    define(function() {
      return _;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // in Narwhal or Rhino -require
    else {
      freeExports._ = _;
    }
  }
  else {
    // in a browser or Rhino
    root._ = _;
  }
}.call(this));

},{}],25:[function(require,module,exports){
//  Underscore.string
//  (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>
//  Underscore.string is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/epeli/underscore.string
//  Some code is borrowed from MooTools and Alexandru Marasteanu.
//  Version '2.3.2'

!function(root, String){
  'use strict';

  // Defining helper functions.

  var nativeTrim = String.prototype.trim;
  var nativeTrimRight = String.prototype.trimRight;
  var nativeTrimLeft = String.prototype.trimLeft;

  var parseNumber = function(source) { return source * 1 || 0; };

  var strRepeat = function(str, qty){
    if (qty < 1) return '';
    var result = '';
    while (qty > 0) {
      if (qty & 1) result += str;
      qty >>= 1, str += str;
    }
    return result;
  };

  var slice = [].slice;

  var defaultToWhiteSpace = function(characters) {
    if (characters == null)
      return '\\s';
    else if (characters.source)
      return characters.source;
    else
      return '[' + _s.escapeRegExp(characters) + ']';
  };

  // Helper for toBoolean
  function boolMatch(s, matchers) {
    var i, matcher, down = s.toLowerCase();
    matchers = [].concat(matchers);
    for (i = 0; i < matchers.length; i += 1) {
      matcher = matchers[i];
      if (!matcher) continue;
      if (matcher.test && matcher.test(s)) return true;
      if (matcher.toLowerCase() === down) return true;
    }
  }

  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    amp: '&',
    apos: "'"
  };

  var reversedEscapeChars = {};
  for(var key in escapeChars) reversedEscapeChars[escapeChars[key]] = key;
  reversedEscapeChars["'"] = '#39';

  // sprintf() for JavaScript 0.7-beta1
  // http://www.diveintojavascript.com/projects/javascript-sprintf
  //
  // Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
  // All rights reserved.

  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    var str_repeat = strRepeat;

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw new Error(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          } else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw new Error(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
          }
          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw new Error('[_.sprintf] huh?');
                }
              }
            }
            else {
              throw new Error('[_.sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw new Error('[_.sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw new Error('[_.sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();



  // Defining underscore.string

  var _s = {

    VERSION: '2.3.0',

    isBlank: function(str){
      if (str == null) str = '';
      return (/^\s*$/).test(str);
    },

    stripTags: function(str){
      if (str == null) return '';
      return String(str).replace(/<\/?[^>]+>/g, '');
    },

    capitalize : function(str){
      str = str == null ? '' : String(str);
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    chop: function(str, step){
      if (str == null) return [];
      str = String(str);
      step = ~~step;
      return step > 0 ? str.match(new RegExp('.{1,' + step + '}', 'g')) : [str];
    },

    clean: function(str){
      return _s.strip(str).replace(/\s+/g, ' ');
    },

    count: function(str, substr){
      if (str == null || substr == null) return 0;

      str = String(str);
      substr = String(substr);

      var count = 0,
        pos = 0,
        length = substr.length;

      while (true) {
        pos = str.indexOf(substr, pos);
        if (pos === -1) break;
        count++;
        pos += length;
      }

      return count;
    },

    chars: function(str) {
      if (str == null) return [];
      return String(str).split('');
    },

    swapCase: function(str) {
      if (str == null) return '';
      return String(str).replace(/\S/g, function(c){
        return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
      });
    },

    escapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; });
    },

    unescapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/\&([^;]+);/g, function(entity, entityCode){
        var match;

        if (entityCode in escapeChars) {
          return escapeChars[entityCode];
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
        } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
        } else {
          return entity;
        }
      });
    },

    escapeRegExp: function(str){
      if (str == null) return '';
      return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    },

    splice: function(str, i, howmany, substr){
      var arr = _s.chars(str);
      arr.splice(~~i, ~~howmany, substr);
      return arr.join('');
    },

    insert: function(str, i, substr){
      return _s.splice(str, i, 0, substr);
    },

    include: function(str, needle){
      if (needle === '') return true;
      if (str == null) return false;
      return String(str).indexOf(needle) !== -1;
    },

    join: function() {
      var args = slice.call(arguments),
        separator = args.shift();

      if (separator == null) separator = '';

      return args.join(separator);
    },

    lines: function(str) {
      if (str == null) return [];
      return String(str).split("\n");
    },

    reverse: function(str){
      return _s.chars(str).reverse().join('');
    },

    startsWith: function(str, starts){
      if (starts === '') return true;
      if (str == null || starts == null) return false;
      str = String(str); starts = String(starts);
      return str.length >= starts.length && str.slice(0, starts.length) === starts;
    },

    endsWith: function(str, ends){
      if (ends === '') return true;
      if (str == null || ends == null) return false;
      str = String(str); ends = String(ends);
      return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
    },

    succ: function(str){
      if (str == null) return '';
      str = String(str);
      return str.slice(0, -1) + String.fromCharCode(str.charCodeAt(str.length-1) + 1);
    },

    titleize: function(str){
      if (str == null) return '';
      str  = String(str).toLowerCase();
      return str.replace(/(?:^|\s|-)\S/g, function(c){ return c.toUpperCase(); });
    },

    camelize: function(str){
      return _s.trim(str).replace(/[-_\s]+(.)?/g, function(match, c){ return c ? c.toUpperCase() : ""; });
    },

    underscored: function(str){
      return _s.trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
    },

    dasherize: function(str){
      return _s.trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
    },

    classify: function(str){
      return _s.titleize(String(str).replace(/[\W_]/g, ' ')).replace(/\s/g, '');
    },

    humanize: function(str){
      return _s.capitalize(_s.underscored(str).replace(/_id$/,'').replace(/_/g, ' '));
    },

    trim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrim) return nativeTrim.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('\^' + characters + '+|' + characters + '+$', 'g'), '');
    },

    ltrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimLeft) return nativeTrimLeft.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('^' + characters + '+'), '');
    },

    rtrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimRight) return nativeTrimRight.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp(characters + '+$'), '');
    },

    truncate: function(str, length, truncateStr){
      if (str == null) return '';
      str = String(str); truncateStr = truncateStr || '...';
      length = ~~length;
      return str.length > length ? str.slice(0, length) + truncateStr : str;
    },

    /**
     * _s.prune: a more elegant version of truncate
     * prune extra chars, never leaving a half-chopped word.
     * @author github.com/rwz
     */
    prune: function(str, length, pruneStr){
      if (str == null) return '';

      str = String(str); length = ~~length;
      pruneStr = pruneStr != null ? String(pruneStr) : '...';

      if (str.length <= length) return str;

      var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
        template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

      if (template.slice(template.length-2).match(/\w\w/))
        template = template.replace(/\s*\S+$/, '');
      else
        template = _s.rtrim(template.slice(0, template.length-1));

      return (template+pruneStr).length > str.length ? str : str.slice(0, template.length)+pruneStr;
    },

    words: function(str, delimiter) {
      if (_s.isBlank(str)) return [];
      return _s.trim(str, delimiter).split(delimiter || /\s+/);
    },

    pad: function(str, length, padStr, type) {
      str = str == null ? '' : String(str);
      length = ~~length;

      var padlen  = 0;

      if (!padStr)
        padStr = ' ';
      else if (padStr.length > 1)
        padStr = padStr.charAt(0);

      switch(type) {
        case 'right':
          padlen = length - str.length;
          return str + strRepeat(padStr, padlen);
        case 'both':
          padlen = length - str.length;
          return strRepeat(padStr, Math.ceil(padlen/2)) + str
                  + strRepeat(padStr, Math.floor(padlen/2));
        default: // 'left'
          padlen = length - str.length;
          return strRepeat(padStr, padlen) + str;
        }
    },

    lpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr);
    },

    rpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'right');
    },

    lrpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'both');
    },

    sprintf: sprintf,

    vsprintf: function(fmt, argv){
      argv.unshift(fmt);
      return sprintf.apply(null, argv);
    },

    toNumber: function(str, decimals) {
      if (!str) return 0;
      str = _s.trim(str);
      if (!str.match(/^-?\d+(?:\.\d+)?$/)) return NaN;
      return parseNumber(parseNumber(str).toFixed(~~decimals));
    },

    numberFormat : function(number, dec, dsep, tsep) {
      if (isNaN(number) || number == null) return '';

      number = number.toFixed(~~dec);
      tsep = typeof tsep == 'string' ? tsep : ',';

      var parts = number.split('.'), fnums = parts[0],
        decimals = parts[1] ? (dsep || '.') + parts[1] : '';

      return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
    },

    strRight: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strRightBack: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.lastIndexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strLeft: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    strLeftBack: function(str, sep){
      if (str == null) return '';
      str += ''; sep = sep != null ? ''+sep : sep;
      var pos = str.lastIndexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    toSentence: function(array, separator, lastSeparator, serial) {
      separator = separator || ', ';
      lastSeparator = lastSeparator || ' and ';
      var a = array.slice(), lastMember = a.pop();

      if (array.length > 2 && serial) lastSeparator = _s.rtrim(separator) + lastSeparator;

      return a.length ? a.join(separator) + lastSeparator + lastMember : lastMember;
    },

    toSentenceSerial: function() {
      var args = slice.call(arguments);
      args[3] = true;
      return _s.toSentence.apply(_s, args);
    },

    slugify: function(str) {
      if (str == null) return '';

      var from  = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź",
          to    = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz",
          regex = new RegExp(defaultToWhiteSpace(from), 'g');

      str = String(str).toLowerCase().replace(regex, function(c){
        var index = from.indexOf(c);
        return to.charAt(index) || '-';
      });

      return _s.dasherize(str.replace(/[^\w\s-]/g, ''));
    },

    surround: function(str, wrapper) {
      return [wrapper, str, wrapper].join('');
    },

    quote: function(str, quoteChar) {
      return _s.surround(str, quoteChar || '"');
    },

    unquote: function(str, quoteChar) {
      quoteChar = quoteChar || '"';
      if (str[0] === quoteChar && str[str.length-1] === quoteChar)
        return str.slice(1,str.length-1);
      else return str;
    },

    exports: function() {
      var result = {};

      for (var prop in this) {
        if (!this.hasOwnProperty(prop) || prop.match(/^(?:include|contains|reverse)$/)) continue;
        result[prop] = this[prop];
      }

      return result;
    },

    repeat: function(str, qty, separator){
      if (str == null) return '';

      qty = ~~qty;

      // using faster implementation if separator is not needed;
      if (separator == null) return strRepeat(String(str), qty);

      // this one is about 300x slower in Google Chrome
      for (var repeat = []; qty > 0; repeat[--qty] = str) {}
      return repeat.join(separator);
    },

    naturalCmp: function(str1, str2){
      if (str1 == str2) return 0;
      if (!str1) return -1;
      if (!str2) return 1;

      var cmpRegex = /(\.\d+)|(\d+)|(\D+)/g,
        tokens1 = String(str1).toLowerCase().match(cmpRegex),
        tokens2 = String(str2).toLowerCase().match(cmpRegex),
        count = Math.min(tokens1.length, tokens2.length);

      for(var i = 0; i < count; i++) {
        var a = tokens1[i], b = tokens2[i];

        if (a !== b){
          var num1 = parseInt(a, 10);
          if (!isNaN(num1)){
            var num2 = parseInt(b, 10);
            if (!isNaN(num2) && num1 - num2)
              return num1 - num2;
          }
          return a < b ? -1 : 1;
        }
      }

      if (tokens1.length === tokens2.length)
        return tokens1.length - tokens2.length;

      return str1 < str2 ? -1 : 1;
    },

    levenshtein: function(str1, str2) {
      if (str1 == null && str2 == null) return 0;
      if (str1 == null) return String(str2).length;
      if (str2 == null) return String(str1).length;

      str1 = String(str1); str2 = String(str2);

      var current = [], prev, value;

      for (var i = 0; i <= str2.length; i++)
        for (var j = 0; j <= str1.length; j++) {
          if (i && j)
            if (str1.charAt(j - 1) === str2.charAt(i - 1))
              value = prev;
            else
              value = Math.min(current[j], current[j - 1], prev) + 1;
          else
            value = i + j;

          prev = current[j];
          current[j] = value;
        }

      return current.pop();
    },

    toBoolean: function(str, trueValues, falseValues) {
      if (typeof str === "number") str = "" + str;
      if (typeof str !== "string") return !!str;
      str = _s.trim(str);
      if (boolMatch(str, trueValues || ["true", "1"])) return true;
      if (boolMatch(str, falseValues || ["false", "0"])) return false;
    }
  };

  // Aliases

  _s.strip    = _s.trim;
  _s.lstrip   = _s.ltrim;
  _s.rstrip   = _s.rtrim;
  _s.center   = _s.lrpad;
  _s.rjust    = _s.lpad;
  _s.ljust    = _s.rpad;
  _s.contains = _s.include;
  _s.q        = _s.quote;
  _s.toBool   = _s.toBoolean;

  // Exporting

  // CommonJS module is defined
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      module.exports = _s;

    exports._s = _s;
  }

  // Register as a named module with AMD.
  if (typeof define === 'function' && define.amd)
    define('underscore.string', [], function(){ return _s; });


  // Integrate with Underscore.js if defined
  // or create our own underscore object.
  root._ = root._ || {};
  root._.string = root._.str = _s;
}(this, String);

},{}]},{},[16])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvUGF1bC9naXQvRnJhbWVyL2ZyYW1lci9BbmltYXRpb24uY29mZmVlIiwiL1VzZXJzL1BhdWwvZ2l0L0ZyYW1lci9mcmFtZXIvQW5pbWF0aW9uTG9vcC5jb2ZmZWUiLCIvVXNlcnMvUGF1bC9naXQvRnJhbWVyL2ZyYW1lci9BbmltYXRvci5jb2ZmZWUiLCIvVXNlcnMvUGF1bC9naXQvRnJhbWVyL2ZyYW1lci9BbmltYXRvcnMvQmV6aWVyQ3VydmVBbmltYXRvci5jb2ZmZWUiLCIvVXNlcnMvUGF1bC9naXQvRnJhbWVyL2ZyYW1lci9BbmltYXRvcnMvTGluZWFyQW5pbWF0b3IuY29mZmVlIiwiL1VzZXJzL1BhdWwvZ2l0L0ZyYW1lci9mcmFtZXIvQW5pbWF0b3JzL1NwcmluZ0RIT0FuaW1hdG9yLmNvZmZlZSIsIi9Vc2Vycy9QYXVsL2dpdC9GcmFtZXIvZnJhbWVyL0FuaW1hdG9ycy9TcHJpbmdSSzRBbmltYXRvci5jb2ZmZWUiLCIvVXNlcnMvUGF1bC9naXQvRnJhbWVyL2ZyYW1lci9CYXNlQ2xhc3MuY29mZmVlIiwiL1VzZXJzL1BhdWwvZ2l0L0ZyYW1lci9mcmFtZXIvQ29tcGF0LmNvZmZlZSIsIi9Vc2Vycy9QYXVsL2dpdC9GcmFtZXIvZnJhbWVyL0NvbmZpZy5jb2ZmZWUiLCIvVXNlcnMvUGF1bC9naXQvRnJhbWVyL2ZyYW1lci9EZWJ1Zy5jb2ZmZWUiLCIvVXNlcnMvUGF1bC9naXQvRnJhbWVyL2ZyYW1lci9EZWZhdWx0cy5jb2ZmZWUiLCIvVXNlcnMvUGF1bC9naXQvRnJhbWVyL2ZyYW1lci9FdmVudEVtaXR0ZXIuY29mZmVlIiwiL1VzZXJzL1BhdWwvZ2l0L0ZyYW1lci9mcmFtZXIvRXZlbnRzLmNvZmZlZSIsIi9Vc2Vycy9QYXVsL2dpdC9GcmFtZXIvZnJhbWVyL0ZyYW1lLmNvZmZlZSIsIi9Vc2Vycy9QYXVsL2dpdC9GcmFtZXIvZnJhbWVyL0ZyYW1lci5jb2ZmZWUiLCIvVXNlcnMvUGF1bC9naXQvRnJhbWVyL2ZyYW1lci9JbXBvcnRlci5jb2ZmZWUiLCIvVXNlcnMvUGF1bC9naXQvRnJhbWVyL2ZyYW1lci9MYXllci5jb2ZmZWUiLCIvVXNlcnMvUGF1bC9naXQvRnJhbWVyL2ZyYW1lci9MYXllckRyYWdnYWJsZS5jb2ZmZWUiLCIvVXNlcnMvUGF1bC9naXQvRnJhbWVyL2ZyYW1lci9MYXllclN0YXRlcy5jb2ZmZWUiLCIvVXNlcnMvUGF1bC9naXQvRnJhbWVyL2ZyYW1lci9MYXllclN0eWxlLmNvZmZlZSIsIi9Vc2Vycy9QYXVsL2dpdC9GcmFtZXIvZnJhbWVyL1VuZGVyc2NvcmUuY29mZmVlIiwiL1VzZXJzL1BhdWwvZ2l0L0ZyYW1lci9mcmFtZXIvVXRpbHMuY29mZmVlIiwiL1VzZXJzL1BhdWwvZ2l0L0ZyYW1lci9ub2RlX21vZHVsZXMvbG9kYXNoL2Rpc3QvbG9kYXNoLmpzIiwiL1VzZXJzL1BhdWwvZ2l0L0ZyYW1lci9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS5zdHJpbmcvbGliL3VuZGVyc2NvcmUuc3RyaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBLDJKQUFBO0dBQUE7O2tTQUFBOztBQUFDLENBQUQsRUFBTSxJQUFBLE9BQUE7O0FBRU4sQ0FGQSxFQUVRLEVBQVIsRUFBUSxFQUFBOztBQUVQLENBSkQsRUFJVyxHQUpYLENBSVcsR0FBQTs7QUFDVixDQUxELEVBS2EsSUFBQSxDQUxiLElBS2E7O0FBQ1osQ0FORCxFQU1pQixJQUFBLEtBTmpCLElBTWlCOztBQUNoQixDQVBELEVBT1UsRUFQVixFQU9VLEVBQUE7O0FBRVQsQ0FURCxFQVNtQixJQUFBLE9BVG5CLGNBU21COztBQUNsQixDQVZELEVBVXdCLElBQUEsWUFWeEIsY0FVd0I7O0FBQ3ZCLENBWEQsRUFXc0IsSUFBQSxVQVh0QixjQVdzQjs7QUFDckIsQ0FaRCxFQVlzQixJQUFBLFVBWnRCLGNBWXNCOztBQUV0QixDQWRBLEVBZUMsWUFERDtDQUNDLENBQUEsTUFBQSxNQUFBO0NBQUEsQ0FDQSxZ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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDam9OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsie199ID0gcmVxdWlyZSBcIi4vVW5kZXJzY29yZVwiXG5cblV0aWxzID0gcmVxdWlyZSBcIi4vVXRpbHNcIlxuXG57Q29uZmlnfSA9IHJlcXVpcmUgXCIuL0NvbmZpZ1wiXG57RGVmYXVsdHN9ID0gcmVxdWlyZSBcIi4vRGVmYXVsdHNcIlxue0V2ZW50RW1pdHRlcn0gPSByZXF1aXJlIFwiLi9FdmVudEVtaXR0ZXJcIlxue0ZyYW1lfSA9IHJlcXVpcmUgXCIuL0ZyYW1lXCJcblxue0xpbmVhckFuaW1hdG9yfSA9IHJlcXVpcmUgXCIuL0FuaW1hdG9ycy9MaW5lYXJBbmltYXRvclwiXG57QmV6aWVyQ3VydmVBbmltYXRvcn0gPSByZXF1aXJlIFwiLi9BbmltYXRvcnMvQmV6aWVyQ3VydmVBbmltYXRvclwiXG57U3ByaW5nUks0QW5pbWF0b3J9ID0gcmVxdWlyZSBcIi4vQW5pbWF0b3JzL1NwcmluZ1JLNEFuaW1hdG9yXCJcbntTcHJpbmdESE9BbmltYXRvcn0gPSByZXF1aXJlIFwiLi9BbmltYXRvcnMvU3ByaW5nREhPQW5pbWF0b3JcIlxuXG5BbmltYXRvckNsYXNzZXMgPVxuXHRcImxpbmVhclwiOiBMaW5lYXJBbmltYXRvclxuXHRcImJlemllci1jdXJ2ZVwiOiBCZXppZXJDdXJ2ZUFuaW1hdG9yXG5cdFwic3ByaW5nLXJrNFwiOiBTcHJpbmdSSzRBbmltYXRvclxuXHRcInNwcmluZy1kaG9cIjogU3ByaW5nREhPQW5pbWF0b3JcblxuQW5pbWF0b3JDbGFzc2VzW1wic3ByaW5nXCJdID0gQW5pbWF0b3JDbGFzc2VzW1wic3ByaW5nLXJrNFwiXVxuQW5pbWF0b3JDbGFzc2VzW1wiY3ViaWMtYmV6aWVyXCJdID0gQW5pbWF0b3JDbGFzc2VzW1wiYmV6aWVyLWN1cnZlXCJdXG5cbl9ydW5uaW5nQW5pbWF0aW9ucyA9IFtdXG5cbiMgVG9kbzogdGhpcyB3b3VsZCBub3JtYWxseSBiZSBCYXNlQ2xhc3MgYnV0IHRoZSBwcm9wZXJ0aWVzIGtleXdvcmRcbiMgaXMgbm90IGNvbXBhdGlibGUgYW5kIGNhdXNlcyBwcm9ibGVtcy5cbmNsYXNzIGV4cG9ydHMuQW5pbWF0aW9uIGV4dGVuZHMgRXZlbnRFbWl0dGVyXG5cblx0QHJ1bm5pbmdBbmltYXRpb25zID0gLT5cblx0XHRfcnVubmluZ0FuaW1hdGlvbnNcblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cblx0XHRvcHRpb25zID0gRGVmYXVsdHMuZ2V0RGVmYXVsdHMgXCJBbmltYXRpb25cIiwgb3B0aW9uc1xuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cdFx0QG9wdGlvbnMgPSBVdGlscy5zZXREZWZhdWx0UHJvcGVydGllcyBvcHRpb25zLFxuXHRcdFx0bGF5ZXI6IG51bGxcblx0XHRcdHByb3BlcnRpZXM6IHt9XG5cdFx0XHRjdXJ2ZTogXCJsaW5lYXJcIlxuXHRcdFx0Y3VydmVPcHRpb25zOiB7fVxuXHRcdFx0dGltZTogMVxuXHRcdFx0cmVwZWF0OiAwXG5cdFx0XHRkZWxheTogMFxuXHRcdFx0ZGVidWc6IHRydWVcblxuXHRcdGlmIG9wdGlvbnMubGF5ZXIgaXMgbnVsbFxuXHRcdFx0Y29uc29sZS5lcnJvciBcIkFuaW1hdGlvbjogbWlzc2luZyBsYXllclwiXG5cblx0XHRpZiBvcHRpb25zLm9yaWdpblxuXHRcdFx0Y29uc29sZS53YXJuIFwiQW5pbWF0aW9uLm9yaWdpbjogcGxlYXNlIHVzZSBsYXllci5vcmlnaW5YIGFuZCBsYXllci5vcmlnaW5ZXCJcblxuXHRcdCMgQ29udmVydCBhIGZyYW1lIGluc3RhbmNlIHRvIGEgcmVndWxhciBqcyBvYmplY3Rcblx0XHRpZiBvcHRpb25zLnByb3BlcnRpZXMgaW5zdGFuY2VvZiBGcmFtZVxuXHRcdFx0b3B0aW9uLnByb3BlcnRpZXMgPSBvcHRpb24ucHJvcGVydGllcy5wcm9wZXJ0aWVzXG5cblx0XHRAb3B0aW9ucy5wcm9wZXJ0aWVzID0gQF9maWx0ZXJBbmltYXRhYmxlUHJvcGVydGllcyBAb3B0aW9ucy5wcm9wZXJ0aWVzXG5cblx0XHRAX3BhcnNlQW5pbWF0b3JPcHRpb25zKClcblx0XHRAX29yaWdpbmFsU3RhdGUgPSBAX2N1cnJlbnRTdGF0ZSgpXG5cdFx0QF9yZXBlYXRDb3VudGVyID0gQG9wdGlvbnMucmVwZWF0XG5cblx0X2ZpbHRlckFuaW1hdGFibGVQcm9wZXJ0aWVzOiAocHJvcGVydGllcykgLT5cblxuXHRcdGFuaW1hdGFibGVQcm9wZXJ0aWVzID0ge31cblxuXHRcdCMgT25seSBhbmltYXRlIG51bWVyaWMgcHJvcGVydGllcyBmb3Igbm93XG5cdFx0Zm9yIGssIHYgb2YgcHJvcGVydGllc1xuXHRcdFx0YW5pbWF0YWJsZVByb3BlcnRpZXNba10gPSB2IGlmIF8uaXNOdW1iZXIgdlxuXG5cdFx0YW5pbWF0YWJsZVByb3BlcnRpZXNcblxuXHRfY3VycmVudFN0YXRlOiAtPlxuXHRcdF8ucGljayBAb3B0aW9ucy5sYXllciwgXy5rZXlzKEBvcHRpb25zLnByb3BlcnRpZXMpXG5cblx0X2FuaW1hdG9yQ2xhc3M6IC0+XG5cblx0XHRwYXJzZWRDdXJ2ZSA9IFV0aWxzLnBhcnNlRnVuY3Rpb24gQG9wdGlvbnMuY3VydmVcblx0XHRhbmltYXRvckNsYXNzTmFtZSA9IHBhcnNlZEN1cnZlLm5hbWUudG9Mb3dlckNhc2UoKVxuXG5cdFx0aWYgQW5pbWF0b3JDbGFzc2VzLmhhc093blByb3BlcnR5IGFuaW1hdG9yQ2xhc3NOYW1lXG5cdFx0XHRyZXR1cm4gQW5pbWF0b3JDbGFzc2VzW2FuaW1hdG9yQ2xhc3NOYW1lXVxuXG5cdFx0cmV0dXJuIExpbmVhckFuaW1hdG9yXG5cblx0X3BhcnNlQW5pbWF0b3JPcHRpb25zOiAtPlxuXG5cdFx0YW5pbWF0b3JDbGFzcyA9IEBfYW5pbWF0b3JDbGFzcygpXG5cdFx0cGFyc2VkQ3VydmUgPSBVdGlscy5wYXJzZUZ1bmN0aW9uIEBvcHRpb25zLmN1cnZlXG5cblx0XHQjIFRoaXMgaXMgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCB0aGUgZGlyZWN0IEFuaW1hdGlvbi50aW1lIGFyZ3VtZW50LiBUaGlzIHNob3VsZFxuXHRcdCMgaWRlYWxseSBhbHNvIGJlIHBhc3NlZCBhcyBhIGN1cnZlT3B0aW9uXG5cblx0XHRpZiBhbmltYXRvckNsYXNzIGluIFtMaW5lYXJBbmltYXRvciwgQmV6aWVyQ3VydmVBbmltYXRvcl1cblx0XHRcdGlmIF8uaXNTdHJpbmcoQG9wdGlvbnMuY3VydmVPcHRpb25zKSBvciBfLmlzQXJyYXkoQG9wdGlvbnMuY3VydmVPcHRpb25zKVxuXHRcdFx0XHRAb3B0aW9ucy5jdXJ2ZU9wdGlvbnMgPVxuXHRcdFx0XHRcdHZhbHVlczogQG9wdGlvbnMuY3VydmVPcHRpb25zXG5cblx0XHRcdEBvcHRpb25zLmN1cnZlT3B0aW9ucy50aW1lID89IEBvcHRpb25zLnRpbWVcblxuXHRcdCMgQWxsIHRoaXMgaXMgdG8gc3VwcG9ydCBjdXJ2ZTogXCJzcHJpbmcoMTAwLDIwLDEwKVwiLiBJbiB0aGUgZnV0dXJlIHdlJ2QgbGlrZSBwZW9wbGVcblx0XHQjIHRvIHN0YXJ0IHVzaW5nIGN1cnZlT3B0aW9uczoge3RlbnNpb246MTAwLCBmcmljdGlvbjoxMH0gZXRjXG5cblx0XHRpZiBwYXJzZWRDdXJ2ZS5hcmdzLmxlbmd0aFxuXG5cdFx0XHQjIGNvbnNvbGUud2FybiBcIkFuaW1hdGlvbi5jdXJ2ZSBhcmd1bWVudHMgYXJlIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgQW5pbWF0aW9uLmN1cnZlT3B0aW9uc1wiXG5cblx0XHRcdGlmIGFuaW1hdG9yQ2xhc3MgaXMgQmV6aWVyQ3VydmVBbmltYXRvclxuXHRcdFx0XHRAb3B0aW9ucy5jdXJ2ZU9wdGlvbnMudmFsdWVzID0gcGFyc2VkQ3VydmUuYXJncy5tYXAgKHYpIC0+IHBhcnNlRmxvYXQodikgb3IgMFxuXG5cdFx0XHRpZiBhbmltYXRvckNsYXNzIGlzIFNwcmluZ1JLNEFuaW1hdG9yXG5cdFx0XHRcdGZvciBrLCBpIGluIFtcInRlbnNpb25cIiwgXCJmcmljdGlvblwiLCBcInZlbG9jaXR5XCJdXG5cdFx0XHRcdFx0dmFsdWUgPSBwYXJzZUZsb2F0IHBhcnNlZEN1cnZlLmFyZ3NbaV1cblx0XHRcdFx0XHRAb3B0aW9ucy5jdXJ2ZU9wdGlvbnNba10gPSB2YWx1ZSBpZiB2YWx1ZVxuXG5cdFx0XHRpZiBhbmltYXRvckNsYXNzIGlzIFNwcmluZ0RIT0FuaW1hdG9yXG5cdFx0XHRcdGZvciBrLCBpIGluIFtcInN0aWZmbmVzc1wiLCBcImRhbXBpbmdcIiwgXCJtYXNzXCIsIFwidG9sZXJhbmNlXCJdXG5cdFx0XHRcdFx0dmFsdWUgPSBwYXJzZUZsb2F0IHBhcnNlZEN1cnZlLmFyZ3NbaV1cblx0XHRcdFx0XHRAb3B0aW9ucy5jdXJ2ZU9wdGlvbnNba10gPSB2YWx1ZSBpZiB2YWx1ZVxuXG5cdHN0YXJ0OiA9PlxuXG5cdFx0QW5pbWF0b3JDbGFzcyA9IEBfYW5pbWF0b3JDbGFzcygpXG5cblx0XHRjb25zb2xlLmRlYnVnIFwiQW5pbWF0aW9uLnN0YXJ0ICN7QW5pbWF0b3JDbGFzcy5uYW1lfVwiLCBAb3B0aW9ucy5jdXJ2ZU9wdGlvbnNcblxuXHRcdEBfYW5pbWF0b3IgPSBuZXcgQW5pbWF0b3JDbGFzcyBAb3B0aW9ucy5jdXJ2ZU9wdGlvbnNcblxuXHRcdHRhcmdldCA9IEBvcHRpb25zLmxheWVyXG5cdFx0c3RhdGVBID0gQF9jdXJyZW50U3RhdGUoKVxuXHRcdHN0YXRlQiA9IHt9XG5cblx0XHQjIEZpbHRlciBvdXQgdGhlIHByb3BlcnRpZXMgdGhhdCBhcmUgZXF1YWxcblx0XHRmb3IgaywgdiBvZiBAb3B0aW9ucy5wcm9wZXJ0aWVzXG5cdFx0XHRzdGF0ZUJba10gPSB2IGlmIHN0YXRlQVtrXSAhPSB2XG5cblx0XHRpZiBfLmlzRXF1YWwgc3RhdGVBLCBzdGF0ZUJcblx0XHRcdGNvbnNvbGUud2FybiBcIk5vdGhpbmcgdG8gYW5pbWF0ZVwiXG5cblx0XHRjb25zb2xlLmRlYnVnIFwiQW5pbWF0aW9uLnN0YXJ0XCJcblx0XHRjb25zb2xlLmRlYnVnIFwiXFx0I3trfTogI3tzdGF0ZUFba119IC0+ICN7c3RhdGVCW2tdfVwiIGZvciBrLCB2IG9mIHN0YXRlQiBcblxuXHRcdEBfYW5pbWF0b3Iub24gXCJzdGFydFwiLCA9PiBAZW1pdCBcInN0YXJ0XCJcblx0XHRAX2FuaW1hdG9yLm9uIFwic3RvcFwiLCAgPT4gQGVtaXQgXCJzdG9wXCJcblx0XHRAX2FuaW1hdG9yLm9uIFwiZW5kXCIsICAgPT4gQGVtaXQgXCJlbmRcIlxuXG5cdFx0IyBTZWUgaWYgd2UgbmVlZCB0byByZXBlYXQgdGhpcyBhbmltYXRpb25cblx0XHQjIFRvZG86IG1vcmUgcmVwZWF0IGJlaGF2aW91cnM6XG5cdFx0IyAxKSBhZGQgKGZyb20gZW5kIHBvc2l0aW9uKSAyKSByZXZlcnNlIChsb29wIGJldHdlZW4gYSBhbmQgYilcblx0XHRpZiBAX3JlcGVhdENvdW50ZXIgPiAwXG5cdFx0XHRAX2FuaW1hdG9yLm9uIFwiZW5kXCIsID0+XG5cdFx0XHRcdGZvciBrLCB2IG9mIHN0YXRlQVxuXHRcdFx0XHRcdHRhcmdldFtrXSA9IHZcblx0XHRcdFx0QF9yZXBlYXRDb3VudGVyLS1cblx0XHRcdFx0QHN0YXJ0KClcblxuXHRcdCMgVGhpcyBpcyB0aGUgZnVuY3Rpb24gdGhhdCBzZXRzIHRoZSBhY3R1YWwgdmFsdWUgdG8gdGhlIGxheWVyIGluIHRoZVxuXHRcdCMgYW5pbWF0aW9uIGxvb3AuIEl0IG5lZWRzIHRvIGJlIHZlcnkgZmFzdC5cblx0XHRAX2FuaW1hdG9yLm9uIFwidGlja1wiLCAodmFsdWUpIC0+XG5cdFx0XHRmb3IgaywgdiBvZiBzdGF0ZUJcblx0XHRcdFx0dGFyZ2V0W2tdID0gVXRpbHMubWFwUmFuZ2UgdmFsdWUsIDAsIDEsIHN0YXRlQVtrXSwgc3RhdGVCW2tdXG5cdFx0XHRyZXR1cm4gIyBGb3IgcGVyZm9ybWFuY2VcblxuXHRcdHN0YXJ0ID0gPT5cblx0XHRcdF9ydW5uaW5nQW5pbWF0aW9ucy5wdXNoIEBcblx0XHRcdEBfYW5pbWF0b3Iuc3RhcnQoKVxuXG5cdFx0IyBJZiB3ZSBoYXZlIGEgZGVsYXksIHdlIHdhaXQgYSBiaXQgZm9yIGl0IHRvIHN0YXJ0XG5cdFx0aWYgQG9wdGlvbnMuZGVsYXlcblx0XHRcdFV0aWxzLmRlbGF5IEBvcHRpb25zLmRlbGF5LCBzdGFydFxuXHRcdGVsc2Vcblx0XHRcdHN0YXJ0KClcblxuXG5cdHN0b3A6IC0+XG5cdFx0QF9hbmltYXRvci5zdG9wKClcblx0XHRfcnVubmluZ0FuaW1hdGlvbnMgPSBfLndpdGhvdXQgX3J1bm5pbmdBbmltYXRpb25zLCBAXG5cblx0cmV2ZXJzZTogLT5cblx0XHQjIFRPRE86IEFkZCBzb21lIHRlc3RzXG5cdFx0b3B0aW9ucyA9IF8uY2xvbmUgQG9wdGlvbnNcblx0XHRvcHRpb25zLnByb3BlcnRpZXMgPSBAX29yaWdpbmFsU3RhdGVcblx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uIG9wdGlvbnNcblx0XHRhbmltYXRpb25cblxuXHQjIEEgYnVuY2ggb2YgY29tbW9uIGFsaWFzZXMgdG8gbWluaW1pemUgZnJ1c3RyYXRpb25cblx0cmV2ZXJ0OiAtPiBcdEByZXZlcnNlKClcblx0aW52ZXJzZTogLT4gQHJldmVyc2UoKVxuXHRpbnZlcnQ6IC0+IFx0QHJldmVyc2UoKVxuXG5cdGVtaXQ6IChldmVudCkgLT5cblx0XHRzdXBlclxuXHRcdCMgQWxzbyBlbWl0IHRoaXMgdG8gdGhlIGxheWVyIHdpdGggc2VsZiBhcyBhcmd1bWVudFxuXHRcdEBvcHRpb25zLmxheWVyLmVtaXQgZXZlbnQsIEBcbiIsIntffSA9IHJlcXVpcmUgXCIuL1VuZGVyc2NvcmVcIlxuXG5VdGlscyA9IHJlcXVpcmUgXCIuL1V0aWxzXCJcblxue0NvbmZpZ30gPSByZXF1aXJlIFwiLi9Db25maWdcIlxue0V2ZW50RW1pdHRlcn0gPSByZXF1aXJlIFwiLi9FdmVudEVtaXR0ZXJcIlxuXG4jIE5vdGU6IHRoaXMgaXMgbm90IGFuIG9iamVjdCBiZWNhdXNlIHRoZXJlIHNob3VsZCByZWFsbHkgb25seSBiZSBvbmVcblxuQW5pbWF0aW9uTG9vcEluZGV4S2V5ID0gXCJfYW5pbWF0aW9uTG9vcEluZGV4XCJcblxuQW5pbWF0aW9uTG9vcCA9IFxuXG5cdGRlYnVnOiBmYWxzZVxuXG5cdF9hbmltYXRvcnM6IFtdXG5cdF9ydW5uaW5nOiBmYWxzZVxuXHRfZnJhbWVDb3VudGVyOiAwXG5cdF9zZXNzaW9uVGltZTogMFxuXHRcblx0X3N0YXJ0OiAtPlxuXG5cdFx0aWYgQW5pbWF0aW9uTG9vcC5fcnVubmluZ1xuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiBub3QgQW5pbWF0aW9uTG9vcC5fYW5pbWF0b3JzLmxlbmd0aFxuXHRcdFx0cmV0dXJuXG5cblx0XHRBbmltYXRpb25Mb29wLl9ydW5uaW5nID0gdHJ1ZVxuXHRcdEFuaW1hdGlvbkxvb3AuX3RpbWUgPSBVdGlscy5nZXRUaW1lKClcblx0XHRBbmltYXRpb25Mb29wLl9zZXNzaW9uVGltZSA9IDBcblxuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgQW5pbWF0aW9uTG9vcC5fdGlja1xuXG5cdF9zdG9wOiAtPlxuXHRcdGNvbnNvbGUuZGVidWcgXCJBbmltYXRpb25Mb29wLl9zdG9wXCJcblx0XHRBbmltYXRpb25Mb29wLl9ydW5uaW5nID0gZmFsc2VcblxuXG5cdF90aWNrOiAtPlxuXG5cdFx0aWYgbm90IEFuaW1hdGlvbkxvb3AuX2FuaW1hdG9ycy5sZW5ndGhcblx0XHRcdHJldHVybiBBbmltYXRpb25Mb29wLl9zdG9wKClcblxuXHRcdGlmIEFuaW1hdGlvbkxvb3AuX3Nlc3Npb25UaW1lID09IDBcblx0XHRcdGNvbnNvbGUuZGVidWcgXCJBbmltYXRpb25Mb29wLl9zdGFydFwiXG5cblxuXHRcdEFuaW1hdGlvbkxvb3AuX2ZyYW1lQ291bnRlcisrXG5cdFx0XG5cdFx0dGltZSAgPSBVdGlscy5nZXRUaW1lKClcblx0XHRkZWx0YSA9IHRpbWUgLSBBbmltYXRpb25Mb29wLl90aW1lXG5cblx0XHRBbmltYXRpb25Mb29wLl9zZXNzaW9uVGltZSArPSBkZWx0YVxuXG5cdFx0IyBjb25zb2xlLmRlYnVnIFtcblx0XHQjIFx0XCJfdGljayAje0FuaW1hdGlvbkxvb3AuX2ZyYW1lQ291bnRlcn0gXCIsXG5cdFx0IyBcdFwiI3tVdGlscy5yb3VuZChkZWx0YSwgNSl9bXMgXCIsXG5cdFx0IyBcdFwiI3tVdGlscy5yb3VuZChBbmltYXRpb25Mb29wLl9zZXNzaW9uVGltZSwgNSl9XCIsXG5cdFx0IyBcdFwiYW5pbWF0b3JzOiN7QW5pbWF0aW9uTG9vcC5fYW5pbWF0b3JzLmxlbmd0aH1cIlxuXHRcdCMgXS5qb2luIFwiIFwiXG5cblx0XHRyZW1vdmVBbmltYXRvcnMgPSBbXVxuXG5cdFx0Zm9yIGFuaW1hdG9yIGluIEFuaW1hdGlvbkxvb3AuX2FuaW1hdG9yc1xuXG5cdFx0XHRhbmltYXRvci5lbWl0IFwidGlja1wiLCBhbmltYXRvci5uZXh0KGRlbHRhKVxuXG5cdFx0XHRpZiBhbmltYXRvci5maW5pc2hlZCgpXG5cdFx0XHRcdGFuaW1hdG9yLmVtaXQgXCJ0aWNrXCIsIDEgIyBUaGlzIG1ha2VzIHN1cmUgd2UgYW5kIGF0IGEgcGVyZmVjdCB2YWx1ZVxuXHRcdFx0XHRyZW1vdmVBbmltYXRvcnMucHVzaCBhbmltYXRvclxuXG5cdFx0QW5pbWF0aW9uTG9vcC5fdGltZSA9IHRpbWVcblxuXHRcdGZvciBhbmltYXRvciBpbiByZW1vdmVBbmltYXRvcnNcblx0XHRcdEFuaW1hdGlvbkxvb3AucmVtb3ZlIGFuaW1hdG9yXG5cdFx0XHRhbmltYXRvci5lbWl0IFwiZW5kXCJcblxuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgQW5pbWF0aW9uTG9vcC5fdGlja1xuXG5cdFx0cmV0dXJuICMgSW1wb3J0YW50IGZvciBwZXJmb3JtYW5jZVxuXG5cdGFkZDogKGFuaW1hdG9yKSAtPlxuXG5cdFx0aWYgYW5pbWF0b3IuaGFzT3duUHJvcGVydHkgQW5pbWF0aW9uTG9vcEluZGV4S2V5XG5cdFx0XHRyZXR1cm5cblxuXHRcdGFuaW1hdG9yW0FuaW1hdGlvbkxvb3BJbmRleEtleV0gPSBBbmltYXRpb25Mb29wLl9hbmltYXRvcnMucHVzaCBhbmltYXRvclxuXHRcdGFuaW1hdG9yLmVtaXQgXCJzdGFydFwiXG5cdFx0QW5pbWF0aW9uTG9vcC5fc3RhcnQoKVxuXG5cdHJlbW92ZTogKGFuaW1hdG9yKSAtPlxuXHRcdEFuaW1hdGlvbkxvb3AuX2FuaW1hdG9ycyA9IF8ud2l0aG91dCBBbmltYXRpb25Mb29wLl9hbmltYXRvcnMsIGFuaW1hdG9yXG5cdFx0YW5pbWF0b3IuZW1pdCBcInN0b3BcIlxuXG5leHBvcnRzLkFuaW1hdGlvbkxvb3AgPSBBbmltYXRpb25Mb29wXG4iLCJVdGlscyA9IHJlcXVpcmUgXCIuL1V0aWxzXCJcblxue0NvbmZpZ30gPSByZXF1aXJlIFwiLi9Db25maWdcIlxue0V2ZW50RW1pdHRlcn0gPSByZXF1aXJlIFwiLi9FdmVudEVtaXR0ZXJcIlxue0FuaW1hdGlvbkxvb3B9ID0gcmVxdWlyZSBcIi4vQW5pbWF0aW9uTG9vcFwiXG5cbmNsYXNzIGV4cG9ydHMuQW5pbWF0b3IgZXh0ZW5kcyBFdmVudEVtaXR0ZXJcblxuXHRcIlwiXCJcblx0VGhlIGFuaW1hdG9yIGNsYXNzIGlzIGEgdmVyeSBzaW1wbGUgY2xhc3MgdGhhdFxuXHRcdC0gVGFrZXMgYSBzZXQgb2YgaW5wdXQgdmFsdWVzIGF0IHNldHVwKHtpbnB1dCB2YWx1ZXN9KVxuXHRcdC0gRW1pdHMgYW4gb3V0cHV0IHZhbHVlIGZvciBwcm9ncmVzcyAoMCAtPiAxKSBpbiB2YWx1ZShwcm9ncmVzcylcblx0XCJcIlwiXG5cdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0QHNldHVwIG9wdGlvbnNcblxuXHRzZXR1cDogKG9wdGlvbnMpIC0+XG5cdFx0dGhyb3cgRXJyb3IgXCJOb3QgaW1wbGVtZW50ZWRcIlxuXG5cdG5leHQ6IChkZWx0YSkgLT5cblx0XHR0aHJvdyBFcnJvciBcIk5vdCBpbXBsZW1lbnRlZFwiXG5cblx0ZmluaXNoZWQ6IC0+XG5cdFx0dGhyb3cgRXJyb3IgXCJOb3QgaW1wbGVtZW50ZWRcIlxuXG5cdHN0YXJ0OiAtPiBBbmltYXRpb25Mb29wLmFkZCBAXG5cdHN0b3A6IC0+IEFuaW1hdGlvbkxvb3AucmVtb3ZlIEBcbiIsIntffSA9IHJlcXVpcmUgXCIuLi9VbmRlcnNjb3JlXCJcblV0aWxzID0gcmVxdWlyZSBcIi4uL1V0aWxzXCJcblxue0FuaW1hdG9yfSA9IHJlcXVpcmUgXCIuLi9BbmltYXRvclwiXG5cbkJlemllckN1cnZlRGVmYXVsdHMgPVxuXHRcImxpbmVhclwiOiBbMCwgMCwgMSwgMV1cblx0XCJlYXNlXCI6IFsuMjUsIC4xLCAuMjUsIDFdXG5cdFwiZWFzZS1pblwiOiBbLjQyLCAwLCAxLCAxXVxuXHRcImVhc2Utb3V0XCI6IFswLCAwLCAuNTgsIDFdXG5cdFwiZWFzZS1pbi1vdXRcIjogWy40MiwgMCwgLjU4LCAxXVxuXG5jbGFzcyBleHBvcnRzLkJlemllckN1cnZlQW5pbWF0b3IgZXh0ZW5kcyBBbmltYXRvclxuXG5cdHNldHVwOiAob3B0aW9ucykgLT5cblxuXHRcdCMgSW5wdXQgaXMgYSBvbmUgb2YgdGhlIG5hbWVkIGJlemllciBjdXJ2ZXNcblx0XHRpZiBfLmlzU3RyaW5nKG9wdGlvbnMpIGFuZCBCZXppZXJDdXJ2ZURlZmF1bHRzLmhhc093blByb3BlcnR5IG9wdGlvbnMudG9Mb3dlckNhc2UoKVxuXHRcdFx0b3B0aW9ucyA9IHsgdmFsdWVzOiBCZXppZXJDdXJ2ZURlZmF1bHRzW29wdGlvbnMudG9Mb3dlckNhc2UoKV0gfVxuXG5cdFx0IyBJbnB1dCB2YWx1ZXMgaXMgb25lIG9mIHRoZSBuYW1lZCBiZXppZXIgY3VydmVzXG5cdFx0aWYgb3B0aW9ucy52YWx1ZXMgYW5kIF8uaXNTdHJpbmcob3B0aW9ucy52YWx1ZXMpIGFuZCBCZXppZXJDdXJ2ZURlZmF1bHRzLmhhc093blByb3BlcnR5IG9wdGlvbnMudmFsdWVzLnRvTG93ZXJDYXNlKClcblx0XHRcdG9wdGlvbnMgPSB7IHZhbHVlczogQmV6aWVyQ3VydmVEZWZhdWx0c1tvcHRpb25zLnZhbHVlcy50b0xvd2VyQ2FzZSgpXSwgdGltZTogb3B0aW9ucy50aW1lIH1cblxuXHRcdCMgSW5wdXQgaXMgYSBzaW5nbGUgYXJyYXkgb2YgNCB2YWx1ZXNcblx0XHRpZiBfLmlzQXJyYXkob3B0aW9ucykgYW5kIG9wdGlvbnMubGVuZ3RoIGlzIDRcblx0XHRcdG9wdGlvbnMgPSB7IHZhbHVlczogb3B0aW9ucyB9XG5cblx0XHRAb3B0aW9ucyA9IFV0aWxzLnNldERlZmF1bHRQcm9wZXJ0aWVzIG9wdGlvbnMsXG5cdFx0XHR2YWx1ZXM6IEJlemllckN1cnZlRGVmYXVsdHNbXCJlYXNlLWluLW91dFwiXVxuXHRcdFx0dGltZTogMVxuXG5cdFx0QF91bml0QmV6aWVyID0gbmV3IFVuaXRCZXppZXIgXFxcblx0XHRcdEBvcHRpb25zLnZhbHVlc1swXSxcblx0XHRcdEBvcHRpb25zLnZhbHVlc1sxXSxcblx0XHRcdEBvcHRpb25zLnZhbHVlc1syXSxcblx0XHRcdEBvcHRpb25zLnZhbHVlc1szXSxcblxuXHRcdEBfdGltZSA9IDBcblxuXG5cdG5leHQ6IChkZWx0YSkgLT5cblxuXHRcdEBfdGltZSArPSBkZWx0YVxuXG5cdFx0aWYgQGZpbmlzaGVkKClcblx0XHRcdHJldHVybiAxXG5cblx0XHRAX3VuaXRCZXppZXIuc29sdmUgQF90aW1lIC8gQG9wdGlvbnMudGltZVxuXG5cdGZpbmlzaGVkOiAtPlxuXHRcdEBfdGltZSA+PSBAb3B0aW9ucy50aW1lXG5cblxuIyBXZWJLaXQgaW1wbGVtZW50YXRpb24gZm91bmQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTE2OTc5MDlcblxuY2xhc3MgVW5pdEJlemllclxuXG5cdGVwc2lsb246IDFlLTYgIyBQcmVjaXNpb25cblxuXHRjb25zdHJ1Y3RvcjogKHAxeCwgcDF5LCBwMngsIHAyeSkgLT5cblxuXHRcdCMgcHJlLWNhbGN1bGF0ZSB0aGUgcG9seW5vbWlhbCBjb2VmZmljaWVudHNcblx0XHQjIEZpcnN0IGFuZCBsYXN0IGNvbnRyb2wgcG9pbnRzIGFyZSBpbXBsaWVkIHRvIGJlICgwLDApIGFuZCAoMS4wLCAxLjApXG5cdFx0QGN4ID0gMy4wICogcDF4XG5cdFx0QGJ4ID0gMy4wICogKHAyeCAtIHAxeCkgLSBAY3hcblx0XHRAYXggPSAxLjAgLSBAY3ggLSBAYnhcblx0XHRAY3kgPSAzLjAgKiBwMXlcblx0XHRAYnkgPSAzLjAgKiAocDJ5IC0gcDF5KSAtIEBjeVxuXHRcdEBheSA9IDEuMCAtIEBjeSAtIEBieVxuXG5cdHNhbXBsZUN1cnZlWDogKHQpIC0+XG5cdFx0KChAYXggKiB0ICsgQGJ4KSAqIHQgKyBAY3gpICogdFxuXG5cdHNhbXBsZUN1cnZlWTogKHQpIC0+XG5cdFx0KChAYXkgKiB0ICsgQGJ5KSAqIHQgKyBAY3kpICogdFxuXG5cdHNhbXBsZUN1cnZlRGVyaXZhdGl2ZVg6ICh0KSAtPlxuXHRcdCgzLjAgKiBAYXggKiB0ICsgMi4wICogQGJ4KSAqIHQgKyBAY3hcblxuXHRzb2x2ZUN1cnZlWDogKHgpIC0+XG5cblx0XHQjIEZpcnN0IHRyeSBhIGZldyBpdGVyYXRpb25zIG9mIE5ld3RvbidzIG1ldGhvZCAtLSBub3JtYWxseSB2ZXJ5IGZhc3QuXG5cdFx0dDIgPSB4XG5cdFx0aSA9IDBcblxuXHRcdHdoaWxlIGkgPCA4XG5cdFx0XHR4MiA9IEBzYW1wbGVDdXJ2ZVgodDIpIC0geFxuXHRcdFx0cmV0dXJuIHQyXHRpZiBNYXRoLmFicyh4MikgPCBAZXBzaWxvblxuXHRcdFx0ZDIgPSBAc2FtcGxlQ3VydmVEZXJpdmF0aXZlWCh0Milcblx0XHRcdGJyZWFrXHRpZiBNYXRoLmFicyhkMikgPCBAZXBzaWxvblxuXHRcdFx0dDIgPSB0MiAtIHgyIC8gZDJcblx0XHRcdGkrK1xuXG5cdFx0IyBObyBzb2x1dGlvbiBmb3VuZCAtIHVzZSBiaS1zZWN0aW9uXG5cdFx0dDAgPSAwLjBcblx0XHR0MSA9IDEuMFxuXHRcdHQyID0geFxuXHRcdHJldHVybiB0MFx0aWYgdDIgPCB0MFxuXHRcdHJldHVybiB0MVx0aWYgdDIgPiB0MVxuXHRcdHdoaWxlIHQwIDwgdDFcblx0XHRcdHgyID0gQHNhbXBsZUN1cnZlWCh0Milcblx0XHRcdHJldHVybiB0Mlx0aWYgTWF0aC5hYnMoeDIgLSB4KSA8IEBlcHNpbG9uXG5cdFx0XHRpZiB4ID4geDJcblx0XHRcdFx0dDAgPSB0MlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0MSA9IHQyXG5cdFx0XHR0MiA9ICh0MSAtIHQwKSAqIC41ICsgdDBcblxuXHRcdCMgR2l2ZSB1cFxuXHRcdHQyXG5cblx0c29sdmU6ICh4KSAtPlxuXHRcdEBzYW1wbGVDdXJ2ZVkgQHNvbHZlQ3VydmVYKHgpXG4iLCJVdGlscyA9IHJlcXVpcmUgXCIuLi9VdGlsc1wiXG5cbntBbmltYXRvcn0gPSByZXF1aXJlIFwiLi4vQW5pbWF0b3JcIlxuXG5jbGFzcyBleHBvcnRzLkxpbmVhckFuaW1hdG9yIGV4dGVuZHMgQW5pbWF0b3Jcblx0XG5cdHNldHVwOiAob3B0aW9ucykgLT5cblxuXHRcdEBvcHRpb25zID0gVXRpbHMuc2V0RGVmYXVsdFByb3BlcnRpZXMgb3B0aW9ucyxcblx0XHRcdHRpbWU6IDFcblxuXHRcdEBfdGltZSA9IDBcblxuXHRuZXh0OiAoZGVsdGEpIC0+XG5cblx0XHRpZiBAZmluaXNoZWQoKVxuXHRcdFx0cmV0dXJuIDFcblx0XHRcblx0XHRAX3RpbWUgKz0gZGVsdGFcblx0XHRAX3RpbWUgLyBAb3B0aW9ucy50aW1lXG5cblx0ZmluaXNoZWQ6IC0+XG5cdFx0QF90aW1lID49IEBvcHRpb25zLnRpbWUiLCJVdGlscyA9IHJlcXVpcmUgXCIuLi9VdGlsc1wiXG5cbntBbmltYXRvcn0gPSByZXF1aXJlIFwiLi4vQW5pbWF0b3JcIlxuXG5jbGFzcyBleHBvcnRzLlNwcmluZ0RIT0FuaW1hdG9yIGV4dGVuZHMgQW5pbWF0b3JcblxuXHRzZXR1cDogKG9wdGlvbnMpIC0+XG5cblx0XHRAb3B0aW9ucyA9IFV0aWxzLnNldERlZmF1bHRQcm9wZXJ0aWVzIG9wdGlvbnMsXG5cdFx0XHR2ZWxvY2l0eTogMFxuXHRcdFx0dG9sZXJhbmNlOiAxLzEwMDAwXG5cdFx0XHRzdGlmZm5lc3M6IDUwXG5cdFx0XHRkYW1waW5nOiAyXG5cdFx0XHRtYXNzOiAwLjJcblx0XHRcdHRpbWU6IG51bGwgIyBIYWNrXG5cblx0XHRjb25zb2xlLmxvZyBcIlNwcmluZ0RIT0FuaW1hdG9yLm9wdGlvbnNcIiwgQG9wdGlvbnMsIG9wdGlvbnNcblxuXHRcdEBfdGltZSA9IDBcblx0XHRAX3ZhbHVlID0gMFxuXHRcdEBfdmVsb2NpdHkgPSBAb3B0aW9ucy52ZWxvY2l0eVxuXG5cdG5leHQ6IChkZWx0YSkgLT5cblxuXHRcdGlmIEBmaW5pc2hlZCgpXG5cdFx0XHRyZXR1cm4gMVxuXG5cdFx0QF90aW1lICs9IGRlbHRhXG5cblx0XHQjIFNlZSB0aGUgbm90IHNjaWVuY2UgY29tbWVudCBhYm92ZVxuXHRcdGsgPSAwIC0gQG9wdGlvbnMuc3RpZmZuZXNzXG5cdFx0YiA9IDAgLSBAb3B0aW9ucy5kYW1waW5nXG5cblx0XHRGX3NwcmluZyA9IGsgKiAoKEBfdmFsdWUpIC0gMSlcblx0XHRGX2RhbXBlciA9IGIgKiAoQF92ZWxvY2l0eSlcblxuXHRcdEBfdmVsb2NpdHkgKz0gKChGX3NwcmluZyArIEZfZGFtcGVyKSAvIEBvcHRpb25zLm1hc3MpICogZGVsdGFcblx0XHRAX3ZhbHVlICs9IEBfdmVsb2NpdHkgKiBkZWx0YVxuXG5cdFx0QF92YWx1ZVxuXG5cdGZpbmlzaGVkOiA9PlxuXHRcdEBfdGltZSA+IDAgYW5kIE1hdGguYWJzKEBfdmVsb2NpdHkpIDwgQG9wdGlvbnMudG9sZXJhbmNlIiwiVXRpbHMgPSByZXF1aXJlIFwiLi4vVXRpbHNcIlxuXG57QW5pbWF0b3J9ID0gcmVxdWlyZSBcIi4uL0FuaW1hdG9yXCJcblxuY2xhc3MgZXhwb3J0cy5TcHJpbmdSSzRBbmltYXRvciBleHRlbmRzIEFuaW1hdG9yXG5cblx0c2V0dXA6IChvcHRpb25zKSAtPlxuXG5cdFx0QG9wdGlvbnMgPSBVdGlscy5zZXREZWZhdWx0UHJvcGVydGllcyBvcHRpb25zLFxuXHRcdFx0dGVuc2lvbjogNTAwXG5cdFx0XHRmcmljdGlvbjogMTBcblx0XHRcdHZlbG9jaXR5OiAwXG5cdFx0XHR0b2xlcmFuY2U6IDEvMTAwMDBcblx0XHRcdHRpbWU6IG51bGwgIyBIYWNrXG5cblx0XHRAX3RpbWUgPSAwXG5cdFx0QF92YWx1ZSA9IDBcblx0XHRAX3ZlbG9jaXR5ID0gQG9wdGlvbnMudmVsb2NpdHlcblx0XHRAX3N0b3BTcHJpbmcgPSBmYWxzZVxuXG5cdG5leHQ6IChkZWx0YSkgLT5cblxuXHRcdGlmIEBmaW5pc2hlZCgpXG5cdFx0XHRyZXR1cm4gMVxuXG5cdFx0QF90aW1lICs9IGRlbHRhXG5cblx0XHRzdGF0ZUJlZm9yZSA9IHt9XG5cdFx0c3RhdGVBZnRlciA9IHt9XG5cdFx0XG5cdFx0IyBDYWxjdWxhdGUgcHJldmlvdXMgc3RhdGVcblx0XHRzdGF0ZUJlZm9yZS54ID0gQF92YWx1ZSAtIDFcblx0XHRzdGF0ZUJlZm9yZS52ID0gQF92ZWxvY2l0eVxuXHRcdHN0YXRlQmVmb3JlLnRlbnNpb24gPSBAb3B0aW9ucy50ZW5zaW9uXG5cdFx0c3RhdGVCZWZvcmUuZnJpY3Rpb24gPSBAb3B0aW9ucy5mcmljdGlvblxuXHRcdFxuXHRcdCMgQ2FsY3VsYXRlIG5ldyBzdGF0ZVxuXHRcdHN0YXRlQWZ0ZXIgPSBzcHJpbmdJbnRlZ3JhdGVTdGF0ZSBzdGF0ZUJlZm9yZSwgZGVsdGFcblx0XHRAX3ZhbHVlID0gMSArIHN0YXRlQWZ0ZXIueFxuXHRcdGZpbmFsVmVsb2NpdHkgPSBzdGF0ZUFmdGVyLnZcblx0XHRuZXRGbG9hdCA9IHN0YXRlQWZ0ZXIueFxuXHRcdG5ldDFEVmVsb2NpdHkgPSBzdGF0ZUFmdGVyLnZcblxuXHRcdCMgU2VlIGlmIHdlIHJlYWNoZWQgdGhlIGVuZCBzdGF0ZVxuXHRcdG5ldFZhbHVlSXNMb3cgPSBNYXRoLmFicyhuZXRGbG9hdCkgPCBAb3B0aW9ucy50b2xlcmFuY2Vcblx0XHRuZXRWZWxvY2l0eUlzTG93ID0gTWF0aC5hYnMobmV0MURWZWxvY2l0eSkgPCBAb3B0aW9ucy50b2xlcmFuY2Vcblx0XHRcdFx0XG5cdFx0QF9zdG9wU3ByaW5nID0gbmV0VmFsdWVJc0xvdyBhbmQgbmV0VmVsb2NpdHlJc0xvd1xuXHRcdEBfdmVsb2NpdHkgPSBmaW5hbFZlbG9jaXR5XG5cblx0XHRAX3ZhbHVlXG5cblx0ZmluaXNoZWQ6ID0+XG5cdFx0QF9zdG9wU3ByaW5nXG5cblxuc3ByaW5nQWNjZWxlcmF0aW9uRm9yU3RhdGUgPSAoc3RhdGUpIC0+XG5cdHJldHVybiAtIHN0YXRlLnRlbnNpb24gKiBzdGF0ZS54IC0gc3RhdGUuZnJpY3Rpb24gKiBzdGF0ZS52XG5cbnNwcmluZ0V2YWx1YXRlU3RhdGUgPSAoaW5pdGlhbFN0YXRlKSAtPlxuXG5cdG91dHB1dCA9IHt9XG5cdG91dHB1dC5keCA9IGluaXRpYWxTdGF0ZS52XG5cdG91dHB1dC5kdiA9IHNwcmluZ0FjY2VsZXJhdGlvbkZvclN0YXRlIGluaXRpYWxTdGF0ZVxuXG5cdHJldHVybiBvdXRwdXRcblxuc3ByaW5nRXZhbHVhdGVTdGF0ZVdpdGhEZXJpdmF0aXZlID0gKGluaXRpYWxTdGF0ZSwgZHQsIGRlcml2YXRpdmUpIC0+XG5cblx0c3RhdGUgPSB7fVxuXHRzdGF0ZS54ID0gaW5pdGlhbFN0YXRlLnggKyBkZXJpdmF0aXZlLmR4ICogZHRcblx0c3RhdGUudiA9IGluaXRpYWxTdGF0ZS52ICsgZGVyaXZhdGl2ZS5kdiAqIGR0XG5cdHN0YXRlLnRlbnNpb24gPSBpbml0aWFsU3RhdGUudGVuc2lvblxuXHRzdGF0ZS5mcmljdGlvbiA9IGluaXRpYWxTdGF0ZS5mcmljdGlvblxuXG5cdG91dHB1dCA9IHt9XG5cdG91dHB1dC5keCA9IHN0YXRlLnZcblx0b3V0cHV0LmR2ID0gc3ByaW5nQWNjZWxlcmF0aW9uRm9yU3RhdGUgc3RhdGVcblxuXHRyZXR1cm4gb3V0cHV0XG5cbnNwcmluZ0ludGVncmF0ZVN0YXRlID0gKHN0YXRlLCBzcGVlZCkgLT5cblxuXHRhID0gc3ByaW5nRXZhbHVhdGVTdGF0ZSBzdGF0ZVxuXHRiID0gc3ByaW5nRXZhbHVhdGVTdGF0ZVdpdGhEZXJpdmF0aXZlIHN0YXRlLCBzcGVlZCAqIDAuNSwgYVxuXHRjID0gc3ByaW5nRXZhbHVhdGVTdGF0ZVdpdGhEZXJpdmF0aXZlIHN0YXRlLCBzcGVlZCAqIDAuNSwgYlxuXHRkID0gc3ByaW5nRXZhbHVhdGVTdGF0ZVdpdGhEZXJpdmF0aXZlIHN0YXRlLCBzcGVlZCwgY1xuXG5cdGR4ZHQgPSAxLjAvNi4wICogKGEuZHggKyAyLjAgKiAoYi5keCArIGMuZHgpICsgZC5keClcblx0ZHZkdCA9IDEuMC82LjAgKiAoYS5kdiArIDIuMCAqIChiLmR2ICsgYy5kdikgKyBkLmR2KVxuXG5cdHN0YXRlLnggPSBzdGF0ZS54ICsgZHhkdCAqIHNwZWVkXG5cdHN0YXRlLnYgPSBzdGF0ZS52ICsgZHZkdCAqIHNwZWVkXG5cblx0cmV0dXJuIHN0YXRlXG5cbiIsIntffSA9IHJlcXVpcmUgXCIuL1VuZGVyc2NvcmVcIlxuXG5VdGlscyA9IHJlcXVpcmUgXCIuL1V0aWxzXCJcblxue0V2ZW50RW1pdHRlcn0gPSByZXF1aXJlIFwiLi9FdmVudEVtaXR0ZXJcIlxuXG5Db3VudGVyS2V5ID0gXCJfT2JqZWN0Q291bnRlclwiXG5EZWZpbmVkUHJvcGVydGllc0tleSA9IFwiX0RlZmluZWRQcm9wZXJ0aWVzS2V5XCJcbkRlZmluZWRQcm9wZXJ0aWVzVmFsdWVzS2V5ID0gXCJfRGVmaW5lZFByb3BlcnRpZXNWYWx1ZXNLZXlcIlxuXG5cbmNsYXNzIGV4cG9ydHMuQmFzZUNsYXNzIGV4dGVuZHMgRXZlbnRFbWl0dGVyXG5cblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0IyBGcmFtZXIgb2JqZWN0IHByb3BlcnRpZXNcblxuXHRAZGVmaW5lID0gKHByb3BlcnR5TmFtZSwgZGVzY3JpcHRvcikgLT5cblxuXHRcdGlmIEAgaXNudCBCYXNlQ2xhc3MgYW5kIGRlc2NyaXB0b3IuZXhwb3J0YWJsZSA9PSB0cnVlXG5cdFx0XHQjIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IHRydWVcblx0XHRcdGRlc2NyaXB0b3IucHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lXG5cblx0XHRcdEBbRGVmaW5lZFByb3BlcnRpZXNLZXldID89IHt9XG5cdFx0XHRAW0RlZmluZWRQcm9wZXJ0aWVzS2V5XVtwcm9wZXJ0eU5hbWVdID0gZGVzY3JpcHRvclxuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5IEBwcm90b3R5cGUsIHByb3BlcnR5TmFtZSwgZGVzY3JpcHRvclxuXHRcdE9iamVjdC5fX1xuXG5cdEBzaW1wbGVQcm9wZXJ0eSA9IChuYW1lLCBmYWxsYmFjaywgZXhwb3J0YWJsZT10cnVlKSAtPlxuXHRcdGV4cG9ydGFibGU6IGV4cG9ydGFibGVcblx0XHRkZWZhdWx0OiBmYWxsYmFja1xuXHRcdGdldDogLT4gIEBfZ2V0UHJvcGVydHlWYWx1ZSBuYW1lXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBfc2V0UHJvcGVydHlWYWx1ZSBuYW1lLCB2YWx1ZVxuXG5cdF9zZXRQcm9wZXJ0eVZhbHVlOiAoaywgdikgPT5cblx0XHRAW0RlZmluZWRQcm9wZXJ0aWVzVmFsdWVzS2V5XVtrXSA9IHZcblxuXHRfZ2V0UHJvcGVydHlWYWx1ZTogKGspID0+XG5cdFx0VXRpbHMudmFsdWVPckRlZmF1bHQgQFtEZWZpbmVkUHJvcGVydGllc1ZhbHVlc0tleV1ba10sXG5cdFx0XHRAX2dldFByb3BlcnR5RGVmYXVsdFZhbHVlIGtcblxuXHRfZ2V0UHJvcGVydHlEZWZhdWx0VmFsdWU6IChrKSAtPlxuXHRcdEBjb25zdHJ1Y3RvcltEZWZpbmVkUHJvcGVydGllc0tleV1ba11bXCJkZWZhdWx0XCJdXG5cblx0X3Byb3BlcnR5TGlzdDogLT5cblx0XHRAY29uc3RydWN0b3JbRGVmaW5lZFByb3BlcnRpZXNLZXldXG5cblx0a2V5czogLT5cblx0XHRfLmtleXMgQHByb3BlcnRpZXNcblxuXHRAZGVmaW5lIFwicHJvcGVydGllc1wiLFxuXHRcdGdldDogLT5cblx0XHRcdHByb3BlcnRpZXMgPSB7fVxuXG5cdFx0XHRmb3IgaywgdiBvZiBAY29uc3RydWN0b3JbRGVmaW5lZFByb3BlcnRpZXNLZXldXG5cdFx0XHRcdGlmIHYuZXhwb3J0YWJsZSBpc250IGZhbHNlXG5cdFx0XHRcdFx0cHJvcGVydGllc1trXSA9IEBba11cblxuXHRcdFx0cHJvcGVydGllc1xuXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRmb3IgaywgdiBvZiB2YWx1ZVxuXHRcdFx0XHRpZiBAY29uc3RydWN0b3JbRGVmaW5lZFByb3BlcnRpZXNLZXldLmhhc093blByb3BlcnR5IGtcblx0XHRcdFx0XHRpZiBAY29uc3RydWN0b3JbRGVmaW5lZFByb3BlcnRpZXNLZXldLmV4cG9ydGFibGUgaXNudCBmYWxzZVxuXHRcdFx0XHRcdFx0QFtrXSA9IHZcblxuXHRAZGVmaW5lIFwiaWRcIixcblx0XHRnZXQ6IC0+IEBfaWRcblxuXHR0b1N0cmluZzogPT5cblx0XHRwcm9wZXJ0aWVzID0gXy5tYXAoQHByb3BlcnRpZXMsICgodiwgaykgLT4gXCIje2t9OiN7dn1cIiksIDQpXG5cdFx0XCJbI3tAY29uc3RydWN0b3IubmFtZX0gaWQ6I3tAaWR9ICN7cHJvcGVydGllcy5qb2luIFwiIFwifV1cIlxuXG5cblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0IyBCYXNlIGNvbnN0cnVjdG9yIG1ldGhvZFxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblxuXHRcdHN1cGVyXG5cblx0XHQjIENyZWF0ZSBhIGhvbGRlciBmb3IgdGhlIHByb3BlcnR5IHZhbHVlc1xuXHRcdEBbRGVmaW5lZFByb3BlcnRpZXNWYWx1ZXNLZXldID0ge31cblxuXHRcdCMgQ291bnQgdGhlIGNyZWF0aW9uIGZvciB0aGVzZSBvYmplY3RzIGFuZCBzZXQgdGhlIGlkXG5cdFx0QGNvbnN0cnVjdG9yW0NvdW50ZXJLZXldID89IDBcblx0XHRAY29uc3RydWN0b3JbQ291bnRlcktleV0gKz0gMVxuXG5cdFx0QF9pZCA9IEBjb25zdHJ1Y3RvcltDb3VudGVyS2V5XVxuXG5cdFx0IyBTZXQgdGhlIGRlZmF1bHQgdmFsdWVzIGZvciB0aGlzIG9iamVjdFxuXHRcdF8ubWFwIEBjb25zdHJ1Y3RvcltEZWZpbmVkUHJvcGVydGllc0tleV0sIChkZXNjcmlwdG9yLCBuYW1lKSA9PlxuXHRcdFx0QFtuYW1lXSA9IFV0aWxzLnZhbHVlT3JEZWZhdWx0IG9wdGlvbnNbbmFtZV0sIEBfZ2V0UHJvcGVydHlEZWZhdWx0VmFsdWUgbmFtZVxuXG4iLCJ7TGF5ZXJ9ID0gcmVxdWlyZSBcIi4vTGF5ZXJcIlxuXG5jb21wYXRXYXJuaW5nID0gKG1zZykgLT5cblx0Y29uc29sZS53YXJuIG1zZ1xuXG5jb21wYXRQcm9wZXJ0eSA9IChuYW1lLCBvcmlnaW5hbE5hbWUpIC0+XG5cdGV4cG9ydGFibGU6IGZhbHNlXG5cdGdldDogLT4gXG5cdFx0Y29tcGF0V2FybmluZyBcIiN7b3JpZ2luYWxOYW1lfSBpcyBhIGRlcHJlY2F0ZWQgcHJvcGVydHlcIlxuXHRcdEBbbmFtZV1cblx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdGNvbXBhdFdhcm5pbmcgXCIje29yaWdpbmFsTmFtZX0gaXMgYSBkZXByZWNhdGVkIHByb3BlcnR5XCJcblx0XHRAW25hbWVdID0gdmFsdWVcblxuY2xhc3MgQ29tcGF0TGF5ZXIgZXh0ZW5kcyBMYXllclxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblxuXHRcdGlmIG9wdGlvbnMuaGFzT3duUHJvcGVydHkgXCJzdXBlclZpZXdcIlxuXHRcdFx0b3B0aW9ucy5zdXBlckxheWVyID0gb3B0aW9ucy5zdXBlclZpZXdcblxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXHRAZGVmaW5lIFwic3VwZXJWaWV3XCIsIGNvbXBhdFByb3BlcnR5IFwic3VwZXJMYXllclwiLCBcInN1cGVyVmlld1wiXG5cdEBkZWZpbmUgXCJzdWJWaWV3c1wiLCBjb21wYXRQcm9wZXJ0eSBcInN1YkxheWVyc1wiLCBcInN1YlZpZXdzXCJcblx0QGRlZmluZSBcInNpYmxpbmdWaWV3c1wiLCBjb21wYXRQcm9wZXJ0eSBcInNpYmxpbmdMYXllcnNcIiwgXCJzaWJsaW5nVmlld3NcIlxuXG5cdGFkZFN1YlZpZXcgPSAobGF5ZXIpIC0+IEBhZGRTdWJMYXllciBsYXllclxuXHRyZW1vdmVTdWJWaWV3ID0gKGxheWVyKSAtPiBAcmVtb3ZlU3ViTGF5ZXIgbGF5ZXJcblxuY2xhc3MgQ29tcGF0VmlldyBleHRlbmRzIENvbXBhdExheWVyXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdGNvbXBhdFdhcm5pbmcgXCJWaWV3cyBhcmUgbm93IGNhbGxlZCBMYXllcnNcIlxuXHRcdHN1cGVyIG9wdGlvbnNcblxuY2xhc3MgQ29tcGF0SW1hZ2VWaWV3IGV4dGVuZHMgQ29tcGF0Vmlld1xuXG5jbGFzcyBDb21wYXRTY3JvbGxWaWV3IGV4dGVuZHMgQ29tcGF0Vmlld1xuXHRjb25zdHJ1Y3RvcjogLT5cblx0XHRzdXBlclxuXHRcdEBzY3JvbGwgPSB0cnVlXG5cbndpbmRvdy5MYXllciA9IENvbXBhdExheWVyXG53aW5kb3cuRnJhbWVyLkxheWVyID0gQ29tcGF0TGF5ZXJcblxud2luZG93LlZpZXcgPSBDb21wYXRWaWV3XG53aW5kb3cuSW1hZ2VWaWV3ID0gQ29tcGF0SW1hZ2VWaWV3XG53aW5kb3cuU2Nyb2xsVmlldyA9IENvbXBhdFNjcm9sbFZpZXdcblxuIyBVdGlscyB3ZXJlIHV0aWxzIGluIEZyYW1lciAyXG53aW5kb3cudXRpbHMgPSB3aW5kb3cuVXRpbHNcblxuXHRcblxuIiwiVXRpbHMgPSByZXF1aXJlIFwiLi9VdGlsc1wiXG5cbmV4cG9ydHMuQ29uZmlnID1cblx0XG5cdCMgQW5pbWF0aW9uXG5cdHRhcmdldEZQUzogNjBcblxuXHRyb290QmFzZUNTUzpcblx0XHRcIi13ZWJraXQtcGVyc3BlY3RpdmVcIjogMTAwMFxuXHRcdFxuXHRsYXllckJhc2VDU1M6XG5cdFx0XCJkaXNwbGF5XCI6IFwiYmxvY2tcIlxuXHRcdCNcInZpc2liaWxpdHlcIjogXCJ2aXNpYmxlXCJcblx0XHRcInBvc2l0aW9uXCI6IFwiYWJzb2x1dGVcIlxuXHRcdCMgXCJ0b3BcIjogXCJhdXRvXCJcblx0XHQjIFwicmlnaHRcIjogXCJhdXRvXCJcblx0XHQjIFwiYm90dG9tXCI6IFwiYXV0b1wiXG5cdFx0IyBcImxlZnRcIjogXCJhdXRvXCJcblx0XHQjIFwid2lkdGhcIjogXCJhdXRvXCJcblx0XHQjIFwiaGVpZ2h0XCI6IFwiYXV0b1wiXG5cdFx0I1wib3ZlcmZsb3dcIjogXCJ2aXNpYmxlXCJcblx0XHQjXCJ6LWluZGV4XCI6IDBcblx0XHRcIi13ZWJraXQtYm94LXNpemluZ1wiOiBcImJvcmRlci1ib3hcIlxuXHRcdCMgXCItd2Via2l0LXRyYW5zZm9ybS1zdHlsZVwiOiBcInByZXNlcnZlLTNkXCJcblx0XHQjIFwiLXdlYmtpdC1iYWNrZmFjZS12aXNpYmlsaXR5XCI6IFwidmlzaWJsZVwiXG5cdFx0I1wiLXdlYmtpdC1iYWNrZmFjZS12aXNpYmlsaXR5XCI6IFwiXCJcblx0XHQjXCItd2Via2l0LXBlcnNwZWN0aXZlXCI6IDUwMFxuXHRcdCMgXCJwb2ludGVyLWV2ZW50c1wiOiBcIm5vbmVcIlxuXHRcdFwiYmFja2dyb3VuZC1yZXBlYXRcIjogXCJuby1yZXBlYXRcIlxuXHRcdFwiYmFja2dyb3VuZC1zaXplXCI6IFwiY292ZXJcIlxuXHRcdFwiLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmdcIjogXCJ0b3VjaFwiIiwiVXRpbHMgPSByZXF1aXJlIFwiLi9VdGlsc1wiXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuIyBEZWJ1ZyBvdmVydmlld1xuXG5fZGVidWdMYXllcnMgPSBudWxsXG5cbmNyZWF0ZURlYnVnTGF5ZXIgPSAobGF5ZXIpIC0+XG5cblx0b3ZlckxheWVyID0gbmV3IExheWVyXG5cdFx0ZnJhbWU6IGxheWVyLnNjcmVlbkZyYW1lKClcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSg1MCwxNTAsMjAwLC4zNSlcIlxuXG5cdG92ZXJMYXllci5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiXG5cdFx0Y29sb3I6IFwid2hpdGVcIlxuXHRcdGZvbnQ6IFwiMTBweC8xZW0gTW9uYWNvXCJcblx0XHRsaW5lSGVpZ2h0OiBcIiN7b3ZlckxheWVyLmhlaWdodCArIDF9cHhcIlxuXHRcdGJveFNoYWRvdzogXCJpbnNldCAwIDAgMCAxcHggcmdiYSgyNTUsMjU1LDI1NSwuNSlcIlxuXG5cdG92ZXJMYXllci5odG1sID0gbGF5ZXIubmFtZSBvciBsYXllci5pZFxuXG5cdG92ZXJMYXllci5vbiBFdmVudHMuQ2xpY2ssIChldmVudCwgbGF5ZXIpIC0+XG5cdFx0bGF5ZXIuc2NhbGUgPSAwLjhcblx0XHRsYXllci5hbmltYXRlIFxuXHRcdFx0cHJvcGVydGllczoge3NjYWxlOjF9XG5cdFx0XHRjdXJ2ZTogXCJzcHJpbmcoMTAwMCwxMCwwKVwiXG5cblx0b3ZlckxheWVyXG5cbnNob3dEZWJ1ZyA9IC0+IF9kZWJ1Z0xheWVycyA9IExheWVyLkxheWVycygpLm1hcCBjcmVhdGVEZWJ1Z0xheWVyXG5oaWRlRGVidWcgPSAtPiBfZGVidWdMYXllcnMubWFwIChsYXllcikgLT4gbGF5ZXIuZGVzdHJveSgpXG5cbnRvZ2dsZURlYnVnID0gVXRpbHMudG9nZ2xlIHNob3dEZWJ1ZywgaGlkZURlYnVnXG5cbkV2ZW50S2V5cyA9XG5cdFNoaWZ0OiAxNlxuXHRFc2NhcGU6IDI3XG5cbndpbmRvdy5kb2N1bWVudC5vbmtleXVwID0gKGV2ZW50KSAtPlxuXHRpZiBldmVudC5rZXlDb2RlID09IEV2ZW50S2V5cy5Fc2NhcGVcblx0XHR0b2dnbGVEZWJ1ZygpKClcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jIEVycm9yIHdhcm5pbmdcblxuX2Vycm9yV2FybmluZ0xheWVyID0gbnVsbFxuXG5lcnJvcldhcm5pbmcgPSAtPlxuXG5cdHJldHVybiBpZiBfZXJyb3JXYXJuaW5nTGF5ZXJcblxuXHRsYXllciA9IG5ldyBMYXllciB7eDoyMCwgeTotNTAsIHdpZHRoOjMwMCwgaGVpZ2h0OjQwfVxuXG5cdGxheWVyLnN0YXRlcy5hZGRcblx0XHR2aXNpYmxlOiB7eDoyMCwgeToyMCwgd2lkdGg6MzAwLCBoZWlnaHQ6NDB9XG5cblx0bGF5ZXIuaHRtbCA9IFwiSmF2YXNjcmlwdCBFcnJvciwgc2VlIHRoZSBjb25zb2xlXCJcblx0bGF5ZXIuc3R5bGUgPVxuXHRcdGZvbnQ6IFwiMTJweC8xLjM1ZW0gTWVubG9cIlxuXHRcdGNvbG9yOiBcIndoaXRlXCJcblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCJcblx0XHRsaW5lSGVpZ2h0OiBcIiN7bGF5ZXIuaGVpZ2h0fXB4XCJcblx0XHRib3JkZXJSYWRpdXM6IFwiNXB4XCJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgyNTUsMCwwLC44KVwiXG5cblx0bGF5ZXIuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdGN1cnZlOiBcInNwcmluZ1wiXG5cdFx0Y3VydmVPcHRpb25zOlxuXHRcdFx0dGVuc2lvbjogMTAwMFxuXHRcdFx0ZnJpY3Rpb246IDMwXG5cblx0bGF5ZXIuc3RhdGVzLnN3aXRjaCBcInZpc2libGVcIlxuXG5cdGxheWVyLm9uIEV2ZW50cy5DbGljaywgLT5cblx0XHRAc3RhdGVzLnN3aXRjaCBcImRlZmF1bHRcIlxuXG5cdF9lcnJvcldhcm5pbmdMYXllciA9IGxheWVyXG5cbndpbmRvdy5vbmVycm9yID0gZXJyb3JXYXJuaW5nXG4iLCJ7X30gPSByZXF1aXJlIFwiLi9VbmRlcnNjb3JlXCJcblxuVXRpbHMgPSByZXF1aXJlIFwiLi9VdGlsc1wiXG5cbk9yaWdpbmFscyA9IFxuXHRMYXllcjpcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgwLDEyNCwyNTUsLjUpXCJcblx0XHR3aWR0aDogMTAwXG5cdFx0aGVpZ2h0OiAxMDBcblx0QW5pbWF0aW9uOlxuXHRcdGN1cnZlOiBcImxpbmVhclwiXG5cdFx0dGltZTogMVxuXG5leHBvcnRzLkRlZmF1bHRzID1cblxuXHRnZXREZWZhdWx0czogKGNsYXNzTmFtZSwgb3B0aW9ucykgLT5cblxuXHRcdCMgQWx3YXlzIHN0YXJ0IHdpdGggdGhlIG9yaWdpbmFsc1xuXHRcdGRlZmF1bHRzID0gXy5jbG9uZSBPcmlnaW5hbHNbY2xhc3NOYW1lXVxuXG5cdFx0IyBDb3B5IG92ZXIgdGhlIHVzZXIgZGVmaW5lZCBvcHRpb25zXG5cdFx0Zm9yIGssIHYgb2YgRnJhbWVyLkRlZmF1bHRzW2NsYXNzTmFtZV1cblx0XHRcdGRlZmF1bHRzW2tdID0gaWYgXy5pc0Z1bmN0aW9uKHYpIHRoZW4gdigpIGVsc2UgdlxuXG5cdFx0IyBUaGVuIGNvcHkgb3ZlciB0aGUgZGVmYXVsdCBrZXlzIHRvIHRoZSBvcHRpb25zXG5cdFx0Zm9yIGssIHYgb2YgZGVmYXVsdHNcblx0XHRcdGlmIG5vdCBvcHRpb25zLmhhc093blByb3BlcnR5IGtcblx0XHRcdFx0b3B0aW9uc1trXSA9IHZcblxuXHRcdCMgSW5jbHVkZSBhIHNlY3JldCBwcm9wZXJ0eSB3aXRoIHRoZSBkZWZhdWx0IGtleXNcblx0XHQjIG9wdGlvbnMuX2RlZmF1bHRWYWx1ZXMgPSBkZWZhdWx0c1xuXHRcdFxuXHRcdG9wdGlvbnNcblxuXHRyZXNldDogLT5cblx0XHR3aW5kb3cuRnJhbWVyLkRlZmF1bHRzID0gXy5jbG9uZSBPcmlnaW5hbHMiLCJ7X30gPSByZXF1aXJlIFwiLi9VbmRlcnNjb3JlXCJcblxuRXZlbnRFbWl0dGVyRXZlbnRzS2V5ID0gXCJfZXZlbnRzXCJcblxuY2xhc3MgZXhwb3J0cy5FdmVudEVtaXR0ZXJcblx0XG5cdGNvbnN0cnVjdG9yOiAtPlxuXHRcdEBbRXZlbnRFbWl0dGVyRXZlbnRzS2V5XSA9IHt9XG5cblx0X2V2ZW50Q2hlY2s6IChldmVudCwgbWV0aG9kKSAtPlxuXHRcdGlmIG5vdCBldmVudFxuXHRcdFx0Y29uc29sZS53YXJuIFwiI3tAY29uc3RydWN0b3IubmFtZX0uI3ttZXRob2R9IG1pc3NpbmcgZXZlbnQgKGxpa2UgJ2NsaWNrJylcIlxuXG5cdGVtaXQ6IChldmVudCwgYXJncy4uLikgLT5cblx0XHRcblx0XHQjIFdlIHNraXAgaXQgaGVyZSBiZWNhdXNlIHdlIG5lZWQgYWxsIHRoZSBwZXJmIHdlIGNhbiBnZXRcblx0XHQjIEBfZXZlbnRDaGVjayBldmVudCwgXCJlbWl0XCJcblxuXHRcdGlmIG5vdCBAW0V2ZW50RW1pdHRlckV2ZW50c0tleV0/W2V2ZW50XVxuXHRcdFx0cmV0dXJuXG5cdFx0XG5cdFx0Zm9yIGxpc3RlbmVyIGluIEBbRXZlbnRFbWl0dGVyRXZlbnRzS2V5XVtldmVudF1cblx0XHRcdGxpc3RlbmVyIGFyZ3MuLi5cblx0XHRcblx0XHRyZXR1cm5cblxuXHRhZGRMaXN0ZW5lcjogKGV2ZW50LCBsaXN0ZW5lcikgLT5cblx0XHRcblx0XHRAX2V2ZW50Q2hlY2sgZXZlbnQsIFwiYWRkTGlzdGVuZXJcIlxuXHRcdFxuXHRcdEBbRXZlbnRFbWl0dGVyRXZlbnRzS2V5XSA/PSB7fVxuXHRcdEBbRXZlbnRFbWl0dGVyRXZlbnRzS2V5XVtldmVudF0gPz0gW11cblx0XHRAW0V2ZW50RW1pdHRlckV2ZW50c0tleV1bZXZlbnRdLnB1c2ggbGlzdGVuZXJcblxuXHRyZW1vdmVMaXN0ZW5lcjogKGV2ZW50LCBsaXN0ZW5lcikgLT5cblx0XHRcblx0XHRAX2V2ZW50Q2hlY2sgZXZlbnQsIFwicmVtb3ZlTGlzdGVuZXJcIlxuXHRcdFxuXHRcdHJldHVybiB1bmxlc3MgQFtFdmVudEVtaXR0ZXJFdmVudHNLZXldXG5cdFx0cmV0dXJuIHVubGVzcyBAW0V2ZW50RW1pdHRlckV2ZW50c0tleV1bZXZlbnRdXG5cdFx0XG5cdFx0QFtFdmVudEVtaXR0ZXJFdmVudHNLZXldW2V2ZW50XSA9IF8ud2l0aG91dCBAW0V2ZW50RW1pdHRlckV2ZW50c0tleV1bZXZlbnRdLCBsaXN0ZW5lclxuXG5cdFx0cmV0dXJuXG5cblx0b25jZTogKGV2ZW50LCBsaXN0ZW5lcikgLT5cblxuXHRcdGZuID0gPT5cblx0XHRcdEByZW1vdmVMaXN0ZW5lciBldmVudCwgZm5cblx0XHRcdGxpc3RlbmVyIGFyZ3VtZW50cy4uLlxuXG5cdFx0QG9uIGV2ZW50LCBmblxuXG5cdHJlbW92ZUFsbExpc3RlbmVyczogKGV2ZW50KSAtPlxuXHRcdFxuXHRcdHJldHVybiB1bmxlc3MgQFtFdmVudEVtaXR0ZXJFdmVudHNLZXldXG5cdFx0cmV0dXJuIHVubGVzcyBAW0V2ZW50RW1pdHRlckV2ZW50c0tleV1bZXZlbnRdXG5cdFx0XG5cdFx0Zm9yIGxpc3RlbmVyIGluIEBbRXZlbnRFbWl0dGVyRXZlbnRzS2V5XVtldmVudF1cblx0XHRcdEByZW1vdmVMaXN0ZW5lciBldmVudCwgbGlzdGVuZXJcblxuXHRcdHJldHVyblxuXHRcblx0b246IEA6OmFkZExpc3RlbmVyXG5cdG9mZjogQDo6cmVtb3ZlTGlzdGVuZXIiLCJ7X30gPSByZXF1aXJlIFwiLi9VbmRlcnNjb3JlXCJcblxuVXRpbHMgPSByZXF1aXJlIFwiLi9VdGlsc1wiXG5cbkV2ZW50cyA9IHt9XG5cbmlmIFV0aWxzLmlzVG91Y2goKVxuXHRFdmVudHMuVG91Y2hTdGFydCA9IFwidG91Y2hzdGFydFwiXG5cdEV2ZW50cy5Ub3VjaEVuZCA9IFwidG91Y2hlbmRcIlxuXHRFdmVudHMuVG91Y2hNb3ZlID0gXCJ0b3VjaG1vdmVcIlxuZWxzZVxuXHRFdmVudHMuVG91Y2hTdGFydCA9IFwibW91c2Vkb3duXCJcblx0RXZlbnRzLlRvdWNoRW5kID0gXCJtb3VzZXVwXCJcblx0RXZlbnRzLlRvdWNoTW92ZSA9IFwibW91c2Vtb3ZlXCJcblxuRXZlbnRzLkNsaWNrID0gRXZlbnRzLlRvdWNoRW5kXG5cbiMgU3RhbmRhcmQgZG9tIGV2ZW50c1xuRXZlbnRzLk1vdXNlT3ZlciA9IFwibW91c2VvdmVyXCJcbkV2ZW50cy5Nb3VzZU91dCA9IFwibW91c2VvdXRcIlxuXG4jIEFuaW1hdGlvbiBldmVudHNcbkV2ZW50cy5BbmltYXRpb25TdGFydCA9IFwic3RhcnRcIlxuRXZlbnRzLkFuaW1hdGlvblN0b3AgPSBcInN0b3BcIlxuRXZlbnRzLkFuaW1hdGlvbkVuZCA9IFwiZW5kXCJcblxuIyBTY3JvbGwgZXZlbnRzXG5FdmVudHMuU2Nyb2xsID0gXCJzY3JvbGxcIlxuXG4jIEV4dHJhY3QgdG91Y2ggZXZlbnRzIGZvciBhbnkgZXZlbnRcbkV2ZW50cy50b3VjaEV2ZW50ID0gKGV2ZW50KSAtPlxuXHR0b3VjaEV2ZW50ID0gZXZlbnQudG91Y2hlcz9bMF1cblx0dG91Y2hFdmVudCA/PSBldmVudC5jaGFuZ2VkVG91Y2hlcz9bMF1cblx0dG91Y2hFdmVudCA/PSBldmVudFxuXHR0b3VjaEV2ZW50XG5cdFxuZXhwb3J0cy5FdmVudHMgPSBFdmVudHMiLCJ7QmFzZUNsYXNzfSA9IHJlcXVpcmUgXCIuL0Jhc2VDbGFzc1wiXG5cbmNsYXNzIGV4cG9ydHMuRnJhbWUgZXh0ZW5kcyBCYXNlQ2xhc3NcblxuXHRAZGVmaW5lIFwieFwiLCBAc2ltcGxlUHJvcGVydHkgXCJ4XCIsIDBcblx0QGRlZmluZSBcInlcIiwgQHNpbXBsZVByb3BlcnR5IFwieVwiLCAwXG5cdEBkZWZpbmUgXCJ3aWR0aFwiLCBAc2ltcGxlUHJvcGVydHkgXCJ3aWR0aFwiLCAwXG5cdEBkZWZpbmUgXCJoZWlnaHRcIiwgQHNpbXBsZVByb3BlcnR5IFwiaGVpZ2h0XCIsIDBcblxuXHRAZGVmaW5lIFwibWluWFwiLCBAc2ltcGxlUHJvcGVydHkgXCJ4XCIsIDAsIGZhbHNlXG5cdEBkZWZpbmUgXCJtaW5ZXCIsIEBzaW1wbGVQcm9wZXJ0eSBcInlcIiwgMCwgZmFsc2VcblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cblx0XHRzdXBlciBvcHRpb25zXG5cblx0XHRmb3IgayBpbiBbXCJtaW5YXCIsIFwibWlkWFwiLCBcIm1heFhcIiwgXCJtaW5ZXCIsIFwibWlkWVwiLCBcIm1heFlcIl1cblx0XHRcdGlmIG9wdGlvbnMuaGFzT3duUHJvcGVydHkga1xuXHRcdFx0XHRAW2tdID0gb3B0aW9uc1trXVxuXG5cdEBkZWZpbmUgXCJtaWRYXCIsXG5cdFx0Z2V0OiAtPiBVdGlscy5mcmFtZUdldE1pZFggQFxuXHRcdHNldDogKHZhbHVlKSAtPiBVdGlscy5mcmFtZVNldE1pZFggQCwgdmFsdWVcblxuXHRAZGVmaW5lIFwibWF4WFwiLFxuXHRcdGdldDogLT4gVXRpbHMuZnJhbWVHZXRNYXhYIEBcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gVXRpbHMuZnJhbWVTZXRNYXhYIEAsIHZhbHVlXG5cblx0QGRlZmluZSBcIm1pZFlcIixcblx0XHRnZXQ6IC0+IFV0aWxzLmZyYW1lR2V0TWlkWSBAXG5cdFx0c2V0OiAodmFsdWUpIC0+IFV0aWxzLmZyYW1lU2V0TWlkWSBALCB2YWx1ZVxuXG5cdEBkZWZpbmUgXCJtYXhZXCIsXG5cdFx0Z2V0OiAtPiBVdGlscy5mcmFtZUdldE1heFkgQFxuXHRcdHNldDogKHZhbHVlKSAtPiBVdGlscy5mcmFtZVNldE1heFkgQCwgdmFsdWUiLCJ7X30gPSByZXF1aXJlIFwiLi9VbmRlcnNjb3JlXCJcblxuRnJhbWVyID0ge31cblxuIyBSb290IGxldmVsIG1vZHVsZXNcbkZyYW1lci5fID0gX1xuRnJhbWVyLlV0aWxzID0gKHJlcXVpcmUgXCIuL1V0aWxzXCIpXG5GcmFtZXIuRnJhbWUgPSAocmVxdWlyZSBcIi4vRnJhbWVcIikuRnJhbWVcbkZyYW1lci5MYXllciA9IChyZXF1aXJlIFwiLi9MYXllclwiKS5MYXllclxuRnJhbWVyLkV2ZW50cyA9IChyZXF1aXJlIFwiLi9FdmVudHNcIikuRXZlbnRzXG5GcmFtZXIuQW5pbWF0aW9uID0gKHJlcXVpcmUgXCIuL0FuaW1hdGlvblwiKS5BbmltYXRpb25cblxuXy5leHRlbmQgd2luZG93LCBGcmFtZXIgaWYgd2luZG93XG5cbiMgRnJhbWVyIGxldmVsIG1vZHVsZXNcblxuRnJhbWVyLkNvbmZpZyA9IChyZXF1aXJlIFwiLi9Db25maWdcIikuQ29uZmlnXG5GcmFtZXIuRXZlbnRFbWl0dGVyID0gKHJlcXVpcmUgXCIuL0V2ZW50RW1pdHRlclwiKS5FdmVudEVtaXR0ZXJcbkZyYW1lci5CYXNlQ2xhc3MgPSAocmVxdWlyZSBcIi4vQmFzZUNsYXNzXCIpLkJhc2VDbGFzc1xuRnJhbWVyLkxheWVyU3R5bGUgPSAocmVxdWlyZSBcIi4vTGF5ZXJTdHlsZVwiKS5MYXllclN0eWxlXG5GcmFtZXIuQW5pbWF0aW9uTG9vcCA9IChyZXF1aXJlIFwiLi9BbmltYXRpb25Mb29wXCIpLkFuaW1hdGlvbkxvb3BcbkZyYW1lci5MaW5lYXJBbmltYXRvciA9IChyZXF1aXJlIFwiLi9BbmltYXRvcnMvTGluZWFyQW5pbWF0b3JcIikuTGluZWFyQW5pbWF0b3JcbkZyYW1lci5CZXppZXJDdXJ2ZUFuaW1hdG9yID0gKHJlcXVpcmUgXCIuL0FuaW1hdG9ycy9CZXppZXJDdXJ2ZUFuaW1hdG9yXCIpLkJlemllckN1cnZlQW5pbWF0b3JcbkZyYW1lci5TcHJpbmdESE9BbmltYXRvciA9IChyZXF1aXJlIFwiLi9BbmltYXRvcnMvU3ByaW5nREhPQW5pbWF0b3JcIikuU3ByaW5nREhPQW5pbWF0b3JcbkZyYW1lci5TcHJpbmdSSzRBbmltYXRvciA9IChyZXF1aXJlIFwiLi9BbmltYXRvcnMvU3ByaW5nUks0QW5pbWF0b3JcIikuU3ByaW5nUks0QW5pbWF0b3JcbkZyYW1lci5JbXBvcnRlciA9IChyZXF1aXJlIFwiLi9JbXBvcnRlclwiKS5JbXBvcnRlclxuRnJhbWVyLkRlYnVnID0gKHJlcXVpcmUgXCIuL0RlYnVnXCIpLkRlYnVnXG5cbndpbmRvdy5GcmFtZXIgPSBGcmFtZXIgaWYgd2luZG93XG5cbiMgQ29tcGF0aWJpbGl0eSBmb3IgRnJhbWVyIDJcbnJlcXVpcmUgXCIuL0NvbXBhdFwiXG5cbiMgU2V0IHRoZSBkZWZhdWx0c1xuRGVmYXVsdHMgPSAocmVxdWlyZSBcIi4vRGVmYXVsdHNcIikuRGVmYXVsdHNcbkZyYW1lci5yZXNldERlZmF1bHRzID0gRGVmYXVsdHMucmVzZXRcbkZyYW1lci5yZXNldERlZmF1bHRzKCkiLCJ7X30gPSByZXF1aXJlIFwiLi9VbmRlcnNjb3JlXCJcblV0aWxzID0gcmVxdWlyZSBcIi4vVXRpbHNcIlxuXG5DaHJvbWVBbGVydCA9IFwiXCJcIlxuSW1wb3J0aW5nIGxheWVycyBpcyBjdXJyZW50bHkgb25seSBzdXBwb3J0ZWQgb24gU2FmYXJpLiBJZiB5b3UgcmVhbGx5IHdhbnQgaXQgdG8gd29yayB3aXRoIENocm9tZSBxdWl0IGl0LCBvcGVuIGEgdGVybWluYWwgYW5kIHJ1bjpcbm9wZW4gLWEgR29vZ2xlXFwgQ2hyb21lIC3igJNhbGxvdy1maWxlLWFjY2Vzcy1mcm9tLWZpbGVzXG5cIlwiXCJcblxuY2xhc3MgZXhwb3J0cy5JbXBvcnRlclxuXG5cdGNvbnN0cnVjdG9yOiAoQHBhdGgsIEBleHRyYUxheWVyUHJvcGVydGllcz17fSkgLT5cblxuXHRcdEBwYXRocyA9XG5cdFx0XHRsYXllckluZm86IFV0aWxzLnBhdGhKb2luIEBwYXRoLCBcImxheWVycy5qc29uXCJcblx0XHRcdGltYWdlczogVXRpbHMucGF0aEpvaW4gQHBhdGgsIFwiaW1hZ2VzXCJcblx0XHRcdGRvY3VtZW50TmFtZTogQHBhdGguc3BsaXQoXCIvXCIpLnBvcCgpXG5cblx0XHRAX2NyZWF0ZWRMYXllcnMgPSBbXVxuXHRcdEBfY3JlYXRlZExheWVyc0J5TmFtZSA9IHt9XG5cblx0bG9hZDogLT5cblxuXHRcdGxheWVyc0J5TmFtZSA9IHt9XG5cdFx0bGF5ZXJJbmZvID0gQF9sb2FkbGF5ZXJJbmZvKClcblx0XHRcblx0XHQjIFBhc3Mgb25lLiBDcmVhdGUgYWxsIGxheWVycyBidWlsZCB0aGUgaGllcmFyY2h5XG5cdFx0bGF5ZXJJbmZvLm1hcCAobGF5ZXJJdGVtSW5mbykgPT5cblx0XHRcdEBfY3JlYXRlTGF5ZXIgbGF5ZXJJdGVtSW5mb1xuXG5cdFx0IyBQYXNzIHR3by4gQWRqdXN0IHBvc2l0aW9uIG9uIHNjcmVlbiBmb3IgYWxsIGxheWVyc1xuXHRcdCMgYmFzZWQgb24gdGhlIGhpZXJhcmNoeS5cblx0XHRmb3IgbGF5ZXIgaW4gQF9jcmVhdGVkTGF5ZXJzXG5cdFx0XHRAX2NvcnJlY3RMYXllciBsYXllclxuXG5cdFx0IyBQYXNzIHRocmVlLCBpbnNlcnQgdGhlIGxheWVycyBpbnRvIHRoZSBkb21cblx0XHQjICh0aGV5IHdlcmUgbm90IGluc2VydGVkIHlldCBiZWNhdXNlIG9mIHRoZSBzaGFkb3cga2V5d29yZClcblx0XHRmb3IgbGF5ZXIgaW4gQF9jcmVhdGVkTGF5ZXJzXG5cdFx0XHRpZiBub3QgbGF5ZXIuc3VwZXJMYXllclxuXHRcdFx0XHRsYXllci5zdXBlckxheWVyID0gbnVsbFxuXG5cdFx0QF9jcmVhdGVkTGF5ZXJzQnlOYW1lXG5cblx0X2xvYWRsYXllckluZm86IC0+XG5cblx0XHQjIENocm9tZSBpcyBhIHBhaW4gaW4gdGhlIGFzcyBhbmQgd29uJ3QgYWxsb3cgbG9jYWwgZmlsZSBhY2Nlc3Ncblx0XHQjIHRoZXJlZm9yZSBJIGFkZCBhIC5qcyBmaWxlIHdoaWNoIGFkZHMgdGhlIGRhdGEgdG8gXG5cdFx0IyB3aW5kb3cuX19pbXBvcnRlZF9fW1wiPHBhdGg+XCJdXG5cblx0XHRpbXBvcnRlZEtleSA9IFwiI3tAcGF0aHMuZG9jdW1lbnROYW1lfS9sYXllcnMuanNvbi5qc1wiXG5cblx0XHRpZiB3aW5kb3cuX19pbXBvcnRlZF9fPy5oYXNPd25Qcm9wZXJ0eSBpbXBvcnRlZEtleVxuXHRcdFx0cmV0dXJuIHdpbmRvdy5fX2ltcG9ydGVkX19baW1wb3J0ZWRLZXldXG5cblx0XHQjICMgRm9yIG5vdyB0aGlzIGRvZXMgbm90IHdvcmsgaW4gQ2hyb21lIGFuZCB3ZSB0aHJvdyBhbiBlcnJvclxuXHRcdCMgdHJ5XG5cdFx0IyBcdHJldHVybiBGcmFtZXIuVXRpbHMuZG9tTG9hZEpTT05TeW5jIEBwYXRocy5sYXllckluZm9cblx0XHQjIGNhdGNoIGVcblx0XHQjIFx0aWYgVXRpbHMuaXNDaHJvbWVcblx0XHQjIFx0XHRhbGVydCBDaHJvbWVBbGVydFxuXHRcdCMgXHRlbHNlXG5cdFx0IyBcdFx0dGhyb3cgZVxuXG5cdFx0cmV0dXJuIEZyYW1lci5VdGlscy5kb21Mb2FkSlNPTlN5bmMgQHBhdGhzLmxheWVySW5mb1xuXG5cdF9jcmVhdGVMYXllcjogKGluZm8sIHN1cGVyTGF5ZXIpIC0+XG5cdFx0XG5cdFx0TGF5ZXJDbGFzcyA9IExheWVyXG5cblx0XHRsYXllckluZm8gPVxuXHRcdFx0c2hhZG93OiB0cnVlXG5cdFx0XHRuYW1lOiBpbmZvLm5hbWVcblx0XHRcdGZyYW1lOiBpbmZvLmxheWVyRnJhbWVcblx0XHRcdGNsaXA6IGZhbHNlXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblx0XHRcdHZpc2libGU6IGluZm8udmlzaWJsZSA/IHRydWVcblxuXHRcdF8uZXh0ZW5kIGxheWVySW5mbywgQGV4dHJhTGF5ZXJQcm9wZXJ0aWVzXG5cblx0XHQjIE1vc3QgbGF5ZXJzIHdpbGwgaGF2ZSBhbiBpbWFnZSwgYWRkIHRoYXQgaGVyZVxuXHRcdGlmIGluZm8uaW1hZ2Vcblx0XHRcdGxheWVySW5mby5mcmFtZSA9IGluZm8uaW1hZ2UuZnJhbWVcblx0XHRcdGxheWVySW5mby5pbWFnZSA9IFV0aWxzLnBhdGhKb2luIEBwYXRoLCBpbmZvLmltYWdlLnBhdGhcblx0XHRcdFxuXHRcdCMgSWYgdGhlcmUgaXMgYSBtYXNrIG9uIHRoaXMgbGF5ZXIgZ3JvdXAsIHRha2UgaXQncyBmcmFtZVxuXHRcdGlmIGluZm8ubWFza0ZyYW1lXG5cdFx0XHRsYXllckluZm8uZnJhbWUgPSBpbmZvLm1hc2tGcmFtZVxuXHRcdFx0bGF5ZXJJbmZvLmNsaXAgPSB0cnVlXG5cblx0XHQjIFRvZG86IHNtYXJ0IHN0dWZmIGZvciBwYWdpbmcgYW5kIHNjcm9sbCB2aWV3c1xuXG5cdFx0IyBGaWd1cmUgb3V0IHdoYXQgdGhlIHN1cGVyIGxheWVyIHNob3VsZCBiZS4gSWYgdGhpcyBsYXllciBoYXMgYSBjb250ZW50TGF5ZXJcblx0XHQjIChsaWtlIGEgc2Nyb2xsIHZpZXcpIHdlIGF0dGFjaCBpdCB0byB0aGF0IGluc3RlYWQuXG5cdFx0aWYgc3VwZXJMYXllcj8uY29udGVudExheWVyXG5cdFx0XHRsYXllckluZm8uc3VwZXJMYXllciA9IHN1cGVyTGF5ZXIuY29udGVudExheWVyXG5cdFx0ZWxzZSBpZiBzdXBlckxheWVyXG5cdFx0XHRsYXllckluZm8uc3VwZXJMYXllciA9IHN1cGVyTGF5ZXJcblxuXHRcdCMgV2UgY2FuIGNyZWF0ZSB0aGUgbGF5ZXIgaGVyZVxuXHRcdGxheWVyID0gbmV3IExheWVyQ2xhc3MgbGF5ZXJJbmZvXG5cdFx0bGF5ZXIubmFtZSA9IGxheWVySW5mby5uYW1lXG5cblx0XHQjIEEgbGF5ZXIgd2l0aG91dCBhbiBpbWFnZSwgbWFzayBvciBzdWJsYXllcnMgc2hvdWxkIGJlIHplcm9cblx0XHRpZiBub3QgbGF5ZXIuaW1hZ2UgYW5kIG5vdCBpbmZvLmNoaWxkcmVuLmxlbmd0aCBhbmQgbm90IGluZm8ubWFza0ZyYW1lXG5cdFx0XHRsYXllci5mcmFtZSA9IG5ldyBGcmFtZVxuXG5cdFx0aW5mby5jaGlsZHJlbi5yZXZlcnNlKCkubWFwIChpbmZvKSA9PiBAX2NyZWF0ZUxheWVyIGluZm8sIGxheWVyXG5cblx0XHQjIFRPRE9ET0RPRE9EXG5cdFx0aWYgbm90IGxheWVyLmltYWdlIGFuZCBub3QgaW5mby5tYXNrRnJhbWVcblx0XHRcdGxheWVyLmZyYW1lID0gbGF5ZXIuY29udGVudEZyYW1lKClcblxuXHRcdGxheWVyLl9pbmZvID0gaW5mb1xuXG5cdFx0QF9jcmVhdGVkTGF5ZXJzLnB1c2ggbGF5ZXJcblx0XHRAX2NyZWF0ZWRMYXllcnNCeU5hbWVbbGF5ZXIubmFtZV0gPSBsYXllclxuXG5cdF9jb3JyZWN0TGF5ZXI6IChsYXllcikgLT5cblxuXHRcdHRyYXZlcnNlID0gKGxheWVyKSAtPlxuXG5cdFx0XHRpZiBsYXllci5zdXBlckxheWVyXG5cdFx0XHRcdGxheWVyLmZyYW1lID0gVXRpbHMuY29udmVydFBvaW50IGxheWVyLmZyYW1lLCBudWxsLCBsYXllci5zdXBlckxheWVyXG5cblx0XHRcdGZvciBzdWJMYXllciBpbiBsYXllci5zdWJMYXllcnNcblx0XHRcdFx0dHJhdmVyc2Ugc3ViTGF5ZXJcblxuXHRcdGlmIG5vdCBsYXllci5zdXBlckxheWVyXG5cdFx0XHR0cmF2ZXJzZSBsYXllclxuXG5leHBvcnRzLkltcG9ydGVyLmxvYWQgPSAocGF0aCkgLT5cblx0aW1wb3J0ZXIgPSBuZXcgZXhwb3J0cy5JbXBvcnRlciBwYXRoXG5cdGltcG9ydGVyLmxvYWQoKSIsIntffSA9IHJlcXVpcmUgXCIuL1VuZGVyc2NvcmVcIlxuXG5VdGlscyA9IHJlcXVpcmUgXCIuL1V0aWxzXCJcblxue0NvbmZpZ30gPSByZXF1aXJlIFwiLi9Db25maWdcIlxue0RlZmF1bHRzfSA9IHJlcXVpcmUgXCIuL0RlZmF1bHRzXCJcbntCYXNlQ2xhc3N9ID0gcmVxdWlyZSBcIi4vQmFzZUNsYXNzXCJcbntFdmVudEVtaXR0ZXJ9ID0gcmVxdWlyZSBcIi4vRXZlbnRFbWl0dGVyXCJcbntBbmltYXRpb259ID0gcmVxdWlyZSBcIi4vQW5pbWF0aW9uXCJcbntGcmFtZX0gPSByZXF1aXJlIFwiLi9GcmFtZVwiXG57TGF5ZXJTdHlsZX0gPSByZXF1aXJlIFwiLi9MYXllclN0eWxlXCJcbntMYXllclN0YXRlc30gPSByZXF1aXJlIFwiLi9MYXllclN0YXRlc1wiXG57TGF5ZXJEcmFnZ2FibGV9ID0gcmVxdWlyZSBcIi4vTGF5ZXJEcmFnZ2FibGVcIlxuXG5fUm9vdEVsZW1lbnQgPSBudWxsXG5fTGF5ZXJMaXN0ID0gW11cblxubGF5ZXJQcm9wZXJ0eSA9IChuYW1lLCBjc3NQcm9wZXJ0eSwgZmFsbGJhY2ssIHZhbGlkYXRvciwgc2V0KSAtPlxuXHRleHBvcnRhYmxlOiB0cnVlXG5cdGRlZmF1bHQ6IGZhbGxiYWNrXG5cdGdldDogLT5cblx0XHRAX2dldFByb3BlcnR5VmFsdWUgbmFtZVxuXHRzZXQ6ICh2YWx1ZSkgLT5cblxuXHRcdCMgaWYgbm90IHZhbGlkYXRvclxuXHRcdCMgXHRjb25zb2xlLmxvZyBcIk1pc3NpbmcgdmFsaWRhdG9yIGZvciBMYXllci4je25hbWV9XCIsIHZhbGlkYXRvclxuXG5cdFx0aWYgdmFsaWRhdG9yKHZhbHVlKSBpcyBmYWxzZVxuXHRcdFx0dGhyb3cgRXJyb3IgXCJ2YWx1ZSAnI3t2YWx1ZX0nIG9mIHR5cGUgI3t0eXBlb2YgdmFsdWV9IGlzIG5vdCB2YWxpZCBmb3IgYSBMYXllci4je25hbWV9IHByb3BlcnR5XCJcblxuXHRcdEBfc2V0UHJvcGVydHlWYWx1ZSBuYW1lLCB2YWx1ZVxuXHRcdEBzdHlsZVtjc3NQcm9wZXJ0eV0gPSBMYXllclN0eWxlW2Nzc1Byb3BlcnR5XShAKVxuXHRcdEBlbWl0IFwiY2hhbmdlOiN7bmFtZX1cIiwgdmFsdWVcblx0XHRzZXQgQCwgdmFsdWUgaWYgc2V0XG5cbmxheWVyU3R5bGVQcm9wZXJ0eSA9IChjc3NQcm9wZXJ0eSkgLT5cblx0ZXhwb3J0YWJsZTogdHJ1ZVxuXHQjIGRlZmF1bHQ6IGZhbGxiYWNrXG5cdGdldDogLT4gQHN0eWxlW2Nzc1Byb3BlcnR5XVxuXHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRAc3R5bGVbY3NzUHJvcGVydHldID0gdmFsdWVcblx0XHRAZW1pdCBcImNoYW5nZToje2Nzc1Byb3BlcnR5fVwiLCB2YWx1ZVxuXG5mcmFtZVByb3BlcnR5ID0gKG5hbWUpIC0+XG5cdGV4cG9ydGFibGU6IGZhbHNlXG5cdGdldDogLT4gQGZyYW1lW25hbWVdXG5cdHNldDogKHZhbHVlKSAtPlxuXHRcdGZyYW1lID0gQGZyYW1lXG5cdFx0ZnJhbWVbbmFtZV0gPSB2YWx1ZVxuXHRcdEBmcmFtZSA9IGZyYW1lXG5cbmNsYXNzIGV4cG9ydHMuTGF5ZXIgZXh0ZW5kcyBCYXNlQ2xhc3NcblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cblx0XHRfTGF5ZXJMaXN0LnB1c2ggQFxuXG5cdFx0IyBXZSBoYXZlIHRvIGNyZWF0ZSB0aGUgZWxlbWVudCBiZWZvcmUgd2Ugc2V0IHRoZSBkZWZhdWx0c1xuXHRcdEBfY3JlYXRlRWxlbWVudCgpXG5cdFx0QF9zZXREZWZhdWx0Q1NTKClcblxuXHRcdG9wdGlvbnMgPSBEZWZhdWx0cy5nZXREZWZhdWx0cyBcIkxheWVyXCIsIG9wdGlvbnNcblxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXHRcdCMgS2VlcCB0cmFjayBvZiB0aGUgZGVmYXVsdCB2YWx1ZXNcblx0XHQjIEBfZGVmYXVsdFZhbHVlcyA9IG9wdGlvbnMuX2RlZmF1bHRWYWx1ZXNcblxuXHRcdCMgV2UgbmVlZCB0byBleHBsaWNpdGx5IHNldCB0aGUgZWxlbWVudCBpZCBhZ2FpbiwgYmVjdWFzZSBpdCB3YXMgbWFkZSBieSB0aGUgc3VwZXJcblx0XHRAX2VsZW1lbnQuaWQgPSBcIkZyYW1lckxheWVyLSN7QGlkfVwiXG5cblx0XHQjIEV4dHJhY3QgdGhlIGZyYW1lIGZyb20gdGhlIG9wdGlvbnMsIHNvIHdlIHN1cHBvcnQgbWluWCwgbWF4WCBldGMuXG5cdFx0aWYgb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSBcImZyYW1lXCJcblx0XHRcdGZyYW1lID0gbmV3IEZyYW1lIG9wdGlvbnMuZnJhbWVcblx0XHRlbHNlXG5cdFx0XHRmcmFtZSA9IG5ldyBGcmFtZSBvcHRpb25zXG5cblx0XHRAZnJhbWUgPSBmcmFtZVxuXG5cdFx0IyBJbnNlcnQgdGhlIGxheWVyIGludG8gdGhlIGRvbSBvciB0aGUgc3VwZXJMYXllciBlbGVtZW50XG5cdFx0aWYgbm90IG9wdGlvbnMuc3VwZXJMYXllclxuXHRcdFx0QGJyaW5nVG9Gcm9udCgpXG5cdFx0XHRAX2luc2VydEVsZW1lbnQoKSBpZiBub3Qgb3B0aW9ucy5zaGFkb3dcblx0XHRlbHNlXG5cdFx0XHRAc3VwZXJMYXllciA9IG9wdGlvbnMuc3VwZXJMYXllclxuXG5cdFx0IyBTZXQgbmVlZGVkIHByaXZhdGUgdmFyaWFibGVzXG5cdFx0QF9zdWJMYXllcnMgPSBbXVxuXG5cdCMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdCMgUHJvcGVydGllc1xuXG5cdCMgQ3NzIHByb3BlcnRpZXNcblx0QGRlZmluZSBcIndpZHRoXCIsICBsYXllclByb3BlcnR5IFwid2lkdGhcIiwgIFwid2lkdGhcIiwgMTAwLCBfLmlzTnVtYmVyXG5cdEBkZWZpbmUgXCJoZWlnaHRcIiwgbGF5ZXJQcm9wZXJ0eSBcImhlaWdodFwiLCBcImhlaWdodFwiLCAxMDAsIF8uaXNOdW1iZXJcblxuXHRAZGVmaW5lIFwidmlzaWJsZVwiLCBsYXllclByb3BlcnR5IFwidmlzaWJsZVwiLCBcImRpc3BsYXlcIiwgdHJ1ZSwgXy5pc0Jvb2xcblx0QGRlZmluZSBcIm9wYWNpdHlcIiwgbGF5ZXJQcm9wZXJ0eSBcIm9wYWNpdHlcIiwgXCJvcGFjaXR5XCIsIDEsIF8uaXNOdW1iZXJcblx0QGRlZmluZSBcImluZGV4XCIsIGxheWVyUHJvcGVydHkgXCJpbmRleFwiLCBcInpJbmRleFwiLCAwLCBfLmlzTnVtYmVyXG5cdEBkZWZpbmUgXCJjbGlwXCIsIGxheWVyUHJvcGVydHkgXCJjbGlwXCIsIFwib3ZlcmZsb3dcIiwgdHJ1ZSwgXy5pc0Jvb2xcblx0XG5cdEBkZWZpbmUgXCJzY3JvbGxIb3Jpem9udGFsXCIsIGxheWVyUHJvcGVydHkgXCJzY3JvbGxIb3Jpem9udGFsXCIsIFwib3ZlcmZsb3dYXCIsIGZhbHNlLCBfLmlzQm9vbCwgKGxheWVyLCB2YWx1ZSkgLT5cblx0XHRsYXllci5pZ25vcmVFdmVudHMgPSBmYWxzZSBpZiB2YWx1ZSBpcyB0cnVlXG5cdFxuXHRAZGVmaW5lIFwic2Nyb2xsVmVydGljYWxcIiwgbGF5ZXJQcm9wZXJ0eSBcInNjcm9sbFZlcnRpY2FsXCIsIFwib3ZlcmZsb3dZXCIsIGZhbHNlLCBfLmlzQm9vbCwgKGxheWVyLCB2YWx1ZSkgLT5cblx0XHRsYXllci5pZ25vcmVFdmVudHMgPSBmYWxzZSBpZiB2YWx1ZSBpcyB0cnVlXG5cblx0QGRlZmluZSBcInNjcm9sbFwiLFxuXHRcdGdldDogLT4gQHNjcm9sbEhvcml6b250YWwgaXMgdHJ1ZSBvciBAc2Nyb2xsVmVydGljYWwgaXMgdHJ1ZVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2Nyb2xsSG9yaXpvbnRhbCA9IEBzY3JvbGxWZXJ0aWNhbCA9IHRydWVcblxuXHQjIEJlaGF2aW91ciBwcm9wZXJ0aWVzXG5cdEBkZWZpbmUgXCJpZ25vcmVFdmVudHNcIiwgbGF5ZXJQcm9wZXJ0eSBcImlnbm9yZUV2ZW50c1wiLCBcInBvaW50ZXJFdmVudHNcIiwgdHJ1ZSwgXy5pc0Jvb2xcblxuXHQjIE1hdHJpeCBwcm9wZXJ0aWVzXG5cdEBkZWZpbmUgXCJ4XCIsIGxheWVyUHJvcGVydHkgXCJ4XCIsIFwid2Via2l0VHJhbnNmb3JtXCIsIDAsIF8uaXNOdW1iZXJcblx0QGRlZmluZSBcInlcIiwgbGF5ZXJQcm9wZXJ0eSBcInlcIiwgXCJ3ZWJraXRUcmFuc2Zvcm1cIiwgMCwgXy5pc051bWJlclxuXHRAZGVmaW5lIFwielwiLCBsYXllclByb3BlcnR5IFwielwiLCBcIndlYmtpdFRyYW5zZm9ybVwiLCAwLCBfLmlzTnVtYmVyXG5cblx0QGRlZmluZSBcInNjYWxlWFwiLCBsYXllclByb3BlcnR5IFwic2NhbGVYXCIsIFwid2Via2l0VHJhbnNmb3JtXCIsIDEsIF8uaXNOdW1iZXJcblx0QGRlZmluZSBcInNjYWxlWVwiLCBsYXllclByb3BlcnR5IFwic2NhbGVZXCIsIFwid2Via2l0VHJhbnNmb3JtXCIsIDEsIF8uaXNOdW1iZXJcblx0QGRlZmluZSBcInNjYWxlWlwiLCBsYXllclByb3BlcnR5IFwic2NhbGVaXCIsIFwid2Via2l0VHJhbnNmb3JtXCIsIDEsIF8uaXNOdW1iZXJcblx0QGRlZmluZSBcInNjYWxlXCIsIGxheWVyUHJvcGVydHkgXCJzY2FsZVwiLCBcIndlYmtpdFRyYW5zZm9ybVwiLCAxLCBfLmlzTnVtYmVyXG5cblx0IyBAZGVmaW5lIFwic2NhbGVcIixcblx0IyBcdGdldDogLT4gKEBzY2FsZVggKyBAc2NhbGVZICsgQHNjYWxlWikgLyAzLjBcblx0IyBcdHNldDogKHZhbHVlKSAtPiBAc2NhbGVYID0gQHNjYWxlWSA9IEBzY2FsZVogPSB2YWx1ZVxuXG5cdEBkZWZpbmUgXCJvcmlnaW5YXCIsIGxheWVyUHJvcGVydHkgXCJvcmlnaW5YXCIsIFwid2Via2l0VHJhbnNmb3JtT3JpZ2luXCIsIDAuNSwgXy5pc051bWJlclxuXHRAZGVmaW5lIFwib3JpZ2luWVwiLCBsYXllclByb3BlcnR5IFwib3JpZ2luWVwiLCBcIndlYmtpdFRyYW5zZm9ybU9yaWdpblwiLCAwLjUsIF8uaXNOdW1iZXJcblx0IyBAZGVmaW5lIFwib3JpZ2luWlwiLCBsYXllclByb3BlcnR5IFwib3JpZ2luWlwiLCBcIndlYmtpdFRyYW5zZm9ybU9yaWdpblwiLCAwLjVcblxuXHRAZGVmaW5lIFwicm90YXRpb25YXCIsIGxheWVyUHJvcGVydHkgXCJyb3RhdGlvblhcIiwgXCJ3ZWJraXRUcmFuc2Zvcm1cIiwgMCwgXy5pc051bWJlclxuXHRAZGVmaW5lIFwicm90YXRpb25ZXCIsIGxheWVyUHJvcGVydHkgXCJyb3RhdGlvbllcIiwgXCJ3ZWJraXRUcmFuc2Zvcm1cIiwgMCwgXy5pc051bWJlclxuXHRAZGVmaW5lIFwicm90YXRpb25aXCIsIGxheWVyUHJvcGVydHkgXCJyb3RhdGlvblpcIiwgXCJ3ZWJraXRUcmFuc2Zvcm1cIiwgMCwgXy5pc051bWJlclxuXHRAZGVmaW5lIFwicm90YXRpb25cIiwgIGxheWVyUHJvcGVydHkgXCJyb3RhdGlvblpcIiwgXCJ3ZWJraXRUcmFuc2Zvcm1cIiwgMCwgXy5pc051bWJlclxuXG5cdCMgRmlsdGVyIHByb3BlcnRpZXNcblx0QGRlZmluZSBcImJsdXJcIiwgbGF5ZXJQcm9wZXJ0eSBcImJsdXJcIiwgXCJ3ZWJraXRGaWx0ZXJcIiwgMCwgXy5pc051bWJlclxuXHRAZGVmaW5lIFwiYnJpZ2h0bmVzc1wiLCBsYXllclByb3BlcnR5IFwiYnJpZ2h0bmVzc1wiLCBcIndlYmtpdEZpbHRlclwiLCAxMDAsIF8uaXNOdW1iZXJcblx0QGRlZmluZSBcInNhdHVyYXRlXCIsIGxheWVyUHJvcGVydHkgXCJzYXR1cmF0ZVwiLCBcIndlYmtpdEZpbHRlclwiLCAxMDAsIF8uaXNOdW1iZXJcblx0QGRlZmluZSBcImh1ZVJvdGF0ZVwiLCBsYXllclByb3BlcnR5IFwiaHVlUm90YXRlXCIsIFwid2Via2l0RmlsdGVyXCIsIDAsIF8uaXNOdW1iZXJcblx0QGRlZmluZSBcImNvbnRyYXN0XCIsIGxheWVyUHJvcGVydHkgXCJjb250cmFzdFwiLCBcIndlYmtpdEZpbHRlclwiLCAxMDAsIF8uaXNOdW1iZXJcblx0QGRlZmluZSBcImludmVydFwiLCBsYXllclByb3BlcnR5IFwiaW52ZXJ0XCIsIFwid2Via2l0RmlsdGVyXCIsIDAsIF8uaXNOdW1iZXJcblx0QGRlZmluZSBcImdyYXlzY2FsZVwiLCBsYXllclByb3BlcnR5IFwiZ3JheXNjYWxlXCIsIFwid2Via2l0RmlsdGVyXCIsIDAsIF8uaXNOdW1iZXJcblx0QGRlZmluZSBcInNlcGlhXCIsIGxheWVyUHJvcGVydHkgXCJzZXBpYVwiLCBcIndlYmtpdEZpbHRlclwiLCAwLCBfLmlzTnVtYmVyXG5cblx0IyBNYXBwZWQgc3R5bGUgcHJvcGVydGllc1xuXG5cdEBkZWZpbmUgXCJiYWNrZ3JvdW5kQ29sb3JcIiwgbGF5ZXJTdHlsZVByb3BlcnR5IFwiYmFja2dyb3VuZENvbG9yXCJcblx0QGRlZmluZSBcImJvcmRlclJhZGl1c1wiLCBsYXllclN0eWxlUHJvcGVydHkgXCJib3JkZXJSYWRpdXNcIlxuXHRAZGVmaW5lIFwiYm9yZGVyQ29sb3JcIiwgbGF5ZXJTdHlsZVByb3BlcnR5IFwiYm9yZGVyQ29sb3JcIlxuXHRAZGVmaW5lIFwiYm9yZGVyV2lkdGhcIiwgbGF5ZXJTdHlsZVByb3BlcnR5IFwiYm9yZGVyV2lkdGhcIlxuXG5cblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0IyBJZGVudGl0eVxuXG5cdEBkZWZpbmUgXCJuYW1lXCIsXG5cdFx0ZXhwb3J0YWJsZTogdHJ1ZVxuXHRcdGRlZmF1bHQ6IFwiXCJcblx0XHRnZXQ6IC0+IFxuXHRcdFx0QF9nZXRQcm9wZXJ0eVZhbHVlIFwibmFtZVwiXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAX3NldFByb3BlcnR5VmFsdWUgXCJuYW1lXCIsIHZhbHVlXG5cdFx0XHQjIFNldCB0aGUgbmFtZSBhdHRyaWJ1dGUgb2YgdGhlIGRvbSBlbGVtZW50IHRvb1xuXHRcdFx0IyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9rb2VuYm9rL0ZyYW1lci9pc3N1ZXMvNjNcblx0XHRcdEBfZWxlbWVudC5zZXRBdHRyaWJ1dGUgXCJuYW1lXCIsIHZhbHVlXG5cblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0IyBHZW9tZXRyeVxuXG5cdEBkZWZpbmUgXCJmcmFtZVwiLFxuXHRcdGdldDogLT5cblx0XHRcdG5ldyBGcmFtZSBAXG5cdFx0c2V0OiAoZnJhbWUpIC0+XG5cdFx0XHRyZXR1cm4gaWYgbm90IGZyYW1lXG5cdFx0XHRmb3IgayBpbiBbXCJ4XCIsIFwieVwiLCBcIndpZHRoXCIsIFwiaGVpZ2h0XCJdXG5cdFx0XHRcdEBba10gPSBmcmFtZVtrXVxuXG5cdEBkZWZpbmUgXCJtaW5YXCIsIGZyYW1lUHJvcGVydHkgXCJtaW5YXCJcblx0QGRlZmluZSBcIm1pZFhcIiwgZnJhbWVQcm9wZXJ0eSBcIm1pZFhcIlxuXHRAZGVmaW5lIFwibWF4WFwiLCBmcmFtZVByb3BlcnR5IFwibWF4WFwiXG5cdEBkZWZpbmUgXCJtaW5ZXCIsIGZyYW1lUHJvcGVydHkgXCJtaW5ZXCJcblx0QGRlZmluZSBcIm1pZFlcIiwgZnJhbWVQcm9wZXJ0eSBcIm1pZFlcIlxuXHRAZGVmaW5lIFwibWF4WVwiLCBmcmFtZVByb3BlcnR5IFwibWF4WVwiXG5cblx0Y29udmVydFBvaW50OiAocG9pbnQpIC0+XG5cdFx0IyBDb252ZXJ0IGEgcG9pbnQgb24gc2NyZWVuIHRvIHRoaXMgdmlld3MgY29vcmRpbmF0ZSBzeXN0ZW1cblx0XHQjIFRPRE86IG5lZWRzIHRlc3RzXG5cdFx0VXRpbHMuY29udmVydFBvaW50IHBvaW50LCBudWxsLCBAXG5cblx0c2NyZWVuRnJhbWU6IC0+XG5cdFx0IyBHZXQgdGhpcyB2aWV3cyBhYnNvbHV0ZSBmcmFtZSBvbiB0aGUgc2NyZWVuXG5cdFx0IyBUT0RPOiBuZWVkcyB0ZXN0c1xuXHRcdFV0aWxzLmNvbnZlcnRQb2ludCBAZnJhbWUsIEAsIG51bGxcblxuXHRjb250ZW50RnJhbWU6IC0+XG5cdFx0VXRpbHMuZnJhbWVNZXJnZSBAc3ViTGF5ZXJzLm1hcCAobGF5ZXIpIC0+IGxheWVyLmZyYW1lLnByb3BlcnRpZXNcblxuXHRjZW50ZXJGcmFtZTogLT5cblx0XHQjIEdldCB0aGUgY2VudGVyZWQgZnJhbWUgZm9yIGl0cyBzdXBlckxheWVyXG5cdFx0IyBXZSBhbHdheXMgbWFrZSB0aGVzZSBwaXhlbCBwZXJmZWN0XG5cdFx0IyBUT0RPOiBuZWVkcyB0ZXN0c1xuXHRcdGlmIEBzdXBlckxheWVyXG5cdFx0XHRmcmFtZSA9IEBmcmFtZVxuXHRcdFx0ZnJhbWUubWlkWCA9IHBhcnNlSW50IEBzdXBlckxheWVyLndpZHRoIC8gMi4wXG5cdFx0XHRmcmFtZS5taWRZID0gcGFyc2VJbnQgQHN1cGVyTGF5ZXIuaGVpZ2h0IC8gMi4wXG5cdFx0XHRyZXR1cm4gZnJhbWVcblxuXHRcdGVsc2Vcblx0XHRcdGZyYW1lID0gQGZyYW1lXG5cdFx0XHRmcmFtZS5taWRYID0gcGFyc2VJbnQgd2luZG93LmlubmVyV2lkdGggLyAyLjBcblx0XHRcdGZyYW1lLm1pZFkgPSBwYXJzZUludCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyLjBcblx0XHRcdHJldHVybiBmcmFtZVxuXG5cdGNlbnRlcjogLT4gQGZyYW1lID0gQGNlbnRlckZyYW1lKCkgIyBDZW50ZXIgIGluIHN1cGVyTGF5ZXJcblx0Y2VudGVyWDogLT4gQHggPSBAY2VudGVyRnJhbWUoKS54ICMgQ2VudGVyIHggaW4gc3VwZXJMYXllclxuXHRjZW50ZXJZOiAtPiBAeSA9IEBjZW50ZXJGcmFtZSgpLnkgIyBDZW50ZXIgeSBpbiBzdXBlckxheWVyXG5cblx0cGl4ZWxBbGlnbjogLT5cblx0XHRAeCA9IHBhcnNlSW50IEB4XG5cdFx0QHkgPSBwYXJzZUludCBAeVxuXG5cblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0IyBDU1NcblxuXHRAZGVmaW5lIFwic3R5bGVcIixcblx0XHRnZXQ6IC0+IEBfZWxlbWVudC5zdHlsZVxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0Xy5leHRlbmQgQF9lbGVtZW50LnN0eWxlLCB2YWx1ZVxuXHRcdFx0QGVtaXQgXCJjaGFuZ2U6c3R5bGVcIlxuXG5cdEBkZWZpbmUgXCJodG1sXCIsXG5cdFx0Z2V0OiAtPlxuXHRcdFx0QF9lbGVtZW50SFRNTD8uaW5uZXJIVE1MXG5cblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblxuXHRcdFx0IyBJbnNlcnQgc29tZSBodG1sIGRpcmVjdGx5IGludG8gdGhpcyBsYXllci4gV2UgYWN0dWFsbHkgY3JlYXRlXG5cdFx0XHQjIGEgY2hpbGQgbm9kZSB0byBpbnNlcnQgaXQgaW4sIHNvIGl0IHdvbid0IG1lc3Mgd2l0aCBGcmFtZXJzXG5cdFx0XHQjIGxheWVyIGhpZXJhcmNoeS5cblxuXHRcdFx0aWYgbm90IEBfZWxlbWVudEhUTUxcblx0XHRcdFx0QF9lbGVtZW50SFRNTCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgXCJkaXZcIlxuXHRcdFx0XHRAX2VsZW1lbnQuYXBwZW5kQ2hpbGQgQF9lbGVtZW50SFRNTFxuXG5cdFx0XHRAX2VsZW1lbnRIVE1MLmlubmVySFRNTCA9IHZhbHVlXG5cblx0XHRcdCMgSWYgdGhlIGNvbnRlbnRzIGNvbnRhaW5zIHNvbWV0aGluZyBlbHNlIHRoYW4gcGxhaW4gdGV4dFxuXHRcdFx0IyB0aGVuIHdlIHR1cm4gb2ZmIGlnbm9yZUV2ZW50cyBzbyBidXR0b25zIGV0YyB3aWxsIHdvcmsuXG5cblx0XHRcdGlmIG5vdCAoXG5cdFx0XHRcdEBfZWxlbWVudEhUTUwuY2hpbGROb2Rlcy5sZW5ndGggPT0gMSBhbmRcblx0XHRcdFx0QF9lbGVtZW50SFRNTC5jaGlsZE5vZGVzWzBdLm5vZGVOYW1lID09IFwiI3RleHRcIilcblx0XHRcdFx0QGlnbm9yZUV2ZW50cyA9IGZhbHNlXG5cblx0XHRcdEBlbWl0IFwiY2hhbmdlOmh0bWxcIlxuXG5cdGNvbXB1dGVkU3R5bGU6IC0+XG5cdFx0ZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSBAX2VsZW1lbnRcblxuXHRfc2V0RGVmYXVsdENTUzogLT5cblx0XHRAc3R5bGUgPSBDb25maWcubGF5ZXJCYXNlQ1NTXG5cblx0QGRlZmluZSBcImNsYXNzTGlzdFwiLFxuXHRcdGdldDogLT4gQF9lbGVtZW50LmNsYXNzTGlzdFxuXG5cblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0IyBET00gRUxFTUVOVFNcblxuXHRfY3JlYXRlRWxlbWVudDogLT5cblx0XHRyZXR1cm4gaWYgQF9lbGVtZW50P1xuXHRcdEBfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgXCJkaXZcIlxuXG5cdF9pbnNlcnRFbGVtZW50OiAtPlxuXHRcdFV0aWxzLmRvbUNvbXBsZXRlIEBfX2luc2VydEVsZW1lbnRcblxuXHRfX2luc2VydEVsZW1lbnQ6ID0+XG5cdFx0aWYgbm90IF9Sb290RWxlbWVudFxuXHRcdFx0X1Jvb3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcImRpdlwiXG5cdFx0XHRfUm9vdEVsZW1lbnQuaWQgPSBcIkZyYW1lclJvb3RcIlxuXHRcdFx0Xy5leHRlbmQgX1Jvb3RFbGVtZW50LnN0eWxlLCBDb25maWcucm9vdEJhc2VDU1Ncblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQgX1Jvb3RFbGVtZW50XG5cblx0XHRfUm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQgQF9lbGVtZW50XG5cblx0ZGVzdHJveTogLT5cblxuXHRcdGlmIEBzdXBlckxheWVyXG5cdFx0XHRAc3VwZXJMYXllci5fc3ViTGF5ZXJzID0gXy53aXRob3V0IEBzdXBlckxheWVyLl9zdWJMYXllcnMsIEBcblxuXHRcdEBfZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkIEBfZWxlbWVudFxuXHRcdEByZW1vdmVBbGxMaXN0ZW5lcnMoKVxuXG5cdFx0X0xheWVyTGlzdCA9IF8ud2l0aG91dCBfTGF5ZXJMaXN0LCBAXG5cblxuXHQjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQjIyBDT1BZSU5HXG5cblx0Y29weTogLT5cblxuXHRcdCMgVG9kbzogd2hhdCBhYm91dCBldmVudHMsIHN0YXRlcywgZXRjLlxuXG5cdFx0bGF5ZXIgPSBAY29weVNpbmdsZSgpXG5cblx0XHRmb3Igc3ViTGF5ZXIgaW4gQHN1YkxheWVyc1xuXHRcdFx0Y29waWVkU3VibGF5ZXIgPSBzdWJMYXllci5jb3B5KClcblx0XHRcdGNvcGllZFN1YmxheWVyLnN1cGVyTGF5ZXIgPSBsYXllclxuXG5cdFx0bGF5ZXJcblxuXHRjb3B5U2luZ2xlOiAtPiBuZXcgTGF5ZXIgQHByb3BlcnRpZXNcblxuXHQjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQjIyBBTklNQVRJT05cblxuXHRhbmltYXRlOiAob3B0aW9ucykgLT5cblxuXHRcdG9wdGlvbnMubGF5ZXIgPSBAXG5cdFx0b3B0aW9ucy5jdXJ2ZU9wdGlvbnMgPSBvcHRpb25zXG5cblx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uIG9wdGlvbnNcblx0XHRhbmltYXRpb24uc3RhcnQoKVxuXG5cdFx0YW5pbWF0aW9uXG5cblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0IyMgSU1BR0VcblxuXHRAZGVmaW5lIFwiaW1hZ2VcIixcblx0XHRleHBvcnRhYmxlOiB0cnVlXG5cdFx0ZGVmYXVsdDogXCJcIlxuXHRcdGdldDogLT5cblx0XHRcdEBfZ2V0UHJvcGVydHlWYWx1ZSBcImltYWdlXCJcblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblxuXHRcdFx0Y3VycmVudFZhbHVlID0gQF9nZXRQcm9wZXJ0eVZhbHVlIFwiaW1hZ2VcIlxuXG5cdFx0XHRpZiBjdXJyZW50VmFsdWUgPT0gdmFsdWVcblx0XHRcdFx0cmV0dXJuIEBlbWl0IFwibG9hZFwiXG5cblx0XHRcdCMgVG9kbzogdGhpcyBpcyBub3QgdmVyeSBuaWNlIGJ1dCBJIHdhbnRlZCB0byBoYXZlIGl0IGZpeGVkXG5cdFx0XHQjIGRlZmF1bHRzID0gRGVmYXVsdHMuZ2V0RGVmYXVsdHMgXCJMYXllclwiLCB7fVxuXG5cdFx0XHQjIGNvbnNvbGUubG9nIGRlZmF1bHRzLmJhY2tncm91bmRDb2xvclxuXHRcdFx0IyBjb25zb2xlLmxvZyBAX2RlZmF1bHRWYWx1ZXM/LmJhY2tncm91bmRDb2xvclxuXG5cdFx0XHQjIGlmIGRlZmF1bHRzLmJhY2tncm91bmRDb2xvciA9PSBAX2RlZmF1bHRWYWx1ZXM/LmJhY2tncm91bmRDb2xvclxuXHRcdFx0IyBcdEBiYWNrZ3JvdW5kQ29sb3IgPSBudWxsXG5cblx0XHRcdEBiYWNrZ3JvdW5kQ29sb3IgPSBudWxsXG5cblx0XHRcdCMgU2V0IHRoZSBwcm9wZXJ0eSB2YWx1ZVxuXHRcdFx0QF9zZXRQcm9wZXJ0eVZhbHVlIFwiaW1hZ2VcIiwgdmFsdWVcblxuXHRcdFx0aW1hZ2VVcmwgPSB2YWx1ZVxuXG5cdFx0XHQjIE9wdGlvbmFsIGJhc2UgaW1hZ2UgdmFsdWVcblx0XHRcdCMgaW1hZ2VVcmwgPSBDb25maWcuYmFzZVVybCArIGltYWdlVXJsXG5cblx0XHRcdCMgSWYgdGhlIGZpbGUgaXMgbG9jYWwsIHdlIHdhbnQgdG8gYXZvaWQgY2FjaGluZ1xuXHRcdFx0IyBpZiBVdGlscy5pc0xvY2FsKClcblx0XHRcdCMgXHRpbWFnZVVybCArPSBcIj9ub2NhY2hlPSN7RGF0ZS5ub3coKX1cIlxuXG5cdFx0XHQjIEFzIGFuIG9wdGltaXphdGlvbiwgd2Ugd2lsbCBvbmx5IHVzZSBhIGxvYWRlclxuXHRcdFx0IyBpZiBzb21ldGhpbmcgaXMgZXhwbGljaXRseSBsaXN0ZW5pbmcgdG8gdGhlIGxvYWQgZXZlbnRcblxuXHRcdFx0aWYgQGV2ZW50cz8uaGFzT3duUHJvcGVydHkgXCJsb2FkXCIgb3IgQGV2ZW50cz8uaGFzT3duUHJvcGVydHkgXCJlcnJvclwiXG5cblx0XHRcdFx0bG9hZGVyID0gbmV3IEltYWdlKClcblx0XHRcdFx0bG9hZGVyLm5hbWUgPSBpbWFnZVVybFxuXHRcdFx0XHRsb2FkZXIuc3JjID0gaW1hZ2VVcmxcblxuXHRcdFx0XHRsb2FkZXIub25sb2FkID0gPT5cblx0XHRcdFx0XHRAc3R5bGVbXCJiYWNrZ3JvdW5kLWltYWdlXCJdID0gXCJ1cmwoJyN7aW1hZ2VVcmx9JylcIlxuXHRcdFx0XHRcdEBlbWl0IFwibG9hZFwiLCBsb2FkZXJcblxuXHRcdFx0XHRsb2FkZXIub25lcnJvciA9ID0+XG5cdFx0XHRcdFx0QGVtaXQgXCJlcnJvclwiLCBsb2FkZXJcblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAc3R5bGVbXCJiYWNrZ3JvdW5kLWltYWdlXCJdID0gXCJ1cmwoJyN7aW1hZ2VVcmx9JylcIlxuXG5cdCMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdCMjIEhJRVJBUkNIWVxuXG5cdEBkZWZpbmUgXCJzdXBlckxheWVyXCIsXG5cdFx0ZXhwb3J0YWJsZTogZmFsc2Vcblx0XHRnZXQ6IC0+XG5cdFx0XHRAX3N1cGVyTGF5ZXIgb3IgbnVsbFxuXHRcdHNldDogKGxheWVyKSAtPlxuXG5cdFx0XHRyZXR1cm4gaWYgbGF5ZXIgaXMgQF9zdXBlckxheWVyXG5cblx0XHRcdCMgQ2hlY2sgdGhlIHR5cGVcblx0XHRcdGlmIG5vdCBsYXllciBpbnN0YW5jZW9mIExheWVyXG5cdFx0XHRcdHRocm93IEVycm9yIFwiTGF5ZXIuc3VwZXJMYXllciBuZWVkcyB0byBiZSBhIExheWVyIG9iamVjdFwiXG5cblx0XHRcdCMgQ2FuY2VsIHByZXZpb3VzIHBlbmRpbmcgaW5zZXJ0aW9uc1xuXHRcdFx0VXRpbHMuZG9tQ29tcGxldGVDYW5jZWwgQF9faW5zZXJ0RWxlbWVudFxuXG5cdFx0XHQjIFJlbW92ZSBmcm9tIHByZXZpb3VzIHN1cGVybGF5ZXIgc3VibGF5ZXJzXG5cdFx0XHRpZiBAX3N1cGVyTGF5ZXJcblx0XHRcdFx0QF9zdXBlckxheWVyLl9zdWJMYXllcnMgPSBfLndpdGhvdXQgQF9zdXBlckxheWVyLl9zdWJMYXllcnMsIEBcblx0XHRcdFx0QF9zdXBlckxheWVyLl9lbGVtZW50LnJlbW92ZUNoaWxkIEBfZWxlbWVudFxuXHRcdFx0XHRAX3N1cGVyTGF5ZXIuZW1pdCBcImNoYW5nZTpzdWJMYXllcnNcIiwge2FkZGVkOltdLCByZW1vdmVkOltAXX1cblxuXHRcdFx0IyBFaXRoZXIgaW5zZXJ0IHRoZSBlbGVtZW50IHRvIHRoZSBuZXcgc3VwZXJsYXllciBlbGVtZW50IG9yIGludG8gZG9tXG5cdFx0XHRpZiBsYXllclxuXHRcdFx0XHRsYXllci5fZWxlbWVudC5hcHBlbmRDaGlsZCBAX2VsZW1lbnRcblx0XHRcdFx0bGF5ZXIuX3N1YkxheWVycy5wdXNoIEBcblx0XHRcdFx0bGF5ZXIuZW1pdCBcImNoYW5nZTpzdWJMYXllcnNcIiwge2FkZGVkOltAXSwgcmVtb3ZlZDpbXX1cblx0XHRcdGVsc2Vcblx0XHRcdFx0QF9pbnNlcnRFbGVtZW50KClcblxuXHRcdFx0IyBTZXQgdGhlIHN1cGVybGF5ZXJcblx0XHRcdEBfc3VwZXJMYXllciA9IGxheWVyXG5cblx0XHRcdCMgUGxhY2UgdGhpcyBsYXllciBvbiB0b3Agb2YgaXQncyBzaWJsaW5nc1xuXHRcdFx0QGJyaW5nVG9Gcm9udCgpXG5cblx0XHRcdEBlbWl0IFwiY2hhbmdlOnN1cGVyTGF5ZXJcIlxuXG5cdHN1cGVyTGF5ZXJzOiAtPlxuXG5cdFx0c3VwZXJMYXllcnMgPSBbXVxuXG5cdFx0cmVjdXJzZSA9IChsYXllcikgLT5cblx0XHRcdHJldHVybiBpZiBub3QgbGF5ZXIuc3VwZXJMYXllclxuXHRcdFx0c3VwZXJMYXllcnMucHVzaCBsYXllci5zdXBlckxheWVyXG5cdFx0XHRyZWN1cnNlIGxheWVyLnN1cGVyTGF5ZXJcblxuXHRcdHJlY3Vyc2UgQFxuXG5cdFx0c3VwZXJMYXllcnNcblxuXHQjIFRvZG86IHNob3VsZCB3ZSBoYXZlIGEgcmVjdXJzaXZlIHN1YkxheWVycyBmdW5jdGlvbj9cblx0IyBMZXQncyBtYWtlIGl0IHdoZW4gd2UgbmVlZCBpdC5cblxuXHRAZGVmaW5lIFwic3ViTGF5ZXJzXCIsXG5cdFx0ZXhwb3J0YWJsZTogZmFsc2Vcblx0XHRnZXQ6IC0+IF8uY2xvbmUgQF9zdWJMYXllcnNcblxuXHRAZGVmaW5lIFwic2libGluZ0xheWVyc1wiLFxuXHRcdGV4cG9ydGFibGU6IGZhbHNlXG5cdFx0Z2V0OiAtPlxuXG5cdFx0XHQjIElmIHRoZXJlIGlzIG5vIHN1cGVyTGF5ZXIgd2UgbmVlZCB0byB3YWxrIHRocm91Z2ggdGhlIHJvb3Rcblx0XHRcdGlmIEBzdXBlckxheWVyIGlzIG51bGxcblx0XHRcdFx0cmV0dXJuIF8uZmlsdGVyIF9MYXllckxpc3QsIChsYXllcikgPT5cblx0XHRcdFx0XHRsYXllciBpc250IEAgYW5kIGxheWVyLnN1cGVyTGF5ZXIgaXMgbnVsbFxuXG5cdFx0XHRyZXR1cm4gXy53aXRob3V0IEBzdXBlckxheWVyLnN1YkxheWVycywgQFxuXG5cdGFkZFN1YkxheWVyOiAobGF5ZXIpIC0+XG5cdFx0bGF5ZXIuc3VwZXJMYXllciA9IEBcblxuXHRyZW1vdmVTdWJMYXllcjogKGxheWVyKSAtPlxuXG5cdFx0aWYgbGF5ZXIgbm90IGluIEBzdWJMYXllcnNcblx0XHRcdHJldHVyblxuXG5cdFx0bGF5ZXIuc3VwZXJMYXllciA9IG51bGxcblxuXHRzdWJMYXllcnNCeU5hbWU6IChuYW1lKSAtPlxuXHRcdF8uZmlsdGVyIEBzdWJMYXllcnMsIChsYXllcikgLT4gbGF5ZXIubmFtZSA9PSBuYW1lXG5cblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0IyMgQU5JTUFUSU9OXG5cblx0YW5pbWF0ZTogKG9wdGlvbnMpIC0+XG5cblx0XHRzdGFydCA9IG9wdGlvbnMuc3RhcnRcblx0XHRzdGFydCA/PSB0cnVlXG5cdFx0ZGVsZXRlIG9wdGlvbnMuc3RhcnRcblxuXHRcdG9wdGlvbnMubGF5ZXIgPSBAXG5cdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbiBvcHRpb25zXG5cdFx0YW5pbWF0aW9uLnN0YXJ0KCkgaWYgc3RhcnRcblx0XHRhbmltYXRpb25cblxuXHRhbmltYXRpb25zOiAtPlxuXHRcdCMgQ3VycmVudCBydW5uaW5nIGFuaW1hdGlvbnMgb24gdGhpcyBsYXllclxuXHRcdF8uZmlsdGVyIEFuaW1hdGlvbi5ydW5uaW5nQW5pbWF0aW9ucygpLCAoYSkgPT5cblx0XHRcdGEub3B0aW9ucy5sYXllciA9PSBAXG5cblx0YW5pbWF0ZVN0b3A6IC0+XG5cdFx0Xy5pbnZva2UgQGFuaW1hdGlvbnMoKSwgXCJzdG9wXCJcblxuXHQjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQjIyBJTkRFWCBPUkRFUklOR1xuXG5cdGJyaW5nVG9Gcm9udDogLT5cblx0XHRAaW5kZXggPSBfLm1heChfLnVuaW9uKFswXSwgQHNpYmxpbmdMYXllcnMubWFwIChsYXllcikgLT4gbGF5ZXIuaW5kZXgpKSArIDFcblxuXHRzZW5kVG9CYWNrOiAtPlxuXHRcdEBpbmRleCA9IF8ubWluKF8udW5pb24oWzBdLCBAc2libGluZ0xheWVycy5tYXAgKGxheWVyKSAtPiBsYXllci5pbmRleCkpIC0gMVxuXG5cdHBsYWNlQmVmb3JlOiAobGF5ZXIpIC0+XG5cdFx0cmV0dXJuIGlmIGxheWVyIG5vdCBpbiBAc2libGluZ0xheWVyc1xuXG5cdFx0Zm9yIGwgaW4gQHNpYmxpbmdMYXllcnNcblx0XHRcdGlmIGwuaW5kZXggPD0gbGF5ZXIuaW5kZXhcblx0XHRcdFx0bC5pbmRleCAtPSAxXG5cblx0XHRAaW5kZXggPSBsYXllci5pbmRleCArIDFcblxuXHRwbGFjZUJlaGluZDogKGxheWVyKSAtPlxuXHRcdHJldHVybiBpZiBsYXllciBub3QgaW4gQHNpYmxpbmdMYXllcnNcblxuXHRcdGZvciBsIGluIEBzaWJsaW5nTGF5ZXJzXG5cdFx0XHRpZiBsLmluZGV4ID49IGxheWVyLmluZGV4XG5cdFx0XHRcdGwuaW5kZXggKz0gMVxuXG5cdFx0QGluZGV4ID0gbGF5ZXIuaW5kZXggLSAxXG5cblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0IyMgU1RBVEVTXG5cblx0QGRlZmluZSBcInN0YXRlc1wiLFxuXHRcdGdldDogLT4gQF9zdGF0ZXMgPz0gbmV3IExheWVyU3RhdGVzIEBcblxuXHQjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQjIyBEcmFnZ2FibGVcblxuXHRAZGVmaW5lIFwiZHJhZ2dhYmxlXCIsXG5cdFx0Z2V0OiAtPlxuXHRcdFx0QF9kcmFnZ2FibGUgPz0gbmV3IExheWVyRHJhZ2dhYmxlIEBcblx0XHRcdEBfZHJhZ2dhYmxlXG5cblx0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0IyMgU0NST0xMSU5HXG5cblx0IyBUT0RPOiBUZXN0c1xuXG5cdEBkZWZpbmUgXCJzY3JvbGxGcmFtZVwiLFxuXHRcdGdldDogLT5cblx0XHRcdHJldHVybiBuZXcgRnJhbWVcblx0XHRcdFx0eDogQHNjcm9sbFhcblx0XHRcdFx0eTogQHNjcm9sbFlcblx0XHRcdFx0d2lkdGg6IEB3aWR0aFxuXHRcdFx0XHRoZWlnaHQ6IEBoZWlnaHRcblx0XHRzZXQ6IChmcmFtZSkgLT5cblx0XHRcdEBzY3JvbGxYID0gZnJhbWUueFxuXHRcdFx0QHNjcm9sbFkgPSBmcmFtZS55XG5cblx0QGRlZmluZSBcInNjcm9sbFhcIixcblx0XHRnZXQ6IC0+IEBfZWxlbWVudC5zY3JvbGxMZWZ0XG5cdFx0c2V0OiAodmFsdWUpIC0+IEBfZWxlbWVudC5zY3JvbGxMZWZ0ID0gdmFsdWVcblxuXHRAZGVmaW5lIFwic2Nyb2xsWVwiLFxuXHRcdGdldDogLT4gQF9lbGVtZW50LnNjcm9sbFRvcFxuXHRcdHNldDogKHZhbHVlKSAtPiBAX2VsZW1lbnQuc2Nyb2xsVG9wID0gdmFsdWVcblxuXHQjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQjIyBFVkVOVFNcblxuXHRhZGRMaXN0ZW5lcjogKGV2ZW50LCBvcmlnaW5hbExpc3RlbmVyKSA9PlxuXG5cdFx0IyAjIE1vZGlmeSB0aGUgc2NvcGUgdG8gYmUgdGhlIGNhbGxpbmcgb2JqZWN0LCBqdXN0IGxpa2UganF1ZXJ5XG5cdFx0IyAjIGFsc28gYWRkIHRoZSBvYmplY3QgYXMgdGhlIGxhc3QgYXJndW1lbnRcblx0XHRsaXN0ZW5lciA9IChhcmdzLi4uKSA9PlxuXHRcdFx0b3JpZ2luYWxMaXN0ZW5lci5jYWxsIEAsIGFyZ3MuLi4sIEBcblxuXHRcdCMgQmVjYXVzZSB3ZSBtb2RpZnkgdGhlIGxpc3RlbmVyIHdlIG5lZWQgdG8ga2VlcCB0cmFjayBvZiBpdFxuXHRcdCMgc28gd2UgY2FuIGZpbmQgaXQgYmFjayB3aGVuIHdlIHdhbnQgdG8gdW5saXN0ZW4gYWdhaW5cblx0XHRvcmlnaW5hbExpc3RlbmVyLm1vZGlmaWVkTGlzdGVuZXIgPSBsaXN0ZW5lclxuXG5cdFx0IyBMaXN0ZW4gdG8gZG9tIGV2ZW50cyBvbiB0aGUgZWxlbWVudFxuXHRcdHN1cGVyIGV2ZW50LCBsaXN0ZW5lclxuXHRcdEBfZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIGV2ZW50LCBsaXN0ZW5lclxuXG5cdFx0QF9ldmVudExpc3RlbmVycyA/PSB7fVxuXHRcdEBfZXZlbnRMaXN0ZW5lcnNbZXZlbnRdID89IFtdXG5cdFx0QF9ldmVudExpc3RlbmVyc1tldmVudF0ucHVzaCBsaXN0ZW5lclxuXG5cdFx0IyBXZSB3YW50IHRvIG1ha2Ugc3VyZSB3ZSBsaXN0ZW4gdG8gdGhlc2UgZXZlbnRzXG5cdFx0QGlnbm9yZUV2ZW50cyA9IGZhbHNlXG5cblx0cmVtb3ZlTGlzdGVuZXI6IChldmVudCwgbGlzdGVuZXIpIC0+XG5cblx0XHQjIElmIHRoZSBvcmlnaW5hbCBsaXN0ZW5lciB3YXMgbW9kaWZpZWQsIHJlbW92ZSB0aGF0XG5cdFx0IyBvbmUgaW5zdGVhZFxuXHRcdGlmIGxpc3RlbmVyLm1vZGlmaWVkTGlzdGVuZXJcblx0XHRcdGxpc3RlbmVyID0gbGlzdGVuZXIubW9kaWZpZWRMaXN0ZW5lclxuXG5cdFx0c3VwZXIgZXZlbnQsIGxpc3RlbmVyXG5cdFx0XG5cdFx0QF9lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgZXZlbnQsIGxpc3RlbmVyXG5cdFx0QF9ldmVudExpc3RlbmVyc1tldmVudF0gPSBfLndpdGhvdXQgQF9ldmVudExpc3RlbmVyc1tldmVudF0sIGxpc3RlbmVyXG5cblx0cmVtb3ZlQWxsTGlzdGVuZXJzOiAtPlxuXG5cdFx0cmV0dXJuIGlmIG5vdCBAX2V2ZW50TGlzdGVuZXJzXG5cblx0XHRmb3IgZXZlbnROYW1lLCBsaXN0ZW5lcnMgb2YgQF9ldmVudExpc3RlbmVyc1xuXHRcdFx0Zm9yIGxpc3RlbmVyIGluIGxpc3RlbmVyc1xuXHRcdFx0XHRAcmVtb3ZlTGlzdGVuZXIgZXZlbnROYW1lLCBsaXN0ZW5lclxuXG5cdG9uOiBAOjphZGRMaXN0ZW5lclxuXHRvZmY6IEA6OnJlbW92ZUxpc3RlbmVyXG5cbmV4cG9ydHMuTGF5ZXIuTGF5ZXJzID0gLT4gXy5jbG9uZSBfTGF5ZXJMaXN0XG4iLCJfID0gcmVxdWlyZSBcIi4vVW5kZXJzY29yZVwiXG5cblV0aWxzID0gcmVxdWlyZSBcIi4vVXRpbHNcIlxue0V2ZW50RW1pdHRlcn0gPSByZXF1aXJlIFwiLi9FdmVudEVtaXR0ZXJcIlxue0V2ZW50c30gPSByZXF1aXJlIFwiLi9FdmVudHNcIlxuXG4jIEFkZCBzcGVjaWZpYyBldmVudHMgZm9yIGRyYWdnYWJsZVxuRXZlbnRzLkRyYWdTdGFydCA9IFwiZHJhZ3N0YXJ0XCJcbkV2ZW50cy5EcmFnTW92ZSA9IFwiZHJhZ21vdmVcIlxuRXZlbnRzLkRyYWdFbmQgPSBcImRyYWdlbmRcIlxuXG5cIlwiXCJcblRoaXMgdGFrZXMgYW55IGxheWVyIGFuZCBtYWtlcyBpdCBkcmFnZ2FibGUgYnkgdGhlIHVzZXIgb24gbW9iaWxlIG9yIGRlc2t0b3AuXG5cblNvbWUgaW50ZXJlc3RpbmcgdGhpbmdzIGFyZTpcblxuLSBUaGUgZHJhZ2dhYmxlLmNhbGN1bGF0ZVZlbG9jaXR5KCkueHx5IGNvbnRhaW5zIHRoZSBjdXJyZW50IGF2ZXJhZ2Ugc3BlZWQgXG4gIGluIHRoZSBsYXN0IDEwMG1zIChkZWZpbmVkIHdpdGggVmVsb2NpdHlUaW1lT3V0KS5cbi0gWW91IGNhbiBlbmFibGUvZGlzYWJsZSBvciBzbG93ZG93bi9zcGVlZHVwIHNjcm9sbGluZyB3aXRoXG4gIGRyYWdnYWJsZS5zcGVlZC54fHlcblxuXCJcIlwiXG5cbmNsYXNzIGV4cG9ydHMuTGF5ZXJEcmFnZ2FibGUgZXh0ZW5kcyBFdmVudEVtaXR0ZXJcblxuXHRAVmVsb2NpdHlUaW1lT3V0ID0gMTAwXG5cblx0Y29uc3RydWN0b3I6IChAbGF5ZXIpIC0+XG5cblx0XHQjIEBzcGVlZCA9IHt4OjEuMCwgeToxLjB9XG5cdFx0QHNwZWVkWCA9IDEuMFxuXHRcdEBzcGVlZFkgPSAxLjBcblxuXHRcdEBfZGVsdGFzID0gW11cblx0XHRAX2lzRHJhZ2dpbmcgPSBmYWxzZVxuXG5cdFx0QGVuYWJsZWQgPSB0cnVlXG5cblx0XHRAYXR0YWNoKClcblxuXHRhdHRhY2g6IC0+IEBsYXllci5vbiAgRXZlbnRzLlRvdWNoU3RhcnQsIEBfdG91Y2hTdGFydFxuXHRyZW1vdmU6IC0+IEBsYXllci5vZmYgRXZlbnRzLlRvdWNoU3RhcnQsIEBfdG91Y2hTdGFydFxuXG5cdGVtaXQ6IChldmVudE5hbWUsIGV2ZW50KSAtPlxuXHRcdCMgV2Ugb3ZlcnJpZGUgdGhpcyB0byBnZXQgYWxsIGV2ZW50cyBib3RoIG9uIHRoZSBkcmFnZ2FibGVcblx0XHQjIGFuZCB0aGUgZW5jYXBzdWxhdGVkIGxheWVyLlxuXHRcdEBsYXllci5lbWl0IGV2ZW50TmFtZSwgZXZlbnRcblxuXHRcdHN1cGVyIGV2ZW50TmFtZSwgZXZlbnRcblxuXG5cdGNhbGN1bGF0ZVZlbG9jaXR5OiAtPlxuXG5cdFx0aWYgQF9kZWx0YXMubGVuZ3RoIDwgMlxuXHRcdFx0cmV0dXJuIHt4OjAsIHk6MH1cblxuXHRcdGN1cnIgPSBAX2RlbHRhc1stMS4uLTFdWzBdXG5cdFx0cHJldiA9IEBfZGVsdGFzWy0yLi4tMl1bMF1cblx0XHR0aW1lID0gY3Vyci50IC0gcHJldi50XG5cblx0XHQjIEJhaWwgb3V0IGlmIHRoZSBsYXN0IG1vdmUgdXBkYXRlcyB3aGVyZSBhIHdoaWxlIGFnb1xuXHRcdHRpbWVTaW5jZUxhc3RNb3ZlID0gKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gcHJldi50KVxuXG5cdFx0aWYgdGltZVNpbmNlTGFzdE1vdmUgPiBAVmVsb2NpdHlUaW1lT3V0XG5cdFx0XHRyZXR1cm4ge3g6MCwgeTowfVxuXG5cdFx0dmVsb2NpdHkgPVxuXHRcdFx0eDogKGN1cnIueCAtIHByZXYueCkgLyB0aW1lXG5cdFx0XHR5OiAoY3Vyci55IC0gcHJldi55KSAvIHRpbWVcblxuXHRcdHZlbG9jaXR5LnggPSAwIGlmIHZlbG9jaXR5LnggaXMgSW5maW5pdHlcblx0XHR2ZWxvY2l0eS55ID0gMCBpZiB2ZWxvY2l0eS55IGlzIEluZmluaXR5XG5cblx0XHR2ZWxvY2l0eVxuXG5cdF91cGRhdGVQb3NpdGlvbjogKGV2ZW50KSA9PlxuXG5cdFx0aWYgQGVuYWJsZWQgaXMgZmFsc2Vcblx0XHRcdHJldHVyblxuXG5cdFx0QGVtaXQgRXZlbnRzLkRyYWdNb3ZlLCBldmVudFxuXG5cdFx0dG91Y2hFdmVudCA9IEV2ZW50cy50b3VjaEV2ZW50IGV2ZW50XG5cblx0XHRkZWx0YSA9XG5cdFx0XHR4OiB0b3VjaEV2ZW50LmNsaWVudFggLSBAX3N0YXJ0Lnhcblx0XHRcdHk6IHRvdWNoRXZlbnQuY2xpZW50WSAtIEBfc3RhcnQueVxuXG5cdFx0IyBDb3JyZWN0IGZvciBjdXJyZW50IGRyYWcgc3BlZWRcblx0XHRjb3JyZWN0ZWREZWx0YSA9XG5cdFx0XHR4OiBkZWx0YS54ICogQHNwZWVkWFxuXHRcdFx0eTogZGVsdGEueSAqIEBzcGVlZFlcblx0XHRcdHQ6IGV2ZW50LnRpbWVTdGFtcFxuXG5cdFx0IyBXZSB1c2UgdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZSB0byB1cGRhdGUgdGhlIHBvc2l0aW9uXG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9PlxuXHRcdFx0QGxheWVyLnggPSBAX3N0YXJ0LnggKyBjb3JyZWN0ZWREZWx0YS54IC0gQF9vZmZzZXQueFxuXHRcdFx0QGxheWVyLnkgPSBAX3N0YXJ0LnkgKyBjb3JyZWN0ZWREZWx0YS55IC0gQF9vZmZzZXQueVxuXG5cdFx0QF9kZWx0YXMucHVzaCBjb3JyZWN0ZWREZWx0YVxuXG5cdFx0QGVtaXQgRXZlbnRzLkRyYWdNb3ZlLCBldmVudFxuXG5cdF90b3VjaFN0YXJ0OiAoZXZlbnQpID0+XG5cblx0XHRAbGF5ZXIuYW5pbWF0ZVN0b3AoKVxuXG5cdFx0QF9pc0RyYWdnaW5nID0gdHJ1ZVxuXG5cdFx0dG91Y2hFdmVudCA9IEV2ZW50cy50b3VjaEV2ZW50IGV2ZW50XG5cblx0XHRAX3N0YXJ0ID1cblx0XHRcdHg6IHRvdWNoRXZlbnQuY2xpZW50WFxuXHRcdFx0eTogdG91Y2hFdmVudC5jbGllbnRZXG5cblx0XHRAX29mZnNldCA9XG5cdFx0XHR4OiB0b3VjaEV2ZW50LmNsaWVudFggLSBAbGF5ZXIueFxuXHRcdFx0eTogdG91Y2hFdmVudC5jbGllbnRZIC0gQGxheWVyLnlcblxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgRXZlbnRzLlRvdWNoTW92ZSwgQF91cGRhdGVQb3NpdGlvblxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgRXZlbnRzLlRvdWNoRW5kLCBAX3RvdWNoRW5kXG5cblx0XHRAZW1pdCBFdmVudHMuRHJhZ1N0YXJ0LCBldmVudFxuXG5cdF90b3VjaEVuZDogKGV2ZW50KSA9PlxuXG5cdFx0QF9pc0RyYWdnaW5nID0gZmFsc2VcblxuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgRXZlbnRzLlRvdWNoTW92ZSwgQF91cGRhdGVQb3NpdGlvblxuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgRXZlbnRzLlRvdWNoRW5kLCBAX3RvdWNoRW5kXG5cblx0XHRAZW1pdCBFdmVudHMuRHJhZ0VuZCwgZXZlbnRcblxuXHRcdEBfZGVsdGFzID0gW10iLCJ7X30gPSByZXF1aXJlIFwiLi9VbmRlcnNjb3JlXCJcblxue0V2ZW50c30gPSByZXF1aXJlIFwiLi9FdmVudHNcIlxue0Jhc2VDbGFzc30gPSByZXF1aXJlIFwiLi9CYXNlQ2xhc3NcIlxue0RlZmF1bHRzfSA9IHJlcXVpcmUgXCIuL0RlZmF1bHRzXCJcblxuTGF5ZXJTdGF0ZXNJZ25vcmVkS2V5cyA9IFtcImlnbm9yZUV2ZW50c1wiXVxuXG4jIEFuaW1hdGlvbiBldmVudHNcbkV2ZW50cy5TdGF0ZVdpbGxTd2l0Y2ggPSBcIndpbGxTd2l0Y2hcIlxuRXZlbnRzLlN0YXRlRGlkU3dpdGNoID0gXCJkaWRTd2l0Y2hcIlxuXG5jbGFzcyBleHBvcnRzLkxheWVyU3RhdGVzIGV4dGVuZHMgQmFzZUNsYXNzXG5cblx0Y29uc3RydWN0b3I6IChAbGF5ZXIpIC0+XG5cblx0XHRAX3N0YXRlcyA9IHt9XG5cdFx0QF9vcmRlcmVkU3RhdGVzID0gW11cblxuXHRcdEBhbmltYXRpb25PcHRpb25zID0ge31cblxuXHRcdCMgQWx3YXlzIGFkZCB0aGUgZGVmYXVsdCBzdGF0ZSBhcyB0aGUgY3VycmVudFxuXHRcdEBhZGQgXCJkZWZhdWx0XCIsIEBsYXllci5wcm9wZXJ0aWVzXG5cblx0XHRAX2N1cnJlbnRTdGF0ZSA9IFwiZGVmYXVsdFwiXG5cdFx0QF9wcmV2aW91c1N0YXRlcyA9IFtdXG5cblx0XHRzdXBlclxuXG5cdGFkZDogKHN0YXRlTmFtZSwgcHJvcGVydGllcykgLT5cblxuXHRcdCMgV2UgYWxzbyBhbGxvdyBhbiBvYmplY3Qgd2l0aCBzdGF0ZXMgdG8gYmUgcGFzc2VkIGluXG5cdFx0IyBsaWtlOiBsYXllci5zdGF0ZXMuYWRkKHtzdGF0ZUE6IHsuLi59LCBzdGF0ZUI6IHsuLi59fSlcblx0XHRpZiBfLmlzT2JqZWN0IHN0YXRlTmFtZVxuXHRcdFx0Zm9yIGssIHYgb2Ygc3RhdGVOYW1lXG5cdFx0XHRcdEBhZGQgaywgdlxuXHRcdFx0cmV0dXJuXG5cblx0XHRlcnJvciA9IC0+IHRocm93IEVycm9yIFwiVXNhZ2UgZXhhbXBsZTogbGF5ZXIuc3RhdGVzLmFkZChcXFwic29tZU5hbWVcXFwiLCB7eDo1MDB9KVwiXG5cdFx0ZXJyb3IoKSBpZiBub3QgXy5pc1N0cmluZyBzdGF0ZU5hbWVcblx0XHRlcnJvcigpIGlmIG5vdCBfLmlzT2JqZWN0IHByb3BlcnRpZXNcblxuXHRcdCMgQWRkIGEgc3RhdGUgd2l0aCBhIG5hbWUgYW5kIHByb3BlcnRpZXNcblx0XHRAX29yZGVyZWRTdGF0ZXMucHVzaCBzdGF0ZU5hbWVcblx0XHRAX3N0YXRlc1tzdGF0ZU5hbWVdID0gcHJvcGVydGllc1xuXG5cdHJlbW92ZTogKHN0YXRlTmFtZSkgLT5cblxuXHRcdGlmIG5vdCBAX3N0YXRlcy5oYXNPd25Qcm9wZXJ0eSBzdGF0ZU5hbWVcblx0XHRcdHJldHVyblxuXG5cdFx0ZGVsZXRlIEBfc3RhdGVzW3N0YXRlTmFtZV1cblx0XHRAX29yZGVyZWRTdGF0ZXMgPSBfLndpdGhvdXQgQF9vcmRlcmVkU3RhdGVzLCBzdGF0ZU5hbWVcblxuXHRzd2l0Y2g6IChzdGF0ZU5hbWUsIGFuaW1hdGlvbk9wdGlvbnMsIGluc3RhbnQ9ZmFsc2UpIC0+XG5cblx0XHQjIFN3aXRjaGVzIHRvIGEgc3BlY2lmaWMgc3RhdGUuIElmIGFuaW1hdGlvbk9wdGlvbnMgYXJlXG5cdFx0IyBnaXZlbiB1c2UgdGhvc2UsIG90aGVyd2lzZSB0aGUgZGVmYXVsdCBvcHRpb25zLlxuXG5cdFx0IyBXZSBhY3R1YWxseSBkbyB3YW50IHRvIGFsbG93IHRoaXMuIEEgc3RhdGUgY2FuIGJlIHNldCB0byBzb21ldGhpbmdcblx0XHQjIHRoYXQgZG9lcyBub3QgZXF1YWwgdGhlIHByb3BlcnR5IHZhbHVlcyBmb3IgdGhhdCBzdGF0ZS5cblxuXHRcdCMgaWYgc3RhdGVOYW1lIGlzIEBfY3VycmVudFN0YXRlXG5cdFx0IyBcdHJldHVyblxuXG5cdFx0aWYgbm90IEBfc3RhdGVzLmhhc093blByb3BlcnR5IHN0YXRlTmFtZVxuXHRcdFx0dGhyb3cgRXJyb3IgXCJObyBzdWNoIHN0YXRlOiAnI3tzdGF0ZU5hbWV9J1wiXG5cblx0XHRAZW1pdCBFdmVudHMuU3RhdGVXaWxsU3dpdGNoLCBAX2N1cnJlbnRTdGF0ZSwgc3RhdGVOYW1lLCBAXG5cblx0XHRAX3ByZXZpb3VzU3RhdGVzLnB1c2ggQF9jdXJyZW50U3RhdGVcblx0XHRAX2N1cnJlbnRTdGF0ZSA9IHN0YXRlTmFtZVxuXG5cdFx0cHJvcGVydGllcyA9IHt9XG5cdFx0YW5pbWF0aW5nS2V5cyA9IEBhbmltYXRpbmdLZXlzKClcblxuXHRcdGZvciBwcm9wZXJ0eU5hbWUsIHZhbHVlIG9mIEBfc3RhdGVzW3N0YXRlTmFtZV1cblxuXHRcdFx0IyBEb24ndCBhbmltYXRlIGlnbm9yZWQgcHJvcGVydGllc1xuXHRcdFx0aWYgcHJvcGVydHlOYW1lIGluIExheWVyU3RhdGVzSWdub3JlZEtleXNcblx0XHRcdFx0Y29udGludWVcblxuXHRcdFx0aWYgcHJvcGVydHlOYW1lIG5vdCBpbiBhbmltYXRpbmdLZXlzXG5cdFx0XHRcdGNvbnRpbnVlXG5cblx0XHRcdCMgQWxsb3cgZHluYW1pYyBwcm9wZXJ0aWVzIGFzIGZ1bmN0aW9uc1xuXHRcdFx0dmFsdWUgPSB2YWx1ZS5jYWxsKEBsYXllciwgQGxheWVyLCBzdGF0ZU5hbWUpIGlmIF8uaXNGdW5jdGlvbih2YWx1ZSlcblxuXHRcdFx0IyBTZXQgdGhlIG5ldyB2YWx1ZSBcblx0XHRcdHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlXG5cblx0XHRpZiBpbnN0YW50IGlzIHRydWVcblx0XHRcdCMgV2Ugd2FudCB0byBzd2l0Y2ggaW1tZWRpYXRlbHkgd2l0aG91dCBhbmltYXRpb25cblx0XHRcdEBsYXllci5wcm9wZXJ0aWVzID0gcHJvcGVydGllc1xuXHRcdFx0QGVtaXQgRXZlbnRzLlN0YXRlRGlkU3dpdGNoLCBfLmxhc3QoQF9wcmV2aW91c1N0YXRlcyksIHN0YXRlTmFtZSwgQFxuXG5cdFx0ZWxzZVxuXHRcdFx0IyBTdGFydCB0aGUgYW5pbWF0aW9uIGFuZCB1cGRhdGUgdGhlIHN0YXRlIHdoZW4gZmluaXNoZWRcblx0XHRcdGFuaW1hdGlvbk9wdGlvbnMgPz0gQGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdGFuaW1hdGlvbk9wdGlvbnMucHJvcGVydGllcyA9IHByb3BlcnRpZXNcblxuXHRcdFx0QF9hbmltYXRpb24gPSBAbGF5ZXIuYW5pbWF0ZSBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRAX2FuaW1hdGlvbi5vbiBcInN0b3BcIiwgPT4gXG5cdFx0XHRcdEBlbWl0IEV2ZW50cy5TdGF0ZURpZFN3aXRjaCwgXy5sYXN0KEBfcHJldmlvdXNTdGF0ZXMpLCBzdGF0ZU5hbWUsIEBcblxuXG5cdHN3aXRjaEluc3RhbnQ6IChzdGF0ZU5hbWUpIC0+XG5cdFx0QHN3aXRjaCBzdGF0ZU5hbWUsIG51bGwsIHRydWVcblxuXHRAZGVmaW5lIFwic3RhdGVcIiwgZ2V0OiAtPiBAX2N1cnJlbnRTdGF0ZVxuXHRAZGVmaW5lIFwiY3VycmVudFwiLCBnZXQ6IC0+IEBfY3VycmVudFN0YXRlXG5cblx0c3RhdGVzOiAtPlxuXHRcdCMgUmV0dXJuIGEgbGlzdCBvZiBhbGwgdGhlIHBvc3NpYmxlIHN0YXRlc1xuXHRcdF8uY2xvbmUgQF9vcmRlcmVkU3RhdGVzXG5cblx0YW5pbWF0aW5nS2V5czogLT5cblxuXHRcdGtleXMgPSBbXVxuXG5cdFx0Zm9yIHN0YXRlTmFtZSwgc3RhdGUgb2YgQF9zdGF0ZXNcblx0XHRcdGNvbnRpbnVlIGlmIHN0YXRlTmFtZSBpcyBcImRlZmF1bHRcIlxuXHRcdFx0a2V5cyA9IF8udW5pb24ga2V5cywgXy5rZXlzIHN0YXRlXG5cblx0XHRrZXlzXG5cblx0cHJldmlvdXM6IChzdGF0ZXMsIGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0IyBHbyB0byBwcmV2aW91cyBzdGF0ZSBpbiBsaXN0XG5cdFx0c3RhdGVzID89IEBzdGF0ZXMoKVxuXHRcdEBzd2l0Y2ggVXRpbHMuYXJyYXlQcmV2KHN0YXRlcywgQF9jdXJyZW50U3RhdGUpLCBhbmltYXRpb25PcHRpb25zXG5cblx0bmV4dDogIC0+XG5cdFx0IyBUT0RPOiBtYXliZSBhZGQgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdHN0YXRlcyA9IFV0aWxzLmFycmF5RnJvbUFyZ3VtZW50cyBhcmd1bWVudHNcblxuXHRcdGlmIG5vdCBzdGF0ZXMubGVuZ3RoXG5cdFx0XHRzdGF0ZXMgPSBAc3RhdGVzKClcblxuXHRcdEBzd2l0Y2ggVXRpbHMuYXJyYXlOZXh0KHN0YXRlcywgQF9jdXJyZW50U3RhdGUpXG5cblxuXHRsYXN0OiAoYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHQjIFJldHVybiB0byBsYXN0IHN0YXRlXG5cdFx0QHN3aXRjaCBfLmxhc3QoQF9wcmV2aW91c1N0YXRlcyksIGFuaW1hdGlvbk9wdGlvbnNcbiIsImZpbHRlckZvcm1hdCA9ICh2YWx1ZSwgdW5pdCkgLT5cblx0XCIje1V0aWxzLnJvdW5kIHZhbHVlLCAyfSN7dW5pdH1cIlxuXHQjIFwiI3t2YWx1ZX0je3VuaXR9XCJcblxuIyBUT0RPOiBJZGVhbGx5IHRoZXNlIHNob3VsZCBiZSByZWFkIG91dCBmcm9tIHRoZSBsYXllciBkZWZpbmVkIHByb3BlcnRpZXNcbl9XZWJraXRQcm9wZXJ0aWVzID0gW1xuXHRbXCJibHVyXCIsIFwiYmx1clwiLCAwLCBcInB4XCJdLFxuXHRbXCJicmlnaHRuZXNzXCIsIFwiYnJpZ2h0bmVzc1wiLCAxMDAsIFwiJVwiXSxcblx0W1wic2F0dXJhdGVcIiwgXCJzYXR1cmF0ZVwiLCAxMDAsIFwiJVwiXSxcblx0W1wiaHVlLXJvdGF0ZVwiLCBcImh1ZVJvdGF0ZVwiLCAwLCBcImRlZ1wiXSxcblx0W1wiY29udHJhc3RcIiwgXCJjb250cmFzdFwiLCAxMDAsIFwiJVwiXSxcblx0W1wiaW52ZXJ0XCIsIFwiaW52ZXJ0XCIsIDAsIFwiJVwiXSxcblx0W1wiZ3JheXNjYWxlXCIsIFwiZ3JheXNjYWxlXCIsIDAsIFwiJVwiXSxcblx0W1wic2VwaWFcIiwgXCJzZXBpYVwiLCAwLCBcIiVcIl0sXG5dXG5cbmV4cG9ydHMuTGF5ZXJTdHlsZSA9XG5cblx0d2lkdGg6IChsYXllcikgLT5cblx0XHRsYXllci53aWR0aCArIFwicHhcIlxuXHRcblx0aGVpZ2h0OiAobGF5ZXIpIC0+XG5cdFx0bGF5ZXIuaGVpZ2h0ICsgXCJweFwiXG5cblx0ZGlzcGxheTogKGxheWVyKSAtPlxuXHRcdGlmIGxheWVyLnZpc2libGUgaXMgdHJ1ZVxuXHRcdFx0cmV0dXJuIFwiYmxvY2tcIlxuXHRcdHJldHVybiBcIm5vbmVcIlxuXG5cdG9wYWNpdHk6IChsYXllcikgLT5cblx0XHRsYXllci5vcGFjaXR5XG5cblx0b3ZlcmZsb3c6IChsYXllcikgLT5cblx0XHRpZiBsYXllci5zY3JvbGxIb3Jpem9udGFsIGlzIHRydWUgb3IgbGF5ZXIuc2Nyb2xsVmVydGljYWwgaXMgdHJ1ZVxuXHRcdFx0cmV0dXJuIFwiYXV0b1wiXG5cdFx0aWYgbGF5ZXIuY2xpcCBpcyB0cnVlXG5cdFx0XHRyZXR1cm4gXCJoaWRkZW5cIlxuXHRcdHJldHVybiBcInZpc2libGVcIlxuXG5cdG92ZXJmbG93WDogKGxheWVyKSAtPlxuXHRcdGlmIGxheWVyLnNjcm9sbEhvcml6b250YWwgaXMgdHJ1ZVxuXHRcdFx0cmV0dXJuIFwic2Nyb2xsXCJcblx0XHRpZiBsYXllci5jbGlwIGlzIHRydWVcblx0XHRcdHJldHVybiBcImhpZGRlblwiXG5cdFx0cmV0dXJuIFwidmlzaWJsZVwiXG5cblx0b3ZlcmZsb3dZOiAobGF5ZXIpIC0+XG5cdFx0aWYgbGF5ZXIuc2Nyb2xsVmVydGljYWwgaXMgdHJ1ZVxuXHRcdFx0cmV0dXJuIFwic2Nyb2xsXCJcblx0XHRpZiBsYXllci5jbGlwIGlzIHRydWVcblx0XHRcdHJldHVybiBcImhpZGRlblwiXG5cdFx0cmV0dXJuIFwidmlzaWJsZVwiXG5cblx0ekluZGV4OiAobGF5ZXIpIC0+XG5cdFx0bGF5ZXIuaW5kZXhcblxuXHR3ZWJraXRGaWx0ZXI6IChsYXllcikgLT5cblxuXHRcdCMgVGhpcyBpcyBtb3N0bHkgYW4gb3B0aW1pemF0aW9uIGZvciBDaHJvbWUuIElmIHlvdSBwYXNzIGluIHRoZSB3ZWJraXQgZmlsdGVyc1xuXHRcdCMgd2l0aCB0aGUgZGVmYXVsdHMsIGl0IHN0aWxsIHRha2VzIGEgc2hpdHR5IHJlbmRlcmluZyBwYXRoLiBTbyBJIGNvbXBhcmUgdGhlbVxuXHRcdCMgZmlyc3QgYW5kIG9ubHkgYWRkIHRoZSBvbmVzIHRoYXQgaGF2ZSBhIG5vbiBkZWZhdWx0IHZhbHVlLlxuXG5cdFx0Y3NzID0gW11cblxuXHRcdGZvciBbY3NzTmFtZSwgbGF5ZXJOYW1lLCBmYWxsYmFjaywgdW5pdF0gaW4gX1dlYmtpdFByb3BlcnRpZXNcblx0XHRcdGlmIGxheWVyW2xheWVyTmFtZV0gIT0gZmFsbGJhY2tcblx0XHRcdFx0Y3NzLnB1c2ggXCIje2Nzc05hbWV9KCN7ZmlsdGVyRm9ybWF0IGxheWVyW2xheWVyTmFtZV0sIHVuaXR9KVwiXG5cblx0XHRyZXR1cm4gY3NzLmpvaW4oXCIgXCIpXG5cblx0XHQjIFRoaXMgaXMgaG93IEkgdXNlZCB0byBkbyBpdCBiZWZvcmUsIGFuZCBpdCB3b3JrcyB3ZWxsIGluIFNhZmFyaVxuXHRcdFxuXHRcdCMgXCJcblx0XHQjIGJsdXIoI3tmaWx0ZXJGb3JtYXQgbGF5ZXIuYmx1ciwgXCJweFwifSkgXG5cdFx0IyBicmlnaHRuZXNzKCN7ZmlsdGVyRm9ybWF0IGxheWVyLmJyaWdodG5lc3MsIFwiJVwifSkgXG5cdFx0IyBzYXR1cmF0ZSgje2ZpbHRlckZvcm1hdCBsYXllci5zYXR1cmF0ZSwgXCIlXCJ9KSBcblx0XHQjIGh1ZS1yb3RhdGUoI3tmaWx0ZXJGb3JtYXQgbGF5ZXIuaHVlUm90YXRlLCBcImRlZ1wifSkgXG5cdFx0IyBjb250cmFzdCgje2ZpbHRlckZvcm1hdCBsYXllci5jb250cmFzdCwgXCIlXCJ9KSBcblx0XHQjIGludmVydCgje2ZpbHRlckZvcm1hdCBsYXllci5pbnZlcnQsIFwiJVwifSkgXG5cdFx0IyBncmF5c2NhbGUoI3tmaWx0ZXJGb3JtYXQgbGF5ZXIuZ3JheXNjYWxlLCBcIiVcIn0pIFxuXHRcdCMgc2VwaWEoI3tmaWx0ZXJGb3JtYXQgbGF5ZXIuc2VwaWEsIFwiJVwifSlcblx0XHQjIFwiXG5cblx0d2Via2l0VHJhbnNmb3JtOiAobGF5ZXIpIC0+XG5cdFx0IyBUT0RPOiBPbiBDaHJvbWUgaXQgc2VlbXMgdGhhdCBhZGRpbmcgYW55IG90aGVyIHRyYW5zZm9ybSBwcm9wZXJ0eVxuXHRcdCMgdG9nZXRoZXIgd2l0aCBhIGJsdXIsIGl0IGJyZWFrcyB0aGUgYmx1ciBhbmQgcGVyZm9ybWFuY2UuIEknbGwganVzdFxuXHRcdCMgd2FpdCBmb3IgdGhlIENocm9tZSBndXlzIHRvIGZpeCB0aGlzIEkgZ3Vlc3MuXG5cdFx0XCJcblx0XHR0cmFuc2xhdGUzZCgje2xheWVyLnh9cHgsI3tsYXllci55fXB4LCN7bGF5ZXIuen1weCkgXG5cdFx0c2NhbGUoI3tsYXllci5zY2FsZX0pXG5cdFx0c2NhbGUzZCgje2xheWVyLnNjYWxlWH0sI3tsYXllci5zY2FsZVl9LCN7bGF5ZXIuc2NhbGVafSkgXG5cdFx0cm90YXRlWCgje2xheWVyLnJvdGF0aW9uWH1kZWcpIFxuXHRcdHJvdGF0ZVkoI3tsYXllci5yb3RhdGlvbll9ZGVnKSBcblx0XHRyb3RhdGVaKCN7bGF5ZXIucm90YXRpb25afWRlZykgXG5cdFx0XCJcblxuXHR3ZWJraXRUcmFuc2Zvcm1PcmlnaW46IChsYXllcikgLT5cblx0XHRcIiN7bGF5ZXIub3JpZ2luWCAqIDEwMH0lICN7bGF5ZXIub3JpZ2luWSAqIDEwMH0lXCJcblxuXHRcdCMgVG9kbzogT3JpZ2luIHogaXMgaW4gcGl4ZWxzLiBJIG5lZWQgdG8gcmVhZCB1cCBvbiB0aGlzLlxuXHRcdCMgXCIje2xheWVyLm9yaWdpblggKiAxMDB9JSAje2xheWVyLm9yaWdpblkgKiAxMDB9JSAje2xheWVyLm9yaWdpblogKiAxMDB9JVwiXG5cblx0cG9pbnRlckV2ZW50czogKGxheWVyKSAtPlxuXHRcdGlmIGxheWVyLmlnbm9yZUV2ZW50c1xuXHRcdFx0cmV0dXJuIFwibm9uZVwiXG5cdFx0XCJhdXRvXCJcblxuXG5cdCMgY3NzOiAtPlxuXHQjIFx0Y3NzID0ge31cblx0IyBcdGZvciBrLCB2IG9mIGV4cG9ydHMuTGF5ZXJTdHlsZSBsYXllclxuXHQjIFx0XHRpZiBrIGlzbnQgXCJjc3NcIlxuXHQjIFx0XHRcdGNzc1trXSA9IHYoKVxuXHQjIFx0Y3NzXG5cblxuXG5cbiIsIiMgVGhpcyBhbGxvd3MgdXMgdG8gc3dpdGNoIG91dCB0aGUgdW5kZXJzY29yZSB1dGlsaXR5IGxpYnJhcnlcblxuXyA9IHJlcXVpcmUgXCJsb2Rhc2hcIlxuXG5fLnN0ciA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUuc3RyaW5nJ1xuXy5taXhpbiBfLnN0ci5leHBvcnRzKClcblxuXy5pc0Jvb2wgPSAodikgLT4gdHlwZW9mIHYgPT0gJ2Jvb2xlYW4nXG5cbmV4cG9ydHMuXyA9IF9cbiIsIiMgVXRpbHMubG9nID0gLT5cbiMgXHRjb25zb2xlLmxvZyBhcmd1bWVudHMuam9pbiBcIiBcIlxuXG57X30gPSByZXF1aXJlIFwiLi9VbmRlcnNjb3JlXCJcblxuVXRpbHMgPSB7fVxuXG5VdGlscy5zZXREZWZhdWx0UHJvcGVydGllcyA9IChvYmosIGRlZmF1bHRzLCB3YXJuPXRydWUpIC0+XG5cblx0cmVzdWx0ID0ge31cblxuXHRmb3IgaywgdiBvZiBkZWZhdWx0c1xuXHRcdGlmIG9iai5oYXNPd25Qcm9wZXJ0eSBrXG5cdFx0XHRyZXN1bHRba10gPSBvYmpba11cblx0XHRlbHNlXG5cdFx0XHRyZXN1bHRba10gPSBkZWZhdWx0c1trXVxuXG5cdGlmIHdhcm5cblx0XHRmb3IgaywgdiBvZiBvYmpcblx0XHRcdGlmIG5vdCBkZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eSBrXG5cdFx0XHRcdGNvbnNvbGUud2FybiBcIlV0aWxzLnNldERlZmF1bHRQcm9wZXJ0aWVzOiBnb3QgdW5leHBlY3RlZCBvcHRpb246ICcje2t9IC0+ICN7dn0nXCIsIG9ialxuXG5cdHJlc3VsdFxuXG5VdGlscy52YWx1ZU9yRGVmYXVsdCA9ICh2YWx1ZSwgZGVmYXVsdFZhbHVlKSAtPlxuXG5cdGlmIHZhbHVlIGluIFt1bmRlZmluZWQsIG51bGxdXG5cdFx0dmFsdWUgPSBkZWZhdWx0VmFsdWVcblxuXHRyZXR1cm4gdmFsdWVcblxuVXRpbHMuYXJyYXlUb09iamVjdCA9IChhcnIpIC0+XG5cdG9iaiA9IHt9XG5cblx0Zm9yIGl0ZW0gaW4gYXJyXG5cdFx0b2JqW2l0ZW1bMF1dID0gaXRlbVsxXVxuXG5cdG9ialxuXG5VdGlscy5hcnJheU5leHQgPSAoYXJyLCBpdGVtKSAtPlxuXHRhcnJbYXJyLmluZGV4T2YoaXRlbSkgKyAxXSBvciBfLmZpcnN0IGFyclxuXG5VdGlscy5hcnJheVByZXYgPSAoYXJyLCBpdGVtKSAtPlxuXHRhcnJbYXJyLmluZGV4T2YoaXRlbSkgLSAxXSBvciBfLmxhc3QgYXJyXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jIEFOSU1BVElPTlxuXG4jIFRoaXMgaXMgYSBsaXR0bGUgaGFja3ksIGJ1dCBJIHdhbnQgdG8gYXZvaWQgd3JhcHBpbmcgdGhlIGZ1bmN0aW9uXG4jIGluIGFub3RoZXIgb25lIGFzIGl0IGdldHMgY2FsbGVkIGF0IDYwIGZwcy4gU28gd2UgbWFrZSBpdCBhIGdsb2JhbC5cbndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPz0gd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxud2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA/PSAoZikgLT4gVXRpbHMuZGVsYXkgMS82MCwgZlxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgVElNRSBGVU5DVElPTlNcblxuIyBOb3RlOiBpbiBGcmFtZXIgMyB3ZSB0cnkgdG8ga2VlcCBhbGwgdGltZXMgaW4gc2Vjb25kc1xuXG4jIFVzZWQgYnkgYW5pbWF0aW9uIGVuZ2luZSwgbmVlZHMgdG8gYmUgdmVyeSBwZXJmb3JtYW50XG5VdGlscy5nZXRUaW1lID0gLT4gRGF0ZS5ub3coKSAvIDEwMDBcblxuIyBUaGlzIHdvcmtzIG9ubHkgaW4gY2hyb21lLCBidXQgd2Ugb25seSB1c2UgaXQgZm9yIHRlc3RpbmdcbiMgaWYgd2luZG93LnBlcmZvcm1hbmNlXG4jIFx0VXRpbHMuZ2V0VGltZSA9IC0+IHBlcmZvcm1hbmNlLm5vdygpIC8gMTAwMFxuXG5VdGlscy5kZWxheSA9ICh0aW1lLCBmKSAtPlxuXHR0aW1lciA9IHNldFRpbWVvdXQgZiwgdGltZSAqIDEwMDBcblx0IyB3aW5kb3cuX2RlbGF5VGltZXJzID89IFtdXG5cdCMgd2luZG93Ll9kZWxheVRpbWVycy5wdXNoIHRpbWVyXG5cdHJldHVybiB0aW1lclxuXHRcblV0aWxzLmludGVydmFsID0gKHRpbWUsIGYpIC0+XG5cdHRpbWVyID0gc2V0SW50ZXJ2YWwgZiwgdGltZSAqIDEwMDBcblx0IyB3aW5kb3cuX2RlbGF5SW50ZXJ2YWxzID89IFtdXG5cdCMgd2luZG93Ll9kZWxheUludGVydmFscy5wdXNoIHRpbWVyXG5cdHJldHVybiB0aW1lclxuXG5VdGlscy5kZWJvdW5jZSA9ICh0aHJlc2hvbGQ9MC4xLCBmbiwgaW1tZWRpYXRlKSAtPlxuXHR0aW1lb3V0ID0gbnVsbFxuXHR0aHJlc2hvbGQgKj0gMTAwMFxuXHQoYXJncy4uLikgLT5cblx0XHRvYmogPSB0aGlzXG5cdFx0ZGVsYXllZCA9IC0+XG5cdFx0XHRmbi5hcHBseShvYmosIGFyZ3MpIHVubGVzcyBpbW1lZGlhdGVcblx0XHRcdHRpbWVvdXQgPSBudWxsXG5cdFx0aWYgdGltZW91dFxuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpXG5cdFx0ZWxzZSBpZiAoaW1tZWRpYXRlKVxuXHRcdFx0Zm4uYXBwbHkob2JqLCBhcmdzKVxuXHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0IGRlbGF5ZWQsIHRocmVzaG9sZFxuXG5VdGlscy50aHJvdHRsZSA9IChkZWxheSwgZm4pIC0+XG5cdHJldHVybiBmbiBpZiBkZWxheSBpcyAwXG5cdGRlbGF5ICo9IDEwMDBcblx0dGltZXIgPSBmYWxzZVxuXHRyZXR1cm4gLT5cblx0XHRyZXR1cm4gaWYgdGltZXJcblx0XHR0aW1lciA9IHRydWVcblx0XHRzZXRUaW1lb3V0ICgtPiB0aW1lciA9IGZhbHNlKSwgZGVsYXkgdW5sZXNzIGRlbGF5IGlzIC0xXG5cdFx0Zm4gYXJndW1lbnRzLi4uXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jIEhBTkRZIEZVTkNUSU9OU1xuXG5VdGlscy5yYW5kb21Db2xvciA9IChhbHBoYSA9IDEuMCkgLT5cblx0YyA9IC0+IHBhcnNlSW50KE1hdGgucmFuZG9tKCkgKiAyNTUpXG5cdFwicmdiYSgje2MoKX0sICN7YygpfSwgI3tjKCl9LCAje2FscGhhfSlcIlxuXG5VdGlscy5yYW5kb21DaG9pY2UgPSAoYXJyKSAtPlxuXHRhcnJbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCldXG5cblV0aWxzLnJhbmRvbU51bWJlciA9IChhPTAsIGI9MSkgLT5cblx0IyBSZXR1cm4gYSByYW5kb20gbnVtYmVyIGJldHdlZW4gYSBhbmQgYlxuXHRVdGlscy5tYXBSYW5nZSBNYXRoLnJhbmRvbSgpLCAwLCAxLCBhLCBiXG5cblV0aWxzLmxhYmVsTGF5ZXIgPSAobGF5ZXIsIHRleHQsIHN0eWxlPXt9KSAtPlxuXHRcblx0c3R5bGUgPSBfLmV4dGVuZFxuXHRcdGZvbnQ6IFwiMTBweC8xZW0gTWVubG9cIlxuXHRcdGxpbmVIZWlnaHQ6IFwiI3tsYXllci5oZWlnaHR9cHhcIlxuXHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIlxuXHRcdGNvbG9yOiBcIiNmZmZcIlxuXHQsIHN0eWxlXG5cblx0bGF5ZXIuc3R5bGUgPSBzdHlsZVxuXHRsYXllci5odG1sID0gdGV4dFxuXG5VdGlscy51dWlkID0gLT5cblxuXHRjaGFycyA9IFwiMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCIuc3BsaXQoXCJcIilcblx0b3V0cHV0ID0gbmV3IEFycmF5KDM2KVxuXHRyYW5kb20gPSAwXG5cblx0Zm9yIGRpZ2l0IGluIFsxLi4zMl1cblx0XHRyYW5kb20gPSAweDIwMDAwMDAgKyAoTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMCkgfCAwIGlmIChyYW5kb20gPD0gMHgwMilcblx0XHRyID0gcmFuZG9tICYgMHhmXG5cdFx0cmFuZG9tID0gcmFuZG9tID4+IDRcblx0XHRvdXRwdXRbZGlnaXRdID0gY2hhcnNbaWYgZGlnaXQgPT0gMTkgdGhlbiAociAmIDB4MykgfCAweDggZWxzZSByXVxuXG5cdG91dHB1dC5qb2luIFwiXCJcblxuVXRpbHMuYXJyYXlGcm9tQXJndW1lbnRzID0gKGFyZ3MpIC0+XG5cblx0IyBDb252ZXJ0IGFuIGFyZ3VtZW50cyBvYmplY3QgdG8gYW4gYXJyYXlcblx0XG5cdGlmIF8uaXNBcnJheSBhcmdzWzBdXG5cdFx0cmV0dXJuIGFyZ3NbMF1cblx0XG5cdEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsIGFyZ3NcblxuVXRpbHMuY3ljbGUgPSAtPlxuXHRcblx0IyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjeWNsZXMgdGhyb3VnaCBhIGxpc3Qgb2YgdmFsdWVzIHdpdGggZWFjaCBjYWxsLlxuXHRcblx0YXJncyA9IFV0aWxzLmFycmF5RnJvbUFyZ3VtZW50cyBhcmd1bWVudHNcblx0XG5cdGN1cnIgPSAtMVxuXHRyZXR1cm4gLT5cblx0XHRjdXJyKytcblx0XHRjdXJyID0gMCBpZiBjdXJyID49IGFyZ3MubGVuZ3RoXG5cdFx0cmV0dXJuIGFyZ3NbY3Vycl1cblxuIyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuVXRpbHMudG9nZ2xlID0gVXRpbHMuY3ljbGVcblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgRU5WSVJPTUVOVCBGVU5DVElPTlNcblxuVXRpbHMuaXNXZWJLaXQgPSAtPlxuXHR3aW5kb3cuV2ViS2l0Q1NTTWF0cml4IGlzbnQgbnVsbFxuXHRcblV0aWxzLmlzVG91Y2ggPSAtPlxuXHR3aW5kb3cub250b3VjaHN0YXJ0IGlzIG51bGxcblxuVXRpbHMuaXNNb2JpbGUgPSAtPlxuXHQoL2lwaG9uZXxpcG9kfGFuZHJvaWR8aWV8YmxhY2tiZXJyeXxmZW5uZWMvKS50ZXN0IFxcXG5cdFx0bmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpXG5cblV0aWxzLmlzQ2hyb21lID0gLT5cblx0KC9jaHJvbWUvKS50ZXN0IFxcXG5cdFx0bmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpXG5cblV0aWxzLmlzTG9jYWwgPSAtPlxuXHRVdGlscy5pc0xvY2FsVXJsIHdpbmRvdy5sb2NhdGlvbi5ocmVmXG5cblV0aWxzLmlzTG9jYWxVcmwgPSAodXJsKSAtPlxuXHR1cmxbMC4uNl0gPT0gXCJmaWxlOi8vXCJcblxuVXRpbHMuZGV2aWNlUGl4ZWxSYXRpbyA9IC0+XG5cdHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvXG5cblV0aWxzLnBhdGhKb2luID0gLT5cblx0VXRpbHMuYXJyYXlGcm9tQXJndW1lbnRzKGFyZ3VtZW50cykuam9pbihcIi9cIilcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jIE1BVEggRlVOQ1RJT05TXG5cdFx0XG5VdGlscy5yb3VuZCA9ICh2YWx1ZSwgZGVjaW1hbHMpIC0+XG5cdGQgPSBNYXRoLnBvdyAxMCwgZGVjaW1hbHNcblx0TWF0aC5yb3VuZCh2YWx1ZSAqIGQpIC8gZFxuXG4jIFRha2VuIGZyb20gaHR0cDovL2pzZmlkZGxlLm5ldC9YejQ2NC83L1xuIyBVc2VkIGJ5IGFuaW1hdGlvbiBlbmdpbmUsIG5lZWRzIHRvIGJlIHZlcnkgcGVyZm9ybWFudFxuVXRpbHMubWFwUmFuZ2UgPSAodmFsdWUsIGZyb21Mb3csIGZyb21IaWdoLCB0b0xvdywgdG9IaWdoKSAtPlxuXHR0b0xvdyArICgoKHZhbHVlIC0gZnJvbUxvdykgLyAoZnJvbUhpZ2ggLSBmcm9tTG93KSkgKiAodG9IaWdoIC0gdG9Mb3cpKVxuXG4jIEtpbmQgb2Ygc2ltaWxhciBhcyBhYm92ZSBidXQgd2l0aCBhIGJldHRlciBzeW50YXggYW5kIGEgbGltaXRpbmcgb3B0aW9uXG5VdGlscy5tb2R1bGF0ZSA9ICh2YWx1ZSwgcmFuZ2VBLCByYW5nZUIsIGxpbWl0PWZhbHNlKSAtPlxuXHRcblx0W2Zyb21Mb3csIGZyb21IaWdoXSA9IHJhbmdlQVxuXHRbdG9Mb3csIHRvSGlnaF0gPSByYW5nZUJcblx0XG5cdHJlc3VsdCA9IHRvTG93ICsgKCgodmFsdWUgLSBmcm9tTG93KSAvIChmcm9tSGlnaCAtIGZyb21Mb3cpKSAqICh0b0hpZ2ggLSB0b0xvdykpXG5cblx0aWYgbGltaXQgaXMgdHJ1ZVxuXHRcdHJldHVybiB0b0xvdyBpZiByZXN1bHQgPCB0b0xvd1xuXHRcdHJldHVybiB0b0hpZ2ggaWYgcmVzdWx0ID4gdG9IaWdoXG5cblx0cmVzdWx0XG5cblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgU1RSSU5HIEZVTkNUSU9OU1xuXG5VdGlscy5wYXJzZUZ1bmN0aW9uID0gKHN0cikgLT5cblxuXHRyZXN1bHQgPSB7bmFtZTogXCJcIiwgYXJnczogW119XG5cblx0aWYgXy5lbmRzV2l0aCBzdHIsIFwiKVwiXG5cdFx0cmVzdWx0Lm5hbWUgPSBzdHIuc3BsaXQoXCIoXCIpWzBdXG5cdFx0cmVzdWx0LmFyZ3MgPSBzdHIuc3BsaXQoXCIoXCIpWzFdLnNwbGl0KFwiLFwiKS5tYXAgKGEpIC0+IF8udHJpbShfLnJ0cmltKGEsIFwiKVwiKSlcblx0ZWxzZVxuXHRcdHJlc3VsdC5uYW1lID0gc3RyXG5cblx0cmV0dXJuIHJlc3VsdFxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgRE9NIEZVTkNUSU9OU1xuXG5fX2RvbUNvbXBsZXRlID0gW11cblxuaWYgZG9jdW1lbnQ/XG5cdGRvY3VtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IChldmVudCkgPT5cblx0XHRpZiBkb2N1bWVudC5yZWFkeVN0YXRlIGlzIFwiY29tcGxldGVcIlxuXHRcdFx0d2hpbGUgX19kb21Db21wbGV0ZS5sZW5ndGhcblx0XHRcdFx0ZiA9IF9fZG9tQ29tcGxldGUuc2hpZnQoKSgpXG5cblV0aWxzLmRvbUNvbXBsZXRlID0gKGYpIC0+XG5cdGlmIGRvY3VtZW50LnJlYWR5U3RhdGUgaXMgXCJjb21wbGV0ZVwiXG5cdFx0ZigpXG5cdGVsc2Vcblx0XHRfX2RvbUNvbXBsZXRlLnB1c2ggZlxuXG5VdGlscy5kb21Db21wbGV0ZUNhbmNlbCA9IChmKSAtPlxuXHRfX2RvbUNvbXBsZXRlID0gXy53aXRob3V0IF9fZG9tQ29tcGxldGUsIGZcblxuVXRpbHMuZG9tTG9hZFNjcmlwdCA9ICh1cmwsIGNhbGxiYWNrKSAtPlxuXHRcblx0c2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcInNjcmlwdFwiXG5cdHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIlxuXHRzY3JpcHQuc3JjID0gdXJsXG5cdFxuXHRzY3JpcHQub25sb2FkID0gY2FsbGJhY2tcblx0XG5cdGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF1cblx0aGVhZC5hcHBlbmRDaGlsZCBzY3JpcHRcblx0XG5cdHNjcmlwdFxuXG5VdGlscy5kb21Mb2FkRGF0YSA9IChwYXRoLCBjYWxsYmFjaykgLT5cblxuXHRyZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuXHQjIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lciBcInByb2dyZXNzXCIsIHVwZGF0ZVByb2dyZXNzLCBmYWxzZVxuXHQjIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lciBcImFib3J0XCIsIHRyYW5zZmVyQ2FuY2VsZWQsIGZhbHNlXG5cdFxuXHRyZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIgXCJsb2FkXCIsIC0+XG5cdFx0Y2FsbGJhY2sgbnVsbCwgcmVxdWVzdC5yZXNwb25zZVRleHRcblx0LCBmYWxzZVxuXHRcblx0cmVxdWVzdC5hZGRFdmVudExpc3RlbmVyIFwiZXJyb3JcIiwgLT5cblx0XHRjYWxsYmFjayB0cnVlLCBudWxsXG5cdCwgZmFsc2VcblxuXHRyZXF1ZXN0Lm9wZW4gXCJHRVRcIiwgcGF0aCwgdHJ1ZVxuXHRyZXF1ZXN0LnNlbmQgbnVsbFxuXG5VdGlscy5kb21Mb2FkSlNPTiA9IChwYXRoLCBjYWxsYmFjaykgLT5cblx0VXRpbHMuZG9tTG9hZERhdGEgcGF0aCwgKGVyciwgZGF0YSkgLT5cblx0XHRjYWxsYmFjayBlcnIsIEpTT04ucGFyc2UgZGF0YVxuXG5VdGlscy5kb21Mb2FkRGF0YVN5bmMgPSAocGF0aCkgLT5cblxuXHRyZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblx0cmVxdWVzdC5vcGVuIFwiR0VUXCIsIHBhdGgsIGZhbHNlXG5cblx0IyBUaGlzIGRvZXMgbm90IHdvcmsgaW4gU2FmYXJpLCBzZWUgYmVsb3dcblx0dHJ5XG5cdFx0cmVxdWVzdC5zZW5kIG51bGxcblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZGVidWcgXCJYTUxIdHRwUmVxdWVzdC5lcnJvclwiLCBlXG5cblx0ZGF0YSA9IHJlcXVlc3QucmVzcG9uc2VUZXh0XG5cblx0IyBCZWNhdXNlIEkgY2FuJ3QgY2F0Y2ggdGhlIGFjdHVhbCA0MDQgd2l0aCBTYWZhcmksIEkganVzdCBhc3N1bWUgc29tZXRoaW5nXG5cdCMgd2VudCB3cm9uZyBpZiB0aGVyZSBpcyBubyB0ZXh0IGRhdGEgcmV0dXJuZWQgZnJvbSB0aGUgcmVxdWVzdC5cblx0aWYgbm90IGRhdGFcblx0XHR0aHJvdyBFcnJvciBcIlV0aWxzLmRvbUxvYWREYXRhU3luYzogbm8gZGF0YSB3YXMgbG9hZGVkICh1cmwgbm90IGZvdW5kPylcIlxuXG5cdHJldHVybiByZXF1ZXN0LnJlc3BvbnNlVGV4dFxuXG5VdGlscy5kb21Mb2FkSlNPTlN5bmMgPSAocGF0aCkgLT5cblx0SlNPTi5wYXJzZSBVdGlscy5kb21Mb2FkRGF0YVN5bmMgcGF0aFxuXG5VdGlscy5kb21Mb2FkU2NyaXB0U3luYyA9IChwYXRoKSAtPlxuXHRzY3JpcHREYXRhID0gVXRpbHMuZG9tTG9hZERhdGFTeW5jIHBhdGhcblx0ZXZhbCBzY3JpcHREYXRhXG5cdHNjcmlwdERhdGFcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jIEdFT01FUlRZIEZVTkNUSU9OU1xuXG4jIFBvaW50XG5cblV0aWxzLnBvaW50TWluID0gLT5cblx0cG9pbnRzID0gVXRpbHMuYXJyYXlGcm9tQXJndW1lbnRzIGFyZ3VtZW50c1xuXHRwb2ludCA9IFxuXHRcdHg6IF8ubWluIHBvaW50Lm1hcCAoc2l6ZSkgLT4gc2l6ZS54XG5cdFx0eTogXy5taW4gcG9pbnQubWFwIChzaXplKSAtPiBzaXplLnlcblxuVXRpbHMucG9pbnRNYXggPSAtPlxuXHRwb2ludHMgPSBVdGlscy5hcnJheUZyb21Bcmd1bWVudHMgYXJndW1lbnRzXG5cdHBvaW50ID0gXG5cdFx0eDogXy5tYXggcG9pbnQubWFwIChzaXplKSAtPiBzaXplLnhcblx0XHR5OiBfLm1heCBwb2ludC5tYXAgKHNpemUpIC0+IHNpemUueVxuXG5VdGlscy5wb2ludERpc3RhbmNlID0gKHBvaW50QSwgcG9pbnRCKSAtPlxuXHRkaXN0YW5jZSA9XG5cdFx0eDogTWF0aC5hYnMocG9pbnRCLnggLSBwb2ludEEueClcblx0XHR5OiBNYXRoLmFicyhwb2ludEIueSAtIHBvaW50QS55KVxuXG5VdGlscy5wb2ludEludmVydCA9IChwb2ludCkgLT5cblx0cG9pbnQgPVxuXHRcdHg6IDAgLSBwb2ludC54XG5cdFx0eTogMCAtIHBvaW50LnlcblxuVXRpbHMucG9pbnRUb3RhbCA9IChwb2ludCkgLT5cblx0cG9pbnQueCArIHBvaW50LnlcblxuVXRpbHMucG9pbnRBYnMgPSAocG9pbnQpIC0+XG5cdHBvaW50ID1cblx0XHR4OiBNYXRoLmFicyBwb2ludC54XG5cdFx0eTogTWF0aC5hYnMgcG9pbnQueVxuXG5VdGlscy5wb2ludEluRnJhbWUgPSAocG9pbnQsIGZyYW1lKSAtPlxuXHRyZXR1cm4gZmFsc2UgIGlmIHBvaW50LnggPCBmcmFtZS5taW5YIG9yIHBvaW50LnggPiBmcmFtZS5tYXhYXG5cdHJldHVybiBmYWxzZSAgaWYgcG9pbnQueSA8IGZyYW1lLm1pblkgb3IgcG9pbnQueSA+IGZyYW1lLm1heFlcblx0dHJ1ZVxuXG4jIFNpemVcblxuVXRpbHMuc2l6ZU1pbiA9IC0+XG5cdHNpemVzID0gVXRpbHMuYXJyYXlGcm9tQXJndW1lbnRzIGFyZ3VtZW50c1xuXHRzaXplICA9XG5cdFx0d2lkdGg6ICBfLm1pbiBzaXplcy5tYXAgKHNpemUpIC0+IHNpemUud2lkdGhcblx0XHRoZWlnaHQ6IF8ubWluIHNpemVzLm1hcCAoc2l6ZSkgLT4gc2l6ZS5oZWlnaHRcblxuVXRpbHMuc2l6ZU1heCA9IC0+XG5cdHNpemVzID0gVXRpbHMuYXJyYXlGcm9tQXJndW1lbnRzIGFyZ3VtZW50c1xuXHRzaXplICA9XG5cdFx0d2lkdGg6ICBfLm1heCBzaXplcy5tYXAgKHNpemUpIC0+IHNpemUud2lkdGhcblx0XHRoZWlnaHQ6IF8ubWF4IHNpemVzLm1hcCAoc2l6ZSkgLT4gc2l6ZS5oZWlnaHRcblxuIyBGcmFtZXNcblxuIyBtaW4gbWlkIG1heCAqIHgsIHlcblxuVXRpbHMuZnJhbWVHZXRNaW5YID0gKGZyYW1lKSAtPiBmcmFtZS54XG5VdGlscy5mcmFtZVNldE1pblggPSAoZnJhbWUsIHZhbHVlKSAtPiBmcmFtZS54ID0gdmFsdWVcblxuVXRpbHMuZnJhbWVHZXRNaWRYID0gKGZyYW1lKSAtPiBcblx0aWYgZnJhbWUud2lkdGggaXMgMCB0aGVuIDAgZWxzZSBmcmFtZS54ICsgKGZyYW1lLndpZHRoIC8gMi4wKVxuVXRpbHMuZnJhbWVTZXRNaWRYID0gKGZyYW1lLCB2YWx1ZSkgLT5cblx0ZnJhbWUueCA9IGlmIGZyYW1lLndpZHRoIGlzIDAgdGhlbiAwIGVsc2UgdmFsdWUgLSAoZnJhbWUud2lkdGggLyAyLjApXG5cblV0aWxzLmZyYW1lR2V0TWF4WCA9IChmcmFtZSkgLT4gXG5cdGlmIGZyYW1lLndpZHRoIGlzIDAgdGhlbiAwIGVsc2UgZnJhbWUueCArIGZyYW1lLndpZHRoXG5VdGlscy5mcmFtZVNldE1heFggPSAoZnJhbWUsIHZhbHVlKSAtPlxuXHRmcmFtZS54ID0gaWYgZnJhbWUud2lkdGggaXMgMCB0aGVuIDAgZWxzZSB2YWx1ZSAtIGZyYW1lLndpZHRoXG5cblV0aWxzLmZyYW1lR2V0TWluWSA9IChmcmFtZSkgLT4gZnJhbWUueVxuVXRpbHMuZnJhbWVTZXRNaW5ZID0gKGZyYW1lLCB2YWx1ZSkgLT4gZnJhbWUueSA9IHZhbHVlXG5cblV0aWxzLmZyYW1lR2V0TWlkWSA9IChmcmFtZSkgLT4gXG5cdGlmIGZyYW1lLmhlaWdodCBpcyAwIHRoZW4gMCBlbHNlIGZyYW1lLnkgKyAoZnJhbWUuaGVpZ2h0IC8gMi4wKVxuVXRpbHMuZnJhbWVTZXRNaWRZID0gKGZyYW1lLCB2YWx1ZSkgLT5cblx0ZnJhbWUueSA9IGlmIGZyYW1lLmhlaWdodCBpcyAwIHRoZW4gMCBlbHNlIHZhbHVlIC0gKGZyYW1lLmhlaWdodCAvIDIuMClcblxuVXRpbHMuZnJhbWVHZXRNYXhZID0gKGZyYW1lKSAtPiBcblx0aWYgZnJhbWUuaGVpZ2h0IGlzIDAgdGhlbiAwIGVsc2UgZnJhbWUueSArIGZyYW1lLmhlaWdodFxuVXRpbHMuZnJhbWVTZXRNYXhZID0gKGZyYW1lLCB2YWx1ZSkgLT5cblx0ZnJhbWUueSA9IGlmIGZyYW1lLmhlaWdodCBpcyAwIHRoZW4gMCBlbHNlIHZhbHVlIC0gZnJhbWUuaGVpZ2h0XG5cblxuVXRpbHMuZnJhbWVTaXplID0gKGZyYW1lKSAtPlxuXHRzaXplID1cblx0XHR3aWR0aDogZnJhbWUud2lkdGhcblx0XHRoZWlnaHQ6IGZyYW1lLmhlaWdodFxuXG5VdGlscy5mcmFtZVBvaW50ID0gKGZyYW1lKSAtPlxuXHRwb2ludCA9XG5cdFx0eDogZnJhbWUueFxuXHRcdHk6IGZyYW1lLnlcblxuVXRpbHMuZnJhbWVNZXJnZSA9IC0+XG5cblx0IyBSZXR1cm4gYSBmcmFtZSB0aGF0IGZpdHMgYWxsIHRoZSBpbnB1dCBmcmFtZXNcblxuXHRmcmFtZXMgPSBVdGlscy5hcnJheUZyb21Bcmd1bWVudHMgYXJndW1lbnRzXG5cblx0ZnJhbWUgPVxuXHRcdHg6IF8ubWluIGZyYW1lcy5tYXAgVXRpbHMuZnJhbWVHZXRNaW5YXG5cdFx0eTogXy5taW4gZnJhbWVzLm1hcCBVdGlscy5mcmFtZUdldE1pbllcblxuXHRmcmFtZS53aWR0aCAgPSBfLm1heChmcmFtZXMubWFwIFV0aWxzLmZyYW1lR2V0TWF4WCkgLSBmcmFtZS54XG5cdGZyYW1lLmhlaWdodCA9IF8ubWF4KGZyYW1lcy5tYXAgVXRpbHMuZnJhbWVHZXRNYXhZKSAtIGZyYW1lLnlcblxuXHRmcmFtZVxuXG4jIENvb3JkaW5hdGUgc3lzdGVtXG5cblV0aWxzLmNvbnZlcnRQb2ludCA9IChpbnB1dCwgbGF5ZXJBLCBsYXllckIpIC0+XG5cblx0IyBDb252ZXJ0IGEgcG9pbnQgYmV0d2VlbiB0d28gbGF5ZXIgY29vcmRpbmF0ZSBzeXN0ZW1zXG5cblx0cG9pbnQgPSB7fVxuXG5cdGZvciBrIGluIFtcInhcIiwgXCJ5XCIsIFwid2lkdGhcIiwgXCJoZWlnaHRcIl1cblx0XHRwb2ludFtrXSA9IGlucHV0W2tdXG5cblx0c3VwZXJMYXllcnNBID0gbGF5ZXJBPy5zdXBlckxheWVycygpIG9yIFtdXG5cdHN1cGVyTGF5ZXJzQiA9IGxheWVyQj8uc3VwZXJMYXllcnMoKSBvciBbXVxuXHRcblx0c3VwZXJMYXllcnNCLnB1c2ggbGF5ZXJCIGlmIGxheWVyQlxuXHRcblx0Zm9yIGxheWVyIGluIHN1cGVyTGF5ZXJzQVxuXHRcdHBvaW50LnggKz0gbGF5ZXIueCAtIGxheWVyLnNjcm9sbEZyYW1lLnhcblx0XHRwb2ludC55ICs9IGxheWVyLnkgLSBsYXllci5zY3JvbGxGcmFtZS55XG5cblx0Zm9yIGxheWVyIGluIHN1cGVyTGF5ZXJzQlxuXHRcdHBvaW50LnggLT0gbGF5ZXIueCArIGxheWVyLnNjcm9sbEZyYW1lLnhcblx0XHRwb2ludC55IC09IGxheWVyLnkgKyBsYXllci5zY3JvbGxGcmFtZS55XG5cdFxuXHRyZXR1cm4gcG9pbnRcblxuXy5leHRlbmQgZXhwb3J0cywgVXRpbHNcblxuIiwidmFyIGdsb2JhbD10eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge307LyoqXG4gKiBAbGljZW5zZVxuICogTG8tRGFzaCAyLjQuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cDovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIC1vIC4vZGlzdC9sb2Rhc2guanNgXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDEzIFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjUuMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTMgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cDovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuOyhmdW5jdGlvbigpIHtcblxuICAvKiogVXNlZCBhcyBhIHNhZmUgcmVmZXJlbmNlIGZvciBgdW5kZWZpbmVkYCBpbiBwcmUgRVM1IGVudmlyb25tZW50cyAqL1xuICB2YXIgdW5kZWZpbmVkO1xuXG4gIC8qKiBVc2VkIHRvIHBvb2wgYXJyYXlzIGFuZCBvYmplY3RzIHVzZWQgaW50ZXJuYWxseSAqL1xuICB2YXIgYXJyYXlQb29sID0gW10sXG4gICAgICBvYmplY3RQb29sID0gW107XG5cbiAgLyoqIFVzZWQgdG8gZ2VuZXJhdGUgdW5pcXVlIElEcyAqL1xuICB2YXIgaWRDb3VudGVyID0gMDtcblxuICAvKiogVXNlZCB0byBwcmVmaXgga2V5cyB0byBhdm9pZCBpc3N1ZXMgd2l0aCBgX19wcm90b19fYCBhbmQgcHJvcGVydGllcyBvbiBgT2JqZWN0LnByb3RvdHlwZWAgKi9cbiAgdmFyIGtleVByZWZpeCA9ICtuZXcgRGF0ZSArICcnO1xuXG4gIC8qKiBVc2VkIGFzIHRoZSBzaXplIHdoZW4gb3B0aW1pemF0aW9ucyBhcmUgZW5hYmxlZCBmb3IgbGFyZ2UgYXJyYXlzICovXG4gIHZhciBsYXJnZUFycmF5U2l6ZSA9IDc1O1xuXG4gIC8qKiBVc2VkIGFzIHRoZSBtYXggc2l6ZSBvZiB0aGUgYGFycmF5UG9vbGAgYW5kIGBvYmplY3RQb29sYCAqL1xuICB2YXIgbWF4UG9vbFNpemUgPSA0MDtcblxuICAvKiogVXNlZCB0byBkZXRlY3QgYW5kIHRlc3Qgd2hpdGVzcGFjZSAqL1xuICB2YXIgd2hpdGVzcGFjZSA9IChcbiAgICAvLyB3aGl0ZXNwYWNlXG4gICAgJyBcXHRcXHgwQlxcZlxceEEwXFx1ZmVmZicgK1xuXG4gICAgLy8gbGluZSB0ZXJtaW5hdG9yc1xuICAgICdcXG5cXHJcXHUyMDI4XFx1MjAyOScgK1xuXG4gICAgLy8gdW5pY29kZSBjYXRlZ29yeSBcIlpzXCIgc3BhY2Ugc2VwYXJhdG9yc1xuICAgICdcXHUxNjgwXFx1MTgwZVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDNcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBhXFx1MjAyZlxcdTIwNWZcXHUzMDAwJ1xuICApO1xuXG4gIC8qKiBVc2VkIHRvIG1hdGNoIGVtcHR5IHN0cmluZyBsaXRlcmFscyBpbiBjb21waWxlZCB0ZW1wbGF0ZSBzb3VyY2UgKi9cbiAgdmFyIHJlRW1wdHlTdHJpbmdMZWFkaW5nID0gL1xcYl9fcCBcXCs9ICcnOy9nLFxuICAgICAgcmVFbXB0eVN0cmluZ01pZGRsZSA9IC9cXGIoX19wIFxcKz0pICcnIFxcKy9nLFxuICAgICAgcmVFbXB0eVN0cmluZ1RyYWlsaW5nID0gLyhfX2VcXCguKj9cXCl8XFxiX190XFwpKSBcXCtcXG4nJzsvZztcblxuICAvKipcbiAgICogVXNlZCB0byBtYXRjaCBFUzYgdGVtcGxhdGUgZGVsaW1pdGVyc1xuICAgKiBodHRwOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1saXRlcmFscy1zdHJpbmctbGl0ZXJhbHNcbiAgICovXG4gIHZhciByZUVzVGVtcGxhdGUgPSAvXFwkXFx7KFteXFxcXH1dKig/OlxcXFwuW15cXFxcfV0qKSopXFx9L2c7XG5cbiAgLyoqIFVzZWQgdG8gbWF0Y2ggcmVnZXhwIGZsYWdzIGZyb20gdGhlaXIgY29lcmNlZCBzdHJpbmcgdmFsdWVzICovXG4gIHZhciByZUZsYWdzID0gL1xcdyokLztcblxuICAvKiogVXNlZCB0byBkZXRlY3RlZCBuYW1lZCBmdW5jdGlvbnMgKi9cbiAgdmFyIHJlRnVuY05hbWUgPSAvXlxccypmdW5jdGlvblsgXFxuXFxyXFx0XStcXHcvO1xuXG4gIC8qKiBVc2VkIHRvIG1hdGNoIFwiaW50ZXJwb2xhdGVcIiB0ZW1wbGF0ZSBkZWxpbWl0ZXJzICovXG4gIHZhciByZUludGVycG9sYXRlID0gLzwlPShbXFxzXFxTXSs/KSU+L2c7XG5cbiAgLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyB3aGl0ZXNwYWNlIGFuZCB6ZXJvcyB0byBiZSByZW1vdmVkICovXG4gIHZhciByZUxlYWRpbmdTcGFjZXNBbmRaZXJvcyA9IFJlZ0V4cCgnXlsnICsgd2hpdGVzcGFjZSArICddKjArKD89LiQpJyk7XG5cbiAgLyoqIFVzZWQgdG8gZW5zdXJlIGNhcHR1cmluZyBvcmRlciBvZiB0ZW1wbGF0ZSBkZWxpbWl0ZXJzICovXG4gIHZhciByZU5vTWF0Y2ggPSAvKCReKS87XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZWN0IGZ1bmN0aW9ucyBjb250YWluaW5nIGEgYHRoaXNgIHJlZmVyZW5jZSAqL1xuICB2YXIgcmVUaGlzID0gL1xcYnRoaXNcXGIvO1xuXG4gIC8qKiBVc2VkIHRvIG1hdGNoIHVuZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGNvbXBpbGVkIHN0cmluZyBsaXRlcmFscyAqL1xuICB2YXIgcmVVbmVzY2FwZWRTdHJpbmcgPSAvWydcXG5cXHJcXHRcXHUyMDI4XFx1MjAyOVxcXFxdL2c7XG5cbiAgLyoqIFVzZWQgdG8gYXNzaWduIGRlZmF1bHQgYGNvbnRleHRgIG9iamVjdCBwcm9wZXJ0aWVzICovXG4gIHZhciBjb250ZXh0UHJvcHMgPSBbXG4gICAgJ0FycmF5JywgJ0Jvb2xlYW4nLCAnRGF0ZScsICdGdW5jdGlvbicsICdNYXRoJywgJ051bWJlcicsICdPYmplY3QnLFxuICAgICdSZWdFeHAnLCAnU3RyaW5nJywgJ18nLCAnYXR0YWNoRXZlbnQnLCAnY2xlYXJUaW1lb3V0JywgJ2lzRmluaXRlJywgJ2lzTmFOJyxcbiAgICAncGFyc2VJbnQnLCAnc2V0VGltZW91dCdcbiAgXTtcblxuICAvKiogVXNlZCB0byBtYWtlIHRlbXBsYXRlIHNvdXJjZVVSTHMgZWFzaWVyIHRvIGlkZW50aWZ5ICovXG4gIHZhciB0ZW1wbGF0ZUNvdW50ZXIgPSAwO1xuXG4gIC8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgc2hvcnRjdXRzICovXG4gIHZhciBhcmdzQ2xhc3MgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICAgIGFycmF5Q2xhc3MgPSAnW29iamVjdCBBcnJheV0nLFxuICAgICAgYm9vbENsYXNzID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgICAgZGF0ZUNsYXNzID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgICAgZnVuY0NsYXNzID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICAgIG51bWJlckNsYXNzID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgICBvYmplY3RDbGFzcyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgICAgcmVnZXhwQ2xhc3MgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICAgIHN0cmluZ0NsYXNzID0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cbiAgLyoqIFVzZWQgdG8gaWRlbnRpZnkgb2JqZWN0IGNsYXNzaWZpY2F0aW9ucyB0aGF0IGBfLmNsb25lYCBzdXBwb3J0cyAqL1xuICB2YXIgY2xvbmVhYmxlQ2xhc3NlcyA9IHt9O1xuICBjbG9uZWFibGVDbGFzc2VzW2Z1bmNDbGFzc10gPSBmYWxzZTtcbiAgY2xvbmVhYmxlQ2xhc3Nlc1thcmdzQ2xhc3NdID0gY2xvbmVhYmxlQ2xhc3Nlc1thcnJheUNsYXNzXSA9XG4gIGNsb25lYWJsZUNsYXNzZXNbYm9vbENsYXNzXSA9IGNsb25lYWJsZUNsYXNzZXNbZGF0ZUNsYXNzXSA9XG4gIGNsb25lYWJsZUNsYXNzZXNbbnVtYmVyQ2xhc3NdID0gY2xvbmVhYmxlQ2xhc3Nlc1tvYmplY3RDbGFzc10gPVxuICBjbG9uZWFibGVDbGFzc2VzW3JlZ2V4cENsYXNzXSA9IGNsb25lYWJsZUNsYXNzZXNbc3RyaW5nQ2xhc3NdID0gdHJ1ZTtcblxuICAvKiogVXNlZCBhcyBhbiBpbnRlcm5hbCBgXy5kZWJvdW5jZWAgb3B0aW9ucyBvYmplY3QgKi9cbiAgdmFyIGRlYm91bmNlT3B0aW9ucyA9IHtcbiAgICAnbGVhZGluZyc6IGZhbHNlLFxuICAgICdtYXhXYWl0JzogMCxcbiAgICAndHJhaWxpbmcnOiBmYWxzZVxuICB9O1xuXG4gIC8qKiBVc2VkIGFzIHRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIGZvciBgX19iaW5kRGF0YV9fYCAqL1xuICB2YXIgZGVzY3JpcHRvciA9IHtcbiAgICAnY29uZmlndXJhYmxlJzogZmFsc2UsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBudWxsLFxuICAgICd3cml0YWJsZSc6IGZhbHNlXG4gIH07XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHZhbHVlcyBhcmUgb2YgdGhlIGxhbmd1YWdlIHR5cGUgT2JqZWN0ICovXG4gIHZhciBvYmplY3RUeXBlcyA9IHtcbiAgICAnYm9vbGVhbic6IGZhbHNlLFxuICAgICdmdW5jdGlvbic6IHRydWUsXG4gICAgJ29iamVjdCc6IHRydWUsXG4gICAgJ251bWJlcic6IGZhbHNlLFxuICAgICdzdHJpbmcnOiBmYWxzZSxcbiAgICAndW5kZWZpbmVkJzogZmFsc2VcbiAgfTtcblxuICAvKiogVXNlZCB0byBlc2NhcGUgY2hhcmFjdGVycyBmb3IgaW5jbHVzaW9uIGluIGNvbXBpbGVkIHN0cmluZyBsaXRlcmFscyAqL1xuICB2YXIgc3RyaW5nRXNjYXBlcyA9IHtcbiAgICAnXFxcXCc6ICdcXFxcJyxcbiAgICBcIidcIjogXCInXCIsXG4gICAgJ1xcbic6ICduJyxcbiAgICAnXFxyJzogJ3InLFxuICAgICdcXHQnOiAndCcsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIC8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0ICovXG4gIHZhciByb290ID0gKG9iamVjdFR5cGVzW3R5cGVvZiB3aW5kb3ddICYmIHdpbmRvdykgfHwgdGhpcztcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgICovXG4gIHZhciBmcmVlRXhwb3J0cyA9IG9iamVjdFR5cGVzW3R5cGVvZiBleHBvcnRzXSAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgICovXG4gIHZhciBmcmVlTW9kdWxlID0gb2JqZWN0VHlwZXNbdHlwZW9mIG1vZHVsZV0gJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4gIC8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AgKi9cbiAgdmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHMgJiYgZnJlZUV4cG9ydHM7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcyBvciBCcm93c2VyaWZpZWQgY29kZSBhbmQgdXNlIGl0IGFzIGByb290YCAqL1xuICB2YXIgZnJlZUdsb2JhbCA9IG9iamVjdFR5cGVzW3R5cGVvZiBnbG9iYWxdICYmIGdsb2JhbDtcbiAgaWYgKGZyZWVHbG9iYWwgJiYgKGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsIHx8IGZyZWVHbG9iYWwud2luZG93ID09PSBmcmVlR2xvYmFsKSkge1xuICAgIHJvb3QgPSBmcmVlR2xvYmFsO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmluZGV4T2ZgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYmluYXJ5IHNlYXJjaGVzXG4gICAqIG9yIGBmcm9tSW5kZXhgIGNvbnN0cmFpbnRzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW2Zyb21JbmRleD0wXSBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlIG9yIGAtMWAuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlSW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuICAgIHZhciBpbmRleCA9IChmcm9tSW5kZXggfHwgMCkgLSAxLFxuICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKGFycmF5W2luZGV4XSA9PT0gdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvKipcbiAgICogQW4gaW1wbGVtZW50YXRpb24gb2YgYF8uY29udGFpbnNgIGZvciBjYWNoZSBvYmplY3RzIHRoYXQgbWltaWNzIHRoZSByZXR1cm5cbiAgICogc2lnbmF0dXJlIG9mIGBfLmluZGV4T2ZgIGJ5IHJldHVybmluZyBgMGAgaWYgdGhlIHZhbHVlIGlzIGZvdW5kLCBlbHNlIGAtMWAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjYWNoZSBUaGUgY2FjaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYDBgIGlmIGB2YWx1ZWAgaXMgZm91bmQsIGVsc2UgYC0xYC5cbiAgICovXG4gIGZ1bmN0aW9uIGNhY2hlSW5kZXhPZihjYWNoZSwgdmFsdWUpIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgICBjYWNoZSA9IGNhY2hlLmNhY2hlO1xuXG4gICAgaWYgKHR5cGUgPT0gJ2Jvb2xlYW4nIHx8IHZhbHVlID09IG51bGwpIHtcbiAgICAgIHJldHVybiBjYWNoZVt2YWx1ZV0gPyAwIDogLTE7XG4gICAgfVxuICAgIGlmICh0eXBlICE9ICdudW1iZXInICYmIHR5cGUgIT0gJ3N0cmluZycpIHtcbiAgICAgIHR5cGUgPSAnb2JqZWN0JztcbiAgICB9XG4gICAgdmFyIGtleSA9IHR5cGUgPT0gJ251bWJlcicgPyB2YWx1ZSA6IGtleVByZWZpeCArIHZhbHVlO1xuICAgIGNhY2hlID0gKGNhY2hlID0gY2FjaGVbdHlwZV0pICYmIGNhY2hlW2tleV07XG5cbiAgICByZXR1cm4gdHlwZSA9PSAnb2JqZWN0J1xuICAgICAgPyAoY2FjaGUgJiYgYmFzZUluZGV4T2YoY2FjaGUsIHZhbHVlKSA+IC0xID8gMCA6IC0xKVxuICAgICAgOiAoY2FjaGUgPyAwIDogLTEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBnaXZlbiB2YWx1ZSB0byB0aGUgY29ycmVzcG9uZGluZyBjYWNoZSBvYmplY3QuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFkZCB0byB0aGUgY2FjaGUuXG4gICAqL1xuICBmdW5jdGlvbiBjYWNoZVB1c2godmFsdWUpIHtcbiAgICB2YXIgY2FjaGUgPSB0aGlzLmNhY2hlLFxuICAgICAgICB0eXBlID0gdHlwZW9mIHZhbHVlO1xuXG4gICAgaWYgKHR5cGUgPT0gJ2Jvb2xlYW4nIHx8IHZhbHVlID09IG51bGwpIHtcbiAgICAgIGNhY2hlW3ZhbHVlXSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlICE9ICdudW1iZXInICYmIHR5cGUgIT0gJ3N0cmluZycpIHtcbiAgICAgICAgdHlwZSA9ICdvYmplY3QnO1xuICAgICAgfVxuICAgICAgdmFyIGtleSA9IHR5cGUgPT0gJ251bWJlcicgPyB2YWx1ZSA6IGtleVByZWZpeCArIHZhbHVlLFxuICAgICAgICAgIHR5cGVDYWNoZSA9IGNhY2hlW3R5cGVdIHx8IChjYWNoZVt0eXBlXSA9IHt9KTtcblxuICAgICAgaWYgKHR5cGUgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgKHR5cGVDYWNoZVtrZXldIHx8ICh0eXBlQ2FjaGVba2V5XSA9IFtdKSkucHVzaCh2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0eXBlQ2FjaGVba2V5XSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgYF8ubWF4YCBhbmQgYF8ubWluYCBhcyB0aGUgZGVmYXVsdCBjYWxsYmFjayB3aGVuIGEgZ2l2ZW5cbiAgICogY29sbGVjdGlvbiBpcyBhIHN0cmluZyB2YWx1ZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSBjaGFyYWN0ZXIgdG8gaW5zcGVjdC5cbiAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY29kZSB1bml0IG9mIGdpdmVuIGNoYXJhY3Rlci5cbiAgICovXG4gIGZ1bmN0aW9uIGNoYXJBdENhbGxiYWNrKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLmNoYXJDb2RlQXQoMCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBieSBgc29ydEJ5YCB0byBjb21wYXJlIHRyYW5zZm9ybWVkIGBjb2xsZWN0aW9uYCBlbGVtZW50cywgc3RhYmxlIHNvcnRpbmdcbiAgICogdGhlbSBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gY29tcGFyZSB0byBgYmAuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29tcGFyZSB0byBgYWAuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHNvcnQgb3JkZXIgaW5kaWNhdG9yIG9mIGAxYCBvciBgLTFgLlxuICAgKi9cbiAgZnVuY3Rpb24gY29tcGFyZUFzY2VuZGluZyhhLCBiKSB7XG4gICAgdmFyIGFjID0gYS5jcml0ZXJpYSxcbiAgICAgICAgYmMgPSBiLmNyaXRlcmlhLFxuICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBhYy5sZW5ndGg7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIHZhbHVlID0gYWNbaW5kZXhdLFxuICAgICAgICAgIG90aGVyID0gYmNbaW5kZXhdO1xuXG4gICAgICBpZiAodmFsdWUgIT09IG90aGVyKSB7XG4gICAgICAgIGlmICh2YWx1ZSA+IG90aGVyIHx8IHR5cGVvZiB2YWx1ZSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZSA8IG90aGVyIHx8IHR5cGVvZiBvdGhlciA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBGaXhlcyBhbiBgQXJyYXkjc29ydGAgYnVnIGluIHRoZSBKUyBlbmdpbmUgZW1iZWRkZWQgaW4gQWRvYmUgYXBwbGljYXRpb25zXG4gICAgLy8gdGhhdCBjYXVzZXMgaXQsIHVuZGVyIGNlcnRhaW4gY2lyY3Vtc3RhbmNlcywgdG8gcmV0dXJuIHRoZSBzYW1lIHZhbHVlIGZvclxuICAgIC8vIGBhYCBhbmQgYGJgLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2phc2hrZW5hcy91bmRlcnNjb3JlL3B1bGwvMTI0N1xuICAgIC8vXG4gICAgLy8gVGhpcyBhbHNvIGVuc3VyZXMgYSBzdGFibGUgc29ydCBpbiBWOCBhbmQgb3RoZXIgZW5naW5lcy5cbiAgICAvLyBTZWUgaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9OTBcbiAgICByZXR1cm4gYS5pbmRleCAtIGIuaW5kZXg7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGNhY2hlIG9iamVjdCB0byBvcHRpbWl6ZSBsaW5lYXIgc2VhcmNoZXMgb2YgbGFyZ2UgYXJyYXlzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBbYXJyYXk9W11dIFRoZSBhcnJheSB0byBzZWFyY2guXG4gICAqIEByZXR1cm5zIHtudWxsfE9iamVjdH0gUmV0dXJucyB0aGUgY2FjaGUgb2JqZWN0IG9yIGBudWxsYCBpZiBjYWNoaW5nIHNob3VsZCBub3QgYmUgdXNlZC5cbiAgICovXG4gIGZ1bmN0aW9uIGNyZWF0ZUNhY2hlKGFycmF5KSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgICAgZmlyc3QgPSBhcnJheVswXSxcbiAgICAgICAgbWlkID0gYXJyYXlbKGxlbmd0aCAvIDIpIHwgMF0sXG4gICAgICAgIGxhc3QgPSBhcnJheVtsZW5ndGggLSAxXTtcblxuICAgIGlmIChmaXJzdCAmJiB0eXBlb2YgZmlyc3QgPT0gJ29iamVjdCcgJiZcbiAgICAgICAgbWlkICYmIHR5cGVvZiBtaWQgPT0gJ29iamVjdCcgJiYgbGFzdCAmJiB0eXBlb2YgbGFzdCA9PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgY2FjaGUgPSBnZXRPYmplY3QoKTtcbiAgICBjYWNoZVsnZmFsc2UnXSA9IGNhY2hlWydudWxsJ10gPSBjYWNoZVsndHJ1ZSddID0gY2FjaGVbJ3VuZGVmaW5lZCddID0gZmFsc2U7XG5cbiAgICB2YXIgcmVzdWx0ID0gZ2V0T2JqZWN0KCk7XG4gICAgcmVzdWx0LmFycmF5ID0gYXJyYXk7XG4gICAgcmVzdWx0LmNhY2hlID0gY2FjaGU7XG4gICAgcmVzdWx0LnB1c2ggPSBjYWNoZVB1c2g7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgcmVzdWx0LnB1c2goYXJyYXlbaW5kZXhdKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIGJ5IGB0ZW1wbGF0ZWAgdG8gZXNjYXBlIGNoYXJhY3RlcnMgZm9yIGluY2x1c2lvbiBpbiBjb21waWxlZFxuICAgKiBzdHJpbmcgbGl0ZXJhbHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXRjaCBUaGUgbWF0Y2hlZCBjaGFyYWN0ZXIgdG8gZXNjYXBlLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIGNoYXJhY3Rlci5cbiAgICovXG4gIGZ1bmN0aW9uIGVzY2FwZVN0cmluZ0NoYXIobWF0Y2gpIHtcbiAgICByZXR1cm4gJ1xcXFwnICsgc3RyaW5nRXNjYXBlc1ttYXRjaF07XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBhcnJheSBmcm9tIHRoZSBhcnJheSBwb29sIG9yIGNyZWF0ZXMgYSBuZXcgb25lIGlmIHRoZSBwb29sIGlzIGVtcHR5LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBhcnJheSBmcm9tIHRoZSBwb29sLlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0QXJyYXkoKSB7XG4gICAgcmV0dXJuIGFycmF5UG9vbC5wb3AoKSB8fCBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9iamVjdCBmcm9tIHRoZSBvYmplY3QgcG9vbCBvciBjcmVhdGVzIGEgbmV3IG9uZSBpZiB0aGUgcG9vbCBpcyBlbXB0eS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybnMge09iamVjdH0gVGhlIG9iamVjdCBmcm9tIHRoZSBwb29sLlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0T2JqZWN0KCkge1xuICAgIHJldHVybiBvYmplY3RQb29sLnBvcCgpIHx8IHtcbiAgICAgICdhcnJheSc6IG51bGwsXG4gICAgICAnY2FjaGUnOiBudWxsLFxuICAgICAgJ2NyaXRlcmlhJzogbnVsbCxcbiAgICAgICdmYWxzZSc6IGZhbHNlLFxuICAgICAgJ2luZGV4JzogMCxcbiAgICAgICdudWxsJzogZmFsc2UsXG4gICAgICAnbnVtYmVyJzogbnVsbCxcbiAgICAgICdvYmplY3QnOiBudWxsLFxuICAgICAgJ3B1c2gnOiBudWxsLFxuICAgICAgJ3N0cmluZyc6IG51bGwsXG4gICAgICAndHJ1ZSc6IGZhbHNlLFxuICAgICAgJ3VuZGVmaW5lZCc6IGZhbHNlLFxuICAgICAgJ3ZhbHVlJzogbnVsbFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmVsZWFzZXMgdGhlIGdpdmVuIGFycmF5IGJhY2sgdG8gdGhlIGFycmF5IHBvb2wuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIHJlbGVhc2UuXG4gICAqL1xuICBmdW5jdGlvbiByZWxlYXNlQXJyYXkoYXJyYXkpIHtcbiAgICBhcnJheS5sZW5ndGggPSAwO1xuICAgIGlmIChhcnJheVBvb2wubGVuZ3RoIDwgbWF4UG9vbFNpemUpIHtcbiAgICAgIGFycmF5UG9vbC5wdXNoKGFycmF5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVsZWFzZXMgdGhlIGdpdmVuIG9iamVjdCBiYWNrIHRvIHRoZSBvYmplY3QgcG9vbC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcmVsZWFzZS5cbiAgICovXG4gIGZ1bmN0aW9uIHJlbGVhc2VPYmplY3Qob2JqZWN0KSB7XG4gICAgdmFyIGNhY2hlID0gb2JqZWN0LmNhY2hlO1xuICAgIGlmIChjYWNoZSkge1xuICAgICAgcmVsZWFzZU9iamVjdChjYWNoZSk7XG4gICAgfVxuICAgIG9iamVjdC5hcnJheSA9IG9iamVjdC5jYWNoZSA9IG9iamVjdC5jcml0ZXJpYSA9IG9iamVjdC5vYmplY3QgPSBvYmplY3QubnVtYmVyID0gb2JqZWN0LnN0cmluZyA9IG9iamVjdC52YWx1ZSA9IG51bGw7XG4gICAgaWYgKG9iamVjdFBvb2wubGVuZ3RoIDwgbWF4UG9vbFNpemUpIHtcbiAgICAgIG9iamVjdFBvb2wucHVzaChvYmplY3QpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTbGljZXMgdGhlIGBjb2xsZWN0aW9uYCBmcm9tIHRoZSBgc3RhcnRgIGluZGV4IHVwIHRvLCBidXQgbm90IGluY2x1ZGluZyxcbiAgICogdGhlIGBlbmRgIGluZGV4LlxuICAgKlxuICAgKiBOb3RlOiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgaW5zdGVhZCBvZiBgQXJyYXkjc2xpY2VgIHRvIHN1cHBvcnQgbm9kZSBsaXN0c1xuICAgKiBpbiBJRSA8IDkgYW5kIHRvIGVuc3VyZSBkZW5zZSBhcnJheXMgYXJlIHJldHVybmVkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gc2xpY2UuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBUaGUgc3RhcnQgaW5kZXguXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhlIGVuZCBpbmRleC5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkuXG4gICAqL1xuICBmdW5jdGlvbiBzbGljZShhcnJheSwgc3RhcnQsIGVuZCkge1xuICAgIHN0YXJ0IHx8IChzdGFydCA9IDApO1xuICAgIGlmICh0eXBlb2YgZW5kID09ICd1bmRlZmluZWQnKSB7XG4gICAgICBlbmQgPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gICAgfVxuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBlbmQgLSBzdGFydCB8fCAwLFxuICAgICAgICByZXN1bHQgPSBBcnJheShsZW5ndGggPCAwID8gMCA6IGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgcmVzdWx0W2luZGV4XSA9IGFycmF5W3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgbG9kYXNoYCBmdW5jdGlvbiB1c2luZyB0aGUgZ2l2ZW4gY29udGV4dCBvYmplY3QuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHQ9cm9vdF0gVGhlIGNvbnRleHQgb2JqZWN0LlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGBsb2Rhc2hgIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gcnVuSW5Db250ZXh0KGNvbnRleHQpIHtcbiAgICAvLyBBdm9pZCBpc3N1ZXMgd2l0aCBzb21lIEVTMyBlbnZpcm9ubWVudHMgdGhhdCBhdHRlbXB0IHRvIHVzZSB2YWx1ZXMsIG5hbWVkXG4gICAgLy8gYWZ0ZXIgYnVpbHQtaW4gY29uc3RydWN0b3JzIGxpa2UgYE9iamVjdGAsIGZvciB0aGUgY3JlYXRpb24gb2YgbGl0ZXJhbHMuXG4gICAgLy8gRVM1IGNsZWFycyB0aGlzIHVwIGJ5IHN0YXRpbmcgdGhhdCBsaXRlcmFscyBtdXN0IHVzZSBidWlsdC1pbiBjb25zdHJ1Y3RvcnMuXG4gICAgLy8gU2VlIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTEuMS41LlxuICAgIGNvbnRleHQgPSBjb250ZXh0ID8gXy5kZWZhdWx0cyhyb290Lk9iamVjdCgpLCBjb250ZXh0LCBfLnBpY2socm9vdCwgY29udGV4dFByb3BzKSkgOiByb290O1xuXG4gICAgLyoqIE5hdGl2ZSBjb25zdHJ1Y3RvciByZWZlcmVuY2VzICovXG4gICAgdmFyIEFycmF5ID0gY29udGV4dC5BcnJheSxcbiAgICAgICAgQm9vbGVhbiA9IGNvbnRleHQuQm9vbGVhbixcbiAgICAgICAgRGF0ZSA9IGNvbnRleHQuRGF0ZSxcbiAgICAgICAgRnVuY3Rpb24gPSBjb250ZXh0LkZ1bmN0aW9uLFxuICAgICAgICBNYXRoID0gY29udGV4dC5NYXRoLFxuICAgICAgICBOdW1iZXIgPSBjb250ZXh0Lk51bWJlcixcbiAgICAgICAgT2JqZWN0ID0gY29udGV4dC5PYmplY3QsXG4gICAgICAgIFJlZ0V4cCA9IGNvbnRleHQuUmVnRXhwLFxuICAgICAgICBTdHJpbmcgPSBjb250ZXh0LlN0cmluZyxcbiAgICAgICAgVHlwZUVycm9yID0gY29udGV4dC5UeXBlRXJyb3I7XG5cbiAgICAvKipcbiAgICAgKiBVc2VkIGZvciBgQXJyYXlgIG1ldGhvZCByZWZlcmVuY2VzLlxuICAgICAqXG4gICAgICogTm9ybWFsbHkgYEFycmF5LnByb3RvdHlwZWAgd291bGQgc3VmZmljZSwgaG93ZXZlciwgdXNpbmcgYW4gYXJyYXkgbGl0ZXJhbFxuICAgICAqIGF2b2lkcyBpc3N1ZXMgaW4gTmFyd2hhbC5cbiAgICAgKi9cbiAgICB2YXIgYXJyYXlSZWYgPSBbXTtcblxuICAgIC8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgKi9cbiAgICB2YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4gICAgLyoqIFVzZWQgdG8gcmVzdG9yZSB0aGUgb3JpZ2luYWwgYF9gIHJlZmVyZW5jZSBpbiBgbm9Db25mbGljdGAgKi9cbiAgICB2YXIgb2xkRGFzaCA9IGNvbnRleHQuXztcblxuICAgIC8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGludGVybmFsIFtbQ2xhc3NdXSBvZiB2YWx1ZXMgKi9cbiAgICB2YXIgdG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuICAgIC8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUgKi9cbiAgICB2YXIgcmVOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgICAgIFN0cmluZyh0b1N0cmluZylcbiAgICAgICAgLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJylcbiAgICAgICAgLnJlcGxhY2UoL3RvU3RyaW5nfCBmb3IgW15cXF1dKy9nLCAnLio/JykgKyAnJCdcbiAgICApO1xuXG4gICAgLyoqIE5hdGl2ZSBtZXRob2Qgc2hvcnRjdXRzICovXG4gICAgdmFyIGNlaWwgPSBNYXRoLmNlaWwsXG4gICAgICAgIGNsZWFyVGltZW91dCA9IGNvbnRleHQuY2xlYXJUaW1lb3V0LFxuICAgICAgICBmbG9vciA9IE1hdGguZmxvb3IsXG4gICAgICAgIGZuVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgICAgIGdldFByb3RvdHlwZU9mID0gaXNOYXRpdmUoZ2V0UHJvdG90eXBlT2YgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YpICYmIGdldFByb3RvdHlwZU9mLFxuICAgICAgICBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5LFxuICAgICAgICBwdXNoID0gYXJyYXlSZWYucHVzaCxcbiAgICAgICAgc2V0VGltZW91dCA9IGNvbnRleHQuc2V0VGltZW91dCxcbiAgICAgICAgc3BsaWNlID0gYXJyYXlSZWYuc3BsaWNlLFxuICAgICAgICB1bnNoaWZ0ID0gYXJyYXlSZWYudW5zaGlmdDtcblxuICAgIC8qKiBVc2VkIHRvIHNldCBtZXRhIGRhdGEgb24gZnVuY3Rpb25zICovXG4gICAgdmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgLy8gSUUgOCBvbmx5IGFjY2VwdHMgRE9NIGVsZW1lbnRzXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgbyA9IHt9LFxuICAgICAgICAgICAgZnVuYyA9IGlzTmF0aXZlKGZ1bmMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkpICYmIGZ1bmMsXG4gICAgICAgICAgICByZXN1bHQgPSBmdW5jKG8sIG8sIG8pICYmIGZ1bmM7XG4gICAgICB9IGNhdGNoKGUpIHsgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9KCkpO1xuXG4gICAgLyogTmF0aXZlIG1ldGhvZCBzaG9ydGN1dHMgZm9yIG1ldGhvZHMgd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMgKi9cbiAgICB2YXIgbmF0aXZlQ3JlYXRlID0gaXNOYXRpdmUobmF0aXZlQ3JlYXRlID0gT2JqZWN0LmNyZWF0ZSkgJiYgbmF0aXZlQ3JlYXRlLFxuICAgICAgICBuYXRpdmVJc0FycmF5ID0gaXNOYXRpdmUobmF0aXZlSXNBcnJheSA9IEFycmF5LmlzQXJyYXkpICYmIG5hdGl2ZUlzQXJyYXksXG4gICAgICAgIG5hdGl2ZUlzRmluaXRlID0gY29udGV4dC5pc0Zpbml0ZSxcbiAgICAgICAgbmF0aXZlSXNOYU4gPSBjb250ZXh0LmlzTmFOLFxuICAgICAgICBuYXRpdmVLZXlzID0gaXNOYXRpdmUobmF0aXZlS2V5cyA9IE9iamVjdC5rZXlzKSAmJiBuYXRpdmVLZXlzLFxuICAgICAgICBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICAgICAgbmF0aXZlTWluID0gTWF0aC5taW4sXG4gICAgICAgIG5hdGl2ZVBhcnNlSW50ID0gY29udGV4dC5wYXJzZUludCxcbiAgICAgICAgbmF0aXZlUmFuZG9tID0gTWF0aC5yYW5kb207XG5cbiAgICAvKiogVXNlZCB0byBsb29rdXAgYSBidWlsdC1pbiBjb25zdHJ1Y3RvciBieSBbW0NsYXNzXV0gKi9cbiAgICB2YXIgY3RvckJ5Q2xhc3MgPSB7fTtcbiAgICBjdG9yQnlDbGFzc1thcnJheUNsYXNzXSA9IEFycmF5O1xuICAgIGN0b3JCeUNsYXNzW2Jvb2xDbGFzc10gPSBCb29sZWFuO1xuICAgIGN0b3JCeUNsYXNzW2RhdGVDbGFzc10gPSBEYXRlO1xuICAgIGN0b3JCeUNsYXNzW2Z1bmNDbGFzc10gPSBGdW5jdGlvbjtcbiAgICBjdG9yQnlDbGFzc1tvYmplY3RDbGFzc10gPSBPYmplY3Q7XG4gICAgY3RvckJ5Q2xhc3NbbnVtYmVyQ2xhc3NdID0gTnVtYmVyO1xuICAgIGN0b3JCeUNsYXNzW3JlZ2V4cENsYXNzXSA9IFJlZ0V4cDtcbiAgICBjdG9yQnlDbGFzc1tzdHJpbmdDbGFzc10gPSBTdHJpbmc7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBgbG9kYXNoYCBvYmplY3Qgd2hpY2ggd3JhcHMgdGhlIGdpdmVuIHZhbHVlIHRvIGVuYWJsZSBpbnR1aXRpdmVcbiAgICAgKiBtZXRob2QgY2hhaW5pbmcuXG4gICAgICpcbiAgICAgKiBJbiBhZGRpdGlvbiB0byBMby1EYXNoIG1ldGhvZHMsIHdyYXBwZXJzIGFsc28gaGF2ZSB0aGUgZm9sbG93aW5nIGBBcnJheWAgbWV0aG9kczpcbiAgICAgKiBgY29uY2F0YCwgYGpvaW5gLCBgcG9wYCwgYHB1c2hgLCBgcmV2ZXJzZWAsIGBzaGlmdGAsIGBzbGljZWAsIGBzb3J0YCwgYHNwbGljZWAsXG4gICAgICogYW5kIGB1bnNoaWZ0YFxuICAgICAqXG4gICAgICogQ2hhaW5pbmcgaXMgc3VwcG9ydGVkIGluIGN1c3RvbSBidWlsZHMgYXMgbG9uZyBhcyB0aGUgYHZhbHVlYCBtZXRob2QgaXNcbiAgICAgKiBpbXBsaWNpdGx5IG9yIGV4cGxpY2l0bHkgaW5jbHVkZWQgaW4gdGhlIGJ1aWxkLlxuICAgICAqXG4gICAgICogVGhlIGNoYWluYWJsZSB3cmFwcGVyIGZ1bmN0aW9ucyBhcmU6XG4gICAgICogYGFmdGVyYCwgYGFzc2lnbmAsIGBiaW5kYCwgYGJpbmRBbGxgLCBgYmluZEtleWAsIGBjaGFpbmAsIGBjb21wYWN0YCxcbiAgICAgKiBgY29tcG9zZWAsIGBjb25jYXRgLCBgY291bnRCeWAsIGBjcmVhdGVgLCBgY3JlYXRlQ2FsbGJhY2tgLCBgY3VycnlgLFxuICAgICAqIGBkZWJvdW5jZWAsIGBkZWZhdWx0c2AsIGBkZWZlcmAsIGBkZWxheWAsIGBkaWZmZXJlbmNlYCwgYGZpbHRlcmAsIGBmbGF0dGVuYCxcbiAgICAgKiBgZm9yRWFjaGAsIGBmb3JFYWNoUmlnaHRgLCBgZm9ySW5gLCBgZm9ySW5SaWdodGAsIGBmb3JPd25gLCBgZm9yT3duUmlnaHRgLFxuICAgICAqIGBmdW5jdGlvbnNgLCBgZ3JvdXBCeWAsIGBpbmRleEJ5YCwgYGluaXRpYWxgLCBgaW50ZXJzZWN0aW9uYCwgYGludmVydGAsXG4gICAgICogYGludm9rZWAsIGBrZXlzYCwgYG1hcGAsIGBtYXhgLCBgbWVtb2l6ZWAsIGBtZXJnZWAsIGBtaW5gLCBgb2JqZWN0YCwgYG9taXRgLFxuICAgICAqIGBvbmNlYCwgYHBhaXJzYCwgYHBhcnRpYWxgLCBgcGFydGlhbFJpZ2h0YCwgYHBpY2tgLCBgcGx1Y2tgLCBgcHVsbGAsIGBwdXNoYCxcbiAgICAgKiBgcmFuZ2VgLCBgcmVqZWN0YCwgYHJlbW92ZWAsIGByZXN0YCwgYHJldmVyc2VgLCBgc2h1ZmZsZWAsIGBzbGljZWAsIGBzb3J0YCxcbiAgICAgKiBgc29ydEJ5YCwgYHNwbGljZWAsIGB0YXBgLCBgdGhyb3R0bGVgLCBgdGltZXNgLCBgdG9BcnJheWAsIGB0cmFuc2Zvcm1gLFxuICAgICAqIGB1bmlvbmAsIGB1bmlxYCwgYHVuc2hpZnRgLCBgdW56aXBgLCBgdmFsdWVzYCwgYHdoZXJlYCwgYHdpdGhvdXRgLCBgd3JhcGAsXG4gICAgICogYW5kIGB6aXBgXG4gICAgICpcbiAgICAgKiBUaGUgbm9uLWNoYWluYWJsZSB3cmFwcGVyIGZ1bmN0aW9ucyBhcmU6XG4gICAgICogYGNsb25lYCwgYGNsb25lRGVlcGAsIGBjb250YWluc2AsIGBlc2NhcGVgLCBgZXZlcnlgLCBgZmluZGAsIGBmaW5kSW5kZXhgLFxuICAgICAqIGBmaW5kS2V5YCwgYGZpbmRMYXN0YCwgYGZpbmRMYXN0SW5kZXhgLCBgZmluZExhc3RLZXlgLCBgaGFzYCwgYGlkZW50aXR5YCxcbiAgICAgKiBgaW5kZXhPZmAsIGBpc0FyZ3VtZW50c2AsIGBpc0FycmF5YCwgYGlzQm9vbGVhbmAsIGBpc0RhdGVgLCBgaXNFbGVtZW50YCxcbiAgICAgKiBgaXNFbXB0eWAsIGBpc0VxdWFsYCwgYGlzRmluaXRlYCwgYGlzRnVuY3Rpb25gLCBgaXNOYU5gLCBgaXNOdWxsYCwgYGlzTnVtYmVyYCxcbiAgICAgKiBgaXNPYmplY3RgLCBgaXNQbGFpbk9iamVjdGAsIGBpc1JlZ0V4cGAsIGBpc1N0cmluZ2AsIGBpc1VuZGVmaW5lZGAsIGBqb2luYCxcbiAgICAgKiBgbGFzdEluZGV4T2ZgLCBgbWl4aW5gLCBgbm9Db25mbGljdGAsIGBwYXJzZUludGAsIGBwb3BgLCBgcmFuZG9tYCwgYHJlZHVjZWAsXG4gICAgICogYHJlZHVjZVJpZ2h0YCwgYHJlc3VsdGAsIGBzaGlmdGAsIGBzaXplYCwgYHNvbWVgLCBgc29ydGVkSW5kZXhgLCBgcnVuSW5Db250ZXh0YCxcbiAgICAgKiBgdGVtcGxhdGVgLCBgdW5lc2NhcGVgLCBgdW5pcXVlSWRgLCBhbmQgYHZhbHVlYFxuICAgICAqXG4gICAgICogVGhlIHdyYXBwZXIgZnVuY3Rpb25zIGBmaXJzdGAgYW5kIGBsYXN0YCByZXR1cm4gd3JhcHBlZCB2YWx1ZXMgd2hlbiBgbmAgaXNcbiAgICAgKiBwcm92aWRlZCwgb3RoZXJ3aXNlIHRoZXkgcmV0dXJuIHVud3JhcHBlZCB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBFeHBsaWNpdCBjaGFpbmluZyBjYW4gYmUgZW5hYmxlZCBieSB1c2luZyB0aGUgYF8uY2hhaW5gIG1ldGhvZC5cbiAgICAgKlxuICAgICAqIEBuYW1lIF9cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAY2F0ZWdvcnkgQ2hhaW5pbmdcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB3cmFwIGluIGEgYGxvZGFzaGAgaW5zdGFuY2UuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhIGBsb2Rhc2hgIGluc3RhbmNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgd3JhcHBlZCA9IF8oWzEsIDIsIDNdKTtcbiAgICAgKlxuICAgICAqIC8vIHJldHVybnMgYW4gdW53cmFwcGVkIHZhbHVlXG4gICAgICogd3JhcHBlZC5yZWR1Y2UoZnVuY3Rpb24oc3VtLCBudW0pIHtcbiAgICAgKiAgIHJldHVybiBzdW0gKyBudW07XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gNlxuICAgICAqXG4gICAgICogLy8gcmV0dXJucyBhIHdyYXBwZWQgdmFsdWVcbiAgICAgKiB2YXIgc3F1YXJlcyA9IHdyYXBwZWQubWFwKGZ1bmN0aW9uKG51bSkge1xuICAgICAqICAgcmV0dXJuIG51bSAqIG51bTtcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIF8uaXNBcnJheShzcXVhcmVzKTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqXG4gICAgICogXy5pc0FycmF5KHNxdWFyZXMudmFsdWUoKSk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvZGFzaCh2YWx1ZSkge1xuICAgICAgLy8gZG9uJ3Qgd3JhcCBpZiBhbHJlYWR5IHdyYXBwZWQsIGV2ZW4gaWYgd3JhcHBlZCBieSBhIGRpZmZlcmVudCBgbG9kYXNoYCBjb25zdHJ1Y3RvclxuICAgICAgcmV0dXJuICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgIWlzQXJyYXkodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdfX3dyYXBwZWRfXycpKVxuICAgICAgID8gdmFsdWVcbiAgICAgICA6IG5ldyBsb2Rhc2hXcmFwcGVyKHZhbHVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIGZhc3QgcGF0aCBmb3IgY3JlYXRpbmcgYGxvZGFzaGAgd3JhcHBlciBvYmplY3RzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB3cmFwIGluIGEgYGxvZGFzaGAgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjaGFpbkFsbCBBIGZsYWcgdG8gZW5hYmxlIGNoYWluaW5nIGZvciBhbGwgbWV0aG9kc1xuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYSBgbG9kYXNoYCBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2Rhc2hXcmFwcGVyKHZhbHVlLCBjaGFpbkFsbCkge1xuICAgICAgdGhpcy5fX2NoYWluX18gPSAhIWNoYWluQWxsO1xuICAgICAgdGhpcy5fX3dyYXBwZWRfXyA9IHZhbHVlO1xuICAgIH1cbiAgICAvLyBlbnN1cmUgYG5ldyBsb2Rhc2hXcmFwcGVyYCBpcyBhbiBpbnN0YW5jZSBvZiBgbG9kYXNoYFxuICAgIGxvZGFzaFdyYXBwZXIucHJvdG90eXBlID0gbG9kYXNoLnByb3RvdHlwZTtcblxuICAgIC8qKlxuICAgICAqIEFuIG9iamVjdCB1c2VkIHRvIGZsYWcgZW52aXJvbm1lbnRzIGZlYXR1cmVzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgdmFyIHN1cHBvcnQgPSBsb2Rhc2guc3VwcG9ydCA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogRGV0ZWN0IGlmIGZ1bmN0aW9ucyBjYW4gYmUgZGVjb21waWxlZCBieSBgRnVuY3Rpb24jdG9TdHJpbmdgXG4gICAgICogKGFsbCBidXQgUFMzIGFuZCBvbGRlciBPcGVyYSBtb2JpbGUgYnJvd3NlcnMgJiBhdm9pZGVkIGluIFdpbmRvd3MgOCBhcHBzKS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBfLnN1cHBvcnRcbiAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICovXG4gICAgc3VwcG9ydC5mdW5jRGVjb21wID0gIWlzTmF0aXZlKGNvbnRleHQuV2luUlRFcnJvcikgJiYgcmVUaGlzLnRlc3QocnVuSW5Db250ZXh0KTtcblxuICAgIC8qKlxuICAgICAqIERldGVjdCBpZiBgRnVuY3Rpb24jbmFtZWAgaXMgc3VwcG9ydGVkIChhbGwgYnV0IElFKS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBfLnN1cHBvcnRcbiAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICovXG4gICAgc3VwcG9ydC5mdW5jTmFtZXMgPSB0eXBlb2YgRnVuY3Rpb24ubmFtZSA9PSAnc3RyaW5nJztcblxuICAgIC8qKlxuICAgICAqIEJ5IGRlZmF1bHQsIHRoZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzIHVzZWQgYnkgTG8tRGFzaCBhcmUgc2ltaWxhciB0byB0aG9zZSBpblxuICAgICAqIGVtYmVkZGVkIFJ1YnkgKEVSQikuIENoYW5nZSB0aGUgZm9sbG93aW5nIHRlbXBsYXRlIHNldHRpbmdzIHRvIHVzZSBhbHRlcm5hdGl2ZVxuICAgICAqIGRlbGltaXRlcnMuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgKi9cbiAgICBsb2Rhc2gudGVtcGxhdGVTZXR0aW5ncyA9IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBVc2VkIHRvIGRldGVjdCBgZGF0YWAgcHJvcGVydHkgdmFsdWVzIHRvIGJlIEhUTUwtZXNjYXBlZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgXy50ZW1wbGF0ZVNldHRpbmdzXG4gICAgICAgKiBAdHlwZSBSZWdFeHBcbiAgICAgICAqL1xuICAgICAgJ2VzY2FwZSc6IC88JS0oW1xcc1xcU10rPyklPi9nLFxuXG4gICAgICAvKipcbiAgICAgICAqIFVzZWQgdG8gZGV0ZWN0IGNvZGUgdG8gYmUgZXZhbHVhdGVkLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBfLnRlbXBsYXRlU2V0dGluZ3NcbiAgICAgICAqIEB0eXBlIFJlZ0V4cFxuICAgICAgICovXG4gICAgICAnZXZhbHVhdGUnOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuXG4gICAgICAvKipcbiAgICAgICAqIFVzZWQgdG8gZGV0ZWN0IGBkYXRhYCBwcm9wZXJ0eSB2YWx1ZXMgdG8gaW5qZWN0LlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBfLnRlbXBsYXRlU2V0dGluZ3NcbiAgICAgICAqIEB0eXBlIFJlZ0V4cFxuICAgICAgICovXG4gICAgICAnaW50ZXJwb2xhdGUnOiByZUludGVycG9sYXRlLFxuXG4gICAgICAvKipcbiAgICAgICAqIFVzZWQgdG8gcmVmZXJlbmNlIHRoZSBkYXRhIG9iamVjdCBpbiB0aGUgdGVtcGxhdGUgdGV4dC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgXy50ZW1wbGF0ZVNldHRpbmdzXG4gICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAqL1xuICAgICAgJ3ZhcmlhYmxlJzogJycsXG5cbiAgICAgIC8qKlxuICAgICAgICogVXNlZCB0byBpbXBvcnQgdmFyaWFibGVzIGludG8gdGhlIGNvbXBpbGVkIHRlbXBsYXRlLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBfLnRlbXBsYXRlU2V0dGluZ3NcbiAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICovXG4gICAgICAnaW1wb3J0cyc6IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSByZWZlcmVuY2UgdG8gdGhlIGBsb2Rhc2hgIGZ1bmN0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgXy50ZW1wbGF0ZVNldHRpbmdzLmltcG9ydHNcbiAgICAgICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgICdfJzogbG9kYXNoXG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYmluZGAgdGhhdCBjcmVhdGVzIHRoZSBib3VuZCBmdW5jdGlvbiBhbmRcbiAgICAgKiBzZXRzIGl0cyBtZXRhIGRhdGEuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGJpbmREYXRhIFRoZSBiaW5kIGRhdGEgYXJyYXkuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYm91bmQgZnVuY3Rpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmFzZUJpbmQoYmluZERhdGEpIHtcbiAgICAgIHZhciBmdW5jID0gYmluZERhdGFbMF0sXG4gICAgICAgICAgcGFydGlhbEFyZ3MgPSBiaW5kRGF0YVsyXSxcbiAgICAgICAgICB0aGlzQXJnID0gYmluZERhdGFbNF07XG5cbiAgICAgIGZ1bmN0aW9uIGJvdW5kKCkge1xuICAgICAgICAvLyBgRnVuY3Rpb24jYmluZGAgc3BlY1xuICAgICAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjMuNC41XG4gICAgICAgIGlmIChwYXJ0aWFsQXJncykge1xuICAgICAgICAgIC8vIGF2b2lkIGBhcmd1bWVudHNgIG9iamVjdCBkZW9wdGltaXphdGlvbnMgYnkgdXNpbmcgYHNsaWNlYCBpbnN0ZWFkXG4gICAgICAgICAgLy8gb2YgYEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsYCBhbmQgbm90IGFzc2lnbmluZyBgYXJndW1lbnRzYCB0byBhXG4gICAgICAgICAgLy8gdmFyaWFibGUgYXMgYSB0ZXJuYXJ5IGV4cHJlc3Npb25cbiAgICAgICAgICB2YXIgYXJncyA9IHNsaWNlKHBhcnRpYWxBcmdzKTtcbiAgICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbWltaWMgdGhlIGNvbnN0cnVjdG9yJ3MgYHJldHVybmAgYmVoYXZpb3JcbiAgICAgICAgLy8gaHR0cDovL2VzNS5naXRodWIuaW8vI3gxMy4yLjJcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkge1xuICAgICAgICAgIC8vIGVuc3VyZSBgbmV3IGJvdW5kYCBpcyBhbiBpbnN0YW5jZSBvZiBgZnVuY2BcbiAgICAgICAgICB2YXIgdGhpc0JpbmRpbmcgPSBiYXNlQ3JlYXRlKGZ1bmMucHJvdG90eXBlKSxcbiAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQmluZGluZywgYXJncyB8fCBhcmd1bWVudHMpO1xuICAgICAgICAgIHJldHVybiBpc09iamVjdChyZXN1bHQpID8gcmVzdWx0IDogdGhpc0JpbmRpbmc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyB8fCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgc2V0QmluZERhdGEoYm91bmQsIGJpbmREYXRhKTtcbiAgICAgIHJldHVybiBib3VuZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jbG9uZWAgd2l0aG91dCBhcmd1bWVudCBqdWdnbGluZyBvciBzdXBwb3J0XG4gICAgICogZm9yIGB0aGlzQXJnYCBiaW5kaW5nLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXA9ZmFsc2VdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nIHZhbHVlcy5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tBPVtdXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSBvYmplY3RzLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0I9W11dIEFzc29jaWF0ZXMgY2xvbmVzIHdpdGggc291cmNlIGNvdW50ZXJwYXJ0cy5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJhc2VDbG9uZSh2YWx1ZSwgaXNEZWVwLCBjYWxsYmFjaywgc3RhY2tBLCBzdGFja0IpIHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2sodmFsdWUpO1xuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGluc3BlY3QgW1tDbGFzc11dXG4gICAgICB2YXIgaXNPYmogPSBpc09iamVjdCh2YWx1ZSk7XG4gICAgICBpZiAoaXNPYmopIHtcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICAgICAgICBpZiAoIWNsb25lYWJsZUNsYXNzZXNbY2xhc3NOYW1lXSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY3RvciA9IGN0b3JCeUNsYXNzW2NsYXNzTmFtZV07XG4gICAgICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAgICAgY2FzZSBib29sQ2xhc3M6XG4gICAgICAgICAgY2FzZSBkYXRlQ2xhc3M6XG4gICAgICAgICAgICByZXR1cm4gbmV3IGN0b3IoK3ZhbHVlKTtcblxuICAgICAgICAgIGNhc2UgbnVtYmVyQ2xhc3M6XG4gICAgICAgICAgY2FzZSBzdHJpbmdDbGFzczpcbiAgICAgICAgICAgIHJldHVybiBuZXcgY3Rvcih2YWx1ZSk7XG5cbiAgICAgICAgICBjYXNlIHJlZ2V4cENsYXNzOlxuICAgICAgICAgICAgcmVzdWx0ID0gY3Rvcih2YWx1ZS5zb3VyY2UsIHJlRmxhZ3MuZXhlYyh2YWx1ZSkpO1xuICAgICAgICAgICAgcmVzdWx0Lmxhc3RJbmRleCA9IHZhbHVlLmxhc3RJbmRleDtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpO1xuICAgICAgaWYgKGlzRGVlcCkge1xuICAgICAgICAvLyBjaGVjayBmb3IgY2lyY3VsYXIgcmVmZXJlbmNlcyBhbmQgcmV0dXJuIGNvcnJlc3BvbmRpbmcgY2xvbmVcbiAgICAgICAgdmFyIGluaXRlZFN0YWNrID0gIXN0YWNrQTtcbiAgICAgICAgc3RhY2tBIHx8IChzdGFja0EgPSBnZXRBcnJheSgpKTtcbiAgICAgICAgc3RhY2tCIHx8IChzdGFja0IgPSBnZXRBcnJheSgpKTtcblxuICAgICAgICB2YXIgbGVuZ3RoID0gc3RhY2tBLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgICAgaWYgKHN0YWNrQVtsZW5ndGhdID09IHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhY2tCW2xlbmd0aF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IGlzQXJyID8gY3Rvcih2YWx1ZS5sZW5ndGgpIDoge307XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gaXNBcnIgPyBzbGljZSh2YWx1ZSkgOiBhc3NpZ24oe30sIHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIC8vIGFkZCBhcnJheSBwcm9wZXJ0aWVzIGFzc2lnbmVkIGJ5IGBSZWdFeHAjZXhlY2BcbiAgICAgIGlmIChpc0Fycikge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2luZGV4JykpIHtcbiAgICAgICAgICByZXN1bHQuaW5kZXggPSB2YWx1ZS5pbmRleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2lucHV0JykpIHtcbiAgICAgICAgICByZXN1bHQuaW5wdXQgPSB2YWx1ZS5pbnB1dDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gZXhpdCBmb3Igc2hhbGxvdyBjbG9uZVxuICAgICAgaWYgKCFpc0RlZXApIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIC8vIGFkZCB0aGUgc291cmNlIHZhbHVlIHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0c1xuICAgICAgLy8gYW5kIGFzc29jaWF0ZSBpdCB3aXRoIGl0cyBjbG9uZVxuICAgICAgc3RhY2tBLnB1c2godmFsdWUpO1xuICAgICAgc3RhY2tCLnB1c2gocmVzdWx0KTtcblxuICAgICAgLy8gcmVjdXJzaXZlbHkgcG9wdWxhdGUgY2xvbmUgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKVxuICAgICAgKGlzQXJyID8gZm9yRWFjaCA6IGZvck93bikodmFsdWUsIGZ1bmN0aW9uKG9ialZhbHVlLCBrZXkpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBiYXNlQ2xvbmUob2JqVmFsdWUsIGlzRGVlcCwgY2FsbGJhY2ssIHN0YWNrQSwgc3RhY2tCKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoaW5pdGVkU3RhY2spIHtcbiAgICAgICAgcmVsZWFzZUFycmF5KHN0YWNrQSk7XG4gICAgICAgIHJlbGVhc2VBcnJheShzdGFja0IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXNzaWduaW5nXG4gICAgICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm90b3R5cGUgVGhlIG9iamVjdCB0byBpbmhlcml0IGZyb20uXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiYXNlQ3JlYXRlKHByb3RvdHlwZSwgcHJvcGVydGllcykge1xuICAgICAgcmV0dXJuIGlzT2JqZWN0KHByb3RvdHlwZSkgPyBuYXRpdmVDcmVhdGUocHJvdG90eXBlKSA6IHt9O1xuICAgIH1cbiAgICAvLyBmYWxsYmFjayBmb3IgYnJvd3NlcnMgd2l0aG91dCBgT2JqZWN0LmNyZWF0ZWBcbiAgICBpZiAoIW5hdGl2ZUNyZWF0ZSkge1xuICAgICAgYmFzZUNyZWF0ZSA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuY3Rpb24gT2JqZWN0KCkge31cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHByb3RvdHlwZSkge1xuICAgICAgICAgIGlmIChpc09iamVjdChwcm90b3R5cGUpKSB7XG4gICAgICAgICAgICBPYmplY3QucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBPYmplY3Q7XG4gICAgICAgICAgICBPYmplY3QucHJvdG90eXBlID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBjb250ZXh0Lk9iamVjdCgpO1xuICAgICAgICB9O1xuICAgICAgfSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVDYWxsYmFja2Agd2l0aG91dCBzdXBwb3J0IGZvciBjcmVhdGluZ1xuICAgICAqIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSBbZnVuYz1pZGVudGl0eV0gVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBjYWxsYmFjay5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIGNyZWF0ZWQgY2FsbGJhY2suXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthcmdDb3VudF0gVGhlIG51bWJlciBvZiBhcmd1bWVudHMgdGhlIGNhbGxiYWNrIGFjY2VwdHMuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGEgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmFzZUNyZWF0ZUNhbGxiYWNrKGZ1bmMsIHRoaXNBcmcsIGFyZ0NvdW50KSB7XG4gICAgICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gaWRlbnRpdHk7XG4gICAgICB9XG4gICAgICAvLyBleGl0IGVhcmx5IGZvciBubyBgdGhpc0FyZ2Agb3IgYWxyZWFkeSBib3VuZCBieSBgRnVuY3Rpb24jYmluZGBcbiAgICAgIGlmICh0eXBlb2YgdGhpc0FyZyA9PSAndW5kZWZpbmVkJyB8fCAhKCdwcm90b3R5cGUnIGluIGZ1bmMpKSB7XG4gICAgICAgIHJldHVybiBmdW5jO1xuICAgICAgfVxuICAgICAgdmFyIGJpbmREYXRhID0gZnVuYy5fX2JpbmREYXRhX187XG4gICAgICBpZiAodHlwZW9mIGJpbmREYXRhID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmIChzdXBwb3J0LmZ1bmNOYW1lcykge1xuICAgICAgICAgIGJpbmREYXRhID0gIWZ1bmMubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBiaW5kRGF0YSA9IGJpbmREYXRhIHx8ICFzdXBwb3J0LmZ1bmNEZWNvbXA7XG4gICAgICAgIGlmICghYmluZERhdGEpIHtcbiAgICAgICAgICB2YXIgc291cmNlID0gZm5Ub1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgICAgICAgIGlmICghc3VwcG9ydC5mdW5jTmFtZXMpIHtcbiAgICAgICAgICAgIGJpbmREYXRhID0gIXJlRnVuY05hbWUudGVzdChzb3VyY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWJpbmREYXRhKSB7XG4gICAgICAgICAgICAvLyBjaGVja3MgaWYgYGZ1bmNgIHJlZmVyZW5jZXMgdGhlIGB0aGlzYCBrZXl3b3JkIGFuZCBzdG9yZXMgdGhlIHJlc3VsdFxuICAgICAgICAgICAgYmluZERhdGEgPSByZVRoaXMudGVzdChzb3VyY2UpO1xuICAgICAgICAgICAgc2V0QmluZERhdGEoZnVuYywgYmluZERhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gZXhpdCBlYXJseSBpZiB0aGVyZSBhcmUgbm8gYHRoaXNgIHJlZmVyZW5jZXMgb3IgYGZ1bmNgIGlzIGJvdW5kXG4gICAgICBpZiAoYmluZERhdGEgPT09IGZhbHNlIHx8IChiaW5kRGF0YSAhPT0gdHJ1ZSAmJiBiaW5kRGF0YVsxXSAmIDEpKSB7XG4gICAgICAgIHJldHVybiBmdW5jO1xuICAgICAgfVxuICAgICAgc3dpdGNoIChhcmdDb3VudCkge1xuICAgICAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUpO1xuICAgICAgICB9O1xuICAgICAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhLCBiKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgICB9O1xuICAgICAgICBjYXNlIDQ6IHJldHVybiBmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBiaW5kKGZ1bmMsIHRoaXNBcmcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBjcmVhdGVXcmFwcGVyYCB0aGF0IGNyZWF0ZXMgdGhlIHdyYXBwZXIgYW5kXG4gICAgICogc2V0cyBpdHMgbWV0YSBkYXRhLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBiaW5kRGF0YSBUaGUgYmluZCBkYXRhIGFycmF5LlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJhc2VDcmVhdGVXcmFwcGVyKGJpbmREYXRhKSB7XG4gICAgICB2YXIgZnVuYyA9IGJpbmREYXRhWzBdLFxuICAgICAgICAgIGJpdG1hc2sgPSBiaW5kRGF0YVsxXSxcbiAgICAgICAgICBwYXJ0aWFsQXJncyA9IGJpbmREYXRhWzJdLFxuICAgICAgICAgIHBhcnRpYWxSaWdodEFyZ3MgPSBiaW5kRGF0YVszXSxcbiAgICAgICAgICB0aGlzQXJnID0gYmluZERhdGFbNF0sXG4gICAgICAgICAgYXJpdHkgPSBiaW5kRGF0YVs1XTtcblxuICAgICAgdmFyIGlzQmluZCA9IGJpdG1hc2sgJiAxLFxuICAgICAgICAgIGlzQmluZEtleSA9IGJpdG1hc2sgJiAyLFxuICAgICAgICAgIGlzQ3VycnkgPSBiaXRtYXNrICYgNCxcbiAgICAgICAgICBpc0N1cnJ5Qm91bmQgPSBiaXRtYXNrICYgOCxcbiAgICAgICAgICBrZXkgPSBmdW5jO1xuXG4gICAgICBmdW5jdGlvbiBib3VuZCgpIHtcbiAgICAgICAgdmFyIHRoaXNCaW5kaW5nID0gaXNCaW5kID8gdGhpc0FyZyA6IHRoaXM7XG4gICAgICAgIGlmIChwYXJ0aWFsQXJncykge1xuICAgICAgICAgIHZhciBhcmdzID0gc2xpY2UocGFydGlhbEFyZ3MpO1xuICAgICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydGlhbFJpZ2h0QXJncyB8fCBpc0N1cnJ5KSB7XG4gICAgICAgICAgYXJncyB8fCAoYXJncyA9IHNsaWNlKGFyZ3VtZW50cykpO1xuICAgICAgICAgIGlmIChwYXJ0aWFsUmlnaHRBcmdzKSB7XG4gICAgICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIHBhcnRpYWxSaWdodEFyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNDdXJyeSAmJiBhcmdzLmxlbmd0aCA8IGFyaXR5KSB7XG4gICAgICAgICAgICBiaXRtYXNrIHw9IDE2ICYgfjMyO1xuICAgICAgICAgICAgcmV0dXJuIGJhc2VDcmVhdGVXcmFwcGVyKFtmdW5jLCAoaXNDdXJyeUJvdW5kID8gYml0bWFzayA6IGJpdG1hc2sgJiB+MyksIGFyZ3MsIG51bGwsIHRoaXNBcmcsIGFyaXR5XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFyZ3MgfHwgKGFyZ3MgPSBhcmd1bWVudHMpO1xuICAgICAgICBpZiAoaXNCaW5kS2V5KSB7XG4gICAgICAgICAgZnVuYyA9IHRoaXNCaW5kaW5nW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkge1xuICAgICAgICAgIHRoaXNCaW5kaW5nID0gYmFzZUNyZWF0ZShmdW5jLnByb3RvdHlwZSk7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0JpbmRpbmcsIGFyZ3MpO1xuICAgICAgICAgIHJldHVybiBpc09iamVjdChyZXN1bHQpID8gcmVzdWx0IDogdGhpc0JpbmRpbmc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0JpbmRpbmcsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgc2V0QmluZERhdGEoYm91bmQsIGJpbmREYXRhKTtcbiAgICAgIHJldHVybiBib3VuZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5kaWZmZXJlbmNlYCB0aGF0IGFjY2VwdHMgYSBzaW5nbGUgYXJyYXlcbiAgICAgKiBvZiB2YWx1ZXMgdG8gZXhjbHVkZS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHByb2Nlc3MuXG4gICAgICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlc10gVGhlIGFycmF5IG9mIHZhbHVlcyB0byBleGNsdWRlLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiBmaWx0ZXJlZCB2YWx1ZXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmFzZURpZmZlcmVuY2UoYXJyYXksIHZhbHVlcykge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgaW5kZXhPZiA9IGdldEluZGV4T2YoKSxcbiAgICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDAsXG4gICAgICAgICAgaXNMYXJnZSA9IGxlbmd0aCA+PSBsYXJnZUFycmF5U2l6ZSAmJiBpbmRleE9mID09PSBiYXNlSW5kZXhPZixcbiAgICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgICAgaWYgKGlzTGFyZ2UpIHtcbiAgICAgICAgdmFyIGNhY2hlID0gY3JlYXRlQ2FjaGUodmFsdWVzKTtcbiAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgaW5kZXhPZiA9IGNhY2hlSW5kZXhPZjtcbiAgICAgICAgICB2YWx1ZXMgPSBjYWNoZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpc0xhcmdlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICAgICAgaWYgKGluZGV4T2YodmFsdWVzLCB2YWx1ZSkgPCAwKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNMYXJnZSkge1xuICAgICAgICByZWxlYXNlT2JqZWN0KHZhbHVlcyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZsYXR0ZW5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgY2FsbGJhY2tcbiAgICAgKiBzaG9ydGhhbmRzIG9yIGB0aGlzQXJnYCBiaW5kaW5nLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1NoYWxsb3c9ZmFsc2VdIEEgZmxhZyB0byByZXN0cmljdCBmbGF0dGVuaW5nIHRvIGEgc2luZ2xlIGxldmVsLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU3RyaWN0PWZhbHNlXSBBIGZsYWcgdG8gcmVzdHJpY3QgZmxhdHRlbmluZyB0byBhcnJheXMgYW5kIGBhcmd1bWVudHNgIG9iamVjdHMuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHN0YXJ0IGZyb20uXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiYXNlRmxhdHRlbihhcnJheSwgaXNTaGFsbG93LCBpc1N0cmljdCwgZnJvbUluZGV4KSB7XG4gICAgICB2YXIgaW5kZXggPSAoZnJvbUluZGV4IHx8IDApIC0gMSxcbiAgICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDAsXG4gICAgICAgICAgcmVzdWx0ID0gW107XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcblxuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT0gJ251bWJlcidcbiAgICAgICAgICAgICYmIChpc0FycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkpKSB7XG4gICAgICAgICAgLy8gcmVjdXJzaXZlbHkgZmxhdHRlbiBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKVxuICAgICAgICAgIGlmICghaXNTaGFsbG93KSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGJhc2VGbGF0dGVuKHZhbHVlLCBpc1NoYWxsb3csIGlzU3RyaWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbEluZGV4ID0gLTEsXG4gICAgICAgICAgICAgIHZhbExlbmd0aCA9IHZhbHVlLmxlbmd0aCxcbiAgICAgICAgICAgICAgcmVzSW5kZXggPSByZXN1bHQubGVuZ3RoO1xuXG4gICAgICAgICAgcmVzdWx0Lmxlbmd0aCArPSB2YWxMZW5ndGg7XG4gICAgICAgICAgd2hpbGUgKCsrdmFsSW5kZXggPCB2YWxMZW5ndGgpIHtcbiAgICAgICAgICAgIHJlc3VsdFtyZXNJbmRleCsrXSA9IHZhbHVlW3ZhbEluZGV4XTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIWlzU3RyaWN0KSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzRXF1YWxgLCB3aXRob3V0IHN1cHBvcnQgZm9yIGB0aGlzQXJnYCBiaW5kaW5nLFxuICAgICAqIHRoYXQgYWxsb3dzIHBhcnRpYWwgXCJfLndoZXJlXCIgc3R5bGUgY29tcGFyaXNvbnMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gYSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAgICAgKiBAcGFyYW0geyp9IGIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmluZyB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2lzV2hlcmU9ZmFsc2VdIEEgZmxhZyB0byBpbmRpY2F0ZSBwZXJmb3JtaW5nIHBhcnRpYWwgY29tcGFyaXNvbnMuXG4gICAgICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQT1bXV0gVHJhY2tzIHRyYXZlcnNlZCBgYWAgb2JqZWN0cy5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCPVtdXSBUcmFja3MgdHJhdmVyc2VkIGBiYCBvYmplY3RzLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmFzZUlzRXF1YWwoYSwgYiwgY2FsbGJhY2ssIGlzV2hlcmUsIHN0YWNrQSwgc3RhY2tCKSB7XG4gICAgICAvLyB1c2VkIHRvIGluZGljYXRlIHRoYXQgd2hlbiBjb21wYXJpbmcgb2JqZWN0cywgYGFgIGhhcyBhdCBsZWFzdCB0aGUgcHJvcGVydGllcyBvZiBgYmBcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2soYSwgYik7XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgcmV0dXJuICEhcmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBleGl0IGVhcmx5IGZvciBpZGVudGljYWwgdmFsdWVzXG4gICAgICBpZiAoYSA9PT0gYikge1xuICAgICAgICAvLyB0cmVhdCBgKzBgIHZzLiBgLTBgIGFzIG5vdCBlcXVhbFxuICAgICAgICByZXR1cm4gYSAhPT0gMCB8fCAoMSAvIGEgPT0gMSAvIGIpO1xuICAgICAgfVxuICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgYSxcbiAgICAgICAgICBvdGhlclR5cGUgPSB0eXBlb2YgYjtcblxuICAgICAgLy8gZXhpdCBlYXJseSBmb3IgdW5saWtlIHByaW1pdGl2ZSB2YWx1ZXNcbiAgICAgIGlmIChhID09PSBhICYmXG4gICAgICAgICAgIShhICYmIG9iamVjdFR5cGVzW3R5cGVdKSAmJlxuICAgICAgICAgICEoYiAmJiBvYmplY3RUeXBlc1tvdGhlclR5cGVdKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBleGl0IGVhcmx5IGZvciBgbnVsbGAgYW5kIGB1bmRlZmluZWRgIGF2b2lkaW5nIEVTMydzIEZ1bmN0aW9uI2NhbGwgYmVoYXZpb3JcbiAgICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuMy40LjRcbiAgICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhID09PSBiO1xuICAgICAgfVxuICAgICAgLy8gY29tcGFyZSBbW0NsYXNzXV0gbmFtZXNcbiAgICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpLFxuICAgICAgICAgIG90aGVyQ2xhc3MgPSB0b1N0cmluZy5jYWxsKGIpO1xuXG4gICAgICBpZiAoY2xhc3NOYW1lID09IGFyZ3NDbGFzcykge1xuICAgICAgICBjbGFzc05hbWUgPSBvYmplY3RDbGFzcztcbiAgICAgIH1cbiAgICAgIGlmIChvdGhlckNsYXNzID09IGFyZ3NDbGFzcykge1xuICAgICAgICBvdGhlckNsYXNzID0gb2JqZWN0Q2xhc3M7XG4gICAgICB9XG4gICAgICBpZiAoY2xhc3NOYW1lICE9IG90aGVyQ2xhc3MpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgICAgY2FzZSBib29sQ2xhc3M6XG4gICAgICAgIGNhc2UgZGF0ZUNsYXNzOlxuICAgICAgICAgIC8vIGNvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtYmVycywgZGF0ZXMgdG8gbWlsbGlzZWNvbmRzIGFuZCBib29sZWFuc1xuICAgICAgICAgIC8vIHRvIGAxYCBvciBgMGAgdHJlYXRpbmcgaW52YWxpZCBkYXRlcyBjb2VyY2VkIHRvIGBOYU5gIGFzIG5vdCBlcXVhbFxuICAgICAgICAgIHJldHVybiArYSA9PSArYjtcblxuICAgICAgICBjYXNlIG51bWJlckNsYXNzOlxuICAgICAgICAgIC8vIHRyZWF0IGBOYU5gIHZzLiBgTmFOYCBhcyBlcXVhbFxuICAgICAgICAgIHJldHVybiAoYSAhPSArYSlcbiAgICAgICAgICAgID8gYiAhPSArYlxuICAgICAgICAgICAgLy8gYnV0IHRyZWF0IGArMGAgdnMuIGAtMGAgYXMgbm90IGVxdWFsXG4gICAgICAgICAgICA6IChhID09IDAgPyAoMSAvIGEgPT0gMSAvIGIpIDogYSA9PSArYik7XG5cbiAgICAgICAgY2FzZSByZWdleHBDbGFzczpcbiAgICAgICAgY2FzZSBzdHJpbmdDbGFzczpcbiAgICAgICAgICAvLyBjb2VyY2UgcmVnZXhlcyB0byBzdHJpbmdzIChodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjEwLjYuNClcbiAgICAgICAgICAvLyB0cmVhdCBzdHJpbmcgcHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3QgaW5zdGFuY2VzIGFzIGVxdWFsXG4gICAgICAgICAgcmV0dXJuIGEgPT0gU3RyaW5nKGIpO1xuICAgICAgfVxuICAgICAgdmFyIGlzQXJyID0gY2xhc3NOYW1lID09IGFycmF5Q2xhc3M7XG4gICAgICBpZiAoIWlzQXJyKSB7XG4gICAgICAgIC8vIHVud3JhcCBhbnkgYGxvZGFzaGAgd3JhcHBlZCB2YWx1ZXNcbiAgICAgICAgdmFyIGFXcmFwcGVkID0gaGFzT3duUHJvcGVydHkuY2FsbChhLCAnX193cmFwcGVkX18nKSxcbiAgICAgICAgICAgIGJXcmFwcGVkID0gaGFzT3duUHJvcGVydHkuY2FsbChiLCAnX193cmFwcGVkX18nKTtcblxuICAgICAgICBpZiAoYVdyYXBwZWQgfHwgYldyYXBwZWQpIHtcbiAgICAgICAgICByZXR1cm4gYmFzZUlzRXF1YWwoYVdyYXBwZWQgPyBhLl9fd3JhcHBlZF9fIDogYSwgYldyYXBwZWQgPyBiLl9fd3JhcHBlZF9fIDogYiwgY2FsbGJhY2ssIGlzV2hlcmUsIHN0YWNrQSwgc3RhY2tCKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBleGl0IGZvciBmdW5jdGlvbnMgYW5kIERPTSBub2Rlc1xuICAgICAgICBpZiAoY2xhc3NOYW1lICE9IG9iamVjdENsYXNzKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGluIG9sZGVyIHZlcnNpb25zIG9mIE9wZXJhLCBgYXJndW1lbnRzYCBvYmplY3RzIGhhdmUgYEFycmF5YCBjb25zdHJ1Y3RvcnNcbiAgICAgICAgdmFyIGN0b3JBID0gYS5jb25zdHJ1Y3RvcixcbiAgICAgICAgICAgIGN0b3JCID0gYi5jb25zdHJ1Y3RvcjtcblxuICAgICAgICAvLyBub24gYE9iamVjdGAgb2JqZWN0IGluc3RhbmNlcyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVhbFxuICAgICAgICBpZiAoY3RvckEgIT0gY3RvckIgJiZcbiAgICAgICAgICAgICAgIShpc0Z1bmN0aW9uKGN0b3JBKSAmJiBjdG9yQSBpbnN0YW5jZW9mIGN0b3JBICYmIGlzRnVuY3Rpb24oY3RvckIpICYmIGN0b3JCIGluc3RhbmNlb2YgY3RvckIpICYmXG4gICAgICAgICAgICAgICgnY29uc3RydWN0b3InIGluIGEgJiYgJ2NvbnN0cnVjdG9yJyBpbiBiKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBhc3N1bWUgY3ljbGljIHN0cnVjdHVyZXMgYXJlIGVxdWFsXG4gICAgICAvLyB0aGUgYWxnb3JpdGhtIGZvciBkZXRlY3RpbmcgY3ljbGljIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMVxuICAgICAgLy8gc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYCAoaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNS4xMi4zKVxuICAgICAgdmFyIGluaXRlZFN0YWNrID0gIXN0YWNrQTtcbiAgICAgIHN0YWNrQSB8fCAoc3RhY2tBID0gZ2V0QXJyYXkoKSk7XG4gICAgICBzdGFja0IgfHwgKHN0YWNrQiA9IGdldEFycmF5KCkpO1xuXG4gICAgICB2YXIgbGVuZ3RoID0gc3RhY2tBLmxlbmd0aDtcbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBpZiAoc3RhY2tBW2xlbmd0aF0gPT0gYSkge1xuICAgICAgICAgIHJldHVybiBzdGFja0JbbGVuZ3RoXSA9PSBiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgc2l6ZSA9IDA7XG4gICAgICByZXN1bHQgPSB0cnVlO1xuXG4gICAgICAvLyBhZGQgYGFgIGFuZCBgYmAgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzXG4gICAgICBzdGFja0EucHVzaChhKTtcbiAgICAgIHN0YWNrQi5wdXNoKGIpO1xuXG4gICAgICAvLyByZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpXG4gICAgICBpZiAoaXNBcnIpIHtcbiAgICAgICAgLy8gY29tcGFyZSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnlcbiAgICAgICAgbGVuZ3RoID0gYS5sZW5ndGg7XG4gICAgICAgIHNpemUgPSBiLmxlbmd0aDtcbiAgICAgICAgcmVzdWx0ID0gc2l6ZSA9PSBsZW5ndGg7XG5cbiAgICAgICAgaWYgKHJlc3VsdCB8fCBpc1doZXJlKSB7XG4gICAgICAgICAgLy8gZGVlcCBjb21wYXJlIHRoZSBjb250ZW50cywgaWdub3Jpbmcgbm9uLW51bWVyaWMgcHJvcGVydGllc1xuICAgICAgICAgIHdoaWxlIChzaXplLS0pIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGxlbmd0aCxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGJbc2l6ZV07XG5cbiAgICAgICAgICAgIGlmIChpc1doZXJlKSB7XG4gICAgICAgICAgICAgIHdoaWxlIChpbmRleC0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKChyZXN1bHQgPSBiYXNlSXNFcXVhbChhW2luZGV4XSwgdmFsdWUsIGNhbGxiYWNrLCBpc1doZXJlLCBzdGFja0EsIHN0YWNrQikpKSB7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIShyZXN1bHQgPSBiYXNlSXNFcXVhbChhW3NpemVdLCB2YWx1ZSwgY2FsbGJhY2ssIGlzV2hlcmUsIHN0YWNrQSwgc3RhY2tCKSkpIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gZGVlcCBjb21wYXJlIG9iamVjdHMgdXNpbmcgYGZvckluYCwgaW5zdGVhZCBvZiBgZm9yT3duYCwgdG8gYXZvaWQgYE9iamVjdC5rZXlzYFxuICAgICAgICAvLyB3aGljaCwgaW4gdGhpcyBjYXNlLCBpcyBtb3JlIGNvc3RseVxuICAgICAgICBmb3JJbihiLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBiKSB7XG4gICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoYiwga2V5KSkge1xuICAgICAgICAgICAgLy8gY291bnQgdGhlIG51bWJlciBvZiBwcm9wZXJ0aWVzLlxuICAgICAgICAgICAgc2l6ZSsrO1xuICAgICAgICAgICAgLy8gZGVlcCBjb21wYXJlIGVhY2ggcHJvcGVydHkgdmFsdWUuXG4gICAgICAgICAgICByZXR1cm4gKHJlc3VsdCA9IGhhc093blByb3BlcnR5LmNhbGwoYSwga2V5KSAmJiBiYXNlSXNFcXVhbChhW2tleV0sIHZhbHVlLCBjYWxsYmFjaywgaXNXaGVyZSwgc3RhY2tBLCBzdGFja0IpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZXN1bHQgJiYgIWlzV2hlcmUpIHtcbiAgICAgICAgICAvLyBlbnN1cmUgYm90aCBvYmplY3RzIGhhdmUgdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXNcbiAgICAgICAgICBmb3JJbihhLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBhKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChhLCBrZXkpKSB7XG4gICAgICAgICAgICAgIC8vIGBzaXplYCB3aWxsIGJlIGAtMWAgaWYgYGFgIGhhcyBtb3JlIHByb3BlcnRpZXMgdGhhbiBgYmBcbiAgICAgICAgICAgICAgcmV0dXJuIChyZXN1bHQgPSAtLXNpemUgPiAtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHN0YWNrQS5wb3AoKTtcbiAgICAgIHN0YWNrQi5wb3AoKTtcblxuICAgICAgaWYgKGluaXRlZFN0YWNrKSB7XG4gICAgICAgIHJlbGVhc2VBcnJheShzdGFja0EpO1xuICAgICAgICByZWxlYXNlQXJyYXkoc3RhY2tCKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWVyZ2VgIHdpdGhvdXQgYXJndW1lbnQganVnZ2xpbmcgb3Igc3VwcG9ydFxuICAgICAqIGZvciBgdGhpc0FyZ2AgYmluZGluZy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIHNvdXJjZSBvYmplY3QuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIG1lcmdpbmcgcHJvcGVydGllcy5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tBPVtdXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSBvYmplY3RzLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0I9W11dIEFzc29jaWF0ZXMgdmFsdWVzIHdpdGggc291cmNlIGNvdW50ZXJwYXJ0cy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiYXNlTWVyZ2Uob2JqZWN0LCBzb3VyY2UsIGNhbGxiYWNrLCBzdGFja0EsIHN0YWNrQikge1xuICAgICAgKGlzQXJyYXkoc291cmNlKSA/IGZvckVhY2ggOiBmb3JPd24pKHNvdXJjZSwgZnVuY3Rpb24oc291cmNlLCBrZXkpIHtcbiAgICAgICAgdmFyIGZvdW5kLFxuICAgICAgICAgICAgaXNBcnIsXG4gICAgICAgICAgICByZXN1bHQgPSBzb3VyY2UsXG4gICAgICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuXG4gICAgICAgIGlmIChzb3VyY2UgJiYgKChpc0FyciA9IGlzQXJyYXkoc291cmNlKSkgfHwgaXNQbGFpbk9iamVjdChzb3VyY2UpKSkge1xuICAgICAgICAgIC8vIGF2b2lkIG1lcmdpbmcgcHJldmlvdXNseSBtZXJnZWQgY3ljbGljIHNvdXJjZXNcbiAgICAgICAgICB2YXIgc3RhY2tMZW5ndGggPSBzdGFja0EubGVuZ3RoO1xuICAgICAgICAgIHdoaWxlIChzdGFja0xlbmd0aC0tKSB7XG4gICAgICAgICAgICBpZiAoKGZvdW5kID0gc3RhY2tBW3N0YWNrTGVuZ3RoXSA9PSBzb3VyY2UpKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gc3RhY2tCW3N0YWNrTGVuZ3RoXTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgIHZhciBpc1NoYWxsb3c7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gY2FsbGJhY2sodmFsdWUsIHNvdXJjZSk7XG4gICAgICAgICAgICAgIGlmICgoaXNTaGFsbG93ID0gdHlwZW9mIHJlc3VsdCAhPSAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1NoYWxsb3cpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSBpc0FyclxuICAgICAgICAgICAgICAgID8gKGlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbXSlcbiAgICAgICAgICAgICAgICA6IChpc1BsYWluT2JqZWN0KHZhbHVlKSA/IHZhbHVlIDoge30pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYWRkIGBzb3VyY2VgIGFuZCBhc3NvY2lhdGVkIGB2YWx1ZWAgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzXG4gICAgICAgICAgICBzdGFja0EucHVzaChzb3VyY2UpO1xuICAgICAgICAgICAgc3RhY2tCLnB1c2godmFsdWUpO1xuXG4gICAgICAgICAgICAvLyByZWN1cnNpdmVseSBtZXJnZSBvYmplY3RzIGFuZCBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKVxuICAgICAgICAgICAgaWYgKCFpc1NoYWxsb3cpIHtcbiAgICAgICAgICAgICAgYmFzZU1lcmdlKHZhbHVlLCBzb3VyY2UsIGNhbGxiYWNrLCBzdGFja0EsIHN0YWNrQik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgcmVzdWx0ID0gY2FsbGJhY2sodmFsdWUsIHNvdXJjZSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICByZXN1bHQgPSBzb3VyY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJhbmRvbWAgd2l0aG91dCBhcmd1bWVudCBqdWdnbGluZyBvciBzdXBwb3J0XG4gICAgICogZm9yIHJldHVybmluZyBmbG9hdGluZy1wb2ludCBudW1iZXJzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWluIFRoZSBtaW5pbXVtIHBvc3NpYmxlIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXggVGhlIG1heGltdW0gcG9zc2libGUgdmFsdWUuXG4gICAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyBhIHJhbmRvbSBudW1iZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmFzZVJhbmRvbShtaW4sIG1heCkge1xuICAgICAgcmV0dXJuIG1pbiArIGZsb29yKG5hdGl2ZVJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmlxYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrIHNob3J0aGFuZHNcbiAgICAgKiBvciBgdGhpc0FyZ2AgYmluZGluZy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHByb2Nlc3MuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaXNTb3J0ZWQ9ZmFsc2VdIEEgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IGBhcnJheWAgaXMgc29ydGVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIGR1cGxpY2F0ZS12YWx1ZS1mcmVlIGFycmF5LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJhc2VVbmlxKGFycmF5LCBpc1NvcnRlZCwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGluZGV4T2YgPSBnZXRJbmRleE9mKCksXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgICB2YXIgaXNMYXJnZSA9ICFpc1NvcnRlZCAmJiBsZW5ndGggPj0gbGFyZ2VBcnJheVNpemUgJiYgaW5kZXhPZiA9PT0gYmFzZUluZGV4T2YsXG4gICAgICAgICAgc2VlbiA9IChjYWxsYmFjayB8fCBpc0xhcmdlKSA/IGdldEFycmF5KCkgOiByZXN1bHQ7XG5cbiAgICAgIGlmIChpc0xhcmdlKSB7XG4gICAgICAgIHZhciBjYWNoZSA9IGNyZWF0ZUNhY2hlKHNlZW4pO1xuICAgICAgICBpbmRleE9mID0gY2FjaGVJbmRleE9mO1xuICAgICAgICBzZWVuID0gY2FjaGU7XG4gICAgICB9XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgICAgICBjb21wdXRlZCA9IGNhbGxiYWNrID8gY2FsbGJhY2sodmFsdWUsIGluZGV4LCBhcnJheSkgOiB2YWx1ZTtcblxuICAgICAgICBpZiAoaXNTb3J0ZWRcbiAgICAgICAgICAgICAgPyAhaW5kZXggfHwgc2VlbltzZWVuLmxlbmd0aCAtIDFdICE9PSBjb21wdXRlZFxuICAgICAgICAgICAgICA6IGluZGV4T2Yoc2VlbiwgY29tcHV0ZWQpIDwgMFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrIHx8IGlzTGFyZ2UpIHtcbiAgICAgICAgICAgIHNlZW4ucHVzaChjb21wdXRlZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzTGFyZ2UpIHtcbiAgICAgICAgcmVsZWFzZUFycmF5KHNlZW4uYXJyYXkpO1xuICAgICAgICByZWxlYXNlT2JqZWN0KHNlZW4pO1xuICAgICAgfSBlbHNlIGlmIChjYWxsYmFjaykge1xuICAgICAgICByZWxlYXNlQXJyYXkoc2Vlbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGFnZ3JlZ2F0ZXMgYSBjb2xsZWN0aW9uLCBjcmVhdGluZyBhbiBvYmplY3QgY29tcG9zZWRcbiAgICAgKiBvZiBrZXlzIGdlbmVyYXRlZCBmcm9tIHRoZSByZXN1bHRzIG9mIHJ1bm5pbmcgZWFjaCBlbGVtZW50IG9mIHRoZSBjb2xsZWN0aW9uXG4gICAgICogdGhyb3VnaCBhIGNhbGxiYWNrLiBUaGUgZ2l2ZW4gYHNldHRlcmAgZnVuY3Rpb24gc2V0cyB0aGUga2V5cyBhbmQgdmFsdWVzXG4gICAgICogb2YgdGhlIGNvbXBvc2VkIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gc2V0dGVyIFRoZSBzZXR0ZXIgZnVuY3Rpb24uXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWdncmVnYXRvciBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGVBZ2dyZWdhdG9yKHNldHRlcikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuXG4gICAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMDtcblxuICAgICAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBjb2xsZWN0aW9uW2luZGV4XTtcbiAgICAgICAgICAgIHNldHRlcihyZXN1bHQsIHZhbHVlLCBjYWxsYmFjayh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pLCBjb2xsZWN0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yT3duKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIHNldHRlcihyZXN1bHQsIHZhbHVlLCBjYWxsYmFjayh2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSwgY29sbGVjdGlvbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLCBlaXRoZXIgY3VycmllcyBvciBpbnZva2VzIGBmdW5jYFxuICAgICAqIHdpdGggYW4gb3B0aW9uYWwgYHRoaXNgIGJpbmRpbmcgYW5kIHBhcnRpYWxseSBhcHBsaWVkIGFyZ3VtZW50cy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IGZ1bmMgVGhlIGZ1bmN0aW9uIG9yIG1ldGhvZCBuYW1lIHRvIHJlZmVyZW5jZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBvZiBtZXRob2QgZmxhZ3MgdG8gY29tcG9zZS5cbiAgICAgKiAgVGhlIGJpdG1hc2sgbWF5IGJlIGNvbXBvc2VkIG9mIHRoZSBmb2xsb3dpbmcgZmxhZ3M6XG4gICAgICogIDEgLSBgXy5iaW5kYFxuICAgICAqICAyIC0gYF8uYmluZEtleWBcbiAgICAgKiAgNCAtIGBfLmN1cnJ5YFxuICAgICAqICA4IC0gYF8uY3VycnlgIChib3VuZClcbiAgICAgKiAgMTYgLSBgXy5wYXJ0aWFsYFxuICAgICAqICAzMiAtIGBfLnBhcnRpYWxSaWdodGBcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbcGFydGlhbEFyZ3NdIEFuIGFycmF5IG9mIGFyZ3VtZW50cyB0byBwcmVwZW5kIHRvIHRob3NlXG4gICAgICogIHByb3ZpZGVkIHRvIHRoZSBuZXcgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtBcnJheX0gW3BhcnRpYWxSaWdodEFyZ3NdIEFuIGFycmF5IG9mIGFyZ3VtZW50cyB0byBhcHBlbmQgdG8gdGhvc2VcbiAgICAgKiAgcHJvdmlkZWQgdG8gdGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYXJpdHldIFRoZSBhcml0eSBvZiBgZnVuY2AuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlV3JhcHBlcihmdW5jLCBiaXRtYXNrLCBwYXJ0aWFsQXJncywgcGFydGlhbFJpZ2h0QXJncywgdGhpc0FyZywgYXJpdHkpIHtcbiAgICAgIHZhciBpc0JpbmQgPSBiaXRtYXNrICYgMSxcbiAgICAgICAgICBpc0JpbmRLZXkgPSBiaXRtYXNrICYgMixcbiAgICAgICAgICBpc0N1cnJ5ID0gYml0bWFzayAmIDQsXG4gICAgICAgICAgaXNDdXJyeUJvdW5kID0gYml0bWFzayAmIDgsXG4gICAgICAgICAgaXNQYXJ0aWFsID0gYml0bWFzayAmIDE2LFxuICAgICAgICAgIGlzUGFydGlhbFJpZ2h0ID0gYml0bWFzayAmIDMyO1xuXG4gICAgICBpZiAoIWlzQmluZEtleSAmJiAhaXNGdW5jdGlvbihmdW5jKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgICAgfVxuICAgICAgaWYgKGlzUGFydGlhbCAmJiAhcGFydGlhbEFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGJpdG1hc2sgJj0gfjE2O1xuICAgICAgICBpc1BhcnRpYWwgPSBwYXJ0aWFsQXJncyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGlzUGFydGlhbFJpZ2h0ICYmICFwYXJ0aWFsUmlnaHRBcmdzLmxlbmd0aCkge1xuICAgICAgICBiaXRtYXNrICY9IH4zMjtcbiAgICAgICAgaXNQYXJ0aWFsUmlnaHQgPSBwYXJ0aWFsUmlnaHRBcmdzID0gZmFsc2U7XG4gICAgICB9XG4gICAgICB2YXIgYmluZERhdGEgPSBmdW5jICYmIGZ1bmMuX19iaW5kRGF0YV9fO1xuICAgICAgaWYgKGJpbmREYXRhICYmIGJpbmREYXRhICE9PSB0cnVlKSB7XG4gICAgICAgIC8vIGNsb25lIGBiaW5kRGF0YWBcbiAgICAgICAgYmluZERhdGEgPSBzbGljZShiaW5kRGF0YSk7XG4gICAgICAgIGlmIChiaW5kRGF0YVsyXSkge1xuICAgICAgICAgIGJpbmREYXRhWzJdID0gc2xpY2UoYmluZERhdGFbMl0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiaW5kRGF0YVszXSkge1xuICAgICAgICAgIGJpbmREYXRhWzNdID0gc2xpY2UoYmluZERhdGFbM10pO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNldCBgdGhpc0JpbmRpbmdgIGlzIG5vdCBwcmV2aW91c2x5IGJvdW5kXG4gICAgICAgIGlmIChpc0JpbmQgJiYgIShiaW5kRGF0YVsxXSAmIDEpKSB7XG4gICAgICAgICAgYmluZERhdGFbNF0gPSB0aGlzQXJnO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNldCBpZiBwcmV2aW91c2x5IGJvdW5kIGJ1dCBub3QgY3VycmVudGx5IChzdWJzZXF1ZW50IGN1cnJpZWQgZnVuY3Rpb25zKVxuICAgICAgICBpZiAoIWlzQmluZCAmJiBiaW5kRGF0YVsxXSAmIDEpIHtcbiAgICAgICAgICBiaXRtYXNrIHw9IDg7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2V0IGN1cnJpZWQgYXJpdHkgaWYgbm90IHlldCBzZXRcbiAgICAgICAgaWYgKGlzQ3VycnkgJiYgIShiaW5kRGF0YVsxXSAmIDQpKSB7XG4gICAgICAgICAgYmluZERhdGFbNV0gPSBhcml0eTtcbiAgICAgICAgfVxuICAgICAgICAvLyBhcHBlbmQgcGFydGlhbCBsZWZ0IGFyZ3VtZW50c1xuICAgICAgICBpZiAoaXNQYXJ0aWFsKSB7XG4gICAgICAgICAgcHVzaC5hcHBseShiaW5kRGF0YVsyXSB8fCAoYmluZERhdGFbMl0gPSBbXSksIHBhcnRpYWxBcmdzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBhcHBlbmQgcGFydGlhbCByaWdodCBhcmd1bWVudHNcbiAgICAgICAgaWYgKGlzUGFydGlhbFJpZ2h0KSB7XG4gICAgICAgICAgdW5zaGlmdC5hcHBseShiaW5kRGF0YVszXSB8fCAoYmluZERhdGFbM10gPSBbXSksIHBhcnRpYWxSaWdodEFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1lcmdlIGZsYWdzXG4gICAgICAgIGJpbmREYXRhWzFdIHw9IGJpdG1hc2s7XG4gICAgICAgIHJldHVybiBjcmVhdGVXcmFwcGVyLmFwcGx5KG51bGwsIGJpbmREYXRhKTtcbiAgICAgIH1cbiAgICAgIC8vIGZhc3QgcGF0aCBmb3IgYF8uYmluZGBcbiAgICAgIHZhciBjcmVhdGVyID0gKGJpdG1hc2sgPT0gMSB8fCBiaXRtYXNrID09PSAxNykgPyBiYXNlQmluZCA6IGJhc2VDcmVhdGVXcmFwcGVyO1xuICAgICAgcmV0dXJuIGNyZWF0ZXIoW2Z1bmMsIGJpdG1hc2ssIHBhcnRpYWxBcmdzLCBwYXJ0aWFsUmlnaHRBcmdzLCB0aGlzQXJnLCBhcml0eV0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVzZWQgYnkgYGVzY2FwZWAgdG8gY29udmVydCBjaGFyYWN0ZXJzIHRvIEhUTUwgZW50aXRpZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtYXRjaCBUaGUgbWF0Y2hlZCBjaGFyYWN0ZXIgdG8gZXNjYXBlLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGVzY2FwZWQgY2hhcmFjdGVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVzY2FwZUh0bWxDaGFyKG1hdGNoKSB7XG4gICAgICByZXR1cm4gaHRtbEVzY2FwZXNbbWF0Y2hdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGFwcHJvcHJpYXRlIFwiaW5kZXhPZlwiIGZ1bmN0aW9uLiBJZiB0aGUgYF8uaW5kZXhPZmAgbWV0aG9kIGlzXG4gICAgICogY3VzdG9taXplZCwgdGhpcyBtZXRob2QgcmV0dXJucyB0aGUgY3VzdG9tIG1ldGhvZCwgb3RoZXJ3aXNlIGl0IHJldHVybnNcbiAgICAgKiB0aGUgYGJhc2VJbmRleE9mYCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBcImluZGV4T2ZcIiBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRJbmRleE9mKCkge1xuICAgICAgdmFyIHJlc3VsdCA9IChyZXN1bHQgPSBsb2Rhc2guaW5kZXhPZikgPT09IGluZGV4T2YgPyBiYXNlSW5kZXhPZiA6IHJlc3VsdDtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicgJiYgcmVOYXRpdmUudGVzdCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyBgdGhpc2AgYmluZGluZyBkYXRhIG9uIGEgZ2l2ZW4gZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHNldCBkYXRhIG9uLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlIFRoZSBkYXRhIGFycmF5IHRvIHNldC5cbiAgICAgKi9cbiAgICB2YXIgc2V0QmluZERhdGEgPSAhZGVmaW5lUHJvcGVydHkgPyBub29wIDogZnVuY3Rpb24oZnVuYywgdmFsdWUpIHtcbiAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSB2YWx1ZTtcbiAgICAgIGRlZmluZVByb3BlcnR5KGZ1bmMsICdfX2JpbmREYXRhX18nLCBkZXNjcmlwdG9yKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQSBmYWxsYmFjayBpbXBsZW1lbnRhdGlvbiBvZiBgaXNQbGFpbk9iamVjdGAgd2hpY2ggY2hlY2tzIGlmIGEgZ2l2ZW4gdmFsdWVcbiAgICAgKiBpcyBhbiBvYmplY3QgY3JlYXRlZCBieSB0aGUgYE9iamVjdGAgY29uc3RydWN0b3IsIGFzc3VtaW5nIG9iamVjdHMgY3JlYXRlZFxuICAgICAqIGJ5IHRoZSBgT2JqZWN0YCBjb25zdHJ1Y3RvciBoYXZlIG5vIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMgYW5kIHRoYXRcbiAgICAgKiB0aGVyZSBhcmUgbm8gYE9iamVjdC5wcm90b3R5cGVgIGV4dGVuc2lvbnMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2hpbUlzUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgICAgIHZhciBjdG9yLFxuICAgICAgICAgIHJlc3VsdDtcblxuICAgICAgLy8gYXZvaWQgbm9uIE9iamVjdCBvYmplY3RzLCBgYXJndW1lbnRzYCBvYmplY3RzLCBhbmQgRE9NIGVsZW1lbnRzXG4gICAgICBpZiAoISh2YWx1ZSAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBvYmplY3RDbGFzcykgfHxcbiAgICAgICAgICAoY3RvciA9IHZhbHVlLmNvbnN0cnVjdG9yLCBpc0Z1bmN0aW9uKGN0b3IpICYmICEoY3RvciBpbnN0YW5jZW9mIGN0b3IpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBJbiBtb3N0IGVudmlyb25tZW50cyBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcyBhcmUgaXRlcmF0ZWQgYmVmb3JlXG4gICAgICAvLyBpdHMgaW5oZXJpdGVkIHByb3BlcnRpZXMuIElmIHRoZSBsYXN0IGl0ZXJhdGVkIHByb3BlcnR5IGlzIGFuIG9iamVjdCdzXG4gICAgICAvLyBvd24gcHJvcGVydHkgdGhlbiB0aGVyZSBhcmUgbm8gaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAgICAgIGZvckluKHZhbHVlLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHJlc3VsdCA9IGtleTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHR5cGVvZiByZXN1bHQgPT0gJ3VuZGVmaW5lZCcgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgcmVzdWx0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVc2VkIGJ5IGB1bmVzY2FwZWAgdG8gY29udmVydCBIVE1MIGVudGl0aWVzIHRvIGNoYXJhY3RlcnMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtYXRjaCBUaGUgbWF0Y2hlZCBjaGFyYWN0ZXIgdG8gdW5lc2NhcGUuXG4gICAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdW5lc2NhcGVkIGNoYXJhY3Rlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1bmVzY2FwZUh0bWxDaGFyKG1hdGNoKSB7XG4gICAgICByZXR1cm4gaHRtbFVuZXNjYXBlc1ttYXRjaF07XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogKGZ1bmN0aW9uKCkgeyByZXR1cm4gXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpOyB9KSgxLCAyLCAzKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09ICdudW1iZXInICYmXG4gICAgICAgIHRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFyZ3NDbGFzcyB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhbiBhcnJheS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogKGZ1bmN0aW9uKCkgeyByZXR1cm4gXy5pc0FycmF5KGFyZ3VtZW50cyk7IH0pKCk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKlxuICAgICAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICB2YXIgaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PSAnbnVtYmVyJyAmJlxuICAgICAgICB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcnJheUNsYXNzIHx8IGZhbHNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBIGZhbGxiYWNrIGltcGxlbWVudGF0aW9uIG9mIGBPYmplY3Qua2V5c2Agd2hpY2ggcHJvZHVjZXMgYW4gYXJyYXkgb2YgdGhlXG4gICAgICogZ2l2ZW4gb2JqZWN0J3Mgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICAgICAqL1xuICAgIHZhciBzaGltS2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgdmFyIGluZGV4LCBpdGVyYWJsZSA9IG9iamVjdCwgcmVzdWx0ID0gW107XG4gICAgICBpZiAoIWl0ZXJhYmxlKSByZXR1cm4gcmVzdWx0O1xuICAgICAgaWYgKCEob2JqZWN0VHlwZXNbdHlwZW9mIG9iamVjdF0pKSByZXR1cm4gcmVzdWx0O1xuICAgICAgICBmb3IgKGluZGV4IGluIGl0ZXJhYmxlKSB7XG4gICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoaXRlcmFibGUsIGluZGV4KSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goaW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGFycmF5IGNvbXBvc2VkIG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBhbiBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5rZXlzKHsgJ29uZSc6IDEsICd0d28nOiAyLCAndGhyZWUnOiAzIH0pO1xuICAgICAqIC8vID0+IFsnb25lJywgJ3R3bycsICd0aHJlZSddIChwcm9wZXJ0eSBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCBhY3Jvc3MgZW52aXJvbm1lbnRzKVxuICAgICAqL1xuICAgIHZhciBrZXlzID0gIW5hdGl2ZUtleXMgPyBzaGltS2V5cyA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVzZWQgdG8gY29udmVydCBjaGFyYWN0ZXJzIHRvIEhUTUwgZW50aXRpZXM6XG4gICAgICpcbiAgICAgKiBUaG91Z2ggdGhlIGA+YCBjaGFyYWN0ZXIgaXMgZXNjYXBlZCBmb3Igc3ltbWV0cnksIGNoYXJhY3RlcnMgbGlrZSBgPmAgYW5kIGAvYFxuICAgICAqIGRvbid0IHJlcXVpcmUgZXNjYXBpbmcgaW4gSFRNTCBhbmQgaGF2ZSBubyBzcGVjaWFsIG1lYW5pbmcgdW5sZXNzIHRoZXkncmUgcGFydFxuICAgICAqIG9mIGEgdGFnIG9yIGFuIHVucXVvdGVkIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAgKiBodHRwOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9hbWJpZ3VvdXMtYW1wZXJzYW5kcyAodW5kZXIgXCJzZW1pLXJlbGF0ZWQgZnVuIGZhY3RcIilcbiAgICAgKi9cbiAgICB2YXIgaHRtbEVzY2FwZXMgPSB7XG4gICAgICAnJic6ICcmYW1wOycsXG4gICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICc+JzogJyZndDsnLFxuICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICBcIidcIjogJyYjMzk7J1xuICAgIH07XG5cbiAgICAvKiogVXNlZCB0byBjb252ZXJ0IEhUTUwgZW50aXRpZXMgdG8gY2hhcmFjdGVycyAqL1xuICAgIHZhciBodG1sVW5lc2NhcGVzID0gaW52ZXJ0KGh0bWxFc2NhcGVzKTtcblxuICAgIC8qKiBVc2VkIHRvIG1hdGNoIEhUTUwgZW50aXRpZXMgYW5kIEhUTUwgY2hhcmFjdGVycyAqL1xuICAgIHZhciByZUVzY2FwZWRIdG1sID0gUmVnRXhwKCcoJyArIGtleXMoaHRtbFVuZXNjYXBlcykuam9pbignfCcpICsgJyknLCAnZycpLFxuICAgICAgICByZVVuZXNjYXBlZEh0bWwgPSBSZWdFeHAoJ1snICsga2V5cyhodG1sRXNjYXBlcykuam9pbignJykgKyAnXScsICdnJyk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIEFzc2lnbnMgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBzb3VyY2Ugb2JqZWN0KHMpIHRvIHRoZSBkZXN0aW5hdGlvblxuICAgICAqIG9iamVjdC4gU3Vic2VxdWVudCBzb3VyY2VzIHdpbGwgb3ZlcndyaXRlIHByb3BlcnR5IGFzc2lnbm1lbnRzIG9mIHByZXZpb3VzXG4gICAgICogc291cmNlcy4gSWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIGV4ZWN1dGVkIHRvIHByb2R1Y2UgdGhlXG4gICAgICogYXNzaWduZWQgdmFsdWVzLiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdHdvXG4gICAgICogYXJndW1lbnRzOyAob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlKS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICogQGFsaWFzIGV4dGVuZFxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlXSBUaGUgc291cmNlIG9iamVjdHMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmluZyB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmFzc2lnbih7ICduYW1lJzogJ2ZyZWQnIH0sIHsgJ2VtcGxveWVyJzogJ3NsYXRlJyB9KTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2ZyZWQnLCAnZW1wbG95ZXInOiAnc2xhdGUnIH1cbiAgICAgKlxuICAgICAqIHZhciBkZWZhdWx0cyA9IF8ucGFydGlhbFJpZ2h0KF8uYXNzaWduLCBmdW5jdGlvbihhLCBiKSB7XG4gICAgICogICByZXR1cm4gdHlwZW9mIGEgPT0gJ3VuZGVmaW5lZCcgPyBiIDogYTtcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIHZhciBvYmplY3QgPSB7ICduYW1lJzogJ2Jhcm5leScgfTtcbiAgICAgKiBkZWZhdWx0cyhvYmplY3QsIHsgJ25hbWUnOiAnZnJlZCcsICdlbXBsb3llcic6ICdzbGF0ZScgfSk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdiYXJuZXknLCAnZW1wbG95ZXInOiAnc2xhdGUnIH1cbiAgICAgKi9cbiAgICB2YXIgYXNzaWduID0gZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2UsIGd1YXJkKSB7XG4gICAgICB2YXIgaW5kZXgsIGl0ZXJhYmxlID0gb2JqZWN0LCByZXN1bHQgPSBpdGVyYWJsZTtcbiAgICAgIGlmICghaXRlcmFibGUpIHJldHVybiByZXN1bHQ7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICBhcmdzSW5kZXggPSAwLFxuICAgICAgICAgIGFyZ3NMZW5ndGggPSB0eXBlb2YgZ3VhcmQgPT0gJ251bWJlcicgPyAyIDogYXJncy5sZW5ndGg7XG4gICAgICBpZiAoYXJnc0xlbmd0aCA+IDMgJiYgdHlwZW9mIGFyZ3NbYXJnc0xlbmd0aCAtIDJdID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gYmFzZUNyZWF0ZUNhbGxiYWNrKGFyZ3NbLS1hcmdzTGVuZ3RoIC0gMV0sIGFyZ3NbYXJnc0xlbmd0aC0tXSwgMik7XG4gICAgICB9IGVsc2UgaWYgKGFyZ3NMZW5ndGggPiAyICYmIHR5cGVvZiBhcmdzW2FyZ3NMZW5ndGggLSAxXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrID0gYXJnc1stLWFyZ3NMZW5ndGhdO1xuICAgICAgfVxuICAgICAgd2hpbGUgKCsrYXJnc0luZGV4IDwgYXJnc0xlbmd0aCkge1xuICAgICAgICBpdGVyYWJsZSA9IGFyZ3NbYXJnc0luZGV4XTtcbiAgICAgICAgaWYgKGl0ZXJhYmxlICYmIG9iamVjdFR5cGVzW3R5cGVvZiBpdGVyYWJsZV0pIHtcbiAgICAgICAgdmFyIG93bkluZGV4ID0gLTEsXG4gICAgICAgICAgICBvd25Qcm9wcyA9IG9iamVjdFR5cGVzW3R5cGVvZiBpdGVyYWJsZV0gJiYga2V5cyhpdGVyYWJsZSksXG4gICAgICAgICAgICBsZW5ndGggPSBvd25Qcm9wcyA/IG93blByb3BzLmxlbmd0aCA6IDA7XG5cbiAgICAgICAgd2hpbGUgKCsrb3duSW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICBpbmRleCA9IG93blByb3BzW293bkluZGV4XTtcbiAgICAgICAgICByZXN1bHRbaW5kZXhdID0gY2FsbGJhY2sgPyBjYWxsYmFjayhyZXN1bHRbaW5kZXhdLCBpdGVyYWJsZVtpbmRleF0pIDogaXRlcmFibGVbaW5kZXhdO1xuICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGNsb25lIG9mIGB2YWx1ZWAuIElmIGBpc0RlZXBgIGlzIGB0cnVlYCBuZXN0ZWQgb2JqZWN0cyB3aWxsIGFsc29cbiAgICAgKiBiZSBjbG9uZWQsIG90aGVyd2lzZSB0aGV5IHdpbGwgYmUgYXNzaWduZWQgYnkgcmVmZXJlbmNlLiBJZiBhIGNhbGxiYWNrXG4gICAgICogaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSBleGVjdXRlZCB0byBwcm9kdWNlIHRoZSBjbG9uZWQgdmFsdWVzLiBJZiB0aGVcbiAgICAgKiBjYWxsYmFjayByZXR1cm5zIGB1bmRlZmluZWRgIGNsb25pbmcgd2lsbCBiZSBoYW5kbGVkIGJ5IHRoZSBtZXRob2QgaW5zdGVhZC5cbiAgICAgKiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OyAodmFsdWUpLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0RlZXA9ZmFsc2VdIFNwZWNpZnkgYSBkZWVwIGNsb25lLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nIHZhbHVlcy5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIHZhciBzaGFsbG93ID0gXy5jbG9uZShjaGFyYWN0ZXJzKTtcbiAgICAgKiBzaGFsbG93WzBdID09PSBjaGFyYWN0ZXJzWzBdO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKlxuICAgICAqIHZhciBkZWVwID0gXy5jbG9uZShjaGFyYWN0ZXJzLCB0cnVlKTtcbiAgICAgKiBkZWVwWzBdID09PSBjaGFyYWN0ZXJzWzBdO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICpcbiAgICAgKiBfLm1peGluKHtcbiAgICAgKiAgICdjbG9uZSc6IF8ucGFydGlhbFJpZ2h0KF8uY2xvbmUsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICogICAgIHJldHVybiBfLmlzRWxlbWVudCh2YWx1ZSkgPyB2YWx1ZS5jbG9uZU5vZGUoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgICAqICAgfSlcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIHZhciBjbG9uZSA9IF8uY2xvbmUoZG9jdW1lbnQuYm9keSk7XG4gICAgICogY2xvbmUuY2hpbGROb2Rlcy5sZW5ndGg7XG4gICAgICogLy8gPT4gMFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNsb25lKHZhbHVlLCBpc0RlZXAsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICAvLyBhbGxvd3Mgd29ya2luZyB3aXRoIFwiQ29sbGVjdGlvbnNcIiBtZXRob2RzIHdpdGhvdXQgdXNpbmcgdGhlaXIgYGluZGV4YFxuICAgICAgLy8gYW5kIGBjb2xsZWN0aW9uYCBhcmd1bWVudHMgZm9yIGBpc0RlZXBgIGFuZCBgY2FsbGJhY2tgXG4gICAgICBpZiAodHlwZW9mIGlzRGVlcCAhPSAnYm9vbGVhbicgJiYgaXNEZWVwICE9IG51bGwpIHtcbiAgICAgICAgdGhpc0FyZyA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayA9IGlzRGVlcDtcbiAgICAgICAgaXNEZWVwID0gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmFzZUNsb25lKHZhbHVlLCBpc0RlZXAsIHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nICYmIGJhc2VDcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBkZWVwIGNsb25lIG9mIGB2YWx1ZWAuIElmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZVxuICAgICAqIGV4ZWN1dGVkIHRvIHByb2R1Y2UgdGhlIGNsb25lZCB2YWx1ZXMuIElmIHRoZSBjYWxsYmFjayByZXR1cm5zIGB1bmRlZmluZWRgXG4gICAgICogY2xvbmluZyB3aWxsIGJlIGhhbmRsZWQgYnkgdGhlIG1ldGhvZCBpbnN0ZWFkLiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG9cbiAgICAgKiBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ7ICh2YWx1ZSkuXG4gICAgICpcbiAgICAgKiBOb3RlOiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uIHRoZSBzdHJ1Y3R1cmVkIGNsb25lIGFsZ29yaXRobS4gRnVuY3Rpb25zXG4gICAgICogYW5kIERPTSBub2RlcyBhcmUgKipub3QqKiBjbG9uZWQuIFRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYGFyZ3VtZW50c2Agb2JqZWN0cyBhbmRcbiAgICAgKiBvYmplY3RzIGNyZWF0ZWQgYnkgY29uc3RydWN0b3JzIG90aGVyIHRoYW4gYE9iamVjdGAgYXJlIGNsb25lZCB0byBwbGFpbiBgT2JqZWN0YCBvYmplY3RzLlxuICAgICAqIFNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9pbmZyYXN0cnVjdHVyZS5odG1sI2ludGVybmFsLXN0cnVjdHVyZWQtY2xvbmluZy1hbGdvcml0aG0uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGRlZXAgY2xvbmUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNsb25pbmcgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBkZWVwIGNsb25lZCB2YWx1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAnYWdlJzogNDAgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiB2YXIgZGVlcCA9IF8uY2xvbmVEZWVwKGNoYXJhY3RlcnMpO1xuICAgICAqIGRlZXBbMF0gPT09IGNoYXJhY3RlcnNbMF07XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKlxuICAgICAqIHZhciB2aWV3ID0ge1xuICAgICAqICAgJ2xhYmVsJzogJ2RvY3MnLFxuICAgICAqICAgJ25vZGUnOiBlbGVtZW50XG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIHZhciBjbG9uZSA9IF8uY2xvbmVEZWVwKHZpZXcsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICogICByZXR1cm4gXy5pc0VsZW1lbnQodmFsdWUpID8gdmFsdWUuY2xvbmVOb2RlKHRydWUpIDogdW5kZWZpbmVkO1xuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogY2xvbmUubm9kZSA9PSB2aWV3Lm5vZGU7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjbG9uZURlZXAodmFsdWUsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICByZXR1cm4gYmFzZUNsb25lKHZhbHVlLCB0cnVlLCB0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJyAmJiBiYXNlQ3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhlIGdpdmVuIGBwcm90b3R5cGVgIG9iamVjdC4gSWYgYVxuICAgICAqIGBwcm9wZXJ0aWVzYCBvYmplY3QgaXMgcHJvdmlkZWQgaXRzIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgYXJlIGFzc2lnbmVkXG4gICAgICogdG8gdGhlIGNyZWF0ZWQgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvdG90eXBlIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvcGVydGllc10gVGhlIHByb3BlcnRpZXMgdG8gYXNzaWduIHRvIHRoZSBvYmplY3QuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogZnVuY3Rpb24gU2hhcGUoKSB7XG4gICAgICogICB0aGlzLnggPSAwO1xuICAgICAqICAgdGhpcy55ID0gMDtcbiAgICAgKiB9XG4gICAgICpcbiAgICAgKiBmdW5jdGlvbiBDaXJjbGUoKSB7XG4gICAgICogICBTaGFwZS5jYWxsKHRoaXMpO1xuICAgICAqIH1cbiAgICAgKlxuICAgICAqIENpcmNsZS5wcm90b3R5cGUgPSBfLmNyZWF0ZShTaGFwZS5wcm90b3R5cGUsIHsgJ2NvbnN0cnVjdG9yJzogQ2lyY2xlIH0pO1xuICAgICAqXG4gICAgICogdmFyIGNpcmNsZSA9IG5ldyBDaXJjbGU7XG4gICAgICogY2lyY2xlIGluc3RhbmNlb2YgQ2lyY2xlO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKlxuICAgICAqIGNpcmNsZSBpbnN0YW5jZW9mIFNoYXBlO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGUocHJvdG90eXBlLCBwcm9wZXJ0aWVzKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gYmFzZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgICAgcmV0dXJuIHByb3BlcnRpZXMgPyBhc3NpZ24ocmVzdWx0LCBwcm9wZXJ0aWVzKSA6IHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAgICAgKiBvYmplY3QgZm9yIGFsbCBkZXN0aW5hdGlvbiBwcm9wZXJ0aWVzIHRoYXQgcmVzb2x2ZSB0byBgdW5kZWZpbmVkYC4gT25jZSBhXG4gICAgICogcHJvcGVydHkgaXMgc2V0LCBhZGRpdGlvbmFsIGRlZmF1bHRzIG9mIHRoZSBzYW1lIHByb3BlcnR5IHdpbGwgYmUgaWdub3JlZC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAgICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAgICAgKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gQWxsb3dzIHdvcmtpbmcgd2l0aCBgXy5yZWR1Y2VgIHdpdGhvdXQgdXNpbmcgaXRzXG4gICAgICogIGBrZXlgIGFuZCBgb2JqZWN0YCBhcmd1bWVudHMgYXMgc291cmNlcy5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBvYmplY3QgPSB7ICduYW1lJzogJ2Jhcm5leScgfTtcbiAgICAgKiBfLmRlZmF1bHRzKG9iamVjdCwgeyAnbmFtZSc6ICdmcmVkJywgJ2VtcGxveWVyJzogJ3NsYXRlJyB9KTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2Jhcm5leScsICdlbXBsb3llcic6ICdzbGF0ZScgfVxuICAgICAqL1xuICAgIHZhciBkZWZhdWx0cyA9IGZ1bmN0aW9uKG9iamVjdCwgc291cmNlLCBndWFyZCkge1xuICAgICAgdmFyIGluZGV4LCBpdGVyYWJsZSA9IG9iamVjdCwgcmVzdWx0ID0gaXRlcmFibGU7XG4gICAgICBpZiAoIWl0ZXJhYmxlKSByZXR1cm4gcmVzdWx0O1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgICAgYXJnc0luZGV4ID0gMCxcbiAgICAgICAgICBhcmdzTGVuZ3RoID0gdHlwZW9mIGd1YXJkID09ICdudW1iZXInID8gMiA6IGFyZ3MubGVuZ3RoO1xuICAgICAgd2hpbGUgKCsrYXJnc0luZGV4IDwgYXJnc0xlbmd0aCkge1xuICAgICAgICBpdGVyYWJsZSA9IGFyZ3NbYXJnc0luZGV4XTtcbiAgICAgICAgaWYgKGl0ZXJhYmxlICYmIG9iamVjdFR5cGVzW3R5cGVvZiBpdGVyYWJsZV0pIHtcbiAgICAgICAgdmFyIG93bkluZGV4ID0gLTEsXG4gICAgICAgICAgICBvd25Qcm9wcyA9IG9iamVjdFR5cGVzW3R5cGVvZiBpdGVyYWJsZV0gJiYga2V5cyhpdGVyYWJsZSksXG4gICAgICAgICAgICBsZW5ndGggPSBvd25Qcm9wcyA/IG93blByb3BzLmxlbmd0aCA6IDA7XG5cbiAgICAgICAgd2hpbGUgKCsrb3duSW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICBpbmRleCA9IG93blByb3BzW293bkluZGV4XTtcbiAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdFtpbmRleF0gPT0gJ3VuZGVmaW5lZCcpIHJlc3VsdFtpbmRleF0gPSBpdGVyYWJsZVtpbmRleF07XG4gICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmZpbmRJbmRleGAgZXhjZXB0IHRoYXQgaXQgcmV0dXJucyB0aGUga2V5IG9mIHRoZVxuICAgICAqIGZpcnN0IGVsZW1lbnQgdGhhdCBwYXNzZXMgdGhlIGNhbGxiYWNrIGNoZWNrLCBpbnN0ZWFkIG9mIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gc2VhcmNoLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlclxuICAgICAqICBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkIHRvXG4gICAgICogIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge3N0cmluZ3x1bmRlZmluZWR9IFJldHVybnMgdGhlIGtleSBvZiB0aGUgZm91bmQgZWxlbWVudCwgZWxzZSBgdW5kZWZpbmVkYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSB7XG4gICAgICogICAnYmFybmV5JzogeyAgJ2FnZSc6IDM2LCAnYmxvY2tlZCc6IGZhbHNlIH0sXG4gICAgICogICAnZnJlZCc6IHsgICAgJ2FnZSc6IDQwLCAnYmxvY2tlZCc6IHRydWUgfSxcbiAgICAgKiAgICdwZWJibGVzJzogeyAnYWdlJzogMSwgICdibG9ja2VkJzogZmFsc2UgfVxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiBfLmZpbmRLZXkoY2hhcmFjdGVycywgZnVuY3Rpb24oY2hyKSB7XG4gICAgICogICByZXR1cm4gY2hyLmFnZSA8IDQwO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+ICdiYXJuZXknIChwcm9wZXJ0eSBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCBhY3Jvc3MgZW52aXJvbm1lbnRzKVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maW5kS2V5KGNoYXJhY3RlcnMsIHsgJ2FnZSc6IDEgfSk7XG4gICAgICogLy8gPT4gJ3BlYmJsZXMnXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmZpbmRLZXkoY2hhcmFjdGVycywgJ2Jsb2NrZWQnKTtcbiAgICAgKiAvLyA9PiAnZnJlZCdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaW5kS2V5KG9iamVjdCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICBmb3JPd24ob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmplY3QpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlLCBrZXksIG9iamVjdCkpIHtcbiAgICAgICAgICByZXN1bHQgPSBrZXk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5maW5kS2V5YCBleGNlcHQgdGhhdCBpdCBpdGVyYXRlcyBvdmVyIGVsZW1lbnRzXG4gICAgICogb2YgYSBgY29sbGVjdGlvbmAgaW4gdGhlIG9wcG9zaXRlIG9yZGVyLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBzZWFyY2guXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyXG4gICAgICogIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWQgdG9cbiAgICAgKiAgY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfHVuZGVmaW5lZH0gUmV0dXJucyB0aGUga2V5IG9mIHRoZSBmb3VuZCBlbGVtZW50LCBlbHNlIGB1bmRlZmluZWRgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IHtcbiAgICAgKiAgICdiYXJuZXknOiB7ICAnYWdlJzogMzYsICdibG9ja2VkJzogdHJ1ZSB9LFxuICAgICAqICAgJ2ZyZWQnOiB7ICAgICdhZ2UnOiA0MCwgJ2Jsb2NrZWQnOiBmYWxzZSB9LFxuICAgICAqICAgJ3BlYmJsZXMnOiB7ICdhZ2UnOiAxLCAgJ2Jsb2NrZWQnOiB0cnVlIH1cbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy5maW5kTGFzdEtleShjaGFyYWN0ZXJzLCBmdW5jdGlvbihjaHIpIHtcbiAgICAgKiAgIHJldHVybiBjaHIuYWdlIDwgNDA7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gcmV0dXJucyBgcGViYmxlc2AsIGFzc3VtaW5nIGBfLmZpbmRLZXlgIHJldHVybnMgYGJhcm5leWBcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uZmluZExhc3RLZXkoY2hhcmFjdGVycywgeyAnYWdlJzogNDAgfSk7XG4gICAgICogLy8gPT4gJ2ZyZWQnXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmZpbmRMYXN0S2V5KGNoYXJhY3RlcnMsICdibG9ja2VkJyk7XG4gICAgICogLy8gPT4gJ3BlYmJsZXMnXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmluZExhc3RLZXkob2JqZWN0LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgIGZvck93blJpZ2h0KG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqZWN0KSB7XG4gICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZSwga2V5LCBvYmplY3QpKSB7XG4gICAgICAgICAgcmVzdWx0ID0ga2V5O1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGVzIG92ZXIgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdCxcbiAgICAgKiBleGVjdXRpbmcgdGhlIGNhbGxiYWNrIGZvciBlYWNoIHByb3BlcnR5LiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgXG4gICAgICogYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7ICh2YWx1ZSwga2V5LCBvYmplY3QpLiBDYWxsYmFja3MgbWF5IGV4aXRcbiAgICAgKiBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIGZ1bmN0aW9uIFNoYXBlKCkge1xuICAgICAqICAgdGhpcy54ID0gMDtcbiAgICAgKiAgIHRoaXMueSA9IDA7XG4gICAgICogfVxuICAgICAqXG4gICAgICogU2hhcGUucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgICogICB0aGlzLnggKz0geDtcbiAgICAgKiAgIHRoaXMueSArPSB5O1xuICAgICAqIH07XG4gICAgICpcbiAgICAgKiBfLmZvckluKG5ldyBTaGFwZSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAqICAgY29uc29sZS5sb2coa2V5KTtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiBsb2dzICd4JywgJ3knLCBhbmQgJ21vdmUnIChwcm9wZXJ0eSBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCBhY3Jvc3MgZW52aXJvbm1lbnRzKVxuICAgICAqL1xuICAgIHZhciBmb3JJbiA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgaW5kZXgsIGl0ZXJhYmxlID0gY29sbGVjdGlvbiwgcmVzdWx0ID0gaXRlcmFibGU7XG4gICAgICBpZiAoIWl0ZXJhYmxlKSByZXR1cm4gcmVzdWx0O1xuICAgICAgaWYgKCFvYmplY3RUeXBlc1t0eXBlb2YgaXRlcmFibGVdKSByZXR1cm4gcmVzdWx0O1xuICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayAmJiB0eXBlb2YgdGhpc0FyZyA9PSAndW5kZWZpbmVkJyA/IGNhbGxiYWNrIDogYmFzZUNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgICAgZm9yIChpbmRleCBpbiBpdGVyYWJsZSkge1xuICAgICAgICAgIGlmIChjYWxsYmFjayhpdGVyYWJsZVtpbmRleF0sIGluZGV4LCBjb2xsZWN0aW9uKSA9PT0gZmFsc2UpIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5mb3JJbmAgZXhjZXB0IHRoYXQgaXQgaXRlcmF0ZXMgb3ZlciBlbGVtZW50c1xuICAgICAqIG9mIGEgYGNvbGxlY3Rpb25gIGluIHRoZSBvcHBvc2l0ZSBvcmRlci5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBmdW5jdGlvbiBTaGFwZSgpIHtcbiAgICAgKiAgIHRoaXMueCA9IDA7XG4gICAgICogICB0aGlzLnkgPSAwO1xuICAgICAqIH1cbiAgICAgKlxuICAgICAqIFNoYXBlLnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24oeCwgeSkge1xuICAgICAqICAgdGhpcy54ICs9IHg7XG4gICAgICogICB0aGlzLnkgKz0geTtcbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy5mb3JJblJpZ2h0KG5ldyBTaGFwZSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAqICAgY29uc29sZS5sb2coa2V5KTtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiBsb2dzICdtb3ZlJywgJ3knLCBhbmQgJ3gnIGFzc3VtaW5nIGBfLmZvckluIGAgbG9ncyAneCcsICd5JywgYW5kICdtb3ZlJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZvckluUmlnaHQob2JqZWN0LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIHBhaXJzID0gW107XG5cbiAgICAgIGZvckluKG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBwYWlycy5wdXNoKGtleSwgdmFsdWUpO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBsZW5ndGggPSBwYWlycy5sZW5ndGg7XG4gICAgICBjYWxsYmFjayA9IGJhc2VDcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKHBhaXJzW2xlbmd0aC0tXSwgcGFpcnNbbGVuZ3RoXSwgb2JqZWN0KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyBvdmVyIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0LCBleGVjdXRpbmcgdGhlIGNhbGxiYWNrXG4gICAgICogZm9yIGVhY2ggcHJvcGVydHkuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZVxuICAgICAqIGFyZ3VtZW50czsgKHZhbHVlLCBrZXksIG9iamVjdCkuIENhbGxiYWNrcyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnlcbiAgICAgKiBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5mb3JPd24oeyAnMCc6ICd6ZXJvJywgJzEnOiAnb25lJywgJ2xlbmd0aCc6IDIgfSwgZnVuY3Rpb24obnVtLCBrZXkpIHtcbiAgICAgKiAgIGNvbnNvbGUubG9nKGtleSk7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gbG9ncyAnMCcsICcxJywgYW5kICdsZW5ndGgnIChwcm9wZXJ0eSBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCBhY3Jvc3MgZW52aXJvbm1lbnRzKVxuICAgICAqL1xuICAgIHZhciBmb3JPd24gPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIGluZGV4LCBpdGVyYWJsZSA9IGNvbGxlY3Rpb24sIHJlc3VsdCA9IGl0ZXJhYmxlO1xuICAgICAgaWYgKCFpdGVyYWJsZSkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIGlmICghb2JqZWN0VHlwZXNbdHlwZW9mIGl0ZXJhYmxlXSkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgJiYgdHlwZW9mIHRoaXNBcmcgPT0gJ3VuZGVmaW5lZCcgPyBjYWxsYmFjayA6IGJhc2VDcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICAgIHZhciBvd25JbmRleCA9IC0xLFxuICAgICAgICAgICAgb3duUHJvcHMgPSBvYmplY3RUeXBlc1t0eXBlb2YgaXRlcmFibGVdICYmIGtleXMoaXRlcmFibGUpLFxuICAgICAgICAgICAgbGVuZ3RoID0gb3duUHJvcHMgPyBvd25Qcm9wcy5sZW5ndGggOiAwO1xuXG4gICAgICAgIHdoaWxlICgrK293bkluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgaW5kZXggPSBvd25Qcm9wc1tvd25JbmRleF07XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKGl0ZXJhYmxlW2luZGV4XSwgaW5kZXgsIGNvbGxlY3Rpb24pID09PSBmYWxzZSkgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmZvck93bmAgZXhjZXB0IHRoYXQgaXQgaXRlcmF0ZXMgb3ZlciBlbGVtZW50c1xuICAgICAqIG9mIGEgYGNvbGxlY3Rpb25gIGluIHRoZSBvcHBvc2l0ZSBvcmRlci5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmZvck93blJpZ2h0KHsgJzAnOiAnemVybycsICcxJzogJ29uZScsICdsZW5ndGgnOiAyIH0sIGZ1bmN0aW9uKG51bSwga2V5KSB7XG4gICAgICogICBjb25zb2xlLmxvZyhrZXkpO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IGxvZ3MgJ2xlbmd0aCcsICcxJywgYW5kICcwJyBhc3N1bWluZyBgXy5mb3JPd25gIGxvZ3MgJzAnLCAnMScsIGFuZCAnbGVuZ3RoJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZvck93blJpZ2h0KG9iamVjdCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciBwcm9wcyA9IGtleXMob2JqZWN0KSxcbiAgICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICAgIGNhbGxiYWNrID0gYmFzZUNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICB2YXIga2V5ID0gcHJvcHNbbGVuZ3RoXTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKG9iamVjdFtrZXldLCBrZXksIG9iamVjdCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHNvcnRlZCBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBvZiBhbGwgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLFxuICAgICAqIG93biBhbmQgaW5oZXJpdGVkLCBvZiBgb2JqZWN0YCB0aGF0IGhhdmUgZnVuY3Rpb24gdmFsdWVzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIG1ldGhvZHNcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyB0aGF0IGhhdmUgZnVuY3Rpb24gdmFsdWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmZ1bmN0aW9ucyhfKTtcbiAgICAgKiAvLyA9PiBbJ2FsbCcsICdhbnknLCAnYmluZCcsICdiaW5kQWxsJywgJ2Nsb25lJywgJ2NvbXBhY3QnLCAnY29tcG9zZScsIC4uLl1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmdW5jdGlvbnMob2JqZWN0KSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICBmb3JJbihvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0LnNvcnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIHNwZWNpZmllZCBwcm9wZXJ0eSBuYW1lIGV4aXN0cyBhcyBhIGRpcmVjdCBwcm9wZXJ0eSBvZiBgb2JqZWN0YCxcbiAgICAgKiBpbnN0ZWFkIG9mIGFuIGluaGVyaXRlZCBwcm9wZXJ0eS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGtleSBpcyBhIGRpcmVjdCBwcm9wZXJ0eSwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmhhcyh7ICdhJzogMSwgJ2InOiAyLCAnYyc6IDMgfSwgJ2InKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGFzKG9iamVjdCwga2V5KSB7XG4gICAgICByZXR1cm4gb2JqZWN0ID8gaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgOiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIG9iamVjdCBjb21wb3NlZCBvZiB0aGUgaW52ZXJ0ZWQga2V5cyBhbmQgdmFsdWVzIG9mIHRoZSBnaXZlbiBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnZlcnQuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY3JlYXRlZCBpbnZlcnRlZCBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaW52ZXJ0KHsgJ2ZpcnN0JzogJ2ZyZWQnLCAnc2Vjb25kJzogJ2Jhcm5leScgfSk7XG4gICAgICogLy8gPT4geyAnZnJlZCc6ICdmaXJzdCcsICdiYXJuZXknOiAnc2Vjb25kJyB9XG4gICAgICovXG4gICAgZnVuY3Rpb24gaW52ZXJ0KG9iamVjdCkge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgcHJvcHMgPSBrZXlzKG9iamVjdCksXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgICAgIHJlc3VsdCA9IHt9O1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgICAgICByZXN1bHRbb2JqZWN0W2tleV1dID0ga2V5O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJvb2xlYW4gdmFsdWUuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhIGJvb2xlYW4gdmFsdWUsIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5pc0Jvb2xlYW4obnVsbCk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0Jvb2xlYW4odmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gZmFsc2UgfHxcbiAgICAgICAgdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09IGJvb2xDbGFzcyB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGRhdGUuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhIGRhdGUsIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5pc0RhdGUobmV3IERhdGUpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0RhdGUodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZGF0ZUNsYXNzIHx8IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgRE9NIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhIERPTSBlbGVtZW50LCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNFbGVtZW50KGRvY3VtZW50LmJvZHkpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0VsZW1lbnQodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSAmJiB2YWx1ZS5ub2RlVHlwZSA9PT0gMSB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBlbXB0eS4gQXJyYXlzLCBzdHJpbmdzLCBvciBgYXJndW1lbnRzYCBvYmplY3RzIHdpdGggYVxuICAgICAqIGxlbmd0aCBvZiBgMGAgYW5kIG9iamVjdHMgd2l0aCBubyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIGFyZSBjb25zaWRlcmVkXG4gICAgICogXCJlbXB0eVwiLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBlbXB0eSwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmlzRW1wdHkoWzEsIDIsIDNdKTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqXG4gICAgICogXy5pc0VtcHR5KHt9KTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmlzRW1wdHkoJycpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKHZhbHVlKSxcbiAgICAgICAgICBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG5cbiAgICAgIGlmICgoY2xhc3NOYW1lID09IGFycmF5Q2xhc3MgfHwgY2xhc3NOYW1lID09IHN0cmluZ0NsYXNzIHx8IGNsYXNzTmFtZSA9PSBhcmdzQ2xhc3MgKSB8fFxuICAgICAgICAgIChjbGFzc05hbWUgPT0gb2JqZWN0Q2xhc3MgJiYgdHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiBpc0Z1bmN0aW9uKHZhbHVlLnNwbGljZSkpKSB7XG4gICAgICAgIHJldHVybiAhbGVuZ3RoO1xuICAgICAgfVxuICAgICAgZm9yT3duKHZhbHVlLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIChyZXN1bHQgPSBmYWxzZSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgYSBkZWVwIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZVxuICAgICAqIGVxdWl2YWxlbnQgdG8gZWFjaCBvdGhlci4gSWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIGV4ZWN1dGVkXG4gICAgICogdG8gY29tcGFyZSB2YWx1ZXMuIElmIHRoZSBjYWxsYmFjayByZXR1cm5zIGB1bmRlZmluZWRgIGNvbXBhcmlzb25zIHdpbGxcbiAgICAgKiBiZSBoYW5kbGVkIGJ5IHRoZSBtZXRob2QgaW5zdGVhZC4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmRcbiAgICAgKiBpbnZva2VkIHdpdGggdHdvIGFyZ3VtZW50czsgKGEsIGIpLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IGEgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gICAgICogQHBhcmFtIHsqfSBiIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpbmcgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBvYmplY3QgPSB7ICduYW1lJzogJ2ZyZWQnIH07XG4gICAgICogdmFyIGNvcHkgPSB7ICduYW1lJzogJ2ZyZWQnIH07XG4gICAgICpcbiAgICAgKiBvYmplY3QgPT0gY29weTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqXG4gICAgICogXy5pc0VxdWFsKG9iamVjdCwgY29weSk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogdmFyIHdvcmRzID0gWydoZWxsbycsICdnb29kYnllJ107XG4gICAgICogdmFyIG90aGVyV29yZHMgPSBbJ2hpJywgJ2dvb2RieWUnXTtcbiAgICAgKlxuICAgICAqIF8uaXNFcXVhbCh3b3Jkcywgb3RoZXJXb3JkcywgZnVuY3Rpb24oYSwgYikge1xuICAgICAqICAgdmFyIHJlR3JlZXQgPSAvXig/OmhlbGxvfGhpKSQvaSxcbiAgICAgKiAgICAgICBhR3JlZXQgPSBfLmlzU3RyaW5nKGEpICYmIHJlR3JlZXQudGVzdChhKSxcbiAgICAgKiAgICAgICBiR3JlZXQgPSBfLmlzU3RyaW5nKGIpICYmIHJlR3JlZXQudGVzdChiKTtcbiAgICAgKlxuICAgICAqICAgcmV0dXJuIChhR3JlZXQgfHwgYkdyZWV0KSA/IChhR3JlZXQgPT0gYkdyZWV0KSA6IHVuZGVmaW5lZDtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNFcXVhbChhLCBiLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgcmV0dXJuIGJhc2VJc0VxdWFsKGEsIGIsIHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nICYmIGJhc2VDcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMikpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzLCBvciBjYW4gYmUgY29lcmNlZCB0bywgYSBmaW5pdGUgbnVtYmVyLlxuICAgICAqXG4gICAgICogTm90ZTogVGhpcyBpcyBub3QgdGhlIHNhbWUgYXMgbmF0aXZlIGBpc0Zpbml0ZWAgd2hpY2ggd2lsbCByZXR1cm4gdHJ1ZSBmb3JcbiAgICAgKiBib29sZWFucyBhbmQgZW1wdHkgc3RyaW5ncy4gU2VlIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuMS4yLjUuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBmaW5pdGUsIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5pc0Zpbml0ZSgtMTAxKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmlzRmluaXRlKCcxMCcpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKlxuICAgICAqIF8uaXNGaW5pdGUodHJ1ZSk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKlxuICAgICAqIF8uaXNGaW5pdGUoJycpO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICpcbiAgICAgKiBfLmlzRmluaXRlKEluZmluaXR5KTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzRmluaXRlKHZhbHVlKSB7XG4gICAgICByZXR1cm4gbmF0aXZlSXNGaW5pdGUodmFsdWUpICYmICFuYXRpdmVJc05hTihwYXJzZUZsb2F0KHZhbHVlKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5pc0Z1bmN0aW9uKF8pO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbic7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIGxhbmd1YWdlIHR5cGUgb2YgT2JqZWN0LlxuICAgICAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNPYmplY3Qoe30pO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKlxuICAgICAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmlzT2JqZWN0KDEpO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgICAgIC8vIGNoZWNrIGlmIHRoZSB2YWx1ZSBpcyB0aGUgRUNNQVNjcmlwdCBsYW5ndWFnZSB0eXBlIG9mIE9iamVjdFxuICAgICAgLy8gaHR0cDovL2VzNS5naXRodWIuaW8vI3g4XG4gICAgICAvLyBhbmQgYXZvaWQgYSBWOCBidWdcbiAgICAgIC8vIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTFcbiAgICAgIHJldHVybiAhISh2YWx1ZSAmJiBvYmplY3RUeXBlc1t0eXBlb2YgdmFsdWVdKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBgTmFOYC5cbiAgICAgKlxuICAgICAqIE5vdGU6IFRoaXMgaXMgbm90IHRoZSBzYW1lIGFzIG5hdGl2ZSBgaXNOYU5gIHdoaWNoIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3JcbiAgICAgKiBgdW5kZWZpbmVkYCBhbmQgb3RoZXIgbm9uLW51bWVyaWMgdmFsdWVzLiBTZWUgaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNS4xLjIuNC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGBOYU5gLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNOYU4oTmFOKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmlzTmFOKG5ldyBOdW1iZXIoTmFOKSk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogaXNOYU4odW5kZWZpbmVkKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmlzTmFOKHVuZGVmaW5lZCk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc05hTih2YWx1ZSkge1xuICAgICAgLy8gYE5hTmAgYXMgYSBwcmltaXRpdmUgaXMgdGhlIG9ubHkgdmFsdWUgdGhhdCBpcyBub3QgZXF1YWwgdG8gaXRzZWxmXG4gICAgICAvLyAocGVyZm9ybSB0aGUgW1tDbGFzc11dIGNoZWNrIGZpcnN0IHRvIGF2b2lkIGVycm9ycyB3aXRoIHNvbWUgaG9zdCBvYmplY3RzIGluIElFKVxuICAgICAgcmV0dXJuIGlzTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSAhPSArdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYG51bGxgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYG51bGxgLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNOdWxsKG51bGwpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKlxuICAgICAqIF8uaXNOdWxsKHVuZGVmaW5lZCk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc051bGwodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIG51bWJlci5cbiAgICAgKlxuICAgICAqIE5vdGU6IGBOYU5gIGlzIGNvbnNpZGVyZWQgYSBudW1iZXIuIFNlZSBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDguNS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGEgbnVtYmVyLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNOdW1iZXIoOC40ICogNSk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8XG4gICAgICAgIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBudW1iZXJDbGFzcyB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QgY3JlYXRlZCBieSB0aGUgYE9iamVjdGAgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcGxhaW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIGZ1bmN0aW9uIFNoYXBlKCkge1xuICAgICAqICAgdGhpcy54ID0gMDtcbiAgICAgKiAgIHRoaXMueSA9IDA7XG4gICAgICogfVxuICAgICAqXG4gICAgICogXy5pc1BsYWluT2JqZWN0KG5ldyBTaGFwZSk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKlxuICAgICAqIF8uaXNQbGFpbk9iamVjdChbMSwgMiwgM10pO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICpcbiAgICAgKiBfLmlzUGxhaW5PYmplY3QoeyAneCc6IDAsICd5JzogMCB9KTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgdmFyIGlzUGxhaW5PYmplY3QgPSAhZ2V0UHJvdG90eXBlT2YgPyBzaGltSXNQbGFpbk9iamVjdCA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoISh2YWx1ZSAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBvYmplY3RDbGFzcykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIHZhbHVlT2YgPSB2YWx1ZS52YWx1ZU9mLFxuICAgICAgICAgIG9ialByb3RvID0gaXNOYXRpdmUodmFsdWVPZikgJiYgKG9ialByb3RvID0gZ2V0UHJvdG90eXBlT2YodmFsdWVPZikpICYmIGdldFByb3RvdHlwZU9mKG9ialByb3RvKTtcblxuICAgICAgcmV0dXJuIG9ialByb3RvXG4gICAgICAgID8gKHZhbHVlID09IG9ialByb3RvIHx8IGdldFByb3RvdHlwZU9mKHZhbHVlKSA9PSBvYmpQcm90bylcbiAgICAgICAgOiBzaGltSXNQbGFpbk9iamVjdCh2YWx1ZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcmVndWxhciBleHByZXNzaW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYSByZWd1bGFyIGV4cHJlc3Npb24sIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5pc1JlZ0V4cCgvZnJlZC8pO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1JlZ0V4cCh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSByZWdleHBDbGFzcyB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGEgc3RyaW5nLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNTdHJpbmcoJ2ZyZWQnKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHxcbiAgICAgICAgdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN0cmluZ0NsYXNzIHx8IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAsIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5pc1VuZGVmaW5lZCh2b2lkIDApO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAndW5kZWZpbmVkJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIG9iamVjdCB3aXRoIHRoZSBzYW1lIGtleXMgYXMgYG9iamVjdGAgYW5kIHZhbHVlcyBnZW5lcmF0ZWQgYnlcbiAgICAgKiBydW5uaW5nIGVhY2ggb3duIGVudW1lcmFibGUgcHJvcGVydHkgb2YgYG9iamVjdGAgdGhyb3VnaCB0aGUgY2FsbGJhY2suXG4gICAgICogVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50cztcbiAgICAgKiAodmFsdWUsIGtleSwgb2JqZWN0KS5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IG9iamVjdCB3aXRoIHZhbHVlcyBvZiB0aGUgcmVzdWx0cyBvZiBlYWNoIGBjYWxsYmFja2AgZXhlY3V0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLm1hcFZhbHVlcyh7ICdhJzogMSwgJ2InOiAyLCAnYyc6IDN9ICwgZnVuY3Rpb24obnVtKSB7IHJldHVybiBudW0gKiAzOyB9KTtcbiAgICAgKiAvLyA9PiB7ICdhJzogMywgJ2InOiA2LCAnYyc6IDkgfVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSB7XG4gICAgICogICAnZnJlZCc6IHsgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiA0MCB9LFxuICAgICAqICAgJ3BlYmJsZXMnOiB7ICduYW1lJzogJ3BlYmJsZXMnLCAnYWdlJzogMSB9XG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ubWFwVmFsdWVzKGNoYXJhY3RlcnMsICdhZ2UnKTtcbiAgICAgKiAvLyA9PiB7ICdmcmVkJzogNDAsICdwZWJibGVzJzogMSB9XG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFwVmFsdWVzKG9iamVjdCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcblxuICAgICAgZm9yT3duKG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqZWN0KSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gY2FsbGJhY2sodmFsdWUsIGtleSwgb2JqZWN0KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWN1cnNpdmVseSBtZXJnZXMgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiB0aGUgc291cmNlIG9iamVjdChzKSwgdGhhdFxuICAgICAqIGRvbid0IHJlc29sdmUgdG8gYHVuZGVmaW5lZGAgaW50byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LiBTdWJzZXF1ZW50IHNvdXJjZXNcbiAgICAgKiB3aWxsIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91cyBzb3VyY2VzLiBJZiBhIGNhbGxiYWNrIGlzXG4gICAgICogcHJvdmlkZWQgaXQgd2lsbCBiZSBleGVjdXRlZCB0byBwcm9kdWNlIHRoZSBtZXJnZWQgdmFsdWVzIG9mIHRoZSBkZXN0aW5hdGlvblxuICAgICAqIGFuZCBzb3VyY2UgcHJvcGVydGllcy4gSWYgdGhlIGNhbGxiYWNrIHJldHVybnMgYHVuZGVmaW5lZGAgbWVyZ2luZyB3aWxsXG4gICAgICogYmUgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kXG4gICAgICogaW52b2tlZCB3aXRoIHR3byBhcmd1bWVudHM7IChvYmplY3RWYWx1ZSwgc291cmNlVmFsdWUpLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAgICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgbWVyZ2luZyBwcm9wZXJ0aWVzLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIG5hbWVzID0ge1xuICAgICAqICAgJ2NoYXJhY3RlcnMnOiBbXG4gICAgICogICAgIHsgJ25hbWUnOiAnYmFybmV5JyB9LFxuICAgICAqICAgICB7ICduYW1lJzogJ2ZyZWQnIH1cbiAgICAgKiAgIF1cbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogdmFyIGFnZXMgPSB7XG4gICAgICogICAnY2hhcmFjdGVycyc6IFtcbiAgICAgKiAgICAgeyAnYWdlJzogMzYgfSxcbiAgICAgKiAgICAgeyAnYWdlJzogNDAgfVxuICAgICAqICAgXVxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiBfLm1lcmdlKG5hbWVzLCBhZ2VzKTtcbiAgICAgKiAvLyA9PiB7ICdjaGFyYWN0ZXJzJzogW3sgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sIHsgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiA0MCB9XSB9XG4gICAgICpcbiAgICAgKiB2YXIgZm9vZCA9IHtcbiAgICAgKiAgICdmcnVpdHMnOiBbJ2FwcGxlJ10sXG4gICAgICogICAndmVnZXRhYmxlcyc6IFsnYmVldCddXG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIHZhciBvdGhlckZvb2QgPSB7XG4gICAgICogICAnZnJ1aXRzJzogWydiYW5hbmEnXSxcbiAgICAgKiAgICd2ZWdldGFibGVzJzogWydjYXJyb3QnXVxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiBfLm1lcmdlKGZvb2QsIG90aGVyRm9vZCwgZnVuY3Rpb24oYSwgYikge1xuICAgICAqICAgcmV0dXJuIF8uaXNBcnJheShhKSA/IGEuY29uY2F0KGIpIDogdW5kZWZpbmVkO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IHsgJ2ZydWl0cyc6IFsnYXBwbGUnLCAnYmFuYW5hJ10sICd2ZWdldGFibGVzJzogWydiZWV0JywgJ2NhcnJvdF0gfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1lcmdlKG9iamVjdCkge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgICAgbGVuZ3RoID0gMjtcblxuICAgICAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICB9XG4gICAgICAvLyBhbGxvd3Mgd29ya2luZyB3aXRoIGBfLnJlZHVjZWAgYW5kIGBfLnJlZHVjZVJpZ2h0YCB3aXRob3V0IHVzaW5nXG4gICAgICAvLyB0aGVpciBgaW5kZXhgIGFuZCBgY29sbGVjdGlvbmAgYXJndW1lbnRzXG4gICAgICBpZiAodHlwZW9mIGFyZ3NbMl0gIT0gJ251bWJlcicpIHtcbiAgICAgICAgbGVuZ3RoID0gYXJncy5sZW5ndGg7XG4gICAgICB9XG4gICAgICBpZiAobGVuZ3RoID4gMyAmJiB0eXBlb2YgYXJnc1tsZW5ndGggLSAyXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGJhc2VDcmVhdGVDYWxsYmFjayhhcmdzWy0tbGVuZ3RoIC0gMV0sIGFyZ3NbbGVuZ3RoLS1dLCAyKTtcbiAgICAgIH0gZWxzZSBpZiAobGVuZ3RoID4gMiAmJiB0eXBlb2YgYXJnc1tsZW5ndGggLSAxXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrID0gYXJnc1stLWxlbmd0aF07XG4gICAgICB9XG4gICAgICB2YXIgc291cmNlcyA9IHNsaWNlKGFyZ3VtZW50cywgMSwgbGVuZ3RoKSxcbiAgICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICAgIHN0YWNrQSA9IGdldEFycmF5KCksXG4gICAgICAgICAgc3RhY2tCID0gZ2V0QXJyYXkoKTtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgYmFzZU1lcmdlKG9iamVjdCwgc291cmNlc1tpbmRleF0sIGNhbGxiYWNrLCBzdGFja0EsIHN0YWNrQik7XG4gICAgICB9XG4gICAgICByZWxlYXNlQXJyYXkoc3RhY2tBKTtcbiAgICAgIHJlbGVhc2VBcnJheShzdGFja0IpO1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgc2hhbGxvdyBjbG9uZSBvZiBgb2JqZWN0YCBleGNsdWRpbmcgdGhlIHNwZWNpZmllZCBwcm9wZXJ0aWVzLlxuICAgICAqIFByb3BlcnR5IG5hbWVzIG1heSBiZSBzcGVjaWZpZWQgYXMgaW5kaXZpZHVhbCBhcmd1bWVudHMgb3IgYXMgYXJyYXlzIG9mXG4gICAgICogcHJvcGVydHkgbmFtZXMuIElmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSBleGVjdXRlZCBmb3IgZWFjaFxuICAgICAqIHByb3BlcnR5IG9mIGBvYmplY3RgIG9taXR0aW5nIHRoZSBwcm9wZXJ0aWVzIHRoZSBjYWxsYmFjayByZXR1cm5zIHRydWV5XG4gICAgICogZm9yLiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzO1xuICAgICAqICh2YWx1ZSwga2V5LCBvYmplY3QpLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258Li4uc3RyaW5nfHN0cmluZ1tdfSBbY2FsbGJhY2tdIFRoZSBwcm9wZXJ0aWVzIHRvIG9taXQgb3IgdGhlXG4gICAgICogIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IHdpdGhvdXQgdGhlIG9taXR0ZWQgcHJvcGVydGllcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5vbWl0KHsgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiA0MCB9LCAnYWdlJyk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdmcmVkJyB9XG4gICAgICpcbiAgICAgKiBfLm9taXQoeyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwIH0sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICogICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IHsgJ25hbWUnOiAnZnJlZCcgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG9taXQob2JqZWN0LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IFtdO1xuICAgICAgICBmb3JJbihvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICBwcm9wcy5wdXNoKGtleSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwcm9wcyA9IGJhc2VEaWZmZXJlbmNlKHByb3BzLCBiYXNlRmxhdHRlbihhcmd1bWVudHMsIHRydWUsIGZhbHNlLCAxKSk7XG5cbiAgICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gb2JqZWN0W2tleV07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgICAgZm9ySW4ob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmplY3QpIHtcbiAgICAgICAgICBpZiAoIWNhbGxiYWNrKHZhbHVlLCBrZXksIG9iamVjdCkpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHR3byBkaW1lbnNpb25hbCBhcnJheSBvZiBhbiBvYmplY3QncyBrZXktdmFsdWUgcGFpcnMsXG4gICAgICogaS5lLiBgW1trZXkxLCB2YWx1ZTFdLCBba2V5MiwgdmFsdWUyXV1gLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgbmV3IGFycmF5IG9mIGtleS12YWx1ZSBwYWlycy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5wYWlycyh7ICdiYXJuZXknOiAzNiwgJ2ZyZWQnOiA0MCB9KTtcbiAgICAgKiAvLyA9PiBbWydiYXJuZXknLCAzNl0sIFsnZnJlZCcsIDQwXV0gKHByb3BlcnR5IG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkIGFjcm9zcyBlbnZpcm9ubWVudHMpXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGFpcnMob2JqZWN0KSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBwcm9wcyA9IGtleXMob2JqZWN0KSxcbiAgICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IFtrZXksIG9iamVjdFtrZXldXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHNoYWxsb3cgY2xvbmUgb2YgYG9iamVjdGAgY29tcG9zZWQgb2YgdGhlIHNwZWNpZmllZCBwcm9wZXJ0aWVzLlxuICAgICAqIFByb3BlcnR5IG5hbWVzIG1heSBiZSBzcGVjaWZpZWQgYXMgaW5kaXZpZHVhbCBhcmd1bWVudHMgb3IgYXMgYXJyYXlzIG9mXG4gICAgICogcHJvcGVydHkgbmFtZXMuIElmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSBleGVjdXRlZCBmb3IgZWFjaFxuICAgICAqIHByb3BlcnR5IG9mIGBvYmplY3RgIHBpY2tpbmcgdGhlIHByb3BlcnRpZXMgdGhlIGNhbGxiYWNrIHJldHVybnMgdHJ1ZXlcbiAgICAgKiBmb3IuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7XG4gICAgICogKHZhbHVlLCBrZXksIG9iamVjdCkuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHNvdXJjZSBvYmplY3QuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnwuLi5zdHJpbmd8c3RyaW5nW119IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXJcbiAgICAgKiAgaXRlcmF0aW9uIG9yIHByb3BlcnR5IG5hbWVzIHRvIHBpY2ssIHNwZWNpZmllZCBhcyBpbmRpdmlkdWFsIHByb3BlcnR5XG4gICAgICogIG5hbWVzIG9yIGFycmF5cyBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCBjb21wb3NlZCBvZiB0aGUgcGlja2VkIHByb3BlcnRpZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ucGljayh7ICduYW1lJzogJ2ZyZWQnLCAnX3VzZXJpZCc6ICdmcmVkMScgfSwgJ25hbWUnKTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2ZyZWQnIH1cbiAgICAgKlxuICAgICAqIF8ucGljayh7ICduYW1lJzogJ2ZyZWQnLCAnX3VzZXJpZCc6ICdmcmVkMScgfSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAqICAgcmV0dXJuIGtleS5jaGFyQXQoMCkgIT0gJ18nO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IHsgJ25hbWUnOiAnZnJlZCcgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBpY2sob2JqZWN0LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgICAgcHJvcHMgPSBiYXNlRmxhdHRlbihhcmd1bWVudHMsIHRydWUsIGZhbHNlLCAxKSxcbiAgICAgICAgICAgIGxlbmd0aCA9IGlzT2JqZWN0KG9iamVjdCkgPyBwcm9wcy5sZW5ndGggOiAwO1xuXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgICAgZm9ySW4ob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmplY3QpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWUsIGtleSwgb2JqZWN0KSkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBhbHRlcm5hdGl2ZSB0byBgXy5yZWR1Y2VgIHRoaXMgbWV0aG9kIHRyYW5zZm9ybXMgYG9iamVjdGAgdG8gYSBuZXdcbiAgICAgKiBgYWNjdW11bGF0b3JgIG9iamVjdCB3aGljaCBpcyB0aGUgcmVzdWx0IG9mIHJ1bm5pbmcgZWFjaCBvZiBpdHMgb3duXG4gICAgICogZW51bWVyYWJsZSBwcm9wZXJ0aWVzIHRocm91Z2ggYSBjYWxsYmFjaywgd2l0aCBlYWNoIGNhbGxiYWNrIGV4ZWN1dGlvblxuICAgICAqIHBvdGVudGlhbGx5IG11dGF0aW5nIHRoZSBgYWNjdW11bGF0b3JgIG9iamVjdC4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvXG4gICAgICogYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggZm91ciBhcmd1bWVudHM7IChhY2N1bXVsYXRvciwgdmFsdWUsIGtleSwgb2JqZWN0KS5cbiAgICAgKiBDYWxsYmFja3MgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHsqfSBbYWNjdW11bGF0b3JdIFRoZSBjdXN0b20gYWNjdW11bGF0b3IgdmFsdWUuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGFjY3VtdWxhdGVkIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgc3F1YXJlcyA9IF8udHJhbnNmb3JtKFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMF0sIGZ1bmN0aW9uKHJlc3VsdCwgbnVtKSB7XG4gICAgICogICBudW0gKj0gbnVtO1xuICAgICAqICAgaWYgKG51bSAlIDIpIHtcbiAgICAgKiAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKG51bSkgPCAzO1xuICAgICAqICAgfVxuICAgICAqIH0pO1xuICAgICAqIC8vID0+IFsxLCA5LCAyNV1cbiAgICAgKlxuICAgICAqIHZhciBtYXBwZWQgPSBfLnRyYW5zZm9ybSh7ICdhJzogMSwgJ2InOiAyLCAnYyc6IDMgfSwgZnVuY3Rpb24ocmVzdWx0LCBudW0sIGtleSkge1xuICAgICAqICAgcmVzdWx0W2tleV0gPSBudW0gKiAzO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IHsgJ2EnOiAzLCAnYic6IDYsICdjJzogOSB9XG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtKG9iamVjdCwgY2FsbGJhY2ssIGFjY3VtdWxhdG9yLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgaXNBcnIgPSBpc0FycmF5KG9iamVjdCk7XG4gICAgICBpZiAoYWNjdW11bGF0b3IgPT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNBcnIpIHtcbiAgICAgICAgICBhY2N1bXVsYXRvciA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBjdG9yID0gb2JqZWN0ICYmIG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgICAgICAgICAgcHJvdG8gPSBjdG9yICYmIGN0b3IucHJvdG90eXBlO1xuXG4gICAgICAgICAgYWNjdW11bGF0b3IgPSBiYXNlQ3JlYXRlKHByb3RvKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCA0KTtcbiAgICAgICAgKGlzQXJyID8gZm9yRWFjaCA6IGZvck93bikob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBvYmplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGFycmF5IGNvbXBvc2VkIG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSB2YWx1ZXMgb2YgYG9iamVjdGAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiBwcm9wZXJ0eSB2YWx1ZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8udmFsdWVzKHsgJ29uZSc6IDEsICd0d28nOiAyLCAndGhyZWUnOiAzIH0pO1xuICAgICAqIC8vID0+IFsxLCAyLCAzXSAocHJvcGVydHkgb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQgYWNyb3NzIGVudmlyb25tZW50cylcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB2YWx1ZXMob2JqZWN0KSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBwcm9wcyA9IGtleXMob2JqZWN0KSxcbiAgICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IG9iamVjdFtwcm9wc1tpbmRleF1dO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgZWxlbWVudHMgZnJvbSB0aGUgc3BlY2lmaWVkIGluZGV4ZXMsIG9yIGtleXMsIG9mIHRoZVxuICAgICAqIGBjb2xsZWN0aW9uYC4gSW5kZXhlcyBtYXkgYmUgc3BlY2lmaWVkIGFzIGluZGl2aWR1YWwgYXJndW1lbnRzIG9yIGFzIGFycmF5c1xuICAgICAqIG9mIGluZGV4ZXMuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7Li4uKG51bWJlcnxudW1iZXJbXXxzdHJpbmd8c3RyaW5nW10pfSBbaW5kZXhdIFRoZSBpbmRleGVzIG9mIGBjb2xsZWN0aW9uYFxuICAgICAqICAgdG8gcmV0cmlldmUsIHNwZWNpZmllZCBhcyBpbmRpdmlkdWFsIGluZGV4ZXMgb3IgYXJyYXlzIG9mIGluZGV4ZXMuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIGVsZW1lbnRzIGNvcnJlc3BvbmRpbmcgdG8gdGhlXG4gICAgICogIHByb3ZpZGVkIGluZGV4ZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uYXQoWydhJywgJ2InLCAnYycsICdkJywgJ2UnXSwgWzAsIDIsIDRdKTtcbiAgICAgKiAvLyA9PiBbJ2EnLCAnYycsICdlJ11cbiAgICAgKlxuICAgICAqIF8uYXQoWydmcmVkJywgJ2Jhcm5leScsICdwZWJibGVzJ10sIDAsIDIpO1xuICAgICAqIC8vID0+IFsnZnJlZCcsICdwZWJibGVzJ11cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhdChjb2xsZWN0aW9uKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICAgIHByb3BzID0gYmFzZUZsYXR0ZW4oYXJncywgdHJ1ZSwgZmFsc2UsIDEpLFxuICAgICAgICAgIGxlbmd0aCA9IChhcmdzWzJdICYmIGFyZ3NbMl1bYXJnc1sxXV0gPT09IGNvbGxlY3Rpb24pID8gMSA6IHByb3BzLmxlbmd0aCxcbiAgICAgICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgICB3aGlsZSgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBjb2xsZWN0aW9uW3Byb3BzW2luZGV4XV07XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBhIGdpdmVuIHZhbHVlIGlzIHByZXNlbnQgaW4gYSBjb2xsZWN0aW9uIHVzaW5nIHN0cmljdCBlcXVhbGl0eVxuICAgICAqIGZvciBjb21wYXJpc29ucywgaS5lLiBgPT09YC4gSWYgYGZyb21JbmRleGAgaXMgbmVnYXRpdmUsIGl0IGlzIHVzZWQgYXMgdGhlXG4gICAgICogb2Zmc2V0IGZyb20gdGhlIGVuZCBvZiB0aGUgY29sbGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyBpbmNsdWRlXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0geyp9IHRhcmdldCBUaGUgdmFsdWUgdG8gY2hlY2sgZm9yLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZnJvbUluZGV4PTBdIFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB0YXJnZXRgIGVsZW1lbnQgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5jb250YWlucyhbMSwgMiwgM10sIDEpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKlxuICAgICAqIF8uY29udGFpbnMoWzEsIDIsIDNdLCAxLCAyKTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqXG4gICAgICogXy5jb250YWlucyh7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAgfSwgJ2ZyZWQnKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmNvbnRhaW5zKCdwZWJibGVzJywgJ2ViJyk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbnRhaW5zKGNvbGxlY3Rpb24sIHRhcmdldCwgZnJvbUluZGV4KSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBpbmRleE9mID0gZ2V0SW5kZXhPZigpLFxuICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDAsXG4gICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG5cbiAgICAgIGZyb21JbmRleCA9IChmcm9tSW5kZXggPCAwID8gbmF0aXZlTWF4KDAsIGxlbmd0aCArIGZyb21JbmRleCkgOiBmcm9tSW5kZXgpIHx8IDA7XG4gICAgICBpZiAoaXNBcnJheShjb2xsZWN0aW9uKSkge1xuICAgICAgICByZXN1bHQgPSBpbmRleE9mKGNvbGxlY3Rpb24sIHRhcmdldCwgZnJvbUluZGV4KSA+IC0xO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInKSB7XG4gICAgICAgIHJlc3VsdCA9IChpc1N0cmluZyhjb2xsZWN0aW9uKSA/IGNvbGxlY3Rpb24uaW5kZXhPZih0YXJnZXQsIGZyb21JbmRleCkgOiBpbmRleE9mKGNvbGxlY3Rpb24sIHRhcmdldCwgZnJvbUluZGV4KSkgPiAtMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvck93bihjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIGlmICgrK2luZGV4ID49IGZyb21JbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuICEocmVzdWx0ID0gdmFsdWUgPT09IHRhcmdldCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2Yga2V5cyBnZW5lcmF0ZWQgZnJvbSB0aGUgcmVzdWx0cyBvZiBydW5uaW5nXG4gICAgICogZWFjaCBlbGVtZW50IG9mIGBjb2xsZWN0aW9uYCB0aHJvdWdoIHRoZSBjYWxsYmFjay4gVGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVcbiAgICAgKiBvZiBlYWNoIGtleSBpcyB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoZSBrZXkgd2FzIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFjay5cbiAgICAgKiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzO1xuICAgICAqICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNvbXBvc2VkIGFnZ3JlZ2F0ZSBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uY291bnRCeShbNC4zLCA2LjEsIDYuNF0sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gTWF0aC5mbG9vcihudW0pOyB9KTtcbiAgICAgKiAvLyA9PiB7ICc0JzogMSwgJzYnOiAyIH1cbiAgICAgKlxuICAgICAqIF8uY291bnRCeShbNC4zLCA2LjEsIDYuNF0sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gdGhpcy5mbG9vcihudW0pOyB9LCBNYXRoKTtcbiAgICAgKiAvLyA9PiB7ICc0JzogMSwgJzYnOiAyIH1cbiAgICAgKlxuICAgICAqIF8uY291bnRCeShbJ29uZScsICd0d28nLCAndGhyZWUnXSwgJ2xlbmd0aCcpO1xuICAgICAqIC8vID0+IHsgJzMnOiAyLCAnNSc6IDEgfVxuICAgICAqL1xuICAgIHZhciBjb3VudEJ5ID0gY3JlYXRlQWdncmVnYXRvcihmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICAgIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdCwga2V5KSA/IHJlc3VsdFtrZXldKysgOiByZXN1bHRba2V5XSA9IDEpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBjYWxsYmFjayByZXR1cm5zIHRydWV5IHZhbHVlIGZvciAqKmFsbCoqIGVsZW1lbnRzIG9mXG4gICAgICogYSBjb2xsZWN0aW9uLiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWVcbiAgICAgKiBhcmd1bWVudHM7ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIGFsbFxuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYWxsIGVsZW1lbnRzIHBhc3NlZCB0aGUgY2FsbGJhY2sgY2hlY2ssXG4gICAgICogIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5ldmVyeShbdHJ1ZSwgMSwgbnVsbCwgJ3llcyddKTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAnYWdlJzogNDAgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmV2ZXJ5KGNoYXJhY3RlcnMsICdhZ2UnKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmV2ZXJ5KGNoYXJhY3RlcnMsIHsgJ2FnZSc6IDM2IH0pO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXZlcnkoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuXG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5sZW5ndGggOiAwO1xuXG4gICAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIGlmICghKHJlc3VsdCA9ICEhY2FsbGJhY2soY29sbGVjdGlvbltpbmRleF0sIGluZGV4LCBjb2xsZWN0aW9uKSkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yT3duKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICAgIHJldHVybiAocmVzdWx0ID0gISFjYWxsYmFjayh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYSBjb2xsZWN0aW9uLCByZXR1cm5pbmcgYW4gYXJyYXkgb2YgYWxsIGVsZW1lbnRzXG4gICAgICogdGhlIGNhbGxiYWNrIHJldHVybnMgdHJ1ZXkgZm9yLiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZFxuICAgICAqIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIHNlbGVjdFxuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgZWxlbWVudHMgdGhhdCBwYXNzZWQgdGhlIGNhbGxiYWNrIGNoZWNrLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgZXZlbnMgPSBfLmZpbHRlcihbMSwgMiwgMywgNCwgNSwgNl0sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gbnVtICUgMiA9PSAwOyB9KTtcbiAgICAgKiAvLyA9PiBbMiwgNCwgNl1cbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYsICdibG9ja2VkJzogZmFsc2UgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwLCAnYmxvY2tlZCc6IHRydWUgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmZpbHRlcihjaGFyYWN0ZXJzLCAnYmxvY2tlZCcpO1xuICAgICAqIC8vID0+IFt7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAsICdibG9ja2VkJzogdHJ1ZSB9XVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maWx0ZXIoY2hhcmFjdGVycywgeyAnYWdlJzogMzYgfSk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAnYmxvY2tlZCc6IGZhbHNlIH1dXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmlsdGVyKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG5cbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDA7XG5cbiAgICAgIGlmICh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInKSB7XG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gY29sbGVjdGlvbltpbmRleF07XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvck93bihjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYSBjb2xsZWN0aW9uLCByZXR1cm5pbmcgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdFxuICAgICAqIHRoZSBjYWxsYmFjayByZXR1cm5zIHRydWV5IGZvci4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmRcbiAgICAgKiBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyBkZXRlY3QsIGZpbmRXaGVyZVxuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZm91bmQgZWxlbWVudCwgZWxzZSBgdW5kZWZpbmVkYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICAnYWdlJzogMzYsICdibG9ja2VkJzogZmFsc2UgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgICdhZ2UnOiA0MCwgJ2Jsb2NrZWQnOiB0cnVlIH0sXG4gICAgICogICB7ICduYW1lJzogJ3BlYmJsZXMnLCAnYWdlJzogMSwgICdibG9ja2VkJzogZmFsc2UgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiBfLmZpbmQoY2hhcmFjdGVycywgZnVuY3Rpb24oY2hyKSB7XG4gICAgICogICByZXR1cm4gY2hyLmFnZSA8IDQwO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAnYmxvY2tlZCc6IGZhbHNlIH1cbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uZmluZChjaGFyYWN0ZXJzLCB7ICdhZ2UnOiAxIH0pO1xuICAgICAqIC8vID0+ICB7ICduYW1lJzogJ3BlYmJsZXMnLCAnYWdlJzogMSwgJ2Jsb2NrZWQnOiBmYWxzZSB9XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmZpbmQoY2hhcmFjdGVycywgJ2Jsb2NrZWQnKTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAsICdibG9ja2VkJzogdHJ1ZSB9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZmluZChjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuXG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5sZW5ndGggOiAwO1xuXG4gICAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGNvbGxlY3Rpb25baW5kZXhdO1xuICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICBmb3JPd24oY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5maW5kYCBleGNlcHQgdGhhdCBpdCBpdGVyYXRlcyBvdmVyIGVsZW1lbnRzXG4gICAgICogb2YgYSBgY29sbGVjdGlvbmAgZnJvbSByaWdodCB0byBsZWZ0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmb3VuZCBlbGVtZW50LCBlbHNlIGB1bmRlZmluZWRgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmZpbmRMYXN0KFsxLCAyLCAzLCA0XSwgZnVuY3Rpb24obnVtKSB7XG4gICAgICogICByZXR1cm4gbnVtICUgMiA9PSAxO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IDNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaW5kTGFzdChjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgIGZvckVhY2hSaWdodChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGEgY29sbGVjdGlvbiwgZXhlY3V0aW5nIHRoZSBjYWxsYmFjayBmb3IgZWFjaFxuICAgICAqIGVsZW1lbnQuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7XG4gICAgICogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLiBDYWxsYmFja3MgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5XG4gICAgICogZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIE5vdGU6IEFzIHdpdGggb3RoZXIgXCJDb2xsZWN0aW9uc1wiIG1ldGhvZHMsIG9iamVjdHMgd2l0aCBhIGBsZW5ndGhgIHByb3BlcnR5XG4gICAgICogYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIGBfLmZvckluYCBvciBgXy5mb3JPd25gXG4gICAgICogbWF5IGJlIHVzZWQgZm9yIG9iamVjdCBpdGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgZWFjaFxuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fE9iamVjdHxzdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfKFsxLCAyLCAzXSkuZm9yRWFjaChmdW5jdGlvbihudW0pIHsgY29uc29sZS5sb2cobnVtKTsgfSkuam9pbignLCcpO1xuICAgICAqIC8vID0+IGxvZ3MgZWFjaCBudW1iZXIgYW5kIHJldHVybnMgJzEsMiwzJ1xuICAgICAqXG4gICAgICogXy5mb3JFYWNoKHsgJ29uZSc6IDEsICd0d28nOiAyLCAndGhyZWUnOiAzIH0sIGZ1bmN0aW9uKG51bSkgeyBjb25zb2xlLmxvZyhudW0pOyB9KTtcbiAgICAgKiAvLyA9PiBsb2dzIGVhY2ggbnVtYmVyIGFuZCByZXR1cm5zIHRoZSBvYmplY3QgKHByb3BlcnR5IG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkIGFjcm9zcyBlbnZpcm9ubWVudHMpXG4gICAgICovXG4gICAgZnVuY3Rpb24gZm9yRWFjaChjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMDtcblxuICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayAmJiB0eXBlb2YgdGhpc0FyZyA9PSAndW5kZWZpbmVkJyA/IGNhbGxiYWNrIDogYmFzZUNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgIGlmICh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInKSB7XG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKGNvbGxlY3Rpb25baW5kZXhdLCBpbmRleCwgY29sbGVjdGlvbikgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvck93bihjb2xsZWN0aW9uLCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmZvckVhY2hgIGV4Y2VwdCB0aGF0IGl0IGl0ZXJhdGVzIG92ZXIgZWxlbWVudHNcbiAgICAgKiBvZiBhIGBjb2xsZWN0aW9uYCBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgZWFjaFJpZ2h0XG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fHN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8oWzEsIDIsIDNdKS5mb3JFYWNoUmlnaHQoZnVuY3Rpb24obnVtKSB7IGNvbnNvbGUubG9nKG51bSk7IH0pLmpvaW4oJywnKTtcbiAgICAgKiAvLyA9PiBsb2dzIGVhY2ggbnVtYmVyIGZyb20gcmlnaHQgdG8gbGVmdCBhbmQgcmV0dXJucyAnMywyLDEnXG4gICAgICovXG4gICAgZnVuY3Rpb24gZm9yRWFjaFJpZ2h0KGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMDtcbiAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgJiYgdHlwZW9mIHRoaXNBcmcgPT0gJ3VuZGVmaW5lZCcgPyBjYWxsYmFjayA6IGJhc2VDcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2soY29sbGVjdGlvbltsZW5ndGhdLCBsZW5ndGgsIGNvbGxlY3Rpb24pID09PSBmYWxzZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcHJvcHMgPSBrZXlzKGNvbGxlY3Rpb24pO1xuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG4gICAgICAgIGZvck93bihjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAga2V5ID0gcHJvcHMgPyBwcm9wc1stLWxlbmd0aF0gOiAtLWxlbmd0aDtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY29sbGVjdGlvbltrZXldLCBrZXksIGNvbGxlY3Rpb24pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIGtleXMgZ2VuZXJhdGVkIGZyb20gdGhlIHJlc3VsdHMgb2YgcnVubmluZ1xuICAgICAqIGVhY2ggZWxlbWVudCBvZiBhIGNvbGxlY3Rpb24gdGhyb3VnaCB0aGUgY2FsbGJhY2suIFRoZSBjb3JyZXNwb25kaW5nIHZhbHVlXG4gICAgICogb2YgZWFjaCBrZXkgaXMgYW4gYXJyYXkgb2YgdGhlIGVsZW1lbnRzIHJlc3BvbnNpYmxlIGZvciBnZW5lcmF0aW5nIHRoZSBrZXkuXG4gICAgICogVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50cztcbiAgICAgKiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNvbXBvc2VkIGFnZ3JlZ2F0ZSBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uZ3JvdXBCeShbNC4yLCA2LjEsIDYuNF0sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gTWF0aC5mbG9vcihudW0pOyB9KTtcbiAgICAgKiAvLyA9PiB7ICc0JzogWzQuMl0sICc2JzogWzYuMSwgNi40XSB9XG4gICAgICpcbiAgICAgKiBfLmdyb3VwQnkoWzQuMiwgNi4xLCA2LjRdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIHRoaXMuZmxvb3IobnVtKTsgfSwgTWF0aCk7XG4gICAgICogLy8gPT4geyAnNCc6IFs0LjJdLCAnNic6IFs2LjEsIDYuNF0gfVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5ncm91cEJ5KFsnb25lJywgJ3R3bycsICd0aHJlZSddLCAnbGVuZ3RoJyk7XG4gICAgICogLy8gPT4geyAnMyc6IFsnb25lJywgJ3R3byddLCAnNSc6IFsndGhyZWUnXSB9XG4gICAgICovXG4gICAgdmFyIGdyb3VwQnkgPSBjcmVhdGVBZ2dyZWdhdG9yKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgICAgKGhhc093blByb3BlcnR5LmNhbGwocmVzdWx0LCBrZXkpID8gcmVzdWx0W2tleV0gOiByZXN1bHRba2V5XSA9IFtdKS5wdXNoKHZhbHVlKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIGtleXMgZ2VuZXJhdGVkIGZyb20gdGhlIHJlc3VsdHMgb2YgcnVubmluZ1xuICAgICAqIGVhY2ggZWxlbWVudCBvZiB0aGUgY29sbGVjdGlvbiB0aHJvdWdoIHRoZSBnaXZlbiBjYWxsYmFjay4gVGhlIGNvcnJlc3BvbmRpbmdcbiAgICAgKiB2YWx1ZSBvZiBlYWNoIGtleSBpcyB0aGUgbGFzdCBlbGVtZW50IHJlc3BvbnNpYmxlIGZvciBnZW5lcmF0aW5nIHRoZSBrZXkuXG4gICAgICogVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50cztcbiAgICAgKiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjb21wb3NlZCBhZ2dyZWdhdGUgb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIga2V5cyA9IFtcbiAgICAgKiAgIHsgJ2Rpcic6ICdsZWZ0JywgJ2NvZGUnOiA5NyB9LFxuICAgICAqICAgeyAnZGlyJzogJ3JpZ2h0JywgJ2NvZGUnOiAxMDAgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiBfLmluZGV4Qnkoa2V5cywgJ2RpcicpO1xuICAgICAqIC8vID0+IHsgJ2xlZnQnOiB7ICdkaXInOiAnbGVmdCcsICdjb2RlJzogOTcgfSwgJ3JpZ2h0JzogeyAnZGlyJzogJ3JpZ2h0JywgJ2NvZGUnOiAxMDAgfSB9XG4gICAgICpcbiAgICAgKiBfLmluZGV4Qnkoa2V5cywgZnVuY3Rpb24oa2V5KSB7IHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGtleS5jb2RlKTsgfSk7XG4gICAgICogLy8gPT4geyAnYSc6IHsgJ2Rpcic6ICdsZWZ0JywgJ2NvZGUnOiA5NyB9LCAnZCc6IHsgJ2Rpcic6ICdyaWdodCcsICdjb2RlJzogMTAwIH0gfVxuICAgICAqXG4gICAgICogXy5pbmRleEJ5KGNoYXJhY3RlcnMsIGZ1bmN0aW9uKGtleSkgeyB0aGlzLmZyb21DaGFyQ29kZShrZXkuY29kZSk7IH0sIFN0cmluZyk7XG4gICAgICogLy8gPT4geyAnYSc6IHsgJ2Rpcic6ICdsZWZ0JywgJ2NvZGUnOiA5NyB9LCAnZCc6IHsgJ2Rpcic6ICdyaWdodCcsICdjb2RlJzogMTAwIH0gfVxuICAgICAqL1xuICAgIHZhciBpbmRleEJ5ID0gY3JlYXRlQWdncmVnYXRvcihmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIHRoZSBtZXRob2QgbmFtZWQgYnkgYG1ldGhvZE5hbWVgIG9uIGVhY2ggZWxlbWVudCBpbiB0aGUgYGNvbGxlY3Rpb25gXG4gICAgICogcmV0dXJuaW5nIGFuIGFycmF5IG9mIHRoZSByZXN1bHRzIG9mIGVhY2ggaW52b2tlZCBtZXRob2QuIEFkZGl0aW9uYWwgYXJndW1lbnRzXG4gICAgICogd2lsbCBiZSBwcm92aWRlZCB0byBlYWNoIGludm9rZWQgbWV0aG9kLiBJZiBgbWV0aG9kTmFtZWAgaXMgYSBmdW5jdGlvbiBpdFxuICAgICAqIHdpbGwgYmUgaW52b2tlZCBmb3IsIGFuZCBgdGhpc2AgYm91bmQgdG8sIGVhY2ggZWxlbWVudCBpbiB0aGUgYGNvbGxlY3Rpb25gLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gbWV0aG9kTmFtZSBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHRvIGludm9rZSBvclxuICAgICAqICB0aGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW2FyZ10gQXJndW1lbnRzIHRvIGludm9rZSB0aGUgbWV0aG9kIHdpdGguXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIHRoZSByZXN1bHRzIG9mIGVhY2ggaW52b2tlZCBtZXRob2QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaW52b2tlKFtbNSwgMSwgN10sIFszLCAyLCAxXV0sICdzb3J0Jyk7XG4gICAgICogLy8gPT4gW1sxLCA1LCA3XSwgWzEsIDIsIDNdXVxuICAgICAqXG4gICAgICogXy5pbnZva2UoWzEyMywgNDU2XSwgU3RyaW5nLnByb3RvdHlwZS5zcGxpdCwgJycpO1xuICAgICAqIC8vID0+IFtbJzEnLCAnMicsICczJ10sIFsnNCcsICc1JywgJzYnXV1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnZva2UoY29sbGVjdGlvbiwgbWV0aG9kTmFtZSkge1xuICAgICAgdmFyIGFyZ3MgPSBzbGljZShhcmd1bWVudHMsIDIpLFxuICAgICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgICAgaXNGdW5jID0gdHlwZW9mIG1ldGhvZE5hbWUgPT0gJ2Z1bmN0aW9uJyxcbiAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5sZW5ndGggOiAwLFxuICAgICAgICAgIHJlc3VsdCA9IEFycmF5KHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgPyBsZW5ndGggOiAwKTtcblxuICAgICAgZm9yRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXN1bHRbKytpbmRleF0gPSAoaXNGdW5jID8gbWV0aG9kTmFtZSA6IHZhbHVlW21ldGhvZE5hbWVdKS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBvZiB2YWx1ZXMgYnkgcnVubmluZyBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICAgKiB0aHJvdWdoIHRoZSBjYWxsYmFjay4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoXG4gICAgICogdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyBjb2xsZWN0XG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiB0aGUgcmVzdWx0cyBvZiBlYWNoIGBjYWxsYmFja2AgZXhlY3V0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLm1hcChbMSwgMiwgM10sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gbnVtICogMzsgfSk7XG4gICAgICogLy8gPT4gWzMsIDYsIDldXG4gICAgICpcbiAgICAgKiBfLm1hcCh7ICdvbmUnOiAxLCAndHdvJzogMiwgJ3RocmVlJzogMyB9LCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIG51bSAqIDM7IH0pO1xuICAgICAqIC8vID0+IFszLCA2LCA5XSAocHJvcGVydHkgb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQgYWNyb3NzIGVudmlyb25tZW50cylcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5tYXAoY2hhcmFjdGVycywgJ25hbWUnKTtcbiAgICAgKiAvLyA9PiBbJ2Jhcm5leScsICdmcmVkJ11cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtYXAoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDA7XG5cbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgIGlmICh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIHJlc3VsdFtpbmRleF0gPSBjYWxsYmFjayhjb2xsZWN0aW9uW2luZGV4XSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yT3duKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICByZXN1bHRbKytpbmRleF0gPSBjYWxsYmFjayh2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgbWF4aW11bSB2YWx1ZSBvZiBhIGNvbGxlY3Rpb24uIElmIHRoZSBjb2xsZWN0aW9uIGlzIGVtcHR5IG9yXG4gICAgICogZmFsc2V5IGAtSW5maW5pdHlgIGlzIHJldHVybmVkLiBJZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgZXhlY3V0ZWRcbiAgICAgKiBmb3IgZWFjaCB2YWx1ZSBpbiB0aGUgY29sbGVjdGlvbiB0byBnZW5lcmF0ZSB0aGUgY3JpdGVyaW9uIGJ5IHdoaWNoIHRoZSB2YWx1ZVxuICAgICAqIGlzIHJhbmtlZC4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlXG4gICAgICogYXJndW1lbnRzOyAodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKS5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXhpbXVtIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLm1heChbNCwgMiwgOCwgNl0pO1xuICAgICAqIC8vID0+IDhcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogXy5tYXgoY2hhcmFjdGVycywgZnVuY3Rpb24oY2hyKSB7IHJldHVybiBjaHIuYWdlOyB9KTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAgfTtcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ubWF4KGNoYXJhY3RlcnMsICdhZ2UnKTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAgfTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtYXgoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IC1JbmZpbml0eSxcbiAgICAgICAgICByZXN1bHQgPSBjb21wdXRlZDtcblxuICAgICAgLy8gYWxsb3dzIHdvcmtpbmcgd2l0aCBmdW5jdGlvbnMgbGlrZSBgXy5tYXBgIHdpdGhvdXQgdXNpbmdcbiAgICAgIC8vIHRoZWlyIGBpbmRleGAgYXJndW1lbnQgYXMgYSBjYWxsYmFja1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnZnVuY3Rpb24nICYmIHRoaXNBcmcgJiYgdGhpc0FyZ1tjYWxsYmFja10gPT09IGNvbGxlY3Rpb24pIHtcbiAgICAgICAgY2FsbGJhY2sgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKGNhbGxiYWNrID09IG51bGwgJiYgaXNBcnJheShjb2xsZWN0aW9uKSkge1xuICAgICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gY29sbGVjdGlvbltpbmRleF07XG4gICAgICAgICAgaWYgKHZhbHVlID4gcmVzdWx0KSB7XG4gICAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrID0gKGNhbGxiYWNrID09IG51bGwgJiYgaXNTdHJpbmcoY29sbGVjdGlvbikpXG4gICAgICAgICAgPyBjaGFyQXRDYWxsYmFja1xuICAgICAgICAgIDogbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcblxuICAgICAgICBmb3JFYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICAgIHZhciBjdXJyZW50ID0gY2FsbGJhY2sodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgICBpZiAoY3VycmVudCA+IGNvbXB1dGVkKSB7XG4gICAgICAgICAgICBjb21wdXRlZCA9IGN1cnJlbnQ7XG4gICAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIG1pbmltdW0gdmFsdWUgb2YgYSBjb2xsZWN0aW9uLiBJZiB0aGUgY29sbGVjdGlvbiBpcyBlbXB0eSBvclxuICAgICAqIGZhbHNleSBgSW5maW5pdHlgIGlzIHJldHVybmVkLiBJZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgZXhlY3V0ZWRcbiAgICAgKiBmb3IgZWFjaCB2YWx1ZSBpbiB0aGUgY29sbGVjdGlvbiB0byBnZW5lcmF0ZSB0aGUgY3JpdGVyaW9uIGJ5IHdoaWNoIHRoZSB2YWx1ZVxuICAgICAqIGlzIHJhbmtlZC4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlXG4gICAgICogYXJndW1lbnRzOyAodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKS5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtaW5pbXVtIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLm1pbihbNCwgMiwgOCwgNl0pO1xuICAgICAqIC8vID0+IDJcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogXy5taW4oY2hhcmFjdGVycywgZnVuY3Rpb24oY2hyKSB7IHJldHVybiBjaHIuYWdlOyB9KTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9O1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5taW4oY2hhcmFjdGVycywgJ2FnZScpO1xuICAgICAqIC8vID0+IHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH07XG4gICAgICovXG4gICAgZnVuY3Rpb24gbWluKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSBJbmZpbml0eSxcbiAgICAgICAgICByZXN1bHQgPSBjb21wdXRlZDtcblxuICAgICAgLy8gYWxsb3dzIHdvcmtpbmcgd2l0aCBmdW5jdGlvbnMgbGlrZSBgXy5tYXBgIHdpdGhvdXQgdXNpbmdcbiAgICAgIC8vIHRoZWlyIGBpbmRleGAgYXJndW1lbnQgYXMgYSBjYWxsYmFja1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnZnVuY3Rpb24nICYmIHRoaXNBcmcgJiYgdGhpc0FyZ1tjYWxsYmFja10gPT09IGNvbGxlY3Rpb24pIHtcbiAgICAgICAgY2FsbGJhY2sgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKGNhbGxiYWNrID09IG51bGwgJiYgaXNBcnJheShjb2xsZWN0aW9uKSkge1xuICAgICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gY29sbGVjdGlvbltpbmRleF07XG4gICAgICAgICAgaWYgKHZhbHVlIDwgcmVzdWx0KSB7XG4gICAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrID0gKGNhbGxiYWNrID09IG51bGwgJiYgaXNTdHJpbmcoY29sbGVjdGlvbikpXG4gICAgICAgICAgPyBjaGFyQXRDYWxsYmFja1xuICAgICAgICAgIDogbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcblxuICAgICAgICBmb3JFYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICAgIHZhciBjdXJyZW50ID0gY2FsbGJhY2sodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgICBpZiAoY3VycmVudCA8IGNvbXB1dGVkKSB7XG4gICAgICAgICAgICBjb21wdXRlZCA9IGN1cnJlbnQ7XG4gICAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIHZhbHVlIG9mIGEgc3BlY2lmaWVkIHByb3BlcnR5IGZyb20gYWxsIGVsZW1lbnRzIGluIHRoZSBjb2xsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gcGx1Y2suXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIHByb3BlcnR5IHZhbHVlcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAnYWdlJzogNDAgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiBfLnBsdWNrKGNoYXJhY3RlcnMsICduYW1lJyk7XG4gICAgICogLy8gPT4gWydiYXJuZXknLCAnZnJlZCddXG4gICAgICovXG4gICAgdmFyIHBsdWNrID0gbWFwO1xuXG4gICAgLyoqXG4gICAgICogUmVkdWNlcyBhIGNvbGxlY3Rpb24gdG8gYSB2YWx1ZSB3aGljaCBpcyB0aGUgYWNjdW11bGF0ZWQgcmVzdWx0IG9mIHJ1bm5pbmdcbiAgICAgKiBlYWNoIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24gdGhyb3VnaCB0aGUgY2FsbGJhY2ssIHdoZXJlIGVhY2ggc3VjY2Vzc2l2ZVxuICAgICAqIGNhbGxiYWNrIGV4ZWN1dGlvbiBjb25zdW1lcyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBwcmV2aW91cyBleGVjdXRpb24uIElmXG4gICAgICogYGFjY3VtdWxhdG9yYCBpcyBub3QgcHJvdmlkZWQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIGNvbGxlY3Rpb24gd2lsbCBiZVxuICAgICAqIHVzZWQgYXMgdGhlIGluaXRpYWwgYGFjY3VtdWxhdG9yYCB2YWx1ZS4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYFxuICAgICAqIGFuZCBpbnZva2VkIHdpdGggZm91ciBhcmd1bWVudHM7IChhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgZm9sZGwsIGluamVjdFxuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHsqfSBbYWNjdW11bGF0b3JdIEluaXRpYWwgdmFsdWUgb2YgdGhlIGFjY3VtdWxhdG9yLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIHN1bSA9IF8ucmVkdWNlKFsxLCAyLCAzXSwgZnVuY3Rpb24oc3VtLCBudW0pIHtcbiAgICAgKiAgIHJldHVybiBzdW0gKyBudW07XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gNlxuICAgICAqXG4gICAgICogdmFyIG1hcHBlZCA9IF8ucmVkdWNlKHsgJ2EnOiAxLCAnYic6IDIsICdjJzogMyB9LCBmdW5jdGlvbihyZXN1bHQsIG51bSwga2V5KSB7XG4gICAgICogICByZXN1bHRba2V5XSA9IG51bSAqIDM7XG4gICAgICogICByZXR1cm4gcmVzdWx0O1xuICAgICAqIH0sIHt9KTtcbiAgICAgKiAvLyA9PiB7ICdhJzogMywgJ2InOiA2LCAnYyc6IDkgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlZHVjZShjb2xsZWN0aW9uLCBjYWxsYmFjaywgYWNjdW11bGF0b3IsIHRoaXNBcmcpIHtcbiAgICAgIGlmICghY29sbGVjdGlvbikgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgICAgdmFyIG5vYWNjdW0gPSBhcmd1bWVudHMubGVuZ3RoIDwgMztcbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCA0KTtcblxuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGg7XG5cbiAgICAgIGlmICh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInKSB7XG4gICAgICAgIGlmIChub2FjY3VtKSB7XG4gICAgICAgICAgYWNjdW11bGF0b3IgPSBjb2xsZWN0aW9uWysraW5kZXhdO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgYWNjdW11bGF0b3IgPSBjYWxsYmFjayhhY2N1bXVsYXRvciwgY29sbGVjdGlvbltpbmRleF0sIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yT3duKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICAgIGFjY3VtdWxhdG9yID0gbm9hY2N1bVxuICAgICAgICAgICAgPyAobm9hY2N1bSA9IGZhbHNlLCB2YWx1ZSlcbiAgICAgICAgICAgIDogY2FsbGJhY2soYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbilcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5yZWR1Y2VgIGV4Y2VwdCB0aGF0IGl0IGl0ZXJhdGVzIG92ZXIgZWxlbWVudHNcbiAgICAgKiBvZiBhIGBjb2xsZWN0aW9uYCBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgZm9sZHJcbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7Kn0gW2FjY3VtdWxhdG9yXSBJbml0aWFsIHZhbHVlIG9mIHRoZSBhY2N1bXVsYXRvci5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBsaXN0ID0gW1swLCAxXSwgWzIsIDNdLCBbNCwgNV1dO1xuICAgICAqIHZhciBmbGF0ID0gXy5yZWR1Y2VSaWdodChsaXN0LCBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhLmNvbmNhdChiKTsgfSwgW10pO1xuICAgICAqIC8vID0+IFs0LCA1LCAyLCAzLCAwLCAxXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KGNvbGxlY3Rpb24sIGNhbGxiYWNrLCBhY2N1bXVsYXRvciwgdGhpc0FyZykge1xuICAgICAgdmFyIG5vYWNjdW0gPSBhcmd1bWVudHMubGVuZ3RoIDwgMztcbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCA0KTtcbiAgICAgIGZvckVhY2hSaWdodChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgYWNjdW11bGF0b3IgPSBub2FjY3VtXG4gICAgICAgICAgPyAobm9hY2N1bSA9IGZhbHNlLCB2YWx1ZSlcbiAgICAgICAgICA6IGNhbGxiYWNrKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIG9wcG9zaXRlIG9mIGBfLmZpbHRlcmAgdGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZWxlbWVudHMgb2YgYVxuICAgICAqIGNvbGxlY3Rpb24gdGhhdCB0aGUgY2FsbGJhY2sgZG9lcyAqKm5vdCoqIHJldHVybiB0cnVleSBmb3IuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgZWxlbWVudHMgdGhhdCBmYWlsZWQgdGhlIGNhbGxiYWNrIGNoZWNrLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgb2RkcyA9IF8ucmVqZWN0KFsxLCAyLCAzLCA0LCA1LCA2XSwgZnVuY3Rpb24obnVtKSB7IHJldHVybiBudW0gJSAyID09IDA7IH0pO1xuICAgICAqIC8vID0+IFsxLCAzLCA1XVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2Jsb2NrZWQnOiBmYWxzZSB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAnYWdlJzogNDAsICdibG9ja2VkJzogdHJ1ZSB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ucmVqZWN0KGNoYXJhY3RlcnMsICdibG9ja2VkJyk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAnYmxvY2tlZCc6IGZhbHNlIH1dXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLnJlamVjdChjaGFyYWN0ZXJzLCB7ICdhZ2UnOiAzNiB9KTtcbiAgICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwLCAnYmxvY2tlZCc6IHRydWUgfV1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWplY3QoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgIHJldHVybiBmaWx0ZXIoY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiAhY2FsbGJhY2sodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyBhIHJhbmRvbSBlbGVtZW50IG9yIGBuYCByYW5kb20gZWxlbWVudHMgZnJvbSBhIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gc2FtcGxlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbl0gVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byBzYW1wbGUuXG4gICAgICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEFsbG93cyB3b3JraW5nIHdpdGggZnVuY3Rpb25zIGxpa2UgYF8ubWFwYFxuICAgICAqICB3aXRob3V0IHVzaW5nIHRoZWlyIGBpbmRleGAgYXJndW1lbnRzIGFzIGBuYC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHJhbmRvbSBzYW1wbGUocykgb2YgYGNvbGxlY3Rpb25gLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnNhbXBsZShbMSwgMiwgMywgNF0pO1xuICAgICAqIC8vID0+IDJcbiAgICAgKlxuICAgICAqIF8uc2FtcGxlKFsxLCAyLCAzLCA0XSwgMik7XG4gICAgICogLy8gPT4gWzMsIDFdXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2FtcGxlKGNvbGxlY3Rpb24sIG4sIGd1YXJkKSB7XG4gICAgICBpZiAoY29sbGVjdGlvbiAmJiB0eXBlb2YgY29sbGVjdGlvbi5sZW5ndGggIT0gJ251bWJlcicpIHtcbiAgICAgICAgY29sbGVjdGlvbiA9IHZhbHVlcyhjb2xsZWN0aW9uKTtcbiAgICAgIH1cbiAgICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHtcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uW2Jhc2VSYW5kb20oMCwgY29sbGVjdGlvbi5sZW5ndGggLSAxKV0gOiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICB2YXIgcmVzdWx0ID0gc2h1ZmZsZShjb2xsZWN0aW9uKTtcbiAgICAgIHJlc3VsdC5sZW5ndGggPSBuYXRpdmVNaW4obmF0aXZlTWF4KDAsIG4pLCByZXN1bHQubGVuZ3RoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBvZiBzaHVmZmxlZCB2YWx1ZXMsIHVzaW5nIGEgdmVyc2lvbiBvZiB0aGUgRmlzaGVyLVlhdGVzXG4gICAgICogc2h1ZmZsZS4gU2VlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRmlzaGVyLVlhdGVzX3NodWZmbGUuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gc2h1ZmZsZS5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgc2h1ZmZsZWQgY29sbGVjdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5zaHVmZmxlKFsxLCAyLCAzLCA0LCA1LCA2XSk7XG4gICAgICogLy8gPT4gWzQsIDEsIDYsIDMsIDUsIDJdXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2h1ZmZsZShjb2xsZWN0aW9uKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5sZW5ndGggOiAwLFxuICAgICAgICAgIHJlc3VsdCA9IEFycmF5KHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgPyBsZW5ndGggOiAwKTtcblxuICAgICAgZm9yRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICB2YXIgcmFuZCA9IGJhc2VSYW5kb20oMCwgKytpbmRleCk7XG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSByZXN1bHRbcmFuZF07XG4gICAgICAgIHJlc3VsdFtyYW5kXSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHNpemUgb2YgdGhlIGBjb2xsZWN0aW9uYCBieSByZXR1cm5pbmcgYGNvbGxlY3Rpb24ubGVuZ3RoYCBmb3IgYXJyYXlzXG4gICAgICogYW5kIGFycmF5LWxpa2Ugb2JqZWN0cyBvciB0aGUgbnVtYmVyIG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgZm9yIG9iamVjdHMuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIGBjb2xsZWN0aW9uLmxlbmd0aGAgb3IgbnVtYmVyIG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uc2l6ZShbMSwgMl0pO1xuICAgICAqIC8vID0+IDJcbiAgICAgKlxuICAgICAqIF8uc2l6ZSh7ICdvbmUnOiAxLCAndHdvJzogMiwgJ3RocmVlJzogMyB9KTtcbiAgICAgKiAvLyA9PiAzXG4gICAgICpcbiAgICAgKiBfLnNpemUoJ3BlYmJsZXMnKTtcbiAgICAgKiAvLyA9PiA3XG4gICAgICovXG4gICAgZnVuY3Rpb24gc2l6ZShjb2xsZWN0aW9uKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMDtcbiAgICAgIHJldHVybiB0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInID8gbGVuZ3RoIDoga2V5cyhjb2xsZWN0aW9uKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBjYWxsYmFjayByZXR1cm5zIGEgdHJ1ZXkgdmFsdWUgZm9yICoqYW55KiogZWxlbWVudCBvZiBhXG4gICAgICogY29sbGVjdGlvbi4gVGhlIGZ1bmN0aW9uIHJldHVybnMgYXMgc29vbiBhcyBpdCBmaW5kcyBhIHBhc3NpbmcgdmFsdWUgYW5kXG4gICAgICogZG9lcyBub3QgaXRlcmF0ZSBvdmVyIHRoZSBlbnRpcmUgY29sbGVjdGlvbi4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvXG4gICAgICogYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyBhbnlcbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFueSBlbGVtZW50IHBhc3NlZCB0aGUgY2FsbGJhY2sgY2hlY2ssXG4gICAgICogIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5zb21lKFtudWxsLCAwLCAneWVzJywgZmFsc2VdLCBCb29sZWFuKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAnYmxvY2tlZCc6IGZhbHNlIH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCwgJ2Jsb2NrZWQnOiB0cnVlIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5zb21lKGNoYXJhY3RlcnMsICdibG9ja2VkJyk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5zb21lKGNoYXJhY3RlcnMsIHsgJ2FnZSc6IDEgfSk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzb21lKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuXG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5sZW5ndGggOiAwO1xuXG4gICAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIGlmICgocmVzdWx0ID0gY2FsbGJhY2soY29sbGVjdGlvbltpbmRleF0sIGluZGV4LCBjb2xsZWN0aW9uKSkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yT3duKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICAgIHJldHVybiAhKHJlc3VsdCA9IGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAhIXJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGFycmF5IG9mIGVsZW1lbnRzLCBzb3J0ZWQgaW4gYXNjZW5kaW5nIG9yZGVyIGJ5IHRoZSByZXN1bHRzIG9mXG4gICAgICogcnVubmluZyBlYWNoIGVsZW1lbnQgaW4gYSBjb2xsZWN0aW9uIHRocm91Z2ggdGhlIGNhbGxiYWNrLiBUaGlzIG1ldGhvZFxuICAgICAqIHBlcmZvcm1zIGEgc3RhYmxlIHNvcnQsIHRoYXQgaXMsIGl0IHdpbGwgcHJlc2VydmUgdGhlIG9yaWdpbmFsIHNvcnQgb3JkZXJcbiAgICAgKiBvZiBlcXVhbCBlbGVtZW50cy4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoXG4gICAgICogdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY29sbGVjdGlvblxuICAgICAqIHdpbGwgYmUgc29ydGVkIGJ5IGVhY2ggcHJvcGVydHkgdmFsdWUuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtBcnJheXxGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2Ygc29ydGVkIGVsZW1lbnRzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnNvcnRCeShbMSwgMiwgM10sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gTWF0aC5zaW4obnVtKTsgfSk7XG4gICAgICogLy8gPT4gWzMsIDEsIDJdXG4gICAgICpcbiAgICAgKiBfLnNvcnRCeShbMSwgMiwgM10sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gdGhpcy5zaW4obnVtKTsgfSwgTWF0aCk7XG4gICAgICogLy8gPT4gWzMsIDEsIDJdXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgICdhZ2UnOiAzNiB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAgJ2FnZSc6IDQwIH0sXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICAnYWdlJzogMjYgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgICdhZ2UnOiAzMCB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ubWFwKF8uc29ydEJ5KGNoYXJhY3RlcnMsICdhZ2UnKSwgXy52YWx1ZXMpO1xuICAgICAqIC8vID0+IFtbJ2Jhcm5leScsIDI2XSwgWydmcmVkJywgMzBdLCBbJ2Jhcm5leScsIDM2XSwgWydmcmVkJywgNDBdXVxuICAgICAqXG4gICAgICogLy8gc29ydGluZyBieSBtdWx0aXBsZSBwcm9wZXJ0aWVzXG4gICAgICogXy5tYXAoXy5zb3J0QnkoY2hhcmFjdGVycywgWyduYW1lJywgJ2FnZSddKSwgXy52YWx1ZXMpO1xuICAgICAqIC8vID0gPiBbWydiYXJuZXknLCAyNl0sIFsnYmFybmV5JywgMzZdLCBbJ2ZyZWQnLCAzMF0sIFsnZnJlZCcsIDQwXV1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzb3J0QnkoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGlzQXJyID0gaXNBcnJheShjYWxsYmFjayksXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMCxcbiAgICAgICAgICByZXN1bHQgPSBBcnJheSh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInID8gbGVuZ3RoIDogMCk7XG5cbiAgICAgIGlmICghaXNBcnIpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgfVxuICAgICAgZm9yRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSByZXN1bHRbKytpbmRleF0gPSBnZXRPYmplY3QoKTtcbiAgICAgICAgaWYgKGlzQXJyKSB7XG4gICAgICAgICAgb2JqZWN0LmNyaXRlcmlhID0gbWFwKGNhbGxiYWNrLCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIChvYmplY3QuY3JpdGVyaWEgPSBnZXRBcnJheSgpKVswXSA9IGNhbGxiYWNrKHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIG9iamVjdC5pbmRleCA9IGluZGV4O1xuICAgICAgICBvYmplY3QudmFsdWUgPSB2YWx1ZTtcbiAgICAgIH0pO1xuXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuICAgICAgcmVzdWx0LnNvcnQoY29tcGFyZUFzY2VuZGluZyk7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IHJlc3VsdFtsZW5ndGhdO1xuICAgICAgICByZXN1bHRbbGVuZ3RoXSA9IG9iamVjdC52YWx1ZTtcbiAgICAgICAgaWYgKCFpc0Fycikge1xuICAgICAgICAgIHJlbGVhc2VBcnJheShvYmplY3QuY3JpdGVyaWEpO1xuICAgICAgICB9XG4gICAgICAgIHJlbGVhc2VPYmplY3Qob2JqZWN0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgdGhlIGBjb2xsZWN0aW9uYCB0byBhbiBhcnJheS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBjb252ZXJ0LlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGNvbnZlcnRlZCBhcnJheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogKGZ1bmN0aW9uKCkgeyByZXR1cm4gXy50b0FycmF5KGFyZ3VtZW50cykuc2xpY2UoMSk7IH0pKDEsIDIsIDMsIDQpO1xuICAgICAqIC8vID0+IFsyLCAzLCA0XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRvQXJyYXkoY29sbGVjdGlvbikge1xuICAgICAgaWYgKGNvbGxlY3Rpb24gJiYgdHlwZW9mIGNvbGxlY3Rpb24ubGVuZ3RoID09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiBzbGljZShjb2xsZWN0aW9uKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZXMoY29sbGVjdGlvbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgYSBkZWVwIGNvbXBhcmlzb24gb2YgZWFjaCBlbGVtZW50IGluIGEgYGNvbGxlY3Rpb25gIHRvIHRoZSBnaXZlblxuICAgICAqIGBwcm9wZXJ0aWVzYCBvYmplY3QsIHJldHVybmluZyBhbiBhcnJheSBvZiBhbGwgZWxlbWVudHMgdGhhdCBoYXZlIGVxdWl2YWxlbnRcbiAgICAgKiBwcm9wZXJ0eSB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb3BzIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIGZpbHRlciBieS5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBnaXZlbiBwcm9wZXJ0aWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAncGV0cyc6IFsnaG9wcHknXSB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAnYWdlJzogNDAsICdwZXRzJzogWydiYWJ5IHB1c3MnLCAnZGlubyddIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogXy53aGVyZShjaGFyYWN0ZXJzLCB7ICdhZ2UnOiAzNiB9KTtcbiAgICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYsICdwZXRzJzogWydob3BweSddIH1dXG4gICAgICpcbiAgICAgKiBfLndoZXJlKGNoYXJhY3RlcnMsIHsgJ3BldHMnOiBbJ2Rpbm8nXSB9KTtcbiAgICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwLCAncGV0cyc6IFsnYmFieSBwdXNzJywgJ2Rpbm8nXSB9XVxuICAgICAqL1xuICAgIHZhciB3aGVyZSA9IGZpbHRlcjtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSB3aXRoIGFsbCBmYWxzZXkgdmFsdWVzIHJlbW92ZWQuIFRoZSB2YWx1ZXMgYGZhbHNlYCwgYG51bGxgLFxuICAgICAqIGAwYCwgYFwiXCJgLCBgdW5kZWZpbmVkYCwgYW5kIGBOYU5gIGFyZSBhbGwgZmFsc2V5LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjb21wYWN0LlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiBmaWx0ZXJlZCB2YWx1ZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uY29tcGFjdChbMCwgMSwgZmFsc2UsIDIsICcnLCAzXSk7XG4gICAgICogLy8gPT4gWzEsIDIsIDNdXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29tcGFjdChhcnJheSkge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGFycmF5IGV4Y2x1ZGluZyBhbGwgdmFsdWVzIG9mIHRoZSBwcm92aWRlZCBhcnJheXMgdXNpbmcgc3RyaWN0XG4gICAgICogZXF1YWxpdHkgZm9yIGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBwcm9jZXNzLlxuICAgICAqIEBwYXJhbSB7Li4uQXJyYXl9IFt2YWx1ZXNdIFRoZSBhcnJheXMgb2YgdmFsdWVzIHRvIGV4Y2x1ZGUuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIGZpbHRlcmVkIHZhbHVlcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5kaWZmZXJlbmNlKFsxLCAyLCAzLCA0LCA1XSwgWzUsIDIsIDEwXSk7XG4gICAgICogLy8gPT4gWzEsIDMsIDRdXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGlmZmVyZW5jZShhcnJheSkge1xuICAgICAgcmV0dXJuIGJhc2VEaWZmZXJlbmNlKGFycmF5LCBiYXNlRmxhdHRlbihhcmd1bWVudHMsIHRydWUsIHRydWUsIDEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmZpbmRgIGV4Y2VwdCB0aGF0IGl0IHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBmaXJzdFxuICAgICAqIGVsZW1lbnQgdGhhdCBwYXNzZXMgdGhlIGNhbGxiYWNrIGNoZWNrLCBpbnN0ZWFkIG9mIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzZWFyY2guXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZm91bmQgZWxlbWVudCwgZWxzZSBgLTFgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgICdhZ2UnOiAzNiwgJ2Jsb2NrZWQnOiBmYWxzZSB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAgJ2FnZSc6IDQwLCAnYmxvY2tlZCc6IHRydWUgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAncGViYmxlcycsICdhZ2UnOiAxLCAgJ2Jsb2NrZWQnOiBmYWxzZSB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIF8uZmluZEluZGV4KGNoYXJhY3RlcnMsIGZ1bmN0aW9uKGNocikge1xuICAgICAqICAgcmV0dXJuIGNoci5hZ2UgPCAyMDtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmZpbmRJbmRleChjaGFyYWN0ZXJzLCB7ICdhZ2UnOiAzNiB9KTtcbiAgICAgKiAvLyA9PiAwXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmZpbmRJbmRleChjaGFyYWN0ZXJzLCAnYmxvY2tlZCcpO1xuICAgICAqIC8vID0+IDFcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaW5kSW5kZXgoYXJyYXksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG5cbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIGlmIChjYWxsYmFjayhhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmZpbmRJbmRleGAgZXhjZXB0IHRoYXQgaXQgaXRlcmF0ZXMgb3ZlciBlbGVtZW50c1xuICAgICAqIG9mIGEgYGNvbGxlY3Rpb25gIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzZWFyY2guXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZm91bmQgZWxlbWVudCwgZWxzZSBgLTFgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgICdhZ2UnOiAzNiwgJ2Jsb2NrZWQnOiB0cnVlIH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICAnYWdlJzogNDAsICdibG9ja2VkJzogZmFsc2UgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAncGViYmxlcycsICdhZ2UnOiAxLCAgJ2Jsb2NrZWQnOiB0cnVlIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogXy5maW5kTGFzdEluZGV4KGNoYXJhY3RlcnMsIGZ1bmN0aW9uKGNocikge1xuICAgICAqICAgcmV0dXJuIGNoci5hZ2UgPiAzMDtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiAxXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmZpbmRMYXN0SW5kZXgoY2hhcmFjdGVycywgeyAnYWdlJzogMzYgfSk7XG4gICAgICogLy8gPT4gMFxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maW5kTGFzdEluZGV4KGNoYXJhY3RlcnMsICdibG9ja2VkJyk7XG4gICAgICogLy8gPT4gMlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbmRMYXN0SW5kZXgoYXJyYXksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmIChjYWxsYmFjayhhcnJheVtsZW5ndGhdLCBsZW5ndGgsIGFycmF5KSkge1xuICAgICAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBmaXJzdCBlbGVtZW50IG9yIGZpcnN0IGBuYCBlbGVtZW50cyBvZiBhbiBhcnJheS4gSWYgYSBjYWxsYmFja1xuICAgICAqIGlzIHByb3ZpZGVkIGVsZW1lbnRzIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGFycmF5IGFyZSByZXR1cm5lZCBhcyBsb25nXG4gICAgICogYXMgdGhlIGNhbGxiYWNrIHJldHVybnMgdHJ1ZXkuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kXG4gICAgICogaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleCwgYXJyYXkpLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgaGVhZCwgdGFrZVxuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8bnVtYmVyfHN0cmluZ30gW2NhbGxiYWNrXSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBlbGVtZW50IG9yIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gcmV0dXJuLiBJZiBhIHByb3BlcnR5IG5hbWUgb3JcbiAgICAgKiAgb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZCB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIlxuICAgICAqICBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50KHMpIG9mIGBhcnJheWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uZmlyc3QoWzEsIDIsIDNdKTtcbiAgICAgKiAvLyA9PiAxXG4gICAgICpcbiAgICAgKiBfLmZpcnN0KFsxLCAyLCAzXSwgMik7XG4gICAgICogLy8gPT4gWzEsIDJdXG4gICAgICpcbiAgICAgKiBfLmZpcnN0KFsxLCAyLCAzXSwgZnVuY3Rpb24obnVtKSB7XG4gICAgICogICByZXR1cm4gbnVtIDwgMztcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiBbMSwgMl1cbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAgJ2Jsb2NrZWQnOiB0cnVlLCAgJ2VtcGxveWVyJzogJ3NsYXRlJyB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAgJ2Jsb2NrZWQnOiBmYWxzZSwgJ2VtcGxveWVyJzogJ3NsYXRlJyB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdwZWJibGVzJywgJ2Jsb2NrZWQnOiB0cnVlLCAgJ2VtcGxveWVyJzogJ25hJyB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uZmlyc3QoY2hhcmFjdGVycywgJ2Jsb2NrZWQnKTtcbiAgICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdiYXJuZXknLCAnYmxvY2tlZCc6IHRydWUsICdlbXBsb3llcic6ICdzbGF0ZScgfV1cbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ucGx1Y2soXy5maXJzdChjaGFyYWN0ZXJzLCB7ICdlbXBsb3llcic6ICdzbGF0ZScgfSksICduYW1lJyk7XG4gICAgICogLy8gPT4gWydiYXJuZXknLCAnZnJlZCddXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmlyc3QoYXJyYXksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgbiA9IDAsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9ICdudW1iZXInICYmIGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XG4gICAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGggJiYgY2FsbGJhY2soYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICAgICAgbisrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuID0gY2FsbGJhY2s7XG4gICAgICAgIGlmIChuID09IG51bGwgfHwgdGhpc0FyZykge1xuICAgICAgICAgIHJldHVybiBhcnJheSA/IGFycmF5WzBdIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc2xpY2UoYXJyYXksIDAsIG5hdGl2ZU1pbihuYXRpdmVNYXgoMCwgbiksIGxlbmd0aCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZsYXR0ZW5zIGEgbmVzdGVkIGFycmF5ICh0aGUgbmVzdGluZyBjYW4gYmUgdG8gYW55IGRlcHRoKS4gSWYgYGlzU2hhbGxvd2BcbiAgICAgKiBpcyB0cnVleSwgdGhlIGFycmF5IHdpbGwgb25seSBiZSBmbGF0dGVuZWQgYSBzaW5nbGUgbGV2ZWwuIElmIGEgY2FsbGJhY2tcbiAgICAgKiBpcyBwcm92aWRlZCBlYWNoIGVsZW1lbnQgb2YgdGhlIGFycmF5IGlzIHBhc3NlZCB0aHJvdWdoIHRoZSBjYWxsYmFjayBiZWZvcmVcbiAgICAgKiBmbGF0dGVuaW5nLiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWVcbiAgICAgKiBhcmd1bWVudHM7ICh2YWx1ZSwgaW5kZXgsIGFycmF5KS5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmbGF0dGVuLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU2hhbGxvdz1mYWxzZV0gQSBmbGFnIHRvIHJlc3RyaWN0IGZsYXR0ZW5pbmcgdG8gYSBzaW5nbGUgbGV2ZWwuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgZmxhdHRlbmVkIGFycmF5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmZsYXR0ZW4oWzEsIFsyXSwgWzMsIFtbNF1dXV0pO1xuICAgICAqIC8vID0+IFsxLCAyLCAzLCA0XTtcbiAgICAgKlxuICAgICAqIF8uZmxhdHRlbihbMSwgWzJdLCBbMywgW1s0XV1dXSwgdHJ1ZSk7XG4gICAgICogLy8gPT4gWzEsIDIsIDMsIFtbNF1dXTtcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzAsICdwZXRzJzogWydob3BweSddIH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCwgJ3BldHMnOiBbJ2JhYnkgcHVzcycsICdkaW5vJ10gfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmZsYXR0ZW4oY2hhcmFjdGVycywgJ3BldHMnKTtcbiAgICAgKiAvLyA9PiBbJ2hvcHB5JywgJ2JhYnkgcHVzcycsICdkaW5vJ11cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmbGF0dGVuKGFycmF5LCBpc1NoYWxsb3csIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICAvLyBqdWdnbGUgYXJndW1lbnRzXG4gICAgICBpZiAodHlwZW9mIGlzU2hhbGxvdyAhPSAnYm9vbGVhbicgJiYgaXNTaGFsbG93ICE9IG51bGwpIHtcbiAgICAgICAgdGhpc0FyZyA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayA9ICh0eXBlb2YgaXNTaGFsbG93ICE9ICdmdW5jdGlvbicgJiYgdGhpc0FyZyAmJiB0aGlzQXJnW2lzU2hhbGxvd10gPT09IGFycmF5KSA/IG51bGwgOiBpc1NoYWxsb3c7XG4gICAgICAgIGlzU2hhbGxvdyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgYXJyYXkgPSBtYXAoYXJyYXksIGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBiYXNlRmxhdHRlbihhcnJheSwgaXNTaGFsbG93KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBgdmFsdWVgIGlzIGZvdW5kIHVzaW5nXG4gICAgICogc3RyaWN0IGVxdWFsaXR5IGZvciBjb21wYXJpc29ucywgaS5lLiBgPT09YC4gSWYgdGhlIGFycmF5IGlzIGFscmVhZHkgc29ydGVkXG4gICAgICogcHJvdmlkaW5nIGB0cnVlYCBmb3IgYGZyb21JbmRleGAgd2lsbCBydW4gYSBmYXN0ZXIgYmluYXJ5IHNlYXJjaC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gICAgICogQHBhcmFtIHtib29sZWFufG51bWJlcn0gW2Zyb21JbmRleD0wXSBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20gb3IgYHRydWVgXG4gICAgICogIHRvIHBlcmZvcm0gYSBiaW5hcnkgc2VhcmNoIG9uIGEgc29ydGVkIGFycmF5LlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlIG9yIGAtMWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaW5kZXhPZihbMSwgMiwgMywgMSwgMiwgM10sIDIpO1xuICAgICAqIC8vID0+IDFcbiAgICAgKlxuICAgICAqIF8uaW5kZXhPZihbMSwgMiwgMywgMSwgMiwgM10sIDIsIDMpO1xuICAgICAqIC8vID0+IDRcbiAgICAgKlxuICAgICAqIF8uaW5kZXhPZihbMSwgMSwgMiwgMiwgMywgM10sIDIsIHRydWUpO1xuICAgICAqIC8vID0+IDJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gICAgICBpZiAodHlwZW9mIGZyb21JbmRleCA9PSAnbnVtYmVyJykge1xuICAgICAgICB2YXIgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICAgICAgICBmcm9tSW5kZXggPSAoZnJvbUluZGV4IDwgMCA/IG5hdGl2ZU1heCgwLCBsZW5ndGggKyBmcm9tSW5kZXgpIDogZnJvbUluZGV4IHx8IDApO1xuICAgICAgfSBlbHNlIGlmIChmcm9tSW5kZXgpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gc29ydGVkSW5kZXgoYXJyYXksIHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGFycmF5W2luZGV4XSA9PT0gdmFsdWUgPyBpbmRleCA6IC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFsbCBidXQgdGhlIGxhc3QgZWxlbWVudCBvciBsYXN0IGBuYCBlbGVtZW50cyBvZiBhbiBhcnJheS4gSWYgYVxuICAgICAqIGNhbGxiYWNrIGlzIHByb3ZpZGVkIGVsZW1lbnRzIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5IGFyZSBleGNsdWRlZCBmcm9tXG4gICAgICogdGhlIHJlc3VsdCBhcyBsb25nIGFzIHRoZSBjYWxsYmFjayByZXR1cm5zIHRydWV5LiBUaGUgY2FsbGJhY2sgaXMgYm91bmRcbiAgICAgKiB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7ICh2YWx1ZSwgaW5kZXgsIGFycmF5KS5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxudW1iZXJ8c3RyaW5nfSBbY2FsbGJhY2s9MV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgZWxlbWVudCBvciB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIGV4Y2x1ZGUuIElmIGEgcHJvcGVydHkgbmFtZSBvclxuICAgICAqICBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiXG4gICAgICogIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgc2xpY2Ugb2YgYGFycmF5YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5pbml0aWFsKFsxLCAyLCAzXSk7XG4gICAgICogLy8gPT4gWzEsIDJdXG4gICAgICpcbiAgICAgKiBfLmluaXRpYWwoWzEsIDIsIDNdLCAyKTtcbiAgICAgKiAvLyA9PiBbMV1cbiAgICAgKlxuICAgICAqIF8uaW5pdGlhbChbMSwgMiwgM10sIGZ1bmN0aW9uKG51bSkge1xuICAgICAqICAgcmV0dXJuIG51bSA+IDE7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gWzFdXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgICdibG9ja2VkJzogZmFsc2UsICdlbXBsb3llcic6ICdzbGF0ZScgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgICdibG9ja2VkJzogdHJ1ZSwgICdlbXBsb3llcic6ICdzbGF0ZScgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAncGViYmxlcycsICdibG9ja2VkJzogdHJ1ZSwgICdlbXBsb3llcic6ICduYScgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmluaXRpYWwoY2hhcmFjdGVycywgJ2Jsb2NrZWQnKTtcbiAgICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdiYXJuZXknLCAgJ2Jsb2NrZWQnOiBmYWxzZSwgJ2VtcGxveWVyJzogJ3NsYXRlJyB9XVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5wbHVjayhfLmluaXRpYWwoY2hhcmFjdGVycywgeyAnZW1wbG95ZXInOiAnbmEnIH0pLCAnbmFtZScpO1xuICAgICAqIC8vID0+IFsnYmFybmV5JywgJ2ZyZWQnXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXRpYWwoYXJyYXksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgbiA9IDAsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9ICdudW1iZXInICYmIGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gbGVuZ3RoO1xuICAgICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICAgIHdoaWxlIChpbmRleC0tICYmIGNhbGxiYWNrKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgICAgIG4rKztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbiA9IChjYWxsYmFjayA9PSBudWxsIHx8IHRoaXNBcmcpID8gMSA6IGNhbGxiYWNrIHx8IG47XG4gICAgICB9XG4gICAgICByZXR1cm4gc2xpY2UoYXJyYXksIDAsIG5hdGl2ZU1pbihuYXRpdmVNYXgoMCwgbGVuZ3RoIC0gbiksIGxlbmd0aCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdW5pcXVlIHZhbHVlcyBwcmVzZW50IGluIGFsbCBwcm92aWRlZCBhcnJheXMgdXNpbmdcbiAgICAgKiBzdHJpY3QgZXF1YWxpdHkgZm9yIGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7Li4uQXJyYXl9IFthcnJheV0gVGhlIGFycmF5cyB0byBpbnNwZWN0LlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiBzaGFyZWQgdmFsdWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmludGVyc2VjdGlvbihbMSwgMiwgM10sIFs1LCAyLCAxLCA0XSwgWzIsIDFdKTtcbiAgICAgKiAvLyA9PiBbMSwgMl1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnRlcnNlY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IFtdLFxuICAgICAgICAgIGFyZ3NJbmRleCA9IC0xLFxuICAgICAgICAgIGFyZ3NMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICAgIGNhY2hlcyA9IGdldEFycmF5KCksXG4gICAgICAgICAgaW5kZXhPZiA9IGdldEluZGV4T2YoKSxcbiAgICAgICAgICB0cnVzdEluZGV4T2YgPSBpbmRleE9mID09PSBiYXNlSW5kZXhPZixcbiAgICAgICAgICBzZWVuID0gZ2V0QXJyYXkoKTtcblxuICAgICAgd2hpbGUgKCsrYXJnc0luZGV4IDwgYXJnc0xlbmd0aCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBhcmd1bWVudHNbYXJnc0luZGV4XTtcbiAgICAgICAgaWYgKGlzQXJyYXkodmFsdWUpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSkge1xuICAgICAgICAgIGFyZ3MucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgY2FjaGVzLnB1c2godHJ1c3RJbmRleE9mICYmIHZhbHVlLmxlbmd0aCA+PSBsYXJnZUFycmF5U2l6ZSAmJlxuICAgICAgICAgICAgY3JlYXRlQ2FjaGUoYXJnc0luZGV4ID8gYXJnc1thcmdzSW5kZXhdIDogc2VlbikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgYXJyYXkgPSBhcmdzWzBdLFxuICAgICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgICBvdXRlcjpcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHZhciBjYWNoZSA9IGNhY2hlc1swXTtcbiAgICAgICAgdmFsdWUgPSBhcnJheVtpbmRleF07XG5cbiAgICAgICAgaWYgKChjYWNoZSA/IGNhY2hlSW5kZXhPZihjYWNoZSwgdmFsdWUpIDogaW5kZXhPZihzZWVuLCB2YWx1ZSkpIDwgMCkge1xuICAgICAgICAgIGFyZ3NJbmRleCA9IGFyZ3NMZW5ndGg7XG4gICAgICAgICAgKGNhY2hlIHx8IHNlZW4pLnB1c2godmFsdWUpO1xuICAgICAgICAgIHdoaWxlICgtLWFyZ3NJbmRleCkge1xuICAgICAgICAgICAgY2FjaGUgPSBjYWNoZXNbYXJnc0luZGV4XTtcbiAgICAgICAgICAgIGlmICgoY2FjaGUgPyBjYWNoZUluZGV4T2YoY2FjaGUsIHZhbHVlKSA6IGluZGV4T2YoYXJnc1thcmdzSW5kZXhdLCB2YWx1ZSkpIDwgMCkge1xuICAgICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3aGlsZSAoYXJnc0xlbmd0aC0tKSB7XG4gICAgICAgIGNhY2hlID0gY2FjaGVzW2FyZ3NMZW5ndGhdO1xuICAgICAgICBpZiAoY2FjaGUpIHtcbiAgICAgICAgICByZWxlYXNlT2JqZWN0KGNhY2hlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVsZWFzZUFycmF5KGNhY2hlcyk7XG4gICAgICByZWxlYXNlQXJyYXkoc2Vlbik7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGxhc3QgZWxlbWVudCBvciBsYXN0IGBuYCBlbGVtZW50cyBvZiBhbiBhcnJheS4gSWYgYSBjYWxsYmFjayBpc1xuICAgICAqIHByb3ZpZGVkIGVsZW1lbnRzIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5IGFyZSByZXR1cm5lZCBhcyBsb25nIGFzIHRoZVxuICAgICAqIGNhbGxiYWNrIHJldHVybnMgdHJ1ZXkuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWRcbiAgICAgKiB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleCwgYXJyYXkpLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fG51bWJlcnxzdHJpbmd9IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgZWxlbWVudCBvciB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHJldHVybi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yXG4gICAgICogIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWQgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCJcbiAgICAgKiAgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbGFzdCBlbGVtZW50KHMpIG9mIGBhcnJheWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ubGFzdChbMSwgMiwgM10pO1xuICAgICAqIC8vID0+IDNcbiAgICAgKlxuICAgICAqIF8ubGFzdChbMSwgMiwgM10sIDIpO1xuICAgICAqIC8vID0+IFsyLCAzXVxuICAgICAqXG4gICAgICogXy5sYXN0KFsxLCAyLCAzXSwgZnVuY3Rpb24obnVtKSB7XG4gICAgICogICByZXR1cm4gbnVtID4gMTtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiBbMiwgM11cbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAgJ2Jsb2NrZWQnOiBmYWxzZSwgJ2VtcGxveWVyJzogJ3NsYXRlJyB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAgJ2Jsb2NrZWQnOiB0cnVlLCAgJ2VtcGxveWVyJzogJ3NsYXRlJyB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdwZWJibGVzJywgJ2Jsb2NrZWQnOiB0cnVlLCAgJ2VtcGxveWVyJzogJ25hJyB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ucGx1Y2soXy5sYXN0KGNoYXJhY3RlcnMsICdibG9ja2VkJyksICduYW1lJyk7XG4gICAgICogLy8gPT4gWydmcmVkJywgJ3BlYmJsZXMnXVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5sYXN0KGNoYXJhY3RlcnMsIHsgJ2VtcGxveWVyJzogJ25hJyB9KTtcbiAgICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdwZWJibGVzJywgJ2Jsb2NrZWQnOiB0cnVlLCAnZW1wbG95ZXInOiAnbmEnIH1dXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGFzdChhcnJheSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciBuID0gMCxcbiAgICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG5cbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ251bWJlcicgJiYgY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICB2YXIgaW5kZXggPSBsZW5ndGg7XG4gICAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgICAgd2hpbGUgKGluZGV4LS0gJiYgY2FsbGJhY2soYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICAgICAgbisrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuID0gY2FsbGJhY2s7XG4gICAgICAgIGlmIChuID09IG51bGwgfHwgdGhpc0FyZykge1xuICAgICAgICAgIHJldHVybiBhcnJheSA/IGFycmF5W2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc2xpY2UoYXJyYXksIG5hdGl2ZU1heCgwLCBsZW5ndGggLSBuKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGxhc3Qgb2NjdXJyZW5jZSBvZiBgdmFsdWVgIGlzIGZvdW5kIHVzaW5nIHN0cmljdFxuICAgICAqIGVxdWFsaXR5IGZvciBjb21wYXJpc29ucywgaS5lLiBgPT09YC4gSWYgYGZyb21JbmRleGAgaXMgbmVnYXRpdmUsIGl0IGlzIHVzZWRcbiAgICAgKiBhcyB0aGUgb2Zmc2V0IGZyb20gdGhlIGVuZCBvZiB0aGUgY29sbGVjdGlvbi5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzZWFyY2guXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2Zyb21JbmRleD1hcnJheS5sZW5ndGgtMV0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlIG9yIGAtMWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ubGFzdEluZGV4T2YoWzEsIDIsIDMsIDEsIDIsIDNdLCAyKTtcbiAgICAgKiAvLyA9PiA0XG4gICAgICpcbiAgICAgKiBfLmxhc3RJbmRleE9mKFsxLCAyLCAzLCAxLCAyLCAzXSwgMiwgMyk7XG4gICAgICogLy8gPT4gMVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxhc3RJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gICAgICB2YXIgaW5kZXggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gICAgICBpZiAodHlwZW9mIGZyb21JbmRleCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpbmRleCA9IChmcm9tSW5kZXggPCAwID8gbmF0aXZlTWF4KDAsIGluZGV4ICsgZnJvbUluZGV4KSA6IG5hdGl2ZU1pbihmcm9tSW5kZXgsIGluZGV4IC0gMSkpICsgMTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChpbmRleC0tKSB7XG4gICAgICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgcHJvdmlkZWQgdmFsdWVzIGZyb20gdGhlIGdpdmVuIGFycmF5IHVzaW5nIHN0cmljdCBlcXVhbGl0eSBmb3JcbiAgICAgKiBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW3ZhbHVlXSBUaGUgdmFsdWVzIHRvIHJlbW92ZS5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGFycmF5ID0gWzEsIDIsIDMsIDEsIDIsIDNdO1xuICAgICAqIF8ucHVsbChhcnJheSwgMiwgMyk7XG4gICAgICogY29uc29sZS5sb2coYXJyYXkpO1xuICAgICAqIC8vID0+IFsxLCAxXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHB1bGwoYXJyYXkpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICAgIGFyZ3NJbmRleCA9IDAsXG4gICAgICAgICAgYXJnc0xlbmd0aCA9IGFyZ3MubGVuZ3RoLFxuICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcblxuICAgICAgd2hpbGUgKCsrYXJnc0luZGV4IDwgYXJnc0xlbmd0aCkge1xuICAgICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICAgIHZhbHVlID0gYXJnc1thcmdzSW5kZXhdO1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICBzcGxpY2UuY2FsbChhcnJheSwgaW5kZXgtLSwgMSk7XG4gICAgICAgICAgICBsZW5ndGgtLTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGFycmF5IG9mIG51bWJlcnMgKHBvc2l0aXZlIGFuZC9vciBuZWdhdGl2ZSkgcHJvZ3Jlc3NpbmcgZnJvbVxuICAgICAqIGBzdGFydGAgdXAgdG8gYnV0IG5vdCBpbmNsdWRpbmcgYGVuZGAuIElmIGBzdGFydGAgaXMgbGVzcyB0aGFuIGBzdG9wYCBhXG4gICAgICogemVyby1sZW5ndGggcmFuZ2UgaXMgY3JlYXRlZCB1bmxlc3MgYSBuZWdhdGl2ZSBgc3RlcGAgaXMgc3BlY2lmaWVkLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IG9mIHRoZSByYW5nZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZW5kIFRoZSBlbmQgb2YgdGhlIHJhbmdlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbc3RlcD0xXSBUaGUgdmFsdWUgdG8gaW5jcmVtZW50IG9yIGRlY3JlbWVudCBieS5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgcmFuZ2UgYXJyYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ucmFuZ2UoNCk7XG4gICAgICogLy8gPT4gWzAsIDEsIDIsIDNdXG4gICAgICpcbiAgICAgKiBfLnJhbmdlKDEsIDUpO1xuICAgICAqIC8vID0+IFsxLCAyLCAzLCA0XVxuICAgICAqXG4gICAgICogXy5yYW5nZSgwLCAyMCwgNSk7XG4gICAgICogLy8gPT4gWzAsIDUsIDEwLCAxNV1cbiAgICAgKlxuICAgICAqIF8ucmFuZ2UoMCwgLTQsIC0xKTtcbiAgICAgKiAvLyA9PiBbMCwgLTEsIC0yLCAtM11cbiAgICAgKlxuICAgICAqIF8ucmFuZ2UoMSwgNCwgMCk7XG4gICAgICogLy8gPT4gWzEsIDEsIDFdXG4gICAgICpcbiAgICAgKiBfLnJhbmdlKDApO1xuICAgICAqIC8vID0+IFtdXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIGVuZCwgc3RlcCkge1xuICAgICAgc3RhcnQgPSArc3RhcnQgfHwgMDtcbiAgICAgIHN0ZXAgPSB0eXBlb2Ygc3RlcCA9PSAnbnVtYmVyJyA/IHN0ZXAgOiAoK3N0ZXAgfHwgMSk7XG5cbiAgICAgIGlmIChlbmQgPT0gbnVsbCkge1xuICAgICAgICBlbmQgPSBzdGFydDtcbiAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgfVxuICAgICAgLy8gdXNlIGBBcnJheShsZW5ndGgpYCBzbyBlbmdpbmVzIGxpa2UgQ2hha3JhIGFuZCBWOCBhdm9pZCBzbG93ZXIgbW9kZXNcbiAgICAgIC8vIGh0dHA6Ly95b3V0dS5iZS9YQXFJcEdVOFpaayN0PTE3bTI1c1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KDAsIGNlaWwoKGVuZCAtIHN0YXJ0KSAvIChzdGVwIHx8IDEpKSksXG4gICAgICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IHN0YXJ0O1xuICAgICAgICBzdGFydCArPSBzdGVwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFsbCBlbGVtZW50cyBmcm9tIGFuIGFycmF5IHRoYXQgdGhlIGNhbGxiYWNrIHJldHVybnMgdHJ1ZXkgZm9yXG4gICAgICogYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgcmVtb3ZlZCBlbGVtZW50cy4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYFxuICAgICAqIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4LCBhcnJheSkuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIHJlbW92ZWQgZWxlbWVudHMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBhcnJheSA9IFsxLCAyLCAzLCA0LCA1LCA2XTtcbiAgICAgKiB2YXIgZXZlbnMgPSBfLnJlbW92ZShhcnJheSwgZnVuY3Rpb24obnVtKSB7IHJldHVybiBudW0gJSAyID09IDA7IH0pO1xuICAgICAqXG4gICAgICogY29uc29sZS5sb2coYXJyYXkpO1xuICAgICAqIC8vID0+IFsxLCAzLCA1XVxuICAgICAqXG4gICAgICogY29uc29sZS5sb2coZXZlbnMpO1xuICAgICAqIC8vID0+IFsyLCA0LCA2XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlbW92ZShhcnJheSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMCxcbiAgICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWUsIGluZGV4LCBhcnJheSkpIHtcbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgc3BsaWNlLmNhbGwoYXJyYXksIGluZGV4LS0sIDEpO1xuICAgICAgICAgIGxlbmd0aC0tO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBvcHBvc2l0ZSBvZiBgXy5pbml0aWFsYCB0aGlzIG1ldGhvZCBnZXRzIGFsbCBidXQgdGhlIGZpcnN0IGVsZW1lbnQgb3JcbiAgICAgKiBmaXJzdCBgbmAgZWxlbWVudHMgb2YgYW4gYXJyYXkuIElmIGEgY2FsbGJhY2sgZnVuY3Rpb24gaXMgcHJvdmlkZWQgZWxlbWVudHNcbiAgICAgKiBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheSBhcmUgZXhjbHVkZWQgZnJvbSB0aGUgcmVzdWx0IGFzIGxvbmcgYXMgdGhlXG4gICAgICogY2FsbGJhY2sgcmV0dXJucyB0cnVleS4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZFxuICAgICAqIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4LCBhcnJheSkuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyBkcm9wLCB0YWlsXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxudW1iZXJ8c3RyaW5nfSBbY2FsbGJhY2s9MV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgZWxlbWVudCBvciB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIGV4Y2x1ZGUuIElmIGEgcHJvcGVydHkgbmFtZSBvclxuICAgICAqICBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiXG4gICAgICogIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgc2xpY2Ugb2YgYGFycmF5YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5yZXN0KFsxLCAyLCAzXSk7XG4gICAgICogLy8gPT4gWzIsIDNdXG4gICAgICpcbiAgICAgKiBfLnJlc3QoWzEsIDIsIDNdLCAyKTtcbiAgICAgKiAvLyA9PiBbM11cbiAgICAgKlxuICAgICAqIF8ucmVzdChbMSwgMiwgM10sIGZ1bmN0aW9uKG51bSkge1xuICAgICAqICAgcmV0dXJuIG51bSA8IDM7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gWzNdXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgICdibG9ja2VkJzogdHJ1ZSwgICdlbXBsb3llcic6ICdzbGF0ZScgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgICdibG9ja2VkJzogZmFsc2UsICAnZW1wbG95ZXInOiAnc2xhdGUnIH0sXG4gICAgICogICB7ICduYW1lJzogJ3BlYmJsZXMnLCAnYmxvY2tlZCc6IHRydWUsICdlbXBsb3llcic6ICduYScgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLnBsdWNrKF8ucmVzdChjaGFyYWN0ZXJzLCAnYmxvY2tlZCcpLCAnbmFtZScpO1xuICAgICAqIC8vID0+IFsnZnJlZCcsICdwZWJibGVzJ11cbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ucmVzdChjaGFyYWN0ZXJzLCB7ICdlbXBsb3llcic6ICdzbGF0ZScgfSk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAncGViYmxlcycsICdibG9ja2VkJzogdHJ1ZSwgJ2VtcGxveWVyJzogJ25hJyB9XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc3QoYXJyYXksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9ICdudW1iZXInICYmIGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgdmFyIG4gPSAwLFxuICAgICAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcblxuICAgICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoICYmIGNhbGxiYWNrKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgICAgIG4rKztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbiA9IChjYWxsYmFjayA9PSBudWxsIHx8IHRoaXNBcmcpID8gMSA6IG5hdGl2ZU1heCgwLCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2xpY2UoYXJyYXksIG4pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVzZXMgYSBiaW5hcnkgc2VhcmNoIHRvIGRldGVybWluZSB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2ggYSB2YWx1ZVxuICAgICAqIHNob3VsZCBiZSBpbnNlcnRlZCBpbnRvIGEgZ2l2ZW4gc29ydGVkIGFycmF5IGluIG9yZGVyIHRvIG1haW50YWluIHRoZSBzb3J0XG4gICAgICogb3JkZXIgb2YgdGhlIGFycmF5LiBJZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgZXhlY3V0ZWQgZm9yXG4gICAgICogYHZhbHVlYCBhbmQgZWFjaCBlbGVtZW50IG9mIGBhcnJheWAgdG8gY29tcHV0ZSB0aGVpciBzb3J0IHJhbmtpbmcuIFRoZVxuICAgICAqIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDsgKHZhbHVlKS5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGV2YWx1YXRlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggYXQgd2hpY2ggYHZhbHVlYCBzaG91bGQgYmUgaW5zZXJ0ZWRcbiAgICAgKiAgaW50byBgYXJyYXlgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnNvcnRlZEluZGV4KFsyMCwgMzAsIDUwXSwgNDApO1xuICAgICAqIC8vID0+IDJcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uc29ydGVkSW5kZXgoW3sgJ3gnOiAyMCB9LCB7ICd4JzogMzAgfSwgeyAneCc6IDUwIH1dLCB7ICd4JzogNDAgfSwgJ3gnKTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICpcbiAgICAgKiB2YXIgZGljdCA9IHtcbiAgICAgKiAgICd3b3JkVG9OdW1iZXInOiB7ICd0d2VudHknOiAyMCwgJ3RoaXJ0eSc6IDMwLCAnZm91cnR5JzogNDAsICdmaWZ0eSc6IDUwIH1cbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy5zb3J0ZWRJbmRleChbJ3R3ZW50eScsICd0aGlydHknLCAnZmlmdHknXSwgJ2ZvdXJ0eScsIGZ1bmN0aW9uKHdvcmQpIHtcbiAgICAgKiAgIHJldHVybiBkaWN0LndvcmRUb051bWJlclt3b3JkXTtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICpcbiAgICAgKiBfLnNvcnRlZEluZGV4KFsndHdlbnR5JywgJ3RoaXJ0eScsICdmaWZ0eSddLCAnZm91cnR5JywgZnVuY3Rpb24od29yZCkge1xuICAgICAqICAgcmV0dXJuIHRoaXMud29yZFRvTnVtYmVyW3dvcmRdO1xuICAgICAqIH0sIGRpY3QpO1xuICAgICAqIC8vID0+IDJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzb3J0ZWRJbmRleChhcnJheSwgdmFsdWUsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgbG93ID0gMCxcbiAgICAgICAgICBoaWdoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiBsb3c7XG5cbiAgICAgIC8vIGV4cGxpY2l0bHkgcmVmZXJlbmNlIGBpZGVudGl0eWAgZm9yIGJldHRlciBpbmxpbmluZyBpbiBGaXJlZm94XG4gICAgICBjYWxsYmFjayA9IGNhbGxiYWNrID8gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAxKSA6IGlkZW50aXR5O1xuICAgICAgdmFsdWUgPSBjYWxsYmFjayh2YWx1ZSk7XG5cbiAgICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICAgIHZhciBtaWQgPSAobG93ICsgaGlnaCkgPj4+IDE7XG4gICAgICAgIChjYWxsYmFjayhhcnJheVttaWRdKSA8IHZhbHVlKVxuICAgICAgICAgID8gbG93ID0gbWlkICsgMVxuICAgICAgICAgIDogaGlnaCA9IG1pZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsb3c7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBvZiB1bmlxdWUgdmFsdWVzLCBpbiBvcmRlciwgb2YgdGhlIHByb3ZpZGVkIGFycmF5cyB1c2luZ1xuICAgICAqIHN0cmljdCBlcXVhbGl0eSBmb3IgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHsuLi5BcnJheX0gW2FycmF5XSBUaGUgYXJyYXlzIHRvIGluc3BlY3QuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIGNvbWJpbmVkIHZhbHVlcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy51bmlvbihbMSwgMiwgM10sIFs1LCAyLCAxLCA0XSwgWzIsIDFdKTtcbiAgICAgKiAvLyA9PiBbMSwgMiwgMywgNSwgNF1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1bmlvbigpIHtcbiAgICAgIHJldHVybiBiYXNlVW5pcShiYXNlRmxhdHRlbihhcmd1bWVudHMsIHRydWUsIHRydWUpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZHVwbGljYXRlLXZhbHVlLWZyZWUgdmVyc2lvbiBvZiBhbiBhcnJheSB1c2luZyBzdHJpY3QgZXF1YWxpdHlcbiAgICAgKiBmb3IgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuIElmIHRoZSBhcnJheSBpcyBzb3J0ZWQsIHByb3ZpZGluZ1xuICAgICAqIGB0cnVlYCBmb3IgYGlzU29ydGVkYCB3aWxsIHVzZSBhIGZhc3RlciBhbGdvcml0aG0uIElmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWRcbiAgICAgKiBlYWNoIGVsZW1lbnQgb2YgYGFycmF5YCBpcyBwYXNzZWQgdGhyb3VnaCB0aGUgY2FsbGJhY2sgYmVmb3JlIHVuaXF1ZW5lc3NcbiAgICAgKiBpcyBjb21wdXRlZC4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlXG4gICAgICogYXJndW1lbnRzOyAodmFsdWUsIGluZGV4LCBhcnJheSkuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyB1bmlxdWVcbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHByb2Nlc3MuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaXNTb3J0ZWQ9ZmFsc2VdIEEgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IGBhcnJheWAgaXMgc29ydGVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgZHVwbGljYXRlLXZhbHVlLWZyZWUgYXJyYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8udW5pcShbMSwgMiwgMSwgMywgMV0pO1xuICAgICAqIC8vID0+IFsxLCAyLCAzXVxuICAgICAqXG4gICAgICogXy51bmlxKFsxLCAxLCAyLCAyLCAzXSwgdHJ1ZSk7XG4gICAgICogLy8gPT4gWzEsIDIsIDNdXG4gICAgICpcbiAgICAgKiBfLnVuaXEoWydBJywgJ2InLCAnQycsICdhJywgJ0InLCAnYyddLCBmdW5jdGlvbihsZXR0ZXIpIHsgcmV0dXJuIGxldHRlci50b0xvd2VyQ2FzZSgpOyB9KTtcbiAgICAgKiAvLyA9PiBbJ0EnLCAnYicsICdDJ11cbiAgICAgKlxuICAgICAqIF8udW5pcShbMSwgMi41LCAzLCAxLjUsIDIsIDMuNV0sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gdGhpcy5mbG9vcihudW0pOyB9LCBNYXRoKTtcbiAgICAgKiAvLyA9PiBbMSwgMi41LCAzXVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy51bmlxKFt7ICd4JzogMSB9LCB7ICd4JzogMiB9LCB7ICd4JzogMSB9XSwgJ3gnKTtcbiAgICAgKiAvLyA9PiBbeyAneCc6IDEgfSwgeyAneCc6IDIgfV1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1bmlxKGFycmF5LCBpc1NvcnRlZCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIC8vIGp1Z2dsZSBhcmd1bWVudHNcbiAgICAgIGlmICh0eXBlb2YgaXNTb3J0ZWQgIT0gJ2Jvb2xlYW4nICYmIGlzU29ydGVkICE9IG51bGwpIHtcbiAgICAgICAgdGhpc0FyZyA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayA9ICh0eXBlb2YgaXNTb3J0ZWQgIT0gJ2Z1bmN0aW9uJyAmJiB0aGlzQXJnICYmIHRoaXNBcmdbaXNTb3J0ZWRdID09PSBhcnJheSkgPyBudWxsIDogaXNTb3J0ZWQ7XG4gICAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmFzZVVuaXEoYXJyYXksIGlzU29ydGVkLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBleGNsdWRpbmcgYWxsIHByb3ZpZGVkIHZhbHVlcyB1c2luZyBzdHJpY3QgZXF1YWxpdHkgZm9yXG4gICAgICogY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGZpbHRlci5cbiAgICAgKiBAcGFyYW0gey4uLip9IFt2YWx1ZV0gVGhlIHZhbHVlcyB0byBleGNsdWRlLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiBmaWx0ZXJlZCB2YWx1ZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ud2l0aG91dChbMSwgMiwgMSwgMCwgMywgMSwgNF0sIDAsIDEpO1xuICAgICAqIC8vID0+IFsyLCAzLCA0XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHdpdGhvdXQoYXJyYXkpIHtcbiAgICAgIHJldHVybiBiYXNlRGlmZmVyZW5jZShhcnJheSwgc2xpY2UoYXJndW1lbnRzLCAxKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSB0aGF0IGlzIHRoZSBzeW1tZXRyaWMgZGlmZmVyZW5jZSBvZiB0aGUgcHJvdmlkZWQgYXJyYXlzLlxuICAgICAqIFNlZSBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1N5bW1ldHJpY19kaWZmZXJlbmNlLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7Li4uQXJyYXl9IFthcnJheV0gVGhlIGFycmF5cyB0byBpbnNwZWN0LlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiB2YWx1ZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ueG9yKFsxLCAyLCAzXSwgWzUsIDIsIDEsIDRdKTtcbiAgICAgKiAvLyA9PiBbMywgNSwgNF1cbiAgICAgKlxuICAgICAqIF8ueG9yKFsxLCAyLCA1XSwgWzIsIDMsIDVdLCBbMywgNCwgNV0pO1xuICAgICAqIC8vID0+IFsxLCA0LCA1XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHhvcigpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHZhciBhcnJheSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgICAgIGlmIChpc0FycmF5KGFycmF5KSB8fCBpc0FyZ3VtZW50cyhhcnJheSkpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gcmVzdWx0XG4gICAgICAgICAgICA/IGJhc2VVbmlxKGJhc2VEaWZmZXJlbmNlKHJlc3VsdCwgYXJyYXkpLmNvbmNhdChiYXNlRGlmZmVyZW5jZShhcnJheSwgcmVzdWx0KSkpXG4gICAgICAgICAgICA6IGFycmF5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0IHx8IFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgZ3JvdXBlZCBlbGVtZW50cywgdGhlIGZpcnN0IG9mIHdoaWNoIGNvbnRhaW5zIHRoZSBmaXJzdFxuICAgICAqIGVsZW1lbnRzIG9mIHRoZSBnaXZlbiBhcnJheXMsIHRoZSBzZWNvbmQgb2Ygd2hpY2ggY29udGFpbnMgdGhlIHNlY29uZFxuICAgICAqIGVsZW1lbnRzIG9mIHRoZSBnaXZlbiBhcnJheXMsIGFuZCBzbyBvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyB1bnppcFxuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0gey4uLkFycmF5fSBbYXJyYXldIEFycmF5cyB0byBwcm9jZXNzLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiBncm91cGVkIGVsZW1lbnRzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnppcChbJ2ZyZWQnLCAnYmFybmV5J10sIFszMCwgNDBdLCBbdHJ1ZSwgZmFsc2VdKTtcbiAgICAgKiAvLyA9PiBbWydmcmVkJywgMzAsIHRydWVdLCBbJ2Jhcm5leScsIDQwLCBmYWxzZV1dXG4gICAgICovXG4gICAgZnVuY3Rpb24gemlwKCkge1xuICAgICAgdmFyIGFycmF5ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHMgOiBhcmd1bWVudHNbMF0sXG4gICAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBhcnJheSA/IG1heChwbHVjayhhcnJheSwgJ2xlbmd0aCcpKSA6IDAsXG4gICAgICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGgpO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gcGx1Y2soYXJyYXksIGluZGV4KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgZnJvbSBhcnJheXMgb2YgYGtleXNgIGFuZCBgdmFsdWVzYC4gUHJvdmlkZVxuICAgICAqIGVpdGhlciBhIHNpbmdsZSB0d28gZGltZW5zaW9uYWwgYXJyYXksIGkuZS4gYFtba2V5MSwgdmFsdWUxXSwgW2tleTIsIHZhbHVlMl1dYFxuICAgICAqIG9yIHR3byBhcnJheXMsIG9uZSBvZiBga2V5c2AgYW5kIG9uZSBvZiBjb3JyZXNwb25kaW5nIGB2YWx1ZXNgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIG9iamVjdFxuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBrZXlzIFRoZSBhcnJheSBvZiBrZXlzLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXM9W11dIFRoZSBhcnJheSBvZiB2YWx1ZXMuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIGdpdmVuIGtleXMgYW5kXG4gICAgICogIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnppcE9iamVjdChbJ2ZyZWQnLCAnYmFybmV5J10sIFszMCwgNDBdKTtcbiAgICAgKiAvLyA9PiB7ICdmcmVkJzogMzAsICdiYXJuZXknOiA0MCB9XG4gICAgICovXG4gICAgZnVuY3Rpb24gemlwT2JqZWN0KGtleXMsIHZhbHVlcykge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0ga2V5cyA/IGtleXMubGVuZ3RoIDogMCxcbiAgICAgICAgICByZXN1bHQgPSB7fTtcblxuICAgICAgaWYgKCF2YWx1ZXMgJiYgbGVuZ3RoICYmICFpc0FycmF5KGtleXNbMF0pKSB7XG4gICAgICAgIHZhbHVlcyA9IFtdO1xuICAgICAgfVxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZXNbaW5kZXhdO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSkge1xuICAgICAgICAgIHJlc3VsdFtrZXlbMF1dID0ga2V5WzFdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgZXhlY3V0ZXMgYGZ1bmNgLCB3aXRoICB0aGUgYHRoaXNgIGJpbmRpbmcgYW5kXG4gICAgICogYXJndW1lbnRzIG9mIHRoZSBjcmVhdGVkIGZ1bmN0aW9uLCBvbmx5IGFmdGVyIGJlaW5nIGNhbGxlZCBgbmAgdGltZXMuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0aGUgZnVuY3Rpb24gbXVzdCBiZSBjYWxsZWQgYmVmb3JlXG4gICAgICogIGBmdW5jYCBpcyBleGVjdXRlZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyByZXN0cmljdGVkIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgc2F2ZXMgPSBbJ3Byb2ZpbGUnLCAnc2V0dGluZ3MnXTtcbiAgICAgKlxuICAgICAqIHZhciBkb25lID0gXy5hZnRlcihzYXZlcy5sZW5ndGgsIGZ1bmN0aW9uKCkge1xuICAgICAqICAgY29uc29sZS5sb2coJ0RvbmUgc2F2aW5nIScpO1xuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogXy5mb3JFYWNoKHNhdmVzLCBmdW5jdGlvbih0eXBlKSB7XG4gICAgICogICBhc3luY1NhdmUoeyAndHlwZSc6IHR5cGUsICdjb21wbGV0ZSc6IGRvbmUgfSk7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gbG9ncyAnRG9uZSBzYXZpbmchJywgYWZ0ZXIgYWxsIHNhdmVzIGhhdmUgY29tcGxldGVkXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWZ0ZXIobiwgZnVuYykge1xuICAgICAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICgtLW4gPCAxKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsIGludm9rZXMgYGZ1bmNgIHdpdGggdGhlIGB0aGlzYFxuICAgICAqIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCBwcmVwZW5kcyBhbnkgYWRkaXRpb25hbCBgYmluZGAgYXJndW1lbnRzIHRvIHRob3NlXG4gICAgICogcHJvdmlkZWQgdG8gdGhlIGJvdW5kIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGJpbmQuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAgICAgKiBAcGFyYW0gey4uLip9IFthcmddIEFyZ3VtZW50cyB0byBiZSBwYXJ0aWFsbHkgYXBwbGllZC5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBib3VuZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGZ1bmMgPSBmdW5jdGlvbihncmVldGluZykge1xuICAgICAqICAgcmV0dXJuIGdyZWV0aW5nICsgJyAnICsgdGhpcy5uYW1lO1xuICAgICAqIH07XG4gICAgICpcbiAgICAgKiBmdW5jID0gXy5iaW5kKGZ1bmMsIHsgJ25hbWUnOiAnZnJlZCcgfSwgJ2hpJyk7XG4gICAgICogZnVuYygpO1xuICAgICAqIC8vID0+ICdoaSBmcmVkJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJpbmQoZnVuYywgdGhpc0FyZykge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAyXG4gICAgICAgID8gY3JlYXRlV3JhcHBlcihmdW5jLCAxNywgc2xpY2UoYXJndW1lbnRzLCAyKSwgbnVsbCwgdGhpc0FyZylcbiAgICAgICAgOiBjcmVhdGVXcmFwcGVyKGZ1bmMsIDEsIG51bGwsIG51bGwsIHRoaXNBcmcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJpbmRzIG1ldGhvZHMgb2YgYW4gb2JqZWN0IHRvIHRoZSBvYmplY3QgaXRzZWxmLCBvdmVyd3JpdGluZyB0aGUgZXhpc3RpbmdcbiAgICAgKiBtZXRob2QuIE1ldGhvZCBuYW1lcyBtYXkgYmUgc3BlY2lmaWVkIGFzIGluZGl2aWR1YWwgYXJndW1lbnRzIG9yIGFzIGFycmF5c1xuICAgICAqIG9mIG1ldGhvZCBuYW1lcy4gSWYgbm8gbWV0aG9kIG5hbWVzIGFyZSBwcm92aWRlZCBhbGwgdGhlIGZ1bmN0aW9uIHByb3BlcnRpZXNcbiAgICAgKiBvZiBgb2JqZWN0YCB3aWxsIGJlIGJvdW5kLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBiaW5kIGFuZCBhc3NpZ24gdGhlIGJvdW5kIG1ldGhvZHMgdG8uXG4gICAgICogQHBhcmFtIHsuLi5zdHJpbmd9IFttZXRob2ROYW1lXSBUaGUgb2JqZWN0IG1ldGhvZCBuYW1lcyB0b1xuICAgICAqICBiaW5kLCBzcGVjaWZpZWQgYXMgaW5kaXZpZHVhbCBtZXRob2QgbmFtZXMgb3IgYXJyYXlzIG9mIG1ldGhvZCBuYW1lcy5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgdmlldyA9IHtcbiAgICAgKiAgICdsYWJlbCc6ICdkb2NzJyxcbiAgICAgKiAgICdvbkNsaWNrJzogZnVuY3Rpb24oKSB7IGNvbnNvbGUubG9nKCdjbGlja2VkICcgKyB0aGlzLmxhYmVsKTsgfVxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiBfLmJpbmRBbGwodmlldyk7XG4gICAgICogalF1ZXJ5KCcjZG9jcycpLm9uKCdjbGljaycsIHZpZXcub25DbGljayk7XG4gICAgICogLy8gPT4gbG9ncyAnY2xpY2tlZCBkb2NzJywgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiaW5kQWxsKG9iamVjdCkge1xuICAgICAgdmFyIGZ1bmNzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBiYXNlRmxhdHRlbihhcmd1bWVudHMsIHRydWUsIGZhbHNlLCAxKSA6IGZ1bmN0aW9ucyhvYmplY3QpLFxuICAgICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gZnVuY3MubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0gZnVuY3NbaW5kZXhdO1xuICAgICAgICBvYmplY3Rba2V5XSA9IGNyZWF0ZVdyYXBwZXIob2JqZWN0W2tleV0sIDEsIG51bGwsIG51bGwsIG9iamVjdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCwgaW52b2tlcyB0aGUgbWV0aG9kIGF0IGBvYmplY3Rba2V5XWBcbiAgICAgKiBhbmQgcHJlcGVuZHMgYW55IGFkZGl0aW9uYWwgYGJpbmRLZXlgIGFyZ3VtZW50cyB0byB0aG9zZSBwcm92aWRlZCB0byB0aGUgYm91bmRcbiAgICAgKiBmdW5jdGlvbi4gVGhpcyBtZXRob2QgZGlmZmVycyBmcm9tIGBfLmJpbmRgIGJ5IGFsbG93aW5nIGJvdW5kIGZ1bmN0aW9ucyB0b1xuICAgICAqIHJlZmVyZW5jZSBtZXRob2RzIHRoYXQgd2lsbCBiZSByZWRlZmluZWQgb3IgZG9uJ3QgeWV0IGV4aXN0LlxuICAgICAqIFNlZSBodHRwOi8vbWljaGF1eC5jYS9hcnRpY2xlcy9sYXp5LWZ1bmN0aW9uLWRlZmluaXRpb24tcGF0dGVybi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdGhlIG1ldGhvZCBiZWxvbmdzIHRvLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kLlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW2FyZ10gQXJndW1lbnRzIHRvIGJlIHBhcnRpYWxseSBhcHBsaWVkLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJvdW5kIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgb2JqZWN0ID0ge1xuICAgICAqICAgJ25hbWUnOiAnZnJlZCcsXG4gICAgICogICAnZ3JlZXQnOiBmdW5jdGlvbihncmVldGluZykge1xuICAgICAqICAgICByZXR1cm4gZ3JlZXRpbmcgKyAnICcgKyB0aGlzLm5hbWU7XG4gICAgICogICB9XG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIHZhciBmdW5jID0gXy5iaW5kS2V5KG9iamVjdCwgJ2dyZWV0JywgJ2hpJyk7XG4gICAgICogZnVuYygpO1xuICAgICAqIC8vID0+ICdoaSBmcmVkJ1xuICAgICAqXG4gICAgICogb2JqZWN0LmdyZWV0ID0gZnVuY3Rpb24oZ3JlZXRpbmcpIHtcbiAgICAgKiAgIHJldHVybiBncmVldGluZyArICd5YSAnICsgdGhpcy5uYW1lICsgJyEnO1xuICAgICAqIH07XG4gICAgICpcbiAgICAgKiBmdW5jKCk7XG4gICAgICogLy8gPT4gJ2hpeWEgZnJlZCEnXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmluZEtleShvYmplY3QsIGtleSkge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAyXG4gICAgICAgID8gY3JlYXRlV3JhcHBlcihrZXksIDE5LCBzbGljZShhcmd1bWVudHMsIDIpLCBudWxsLCBvYmplY3QpXG4gICAgICAgIDogY3JlYXRlV3JhcHBlcihrZXksIDMsIG51bGwsIG51bGwsIG9iamVjdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIHRoZSBwcm92aWRlZCBmdW5jdGlvbnMsXG4gICAgICogd2hlcmUgZWFjaCBmdW5jdGlvbiBjb25zdW1lcyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gICAgICogRm9yIGV4YW1wbGUsIGNvbXBvc2luZyB0aGUgZnVuY3Rpb25zIGBmKClgLCBgZygpYCwgYW5kIGBoKClgIHByb2R1Y2VzIGBmKGcoaCgpKSlgLlxuICAgICAqIEVhY2ggZnVuY3Rpb24gaXMgZXhlY3V0ZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIGNvbXBvc2VkIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IFtmdW5jXSBGdW5jdGlvbnMgdG8gY29tcG9zZS5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjb21wb3NlZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIHJlYWxOYW1lTWFwID0ge1xuICAgICAqICAgJ3BlYmJsZXMnOiAncGVuZWxvcGUnXG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIHZhciBmb3JtYXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICogICBuYW1lID0gcmVhbE5hbWVNYXBbbmFtZS50b0xvd2VyQ2FzZSgpXSB8fCBuYW1lO1xuICAgICAqICAgcmV0dXJuIG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIHZhciBncmVldCA9IGZ1bmN0aW9uKGZvcm1hdHRlZCkge1xuICAgICAqICAgcmV0dXJuICdIaXlhICcgKyBmb3JtYXR0ZWQgKyAnISc7XG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIHZhciB3ZWxjb21lID0gXy5jb21wb3NlKGdyZWV0LCBmb3JtYXQpO1xuICAgICAqIHdlbGNvbWUoJ3BlYmJsZXMnKTtcbiAgICAgKiAvLyA9PiAnSGl5YSBQZW5lbG9wZSEnXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29tcG9zZSgpIHtcbiAgICAgIHZhciBmdW5jcyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICBsZW5ndGggPSBmdW5jcy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBpZiAoIWlzRnVuY3Rpb24oZnVuY3NbbGVuZ3RoXSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICAgICAgbGVuZ3RoID0gZnVuY3MubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAgIGFyZ3MgPSBbZnVuY3NbbGVuZ3RoXS5hcHBseSh0aGlzLCBhcmdzKV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB3aGljaCBhY2NlcHRzIG9uZSBvciBtb3JlIGFyZ3VtZW50cyBvZiBgZnVuY2AgdGhhdCB3aGVuXG4gICAgICogaW52b2tlZCBlaXRoZXIgZXhlY3V0ZXMgYGZ1bmNgIHJldHVybmluZyBpdHMgcmVzdWx0LCBpZiBhbGwgYGZ1bmNgIGFyZ3VtZW50c1xuICAgICAqIGhhdmUgYmVlbiBwcm92aWRlZCwgb3IgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBvbmUgb3IgbW9yZSBvZiB0aGVcbiAgICAgKiByZW1haW5pbmcgYGZ1bmNgIGFyZ3VtZW50cywgYW5kIHNvIG9uLiBUaGUgYXJpdHkgb2YgYGZ1bmNgIGNhbiBiZSBzcGVjaWZpZWRcbiAgICAgKiBpZiBgZnVuYy5sZW5ndGhgIGlzIG5vdCBzdWZmaWNpZW50LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYXJpdHk9ZnVuYy5sZW5ndGhdIFRoZSBhcml0eSBvZiBgZnVuY2AuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY3VycmllZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGN1cnJpZWQgPSBfLmN1cnJ5KGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICAgKiAgIGNvbnNvbGUubG9nKGEgKyBiICsgYyk7XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBjdXJyaWVkKDEpKDIpKDMpO1xuICAgICAqIC8vID0+IDZcbiAgICAgKlxuICAgICAqIGN1cnJpZWQoMSwgMikoMyk7XG4gICAgICogLy8gPT4gNlxuICAgICAqXG4gICAgICogY3VycmllZCgxLCAyLCAzKTtcbiAgICAgKiAvLyA9PiA2XG4gICAgICovXG4gICAgZnVuY3Rpb24gY3VycnkoZnVuYywgYXJpdHkpIHtcbiAgICAgIGFyaXR5ID0gdHlwZW9mIGFyaXR5ID09ICdudW1iZXInID8gYXJpdHkgOiAoK2FyaXR5IHx8IGZ1bmMubGVuZ3RoKTtcbiAgICAgIHJldHVybiBjcmVhdGVXcmFwcGVyKGZ1bmMsIDQsIG51bGwsIG51bGwsIG51bGwsIGFyaXR5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGRlbGF5IHRoZSBleGVjdXRpb24gb2YgYGZ1bmNgIHVudGlsIGFmdGVyXG4gICAgICogYHdhaXRgIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSBpdCB3YXMgaW52b2tlZC5cbiAgICAgKiBQcm92aWRlIGFuIG9wdGlvbnMgb2JqZWN0IHRvIGluZGljYXRlIHRoYXQgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uXG4gICAgICogdGhlIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBTdWJzZXF1ZW50IGNhbGxzXG4gICAgICogdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBjYWxsLlxuICAgICAqXG4gICAgICogTm90ZTogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCBgZnVuY2Agd2lsbCBiZSBjYWxsZWRcbiAgICAgKiBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIGlzXG4gICAgICogaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3YWl0IFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV0gU3BlY2lmeSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF0gVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGNhbGxlZC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdIFNwZWNpZnkgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogLy8gYXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eFxuICAgICAqIHZhciBsYXp5TGF5b3V0ID0gXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCk7XG4gICAgICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIGxhenlMYXlvdXQpO1xuICAgICAqXG4gICAgICogLy8gZXhlY3V0ZSBgc2VuZE1haWxgIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHNcbiAgICAgKiBqUXVlcnkoJyNwb3N0Ym94Jykub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gICAgICogICAnbGVhZGluZyc6IHRydWUsXG4gICAgICogICAndHJhaWxpbmcnOiBmYWxzZVxuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogLy8gZW5zdXJlIGBiYXRjaExvZ2AgaXMgZXhlY3V0ZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHNcbiAgICAgKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gICAgICogc291cmNlLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHtcbiAgICAgKiAgICdtYXhXYWl0JzogMTAwMFxuICAgICAqIH0sIGZhbHNlKTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgICB2YXIgYXJncyxcbiAgICAgICAgICBtYXhUaW1lb3V0SWQsXG4gICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgIHN0YW1wLFxuICAgICAgICAgIHRoaXNBcmcsXG4gICAgICAgICAgdGltZW91dElkLFxuICAgICAgICAgIHRyYWlsaW5nQ2FsbCxcbiAgICAgICAgICBsYXN0Q2FsbGVkID0gMCxcbiAgICAgICAgICBtYXhXYWl0ID0gZmFsc2UsXG4gICAgICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gICAgICBpZiAoIWlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgIH1cbiAgICAgIHdhaXQgPSBuYXRpdmVNYXgoMCwgd2FpdCkgfHwgMDtcbiAgICAgIGlmIChvcHRpb25zID09PSB0cnVlKSB7XG4gICAgICAgIHZhciBsZWFkaW5nID0gdHJ1ZTtcbiAgICAgICAgdHJhaWxpbmcgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICAgICAgbGVhZGluZyA9IG9wdGlvbnMubGVhZGluZztcbiAgICAgICAgbWF4V2FpdCA9ICdtYXhXYWl0JyBpbiBvcHRpb25zICYmIChuYXRpdmVNYXgod2FpdCwgb3B0aW9ucy5tYXhXYWl0KSB8fCAwKTtcbiAgICAgICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyBvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gICAgICB9XG4gICAgICB2YXIgZGVsYXllZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3coKSAtIHN0YW1wKTtcbiAgICAgICAgaWYgKHJlbWFpbmluZyA8PSAwKSB7XG4gICAgICAgICAgaWYgKG1heFRpbWVvdXRJZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KG1heFRpbWVvdXRJZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBpc0NhbGxlZCA9IHRyYWlsaW5nQ2FsbDtcbiAgICAgICAgICBtYXhUaW1lb3V0SWQgPSB0aW1lb3V0SWQgPSB0cmFpbGluZ0NhbGwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgaWYgKGlzQ2FsbGVkKSB7XG4gICAgICAgICAgICBsYXN0Q2FsbGVkID0gbm93KCk7XG4gICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKCF0aW1lb3V0SWQgJiYgIW1heFRpbWVvdXRJZCkge1xuICAgICAgICAgICAgICBhcmdzID0gdGhpc0FyZyA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZGVsYXllZCwgcmVtYWluaW5nKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmFyIG1heERlbGF5ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRpbWVvdXRJZCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICB9XG4gICAgICAgIG1heFRpbWVvdXRJZCA9IHRpbWVvdXRJZCA9IHRyYWlsaW5nQ2FsbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHRyYWlsaW5nIHx8IChtYXhXYWl0ICE9PSB3YWl0KSkge1xuICAgICAgICAgIGxhc3RDYWxsZWQgPSBub3coKTtcbiAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgICAgICAgIGlmICghdGltZW91dElkICYmICFtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgICAgIGFyZ3MgPSB0aGlzQXJnID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgc3RhbXAgPSBub3coKTtcbiAgICAgICAgdGhpc0FyZyA9IHRoaXM7XG4gICAgICAgIHRyYWlsaW5nQ2FsbCA9IHRyYWlsaW5nICYmICh0aW1lb3V0SWQgfHwgIWxlYWRpbmcpO1xuXG4gICAgICAgIGlmIChtYXhXYWl0ID09PSBmYWxzZSkge1xuICAgICAgICAgIHZhciBsZWFkaW5nQ2FsbCA9IGxlYWRpbmcgJiYgIXRpbWVvdXRJZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIW1heFRpbWVvdXRJZCAmJiAhbGVhZGluZykge1xuICAgICAgICAgICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgcmVtYWluaW5nID0gbWF4V2FpdCAtIChzdGFtcCAtIGxhc3RDYWxsZWQpLFxuICAgICAgICAgICAgICBpc0NhbGxlZCA9IHJlbWFpbmluZyA8PSAwO1xuXG4gICAgICAgICAgaWYgKGlzQ2FsbGVkKSB7XG4gICAgICAgICAgICBpZiAobWF4VGltZW91dElkKSB7XG4gICAgICAgICAgICAgIG1heFRpbWVvdXRJZCA9IGNsZWFyVGltZW91dChtYXhUaW1lb3V0SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoIW1heFRpbWVvdXRJZCkge1xuICAgICAgICAgICAgbWF4VGltZW91dElkID0gc2V0VGltZW91dChtYXhEZWxheWVkLCByZW1haW5pbmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNDYWxsZWQgJiYgdGltZW91dElkKSB7XG4gICAgICAgICAgdGltZW91dElkID0gY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXRpbWVvdXRJZCAmJiB3YWl0ICE9PSBtYXhXYWl0KSB7XG4gICAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dChkZWxheWVkLCB3YWl0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGVhZGluZ0NhbGwpIHtcbiAgICAgICAgICBpc0NhbGxlZCA9IHRydWU7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNDYWxsZWQgJiYgIXRpbWVvdXRJZCAmJiAhbWF4VGltZW91dElkKSB7XG4gICAgICAgICAgYXJncyA9IHRoaXNBcmcgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlZmVycyBleGVjdXRpbmcgdGhlIGBmdW5jYCBmdW5jdGlvbiB1bnRpbCB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhcyBjbGVhcmVkLlxuICAgICAqIEFkZGl0aW9uYWwgYXJndW1lbnRzIHdpbGwgYmUgcHJvdmlkZWQgdG8gYGZ1bmNgIHdoZW4gaXQgaXMgaW52b2tlZC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWZlci5cbiAgICAgKiBAcGFyYW0gey4uLip9IFthcmddIEFyZ3VtZW50cyB0byBpbnZva2UgdGhlIGZ1bmN0aW9uIHdpdGguXG4gICAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXIgaWQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uZGVmZXIoZnVuY3Rpb24odGV4dCkgeyBjb25zb2xlLmxvZyh0ZXh0KTsgfSwgJ2RlZmVycmVkJyk7XG4gICAgICogLy8gbG9ncyAnZGVmZXJyZWQnIGFmdGVyIG9uZSBvciBtb3JlIG1pbGxpc2Vjb25kc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRlZmVyKGZ1bmMpIHtcbiAgICAgIGlmICghaXNGdW5jdGlvbihmdW5jKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgICAgfVxuICAgICAgdmFyIGFyZ3MgPSBzbGljZShhcmd1bWVudHMsIDEpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTsgfSwgMSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIGBmdW5jYCBmdW5jdGlvbiBhZnRlciBgd2FpdGAgbWlsbGlzZWNvbmRzLiBBZGRpdGlvbmFsIGFyZ3VtZW50c1xuICAgICAqIHdpbGwgYmUgcHJvdmlkZWQgdG8gYGZ1bmNgIHdoZW4gaXQgaXMgaW52b2tlZC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWxheS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2FpdCBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheSBleGVjdXRpb24uXG4gICAgICogQHBhcmFtIHsuLi4qfSBbYXJnXSBBcmd1bWVudHMgdG8gaW52b2tlIHRoZSBmdW5jdGlvbiB3aXRoLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVyIGlkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmRlbGF5KGZ1bmN0aW9uKHRleHQpIHsgY29uc29sZS5sb2codGV4dCk7IH0sIDEwMDAsICdsYXRlcicpO1xuICAgICAqIC8vID0+IGxvZ3MgJ2xhdGVyJyBhZnRlciBvbmUgc2Vjb25kXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGVsYXkoZnVuYywgd2FpdCkge1xuICAgICAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgICB9XG4gICAgICB2YXIgYXJncyA9IHNsaWNlKGFyZ3VtZW50cywgMik7XG4gICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHsgZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3MpOyB9LCB3YWl0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBtZW1vaXplcyB0aGUgcmVzdWx0IG9mIGBmdW5jYC4gSWYgYHJlc29sdmVyYCBpc1xuICAgICAqIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZCB0byBkZXRlcm1pbmUgdGhlIGNhY2hlIGtleSBmb3Igc3RvcmluZyB0aGUgcmVzdWx0XG4gICAgICogYmFzZWQgb24gdGhlIGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uIEJ5IGRlZmF1bHQsIHRoZVxuICAgICAqIGZpcnN0IGFyZ3VtZW50IHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBjYWNoZSBrZXkuXG4gICAgICogVGhlIGBmdW5jYCBpcyBleGVjdXRlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gICAgICogVGhlIHJlc3VsdCBjYWNoZSBpcyBleHBvc2VkIGFzIHRoZSBgY2FjaGVgIHByb3BlcnR5IG9uIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc29sdmVyXSBBIGZ1bmN0aW9uIHVzZWQgdG8gcmVzb2x2ZSB0aGUgY2FjaGUga2V5LlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IG1lbW9pemluZyBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGZpYm9uYWNjaSA9IF8ubWVtb2l6ZShmdW5jdGlvbihuKSB7XG4gICAgICogICByZXR1cm4gbiA8IDIgPyBuIDogZmlib25hY2NpKG4gLSAxKSArIGZpYm9uYWNjaShuIC0gMik7XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBmaWJvbmFjY2koOSlcbiAgICAgKiAvLyA9PiAzNFxuICAgICAqXG4gICAgICogdmFyIGRhdGEgPSB7XG4gICAgICogICAnZnJlZCc6IHsgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiA0MCB9LFxuICAgICAqICAgJ3BlYmJsZXMnOiB7ICduYW1lJzogJ3BlYmJsZXMnLCAnYWdlJzogMSB9XG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIC8vIG1vZGlmeWluZyB0aGUgcmVzdWx0IGNhY2hlXG4gICAgICogdmFyIGdldCA9IF8ubWVtb2l6ZShmdW5jdGlvbihuYW1lKSB7IHJldHVybiBkYXRhW25hbWVdOyB9LCBfLmlkZW50aXR5KTtcbiAgICAgKiBnZXQoJ3BlYmJsZXMnKTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ3BlYmJsZXMnLCAnYWdlJzogMSB9XG4gICAgICpcbiAgICAgKiBnZXQuY2FjaGUucGViYmxlcy5uYW1lID0gJ3BlbmVsb3BlJztcbiAgICAgKiBnZXQoJ3BlYmJsZXMnKTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ3BlbmVsb3BlJywgJ2FnZSc6IDEgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1lbW9pemUoZnVuYywgcmVzb2x2ZXIpIHtcbiAgICAgIGlmICghaXNGdW5jdGlvbihmdW5jKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgICAgfVxuICAgICAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjYWNoZSA9IG1lbW9pemVkLmNhY2hlLFxuICAgICAgICAgICAga2V5ID0gcmVzb2x2ZXIgPyByZXNvbHZlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDoga2V5UHJlZml4ICsgYXJndW1lbnRzWzBdO1xuXG4gICAgICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGNhY2hlLCBrZXkpXG4gICAgICAgICAgPyBjYWNoZVtrZXldXG4gICAgICAgICAgOiAoY2FjaGVba2V5XSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgICB9XG4gICAgICBtZW1vaXplZC5jYWNoZSA9IHt9O1xuICAgICAgcmV0dXJuIG1lbW9pemVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGlzIHJlc3RyaWN0ZWQgdG8gZXhlY3V0ZSBgZnVuY2Agb25jZS4gUmVwZWF0IGNhbGxzIHRvXG4gICAgICogdGhlIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgY2FsbC4gVGhlIGBmdW5jYCBpcyBleGVjdXRlZFxuICAgICAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBjcmVhdGVkIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHJlc3RyaWN0ZWQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBpbml0aWFsaXplID0gXy5vbmNlKGNyZWF0ZUFwcGxpY2F0aW9uKTtcbiAgICAgKiBpbml0aWFsaXplKCk7XG4gICAgICogaW5pdGlhbGl6ZSgpO1xuICAgICAqIC8vIGBpbml0aWFsaXplYCBleGVjdXRlcyBgY3JlYXRlQXBwbGljYXRpb25gIG9uY2VcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvbmNlKGZ1bmMpIHtcbiAgICAgIHZhciByYW4sXG4gICAgICAgICAgcmVzdWx0O1xuXG4gICAgICBpZiAoIWlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHJhbikge1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmFuID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIC8vIGNsZWFyIHRoZSBgZnVuY2AgdmFyaWFibGUgc28gdGhlIGZ1bmN0aW9uIG1heSBiZSBnYXJiYWdlIGNvbGxlY3RlZFxuICAgICAgICBmdW5jID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLCBpbnZva2VzIGBmdW5jYCB3aXRoIGFueSBhZGRpdGlvbmFsXG4gICAgICogYHBhcnRpYWxgIGFyZ3VtZW50cyBwcmVwZW5kZWQgdG8gdGhvc2UgcHJvdmlkZWQgdG8gdGhlIG5ldyBmdW5jdGlvbi4gVGhpc1xuICAgICAqIG1ldGhvZCBpcyBzaW1pbGFyIHRvIGBfLmJpbmRgIGV4Y2VwdCBpdCBkb2VzICoqbm90KiogYWx0ZXIgdGhlIGB0aGlzYCBiaW5kaW5nLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHBhcnRpYWxseSBhcHBseSBhcmd1bWVudHMgdG8uXG4gICAgICogQHBhcmFtIHsuLi4qfSBbYXJnXSBBcmd1bWVudHMgdG8gYmUgcGFydGlhbGx5IGFwcGxpZWQuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgcGFydGlhbGx5IGFwcGxpZWQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBncmVldCA9IGZ1bmN0aW9uKGdyZWV0aW5nLCBuYW1lKSB7IHJldHVybiBncmVldGluZyArICcgJyArIG5hbWU7IH07XG4gICAgICogdmFyIGhpID0gXy5wYXJ0aWFsKGdyZWV0LCAnaGknKTtcbiAgICAgKiBoaSgnZnJlZCcpO1xuICAgICAqIC8vID0+ICdoaSBmcmVkJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhcnRpYWwoZnVuYykge1xuICAgICAgcmV0dXJuIGNyZWF0ZVdyYXBwZXIoZnVuYywgMTYsIHNsaWNlKGFyZ3VtZW50cywgMSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ucGFydGlhbGAgZXhjZXB0IHRoYXQgYHBhcnRpYWxgIGFyZ3VtZW50cyBhcmVcbiAgICAgKiBhcHBlbmRlZCB0byB0aG9zZSBwcm92aWRlZCB0byB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHBhcnRpYWxseSBhcHBseSBhcmd1bWVudHMgdG8uXG4gICAgICogQHBhcmFtIHsuLi4qfSBbYXJnXSBBcmd1bWVudHMgdG8gYmUgcGFydGlhbGx5IGFwcGxpZWQuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgcGFydGlhbGx5IGFwcGxpZWQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBkZWZhdWx0c0RlZXAgPSBfLnBhcnRpYWxSaWdodChfLm1lcmdlLCBfLmRlZmF1bHRzKTtcbiAgICAgKlxuICAgICAqIHZhciBvcHRpb25zID0ge1xuICAgICAqICAgJ3ZhcmlhYmxlJzogJ2RhdGEnLFxuICAgICAqICAgJ2ltcG9ydHMnOiB7ICdqcSc6ICQgfVxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiBkZWZhdWx0c0RlZXAob3B0aW9ucywgXy50ZW1wbGF0ZVNldHRpbmdzKTtcbiAgICAgKlxuICAgICAqIG9wdGlvbnMudmFyaWFibGVcbiAgICAgKiAvLyA9PiAnZGF0YSdcbiAgICAgKlxuICAgICAqIG9wdGlvbnMuaW1wb3J0c1xuICAgICAqIC8vID0+IHsgJ18nOiBfLCAnanEnOiAkIH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJ0aWFsUmlnaHQoZnVuYykge1xuICAgICAgcmV0dXJuIGNyZWF0ZVdyYXBwZXIoZnVuYywgMzIsIG51bGwsIHNsaWNlKGFyZ3VtZW50cywgMSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGV4ZWN1dGVkLCB3aWxsIG9ubHkgY2FsbCB0aGUgYGZ1bmNgIGZ1bmN0aW9uXG4gICAgICogYXQgbW9zdCBvbmNlIHBlciBldmVyeSBgd2FpdGAgbWlsbGlzZWNvbmRzLiBQcm92aWRlIGFuIG9wdGlvbnMgb2JqZWN0IHRvXG4gICAgICogaW5kaWNhdGUgdGhhdCBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2VcbiAgICAgKiBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFN1YnNlcXVlbnQgY2FsbHMgdG8gdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsXG4gICAgICogcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgIGNhbGwuXG4gICAgICpcbiAgICAgKiBOb3RlOiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgIGBmdW5jYCB3aWxsIGJlIGNhbGxlZFxuICAgICAqIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gaXNcbiAgICAgKiBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gdGhyb3R0bGUuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdhaXQgVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gdGhyb3R0bGUgZXhlY3V0aW9ucyB0by5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFRoZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9dHJ1ZV0gU3BlY2lmeSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdIFNwZWNpZnkgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHRocm90dGxlZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogLy8gYXZvaWQgZXhjZXNzaXZlbHkgdXBkYXRpbmcgdGhlIHBvc2l0aW9uIHdoaWxlIHNjcm9sbGluZ1xuICAgICAqIHZhciB0aHJvdHRsZWQgPSBfLnRocm90dGxlKHVwZGF0ZVBvc2l0aW9uLCAxMDApO1xuICAgICAqIGpRdWVyeSh3aW5kb3cpLm9uKCdzY3JvbGwnLCB0aHJvdHRsZWQpO1xuICAgICAqXG4gICAgICogLy8gZXhlY3V0ZSBgcmVuZXdUb2tlbmAgd2hlbiB0aGUgY2xpY2sgZXZlbnQgaXMgZmlyZWQsIGJ1dCBub3QgbW9yZSB0aGFuIG9uY2UgZXZlcnkgNSBtaW51dGVzXG4gICAgICogalF1ZXJ5KCcuaW50ZXJhY3RpdmUnKS5vbignY2xpY2snLCBfLnRocm90dGxlKHJlbmV3VG9rZW4sIDMwMDAwMCwge1xuICAgICAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAgICAgKiB9KSk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgICAgdmFyIGxlYWRpbmcgPSB0cnVlLFxuICAgICAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICAgICAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucyA9PT0gZmFsc2UpIHtcbiAgICAgICAgbGVhZGluZyA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgICAgICBsZWFkaW5nID0gJ2xlYWRpbmcnIGluIG9wdGlvbnMgPyBvcHRpb25zLmxlYWRpbmcgOiBsZWFkaW5nO1xuICAgICAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/IG9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgICAgIH1cbiAgICAgIGRlYm91bmNlT3B0aW9ucy5sZWFkaW5nID0gbGVhZGluZztcbiAgICAgIGRlYm91bmNlT3B0aW9ucy5tYXhXYWl0ID0gd2FpdDtcbiAgICAgIGRlYm91bmNlT3B0aW9ucy50cmFpbGluZyA9IHRyYWlsaW5nO1xuXG4gICAgICByZXR1cm4gZGVib3VuY2UoZnVuYywgd2FpdCwgZGVib3VuY2VPcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBwcm92aWRlcyBgdmFsdWVgIHRvIHRoZSB3cmFwcGVyIGZ1bmN0aW9uIGFzIGl0c1xuICAgICAqIGZpcnN0IGFyZ3VtZW50LiBBZGRpdGlvbmFsIGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZnVuY3Rpb24gYXJlIGFwcGVuZGVkXG4gICAgICogdG8gdGhvc2UgcHJvdmlkZWQgdG8gdGhlIHdyYXBwZXIgZnVuY3Rpb24uIFRoZSB3cmFwcGVyIGlzIGV4ZWN1dGVkIHdpdGhcbiAgICAgKiB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIGNyZWF0ZWQgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gd3JhcC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB3cmFwcGVyIFRoZSB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgcCA9IF8ud3JhcChfLmVzY2FwZSwgZnVuY3Rpb24oZnVuYywgdGV4dCkge1xuICAgICAqICAgcmV0dXJuICc8cD4nICsgZnVuYyh0ZXh0KSArICc8L3A+JztcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIHAoJ0ZyZWQsIFdpbG1hLCAmIFBlYmJsZXMnKTtcbiAgICAgKiAvLyA9PiAnPHA+RnJlZCwgV2lsbWEsICZhbXA7IFBlYmJsZXM8L3A+J1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHdyYXAodmFsdWUsIHdyYXBwZXIpIHtcbiAgICAgIHJldHVybiBjcmVhdGVXcmFwcGVyKHdyYXBwZXIsIDE2LCBbdmFsdWVdKTtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgb2JqZWN0ID0geyAnbmFtZSc6ICdmcmVkJyB9O1xuICAgICAqIHZhciBnZXR0ZXIgPSBfLmNvbnN0YW50KG9iamVjdCk7XG4gICAgICogZ2V0dGVyKCkgPT09IG9iamVjdDtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm9kdWNlcyBhIGNhbGxiYWNrIGJvdW5kIHRvIGFuIG9wdGlvbmFsIGB0aGlzQXJnYC4gSWYgYGZ1bmNgIGlzIGEgcHJvcGVydHlcbiAgICAgKiBuYW1lIHRoZSBjcmVhdGVkIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBmb3IgYSBnaXZlbiBlbGVtZW50LlxuICAgICAqIElmIGBmdW5jYCBpcyBhbiBvYmplY3QgdGhlIGNyZWF0ZWQgY2FsbGJhY2sgd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50c1xuICAgICAqIHRoYXQgY29udGFpbiB0aGUgZXF1aXZhbGVudCBvYmplY3QgcHJvcGVydGllcywgb3RoZXJ3aXNlIGl0IHdpbGwgcmV0dXJuIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHBhcmFtIHsqfSBbZnVuYz1pZGVudGl0eV0gVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBjYWxsYmFjay5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIGNyZWF0ZWQgY2FsbGJhY2suXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthcmdDb3VudF0gVGhlIG51bWJlciBvZiBhcmd1bWVudHMgdGhlIGNhbGxiYWNrIGFjY2VwdHMuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGEgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogLy8gd3JhcCB0byBjcmVhdGUgY3VzdG9tIGNhbGxiYWNrIHNob3J0aGFuZHNcbiAgICAgKiBfLmNyZWF0ZUNhbGxiYWNrID0gXy53cmFwKF8uY3JlYXRlQ2FsbGJhY2ssIGZ1bmN0aW9uKGZ1bmMsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICogICB2YXIgbWF0Y2ggPSAvXiguKz8pX18oW2dsXXQpKC4rKSQvLmV4ZWMoY2FsbGJhY2spO1xuICAgICAqICAgcmV0dXJuICFtYXRjaCA/IGZ1bmMoY2FsbGJhY2ssIHRoaXNBcmcpIDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICogICAgIHJldHVybiBtYXRjaFsyXSA9PSAnZ3QnID8gb2JqZWN0W21hdGNoWzFdXSA+IG1hdGNoWzNdIDogb2JqZWN0W21hdGNoWzFdXSA8IG1hdGNoWzNdO1xuICAgICAqICAgfTtcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIF8uZmlsdGVyKGNoYXJhY3RlcnMsICdhZ2VfX2d0MzgnKTtcbiAgICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwIH1dXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlQ2FsbGJhY2soZnVuYywgdGhpc0FyZywgYXJnQ291bnQpIHtcbiAgICAgIHZhciB0eXBlID0gdHlwZW9mIGZ1bmM7XG4gICAgICBpZiAoZnVuYyA9PSBudWxsIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gYmFzZUNyZWF0ZUNhbGxiYWNrKGZ1bmMsIHRoaXNBcmcsIGFyZ0NvdW50KTtcbiAgICAgIH1cbiAgICAgIC8vIGhhbmRsZSBcIl8ucGx1Y2tcIiBzdHlsZSBjYWxsYmFjayBzaG9ydGhhbmRzXG4gICAgICBpZiAodHlwZSAhPSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gcHJvcGVydHkoZnVuYyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcHMgPSBrZXlzKGZ1bmMpLFxuICAgICAgICAgIGtleSA9IHByb3BzWzBdLFxuICAgICAgICAgIGEgPSBmdW5jW2tleV07XG5cbiAgICAgIC8vIGhhbmRsZSBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjayBzaG9ydGhhbmRzXG4gICAgICBpZiAocHJvcHMubGVuZ3RoID09IDEgJiYgYSA9PT0gYSAmJiAhaXNPYmplY3QoYSkpIHtcbiAgICAgICAgLy8gZmFzdCBwYXRoIHRoZSBjb21tb24gY2FzZSBvZiBwcm92aWRpbmcgYW4gb2JqZWN0IHdpdGggYSBzaW5nbGVcbiAgICAgICAgLy8gcHJvcGVydHkgY29udGFpbmluZyBhIHByaW1pdGl2ZSB2YWx1ZVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgICAgdmFyIGIgPSBvYmplY3Rba2V5XTtcbiAgICAgICAgICByZXR1cm4gYSA9PT0gYiAmJiAoYSAhPT0gMCB8fCAoMSAvIGEgPT0gMSAvIGIpKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgdmFyIGxlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAgIGlmICghKHJlc3VsdCA9IGJhc2VJc0VxdWFsKG9iamVjdFtwcm9wc1tsZW5ndGhdXSwgZnVuY1twcm9wc1tsZW5ndGhdXSwgbnVsbCwgdHJ1ZSkpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgdGhlIGNoYXJhY3RlcnMgYCZgLCBgPGAsIGA+YCwgYFwiYCwgYW5kIGAnYCBpbiBgc3RyaW5nYCB0byB0aGVpclxuICAgICAqIGNvcnJlc3BvbmRpbmcgSFRNTCBlbnRpdGllcy5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gZXNjYXBlLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGVzY2FwZWQgc3RyaW5nLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmVzY2FwZSgnRnJlZCwgV2lsbWEsICYgUGViYmxlcycpO1xuICAgICAqIC8vID0+ICdGcmVkLCBXaWxtYSwgJmFtcDsgUGViYmxlcydcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlc2NhcGUoc3RyaW5nKSB7XG4gICAgICByZXR1cm4gc3RyaW5nID09IG51bGwgPyAnJyA6IFN0cmluZyhzdHJpbmcpLnJlcGxhY2UocmVVbmVzY2FwZWRIdG1sLCBlc2NhcGVIdG1sQ2hhcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgcHJvdmlkZWQgdG8gaXQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIG9iamVjdCA9IHsgJ25hbWUnOiAnZnJlZCcgfTtcbiAgICAgKiBfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdDtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGZ1bmN0aW9uIHByb3BlcnRpZXMgb2YgYSBzb3VyY2Ugb2JqZWN0IHRvIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAgICogSWYgYG9iamVjdGAgaXMgYSBmdW5jdGlvbiBtZXRob2RzIHdpbGwgYmUgYWRkZWQgdG8gaXRzIHByb3RvdHlwZSBhcyB3ZWxsLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fSBbb2JqZWN0PWxvZGFzaF0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IG9mIGZ1bmN0aW9ucyB0byBhZGQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5jaGFpbj10cnVlXSBTcGVjaWZ5IHdoZXRoZXIgdGhlIGZ1bmN0aW9ucyBhZGRlZCBhcmUgY2hhaW5hYmxlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBmdW5jdGlvbiBjYXBpdGFsaXplKHN0cmluZykge1xuICAgICAqICAgcmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuICAgICAqIH1cbiAgICAgKlxuICAgICAqIF8ubWl4aW4oeyAnY2FwaXRhbGl6ZSc6IGNhcGl0YWxpemUgfSk7XG4gICAgICogXy5jYXBpdGFsaXplKCdmcmVkJyk7XG4gICAgICogLy8gPT4gJ0ZyZWQnXG4gICAgICpcbiAgICAgKiBfKCdmcmVkJykuY2FwaXRhbGl6ZSgpLnZhbHVlKCk7XG4gICAgICogLy8gPT4gJ0ZyZWQnXG4gICAgICpcbiAgICAgKiBfLm1peGluKHsgJ2NhcGl0YWxpemUnOiBjYXBpdGFsaXplIH0sIHsgJ2NoYWluJzogZmFsc2UgfSk7XG4gICAgICogXygnZnJlZCcpLmNhcGl0YWxpemUoKTtcbiAgICAgKiAvLyA9PiAnRnJlZCdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtaXhpbihvYmplY3QsIHNvdXJjZSwgb3B0aW9ucykge1xuICAgICAgdmFyIGNoYWluID0gdHJ1ZSxcbiAgICAgICAgICBtZXRob2ROYW1lcyA9IHNvdXJjZSAmJiBmdW5jdGlvbnMoc291cmNlKTtcblxuICAgICAgaWYgKCFzb3VyY2UgfHwgKCFvcHRpb25zICYmICFtZXRob2ROYW1lcy5sZW5ndGgpKSB7XG4gICAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgICBvcHRpb25zID0gc291cmNlO1xuICAgICAgICB9XG4gICAgICAgIGN0b3IgPSBsb2Rhc2hXcmFwcGVyO1xuICAgICAgICBzb3VyY2UgPSBvYmplY3Q7XG4gICAgICAgIG9iamVjdCA9IGxvZGFzaDtcbiAgICAgICAgbWV0aG9kTmFtZXMgPSBmdW5jdGlvbnMoc291cmNlKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zID09PSBmYWxzZSkge1xuICAgICAgICBjaGFpbiA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChpc09iamVjdChvcHRpb25zKSAmJiAnY2hhaW4nIGluIG9wdGlvbnMpIHtcbiAgICAgICAgY2hhaW4gPSBvcHRpb25zLmNoYWluO1xuICAgICAgfVxuICAgICAgdmFyIGN0b3IgPSBvYmplY3QsXG4gICAgICAgICAgaXNGdW5jID0gaXNGdW5jdGlvbihjdG9yKTtcblxuICAgICAgZm9yRWFjaChtZXRob2ROYW1lcywgZnVuY3Rpb24obWV0aG9kTmFtZSkge1xuICAgICAgICB2YXIgZnVuYyA9IG9iamVjdFttZXRob2ROYW1lXSA9IHNvdXJjZVttZXRob2ROYW1lXTtcbiAgICAgICAgaWYgKGlzRnVuYykge1xuICAgICAgICAgIGN0b3IucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2hhaW5BbGwgPSB0aGlzLl9fY2hhaW5fXyxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX193cmFwcGVkX18sXG4gICAgICAgICAgICAgICAgYXJncyA9IFt2YWx1ZV07XG5cbiAgICAgICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KG9iamVjdCwgYXJncyk7XG4gICAgICAgICAgICBpZiAoY2hhaW4gfHwgY2hhaW5BbGwpIHtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSByZXN1bHQgJiYgaXNPYmplY3QocmVzdWx0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBjdG9yKHJlc3VsdCk7XG4gICAgICAgICAgICAgIHJlc3VsdC5fX2NoYWluX18gPSBjaGFpbkFsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV2ZXJ0cyB0aGUgJ18nIHZhcmlhYmxlIHRvIGl0cyBwcmV2aW91cyB2YWx1ZSBhbmQgcmV0dXJucyBhIHJlZmVyZW5jZSB0b1xuICAgICAqIHRoZSBgbG9kYXNoYCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGBsb2Rhc2hgIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgbG9kYXNoID0gXy5ub0NvbmZsaWN0KCk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gbm9Db25mbGljdCgpIHtcbiAgICAgIGNvbnRleHQuXyA9IG9sZERhc2g7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIG5vLW9wZXJhdGlvbiBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIG9iamVjdCA9IHsgJ25hbWUnOiAnZnJlZCcgfTtcbiAgICAgKiBfLm5vb3Aob2JqZWN0KSA9PT0gdW5kZWZpbmVkO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBub29wKCkge1xuICAgICAgLy8gbm8gb3BlcmF0aW9uIHBlcmZvcm1lZFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIFVuaXggZXBvY2hcbiAgICAgKiAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIHN0YW1wID0gXy5ub3coKTtcbiAgICAgKiBfLmRlZmVyKGZ1bmN0aW9uKCkgeyBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApOyB9KTtcbiAgICAgKiAvLyA9PiBsb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBmdW5jdGlvbiB0byBiZSBjYWxsZWRcbiAgICAgKi9cbiAgICB2YXIgbm93ID0gaXNOYXRpdmUobm93ID0gRGF0ZS5ub3cpICYmIG5vdyB8fCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgdGhlIGdpdmVuIHZhbHVlIGludG8gYW4gaW50ZWdlciBvZiB0aGUgc3BlY2lmaWVkIHJhZGl4LlxuICAgICAqIElmIGByYWRpeGAgaXMgYHVuZGVmaW5lZGAgb3IgYDBgIGEgYHJhZGl4YCBvZiBgMTBgIGlzIHVzZWQgdW5sZXNzIHRoZVxuICAgICAqIGB2YWx1ZWAgaXMgYSBoZXhhZGVjaW1hbCwgaW4gd2hpY2ggY2FzZSBhIGByYWRpeGAgb2YgYDE2YCBpcyB1c2VkLlxuICAgICAqXG4gICAgICogTm90ZTogVGhpcyBtZXRob2QgYXZvaWRzIGRpZmZlcmVuY2VzIGluIG5hdGl2ZSBFUzMgYW5kIEVTNSBgcGFyc2VJbnRgXG4gICAgICogaW1wbGVtZW50YXRpb25zLiBTZWUgaHR0cDovL2VzNS5naXRodWIuaW8vI0UuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSB0byBwYXJzZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3JhZGl4XSBUaGUgcmFkaXggdXNlZCB0byBpbnRlcnByZXQgdGhlIHZhbHVlIHRvIHBhcnNlLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG5ldyBpbnRlZ2VyIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnBhcnNlSW50KCcwOCcpO1xuICAgICAqIC8vID0+IDhcbiAgICAgKi9cbiAgICB2YXIgcGFyc2VJbnQgPSBuYXRpdmVQYXJzZUludCh3aGl0ZXNwYWNlICsgJzA4JykgPT0gOCA/IG5hdGl2ZVBhcnNlSW50IDogZnVuY3Rpb24odmFsdWUsIHJhZGl4KSB7XG4gICAgICAvLyBGaXJlZm94IDwgMjEgYW5kIE9wZXJhIDwgMTUgZm9sbG93IHRoZSBFUzMgc3BlY2lmaWVkIGltcGxlbWVudGF0aW9uIG9mIGBwYXJzZUludGBcbiAgICAgIHJldHVybiBuYXRpdmVQYXJzZUludChpc1N0cmluZyh2YWx1ZSkgPyB2YWx1ZS5yZXBsYWNlKHJlTGVhZGluZ1NwYWNlc0FuZFplcm9zLCAnJykgOiB2YWx1ZSwgcmFkaXggfHwgMCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBcIl8ucGx1Y2tcIiBzdHlsZSBmdW5jdGlvbiwgd2hpY2ggcmV0dXJucyB0aGUgYGtleWAgdmFsdWUgb2YgYVxuICAgICAqIGdpdmVuIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0byByZXRyaWV2ZS5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiB2YXIgZ2V0TmFtZSA9IF8ucHJvcGVydHkoJ25hbWUnKTtcbiAgICAgKlxuICAgICAqIF8ubWFwKGNoYXJhY3RlcnMsIGdldE5hbWUpO1xuICAgICAqIC8vID0+IFsnYmFybmV5JywgJ2ZyZWQnXVxuICAgICAqXG4gICAgICogXy5zb3J0QnkoY2hhcmFjdGVycywgZ2V0TmFtZSk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH1dXG4gICAgICovXG4gICAgZnVuY3Rpb24gcHJvcGVydHkoa2V5KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBvYmplY3Rba2V5XTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvZHVjZXMgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gYG1pbmAgYW5kIGBtYXhgIChpbmNsdXNpdmUpLiBJZiBvbmx5IG9uZVxuICAgICAqIGFyZ3VtZW50IGlzIHByb3ZpZGVkIGEgbnVtYmVyIGJldHdlZW4gYDBgIGFuZCB0aGUgZ2l2ZW4gbnVtYmVyIHdpbGwgYmVcbiAgICAgKiByZXR1cm5lZC4gSWYgYGZsb2F0aW5nYCBpcyB0cnVleSBvciBlaXRoZXIgYG1pbmAgb3IgYG1heGAgYXJlIGZsb2F0cyBhXG4gICAgICogZmxvYXRpbmctcG9pbnQgbnVtYmVyIHdpbGwgYmUgcmV0dXJuZWQgaW5zdGVhZCBvZiBhbiBpbnRlZ2VyLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbWluPTBdIFRoZSBtaW5pbXVtIHBvc3NpYmxlIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbWF4PTFdIFRoZSBtYXhpbXVtIHBvc3NpYmxlIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zsb2F0aW5nPWZhbHNlXSBTcGVjaWZ5IHJldHVybmluZyBhIGZsb2F0aW5nLXBvaW50IG51bWJlci5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIGEgcmFuZG9tIG51bWJlci5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5yYW5kb20oMCwgNSk7XG4gICAgICogLy8gPT4gYW4gaW50ZWdlciBiZXR3ZWVuIDAgYW5kIDVcbiAgICAgKlxuICAgICAqIF8ucmFuZG9tKDUpO1xuICAgICAqIC8vID0+IGFsc28gYW4gaW50ZWdlciBiZXR3ZWVuIDAgYW5kIDVcbiAgICAgKlxuICAgICAqIF8ucmFuZG9tKDUsIHRydWUpO1xuICAgICAqIC8vID0+IGEgZmxvYXRpbmctcG9pbnQgbnVtYmVyIGJldHdlZW4gMCBhbmQgNVxuICAgICAqXG4gICAgICogXy5yYW5kb20oMS4yLCA1LjIpO1xuICAgICAqIC8vID0+IGEgZmxvYXRpbmctcG9pbnQgbnVtYmVyIGJldHdlZW4gMS4yIGFuZCA1LjJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByYW5kb20obWluLCBtYXgsIGZsb2F0aW5nKSB7XG4gICAgICB2YXIgbm9NaW4gPSBtaW4gPT0gbnVsbCxcbiAgICAgICAgICBub01heCA9IG1heCA9PSBudWxsO1xuXG4gICAgICBpZiAoZmxvYXRpbmcgPT0gbnVsbCkge1xuICAgICAgICBpZiAodHlwZW9mIG1pbiA9PSAnYm9vbGVhbicgJiYgbm9NYXgpIHtcbiAgICAgICAgICBmbG9hdGluZyA9IG1pbjtcbiAgICAgICAgICBtaW4gPSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFub01heCAmJiB0eXBlb2YgbWF4ID09ICdib29sZWFuJykge1xuICAgICAgICAgIGZsb2F0aW5nID0gbWF4O1xuICAgICAgICAgIG5vTWF4ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG5vTWluICYmIG5vTWF4KSB7XG4gICAgICAgIG1heCA9IDE7XG4gICAgICB9XG4gICAgICBtaW4gPSArbWluIHx8IDA7XG4gICAgICBpZiAobm9NYXgpIHtcbiAgICAgICAgbWF4ID0gbWluO1xuICAgICAgICBtaW4gPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWF4ID0gK21heCB8fCAwO1xuICAgICAgfVxuICAgICAgaWYgKGZsb2F0aW5nIHx8IG1pbiAlIDEgfHwgbWF4ICUgMSkge1xuICAgICAgICB2YXIgcmFuZCA9IG5hdGl2ZVJhbmRvbSgpO1xuICAgICAgICByZXR1cm4gbmF0aXZlTWluKG1pbiArIChyYW5kICogKG1heCAtIG1pbiArIHBhcnNlRmxvYXQoJzFlLScgKyAoKHJhbmQgKycnKS5sZW5ndGggLSAxKSkpKSwgbWF4KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBiYXNlUmFuZG9tKG1pbiwgbWF4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlcyB0aGUgdmFsdWUgb2YgcHJvcGVydHkgYGtleWAgb24gYG9iamVjdGAuIElmIGBrZXlgIGlzIGEgZnVuY3Rpb25cbiAgICAgKiBpdCB3aWxsIGJlIGludm9rZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYG9iamVjdGAgYW5kIGl0cyByZXN1bHQgcmV0dXJuZWQsXG4gICAgICogZWxzZSB0aGUgcHJvcGVydHkgdmFsdWUgaXMgcmV0dXJuZWQuIElmIGBvYmplY3RgIGlzIGZhbHNleSB0aGVuIGB1bmRlZmluZWRgXG4gICAgICogaXMgcmV0dXJuZWQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gcmVzb2x2ZS5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBvYmplY3QgPSB7XG4gICAgICogICAnY2hlZXNlJzogJ2NydW1wZXRzJyxcbiAgICAgKiAgICdzdHVmZic6IGZ1bmN0aW9uKCkge1xuICAgICAqICAgICByZXR1cm4gJ25vbnNlbnNlJztcbiAgICAgKiAgIH1cbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy5yZXN1bHQob2JqZWN0LCAnY2hlZXNlJyk7XG4gICAgICogLy8gPT4gJ2NydW1wZXRzJ1xuICAgICAqXG4gICAgICogXy5yZXN1bHQob2JqZWN0LCAnc3R1ZmYnKTtcbiAgICAgKiAvLyA9PiAnbm9uc2Vuc2UnXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVzdWx0KG9iamVjdCwga2V5KSB7XG4gICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgICAgICByZXR1cm4gaXNGdW5jdGlvbih2YWx1ZSkgPyBvYmplY3Rba2V5XSgpIDogdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBtaWNyby10ZW1wbGF0aW5nIG1ldGhvZCB0aGF0IGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlc1xuICAgICAqIHdoaXRlc3BhY2UsIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICAgICAqXG4gICAgICogTm90ZTogSW4gdGhlIGRldmVsb3BtZW50IGJ1aWxkLCBgXy50ZW1wbGF0ZWAgdXRpbGl6ZXMgc291cmNlVVJMcyBmb3IgZWFzaWVyXG4gICAgICogZGVidWdnaW5nLiBTZWUgaHR0cDovL3d3dy5odG1sNXJvY2tzLmNvbS9lbi90dXRvcmlhbHMvZGV2ZWxvcGVydG9vbHMvc291cmNlbWFwcy8jdG9jLXNvdXJjZXVybFxuICAgICAqXG4gICAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gcHJlY29tcGlsaW5nIHRlbXBsYXRlcyBzZWU6XG4gICAgICogaHR0cDovL2xvZGFzaC5jb20vY3VzdG9tLWJ1aWxkc1xuICAgICAqXG4gICAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gQ2hyb21lIGV4dGVuc2lvbiBzYW5kYm94ZXMgc2VlOlxuICAgICAqIGh0dHA6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9zdGFibGUvZXh0ZW5zaW9ucy9zYW5kYm94aW5nRXZhbC5odG1sXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRlbXBsYXRlIHRleHQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgVGhlIGRhdGEgb2JqZWN0IHVzZWQgdG8gcG9wdWxhdGUgdGhlIHRleHQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHBhcmFtIHtSZWdFeHB9IFtvcHRpb25zLmVzY2FwZV0gVGhlIFwiZXNjYXBlXCIgZGVsaW1pdGVyLlxuICAgICAqIEBwYXJhbSB7UmVnRXhwfSBbb3B0aW9ucy5ldmFsdWF0ZV0gVGhlIFwiZXZhbHVhdGVcIiBkZWxpbWl0ZXIuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmltcG9ydHNdIEFuIG9iamVjdCB0byBpbXBvcnQgaW50byB0aGUgdGVtcGxhdGUgYXMgbG9jYWwgdmFyaWFibGVzLlxuICAgICAqIEBwYXJhbSB7UmVnRXhwfSBbb3B0aW9ucy5pbnRlcnBvbGF0ZV0gVGhlIFwiaW50ZXJwb2xhdGVcIiBkZWxpbWl0ZXIuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtzb3VyY2VVUkxdIFRoZSBzb3VyY2VVUkwgb2YgdGhlIHRlbXBsYXRlJ3MgY29tcGlsZWQgc291cmNlLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFyaWFibGVdIFRoZSBkYXRhIG9iamVjdCB2YXJpYWJsZSBuYW1lLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbnxzdHJpbmd9IFJldHVybnMgYSBjb21waWxlZCBmdW5jdGlvbiB3aGVuIG5vIGBkYXRhYCBvYmplY3RcbiAgICAgKiAgaXMgZ2l2ZW4sIGVsc2UgaXQgcmV0dXJucyB0aGUgaW50ZXJwb2xhdGVkIHRleHQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIHRoZSBcImludGVycG9sYXRlXCIgZGVsaW1pdGVyIHRvIGNyZWF0ZSBhIGNvbXBpbGVkIHRlbXBsYXRlXG4gICAgICogdmFyIGNvbXBpbGVkID0gXy50ZW1wbGF0ZSgnaGVsbG8gPCU9IG5hbWUgJT4nKTtcbiAgICAgKiBjb21waWxlZCh7ICduYW1lJzogJ2ZyZWQnIH0pO1xuICAgICAqIC8vID0+ICdoZWxsbyBmcmVkJ1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgdGhlIFwiZXNjYXBlXCIgZGVsaW1pdGVyIHRvIGVzY2FwZSBIVE1MIGluIGRhdGEgcHJvcGVydHkgdmFsdWVzXG4gICAgICogXy50ZW1wbGF0ZSgnPGI+PCUtIHZhbHVlICU+PC9iPicsIHsgJ3ZhbHVlJzogJzxzY3JpcHQ+JyB9KTtcbiAgICAgKiAvLyA9PiAnPGI+Jmx0O3NjcmlwdCZndDs8L2I+J1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgdGhlIFwiZXZhbHVhdGVcIiBkZWxpbWl0ZXIgdG8gZ2VuZXJhdGUgSFRNTFxuICAgICAqIHZhciBsaXN0ID0gJzwlIF8uZm9yRWFjaChwZW9wbGUsIGZ1bmN0aW9uKG5hbWUpIHsgJT48bGk+PCUtIG5hbWUgJT48L2xpPjwlIH0pOyAlPic7XG4gICAgICogXy50ZW1wbGF0ZShsaXN0LCB7ICdwZW9wbGUnOiBbJ2ZyZWQnLCAnYmFybmV5J10gfSk7XG4gICAgICogLy8gPT4gJzxsaT5mcmVkPC9saT48bGk+YmFybmV5PC9saT4nXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyB0aGUgRVM2IGRlbGltaXRlciBhcyBhbiBhbHRlcm5hdGl2ZSB0byB0aGUgZGVmYXVsdCBcImludGVycG9sYXRlXCIgZGVsaW1pdGVyXG4gICAgICogXy50ZW1wbGF0ZSgnaGVsbG8gJHsgbmFtZSB9JywgeyAnbmFtZSc6ICdwZWJibGVzJyB9KTtcbiAgICAgKiAvLyA9PiAnaGVsbG8gcGViYmxlcydcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIHRoZSBpbnRlcm5hbCBgcHJpbnRgIGZ1bmN0aW9uIGluIFwiZXZhbHVhdGVcIiBkZWxpbWl0ZXJzXG4gICAgICogXy50ZW1wbGF0ZSgnPCUgcHJpbnQoXCJoZWxsbyBcIiArIG5hbWUpOyAlPiEnLCB7ICduYW1lJzogJ2Jhcm5leScgfSk7XG4gICAgICogLy8gPT4gJ2hlbGxvIGJhcm5leSEnXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBhIGN1c3RvbSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzXG4gICAgICogXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgICAqICAgJ2ludGVycG9sYXRlJzogL3t7KFtcXHNcXFNdKz8pfX0vZ1xuICAgICAqIH07XG4gICAgICpcbiAgICAgKiBfLnRlbXBsYXRlKCdoZWxsbyB7eyBuYW1lIH19IScsIHsgJ25hbWUnOiAnbXVzdGFjaGUnIH0pO1xuICAgICAqIC8vID0+ICdoZWxsbyBtdXN0YWNoZSEnXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyB0aGUgYGltcG9ydHNgIG9wdGlvbiB0byBpbXBvcnQgalF1ZXJ5XG4gICAgICogdmFyIGxpc3QgPSAnPCUganEuZWFjaChwZW9wbGUsIGZ1bmN0aW9uKG5hbWUpIHsgJT48bGk+PCUtIG5hbWUgJT48L2xpPjwlIH0pOyAlPic7XG4gICAgICogXy50ZW1wbGF0ZShsaXN0LCB7ICdwZW9wbGUnOiBbJ2ZyZWQnLCAnYmFybmV5J10gfSwgeyAnaW1wb3J0cyc6IHsgJ2pxJzogalF1ZXJ5IH0gfSk7XG4gICAgICogLy8gPT4gJzxsaT5mcmVkPC9saT48bGk+YmFybmV5PC9saT4nXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyB0aGUgYHNvdXJjZVVSTGAgb3B0aW9uIHRvIHNwZWNpZnkgYSBjdXN0b20gc291cmNlVVJMIGZvciB0aGUgdGVtcGxhdGVcbiAgICAgKiB2YXIgY29tcGlsZWQgPSBfLnRlbXBsYXRlKCdoZWxsbyA8JT0gbmFtZSAlPicsIG51bGwsIHsgJ3NvdXJjZVVSTCc6ICcvYmFzaWMvZ3JlZXRpbmcuanN0JyB9KTtcbiAgICAgKiBjb21waWxlZChkYXRhKTtcbiAgICAgKiAvLyA9PiBmaW5kIHRoZSBzb3VyY2Ugb2YgXCJncmVldGluZy5qc3RcIiB1bmRlciB0aGUgU291cmNlcyB0YWIgb3IgUmVzb3VyY2VzIHBhbmVsIG9mIHRoZSB3ZWIgaW5zcGVjdG9yXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyB0aGUgYHZhcmlhYmxlYCBvcHRpb24gdG8gZW5zdXJlIGEgd2l0aC1zdGF0ZW1lbnQgaXNuJ3QgdXNlZCBpbiB0aGUgY29tcGlsZWQgdGVtcGxhdGVcbiAgICAgKiB2YXIgY29tcGlsZWQgPSBfLnRlbXBsYXRlKCdoaSA8JT0gZGF0YS5uYW1lICU+IScsIG51bGwsIHsgJ3ZhcmlhYmxlJzogJ2RhdGEnIH0pO1xuICAgICAqIGNvbXBpbGVkLnNvdXJjZTtcbiAgICAgKiAvLyA9PiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICogICB2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGU7XG4gICAgICogICBfX3AgKz0gJ2hpICcgKyAoKF9fdCA9ICggZGF0YS5uYW1lICkpID09IG51bGwgPyAnJyA6IF9fdCkgKyAnISc7XG4gICAgICogICByZXR1cm4gX19wO1xuICAgICAqIH1cbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIHRoZSBgc291cmNlYCBwcm9wZXJ0eSB0byBpbmxpbmUgY29tcGlsZWQgdGVtcGxhdGVzIGZvciBtZWFuaW5nZnVsXG4gICAgICogLy8gbGluZSBudW1iZXJzIGluIGVycm9yIG1lc3NhZ2VzIGFuZCBhIHN0YWNrIHRyYWNlXG4gICAgICogZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oY3dkLCAnanN0LmpzJyksICdcXFxuICAgICAqICAgdmFyIEpTVCA9IHtcXFxuICAgICAqICAgICBcIm1haW5cIjogJyArIF8udGVtcGxhdGUobWFpblRleHQpLnNvdXJjZSArICdcXFxuICAgICAqICAgfTtcXFxuICAgICAqICcpO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKHRleHQsIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgIC8vIGJhc2VkIG9uIEpvaG4gUmVzaWcncyBgdG1wbGAgaW1wbGVtZW50YXRpb25cbiAgICAgIC8vIGh0dHA6Ly9lam9obi5vcmcvYmxvZy9qYXZhc2NyaXB0LW1pY3JvLXRlbXBsYXRpbmcvXG4gICAgICAvLyBhbmQgTGF1cmEgRG9rdG9yb3ZhJ3MgZG9ULmpzXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vb2xhZG8vZG9UXG4gICAgICB2YXIgc2V0dGluZ3MgPSBsb2Rhc2gudGVtcGxhdGVTZXR0aW5ncztcbiAgICAgIHRleHQgPSBTdHJpbmcodGV4dCB8fCAnJyk7XG5cbiAgICAgIC8vIGF2b2lkIG1pc3NpbmcgZGVwZW5kZW5jaWVzIHdoZW4gYGl0ZXJhdG9yVGVtcGxhdGVgIGlzIG5vdCBkZWZpbmVkXG4gICAgICBvcHRpb25zID0gZGVmYXVsdHMoe30sIG9wdGlvbnMsIHNldHRpbmdzKTtcblxuICAgICAgdmFyIGltcG9ydHMgPSBkZWZhdWx0cyh7fSwgb3B0aW9ucy5pbXBvcnRzLCBzZXR0aW5ncy5pbXBvcnRzKSxcbiAgICAgICAgICBpbXBvcnRzS2V5cyA9IGtleXMoaW1wb3J0cyksXG4gICAgICAgICAgaW1wb3J0c1ZhbHVlcyA9IHZhbHVlcyhpbXBvcnRzKTtcblxuICAgICAgdmFyIGlzRXZhbHVhdGluZyxcbiAgICAgICAgICBpbmRleCA9IDAsXG4gICAgICAgICAgaW50ZXJwb2xhdGUgPSBvcHRpb25zLmludGVycG9sYXRlIHx8IHJlTm9NYXRjaCxcbiAgICAgICAgICBzb3VyY2UgPSBcIl9fcCArPSAnXCI7XG5cbiAgICAgIC8vIGNvbXBpbGUgdGhlIHJlZ2V4cCB0byBtYXRjaCBlYWNoIGRlbGltaXRlclxuICAgICAgdmFyIHJlRGVsaW1pdGVycyA9IFJlZ0V4cChcbiAgICAgICAgKG9wdGlvbnMuZXNjYXBlIHx8IHJlTm9NYXRjaCkuc291cmNlICsgJ3wnICtcbiAgICAgICAgaW50ZXJwb2xhdGUuc291cmNlICsgJ3wnICtcbiAgICAgICAgKGludGVycG9sYXRlID09PSByZUludGVycG9sYXRlID8gcmVFc1RlbXBsYXRlIDogcmVOb01hdGNoKS5zb3VyY2UgKyAnfCcgK1xuICAgICAgICAob3B0aW9ucy5ldmFsdWF0ZSB8fCByZU5vTWF0Y2gpLnNvdXJjZSArICd8JCdcbiAgICAgICwgJ2cnKTtcblxuICAgICAgdGV4dC5yZXBsYWNlKHJlRGVsaW1pdGVycywgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZVZhbHVlLCBpbnRlcnBvbGF0ZVZhbHVlLCBlc1RlbXBsYXRlVmFsdWUsIGV2YWx1YXRlVmFsdWUsIG9mZnNldCkge1xuICAgICAgICBpbnRlcnBvbGF0ZVZhbHVlIHx8IChpbnRlcnBvbGF0ZVZhbHVlID0gZXNUZW1wbGF0ZVZhbHVlKTtcblxuICAgICAgICAvLyBlc2NhcGUgY2hhcmFjdGVycyB0aGF0IGNhbm5vdCBiZSBpbmNsdWRlZCBpbiBzdHJpbmcgbGl0ZXJhbHNcbiAgICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldCkucmVwbGFjZShyZVVuZXNjYXBlZFN0cmluZywgZXNjYXBlU3RyaW5nQ2hhcik7XG5cbiAgICAgICAgLy8gcmVwbGFjZSBkZWxpbWl0ZXJzIHdpdGggc25pcHBldHNcbiAgICAgICAgaWYgKGVzY2FwZVZhbHVlKSB7XG4gICAgICAgICAgc291cmNlICs9IFwiJyArXFxuX19lKFwiICsgZXNjYXBlVmFsdWUgKyBcIikgK1xcbidcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZhbHVhdGVWYWx1ZSkge1xuICAgICAgICAgIGlzRXZhbHVhdGluZyA9IHRydWU7XG4gICAgICAgICAgc291cmNlICs9IFwiJztcXG5cIiArIGV2YWx1YXRlVmFsdWUgKyBcIjtcXG5fX3AgKz0gJ1wiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnRlcnBvbGF0ZVZhbHVlKSB7XG4gICAgICAgICAgc291cmNlICs9IFwiJyArXFxuKChfX3QgPSAoXCIgKyBpbnRlcnBvbGF0ZVZhbHVlICsgXCIpKSA9PSBudWxsID8gJycgOiBfX3QpICtcXG4nXCI7XG4gICAgICAgIH1cbiAgICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG5cbiAgICAgICAgLy8gdGhlIEpTIGVuZ2luZSBlbWJlZGRlZCBpbiBBZG9iZSBwcm9kdWN0cyByZXF1aXJlcyByZXR1cm5pbmcgdGhlIGBtYXRjaGBcbiAgICAgICAgLy8gc3RyaW5nIGluIG9yZGVyIHRvIHByb2R1Y2UgdGhlIGNvcnJlY3QgYG9mZnNldGAgdmFsdWVcbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgfSk7XG5cbiAgICAgIHNvdXJjZSArPSBcIic7XFxuXCI7XG5cbiAgICAgIC8vIGlmIGB2YXJpYWJsZWAgaXMgbm90IHNwZWNpZmllZCwgd3JhcCBhIHdpdGgtc3RhdGVtZW50IGFyb3VuZCB0aGUgZ2VuZXJhdGVkXG4gICAgICAvLyBjb2RlIHRvIGFkZCB0aGUgZGF0YSBvYmplY3QgdG8gdGhlIHRvcCBvZiB0aGUgc2NvcGUgY2hhaW5cbiAgICAgIHZhciB2YXJpYWJsZSA9IG9wdGlvbnMudmFyaWFibGUsXG4gICAgICAgICAgaGFzVmFyaWFibGUgPSB2YXJpYWJsZTtcblxuICAgICAgaWYgKCFoYXNWYXJpYWJsZSkge1xuICAgICAgICB2YXJpYWJsZSA9ICdvYmonO1xuICAgICAgICBzb3VyY2UgPSAnd2l0aCAoJyArIHZhcmlhYmxlICsgJykge1xcbicgKyBzb3VyY2UgKyAnXFxufVxcbic7XG4gICAgICB9XG4gICAgICAvLyBjbGVhbnVwIGNvZGUgYnkgc3RyaXBwaW5nIGVtcHR5IHN0cmluZ3NcbiAgICAgIHNvdXJjZSA9IChpc0V2YWx1YXRpbmcgPyBzb3VyY2UucmVwbGFjZShyZUVtcHR5U3RyaW5nTGVhZGluZywgJycpIDogc291cmNlKVxuICAgICAgICAucmVwbGFjZShyZUVtcHR5U3RyaW5nTWlkZGxlLCAnJDEnKVxuICAgICAgICAucmVwbGFjZShyZUVtcHR5U3RyaW5nVHJhaWxpbmcsICckMTsnKTtcblxuICAgICAgLy8gZnJhbWUgY29kZSBhcyB0aGUgZnVuY3Rpb24gYm9keVxuICAgICAgc291cmNlID0gJ2Z1bmN0aW9uKCcgKyB2YXJpYWJsZSArICcpIHtcXG4nICtcbiAgICAgICAgKGhhc1ZhcmlhYmxlID8gJycgOiB2YXJpYWJsZSArICcgfHwgKCcgKyB2YXJpYWJsZSArICcgPSB7fSk7XFxuJykgK1xuICAgICAgICBcInZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZVwiICtcbiAgICAgICAgKGlzRXZhbHVhdGluZ1xuICAgICAgICAgID8gJywgX19qID0gQXJyYXkucHJvdG90eXBlLmpvaW47XFxuJyArXG4gICAgICAgICAgICBcImZ1bmN0aW9uIHByaW50KCkgeyBfX3AgKz0gX19qLmNhbGwoYXJndW1lbnRzLCAnJykgfVxcblwiXG4gICAgICAgICAgOiAnO1xcbidcbiAgICAgICAgKSArXG4gICAgICAgIHNvdXJjZSArXG4gICAgICAgICdyZXR1cm4gX19wXFxufSc7XG5cbiAgICAgIC8vIFVzZSBhIHNvdXJjZVVSTCBmb3IgZWFzaWVyIGRlYnVnZ2luZy5cbiAgICAgIC8vIGh0dHA6Ly93d3cuaHRtbDVyb2Nrcy5jb20vZW4vdHV0b3JpYWxzL2RldmVsb3BlcnRvb2xzL3NvdXJjZW1hcHMvI3RvYy1zb3VyY2V1cmxcbiAgICAgIHZhciBzb3VyY2VVUkwgPSAnXFxuLypcXG4vLyMgc291cmNlVVJMPScgKyAob3B0aW9ucy5zb3VyY2VVUkwgfHwgJy9sb2Rhc2gvdGVtcGxhdGUvc291cmNlWycgKyAodGVtcGxhdGVDb3VudGVyKyspICsgJ10nKSArICdcXG4qLyc7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBGdW5jdGlvbihpbXBvcnRzS2V5cywgJ3JldHVybiAnICsgc291cmNlICsgc291cmNlVVJMKS5hcHBseSh1bmRlZmluZWQsIGltcG9ydHNWYWx1ZXMpO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGUuc291cmNlID0gc291cmNlO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdChkYXRhKTtcbiAgICAgIH1cbiAgICAgIC8vIHByb3ZpZGUgdGhlIGNvbXBpbGVkIGZ1bmN0aW9uJ3Mgc291cmNlIGJ5IGl0cyBgdG9TdHJpbmdgIG1ldGhvZCwgaW5cbiAgICAgIC8vIHN1cHBvcnRlZCBlbnZpcm9ubWVudHMsIG9yIHRoZSBgc291cmNlYCBwcm9wZXJ0eSBhcyBhIGNvbnZlbmllbmNlIGZvclxuICAgICAgLy8gaW5saW5pbmcgY29tcGlsZWQgdGVtcGxhdGVzIGR1cmluZyB0aGUgYnVpbGQgcHJvY2Vzc1xuICAgICAgcmVzdWx0LnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgdGhlIGNhbGxiYWNrIGBuYCB0aW1lcywgcmV0dXJuaW5nIGFuIGFycmF5IG9mIHRoZSByZXN1bHRzXG4gICAgICogb2YgZWFjaCBjYWxsYmFjayBleGVjdXRpb24uIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWRcbiAgICAgKiB3aXRoIG9uZSBhcmd1bWVudDsgKGluZGV4KS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGV4ZWN1dGUgdGhlIGNhbGxiYWNrLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgdGhlIHJlc3VsdHMgb2YgZWFjaCBgY2FsbGJhY2tgIGV4ZWN1dGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGRpY2VSb2xscyA9IF8udGltZXMoMywgXy5wYXJ0aWFsKF8ucmFuZG9tLCAxLCA2KSk7XG4gICAgICogLy8gPT4gWzMsIDYsIDRdXG4gICAgICpcbiAgICAgKiBfLnRpbWVzKDMsIGZ1bmN0aW9uKG4pIHsgbWFnZS5jYXN0U3BlbGwobik7IH0pO1xuICAgICAqIC8vID0+IGNhbGxzIGBtYWdlLmNhc3RTcGVsbChuKWAgdGhyZWUgdGltZXMsIHBhc3NpbmcgYG5gIG9mIGAwYCwgYDFgLCBhbmQgYDJgIHJlc3BlY3RpdmVseVxuICAgICAqXG4gICAgICogXy50aW1lcygzLCBmdW5jdGlvbihuKSB7IHRoaXMuY2FzdChuKTsgfSwgbWFnZSk7XG4gICAgICogLy8gPT4gYWxzbyBjYWxscyBgbWFnZS5jYXN0U3BlbGwobilgIHRocmVlIHRpbWVzXG4gICAgICovXG4gICAgZnVuY3Rpb24gdGltZXMobiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIG4gPSAobiA9ICtuKSA+IC0xID8gbiA6IDA7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICAgICAgY2FsbGJhY2sgPSBiYXNlQ3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDEpO1xuICAgICAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBjYWxsYmFjayhpbmRleCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBpbnZlcnNlIG9mIGBfLmVzY2FwZWAgdGhpcyBtZXRob2QgY29udmVydHMgdGhlIEhUTUwgZW50aXRpZXNcbiAgICAgKiBgJmFtcDtgLCBgJmx0O2AsIGAmZ3Q7YCwgYCZxdW90O2AsIGFuZCBgJiMzOTtgIGluIGBzdHJpbmdgIHRvIHRoZWlyXG4gICAgICogY29ycmVzcG9uZGluZyBjaGFyYWN0ZXJzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byB1bmVzY2FwZS5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSB1bmVzY2FwZWQgc3RyaW5nLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnVuZXNjYXBlKCdGcmVkLCBCYXJuZXkgJmFtcDsgUGViYmxlcycpO1xuICAgICAqIC8vID0+ICdGcmVkLCBCYXJuZXkgJiBQZWJibGVzJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVuZXNjYXBlKHN0cmluZykge1xuICAgICAgcmV0dXJuIHN0cmluZyA9PSBudWxsID8gJycgOiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKHJlRXNjYXBlZEh0bWwsIHVuZXNjYXBlSHRtbENoYXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyBhIHVuaXF1ZSBJRC4gSWYgYHByZWZpeGAgaXMgcHJvdmlkZWQgdGhlIElEIHdpbGwgYmUgYXBwZW5kZWQgdG8gaXQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtwcmVmaXhdIFRoZSB2YWx1ZSB0byBwcmVmaXggdGhlIElEIHdpdGguXG4gICAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdW5pcXVlIElELlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnVuaXF1ZUlkKCdjb250YWN0XycpO1xuICAgICAqIC8vID0+ICdjb250YWN0XzEwNCdcbiAgICAgKlxuICAgICAqIF8udW5pcXVlSWQoKTtcbiAgICAgKiAvLyA9PiAnMTA1J1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVuaXF1ZUlkKHByZWZpeCkge1xuICAgICAgdmFyIGlkID0gKytpZENvdW50ZXI7XG4gICAgICByZXR1cm4gU3RyaW5nKHByZWZpeCA9PSBudWxsID8gJycgOiBwcmVmaXgpICsgaWQ7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgYGxvZGFzaGAgb2JqZWN0IHRoYXQgd3JhcHMgdGhlIGdpdmVuIHZhbHVlIHdpdGggZXhwbGljaXRcbiAgICAgKiBtZXRob2QgY2hhaW5pbmcgZW5hYmxlZC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDaGFpbmluZ1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHdyYXAuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgd3JhcHBlciBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAgJ2FnZSc6IDM2IH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICAnYWdlJzogNDAgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAncGViYmxlcycsICdhZ2UnOiAxIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogdmFyIHlvdW5nZXN0ID0gXy5jaGFpbihjaGFyYWN0ZXJzKVxuICAgICAqICAgICAuc29ydEJ5KCdhZ2UnKVxuICAgICAqICAgICAubWFwKGZ1bmN0aW9uKGNocikgeyByZXR1cm4gY2hyLm5hbWUgKyAnIGlzICcgKyBjaHIuYWdlOyB9KVxuICAgICAqICAgICAuZmlyc3QoKVxuICAgICAqICAgICAudmFsdWUoKTtcbiAgICAgKiAvLyA9PiAncGViYmxlcyBpcyAxJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNoYWluKHZhbHVlKSB7XG4gICAgICB2YWx1ZSA9IG5ldyBsb2Rhc2hXcmFwcGVyKHZhbHVlKTtcbiAgICAgIHZhbHVlLl9fY2hhaW5fXyA9IHRydWU7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyBgaW50ZXJjZXB0b3JgIHdpdGggdGhlIGB2YWx1ZWAgYXMgdGhlIGZpcnN0IGFyZ3VtZW50IGFuZCB0aGVuXG4gICAgICogcmV0dXJucyBgdmFsdWVgLiBUaGUgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2RcbiAgICAgKiBjaGFpbiBpbiBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluXG4gICAgICogdGhlIGNoYWluLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENoYWluaW5nXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvdmlkZSB0byBgaW50ZXJjZXB0b3JgLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGludGVyY2VwdG9yIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXyhbMSwgMiwgMywgNF0pXG4gICAgICogIC50YXAoZnVuY3Rpb24oYXJyYXkpIHsgYXJyYXkucG9wKCk7IH0pXG4gICAgICogIC5yZXZlcnNlKClcbiAgICAgKiAgLnZhbHVlKCk7XG4gICAgICogLy8gPT4gWzMsIDIsIDFdXG4gICAgICovXG4gICAgZnVuY3Rpb24gdGFwKHZhbHVlLCBpbnRlcmNlcHRvcikge1xuICAgICAgaW50ZXJjZXB0b3IodmFsdWUpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVuYWJsZXMgZXhwbGljaXQgbWV0aG9kIGNoYWluaW5nIG9uIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBuYW1lIGNoYWluXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ2hhaW5pbmdcbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgd3JhcHBlciBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogLy8gd2l0aG91dCBleHBsaWNpdCBjaGFpbmluZ1xuICAgICAqIF8oY2hhcmFjdGVycykuZmlyc3QoKTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gICAgICpcbiAgICAgKiAvLyB3aXRoIGV4cGxpY2l0IGNoYWluaW5nXG4gICAgICogXyhjaGFyYWN0ZXJzKS5jaGFpbigpXG4gICAgICogICAuZmlyc3QoKVxuICAgICAqICAgLnBpY2soJ2FnZScpXG4gICAgICogICAudmFsdWUoKTtcbiAgICAgKiAvLyA9PiB7ICdhZ2UnOiAzNiB9XG4gICAgICovXG4gICAgZnVuY3Rpb24gd3JhcHBlckNoYWluKCkge1xuICAgICAgdGhpcy5fX2NoYWluX18gPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvZHVjZXMgdGhlIGB0b1N0cmluZ2AgcmVzdWx0IG9mIHRoZSB3cmFwcGVkIHZhbHVlLlxuICAgICAqXG4gICAgICogQG5hbWUgdG9TdHJpbmdcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDaGFpbmluZ1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZyByZXN1bHQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8oWzEsIDIsIDNdKS50b1N0cmluZygpO1xuICAgICAqIC8vID0+ICcxLDIsMydcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB3cmFwcGVyVG9TdHJpbmcoKSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHRoaXMuX193cmFwcGVkX18pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3RzIHRoZSB3cmFwcGVkIHZhbHVlLlxuICAgICAqXG4gICAgICogQG5hbWUgdmFsdWVPZlxuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIHZhbHVlXG4gICAgICogQGNhdGVnb3J5IENoYWluaW5nXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHdyYXBwZWQgdmFsdWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8oWzEsIDIsIDNdKS52YWx1ZU9mKCk7XG4gICAgICogLy8gPT4gWzEsIDIsIDNdXG4gICAgICovXG4gICAgZnVuY3Rpb24gd3JhcHBlclZhbHVlT2YoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX3dyYXBwZWRfXztcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8vIGFkZCBmdW5jdGlvbnMgdGhhdCByZXR1cm4gd3JhcHBlZCB2YWx1ZXMgd2hlbiBjaGFpbmluZ1xuICAgIGxvZGFzaC5hZnRlciA9IGFmdGVyO1xuICAgIGxvZGFzaC5hc3NpZ24gPSBhc3NpZ247XG4gICAgbG9kYXNoLmF0ID0gYXQ7XG4gICAgbG9kYXNoLmJpbmQgPSBiaW5kO1xuICAgIGxvZGFzaC5iaW5kQWxsID0gYmluZEFsbDtcbiAgICBsb2Rhc2guYmluZEtleSA9IGJpbmRLZXk7XG4gICAgbG9kYXNoLmNoYWluID0gY2hhaW47XG4gICAgbG9kYXNoLmNvbXBhY3QgPSBjb21wYWN0O1xuICAgIGxvZGFzaC5jb21wb3NlID0gY29tcG9zZTtcbiAgICBsb2Rhc2guY29uc3RhbnQgPSBjb25zdGFudDtcbiAgICBsb2Rhc2guY291bnRCeSA9IGNvdW50Qnk7XG4gICAgbG9kYXNoLmNyZWF0ZSA9IGNyZWF0ZTtcbiAgICBsb2Rhc2guY3JlYXRlQ2FsbGJhY2sgPSBjcmVhdGVDYWxsYmFjaztcbiAgICBsb2Rhc2guY3VycnkgPSBjdXJyeTtcbiAgICBsb2Rhc2guZGVib3VuY2UgPSBkZWJvdW5jZTtcbiAgICBsb2Rhc2guZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICBsb2Rhc2guZGVmZXIgPSBkZWZlcjtcbiAgICBsb2Rhc2guZGVsYXkgPSBkZWxheTtcbiAgICBsb2Rhc2guZGlmZmVyZW5jZSA9IGRpZmZlcmVuY2U7XG4gICAgbG9kYXNoLmZpbHRlciA9IGZpbHRlcjtcbiAgICBsb2Rhc2guZmxhdHRlbiA9IGZsYXR0ZW47XG4gICAgbG9kYXNoLmZvckVhY2ggPSBmb3JFYWNoO1xuICAgIGxvZGFzaC5mb3JFYWNoUmlnaHQgPSBmb3JFYWNoUmlnaHQ7XG4gICAgbG9kYXNoLmZvckluID0gZm9ySW47XG4gICAgbG9kYXNoLmZvckluUmlnaHQgPSBmb3JJblJpZ2h0O1xuICAgIGxvZGFzaC5mb3JPd24gPSBmb3JPd247XG4gICAgbG9kYXNoLmZvck93blJpZ2h0ID0gZm9yT3duUmlnaHQ7XG4gICAgbG9kYXNoLmZ1bmN0aW9ucyA9IGZ1bmN0aW9ucztcbiAgICBsb2Rhc2guZ3JvdXBCeSA9IGdyb3VwQnk7XG4gICAgbG9kYXNoLmluZGV4QnkgPSBpbmRleEJ5O1xuICAgIGxvZGFzaC5pbml0aWFsID0gaW5pdGlhbDtcbiAgICBsb2Rhc2guaW50ZXJzZWN0aW9uID0gaW50ZXJzZWN0aW9uO1xuICAgIGxvZGFzaC5pbnZlcnQgPSBpbnZlcnQ7XG4gICAgbG9kYXNoLmludm9rZSA9IGludm9rZTtcbiAgICBsb2Rhc2gua2V5cyA9IGtleXM7XG4gICAgbG9kYXNoLm1hcCA9IG1hcDtcbiAgICBsb2Rhc2gubWFwVmFsdWVzID0gbWFwVmFsdWVzO1xuICAgIGxvZGFzaC5tYXggPSBtYXg7XG4gICAgbG9kYXNoLm1lbW9pemUgPSBtZW1vaXplO1xuICAgIGxvZGFzaC5tZXJnZSA9IG1lcmdlO1xuICAgIGxvZGFzaC5taW4gPSBtaW47XG4gICAgbG9kYXNoLm9taXQgPSBvbWl0O1xuICAgIGxvZGFzaC5vbmNlID0gb25jZTtcbiAgICBsb2Rhc2gucGFpcnMgPSBwYWlycztcbiAgICBsb2Rhc2gucGFydGlhbCA9IHBhcnRpYWw7XG4gICAgbG9kYXNoLnBhcnRpYWxSaWdodCA9IHBhcnRpYWxSaWdodDtcbiAgICBsb2Rhc2gucGljayA9IHBpY2s7XG4gICAgbG9kYXNoLnBsdWNrID0gcGx1Y2s7XG4gICAgbG9kYXNoLnByb3BlcnR5ID0gcHJvcGVydHk7XG4gICAgbG9kYXNoLnB1bGwgPSBwdWxsO1xuICAgIGxvZGFzaC5yYW5nZSA9IHJhbmdlO1xuICAgIGxvZGFzaC5yZWplY3QgPSByZWplY3Q7XG4gICAgbG9kYXNoLnJlbW92ZSA9IHJlbW92ZTtcbiAgICBsb2Rhc2gucmVzdCA9IHJlc3Q7XG4gICAgbG9kYXNoLnNodWZmbGUgPSBzaHVmZmxlO1xuICAgIGxvZGFzaC5zb3J0QnkgPSBzb3J0Qnk7XG4gICAgbG9kYXNoLnRhcCA9IHRhcDtcbiAgICBsb2Rhc2gudGhyb3R0bGUgPSB0aHJvdHRsZTtcbiAgICBsb2Rhc2gudGltZXMgPSB0aW1lcztcbiAgICBsb2Rhc2gudG9BcnJheSA9IHRvQXJyYXk7XG4gICAgbG9kYXNoLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcbiAgICBsb2Rhc2gudW5pb24gPSB1bmlvbjtcbiAgICBsb2Rhc2gudW5pcSA9IHVuaXE7XG4gICAgbG9kYXNoLnZhbHVlcyA9IHZhbHVlcztcbiAgICBsb2Rhc2gud2hlcmUgPSB3aGVyZTtcbiAgICBsb2Rhc2gud2l0aG91dCA9IHdpdGhvdXQ7XG4gICAgbG9kYXNoLndyYXAgPSB3cmFwO1xuICAgIGxvZGFzaC54b3IgPSB4b3I7XG4gICAgbG9kYXNoLnppcCA9IHppcDtcbiAgICBsb2Rhc2guemlwT2JqZWN0ID0gemlwT2JqZWN0O1xuXG4gICAgLy8gYWRkIGFsaWFzZXNcbiAgICBsb2Rhc2guY29sbGVjdCA9IG1hcDtcbiAgICBsb2Rhc2guZHJvcCA9IHJlc3Q7XG4gICAgbG9kYXNoLmVhY2ggPSBmb3JFYWNoO1xuICAgIGxvZGFzaC5lYWNoUmlnaHQgPSBmb3JFYWNoUmlnaHQ7XG4gICAgbG9kYXNoLmV4dGVuZCA9IGFzc2lnbjtcbiAgICBsb2Rhc2gubWV0aG9kcyA9IGZ1bmN0aW9ucztcbiAgICBsb2Rhc2gub2JqZWN0ID0gemlwT2JqZWN0O1xuICAgIGxvZGFzaC5zZWxlY3QgPSBmaWx0ZXI7XG4gICAgbG9kYXNoLnRhaWwgPSByZXN0O1xuICAgIGxvZGFzaC51bmlxdWUgPSB1bmlxO1xuICAgIGxvZGFzaC51bnppcCA9IHppcDtcblxuICAgIC8vIGFkZCBmdW5jdGlvbnMgdG8gYGxvZGFzaC5wcm90b3R5cGVgXG4gICAgbWl4aW4obG9kYXNoKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLy8gYWRkIGZ1bmN0aW9ucyB0aGF0IHJldHVybiB1bndyYXBwZWQgdmFsdWVzIHdoZW4gY2hhaW5pbmdcbiAgICBsb2Rhc2guY2xvbmUgPSBjbG9uZTtcbiAgICBsb2Rhc2guY2xvbmVEZWVwID0gY2xvbmVEZWVwO1xuICAgIGxvZGFzaC5jb250YWlucyA9IGNvbnRhaW5zO1xuICAgIGxvZGFzaC5lc2NhcGUgPSBlc2NhcGU7XG4gICAgbG9kYXNoLmV2ZXJ5ID0gZXZlcnk7XG4gICAgbG9kYXNoLmZpbmQgPSBmaW5kO1xuICAgIGxvZGFzaC5maW5kSW5kZXggPSBmaW5kSW5kZXg7XG4gICAgbG9kYXNoLmZpbmRLZXkgPSBmaW5kS2V5O1xuICAgIGxvZGFzaC5maW5kTGFzdCA9IGZpbmRMYXN0O1xuICAgIGxvZGFzaC5maW5kTGFzdEluZGV4ID0gZmluZExhc3RJbmRleDtcbiAgICBsb2Rhc2guZmluZExhc3RLZXkgPSBmaW5kTGFzdEtleTtcbiAgICBsb2Rhc2guaGFzID0gaGFzO1xuICAgIGxvZGFzaC5pZGVudGl0eSA9IGlkZW50aXR5O1xuICAgIGxvZGFzaC5pbmRleE9mID0gaW5kZXhPZjtcbiAgICBsb2Rhc2guaXNBcmd1bWVudHMgPSBpc0FyZ3VtZW50cztcbiAgICBsb2Rhc2guaXNBcnJheSA9IGlzQXJyYXk7XG4gICAgbG9kYXNoLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcbiAgICBsb2Rhc2guaXNEYXRlID0gaXNEYXRlO1xuICAgIGxvZGFzaC5pc0VsZW1lbnQgPSBpc0VsZW1lbnQ7XG4gICAgbG9kYXNoLmlzRW1wdHkgPSBpc0VtcHR5O1xuICAgIGxvZGFzaC5pc0VxdWFsID0gaXNFcXVhbDtcbiAgICBsb2Rhc2guaXNGaW5pdGUgPSBpc0Zpbml0ZTtcbiAgICBsb2Rhc2guaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG4gICAgbG9kYXNoLmlzTmFOID0gaXNOYU47XG4gICAgbG9kYXNoLmlzTnVsbCA9IGlzTnVsbDtcbiAgICBsb2Rhc2guaXNOdW1iZXIgPSBpc051bWJlcjtcbiAgICBsb2Rhc2guaXNPYmplY3QgPSBpc09iamVjdDtcbiAgICBsb2Rhc2guaXNQbGFpbk9iamVjdCA9IGlzUGxhaW5PYmplY3Q7XG4gICAgbG9kYXNoLmlzUmVnRXhwID0gaXNSZWdFeHA7XG4gICAgbG9kYXNoLmlzU3RyaW5nID0gaXNTdHJpbmc7XG4gICAgbG9kYXNoLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG4gICAgbG9kYXNoLmxhc3RJbmRleE9mID0gbGFzdEluZGV4T2Y7XG4gICAgbG9kYXNoLm1peGluID0gbWl4aW47XG4gICAgbG9kYXNoLm5vQ29uZmxpY3QgPSBub0NvbmZsaWN0O1xuICAgIGxvZGFzaC5ub29wID0gbm9vcDtcbiAgICBsb2Rhc2gubm93ID0gbm93O1xuICAgIGxvZGFzaC5wYXJzZUludCA9IHBhcnNlSW50O1xuICAgIGxvZGFzaC5yYW5kb20gPSByYW5kb207XG4gICAgbG9kYXNoLnJlZHVjZSA9IHJlZHVjZTtcbiAgICBsb2Rhc2gucmVkdWNlUmlnaHQgPSByZWR1Y2VSaWdodDtcbiAgICBsb2Rhc2gucmVzdWx0ID0gcmVzdWx0O1xuICAgIGxvZGFzaC5ydW5JbkNvbnRleHQgPSBydW5JbkNvbnRleHQ7XG4gICAgbG9kYXNoLnNpemUgPSBzaXplO1xuICAgIGxvZGFzaC5zb21lID0gc29tZTtcbiAgICBsb2Rhc2guc29ydGVkSW5kZXggPSBzb3J0ZWRJbmRleDtcbiAgICBsb2Rhc2gudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICBsb2Rhc2gudW5lc2NhcGUgPSB1bmVzY2FwZTtcbiAgICBsb2Rhc2gudW5pcXVlSWQgPSB1bmlxdWVJZDtcblxuICAgIC8vIGFkZCBhbGlhc2VzXG4gICAgbG9kYXNoLmFsbCA9IGV2ZXJ5O1xuICAgIGxvZGFzaC5hbnkgPSBzb21lO1xuICAgIGxvZGFzaC5kZXRlY3QgPSBmaW5kO1xuICAgIGxvZGFzaC5maW5kV2hlcmUgPSBmaW5kO1xuICAgIGxvZGFzaC5mb2xkbCA9IHJlZHVjZTtcbiAgICBsb2Rhc2guZm9sZHIgPSByZWR1Y2VSaWdodDtcbiAgICBsb2Rhc2guaW5jbHVkZSA9IGNvbnRhaW5zO1xuICAgIGxvZGFzaC5pbmplY3QgPSByZWR1Y2U7XG5cbiAgICBtaXhpbihmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzb3VyY2UgPSB7fVxuICAgICAgZm9yT3duKGxvZGFzaCwgZnVuY3Rpb24oZnVuYywgbWV0aG9kTmFtZSkge1xuICAgICAgICBpZiAoIWxvZGFzaC5wcm90b3R5cGVbbWV0aG9kTmFtZV0pIHtcbiAgICAgICAgICBzb3VyY2VbbWV0aG9kTmFtZV0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgfSgpLCBmYWxzZSk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8vIGFkZCBmdW5jdGlvbnMgY2FwYWJsZSBvZiByZXR1cm5pbmcgd3JhcHBlZCBhbmQgdW53cmFwcGVkIHZhbHVlcyB3aGVuIGNoYWluaW5nXG4gICAgbG9kYXNoLmZpcnN0ID0gZmlyc3Q7XG4gICAgbG9kYXNoLmxhc3QgPSBsYXN0O1xuICAgIGxvZGFzaC5zYW1wbGUgPSBzYW1wbGU7XG5cbiAgICAvLyBhZGQgYWxpYXNlc1xuICAgIGxvZGFzaC50YWtlID0gZmlyc3Q7XG4gICAgbG9kYXNoLmhlYWQgPSBmaXJzdDtcblxuICAgIGZvck93bihsb2Rhc2gsIGZ1bmN0aW9uKGZ1bmMsIG1ldGhvZE5hbWUpIHtcbiAgICAgIHZhciBjYWxsYmFja2FibGUgPSBtZXRob2ROYW1lICE9PSAnc2FtcGxlJztcbiAgICAgIGlmICghbG9kYXNoLnByb3RvdHlwZVttZXRob2ROYW1lXSkge1xuICAgICAgICBsb2Rhc2gucHJvdG90eXBlW21ldGhvZE5hbWVdPSBmdW5jdGlvbihuLCBndWFyZCkge1xuICAgICAgICAgIHZhciBjaGFpbkFsbCA9IHRoaXMuX19jaGFpbl9fLFxuICAgICAgICAgICAgICByZXN1bHQgPSBmdW5jKHRoaXMuX193cmFwcGVkX18sIG4sIGd1YXJkKTtcblxuICAgICAgICAgIHJldHVybiAhY2hhaW5BbGwgJiYgKG4gPT0gbnVsbCB8fCAoZ3VhcmQgJiYgIShjYWxsYmFja2FibGUgJiYgdHlwZW9mIG4gPT0gJ2Z1bmN0aW9uJykpKVxuICAgICAgICAgICAgPyByZXN1bHRcbiAgICAgICAgICAgIDogbmV3IGxvZGFzaFdyYXBwZXIocmVzdWx0LCBjaGFpbkFsbCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIFRoZSBzZW1hbnRpYyB2ZXJzaW9uIG51bWJlci5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAqL1xuICAgIGxvZGFzaC5WRVJTSU9OID0gJzIuNC4xJztcblxuICAgIC8vIGFkZCBcIkNoYWluaW5nXCIgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyXG4gICAgbG9kYXNoLnByb3RvdHlwZS5jaGFpbiA9IHdyYXBwZXJDaGFpbjtcbiAgICBsb2Rhc2gucHJvdG90eXBlLnRvU3RyaW5nID0gd3JhcHBlclRvU3RyaW5nO1xuICAgIGxvZGFzaC5wcm90b3R5cGUudmFsdWUgPSB3cmFwcGVyVmFsdWVPZjtcbiAgICBsb2Rhc2gucHJvdG90eXBlLnZhbHVlT2YgPSB3cmFwcGVyVmFsdWVPZjtcblxuICAgIC8vIGFkZCBgQXJyYXlgIGZ1bmN0aW9ucyB0aGF0IHJldHVybiB1bndyYXBwZWQgdmFsdWVzXG4gICAgZm9yRWFjaChbJ2pvaW4nLCAncG9wJywgJ3NoaWZ0J10sIGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gYXJyYXlSZWZbbWV0aG9kTmFtZV07XG4gICAgICBsb2Rhc2gucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjaGFpbkFsbCA9IHRoaXMuX19jaGFpbl9fLFxuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLl9fd3JhcHBlZF9fLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIHJldHVybiBjaGFpbkFsbFxuICAgICAgICAgID8gbmV3IGxvZGFzaFdyYXBwZXIocmVzdWx0LCBjaGFpbkFsbClcbiAgICAgICAgICA6IHJlc3VsdDtcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBhZGQgYEFycmF5YCBmdW5jdGlvbnMgdGhhdCByZXR1cm4gdGhlIGV4aXN0aW5nIHdyYXBwZWQgdmFsdWVcbiAgICBmb3JFYWNoKFsncHVzaCcsICdyZXZlcnNlJywgJ3NvcnQnLCAndW5zaGlmdCddLCBmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IGFycmF5UmVmW21ldGhvZE5hbWVdO1xuICAgICAgbG9kYXNoLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBmdW5jLmFwcGx5KHRoaXMuX193cmFwcGVkX18sIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8vIGFkZCBgQXJyYXlgIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBuZXcgd3JhcHBlZCB2YWx1ZXNcbiAgICBmb3JFYWNoKFsnY29uY2F0JywgJ3NsaWNlJywgJ3NwbGljZSddLCBmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IGFycmF5UmVmW21ldGhvZE5hbWVdO1xuICAgICAgbG9kYXNoLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IGxvZGFzaFdyYXBwZXIoZnVuYy5hcHBseSh0aGlzLl9fd3JhcHBlZF9fLCBhcmd1bWVudHMpLCB0aGlzLl9fY2hhaW5fXyk7XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGxvZGFzaDtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8vIGV4cG9zZSBMby1EYXNoXG4gIHZhciBfID0gcnVuSW5Db250ZXh0KCk7XG5cbiAgLy8gc29tZSBBTUQgYnVpbGQgb3B0aW1pemVycyBsaWtlIHIuanMgY2hlY2sgZm9yIGNvbmRpdGlvbiBwYXR0ZXJucyBsaWtlIHRoZSBmb2xsb3dpbmc6XG4gIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEV4cG9zZSBMby1EYXNoIHRvIHRoZSBnbG9iYWwgb2JqZWN0IGV2ZW4gd2hlbiBhbiBBTUQgbG9hZGVyIGlzIHByZXNlbnQgaW5cbiAgICAvLyBjYXNlIExvLURhc2ggaXMgbG9hZGVkIHdpdGggYSBSZXF1aXJlSlMgc2hpbSBjb25maWcuXG4gICAgLy8gU2VlIGh0dHA6Ly9yZXF1aXJlanMub3JnL2RvY3MvYXBpLmh0bWwjY29uZmlnLXNoaW1cbiAgICByb290Ll8gPSBfO1xuXG4gICAgLy8gZGVmaW5lIGFzIGFuIGFub255bW91cyBtb2R1bGUgc28sIHRocm91Z2ggcGF0aCBtYXBwaW5nLCBpdCBjYW4gYmVcbiAgICAvLyByZWZlcmVuY2VkIGFzIHRoZSBcInVuZGVyc2NvcmVcIiBtb2R1bGVcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXztcbiAgICB9KTtcbiAgfVxuICAvLyBjaGVjayBmb3IgYGV4cG9ydHNgIGFmdGVyIGBkZWZpbmVgIGluIGNhc2UgYSBidWlsZCBvcHRpbWl6ZXIgYWRkcyBhbiBgZXhwb3J0c2Agb2JqZWN0XG4gIGVsc2UgaWYgKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUpIHtcbiAgICAvLyBpbiBOb2RlLmpzIG9yIFJpbmdvSlNcbiAgICBpZiAobW9kdWxlRXhwb3J0cykge1xuICAgICAgKGZyZWVNb2R1bGUuZXhwb3J0cyA9IF8pLl8gPSBfO1xuICAgIH1cbiAgICAvLyBpbiBOYXJ3aGFsIG9yIFJoaW5vIC1yZXF1aXJlXG4gICAgZWxzZSB7XG4gICAgICBmcmVlRXhwb3J0cy5fID0gXztcbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgLy8gaW4gYSBicm93c2VyIG9yIFJoaW5vXG4gICAgcm9vdC5fID0gXztcbiAgfVxufS5jYWxsKHRoaXMpKTtcbiIsIi8vICBVbmRlcnNjb3JlLnN0cmluZ1xuLy8gIChjKSAyMDEwIEVzYS1NYXR0aSBTdXVyb25lbiA8ZXNhLW1hdHRpIGFldCBzdXVyb25lbiBkb3Qgb3JnPlxuLy8gIFVuZGVyc2NvcmUuc3RyaW5nIGlzIGZyZWVseSBkaXN0cmlidXRhYmxlIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgTUlUIGxpY2Vuc2UuXG4vLyAgRG9jdW1lbnRhdGlvbjogaHR0cHM6Ly9naXRodWIuY29tL2VwZWxpL3VuZGVyc2NvcmUuc3RyaW5nXG4vLyAgU29tZSBjb2RlIGlzIGJvcnJvd2VkIGZyb20gTW9vVG9vbHMgYW5kIEFsZXhhbmRydSBNYXJhc3RlYW51LlxuLy8gIFZlcnNpb24gJzIuMy4yJ1xuXG4hZnVuY3Rpb24ocm9vdCwgU3RyaW5nKXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIERlZmluaW5nIGhlbHBlciBmdW5jdGlvbnMuXG5cbiAgdmFyIG5hdGl2ZVRyaW0gPSBTdHJpbmcucHJvdG90eXBlLnRyaW07XG4gIHZhciBuYXRpdmVUcmltUmlnaHQgPSBTdHJpbmcucHJvdG90eXBlLnRyaW1SaWdodDtcbiAgdmFyIG5hdGl2ZVRyaW1MZWZ0ID0gU3RyaW5nLnByb3RvdHlwZS50cmltTGVmdDtcblxuICB2YXIgcGFyc2VOdW1iZXIgPSBmdW5jdGlvbihzb3VyY2UpIHsgcmV0dXJuIHNvdXJjZSAqIDEgfHwgMDsgfTtcblxuICB2YXIgc3RyUmVwZWF0ID0gZnVuY3Rpb24oc3RyLCBxdHkpe1xuICAgIGlmIChxdHkgPCAxKSByZXR1cm4gJyc7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHdoaWxlIChxdHkgPiAwKSB7XG4gICAgICBpZiAocXR5ICYgMSkgcmVzdWx0ICs9IHN0cjtcbiAgICAgIHF0eSA+Pj0gMSwgc3RyICs9IHN0cjtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB2YXIgc2xpY2UgPSBbXS5zbGljZTtcblxuICB2YXIgZGVmYXVsdFRvV2hpdGVTcGFjZSA9IGZ1bmN0aW9uKGNoYXJhY3RlcnMpIHtcbiAgICBpZiAoY2hhcmFjdGVycyA9PSBudWxsKVxuICAgICAgcmV0dXJuICdcXFxccyc7XG4gICAgZWxzZSBpZiAoY2hhcmFjdGVycy5zb3VyY2UpXG4gICAgICByZXR1cm4gY2hhcmFjdGVycy5zb3VyY2U7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuICdbJyArIF9zLmVzY2FwZVJlZ0V4cChjaGFyYWN0ZXJzKSArICddJztcbiAgfTtcblxuICAvLyBIZWxwZXIgZm9yIHRvQm9vbGVhblxuICBmdW5jdGlvbiBib29sTWF0Y2gocywgbWF0Y2hlcnMpIHtcbiAgICB2YXIgaSwgbWF0Y2hlciwgZG93biA9IHMudG9Mb3dlckNhc2UoKTtcbiAgICBtYXRjaGVycyA9IFtdLmNvbmNhdChtYXRjaGVycyk7XG4gICAgZm9yIChpID0gMDsgaSA8IG1hdGNoZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBtYXRjaGVyID0gbWF0Y2hlcnNbaV07XG4gICAgICBpZiAoIW1hdGNoZXIpIGNvbnRpbnVlO1xuICAgICAgaWYgKG1hdGNoZXIudGVzdCAmJiBtYXRjaGVyLnRlc3QocykpIHJldHVybiB0cnVlO1xuICAgICAgaWYgKG1hdGNoZXIudG9Mb3dlckNhc2UoKSA9PT0gZG93bikgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgdmFyIGVzY2FwZUNoYXJzID0ge1xuICAgIGx0OiAnPCcsXG4gICAgZ3Q6ICc+JyxcbiAgICBxdW90OiAnXCInLFxuICAgIGFtcDogJyYnLFxuICAgIGFwb3M6IFwiJ1wiXG4gIH07XG5cbiAgdmFyIHJldmVyc2VkRXNjYXBlQ2hhcnMgPSB7fTtcbiAgZm9yKHZhciBrZXkgaW4gZXNjYXBlQ2hhcnMpIHJldmVyc2VkRXNjYXBlQ2hhcnNbZXNjYXBlQ2hhcnNba2V5XV0gPSBrZXk7XG4gIHJldmVyc2VkRXNjYXBlQ2hhcnNbXCInXCJdID0gJyMzOSc7XG5cbiAgLy8gc3ByaW50ZigpIGZvciBKYXZhU2NyaXB0IDAuNy1iZXRhMVxuICAvLyBodHRwOi8vd3d3LmRpdmVpbnRvamF2YXNjcmlwdC5jb20vcHJvamVjdHMvamF2YXNjcmlwdC1zcHJpbnRmXG4gIC8vXG4gIC8vIENvcHlyaWdodCAoYykgQWxleGFuZHJ1IE1hcmFzdGVhbnUgPGFsZXhhaG9saWMgW2F0KSBnbWFpbCAoZG90XSBjb20+XG4gIC8vIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cbiAgdmFyIHNwcmludGYgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gZ2V0X3R5cGUodmFyaWFibGUpIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFyaWFibGUpLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIHZhciBzdHJfcmVwZWF0ID0gc3RyUmVwZWF0O1xuXG4gICAgdmFyIHN0cl9mb3JtYXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghc3RyX2Zvcm1hdC5jYWNoZS5oYXNPd25Qcm9wZXJ0eShhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgIHN0cl9mb3JtYXQuY2FjaGVbYXJndW1lbnRzWzBdXSA9IHN0cl9mb3JtYXQucGFyc2UoYXJndW1lbnRzWzBdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdHJfZm9ybWF0LmZvcm1hdC5jYWxsKG51bGwsIHN0cl9mb3JtYXQuY2FjaGVbYXJndW1lbnRzWzBdXSwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgc3RyX2Zvcm1hdC5mb3JtYXQgPSBmdW5jdGlvbihwYXJzZV90cmVlLCBhcmd2KSB7XG4gICAgICB2YXIgY3Vyc29yID0gMSwgdHJlZV9sZW5ndGggPSBwYXJzZV90cmVlLmxlbmd0aCwgbm9kZV90eXBlID0gJycsIGFyZywgb3V0cHV0ID0gW10sIGksIGssIG1hdGNoLCBwYWQsIHBhZF9jaGFyYWN0ZXIsIHBhZF9sZW5ndGg7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdHJlZV9sZW5ndGg7IGkrKykge1xuICAgICAgICBub2RlX3R5cGUgPSBnZXRfdHlwZShwYXJzZV90cmVlW2ldKTtcbiAgICAgICAgaWYgKG5vZGVfdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBvdXRwdXQucHVzaChwYXJzZV90cmVlW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlX3R5cGUgPT09ICdhcnJheScpIHtcbiAgICAgICAgICBtYXRjaCA9IHBhcnNlX3RyZWVbaV07IC8vIGNvbnZlbmllbmNlIHB1cnBvc2VzIG9ubHlcbiAgICAgICAgICBpZiAobWF0Y2hbMl0pIHsgLy8ga2V5d29yZCBhcmd1bWVudFxuICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3JdO1xuICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IG1hdGNoWzJdLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgIGlmICghYXJnLmhhc093blByb3BlcnR5KG1hdGNoWzJdW2tdKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzcHJpbnRmKCdbXy5zcHJpbnRmXSBwcm9wZXJ0eSBcIiVzXCIgZG9lcyBub3QgZXhpc3QnLCBtYXRjaFsyXVtrXSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGFyZyA9IGFyZ1ttYXRjaFsyXVtrXV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChtYXRjaFsxXSkgeyAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChleHBsaWNpdClcbiAgICAgICAgICAgIGFyZyA9IGFyZ3ZbbWF0Y2hbMV1dO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoaW1wbGljaXQpXG4gICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcisrXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoL1tec10vLnRlc3QobWF0Y2hbOF0pICYmIChnZXRfdHlwZShhcmcpICE9ICdudW1iZXInKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHNwcmludGYoJ1tfLnNwcmludGZdIGV4cGVjdGluZyBudW1iZXIgYnV0IGZvdW5kICVzJywgZ2V0X3R5cGUoYXJnKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzd2l0Y2ggKG1hdGNoWzhdKSB7XG4gICAgICAgICAgICBjYXNlICdiJzogYXJnID0gYXJnLnRvU3RyaW5nKDIpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2MnOiBhcmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGFyZyk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZCc6IGFyZyA9IHBhcnNlSW50KGFyZywgMTApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2UnOiBhcmcgPSBtYXRjaFs3XSA/IGFyZy50b0V4cG9uZW50aWFsKG1hdGNoWzddKSA6IGFyZy50b0V4cG9uZW50aWFsKCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZic6IGFyZyA9IG1hdGNoWzddID8gcGFyc2VGbG9hdChhcmcpLnRvRml4ZWQobWF0Y2hbN10pIDogcGFyc2VGbG9hdChhcmcpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ28nOiBhcmcgPSBhcmcudG9TdHJpbmcoOCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncyc6IGFyZyA9ICgoYXJnID0gU3RyaW5nKGFyZykpICYmIG1hdGNoWzddID8gYXJnLnN1YnN0cmluZygwLCBtYXRjaFs3XSkgOiBhcmcpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3UnOiBhcmcgPSBNYXRoLmFicyhhcmcpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3gnOiBhcmcgPSBhcmcudG9TdHJpbmcoMTYpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ1gnOiBhcmcgPSBhcmcudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7IGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhcmcgPSAoL1tkZWZdLy50ZXN0KG1hdGNoWzhdKSAmJiBtYXRjaFszXSAmJiBhcmcgPj0gMCA/ICcrJysgYXJnIDogYXJnKTtcbiAgICAgICAgICBwYWRfY2hhcmFjdGVyID0gbWF0Y2hbNF0gPyBtYXRjaFs0XSA9PSAnMCcgPyAnMCcgOiBtYXRjaFs0XS5jaGFyQXQoMSkgOiAnICc7XG4gICAgICAgICAgcGFkX2xlbmd0aCA9IG1hdGNoWzZdIC0gU3RyaW5nKGFyZykubGVuZ3RoO1xuICAgICAgICAgIHBhZCA9IG1hdGNoWzZdID8gc3RyX3JlcGVhdChwYWRfY2hhcmFjdGVyLCBwYWRfbGVuZ3RoKSA6ICcnO1xuICAgICAgICAgIG91dHB1dC5wdXNoKG1hdGNoWzVdID8gYXJnICsgcGFkIDogcGFkICsgYXJnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dC5qb2luKCcnKTtcbiAgICB9O1xuXG4gICAgc3RyX2Zvcm1hdC5jYWNoZSA9IHt9O1xuXG4gICAgc3RyX2Zvcm1hdC5wYXJzZSA9IGZ1bmN0aW9uKGZtdCkge1xuICAgICAgdmFyIF9mbXQgPSBmbXQsIG1hdGNoID0gW10sIHBhcnNlX3RyZWUgPSBbXSwgYXJnX25hbWVzID0gMDtcbiAgICAgIHdoaWxlIChfZm10KSB7XG4gICAgICAgIGlmICgobWF0Y2ggPSAvXlteXFx4MjVdKy8uZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICBwYXJzZV90cmVlLnB1c2gobWF0Y2hbMF0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKChtYXRjaCA9IC9eXFx4MjV7Mn0vLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKCclJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoKG1hdGNoID0gL15cXHgyNSg/OihbMS05XVxcZCopXFwkfFxcKChbXlxcKV0rKVxcKSk/KFxcKyk/KDB8J1teJF0pPygtKT8oXFxkKyk/KD86XFwuKFxcZCspKT8oW2ItZm9zdXhYXSkvLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgaWYgKG1hdGNoWzJdKSB7XG4gICAgICAgICAgICBhcmdfbmFtZXMgfD0gMTtcbiAgICAgICAgICAgIHZhciBmaWVsZF9saXN0ID0gW10sIHJlcGxhY2VtZW50X2ZpZWxkID0gbWF0Y2hbMl0sIGZpZWxkX21hdGNoID0gW107XG4gICAgICAgICAgICBpZiAoKGZpZWxkX21hdGNoID0gL14oW2Etel9dW2Etel9cXGRdKikvaS5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKTtcbiAgICAgICAgICAgICAgd2hpbGUgKChyZXBsYWNlbWVudF9maWVsZCA9IHJlcGxhY2VtZW50X2ZpZWxkLnN1YnN0cmluZyhmaWVsZF9tYXRjaFswXS5sZW5ndGgpKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICBpZiAoKGZpZWxkX21hdGNoID0gL15cXC4oW2Etel9dW2Etel9cXGRdKikvaS5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKChmaWVsZF9tYXRjaCA9IC9eXFxbKFxcZCspXFxdLy5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbXy5zcHJpbnRmXSBodWg/Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbXy5zcHJpbnRmXSBodWg/Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXRjaFsyXSA9IGZpZWxkX2xpc3Q7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXJnX25hbWVzIHw9IDI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhcmdfbmFtZXMgPT09IDMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignW18uc3ByaW50Zl0gbWl4aW5nIHBvc2l0aW9uYWwgYW5kIG5hbWVkIHBsYWNlaG9sZGVycyBpcyBub3QgKHlldCkgc3VwcG9ydGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcnNlX3RyZWUucHVzaChtYXRjaCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbXy5zcHJpbnRmXSBodWg/Jyk7XG4gICAgICAgIH1cbiAgICAgICAgX2ZtdCA9IF9mbXQuc3Vic3RyaW5nKG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyc2VfdHJlZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHN0cl9mb3JtYXQ7XG4gIH0pKCk7XG5cblxuXG4gIC8vIERlZmluaW5nIHVuZGVyc2NvcmUuc3RyaW5nXG5cbiAgdmFyIF9zID0ge1xuXG4gICAgVkVSU0lPTjogJzIuMy4wJyxcblxuICAgIGlzQmxhbms6IGZ1bmN0aW9uKHN0cil7XG4gICAgICBpZiAoc3RyID09IG51bGwpIHN0ciA9ICcnO1xuICAgICAgcmV0dXJuICgvXlxccyokLykudGVzdChzdHIpO1xuICAgIH0sXG5cbiAgICBzdHJpcFRhZ3M6IGZ1bmN0aW9uKHN0cil7XG4gICAgICBpZiAoc3RyID09IG51bGwpIHJldHVybiAnJztcbiAgICAgIHJldHVybiBTdHJpbmcoc3RyKS5yZXBsYWNlKC88XFwvP1tePl0rPi9nLCAnJyk7XG4gICAgfSxcblxuICAgIGNhcGl0YWxpemUgOiBmdW5jdGlvbihzdHIpe1xuICAgICAgc3RyID0gc3RyID09IG51bGwgPyAnJyA6IFN0cmluZyhzdHIpO1xuICAgICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbiAgICB9LFxuXG4gICAgY2hvcDogZnVuY3Rpb24oc3RyLCBzdGVwKXtcbiAgICAgIGlmIChzdHIgPT0gbnVsbCkgcmV0dXJuIFtdO1xuICAgICAgc3RyID0gU3RyaW5nKHN0cik7XG4gICAgICBzdGVwID0gfn5zdGVwO1xuICAgICAgcmV0dXJuIHN0ZXAgPiAwID8gc3RyLm1hdGNoKG5ldyBSZWdFeHAoJy57MSwnICsgc3RlcCArICd9JywgJ2cnKSkgOiBbc3RyXTtcbiAgICB9LFxuXG4gICAgY2xlYW46IGZ1bmN0aW9uKHN0cil7XG4gICAgICByZXR1cm4gX3Muc3RyaXAoc3RyKS5yZXBsYWNlKC9cXHMrL2csICcgJyk7XG4gICAgfSxcblxuICAgIGNvdW50OiBmdW5jdGlvbihzdHIsIHN1YnN0cil7XG4gICAgICBpZiAoc3RyID09IG51bGwgfHwgc3Vic3RyID09IG51bGwpIHJldHVybiAwO1xuXG4gICAgICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgICAgIHN1YnN0ciA9IFN0cmluZyhzdWJzdHIpO1xuXG4gICAgICB2YXIgY291bnQgPSAwLFxuICAgICAgICBwb3MgPSAwLFxuICAgICAgICBsZW5ndGggPSBzdWJzdHIubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBwb3MgPSBzdHIuaW5kZXhPZihzdWJzdHIsIHBvcyk7XG4gICAgICAgIGlmIChwb3MgPT09IC0xKSBicmVhaztcbiAgICAgICAgY291bnQrKztcbiAgICAgICAgcG9zICs9IGxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH0sXG5cbiAgICBjaGFyczogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBpZiAoc3RyID09IG51bGwpIHJldHVybiBbXTtcbiAgICAgIHJldHVybiBTdHJpbmcoc3RyKS5zcGxpdCgnJyk7XG4gICAgfSxcblxuICAgIHN3YXBDYXNlOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIGlmIChzdHIgPT0gbnVsbCkgcmV0dXJuICcnO1xuICAgICAgcmV0dXJuIFN0cmluZyhzdHIpLnJlcGxhY2UoL1xcUy9nLCBmdW5jdGlvbihjKXtcbiAgICAgICAgcmV0dXJuIGMgPT09IGMudG9VcHBlckNhc2UoKSA/IGMudG9Mb3dlckNhc2UoKSA6IGMudG9VcHBlckNhc2UoKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBlc2NhcGVIVE1MOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIGlmIChzdHIgPT0gbnVsbCkgcmV0dXJuICcnO1xuICAgICAgcmV0dXJuIFN0cmluZyhzdHIpLnJlcGxhY2UoL1smPD5cIiddL2csIGZ1bmN0aW9uKG0peyByZXR1cm4gJyYnICsgcmV2ZXJzZWRFc2NhcGVDaGFyc1ttXSArICc7JzsgfSk7XG4gICAgfSxcblxuICAgIHVuZXNjYXBlSFRNTDogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBpZiAoc3RyID09IG51bGwpIHJldHVybiAnJztcbiAgICAgIHJldHVybiBTdHJpbmcoc3RyKS5yZXBsYWNlKC9cXCYoW147XSspOy9nLCBmdW5jdGlvbihlbnRpdHksIGVudGl0eUNvZGUpe1xuICAgICAgICB2YXIgbWF0Y2g7XG5cbiAgICAgICAgaWYgKGVudGl0eUNvZGUgaW4gZXNjYXBlQ2hhcnMpIHtcbiAgICAgICAgICByZXR1cm4gZXNjYXBlQ2hhcnNbZW50aXR5Q29kZV07XG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2ggPSBlbnRpdHlDb2RlLm1hdGNoKC9eI3goW1xcZGEtZkEtRl0rKSQvKSkge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KG1hdGNoWzFdLCAxNikpO1xuICAgICAgICB9IGVsc2UgaWYgKG1hdGNoID0gZW50aXR5Q29kZS5tYXRjaCgvXiMoXFxkKykkLykpIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSh+fm1hdGNoWzFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgZXNjYXBlUmVnRXhwOiBmdW5jdGlvbihzdHIpe1xuICAgICAgaWYgKHN0ciA9PSBudWxsKSByZXR1cm4gJyc7XG4gICAgICByZXR1cm4gU3RyaW5nKHN0cikucmVwbGFjZSgvKFsuKis/Xj0hOiR7fSgpfFtcXF1cXC9cXFxcXSkvZywgJ1xcXFwkMScpO1xuICAgIH0sXG5cbiAgICBzcGxpY2U6IGZ1bmN0aW9uKHN0ciwgaSwgaG93bWFueSwgc3Vic3RyKXtcbiAgICAgIHZhciBhcnIgPSBfcy5jaGFycyhzdHIpO1xuICAgICAgYXJyLnNwbGljZSh+fmksIH5+aG93bWFueSwgc3Vic3RyKTtcbiAgICAgIHJldHVybiBhcnIuam9pbignJyk7XG4gICAgfSxcblxuICAgIGluc2VydDogZnVuY3Rpb24oc3RyLCBpLCBzdWJzdHIpe1xuICAgICAgcmV0dXJuIF9zLnNwbGljZShzdHIsIGksIDAsIHN1YnN0cik7XG4gICAgfSxcblxuICAgIGluY2x1ZGU6IGZ1bmN0aW9uKHN0ciwgbmVlZGxlKXtcbiAgICAgIGlmIChuZWVkbGUgPT09ICcnKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGlmIChzdHIgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIFN0cmluZyhzdHIpLmluZGV4T2YobmVlZGxlKSAhPT0gLTE7XG4gICAgfSxcblxuICAgIGpvaW46IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyksXG4gICAgICAgIHNlcGFyYXRvciA9IGFyZ3Muc2hpZnQoKTtcblxuICAgICAgaWYgKHNlcGFyYXRvciA9PSBudWxsKSBzZXBhcmF0b3IgPSAnJztcblxuICAgICAgcmV0dXJuIGFyZ3Muam9pbihzZXBhcmF0b3IpO1xuICAgIH0sXG5cbiAgICBsaW5lczogZnVuY3Rpb24oc3RyKSB7XG4gICAgICBpZiAoc3RyID09IG51bGwpIHJldHVybiBbXTtcbiAgICAgIHJldHVybiBTdHJpbmcoc3RyKS5zcGxpdChcIlxcblwiKTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTogZnVuY3Rpb24oc3RyKXtcbiAgICAgIHJldHVybiBfcy5jaGFycyhzdHIpLnJldmVyc2UoKS5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgc3RhcnRzV2l0aDogZnVuY3Rpb24oc3RyLCBzdGFydHMpe1xuICAgICAgaWYgKHN0YXJ0cyA9PT0gJycpIHJldHVybiB0cnVlO1xuICAgICAgaWYgKHN0ciA9PSBudWxsIHx8IHN0YXJ0cyA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICBzdHIgPSBTdHJpbmcoc3RyKTsgc3RhcnRzID0gU3RyaW5nKHN0YXJ0cyk7XG4gICAgICByZXR1cm4gc3RyLmxlbmd0aCA+PSBzdGFydHMubGVuZ3RoICYmIHN0ci5zbGljZSgwLCBzdGFydHMubGVuZ3RoKSA9PT0gc3RhcnRzO1xuICAgIH0sXG5cbiAgICBlbmRzV2l0aDogZnVuY3Rpb24oc3RyLCBlbmRzKXtcbiAgICAgIGlmIChlbmRzID09PSAnJykgcmV0dXJuIHRydWU7XG4gICAgICBpZiAoc3RyID09IG51bGwgfHwgZW5kcyA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICBzdHIgPSBTdHJpbmcoc3RyKTsgZW5kcyA9IFN0cmluZyhlbmRzKTtcbiAgICAgIHJldHVybiBzdHIubGVuZ3RoID49IGVuZHMubGVuZ3RoICYmIHN0ci5zbGljZShzdHIubGVuZ3RoIC0gZW5kcy5sZW5ndGgpID09PSBlbmRzO1xuICAgIH0sXG5cbiAgICBzdWNjOiBmdW5jdGlvbihzdHIpe1xuICAgICAgaWYgKHN0ciA9PSBudWxsKSByZXR1cm4gJyc7XG4gICAgICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgICAgIHJldHVybiBzdHIuc2xpY2UoMCwgLTEpICsgU3RyaW5nLmZyb21DaGFyQ29kZShzdHIuY2hhckNvZGVBdChzdHIubGVuZ3RoLTEpICsgMSk7XG4gICAgfSxcblxuICAgIHRpdGxlaXplOiBmdW5jdGlvbihzdHIpe1xuICAgICAgaWYgKHN0ciA9PSBudWxsKSByZXR1cm4gJyc7XG4gICAgICBzdHIgID0gU3RyaW5nKHN0cikudG9Mb3dlckNhc2UoKTtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvKD86XnxcXHN8LSlcXFMvZywgZnVuY3Rpb24oYyl7IHJldHVybiBjLnRvVXBwZXJDYXNlKCk7IH0pO1xuICAgIH0sXG5cbiAgICBjYW1lbGl6ZTogZnVuY3Rpb24oc3RyKXtcbiAgICAgIHJldHVybiBfcy50cmltKHN0cikucmVwbGFjZSgvWy1fXFxzXSsoLik/L2csIGZ1bmN0aW9uKG1hdGNoLCBjKXsgcmV0dXJuIGMgPyBjLnRvVXBwZXJDYXNlKCkgOiBcIlwiOyB9KTtcbiAgICB9LFxuXG4gICAgdW5kZXJzY29yZWQ6IGZ1bmN0aW9uKHN0cil7XG4gICAgICByZXR1cm4gX3MudHJpbShzdHIpLnJlcGxhY2UoLyhbYS16XFxkXSkoW0EtWl0rKS9nLCAnJDFfJDInKS5yZXBsYWNlKC9bLVxcc10rL2csICdfJykudG9Mb3dlckNhc2UoKTtcbiAgICB9LFxuXG4gICAgZGFzaGVyaXplOiBmdW5jdGlvbihzdHIpe1xuICAgICAgcmV0dXJuIF9zLnRyaW0oc3RyKS5yZXBsYWNlKC8oW0EtWl0pL2csICctJDEnKS5yZXBsYWNlKC9bLV9cXHNdKy9nLCAnLScpLnRvTG93ZXJDYXNlKCk7XG4gICAgfSxcblxuICAgIGNsYXNzaWZ5OiBmdW5jdGlvbihzdHIpe1xuICAgICAgcmV0dXJuIF9zLnRpdGxlaXplKFN0cmluZyhzdHIpLnJlcGxhY2UoL1tcXFdfXS9nLCAnICcpKS5yZXBsYWNlKC9cXHMvZywgJycpO1xuICAgIH0sXG5cbiAgICBodW1hbml6ZTogZnVuY3Rpb24oc3RyKXtcbiAgICAgIHJldHVybiBfcy5jYXBpdGFsaXplKF9zLnVuZGVyc2NvcmVkKHN0cikucmVwbGFjZSgvX2lkJC8sJycpLnJlcGxhY2UoL18vZywgJyAnKSk7XG4gICAgfSxcblxuICAgIHRyaW06IGZ1bmN0aW9uKHN0ciwgY2hhcmFjdGVycyl7XG4gICAgICBpZiAoc3RyID09IG51bGwpIHJldHVybiAnJztcbiAgICAgIGlmICghY2hhcmFjdGVycyAmJiBuYXRpdmVUcmltKSByZXR1cm4gbmF0aXZlVHJpbS5jYWxsKHN0cik7XG4gICAgICBjaGFyYWN0ZXJzID0gZGVmYXVsdFRvV2hpdGVTcGFjZShjaGFyYWN0ZXJzKTtcbiAgICAgIHJldHVybiBTdHJpbmcoc3RyKS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXicgKyBjaGFyYWN0ZXJzICsgJyt8JyArIGNoYXJhY3RlcnMgKyAnKyQnLCAnZycpLCAnJyk7XG4gICAgfSxcblxuICAgIGx0cmltOiBmdW5jdGlvbihzdHIsIGNoYXJhY3RlcnMpe1xuICAgICAgaWYgKHN0ciA9PSBudWxsKSByZXR1cm4gJyc7XG4gICAgICBpZiAoIWNoYXJhY3RlcnMgJiYgbmF0aXZlVHJpbUxlZnQpIHJldHVybiBuYXRpdmVUcmltTGVmdC5jYWxsKHN0cik7XG4gICAgICBjaGFyYWN0ZXJzID0gZGVmYXVsdFRvV2hpdGVTcGFjZShjaGFyYWN0ZXJzKTtcbiAgICAgIHJldHVybiBTdHJpbmcoc3RyKS5yZXBsYWNlKG5ldyBSZWdFeHAoJ14nICsgY2hhcmFjdGVycyArICcrJyksICcnKTtcbiAgICB9LFxuXG4gICAgcnRyaW06IGZ1bmN0aW9uKHN0ciwgY2hhcmFjdGVycyl7XG4gICAgICBpZiAoc3RyID09IG51bGwpIHJldHVybiAnJztcbiAgICAgIGlmICghY2hhcmFjdGVycyAmJiBuYXRpdmVUcmltUmlnaHQpIHJldHVybiBuYXRpdmVUcmltUmlnaHQuY2FsbChzdHIpO1xuICAgICAgY2hhcmFjdGVycyA9IGRlZmF1bHRUb1doaXRlU3BhY2UoY2hhcmFjdGVycyk7XG4gICAgICByZXR1cm4gU3RyaW5nKHN0cikucmVwbGFjZShuZXcgUmVnRXhwKGNoYXJhY3RlcnMgKyAnKyQnKSwgJycpO1xuICAgIH0sXG5cbiAgICB0cnVuY2F0ZTogZnVuY3Rpb24oc3RyLCBsZW5ndGgsIHRydW5jYXRlU3RyKXtcbiAgICAgIGlmIChzdHIgPT0gbnVsbCkgcmV0dXJuICcnO1xuICAgICAgc3RyID0gU3RyaW5nKHN0cik7IHRydW5jYXRlU3RyID0gdHJ1bmNhdGVTdHIgfHwgJy4uLic7XG4gICAgICBsZW5ndGggPSB+fmxlbmd0aDtcbiAgICAgIHJldHVybiBzdHIubGVuZ3RoID4gbGVuZ3RoID8gc3RyLnNsaWNlKDAsIGxlbmd0aCkgKyB0cnVuY2F0ZVN0ciA6IHN0cjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogX3MucHJ1bmU6IGEgbW9yZSBlbGVnYW50IHZlcnNpb24gb2YgdHJ1bmNhdGVcbiAgICAgKiBwcnVuZSBleHRyYSBjaGFycywgbmV2ZXIgbGVhdmluZyBhIGhhbGYtY2hvcHBlZCB3b3JkLlxuICAgICAqIEBhdXRob3IgZ2l0aHViLmNvbS9yd3pcbiAgICAgKi9cbiAgICBwcnVuZTogZnVuY3Rpb24oc3RyLCBsZW5ndGgsIHBydW5lU3RyKXtcbiAgICAgIGlmIChzdHIgPT0gbnVsbCkgcmV0dXJuICcnO1xuXG4gICAgICBzdHIgPSBTdHJpbmcoc3RyKTsgbGVuZ3RoID0gfn5sZW5ndGg7XG4gICAgICBwcnVuZVN0ciA9IHBydW5lU3RyICE9IG51bGwgPyBTdHJpbmcocHJ1bmVTdHIpIDogJy4uLic7XG5cbiAgICAgIGlmIChzdHIubGVuZ3RoIDw9IGxlbmd0aCkgcmV0dXJuIHN0cjtcblxuICAgICAgdmFyIHRtcGwgPSBmdW5jdGlvbihjKXsgcmV0dXJuIGMudG9VcHBlckNhc2UoKSAhPT0gYy50b0xvd2VyQ2FzZSgpID8gJ0EnIDogJyAnOyB9LFxuICAgICAgICB0ZW1wbGF0ZSA9IHN0ci5zbGljZSgwLCBsZW5ndGgrMSkucmVwbGFjZSgvLig/PVxcVypcXHcqJCkvZywgdG1wbCk7IC8vICdIZWxsbywgd29ybGQnIC0+ICdIZWxsQUEgQUFBQUEnXG5cbiAgICAgIGlmICh0ZW1wbGF0ZS5zbGljZSh0ZW1wbGF0ZS5sZW5ndGgtMikubWF0Y2goL1xcd1xcdy8pKVxuICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoL1xccypcXFMrJC8sICcnKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGVtcGxhdGUgPSBfcy5ydHJpbSh0ZW1wbGF0ZS5zbGljZSgwLCB0ZW1wbGF0ZS5sZW5ndGgtMSkpO1xuXG4gICAgICByZXR1cm4gKHRlbXBsYXRlK3BydW5lU3RyKS5sZW5ndGggPiBzdHIubGVuZ3RoID8gc3RyIDogc3RyLnNsaWNlKDAsIHRlbXBsYXRlLmxlbmd0aCkrcHJ1bmVTdHI7XG4gICAgfSxcblxuICAgIHdvcmRzOiBmdW5jdGlvbihzdHIsIGRlbGltaXRlcikge1xuICAgICAgaWYgKF9zLmlzQmxhbmsoc3RyKSkgcmV0dXJuIFtdO1xuICAgICAgcmV0dXJuIF9zLnRyaW0oc3RyLCBkZWxpbWl0ZXIpLnNwbGl0KGRlbGltaXRlciB8fCAvXFxzKy8pO1xuICAgIH0sXG5cbiAgICBwYWQ6IGZ1bmN0aW9uKHN0ciwgbGVuZ3RoLCBwYWRTdHIsIHR5cGUpIHtcbiAgICAgIHN0ciA9IHN0ciA9PSBudWxsID8gJycgOiBTdHJpbmcoc3RyKTtcbiAgICAgIGxlbmd0aCA9IH5+bGVuZ3RoO1xuXG4gICAgICB2YXIgcGFkbGVuICA9IDA7XG5cbiAgICAgIGlmICghcGFkU3RyKVxuICAgICAgICBwYWRTdHIgPSAnICc7XG4gICAgICBlbHNlIGlmIChwYWRTdHIubGVuZ3RoID4gMSlcbiAgICAgICAgcGFkU3RyID0gcGFkU3RyLmNoYXJBdCgwKTtcblxuICAgICAgc3dpdGNoKHR5cGUpIHtcbiAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgIHBhZGxlbiA9IGxlbmd0aCAtIHN0ci5sZW5ndGg7XG4gICAgICAgICAgcmV0dXJuIHN0ciArIHN0clJlcGVhdChwYWRTdHIsIHBhZGxlbik7XG4gICAgICAgIGNhc2UgJ2JvdGgnOlxuICAgICAgICAgIHBhZGxlbiA9IGxlbmd0aCAtIHN0ci5sZW5ndGg7XG4gICAgICAgICAgcmV0dXJuIHN0clJlcGVhdChwYWRTdHIsIE1hdGguY2VpbChwYWRsZW4vMikpICsgc3RyXG4gICAgICAgICAgICAgICAgICArIHN0clJlcGVhdChwYWRTdHIsIE1hdGguZmxvb3IocGFkbGVuLzIpKTtcbiAgICAgICAgZGVmYXVsdDogLy8gJ2xlZnQnXG4gICAgICAgICAgcGFkbGVuID0gbGVuZ3RoIC0gc3RyLmxlbmd0aDtcbiAgICAgICAgICByZXR1cm4gc3RyUmVwZWF0KHBhZFN0ciwgcGFkbGVuKSArIHN0cjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBscGFkOiBmdW5jdGlvbihzdHIsIGxlbmd0aCwgcGFkU3RyKSB7XG4gICAgICByZXR1cm4gX3MucGFkKHN0ciwgbGVuZ3RoLCBwYWRTdHIpO1xuICAgIH0sXG5cbiAgICBycGFkOiBmdW5jdGlvbihzdHIsIGxlbmd0aCwgcGFkU3RyKSB7XG4gICAgICByZXR1cm4gX3MucGFkKHN0ciwgbGVuZ3RoLCBwYWRTdHIsICdyaWdodCcpO1xuICAgIH0sXG5cbiAgICBscnBhZDogZnVuY3Rpb24oc3RyLCBsZW5ndGgsIHBhZFN0cikge1xuICAgICAgcmV0dXJuIF9zLnBhZChzdHIsIGxlbmd0aCwgcGFkU3RyLCAnYm90aCcpO1xuICAgIH0sXG5cbiAgICBzcHJpbnRmOiBzcHJpbnRmLFxuXG4gICAgdnNwcmludGY6IGZ1bmN0aW9uKGZtdCwgYXJndil7XG4gICAgICBhcmd2LnVuc2hpZnQoZm10KTtcbiAgICAgIHJldHVybiBzcHJpbnRmLmFwcGx5KG51bGwsIGFyZ3YpO1xuICAgIH0sXG5cbiAgICB0b051bWJlcjogZnVuY3Rpb24oc3RyLCBkZWNpbWFscykge1xuICAgICAgaWYgKCFzdHIpIHJldHVybiAwO1xuICAgICAgc3RyID0gX3MudHJpbShzdHIpO1xuICAgICAgaWYgKCFzdHIubWF0Y2goL14tP1xcZCsoPzpcXC5cXGQrKT8kLykpIHJldHVybiBOYU47XG4gICAgICByZXR1cm4gcGFyc2VOdW1iZXIocGFyc2VOdW1iZXIoc3RyKS50b0ZpeGVkKH5+ZGVjaW1hbHMpKTtcbiAgICB9LFxuXG4gICAgbnVtYmVyRm9ybWF0IDogZnVuY3Rpb24obnVtYmVyLCBkZWMsIGRzZXAsIHRzZXApIHtcbiAgICAgIGlmIChpc05hTihudW1iZXIpIHx8IG51bWJlciA9PSBudWxsKSByZXR1cm4gJyc7XG5cbiAgICAgIG51bWJlciA9IG51bWJlci50b0ZpeGVkKH5+ZGVjKTtcbiAgICAgIHRzZXAgPSB0eXBlb2YgdHNlcCA9PSAnc3RyaW5nJyA/IHRzZXAgOiAnLCc7XG5cbiAgICAgIHZhciBwYXJ0cyA9IG51bWJlci5zcGxpdCgnLicpLCBmbnVtcyA9IHBhcnRzWzBdLFxuICAgICAgICBkZWNpbWFscyA9IHBhcnRzWzFdID8gKGRzZXAgfHwgJy4nKSArIHBhcnRzWzFdIDogJyc7XG5cbiAgICAgIHJldHVybiBmbnVtcy5yZXBsYWNlKC8oXFxkKSg/PSg/OlxcZHszfSkrJCkvZywgJyQxJyArIHRzZXApICsgZGVjaW1hbHM7XG4gICAgfSxcblxuICAgIHN0clJpZ2h0OiBmdW5jdGlvbihzdHIsIHNlcCl7XG4gICAgICBpZiAoc3RyID09IG51bGwpIHJldHVybiAnJztcbiAgICAgIHN0ciA9IFN0cmluZyhzdHIpOyBzZXAgPSBzZXAgIT0gbnVsbCA/IFN0cmluZyhzZXApIDogc2VwO1xuICAgICAgdmFyIHBvcyA9ICFzZXAgPyAtMSA6IHN0ci5pbmRleE9mKHNlcCk7XG4gICAgICByZXR1cm4gfnBvcyA/IHN0ci5zbGljZShwb3Mrc2VwLmxlbmd0aCwgc3RyLmxlbmd0aCkgOiBzdHI7XG4gICAgfSxcblxuICAgIHN0clJpZ2h0QmFjazogZnVuY3Rpb24oc3RyLCBzZXApe1xuICAgICAgaWYgKHN0ciA9PSBudWxsKSByZXR1cm4gJyc7XG4gICAgICBzdHIgPSBTdHJpbmcoc3RyKTsgc2VwID0gc2VwICE9IG51bGwgPyBTdHJpbmcoc2VwKSA6IHNlcDtcbiAgICAgIHZhciBwb3MgPSAhc2VwID8gLTEgOiBzdHIubGFzdEluZGV4T2Yoc2VwKTtcbiAgICAgIHJldHVybiB+cG9zID8gc3RyLnNsaWNlKHBvcytzZXAubGVuZ3RoLCBzdHIubGVuZ3RoKSA6IHN0cjtcbiAgICB9LFxuXG4gICAgc3RyTGVmdDogZnVuY3Rpb24oc3RyLCBzZXApe1xuICAgICAgaWYgKHN0ciA9PSBudWxsKSByZXR1cm4gJyc7XG4gICAgICBzdHIgPSBTdHJpbmcoc3RyKTsgc2VwID0gc2VwICE9IG51bGwgPyBTdHJpbmcoc2VwKSA6IHNlcDtcbiAgICAgIHZhciBwb3MgPSAhc2VwID8gLTEgOiBzdHIuaW5kZXhPZihzZXApO1xuICAgICAgcmV0dXJuIH5wb3MgPyBzdHIuc2xpY2UoMCwgcG9zKSA6IHN0cjtcbiAgICB9LFxuXG4gICAgc3RyTGVmdEJhY2s6IGZ1bmN0aW9uKHN0ciwgc2VwKXtcbiAgICAgIGlmIChzdHIgPT0gbnVsbCkgcmV0dXJuICcnO1xuICAgICAgc3RyICs9ICcnOyBzZXAgPSBzZXAgIT0gbnVsbCA/ICcnK3NlcCA6IHNlcDtcbiAgICAgIHZhciBwb3MgPSBzdHIubGFzdEluZGV4T2Yoc2VwKTtcbiAgICAgIHJldHVybiB+cG9zID8gc3RyLnNsaWNlKDAsIHBvcykgOiBzdHI7XG4gICAgfSxcblxuICAgIHRvU2VudGVuY2U6IGZ1bmN0aW9uKGFycmF5LCBzZXBhcmF0b3IsIGxhc3RTZXBhcmF0b3IsIHNlcmlhbCkge1xuICAgICAgc2VwYXJhdG9yID0gc2VwYXJhdG9yIHx8ICcsICc7XG4gICAgICBsYXN0U2VwYXJhdG9yID0gbGFzdFNlcGFyYXRvciB8fCAnIGFuZCAnO1xuICAgICAgdmFyIGEgPSBhcnJheS5zbGljZSgpLCBsYXN0TWVtYmVyID0gYS5wb3AoKTtcblxuICAgICAgaWYgKGFycmF5Lmxlbmd0aCA+IDIgJiYgc2VyaWFsKSBsYXN0U2VwYXJhdG9yID0gX3MucnRyaW0oc2VwYXJhdG9yKSArIGxhc3RTZXBhcmF0b3I7XG5cbiAgICAgIHJldHVybiBhLmxlbmd0aCA/IGEuam9pbihzZXBhcmF0b3IpICsgbGFzdFNlcGFyYXRvciArIGxhc3RNZW1iZXIgOiBsYXN0TWVtYmVyO1xuICAgIH0sXG5cbiAgICB0b1NlbnRlbmNlU2VyaWFsOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgYXJnc1szXSA9IHRydWU7XG4gICAgICByZXR1cm4gX3MudG9TZW50ZW5jZS5hcHBseShfcywgYXJncyk7XG4gICAgfSxcblxuICAgIHNsdWdpZnk6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgaWYgKHN0ciA9PSBudWxsKSByZXR1cm4gJyc7XG5cbiAgICAgIHZhciBmcm9tICA9IFwixIXDoMOhw6TDosOjw6XDpsSDxIfEmcOow6nDq8Oqw6zDrcOvw67FgsWEw7LDs8O2w7TDtcO4xZvImcibw7nDusO8w7vDscOnxbzFulwiLFxuICAgICAgICAgIHRvICAgID0gXCJhYWFhYWFhYWFjZWVlZWVpaWlpbG5vb29vb29zc3R1dXV1bmN6elwiLFxuICAgICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChkZWZhdWx0VG9XaGl0ZVNwYWNlKGZyb20pLCAnZycpO1xuXG4gICAgICBzdHIgPSBTdHJpbmcoc3RyKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UocmVnZXgsIGZ1bmN0aW9uKGMpe1xuICAgICAgICB2YXIgaW5kZXggPSBmcm9tLmluZGV4T2YoYyk7XG4gICAgICAgIHJldHVybiB0by5jaGFyQXQoaW5kZXgpIHx8ICctJztcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gX3MuZGFzaGVyaXplKHN0ci5yZXBsYWNlKC9bXlxcd1xccy1dL2csICcnKSk7XG4gICAgfSxcblxuICAgIHN1cnJvdW5kOiBmdW5jdGlvbihzdHIsIHdyYXBwZXIpIHtcbiAgICAgIHJldHVybiBbd3JhcHBlciwgc3RyLCB3cmFwcGVyXS5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgcXVvdGU6IGZ1bmN0aW9uKHN0ciwgcXVvdGVDaGFyKSB7XG4gICAgICByZXR1cm4gX3Muc3Vycm91bmQoc3RyLCBxdW90ZUNoYXIgfHwgJ1wiJyk7XG4gICAgfSxcblxuICAgIHVucXVvdGU6IGZ1bmN0aW9uKHN0ciwgcXVvdGVDaGFyKSB7XG4gICAgICBxdW90ZUNoYXIgPSBxdW90ZUNoYXIgfHwgJ1wiJztcbiAgICAgIGlmIChzdHJbMF0gPT09IHF1b3RlQ2hhciAmJiBzdHJbc3RyLmxlbmd0aC0xXSA9PT0gcXVvdGVDaGFyKVxuICAgICAgICByZXR1cm4gc3RyLnNsaWNlKDEsc3RyLmxlbmd0aC0xKTtcbiAgICAgIGVsc2UgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG4gICAgZXhwb3J0czogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICAgIGZvciAodmFyIHByb3AgaW4gdGhpcykge1xuICAgICAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkocHJvcCkgfHwgcHJvcC5tYXRjaCgvXig/OmluY2x1ZGV8Y29udGFpbnN8cmV2ZXJzZSkkLykpIGNvbnRpbnVlO1xuICAgICAgICByZXN1bHRbcHJvcF0gPSB0aGlzW3Byb3BdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICByZXBlYXQ6IGZ1bmN0aW9uKHN0ciwgcXR5LCBzZXBhcmF0b3Ipe1xuICAgICAgaWYgKHN0ciA9PSBudWxsKSByZXR1cm4gJyc7XG5cbiAgICAgIHF0eSA9IH5+cXR5O1xuXG4gICAgICAvLyB1c2luZyBmYXN0ZXIgaW1wbGVtZW50YXRpb24gaWYgc2VwYXJhdG9yIGlzIG5vdCBuZWVkZWQ7XG4gICAgICBpZiAoc2VwYXJhdG9yID09IG51bGwpIHJldHVybiBzdHJSZXBlYXQoU3RyaW5nKHN0ciksIHF0eSk7XG5cbiAgICAgIC8vIHRoaXMgb25lIGlzIGFib3V0IDMwMHggc2xvd2VyIGluIEdvb2dsZSBDaHJvbWVcbiAgICAgIGZvciAodmFyIHJlcGVhdCA9IFtdOyBxdHkgPiAwOyByZXBlYXRbLS1xdHldID0gc3RyKSB7fVxuICAgICAgcmV0dXJuIHJlcGVhdC5qb2luKHNlcGFyYXRvcik7XG4gICAgfSxcblxuICAgIG5hdHVyYWxDbXA6IGZ1bmN0aW9uKHN0cjEsIHN0cjIpe1xuICAgICAgaWYgKHN0cjEgPT0gc3RyMikgcmV0dXJuIDA7XG4gICAgICBpZiAoIXN0cjEpIHJldHVybiAtMTtcbiAgICAgIGlmICghc3RyMikgcmV0dXJuIDE7XG5cbiAgICAgIHZhciBjbXBSZWdleCA9IC8oXFwuXFxkKyl8KFxcZCspfChcXEQrKS9nLFxuICAgICAgICB0b2tlbnMxID0gU3RyaW5nKHN0cjEpLnRvTG93ZXJDYXNlKCkubWF0Y2goY21wUmVnZXgpLFxuICAgICAgICB0b2tlbnMyID0gU3RyaW5nKHN0cjIpLnRvTG93ZXJDYXNlKCkubWF0Y2goY21wUmVnZXgpLFxuICAgICAgICBjb3VudCA9IE1hdGgubWluKHRva2VuczEubGVuZ3RoLCB0b2tlbnMyLmxlbmd0aCk7XG5cbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgIHZhciBhID0gdG9rZW5zMVtpXSwgYiA9IHRva2VuczJbaV07XG5cbiAgICAgICAgaWYgKGEgIT09IGIpe1xuICAgICAgICAgIHZhciBudW0xID0gcGFyc2VJbnQoYSwgMTApO1xuICAgICAgICAgIGlmICghaXNOYU4obnVtMSkpe1xuICAgICAgICAgICAgdmFyIG51bTIgPSBwYXJzZUludChiLCAxMCk7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKG51bTIpICYmIG51bTEgLSBudW0yKVxuICAgICAgICAgICAgICByZXR1cm4gbnVtMSAtIG51bTI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhIDwgYiA/IC0xIDogMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodG9rZW5zMS5sZW5ndGggPT09IHRva2VuczIubGVuZ3RoKVxuICAgICAgICByZXR1cm4gdG9rZW5zMS5sZW5ndGggLSB0b2tlbnMyLmxlbmd0aDtcblxuICAgICAgcmV0dXJuIHN0cjEgPCBzdHIyID8gLTEgOiAxO1xuICAgIH0sXG5cbiAgICBsZXZlbnNodGVpbjogZnVuY3Rpb24oc3RyMSwgc3RyMikge1xuICAgICAgaWYgKHN0cjEgPT0gbnVsbCAmJiBzdHIyID09IG51bGwpIHJldHVybiAwO1xuICAgICAgaWYgKHN0cjEgPT0gbnVsbCkgcmV0dXJuIFN0cmluZyhzdHIyKS5sZW5ndGg7XG4gICAgICBpZiAoc3RyMiA9PSBudWxsKSByZXR1cm4gU3RyaW5nKHN0cjEpLmxlbmd0aDtcblxuICAgICAgc3RyMSA9IFN0cmluZyhzdHIxKTsgc3RyMiA9IFN0cmluZyhzdHIyKTtcblxuICAgICAgdmFyIGN1cnJlbnQgPSBbXSwgcHJldiwgdmFsdWU7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHN0cjIubGVuZ3RoOyBpKyspXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDw9IHN0cjEubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBpZiAoaSAmJiBqKVxuICAgICAgICAgICAgaWYgKHN0cjEuY2hhckF0KGogLSAxKSA9PT0gc3RyMi5jaGFyQXQoaSAtIDEpKVxuICAgICAgICAgICAgICB2YWx1ZSA9IHByZXY7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHZhbHVlID0gTWF0aC5taW4oY3VycmVudFtqXSwgY3VycmVudFtqIC0gMV0sIHByZXYpICsgMTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB2YWx1ZSA9IGkgKyBqO1xuXG4gICAgICAgICAgcHJldiA9IGN1cnJlbnRbal07XG4gICAgICAgICAgY3VycmVudFtqXSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgIHJldHVybiBjdXJyZW50LnBvcCgpO1xuICAgIH0sXG5cbiAgICB0b0Jvb2xlYW46IGZ1bmN0aW9uKHN0ciwgdHJ1ZVZhbHVlcywgZmFsc2VWYWx1ZXMpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3RyID09PSBcIm51bWJlclwiKSBzdHIgPSBcIlwiICsgc3RyO1xuICAgICAgaWYgKHR5cGVvZiBzdHIgIT09IFwic3RyaW5nXCIpIHJldHVybiAhIXN0cjtcbiAgICAgIHN0ciA9IF9zLnRyaW0oc3RyKTtcbiAgICAgIGlmIChib29sTWF0Y2goc3RyLCB0cnVlVmFsdWVzIHx8IFtcInRydWVcIiwgXCIxXCJdKSkgcmV0dXJuIHRydWU7XG4gICAgICBpZiAoYm9vbE1hdGNoKHN0ciwgZmFsc2VWYWx1ZXMgfHwgW1wiZmFsc2VcIiwgXCIwXCJdKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICAvLyBBbGlhc2VzXG5cbiAgX3Muc3RyaXAgICAgPSBfcy50cmltO1xuICBfcy5sc3RyaXAgICA9IF9zLmx0cmltO1xuICBfcy5yc3RyaXAgICA9IF9zLnJ0cmltO1xuICBfcy5jZW50ZXIgICA9IF9zLmxycGFkO1xuICBfcy5yanVzdCAgICA9IF9zLmxwYWQ7XG4gIF9zLmxqdXN0ICAgID0gX3MucnBhZDtcbiAgX3MuY29udGFpbnMgPSBfcy5pbmNsdWRlO1xuICBfcy5xICAgICAgICA9IF9zLnF1b3RlO1xuICBfcy50b0Jvb2wgICA9IF9zLnRvQm9vbGVhbjtcblxuICAvLyBFeHBvcnRpbmdcblxuICAvLyBDb21tb25KUyBtb2R1bGUgaXMgZGVmaW5lZFxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKVxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBfcztcblxuICAgIGV4cG9ydHMuX3MgPSBfcztcbiAgfVxuXG4gIC8vIFJlZ2lzdGVyIGFzIGEgbmFtZWQgbW9kdWxlIHdpdGggQU1ELlxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuICAgIGRlZmluZSgndW5kZXJzY29yZS5zdHJpbmcnLCBbXSwgZnVuY3Rpb24oKXsgcmV0dXJuIF9zOyB9KTtcblxuXG4gIC8vIEludGVncmF0ZSB3aXRoIFVuZGVyc2NvcmUuanMgaWYgZGVmaW5lZFxuICAvLyBvciBjcmVhdGUgb3VyIG93biB1bmRlcnNjb3JlIG9iamVjdC5cbiAgcm9vdC5fID0gcm9vdC5fIHx8IHt9O1xuICByb290Ll8uc3RyaW5nID0gcm9vdC5fLnN0ciA9IF9zO1xufSh0aGlzLCBTdHJpbmcpO1xuIl19
;