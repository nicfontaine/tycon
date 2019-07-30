(function(){"use strict"})()

/******************************************************
Output info and modify console
! Does not change any system values
*******************************************************/

const chalk = require("chalk") // Console text styling
const chart = require("asciichart") // Chart results

const AppConfig = require("./app-config.js")
const zero = require("./format/zero.js") // Leading zero-ify
const TestConfig = require("./test-config.js")
const SystemWordHandler = require("./system-word-handler.js")
const TestData = require("./test-data.js")
const ColourManager = require("./colour-manager.js")

var out = {

	// Clear console
	clear: function() {
		// (NOTE) This ANSI sequence isn't working on windows
		// process.stdout.write("\u001b[2J\u001b[0;0H")
		// (NOTE) Check this windows-fix in other OSs
		process.stdout.write("\033c")
	},

	state: {

		menu: function() {
			out.clear()
			let colour = ""
			// In case we've already been through the menu, and set colour blind mode
			if (TestConfig.store.display != undefined) {
				colour = TestConfig.store.display.colour.good
			} else {
				colour = AppConfig.display.colour.good
			}
			console.log(chalk.bold[colour]("[" + AppConfig.name + "]") + " Settings")
			console.log("")
		},

		settings: function() {
			out.clear()
			let colour = ""
			// (NOTE) shouldn't duplicate from above. Move externally?
			if (TestConfig.store.display != undefined) {
				colour = TestConfig.store.display.colour.good
			} else {
				colour = AppConfig.display.colour.good
			}
			console.log(chalk.bold[colour]("[" + AppConfig.name + "]") + " Additional Settings")
			console.log("")
		},

		init: function() {
			out.clear()
			ColourManager.f.good()
			let colour = TestData.store.system.colour.current
			let diffStr = AppConfig.test.diffOptions[TestConfig.store.test.difficulty]
			let timeTxt = ""
			if (TestConfig.store.test.period === Infinity) {
				timeTxt = "Endless, "
			}
			else {
				timeTxt = TestConfig.store.test.period + " seconds, "	
			}
			console.log(colour("[" + AppConfig.name + "] ") + chalk.bold(timeTxt + diffStr.toUpperCase()))
			console.log("")
			out.shortcuts()
			console.log("")
		},

		// Complete state, show Correct, Incorrect, and Hotkeys
		complete: function() {
			out.clear()
			// Reset, in case we finish on incorrect letter
			ColourManager.f.good()
			let diffStr = AppConfig.test.diffOptions[TestConfig.store.test.difficulty]
			console.log(TestData.store.system.colour.current("[Complete] ") + chalk.bold(TestConfig.store.test.mode) + ", " + TestConfig.store.test.period + "s")
			console.log("")
			console.log("WPM:       " + chalk.bold((TestData.store.user.stats.correct * 60) / TestConfig.store.test.period))
			if (TestConfig.store.test.period !== 60) {
				console.log("Correct:   " + (chalk.bold(TestData.store.user.stats.correct)))
			}
			console.log("Incorrect: " + TestData.store.user.stats.incorrect)
			console.log("Backspace: " + TestData.store.user.stats.backspace)
			console.log("")
			// Log chart if avgs array has any usable values (numbers > 0)
			if (TestData.store.user.stats.avgs.length > 0) {
				let i = 0
				let arr = TestData.store.user.stats.avgs
				let len = arr.length
				for (i; i<len; i++) {
					if (arr[i] > 0) {
						console.log(chart.plot(TestData.store.user.stats.avgs, { height: 5}))
						break
					}
				}
			}
			console.log("")
			out.shortcuts()
			console.log("")
			// process.stdout.write("\x1B[?25l")
		},

		// Quit app. log exit message, and exit process
		quit: function() {
			out.clear()
			let colour = AppConfig.display.colour.good
			console.log(chalk.bold[colour]("[" + AppConfig.name + "]") + " says \"Bye!\"")
			// Reset terminal cursor
			// (NOTE) This ANSI sequence may not work on all terminals, need to check
			process.stderr.write("\x1B[?25h")
		}

	},

	system: {

		// Clear line, Output whole set of test words
		words: function() {
			let y = TestData.store.lines.test.words
			// Grab formatted word set. test-data.js just has array
			let words = SystemWordHandler.wordSet()
			process.stdout.cursorTo(1, y)
			process.stdout.clearLine()
			process.stdout.write(words + "\n")
			process.stdout.write("\x1B[?25l")
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
		let correctTxt = ""
		// (NOTE) Clean all of this below crap up. It's ugly.
		if (TestConfig.store.display.show.avg) {
			avgTxt = "Avg: " + chalk.bold(zero(avg))
		}
		if (TestConfig.store.display.show.time) {
			if (TestConfig.store.test.period === Infinity) {
				timeTxt = zero(TestData.store.system.time.spent)
			} else {
				timeTxt = zero(TestData.store.system.time.remaining)
			}
		}
		correctTxt = "Words: " + TestData.store.user.stats.correct
		if (!TestConfig.store.display.show.time && !TestConfig.store.display.show.avg) {
			process.stdout.write("[Test Running]" + "\n")
		} else if (TestConfig.store.display.show.time && TestConfig.store.display.show.avg) {
			process.stdout.write(chalk.bold("[" + timeTxt + "  " + correctTxt + "  " + avgTxt + "]") + "   " + "\n")
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
		let correctTxt = ""
		if (TestConfig.store.display.show.avg) {
			avgTxt = "Avg: " + chalk.bold(zero(TestData.store.user.prevAvg))
		}
		if (TestConfig.store.display.show.time) {
			if (TestConfig.store.test.period === Infinity) {
				timeTxt = zero(TestData.store.system.time.spent)
			} else {
				timeTxt = zero(TestData.store.system.time.remaining)
			}
		}
		correctTxt = "Words: " + TestData.store.user.stats.correct
		if (!TestConfig.store.display.show.time && !TestConfig.store.display.show.avg) {
			process.stdout.write("[Test Running]" + "\n")
		} else if (TestConfig.store.display.show.time && TestConfig.store.display.show.avg) {
			process.stdout.write(chalk.bold("[" + timeTxt + "  " + correctTxt + "  " + avgTxt + "]") + "   " + "\n")
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
		console.log(" " + chalk.inverse("^A") + "  Settings")
		console.log(" " + chalk.inverse("^C") + "  Exit App")
		process.stdout.write("\x1B[?25l")
	},

	// Just for testing. Clear & output message
	test: function(msg) {
		out.clear()
		console.log(msg)
	}

}

module.exports = out