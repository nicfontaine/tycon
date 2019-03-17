const out = require("./out.js") // Console output
const SystemWordHandler = require("./system/word-handler.js")
const TestData = require("./test-data/data.js")
const TestConfig = require("./test-config/config.js")
const InputHandler = require("./input-handler/handler.js")

function handler() {

	let parent = this
	
	// Calculate time remaining & show tick stats
	this.check = function() {

		let begin = TestData.store.system.time.begin
		let period = TestConfig.store.test.period
		let remain = Number(period - (Math.floor((Date.now() - begin)/1000)))

		TestData.store.system.time.remaining = remain
		let avg = InputHandler.f.avg()
		out.statsTick(avg)
	}

	// Interval timer
	// Keeps running handler.check() unless tdata.remaining <= 0
	// Print system text, log avg, and print user text
	this.step = function(complete) {

		parent.check()
		let remain = TestData.store.system.time.remaining
		
		if (remain > 0) {
			out.system.words()
			// Only log every other second
			if (remain%2 === 0) {
				let avg = InputHandler.f.avg()
				TestData.store.user.stats.avgs.push(avg)
			}
			out.user.current()
		}
		// End
		else {
			complete()
			TestData.store.system.time.timer.stop()
		}

		return
		
	}

}

module.exports = handler
