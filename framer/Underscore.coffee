# This allows us to switch out the underscore utility library

_ = require "lodash"

_.str = require 'underscore.string'
_.mixin _.str.exports()

exports._ = _
