#! /usr/bin/env node
(function(){"use strict"})()

const keypress = require("keypress") // Input handling
const chalk = require("chalk") // Console Text styling

// Mod
const source = require("./mod/source.js") // Source text words. Easy, Med, and Hard arrays
var interval = require("./mod/interval.js") // Step interval
const out = require("./mod/out.js") // Console clear & messaging object methods
const uData = require("./mod/user-data.js") // User data for initializing, & resetting after a test
var sText = require("./mod/system-text.js") // Create, format, hold system prompt words
const tData = require("./mod/time-data.js") // Time data for initializing, & resetting after a test
var createConf = require("./mod/create-conf.js") // Use user arguements to create user instance config
var uHandler = require("./mod/user-handler.js") // Use user arguements to create user instance config
var tHandler = require("./mod/time-handler.js") // Use user arguements to create user instance config

// Route input to keypress
keypress(process.stdin)

// Windows doesn't recognize this, so only not on windows
if (process.stdin.setRawMode) process.stdin.setRawMode(true)

// Create user specific config from base prototype and arguements
var UserConf = createConf(process.argv)

// (NOTE) Should this be a prototype too?
// Logic for Text content. From SystemText (prompt Text) and UserHandler (input)
var SystemText = sText(UserConf)

// Init output on run
out.init(UserConf.test.difficulty, SystemText.colours.c)

// Store typed characters & stats
var UserData = new uData()

// Check, process, log user input text
var UserHandler = new uHandler()

// Init object with begin, remaining, timer, and testLen. 
var TimeData = new tData(UserConf.test.period)

// Keep track of time: test started, remaining, total length
var TimeHandler = new tHandler()

// App states, with console printout, initialization, variable reset
var State = {

	// Keep track of running state. For run on first keypress
	now: "stopped", // "stopped" "ready" "running"

	// Begin, reset values
	// (Note) clean this up
	ready: function() {
		State.now = "ready"

		// Quit & reset if running
		if (TimeData.timer != undefined) {
			TimeData.timer.stop()
		}
		// Reset
		TimeData = new tData(UserConf.test.period)
		UserHandler.clear(UserData)
		UserData = new uData()
		SystemText = sText(UserConf)

		// Set test length
		TimeData.remaining = UserConf.test.period

		out.stats(TimeData.remaining, UserData.prevAvg, UserConf.display.showAvg)
		SystemText.newSet()
		out.ready(SystemText.format)
		},

	// Start running test & create interval
	run: function() {
		State.now = "running"
		TimeData.begin = Date.now()
		// Wrap step in a closure so interval can run it
		let work = function() {
			return TimeHandler.step(TimeData, UserData, UserConf, UserHandler, State.complete, SystemText)
		}
		// Init & start timer
		TimeData.timer = new interval(work, 1000)
		TimeData.timer.start()
	},

	// Complete state, show Correct, Incorrect, and Hotkeys
	complete: function() {
		State.now = "stopped"
		out.complete(TimeData.testLen, UserConf.test.difficulty, UserData, SystemText.colours.c)
	},

	// Quit app. log exit message, and exit process
	quit: function() {
		if (TimeData.timer != undefined) {
			TimeData.timer.stop()
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
		else if (!/[^a-zA-Z]/.test(key.name) && SystemText.reject.indexOf(key.name) < 0) {

			// Don't respond if test is over
			if (TimeData.remaining > 0 && State.now === "running") {

				// Clear console & Output stats
				out.stats(TimeData.remaining, UserData.prevAvg, UserConf.display.showAvg)

				// Space
				if (key.name === "space" || key.name === "return") {

					// Correct word
					if (UserData.current === SystemText.array[0]) {
						UserData.stats.correct++
						UserHandler.next(SystemText, UserData, TimeData.remaining, UserData.prevAvg, UserConf.display.showAvg)
					}
					// Wrong word
					else {
						UserData.stats.incorrect++

						// Correct word is required before moving to next word
						if (UserConf.test.retypeOnFail) {
							UserHandler.incorrect(SystemText, UserData)
						}
						// Correct word not required. Move to next word
						else {
							UserHandler.next(SystemText, UserData, TimeData.remaining, UserData.prevAvg, UserConf.display.showAvg)
						}

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
						UserData.current = UserData.current.substring(0, UserData.current.length - 1)
						if (UserData.current === "") {
							SystemText.colours.good()
						}
					}
					// Function for Ctrl + Backspace
					function cb() {
						UserHandler.clear(UserData)
						SystemText.colours.good()
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
					UserData.stats.backspace++

					// Check user text, print (format & style) system text, print user text
					// Don't user UserHandler.process() b/c  that would print "backspace"
					UserHandler.check(SystemText, UserData.current, SystemText.array[0])
					out.system.words(SystemText.format)
					out.user.current(UserData.current)
				}

				// Typing
				else {
					UserHandler.proc(key, SystemText, UserData)
				}
			}

			// Test is ready for first keypress to begin
			else if (State.now === "ready") {
				// Don't print or respond to SPACE or RETURN
				// ...Can't use these in SystemText.reject because they're used for word entry
				if (key.name != "space" && key.name != "return") {
					// Output stats (clears console)
					out.stats(TimeData.remaining, UserData.prevAvg, UserConf.display.showAvg)

					UserHandler.proc(key, SystemText, UserData)
					// Begin
					State.run()
				}
			}

		} // [End] Alpha input if statement

	} // [End] if(!undefined)
	
})

