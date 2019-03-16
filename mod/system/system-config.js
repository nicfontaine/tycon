(function(){"use strict"})()

/******************************************************
*******************************************************/

const TestConfig = require("./config/test-config.js")

var config = {

	colour: {
		// String value for positive colour. Green or Blue
		success: TestConfig.info.display.colourBlind ? "blue" : "green",
		// Hold the currently used colour
		current: config.colour.success
	},

	// Maximum for set of words, and for width of console line
	max: TestConfig.info.display.maxWordsPerLine,

	// Key input to ignore when typing
	reject: [
		"undefined",
		"escape",
		"tab",
		"left",
		"right",
		"up",
		"down",
		"pageup",
		"pagedown",
		"home",
		"end",
		"delete"
	],

	// Holds words generated, to be typed by user
	wordSet: [],

}

module.exports = config
