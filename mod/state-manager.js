(function(){"use strict"})()

/******************************************************

*******************************************************/

const keypress = require("keypress")
const inquirer = require("inquirer")

var State = {}

module.exports = State

const TestConfig = require("./test-config.js")
const EntryHandler = require("./entry-handler.js")
const TestData = require("./test-data.js")
const SystemWordHandler = require("./system-word-handler.js")
const ColourManager = require("./colour-manager.js")
const Out = require("./out.js") // Console clear & messaging object methods
const Interval = require("./interval.js") // Step interval
const TimeHandler = require("./time-handler.js")
const Menu = require("./menu.js")
// We require input-handler.js at the bottom, after export b/c of circular dependency issue

const InputHandler = require("./input-handler.js")

State.now = "stopped" // "stopped" "init" "waiting" "running"

State.f = {

	// On run, initialize test config before menu, because menu is revisited
	launch: function() {

		// Initialize with default settings. Menu will update
		TestConfig.create()

		State.f.menu()

	},

	// Run inquirer prompt, and generate test config from options
	// State.f.init() when done.
	menu: function() {
		State.now = "menu"

		State.f.reset()

		Out.state.menu()

		// Prompt settings questions
		inquirer.prompt(Menu.main).then(answers => {
			// Second prompt set when editing additional settings
			if (answers.settings) {

				Out.state.settings()
				inquirer.prompt(Menu.settings).then(settings => {

						Object.assign(answers, settings)
						TestConfig.update(answers)
						State.f.init()

					}, err => {
						throw(err) })
						.catch(err => { throw(err) })

			}
			// Bypass additional settings
			else {
				TestConfig.update(answers)
				State.f.init()
			}

			}, err => {
				throw(err) })
				.catch(err => { throw(err) })

	},

	// Generate handler and data after menu. And setup key input handler
	// Waits for shortcut input to trigger state change
	init: function() {
		State.now = "init"

		// Route input to keypress
		keypress(process.stdin)

		// Handle console input
		process.stdin.addListener("keypress", InputHandler)
		// Windows doesn't recognize this, so only not on windows
		if (process.stdin.setRawMode) process.stdin.setRawMode(true)
		process.stdin.resume()

		// Initialize test-session specific data from base prototype
		TestData.create()
		// Initialize EntryHandler
		EntryHandler.create()
		// Keep track of time: test started, remaining, total length
		TimeHandler.create()

		Out.state.init()
	},

	// Reset values. Wait to start test
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
		TimeHandler.f.reset()

		// Create & store source set, using test mode, in TestData
		// Create a new word set using test mode
		SystemWordHandler.f.getSource()
		SystemWordHandler.f[TestConfig.store.test.mode].newSet()

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
		let work = () => { TimeHandler.f.step(State.f.complete) }
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
		Out.state.quit()
		process.exit()
	},

	// Clear output. Remove key input handler. Stop timer.
	reset: function() {
		State.now = "reset"

		Out.clear()

		// Stop handling key input, because inquirer will do so in the menu, or we'll exit.
		process.stdin.pause()
		process.stdin.removeListener("keypress", InputHandler)

		// Quit & reset if running
		// This shouldn't be called before TestData is initialized, but just in case, we'll check
		if (TestData.store.system != undefined) {
			if (TestData.store.system.time.timer != undefined) {
				TestData.store.system.time.timer.stop()
			}
		}

	}

}
