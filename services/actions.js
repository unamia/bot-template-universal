exports.ticking = true;
exports = tickInterval = 60000;
exports.tick = async () => {
	db.collection("scheduledActions")
		.find({
			startAt: { $lt: Date.now() + 30000 },
		})
		.forEach(async (a) => {
			action.scheduleAction(
				a.id,
				a.type,
				a.startAt - Date.now() > 0 ? a.startAt - Date.now() : 0
			);
		});
};
