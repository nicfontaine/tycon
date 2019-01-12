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
const textSystem = require("./mod/text-system.js") // 

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

	// Init object with begin, remaining, timer, and testLen. 
	data: new timeData(testLength),

	// Calculate time remaining & show tick stats
	check: function() {
		Time.data.remaining = Number(Time.data.testLen - (Math.floor((Date.now() - Time.data.begin)/1000)))
		let avg = TextUser.avg(TextUser.data.stats.correct, Time.data.testLen, Time.data.remaining)
		out.statsTick(Time.data.remaining, avg)
	},

	// Interval timer
	// Keeps running Time.check() unless Time.data.remaining <= 0
	// Print system text, log avg, and print user text
	step: function() {
		Time.check()
		if (Time.data.remaining > 0) {
			out.system.words(TextSystem.format)
			// Only log every other second
			if (Time.data.remaining%2 === 0) {
				let avg = TextUser.avg(TextUser.data.stats.correct, Time.data.testLen, Time.data.remaining)
				TextUser.data.stats.log.wpmArray.push(avg)
			}
			out.user.current(TextUser.data.current)
		}
		// End
		else {
			State.complete()
			Time.data.timer.stop()
		}
	}

}

// Logic for Text content. From TextSystem (prompt Text) and TextUser (input)

var TextSystem = textSystem(difficulty, maxWordsPerLine)

var TextUser = {

	data: new userData(),

	// Check if user input so far matches active word
	check: function(typed, prompted) {
		// Word fully correct
		if (typed === prompted) {
			TextSystem.colours.success()
		}
		// Word correct so far
		else if (typed == prompted.substring(0, typed.length)) {
			TextSystem.colours.good()
		}
		// Word incorrect
		else {
			TextSystem.colours.bad()
		}
	},

	// Calculate average wpm at any time by taking current time & typed words
	avg: function(correct, length, remain) {
		let num = Math.floor((correct * 60) / (length - remain))
		// NaN on first tick
		if (isNaN(num) || num === Infinity) { num = 0 }
		if (remain < 1) { num = 0 }
		// Save
		TextUser.data.prevAvg = num
		return num
	},

	// Handle key input for output
	process: function(key) {
		// Shift to upper
		if (key.shift) {
			TextUser.data.current += key.name.toUpperCase()
		} else {
			TextUser.data.current += key.name
		}
		TextUser.check(TextUser.data.current, TextSystem.array[0])
		out.system.words(TextSystem.format)
		// Print word
		out.user.current(TextUser.data.current)
	},

	// Clear input log
	clear: function() {
		TextUser.data.current = ""
	},

	// Run when incorrect word is entered
	incorrect: function() {
		// (Note) flash error for a second before cleaning
		TextUser.clear()
		TextUser.data.stats.incorrect++
		Time.check()
		TextSystem.colours.bad()
		out.system.words(TextSystem.format)
		out.user.current(TextUser.data.current)
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
		Time.data = new timeData(testLength)
		TextUser.clear()
		TextUser.data = new userData()
		TextSystem = textSystem(difficulty, maxWordsPerLine)

		// Set test length
		Time.data.remaining = testLength

		out.stats(Time.data.remaining, TextUser.data.prevAvg)
		TextSystem.newSet()
		out.ready(TextSystem.format)
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
		State.now = "stopped"
		out.complete(Time.data.testLen, difficulty, TextUser.data.stats.correct, TextUser.data.stats.incorrect, TextUser.data.stats.log.wpmArray, TextUser.data.stats.backspace)
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
		else if (!/[^a-zA-Z]/.test(key.name) && TextSystem.reject.indexOf(key.name) < 0) {

			// Don't respond if test is over
			if (Time.data.remaining > 0 && State.now === "running") {

				// Clear console & Output stats
				out.stats(Time.data.remaining, TextUser.data.prevAvg)

				// Space
				if (key.name === "space" || key.name === "return") {
					// Correct word
					if (TextUser.data.current === TextSystem.array[0]) {
						TextUser.clear()
						TextUser.data.stats.correct++
						TextSystem.colours.good()
						TextSystem.next(Time.data.remaining, TextUser.data.prevAvg)
					}
					// Wrong word
					else {
						TextUser.incorrect()
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
						TextUser.data.current = TextUser.data.current.substring(0, TextUser.data.current.length - 1)
						if (TextUser.data.current === "") {
							TextSystem.colours.good()
						}
					}
					// Function for Ctrl + Backspace
					function cb() {
						TextUser.clear()
						TextSystem.colours.good()
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
					TextUser.data.stats.backspace++

					// Check user text, print (format & style) system text, print user text
					// Don't user TextUser.process() b/c  that would print "backspace"
					TextUser.check(TextUser.data.current, TextSystem.array[0])
					out.system.words(TextSystem.format)
					out.user.current(TextUser.data.current)
				}

				// Typing
				else {
					TextUser.process(key)
				}
			}

			// Test is ready for first keypress to begin
			else if (State.now === "ready") {
				// Don't print or respond to SPACE or RETURN
				// ...Can't use these in TextSystem.reject because they're used for word entry
				if (key.name != "space" && key.name != "return") {
					// Output stats (clears console)
					out.stats(Time.data.remaining, TextUser.data.prevAvg)

					TextUser.process(key)
					// Begin
					State.run()
				}
			}

		} // [End] Alpha input if statement

	} // [End] if(!undefined)
	
})

