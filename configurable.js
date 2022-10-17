var engine = require('./engine');
var defaults = require('./defaults');

module.exports = function(overridenOptions) {
  return engine({ ...defaults, ...overridenOptions });
};
