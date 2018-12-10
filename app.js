#! /usr/bin/env node
(function(){"use strict"})()

const keypress = require("keypress") // Input handling
const chalk = require("chalk") // Console Text styling

// Mod
const source = require("./mod/source.js") // Source text
const interval = require("./mod/interval.js") // Step interval
const out = require("./mod/out.js") // Console clear & messaging object methods
const userData = require("./mod/user-data.js") // User data info for initializing, and resetting after a test
const timeData = require("./mod/time-data.js") // User data info for initializing, and resetting after a test

keypress(process.stdin)
// Windows doesn't recognize this, so only not on windows
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
			if (ar >= 10 && ar <= 300) {
				testLength = ar
			}
		}
		// String for difficulty
		else if (ar === "easy" || ar === "med" || ar === "hard") {
			difficulty = ar
		}
	}
}

// Init on run
out.init(difficulty)

// Keep track of time: test started, remaining, total length
var Time = {

	data: {
		begin: undefined,  // Stamp start time for calc remaining
		remaining: 0,      // Countdown number from test length. Helps determine if running, or complete
		timer: undefined,  // Keep reference of timer
		testLen: testLength // Length of test
	},

	// Calculate time remaining & show tick stats
	check: function() {
		Time.data.remaining = Number(Time.data.testLen - (Math.floor((Date.now() - Time.data.begin)/1000)))
		let avg = Text.user.avg(Text.user.data.stats.correct, Time.data.testLen, Time.data.remaining)
		out.statsTick(Time.data.remaining, avg)
	},

	// Interval timer
	// Keeps running Time.check() unless Time.data.remaining <= 0
	// Print system text, log avg, and print user text
	step: function() {
		Time.check()
		if (Time.data.remaining > 0) {
			out.system.words(Text.system.format)
			// Only log every other second
			if (Time.data.remaining%2 === 0) {
				let avg = Text.user.avg(Text.user.data.stats.correct, Time.data.testLen, Time.data.remaining)
				Text.user.data.stats.log.wpmArray.push(avg)
			}
			out.user.current(Text.user.data.current)
		}
		// End
		else {
			State.complete()
			Time.data.timer.stop()
		}
	}

}


// App states, with console printout, initialization, variable reset
var State = {

	// Keep track of running state. For run on first keypress
	now: "stopped", // "stopped" "ready" "running"

	// Begin, reset values
	// (Note) clean this up
	ready: function() {
		State.now = "ready"

		// Quit & reset if running
		if (Time.data.timer != undefined) {
			Time.data.timer.stop()
		}
		// Reset
		Time.data.remaining = 0
		Time.data.testLen = testLength
		Time.data.remaining = testLength
		Text.user.data = userData

		Text.system.colours.good()

		out.stats(Time.data.remaining, Text.user.data.prevAvg)
		Text.system.newSet()
		out.ready(Text.system.format)
		},

	// Start running test & create interval
	run: function() {
		State.now = "running"
		Time.data.begin = Date.now()
		// Init & start timer
		Time.data.timer = new interval(Time.step, 1000)
		Time.data.timer.start()
	},

	// Complete state, show Correct, Incorrect, and Hotkeys
	complete: function() {
		State.isRunning = "stopped"
		out.complete(Time.data.testLen, difficulty, Text.user.data.stats.correct, Text.user.data.stats.incorrect, Text.user.data.stats.log.wpmArray, Text.user.data.stats.backspace)
	},

	// Quit app. log exit message, and exit process
	quit: function() {
		if (Time.data.timer != undefined) {
			Time.data.timer.stop()
		}
		out.quit()
		process.exit()
	}

}

