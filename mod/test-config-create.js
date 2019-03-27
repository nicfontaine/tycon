(function(){"use strict"})()

const source = require("./words/source.js")

function create(argv, config) {

	// Generate default config
	let testConf = new config()

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
					testConf.test.period = ar
				}
			}

			// String for difficulty, from source object
			else if (testConf.test.diffOptions.indexOf(ar) > -1) {
				testConf.test.difficulty = testConf.test.diffOptions.indexOf(ar)
			}

			// Don't require correct word entry before moving to next
			else if (ar === "skip") {
				testConf.test.skip = true
			}

			// Colour Blink mode
			else if (ar === "cb") {
				testConf.display.colourBlind = true
				testConf.display.colour.good = testConf.display.colour.cb
			}

			// Random first-caps mode
			else if (ar === "caps") {
				testConf.test.caps = true
			}

		}
		
	}

	return testConf

}

module.exports = create