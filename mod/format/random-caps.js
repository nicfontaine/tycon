const TestConfig = require("./../test-config.js")

var ran = function(word) {

	let difficulty = TestConfig.store.test.difficulty

	let randomMax = TestConfig.store.test.diffOptions.length*3 + 1
	let diffRandom = Math.floor((Math.random() * randomMax))
	if (diffRandom < difficulty+1) {
		word = word[0].toUpperCase() + word.slice(1)
	}

	return word

}

module.exports = ran