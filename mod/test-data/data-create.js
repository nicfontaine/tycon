(function(){"use strict"})()

const data = require("./data-prototype.js") // Global config for display, and test

function create() {

	// Generate default config
	let testConf = new data()

	return testConf

}

module.exports = create