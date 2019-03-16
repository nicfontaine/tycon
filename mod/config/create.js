(function(){"use strict"})()

const config = require("./config-prototype.js") // Global config for display, and test
const source = require("./../words/source.js")

function create(argv) {

	// Generate default config
	let userConf = new config()

	// Ignore "node" and "app.js"
	let args = argv.slice(2)

	// Has any arguements
	if (args.length) {

		for (var i=0; i<args.length; i++) {

			// Each arg
			let ar = args[i]

			// Number for test length
			if (typeof ar === "number" || !isNaN(ar)) {
				if (ar >= 10 && ar <= 300) {
					userConf.test.period = ar
				}
			}

			// String for difficulty, from source object
			else if (userConf.test.diffOptions.indexOf(ar) > -1) {
				userConf.test.difficulty = userConf.test.diffOptions.indexOf(ar)
			}

			// Don't require correct word before moving to next
			else if (ar === "skip") {
				userConf.test.skip = true
			}

			// Colour Blink mode
			else if (ar === "cb") {
				userConf.display.colourBlind = true
			}

			else if (ar === "caps") {
				userConf.test.caps = true
			}

		}
		
	}

	return userConf

}

module.exports = create