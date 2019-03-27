const source = require("./../words/source.js") // Source text
const randomCaps = require("./../format/random-caps.js")
const TestConfig = require("./../test-config.js")
const TestData = require("./../test-data.js")

var next = function() {

	let wordSet = TestData.store.system.wordSet
	let difficulty = TestConfig.store.test.difficulty

	// Grab random word from source
	let len = source[difficulty].length
	let word = source[difficulty][Math.floor((Math.random() * len))]

	// If same as previous, re-roll ;v
	if (wordSet.indexOf(word) > -1) {
		word = source[difficulty][Math.floor((Math.random() * len))]
	}

	// Caps flag is on. First-caps random words, scale randomness w/ difficulty
	if (TestConfig.store.test.caps) {
		word = randomCaps(word)
	}

	return word

}

module.exports = next