const source = require("./../words/source.js") // Source text
const randomCaps = require("./../format/random-caps.js")
const TestConfig = require("./../test-config.js")
const TestData = require("./../test-data.js")

var next = function() {

	let wordSet = TestData.store.system.wordSet
	let difficulty = TestConfig.store.test.difficulty
	let mode = TestConfig.store.test.mode
	let src = TestData.store.system.source

	let word = ""

	// Get the right index using difficulty number
	// src = src[difficulty]

	let len = src.length
	let i = TestData.store.user.index
	if (i >= len) {
		i = 0
	}

	word = src[i]

	i++
	TestData.store.user.index = i

	// Caps flag is on. First-caps random words, scale randomness w/ difficulty
	if (TestConfig.store.test.caps) {
		word = randomCaps(word)
	}

	return word

}

module.exports = next