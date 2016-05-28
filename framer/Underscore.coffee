# This allows us to switch out the underscore utility library
exports._ = require "lodash"

# Backwards compatibility for older lodash

_.pluck = _.map