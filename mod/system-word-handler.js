(function(){"use strict"})()

/******************************************************

*******************************************************/

const chalk = require("chalk") // Console text styling
const source = require("./words/source.js") // Source text
const TestConfig = require("./test-config.js")
const getNextWord = require("./words/get-next-word.js")
const getNextSet = require("./words/get-next-set.js")
const TestData = require("./test-data.js")
const InputHandler = require("./input-handler.js")
const ColourManager = require("./colour-manager.js")

var Handler = {

	f: {

		// Remove first word when typed correctly
		// Push new one to end
		next: function() {

			let word = getNextWord()
			TestData.store.system.wordSet.shift()
			TestData.store.system.wordSet.push(word)

		},

		// Generate set of words
		newSet: function() {

			TestData.store.system.wordSet = getNextSet(TestConfig.store)

		}

	},

	// Return formatted word set from TestData.store.system.wordSet
	wordSet: function() {

		let words = ""
		let colour = TestData.store.system.colour.current

		for (var i=0; i<TestData.store.system.wordSet.length; i++) {
			// Style active word
			if (i === 0) {
				words += colour(TestData.store.system.wordSet[i]) + " "
			}
			// Fade last word
			else if (i === TestConfig.store.display.maxWordsPerLine - 1) {
				words += chalk.gray(TestData.store.system.wordSet[i])
			}
			else {
				words += TestData.store.system.wordSet[i] + " "
			}
		}

		return words

	},

	// Return current word, formatted based on correctedness with currently typed
	current: function() {

		// (NOTE) to-do..
		let word = ""
		let colour = TestData.store.system.colour.current
		word += colour(TestData.store.system.wordSet[0])
		
		return word

	}

}

module.exports = Handler