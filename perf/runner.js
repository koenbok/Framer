// Part of OpenPhantomScripts
// http://github.com/mark-rushakoff/OpenPhantomScripts

// Copyright (c) 2012 Mark Rushakoff

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

var fs = require("fs");
var args, url, lengthOkay, appName, system;
try {
    system = require("system");
    // if we got here, we are on PhantomJS 1.5+
    args = system.args;
    lengthOkay = (args.length === 2);
    appName = args[0];
    url = args[1];
} catch (e) {
    // otherwise, assume PhantomJS 1.4
    args = phantom.args;
    lengthOkay = (args.length === 1);
    appName = 'phantom-mocha.js'
    url = args[0];
}

if (!lengthOkay) {
    printError("Usage: " + appName + " URL");
    phantom.exit(1);
}

function printError(message) {
    fs.write("/dev/stderr", message + "\n", "w");
}

var page = require("webpage").create();

function isPhantomAttached() {
    return page.evaluate(function() {return window.phantomAttached})
}

page.onResourceReceived = function() {
    //attach the end event handler to all mocha.Runner instances
    page.evaluate(function() {
        if (window.phantomAttached) return;

        // (function () {
        //     this.on("fail", function (test, err) {
        //         var current = test, title = [];
        //         do { title.push(current.title) } while (current = current.parent);
        //         title = title.reverse().slice(1).join(' ');
        //         console.log(title + ":\n" + err + "\n");
        //     });
        //     this.on("end", function() {
        //         window.phantomComplete = true;
        //         window.phantomResults = this.stats;
        //     });
        // }).call(/* new version */ ((window.Mocha && window.Mocha.Runner) || /* old version */ window.mocha.Runner).prototype);

        window.phantomAttached = true;
    });
}

page.onConsoleMessage = function(message) {
    console.log(message);
}

page.open(url, function(success) {
    if (success === "success") {
        if (!isPhantomAttached()) {
            printError("Phantom callbacks not attached in time.  See http://github.com/mark-rushakoff/OpenPhantomScripts/issues/1");
            phantom.exit(1);
        }

        setInterval(function() {
            if (page.evaluate(function() {return window.phantomComplete;})) {
                phantom.exit();
            }
        }, 250);
    } else {
        printError("Failure opening " + url);
        phantom.exit(1);
    }
});