#! /usr/bin/env node
(function(){"use strict"})()

const keypress = require("keypress") // Input handling
const chalk = require("chalk") // Console Text styling

// Mod
const source = require("./mod/source.js") // Source text words. Easy, Med, and Hard arrays
var interval = require("./mod/interval.js") // Step interval
const out = require("./mod/out.js") // Console clear & messaging object methods
var createConf = require("./mod/create-conf.js") // Use user arguements to create user instance config
var sText = require("./mod/system-text.js") // Create, format, hold system prompt words
const dUser = require("./mod/data-user.js") // User data for initializing, & resetting after a test
const dTime = require("./mod/data-time.js") // Time data for initializing, & resetting after a test
var hUser = require("./mod/handler-user.js") // Use user arguements to create user instance config
var hTime = require("./mod/handler-time.js") // Use user arguements to create user instance config

// Route input to keypress
keypress(process.stdin)

// Windows doesn't recognize this, so only not on windows
if (process.stdin.setRawMode) process.stdin.setRawMode(true)

// Create user specific config from base prototype and arguements
var ConfUser = createConf(process.argv)

// (NOTE) Should this be a prototype too?
// Logic for Text content. From SystemText (prompt Text) and HandlerUser (input)
var SystemText = sText(ConfUser)

// Init output on run
out.init(ConfUser, SystemText.colours.c)

// Store typed characters & stats
var DataUser = new dUser()

// Check, process, log user input text
var HandlerUser = new hUser()

// Init object with begin, remaining, timer, and testLen. 
var DataTime = new dTime(ConfUser.test.period)

// Keep track of time: test started, remaining, total length
var HandlerTime = new hTime()

// App states, with console printout, initialization, variable reset
var State = {

	// Keep track of running state. For run on first keypress
	now: "stopped", // "stopped" "ready" "running"

	// Begin, reset values
	// (Note) clean this up
	ready: function() {
		State.now = "ready"

		// Quit & reset if running
		if (DataTime.timer != undefined) {
			DataTime.timer.stop()
		}
		// Reset
		DataTime = new dTime(ConfUser.test.period)
		HandlerUser.clear(DataUser)
		DataUser = new dUser()
		SystemText = sText(ConfUser)

		// Set test length
		DataTime.remaining = ConfUser.test.period

		out.stats(DataTime.remaining, DataUser.prevAvg, ConfUser)
		SystemText.newSet(ConfUser)
		out.ready(SystemText.format)
		},

	// Start running test & create interval
	run: function() {
		State.now = "running"
		DataTime.begin = Date.now()
		// Wrap step in a closure so interval can run it
		let work = function() {
			return HandlerTime.step(DataTime, DataUser, ConfUser, HandlerUser, State.complete, SystemText)
		}
		// Init & start timer
		DataTime.timer = new interval(work, 1000)
		DataTime.timer.start()
	},

	// Complete state, show Correct, Incorrect, and Hotkeys
	complete: function() {
		State.now = "stopped"
		out.complete(DataTime.testLen, ConfUser, DataUser, SystemText)
	},

	// Quit app. log exit message, and exit process
	quit: function() {
		if (DataTime.timer != undefined) {
			DataTime.timer.stop()
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
			if (DataTime.remaining > 0 && State.now === "running") {

				// Space
				if (key.name === "space" || key.name === "return") {

					// Contains non-whitespace characters
					// This is to prevent space or enter from registering as an incorrect word
					if (/\S/.test(DataUser.current)) {

						// Reference stat output here to keep simpler in cases below
						let stat = function() {
							out.stats(DataTime.remaining, DataUser.prevAvg, ConfUser)
						}

						// Correct word
						if (DataUser.current === SystemText.array[0]) {
							stat()
							DataUser.stats.correct++
							HandlerUser.next(SystemText, DataUser, DataTime.remaining, DataUser.prevAvg, ConfUser)
						}

						// Incorrect word
						else {

							DataUser.stats.incorrect++

							// Correct word is required before moving to next word.
							// Stay on current word, and re-print out stats, system set, and user text
							if (ConfUser.test.retypeOnFail) {
								// HandlerUser.incorrect(SystemText, DataUser)
								stat()
								out.system.words(SystemText.format)
								out.user.current(DataUser.current)
							}

							// Correct word not required. Log incorrect, and move to next word
							else {
								stat()
								HandlerUser.next(SystemText, DataUser, DataTime.remaining, DataUser.prevAvg, ConfUser)
							}

						}
						
					}

				}

				// Backspace
				// Windows shows Backspace as { sequence: "\b" }
				// Unix shows Ctrl + Backspace as { sequence: "\b", ctrl: false }
				// ...so we have to handle strangely below 
				else if (key.name === "backspace") {

					out.stats(DataTime.remaining, DataUser.prevAvg, ConfUser)

					let pt = process.platform
					// Function for regular Backspace
					function rb() {
						DataUser.current = DataUser.current.substring(0, DataUser.current.length - 1)
						if (DataUser.current === "") {
							SystemText.colours.good()
						}
					}
					// Function for Ctrl + Backspace
					function cb() {
						HandlerUser.clear(DataUser)
						SystemText.colours.good()
					}

					// (NOTE) Should check for CTRL+W for the unixers ;v

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
					DataUser.stats.backspace++

					// Check user text, print (format & style) system text, print user text
					// Don't user HandlerUser.process() b/c  that would print "backspace"
					HandlerUser.check(SystemText, DataUser.current, SystemText.array[0])
					out.system.words(SystemText.format)
					out.user.current(DataUser.current)

				}

				// Regular typing
				else {

					out.stats(DataTime.remaining, DataUser.prevAvg, ConfUser)
					HandlerUser.proc(key, SystemText, DataUser)

				}

			}

			// Test is ready for first keypress to begin
			else if (State.now === "ready") {

				// Don't print or respond to SPACE or RETURN
				// ...Can't use these in SystemText.reject because they're used for word entry
				if (key.name != "space" && key.name != "return") {

					// Output stats (clears console)
					out.stats(DataTime.remaining, DataUser.prevAvg, ConfUser)

					HandlerUser.proc(key, SystemText, DataUser)
					// Begin
					State.run()
					
				}

			}

		} // [End] Alpha input if statement

	} // [End] if(!undefined)
	
})

