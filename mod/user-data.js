function data() {

	// Store value of currently typed word
	this.current = ""

	// Keep avg calculated at interval, to display on typing input (b/c avging outside of interval is inaccurate)
	this.prevAvg =  0

	// User typing stats. Correct, incorrect, avgs, averaging
	this.stats = {
		correct: 0,
		incorrect: 0,
		backspace: 0,
		log: {
			// Hold avg wpm at interval
			wpmArray: []
		}
	}

}

module.exports = data