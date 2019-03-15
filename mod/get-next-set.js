const source = require("./source.js") // Source text
const randomCaps = require("./random-caps.js")

var next = function(uconf, max) {

	let difficulty = uconf.test.difficulty

	let set = []

	let numSave = 0

	for (var i=0; i<max; i++) {

		let num = Math.floor((Math.random() * source[difficulty].length))

		// Re-randomize if same as last number
		if (num === numSave) {
			num = Math.floor((Math.random() * source[difficulty].length))
		}
		
		let word = source[difficulty][num]

		// Caps flag is on. First-caps random words, scale randomness w/ difficulty
		if (uconf.test.caps) {
			word = randomCaps(uconf, word)
		}

		set.push(word)

		numSave = num

	}

	return set

}

module.exports = next