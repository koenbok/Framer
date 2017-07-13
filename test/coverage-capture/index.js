
'use strict';
// Note that this is called from PhantomJS
// and does not have access to node modules

var system = require('system');
var fs = require('fs');

var collectCoverage;

collectCoverage = function(page) {

  console.log('collecting...');
  var coverage = page.evaluate(function() {
    var data, field, file, json;
    // Collect the main coverage object from the browser:
    data = window._$jscoverage;

    // The object has natural numbers for field names. This makes
    // JS  think it is an array on transforming it to JSON, foregoing
    // the 'source' field that's also present. Fix this by putting the
    // array in a "coverage" field, and keeping "source". This is also
    // how the coverage reporter expects the JSON to be formatted:

    for (field in data) {
      file = data[field] = {
        coverage: data[field],
        source: data[field].source
      };
      delete file.coverage.source;
    }
    return data
  });

  // fail gracefully when we don't have coverage
  if (!coverage) {
    return;
  }

  // read coverageFile from mocha-phantomjs args
  var phantomOpts = JSON.parse(system.args[system.args.length-1]);
  var coverageFile = phantomOpts.coverageFile || 'coverage/coverage.json';

  // write coverage to file
  var json = JSON.stringify(coverage, " ");
  fs.write(coverageFile, json);
}

// beforeStart and afterEnd hooks for mocha-phantomjs
module.exports = {
  afterEnd: function(runner) {
    collectCoverage(runner.page);
  }
};