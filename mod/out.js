(function(){"use strict"})()

const chalk = require("chalk") // Console text styling
const chart = require("asciichart") // Chart results
const zero = require("./format/zero.js") // Leading zero-ify
const TestConfig = require("./config/test-config.js")

var out = {

	// Clear console
	clear: function() {
		process.stdout.write("\033c")
	},

	newline: function() {
		console.log(chalk.gray(" _"))
		console.log("")
	},

	init: function(colour) {
		out.clear()
		let diffStr = TestConfig.info.test.diffOptions[TestConfig.info.test.difficulty]
		console.log(colour("[Tycon]") + " Level: " + chalk.bold(diffStr.toUpperCase()))
		console.log("")
		out.shortcuts()
		console.log("")
	},

	ready: function(format) {
		console.log(" " + format())
		out.newline()
	},

	// (NOTE) This needs the showAvg flag for out.stats
	next: function(remain, avg, format) {
		out.stats(remain, avg, TestConfig.info)
		console.log(" " + format())
		out.newline()
	},

	system: {
		words: function(format) {
			console.log(" " + format())
		}
	},

	user: {
		current: function(text) {
			console.log(" " + chalk.bold(text) + chalk.gray("_"))
			console.log("")
		}
	},

	// Show typing stats, Time left, and Avg. typed
	statsTick: function(remain, avg) {
		out.clear()
		let avgTxt = ""
		let timeTxt = ""
		if (TestConfig.info.display.show.avg) {
			avgTxt = "Avg: " + chalk.bold(zero(avg))
		}
		if (TestConfig.info.display.show.time) {
			timeTxt = zero(remain)
		}
		if (!TestConfig.info.display.show.time && !TestConfig.info.display.show.avg) {
			console.log("[Test Running]")
		} else if (TestConfig.info.display.show.time && TestConfig.info.display.show.avg) {
			console.log(chalk.bold("[" + timeTxt + " " + avgTxt + "]"))
		} else {
			console.log(chalk.bold("[" + timeTxt +  avgTxt + "]"))
		}
		console.log("")
	},

	// Same as statsTick(), but use last avg value instead of incorrectly calculating it
	// (NOTE) Should probably fix, and not be redundant
	stats: function(remain, prevAvg) {
		out.clear()
		let avgTxt = ""
		let timeTxt = ""
		if (TestConfig.info.display.show.avg) {
			avgTxt = "Avg: " + chalk.bold(zero(prevAvg))
		}
		if (TestConfig.info.display.show.time) {
			timeTxt = zero(remain)
		}
		if (!TestConfig.info.display.show.time && !TestConfig.info.display.show.avg) {
			console.log("[Test Running]")
		} else if (TestConfig.info.display.show.time && TestConfig.info.display.show.avg) {
			console.log(chalk.bold("[" + timeTxt + " " + avgTxt + "]"))
		} else {
			console.log(chalk.bold("[" + timeTxt +  avgTxt + "]"))
		}
		console.log("")
	},

	// Complete state, show Correct, Incorrect, and Hotkeys
	complete: function(len, uData, systext) {
		out.clear()
		// Reset, in case we finish on incorrect letter
		systext.colours.good()
		let diffStr = TestConfig.info.test.diffOptions[TestConfig.info.test.difficulty]
		console.log(systext.colours.c("[Complete] ") + len + " seconds, " + chalk.bold(diffStr.toUpperCase()))
		console.log("")
		console.log("WPM:       " + chalk.bold((uData.stats.correct * 60) / len))
		console.log("Correct:   " + (chalk.bold(uData.stats.correct)))
		console.log("Incorrect: " + uData.stats.incorrect)
		console.log("Backspace: " + uData.stats.backspace)
		console.log("")
		// (Note) sporadic issue here from asciichart complaining about array length.
		if (uData.stats.log.wpmArray.length > 0) {
			console.log(chart.plot(uData.stats.log.wpmArray, { height: 5}))
		}
		console.log("")
		out.shortcuts()
		console.log("")
	},

	// Quit app. log exit message, and exit process
	quit: function() {
		out.clear()
		console.log("Tycon says \"Bye!\"")
	},

	// Instructions for Start / Exit shortcuts
	shortcuts: function() {
		console.log(chalk.inverse("^R") + " Start")
		console.log(chalk.inverse("^C") + " Exit")
	},

	// Just for testing. Clear & output message
	test: function(msg) {
		out.clear()
		console.log(msg)
	}

}

module.exports = out