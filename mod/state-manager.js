(function(){"use strict"})()

/******************************************************

*******************************************************/

const keypress = require("keypress")
const inquirer = require("inquirer")


var State = {

}

module.exports = State

const TestConfig = require("./test-config.js")
const EntryHandler = require("./entry-handler.js")
const TestData = require("./test-data.js")
const SystemWordHandler = require("./system-word-handler.js")
const ColourManager = require("./colour-manager.js")
const Out = require("./out.js") // Console clear & messaging object methods
const Interval = require("./interval.js") // Step interval
const HandlerTime = require("./handler-time.js")
const Menu = require("./menu.js")
// We require input-handler.js at the bottom, after export b/c of circular dependency issue

const InputHandler = require("./input-handler.js")

State.now = "stopped" // "stopped" "init" "waiting" "running"
State.f = {

	// launch: function() {
	// 	// Route input to keypress
	// 	keypress(process.stdin)
	// 	// Handle console input
	// 	process.stdin.addListener("keypress", InputHandler)
	// 	// Windows doesn't recognize this, so only not on windows
	// 	if (process.stdin.setRawMode) process.stdin.setRawMode(true)
	// 	process.stdin.resume()

	// 	TestConfig.create()

	// 	State.f.init()
	// },

	menu: function() {
		State.now = "menu"

		State.f.reset()

		Out.state.menu()

		// Prompt settings questions
		inquirer.prompt(Menu.main).then(answers => {

			// Second prompt set when editing additional settings
			if (answers.flags) {

				Out.state.flags()
				inquirer.prompt(Menu.flags).then(flags => {

						Object.assign(answers, flags)
						TestConfig.create(answers)
						State.f.init()

					}, err => {
						throw(err)
					}).catch(err => {
						throw(err)
					})

			}
			// Bypass additional settings
			else {
				TestConfig.create(answers)
				State.f.init()
			}

			}, err => {
				throw(err)
			}).catch(err => {
				throw(err)
			})

	},

	init: function() {
		State.now = "init"

		// Route input to keypress
		keypress(process.stdin)
		// Handle console input
		process.stdin.addListener("keypress", InputHandler)
		// Windows doesn't recognize this, so only not on windows
		if (process.stdin.setRawMode) process.stdin.setRawMode(true)
		process.stdin.resume()

		// Quit & reset if running
		if (TestData.store.system != undefined) {
			if (TestData.store.system.time.timer != undefined) {
				TestData.store.system.time.timer.stop()
			}
		}

		// Would create a blank config here, if we ran the app from here
		// TestConfig.create()

		// Initialize test-session specific data from base prototype
		TestData.create()
		// Initialize EntryHandler
		EntryHandler.create()
		// Keep track of time: test started, remaining, total length
		HandlerTime.create()

		Out.state.init()
	},

	reset: function() {
		State.now = "reset"

		Out.clear()

		// (NOTE) This is working. otherwise we'd get double input when going back and forth to menu
		process.stdin.removeListener("keypress", InputHandler)
		// process.stdin.pause()

		// Quit & reset if running
		if (TestData.store.system != undefined) {
			if (TestData.store.system.time.timer != undefined) {
				TestData.store.system.time.timer.stop()
			}
		}

	},

	// Begin, reset values
	// (Note) clean this up
	waiting: function() {
		State.now = "waiting"

		// Quit & reset if running
		if (TestData.store.system != undefined) {
			if (TestData.store.system.time.timer != undefined) {
				TestData.store.system.time.timer.stop()
			}
		}

		TestData.create()

		ColourManager.f.good()
		
		// Set/reset test length
		HandlerTime.f.reset()

		SystemWordHandler.f.newSet()

		Out.clear()
		Out.stats()
		Out.system.words()
		Out.user.clear()

		},

	// Start running test & create interval
	run: function() {
		State.now = "running"
		TestData.store.system.time.begin = Date.now()
		// Wrap step in a closure so interval can run it
		let work = function() {
			return HandlerTime.f.step(State.f.complete)
		}
		// Init & start timer
		TestData.store.system.time.timer = new Interval(work, 1000)
		TestData.store.system.time.timer.start()
	},

	// Complete state, show Correct, Incorrect, and Hotkeys
	complete: function() {
		State.now = "stopped"
		Out.state.complete()
	},

	// Quit app. log exit message, and exit process
	quit: function() {
		// If this happens before TestData is initialized
		if (TestData.store.system != undefined) {
			if (TestData.store.system.time.timer != undefined) {
				TestData.store.system.time.timer.stop()
			}
		}
		Out.state.quit()
		process.exit()
	}

}