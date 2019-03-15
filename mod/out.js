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

	init: function(uconf, colour) {
		out.clear()
		let diffStr = uconf.test.diffOptions[uconf.test.difficulty]
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
	next: function(remain, avg, format, uconf) {
		out.stats(remain, avg, uconf)
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
	statsTick: function(remain, avg, uconf) {
		out.clear()
		let avgTxt = ""
		let timeTxt = ""
		if (uconf.display.show.avg) {
			avgTxt = "Avg: " + chalk.bold(zero(avg))
		}
		if (uconf.display.show.time) {
			timeTxt = zero(remain)
		}
		if (!uconf.display.show.time && !uconf.display.show.avg) {
			console.log("[Test Running]")
		} else if (uconf.display.show.time && uconf.display.show.avg) {
			console.log(chalk.bold("[" + timeTxt + " " + avgTxt + "]"))
		} else {
			console.log(chalk.bold("[" + timeTxt +  avgTxt + "]"))
		}
		console.log("")
	},

	// Same as statsTick(), but use last avg value instead of incorrectly calculating it
	// (NOTE) Should probably fix, and not be redundant
	stats: function(remain, prevAvg, uconf) {
		out.clear()
		let avgTxt = ""
		let timeTxt = ""
		if (uconf.display.show.avg) {
			avgTxt = "Avg: " + chalk.bold(zero(prevAvg))
		}
		if (uconf.display.show.time) {
			timeTxt = zero(remain)
		}
		if (!uconf.display.show.time && !uconf.display.show.avg) {
			console.log("[Test Running]")
		} else if (uconf.display.show.time && uconf.display.show.avg) {
			console.log(chalk.bold("[" + timeTxt + " " + avgTxt + "]"))
		} else {
			console.log(chalk.bold("[" + timeTxt +  avgTxt + "]"))
		}
		console.log("")
	},

	// Complete state, show Correct, Incorrect, and Hotkeys
	complete: function(len, uconf, uData, systext) {
		out.clear()
		// Reset, in case we finish on incorrect letter
		systext.colours.good()
		let diffStr = uconf.test.diffOptions[uconf.test.difficulty]
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