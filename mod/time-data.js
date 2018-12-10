var data = function(testLength) {
	let obj = {
		begin: undefined,  // Stamp start time for calc remaining
		remaining: 0,      // Countdown number from test length. Helps determine if running, or complete
		timer: undefined,  // Keep reference of timer
		testLen: testLength // Length of test
	}
	return obj
}

module.exports = data