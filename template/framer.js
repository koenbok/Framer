(function(){var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var cached = require.cache[resolved];
    var res = cached? cached.exports : mod();
    return res;
};

require.paths = [];
require.modules = {};
require.cache = {};
require.extensions = [".js",".coffee",".json"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            x = path.normalize(x);
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = path.normalize(x + '/package.json');
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key);
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

(function () {
    var process = {};
    var global = typeof window !== 'undefined' ? window : {};
    var definedProcess = false;
    
    require.define = function (filename, fn) {
        if (!definedProcess && require.modules.__browserify_process) {
            process = require.modules.__browserify_process();
            definedProcess = true;
        }
        
        var dirname = require._core[filename]
            ? ''
            : require.modules.path().dirname(filename)
        ;
        
        var require_ = function (file) {
            var requiredModule = require(file, dirname);
            var cached = require.cache[require.resolve(file, dirname)];

            if (cached && cached.parent === null) {
                cached.parent = module_;
            }

            return requiredModule;
        };
        require_.resolve = function (name) {
            return require.resolve(name, dirname);
        };
        require_.modules = require.modules;
        require_.define = require.define;
        require_.cache = require.cache;
        var module_ = {
            id : filename,
            filename: filename,
            exports : {},
            loaded : false,
            parent: null
        };
        
        require.modules[filename] = function () {
            require.cache[filename] = module_;
            fn.call(
                module_.exports,
                require_,
                module_,
                module_.exports,
                dirname,
                filename,
                process,
                global
            );
            module_.loaded = true;
            return module_.exports;
        };
    };
})();


require.define("path",function(require,module,exports,__dirname,__filename,process,global){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

});

require.define("__browserify_process",function(require,module,exports,__dirname,__filename,process,global){var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
        && window.setImmediate;
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return window.setImmediate;
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    if (name === 'evals') return (require)('vm')
    else throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    process.cwd = function () { return cwd };
    process.chdir = function (dir) {
        if (!path) path = require('path');
        cwd = path.resolve(dir, cwd);
    };
})();

});

require.define("/css.coffee",function(require,module,exports,__dirname,__filename,process,global){(function() {
  var addStyle;

  addStyle = function(css) {
    var baseStyle, head;
    head = document.getElementsByTagName("head");
    if (head) {
      head = head[0];
    }
    if (!head) {
      head = document.body || document.documentElement;
    }
    baseStyle = document.createElement("style");
    baseStyle.id = "UILayer-base-style";
    baseStyle.appendChild(document.createTextNode(css));
    return head.appendChild(baseStyle);
  };

  addStyle(".uilayer {	display: block;	visibility: visible;	position: absolute;	top:auto; right:auto; bottom:auto; left:auto;	width:auto; height:auto;	overflow: visible;	z-index:0;	opacity:1;	-webkit-box-sizing: border-box;}.uilayer.textureBacked {	-webkit-transform: matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);	-webkit-transform-origin: 50% 50% 0%;	-webkit-backface-visibility: hidden;	-webkit-transform-style: flat;}.uilayer.animated {	-webkit-transition-duration: 500ms;	-webkit-transition-timing-function: linear;	-webkit-transition-delay: 0;	-webkit-transition-property: none;}");

}).call(this);

});

