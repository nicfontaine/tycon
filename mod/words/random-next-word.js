const source = require("./../words/source.js") // Source text
const randomCaps = require("./../format/random-caps.js")
const TestConfig = require("./../test-config.js")
const TestData = require("./../test-data.js")

var next = function() {

	let wordSet = TestData.store.system.wordSet
	let difficulty = TestConfig.store.test.difficulty

	let word = ""

	// Get the right index using difficulty number
	src = TestData.store.system.source

	// Grab random word from source
	let len = src.length
	word = src[Math.floor((Math.random() * len))]

	// If same as previous, re-roll ;v
	if (wordSet.indexOf(word) > -1) {
		word = src[Math.floor((Math.random() * len))]
	}

	// Caps flag is on. First-caps random words, scale randomness w/ difficulty
	if (TestConfig.store.test.caps) {
		word = randomCaps(word)
	}

	return word

}

module.exports = next