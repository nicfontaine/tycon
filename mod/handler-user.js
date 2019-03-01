const out = require("./out.js") // Console output

function handler() {

	let parent = this

	// Check if user input so far matches active word
	this.check = function(systext, typed) {
		// Word fully correct
		if (typed === systext.array[0]) {
			systext.colours.success()
		}
		// Word correct so far
		else if (typed == systext.array[0].substring(0, typed.length)) {
			systext.colours.good()
		}
		// Word incorrect
		else {
			systext.colours.bad()
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
	this.proc = function(key, systext, udata) {
		// Shift to upper
		if (key.shift) {
			udata.current += key.name.toUpperCase()
		} else {
			udata.current += key.name
		}
		parent.check(systext, udata.current)
		out.system.words(systext.format)
		// Print word
		out.user.current(udata.current)
	}

	// Clear input log
	this.clear = function(udata) {
		udata.current = ""
	}

	// Prompt next word for typing
	this.next = function(systext, udata, remain, prevAvg, showAvg) {
		parent.clear(udata)
		let nextSet = systext.next(remain, prevAvg)
		systext.colours.good()
		out.next(remain, prevAvg, nextSet, showAvg)
	}

	// Run when incorrect word is entered
	this.incorrect = function(systext, udata) {
		// (Note) flash error for a second before cleaning
		parent.clear(udata)
		systext.colours.bad()
		out.system.words(systext.format)
		out.user.current(udata.current)
	}
	
}

module.exports = handler