require.define("/utils.coffee",function(require,module,exports,__dirname,__filename,process,global){(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  Function.prototype.define = function(prop, desc) {
    Object.defineProperty(this.prototype, prop, desc);
    return Object.__;
  };

  exports.keys = function(a) {
    var key, _results;
    _results = [];
    for (key in a) {
      _results.push(key);
    }
    return _results;
  };

  exports.extend = function() {
    var a, args, key, obj, value, _i, _len, _ref;
    args = Array.prototype.slice.call(arguments);
    a = args[0];
    _ref = args.slice(1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      for (key in obj) {
        value = obj[key];
        a[key] = value;
      }
    }
    return a;
  };

  exports.update = function(a, b) {
    var keys;
    keys = exports.keys(a);
    exports.extend(a, exports.filter(b, function(k) {
      return __indexOf.call(keys, k) >= 0;
    }));
    return a;
  };

  exports.copy = function(a) {
    return exports.extend({}, a);
  };

  exports.filter = function(a, f) {
    var b, key, value;
    b = {};
    for (key in a) {
      value = a[key];
      if (f(key, value)) {
        b[key] = value;
      }
    }
    return b;
  };

  exports.union = function() {
    return Array.prototype.concat.apply(Array.prototype, arguments);
  };

  exports.toggle = function() {
    var args, curr;
    args = Array.prototype.slice.call(arguments);
    curr = -1;
    return function() {
      curr++;
      if (curr >= args.length) {
        curr = 0;
      }
      return args[curr];
    };
  };

  exports.randomColor = function(alpha) {
    var a, c;
    a = alpha || 1.0;
    c = function() {
      return parseInt(Math.random() * 255);
    };
    return "rgba(" + (c()) + ", " + (c()) + ", " + (c()) + ", " + a + ")";
  };

  exports.delay = function(time, f) {
    var timer, _ref;
    timer = setTimeout(f, time);
    if ((_ref = window._delayTimers) == null) {
      window._delayTimers = [];
    }
    window._delayTimers.push(timer);
    return timer;
  };

  exports.interval = function(time, f) {
    var timer, _ref;
    timer = setInterval(f, time);
    if ((_ref = window._delayIntervals) == null) {
      window._delayIntervals = [];
    }
    window._delayIntervals.push(timer);
    return timer;
  };

  exports.remove = function(a, e) {
    var t;
    if ((t = a.indexOf(e)) > -1) {
      a.splice(t, 1)[0];
    }
    return a;
  };

  exports.debounce = function(func, threshold, execAsap) {
    var timeout;
    timeout = null;
    return function() {
      var args, delayed, obj;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      obj = this;
      delayed = function() {
        if (!execAsap) {
          func.apply(obj, args);
        }
        return timeout = null;
      };
      if (timeout) {
        clearTimeout(timeout);
      } else if (execAsap) {
        func.apply(obj, args);
      }
      return timeout = setTimeout(delayed, threshold || 100);
    };
  };

  exports.throttle = function(fn, delay) {
    var timer;
    if (delay === 0) {
      return fn;
    }
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

  exports.max = function(obj) {
    var max, n, _i, _len;
    for (_i = 0, _len = obj.length; _i < _len; _i++) {
      n = obj[_i];
      if (!max || n > max) {
        max = n;
      }
    }
    return max;
  };

  exports.min = function(obj) {
    var min, n, _i, _len;
    for (_i = 0, _len = obj.length; _i < _len; _i++) {
      n = obj[_i];
      if (!min || n < min) {
        min = n;
      }
    }
    return min;
  };

  exports.sum = function(a) {
    if (a.length > 0) {
      return a.reduce(function(x, y) {
        return x + y;
      });
    } else {
      return 0;
    }
  };

}).call(this);

});

