(function(){"use strict"})()

/******************************************************
*******************************************************/

const chalk = require("chalk") // Console text styling

var config = {

	colour: {

		// String value for positive colour. Green or Blue
		// (NOTE) replace with colour based on colour blind arg
		success: "green",

		// Hold the currently used colour
		// (NOTE) replace with colour from success
		current: chalk.bold["green"]

	},

	// Holds words generated, to be typed by user
	wordSet: []

}

module.exports = config