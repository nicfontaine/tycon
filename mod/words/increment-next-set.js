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
	let len = src.length

	let i = 0

	for (i; i<max; i++) {

		if (TestData.store.user.index >= len) {
			TestData.store.user.index = 0
		}

		let word = src[TestData.store.user.index].replace(/(\r\n|\n|\r)/gm,"")

		// Caps flag is on. First-caps random words, scale randomness w/ difficulty
		if (TestConfig.store.test.caps) {
			word = randomCaps(word)
		}

		set.push(word)

		TestData.store.user.index++

	}

	return set

}

module.exports = next