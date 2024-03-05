(function(){"use strict"})()

const chalk = require("chalk")

const TestConfig = require("./test-config.js")
const TestData = require("./test-data.js")

const Manager = {

	styles: {
		good: chalk.bold,
		success: chalk.reset.bold.inverse,
		bad: chalk.bold
	},

	f: {
		good: function() {
			TestData.store.system.colour.current = Manager.styles.good[TestConfig.store.display.colour.good]
		},
		success: function() {
			TestData.store.system.colour.current = Manager.styles.success[TestConfig.store.display.colour.good]
		},
		bad: function() {
			TestData.store.system.colour.current = Manager.styles.bad[TestConfig.store.display.colour.bad]
		}
	}

}

module.exports = Manager