const out = require("./out.js") // Console output
const SystemConfig = require("./system/system-config.js")
const SystemWordHandler = require("./system/word-handler.js")

function handler() {

	let parent = this

	// Check if user input so far matches active word
	this.check = function(typed) {
		// Word fully correct
		if (typed === SystemConfig.wordSet[0]) {
			SystemWordHandler.colours.success()
		}
		// Word correct so far
		else if (typed == SystemConfig.wordSet[0].substring(0, typed.length)) {
			SystemWordHandler.colours.good()
		}
		// Word incorrect
		else {
			SystemWordHandler.colours.bad()
		}
	}

	// Calculate average wpm at any time by taking current time & typed words
	this.avg = function(udata, length, remain) {
		let num = Math.floor((udata.stats.correct * 60) / (length - remain))
		// NaN on first tick
		if (isNaN(num) || num === Infinity) { num = 0 }
		if (remain < 1) { num = 0 }
		// Save
		udata.prevAvg = num
		return num
	}

	// Handle key input for output
	this.proc = function(key, udata) {
		// Shift to upper
		if (key.shift) {
			udata.current += key.name.toUpperCase()
		} else {
			udata.current += key.name
		}
		parent.check(udata.current)
		out.system.words(SystemWordHandler.format)
		// Print word
		out.user.current(udata.current)
	}

	// Clear input log
	this.clear = function(udata) {
		udata.current = ""
	}

	// Prompt next word for typing
	this.next = function(udata, remain, prevAvg) {
		parent.clear(udata)
		let nextSet = SystemWordHandler.next()
		SystemWordHandler.colours.good()
		out.next(remain, prevAvg, nextSet)
	}

	// Run when incorrect word is entered
	this.incorrect = function(udata) {
		// (Note) flash error for a second before cleaning
		parent.clear(udata)
		SystemWordHandler.colours.bad()
		out.system.words(SystemWordHandler.format)
		out.user.current(udata.current)
	}
	
}

module.exports = handler