module.exports = async function spawnCommand(command, args, message) {
	let [nextCommand, ...nextArgs] = args;
	let nextModule = utils.get("getCommand")(nextCommand, command.id);
	if (nextModule) {
		return spawnCommand(nextModule, nextArgs, message);
	}
	let botMissing = message.guild.me.permissions.missing(command.botPerms || []);
	let userMissing = message.member.permissions.missing(command.userPerms || []);
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
};
