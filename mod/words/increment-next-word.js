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

	let len = src.length

	if (TestData.store.user.index >= len) {
		TestData.store.user.index = 0
	}

	// remove any newline characters
	word = src[TestData.store.user.index].replace(/(\r\n|\n|\r)/gm,"")

	// Caps flag is on. First-caps random words, scale randomness w/ difficulty
	if (TestConfig.store.test.caps) {
		word = randomCaps(word)
	}

	TestData.store.user.index++

	return word

}

module.exports = next