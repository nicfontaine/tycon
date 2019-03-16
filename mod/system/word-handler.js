(function(){"use strict"})()

/******************************************************

*******************************************************/

const chalk = require("chalk") // Console text styling
const source = require("./../words/source.js") // Source text
const SystemConfig = require("./system-config.js")
const TestConfig = require("./../test-config/config.js")
const getNextWord = require("./../words/get-next-word.js")
const getNextSet = require("./../words/get-next-set.js")

var handler = {

	// Good/Bad State for "active" word, and incorrect word entry
	colours: {
		good: function() {
			SystemConfig.colour.current = chalk.bold[TestConfig.store.display.colours.good]
		},
		success: function() {
			SystemConfig.colour.current = chalk.reset.bold.inverse[TestConfig.store.display.colours.good]
		},
		bad: function() {
			SystemConfig.colour.current = chalk.bold[TestConfig.store.display.colours.bad]
		}
	},

	// rm word when typed correctly, and push one to end
	next: function() {

		SystemConfig.wordSet.shift()
		let word = getNextWord(SystemConfig.wordSet, TestConfig.store)
		SystemConfig.wordSet.push(word)
		return handler.format

	},

	// Generate set of words
	// (Note) should randomly first-caps, with scaling frequency for difficulty
	newSet: function() {

		SystemConfig.wordSet = getNextSet(TestConfig.store, TestConfig.store.display.maxWordsPerLine)

	},

	// Format SystemConfig.wordSet, word array, for string output
	format: function() {
		let out = ""
		for (var i=0; i<SystemConfig.wordSet.length; i++) {
			// Style active word
			if (i === 0) {
				out += SystemConfig.colour.current(SystemConfig.wordSet[i]) + " "
			}
			// Fade last word
			else if (i === TestConfig.store.display.maxWordsPerLine - 1) {
				out += chalk.gray(SystemConfig.wordSet[i])
			}
			else {
				out += SystemConfig.wordSet[i] + " "
			}
		}
		return out
	}

}

module.exports = handler