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
	}
	
	// Calculate time remaining & show tick stats
	this.check = function() {

		let begin = TestData.store.system.time.begin
		let period = TestConfig.store.test.period
		let remain = Number(period - (Math.floor((Date.now() - begin)/1000)))

		TestData.store.system.time.remaining = remain
		let avg = EntryHandler.f.avg()
		Out.statsTick(avg)
	}

	// Interval timer
	// Keeps running handler.check() unless tdata.remaining <= 0
	this.step = function(complete) {

		parent.check()
		let remain = TestData.store.system.time.remaining
		
		if (remain > 0) {
			// Only log every other second
			if (remain%2 === 0) {
				let avg = EntryHandler.f.avg()
				TestData.store.user.stats.avgs.push(avg)
			}
			Out.user.focus()
		}
		// End
		else {
			complete()
			TestData.store.system.time.timer.stop()
		}

		return
		
	}

}

module.exports = Handler