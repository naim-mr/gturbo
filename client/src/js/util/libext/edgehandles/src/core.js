const Edgehandles = require('./edgehandles')
const assign = require('./assign')

module.exports = function (options) {
  const cy = this

  return new Edgehandles(assign({ cy }, options))
}
