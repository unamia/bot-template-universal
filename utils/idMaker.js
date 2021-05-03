module.exports = (idType) =>
	idType +
	"-" +
	Date.now().toString(32).replace(".", "-") +
	Math.random().toString(32).replace(".", "-");
