(function(){"use strict"})()

/******************************************************
Create & store unique session config

.info       Stored session config
.create()   Create session config on app run with process.argv
*******************************************************/

const createConfig = require("./create.js")

var session = {

	// Unique session config will be stored here
	info: {},
	
	// Generate session config from args, and store in info{}
	create: function(args) {
		session.info = createConfig(args)
	}

}

module.exports = session