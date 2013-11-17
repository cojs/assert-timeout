var co = require('co')
var ms = require('ms')

module.exports = function (fn, timeout, logger) {
  return function (done) {
    if (isGenerator(fn) || isGeneratorFunction(fn))
      fn = co.call(this, fn)
    if (typeof timeout === 'string')
      timeout = ms(timeout)
    if (typeof timeout !== 'number')
      throw new TypeError('invalid timeout')

    var ctx = this
    var called = false

    var id = setTimeout(function () {
      var err = new Error('timeout of ' + timeout + 'ms exceeded')
      err.status = 408
      err.timeout = timeout
      called = true
      done(err)
    }, timeout)

    fn(function (err) {
      if (called) {
        if (logger && err)
          logger(err)
        return
      }

      clearTimeout(id)
      done.apply(ctx, arguments)
    })
  }
}

/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isGenerator(obj) {
  return obj
    && 'function' === typeof obj.next
    && 'function' === typeof obj.throw
}

/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isGeneratorFunction(obj) {
  return obj
    && obj.constructor
    && 'GeneratorFunction' === obj.constructor.name
}