const source = require("./source.js") // Source text
const randomCaps = require("./random-caps.js")

var next = function(wordArray, uconf) {

	let difficulty = uconf.test.difficulty

	// Grab random word from source
	let len = source[difficulty].length
	let word = source[difficulty][Math.floor((Math.random() * len))]

	// If same as previous, re-roll ;v
	if (wordArray.indexOf(word) > -1) {
		word = source[difficulty][Math.floor((Math.random() * len))]
	}

	// Caps flag is on. First-caps random words, scale randomness w/ difficulty
	if (uconf.test.caps) {
		word = randomCaps(uconf, word)
	}

	return word

}

module.exports = next