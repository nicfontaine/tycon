#! /usr/bin/env node
(function(){"use strict"})()

const keypress = require("keypress") // Input handling

// Mod
const TestConfig = require("./mod/test-config.js")
const InputHandler = require("./mod/input-handler.js")
const TestData = require("./mod/test-data.js")
const ColourManager = require("./mod/colour-manager.js")
const SystemWordHandler = require("./mod/system-word-handler.js")
const State = require("./mod/state-manager.js")
const Out = require("./mod/out.js") // Console clear & messaging object methods

// Route input to keypress
// keypress(process.stdin)

// Windows doesn't recognize this, so only not on windows
if (process.stdin.setRawMode) process.stdin.setRawMode(true)

// Init output on run
State.f.menu()

//
// Handle console input
//
/*process.stdin.on("keypress", (ch, key) => {

	if (key != undefined) {

		// Quit with CTRL + C
		if (key.sequence === "\u0003") {
			State.f.quit()
		}

		// Start / restart with CTRL + R
		else if (key.sequence === "\u0012") {
			State.f.ready()
		}

		// Alpha key input for typing, space/return entry, and backspace
		else if (!/[^a-zA-Z]/.test(key.name) && TestConfig.store.test.reject.indexOf(key.name) < 0) {

			// Don't respond if test is over
			if (State.now === "running" && TestData.store.system.time.remaining > 0) {

				// Space
				if (key.name === "space" || key.name === "return") {

					// Contains non-whitespace characters
					// This is to prevent space or enter from registering as an incorrect word
					if (/\S/.test(TestData.store.user.current)) {

						// Reference stat output here to keep simpler in cases below
						let stat = function() {
							Out.stats()
						}

						// Correct word. Move to next
						if (TestData.store.user.current === TestData.store.system.wordSet[0]) {
							stat()
							TestData.store.user.stats.correct++
							Out.user.clear()
							InputHandler.f.clear()
							SystemWordHandler.f.next()
							ColourManager.f.good()
							Out.system.words()
						}

						// Incorrect word
						else {

							TestData.store.user.stats.incorrect++

							// Correct word not required. Log incorrect, and move to next word							
							if (!TestConfig.store.test.requireCorrect) {
								stat()
								Out.user.clear()
								InputHandler.f.clear()
								SystemWordHandler.f.next()
								ColourManager.f.good()
								Out.system.words()
							}

							// Correct word is required before moving to next word.
							// Stay on current word, and re-print out stats, system set, and user text
							else {
								stat()
								Out.system.current()
								Out.user.rewrite()
							}

						}
						
					}

				}

				// (NOTE) windows solution not working in git shellz
				// Backspace
				// Windows shows Backspace as { sequence: "\b" }
				// Unix shows Ctrl + Backspace as { sequence: "\b", ctrl: false }
				// ...so we have to handle strangely below 
				else if (key.name === "backspace") {

					Out.stats()

					let pt = process.platform
					// Function for regular Backspace
					function rb() {
						let current = TestData.store.user.current
						TestData.store.user.current = current.substring(0, current.length - 1)
						// InputHandler.f.check()
						// if (TestData.store.user.current === "") {
						// 	ColourManager.f.good()
						// }
					}
					// Function for Ctrl + Backspace
					function cb() {
						InputHandler.f.clear()
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
					Out.system.current()
					Out.user.rewrite()

				}

				// Regular typing
				else {

					Out.stats()
					InputHandler.f.proc(key)
					Out.system.current()
					Out.user.letter()

				}

			}

			// Test is ready & waiting for first keypress to begin, when timer is started
			else if (State.now === "ready") {

				// Don't print or respond to SPACE or RETURN
				// ...Can't use these in TestConfig.store.test.reject because they're used for word entry
				if (key.name != "space" && key.name != "return") {

					// Output stats (clears console)
					Out.clear()
					Out.stats()

					// Begin
					State.f.run()

					InputHandler.f.proc(key)
					Out.system.words()
					Out.user.letter()
					
				}

			}

		} // [End] Alpha input if statement

	} // [End] if(!undefined)
	
})

*/