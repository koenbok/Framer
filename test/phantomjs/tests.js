(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":5}],2:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],5:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":4,"_process":3,"inherits":2}],6:[function(require,module,exports){

!function(){

function extend(dst, src){
    for (var key in src)
        dst[key] = src[key]
    return src
}
    
var Simulate = {
    event: function(element, eventName){
        if (document.createEvent) {
            var evt = document.createEvent("HTMLEvents")
            evt.initEvent(eventName, true, true )
            element.dispatchEvent(evt)
        }else{
            var evt = document.createEventObject()
            element.fireEvent('on' + eventName,evt)
        }
    },
    keyEvent: function(element, type, options){
        var evt,
            e = {
            bubbles: true, cancelable: true, view: window,
          	ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
          	keyCode: 0, charCode: 0
        }
        extend(e, options)
        if (document.createEvent){
            try{
                evt = document.createEvent('KeyEvents')
                evt.initKeyEvent(
                    type, e.bubbles, e.cancelable, e.view,
    				e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
    				e.keyCode, e.charCode)
    			element.dispatchEvent(evt)
    		}catch(err){
    		    evt = document.createEvent("Events")
				evt.initEvent(type, e.bubbles, e.cancelable)
				extend(evt, {
				    view: e.view,
					ctrlKey: e.ctrlKey, altKey: e.altKey,
					shiftKey: e.shiftKey, metaKey: e.metaKey,
					keyCode: e.keyCode, charCode: e.charCode
				})
				element.dispatchEvent(evt)
    		}
        }
    }
}

Simulate.keypress = function(element, chr){
    var charCode = chr.charCodeAt(0)
    this.keyEvent(element, 'keypress', {
        keyCode: charCode,
        charCode: charCode
    })
}

Simulate.keydown = function(element, chr){
    var charCode = chr.charCodeAt(0)
    this.keyEvent(element, 'keydown', {
        keyCode: charCode,
        charCode: charCode
    })
}

Simulate.keyup = function(element, chr){
    var charCode = chr.charCodeAt(0)
    this.keyEvent(element, 'keyup', {
        keyCode: charCode,
        charCode: charCode
    })
}

var events = [
    'click',
    'focus',
    'blur',
    'dblclick',
    'input',
    'change',
    'mousedown',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'resize',
    'scroll',
    'select',
    'submit',
    'load',
    'unload'
]

for (var i = events.length; i--;){
    var event = events[i]
    Simulate[event] = (function(evt){
        return function(element){
            this.event(element, evt)
        }
    }(event))
}

if (typeof module !== 'undefined'){
    module.exports = Simulate
}else if (typeof window !== 'undefined'){
    window.Simulate = Simulate
}else if (typeof define !== 'undefined'){
    define(function(){ return Simulate })
}

}()

},{}],7:[function(require,module,exports){
var assert;

window.console.debug = function(v) {};

mocha.setup('bdd');

mocha.globals(['__import__']);

assert = chai.assert;

require("./tests/EventEmitterTest");

require("./tests/UtilsTest");

require("./tests/BaseClassTest");

require("./tests/FrameTest");

require("./tests/LayerTest");

require("./tests/LayerStatesTest");

require("./tests/VideoLayerTest");

require("./tests/CompatTest");

require("./tests/ImporterTest");

require("./tests/LayerAnimationTest");

require("./tests/ContextTest");

if (window.mochaPhantomJS) {
  mochaPhantomJS.run();
} else {
  mocha.run();
}



},{"./tests/BaseClassTest":8,"./tests/CompatTest":9,"./tests/ContextTest":10,"./tests/EventEmitterTest":11,"./tests/FrameTest":12,"./tests/ImporterTest":13,"./tests/LayerAnimationTest":14,"./tests/LayerStatesTest":15,"./tests/LayerTest":16,"./tests/UtilsTest":17,"./tests/VideoLayerTest":18}],8:[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

describe("BaseClass", function() {
  var TestClass, testProperty;
  testProperty = function(name, fallback) {
    return {
      exportable: true,
      "default": fallback,
      get: function() {
        return this._getPropertyValue(name);
      },
      set: function(value) {
        return this._setPropertyValue(name, value);
      }
    };
  };
  it("should be unique per instance", function() {
    var TestClassA, TestClassB, a, b;
    TestClassA = (function(superClass) {
      extend(TestClassA, superClass);

      function TestClassA() {
        return TestClassA.__super__.constructor.apply(this, arguments);
      }

      TestClassA.define("testA", testProperty("testA", 100));

      return TestClassA;

    })(Framer.BaseClass);
    TestClassB = (function(superClass) {
      extend(TestClassB, superClass);

      function TestClassB() {
        return TestClassB.__super__.constructor.apply(this, arguments);
      }

      TestClassB.define("testB", testProperty("testB", 100));

      return TestClassB;

    })(Framer.BaseClass);
    a = new TestClassA();
    b = new TestClassB();
    a.props.should.eql({
      testA: 100
    });
    return b.props.should.eql({
      testB: 100
    });
  });
  TestClass = (function(superClass) {
    extend(TestClass, superClass);

    function TestClass() {
      return TestClass.__super__.constructor.apply(this, arguments);
    }

    TestClass.define("width", testProperty("width", 0));

    TestClass.define("height", testProperty("height", 0));

    return TestClass;

  })(Framer.BaseClass);
  it("should set defaults", function() {
    var testClass;
    testClass = new TestClass();
    testClass.width.should.equal(0);
    return testClass.height.should.equal(0);
  });
  it("should set defaults on construction", function() {
    var testClass;
    testClass = new TestClass({
      width: 100,
      height: 100
    });
    testClass.width.should.equal(100);
    return testClass.height.should.equal(100);
  });
  it("should set a property value", function() {
    var testClass;
    testClass = new TestClass();
    testClass.width = 500;
    testClass.width.should.equal(500);
    return testClass.height.should.equal(0);
  });
  it("should set to zero", function() {
    var TestClass2, testClass;
    TestClass2 = (function(superClass) {
      extend(TestClass2, superClass);

      function TestClass2() {
        return TestClass2.__super__.constructor.apply(this, arguments);
      }

      TestClass2.define("test", testProperty("test", 100));

      return TestClass2;

    })(Framer.BaseClass);
    testClass = new TestClass2();
    testClass.test.should.equal(100);
    testClass.test = 0;
    return testClass.test.should.equal(0);
  });
  it("should override defaults", function() {
    var testClass;
    testClass = new TestClass({
      width: 500
    });
    testClass.width.should.equal(500);
    return testClass.height.should.equal(0);
  });
  it("should get props", function() {
    var testClass;
    testClass = new TestClass({
      width: 500
    });
    return testClass.props.should.eql({
      width: 500,
      height: 0
    });
  });
  it("should set props", function() {
    var testClass;
    testClass = new TestClass;
    testClass.props.should.eql({
      width: 0,
      height: 0
    });
    testClass.props = {
      width: 500,
      height: 500
    };
    return testClass.props.should.eql({
      width: 500,
      height: 500
    });
  });
  it("should have keys", function() {
    var TestClass3, testClass;
    TestClass3 = (function(superClass) {
      extend(TestClass3, superClass);

      function TestClass3() {
        return TestClass3.__super__.constructor.apply(this, arguments);
      }

      TestClass3.define("testA", TestClass3.simpleProperty("testA", 100));

      TestClass3.define("testB", TestClass3.simpleProperty("testB", 100));

      return TestClass3;

    })(Framer.BaseClass);
    testClass = new TestClass3();
    return testClass.keys().should.eql(["testA", "testB"]);
  });
  it("should have keys", function() {
    var TestClass3, testClass;
    TestClass3 = (function(superClass) {
      extend(TestClass3, superClass);

      function TestClass3() {
        return TestClass3.__super__.constructor.apply(this, arguments);
      }

      TestClass3.define("testA", TestClass3.simpleProperty("testA", 100));

      TestClass3.define("testB", TestClass3.simpleProperty("testB", 100));

      return TestClass3;

    })(Framer.BaseClass);
    testClass = new TestClass3();
    return testClass.keys().should.eql(["testA", "testB"]);
  });
  it("should create getters/setters", function() {
    var TestClass4, testClass;
    TestClass4 = (function(superClass) {
      extend(TestClass4, superClass);

      function TestClass4() {
        return TestClass4.__super__.constructor.apply(this, arguments);
      }

      TestClass4.define("testA", TestClass4.simpleProperty("testA", 100));

      return TestClass4;

    })(Framer.BaseClass);
    testClass = new TestClass4();
    testClass.setTestA(500);
    testClass.getTestA().should.equal(500);
    return testClass.testA.should.equal(500);
  });
  it("should override getters/setters", function() {
    var TestClass5, TestClass6, testClass;
    TestClass5 = (function(superClass) {
      extend(TestClass5, superClass);

      function TestClass5() {
        return TestClass5.__super__.constructor.apply(this, arguments);
      }

      TestClass5.define("testA", TestClass5.simpleProperty("testA", 100));

      return TestClass5;

    })(Framer.BaseClass);
    TestClass6 = (function(superClass) {
      extend(TestClass6, superClass);

      function TestClass6() {
        return TestClass6.__super__.constructor.apply(this, arguments);
      }

      TestClass6.prototype.setTestA = function(value) {
        return TestClass6.__super__.setTestA.call(this, value * 10);
      };

      return TestClass6;

    })(TestClass5);
    testClass = new TestClass6();
    testClass.setTestA(500);
    testClass.getTestA().should.equal(5000);
    return testClass.testA.should.equal(5000);
  });
  return it("should work with proxyProperties", function() {
    var TestClass7, testClass;
    TestClass7 = (function(superClass) {
      extend(TestClass7, superClass);

      TestClass7.define("testA", TestClass7.proxyProperty("poop.hello"));

      function TestClass7() {
        TestClass7.__super__.constructor.apply(this, arguments);
        this.poop = {
          hello: 100
        };
      }

      return TestClass7;

    })(Framer.BaseClass);
    testClass = new TestClass7();
    testClass.poop.hello.should.equal(100);
    testClass.testA.should.equal(100);
    testClass.testA = 200;
    return testClass.poop.hello.should.equal(200);
  });
});



},{}],9:[function(require,module,exports){
describe("Compat", function() {
  return describe("Defaults", function() {
    it("should create views", function() {
      var view;
      view = new View;
      view.x.should.equal(0);
      view.y.should.equal(0);
      view.width.should.equal(100);
      return view.height.should.equal(100);
    });
    it("should set superview", function() {
      var viewA, viewB;
      viewA = new View;
      viewB = new View;
      viewB.superView = viewA;
      viewB.superView.should.equal(viewA);
      return viewB.superLayer.should.equal(viewA);
    });
    it("should set superview on layer", function() {
      var layerA, layerB;
      layerA = new Layer;
      layerB = new Layer;
      layerB.superView = layerA;
      layerB.superView.should.equal(layerA);
      return layerB.superLayer.should.equal(layerA);
    });
    it("should set superview on create", function() {
      var viewA, viewB;
      viewA = new View;
      viewB = new View({
        superView: viewA
      });
      viewB.superView.should.equal(viewA);
      return viewB.superLayer.should.equal(viewA);
    });
    it("should create scrollview", function() {
      var view;
      view = new ScrollView;
      return view.scroll.should.equal(true);
    });
    return it("should create imageview", function() {
      var imagePath, view;
      imagePath = "static/test.png";
      view = new ImageView({
        image: imagePath
      });
      return view.image.should.equal(imagePath);
    });
  });
});



},{}],10:[function(require,module,exports){
var assert;

assert = require("assert");

describe("Context", function() {
  describe("Reset", function() {});
  return describe("Events", function() {
    it("should emit reset", function(callback) {
      var context;
      context = new Framer.Context({
        name: "Test"
      });
      context.on("reset", function() {
        return callback();
      });
      return context.reset();
    });
    it("should emit layer create", function(callback) {
      var context;
      context = new Framer.Context({
        name: "Test"
      });
      context.on("layer:create", function() {
        context.getLayers().length.should.equal(1);
        return callback();
      });
      return context.run(function() {
        var layer;
        return layer = new Layer;
      });
    });
    it("should emit layer destroy", function(callback) {
      var context;
      context = new Framer.Context({
        name: "Test"
      });
      context.on("layer:create", function() {
        return context.getLayers().length.should.equal(1);
      });
      context.on("layer:destroy", function() {
        context.getLayers().length.should.equal(0);
        return callback();
      });
      return context.run(function() {
        var layer;
        layer = new Layer;
        return layer.destroy();
      });
    });
    return it("should keep layer id count per context", function() {
      var context;
      context = new Framer.Context({
        name: "Test"
      });
      context.run(function() {
        var layer;
        layer = new Layer;
        layer.id.should.equal(1);
        layer = new Layer;
        return layer.id.should.equal(2);
      });
      context.reset();
      return context.run(function() {
        var layer;
        layer = new Layer;
        layer.id.should.equal(1);
        layer = new Layer;
        return layer.id.should.equal(2);
      });
    });
  });
});



},{"assert":1}],11:[function(require,module,exports){
describe("EventEmitter", function() {
  it("should listen", function() {
    var count, handler, tester;
    tester = new Framer.EventEmitter;
    count = 0;
    handler = function() {
      return count++;
    };
    tester.on("test", handler);
    tester.emit("test");
    return count.should.equal(1);
  });
  it("should stop listening", function() {
    var count, handler, tester;
    tester = new Framer.EventEmitter;
    count = 0;
    handler = function() {
      return count++;
    };
    tester.on("test", handler);
    tester.emit("test");
    count.should.equal(1);
    tester.off("test", handler);
    tester.emit("test");
    return count.should.equal(1);
  });
  return it("should listen once", function() {
    var count, handler, tester;
    tester = new Framer.EventEmitter;
    count = 0;
    handler = function() {
      return count++;
    };
    tester.once("test", handler);
    tester.emit("test");
    tester.emit("test");
    tester.emit("test");
    return count.should.equal(1);
  });
});



},{}],12:[function(require,module,exports){
describe("Frame", function() {
  return describe("Defaults", function() {
    it("should set defaults", function() {
      var frame;
      frame = new Frame;
      frame.x.should.equal(0);
      frame.y.should.equal(0);
      frame.width.should.equal(0);
      return frame.height.should.equal(0);
    });
    it("should set on create", function() {
      var frame;
      frame = new Frame({
        x: 100,
        y: 100,
        width: 100,
        height: 100
      });
      frame.x.should.equal(100);
      frame.y.should.equal(100);
      frame.width.should.equal(100);
      return frame.height.should.equal(100);
    });
    it("should set minX", function() {
      var frame;
      frame = new Frame({
        minX: 200,
        y: 100,
        width: 100,
        height: 100
      });
      return frame.x.should.equal(200);
    });
    it("should set midX", function() {
      var frame;
      frame = new Frame({
        midX: 200,
        y: 100,
        width: 100,
        height: 100
      });
      return frame.x.should.equal(150);
    });
    it("should set maxX", function() {
      var frame;
      frame = new Frame({
        maxX: 200,
        y: 100,
        width: 100,
        height: 100
      });
      return frame.x.should.equal(100);
    });
    it("should set minY", function() {
      var frame;
      frame = new Frame({
        x: 100,
        minY: 200,
        width: 100,
        height: 100
      });
      return frame.y.should.equal(200);
    });
    it("should set midY", function() {
      var frame;
      frame = new Frame({
        x: 100,
        midY: 200,
        width: 100,
        height: 100
      });
      return frame.y.should.equal(150);
    });
    return it("should set maxY", function() {
      var frame;
      frame = new Frame({
        x: 100,
        maxY: 200,
        width: 100,
        height: 100
      });
      return frame.y.should.equal(100);
    });
  });
});



},{}],13:[function(require,module,exports){
var assert;

assert = require("assert");

describe("ExternalDocument", function() {
  var compareDocument;
  compareDocument = function(name) {
    var dataA, dataB, jsonA, jsonB, layer, layerName, layers, path, ref;
    path = "../static/ExternalDocument";
    layers = Framer.Importer.load(Utils.pathJoin(path, name));
    dataA = Framer.Utils.domLoadJSONSync(Utils.pathJoin(path, name + ".out.json"));
    dataB = {};
    for (layerName in layers) {
      layer = layers[layerName];
      dataB[layerName] = {
        frame: layer.frame,
        superLayerName: (ref = layer.superLayer) != null ? ref.layerName : void 0,
        subLayerNames: layer.subLayers.map(function(l) {
          return l.name;
        })
      };
    }
    jsonA = JSON.stringify(dataA, null, "\t");
    jsonB = JSON.stringify(dataB, null, "\t");
    if (jsonA !== jsonB) {
      console.log("");
      console.log("Name: " + name);
      console.log(jsonB);
    }
    return assert.equal(jsonA, jsonB);
  };
  if (!Utils.isChrome()) {
    describe("External Files", function() {
      it("Android", function() {
        return compareDocument("Android");
      });
      it("Square", function() {
        return compareDocument("Square");
      });
      return it("Test", function() {
        return compareDocument("Test");
      });
    });
  }
  return describe("Shady Hacks", function() {
    return it("Should work on Chrome", function() {
      var data, importer;
      if (window.__imported__ == null) {
        window.__imported__ = {};
      }
      window.__imported__["Android/layers.json.js"] = "hello";
      importer = new Framer.Importer("imported/Android");
      data = importer._loadlayerInfo();
      return data.should.equal("hello");
    });
  });
});



},{"assert":1}],14:[function(require,module,exports){
var AnimationProperties, AnimationTime,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

AnimationTime = 0.05;

AnimationProperties = ["x", "y", "midY", "rotation"];

describe("LayerAnimation", function() {
  describe("Defaults", function() {
    it("should use defaults", function() {
      var animation;
      Framer.Defaults.Animation = {
        curve: "spring(1,2,3)"
      };
      animation = new Animation({
        layer: new Layer(),
        properties: {
          x: 50
        }
      });
      animation.options.curve.should.equal("spring(1,2,3)");
      return Framer.resetDefaults();
    });
    return it("should use linear", function() {
      var animation;
      animation = new Animation({
        layer: new Layer(),
        properties: {
          x: 50
        }
      });
      animation.options.curve.should.equal("linear");
      return animation.options.time.should.equal(1);
    });
  });
  describe("Properties", function() {
    AnimationProperties.map(function(p) {
      it("should animate property " + p, function(done) {
        var layer, properties;
        layer = new Layer();
        properties = {};
        properties[p] = 100;
        layer.animate({
          properties: properties,
          curve: "linear",
          time: AnimationTime
        });
        return layer.on("end", function() {
          layer[p].should.equal(100);
          return done();
        });
      });
      it("should animate property " + p + " with positive offset from current value", function(done) {
        var layer, properties;
        layer = new Layer();
        layer[p] = 50;
        properties = {};
        properties[p] = '+=50';
        layer.animate({
          properties: properties,
          curve: "linear",
          time: AnimationTime
        });
        return layer.on("end", function() {
          layer[p].should.equal(100);
          return done();
        });
      });
      return it("should animate property " + p + " with negative offset from current value", function(done) {
        var layer, properties;
        layer = new Layer();
        layer[p] = 50;
        properties = {};
        properties[p] = '+=50';
        layer.animate({
          properties: properties,
          curve: "linear",
          time: AnimationTime
        });
        return layer.on("end", function() {
          layer[p].should.equal(100);
          return done();
        });
      });
    });
    return it("should animate dynamic properties", function(done) {
      var layer;
      layer = new Layer();
      layer.animate({
        properties: {
          scale: function() {
            return layer.scale + 1;
          }
        },
        curve: "linear",
        time: AnimationTime
      });
      return layer.on("end", function() {
        layer.scale.should.equal(2);
        return done();
      });
    });
  });
  describe("Basic", function() {
    it("should stop", function(done) {
      var animation, layer;
      layer = new Layer();
      animation = new Animation({
        layer: layer,
        properties: {
          x: 50
        },
        curve: "linear",
        time: 0.5
      });
      animation.start();
      return Utils.delay(animation.options.time / 2.0, function() {
        animation.stop();
        layer.x.should.be.within(10, 40);
        return done();
      });
    });
    return it("should cancel previous animation for the same property", function() {
      var animationA, animationB, layer, stopped;
      layer = new Layer();
      animationA = new Animation({
        layer: layer,
        properties: {
          x: 50
        },
        curve: "linear",
        time: 0.5
      });
      animationB = new Animation({
        layer: layer,
        properties: {
          x: 50
        },
        curve: "linear",
        time: 0.5
      });
      stopped = false;
      animationA.on("stop", function() {
        return stopped = true;
      });
      animationA.start().should.equal(true);
      animationB.start().should.equal(true);
      return stopped.should.equal(true);
    });
  });
  describe("Context", function() {
    it("should list running animations", function() {
      var animation, layer;
      layer = new Layer();
      animation = layer.animate({
        properties: {
          x: 100
        },
        time: 0.5
      });
      (indexOf.call(layer.animations(), animation) >= 0).should.be["true"];
      layer.animateStop();
      return (indexOf.call(layer.animations(), animation) >= 0).should.be["false"];
    });
    it("should list running animations correctly", function(done) {
      var animation, count, layer, test;
      layer = new Layer();
      animation = layer.animate({
        properties: {
          x: 100
        },
        time: 0.5
      });
      count = 0;
      test = function() {
        layer.animations().length.should.equal(0);
        count++;
        if (count === 2) {
          return done();
        }
      };
      animation.on("end", test);
      return animation.on("stop", test);
    });
    return it("should tell you if animations are running", function() {
      var animation, layer;
      layer = new Layer();
      animation = layer.animate({
        properties: {
          x: 100
        },
        time: 0.5
      });
      layer.isAnimating.should.equal(true);
      layer.animateStop();
      return layer.isAnimating.should.equal(false);
    });
  });
  describe("Events", function() {
    it("should throw start", function(done) {
      var animation, count, layer;
      layer = new Layer();
      animation = new Animation({
        layer: layer,
        properties: {
          x: 50
        },
        curve: "linear",
        time: AnimationTime
      });
      count = 0;
      animation.on("start", function() {
        return count++;
      });
      layer.on("start", function() {
        return count++;
      });
      animation.start();
      return layer.on("end", function() {
        count.should.equal(2);
        return done();
      });
    });
    it("should throw end", function(done) {
      var animation, count, layer, test;
      layer = new Layer();
      animation = new Animation({
        layer: layer,
        properties: {
          x: 50
        },
        curve: "linear",
        time: AnimationTime
      });
      count = 0;
      test = function() {
        count++;
        if (count === 2) {
          return done();
        }
      };
      animation.on("end", test);
      layer.on("end", test);
      return animation.start();
    });
    return it("should throw stop", function(done) {
      var animation, count, layer, test;
      layer = new Layer();
      animation = new Animation({
        layer: layer,
        properties: {
          x: 50
        },
        curve: "linear",
        time: AnimationTime * 2
      });
      count = 0;
      test = function() {
        count++;
        if (count === 2) {
          return done();
        }
      };
      animation.on("stop", test);
      layer.on("stop", test);
      animation.start();
      return Utils.delay(AnimationTime, function() {
        return animation.stop();
      });
    });
  });
  describe("Delay", function() {
    return it("should start after a while", function(done) {
      var animation, layer;
      layer = new Layer();
      animation = new Animation({
        layer: layer,
        properties: {
          x: 50
        },
        curve: "linear",
        time: AnimationTime,
        delay: AnimationTime
      });
      animation.start();
      return Utils.delay(AnimationTime, function() {
        layer.x.should.be.within(0, 1);
        return Utils.delay(AnimationTime, function() {
          layer.x.should.be.within(30, 50);
          return done();
        });
      });
    });
  });
  describe("Repeat", function() {
    return it("should start repeatedly", function(done) {
      var animation, count, layer;
      layer = new Layer();
      animation = new Animation({
        layer: layer,
        properties: {
          x: function() {
            return layer.x + 100;
          }
        },
        curve: "linear",
        time: AnimationTime,
        repeat: 5
      });
      animation.start();
      count = 0;
      return layer.on("end", function() {
        count++;
        if (count === animation.options.repeat) {
          return done();
        }
      });
    });
  });
  describe("AnimationLoop", function() {
    return it("should only stop when all animations are done", function(done) {
      var layerA, layerB, layerC, ready, readyLayers;
      layerA = new Layer({
        width: 80,
        height: 80
      });
      layerA.name = "layerA";
      layerA.animate({
        properties: {
          y: 300
        },
        time: 2 * AnimationTime
      });
      layerB = new Layer({
        width: 80,
        height: 80,
        x: 100,
        backgroundColor: "red"
      });
      layerB.name = "layerB";
      layerB.animate({
        properties: {
          y: 300
        },
        time: 5 * AnimationTime
      });
      layerC = new Layer({
        width: 80,
        height: 80,
        x: 200,
        backgroundColor: "orange"
      });
      layerC.name = "layerC";
      layerC.animate({
        properties: {
          y: 300
        },
        time: 2 * AnimationTime,
        curve: "cubic-bezier"
      });
      readyLayers = [];
      ready = function(animation, layer) {
        (indexOf.call(readyLayers, layer) >= 0).should.equal(false);
        readyLayers.push(layer);
        if (readyLayers.length === 3) {
          layerA.y.should.equal(300);
          layerB.y.should.equal(300);
          layerC.y.should.equal(300);
          return done();
        }
      };
      layerA.on("end", ready);
      layerB.on("end", ready);
      return layerC.on("end", ready);
    });
  });
  return describe("Animation", function() {
    beforeEach(function() {
      return this.layer = new Layer({
        x: 0,
        y: 0,
        width: 80,
        height: 80
      });
    });
    describe("Parsing Animation Options", function() {
      return describe("BezierCurveAnimator", function() {
        it("should create animation with bezier curve defined by values array and time in curveOptions", function() {
          var animation;
          animation = new Animation({
            layer: this.layer,
            properties: {
              x: 100
            },
            curve: 'cubic-bezier',
            curveOptions: {
              time: 2,
              values: [0, 0, 0.58, 1]
            }
          });
          animation.start();
          animation._animator.options.time.should.equal(2);
          return animation._animator.options.values.should.eql([0, 0, .58, 1]);
        });
        it("should create animation with bezier curve defined by named bezier curve in values and time in curveOptions", function() {
          var animation;
          animation = new Animation({
            layer: this.layer,
            properties: {
              x: 100
            },
            curve: 'cubic-bezier',
            curveOptions: {
              time: 2,
              values: 'ease-out'
            }
          });
          animation.start();
          animation._animator.options.time.should.equal(2);
          return animation._animator.options.values.should.eql([0, 0, .58, 1]);
        });
        it("should create animation with named bezier curve", function() {
          var animation;
          animation = new Animation({
            layer: this.layer,
            properties: {
              x: 100
            },
            curve: 'cubic-bezier',
            curveOptions: 'ease-out'
          });
          animation.start();
          animation._animator.options.time.should.equal(1);
          return animation._animator.options.values.should.eql([0, 0, .58, 1]);
        });
        it("should create animation with named bezier curve and time", function() {
          var animation;
          animation = new Animation({
            layer: this.layer,
            properties: {
              x: 100
            },
            time: 2,
            curve: 'cubic-bezier',
            curveOptions: 'ease-out'
          });
          animation.start();
          animation._animator.options.time.should.equal(2);
          return animation._animator.options.values.should.eql([0, 0, .58, 1]);
        });
        it("should create animation with bezier curve function passed in as a string and time", function() {
          var animation;
          animation = new Animation({
            layer: this.layer,
            properties: {
              x: 100
            },
            time: 2,
            curve: 'cubic-bezier(0, 0, 0.58, 1)'
          });
          animation.start();
          animation._animator.options.time.should.equal(2);
          return animation._animator.options.values.should.eql([0, 0, .58, 1]);
        });
        return it("should create animation with bezier curve defined by an array and time", function() {
          var animation;
          animation = new Animation({
            layer: this.layer,
            properties: {
              x: 100
            },
            time: 2,
            curve: 'cubic-bezier',
            curveOptions: [0, 0, 0.58, 1]
          });
          animation.start();
          animation._animator.options.time.should.equal(2);
          return animation._animator.options.values.should.eql([0, 0, .58, 1]);
        });
      });
    });
    return describe("LinearAnimator", function() {
      it("should create linear animation with time defined outside of curveOptions", function() {
        var animation;
        animation = new Animation({
          layer: this.layer,
          properties: {
            x: 100
          },
          curve: 'linear',
          time: 2
        });
        animation.start();
        return animation._animator.options.time.should.equal(2);
      });
      return it("should create linear animation with time defined inside curveOptions", function() {
        var animation;
        animation = new Animation({
          layer: this.layer,
          properties: {
            x: 100
          },
          curve: 'linear',
          curveOptions: {
            time: 2
          }
        });
        animation.start();
        return animation._animator.options.time.should.equal(2);
      });
    });
  });
});



},{}],15:[function(require,module,exports){
describe("LayerStates", function() {
  describe("Events", function() {
    beforeEach(function() {
      this.layer = new Layer();
      this.layer.states.add("a", {
        x: 100,
        y: 100
      });
      return this.layer.states.add("b", {
        x: 200,
        y: 200
      });
    });
    it("should emit willSwitch when switching", function(done) {
      var test;
      test = (function(_this) {
        return function(previous, current, states) {
          previous.should.equal('default');
          current.should.equal('a');
          _this.layer.states.state.should.equal('default');
          return done();
        };
      })(this);
      this.layer.states.on('willSwitch', test);
      return this.layer.states.switchInstant('a');
    });
    return it("should emit didSwitch when switching", function(done) {
      var test;
      test = (function(_this) {
        return function(previous, current, states) {
          previous.should.equal('default');
          current.should.equal('a');
          _this.layer.states.state.should.equal('a');
          return done();
        };
      })(this);
      this.layer.states.on('didSwitch', test);
      return this.layer.states.switchInstant('a');
    });
  });
  describe("Defaults", function() {
    return it("should set defaults", function() {
      var layer;
      layer = new Layer;
      layer.states.add("test", {
        x: 123
      });
      layer.states["switch"]("test");
      layer.states._animation.options.curve.should.equal(Framer.Defaults.Animation.curve);
      Framer.Defaults.Animation = {
        curve: "spring(1, 2, 3)"
      };
      layer = new Layer;
      layer.states.add("test", {
        x: 456
      });
      layer.states["switch"]("test");
      layer.states._animation.options.curve.should.equal("spring(1, 2, 3)");
      return Framer.resetDefaults();
    });
  });
  describe("Switch", function() {
    return it("should switch instant", function() {
      var layer;
      layer = new Layer;
      layer.states.add({
        stateA: {
          x: 123
        },
        stateB: {
          y: 123
        }
      });
      layer.states.switchInstant("stateA");
      layer.states.current.should.equal("stateA");
      layer.x.should.equal(123);
      layer.states.switchInstant("stateB");
      layer.states.current.should.equal("stateB");
      return layer.y.should.equal(123);
    });
  });
  return describe("Properties", function() {
    it("should set scroll property", function() {
      var layer;
      layer = new Layer;
      layer.states.add({
        stateA: {
          scroll: true
        },
        stateB: {
          scroll: false
        }
      });
      layer.states.switchInstant("stateA");
      layer.scroll.should.equal(true);
      layer.states.switchInstant("stateB");
      layer.scroll.should.equal(false);
      layer.states.switchInstant("stateA");
      return layer.scroll.should.equal(true);
    });
    it("should set non numeric properties with animation", function(done) {
      var layer;
      layer = new Layer;
      layer.states.add({
        stateA: {
          scroll: true,
          backgroundColor: "red"
        }
      });
      layer.scroll.should.equal(false);
      layer.states.on(Events.StateDidSwitch, function() {
        layer.scroll.should.equal(true);
        layer.backgroundColor.should.equal("red");
        return done();
      });
      return layer.states["switch"]("stateA");
    });
    return it("should set non and numeric properties with animation", function(done) {
      var layer;
      layer = new Layer;
      layer.states.add({
        stateA: {
          x: 200,
          backgroundColor: "red"
        }
      });
      layer.x.should.equal(0);
      layer.states.on(Events.StateDidSwitch, function() {
        layer.x.should.equal(200);
        layer.backgroundColor.should.equal = "red";
        return done();
      });
      return layer.states["switch"]("stateA", {
        curve: "linear",
        time: 0.1
      });
    });
  });
});



},{}],16:[function(require,module,exports){
var assert, simulate,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

assert = require("assert");

simulate = require("simulate");

describe("Layer", function() {
  describe("Defaults", function() {
    it("should set defaults", function() {
      var layer;
      Framer.Defaults = {
        Layer: {
          width: 200,
          height: 200
        }
      };
      layer = new Layer();
      layer.width.should.equal(200);
      layer.height.should.equal(200);
      Framer.resetDefaults();
      layer = new Layer();
      layer.width.should.equal(100);
      return layer.height.should.equal(100);
    });
    it("should set default background color", function() {
      var layer;
      Framer.Defaults = {
        Layer: {
          backgroundColor: "red"
        }
      };
      layer = new Layer();
      layer.style.backgroundColor.should.equal("red");
      return Framer.resetDefaults();
    });
    return it("should set defaults with override", function() {
      var layer;
      layer = new Layer({
        x: 50,
        y: 50
      });
      layer.x.should.equal(50);
      return layer.x.should.equal(50);
    });
  });
  describe("Properties", function() {
    it("should set defaults", function() {
      var layer;
      layer = new Layer();
      layer.x.should.equal(0);
      layer.y.should.equal(0);
      layer.z.should.equal(0);
      layer.width.should.equal(100);
      return layer.height.should.equal(100);
    });
    it("should set width", function() {
      var layer;
      layer = new Layer({
        width: 200
      });
      layer.width.should.equal(200);
      return layer.style.width.should.equal("200px");
    });
    it("should set x and y", function() {
      var layer;
      layer = new Layer;
      layer.x = 100;
      layer.x.should.equal(100);
      layer.y = 50;
      layer.y.should.equal(50);
      return layer.style.webkitTransform.should.equal("translate3d(100px, 50px, 0px) scale(1) scale3d(1, 1, 1) skew(0deg, 0deg) skewX(0deg) skewY(0deg) rotateX(0deg) rotateY(0deg) rotateZ(0deg)");
    });
    it("should set scale", function() {
      var layer;
      layer = new Layer;
      layer.scaleX = 100;
      layer.scaleY = 100;
      layer.scaleZ = 100;
      return layer.style.webkitTransform.should.equal("translate3d(0px, 0px, 0px) scale(1) scale3d(100, 100, 100) skew(0deg, 0deg) skewX(0deg) skewY(0deg) rotateX(0deg) rotateY(0deg) rotateZ(0deg)");
    });
    it("should set origin", function() {
      var layer;
      layer = new Layer;
      layer.originX = 0.1;
      layer.originY = 0.2;
      if (Utils.isChrome()) {
        layer.style.webkitTransformOrigin.should.equal("10% 20% 0px");
      } else {
        layer.style.webkitTransformOrigin.should.equal("10% 20%");
      }
      layer.originX = 0.5;
      layer.originY = 0.5;
      if (Utils.isChrome()) {
        return layer.style.webkitTransformOrigin.should.equal("50% 50% 0px");
      } else {
        return layer.style.webkitTransformOrigin.should.equal("50% 50%");
      }
    });
    it("should set local image", function() {
      var imagePath, layer;
      imagePath = "static/test.png";
      layer = new Layer;
      layer.image = imagePath;
      layer.image.should.equal(imagePath);
      layer.style["background-image"].indexOf(imagePath).should.not.equal(-1);
      layer.computedStyle()["background-size"].should.equal("cover");
      layer.computedStyle()["background-repeat"].should.equal("no-repeat");
      return layer.props.image.should.equal(imagePath);
    });
    it("should set image", function() {
      var imagePath, layer;
      imagePath = "static/test.png";
      layer = new Layer({
        image: imagePath
      });
      return layer.image.should.equal(imagePath);
    });
    it("should unset image with null", function() {
      var layer;
      layer = new Layer({
        image: "static/test.png"
      });
      layer.image = null;
      return layer.image.should.equal("");
    });
    it("should unset image with empty string", function() {
      var layer;
      layer = new Layer({
        image: "static/test.png"
      });
      layer.image = "";
      return layer.image.should.equal("");
    });
    it("should test image property type", function() {
      var f;
      f = function() {
        var layer;
        layer = new Layer;
        return layer.image = {};
      };
      return f.should["throw"]();
    });
    it("should set name on create", function() {
      var layer;
      layer = new Layer({
        name: "Test"
      });
      layer.name.should.equal("Test");
      return layer._element.getAttribute("name").should.equal("Test");
    });
    it("should set name after create", function() {
      var layer;
      layer = new Layer;
      layer.name = "Test";
      layer.name.should.equal("Test");
      return layer._element.getAttribute("name").should.equal("Test");
    });
    it("should set visible", function() {
      var layer;
      layer = new Layer;
      layer.visible.should.equal(true);
      layer.style["display"].should.equal("block");
      layer.visible = false;
      layer.visible.should.equal(false);
      return layer.style["display"].should.equal("none");
    });
    it("should set clip", function() {
      var layer;
      layer = new Layer;
      layer.clip.should.equal(true);
      layer.style["overflow"].should.equal("hidden");
      layer.clip = false;
      layer.scroll.should.equal(false);
      return layer.style["overflow"].should.equal("visible");
    });
    it("should set scroll", function() {
      var layer;
      layer = new Layer;
      layer.scroll.should.equal(false);
      layer.style["overflow"].should.equal("hidden");
      layer.scroll = true;
      layer.scroll.should.equal(true);
      layer.style["overflow"].should.equal("scroll");
      layer.ignoreEvents.should.equal(false);
      layer.scroll = false;
      layer.scroll.should.equal(false);
      return layer.style["overflow"].should.equal("hidden");
    });
    it("should set scroll from properties", function() {
      var layer;
      layer = new Layer;
      layer.props = {
        scroll: false
      };
      layer.scroll.should.equal(false);
      layer.props = {
        scroll: true
      };
      return layer.scroll.should.equal(true);
    });
    it("should set scrollHorizontal", function() {
      var layer;
      layer = new Layer;
      layer.scroll.should.equal(false);
      layer.style["overflow"].should.equal("hidden");
      layer.ignoreEvents.should.equal(true);
      layer.scroll = true;
      layer.scroll.should.equal(true);
      layer.style["overflow"].should.equal("scroll");
      return layer.ignoreEvents.should.equal(false);
    });
    it("should set style properties on create", function() {
      var layer;
      layer = new Layer({
        backgroundColor: "red"
      });
      layer.backgroundColor.should.equal("red");
      return layer.style["backgroundColor"].should.equal("red");
    });
    it("should check value type", function() {
      var f;
      f = function() {
        var layer;
        layer = new Layer;
        return layer.x = "hello";
      };
      return f.should["throw"]();
    });
    it("should set borderRadius", function() {
      var layer, testBorderRadius;
      testBorderRadius = function(layer, value) {
        if (layer.style["border-top-left-radius"] === ("" + value)) {
          layer.style["border-top-left-radius"].should.equal("" + value);
          layer.style["border-top-right-radius"].should.equal("" + value);
          layer.style["border-bottom-left-radius"].should.equal("" + value);
          return layer.style["border-bottom-right-radius"].should.equal("" + value);
        } else {
          layer.style["border-top-left-radius"].should.equal(value + " " + value);
          layer.style["border-top-right-radius"].should.equal(value + " " + value);
          layer.style["border-bottom-left-radius"].should.equal(value + " " + value);
          return layer.style["border-bottom-right-radius"].should.equal(value + " " + value);
        }
      };
      layer = new Layer;
      layer.borderRadius = 10;
      layer.borderRadius.should.equal(10);
      testBorderRadius(layer, "10px");
      layer.borderRadius = "50%";
      layer.borderRadius.should.equal("50%");
      return testBorderRadius(layer, "50%");
    });
    return it("should set perspective", function() {
      var layer;
      layer = new Layer;
      layer.perspective = 500;
      return layer.style["-webkit-perspective"].should.equal("500");
    });
  });
  describe("Filter Properties", function() {
    it("should set nothing on defaults", function() {
      var layer;
      layer = new Layer;
      return layer.style.webkitFilter.should.equal("");
    });
    return it("should set only the filter that is non default", function() {
      var layer;
      layer = new Layer;
      layer.blur = 10;
      layer.blur.should.equal(10);
      layer.style.webkitFilter.should.equal("blur(10px)");
      layer.contrast = 50;
      layer.contrast.should.equal(50);
      return layer.style.webkitFilter.should.equal("blur(10px) contrast(50%)");
    });
  });
  describe("Shadow Properties", function() {
    it("should set nothing on defaults", function() {
      var layer;
      layer = new Layer;
      return layer.style.boxShadow.should.equal("");
    });
    return it("should set the shadow", function() {
      var layer;
      layer = new Layer;
      layer.shadowX = 10;
      layer.shadowY = 10;
      layer.shadowBlur = 10;
      layer.shadowSpread = 10;
      layer.shadowX.should.equal(10);
      layer.shadowY.should.equal(10);
      layer.shadowBlur.should.equal(10);
      layer.shadowSpread.should.equal(10);
      layer.style.boxShadow.should.equal("");
      layer.shadowColor = "red";
      layer.shadowColor.should.equal("red");
      layer.style.boxShadow.should.equal("red 10px 10px 10px 10px");
      layer.shadowColor = null;
      return layer.style.boxShadow.should.equal("");
    });
  });
  describe("Events", function() {
    it("should set pointer events", function() {
      var layer;
      layer = new Layer();
      layer.ignoreEvents = false;
      layer.style["pointerEvents"].should.equal("auto");
      layer.ignoreEvents = true;
      return layer.style["pointerEvents"].should.equal("none");
    });
    it("should not listen to events by default", function() {
      var layer;
      layer = new Layer();
      layer.ignoreEvents.should.equal(true);
      return layer.style["pointerEvents"].should.equal("none");
    });
    it("should listen to multiple events", function() {
      var count, handler, layer;
      layer = new Layer();
      count = 0;
      handler = function() {
        return count++;
      };
      layer.on("click", "tap", handler);
      layer.emit("click");
      layer.emit("tap");
      return count.should.equal(2);
    });
    it("should not listen to events until a listener is added", function() {
      var layer;
      layer = new Layer();
      layer.ignoreEvents.should.equal(true);
      layer.on(Events.Click, function() {
        return console.log("hello");
      });
      return layer.ignoreEvents.should.equal(false);
    });
    it("should modify the event scope", function(callback) {
      var myLayer;
      myLayer = new Layer();
      myLayer.on("click", function(event, layer) {
        this.id.should.equal(myLayer.id);
        layer.id.should.equal(myLayer.id);
        return callback();
      });
      return simulate.click(myLayer._element);
    });
    it("should remove events", function() {
      var clickCount, handler, layer;
      layer = new Layer;
      clickCount = 0;
      handler = function() {
        return clickCount++;
      };
      layer.on("test", handler);
      layer.emit("test");
      clickCount.should.equal(1);
      layer.off("test", handler);
      layer.emit("test");
      return clickCount.should.equal(1);
    });
    return it("should only run an event once", function() {
      var count, i, j, layerA;
      layerA = new Layer;
      count = 0;
      layerA.once("hello", function(layer) {
        count++;
        return layerA.should.equal(layer);
      });
      for (i = j = 0; j <= 10; i = ++j) {
        layerA.emit("hello");
      }
      return count.should.equal(1);
    });
  });
  describe("Hierarchy", function() {
    it("should insert in dom", function() {
      var layer;
      layer = new Layer;
      assert.equal(layer._element.parentNode.id, "FramerContextRoot-Default");
      return assert.equal(layer.superLayer, null);
    });
    it("should check superLayer", function() {
      var f;
      f = function() {
        var layer;
        return layer = new Layer({
          superLayer: 1
        });
      };
      return f.should["throw"]();
    });
    it("should add sublayer", function() {
      var layerA, layerB;
      layerA = new Layer;
      layerB = new Layer({
        superLayer: layerA
      });
      assert.equal(layerB._element.parentNode, layerA._element);
      return assert.equal(layerB.superLayer, layerA);
    });
    it("should remove sublayer", function() {
      var layerA, layerB;
      layerA = new Layer;
      layerB = new Layer({
        superLayer: layerA
      });
      layerB.superLayer = null;
      assert.equal(layerB._element.parentNode.id, "FramerContextRoot-Default");
      return assert.equal(layerB.superLayer, null);
    });
    it("should list sublayers", function() {
      var layerA, layerB, layerC;
      layerA = new Layer;
      layerB = new Layer({
        superLayer: layerA
      });
      layerC = new Layer({
        superLayer: layerA
      });
      assert.deepEqual(layerA.subLayers, [layerB, layerC]);
      layerB.superLayer = null;
      assert.equal(layerA.subLayers.length, 1);
      assert.deepEqual(layerA.subLayers, [layerC]);
      layerC.superLayer = null;
      return assert.deepEqual(layerA.subLayers, []);
    });
    it("should list sibling root layers", function() {
      var layerA, layerB, layerC;
      layerA = new Layer;
      layerB = new Layer;
      layerC = new Layer;
      assert(indexOf.call(layerA.siblingLayers, layerB) >= 0, true);
      return assert(indexOf.call(layerA.siblingLayers, layerC) >= 0, true);
    });
    it("should list sibling layers", function() {
      var layerA, layerB, layerC;
      layerA = new Layer;
      layerB = new Layer({
        superLayer: layerA
      });
      layerC = new Layer({
        superLayer: layerA
      });
      assert.deepEqual(layerB.siblingLayers, [layerC]);
      return assert.deepEqual(layerC.siblingLayers, [layerB]);
    });
    return it("should list super layers", function() {
      var layerA, layerB, layerC;
      layerA = new Layer;
      layerB = new Layer({
        superLayer: layerA
      });
      layerC = new Layer({
        superLayer: layerB
      });
      return assert.deepEqual(layerC.superLayers(), [layerB, layerA]);
    });
  });
  describe("Layering", function() {
    it("should set at creation", function() {
      var layer;
      layer = new Layer({
        index: 666
      });
      return layer.index.should.equal(666);
    });
    it("should change index", function() {
      var layer;
      layer = new Layer;
      layer.index = 666;
      return layer.index.should.equal(666);
    });
    it("should be in front for root", function() {
      var layerA, layerB;
      layerA = new Layer;
      layerB = new Layer;
      return assert.equal(layerB.index, layerA.index + 1);
    });
    it("should be in front", function() {
      var layerA, layerB, layerC;
      layerA = new Layer;
      layerB = new Layer({
        superLayer: layerA
      });
      layerC = new Layer({
        superLayer: layerA
      });
      assert.equal(layerB.index, 1);
      return assert.equal(layerC.index, 2);
    });
    it("should send back and front", function() {
      var layerA, layerB, layerC;
      layerA = new Layer;
      layerB = new Layer({
        superLayer: layerA
      });
      layerC = new Layer({
        superLayer: layerA
      });
      layerC.sendToBack();
      assert.equal(layerB.index, 1);
      assert.equal(layerC.index, -1);
      layerC.bringToFront();
      assert.equal(layerB.index, 1);
      return assert.equal(layerC.index, 2);
    });
    it("should place in front", function() {
      var layerA, layerB, layerC, layerD;
      layerA = new Layer;
      layerB = new Layer({
        superLayer: layerA
      });
      layerC = new Layer({
        superLayer: layerA
      });
      layerD = new Layer({
        superLayer: layerA
      });
      layerB.placeBefore(layerC);
      assert.equal(layerB.index, 2);
      assert.equal(layerC.index, 1);
      return assert.equal(layerD.index, 3);
    });
    it("should place behind", function() {
      var layerA, layerB, layerC, layerD;
      layerA = new Layer;
      layerB = new Layer({
        superLayer: layerA
      });
      layerC = new Layer({
        superLayer: layerA
      });
      layerD = new Layer({
        superLayer: layerA
      });
      layerC.placeBehind(layerB);
      assert.equal(layerB.index, 2);
      assert.equal(layerC.index, 1);
      return assert.equal(layerD.index, 4);
    });
    it("should get a sublayers by name", function() {
      var layerA, layerB, layerC, layerD;
      layerA = new Layer;
      layerB = new Layer({
        name: "B",
        superLayer: layerA
      });
      layerC = new Layer({
        name: "C",
        superLayer: layerA
      });
      layerD = new Layer({
        name: "C",
        superLayer: layerA
      });
      layerA.subLayersByName("B").should.eql([layerB]);
      return layerA.subLayersByName("C").should.eql([layerC, layerD]);
    });
    return it("should get a superlayers", function() {
      var layerA, layerB, layerC;
      layerA = new Layer;
      layerB = new Layer({
        superLayer: layerA
      });
      layerC = new Layer({
        superLayer: layerB
      });
      return layerC.superLayers().should.eql([layerB, layerA]);
    });
  });
  describe("Frame", function() {
    it("should set on create", function() {
      var layer;
      layer = new Layer({
        frame: {
          x: 111,
          y: 222,
          width: 333,
          height: 444
        }
      });
      assert.equal(layer.x, 111);
      assert.equal(layer.y, 222);
      assert.equal(layer.width, 333);
      return assert.equal(layer.height, 444);
    });
    it("should set after create", function() {
      var layer;
      layer = new Layer;
      layer.frame = {
        x: 111,
        y: 222,
        width: 333,
        height: 444
      };
      assert.equal(layer.x, 111);
      assert.equal(layer.y, 222);
      assert.equal(layer.width, 333);
      return assert.equal(layer.height, 444);
    });
    it("should set minX on creation", function() {
      var layer;
      layer = new Layer({
        minX: 200,
        y: 100,
        width: 100,
        height: 100
      });
      return layer.x.should.equal(200);
    });
    it("should set midX on creation", function() {
      var layer;
      layer = new Layer({
        midX: 200,
        y: 100,
        width: 100,
        height: 100
      });
      return layer.x.should.equal(150);
    });
    it("should set maxX on creation", function() {
      var layer;
      layer = new Layer({
        maxX: 200,
        y: 100,
        width: 100,
        height: 100
      });
      return layer.x.should.equal(100);
    });
    it("should set minY on creation", function() {
      var layer;
      layer = new Layer({
        x: 100,
        minY: 200,
        width: 100,
        height: 100
      });
      return layer.y.should.equal(200);
    });
    it("should set midY on creation", function() {
      var layer;
      layer = new Layer({
        x: 100,
        midY: 200,
        width: 100,
        height: 100
      });
      return layer.y.should.equal(150);
    });
    it("should set maxY on creation", function() {
      var layer;
      layer = new Layer({
        x: 100,
        maxY: 200,
        width: 100,
        height: 100
      });
      return layer.y.should.equal(100);
    });
    it("should set minX", function() {
      var layer;
      layer = new Layer({
        y: 100,
        width: 100,
        height: 100
      });
      layer.minX = 200;
      return layer.x.should.equal(200);
    });
    it("should set midX", function() {
      var layer;
      layer = new Layer({
        y: 100,
        width: 100,
        height: 100
      });
      layer.midX = 200;
      return layer.x.should.equal(150);
    });
    it("should set maxX", function() {
      var layer;
      layer = new Layer({
        y: 100,
        width: 100,
        height: 100
      });
      layer.maxX = 200;
      return layer.x.should.equal(100);
    });
    it("should set minY", function() {
      var layer;
      layer = new Layer({
        x: 100,
        width: 100,
        height: 100
      });
      layer.minY = 200;
      return layer.y.should.equal(200);
    });
    it("should set midY", function() {
      var layer;
      layer = new Layer({
        x: 100,
        width: 100,
        height: 100
      });
      layer.midY = 200;
      return layer.y.should.equal(150);
    });
    it("should set maxY", function() {
      var layer;
      layer = new Layer({
        x: 100,
        width: 100,
        height: 100
      });
      layer.maxY = 200;
      return layer.y.should.equal(100);
    });
    it("should get and set screenFrame", function() {
      var layerA, layerB;
      layerA = new Layer({
        x: 100,
        y: 100,
        width: 100,
        height: 100
      });
      layerB = new Layer({
        x: 300,
        y: 300,
        width: 100,
        height: 100,
        superLayer: layerA
      });
      assert.equal(layerB.screenFrame.x, 400);
      assert.equal(layerB.screenFrame.y, 400);
      layerB.screenFrame = {
        x: 1000,
        y: 1000
      };
      assert.equal(layerB.screenFrame.x, 1000);
      assert.equal(layerB.screenFrame.y, 1000);
      assert.equal(layerB.x, 900);
      assert.equal(layerB.y, 900);
      layerB.superLayer = null;
      assert.equal(layerB.screenFrame.x, 900);
      return assert.equal(layerB.screenFrame.y, 900);
    });
    it("should calculate scale", function() {
      var layerA, layerB;
      layerA = new Layer({
        scale: 0.9
      });
      layerB = new Layer({
        scale: 0.8,
        superLayer: layerA
      });
      layerB.screenScaleX().should.equal(0.9 * 0.8);
      return layerB.screenScaleY().should.equal(0.9 * 0.8);
    });
    it("should calculate scaled frame", function() {
      var layerA;
      layerA = new Layer({
        x: 100,
        width: 500,
        height: 900,
        scale: 0.5
      });
      return layerA.scaledFrame().should.eql({
        "x": 225,
        "y": 225,
        "width": 250,
        "height": 450
      });
    });
    return it("should calculate scaled screen frame", function() {
      var layerA, layerB, layerC;
      layerA = new Layer({
        x: 100,
        width: 500,
        height: 900,
        scale: 0.5
      });
      layerB = new Layer({
        y: 50,
        width: 600,
        height: 600,
        scale: 0.8,
        superLayer: layerA
      });
      layerC = new Layer({
        y: -60,
        width: 800,
        height: 700,
        scale: 1.2,
        superLayer: layerB
      });
      layerA.screenScaledFrame().should.eql({
        "x": 225,
        "y": 225,
        "width": 250,
        "height": 450
      });
      layerB.screenScaledFrame().should.eql({
        "x": 255,
        "y": 280,
        "width": 240,
        "height": 240
      });
      return layerC.screenScaledFrame().should.eql({
        "x": 223,
        "y": 228,
        "width": 384,
        "height": 336
      });
    });
  });
  describe("Center", function() {
    it("should center", function() {
      var layerA, layerB;
      layerA = new Layer({
        width: 200,
        height: 200
      });
      layerB = new Layer({
        width: 100,
        height: 100,
        superLayer: layerA
      });
      layerB.center();
      assert.equal(layerB.x, 50);
      return assert.equal(layerB.y, 50);
    });
    it("should center with offset", function() {
      var layerA, layerB;
      layerA = new Layer({
        width: 200,
        height: 200
      });
      layerB = new Layer({
        width: 100,
        height: 100,
        superLayer: layerA
      });
      layerB.centerX(50);
      layerB.centerY(50);
      assert.equal(layerB.x, 100);
      return assert.equal(layerB.y, 100);
    });
    it("should center return layer", function() {
      var layerA;
      layerA = new Layer({
        width: 200,
        height: 200
      });
      layerA.center().should.equal(layerA);
      layerA.centerX().should.equal(layerA);
      return layerA.centerY().should.equal(layerA);
    });
    return it("should center pixel align", function() {
      var layerA, layerB;
      layerA = new Layer({
        width: 200,
        height: 200
      });
      layerB = new Layer({
        width: 111,
        height: 111,
        superLayer: layerA
      });
      layerB.center().pixelAlign();
      assert.equal(layerB.x, 44);
      return assert.equal(layerB.y, 44);
    });
  });
  describe("CSS", function() {
    return it("classList should work", function() {
      var layer;
      layer = new Layer;
      layer.classList.add("test");
      assert.equal(layer.classList.contains("test"), true);
      return assert.equal(layer._element.classList.contains("test"), true);
    });
  });
  describe("DOM", function() {
    it("should destroy", function() {
      var layer;
      layer = new Layer;
      layer.destroy();
      (indexOf.call(Framer.CurrentContext.getLayers(), layer) >= 0).should.be["false"];
      return assert.equal(layer._element.parentNode, null);
    });
    it("should set text", function() {
      var layer;
      layer = new Layer;
      layer.html = "Hello";
      layer._element.childNodes[0].should.equal(layer._elementHTML);
      layer._elementHTML.innerHTML.should.equal("Hello");
      return layer.ignoreEvents.should.equal(true);
    });
    it("should set interactive html and allow pointer events", function() {
      var element, html, j, k, layer, len, len1, results, style, tag, tags;
      tags = ["input", "select", "textarea", "option"];
      html = "";
      for (j = 0, len = tags.length; j < len; j++) {
        tag = tags[j];
        html += "<" + tag + "></" + tag + ">";
      }
      layer = new Layer;
      layer.html = html;
      results = [];
      for (k = 0, len1 = tags.length; k < len1; k++) {
        tag = tags[k];
        element = layer.querySelectorAll(tag)[0];
        style = window.getComputedStyle(element);
        results.push(style["pointer-events"].should.equal("auto"));
      }
      return results;
    });
    return it("should work with querySelectorAll", function() {
      var inputElement, inputElements, layer;
      layer = new Layer;
      layer.html = "<input type='button' id='hello'>";
      inputElements = layer.querySelectorAll("input");
      inputElements.length.should.equal(1);
      inputElement = _.first(inputElements);
      return inputElement.getAttribute("id").should.equal("hello");
    });
  });
  return describe("Force 2D", function() {
    return it("should switch to 2d rendering", function() {
      var layer;
      layer = new Layer;
      layer.style.webkitTransform.should.equal("translate3d(0px, 0px, 0px) scale(1) scale3d(1, 1, 1) skew(0deg, 0deg) skewX(0deg) skewY(0deg) rotateX(0deg) rotateY(0deg) rotateZ(0deg)");
      layer.force2d = true;
      return layer.style.webkitTransform.should.equal("translate(0px, 0px) scale(1) skew(0deg, 0deg) rotate(0deg)");
    });
  });
});



},{"assert":1,"simulate":6}],17:[function(require,module,exports){
describe("Utils", function() {
  describe("valueOrDefault", function() {
    it("should get a value", function() {
      return Utils.valueOrDefault(10, 0).should.equal(10);
    });
    return it("should get the default value", function() {
      return Utils.valueOrDefault(null, 0).should.equal(0);
    });
  });
  describe("arrayFromArguments", function() {
    return it("should work", function() {
      var f;
      f = function() {
        return Utils.arrayFromArguments(arguments);
      };
      f("a").should.eql(["a"]);
      f("a", "b").should.eql(["a", "b"]);
      f(["a"]).should.eql(["a"]);
      f(["a", "b"]).should.eql(["a", "b"]);
      f("monkey").should.eql(["monkey"]);
      return f(["monkey"]).should.eql(["monkey"]);
    });
  });
  describe("parseFunction", function() {
    it("should work without arguments", function() {
      var result;
      result = Utils.parseFunction("spring");
      result.name.should.equal("spring");
      return result.args.should.eql([]);
    });
    it("should work with a single argument", function() {
      var result;
      result = Utils.parseFunction("spring(100)");
      result.name.should.equal("spring");
      return result.args.should.eql(["100"]);
    });
    it("should work with multiple arguments", function() {
      var result;
      result = Utils.parseFunction("spring(100,50)");
      result.name.should.equal("spring");
      return result.args.should.eql(["100", "50"]);
    });
    return it("should cleanup arguments", function() {
      var result;
      result = Utils.parseFunction("spring(100 , 50 )");
      result.name.should.equal("spring");
      return result.args.should.eql(["100", "50"]);
    });
  });
  describe("arrayNext", function() {
    return it("should work", function() {
      Utils.arrayNext(["a", "b", "c"], "a").should.equal("b");
      Utils.arrayNext(["a", "b", "c"], "b").should.equal("c");
      return Utils.arrayNext(["a", "b", "c"], "c").should.equal("a");
    });
  });
  describe("arrayPrev", function() {
    return it("should work", function() {
      Utils.arrayPrev(["a", "b", "c"], "a").should.equal("c");
      Utils.arrayPrev(["a", "b", "c"], "b").should.equal("a");
      return Utils.arrayPrev(["a", "b", "c"], "c").should.equal("b");
    });
  });
  describe("sizeMax", function() {
    return it("should work", function() {
      Utils.sizeMax([
        {
          width: 100,
          height: 100
        }, {
          width: 100,
          height: 100
        }
      ]).should.eql({
        width: 100,
        height: 100
      });
      return Utils.sizeMax([
        {
          width: 1000,
          height: 1000
        }, {
          width: 100,
          height: 100
        }
      ]).should.eql({
        width: 1000,
        height: 1000
      });
    });
  });
  describe("pathJoin", function() {
    return it("should work", function() {
      return Utils.pathJoin("test", "monkey").should.equal("test/monkey");
    });
  });
  describe("sizeMin", function() {
    return it("should work", function() {
      Utils.sizeMin([
        {
          width: 100,
          height: 100
        }, {
          width: 100,
          height: 100
        }
      ]).should.eql({
        width: 100,
        height: 100
      });
      return Utils.sizeMin([
        {
          width: 1000,
          height: 1000
        }, {
          width: 100,
          height: 100
        }
      ]).should.eql({
        width: 100,
        height: 100
      });
    });
  });
  describe("frameMerge", function() {
    return it("should work", function() {
      var compare;
      compare = function(frames, result) {
        var frame, i, len, p, ref, results;
        frame = Utils.frameMerge(frames);
        ref = ["x", "y", "width", "height"];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          p = ref[i];
          results.push(frame[p].should.equal(result[p], p));
        }
        return results;
      };
      compare([
        {
          x: 0,
          y: 0,
          width: 100,
          height: 100
        }, {
          x: 0,
          y: 0,
          width: 100,
          height: 100
        }
      ], {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      });
      compare([
        {
          x: 0,
          y: 0,
          width: 100,
          height: 100
        }, {
          x: 0,
          y: 0,
          width: 500,
          height: 500
        }
      ], {
        x: 0,
        y: 0,
        width: 500,
        height: 500
      });
      compare([
        {
          x: 0,
          y: 0,
          width: 100,
          height: 100
        }, {
          x: 100,
          y: 100,
          width: 500,
          height: 500
        }
      ], {
        x: 0,
        y: 0,
        width: 600,
        height: 600
      });
      return compare([
        {
          x: 100,
          y: 100,
          width: 100,
          height: 100
        }, {
          x: 100,
          y: 100,
          width: 500,
          height: 500
        }
      ], {
        x: 100,
        y: 100,
        width: 500,
        height: 500
      });
    });
  });
  describe("framePointForOrigin", function() {
    return it("should work", function() {
      Utils.framePointForOrigin({
        x: 100,
        y: 100,
        width: 100,
        height: 100
      }, 0, 0).should.eql({
        x: 100,
        y: 100,
        width: 100,
        height: 100
      });
      Utils.framePointForOrigin({
        x: 100,
        y: 100,
        width: 100,
        height: 100
      }, 0, 0).should.eql({
        x: 100,
        y: 100,
        width: 100,
        height: 100
      });
      Utils.framePointForOrigin({
        x: 100,
        y: 100,
        width: 100,
        height: 100
      }, 0, 0).should.eql({
        x: 100,
        y: 100,
        width: 100,
        height: 100
      });
      return Utils.framePointForOrigin({
        x: 100,
        y: 100,
        width: 100,
        height: 100
      }, 0, 0).should.eql({
        x: 100,
        y: 100,
        width: 100,
        height: 100
      });
    });
  });
  describe("modulate", function() {
    return it("should have the right results", function() {
      Utils.modulate(0.5, [0, 1], [0, 100]).should.equal(50);
      Utils.modulate(1, [0, 1], [0, 100]).should.equal(100);
      Utils.modulate(2, [0, 1], [0, 100], true).should.equal(100);
      Utils.modulate(2, [0, 1], [0, 100], false).should.equal(200);
      Utils.modulate(0, [1, 2], [0, 100], true).should.equal(0);
      Utils.modulate(0, [1, 2], [0, 100], false).should.equal(-100);
      Utils.modulate(0, [1, 2], [100, 0], true).should.equal(100);
      return Utils.modulate(0, [1, 2], [100, 0], false).should.equal(200);
    });
  });
  return describe("textSize", function() {
    var style, text;
    text = "Hello Koen Bok";
    return style = {
      font: "20px/1em Menlo"
    };
  });
});



},{}],18:[function(require,module,exports){
describe("VideoLayer", function() {
  return describe("Defaults", function() {
    if (!Utils.isSafari()) {
      return it("should create video", function() {
        var videoLayer;
        videoLayer = new VideoLayer({
          video: "static/test.mp4"
        });
        return videoLayer.player.src.should.equal("static/test.mp4");
      });
    }
  });
});



},{}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9zaW11bGF0ZS9zaW11bGF0ZS5qcyIsIi9Vc2Vycy9rb2VuL0RvY3VtZW50cy9Qcm9qZWN0cy9GcmFtZXIzL3Rlc3QvdGVzdHMuY29mZmVlIiwiL1VzZXJzL2tvZW4vRG9jdW1lbnRzL1Byb2plY3RzL0ZyYW1lcjMvdGVzdC90ZXN0cy9CYXNlQ2xhc3NUZXN0LmNvZmZlZSIsIi9Vc2Vycy9rb2VuL0RvY3VtZW50cy9Qcm9qZWN0cy9GcmFtZXIzL3Rlc3QvdGVzdHMvQ29tcGF0VGVzdC5jb2ZmZWUiLCIvVXNlcnMva29lbi9Eb2N1bWVudHMvUHJvamVjdHMvRnJhbWVyMy90ZXN0L3Rlc3RzL0NvbnRleHRUZXN0LmNvZmZlZSIsIi9Vc2Vycy9rb2VuL0RvY3VtZW50cy9Qcm9qZWN0cy9GcmFtZXIzL3Rlc3QvdGVzdHMvRXZlbnRFbWl0dGVyVGVzdC5jb2ZmZWUiLCIvVXNlcnMva29lbi9Eb2N1bWVudHMvUHJvamVjdHMvRnJhbWVyMy90ZXN0L3Rlc3RzL0ZyYW1lVGVzdC5jb2ZmZWUiLCIvVXNlcnMva29lbi9Eb2N1bWVudHMvUHJvamVjdHMvRnJhbWVyMy90ZXN0L3Rlc3RzL0ltcG9ydGVyVGVzdC5jb2ZmZWUiLCIvVXNlcnMva29lbi9Eb2N1bWVudHMvUHJvamVjdHMvRnJhbWVyMy90ZXN0L3Rlc3RzL0xheWVyQW5pbWF0aW9uVGVzdC5jb2ZmZWUiLCIvVXNlcnMva29lbi9Eb2N1bWVudHMvUHJvamVjdHMvRnJhbWVyMy90ZXN0L3Rlc3RzL0xheWVyU3RhdGVzVGVzdC5jb2ZmZWUiLCIvVXNlcnMva29lbi9Eb2N1bWVudHMvUHJvamVjdHMvRnJhbWVyMy90ZXN0L3Rlc3RzL0xheWVyVGVzdC5jb2ZmZWUiLCIvVXNlcnMva29lbi9Eb2N1bWVudHMvUHJvamVjdHMvRnJhbWVyMy90ZXN0L3Rlc3RzL1V0aWxzVGVzdC5jb2ZmZWUiLCIvVXNlcnMva29lbi9Eb2N1bWVudHMvUHJvamVjdHMvRnJhbWVyMy90ZXN0L3Rlc3RzL1ZpZGVvTGF5ZXJUZXN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEEsSUFBQSxNQUFBOztBQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBZixHQUF1QixTQUFDLENBQUQsR0FBQSxDQUF2QixDQUFBOztBQUFBLEtBRUssQ0FBQyxLQUFOLENBQVksS0FBWixDQUZBLENBQUE7O0FBQUEsS0FHSyxDQUFDLE9BQU4sQ0FBYyxDQUFDLFlBQUQsQ0FBZCxDQUhBLENBQUE7O0FBQUEsTUFLQSxHQUFTLElBQUksQ0FBQyxNQUxkLENBQUE7O0FBQUEsT0FPQSxDQUFRLDBCQUFSLENBUEEsQ0FBQTs7QUFBQSxPQVFBLENBQVEsbUJBQVIsQ0FSQSxDQUFBOztBQUFBLE9BU0EsQ0FBUSx1QkFBUixDQVRBLENBQUE7O0FBQUEsT0FVQSxDQUFRLG1CQUFSLENBVkEsQ0FBQTs7QUFBQSxPQVdBLENBQVEsbUJBQVIsQ0FYQSxDQUFBOztBQUFBLE9BWUEsQ0FBUSx5QkFBUixDQVpBLENBQUE7O0FBQUEsT0FhQSxDQUFRLHdCQUFSLENBYkEsQ0FBQTs7QUFBQSxPQWNBLENBQVEsb0JBQVIsQ0FkQSxDQUFBOztBQUFBLE9BZUEsQ0FBUSxzQkFBUixDQWZBLENBQUE7O0FBQUEsT0FnQkEsQ0FBUSw0QkFBUixDQWhCQSxDQUFBOztBQUFBLE9BaUJBLENBQVEscUJBQVIsQ0FqQkEsQ0FBQTs7QUFvQkEsSUFBRyxNQUFNLENBQUMsY0FBVjtBQUNDLEVBQUEsY0FBYyxDQUFDLEdBQWYsQ0FBQSxDQUFBLENBREQ7Q0FBQSxNQUFBO0FBR0MsRUFBQSxLQUFLLENBQUMsR0FBTixDQUFBLENBQUEsQ0FIRDtDQXBCQTs7Ozs7QUNBQSxJQUFBOzZCQUFBOztBQUFBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtBQUVyQixNQUFBLHVCQUFBO0FBQUEsRUFBQSxZQUFBLEdBQWUsU0FBQyxJQUFELEVBQU8sUUFBUCxHQUFBO1dBQ2Q7QUFBQSxNQUFBLFVBQUEsRUFBWSxJQUFaO0FBQUEsTUFDQSxTQUFBLEVBQVMsUUFEVDtBQUFBLE1BRUEsR0FBQSxFQUFLLFNBQUEsR0FBQTtlQUFHLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixJQUFuQixFQUFIO01BQUEsQ0FGTDtBQUFBLE1BR0EsR0FBQSxFQUFLLFNBQUMsS0FBRCxHQUFBO2VBQVcsSUFBQyxDQUFBLGlCQUFELENBQW1CLElBQW5CLEVBQXlCLEtBQXpCLEVBQVg7TUFBQSxDQUhMO01BRGM7RUFBQSxDQUFmLENBQUE7QUFBQSxFQU9BLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFFbkMsUUFBQSw0QkFBQTtBQUFBLElBQU07QUFDTCxvQ0FBQSxDQUFBOzs7O09BQUE7O0FBQUEsTUFBQSxVQUFDLENBQUEsTUFBRCxDQUFRLE9BQVIsRUFBaUIsWUFBQSxDQUFhLE9BQWIsRUFBc0IsR0FBdEIsQ0FBakIsQ0FBQSxDQUFBOzt3QkFBQTs7T0FEd0IsTUFBTSxDQUFDLFVBQWhDLENBQUE7QUFBQSxJQUdNO0FBQ0wsb0NBQUEsQ0FBQTs7OztPQUFBOztBQUFBLE1BQUEsVUFBQyxDQUFBLE1BQUQsQ0FBUSxPQUFSLEVBQWlCLFlBQUEsQ0FBYSxPQUFiLEVBQXNCLEdBQXRCLENBQWpCLENBQUEsQ0FBQTs7d0JBQUE7O09BRHdCLE1BQU0sQ0FBQyxVQUhoQyxDQUFBO0FBQUEsSUFNQSxDQUFBLEdBQVEsSUFBQSxVQUFBLENBQUEsQ0FOUixDQUFBO0FBQUEsSUFPQSxDQUFBLEdBQVEsSUFBQSxVQUFBLENBQUEsQ0FQUixDQUFBO0FBQUEsSUFTQSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFmLENBQW1CO0FBQUEsTUFBQyxLQUFBLEVBQU8sR0FBUjtLQUFuQixDQVRBLENBQUE7V0FVQSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFmLENBQW1CO0FBQUEsTUFBQyxLQUFBLEVBQU8sR0FBUjtLQUFuQixFQVptQztFQUFBLENBQXBDLENBUEEsQ0FBQTtBQUFBLEVBcUJNO0FBQ0wsaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsU0FBQyxDQUFBLE1BQUQsQ0FBUSxPQUFSLEVBQWlCLFlBQUEsQ0FBYSxPQUFiLEVBQXNCLENBQXRCLENBQWpCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLFNBQUMsQ0FBQSxNQUFELENBQVEsUUFBUixFQUFrQixZQUFBLENBQWEsUUFBYixFQUF1QixDQUF2QixDQUFsQixDQURBLENBQUE7O3FCQUFBOztLQUR1QixNQUFNLENBQUMsVUFyQi9CLENBQUE7QUFBQSxFQXlCQSxFQUFBLENBQUcscUJBQUgsRUFBMEIsU0FBQSxHQUFBO0FBRXpCLFFBQUEsU0FBQTtBQUFBLElBQUEsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FBQSxDQUFoQixDQUFBO0FBQUEsSUFFQSxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUF2QixDQUE2QixDQUE3QixDQUZBLENBQUE7V0FHQSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUF4QixDQUE4QixDQUE5QixFQUx5QjtFQUFBLENBQTFCLENBekJBLENBQUE7QUFBQSxFQWdDQSxFQUFBLENBQUcscUNBQUgsRUFBMEMsU0FBQSxHQUFBO0FBRXpDLFFBQUEsU0FBQTtBQUFBLElBQUEsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FBVTtBQUFBLE1BQUEsS0FBQSxFQUFNLEdBQU47QUFBQSxNQUFXLE1BQUEsRUFBTyxHQUFsQjtLQUFWLENBQWhCLENBQUE7QUFBQSxJQUVBLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQXZCLENBQTZCLEdBQTdCLENBRkEsQ0FBQTtXQUdBLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQXhCLENBQThCLEdBQTlCLEVBTHlDO0VBQUEsQ0FBMUMsQ0FoQ0EsQ0FBQTtBQUFBLEVBdUNBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7QUFFakMsUUFBQSxTQUFBO0FBQUEsSUFBQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUFBLENBQWhCLENBQUE7QUFBQSxJQUNBLFNBQVMsQ0FBQyxLQUFWLEdBQWtCLEdBRGxCLENBQUE7QUFBQSxJQUdBLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQXZCLENBQTZCLEdBQTdCLENBSEEsQ0FBQTtXQUlBLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQXhCLENBQThCLENBQTlCLEVBTmlDO0VBQUEsQ0FBbEMsQ0F2Q0EsQ0FBQTtBQUFBLEVBK0NBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFFeEIsUUFBQSxxQkFBQTtBQUFBLElBQU07QUFDTCxvQ0FBQSxDQUFBOzs7O09BQUE7O0FBQUEsTUFBQSxVQUFDLENBQUEsTUFBRCxDQUFRLE1BQVIsRUFBZ0IsWUFBQSxDQUFhLE1BQWIsRUFBcUIsR0FBckIsQ0FBaEIsQ0FBQSxDQUFBOzt3QkFBQTs7T0FEd0IsTUFBTSxDQUFDLFVBQWhDLENBQUE7QUFBQSxJQUdBLFNBQUEsR0FBZ0IsSUFBQSxVQUFBLENBQUEsQ0FIaEIsQ0FBQTtBQUFBLElBSUEsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBdEIsQ0FBNEIsR0FBNUIsQ0FKQSxDQUFBO0FBQUEsSUFNQSxTQUFTLENBQUMsSUFBVixHQUFpQixDQU5qQixDQUFBO1dBT0EsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBdEIsQ0FBNEIsQ0FBNUIsRUFUd0I7RUFBQSxDQUF6QixDQS9DQSxDQUFBO0FBQUEsRUEwREEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUU5QixRQUFBLFNBQUE7QUFBQSxJQUFBLFNBQUEsR0FBZ0IsSUFBQSxTQUFBLENBQ2Y7QUFBQSxNQUFBLEtBQUEsRUFBTyxHQUFQO0tBRGUsQ0FBaEIsQ0FBQTtBQUFBLElBR0EsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBdkIsQ0FBNkIsR0FBN0IsQ0FIQSxDQUFBO1dBSUEsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBeEIsQ0FBOEIsQ0FBOUIsRUFOOEI7RUFBQSxDQUEvQixDQTFEQSxDQUFBO0FBQUEsRUFrRUEsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTtBQUV0QixRQUFBLFNBQUE7QUFBQSxJQUFBLFNBQUEsR0FBZ0IsSUFBQSxTQUFBLENBQ2Y7QUFBQSxNQUFBLEtBQUEsRUFBTyxHQUFQO0tBRGUsQ0FBaEIsQ0FBQTtXQUdBLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQXZCLENBQ0M7QUFBQSxNQUFBLEtBQUEsRUFBTyxHQUFQO0FBQUEsTUFDQSxNQUFBLEVBQVEsQ0FEUjtLQURELEVBTHNCO0VBQUEsQ0FBdkIsQ0FsRUEsQ0FBQTtBQUFBLEVBMkVBLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBLEdBQUE7QUFFdEIsUUFBQSxTQUFBO0FBQUEsSUFBQSxTQUFBLEdBQVksR0FBQSxDQUFBLFNBQVosQ0FBQTtBQUFBLElBRUEsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBdkIsQ0FDQztBQUFBLE1BQUEsS0FBQSxFQUFPLENBQVA7QUFBQSxNQUNBLE1BQUEsRUFBUSxDQURSO0tBREQsQ0FGQSxDQUFBO0FBQUEsSUFNQSxTQUFTLENBQUMsS0FBVixHQUFrQjtBQUFBLE1BQUMsS0FBQSxFQUFPLEdBQVI7QUFBQSxNQUFhLE1BQUEsRUFBUSxHQUFyQjtLQU5sQixDQUFBO1dBUUEsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBdkIsQ0FDQztBQUFBLE1BQUEsS0FBQSxFQUFPLEdBQVA7QUFBQSxNQUNBLE1BQUEsRUFBUSxHQURSO0tBREQsRUFWc0I7RUFBQSxDQUF2QixDQTNFQSxDQUFBO0FBQUEsRUF5RkEsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTtBQUV0QixRQUFBLHFCQUFBO0FBQUEsSUFBTTtBQUNMLG9DQUFBLENBQUE7Ozs7T0FBQTs7QUFBQSxNQUFBLFVBQUMsQ0FBQSxNQUFELENBQVEsT0FBUixFQUFpQixVQUFDLENBQUEsY0FBRCxDQUFnQixPQUFoQixFQUF5QixHQUF6QixDQUFqQixDQUFBLENBQUE7O0FBQUEsTUFDQSxVQUFDLENBQUEsTUFBRCxDQUFRLE9BQVIsRUFBaUIsVUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsRUFBeUIsR0FBekIsQ0FBakIsQ0FEQSxDQUFBOzt3QkFBQTs7T0FEd0IsTUFBTSxDQUFDLFVBQWhDLENBQUE7QUFBQSxJQUlBLFNBQUEsR0FBZ0IsSUFBQSxVQUFBLENBQUEsQ0FKaEIsQ0FBQTtXQUtBLFNBQVMsQ0FBQyxJQUFWLENBQUEsQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsR0FBeEIsQ0FBNEIsQ0FBQyxPQUFELEVBQVUsT0FBVixDQUE1QixFQVBzQjtFQUFBLENBQXZCLENBekZBLENBQUE7QUFBQSxFQWtHQSxFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQSxHQUFBO0FBRXRCLFFBQUEscUJBQUE7QUFBQSxJQUFNO0FBQ0wsb0NBQUEsQ0FBQTs7OztPQUFBOztBQUFBLE1BQUEsVUFBQyxDQUFBLE1BQUQsQ0FBUSxPQUFSLEVBQWlCLFVBQUMsQ0FBQSxjQUFELENBQWdCLE9BQWhCLEVBQXlCLEdBQXpCLENBQWpCLENBQUEsQ0FBQTs7QUFBQSxNQUNBLFVBQUMsQ0FBQSxNQUFELENBQVEsT0FBUixFQUFpQixVQUFDLENBQUEsY0FBRCxDQUFnQixPQUFoQixFQUF5QixHQUF6QixDQUFqQixDQURBLENBQUE7O3dCQUFBOztPQUR3QixNQUFNLENBQUMsVUFBaEMsQ0FBQTtBQUFBLElBSUEsU0FBQSxHQUFnQixJQUFBLFVBQUEsQ0FBQSxDQUpoQixDQUFBO1dBS0EsU0FBUyxDQUFDLElBQVYsQ0FBQSxDQUFnQixDQUFDLE1BQU0sQ0FBQyxHQUF4QixDQUE0QixDQUFDLE9BQUQsRUFBVSxPQUFWLENBQTVCLEVBUHNCO0VBQUEsQ0FBdkIsQ0FsR0EsQ0FBQTtBQUFBLEVBMkdBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFFbkMsUUFBQSxxQkFBQTtBQUFBLElBQU07QUFDTCxvQ0FBQSxDQUFBOzs7O09BQUE7O0FBQUEsTUFBQSxVQUFDLENBQUEsTUFBRCxDQUFRLE9BQVIsRUFBaUIsVUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsRUFBeUIsR0FBekIsQ0FBakIsQ0FBQSxDQUFBOzt3QkFBQTs7T0FEd0IsTUFBTSxDQUFDLFVBQWhDLENBQUE7QUFBQSxJQUdBLFNBQUEsR0FBZ0IsSUFBQSxVQUFBLENBQUEsQ0FIaEIsQ0FBQTtBQUFBLElBSUEsU0FBUyxDQUFDLFFBQVYsQ0FBbUIsR0FBbkIsQ0FKQSxDQUFBO0FBQUEsSUFLQSxTQUFTLENBQUMsUUFBVixDQUFBLENBQW9CLENBQUMsTUFBTSxDQUFDLEtBQTVCLENBQWtDLEdBQWxDLENBTEEsQ0FBQTtXQU1BLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQXZCLENBQTZCLEdBQTdCLEVBUm1DO0VBQUEsQ0FBcEMsQ0EzR0EsQ0FBQTtBQUFBLEVBcUhBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFFckMsUUFBQSxpQ0FBQTtBQUFBLElBQU07QUFDTCxvQ0FBQSxDQUFBOzs7O09BQUE7O0FBQUEsTUFBQSxVQUFDLENBQUEsTUFBRCxDQUFRLE9BQVIsRUFBaUIsVUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsRUFBeUIsR0FBekIsQ0FBakIsQ0FBQSxDQUFBOzt3QkFBQTs7T0FEd0IsTUFBTSxDQUFDLFVBQWhDLENBQUE7QUFBQSxJQUdNO0FBQ0wsb0NBQUEsQ0FBQTs7OztPQUFBOztBQUFBLDJCQUFBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtlQUNULHlDQUFNLEtBQUEsR0FBUSxFQUFkLEVBRFM7TUFBQSxDQUFWLENBQUE7O3dCQUFBOztPQUR3QixXQUh6QixDQUFBO0FBQUEsSUFPQSxTQUFBLEdBQWdCLElBQUEsVUFBQSxDQUFBLENBUGhCLENBQUE7QUFBQSxJQVFBLFNBQVMsQ0FBQyxRQUFWLENBQW1CLEdBQW5CLENBUkEsQ0FBQTtBQUFBLElBU0EsU0FBUyxDQUFDLFFBQVYsQ0FBQSxDQUFvQixDQUFDLE1BQU0sQ0FBQyxLQUE1QixDQUFrQyxJQUFsQyxDQVRBLENBQUE7V0FVQSxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUF2QixDQUE2QixJQUE3QixFQVpxQztFQUFBLENBQXRDLENBckhBLENBQUE7U0FtSUEsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUEsR0FBQTtBQUV0QyxRQUFBLHFCQUFBO0FBQUEsSUFBTTtBQUNMLG9DQUFBLENBQUE7O0FBQUEsTUFBQSxVQUFDLENBQUEsTUFBRCxDQUFRLE9BQVIsRUFBaUIsVUFBQyxDQUFBLGFBQUQsQ0FBZSxZQUFmLENBQWpCLENBQUEsQ0FBQTs7QUFFYSxNQUFBLG9CQUFBLEdBQUE7QUFDWixRQUFBLDZDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRO0FBQUEsVUFBQyxLQUFBLEVBQU0sR0FBUDtTQUZSLENBRFk7TUFBQSxDQUZiOzt3QkFBQTs7T0FEd0IsTUFBTSxDQUFDLFVBQWhDLENBQUE7QUFBQSxJQVFBLFNBQUEsR0FBZ0IsSUFBQSxVQUFBLENBQUEsQ0FSaEIsQ0FBQTtBQUFBLElBU0EsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQTVCLENBQWtDLEdBQWxDLENBVEEsQ0FBQTtBQUFBLElBVUEsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBdkIsQ0FBNkIsR0FBN0IsQ0FWQSxDQUFBO0FBQUEsSUFXQSxTQUFTLENBQUMsS0FBVixHQUFrQixHQVhsQixDQUFBO1dBWUEsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQTVCLENBQWtDLEdBQWxDLEVBZHNDO0VBQUEsQ0FBdkMsRUFySXFCO0FBQUEsQ0FBdEIsQ0FBQSxDQUFBOzs7OztBQ0FBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTtTQUVsQixRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFFcEIsSUFBQSxFQUFBLENBQUcscUJBQUgsRUFBMEIsU0FBQSxHQUFBO0FBRXpCLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLEdBQUEsQ0FBQSxJQUFQLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQWQsQ0FBb0IsQ0FBcEIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFkLENBQW9CLENBQXBCLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBbEIsQ0FBd0IsR0FBeEIsQ0FKQSxDQUFBO2FBS0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBbkIsQ0FBeUIsR0FBekIsRUFQeUI7SUFBQSxDQUExQixDQUFBLENBQUE7QUFBQSxJQVNBLEVBQUEsQ0FBRyxzQkFBSCxFQUEyQixTQUFBLEdBQUE7QUFFMUIsVUFBQSxZQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBQSxDQUFBLElBQVIsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLEdBQUEsQ0FBQSxJQURSLENBQUE7QUFBQSxNQUdBLEtBQUssQ0FBQyxTQUFOLEdBQWtCLEtBSGxCLENBQUE7QUFBQSxNQUlBLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQXZCLENBQTZCLEtBQTdCLENBSkEsQ0FBQTthQUtBLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQXhCLENBQThCLEtBQTlCLEVBUDBCO0lBQUEsQ0FBM0IsQ0FUQSxDQUFBO0FBQUEsSUFrQkEsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUEsR0FBQTtBQUVuQyxVQUFBLGNBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxHQUFBLENBQUEsS0FBVCxDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQVMsR0FBQSxDQUFBLEtBRFQsQ0FBQTtBQUFBLE1BR0EsTUFBTSxDQUFDLFNBQVAsR0FBbUIsTUFIbkIsQ0FBQTtBQUFBLE1BSUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBeEIsQ0FBOEIsTUFBOUIsQ0FKQSxDQUFBO2FBS0EsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBekIsQ0FBK0IsTUFBL0IsRUFQbUM7SUFBQSxDQUFwQyxDQWxCQSxDQUFBO0FBQUEsSUEyQkEsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUEsR0FBQTtBQUVwQyxVQUFBLFlBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsSUFBUixDQUFBO0FBQUEsTUFDQSxLQUFBLEdBQVksSUFBQSxJQUFBLENBQUs7QUFBQSxRQUFBLFNBQUEsRUFBVSxLQUFWO09BQUwsQ0FEWixDQUFBO0FBQUEsTUFHQSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUF2QixDQUE2QixLQUE3QixDQUhBLENBQUE7YUFJQSxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUF4QixDQUE4QixLQUE5QixFQU5vQztJQUFBLENBQXJDLENBM0JBLENBQUE7QUFBQSxJQW1DQSxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQSxHQUFBO0FBRTlCLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLEdBQUEsQ0FBQSxVQUFQLENBQUE7YUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFuQixDQUF5QixJQUF6QixFQUg4QjtJQUFBLENBQS9CLENBbkNBLENBQUE7V0F5Q0EsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUEsR0FBQTtBQUU3QixVQUFBLGVBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxpQkFBWixDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQVcsSUFBQSxTQUFBLENBQVU7QUFBQSxRQUFBLEtBQUEsRUFBTSxTQUFOO09BQVYsQ0FGWCxDQUFBO2FBR0EsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBbEIsQ0FBd0IsU0FBeEIsRUFMNkI7SUFBQSxDQUE5QixFQTNDb0I7RUFBQSxDQUFyQixFQUZrQjtBQUFBLENBQW5CLENBQUEsQ0FBQTs7Ozs7QUNBQSxJQUFBLE1BQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBQVQsQ0FBQTs7QUFBQSxRQUVBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7QUFFbkIsRUFBQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUEsQ0FBbEIsQ0FBQSxDQUFBO1NBS0EsUUFBQSxDQUFTLFFBQVQsRUFBbUIsU0FBQSxHQUFBO0FBRWxCLElBQUEsRUFBQSxDQUFHLG1CQUFILEVBQXdCLFNBQUMsUUFBRCxHQUFBO0FBRXZCLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFjLElBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZTtBQUFBLFFBQUEsSUFBQSxFQUFLLE1BQUw7T0FBZixDQUFkLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxFQUFSLENBQVcsT0FBWCxFQUFvQixTQUFBLEdBQUE7ZUFBRyxRQUFBLENBQUEsRUFBSDtNQUFBLENBQXBCLENBREEsQ0FBQTthQUVBLE9BQU8sQ0FBQyxLQUFSLENBQUEsRUFKdUI7SUFBQSxDQUF4QixDQUFBLENBQUE7QUFBQSxJQU1BLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFDLFFBQUQsR0FBQTtBQUU5QixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBYyxJQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWU7QUFBQSxRQUFBLElBQUEsRUFBSyxNQUFMO09BQWYsQ0FBZCxDQUFBO0FBQUEsTUFDQSxPQUFPLENBQUMsRUFBUixDQUFXLGNBQVgsRUFBMkIsU0FBQSxHQUFBO0FBQzFCLFFBQUEsT0FBTyxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBbEMsQ0FBd0MsQ0FBeEMsQ0FBQSxDQUFBO2VBQ0EsUUFBQSxDQUFBLEVBRjBCO01BQUEsQ0FBM0IsQ0FEQSxDQUFBO2FBS0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxTQUFBLEdBQUE7QUFDWCxZQUFBLEtBQUE7ZUFBQSxLQUFBLEdBQVEsR0FBQSxDQUFBLE1BREc7TUFBQSxDQUFaLEVBUDhCO0lBQUEsQ0FBL0IsQ0FOQSxDQUFBO0FBQUEsSUFpQkEsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUMsUUFBRCxHQUFBO0FBRS9CLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFjLElBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZTtBQUFBLFFBQUEsSUFBQSxFQUFLLE1BQUw7T0FBZixDQUFkLENBQUE7QUFBQSxNQUVBLE9BQU8sQ0FBQyxFQUFSLENBQVcsY0FBWCxFQUEyQixTQUFBLEdBQUE7ZUFDMUIsT0FBTyxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBbEMsQ0FBd0MsQ0FBeEMsRUFEMEI7TUFBQSxDQUEzQixDQUZBLENBQUE7QUFBQSxNQUtBLE9BQU8sQ0FBQyxFQUFSLENBQVcsZUFBWCxFQUE0QixTQUFBLEdBQUE7QUFDM0IsUUFBQSxPQUFPLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFsQyxDQUF3QyxDQUF4QyxDQUFBLENBQUE7ZUFDQSxRQUFBLENBQUEsRUFGMkI7TUFBQSxDQUE1QixDQUxBLENBQUE7YUFTQSxPQUFPLENBQUMsR0FBUixDQUFZLFNBQUEsR0FBQTtBQUNYLFlBQUEsS0FBQTtBQUFBLFFBQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUFSLENBQUE7ZUFDQSxLQUFLLENBQUMsT0FBTixDQUFBLEVBRlc7TUFBQSxDQUFaLEVBWCtCO0lBQUEsQ0FBaEMsQ0FqQkEsQ0FBQTtXQWdDQSxFQUFBLENBQUcsd0NBQUgsRUFBNkMsU0FBQSxHQUFBO0FBRTVDLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFjLElBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZTtBQUFBLFFBQUEsSUFBQSxFQUFLLE1BQUw7T0FBZixDQUFkLENBQUE7QUFBQSxNQUVBLE9BQU8sQ0FBQyxHQUFSLENBQVksU0FBQSxHQUFBO0FBQ1gsWUFBQSxLQUFBO0FBQUEsUUFBQSxLQUFBLEdBQVEsR0FBQSxDQUFBLEtBQVIsQ0FBQTtBQUFBLFFBQ0EsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBaEIsQ0FBc0IsQ0FBdEIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxLQUFBLEdBQVEsR0FBQSxDQUFBLEtBRlIsQ0FBQTtlQUdBLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQWhCLENBQXNCLENBQXRCLEVBSlc7TUFBQSxDQUFaLENBRkEsQ0FBQTtBQUFBLE1BUUEsT0FBTyxDQUFDLEtBQVIsQ0FBQSxDQVJBLENBQUE7YUFVQSxPQUFPLENBQUMsR0FBUixDQUFZLFNBQUEsR0FBQTtBQUNYLFlBQUEsS0FBQTtBQUFBLFFBQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUFSLENBQUE7QUFBQSxRQUNBLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQWhCLENBQXNCLENBQXRCLENBREEsQ0FBQTtBQUFBLFFBRUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUZSLENBQUE7ZUFHQSxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFoQixDQUFzQixDQUF0QixFQUpXO01BQUEsQ0FBWixFQVo0QztJQUFBLENBQTdDLEVBbENrQjtFQUFBLENBQW5CLEVBUG1CO0FBQUEsQ0FBcEIsQ0FGQSxDQUFBOzs7OztBQ0FBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUV4QixFQUFBLEVBQUEsQ0FBRyxlQUFILEVBQW9CLFNBQUEsR0FBQTtBQUVuQixRQUFBLHNCQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsR0FBQSxDQUFBLE1BQVUsQ0FBQyxZQUFwQixDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsQ0FEUixDQUFBO0FBQUEsSUFFQSxPQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUcsS0FBQSxHQUFIO0lBQUEsQ0FGVixDQUFBO0FBQUEsSUFJQSxNQUFNLENBQUMsRUFBUCxDQUFVLE1BQVYsRUFBa0IsT0FBbEIsQ0FKQSxDQUFBO0FBQUEsSUFLQSxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQVosQ0FMQSxDQUFBO1dBT0EsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFiLENBQW1CLENBQW5CLEVBVG1CO0VBQUEsQ0FBcEIsQ0FBQSxDQUFBO0FBQUEsRUFXQSxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQSxHQUFBO0FBRTNCLFFBQUEsc0JBQUE7QUFBQSxJQUFBLE1BQUEsR0FBUyxHQUFBLENBQUEsTUFBVSxDQUFDLFlBQXBCLENBQUE7QUFBQSxJQUNBLEtBQUEsR0FBUSxDQURSLENBQUE7QUFBQSxJQUVBLE9BQUEsR0FBVSxTQUFBLEdBQUE7YUFBRyxLQUFBLEdBQUg7SUFBQSxDQUZWLENBQUE7QUFBQSxJQUlBLE1BQU0sQ0FBQyxFQUFQLENBQVUsTUFBVixFQUFrQixPQUFsQixDQUpBLENBQUE7QUFBQSxJQUtBLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBWixDQUxBLENBQUE7QUFBQSxJQU9BLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBYixDQUFtQixDQUFuQixDQVBBLENBQUE7QUFBQSxJQVNBLE1BQU0sQ0FBQyxHQUFQLENBQVcsTUFBWCxFQUFtQixPQUFuQixDQVRBLENBQUE7QUFBQSxJQVVBLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBWixDQVZBLENBQUE7V0FZQSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQWIsQ0FBbUIsQ0FBbkIsRUFkMkI7RUFBQSxDQUE1QixDQVhBLENBQUE7U0EyQkEsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUV4QixRQUFBLHNCQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsR0FBQSxDQUFBLE1BQVUsQ0FBQyxZQUFwQixDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsQ0FEUixDQUFBO0FBQUEsSUFFQSxPQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUcsS0FBQSxHQUFIO0lBQUEsQ0FGVixDQUFBO0FBQUEsSUFJQSxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQVosRUFBb0IsT0FBcEIsQ0FKQSxDQUFBO0FBQUEsSUFLQSxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQVosQ0FMQSxDQUFBO0FBQUEsSUFNQSxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQVosQ0FOQSxDQUFBO0FBQUEsSUFPQSxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQVosQ0FQQSxDQUFBO1dBU0EsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFiLENBQW1CLENBQW5CLEVBWHdCO0VBQUEsQ0FBekIsRUE3QndCO0FBQUEsQ0FBekIsQ0FBQSxDQUFBOzs7OztBQ0FBLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUEsR0FBQTtTQUVqQixRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFFcEIsSUFBQSxFQUFBLENBQUcscUJBQUgsRUFBMEIsU0FBQSxHQUFBO0FBRXpCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUFSLENBQUE7QUFBQSxNQUVBLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQWYsQ0FBcUIsQ0FBckIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLENBQXJCLENBSEEsQ0FBQTtBQUFBLE1BSUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBbkIsQ0FBeUIsQ0FBekIsQ0FKQSxDQUFBO2FBS0EsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBcEIsQ0FBMEIsQ0FBMUIsRUFQeUI7SUFBQSxDQUExQixDQUFBLENBQUE7QUFBQSxJQVNBLEVBQUEsQ0FBRyxzQkFBSCxFQUEyQixTQUFBLEdBQUE7QUFFMUIsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLENBQUEsRUFBRSxHQUFGO0FBQUEsUUFBTyxDQUFBLEVBQUUsR0FBVDtBQUFBLFFBQWMsS0FBQSxFQUFNLEdBQXBCO0FBQUEsUUFBeUIsTUFBQSxFQUFPLEdBQWhDO09BQU4sQ0FBWixDQUFBO0FBQUEsTUFFQSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLEdBQXJCLENBRkEsQ0FBQTtBQUFBLE1BR0EsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixDQUhBLENBQUE7QUFBQSxNQUlBLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQW5CLENBQXlCLEdBQXpCLENBSkEsQ0FBQTthQUtBLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQXBCLENBQTBCLEdBQTFCLEVBUDBCO0lBQUEsQ0FBM0IsQ0FUQSxDQUFBO0FBQUEsSUFtQkEsRUFBQSxDQUFHLGlCQUFILEVBQXNCLFNBQUEsR0FBQTtBQUNyQixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsSUFBQSxFQUFLLEdBQUw7QUFBQSxRQUFVLENBQUEsRUFBRSxHQUFaO0FBQUEsUUFBaUIsS0FBQSxFQUFNLEdBQXZCO0FBQUEsUUFBNEIsTUFBQSxFQUFPLEdBQW5DO09BQU4sQ0FBWixDQUFBO2FBQ0EsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixFQUZxQjtJQUFBLENBQXRCLENBbkJBLENBQUE7QUFBQSxJQXVCQSxFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxJQUFBLEVBQUssR0FBTDtBQUFBLFFBQVUsQ0FBQSxFQUFFLEdBQVo7QUFBQSxRQUFpQixLQUFBLEVBQU0sR0FBdkI7QUFBQSxRQUE0QixNQUFBLEVBQU8sR0FBbkM7T0FBTixDQUFaLENBQUE7YUFDQSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLEdBQXJCLEVBRnFCO0lBQUEsQ0FBdEIsQ0F2QkEsQ0FBQTtBQUFBLElBMkJBLEVBQUEsQ0FBRyxpQkFBSCxFQUFzQixTQUFBLEdBQUE7QUFDckIsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLElBQUEsRUFBSyxHQUFMO0FBQUEsUUFBVSxDQUFBLEVBQUUsR0FBWjtBQUFBLFFBQWlCLEtBQUEsRUFBTSxHQUF2QjtBQUFBLFFBQTRCLE1BQUEsRUFBTyxHQUFuQztPQUFOLENBQVosQ0FBQTthQUNBLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQWYsQ0FBcUIsR0FBckIsRUFGcUI7SUFBQSxDQUF0QixDQTNCQSxDQUFBO0FBQUEsSUFnQ0EsRUFBQSxDQUFHLGlCQUFILEVBQXNCLFNBQUEsR0FBQTtBQUNyQixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsQ0FBQSxFQUFFLEdBQUY7QUFBQSxRQUFPLElBQUEsRUFBSyxHQUFaO0FBQUEsUUFBaUIsS0FBQSxFQUFNLEdBQXZCO0FBQUEsUUFBNEIsTUFBQSxFQUFPLEdBQW5DO09BQU4sQ0FBWixDQUFBO2FBQ0EsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixFQUZxQjtJQUFBLENBQXRCLENBaENBLENBQUE7QUFBQSxJQW9DQSxFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxDQUFBLEVBQUUsR0FBRjtBQUFBLFFBQU8sSUFBQSxFQUFLLEdBQVo7QUFBQSxRQUFpQixLQUFBLEVBQU0sR0FBdkI7QUFBQSxRQUE0QixNQUFBLEVBQU8sR0FBbkM7T0FBTixDQUFaLENBQUE7YUFDQSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLEdBQXJCLEVBRnFCO0lBQUEsQ0FBdEIsQ0FwQ0EsQ0FBQTtXQXdDQSxFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxDQUFBLEVBQUUsR0FBRjtBQUFBLFFBQU8sSUFBQSxFQUFLLEdBQVo7QUFBQSxRQUFpQixLQUFBLEVBQU0sR0FBdkI7QUFBQSxRQUE0QixNQUFBLEVBQU8sR0FBbkM7T0FBTixDQUFaLENBQUE7YUFDQSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLEdBQXJCLEVBRnFCO0lBQUEsQ0FBdEIsRUExQ29CO0VBQUEsQ0FBckIsRUFGaUI7QUFBQSxDQUFsQixDQUFBLENBQUE7Ozs7O0FDQUEsSUFBQSxNQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUFULENBQUE7O0FBQUEsUUFFQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUU1QixNQUFBLGVBQUE7QUFBQSxFQUFBLGVBQUEsR0FBa0IsU0FBQyxJQUFELEdBQUE7QUFFakIsUUFBQSwrREFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLDRCQUFQLENBQUE7QUFBQSxJQUVBLE1BQUEsR0FBUyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQWhCLENBQXFCLEtBQUssQ0FBQyxRQUFOLENBQWUsSUFBZixFQUFxQixJQUFyQixDQUFyQixDQUZULENBQUE7QUFBQSxJQUlBLEtBQUEsR0FBUSxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWIsQ0FBNkIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxJQUFmLEVBQXdCLElBQUQsR0FBTSxXQUE3QixDQUE3QixDQUpSLENBQUE7QUFBQSxJQUtBLEtBQUEsR0FBUSxFQUxSLENBQUE7QUFPQSxTQUFBLG1CQUFBO2dDQUFBO0FBQ0MsTUFBQSxLQUFNLENBQUEsU0FBQSxDQUFOLEdBQ0M7QUFBQSxRQUFBLEtBQUEsRUFBTyxLQUFLLENBQUMsS0FBYjtBQUFBLFFBQ0EsY0FBQSx3Q0FBZ0MsQ0FBRSxrQkFEbEM7QUFBQSxRQUVBLGFBQUEsRUFBZSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQWhCLENBQW9CLFNBQUMsQ0FBRCxHQUFBO2lCQUFPLENBQUMsQ0FBQyxLQUFUO1FBQUEsQ0FBcEIsQ0FGZjtPQURELENBREQ7QUFBQSxLQVBBO0FBQUEsSUFhQSxLQUFBLEdBQVEsSUFBSSxDQUFDLFNBQUwsQ0FBZSxLQUFmLEVBQXNCLElBQXRCLEVBQTRCLElBQTVCLENBYlIsQ0FBQTtBQUFBLElBY0EsS0FBQSxHQUFRLElBQUksQ0FBQyxTQUFMLENBQWUsS0FBZixFQUFzQixJQUF0QixFQUE0QixJQUE1QixDQWRSLENBQUE7QUFnQkEsSUFBQSxJQUFHLEtBQUEsS0FBUyxLQUFaO0FBRUMsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLEVBQVosQ0FBQSxDQUFBO0FBQUEsTUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLFFBQUEsR0FBUyxJQUFyQixDQURBLENBQUE7QUFBQSxNQUVBLE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBWixDQUZBLENBRkQ7S0FoQkE7V0FzQkEsTUFBTSxDQUFDLEtBQVAsQ0FBYSxLQUFiLEVBQW9CLEtBQXBCLEVBeEJpQjtFQUFBLENBQWxCLENBQUE7QUEwQkEsRUFBQSxJQUFHLENBQUEsS0FBUyxDQUFDLFFBQU4sQ0FBQSxDQUFQO0FBQ0MsSUFBQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBRTFCLE1BQUEsRUFBQSxDQUFHLFNBQUgsRUFBYyxTQUFBLEdBQUE7ZUFDYixlQUFBLENBQWdCLFNBQWhCLEVBRGE7TUFBQSxDQUFkLENBQUEsQ0FBQTtBQUFBLE1BR0EsRUFBQSxDQUFHLFFBQUgsRUFBYSxTQUFBLEdBQUE7ZUFDWixlQUFBLENBQWdCLFFBQWhCLEVBRFk7TUFBQSxDQUFiLENBSEEsQ0FBQTthQU1BLEVBQUEsQ0FBRyxNQUFILEVBQVcsU0FBQSxHQUFBO2VBQ1YsZUFBQSxDQUFnQixNQUFoQixFQURVO01BQUEsQ0FBWCxFQVIwQjtJQUFBLENBQTNCLENBQUEsQ0FERDtHQTFCQTtTQXNDQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7V0FFdkIsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUEsR0FBQTtBQUszQixVQUFBLGNBQUE7O1FBQUEsTUFBTSxDQUFDLGVBQWdCO09BQXZCO0FBQUEsTUFDQSxNQUFNLENBQUMsWUFBYSxDQUFBLHdCQUFBLENBQXBCLEdBQWdELE9BRGhELENBQUE7QUFBQSxNQUdBLFFBQUEsR0FBZSxJQUFBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLGtCQUFoQixDQUhmLENBQUE7QUFBQSxNQUtBLElBQUEsR0FBTyxRQUFRLENBQUMsY0FBVCxDQUFBLENBTFAsQ0FBQTthQU1BLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBWixDQUFrQixPQUFsQixFQVgyQjtJQUFBLENBQTVCLEVBRnVCO0VBQUEsQ0FBeEIsRUF4QzRCO0FBQUEsQ0FBN0IsQ0FGQSxDQUFBOzs7OztBQ0FBLElBQUEsa0NBQUE7RUFBQSxtSkFBQTs7QUFBQSxhQUFBLEdBQWdCLElBQWhCLENBQUE7O0FBQUEsbUJBQ0EsR0FBc0IsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLE1BQVgsRUFBbUIsVUFBbkIsQ0FEdEIsQ0FBQTs7QUFBQSxRQUdBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBRTFCLEVBQUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBRXBCLElBQUEsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUV6QixVQUFBLFNBQUE7QUFBQSxNQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBaEIsR0FDQztBQUFBLFFBQUEsS0FBQSxFQUFPLGVBQVA7T0FERCxDQUFBO0FBQUEsTUFHQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUNmO0FBQUEsUUFBQSxLQUFBLEVBQVcsSUFBQSxLQUFBLENBQUEsQ0FBWDtBQUFBLFFBQ0EsVUFBQSxFQUFZO0FBQUEsVUFBQyxDQUFBLEVBQUUsRUFBSDtTQURaO09BRGUsQ0FIaEIsQ0FBQTtBQUFBLE1BT0EsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQS9CLENBQXFDLGVBQXJDLENBUEEsQ0FBQTthQVNBLE1BQU0sQ0FBQyxhQUFQLENBQUEsRUFYeUI7SUFBQSxDQUExQixDQUFBLENBQUE7V0FhQSxFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQSxHQUFBO0FBSXZCLFVBQUEsU0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FDZjtBQUFBLFFBQUEsS0FBQSxFQUFXLElBQUEsS0FBQSxDQUFBLENBQVg7QUFBQSxRQUNBLFVBQUEsRUFBWTtBQUFBLFVBQUMsQ0FBQSxFQUFFLEVBQUg7U0FEWjtPQURlLENBQWhCLENBQUE7QUFBQSxNQUlBLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUEvQixDQUFxQyxRQUFyQyxDQUpBLENBQUE7YUFLQSxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBOUIsQ0FBb0MsQ0FBcEMsRUFUdUI7SUFBQSxDQUF4QixFQWZvQjtFQUFBLENBQXJCLENBQUEsQ0FBQTtBQUFBLEVBMEJBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTtBQUV0QixJQUFBLG1CQUFtQixDQUFDLEdBQXBCLENBQXdCLFNBQUMsQ0FBRCxHQUFBO0FBRXZCLE1BQUEsRUFBQSxDQUFHLDBCQUFBLEdBQTJCLENBQTlCLEVBQW1DLFNBQUMsSUFBRCxHQUFBO0FBRWxDLFlBQUEsaUJBQUE7QUFBQSxRQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBQSxDQUFaLENBQUE7QUFBQSxRQUVBLFVBQUEsR0FBYSxFQUZiLENBQUE7QUFBQSxRQUdBLFVBQVcsQ0FBQSxDQUFBLENBQVgsR0FBZ0IsR0FIaEIsQ0FBQTtBQUFBLFFBS0EsS0FBSyxDQUFDLE9BQU4sQ0FDQztBQUFBLFVBQUEsVUFBQSxFQUFZLFVBQVo7QUFBQSxVQUNBLEtBQUEsRUFBTyxRQURQO0FBQUEsVUFFQSxJQUFBLEVBQU0sYUFGTjtTQURELENBTEEsQ0FBQTtlQVVBLEtBQUssQ0FBQyxFQUFOLENBQVMsS0FBVCxFQUFnQixTQUFBLEdBQUE7QUFDZixVQUFBLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFNLENBQUMsS0FBaEIsQ0FBc0IsR0FBdEIsQ0FBQSxDQUFBO2lCQUNBLElBQUEsQ0FBQSxFQUZlO1FBQUEsQ0FBaEIsRUFaa0M7TUFBQSxDQUFuQyxDQUFBLENBQUE7QUFBQSxNQWdCQSxFQUFBLENBQUcsMEJBQUEsR0FBMkIsQ0FBM0IsR0FBNkIsMENBQWhDLEVBQTJFLFNBQUMsSUFBRCxHQUFBO0FBRTFFLFlBQUEsaUJBQUE7QUFBQSxRQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBQSxDQUFaLENBQUE7QUFBQSxRQUNBLEtBQU0sQ0FBQSxDQUFBLENBQU4sR0FBVyxFQURYLENBQUE7QUFBQSxRQUdBLFVBQUEsR0FBYSxFQUhiLENBQUE7QUFBQSxRQUlBLFVBQVcsQ0FBQSxDQUFBLENBQVgsR0FBZ0IsTUFKaEIsQ0FBQTtBQUFBLFFBTUEsS0FBSyxDQUFDLE9BQU4sQ0FDQztBQUFBLFVBQUEsVUFBQSxFQUFZLFVBQVo7QUFBQSxVQUNBLEtBQUEsRUFBTyxRQURQO0FBQUEsVUFFQSxJQUFBLEVBQU0sYUFGTjtTQURELENBTkEsQ0FBQTtlQVdBLEtBQUssQ0FBQyxFQUFOLENBQVMsS0FBVCxFQUFnQixTQUFBLEdBQUE7QUFDZixVQUFBLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFNLENBQUMsS0FBaEIsQ0FBc0IsR0FBdEIsQ0FBQSxDQUFBO2lCQUNBLElBQUEsQ0FBQSxFQUZlO1FBQUEsQ0FBaEIsRUFiMEU7TUFBQSxDQUEzRSxDQWhCQSxDQUFBO2FBaUNBLEVBQUEsQ0FBRywwQkFBQSxHQUEyQixDQUEzQixHQUE2QiwwQ0FBaEMsRUFBMkUsU0FBQyxJQUFELEdBQUE7QUFFMUUsWUFBQSxpQkFBQTtBQUFBLFFBQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFBLENBQVosQ0FBQTtBQUFBLFFBQ0EsS0FBTSxDQUFBLENBQUEsQ0FBTixHQUFXLEVBRFgsQ0FBQTtBQUFBLFFBR0EsVUFBQSxHQUFhLEVBSGIsQ0FBQTtBQUFBLFFBSUEsVUFBVyxDQUFBLENBQUEsQ0FBWCxHQUFnQixNQUpoQixDQUFBO0FBQUEsUUFNQSxLQUFLLENBQUMsT0FBTixDQUNDO0FBQUEsVUFBQSxVQUFBLEVBQVksVUFBWjtBQUFBLFVBQ0EsS0FBQSxFQUFPLFFBRFA7QUFBQSxVQUVBLElBQUEsRUFBTSxhQUZOO1NBREQsQ0FOQSxDQUFBO2VBV0EsS0FBSyxDQUFDLEVBQU4sQ0FBUyxLQUFULEVBQWdCLFNBQUEsR0FBQTtBQUNmLFVBQUEsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQU0sQ0FBQyxLQUFoQixDQUFzQixHQUF0QixDQUFBLENBQUE7aUJBQ0EsSUFBQSxDQUFBLEVBRmU7UUFBQSxDQUFoQixFQWIwRTtNQUFBLENBQTNFLEVBbkN1QjtJQUFBLENBQXhCLENBQUEsQ0FBQTtXQW9EQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQyxJQUFELEdBQUE7QUFFdkMsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQUEsQ0FBWixDQUFBO0FBQUEsTUFFQSxLQUFLLENBQUMsT0FBTixDQUNDO0FBQUEsUUFBQSxVQUFBLEVBQ0M7QUFBQSxVQUFBLEtBQUEsRUFBTyxTQUFBLEdBQUE7bUJBQUcsS0FBSyxDQUFDLEtBQU4sR0FBYyxFQUFqQjtVQUFBLENBQVA7U0FERDtBQUFBLFFBRUEsS0FBQSxFQUFPLFFBRlA7QUFBQSxRQUdBLElBQUEsRUFBTSxhQUhOO09BREQsQ0FGQSxDQUFBO2FBUUEsS0FBSyxDQUFDLEVBQU4sQ0FBUyxLQUFULEVBQWdCLFNBQUEsR0FBQTtBQUNmLFFBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBbkIsQ0FBeUIsQ0FBekIsQ0FBQSxDQUFBO2VBQ0EsSUFBQSxDQUFBLEVBRmU7TUFBQSxDQUFoQixFQVZ1QztJQUFBLENBQXhDLEVBdERzQjtFQUFBLENBQXZCLENBMUJBLENBQUE7QUFBQSxFQWdHQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7QUFFakIsSUFBQSxFQUFBLENBQUcsYUFBSCxFQUFrQixTQUFDLElBQUQsR0FBQTtBQUVqQixVQUFBLGdCQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQUEsQ0FBWixDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUNmO0FBQUEsUUFBQSxLQUFBLEVBQU8sS0FBUDtBQUFBLFFBQ0EsVUFBQSxFQUFZO0FBQUEsVUFBQyxDQUFBLEVBQUUsRUFBSDtTQURaO0FBQUEsUUFFQSxLQUFBLEVBQU8sUUFGUDtBQUFBLFFBR0EsSUFBQSxFQUFNLEdBSE47T0FEZSxDQUZoQixDQUFBO0FBQUEsTUFRQSxTQUFTLENBQUMsS0FBVixDQUFBLENBUkEsQ0FBQTthQVVBLEtBQUssQ0FBQyxLQUFOLENBQVksU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFsQixHQUF5QixHQUFyQyxFQUEwQyxTQUFBLEdBQUE7QUFDekMsUUFBQSxTQUFTLENBQUMsSUFBVixDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQWxCLENBQXlCLEVBQXpCLEVBQTZCLEVBQTdCLENBREEsQ0FBQTtlQUVBLElBQUEsQ0FBQSxFQUh5QztNQUFBLENBQTFDLEVBWmlCO0lBQUEsQ0FBbEIsQ0FBQSxDQUFBO1dBaUJBLEVBQUEsQ0FBRyx3REFBSCxFQUE2RCxTQUFBLEdBQUE7QUFFNUQsVUFBQSxzQ0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFBLENBQVosQ0FBQTtBQUFBLE1BRUEsVUFBQSxHQUFpQixJQUFBLFNBQUEsQ0FDaEI7QUFBQSxRQUFBLEtBQUEsRUFBTyxLQUFQO0FBQUEsUUFDQSxVQUFBLEVBQVk7QUFBQSxVQUFDLENBQUEsRUFBRSxFQUFIO1NBRFo7QUFBQSxRQUVBLEtBQUEsRUFBTyxRQUZQO0FBQUEsUUFHQSxJQUFBLEVBQU0sR0FITjtPQURnQixDQUZqQixDQUFBO0FBQUEsTUFRQSxVQUFBLEdBQWlCLElBQUEsU0FBQSxDQUNoQjtBQUFBLFFBQUEsS0FBQSxFQUFPLEtBQVA7QUFBQSxRQUNBLFVBQUEsRUFBWTtBQUFBLFVBQUMsQ0FBQSxFQUFFLEVBQUg7U0FEWjtBQUFBLFFBRUEsS0FBQSxFQUFPLFFBRlA7QUFBQSxRQUdBLElBQUEsRUFBTSxHQUhOO09BRGdCLENBUmpCLENBQUE7QUFBQSxNQWNBLE9BQUEsR0FBVSxLQWRWLENBQUE7QUFBQSxNQWVBLFVBQVUsQ0FBQyxFQUFYLENBQWMsTUFBZCxFQUFzQixTQUFBLEdBQUE7ZUFBRyxPQUFBLEdBQVUsS0FBYjtNQUFBLENBQXRCLENBZkEsQ0FBQTtBQUFBLE1BaUJBLFVBQVUsQ0FBQyxLQUFYLENBQUEsQ0FBa0IsQ0FBQyxNQUFNLENBQUMsS0FBMUIsQ0FBZ0MsSUFBaEMsQ0FqQkEsQ0FBQTtBQUFBLE1Ba0JBLFVBQVUsQ0FBQyxLQUFYLENBQUEsQ0FBa0IsQ0FBQyxNQUFNLENBQUMsS0FBMUIsQ0FBZ0MsSUFBaEMsQ0FsQkEsQ0FBQTthQW9CQSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQWYsQ0FBcUIsSUFBckIsRUF0QjREO0lBQUEsQ0FBN0QsRUFuQmlCO0VBQUEsQ0FBbEIsQ0FoR0EsQ0FBQTtBQUFBLEVBMklBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTtBQUVuQixJQUFBLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBLEdBQUE7QUFFcEMsVUFBQSxnQkFBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFBLENBQVosQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLEtBQUssQ0FBQyxPQUFOLENBQ1g7QUFBQSxRQUFBLFVBQUEsRUFBWTtBQUFBLFVBQUMsQ0FBQSxFQUFHLEdBQUo7U0FBWjtBQUFBLFFBQ0EsSUFBQSxFQUFNLEdBRE47T0FEVyxDQURaLENBQUE7QUFBQSxNQUtBLENBQUMsYUFBYSxLQUFLLENBQUMsVUFBTixDQUFBLENBQWIsRUFBQSxTQUFBLE1BQUQsQ0FBaUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQUQsQ0FMM0MsQ0FBQTtBQUFBLE1BTUEsS0FBSyxDQUFDLFdBQU4sQ0FBQSxDQU5BLENBQUE7YUFPQSxDQUFDLGFBQWEsS0FBSyxDQUFDLFVBQU4sQ0FBQSxDQUFiLEVBQUEsU0FBQSxNQUFELENBQWlDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFELEVBVFA7SUFBQSxDQUFyQyxDQUFBLENBQUE7QUFBQSxJQVdBLEVBQUEsQ0FBRywwQ0FBSCxFQUErQyxTQUFDLElBQUQsR0FBQTtBQUU5QyxVQUFBLDZCQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQUEsQ0FBWixDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQVksS0FBSyxDQUFDLE9BQU4sQ0FDWDtBQUFBLFFBQUEsVUFBQSxFQUFZO0FBQUEsVUFBQyxDQUFBLEVBQUcsR0FBSjtTQUFaO0FBQUEsUUFDQSxJQUFBLEVBQU0sR0FETjtPQURXLENBRlosQ0FBQTtBQUFBLE1BTUEsS0FBQSxHQUFRLENBTlIsQ0FBQTtBQUFBLE1BUUEsSUFBQSxHQUFPLFNBQUEsR0FBQTtBQUNOLFFBQUEsS0FBSyxDQUFDLFVBQU4sQ0FBQSxDQUFrQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBakMsQ0FBdUMsQ0FBdkMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxLQUFBLEVBREEsQ0FBQTtBQUdBLFFBQUEsSUFBRyxLQUFBLEtBQVMsQ0FBWjtpQkFDQyxJQUFBLENBQUEsRUFERDtTQUpNO01BQUEsQ0FSUCxDQUFBO0FBQUEsTUFlQSxTQUFTLENBQUMsRUFBVixDQUFhLEtBQWIsRUFBb0IsSUFBcEIsQ0FmQSxDQUFBO2FBZ0JBLFNBQVMsQ0FBQyxFQUFWLENBQWEsTUFBYixFQUFxQixJQUFyQixFQWxCOEM7SUFBQSxDQUEvQyxDQVhBLENBQUE7V0ErQkEsRUFBQSxDQUFHLDJDQUFILEVBQWdELFNBQUEsR0FBQTtBQUUvQyxVQUFBLGdCQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQUEsQ0FBWixDQUFBO0FBQUEsTUFDQSxTQUFBLEdBQVksS0FBSyxDQUFDLE9BQU4sQ0FDWDtBQUFBLFFBQUEsVUFBQSxFQUFZO0FBQUEsVUFBQyxDQUFBLEVBQUcsR0FBSjtTQUFaO0FBQUEsUUFDQSxJQUFBLEVBQU0sR0FETjtPQURXLENBRFosQ0FBQTtBQUFBLE1BS0EsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBekIsQ0FBK0IsSUFBL0IsQ0FMQSxDQUFBO0FBQUEsTUFNQSxLQUFLLENBQUMsV0FBTixDQUFBLENBTkEsQ0FBQTthQU9BLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQXpCLENBQStCLEtBQS9CLEVBVCtDO0lBQUEsQ0FBaEQsRUFqQ21CO0VBQUEsQ0FBcEIsQ0EzSUEsQ0FBQTtBQUFBLEVBd0xBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTtBQUVsQixJQUFBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFDLElBQUQsR0FBQTtBQUV4QixVQUFBLHVCQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQUEsQ0FBWixDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUNmO0FBQUEsUUFBQSxLQUFBLEVBQU8sS0FBUDtBQUFBLFFBQ0EsVUFBQSxFQUFZO0FBQUEsVUFBQyxDQUFBLEVBQUUsRUFBSDtTQURaO0FBQUEsUUFFQSxLQUFBLEVBQU8sUUFGUDtBQUFBLFFBR0EsSUFBQSxFQUFNLGFBSE47T0FEZSxDQUZoQixDQUFBO0FBQUEsTUFRQSxLQUFBLEdBQVEsQ0FSUixDQUFBO0FBQUEsTUFVQSxTQUFTLENBQUMsRUFBVixDQUFhLE9BQWIsRUFBc0IsU0FBQSxHQUFBO2VBQUcsS0FBQSxHQUFIO01BQUEsQ0FBdEIsQ0FWQSxDQUFBO0FBQUEsTUFXQSxLQUFLLENBQUMsRUFBTixDQUFTLE9BQVQsRUFBa0IsU0FBQSxHQUFBO2VBQUcsS0FBQSxHQUFIO01BQUEsQ0FBbEIsQ0FYQSxDQUFBO0FBQUEsTUFhQSxTQUFTLENBQUMsS0FBVixDQUFBLENBYkEsQ0FBQTthQWVBLEtBQUssQ0FBQyxFQUFOLENBQVMsS0FBVCxFQUFnQixTQUFBLEdBQUE7QUFDZixRQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBYixDQUFtQixDQUFuQixDQUFBLENBQUE7ZUFDQSxJQUFBLENBQUEsRUFGZTtNQUFBLENBQWhCLEVBakJ3QjtJQUFBLENBQXpCLENBQUEsQ0FBQTtBQUFBLElBcUJBLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFDLElBQUQsR0FBQTtBQUV0QixVQUFBLDZCQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQUEsQ0FBWixDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUNmO0FBQUEsUUFBQSxLQUFBLEVBQU8sS0FBUDtBQUFBLFFBQ0EsVUFBQSxFQUFZO0FBQUEsVUFBQyxDQUFBLEVBQUUsRUFBSDtTQURaO0FBQUEsUUFFQSxLQUFBLEVBQU8sUUFGUDtBQUFBLFFBR0EsSUFBQSxFQUFNLGFBSE47T0FEZSxDQUZoQixDQUFBO0FBQUEsTUFRQSxLQUFBLEdBQVEsQ0FSUixDQUFBO0FBQUEsTUFTQSxJQUFBLEdBQU8sU0FBQSxHQUFBO0FBQUcsUUFBQSxLQUFBLEVBQUEsQ0FBQTtBQUFTLFFBQUEsSUFBVSxLQUFBLEtBQVMsQ0FBbkI7aUJBQUEsSUFBQSxDQUFBLEVBQUE7U0FBWjtNQUFBLENBVFAsQ0FBQTtBQUFBLE1BV0EsU0FBUyxDQUFDLEVBQVYsQ0FBYSxLQUFiLEVBQW9CLElBQXBCLENBWEEsQ0FBQTtBQUFBLE1BWUEsS0FBSyxDQUFDLEVBQU4sQ0FBUyxLQUFULEVBQWdCLElBQWhCLENBWkEsQ0FBQTthQWNBLFNBQVMsQ0FBQyxLQUFWLENBQUEsRUFoQnNCO0lBQUEsQ0FBdkIsQ0FyQkEsQ0FBQTtXQXdDQSxFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQyxJQUFELEdBQUE7QUFFdkIsVUFBQSw2QkFBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFBLENBQVosQ0FBQTtBQUFBLE1BRUEsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FDZjtBQUFBLFFBQUEsS0FBQSxFQUFPLEtBQVA7QUFBQSxRQUNBLFVBQUEsRUFBWTtBQUFBLFVBQUMsQ0FBQSxFQUFFLEVBQUg7U0FEWjtBQUFBLFFBRUEsS0FBQSxFQUFPLFFBRlA7QUFBQSxRQUdBLElBQUEsRUFBTSxhQUFBLEdBQWdCLENBSHRCO09BRGUsQ0FGaEIsQ0FBQTtBQUFBLE1BUUEsS0FBQSxHQUFRLENBUlIsQ0FBQTtBQUFBLE1BU0EsSUFBQSxHQUFPLFNBQUEsR0FBQTtBQUFHLFFBQUEsS0FBQSxFQUFBLENBQUE7QUFBUyxRQUFBLElBQVUsS0FBQSxLQUFTLENBQW5CO2lCQUFBLElBQUEsQ0FBQSxFQUFBO1NBQVo7TUFBQSxDQVRQLENBQUE7QUFBQSxNQVdBLFNBQVMsQ0FBQyxFQUFWLENBQWEsTUFBYixFQUFxQixJQUFyQixDQVhBLENBQUE7QUFBQSxNQVlBLEtBQUssQ0FBQyxFQUFOLENBQVMsTUFBVCxFQUFpQixJQUFqQixDQVpBLENBQUE7QUFBQSxNQWNBLFNBQVMsQ0FBQyxLQUFWLENBQUEsQ0FkQSxDQUFBO2FBZ0JBLEtBQUssQ0FBQyxLQUFOLENBQVksYUFBWixFQUEyQixTQUFBLEdBQUE7ZUFDMUIsU0FBUyxDQUFDLElBQVYsQ0FBQSxFQUQwQjtNQUFBLENBQTNCLEVBbEJ1QjtJQUFBLENBQXhCLEVBMUNrQjtFQUFBLENBQW5CLENBeExBLENBQUE7QUFBQSxFQXVQQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7V0FFakIsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUMsSUFBRCxHQUFBO0FBRWhDLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBQSxDQUFaLENBQUE7QUFBQSxNQUVBLFNBQUEsR0FBZ0IsSUFBQSxTQUFBLENBQ2Y7QUFBQSxRQUFBLEtBQUEsRUFBTyxLQUFQO0FBQUEsUUFDQSxVQUFBLEVBQVk7QUFBQSxVQUFDLENBQUEsRUFBRSxFQUFIO1NBRFo7QUFBQSxRQUVBLEtBQUEsRUFBTyxRQUZQO0FBQUEsUUFHQSxJQUFBLEVBQU0sYUFITjtBQUFBLFFBSUEsS0FBQSxFQUFPLGFBSlA7T0FEZSxDQUZoQixDQUFBO0FBQUEsTUFTQSxTQUFTLENBQUMsS0FBVixDQUFBLENBVEEsQ0FBQTthQVdBLEtBQUssQ0FBQyxLQUFOLENBQVksYUFBWixFQUEyQixTQUFBLEdBQUE7QUFDMUIsUUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBbEIsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsQ0FBQSxDQUFBO2VBQ0EsS0FBSyxDQUFDLEtBQU4sQ0FBWSxhQUFaLEVBQTJCLFNBQUEsR0FBQTtBQUMxQixVQUFBLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFsQixDQUF5QixFQUF6QixFQUE2QixFQUE3QixDQUFBLENBQUE7aUJBQ0EsSUFBQSxDQUFBLEVBRjBCO1FBQUEsQ0FBM0IsRUFGMEI7TUFBQSxDQUEzQixFQWJnQztJQUFBLENBQWpDLEVBRmlCO0VBQUEsQ0FBbEIsQ0F2UEEsQ0FBQTtBQUFBLEVBNFFBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTtXQUVsQixFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQyxJQUFELEdBQUE7QUFFN0IsVUFBQSx1QkFBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFBLENBQVosQ0FBQTtBQUFBLE1BRUEsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FDZjtBQUFBLFFBQUEsS0FBQSxFQUFPLEtBQVA7QUFBQSxRQUNBLFVBQUEsRUFBWTtBQUFBLFVBQUMsQ0FBQSxFQUFHLFNBQUEsR0FBQTttQkFBRyxLQUFLLENBQUMsQ0FBTixHQUFVLElBQWI7VUFBQSxDQUFKO1NBRFo7QUFBQSxRQUVBLEtBQUEsRUFBTyxRQUZQO0FBQUEsUUFHQSxJQUFBLEVBQU0sYUFITjtBQUFBLFFBSUEsTUFBQSxFQUFRLENBSlI7T0FEZSxDQUZoQixDQUFBO0FBQUEsTUFTQSxTQUFTLENBQUMsS0FBVixDQUFBLENBVEEsQ0FBQTtBQUFBLE1BV0EsS0FBQSxHQUFRLENBWFIsQ0FBQTthQWFBLEtBQUssQ0FBQyxFQUFOLENBQVMsS0FBVCxFQUFnQixTQUFBLEdBQUE7QUFDZixRQUFBLEtBQUEsRUFBQSxDQUFBO0FBQ0EsUUFBQSxJQUFHLEtBQUEsS0FBUyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQTlCO2lCQUNDLElBQUEsQ0FBQSxFQUREO1NBRmU7TUFBQSxDQUFoQixFQWY2QjtJQUFBLENBQTlCLEVBRmtCO0VBQUEsQ0FBbkIsQ0E1UUEsQ0FBQTtBQUFBLEVBbVNBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtXQUV6QixFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQyxJQUFELEdBQUE7QUFFbkQsVUFBQSwwQ0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxLQUFBLEVBQU0sRUFBTjtBQUFBLFFBQVUsTUFBQSxFQUFPLEVBQWpCO09BQU4sQ0FBYixDQUFBO0FBQUEsTUFDQSxNQUFNLENBQUMsSUFBUCxHQUFjLFFBRGQsQ0FBQTtBQUFBLE1BRUEsTUFBTSxDQUFDLE9BQVAsQ0FDQztBQUFBLFFBQUEsVUFBQSxFQUFZO0FBQUEsVUFBQyxDQUFBLEVBQUUsR0FBSDtTQUFaO0FBQUEsUUFDQSxJQUFBLEVBQU0sQ0FBQSxHQUFJLGFBRFY7T0FERCxDQUZBLENBQUE7QUFBQSxNQU1BLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsS0FBQSxFQUFNLEVBQU47QUFBQSxRQUFVLE1BQUEsRUFBTyxFQUFqQjtBQUFBLFFBQXFCLENBQUEsRUFBRSxHQUF2QjtBQUFBLFFBQTRCLGVBQUEsRUFBZ0IsS0FBNUM7T0FBTixDQU5iLENBQUE7QUFBQSxNQU9BLE1BQU0sQ0FBQyxJQUFQLEdBQWMsUUFQZCxDQUFBO0FBQUEsTUFRQSxNQUFNLENBQUMsT0FBUCxDQUNDO0FBQUEsUUFBQSxVQUFBLEVBQVk7QUFBQSxVQUFDLENBQUEsRUFBRSxHQUFIO1NBQVo7QUFBQSxRQUNBLElBQUEsRUFBTSxDQUFBLEdBQUksYUFEVjtPQURELENBUkEsQ0FBQTtBQUFBLE1BWUEsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxLQUFBLEVBQU0sRUFBTjtBQUFBLFFBQVUsTUFBQSxFQUFPLEVBQWpCO0FBQUEsUUFBcUIsQ0FBQSxFQUFFLEdBQXZCO0FBQUEsUUFBNEIsZUFBQSxFQUFnQixRQUE1QztPQUFOLENBWmIsQ0FBQTtBQUFBLE1BYUEsTUFBTSxDQUFDLElBQVAsR0FBYyxRQWJkLENBQUE7QUFBQSxNQWNBLE1BQU0sQ0FBQyxPQUFQLENBQ0M7QUFBQSxRQUFBLFVBQUEsRUFBWTtBQUFBLFVBQUMsQ0FBQSxFQUFFLEdBQUg7U0FBWjtBQUFBLFFBQ0EsSUFBQSxFQUFNLENBQUEsR0FBSSxhQURWO0FBQUEsUUFFQSxLQUFBLEVBQU8sY0FGUDtPQURELENBZEEsQ0FBQTtBQUFBLE1BbUJBLFdBQUEsR0FBYyxFQW5CZCxDQUFBO0FBQUEsTUFxQkEsS0FBQSxHQUFRLFNBQUMsU0FBRCxFQUFZLEtBQVosR0FBQTtBQUVQLFFBQUEsQ0FBQyxhQUFTLFdBQVQsRUFBQSxLQUFBLE1BQUQsQ0FBc0IsQ0FBQyxNQUFNLENBQUMsS0FBOUIsQ0FBb0MsS0FBcEMsQ0FBQSxDQUFBO0FBQUEsUUFFQSxXQUFXLENBQUMsSUFBWixDQUFpQixLQUFqQixDQUZBLENBQUE7QUFJQSxRQUFBLElBQUcsV0FBVyxDQUFDLE1BQVosS0FBc0IsQ0FBekI7QUFDQyxVQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQWhCLENBQXNCLEdBQXRCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBaEIsQ0FBc0IsR0FBdEIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFoQixDQUFzQixHQUF0QixDQUZBLENBQUE7aUJBR0EsSUFBQSxDQUFBLEVBSkQ7U0FOTztNQUFBLENBckJSLENBQUE7QUFBQSxNQWlDQSxNQUFNLENBQUMsRUFBUCxDQUFVLEtBQVYsRUFBaUIsS0FBakIsQ0FqQ0EsQ0FBQTtBQUFBLE1Ba0NBLE1BQU0sQ0FBQyxFQUFQLENBQVUsS0FBVixFQUFpQixLQUFqQixDQWxDQSxDQUFBO2FBbUNBLE1BQU0sQ0FBQyxFQUFQLENBQVUsS0FBVixFQUFpQixLQUFqQixFQXJDbUQ7SUFBQSxDQUFwRCxFQUZ5QjtFQUFBLENBQTFCLENBblNBLENBQUE7U0E2VUEsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO0FBRXJCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLENBQUEsRUFBRyxDQUFIO0FBQUEsUUFBTSxDQUFBLEVBQUcsQ0FBVDtBQUFBLFFBQVksS0FBQSxFQUFPLEVBQW5CO0FBQUEsUUFBdUIsTUFBQSxFQUFRLEVBQS9CO09BQU4sRUFESDtJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFHQSxRQUFBLENBQVMsMkJBQVQsRUFBc0MsU0FBQSxHQUFBO2FBRXJDLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFFL0IsUUFBQSxFQUFBLENBQUcsNEZBQUgsRUFBaUcsU0FBQSxHQUFBO0FBQ2hHLGNBQUEsU0FBQTtBQUFBLFVBQUEsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FDZjtBQUFBLFlBQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxLQUFSO0FBQUEsWUFDQSxVQUFBLEVBQVk7QUFBQSxjQUFFLENBQUEsRUFBRyxHQUFMO2FBRFo7QUFBQSxZQUVBLEtBQUEsRUFBTyxjQUZQO0FBQUEsWUFHQSxZQUFBLEVBQ0M7QUFBQSxjQUFBLElBQUEsRUFBTSxDQUFOO0FBQUEsY0FDQSxNQUFBLEVBQVEsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLElBQVAsRUFBYSxDQUFiLENBRFI7YUFKRDtXQURlLENBQWhCLENBQUE7QUFBQSxVQVFBLFNBQVMsQ0FBQyxLQUFWLENBQUEsQ0FSQSxDQUFBO0FBQUEsVUFTQSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQXhDLENBQThDLENBQTlDLENBVEEsQ0FBQTtpQkFVQSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQTFDLENBQThDLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxHQUFQLEVBQVksQ0FBWixDQUE5QyxFQVhnRztRQUFBLENBQWpHLENBQUEsQ0FBQTtBQUFBLFFBYUEsRUFBQSxDQUFHLDRHQUFILEVBQWlILFNBQUEsR0FBQTtBQUNoSCxjQUFBLFNBQUE7QUFBQSxVQUFBLFNBQUEsR0FBZ0IsSUFBQSxTQUFBLENBQ2Y7QUFBQSxZQUFBLEtBQUEsRUFBTyxJQUFDLENBQUEsS0FBUjtBQUFBLFlBQ0EsVUFBQSxFQUFZO0FBQUEsY0FBRSxDQUFBLEVBQUcsR0FBTDthQURaO0FBQUEsWUFFQSxLQUFBLEVBQU8sY0FGUDtBQUFBLFlBR0EsWUFBQSxFQUNDO0FBQUEsY0FBQSxJQUFBLEVBQU0sQ0FBTjtBQUFBLGNBQ0EsTUFBQSxFQUFRLFVBRFI7YUFKRDtXQURlLENBQWhCLENBQUE7QUFBQSxVQVFBLFNBQVMsQ0FBQyxLQUFWLENBQUEsQ0FSQSxDQUFBO0FBQUEsVUFTQSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQXhDLENBQThDLENBQTlDLENBVEEsQ0FBQTtpQkFVQSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQTFDLENBQThDLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxHQUFQLEVBQVksQ0FBWixDQUE5QyxFQVhnSDtRQUFBLENBQWpILENBYkEsQ0FBQTtBQUFBLFFBMEJBLEVBQUEsQ0FBRyxpREFBSCxFQUFzRCxTQUFBLEdBQUE7QUFDckQsY0FBQSxTQUFBO0FBQUEsVUFBQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUNmO0FBQUEsWUFBQSxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBQVI7QUFBQSxZQUNBLFVBQUEsRUFBWTtBQUFBLGNBQUUsQ0FBQSxFQUFHLEdBQUw7YUFEWjtBQUFBLFlBRUEsS0FBQSxFQUFPLGNBRlA7QUFBQSxZQUdBLFlBQUEsRUFBYyxVQUhkO1dBRGUsQ0FBaEIsQ0FBQTtBQUFBLFVBTUEsU0FBUyxDQUFDLEtBQVYsQ0FBQSxDQU5BLENBQUE7QUFBQSxVQU9BLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBeEMsQ0FBOEMsQ0FBOUMsQ0FQQSxDQUFBO2lCQVFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBMUMsQ0FBOEMsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLEdBQVAsRUFBWSxDQUFaLENBQTlDLEVBVHFEO1FBQUEsQ0FBdEQsQ0ExQkEsQ0FBQTtBQUFBLFFBcUNBLEVBQUEsQ0FBRywwREFBSCxFQUErRCxTQUFBLEdBQUE7QUFDOUQsY0FBQSxTQUFBO0FBQUEsVUFBQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUNmO0FBQUEsWUFBQSxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBQVI7QUFBQSxZQUNBLFVBQUEsRUFBWTtBQUFBLGNBQUUsQ0FBQSxFQUFHLEdBQUw7YUFEWjtBQUFBLFlBRUEsSUFBQSxFQUFNLENBRk47QUFBQSxZQUdBLEtBQUEsRUFBTyxjQUhQO0FBQUEsWUFJQSxZQUFBLEVBQWMsVUFKZDtXQURlLENBQWhCLENBQUE7QUFBQSxVQU9BLFNBQVMsQ0FBQyxLQUFWLENBQUEsQ0FQQSxDQUFBO0FBQUEsVUFRQSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQXhDLENBQThDLENBQTlDLENBUkEsQ0FBQTtpQkFTQSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQTFDLENBQThDLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxHQUFQLEVBQVksQ0FBWixDQUE5QyxFQVY4RDtRQUFBLENBQS9ELENBckNBLENBQUE7QUFBQSxRQWlEQSxFQUFBLENBQUcsbUZBQUgsRUFBd0YsU0FBQSxHQUFBO0FBQ3ZGLGNBQUEsU0FBQTtBQUFBLFVBQUEsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FDZjtBQUFBLFlBQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxLQUFSO0FBQUEsWUFDQSxVQUFBLEVBQVk7QUFBQSxjQUFFLENBQUEsRUFBRyxHQUFMO2FBRFo7QUFBQSxZQUVBLElBQUEsRUFBTSxDQUZOO0FBQUEsWUFHQSxLQUFBLEVBQU8sNkJBSFA7V0FEZSxDQUFoQixDQUFBO0FBQUEsVUFNQSxTQUFTLENBQUMsS0FBVixDQUFBLENBTkEsQ0FBQTtBQUFBLFVBT0EsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUF4QyxDQUE4QyxDQUE5QyxDQVBBLENBQUE7aUJBUUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUExQyxDQUE4QyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sR0FBUCxFQUFZLENBQVosQ0FBOUMsRUFUdUY7UUFBQSxDQUF4RixDQWpEQSxDQUFBO2VBNERBLEVBQUEsQ0FBRyx3RUFBSCxFQUE2RSxTQUFBLEdBQUE7QUFDNUUsY0FBQSxTQUFBO0FBQUEsVUFBQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUNmO0FBQUEsWUFBQSxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBQVI7QUFBQSxZQUNBLFVBQUEsRUFBWTtBQUFBLGNBQUUsQ0FBQSxFQUFHLEdBQUw7YUFEWjtBQUFBLFlBRUEsSUFBQSxFQUFNLENBRk47QUFBQSxZQUdBLEtBQUEsRUFBTyxjQUhQO0FBQUEsWUFJQSxZQUFBLEVBQWMsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLElBQVAsRUFBYSxDQUFiLENBSmQ7V0FEZSxDQUFoQixDQUFBO0FBQUEsVUFPQSxTQUFTLENBQUMsS0FBVixDQUFBLENBUEEsQ0FBQTtBQUFBLFVBUUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUF4QyxDQUE4QyxDQUE5QyxDQVJBLENBQUE7aUJBU0EsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUExQyxDQUE4QyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sR0FBUCxFQUFZLENBQVosQ0FBOUMsRUFWNEU7UUFBQSxDQUE3RSxFQTlEK0I7TUFBQSxDQUFoQyxFQUZxQztJQUFBLENBQXRDLENBSEEsQ0FBQTtXQStFQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBRTFCLE1BQUEsRUFBQSxDQUFHLDBFQUFILEVBQStFLFNBQUEsR0FBQTtBQUM5RSxZQUFBLFNBQUE7QUFBQSxRQUFBLFNBQUEsR0FBZ0IsSUFBQSxTQUFBLENBQ2Y7QUFBQSxVQUFBLEtBQUEsRUFBTyxJQUFDLENBQUEsS0FBUjtBQUFBLFVBQ0EsVUFBQSxFQUFZO0FBQUEsWUFBRSxDQUFBLEVBQUcsR0FBTDtXQURaO0FBQUEsVUFFQSxLQUFBLEVBQU8sUUFGUDtBQUFBLFVBR0EsSUFBQSxFQUFNLENBSE47U0FEZSxDQUFoQixDQUFBO0FBQUEsUUFNQSxTQUFTLENBQUMsS0FBVixDQUFBLENBTkEsQ0FBQTtlQU9BLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBeEMsQ0FBOEMsQ0FBOUMsRUFSOEU7TUFBQSxDQUEvRSxDQUFBLENBQUE7YUFVQSxFQUFBLENBQUcsc0VBQUgsRUFBMkUsU0FBQSxHQUFBO0FBQzFFLFlBQUEsU0FBQTtBQUFBLFFBQUEsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FDZjtBQUFBLFVBQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxLQUFSO0FBQUEsVUFDQSxVQUFBLEVBQVk7QUFBQSxZQUFFLENBQUEsRUFBRyxHQUFMO1dBRFo7QUFBQSxVQUVBLEtBQUEsRUFBTyxRQUZQO0FBQUEsVUFHQSxZQUFBLEVBQ0M7QUFBQSxZQUFBLElBQUEsRUFBTSxDQUFOO1dBSkQ7U0FEZSxDQUFoQixDQUFBO0FBQUEsUUFPQSxTQUFTLENBQUMsS0FBVixDQUFBLENBUEEsQ0FBQTtlQVFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBeEMsQ0FBOEMsQ0FBOUMsRUFUMEU7TUFBQSxDQUEzRSxFQVowQjtJQUFBLENBQTNCLEVBakZxQjtFQUFBLENBQXRCLEVBL1UwQjtBQUFBLENBQTNCLENBSEEsQ0FBQTs7Ozs7QUNBQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFFdkIsRUFBQSxRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBLEdBQUE7QUFFbEIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFhLElBQUEsS0FBQSxDQUFBLENBQWIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBZCxDQUFrQixHQUFsQixFQUF1QjtBQUFBLFFBQUMsQ0FBQSxFQUFFLEdBQUg7QUFBQSxRQUFRLENBQUEsRUFBRSxHQUFWO09BQXZCLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQWQsQ0FBa0IsR0FBbEIsRUFBdUI7QUFBQSxRQUFDLENBQUEsRUFBRSxHQUFIO0FBQUEsUUFBUSxDQUFBLEVBQUUsR0FBVjtPQUF2QixFQUhVO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUtBLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFDLElBQUQsR0FBQTtBQUUzQyxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxRQUFELEVBQVcsT0FBWCxFQUFvQixNQUFwQixHQUFBO0FBQ04sVUFBQSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQWhCLENBQXNCLFNBQXRCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLEdBQXJCLENBREEsQ0FBQTtBQUFBLFVBRUEsS0FBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUEzQixDQUFpQyxTQUFqQyxDQUZBLENBQUE7aUJBR0EsSUFBQSxDQUFBLEVBSk07UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFQLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQWQsQ0FBaUIsWUFBakIsRUFBK0IsSUFBL0IsQ0FOQSxDQUFBO2FBT0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBZCxDQUE0QixHQUE1QixFQVQyQztJQUFBLENBQTVDLENBTEEsQ0FBQTtXQWdCQSxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQyxJQUFELEdBQUE7QUFFMUMsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsUUFBRCxFQUFXLE9BQVgsRUFBb0IsTUFBcEIsR0FBQTtBQUNOLFVBQUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFoQixDQUFzQixTQUF0QixDQUFBLENBQUE7QUFBQSxVQUNBLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixDQURBLENBQUE7QUFBQSxVQUVBLEtBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBM0IsQ0FBaUMsR0FBakMsQ0FGQSxDQUFBO2lCQUdBLElBQUEsQ0FBQSxFQUpNO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBUCxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFkLENBQWlCLFdBQWpCLEVBQThCLElBQTlCLENBTkEsQ0FBQTthQU9BLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWQsQ0FBNEIsR0FBNUIsRUFUMEM7SUFBQSxDQUEzQyxFQWxCa0I7RUFBQSxDQUFuQixDQUFBLENBQUE7QUFBQSxFQThCQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7V0FFcEIsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUV6QixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsS0FBUixDQUFBO0FBQUEsTUFDQSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQWIsQ0FBaUIsTUFBakIsRUFBeUI7QUFBQSxRQUFDLENBQUEsRUFBRSxHQUFIO09BQXpCLENBREEsQ0FBQTtBQUFBLE1BRUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFELENBQVosQ0FBb0IsTUFBcEIsQ0FGQSxDQUFBO0FBQUEsTUFJQSxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUE3QyxDQUFtRCxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUE3RSxDQUpBLENBQUE7QUFBQSxNQU1BLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBaEIsR0FDQztBQUFBLFFBQUEsS0FBQSxFQUFPLGlCQUFQO09BUEQsQ0FBQTtBQUFBLE1BU0EsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQVRSLENBQUE7QUFBQSxNQVVBLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBYixDQUFpQixNQUFqQixFQUF5QjtBQUFBLFFBQUMsQ0FBQSxFQUFFLEdBQUg7T0FBekIsQ0FWQSxDQUFBO0FBQUEsTUFXQSxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQUQsQ0FBWixDQUFvQixNQUFwQixDQVhBLENBQUE7QUFBQSxNQWFBLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQTdDLENBQW1ELGlCQUFuRCxDQWJBLENBQUE7YUFlQSxNQUFNLENBQUMsYUFBUCxDQUFBLEVBakJ5QjtJQUFBLENBQTFCLEVBRm9CO0VBQUEsQ0FBckIsQ0E5QkEsQ0FBQTtBQUFBLEVBcURBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTtXQUVsQixFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQSxHQUFBO0FBRTNCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUFSLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBYixDQUNDO0FBQUEsUUFBQSxNQUFBLEVBQVE7QUFBQSxVQUFDLENBQUEsRUFBRSxHQUFIO1NBQVI7QUFBQSxRQUNBLE1BQUEsRUFBUTtBQUFBLFVBQUMsQ0FBQSxFQUFFLEdBQUg7U0FEUjtPQURELENBREEsQ0FBQTtBQUFBLE1BS0EsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFiLENBQTJCLFFBQTNCLENBTEEsQ0FBQTtBQUFBLE1BTUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQTVCLENBQWtDLFFBQWxDLENBTkEsQ0FBQTtBQUFBLE1BT0EsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixDQVBBLENBQUE7QUFBQSxNQVNBLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYixDQUEyQixRQUEzQixDQVRBLENBQUE7QUFBQSxNQVVBLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUE1QixDQUFrQyxRQUFsQyxDQVZBLENBQUE7YUFXQSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLEdBQXJCLEVBYjJCO0lBQUEsQ0FBNUIsRUFGa0I7RUFBQSxDQUFuQixDQXJEQSxDQUFBO1NBdUVBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTtBQUV0QixJQUFBLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBLEdBQUE7QUFFaEMsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBQSxDQUFBLEtBQVIsQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFiLENBQ0M7QUFBQSxRQUFBLE1BQUEsRUFBUTtBQUFBLFVBQUMsTUFBQSxFQUFPLElBQVI7U0FBUjtBQUFBLFFBQ0EsTUFBQSxFQUFRO0FBQUEsVUFBQyxNQUFBLEVBQU8sS0FBUjtTQURSO09BREQsQ0FEQSxDQUFBO0FBQUEsTUFLQSxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWIsQ0FBMkIsUUFBM0IsQ0FMQSxDQUFBO0FBQUEsTUFNQSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFwQixDQUEwQixJQUExQixDQU5BLENBQUE7QUFBQSxNQVFBLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYixDQUEyQixRQUEzQixDQVJBLENBQUE7QUFBQSxNQVNBLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQXBCLENBQTBCLEtBQTFCLENBVEEsQ0FBQTtBQUFBLE1BV0EsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFiLENBQTJCLFFBQTNCLENBWEEsQ0FBQTthQVlBLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQXBCLENBQTBCLElBQTFCLEVBZGdDO0lBQUEsQ0FBakMsQ0FBQSxDQUFBO0FBQUEsSUFnQkEsRUFBQSxDQUFHLGtEQUFILEVBQXVELFNBQUMsSUFBRCxHQUFBO0FBRXRELFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUFSLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBYixDQUNDO0FBQUEsUUFBQSxNQUFBLEVBQVE7QUFBQSxVQUFDLE1BQUEsRUFBTyxJQUFSO0FBQUEsVUFBYyxlQUFBLEVBQWdCLEtBQTlCO1NBQVI7T0FERCxDQURBLENBQUE7QUFBQSxNQUlBLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQXBCLENBQTBCLEtBQTFCLENBSkEsQ0FBQTtBQUFBLE1BTUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFiLENBQWdCLE1BQU0sQ0FBQyxjQUF2QixFQUF1QyxTQUFBLEdBQUE7QUFDdEMsUUFBQSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFwQixDQUEwQixJQUExQixDQUFBLENBQUE7QUFBQSxRQUNBLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQTdCLENBQW1DLEtBQW5DLENBREEsQ0FBQTtlQUVBLElBQUEsQ0FBQSxFQUhzQztNQUFBLENBQXZDLENBTkEsQ0FBQTthQVdBLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBRCxDQUFaLENBQW9CLFFBQXBCLEVBYnNEO0lBQUEsQ0FBdkQsQ0FoQkEsQ0FBQTtXQStCQSxFQUFBLENBQUcsc0RBQUgsRUFBMkQsU0FBQyxJQUFELEdBQUE7QUFFMUQsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBQSxDQUFBLEtBQVIsQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFiLENBQ0M7QUFBQSxRQUFBLE1BQUEsRUFBUTtBQUFBLFVBQUMsQ0FBQSxFQUFFLEdBQUg7QUFBQSxVQUFRLGVBQUEsRUFBZ0IsS0FBeEI7U0FBUjtPQURELENBREEsQ0FBQTtBQUFBLE1BS0EsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixDQUFyQixDQUxBLENBQUE7QUFBQSxNQU9BLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBYixDQUFnQixNQUFNLENBQUMsY0FBdkIsRUFBdUMsU0FBQSxHQUFBO0FBRXRDLFFBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixDQUFBLENBQUE7QUFBQSxRQUNBLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQTdCLEdBQXFDLEtBRHJDLENBQUE7ZUFFQSxJQUFBLENBQUEsRUFKc0M7TUFBQSxDQUF2QyxDQVBBLENBQUE7YUFhQSxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQUQsQ0FBWixDQUFvQixRQUFwQixFQUE4QjtBQUFBLFFBQUMsS0FBQSxFQUFNLFFBQVA7QUFBQSxRQUFpQixJQUFBLEVBQUssR0FBdEI7T0FBOUIsRUFmMEQ7SUFBQSxDQUEzRCxFQWpDc0I7RUFBQSxDQUF2QixFQXpFdUI7QUFBQSxDQUF4QixDQUFBLENBQUE7Ozs7O0FDQUEsSUFBQSxnQkFBQTtFQUFBLG1KQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUFULENBQUE7O0FBQUEsUUFFQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBRlgsQ0FBQTs7QUFBQSxRQUlBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7QUFRakIsRUFBQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFFcEIsSUFBQSxFQUFBLENBQUcscUJBQUgsRUFBMEIsU0FBQSxHQUFBO0FBRXpCLFVBQUEsS0FBQTtBQUFBLE1BQUEsTUFBTSxDQUFDLFFBQVAsR0FDQztBQUFBLFFBQUEsS0FBQSxFQUNDO0FBQUEsVUFBQSxLQUFBLEVBQU8sR0FBUDtBQUFBLFVBQ0EsTUFBQSxFQUFRLEdBRFI7U0FERDtPQURELENBQUE7QUFBQSxNQUtBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBQSxDQUxaLENBQUE7QUFBQSxNQU9BLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQW5CLENBQXlCLEdBQXpCLENBUEEsQ0FBQTtBQUFBLE1BUUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBcEIsQ0FBMEIsR0FBMUIsQ0FSQSxDQUFBO0FBQUEsTUFVQSxNQUFNLENBQUMsYUFBUCxDQUFBLENBVkEsQ0FBQTtBQUFBLE1BWUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFBLENBWlosQ0FBQTtBQUFBLE1BY0EsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBbkIsQ0FBeUIsR0FBekIsQ0FkQSxDQUFBO2FBZUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBcEIsQ0FBMEIsR0FBMUIsRUFqQnlCO0lBQUEsQ0FBMUIsQ0FBQSxDQUFBO0FBQUEsSUFtQkEsRUFBQSxDQUFHLHFDQUFILEVBQTBDLFNBQUEsR0FBQTtBQUV6QyxVQUFBLEtBQUE7QUFBQSxNQUFBLE1BQU0sQ0FBQyxRQUFQLEdBQ0M7QUFBQSxRQUFBLEtBQUEsRUFDQztBQUFBLFVBQUEsZUFBQSxFQUFpQixLQUFqQjtTQUREO09BREQsQ0FBQTtBQUFBLE1BSUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFBLENBSlosQ0FBQTtBQUFBLE1BTUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQW5DLENBQXlDLEtBQXpDLENBTkEsQ0FBQTthQVVBLE1BQU0sQ0FBQyxhQUFQLENBQUEsRUFaeUM7SUFBQSxDQUExQyxDQW5CQSxDQUFBO1dBa0NBLEVBQUEsQ0FBRyxtQ0FBSCxFQUF3QyxTQUFBLEdBQUE7QUFFdkMsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLENBQUEsRUFBRSxFQUFGO0FBQUEsUUFBTSxDQUFBLEVBQUUsRUFBUjtPQUFOLENBQVosQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixFQUFyQixDQURBLENBQUE7YUFFQSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLEVBQXJCLEVBSnVDO0lBQUEsQ0FBeEMsRUFwQ29CO0VBQUEsQ0FBckIsQ0FBQSxDQUFBO0FBQUEsRUE0Q0EsUUFBQSxDQUFTLFlBQVQsRUFBdUIsU0FBQSxHQUFBO0FBRXRCLElBQUEsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUV6QixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBQSxDQUFaLENBQUE7QUFBQSxNQUVBLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQWYsQ0FBcUIsQ0FBckIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLENBQXJCLENBSEEsQ0FBQTtBQUFBLE1BSUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixDQUFyQixDQUpBLENBQUE7QUFBQSxNQU1BLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQW5CLENBQXlCLEdBQXpCLENBTkEsQ0FBQTthQU9BLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQXBCLENBQTBCLEdBQTFCLEVBVHlCO0lBQUEsQ0FBMUIsQ0FBQSxDQUFBO0FBQUEsSUFXQSxFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQSxHQUFBO0FBRXRCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxLQUFBLEVBQU0sR0FBTjtPQUFOLENBQVosQ0FBQTtBQUFBLE1BRUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBbkIsQ0FBeUIsR0FBekIsQ0FGQSxDQUFBO2FBR0EsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQXpCLENBQStCLE9BQS9CLEVBTHNCO0lBQUEsQ0FBdkIsQ0FYQSxDQUFBO0FBQUEsSUFrQkEsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUV4QixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsS0FBUixDQUFBO0FBQUEsTUFFQSxLQUFLLENBQUMsQ0FBTixHQUFVLEdBRlYsQ0FBQTtBQUFBLE1BR0EsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixDQUhBLENBQUE7QUFBQSxNQUlBLEtBQUssQ0FBQyxDQUFOLEdBQVUsRUFKVixDQUFBO0FBQUEsTUFLQSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLEVBQXJCLENBTEEsQ0FBQTthQVFBLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFuQyxDQUF5Qyw0SUFBekMsRUFWd0I7SUFBQSxDQUF6QixDQWxCQSxDQUFBO0FBQUEsSUE4QkEsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTtBQUV0QixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsS0FBUixDQUFBO0FBQUEsTUFFQSxLQUFLLENBQUMsTUFBTixHQUFlLEdBRmYsQ0FBQTtBQUFBLE1BR0EsS0FBSyxDQUFDLE1BQU4sR0FBZSxHQUhmLENBQUE7QUFBQSxNQUlBLEtBQUssQ0FBQyxNQUFOLEdBQWUsR0FKZixDQUFBO2FBT0EsS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQW5DLENBQXlDLCtJQUF6QyxFQVRzQjtJQUFBLENBQXZCLENBOUJBLENBQUE7QUFBQSxJQXlDQSxFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQSxHQUFBO0FBRXZCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUFSLENBQUE7QUFBQSxNQUVBLEtBQUssQ0FBQyxPQUFOLEdBQWdCLEdBRmhCLENBQUE7QUFBQSxNQUdBLEtBQUssQ0FBQyxPQUFOLEdBQWdCLEdBSGhCLENBQUE7QUFLQSxNQUFBLElBQUcsS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUFIO0FBQ0MsUUFBQSxLQUFLLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxLQUF6QyxDQUErQyxhQUEvQyxDQUFBLENBREQ7T0FBQSxNQUFBO0FBR0MsUUFBQSxLQUFLLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxLQUF6QyxDQUErQyxTQUEvQyxDQUFBLENBSEQ7T0FMQTtBQUFBLE1BVUEsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsR0FWaEIsQ0FBQTtBQUFBLE1BV0EsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsR0FYaEIsQ0FBQTtBQWFBLE1BQUEsSUFBRyxLQUFLLENBQUMsUUFBTixDQUFBLENBQUg7ZUFDQyxLQUFLLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxLQUF6QyxDQUErQyxhQUEvQyxFQUREO09BQUEsTUFBQTtlQUdDLEtBQUssQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLEtBQXpDLENBQStDLFNBQS9DLEVBSEQ7T0FmdUI7SUFBQSxDQUF4QixDQXpDQSxDQUFBO0FBQUEsSUE2REEsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUU1QixVQUFBLGdCQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksaUJBQVosQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQURSLENBQUE7QUFBQSxNQUdBLEtBQUssQ0FBQyxLQUFOLEdBQWMsU0FIZCxDQUFBO0FBQUEsTUFJQSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFuQixDQUF5QixTQUF6QixDQUpBLENBQUE7QUFBQSxNQU1BLEtBQUssQ0FBQyxLQUFNLENBQUEsa0JBQUEsQ0FBbUIsQ0FBQyxPQUFoQyxDQUF3QyxTQUF4QyxDQUFrRCxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBOUQsQ0FBb0UsQ0FBQSxDQUFwRSxDQU5BLENBQUE7QUFBQSxNQVVBLEtBQUssQ0FBQyxhQUFOLENBQUEsQ0FBc0IsQ0FBQSxpQkFBQSxDQUFrQixDQUFDLE1BQU0sQ0FBQyxLQUFoRCxDQUFzRCxPQUF0RCxDQVZBLENBQUE7QUFBQSxNQVdBLEtBQUssQ0FBQyxhQUFOLENBQUEsQ0FBc0IsQ0FBQSxtQkFBQSxDQUFvQixDQUFDLE1BQU0sQ0FBQyxLQUFsRCxDQUF3RCxXQUF4RCxDQVhBLENBQUE7YUFhQSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBekIsQ0FBK0IsU0FBL0IsRUFmNEI7SUFBQSxDQUE3QixDQTdEQSxDQUFBO0FBQUEsSUE4RUEsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTtBQUN0QixVQUFBLGdCQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksaUJBQVosQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxLQUFBLEVBQU0sU0FBTjtPQUFOLENBRFosQ0FBQTthQUVBLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQW5CLENBQXlCLFNBQXpCLEVBSHNCO0lBQUEsQ0FBdkIsQ0E5RUEsQ0FBQTtBQUFBLElBbUZBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDbEMsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLEtBQUEsRUFBTSxpQkFBTjtPQUFOLENBQVosQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLEtBQU4sR0FBYyxJQURkLENBQUE7YUFFQSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFuQixDQUF5QixFQUF6QixFQUhrQztJQUFBLENBQW5DLENBbkZBLENBQUE7QUFBQSxJQXdGQSxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQSxHQUFBO0FBQzFDLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxLQUFBLEVBQU0saUJBQU47T0FBTixDQUFaLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxLQUFOLEdBQWMsRUFEZCxDQUFBO2FBRUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBbkIsQ0FBeUIsRUFBekIsRUFIMEM7SUFBQSxDQUEzQyxDQXhGQSxDQUFBO0FBQUEsSUE2RkEsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUEsR0FBQTtBQUNyQyxVQUFBLENBQUE7QUFBQSxNQUFBLENBQUEsR0FBSSxTQUFBLEdBQUE7QUFDSCxZQUFBLEtBQUE7QUFBQSxRQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsS0FBUixDQUFBO2VBQ0EsS0FBSyxDQUFDLEtBQU4sR0FBYyxHQUZYO01BQUEsQ0FBSixDQUFBO2FBR0EsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFELENBQVIsQ0FBQSxFQUpxQztJQUFBLENBQXRDLENBN0ZBLENBQUE7QUFBQSxJQW1HQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO0FBQy9CLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxJQUFBLEVBQUssTUFBTDtPQUFOLENBQVosQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBbEIsQ0FBd0IsTUFBeEIsQ0FEQSxDQUFBO2FBRUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFmLENBQTRCLE1BQTVCLENBQW1DLENBQUMsTUFBTSxDQUFDLEtBQTNDLENBQWlELE1BQWpELEVBSCtCO0lBQUEsQ0FBaEMsQ0FuR0EsQ0FBQTtBQUFBLElBd0dBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDbEMsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBQSxDQUFBLEtBQVIsQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLElBQU4sR0FBYSxNQURiLENBQUE7QUFBQSxNQUVBLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQWxCLENBQXdCLE1BQXhCLENBRkEsQ0FBQTthQUdBLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBZixDQUE0QixNQUE1QixDQUFtQyxDQUFDLE1BQU0sQ0FBQyxLQUEzQyxDQUFpRCxNQUFqRCxFQUprQztJQUFBLENBQW5DLENBeEdBLENBQUE7QUFBQSxJQTJJQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO0FBRXhCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUFSLENBQUE7QUFBQSxNQUVBLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQXJCLENBQTJCLElBQTNCLENBRkEsQ0FBQTtBQUFBLE1BR0EsS0FBSyxDQUFDLEtBQU0sQ0FBQSxTQUFBLENBQVUsQ0FBQyxNQUFNLENBQUMsS0FBOUIsQ0FBb0MsT0FBcEMsQ0FIQSxDQUFBO0FBQUEsTUFLQSxLQUFLLENBQUMsT0FBTixHQUFnQixLQUxoQixDQUFBO0FBQUEsTUFNQSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFyQixDQUEyQixLQUEzQixDQU5BLENBQUE7YUFPQSxLQUFLLENBQUMsS0FBTSxDQUFBLFNBQUEsQ0FBVSxDQUFDLE1BQU0sQ0FBQyxLQUE5QixDQUFvQyxNQUFwQyxFQVR3QjtJQUFBLENBQXpCLENBM0lBLENBQUE7QUFBQSxJQXNKQSxFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQSxHQUFBO0FBRXJCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUFSLENBQUE7QUFBQSxNQUVBLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQWxCLENBQXdCLElBQXhCLENBRkEsQ0FBQTtBQUFBLE1BR0EsS0FBSyxDQUFDLEtBQU0sQ0FBQSxVQUFBLENBQVcsQ0FBQyxNQUFNLENBQUMsS0FBL0IsQ0FBcUMsUUFBckMsQ0FIQSxDQUFBO0FBQUEsTUFLQSxLQUFLLENBQUMsSUFBTixHQUFhLEtBTGIsQ0FBQTtBQUFBLE1BTUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBcEIsQ0FBMEIsS0FBMUIsQ0FOQSxDQUFBO2FBT0EsS0FBSyxDQUFDLEtBQU0sQ0FBQSxVQUFBLENBQVcsQ0FBQyxNQUFNLENBQUMsS0FBL0IsQ0FBcUMsU0FBckMsRUFUcUI7SUFBQSxDQUF0QixDQXRKQSxDQUFBO0FBQUEsSUFpS0EsRUFBQSxDQUFHLG1CQUFILEVBQXdCLFNBQUEsR0FBQTtBQUV2QixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsS0FBUixDQUFBO0FBQUEsTUFFQSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFwQixDQUEwQixLQUExQixDQUZBLENBQUE7QUFBQSxNQUdBLEtBQUssQ0FBQyxLQUFNLENBQUEsVUFBQSxDQUFXLENBQUMsTUFBTSxDQUFDLEtBQS9CLENBQXFDLFFBQXJDLENBSEEsQ0FBQTtBQUFBLE1BS0EsS0FBSyxDQUFDLE1BQU4sR0FBZSxJQUxmLENBQUE7QUFBQSxNQU1BLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQXBCLENBQTBCLElBQTFCLENBTkEsQ0FBQTtBQUFBLE1BT0EsS0FBSyxDQUFDLEtBQU0sQ0FBQSxVQUFBLENBQVcsQ0FBQyxNQUFNLENBQUMsS0FBL0IsQ0FBcUMsUUFBckMsQ0FQQSxDQUFBO0FBQUEsTUFTQSxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUExQixDQUFnQyxLQUFoQyxDQVRBLENBQUE7QUFBQSxNQVdBLEtBQUssQ0FBQyxNQUFOLEdBQWUsS0FYZixDQUFBO0FBQUEsTUFZQSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFwQixDQUEwQixLQUExQixDQVpBLENBQUE7YUFhQSxLQUFLLENBQUMsS0FBTSxDQUFBLFVBQUEsQ0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUEvQixDQUFxQyxRQUFyQyxFQWZ1QjtJQUFBLENBQXhCLENBaktBLENBQUE7QUFBQSxJQWtMQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQSxHQUFBO0FBRXZDLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUFSLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxLQUFOLEdBQWM7QUFBQSxRQUFDLE1BQUEsRUFBTyxLQUFSO09BRGQsQ0FBQTtBQUFBLE1BRUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBcEIsQ0FBMEIsS0FBMUIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxLQUFLLENBQUMsS0FBTixHQUFjO0FBQUEsUUFBQyxNQUFBLEVBQU8sSUFBUjtPQUhkLENBQUE7YUFJQSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFwQixDQUEwQixJQUExQixFQU51QztJQUFBLENBQXhDLENBbExBLENBQUE7QUFBQSxJQTBMQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBRWpDLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUFSLENBQUE7QUFBQSxNQUVBLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQXBCLENBQTBCLEtBQTFCLENBRkEsQ0FBQTtBQUFBLE1BR0EsS0FBSyxDQUFDLEtBQU0sQ0FBQSxVQUFBLENBQVcsQ0FBQyxNQUFNLENBQUMsS0FBL0IsQ0FBcUMsUUFBckMsQ0FIQSxDQUFBO0FBQUEsTUFJQSxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUExQixDQUFnQyxJQUFoQyxDQUpBLENBQUE7QUFBQSxNQU1BLEtBQUssQ0FBQyxNQUFOLEdBQWUsSUFOZixDQUFBO0FBQUEsTUFPQSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFwQixDQUEwQixJQUExQixDQVBBLENBQUE7QUFBQSxNQVFBLEtBQUssQ0FBQyxLQUFNLENBQUEsVUFBQSxDQUFXLENBQUMsTUFBTSxDQUFDLEtBQS9CLENBQXFDLFFBQXJDLENBUkEsQ0FBQTthQVNBLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQTFCLENBQWdDLEtBQWhDLEVBWGlDO0lBQUEsQ0FBbEMsQ0ExTEEsQ0FBQTtBQUFBLElBdU1BLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBLEdBQUE7QUFFM0MsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLGVBQUEsRUFBaUIsS0FBakI7T0FBTixDQUFaLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQTdCLENBQW1DLEtBQW5DLENBREEsQ0FBQTthQUVBLEtBQUssQ0FBQyxLQUFNLENBQUEsaUJBQUEsQ0FBa0IsQ0FBQyxNQUFNLENBQUMsS0FBdEMsQ0FBNEMsS0FBNUMsRUFKMkM7SUFBQSxDQUE1QyxDQXZNQSxDQUFBO0FBQUEsSUE2TUEsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUEsR0FBQTtBQUU3QixVQUFBLENBQUE7QUFBQSxNQUFBLENBQUEsR0FBSSxTQUFBLEdBQUE7QUFDSCxZQUFBLEtBQUE7QUFBQSxRQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsS0FBUixDQUFBO2VBQ0EsS0FBSyxDQUFDLENBQU4sR0FBVSxRQUZQO01BQUEsQ0FBSixDQUFBO2FBR0EsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFELENBQVIsQ0FBQSxFQUw2QjtJQUFBLENBQTlCLENBN01BLENBQUE7QUFBQSxJQW9OQSxFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQSxHQUFBO0FBRTdCLFVBQUEsdUJBQUE7QUFBQSxNQUFBLGdCQUFBLEdBQW1CLFNBQUMsS0FBRCxFQUFRLEtBQVIsR0FBQTtBQUVsQixRQUFBLElBQUcsS0FBSyxDQUFDLEtBQU0sQ0FBQSx3QkFBQSxDQUFaLEtBQXlDLENBQUEsRUFBQSxHQUFHLEtBQUgsQ0FBNUM7QUFDQyxVQUFBLEtBQUssQ0FBQyxLQUFNLENBQUEsd0JBQUEsQ0FBeUIsQ0FBQyxNQUFNLENBQUMsS0FBN0MsQ0FBbUQsRUFBQSxHQUFHLEtBQXRELENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBSyxDQUFDLEtBQU0sQ0FBQSx5QkFBQSxDQUEwQixDQUFDLE1BQU0sQ0FBQyxLQUE5QyxDQUFvRCxFQUFBLEdBQUcsS0FBdkQsQ0FEQSxDQUFBO0FBQUEsVUFFQSxLQUFLLENBQUMsS0FBTSxDQUFBLDJCQUFBLENBQTRCLENBQUMsTUFBTSxDQUFDLEtBQWhELENBQXNELEVBQUEsR0FBRyxLQUF6RCxDQUZBLENBQUE7aUJBR0EsS0FBSyxDQUFDLEtBQU0sQ0FBQSw0QkFBQSxDQUE2QixDQUFDLE1BQU0sQ0FBQyxLQUFqRCxDQUF1RCxFQUFBLEdBQUcsS0FBMUQsRUFKRDtTQUFBLE1BQUE7QUFNQyxVQUFBLEtBQUssQ0FBQyxLQUFNLENBQUEsd0JBQUEsQ0FBeUIsQ0FBQyxNQUFNLENBQUMsS0FBN0MsQ0FBc0QsS0FBRCxHQUFPLEdBQVAsR0FBVSxLQUEvRCxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUssQ0FBQyxLQUFNLENBQUEseUJBQUEsQ0FBMEIsQ0FBQyxNQUFNLENBQUMsS0FBOUMsQ0FBdUQsS0FBRCxHQUFPLEdBQVAsR0FBVSxLQUFoRSxDQURBLENBQUE7QUFBQSxVQUVBLEtBQUssQ0FBQyxLQUFNLENBQUEsMkJBQUEsQ0FBNEIsQ0FBQyxNQUFNLENBQUMsS0FBaEQsQ0FBeUQsS0FBRCxHQUFPLEdBQVAsR0FBVSxLQUFsRSxDQUZBLENBQUE7aUJBR0EsS0FBSyxDQUFDLEtBQU0sQ0FBQSw0QkFBQSxDQUE2QixDQUFDLE1BQU0sQ0FBQyxLQUFqRCxDQUEwRCxLQUFELEdBQU8sR0FBUCxHQUFVLEtBQW5FLEVBVEQ7U0FGa0I7TUFBQSxDQUFuQixDQUFBO0FBQUEsTUFhQSxLQUFBLEdBQVEsR0FBQSxDQUFBLEtBYlIsQ0FBQTtBQUFBLE1BZUEsS0FBSyxDQUFDLFlBQU4sR0FBcUIsRUFmckIsQ0FBQTtBQUFBLE1BZ0JBLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQTFCLENBQWdDLEVBQWhDLENBaEJBLENBQUE7QUFBQSxNQWtCQSxnQkFBQSxDQUFpQixLQUFqQixFQUF3QixNQUF4QixDQWxCQSxDQUFBO0FBQUEsTUFvQkEsS0FBSyxDQUFDLFlBQU4sR0FBcUIsS0FwQnJCLENBQUE7QUFBQSxNQXFCQSxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUExQixDQUFnQyxLQUFoQyxDQXJCQSxDQUFBO2FBdUJBLGdCQUFBLENBQWlCLEtBQWpCLEVBQXdCLEtBQXhCLEVBekI2QjtJQUFBLENBQTlCLENBcE5BLENBQUE7V0FnUEEsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUU1QixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsS0FBUixDQUFBO0FBQUEsTUFDQSxLQUFLLENBQUMsV0FBTixHQUFvQixHQURwQixDQUFBO2FBR0EsS0FBSyxDQUFDLEtBQU0sQ0FBQSxxQkFBQSxDQUFzQixDQUFDLE1BQU0sQ0FBQyxLQUExQyxDQUFnRCxLQUFoRCxFQUw0QjtJQUFBLENBQTdCLEVBbFBzQjtFQUFBLENBQXZCLENBNUNBLENBQUE7QUFBQSxFQXVTQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO0FBRTdCLElBQUEsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUEsR0FBQTtBQUVwQyxVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsS0FBUixDQUFBO2FBQ0EsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQWhDLENBQXNDLEVBQXRDLEVBSG9DO0lBQUEsQ0FBckMsQ0FBQSxDQUFBO1dBS0EsRUFBQSxDQUFHLGdEQUFILEVBQXFELFNBQUEsR0FBQTtBQUVwRCxVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsS0FBUixDQUFBO0FBQUEsTUFFQSxLQUFLLENBQUMsSUFBTixHQUFhLEVBRmIsQ0FBQTtBQUFBLE1BR0EsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBbEIsQ0FBd0IsRUFBeEIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBaEMsQ0FBc0MsWUFBdEMsQ0FKQSxDQUFBO0FBQUEsTUFNQSxLQUFLLENBQUMsUUFBTixHQUFpQixFQU5qQixDQUFBO0FBQUEsTUFPQSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUF0QixDQUE0QixFQUE1QixDQVBBLENBQUE7YUFRQSxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBaEMsQ0FBc0MsMEJBQXRDLEVBVm9EO0lBQUEsQ0FBckQsRUFQNkI7RUFBQSxDQUE5QixDQXZTQSxDQUFBO0FBQUEsRUEwVEEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTtBQUU3QixJQUFBLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBLEdBQUE7QUFFcEMsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBQSxDQUFBLEtBQVIsQ0FBQTthQUNBLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUE3QixDQUFtQyxFQUFuQyxFQUhvQztJQUFBLENBQXJDLENBQUEsQ0FBQTtXQUtBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7QUFFM0IsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBQSxDQUFBLEtBQVIsQ0FBQTtBQUFBLE1BRUEsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsRUFGaEIsQ0FBQTtBQUFBLE1BR0EsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsRUFIaEIsQ0FBQTtBQUFBLE1BSUEsS0FBSyxDQUFDLFVBQU4sR0FBbUIsRUFKbkIsQ0FBQTtBQUFBLE1BS0EsS0FBSyxDQUFDLFlBQU4sR0FBcUIsRUFMckIsQ0FBQTtBQUFBLE1BT0EsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBckIsQ0FBMkIsRUFBM0IsQ0FQQSxDQUFBO0FBQUEsTUFRQSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFyQixDQUEyQixFQUEzQixDQVJBLENBQUE7QUFBQSxNQVNBLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQXhCLENBQThCLEVBQTlCLENBVEEsQ0FBQTtBQUFBLE1BVUEsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBMUIsQ0FBZ0MsRUFBaEMsQ0FWQSxDQUFBO0FBQUEsTUFZQSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBN0IsQ0FBbUMsRUFBbkMsQ0FaQSxDQUFBO0FBQUEsTUFlQSxLQUFLLENBQUMsV0FBTixHQUFvQixLQWZwQixDQUFBO0FBQUEsTUFnQkEsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBekIsQ0FBK0IsS0FBL0IsQ0FoQkEsQ0FBQTtBQUFBLE1Ba0JBLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUE3QixDQUFtQyx5QkFBbkMsQ0FsQkEsQ0FBQTtBQUFBLE1BcUJBLEtBQUssQ0FBQyxXQUFOLEdBQW9CLElBckJwQixDQUFBO2FBc0JBLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUE3QixDQUFtQyxFQUFuQyxFQXhCMkI7SUFBQSxDQUE1QixFQVA2QjtFQUFBLENBQTlCLENBMVRBLENBQUE7QUFBQSxFQTJWQSxRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBLEdBQUE7QUFFbEIsSUFBQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO0FBRS9CLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFBLENBQVosQ0FBQTtBQUFBLE1BRUEsS0FBSyxDQUFDLFlBQU4sR0FBcUIsS0FGckIsQ0FBQTtBQUFBLE1BR0EsS0FBSyxDQUFDLEtBQU0sQ0FBQSxlQUFBLENBQWdCLENBQUMsTUFBTSxDQUFDLEtBQXBDLENBQTBDLE1BQTFDLENBSEEsQ0FBQTtBQUFBLE1BS0EsS0FBSyxDQUFDLFlBQU4sR0FBcUIsSUFMckIsQ0FBQTthQU1BLEtBQUssQ0FBQyxLQUFNLENBQUEsZUFBQSxDQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFwQyxDQUEwQyxNQUExQyxFQVIrQjtJQUFBLENBQWhDLENBQUEsQ0FBQTtBQUFBLElBVUEsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUEsR0FBQTtBQUU1QyxVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBQSxDQUFaLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQTFCLENBQWdDLElBQWhDLENBREEsQ0FBQTthQUVBLEtBQUssQ0FBQyxLQUFNLENBQUEsZUFBQSxDQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFwQyxDQUEwQyxNQUExQyxFQUo0QztJQUFBLENBQTdDLENBVkEsQ0FBQTtBQUFBLElBZ0JBLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBLEdBQUE7QUFFdEMsVUFBQSxxQkFBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFBLENBQVosQ0FBQTtBQUFBLE1BRUEsS0FBQSxHQUFRLENBRlIsQ0FBQTtBQUFBLE1BR0EsT0FBQSxHQUFVLFNBQUEsR0FBQTtlQUFHLEtBQUEsR0FBSDtNQUFBLENBSFYsQ0FBQTtBQUFBLE1BS0EsS0FBSyxDQUFDLEVBQU4sQ0FBUyxPQUFULEVBQWtCLEtBQWxCLEVBQXlCLE9BQXpCLENBTEEsQ0FBQTtBQUFBLE1BT0EsS0FBSyxDQUFDLElBQU4sQ0FBVyxPQUFYLENBUEEsQ0FBQTtBQUFBLE1BUUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFYLENBUkEsQ0FBQTthQVVBLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBYixDQUFtQixDQUFuQixFQVpzQztJQUFBLENBQXZDLENBaEJBLENBQUE7QUFBQSxJQThCQSxFQUFBLENBQUcsdURBQUgsRUFBNEQsU0FBQSxHQUFBO0FBRTNELFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFBLENBQVosQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBMUIsQ0FBZ0MsSUFBaEMsQ0FEQSxDQUFBO0FBQUEsTUFHQSxLQUFLLENBQUMsRUFBTixDQUFTLE1BQU0sQ0FBQyxLQUFoQixFQUF1QixTQUFBLEdBQUE7ZUFDdEIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFaLEVBRHNCO01BQUEsQ0FBdkIsQ0FIQSxDQUFBO2FBTUEsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBMUIsQ0FBZ0MsS0FBaEMsRUFSMkQ7SUFBQSxDQUE1RCxDQTlCQSxDQUFBO0FBQUEsSUF3Q0EsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUMsUUFBRCxHQUFBO0FBRW5DLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFjLElBQUEsS0FBQSxDQUFBLENBQWQsQ0FBQTtBQUFBLE1BRUEsT0FBTyxDQUFDLEVBQVIsQ0FBVyxPQUFYLEVBQW9CLFNBQUMsS0FBRCxFQUFRLEtBQVIsR0FBQTtBQUNuQixRQUFBLElBQUMsQ0FBQSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQVgsQ0FBaUIsT0FBTyxDQUFDLEVBQXpCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBaEIsQ0FBc0IsT0FBTyxDQUFDLEVBQTlCLENBREEsQ0FBQTtlQUVBLFFBQUEsQ0FBQSxFQUhtQjtNQUFBLENBQXBCLENBRkEsQ0FBQTthQU9BLFFBQVEsQ0FBQyxLQUFULENBQWUsT0FBTyxDQUFDLFFBQXZCLEVBVG1DO0lBQUEsQ0FBcEMsQ0F4Q0EsQ0FBQTtBQUFBLElBbURBLEVBQUEsQ0FBRyxzQkFBSCxFQUEyQixTQUFBLEdBQUE7QUFFMUIsVUFBQSwwQkFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUFSLENBQUE7QUFBQSxNQUVBLFVBQUEsR0FBYSxDQUZiLENBQUE7QUFBQSxNQUlBLE9BQUEsR0FBVSxTQUFBLEdBQUE7ZUFDVCxVQUFBLEdBRFM7TUFBQSxDQUpWLENBQUE7QUFBQSxNQU9BLEtBQUssQ0FBQyxFQUFOLENBQVMsTUFBVCxFQUFpQixPQUFqQixDQVBBLENBQUE7QUFBQSxNQVNBLEtBQUssQ0FBQyxJQUFOLENBQVcsTUFBWCxDQVRBLENBQUE7QUFBQSxNQVVBLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBbEIsQ0FBd0IsQ0FBeEIsQ0FWQSxDQUFBO0FBQUEsTUFZQSxLQUFLLENBQUMsR0FBTixDQUFVLE1BQVYsRUFBa0IsT0FBbEIsQ0FaQSxDQUFBO0FBQUEsTUFjQSxLQUFLLENBQUMsSUFBTixDQUFXLE1BQVgsQ0FkQSxDQUFBO2FBZUEsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFsQixDQUF3QixDQUF4QixFQWpCMEI7SUFBQSxDQUEzQixDQW5EQSxDQUFBO1dBdUVBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFFbkMsVUFBQSxtQkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEdBQUEsQ0FBQSxLQUFULENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBUSxDQURSLENBQUE7QUFBQSxNQUdBLE1BQU0sQ0FBQyxJQUFQLENBQVksT0FBWixFQUFxQixTQUFDLEtBQUQsR0FBQTtBQUNwQixRQUFBLEtBQUEsRUFBQSxDQUFBO2VBQ0EsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFkLENBQW9CLEtBQXBCLEVBRm9CO01BQUEsQ0FBckIsQ0FIQSxDQUFBO0FBT0EsV0FBUywyQkFBVCxHQUFBO0FBQ0MsUUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLE9BQVosQ0FBQSxDQUREO0FBQUEsT0FQQTthQVVBLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBYixDQUFtQixDQUFuQixFQVptQztJQUFBLENBQXBDLEVBekVrQjtFQUFBLENBQW5CLENBM1ZBLENBQUE7QUFBQSxFQW1iQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7QUFFckIsSUFBQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQSxHQUFBO0FBRTFCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUFSLENBQUE7QUFBQSxNQUVBLE1BQU0sQ0FBQyxLQUFQLENBQWEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBdkMsRUFBMkMsMkJBQTNDLENBRkEsQ0FBQTthQUdBLE1BQU0sQ0FBQyxLQUFQLENBQWEsS0FBSyxDQUFDLFVBQW5CLEVBQStCLElBQS9CLEVBTDBCO0lBQUEsQ0FBM0IsQ0FBQSxDQUFBO0FBQUEsSUFPQSxFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQSxHQUFBO0FBRTdCLFVBQUEsQ0FBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLFNBQUEsR0FBQTtBQUFHLFlBQUEsS0FBQTtlQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFVBQUEsVUFBQSxFQUFXLENBQVg7U0FBTixFQUFmO01BQUEsQ0FBSixDQUFBO2FBQ0EsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFELENBQVIsQ0FBQSxFQUg2QjtJQUFBLENBQTlCLENBUEEsQ0FBQTtBQUFBLElBWUEsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUV6QixVQUFBLGNBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxHQUFBLENBQUEsS0FBVCxDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLFVBQUEsRUFBVyxNQUFYO09BQU4sQ0FEYixDQUFBO0FBQUEsTUFHQSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBN0IsRUFBeUMsTUFBTSxDQUFDLFFBQWhELENBSEEsQ0FBQTthQUlBLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBTSxDQUFDLFVBQXBCLEVBQWdDLE1BQWhDLEVBTnlCO0lBQUEsQ0FBMUIsQ0FaQSxDQUFBO0FBQUEsSUFvQkEsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUU1QixVQUFBLGNBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxHQUFBLENBQUEsS0FBVCxDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLFVBQUEsRUFBVyxNQUFYO09BQU4sQ0FEYixDQUFBO0FBQUEsTUFHQSxNQUFNLENBQUMsVUFBUCxHQUFvQixJQUhwQixDQUFBO0FBQUEsTUFLQSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQXhDLEVBQTRDLDJCQUE1QyxDQUxBLENBQUE7YUFNQSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQU0sQ0FBQyxVQUFwQixFQUFnQyxJQUFoQyxFQVI0QjtJQUFBLENBQTdCLENBcEJBLENBQUE7QUFBQSxJQThCQSxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQSxHQUFBO0FBRTNCLFVBQUEsc0JBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxHQUFBLENBQUEsS0FBVCxDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLFVBQUEsRUFBVyxNQUFYO09BQU4sQ0FEYixDQUFBO0FBQUEsTUFFQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLFVBQUEsRUFBVyxNQUFYO09BQU4sQ0FGYixDQUFBO0FBQUEsTUFJQSxNQUFNLENBQUMsU0FBUCxDQUFpQixNQUFNLENBQUMsU0FBeEIsRUFBbUMsQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUFuQyxDQUpBLENBQUE7QUFBQSxNQU1BLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLElBTnBCLENBQUE7QUFBQSxNQU9BLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUE5QixFQUFzQyxDQUF0QyxDQVBBLENBQUE7QUFBQSxNQVFBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLE1BQU0sQ0FBQyxTQUF4QixFQUFtQyxDQUFDLE1BQUQsQ0FBbkMsQ0FSQSxDQUFBO0FBQUEsTUFVQSxNQUFNLENBQUMsVUFBUCxHQUFvQixJQVZwQixDQUFBO2FBV0EsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsTUFBTSxDQUFDLFNBQXhCLEVBQW1DLEVBQW5DLEVBYjJCO0lBQUEsQ0FBNUIsQ0E5QkEsQ0FBQTtBQUFBLElBNkNBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFFckMsVUFBQSxzQkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEdBQUEsQ0FBQSxLQUFULENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxHQUFBLENBQUEsS0FEVCxDQUFBO0FBQUEsTUFFQSxNQUFBLEdBQVMsR0FBQSxDQUFBLEtBRlQsQ0FBQTtBQUFBLE1BSUEsTUFBQSxDQUFPLGFBQVUsTUFBTSxDQUFDLGFBQWpCLEVBQUEsTUFBQSxNQUFQLEVBQXVDLElBQXZDLENBSkEsQ0FBQTthQUtBLE1BQUEsQ0FBTyxhQUFVLE1BQU0sQ0FBQyxhQUFqQixFQUFBLE1BQUEsTUFBUCxFQUF1QyxJQUF2QyxFQVBxQztJQUFBLENBQXRDLENBN0NBLENBQUE7QUFBQSxJQXNEQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO0FBRWhDLFVBQUEsc0JBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxHQUFBLENBQUEsS0FBVCxDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLFVBQUEsRUFBVyxNQUFYO09BQU4sQ0FEYixDQUFBO0FBQUEsTUFFQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLFVBQUEsRUFBVyxNQUFYO09BQU4sQ0FGYixDQUFBO0FBQUEsTUFJQSxNQUFNLENBQUMsU0FBUCxDQUFpQixNQUFNLENBQUMsYUFBeEIsRUFBdUMsQ0FBQyxNQUFELENBQXZDLENBSkEsQ0FBQTthQUtBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLE1BQU0sQ0FBQyxhQUF4QixFQUF1QyxDQUFDLE1BQUQsQ0FBdkMsRUFQZ0M7SUFBQSxDQUFqQyxDQXREQSxDQUFBO1dBK0RBLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBLEdBQUE7QUFFOUIsVUFBQSxzQkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEdBQUEsQ0FBQSxLQUFULENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsVUFBQSxFQUFXLE1BQVg7T0FBTixDQURiLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsVUFBQSxFQUFXLE1BQVg7T0FBTixDQUZiLENBQUE7YUFJQSxNQUFNLENBQUMsU0FBUCxDQUFpQixNQUFNLENBQUMsV0FBUCxDQUFBLENBQWpCLEVBQXVDLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FBdkMsRUFOOEI7SUFBQSxDQUEvQixFQWpFcUI7RUFBQSxDQUF0QixDQW5iQSxDQUFBO0FBQUEsRUErZkEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBRXBCLElBQUEsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUU1QixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsS0FBQSxFQUFNLEdBQU47T0FBTixDQUFaLENBQUE7YUFDQSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFuQixDQUF5QixHQUF6QixFQUg0QjtJQUFBLENBQTdCLENBQUEsQ0FBQTtBQUFBLElBS0EsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUV6QixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsS0FBUixDQUFBO0FBQUEsTUFDQSxLQUFLLENBQUMsS0FBTixHQUFjLEdBRGQsQ0FBQTthQUVBLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQW5CLENBQXlCLEdBQXpCLEVBSnlCO0lBQUEsQ0FBMUIsQ0FMQSxDQUFBO0FBQUEsSUFXQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBRWpDLFVBQUEsY0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEdBQUEsQ0FBQSxLQUFULENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxHQUFBLENBQUEsS0FEVCxDQUFBO2FBR0EsTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFNLENBQUMsS0FBcEIsRUFBMkIsTUFBTSxDQUFDLEtBQVAsR0FBZSxDQUExQyxFQUxpQztJQUFBLENBQWxDLENBWEEsQ0FBQTtBQUFBLElBa0JBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFFeEIsVUFBQSxzQkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEdBQUEsQ0FBQSxLQUFULENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsVUFBQSxFQUFXLE1BQVg7T0FBTixDQURiLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsVUFBQSxFQUFXLE1BQVg7T0FBTixDQUZiLENBQUE7QUFBQSxNQUlBLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBTSxDQUFDLEtBQXBCLEVBQTJCLENBQTNCLENBSkEsQ0FBQTthQUtBLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBTSxDQUFDLEtBQXBCLEVBQTJCLENBQTNCLEVBUHdCO0lBQUEsQ0FBekIsQ0FsQkEsQ0FBQTtBQUFBLElBMkJBLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBLEdBQUE7QUFFaEMsVUFBQSxzQkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEdBQUEsQ0FBQSxLQUFULENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsVUFBQSxFQUFXLE1BQVg7T0FBTixDQURiLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsVUFBQSxFQUFXLE1BQVg7T0FBTixDQUZiLENBQUE7QUFBQSxNQUlBLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FKQSxDQUFBO0FBQUEsTUFNQSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQU0sQ0FBQyxLQUFwQixFQUE0QixDQUE1QixDQU5BLENBQUE7QUFBQSxNQU9BLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBTSxDQUFDLEtBQXBCLEVBQTJCLENBQUEsQ0FBM0IsQ0FQQSxDQUFBO0FBQUEsTUFTQSxNQUFNLENBQUMsWUFBUCxDQUFBLENBVEEsQ0FBQTtBQUFBLE1BV0EsTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFNLENBQUMsS0FBcEIsRUFBNEIsQ0FBNUIsQ0FYQSxDQUFBO2FBWUEsTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFNLENBQUMsS0FBcEIsRUFBNEIsQ0FBNUIsRUFkZ0M7SUFBQSxDQUFqQyxDQTNCQSxDQUFBO0FBQUEsSUEyQ0EsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUEsR0FBQTtBQUUzQixVQUFBLDhCQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsR0FBQSxDQUFBLEtBQVQsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxVQUFBLEVBQVcsTUFBWDtPQUFOLENBRGIsQ0FBQTtBQUFBLE1BRUEsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxVQUFBLEVBQVcsTUFBWDtPQUFOLENBRmIsQ0FBQTtBQUFBLE1BR0EsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxVQUFBLEVBQVcsTUFBWDtPQUFOLENBSGIsQ0FBQTtBQUFBLE1BS0EsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsTUFBbkIsQ0FMQSxDQUFBO0FBQUEsTUFPQSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQU0sQ0FBQyxLQUFwQixFQUEyQixDQUEzQixDQVBBLENBQUE7QUFBQSxNQVFBLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBTSxDQUFDLEtBQXBCLEVBQTJCLENBQTNCLENBUkEsQ0FBQTthQVNBLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBTSxDQUFDLEtBQXBCLEVBQTJCLENBQTNCLEVBWDJCO0lBQUEsQ0FBNUIsQ0EzQ0EsQ0FBQTtBQUFBLElBd0RBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7QUFFekIsVUFBQSw4QkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEdBQUEsQ0FBQSxLQUFULENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsVUFBQSxFQUFXLE1BQVg7T0FBTixDQURiLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsVUFBQSxFQUFXLE1BQVg7T0FBTixDQUZiLENBQUE7QUFBQSxNQUdBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsVUFBQSxFQUFXLE1BQVg7T0FBTixDQUhiLENBQUE7QUFBQSxNQUtBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLE1BQW5CLENBTEEsQ0FBQTtBQUFBLE1BU0EsTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFNLENBQUMsS0FBcEIsRUFBMkIsQ0FBM0IsQ0FUQSxDQUFBO0FBQUEsTUFVQSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQU0sQ0FBQyxLQUFwQixFQUEyQixDQUEzQixDQVZBLENBQUE7YUFXQSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQU0sQ0FBQyxLQUFwQixFQUEyQixDQUEzQixFQWJ5QjtJQUFBLENBQTFCLENBeERBLENBQUE7QUFBQSxJQXVFQSxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQSxHQUFBO0FBRXBDLFVBQUEsOEJBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxHQUFBLENBQUEsS0FBVCxDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLElBQUEsRUFBSyxHQUFMO0FBQUEsUUFBVSxVQUFBLEVBQVcsTUFBckI7T0FBTixDQURiLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsSUFBQSxFQUFLLEdBQUw7QUFBQSxRQUFVLFVBQUEsRUFBVyxNQUFyQjtPQUFOLENBRmIsQ0FBQTtBQUFBLE1BR0EsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxJQUFBLEVBQUssR0FBTDtBQUFBLFFBQVUsVUFBQSxFQUFXLE1BQXJCO09BQU4sQ0FIYixDQUFBO0FBQUEsTUFLQSxNQUFNLENBQUMsZUFBUCxDQUF1QixHQUF2QixDQUEyQixDQUFDLE1BQU0sQ0FBQyxHQUFuQyxDQUF1QyxDQUFDLE1BQUQsQ0FBdkMsQ0FMQSxDQUFBO2FBTUEsTUFBTSxDQUFDLGVBQVAsQ0FBdUIsR0FBdkIsQ0FBMkIsQ0FBQyxNQUFNLENBQUMsR0FBbkMsQ0FBdUMsQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUF2QyxFQVJvQztJQUFBLENBQXJDLENBdkVBLENBQUE7V0FpRkEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUM5QixVQUFBLHNCQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsR0FBQSxDQUFBLEtBQVQsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxVQUFBLEVBQVcsTUFBWDtPQUFOLENBRGIsQ0FBQTtBQUFBLE1BRUEsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxVQUFBLEVBQVcsTUFBWDtPQUFOLENBRmIsQ0FBQTthQUdBLE1BQU0sQ0FBQyxXQUFQLENBQUEsQ0FBb0IsQ0FBQyxNQUFNLENBQUMsR0FBNUIsQ0FBZ0MsQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUFoQyxFQUo4QjtJQUFBLENBQS9CLEVBbkZvQjtFQUFBLENBQXJCLENBL2ZBLENBQUE7QUFBQSxFQXdsQkEsUUFBQSxDQUFTLE9BQVQsRUFBa0IsU0FBQSxHQUFBO0FBRWpCLElBQUEsRUFBQSxDQUFHLHNCQUFILEVBQTJCLFNBQUEsR0FBQTtBQUUxQixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsS0FBQSxFQUFNO0FBQUEsVUFBQyxDQUFBLEVBQUUsR0FBSDtBQUFBLFVBQVEsQ0FBQSxFQUFFLEdBQVY7QUFBQSxVQUFlLEtBQUEsRUFBTSxHQUFyQjtBQUFBLFVBQTBCLE1BQUEsRUFBTyxHQUFqQztTQUFOO09BQU4sQ0FBWixDQUFBO0FBQUEsTUFFQSxNQUFNLENBQUMsS0FBUCxDQUFhLEtBQUssQ0FBQyxDQUFuQixFQUFzQixHQUF0QixDQUZBLENBQUE7QUFBQSxNQUdBLE1BQU0sQ0FBQyxLQUFQLENBQWEsS0FBSyxDQUFDLENBQW5CLEVBQXNCLEdBQXRCLENBSEEsQ0FBQTtBQUFBLE1BSUEsTUFBTSxDQUFDLEtBQVAsQ0FBYSxLQUFLLENBQUMsS0FBbkIsRUFBMEIsR0FBMUIsQ0FKQSxDQUFBO2FBS0EsTUFBTSxDQUFDLEtBQVAsQ0FBYSxLQUFLLENBQUMsTUFBbkIsRUFBMkIsR0FBM0IsRUFQMEI7SUFBQSxDQUEzQixDQUFBLENBQUE7QUFBQSxJQVNBLEVBQUEsQ0FBRyx5QkFBSCxFQUE4QixTQUFBLEdBQUE7QUFFN0IsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBQSxDQUFBLEtBQVIsQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLEtBQU4sR0FBYztBQUFBLFFBQUMsQ0FBQSxFQUFFLEdBQUg7QUFBQSxRQUFRLENBQUEsRUFBRSxHQUFWO0FBQUEsUUFBZSxLQUFBLEVBQU0sR0FBckI7QUFBQSxRQUEwQixNQUFBLEVBQU8sR0FBakM7T0FEZCxDQUFBO0FBQUEsTUFHQSxNQUFNLENBQUMsS0FBUCxDQUFhLEtBQUssQ0FBQyxDQUFuQixFQUFzQixHQUF0QixDQUhBLENBQUE7QUFBQSxNQUlBLE1BQU0sQ0FBQyxLQUFQLENBQWEsS0FBSyxDQUFDLENBQW5CLEVBQXNCLEdBQXRCLENBSkEsQ0FBQTtBQUFBLE1BS0EsTUFBTSxDQUFDLEtBQVAsQ0FBYSxLQUFLLENBQUMsS0FBbkIsRUFBMEIsR0FBMUIsQ0FMQSxDQUFBO2FBTUEsTUFBTSxDQUFDLEtBQVAsQ0FBYSxLQUFLLENBQUMsTUFBbkIsRUFBMkIsR0FBM0IsRUFSNkI7SUFBQSxDQUE5QixDQVRBLENBQUE7QUFBQSxJQW1CQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2pDLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxJQUFBLEVBQUssR0FBTDtBQUFBLFFBQVUsQ0FBQSxFQUFFLEdBQVo7QUFBQSxRQUFpQixLQUFBLEVBQU0sR0FBdkI7QUFBQSxRQUE0QixNQUFBLEVBQU8sR0FBbkM7T0FBTixDQUFaLENBQUE7YUFDQSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLEdBQXJCLEVBRmlDO0lBQUEsQ0FBbEMsQ0FuQkEsQ0FBQTtBQUFBLElBdUJBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7QUFDakMsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLElBQUEsRUFBSyxHQUFMO0FBQUEsUUFBVSxDQUFBLEVBQUUsR0FBWjtBQUFBLFFBQWlCLEtBQUEsRUFBTSxHQUF2QjtBQUFBLFFBQTRCLE1BQUEsRUFBTyxHQUFuQztPQUFOLENBQVosQ0FBQTthQUNBLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQWYsQ0FBcUIsR0FBckIsRUFGaUM7SUFBQSxDQUFsQyxDQXZCQSxDQUFBO0FBQUEsSUEyQkEsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTtBQUNqQyxVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsSUFBQSxFQUFLLEdBQUw7QUFBQSxRQUFVLENBQUEsRUFBRSxHQUFaO0FBQUEsUUFBaUIsS0FBQSxFQUFNLEdBQXZCO0FBQUEsUUFBNEIsTUFBQSxFQUFPLEdBQW5DO09BQU4sQ0FBWixDQUFBO2FBQ0EsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixFQUZpQztJQUFBLENBQWxDLENBM0JBLENBQUE7QUFBQSxJQStCQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2pDLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxDQUFBLEVBQUUsR0FBRjtBQUFBLFFBQU8sSUFBQSxFQUFLLEdBQVo7QUFBQSxRQUFpQixLQUFBLEVBQU0sR0FBdkI7QUFBQSxRQUE0QixNQUFBLEVBQU8sR0FBbkM7T0FBTixDQUFaLENBQUE7YUFDQSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLEdBQXJCLEVBRmlDO0lBQUEsQ0FBbEMsQ0EvQkEsQ0FBQTtBQUFBLElBbUNBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7QUFDakMsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLENBQUEsRUFBRSxHQUFGO0FBQUEsUUFBTyxJQUFBLEVBQUssR0FBWjtBQUFBLFFBQWlCLEtBQUEsRUFBTSxHQUF2QjtBQUFBLFFBQTRCLE1BQUEsRUFBTyxHQUFuQztPQUFOLENBQVosQ0FBQTthQUNBLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQWYsQ0FBcUIsR0FBckIsRUFGaUM7SUFBQSxDQUFsQyxDQW5DQSxDQUFBO0FBQUEsSUF1Q0EsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTtBQUNqQyxVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsQ0FBQSxFQUFFLEdBQUY7QUFBQSxRQUFPLElBQUEsRUFBSyxHQUFaO0FBQUEsUUFBaUIsS0FBQSxFQUFNLEdBQXZCO0FBQUEsUUFBNEIsTUFBQSxFQUFPLEdBQW5DO09BQU4sQ0FBWixDQUFBO2FBQ0EsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixFQUZpQztJQUFBLENBQWxDLENBdkNBLENBQUE7QUFBQSxJQTRDQSxFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxDQUFBLEVBQUUsR0FBRjtBQUFBLFFBQU8sS0FBQSxFQUFNLEdBQWI7QUFBQSxRQUFrQixNQUFBLEVBQU8sR0FBekI7T0FBTixDQUFaLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxJQUFOLEdBQWEsR0FEYixDQUFBO2FBRUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixFQUhxQjtJQUFBLENBQXRCLENBNUNBLENBQUE7QUFBQSxJQWlEQSxFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxDQUFBLEVBQUUsR0FBRjtBQUFBLFFBQU8sS0FBQSxFQUFNLEdBQWI7QUFBQSxRQUFrQixNQUFBLEVBQU8sR0FBekI7T0FBTixDQUFaLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxJQUFOLEdBQWEsR0FEYixDQUFBO2FBRUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixFQUhxQjtJQUFBLENBQXRCLENBakRBLENBQUE7QUFBQSxJQXNEQSxFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxDQUFBLEVBQUUsR0FBRjtBQUFBLFFBQU8sS0FBQSxFQUFNLEdBQWI7QUFBQSxRQUFrQixNQUFBLEVBQU8sR0FBekI7T0FBTixDQUFaLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxJQUFOLEdBQWEsR0FEYixDQUFBO2FBRUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixFQUhxQjtJQUFBLENBQXRCLENBdERBLENBQUE7QUFBQSxJQTJEQSxFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxDQUFBLEVBQUUsR0FBRjtBQUFBLFFBQU8sS0FBQSxFQUFNLEdBQWI7QUFBQSxRQUFrQixNQUFBLEVBQU8sR0FBekI7T0FBTixDQUFaLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxJQUFOLEdBQWEsR0FEYixDQUFBO2FBRUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixFQUhxQjtJQUFBLENBQXRCLENBM0RBLENBQUE7QUFBQSxJQWdFQSxFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxDQUFBLEVBQUUsR0FBRjtBQUFBLFFBQU8sS0FBQSxFQUFNLEdBQWI7QUFBQSxRQUFrQixNQUFBLEVBQU8sR0FBekI7T0FBTixDQUFaLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxJQUFOLEdBQWEsR0FEYixDQUFBO2FBRUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixFQUhxQjtJQUFBLENBQXRCLENBaEVBLENBQUE7QUFBQSxJQXFFQSxFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxDQUFBLEVBQUUsR0FBRjtBQUFBLFFBQU8sS0FBQSxFQUFNLEdBQWI7QUFBQSxRQUFrQixNQUFBLEVBQU8sR0FBekI7T0FBTixDQUFaLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxJQUFOLEdBQWEsR0FEYixDQUFBO2FBRUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixHQUFyQixFQUhxQjtJQUFBLENBQXRCLENBckVBLENBQUE7QUFBQSxJQTBFQSxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQSxHQUFBO0FBQ3BDLFVBQUEsY0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxDQUFBLEVBQUUsR0FBRjtBQUFBLFFBQU8sQ0FBQSxFQUFFLEdBQVQ7QUFBQSxRQUFjLEtBQUEsRUFBTSxHQUFwQjtBQUFBLFFBQXlCLE1BQUEsRUFBTyxHQUFoQztPQUFOLENBQWIsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxDQUFBLEVBQUUsR0FBRjtBQUFBLFFBQU8sQ0FBQSxFQUFFLEdBQVQ7QUFBQSxRQUFjLEtBQUEsRUFBTSxHQUFwQjtBQUFBLFFBQXlCLE1BQUEsRUFBTyxHQUFoQztBQUFBLFFBQXFDLFVBQUEsRUFBVyxNQUFoRDtPQUFOLENBRGIsQ0FBQTtBQUFBLE1BR0EsTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQWhDLEVBQW1DLEdBQW5DLENBSEEsQ0FBQTtBQUFBLE1BSUEsTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQWhDLEVBQW1DLEdBQW5DLENBSkEsQ0FBQTtBQUFBLE1BTUEsTUFBTSxDQUFDLFdBQVAsR0FBcUI7QUFBQSxRQUFDLENBQUEsRUFBRSxJQUFIO0FBQUEsUUFBUyxDQUFBLEVBQUUsSUFBWDtPQU5yQixDQUFBO0FBQUEsTUFRQSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBaEMsRUFBbUMsSUFBbkMsQ0FSQSxDQUFBO0FBQUEsTUFTQSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBaEMsRUFBbUMsSUFBbkMsQ0FUQSxDQUFBO0FBQUEsTUFXQSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQU0sQ0FBQyxDQUFwQixFQUF1QixHQUF2QixDQVhBLENBQUE7QUFBQSxNQVlBLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBTSxDQUFDLENBQXBCLEVBQXVCLEdBQXZCLENBWkEsQ0FBQTtBQUFBLE1BY0EsTUFBTSxDQUFDLFVBQVAsR0FBb0IsSUFkcEIsQ0FBQTtBQUFBLE1BZUEsTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQWhDLEVBQW1DLEdBQW5DLENBZkEsQ0FBQTthQWdCQSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBaEMsRUFBbUMsR0FBbkMsRUFqQm9DO0lBQUEsQ0FBckMsQ0ExRUEsQ0FBQTtBQUFBLElBNkZBLEVBQUEsQ0FBRyx3QkFBSCxFQUE2QixTQUFBLEdBQUE7QUFDNUIsVUFBQSxjQUFBO0FBQUEsTUFBQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLEtBQUEsRUFBTSxHQUFOO09BQU4sQ0FBYixDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLEtBQUEsRUFBTSxHQUFOO0FBQUEsUUFBVyxVQUFBLEVBQVcsTUFBdEI7T0FBTixDQURiLENBQUE7QUFBQSxNQUVBLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBcUIsQ0FBQyxNQUFNLENBQUMsS0FBN0IsQ0FBbUMsR0FBQSxHQUFNLEdBQXpDLENBRkEsQ0FBQTthQUdBLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBcUIsQ0FBQyxNQUFNLENBQUMsS0FBN0IsQ0FBbUMsR0FBQSxHQUFNLEdBQXpDLEVBSjRCO0lBQUEsQ0FBN0IsQ0E3RkEsQ0FBQTtBQUFBLElBbUdBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFDbkMsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLENBQUEsRUFBRSxHQUFGO0FBQUEsUUFBTyxLQUFBLEVBQU0sR0FBYjtBQUFBLFFBQWtCLE1BQUEsRUFBTyxHQUF6QjtBQUFBLFFBQThCLEtBQUEsRUFBTSxHQUFwQztPQUFOLENBQWIsQ0FBQTthQUNBLE1BQU0sQ0FBQyxXQUFQLENBQUEsQ0FBb0IsQ0FBQyxNQUFNLENBQUMsR0FBNUIsQ0FBZ0M7QUFBQSxRQUFDLEdBQUEsRUFBSSxHQUFMO0FBQUEsUUFBUyxHQUFBLEVBQUksR0FBYjtBQUFBLFFBQWlCLE9BQUEsRUFBUSxHQUF6QjtBQUFBLFFBQTZCLFFBQUEsRUFBUyxHQUF0QztPQUFoQyxFQUZtQztJQUFBLENBQXBDLENBbkdBLENBQUE7V0F1R0EsRUFBQSxDQUFHLHNDQUFILEVBQTJDLFNBQUEsR0FBQTtBQUUxQyxVQUFBLHNCQUFBO0FBQUEsTUFBQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLENBQUEsRUFBRSxHQUFGO0FBQUEsUUFBTyxLQUFBLEVBQU0sR0FBYjtBQUFBLFFBQWtCLE1BQUEsRUFBTyxHQUF6QjtBQUFBLFFBQThCLEtBQUEsRUFBTSxHQUFwQztPQUFOLENBQWIsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxDQUFBLEVBQUUsRUFBRjtBQUFBLFFBQU0sS0FBQSxFQUFNLEdBQVo7QUFBQSxRQUFpQixNQUFBLEVBQU8sR0FBeEI7QUFBQSxRQUE2QixLQUFBLEVBQU0sR0FBbkM7QUFBQSxRQUF3QyxVQUFBLEVBQVcsTUFBbkQ7T0FBTixDQURiLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsQ0FBQSxFQUFFLENBQUEsRUFBRjtBQUFBLFFBQU8sS0FBQSxFQUFNLEdBQWI7QUFBQSxRQUFrQixNQUFBLEVBQU8sR0FBekI7QUFBQSxRQUE4QixLQUFBLEVBQU0sR0FBcEM7QUFBQSxRQUF5QyxVQUFBLEVBQVcsTUFBcEQ7T0FBTixDQUZiLENBQUE7QUFBQSxNQUlBLE1BQU0sQ0FBQyxpQkFBUCxDQUFBLENBQTBCLENBQUMsTUFBTSxDQUFDLEdBQWxDLENBQXNDO0FBQUEsUUFBQyxHQUFBLEVBQUksR0FBTDtBQUFBLFFBQVMsR0FBQSxFQUFJLEdBQWI7QUFBQSxRQUFpQixPQUFBLEVBQVEsR0FBekI7QUFBQSxRQUE2QixRQUFBLEVBQVMsR0FBdEM7T0FBdEMsQ0FKQSxDQUFBO0FBQUEsTUFLQSxNQUFNLENBQUMsaUJBQVAsQ0FBQSxDQUEwQixDQUFDLE1BQU0sQ0FBQyxHQUFsQyxDQUFzQztBQUFBLFFBQUMsR0FBQSxFQUFJLEdBQUw7QUFBQSxRQUFTLEdBQUEsRUFBSSxHQUFiO0FBQUEsUUFBaUIsT0FBQSxFQUFRLEdBQXpCO0FBQUEsUUFBNkIsUUFBQSxFQUFTLEdBQXRDO09BQXRDLENBTEEsQ0FBQTthQU1BLE1BQU0sQ0FBQyxpQkFBUCxDQUFBLENBQTBCLENBQUMsTUFBTSxDQUFDLEdBQWxDLENBQXNDO0FBQUEsUUFBQyxHQUFBLEVBQUksR0FBTDtBQUFBLFFBQVMsR0FBQSxFQUFJLEdBQWI7QUFBQSxRQUFpQixPQUFBLEVBQVEsR0FBekI7QUFBQSxRQUE2QixRQUFBLEVBQVMsR0FBdEM7T0FBdEMsRUFSMEM7SUFBQSxDQUEzQyxFQXpHaUI7RUFBQSxDQUFsQixDQXhsQkEsQ0FBQTtBQUFBLEVBMnNCQSxRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBLEdBQUE7QUFFbEIsSUFBQSxFQUFBLENBQUcsZUFBSCxFQUFvQixTQUFBLEdBQUE7QUFDbkIsVUFBQSxjQUFBO0FBQUEsTUFBQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLEtBQUEsRUFBTSxHQUFOO0FBQUEsUUFBVyxNQUFBLEVBQU8sR0FBbEI7T0FBTixDQUFiLENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsS0FBQSxFQUFNLEdBQU47QUFBQSxRQUFXLE1BQUEsRUFBTyxHQUFsQjtBQUFBLFFBQXVCLFVBQUEsRUFBVyxNQUFsQztPQUFOLENBRGIsQ0FBQTtBQUFBLE1BRUEsTUFBTSxDQUFDLE1BQVAsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUlBLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBTSxDQUFDLENBQXBCLEVBQXVCLEVBQXZCLENBSkEsQ0FBQTthQUtBLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBTSxDQUFDLENBQXBCLEVBQXVCLEVBQXZCLEVBTm1CO0lBQUEsQ0FBcEIsQ0FBQSxDQUFBO0FBQUEsSUFRQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO0FBQy9CLFVBQUEsY0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxLQUFBLEVBQU0sR0FBTjtBQUFBLFFBQVcsTUFBQSxFQUFPLEdBQWxCO09BQU4sQ0FBYixDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLEtBQUEsRUFBTSxHQUFOO0FBQUEsUUFBVyxNQUFBLEVBQU8sR0FBbEI7QUFBQSxRQUF1QixVQUFBLEVBQVcsTUFBbEM7T0FBTixDQURiLENBQUE7QUFBQSxNQUVBLE1BQU0sQ0FBQyxPQUFQLENBQWUsRUFBZixDQUZBLENBQUE7QUFBQSxNQUdBLE1BQU0sQ0FBQyxPQUFQLENBQWUsRUFBZixDQUhBLENBQUE7QUFBQSxNQUtBLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBTSxDQUFDLENBQXBCLEVBQXVCLEdBQXZCLENBTEEsQ0FBQTthQU1BLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBTSxDQUFDLENBQXBCLEVBQXVCLEdBQXZCLEVBUCtCO0lBQUEsQ0FBaEMsQ0FSQSxDQUFBO0FBQUEsSUFpQkEsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUEsR0FBQTtBQUNoQyxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FBTTtBQUFBLFFBQUEsS0FBQSxFQUFNLEdBQU47QUFBQSxRQUFXLE1BQUEsRUFBTyxHQUFsQjtPQUFOLENBQWIsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBQSxDQUFlLENBQUMsTUFBTSxDQUFDLEtBQXZCLENBQTZCLE1BQTdCLENBREEsQ0FBQTtBQUFBLE1BRUEsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUF4QixDQUE4QixNQUE5QixDQUZBLENBQUE7YUFHQSxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsTUFBTSxDQUFDLEtBQXhCLENBQThCLE1BQTlCLEVBSmdDO0lBQUEsQ0FBakMsQ0FqQkEsQ0FBQTtXQXVCQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO0FBQy9CLFVBQUEsY0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFNO0FBQUEsUUFBQSxLQUFBLEVBQU0sR0FBTjtBQUFBLFFBQVcsTUFBQSxFQUFPLEdBQWxCO09BQU4sQ0FBYixDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQU07QUFBQSxRQUFBLEtBQUEsRUFBTSxHQUFOO0FBQUEsUUFBVyxNQUFBLEVBQU8sR0FBbEI7QUFBQSxRQUF1QixVQUFBLEVBQVcsTUFBbEM7T0FBTixDQURiLENBQUE7QUFBQSxNQUVBLE1BQU0sQ0FBQyxNQUFQLENBQUEsQ0FBZSxDQUFDLFVBQWhCLENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFJQSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQU0sQ0FBQyxDQUFwQixFQUF1QixFQUF2QixDQUpBLENBQUE7YUFLQSxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQU0sQ0FBQyxDQUFwQixFQUF1QixFQUF2QixFQU4rQjtJQUFBLENBQWhDLEVBekJrQjtFQUFBLENBQW5CLENBM3NCQSxDQUFBO0FBQUEsRUE2dUJBLFFBQUEsQ0FBUyxLQUFULEVBQWdCLFNBQUEsR0FBQTtXQUVmLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7QUFFM0IsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBQSxDQUFBLEtBQVIsQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUFvQixNQUFwQixDQURBLENBQUE7QUFBQSxNQUdBLE1BQU0sQ0FBQyxLQUFQLENBQWEsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFoQixDQUF5QixNQUF6QixDQUFiLEVBQStDLElBQS9DLENBSEEsQ0FBQTthQUlBLE1BQU0sQ0FBQyxLQUFQLENBQWEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBekIsQ0FBa0MsTUFBbEMsQ0FBYixFQUF3RCxJQUF4RCxFQU4yQjtJQUFBLENBQTVCLEVBRmU7RUFBQSxDQUFoQixDQTd1QkEsQ0FBQTtBQUFBLEVBdXZCQSxRQUFBLENBQVMsS0FBVCxFQUFnQixTQUFBLEdBQUE7QUFFZixJQUFBLEVBQUEsQ0FBRyxnQkFBSCxFQUFxQixTQUFBLEdBQUE7QUFFcEIsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBQSxDQUFBLEtBQVIsQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQURBLENBQUE7QUFBQSxNQUdBLENBQUMsYUFBUyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQXRCLENBQUEsQ0FBVCxFQUFBLEtBQUEsTUFBRCxDQUE0QyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBRCxDQUh0RCxDQUFBO2FBSUEsTUFBTSxDQUFDLEtBQVAsQ0FBYSxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQTVCLEVBQXdDLElBQXhDLEVBTm9CO0lBQUEsQ0FBckIsQ0FBQSxDQUFBO0FBQUEsSUFRQSxFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQSxHQUFBO0FBRXJCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUFSLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxJQUFOLEdBQWEsT0FEYixDQUFBO0FBQUEsTUFHQSxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFNLENBQUMsS0FBcEMsQ0FBMEMsS0FBSyxDQUFDLFlBQWhELENBSEEsQ0FBQTtBQUFBLE1BSUEsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQXBDLENBQTBDLE9BQTFDLENBSkEsQ0FBQTthQUtBLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQTFCLENBQWdDLElBQWhDLEVBUHFCO0lBQUEsQ0FBdEIsQ0FSQSxDQUFBO0FBQUEsSUFrQkEsRUFBQSxDQUFHLHNEQUFILEVBQTJELFNBQUEsR0FBQTtBQUUxRCxVQUFBLGdFQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sQ0FBQyxPQUFELEVBQVUsUUFBVixFQUFvQixVQUFwQixFQUFnQyxRQUFoQyxDQUFQLENBQUE7QUFBQSxNQUVBLElBQUEsR0FBTyxFQUZQLENBQUE7QUFJQSxXQUFBLHNDQUFBO3NCQUFBO0FBQ0MsUUFBQSxJQUFBLElBQVEsR0FBQSxHQUFJLEdBQUosR0FBUSxLQUFSLEdBQWEsR0FBYixHQUFpQixHQUF6QixDQUREO0FBQUEsT0FKQTtBQUFBLE1BT0EsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQVBSLENBQUE7QUFBQSxNQVFBLEtBQUssQ0FBQyxJQUFOLEdBQWEsSUFSYixDQUFBO0FBVUE7V0FBQSx3Q0FBQTtzQkFBQTtBQUNDLFFBQUEsT0FBQSxHQUFVLEtBQUssQ0FBQyxnQkFBTixDQUF1QixHQUF2QixDQUE0QixDQUFBLENBQUEsQ0FBdEMsQ0FBQTtBQUFBLFFBQ0EsS0FBQSxHQUFRLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixPQUF4QixDQURSLENBQUE7QUFBQSxxQkFFQSxLQUFNLENBQUEsZ0JBQUEsQ0FBaUIsQ0FBQyxNQUFNLENBQUMsS0FBL0IsQ0FBcUMsTUFBckMsRUFGQSxDQUREO0FBQUE7cUJBWjBEO0lBQUEsQ0FBM0QsQ0FsQkEsQ0FBQTtXQXFDQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQSxHQUFBO0FBRXZDLFVBQUEsa0NBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsS0FBUixDQUFBO0FBQUEsTUFDQSxLQUFLLENBQUMsSUFBTixHQUFhLGtDQURiLENBQUE7QUFBQSxNQUdBLGFBQUEsR0FBZ0IsS0FBSyxDQUFDLGdCQUFOLENBQXVCLE9BQXZCLENBSGhCLENBQUE7QUFBQSxNQUlBLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQTVCLENBQWtDLENBQWxDLENBSkEsQ0FBQTtBQUFBLE1BTUEsWUFBQSxHQUFlLENBQUMsQ0FBQyxLQUFGLENBQVEsYUFBUixDQU5mLENBQUE7YUFPQSxZQUFZLENBQUMsWUFBYixDQUEwQixJQUExQixDQUErQixDQUFDLE1BQU0sQ0FBQyxLQUF2QyxDQUE2QyxPQUE3QyxFQVR1QztJQUFBLENBQXhDLEVBdkNlO0VBQUEsQ0FBaEIsQ0F2dkJBLENBQUE7U0F5eUJBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtXQUVwQixFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQSxHQUFBO0FBRW5DLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxLQUFSLENBQUE7QUFBQSxNQUVBLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFuQyxDQUF5Qyx5SUFBekMsQ0FGQSxDQUFBO0FBQUEsTUFJQSxLQUFLLENBQUMsT0FBTixHQUFnQixJQUpoQixDQUFBO2FBTUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQW5DLENBQXlDLDREQUF6QyxFQVJtQztJQUFBLENBQXBDLEVBRm9CO0VBQUEsQ0FBckIsRUFqekJpQjtBQUFBLENBQWxCLENBSkEsQ0FBQTs7Ozs7QUNDQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7QUFFakIsRUFBQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBRTFCLElBQUEsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTthQUN4QixLQUFLLENBQUMsY0FBTixDQUFxQixFQUFyQixFQUF5QixDQUF6QixDQUEyQixDQUFDLE1BQU0sQ0FBQyxLQUFuQyxDQUF5QyxFQUF6QyxFQUR3QjtJQUFBLENBQXpCLENBQUEsQ0FBQTtXQUdBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7YUFDbEMsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsSUFBckIsRUFBMkIsQ0FBM0IsQ0FBNkIsQ0FBQyxNQUFNLENBQUMsS0FBckMsQ0FBMkMsQ0FBM0MsRUFEa0M7SUFBQSxDQUFuQyxFQUwwQjtFQUFBLENBQTNCLENBQUEsQ0FBQTtBQUFBLEVBV0EsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtXQUU5QixFQUFBLENBQUcsYUFBSCxFQUFrQixTQUFBLEdBQUE7QUFFakIsVUFBQSxDQUFBO0FBQUEsTUFBQSxDQUFBLEdBQUksU0FBQSxHQUFBO0FBQUcsZUFBTyxLQUFLLENBQUMsa0JBQU4sQ0FBeUIsU0FBekIsQ0FBUCxDQUFIO01BQUEsQ0FBSixDQUFBO0FBQUEsTUFFQSxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsTUFBTSxDQUFDLEdBQWQsQ0FBa0IsQ0FBQyxHQUFELENBQWxCLENBRkEsQ0FBQTtBQUFBLE1BR0EsQ0FBQSxDQUFFLEdBQUYsRUFBTyxHQUFQLENBQVcsQ0FBQyxNQUFNLENBQUMsR0FBbkIsQ0FBdUIsQ0FBQyxHQUFELEVBQU0sR0FBTixDQUF2QixDQUhBLENBQUE7QUFBQSxNQUtBLENBQUEsQ0FBRSxDQUFDLEdBQUQsQ0FBRixDQUFRLENBQUMsTUFBTSxDQUFDLEdBQWhCLENBQW9CLENBQUMsR0FBRCxDQUFwQixDQUxBLENBQUE7QUFBQSxNQU1BLENBQUEsQ0FBRSxDQUFDLEdBQUQsRUFBTSxHQUFOLENBQUYsQ0FBYSxDQUFDLE1BQU0sQ0FBQyxHQUFyQixDQUF5QixDQUFDLEdBQUQsRUFBTSxHQUFOLENBQXpCLENBTkEsQ0FBQTtBQUFBLE1BUUEsQ0FBQSxDQUFFLFFBQUYsQ0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFuQixDQUF1QixDQUFDLFFBQUQsQ0FBdkIsQ0FSQSxDQUFBO2FBU0EsQ0FBQSxDQUFFLENBQUMsUUFBRCxDQUFGLENBQWEsQ0FBQyxNQUFNLENBQUMsR0FBckIsQ0FBeUIsQ0FBQyxRQUFELENBQXpCLEVBWGlCO0lBQUEsQ0FBbEIsRUFGOEI7RUFBQSxDQUEvQixDQVhBLENBQUE7QUFBQSxFQTBCQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFFekIsSUFBQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQSxHQUFBO0FBQ25DLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEtBQUssQ0FBQyxhQUFOLENBQW9CLFFBQXBCLENBQVQsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBbkIsQ0FBeUIsUUFBekIsQ0FEQSxDQUFBO2FBRUEsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBbkIsQ0FBdUIsRUFBdkIsRUFIbUM7SUFBQSxDQUFwQyxDQUFBLENBQUE7QUFBQSxJQUtBLEVBQUEsQ0FBRyxvQ0FBSCxFQUF5QyxTQUFBLEdBQUE7QUFDeEMsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsYUFBcEIsQ0FBVCxDQUFBO0FBQUEsTUFDQSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFuQixDQUF5QixRQUF6QixDQURBLENBQUE7YUFFQSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFuQixDQUF1QixDQUFDLEtBQUQsQ0FBdkIsRUFId0M7SUFBQSxDQUF6QyxDQUxBLENBQUE7QUFBQSxJQVVBLEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7QUFDekMsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsZ0JBQXBCLENBQVQsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBbkIsQ0FBeUIsUUFBekIsQ0FEQSxDQUFBO2FBRUEsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBbkIsQ0FBdUIsQ0FBQyxLQUFELEVBQVEsSUFBUixDQUF2QixFQUh5QztJQUFBLENBQTFDLENBVkEsQ0FBQTtXQWVBLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBLEdBQUE7QUFDOUIsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsbUJBQXBCLENBQVQsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBbkIsQ0FBeUIsUUFBekIsQ0FEQSxDQUFBO2FBRUEsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBbkIsQ0FBdUIsQ0FBQyxLQUFELEVBQVEsSUFBUixDQUF2QixFQUg4QjtJQUFBLENBQS9CLEVBakJ5QjtFQUFBLENBQTFCLENBMUJBLENBQUE7QUFBQSxFQWdEQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7V0FFckIsRUFBQSxDQUFHLGFBQUgsRUFBa0IsU0FBQSxHQUFBO0FBQ2pCLE1BQUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsQ0FBaEIsRUFBaUMsR0FBakMsQ0FBcUMsQ0FBQyxNQUFNLENBQUMsS0FBN0MsQ0FBbUQsR0FBbkQsQ0FBQSxDQUFBO0FBQUEsTUFDQSxLQUFLLENBQUMsU0FBTixDQUFnQixDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxDQUFoQixFQUFpQyxHQUFqQyxDQUFxQyxDQUFDLE1BQU0sQ0FBQyxLQUE3QyxDQUFtRCxHQUFuRCxDQURBLENBQUE7YUFFQSxLQUFLLENBQUMsU0FBTixDQUFnQixDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxDQUFoQixFQUFpQyxHQUFqQyxDQUFxQyxDQUFDLE1BQU0sQ0FBQyxLQUE3QyxDQUFtRCxHQUFuRCxFQUhpQjtJQUFBLENBQWxCLEVBRnFCO0VBQUEsQ0FBdEIsQ0FoREEsQ0FBQTtBQUFBLEVBdURBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtXQUVyQixFQUFBLENBQUcsYUFBSCxFQUFrQixTQUFBLEdBQUE7QUFDakIsTUFBQSxLQUFLLENBQUMsU0FBTixDQUFnQixDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxDQUFoQixFQUFpQyxHQUFqQyxDQUFxQyxDQUFDLE1BQU0sQ0FBQyxLQUE3QyxDQUFtRCxHQUFuRCxDQUFBLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxTQUFOLENBQWdCLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLENBQWhCLEVBQWlDLEdBQWpDLENBQXFDLENBQUMsTUFBTSxDQUFDLEtBQTdDLENBQW1ELEdBQW5ELENBREEsQ0FBQTthQUVBLEtBQUssQ0FBQyxTQUFOLENBQWdCLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLENBQWhCLEVBQWlDLEdBQWpDLENBQXFDLENBQUMsTUFBTSxDQUFDLEtBQTdDLENBQW1ELEdBQW5ELEVBSGlCO0lBQUEsQ0FBbEIsRUFGcUI7RUFBQSxDQUF0QixDQXZEQSxDQUFBO0FBQUEsRUE4REEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO1dBRW5CLEVBQUEsQ0FBRyxhQUFILEVBQWtCLFNBQUEsR0FBQTtBQUVqQixNQUFBLEtBQUssQ0FBQyxPQUFOLENBQWM7UUFDYjtBQUFBLFVBQUMsS0FBQSxFQUFNLEdBQVA7QUFBQSxVQUFZLE1BQUEsRUFBTyxHQUFuQjtTQURhLEVBRWI7QUFBQSxVQUFDLEtBQUEsRUFBTSxHQUFQO0FBQUEsVUFBWSxNQUFBLEVBQU8sR0FBbkI7U0FGYTtPQUFkLENBR0UsQ0FBQyxNQUFNLENBQUMsR0FIVixDQUdjO0FBQUEsUUFBQyxLQUFBLEVBQU0sR0FBUDtBQUFBLFFBQVksTUFBQSxFQUFPLEdBQW5CO09BSGQsQ0FBQSxDQUFBO2FBS0EsS0FBSyxDQUFDLE9BQU4sQ0FBYztRQUNiO0FBQUEsVUFBQyxLQUFBLEVBQU0sSUFBUDtBQUFBLFVBQWEsTUFBQSxFQUFPLElBQXBCO1NBRGEsRUFFYjtBQUFBLFVBQUMsS0FBQSxFQUFNLEdBQVA7QUFBQSxVQUFZLE1BQUEsRUFBTyxHQUFuQjtTQUZhO09BQWQsQ0FHRSxDQUFDLE1BQU0sQ0FBQyxHQUhWLENBR2M7QUFBQSxRQUFDLEtBQUEsRUFBTSxJQUFQO0FBQUEsUUFBYSxNQUFBLEVBQU8sSUFBcEI7T0FIZCxFQVBpQjtJQUFBLENBQWxCLEVBRm1CO0VBQUEsQ0FBcEIsQ0E5REEsQ0FBQTtBQUFBLEVBNEVBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtXQUVwQixFQUFBLENBQUcsYUFBSCxFQUFrQixTQUFBLEdBQUE7YUFDakIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxNQUFmLEVBQXVCLFFBQXZCLENBQWdDLENBQUMsTUFBTSxDQUFDLEtBQXhDLENBQThDLGFBQTlDLEVBRGlCO0lBQUEsQ0FBbEIsRUFGb0I7RUFBQSxDQUFyQixDQTVFQSxDQUFBO0FBQUEsRUFrRkEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO1dBRW5CLEVBQUEsQ0FBRyxhQUFILEVBQWtCLFNBQUEsR0FBQTtBQUVqQixNQUFBLEtBQUssQ0FBQyxPQUFOLENBQWM7UUFDYjtBQUFBLFVBQUMsS0FBQSxFQUFNLEdBQVA7QUFBQSxVQUFZLE1BQUEsRUFBTyxHQUFuQjtTQURhLEVBRWI7QUFBQSxVQUFDLEtBQUEsRUFBTSxHQUFQO0FBQUEsVUFBWSxNQUFBLEVBQU8sR0FBbkI7U0FGYTtPQUFkLENBR0UsQ0FBQyxNQUFNLENBQUMsR0FIVixDQUdjO0FBQUEsUUFBQyxLQUFBLEVBQU0sR0FBUDtBQUFBLFFBQVksTUFBQSxFQUFPLEdBQW5CO09BSGQsQ0FBQSxDQUFBO2FBS0EsS0FBSyxDQUFDLE9BQU4sQ0FBYztRQUNiO0FBQUEsVUFBQyxLQUFBLEVBQU0sSUFBUDtBQUFBLFVBQWEsTUFBQSxFQUFPLElBQXBCO1NBRGEsRUFFYjtBQUFBLFVBQUMsS0FBQSxFQUFNLEdBQVA7QUFBQSxVQUFZLE1BQUEsRUFBTyxHQUFuQjtTQUZhO09BQWQsQ0FHRSxDQUFDLE1BQU0sQ0FBQyxHQUhWLENBR2M7QUFBQSxRQUFDLEtBQUEsRUFBTSxHQUFQO0FBQUEsUUFBWSxNQUFBLEVBQU8sR0FBbkI7T0FIZCxFQVBpQjtJQUFBLENBQWxCLEVBRm1CO0VBQUEsQ0FBcEIsQ0FsRkEsQ0FBQTtBQUFBLEVBaUdBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTtXQUV0QixFQUFBLENBQUcsYUFBSCxFQUFrQixTQUFBLEdBQUE7QUFFakIsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsU0FBQyxNQUFELEVBQVMsTUFBVCxHQUFBO0FBQ1QsWUFBQSw4QkFBQTtBQUFBLFFBQUEsS0FBQSxHQUFRLEtBQUssQ0FBQyxVQUFOLENBQWlCLE1BQWpCLENBQVIsQ0FBQTtBQUNBO0FBQUE7YUFBQSxxQ0FBQTtxQkFBQTtBQUNDLHVCQUFBLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFNLENBQUMsS0FBaEIsQ0FBc0IsTUFBTyxDQUFBLENBQUEsQ0FBN0IsRUFBaUMsQ0FBakMsRUFBQSxDQUREO0FBQUE7dUJBRlM7TUFBQSxDQUFWLENBQUE7QUFBQSxNQUtBLE9BQUEsQ0FBUTtRQUNQO0FBQUEsVUFBQyxDQUFBLEVBQUUsQ0FBSDtBQUFBLFVBQU0sQ0FBQSxFQUFFLENBQVI7QUFBQSxVQUFXLEtBQUEsRUFBTSxHQUFqQjtBQUFBLFVBQXNCLE1BQUEsRUFBTyxHQUE3QjtTQURPLEVBRVA7QUFBQSxVQUFDLENBQUEsRUFBRSxDQUFIO0FBQUEsVUFBTSxDQUFBLEVBQUUsQ0FBUjtBQUFBLFVBQVcsS0FBQSxFQUFNLEdBQWpCO0FBQUEsVUFBc0IsTUFBQSxFQUFPLEdBQTdCO1NBRk87T0FBUixFQUdJO0FBQUEsUUFBQyxDQUFBLEVBQUUsQ0FBSDtBQUFBLFFBQU0sQ0FBQSxFQUFFLENBQVI7QUFBQSxRQUFXLEtBQUEsRUFBTSxHQUFqQjtBQUFBLFFBQXNCLE1BQUEsRUFBTyxHQUE3QjtPQUhKLENBTEEsQ0FBQTtBQUFBLE1BVUEsT0FBQSxDQUFRO1FBQ1A7QUFBQSxVQUFDLENBQUEsRUFBRSxDQUFIO0FBQUEsVUFBTSxDQUFBLEVBQUUsQ0FBUjtBQUFBLFVBQVcsS0FBQSxFQUFNLEdBQWpCO0FBQUEsVUFBc0IsTUFBQSxFQUFPLEdBQTdCO1NBRE8sRUFFUDtBQUFBLFVBQUMsQ0FBQSxFQUFFLENBQUg7QUFBQSxVQUFNLENBQUEsRUFBRSxDQUFSO0FBQUEsVUFBVyxLQUFBLEVBQU0sR0FBakI7QUFBQSxVQUFzQixNQUFBLEVBQU8sR0FBN0I7U0FGTztPQUFSLEVBR0k7QUFBQSxRQUFDLENBQUEsRUFBRSxDQUFIO0FBQUEsUUFBTSxDQUFBLEVBQUUsQ0FBUjtBQUFBLFFBQVcsS0FBQSxFQUFNLEdBQWpCO0FBQUEsUUFBc0IsTUFBQSxFQUFPLEdBQTdCO09BSEosQ0FWQSxDQUFBO0FBQUEsTUFlQSxPQUFBLENBQVE7UUFDUDtBQUFBLFVBQUMsQ0FBQSxFQUFFLENBQUg7QUFBQSxVQUFNLENBQUEsRUFBRSxDQUFSO0FBQUEsVUFBVyxLQUFBLEVBQU0sR0FBakI7QUFBQSxVQUFzQixNQUFBLEVBQU8sR0FBN0I7U0FETyxFQUVQO0FBQUEsVUFBQyxDQUFBLEVBQUUsR0FBSDtBQUFBLFVBQVEsQ0FBQSxFQUFFLEdBQVY7QUFBQSxVQUFlLEtBQUEsRUFBTSxHQUFyQjtBQUFBLFVBQTBCLE1BQUEsRUFBTyxHQUFqQztTQUZPO09BQVIsRUFHSTtBQUFBLFFBQUMsQ0FBQSxFQUFFLENBQUg7QUFBQSxRQUFNLENBQUEsRUFBRSxDQUFSO0FBQUEsUUFBVyxLQUFBLEVBQU0sR0FBakI7QUFBQSxRQUFzQixNQUFBLEVBQU8sR0FBN0I7T0FISixDQWZBLENBQUE7YUFvQkEsT0FBQSxDQUFRO1FBQ1A7QUFBQSxVQUFDLENBQUEsRUFBRSxHQUFIO0FBQUEsVUFBUSxDQUFBLEVBQUUsR0FBVjtBQUFBLFVBQWUsS0FBQSxFQUFNLEdBQXJCO0FBQUEsVUFBMEIsTUFBQSxFQUFPLEdBQWpDO1NBRE8sRUFFUDtBQUFBLFVBQUMsQ0FBQSxFQUFFLEdBQUg7QUFBQSxVQUFRLENBQUEsRUFBRSxHQUFWO0FBQUEsVUFBZSxLQUFBLEVBQU0sR0FBckI7QUFBQSxVQUEwQixNQUFBLEVBQU8sR0FBakM7U0FGTztPQUFSLEVBR0k7QUFBQSxRQUFDLENBQUEsRUFBRSxHQUFIO0FBQUEsUUFBUSxDQUFBLEVBQUUsR0FBVjtBQUFBLFFBQWUsS0FBQSxFQUFNLEdBQXJCO0FBQUEsUUFBMEIsTUFBQSxFQUFPLEdBQWpDO09BSEosRUF0QmlCO0lBQUEsQ0FBbEIsRUFGc0I7RUFBQSxDQUF2QixDQWpHQSxDQUFBO0FBQUEsRUFpSUEsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUEsR0FBQTtXQUUvQixFQUFBLENBQUcsYUFBSCxFQUFrQixTQUFBLEdBQUE7QUFDakIsTUFBQSxLQUFLLENBQUMsbUJBQU4sQ0FBMEI7QUFBQSxRQUFDLENBQUEsRUFBRSxHQUFIO0FBQUEsUUFBUSxDQUFBLEVBQUUsR0FBVjtBQUFBLFFBQWUsS0FBQSxFQUFNLEdBQXJCO0FBQUEsUUFBMEIsTUFBQSxFQUFPLEdBQWpDO09BQTFCLEVBQWlFLENBQWpFLEVBQW9FLENBQXBFLENBQXNFLENBQUMsTUFBTSxDQUFDLEdBQTlFLENBQ0M7QUFBQSxRQUFDLENBQUEsRUFBRSxHQUFIO0FBQUEsUUFBUSxDQUFBLEVBQUUsR0FBVjtBQUFBLFFBQWUsS0FBQSxFQUFNLEdBQXJCO0FBQUEsUUFBMEIsTUFBQSxFQUFPLEdBQWpDO09BREQsQ0FBQSxDQUFBO0FBQUEsTUFFQSxLQUFLLENBQUMsbUJBQU4sQ0FBMEI7QUFBQSxRQUFDLENBQUEsRUFBRSxHQUFIO0FBQUEsUUFBUSxDQUFBLEVBQUUsR0FBVjtBQUFBLFFBQWUsS0FBQSxFQUFNLEdBQXJCO0FBQUEsUUFBMEIsTUFBQSxFQUFPLEdBQWpDO09BQTFCLEVBQWlFLENBQWpFLEVBQW9FLENBQXBFLENBQXNFLENBQUMsTUFBTSxDQUFDLEdBQTlFLENBQ0M7QUFBQSxRQUFDLENBQUEsRUFBRSxHQUFIO0FBQUEsUUFBUSxDQUFBLEVBQUUsR0FBVjtBQUFBLFFBQWUsS0FBQSxFQUFNLEdBQXJCO0FBQUEsUUFBMEIsTUFBQSxFQUFPLEdBQWpDO09BREQsQ0FGQSxDQUFBO0FBQUEsTUFJQSxLQUFLLENBQUMsbUJBQU4sQ0FBMEI7QUFBQSxRQUFDLENBQUEsRUFBRSxHQUFIO0FBQUEsUUFBUSxDQUFBLEVBQUUsR0FBVjtBQUFBLFFBQWUsS0FBQSxFQUFNLEdBQXJCO0FBQUEsUUFBMEIsTUFBQSxFQUFPLEdBQWpDO09BQTFCLEVBQWlFLENBQWpFLEVBQW9FLENBQXBFLENBQXNFLENBQUMsTUFBTSxDQUFDLEdBQTlFLENBQ0M7QUFBQSxRQUFDLENBQUEsRUFBRSxHQUFIO0FBQUEsUUFBUSxDQUFBLEVBQUUsR0FBVjtBQUFBLFFB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QUFxQixTQUFBLEdBQUE7QUFJcEIsUUFBQSxXQUFBO0FBQUEsSUFBQSxJQUFBLEdBQVEsZ0JBQVIsQ0FBQTtXQUNBLEtBQUEsR0FBUTtBQUFBLE1BQUMsSUFBQSxFQUFLLGdCQUFOO01BTFk7RUFBQSxDQUFyQixFQTFMaUI7QUFBQSxDQUFsQixDQUFBLENBQUE7Ozs7O0FDREEsUUFBQSxDQUFTLFlBQVQsRUFBdUIsU0FBQSxHQUFBO1NBRXRCLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUdwQixJQUFBLElBQUcsQ0FBQSxLQUFTLENBQUMsUUFBTixDQUFBLENBQVA7YUFDQyxFQUFBLENBQUcscUJBQUgsRUFBMEIsU0FBQSxHQUFBO0FBRXpCLFlBQUEsVUFBQTtBQUFBLFFBQUEsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBVztBQUFBLFVBQUEsS0FBQSxFQUFNLGlCQUFOO1NBQVgsQ0FBakIsQ0FBQTtlQUNBLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUE3QixDQUFtQyxpQkFBbkMsRUFIeUI7TUFBQSxDQUExQixFQUREO0tBSG9CO0VBQUEsQ0FBckIsRUFGc0I7QUFBQSxDQUF2QixDQUFBLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvVW5pdF9UZXN0aW5nLzEuMFxuLy9cbi8vIFRISVMgSVMgTk9UIFRFU1RFRCBOT1IgTElLRUxZIFRPIFdPUksgT1VUU0lERSBWOCFcbi8vXG4vLyBPcmlnaW5hbGx5IGZyb20gbmFyd2hhbC5qcyAoaHR0cDovL25hcndoYWxqcy5vcmcpXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDkgVGhvbWFzIFJvYmluc29uIDwyODBub3J0aC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgJ1NvZnR3YXJlJyksIHRvXG4vLyBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZVxuLy8gcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yXG4vLyBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuLy8gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHdoZW4gdXNlZCBpbiBub2RlLCB0aGlzIHdpbGwgYWN0dWFsbHkgbG9hZCB0aGUgdXRpbCBtb2R1bGUgd2UgZGVwZW5kIG9uXG4vLyB2ZXJzdXMgbG9hZGluZyB0aGUgYnVpbHRpbiB1dGlsIG1vZHVsZSBhcyBoYXBwZW5zIG90aGVyd2lzZVxuLy8gdGhpcyBpcyBhIGJ1ZyBpbiBub2RlIG1vZHVsZSBsb2FkaW5nIGFzIGZhciBhcyBJIGFtIGNvbmNlcm5lZFxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsLycpO1xuXG52YXIgcFNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8vIDEuIFRoZSBhc3NlcnQgbW9kdWxlIHByb3ZpZGVzIGZ1bmN0aW9ucyB0aGF0IHRocm93XG4vLyBBc3NlcnRpb25FcnJvcidzIHdoZW4gcGFydGljdWxhciBjb25kaXRpb25zIGFyZSBub3QgbWV0LiBUaGVcbi8vIGFzc2VydCBtb2R1bGUgbXVzdCBjb25mb3JtIHRvIHRoZSBmb2xsb3dpbmcgaW50ZXJmYWNlLlxuXG52YXIgYXNzZXJ0ID0gbW9kdWxlLmV4cG9ydHMgPSBvaztcblxuLy8gMi4gVGhlIEFzc2VydGlvbkVycm9yIGlzIGRlZmluZWQgaW4gYXNzZXJ0LlxuLy8gbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7IG1lc3NhZ2U6IG1lc3NhZ2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsOiBhY3R1YWwsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IGV4cGVjdGVkIH0pXG5cbmFzc2VydC5Bc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIEFzc2VydGlvbkVycm9yKG9wdGlvbnMpIHtcbiAgdGhpcy5uYW1lID0gJ0Fzc2VydGlvbkVycm9yJztcbiAgdGhpcy5hY3R1YWwgPSBvcHRpb25zLmFjdHVhbDtcbiAgdGhpcy5leHBlY3RlZCA9IG9wdGlvbnMuZXhwZWN0ZWQ7XG4gIHRoaXMub3BlcmF0b3IgPSBvcHRpb25zLm9wZXJhdG9yO1xuICBpZiAob3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubWVzc2FnZSA9IGdldE1lc3NhZ2UodGhpcyk7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gdHJ1ZTtcbiAgfVxuICB2YXIgc3RhY2tTdGFydEZ1bmN0aW9uID0gb3B0aW9ucy5zdGFja1N0YXJ0RnVuY3Rpb24gfHwgZmFpbDtcblxuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vIG5vbiB2OCBicm93c2VycyBzbyB3ZSBjYW4gaGF2ZSBhIHN0YWNrdHJhY2VcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XG4gICAgaWYgKGVyci5zdGFjaykge1xuICAgICAgdmFyIG91dCA9IGVyci5zdGFjaztcblxuICAgICAgLy8gdHJ5IHRvIHN0cmlwIHVzZWxlc3MgZnJhbWVzXG4gICAgICB2YXIgZm5fbmFtZSA9IHN0YWNrU3RhcnRGdW5jdGlvbi5uYW1lO1xuICAgICAgdmFyIGlkeCA9IG91dC5pbmRleE9mKCdcXG4nICsgZm5fbmFtZSk7XG4gICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgLy8gb25jZSB3ZSBoYXZlIGxvY2F0ZWQgdGhlIGZ1bmN0aW9uIGZyYW1lXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gc3RyaXAgb3V0IGV2ZXJ5dGhpbmcgYmVmb3JlIGl0IChhbmQgaXRzIGxpbmUpXG4gICAgICAgIHZhciBuZXh0X2xpbmUgPSBvdXQuaW5kZXhPZignXFxuJywgaWR4ICsgMSk7XG4gICAgICAgIG91dCA9IG91dC5zdWJzdHJpbmcobmV4dF9saW5lICsgMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhY2sgPSBvdXQ7XG4gICAgfVxuICB9XG59O1xuXG4vLyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IgaW5zdGFuY2VvZiBFcnJvclxudXRpbC5pbmhlcml0cyhhc3NlcnQuQXNzZXJ0aW9uRXJyb3IsIEVycm9yKTtcblxuZnVuY3Rpb24gcmVwbGFjZXIoa2V5LCB2YWx1ZSkge1xuICBpZiAodXRpbC5pc1VuZGVmaW5lZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gJycgKyB2YWx1ZTtcbiAgfVxuICBpZiAodXRpbC5pc051bWJlcih2YWx1ZSkgJiYgIWlzRmluaXRlKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICB9XG4gIGlmICh1dGlsLmlzRnVuY3Rpb24odmFsdWUpIHx8IHV0aWwuaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZShzLCBuKSB7XG4gIGlmICh1dGlsLmlzU3RyaW5nKHMpKSB7XG4gICAgcmV0dXJuIHMubGVuZ3RoIDwgbiA/IHMgOiBzLnNsaWNlKDAsIG4pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldE1lc3NhZ2Uoc2VsZikge1xuICByZXR1cm4gdHJ1bmNhdGUoSlNPTi5zdHJpbmdpZnkoc2VsZi5hY3R1YWwsIHJlcGxhY2VyKSwgMTI4KSArICcgJyArXG4gICAgICAgICBzZWxmLm9wZXJhdG9yICsgJyAnICtcbiAgICAgICAgIHRydW5jYXRlKEpTT04uc3RyaW5naWZ5KHNlbGYuZXhwZWN0ZWQsIHJlcGxhY2VyKSwgMTI4KTtcbn1cblxuLy8gQXQgcHJlc2VudCBvbmx5IHRoZSB0aHJlZSBrZXlzIG1lbnRpb25lZCBhYm92ZSBhcmUgdXNlZCBhbmRcbi8vIHVuZGVyc3Rvb2QgYnkgdGhlIHNwZWMuIEltcGxlbWVudGF0aW9ucyBvciBzdWIgbW9kdWxlcyBjYW4gcGFzc1xuLy8gb3RoZXIga2V5cyB0byB0aGUgQXNzZXJ0aW9uRXJyb3IncyBjb25zdHJ1Y3RvciAtIHRoZXkgd2lsbCBiZVxuLy8gaWdub3JlZC5cblxuLy8gMy4gQWxsIG9mIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIG11c3QgdGhyb3cgYW4gQXNzZXJ0aW9uRXJyb3Jcbi8vIHdoZW4gYSBjb3JyZXNwb25kaW5nIGNvbmRpdGlvbiBpcyBub3QgbWV0LCB3aXRoIGEgbWVzc2FnZSB0aGF0XG4vLyBtYXkgYmUgdW5kZWZpbmVkIGlmIG5vdCBwcm92aWRlZC4gIEFsbCBhc3NlcnRpb24gbWV0aG9kcyBwcm92aWRlXG4vLyBib3RoIHRoZSBhY3R1YWwgYW5kIGV4cGVjdGVkIHZhbHVlcyB0byB0aGUgYXNzZXJ0aW9uIGVycm9yIGZvclxuLy8gZGlzcGxheSBwdXJwb3Nlcy5cblxuZnVuY3Rpb24gZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCBvcGVyYXRvciwgc3RhY2tTdGFydEZ1bmN0aW9uKSB7XG4gIHRocm93IG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3Ioe1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgYWN0dWFsOiBhY3R1YWwsXG4gICAgZXhwZWN0ZWQ6IGV4cGVjdGVkLFxuICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICBzdGFja1N0YXJ0RnVuY3Rpb246IHN0YWNrU3RhcnRGdW5jdGlvblxuICB9KTtcbn1cblxuLy8gRVhURU5TSU9OISBhbGxvd3MgZm9yIHdlbGwgYmVoYXZlZCBlcnJvcnMgZGVmaW5lZCBlbHNld2hlcmUuXG5hc3NlcnQuZmFpbCA9IGZhaWw7XG5cbi8vIDQuIFB1cmUgYXNzZXJ0aW9uIHRlc3RzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0cnV0aHksIGFzIGRldGVybWluZWRcbi8vIGJ5ICEhZ3VhcmQuXG4vLyBhc3NlcnQub2soZ3VhcmQsIG1lc3NhZ2Vfb3B0KTtcbi8vIFRoaXMgc3RhdGVtZW50IGlzIGVxdWl2YWxlbnQgdG8gYXNzZXJ0LmVxdWFsKHRydWUsICEhZ3VhcmQsXG4vLyBtZXNzYWdlX29wdCk7LiBUbyB0ZXN0IHN0cmljdGx5IGZvciB0aGUgdmFsdWUgdHJ1ZSwgdXNlXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwodHJ1ZSwgZ3VhcmQsIG1lc3NhZ2Vfb3B0KTsuXG5cbmZ1bmN0aW9uIG9rKHZhbHVlLCBtZXNzYWdlKSB7XG4gIGlmICghdmFsdWUpIGZhaWwodmFsdWUsIHRydWUsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5vayk7XG59XG5hc3NlcnQub2sgPSBvaztcblxuLy8gNS4gVGhlIGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzaGFsbG93LCBjb2VyY2l2ZSBlcXVhbGl0eSB3aXRoXG4vLyA9PS5cbi8vIGFzc2VydC5lcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPSBleHBlY3RlZCkgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQuZXF1YWwpO1xufTtcblxuLy8gNi4gVGhlIG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHdoZXRoZXIgdHdvIG9iamVjdHMgYXJlIG5vdCBlcXVhbFxuLy8gd2l0aCAhPSBhc3NlcnQubm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RXF1YWwgPSBmdW5jdGlvbiBub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPScsIGFzc2VydC5ub3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDcuIFRoZSBlcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgYSBkZWVwIGVxdWFsaXR5IHJlbGF0aW9uLlxuLy8gYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5kZWVwRXF1YWwgPSBmdW5jdGlvbiBkZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwRXF1YWwnLCBhc3NlcnQuZGVlcEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAodXRpbC5pc0J1ZmZlcihhY3R1YWwpICYmIHV0aWwuaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgaWYgKGFjdHVhbC5sZW5ndGggIT0gZXhwZWN0ZWQubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjdHVhbC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFjdHVhbFtpXSAhPT0gZXhwZWN0ZWRbaV0pIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxuICAvLyA3LjIuIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIERhdGUgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIERhdGUgb2JqZWN0IHRoYXQgcmVmZXJzIHRvIHRoZSBzYW1lIHRpbWUuXG4gIH0gZWxzZSBpZiAodXRpbC5pc0RhdGUoYWN0dWFsKSAmJiB1dGlsLmlzRGF0ZShleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLmdldFRpbWUoKSA9PT0gZXhwZWN0ZWQuZ2V0VGltZSgpO1xuXG4gIC8vIDcuMyBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBSZWdFeHAgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIFJlZ0V4cCBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzb3VyY2UgYW5kXG4gIC8vIHByb3BlcnRpZXMgKGBnbG9iYWxgLCBgbXVsdGlsaW5lYCwgYGxhc3RJbmRleGAsIGBpZ25vcmVDYXNlYCkuXG4gIH0gZWxzZSBpZiAodXRpbC5pc1JlZ0V4cChhY3R1YWwpICYmIHV0aWwuaXNSZWdFeHAoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5zb3VyY2UgPT09IGV4cGVjdGVkLnNvdXJjZSAmJlxuICAgICAgICAgICBhY3R1YWwuZ2xvYmFsID09PSBleHBlY3RlZC5nbG9iYWwgJiZcbiAgICAgICAgICAgYWN0dWFsLm11bHRpbGluZSA9PT0gZXhwZWN0ZWQubXVsdGlsaW5lICYmXG4gICAgICAgICAgIGFjdHVhbC5sYXN0SW5kZXggPT09IGV4cGVjdGVkLmxhc3RJbmRleCAmJlxuICAgICAgICAgICBhY3R1YWwuaWdub3JlQ2FzZSA9PT0gZXhwZWN0ZWQuaWdub3JlQ2FzZTtcblxuICAvLyA3LjQuIE90aGVyIHBhaXJzIHRoYXQgZG8gbm90IGJvdGggcGFzcyB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcsXG4gIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gIH0gZWxzZSBpZiAoIXV0aWwuaXNPYmplY3QoYWN0dWFsKSAmJiAhdXRpbC5pc09iamVjdChleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsID09IGV4cGVjdGVkO1xuXG4gIC8vIDcuNSBGb3IgYWxsIG90aGVyIE9iamVjdCBwYWlycywgaW5jbHVkaW5nIEFycmF5IG9iamVjdHMsIGVxdWl2YWxlbmNlIGlzXG4gIC8vIGRldGVybWluZWQgYnkgaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChhcyB2ZXJpZmllZFxuICAvLyB3aXRoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCksIHRoZSBzYW1lIHNldCBvZiBrZXlzXG4gIC8vIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLCBlcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnlcbiAgLy8gY29ycmVzcG9uZGluZyBrZXksIGFuZCBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuIE5vdGU6IHRoaXNcbiAgLy8gYWNjb3VudHMgZm9yIGJvdGggbmFtZWQgYW5kIGluZGV4ZWQgcHJvcGVydGllcyBvbiBBcnJheXMuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG9iakVxdWl2KGFjdHVhbCwgZXhwZWN0ZWQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbmZ1bmN0aW9uIG9iakVxdWl2KGEsIGIpIHtcbiAgaWYgKHV0aWwuaXNOdWxsT3JVbmRlZmluZWQoYSkgfHwgdXRpbC5pc051bGxPclVuZGVmaW5lZChiKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vIGFuIGlkZW50aWNhbCAncHJvdG90eXBlJyBwcm9wZXJ0eS5cbiAgaWYgKGEucHJvdG90eXBlICE9PSBiLnByb3RvdHlwZSkgcmV0dXJuIGZhbHNlO1xuICAvLyBpZiBvbmUgaXMgYSBwcmltaXRpdmUsIHRoZSBvdGhlciBtdXN0IGJlIHNhbWVcbiAgaWYgKHV0aWwuaXNQcmltaXRpdmUoYSkgfHwgdXRpbC5pc1ByaW1pdGl2ZShiKSkge1xuICAgIHJldHVybiBhID09PSBiO1xuICB9XG4gIHZhciBhSXNBcmdzID0gaXNBcmd1bWVudHMoYSksXG4gICAgICBiSXNBcmdzID0gaXNBcmd1bWVudHMoYik7XG4gIGlmICgoYUlzQXJncyAmJiAhYklzQXJncykgfHwgKCFhSXNBcmdzICYmIGJJc0FyZ3MpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKGFJc0FyZ3MpIHtcbiAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgYiA9IHBTbGljZS5jYWxsKGIpO1xuICAgIHJldHVybiBfZGVlcEVxdWFsKGEsIGIpO1xuICB9XG4gIHZhciBrYSA9IG9iamVjdEtleXMoYSksXG4gICAgICBrYiA9IG9iamVjdEtleXMoYiksXG4gICAgICBrZXksIGk7XG4gIC8vIGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoa2V5cyBpbmNvcnBvcmF0ZXNcbiAgLy8gaGFzT3duUHJvcGVydHkpXG4gIGlmIChrYS5sZW5ndGggIT0ga2IubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy90aGUgc2FtZSBzZXQgb2Yga2V5cyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSxcbiAga2Euc29ydCgpO1xuICBrYi5zb3J0KCk7XG4gIC8vfn5+Y2hlYXAga2V5IHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoa2FbaV0gIT0ga2JbaV0pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy9lcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnkgY29ycmVzcG9uZGluZyBrZXksIGFuZFxuICAvL35+fnBvc3NpYmx5IGV4cGVuc2l2ZSBkZWVwIHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBrZXkgPSBrYVtpXTtcbiAgICBpZiAoIV9kZWVwRXF1YWwoYVtrZXldLCBiW2tleV0pKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIDguIFRoZSBub24tZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGZvciBhbnkgZGVlcCBpbmVxdWFsaXR5LlxuLy8gYXNzZXJ0Lm5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3REZWVwRXF1YWwgPSBmdW5jdGlvbiBub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBFcXVhbCcsIGFzc2VydC5ub3REZWVwRXF1YWwpO1xuICB9XG59O1xuXG4vLyA5LiBUaGUgc3RyaWN0IGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzdHJpY3QgZXF1YWxpdHksIGFzIGRldGVybWluZWQgYnkgPT09LlxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnN0cmljdEVxdWFsID0gZnVuY3Rpb24gc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09PScsIGFzc2VydC5zdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDEwLiBUaGUgc3RyaWN0IG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHN0cmljdCBpbmVxdWFsaXR5LCBhc1xuLy8gZGV0ZXJtaW5lZCBieSAhPT0uICBhc3NlcnQubm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90U3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT09JywgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkge1xuICBpZiAoIWFjdHVhbCB8fCAhZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGV4cGVjdGVkKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgIHJldHVybiBleHBlY3RlZC50ZXN0KGFjdHVhbCk7XG4gIH0gZWxzZSBpZiAoYWN0dWFsIGluc3RhbmNlb2YgZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChleHBlY3RlZC5jYWxsKHt9LCBhY3R1YWwpID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF90aHJvd3Moc2hvdWxkVGhyb3csIGJsb2NrLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICB2YXIgYWN0dWFsO1xuXG4gIGlmICh1dGlsLmlzU3RyaW5nKGV4cGVjdGVkKSkge1xuICAgIG1lc3NhZ2UgPSBleHBlY3RlZDtcbiAgICBleHBlY3RlZCA9IG51bGw7XG4gIH1cblxuICB0cnkge1xuICAgIGJsb2NrKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBhY3R1YWwgPSBlO1xuICB9XG5cbiAgbWVzc2FnZSA9IChleHBlY3RlZCAmJiBleHBlY3RlZC5uYW1lID8gJyAoJyArIGV4cGVjdGVkLm5hbWUgKyAnKS4nIDogJy4nKSArXG4gICAgICAgICAgICAobWVzc2FnZSA/ICcgJyArIG1lc3NhZ2UgOiAnLicpO1xuXG4gIGlmIChzaG91bGRUaHJvdyAmJiAhYWN0dWFsKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnTWlzc2luZyBleHBlY3RlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoIXNob3VsZFRocm93ICYmIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnR290IHVud2FudGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIGlmICgoc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmIGV4cGVjdGVkICYmXG4gICAgICAhZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHx8ICghc2hvdWxkVGhyb3cgJiYgYWN0dWFsKSkge1xuICAgIHRocm93IGFjdHVhbDtcbiAgfVxufVxuXG4vLyAxMS4gRXhwZWN0ZWQgdG8gdGhyb3cgYW4gZXJyb3I6XG4vLyBhc3NlcnQudGhyb3dzKGJsb2NrLCBFcnJvcl9vcHQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnRocm93cyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9lcnJvciwgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzLmFwcGx5KHRoaXMsIFt0cnVlXS5jb25jYXQocFNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xufTtcblxuLy8gRVhURU5TSU9OISBUaGlzIGlzIGFubm95aW5nIHRvIHdyaXRlIG91dHNpZGUgdGhpcyBtb2R1bGUuXG5hc3NlcnQuZG9lc05vdFRocm93ID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cy5hcHBseSh0aGlzLCBbZmFsc2VdLmNvbmNhdChwU2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG59O1xuXG5hc3NlcnQuaWZFcnJvciA9IGZ1bmN0aW9uKGVycikgeyBpZiAoZXJyKSB7dGhyb3cgZXJyO319O1xuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChoYXNPd24uY2FsbChvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiBrZXlzO1xufTtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50UXVldWU7XG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtpXSgpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbn1cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgcXVldWUucHVzaChmdW4pO1xuICAgIGlmICghZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iLCJcbiFmdW5jdGlvbigpe1xuXG5mdW5jdGlvbiBleHRlbmQoZHN0LCBzcmMpe1xuICAgIGZvciAodmFyIGtleSBpbiBzcmMpXG4gICAgICAgIGRzdFtrZXldID0gc3JjW2tleV1cbiAgICByZXR1cm4gc3JjXG59XG4gICAgXG52YXIgU2ltdWxhdGUgPSB7XG4gICAgZXZlbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGV2ZW50TmFtZSl7XG4gICAgICAgIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCkge1xuICAgICAgICAgICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiSFRNTEV2ZW50c1wiKVxuICAgICAgICAgICAgZXZ0LmluaXRFdmVudChldmVudE5hbWUsIHRydWUsIHRydWUgKVxuICAgICAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2dClcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKVxuICAgICAgICAgICAgZWxlbWVudC5maXJlRXZlbnQoJ29uJyArIGV2ZW50TmFtZSxldnQpXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGtleUV2ZW50OiBmdW5jdGlvbihlbGVtZW50LCB0eXBlLCBvcHRpb25zKXtcbiAgICAgICAgdmFyIGV2dCxcbiAgICAgICAgICAgIGUgPSB7XG4gICAgICAgICAgICBidWJibGVzOiB0cnVlLCBjYW5jZWxhYmxlOiB0cnVlLCB2aWV3OiB3aW5kb3csXG4gICAgICAgICAgXHRjdHJsS2V5OiBmYWxzZSwgYWx0S2V5OiBmYWxzZSwgc2hpZnRLZXk6IGZhbHNlLCBtZXRhS2V5OiBmYWxzZSxcbiAgICAgICAgICBcdGtleUNvZGU6IDAsIGNoYXJDb2RlOiAwXG4gICAgICAgIH1cbiAgICAgICAgZXh0ZW5kKGUsIG9wdGlvbnMpXG4gICAgICAgIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCl7XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0tleUV2ZW50cycpXG4gICAgICAgICAgICAgICAgZXZ0LmluaXRLZXlFdmVudChcbiAgICAgICAgICAgICAgICAgICAgdHlwZSwgZS5idWJibGVzLCBlLmNhbmNlbGFibGUsIGUudmlldyxcbiAgICBcdFx0XHRcdGUuY3RybEtleSwgZS5hbHRLZXksIGUuc2hpZnRLZXksIGUubWV0YUtleSxcbiAgICBcdFx0XHRcdGUua2V5Q29kZSwgZS5jaGFyQ29kZSlcbiAgICBcdFx0XHRlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZ0KVxuICAgIFx0XHR9Y2F0Y2goZXJyKXtcbiAgICBcdFx0ICAgIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiRXZlbnRzXCIpXG5cdFx0XHRcdGV2dC5pbml0RXZlbnQodHlwZSwgZS5idWJibGVzLCBlLmNhbmNlbGFibGUpXG5cdFx0XHRcdGV4dGVuZChldnQsIHtcblx0XHRcdFx0ICAgIHZpZXc6IGUudmlldyxcblx0XHRcdFx0XHRjdHJsS2V5OiBlLmN0cmxLZXksIGFsdEtleTogZS5hbHRLZXksXG5cdFx0XHRcdFx0c2hpZnRLZXk6IGUuc2hpZnRLZXksIG1ldGFLZXk6IGUubWV0YUtleSxcblx0XHRcdFx0XHRrZXlDb2RlOiBlLmtleUNvZGUsIGNoYXJDb2RlOiBlLmNoYXJDb2RlXG5cdFx0XHRcdH0pXG5cdFx0XHRcdGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldnQpXG4gICAgXHRcdH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuU2ltdWxhdGUua2V5cHJlc3MgPSBmdW5jdGlvbihlbGVtZW50LCBjaHIpe1xuICAgIHZhciBjaGFyQ29kZSA9IGNoci5jaGFyQ29kZUF0KDApXG4gICAgdGhpcy5rZXlFdmVudChlbGVtZW50LCAna2V5cHJlc3MnLCB7XG4gICAgICAgIGtleUNvZGU6IGNoYXJDb2RlLFxuICAgICAgICBjaGFyQ29kZTogY2hhckNvZGVcbiAgICB9KVxufVxuXG5TaW11bGF0ZS5rZXlkb3duID0gZnVuY3Rpb24oZWxlbWVudCwgY2hyKXtcbiAgICB2YXIgY2hhckNvZGUgPSBjaHIuY2hhckNvZGVBdCgwKVxuICAgIHRoaXMua2V5RXZlbnQoZWxlbWVudCwgJ2tleWRvd24nLCB7XG4gICAgICAgIGtleUNvZGU6IGNoYXJDb2RlLFxuICAgICAgICBjaGFyQ29kZTogY2hhckNvZGVcbiAgICB9KVxufVxuXG5TaW11bGF0ZS5rZXl1cCA9IGZ1bmN0aW9uKGVsZW1lbnQsIGNocil7XG4gICAgdmFyIGNoYXJDb2RlID0gY2hyLmNoYXJDb2RlQXQoMClcbiAgICB0aGlzLmtleUV2ZW50KGVsZW1lbnQsICdrZXl1cCcsIHtcbiAgICAgICAga2V5Q29kZTogY2hhckNvZGUsXG4gICAgICAgIGNoYXJDb2RlOiBjaGFyQ29kZVxuICAgIH0pXG59XG5cbnZhciBldmVudHMgPSBbXG4gICAgJ2NsaWNrJyxcbiAgICAnZm9jdXMnLFxuICAgICdibHVyJyxcbiAgICAnZGJsY2xpY2snLFxuICAgICdpbnB1dCcsXG4gICAgJ2NoYW5nZScsXG4gICAgJ21vdXNlZG93bicsXG4gICAgJ21vdXNlbW92ZScsXG4gICAgJ21vdXNlb3V0JyxcbiAgICAnbW91c2VvdmVyJyxcbiAgICAnbW91c2V1cCcsXG4gICAgJ3Jlc2l6ZScsXG4gICAgJ3Njcm9sbCcsXG4gICAgJ3NlbGVjdCcsXG4gICAgJ3N1Ym1pdCcsXG4gICAgJ2xvYWQnLFxuICAgICd1bmxvYWQnXG5dXG5cbmZvciAodmFyIGkgPSBldmVudHMubGVuZ3RoOyBpLS07KXtcbiAgICB2YXIgZXZlbnQgPSBldmVudHNbaV1cbiAgICBTaW11bGF0ZVtldmVudF0gPSAoZnVuY3Rpb24oZXZ0KXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgICAgICAgICAgdGhpcy5ldmVudChlbGVtZW50LCBldnQpXG4gICAgICAgIH1cbiAgICB9KGV2ZW50KSlcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKXtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNpbXVsYXRlXG59ZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgIHdpbmRvdy5TaW11bGF0ZSA9IFNpbXVsYXRlXG59ZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgIGRlZmluZShmdW5jdGlvbigpeyByZXR1cm4gU2ltdWxhdGUgfSlcbn1cblxufSgpXG4iLCJ3aW5kb3cuY29uc29sZS5kZWJ1ZyA9ICh2KSAtPlxuXG5tb2NoYS5zZXR1cCgnYmRkJylcbm1vY2hhLmdsb2JhbHMoWydfX2ltcG9ydF9fJ10pXG5cbmFzc2VydCA9IGNoYWkuYXNzZXJ0XG5cbnJlcXVpcmUgXCIuL3Rlc3RzL0V2ZW50RW1pdHRlclRlc3RcIlxucmVxdWlyZSBcIi4vdGVzdHMvVXRpbHNUZXN0XCJcbnJlcXVpcmUgXCIuL3Rlc3RzL0Jhc2VDbGFzc1Rlc3RcIlxucmVxdWlyZSBcIi4vdGVzdHMvRnJhbWVUZXN0XCJcbnJlcXVpcmUgXCIuL3Rlc3RzL0xheWVyVGVzdFwiXG5yZXF1aXJlIFwiLi90ZXN0cy9MYXllclN0YXRlc1Rlc3RcIlxucmVxdWlyZSBcIi4vdGVzdHMvVmlkZW9MYXllclRlc3RcIlxucmVxdWlyZSBcIi4vdGVzdHMvQ29tcGF0VGVzdFwiXG5yZXF1aXJlIFwiLi90ZXN0cy9JbXBvcnRlclRlc3RcIlxucmVxdWlyZSBcIi4vdGVzdHMvTGF5ZXJBbmltYXRpb25UZXN0XCJcbnJlcXVpcmUgXCIuL3Rlc3RzL0NvbnRleHRUZXN0XCJcblxuIyBTdGFydCBtb2NoYVxuaWYgd2luZG93Lm1vY2hhUGhhbnRvbUpTXG5cdG1vY2hhUGhhbnRvbUpTLnJ1bigpXG5lbHNlXG5cdG1vY2hhLnJ1bigpXG4iLCJkZXNjcmliZSBcIkJhc2VDbGFzc1wiLCAtPlxuXG5cdHRlc3RQcm9wZXJ0eSA9IChuYW1lLCBmYWxsYmFjaykgLT5cblx0XHRleHBvcnRhYmxlOiB0cnVlXG5cdFx0ZGVmYXVsdDogZmFsbGJhY2tcblx0XHRnZXQ6IC0+IEBfZ2V0UHJvcGVydHlWYWx1ZSBuYW1lXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBfc2V0UHJvcGVydHlWYWx1ZSBuYW1lLCB2YWx1ZVxuXG5cblx0aXQgXCJzaG91bGQgYmUgdW5pcXVlIHBlciBpbnN0YW5jZVwiLCAtPlxuXG5cdFx0Y2xhc3MgVGVzdENsYXNzQSBleHRlbmRzIEZyYW1lci5CYXNlQ2xhc3Ncblx0XHRcdEBkZWZpbmUgXCJ0ZXN0QVwiLCB0ZXN0UHJvcGVydHkgXCJ0ZXN0QVwiLCAxMDBcblxuXHRcdGNsYXNzIFRlc3RDbGFzc0IgZXh0ZW5kcyBGcmFtZXIuQmFzZUNsYXNzXG5cdFx0XHRAZGVmaW5lIFwidGVzdEJcIiwgdGVzdFByb3BlcnR5IFwidGVzdEJcIiwgMTAwXG5cblx0XHRhID0gbmV3IFRlc3RDbGFzc0EoKVxuXHRcdGIgPSBuZXcgVGVzdENsYXNzQigpXG5cblx0XHRhLnByb3BzLnNob3VsZC5lcWwge3Rlc3RBOiAxMDB9XG5cdFx0Yi5wcm9wcy5zaG91bGQuZXFsIHt0ZXN0QjogMTAwfVxuXG5cdGNsYXNzIFRlc3RDbGFzcyBleHRlbmRzIEZyYW1lci5CYXNlQ2xhc3Ncblx0XHRAZGVmaW5lIFwid2lkdGhcIiwgdGVzdFByb3BlcnR5IFwid2lkdGhcIiwgMFxuXHRcdEBkZWZpbmUgXCJoZWlnaHRcIiwgdGVzdFByb3BlcnR5IFwiaGVpZ2h0XCIsIDBcblxuXHRpdCBcInNob3VsZCBzZXQgZGVmYXVsdHNcIiwgLT5cblx0XHRcblx0XHR0ZXN0Q2xhc3MgPSBuZXcgVGVzdENsYXNzKClcblxuXHRcdHRlc3RDbGFzcy53aWR0aC5zaG91bGQuZXF1YWwgMFxuXHRcdHRlc3RDbGFzcy5oZWlnaHQuc2hvdWxkLmVxdWFsIDBcblxuXHRpdCBcInNob3VsZCBzZXQgZGVmYXVsdHMgb24gY29uc3RydWN0aW9uXCIsIC0+XG5cdFx0XG5cdFx0dGVzdENsYXNzID0gbmV3IFRlc3RDbGFzcyB3aWR0aDoxMDAsIGhlaWdodDoxMDBcblxuXHRcdHRlc3RDbGFzcy53aWR0aC5zaG91bGQuZXF1YWwgMTAwXG5cdFx0dGVzdENsYXNzLmhlaWdodC5zaG91bGQuZXF1YWwgMTAwXG5cblx0aXQgXCJzaG91bGQgc2V0IGEgcHJvcGVydHkgdmFsdWVcIiwgLT5cblx0XHRcblx0XHR0ZXN0Q2xhc3MgPSBuZXcgVGVzdENsYXNzKClcblx0XHR0ZXN0Q2xhc3Mud2lkdGggPSA1MDBcblxuXHRcdHRlc3RDbGFzcy53aWR0aC5zaG91bGQuZXF1YWwgNTAwXG5cdFx0dGVzdENsYXNzLmhlaWdodC5zaG91bGQuZXF1YWwgMFxuXG5cdGl0IFwic2hvdWxkIHNldCB0byB6ZXJvXCIsIC0+XG5cblx0XHRjbGFzcyBUZXN0Q2xhc3MyIGV4dGVuZHMgRnJhbWVyLkJhc2VDbGFzc1xuXHRcdFx0QGRlZmluZSBcInRlc3RcIiwgdGVzdFByb3BlcnR5IFwidGVzdFwiLCAxMDBcblxuXHRcdHRlc3RDbGFzcyA9IG5ldyBUZXN0Q2xhc3MyKClcblx0XHR0ZXN0Q2xhc3MudGVzdC5zaG91bGQuZXF1YWwgMTAwXG5cblx0XHR0ZXN0Q2xhc3MudGVzdCA9IDBcblx0XHR0ZXN0Q2xhc3MudGVzdC5zaG91bGQuZXF1YWwgMFxuXG5cdGl0IFwic2hvdWxkIG92ZXJyaWRlIGRlZmF1bHRzXCIsIC0+XG5cblx0XHR0ZXN0Q2xhc3MgPSBuZXcgVGVzdENsYXNzXG5cdFx0XHR3aWR0aDogNTAwXG5cblx0XHR0ZXN0Q2xhc3Mud2lkdGguc2hvdWxkLmVxdWFsIDUwMFxuXHRcdHRlc3RDbGFzcy5oZWlnaHQuc2hvdWxkLmVxdWFsIDBcblxuXHRpdCBcInNob3VsZCBnZXQgcHJvcHNcIiwgLT5cblxuXHRcdHRlc3RDbGFzcyA9IG5ldyBUZXN0Q2xhc3Ncblx0XHRcdHdpZHRoOiA1MDBcblxuXHRcdHRlc3RDbGFzcy5wcm9wcy5zaG91bGQuZXFsXG5cdFx0XHR3aWR0aDogNTAwXG5cdFx0XHRoZWlnaHQ6IDBcblxuXHRpdCBcInNob3VsZCBzZXQgcHJvcHNcIiwgLT5cblxuXHRcdHRlc3RDbGFzcyA9IG5ldyBUZXN0Q2xhc3NcblxuXHRcdHRlc3RDbGFzcy5wcm9wcy5zaG91bGQuZXFsXG5cdFx0XHR3aWR0aDogMFxuXHRcdFx0aGVpZ2h0OiAwXG5cblx0XHR0ZXN0Q2xhc3MucHJvcHMgPSB7d2lkdGg6IDUwMCwgaGVpZ2h0OiA1MDB9XG5cblx0XHR0ZXN0Q2xhc3MucHJvcHMuc2hvdWxkLmVxbFxuXHRcdFx0d2lkdGg6IDUwMFxuXHRcdFx0aGVpZ2h0OiA1MDBcblxuXHRpdCBcInNob3VsZCBoYXZlIGtleXNcIiwgLT5cblxuXHRcdGNsYXNzIFRlc3RDbGFzczMgZXh0ZW5kcyBGcmFtZXIuQmFzZUNsYXNzXG5cdFx0XHRAZGVmaW5lIFwidGVzdEFcIiwgQHNpbXBsZVByb3BlcnR5IFwidGVzdEFcIiwgMTAwXG5cdFx0XHRAZGVmaW5lIFwidGVzdEJcIiwgQHNpbXBsZVByb3BlcnR5IFwidGVzdEJcIiwgMTAwXG5cblx0XHR0ZXN0Q2xhc3MgPSBuZXcgVGVzdENsYXNzMygpXG5cdFx0dGVzdENsYXNzLmtleXMoKS5zaG91bGQuZXFsIFtcInRlc3RBXCIsIFwidGVzdEJcIl1cblxuXHRpdCBcInNob3VsZCBoYXZlIGtleXNcIiwgLT5cblxuXHRcdGNsYXNzIFRlc3RDbGFzczMgZXh0ZW5kcyBGcmFtZXIuQmFzZUNsYXNzXG5cdFx0XHRAZGVmaW5lIFwidGVzdEFcIiwgQHNpbXBsZVByb3BlcnR5IFwidGVzdEFcIiwgMTAwXG5cdFx0XHRAZGVmaW5lIFwidGVzdEJcIiwgQHNpbXBsZVByb3BlcnR5IFwidGVzdEJcIiwgMTAwXG5cblx0XHR0ZXN0Q2xhc3MgPSBuZXcgVGVzdENsYXNzMygpXG5cdFx0dGVzdENsYXNzLmtleXMoKS5zaG91bGQuZXFsIFtcInRlc3RBXCIsIFwidGVzdEJcIl1cblxuXHRpdCBcInNob3VsZCBjcmVhdGUgZ2V0dGVycy9zZXR0ZXJzXCIsIC0+XG5cblx0XHRjbGFzcyBUZXN0Q2xhc3M0IGV4dGVuZHMgRnJhbWVyLkJhc2VDbGFzc1xuXHRcdFx0QGRlZmluZSBcInRlc3RBXCIsIEBzaW1wbGVQcm9wZXJ0eSBcInRlc3RBXCIsIDEwMFxuXG5cdFx0dGVzdENsYXNzID0gbmV3IFRlc3RDbGFzczQoKVxuXHRcdHRlc3RDbGFzcy5zZXRUZXN0QSg1MDApXG5cdFx0dGVzdENsYXNzLmdldFRlc3RBKCkuc2hvdWxkLmVxdWFsIDUwMFxuXHRcdHRlc3RDbGFzcy50ZXN0QS5zaG91bGQuZXF1YWwgNTAwXG5cblx0aXQgXCJzaG91bGQgb3ZlcnJpZGUgZ2V0dGVycy9zZXR0ZXJzXCIsIC0+XG5cblx0XHRjbGFzcyBUZXN0Q2xhc3M1IGV4dGVuZHMgRnJhbWVyLkJhc2VDbGFzc1xuXHRcdFx0QGRlZmluZSBcInRlc3RBXCIsIEBzaW1wbGVQcm9wZXJ0eSBcInRlc3RBXCIsIDEwMFxuXG5cdFx0Y2xhc3MgVGVzdENsYXNzNiBleHRlbmRzIFRlc3RDbGFzczVcblx0XHRcdHNldFRlc3RBOiAodmFsdWUpIC0+XG5cdFx0XHRcdHN1cGVyIHZhbHVlICogMTBcblxuXHRcdHRlc3RDbGFzcyA9IG5ldyBUZXN0Q2xhc3M2KClcblx0XHR0ZXN0Q2xhc3Muc2V0VGVzdEEoNTAwKVxuXHRcdHRlc3RDbGFzcy5nZXRUZXN0QSgpLnNob3VsZC5lcXVhbCA1MDAwXG5cdFx0dGVzdENsYXNzLnRlc3RBLnNob3VsZC5lcXVhbCA1MDAwXG5cblx0aXQgXCJzaG91bGQgd29yayB3aXRoIHByb3h5UHJvcGVydGllc1wiLCAtPlxuXG5cdFx0Y2xhc3MgVGVzdENsYXNzNyBleHRlbmRzIEZyYW1lci5CYXNlQ2xhc3Ncblx0XHRcdEBkZWZpbmUgXCJ0ZXN0QVwiLCBAcHJveHlQcm9wZXJ0eShcInBvb3AuaGVsbG9cIilcblxuXHRcdFx0Y29uc3RydWN0b3I6IC0+XG5cdFx0XHRcdHN1cGVyXG5cblx0XHRcdFx0QHBvb3AgPSB7aGVsbG86MTAwfVxuXG5cdFx0dGVzdENsYXNzID0gbmV3IFRlc3RDbGFzczcoKVxuXHRcdHRlc3RDbGFzcy5wb29wLmhlbGxvLnNob3VsZC5lcXVhbCAxMDBcblx0XHR0ZXN0Q2xhc3MudGVzdEEuc2hvdWxkLmVxdWFsIDEwMFxuXHRcdHRlc3RDbGFzcy50ZXN0QSA9IDIwMFxuXHRcdHRlc3RDbGFzcy5wb29wLmhlbGxvLnNob3VsZC5lcXVhbCAyMDBcblxuIiwiZGVzY3JpYmUgXCJDb21wYXRcIiwgLT5cblx0XG5cdGRlc2NyaWJlIFwiRGVmYXVsdHNcIiwgLT5cblxuXHRcdGl0IFwic2hvdWxkIGNyZWF0ZSB2aWV3c1wiLCAtPlxuXHRcdFx0XG5cdFx0XHR2aWV3ID0gbmV3IFZpZXdcblxuXHRcdFx0dmlldy54LnNob3VsZC5lcXVhbCAwXG5cdFx0XHR2aWV3Lnkuc2hvdWxkLmVxdWFsIDBcblx0XHRcdHZpZXcud2lkdGguc2hvdWxkLmVxdWFsIDEwMFxuXHRcdFx0dmlldy5oZWlnaHQuc2hvdWxkLmVxdWFsIDEwMFxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IHN1cGVydmlld1wiLCAtPlxuXHRcdFx0XG5cdFx0XHR2aWV3QSA9IG5ldyBWaWV3XG5cdFx0XHR2aWV3QiA9IG5ldyBWaWV3XG5cblx0XHRcdHZpZXdCLnN1cGVyVmlldyA9IHZpZXdBXG5cdFx0XHR2aWV3Qi5zdXBlclZpZXcuc2hvdWxkLmVxdWFsIHZpZXdBXG5cdFx0XHR2aWV3Qi5zdXBlckxheWVyLnNob3VsZC5lcXVhbCB2aWV3QVxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IHN1cGVydmlldyBvbiBsYXllclwiLCAtPlxuXHRcdFx0XG5cdFx0XHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRcdGxheWVyQiA9IG5ldyBMYXllclxuXG5cdFx0XHRsYXllckIuc3VwZXJWaWV3ID0gbGF5ZXJBXG5cdFx0XHRsYXllckIuc3VwZXJWaWV3LnNob3VsZC5lcXVhbCBsYXllckFcblx0XHRcdGxheWVyQi5zdXBlckxheWVyLnNob3VsZC5lcXVhbCBsYXllckFcblxuXHRcdGl0IFwic2hvdWxkIHNldCBzdXBlcnZpZXcgb24gY3JlYXRlXCIsIC0+XG5cdFx0XHRcblx0XHRcdHZpZXdBID0gbmV3IFZpZXdcblx0XHRcdHZpZXdCID0gbmV3IFZpZXcgc3VwZXJWaWV3OnZpZXdBXG5cblx0XHRcdHZpZXdCLnN1cGVyVmlldy5zaG91bGQuZXF1YWwgdmlld0Fcblx0XHRcdHZpZXdCLnN1cGVyTGF5ZXIuc2hvdWxkLmVxdWFsIHZpZXdBXG5cblx0XHRpdCBcInNob3VsZCBjcmVhdGUgc2Nyb2xsdmlld1wiLCAtPlxuXHRcdFx0XG5cdFx0XHR2aWV3ID0gbmV3IFNjcm9sbFZpZXdcblx0XHRcdHZpZXcuc2Nyb2xsLnNob3VsZC5lcXVhbCB0cnVlXG5cblxuXHRcdGl0IFwic2hvdWxkIGNyZWF0ZSBpbWFnZXZpZXdcIiwgLT5cblx0XHRcdFxuXHRcdFx0aW1hZ2VQYXRoID0gXCJzdGF0aWMvdGVzdC5wbmdcIlxuXG5cdFx0XHR2aWV3ID0gbmV3IEltYWdlVmlldyBpbWFnZTppbWFnZVBhdGhcblx0XHRcdHZpZXcuaW1hZ2Uuc2hvdWxkLmVxdWFsIGltYWdlUGF0aFxuXG4iLCJhc3NlcnQgPSByZXF1aXJlIFwiYXNzZXJ0XCJcblxuZGVzY3JpYmUgXCJDb250ZXh0XCIsIC0+XG5cblx0ZGVzY3JpYmUgXCJSZXNldFwiLCAtPlxuXG5cdFx0IyBUb2RvOiBldmVudCBjbGVhbnVwXG5cdFx0IyBUb2RvOiBwYXJlbiBsYXllciBvbiBjb250ZXh0IGNsZWFudXBcblxuXHRkZXNjcmliZSBcIkV2ZW50c1wiLCAtPlxuXG5cdFx0aXQgXCJzaG91bGQgZW1pdCByZXNldFwiLCAoY2FsbGJhY2spIC0+XG5cblx0XHRcdGNvbnRleHQgPSBuZXcgRnJhbWVyLkNvbnRleHQobmFtZTpcIlRlc3RcIilcblx0XHRcdGNvbnRleHQub24gXCJyZXNldFwiLCAtPiBjYWxsYmFjaygpXG5cdFx0XHRjb250ZXh0LnJlc2V0KClcblxuXHRcdGl0IFwic2hvdWxkIGVtaXQgbGF5ZXIgY3JlYXRlXCIsIChjYWxsYmFjaykgLT5cblxuXHRcdFx0Y29udGV4dCA9IG5ldyBGcmFtZXIuQ29udGV4dChuYW1lOlwiVGVzdFwiKVxuXHRcdFx0Y29udGV4dC5vbiBcImxheWVyOmNyZWF0ZVwiLCAtPlxuXHRcdFx0XHRjb250ZXh0LmdldExheWVycygpLmxlbmd0aC5zaG91bGQuZXF1YWwgMVxuXHRcdFx0XHRjYWxsYmFjaygpXG5cblx0XHRcdGNvbnRleHQucnVuIC0+XG5cdFx0XHRcdGxheWVyID0gbmV3IExheWVyXG5cblxuXHRcdGl0IFwic2hvdWxkIGVtaXQgbGF5ZXIgZGVzdHJveVwiLCAoY2FsbGJhY2spIC0+XG5cblx0XHRcdGNvbnRleHQgPSBuZXcgRnJhbWVyLkNvbnRleHQobmFtZTpcIlRlc3RcIilcblxuXHRcdFx0Y29udGV4dC5vbiBcImxheWVyOmNyZWF0ZVwiLCAtPlxuXHRcdFx0XHRjb250ZXh0LmdldExheWVycygpLmxlbmd0aC5zaG91bGQuZXF1YWwgMVxuXG5cdFx0XHRjb250ZXh0Lm9uIFwibGF5ZXI6ZGVzdHJveVwiLCAtPlxuXHRcdFx0XHRjb250ZXh0LmdldExheWVycygpLmxlbmd0aC5zaG91bGQuZXF1YWwgMFxuXHRcdFx0XHRjYWxsYmFjaygpXG5cblx0XHRcdGNvbnRleHQucnVuIC0+XG5cdFx0XHRcdGxheWVyID0gbmV3IExheWVyXG5cdFx0XHRcdGxheWVyLmRlc3Ryb3koKVxuXG5cdFx0aXQgXCJzaG91bGQga2VlcCBsYXllciBpZCBjb3VudCBwZXIgY29udGV4dFwiLCAtPlxuXG5cdFx0XHRjb250ZXh0ID0gbmV3IEZyYW1lci5Db250ZXh0KG5hbWU6XCJUZXN0XCIpXG5cblx0XHRcdGNvbnRleHQucnVuIC0+XG5cdFx0XHRcdGxheWVyID0gbmV3IExheWVyXG5cdFx0XHRcdGxheWVyLmlkLnNob3VsZC5lcXVhbCAxXG5cdFx0XHRcdGxheWVyID0gbmV3IExheWVyXG5cdFx0XHRcdGxheWVyLmlkLnNob3VsZC5lcXVhbCAyXG5cblx0XHRcdGNvbnRleHQucmVzZXQoKVxuXG5cdFx0XHRjb250ZXh0LnJ1biAtPlxuXHRcdFx0XHRsYXllciA9IG5ldyBMYXllclxuXHRcdFx0XHRsYXllci5pZC5zaG91bGQuZXF1YWwgMVxuXHRcdFx0XHRsYXllciA9IG5ldyBMYXllclxuXHRcdFx0XHRsYXllci5pZC5zaG91bGQuZXF1YWwgMlxuXG4iLCJkZXNjcmliZSBcIkV2ZW50RW1pdHRlclwiLCAtPlxuXHRcblx0aXQgXCJzaG91bGQgbGlzdGVuXCIsIC0+XG5cdFx0XG5cdFx0dGVzdGVyID0gbmV3IEZyYW1lci5FdmVudEVtaXR0ZXJcblx0XHRjb3VudCA9IDBcblx0XHRoYW5kbGVyID0gLT4gY291bnQrK1xuXG5cdFx0dGVzdGVyLm9uIFwidGVzdFwiLCBoYW5kbGVyXG5cdFx0dGVzdGVyLmVtaXQgXCJ0ZXN0XCJcblxuXHRcdGNvdW50LnNob3VsZC5lcXVhbCAxXG5cblx0aXQgXCJzaG91bGQgc3RvcCBsaXN0ZW5pbmdcIiwgLT5cblx0XHRcblx0XHR0ZXN0ZXIgPSBuZXcgRnJhbWVyLkV2ZW50RW1pdHRlclxuXHRcdGNvdW50ID0gMFxuXHRcdGhhbmRsZXIgPSAtPiBjb3VudCsrXG5cblx0XHR0ZXN0ZXIub24gXCJ0ZXN0XCIsIGhhbmRsZXJcblx0XHR0ZXN0ZXIuZW1pdCBcInRlc3RcIlxuXG5cdFx0Y291bnQuc2hvdWxkLmVxdWFsIDFcblxuXHRcdHRlc3Rlci5vZmYgXCJ0ZXN0XCIsIGhhbmRsZXJcblx0XHR0ZXN0ZXIuZW1pdCBcInRlc3RcIlxuXG5cdFx0Y291bnQuc2hvdWxkLmVxdWFsIDFcblxuXHRpdCBcInNob3VsZCBsaXN0ZW4gb25jZVwiLCAtPlxuXHRcdFxuXHRcdHRlc3RlciA9IG5ldyBGcmFtZXIuRXZlbnRFbWl0dGVyXG5cdFx0Y291bnQgPSAwXG5cdFx0aGFuZGxlciA9IC0+IGNvdW50KytcblxuXHRcdHRlc3Rlci5vbmNlIFwidGVzdFwiLCBoYW5kbGVyXG5cdFx0dGVzdGVyLmVtaXQgXCJ0ZXN0XCJcblx0XHR0ZXN0ZXIuZW1pdCBcInRlc3RcIlxuXHRcdHRlc3Rlci5lbWl0IFwidGVzdFwiXG5cblx0XHRjb3VudC5zaG91bGQuZXF1YWwgMSIsImRlc2NyaWJlIFwiRnJhbWVcIiwgLT5cblx0XHRcblx0ZGVzY3JpYmUgXCJEZWZhdWx0c1wiLCAtPlxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IGRlZmF1bHRzXCIsIC0+XG5cblx0XHRcdGZyYW1lID0gbmV3IEZyYW1lXG5cblx0XHRcdGZyYW1lLnguc2hvdWxkLmVxdWFsIDBcblx0XHRcdGZyYW1lLnkuc2hvdWxkLmVxdWFsIDBcblx0XHRcdGZyYW1lLndpZHRoLnNob3VsZC5lcXVhbCAwXG5cdFx0XHRmcmFtZS5oZWlnaHQuc2hvdWxkLmVxdWFsIDBcblxuXHRcdGl0IFwic2hvdWxkIHNldCBvbiBjcmVhdGVcIiwgLT5cblxuXHRcdFx0ZnJhbWUgPSBuZXcgRnJhbWUgeDoxMDAsIHk6MTAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDBcblxuXHRcdFx0ZnJhbWUueC5zaG91bGQuZXF1YWwgMTAwXG5cdFx0XHRmcmFtZS55LnNob3VsZC5lcXVhbCAxMDBcblx0XHRcdGZyYW1lLndpZHRoLnNob3VsZC5lcXVhbCAxMDBcblx0XHRcdGZyYW1lLmhlaWdodC5zaG91bGQuZXF1YWwgMTAwXG5cblxuXHRcdGl0IFwic2hvdWxkIHNldCBtaW5YXCIsIC0+XG5cdFx0XHRmcmFtZSA9IG5ldyBGcmFtZSBtaW5YOjIwMCwgeToxMDAsIHdpZHRoOjEwMCwgaGVpZ2h0OjEwMFxuXHRcdFx0ZnJhbWUueC5zaG91bGQuZXF1YWwgMjAwXG5cblx0XHRpdCBcInNob3VsZCBzZXQgbWlkWFwiLCAtPlxuXHRcdFx0ZnJhbWUgPSBuZXcgRnJhbWUgbWlkWDoyMDAsIHk6MTAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDBcblx0XHRcdGZyYW1lLnguc2hvdWxkLmVxdWFsIDE1MFxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IG1heFhcIiwgLT5cblx0XHRcdGZyYW1lID0gbmV3IEZyYW1lIG1heFg6MjAwLCB5OjEwMCwgd2lkdGg6MTAwLCBoZWlnaHQ6MTAwXG5cdFx0XHRmcmFtZS54LnNob3VsZC5lcXVhbCAxMDBcblxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IG1pbllcIiwgLT5cblx0XHRcdGZyYW1lID0gbmV3IEZyYW1lIHg6MTAwLCBtaW5ZOjIwMCwgd2lkdGg6MTAwLCBoZWlnaHQ6MTAwXG5cdFx0XHRmcmFtZS55LnNob3VsZC5lcXVhbCAyMDBcblxuXHRcdGl0IFwic2hvdWxkIHNldCBtaWRZXCIsIC0+XG5cdFx0XHRmcmFtZSA9IG5ldyBGcmFtZSB4OjEwMCwgbWlkWToyMDAsIHdpZHRoOjEwMCwgaGVpZ2h0OjEwMFxuXHRcdFx0ZnJhbWUueS5zaG91bGQuZXF1YWwgMTUwXG5cblx0XHRpdCBcInNob3VsZCBzZXQgbWF4WVwiLCAtPlxuXHRcdFx0ZnJhbWUgPSBuZXcgRnJhbWUgeDoxMDAsIG1heFk6MjAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDBcblx0XHRcdGZyYW1lLnkuc2hvdWxkLmVxdWFsIDEwMFxuXG5cbiIsImFzc2VydCA9IHJlcXVpcmUgXCJhc3NlcnRcIlxuXG5kZXNjcmliZSBcIkV4dGVybmFsRG9jdW1lbnRcIiwgLT5cblxuXHRjb21wYXJlRG9jdW1lbnQgPSAobmFtZSkgLT5cblxuXHRcdHBhdGggPSBcIi4uL3N0YXRpYy9FeHRlcm5hbERvY3VtZW50XCJcblxuXHRcdGxheWVycyA9IEZyYW1lci5JbXBvcnRlci5sb2FkIFV0aWxzLnBhdGhKb2luKHBhdGgsIG5hbWUpXG5cdFx0XG5cdFx0ZGF0YUEgPSBGcmFtZXIuVXRpbHMuZG9tTG9hZEpTT05TeW5jIFV0aWxzLnBhdGhKb2luKHBhdGgsIFwiI3tuYW1lfS5vdXQuanNvblwiKVxuXHRcdGRhdGFCID0ge31cblxuXHRcdGZvciBsYXllck5hbWUsIGxheWVyIG9mIGxheWVyc1xuXHRcdFx0ZGF0YUJbbGF5ZXJOYW1lXSA9XG5cdFx0XHRcdGZyYW1lOiBsYXllci5mcmFtZVxuXHRcdFx0XHRzdXBlckxheWVyTmFtZTogbGF5ZXIuc3VwZXJMYXllcj8ubGF5ZXJOYW1lXG5cdFx0XHRcdHN1YkxheWVyTmFtZXM6IGxheWVyLnN1YkxheWVycy5tYXAgKGwpIC0+IGwubmFtZVxuXG5cdFx0anNvbkEgPSBKU09OLnN0cmluZ2lmeSBkYXRhQSwgbnVsbCwgXCJcXHRcIlxuXHRcdGpzb25CID0gSlNPTi5zdHJpbmdpZnkgZGF0YUIsIG51bGwsIFwiXFx0XCJcblxuXHRcdGlmIGpzb25BICE9IGpzb25CXG5cdFx0XHQjIFVuY29tbWVudCB0aGlzIHRvIHNlZSBjdXJyZW50IGR1bXBcblx0XHRcdGNvbnNvbGUubG9nIFwiXCJcblx0XHRcdGNvbnNvbGUubG9nIFwiTmFtZTogI3tuYW1lfVwiXG5cdFx0XHRjb25zb2xlLmxvZyBqc29uQlxuXG5cdFx0YXNzZXJ0LmVxdWFsIGpzb25BLCBqc29uQlxuXG5cdGlmIG5vdCBVdGlscy5pc0Nocm9tZSgpXG5cdFx0ZGVzY3JpYmUgXCJFeHRlcm5hbCBGaWxlc1wiLCAtPlxuXG5cdFx0XHRpdCBcIkFuZHJvaWRcIiwgLT5cblx0XHRcdFx0Y29tcGFyZURvY3VtZW50IFwiQW5kcm9pZFwiXG5cblx0XHRcdGl0IFwiU3F1YXJlXCIsIC0+XG5cdFx0XHRcdGNvbXBhcmVEb2N1bWVudCBcIlNxdWFyZVwiXG5cblx0XHRcdGl0IFwiVGVzdFwiLCAtPlxuXHRcdFx0XHRjb21wYXJlRG9jdW1lbnQgXCJUZXN0XCJcblxuXHRkZXNjcmliZSBcIlNoYWR5IEhhY2tzXCIsIC0+XG5cblx0XHRpdCBcIlNob3VsZCB3b3JrIG9uIENocm9tZVwiLCAtPlxuXG5cdFx0XHQjIFRoaXMgaXMgdGVycmlibGUsIGJ1dCBiZXR0ZXIgdGhhbiBoYXZpbmcgcGVvcGxlIGxvYWRcblx0XHRcdCMgQ2hyb21lIHdpdGggc29tZSBjb21tYW5kIGxpbmUgb3B0aW9uLlxuXHRcdFx0XG5cdFx0XHR3aW5kb3cuX19pbXBvcnRlZF9fID89IHt9XG5cdFx0XHR3aW5kb3cuX19pbXBvcnRlZF9fW1wiQW5kcm9pZC9sYXllcnMuanNvbi5qc1wiXSA9IFwiaGVsbG9cIlxuXG5cdFx0XHRpbXBvcnRlciA9IG5ldyBGcmFtZXIuSW1wb3J0ZXIgXCJpbXBvcnRlZC9BbmRyb2lkXCJcblxuXHRcdFx0ZGF0YSA9IGltcG9ydGVyLl9sb2FkbGF5ZXJJbmZvKClcblx0XHRcdGRhdGEuc2hvdWxkLmVxdWFsIFwiaGVsbG9cIlxuXG5cbiIsIkFuaW1hdGlvblRpbWUgPSAwLjA1XG5BbmltYXRpb25Qcm9wZXJ0aWVzID0gW1wieFwiLCBcInlcIiwgXCJtaWRZXCIsIFwicm90YXRpb25cIl1cblxuZGVzY3JpYmUgXCJMYXllckFuaW1hdGlvblwiLCAtPlxuXG5cdGRlc2NyaWJlIFwiRGVmYXVsdHNcIiwgLT5cblxuXHRcdGl0IFwic2hvdWxkIHVzZSBkZWZhdWx0c1wiLCAtPlxuXG5cdFx0XHRGcmFtZXIuRGVmYXVsdHMuQW5pbWF0aW9uID1cblx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDEsMiwzKVwiXG5cblx0XHRcdGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb25cblx0XHRcdFx0bGF5ZXI6IG5ldyBMYXllcigpXG5cdFx0XHRcdHByb3BlcnRpZXM6IHt4OjUwfVxuXG5cdFx0XHRhbmltYXRpb24ub3B0aW9ucy5jdXJ2ZS5zaG91bGQuZXF1YWwgXCJzcHJpbmcoMSwyLDMpXCJcblxuXHRcdFx0RnJhbWVyLnJlc2V0RGVmYXVsdHMoKVxuXG5cdFx0aXQgXCJzaG91bGQgdXNlIGxpbmVhclwiLCAtPlxuXG5cdFx0XHQjIFdlIHNob3VsZG4ndCBjaGFuZ2UgdGhlIGxpbmVhciBkZWZhdWx0LCBwZW9wbGUgcmVseSBvbiBpdFxuXG5cdFx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRcdGxheWVyOiBuZXcgTGF5ZXIoKVxuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eDo1MH1cblxuXHRcdFx0YW5pbWF0aW9uLm9wdGlvbnMuY3VydmUuc2hvdWxkLmVxdWFsIFwibGluZWFyXCJcblx0XHRcdGFuaW1hdGlvbi5vcHRpb25zLnRpbWUuc2hvdWxkLmVxdWFsIDFcblxuXHRkZXNjcmliZSBcIlByb3BlcnRpZXNcIiwgLT5cblxuXHRcdEFuaW1hdGlvblByb3BlcnRpZXMubWFwIChwKSAtPlxuXG5cdFx0XHRpdCBcInNob3VsZCBhbmltYXRlIHByb3BlcnR5ICN7cH1cIiwgKGRvbmUpIC0+XG5cblx0XHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIoKVxuXG5cdFx0XHRcdHByb3BlcnRpZXMgPSB7fVxuXHRcdFx0XHRwcm9wZXJ0aWVzW3BdID0gMTAwXG5cblx0XHRcdFx0bGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRcdHByb3BlcnRpZXM6IHByb3BlcnRpZXNcblx0XHRcdFx0XHRjdXJ2ZTogXCJsaW5lYXJcIlxuXHRcdFx0XHRcdHRpbWU6IEFuaW1hdGlvblRpbWVcblxuXHRcdFx0XHRsYXllci5vbiBcImVuZFwiLCAtPlxuXHRcdFx0XHRcdGxheWVyW3BdLnNob3VsZC5lcXVhbCAxMDBcblx0XHRcdFx0XHRkb25lKClcblxuXHRcdFx0aXQgXCJzaG91bGQgYW5pbWF0ZSBwcm9wZXJ0eSAje3B9IHdpdGggcG9zaXRpdmUgb2Zmc2V0IGZyb20gY3VycmVudCB2YWx1ZVwiLCAoZG9uZSkgLT5cblxuXHRcdFx0XHRsYXllciA9IG5ldyBMYXllcigpXG5cdFx0XHRcdGxheWVyW3BdID0gNTBcblxuXHRcdFx0XHRwcm9wZXJ0aWVzID0ge31cblx0XHRcdFx0cHJvcGVydGllc1twXSA9ICcrPTUwJ1xuXG5cdFx0XHRcdGxheWVyLmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzXG5cdFx0XHRcdFx0Y3VydmU6IFwibGluZWFyXCJcblx0XHRcdFx0XHR0aW1lOiBBbmltYXRpb25UaW1lXG5cblx0XHRcdFx0bGF5ZXIub24gXCJlbmRcIiwgLT5cblx0XHRcdFx0XHRsYXllcltwXS5zaG91bGQuZXF1YWwgMTAwXG5cdFx0XHRcdFx0ZG9uZSgpXG5cblx0XHRcdGl0IFwic2hvdWxkIGFuaW1hdGUgcHJvcGVydHkgI3twfSB3aXRoIG5lZ2F0aXZlIG9mZnNldCBmcm9tIGN1cnJlbnQgdmFsdWVcIiwgKGRvbmUpIC0+XG5cblx0XHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIoKVxuXHRcdFx0XHRsYXllcltwXSA9IDUwXG5cblx0XHRcdFx0cHJvcGVydGllcyA9IHt9XG5cdFx0XHRcdHByb3BlcnRpZXNbcF0gPSAnKz01MCdcblxuXHRcdFx0XHRsYXllci5hbmltYXRlXG5cdFx0XHRcdFx0cHJvcGVydGllczogcHJvcGVydGllc1xuXHRcdFx0XHRcdGN1cnZlOiBcImxpbmVhclwiXG5cdFx0XHRcdFx0dGltZTogQW5pbWF0aW9uVGltZVxuXG5cdFx0XHRcdGxheWVyLm9uIFwiZW5kXCIsIC0+XG5cdFx0XHRcdFx0bGF5ZXJbcF0uc2hvdWxkLmVxdWFsIDEwMFxuXHRcdFx0XHRcdGRvbmUoKVxuXG5cdFx0aXQgXCJzaG91bGQgYW5pbWF0ZSBkeW5hbWljIHByb3BlcnRpZXNcIiwgKGRvbmUpIC0+XG5cblx0XHRcdGxheWVyID0gbmV3IExheWVyKClcblxuXHRcdFx0bGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHNjYWxlOiAtPiBsYXllci5zY2FsZSArIDFcblx0XHRcdFx0Y3VydmU6IFwibGluZWFyXCJcblx0XHRcdFx0dGltZTogQW5pbWF0aW9uVGltZVxuXG5cdFx0XHRsYXllci5vbiBcImVuZFwiLCAtPlxuXHRcdFx0XHRsYXllci5zY2FsZS5zaG91bGQuZXF1YWwgMlxuXHRcdFx0XHRkb25lKClcblxuXG5cblx0ZGVzY3JpYmUgXCJCYXNpY1wiLCAtPlxuXG5cdFx0aXQgXCJzaG91bGQgc3RvcFwiLCAoZG9uZSkgLT5cblxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIoKVxuXG5cdFx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRcdGxheWVyOiBsYXllclxuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eDo1MH1cblx0XHRcdFx0Y3VydmU6IFwibGluZWFyXCJcblx0XHRcdFx0dGltZTogMC41XG5cblx0XHRcdGFuaW1hdGlvbi5zdGFydCgpXG5cblx0XHRcdFV0aWxzLmRlbGF5IGFuaW1hdGlvbi5vcHRpb25zLnRpbWUgLyAyLjAsIC0+XG5cdFx0XHRcdGFuaW1hdGlvbi5zdG9wKClcblx0XHRcdFx0bGF5ZXIueC5zaG91bGQuYmUud2l0aGluKDEwLCA0MClcblx0XHRcdFx0ZG9uZSgpXG5cblx0XHRpdCBcInNob3VsZCBjYW5jZWwgcHJldmlvdXMgYW5pbWF0aW9uIGZvciB0aGUgc2FtZSBwcm9wZXJ0eVwiLCAtPlxuXG5cdFx0XHRsYXllciA9IG5ldyBMYXllcigpXG5cblx0XHRcdGFuaW1hdGlvbkEgPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRcdGxheWVyOiBsYXllclxuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eDo1MH1cblx0XHRcdFx0Y3VydmU6IFwibGluZWFyXCJcblx0XHRcdFx0dGltZTogMC41XG5cblx0XHRcdGFuaW1hdGlvbkIgPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRcdGxheWVyOiBsYXllclxuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eDo1MH1cblx0XHRcdFx0Y3VydmU6IFwibGluZWFyXCJcblx0XHRcdFx0dGltZTogMC41XG5cblx0XHRcdHN0b3BwZWQgPSBmYWxzZVxuXHRcdFx0YW5pbWF0aW9uQS5vbiBcInN0b3BcIiwgLT4gc3RvcHBlZCA9IHRydWVcblxuXHRcdFx0YW5pbWF0aW9uQS5zdGFydCgpLnNob3VsZC5lcXVhbCB0cnVlXG5cdFx0XHRhbmltYXRpb25CLnN0YXJ0KCkuc2hvdWxkLmVxdWFsIHRydWVcblxuXHRcdFx0c3RvcHBlZC5zaG91bGQuZXF1YWwgdHJ1ZVxuXG5cdGRlc2NyaWJlIFwiQ29udGV4dFwiLCAtPlxuXG5cdFx0aXQgXCJzaG91bGQgbGlzdCBydW5uaW5nIGFuaW1hdGlvbnNcIiwgLT5cblxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIoKVxuXHRcdFx0YW5pbWF0aW9uID0gbGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eDogMTAwfVxuXHRcdFx0XHR0aW1lOiAwLjVcblxuXHRcdFx0KGFuaW1hdGlvbiBpbiBsYXllci5hbmltYXRpb25zKCkpLnNob3VsZC5iZS50cnVlXG5cdFx0XHRsYXllci5hbmltYXRlU3RvcCgpXG5cdFx0XHQoYW5pbWF0aW9uIGluIGxheWVyLmFuaW1hdGlvbnMoKSkuc2hvdWxkLmJlLmZhbHNlXG5cdFx0XHRcblx0XHRpdCBcInNob3VsZCBsaXN0IHJ1bm5pbmcgYW5pbWF0aW9ucyBjb3JyZWN0bHlcIiwgKGRvbmUpIC0+XG5cblx0XHRcdGxheWVyID0gbmV3IExheWVyKClcblx0XHRcdFxuXHRcdFx0YW5pbWF0aW9uID0gbGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eDogMTAwfVxuXHRcdFx0XHR0aW1lOiAwLjVcblxuXHRcdFx0Y291bnQgPSAwXG5cblx0XHRcdHRlc3QgPSAtPlxuXHRcdFx0XHRsYXllci5hbmltYXRpb25zKCkubGVuZ3RoLnNob3VsZC5lcXVhbCAwXG5cdFx0XHRcdGNvdW50KytcblxuXHRcdFx0XHRpZiBjb3VudCBpcyAyXG5cdFx0XHRcdFx0ZG9uZSgpXG5cblx0XHRcdGFuaW1hdGlvbi5vbiBcImVuZFwiLCB0ZXN0XG5cdFx0XHRhbmltYXRpb24ub24gXCJzdG9wXCIsIHRlc3RcblxuXHRcdGl0IFwic2hvdWxkIHRlbGwgeW91IGlmIGFuaW1hdGlvbnMgYXJlIHJ1bm5pbmdcIiwgLT5cblxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIoKVxuXHRcdFx0YW5pbWF0aW9uID0gbGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eDogMTAwfVxuXHRcdFx0XHR0aW1lOiAwLjVcblxuXHRcdFx0bGF5ZXIuaXNBbmltYXRpbmcuc2hvdWxkLmVxdWFsKHRydWUpXG5cdFx0XHRsYXllci5hbmltYXRlU3RvcCgpXG5cdFx0XHRsYXllci5pc0FuaW1hdGluZy5zaG91bGQuZXF1YWwoZmFsc2UpXG5cdFx0XHRcblxuXHRkZXNjcmliZSBcIkV2ZW50c1wiLCAtPlxuXG5cdFx0aXQgXCJzaG91bGQgdGhyb3cgc3RhcnRcIiwgKGRvbmUpIC0+XG5cblx0XHRcdGxheWVyID0gbmV3IExheWVyKClcblxuXHRcdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0XHRsYXllcjogbGF5ZXJcblx0XHRcdFx0cHJvcGVydGllczoge3g6NTB9XG5cdFx0XHRcdGN1cnZlOiBcImxpbmVhclwiXG5cdFx0XHRcdHRpbWU6IEFuaW1hdGlvblRpbWVcblxuXHRcdFx0Y291bnQgPSAwXG5cblx0XHRcdGFuaW1hdGlvbi5vbiBcInN0YXJ0XCIsIC0+IGNvdW50Kytcblx0XHRcdGxheWVyLm9uIFwic3RhcnRcIiwgLT4gY291bnQrK1xuXG5cdFx0XHRhbmltYXRpb24uc3RhcnQoKVxuXG5cdFx0XHRsYXllci5vbiBcImVuZFwiLCAtPlxuXHRcdFx0XHRjb3VudC5zaG91bGQuZXF1YWwgMlxuXHRcdFx0XHRkb25lKClcblxuXHRcdGl0IFwic2hvdWxkIHRocm93IGVuZFwiLCAoZG9uZSkgLT5cblxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIoKVxuXG5cdFx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRcdGxheWVyOiBsYXllclxuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eDo1MH1cblx0XHRcdFx0Y3VydmU6IFwibGluZWFyXCJcblx0XHRcdFx0dGltZTogQW5pbWF0aW9uVGltZVxuXG5cdFx0XHRjb3VudCA9IDBcblx0XHRcdHRlc3QgPSAtPiBjb3VudCsrOyBkb25lKCkgaWYgY291bnQgPT0gMlxuXG5cdFx0XHRhbmltYXRpb24ub24gXCJlbmRcIiwgdGVzdFxuXHRcdFx0bGF5ZXIub24gXCJlbmRcIiwgdGVzdFxuXG5cdFx0XHRhbmltYXRpb24uc3RhcnQoKVxuXG5cblx0XHRpdCBcInNob3VsZCB0aHJvdyBzdG9wXCIsIChkb25lKSAtPlxuXG5cdFx0XHRsYXllciA9IG5ldyBMYXllcigpXG5cblx0XHRcdGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb25cblx0XHRcdFx0bGF5ZXI6IGxheWVyXG5cdFx0XHRcdHByb3BlcnRpZXM6IHt4OjUwfVxuXHRcdFx0XHRjdXJ2ZTogXCJsaW5lYXJcIlxuXHRcdFx0XHR0aW1lOiBBbmltYXRpb25UaW1lICogMlxuXG5cdFx0XHRjb3VudCA9IDBcblx0XHRcdHRlc3QgPSAtPiBjb3VudCsrOyBkb25lKCkgaWYgY291bnQgPT0gMlxuXG5cdFx0XHRhbmltYXRpb24ub24gXCJzdG9wXCIsIHRlc3Rcblx0XHRcdGxheWVyLm9uIFwic3RvcFwiLCB0ZXN0XG5cblx0XHRcdGFuaW1hdGlvbi5zdGFydCgpXG5cblx0XHRcdFV0aWxzLmRlbGF5IEFuaW1hdGlvblRpbWUsIC0+XG5cdFx0XHRcdGFuaW1hdGlvbi5zdG9wKClcblxuXHRkZXNjcmliZSBcIkRlbGF5XCIsIC0+XG5cblx0XHRpdCBcInNob3VsZCBzdGFydCBhZnRlciBhIHdoaWxlXCIsIChkb25lKSAtPlxuXG5cdFx0XHRsYXllciA9IG5ldyBMYXllcigpXG5cblx0XHRcdGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb25cblx0XHRcdFx0bGF5ZXI6IGxheWVyXG5cdFx0XHRcdHByb3BlcnRpZXM6IHt4OjUwfVxuXHRcdFx0XHRjdXJ2ZTogXCJsaW5lYXJcIlxuXHRcdFx0XHR0aW1lOiBBbmltYXRpb25UaW1lXG5cdFx0XHRcdGRlbGF5OiBBbmltYXRpb25UaW1lXG5cblx0XHRcdGFuaW1hdGlvbi5zdGFydCgpXG5cblx0XHRcdFV0aWxzLmRlbGF5IEFuaW1hdGlvblRpbWUsIC0+XG5cdFx0XHRcdGxheWVyLnguc2hvdWxkLmJlLndpdGhpbigwLCAxKVxuXHRcdFx0XHRVdGlscy5kZWxheSBBbmltYXRpb25UaW1lLCAtPlxuXHRcdFx0XHRcdGxheWVyLnguc2hvdWxkLmJlLndpdGhpbigzMCwgNTApXG5cdFx0XHRcdFx0ZG9uZSgpXG5cblx0ZGVzY3JpYmUgXCJSZXBlYXRcIiwgLT5cblxuXHRcdGl0IFwic2hvdWxkIHN0YXJ0IHJlcGVhdGVkbHlcIiwgKGRvbmUpIC0+XG5cblx0XHRcdGxheWVyID0gbmV3IExheWVyKClcblxuXHRcdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0XHRsYXllcjogbGF5ZXJcblx0XHRcdFx0cHJvcGVydGllczoge3g6IC0+IGxheWVyLnggKyAxMDB9XG5cdFx0XHRcdGN1cnZlOiBcImxpbmVhclwiXG5cdFx0XHRcdHRpbWU6IEFuaW1hdGlvblRpbWVcblx0XHRcdFx0cmVwZWF0OiA1XG5cblx0XHRcdGFuaW1hdGlvbi5zdGFydCgpXG5cblx0XHRcdGNvdW50ID0gMFxuXG5cdFx0XHRsYXllci5vbiBcImVuZFwiLCAtPlxuXHRcdFx0XHRjb3VudCsrXG5cdFx0XHRcdGlmIGNvdW50IGlzIGFuaW1hdGlvbi5vcHRpb25zLnJlcGVhdFxuXHRcdFx0XHRcdGRvbmUoKVxuXG5cblx0ZGVzY3JpYmUgXCJBbmltYXRpb25Mb29wXCIsIC0+XG5cblx0XHRpdCBcInNob3VsZCBvbmx5IHN0b3Agd2hlbiBhbGwgYW5pbWF0aW9ucyBhcmUgZG9uZVwiLCAoZG9uZSkgLT5cblxuXHRcdFx0bGF5ZXJBID0gbmV3IExheWVyIHdpZHRoOjgwLCBoZWlnaHQ6ODBcblx0XHRcdGxheWVyQS5uYW1lID0gXCJsYXllckFcIlxuXHRcdFx0bGF5ZXJBLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczoge3k6MzAwfVxuXHRcdFx0XHR0aW1lOiAyICogQW5pbWF0aW9uVGltZVxuXG5cdFx0XHRsYXllckIgPSBuZXcgTGF5ZXIgd2lkdGg6ODAsIGhlaWdodDo4MCwgeDoxMDAsIGJhY2tncm91bmRDb2xvcjpcInJlZFwiXG5cdFx0XHRsYXllckIubmFtZSA9IFwibGF5ZXJCXCJcblx0XHRcdGxheWVyQi5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6IHt5OjMwMH1cblx0XHRcdFx0dGltZTogNSAqIEFuaW1hdGlvblRpbWVcblxuXHRcdFx0bGF5ZXJDID0gbmV3IExheWVyIHdpZHRoOjgwLCBoZWlnaHQ6ODAsIHg6MjAwLCBiYWNrZ3JvdW5kQ29sb3I6XCJvcmFuZ2VcIlxuXHRcdFx0bGF5ZXJDLm5hbWUgPSBcImxheWVyQ1wiXG5cdFx0XHRsYXllckMuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eTozMDB9XG5cdFx0XHRcdHRpbWU6IDIgKiBBbmltYXRpb25UaW1lXG5cdFx0XHRcdGN1cnZlOiBcImN1YmljLWJlemllclwiXG5cblx0XHRcdHJlYWR5TGF5ZXJzID0gW11cblxuXHRcdFx0cmVhZHkgPSAoYW5pbWF0aW9uLCBsYXllcikgLT5cblx0XHRcdFx0XG5cdFx0XHRcdChsYXllciBpbiByZWFkeUxheWVycykuc2hvdWxkLmVxdWFsIGZhbHNlXG5cblx0XHRcdFx0cmVhZHlMYXllcnMucHVzaCBsYXllclxuXG5cdFx0XHRcdGlmIHJlYWR5TGF5ZXJzLmxlbmd0aCBpcyAzXG5cdFx0XHRcdFx0bGF5ZXJBLnkuc2hvdWxkLmVxdWFsIDMwMFxuXHRcdFx0XHRcdGxheWVyQi55LnNob3VsZC5lcXVhbCAzMDBcblx0XHRcdFx0XHRsYXllckMueS5zaG91bGQuZXF1YWwgMzAwXG5cdFx0XHRcdFx0ZG9uZSgpXG5cblx0XHRcdGxheWVyQS5vbiBcImVuZFwiLCByZWFkeVxuXHRcdFx0bGF5ZXJCLm9uIFwiZW5kXCIsIHJlYWR5XG5cdFx0XHRsYXllckMub24gXCJlbmRcIiwgcmVhZHlcblxuXG5cdGRlc2NyaWJlIFwiQW5pbWF0aW9uXCIsIC0+XG5cblx0XHRiZWZvcmVFYWNoIC0+XG5cdFx0XHRAbGF5ZXIgPSBuZXcgTGF5ZXIgeDogMCwgeTogMCwgd2lkdGg6IDgwLCBoZWlnaHQ6IDgwXG5cblx0XHRkZXNjcmliZSBcIlBhcnNpbmcgQW5pbWF0aW9uIE9wdGlvbnNcIiwgLT5cblxuXHRcdFx0ZGVzY3JpYmUgXCJCZXppZXJDdXJ2ZUFuaW1hdG9yXCIsIC0+XG5cblx0XHRcdFx0aXQgXCJzaG91bGQgY3JlYXRlIGFuaW1hdGlvbiB3aXRoIGJlemllciBjdXJ2ZSBkZWZpbmVkIGJ5IHZhbHVlcyBhcnJheSBhbmQgdGltZSBpbiBjdXJ2ZU9wdGlvbnNcIiwgLT5cblx0XHRcdFx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRcdFx0XHRsYXllcjogQGxheWVyXG5cdFx0XHRcdFx0XHRwcm9wZXJ0aWVzOiB7IHg6IDEwMCB9XG5cdFx0XHRcdFx0XHRjdXJ2ZTogJ2N1YmljLWJlemllcidcblx0XHRcdFx0XHRcdGN1cnZlT3B0aW9uczpcblx0XHRcdFx0XHRcdFx0dGltZTogMlxuXHRcdFx0XHRcdFx0XHR2YWx1ZXM6IFswLCAwLCAwLjU4LCAxXVxuXG5cdFx0XHRcdFx0YW5pbWF0aW9uLnN0YXJ0KClcblx0XHRcdFx0XHRhbmltYXRpb24uX2FuaW1hdG9yLm9wdGlvbnMudGltZS5zaG91bGQuZXF1YWwgMlxuXHRcdFx0XHRcdGFuaW1hdGlvbi5fYW5pbWF0b3Iub3B0aW9ucy52YWx1ZXMuc2hvdWxkLmVxbCBbMCwgMCwgLjU4LCAxXVxuXG5cdFx0XHRcdGl0IFwic2hvdWxkIGNyZWF0ZSBhbmltYXRpb24gd2l0aCBiZXppZXIgY3VydmUgZGVmaW5lZCBieSBuYW1lZCBiZXppZXIgY3VydmUgaW4gdmFsdWVzIGFuZCB0aW1lIGluIGN1cnZlT3B0aW9uc1wiLCAtPlxuXHRcdFx0XHRcdGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb25cblx0XHRcdFx0XHRcdGxheWVyOiBAbGF5ZXJcblx0XHRcdFx0XHRcdHByb3BlcnRpZXM6IHsgeDogMTAwIH1cblx0XHRcdFx0XHRcdGN1cnZlOiAnY3ViaWMtYmV6aWVyJ1xuXHRcdFx0XHRcdFx0Y3VydmVPcHRpb25zOlxuXHRcdFx0XHRcdFx0XHR0aW1lOiAyXG5cdFx0XHRcdFx0XHRcdHZhbHVlczogJ2Vhc2Utb3V0J1xuXG5cdFx0XHRcdFx0YW5pbWF0aW9uLnN0YXJ0KClcblx0XHRcdFx0XHRhbmltYXRpb24uX2FuaW1hdG9yLm9wdGlvbnMudGltZS5zaG91bGQuZXF1YWwgMlxuXHRcdFx0XHRcdGFuaW1hdGlvbi5fYW5pbWF0b3Iub3B0aW9ucy52YWx1ZXMuc2hvdWxkLmVxbCBbMCwgMCwgLjU4LCAxXVxuXG5cdFx0XHRcdGl0IFwic2hvdWxkIGNyZWF0ZSBhbmltYXRpb24gd2l0aCBuYW1lZCBiZXppZXIgY3VydmVcIiwgLT5cblx0XHRcdFx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRcdFx0XHRsYXllcjogQGxheWVyXG5cdFx0XHRcdFx0XHRwcm9wZXJ0aWVzOiB7IHg6IDEwMCB9XG5cdFx0XHRcdFx0XHRjdXJ2ZTogJ2N1YmljLWJlemllcidcblx0XHRcdFx0XHRcdGN1cnZlT3B0aW9uczogJ2Vhc2Utb3V0J1xuXG5cdFx0XHRcdFx0YW5pbWF0aW9uLnN0YXJ0KClcblx0XHRcdFx0XHRhbmltYXRpb24uX2FuaW1hdG9yLm9wdGlvbnMudGltZS5zaG91bGQuZXF1YWwgMVxuXHRcdFx0XHRcdGFuaW1hdGlvbi5fYW5pbWF0b3Iub3B0aW9ucy52YWx1ZXMuc2hvdWxkLmVxbCBbMCwgMCwgLjU4LCAxXVxuXG5cdFx0XHRcdGl0IFwic2hvdWxkIGNyZWF0ZSBhbmltYXRpb24gd2l0aCBuYW1lZCBiZXppZXIgY3VydmUgYW5kIHRpbWVcIiwgLT5cblx0XHRcdFx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRcdFx0XHRsYXllcjogQGxheWVyXG5cdFx0XHRcdFx0XHRwcm9wZXJ0aWVzOiB7IHg6IDEwMCB9XG5cdFx0XHRcdFx0XHR0aW1lOiAyXG5cdFx0XHRcdFx0XHRjdXJ2ZTogJ2N1YmljLWJlemllcidcblx0XHRcdFx0XHRcdGN1cnZlT3B0aW9uczogJ2Vhc2Utb3V0J1xuXG5cdFx0XHRcdFx0YW5pbWF0aW9uLnN0YXJ0KClcblx0XHRcdFx0XHRhbmltYXRpb24uX2FuaW1hdG9yLm9wdGlvbnMudGltZS5zaG91bGQuZXF1YWwgMlxuXHRcdFx0XHRcdGFuaW1hdGlvbi5fYW5pbWF0b3Iub3B0aW9ucy52YWx1ZXMuc2hvdWxkLmVxbCBbMCwgMCwgLjU4LCAxXVxuXG5cdFx0XHRcdGl0IFwic2hvdWxkIGNyZWF0ZSBhbmltYXRpb24gd2l0aCBiZXppZXIgY3VydmUgZnVuY3Rpb24gcGFzc2VkIGluIGFzIGEgc3RyaW5nIGFuZCB0aW1lXCIsIC0+XG5cdFx0XHRcdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0XHRcdFx0bGF5ZXI6IEBsYXllclxuXHRcdFx0XHRcdFx0cHJvcGVydGllczogeyB4OiAxMDAgfVxuXHRcdFx0XHRcdFx0dGltZTogMlxuXHRcdFx0XHRcdFx0Y3VydmU6ICdjdWJpYy1iZXppZXIoMCwgMCwgMC41OCwgMSknXG5cblx0XHRcdFx0XHRhbmltYXRpb24uc3RhcnQoKVxuXHRcdFx0XHRcdGFuaW1hdGlvbi5fYW5pbWF0b3Iub3B0aW9ucy50aW1lLnNob3VsZC5lcXVhbCAyXG5cdFx0XHRcdFx0YW5pbWF0aW9uLl9hbmltYXRvci5vcHRpb25zLnZhbHVlcy5zaG91bGQuZXFsIFswLCAwLCAuNTgsIDFdXG5cblx0XHRcdFx0aXQgXCJzaG91bGQgY3JlYXRlIGFuaW1hdGlvbiB3aXRoIGJlemllciBjdXJ2ZSBkZWZpbmVkIGJ5IGFuIGFycmF5IGFuZCB0aW1lXCIsIC0+XG5cdFx0XHRcdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0XHRcdFx0bGF5ZXI6IEBsYXllclxuXHRcdFx0XHRcdFx0cHJvcGVydGllczogeyB4OiAxMDAgfVxuXHRcdFx0XHRcdFx0dGltZTogMlxuXHRcdFx0XHRcdFx0Y3VydmU6ICdjdWJpYy1iZXppZXInXG5cdFx0XHRcdFx0XHRjdXJ2ZU9wdGlvbnM6IFswLCAwLCAwLjU4LCAxXVxuXG5cdFx0XHRcdFx0YW5pbWF0aW9uLnN0YXJ0KClcblx0XHRcdFx0XHRhbmltYXRpb24uX2FuaW1hdG9yLm9wdGlvbnMudGltZS5zaG91bGQuZXF1YWwgMlxuXHRcdFx0XHRcdGFuaW1hdGlvbi5fYW5pbWF0b3Iub3B0aW9ucy52YWx1ZXMuc2hvdWxkLmVxbCBbMCwgMCwgLjU4LCAxXVxuXG5cdFx0ZGVzY3JpYmUgXCJMaW5lYXJBbmltYXRvclwiLCAtPlxuXG5cdFx0XHRpdCBcInNob3VsZCBjcmVhdGUgbGluZWFyIGFuaW1hdGlvbiB3aXRoIHRpbWUgZGVmaW5lZCBvdXRzaWRlIG9mIGN1cnZlT3B0aW9uc1wiLCAtPlxuXHRcdFx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRcdFx0bGF5ZXI6IEBsYXllclxuXHRcdFx0XHRcdHByb3BlcnRpZXM6IHsgeDogMTAwIH1cblx0XHRcdFx0XHRjdXJ2ZTogJ2xpbmVhcidcblx0XHRcdFx0XHR0aW1lOiAyXG5cblx0XHRcdFx0YW5pbWF0aW9uLnN0YXJ0KClcblx0XHRcdFx0YW5pbWF0aW9uLl9hbmltYXRvci5vcHRpb25zLnRpbWUuc2hvdWxkLmVxdWFsIDJcblxuXHRcdFx0aXQgXCJzaG91bGQgY3JlYXRlIGxpbmVhciBhbmltYXRpb24gd2l0aCB0aW1lIGRlZmluZWQgaW5zaWRlIGN1cnZlT3B0aW9uc1wiLCAtPlxuXHRcdFx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRcdFx0bGF5ZXI6IEBsYXllclxuXHRcdFx0XHRcdHByb3BlcnRpZXM6IHsgeDogMTAwIH1cblx0XHRcdFx0XHRjdXJ2ZTogJ2xpbmVhcidcblx0XHRcdFx0XHRjdXJ2ZU9wdGlvbnM6XG5cdFx0XHRcdFx0XHR0aW1lOiAyXG5cblx0XHRcdFx0YW5pbWF0aW9uLnN0YXJ0KClcblx0XHRcdFx0YW5pbWF0aW9uLl9hbmltYXRvci5vcHRpb25zLnRpbWUuc2hvdWxkLmVxdWFsIDJcbiIsImRlc2NyaWJlIFwiTGF5ZXJTdGF0ZXNcIiwgLT5cblx0XG5cdGRlc2NyaWJlIFwiRXZlbnRzXCIsIC0+XG5cblx0XHRiZWZvcmVFYWNoIC0+XG5cdFx0XHRAbGF5ZXIgPSBuZXcgTGF5ZXIoKVxuXHRcdFx0QGxheWVyLnN0YXRlcy5hZGQoXCJhXCIsIHt4OjEwMCwgeToxMDB9KVxuXHRcdFx0QGxheWVyLnN0YXRlcy5hZGQoXCJiXCIsIHt4OjIwMCwgeToyMDB9KVxuXG5cdFx0aXQgXCJzaG91bGQgZW1pdCB3aWxsU3dpdGNoIHdoZW4gc3dpdGNoaW5nXCIsIChkb25lKSAtPlxuXHRcdFx0XG5cdFx0XHR0ZXN0ID0gKHByZXZpb3VzLCBjdXJyZW50LCBzdGF0ZXMpID0+XG5cdFx0XHRcdHByZXZpb3VzLnNob3VsZC5lcXVhbCAnZGVmYXVsdCdcblx0XHRcdFx0Y3VycmVudC5zaG91bGQuZXF1YWwgJ2EnXG5cdFx0XHRcdEBsYXllci5zdGF0ZXMuc3RhdGUuc2hvdWxkLmVxdWFsICdkZWZhdWx0J1xuXHRcdFx0XHRkb25lKClcblxuXHRcdFx0QGxheWVyLnN0YXRlcy5vbiAnd2lsbFN3aXRjaCcsIHRlc3Rcblx0XHRcdEBsYXllci5zdGF0ZXMuc3dpdGNoSW5zdGFudCAnYSdcblxuXHRcdGl0IFwic2hvdWxkIGVtaXQgZGlkU3dpdGNoIHdoZW4gc3dpdGNoaW5nXCIsIChkb25lKSAtPlxuXHRcdFx0XG5cdFx0XHR0ZXN0ID0gKHByZXZpb3VzLCBjdXJyZW50LCBzdGF0ZXMpID0+XG5cdFx0XHRcdHByZXZpb3VzLnNob3VsZC5lcXVhbCAnZGVmYXVsdCdcblx0XHRcdFx0Y3VycmVudC5zaG91bGQuZXF1YWwgJ2EnXG5cdFx0XHRcdEBsYXllci5zdGF0ZXMuc3RhdGUuc2hvdWxkLmVxdWFsICdhJ1xuXHRcdFx0XHRkb25lKClcblxuXHRcdFx0QGxheWVyLnN0YXRlcy5vbiAnZGlkU3dpdGNoJywgdGVzdFxuXHRcdFx0QGxheWVyLnN0YXRlcy5zd2l0Y2hJbnN0YW50ICdhJ1xuXG5cblx0ZGVzY3JpYmUgXCJEZWZhdWx0c1wiLCAtPlxuXHRcdFxuXHRcdGl0IFwic2hvdWxkIHNldCBkZWZhdWx0c1wiLCAtPlxuXG5cdFx0XHRsYXllciA9IG5ldyBMYXllclxuXHRcdFx0bGF5ZXIuc3RhdGVzLmFkZCBcInRlc3RcIiwge3g6MTIzfVxuXHRcdFx0bGF5ZXIuc3RhdGVzLnN3aXRjaCBcInRlc3RcIlxuXG5cdFx0XHRsYXllci5zdGF0ZXMuX2FuaW1hdGlvbi5vcHRpb25zLmN1cnZlLnNob3VsZC5lcXVhbCBGcmFtZXIuRGVmYXVsdHMuQW5pbWF0aW9uLmN1cnZlXG5cblx0XHRcdEZyYW1lci5EZWZhdWx0cy5BbmltYXRpb24gPVxuXHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoMSwgMiwgMylcIlxuXG5cdFx0XHRsYXllciA9IG5ldyBMYXllclxuXHRcdFx0bGF5ZXIuc3RhdGVzLmFkZCBcInRlc3RcIiwge3g6NDU2fVxuXHRcdFx0bGF5ZXIuc3RhdGVzLnN3aXRjaCBcInRlc3RcIlxuXG5cdFx0XHRsYXllci5zdGF0ZXMuX2FuaW1hdGlvbi5vcHRpb25zLmN1cnZlLnNob3VsZC5lcXVhbCBcInNwcmluZygxLCAyLCAzKVwiXG5cblx0XHRcdEZyYW1lci5yZXNldERlZmF1bHRzKClcblxuXG5cblx0ZGVzY3JpYmUgXCJTd2l0Y2hcIiwgLT5cblxuXHRcdGl0IFwic2hvdWxkIHN3aXRjaCBpbnN0YW50XCIsIC0+XG5cblx0XHRcdGxheWVyID0gbmV3IExheWVyXG5cdFx0XHRsYXllci5zdGF0ZXMuYWRkXG5cdFx0XHRcdHN0YXRlQToge3g6MTIzfVxuXHRcdFx0XHRzdGF0ZUI6IHt5OjEyM31cblxuXHRcdFx0bGF5ZXIuc3RhdGVzLnN3aXRjaEluc3RhbnQgXCJzdGF0ZUFcIlxuXHRcdFx0bGF5ZXIuc3RhdGVzLmN1cnJlbnQuc2hvdWxkLmVxdWFsIFwic3RhdGVBXCJcblx0XHRcdGxheWVyLnguc2hvdWxkLmVxdWFsIDEyM1xuXG5cdFx0XHRsYXllci5zdGF0ZXMuc3dpdGNoSW5zdGFudCBcInN0YXRlQlwiXG5cdFx0XHRsYXllci5zdGF0ZXMuY3VycmVudC5zaG91bGQuZXF1YWwgXCJzdGF0ZUJcIlxuXHRcdFx0bGF5ZXIueS5zaG91bGQuZXF1YWwgMTIzXG5cblxuXHRkZXNjcmliZSBcIlByb3BlcnRpZXNcIiwgLT5cblxuXHRcdGl0IFwic2hvdWxkIHNldCBzY3JvbGwgcHJvcGVydHlcIiwgLT5cblxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGxheWVyLnN0YXRlcy5hZGRcblx0XHRcdFx0c3RhdGVBOiB7c2Nyb2xsOnRydWV9XG5cdFx0XHRcdHN0YXRlQjoge3Njcm9sbDpmYWxzZX1cblxuXHRcdFx0bGF5ZXIuc3RhdGVzLnN3aXRjaEluc3RhbnQgXCJzdGF0ZUFcIlxuXHRcdFx0bGF5ZXIuc2Nyb2xsLnNob3VsZC5lcXVhbCB0cnVlXG5cblx0XHRcdGxheWVyLnN0YXRlcy5zd2l0Y2hJbnN0YW50IFwic3RhdGVCXCJcblx0XHRcdGxheWVyLnNjcm9sbC5zaG91bGQuZXF1YWwgZmFsc2VcblxuXHRcdFx0bGF5ZXIuc3RhdGVzLnN3aXRjaEluc3RhbnQgXCJzdGF0ZUFcIlxuXHRcdFx0bGF5ZXIuc2Nyb2xsLnNob3VsZC5lcXVhbCB0cnVlXG5cblx0XHRpdCBcInNob3VsZCBzZXQgbm9uIG51bWVyaWMgcHJvcGVydGllcyB3aXRoIGFuaW1hdGlvblwiLCAoZG9uZSkgLT5cblxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGxheWVyLnN0YXRlcy5hZGRcblx0XHRcdFx0c3RhdGVBOiB7c2Nyb2xsOnRydWUsIGJhY2tncm91bmRDb2xvcjpcInJlZFwifVxuXG5cdFx0XHRsYXllci5zY3JvbGwuc2hvdWxkLmVxdWFsIGZhbHNlXG5cblx0XHRcdGxheWVyLnN0YXRlcy5vbiBFdmVudHMuU3RhdGVEaWRTd2l0Y2gsIC0+XG5cdFx0XHRcdGxheWVyLnNjcm9sbC5zaG91bGQuZXF1YWwgdHJ1ZVxuXHRcdFx0XHRsYXllci5iYWNrZ3JvdW5kQ29sb3Iuc2hvdWxkLmVxdWFsIFwicmVkXCJcblx0XHRcdFx0ZG9uZSgpXG5cblx0XHRcdGxheWVyLnN0YXRlcy5zd2l0Y2ggXCJzdGF0ZUFcIlxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IG5vbiBhbmQgbnVtZXJpYyBwcm9wZXJ0aWVzIHdpdGggYW5pbWF0aW9uXCIsIChkb25lKSAtPlxuXG5cdFx0XHRsYXllciA9IG5ldyBMYXllclxuXHRcdFx0bGF5ZXIuc3RhdGVzLmFkZFxuXHRcdFx0XHRzdGF0ZUE6IHt4OjIwMCwgYmFja2dyb3VuZENvbG9yOlwicmVkXCJ9XG5cblx0XHRcdCMgbGF5ZXIuc2Nyb2xsLnNob3VsZC5lcXVhbCBmYWxzZVxuXHRcdFx0bGF5ZXIueC5zaG91bGQuZXF1YWwgMFxuXG5cdFx0XHRsYXllci5zdGF0ZXMub24gRXZlbnRzLlN0YXRlRGlkU3dpdGNoLCAtPlxuXHRcdFx0XHQjIGxheWVyLnNjcm9sbC5zaG91bGQuZXF1YWwgdHJ1ZVxuXHRcdFx0XHRsYXllci54LnNob3VsZC5lcXVhbCAyMDBcblx0XHRcdFx0bGF5ZXIuYmFja2dyb3VuZENvbG9yLnNob3VsZC5lcXVhbCA9IFwicmVkXCJcblx0XHRcdFx0ZG9uZSgpXG5cblx0XHRcdGxheWVyLnN0YXRlcy5zd2l0Y2ggXCJzdGF0ZUFcIiwge2N1cnZlOlwibGluZWFyXCIsIHRpbWU6MC4xfVxuXG5cdFx0XHRcbiIsImFzc2VydCA9IHJlcXVpcmUgXCJhc3NlcnRcIlxuXG5zaW11bGF0ZSA9IHJlcXVpcmUgXCJzaW11bGF0ZVwiXG5cbmRlc2NyaWJlIFwiTGF5ZXJcIiwgLT5cblxuXHQjIGFmdGVyRWFjaCAtPlxuXHQjIFx0VXRpbHMuY2xlYXJBbGwoKVxuXG5cdCMgYmVmb3JlRWFjaCAtPlxuXHQjIFx0RnJhbWVyLlV0aWxzLnJlc2V0KClcblxuXHRkZXNjcmliZSBcIkRlZmF1bHRzXCIsIC0+XG5cblx0XHRpdCBcInNob3VsZCBzZXQgZGVmYXVsdHNcIiwgLT5cblx0XHRcdFxuXHRcdFx0RnJhbWVyLkRlZmF1bHRzID1cblx0XHRcdFx0TGF5ZXI6XG5cdFx0XHRcdFx0d2lkdGg6IDIwMFxuXHRcdFx0XHRcdGhlaWdodDogMjAwXG5cdFx0XHRcdFx0XG5cdFx0XHRsYXllciA9IG5ldyBMYXllcigpXG5cdFx0XHRcblx0XHRcdGxheWVyLndpZHRoLnNob3VsZC5lcXVhbCAyMDBcblx0XHRcdGxheWVyLmhlaWdodC5zaG91bGQuZXF1YWwgMjAwXG5cblx0XHRcdEZyYW1lci5yZXNldERlZmF1bHRzKClcblxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIoKVxuXHRcdFx0XG5cdFx0XHRsYXllci53aWR0aC5zaG91bGQuZXF1YWwgMTAwXG5cdFx0XHRsYXllci5oZWlnaHQuc2hvdWxkLmVxdWFsIDEwMFxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IGRlZmF1bHQgYmFja2dyb3VuZCBjb2xvclwiLCAtPlxuXHRcdFx0XG5cdFx0XHRGcmFtZXIuRGVmYXVsdHMgPVxuXHRcdFx0XHRMYXllcjpcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmVkXCJcblx0XHRcdFx0XHRcblx0XHRcdGxheWVyID0gbmV3IExheWVyKClcblx0XHRcdFxuXHRcdFx0bGF5ZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yLnNob3VsZC5lcXVhbCBcInJlZFwiXG5cdFx0XHQjbGF5ZXIuYmFja2dyb3VuZENvbG9yLnNob3VsZC5lcXVhbCBcInJlZFwiXG5cblxuXHRcdFx0RnJhbWVyLnJlc2V0RGVmYXVsdHMoKVxuXHRcdFxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IGRlZmF1bHRzIHdpdGggb3ZlcnJpZGVcIiwgLT5cblx0XHRcdFxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIgeDo1MCwgeTo1MFxuXHRcdFx0bGF5ZXIueC5zaG91bGQuZXF1YWwgNTBcblx0XHRcdGxheWVyLnguc2hvdWxkLmVxdWFsIDUwXG5cblxuXG5cdGRlc2NyaWJlIFwiUHJvcGVydGllc1wiLCAtPlxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IGRlZmF1bHRzXCIsIC0+XG5cdFx0XHRcblx0XHRcdGxheWVyID0gbmV3IExheWVyKClcblx0XHRcdFxuXHRcdFx0bGF5ZXIueC5zaG91bGQuZXF1YWwgMFxuXHRcdFx0bGF5ZXIueS5zaG91bGQuZXF1YWwgMFxuXHRcdFx0bGF5ZXIuei5zaG91bGQuZXF1YWwgMFxuXHRcdFx0XG5cdFx0XHRsYXllci53aWR0aC5zaG91bGQuZXF1YWwgMTAwXG5cdFx0XHRsYXllci5oZWlnaHQuc2hvdWxkLmVxdWFsIDEwMFxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IHdpZHRoXCIsIC0+XG5cdFx0XHRcblx0XHRcdGxheWVyID0gbmV3IExheWVyIHdpZHRoOjIwMFxuXG5cdFx0XHRsYXllci53aWR0aC5zaG91bGQuZXF1YWwgMjAwXG5cdFx0XHRsYXllci5zdHlsZS53aWR0aC5zaG91bGQuZXF1YWwgXCIyMDBweFwiXG5cblx0XHRpdCBcInNob3VsZCBzZXQgeCBhbmQgeVwiLCAtPlxuXHRcdFx0XG5cdFx0XHRsYXllciA9IG5ldyBMYXllclxuXHRcdFx0XG5cdFx0XHRsYXllci54ID0gMTAwXG5cdFx0XHRsYXllci54LnNob3VsZC5lcXVhbCAxMDBcblx0XHRcdGxheWVyLnkgPSA1MFxuXHRcdFx0bGF5ZXIueS5zaG91bGQuZXF1YWwgNTBcblx0XHRcdFxuXHRcdFx0IyBsYXllci5zdHlsZS53ZWJraXRUcmFuc2Zvcm0uc2hvdWxkLmVxdWFsIFwibWF0cml4KDEsIDAsIDAsIDEsIDEwMCwgMClcIlxuXHRcdFx0bGF5ZXIuc3R5bGUud2Via2l0VHJhbnNmb3JtLnNob3VsZC5lcXVhbCBcInRyYW5zbGF0ZTNkKDEwMHB4LCA1MHB4LCAwcHgpIHNjYWxlKDEpIHNjYWxlM2QoMSwgMSwgMSkgc2tldygwZGVnLCAwZGVnKSBza2V3WCgwZGVnKSBza2V3WSgwZGVnKSByb3RhdGVYKDBkZWcpIHJvdGF0ZVkoMGRlZykgcm90YXRlWigwZGVnKVwiXG5cdFx0XHRcblx0XHRpdCBcInNob3VsZCBzZXQgc2NhbGVcIiwgLT5cblx0XHRcdFxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXJcblxuXHRcdFx0bGF5ZXIuc2NhbGVYID0gMTAwXG5cdFx0XHRsYXllci5zY2FsZVkgPSAxMDBcblx0XHRcdGxheWVyLnNjYWxlWiA9IDEwMFxuXG5cdFx0XHQjIGxheWVyLnN0eWxlLndlYmtpdFRyYW5zZm9ybS5zaG91bGQuZXF1YWwgXCJtYXRyaXgoMSwgMCwgMCwgMSwgMTAwLCA1MClcIlxuXHRcdFx0bGF5ZXIuc3R5bGUud2Via2l0VHJhbnNmb3JtLnNob3VsZC5lcXVhbCBcInRyYW5zbGF0ZTNkKDBweCwgMHB4LCAwcHgpIHNjYWxlKDEpIHNjYWxlM2QoMTAwLCAxMDAsIDEwMCkgc2tldygwZGVnLCAwZGVnKSBza2V3WCgwZGVnKSBza2V3WSgwZGVnKSByb3RhdGVYKDBkZWcpIHJvdGF0ZVkoMGRlZykgcm90YXRlWigwZGVnKVwiXG5cblx0XHRpdCBcInNob3VsZCBzZXQgb3JpZ2luXCIsIC0+XG5cdFx0XHRcblx0XHRcdGxheWVyID0gbmV3IExheWVyXG5cblx0XHRcdGxheWVyLm9yaWdpblggPSAwLjFcblx0XHRcdGxheWVyLm9yaWdpblkgPSAwLjJcblxuXHRcdFx0aWYgVXRpbHMuaXNDaHJvbWUoKVxuXHRcdFx0XHRsYXllci5zdHlsZS53ZWJraXRUcmFuc2Zvcm1PcmlnaW4uc2hvdWxkLmVxdWFsIFwiMTAlIDIwJSAwcHhcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRsYXllci5zdHlsZS53ZWJraXRUcmFuc2Zvcm1PcmlnaW4uc2hvdWxkLmVxdWFsIFwiMTAlIDIwJVwiXG5cblx0XHRcdGxheWVyLm9yaWdpblggPSAwLjVcblx0XHRcdGxheWVyLm9yaWdpblkgPSAwLjVcblxuXHRcdFx0aWYgVXRpbHMuaXNDaHJvbWUoKVxuXHRcdFx0XHRsYXllci5zdHlsZS53ZWJraXRUcmFuc2Zvcm1PcmlnaW4uc2hvdWxkLmVxdWFsIFwiNTAlIDUwJSAwcHhcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRsYXllci5zdHlsZS53ZWJraXRUcmFuc2Zvcm1PcmlnaW4uc2hvdWxkLmVxdWFsIFwiNTAlIDUwJVwiXG5cblx0XHRpdCBcInNob3VsZCBzZXQgbG9jYWwgaW1hZ2VcIiwgLT5cblx0XG5cdFx0XHRpbWFnZVBhdGggPSBcInN0YXRpYy90ZXN0LnBuZ1wiXHRcdFx0XG5cdFx0XHRsYXllciA9IG5ldyBMYXllclxuXG5cdFx0XHRsYXllci5pbWFnZSA9IGltYWdlUGF0aFxuXHRcdFx0bGF5ZXIuaW1hZ2Uuc2hvdWxkLmVxdWFsIGltYWdlUGF0aFxuXG5cdFx0XHRsYXllci5zdHlsZVtcImJhY2tncm91bmQtaW1hZ2VcIl0uaW5kZXhPZihpbWFnZVBhdGgpLnNob3VsZC5ub3QuZXF1YWwoLTEpXG5cdFx0XHQjIGxheWVyLnN0eWxlW1wiYmFja2dyb3VuZC1pbWFnZVwiXS5zaG91bGQubWF0Y2ggXCJmaWxlOi8vXCJcblx0XHRcdCMgbGF5ZXIuc3R5bGVbXCJiYWNrZ3JvdW5kLWltYWdlXCJdLnNob3VsZC5tYXRjaCBcIj9ub2NhY2hlPVwiXG5cblx0XHRcdGxheWVyLmNvbXB1dGVkU3R5bGUoKVtcImJhY2tncm91bmQtc2l6ZVwiXS5zaG91bGQuZXF1YWwgXCJjb3ZlclwiXG5cdFx0XHRsYXllci5jb21wdXRlZFN0eWxlKClbXCJiYWNrZ3JvdW5kLXJlcGVhdFwiXS5zaG91bGQuZXF1YWwgXCJuby1yZXBlYXRcIlxuXG5cdFx0XHRsYXllci5wcm9wcy5pbWFnZS5zaG91bGQuZXF1YWwgaW1hZ2VQYXRoXG5cblx0XHRpdCBcInNob3VsZCBzZXQgaW1hZ2VcIiwgLT5cblx0XHRcdGltYWdlUGF0aCA9IFwic3RhdGljL3Rlc3QucG5nXCJcdFxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIgaW1hZ2U6aW1hZ2VQYXRoXG5cdFx0XHRsYXllci5pbWFnZS5zaG91bGQuZXF1YWwgaW1hZ2VQYXRoXG5cblx0XHRpdCBcInNob3VsZCB1bnNldCBpbWFnZSB3aXRoIG51bGxcIiwgLT5cblx0XHRcdGxheWVyID0gbmV3IExheWVyIGltYWdlOlwic3RhdGljL3Rlc3QucG5nXCJcblx0XHRcdGxheWVyLmltYWdlID0gbnVsbFxuXHRcdFx0bGF5ZXIuaW1hZ2Uuc2hvdWxkLmVxdWFsIFwiXCJcblxuXHRcdGl0IFwic2hvdWxkIHVuc2V0IGltYWdlIHdpdGggZW1wdHkgc3RyaW5nXCIsIC0+XG5cdFx0XHRsYXllciA9IG5ldyBMYXllciBpbWFnZTpcInN0YXRpYy90ZXN0LnBuZ1wiXG5cdFx0XHRsYXllci5pbWFnZSA9IFwiXCJcblx0XHRcdGxheWVyLmltYWdlLnNob3VsZC5lcXVhbCBcIlwiXG5cblx0XHRpdCBcInNob3VsZCB0ZXN0IGltYWdlIHByb3BlcnR5IHR5cGVcIiwgLT5cblx0XHRcdGYgPSAtPlxuXHRcdFx0XHRsYXllciA9IG5ldyBMYXllclxuXHRcdFx0XHRsYXllci5pbWFnZSA9IHt9XG5cdFx0XHRmLnNob3VsZC50aHJvdygpXG5cblx0XHRpdCBcInNob3VsZCBzZXQgbmFtZSBvbiBjcmVhdGVcIiwgLT5cblx0XHRcdGxheWVyID0gbmV3IExheWVyIG5hbWU6XCJUZXN0XCJcblx0XHRcdGxheWVyLm5hbWUuc2hvdWxkLmVxdWFsIFwiVGVzdFwiXG5cdFx0XHRsYXllci5fZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpLnNob3VsZC5lcXVhbCBcIlRlc3RcIlxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IG5hbWUgYWZ0ZXIgY3JlYXRlXCIsIC0+XG5cdFx0XHRsYXllciA9IG5ldyBMYXllclxuXHRcdFx0bGF5ZXIubmFtZSA9IFwiVGVzdFwiXG5cdFx0XHRsYXllci5uYW1lLnNob3VsZC5lcXVhbCBcIlRlc3RcIlxuXHRcdFx0bGF5ZXIuX2VsZW1lbnQuZ2V0QXR0cmlidXRlKFwibmFtZVwiKS5zaG91bGQuZXF1YWwgXCJUZXN0XCJcblxuXHRcdCMgaXQgXCJzaG91bGQgaGFuZGxlIGJhY2tncm91bmQgY29sb3Igd2l0aCBpbWFnZVwiLCAtPlxuXHRcdFx0XG5cdFx0IyBcdCMgV2Ugd2FudCB0aGUgYmFja2dyb3VuZCBjb2xvciB0byBiZSB0aGVyZSB1bnRpbCBhbiBpbWFnZXNcblx0XHQjIFx0IyBpcyBzZXQgVU5MRVNTIHdlIHNldCBhbm90aGVyIGJhY2tncm91bmRDb2xvciBleHBsaWNpdGx5XG5cblx0XHQjIFx0aW1hZ2VQYXRoID0gXCJzdGF0aWMvdGVzdC5wbmdcIlx0XG5cblx0XHQjIFx0bGF5ZXIgPSBuZXcgTGF5ZXIgaW1hZ2U6aW1hZ2VQYXRoXG5cdFx0IyBcdGxheWVyLmJhY2tncm91bmRDb2xvci5zaG91bGQuZXF1YWwgXCJcIlxuXG5cdFx0IyBcdGxheWVyID0gbmV3IExheWVyXG5cdFx0IyBcdGxheWVyLmltYWdlID0gaW1hZ2VQYXRoXG5cdFx0IyBcdGxheWVyLmJhY2tncm91bmRDb2xvci5zaG91bGQuZXF1YWwgXCJcIlxuXG5cdFx0IyBcdGxheWVyID0gbmV3IExheWVyIGJhY2tncm91bmRDb2xvcjpcInJnYmEoMjU1LDAsMCwxKVwiXG5cdFx0IyBcdGxheWVyLmltYWdlID0gaW1hZ2VQYXRoXG5cdFx0IyBcdGxheWVyLmJhY2tncm91bmRDb2xvciA9IFwicmdiYSgyNTUsMCwwLDEpXCJcblx0XHQjIFx0bGF5ZXIuYmFja2dyb3VuZENvbG9yLnNob3VsZC5ub3QuZXF1YWwgXCJcIlxuXG5cdFx0IyBcdGxheWVyID0gbmV3IExheWVyIGJhY2tncm91bmRDb2xvcjpcInJlZFwiXG5cdFx0IyBcdGxheWVyLmltYWdlID0gaW1hZ2VQYXRoXG5cdFx0IyBcdGxheWVyLmJhY2tncm91bmRDb2xvci5zaG91bGQuZXF1YWwgXCJyZWRcIlxuXG5cdFx0IyBcdGxheWVyID0gbmV3IExheWVyXG5cdFx0IyBcdGxheWVyLmJhY2tncm91bmRDb2xvciA9IFwicmVkXCJcblx0XHQjIFx0bGF5ZXIuaW1hZ2UgPSBpbWFnZVBhdGhcblx0XHQjIFx0bGF5ZXIuYmFja2dyb3VuZENvbG9yLnNob3VsZC5lcXVhbCBcInJlZFwiXG5cblxuXHRcdGl0IFwic2hvdWxkIHNldCB2aXNpYmxlXCIsIC0+XG5cdFx0XHRcblx0XHRcdGxheWVyID0gbmV3IExheWVyXG5cblx0XHRcdGxheWVyLnZpc2libGUuc2hvdWxkLmVxdWFsIHRydWVcblx0XHRcdGxheWVyLnN0eWxlW1wiZGlzcGxheVwiXS5zaG91bGQuZXF1YWwgXCJibG9ja1wiXG5cblx0XHRcdGxheWVyLnZpc2libGUgPSBmYWxzZVxuXHRcdFx0bGF5ZXIudmlzaWJsZS5zaG91bGQuZXF1YWwgZmFsc2Vcblx0XHRcdGxheWVyLnN0eWxlW1wiZGlzcGxheVwiXS5zaG91bGQuZXF1YWwgXCJub25lXCJcblxuXHRcdGl0IFwic2hvdWxkIHNldCBjbGlwXCIsIC0+XG5cdFx0XHRcblx0XHRcdGxheWVyID0gbmV3IExheWVyXG5cblx0XHRcdGxheWVyLmNsaXAuc2hvdWxkLmVxdWFsIHRydWVcblx0XHRcdGxheWVyLnN0eWxlW1wib3ZlcmZsb3dcIl0uc2hvdWxkLmVxdWFsIFwiaGlkZGVuXCJcblxuXHRcdFx0bGF5ZXIuY2xpcCA9IGZhbHNlXG5cdFx0XHRsYXllci5zY3JvbGwuc2hvdWxkLmVxdWFsIGZhbHNlXG5cdFx0XHRsYXllci5zdHlsZVtcIm92ZXJmbG93XCJdLnNob3VsZC5lcXVhbCBcInZpc2libGVcIlxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IHNjcm9sbFwiLCAtPlxuXHRcdFx0XG5cdFx0XHRsYXllciA9IG5ldyBMYXllclxuXG5cdFx0XHRsYXllci5zY3JvbGwuc2hvdWxkLmVxdWFsIGZhbHNlXG5cdFx0XHRsYXllci5zdHlsZVtcIm92ZXJmbG93XCJdLnNob3VsZC5lcXVhbCBcImhpZGRlblwiXG5cblx0XHRcdGxheWVyLnNjcm9sbCA9IHRydWVcblx0XHRcdGxheWVyLnNjcm9sbC5zaG91bGQuZXF1YWwgdHJ1ZVxuXHRcdFx0bGF5ZXIuc3R5bGVbXCJvdmVyZmxvd1wiXS5zaG91bGQuZXF1YWwgXCJzY3JvbGxcIlxuXHRcdFx0XG5cdFx0XHRsYXllci5pZ25vcmVFdmVudHMuc2hvdWxkLmVxdWFsIGZhbHNlXG5cblx0XHRcdGxheWVyLnNjcm9sbCA9IGZhbHNlXG5cdFx0XHRsYXllci5zY3JvbGwuc2hvdWxkLmVxdWFsIGZhbHNlXG5cdFx0XHRsYXllci5zdHlsZVtcIm92ZXJmbG93XCJdLnNob3VsZC5lcXVhbCBcImhpZGRlblwiXG5cblx0XHRpdCBcInNob3VsZCBzZXQgc2Nyb2xsIGZyb20gcHJvcGVydGllc1wiLCAtPlxuXG5cdFx0XHRsYXllciA9IG5ldyBMYXllclxuXHRcdFx0bGF5ZXIucHJvcHMgPSB7c2Nyb2xsOmZhbHNlfVxuXHRcdFx0bGF5ZXIuc2Nyb2xsLnNob3VsZC5lcXVhbCBmYWxzZVxuXHRcdFx0bGF5ZXIucHJvcHMgPSB7c2Nyb2xsOnRydWV9XG5cdFx0XHRsYXllci5zY3JvbGwuc2hvdWxkLmVxdWFsIHRydWVcblxuXHRcdGl0IFwic2hvdWxkIHNldCBzY3JvbGxIb3Jpem9udGFsXCIsIC0+XG5cdFx0XHRcblx0XHRcdGxheWVyID0gbmV3IExheWVyXG5cblx0XHRcdGxheWVyLnNjcm9sbC5zaG91bGQuZXF1YWwgZmFsc2Vcblx0XHRcdGxheWVyLnN0eWxlW1wib3ZlcmZsb3dcIl0uc2hvdWxkLmVxdWFsIFwiaGlkZGVuXCJcblx0XHRcdGxheWVyLmlnbm9yZUV2ZW50cy5zaG91bGQuZXF1YWwgdHJ1ZVxuXG5cdFx0XHRsYXllci5zY3JvbGwgPSB0cnVlXG5cdFx0XHRsYXllci5zY3JvbGwuc2hvdWxkLmVxdWFsIHRydWVcblx0XHRcdGxheWVyLnN0eWxlW1wib3ZlcmZsb3dcIl0uc2hvdWxkLmVxdWFsIFwic2Nyb2xsXCJcblx0XHRcdGxheWVyLmlnbm9yZUV2ZW50cy5zaG91bGQuZXF1YWwgZmFsc2VcblxuXHRcdGl0IFwic2hvdWxkIHNldCBzdHlsZSBwcm9wZXJ0aWVzIG9uIGNyZWF0ZVwiLCAtPlxuXG5cdFx0XHRsYXllciA9IG5ldyBMYXllciBiYWNrZ3JvdW5kQ29sb3I6IFwicmVkXCJcblx0XHRcdGxheWVyLmJhY2tncm91bmRDb2xvci5zaG91bGQuZXF1YWwgXCJyZWRcIlxuXHRcdFx0bGF5ZXIuc3R5bGVbXCJiYWNrZ3JvdW5kQ29sb3JcIl0uc2hvdWxkLmVxdWFsIFwicmVkXCJcblxuXHRcdGl0IFwic2hvdWxkIGNoZWNrIHZhbHVlIHR5cGVcIiwgLT5cblxuXHRcdFx0ZiA9IC0+XG5cdFx0XHRcdGxheWVyID0gbmV3IExheWVyXG5cdFx0XHRcdGxheWVyLnggPSBcImhlbGxvXCJcblx0XHRcdGYuc2hvdWxkLnRocm93KClcblxuXHRcdGl0IFwic2hvdWxkIHNldCBib3JkZXJSYWRpdXNcIiwgLT5cblxuXHRcdFx0dGVzdEJvcmRlclJhZGl1cyA9IChsYXllciwgdmFsdWUpIC0+XG5cblx0XHRcdFx0aWYgbGF5ZXIuc3R5bGVbXCJib3JkZXItdG9wLWxlZnQtcmFkaXVzXCJdIGlzIFwiI3t2YWx1ZX1cIlxuXHRcdFx0XHRcdGxheWVyLnN0eWxlW1wiYm9yZGVyLXRvcC1sZWZ0LXJhZGl1c1wiXS5zaG91bGQuZXF1YWwgXCIje3ZhbHVlfVwiXG5cdFx0XHRcdFx0bGF5ZXIuc3R5bGVbXCJib3JkZXItdG9wLXJpZ2h0LXJhZGl1c1wiXS5zaG91bGQuZXF1YWwgXCIje3ZhbHVlfVwiXG5cdFx0XHRcdFx0bGF5ZXIuc3R5bGVbXCJib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzXCJdLnNob3VsZC5lcXVhbCBcIiN7dmFsdWV9XCJcblx0XHRcdFx0XHRsYXllci5zdHlsZVtcImJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzXCJdLnNob3VsZC5lcXVhbCBcIiN7dmFsdWV9XCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGxheWVyLnN0eWxlW1wiYm9yZGVyLXRvcC1sZWZ0LXJhZGl1c1wiXS5zaG91bGQuZXF1YWwgXCIje3ZhbHVlfSAje3ZhbHVlfVwiXG5cdFx0XHRcdFx0bGF5ZXIuc3R5bGVbXCJib3JkZXItdG9wLXJpZ2h0LXJhZGl1c1wiXS5zaG91bGQuZXF1YWwgXCIje3ZhbHVlfSAje3ZhbHVlfVwiXG5cdFx0XHRcdFx0bGF5ZXIuc3R5bGVbXCJib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzXCJdLnNob3VsZC5lcXVhbCBcIiN7dmFsdWV9ICN7dmFsdWV9XCJcblx0XHRcdFx0XHRsYXllci5zdHlsZVtcImJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzXCJdLnNob3VsZC5lcXVhbCBcIiN7dmFsdWV9ICN7dmFsdWV9XCJcblxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXJcblxuXHRcdFx0bGF5ZXIuYm9yZGVyUmFkaXVzID0gMTBcblx0XHRcdGxheWVyLmJvcmRlclJhZGl1cy5zaG91bGQuZXF1YWwgMTBcblxuXHRcdFx0dGVzdEJvcmRlclJhZGl1cyhsYXllciwgXCIxMHB4XCIpXG5cblx0XHRcdGxheWVyLmJvcmRlclJhZGl1cyA9IFwiNTAlXCJcblx0XHRcdGxheWVyLmJvcmRlclJhZGl1cy5zaG91bGQuZXF1YWwgXCI1MCVcIlxuXG5cdFx0XHR0ZXN0Qm9yZGVyUmFkaXVzKGxheWVyLCBcIjUwJVwiKVxuXG5cblx0XHRpdCBcInNob3VsZCBzZXQgcGVyc3BlY3RpdmVcIiwgLT5cblxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGxheWVyLnBlcnNwZWN0aXZlID0gNTAwXG5cblx0XHRcdGxheWVyLnN0eWxlW1wiLXdlYmtpdC1wZXJzcGVjdGl2ZVwiXS5zaG91bGQuZXF1YWwoXCI1MDBcIilcblxuXG5cblx0ZGVzY3JpYmUgXCJGaWx0ZXIgUHJvcGVydGllc1wiLCAtPlxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IG5vdGhpbmcgb24gZGVmYXVsdHNcIiwgLT5cblx0XHRcdFxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGxheWVyLnN0eWxlLndlYmtpdEZpbHRlci5zaG91bGQuZXF1YWwgXCJcIlxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IG9ubHkgdGhlIGZpbHRlciB0aGF0IGlzIG5vbiBkZWZhdWx0XCIsIC0+XG5cdFx0XHRcblx0XHRcdGxheWVyID0gbmV3IExheWVyXG5cblx0XHRcdGxheWVyLmJsdXIgPSAxMFxuXHRcdFx0bGF5ZXIuYmx1ci5zaG91bGQuZXF1YWwgMTBcblx0XHRcdGxheWVyLnN0eWxlLndlYmtpdEZpbHRlci5zaG91bGQuZXF1YWwgXCJibHVyKDEwcHgpXCJcblxuXHRcdFx0bGF5ZXIuY29udHJhc3QgPSA1MFxuXHRcdFx0bGF5ZXIuY29udHJhc3Quc2hvdWxkLmVxdWFsIDUwXG5cdFx0XHRsYXllci5zdHlsZS53ZWJraXRGaWx0ZXIuc2hvdWxkLmVxdWFsIFwiYmx1cigxMHB4KSBjb250cmFzdCg1MCUpXCJcblxuXHRkZXNjcmliZSBcIlNoYWRvdyBQcm9wZXJ0aWVzXCIsIC0+XG5cblx0XHRpdCBcInNob3VsZCBzZXQgbm90aGluZyBvbiBkZWZhdWx0c1wiLCAtPlxuXHRcdFx0XG5cdFx0XHRsYXllciA9IG5ldyBMYXllclxuXHRcdFx0bGF5ZXIuc3R5bGUuYm94U2hhZG93LnNob3VsZC5lcXVhbCBcIlwiXG5cblx0XHRpdCBcInNob3VsZCBzZXQgdGhlIHNoYWRvd1wiLCAtPlxuXHRcdFx0XG5cdFx0XHRsYXllciA9IG5ldyBMYXllclxuXG5cdFx0XHRsYXllci5zaGFkb3dYID0gMTBcblx0XHRcdGxheWVyLnNoYWRvd1kgPSAxMFxuXHRcdFx0bGF5ZXIuc2hhZG93Qmx1ciA9IDEwXG5cdFx0XHRsYXllci5zaGFkb3dTcHJlYWQgPSAxMFxuXG5cdFx0XHRsYXllci5zaGFkb3dYLnNob3VsZC5lcXVhbCAxMFxuXHRcdFx0bGF5ZXIuc2hhZG93WS5zaG91bGQuZXF1YWwgMTBcblx0XHRcdGxheWVyLnNoYWRvd0JsdXIuc2hvdWxkLmVxdWFsIDEwXG5cdFx0XHRsYXllci5zaGFkb3dTcHJlYWQuc2hvdWxkLmVxdWFsIDEwXG5cblx0XHRcdGxheWVyLnN0eWxlLmJveFNoYWRvdy5zaG91bGQuZXF1YWwgXCJcIlxuXG5cdFx0XHQjIE9ubHkgYWZ0ZXIgd2Ugc2V0IGEgY29sb3IgYSBzaGFkb3cgc2hvdWxkIGJlIGRyYXduXG5cdFx0XHRsYXllci5zaGFkb3dDb2xvciA9IFwicmVkXCJcblx0XHRcdGxheWVyLnNoYWRvd0NvbG9yLnNob3VsZC5lcXVhbCBcInJlZFwiXG5cdFx0XHRcblx0XHRcdGxheWVyLnN0eWxlLmJveFNoYWRvdy5zaG91bGQuZXF1YWwgXCJyZWQgMTBweCAxMHB4IDEwcHggMTBweFwiXG5cblx0XHRcdCMgT25seSBhZnRlciB3ZSBzZXQgYSBjb2xvciBhIHNoYWRvdyBzaG91bGQgYmUgZHJhd25cblx0XHRcdGxheWVyLnNoYWRvd0NvbG9yID0gbnVsbFxuXHRcdFx0bGF5ZXIuc3R5bGUuYm94U2hhZG93LnNob3VsZC5lcXVhbCBcIlwiXG5cblx0ZGVzY3JpYmUgXCJFdmVudHNcIiwgLT5cblxuXHRcdGl0IFwic2hvdWxkIHNldCBwb2ludGVyIGV2ZW50c1wiLCAtPlxuXG5cdFx0XHRsYXllciA9IG5ldyBMYXllcigpXG5cblx0XHRcdGxheWVyLmlnbm9yZUV2ZW50cyA9IGZhbHNlXG5cdFx0XHRsYXllci5zdHlsZVtcInBvaW50ZXJFdmVudHNcIl0uc2hvdWxkLmVxdWFsIFwiYXV0b1wiXG5cblx0XHRcdGxheWVyLmlnbm9yZUV2ZW50cyA9IHRydWVcblx0XHRcdGxheWVyLnN0eWxlW1wicG9pbnRlckV2ZW50c1wiXS5zaG91bGQuZXF1YWwgXCJub25lXCJcblxuXHRcdGl0IFwic2hvdWxkIG5vdCBsaXN0ZW4gdG8gZXZlbnRzIGJ5IGRlZmF1bHRcIiwgLT5cblx0XHRcdFxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIoKVxuXHRcdFx0bGF5ZXIuaWdub3JlRXZlbnRzLnNob3VsZC5lcXVhbCB0cnVlXG5cdFx0XHRsYXllci5zdHlsZVtcInBvaW50ZXJFdmVudHNcIl0uc2hvdWxkLmVxdWFsIFwibm9uZVwiXG5cblx0XHRpdCBcInNob3VsZCBsaXN0ZW4gdG8gbXVsdGlwbGUgZXZlbnRzXCIsIC0+XG5cblx0XHRcdGxheWVyID0gbmV3IExheWVyKClcblxuXHRcdFx0Y291bnQgPSAwXG5cdFx0XHRoYW5kbGVyID0gLT4gY291bnQrK1xuXG5cdFx0XHRsYXllci5vbiBcImNsaWNrXCIsIFwidGFwXCIsIGhhbmRsZXJcblxuXHRcdFx0bGF5ZXIuZW1pdCBcImNsaWNrXCJcblx0XHRcdGxheWVyLmVtaXQgXCJ0YXBcIlxuXG5cdFx0XHRjb3VudC5zaG91bGQuZXF1YWwgMlxuXG5cdFx0aXQgXCJzaG91bGQgbm90IGxpc3RlbiB0byBldmVudHMgdW50aWwgYSBsaXN0ZW5lciBpcyBhZGRlZFwiLCAtPlxuXHRcdFx0XG5cdFx0XHRsYXllciA9IG5ldyBMYXllcigpXG5cdFx0XHRsYXllci5pZ25vcmVFdmVudHMuc2hvdWxkLmVxdWFsIHRydWVcblxuXHRcdFx0bGF5ZXIub24gRXZlbnRzLkNsaWNrLCAtPlxuXHRcdFx0XHRjb25zb2xlLmxvZyBcImhlbGxvXCJcblxuXHRcdFx0bGF5ZXIuaWdub3JlRXZlbnRzLnNob3VsZC5lcXVhbCBmYWxzZVxuXG5cdFx0aXQgXCJzaG91bGQgbW9kaWZ5IHRoZSBldmVudCBzY29wZVwiLCAoY2FsbGJhY2spIC0+XG5cblx0XHRcdG15TGF5ZXIgPSBuZXcgTGF5ZXIoKVxuXG5cdFx0XHRteUxheWVyLm9uIFwiY2xpY2tcIiwgKGV2ZW50LCBsYXllcikgLT5cblx0XHRcdFx0QGlkLnNob3VsZC5lcXVhbCBteUxheWVyLmlkXG5cdFx0XHRcdGxheWVyLmlkLnNob3VsZC5lcXVhbCBteUxheWVyLmlkXG5cdFx0XHRcdGNhbGxiYWNrKClcblxuXHRcdFx0c2ltdWxhdGUuY2xpY2sgbXlMYXllci5fZWxlbWVudFxuXG5cdFx0aXQgXCJzaG91bGQgcmVtb3ZlIGV2ZW50c1wiLCAtPlxuXG5cdFx0XHRsYXllciA9IG5ldyBMYXllclxuXHRcdFx0XG5cdFx0XHRjbGlja0NvdW50ID0gMFxuXG5cdFx0XHRoYW5kbGVyID0gLT5cblx0XHRcdFx0Y2xpY2tDb3VudCsrXG5cblx0XHRcdGxheWVyLm9uIFwidGVzdFwiLCBoYW5kbGVyXG5cblx0XHRcdGxheWVyLmVtaXQgXCJ0ZXN0XCJcblx0XHRcdGNsaWNrQ291bnQuc2hvdWxkLmVxdWFsIDFcblxuXHRcdFx0bGF5ZXIub2ZmIFwidGVzdFwiLCBoYW5kbGVyXG5cblx0XHRcdGxheWVyLmVtaXQgXCJ0ZXN0XCJcblx0XHRcdGNsaWNrQ291bnQuc2hvdWxkLmVxdWFsIDFcblxuXG5cdFx0aXQgXCJzaG91bGQgb25seSBydW4gYW4gZXZlbnQgb25jZVwiLCAtPlxuXHRcdFx0XG5cdFx0XHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRcdGNvdW50ID0gMFxuXG5cdFx0XHRsYXllckEub25jZSBcImhlbGxvXCIsIChsYXllcikgLT5cblx0XHRcdFx0Y291bnQrK1xuXHRcdFx0XHRsYXllckEuc2hvdWxkLmVxdWFsIGxheWVyXG5cblx0XHRcdGZvciBpIGluIFswLi4xMF1cblx0XHRcdFx0bGF5ZXJBLmVtaXQoXCJoZWxsb1wiKVxuXG5cdFx0XHRjb3VudC5zaG91bGQuZXF1YWwgMVxuXG5cblx0ZGVzY3JpYmUgXCJIaWVyYXJjaHlcIiwgLT5cblx0XHRcblx0XHRpdCBcInNob3VsZCBpbnNlcnQgaW4gZG9tXCIsIC0+XG5cdFx0XHRcblx0XHRcdGxheWVyID0gbmV3IExheWVyXG5cdFx0XHRcblx0XHRcdGFzc2VydC5lcXVhbCBsYXllci5fZWxlbWVudC5wYXJlbnROb2RlLmlkLCBcIkZyYW1lckNvbnRleHRSb290LURlZmF1bHRcIlxuXHRcdFx0YXNzZXJ0LmVxdWFsIGxheWVyLnN1cGVyTGF5ZXIsIG51bGxcblxuXHRcdGl0IFwic2hvdWxkIGNoZWNrIHN1cGVyTGF5ZXJcIiwgLT5cblxuXHRcdFx0ZiA9IC0+IGxheWVyID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6MVxuXHRcdFx0Zi5zaG91bGQudGhyb3coKVxuXG5cdFx0aXQgXCJzaG91bGQgYWRkIHN1YmxheWVyXCIsIC0+XG5cdFx0XHRcblx0XHRcdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdFx0bGF5ZXJCID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6bGF5ZXJBXG5cdFx0XHRcblx0XHRcdGFzc2VydC5lcXVhbCBsYXllckIuX2VsZW1lbnQucGFyZW50Tm9kZSwgbGF5ZXJBLl9lbGVtZW50XG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJCLnN1cGVyTGF5ZXIsIGxheWVyQVxuXG5cdFx0aXQgXCJzaG91bGQgcmVtb3ZlIHN1YmxheWVyXCIsIC0+XG5cblx0XHRcdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdFx0bGF5ZXJCID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6bGF5ZXJBXG5cblx0XHRcdGxheWVyQi5zdXBlckxheWVyID0gbnVsbFxuXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJCLl9lbGVtZW50LnBhcmVudE5vZGUuaWQsIFwiRnJhbWVyQ29udGV4dFJvb3QtRGVmYXVsdFwiXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJCLnN1cGVyTGF5ZXIsIG51bGxcblxuXHRcdGl0IFwic2hvdWxkIGxpc3Qgc3VibGF5ZXJzXCIsIC0+XG5cblx0XHRcdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdFx0bGF5ZXJCID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6bGF5ZXJBXG5cdFx0XHRsYXllckMgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpsYXllckFcblxuXHRcdFx0YXNzZXJ0LmRlZXBFcXVhbCBsYXllckEuc3ViTGF5ZXJzLCBbbGF5ZXJCLCBsYXllckNdXG5cblx0XHRcdGxheWVyQi5zdXBlckxheWVyID0gbnVsbFxuXHRcdFx0YXNzZXJ0LmVxdWFsIGxheWVyQS5zdWJMYXllcnMubGVuZ3RoLCAxXG5cdFx0XHRhc3NlcnQuZGVlcEVxdWFsIGxheWVyQS5zdWJMYXllcnMsIFtsYXllckNdXG5cblx0XHRcdGxheWVyQy5zdXBlckxheWVyID0gbnVsbFxuXHRcdFx0YXNzZXJ0LmRlZXBFcXVhbCBsYXllckEuc3ViTGF5ZXJzLCBbXVxuXG5cdFx0aXQgXCJzaG91bGQgbGlzdCBzaWJsaW5nIHJvb3QgbGF5ZXJzXCIsIC0+XG5cblx0XHRcdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdFx0bGF5ZXJCID0gbmV3IExheWVyXG5cdFx0XHRsYXllckMgPSBuZXcgTGF5ZXJcblxuXHRcdFx0YXNzZXJ0IGxheWVyQiBpbiBsYXllckEuc2libGluZ0xheWVycywgdHJ1ZVxuXHRcdFx0YXNzZXJ0IGxheWVyQyBpbiBsYXllckEuc2libGluZ0xheWVycywgdHJ1ZVxuXG5cdFx0aXQgXCJzaG91bGQgbGlzdCBzaWJsaW5nIGxheWVyc1wiLCAtPlxuXG5cdFx0XHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRcdGxheWVyQiA9IG5ldyBMYXllciBzdXBlckxheWVyOmxheWVyQVxuXHRcdFx0bGF5ZXJDID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6bGF5ZXJBXG5cblx0XHRcdGFzc2VydC5kZWVwRXF1YWwgbGF5ZXJCLnNpYmxpbmdMYXllcnMsIFtsYXllckNdXG5cdFx0XHRhc3NlcnQuZGVlcEVxdWFsIGxheWVyQy5zaWJsaW5nTGF5ZXJzLCBbbGF5ZXJCXVxuXG5cdFx0aXQgXCJzaG91bGQgbGlzdCBzdXBlciBsYXllcnNcIiwgLT5cblxuXHRcdFx0bGF5ZXJBID0gbmV3IExheWVyXG5cdFx0XHRsYXllckIgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpsYXllckFcblx0XHRcdGxheWVyQyA9IG5ldyBMYXllciBzdXBlckxheWVyOmxheWVyQlxuXG5cdFx0XHRhc3NlcnQuZGVlcEVxdWFsIGxheWVyQy5zdXBlckxheWVycygpLCBbbGF5ZXJCLCBsYXllckFdXG5cblxuXHRcdFx0XG5cblx0ZGVzY3JpYmUgXCJMYXllcmluZ1wiLCAtPlxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IGF0IGNyZWF0aW9uXCIsIC0+XG5cblx0XHRcdGxheWVyID0gbmV3IExheWVyIGluZGV4OjY2NlxuXHRcdFx0bGF5ZXIuaW5kZXguc2hvdWxkLmVxdWFsIDY2NlxuXG5cdFx0aXQgXCJzaG91bGQgY2hhbmdlIGluZGV4XCIsIC0+XG5cblx0XHRcdGxheWVyID0gbmV3IExheWVyXG5cdFx0XHRsYXllci5pbmRleCA9IDY2NlxuXHRcdFx0bGF5ZXIuaW5kZXguc2hvdWxkLmVxdWFsIDY2NlxuXG5cdFx0aXQgXCJzaG91bGQgYmUgaW4gZnJvbnQgZm9yIHJvb3RcIiwgLT5cblxuXHRcdFx0bGF5ZXJBID0gbmV3IExheWVyXG5cdFx0XHRsYXllckIgPSBuZXcgTGF5ZXJcblxuXHRcdFx0YXNzZXJ0LmVxdWFsIGxheWVyQi5pbmRleCwgbGF5ZXJBLmluZGV4ICsgMVxuXG5cdFx0aXQgXCJzaG91bGQgYmUgaW4gZnJvbnRcIiwgLT5cblxuXHRcdFx0bGF5ZXJBID0gbmV3IExheWVyXG5cdFx0XHRsYXllckIgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpsYXllckFcblx0XHRcdGxheWVyQyA9IG5ldyBMYXllciBzdXBlckxheWVyOmxheWVyQVxuXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJCLmluZGV4LCAxXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJDLmluZGV4LCAyXG5cblx0XHRpdCBcInNob3VsZCBzZW5kIGJhY2sgYW5kIGZyb250XCIsIC0+XG5cblx0XHRcdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdFx0bGF5ZXJCID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6bGF5ZXJBXG5cdFx0XHRsYXllckMgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpsYXllckFcblxuXHRcdFx0bGF5ZXJDLnNlbmRUb0JhY2soKVxuXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJCLmluZGV4LCAgMVxuXHRcdFx0YXNzZXJ0LmVxdWFsIGxheWVyQy5pbmRleCwgLTFcblxuXHRcdFx0bGF5ZXJDLmJyaW5nVG9Gcm9udCgpXG5cblx0XHRcdGFzc2VydC5lcXVhbCBsYXllckIuaW5kZXgsICAxXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJDLmluZGV4LCAgMlxuXG5cdFx0aXQgXCJzaG91bGQgcGxhY2UgaW4gZnJvbnRcIiwgLT5cblxuXHRcdFx0bGF5ZXJBID0gbmV3IExheWVyXG5cdFx0XHRsYXllckIgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpsYXllckEgIyAxXG5cdFx0XHRsYXllckMgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpsYXllckEgIyAyXG5cdFx0XHRsYXllckQgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpsYXllckEgIyAzXG5cblx0XHRcdGxheWVyQi5wbGFjZUJlZm9yZSBsYXllckNcblxuXHRcdFx0YXNzZXJ0LmVxdWFsIGxheWVyQi5pbmRleCwgMlxuXHRcdFx0YXNzZXJ0LmVxdWFsIGxheWVyQy5pbmRleCwgMVxuXHRcdFx0YXNzZXJ0LmVxdWFsIGxheWVyRC5pbmRleCwgM1xuXG5cdFx0aXQgXCJzaG91bGQgcGxhY2UgYmVoaW5kXCIsIC0+XG5cblx0XHRcdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdFx0bGF5ZXJCID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6bGF5ZXJBICMgMVxuXHRcdFx0bGF5ZXJDID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6bGF5ZXJBICMgMlxuXHRcdFx0bGF5ZXJEID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6bGF5ZXJBICMgM1xuXG5cdFx0XHRsYXllckMucGxhY2VCZWhpbmQgbGF5ZXJCXG5cblx0XHRcdCMgVE9ETzogU3RpbGwgc29tZXRoaW5nIGZpc2h5IGhlcmUsIGJ1dCBpdCB3b3Jrc1xuXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJCLmluZGV4LCAyXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJDLmluZGV4LCAxXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJELmluZGV4LCA0XG5cblx0XHRpdCBcInNob3VsZCBnZXQgYSBzdWJsYXllcnMgYnkgbmFtZVwiLCAtPlxuXG5cdFx0XHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRcdGxheWVyQiA9IG5ldyBMYXllciBuYW1lOlwiQlwiLCBzdXBlckxheWVyOmxheWVyQVxuXHRcdFx0bGF5ZXJDID0gbmV3IExheWVyIG5hbWU6XCJDXCIsIHN1cGVyTGF5ZXI6bGF5ZXJBXG5cdFx0XHRsYXllckQgPSBuZXcgTGF5ZXIgbmFtZTpcIkNcIiwgc3VwZXJMYXllcjpsYXllckFcblxuXHRcdFx0bGF5ZXJBLnN1YkxheWVyc0J5TmFtZShcIkJcIikuc2hvdWxkLmVxbCBbbGF5ZXJCXVxuXHRcdFx0bGF5ZXJBLnN1YkxheWVyc0J5TmFtZShcIkNcIikuc2hvdWxkLmVxbCBbbGF5ZXJDLCBsYXllckRdXG5cblx0XHRpdCBcInNob3VsZCBnZXQgYSBzdXBlcmxheWVyc1wiLCAtPlxuXHRcdFx0bGF5ZXJBID0gbmV3IExheWVyXG5cdFx0XHRsYXllckIgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjpsYXllckFcblx0XHRcdGxheWVyQyA9IG5ldyBMYXllciBzdXBlckxheWVyOmxheWVyQlxuXHRcdFx0bGF5ZXJDLnN1cGVyTGF5ZXJzKCkuc2hvdWxkLmVxbCBbbGF5ZXJCLCBsYXllckFdXG5cblx0ZGVzY3JpYmUgXCJGcmFtZVwiLCAtPlxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IG9uIGNyZWF0ZVwiLCAtPlxuXG5cdFx0XHRsYXllciA9IG5ldyBMYXllciBmcmFtZTp7eDoxMTEsIHk6MjIyLCB3aWR0aDozMzMsIGhlaWdodDo0NDR9XG5cblx0XHRcdGFzc2VydC5lcXVhbCBsYXllci54LCAxMTFcblx0XHRcdGFzc2VydC5lcXVhbCBsYXllci55LCAyMjJcblx0XHRcdGFzc2VydC5lcXVhbCBsYXllci53aWR0aCwgMzMzXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXIuaGVpZ2h0LCA0NDRcblxuXHRcdGl0IFwic2hvdWxkIHNldCBhZnRlciBjcmVhdGVcIiwgLT5cblxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIgXG5cdFx0XHRsYXllci5mcmFtZSA9IHt4OjExMSwgeToyMjIsIHdpZHRoOjMzMywgaGVpZ2h0OjQ0NH1cblxuXHRcdFx0YXNzZXJ0LmVxdWFsIGxheWVyLngsIDExMVxuXHRcdFx0YXNzZXJ0LmVxdWFsIGxheWVyLnksIDIyMlxuXHRcdFx0YXNzZXJ0LmVxdWFsIGxheWVyLndpZHRoLCAzMzNcblx0XHRcdGFzc2VydC5lcXVhbCBsYXllci5oZWlnaHQsIDQ0NFxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IG1pblggb24gY3JlYXRpb25cIiwgLT5cblx0XHRcdGxheWVyID0gbmV3IExheWVyIG1pblg6MjAwLCB5OjEwMCwgd2lkdGg6MTAwLCBoZWlnaHQ6MTAwXG5cdFx0XHRsYXllci54LnNob3VsZC5lcXVhbCAyMDBcblxuXHRcdGl0IFwic2hvdWxkIHNldCBtaWRYIG9uIGNyZWF0aW9uXCIsIC0+XG5cdFx0XHRsYXllciA9IG5ldyBMYXllciBtaWRYOjIwMCwgeToxMDAsIHdpZHRoOjEwMCwgaGVpZ2h0OjEwMFxuXHRcdFx0bGF5ZXIueC5zaG91bGQuZXF1YWwgMTUwXG5cblx0XHRpdCBcInNob3VsZCBzZXQgbWF4WCBvbiBjcmVhdGlvblwiLCAtPlxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIgbWF4WDoyMDAsIHk6MTAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDBcblx0XHRcdGxheWVyLnguc2hvdWxkLmVxdWFsIDEwMFxuXG5cdFx0aXQgXCJzaG91bGQgc2V0IG1pblkgb24gY3JlYXRpb25cIiwgLT5cblx0XHRcdGxheWVyID0gbmV3IExheWVyIHg6MTAwLCBtaW5ZOjIwMCwgd2lkdGg6MTAwLCBoZWlnaHQ6MTAwXG5cdFx0XHRsYXllci55LnNob3VsZC5lcXVhbCAyMDBcblxuXHRcdGl0IFwic2hvdWxkIHNldCBtaWRZIG9uIGNyZWF0aW9uXCIsIC0+XG5cdFx0XHRsYXllciA9IG5ldyBMYXllciB4OjEwMCwgbWlkWToyMDAsIHdpZHRoOjEwMCwgaGVpZ2h0OjEwMFxuXHRcdFx0bGF5ZXIueS5zaG91bGQuZXF1YWwgMTUwXG5cblx0XHRpdCBcInNob3VsZCBzZXQgbWF4WSBvbiBjcmVhdGlvblwiLCAtPlxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIgeDoxMDAsIG1heFk6MjAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDBcblx0XHRcdGxheWVyLnkuc2hvdWxkLmVxdWFsIDEwMFxuXG5cblx0XHRpdCBcInNob3VsZCBzZXQgbWluWFwiLCAtPlxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIgeToxMDAsIHdpZHRoOjEwMCwgaGVpZ2h0OjEwMFxuXHRcdFx0bGF5ZXIubWluWCA9IDIwMFxuXHRcdFx0bGF5ZXIueC5zaG91bGQuZXF1YWwgMjAwXG5cblx0XHRpdCBcInNob3VsZCBzZXQgbWlkWFwiLCAtPlxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIgeToxMDAsIHdpZHRoOjEwMCwgaGVpZ2h0OjEwMFxuXHRcdFx0bGF5ZXIubWlkWCA9IDIwMFxuXHRcdFx0bGF5ZXIueC5zaG91bGQuZXF1YWwgMTUwXG5cblx0XHRpdCBcInNob3VsZCBzZXQgbWF4WFwiLCAtPlxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIgeToxMDAsIHdpZHRoOjEwMCwgaGVpZ2h0OjEwMFxuXHRcdFx0bGF5ZXIubWF4WCA9IDIwMFxuXHRcdFx0bGF5ZXIueC5zaG91bGQuZXF1YWwgMTAwXG5cblx0XHRpdCBcInNob3VsZCBzZXQgbWluWVwiLCAtPlxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIgeDoxMDAsIHdpZHRoOjEwMCwgaGVpZ2h0OjEwMFxuXHRcdFx0bGF5ZXIubWluWSA9IDIwMFxuXHRcdFx0bGF5ZXIueS5zaG91bGQuZXF1YWwgMjAwXG5cblx0XHRpdCBcInNob3VsZCBzZXQgbWlkWVwiLCAtPlxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIgeDoxMDAsIHdpZHRoOjEwMCwgaGVpZ2h0OjEwMFxuXHRcdFx0bGF5ZXIubWlkWSA9IDIwMFxuXHRcdFx0bGF5ZXIueS5zaG91bGQuZXF1YWwgMTUwXG5cblx0XHRpdCBcInNob3VsZCBzZXQgbWF4WVwiLCAtPlxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXIgeDoxMDAsIHdpZHRoOjEwMCwgaGVpZ2h0OjEwMFxuXHRcdFx0bGF5ZXIubWF4WSA9IDIwMFxuXHRcdFx0bGF5ZXIueS5zaG91bGQuZXF1YWwgMTAwXG5cblx0XHRpdCBcInNob3VsZCBnZXQgYW5kIHNldCBzY3JlZW5GcmFtZVwiLCAtPlxuXHRcdFx0bGF5ZXJBID0gbmV3IExheWVyIHg6MTAwLCB5OjEwMCwgd2lkdGg6MTAwLCBoZWlnaHQ6MTAwXG5cdFx0XHRsYXllckIgPSBuZXcgTGF5ZXIgeDozMDAsIHk6MzAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDAsIHN1cGVyTGF5ZXI6bGF5ZXJBXG5cblx0XHRcdGFzc2VydC5lcXVhbCBsYXllckIuc2NyZWVuRnJhbWUueCwgNDAwXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJCLnNjcmVlbkZyYW1lLnksIDQwMFxuXG5cdFx0XHRsYXllckIuc2NyZWVuRnJhbWUgPSB7eDoxMDAwLCB5OjEwMDB9XG5cblx0XHRcdGFzc2VydC5lcXVhbCBsYXllckIuc2NyZWVuRnJhbWUueCwgMTAwMFxuXHRcdFx0YXNzZXJ0LmVxdWFsIGxheWVyQi5zY3JlZW5GcmFtZS55LCAxMDAwXG5cblx0XHRcdGFzc2VydC5lcXVhbCBsYXllckIueCwgOTAwXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJCLnksIDkwMFxuXG5cdFx0XHRsYXllckIuc3VwZXJMYXllciA9IG51bGxcblx0XHRcdGFzc2VydC5lcXVhbCBsYXllckIuc2NyZWVuRnJhbWUueCwgOTAwXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJCLnNjcmVlbkZyYW1lLnksIDkwMFxuXG5cdFx0aXQgXCJzaG91bGQgY2FsY3VsYXRlIHNjYWxlXCIsIC0+XG5cdFx0XHRsYXllckEgPSBuZXcgTGF5ZXIgc2NhbGU6MC45XG5cdFx0XHRsYXllckIgPSBuZXcgTGF5ZXIgc2NhbGU6MC44LCBzdXBlckxheWVyOmxheWVyQVxuXHRcdFx0bGF5ZXJCLnNjcmVlblNjYWxlWCgpLnNob3VsZC5lcXVhbCAwLjkgKiAwLjhcblx0XHRcdGxheWVyQi5zY3JlZW5TY2FsZVkoKS5zaG91bGQuZXF1YWwgMC45ICogMC44XG5cblx0XHRpdCBcInNob3VsZCBjYWxjdWxhdGUgc2NhbGVkIGZyYW1lXCIsIC0+XG5cdFx0XHRsYXllckEgPSBuZXcgTGF5ZXIgeDoxMDAsIHdpZHRoOjUwMCwgaGVpZ2h0OjkwMCwgc2NhbGU6MC41XG5cdFx0XHRsYXllckEuc2NhbGVkRnJhbWUoKS5zaG91bGQuZXFsIHtcInhcIjoyMjUsXCJ5XCI6MjI1LFwid2lkdGhcIjoyNTAsXCJoZWlnaHRcIjo0NTB9XG5cblx0XHRpdCBcInNob3VsZCBjYWxjdWxhdGUgc2NhbGVkIHNjcmVlbiBmcmFtZVwiLCAtPlxuXHRcdFx0XG5cdFx0XHRsYXllckEgPSBuZXcgTGF5ZXIgeDoxMDAsIHdpZHRoOjUwMCwgaGVpZ2h0OjkwMCwgc2NhbGU6MC41XG5cdFx0XHRsYXllckIgPSBuZXcgTGF5ZXIgeTo1MCwgd2lkdGg6NjAwLCBoZWlnaHQ6NjAwLCBzY2FsZTowLjgsIHN1cGVyTGF5ZXI6bGF5ZXJBXG5cdFx0XHRsYXllckMgPSBuZXcgTGF5ZXIgeTotNjAsIHdpZHRoOjgwMCwgaGVpZ2h0OjcwMCwgc2NhbGU6MS4yLCBzdXBlckxheWVyOmxheWVyQlxuXG5cdFx0XHRsYXllckEuc2NyZWVuU2NhbGVkRnJhbWUoKS5zaG91bGQuZXFsIHtcInhcIjoyMjUsXCJ5XCI6MjI1LFwid2lkdGhcIjoyNTAsXCJoZWlnaHRcIjo0NTB9XG5cdFx0XHRsYXllckIuc2NyZWVuU2NhbGVkRnJhbWUoKS5zaG91bGQuZXFsIHtcInhcIjoyNTUsXCJ5XCI6MjgwLFwid2lkdGhcIjoyNDAsXCJoZWlnaHRcIjoyNDB9XG5cdFx0XHRsYXllckMuc2NyZWVuU2NhbGVkRnJhbWUoKS5zaG91bGQuZXFsIHtcInhcIjoyMjMsXCJ5XCI6MjI4LFwid2lkdGhcIjozODQsXCJoZWlnaHRcIjozMzZ9XG5cblx0ZGVzY3JpYmUgXCJDZW50ZXJcIiwgLT5cblxuXHRcdGl0IFwic2hvdWxkIGNlbnRlclwiLCAtPlxuXHRcdFx0bGF5ZXJBID0gbmV3IExheWVyIHdpZHRoOjIwMCwgaGVpZ2h0OjIwMFxuXHRcdFx0bGF5ZXJCID0gbmV3IExheWVyIHdpZHRoOjEwMCwgaGVpZ2h0OjEwMCwgc3VwZXJMYXllcjpsYXllckFcblx0XHRcdGxheWVyQi5jZW50ZXIoKVxuXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJCLngsIDUwXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJCLnksIDUwXG5cblx0XHRpdCBcInNob3VsZCBjZW50ZXIgd2l0aCBvZmZzZXRcIiwgLT5cblx0XHRcdGxheWVyQSA9IG5ldyBMYXllciB3aWR0aDoyMDAsIGhlaWdodDoyMDBcblx0XHRcdGxheWVyQiA9IG5ldyBMYXllciB3aWR0aDoxMDAsIGhlaWdodDoxMDAsIHN1cGVyTGF5ZXI6bGF5ZXJBXG5cdFx0XHRsYXllckIuY2VudGVyWCg1MClcblx0XHRcdGxheWVyQi5jZW50ZXJZKDUwKVxuXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJCLngsIDEwMFxuXHRcdFx0YXNzZXJ0LmVxdWFsIGxheWVyQi55LCAxMDBcblxuXHRcdGl0IFwic2hvdWxkIGNlbnRlciByZXR1cm4gbGF5ZXJcIiwgLT5cblx0XHRcdGxheWVyQSA9IG5ldyBMYXllciB3aWR0aDoyMDAsIGhlaWdodDoyMDBcblx0XHRcdGxheWVyQS5jZW50ZXIoKS5zaG91bGQuZXF1YWwgbGF5ZXJBXG5cdFx0XHRsYXllckEuY2VudGVyWCgpLnNob3VsZC5lcXVhbCBsYXllckFcblx0XHRcdGxheWVyQS5jZW50ZXJZKCkuc2hvdWxkLmVxdWFsIGxheWVyQVxuXG5cdFx0aXQgXCJzaG91bGQgY2VudGVyIHBpeGVsIGFsaWduXCIsIC0+XG5cdFx0XHRsYXllckEgPSBuZXcgTGF5ZXIgd2lkdGg6MjAwLCBoZWlnaHQ6MjAwXG5cdFx0XHRsYXllckIgPSBuZXcgTGF5ZXIgd2lkdGg6MTExLCBoZWlnaHQ6MTExLCBzdXBlckxheWVyOmxheWVyQVxuXHRcdFx0bGF5ZXJCLmNlbnRlcigpLnBpeGVsQWxpZ24oKVxuXG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJCLngsIDQ0XG5cdFx0XHRhc3NlcnQuZXF1YWwgbGF5ZXJCLnksIDQ0XG5cblxuXHRkZXNjcmliZSBcIkNTU1wiLCAtPlxuXG5cdFx0aXQgXCJjbGFzc0xpc3Qgc2hvdWxkIHdvcmtcIiwgLT5cblxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGxheWVyLmNsYXNzTGlzdC5hZGQgXCJ0ZXN0XCJcblxuXHRcdFx0YXNzZXJ0LmVxdWFsIGxheWVyLmNsYXNzTGlzdC5jb250YWlucyhcInRlc3RcIiksIHRydWVcblx0XHRcdGFzc2VydC5lcXVhbCBsYXllci5fZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJ0ZXN0XCIpLCB0cnVlXG5cblx0ZGVzY3JpYmUgXCJET01cIiwgLT5cblxuXHRcdGl0IFwic2hvdWxkIGRlc3Ryb3lcIiwgLT5cblxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGxheWVyLmRlc3Ryb3koKVxuXG5cdFx0XHQobGF5ZXIgaW4gRnJhbWVyLkN1cnJlbnRDb250ZXh0LmdldExheWVycygpKS5zaG91bGQuYmUuZmFsc2Vcblx0XHRcdGFzc2VydC5lcXVhbCBsYXllci5fZWxlbWVudC5wYXJlbnROb2RlLCBudWxsXG5cblx0XHRpdCBcInNob3VsZCBzZXQgdGV4dFwiLCAtPlxuXG5cdFx0XHRsYXllciA9IG5ldyBMYXllclxuXHRcdFx0bGF5ZXIuaHRtbCA9IFwiSGVsbG9cIlxuXG5cdFx0XHRsYXllci5fZWxlbWVudC5jaGlsZE5vZGVzWzBdLnNob3VsZC5lcXVhbCBsYXllci5fZWxlbWVudEhUTUxcblx0XHRcdGxheWVyLl9lbGVtZW50SFRNTC5pbm5lckhUTUwuc2hvdWxkLmVxdWFsIFwiSGVsbG9cIlxuXHRcdFx0bGF5ZXIuaWdub3JlRXZlbnRzLnNob3VsZC5lcXVhbCB0cnVlXG5cblxuXHRcdGl0IFwic2hvdWxkIHNldCBpbnRlcmFjdGl2ZSBodG1sIGFuZCBhbGxvdyBwb2ludGVyIGV2ZW50c1wiLCAtPlxuXG5cdFx0XHR0YWdzID0gW1wiaW5wdXRcIiwgXCJzZWxlY3RcIiwgXCJ0ZXh0YXJlYVwiLCBcIm9wdGlvblwiXVxuXG5cdFx0XHRodG1sID0gXCJcIlxuXG5cdFx0XHRmb3IgdGFnIGluIHRhZ3Ncblx0XHRcdFx0aHRtbCArPSBcIjwje3RhZ30+PC8je3RhZ30+XCJcblxuXHRcdFx0bGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGxheWVyLmh0bWwgPSBodG1sXG5cblx0XHRcdGZvciB0YWcgaW4gdGFnc1xuXHRcdFx0XHRlbGVtZW50ID0gbGF5ZXIucXVlcnlTZWxlY3RvckFsbCh0YWcpWzBdXG5cdFx0XHRcdHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudClcblx0XHRcdFx0c3R5bGVbXCJwb2ludGVyLWV2ZW50c1wiXS5zaG91bGQuZXF1YWwgXCJhdXRvXCJcblx0XHRcdFx0IyBzdHlsZVtcIi13ZWJraXQtdXNlci1zZWxlY3RcIl0uc2hvdWxkLmVxdWFsIFwiYXV0b1wiXG5cblxuXHRcdGl0IFwic2hvdWxkIHdvcmsgd2l0aCBxdWVyeVNlbGVjdG9yQWxsXCIsIC0+XG5cblx0XHRcdGxheWVyID0gbmV3IExheWVyXG5cdFx0XHRsYXllci5odG1sID0gXCI8aW5wdXQgdHlwZT0nYnV0dG9uJyBpZD0naGVsbG8nPlwiXG5cblx0XHRcdGlucHV0RWxlbWVudHMgPSBsYXllci5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilcblx0XHRcdGlucHV0RWxlbWVudHMubGVuZ3RoLnNob3VsZC5lcXVhbCAxXG5cblx0XHRcdGlucHV0RWxlbWVudCA9IF8uZmlyc3QoaW5wdXRFbGVtZW50cylcblx0XHRcdGlucHV0RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJpZFwiKS5zaG91bGQuZXF1YWwgXCJoZWxsb1wiXG5cblx0ZGVzY3JpYmUgXCJGb3JjZSAyRFwiLCAtPlxuXG5cdFx0aXQgXCJzaG91bGQgc3dpdGNoIHRvIDJkIHJlbmRlcmluZ1wiLCAtPlxuXG5cdFx0XHRsYXllciA9IG5ldyBMYXllclxuXG5cdFx0XHRsYXllci5zdHlsZS53ZWJraXRUcmFuc2Zvcm0uc2hvdWxkLmVxdWFsIFwidHJhbnNsYXRlM2QoMHB4LCAwcHgsIDBweCkgc2NhbGUoMSkgc2NhbGUzZCgxLCAxLCAxKSBza2V3KDBkZWcsIDBkZWcpIHNrZXdYKDBkZWcpIHNrZXdZKDBkZWcpIHJvdGF0ZVgoMGRlZykgcm90YXRlWSgwZGVnKSByb3RhdGVaKDBkZWcpXCJcblxuXHRcdFx0bGF5ZXIuZm9yY2UyZCA9IHRydWVcblxuXHRcdFx0bGF5ZXIuc3R5bGUud2Via2l0VHJhbnNmb3JtLnNob3VsZC5lcXVhbCBcInRyYW5zbGF0ZSgwcHgsIDBweCkgc2NhbGUoMSkgc2tldygwZGVnLCAwZGVnKSByb3RhdGUoMGRlZylcIlxuXG5cblxuXG5cbiIsIlxuZGVzY3JpYmUgXCJVdGlsc1wiLCAtPlxuXG5cdGRlc2NyaWJlIFwidmFsdWVPckRlZmF1bHRcIiwgLT5cblxuXHRcdGl0IFwic2hvdWxkIGdldCBhIHZhbHVlXCIsIC0+XG5cdFx0XHRVdGlscy52YWx1ZU9yRGVmYXVsdCgxMCwgMCkuc2hvdWxkLmVxdWFsIDEwXG5cblx0XHRpdCBcInNob3VsZCBnZXQgdGhlIGRlZmF1bHQgdmFsdWVcIiwgLT5cblx0XHRcdFV0aWxzLnZhbHVlT3JEZWZhdWx0KG51bGwsIDApLnNob3VsZC5lcXVhbCAwXG5cblx0XHQjIGl0IFwic2hvdWxkIGdldCB0aGUgZmFsbGJhY2sgdmFsdWVcIiwgLT5cblx0XHQjIFx0VXRpbHMudmFsdWVPckRlZmF1bHQodW5kZWZpbmVkLCB1bmRlZmluZWQsIDApLnNob3VsZC5lcXVhbCAwXG5cblx0ZGVzY3JpYmUgXCJhcnJheUZyb21Bcmd1bWVudHNcIiwgLT5cblxuXHRcdGl0IFwic2hvdWxkIHdvcmtcIiwgLT5cblxuXHRcdFx0ZiA9IC0+IHJldHVybiBVdGlscy5hcnJheUZyb21Bcmd1bWVudHMgYXJndW1lbnRzXG5cblx0XHRcdGYoXCJhXCIpLnNob3VsZC5lcWwgW1wiYVwiXVxuXHRcdFx0ZihcImFcIiwgXCJiXCIpLnNob3VsZC5lcWwgW1wiYVwiLCBcImJcIl1cblx0XHRcdFxuXHRcdFx0ZihbXCJhXCJdKS5zaG91bGQuZXFsIFtcImFcIl1cblx0XHRcdGYoW1wiYVwiLCBcImJcIl0pLnNob3VsZC5lcWwgW1wiYVwiLCBcImJcIl1cblxuXHRcdFx0ZihcIm1vbmtleVwiKS5zaG91bGQuZXFsIFtcIm1vbmtleVwiXVxuXHRcdFx0ZihbXCJtb25rZXlcIl0pLnNob3VsZC5lcWwgW1wibW9ua2V5XCJdXG5cblx0ZGVzY3JpYmUgXCJwYXJzZUZ1bmN0aW9uXCIsIC0+XG5cblx0XHRpdCBcInNob3VsZCB3b3JrIHdpdGhvdXQgYXJndW1lbnRzXCIsIC0+XG5cdFx0XHRyZXN1bHQgPSBVdGlscy5wYXJzZUZ1bmN0aW9uIFwic3ByaW5nXCJcblx0XHRcdHJlc3VsdC5uYW1lLnNob3VsZC5lcXVhbCBcInNwcmluZ1wiXG5cdFx0XHRyZXN1bHQuYXJncy5zaG91bGQuZXFsIFtdXG5cblx0XHRpdCBcInNob3VsZCB3b3JrIHdpdGggYSBzaW5nbGUgYXJndW1lbnRcIiwgLT5cblx0XHRcdHJlc3VsdCA9IFV0aWxzLnBhcnNlRnVuY3Rpb24gXCJzcHJpbmcoMTAwKVwiXG5cdFx0XHRyZXN1bHQubmFtZS5zaG91bGQuZXF1YWwgXCJzcHJpbmdcIlxuXHRcdFx0cmVzdWx0LmFyZ3Muc2hvdWxkLmVxbCBbXCIxMDBcIl1cblxuXHRcdGl0IFwic2hvdWxkIHdvcmsgd2l0aCBtdWx0aXBsZSBhcmd1bWVudHNcIiwgLT5cblx0XHRcdHJlc3VsdCA9IFV0aWxzLnBhcnNlRnVuY3Rpb24gXCJzcHJpbmcoMTAwLDUwKVwiXG5cdFx0XHRyZXN1bHQubmFtZS5zaG91bGQuZXF1YWwgXCJzcHJpbmdcIlxuXHRcdFx0cmVzdWx0LmFyZ3Muc2hvdWxkLmVxbCBbXCIxMDBcIiwgXCI1MFwiXVxuXG5cdFx0aXQgXCJzaG91bGQgY2xlYW51cCBhcmd1bWVudHNcIiwgLT5cblx0XHRcdHJlc3VsdCA9IFV0aWxzLnBhcnNlRnVuY3Rpb24gXCJzcHJpbmcoMTAwICwgNTAgKVwiXG5cdFx0XHRyZXN1bHQubmFtZS5zaG91bGQuZXF1YWwgXCJzcHJpbmdcIlxuXHRcdFx0cmVzdWx0LmFyZ3Muc2hvdWxkLmVxbCBbXCIxMDBcIiwgXCI1MFwiXVxuXG5cdGRlc2NyaWJlIFwiYXJyYXlOZXh0XCIsIC0+XG5cblx0XHRpdCBcInNob3VsZCB3b3JrXCIsIC0+XG5cdFx0XHRVdGlscy5hcnJheU5leHQoW1wiYVwiLCBcImJcIiwgXCJjXCJdLCBcImFcIikuc2hvdWxkLmVxdWFsIFwiYlwiXG5cdFx0XHRVdGlscy5hcnJheU5leHQoW1wiYVwiLCBcImJcIiwgXCJjXCJdLCBcImJcIikuc2hvdWxkLmVxdWFsIFwiY1wiXG5cdFx0XHRVdGlscy5hcnJheU5leHQoW1wiYVwiLCBcImJcIiwgXCJjXCJdLCBcImNcIikuc2hvdWxkLmVxdWFsIFwiYVwiXG5cblx0ZGVzY3JpYmUgXCJhcnJheVByZXZcIiwgLT5cblxuXHRcdGl0IFwic2hvdWxkIHdvcmtcIiwgLT5cblx0XHRcdFV0aWxzLmFycmF5UHJldihbXCJhXCIsIFwiYlwiLCBcImNcIl0sIFwiYVwiKS5zaG91bGQuZXF1YWwgXCJjXCJcblx0XHRcdFV0aWxzLmFycmF5UHJldihbXCJhXCIsIFwiYlwiLCBcImNcIl0sIFwiYlwiKS5zaG91bGQuZXF1YWwgXCJhXCJcblx0XHRcdFV0aWxzLmFycmF5UHJldihbXCJhXCIsIFwiYlwiLCBcImNcIl0sIFwiY1wiKS5zaG91bGQuZXF1YWwgXCJiXCJcblxuXHRkZXNjcmliZSBcInNpemVNYXhcIiwgLT5cblxuXHRcdGl0IFwic2hvdWxkIHdvcmtcIiwgLT5cblxuXHRcdFx0VXRpbHMuc2l6ZU1heChbXG5cdFx0XHRcdHt3aWR0aDoxMDAsIGhlaWdodDoxMDB9LFxuXHRcdFx0XHR7d2lkdGg6MTAwLCBoZWlnaHQ6MTAwfSxcblx0XHRcdF0pLnNob3VsZC5lcWwge3dpZHRoOjEwMCwgaGVpZ2h0OjEwMH1cblxuXHRcdFx0VXRpbHMuc2l6ZU1heChbXG5cdFx0XHRcdHt3aWR0aDoxMDAwLCBoZWlnaHQ6MTAwMH0sXG5cdFx0XHRcdHt3aWR0aDoxMDAsIGhlaWdodDoxMDB9LFxuXHRcdFx0XSkuc2hvdWxkLmVxbCB7d2lkdGg6MTAwMCwgaGVpZ2h0OjEwMDB9XG5cblx0ZGVzY3JpYmUgXCJwYXRoSm9pblwiLCAtPlxuXG5cdFx0aXQgXCJzaG91bGQgd29ya1wiLCAtPlxuXHRcdFx0VXRpbHMucGF0aEpvaW4oXCJ0ZXN0XCIsIFwibW9ua2V5XCIpLnNob3VsZC5lcXVhbCBcInRlc3QvbW9ua2V5XCJcblxuXG5cdGRlc2NyaWJlIFwic2l6ZU1pblwiLCAtPlxuXG5cdFx0aXQgXCJzaG91bGQgd29ya1wiLCAtPlxuXG5cdFx0XHRVdGlscy5zaXplTWluKFtcblx0XHRcdFx0e3dpZHRoOjEwMCwgaGVpZ2h0OjEwMH0sXG5cdFx0XHRcdHt3aWR0aDoxMDAsIGhlaWdodDoxMDB9LFxuXHRcdFx0XSkuc2hvdWxkLmVxbCB7d2lkdGg6MTAwLCBoZWlnaHQ6MTAwfVxuXG5cdFx0XHRVdGlscy5zaXplTWluKFtcblx0XHRcdFx0e3dpZHRoOjEwMDAsIGhlaWdodDoxMDAwfSxcblx0XHRcdFx0e3dpZHRoOjEwMCwgaGVpZ2h0OjEwMH0sXG5cdFx0XHRdKS5zaG91bGQuZXFsIHt3aWR0aDoxMDAsIGhlaWdodDoxMDB9XG5cdFx0XG5cblx0ZGVzY3JpYmUgXCJmcmFtZU1lcmdlXCIsIC0+XG5cblx0XHRpdCBcInNob3VsZCB3b3JrXCIsIC0+XG5cblx0XHRcdGNvbXBhcmUgPSAoZnJhbWVzLCByZXN1bHQpIC0+XG5cdFx0XHRcdGZyYW1lID0gVXRpbHMuZnJhbWVNZXJnZSBmcmFtZXNcblx0XHRcdFx0Zm9yIHAgaW4gW1wieFwiLCBcInlcIiwgXCJ3aWR0aFwiLCBcImhlaWdodFwiXVxuXHRcdFx0XHRcdGZyYW1lW3BdLnNob3VsZC5lcXVhbCByZXN1bHRbcF0sIHBcblxuXHRcdFx0Y29tcGFyZSBbXG5cdFx0XHRcdHt4OjAsIHk6MCwgd2lkdGg6MTAwLCBoZWlnaHQ6MTAwfSxcblx0XHRcdFx0e3g6MCwgeTowLCB3aWR0aDoxMDAsIGhlaWdodDoxMDB9LFxuXHRcdFx0XSwgIHt4OjAsIHk6MCwgd2lkdGg6MTAwLCBoZWlnaHQ6MTAwfVxuXG5cdFx0XHRjb21wYXJlIFtcblx0XHRcdFx0e3g6MCwgeTowLCB3aWR0aDoxMDAsIGhlaWdodDoxMDB9LFxuXHRcdFx0XHR7eDowLCB5OjAsIHdpZHRoOjUwMCwgaGVpZ2h0OjUwMH0sXG5cdFx0XHRdLCAge3g6MCwgeTowLCB3aWR0aDo1MDAsIGhlaWdodDo1MDB9XG5cblx0XHRcdGNvbXBhcmUgW1xuXHRcdFx0XHR7eDowLCB5OjAsIHdpZHRoOjEwMCwgaGVpZ2h0OjEwMH0sXG5cdFx0XHRcdHt4OjEwMCwgeToxMDAsIHdpZHRoOjUwMCwgaGVpZ2h0OjUwMH0sXG5cdFx0XHRdLCAge3g6MCwgeTowLCB3aWR0aDo2MDAsIGhlaWdodDo2MDB9XG5cblx0XHRcdGNvbXBhcmUgW1xuXHRcdFx0XHR7eDoxMDAsIHk6MTAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDB9LFxuXHRcdFx0XHR7eDoxMDAsIHk6MTAwLCB3aWR0aDo1MDAsIGhlaWdodDo1MDB9LFxuXHRcdFx0XSwgIHt4OjEwMCwgeToxMDAsIHdpZHRoOjUwMCwgaGVpZ2h0OjUwMH1cblxuXHRcdFx0IyBCbGEgYmxhLiBUaGlzIHdvcmtzLiBEb2luZyBhIHZpc3VhbCBjb21wYXJpc29uIGlzIHNvIG11Y2ggZWFzaWVyXG5cdFx0XHQjIFN0YXJ0IHRoZSBjYWN0dXMgcHJvamVjdCBhbmQgZ28gdG8gL3Rlc3QuaHRtbFxuXG5cdGRlc2NyaWJlIFwiZnJhbWVQb2ludEZvck9yaWdpblwiLCAtPlxuXG5cdFx0aXQgXCJzaG91bGQgd29ya1wiLCAtPlxuXHRcdFx0VXRpbHMuZnJhbWVQb2ludEZvck9yaWdpbih7eDoxMDAsIHk6MTAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDB9LCAwLCAwKS5zaG91bGQuZXFsKFxuXHRcdFx0XHR7eDoxMDAsIHk6MTAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDB9KVxuXHRcdFx0VXRpbHMuZnJhbWVQb2ludEZvck9yaWdpbih7eDoxMDAsIHk6MTAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDB9LCAwLCAwKS5zaG91bGQuZXFsKFxuXHRcdFx0XHR7eDoxMDAsIHk6MTAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDB9KVxuXHRcdFx0VXRpbHMuZnJhbWVQb2ludEZvck9yaWdpbih7eDoxMDAsIHk6MTAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDB9LCAwLCAwKS5zaG91bGQuZXFsKFxuXHRcdFx0XHR7eDoxMDAsIHk6MTAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDB9KVxuXHRcdFx0VXRpbHMuZnJhbWVQb2ludEZvck9yaWdpbih7eDoxMDAsIHk6MTAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDB9LCAwLCAwKS5zaG91bGQuZXFsKFxuXHRcdFx0XHR7eDoxMDAsIHk6MTAwLCB3aWR0aDoxMDAsIGhlaWdodDoxMDB9KVxuXG5cblxuXG5cdCMgZGVzY3JpYmUgXCJkb21Mb2FkRGF0YVwiLCAoY2FsbGJhY2spIC0+XG5cblx0IyBcdGl0IFwic2hvdWxkIGxvYWQgZGF0YSBhc3luY1wiLCAoY2FsbGJhY2spIC0+XG5cblx0IyBcdFx0ZGF0YSA9IFV0aWxzLmRvbUxvYWREYXRhIFwic3RhdGljL3Rlc3QudHh0XCIsIChlcnIsIGRhdGEpIC0+XG5cdCMgXHRcdFx0ZGF0YS5zaG91bGQuZXF1YWwgXCJURVNUIEhFTExPXCJcblx0IyBcdFx0XHRjYWxsYmFjaygpXG5cblx0IyBcdGl0IFwic2hvdWxkIGxvYWQgdGhyb3cgZXJyb3Igb24gbm9uZXhpc3RpbmdcIiwgKGNhbGxiYWNrKSAtPlxuXG5cdCMgXHRcdGRhdGEgPSBVdGlscy5kb21Mb2FkRGF0YSBcInN0YXRpYy90ZXN0MTIzLnR4dFwiLCAoZXJyLCBkYXRhKSAtPlxuXHQjIFx0XHRcdGVyci5zaG91bGQuZXF1YWwgdHJ1ZVxuXHQjIFx0XHRcdGNhbGxiYWNrKClcblxuXHQjIGRlc2NyaWJlIFwiZG9tTG9hZERhdGFTeW5jXCIsIC0+XG5cblx0IyBcdGl0IFwic2hvdWxkIGxvYWQgZGF0YSBhc3luY1wiLCAtPlxuXHQjIFx0XHRkYXRhID0gVXRpbHMuZG9tTG9hZERhdGFTeW5jIFwic3RhdGljL3Rlc3QudHh0XCJcblx0IyBcdFx0ZGF0YS5zaG91bGQuZXF1YWwgXCJURVNUIEhFTExPXCJcblxuXHQjIFx0aXQgXCJzaG91bGQgbG9hZCB0aHJvdyBlcnJvciBvbiBub25leGlzdGluZ1wiLCAtPlxuXG5cdCMgXHRcdHRlc3QgPSAtPiBVdGlscy5kb21Mb2FkRGF0YVN5bmMoXCJzdGF0aWMvbm9uZXhpc3RpbmcudHh0XCIpXG5cdCMgXHRcdHRlc3Quc2hvdWxkLnRocm93KClcblxuXHRkZXNjcmliZSBcIm1vZHVsYXRlXCIsIC0+XG5cblx0XHRpdCBcInNob3VsZCBoYXZlIHRoZSByaWdodCByZXN1bHRzXCIsIC0+XG5cdFx0XHRVdGlscy5tb2R1bGF0ZSgwLjUsIFswLCAxXSwgWzAsIDEwMF0pLnNob3VsZC5lcXVhbCA1MFxuXHRcdFx0VXRpbHMubW9kdWxhdGUoMSwgWzAsIDFdLCBbMCwgMTAwXSkuc2hvdWxkLmVxdWFsIDEwMFxuXHRcdFx0XG5cdFx0XHRVdGlscy5tb2R1bGF0ZSgyLCBbMCwgMV0sIFswLCAxMDBdLCB0cnVlKS5zaG91bGQuZXF1YWwgMTAwXG5cdFx0XHRVdGlscy5tb2R1bGF0ZSgyLCBbMCwgMV0sIFswLCAxMDBdLCBmYWxzZSkuc2hvdWxkLmVxdWFsIDIwMFxuXG5cdFx0XHRVdGlscy5tb2R1bGF0ZSgwLCBbMSwgMl0sIFswLCAxMDBdLCB0cnVlKS5zaG91bGQuZXF1YWwgMFxuXHRcdFx0VXRpbHMubW9kdWxhdGUoMCwgWzEsIDJdLCBbMCwgMTAwXSwgZmFsc2UpLnNob3VsZC5lcXVhbCAtMTAwXG5cblx0XHRcdFV0aWxzLm1vZHVsYXRlKDAsIFsxLCAyXSwgWzEwMCwgMF0sIHRydWUpLnNob3VsZC5lcXVhbCAxMDBcblx0XHRcdFV0aWxzLm1vZHVsYXRlKDAsIFsxLCAyXSwgWzEwMCwgMF0sIGZhbHNlKS5zaG91bGQuZXF1YWwgMjAwXG5cblx0ZGVzY3JpYmUgXCJ0ZXh0U2l6ZVwiLCAtPlxuXG5cdFx0IyBUb2RvOiBmb3Igc29tZSByZWFzb24gdGhlc2UgZG9uJ3Qgd29yayByZWxpYWJsZSBpbiBwaGFudG9tanNcblxuXHRcdHRleHQgID0gXCJIZWxsbyBLb2VuIEJva1wiXG5cdFx0c3R5bGUgPSB7Zm9udDpcIjIwcHgvMWVtIE1lbmxvXCJ9XG5cblx0XHQjIGl0IFwic2hvdWxkIHJldHVybiB0aGUgcmlnaHQgc2l6ZVwiLCAtPlxuXHRcdCMgXHRVdGlscy50ZXh0U2l6ZSh0ZXh0LCBzdHlsZSkuc2hvdWxkLmVxbCh7d2lkdGg6MTY4LCBoZWlnaHQ6MjB9KVxuXG5cdFx0IyBpdCBcInNob3VsZCByZXR1cm4gdGhlIHJpZ2h0IHNpemUgd2l0aCB3aWR0aCBjb25zdHJhaW50XCIsIC0+XG5cdFx0IyBcdFV0aWxzLnRleHRTaXplKHRleHQsIHN0eWxlLCB7d2lkdGg6MTAwfSkuc2hvdWxkLmVxbCh7d2lkdGg6MTAwLCBoZWlnaHQ6NDB9KVxuXG5cdFx0IyBpdCBcInNob3VsZCByZXR1cm4gdGhlIHJpZ2h0IHNpemUgd2l0aCBoZWlnaHQgY29uc3RyYWludFwiLCAtPlxuXHRcdCMgXHRVdGlscy50ZXh0U2l6ZSh0ZXh0LCBzdHlsZSwge2hlaWdodDoxMDB9KS5zaG91bGQuZXFsKHdpZHRoOjE2OCxoZWlnaHQ6MTAwKVxuXG5cblxuXG5cblxuXG5cblxuXG5cblx0XHRcdCIsImRlc2NyaWJlIFwiVmlkZW9MYXllclwiLCAtPlxuXG5cdGRlc2NyaWJlIFwiRGVmYXVsdHNcIiwgLT5cblxuXHRcdCMgVGhpcyBhbGx3YXlzIGVycnMgaW4gU2FmYXJpXG5cdFx0aWYgbm90IFV0aWxzLmlzU2FmYXJpKClcblx0XHRcdGl0IFwic2hvdWxkIGNyZWF0ZSB2aWRlb1wiLCAtPlxuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0dmlkZW9MYXllciA9IG5ldyBWaWRlb0xheWVyIHZpZGVvOlwic3RhdGljL3Rlc3QubXA0XCJcblx0XHRcdFx0dmlkZW9MYXllci5wbGF5ZXIuc3JjLnNob3VsZC5lcXVhbCBcInN0YXRpYy90ZXN0Lm1wNFwiXG4iXX0=
