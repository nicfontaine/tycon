(function(){"use strict"})()

/******************************************************

*******************************************************/

const chalk = require("chalk") // Console text styling
const source = require("./../words/source.js") // Source text
const TestConfig = require("./../test-config/config.js")
const getNextWord = require("./../words/get-next-word.js")
const getNextSet = require("./../words/get-next-set.js")
const TestData = require("./../test-data/data.js")

var handler = {

	// Good/Bad State for "active" word, and incorrect word entry
	colours: {
		good: function() {
			TestData.store.system.colour.current = chalk.bold[TestConfig.store.display.colour.good]
		},
		success: function() {
			TestData.store.system.colour.current = chalk.reset.bold.inverse[TestConfig.store.display.colour.good]
		},
		bad: function() {
			TestData.store.system.colour.current = chalk.bold[TestConfig.store.display.colour.bad]
		}
	},

	// rm word when typed correctly, and push one to end
	next: function() {

		TestData.store.system.wordSet.shift()

		let word = getNextWord()
		TestData.store.system.wordSet.push(word)
		return handler.format

	},

	// Generate set of words
	newSet: function() {

		TestData.store.system.wordSet = getNextSet(TestConfig.store)

	},

	// Format TestData.store.system.wordSet, word array, for string output
	format: function() {
		let out = ""
		// console.log(TestData.store.system.colour.current)
		let colour = TestData.store.system.colour.current
		for (var i=0; i<TestData.store.system.wordSet.length; i++) {
			// Style active word
			if (i === 0) {
				// (NOTE) should be using TestData.store.system.colour.current but not working
				out += colour(TestData.store.system.wordSet[i]) + " "
			}
			// Fade last word
			else if (i === TestConfig.store.display.maxWordsPerLine - 1) {
				out += chalk.gray(TestData.store.system.wordSet[i])
			}
			else {
				out += TestData.store.system.wordSet[i] + " "
			}
		}
		return out
	}

}

module.exports = handler