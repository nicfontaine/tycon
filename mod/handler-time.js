const out = require("./out.js") // Console output
const SystemWordHandler = require("./system/word-handler.js")

function handler() {

	let parent = this
	
	// Calculate time remaining & show tick stats
	this.check = function(tdata, udata, uconf, uhandler) {
		tdata.remaining = Number(tdata.testLen - (Math.floor((Date.now() - tdata.begin)/1000)))
		let avg = uhandler.avg(udata, tdata.testLen, tdata.remaining)
		out.statsTick(tdata.remaining, avg, uconf)
	}

	// Interval timer
	// Keeps running handler.check() unless tdata.remaining <= 0
	// Print system text, log avg, and print user text
	this.step = function(tdata, udata, uconf, uhandler, complete) {

		parent.check(tdata, udata, uconf, uhandler)
		
		if (tdata.remaining > 0) {
			out.system.words(SystemWordHandler.format)
			// Only log every other second
			if (tdata.remaining%2 === 0) {
				let avg = uhandler.avg(udata, tdata.testLen, tdata.remaining)
				udata.stats.log.wpmArray.push(avg)
			}
			out.user.current(udata.current)
		}
		// End
		else {
			complete()
			tdata.timer.stop()
		}

		return
		
	}

}

module.exports = handler
