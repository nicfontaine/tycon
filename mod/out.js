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
			let y = AppConfig.display.lines.test.header
			process.stdout.cursorTo(0, y)
			process.stdout.write(chalk.bold("[" + AppConfig.name + "]") + chalk[TestConfig.store.display.colour.gray](" settings"))
			process.stdout.write("\n")
			process.stdout.write("\n")
		},

		settings: function() {
			out.clear()
			let colour = ""
			// (NOTE) Kinda shoddy, fix?
			if (TestConfig.store.display != undefined) {
				colour = TestConfig.store.display.colour.good
			} else {
				colour = AppConfig.display.colour.good
			}
			process.stdout.write(chalk.bold("[" + AppConfig.name + "]") + chalk[TestConfig.store.display.colour.gray](" (additional settings)"))
			process.stdout.write("\n")
			process.stdout.write("\n")
		},

		init: function() {
			out.clear()
			ColourManager.f.good()
			let diffStr = AppConfig.test.diffOptions[TestConfig.store.test.difficulty]
			let timeTxt = ""
			if (TestConfig.store.test.period === Infinity) {
				timeTxt = "Endless, "
			}
			else {
				timeTxt = TestConfig.store.test.period + " seconds, "	
			}
			console.log(chalk.bold("[" + AppConfig.name + "] ") + chalk[TestConfig.store.display.colour.gray](returnTestInfo()))
			console.log("")
			out.shortcuts()
			console.log("")
		},

		waiting: function() {
			out.clear()
			out.header(returnTestInfo())
			out.instructions("start typing to begin")
			out.system.words()
			out.user.clear()
		},

		// Complete state, show Correct, Incorrect, and Hotkeys
		complete: function() {
			out.clear()
			// Reset, in case we finish on incorrect letter
			ColourManager.f.good()
			let diffStr = AppConfig.test.diffOptions[TestConfig.store.test.difficulty]
			// console.log(chalk.bold("[Complete] ") + chalk[TestConfig.store.display.colour.gray](returnTestInfo()))
			console.log(chalk.bold("[" + AppConfig.name + "] ") + chalk[TestConfig.store.display.colour.gray](returnTestInfo()))
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
			console.log(chalk.bold("[" + AppConfig.name + "]") + " says \"Bye!\"")
			// Reset terminal cursor
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
			process.stdout.write(current.charAt(x) + chalk[TestConfig.store.display.colour.gray]("_"))
		},
		rewrite: function() {
			out.user.clear()
			let y = TestData.store.lines.test.user
			let current = TestData.store.user.current
			process.stdout.cursorTo(1, y)
			process.stdout.write(current + chalk[TestConfig.store.display.colour.gray]("_"))
		},
		clear: function() {
			let y = TestData.store.lines.test.user
			process.stdout.cursorTo(1, y)
			process.stdout.clearLine()
			process.stdout.write("\x1B[?25l")
			process.stdout.write(chalk[TestConfig.store.display.colour.gray]("_"))
		},
		focus: function() {
			let current = TestData.store.user.current
			let x = current.length
			let y = TestData.store.lines.test.user
			process.stdout.cursorTo(x+1, y)
			process.stdout.write(chalk[TestConfig.store.display.colour.gray]("_"))
		}
	},

	header: function(msg) {
		let y = TestData.store.lines.test.header
		let msgTxt = ""
		if (msg != undefined) {
			msgTxt = chalk[TestConfig.store.display.colour.gray](" " + msg)
		}
		process.stdout.cursorTo(0, y)
		process.stdout.write(chalk.bold("[" + AppConfig.name + "]") + msgTxt)
		// process.stdout.write("\n")
	},

	instructions: function(msg) {
		let y = TestData.store.lines.test.stats
		let msgTxt = ""
		if (msg != undefined) {
			msgTxt = chalk[TestConfig.store.display.colour.gray]("(" + msg + ")")
		}
		process.stdout.cursorTo(0, y)
		process.stdout.write(msgTxt)
	},

	//  Show typing stats, Time left, and Avg. typed
	statsTick: function(avg) {
		let y = TestData.store.lines.test.stats

    // Just overwrite, instead of clearing line. Because this always stays the same length
		process.stdout.cursorTo(0, y)

		let avgTxt = ""
		let timeTxt = ""
		let correctTxt = ""
		let cGray = chalk[TestConfig.store.display.colour.gray]
		// (NOTE) Clean all of this below crap up. It's ugly.
		if (TestConfig.store.display.show.avg) {
			avgTxt = cGray("A ") + chalk.bold(zero(avg))
		}
		if (TestConfig.store.display.show.time) {
			if (TestConfig.store.test.period === Infinity) {
				timeTxt = zero(TestData.store.system.time.spent)
			} else {
				timeTxt = zero(TestData.store.system.time.remaining)
			}
		}
		correctTxt = cGray("W ") + TestData.store.user.stats.correct
		if (!TestConfig.store.display.show.time && !TestConfig.store.display.show.avg) {
			process.stdout.write("Test Running" + "\n")
		} else if (TestConfig.store.display.show.time && TestConfig.store.display.show.avg) {
			process.stdout.write(chalk.bold(cGray("T ") + timeTxt + "  " + correctTxt + "  " + avgTxt + "") + "   " + "\n")
		} else {
			process.stdout.write(chalk.bold(cGray("T ") + timeTxt +  avgTxt + "") + "   " + "\n")
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

		let avgTxt = ""
		let timeTxt = ""
		let correctTxt = ""
		let cGray = chalk[TestConfig.store.display.colour.gray]
		if (TestConfig.store.display.show.avg) {
			avgTxt = cGray("A ") + chalk.bold(zero(TestData.store.user.prevAvg))
		}
		if (TestConfig.store.display.show.time) {
			if (TestConfig.store.test.period === Infinity) {
				timeTxt = zero(TestData.store.system.time.spent)
			} else {
				timeTxt = zero(TestData.store.system.time.remaining)
			}
		}
		correctTxt = cGray("W ") + TestData.store.user.stats.correct
		if (!TestConfig.store.display.show.time && !TestConfig.store.display.show.avg) {
			process.stdout.write("Test Running" + "\n")
		} else if (TestConfig.store.display.show.time && TestConfig.store.display.show.avg) {
			process.stdout.write(chalk.bold(cGray("T ") + timeTxt + "  " + correctTxt + "  " + avgTxt + "") + "   " + "\n")
		} else {
			process.stdout.write(chalk.bold(cGray("T ") + timeTxt +  avgTxt + "") + "   " + "\n")
		}

		process.stdout.write("\n")
		process.stdout.cursorTo(0, y+1)
		process.stdout.write("\n")
	},

	// Instructions for Start / Exit shortcuts
	shortcuts: function() {
		console.log(" " + chalk.inverse("^R") + "  Run Test" + chalk[TestConfig.store.display.colour.gray](" (timer will start on first keypress)"))
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

// Lookup, format, and return test length, mode, and difficulty
function returnTestInfo() {
	let timeTxt = ""
	let modeTxt = TestConfig.store.test.mode
	let diffStr = ""
	// If basic mode, will display difficulty after & need to format accordingly
	if (modeTxt === "basic") {
		diffStr = AppConfig.test.diffOptions[TestConfig.store.test.difficulty].toUpperCase()
		modeTxt += ", "
	}
	if (TestConfig.store.test.period === Infinity) {
		timeTxt = "Endless, "
	}
	else {
		timeTxt = TestConfig.store.test.period + "s, "	
	}
	return timeTxt + modeTxt + diffStr
}