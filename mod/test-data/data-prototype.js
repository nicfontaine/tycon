(function(){"use strict"})()

/******************************************************

*******************************************************/

// Global config variables
function data() {

	this.system = {
		// Holds words generated, to be typed by user
		wordSet: [],
		time: {
			begin: undefined // Stamp start time for calc remaining
			remaining: 0, // Countdown number from test length. Helps determine if running, or complete
			timer: undefined, // Keep reference of timer
			duration: undefined // Length of test
		}
	}

	this.user = {
		// Store value of currently typed word
		current: "",
		// Keep avg calculated at interval, to display on typing input (b/c avging outside of interval is inaccurate)
		prevAvg: 0,
		// User typing stats. Correct, incorrect, avgs, averaging
		stats: {
			correct: 0,
			incorrect: 0,
			backspace: 0,
			avgs: []  // Hold avg wpm at interval
		}

	}

}

module.exports = data
