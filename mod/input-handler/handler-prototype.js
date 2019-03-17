const out = require("./../out.js") // Console output
const SystemWordHandler = require("./../system/word-handler.js")
const TestData = require("./../test-data/data.js")
const TestConfig = require("./../test-config/config.js")

function handler() {

	let parent = this

	// Check if user input so far matches active word
	this.check = function() {
		let current = TestData.store.user.current
		// Word fully correct
		if (current === TestData.store.system.wordSet[0]) {
			SystemWordHandler.colours.success()
		}
		// Word correct so far
		else if (current == TestData.store.system.wordSet[0].substring(0, current.length)) {
			SystemWordHandler.colours.good()
		}
		// Word incorrect
		else {
			SystemWordHandler.colours.bad()
		}
	}

	// Calculate average wpm at any time by taking current time & typed words
	this.avg = function() {
		let num = Math.floor((TestData.store.user.stats.correct * 60) / (TestConfig.store.test.period - TestData.store.system.time.remaining))
		// NaN on first tick
		if (isNaN(num) || num === Infinity) { num = 0 }
		if (TestData.store.system.remaining < 1) { num = 0 }
		// Save
		TestData.store.user.prevAvg = num
		return num
	}

	// Handle key input for output
	this.proc = function(key) {
		// Shift to upper
		if (key.shift) {
			TestData.store.user.current += key.name.toUpperCase()
		} else {
			TestData.store.user.current += key.name
		}
		parent.check()
		out.system.words()
		// Print word
		out.user.current()
	}

	// Clear input log
	this.clear = function() {
		TestData.store.user.current = ""
	}

	// Prompt next word for typing
	this.next = function() {
		parent.clear()
		let nextSet = SystemWordHandler.next()
		SystemWordHandler.colours.good()
		out.next()
	}

	// Run when incorrect word is entered
	this.incorrect = function() {
		// (Note) flash error for a second before cleaning
		parent.clear()
		SystemWordHandler.colours.bad()
		out.system.words()
		out.user.current()
	}
	
}

module.exports = handler