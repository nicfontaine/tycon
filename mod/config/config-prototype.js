(function(){"use strict"})()

/******************************************************
Basic session config prototype

.display    Display settings: colourblind mode, stats on/off, word line length
.test       Test settings: length, difficulty, skip, caps
*******************************************************/

// Global config variables
function config() {

	this.display = {
		maxWordsPerLine: 5, // Test prompt words to display in single line
		colourBlind: false, // Flag for blue/red instead of green/red
		show: {
			avg: true, // Flag to show or hide Avg WPM during test
			time: true // Flag to show or hide current time during test
		}
	}

	this.test = {
		period: 60, // In seconds
		diffOptions: ["easy", "med", "hard"],
		difficulty: 1, // easy med hard indices
		skip: false, // If true, force correct entry before next word
		caps: false // Randomly capitalize first letter. Scales w/ difficulty
	}

}

module.exports = config
