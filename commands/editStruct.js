exports.run = async (message, args) => {
	if (!config.admins.includes(message.author.id)) {
		return;
	}
	let [structName, ...structTemplate] = args;
	structTemplate = JSON.parse(structTemplate.join(""));

	let inserted = await db
		.collection("structures")
		.findOneAndUpdate(
			{ name: structName },
			{ $set: { template: structTemplate } },
			{ upsert: true }
		);
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
