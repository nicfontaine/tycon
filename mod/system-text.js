const chalk = require("chalk") // Console text styling
const source = require("./source.js") // Source text
const out = require("./out.js") // Console output

var data = function(uConf) {

	let difficulty = uConf.test.difficulty
	let maxWordsPerLine = uConf.display.maxWordsPerLine
	let colourBlind = uConf.display.colourBlind

	// String value for positive colour. Green or Blue
	let successColour = colourBlind ? "blue" : "green"

	let obj = {
		
		// Key input to ignore when typing
		reject: ["undefined", "escape", "tab", "left", "right", "up", "down", "pageup", "pagedown", "home", "end"],

		// Good/Bad State for "active" word, and incorrect word entry
		colours: {
			good: function() {
				obj.colours.c = chalk.bold[successColour]
			},
			success: function() {
				obj.colours.c = chalk.reset.bold.inverse[successColour]
			},
			bad: function() {
				obj.colours.c = chalk.bold.red
			},
			c: chalk.bold[successColour]
		},

		// Max for set, and for width of console line
		max: maxWordsPerLine,

		// Holds words to be typed by user
		array: [],

		// rm word when typed correctly, and push one to end
		next: function(remain, prevAvg) {
			obj.array.shift()
			let len = source[difficulty].length
			let word = source[difficulty][Math.floor((Math.random() * len))]
			if (obj.array.indexOf(word) > -1) {
				word = source[difficulty][Math.floor((Math.random() * len))]
			}
			obj.array.push(word)
			return obj.format
			// out.next(remain, prevAvg, )
		},

		// Generate set of words
		// (Note) should randomly first-caps, with scaling frequency for difficulty
		newSet: function() {
			obj.array = []
			let numSave = 0
			for (var i=0; i<obj.max; i++) {
				let num = Math.floor((Math.random() * source[difficulty].length))
				// Re-randomize if same as last number
				if (num === numSave) {
					num = Math.floor((Math.random() * source[difficulty].length))
				}
				let word = source[difficulty][num]
				obj.array.push(word)
				numSave = num
			}

		},

		// Format Text.system.array, word array, for string output
		format: function() {
			let out = ""
			for (var i=0; i<obj.array.length; i++) {
				// Style active word
				if (i === 0) {
					out += obj.colours.c(obj.array[i]) + " "
				}
				// Fade last word
				else if (i === obj.max - 1) {
					out += chalk.gray(obj.array[i])
				}
				else {
					out += obj.array[i] + " "
				}
			}
			return out
		}

	}

	return obj
}

module.exports = data
