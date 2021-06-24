exports.run = async (message, args) => {
	if (!config.admins.includes(message.author.id)) {
		return;
	}
	let [structName, ...structTemplate] = args;
	try {
		structTemplate = JSON.parse(structTemplate.join(""));
	} catch (e) {
		message.inlineReply("Struct content must be JSON!");
	}
	let inserted = await db
		.collection("structures")
		.findOneAndUpdate(
			{ name: structName },
			{ $set: { template: structTemplate } },
			{ upsert: true }
		);
	await db.collection(structName).updateMany({}, { $set: structTemplate });
	message.inlineReply(
		new Discord.MessageEmbed().setDescription(
			"```json\n" + JSON.stringify(inserted.value) + "```"
		)
	);
};
exports.userPerms = [];
exports.botPerms = [];
exports.description = `Command that tells about other commands`;
exports.usage = "";
