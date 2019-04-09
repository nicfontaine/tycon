(function(){"use strict"})()

module.exports = {

	name: "Tycon",

	display: {
		colour: {
			good: "green",
			bad: "red",
			goodCB: "blue"
		}
	},

	test: {
		diffOptions: ["easy", "med", "hard"],
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
		]
	}

}