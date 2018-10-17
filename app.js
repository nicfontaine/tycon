#! /usr/bin/env node
(function(){"use strict"})()

const keypress = require("keypress")
const chalk = require("chalk")
const chart = require("asciichart")

// Mod
const source = require("./mod/source.js")
const interval = require("./mod/interval.js")

keypress(process.stdin)
if (process.stdin.setRawMode) process.stdin.setRawMode(true)

// Global config variables
var maxWordsPerLine = 5
var testLength = 60
var difficulty = "med"

// Have extra args
if (process.argv.length > 2) {
	let args = process.argv.slice(2)
	for (var i=0; i<args.length; i++) {
		let ar = args[i]
		// Number for length
		if (typeof ar === "number" || !isNaN(ar)) {
			if (ar > 0 && ar <= 300) {
				testLength = ar
			}
		}
		// String for difficulty
		else if (ar === "easy" || ar === "med" || ar === "hard") {
			difficulty = ar
		}
	}
}

// Interval timer
var step = function step() {
	state.clear()
	state.timeCheck()
	if (time.remaining > 0) {
		text.system.print()
		text.user.number.log.array.push(text.user.number.avg())
		text.user.print()
	}
	// End
	else {
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

	// Clear console
	clear: function() {
		process.stdout.write("\033c")
	},

	// Initial launch state, pre-run
	init: function() {
		state.clear()
		console.log(chalk.bold.green("[Tycon]") + " Level: " + chalk.bold(difficulty.toUpperCase()))
		console.log("")
		console.log(chalk.inverse("^R") + " Start")
		console.log(chalk.inverse("^C") + " Exit")
		console.log("")
	},

	// Begin, reset values, and start interval
	start: function() {
		// Reset
		time.begin = Date.now()
		time.remaining = testLength
		text.user.current = ""
		text.user.number.correct = 0
		text.user.number.incorrect = 0
		text.user.number.log.array = []

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

	// Calculate time differential. Stop interval if non time remaining
	timeCheck: function() {
		time.remaining = Number(time.testLen - (Math.floor((Date.now() - time.begin)/1000)))
		if (time.remaining >= 0) {
			state.stats()
		} else {
			time.timer.stop()
		}
	},

	// Show typing stats, Time left, and Avg. typed
	stats: function() {
		console.log(chalk.bold("[" +
			chalk.bold(time.remaining)) +
			" Avg: " +
			chalk.bold(text.user.number.avg()) +
			"]")
		console.log("")
	},

	// Complete state, show Correct, Incorrect, and Hotkeys
	done: function() {
		state.clear()
		console.log(chalk.bold.green("[Complete] ") +
			(chalk.bold(text.user.number.correct)) + "/" +
			chalk.bold(text.user.number.incorrect + text.user.number.correct))
		console.log("")
		console.log(chalk.inverse("^R") + " Restart")
		console.log(chalk.inverse("^C") + " Exit")
		console.log("length: " + text.user.number.log.array.length)
		console.log("")
		console.log(chart.plot(text.user.number.log.array, { height: 5}))
	}

}

// Init on run
state.init()

// Logic for text content. From text.system (prompt text) and text.user (input)
var text = {

	// Prompt word logic from app
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

		// Max for set, and for width of console line
		max: maxWordsPerLine,

		// Holds words to be typed by user
		array: [],

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

		// Format text.system.array, word array, for string output
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

		// Print formatted text
		print: function() {
			console.log(" " + text.system.format())
		}

	},

	// User input and logic, calculation
	user: {

		// Log value of currently typed word
		current: "",

		// Check if user input so far matches active word
		check: function() {
			if (text.user.current == text.system.array[0].substring(0,text.user.current.length)) {
				text.system.colours.good()
			} else {
				text.system.colours.bad()
			}
		},

		// Keep track of typed numbers
		number: {
			correct: 0,
			incorrect: 0,
			// Hold avg wpm at interval
			log: {
				array: []
			},
			avg: function() {
				let num = Math.floor((text.user.number.correct * 60) / (time.testLen - time.remaining))
				// NaN on first tick
				if (isNaN(num)) { num = 0 }
				return num
			}
		},

		// Print & visual format typed user input
		print: function() {
			console.log(" " + chalk.bold(text.user.current) + chalk.gray("_"))
			console.log("")
		},

		// Clear input log
		clear: function() {
			text.user.current = ""
		},

		// Run when incorrect word is entered
		incorrect: function() {
			// (Note) flash error for a second before cleaning
			text.user.clear()
			text.user.number.incorrect++
			state.clear()
			state.timeCheck()
			text.system.colours.bad()
			text.system.print()
			text.user.print()
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
			if (time.timer != undefined) time.timer.stop()
			time.remaining = 0
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
					text.user.check()
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
					text.user.check()
					text.system.print()
					// Print word
					text.user.print()
				}
			}

		}

	}

})

