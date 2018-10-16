#! /usr/bin/env node
(function(){"use strict"})()

const keypress = require("keypress")
const chalk = require("chalk")

// Mod
const source = require("./mod/source.js")
const interval = require("./mod/interval.js")

keypress(process.stdin)
process.stdin.setRawMode(true)

// Global config variables
var maxWordsPerLine = 5
var testLength = 60
var difficulty = "med"

// Level, if arguement exists
var arg = process.argv[2]
if (arg) {
	if (arg === "easy" || arg === "med" || arg === "hard") {
		difficulty = process.argv[2]
	}
}

// Interval timer
var step = function step() {
	state.clear()
	state.timeCheck()
	if (time.remaining > 0) {
		text.system.print()
		text.user.print()
	} else {
		state.done()
		time.timer.stop()
	}
}

// Keep track of time: test started, remaining, total length
var time = {
	begin: Date.now(),  // Stamp start time for calc remaining
	remaining: 0,
	timer: undefined,  // Keep reference of timer
	testLen: testLength
}

// App states, with console printout, initialization, variable reset
var state = {

	clear: function() {
		process.stdout.write("\033c")
	},

	init: function() {
		state.clear()
		console.log(chalk.bold.green("[Tycon]"))
		console.log("")
		console.log("Level: " + chalk.bold(difficulty.toUpperCase()))
		console.log(chalk.gray("This is a 60 second typing test of the 200 most common english words"))
		console.log("")
		console.log("Start: " + chalk.bold("^R"))
		console.log("Exit: " + chalk.bold("^C"))
		console.log("")
	},

	start: function() {
		// Reset
		time.begin = Date.now()
		time.remaining = testLength
		text.user.current = ""
		text.user.number.correct = 0
		text.user.number.incorrect = 0

		state.clear()
		state.timeCheck()
		text.system.newSet()
		text.system.print()
		console.log(chalk.gray(" _"))
		console.log("")
		// Init & start timer
		time.timer = new interval(step, 1000)
		time.timer.start()
	},

	timeCheck: function() {
		time.remaining = Number(time.testLen - (Math.floor((Date.now() - time.begin)/1000)))
		if (time.remaining >= 0) {
			state.stats()
		} else {
			time.timer.stop()
		}
	},

	statToggle: false,

	stats: function() {
		// Blinking ellipsis toggle
		if (time.remaining % 2 == 0) {
			console.log(chalk.bold("[Test Running.. ]"))
			statToggle = false
		} else {
			console.log(chalk.bold("[Test Running...]"))
			statToggle = true
		}
		console.log("")
		console.log("Time: " + time.remaining)
		console.log("Avg: " + text.user.number.avg())
		console.log("")
	},

	done: function() {
		state.clear()
		console.log(chalk.bold.green("[Test Results]"))
		console.log("")
		console.log("Correct: " + chalk.bold(text.user.number.correct))
		console.log("Incorrect: " + chalk.bold(text.user.number.incorrect))
		console.log("")
		console.log("Restart: " + chalk.bold("^R") + "  Exit: " + chalk.bold("^C"))
	}

}

// Init on run
state.init()

// Logic for text content. From text.system (prompt text) and text.user (input)
var text = {

	system: {

		// Good/Bad state for "active" word, and incorrect word entry
		colours: {
			good: function() {
				text.system.colours.c = "green"
			},
			bad: function() {
				text.system.colours.c = "red"
			},
			c: "green"
		},

		max: maxWordsPerLine,  // Max for set, and for width of console line
		array: [], // Holds words to be user

		// rm word when typed correctly, and push one to end
		shiftWord: function() {
			text.system.array.shift()
			text.system.array.push(source[difficulty][Math.floor((Math.random() * source[difficulty].length))])
			state.timeCheck()
			text.system.print()
			console.log(chalk.gray(" _")) // Add line for formatting
			console.log("")
		},

		// Generate set of words
		// (Note) should randomly first-caps, with scaling frequency for difficulty
		newSet: function() {
			text.system.array = []
			let numSave = 0
			for (var i=0; i<text.system.max; i++) {
				let num = Math.floor((Math.random() * source[difficulty].length))
				// Re-randomize if same as last number
				if (num === numSave) {
					num = Math.floor((Math.random() * source[difficulty].length))
				}
				let word = source[difficulty][num]
				text.system.array.push(word)
				numSave = num
			}
		},

		// Format word array for string output
		format: function() {
			let out = ""
			for (var i=0; i<text.system.array.length; i++) {
				// Style active word
				if (i === 0) {
					out += chalk.bold[text.system.colours.c](text.system.array[i]) + " "
				}
				// Fade last word
				else if (i === text.system.max - 1) {
					out += chalk.gray(text.system.array[i])
				}
				else {
					out += text.system.array[i] + " "
				}
			}
			return out
		},

		print: function() {
			console.log(" " + text.system.format())
		}

	},

	user: {

		current: "", // Log value of currently typed word

		partial: function() {
			// return new Promise(res, rej) => {
				if (text.user.current == text.system.array[0].substring(0,text.user.current.length)) {
					text.system.colours.good()
				} else {
					text.system.colours.bad()
				}
				// res()
			// }
		},

		number: {
			correct: 0,
			incorrect: 0,
			avg: function() {
				let num = Math.floor((text.user.number.correct * 60) / (time.testLen - time.remaining))
				// NaN on first tick
				if (isNaN(num)) { num = 0 }
				return num
			}
		},

		print: function() {
			console.log(" " + chalk.bold(text.user.current) + chalk.gray("_"))
			console.log("")
		},

		clear: function() {
			text.user.current = ""
		},

		incorrect: function() {
			text.user.number.incorrect++
			state.clear()
			state.timeCheck()
			text.system.colours.bad()
			text.system.print()
		}

	}

}

//
// Handle console input
//
process.stdin.on("keypress", (ch, key) => {

	if (key != undefined) {

		// Ctrl + c to Quit
		if (key.ctrl && key.name == "c") {
			if (time.timer != undefined) time.timer.stop()
			state.clear()
			console.log("Bye!")
			process.exit()
		}

		// Start / restart
		else if (key.ctrl && key.name == "r") {
			state.start()
		}

		// Alpha key input for typing, space/return entry, and backspace
		else if (!/[^a-zA-Z]/.test(key.name) && key.name !== "escape" && key.name !== "delete") {
			// Don't respond if test is over
			if (time.remaining > 0) {
				// Clear console
				state.clear()
				// Output stats
				state.stats()

				// Space
				if (key.name === "space" || key.name === "return") {
					state.clear()
					// Correct word
					if (text.user.current === text.system.array[0]) {
						text.user.clear()
						text.user.number.correct++
						text.system.colours.good()
						text.system.shiftWord()
					}
					// Wrong word
					else {
						text.user.clear()
						text.user.incorrect()
					}
				}
				// Backspace
				else if (key.name == "backspace") {
					if (key.sequence == "\b") {
						text.user.clear()
						text.system.colours.good()
					} else {
						text.user.current = text.user.current.substring(0, text.user.current.length - 1)
						if (text.user.current === "") {
							text.system.colours.good()
						}
					}
					// state.timeCheck()
					text.user.partial()
					text.system.print()
					text.user.print()
				}

				// Typing
				else {
					// Shift to upper
					if (key.shift) {
						text.user.current += key.name.toUpperCase()
					} else {
						text.user.current += key.name
					}
					text.user.partial()
					text.system.print()
					// Print word
					text.user.print()
				}
			}

		}

	}

})

