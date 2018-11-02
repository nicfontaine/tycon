module.exports = function (num) {
	num = num.toString()
	num = num.length < 2 ? "0" + num : num
	return num
}