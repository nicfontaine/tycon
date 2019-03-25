#! /usr/bin/env node
(function(){"use strict"})()

const keypress = require("keypress") // Input handling
const chalk = require("chalk") // Console Text styling

// Mod
const source = require("./mod/words/source.js") // Source text words. Easy, Med, and Hard arrays
const interval = require("./mod/interval.js") // Step interval
const out = require("./mod/out.js") // Console clear & messaging object methods
const hTime = require("./mod/handler-time.js") // Use user arguements to create user instance config

const TestConfig = require("./mod/test-config/config.js")
const SystemWordHandler = require("./mod/system/word-handler.js")

const InputHandler = require("./mod/input-handler/handler.js")

const TestData = require("./mod/test-data/data.js")

// Route input to keypress
keypress(process.stdin)

// Windows doesn't recognize this, so only not on windows
if (process.stdin.setRawMode) process.stdin.setRawMode(true)

// Create test-session specific config from base prototype and arguements
TestConfig.create(process.argv)

// Initialize test-session specific data from base prototype
TestData.create()

// Initialize InputHandler
InputHandler.create()

// Init output on run
out.init()

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

		// (NOTE) move.
		SystemWordHandler.colours.good()

		// Quit & reset if running
		if (TestData.store.system.time.timer != undefined) {
			TestData.store.system.time.timer.stop()
		}
		// Reset
		InputHandler.f.clear()
		TestData.create()

		// (NOTE) do we need to reset here?
		// SystemText = sText(TestConfig.store)
		TestConfig.create(process.argv)

		// Set test length
		TestData.store.system.time.remaining = TestConfig.store.test.period

		out.stats()
		SystemWordHandler.newSet()
		out.ready()
		},

	// Start running test & create interval
	run: function() {
		State.now = "running"
		TestData.store.system.time.begin = Date.now()
		// Wrap step in a closure so interval can run it
		let work = function() {
			return HandlerTime.step(State.complete)
		}
		// Init & start timer
		TestData.store.system.time.timer = new interval(work, 1000)
		TestData.store.system.time.timer.start()
	},

	// Complete state, show Correct, Incorrect, and Hotkeys
	complete: function() {
		State.now = "stopped"
		out.complete()
	},

	// Quit app. log exit message, and exit process
	quit: function() {
		if (TestData.store.system.time.timer != undefined) {
			TestData.store.system.time.timer.stop()
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
			if (TestData.store.system.time.remaining > 0 && State.now === "running") {

				// Space
				if (key.name === "space" || key.name === "return") {

					// Contains non-whitespace characters
					// This is to prevent space or enter from registering as an incorrect word
					if (/\S/.test(TestData.store.user.current)) {

						// Reference stat output here to keep simpler in cases below
						let stat = function() {
							out.stats()
						}

						// Correct word
						if (TestData.store.user.current === TestData.store.system.wordSet[0]) {
							stat()
							TestData.store.user.stats.correct++
							out.user.clear()
							InputHandler.f.next()
						}

						// Incorrect word
						else {

							TestData.store.user.stats.incorrect++

							// Correct word not required. Log incorrect, and move to next word							
							if (TestConfig.store.test.skip) {
								stat()
								out.user.clear()
								InputHandler.f.next()
							}

							// Correct word is required before moving to next word.
							// Stay on current word, and re-print out stats, system set, and user text
							else {
								stat()
								out.system.words()
								out.user.rewrite()
							}

						}
						
					}

				}

				// Backspace
				// Windows shows Backspace as { sequence: "\b" }
				// Unix shows Ctrl + Backspace as { sequence: "\b", ctrl: false }
				// ...so we have to handle strangely below 
				else if (key.name === "backspace") {

					out.stats()

					let pt = process.platform
					// Function for regular Backspace
					function rb() {
						TestData.store.user.current = TestData.store.user.current.substring(0, TestData.store.user.current.length - 1)
						if (TestData.store.user.current === "") {
							SystemWordHandler.colours.good()
						}
					}
					// Function for Ctrl + Backspace
					function cb() {
						InputHandler.f.clear()
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
					TestData.store.user.stats.backspace++

					// Check user text, print (format & style) system text, print user text
					// Don't user InputHandler.f.process() b/c  that would print "backspace"
					InputHandler.f.check()
					out.system.words()
					out.user.rewrite()

				}

				// Regular typing
				else {

					out.stats()
					InputHandler.f.proc(key)

				}

			}

			// Test is ready for first keypress to begin
			else if (State.now === "ready") {

				// Don't print or respond to SPACE or RETURN
				// ...Can't use these in TestConfig.store.test.reject because they're used for word entry
				if (key.name != "space" && key.name != "return") {

					// Output stats (clears console)
					out.clear()
					out.stats()

					InputHandler.f.proc(key)
					// Begin
					State.run()
					
				}

			}

		} // [End] Alpha input if statement

	} // [End] if(!undefined)
	
})

