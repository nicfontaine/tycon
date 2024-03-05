(function(){"use strict"})()

const inquirer = require("inquirer")
const AppConfig = require("./app-config.js")

/*
mode               basic (random), sentence (increment)
period             # seconds, or infinite
require correct    true false
colour-blind       true false
caps               true false
showTime           true false
showAvg            true false
*/

const Menu = {

	main: [

		{
			type: "list",
			name: "mode",
			message: "Test Mode:",
			choices: AppConfig.test.modeOptions,
			default: AppConfig.test.modeDefault
		},
		
		{
			type: "list",
			name: "options",
			message: "Choose One:",
			default: AppConfig.menu.optionsDefault,
			choices: AppConfig.menu.options
		}

	],

	settings: [

		{
		  type: "list",
		  name: "period",
		  message: "Test Length (seconds):",
		  choices: AppConfig.test.periodOptions,
		  default: 2
		},

		{
	    type: "confirm",
	    name: "settings",
	    message: "Edit Additional Settings...",
	    default: false
		}		

	],

	fileSettings: [
		
		{
		  type: "list",
		  name: "period",
		  message: "Test Length (seconds):",
		  choices: AppConfig.test.periodOptions,
		  default: 2
		},

		{
	    type: "confirm",
	    name: "settings",
	    message: "Edit Additional Settings...",
	    default: false
		}

	],

	fileSubSettings: [

		{
	    type: "confirm",
	    name: "requireCorrect",
	    message: AppConfig.test.flagOptions.correct,
	    default: false
		},

	  {
	    type: "confirm",
	    name: "colourBlind",
	    message: AppConfig.test.flagOptions.cb,
	    default: false
	  },

		{
	    type: "confirm",
	    name: "caps",
	    message: AppConfig.test.flagOptions.caps,
	    default: false
		}

	],

	subSettings: [

		{
	    type: "list",
	    name: "difficulty",
	    message: "Word Difficulty (basic mode only)",
	    choices: AppConfig.test.diffOptions,
	    default: AppConfig.test.diffDefault
		},

		// {
		// 	type: "checkbox",
		// 	name: "flags",
		// 	message: "Test Settings",
		// 	choices: [
		// 		{name: "Require Correct Word"},
		// 		{name: "Colourblind Mode"},
		// 		{name: "Random First Caps"}
		// 	]
		// }

		{
	    type: "confirm",
	    name: "requireCorrect",
	    message: AppConfig.test.flagOptions.correct,
	    default: false
		},

	  {
	    type: "confirm",
	    name: "colourBlind",
	    message: AppConfig.test.flagOptions.cb,
	    default: false
	  },

		{
	    type: "confirm",
	    name: "caps",
	    message: AppConfig.test.flagOptions.caps,
	    default: false
		}

		// {
	 //    type: "confirm",
	 //    name: "showTime",
	 //    message: AppConfig.test.flagOptions.time,
	 //    default: true
		// },

		// {
	 //    type: "confirm",
	 //    name: "showAvg",
	 //    message: AppConfig.test.flagOptions.avg,
	 //    default: true
		// }

	]

}

module.exports = Menu
