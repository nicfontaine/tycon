(function(){"use strict"})()

/******************************************************
*******************************************************/

const TestConfig = require("./../config/test-config.js")
const chalk = require("chalk") // Console text styling
// TestConfig.create(process.argv)

var config = {

	colour: {

		// String value for positive colour. Green or Blue
		// (NOTE) replace with colour based on colour blind arg
		success: "green",

		// Hold the currently used colour
		// (NOTE) replace with colour from success
		current: chalk.bold["green"]

	},

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
	wordSet: []

}

// console.log(config.colour.current("foo"))
module.exports = config