module.exports = function(workFunc, interval) {
  var flag = false
  var that = this
  var expected
  var timeout
  this.interval = interval

  this.start = function() {
    flag = true
    expected = Date.now() + this.interval;
    timeout = setTimeout(step, this.interval)
  }

  this.stop = function() {
    flag = false
    clearTimeout(timeout)
  }

  function step() {
    if (flag) {
      var drift = Date.now() - expected
      if (drift > that.interval) {
        // You could have some default stuff here too...
        if (errorFunc) errorFunc()
      }
      workFunc()
      expected += that.interval
      timeout = setTimeout(step, Math.max(0, that.interval-drift))
    } else {
      clearTimeout(timeout)
    }
  }
}