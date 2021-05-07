const fs = require("fs");
const path = require("path");
module.exports = async () => {
	let services = new Map(
		fs
			.readdirSync(path.join(__dirname, "../services"))
			.map((s) => [
				s.split(".").slice(0, -1).join(""),
				require(path.join(__dirname, "../services", s)),
			])
	);

	services.forEach(async (_name, smodule) => {
		if (smodule.ticking) {
			setInterval(smodule.tick, smodule.tickInterval);
			setImmediate(smodule.tick());
		}
	});
};
