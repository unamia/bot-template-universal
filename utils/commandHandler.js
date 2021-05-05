module.exports = async (message) => {
	let usedPrefix = [
		...(message.guild.settings.get("prefixes") || []),
		config.permanentPrefix,
		`<@${client.user.id}>`,
		`<!@${client.user.id}>`,
		`<@${client.user.id}> `,
		`<!@${client.user.id}>`,
	].find((p) => {
		return message.content.startsWith(p);
	});
	if (usedPrefix) {
		let pureMessage = message.content.slice(usedPrefix.length).trim();
		let [command, ...args] = pureMessage.split(" ").filter((x) => x !== "");
		if (commands.get(command)) {
			let botMissing = message.guild.me.permissions.missing(
				commands.get(command).botPerms
			);
			let userMissing = message.member.permissions.missing(
				commands.get(command).userPerms
			);
			if (botMissing.length > 0) {
				return message.reply(
					new Discord.MessageEmbed()
						.setColor("#364547")
						.setTitle("Error")
						.setDescription(
							`Bot is missing following permissions: ${botMissing.map(
								(p) => `\`\`${p}\`\``
							)}`
						)
				);
			}
			if (userMissing.length > 0) {
				return message.reply(
					new Discord.MessageEmbed()
						.setColor("#364547")
						.setTitle("Error")
						.setDescription(
							`You missing following permissions: ${userMissing.map(
								(p) => `\`\`${p}\`\``
							)}`
						)
				);
			}
			commands.get(command).run(message, args);
		}
	}
};
