(function(){"use strict"})()

/******************************************************
Basic test data prototype
Data will be initialized, then updated during test run

.system     Hold set of words, time info
.user       Hold current word, stats including avgs, correct, etc
*******************************************************/

// Global config variables
function store() {

	this.system = {
		// Holds words generated, to be typed by user
		wordSet: [],
		colour: {
			current: undefined // Store currently used chalk value
		},
		time: {
			begin: undefined, // Stamp start time for calc remaining
			remaining: 0, // Countdown number from test length. Helps determine if running, or complete
			timer: undefined // Keep reference of timer
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

	this.lines = {
		test: {
			stats: 0,
			words: 2,
			user: 3
		}
	}

}

module.exports = store
