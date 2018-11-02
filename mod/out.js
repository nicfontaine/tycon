const chalk = require("chalk") // Console text styling
const chart = require("asciichart") // Chart results

var out = {

	// Clear console
	clear: function() {
		process.stdout.write("\033c")
	},

	init: function(diff) {
		out.clear()
		console.log(chalk.bold.green("[Tycon]") + " Level: " + chalk.bold(diff.toUpperCase()))
		console.log("")
		out.shortcuts()
		console.log("")
	},

	newline: function() {
		console.log(chalk.gray(" _"))
		console.log("")
	},

	// Show typing stats, Time left, and Avg. typed
	statsTick: function(remain, avg) {
		out.clear()
		console.log(chalk.bold("[" +
			chalk.bold(remain)) +
			" Avg: " +
			chalk.bold(avg) +
			"]")
		console.log("")
	},

	// Same as statsTick(), but use last avg value instead of incorrectly calculating it
	stats: function(remain, prevAvg) {
		out.clear()
		console.log(chalk.bold("[" +
			chalk.bold(remain)) +
			" Avg: " +
			chalk.bold(prevAvg) +
			"]")
		console.log("")
	},

	// Complete state, show Correct, Incorrect, and Hotkeys
	complete: function(len, diff, correct, incorrect, log) {
		out.clear()
		console.log(chalk.bold.green("[Complete] ") + len + " seconds, " + chalk.bold(diff.toUpperCase()))
		console.log("")
		console.log("WPM:       " + chalk.bold((correct * 60) / len))
		console.log("Correct:   " + (chalk.bold(correct)))
		console.log("Incorrect: " + incorrect)
		console.log("")
		// (Note) sporadic issue here from asciichart complaining about array length.
		console.log(chart.plot(log, { height: 5}))
		console.log("")
		out.shortcuts()
		console.log("")
	},

	// Quit app. log exit message, and exit process
	quit: function() {
		out.clear()
		console.log("Bye!")
	},

	// Instructions for Start / Exit shortcuts
	shortcuts: function() {
		console.log(chalk.inverse("^R") + " Start")
		console.log(chalk.inverse("^C") + " Exit")
	}

}

module.exports = out