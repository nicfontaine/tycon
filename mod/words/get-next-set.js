const source = require("./../words/source.js") // Source text
const randomCaps = require("./../format/random-caps.js")
const TestConfig = require("./../test-config/config.js")

var next = function() {

	let difficulty = TestConfig.store.test.difficulty

	let set = []

	let numSave = 0
	let max = TestConfig.store.display.maxWordsPerLine

	for (var i=0; i<max; i++) {

		let num = Math.floor((Math.random() * source[difficulty].length))

		// Re-randomize if same as last number
		if (num === numSave) {
			num = Math.floor((Math.random() * source[difficulty].length))
		}
		
		let word = source[difficulty][num]

		// Caps flag is on. First-caps random words, scale randomness w/ difficulty
		if (TestConfig.store.test.caps) {
			word = randomCaps(word)
		}

		set.push(word)

		numSave = num

	}

	return set

}

module.exports = next