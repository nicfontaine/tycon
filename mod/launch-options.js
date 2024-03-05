(function(){"use strict"})()

const fs = require("fs-then")
const path = require("path")

const TestConfig = require("./test-config.js")
const source = require("./words/source.js")

const LaunchOptions = {

	// Store read file contents
	source: undefined,

	check: () => {
		let options = process.argv
		let args = options.splice(2)
		return new Promise((resolve, reject) => {
			(async function() {
				// Hold file reference, if valid
				// var file = undefined
				let i = 0
				for (let arg of args) {
					if (arg.indexOf("-") === 0) {
						let sub = arg.substr(1)

						// File input
						if (sub === "f") {
							let f = args[i+1]
							if (f !== undefined) {
								// Read file
									const reader = await fs.readFile(f, "utf8")
									.then(content => {
										// Set flag, from "sentence" or "basic", to know which source to use
										TestConfig.store.test.mode = "file"
										// Store file content
										source.file = content
										resolve()
										return
									}, err => { reject("Error reading launch file: " + f) })
							}
						}
						
					}
					i++
				}
				// End of loop, and no valid file arg
				resolve()
			})()
		})
		.catch(err => {
			console.log(err)
		})
	}

}

module.exports = LaunchOptions
