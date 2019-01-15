const chalk = require("chalk") // Console text styling
const chart = require("asciichart") // Chart results
const zero = require("./zero.js") // Leading zero-ify

var out = {

	// Clear console
	clear: function() {
		process.stdout.write("\033c")
	},

	newline: function() {
		console.log(chalk.gray(" _"))
		console.log("")
	},

	init: function(diff) {
		out.clear()
		console.log(chalk.bold.green("[Tycon]") + " Level: " + chalk.bold(diff.toUpperCase()))
		console.log("")
		out.shortcuts()
		console.log("")
	},

	ready: function(format) {
		console.log(" " + format())
		out.newline()
	},

	// (NOTE) This needs the showAvg flag for out.stats
	next: function(remain, avg, format, showAvg) {
		out.stats(remain, avg, showAvg)
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
	statsTick: function(remain, avg, showAvg) {
		out.clear()
		let avgTxt = ""
		if (showAvg) {
			avgTxt = " Avg: " + chalk.bold(zero(avg))
		}
		// Only output Avg WPM if flagged
		console.log(chalk.bold("[" + zero(remain)) + avgTxt + "]")
		console.log("")
	},

	// Same as statsTick(), but use last avg value instead of incorrectly calculating it
	stats: function(remain, prevAvg, showAvg) {
		out.clear()
		let avgTxt = ""
		if (showAvg) {
			avgTxt = " Avg: " + chalk.bold(zero(prevAvg))
		}
		// Only output Avg WPM if flagged
		console.log(chalk.bold("[" + zero(remain)) + avgTxt + "]")
		console.log("")
	},

	// Complete state, show Correct, Incorrect, and Hotkeys
	complete: function(len, diff, correct, incorrect, log, backspace) {
		out.clear()
		console.log(chalk.bold.green("[Complete] ") + len + " seconds, " + chalk.bold(diff.toUpperCase()))
		console.log("")
		console.log("WPM:       " + chalk.bold((correct * 60) / len))
		console.log("Correct:   " + (chalk.bold(correct)))
		console.log("Incorrect: " + incorrect)
		console.log("Backspace: " + backspace)
		console.log("")
		// (Note) sporadic issue here from asciichart complaining about array length.
		if (log.length > 0) {
			console.log(chart.plot(log, { height: 5}))
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
	}

}

module.exports = out