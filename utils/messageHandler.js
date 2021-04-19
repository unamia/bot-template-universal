module.exports = async (message) => {
	if (message.author.bot) {
		return;
	}
	if (message.guild) {
		let GuildSettings = utils.get("guildSettings");
		message.guild.settings = new GuildSettings(message.guild.id);
		await message.guild.settings.fetch();
		utils.get("commandHandler")(message);
	} else {
	}
};
