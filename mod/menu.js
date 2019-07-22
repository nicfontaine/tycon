(function(){"use strict"})()

const inquirer = require("inquirer")
const AppConfig = require("./app-config.js")

/*
period             5-300 seconds
source             easy, med, hard, custom
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
		  name: "period",
		  message: "Test Length (seconds)",
		  choices: AppConfig.test.periodOptions,
		  default: "60"
		},

		{
			type: "list",
			name: "mode",
			message: "Test Mode",
			choices: AppConfig.test.modeOptions,
			default: AppConfig.test.modeDefault
		},
		
		{
	    type: "confirm",
	    name: "settings",
	    message: "Edit Additional Settings...",
	    default: false
		}		

	],

	settings: [


		{
	    type: "list",
	    name: "difficulty",
	    message: "Word Difficulty",
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
		// 		{name: "Random First Caps"},
		// 		{name: "Display Time Remaining During Test", checked: true},
		// 		{name: "Display Average During Test", checked: true}
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
		},

		{
	    type: "confirm",
	    name: "showTime",
	    message: AppConfig.test.flagOptions.time,
	    default: true
		},

		{
	    type: "confirm",
	    name: "showAvg",
	    message: AppConfig.test.flagOptions.avg,
	    default: true
		}

	]

}

module.exports = Menu