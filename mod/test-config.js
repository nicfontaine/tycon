(function(){"use strict"})()

/******************************************************
Create & store unique test config

.store       Stored test config
.create()   Create test config on app run with process.argv
*******************************************************/

var Test = {

	// Unique test config will be stored here
	store: {},
	
	// Generate test config from args
	// Pass prototype
	// Store in store{}
	create: function(answers) {
		let testConf = new proto()

		// In case we aren't setting new values from menu, just use default (works fine)
		if (answers) {
			testConf.test.period = Number(answers.period)
			testConf.test.difficulty = testConf.test.diffOptions.indexOf(answers.difficulty)
			testConf.test.colourBlind = answers.colourBlind
			testConf.test.requireCorrect = answers.requireCorrect
			testConf.test.caps = answers.caps
		}

		Test.store = testConf
	}

}

/*
Basic session config prototype
All data is set before a test, and remains unchanged during

.display    Display settings: colourblind mode, stats on/off, word line length
.test       Test settings: length, difficulty, skip, caps
*/

function proto() {

	this.display = {
		maxWordsPerLine: 5, // Test prompt words to display in single line
		colourBlind: false, // Flag for blue/red instead of green/red
		// (NOTE) Currently unused, but option is supported in code
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
		requireCorrect: false, // If true, force correct entry before next word
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

module.exports = Test