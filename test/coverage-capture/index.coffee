# This is required to be a module in order for the Mocha-PhantomJS
# Gulp task to be able to invoke it as a hook.
#
# When PhantomJS is finished, but before it has closed the headless
# browser window, the "collectCoverage" routine will be invoked. It
# saves the coverage data to a .json file.
#
# Inspired by https://github.com/willembult/mocha-phantomjs-istanbul

fs = require "fs"

collectCoverage = (page) ->

  console.log "collecting..."

  coverage = page.evaluate (() ->
    # Collect the main coverage object from the browser:
    data = window._$jscoverage

    # The object has natural numbers for field names. This makes
    # JS  think it is an array on transforming it to JSON, foregoing
    # the 'source' field that's also present. Fix this by putting the
    # array in a "coverage" field, and keeping "source". This is also
    # how the coverage reporter expects the JSON to be formatted:
    for field of data
      file = data[field] =
        coverage: data[field]
        source: data[field].source

      delete file.coverage.source

    return JSON.stringify data, " "
  )

  # Save the date to file:
  fs.write "build/coverage/jscoverage.json", coverage

module.exports =
  afterEnd: (runner) ->
    collectCoverage(runner.page)
