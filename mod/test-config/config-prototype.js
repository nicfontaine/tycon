(function(){"use strict"})()

/******************************************************
Basic session config prototype
All data is set before a test, and remains unchanged during

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
		},
		colour: {
			good: "green", // Will be changed to "blue" if colourBlind === true
			bad: "red",
			cb: "blue" // Holder for colour-blind colour
		}
	}

	this.test = {
		period: 60, // In seconds
		diffOptions: ["easy", "med", "hard"],
		difficulty: 1, // easy med hard indices
		skip: false, // If true, force correct entry before next word
		caps: false, // Randomly capitalize first letter. Scales w/ difficulty
		// Key input to ignore when typing
		reject: [
			"undefined",
			"escape",
			"tab",
			"left",
			"right",
			"up",
			"down",
			"pageup",
			"pagedown",
			"home",
			"end",
			"delete"
		]
		
	}

}

module.exports = config
