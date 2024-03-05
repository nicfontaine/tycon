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
const LaunchOptions = require("./launch-options.js")
// We require input-handler.js at the bottom, after export b/c of circular dependency issue

const InputHandler = require("./input-handler.js")

State.now = "stopped" // "stopped" "init" "waiting" "running"

State.f = {

	// On run, initialize test config before menu, because menu is revisited
	launch: function() {

		// Initialize with default settings. Menu will update
		TestConfig.create()

		LaunchOptions.check().then((res, err) => {
			// No valid source file arg. Show main menu
			if (TestConfig.store.test.mode != "file") {
				State.f.menu()
			}
			// Valid source file arg. Init, and skip to ready
			else {
				// State.f.init(State.f.ready)
				State.f.menuFile()
			}
		}, err => { console.log(err) })
		.catch(err => {
			console.log("ERROR: " + err)
		})

	},

	// Run inquirer prompt, and generate test config from options
	// State.f.init() when done.
	menu: function() {

		State.now = "menu"

		State.f.reset()

		Out.state.menu()

		// Main menu
		inquirer.prompt(Menu.main).then(answers => {
			if (answers.options === "Run Test") {
				// Initialize, then go to test ready (waiting for input)
				TestConfig.update(answers)
				State.f.init(State.f.ready)
			} else {
				// Settings menu
				inquirer.prompt(Menu.settings).then(answers => {
					// Subsettings menu
					if (answers.settings) {

						Out.state.settings()
						inquirer.prompt(Menu.subSettings).then(settings => {

								Object.assign(answers, settings)
								TestConfig.update(answers)
								State.f.init(undefined)

							}, err => { throw(err) })
							.catch(err => { throw(err) })

					}
					// Bypass additional settings
					else {
						TestConfig.update(answers)
						State.f.init(undefined)
					}

					}, err => { throw(err) })
					.catch(err => { throw(err) })
			}
		}, err => { throw(err) })
		.catch(err => { throw(err) })

	},

	// Inquirer prompt, for file-mode-specified launch option
	menuFile: () => {
		State.now = "menuFile"
		State.f.reset()
		Out.state.menu()
		inquirer.prompt(Menu.fileSettings).then(answers => {
			// Additional settings
			if (answers.settings) {

				Out.state.settings()
				inquirer.prompt(Menu.fileSubSettings).then(settings => {

						Object.assign(answers, settings)
						TestConfig.update(answers)
						State.f.init(undefined)

					}, err => { throw(err) })
					.catch(err => { throw(err) })

			}
			// No additional settings
			else {
				TestConfig.update(answers)
				State.f.init(undefined)
			}
		}, err => { throw(err) })
		.catch(err => { throw(err) })
	},

	// Generate handler and data after menu. And setup key input handler
	// Waits for shortcut input to trigger state change
	init: function(next) {
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
		ColourManager.f.good()
		// Initialize EntryHandler
		EntryHandler.create()
		// Keep track of time: test started, remaining, total length
		TimeHandler.create()
		TimeHandler.f.reset()

		SystemWordHandler.f.getSource()
		SystemWordHandler.f[TestConfig.store.test.mode].newSet()

		Out.state.init()

		// Execute callback chain
		if (next !== undefined) {
			next()			
		}

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

		Out.state.waiting()

	},

	// Test instantly paused, waiting for first input to stat
	ready: () => {
		State.now = "waiting"
		Out.state.waiting()
	},

	// Start running test & create interval
	run: function() {
		State.now = "running"
		// Output header text once
		Out.header("running..")
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
