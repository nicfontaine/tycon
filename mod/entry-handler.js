(function(){"use strict"})()

/******************************************************
Create & store unique test config
.f           Stored input handler functions
.create()    Create handler from prototype
*******************************************************/

var Handler = {

	// Unique test config will be stored here
	f: {},
	
	// Generate test config from args, and store in info{}
	create: function() {
		Handler.f = new proto()
	}

}

module.exports = Handler


const SystemWordHandler = require("./system-word-handler.js")
const TestConfig = require("./test-config.js")
const TestData = require("./test-data.js")
const out = require("./out.js") // Console output
const ColourManager = require("./colour-manager.js")

/*
Prototype
*/
function proto() {

	let parent = this

	// Check if user input so far matches active word
	this.check = function() {
		let current = TestData.store.user.current
		let word = TestData.store.system.wordSet[0]
		// Word fully correct
		if (current === word) {
			ColourManager.f.success()
		}
		// Word correct so far
		else if (current == word.substring(0, current.length)) {
			ColourManager.f.good()
		}
		// Word incorrect
		else {
			ColourManager.f.bad()
		}
	}

	// Calculate average wpm at any time by taking current time & typed words
	this.avg = function() {
		// let num = Math.floor((TestData.store.user.stats.correct * 60) / (TestConfig.store.test.period - TestData.store.system.time.remaining))
		let num = Math.floor((TestData.store.user.stats.correct * 60) / TestData.store.system.time.spent)
		// NaN on first tick
		if (isNaN(num) || num === Infinity) { num = 0 }
		if (TestData.store.system.remaining < 1) { num = 0 }
		// Save
		TestData.store.user.prevAvg = num
		return num
	}

	// Handle key input for typing characters, like letters, that may need shift/ctrl data
	this.key = function(load) {
		// Shift to upper
		if (load.shift) {
			TestData.store.user.current += load.name.toUpperCase()
		} else {
			TestData.store.user.current += load.name
		}
		parent.check()
	},

	// Handle key input for basic characters, like punctuation
	this.char = function(load) {
		TestData.store.user.current += load
		parent.check()
	},

	// Clear input log
	this.clear = function() {
		TestData.store.user.current = ""
		ColourManager.f.good()
	}
	
}