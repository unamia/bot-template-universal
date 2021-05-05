let fs = require("fs");
class ActionManager {
	constructor() {
		this.schedule = new Map();
		this.actions = new Map(
			fs
				.readdirSync("./actions")
				.map((s) => [
					s.split(".").slice(0, -1).join(""),
					require("../actions/" + s),
				])
		);
	}
	add(type, timeout = 0, ...args) {
		let id = utils.get("idMaker")(type);
		if (timeout < 1) {
			return this.execute(id, type, args);
		}
		if (timeout < 40000) {
			return this.scheduleAction(id, type, timeout, ...args);
		}
		db.collection("scheduledActions").insertOne({
			type,
			id,
			args,
			startAt: Date.now() + timeout,
		});
	}
	scheduleAction(id, type, timeout, ...args) {
		this.schedule.set(
			id,
			setTimeout(() => this.execute(id, type, args), timeout)
		);
	}
	remove(id) {
		db.collection("scheduledActions")
			.deleteOne({ id })
			.then(() => {
				clearTimeout(this.schedule.get(id));
				this.schedule.delete(id);
			});
	}
	execute(id, type, args) {
		db.collection("action-logs").insertOne({
			id,
			log: this.actions.get(type)(...args),
		});
		this.removeAction(id);
	}
}
module.exports = ActionManager;
