// Global config variables
function config() {

	this.display = {
		maxWordsPerLine: 5, // Test prompt words to display in single line
		showAvg: true, // Flag to show or hide Avg WPM during test
		colourBlind: false // 
	}

	this.test = {
		period: 60, // In seconds
		difficulty: "med", // easy med hard
		retypeOnFail: true // If true, force correct entry before next word
	}

}

module.exports = config