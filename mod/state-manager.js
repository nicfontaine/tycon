(function(){"use strict"})()

/******************************************************

*******************************************************/

const TestConfig = require("./test-config.js")
const InputHandler = require("./input-handler.js")
const TestData = require("./test-data.js")
const SystemWordHandler = require("./system-word-handler.js")
const ColourManager = require("./colour-manager.js")
const Out = require("./out.js") // Console clear & messaging object methods
const interval = require("./interval.js") // Step interval
const HandlerTime = require("./handler-time.js")

var State = {

	// Keep track of running state. For run on first keypress
	now: "stopped", // "stopped" "init" "ready" "running"

	f: {

		init: function() {
			State.now = "init"

			// Create test-session specific config from base prototype and arguments
			TestConfig.create(process.argv)
			// Initialize test-session specific data from base prototype
			TestData.create()
			// Initialize InputHandler
			InputHandler.create()
			// Keep track of time: test started, remaining, total length
			HandlerTime.create()

			Out.state.init()
		},

		// Begin, reset values
		// (Note) clean this up
		ready: function() {
			State.now = "ready"

			// Quit & reset if running
			if (TestData.store.system.time.timer != undefined) {
				TestData.store.system.time.timer.stop()
			}
			// Reset
			InputHandler.f.clear()
			TestData.create()

			// (NOTE) do we need to reset here?
			TestConfig.create(process.argv)

			// Set test length
			TestData.store.system.time.remaining = TestConfig.store.test.period

			ColourManager.f.good()

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
			TestData.store.system.time.timer = new interval(work, 1000)
			TestData.store.system.time.timer.start()
		},

		// Complete state, show Correct, Incorrect, and Hotkeys
		complete: function() {
			State.now = "stopped"
			Out.state.complete()
		},

		// Quit app. log exit message, and exit process
		quit: function() {
			if (TestData.store.system.time.timer != undefined) {
				TestData.store.system.time.timer.stop()
			}
			Out.state.quit()
			process.exit()
		}

	}

}

module.exports = State