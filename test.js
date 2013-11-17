var assert = require('assert')

var assertTimeout = require('./')

describe('Assert Timeout', function () {
  describe('with generator functions', function () {
    it('should work when timeout < time', function (done) {
      assertTimeout(generator, 0)(function (err) {
        assert.ok(err)
        assert.equal(err.status, 408)
        done()
      })
    })

    it('should work when timeout > time', function (done) {
      assertTimeout(generator, 20)(function (err, value) {
        assert.ifError(err)
        assert.ok(value)
        done()
      })
    })
  })

  describe('with generators', function () {
    it('should work when timeout < time', function (done) {
      assertTimeout(generator(), 0)(function (err) {
        assert.ok(err)
        assert.equal(err.status, 408)
        done()
      })
    })

    it('should work when timeout > time', function (done) {
      assertTimeout(generator(), 20)(function (err, value) {
        assert.ifError(err)
        assert.ok(value)
        done()
      })
    })
  })

  describe('with thunks', function () {
    it('should work when timeout < time', function (done) {
      assertTimeout(thunk, 0)(function (err) {
        assert.ok(err)
        assert.equal(err.status, 408)
        done()
      })
    })

    it('should work when timeout > time', function (done) {
      assertTimeout(thunk, 20)(function (err, value) {
        assert.ifError(err)
        assert.ok(value)
        done()
      })
    })
  })
})

function thunk(done) {
  setTimeout(function () {
    done(null, true)
  }, 10)
}

function* generator() {
  return yield thunk
}