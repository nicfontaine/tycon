(function(){"use strict"})()

module.exports = {

	name: "Tycon",

	menu: {
		options: ["Run Test", "Settings"],
		optionsDefault: "Run Test"
	},

	display: {
		colour: {
			good: "green",
			bad: "red",
			goodCB: "blue",
			gray: "gray"
		},
		maxWordsPerLine: 5,
		// Line printout y placement
		lines: {
			test: {
				header: 0,
				stats: 1,
				words: 3,
				user: 4
			}
		}
	},

	test: {
		
		modeOptions: ["basic", "sentence"],
		modeDefault: "basic",

		diffOptions: ["easy", "med", "hard"],
		diffDefault: "med",
		
		periodOptions: [
			{value: 10, name: "10"},
			{value: 30, name: "30"},
			{value: 60, name: "60"},
			{value: 120, name: "120"},
			{value: 180, name: "180"},
			{value: Infinity, name: "endless"}
		],
		flagOptions: {
			correct: "Require Correct Word",
			cb: "Colourblind Mode",
			caps: "Random First Caps"
			// time: "Display Time Remaining During Test",
			// avg: "Display Average During Test"
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
		],
		num: [
			"0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
		]

	}

}