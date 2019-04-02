(function(){"use strict"})()

/******************************************************
Output info and modify console
! Does not change any system values
*******************************************************/

const chalk = require("chalk") // Console text styling
const chart = require("asciichart") // Chart results
const zero = require("./format/zero.js") // Leading zero-ify
const TestConfig = require("./test-config.js")
const SystemWordHandler = require("./system-word-handler.js")
const TestData = require("./test-data.js")
const ColourManager = require("./colour-manager.js")
const AppConfig = require("./app-config.js")

var out = {

	// Clear console
	clear: function() {
		// (NOTE) This ANSI sequence may not work on all terminals, need to check
		process.stdout.write("\u001b[2J\u001b[0;0H")
	},

	state: {

		menu: function() {
			out.clear()
			let colour = AppConfig.display.colour.good
			console.log(chalk.bold[colour]("[" + AppConfig.name + "]") + " Config Menu")
			console.log("")
		},

		init: function() {
			out.clear()
			ColourManager.f.good()
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
			ColourManager.f.good()
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
			// (NOTE) This ANSI sequence may not work on all terminals, need to check
			process.stderr.write("\x1B[?25h")
		}

	},

	system: {

		// Clear line, Output whole set of test words
		words: function() {
			let y = TestData.store.lines.test.words
			let words = SystemWordHandler.wordSet()
			process.stdout.cursorTo(1, y)
			process.stdout.clearLine()
			process.stdout.write(words + "\n")

			// Indent
			process.stdout.cursorTo(1, TestData.store.lines.test.user)
		},

		// Output current word. For updating when typing word
		// Will colour format based on correctedness
		current: function() {
			let y = TestData.store.lines.test.words
			let word = SystemWordHandler.current()
			process.stdout.cursorTo(1, y)
			// (NOTE) finish..
			process.stdout.write(word + "\n")
		}

	},

	user: {
		// Regular typing, just update end letter
		letter: function() {
			let current = TestData.store.user.current
			let x = current.length-1
			let y = TestData.store.lines.test.user
			process.stdout.cursorTo(x+1, y)
			process.stdout.write(current.charAt(x) + chalk.gray("_"))
		},
		rewrite: function() {
			out.user.clear()
			let y = TestData.store.lines.test.user
			let current = TestData.store.user.current
			process.stdout.cursorTo(1, y)
			process.stdout.write(current + chalk.gray("_"))
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

    // Just overwrite, instead of clearing line. Because this always stays the same length
		process.stdout.cursorTo(0, y)

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
		} else if (TestConfig.store.display.show.time && TestConfig.store.display.show.avg) {
			process.stdout.write(chalk.bold("[" + timeTxt + " " + avgTxt + "]") + "   " + "\n")
		} else {
			process.stdout.write(chalk.bold("[" + timeTxt +  avgTxt + "]") + "   " + "\n")
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
			process.stdout.write(chalk.bold("[" + timeTxt + " " + avgTxt + "]") + "   " + "\n")
		} else {
			process.stdout.write(chalk.bold("[" + timeTxt +  avgTxt + "]") + "   " + "\n")
		}

		process.stdout.write("\n")
		process.stdout.cursorTo(0, y+1)
		process.stdout.write("\n")
	},

	// Instructions for Start / Exit shortcuts
	shortcuts: function() {
		console.log(" " + chalk.inverse("^R") + "  Run Test")
		console.log(" " + chalk.inverse("^A") + "  Config Menu")
		console.log(" " + chalk.inverse("^C") + "  Exit App")
	},

	// Just for testing. Clear & output message
	test: function(msg) {
		out.clear()
		console.log(msg)
	}

}

module.exports = out