const config = require("./config.js") // Global config for display, and test

function proc(argv) {

	let userConf = new config()

	// Has any arguements
	if (argv.length > 2) {
		let args = argv.slice(2)
		for (var i=0; i<args.length; i++) {
			let ar = args[i]
			// Number for length
			if (typeof ar === "number" || !isNaN(ar)) {
				if (ar >= 10 && ar <= 300) {
					userConf.test.period = ar
				}
			}
			// String for difficulty
			else if (ar === "easy" || ar === "med" || ar === "hard") {
				userConf.test.difficulty = ar
			}
		}
	}

	return userConf

}

module.exports = proc