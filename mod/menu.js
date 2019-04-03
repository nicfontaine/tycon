(function(){"use strict"})()

const inquirer = require("inquirer")

/*
period             5-300 seconds
source             easy, med, hard, custom
require correct    true false
colour-blind       true false
caps               true false
*/

const Menu = {

	main: [

		{
		  type: "list",
		  name: "period",
		  message: "Test Length (seconds)",
		  choices: ["10", "30", "60", "120", "180"],
		  default: "60"
		},

		{
	    type: "list",
	    name: "difficulty",
	    message: "Word Difficulty",
	    choices: ["easy", "med", "hard"],
	    default: "med"
		},

		{
	    type: "confirm",
	    name: "flags",
	    message: "Additional Test Settings...",
	    default: false
		}		

	],

	flags: [

		{
	    type: "confirm",
	    name: "requireCorrect",
	    message: "Require Correct Word",
	    default: false
		},

	  {
	    type: "confirm",
	    name: "colourBlind",
	    message: "Colourblind Mode",
	    default: false
	  },

		{
	    type: "confirm",
	    name: "caps",
	    message: "First-Caps Mode (scales with difficulty)",
	    default: false
		},

		{
	    type: "confirm",
	    name: "showTime",
	    message: "Display Time During Test",
	    default: true
		},

		{
	    type: "confirm",
	    name: "showAvg",
	    message: "Display Average During Test",
	    default: true
		}

	]

}

module.exports = Menu