(function(){"use strict"})()

/******************************************************

*******************************************************/

const Out = require("./out.js") // Console output
const SystemWordHandler = require("./system-word-handler.js")
const TestData = require("./test-data.js")
const TestConfig = require("./test-config.js")
const EntryHandler = require("./entry-handler.js")

var Handler = {

	f: {},

	create: function() {
		Handler.f = new proto()
	}

}

function proto() {

	let parent = this

	// Reset time remaining in test-data.js, from test-config.js value
	this.reset = function() {
		TestData.store.system.time.remaining = TestConfig.store.test.period
		TestData.store.system.time.spent = 0
	}
	
	// Calculate time remaining (fix for wander), time spent, & show tick stats
	this.check = function() {

		if (TestConfig.store.test.period != Infinity) {

			let begin = TestData.store.system.time.begin
			let period = TestConfig.store.test.period
			let remain = Number(period - (Math.floor((Date.now() - begin)/1000)))

			// Update time
			TestData.store.system.time.remaining = remain

		}
		TestData.store.system.time.spent++

		let avg = EntryHandler.f.avg()
		Out.statsTick(avg)

	}

	// Interval timer
	// Keeps running handler.check() unless tdata.remaining <= 0
	this.step = function(complete) {

		parent.check()

		let spent = TestData.store.system.time.spent
		
		// Show stats every other tick
		if (spent > 0) {
			// Only log every other second
			if (spent%2 === 0) {
				let avg = EntryHandler.f.avg()
				TestData.store.user.stats.avgs.push(avg)
			}
			Out.user.focus()
		}

		// Only if test has a number value period
		if (TestConfig.store.test.period != Infinity) {

			let remain = TestData.store.system.time.remaining
			if (remain <= 0) {
				complete()
				TestData.store.system.time.timer.stop()
			}

		}

		return
		
	}

}

module.exports = Handler