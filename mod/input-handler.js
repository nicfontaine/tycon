(function(){"use strict"})()

const AppConfig = require("./app-config.js")
const TestConfig = require("./test-config.js")
const TestData = require("./test-data.js")
const EntryHandler = require("./entry-handler.js")
const SystemWordHandler = require("./system-word-handler.js")
const ColourManager = require("./colour-manager.js")
const Out = require("./out.js")

module.exports = function(ch, key) {

	// Just convert ch into a key-like object for sanity
	if (key == undefined && ch) {
		key = {}
		key.name = ch
		key.sequence = ch
	}

	// if (key != undefined && ch != undefined) {

		// Only check shortcut combos via key, not ch
		if (key != undefined) {
			// CTRL + C    Quit
			if (key.sequence === "\u0003") {
				StateMgr.f.quit()
				return
			}

			// CTRL + R    Start / restart
			else if (key.sequence === "\u0012") {
				StateMgr.f.waiting()
				return
			}

			// CTRL + A    Menu
			else if (key.sequence === "\u0001") {
				StateMgr.f.menu()
				return
			}
		}

		// Test reject, like navigation
		if (AppConfig.test.reject.indexOf(key.name) < 0) {

			// Alpha & punc keys for typing, space/return entry, and backspace
			if (/^[a-z0-9]+$/i.test(key.name) || AppConfig.test.punc.indexOf(ch) > -1) {

				// Test is waiting for first keypress to begin, when timer is started
				if (StateMgr.now === "waiting") {

					// Don't print or respond to SPACE or RETURN
					// ...Can't use these in AppConfig.test.reject because they're used for word entry
					if (key.name != "space" && key.name != "return" && key.name != "backspace") {

						// Output stats (clears console)
						Out.clear()
						Out.stats()

						// Begin
						StateMgr.f.run()

						// Don't care about punc chars here b/c it's still pre-test
						EntryHandler.f.key(key)

						Out.system.words()
						Out.user.letter()
						
					}

				}

				// Don't respond if test is over
				else if (StateMgr.now === "running" && TestData.store.system.time.remaining > 0) {

					// Space, for word entry
					if (key.name === "space" || key.name === "return") {

						// Check if user current contains anything other than whitespace characters
						// This is to prevent space or enter from registering as an incorrect word
						// (NOTE) May want a flag to toggle this check, not sure.
						if (/\S/.test(TestData.store.user.current)) {

							// Reference stat output here to keep simpler in cases below
							let stat = function() {
								Out.stats()
							}

							// Correct word. Move to next
							if (TestData.store.user.current === TestData.store.system.wordSet[0]) {
								TestData.store.user.stats.correct++
								stat()
								Out.user.clear()
								EntryHandler.f.clear()
								SystemWordHandler.f[TestConfig.store.test.mode].next()
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
									EntryHandler.f.clear()
									SystemWordHandler.f[TestConfig.store.test.mode].next()
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
						}
						// Function for Ctrl + Backspace
						function cb() {
							EntryHandler.f.clear()
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
						// Don't user EntryHandler.f.process() b/c  that would print "backspace"
						EntryHandler.f.check()
						Out.system.current()
						Out.user.rewrite()

					}

					// Regular typing
					else {

						Out.stats()
						// Send key info
						EntryHandler.f.key(key)
						Out.system.current()
						Out.user.letter()

					}

				}

			} // [End] Alpha input if statement


		} // [End] Reject test

	// } // [End] if(!undefined)

}

const StateMgr = require("./state-manager.js")