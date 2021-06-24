module.exports = async (message) => {
	let usedPrefix = [
		...(message.guild.settings.get("prefixes") || []),
		config.permanentPrefix,
		`<@${client.user.id}>`,
		`<@!${client.user.id}>`,
		`<@${client.user.id}> `,
		`<@!${client.user.id}> `,
	].find((p) => {
		return message.content.startsWith(p);
	});
	console.log(message.content, `<!@${client.user.id}>`);
	if (usedPrefix) {
		console.log(message.content);
		let pureMessage = message.content.slice(usedPrefix.length).trim();
		let [commandName, ...args] = pureMessage.split(" ").filter((x) => x !== "");
		let command = utils.get("getCommand")(commandName, null);
		if (!command) {
			return;
		}
		await message.author.data.fetch();
		await message.member.data.fetch();
		await message.guild.data.fetch();
		utils.get("spawnCommand")(command, args, message);
	}
};
