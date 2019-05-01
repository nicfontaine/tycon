(function(){"use strict"})()

const AppConfig = require("./app-config.js")

/******************************************************
Create & store unique test config

.store       Stored test config
.create()   Create test config on app run with process.argv
*******************************************************/

var Test = {

	// Unique test config will be stored here
	store: {},

	create: function() {

		Test.store = new proto()

	},
	
	// Generate test config from args and prototype
	// Store in Test.store
	update: function(answers) {

		if (Test.store.test != undefined) {

			// In case we aren't setting new values from menu, just use default (works fine)
			if (answers) {

				Test.store.test.period = Number(answers.period)

				// Flags
				if (answers.flags) {
					Test.store.test.difficulty = AppConfig.test.diffOptions.indexOf(answers.difficulty)
					Test.store.display.colourBlind = answers.colourBlind
					if (answers.colourBlind) {
						Test.store.display.colour.good = AppConfig.display.colour.goodCB
					}
					// Need to reset if changing from previous settings options
					else {
						Test.store.display.colour.good = AppConfig.display.colour.good
					}
					Test.store.test.requireCorrect = answers.requireCorrect
					Test.store.test.caps = answers.caps
					Test.store.display.show.avg = answers.showAvg
					Test.store.display.show.time = answers.showTime
				}

			}

		}
		else {
			throw("TestConfig.store has not been created yet. Cannot update")
		}

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
			good: AppConfig.display.colour.good, // Green or blue, depending on colour blind status flag
			bad: AppConfig.display.colour.bad,
		}
	}

	this.test = {
		period: 60, // In seconds
		difficulty: 1, // easy med hard indices
		requireCorrect: false, // If true, force correct entry before next word
		caps: false // Randomly capitalize first letter. Scales w/ difficultyo
	}

}

module.exports = Test