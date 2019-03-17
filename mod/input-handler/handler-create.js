(function(){"use strict"})()

const handler = require("./handler-prototype.js") // Global config for display, and test

function create() {

	// Generate default config
	let inputHandler = new handler()

	return inputHandler

}

module.exports = create