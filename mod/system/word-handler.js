(function(){"use strict"})()

/******************************************************

*******************************************************/

const chalk = require("chalk") // Console text styling
const source = require("./words/source.js") // Source text
const SystemConfig = require("./system-config.js")
const TestConfig = require("./../config/test-config.js")
const getNextWord = require("./../words/get-next-word.js")
const getNextSet = require("./../words/get-next-set.js")

var handler = {

	// Good/Bad State for "active" word, and incorrect word entry
	colours: {
		good: function() {
			handler.colours.c = chalk.bold[SystemConfig.colour.success]
		},
		success: function() {
			handler.colours.c = chalk.reset.bold.inverse[SystemConfig.colour.success]
		},
		bad: function() {
			handler.colours.c = chalk.bold.red
		},
		c: chalk.bold[SystemConfig.colour.success]
	},

	// rm word when typed correctly, and push one to end
	next: function() {

		SystemConfig.wordSet.shift()
		let word = getNextWord(SystemConfig.wordSet, TestConfig.info)
		SystemConfig.wordSet.push(word)
		return handler.format

	},

	// Generate set of words
	// (Note) should randomly first-caps, with scaling frequency for difficulty
	newSet: function() {

		SystemConfig.wordSet = getNextSet(TestConfig.info, TestConfig.info.display.maxWordsPerLine)

	},

	// Format SystemConfig.wordSet, word array, for string output
	format: function() {
		let out = ""
		for (var i=0; i<SystemConfig.wordSet.length; i++) {
			// Style active word
			if (i === 0) {
				out += handler.colours.c(SystemConfig.wordSet[i]) + " "
			}
			// Fade last word
			else if (i === TestConfig.info.display.maxWordsPerLine - 1) {
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