// Logic for Text content. From Text.system (prompt Text) and Text.user (input)
var Text = {

	// Prompt word logic from app
	system: {

		// Key input to ignore when typing
		reject: ["undefined", "escape", "tab", "left", "right", "up", "down", "pageup", "pagedown", "home", "end"],

		// Good/Bad State for "active" word, and incorrect word entry
		colours: {
			good: function() {
				Text.system.colours.c = chalk.bold.green
			},
			success: function() {
				Text.system.colours.c = chalk.reset.bold.inverse.green
			},
			bad: function() {
				Text.system.colours.c = chalk.bold.red
			},
			c: chalk.bold.green
		},

		// Max for set, and for width of console line
		max: maxWordsPerLine,

		// Holds words to be typed by user
		array: [],

		// rm word when typed correctly, and push one to end
		next: function() {
			Text.system.array.shift()
			let len = source[difficulty].length
			let word = source[difficulty][Math.floor((Math.random() * len))]
			if (Text.system.array.indexOf(word) > -1) {
				word = source[difficulty][Math.floor((Math.random() * len))]
			}
			Text.system.array.push(word)
			out.next(Time.data.remaining, Text.user.data.prevAvg, Text.system.format)
		},

		// Generate set of words
		// (Note) should randomly first-caps, with scaling frequency for difficulty
		newSet: function() {
			Text.system.array = []
			let numSave = 0
			for (var i=0; i<Text.system.max; i++) {
				let num = Math.floor((Math.random() * source[difficulty].length))
				// Re-randomize if same as last number
				if (num === numSave) {
					num = Math.floor((Math.random() * source[difficulty].length))
				}
				let word = source[difficulty][num]
				Text.system.array.push(word)
				numSave = num
			}
		},

		// Format Text.system.array, word array, for string output
		format: function() {
			let out = ""
			for (var i=0; i<Text.system.array.length; i++) {
				// Style active word
				if (i === 0) {
					out += Text.system.colours.c(Text.system.array[i]) + " "
				}
				// Fade last word
				else if (i === Text.system.max - 1) {
					out += chalk.gray(Text.system.array[i])
				}
				else {
					out += Text.system.array[i] + " "
				}
			}
			return out
		}

	},

	// User input and logic, calculation
	user: {

		data: userData,

		// Check if user input so far matches active word
		check: function(typed, prompted) {
			// Word fully correct
			if (typed === prompted) {
				Text.system.colours.success()
			}
			// Word correct so far
			else if (typed == prompted.substring(0, typed.length)) {
				Text.system.colours.good()
			}
			// Word incorrect
			else {
				Text.system.colours.bad()
			}
		},

		// Calculate average wpm at any time by taking current time & typed words
		avg: function(correct, length, remain) {
			let num = Math.floor((correct * 60) / (length - remain))
			// NaN on first tick
			if (isNaN(num) || num === Infinity) { num = 0 }
			if (remain < 1) { num = 0 }
			// Save
			Text.user.data.prevAvg = num
			return num
		},

		// Handle key input for output
		process: function(key) {
			// Shift to upper
			if (key.shift) {
				Text.user.data.current += key.name.toUpperCase()
			} else {
				Text.user.data.current += key.name
			}
			Text.user.check(Text.user.data.current, Text.system.array[0])
			out.system.words(Text.system.format)
			// Print word
			out.user.current(Text.user.data.current)
		},

		// Clear input log
		clear: function() {
			Text.user.data.current = ""
		},

		// Run when incorrect word is entered
		incorrect: function() {
			// (Note) flash error for a second before cleaning
			Text.user.clear()
			Text.user.data.stats.incorrect++
			Time.check()
			Text.system.colours.bad()
			out.system.words(Text.system.format)
			out.user.current(Text.user.data.current)
		}

	}

}

//
// Handle console input
//
process.stdin.on("keypress", (ch, key) => {

	if (key != undefined) {

		// Quit with CTRL + C
		if (key.sequence === "\u0003") {
			State.quit()
		}

		// Start / restart with CTRL + R
		else if (key.sequence === "\u0012") {
			State.ready()
		}

		// Alpha key input for typing, space/return entry, and backspace
		else if (!/[^a-zA-Z]/.test(key.name) && Text.system.reject.indexOf(key.name) < 0) {

			// Don't respond if test is over
			if (Time.data.remaining > 0 && State.now === "running") {

				// Clear console & Output stats
				out.stats(Time.data.remaining, Text.user.data.prevAvg)

				// Space
				if (key.name === "space" || key.name === "return") {
					// Correct word
					if (Text.user.data.current === Text.system.array[0]) {
						Text.user.clear()
						Text.user.data.stats.correct++
						Text.system.colours.good()
						Text.system.next()
					}
					// Wrong word
					else {
						Text.user.incorrect()
					}
				}
				// Backspace
				// Windows shows Backspace as { sequence: "\b" }
				// Unix shows Ctrl + Backspace as { sequence: "\b", ctrl: false }
				// ...so we have to handle strangely below 
				else if (key.name === "backspace") {

					let pt = process.platform
					// Function for regular Backspace
					function rb() {
						Text.user.data.current = Text.user.data.current.substring(0, Text.user.data.current.length - 1)
						if (Text.user.data.current === "") {
							Text.system.colours.good()
						}
					}
					// Function for Ctrl + Backspace
					function cb() {
						Text.user.clear()
						Text.system.colours.good()
					}

					// Unix
					if (pt === "linux" || pt === "darwin") {
						key.sequence === "\b" ? cb() : rb()
					}
					// Windows
					else if (pt === "win32") {
						key.sequence === "\b" ? rb() : cb()
					}
					// Other platform (??)
					else {
						rb()
					}

					// Log backspace
					Text.user.data.stats.backspace++

					// Check user text, print (format & style) system text, print user text
					// Don't user Text.user.process() b/c  that would print "backspace"
					Text.user.check(Text.user.data.current, Text.system.array[0])
					out.system.words(Text.system.format)
					out.user.current(Text.user.data.current)
				}

				// Typing
				else {
					Text.user.process(key)
				}
			}

			// Test is ready for first keypress to begin
			else if (State.now === "ready") {
				// Don't print or respond to SPACE or RETURN
				// ...Can't use these in Text.system.reject because they're used for word entry
				if (key.name != "space" && key.name != "return") {
					// Output stats (clears console)
					out.stats(Time.data.remaining, Text.user.data.prevAvg)

					Text.user.process(key)
					// Begin
					State.run()
				}
			}

		} // [End] Alpha input if statement

	} // [End] if(!undefined)
	
})

