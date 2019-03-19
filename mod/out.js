(function(){"use strict"})()

const chalk = require("chalk") // Console text styling
const chart = require("asciichart") // Chart results
const zero = require("./format/zero.js") // Leading zero-ify
const TestConfig = require("./test-config/config.js")
const SystemWordHandler = require("./system/word-handler.js")
const TestData = require("./test-data/data.js")

var out = {

	// Clear console
	clear: function() {
		process.stdout.write("\033c")
	},

	newline: function() {
		console.log(chalk.gray(" _"))
		console.log("")
	},

	init: function() {
		SystemWordHandler.colours.good()
		let colour = TestData.store.system.colour.current
		out.clear()
		let diffStr = TestConfig.store.test.diffOptions[TestConfig.store.test.difficulty]
		console.log(colour("[Tycon]") + " Level: " + chalk.bold(diffStr.toUpperCase()))
		console.log("")
		out.shortcuts()
		console.log("")
	},

	ready: function() {
		SystemWordHandler.colours.good()
		console.log(" " + SystemWordHandler.format())
		out.newline()
	},

	// (NOTE) This needs the showAvg flag for out.stats
	next: function() {
		out.stats()
		console.log(" " + SystemWordHandler.format())
		out.newline()
	},

	system: {
		words: function() {
			console.log(" " + SystemWordHandler.format())
		}
	},

	user: {
		current: function() {
			console.log(" " + chalk.bold(TestData.store.user.current) + chalk.gray("_"))
			console.log("")
		}
	},

	// Show typing stats, Time left, and Avg. typed
	statsTick: function(avg) {
		out.clear()
		let avgTxt = ""
		let timeTxt = ""
		if (TestConfig.store.display.show.avg) {
			avgTxt = "Avg: " + chalk.bold(zero(avg))
		}
		if (TestConfig.store.display.show.time) {
			timeTxt = zero(TestData.store.system.time.remaining)
		}
		if (!TestConfig.store.display.show.time && !TestConfig.store.display.show.avg) {
			console.log("[Test Running]")
		} else if (TestConfig.store.display.show.time && TestConfig.store.display.show.avg) {
			console.log(chalk.bold("[" + timeTxt + " " + avgTxt + "]"))
		} else {
			console.log(chalk.bold("[" + timeTxt +  avgTxt + "]"))
		}
		console.log("")
	},

	// Same as statsTick(), but use last avg value instead of incorrectly calculating it
	// (NOTE) Should probably fix, and not be redundant
	stats: function() {
		out.clear()
		let avgTxt = ""
		let timeTxt = ""
		if (TestConfig.store.display.show.avg) {
			avgTxt = "Avg: " + chalk.bold(zero(TestData.store.user.prevAvg))
		}
		if (TestConfig.store.display.show.time) {
			timeTxt = zero(TestData.store.system.time.remaining)
		}
		if (!TestConfig.store.display.show.time && !TestConfig.store.display.show.avg) {
			console.log("[Test Running]")
		} else if (TestConfig.store.display.show.time && TestConfig.store.display.show.avg) {
			console.log(chalk.bold("[" + timeTxt + " " + avgTxt + "]"))
		} else {
			console.log(chalk.bold("[" + timeTxt +  avgTxt + "]"))
		}
		console.log("")
	},

	// Complete state, show Correct, Incorrect, and Hotkeys
	complete: function() {
		out.clear()
		// Reset, in case we finish on incorrect letter
		SystemWordHandler.colours.good()
		let diffStr = TestConfig.store.test.diffOptions[TestConfig.store.test.difficulty]
		console.log(TestData.store.system.colour.current("[Complete] ") + TestConfig.store.test.period + " seconds, " + chalk.bold(diffStr.toUpperCase()))
		console.log("")
		console.log("WPM:       " + chalk.bold((TestData.store.user.stats.correct * 60) / TestConfig.store.test.period))
		console.log("Correct:   " + (chalk.bold(TestData.store.user.stats.correct)))
		console.log("Incorrect: " + TestData.store.user.stats.incorrect)
		console.log("Backspace: " + TestData.store.user.stats.backspace)
		console.log("")
		// (Note) sporadic issue here from asciichart complaining about array length.
		// (NOTE) also not working if no correct words
		if (TestData.store.user.stats.avgs.length > 0) {
			console.log(chart.plot(TestData.store.user.stats.avgs, { height: 5}))
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