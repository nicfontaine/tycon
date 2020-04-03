(function(){"use strict"})()

/******************************************************

*******************************************************/

const chalk = require("chalk") // Console text styling
const source = require("./words/source.js") // Source text
const TestConfig = require("./test-config.js")

const randomNextWord = require("./words/random-next-word.js")
const randomNextSet = require("./words/random-next-set.js")
const incrementNextWord = require("./words/increment-next-word.js")
const incrementNextSet = require("./words/increment-next-set.js")

const TestData = require("./test-data.js")
const ColourManager = require("./colour-manager.js")
const LaunchOptions = require("./launch-options.js")

var Handler = {}

module.exports = Handler

const InputHandler = require("./input-handler.js")

Handler.f = {

	getSource: function() {

		let mode = TestConfig.store.test.mode
		let diff = TestConfig.store.test.difficulty
		let src = undefined

		if (mode === "basic") {

			src = source[mode][diff]

		}

		else if (mode === "sentence") {

			// Get a random index from the sentence array
			let len = source[mode].length
			let ran = Math.floor(Math.random() * len)
			src = source[mode][ran].replace(/\s\s+/g, " ")
			src = src.split(" ")

		}

		// Valid launch option flag was detected. Use file content
		else if (mode === "file") {

			if (source.file !== undefined) {
				src = source.file.replace(/\s\s+/g, " ")
				src = src.split(" ")
			}
			else {
				console.log("LaunchOptions.content is undefined")
			}

		}

		TestData.store.system.source = src

	},

	// For basic (random) mode. Create random set of words, and get random during test
	basic: {
		
		// Generate set of words
		newSet: function() {

			TestData.store.system.wordSet = randomNextSet()

		},

		// Remove first word when typed correctly
		// Push new one to end
		next: function() {

			let word = randomNextWord()
			TestData.store.system.wordSet.shift()
			TestData.store.system.wordSet.push(word)

		}

	},

	// For sentence (increment) mode. Get set limited to max, then increment through indices
	sentence: {

		newSet: function() {

			TestData.store.system.wordSet = incrementNextSet()

		},

		next: function() {
			let word = incrementNextWord()
			TestData.store.system.wordSet.shift()
			TestData.store.system.wordSet.push(word)
		}

	},

	file: {

		newSet: function() {

			TestData.store.system.wordSet = incrementNextSet()

		},

		next: function() {
			let word = incrementNextWord()
			TestData.store.system.wordSet.shift()
			TestData.store.system.wordSet.push(word)
		}

	}

}

// Return formatted word set from TestData.store.system.wordSet
Handler.wordSet = function() {

	let words = ""
	let colour = TestData.store.system.colour.current

	for (var i=0; i<TestData.store.system.wordSet.length; i++) {
		// Style active word
		if (i === 0) {
			words += colour(TestData.store.system.wordSet[i]) + " "
		}
		// Fade last word
		else if (i === (TestConfig.store.display.maxWordsPerLine - 1)) {
			words += chalk.gray(TestData.store.system.wordSet[i])
		}
		else {
			words += TestData.store.system.wordSet[i] + " "
		}
	}

	return words

}

// Return current word, formatted based on correctedness with currently typed
Handler.current = function() {

	// (NOTE) to-do..
	let word = ""
	let colour = TestData.store.system.colour.current
	word += colour(TestData.store.system.wordSet[0])
	
	return word

}