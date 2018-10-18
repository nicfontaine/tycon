#! /usr/bin/env node
(function(){"use strict"})()

const keypress = require("keypress")
const chalk = require("chalk")
const chart = require("asciichart")

// Mod
const source = require("./mod/source.js") // Source text
const interval = require("./mod/interval.js") // Step interval

keypress(process.stdin)
// For Windows
if (process.stdin.setRawMode) process.stdin.setRawMode(true)

// Global config variables
var maxWordsPerLine = 5 // Test prompt words to display in single line
var testLength = 60 // In seconds
var difficulty = "med" // easy med hard

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
		text.system.print(text.system.format)
		// Only log every 5 seconds
		if (time.remaining%5 === 0) {
			let avg = text.user.number.avg(text.user.number.correct, time.testLen, time.remaining)
			text.user.number.log.array.push(avg)
		}
		text.user.print(text.user.current)
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
	remaining: 0,      // Countdown number from test length. Helps determine if running, or complete
	timer: undefined,  // Keep reference of timer
	testLen: testLength // Length of test
}

// App states, with console printout, initialization, variable reset
var state = {

	// Keep track of running state. For run on first keypress
	currentStatus: "stopped",

	// Clear console
	clear: function() {
		process.stdout.write("\033c")
	},

	// Initial launch state, pre-run
	init: function() {
		// state.currentStatus = "waiting"
		state.clear()
		console.log(chalk.bold.green("[Tycon]") + " Level: " + chalk.bold(difficulty.toUpperCase()))
		console.log("")
		state.shortcuts()
		console.log("")
	},

	// Begin, reset values
	start: function() {
		
		state.currentStatus = "waiting"

		// Reset
		time.testLen = testLength
		time.remaining = testLength
		text.user.current = ""
		text.user.number.correct = 0
		text.user.number.incorrect = 0
		text.user.number.log.array = []
		text.user.prevAvg = 0
		text.system.colours.good()


		state.clear()
		state.stats()
		text.system.newSet()
		text.system.print(text.system.format)
		console.log(chalk.gray(" _"))
		console.log("")
	},

	// Start running test & create interval
	run: function() {
		time.begin = Date.now()
		state.currentStatus = "running"
		// Init & start timer
		time.timer = new interval(step, 1000)
		time.timer.start()
	},

	// Calculate time differential. Stop interval if non time remaining
	timeCheck: function() {
		time.remaining = Number(time.testLen - (Math.floor((Date.now() - time.begin)/1000)))
		if (time.remaining >= 0) {
			state.statsTick()
		} else {
			time.timer.stop()
		}
	},

	// Show typing stats, Time left, and Avg. typed
	statsTick: function() {
		console.log(chalk.bold("[" +
			chalk.bold(time.remaining)) +
			" Avg: " +
			chalk.bold(text.user.number.avg(text.user.number.correct, time.testLen, time.remaining)) +
			"]")
		console.log("")
	},

	// Same as statsTick(), but use last avg value instead of incorrectly calculating it
	stats: function() {
		console.log(chalk.bold("[" +
			chalk.bold(time.remaining)) +
			" Avg: " +
			chalk.bold(text.user.prevAvg) +
			"]")
		console.log("")
	},

	// Complete state, show Correct, Incorrect, and Hotkeys
	done: function() {
		state.isRunning = "stopped"
		state.clear()
		console.log(chalk.bold.green("[Complete] ") + time.testLen + " seconds, " + chalk.bold(difficulty.toUpperCase()))
		console.log("")
		console.log("WPM:       " + chalk.bold((text.user.number.correct * 60) / time.testLen))
		console.log("Correct:   " + (chalk.bold(text.user.number.correct)))
		console.log("Incorrect: " + text.user.number.incorrect)
		console.log("")
		console.log(chart.plot(text.user.number.log.array, { height: 5}))
		console.log("")
		state.shortcuts()
		console.log("")
	},

	// Instructions for Start / Exit shortcuts
	shortcuts: function() {
		console.log(chalk.inverse("^R") + " Start")
		console.log(chalk.inverse("^C") + " Exit")
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
				text.system.colours.c = chalk.bold.green
			},
			success: function() {
				text.system.colours.c = chalk.reset.bold.inverse.green
			},
			bad: function() {
				text.system.colours.c = chalk.bold.red
			},
			c: chalk.bold.green
		},

		// Max for set, and for width of console line
		max: maxWordsPerLine,

		// Holds words to be typed by user
		array: [],

		// rm word when typed correctly, and push one to end
		shiftWord: function() {
			text.system.array.shift()
			let len = source[difficulty].length
			let word = source[difficulty][Math.floor((Math.random() * len))]
			if (text.system.array.indexOf(word) > -1) {
				word = source[difficulty][Math.floor((Math.random() * len))]
			}
			text.system.array.push(word)
			state.stats()
			text.system.print(text.system.format)
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
					out += text.system.colours.c(text.system.array[i]) + " "
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
		print: function(format) {
			console.log(" " + format())
		}

	},

	// User input and logic, calculation
	user: {

		// Log value of currently typed word
		current: "",

		// Keep avg calculated at interval, to display on typing input (b/c avging outside of interval is inaccurate)
		prevAvg: 0,

		// User typing stats. Correct, incorrect, avgs, averaging
		number: {
			correct: 0,
			incorrect: 0,
			// Hold avg wpm at interval
			log: {
				array: []
			},
			// Calculate average wpm at any time by taking current time & typed words
			avg: function(correct, length, remain) {
				let num = Math.floor((correct * 60) / (length - remain))
				// NaN on first tick
				if (isNaN(num) || num === Infinity) { num = 0 }
				if (remain < 1) { num = 0 }
				// Save
				text.user.prevAvg = num
				return num
			}
		},

		// Check if user input so far matches active word
		check: function(typed, prompted) {
			// Word fully correct
			if (typed === prompted) {
				text.system.colours.success()
			}
			// Word correct so far
			else if (typed == prompted.substring(0, typed.length)) {
				text.system.colours.good()
			}
			// Word incorrect
			else {
				text.system.colours.bad()
			}
		},

		// Handle key input for output
		process: function(key) {
			// Shift to upper
			if (key.shift) {
				text.user.current += key.name.toUpperCase()
			} else {
				text.user.current += key.name
			}
			text.user.check(text.user.current, text.system.array[0])
			text.system.print(text.system.format)
			// Print word
			text.user.print(text.user.current)
		},

		// Print & visual format typed user input
		print: function(current) {
			console.log(" " + chalk.bold(current) + chalk.gray("_"))
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
			text.system.print(text.system.format)
			text.user.print(text.user.current)
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
			state.currentStatus = "waiting"
			state.start()
		}

		// Alpha key input for typing, space/return entry, and backspace
		else if (!/[^a-zA-Z]/.test(key.name) && key.name !== "escape" && key.name !== "delete") {

			// Don't respond if test is over
			if (time.remaining > 0 && state.currentStatus === "running") {

				// Clear console & Output stats
				state.clear()
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
					text.user.check(text.user.current, text.system.array[0])
					text.system.print(text.system.format)
					text.user.print(text.user.current)
				}

				// Typing
				else {
					text.user.process(key)
				}
			}

			// Test is waiting for first keypress to begin
			else if (state.currentStatus === "waiting") {
				// Clear console & Output stats
				state.clear()
				state.stats()

				text.user.process(key)
				// Begin
				state.run()
			}

		}

	}

})

