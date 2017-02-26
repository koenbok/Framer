// This allows us to switch out the underscore utility library
let _$1 = require("lodash");

// Backwards compatibility for older lodash

export { _$1 as _ };
_.pluck = _.map;
