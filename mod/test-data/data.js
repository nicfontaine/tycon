(function(){"use strict"})()

/******************************************************
Create & store unique test data

.store       Stored test data
.create()    Create test data
*******************************************************/

const createData = require("./data-create.js")

var test = {

	// Unique test config will be stored here
	store: {},
	
	// Generate test config from args, and store in store{}
	create: function() {
		test.store = createData()
	}

}

module.exports = test