#! /usr/bin/env node
(function(){"use strict"})()

// Bug: if type incorrect, and restart test, colour stays red

const keypress = require("keypress") // Input handling
const chalk = require("chalk") // Console Text styling

// Mod
const source = require("./mod/words/source.js") // Source text words. Easy, Med, and Hard arrays
const interval = require("./mod/interval.js") // Step interval
const out = require("./mod/out.js") // Console clear & messaging object methods
const dUser = require("./mod/data/data-user.js") // User data for initializing, & resetting after a test
const dTime = require("./mod/data/data-time.js") // Time data for initializing, & resetting after a test
const hUser = require("./mod/handler-user.js") // Use user arguements to create user instance config
const hTime = require("./mod/handler-time.js") // Use user arguements to create user instance config

const TestConfig = require("./mod/test-config/config.js")
const SystemConfig = require("./mod/system/system-config.js")
const SystemWordHandler = require("./mod/system/word-handler.js")

const TestData = require("./mod/test-data/data.js")

// Route input to keypress
keypress(process.stdin)

// Windows doesn't recognize this, so only not on windows
if (process.stdin.setRawMode) process.stdin.setRawMode(true)

// Create test-session specific config from base prototype and arguements
TestConfig.create(process.argv)

// Initialize test-session specific data from base prototype
TestData.create()

// Init output on run
out.init()

// Store typed characters & stats
var DataUser = new dUser()

// Check, process, log user input text
var HandlerUser = new hUser()

// Init object with begin, remaining, timer, and testLen. 
var DataTime = new dTime(TestConfig.store.test.period)

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
		DataTime = new dTime(TestConfig.store.test.period)
		HandlerUser.clear(DataUser)
		DataUser = new dUser()
		// (NOTE) to replace above
		TestData.create()

		// (NOTE) do we need to reset here?
		// SystemText = sText(TestConfig.store)
		TestConfig.create(process.argv)

		// Set test length
		DataTime.remaining = TestConfig.store.test.period

		out.stats(DataTime.remaining, DataUser.prevAvg)
		SystemWordHandler.newSet()
		out.ready(SystemWordHandler.format)
		},

	// Start running test & create interval
	run: function() {
		State.now = "running"
		DataTime.begin = Date.now()
		// Wrap step in a closure so interval can run it
		let work = function() {
			return HandlerTime.step(DataTime, DataUser, TestConfig.store, HandlerUser, State.complete)
		}
		// Init & start timer
		DataTime.timer = new interval(work, 1000)
		DataTime.timer.start()
	},

	// Complete state, show Correct, Incorrect, and Hotkeys
	complete: function() {
		State.now = "stopped"
		out.complete(DataTime.testLen, DataUser)
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
		else if (!/[^a-zA-Z]/.test(key.name) && TestConfig.store.test.reject.indexOf(key.name) < 0) {

			// Don't respond if test is over
			if (DataTime.remaining > 0 && State.now === "running") {

				// Space
				if (key.name === "space" || key.name === "return") {

					// Contains non-whitespace characters
					// This is to prevent space or enter from registering as an incorrect word
					if (/\S/.test(DataUser.current)) {

						// Reference stat output here to keep simpler in cases below
						let stat = function() {
							out.stats(DataTime.remaining, DataUser.prevAvg)
						}

						// Correct word
						if (DataUser.current === SystemConfig.wordSet[0]) {
							stat()
							DataUser.stats.correct++
							HandlerUser.next(DataUser, DataTime.remaining, DataUser.prevAvg)
						}

						// Incorrect word
						else {

							DataUser.stats.incorrect++

							// Correct word not required. Log incorrect, and move to next word							
							if (TestConfig.store.test.skip) {
								stat()
								HandlerUser.next(DataUser, DataTime.remaining, DataUser.prevAvg)
							}

							// Correct word is required before moving to next word.
							// Stay on current word, and re-print out stats, system set, and user text
							else {
								// HandlerUser.incorrect(SystemText, DataUser)
								stat()
								out.system.words(SystemWordHandler.format)
								out.user.current(DataUser.current)
							}

						}
						
					}

				}

				// Backspace
				// Windows shows Backspace as { sequence: "\b" }
				// Unix shows Ctrl + Backspace as { sequence: "\b", ctrl: false }
				// ...so we have to handle strangely below 
				else if (key.name === "backspace") {

					out.stats(DataTime.remaining, DataUser.prevAvg)

					let pt = process.platform
					// Function for regular Backspace
					function rb() {
						DataUser.current = DataUser.current.substring(0, DataUser.current.length - 1)
						if (DataUser.current === "") {
							SystemWordHandler.colours.good()
						}
					}
					// Function for Ctrl + Backspace
					function cb() {
						HandlerUser.clear(DataUser)
						SystemWordHandler.colours.good()
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
					HandlerUser.check(DataUser.current)
					out.system.words(SystemWordHandler.format)
					out.user.current(DataUser.current)

				}

				// Regular typing
				else {

					out.stats(DataTime.remaining, DataUser.prevAvg)
					HandlerUser.proc(key, DataUser)

				}

			}

			// Test is ready for first keypress to begin
			else if (State.now === "ready") {

				// Don't print or respond to SPACE or RETURN
				// ...Can't use these in TestConfig.store.test.reject because they're used for word entry
				if (key.name != "space" && key.name != "return") {

					// Output stats (clears console)
					out.stats(DataTime.remaining, DataUser.prevAvg)

					HandlerUser.proc(key, DataUser)
					// Begin
					State.run()
					
				}

			}

		} // [End] Alpha input if statement

	} // [End] if(!undefined)
	
})

