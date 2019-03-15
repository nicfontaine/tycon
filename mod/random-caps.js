var ran = function(uconf, word) {

	let difficulty = uconf.test.difficulty

	let randomMax = uconf.test.diffOptions.length*3 + 1
	let diffRandom = Math.floor((Math.random() * randomMax))
	if (diffRandom < difficulty+1) {
		word = word[0].toUpperCase() + word.slice(1)
	}

	return word

}

module.exports = ran