(function(){"use strict"})()

const inquirer = require("inquirer")

/*
period             5-300 seconds
source             easy, med, hard, custom
colour-blind       true false
require correct    true false
caps               true false
*/

module.exports = [

	{
	  type: "list",
	  name: "period",
	  message: "Test Length (seconds)",
	  choices: ["10", "30", "60", "120", "180"],
	  default: "60",
		filter: function(val) {
      return Number(val)
    }
	},

	{
    type: "list",
    name: "source",
    message: "Word Source",
    choices: ["Easy", "Med", "Hard", "Custom"],
    default: "Med",
    filter: function(val) {
      return val.toLowerCase();
    }
	},

  {
    type: "confirm",
    name: "colourBlind",
    message: "Colour Blind Mode",
    default: false
	},

	{
    type: "confirm",
    name: "requireCorrect",
    message: "Require Correct Word",
    default: false
	},

	{
    type: "confirm",
    name: "caps",
    message: "Randomly Capitalize First Letter (scales with difficulty)",
    default: false
	},

]