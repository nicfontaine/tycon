const source = require("./../words/source.js") // Source text
const randomCaps = require("./../format/random-caps.js")
const TestConfig = require("./../test-config.js")
const TestData = require("./../test-data.js")

var next = function() {

	let difficulty = TestConfig.store.test.difficulty

	let set = []

	// let numSave = 0
	let max = TestConfig.store.display.maxWordsPerLine

	let mode = TestConfig.store.test.mode
	let src = TestData.store.system.source

	// (NOTE) Re-enable when we have more than 1 simple test option
	// Get the right index using difficulty number
	// src = src[difficulty]

	// Should be 0 when initialized, but in case this is called again, we'll start where we left off.
	let i = TestData.store.user.index

	for (i; i<max; i++) {

		let word = src[i]

		// Caps flag is on. First-caps random words, scale randomness w/ difficulty
		if (TestConfig.store.test.caps) {
			word = randomCaps(word)
		}

		set.push(word)

	}

	// Record index
	TestData.store.user.index = i

	return set

}

module.exports = next