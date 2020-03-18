(function(){"use strict"})()

const LaunchOptions = {
	check: () => {
		let options = process.argv
		let args = options.splice(2)
		let i = 0
		let len = args.len
		for (i; i<len; i++) {
			let arg = args[i]
			if (arg.indexOf("-") === 0) {
				let sub = arg.substr(1)
				// File input
				if (sub === "f") {
					// Read file
				}
			}
		}
	}
}

module.exports = LaunchOptions