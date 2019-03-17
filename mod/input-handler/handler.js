(function(){"use strict"})()

/******************************************************
Create & store unique test config

.store       Stored test config
.create()   Create test config on app run with process.argv
*******************************************************/

const createHandler = require("./handler-create.js")

var handler = {

	// Unique test config will be stored here
	f: {},
	
	// Generate test config from args, and store in info{}
	create: function() {
		handler.f = createHandler()
	}

}

module.exports = handler