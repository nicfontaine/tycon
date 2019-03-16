(function(){"use strict"})()

/******************************************************
Create & store unique test config

.store       Stored test config
.create()   Create test config on app run with process.argv
*******************************************************/

const createConfig = require("./config-create.js")

var test = {

	// Unique test config will be stored here
	info: {},
	
	// Generate test config from args, and store in info{}
	create: function(args) {
		test.store = createConfig(args)
	}

}

module.exports = test