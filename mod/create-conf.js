const config = require("./config.js") // Global config for display, and test
const source = require("./source.js")

function proc(argv) {

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
			else if (ar in source) {
				userConf.test.difficulty = ar
			}

			// Don't require correct word before moving to next
			else if (ar === "skip") {
				userConf.test.retypeOnFail = false
			}

		}
		
	}

	return userConf

}

module.exports = proc