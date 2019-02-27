function data(testLength) {
	this.begin = undefined  // Stamp start time for calc remaining
	this.remaining = 0      // Countdown number from test length. Helps determine if running, or complete
	this.timer = undefined  // Keep reference of timer
	this.testLen = testLength // Length of test
}

module.exports = data