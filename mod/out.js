(function(){"use strict"})()

const chalk = require("chalk") // Console text styling
const chart = require("asciichart") // Chart results
const zero = require("./format/zero.js") // Leading zero-ify
const TestConfig = require("./test-config/config.js")
const SystemWordHandler = require("./system/word-handler.js")
const TestData = require("./test-data/data.js")
const log = require("single-line-log").stdout
const log1 = require("single-line-log").stdout
const log2 = require("single-line-log").stdout
const log3 = require("single-line-log").stdout

var out = {

	// Clear console
	clear: function() {
		process.stdout.write("\u001b[2J\u001b[0;0H")
	},

	state: {

		init: function() {
			out.clear()
			SystemWordHandler.colours.good()
			let colour = TestData.store.system.colour.current
			let diffStr = TestConfig.store.test.diffOptions[TestConfig.store.test.difficulty]

			console.log(colour("[Tycon]") + " Level: " + chalk.bold(diffStr.toUpperCase()))
			console.log("")
			out.shortcuts()
			console.log("")
			process.stdout.write("\x1B[?25l")
			// process.stdout.write(chalk.gray("_"))
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
			// Reset terminal cursor
			process.stderr.write("\x1B[?25h")
		}

	},

	system: {
		words: function() {
			out.stats()
			let y = TestData.store.lines.test.words
			process.stdout.cursorTo(1, y)
			process.stdout.clearLine()
			process.stdout.write(SystemWordHandler.format() + "\n")

			// Indent
			process.stdout.cursorTo(1, TestData.store.lines.test.user)
		}
	},

	user: {
		// Regular typing, just update end letter
		letter: function() {
			let current = TestData.store.user.current
			let x = current.length-1
			let y = TestData.store.lines.test.user
			process.stdout.cursorTo(x+1, y)
			process.stdout.write(current.charAt(x))
		},
		rewrite: function() {
			out.user.clear()
			let y = TestData.store.lines.test.user
			process.stdout.cursorTo(1, y)
			process.stdout.write(TestData.store.user.current + chalk.gray("_"))
		},
		clear: function() {
			let y = TestData.store.lines.test.user
			process.stdout.cursorTo(1, y)
			process.stdout.clearLine()
			process.stdout.write("\x1B[?25l")
			process.stdout.write(chalk.gray("_"))
		},
		focus: function() {
			let current = TestData.store.user.current
			let x = current.length
			let y = TestData.store.lines.test.user
			process.stdout.cursorTo(x+1, y)
			process.stdout.write(chalk.gray("_"))
		}
	},

	//  Show typing stats, Time left, and Avg. typed
	statsTick: function(avg) {
		let y = TestData.store.lines.test.stats

		process.stdout.cursorTo(0, y)
		// process.stdout.clearLine()

		let avgTxt = ""
		let timeTxt = ""
		if (TestConfig.store.display.show.avg) {
			avgTxt = "Avg: " + chalk.bold(zero(avg))
		}
		if (TestConfig.store.display.show.time) {
			timeTxt = zero(TestData.store.system.time.remaining)
		}
		if (!TestConfig.store.display.show.time && !TestConfig.store.display.show.avg) {
			process.stdout.write("[Test Running]" + "\n")
			// console.log("[Test Running]")
		} else if (TestConfig.store.display.show.time && TestConfig.store.display.show.avg) {
			process.stdout.write(chalk.bold("[" + timeTxt + " " + avgTxt + "]") + "\n")
		} else {
			process.stdout.write(chalk.bold("[" + timeTxt +  avgTxt + "]") + "\n")
		}

		process.stdout.write("\n")
		process.stdout.cursorTo(0, y+1)
		process.stdout.write("\n")
	},

	// Same as statsTick(), but use last avg value instead of incorrectly calculating it
	// (NOTE) Should probably fix, and not be redundant
	stats: function() {
		let y = TestData.store.lines.test.stats

		process.stdout.cursorTo(0, y)
		// process.stdout.clearLine()

		let avgTxt = ""
		let timeTxt = ""
		if (TestConfig.store.display.show.avg) {
			avgTxt = "Avg: " + chalk.bold(zero(TestData.store.user.prevAvg))
		}
		if (TestConfig.store.display.show.time) {
			timeTxt = zero(TestData.store.system.time.remaining)
		}
		if (!TestConfig.store.display.show.time && !TestConfig.store.display.show.avg) {
			process.stdout.write("[Test Running]" + "\n")
		} else if (TestConfig.store.display.show.time && TestConfig.store.display.show.avg) {
			process.stdout.write(chalk.bold("[" + timeTxt + " " + avgTxt + "]") + "\n")
		} else {
			process.stdout.write(chalk.bold("[" + timeTxt +  avgTxt + "]") + "\n")
		}

		process.stdout.write("\n")
		process.stdout.cursorTo(0, y+1)
		process.stdout.write("\n")
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