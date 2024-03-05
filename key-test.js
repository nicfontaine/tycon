const keypress = require("keypress")
process.stdout.write("\033c")

keypress(process.stdin)
if (process.stdin.setRawMode) process.stdin.setRawMode(true)

process.stdin.addListener("keypress", function(ch, key) {
	console.log("key: " + JSON.stringify(key))
	console.log("ch: " + ch)
	if (key && key.ctrl && key.name == 'c') {
	    process.stdin.pause();
	  }
})
process.stdin.resume()