require.define("/views/view.coffee",function(require,module,exports,__dirname,__filename,process,global){(function() {
  var Animation, EventClass, EventEmitter, EventTypes, Frame, Rotation, Spring, View, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils = require("../utils");

  Frame = require("../primitives/frame").Frame;

  Rotation = require("../primitives/rotation").Rotation;

  Spring = require("../primitives/spring").Spring;

  EventTypes = require("../primitives/events").EventTypes;

  EventClass = require("../primitives/events").EventClass;

  EventEmitter = require("../eventemitter").EventEmitter;

  Animation = require("../animation").Animation;

  exports.ViewList = [];

  View = (function(_super) {

    __extends(View, _super);

    function View(args) {
      this.animate = __bind(this.animate, this);
      if (args == null) {
        args = {};
      }
      View.Views.push(this);
      this.id = View.Views.length;
      this._element = document.createElement("div");
      this._element.id = this.id;
      this.addClass("uilayer textureBacked");
      this.properties = args;
      this.clip = true;
      if (!args.superView) {
        this._insertElement();
      }
      this._subViews = [];
      this._animations = [];
      this._postCreate();
    }

    View.prototype._postCreate = function() {};

    View.define("properties", {
      get: function() {
        var key, p, value, _ref;
        p = {};
        _ref = View.Properties;
        for (key in _ref) {
          value = _ref[key];
          p[key] = this[key] || View.Properties[key];
        }
        return p;
      },
      set: function(args) {
        var key, value, _ref, _ref1, _ref2, _results;
        _ref = View.Properties;
        for (key in _ref) {
          value = _ref[key];
          if (args[key]) {
            this[key] = args[key];
          }
        }
        _ref1 = Frame.CalculatedProperties;
        _results = [];
        for (key in _ref1) {
          value = _ref1[key];
          if ((_ref2 = args[key]) !== null && _ref2 !== (void 0)) {
            _results.push(this[key] = args[key]);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    });

    View.define("frame", {
      get: function() {
        return new Frame({
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height
        });
      },
      set: function(value) {
        var p, _i, _len, _ref, _results;
        _ref = ["x", "y", "width", "height"];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          _results.push(this[p] = value[p]);
        }
        return _results;
      }
    });

    View.define("x", {
      get: function() {
        return this._x || 0;
      },
      set: function(value) {
        this._x = value;
        return this._matrix = utils.extend(this._matrix, {
          m41: value
        });
      }
    });

    View.define("y", {
      get: function() {
        return this._y || 0;
      },
      set: function(value) {
        this._y = value;
        return this._matrix = utils.extend(this._matrix, {
          m42: value
        });
      }
    });

    View.define("width", {
      get: function() {
        return this._width || 0;
      },
      set: function(value) {
        this._width = value;
        return this._element.style.width = "" + value + "px";
      }
    });

    View.define("height", {
      get: function() {
        return this._height || 0;
      },
      set: function(value) {
        this._height = value;
        return this._element.style.height = "" + value + "px";
      }
    });

    View.define("_matrix", {
      get: function() {
        return this.__matrix || (this.__matrix = new WebKitCSSMatrix(this._element.style.webkitTransform));
      },
      set: function(value) {
        var m, values;
        m = value || this._matrix;
        if (!m instanceof WebKitCSSMatrix) {
          return this._element.style.webkitTransform = null;
        }
        values = "				matrix3d(					" + m.m11 + ", " + m.m12 + ", " + m.m13 + ", " + m.m14 + ", 					" + m.m21 + ", " + m.m22 + ", " + m.m23 + ", " + m.m24 + ", 					" + m.m31 + ", " + m.m32 + ", " + m.m33 + ", " + m.m34 + ", 					" + m.m41 + ", " + m.m42 + ", " + m.m43 + ", " + m.m44 + ")";
        this.__matrix = m;
        return this._element.style.webkitTransform = value;
      }
    });

    View.define("opacity", {
      get: function() {
        return this._opacity || 1;
      },
      set: function(value) {
        this._opacity = value;
        return this.style["opacity"] = value;
      }
    });

    View.define("scale", {
      get: function() {
        return this._scale;
      },
      set: function(value) {
        this._scale = value;
        return this._matrix = utils.extend(this._matrix, {
          m11: value,
          m22: value,
          m33: value
        });
      }
    });

    View.define("clip", {
      get: function() {
        return this._clip || true;
      },
      set: function(value) {
        this._clip = value;
        if (value === true) {
          this.style.overflow = "hidden";
        }
        if (value === false) {
          return this.style.overflow = "visible";
        }
      }
    });

    View.prototype.removeFromSuperview = function() {
      return this._superView = null;
    };

    View.define("superView", {
      get: function() {
        return this._superView || null;
      },
      set: function(value) {
        if (value === this._superView) {
          return;
        }
        if (this._superView) {
          this._superView._element.removeChild(this._element);
          utils.remove(this._superView._subViews, this);
        }
        if (value) {
          value._element.appendChild(this._element);
          value._subViews.push(this);
        }
        return this._superView = value;
      }
    });

    View.define("subViews", {
      get: function() {
        return this._subViews;
      }
    });

    View.define("_animated", {
      get: function() {
        return this.__animated || false;
      },
      set: function(value) {
        if (value !== true && value !== false) {
          return;
        }
        return this.__animated = value;
      }
    });

    View.define("_animationDuration", {
      get: function() {
        return this.__animationDuration;
      },
      set: function(value) {
        this.__animationDuration = value;
        return this.style["-webkit-transition-duration"] = "" + value + "ms";
      }
    });

    View.define("_animationTimingFunction", {
      get: function() {
        return this.computedStyle["-webkit-transition-timing-function"];
      },
      set: function(value) {
        return this.style["-webkit-transition-timing-function"] = value;
      }
    });

    View.define("_animationTransformOrigin", {
      get: function() {
        return this.computedStyle["-webkit-transform-origin"];
      },
      set: function(value) {
        return this.style["-webkit-transform-origin"] = value;
      }
    });

    View.prototype.animate = function(args, callback) {
      var animation;
      args.view = this;
      animation = new Animation(args);
      animation.start(callback);
      return animation;
    };

    View.define("html", {
      get: function() {
        return this._element.innerHTML;
      },
      set: function(value) {
        return this._element.innerHTML = value;
      }
    });

    View.define("style", {
      get: function() {
        return this._element.style;
      },
      set: function(value) {
        return utils.extend(this._element.style, value);
      }
    });

    View.define("computedStyle", {
      get: function() {
        return document.defaultView.getComputedStyle(this._element);
      },
      set: function(value) {
        throw Error("computedStyle is readonly");
      }
    });

    View.prototype._getPropertyCSSValue = function(name) {
      var value;
      value = this.computedStyle.getPropertyCSSValue(name);
      if (value instanceof CSSValueList) {
        return value[value.length - 1];
      }
      return value;
    };

    View.prototype.addClass = function(className) {
      return this._element.className += " " + className;
    };

    View.prototype.removeClass = function(className) {
      var item, values;
      values = (function() {
        var _i, _len, _ref, _results;
        _ref = this._element.classList;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item && item !== className) {
            _results.push(item);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }).call(this);
      return this._element.className = values.join(" ");
    };

    View.prototype._insertElement = function() {
      return document.body.appendChild(this._element);
    };

    View.prototype.addListener = function(event, listener) {
      if (EventTypes[event]) {
        return this._element.addEventListener(event, listener);
      } else {
        return View.__super__.addListener.apply(this, arguments);
      }
    };

    View.prototype.removeListener = function(event, listener) {
      if (EventTypes[event]) {
        return this._element.removeEventListener(event, listener);
      } else {
        return View.__super__.removeListener.apply(this, arguments);
      }
    };

    View.prototype.on = View.prototype.addListener;

    View.prototype.off = View.prototype.removeListener;

    return View;

  })(Frame);

  View.Properties = utils.extend(Frame.Properties, {
    frame: null,
    scale: 1.0,
    opacity: 1.0,
    rotation: 0,
    style: null,
    html: null,
    "class": "",
    superView: null
  });

  View.Views = [];

  exports.View = View;

}).call(this);

});

require.define("/primitives/frame.coffee",function(require,module,exports,__dirname,__filename,process,global){(function() {
  var EventEmitter, Frame, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils = require("../utils");

  EventEmitter = require("../eventemitter").EventEmitter;

  Frame = (function(_super) {

    __extends(Frame, _super);

    function Frame(args) {
      this.properties = args;
    }

    Frame.define("properties", {
      get: function() {
        var key, p, value, _ref;
        p = {};
        _ref = Frame.Properties;
        for (key in _ref) {
          value = _ref[key];
          p[key] = this[key] || Frame.Properties[key];
        }
        return p;
      },
      set: function(args) {
        var key, value, _ref, _ref1, _ref2, _ref3, _results;
        _ref = Frame.Properties;
        for (key in _ref) {
          value = _ref[key];
          if ((_ref1 = args[key]) !== null && _ref1 !== (void 0)) {
            this[key] = args[key];
          }
        }
        _ref2 = Frame.CalculatedProperties;
        _results = [];
        for (key in _ref2) {
          value = _ref2[key];
          if ((_ref3 = args[key]) !== null && _ref3 !== (void 0)) {
            _results.push(this[key] = args[key]);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    });

    Frame.define("minX", {
      get: function() {
        return this.x;
      },
      set: function(value) {
        return this.x = value;
      }
    });

    Frame.define("midX", {
      get: function() {
        return this.x + (this.width / 2.0);
      },
      set: function(value) {
        if (this.width === 0) {
          throw Error("Width is zero");
        }
        return this.x = value - (this.width / 2.0);
      }
    });

    Frame.define("maxX", {
      get: function() {
        return this.x + this.width;
      },
      set: function(value) {
        if (this.width === 0) {
          throw Error("Width is zero");
        }
        return this.x = value - this.width;
      }
    });

    Frame.define("minY", {
      get: function() {
        return this.y;
      },
      set: function(value) {
        return this.y = value;
      }
    });

    Frame.define("midY", {
      get: function() {
        return this.y + (this.height / 2.0);
      },
      set: function(value) {
        if (this.height === 0) {
          throw Error("Width is zero");
        }
        return this.y = value - (this.height / 2.0);
      }
    });

    Frame.define("maxY", {
      get: function() {
        return this.y + this.height;
      },
      set: function(value) {
        if (this.height === 0) {
          throw Error("Width is zero");
        }
        return this.y = value - this.height;
      }
    });

    return Frame;

  })(EventEmitter);

  Frame.Properties = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  Frame.CalculatedProperties = {
    minX: null,
    midX: null,
    maxX: null,
    minY: null,
    midY: null,
    maxY: null
  };

  exports.Frame = Frame;

}).call(this);

});

require.define("/eventemitter.coffee",function(require,module,exports,__dirname,__filename,process,global){(function() {
  var __slice = [].slice;

  exports.EventEmitter = (function() {

    function EventEmitter() {
      this.events = {};
    }

    EventEmitter.prototype.emit = function() {
      var args, event, listener, _i, _len, _ref, _ref1, _results;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!((_ref = this.events) != null ? _ref[event] : void 0)) {
        return;
      }
      _ref1 = this.events[event];
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        listener = _ref1[_i];
        _results.push(listener.apply(null, args));
      }
      return _results;
    };

    EventEmitter.prototype.addListener = function(event, listener) {
      var _base, _ref, _ref1;
      if ((_ref = this.events) == null) {
        this.events = {};
      }
      if ((_ref1 = (_base = this.events)[event]) == null) {
        _base[event] = [];
      }
      return this.events[event].push(listener);
    };

    EventEmitter.prototype.removeListener = function(event, listener) {
      var l;
      if (!this.events) {
        return;
      }
      if (!this.events[event]) {
        return;
      }
      return this.events[event] = (function() {
        var _i, _len, _ref, _results;
        _ref = this.events[event];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          l = _ref[_i];
          if (l !== listener) {
            _results.push(l);
          }
        }
        return _results;
      }).call(this);
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
      var listener, _i, _len, _ref, _results;
      if (!this.events) {
        return;
      }
      if (!this.events[event]) {
        return;
      }
      _ref = this.events[event];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(this.removeListener(event, listener));
      }
      return _results;
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

    return EventEmitter;

  })();

}).call(this);

});

require.define("/primitives/rotation.coffee",function(require,module,exports,__dirname,__filename,process,global){(function() {

  exports.Rotation = (function() {

    function Rotation(layer) {
      this.layer = layer;
    }

    Rotation.define("x", {
      get: function() {
        return this.layer.rotation.x;
      },
      set: function(value) {
        return this.layer.rotation.x = value;
      }
    });

    Rotation.define("y", {
      get: function() {
        return this.layer.rotation.y;
      },
      set: function(value) {
        return this.layer.rotation.y = value;
      }
    });

    Rotation.define("z", {
      get: function() {
        return this.layer.rotation.z;
      },
      set: function(value) {
        return this.layer.rotation.z = value;
      }
    });

    Rotation.prototype.update = function(values) {
      var p, _i, _len, _ref, _ref1, _results;
      _ref = ["x", "y", "z"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if ((_ref1 = values[p]) !== null && _ref1 !== (void 0)) {
          _results.push(this[p] = values[p]);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Rotation;

  })();

}).call(this);

});

require.define("/primitives/spring.coffee",function(require,module,exports,__dirname,__filename,process,global){(function() {
  var Spring, defaults, springAccelerationForState, springEvaluateState, springEvaluateStateWithDerivative, springIntegrateState,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  defaults = {
    tension: 80,
    friction: 8,
    velocity: 0,
    speed: 1 / 60.0,
    tolerance: 0.01
  };

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

  Spring = (function() {

    function Spring(args) {
      this.next = __bind(this.next, this);

      this.reset = __bind(this.reset, this);
      args = args || {};
      this.velocity = args.velocity || defaults.velocity;
      this.tension = args.tension || defaults.tension;
      this.friction = args.friction || defaults.friction;
      this.speed = args.speed || defaults.speed;
      this.tolerance = args.tolerance || defaults.tolerance;
      this.reset();
    }

    Spring.prototype.reset = function() {
      this.startValue = 0;
      this.currentValue = this.startValue;
      this.endValue = 100;
      return this.moving = true;
    };

    Spring.prototype.next = function() {
      var finalVelocity, net1DVelocity, netFloat, netValueIsLow, netVelocityIsLow, stateAfter, stateBefore, stopSpring, targetValue;
      targetValue = this.currentValue;
      stateBefore = {};
      stateAfter = {};
      stateBefore.x = targetValue - this.endValue;
      stateBefore.v = this.velocity;
      stateBefore.tension = this.tension;
      stateBefore.friction = this.friction;
      stateAfter = springIntegrateState(stateBefore, this.speed);
      this.currentValue = this.endValue + stateAfter.x;
      finalVelocity = stateAfter.v;
      netFloat = stateAfter.x;
      net1DVelocity = stateAfter.v;
      netValueIsLow = Math.abs(netFloat) < this.tolerance;
      netVelocityIsLow = Math.abs(net1DVelocity) < this.tolerance;
      stopSpring = netValueIsLow && netVelocityIsLow;
      this.moving = !stopSpring;
      if (stopSpring) {
        finalVelocity = 0;
        this.currentValue = this.endValue;
      }
      this.velocity = finalVelocity;
      return this.currentValue;
    };

    Spring.prototype.all = function() {
      var _results;
      this.reset();
      _results = [];
      while (this.moving) {
        _results.push(this.next());
      }
      return _results;
    };

    Spring.prototype.time = function() {
      return this.all().length * this.speed;
    };

    return Spring;

  })();

  if (exports) {
    exports.Spring = Spring;
  }

}).call(this);

});

require.define("/primitives/events.coffee",function(require,module,exports,__dirname,__filename,process,global){(function() {
  var Class, Types;

  Class = {
    UIEvent: "UIEvent",
    FocusEvent: "FocusEvent",
    MouseEvent: "MouseEvent",
    TouchEvent: "TouchEvent",
    WheelEvent: "WheelEvent",
    TextEvent: "TextEvent",
    KeyboardEvent: "KeyboardEvent",
    CompositionEvent: "CompositionEvent",
    MutationEvent: "MutationEvent",
    MutationNameEvent: "MutationNameEvent",
    CustomEvent: "CustomEvent",
    TransitionEvent: "TransitionEvent"
  };

  Types = {
    DOMActivate: Class.UIEvent,
    load: Class.UIEvent,
    unload: Class.UIEvent,
    abort: Class.UIEvent,
    error: Class.UIEvent,
    select: Class.UIEvent,
    resize: Class.UIEvent,
    scroll: Class.UIEvent,
    blur: Class.FocusEvent,
    DOMFocusIn: Class.FocusEvent,
    DOMFocusOut: Class.FocusEvent,
    focus: Class.FocusEvent,
    focusin: Class.FocusEvent,
    focusout: Class.FocusEvent,
    click: Class.MouseEvent,
    dblclick: Class.MouseEvent,
    mousedown: Class.MouseEvent,
    mouseenter: Class.MouseEvent,
    mouseleave: Class.MouseEvent,
    mousemove: Class.MouseEvent,
    mouseover: Class.MouseEvent,
    mouseout: Class.MouseEvent,
    mouseup: Class.MouseEvent,
    touchstart: Class.TouchEvent,
    touchmove: Class.TouchEvent,
    touchend: Class.TouchEvent,
    touchcancel: Class.TouchEvent,
    wheel: Class.WheelEvent,
    textinput: Class.TextEvent,
    keydown: Class.KeyboardEvent,
    keypress: Class.KeyboardEvent,
    keyup: Class.KeyboardEvent,
    compositionstart: Class.CompositionEvent,
    compositionupdate: Class.CompositionEvent,
    compositionend: Class.CompositionEvent,
    DOMAttrModified: Class.MutationEvent,
    DOMCharacterDataModified: Class.MutationEvent,
    DOMNodeInserted: Class.MutationEvent,
    DOMNodeInsertedIntoDocument: Class.MutationEvent,
    DOMNodeRemoved: Class.MutationEvent,
    DOMNodeRemovedFromDocument: Class.MutationEvent,
    DOMSubtreeModified: Class.MutationEvent,
    DOMAttributeNameChanged: Class.MutationNameEvent,
    DOMElementNameChanged: Class.MutationNameEvent,
    transitionend: Class.TransitionEvent
  };

  exports.EventClass = Class;

  exports.EventTypes = Types;

}).call(this);

});

require.define("/animation.coffee",function(require,module,exports,__dirname,__filename,process,global){(function() {
  var EventEmitter, PROPERTIES, Spring, parseCurve,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Spring = require("./primitives/spring").Spring;

  EventEmitter = require("./eventemitter").EventEmitter;

  require("./utils");

  PROPERTIES = ["view", "curve", "time", "origin"];

  parseCurve = function(a) {
    a = a.replace("spring", "");
    a = a.replace(/\s+/g, "");
    a = a.replace("(", "");
    a = a.replace(")", "");
    a = a.split(",");
    return a.map(function(i) {
      return parseFloat(i);
    });
  };

  exports.Animation = (function(_super) {

    __extends(Animation, _super);

    function Animation(args) {
      this._animate = __bind(this._animate, this);

      this._startSpring = __bind(this._startSpring, this);

      this._start = __bind(this._start, this);

      this._end = __bind(this._end, this);

      this.start = __bind(this.start, this);

      var p, _i, _len;
      Animation.__super__.constructor.apply(this, arguments);
      for (_i = 0, _len = PROPERTIES.length; _i < _len; _i++) {
        p = PROPERTIES[_i];
        this[p] = args[p];
      }
      this.modifiers = args.modifiers || {};
      this.endProperties = args.properties;
    }

    Animation.prototype.start = function(callback) {
      var _this = this;
      this.beginProperties = this.view.properties;
      this.view._animationTransformOrigin = this.origin;
      return setTimeout(function() {
        return _this._start(callback);
      }, 0);
    };

    Animation.prototype.stop = function() {
      return this._stop = true;
    };

    Animation.prototype._end = function(callback) {
      this.emit("end", this);
      utils.remove(this.view._animations, this);
      return typeof callback === "function" ? callback() : void 0;
    };

    Animation.prototype._start = function(callback) {
      var curve, options, time, values,
        _this = this;
      this.emit("start", this);
      this.view._animations.push(this);
      this._stop = false;
      time = this.time || 300;
      curve = this.curve || "linear";
      if (curve.slice(0, 6) === "spring") {
        if (this.time) {
          console.log("view.animate: ignoring time for spring");
        }
        values = parseCurve(curve);
        options = {
          tension: values[0],
          friction: values[1],
          velocity: values[2],
          speed: 1 / 60
        };
        this._startSpring(options, callback);
        return;
      }
      return this._animate(this.endProperties, curve, time, function() {
        return _this._end(callback);
      });
    };

    Animation.prototype._startSpring = function(options, callback) {
      var beginState, deltas, k, run, v, _ref,
        _this = this;
      this.spring = new Spring(options);
      beginState = {};
      deltas = {};
      _ref = this.endProperties;
      for (k in _ref) {
        v = _ref[k];
        deltas[k] = (this.endProperties[k] - this.beginProperties[k]) / 100.0;
        beginState[k] = this.beginProperties[k];
      }
      run = function() {
        var nextState, value;
        if (!_this.spring.moving || _this._stop) {
          return _this._end(callback);
        }
        value = _this.spring.next();
        if (_this.modifiers[k]) {
          value = _this.modifiers[k](value);
        }
        nextState = {};
        for (k in beginState) {
          v = beginState[k];
          nextState[k] = (deltas[k] * value) + beginState[k];
        }
        return _this._animate(nextState, "linear", _this.spring.speed, run);
      };
      return run();
    };

    Animation.prototype._animate = function(properties, curve, time, callback) {
      var k, v, _results,
        _this = this;
      this.view._animationDuration = time;
      this.view._animationTimingFunction = curve;
      this.timer = setTimeout(function() {
        return typeof callback === "function" ? callback() : void 0;
      }, time);
      _results = [];
      for (k in properties) {
        v = properties[k];
        if (k === "rotation" || k === "opacity" || k === "scale" || k === "x" || k === "y" || k === "z" || k === "width" || k === "height") {
          _results.push(this.view[k] = properties[k]);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Animation.prototype.pause = function() {};

    Animation.prototype.revert = function() {};

    return Animation;

  })(EventEmitter);

}).call(this);

});

require.define("/views/scrollview.coffee",function(require,module,exports,__dirname,__filename,process,global){(function() {
  var Frame, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Frame = require("../primitives/frame").Frame;

  View = require("./view").View;

  exports.ScrollView = (function(_super) {

    __extends(ScrollView, _super);

    function ScrollView() {
      ScrollView.__super__.constructor.apply(this, arguments);
      this.style["overflow"] = "scroll";
      this.style["-webkit-overflow-scrolling"] = "touch";
      this.style["overflow-x"] = "scroll";
      this.style["overflow-y"] = "scroll";
    }

    ScrollView.define("scrollVertical", {
      get: function() {
        return this.style["overflow-y"] !== "hidden";
      },
      set: function(value) {
        return this.style["overflow-y"] = value ? "scroll" : "hidden";
      }
    });

    ScrollView.define("scrollHorizontal", {
      get: function() {
        return this.style["overflow-x"] !== "hidden";
      },
      set: function(value) {
        return this.style["overflow-x"] = value ? "scroll" : "hidden";
      }
    });

    ScrollView.prototype.scrollToTop = function() {
      return this._element.scrollTop = 0;
    };

    ScrollView.prototype.scrollToBottom = function() {
      var _this = this;
      return setTimeout(function() {
        return _this.scrollPoint = _this._element.scrollHeight - _this.frame.height;
      }, 0);
    };

    ScrollView.define("scrollPoint", {
      get: function() {
        return this._element.scrollTop;
      },
      set: function(value) {
        return this._element.scrollTop = value;
      }
    });

    ScrollView.define("scrollFrame", {
      get: function() {
        return new Frame({
          x: this._element.scrollLeft,
          y: this._element.scrollTop,
          width: this.width,
          height: this.height
        });
      },
      set: function(frame) {
        this._element.scrollLeft = frame.x;
        return this._element.scrollTop = frame.y;
      }
    });

    return ScrollView;

  })(View);

}).call(this);

});

require.define("/views/imageview.coffee",function(require,module,exports,__dirname,__filename,process,global){(function() {
  var View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require("./view").View;

  exports.ImageView = (function(_super) {

    __extends(ImageView, _super);

    function ImageView(args) {
      ImageView.__super__.constructor.apply(this, arguments);
      this.style["background-repeat"] = "no-repeat";
      this.style["background-size"] = "cover";
      this.image = args.image;
    }

    ImageView.define("html", {
      get: function() {
        return this._element.innerHTML;
      },
      set: function(value) {
        return this._element.innerHTML = value;
      }
    });

    ImageView.define("image", {
      get: function() {
        return this._image;
      },
      set: function(value) {
        var loader,
          _this = this;
        if (this._image === value) {
          return this.emit("load", loader);
        }
        this._image = value;
        loader = new Image();
        loader.name = this.image;
        loader.src = this.image;
        loader.onload = function() {
          _this.style["background-image"] = "url('" + _this.image + "')";
          return _this.emit("load", loader);
        };
        return loader.onerror = function() {
          return _this.emit("error", loader);
        };
      }
    });

    return ImageView;

  })(View);

}).call(this);

});

require.define("/init.coffee",function(require,module,exports,__dirname,__filename,process,global){(function() {
  var Animation, Frame, Global, ImageView, ScrollView, Spring, View, ViewList, k, toggler, utils, v;

  require("./css");

  utils = require("./utils");

  View = require("./views/view").View;

  ViewList = require("./views/view").ViewList;

  ScrollView = require("./views/scrollview").ScrollView;

  ImageView = require("./views/imageview").ImageView;

  Animation = require("./animation").Animation;

  Frame = require("./primitives/frame").Frame;

  Spring = require("./primitives/spring").Spring;

  Global = {};

  Global.View = View;

  Global.ScrollView = ScrollView;

  Global.ImageView = ImageView;

  Global.Animation = Animation;

  Global.Frame = Frame;

  Global.Spring = Spring;

  Global.utils = utils;

  Global.ViewList = ViewList;

  if (window) {
    window.Framer = Global;
    for (k in Global) {
      v = Global[k];
      window[k] = v;
    }
  }

  Global.debug = function(value) {
    var colorValue, debugStyle, key, view, _i, _len;
    for (_i = 0, _len = ViewList.length; _i < _len; _i++) {
      view = ViewList[_i];
      if (value === true) {
        colorValue = function() {
          return parseInt(Math.random() * 255);
        };
        debugStyle = {
          backgroundImage: "",
          backgroundColor: "rgba(0,100,255,0.2)"
        };
        view._debugStyle = {};
        for (key in debugStyle) {
          view._debugStyle[key] = view.style[key];
        }
        view.style = debugStyle;
      } else if (value === false) {
        view.style = view._debugStyle;
      } else {
        return;
      }
    }
    return Global._debug = value;
  };

  toggler = utils.toggle(true, false);

  window.addEventListener("keydown", function(e) {
    if (e.keyCode === 68 && e.shiftKey) {
      return Global.debug(toggler());
    }
  });

}).call(this);

});
require("/init.coffee");
})();
