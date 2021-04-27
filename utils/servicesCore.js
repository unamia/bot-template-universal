const events = require("events");
const fs = require("fs");
module.exports = async () => {
	let services = new Map(
		fs
			.readdirSync("../services")
			.map((s) => [
				s.split(".").slice(0, -1).join(""),
				require("../services/" + s),
			])
	);

	services.forEach(async (_name, smodule) => {
		if (smodule.ticking) {
			setInterval(smodule.tick, smodule.tickInterval);
			setImmediate(smodule.tick());
		}
	});
};
