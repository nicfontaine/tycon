(function(){"use strict"})()

module.exports = {

	name: "Tycon",

	display: {
		colour: {
			good: "green",
			bad: "red",
			goodCB: "blue"
		},
		maxWordsPerLine: 5
	},

	test: {
		
		// (NOTE) placeholder. Will add options later.
		modeOptions: ["basic", "sentence"],
		modeDefault: "basic",

		diffOptions: ["easy", "med", "hard"],
		diffDefault: "med",
		periodOptions: ["10", "30", "60", "120", "180"],
		flagOptions: {
			correct: "Require Correct Word",
			cb: "Colourblind Mode",
			caps: "Random First Caps",
			time: "Display Time Remaining During Test",
			avg: "Display Average During Test"
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
		// Punctuation characters
		punc: [
			",",
			".",
			"?",
			"!",
			"-",
			"_",
			"/",
			"&",
			"'",
			'"'
		]
	}

}