module.exports = async (message) => {
	let usedPrefix = message.guild.settings.get("prefixes").find((p) => {
		return message.content.startsWith(p);
	});
	if (usedPrefix) {
		let pureMessage = message.content.slice(usedPrefix.length);
		let [command, ...args] = pureMessage.split(" ");
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
							`Replica is missing following permissions: ${botMissing.map(
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
							`You are missing following permissions: ${userMissing.map(
								(p) => `\`\`${p}\`\``
							)}`
						)
				);
			}
			commands.get(command).run(message, args);
		}
	}
};
